import type { AnalyticsResponse } from '@portfolio/shared';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { hashIp } from '../utils/sanitize';

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|curl|wget/i;
const TZ = 'Asia/Kolkata';
const ownHosts = new Set(env.CLIENT_URL.map((origin) => new URL(origin).host));

interface RecordViewArgs {
  input: { path: string; referrer?: string };
  ip: string;
  userAgent?: string;
}

/** External referrer host only ("www.linkedin.com" → "linkedin.com"); null for direct/internal. */
export function referrerHost(referrer?: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).host.toLowerCase();
    if (ownHosts.has(host)) return null;
    return host.replace(/^www\./, '').slice(0, 100);
  } catch {
    return null;
  }
}

/** Stores one page view. Bots and admin pages are skipped silently. */
export async function recordPageView({ input, ip, userAgent = '' }: RecordViewArgs) {
  if (BOT_UA.test(userAgent) || input.path.startsWith('/admin')) return;
  await prisma.pageView.create({
    data: {
      path: input.path,
      referrerHost: referrerHost(input.referrer),
      visitorHash: hashIp(`${ip}|${userAgent}`),
    },
  });
}

export async function getAnalytics(days: number): Promise<AnalyticsResponse> {
  // Midnight IST at the start of the first day, so every bar covers a whole day.
  const dayKeys = lastNDays(days);
  const since = new Date(`${dayKeys[0]}T00:00:00+05:30`);
  const where = { createdAt: { gte: since } };

  const [totalsRow, dailyRows, topPages, topReferrers, recent, messages] = await Promise.all([
    prisma.$queryRaw<{ views: bigint; visitors: bigint }[]>`
      SELECT COUNT(*) AS views, COUNT(DISTINCT "visitorHash") AS visitors
      FROM "PageView" WHERE "createdAt" >= ${since}`,
    prisma.$queryRaw<{ day: string; views: bigint; visitors: bigint }[]>`
      SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ}, 'YYYY-MM-DD') AS day,
             COUNT(*) AS views, COUNT(DISTINCT "visitorHash") AS visitors
      FROM "PageView" WHERE "createdAt" >= ${since}
      GROUP BY day ORDER BY day`,
    prisma.pageView.groupBy({
      by: ['path'],
      where,
      _count: { _all: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ['referrerHost'],
      where: { ...where, referrerHost: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { referrerHost: 'desc' } },
      take: 10,
    }),
    prisma.pageView.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { path: true, referrerHost: true, createdAt: true },
    }),
    prisma.message.count({ where }),
  ]);

  const byDay = new Map(dailyRows.map((r) => [r.day, r]));
  const daily = dayKeys.map((date) => ({
    date,
    views: Number(byDay.get(date)?.views ?? 0),
    visitors: Number(byDay.get(date)?.visitors ?? 0),
  }));

  return {
    days,
    totals: {
      views: Number(totalsRow[0]?.views ?? 0),
      visitors: Number(totalsRow[0]?.visitors ?? 0),
      messages,
    },
    daily,
    topPages: topPages.map((p) => ({ path: p.path, views: p._count._all })),
    topReferrers: topReferrers.map((r) => ({ host: r.referrerHost!, views: r._count._all })),
    recent: recent.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
  };
}

/** `YYYY-MM-DD` for each of the last `days` days in IST, oldest first, ending today. */
export function lastNDays(days: number, now = new Date()): string[] {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }); // en-CA → YYYY-MM-DD
  return Array.from({ length: days }, (_, i) =>
    fmt.format(new Date(now.getTime() - (days - 1 - i) * 86_400_000)),
  );
}
