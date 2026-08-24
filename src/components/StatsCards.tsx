import React from 'react';
import { Package, CheckCircle2, Layers, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductStats } from '../types';

interface StatsCardsProps {
  stats: ProductStats;
  onFilterActive?: () => void;
  onNavigateCategories?: () => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  onFilterActive,
  onNavigateCategories
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Total Products */}
      <div className="bg-white p-6 rounded-xl border border-[#c7c4d8]/40 shadow-xs flex flex-col justify-between hover:border-[#3e32d3]/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#3e32d3]/10 flex items-center justify-center text-[#3e32d3]">
            <Package className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#10B981]/10 text-[#10B981]">
            <TrendingUp className="w-3 h-3" />
            {stats.totalChange || '+12%'}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#464555] tracking-wide mb-1">Total Products</p>
          <h3 className="font-space text-2xl font-bold text-[#191c1d]">
            {stats.totalProducts.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* 2. Active Products */}
      <div 
        onClick={onFilterActive}
        className="bg-white p-6 rounded-xl border border-[#c7c4d8]/40 shadow-xs flex flex-col justify-between hover:border-[#10B981]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="w-24 bg-[#edeeef] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#10B981] h-full rounded-full transition-all duration-500" 
              style={{ width: stats.activePercentage || '90%' }} 
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#464555] tracking-wide mb-1">Active Products</p>
          <div className="flex items-baseline justify-between">
            <h3 className="font-space text-2xl font-bold text-[#191c1d]">
              {stats.activeProducts.toLocaleString()}
            </h3>
            <span className="text-xs font-medium text-[#10B981]">
              {stats.activePercentage}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Categories */}
      <div 
        onClick={onNavigateCategories}
        className="bg-white p-6 rounded-xl border border-[#c7c4d8]/40 shadow-xs flex flex-col justify-between hover:border-[#F59E0B]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">
            {stats.categoriesAdded || '+3 added'}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#464555] tracking-wide mb-1">Categories</p>
          <h3 className="font-space text-2xl font-bold text-[#191c1d]">
            {stats.categoryCount}
          </h3>
        </div>
      </div>

      {/* 4. Avg. Price */}
      <div className="bg-white p-6 rounded-xl border border-[#c7c4d8]/40 shadow-xs flex flex-col justify-between hover:border-[#3e32d3]/30 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#d9dff5] flex items-center justify-center text-[#5c6274]">
            <DollarSign className="w-5 h-5 text-[#3e32d3]" />
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#575e70]/10 text-[#575e70]">
            <TrendingDown className="w-3 h-3 text-[#575e70]" />
            {stats.priceChange || '-2%'}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-[#464555] tracking-wide mb-1">Avg. Price</p>
          <h3 className="font-space text-2xl font-bold text-[#191c1d]">
            Rs. {stats.averagePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
      </div>
    </div>
  );
};
