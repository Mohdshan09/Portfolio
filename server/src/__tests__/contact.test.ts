import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { contactLimiter } from '../middleware/rateLimit';

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

// vi.mock calls are hoisted above the imports, so `app` is built with these fakes.
vi.mock('../config/db', () => ({ prisma: { message: { create: createMock } } }));

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'I would like to talk about a project.',
};

const post = (body: unknown) =>
  request(app)
    .post('/api/contact')
    .send(body as object);

beforeEach(async () => {
  createMock.mockReset().mockResolvedValue({ id: 'msg_1' });
  // supertest always comes from localhost; clear its counter so tests don't share a budget.
  await contactLimiter.resetKey('::ffff:127.0.0.1');
  await contactLimiter.resetKey('127.0.0.1');
});

describe('POST /api/contact', () => {
  it('stores the message with a hashed IP', async () => {
    const res = await post(valid);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { message: 'Message received' } });

    const { data } = createMock.mock.calls[0]![0];
    expect(data).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Hello',
      body: valid.message,
    });
    expect(data.ipHash).toMatch(/^[0-9a-f]{64}$/);
    expect(data.ipHash).not.toContain('127.0.0.1');
  });

  it('rejects invalid input with per-field errors', async () => {
    const res = await post({ name: 'A', email: 'nope', message: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Object.keys(res.body.error.fields).sort()).toEqual(['email', 'message', 'name']);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('strips HTML before validating and storing', async () => {
    const res = await post({
      ...valid,
      name: '<script>x</script>Ada',
      message: '<b>bold</b> '.repeat(3),
    });

    expect(res.status).toBe(200);
    const { data } = createMock.mock.calls[0]![0];
    expect(data.name).toBe('xAda');
    expect(data.body).toBe('bold bold bold');
  });

  it('rejects a message that is only HTML once stripped', async () => {
    const res = await post({ ...valid, message: '<img src=x onerror=alert(1)><br><br><br>' });
    expect(res.status).toBe(400);
    expect(res.body.error.fields.message).toBeDefined();
  });

  it('pretends to succeed on honeypot hits but stores nothing', async () => {
    const res = await post({ ...valid, website: 'http://spam.example' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { message: 'Message received' } });
    expect(createMock).not.toHaveBeenCalled();
  });

  it('returns 400, not 500, for malformed JSON', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send('{"name":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_JSON');
  });

  it('rate-limits the 4th submission within an hour', async () => {
    for (let i = 0; i < 3; i++) expect((await post(valid)).status).toBe(200);

    const res = await post(valid);
    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('RATE_LIMITED');
    expect(createMock).toHaveBeenCalledTimes(3);
  });
});
