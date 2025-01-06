import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function OrdersTableSkeleton() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden animate-pulse",
      isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
    )}>
      {/* Header with Refresh Icon */}
      <div className={cn(
        "flex items-center justify-between px-6 py-4 border-b",
        isDark ? "border-gray-700" : "border-gray-200"
      )}>
        <div className={cn(
          "h-5 w-24 rounded",
          isDark ? "bg-gray-700" : "bg-gray-200"
        )} />
        <div className={cn(
          "h-8 w-8 rounded-lg",
          isDark ? "bg-gray-700" : "bg-gray-200"
        )} />
      </div>

      {/* Table Header */}
      <div className={cn(
        "h-10 border-b flex items-center",
        isDark ? "border-gray-700" : "border-gray-200"
      )}>
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "flex-1 px-6",
              isDark ? "bg-gray-700" : "bg-gray-200",
              "h-4 rounded mx-2"
            )} 
          />
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="flex items-center h-10 px-6"
          >
            {[...Array(3)].map((_, j) => (
              <div 
                key={j}
                className={cn(
                  "flex-1 mx-2",
                  isDark ? "bg-gray-700" : "bg-gray-200",
                  "h-3 rounded",
                  j === 0 && "w-1/3",
                  j === 1 && "w-1/4",
                  j === 2 && "w-1/5"
                )}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className={cn(
        "flex items-center justify-between px-6 py-3 border-t",
        isDark ? "border-gray-700" : "border-gray-200"
      )}>
        <div className={cn(
          "h-8 w-8 rounded-lg",
          isDark ? "bg-gray-700" : "bg-gray-200"
        )} />
        <div className={cn(
          "h-4 w-24 rounded",
          isDark ? "bg-gray-700" : "bg-gray-200"
        )} />
        <div className={cn(
          "h-8 w-8 rounded-lg",
          isDark ? "bg-gray-700" : "bg-gray-200"
        )} />
      </div>
    </div>
  );
}