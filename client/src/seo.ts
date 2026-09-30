// Per-page SEO metadata — the single source for <title>, meta description, canonical URL,
// Open Graph / Twitter tags and JSON-LD. Used twice:
//   • at build time by the prerenderer (entry-server.tsx → static HTML for crawlers)
//   • in the browser by <Seo /> when navigating between pages
import { education, experience, profile, skills } from './content/data';
import { dispatches, getDispatch } from './content/dispatches';
import { now } from './content/now';

/** Canonical origin. Change here (or set VITE_SITE_URL) when you add a custom domain. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? 'https://mdshan-portfolio.vercel.app'
).replace(/\/+$/, '');

const SITE_NAME = 'Mohammad Shan';
const OG_IMAGE = { url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 };

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'profile' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  jsonLd?: Record<string, unknown>[];
}

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: profile.name,
  url: SITE_URL,
  jobTitle: 'Full-Stack Developer',
  description: profile.summary,
  email: `mailto:${profile.email}`,
  image: OG_IMAGE.url,
  address: { '@type': 'PostalAddress', addressLocality: 'Raipur', addressCountry: 'IN' },
  sameAs: Object.values(profile.socials).filter(Boolean),
  knowsAbout: skills.flatMap((group) => group.items),
  alumniOf: education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
  worksFor: experience
    .filter((e) => e.endDate === null)
    .map((e) => ({ '@type': 'Organization', name: e.company })),
};

/** Metadata for any public path. Unknown paths get 404 metadata (noindex). */
export function seoForPath(pathname: string): PageSeo {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return {
      title: 'Mohammad Shan — Full-Stack Developer (MERN & Next.js) · Raipur, India',
      description:
        'Mohammad Shan is a full-stack developer from Raipur, India, building school ERPs, ' +
        'B2B assessment platforms and AI tools with React, Next.js, Node.js and PostgreSQL.',
      path,
      type: 'profile',
      jsonLd: [
        { '@context': 'https://schema.org', ...person },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          author: { '@id': person['@id'] },
        },
      ],
    };
  }

  if (path === '/dispatches') {
    return {
      title: 'Dispatches — Engineering notes by Mohammad Shan',
      description:
        'Field notes from building real products: multi-tenant scoping, Prisma and PostgreSQL, ' +
        'background jobs and full-stack architecture, written by Mohammad Shan.',
      path,
      type: 'website',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Dispatches',
          url: `${SITE_URL}${path}`,
          author: { '@id': person['@id'] },
          blogPost: dispatches.map((d) => ({
            '@type': 'BlogPosting',
            headline: d.title,
            url: `${SITE_URL}/dispatches/${d.slug}`,
            datePublished: d.date,
          })),
        },
      ],
    };
  }

  const post = path.startsWith('/dispatches/') ? getDispatch(path.slice(12)) : undefined;
  if (post) {
    return {
      title: `${post.title} — Mohammad Shan`,
      description: post.summary || `${post.title} — a dispatch by Mohammad Shan.`,
      path,
      type: 'article',
      noindex: post.draft,
      publishedTime: post.date,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          keywords: post.tags.join(', '),
          url: `${SITE_URL}${path}`,
          mainEntityOfPage: `${SITE_URL}${path}`,
          image: OG_IMAGE.url,
          author: { '@type': 'Person', name: profile.name, url: SITE_URL },
        },
      ],
    };
  }

  if (path === '/now') {
    return {
      title: 'Now — What Mohammad Shan is working on',
      description:
        'What Mohammad Shan is building, learning and reading right now. Updated about once a month.',
      path,
      type: 'website',
      // An unpublished (draft) Now page is just a placeholder — keep it out of the index.
      noindex: !now.visible,
    };
  }

  if (path === '/changelog') {
    return {
      title: 'Changelog — Mohammad Shan portfolio',
      description: 'Release notes for this portfolio site: what changed and when.',
      path,
      type: 'website',
    };
  }

  return {
    title: 'Page not found — Mohammad Shan',
    description: 'This page does not exist.',
    path,
    type: 'website',
    noindex: true,
  };
}

/** Paths that should be prerendered and listed in the sitemap (published content only). */
export function indexablePaths(): { path: string; lastmod?: string }[] {
  return [
    { path: '/' },
    { path: '/dispatches', lastmod: dispatches[0]?.date },
    ...dispatches
      .filter((d) => !d.draft)
      .map((d) => ({ path: `/dispatches/${d.slug}`, lastmod: d.date })),
    ...(now.visible ? [{ path: '/now', lastmod: now.updated ?? undefined }] : []),
    { path: '/changelog' },
  ];
}

interface HeadTag {
  tag: 'meta' | 'link';
  attrs: Record<string, string>;
}

/** The head tags for a page, as data — rendered to a string at build time, applied to the DOM at runtime. */
export function headTags(seo: PageSeo): HeadTag[] {
  const url = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`;
  const meta = (key: 'name' | 'property', id: string, content: string): HeadTag => ({
    tag: 'meta',
    attrs: { [key]: id, content },
  });
  return [
    meta('name', 'description', seo.description),
    meta(
      'name',
      'robots',
      seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    ),
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:type', seo.type),
    meta('property', 'og:title', seo.title),
    meta('property', 'og:description', seo.description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', OG_IMAGE.url),
    meta('property', 'og:image:width', String(OG_IMAGE.width)),
    meta('property', 'og:image:height', String(OG_IMAGE.height)),
    meta('property', 'og:locale', 'en_IN'),
    ...(seo.publishedTime ? [meta('property', 'article:published_time', seo.publishedTime)] : []),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', seo.title),
    meta('name', 'twitter:description', seo.description),
    meta('name', 'twitter:image', OG_IMAGE.url),
  ];
}

/** JSON-LD must not be able to close its own <script> tag. */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
