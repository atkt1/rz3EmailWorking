import { AlertTriangle } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useClearOrders } from '@/lib/hooks/useClearOrders';

interface ClearOrdersDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ClearOrdersDialog({ open, onClose }: ClearOrdersDialogProps) {
  const { clearOrders, isClearing } = useClearOrders();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!open) return null;

  const handleClear = async () => {
    await clearOrders();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className={cn(
        "relative w-full max-w-md rounded-xl p-6",
        isDark ? "bg-gray-800" : "bg-white"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className={cn(
            "text-xl font-semibold",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Clear All Orders
          </h2>
        </div>

        <p className={cn(
          "mb-6",
          isDark ? "text-gray-300" : "text-gray-600"
        )}>
          Are you sure you want to clear all orders? This action cannot be undone and will prevent customers from submitting reviews.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isClearing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={isClearing}
          >
            {isClearing ? 'Clearing...' : 'Clear All Orders'}
          </Button>
        </div>
      </div>
    </div>
  );
}