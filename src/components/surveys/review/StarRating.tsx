import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  minRating?: number;
}

export function StarRating({ rating, onRatingChange, minRating = 1 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={cn(
            "transition-all duration-200 transform hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-full p-1"
          )}
        >
          <Star
            className={cn(
              "w-8 h-8",
              star <= rating
                ? "fill-blue-500 text-blue-500"
                : "text-gray-300",
              star === minRating && "after:content-['*'] after:text-red-500 after:ml-0.5"
            )}
          />
        </button>
      ))}
    </div>
  );
}