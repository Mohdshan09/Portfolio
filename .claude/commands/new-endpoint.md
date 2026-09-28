---
description: Scaffold a new API endpoint with validation and tests
argument-hint: <METHOD /path — short purpose>
---
Scaffold endpoint: $ARGUMENTS

Create/update: Zod schema in `/shared`, route, controller, service, and a Supertest test file.
If the path is under `/api/admin`, ensure `requireAuth` applies. Update `specs/02-backend-api.md`
with the new route. Run tests before finishing.
