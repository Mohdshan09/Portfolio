# Performance Review

- [ ] Lighthouse (mobile) ≥ 90 across categories
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Initial JS bundle < 200 KB gzip; admin code not in public chunks (`vite build --report` / rollup-plugin-visualizer)
- [ ] Images served via Cloudinary `f_auto,q_auto` with responsive widths
- [ ] Public API responses < 200 ms (lean queries, indexes on `slug`, `order`, `isPublished`)
- [ ] `Cache-Control` set on public GETs; TanStack Query `staleTime` configured
- [ ] Gzip/brotli compression on server
