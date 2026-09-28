import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';
import { loginLimiter } from '../middleware/rateLimit';

const { db } = vi.hoisted(() => ({
  db: {
    findMany: vi.fn(),
    groupBy: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
  },
}));
vi.mock('../config/db', () => ({ prisma: { message: db } }));

const ADMIN = { email: 'admin@example.com', password: 'test-password' };
const ID = 'cm1abcdefghijklmnopqrstu';

async function login() {
  const res = await request(app).post('/api/auth/login').send(ADMIN);
  return {
    token: res.body.data.accessToken as string,
    cookie: res.headers['set-cookie'] as unknown as string[],
  };
}

beforeEach(async () => {
  Object.values(db).forEach((fn) => fn.mockReset());
  await loginLimiter.resetKey('::ffff:127.0.0.1');
  await loginLimiter.resetKey('127.0.0.1');
});

describe('auth', () => {
  it('logs in with the env credentials and sets a scoped httpOnly refresh cookie', async () => {
    const res = await request(app).post('/api/auth/login').send(ADMIN);
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    const cookie = String(res.headers['set-cookie']);
    expect(cookie).toMatch(/refresh_token=/);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/Path=\/api\/auth/);
    expect(cookie).toMatch(/SameSite=Strict/);
  });

  it('gives the same answer for a wrong email and a wrong password', async () => {
    const wrongPw = await request(app)
      .post('/api/auth/login')
      .send({ ...ADMIN, password: 'nope' });
    const wrongEmail = await request(app)
      .post('/api/auth/login')
      .send({ ...ADMIN, email: 'other@example.com' });
    expect(wrongPw.status).toBe(401);
    expect(wrongEmail.status).toBe(401);
    expect(wrongPw.body).toEqual(wrongEmail.body);
  });

  it('blocks the 6th failed login attempt', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ ...ADMIN, password: 'nope' });
    }
    const res = await request(app).post('/api/auth/login').send(ADMIN);
    expect(res.status).toBe(429);
  });

  it('refreshes a session from the cookie, and refuses without one', async () => {
    const { cookie } = await login();
    const ok = await request(app).post('/api/auth/refresh').set('Cookie', cookie);
    expect(ok.status).toBe(200);
    expect(ok.body.data.accessToken).toEqual(expect.any(String));

    const missing = await request(app).post('/api/auth/refresh');
    expect(missing.status).toBe(401);
  });

  it('does not accept an access token as a refresh token', async () => {
    const { token } = await login();
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `refresh_token=${token}`);
    expect(res.status).toBe(401);
  });

  it('clears the cookie on logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(String(res.headers['set-cookie'])).toMatch(/refresh_token=;/);
  });
});

describe('admin routes', () => {
  it.each([
    ['no token', undefined],
    ['tampered token', 'Bearer abc.def.ghi'],
    [
      'expired token',
      `Bearer ${jwt.sign({ sub: 'admin', role: 'admin', typ: 'access' }, 'a'.repeat(32), { expiresIn: -10 })}`,
    ],
    [
      'unsigned (alg none) token',
      `Bearer ${jwt.sign({ sub: 'admin', role: 'admin', typ: 'access' }, '', { algorithm: 'none' })}`,
    ],
  ])('rejects %s with 401', async (_label, auth) => {
    const req = request(app).get('/api/admin/messages');
    const res = await (auth ? req.set('Authorization', auth) : req);
    expect(res.status).toBe(401);
    expect(db.findMany).not.toHaveBeenCalled();
  });

  it('lists inbox messages without internal fields, plus counts', async () => {
    const { token } = await login();
    db.findMany.mockResolvedValue([
      {
        id: ID,
        name: 'Ada',
        email: 'a@x.io',
        subject: null,
        body: 'hi',
        status: 'new',
        createdAt: new Date('2026-09-28T10:00:00Z'),
      },
    ]);
    db.groupBy.mockResolvedValue([
      { status: 'new', _count: { _all: 1 } },
      { status: 'read', _count: { _all: 2 } },
      { status: 'archived', _count: { _all: 4 } },
    ]);

    const res = await request(app)
      .get('/api/admin/messages')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.counts).toEqual({ unread: 1, inbox: 3, archived: 4 });
    expect(res.body.data.items[0].createdAt).toBe('2026-09-28T10:00:00.000Z');
    const query = db.findMany.mock.calls[0]![0];
    expect(query.where).toEqual({ status: { in: ['new', 'read'] } });
    expect(query.select.ipHash).toBeUndefined();
  });

  it('updates status, validating the body and the id', async () => {
    const { token } = await login();
    const auth = { Authorization: `Bearer ${token}` };
    db.updateMany.mockResolvedValue({ count: 1 });

    expect(
      (await request(app).patch(`/api/admin/messages/${ID}`).set(auth).send({ status: 'read' }))
        .status,
    ).toBe(200);
    expect(db.updateMany).toHaveBeenCalledWith({ where: { id: ID }, data: { status: 'read' } });

    expect(
      (await request(app).patch(`/api/admin/messages/${ID}`).set(auth).send({ status: 'spam' }))
        .status,
    ).toBe(400);
    expect(
      (await request(app).patch('/api/admin/messages/bad-id!').set(auth).send({ status: 'read' }))
        .status,
    ).toBe(400);
  });

  it('returns 404 when deleting a message that does not exist', async () => {
    const { token } = await login();
    db.deleteMany.mockResolvedValue({ count: 0 });
    const res = await request(app)
      .delete(`/api/admin/messages/${ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
