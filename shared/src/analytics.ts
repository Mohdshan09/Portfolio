import { z } from 'zod';

/** Sent by the public site on each page view. */
export const trackSchema = z.object({
  path: z
    .string()
    .trim()
    .startsWith('/')
    .max(200)
    // Paths only — never query strings or fragments (they can carry personal data).
    .transform((p) => p.split(/[?#]/)[0]!),
  referrer: z.string().trim().max(500).optional(),
});
export type TrackInput = z.input<typeof trackSchema>;

export const analyticsRangeSchema = z.coerce
  .number()
  .refine((n) => n === 7 || n === 30 || n === 90, 'days must be 7, 30 or 90')
  .default(7);

export interface AnalyticsResponse {
  days: number;
  totals: { views: number; visitors: number; messages: number };
  /** Distinct visitors with a page view in the last 5 minutes. */
  liveVisitors: number;
  /** One entry per day (IST), oldest first, zero-filled. */
  daily: { date: string; views: number; visitors: number }[];
  topPages: { path: string; views: number }[];
  topReferrers: { host: string; views: number }[];
  recent: { path: string; referrerHost: string | null; createdAt: string }[];
}
