---
description: Review changes against the review checklists
argument-hint: [code | ui | performance | pre-release]
---
Review the current uncommitted changes (`git diff` + untracked files) using
`.claude/reviews/${ARGUMENTS:-code}-review.md` (or `pre-release.md`).

Output: a short summary, then findings grouped as Must fix / Should fix / Nice to have,
each with file:line and a suggested fix. Be direct — don't pad with praise.
