import { cn } from '@/lib/utils';
import type { PackageInsert } from '@/lib/types/packageInsert';

interface PreviewContentProps {
  design: PackageInsert;
}

export function PreviewContent({ design }: PreviewContentProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
      {design.include_logo && (
        <div className="w-16 h-16 mb-4 rounded-full bg-white/90 flex items-center justify-center">
          <span className="text-sm text-gray-400">Logo</span>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2 text-gray-800">
        {design.headline}
      </h3>
      <p className="text-sm mb-6 text-gray-600">
        {design.subtitle}
      </p>
      
      <div className="w-32 h-32 bg-white rounded-lg shadow-sm mb-4 flex items-center justify-center">
        <span className="text-sm text-gray-400">QR Code</span>
      </div>
      
      {design.brand_url && (
        <p className="text-xs text-gray-500">
          {design.brand_url}
        </p>
      )}
    </div>
  );
}