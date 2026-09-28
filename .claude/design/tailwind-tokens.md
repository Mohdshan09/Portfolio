# Tailwind Setup

## tailwind.config.ts
```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    borderRadius: { none: '0', DEFAULT: '0', sm: '2px', input: '4px' },
    extend: {
      colors: {
        bg: 'var(--bg)', surface: 'var(--surface)', 'surface-2': 'var(--surface-2)',
        ink: { DEFAULT: 'var(--ink)', dim: 'var(--ink-dim)', mute: 'var(--ink-mute)' },
        line: { DEFAULT: 'var(--line)', soft: 'var(--line-soft)' },
        acid: { DEFAULT: 'var(--acid)', hover: 'var(--acid-hover)' },
        signal: 'var(--signal)', amber: 'var(--amber)', cyan: 'var(--cyan)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Fraunces', 'Georgia', 'serif'],
        sans:  ['"Space Grotesk"', 'Archivo', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 9vw, 8.5rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-l':  ['clamp(2.5rem, 6vw, 5rem)',   { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        meta:         ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      boxShadow: {
        brut: '6px 6px 0 0 var(--line)',
        'brut-acid': '6px 6px 0 0 var(--acid)',
        'brut-sm': '3px 3px 0 0 var(--line)',
        none: 'none',
      },
      borderWidth: { 3: '3px' },
      transitionTimingFunction: { snap: 'cubic-bezier(.2,.8,.2,1)' },
      keyframes: { blink: { '0%,50%': { opacity: '1' }, '50.01%,100%': { opacity: '0' } } },
      animation: { blink: 'blink 1s steps(1) infinite' },
    },
  },
} satisfies Config;
```

## globals.css additions
```css
@layer base {
  body { @apply bg-bg text-ink font-sans antialiased; }
  ::selection { background: var(--acid); color: #0C0C0C; }
  :focus-visible { outline: 2px solid var(--acid); outline-offset: 3px; }
}
@layer components {
  .brut { @apply border-2 border-line shadow-brut transition-[transform,box-shadow] duration-150 ease-snap; }
  .brut:hover { transform: translate(-2px,-2px); box-shadow: 8px 8px 0 0 var(--acid-hover); }
  .brut:active { transform: translate(6px,6px); box-shadow: none; }
  .meta { @apply font-mono text-meta uppercase text-ink-mute; }
  .scanlines { background-image: repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px); }
  .cursor::after { content: '▌'; color: var(--acid); @apply animate-blink ml-1; }
}
body::after { /* grain */
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: .04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

## Fonts
Self-host via `@fontsource/instrument-serif`, `@fontsource/space-grotesk`, `@fontsource/jetbrains-mono`
(weights: serif 400 + italic, grotesk 400/500/600, mono 400/600). `font-display: swap`.
