import React from 'react';
import { X, Package, DollarSign, Calendar, Tag, Layers, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      <div 
        id="product-detail-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#c7c4d8]/50 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#c7c4d8]/40 flex items-center justify-between bg-[#f8f9fa]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3e32d3]/10 text-[#3e32d3] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-space font-bold text-lg text-[#191c1d]">
                Product Details
              </h2>
              <p className="text-xs text-[#777587] font-mono">
                SKU: {product.sku || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#575e70] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Info */}
          <div>
            <h3 className="font-space font-bold text-xl text-[#030712] mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-[#464555]">
              {product.description || 'No detailed description provided for this product item.'}
            </p>
          </div>

          {/* Grid Attributes */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#f8f9fa] border border-[#c7c4d8]/30 text-xs">
            <div>
              <span className="text-[#777587] font-medium block mb-1">Price</span>
              <span className="text-base font-bold text-[#191c1d]">
                Rs. {Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-[#777587] font-medium block mb-1">Category</span>
              <span className="text-sm font-semibold text-[#3e32d3] bg-[#3e32d3]/10 px-2.5 py-0.5 rounded-md inline-block">
                {product.category}
              </span>
            </div>
            <div>
              <span className="text-[#777587] font-medium block mb-1">Status</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block ${
                product.status === 'Active' 
                  ? 'bg-[#10B981]/10 text-[#10B981]' 
                  : product.status === 'Draft' 
                  ? 'bg-[#e1e3e4] text-[#464555]' 
                  : 'bg-[#ffdad6]/40 text-[#ba1a1a]'
              }`}>
                {product.status}
              </span>
            </div>
            <div>
              <span className="text-[#777587] font-medium block mb-1">Added On</span>
              <span className="text-xs font-semibold text-[#191c1d]">
                {product.createdAt || 'Recent'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#c7c4d8]/40 bg-white flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDelete(product);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#EF4444] hover:bg-[#ffdad6]/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Product
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#c7c4d8] text-xs font-semibold text-[#575e70] hover:bg-[#f3f4f5]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3e32d3] text-white text-xs font-semibold hover:bg-[#342ab3] transition-colors shadow-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
