import { cn } from '@/lib/utils';
import { BackgroundAnimation } from './BackgroundAnimation';

interface SurveyPausedProps {
  logo: string;
}

export function SurveyPaused({ logo }: SurveyPausedProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero relative overflow-hidden">
      <BackgroundAnimation />
      
      {/* Logo Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <img 
            src={logo} 
            alt="Survey Logo"
            className={cn(
              "h-[3.45rem] w-auto object-contain mx-auto",
              "transition-transform duration-300",
              "transform hover:scale-105"
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className={cn(
          "bg-white/95 backdrop-blur-sm rounded-xl",
          "border border-gray-200",
          "shadow-[0_4px_6px_rgba(0,0,0,0.1)]",
          "p-6 sm:p-8 max-w-md w-full",
          "transform transition-all duration-300"
        )}>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              This survey is currently paused
            </h1>
            <p className="text-gray-600">
              Please come back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
