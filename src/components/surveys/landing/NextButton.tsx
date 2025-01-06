import { cn } from '@/lib/utils';

interface NextButtonProps {
  isEnabled: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

// In NextButton.tsx
export function NextButton({ isEnabled, onClick, isLoading }: NextButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission
    if (isEnabled && !isLoading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isEnabled || isLoading}
      className={cn(
        "px-6 py-2.5 rounded-lg font-medium",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isEnabled && !isLoading
          ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          : "bg-gray-100 text-gray-400 cursor-not-allowed",
        "flex items-center gap-2"
      )}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Validating...
        </>
      ) : (
        <>
          Next
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </>
      )}
    </button>
  );
}