import { z } from 'zod';

export interface Review {
  id: string;
  survey_id: string;
  survey_name: string;
  rating: number;
  review: string;
  order_id: string;
  email_id: string;
  created_at: string;
}

export const reviewFilterSchema = z.object({
  dateRange: z.enum(['10days', '1month', '3months', 'all']),
  searchQuery: z.string().optional(),
  searchField: z.enum(['order_id', 'email_id', 'survey_name']).optional(),
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(50).default(10)
});

export type ReviewFilter = z.infer<typeof reviewFilterSchema>;