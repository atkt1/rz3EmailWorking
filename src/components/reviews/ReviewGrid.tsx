import { Star } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/date';
import type { Review } from '@/lib/types/review';

interface ReviewGridProps {
  reviews: Review[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onReviewClick: (review: Review) => void;
}

export function ReviewGrid({
  reviews,
  isLoading,
  totalCount,
  page,
  perPage,
  onPageChange,
  onReviewClick
}: ReviewGridProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const totalPages = Math.ceil(totalCount / perPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              "border-b text-sm",
              isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
            )}>
              <th className="px-6 py-4 text-left font-medium">Survey</th>
              <th className="px-6 py-4 text-left font-medium">Rating</th>
              <th className="px-6 py-4 text-left font-medium">Review</th>
              <th className="px-6 py-4 text-left font-medium">Order ID</th>
              <th className="px-6 py-4 text-left font-medium">Date</th>
              <th className="px-6 py-4 text-left font-medium">Email</th>
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y",
            isDark ? "divide-gray-700" : "divide-gray-200"
          )}>
            {reviews.map((review) => (
              <tr 
                key={review.id}
                className={cn(
                  "transition-colors duration-150",
                  isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                )}
              >
                <td className="px-6 py-2">
                  <span className={cn(
                    "font-medium",
                    isDark ? "text-gray-200" : "text-gray-900"
                  )}>
                    {review.survey_name}
                  </span>
                </td>
                <td className="px-6 py-2">
                  <div className="flex items-center gap-1">
                    <Star className={cn(
                      "w-5 h-5",
                      review.rating >= 4 ? "text-yellow-400" : isDark ? "text-gray-600" : "text-gray-400"
                    )} />
                    <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                      {review.rating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-2">
                  <button
                    onClick={() => onReviewClick(review)}
                    className={cn(
                      "text-left hover:underline",
                      isDark ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {review.review.length > 50
                      ? `${review.review.slice(0, 50)}...`
                      : review.review}
                  </button>
                </td>
                <td className="px-6 py-2">
                  <span className={cn(
                    "font-mono text-sm",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}>
                    {review.order_id}
                  </span>
                </td>
                <td className="px-6 py-2">
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    {formatDate(review.created_at)}
                  </span>
                </td>
                <td className="px-6 py-2">
                  <span className={cn(
                    "text-sm",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    {review.email_id}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={cn(
          "flex justify-between items-center px-6 py-4 border-t",
          isDark ? "border-gray-700" : "border-gray-200"
        )}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={cn(
              "px-3 py-1 rounded-lg text-sm transition-colors",
              isDark 
                ? "hover:bg-gray-700 text-gray-300 disabled:text-gray-600" 
                : "hover:bg-gray-100 text-gray-600 disabled:text-gray-400",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Previous
          </button>
          <span className={cn(
            "text-sm",
            isDark ? "text-gray-400" : "text-gray-500"
          )}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className={cn(
              "px-3 py-1 rounded-lg text-sm transition-colors",
              isDark 
                ? "hover:bg-gray-700 text-gray-300 disabled:text-gray-600" 
                : "hover:bg-gray-100 text-gray-600 disabled:text-gray-400",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}