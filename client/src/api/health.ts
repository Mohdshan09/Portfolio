import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';

interface HealthResponse {
  success: true;
  data: { status: string; uptime: number };
}

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>('/health');
  return data;
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });
}
