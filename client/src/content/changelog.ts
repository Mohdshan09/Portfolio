// The /changelog page and the version shown in the footer. Edit ./changelog.md — see ./README.md.
import changelogRaw from './changelog.md?raw';
import { parseChangelog } from '../lib/markdownContent';

export const changelog = parseChangelog(changelogRaw);
export const latestRelease = changelog[0];
