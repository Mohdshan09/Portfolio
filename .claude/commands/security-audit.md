---
description: Run a security audit against the security checklists
argument-hint: [optional path or module, defaults to whole repo]
---
Audit ${ARGUMENTS:-the whole repo} against every file in `.claude/security/`.

For each checklist item, report: ✅ pass / ❌ fail / ⚠️ unclear — with the file and line as evidence.
Also run `npm audit --audit-level=high` in client and server.
Finish with a prioritised fix list (critical → low). Don't change code unless I ask.
