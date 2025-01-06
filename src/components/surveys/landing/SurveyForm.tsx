import { useState } from 'react';
import { ProductSelect } from './ProductSelect';
import { OrderInput } from './OrderInput';
import { ReviewInput } from '../review/ReviewInput';
import { ShareReview } from '../review/ShareReview';
import { CustomerDetails } from '../review/CustomerDetails';
import { PromoMessage } from './PromoMessage';
import { SurveyHeader } from './SurveyHeader';
import { BackgroundAnimation } from './BackgroundAnimation';
import { cn } from '@/lib/utils';
import type { CustomerDetailsData } from '@/lib/types/survey';
import { submitReview } from '@/lib/services/reviewService';
import { EmailService } from '@/lib/services/emailService';


interface SurveyFormProps {
  survey: {
    id: string;
    survey_name: string;
    survey_style: 'Simple' | 'WithInfo';
    logo_path: string;
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
  };
}

type Step = 'product' | 'order' | 'review' | 'share' | 'details' | 'thanks';

const DEFAULT_MIN_RATING = 1;
const DEFAULT_MIN_REVIEW_LENGTH = 10;

export function SurveyForm({ survey }: SurveyFormProps) {
  const [step, setStep] = useState<Step>('product');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  const selectedProductData = selectedProduct 
    ? survey.products.find(p => p.id === selectedProduct)
    : null;

  // Safely parse minimum values with defaults
  const minRating = survey.minimum_star_rating 
    ? parseInt(survey.minimum_star_rating?.split(' ')[0]) || DEFAULT_MIN_RATING
    : DEFAULT_MIN_RATING;

  const minReviewLength = survey.minimum_review_length
    ? parseInt(survey.minimum_review_length?.split(' ')[0]) || DEFAULT_MIN_REVIEW_LENGTH
    : DEFAULT_MIN_REVIEW_LENGTH;

  const handleProductSelect = (productId: string) => {
    if (!productId) return;
  setSelectedProduct(productId);
  setStep('order');
  };

  const handleValidOrder = (validOrderId: string) => {
    if (!validOrderId) return;
  setOrderId(validOrderId);
  setStep('review');
  };

  const handleReviewSubmit = (newRating: number, newReview: string) => {
    setRating(newRating);
    setReview(newReview);
    
    if (newRating >= minRating) {
      setStep('share');
    } else {
      setStep('details');
    }
  };

const handleCustomerDetails = async (data: CustomerDetailsData) => {
  if (!selectedProduct || !survey.user_id) return;

  try {
    // Submit review and get the result
    const reviewResult = await submitReview(survey.id, {
      userId: survey.user_id,
      productId: selectedProduct,
      orderId,
      rating,
      review,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      marketingConsent: data.marketingConsent
    });

    // If review was created successfully, show thank you page immediately
    if (reviewResult.success) {
      setStep('thanks');
      
      // Create email record after a delay
      setTimeout(async () => {
        try {
          await EmailService.createEmailRecord({
            userId: survey.user_id,
            productId: selectedProduct,
            surveyId: survey.id,
            reviewId: reviewResult.reviewId
          });

          // Add another delay before triggering email
          setTimeout(async () => {
            try {
              await EmailService.triggerEmail(reviewResult.reviewId);
            } catch (error) {
              console.error('Error triggering email:', error);
            }
          }, 2000); // 2 minute delay before triggering email
          
        } catch (error) {
          console.error('Error creating email record:', error);
        }
      }, 800); // 5 second delay before creating email record
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    // Handle error appropriately
  }
};


  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero relative overflow-hidden">
      <BackgroundAnimation />
      <SurveyHeader logo={survey.logo_path} />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className={cn(
          "bg-white/95 backdrop-blur-sm rounded-xl",
          "border border-gray-200",
          "shadow-[0_4px_6px_rgba(0,0,0,0.1)]",
          "p-6 sm:p-8 max-w-md w-full",
          "transform transition-all duration-300"
        )}>
          {step === 'product' && (
            <ProductSelect
              products={survey.products}
              selectedProduct={selectedProduct}
              onSelect={handleProductSelect}
              surveyStyle={survey.survey_style}
            />
          )}

          {step === 'order' && selectedProductData && (
            <OrderInput 
              product={selectedProductData}
              marketplace={selectedProductData.marketplace}
              userId={survey.user_id}
              onValidOrder={handleValidOrder}
              onBack={() => setStep('product')}
            />
          )}

          {step === 'review' && selectedProductData && (
            <ReviewInput
              productName={selectedProductData.name}
              minRating={minRating}
              minReviewLength={minReviewLength}
              onSubmit={handleReviewSubmit}
              onBack={() => setStep('order')}
            />
          )}

          {step === 'share' && (
            <ShareReview
              review={review}
              marketplaceProductId={selectedProductData.marketplace_product_id}
              timeDelay={survey.time_delay}
              onBack={() => setStep('review')}
              onNext={() => setStep('details')}
            />
          )}

          {step === 'details' && (
            <CustomerDetails
              onSubmit={handleCustomerDetails}
              onBack={() => step === 'share' ? setStep('share') : setStep('review')}
            />
          )}

          {step === 'thanks' && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
              <p className="text-gray-600">
                We appreciate your feedback.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}