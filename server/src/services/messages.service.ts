import type {
  AdminMessage,
  MessageBox,
  MessageListResponse,
  MessageStatus,
} from '@portfolio/shared';
import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

const LIST_LIMIT = 200;

// Never select ipHash / userAgent for the admin UI (security/api-security.md projections).
const adminSelect = {
  id: true,
  name: true,
  email: true,
  subject: true,
  body: true,
  status: true,
  createdAt: true,
} as const;

export async function listMessages(box: MessageBox): Promise<MessageListResponse> {
  const statuses: MessageStatus[] = box === 'archived' ? ['archived'] : ['new', 'read'];
  const [items, grouped] = await Promise.all([
    prisma.message.findMany({
      where: { status: { in: statuses } },
      orderBy: { createdAt: 'desc' },
      take: LIST_LIMIT,
      select: adminSelect,
    }),
    prisma.message.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const count = (status: MessageStatus) =>
    grouped.find((g) => g.status === status)?._count._all ?? 0;

  return {
    items: items.map(toAdminMessage),
    counts: {
      unread: count('new'),
      inbox: count('new') + count('read'),
      archived: count('archived'),
    },
  };
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  const { count } = await prisma.message.updateMany({ where: { id }, data: { status } });
  if (count === 0) throw new ApiError(404, 'NOT_FOUND', 'Message not found');
}

export async function deleteMessage(id: string) {
  const { count } = await prisma.message.deleteMany({ where: { id } });
  if (count === 0) throw new ApiError(404, 'NOT_FOUND', 'Message not found');
}

function toAdminMessage(m: Omit<AdminMessage, 'createdAt'> & { createdAt: Date }): AdminMessage {
  return { ...m, createdAt: m.createdAt.toISOString() };
}
