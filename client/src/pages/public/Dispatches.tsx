import { PageHeader } from '../../components/ui/PageHeader';
import { DispatchRow } from '../../components/ui/DispatchRow';
import { dispatches } from '../../content/dispatches';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function Dispatches() {
  useDocumentTitle('Dispatches');

  return (
    <main className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
      <PageHeader
        kicker="DISPATCHES · NOTES FROM THE BUILD"
        command="$ ls ./dispatches --sort=date"
        meta={`> ${dispatches.length} ${dispatches.length === 1 ? 'entry' : 'entries'}`}
      >
        Field <em>Notes.</em>
      </PageHeader>

      {dispatches.length > 0 ? (
        <ol className="divide-y divide-line-soft border-y-2 border-line">
          {dispatches.map((dispatch, i) => (
            <DispatchRow key={dispatch.slug} dispatch={dispatch} index={dispatches.length - i} />
          ))}
        </ol>
      ) : (
        <p className="font-mono text-sm text-ink-dim">&gt; no dispatches yet. check back soon.</p>
      )}
    </main>
  );
}
