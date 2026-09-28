# Security Checklist (master)

Tick per module before merging. Details in the other files in this folder.

## Secrets & config
- [ ] No secrets in code, commits, or client bundle (`grep -r "postgres(ql)\?://\|sk_\|api_key" client/dist` is empty)
- [ ] `.env` in `.gitignore`; `.env.example` has placeholders only
- [ ] JWT secrets ≥ 32 random bytes, different for access and refresh
- [ ] Only `VITE_*` vars reach the client, and none of them are secret

## HTTP hardening
- [ ] `helmet()` with a CSP (allow self, Cloudinary, fonts)
- [ ] CORS locked to `CLIENT_URL`, `credentials: true`, no `*`
- [ ] Body size limit (`100kb` JSON; uploads capped separately)
- [ ] HTTPS only in production; `trust proxy` set correctly on Render/Railway
- [ ] `x-powered-by` disabled

## Input & data
- [ ] Zod validation on every body, param, and query
- [ ] All Prisma queries use parameterized query builder methods (`where`, `data`) — never `$queryRawUnsafe`
      with interpolated input
- [ ] Markdown rendered with `rehype-sanitize`; no `dangerouslySetInnerHTML` on untrusted content
- [ ] `id`/`slug` route params validated (type + format) before query

## Auth
- [ ] See `auth-security.md` — all items pass

## Rate limiting
- [ ] Global: 100 req / 15 min / IP
- [ ] Login: 5 / 15 min; Contact: 3 / hour

## Dependencies
- [ ] `npm audit --audit-level=high` clean
- [ ] Dependabot / Renovate enabled
