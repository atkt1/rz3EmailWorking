import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import type { SortDirection } from '@/lib/types/table';

interface SortableHeaderProps {
  field: string;
  label: string;
  currentSort: string;
  direction: SortDirection;
  onSort: (field: string) => void;
}

export function SortableHeader({
  field,
  label,
  currentSort,
  direction,
  onSort
}: SortableHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isActive = currentSort === field;

  return (
    <th className="px-6 py-4 text-left font-medium">
      <button
        onClick={() => onSort(field)}
        className={cn(
          "flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100",
          "transition-colors duration-200"
        )}
      >
        {label}
        <span className="inline-flex">
          {isActive ? (
            direction === 'asc' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )
          ) : (
            <ArrowUpDown className="w-4 h-4 opacity-50" />
          )}
        </span>
      </button>
    </th>
  );
}