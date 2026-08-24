import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  Download, 
  SlidersHorizontal,
  Layers,
  Sparkles
} from 'lucide-react';
import { Product, ProductFilterParams, ProductStats, ToastNotification, ProductStatus } from '../types';
import { productService } from '../services/productService';
import { StatsCards } from '../components/StatsCards';
import { ProductTable } from '../components/ProductTable';
import { ProductFormModal } from '../components/ProductFormModal';
import { DeleteModal } from '../components/DeleteModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';

interface ProductsPageProps {
  onAddToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  onNavigateTab: (tab: string) => void;
  externalSearch?: string;
  initialCategory?: string;
  forceLoading?: boolean;
  forceError?: boolean;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onAddToast,
  onNavigateTab,
  externalSearch = '',
  initialCategory = 'all',
  forceLoading = false,
  forceError = false
}) => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    totalChange: '+12%',
    activeProducts: 0,
    activePercentage: '0%',
    categoryCount: 0,
    categoriesAdded: '+3 added',
    averagePrice: 0,
    priceChange: '-2%'
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  // Filter & Pagination state
  const [search, setSearch] = useState(externalSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<ProductFilterParams['sortBy']>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = 8;

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Sync external search from header if typed there
  useEffect(() => {
    if (externalSearch !== undefined && externalSearch !== search) {
      setSearch(externalSearch);
      setCurrentPage(1);
    }
  }, [externalSearch]);

  // Load products data
  const loadData = useCallback(async () => {
    if (forceError) {
      setError('Simulated network error: Failed to connect to product catalog.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [productRes, statsRes, catRes] = await Promise.all([
        productService.getProducts({
          search,
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          sortBy,
          page: currentPage,
          pageSize
        }),
        productService.getStats(),
        productService.getCategories()
      ]);

      setProducts(productRes.data);
      setTotalCount(productRes.total);
      setTotalPages(productRes.totalPages);
      setStats(statsRes);
      setAvailableCategories(catRes.map(c => c.name));
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err?.message || 'Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory, selectedStatus, sortBy, currentPage, pageSize, forceError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers for Add / Edit
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: {
    name: string;
    category: string;
    price: number;
    status: ProductStatus;
    sku?: string;
    description?: string;
  }) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        onAddToast(`Product "${formData.name}" updated successfully.`, 'success');
      } else {
        await productService.createProduct(formData);
        onAddToast(`Product "${formData.name}" added successfully.`, 'success');
      }
      loadData();
    } catch (err: any) {
      onAddToast(err?.message || 'Failed to save product.', 'error');
    }
  };

  // Handlers for Delete
  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (product: Product) => {
    try {
      await productService.deleteProduct(product.id);
      onAddToast(`Product "${product.name}" deleted successfully.`, 'success');
      // If deleting the last item on a page > 1, go back one page
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadData();
      }
    } catch (err: any) {
      onAddToast(err?.message || 'Failed to delete product.', 'error');
    }
  };

  // Handlers for View & Duplicate
  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      await productService.createProduct({
        name: `${product.name} (Copy)`,
        category: product.category,
        price: product.price,
        status: 'Draft',
        description: product.description,
        iconType: product.iconType
      });
      onAddToast(`Duplicated "${product.name}" as draft copy.`, 'info');
      loadData();
    } catch (err: any) {
      onAddToast('Failed to duplicate product.', 'error');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters = search.trim() !== '' || selectedCategory !== 'all' || selectedStatus !== 'all' || sortBy !== 'newest';

  // Export CSV feature
  const handleExportCSV = () => {
    if (products.length === 0) return;
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Status', 'Date Added'];
    const rows = products.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.category,
      p.price,
      p.status,
      p.createdAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `producthub_catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onAddToast('Product catalog exported to CSV.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-bold text-3xl sm:text-4xl text-[#191c1d] tracking-tight">
            Products
          </h1>
          <p className="text-sm font-medium text-[#464555] mt-1">
            Manage your product catalog, pricing and categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#c7c4d8] text-xs font-semibold text-[#575e70] hover:bg-[#f3f4f5] hover:text-[#191c1d] transition-colors"
            title="Export products to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            id="add-product-main-btn"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#3e32d3] hover:bg-[#342ab3] text-white text-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Statistics Cards */}
      <StatsCards
        stats={stats}
        onFilterActive={() => {
          setSelectedStatus('Active');
          setCurrentPage(1);
        }}
        onNavigateCategories={() => onNavigateTab('categories')}
      />

      {/* 3. Filter and Table Card Container matching Figma */}
      <div className="bg-white rounded-2xl border border-[#c7c4d8]/50 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 border-b border-[#c7c4d8]/40 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587]" />
              <input
                id="product-search-input"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products by name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] text-sm text-[#191c1d] rounded-lg border border-[#c7c4d8]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3e32d3]/15 focus:border-[#3e32d3] transition-all placeholder-[#777587]"
              />
            </div>

            {/* Dropdown Filters & Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <div className="relative">
                <select
                  id="category-filter-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2.5 bg-[#f8f9fa] text-xs font-semibold text-[#191c1d] rounded-lg border border-[#c7c4d8]/60 hover:border-[#3e32d3] focus:outline-none focus:ring-2 focus:ring-[#3e32d3]/15 transition-all cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  id="status-filter-select"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2.5 bg-[#f8f9fa] text-xs font-semibold text-[#191c1d] rounded-lg border border-[#c7c4d8]/60 hover:border-[#3e32d3] focus:outline-none focus:ring-2 focus:ring-[#3e32d3]/15 transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  id="sort-by-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as ProductFilterParams['sortBy']);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2.5 bg-[#f8f9fa] text-xs font-semibold text-[#191c1d] rounded-lg border border-[#c7c4d8]/60 hover:border-[#3e32d3] focus:outline-none focus:ring-2 focus:ring-[#3e32d3]/15 transition-all cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  id="reset-filters-btn"
                  onClick={handleResetFilters}
                  className="p-2.5 text-[#575e70] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-lg transition-colors border border-[#c7c4d8]/60"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Content / States */}
        {isLoading || forceLoading ? (
          <LoadingSkeleton rowCount={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : products.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
            onAddProduct={handleOpenAdd}
          />
        ) : (
          <ProductTable
            products={products}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEditProduct={handleOpenEdit}
            onDeleteProduct={handleOpenDelete}
            onViewProduct={handleViewProduct}
            onDuplicateProduct={handleDuplicateProduct}
          />
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        productToEdit={editingProduct}
        categories={availableCategories.length > 0 ? availableCategories : ['Hardware', 'Software', 'Electronics', 'Accessories', 'Furniture', 'Clothing']}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        product={deletingProduct}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        product={viewingProduct}
        onEdit={(p) => {
          setIsDetailModalOpen(false);
          handleOpenEdit(p);
        }}
        onDelete={(p) => {
          setIsDetailModalOpen(false);
          handleOpenDelete(p);
        }}
      />
    </div>
  );
};
