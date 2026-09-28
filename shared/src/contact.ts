import { z } from 'zod';

/** Contact form payload — validated on the client for UX and on the server for safety. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'at least 2 characters').max(60, 'at most 60 characters'),
  email: z.string().trim().email('not a valid email').max(254),
  subject: z
    .string()
    .trim()
    // Subject lands in an email header — no line breaks.
    .transform((s) => s.replace(/[\r\n]+/g, ' '))
    .pipe(z.string().max(120, 'at most 120 characters'))
    .optional()
    .transform((s) => (s ? s : undefined)),
  message: z.string().trim().min(10, 'at least 10 characters').max(2000, 'at most 2000 characters'),
  /** Honeypot. Hidden from humans; bots that fill it get a fake success. */
  website: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;
