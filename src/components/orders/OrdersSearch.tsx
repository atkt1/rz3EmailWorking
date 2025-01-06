import { Search } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { useOrderSearch } from '@/lib/hooks/useOrderSearch';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useCallback } from 'react';

export function OrdersSearch() {
  const { searchQuery, setSearchQuery } = useOrderSearch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const debouncedSetSearch = useDebounce(setSearchQuery, 300);

  const handleSearchChange = useCallback((value: string) => {
    debouncedSetSearch(value.trim());
  }, [debouncedSetSearch]);

  return (
    <div className="space-y-3">
      <h2 className={cn(
        "text-lg font-semibold",
        isDark ? "text-gray-200" : "text-gray-900"
      )}>
        Order Search
      </h2>
      
      <p className={cn(
        "text-sm",
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        Check if you've imported a specific order by searching for its source platform Order ID.
      </p>

      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
          isDark ? "text-gray-500" : "text-gray-400"
        )} />
        
        <input
          type="text"
          defaultValue={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="ex. 888-123-123445"
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-lg",
            "transition-colors duration-200",
            isDark ? [
              "bg-gray-900 border-gray-700",
              "text-white placeholder:text-gray-500",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            ] : [
              "bg-white border-gray-300",
              "text-gray-900 placeholder:text-gray-400",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            ],
            "border"
          )}
        />
      </div>
    </div>
  );
}