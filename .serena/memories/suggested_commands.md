Project commands (pnpm):
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Start (prod): `pnpm start`
- Lint: `pnpm lint`
- Format: `pnpm format`

Environment:
- Copy `.env.example` to `.env.local` and set values (do not commit secrets). Ensure `NEXT_PUBLIC_ONCHAINKIT_API_KEY` and app branding vars are set; set `NEXT_PUBLIC_URL` to your deployed domain for icons/images.

Useful local (Darwin/macOS) shell commands:
- Navigate/list: `cd`, `ls -la`
- Search files/text: `rg -uu --files`, `rg "pattern" -n`
- Git workflow: `git status`, `git add -p`, `git commit -m "..."`, `git push`
- Node/package: `pnpm i <pkg>`, `pnpm outdated`, `pnpm why <pkg>`

Run locally:
1) `pnpm i`
2) Prepare `.env.local` (see `.env.example`).
3) `pnpm dev` → open http://localhost:3000

Deploy (typical):
- Vercel target; ensure env vars configured in dashboard and set `NEXT_PUBLIC_URL` accordingly.