import type { BlogInput, FeedbackInput } from '@portfolio/shared';
import { prisma } from '../config/db';

// Kept structurally typed so a deployment can run its migration and generated client independently.
// `prisma generate` then upgrades this handle to the precise generated model type.
const db = prisma as unknown as { projectBlog: any; blogFeedback: any };
const select = { id: true, projectSlug: true, title: true, slug: true, excerpt: true, status: true, chapters: true, createdAt: true, updatedAt: true, publishedAt: true } as const;

export const listPublishedBlogs = (projectSlug?: string) => db.projectBlog.findMany({
  where: { status: 'published', ...(projectSlug ? { projectSlug } : {}) }, select, orderBy: { publishedAt: 'desc' },
});
export const getPublishedBlog = (slug: string) => db.projectBlog.findFirst({ where: { slug, status: 'published' }, select });
export const listAdminBlogs = () => db.projectBlog.findMany({ select, orderBy: { updatedAt: 'desc' } });
export const getAdminBlog = (id: string) => db.projectBlog.findUnique({ where: { id }, select });
export const createBlog = (input: BlogInput) => db.projectBlog.create({ data: { ...input, publishedAt: input.status === 'published' ? new Date() : null }, select });
export const updateBlog = (id: string, input: BlogInput) => db.projectBlog.update({ where: { id }, data: { ...input, publishedAt: input.status === 'published' ? new Date() : null }, select });
export const deleteBlog = (id: string) => db.projectBlog.delete({ where: { id } });
export const addFeedback = (blogId: string, input: FeedbackInput) => db.blogFeedback.create({ data: { blogId, name: input.name, email: input.email || null, message: input.message } });
export const listFeedback = () => db.blogFeedback.findMany({ include: { blog: { select: { title: true, slug: true } } }, orderBy: { createdAt: 'desc' } });
