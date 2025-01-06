import { UploadOrdersHeader } from '@/components/orders/upload/UploadOrdersHeader';
import { UploadOrdersForm } from '@/components/orders/upload/UploadOrdersForm';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function UploadOrdersPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <UploadOrdersHeader />
      
      <div className={cn(
        "rounded-xl border",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <UploadOrdersForm />
      </div>
    </div>
  );
}