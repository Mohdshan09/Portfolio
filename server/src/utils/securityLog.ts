import type { Request } from 'express';
import { logger } from './logger';
import { hashIp } from './sanitize';

type SecurityEvent =
  | 'auth.login_success'
  | 'auth.login_failed'
  | 'auth.logout'
  | 'auth.unauthorized'
  | 'rate_limit.blocked'
  | 'admin.message_status_changed'
  | 'admin.message_deleted';

/**
 * Structured security/audit log line (security spec §27–28): what happened, when, from where.
 * The IP is logged only as the same salted hash we store; never pass emails, passwords,
 * tokens or message contents in `details`.
 */
export function securityLog(
  req: Request,
  event: SecurityEvent,
  details: Record<string, string | number | boolean> = {},
) {
  const level =
    event.endsWith('_failed') || event.includes('unauthorized') || event.includes('blocked')
      ? 'warn'
      : 'info';
  logger[level](
    {
      event,
      requestId: req.id,
      ipHash: hashIp(req.ip ?? 'unknown').slice(0, 16),
      method: req.method,
      path: req.path,
      ...details,
    },
    event,
  );
}
