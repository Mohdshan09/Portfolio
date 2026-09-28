# Design System — "Terminal Press"

Dark Neo-Brutalism × Editorial × Retro-Terminal.
The site should feel like **a printed tech magazine that boots from a command line**:
heavy black borders and hard shadows (brutalism), big serif headlines and newspaper
grids (editorial), monospace metadata, prompts, and cursors (terminal).

## The three layers — who does what
| Layer | Owns | Never does |
|---|---|---|
| **Neo-Brutalism** | Structure: thick borders, hard offset shadows, flat colour blocks, visible grid, chunky buttons | Gradients, blur, soft shadows, rounded pills |
| **Editorial** | Voice: serif display headlines, issue numbers, bylines, drop caps, pull quotes, column layouts, rules | Body copy in serif at small sizes on dark bg |
| **Terminal** | Metadata & interaction: mono labels, `$` prompts, blinking cursor, status bars, ASCII dividers, keyboard hints | Full green-on-black everything, fake "hacker" noise |

Rule of thumb: **Headline = editorial. Box = brutalist. Label = terminal.**

---

## 1. Colour tokens
```css
:root {
  /* surfaces — warm charcoal */
  --bg:         #111110;   /* page */
  --surface:    #191816;   /* cards */
  --surface-2:  #211F1B;   /* hover / inset */
  /* ink */
  --ink:        #E8E1D2;   /* primary text — warm ivory */
  --ink-dim:    #A49D91;   /* secondary text — muted beige-gray */
  --ink-mute:   #6E6860;   /* meta, timestamps */
  /* structure */
  --line:       #E8E1D2;   /* brutalist borders use ink colour */
  --line-soft:  #403D37;   /* hairline rules, grid — warm gray */
  /* accents — use ONE per component */
  --acid:       #C83A32;   /* primary accent: CTAs, cursor, active — muted brick red */
  --acid-hover: #E04A41;   /* soft red — hover/press state for the primary accent */
  --signal:     #FF5B1F;   /* secondary: highlights, "LIVE", errors */
  --amber:      #B86F4A;   /* subtle accent: dusty orange — terminal output, tags */
  --cyan:       #4DE1FF;   /* links in terminal blocks only */
}
```
Light theme (optional "print edition"): `--bg #EFEADF`, `--surface #FFFDF7`, `--ink #111`,
`--line #111`, accents darkened for contrast on cream: `--acid → #9C2E27`, `--acid-hover → #B23930`.

**Contrast:** `--ink` on `--bg` ≈ 15:1, `--ink-dim` ≈ 6.5:1, `--ink-mute` only for ≥14px meta.
Text on `--acid` backgrounds is always `--ink` (warm ivory — `--acid` is a muted brick red, not
a bright colour). Interactive elements that shift colour on hover use `--acid-hover`, not `--acid`,
for the hover state itself.

## 2. Typography
| Role | Font | Use |
|---|---|---|
| Display | **Instrument Serif** (fallback: Fraunces, Georgia) | Hero name, section titles, pull quotes. Italic for emphasis words. |
| UI / body | **Space Grotesk** (fallback: Archivo, system-ui) | Paragraphs, buttons, card titles |
| Mono | **JetBrains Mono** (fallback: IBM Plex Mono, ui-monospace) | Labels, tags, dates, prompts, code, nav, stats |

Scale (fluid with `clamp`):
```
display-xl  clamp(3.5rem, 9vw, 8.5rem)   / 0.9  / -0.03em   serif
display-l   clamp(2.5rem, 6vw, 5rem)     / 0.95 / -0.02em   serif
h3          1.5rem                        / 1.2  / -0.01em   grotesk 600
body        1.0625rem                     / 1.65              grotesk 400
meta        0.75rem                       / 1.4  / 0.08em    mono UPPERCASE
code        0.875rem                      / 1.6              mono
```
Mixing rule: a headline can combine serif + one italic word + a mono suffix, e.g.
`Selected *Work* ` + `[04]` in mono.

## 3. Borders, shadows, radius
```css
--border:        2px solid var(--line);
--border-thick:  3px solid var(--line);
--radius:        0;            /* brutalist: square. Max 4px for inputs if needed */
--shadow:        6px 6px 0 0 var(--line);
--shadow-acid:   6px 6px 0 0 var(--acid);
--shadow-sm:     3px 3px 0 0 var(--line);
```
Interaction pattern (the "press"):
```css
.brut { border: var(--border); box-shadow: var(--shadow); transition: transform .12s, box-shadow .12s; }
.brut:hover  { transform: translate(-2px,-2px); box-shadow: 8px 8px 0 0 var(--acid); }
.brut:active { transform: translate(6px,6px);  box-shadow: 0 0 0 0 var(--line); }
```

## 4. Grid & layout
- 12-column grid, max-width 1360px, gutters 24px, outer padding `clamp(16px, 4vw, 48px)`.
- **Visible structure:** sections separated by full-width `--border` rules; optional faint
  column guides (`--line-soft`) behind the hero only.
- Editorial asymmetry: text blocks span 7 cols, meta sidebar spans 3–4 cols. Avoid centred layouts
  except the 404.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

## 5. Signature elements
1. **Masthead / top bar** — mono, full width, bordered:
   `SHAN.DEV ▌ ISSUE 01 — 2026 ▌ STATUS: ● OPEN TO WORK ▌ IST 14:32`
2. **Section header** — mono index + serif title + rule:
   `§02 ─────────` then `Selected *Work*` then a one-line mono prompt `$ ls ./projects --featured`
3. **Terminal window block** — bordered box with title bar `● ● ●  ~/shan/about.md`, mono content,
   blinking `▌` cursor in `--acid`.
4. **Byline** — under project titles: `BY MOHAMMAD SHAN · ROLE: BACKEND · NOV 25 — FEB 26`
5. **Drop cap** on the About paragraph (serif, 4 lines tall, `--acid`).
6. **Pull quote** — serif italic, huge, with thick left border in `--signal`.
7. **Tags** — mono, bordered, square: `[NEXT.JS]` `[POSTGRES]`.
8. **Status bar footer** — like vim/tmux: `NORMAL │ main │ utf-8 │ built with MERN │ © 2026`
9. **ASCII divider** (sparingly, max 2 per page): `+--------------------------------+`
10. **Numbers** — stats in giant serif numerals with mono captions (`3 SHIPPED PRODUCTS`).

## 6. Texture & effects (subtle — never above 6% opacity)
- Film grain: SVG noise overlay on `body::after`, opacity 0.04.
- Scanlines: only inside terminal blocks, `repeating-linear-gradient` 2px, opacity 0.05.
- No glow, no neon blur, no glassmorphism, no gradients (except the scanline pattern).
- Selection: `::selection { background: var(--acid); color: #0C0C0C; }`
- Cursor blink: `steps(1)` animation, 1s.

## 7. Motion
- Snappy, mechanical: 120–200ms, `cubic-bezier(.2,.8,.2,1)` or `steps()`.
- Hero: type-on effect for the prompt line only (not the headline). Headline appears with a
  hard clip-path wipe.
- Section reveal: 8px translate + opacity, once. No parallax, no floating blobs.
- Everything disabled under `prefers-reduced-motion`; cursor stays solid.

## 8. Voice & microcopy
Terminal tone for UI, editorial tone for content.
- Buttons: `VIEW PROJECT →`, `$ download resume.pdf`, `SEND MESSAGE ↵`
- Empty state: `> no results. try: ls --all`
- Loading: `fetching projects… [████░░░░] 48%`
- 404: serif headline "Page *not* found." + `bash: /xyz: No such file or directory`
- Form success: `✓ message queued. I'll reply within 48h.`

## 9. Do / Don't
| Do | Don't |
|---|---|
| One accent colour per component | Rainbow tags |
| Square corners, hard shadows | Rounded cards, soft drop shadows |
| Serif only at ≥ 28px | Serif body text |
| Mono for metadata | Mono for long paragraphs |
| Real content as design (dates, stacks, roles) | Lorem-ipsum "hacker" filler |
| Keyboard hints `[G] GitHub` that actually work | Decorative fake commands that do nothing |
