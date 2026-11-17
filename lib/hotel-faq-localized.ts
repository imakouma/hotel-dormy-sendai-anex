import { createHash } from "node:crypto";
import locales from "../data/faq-locales.json";
import facts from "../data/hotel-faq.json";

const normalize = (text: string) => text.normalize("NFKC").toLowerCase().trim()
  .replace(/[’‘]/g, "'").replace(/[ \t]+/g, " ")
  .replace(/^[¿¡]+/, "").replace(/[?？。.!！]+$/, "").trim();

type Topic = "checkIn" | "checkOut" | "breakfast" | "wifi" | "password" | "ssid" | "freeWifi" | "noodles" | "front" | "lost" | "breakfastPrice" | "parking" | "bath";
type Locale = { text: Record<string, string>; questions: Partial<Record<Topic, string[]>> };

export function getLocalizedHotelFaq(message: string, language: string, hotelInfo: string): string | null {
  if (!Object.hasOwn(locales, language)) return null;
  const locale: Locale = locales[language as keyof typeof locales];
  const question = normalize(message);
  const topic = (Object.keys(locale.questions) as Topic[])
    .find(key => locale.questions[key]?.some(phrase => normalize(phrase) === question));
  if (!topic) return null;
  // shortcut: any knowledge-base edit disables these reviewed FAQs; review facts and refresh the hash together.
  if (createHash("sha256").update(hotelInfo).digest("hex") !== facts.sourceSha256) return null;
  const section = topic === "checkIn" || topic === "checkOut" ? "check"
    : topic === "password" || topic === "ssid" || topic === "freeWifi" ? "wifi" : topic;
  const lines: string[][] = facts[section];
  if (["password", "ssid", "freeWifi"].includes(topic) && !lines.some(([key]) => key === topic)) return null;
  if (!lines.length || lines.some(([key]) => !Object.hasOwn(locale.text, key))) return null;
  return lines.map(([key, value]) => locale.text[key].replace("{value}", value)).join("\n");
}
