import { supabase } from '../supabase';
import { optimizeImage } from '../utils/image';
import QRCode from 'qrcode';
import type { Survey, SurveyFormData } from '../types/survey';

export async function getSurveys(userId: string): Promise<Survey[]> {
  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createSurvey(data: SurveyFormData, userId: string) {
  try {
    let logoPath = data.logoUrl || null;

    // Upload new logo if provided
    if (data.logo) {
      const optimizedLogo = await optimizeImage(data.logo, 750 * 1024);
      const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(`${userId}/${filename}`, optimizedLogo);

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(uploadData.path);
      
      logoPath = publicUrl;
    }

    // Generate short code and URL
    const { data: shortCode, error: shortCodeError } = await supabase
      .rpc('generate_short_code');

    if (shortCodeError) throw shortCodeError;

    const surveyUrl = `https://reviewzone.ai/survey/${shortCode}`;
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(surveyUrl, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: 'H'
    });

    // Create survey record
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .insert({
        survey_name: data.survey_name,
        survey_style: data.survey_style,
        minimum_review_length: data.minimum_review_length,
        minimum_star_rating: data.minimum_star_rating,
        time_delay: data.time_delay,
        logo_path: logoPath,
        user_id: userId,
        short_code: shortCode,
        url: surveyUrl,
        qr_code: qrCodeDataUrl,
        survey_status: 'ACTIVE'
      })
      .select()
      .single();

    if (surveyError) throw surveyError;

    // Create product associations
    const surveyProducts = data.product_ids.map(productId => ({
      survey_id: survey.id,
      product_id: productId
    }));

    const { error: productError } = await supabase
      .from('survey_products')
      .insert(surveyProducts);

    if (productError) throw productError;

    return survey;
  } catch (error) {
    console.error('Error creating survey:', error);
    throw error;
  }
}

export async function updateSurvey(surveyId: string, data: SurveyFormData, userId: string) {
  try {
    let logoPath = data.logoUrl || null;

    // Upload new logo if provided
    if (data.logo) {
      const optimizedLogo = await optimizeImage(data.logo, 750 * 1024);
      const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(`${userId}/${filename}`, optimizedLogo);

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(uploadData.path);
      
      logoPath = publicUrl;
    }

    // Update survey record
    const { error: surveyError } = await supabase
      .from('surveys')
      .update({
        survey_name: data.survey_name,
        survey_style: data.survey_style,
        minimum_review_length: data.minimum_review_length,
        minimum_star_rating: data.minimum_star_rating,
        time_delay: data.time_delay,
        logo_path: logoPath
      })
      .eq('id', surveyId)
      .eq('user_id', userId);

    if (surveyError) throw surveyError;

    // Update product associations
    const { error: deleteError } = await supabase
      .from('survey_products')
      .delete()
      .eq('survey_id', surveyId);

    if (deleteError) throw deleteError;

    const surveyProducts = data.product_ids.map(productId => ({
      survey_id: surveyId,
      product_id: productId
    }));

    const { error: insertError } = await supabase
      .from('survey_products')
      .insert(surveyProducts);

    if (insertError) throw insertError;

    return { success: true };
  } catch (error) {
    console.error('Error updating survey:', error);
    throw error;
  }
}

export async function deleteSurvey(surveyId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', surveyId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting survey:', error);
    throw error;
  }
}

export async function toggleSurveyStatus(
  surveyId: string, 
  userId: string,
  currentStatus: 'ACTIVE' | 'PAUSED'
): Promise<'ACTIVE' | 'PAUSED'> {
  try {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    const { error } = await supabase
      .from('surveys')
      .update({ survey_status: newStatus })
      .eq('id', surveyId)
      .eq('user_id', userId);

    if (error) throw error;

    return newStatus;
  } catch (error) {
    console.error('Error toggling survey status:', error);
    throw error;
  }
}