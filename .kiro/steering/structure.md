---
inclusion: always
---

# プロジェクト構造

## ルートディレクトリ構成

```
├── .kiro/                   # Kiro設定とステアリングルール
├── README.md                # プロジェクト概要とセットアップガイド
├── README.md                # プロジェクト概要とセットアップガイド
└── LICENSE                  # プロジェクトライセンス(MIT)
```

## 構造規約

プロジェクト構成は以下のフォルダ構成を参考にしてください。

```bash
├── README.md               # README.md
├── template                # Base Mini Appを開発するためのテンプレートプロジェクト
├── app
│   ├── api
│   │   ├── .well-known
│   │   │   └── farcaster.json
│   │   │       └──route.ts     # Farcaster用のメタデータAPI
│   │   ├── notify
│   │   │   └── route.ts    # 通知用のAPI
│   │   └── webhook
│   │       └── route.ts    # Webhook用のAPI
│   ├── layout.tsx          # レイアウト
│   ├── page.tsx            # Pageコンポーネント
│   └── providers.tsx       # プロバイダーコンポーネント
├── components              # 各コンポーネントを格納するフォルダ
│   ├── common              # 全画面共通コンポーネントを格納するフォルダ
│   └── TransactionCard.tsx # トランザクションカードコンポーネント
├── css                     # スタイルシート用フォルダ
├── lib
│   ├── notification-client.ts
│   ├── notification.ts
│   └── redis.ts
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public
│   ├── hero.png
│   ├── icon.png
│   ├── logo.png
│   └── splash.png
├── tailwind.config.ts
├── tsconfig.json
└── utils             # ユーティリティ関数用フォルダ
    ├── abis          # ABI格納用フォルダ
    └── constants.ts  # 定数用フォルダ
```
