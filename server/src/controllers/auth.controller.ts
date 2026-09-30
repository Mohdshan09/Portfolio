import type { CookieOptions, Request, Response } from 'express';
import type { LoginInput } from '@portfolio/shared';
import { env } from '../config/env';
import {
  REFRESH_TTL_MS,
  signAccessToken,
  signRefreshToken,
  verifyCredentials,
  verifyRefreshToken,
} from '../services/auth.service';
import { ApiError } from '../utils/ApiError';
import { securityLog } from '../utils/securityLog';

export const REFRESH_COOKIE = 'refresh_token';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
};

function issueSession(res: Response) {
  res.cookie(REFRESH_COOKIE, signRefreshToken(), { ...cookieOptions, maxAge: REFRESH_TTL_MS });
  res.status(200).json({ success: true, data: { accessToken: signAccessToken() } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput;
  if (!(await verifyCredentials(email, password))) {
    // Logged as `auth.login_failed` by the error handler — without the attempted email.
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
  }
  securityLog(req, 'auth.login_success');
  issueSession(res);
}

/** Swaps a valid refresh cookie for a new access token (and a fresh refresh cookie). */
export async function refresh(req: Request, res: Response) {
  const token: unknown = req.cookies?.[REFRESH_COOKIE];
  if (typeof token !== 'string') throw new ApiError(401, 'UNAUTHORIZED', 'Not authenticated');
  verifyRefreshToken(token);
  issueSession(res);
}

export async function logout(req: Request, res: Response) {
  securityLog(req, 'auth.logout');
  res.clearCookie(REFRESH_COOKIE, cookieOptions);
  res.status(200).json({ success: true, data: null });
}
