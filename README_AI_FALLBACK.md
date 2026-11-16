# Gemini優先・OmniRouteへの自動切り替え

## 動作

`POST /api/chat` は通常Geminiで回答する。GoogleがHTTP 402（前払い残高不足）または429（回数・トークン・その他の利用制限）を返すと、同じホテル情報・質問・回答言語をOmniRouteへ一度送る。次の質問ではGeminiを再度試すため、無料枠の回復後は自動でGemini優先に戻る。

金額をアプリ内で集計する機能ではない。Google側で無料枠に設定して初めて無料運用になる。現在の有料キーのままモデル名だけ変えても、料金体系は変わらない。401/403・モデル不存在・安全性ブロック・通常のサーバー障害ではOmniRouteへ切り替えない。

OmniRoute未設定・利用不能時は503 / `AI_UNAVAILABLE` と各言語のフロント案内を返す。生のプロバイダーエラー、キー、質問をログやレスポンスに含めない。既存の `{ reply }` 形式とホテルごとの知識ベースを維持する。名古屋ジャストインの「キー未設定時の静的案内」も維持する。

## ホテル側の環境変数

| 変数 | 値 |
| --- | --- |
| `GEMINI_API_KEY` | Googleの無料枠プロジェクトのキー |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite`（省略時も同じ） |
| `OMNIROUTE_BASE_URL` | `https://取得したホスト名/v1` |
| `OMNIROUTE_API_KEY` | そのホテル専用の、無料コンボに制限したOmniRouteキー |
| `OMNIROUTE_MODEL` | `hotel-guide-free`（下記で作成するコンボ名） |

すべてサーバー専用。`NEXT_PUBLIC_` は付けない。ローカルは `.env.local`、本番はVercelの環境変数へ保存し、設定後に再デプロイする。キーをチャット、ソース、URL、コマンド履歴へ貼らない。

OmniRouteの3変数が揃うまで切り替えは使用できない。既定の `auto` や任意の有料モデルへは送らない。開発時だけ `http://127.0.0.1:20128/v1` を使用でき、本番ではHTTPS必須。リダイレクトには追従しない。

## 無料枠Geminiを準備する

1. Google AI Studioで館内案内専用プロジェクトを選び、課金区分が **Free** であることを確認する。必要な本人・プロジェクト確認を完了する。
2. 既存Google Cloudプロジェクトの課金を無断で無効化しない。他のCloudサービスに影響するため、館内案内専用の無料枠プロジェクトを推奨する。
3. 無料枠対応モデルと実際のRPM/TPM/RPDを管理画面で確認する。10ホテルの想定利用量を合算する。制限はキー単位ではなくプロジェクト単位なので、キーを複製しても容量は増えない。
4. 発行したキーを安全に環境変数へ設定する。無料枠では入力・出力が製品改善に使われる条件がある。予約番号や個人情報を入力させる用途には広げない。

公式資料: [料金](https://aistudio.google.com/docs/pricing)、[課金区分](https://aistudio.google.com/docs/billing)、[上限](https://aistudio.google.com/docs/rate-limits)。

## OmniRouteの本番構成

```text
宿泊客 → 各ホテルのVercel /api/chat → Gemini（Free）
                                  └ 402 / 429 → HTTPS Caddy → OmniRoute → 無料専用AI
```

10ホテルで1台の常時稼働サーバーを共有し、キーはホテルごとに分ける。永続ディスクとHTTPSのホスト名が必要。MacのlocalhostをVercelから使うことはできない。API無料枠とサーバー・ドメイン料金は別で、サーバー費用まで無料である保証はない。推奨の初期構成はDocker対応Linux、メモリ2GB以上、永続ディスク。実際の同時利用量で調整する。

構成例はエース盛岡リポジトリの `deploy/omniroute/` に置く。公式イメージとCaddy 2の確認済みバージョンタグまたはdigestを `.env` で固定する。手元で確認したOmniRouteコードは3.8.51だが、利用時点でリリース・イメージの存在と修正情報を再確認する。

### サーバー起動

1. `deploy/omniroute/` をサーバーへ配置する。DNSをそのサーバーへ向け、80/443と管理用SSHだけを許可する。20128は外部公開しない。
2. 同ディレクトリで `.env.example` を `.env` にコピーする。`OMNIROUTE_IMAGE`、`CADDY_IMAGE`、`OMNIROUTE_DOMAIN`、強い管理パスワード、永続的な暗号化キーを設定する。暗号化キーは `openssl rand -hex 32` 等で生成し、暗号化データとともに安全にバックアップする。再起動ごとに変更しない。
3. 設定検証後、OmniRouteだけを起動して管理設定を済ませる。

```sh
docker compose config --quiet
docker compose up -d omniroute
```

4. 管理画面はSSHトンネル経由で開く。

```sh
ssh -L 20128:127.0.0.1:20128 サーバーのSSH接続先
```

ブラウザーで `http://127.0.0.1:20128` を開き、設定した管理パスワードでログインする。管理ログイン必須・**Require API Key有効**を確認する。Composeの環境変数は `REQUIRE_API_KEY=true` だが、既存DBの設定が上書き優先されるため画面でも確認する。公開Caddy側は `POST /v1/chat/completions` 以外を404にし、管理画面を公開しない。

### 無料専用ルートの設定

1. 専用OmniRouteインスタンスには、公式の無料APIプランのみ登録する。例としてGroqのFree Planを検討できる。提供条件、商用の館内案内での利用可否、モデルライセンス、データ保存条件をアカウント作成時に確認する。有料への自動アップグレード・自動入金は有効にしない。
2. 管理画面のProvidersでその公式APIキーを登録する。Geminiと同じ枯渇した課金プロジェクトは予備として登録しない。個人向けチャットのログインやサブスクリプションを宿泊客向けAPIへ流用しない。
3. 現在Free Planで使えるモデルを選び、コンボ `hotel-guide-free` を作る。モデルIDは接続確認で取得した正確なIDを使う。候補は無料枠のみ、優先順位順に試す設定にする。有料モデルや汎用 `auto` は入れない。
4. このインスタンスには有料の接続先を登録せず、グローバルな自動ルーティングや他コンボへの代替も無料専用範囲に限定する。**アプリの `OMNIROUTE_MODEL` という名前だけでは無料を保証できない**。接続先アカウントの課金設定とコンボ・キーの制限で保証する。
5. ホテルごとにAPIキーを発行し、利用可能コンボを `hotel-guide-free` だけに制限する。直接モデル呼び出し・他コンボ・自動コンボを禁止し、回数上限を設定する。質問・回答の詳細ログを無効にし、本文キャッシュも無効にする。
6. 管理画面で無料モデルの日本語、英語など実際に使う言語を評価する。チェックアウト・朝食・駐車場などの事実一致、情報が無い時のフロント案内、応答時間を確認する。モデル品質・遅延・容量はGeminiと同一とは限らない。
7. Caddy設定を検証して公開する。

```sh
docker compose run --rm --no-deps caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker compose up -d caddy
```

### 本番投入前の確認

- キーなし・無効キーのチャット要求が401/403となり、外部AIへ届かないこと。
- ホテル専用キーで他コンボ・直接モデル・有料モデルを要求しても拒否されること。
- 有効キーで `hotel-guide-free` が回答し、利用履歴の接続先・モデルと請求額が想定どおりであること。
- ダッシュボードのURLに公開ホストからアクセスして404になること。
- 一つのホテルのPreviewに環境変数を設定し、Gemini正常、402/429切り替え、両方利用不能の各経路を確認する。制限エラーはローカルのHTTPスタブで再現し、無料枠を故意に使い切らない。
- 10ホテルそれぞれで館内情報・回答言語が正しいことを確認してから本番反映する。

無料枠は提供者が変更・停止できる。OmniRouteは無料容量を新たに発行するサービスではない。無料接続先がすべて止まればAI回答も止まり、館内ページ・フロント案内へ移る。

参考: [OmniRoute](https://github.com/cheaper-inference/OmniRoute)、[無料枠ガイド](https://github.com/cheaper-inference/OmniRoute/blob/main/docs/reference/FREE_TIERS.md)、[Groq上限](https://console.groq.com/docs/rate-limits)、[Groqデータ取扱い](https://console.groq.com/docs/your-data)、[Caddy reverse proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)。

## 開発時の検証とロールバック

各ホテルのルートで実行する。Nodeの標準テストランナーと既存TypeScriptを使い、新しい依存を増やさない。

```sh
node --test tests/chat.test.cjs
npx tsc --noEmit
npx eslint app/api/chat/route.ts lib/chat-provider.ts tests/chat.test.cjs
npm run build
```

テストは実ルートとインストール済みGemini SDKを通し、外部HTTPだけを置換する。実APIの無料枠を消費しない。GeminiとOmniRoute各20秒、ルート最大60秒。Vercelプランの実行時間上限がこれに対応していることも確認する。

切り替えだけを止めるにはVercelから `OMNIROUTE_MODEL` を外して再デプロイする。その間Gemini上限時は503になる。障害時は直前のVercelデプロイへ戻す。漏えいが疑われるキーは該当ホテルのキーだけ失効・再発行する。永続ディスクや暗号化キーは削除しない。

## 本番反映状況（2026-11-16）

全10ホテルへ配備し、各公開ドメインで実際のGemini回答を確認済み。Googleの無料枠プロジェクトに館内案内専用キーを発行し、Vercel productionのみのsensitive変数として登録。GEMINI_MODELは `gemini-3.5-flash-lite`。開発・プレビュー環境のキーは変更していません。

月額0円優先のため、OmniRouteサーバー・接続先は未設定です。402/429時の切り替えコードは配備済みですが、接続設定が揃うまではAI利用不可の案内（503）を返します。無料枠は全10ホテルで共有され、無制限ではありません。有料契約やGoogleの請求設定は変更していません。

無料ホストの準備状況・条件は[Oracle Always Free構成](https://github.com/imakouma/hotel-ace-morioka/blob/main/deploy/omniroute/ORACLE_FREE.md)を参照してください。アカウント登録と接続先AIの設定が完了するまではOmniRouteは未稼働です。
