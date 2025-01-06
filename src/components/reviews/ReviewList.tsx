import { useState } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { ReviewFilter } from './ReviewFilter';
import { ReviewGrid } from './ReviewGrid';
import { ReviewModal } from './ReviewModal';
import { useReviews } from '@/lib/hooks/useReviews';
import type { Review, ReviewFilter as ReviewFilterType } from '@/lib/types/review';

export function ReviewList() {
  const [filters, setFilters] = useState<ReviewFilterType>({
    dateRange: '10days',
    page: 1,
    perPage: 10,
    searchField: 'order_id' // Set default search field to order_id
  });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { 
    data: reviewData,
    isLoading,
    isError
  } = useReviews(filters);

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-600">Failed to load reviews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-2xl font-bold",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Reviews
        </h1>
      </div>

      <ReviewFilter
        filters={filters}
        onFilterChange={setFilters}
      />

      <ReviewGrid
        reviews={reviewData?.data || []}
        isLoading={isLoading}
        totalCount={reviewData?.count || 0}
        page={filters.page}
        perPage={filters.perPage}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
        onReviewClick={setSelectedReview}
      />

      <ReviewModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}