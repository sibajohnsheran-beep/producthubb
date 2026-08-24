import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  Layers, 
  DollarSign, 
  Clock, 
  Laptop, 
  Cloud, 
  Headphones, 
  Smartphone,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Product, ActivityItem, ProductStats } from '../types';
import { productService } from '../services/productService';
import { StatsCards } from '../components/StatsCards';

interface OverviewPageProps {
  onNavigateTab: (tab: string, filter?: { category?: string }) => void;
  onOpenAddProduct: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateTab,
  onOpenAddProduct
}) => {
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 1248,
    totalChange: '+12%',
    activeProducts: 1131,
    activePercentage: '90.6%',
    categoryCount: 24,
    categoriesAdded: '+3 added',
    averagePrice: 145.50,
    priceChange: '-2%'
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, productsRes, actsRes] = await Promise.all([
          productService.getStats(),
          productService.getProducts({ page: 1, pageSize: 5, sortBy: 'newest' }),
          productService.getRecentActivities()
        ]);
        setStats(statsRes);
        setRecentProducts(productsRes.data);
        setActivities(actsRes);
      } catch (e) {
        console.error('Overview data fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-space font-bold text-3xl sm:text-4xl text-[#191c1d] tracking-tight">
            Overview
          </h1>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#3e32d3] hover:bg-[#342ab3] text-white text-sm font-semibold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Metric Cards */}
      <StatsCards
        stats={stats}
        onFilterActive={() => onNavigateTab('products')}
        onNavigateCategories={() => onNavigateTab('categories')}
      />

      {/* 2-Column Grid: Recent Products + Product Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Products (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#c7c4d8]/50 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-space font-bold text-lg text-[#191c1d]">
                  Recent Products
                </h3>
                <p className="text-xs text-[#464555]">
                  Latest items cataloged in the system
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs font-semibold text-[#3e32d3] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#c7c4d8]/30">
              {recentProducts.map((p) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#f3f4f5] text-[#3e32d3] flex items-center justify-center font-bold shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#191c1d] truncate group-hover:text-[#3e32d3] transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-[#777587] font-mono">
                        {p.sku || 'SKU-001'} • {p.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#191c1d]">
                      Rs. {Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <span className={`text-[11px] font-semibold px-2 py-0.2 rounded-full inline-block ${
                      p.status === 'Active' ? 'text-[#10B981] bg-[#10B981]/10' : 'text-[#464555] bg-[#e1e3e4]'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-[#c7c4d8]/30">
            <button
              onClick={() => onNavigateTab('products')}
              className="w-full py-2 text-center text-xs font-bold text-[#3e32d3] hover:bg-[#3e32d3]/5 rounded-lg transition-colors"
            >
              Browse Complete Inventory ({stats.totalProducts} items) →
            </button>
          </div>
        </div>

        {/* Right: Product Activity Timeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#c7c4d8]/50 shadow-[0px_4px_24px_rgba(0,0,0,0.02)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-space font-bold text-lg text-[#191c1d]">
                Product Activity
              </h3>
              <p className="text-xs text-[#464555]">
                Recent updates and catalog changes
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" title="Live log" />
          </div>

          {/* Activity Feed Items matching Image 5 / Image 7 HTML */}
          <div className="space-y-5 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#c7c4d8]/40">
            {activities.map((act) => {
              let dotColor = 'bg-[#3e32d3] text-white';
              if (act.type === 'added') dotColor = 'bg-[#10B981] text-white';
              if (act.type === 'updated') dotColor = 'bg-[#5850ec] text-white';
              if (act.type === 'deleted') dotColor = 'bg-[#EF4444] text-white';
              if (act.type === 'category_created') dotColor = 'bg-[#F59E0B] text-white';

              return (
                <div key={act.id} className="relative flex items-start gap-4 pl-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ring-4 ring-white ${dotColor}`}>
                    {act.type === 'added' ? '＋' : act.type === 'deleted' ? '✕' : '•'}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-bold text-[#191c1d]">
                      {act.title}
                    </p>
                    <p className="text-xs text-[#464555] truncate font-medium">
                      {act.description}
                    </p>
                    <span className="text-[11px] text-[#777587] mt-0.5 inline-block">
                      {act.timeAgo} by {act.actor}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full mt-6 py-2.5 rounded-lg border border-[#c7c4d8] text-xs font-semibold text-[#575e70] hover:bg-[#f3f4f5] hover:text-[#191c1d] transition-colors"
          >
            Load More Activity
          </button>
        </div>
      </div>
    </div>
  );
};
