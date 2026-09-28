---
description: Build a UI component or section in the Terminal Press style
argument-hint: <component or section name, e.g. ProjectCard or Hero>
---
Build `$ARGUMENTS` for the client.

1. Read `.claude/design/DESIGN.md`, `components.md`, and `page-layouts.md`.
2. If it's in components.md or page-layouts.md, match that spec exactly; otherwise design it
   from the rules (serif headline / brutalist box / mono labels).
3. Use Tailwind tokens from `design/tailwind-tokens.md` only — no raw hex or arbitrary values.
4. Include hover/active press states, focus-visible, reduced-motion handling, and mobile (360px) layout.
5. Pull real content from the API hooks, not placeholder text.
6. Finish by checking it against `reviews/ui-review.md` → "Terminal Press style compliance".
