import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services';

export const statsKeys = {
  all: ['stats'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
  todayTotal: () => [...statsKeys.all, 'todayTotal'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: async () => {
      const response = await statsService.getDashboardStats();
      return response.data;
    },
  });
}

export function useTodayTotal() {
  return useQuery({
    queryKey: statsKeys.todayTotal(),
    queryFn: async () => {
      const response = await statsService.getTodayTotal();
      return response.data;
    },
  });
}
