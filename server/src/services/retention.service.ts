import { prisma } from '../config/db';
import { logger } from '../utils/logger';

const DAY_MS = 86_400_000;

/** security/data-privacy.md: archived contact messages are deleted 180 days after archiving. */
export const ARCHIVED_MESSAGE_RETENTION_DAYS = 180;

/** Deletes data past its retention period. Safe to run repeatedly. */
export async function purgeExpiredData(now = new Date()) {
  const cutoff = new Date(now.getTime() - ARCHIVED_MESSAGE_RETENTION_DAYS * DAY_MS);
  // `updatedAt` is the moment the message was archived (status is the only field that changes).
  const { count } = await prisma.message.deleteMany({
    where: { status: 'archived', updatedAt: { lt: cutoff } },
  });
  if (count > 0) logger.info({ event: 'retention.purged', archivedMessages: count }, 'retention');
  return { archivedMessages: count };
}

/** Runs the purge at startup and then once a day; failures are logged, never fatal. */
export function scheduleRetention() {
  const run = () => {
    purgeExpiredData().catch((err: unknown) => logger.error({ err }, 'retention purge failed'));
  };
  run();
  setInterval(run, DAY_MS).unref();
}
