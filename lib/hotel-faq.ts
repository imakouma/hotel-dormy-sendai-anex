/** Only whole, verified Japanese questions bypass AI; answers come from the current knowledge base. */
export function getHotelFaq(message: string, language: string, hotelInfo: string): string | null {
  if (language !== "ja") return null;
  const question = message.normalize("NFKC").toLowerCase().trim()
    .replace(/[ \t]+/g, "").replace(/[?？。!！]+$/, "");
  const general = "(?:は|について(?:教えて(?:ください)?)?|を教えて(?:ください)?)?";
  const time = "(?:(?:は|の?(?:時間|営業時間)は)?(?:何時(?:から(?:何時まで)?|まで)?|いつ(?:から|まで)?)(?:ですか)?|の?(?:時間|営業時間)(?:は|を教えて(?:ください)?)?)";
  const breakfast = "(?:朝食|朝ごはん|朝ご飯|朝御飯)";
  const wifi = "(?:wi-?fi|ワイファイ)";
  let topic: "check" | "breakfast" | "wifi" | "noodles" | "front" | "lost";
  if (new RegExp(`^チェック(?:イン|アウト)(?:${general}|${time})$`).test(question)) topic = "check";
  else if (new RegExp(`^${breakfast}(?:${general}|${time}|の(?:料金|値段|会場|場所)(?:は|を教えて(?:ください)?)?|は(?:いくら|どこ)(?:ですか)?)$`).test(question)) topic = "breakfast";
  else if (new RegExp(`^${wifi}(?:${general}|の(?:パスワード|ssid|接続先)(?:は|を教えて(?:ください)?)?|は(?:ありますか|無料ですか))$`).test(question)) topic = "wifi";
  else if (new RegExp(`^夜[鳴泣]きそば(?:${general}|${time})$`).test(question)) topic = "noodles";
  else if (/^(?:内線番号|フロントの内線(?:番号)?)(?:は|を教えて(?:ください)?)?$/.test(question)) topic = "front";
  else if (/^(?:忘れ物|落とし物)(?:について(?:教えて(?:ください)?)?|の取り扱い(?:は|を教えて(?:ください)?)?)$/.test(question)) topic = "lost";
  else return null;

  const sections = hotelInfo.replace(/\r\n/g, "\n").split(/(?=^## )/m);
  const section = (heading: RegExp) => sections.find(part => heading.test(part.split("\n")[0]));
  const block = (text: string, label: RegExp) => (text.match(/^- .*(?:\n[ \t]+.+)*/gm) ?? []).filter(line => label.test(line)).join("\n");
  let answer = "";
  if (topic === "check") {
    const basic = section(/^## .*基本情報/) ?? "";
    answer = block(basic, /^- \*\*(?:チェックイン|チェックアウト|アーリーチェックイン|延長料金)/);
    const details = section(/^## [\d.]+ チェックイン・チェックアウト時間$/);
    if (details) answer += "\n" + details;
    if (!/\d{1,2}:\d{2}/.test(answer)) return null;
    const membership = section(/^## .*会員|^## .*メンバーズ/);
    if (membership && /チェックイン|チェックアウト/.test(membership)) answer += "\n" + membership;
  } else if (topic === "breakfast") {
    const dedicated = section(/^## [\d.]+ 朝食(?:\s|$)/);
    const meals = section(/^## .*お食事/) ?? "";
    answer = dedicated ?? block(meals, /^- \*\*朝食\*\*/);
    // Meal headings can contain the restaurant floor/name (e.g. ANNEX).
    if (!dedicated && answer) answer = meals.split("\n")[0] + "\n" + answer;
    if (/料金|値段|いくら/.test(question) && !/(?:料金|価格|値段)[^\n]*(?:円|無料)/.test(answer)) return null;
    if (/会場|場所|どこ/.test(question) && !/会場|レストラン|階/.test(answer)) return null;
    if (/何時|いつ|時間/.test(question) && !/\d{1,2}:\d{2}/.test(answer)) return null;
  } else if (topic === "wifi") {
    answer = section(/^## [\d.]+ (?:無料)?Wi-Fi$/i) ?? block(hotelInfo, /^- \*\*Wi-Fi\*\*/i);
    if (/パスワード/.test(question) && !/パスワード/.test(answer)) return null;
    if (/ssid|接続先/.test(question) && !/SSID|接続先|アクセスポイント/i.test(answer)) return null;
    if (/無料/.test(question) && !/無料/.test(answer)) return null;
  } else if (topic === "noodles") {
    answer = block(section(/^## .*お食事/) ?? "", /^- \*\*夜鳴きそば\*\*/);
  } else if (topic === "front") {
    answer = hotelInfo.match(/^- フロントへの内線番号は.+$/m)?.[0] ?? "";
  } else {
    answer = section(/^## [\d.]+ お忘れ物について$/) ?? "";
  }
  if (!answer.replace(/^## .*$/gm, "").trim()) return null;
  return answer.replace(/^- \*\*重要\*\*:.*$/gm, "")
    .replace(/^忘れ物・落とし物に関するお問い合わせには、以下の内容で案内してください。$/gm, "")
    .replace(/^## [\d.]+ /gm, "").replace(/\*\*/g, "").replace(/^[ \t]*- /gm, "").trim() || null;
}
