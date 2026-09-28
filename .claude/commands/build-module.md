---
description: Build a module from its spec
argument-hint: <spec-number-or-name e.g. 02 or backend-api>
---
Build the module described in `.claude/specs/*$ARGUMENTS*.md`.

1. Read `.claude/CLAUDE.md` and the matching spec fully.
2. List the files you'll create/change and wait for my OK.
3. Implement in small steps, following the layering rules in CLAUDE.md.
4. Write tests for the acceptance criteria.
5. Run lint, typecheck, and tests; fix failures.
6. Report which acceptance criteria are met and anything left open.
