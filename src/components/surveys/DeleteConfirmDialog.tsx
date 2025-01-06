import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm }: DeleteConfirmDialogProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cn(
        "relative z-50 w-full max-w-md rounded-xl p-6 shadow-lg",
        isDark ? "bg-gray-800" : "bg-white"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-2",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Delete Survey
        </h3>
        <p className={cn(
          "mb-6",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>
          Are you sure you want to delete this survey? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}