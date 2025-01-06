import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ isOpen, onClose, onConfirm }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Leave Site?</h3>
        <p className="text-gray-600 mb-4">
          This page will automatically refresh once you post your copied review on Amazon.
          Don't close or refresh this page!
        </p>
        <p className="text-gray-600 mb-6">Continue to Amazon?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}