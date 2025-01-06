import { useCallback } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import type { UploadStatus } from '@/lib/types/order';

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  uploadStatus: UploadStatus;
}

export function FileUpload({ file, onChange, uploadStatus }: FileUploadProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'text/csv') {
      onChange(droppedFile);
    }
  }, [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className={cn(
        "block text-sm font-medium",
        isDark ? "text-gray-200" : "text-gray-700"
      )}>
        Upload CSV File
      </label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6",
          "transition-colors duration-200",
          isDark ? [
            "bg-gray-900/50",
            file ? "border-blue-500/50" : "border-gray-700",
          ] : [
            "bg-gray-50/50",
            file ? "border-blue-500/50" : "border-gray-300",
          ]
        )}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-gray-800" : "bg-white"
              )}>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className={cn(
                  "font-medium",
                  isDark ? "text-gray-200" : "text-gray-900"
                )}>
                  {file.name}
                </p>
                <p className={cn(
                  "text-sm",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className={cn(
                "p-1 rounded-full hover:bg-gray-200 transition-colors",
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDark ? "text-gray-600" : "text-gray-400"
            )} />
            <div className="space-y-1">
              <p className={cn(
                "font-medium",
                isDark ? "text-gray-300" : "text-gray-700"
              )}>
                Drop your CSV file here, or{' '}
                <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className={cn(
                "text-sm",
                isDark ? "text-gray-500" : "text-gray-600"
              )}>
                Only CSV files are supported
              </p>
            </div>
          </div>
        )}

        {uploadStatus.status === 'error' && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-red-500/10 rounded-lg backdrop-blur-sm"
          )}>
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{uploadStatus.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}