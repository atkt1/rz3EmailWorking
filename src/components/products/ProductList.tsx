import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types/product';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProductList({ products, onDelete, isLoading }: ProductListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const handleEditClick = (productId: string) => {
    navigate(`/dashboard/products/edit/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-2xl font-bold",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Products
        </h1>
        <Button
          onClick={() => navigate('/dashboard/products/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className={cn(
        "rounded-xl border overflow-hidden",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "border-b text-sm",
                isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
              )}>
                <th className="px-6 py-4 text-left font-medium">Product</th>
                <th className="px-6 py-4 text-center font-medium">Marketplace</th>
                <th className="px-6 py-4 text-center font-medium">Giveaway</th>
                <th className="px-6 py-4 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr 
                  key={product.id}
                  className={cn(
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  )}
                >
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={product.thumbnail_path}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMjQgMjhDMjYuMjA5MSAyOCAyOCAyNi4yMDkxIDI4IDI0QzI4IDIxLjc5MDkgMjYuMjA5MSAyMCAyNCAyMEMyMS43OTA5IDIwIDIwIDIxLjc5MDkgMjAgMjRDMjAgMjYuMjA5MSAyMS43OTA5IDI4IDI0IDI4WiIgZmlsbD0iI0E1QTlCMSIvPjwvc3ZnPg==';
                          }}
                        />
                      </div>
                      <div>
                        <div className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-gray-900"
                        )}>
                          {product.name}
                        </div>
                        <div className={cn(
                          "text-sm",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          ID: {product.marketplace_product_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={cn(
                    "px-6 py-2 text-center",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    {product.marketplace}
                  </td>
                  <td className={cn(
                    "px-6 py-2 text-center",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    {product.giveaway}
                  </td>
                  <td className="px-6 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                         onClick={() => handleEditClick(product.id)}
    className={cn(
      "p-2 rounded-lg transition-all duration-200",
      "hover:scale-105",
      isDark 
        ? [
            "text-blue-400 hover:bg-blue-500/10",
            "hover:text-blue-300",
            "active:bg-blue-500/20"
          ]
        : [
            "text-blue-600 hover:bg-blue-50",
            "hover:text-blue-500",
            "active:bg-blue-100"
          ]
    )}
                        title="Edit product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
    className={cn(
      "p-2 rounded-lg transition-all duration-200",
      "hover:scale-105",
      isDark 
        ? [
            "text-red-400 hover:bg-red-500/10",
            "hover:text-red-300",
            "active:bg-red-500/20"
          ]
        : [
            "text-red-600 hover:bg-red-50",
            "hover:text-red-500",
            "active:bg-red-100"
          ]
    )}
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await onDelete(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}