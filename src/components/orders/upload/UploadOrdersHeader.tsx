import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function UploadOrdersHeader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div>
      <h1 className={cn(
        "text-2xl font-bold mb-2",
        isDark ? "text-white" : "text-gray-900"
      )}>
        Upload Orders
      </h1>
      <p className={cn(
        isDark ? "text-gray-400" : "text-gray-600"
      )}>
        Only respondents who enter a value that you've uploaded here will be allowed to enter your review flow
      </p>
    </div>
  );
}