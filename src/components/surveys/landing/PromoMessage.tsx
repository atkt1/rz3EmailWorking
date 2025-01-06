export function PromoMessage() {
  return (
    <div className="mb-8 text-center">
      <div className="bg-blue-50 rounded-lg p-4 mb-2">
        <p className="text-lg font-semibold text-blue-900">
          Current customers get a FREE Gift*
        </p>
        <p className="text-blue-700">
          No Credit Card - No Shipping - 100% FREE!
        </p>
      </div>
      
      <p className="text-xs text-gray-500 italic">
        *Limit one giveaway per valid order. Only valid for full priced purchases. 
        Proof of purchase from authorized retailer may be required. 
        No additional purchase necessary. Offer valid in INDIA only; void where prohibited. 
        Subject to availability, change, or cancellation.
      </p>
    </div>
  );
}