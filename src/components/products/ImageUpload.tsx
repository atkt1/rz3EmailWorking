import { useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/context/ThemeContext';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  error?: string;
}

export function ImageUpload({ onImageSelect, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageSelect(file);
  };

  return (
    <div className="space-y-1.5">
      <label className={cn(
        "block text-sm font-medium",
        isDark ? "text-gray-200" : "text-gray-700"
      )}>
        Product Image
      </label>
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="product-image"
        />
        
        <label
          htmlFor="product-image"
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-64',
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
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
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
                Click to upload product image
              </p>
              <p className={cn(
                "mt-1 text-xs",
                isDark ? "text-gray-500" : "text-gray-500"
              )}>
                PNG, JPG up to 5MB
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