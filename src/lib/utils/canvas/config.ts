import type { PackageInsert } from '../../types/packageInsert';
import { INSERT_DIMENSIONS } from '../../constants/dimensions';

export const SCALE_FACTOR = 1.5;
export const DEFAULT_FONT_FAMILY = 'system-ui, -apple-system, sans-serif';

export interface DrawConfig {
  width: number;
  height: number;
  scale: number;
  padding: {
    x: number;
    y: number;
  };
  contentWidth: number;
  qrSize: number;
}

export function getDrawConfig(insert: PackageInsert): DrawConfig {
  const dimensions = INSERT_DIMENSIONS[insert.style_size];
  const scale = SCALE_FACTOR;
  const baseWidth = dimensions.width * scale;
  const baseHeight = dimensions.height * scale;
  const basePadding = 24 * scale;

  const qrSize = Math.min(baseWidth, baseHeight) * 0.35;
  const contentWidth = baseWidth - (basePadding * 2) - qrSize - (basePadding * 2);

  return {
    width: baseWidth,
    height: baseHeight,
    scale,
    padding: {
      x: basePadding,
      y: basePadding
    },
    contentWidth,
    qrSize
  };
}