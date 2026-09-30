import { Link } from 'react-router-dom';
import { latestRelease } from '../../content/changelog';

export function StatusBar() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-line bg-surface-2 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta text-ink-mute">
        <span>NORMAL</span>
        <span>│</span>
        <span>main</span>
        <span>│</span>
        <span>utf-8</span>
        <span>│</span>
        <span>built with MERN</span>
        <span>│</span>
        <span suppressHydrationWarning>© {year} Mohammad Shan</span>
        {latestRelease && (
          <>
            <span>│</span>
            <Link
              to="/changelog"
              className="min-w-0 truncate hover:text-acid-hover hover:underline"
              title="View changelog"
            >
              {latestRelease.version} — {latestRelease.summary.toLowerCase()}
            </Link>
          </>
        )}
      </div>
    </footer>
  );
}
