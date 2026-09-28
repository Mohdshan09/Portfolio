# 04 — Public Frontend

Single-page scroll home + dedicated project detail pages.

> Visual style: follow `.claude/design/` (Terminal Press). Section layouts are defined in
> `design/page-layouts.md`; this spec covers routes, data, and behaviour.

## Routes
- `/` — Home (all sections)
- `/projects` — full grid with tech filter
- `/projects/:slug` — case study page
- `/resume` — embedded PDF + download
- `*` — 404

## Home sections (in order)
1. **Hero** — name, headline ("Full-Stack Developer · MERN & Next.js"), CTA: View Projects / Download Resume, socials
2. **About** — summary, location, "open to work" badge
3. **Skills** — grouped chips by category
4. **Experience** — vertical timeline (BHN, Zidio)
5. **Featured Projects** — cards (cover, title, role, stack, live/github links)
6. **Research** — IJPREMS ExamLyst paper card
7. **Certificates & Education**
8. **Contact** — form + email/LinkedIn

## Project detail page
Problem → Role → Architecture → Key features (highlights) → Stack → Screenshots → Links.
Render `description` markdown with `react-markdown` + `rehype-sanitize`.

## UI rules
- Dark theme is the default ("Terminal Press"); optional light "print edition" toggle per DESIGN.md §1.
- Mobile-first; test at 360px, 768px, 1280px.
- Motion per DESIGN.md §7: snappy 120–200ms, type-on terminal in hero only; respect `prefers-reduced-motion`.
- Keyboard shortcuts per components.md (`G`, `L`, `R`, `/`, `?`).
- Loading/empty/error states use terminal microcopy (DESIGN.md §8), e.g. `fetching projects… [████░░░░]`.

## Acceptance
- Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO.
- All content comes from the API — nothing hardcoded except layout copy.
