import { CreateSurveyForm } from '@/components/surveys/CreateSurveyForm';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';

export function CreateSurveyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn(
          "text-2xl font-bold mb-2",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Create New Survey
        </h1>
        <p className={cn(
          "text-base",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>
          Design your survey to collect valuable customer feedback and improve your products.
        </p>
      </div>

      <div className={cn(
        "rounded-xl p-6 border",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <CreateSurveyForm />
      </div>
    </div>
  );
}