Primary Stack:
- Framework: Next.js 15 (App Router) + React 18, TypeScript
- Styling: Tailwind CSS
- State/server: React hooks + @tanstack/react-query
- Web3: Coinbase OnChainKit (MiniKit, Wallet, Transaction) + viem + wagmi
- Farcaster: @farcaster/miniapp-sdk, @farcaster/frame-sdk
- Chain: Base Sepolia
- Data/Cache: Upstash Redis (placeholders in .env)

Tooling:
- Package manager: pnpm (pnpm-lock.yaml present)
- Linting: ESLint (next/core-web-vitals, next/typescript)
- Formatting: Prettier (+ tailwindcss plugin)

Notable Libraries In Use:
- html2canvas (for screenshots/share features)

Env Vars (do not commit secrets):
- NEXT_PUBLIC_ONCHAINKIT_* (public app config), FARCASTER_*, REDIS_*.
- See `.env.example` for keys; copy to `.env.local` locally and populate.
