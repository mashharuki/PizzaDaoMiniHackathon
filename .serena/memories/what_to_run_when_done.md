Before asking for review:
- Format: `pnpm format`
- Lint: `pnpm lint` (fix issues or annotate intentionally)
- Type-check: Next.js build includes TS; optionally run `tsc --noEmit`
- Build: `pnpm build` (verify no build-time errors)
- Smoke test locally: `pnpm dev` → verify wallet connect, game flow, NFT mint button rendering after completion
- Secrets: ensure `.env.local` is not committed; redact any keys in logs/docs
- Update docs: adjust `README.md` if commands or env vars changed

Optional (if present):
- Add/Run tests (Jest/Playwright) once introduced per specs
- Validate Base Sepolia contract address and ABI are correct
- Verify Farcaster MiniApp behavior (MiniKit context shows Save Frame)