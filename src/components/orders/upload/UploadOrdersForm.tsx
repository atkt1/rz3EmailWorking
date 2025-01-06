import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useEnums } from '@/lib/hooks/useEnums';
import { useTheme } from '@/lib/context/ThemeContext';
import { useAuth } from '@/lib/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormSelect } from '@/components/ui/form-select';
import { FileUpload } from './FileUpload';
import { processOrdersFile } from '@/lib/services/orderUploadService';
import { useToast } from '@/lib/hooks/useToast';
import type { UploadStatus } from '@/lib/types/order';

export function UploadOrdersForm() {
  const [marketplace, setMarketplace] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' });
  const [showMarketplaceError, setShowMarketplaceError] = useState(false);
  const enums = useEnums();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setShowMarketplaceError(false);

    // Validate marketplace selection
    if (!marketplace) {
      setShowMarketplaceError(true);
      toast.error('Please select a marketplace');
      return;
    }

    if (!file || !user) return;

    try {
      setUploadStatus({ status: 'processing' });
      await processOrdersFile(file, marketplace, user.id);
      setUploadStatus({ status: 'success' });
      toast.success('Orders uploaded successfully');
      
      // Reset form
      setFile(null);
      setMarketplace('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload orders';
      setUploadStatus({ status: 'error', message });
      toast.error(message);
    }
  };

  const handleMarketplaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMarketplace(e.target.value);
    setShowMarketplaceError(false); // Clear error when user makes a selection
  };

  const isSubmitDisabled = !file || uploadStatus.status === 'processing';

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <FormSelect
        label="Marketplace"
        value={marketplace}
        onChange={handleMarketplaceChange}
        options={enums?.marketplace || []}
        placeholder="Select marketplace"
        error={showMarketplaceError ? 'Please select a marketplace' : undefined}
        required
      />

      <FileUpload
        file={file}
        onChange={setFile}
        uploadStatus={uploadStatus}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className={cn(
            "gap-2",
            uploadStatus.status === 'processing' && "opacity-50 cursor-not-allowed"
          )}
        >
          <Upload className="w-4 h-4" />
          {uploadStatus.status === 'processing' ? 'Uploading...' : 'Upload Orders'}
        </Button>
      </div>
    </form>
  );
}