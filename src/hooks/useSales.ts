import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleService } from '@/services';
import { Sale } from '@/types';
import { productKeys } from './useProducts';

export const saleKeys = {
  all: ['sales'] as const,
  lists: () => [...saleKeys.all, 'list'] as const,
  list: (filters: string) => [...saleKeys.lists(), { filters }] as const,
  details: () => [...saleKeys.all, 'detail'] as const,
  detail: (id: string) => [...saleKeys.details(), id] as const,
};

export function useSales() {
  return useQuery({
    queryKey: saleKeys.lists(),
    queryFn: async () => {
      const response = await saleService.getAll();
      return response.data;
    },
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: async () => {
      const response = await saleService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Sale, 'id'>) => saleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: saleKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
