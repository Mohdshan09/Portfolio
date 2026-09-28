import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('not a valid email'),
  password: z.string().min(1, 'required').max(200),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const messageStatusSchema = z.enum(['new', 'read', 'archived']);
export type MessageStatus = z.infer<typeof messageStatusSchema>;

export const updateMessageSchema = z.object({ status: messageStatusSchema });
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;

/** `inbox` = new + read; `archived` = archived only. */
export const messageBoxSchema = z.enum(['inbox', 'archived']).default('inbox');
export type MessageBox = z.infer<typeof messageBoxSchema>;

/** A contact message as the admin API returns it (no ipHash / userAgent). */
export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  status: MessageStatus;
  createdAt: string;
}

export interface MessageListResponse {
  items: AdminMessage[];
  counts: { unread: number; inbox: number; archived: number };
}
