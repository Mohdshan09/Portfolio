import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { logout, refreshSession, useIsAuthenticated } from '../../api/auth';
import { useNoIndex } from './useNoIndex';

/** Guards every /admin page: silent refresh on first load, otherwise off to /admin/login. */
export function AdminLayout() {
  const authed = useIsAuthenticated();
  const [checked, setChecked] = useState(authed);
  useNoIndex();

  useEffect(() => {
    if (!checked) void refreshSession().finally(() => setChecked(true));
  }, [checked]);

  if (!checked) {
    return <p className="p-6 font-mono text-sm text-ink-dim">authenticating…</p>;
  }
  if (!authed) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b-2 border-line">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 font-mono text-meta uppercase">
          <span className="text-ink">
            SHAN.DEV <span className="text-ink-mute">/ ADMIN</span>
          </span>
          <nav className="flex items-center gap-5">
            <Link to="/" className="text-ink-dim hover:text-acid-hover">
              ↗ VIEW SITE
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-ink-dim hover:text-acid-hover"
            >
              [LOG OUT]
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
