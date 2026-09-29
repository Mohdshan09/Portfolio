import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { AnalyticsResponse } from '@portfolio/shared';
import { apiClient } from './client';

export function useAnalytics(days: number) {
  return useQuery({
    queryKey: ['admin', 'analytics', days],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/analytics', { params: { days } });
      return data.data as AnalyticsResponse;
    },
    placeholderData: keepPreviousData, // keep the old chart visible while switching range
    refetchInterval: 60_000,
  });
}
