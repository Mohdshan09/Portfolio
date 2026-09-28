import { afterEach, describe, expect, it, vi } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { apiClient } from '../client';
import { ContactError, sendContactMessage } from '../contact';

const input = { name: 'Ada', email: 'ada@example.com', message: 'Hello there, Shan!' };

function httpError(status: number, data: unknown) {
  const headers = new AxiosHeaders();
  return new AxiosError('fail', 'ERR', { headers }, null, {
    status,
    data,
    statusText: '',
    headers,
    config: { headers },
  });
}

afterEach(() => vi.restoreAllMocks());

describe('sendContactMessage', () => {
  it('posts the form to /contact', async () => {
    const spy = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: {} });
    await sendContactMessage(input);
    expect(spy).toHaveBeenCalledWith('/contact', input);
  });

  it.each([
    [429, {}, 'rate-limited', {}],
    [
      400,
      { error: { fields: { email: 'not a valid email' } } },
      'validation',
      { email: 'not a valid email' },
    ],
    [500, {}, 'server', {}],
  ])('maps HTTP %i to a %s error', async (status, data, kind, fields) => {
    vi.spyOn(apiClient, 'post').mockRejectedValue(httpError(status, data));
    await expect(sendContactMessage(input)).rejects.toMatchObject({ kind, fields });
  });

  it('treats a missing response as a network error', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue(new AxiosError('Network Error'));
    const err = await sendContactMessage(input).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ContactError);
    expect((err as ContactError).kind).toBe('network');
  });
});
