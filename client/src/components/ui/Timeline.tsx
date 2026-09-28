import type { Experience } from '../../content/types';
import { formatMonthYear } from '../../lib/date';
import { Tag } from './Tag';

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <div className="divide-y-2 divide-line-soft border-y-2 border-line">
      {items.map((item) => (
        <div key={item.company} className="grid gap-4 py-8 sm:grid-cols-[160px_1fr]">
          <div className="font-mono text-meta text-ink-mute">
            <div>
              {formatMonthYear(item.startDate)} →{' '}
              {item.endDate ? formatMonthYear(item.endDate) : 'NOW'}
            </div>
            {!item.endDate && (
              <div className="mt-2 flex items-center gap-1.5 text-acid">
                <span className="h-1.5 w-1.5 bg-acid" /> ACTIVE
              </div>
            )}
          </div>
          <div className="border-l-[3px] border-line pl-6">
            <h3 className="font-serif text-2xl text-ink">{item.company}</h3>
            <p className="mt-1 font-mono text-meta text-ink-mute">{item.role.toUpperCase()}</p>
            <ul className="mt-4 space-y-2">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm text-ink-dim">
                  <span className="text-acid">→</span>
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.techStack.map((tech) => (
                <Tag key={tech}>[{tech.toUpperCase()}]</Tag>
              ))}
            </div>
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block font-mono text-sm text-ink hover:text-acid-hover hover:underline"
              >
                ↗ {new URL(item.liveUrl).hostname}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
