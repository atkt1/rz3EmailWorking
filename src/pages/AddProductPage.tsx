import { AddProductForm } from '@/components/products/AddProductForm';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function AddProductPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn(
          "text-2xl font-bold mb-2",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Add New Product
        </h1>
        <p className={cn(
          "text-base",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>
          Add your product details to start collecting and managing reviews.
        </p>
      </div>

      <div className={cn(
        "rounded-xl p-6 border",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <AddProductForm />
      </div>
    </div>
  );
}