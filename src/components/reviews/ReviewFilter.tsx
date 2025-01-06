import { Search } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import type { ReviewFilter } from '@/lib/types/review';

const DATE_OPTIONS = [
  { value: '10days', label: 'Last 10 Days' },
  { value: '1month', label: 'Last Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: 'all', label: 'All Reviews' }
];

const SEARCH_FIELDS = [
  { value: 'order_id', label: 'Order ID' },
  { value: 'email_id', label: 'Email' },
  { value: 'survey_name', label: 'Survey Name' }
];

interface ReviewFilterProps {
  filters: ReviewFilter;
  onFilterChange: (filters: ReviewFilter) => void;
}

export function ReviewFilter({ filters, onFilterChange }: ReviewFilterProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const inputClasses = cn(
    "w-full rounded-lg border px-3 py-2 transition-colors duration-200",
    isDark ? [
      "bg-gray-700 border-gray-600",
      "text-gray-100 placeholder-gray-400",
      "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    ] : [
      "bg-white border-gray-300",
      "text-gray-900 placeholder-gray-400",
      "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    ]
  );

  return (
    <div className={cn(
      "rounded-lg p-4 space-y-4",
      isDark ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-200"
    )}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className={cn(
            "block text-sm font-medium mb-1",
            isDark ? "text-gray-200" : "text-gray-700"
          )}>
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onFilterChange({
              ...filters,
              dateRange: e.target.value as ReviewFilter['dateRange']
            })}
            className={inputClasses}
          >
            {DATE_OPTIONS.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                className={isDark ? "bg-gray-700" : "bg-white"}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className={cn(
            "block text-sm font-medium mb-1",
            isDark ? "text-gray-200" : "text-gray-700"
          )}>
            Search Field
          </label>
          <select
            value={filters.searchField || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              searchField: e.target.value as ReviewFilter['searchField']
            })}
            className={inputClasses}
          >
            <option value="" className={isDark ? "bg-gray-700" : "bg-white"}>
              Select field...
            </option>
            {SEARCH_FIELDS.map(field => (
              <option 
                key={field.value} 
                value={field.value}
                className={isDark ? "bg-gray-700" : "bg-white"}
              >
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className={cn(
            "block text-sm font-medium mb-1",
            isDark ? "text-gray-200" : "text-gray-700"
          )}>
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                searchQuery: e.target.value
              })}
              placeholder="Search..."
              className={cn(inputClasses, "pl-10")}
            />
            <Search className={cn(
              "absolute left-3 top-2.5 h-5 w-5",
              isDark ? "text-gray-400" : "text-gray-400"
            )} />
          </div>
        </div>
      </div>
    </div>
  );
}