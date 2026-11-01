import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlogs, type Blog } from '../../api/blogs';
import { projects } from '../../content/data';
import { PageHeader } from '../../components/ui/PageHeader';
export function ProjectBlogs() { const { projectSlug } = useParams(); const [blogs, setBlogs] = useState<Blog[]>([]); const project = projects.find((p) => p.slug === projectSlug);
  useEffect(() => { if (projectSlug) void getBlogs(projectSlug).then(setBlogs); }, [projectSlug]);
  if (!project) return <main className="p-10">Project not found.</main>;
  return <main className="mx-auto max-w-4xl px-4 py-16 sm:py-24"><PageHeader kicker={`PROJECT LOG · ${project.title.toUpperCase()}`} command={`$ ls ./projects/${project.slug}/notes`} meta={`> ${blogs.length} published notes`}>Build <em>Notes.</em></PageHeader>
  <div className="border-y-2 border-line">{blogs.length ? blogs.map((blog, i) => <Link key={blog.id} to={`/blogs/${blog.slug}`} className="block border-b border-line-soft p-6 hover:bg-surface"><p className="meta">{String(i + 1).padStart(2, '0')} · {new Date(blog.publishedAt!).toLocaleDateString()}</p><h2 className="mt-2 font-serif text-3xl">{blog.title}</h2><p className="mt-2 text-ink-dim">{blog.excerpt}</p></Link>) : <p className="p-6 font-mono text-sm text-ink-dim">No project notes have been published yet.</p>}</div></main>; }
