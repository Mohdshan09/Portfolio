import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    borderRadius: { none: '0', DEFAULT: '0', sm: '2px', input: '4px' },
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: { DEFAULT: 'var(--ink)', dim: 'var(--ink-dim)', mute: 'var(--ink-mute)' },
        line: { DEFAULT: 'var(--line)', soft: 'var(--line-soft)' },
        acid: { DEFAULT: 'var(--acid)', hover: 'var(--acid-hover)' },
        signal: 'var(--signal)',
        amber: 'var(--amber)',
        cyan: 'var(--cyan)',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Space Grotesk"', 'Archivo', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': [
          'clamp(3.5rem, 9vw, 8.5rem)',
          { lineHeight: '0.9', letterSpacing: '-0.03em' },
        ],
        'display-l': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        meta: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
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
  plugins: [],
} satisfies Config;
