import { cn } from '@/lib/utils';

export function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero relative overflow-hidden">
      {/* Header Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="h-14 w-40 bg-gray-200 animate-pulse rounded-lg mx-auto" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={cn(
          "bg-white/95 backdrop-blur-sm rounded-xl",
          "border border-gray-200",
          "shadow-[0_4px_6px_rgba(0,0,0,0.1)]",
          "p-6 sm:p-8 max-w-md w-full"
        )}>
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded-lg mx-auto" />
            <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded-lg mx-auto" />
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-12 bg-gray-200 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}