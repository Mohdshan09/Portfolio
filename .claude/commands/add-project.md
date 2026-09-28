---
description: Turn a project description into a seed entry
argument-hint: <project name or notes>
---
Create a Project entry for: $ARGUMENTS

Ask me for anything missing (role, stack, dates, links). Then produce a valid object matching
`shared/schemas/project.ts`, with a 1-line shortDescription, 3–5 impact-focused highlights,
and a markdown description structured as Problem → Role → Architecture → Features.
Append it to `server/src/seed/data/projects.ts`.
