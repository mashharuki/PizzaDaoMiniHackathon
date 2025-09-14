Languages & Conventions:
- TypeScript with strict mode enabled; path alias `@/*` to repo root.
- React function components. Keep props typed; prefer explicit interfaces.
- Next.js App Router patterns: `app/` with client components where needed (`'use client'`).

Styling:
- Tailwind CSS. Utility-first CSS with Prettier Tailwind plugin enforcing class order.
- Global vars `--background`/`--foreground`; custom animation `fade-out`.

Lint/Format:
- ESLint extends `next/core-web-vitals` + `next/typescript`.
- Prettier config: semicolons, single quotes, tabWidth 2, trailingComma es5, printWidth 100, arrowParens always, LF EOL, tailwindcss plugin.

UI/UX:
- Mobile-first, responsive layout; tap interactions reliable on small screens.
- Use OnChainKit components for wallet/transaction UX; do not roll your own.

Web3 Patterns:
- Use OnChainKit’s MiniKit Provider from `app/providers.tsx` for context and transactions.
- Interact with the NFT via `TransactionCard` abstraction; pass ABI/calls from page/component.
- Target chain: Base Sepolia; ensure network checks and clear errors.

Game Logic:
- Keep pure logic in `lib/game/*` with tests added later.
- Score calculation and pattern detection follow specs; avoid side effects inside these functions.
