import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FeatureCard({ icon: Icon, title, description, className, style }: FeatureCardProps) {
  return (
    <div 
      className={cn(
        "group relative p-8 rounded-2xl",
        "bg-white transition-all duration-300",
        "border border-gray-100 shadow-sm hover:shadow-xl",
        "hover:-translate-y-2",
        "opacity-0 animate-fade-in",
        className
      )}
      style={style}
    >
      <div className="relative z-10">
        <div className="mb-6 inline-block">
          <div className="rounded-2xl bg-blue-50 group-hover:bg-blue-100 p-3 transition-colors duration-300">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}