import type { Request, Response } from 'express';
import type { ContactPayload } from '@portfolio/shared';
import { submitContactMessage } from '../services/contact.service';

export async function createContactMessage(req: Request, res: Response) {
  await submitContactMessage({
    input: req.body as ContactPayload,
    ip: req.ip ?? 'unknown',
    userAgent: req.get('user-agent'),
  });

  // Same response for real and honeypot submissions, so bots can't tell the difference.
  res.status(200).json({ success: true, data: { message: 'Message received' } });
}
