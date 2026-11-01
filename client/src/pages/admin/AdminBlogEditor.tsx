import { useEffect, useState } from 'react';
import type { BlogInput } from '@portfolio/shared';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBlog, getAdminBlogs, updateBlog } from '../../api/blogs';
import { DiagramEditor } from '../../components/blog/DiagramEditor';
import { projects } from '../../content/data';

type Chapter = { id: string; title: string; content: string; diagram: Array<{ id: string; type: 'rectangle' | 'ellipse' | 'arrow' | 'text'; x: number; y: number; width: number; height: number; text?: string }> };
type Post = Omit<BlogInput, 'chapters'> & { chapters: Chapter[] };
const empty = (): Post => ({ projectSlug: projects[0]!.slug, title: '', slug: '', excerpt: '', status: 'draft', chapters: [{ id: crypto.randomUUID(), title: 'Introduction', content: '', diagram: [] }] });

export function AdminBlogEditor() {
  const { id } = useParams(); const nav = useNavigate(); const [post, setPost] = useState<Post>(empty); const [saving, setSaving] = useState(false); const [loading, setLoading] = useState(Boolean(id));
  const chapter = post.chapters[0]!;
  useEffect(() => { if (id) void getAdminBlogs().then(items => { const item = items.find(x => x.id === id); if (item) setPost(item as Post); }).finally(() => setLoading(false)); }, [id]);
  const setChapter = (next: Chapter) => setPost(p => ({ ...p, chapters: [next, ...p.chapters.slice(1)] }));
  const save = async (status: Post['status']) => { setSaving(true); try { const payload = { ...post, status }; const saved = id ? await updateBlog(id, payload) : await createBlog(payload); setPost(saved as Post); nav(`/admin/blogs/${saved.id}`, { replace: true }); } finally { setSaving(false); } };
  if (loading) return <main className="p-8 font-mono text-sm text-ink-dim">loading editor…</main>;
  return <main className="mx-auto max-w-7xl p-4 sm:p-8">
    <div className="mb-6 flex items-center justify-between"><div><p className="meta">ADMIN / PROJECT KNOWLEDGE BASE</p><h1 className="font-serif text-4xl">{id ? 'Edit post' : 'New post'}</h1></div><Link to="/admin/blogs" className="meta hover:text-acid">← ALL POSTS</Link></div>
    <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]"><aside className="space-y-4 border-2 border-line bg-surface p-4">
      <label className="meta block">PROJECT<select value={post.projectSlug} onChange={e => setPost({ ...post, projectSlug: e.target.value })} className="mt-2 w-full bg-bg p-3 text-ink">{projects.map(p => <option value={p.slug} key={p.slug}>{p.title}</option>)}</select></label>
      <label className="meta block">POST TITLE<input value={post.title} onChange={e => setPost({ ...post, title: e.target.value, slug: post.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} className="mt-2 w-full bg-bg p-3 text-ink" /></label>
      <label className="meta block">URL SLUG<input value={post.slug} onChange={e => setPost({ ...post, slug: e.target.value })} className="mt-2 w-full bg-bg p-3 text-ink" /></label>
      <label className="meta block">SUMMARY<textarea value={post.excerpt} onChange={e => setPost({ ...post, excerpt: e.target.value })} className="mt-2 min-h-24 w-full bg-bg p-3 text-ink" /></label>
      <p className="border-t border-line-soft pt-4 font-mono text-xs text-ink-mute">Published posts receive a server timestamp. Readers can only send private feedback.</p>
    </aside><section className="border-2 border-line bg-surface"><div className="border-b-2 border-line p-4"><p className="meta">CHAPTER 01 / WRITING CANVAS</p><input value={chapter.title} onChange={e => setChapter({ ...chapter, title: e.target.value })} className="mt-1 w-full bg-transparent font-serif text-3xl text-ink" /></div>
      <div className="grid lg:grid-cols-2"><textarea value={chapter.content} onChange={e => setChapter({ ...chapter, content: e.target.value })} className="min-h-[520px] resize-none bg-bg p-5 font-mono text-sm leading-7 text-ink" placeholder={'Write in Markdown…\n\n## A clear section\n\nExplain the decision and result.'} /><DiagramEditor elements={chapter.diagram} onChange={diagram => setChapter({ ...chapter, diagram })} /></div>
      <div className="flex justify-end gap-3 border-t-2 border-line p-4"><button disabled={saving} onClick={() => void save('draft')} className="border border-line px-4 py-2 font-mono text-sm">SAVE DRAFT</button><button disabled={saving} onClick={() => void save('published')} className="bg-acid px-4 py-2 font-mono text-sm text-white">PUBLISH NOW</button></div>
    </section></div>
  </main>;
}
