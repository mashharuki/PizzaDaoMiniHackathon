# Pizza Roulette Game (PizzaDAO × Ethreactor Mini Hackathon)

## LiveDemo

- Vercel

  https://pizza-dao-mini-hackathon.vercel.app/

- MiniApp

  [Casted MiniApp](https://farcaster.xyz/mashharuki/0x38f8d234)

  [Registered MiniApp](https://farcaster.xyz/miniapps/__UcwcJwPaVN/mini-pizza-game)

- NFT

  [Rarible Testnet](https://testnet.rarible.com/token/base/0x52D89afa637AEF34A6b680c77B366F3c854485d4:0)

## 概要

Pizza Roulette Game は Farcaster MiniApp として動作する 1 画面完結の Web3 ミニゲームです。

ユーザーは回転する 12 分割のピザボードをタップしてピザを完成させ、最終スコアに応じてランク別の NFT を Base Sepolia 上でミントできます。

Coinbase OnChainKit の MiniKit をフロントとトランザクション UX に活用し、モバイルでも快適に遊べるよう設計しています。

- 対象チェーン: Base Sepolia
- NFT コントラクト: `utils/constants.ts` の `PIZZA_DAO_MINI_HACKATHON_ADDRESS` を参照
- ミント関数: `safeMint(address to, string uri)`（ABI は `utils/abis/PizzaDaoMiniHackathon.ts`）

## 主要機能

- ウォレット接続（OnChainKit / Base Sepolia への接続確認）
- ゲームプレイ（12 切れピザボード、回転・タップ操作、6 種類の味をランダム配置）
- スコアリング（基本点・隣接ボーナス・連続ボーナス・パーフェクトボーナス）
- ランク判定（Diamond / Gold / Silver / Bronze）
- 特別パターン検出と演出（例: ロイヤルストレートピザフラッシュ、ピザマスター など）
- NFT ミント（ゲーム終了後にランク別メタデータ URI を指定してミント）
- Farcaster MiniApp 連携（MiniKit コンテキスト、Save Frame 動線）
- レスポンシブ対応（モバイル最適化）

## アーキテクチャ

```mermaid
graph TB
  subgraph Frontend (Next.js App Router)
    Page[app/page.tsx]
    Providers[app/providers.tsx]
    Page --> Game[components/Game/*]
    Page --> Header[components/common/Header]
    Page --> TxCard[components/TransactionCard]
  end

  subgraph Web3 Integration
    Providers --> MiniKit[OnChainKit MiniKit]
    TxCard --> OnChainKitTx[OnChainKit Transaction]
    OnChainKitTx --> BaseSepolia[(Base Sepolia)]
    BaseSepolia --> NFT[(PizzaDaoMiniHackathon ERC721)]
  end

  subgraph Game Logic
    Game --> Score[lib/game/scoreCalculator]
    Game --> Pattern[lib/game/patternDetector]
    Game --> State[lib/game/gameState]
  end

  subgraph Farcaster
    Header --> MiniApp[MiniKit Context / Save Frame]
  end
```

### ディレクトリ構成（抜粋）

```
app/
  ├─ page.tsx            # メインゲームページ
  └─ providers.tsx       # OnChainKit MiniKit Provider
components/
  ├─ Game/               # PizzaBoard, ScoreDisplay, SpecialPatternDisplay 等
  ├─ common/             # Header, ErrorDisplay, Button, Icon 等
  └─ TransactionCard.tsx # トランザクション UI（ミント時に使用）
lib/
  └─ game/               # scoreCalculator, patternDetector, gameState
types/                   # ゲーム関連型定義
utils/
  ├─ abis/               # コントラクト ABI
  └─ constants.ts        # コントラクトアドレス・特殊パターン定義
.kiro/specs/pizza-roulette-game/  # 要件・設計・タスクの仕様書
```

## 技術スタック

| カテゴリ        | 採用技術                                | バージョン/備考 |
|-----------------|-----------------------------------------|-----------------|
| Framework       | Next.js                                 | 15.x, App Router|
| Language        | TypeScript                              | strict 有効     |
| UI/Styling      | Tailwind CSS                            | prettier-plugin-tailwindcss 連携 |
| State/Query     | React Hooks, @tanstack/react-query      |                 |
| Web3            | Coinbase OnChainKit (MiniKit/Tx/Wallet) | `@coinbase/onchainkit` |
| Web3 Low-level  | wagmi, viem                             | wagmi 2.x / viem 2.x |
| Farcaster       | @farcaster/miniapp-sdk, frame-sdk       | MiniApp 連携    |
| Chain           | Base Sepolia                            | テストネット    |
| Data/Cache      | Upstash Redis                           | 任意（env で設定） |
| Tooling         | ESLint, Prettier, Tailwind, TypeScript  |                 |

## コマンド一覧

| タスク               | コマンド         | 説明 |
|----------------------|------------------|------|
| 依存関係のインストール | `pnpm i`         | 初回セットアップや依存更新に使用 |
| 開発サーバ起動        | `pnpm dev`       | http://localhost:3000 を起動 |
| ビルド                | `pnpm build`     | 本番ビルド（型チェックを含む） |
| 本番起動              | `pnpm start`     | ビルド済み成果物を起動 |
| Lint                  | `pnpm lint`      | ESLint による静的解析 |
| フォーマット          | `pnpm format`    | Prettier による整形 |

## セットアップ

1) 依存関係のインストール

```
pnpm i
```

2) 環境変数ファイルの準備（`.env.example` を参考に `.env.local` を作成）

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` など OnChainKit の公開キー/ブランディング設定
- `NEXT_PUBLIC_URL`（デプロイ URL）と `NEXT_PUBLIC_ICON_URL` 等の参照を整備
- 必要に応じて `REDIS_URL` / `REDIS_TOKEN` を設定

3) 開発サーバ起動

```
pnpm dev
```

## 開発ガイド

- 仕様書は `.kiro/specs/pizza-roulette-game/` を参照（要件/設計/タスク）
- Web3 連携は `app/providers.tsx` の MiniKitProvider、トランザクションは `components/TransactionCard.tsx` を経由
- ゲームロジックは `lib/game/*` に集約（スコア計算・パターン検出・状態管理）
- コントラクトアドレス/ABI は `utils/constants.ts` / `utils/abis/*` を参照

## 注意事項

- テストネット（Base Sepolia）用であり、本番資産を扱わないでください
- `.env.local` は秘匿情報を含むため VCS にコミットしないでください
- コントラクトアドレスやメタデータ URI はデプロイ状況に合わせて更新してください
