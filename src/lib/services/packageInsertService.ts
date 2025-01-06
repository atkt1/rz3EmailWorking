import { supabase } from '../supabase';
import { generateQRCode } from '../utils/qrCode';
import { generatePreviewImage } from '../utils/canvas';
import type { PackageInsert, PackageInsertAssets } from '../types/packageInsert';

export async function savePackageInsert(
  insert: PackageInsert,
  userId: string,
  id?: string
) {
  try {
    const now = new Date().toISOString();
    const data = {
      name: insert.name,
      style_size: insert.style_size,
      survey_id: insert.survey_id,
      include_logo: insert.include_logo,
      background_color: insert.background_color,
      headline: insert.headline,
      subtitle: insert.subtitle,
      brand_url: insert.brand_url,
      user_id: userId,
      updated_at: now
    };

    let result;
    if (id) {
      // Update existing insert
      result = await supabase
        .from('package_inserts')
        .update(data)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      // Create new insert
      result = await supabase
        .from('package_inserts')
        .insert({
          ...data,
          created_at: now
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('Error saving package insert:', error);
    throw error;
  }
}

export async function downloadPackageInsert(insert: PackageInsert): Promise<PackageInsertAssets> {
  try {
    // Get the survey URL for the QR code
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('url')
      .eq('id', insert.survey_id)
      .single();

    if (surveyError) throw surveyError;
    if (!survey?.url) throw new Error('Survey URL not found');

    // Generate QR code
    const qrCode = await generateQRCode(survey.url);

    // Pre-load logo if needed
    if (insert.include_logo && insert.logo_path) {
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.src = insert.logo_path;
      });
    }

    // Generate preview image
    const printImage = await generatePreviewImage(insert, qrCode, true);

    return {
      qrCode,
      printImage
    };
  } catch (error) {
    console.error('Error generating package insert assets:', error);
    throw error;
  }
}