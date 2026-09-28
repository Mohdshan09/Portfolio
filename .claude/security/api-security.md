# API Security

## Authorization
- [ ] Every route in `admin.routes.ts` mounted behind `requireAuth` at router level (not per-handler).
- [ ] Public queries always filter `isPublished: true`.
- [ ] Public responses use projections — never return internal fields (`__v`, `ipHash`, admin data).

## Injection
- [ ] No raw user input in `$where`, `$regex` without escaping, or `find(req.query)`.
- [ ] Filter params (`tech`, `featured`) whitelisted and typed via Zod.
- [ ] Sorting fields whitelisted.

## Errors
- [ ] Production errors return generic messages; stack traces only logged, never sent.
- [ ] Prisma `PrismaClientKnownRequestError` (e.g. `P2002` unique violation, `P2025` not found) mapped to 400/404.

## Mass assignment
- [ ] Controllers pass only Zod-parsed data to `create`/`update` (no spreading `req.body`).
- [ ] `id`, `createdAt`, `slug` (on update) not client-writable.
