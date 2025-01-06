import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  marketplace: z.string().min(1, 'Marketplace is required'),
  marketplace_product_id: z.string().min(1, 'Marketplace Product ID is required'),
  giveaway: z.string().min(1, 'Giveaway amount is required'),
  image: z.instanceof(File).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  name: string;
  marketplace: string;
  marketplace_product_id: string;
  giveaway: string;
  image_path: string;
  thumbnail_path: string;
  created_at: string;
  user_id: string;
}