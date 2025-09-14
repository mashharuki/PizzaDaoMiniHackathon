---
inclusion: always
---

## 技術スタック

### 全体

- **パッケージマネージャー**: pnpm
- **ランタイム**: Node.js
- **フォーマッター**: prittier

### フロントエンド

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**:
  - TailwindCSS
- **ライブラリ**：
  - viem
  - wagmi
  - @farcaster/frame-sdk
  - @coinbase/onchainkit
  - @upstash/redis
  - @tanstack/react-query
- **状態管理**: useState

### インフラ・DevOps

- **CI/CD**: GitHub Actions

#### .gitignore

`.gitignore` ファイルには、以下の内容を必ず含めてください。

```txt
**/node_modules
**/.DS_Store
```

## 開発ツール設定

### パッケージマネージャー

- **pnpm**: 高速で効率的なパッケージ管理
- `pnpm-workspace.yaml`: モノレポワークスペース設定

### フォーマッター・リンター

- **Biome**: 高速なフォーマッターとリンター
- `biome.json`: 設定ファイル

### Git 設定

- `.gitignore`: 必須除外項目
  - `**/node_modules`
  - `**/.DS_Store`
