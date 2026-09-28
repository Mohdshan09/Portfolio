import { createHmac } from 'node:crypto';
import { env } from '../config/env';

/** Removes HTML tags and stray angle brackets. Output is still escaped wherever it's rendered. */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>?/g, '').replace(/[<>]/g, '');
}

/** Applies `stripHtml` to every top-level string field; leaves other values untouched. */
export function stripHtmlFields(body: unknown): unknown {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return body;
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      key,
      typeof value === 'string' ? stripHtml(value) : value,
    ]),
  );
}

/** Keyed hash so stored IPs can be compared (spam patterns) but not reversed or rainbow-tabled. */
export function hashIp(ip: string): string {
  return createHmac('sha256', env.IP_HASH_SALT).update(ip).digest('hex');
}
