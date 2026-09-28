# UI / UX Review

- [ ] Looks right at 360px, 768px, 1280px, 1920px
- [ ] Dark and light themes both readable; no flash of wrong theme on load
- [ ] Consistent spacing scale and type scale (Tailwind tokens only, no arbitrary values sprinkled around)
- [ ] Hero communicates who/what within 5 seconds; primary CTA obvious
- [ ] Project cards show role + stack + links; images have alt text
- [ ] Keyboard-only navigation works end to end; focus visible
- [ ] Animations subtle and disabled with `prefers-reduced-motion`
- [ ] All external links `target="_blank" rel="noopener noreferrer"`
- [ ] Typos/grammar checked in all copy

## Terminal Press style compliance
- [ ] Only tokens used — no raw hex, no fonts outside serif/grotesk/mono stacks
- [ ] Serif only at ≥ 28px; body text in grotesk; metadata in mono uppercase
- [ ] Square corners everywhere (inputs max 4px); no gradients, blur, glow, or soft shadows
- [ ] Hard offset shadows + press interaction on all interactive boxes
- [ ] Max one accent colour per component; text on `--acid` is `#0C0C0C`
- [ ] Grain ≤ 4% and scanlines only inside TerminalWindow
- [ ] Terminal microcopy is real and functional — every shown shortcut works
- [ ] Research block is the single inverted section on the home page
- [ ] Admin uses plain variant (no grain, no type-on)
