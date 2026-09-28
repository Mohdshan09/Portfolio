---
# ── HOW TO USE ──────────────────────────────────────────────────────────────
# 1. Copy this file into this folder and rename it. The file name becomes the URL:
#      multi-tenant-scoping-in-examlyst.md  →  /dispatches/multi-tenant-scoping-in-examlyst
#    Use lowercase-with-dashes. Files starting with "_" (like this one) are never published.
# 2. Fill in the fields below. Lines starting with "#" are comments and are ignored.
# 3. Keep `draft: true` while writing: you'll see it in `npm run dev`, nobody sees it live.
#    Flip it to `false` (or delete the line), commit, and deploy to publish.
# ─────────────────────────────────────────────────────────────────────────────
title: Your headline goes here
date: 2026-09-23
summary: One or two sentences shown on the list page and under the headline.
tags: [prisma, postgres]
draft: true
---

Write the intro here. Everything below the second `---` is regular Markdown.

## A section heading

Normal paragraphs, **bold**, _italic_, `inline code` and [links](https://example.com) all work.

- Bullet lists
- Work too

1. So do
2. Numbered lists

> A blockquote becomes a big pull quote. Use one per post, max.

```ts
// Fenced code blocks render inside a terminal-style box.
const tenant = await prisma.school.findUniqueOrThrow({ where: { id: tenantId } });
```

| Tables | Work |
| ------ | ---- |
| too    | ✓    |

![Alt text describing the image](/dispatches/my-image.png)
<!-- Put images in client/public/dispatches/ and reference them as /dispatches/<file>. -->
