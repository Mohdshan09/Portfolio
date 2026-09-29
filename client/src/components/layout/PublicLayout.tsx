import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Masthead } from '../ui/Masthead';
import { StatusBar } from '../ui/StatusBar';
import { profile } from '../../content/data';
import { usePageTracking } from '../../hooks/usePageTracking';

export function PublicLayout() {
  usePageTracking();

  return (
    // Column layout keeps the StatusBar pinned to the bottom on short pages (Now, 404, …).
    <div className="flex min-h-screen flex-col">
      <Masthead availableForWork={profile.availableForWork} />
      <div className="flex-1">
        <Outlet />
      </div>
      <StatusBar />
      <ScrollRestoration />
    </div>
  );
}
