import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PriceTag } from './price-tag';
import { FeatureItem } from './feature-item';

interface PriceCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: 'primary' | 'outline';
  style?: React.CSSProperties;
}

export function PriceCard({
  name,
  price,
  description,
  features,
  popular,
  buttonText,
  buttonVariant = 'outline',
  style
}: PriceCardProps) {
  return (
    <div 
      className={cn(
        "group relative rounded-2xl p-8",
        "bg-white transition-all duration-300",
        "border shadow-sm hover:shadow-xl",
        popular ? "border-blue-500 shadow-lg scale-105" : "border-gray-200 hover:border-blue-200",
        "opacity-0 animate-fade-in"
      )}
      style={style}
    >
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <PriceTag price={price} />
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <FeatureItem key={index}>{feature}</FeatureItem>
        ))}
      </ul>

      <Button 
        variant={buttonVariant} 
        className={cn(
          "w-full font-medium",
          popular && buttonVariant === 'primary' && "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        )}
      >
        {buttonText}
      </Button>
    </div>
  );
}