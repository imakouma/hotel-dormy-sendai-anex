import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join } from "path";
import { ChatUnavailableError, generateWithFallback } from "../../../lib/chat-provider";

export const maxDuration = 60;

const SYSTEM_PROMPT_PREFIX = `あなたは「天然温泉 青葉の湯 ドーミーイン仙台ANNEX」の館内案内アシスタントです。
以下のホテル情報を参照し、お客様の質問に丁寧かつ正確に答えてください。
- 館内の基本情報（チェックイン・朝食の時間・料金・温泉・設備など）に加え、「近隣のおすすめ」や「独自の特典」についても、知識ベースに記載された範囲で案内してください。
- 知識ベースに記載されている情報（料金・時間・内容など）は、そのまま具体的に答えてください。料金を聞かれた場合は、記載があれば金額を伝えてください。フロントへ案内するのは、知識ベースに本当に載っていない情報（暗証番号・パスワードなど）を聞かれた場合のみにしてください。
- 回答は簡潔に、必要な情報だけを伝えてください。観光案内の際は松島観光の拠点としての利便性をアピールしてください。

## ホテル情報（参照用）
`;

function loadHotelInfo(): string {
  try {
    const filePath = join(process.cwd(), "data", "hotel-info.md");
    const content = readFileSync(filePath, "utf-8");
    return content;
  } catch (e) {
    console.error("Failed to load hotel-info.md:", e);
    return "（館内情報の読み込みに失敗しました。フロントまでお尋ねください。）";
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    console.error("[Chat API] GEMINI_API_KEY が設定されていません。.env.local を確認してください。");
    return NextResponse.json(
      { error: "APIキーが設定されていません。しばらく経ってからお試しください。" },
      { status: 500 }
    );
  }

  const languageNames: Record<string, string> = {
    ja: "日本語",
    en: "English",
    zh: "简体中文",
    "zh-TW": "繁體中文",
    ko: "한국어",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    it: "Italiano",
    th: "ไทย",
    vi: "Tiếng Việt",
    id: "Bahasa Indonesia",
    pt: "Português",
    tl: "Tagalog",
    ms: "Bahasa Melayu",
  };

  try {
    const body = await request.json().catch(() => null);
    const userMessage = body?.message as string | undefined;
    const language = typeof body?.language === "string" ? body.language : "ja";
    if (typeof userMessage !== "string" || !userMessage.trim() || userMessage.length > 4000) {
      return NextResponse.json(
        { error: "message は1〜4000文字で送信してください。" },
        { status: 400 }
      );
    }

    const responseLang = languageNames[language] || languageNames.ja;
    const hotelInfo = loadHotelInfo();
    const genAI = new GoogleGenerativeAI(apiKey);
    const languageInstruction = `【重要】回答は必ず「${responseLang}」で行ってください。お客様がその言語で質問している場合は、同じ言語で簡潔に答えてください。`;
    const fullPrompt = `${SYSTEM_PROMPT_PREFIX}\n${hotelInfo}\n\n---\n${languageInstruction}\n\n上記のホテル情報を参照して、以下のお客様の質問に答えてください。\n\n【質問】\n${userMessage.trim()}`;

    const model = genAI.getGenerativeModel(
      { model: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite" },
      { timeout: 20000 }
    );
    const reply = await generateWithFallback(fullPrompt, async () => {
      const { response } = await model.generateContent(fullPrompt);
      if (!response.candidates?.length) {
        throw new Error("Gemini returned no answer");
      }
      return response.text() || "申し訳ございません。回答を生成できませんでした。";
    }, language);
    return NextResponse.json({ reply });
  } catch (err) {
    if (err instanceof ChatUnavailableError) {
      return NextResponse.json({ error: err.message, code: "AI_UNAVAILABLE" }, { status: 503 });
    }
    console.error("[Chat API] Chat request failed", {
      status: err && typeof err === "object" && "status" in err ? err.status : undefined,
    });
    return NextResponse.json(
      { error: "チャットの処理中にエラーが発生しました。しばらく経ってからお試しください。" },
      { status: 500 }
    );
  }
}
