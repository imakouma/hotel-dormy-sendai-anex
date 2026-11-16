# 定型質問による無料枠節約 — V1

## 仕様と境界
既存の `README_AI_FALLBACK.md` に対する追加仕様。承認済みの依頼に従い、日本語の明確な単一質問（チェックイン／アウト、朝食、Wi-Fi等）だけを `data/hotel-info.md` の現在の記述から回答する。予約別条件・アレルギー・複合・曖昧・未知の表現や未対応言語は従来のAIへ渡す。時刻・会員特典・プラン例外を複製せず一次資料から抜き出す。情報欠落時は推測しない。

`getHotelFaq(message: string, language: string, hotelInfo: string): string | null` が確実な回答またはnullを返す。入力検証後、APIキー確認・公式HP取得・AI呼出し前に実行する。レスポンスは既存の `{ reply }`。FAQ由来であることを `X-Hotel-Answer-Source: knowledge-base` ヘッダーで識別可能にし、本文・利用者情報を記録しない。EXPRESSの既存fallbackはこの関数を再利用し、停止案内を維持する。ジャストインのキー未設定時の既存静的案内も維持。

追加依存・新AI事業者・課金設定変更・永続回答キャッシュは対象外。プライバシー設定は維持。正規表現は全文一致の許可リストとし、単語だけで未知の質問を推定しない。

## 実装計画
- [x] Aceで失敗するFAQ単体・実ルートテストを追加し、最小helperとルート分岐を実装。
- [x] ホテル別一次資料を確認し全10へ展開。会員時刻・料金・最終入店・Wi-Fiの違いと欠落をテスト。
- [x] 課題2のcontext選択を統合し、課題3の承認済み範囲のみレビューして統合。
- [ ] 全10のテスト・型・lint・ビルド、code-only Graphify更新、秘密チェック、差分レビュー。
- [ ] 明示ファイルだけcommit、非force push、Vercel本番READYと公開APIを検証。

## 検証コマンド
各ホテルrootで `node --test tests/*.test.cjs`、`npx tsc --noEmit`、`npx eslint app/api/chat/route.ts lib/hotel-faq.ts lib/hotel-context.ts lib/chat-provider.ts tests/*.test.cjs`、`npm run build`。新規コードは既存のTypeScriptとNode標準テストランナーを利用。

FAQは外部HTTPを失敗させた状態で実ルートから確認し、AIだけでなく公式HP取得も0件であることを検証する。非FAQ・未対応言語は実SDK＋HTTPスタブで従来経路を確認。無料枠を故意に枯渇させない。

## 結果
実装と統合テスト完了: ℹ tests 83, ℹ pass 83, ℹ fail 0。全ホテルで対象lint成功。型検査も成功（silk-treeの.next/types生成競合もビルド後の型検査で解消）。言語ガードの条件を反転するmutationで回帰テストが失敗することを確認。Graphifyはcode-only update、ローカルのみ保持。

日本語の定型質問は外部HTTP/AIが0件。不明・複合・予約個別・未対応言語は従来のAI経路へ渡す。館内情報変更・会員時間・朝食料金・最終入店・Wi-Fi・空の節・情報混在をテスト。既存の402/429切替・拒否・キー分離テストを維持。

課題2を統合: FAQには全文、AIプロンプトにはselectHotelContextの出力を使う。公式HP補足は保持。Ace/Peaceの他ホテル補足URLと観光案内を各ホテル用に修正。課題3は承認/接続確認待ちでモデル・認証情報・課金設定は変更なし。

## 公開前確認と残る制限
ローカルTurbopackは実行環境のポート制限、webpackも一部でGoogle Fonts接続制限に当たる。ソース設定を変更せず、成功したローカルビルドとVercelの本番ビルドを記録する。全10の公開URL検証は反映後に追記。

npm auditを2026-11-16に実施。既存eslint系の開発依存にhigh 5件/moderate 8件、Just Innにはconcurrently→shell-quoteのcritical 2件も存在。lockfileのdev属性、npm ls、呼出箇所を確認し、利用者入力から到達するAPI/本番コード/本番buildにこれらの脆弱な処理はない。concurrentlyは固定文字列の開発起動のみ。今回依存は追加・変更せず、別の開発依存更新として2026-11-23までに再確認する。

直接回答率の実トラフィック計測、長期負荷試験、追加モデルの品質/独立無料枠は未検証。利用回数倍増は保証しない。

## ロールバック
今回の変更はデータ保存/スキーマ変更なし。公開後に誤答・500増加があれば直前のVercel READYデプロイへ戻し、通常のrevertで修正する。直前HEADとdeployment IDは統合記録に保存する。キー・既存OmniRoute設定は削除しない。


## 統合レビュー（公開前）
最終版contextは31テスト×10、統合suiteは担当②も全868テスト成功を確認。FAQには全文を渡しAI部分だけ選択する差分、例外処理、input 1〜4000文字制約、EXPRESS/Just Innの既存停止案内をレビューした。

朝食質問のプロンプト文字数（実公式HP補足を含む）は、元URLで10.5〜55.8%削減。正しい公式URLに直したAceは6,610→4,149文字（37.2%）、Peaceは2,467→1,970文字（20.1%）。これはUTF-16文字数で、実トークン数・利用回数の保証ではない。詳細は `context-capacity.md`。実OmniRouteでの追加測定は自動承認レビューに拒否され、担当②で最大6件の確認を待っている。新モデル追加も担当③で確認待ち。既存接続先の変更はない。
