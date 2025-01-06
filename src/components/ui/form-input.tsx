import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/context/ThemeContext';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
      <div className="space-y-1.5">
        <label 
          htmlFor={props.id} 
          className={cn(
            "block text-sm font-medium",
            isDark ? "text-gray-200" : "text-gray-700"
          )}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className={cn(
              "block w-full rounded-lg border px-4 py-2.5",
              "transition-colors duration-200",
              isDark ? [
                "bg-gray-900 border-gray-700",
                "text-white placeholder:text-gray-500",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              ] : [
                "bg-white border-gray-300",
                "text-gray-900 placeholder:text-gray-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              ],
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && (isDark ? "border-red-500/50" : "border-red-300"),
              className
            )}
          />
          {helperText && (
            <span className={cn(
              "text-xs mt-1 block",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              {helperText}
            </span>
          )}
        </div>
        {error && (
          <p className={cn(
            "text-sm mt-1.5",
            isDark ? "text-red-400" : "text-red-600"
          )}>{error}</p>
        )}
      </div>
    );
  }
);