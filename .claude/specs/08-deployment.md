# 08 — Deployment & CI

## Targets
- Client → Vercel (SPA rewrite to index.html; `VITE_API_URL` env)
- Server → Render / Railway (health check `/api/health`)
- DB → NeonDB (Postgres, dedicated role scoped to one database, `sslmode=require`,
  `DATABASE_URL` injected as a secret — never committed)
- Custom domain + HTTPS on both; API at `api.<domain>` so cookies stay same-site.

## GitHub Actions
On PR: install → lint → typecheck → test (both workspaces) → `npm audit --audit-level=high`.
On main: `prisma migrate deploy` against Neon, then deploy (platform auto-deploy is fine).

## Ops
- Uptime monitor on `/api/health`.
- Neon automated backups / point-in-time restore enabled.
- Structured logs (pino) — never log passwords, tokens, or full message bodies.

## Acceptance
- Fresh clone + `.env` → `npm i && npm run dev` works.
- Production passes `security/checklist.md` and `reviews/pre-release.md`.
