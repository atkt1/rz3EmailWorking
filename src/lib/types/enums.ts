import { z } from 'zod';

export const enumSchema = z.object({
  marketplace: z.array(z.string()),
  plan_name: z.array(z.string()),
  subscription_status: z.array(z.string()),
  survey_status: z.array(z.string()),
  survey_style: z.array(z.string()),
  voucher_status: z.array(z.string()),
  giveaway: z.array(z.string()),
  package_insert_style_size: z.array(z.string()),
  frequency: z.array(z.string()),
  boolean_enum: z.array(z.string()),
  time_delay: z.array(z.string()),
  minimum_review_length: z.array(z.string()),
  minimum_star_rating: z.array(z.string())
});

export type EnumCache = z.infer<typeof enumSchema>;

export const ENUM_CACHE_VERSION = '1.0';
export const ENUM_CACHE_KEY = 'app_enums';
export const ENUM_VERSION_KEY = 'app_enums_version';
export const ENUM_CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours