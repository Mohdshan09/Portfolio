import { describe, expect, it } from 'vitest';
import { parseEnv } from '../config/env.schema';

const validEnv = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
  CLIENT_URL: 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: 'test',
  CLOUDINARY_API_KEY: 'test',
  CLOUDINARY_API_SECRET: 'test',
  IP_HASH_SALT: 'c'.repeat(32),
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD_HASH: '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEF',
  NODE_ENV: 'test',
  PORT: '4000',
};

describe('parseEnv', () => {
  it('accepts a fully valid environment', () => {
    expect(() => parseEnv(validEnv)).not.toThrow();
  });

  it('throws naming the missing variable', () => {
    const { DATABASE_URL: _omit, ...rest } = validEnv;
    expect(() => parseEnv(rest)).toThrowError(/DATABASE_URL/);
  });

  it('rejects a JWT secret shorter than 32 characters', () => {
    expect(() => parseEnv({ ...validEnv, JWT_ACCESS_SECRET: 'too-short' })).toThrowError(
      /JWT_ACCESS_SECRET/,
    );
  });

  it('requires a salt of at least 32 characters for IP hashing', () => {
    expect(() => parseEnv({ ...validEnv, IP_HASH_SALT: 'short' })).toThrowError(/IP_HASH_SALT/);
  });

  it('defaults NODE_ENV and PORT when omitted', () => {
    const { NODE_ENV: _n, PORT: _p, ...rest } = validEnv;
    const result = parseEnv(rest);
    expect(result.NODE_ENV).toBe('development');
    expect(result.PORT).toBe(4000);
  });
});

describe('CLIENT_URL', () => {
  it('accepts a comma-separated list and strips trailing slashes', () => {
    const result = parseEnv({
      ...validEnv,
      CLIENT_URL: 'https://shan.dev/, http://localhost:5173',
    });
    expect(result.CLIENT_URL).toEqual(['https://shan.dev', 'http://localhost:5173']);
  });

  it('rejects an entry that is not a URL', () => {
    expect(() => parseEnv({ ...validEnv, CLIENT_URL: 'https://shan.dev,nope' })).toThrowError(
      /CLIENT_URL/,
    );
  });
});
