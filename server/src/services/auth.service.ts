import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

// Single admin, credentials from env (ADMIN_EMAIL + ADMIN_PASSWORD_HASH). No signup, no user table.
const ADMIN_SUB = 'admin';
const ALGORITHM = 'HS256' as const;

export const ACCESS_TTL = '15m';
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface TokenPayload {
  sub: string;
  role: 'admin';
  typ: 'access' | 'refresh';
}

/** Constant-ish time: always runs bcrypt, so a wrong email takes as long as a wrong password. */
export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const passwordOk = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
  const emailOk = email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
  return passwordOk && emailOk;
}

export function signAccessToken(): string {
  const payload: TokenPayload = { sub: ADMIN_SUB, role: 'admin', typ: 'access' };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { algorithm: ALGORITHM, expiresIn: ACCESS_TTL });
}

export function signRefreshToken(): string {
  const payload: TokenPayload = { sub: ADMIN_SUB, role: 'admin', typ: 'refresh' };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: REFRESH_TTL_MS / 1000,
  });
}

function verify(token: string, secret: string, typ: TokenPayload['typ']): void {
  const unauthorized = new ApiError(401, 'UNAUTHORIZED', 'Not authenticated');
  let payload: TokenPayload;
  try {
    // `algorithms` pinned: rejects `alg: none` and algorithm-confusion tokens.
    payload = jwt.verify(token, secret, { algorithms: [ALGORITHM] }) as TokenPayload;
  } catch {
    throw unauthorized;
  }
  if (payload.sub !== ADMIN_SUB || payload.role !== 'admin' || payload.typ !== typ) {
    throw unauthorized;
  }
}

export const verifyAccessToken = (token: string) => verify(token, env.JWT_ACCESS_SECRET, 'access');
export const verifyRefreshToken = (token: string) =>
  verify(token, env.JWT_REFRESH_SECRET, 'refresh');
