import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

// setupEnv sets CLIENT_URL=http://localhost:5173
const ALLOWED = 'http://localhost:5173';

describe('CORS', () => {
  it('allows the configured site origin, with credentials', async () => {
    const res = await request(app).get('/api/health').set('Origin', ALLOWED);
    expect(res.headers['access-control-allow-origin']).toBe(ALLOWED);
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('gives other origins no CORS headers, so browsers block the response', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'https://evil.example');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('answers the admin preflight (PATCH + Authorization header)', async () => {
    const res = await request(app)
      .options('/api/admin/messages/abc')
      .set('Origin', ALLOWED)
      .set('Access-Control-Request-Method', 'PATCH')
      .set('Access-Control-Request-Headers', 'authorization,content-type');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-methods']).toContain('PATCH');
    expect(res.headers['access-control-allow-headers']).toMatch(/authorization/i);
  });
});
