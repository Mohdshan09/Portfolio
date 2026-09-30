import type { Request, Response } from 'express';
import { analyticsRangeSchema, type TrackInput } from '@portfolio/shared';
import { getAnalytics, recordPageView } from '../services/analytics.service';
import { verifyAccessToken } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

/** True when the request carries a valid admin access token — i.e. it's the site owner. */
function isOwner(req: Request): boolean {
  const [scheme, token] = req.get('authorization')?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) return false;
  try {
    verifyAccessToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function trackPageView(req: Request, res: Response) {
  // Backup for the client-side owner flag: the owner's own visits never count.
  if (isOwner(req)) {
    res.status(204).end();
    return;
  }
  await recordPageView({
    input: req.body as TrackInput & { path: string },
    ip: req.ip ?? 'unknown',
    userAgent: req.get('user-agent'),
  });
  res.status(204).end();
}

export async function getAnalyticsSummary(req: Request, res: Response) {
  const days = analyticsRangeSchema.safeParse(req.query.days);
  if (!days.success) throw new ApiError(400, 'INVALID_QUERY', 'days must be 7, 30 or 90');
  res.json({ success: true, data: await getAnalytics(days.data) });
}
