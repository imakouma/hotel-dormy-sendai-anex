const topics = [
  { name: /^(?:朝食|朝ごはん|breakfast)$/i, source: /朝食|朝ごはん|breakfast/i },
  { name: /^(?:wi[ -]?fi|wifi|インターネット)$/i, source: /wi[\s-]?fi|インターネット|SSID|パスワード/i },
  { name: /^(?:駐車場|駐車|parking)$/i, source: /駐車|パーキング|parking/i },
  { name: /^(?:チェックイン|チェックアウト|check[ -]?in|check[ -]?out)$/i, source: /チェックイン|チェックアウト|入退館|check[ -]?(?:in|out)/i },
  { name: /^(?:清掃|掃除|cleaning|housekeeping)$/i, source: /清掃|掃除|タオル|シーツ|cleaning|housekeeping/i },
  { name: /^(?:大浴場|温泉|サウナ|public bath|onsen|sauna)$/i, source: /大浴場|温泉|サウナ|入浴|bath|onsen|sauna/i },
  { name: /^(?:アメニティ|amenities)$/i, source: /アメニティ|タオル|貸出|amenit/i },
  { name: /^(?:コインランドリー|洗濯|乾燥機|laundry|laundromat)$/i, source: /ランドリー|洗濯|乾燥|洗剤|laundry|laundromat/i },
];

// shortcut: narrow only reviewed single-topic Japanese/English forms; add languages with retention tests.
const questionForms = [
  /^(.+?)(?:(?:について)?(?:教えて(?:ください)?|知りたい)|について|(?:の(?:時間|営業時間|料金|場所|パスワード|利用方法))?(?:は|を)?)?[?？。!！]*$/i,
  /^(?:what time is|when is|where is|how much is|tell me about) (?:the )?(.+?)[?.!]*$/i,
  /^(?:what is|what's) (?:the )?(.+?) (?:password|price|cost|location|schedule)[?.!]*$/i,
];

// Only known headings may be omitted; new sections remain available until reviewed.
const removableHeadings = new Set([
  "Wi-Fi", "お忘れ物について", "お食事",
  "お食事 (3F レストラン「AOI」)", "お食事／大浴場", "アクセス",
  "アメニティ", "アメニティについて", "サービスコーナー・館内設備",
  "チェックイン・チェックアウト時間", "入退館時間", "入退館時間 (Check-in & Check-out time)",
  "周辺観光", "夕食・飲食店クーポン", "夕食・飲食店クーポン（ご夕食クーポン）",
  "夕食・飲食店・クーポン (Dinner / Restaurants / Coupon)", "多彩な自販機", "夜間のオートロックについて",
  "大浴場・サウナ（2F）", "天然温泉「淡雪の湯」(13F)", "天然温泉「青葉の湯」 (3F)",
  "客室・設備", "客室・館内設備（概要）", "客室照明およびカードキー",
  "室内照明", "室内照明について", "宴会・会議",
  "宿泊者限定サービス（本館1Fラウンジ）", "提携駐車場について", "提携駐車場のご案内",
  "朝食", "朝食 … 2F ALLY's Nagoya (Breakfast)", "清掃・アメニティについて",
  "無料Wi-Fi", "自動チェックイン", "連泊のお客様へ（清掃・シーツ・タオル）",
  "連泊のお客様（清掃）", "連泊清掃 (Cleaning for consecutive nights)", "飲食店クーポン",
  "館内の無料ガス乾燥機", "館内案内", "館内案内 (Floor information)",
  "館内設備", "館内設備／貸出品", "駐車場",
]);

/** Returns original input whenever the question or document cannot be safely narrowed. */
export function selectHotelContext(hotelInfo: string, message: string, language: string): string {
  if (!hotelInfo.trim() || !message.trim() || !["ja", "en"].includes(language)) return hotelInfo;
  const question = message.trim().normalize("NFKC").replace(/\s+/g, " ");
  const topic = topics.find((candidate) => questionForms.some((form) => {
    const match = question.match(form);
    return match !== null && candidate.name.test(match[1]);
  }));
  if (!topic) return hotelInfo;

  const starts: number[] = [];
  let offset = 0;
  let fence = "";
  for (const line of hotelInfo.split(/(?<=\n)/)) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && line.trim() === marker[1]) fence = "";
    } else if (!fence && /^##\s+\S/.test(line)) starts.push(offset);
    offset += line.length;
  }
  if (fence || starts.length < 2) return hotelInfo;
  const sections = starts.map((start, index) => hotelInfo.slice(start, starts[index + 1] ?? hotelInfo.length));
  if (!sections.some((section) => !/^## .*対応方針/.test(section) && topic.source.test(section))) return hotelInfo;
  return hotelInfo.slice(0, starts[0]) + sections.filter((section) => {
    const heading = section.split("\n", 1)[0].replace(/^##\s+(?:\d+(?:\.\d+)*\.?\s+)?/, "").trim();
    return !removableHeadings.has(heading) || topic.source.test(section);
  }).join("");
}
