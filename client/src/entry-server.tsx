/* eslint-disable react-refresh/only-export-components -- build-time module, never hot-reloaded */
// Build-time renderer: turns each public route into static HTML (see scripts/prerender.mjs).
// Never shipped to browsers.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from './routes';
import { headTags, indexablePaths, seoForPath, serializeJsonLd, SITE_URL } from './seo';

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** <head> markup for a path: title, meta/link tags and JSON-LD, all marked `data-seo`. */
function renderHead(pathname: string): string {
  const seo = seoForPath(pathname);
  const tags = headTags(seo).map(({ tag, attrs }) => {
    const attrText = Object.entries(attrs)
      .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
      .join(' ');
    return `<${tag} ${attrText} data-seo />`;
  });
  const jsonLd = (seo.jsonLd ?? []).map(
    (data) => `<script type="application/ld+json" data-seo>${serializeJsonLd(data)}</script>`,
  );
  return [`<title>${escapeAttr(seo.title)}</title>`, ...tags, ...jsonLd].join('\n    ');
}

export async function render(pathname: string): Promise<{ html: string; head: string }> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`${SITE_URL}${pathname}`));
  if (context instanceof Response)
    throw new Error(`Unexpected redirect while prerendering ${pathname}`);

  const router = createStaticRouter(handler.dataRoutes, context);
  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={new QueryClient()}>
        {/* hydrate={false}: no inline hydration script (the CSP forbids inline scripts). */}
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
  return { html, head: renderHead(pathname) };
}

export { indexablePaths, SITE_URL };
