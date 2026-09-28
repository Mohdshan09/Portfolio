# 00 — Architecture & Setup

## Goal
Monorepo skeleton with client, server, and shared packages wired together.

## Structure
```
server/
  prisma/        schema.prisma, migrations/
  src/
    config/        env.ts (Zod-validated env), db.ts (Prisma client singleton), cloudinary.ts
    routes/        public.routes.ts, admin.routes.ts, auth.routes.ts
    controllers/
    services/
    middleware/    auth.ts, validate.ts, errorHandler.ts, rateLimit.ts
    utils/         logger.ts (pino), ApiError.ts, asyncHandler.ts
    seed/          seed.ts (loads resume content)
    app.ts, server.ts
client/src/
  api/           axios instance + query hooks
  components/    ui/ (design-system primitives), sections/, admin/
  styles/        globals.css, tokens.css (from design/tailwind-tokens.md)
  pages/         public/, admin/
  hooks/, lib/
  router.tsx, main.tsx
shared/
  schemas/       zod schemas (project, experience, message, ...)
  types/         inferred types
```

## Tasks
- [ ] npm workspaces at root; `concurrently` dev script
- [ ] TS strict mode everywhere; ESLint + Prettier shared config
- [ ] `env.ts` fails fast on missing/invalid env vars
- [ ] Prisma initialized (`prisma init`), `db.ts` exports a singleton `PrismaClient`
- [ ] Central error handler returning `{ success:false, error:{ code, message } }`
- [ ] Health route `GET /api/health`
- [ ] `.env.example` for both apps

## Env vars
```
DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CLIENT_URL,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
IP_HASH_SALT, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, NODE_ENV, PORT
```

## Acceptance
- `npm run dev` starts both apps; client calls `/api/health` successfully.
- Server refuses to boot with a missing env var and prints which one.
