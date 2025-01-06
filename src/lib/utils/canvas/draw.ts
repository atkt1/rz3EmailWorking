import type { PackageInsert } from '../../types/packageInsert';
import type { DrawConfig } from './config';
import { loadImage, getScaledDimensions } from './image';
import { DEFAULT_FONT_FAMILY } from './config';

export function setupCanvas(
  ctx: CanvasRenderingContext2D,
  insert: PackageInsert,
  config: DrawConfig
): void {
  ctx.fillStyle = insert.background_color;
  ctx.fillRect(0, 0, config.width, config.height);
  
  ctx.textBaseline = 'middle';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

export async function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoPath: string,
  config: DrawConfig
): Promise<boolean> {
  try {
    // Create a promise that resolves when the image is loaded
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = 'anonymous'; // Important for CORS
      img.src = logoPath;
    });

    // Wait for image to load
    const logo = await loadPromise;
    
    const maxSize = 56 * config.scale;
    const { width, height } = getScaledDimensions(logo.width, logo.height, maxSize);
    
    const x = config.padding.x;
    const y = config.padding.y;
    
    ctx.drawImage(logo, x, y, width, height);
    
    return true;
  } catch (error) {
    console.error('Error drawing logo:', error);
    return false;
  }
}


export async function drawQRCode(
  ctx: CanvasRenderingContext2D,
  qrCode: string,
  config: DrawConfig
): Promise<void> {
  const qr = await loadImage(qrCode);
  const padding = 16 * config.scale;
  
  const x = config.width - config.qrSize - config.padding.x;
  const y = (config.height - config.qrSize) / 2;
  
  // White background for QR code
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x - padding/2, y - padding/2, config.qrSize + padding, config.qrSize + padding);
  
  // Draw QR code
  ctx.drawImage(qr, x, y, config.qrSize, config.qrSize);
}

export function drawContent(
  ctx: CanvasRenderingContext2D,
  insert: PackageInsert,
  config: DrawConfig,
  hasLogo: boolean
): void {
  const logoOffset = hasLogo ? 80 * config.scale : 0;
  const contentY = config.padding.y + logoOffset;
  
  // Headline
  ctx.font = `bold ${32 * config.scale}px ${DEFAULT_FONT_FAMILY}`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  
  const headlineX = config.padding.x;
  const headlineY = contentY + (32 * config.scale);
  ctx.fillText(insert.headline, headlineX, headlineY, config.contentWidth);
  
  // Subtitle
  ctx.font = `${20 * config.scale}px ${DEFAULT_FONT_FAMILY}`;
  ctx.fillStyle = '#374151';
  
  const subtitleY = headlineY + (40 * config.scale);
  ctx.fillText(insert.subtitle, headlineX, subtitleY, config.contentWidth);
  
  // Brand URL
  if (insert.brand_url) {
    ctx.font = `${14 * config.scale}px ${DEFAULT_FONT_FAMILY}`;
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    
    const urlX = config.width - (config.qrSize / 2) - config.padding.x;
    const urlY = config.height - config.padding.y;
    ctx.fillText(insert.brand_url, urlX, urlY);
  }
}