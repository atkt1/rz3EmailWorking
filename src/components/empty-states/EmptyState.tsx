import { LucideIcon } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center p-8 h-[calc(100vh-12rem)]',
      'rounded-xl border transition-colors duration-300',
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'
    )}>
      <div className={cn(
        'w-16 h-16 rounded-xl mb-6 flex items-center justify-center',
        isDark ? 'bg-gray-700' : 'bg-blue-50'
      )}>
        <Icon className={cn(
          'w-8 h-8',
          isDark ? 'text-blue-400' : 'text-blue-600'
        )} />
      </div>
      
      <h2 className={cn(
        'text-2xl font-bold mb-3',
        isDark ? 'text-white' : 'text-gray-900'
      )}>
        {title}
      </h2>
      
      <p className={cn(
        'max-w-sm mb-8',
        isDark ? 'text-gray-400' : 'text-gray-600'
      )}>
        {description}
      </p>

      <Button
        onClick={onAction}
        className={cn(
          'px-6 py-2.5 font-medium',
          isDark 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
        )}
      >
        {actionLabel}
      </Button>
    </div>
  );
}