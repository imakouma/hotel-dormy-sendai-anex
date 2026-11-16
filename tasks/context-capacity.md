# 質問別コンテキスト選択 V1

2026-11-16 / 担当②。実装・ローカル統合検証完了。実APIトークン／回答比較のみ承認待ち。
依頼文で承認済みの関数・所有ファイル範囲に沿って実装。共通plan、route、provider、インフラは担当②では変更していない。

## 動作と契約

```ts
selectHotelContext(hotelInfo: string, message: string, language: string): string
```

入力された最新の館内情報を、その場でMarkdownの `##` 節単位に分ける。料金・子供料金・最終入店・会員特典・例外・下位見出し・コードブロックは切り離さない。内容の要約や翻訳、上限文字数による切り捨てはしない。

絞り込みは `ja` / `en` で、朝食、Wi-Fi、駐車場、チェックイン／アウト、清掃、浴場、アメニティ、洗濯の単一トピックを明示した限定的な質問形式のみ。例: 「朝食の時間は？」「駐車場の料金は？」「What time is breakfast?」「What is the Wi-Fi password?」。

本文にもトピックが現れる全節を保持し、基本情報、会員特典、対応方針、その他、未知の見出しは常に保持。除外できる見出しは全10館で確認した名前の一覧に限定する。未来の見出しや名前の変更は原文保持に倒れる。新しい料金・時間・例外は毎回読み込まれる原文から取得するため、このモジュールに金額や時間の本番コピーはない。

以下では入力全文をバイト内容を変えずに返す。

- 空情報・空質問、解析不確実（見出し不足／閉じていないコードブロック）、トピック検索失敗。
- 「料金は？」「それは何時？」など対象不明の質問。
- 「朝食と駐車場の料金は？」など複合質問。
- 会員条件、子供料金、アレルギー、車高、予約変更、特定時刻など、限定質問形式にない条件や依頼を伴う質問。
- `ja` / `en` 以外の回答言語。既存の全15言語の回答指定は維持され、未対応言語を日本語扱いで絞らない。

既存API入力検証（型・4000文字制限）に続く内部関数。通信、ログ、永続化、環境変数、新しい依存やAI事業者は追加していない。追加月額費用なし。

## 統合手順（①担当のroute所有範囲）

```ts
import { selectHotelContext } from "../../../lib/hotel-context";

const hotelInfo = loadHotelInfo();
// getHotelFaq/getHotelFallback には従来どおり全文の hotelInfo を渡す。
// FAQで回答できない時だけ、既存AIプロンプト用に選択する。
const aiHotelInfo = selectHotelContext(hotelInfo, userMessage, language);
```

既存 `fullPrompt` の `${hotelInfo}` だけを `${aiHotelInfo}` に置き換える。公式補足、言語指示、館内情報優先ルール、エラー時フロント案内、provider分岐はそのまま保持。①担当のstatusで全10への組み込みを確認済み。

選択を戻す時は `aiHotelInfo` の代わりに元の `hotelInfo` を渡すだけ。FAQ処理と公式URL訂正を巻き戻す必要はない。

## 公式HP補足の調査

7館が最大12,000文字の公式HTML由来テキストを付加し、3館（ドーミー3館）は補足fetchなし。既存キャッシュは1時間のインスタンス内キャッシュであり、全リクエストで必ず通信するわけではない。キャッシュヒット時も補足全文はAI入力へ含まれる。今回の取得は同じUser-Agent・既存htmlToPlainText処理・12,000文字上限で行い、全対象HTTP200。取得内容を空文字へ置き換えた計測ではない。

エース盛岡とピースアイランド那覇の既存URLが [グランテラス仙台国分町公式](https://breezbay-group.com/hgt-s-kokubuncho/) を向いていた。ページのホテル名と住所、各館内KBの公式URLを照合し、以下へ訂正する案を①担当へ渡した。①担当のstatusで適用済み。

- エース盛岡: [本人の公式HP](https://www.hotel-ace.co.jp/)、電話019-654-3811／盛岡市中央通。観光指示も松島→盛岡。
- ピースアイランド那覇: [本人の公式HP](https://peace-k.jp/naha/)、電話098-917-2626／那覇市前島。観光指示も松島→那覇。

補足は無条件に削除しない。例えば [シルク・トゥリー公式](https://www.silk-tree.jp/) のカード・電子決済可否や予約開始時期、那覇公式の全室電子レンジは現在のKBだけでは不足する。質問選択処理は取得済み公式補足を一切削らず、この回答根拠を維持する。未取得のリンク先本文まで追加取得する機能は作っていない。

盛岡の公式HPには漫画／フリードリンク時間がKBと異なる箇所もある。既存の「館内KBを最優先」のルールを変更せず、公式情報でKBを無断更新しない。

## 実入力比較（文字数、トークン数ではない）

元のコミット版routeをTypeScriptで実行し、実際に取得した公式HTMLだけをローカルHTTPスタブへ返した。AIへの送信直前プロンプトを捕捉し、元のKBをselectHotelContextの返却内容へ置換して比較。AI APIは呼ばない。UTF-16の `string.length` を使用。既存の日本語指示・質問・公式補足も含む総プロンプトで比較し、KBだけの削減率を全入力削減率と混同しない。

次表は同じ公式補足をbefore/afterとも保持した、選択処理単体の比較。朝食質問は「What time is breakfast?」(en)、Wi-Fiは「What is the Wi-Fi password?」(en)、駐車場は「駐車場の料金は？」(ja)。朝食とWi-FiはAIへ到達する場合の比較で、日本語FAQが先に回答した場合の節約と足し算しない。

| ホテル | 公式補足文字 | 朝食 総入力 before→after | 朝食削減 | Wi-Fi削減 | 駐車場削減 |
| --- | ---: | ---: | ---: | ---: | ---: |
| hotel-dormy-sendai-express | 0 | 2921→1292 | 55.8% | 57.8% | 0% |
| hotel-justin-nagoya-special | 5137 | 8053→6610 | 17.9% | 15.7% | 18.2% |
| hotel-peace-iland-naha | 2815 | 4736→4239 | 10.5% | 12.3% | 0% |
| hotel-ace-morioka | 2815 | 6785→4324 | 36.3% | 28.1% | 31.2% |
| hotel-granteras | 2815 | 7871→6027 | 23.4% | 43.7% | 36.1% |
| hotel-crown-hills | 2501 | 7264→5542 | 23.7% | 42.9% | 37.5% |
| hotel-dormy-aomori | 0 | 2223→1501 | 32.5% | 35.7% | 36.8% |
| hotel-bellea-sendai | 4864 | 7574→6254 | 17.4% | 19.2% | 17.7% |
| hotel-dormy-sendai-anex | 0 | 2658→1181 | 55.6% | 59.4% | 0% |
| hotel-silk-tree-nagoya | 3633 | 7286→5990 | 17.8% | 27.8% | 0% |

盛岡・那覇の上表は修正前URLを固定した比較で、他ホテル情報の送信を推奨するものではない。公式URLを正しくした同一条件のbefore/afterは次のとおり（朝食・英語）。

| ホテル | 正しい公式補足文字 | 総入力 before→after | 選択単体の削減 |
| --- | ---: | ---: | ---: |
| hotel-ace-morioka | 2656 | 6610→4149 | 37.2% |
| hotel-peace-iland-naha | 566 | 2467→1970 | 20.1% |

「朝食と駐車場の料金は？」「Can I bring a pet?」「早餐几点？」は全10館で全文復帰（選択処理の削減0%）。判断が不確かな場合にも無理に容量を削減していない。知識ベースの料金、条件、会員特典を原文のまま保持することはテストで確認した。LLMの回答品質を保証するものではなく、追加の実回答比較は下記理由で未実施。

## 検証結果

- [x] 各checkoutのHEAD/status確認。ブランチ切替・reset・新worktreeなし。
- [x] 既存Graphifyコードグラフで呼出し関係を確認。統合担当の更新後、全10グラフにhotel-contextのノードがあることを確認。
- [x] RED→GREEN: 新規関数欠落、方針中だけの一致、未知の見出し変種、小数番号5.5のテストが実装前に失敗し、修正後に通過。
- [x] 31件×10館=310件のcontextテスト。実KBの会員特典、子供料金、途中出庫・高さ制限、女性の代替浴場、清掃の周期・時刻・例外、未知言語、複合質問を含む。
- [x] 全既存＋新規統合テスト868件通過。①担当のrouteテストでも選択結果・公式補足保持・未知質問全文復帰を検証。
- [x] 全10館で対象ファイルESLint、単独TypeScript型確認成功。依存追加なし。
- [x] 全10館×8質問=80ケースのローカル入力計測。公式URL訂正後の2館×8ケースも別途計測。
- [ ] 実OmniRoute/Groq入力トークン・回答品質比較: 自動承認レビューが2回拒否。既存の元ユーザー承認をread_threadで確認して示しても、「今回の具体的payloadと宛先への承認を確認できない」と拒否された。今回の最大6送信について確認待ち。APIは1回も呼べていない。

```sh
node --test tests/hotel-context.test.cjs
node --test tests/*.test.cjs
./node_modules/.bin/eslint lib/hotel-context.ts tests/hotel-context.test.cjs
./node_modules/.bin/tsc --noEmit --target ES2020 --module commonjs --skipLibCheck lib/hotel-context.ts
```

ビルド、最終レビュー、Git commit/push、Vercel本番配備は①担当が統合管理する。担当②は行わない。

## 実API比較の準備と制限

送信先は既存 `https://omniroute.hotel-mj-info.com/v1/chat/completions`、無料コンボ `hotel-guide-free`、Groq `openai/gpt-oss-120b`。公開館内KB（記載済みWi-Fi含む）と取得済み公式HP補足、合成質問のみ。既存のホテル別キーは安全なローカル保管先から読み、値を出力しない。ログ・キャッシュ・ZDR・有料設定の変更なし。

用意済み: 盛岡朝食英語のbefore/after、シルクチェックアウトのbefore/after、ANNEX朝食＋大浴場の複合質問、盛岡ペット同伴可否の不明質問。合計最大6回。複合・不明は入力全文が同一なので重複送信しない。想定品質基準は、時刻／料金の正確さ、会員例外保持、回答言語、未知条件を捏造しないこと。承認後も429時の無条件リトライはせず無料枠を使い切らない。

準備物・測定値（秘密なし）: `/tmp/hotel-free-capacity-20261116/context.status.json`, `context-measurements.json`, `context-corrected-site-measurements.json`, `context-live-prompts.json`, `context-measure.cjs`, `context-live.cjs`。取得した公開HTMLも同ディレクトリの `context-official-pages.json` に保存。共有統合用の一時記録で、キーや顧客の実質問は含まない。

使用回数の倍増は保証しない。文字数と実token数は別で、公式補足・質問の複雑さ・言語・出力・RPM/RPD制限・共通利用量によって効果が変わる。公式補足が多いホテルでは、KBだけを削減しても総量の削減は限定的。
