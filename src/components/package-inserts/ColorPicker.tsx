import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-2">
      <label className={cn(
        "block text-sm font-medium",
        isDark ? "text-gray-200" : "text-gray-700"
      )}>
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
        </div>
        
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "flex-1 rounded-lg border px-3 py-2",
            isDark ? [
              "bg-gray-700 border-gray-600",
              "text-gray-100 placeholder-gray-400"
            ] : [
              "bg-white border-gray-300",
              "text-gray-900 placeholder-gray-400"
            ],
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          )}
          placeholder="#000000"
          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        />
      </div>
    </div>
  );
}