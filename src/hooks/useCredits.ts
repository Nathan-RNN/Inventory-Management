import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { creditService } from '@/services';
import { CreditItem } from '@/types';
import { message } from 'antd';

export const creditKeys = {
  all: ['credits'] as const,
  lists: () => [...creditKeys.all, 'list'] as const,
  list: (filters: string) => [...creditKeys.lists(), { filters }] as const,
  details: () => [...creditKeys.all, 'detail'] as const,
  detail: (id: string) => [...creditKeys.details(), id] as const,
  payments: (creditId: string) => [...creditKeys.all, 'payments', creditId] as const,
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

export function useCreditPayments(creditId: string) {
  return useQuery({
    queryKey: creditKeys.payments(creditId),
    queryFn: async () => {
      const response = await creditService.getPaymentHistory(creditId);
      return response.data;
    },
    enabled: !!creditId,
  });
}

export function useCreateCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      client: { nom: string; telephone: string; adresse?: string; note?: string };
      items: CreditItem[];
      note?: string;
    }) => {
      const response = await creditService.create(data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      message.success(response.message || 'Crédit créé avec succès');
    },
    onError: () => {
      message.error('Erreur lors de la création du crédit');
    },
  });
}

export function useAddCreditPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      creditId,
      payment,
    }: {
      creditId: string;
      payment: { montant: number; modePaiement: 'cash' | 'mobile_money' | 'autre'; note?: string };
    }) => {
      const response = await creditService.addPayment(creditId, payment);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      message.success(response.message || 'Paiement enregistré');
    },
    onError: () => {
      message.error('Erreur lors de l\'enregistrement du paiement');
    },
  });
}

export function useCancelCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await creditService.cancel(id);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: creditKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      message.success(response.message || 'Crédit annulé');
    },
    onError: () => {
      message.error('Erreur lors de l\'annulation du crédit');
    },
  });
}
