// Runs after `vite build` + the SSR build (see package.json "build").
// Writes a real HTML file per public page so crawlers (and link previews on LinkedIn, X,
// WhatsApp…) see full content and per-page meta without running JavaScript. Also writes
// 404.html (served with a real 404 status), app.html (empty shell for /admin), robots.txt
// and sitemap.xml.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const { render, indexablePaths, SITE_URL } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
for (const marker of ['<!--seo-->', '<div id="root"></div>', '<title>']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing ${marker}`);
}

function page({ head, html }) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, '') // the prerendered head brings its own title
    .replace('<!--seo-->', head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

async function write(file, contents) {
  const target = path.join(dist, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, contents);
  console.log(`  prerendered ${file}`);
}

// Public pages. With `cleanUrls` in vercel.json, /now is served from now.html.
const entries = indexablePaths();
for (const { path: route } of entries) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  await write(file, page(await render(route)));
}

// Unknown URLs: Vercel serves 404.html with a real 404 status (no soft-404s).
await write('404.html', page(await render('/404')));

// /admin/*: not prerendered, not indexable — an empty shell the SPA renders into.
await write(
  'app.html',
  template.replace('<!--seo-->', '<meta name="robots" content="noindex, nofollow" />'),
);

await write(
  'robots.txt',
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n'),
);

const urls = entries
  .map(({ path: route, lastmod }) =>
    [
      '  <url>',
      `    <loc>${SITE_URL}${route}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      '  </url>',
    ].join('\n'),
  )
  .join('\n');
await write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

await fs.rm(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${entries.length} pages + 404, robots.txt, sitemap.xml`);
