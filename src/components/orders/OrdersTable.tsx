import { useState } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/date';
import { OrdersTableSkeleton } from './OrdersTableSkeleton';
import { useOrders } from '@/lib/hooks/useOrders';
import { useQueryClient } from '@tanstack/react-query';
import { SortableHeader } from './table/SortableHeader';
import type { SortDirection } from '@/lib/types/table';

export function OrdersTable() {
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  const params = {
    page,
    perPage: 25,
    sortField,
    sortDirection
  };

  const { data, isLoading, error } = useOrders(params);
  const totalPages = data?.total ? Math.ceil(data.total / params.perPage) : 1;

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1); // Reset to first page when sorting changes
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['orders'] });
    setIsRefreshing(false);
  };

  const handlePageChange = (newPage: number) => {
    if (data?.total) {
      const maxPage = Math.ceil(data.total / params.perPage);
      setPage(Math.min(newPage, maxPage));
    } else {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return <OrdersTableSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-600">Failed to load orders</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
    )}>
      {/* Table Header with Refresh Button */}
      <div className="flex items-center justify-between px-6 py-1 border-b border-gray-200 dark:border-gray-700">
        <h3 className={cn(
          "font-medium",
          isDark ? "text-gray-200" : "text-gray-900"
        )}>
          Orders List
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "hover:scale-105",
            isDark
              ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
            isRefreshing && "animate-spin"
          )}
          title="Refresh orders"
        >
          <RotateCw className="w-7 h-7" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn(
              "border-b text-sm",
              isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
            )}>
              <SortableHeader
                field="order_id"
                label="Order ID"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="marketplace"
                label="Marketplace"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="created_at"
                label="Created At"
                currentSort={sortField}
                direction={sortDirection}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y",
            isDark ? "divide-gray-700" : "divide-gray-200"
          )}>
            {data?.orders.map((order) => (
              <tr 
                key={order.id}
                className={cn(
                  "transition-colors duration-150",
                  isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                )}
              >
                <td className={cn(
                  "px-4 py-1 font-medium",
                  isDark ? "text-gray-200" : "text-gray-900"
                )}>
                  {order.order_id}
                </td>
                <td className={cn(
                  "px-4 py-1",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}>
                  {order.marketplace}
                </td>
                <td className={cn(
                  "px-4 py-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {formatDate(order.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={cn(
        "flex items-center justify-between px-6 py-3 border-t",
        isDark ? "border-gray-700" : "border-gray-200"
      )}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isDark 
              ? "hover:bg-gray-700 text-gray-400" 
              : "hover:bg-gray-100 text-gray-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className={cn(
          "text-sm",
          isDark ? "text-gray-400" : "text-gray-500"
        )}>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isDark 
              ? "hover:bg-gray-700 text-gray-400" 
              : "hover:bg-gray-100 text-gray-600",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}