# Code Review Checklist

## Structure
- [ ] Follows route → validate → controller → service → model layering
- [ ] No business logic in React components that belongs in hooks/services
- [ ] Shared types/schemas imported from `/shared`, not redefined

## Correctness
- [ ] Matches the module spec's acceptance criteria
- [ ] Async errors handled (`asyncHandler`), no unhandled promise rejections
- [ ] Loading, empty, and error states handled in UI

## Quality
- [ ] TypeScript strict, no `any` without comment explaining why
- [ ] No dead code, console.logs, or commented-out blocks
- [ ] Functions small and named for what they do
- [ ] Magic numbers/strings pulled into constants

## Tests
- [ ] New API routes have Supertest tests (happy path + validation failure + auth failure)
- [ ] Critical components have RTL tests (contact form, protected route)

## Security quick-pass
- [ ] Input validated, output filtered, auth applied — see `security/checklist.md`
