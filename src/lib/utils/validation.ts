// Order number validation rules
export function validateAmazonOrder(orderId: string): boolean {
  const amazonPattern = /^\d{3}-\d{7}-\d{7}$/;
  return amazonPattern.test(orderId);
}

export function validateGenericOrder(orderId: string): boolean {
  const minLength = 3;
  const maxLength = 25;
  const genericPattern = /^[a-zA-Z0-9]+$/;
  
  return (
    orderId.length >= minLength &&
    orderId.length <= maxLength &&
    genericPattern.test(orderId)
  );
}

export function getOrderFormatText(marketplace: string): string {
  return marketplace === 'Amazon' 
    ? 'Format: 123-1234567-1234567'
    : 'Format: A234';
}