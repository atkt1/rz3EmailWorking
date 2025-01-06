import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { generateQRCode } from '@/lib/utils/qrCode';

interface QRCodePreviewProps {
  url?: string;
  brandUrl?: string;
  className?: string;
}

export function QRCodePreview({ url, brandUrl, className }: QRCodePreviewProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateCode() {
      if (!url) {
        setQrCode(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const qrDataUrl = await generateQRCode(url);
        setQrCode(qrDataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    }

    generateCode();
  }, [url]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-full aspect-square flex items-center justify-center">
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        ) : error ? (
          <span className="text-sm text-red-500">Error</span>
        ) : qrCode ? (
          <img 
            src={qrCode} 
            alt="QR Code"
            className="w-full h-full object-contain" 
          />
        ) : (
          <span className="text-sm text-gray-400">QR Code</span>
        )}
      </div>
      {brandUrl && (
        <p className="text-xs text-center text-gray-500 mt-2">
          {brandUrl}
        </p>
      )}
    </div>
  );
}