import { cn } from '@/lib/utils';

interface SurveyHeaderProps {
  logo: string;
}

export function SurveyHeader({ logo }: SurveyHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-center">
        <img 
          src={logo} 
          alt="Survey Logo"
          className={cn(
            "h-[3.45rem] w-auto object-contain", // 15% increase from original 3rem (48px)
            "transition-transform duration-300",
            "transform hover:scale-105"
          )}
        />
      </div>
    </div>
  );
}