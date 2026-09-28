import type { ContactPayload } from '@portfolio/shared';
import { prisma } from '../config/db';
import { hashIp } from '../utils/sanitize';
import { logger } from '../utils/logger';

interface SubmitContactArgs {
  input: ContactPayload;
  ip: string;
  userAgent?: string;
}

/**
 * Stores a contact message; it shows up in the admin inbox (/admin).
 * Honeypot hits are dropped silently.
 */
export async function submitContactMessage({ input, ip, userAgent }: SubmitContactArgs) {
  if (input.website) {
    logger.info('contact: honeypot triggered, message dropped');
    return;
  }

  await prisma.message.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject ?? null,
      body: input.message,
      ipHash: hashIp(ip),
      userAgent: userAgent?.slice(0, 500) ?? null,
    },
  });
}
