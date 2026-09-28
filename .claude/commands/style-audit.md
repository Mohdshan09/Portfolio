---
description: Audit the client for design-system drift
---
Scan `client/src` for violations of `.claude/design/DESIGN.md`:
raw hex colours, `rounded-*` beyond the allowed radius, `bg-gradient`, `blur`, `shadow-lg`/soft shadows,
fonts outside the three stacks, serif text below 28px, components using more than one accent colour.
Report each with file:line and the token/class to replace it with. Don't edit unless I ask.
