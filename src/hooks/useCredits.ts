import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService } from '@/services';
import { CreateCreditInput, RecordCreditPaymentInput } from '@/types';
import { productKeys } from './useProducts';
import { statsKeys } from './useStats';

export const creditKeys = {
  all: ['credits'] as const,
  lists: () => [...creditKeys.all, 'list'] as const,
  details: () => [...creditKeys.all, 'detail'] as const,
  detail: (id: string) => [...creditKeys.details(), id] as const,
  stats: () => [...creditKeys.all, 'stats'] as const,
};

export function useCredits() {
  return useQuery({
    queryKey: creditKeys.lists(),
    queryFn: async () => {
      const response = await creditService.getAll();
      return response.data;
    },
  });
}

export function useCredit(id: string) {
  return useQuery({
    queryKey: creditKeys.detail(id),
    queryFn: async () => {
      const response = await creditService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreditStats() {
  return useQuery({
    queryKey: creditKeys.stats(),
    queryFn: async () => {
      const response = await creditService.getStats();
      return response.data;
    },
  });
}

export function useCreateCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCreditInput) => creditService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}

export function useRecordCreditPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecordCreditPaymentInput) => creditService.recordPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}

export function useCancelCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => creditService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}
