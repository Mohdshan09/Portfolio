# 07 — SEO, Performance, Accessibility

## SEO
- `react-helmet-async`: per-page title, description, canonical, Open Graph + Twitter cards.
- Project pages use their cover image as `og:image`.
- `robots.txt` (disallow `/admin`), `sitemap.xml` generated from projects.
- JSON-LD `Person` schema on home.
- SPA SEO is limited — prerender `/` and project pages (e.g. `vite-plugin-prerender`).

## Performance
- Route-level code splitting; admin fully lazy.
- Cloudinary transforms: `f_auto,q_auto,w_<size>` + `loading="lazy"` + explicit width/height.
- Self-host fonts, `font-display: swap`.
- Server: `compression()`, narrow Prisma `select`/`include` (no over-fetching).

## Accessibility
- Semantic landmarks, one `h1` per page, logical heading order.
- All interactive elements keyboard reachable with visible focus.
- Colour contrast ≥ 4.5:1 in both themes.
- Alt text is a required field for every uploaded image.
