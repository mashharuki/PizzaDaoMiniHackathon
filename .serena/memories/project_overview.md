Project: Pizza Roulette Game (PizzaDAO × Ethreactor Mini Hackathon @ ETHTokyo '25)

Purpose:
- A one-screen web3 mini-game (Farcaster MiniApp) where users spin/tap a 12-slice pizza board to complete a pizza, get scored, and mint an NFT on Base Sepolia according to the rank.

Key Features:
- Wallet connection via OnChainKit (Base Sepolia).
- Game loop: start → spin → tap slices → assign random flavors → fill all 12 slices → compute score + detect special patterns → determine rank.
- NFT mint: calls `safeMint(address, uri)` on deployed ERC721 contract; metadata URI is derived from rank.
- Farcaster MiniApp integration (MiniKit): context-aware UI and share options.
- Responsive, mobile-first UI.

Blockchain/Contracts:
- Chain: Base Sepolia.
- Contract address: defined in `utils/constants.ts` as `PIZZA_DAO_MINI_HACKATHON_ADDRESS`.
- ABI: `utils/abis/PizzaDaoMiniHackathon.ts` (`safeMint`).

Current Status (repo):
- Next.js 15 + App Router project is present and runnable.
- Providers are configured for OnChainKit MiniKit in `app/providers.tsx`.
- Core game components and logic implemented under `components/` and `lib/game/`.
- `.kiro/specs/pizza-roulette-game/` contains requirements, design, and tasks documents guiding the implementation.