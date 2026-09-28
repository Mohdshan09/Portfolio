import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';

/** Contact form: 3 submissions / hour / IP (specs/06-contact.md). */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'RATE_LIMITED', 'Too many messages. Please try again in an hour.'));
  },
});

/** Login: 5 attempts / 15 min / IP (security/checklist.md). Successful logins don't count. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'RATE_LIMITED', 'Too many login attempts. Try again in 15 minutes.'));
  },
});
