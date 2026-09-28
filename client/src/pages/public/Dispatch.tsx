import { Link, useParams } from 'react-router-dom';
import { Markdown } from '../../components/ui/Markdown';
import { Tag } from '../../components/ui/Tag';
import { dispatches, getDispatch } from '../../content/dispatches';
import { profile } from '../../content/data';
import { formatDay } from '../../lib/date';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { NotFound } from './NotFound';

export function Dispatch() {
  const { slug = '' } = useParams();
  const dispatch = getDispatch(slug);
  useDocumentTitle(dispatch?.title);

  if (!dispatch) return <NotFound />;

  // `dispatches` is newest-first, so the next-older post sits at i + 1.
  const i = dispatches.indexOf(dispatch);
  const older = dispatches[i + 1];
  const newer = dispatches[i - 1];

  return (
    <main>
      <article className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/dispatches"
            className="font-mono text-meta text-ink-mute hover:text-acid-hover"
          >
            ← DISPATCH #{String(dispatches.length - i).padStart(2, '0')}
          </Link>

          <h1 className="mt-4 font-serif text-display-l text-ink">
            {dispatch.title}
            {dispatch.draft && (
              <span className="ml-3 align-middle font-mono text-meta text-signal">[DRAFT]</span>
            )}
          </h1>
          {dispatch.summary && (
            <p className="mt-6 text-xl leading-relaxed text-ink-dim">{dispatch.summary}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y-2 border-line py-3 font-mono text-meta text-ink-mute">
            <span>BY {profile.name.toUpperCase()}</span>
            <span>·</span>
            <time dateTime={dispatch.date}>{formatDay(dispatch.date)}</time>
            <span>·</span>
            <span>{dispatch.readingMinutes} MIN READ</span>
            {dispatch.tags.length > 0 && (
              <span className="flex flex-wrap gap-2 sm:ml-auto">
                {dispatch.tags.map((tag) => (
                  <Tag key={tag}>[{tag.toUpperCase()}]</Tag>
                ))}
              </span>
            )}
          </div>

          <Markdown className="mt-10">{dispatch.body}</Markdown>
        </div>
      </article>

      {(older || newer) && (
        <nav className="grid border-t-2 border-line sm:grid-cols-2" aria-label="More dispatches">
          {older ? (
            <Link
              to={`/dispatches/${older.slug}`}
              className="group border-b-2 border-line p-6 hover:bg-surface sm:border-b-0 sm:border-r-2 sm:p-10"
            >
              <span className="font-mono text-meta text-ink-mute">← OLDER</span>
              <span className="mt-2 block font-serif text-3xl text-ink group-hover:text-acid-hover">
                {older.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block sm:border-r-2 sm:border-line" />
          )}
          {newer && (
            <Link
              to={`/dispatches/${newer.slug}`}
              className="group p-6 text-right hover:bg-surface sm:p-10"
            >
              <span className="font-mono text-meta text-ink-mute">NEWER →</span>
              <span className="mt-2 block font-serif text-3xl text-ink group-hover:text-acid-hover">
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
