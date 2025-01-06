/**
 * Optimizes an image by resizing and compressing it
 * @param file The image file to optimize
 * @param maxSize Maximum file size in bytes
 * @returns Promise<Blob> The optimized image
 */
export async function optimizeImage(file: File, maxSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate dimensions while maintaining aspect ratio
      let { width, height } = img;
      const maxDimension = 1200;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Create canvas and draw image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with quality adjustment
      let quality = 0.9;
      const tryCompress = (q: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }

            if (blob.size > maxSize && q > 0.1) {
              // Recursively try with lower quality
              tryCompress(q - 0.1);
            } else {
              resolve(blob);
            }
          },
          'image/jpeg',
          q
        );
      };

      tryCompress(quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}