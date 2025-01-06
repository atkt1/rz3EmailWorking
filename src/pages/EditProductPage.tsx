import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { EditProductForm } from '@/components/products/EditProductForm';
import type { Product } from '@/lib/types/product';
import { supabase } from '@/lib/supabase';

export function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function loadProduct() {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Product not found');

        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        navigate('/dashboard/products');
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-600">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn(
          "text-2xl font-bold mb-2",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Edit Product
        </h1>
        <p className={cn(
          "text-base",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>
          Update your product details and settings.
        </p>
      </div>

      <div className={cn(
        "rounded-xl p-6 border",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <EditProductForm product={product} />
      </div>
    </div>
  );
}