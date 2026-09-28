---
description: Pre-deploy verification
---
Prepare for deployment:
1. Run lint, typecheck, tests, and production builds for client and server.
2. Verify `.env.example` lists every env var the code reads (grep `process.env` and `import.meta.env`).
3. Confirm no secrets in the client build output.
4. Walk through `.claude/reviews/pre-release.md` and mark what you can verify locally.
Report blockers first.
