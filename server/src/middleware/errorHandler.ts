import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { securityLog } from '../utils/securityLog';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    // Authentication / authorization failures are security events (spec §27), wherever thrown.
    if (err.code === 'INVALID_CREDENTIALS') securityLog(req, 'auth.login_failed');
    else if (err.statusCode === 401 || err.statusCode === 403) {
      securityLog(req, 'auth.unauthorized', { code: err.code });
    }
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, ...err.details },
    });
    return;
  }

  // Malformed JSON body from express.json() — the client's fault, not ours.
  if (isBodyParseError(err)) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_JSON', message: 'Request body is not valid JSON' },
    });
    return;
  }

  // Full details stay in the server log; the client gets a generic message plus the id to quote.
  logger.error({ err, requestId: req.id, path: req.path }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong', requestId: req.id },
  });
}

function isBodyParseError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { type?: unknown }).type === 'entity.parse.failed'
  );
}
