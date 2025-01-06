import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Logo {
  name: string;
  url: string;
}

interface LogoSelectorProps {
  onSelect: (url: string) => void;
  disabled?: boolean;
  error?: string;
}

export function LogoSelector({ onSelect, disabled, error }: LogoSelectorProps) {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchLogos() {
      if (!user) return;

      try {
        const { data, error } = await supabase.storage
          .from('logos')
          .list(user.id);

        if (error) throw error;

        const logoList = await Promise.all(
          data.map(async (file) => {
            const { data: { publicUrl } } = supabase.storage
              .from('logos')
              .getPublicUrl(`${user.id}/${file.name}`);

            return {
              name: file.name,
              url: publicUrl
            };
          })
        );

        setLogos(logoList);
      } catch (err) {
        console.error('Error fetching logos:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogos();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (logo: Logo) => {
    setSelectedLogo(logo);
    onSelect(logo.url);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-10 flex items-center">
        <span className={cn(
          "text-sm",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>Loading logos...</span>
      </div>
    );
  }

  if (logos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      <label className={cn(
        "block text-sm font-medium",
        isDark ? "text-gray-200" : "text-gray-700"
      )}>
        Or select existing logo
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2.5 flex items-center justify-between",
            "rounded-lg border",
            "transition-colors duration-200",
            isDark ? [
              "bg-gray-900 border-gray-700",
              "text-white",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            ] : [
              "bg-white border-gray-300",
              "text-gray-900",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            ],
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && (isDark ? "border-red-500/50" : "border-red-300")
          )}
        >
          <div className="flex items-center gap-3">
            {selectedLogo ? (
              <>
                <img 
                  src={selectedLogo.url} 
                  alt="Selected logo"
                  className="w-8 h-8 object-contain"
                />
                <span>Selected logo</span>
              </>
            ) : (
              <span>Select a logo</span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "transform rotate-180"
          )} />
        </button>

        {isOpen && (
          <div className={cn(
            "absolute z-50 w-full mt-1",
            "rounded-lg border shadow-lg",
            "max-h-60 overflow-auto",
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            {logos.map((logo) => (
              <button
                key={logo.url}
                type="button"
                onClick={() => handleSelect(logo)}
                className={cn(
                  "w-full px-4 py-2 flex items-center gap-3",
                  "transition-colors duration-200",
                  isDark ? [
                    "hover:bg-gray-700",
                    selectedLogo?.url === logo.url && "bg-gray-700"
                  ] : [
                    "hover:bg-gray-50",
                    selectedLogo?.url === logo.url && "bg-gray-50"
                  ]
                )}
              >
                <img 
                  src={logo.url} 
                  alt={`Logo ${logo.name}`}
                  className="w-8 h-8 object-contain"
                />
                <span className={isDark ? "text-white" : "text-gray-900"}>
                  Logo {logos.indexOf(logo) + 1}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}