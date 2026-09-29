import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient } from '../api/client';

/**
 * Sends one anonymous page view per route change (path + first-visit referrer only).
 * Off in dev (local and prod share one database) and for visitors with Do Not Track on.
 */
export function usePageTracking() {
  const { pathname } = useLocation();
  const isFirstView = useRef(true);

  useEffect(() => {
    if (import.meta.env.DEV || navigator.doNotTrack === '1') return;
    // document.referrer never changes inside an SPA, so only the landing page gets it.
    const referrer = isFirstView.current ? document.referrer || undefined : undefined;
    isFirstView.current = false;
    apiClient.post('/track', { path: pathname, referrer }).catch(() => {
      // Analytics must never break the page.
    });
  }, [pathname]);
}
