export interface UploadStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}