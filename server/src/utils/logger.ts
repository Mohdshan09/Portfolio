import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  level: { production: 'info', development: 'debug', test: 'silent' }[env.NODE_ENV],
});
