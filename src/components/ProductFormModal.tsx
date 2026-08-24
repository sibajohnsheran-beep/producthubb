import React, { useState, useEffect } from 'react';
import { X, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Product, ProductStatus } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: string;
    price: number;
    status: ProductStatus;
    sku?: string;
    description?: string;
  }) => Promise<void> | void;
  productToEdit?: Product | null;
  categories: string[];
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
  categories
}) => {
  const isEditing = !!productToEdit;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<ProductStatus>('Active');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<{
    name?: string;
    category?: string;
    price?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when modal opens or editing product changes
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setName(productToEdit.name || '');
        setCategory(productToEdit.category || '');
        setPrice(productToEdit.price !== undefined ? String(productToEdit.price) : '');
        setStatus(productToEdit.status || 'Active');
        setSku(productToEdit.sku || '');
        setDescription(productToEdit.description || '');
      } else {
        // Default clean state
        setName('');
        setCategory('');
        setPrice('');
        setStatus('Active');
        setSku('');
        setDescription('');
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; category?: string; price?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required.';
    }

    if (!category || category === 'all' || category === '') {
      newErrors.category = 'Category is required.';
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice)) {
      newErrors.price = 'Price is required.';
    } else if (parsedPrice <= 0) {
      newErrors.price = 'Price must be greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        category: category.trim(),
        price: parseFloat(price),
        status,
        sku: sku.trim() || undefined,
        description: description.trim() || undefined
      });
      onClose();
    } catch (err) {
      console.error('Failed to submit product form', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div 
        id="product-form-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#c7c4d8]/50 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#c7c4d8]/40 flex items-center justify-between bg-white">
          <div>
            <h2 className="font-space font-bold text-xl text-[#191c1d]">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-[#464555] mt-0.5 font-medium">
              {isEditing ? 'Update product details and pricing in your catalog.' : 'Fill in the information below to add a new product.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#575e70] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 1. Product Name */}
          <div>
            <label className="block text-xs font-semibold text-[#191c1d] mb-1.5" htmlFor="product-name-input">
              Product Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="product-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. ThinkPad X1 Carbon"
              className={`w-full px-3.5 py-2.5 bg-white text-sm text-[#191c1d] rounded-lg border transition-all placeholder-[#777587] focus:outline-none focus:ring-2 ${
                errors.name 
                  ? 'border-[#EF4444] focus:ring-[#EF4444]/20' 
                  : 'border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-[#3e32d3]/15'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* 2-Column Row: Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5" htmlFor="product-category-select">
                Category <span className="text-[#EF4444]">*</span>
              </label>
              <select
                id="product-category-select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 bg-white text-sm text-[#191c1d] rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                  errors.category
                    ? 'border-[#EF4444] focus:ring-[#EF4444]/20'
                    : 'border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-[#3e32d3]/15'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5" htmlFor="product-price-input">
                Price (LKR / Rs.) <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-[#777587]">
                  Rs.
                </div>
                <input
                  id="product-price-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors(prev => ({ ...prev, price: undefined }));
                  }}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-white text-sm text-[#191c1d] rounded-lg border transition-all placeholder-[#777587] focus:outline-none focus:ring-2 ${
                    errors.price
                      ? 'border-[#EF4444] focus:ring-[#EF4444]/20'
                      : 'border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-[#3e32d3]/15'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-[#EF4444] flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          {/* 2-Column Row: Status & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5" htmlFor="product-status-select">
                Status
              </label>
              <select
                id="product-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3.5 py-2.5 bg-white text-sm text-[#191c1d] rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none transition-all"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* SKU (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5" htmlFor="product-sku-input">
                SKU <span className="text-[#777587] font-normal">(Optional)</span>
              </label>
              <input
                id="product-sku-input"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. LNV-1092"
                className="w-full px-3.5 py-2.5 bg-white text-sm text-[#191c1d] rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none placeholder-[#777587] transition-all font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#191c1d] mb-1.5" htmlFor="product-description-input">
              Description <span className="text-[#777587] font-normal">(Optional)</span>
            </label>
            <textarea
              id="product-description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the product features or specifications..."
              className="w-full px-3.5 py-2.5 bg-white text-sm text-[#191c1d] rounded-lg border border-[#c7c4d8] focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 focus:outline-none placeholder-[#777587] transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#c7c4d8]/40 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-product-form-btn"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#c7c4d8] text-sm font-semibold text-[#575e70] hover:bg-[#f3f4f5] hover:text-[#191c1d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-product-form-btn"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[#3e32d3] hover:bg-[#342ab3] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Add Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
