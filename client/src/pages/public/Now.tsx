import { PageHeader } from '../../components/ui/PageHeader';
import { Markdown } from '../../components/ui/Markdown';
import { now } from '../../content/now';
import { daysSince, formatDay } from '../../lib/date';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function Now() {
  useDocumentTitle('Now');

  const age = now.updated ? daysSince(now.updated) : null;

  return (
    <main className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
      <PageHeader
        kicker="NOW · CURRENT STATUS"
        command="$ cat now.md"
        meta={
          now.visible && now.updated ? (
            <>
              LAST UPDATED {formatDay(now.updated)} · {age === 0 ? 'TODAY' : `${age} DAYS AGO`}
              {now.draft && <span className="ml-3 text-signal">[DRAFT]</span>}
            </>
          ) : undefined
        }
      >
        What I&apos;m doing <em>now.</em>
      </PageHeader>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {now.visible ? (
            <Markdown>{now.body}</Markdown>
          ) : (
            <p className="font-mono text-sm text-ink-dim">&gt; status pending. check back soon.</p>
          )}
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <p className="border-l-2 border-line-soft pl-4 font-mono text-meta text-ink-mute">
            A{' '}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-acid-hover"
            >
              now page
            </a>{' '}
            is a snapshot of what I&apos;m focused on at this point in my life. Updated roughly once
            a month.
          </p>
        </aside>
      </div>
    </main>
  );
}
