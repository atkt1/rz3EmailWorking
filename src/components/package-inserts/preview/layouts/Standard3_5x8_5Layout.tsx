import { cn } from '@/lib/utils';
import { ImagePreview } from '../ImagePreview';
import { QRCodePreview } from '../QRCodePreview';
import type { PackageInsert } from '@/lib/types/packageInsert';

interface LayoutProps {
  design: PackageInsert;
  surveyUrl?: string;
}

export function Standard3_5x8_5Layout({ design, surveyUrl }: LayoutProps) {
  return (
    <div className="absolute inset-0 flex">
      {/* Left Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        {design.include_logo && (
          <ImagePreview
            src={design.logo_path}
            alt="Logo"
            className="w-14 h-14 mb-6"
            placeholder="Logo"
          />
        )}
        <div className="space-y-1.5">
          <h3 className="text-2xl font-bold text-gray-900">
            {design.headline}
          </h3>
          <p className="text-sm text-gray-600">
            {design.subtitle}
          </p>
        </div>
      </div>

      {/* QR Code */}
      <div className="w-32 h-full flex items-center justify-center pr-4">
        <QRCodePreview
          url={surveyUrl}
          brandUrl={design.brand_url}
          className="w-40 bg-white rounded-lg p-4"
        />
      </div>
    </div>
  );
}