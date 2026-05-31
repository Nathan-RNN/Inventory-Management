import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { internalUsageService } from '@/services';
import { CreateInternalUsageInput } from '@/types';
import { productKeys } from './useProducts';

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
    mutationFn: (data: CreateInternalUsageInput) => internalUsageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: internalUsageKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
