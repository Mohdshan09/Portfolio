import { formatMonthYear } from '../../lib/date';
import type { Publication } from '../../content/types';

export function Research({ publication }: { publication: Publication }) {
  return (
    <section id="research" className="border-b-2 border-line bg-ink text-bg">
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex items-center gap-4">
          <span className="font-mono text-meta opacity-60">§04</span>
          <span className="h-px flex-grow bg-bg opacity-20" />
        </div>

        <p className="mt-6 font-mono text-meta opacity-70">
          {publication.venue} · VOL {publication.volume} · ISSUE {publication.issue} ·{' '}
          {formatMonthYear(publication.date)}
        </p>
        <h2 className="mt-3 max-w-3xl font-serif text-display-l">{publication.title}</h2>
        <p className="mt-6 max-w-2xl text-lg opacity-80">{publication.summary}</p>

        <ul className="mt-6 max-w-2xl space-y-2">
          {publication.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 opacity-80">
              <span>→</span>
              {bullet}
            </li>
          ))}
        </ul>

        {publication.certificateUrl && (
          <a
            href={publication.certificateUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 border-2 border-bg px-5 py-3 font-mono uppercase tracking-wide transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            VIEW CERTIFICATE ↗
          </a>
        )}
      </div>
    </section>
  );
}
