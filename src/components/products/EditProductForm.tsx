import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { useEnumStore } from '@/lib/stores/enumStore';
import { productSchema, type Product, type ProductFormData } from '@/lib/types/product';
import { updateProduct } from '@/lib/services/productService';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { EditImageUpload } from './EditImageUpload';
import { useFilteredGiveaways } from '@/lib/hooks/useFilteredGiveaways';


interface EditProductFormProps {
  product: Product;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const enums = useEnumStore((state) => state.enums);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      marketplace: product.marketplace,
      marketplace_product_id: product.marketplace_product_id,
      giveaway: product.giveaway
    }
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ProductFormData) => {
    if (!user) return;
    
    try {
      setError(null);
      setIsSubmitting(true);
      await updateProduct(product.id, data, user.id);
      navigate('/dashboard/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: filteredGiveaways, isLoading: isLoadingGiveaways } = useFilteredGiveaways();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <FormInput
        label="Product Name"
        {...register('name')}
        error={errors.name?.message}
        placeholder="Enter product name"
      />

      <FormSelect
        label="Marketplace"
        {...register('marketplace')}
        error={errors.marketplace?.message}
        options={enums?.marketplace || []}
        placeholder="Select marketplace"
      />

      <FormInput
        label="Marketplace Product ID"
        {...register('marketplace_product_id')}
        error={errors.marketplace_product_id?.message}
        placeholder="Enter marketplace product ID"
      />

      <EditImageUpload
        currentImage={product.image_path}
        currentThumbnail={product.thumbnail_path}
        onImageSelect={(file) => setValue('image', file)}
        error={errors.image?.message}
      />

      <FormSelect
        label="Giveaway Amount"
        {...register('giveaway')}
        error={errors.giveaway?.message}
        options={filteredGiveaways || []}
        placeholder="Select giveaway amount"
        isLoading={isLoadingGiveaways}
      />

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/dashboard/products')}
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