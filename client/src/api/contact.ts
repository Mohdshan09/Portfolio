import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import type { ContactField, ContactInput } from '@portfolio/shared';
import { apiClient } from './client';

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

/** Normalised failure the form can render without knowing about axios. */
export class ContactError extends Error {
  constructor(
    public kind: 'validation' | 'rate-limited' | 'network' | 'server',
    public fields: ContactFieldErrors = {},
  ) {
    super(kind);
  }
}

export async function sendContactMessage(input: ContactInput): Promise<void> {
  try {
    await apiClient.post('/contact', input);
  } catch (err) {
    if (!isAxiosError(err) || !err.response) throw new ContactError('network');
    const { status, data } = err.response;
    if (status === 429) throw new ContactError('rate-limited');
    if (status === 400) throw new ContactError('validation', data?.error?.fields ?? {});
    throw new ContactError('server');
  }
}

export function useSendContactMessage() {
  return useMutation<void, ContactError, ContactInput>({ mutationFn: sendContactMessage });
}
