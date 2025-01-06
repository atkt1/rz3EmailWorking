import { Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from './login-form';
import { SignUpForm } from './signup-form';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero section background */}
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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-6 animate-fade-in-up">
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Star className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              ReviewZone
            </span>
          </Link>
        </div>

        {/* Auth Form Container */}
        <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="rounded-2xl bg-white/95 backdrop-blur-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
            {mode === 'login' ? (
              <LoginForm onToggleView={() => navigate('/signup')} />
            ) : (
              <SignUpForm onToggleView={() => navigate('/login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}