import { useState, type ButtonHTMLAttributes } from 'react';
import type { AdminMessage, MessageBox } from '@portfolio/shared';
import { useDeleteMessage, useMessages, useUpdateMessage } from '../../api/messages';
import { buttonClasses } from '../../lib/buttonClasses';
import { cn } from '../../lib/cn';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const dateTime = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function AdminInbox() {
  const [box, setBox] = useState<MessageBox>('inbox');
  const [openId, setOpenId] = useState<string | null>(null);
  const messages = useMessages(box);
  const counts = messages.data?.counts;
  useDocumentTitle(counts?.unread ? `(${counts.unread}) Inbox` : 'Inbox');

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-5xl text-ink">
        Inbox
        {counts && counts.unread > 0 && (
          <span className="ml-4 align-middle font-mono text-meta text-acid">
            ● {counts.unread} UNREAD
          </span>
        )}
      </h1>

      <div role="tablist" className="mt-8 flex gap-6 border-b-2 border-line font-mono text-meta">
        {(['inbox', 'archived'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={box === tab}
            onClick={() => {
              setBox(tab);
              setOpenId(null);
            }}
            className={cn(
              '-mb-[2px] border-b-2 pb-2 uppercase',
              box === tab
                ? 'border-acid text-ink'
                : 'border-transparent text-ink-mute hover:text-ink',
            )}
          >
            {tab} {counts ? `(${counts[tab]})` : ''}
          </button>
        ))}
      </div>

      {messages.isPending ? (
        <p className="py-8 font-mono text-sm text-ink-dim">fetching messages…</p>
      ) : messages.isError ? (
        <p className="py-8 font-mono text-sm text-signal">
          ERR: couldn&apos;t load messages.{' '}
          <button type="button" onClick={() => void messages.refetch()} className="underline">
            retry
          </button>
        </p>
      ) : messages.data.items.length === 0 ? (
        <p className="py-8 font-mono text-sm text-ink-dim">
          &gt; {box === 'inbox' ? 'inbox zero. nothing to answer.' : 'nothing archived.'}
        </p>
      ) : (
        <ul className="divide-y divide-line-soft">
          {messages.data.items.map((message) => (
            <MessageRow
              key={message.id}
              message={message}
              open={openId === message.id}
              onToggle={() => setOpenId((id) => (id === message.id ? null : message.id))}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

function MessageRow({
  message,
  open,
  onToggle,
}: {
  message: AdminMessage;
  open: boolean;
  onToggle: () => void;
}) {
  const update = useUpdateMessage();
  const remove = useDeleteMessage();
  const unread = message.status === 'new';
  const busy = update.isPending || remove.isPending;

  function toggle() {
    // Opening an unread message marks it read — it stays in the inbox.
    if (!open && unread) update.mutate({ id: message.id, status: 'read' });
    onToggle();
  }

  function handleDelete() {
    if (window.confirm(`Delete the message from ${message.name}? This can't be undone.`)) {
      remove.mutate(message.id);
    }
  }

  const replySubject = `Re: ${message.subject ?? 'your message on my portfolio'}`;

  return (
    <li>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="grid w-full grid-cols-[1rem_1fr_auto] items-baseline gap-3 py-4 text-left hover:bg-surface sm:px-2"
      >
        <span className={cn('font-mono text-acid', !unread && 'invisible')} aria-hidden>
          ●
        </span>
        <span className="min-w-0">
          <span
            className={cn('block truncate', unread ? 'font-semibold text-ink' : 'text-ink-dim')}
          >
            {message.name}
            <span className="ml-2 font-mono text-meta text-ink-mute">{message.email}</span>
          </span>
          <span className="block truncate text-sm text-ink-dim">
            {message.subject ?? message.body}
          </span>
        </span>
        <time dateTime={message.createdAt} className="font-mono text-meta text-ink-mute">
          {dateTime.format(new Date(message.createdAt))}
        </time>
        {unread && <span className="sr-only">(unread)</span>}
      </button>

      {open && (
        <div className="mb-4 border-l-2 border-line-soft pl-4 sm:ml-9">
          {message.subject && (
            <p className="font-mono text-meta text-ink-mute">SUBJECT: {message.subject}</p>
          )}
          <p className="mt-3 whitespace-pre-wrap break-words text-ink">{message.body}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-meta uppercase">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent(replySubject)}`}
              className={buttonClasses('primary', 'sm')}
            >
              REPLY ↗
            </a>
            {message.status === 'read' && (
              <ActionButton
                disabled={busy}
                onClick={() => update.mutate({ id: message.id, status: 'new' })}
              >
                MARK UNREAD
              </ActionButton>
            )}
            <ActionButton
              disabled={busy}
              onClick={() =>
                update.mutate({
                  id: message.id,
                  status: message.status === 'archived' ? 'read' : 'archived',
                })
              }
            >
              {message.status === 'archived' ? 'MOVE TO INBOX' : 'ARCHIVE'}
            </ActionButton>
            <ActionButton disabled={busy} onClick={handleDelete} danger>
              DELETE
            </ActionButton>
          </div>
          {(update.isError || remove.isError) && (
            <p role="alert" className="mt-3 font-mono text-sm text-signal">
              ERR: action failed. try again.
            </p>
          )}
        </div>
      )}
    </li>
  );
}

function ActionButton({
  children,
  danger,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        'uppercase underline-offset-4 hover:underline disabled:opacity-50',
        danger ? 'text-signal' : 'text-ink-dim hover:text-ink',
      )}
      {...props}
    >
      {children}
    </button>
  );
}
