import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { useEnumStore } from '@/lib/stores/enumStore';
import { surveySchema, type SurveyFormData } from '@/lib/types/survey';
import { createSurvey } from '@/lib/services/surveyService';
import { getProducts } from '@/lib/services/productService';
import { LogoUpload } from './LogoUpload';
import { LogoSelector } from './LogoSelector';
import { ProductGrid } from './ProductGrid';
import { FormSelect } from '../ui/form-select';
import { FormInput } from '../ui/form-input';
import { Button } from '../ui/button';
import { useQuery } from '@tanstack/react-query';

export function CreateSurveyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLogoUrl, setSelectedLogoUrl] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const enums = useEnumStore((state) => state.enums);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: () => user ? getProducts(user.id) : Promise.resolve([]),
    enabled: !!user,
    staleTime: 0,
    cacheTime: 0
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema)
  });

  const selectedProductIds = watch('product_ids') || [];
  const logoFile = watch('logo');

  const onSubmit = async (data: SurveyFormData) => {
    if (!user) return;

    clearErrors('logo');
    
    // Validate logo selection
    if (!logoFile && !selectedLogoUrl) {
      setError('logo', { 
        type: 'manual', 
        message: 'Please either upload a new logo or select an existing one' 
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createSurvey({
        ...data,
        logoUrl: selectedLogoUrl,
        logo: selectedLogoUrl ? undefined : logoFile
      }, user.id);
      navigate('/dashboard/surveys');
    } catch (err) {
      console.error('Error creating survey:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (file: File | null) => {
    setValue('logo', file);
    clearErrors('logo');
    if (file) {
      setSelectedLogoUrl('');
    }
  };

  const handleExistingLogoSelect = (url: string) => {
    setSelectedLogoUrl(url);
    setValue('logo', null);
    clearErrors('logo');
  };

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form fields */}
      <FormInput
        label="Survey Name"
        {...register('survey_name')}
        error={errors.survey_name?.message}
        placeholder="Enter survey name"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Survey Type"
          {...register('survey_style')}
          error={errors.survey_style?.message}
          options={enums?.survey_style || []}
          placeholder="Select survey type"
        />

        <FormSelect
          label="Minimum Review Length"
          {...register('minimum_review_length')}
          error={errors.minimum_review_length?.message}
          options={enums?.minimum_review_length || []}
          placeholder="Select minimum length"
        />

        <FormSelect
          label="Minimum Star Rating"
          {...register('minimum_star_rating')}
          error={errors.minimum_star_rating?.message}
          options={enums?.minimum_star_rating || []}
          placeholder="Select minimum rating"
        />

        <FormSelect
          label="Time Delay before Giveaway"
          {...register('time_delay')}
          error={errors.time_delay?.message}
          options={enums?.time_delay || []}
          placeholder="Select time delay"
        />
      </div>

      <LogoUpload
        onImageSelect={handleLogoChange}
        onExistingLogoSelect={handleExistingLogoSelect}
        error={errors.logo?.message}
      />

      <LogoSelector
        onSelect={handleExistingLogoSelect}
        disabled={!!logoFile}
        error={errors.logo?.message}
      />

      <ProductGrid
        products={products}
        selectedIds={selectedProductIds}
        onSelectionChange={(ids) => setValue('product_ids', ids)}
        error={errors.product_ids?.message}
      />

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/dashboard/surveys')}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? 'Creating Survey...' : 'Create Survey'}
        </Button>
      </div>
    </form>
  );
}