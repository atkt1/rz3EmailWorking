import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ClearOrdersDialog } from './ClearOrdersDialog';

export function ClearOrdersSection() {
  const [showDialog, setShowDialog] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <div className={cn(
        "rounded-xl border p-6",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="space-y-6">
          {/* Warning Messages */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">
                Proceed with Caution. Customers will not be able to respond to any survey after all orders are removed from the system.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-100">
              <AlertTriangle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                All orders older than 2 months will be automatically removed from the system
              </p>
            </div>
          </div>

          {/* Centered Button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="destructive"
              onClick={() => setShowDialog(true)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm"
            >
              Clear All Orders
            </Button>
          </div>
        </div>
      </div>

      <ClearOrdersDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}