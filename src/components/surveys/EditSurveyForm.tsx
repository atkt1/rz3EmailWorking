import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { useEnumStore } from '@/lib/stores/enumStore';
import { surveySchema, type SurveyFormData, type Survey } from '@/lib/types/survey';
import { updateSurvey } from '@/lib/services/surveyService';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { LogoUpload } from './LogoUpload';
import { LogoSelector } from './LogoSelector';
import { ProductGrid } from './ProductGrid';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/services/productService';
import { supabase } from '@/lib/supabase';

interface EditSurveyFormProps {
  survey: Survey;
}

export function EditSurveyForm({ survey }: EditSurveyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLogoUrl, setSelectedLogoUrl] = useState<string>(survey.logo_path);
  const [isNewLogoSelected, setIsNewLogoSelected] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const enums = useEnumStore((state) => state.enums);

  // Fetch products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: () => user ? getProducts(user.id) : Promise.resolve([]),
    enabled: !!user
  });

  // Fetch survey's associated products
  useEffect(() => {
    async function fetchSurveyProducts() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('survey_products')
          .select('product_id')
          .eq('survey_id', survey.id);

        if (error) throw error;

        const productIds = data.map(item => item.product_id);
        setSelectedProductIds(productIds);
        setValue('product_ids', productIds);
      } catch (err) {
        console.error('Error fetching survey products:', err);
      }
    }

    fetchSurveyProducts();
  }, [survey.id, user]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      survey_name: survey.survey_name,
      survey_style: survey.survey_style,
      minimum_review_length: survey.minimum_review_length,
      minimum_star_rating: survey.minimum_star_rating,
      time_delay: survey.time_delay,
      product_ids: []
    }
  });

  const onSubmit = async (data: SurveyFormData) => {
    if (!user) return;

    clearErrors('logo');

    if (!data.logo && !selectedLogoUrl) {
      setError('logo', { 
        type: 'manual', 
        message: 'Please either upload a new logo or select an existing one' 
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateSurvey(survey.id, {
        ...data,
        logoUrl: selectedLogoUrl,
        logo: selectedLogoUrl === survey.logo_path ? undefined : data.logo
      }, user.id);
      navigate('/dashboard/surveys');
    } catch (err) {
      console.error('Error updating survey:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (file: File | null) => {
    setValue('logo', file);
    clearErrors('logo');
    setIsNewLogoSelected(!!file);
    if (file) {
      setSelectedLogoUrl('');
    }
  };

  const handleExistingLogoSelect = (url: string) => {
    setSelectedLogoUrl(url);
    setValue('logo', null);
    clearErrors('logo');
    setIsNewLogoSelected(false);
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
        currentLogo={survey.logo_path}
        error={errors.logo?.message}
      />

      <LogoSelector
        onSelect={handleExistingLogoSelect}
        disabled={isNewLogoSelected}
        error={errors.logo?.message}
      />

      <ProductGrid
        products={products}
        selectedIds={selectedProductIds}
        onSelectionChange={(ids) => {
          setSelectedProductIds(ids);
          setValue('product_ids', ids);
        }}
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
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}