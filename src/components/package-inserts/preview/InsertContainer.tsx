import { cn } from '@/lib/utils';
import { INSERT_DIMENSIONS } from '@/lib/constants/dimensions';
import type { PackageInsert } from '@/lib/types/packageInsert';



interface InsertContainerProps {
  design: PackageInsert;
  children: React.ReactNode;
}

export function InsertContainer({ design, children }: InsertContainerProps) {
  // Default dimensions for when no style is selected
  const defaultDimensions = {
    width: 360,
    height: 240
  };

  // Use default dimensions if style_size is not set or invalid
  const dimensions = design.style_size ? INSERT_DIMENSIONS[design.style_size] || defaultDimensions : defaultDimensions;

  return (
    <div 
      className={cn(
        "relative bg-white shadow-lg transition-all duration-200",
        !design.style_size && "opacity-50" // Dim the preview when no style is selected
      )}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: design.background_color
      }}
      data-width={dimensions.width}
      data-height={dimensions.height}
    >
      {children}
    </div>
  );
}
