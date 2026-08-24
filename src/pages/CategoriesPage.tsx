import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  Laptop, 
  Armchair, 
  Watch, 
  Shirt, 
  Cloud, 
  ArrowRight,
  FolderPlus,
  X,
  CheckCircle2,
  Package
} from 'lucide-react';
import { CategoryInfo } from '../types';
import { productService } from '../services/productService';

interface CategoriesPageProps {
  onSelectCategoryFilter: (categoryName: string) => void;
  onAddToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onSelectCategoryFilter,
  onAddToast
}) => {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await productService.getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('electronic') || n.includes('device')) return Laptop;
    if (n.includes('furnitur') || n.includes('chair') || n.includes('desk')) return Armchair;
    if (n.includes('accessor')) return Watch;
    if (n.includes('cloth') || n.includes('apparel')) return Shirt;
    if (n.includes('soft') || n.includes('cloud')) return Cloud;
    return Package;
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: CategoryInfo = {
      id: newCatName.toLowerCase().replace(/\s+/g, '-'),
      name: newCatName.trim(),
      itemCount: 0,
      description: newCatDesc.trim() || 'Custom created product category.',
      icon: 'layers',
      color: '#3e32d3'
    };

    setCategories([...categories, newCat]);
    setIsAddModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    onAddToast(`Category "${newCat.name}" created successfully.`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-bold text-3xl sm:text-4xl text-[#191c1d] tracking-tight">
            Categories
          </h1>
          <p className="text-sm font-medium text-[#464555] mt-1">
            Organize and classify your product inventory.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#3e32d3] hover:bg-[#342ab3] text-white text-sm font-semibold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Bento Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          return (
            <div
              key={cat.id}
              className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/50 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#3e32d3]/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3e32d3]/10 text-[#3e32d3] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#464555] bg-[#f3f4f5] px-2.5 py-1 rounded-full">
                    {cat.itemCount} items
                  </span>
                </div>

                <h3 className="font-space font-bold text-xl text-[#191c1d] mb-1.5 group-hover:text-[#3e32d3] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#575e70] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#c7c4d8]/30 flex items-center justify-between">
                <button
                  onClick={() => onSelectCategoryFilter(cat.name)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3e32d3] hover:underline"
                >
                  <span>View Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Category Quick Card */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-6 rounded-2xl border-2 border-dashed border-[#c7c4d8] hover:border-[#3e32d3] bg-white/40 hover:bg-[#3e32d3]/5 transition-all flex flex-col items-center justify-center text-center group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f3f4f5] group-hover:bg-[#3e32d3]/10 text-[#777587] group-hover:text-[#3e32d3] flex items-center justify-center mb-3 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="font-space font-bold text-base text-[#191c1d] group-hover:text-[#3e32d3]">
            Add New Category
          </h4>
          <p className="text-xs text-[#777587] mt-1 max-w-[200px]">
            Create a custom grouping for your product catalog
          </p>
        </button>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)} 
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#c7c4d8]/50 p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#c7c4d8]/40 mb-4">
              <h3 className="font-space font-bold text-lg text-[#191c1d]">
                Add New Category
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#575e70] hover:text-[#191c1d]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">
                  Category Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Networking Gear"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#c7c4d8] focus:outline-none focus:ring-2 focus:ring-[#3e32d3]/20 focus:border-[#3e32d3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1d] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short description of products in this category..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#c7c4d8] focus:outline-none focus:ring-2 focus:ring-[#3e32d3]/20 focus:border-[#3e32d3] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#c7c4d8]/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#c7c4d8] text-xs font-semibold text-[#575e70]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#3e32d3] text-white text-xs font-semibold hover:bg-[#342ab3]"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
