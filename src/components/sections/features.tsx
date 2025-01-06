import { Star, BarChart3, Shield, Users, Zap, Globe } from 'lucide-react';

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
    <section className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need to manage reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful features to help you collect, analyze, and leverage customer reviews to grow your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}