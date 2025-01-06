import { useState } from 'react';
import { cn } from '@/lib/utils';
import { validateOrder } from '@/lib/services/orderService';
import { NextButton } from './NextButton';
import { 
  validateAmazonOrder, 
  validateGenericOrder, 
  getOrderFormatText 
} from '@/lib/utils/validation';

interface OrderInputProps {
  product: {
    name: string;
    image_path: string;
  };
  marketplace: string;
  userId: string;
  onValidOrder: (orderId: string) => void;
  onBack: () => void;
}

export function OrderInput({ 
  product, 
  marketplace,
  userId,
  onValidOrder,
  onBack 
}: OrderInputProps) {
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Client-side validation
  const isValidFormat = marketplace === 'Amazon'
    ? validateAmazonOrder(orderId)
    : validateGenericOrder(orderId);

  const handleOrderIdChange = (value: string) => {
    setError(null);
    const trimmedValue = value.slice(0, 25);
    setOrderId(trimmedValue);
  };

// In OrderInput.tsx
const handleNext = async () => {
  if (!orderId.trim() || !userId) {
    return;
  }

  // First check format
  if (!isValidFormat) {
    setError(getOrderFormatText(marketplace));
    return;
  }

  try {
    setIsValidating(true);
    setError(null);
    
    const validation = await validateOrder(orderId.trim(), userId);
    
    if (validation.isValid) {
      onValidOrder(orderId.trim());
    } else {
      setError(validation.message || 'No matching order found, please enter correct order ID');
      setIsValidating(false); // Make sure to set isValidating to false when showing error
      return; // Add return to prevent proceeding
    }
  } catch (err) {
    console.error('Error validating order:', err);
    setError('Failed to validate order. Please try again.');
  } finally {
    setIsValidating(false);
  }
};


  return (
    <div className="space-y-6">

        <h2 className="text-2xl font-bold mb-2 text-center">
          {product.name}
        </h2>
        <div className="flex justify-center">
        <div className="text-center">
          <div className="w-40 h-40 mx-auto bg-gray-50 rounded-lg p-2">
            <img
              src={product.image_path}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';
              }}
            />
          </div>

        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          What is your {marketplace} Order Number for {product.name}?*
        </label>
        
        {marketplace === 'Amazon' && (
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            onClick={() => window.open('https://www.amazon.in/gp/your-account/order-history', '_blank')}
          >
            Find Your Amazon Order Number
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        <input
          type="text"
          value={orderId}
          onChange={(e) => handleOrderIdChange(e.target.value)}
          placeholder={`${marketplace} Order Number`}
          className={cn(
            "block w-full rounded-lg border",
            "focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : isValidFormat
                ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            "bg-white py-2.5 px-4 text-gray-900"
          )}
          disabled={isValidating}
        />
        
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}

        {!error && (
          <p className="text-xs text-gray-500">
            {getOrderFormatText(marketplace)}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        
        <NextButton 
          isEnabled={!!orderId.trim() && isValidFormat && !isValidating} 
          onClick={handleNext}
          isLoading={isValidating}
        />
      </div>
    </div>
  );
}
