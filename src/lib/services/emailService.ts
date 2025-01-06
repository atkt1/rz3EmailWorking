import { supabase } from '../supabase';

export class EmailService {
  static async createEmailRecord(data: {
    userId: string;
    productId: string;
    surveyId: string;
    reviewId: string;
  }) {
    try {
      const { data: email, error } = await supabase
        .from('emails')
        .insert({
          user_id: data.userId,
          product_id: data.productId,
          survey_id: data.surveyId,
          review_id: data.reviewId,
          status: 'Pending'
        })
        .select()
        .single();

      if (error) throw error;
      return email;
    } catch (error) {
      console.error('Error creating email record:', error);
      throw error;
    }
  }

// src/lib/services/emailService.ts

static async triggerEmail(reviewId: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Update the URL to include the region prefix
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emailTrigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, Origin, X-Requested-With, Accept'
      },
      body: JSON.stringify({ reviewId })
    });

    const responseText = await response.text();
    console.log('Response:', response.status, responseText);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to trigger email processing');
    }

    return true;
  } catch (error) {
    console.error('Error triggering email:', error);
    throw error;
  }
}

}
