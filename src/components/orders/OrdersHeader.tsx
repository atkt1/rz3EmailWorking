import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function OrdersHeader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div>
      <h1 className={cn(
        "text-2xl font-bold mb-2",
        isDark ? "text-white" : "text-gray-900"
      )}>
        Orders
      </h1>
      <p className={cn(
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        Manage your imported orders and search for specific entries
      </p>
    </div>
  );
}