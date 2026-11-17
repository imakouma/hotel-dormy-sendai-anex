const unavailableMessages: Record<string, string> = {
  ja: "ただいまAI案内を利用できません。館内案内ページをご覧いただくか、フロントへお問い合わせください。",
  en: "AI assistance is currently unavailable. Please check the hotel guide or contact the front desk.",
  zh: "AI服务暂时无法使用。请查看酒店指南或联系前台。",
  "zh-TW": "AI服務暫時無法使用。請查看飯店指南或聯絡櫃台。",
  ko: "현재 AI 안내를 이용할 수 없습니다. 호텔 안내 페이지를 확인하거나 프런트에 문의해 주세요.",
  fr: "L’assistance IA est momentanément indisponible. Consultez le guide de l’hôtel ou contactez la réception.",
  de: "Die KI-Hilfe ist derzeit nicht verfügbar. Bitte lesen Sie den Hotelführer oder wenden Sie sich an die Rezeption.",
  es: "La asistencia de IA no está disponible. Consulte la guía del hotel o contacte con recepción.",
  it: "L’assistenza IA non è disponibile. Consulti la guida dell’hotel o contatti la reception.",
  th: "ขณะนี้ไม่สามารถใช้บริการ AI ได้ กรุณาดูคู่มือโรงแรมหรือติดต่อแผนกต้อนรับ",
  vi: "Trợ lý AI hiện không khả dụng. Vui lòng xem hướng dẫn khách sạn hoặc liên hệ lễ tân.",
  id: "Bantuan AI sedang tidak tersedia. Silakan lihat panduan hotel atau hubungi resepsionis.",
  pt: "A assistência de IA está indisponível. Consulte o guia do hotel ou contacte a receção.",
  tl: "Kasalukuyang hindi available ang AI. Pakitingnan ang gabay ng hotel o makipag-ugnayan sa front desk.",
  ms: "Bantuan AI tidak tersedia buat masa ini. Sila rujuk panduan hotel atau hubungi kaunter hadapan.",
};

export class ChatUnavailableError extends Error {
  constructor(language: string) {
    super(Object.hasOwn(unavailableMessages, language) ? unavailableMessages[language] : unavailableMessages.ja);
    this.name = "ChatUnavailableError";
  }
}

export async function generateWithFallback(
  prompt: string,
  generateGemini: () => Promise<string>,
  language: string
): Promise<string> {
  try {
    return await generateGemini();
  } catch (error) {
    const status = error && typeof error === "object" && "status" in error ? error.status : undefined;
    if (status !== 402 && status !== 429) throw error;
    console.warn("[Chat API] Gemini limit reached; trying fallback", { status });
  }

  const fallbacks = [
    {
      name: "OmniRoute",
      baseUrl: process.env.OMNIROUTE_BASE_URL?.trim(),
      apiKey: process.env.OMNIROUTE_API_KEY?.trim(),
      model: process.env.OMNIROUTE_MODEL?.trim(),
    },
    {
      name: "Groq",
      baseUrl: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY?.trim(),
      model: "openai/gpt-oss-120b",
    },
    {
      name: "Groq",
      baseUrl: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY?.trim(),
      model: "openai/gpt-oss-20b",
    },
  ];

  for (const { name, baseUrl, apiKey, model } of fallbacks) {
    if (!baseUrl || !apiKey || !model) continue;
    try {
      const url = new URL(baseUrl);
      const localDevelopment = process.env.NODE_ENV !== "production" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && url.protocol === "http:";
      if ((url.protocol !== "https:" && !localDevelopment) || url.username || url.password || url.search || url.hash) {
        throw new Error("Invalid gateway URL");
      }
      url.pathname = `${url.pathname.replace(/\/$/, "")}/chat/completions`;
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], stream: false, max_tokens: 1024 }),
        cache: "no-store",
        redirect: "error",
        // Three attempts plus Gemini and the official-site fetch fit within 60 seconds.
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        console.warn("[Chat API] Fallback request failed", { provider: name, status: response.status });
        // Only a quota response may advance from Groq 120B to the free 20B model.
        if (name === "Groq" && (response.status === 402 || response.status === 429)) continue;
        // A provider refusal must not be bypassed through another provider.
        if (response.status === 400 || response.status === 403) throw new ChatUnavailableError(language);
        throw new Error("Fallback request failed");
      }
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (data?.choices?.[0]?.finish_reason === "content_filter" || data?.choices?.[0]?.message?.refusal ||
        typeof reply !== "string" || !reply.trim()) throw new ChatUnavailableError(language);
      console.info("[Chat API] Fallback answered", { provider: name });
      return reply.trim();
    } catch (error) {
      console.warn("[Chat API] Fallback unavailable", { provider: name });
      if (error instanceof ChatUnavailableError) throw error;
      if (name === "Groq") throw new ChatUnavailableError(language);
    }
  }
  throw new ChatUnavailableError(language);
}
