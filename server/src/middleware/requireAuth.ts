import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';

/** Requires `Authorization: Bearer <access token>`. Mounted once on the whole admin router. */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const [scheme, token] = req.get('authorization')?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Not authenticated'));
    return;
  }
  try {
    verifyAccessToken(token);
    next();
  } catch (err) {
    next(err);
  }
};
