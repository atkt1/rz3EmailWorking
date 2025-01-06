import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  try {


    // Get auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401 }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get review ID from request
    const { reviewId } = await req.json();
    if (!reviewId) {
      throw new Error('Review ID is required');
    }

    console.log('Received request with reviewId:', reviewId);

    // Get review record with products
    const { data: review, error: reviewError } = await supabaseClient
      .from('reviews')
      .select('*, products(*)')
      .eq('id', reviewId)
      .single();

    console.log('Found review:', review);
    
    if (reviewError) throw reviewError;
    if (!review) throw new Error('Review not found');

    // Find available coupon/voucher
    let couponCode = null;
    
    // First check coupons
    const { data: coupon } = await supabaseClient
      .from('coupons')
      .select('*')
      .eq('giveaway', review.products.giveaway)
      .eq('status', 'Available')
      .eq('user_id', review.user_id)
      .limit(1)
      .single();

    if (coupon) {
      couponCode = coupon.coupon_code;
      console.log('Found coupon:', coupon);
    } else {
      // Check vouchers if no coupon found
      const { data: voucher } = await supabaseClient
        .from('vouchers')
        .select('*')
        .eq('giveaway', review.products.giveaway)
        .eq('status', 'Available')
        .limit(1)
        .single();

      if (voucher) {
        couponCode = voucher.coupon_code;
        console.log('Found voucher:', voucher);
      }
    }

    
    if (!couponCode) {
      throw new Error('No available coupon/voucher found');
    }

    // Send email
  try {
  console.log('Attempting to send email to:', review.email_id);
  const emailResult = await resend.emails.send({
    from: 'ReviewZone <noreply@resend.dev>',
    to: review.email_id,
    subject: 'Your Review Reward',
    html: `
      <h1>Thank you for your review!</h1>
      <p>Here's your reward coupon code: ${couponCode}</p>
    `
  });
  console.log('Email sent successfully:', emailResult);
} catch (emailError) {
  console.error('Failed to send email:', emailError);
  throw emailError;
}

    // Update coupon/voucher status
    if (coupon) {
      await supabaseClient
        .from('coupons')
        .update({
          status: 'Consumed',
          review_id: reviewId
        })
        .eq('coupon_code', couponCode);
    } else {
      await supabaseClient
        .from('vouchers')
        .update({
          status: 'Consumed',
          review_id: reviewId,
          user_id: review.user_id
        })
        .eq('coupon_code', couponCode);
    }

    // Update email status
    await supabaseClient
      .from('emails')
      .update({
        status: 'Sent',
        sent_at: new Date().toISOString(),
        coupon_code: couponCode
      })
      .eq('review_id', reviewId);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
         
        }
      }
    );
  } catch (error) {
    console.error('Error processing email:', error);

    // Update email status to Failed if we have the review ID
    if (req.reviewId) {
      await supabaseClient
        .from('emails')
        .update({
          status: 'Failed'
        })
        .eq('review_id', req.reviewId);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        
        }
      }
    );
  }
})
