import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

interface PreviewHeaderProps {
  width: number;
  height: number;
  styleSize: string;
}

export function PreviewHeader({ width, height, styleSize }: PreviewHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-between">
      <h2 className={cn(
        "text-lg font-medium",
        isDark ? "text-gray-200" : "text-gray-900"
      )}>
        Preview
      </h2>
      <div className={cn(
        "text-sm",
        isDark ? "text-gray-400" : "text-gray-500"
      )}>
        {width} × {height}
      </div>
    </div>
  );
}