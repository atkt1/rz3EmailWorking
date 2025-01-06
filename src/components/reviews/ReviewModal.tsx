import { X, Star } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import type { Review } from '@/lib/types/review';

interface ReviewModalProps {
  review: Review | null;
  onClose: () => void;
}

export function ReviewModal({ review, onClose }: ReviewModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={cn(
        "relative w-full max-w-2xl rounded-xl p-6",
        isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
      )}>
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-1 rounded-full transition-colors",
            isDark 
              ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-6 h-6",
                  star <= review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : isDark ? "text-gray-600" : "text-gray-300"
                )}
              />
            ))}
          </div>

          <div className="space-y-2">
            <h3 className={cn(
              "text-lg font-semibold",
              isDark ? "text-gray-100" : "text-gray-900"
            )}>
              Review for {review.survey_name}
            </h3>
            <p className={cn(
              "text-base whitespace-pre-wrap",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              {review.review}
            </p>
          </div>

          <div className={cn(
            "text-sm space-y-1",
            isDark ? "text-gray-400" : "text-gray-500"
          )}>
            <p>Email: {review.email_id}</p>
            <p>Order ID: {review.order_id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}