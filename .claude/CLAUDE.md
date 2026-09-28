# Portfolio — Mohammad Shan (MERN)

Personal developer portfolio with a public site and a private admin CMS, so content
(projects, experience, publications) can be updated without redeploying.

## Stack
- **Client:** React 18 + Vite + TypeScript, React Router, Tailwind CSS, Framer Motion, TanStack Query
- **UI style:** "Terminal Press" — Dark Neo-Brutalism × Editorial × Retro-Terminal (see `.claude/design/`)
- **Server:** Node.js 20 + Express + TypeScript, Prisma, Zod validation
- **DB:** PostgreSQL (NeonDB) via Prisma ORM
- **Auth:** Single admin user, JWT access token (15m) + httpOnly refresh cookie (7d), bcrypt
- **Media:** Cloudinary (project images, resume PDF)
- **Contact:** messages stored in DB, read in the admin inbox (`/admin`) — no email service
- **Deploy:** Client → Vercel, Server → Render/Railway, DB → NeonDB

## Repo layout
```
/client        React app (public site + /admin)
/server        Express API
/shared        Shared TS types + Zod schemas (imported by both)
/.claude       Specs, design system, security, reviews, commands
```

## Modules (build in this order)
| # | Module | Spec |
|---|--------|------|
| 0 | Architecture & setup | specs/00-architecture.md |
| 1 | Database models | specs/01-database.md |
| 2 | Backend API | specs/02-backend-api.md |
| 3 | Auth (admin) | specs/03-auth.md |
| 4 | Public frontend | specs/04-frontend-public.md |
| 5 | Admin dashboard (CMS) | specs/05-admin-dashboard.md |
| 6 | Contact & notifications | specs/06-contact.md |
| 7 | SEO, performance, a11y | specs/07-seo-performance.md |
| 8 | Deployment & CI | specs/08-deployment.md |

## Design system (read before any UI work)
| File | Covers |
|---|---|
| design/DESIGN.md | Style rules, colour + type tokens, signature elements, motion, microcopy |
| design/components.md | Button, Card, TerminalWindow, SectionHeader, Masthead, Timeline, Inputs, StatusBar |
| design/page-layouts.md | Section-by-section layout for every page |
| design/tailwind-tokens.md | tailwind.config.ts + globals.css to paste in |

Short version: **Headline = serif (editorial). Box = hard border + offset shadow (brutalist).
Label = mono (terminal).** Square corners, no gradients, no blur, one accent per component.

## Working rules for Claude
- For any UI task, read `.claude/design/DESIGN.md` and use tokens only — no hardcoded hex values or ad-hoc fonts.
- Read the relevant spec in `.claude/specs/` before writing code for a module.
- Every request body is validated with a Zod schema from `/shared`. No unvalidated input reaches Prisma.
- Never commit secrets. All config comes from `.env` (see `.env.example`).
- Keep controllers thin: route → validate → controller → service → model.
- Public API is read-only. All writes live under `/api/admin/*` behind `requireAuth`.
- Run the matching checklist in `.claude/security/` and `.claude/reviews/` before calling a module done.
- Prefer small, focused commits: `feat(projects): ...`, `fix(auth): ...`.

## Commands
```
client:  npm run dev | build | lint | test
server:  npm run dev | build | lint | test | seed
root:    npm run dev   (runs both via concurrently)
```

## Definition of done (per module)
1. Matches spec acceptance criteria
2. Lint + typecheck clean, tests pass
3. `security/checklist.md` items for that module ticked
4. `reviews/code-review.md` pass completed
