// src/components/surveys/review/CustomerDetails.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerDetailsSchema, type CustomerDetailsData } from '@/lib/types/survey';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomerDetailsProps {
  onSubmit: (data: CustomerDetailsData) => void;
  onBack: () => void;
}

export function CustomerDetails({ onSubmit, onBack }: CustomerDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CustomerDetailsData>({
    resolver: zodResolver(customerDetailsSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Please enter your information below
        </h2>
        <p className="text-gray-600">
          Please double-check all information is correct before submitting.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-gray-900">
              First Name
            </label>
            <input
              {...register('firstName')}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-gray-50 border border-gray-300",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                errors.firstName && "border-red-300 focus:border-red-500 focus:ring-red-200"
              )}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-base font-semibold text-gray-900">
              Last Name
            </label>
            <input
              {...register('lastName')}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-gray-50 border border-gray-300",
                "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                errors.lastName && "border-red-300 focus:border-red-500 focus:ring-red-200"
              )}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-base font-semibold text-gray-900">
            Email Address
          </label>
          <input
            type="email"
            {...register('email')}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg",
              "bg-gray-50 border border-gray-300",
              "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
              errors.email && "border-red-300 focus:border-red-500 focus:ring-red-200"
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
        >
          ← Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? 'Submitting...' : 'Next →'}
        </Button>
      </div>
    </form>
  );
}
