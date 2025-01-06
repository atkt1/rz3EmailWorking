import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';
import { EmptyState } from '@/components/empty-states/EmptyState';
import { ProductList } from '@/components/products/ProductList';
import { getProducts, deleteProduct } from '@/lib/services/productService';
import type { Product } from '@/lib/types/product';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      if (!user) return;
      
      try {
        const data = await getProducts(user.id);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteProduct(id, user.id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Products Added"
        description="Add your first product to start managing reviews."
        actionLabel="Add Product"
        onAction={() => navigate('/dashboard/products/new')}
      />
    );
  }

  return <ProductList products={products} onDelete={handleDelete} isLoading={isLoading} />;
}