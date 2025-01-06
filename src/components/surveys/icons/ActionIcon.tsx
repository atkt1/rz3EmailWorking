import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/context/ThemeContext';
import type { LucideIcon } from 'lucide-react';

interface ActionIconProps {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  variant?: 'default' | 'blue' | 'yellow' | 'red';
}

export function ActionIcon({ icon: Icon, onClick, label, variant = 'default' }: ActionIconProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const variantStyles = {
    default: isDark 
      ? "text-gray-400 hover:bg-gray-700/50"
      : "text-gray-600 hover:bg-gray-100",
    blue: isDark 
      ? "text-blue-400 hover:bg-blue-500/10"
      : "text-blue-600 hover:bg-blue-50",
    yellow: isDark 
      ? "text-yellow-400 hover:bg-yellow-500/10"
      : "text-yellow-600 hover:bg-yellow-50",
    red: isDark 
      ? "text-red-400 hover:bg-red-500/10"
      : "text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "hover:scale-105",
        variantStyles[variant]
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}