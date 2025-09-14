Top-level:
- `app/` App Router pages
  - `page.tsx` main game page (renders Header, PizzaBoard, ScoreDisplay, SpecialPatternDisplay, TransactionCard)
  - `providers.tsx` wraps with OnChainKit `MiniKitProvider` (Base Sepolia) using env vars
  - `api/` endpoints (metadata, notifications; TBD per spec)
- `components/`
  - `Game/` PizzaBoard (SVG), ScoreDisplay, SpecialPatternDisplay, GameControls, etc.
  - `common/` Header (wallet UI + Save Frame), ErrorDisplay, shared UI elements
  - `TransactionCard.tsx` OnChainKit Transaction wrapper invoked for NFT mint
- `lib/`
  - `game/` scoreCalculator, patternDetector, gameState hook
  - notification/redis helpers (as per spec; ensure implemented/used as needed)
- `types/` game-related types
- `utils/` ABIs and constants (contract address, special patterns)
- `css/` global/theme styles
- `.kiro/specs/pizza-roulette-game/` requirements, design, tasks (authoritative specs)

Config files:
- `package.json` scripts (dev/build/start/lint/format)
- `tailwind.config.ts`, `tsconfig.json`, `.eslintrc.json`, `.prettierrc`, `next.config.mjs`
