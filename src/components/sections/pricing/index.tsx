import { PriceCard } from './price-card';

const plans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for small businesses getting started with review management',
    features: [
      'Up to 20 reviews/month',
      'Review monitoring',
      'Basic reporting',
      'Email support'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Professional',
    price: 79,
    description: 'Ideal for growing businesses that need more advanced features',
    features: [
      'Up to 100 reviews/month',
      'Review monitoring & alerts',
      'Priority support',
      'Custom reporting'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'primary' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 125,
    description: 'For large organizations with custom requirements',
    features: [
      'Up to 250 reviews/month',
      '24/7 dedicated support',
      'Advanced monitoring',
      'Custom reporting'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose the perfect plan for your business needs. No hidden fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="transition-all duration-300 ease-in-out hover:-translate-y-2"
            >
              <PriceCard
                {...plan}
                style={{ animationDelay: `${index * 150}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}