import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/context/AuthContext';
import { clearOrders } from '@/lib/services/orderService';
import { useToast } from './useToast';

export function useClearOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: () => clearOrders(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('All orders have been cleared');
    },
    onError: () => {
      toast.error('Failed to clear orders');
    }
  });

  return {
    clearOrders: mutation.mutate,
    isClearing: mutation.isPending
  };
}