import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/context/ThemeContext';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: (string | SelectOption)[];
  isLoading?: boolean;
  required?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, isLoading, required, className, ...props }, ref) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
      <div className="space-y-1.5">
        <label className={cn(
          "block text-sm font-medium",
          isDark ? "text-gray-200" : "text-gray-700",
          "flex items-center gap-1"
        )}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        
        <select
          ref={ref}
          required={required}
          disabled={isLoading}
          className={cn(
            "block w-full rounded-lg border px-4 py-2.5",
            "transition-colors duration-200",
            isDark ? [
              "bg-gray-900 border-gray-700",
              "text-white",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            ] : [
              "bg-white border-gray-300",
              "text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            ],
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && (isDark ? "border-red-500/50 bg-red-500/5" : "border-red-300 bg-red-50"),
            className
          )}
          {...props}
        >
          <option value="" className={isDark ? "bg-gray-900" : "bg-white"}>
            {isLoading ? "Loading..." : props.placeholder || "Select an option"}
          </option>
          {options.map((option, index) => {
            if (typeof option === 'string') {
              return (
                <option 
                  key={option}
                  value={option}
                  className={isDark ? "bg-gray-900" : "bg-white"}
                >
                  {option}
                </option>
              );
            }
            return (
              <option 
                key={option.value}
                value={option.value}
                className={isDark ? "bg-gray-900" : "bg-white"}
              >
                {option.label}
              </option>
            );
          })}
        </select>
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

FormSelect.displayName = 'FormSelect';