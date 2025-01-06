import { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './login-form';
import { SignUpForm } from './signup-form';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        {view === 'login' ? (
          <LoginForm onToggleView={() => setView('signup')} />
        ) : (
          <SignUpForm onToggleView={() => setView('login')} />
        )}
      </div>
    </div>
  );
}