export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
    img.crossOrigin = 'anonymous';
  });
}

export function getScaledDimensions(
  originalWidth: number,
  originalHeight: number,
  maxSize: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;
  
  if (width > height) {
    height = (height * maxSize) / width;
    width = maxSize;
  } else {
    width = (width * maxSize) / height;
    height = maxSize;
  }
  
  return { width, height };
}