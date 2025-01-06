import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  onImageSelect: (file: File | null) => void;
  onExistingLogoSelect: (url: string) => void;
  currentLogo?: string;
  error?: string;
}

export function LogoUpload({ 
  onImageSelect, 
  onExistingLogoSelect,
  currentLogo,
  error 
}: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Initialize with current logo if available
  useEffect(() => {
    if (currentLogo && !preview) {
      setPreview(currentLogo);
      // Ensure parent components know about the current logo
      onExistingLogoSelect(currentLogo);
    }
  }, [currentLogo, preview, onExistingLogoSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 750 * 1024) {
      alert('File size must be less than 750KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear existing logo selection and set new file
    onExistingLogoSelect('');
    onImageSelect(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    // Clear both file and existing logo selection
    onImageSelect(null);
    onExistingLogoSelect('');
    
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <label className={cn(
        "block text-sm font-medium",
        isDark ? "text-gray-200" : "text-gray-700"
      )}>
        Logo Image
      </label>
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="logo-upload"
        />
        
        <label
          htmlFor="logo-upload"
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-40',
            'border-2 border-dashed rounded-lg cursor-pointer',
            'transition-colors duration-200',
            error 
              ? isDark 
                ? 'border-red-500/50 bg-red-500/10'
                : 'border-red-300 bg-red-50'
              : isDark
                ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                : 'border-gray-300 bg-white hover:bg-gray-50'
          )}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Logo preview"
                className="w-full h-full object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className={cn(
                  "absolute top-2 right-2 p-2 rounded-full",
                  isDark 
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-400" 
                    : "bg-white hover:bg-gray-100 text-gray-600"
                )}
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Upload className={cn(
                "w-12 h-12 mb-4",
                isDark ? "text-gray-500" : "text-gray-400"
              )} />
              <p className={cn(
                "text-sm",
                isDark ? "text-gray-300" : "text-gray-600"
              )}>
                Click to upload logo
              </p>
              <p className={cn(
                "mt-1 text-xs",
                isDark ? "text-gray-500" : "text-gray-500"
              )}>
                PNG, JPG up to 750KB
              </p>
            </div>
          )}
        </label>
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