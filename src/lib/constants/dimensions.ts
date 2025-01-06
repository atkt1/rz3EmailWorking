// Package insert dimensions in pixels
export const INSERT_DIMENSIONS = {
  'Basic (3.5" X 8.5")': { width: 480, height: 200 },
  'Basic (4" X 6")': { width: 360, height: 240 },
  'Standard (3.5" X 8.5")': { width: 480, height: 200 },
  'Standard (4" X 6")': { width: 360, height: 240 }
} as const;

export type StyleSize = keyof typeof INSERT_DIMENSIONS;