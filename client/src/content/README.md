# Writing content

You don't need to touch any code. Everything below is plain Markdown in this folder, and
the site picks it up automatically. Run `npm run dev` to preview, then commit and deploy
to publish.

| What                    | File                                      | URL                                      |
| ----------------------- | ----------------------------------------- | ---------------------------------------- |
| Dispatches (blog posts) | `dispatches/<slug>.md`, one file per post | `/dispatches`, `/dispatches/<slug>`      |
| Now page                | `now.md`                                  | `/now`                                   |
| Changelog               | `changelog.md`                            | `/changelog` + the version in the footer |

## Dispatches

1. Copy `dispatches/_template.md` to `dispatches/your-post-name.md`. The file name becomes the URL.
2. Fill in `title`, `date` (`YYYY-MM-DD`), `summary`, `tags`.
3. Write the post below the second `---`.
4. Leave `draft: true` while writing. Drafts show up in `npm run dev` with a DRAFT label
   and never appear on the live site. Set `draft: false` to publish.

Posts are sorted newest first by `date`. The home page shows the latest three.
To edit a post, just edit the file. To remove one, delete the file.

Images: put them in `client/public/dispatches/` and use `![alt text](/dispatches/file.png)`.

If a post is missing `title` or has a malformed `date`, `npm run dev` shows an error
naming the file. In production the post is skipped instead of breaking the site.

## Now page

Edit the bullets in `now.md` and bump `updated:` to today's date. The page shows how many
days ago it was updated, so aim for about once a month. Rename, add or remove the `##`
sections as you like.

## Changelog

Add a new entry at the top of `changelog.md`:

```md
## v1.3 · 2026-10-02

- Added ExamLyst case study
- Fixed contact form on mobile
```

The newest entry's first bullet shows in the footer (`v1.3 — Added ExamLyst case study`).
