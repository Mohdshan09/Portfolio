import { describe, expect, it } from 'vitest';
import { parseChangelog, parseFrontmatter, readingMinutes } from '../markdownContent';

describe('parseFrontmatter', () => {
  it('reads strings, booleans, arrays and skips comments', () => {
    const raw = [
      '---',
      '# a comment',
      'title: "Prisma: the pitfalls"',
      'date: 2026-09-23',
      'tags: [prisma, "postgres"]',
      'draft: true',
      '---',
      '',
      'Body **here**.',
    ].join('\r\n');

    expect(parseFrontmatter(raw)).toEqual({
      data: {
        title: 'Prisma: the pitfalls',
        date: '2026-09-23',
        tags: ['prisma', 'postgres'],
        draft: true,
      },
      body: 'Body **here**.',
    });
  });

  it('treats a file without frontmatter as all body', () => {
    expect(parseFrontmatter('# Hello')).toEqual({ data: {}, body: '# Hello' });
  });
});

describe('readingMinutes', () => {
  it('never returns less than a minute', () => {
    expect(readingMinutes('short')).toBe(1);
    expect(readingMinutes('word '.repeat(660))).toBe(3);
  });
});

describe('parseChangelog', () => {
  it('parses entries in file order and ignores commented examples', () => {
    const raw = `# Changelog
<!--
## v9.9 · 2030-01-01
- example only
-->

## v1.3 · 2026-10-02
- Added **case study** [log](/changelog)
- Second item

## v1.2 - 2026-09-01
- Older`;

    const entries = parseChangelog(raw);
    expect(entries.map((e) => e.version)).toEqual(['v1.3', 'v1.2']);
    expect(entries[0]).toMatchObject({
      date: '2026-10-02',
      summary: 'Added case study log',
    });
    expect(entries[1]!.body).toBe('- Older');
  });
});
