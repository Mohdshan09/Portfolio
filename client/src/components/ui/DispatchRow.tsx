import { Link } from 'react-router-dom';
import type { Dispatch } from '../../content/dispatches';
import { formatDay } from '../../lib/date';
import { Tag } from './Tag';

export function DispatchRow({ dispatch, index }: { dispatch: Dispatch; index: number }) {
  return (
    <li>
      <Link
        to={`/dispatches/${dispatch.slug}`}
        className="group grid gap-2 py-6 transition-colors duration-150 hover:bg-surface sm:grid-cols-[9rem_1fr_auto] sm:gap-6 sm:px-3"
      >
        <div className="font-mono text-meta text-ink-mute">
          #{String(index).padStart(2, '0')} · {formatDay(dispatch.date)}
        </div>
        <div>
          <h3 className="font-serif text-3xl leading-tight text-ink group-hover:text-acid-hover">
            {dispatch.title}
            {dispatch.draft && (
              <span className="ml-3 align-middle font-mono text-meta text-signal">[DRAFT]</span>
            )}
          </h3>
          {dispatch.summary && <p className="mt-2 max-w-2xl text-ink-dim">{dispatch.summary}</p>}
          {dispatch.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {dispatch.tags.map((tag) => (
                <Tag key={tag}>[{tag.toUpperCase()}]</Tag>
              ))}
            </div>
          )}
        </div>
        <div className="whitespace-nowrap font-mono text-meta text-ink-mute group-hover:text-acid-hover">
          {dispatch.readingMinutes} MIN READ →
        </div>
      </Link>
    </li>
  );
}
