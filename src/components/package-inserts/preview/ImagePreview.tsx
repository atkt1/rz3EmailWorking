import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImagePreviewProps {
  src?: string | null;
  alt: string;
  className?: string;
  placeholder?: string;
  onError?: () => void;
}

export function ImagePreview({ 
  src, 
  alt, 
  className,
  placeholder = 'No Image',
  onError 
}: ImagePreviewProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!src || hasError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 text-gray-400 text-sm",
        className
      )}>
        {placeholder}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-contain transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}