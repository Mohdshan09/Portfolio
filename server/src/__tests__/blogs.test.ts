import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';

const { db } = vi.hoisted(() => ({
  db: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('../config/db', () => ({ prisma: { projectBlog: db, blogFeedback: {} } }));

const ADMIN = { email: 'admin@example.com', password: 'test-password' };
const POST = {
  projectSlug: 'read-smart', title: 'Intro post', slug: 'intro-post',
  excerpt: 'At least ten characters', status: 'draft',
  chapters: [{ id: 'c1', title: 'Introduction', content: 'Hello', diagram: [] }],
};

let token: string;
beforeEach(async () => {
  Object.values(db).forEach((fn) => fn.mockReset());
  const res = await request(app).post('/api/auth/login').send(ADMIN);
  token = res.body.data.accessToken as string;
});

describe('POST /api/admin/blogs', () => {
  it('creates a post', async () => {
    db.create.mockResolvedValue({ id: 'x'.repeat(25), ...POST });
    const res = await request(app).post('/api/admin/blogs').set('Authorization', `Bearer ${token}`).send(POST);
    expect(res.status).toBe(201);
    expect(db.create).toHaveBeenCalled();
  });

  it('maps a unique-constraint violation to 409 with the conflicting field', async () => {
    db.create.mockRejectedValue({ code: 'P2002', meta: { target: 'slug' } });
    const res = await request(app).post('/api/admin/blogs').set('Authorization', `Bearer ${token}`).send(POST);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('DUPLICATE');
    expect(res.body.error.fields.slug).toContain('already used');
  });

  it('rejects an invalid body before touching the database', async () => {
    const res = await request(app).post('/api/admin/blogs').set('Authorization', `Bearer ${token}`).send({ ...POST, slug: 'Not A Slug' });
    expect(res.status).toBe(400);
    expect(db.create).not.toHaveBeenCalled();
  });
});
