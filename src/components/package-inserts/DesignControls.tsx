import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { ColorPicker } from './ColorPicker';
import { useActiveSurveys } from '@/lib/hooks/useActiveSurveys';
import type { PackageInsert } from '@/lib/types/packageInsert';

interface DesignControlsProps {
  design: PackageInsert;
  onChange: (design: PackageInsert) => void;
}

// Match exact database enum values
const STYLE_OPTIONS = [
  'Basic (3.5" X 8.5")',
  'Basic (4" X 6")',
  'Standard (3.5" X 8.5")',
  'Standard (4" X 6")'
];

export function DesignControls({ design, onChange }: DesignControlsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { data: surveys = [], isLoading: isLoadingSurveys } = useActiveSurveys();

  const handleChange = <K extends keyof PackageInsert>(
    field: K,
    value: PackageInsert[K]
  ) => {
    onChange({ ...design, [field]: value });
  };

  return (
    <div className={cn(
      "rounded-xl border p-6 space-y-6",
      isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
    )}>
      <FormInput
        label="Nickname"
        value={design.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Enter a nickname for this design"
      />

      <FormSelect
        label="Style & Size"
        value={design.style_size}
        onChange={(e) => handleChange('style_size', e.target.value as PackageInsert['style_size'])}
        options={STYLE_OPTIONS}
      />

      <FormSelect
        label="Survey"
        value={design.survey_id}
        onChange={(e) => handleChange('survey_id', e.target.value)}
        options={surveys.map(survey => ({
          value: survey.id,
          label: survey.survey_name
        }))}
        isLoading={isLoadingSurveys}
        placeholder="Select a survey"
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="include-logo"
          checked={design.include_logo}
          onChange={(e) => handleChange('include_logo', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label 
          htmlFor="include-logo"
          className={cn(
            "text-sm font-medium",
            isDark ? "text-gray-200" : "text-gray-700"
          )}
        >
          Include Logo
        </label>
      </div>

      <ColorPicker
        label="Background Color"
        color={design.background_color}
        onChange={(color) => handleChange('background_color', color)}
      />

      <FormInput
        label="Headline"
        value={design.headline}
        onChange={(e) => handleChange('headline', e.target.value)}
        placeholder="Enter headline text"
        maxLength={50}
        helperText="Maximum 50 characters"
      />

      <FormInput
        label="Subtitle"
        value={design.subtitle}
        onChange={(e) => handleChange('subtitle', e.target.value)}
        placeholder="Enter subtitle text"
        maxLength={100}
        helperText="Maximum 100 characters"
      />

      <FormInput
        label="Brand URL"
        value={design.brand_url}
        onChange={(e) => handleChange('brand_url', e.target.value)}
        placeholder="Enter your brand URL"
        maxLength={100}
        helperText="Maximum 100 characters"
      />
    </div>
  );
}