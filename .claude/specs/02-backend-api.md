# 02 — Backend API (Express)

Base: `/api`. Response shape: `{ success: true, data }` / `{ success: false, error }`.

## Public (read-only, cached)
| Method | Route | Notes |
|---|---|---|
| GET | /health | uptime check |
| GET | /profile | singleton |
| GET | /skills | grouped by category |
| GET | /experience | published, sorted by order |
| GET | /projects | `?featured=true&tech=React` filters |
| GET | /projects/:slug | 404 if unpublished |
| GET | /publications | |
| GET | /certificates | |
| GET | /education | |
| POST | /contact | rate-limited, see 06-contact |

Set `Cache-Control: public, max-age=300` on public GETs.

## Admin (`requireAuth`)
Full CRUD for each resource under `/api/admin/<resource>`:
`GET / POST / PATCH /:id / DELETE /:id` plus `PATCH /<resource>/reorder` (body: `[{id, order}]`).
Extra:
- `POST /admin/upload` — multipart → Cloudinary, returns `{ url, publicId }`
- `GET /admin/messages`, `PATCH /admin/messages/:id` (status)
- `GET /admin/stats` — counts (projects, unread messages)

## Middleware order
helmet → cors (CLIENT_URL only, credentials) → express.json({ limit: '100kb' }) →
cookieParser → requestLogger → rateLimit → routes → 404 → errorHandler

## Acceptance
- Every POST/PATCH validated by Zod; invalid → 400 with field errors.
- Invalid `id`/`slug` param → 400, not 500.
- Supertest integration tests for each public route + one admin CRUD resource.
