import { z } from 'zod';

// Match exact database enum values
export const packageInsertSchema = z.object({
  name: z.string().min(1, 'Nickname is required').max(50),
  style_size: z.enum([
    'Basic (3.5" X 8.5")',
    'Basic (4" X 6")',
    'Standard (3.5" X 8.5")',  // Note: This matches the DB enum spelling
    'Standard (4" X 6")'       // Note: This matches the DB enum spelling
  ]),
  survey_id: z.string().min(1, 'Survey is required'),
  include_logo: z.boolean().default(true),
  background_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
  headline: z.string().max(50, 'Headline must be less than 50 characters'),
  subtitle: z.string().max(100, 'Subtitle must be less than 100 characters'),
  brand_url: z.string().max(100, 'URL must be less than 100 characters')
});

export type PackageInsert = z.infer<typeof packageInsertSchema>;

export interface PackageInsertAssets {
  qrCode: string;
  printImage: string;
}

export const DEFAULT_INSERT: PackageInsert = {
  name: '',
  style_size: 'Basic (4" X 6")',
  survey_id: '',
  include_logo: true,
  background_color: '#f0f9ff',
  headline: 'Thanks for your purchase.',
  subtitle: 'Scan and Claim your assured gift',
  brand_url: ''
};