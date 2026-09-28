import { describe, expect, it, vi } from 'vitest';
import { apiClient } from '../client';
import { fetchHealth } from '../health';

describe('fetchHealth', () => {
  it('requests /health and returns the response body', async () => {
    const payload = { success: true as const, data: { status: 'ok', uptime: 12.3 } };
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: payload });

    const result = await fetchHealth();

    expect(getSpy).toHaveBeenCalledWith('/health');
    expect(result).toEqual(payload);

    getSpy.mockRestore();
  });
});
