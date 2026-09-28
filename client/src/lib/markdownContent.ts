// Parsing helpers for the hand-written Markdown content in src/content/.
// Kept dependency-free (no gray-matter — it needs Node's Buffer) and pure so it's easy to test.

export type FrontmatterValue = string | boolean | string[];

export interface ParsedMarkdown {
  data: Record<string, FrontmatterValue>;
  body: string;
}

function parseValue(raw: string): FrontmatterValue {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item.trim()))
      .filter(Boolean);
  }
  return unquote(value);
}

function unquote(value: string): string {
  const quoted = /^(['"])(.*)\1$/.exec(value);
  return quoted ? quoted[2]! : value;
}

/**
 * Splits a `---` frontmatter block from the Markdown body.
 * Supports `key: value`, `key: true|false`, `key: [a, b]` and `# comments`.
 */
export function parseFrontmatter(raw: string): ParsedMarkdown {
  const match = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw.trim() };

  const data: Record<string, FrontmatterValue> = {};
  for (const line of match[1]!.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    data[line.slice(0, colon).trim()] = parseValue(line.slice(colon + 1));
  }
  return { data, body: match[2]!.trim() };
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** ~220 wpm, never below 1 minute. Code blocks count like prose — close enough. */
export function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export interface ChangelogEntry {
  version: string;
  date: string;
  body: string;
  /** First bullet of the entry, as plain text — shown in the footer. */
  summary: string;
}

/**
 * Reads entries shaped like:
 *   ## v1.3 · 2026-09-23
 *   - Added case study log
 * Anything before the first `## v…` heading (e.g. a `# Changelog` title) is ignored.
 * Entries are returned in file order, so keep the newest at the top.
 */
export function parseChangelog(source: string): ChangelogEntry[] {
  const raw = source.replace(/<!--[\s\S]*?-->/g, '');
  const entries: ChangelogEntry[] = [];
  const heading = /^##\s+(v[\w.-]+)\s*[·—–|-]\s*(\d{4}-\d{2}-\d{2})\s*$/gm;
  const matches = [...raw.matchAll(heading)];

  matches.forEach((match, i) => {
    const start = match.index! + match[0].length;
    const end = matches[i + 1]?.index ?? raw.length;
    const body = raw.slice(start, end).trim();
    const firstBullet = /^\s*[-*]\s+(.+)$/m.exec(body)?.[1] ?? '';
    entries.push({
      version: match[1]!,
      date: match[2]!,
      body,
      summary: stripInlineMarkdown(firstBullet),
    });
  });

  return entries;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim();
}
