import { Check } from 'lucide-react';

interface FeatureItemProps {
  children: React.ReactNode;
}

export function FeatureItem({ children }: FeatureItemProps) {
  return (
    <li className="flex items-center gap-3">
      <div className="rounded-full p-1 bg-blue-100">
        <Check className="w-4 h-4 text-blue-600" />
      </div>
      <span className="text-gray-600">{children}</span>
    </li>
  );
}