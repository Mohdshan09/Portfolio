import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { MessageBox, MessageListResponse, MessageStatus } from '@portfolio/shared';
import { apiClient } from './client';

const KEY = ['admin', 'messages'] as const;

export function useMessages(box: MessageBox) {
  return useQuery({
    queryKey: [...KEY, box],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/messages', { params: { box } });
      return data.data as MessageListResponse;
    },
  });
}

export function useUpdateMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) =>
      apiClient.patch(`/admin/messages/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/messages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
