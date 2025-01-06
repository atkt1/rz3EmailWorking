import { Button } from '../ui/button';
import { Play } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Background shapes with animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 animate-float-slow" />
        <div className="absolute top-60 -left-20 w-60 h-60 bg-cyan-100 rounded-full opacity-30 animate-float" />
        <div className="absolute top-20 right-1/4 w-40 h-40 bg-pink-100 rounded-full opacity-30 animate-float-slow" />
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-purple-100 rounded-full opacity-30 animate-float" />
        <div className="absolute -bottom-20 left-1/3 w-56 h-56 bg-yellow-100 rounded-full opacity-30 animate-float-slow" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-tight">
          Transform Your Customer Reviews<br />Into Business Growth
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Streamline your review collection process, boost your online presence, and
          turn satisfied customers into brand advocates with our AI-powered platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button size="lg" className="min-w-[160px] font-medium">Start Free Trial</Button>
          <Button variant="outline" size="lg" className="gap-2 min-w-[160px] font-medium">
            <Play className="w-4 h-4" /> Watch Demo
          </Button>
        </div>
        <div className="flex items-center justify-center gap-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">2,000+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">4.9/5</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}