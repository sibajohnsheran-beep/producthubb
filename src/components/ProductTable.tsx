import React, { useState } from 'react';
import { 
  Laptop, 
  Cloud, 
  Headphones, 
  Smartphone, 
  Keyboard, 
  Monitor, 
  Armchair, 
  Shirt, 
  Package, 
  Pencil, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  onDuplicateProduct?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
  onDuplicateProduct
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);
  const [copiedSkuId, setCopiedSkuId] = useState<string | number | null>(null);

  const getProductIcon = (product: Product) => {
    const type = product.iconType;
    const cat = product.category.toLowerCase();
    const name = product.name.toLowerCase();

    if (type === 'laptop' || name.includes('laptop') || name.includes('thinkpad')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#3e32d3]/10 text-[#3e32d3] flex items-center justify-center shrink-0">
          <Laptop className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'cloud' || cat === 'software' || name.includes('cloud')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#5850ec]/10 text-[#5850ec] flex items-center justify-center shrink-0">
          <Cloud className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'headset' || name.includes('headset') || name.includes('headphone') || name.includes('audio')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#575e70]/10 text-[#575e70] flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'phone' || name.includes('phone') || name.includes('iphone')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'keyboard' || name.includes('keyboard')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center shrink-0">
          <Keyboard className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'monitor' || name.includes('monitor') || name.includes('display')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#3e32d3]/10 text-[#3e32d3] flex items-center justify-center shrink-0">
          <Monitor className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'chair' || cat === 'furniture' || name.includes('chair') || name.includes('desk')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#883800]/10 text-[#883800] flex items-center justify-center shrink-0">
          <Armchair className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'clothing' || cat === 'clothing' || name.includes('hoodie')) {
      return (
        <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center shrink-0">
          <Shirt className="w-5 h-5" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-lg bg-[#f3f4f5] text-[#575e70] flex items-center justify-center shrink-0">
        <Package className="w-5 h-5" />
      </div>
    );
  };

  const renderStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
            Active
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e1e3e4] text-[#464555]">
            Draft
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ffdad6]/40 text-[#ba1a1a]">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e1e3e4] text-[#464555]">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopySku = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(product.sku);
    setCopiedSkuId(product.id);
    setTimeout(() => {
      setCopiedSkuId(null);
      setActiveMenuId(null);
    }, 1200);
  };

  // Calculate pagination window
  const startEntry = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#c7c4d8]/40 bg-[#f8f9fa]/50 text-xs font-semibold text-[#464555] uppercase tracking-wider">
              <th className="py-3.5 px-6 font-semibold">Product</th>
              <th className="py-3.5 px-6 font-semibold">Category</th>
              <th className="py-3.5 px-6 font-semibold">Price</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold">Date Added</th>
              <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c7c4d8]/30">
            {products.map((product) => {
              const isMenuOpen = activeMenuId === product.id;
              const isSkuCopied = copiedSkuId === product.id;

              return (
                <tr 
                  key={product.id}
                  id={`product-row-${product.id}`}
                  className="hover:bg-[#f8f9fa] transition-colors group"
                >
                  {/* Product Details */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      {getProductIcon(product)}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#030712] truncate group-hover:text-[#3e32d3] transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#777587] font-mono mt-0.5">
                          {product.sku || `SKU-${product.id}`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 text-sm text-[#464555] font-medium">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 text-sm font-semibold text-[#191c1d]">
                    Rs. {Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {product.category.toLowerCase() === 'software' && (
                      <span className="text-xs text-[#777587] font-normal">/mo</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {renderStatusBadge(product.status)}
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-6 text-sm text-[#777587]">
                    {formatDate(product.createdAt)}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 relative">
                      {/* Edit Button */}
                      <button
                        id={`edit-product-btn-${product.id}`}
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 text-[#575e70] hover:text-[#3e32d3] hover:bg-[#3e32d3]/10 rounded-lg transition-colors"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        id={`delete-product-btn-${product.id}`}
                        onClick={() => onDeleteProduct(product)}
                        className="p-1.5 text-[#575e70] hover:text-[#EF4444] hover:bg-[#ffdad6]/40 rounded-lg transition-colors"
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* More Menu Toggle */}
                      <div className="relative">
                        <button
                          id={`more-actions-btn-${product.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : product.id);
                          }}
                          className="p-1.5 text-[#575e70] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg transition-colors"
                          aria-label="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveMenuId(null)} 
                            />
                            <div className="absolute right-0 top-8 z-30 w-44 bg-white rounded-lg shadow-lg border border-[#c7c4d8]/50 py-1.5 text-left text-xs font-medium text-[#191c1d] animate-in fade-in zoom-in-95 duration-100">
                              {onViewProduct && (
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onViewProduct(product);
                                  }}
                                  className="w-full px-3.5 py-2 hover:bg-[#f3f4f5] flex items-center gap-2 text-[#464555] hover:text-[#191c1d]"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View Details
                                </button>
                              )}
                              <button
                                onClick={(e) => handleCopySku(product, e)}
                                className="w-full px-3.5 py-2 hover:bg-[#f3f4f5] flex items-center gap-2 text-[#464555] hover:text-[#191c1d]"
                              >
                                {isSkuCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                                    <span className="text-[#10B981]">SKU Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy SKU
                                  </>
                                )}
                              </button>
                              {onDuplicateProduct && (
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onDuplicateProduct(product);
                                  }}
                                  className="w-full px-3.5 py-2 hover:bg-[#f3f4f5] flex items-center gap-2 text-[#464555] hover:text-[#191c1d]"
                                >
                                  <Package className="w-3.5 h-3.5" />
                                  Duplicate Product
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer matching Figma */}
      <div className="p-4 px-6 border-t border-[#c7c4d8]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#464555]">
        <p>
          Showing <span className="text-[#191c1d]">{startEntry}</span> to <span className="text-[#191c1d]">{endEntry}</span> of <span className="text-[#191c1d]">{totalCount.toLocaleString()}</span> entries
        </p>

        <div className="flex items-center gap-1.5">
          <button
            id="pagination-prev-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-3 py-1.5 rounded-lg border border-[#c7c4d8] font-semibold text-xs flex items-center gap-1 transition-colors ${
              currentPage <= 1
                ? 'opacity-40 cursor-not-allowed bg-transparent text-[#777587]'
                : 'hover:bg-[#f3f4f5] text-[#191c1d]'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                id={`pagination-page-${pageNum}`}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors flex items-center justify-center ${
                  isActive
                    ? 'bg-[#3e32d3] text-white shadow-xs'
                    : 'text-[#464555] hover:bg-[#f3f4f5]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            id="pagination-next-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-3 py-1.5 rounded-lg border border-[#c7c4d8] font-semibold text-xs flex items-center gap-1 transition-colors ${
              currentPage >= totalPages
                ? 'opacity-40 cursor-not-allowed bg-transparent text-[#777587]'
                : 'hover:bg-[#f3f4f5] text-[#191c1d]'
            }`}
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
