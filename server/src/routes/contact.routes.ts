import { Router } from 'express';
import { contactSchema } from '@portfolio/shared';
import { contactLimiter } from '../middleware/rateLimit';
import { validateBody } from '../middleware/validate';
import { stripHtmlFields } from '../utils/sanitize';
import { asyncHandler } from '../utils/asyncHandler';
import { createContactMessage } from '../controllers/contact.controller';

export const contactRouter = Router();

contactRouter.post(
  '/',
  contactLimiter,
  // Strip HTML *before* validating, so "<b></b>hi" can't sneak past the length rules.
  (req, _res, next) => {
    req.body = stripHtmlFields(req.body);
    next();
  },
  validateBody(contactSchema),
  asyncHandler(createContactMessage),
);
