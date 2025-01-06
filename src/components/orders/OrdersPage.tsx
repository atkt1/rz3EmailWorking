import { OrdersHeader } from './OrdersHeader';
import { OrdersSearch } from './OrdersSearch';
import { OrdersTable } from './OrdersTable';
import { ClearOrdersSection } from './ClearOrdersSection';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function OrdersPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <OrdersHeader />
      
      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="p-6">
          <OrdersSearch />
        </div>
      </div>

      {/* Orders Table Section */}
      <OrdersTable />

      <ClearOrdersSection />
    </div>
  );
}