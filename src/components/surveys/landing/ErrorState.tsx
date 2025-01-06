import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className={cn(
        "bg-white/95 backdrop-blur-sm rounded-xl",
        "border border-gray-200",
        "shadow-[0_4px_6px_rgba(0,0,0,0.1)]",
        "p-6 sm:p-8 max-w-md w-full mx-4"
      )}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {message || "Something went wrong"}
          </h1>
          <p className="text-gray-600 mb-6">
            Please try again later or contact support if the problem persists.
          </p>
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}