import { z } from 'zod';

// Survey schemas
export const surveySchema = z.object({
  survey_name: z.string().min(1, 'Survey name is required'),
  survey_style: z.string().min(1, 'Survey type is required'),
  minimum_review_length: z.string().min(1, 'Minimum review length is required'),
  minimum_star_rating: z.string().min(1, 'Minimum star rating is required'),
  time_delay: z.string().min(1, 'Time delay is required'),
  logo: z.instanceof(File)
    .refine((file) => file.size <= 750 * 1024, 'Logo must be less than 750KB')
    .nullable()
    .optional(),
  logoUrl: z.string().optional(),
  product_ids: z.array(z.string()).min(1, 'At least one product must be selected'),
});

export const customerDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  marketingConsent: z.boolean().optional()
});

// Type definitions
export type SurveyFormData = z.infer<typeof surveySchema>;
export type CustomerDetailsData = z.infer<typeof customerDetailsSchema>;

export interface Survey {
  id: string;
  survey_name: string;
  survey_style: string;
  minimum_review_length: string;
  minimum_star_rating: string;
  time_delay: string;
  logo_path: string;
  created_at: string;
  survey_status: 'ACTIVE' | 'PAUSED';
  url: string;
  qr_code: string;
  user_id: string;
}

export interface SurveyResponse {
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  review: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SurveyData {
  id: string;
  survey_name: string;
  survey_style: 'Simple' | 'WithInfo';
  logo_path: string;
  survey_status: 'ACTIVE' | 'PAUSED';
  minimum_review_length?: string;
  minimum_star_rating?: string;
  time_delay: string;
  user_id: string;
  products: Array<{
    id: string;
    name: string;
    image_path: string;
    thumbnail_path: string;
    marketplace: string;
    marketplace_product_id: string;
  }>;
}