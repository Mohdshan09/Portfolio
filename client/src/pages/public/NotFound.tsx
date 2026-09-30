import { Link, useLocation } from 'react-router-dom';
import { buttonClasses } from '../../lib/buttonClasses';

export function NotFound() {
  const { pathname } = useLocation();

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1360px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <h1 className="font-serif text-display-l text-ink">
        Page <em className="text-acid">not</em> found.
      </h1>
      <p className="mt-6 break-all font-mono text-sm text-ink-dim" suppressHydrationWarning>
        bash: {pathname}: No such file or directory
      </p>
      <Link to="/" className={`${buttonClasses('secondary')} mt-10`}>
        $ cd ~
      </Link>
    </main>
  );
}
