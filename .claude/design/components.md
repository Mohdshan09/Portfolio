# Component Specs

All components live in `client/src/components/ui/`. Square corners. Use tokens only.

## Button
Variants:
- `primary` — bg `--acid`, text `#0C0C0C`, `--border` in `#0C0C0C`, `--shadow` in `--line`. Mono uppercase.
- `secondary` — transparent, `--border`, text `--ink`, hover bg `--ink` / text `--bg`.
- `terminal` — no border, mono, prefix `$ `, underline on hover, `--acid` caret after.
Sizes: `sm` (h-9, px-3), `md` (h-11, px-5), `lg` (h-14, px-7). Press animation from DESIGN.md §3.

## Tag
`<span>` mono 12px uppercase, `border: 1.5px solid var(--line-soft)`, px-2 py-0.5.
Active/filter-selected: bg `--amber`, text `#0C0C0C`, border `#0C0C0C`.

## Card (ProjectCard)
```
┌──────────────────────────────────────┐ ← 2px border, 6px hard shadow
│ 01 / FEATURED            ● LIVE      │ ← mono meta row, LIVE dot in --signal
├──────────────────────────────────────┤
│ [cover image, grayscale → colour on hover]
├──────────────────────────────────────┤
│ ExamLyst                             │ ← serif 2rem
│ B2B online assessment platform       │ ← grotesk, --ink-dim
│ ROLE: BACKEND · NOV 25 — FEB 26      │ ← mono byline
│ [NEXT.JS] [PRISMA] [BULLMQ]          │
│ VIEW CASE STUDY →        ↗ LIVE      │
└──────────────────────────────────────┘
```
Hover: lift + acid shadow, image `filter: grayscale(0)`. Whole card is one link; secondary
links are separate focusable elements.

## TerminalWindow
Props: `title`, `children`, `prompt?`, `typing?`.
Title bar: 3 square dots (`--signal`, `--amber`, `--acid`), mono path, border-bottom.
Body: mono, `--surface`, scanline overlay, lines prefixed with `$` (command, `--acid`) or `>` (output, `--ink-dim`).

## SectionHeader
Props: `index` ("02"), `title`, `emphasis` (italic word), `command`.
Layout: mono `§02` + flex-grow hairline rule; below it the serif title; below that the mono command.

## Masthead (top nav)
Full-width bordered strip, mono 12px. Left: `SHAN.DEV`. Centre (≥md): nav links as `[01] WORK`
`[02] EXPERIENCE` `[03] RESEARCH` `[04] CONTACT`. Right: status dot + local time (IST) + theme toggle `[◐]`.
Mobile: collapses to `SHAN.DEV` + `[≡ MENU]` opening a full-screen terminal-style menu.

## Timeline (Experience)
Left column mono dates (`OCT 25 → NOW`), thick vertical rule, right column: company in serif,
role in mono, bullets as `→` lines. Current role marked `● ACTIVE` in `--acid`.

## StatBlock
Giant serif numeral + mono caption. Row of 3–4 separated by vertical borders.

## Input / Textarea (Contact)
Styled like a terminal prompt: label as `name:` in mono `--acid`, input bottom-border only
(2px `--line`), focus → border `--acid` + caret colour `--acid`. Error text in `--signal` prefixed `ERR:`.

## Footer / StatusBar
Two tiers: big serif sign-off line ("Let's build *something*.") then a vim-style status bar
with mono segments separated by `│`, `--surface-2` background.

## Keyboard shortcuts
`G` GitHub, `L` LinkedIn, `R` resume, `/` focus project filter, `?` shows shortcut overlay.
Ignore when focus is in an input. Overlay is a TerminalWindow modal, closes on `Esc`.
