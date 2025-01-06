import { Star, BarChart3, Shield, Users, Zap, Globe } from 'lucide-react';
import { FeatureCard } from './feature-card';

const features = [
  {
    icon: Star,
    title: 'Review Management',
    description: 'Collect and manage customer reviews across multiple platforms in one centralized dashboard.'
  },
  {
    icon: BarChart3,
    title: 'AI Analytics',
    description: 'Get detailed insights and predictive analytics about your customer feedback trends.'
  },
  {
    icon: Shield,
    title: 'Brand Protection',
    description: 'Proactively manage your online reputation and address customer concerns in real-time.'
  },
  {
    icon: Users,
    title: 'Customer Engagement',
    description: 'Build stronger relationships with automated response templates and engagement tools.'
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    description: 'Automate review collection and response workflows with AI-powered tools.'
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Connect with all major review platforms and manage everything in one place.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Everything you need to manage reviews
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Powerful features to help you collect, analyze, and leverage customer reviews to grow your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}