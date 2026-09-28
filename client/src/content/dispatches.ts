// Loads every Markdown file in ./dispatches at build time. To publish a post, add a .md file
// there — see ./README.md. Files starting with `_` (like _template.md) are ignored.
import { isIsoDate, parseFrontmatter, readingMinutes } from '../lib/markdownContent';

export interface Dispatch {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  draft: boolean;
  readingMinutes: number;
  body: string;
}

const files = import.meta.glob('./dispatches/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function toDispatch(path: string, raw: string): Dispatch | null {
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  if (slug.startsWith('_')) return null;

  const { data, body } = parseFrontmatter(raw);
  const problems: string[] = [];
  if (typeof data.title !== 'string' || !data.title) problems.push('`title` is required');
  if (!isIsoDate(data.date)) problems.push('`date` must look like 2026-09-23');
  if (problems.length) {
    const message = `[dispatches] ${path}: ${problems.join(', ')}`;
    // Loud while writing, but never take the live site down over one bad post.
    if (import.meta.env.DEV) throw new Error(message);
    console.warn(message);
    return null;
  }

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: typeof data.summary === 'string' ? data.summary : '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
    readingMinutes: readingMinutes(body),
    body,
  };
}

/** Newest first. Drafts are visible in `npm run dev` only. */
export const dispatches: Dispatch[] = Object.entries(files)
  .map(([path, raw]) => toDispatch(path, raw))
  .filter((d): d is Dispatch => d !== null && (import.meta.env.DEV || !d.draft))
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

export function getDispatch(slug: string): Dispatch | undefined {
  return dispatches.find((d) => d.slug === slug);
}
