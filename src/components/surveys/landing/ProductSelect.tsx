// src/components/surveys/landing/ProductSelect.tsx

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ProductSelectProps {
  products: Array<{
    id: string;
    name: string;
    image_path: string;
    thumbnail_path: string;
  }>;
  selectedProduct: string | null;
  onSelect: (productId: string) => void;
  surveyStyle: 'Simple' | 'WithInfo';
}

export function ProductSelect({ products, selectedProduct, onSelect, surveyStyle }: ProductSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = products.find(p => p.id === selectedProduct);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Quick Survey - Instant Rewards!
        </h2>
        <p className="text-gray-600">
          Share your experience now!
        </p>
      </div>

      {/* Promo Message - Only for WithInfo style */}
      {surveyStyle === 'WithInfo' && (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-1">
            Get a FREE Gift*
          </h3>
          <p className="text-blue-700">
            No Credit Card - No Shipping - 100% FREE!
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            *Limit one giveaway per valid order. Proof of purchase from authorized 
            retailer may be required. No additional purchase necessary. Subject to 
            availability, change, or cancellation.
          </p>
        </div>
      )}

      {/* Product Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Which product did you purchase?
        </label>
        
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full rounded-lg border border-gray-300",
              "bg-white px-4 py-2.5",
              "flex items-center justify-between",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              "transition-colors duration-200"
            )}
          >
            <div className="flex items-center gap-3">
              {selected && (
                <div className="w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-50">
                  <img
                    src={selected.image_path}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';
                    }}
                  />
                </div>
              )}
              <span className="text-gray-900">
                {selected ? selected.name : 'Select a product...'}
              </span>
            </div>
            <ChevronDown className={cn(
              "w-5 h-5 text-gray-400 transition-transform duration-200",
              isOpen && "transform rotate-180"
            )} />
          </button>

          {isOpen && (
            <div className={cn(
              "absolute z-20 w-full mt-1",
              "bg-white rounded-lg border border-gray-200",
              "shadow-lg max-h-60 overflow-auto"
            )}>
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onSelect(product.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2",
                    "flex items-center gap-3",
                    "hover:bg-gray-50 transition-colors duration-200",
                    selectedProduct === product.id && "bg-gray-50"
                  )}
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded overflow-hidden bg-gray-50">
                    <img
                      src={product.image_path}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';
                      }}
                    />
                  </div>
                  <span className="text-gray-900">{product.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
