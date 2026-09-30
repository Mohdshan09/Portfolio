import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';
import { logger } from '../utils/logger';

declare module 'express-serve-static-core' {
  interface Request {
    /** Correlation id: also sent back as `X-Request-Id` and included in every log line. */
    id: string;
  }
}

/**
 * Gives every request an id and writes one access-log line when it finishes.
 * Logs the path only — never query strings, bodies, cookies or auth headers.
 */
export const requestContext: RequestHandler = (req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);

  const startedAt = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
    logger.info(
      { requestId: req.id, method: req.method, path: req.path, status: res.statusCode, ms },
      'request',
    );
  });
  next();
};
