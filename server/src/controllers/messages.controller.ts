import type { Request, Response } from 'express';
import { z } from 'zod';
import { messageBoxSchema, type UpdateMessageInput } from '@portfolio/shared';
import { deleteMessage, listMessages, updateMessageStatus } from '../services/messages.service';
import { ApiError } from '../utils/ApiError';
import { securityLog } from '../utils/securityLog';

const idSchema = z.string().regex(/^[a-z0-9]{20,40}$/i);

function parseId(req: Request): string {
  const result = idSchema.safeParse(req.params.id);
  if (!result.success) throw new ApiError(400, 'INVALID_ID', 'Invalid message id');
  return result.data;
}

export async function getMessages(req: Request, res: Response) {
  const box = messageBoxSchema.safeParse(req.query.box);
  if (!box.success) throw new ApiError(400, 'INVALID_QUERY', '`box` must be inbox or archived');
  res.json({ success: true, data: await listMessages(box.data) });
}

export async function patchMessage(req: Request, res: Response) {
  const { status } = req.body as UpdateMessageInput;
  const id = parseId(req);
  await updateMessageStatus(id, status);
  securityLog(req, 'admin.message_status_changed', { messageId: id, status });
  res.json({ success: true, data: null });
}

export async function removeMessage(req: Request, res: Response) {
  const id = parseId(req);
  await deleteMessage(id);
  securityLog(req, 'admin.message_deleted', { messageId: id });
  res.json({ success: true, data: null });
}
