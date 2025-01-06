import { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="group">
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-blue-600"
        >
          {label}
        </label>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            className="
              block w-full rounded-lg border border-gray-300 px-4 py-2.5
              bg-white/50 backdrop-blur-sm
              transition-all duration-200
              placeholder:text-gray-400
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          <div className="absolute inset-0 rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-blue-500/5" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';