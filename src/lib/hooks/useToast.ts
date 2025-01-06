import { useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return {
    toasts,
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message)
  };
}