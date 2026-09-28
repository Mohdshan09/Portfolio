import { motion, useReducedMotion } from 'framer-motion';
import { TerminalLine, TerminalWindow } from '../ui/TerminalWindow';
import { buttonClasses } from '../../lib/buttonClasses';
import { useTypedLines } from '../../hooks/useTypedLines';
import type { Profile } from '../../content/types';

const TERMINAL_ROWS: { prompt: '$' | '>'; text: string }[] = [
  { prompt: '$', text: 'whoami' },
  { prompt: '>', text: 'full-stack dev · MERN + Next.js' },
  { prompt: '$', text: 'cat stack.txt' },
  { prompt: '>', text: 'next · node · postgres' },
];

const TERMINAL_TEXTS = TERMINAL_ROWS.map((row) => row.text);

export function Hero({ profile }: { profile: Profile }) {
  const prefersReducedMotion = useReducedMotion();
  const { output, activeIndex, done } = useTypedLines(TERMINAL_TEXTS);

  return (
    <section id="top" className="relative overflow-hidden border-b-2 border-line">
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-meta text-ink-mute">
          <span>ISSUE 01 · FULL-STACK DEVELOPER · {profile.location.toUpperCase()}</span>
          {profile.availableForWork && (
            <span className="flex items-center gap-1.5 text-acid">
              <span className="h-1.5 w-1.5 bg-acid" /> OPEN TO WORK
            </span>
          )}
        </div>
        <div className="mt-4 h-0.5 w-full bg-line" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <motion.h1
              initial={prefersReducedMotion ? false : { clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-serif text-display-xl text-ink"
            >
              Mohammad
              <br />
              <em className="text-acid">Shan.</em>
            </motion.h1>

            <p className="mt-6 max-w-md text-lg text-ink-dim">
              Full-stack developer building ERPs, assessment platforms &amp; AI tools.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a href="#work" className={buttonClasses('primary', 'lg')}>
                VIEW WORK →
              </a>
              <a
                href={profile.resumeUrl}
                download
                className="font-mono text-ink hover:text-acid-hover hover:underline"
              >
                <span className="text-acid">$ </span>download resume.pdf
              </a>
            </div>
          </div>

          <TerminalWindow title="~/whoami">
            {TERMINAL_ROWS.map((row, i) => {
              if (i > activeIndex) return null;
              return (
                <TerminalLine key={row.text} prompt={row.prompt}>
                  {output[i] ?? ''}
                  {i === activeIndex && !done && <span className="cursor" />}
                </TerminalLine>
              );
            })}
            {done && (
              <TerminalLine prompt="$">
                <span className="cursor" />
              </TerminalLine>
            )}
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}
