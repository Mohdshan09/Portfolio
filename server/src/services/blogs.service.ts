import type { BlogInput, FeedbackInput } from '@portfolio/shared';
import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

// Kept structurally typed so a deployment can run its migration and generated client independently.
// `prisma generate` then upgrades this handle to the precise generated model type.
/* eslint-disable @typescript-eslint/no-explicit-any */
const db = prisma as unknown as { projectBlog: any; blogFeedback: any };
const select = { id: true, projectSlug: true, title: true, slug: true, excerpt: true, status: true, chapters: true, createdAt: true, updatedAt: true, publishedAt: true } as const;

const FIELD_LABELS: Record<string, string> = { slug: 'Slug', title: 'Title', id: 'Id' };
// Prisma reports either a bare field ("slug") or the constraint name ("ProjectBlog_slug_key").
const conflictField = (target: string): string => /_key$/.test(target) ? target.replace(/^.*?_(.+)_.+$/, '$1') : target;
function uniqueViolation(error: unknown): never {
  const raw = (error as { meta?: { target?: string } })?.meta?.target ?? 'slug';
  const target = conflictField(raw.split(',')[0]!.trim());
  const label = FIELD_LABELS[target] ?? target.charAt(0).toUpperCase() + target.slice(1);
  throw new ApiError(409, 'DUPLICATE', `A post with this ${label.toLowerCase()} already exists`, { fields: { [target]: `${label} is already used by another post` } });
}
const guardUnique = <T>(promise: Promise<T>): Promise<T> =>
  promise.catch((error: unknown) => {
    if ((error as { code?: string })?.code !== 'P2002') throw error;
    return uniqueViolation(error);
  });

export const listPublishedBlogs = (projectSlug?: string) => db.projectBlog.findMany({
  where: { status: 'published', ...(projectSlug ? { projectSlug } : {}) }, select, orderBy: { publishedAt: 'desc' },
});
export const getPublishedBlog = (slug: string) => db.projectBlog.findFirst({ where: { slug, status: 'published' }, select });
export const listAdminBlogs = () => db.projectBlog.findMany({ select, orderBy: { updatedAt: 'desc' } });
export const getAdminBlog = (id: string) => db.projectBlog.findUnique({ where: { id }, select });
export const createBlog = (input: BlogInput) => guardUnique(db.projectBlog.create({ data: { ...input, publishedAt: input.status === 'published' ? new Date() : null }, select }));
export const updateBlog = (id: string, input: BlogInput) => guardUnique(db.projectBlog.update({ where: { id }, data: { ...input, publishedAt: input.status === 'published' ? new Date() : null }, select }));
export const deleteBlog = (id: string) => db.projectBlog.delete({ where: { id } });
export const addFeedback = (blogId: string, input: FeedbackInput) => db.blogFeedback.create({ data: { blogId, name: input.name, email: input.email || null, message: input.message } });
export const listFeedback = () => db.blogFeedback.findMany({ include: { blog: { select: { title: true, slug: true } } }, orderBy: { createdAt: 'desc' } });
