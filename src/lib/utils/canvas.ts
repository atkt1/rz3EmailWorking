import { getDrawConfig } from './canvas/config';
import { setupCanvas, drawLogo, drawQRCode, drawContent } from './canvas/draw';
import type { PackageInsert } from '../types/packageInsert';

export async function generatePreviewImage(
  insert: PackageInsert,
  qrCode: string,
  highRes: boolean = false
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true
      });
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      const config = getDrawConfig(insert);
      canvas.width = config.width;
      canvas.height = config.height;
      
      // Setup canvas first
      setupCanvas(ctx, insert, config);
      
      // Handle logo drawing
      const hasLogo = insert.include_logo && insert.logo_path;
      if (hasLogo) {
        const logoDrawn = await drawLogo(ctx, insert.logo_path!, config);
        if (!logoDrawn) {
          console.warn('Logo failed to draw');
        }
      }
      
      // Draw content after logo (whether it succeeded or failed)
      drawContent(ctx, insert, config, hasLogo);
      
      // Draw QR code last
      await drawQRCode(ctx, qrCode, config);
      
      resolve(canvas.toDataURL('image/png', 1.0));
    } catch (error) {
      reject(error);
    }
  });
}
