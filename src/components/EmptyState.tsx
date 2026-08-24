import React from 'react';
import { PackageSearch, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters?: () => void;
  onAddProduct?: () => void;
  hasFilters?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onResetFilters,
  onAddProduct,
  hasFilters = false
}) => {
  return (
    <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-[#f3f4f5] flex items-center justify-center text-[#777587] mb-4">
        <PackageSearch className="w-8 h-8" />
      </div>
      <h3 className="font-space text-lg font-bold text-[#191c1d] mb-1">
        No products found
      </h3>
      <p className="text-sm text-[#464555] max-w-md mx-auto mb-6">
        {hasFilters
          ? 'No products match your current search and filter criteria. Try resetting filters or adjusting search terms.'
          : 'Your product catalog is currently empty. Get started by adding your first product.'}
      </p>

      <div className="flex items-center gap-3">
        {hasFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#c7c4d8] text-sm font-semibold text-[#191c1d] hover:bg-[#f3f4f5] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        )}
        {onAddProduct && (
          <button
            onClick={onAddProduct}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3e32d3] text-white text-sm font-semibold hover:bg-[#342ab3] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>
    </div>
  );
};
