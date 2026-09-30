import { Router } from 'express';
import { updateMessageSchema } from '@portfolio/shared';
import { requireAuth } from '../middleware/requireAuth';
import { adminLimiter } from '../middleware/rateLimit';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { getMessages, patchMessage, removeMessage } from '../controllers/messages.controller';
import { getAnalyticsSummary } from '../controllers/analytics.controller';

export const adminRouter = Router();

// Router-level: nothing below this line is reachable without a valid access token.
adminRouter.use(requireAuth);
adminRouter.use(adminLimiter);

adminRouter.get('/messages', asyncHandler(getMessages));
adminRouter.patch('/messages/:id', validateBody(updateMessageSchema), asyncHandler(patchMessage));
adminRouter.delete('/messages/:id', asyncHandler(removeMessage));
adminRouter.get('/analytics', asyncHandler(getAnalyticsSummary));
