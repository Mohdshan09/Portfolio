import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('GET /api/health', () => {
  it('returns an ok status in the standard success envelope', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { status: 'ok', uptime: expect.any(Number) },
    });
  });
});

describe('unknown route', () => {
  it('returns 404 in the standard error envelope', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Resource not found' },
    });
  });
});
