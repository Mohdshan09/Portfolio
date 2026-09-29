import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { trackLimiter } from '../middleware/rateLimit';
import { signAccessToken } from '../services/auth.service';
import { lastNDays, referrerHost } from '../services/analytics.service';

const { db } = vi.hoisted(() => ({
  db: {
    pageView: { create: vi.fn(), groupBy: vi.fn(), findMany: vi.fn() },
    message: { count: vi.fn() },
    $queryRaw: vi.fn(),
  },
}));
vi.mock('../config/db', () => ({ prisma: db }));

const BROWSER = 'Mozilla/5.0 (Windows NT 10.0) Chrome/130';
const track = (body: object, ua = BROWSER) =>
  request(app).post('/api/track').set('User-Agent', ua).send(body);

beforeEach(async () => {
  db.pageView.create.mockReset().mockResolvedValue({});
  await trackLimiter.resetKey('::ffff:127.0.0.1');
  await trackLimiter.resetKey('127.0.0.1');
});

describe('POST /api/track', () => {
  it('stores the path, external referrer host and a hashed visitor id', async () => {
    const res = await track({
      path: '/dispatches/x?utm=1#top',
      referrer: 'https://www.linkedin.com/feed/',
    });
    expect(res.status).toBe(204);
    const { data } = db.pageView.create.mock.calls[0]![0];
    expect(data).toEqual({
      path: '/dispatches/x',
      referrerHost: 'linkedin.com',
      visitorHash: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
  });

  it.each([
    ['bots', { path: '/' }, 'Googlebot/2.1'],
    ['admin pages', { path: '/admin' }, BROWSER],
  ])('ignores %s', async (_label, body, ua) => {
    expect((await track(body, ua)).status).toBe(204);
    expect(db.pageView.create).not.toHaveBeenCalled();
  });

  it('rejects a path that is not a site path', async () => {
    expect((await track({ path: 'https://evil.example' })).status).toBe(400);
  });
});

describe('referrerHost', () => {
  it('drops internal, invalid and empty referrers', () => {
    expect(referrerHost('http://localhost:5173/now')).toBeNull(); // CLIENT_URL in tests
    expect(referrerHost('not a url')).toBeNull();
    expect(referrerHost(undefined)).toBeNull();
    expect(referrerHost('https://github.com/x')).toBe('github.com');
  });
});

describe('lastNDays', () => {
  it('returns N consecutive IST dates ending today', () => {
    // 2026-09-28 20:00 UTC is already 29 Sep in IST
    expect(lastNDays(3, new Date('2026-09-28T20:00:00Z'))).toEqual([
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
    ]);
  });
});

describe('GET /api/admin/analytics', () => {
  it('requires auth', async () => {
    expect((await request(app).get('/api/admin/analytics')).status).toBe(401);
  });

  it('returns totals, zero-filled daily series, and top lists', async () => {
    const today = lastNDays(1)[0]!;
    db.$queryRaw
      .mockResolvedValueOnce([{ views: 5n, visitors: 2n }])
      .mockResolvedValueOnce([{ day: today, views: 5n, visitors: 2n }]);
    db.pageView.groupBy
      .mockResolvedValueOnce([{ path: '/', _count: { _all: 4 } }])
      .mockResolvedValueOnce([{ referrerHost: 'linkedin.com', _count: { _all: 3 } }]);
    db.pageView.findMany.mockResolvedValue([
      { path: '/', referrerHost: null, createdAt: new Date('2026-09-29T05:00:00Z') },
    ]);
    db.message.count.mockResolvedValue(1);

    const res = await request(app)
      .get('/api/admin/analytics?days=7')
      .set('Authorization', `Bearer ${signAccessToken()}`);

    expect(res.status).toBe(200);
    const data = res.body.data;
    expect(data.totals).toEqual({ views: 5, visitors: 2, messages: 1 });
    expect(data.daily).toHaveLength(7);
    expect(data.daily.at(-1)).toEqual({ date: today, views: 5, visitors: 2 });
    expect(data.daily[0].views).toBe(0);
    expect(data.topPages).toEqual([{ path: '/', views: 4 }]);
    expect(data.topReferrers).toEqual([{ host: 'linkedin.com', views: 3 }]);
  });

  it('rejects an unsupported range', async () => {
    const res = await request(app)
      .get('/api/admin/analytics?days=365')
      .set('Authorization', `Bearer ${signAccessToken()}`);
    expect(res.status).toBe(400);
  });
});
