import { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from './ConfirmDialog';
import { CountdownPopup } from './CountdownPopup';

interface ShareReviewProps {
  review: string;
  marketplaceProductId: string;
  timeDelay: string;
  onBack: () => void;
  onNext: () => void;
}

export function ShareReview({ 
  review, 
  marketplaceProductId, 
  timeDelay,
  onBack, 
  onNext 
}: ShareReviewProps) {
  const [copied, setCopied] = useState(false);
  const [hasBeenCopied, setHasBeenCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setHasBeenCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePasteOnAmazon = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowCountdown(true);
    window.open(
      `https://www.amazon.in/review/create-review?asin=${marketplaceProductId}`,
      '_blank'
    );
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          We're glad you're enjoying our product!
        </h2>
        <p className="text-gray-600">
          Please consider leaving your review on Amazon
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Step 1 - Copy Text Below</h3>
        <div className="rounded-lg bg-gray-50 border border-gray-200 overflow-hidden">
          <div className="p-4 text-center whitespace-pre-wrap break-words">
            {review}
          </div>
          <div className="border-t border-gray-200 p-2 flex justify-center bg-white">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyText}
              className="min-w-[100px]"
            >
              {copied ? (
                <span className="text-green-600">Copied!</span>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Text
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Step 2 - Paste on Amazon</h3>
        <Button
          onClick={handlePasteOnAmazon}
          disabled={!hasBeenCopied}
          className={cn(
            "w-full",
            !hasBeenCopied && "cursor-not-allowed opacity-50"
          )}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Paste on Amazon
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
        >
          ← Back
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />

      <CountdownPopup
        isOpen={showCountdown}
        onComplete={handleCountdownComplete}
        timeDelay={timeDelay}
      />
    </div>
  );
}