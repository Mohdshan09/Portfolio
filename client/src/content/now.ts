// The /now page. Edit ./now.md — see ./README.md.
import nowRaw from './now.md?raw';
import { isIsoDate, parseFrontmatter } from '../lib/markdownContent';

const { data, body } = parseFrontmatter(nowRaw);

export const now = {
  updated: isIsoDate(data.updated) ? data.updated : null,
  body,
  /** Drafts render in `npm run dev` only; production shows an empty state. */
  visible: import.meta.env.DEV || data.draft !== true,
  draft: data.draft === true,
};
