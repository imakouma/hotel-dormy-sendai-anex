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
    console.warn("[Chat API] Gemini limit reached; trying OmniRoute", { status });
  }

  const baseUrl = process.env.OMNIROUTE_BASE_URL?.trim();
  const apiKey = process.env.OMNIROUTE_API_KEY?.trim();
  const model = process.env.OMNIROUTE_MODEL?.trim();
  if (!baseUrl || !apiKey || !model) {
    console.warn("[Chat API] OmniRoute fallback is not configured");
    throw new ChatUnavailableError(language);
  }

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
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      console.warn("[Chat API] OmniRoute request failed", { status: response.status });
      throw new ChatUnavailableError(language);
    }
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) throw new ChatUnavailableError(language);
    return reply.trim();
  } catch {
    console.warn("[Chat API] OmniRoute fallback unavailable");
    throw new ChatUnavailableError(language);
  }
}
