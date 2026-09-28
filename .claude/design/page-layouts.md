# Page Layouts (section-by-section treatment)

## Home `/`
**0. Masthead** — see components.md.

**1. Hero** (full viewport, faint column guides behind)
```
ISSUE 01 · FULL-STACK EDITION · RAIPUR, IN                     ● OPEN TO WORK
─────────────────────────────────────────────────────────────────────────────
Mohammad
*Shan.*                                          ┌ TerminalWindow ~/whoami ──┐
                                                 │ $ whoami                  │
Full-stack developer building                    │ > full-stack dev · MERN   │
ERPs, assessment platforms & AI tools.           │ $ cat stack.txt           │
                                                 │ > next · node · postgres  │
[ VIEW WORK → ]   $ download resume.pdf          │ $ ▌                       │
                                                 └───────────────────────────┘
```
Name in `display-xl` serif; surname italic in `--acid`. Terminal types in on load.

**2. About** — 7-col paragraph with acid drop cap + 4-col sidebar of mono facts
(`EDU: B.TECH CSE '26`, `BASE: INDIA`, `STACK: MERN / NEXT`). StatBlock row below.

**3. Skills** — header `§01 Tool*kit*` + `$ cat skills.json | jq`. Rendered as a bordered
table: category column in mono, tags in cells. No progress bars.

**4. Experience** — `§02 Work *History*` + Timeline component.

**5. Featured Projects** — `§03 Selected *Work*` + `$ ls ./projects --featured`.
Uniform grid, 3 cols desktop / 2 tablet / 1 mobile, `items-start` (no forced row-stretch).
(An asymmetric 8-col-hero + 4-col-stack was tried first but broke down with placeholder covers —
a lone card and a two-card stack don't share row height, leaving a dead gap. Revisit once real
cover images give the grid actual visual weight to justify the asymmetry.)

**6. Research** — styled as a journal clipping: `--ink` background (inverted block), dark text,
serif title, mono citation line `IJPREMS · VOL 06 · ISSUE 04 · APR 2026`, `READ PAPER ↗` button.
This is the one inverted block on the page — it should stand out.

**7. Certificates & Education** — two-column newspaper "classifieds" list with hairline rules.

**8. Contact** — split: left serif "Let's build *something*." + email as big underlined link;
right a TerminalWindow containing the prompt-style form.

**9. Footer** — StatusBar.

## Project detail `/projects/:slug`
Reads like a magazine feature:
- Kicker (mono): `CASE STUDY · 02`
- Title (display-l serif) + standfirst (grotesk 1.25rem, --ink-dim)
- Byline row (role, dates, links)
- Full-width bordered cover image
- Body in a 7-col column with a sticky 3-col mono sidebar: `STACK`, `ROLE`, `STATUS`, `LINKS`
- Sections: Problem → Role → Architecture (diagram inside TerminalWindow) → Features → Outcome
- One pull quote per case study
- Footer nav: `← PREV PROJECT` / `NEXT PROJECT →` as full-width brutalist blocks

## `/projects`
Filter bar as a terminal input: `$ filter --tech ` + clickable tags. Result count in mono:
`> 6 results`. Grid of ProjectCards.

## 404
Centred (only centred page): serif "Page *not* found.", mono `bash: {path}: No such file or directory`,
button `$ cd ~`.

## Admin `/admin`
Same tokens, but denser and plainer — no grain, no type-on, no display serif except page titles.
Tables with hairline rows, brutalist primary buttons only for Save/Publish.
