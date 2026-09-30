import rateLimit, { type Options } from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';
import { securityLog } from '../utils/securityLog';

const base: Partial<Options> = { standardHeaders: 'draft-7', legacyHeaders: false };

/** Logs the block as a security event, then answers 429 with `message`. */
function blockWith(limiter: string, message: string): Options['handler'] {
  return (req, _res, next) => {
    securityLog(req, 'rate_limit.blocked', { limiter });
    next(new ApiError(429, 'RATE_LIMITED', message));
  };
}

/** Contact form: 3 submissions / hour / IP (specs/06-contact.md). */
export const contactLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 3,
  handler: blockWith('contact', 'Too many messages. Please try again in an hour.'),
});

/** Login: 5 attempts / 15 min / IP (security/checklist.md). Successful logins don't count. */
export const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  handler: blockWith('login', 'Too many login attempts. Try again in 15 minutes.'),
});

/**
 * Session refresh / logout: a logged-in admin tab refreshes about once per 15 minutes, so 30
 * is plenty — while stopping anyone from hammering the refresh-token check.
 */
export const sessionLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 30,
  handler: blockWith('session', 'Too many requests. Try again later.'),
});

/**
 * Admin API. Mounted *after* requireAuth, so only authenticated requests count: a stranger
 * can't use up the admin's budget, and a stolen token can't be used to scrape without limit.
 */
export const adminLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  handler: blockWith('admin', 'Too many requests. Try again later.'),
});

/** Page-view beacons: generous (SPA navigation), but stops a script from flooding the table. */
export const trackLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000,
  limit: 60,
  // Silent: a dropped page view isn't worth an error on the visitor's console.
  handler: (req, res) => {
    securityLog(req, 'rate_limit.blocked', { limiter: 'track' });
    res.status(204).end();
  },
});
