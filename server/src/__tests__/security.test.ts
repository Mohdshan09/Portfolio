// Regression tests for the security-spec fixes (specs/security.md §17–18, §25–28).
import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { adminLimiter, loginLimiter, sessionLimiter } from '../middleware/rateLimit';
import { signAccessToken } from '../services/auth.service';
import { purgeExpiredData } from '../services/retention.service';
import { logger } from '../utils/logger';

const { db } = vi.hoisted(() => ({
  db: {
    message: {
      findMany: vi.fn(),
      groupBy: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));
vi.mock('../config/db', () => ({ prisma: db }));

const LOCAL = ['::ffff:127.0.0.1', '127.0.0.1'];
const ID = 'cm1abcdefghijklmnopqrstu';
const auth = () => ({ Authorization: `Bearer ${signAccessToken()}` });

/** Every security event logged during the test, as `{ event, ...fields }`. */
function captureEvents() {
  const events: Record<string, unknown>[] = [];
  for (const level of ['info', 'warn'] as const) {
    vi.spyOn(logger, level).mockImplementation(((obj: unknown) => {
      if (typeof obj === 'object' && obj !== null && 'event' in obj) {
        events.push(obj as Record<string, unknown>);
      }
    }) as typeof logger.info);
  }
  return events;
}

beforeEach(async () => {
  vi.restoreAllMocks();
  Object.values(db.message).forEach((fn) => fn.mockReset());
  for (const limiter of [adminLimiter, loginLimiter, sessionLimiter]) {
    for (const key of LOCAL) await limiter.resetKey(key);
  }
});

describe('request ids', () => {
  it('returns an X-Request-Id on every response', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('puts the request id — and nothing internal — in a 500 response', async () => {
    db.message.findMany.mockRejectedValue(new Error('connect ECONNREFUSED postgres://secret'));
    db.message.groupBy.mockResolvedValue([]);
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    const res = await request(app).get('/api/admin/messages').set(auth());

    expect(res.status).toBe(500);
    expect(res.body.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',
      requestId: res.headers['x-request-id'],
    });
    expect(JSON.stringify(res.body)).not.toMatch(/postgres|ECONNREFUSED|stack/i);
  });
});

describe('security event log', () => {
  it('logs failed and successful logins without the email or password', async () => {
    const events = captureEvents();
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong-password' });
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'test-password' });

    expect(events.map((e) => e.event)).toEqual(['auth.login_failed', 'auth.login_success']);
    expect(JSON.stringify(events)).not.toMatch(/admin@example\.com|wrong-password|test-password/);
    expect(events[0]!.ipHash).toMatch(/^[0-9a-f]{16}$/);
    expect(events[0]!.requestId).toEqual(expect.any(String));
  });

  it('logs unauthorized admin access and admin actions', async () => {
    const events = captureEvents();
    db.message.deleteMany.mockResolvedValue({ count: 1 });

    await request(app).get('/api/admin/messages');
    await request(app).delete(`/api/admin/messages/${ID}`).set(auth());

    expect(events).toEqual([
      expect.objectContaining({ event: 'auth.unauthorized', path: '/api/admin/messages' }),
      expect.objectContaining({ event: 'admin.message_deleted', messageId: ID }),
    ]);
  });
});

describe('rate limits on session and admin endpoints', () => {
  it('limits /api/auth/refresh', async () => {
    const events = captureEvents();
    let last = 0;
    for (let i = 0; i < 31; i++) last = (await request(app).post('/api/auth/refresh')).status;
    expect(last).toBe(429);
    expect(events.at(-1)).toMatchObject({ event: 'rate_limit.blocked', limiter: 'session' });
  });

  it('does not count unauthenticated requests against the admin budget', async () => {
    const anonymous = await request(app).get('/api/admin/messages');
    expect(anonymous.status).toBe(401);
    expect(anonymous.headers['ratelimit']).toBeUndefined();

    db.message.findMany.mockResolvedValue([]);
    db.message.groupBy.mockResolvedValue([]);
    const admin = await request(app).get('/api/admin/messages').set(auth());
    expect(admin.headers['ratelimit']).toMatch(/limit=300, remaining=299/);
  });
});

describe('retention', () => {
  it('deletes only archived messages older than 180 days', async () => {
    db.message.deleteMany.mockResolvedValue({ count: 2 });
    const now = new Date('2026-09-30T00:00:00Z');

    expect(await purgeExpiredData(now)).toEqual({ archivedMessages: 2 });
    expect(db.message.deleteMany).toHaveBeenCalledWith({
      where: { status: 'archived', updatedAt: { lt: new Date('2026-04-03T00:00:00Z') } },
    });
  });
});
