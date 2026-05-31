import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { internalUsageService } from '@/services';
import { InternalUsage } from '@/types';
import { message } from 'antd';

export const internalUsageKeys = {
  all: ['internalUsage'] as const,
  lists: () => [...internalUsageKeys.all, 'list'] as const,
  stats: () => [...internalUsageKeys.all, 'stats'] as const,
};

export function useInternalUsages() {
  return useQuery({
    queryKey: internalUsageKeys.lists(),
    queryFn: async () => {
      const response = await internalUsageService.getAll();
      return response.data;
    },
  });
}

export function useInternalUsageStats() {
  return useQuery({
    queryKey: internalUsageKeys.stats(),
    queryFn: async () => {
      const response = await internalUsageService.getStats();
      return response.data;
    },
  });
}

export function useCreateInternalUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<InternalUsage, 'id' | 'dateCreation'>) => {
      const response = await internalUsageService.create(data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: internalUsageKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      message.success(response.message || 'Sortie interne enregistrée');
    },
    onError: () => {
      message.error('Erreur lors de l\'enregistrement');
    },
  });
}

export function useDeleteInternalUsage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await internalUsageService.delete(id);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: internalUsageKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      message.success(response.message || 'Sortie supprimée');
    },
    onError: () => {
      message.error('Erreur lors de la suppression');
    },
  });
}
