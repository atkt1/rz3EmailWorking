import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { signupSchema, type SignUpFormData } from '@/lib/auth/validation';
import { Button } from '../ui/button';
import { FormInput } from './ui/form-input';
import { FormError } from './ui/form-error';

interface SignUpFormProps {
  onToggleView: () => void;
}

export function SignUpForm({ onToggleView }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      if (error) throw error;
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="text-sm text-gray-600">Join ReviewZone today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          {...register('username')}
          label="Username"
          type="text"
          placeholder="johndoe"
          error={errors.username?.message}
        />

        <FormInput
          {...register('email')}
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
        />

        <FormInput
          {...register('password')}
          label="Password"
          type="password"
          error={errors.password?.message}
        />

        {error && <FormError message={error} />}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>

      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">Already have an account?</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleView}
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          Log in
        </button>
      </div>
    </div>
  );
}