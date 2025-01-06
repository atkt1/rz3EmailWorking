// Utility functions for handling Supabase storage paths

/**
 * Extracts the storage path from a Supabase storage URL
 * Example URL: https://fmhcsfklkdpwocanpnng.supabase.co/storage/v1/object/public/products/user-id/filename.jpg
 * Returns: user-id/filename.jpg
 */
export function getStoragePathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Remove "storage", "v1", "object", "public", "products" from the path
    return pathParts.slice(6).join('/');
  } catch (error) {
    console.error('Error parsing storage URL:', error);
    return '';
  }
}

/**
 * Validates if a path exists in storage
 */
export function isValidStoragePath(path: string): boolean {
  return path.length > 0 && !path.includes('undefined') && !path.includes('null');
}