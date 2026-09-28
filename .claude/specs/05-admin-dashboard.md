# 05 — Admin Dashboard (CMS)

Route base `/admin`, lazy-loaded so it's not in the public bundle.

## Pages
- `/admin/login`
- `/admin` — overview: counts, unread messages, quick links
- `/admin/profile` — edit singleton, upload avatar + resume PDF
- `/admin/projects` — table + create/edit form (markdown editor with preview, image upload, featured toggle)
- `/admin/experience`, `/admin/skills`, `/admin/publications`, `/admin/certificates`, `/admin/education`
- `/admin/messages` — inbox, mark read/archive

## Shared components
`DataTable` (sort, publish toggle, drag-to-reorder), `ResourceForm` (react-hook-form + zodResolver
using the same `/shared` schema), `ImageUploader`, `ConfirmDialog`, `Toast`.

## Acceptance
- Create → appears on public site after cache window without redeploy.
- Unpublish hides item from public API immediately.
- Delete asks for confirmation and removes the Cloudinary asset.
