import { useState } from 'react';
import type { AnalyticsResponse } from '@portfolio/shared';
import { useAnalytics } from '../../api/analytics';
import { cn } from '../../lib/cn';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const RANGES = [7, 30, 90] as const;

const dayLabel = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });
const timeLabel = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});
const formatDay = (isoDate: string) => dayLabel.format(new Date(`${isoDate}T00:00:00`));

export function AdminAnalytics() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(7);
  const analytics = useAnalytics(days);
  useDocumentTitle('Analytics');

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-5xl text-ink">Analytics</h1>
        <div role="group" aria-label="Date range" className="flex font-mono text-meta">
          {RANGES.map((range) => (
            <button
              key={range}
              type="button"
              aria-pressed={days === range}
              onClick={() => setDays(range)}
              className={cn(
                'border-2 border-line px-3 py-1.5 [&+&]:-ml-[2px]',
                days === range ? 'bg-ink text-bg' : 'text-ink-dim hover:text-ink',
              )}
            >
              {range}D
            </button>
          ))}
        </div>
      </div>

      {analytics.isPending ? (
        <p className="py-10 font-mono text-sm text-ink-dim">fetching analytics…</p>
      ) : analytics.isError ? (
        <p className="py-10 font-mono text-sm text-signal">
          ERR: couldn&apos;t load analytics.{' '}
          <button type="button" onClick={() => void analytics.refetch()} className="underline">
            retry
          </button>
        </p>
      ) : (
        <Dashboard data={analytics.data} />
      )}
    </main>
  );
}

function Dashboard({ data }: { data: AnalyticsResponse }) {
  return (
    <>
      <dl className="mt-8 grid grid-cols-3 border-2 border-line">
        <Stat label="PAGE VIEWS" value={data.totals.views} />
        <Stat label="UNIQUE VISITORS" value={data.totals.visitors} />
        <Stat label="MESSAGES" value={data.totals.messages} />
      </dl>

      <section className="mt-10">
        <h2 className="font-mono text-meta text-ink-mute">
          DAILY PAGE VIEWS · LAST {data.days} DAYS
        </h2>
        <DailyChart daily={data.daily} />
      </section>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <RankedList
          title="TOP PAGES"
          rows={data.topPages.map((p) => ({ key: p.path, label: p.path, views: p.views }))}
          empty="no page views yet."
        />
        <RankedList
          title="TOP REFERRERS"
          rows={data.topReferrers.map((r) => ({ key: r.host, label: r.host, views: r.views }))}
          empty="no external referrers yet — share your link."
        />
      </div>

      <section className="mt-10">
        <h2 className="font-mono text-meta text-ink-mute">RECENT ACTIVITY</h2>
        {data.recent.length === 0 ? (
          <p className="mt-3 font-mono text-sm text-ink-dim">&gt; no visits yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line-soft border-t border-line-soft font-mono text-sm">
            {data.recent.map((view, i) => (
              <li key={`${view.createdAt}-${i}`} className="flex flex-wrap gap-x-4 py-2">
                <time dateTime={view.createdAt} className="w-28 text-ink-mute">
                  {timeLabel.format(new Date(view.createdAt))}
                </time>
                <span className="min-w-0 flex-1 truncate text-ink">{view.path}</span>
                <span className="text-ink-dim">
                  {view.referrerHost ? `from ${view.referrerHost}` : 'direct'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-line p-4 [&+&]:border-l-2 sm:p-6">
      <dd className="font-serif text-5xl leading-none text-ink sm:text-6xl">
        {value.toLocaleString('en-IN')}
      </dd>
      <dt className="mt-2 font-mono text-meta text-ink-mute">{label}</dt>
    </div>
  );
}

/** Single-series bar chart: one bar per day, hover/focus for exact numbers, table fallback. */
function DailyChart({ daily }: { daily: AnalyticsResponse['daily'] }) {
  const max = Math.max(1, ...daily.map((d) => d.views));
  const labelEvery = Math.ceil(daily.length / 7);

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        {/* y-axis: just the scale's top and baseline — recessive, mono, muted */}
        <div className="flex h-48 flex-col justify-between text-right font-mono text-meta text-ink-mute">
          <span>{max}</span>
          <span>0</span>
        </div>
        <div className="relative flex h-48 flex-1 items-end gap-[2px] border-b-2 border-l border-b-line border-l-line-soft">
          {daily.map((day) => (
            <div
              key={day.date}
              tabIndex={0}
              aria-label={`${formatDay(day.date)}: ${day.views} views, ${day.visitors} visitors`}
              // Full-height column = hit target bigger than the bar itself.
              className="group relative flex h-full flex-1 items-end outline-none"
            >
              <div
                className="w-full bg-acid transition-colors group-hover:bg-acid-hover group-focus-visible:bg-acid-hover"
                style={{ height: day.views ? `max(${(day.views / max) * 100}%, 2px)` : 0 }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap border-2 border-line bg-surface px-2 py-1 font-mono text-meta text-ink shadow-brut-sm group-hover:block group-focus-visible:block">
                {formatDay(day.date)} · {day.views} views · {day.visitors} visitors
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* x-axis: a label every few days so they never collide */}
      <div className="ml-[calc(theme(spacing.3)+2ch)] mt-2 flex gap-[2px] font-mono text-meta text-ink-mute">
        {daily.map((day, i) => (
          <span key={day.date} className="flex-1 overflow-visible whitespace-nowrap">
            {i % labelEvery === 0 ? formatDay(day.date) : ''}
          </span>
        ))}
      </div>

      <details className="mt-4 font-mono text-meta text-ink-dim">
        <summary className="cursor-pointer hover:text-ink">VIEW AS TABLE</summary>
        <table className="mt-3 w-full max-w-md text-left">
          <thead>
            <tr className="border-b-2 border-line text-ink-mute">
              <th className="py-1 font-normal">DATE</th>
              <th className="py-1 text-right font-normal">VIEWS</th>
              <th className="py-1 text-right font-normal">VISITORS</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((day) => (
              <tr key={day.date} className="border-b border-line-soft">
                <td className="py-1">{formatDay(day.date)}</td>
                <td className="py-1 text-right text-ink">{day.views}</td>
                <td className="py-1 text-right">{day.visitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function RankedList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { key: string; label: string; views: number }[];
  empty: string;
}) {
  return (
    <section>
      <h2 className="font-mono text-meta text-ink-mute">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 font-mono text-sm text-ink-dim">&gt; {empty}</p>
      ) : (
        <ol className="mt-3 divide-y divide-line-soft border-t border-line-soft font-mono text-sm">
          {rows.map((row) => (
            <li key={row.key} className="flex justify-between gap-4 py-2">
              <span className="min-w-0 truncate text-ink">{row.label}</span>
              <span className="text-ink-dim">{row.views}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
