import type { Request, Response } from 'express';
import { analyticsRangeSchema, type TrackInput } from '@portfolio/shared';
import { getAnalytics, recordPageView } from '../services/analytics.service';
import { ApiError } from '../utils/ApiError';

export async function trackPageView(req: Request, res: Response) {
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
