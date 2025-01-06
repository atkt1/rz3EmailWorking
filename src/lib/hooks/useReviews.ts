import { useQuery } from '@tanstack/react-query';
import { getReviews } from '../services/reviewService';
import type { ReviewFilter } from '../types/review';
import { useAuth } from '../context/AuthContext';

export function useReviews(filters: ReviewFilter) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['reviews', user?.id, filters],
    queryFn: () => getReviews(user!.id, filters),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    keepPreviousData: true
  });
}