import { useState, type FormEvent } from 'react';
import { contactSchema, type ContactField, type ContactInput } from '@portfolio/shared';
import { TerminalLine, TerminalWindow } from '../ui/TerminalWindow';
import { TerminalInput, TerminalTextarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { useSendContactMessage, type ContactFieldErrors } from '../../api/contact';
import type { Profile } from '../../content/types';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '', website: '' };

export function Contact({ profile }: { profile: Profile }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const send = useSendContactMessage();

  const fieldErrors: ContactFieldErrors = { ...send.error?.fields, ...clientErrors };

  function update(field: ContactField, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setClientErrors(({ [field]: _cleared, ...rest }) => rest);
    if (send.isError) send.reset();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: ContactInput = { ...form, website: form.website || undefined };
    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      const errors: ContactFieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ContactField;
        errors[field] ??= issue.message;
      }
      setClientErrors(errors);
      return;
    }
    setClientErrors({});
    send.mutate(payload);
  }

  function reset() {
    setForm(EMPTY_FORM);
    send.reset();
  }

  return (
    <section id="contact" className="border-b-2 border-line">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-display-l text-ink">
            Let&apos;s build <em className="text-acid">something.</em>
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-block break-all font-serif text-2xl text-ink underline decoration-2 underline-offset-4 hover:text-acid-hover sm:text-3xl"
          >
            {profile.email}
          </a>
          {profile.socials.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block font-mono text-sm text-ink-dim hover:text-acid-hover hover:underline"
            >
              ↗ LinkedIn
            </a>
          )}
        </div>

        <TerminalWindow title="~/contact.sh">
          {send.isSuccess ? (
            <div role="status" className="space-y-1.5">
              <TerminalLine>./contact.sh --send</TerminalLine>
              <TerminalLine prompt=">">
                <span className="text-ink">✓ message queued. I&apos;ll reply within 48h.</span>
              </TerminalLine>
              <div className="pt-4">
                <Button variant="terminal" type="button" onClick={reset}>
                  send another
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <TerminalInput
                label="name"
                autoComplete="name"
                maxLength={60}
                value={form.name}
                error={fieldErrors.name}
                onChange={(e) => update('name', e.target.value)}
              />
              <TerminalInput
                label="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                value={form.email}
                error={fieldErrors.email}
                onChange={(e) => update('email', e.target.value)}
              />
              <TerminalInput
                label="subject"
                maxLength={120}
                placeholder="(optional)"
                value={form.subject}
                error={fieldErrors.subject}
                onChange={(e) => update('subject', e.target.value)}
              />
              <TerminalTextarea
                label="message"
                maxLength={2000}
                value={form.message}
                error={fieldErrors.message}
                onChange={(e) => update('message', e.target.value)}
              />

              {/* Honeypot: off-screen and skipped by keyboard/screen readers; only bots fill it. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </div>

              {send.isError && send.error.kind !== 'validation' && (
                <p role="alert" className="font-mono text-sm text-signal">
                  {send.error.kind === 'rate-limited'
                    ? 'ERR 429: too many messages. try again in an hour.'
                    : `ERR: couldn't send. email me directly at ${profile.email}`}
                </p>
              )}

              <Button type="submit" variant="primary" disabled={send.isPending}>
                {send.isPending ? 'SENDING…' : 'SEND MESSAGE ↵'}
              </Button>
              <p className="font-mono text-meta text-ink-mute">
                &gt; your details are used only to reply to you. never shared.
              </p>
            </form>
          )}
        </TerminalWindow>
      </div>
    </section>
  );
}
