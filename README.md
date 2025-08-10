# ローカルモデルチャット

Next.js 14 と Tailwind CSS を使ったシンプルなチャット UI です。LM Studio で起動したローカル LLM と通信します。

## セットアップ

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` でアプリが起動します。

## 環境変数

`.env.local` を作成し、以下を設定してください。

```
LOCAL_API_BASE=http://localhost:3000
MODEL=gpt-oss-20b
```

## LM Studio 側の設定
1. LM Studio を起動し、`gpt-oss-20b` などのモデルを読み込みます。
2. 「Server」タブで **PORT 1234** の API サーバーを起動します。
3. アプリからのリクエストが `http://127.0.0.1:1234` に届くようにします。

これでブラウザからローカルモデルとチャットできます。
