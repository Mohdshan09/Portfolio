import { Router } from 'express';
import { trackSchema } from '@portfolio/shared';
import { trackLimiter } from '../middleware/rateLimit';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { trackPageView } from '../controllers/analytics.controller';

// Public write, like /api/contact: anonymous page-view beacons from the site.
export const trackRouter = Router();

trackRouter.post('/', trackLimiter, validateBody(trackSchema), asyncHandler(trackPageView));
