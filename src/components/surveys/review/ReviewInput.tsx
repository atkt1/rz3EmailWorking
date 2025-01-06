import { useState } from 'react';
import { cn } from '@/lib/utils';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';

interface ReviewInputProps {
  productName: string;
  minRating: number;
  minReviewLength: number;
  onSubmit: (rating: number, review: string) => void;
  onBack: () => void;
}

export function ReviewInput({
  productName,
  minRating,
  minReviewLength,
  onSubmit,
  onBack
}: ReviewInputProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, review);
  };

  const isValid = rating > 0 && review.length >= minReviewLength;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Share Your Experience and Thoughts on {productName}?
        </h2>
        <p className="text-gray-600">
          Get rewarded for your feedback!
        </p>
      </div>

      <div className="flex justify-center">
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          minRating={minRating}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Add a written review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Every review counts! We carefully read and act on your feedback to improve our service. Share your experience and help us grow better for you!"
          className={cn(
            "w-full rounded-lg border border-gray-300 p-3 min-h-[120px]",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "placeholder:text-gray-400"
          )}
        />
        <p className="text-sm text-gray-500 text-right">
          Minimum Characters: {minReviewLength}
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
        >
          ← Back
        </Button>
        <Button
          type="button"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}