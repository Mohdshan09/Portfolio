import { Router } from 'express';
import { blogInputSchema, feedbackSchema } from '@portfolio/shared';
import { requireAuth } from '../middleware/requireAuth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import * as c from '../controllers/blogs.controller';

export const blogsRouter = Router();
blogsRouter.get('/', asyncHandler(c.publishedList));
blogsRouter.get('/:slug', asyncHandler(c.publishedOne));
blogsRouter.post('/:slug/feedback', validateBody(feedbackSchema), asyncHandler(c.feedback));
export const adminBlogsRouter = Router();
adminBlogsRouter.use(requireAuth);
adminBlogsRouter.get('/', asyncHandler(c.adminList));
adminBlogsRouter.get('/feedback', asyncHandler(c.adminFeedback));
adminBlogsRouter.get('/:id', asyncHandler(c.adminOne));
adminBlogsRouter.post('/', validateBody(blogInputSchema), asyncHandler(c.adminCreate));
adminBlogsRouter.patch('/:id', validateBody(blogInputSchema), asyncHandler(c.adminUpdate));
adminBlogsRouter.delete('/:id', asyncHandler(c.adminDelete));
