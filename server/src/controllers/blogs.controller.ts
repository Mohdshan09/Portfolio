import type { Request, Response } from 'express';
import { z } from 'zod';
import type { BlogInput, FeedbackInput } from '@portfolio/shared';
import { ApiError } from '../utils/ApiError';
import * as blogs from '../services/blogs.service';

const id = z.string().regex(/^[a-z0-9]{20,40}$/i);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180);
const parse = (value: string | undefined, schema: z.ZodType<string>) => { const r = schema.safeParse(value); if (!r.success) throw new ApiError(400, 'INVALID_ID', 'Invalid identifier'); return r.data; };
export async function publishedList(req: Request, res: Response) { res.json({ success: true, data: await blogs.listPublishedBlogs(req.query.projectSlug as string | undefined) }); }
export async function publishedOne(req: Request, res: Response) { const item = await blogs.getPublishedBlog(parse(req.params.slug, slug)); if (!item) throw new ApiError(404, 'NOT_FOUND', 'Blog not found'); res.json({ success: true, data: item }); }
export async function feedback(req: Request, res: Response) { const item = await blogs.getPublishedBlog(parse(req.params.slug, slug)); if (!item) throw new ApiError(404, 'NOT_FOUND', 'Blog not found'); await blogs.addFeedback(item.id, req.body as FeedbackInput); res.status(201).json({ success: true, data: null }); }
export async function adminList(_req: Request, res: Response) { res.json({ success: true, data: await blogs.listAdminBlogs() }); }
export async function adminOne(req: Request, res: Response) { const item = await blogs.getAdminBlog(parse(req.params.id, id)); if (!item) throw new ApiError(404, 'NOT_FOUND', 'Blog not found'); res.json({ success: true, data: item }); }
export async function adminCreate(req: Request, res: Response) { res.status(201).json({ success: true, data: await blogs.createBlog(req.body as BlogInput) }); }
export async function adminUpdate(req: Request, res: Response) { res.json({ success: true, data: await blogs.updateBlog(parse(req.params.id, id), req.body as BlogInput) }); }
export async function adminDelete(req: Request, res: Response) { await blogs.deleteBlog(parse(req.params.id, id)); res.json({ success: true, data: null }); }
export async function adminFeedback(_req: Request, res: Response) { res.json({ success: true, data: await blogs.listFeedback() }); }
