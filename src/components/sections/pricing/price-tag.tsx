interface PriceTagProps {
  price: number;
  period?: string;
}

export function PriceTag({ price, period = "/month" }: PriceTagProps) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold">${price}</span>
      <span className="text-gray-600">{period}</span>
    </div>
  );
}