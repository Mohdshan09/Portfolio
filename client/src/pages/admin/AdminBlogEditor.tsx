import { useEffect, useRef, useState } from 'react';
import { blogInputSchema, type BlogInput } from '@portfolio/shared';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBlog, getAdminBlogs, updateBlog } from '../../api/blogs';
import { DiagramEditor } from '../../components/blog/DiagramEditor';
import { Markdown } from '../../components/ui/Markdown';
import { projects } from '../../content/data';
import { cn } from '../../lib/cn';

type Chapter = NonNullable<BlogInput['chapters'][number]>;
type Post = Omit<BlogInput, 'chapters'> & { chapters: Chapter[] };

const emptyPost = (): Post => ({
  projectSlug: projects[0]!.slug,
  title: '',
  slug: '',
  excerpt: '',
  status: 'draft',
  chapters: [{ id: crypto.randomUUID(), title: 'Introduction', content: '', diagram: [] }],
});

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const TABS = ['write', 'diagram', 'settings'] as const;
type Tab = (typeof TABS)[number];

function localIssues(post: Post): string[] {
  const result = blogInputSchema.safeParse(post);
  if (result.success) return [];
  return result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
}

type SaveErrorBody = { error?: { message?: string; fields?: Record<string, string> } };

function serverIssues(error: unknown): string[] {
  const response = (error as { response?: { data?: SaveErrorBody } })?.response;
  const data = response?.data?.error;
  if (!data) return ['Could not save — is the API server running?'];
  if (!data.fields) return [data.message ?? 'Could not save the post.'];
  return Object.entries(data.fields).map(([path, message]) => `${path}: ${message}`);
}

export function AdminBlogEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState<Post>(emptyPost);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [chapterId, setChapterId] = useState(() => post.chapters[0]!.id);
  const [tab, setTab] = useState<Tab>('write');
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    void getAdminBlogs()
      .then((items) => {
        const item = items.find((x) => x.id === id);
        if (item) {
          setPost(item as Post);
          setChapterId(item.chapters[0]?.id ?? crypto.randomUUID());
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const chapter = post.chapters.find((c) => c.id === chapterId) ?? post.chapters[0]!;
  const setChapter = (next: Chapter) =>
    setPost((p) => ({ ...p, chapters: p.chapters.map((c) => (c.id === next.id ? next : c)) }));

  const addChapter = () => {
    if (post.chapters.length >= 30) return;
    const fresh: Chapter = { id: crypto.randomUUID(), title: '', content: '', diagram: [] };
    setPost((p) => ({ ...p, chapters: [...p.chapters, fresh] }));
    setChapterId(fresh.id);
    setTab('write');
  };

  const removeChapter = (target: string) => {
    setPost((p) => {
      if (p.chapters.length <= 1) return p;
      const rest = p.chapters.filter((c) => c.id !== target);
      if (target === chapterId) setChapterId(rest[0]!.id);
      return { ...p, chapters: rest };
    });
  };

  const save = async (status: Post['status']) => {
    if (busy.current) return;
    const nextPost = { ...post, status };
    const problems = localIssues(nextPost);
    setErrors(problems);
    if (problems.length) {
      const first = problems[0]!;
      if (first.startsWith('chapters')) setTab('write');
      else if (first.startsWith('title') || first.startsWith('slug') || first.startsWith('excerpt') || first.startsWith('projectSlug')) setTab('settings');
      return;
    }
    busy.current = true;
    setSaving(true);
    try {
      const payload = nextPost;
      const saved = id ? await updateBlog(id, payload) : await createBlog(payload);
      setPost(saved as Post);
      setChapterId(saved.chapters[0]?.id ?? chapterId);
      nav(`/admin/blogs/${saved.id}`, { replace: true });
    } catch (error) {
      setErrors(serverIssues(error));
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };

  if (loading) return <main className="p-8 font-mono text-sm text-ink-dim">loading editor…</main>;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col px-4 sm:px-8">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b-2 border-line py-5">
        <div className="min-w-0">
          <p className="meta">ADMIN / {post.status === 'published' ? 'PUBLISHED' : 'DRAFT'}</p>
          <h1 className="truncate font-serif text-3xl">{post.title || 'Untitled post'}</h1>
        </div>
        <Link to="/admin/blogs" className="meta hover:text-acid">← ALL POSTS</Link>
        <div className="ml-auto flex items-center gap-3">
          <span aria-live="polite" className={cn('meta text-ink-mute', !saving && 'invisible')}>SAVING…</span>
          <button disabled={saving} onClick={() => void save('draft')} className="border border-line px-4 py-2 font-mono text-sm hover:bg-surface disabled:opacity-50">
            SAVE DRAFT
          </button>
          <button disabled={saving} onClick={() => void save('published')} className="bg-acid px-4 py-2 font-mono text-sm text-white hover:opacity-90 disabled:opacity-50">
            {post.status === 'published' ? 'UPDATE POST' : 'PUBLISH NOW'}
          </button>
        </div>
      </header>

      <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1 self-start">
          <p className="meta pb-2">CHAPTERS</p>
          {post.chapters.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setChapterId(c.id)}
              className={cn(
                'group flex w-full items-center gap-2 border px-3 py-2 text-left font-mono text-sm',
                c.id === chapter.id ? 'border-line bg-surface text-ink' : 'border-transparent text-ink-dim hover:border-line-soft hover:text-ink'
              )}
            >
              <span className="text-ink-mute">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 truncate">{c.title || 'Untitled chapter'}</span>
              {post.chapters.length > 1 && (
                <span
                  role="button"
                  aria-label={`Delete chapter ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); removeChapter(c.id); }}
                  className="hidden text-ink-mute hover:text-signal group-hover:inline"
                >
                  ×
                </span>
              )}
            </button>
          ))}
          <button onClick={addChapter} className="meta w-full border border-dashed border-line px-3 py-2 text-ink-dim hover:border-acid hover:text-acid">
            + ADD CHAPTER
          </button>
        </nav>

        <section className="min-w-0 border-2 border-line bg-surface">
          <div className="flex items-center gap-1 border-b-2 border-line px-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'border-b-2 px-4 py-3 font-mono text-sm uppercase tracking-wider',
                  tab === t ? 'border-acid text-ink' : 'border-transparent text-ink-dim hover:text-acid-hover'
                )}
              >
                {t}
              </button>
            ))}
            {tab === 'write' && (
              <button onClick={() => setPreview((p) => !p)} className="meta ml-auto border border-line px-3 py-1.5 text-ink-dim hover:text-acid">
                {preview ? '← BACK TO WRITING' : 'PREVIEW →'}
              </button>
            )}
          </div>

          {errors.length > 0 && (
            <ul className="border-b border-line-soft bg-surface-2 px-5 py-3 font-mono text-xs text-signal">
              {errors.map((e) => <li key={e}>! {e}</li>)}
            </ul>
          )}

          {tab === 'write' && (
            <div className="flex flex-col">
              <input
                value={chapter.title}
                onChange={(e) => setChapter({ ...chapter, title: e.target.value })}
                placeholder="Chapter title"
                className="border-b border-line-soft bg-transparent px-5 py-4 font-serif text-3xl text-ink outline-none placeholder:text-ink-mute"
              />
              {preview ? (
                <div className="min-h-[60vh] px-6 py-6">
                  {chapter.content.trim()
                    ? <Markdown content={chapter.content} />
                    : <p className="font-mono text-sm text-ink-mute">Nothing written yet — go back and add some Markdown.</p>}
                </div>
              ) : (
                <textarea
                  value={chapter.content}
                  onChange={(e) => setChapter({ ...chapter, content: e.target.value })}
                  placeholder={'Write in Markdown…\n\n## A clear section\n\nExplain the decision and result.'}
                  className="min-h-[60vh] flex-1 resize-none bg-bg p-5 font-mono text-sm leading-7 text-ink outline-none"
                />
              )}
              <p className="meta border-t border-line-soft px-5 py-3 text-ink-mute">
                CHAPTER {String(post.chapters.indexOf(chapter) + 1).padStart(2, '0')} · {chapter.content.length.toLocaleString()} / 30,000 CHARACTERS
              </p>
            </div>
          )}

          {tab === 'diagram' && (
            <DiagramEditor
              key={chapter.id}
              elements={chapter.diagram}
              onChange={(diagram) => setChapter({ ...chapter, diagram })}
            />
          )}

          {tab === 'settings' && (
            <div className="grid max-w-2xl gap-5 p-6">
              <label className="meta block">PROJECT
                <select value={post.projectSlug} onChange={(e) => setPost({ ...post, projectSlug: e.target.value })} className="mt-2 w-full border border-line-soft bg-bg p-3 text-ink normal-case">
                  {projects.map((p) => <option value={p.slug} key={p.slug}>{p.title}</option>)}
                </select>
              </label>
              <label className="meta block">POST TITLE
                <input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value, slug: post.slug || slugify(e.target.value) })} className="mt-2 w-full border border-line-soft bg-bg p-3 text-ink normal-case" />
              </label>
              <label className="meta block">URL SLUG
                <input value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} className="mt-2 w-full border border-line-soft bg-bg p-3 font-mono text-ink normal-case" />
              </label>
              <label className="meta block">SUMMARY
                <textarea value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} className="mt-2 min-h-28 w-full border border-line-soft bg-bg p-3 text-ink normal-case" />
                <span className="mt-1 block font-mono text-xs text-ink-mute">{post.excerpt.trim().length} / 320 · minimum 10</span>
              </label>
              <p className="border-t border-line-soft pt-4 font-mono text-xs text-ink-mute">
                Published posts receive a server timestamp. Readers can only send private feedback.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
