import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { InsertContent } from './preview/InsertContent';
import { InsertContainer } from './preview/InsertContainer';
import type { PackageInsert } from '@/lib/types/packageInsert';

interface DesignPreviewProps {
  design: PackageInsert;
  surveyUrl?: string;
}

export function DesignPreview({ design, surveyUrl }: DesignPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "rounded-xl border h-full flex flex-col",
      isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
    )}>
      {/* Preview Header */}
      <div className="text-center p-4 border-b">
        <h2 className={cn(
          "text-lg font-medium",
          isDark ? "text-gray-200" : "text-gray-900"
        )}>
          Preview
        </h2>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <InsertContainer design={design}>
          <InsertContent 
            design={design}
            surveyUrl={surveyUrl}
          />
        </InsertContainer>
      </div>
    </div>
  );
}