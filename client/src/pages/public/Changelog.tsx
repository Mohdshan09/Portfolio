import { PageHeader } from '../../components/ui/PageHeader';
import { Markdown } from '../../components/ui/Markdown';
import { changelog } from '../../content/changelog';
import { formatDay } from '../../lib/date';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function Changelog() {
  useDocumentTitle('Changelog');

  return (
    <main className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
      <PageHeader kicker="CHANGELOG · SITE RELEASES" command="$ git log --oneline --reverse">
        Release <em>Notes.</em>
      </PageHeader>

      {changelog.length > 0 ? (
        <ol className="divide-y divide-line-soft border-y-2 border-line">
          {changelog.map((entry) => (
            <li
              key={entry.version}
              id={entry.version}
              className="grid gap-3 py-6 sm:grid-cols-[12rem_1fr] sm:gap-6"
            >
              <div className="font-mono">
                <div className="text-lg text-acid">{entry.version}</div>
                <time dateTime={entry.date} className="text-meta text-ink-mute">
                  {formatDay(entry.date)}
                </time>
              </div>
              <Markdown className="max-w-2xl">{entry.body}</Markdown>
            </li>
          ))}
        </ol>
      ) : (
        <p className="font-mono text-sm text-ink-dim">&gt; no releases logged yet.</p>
      )}
    </main>
  );
}
