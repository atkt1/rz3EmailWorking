import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/context/AuthContext';
import { getOrders } from '@/lib/services/orderService';
import { useOrderSearch } from './useOrderSearch';

interface OrdersParams {
  page: number;
  perPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

export function useOrders(params: OrdersParams) {
  const { user } = useAuth();
  const { searchQuery } = useOrderSearch();

  return useQuery({
    queryKey: ['orders', user?.id, searchQuery, params],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const result = await getOrders(user.id, {
        ...params,
        searchQuery: searchQuery || undefined
      });

      // Adjust page if it exceeds available data
      if (result.total > 0 && result.orders.length === 0) {
        const lastPage = Math.ceil(result.total / params.perPage);
        if (params.page > lastPage) {
          return getOrders(user.id, {
            ...params,
            page: lastPage,
            searchQuery: searchQuery || undefined
          });
        }
      }

      return result;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    keepPreviousData: true
  });
}