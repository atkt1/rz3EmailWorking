import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { SurveyData } from '../types/survey';

async function fetchSurveyData(shortCode: string): Promise<SurveyData> {
  try {
    // First try to get survey with products using the RPC function
    const { data, error } = await supabase
      .from('surveys')
      .select(`
        id,
        survey_name,
        survey_style,
        logo_path,
        survey_status,
        minimum_review_length,
        minimum_star_rating,
        time_delay,
        user_id,
        survey_products (
          product:products (
            id,
            name,
            image_path,
            thumbnail_path,
            marketplace,
            marketplace_product_id
          )
        )
      `)
      .eq('short_code', shortCode)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Survey not found');

    // Transform the data to match SurveyData interface
    const surveyData: SurveyData = {
      id: data.id,
      survey_name: data.survey_name,
      survey_style: data.survey_style,
      logo_path: data.logo_path,
      survey_status: data.survey_status,
      minimum_review_length: data.minimum_review_length,
      minimum_star_rating: data.minimum_star_rating,
      time_delay: data.time_delay,
      user_id: data.user_id,
      products: data.survey_products
        .map(sp => sp.product)
        .filter(Boolean) // Remove any null values
    };

    return surveyData;
  } catch (error) {
    console.error('Error fetching survey:', error);
    throw error;
  }
}

export function useSurveyData(shortCode: string | undefined) {
  return useQuery({
    queryKey: ['survey', shortCode],
    queryFn: () => fetchSurveyData(shortCode!),
    enabled: !!shortCode,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}