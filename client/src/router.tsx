import { createBrowserRouter, matchRoutes } from 'react-router-dom';
import { routes } from './routes';

/**
 * Builds the browser router. Lazy routes matching the current URL are loaded *first*, so a
 * prerendered page (e.g. /now) hydrates against the same components the server rendered
 * instead of flashing empty while its chunk downloads.
 */
export async function createAppRouter() {
  const matches = matchRoutes(routes, window.location) ?? [];
  await Promise.all(
    matches.map(async ({ route }) => {
      if (!route.lazy) return;
      const loaded = await route.lazy();
      Object.assign(route, { ...loaded, lazy: undefined });
    }),
  );
  return createBrowserRouter(routes);
}
