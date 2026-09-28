import { Link } from 'react-router-dom';
import { SectionHeader } from '../ui/SectionHeader';
import { DispatchRow } from '../ui/DispatchRow';
import type { Dispatch } from '../../content/dispatches';

const LIMIT = 3;

/** Latest posts on the home page. Renders nothing until the first dispatch exists. */
export function LatestDispatches({ dispatches }: { dispatches: Dispatch[] }) {
  if (dispatches.length === 0) return null;

  return (
    <section id="dispatches" className="border-b-2 border-line">
      <div className="mx-auto max-w-[1360px] px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeader index="06" command="$ tail -n 3 ./dispatches">
          Latest <em>Dispatches</em>
        </SectionHeader>

        <ol className="divide-y divide-line-soft border-y-2 border-line">
          {dispatches.slice(0, LIMIT).map((dispatch, i) => (
            <DispatchRow key={dispatch.slug} dispatch={dispatch} index={dispatches.length - i} />
          ))}
        </ol>

        <Link
          to="/dispatches"
          className="mt-8 inline-block font-mono text-ink underline-offset-4 hover:text-acid-hover hover:underline"
        >
          <span className="text-acid">$ </span>ls ./dispatches --all →
        </Link>
      </div>
    </section>
  );
}
