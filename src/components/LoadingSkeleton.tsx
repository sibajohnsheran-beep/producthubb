import React from 'react';

interface LoadingSkeletonProps {
  rowCount?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rowCount = 5 }) => {
  return (
    <div className="divide-y divide-[#c7c4d8]/30">
      {Array.from({ length: rowCount }).map((_, idx) => (
        <div key={idx} className="p-4 flex items-center justify-between animate-pulse">
          {/* Product Icon & Name & SKU */}
          <div className="flex items-center gap-3 w-1/3 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-[#e7e8e9] shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-[#e7e8e9] rounded-md w-3/4" />
              <div className="h-3 bg-[#f3f4f5] rounded-md w-1/3" />
            </div>
          </div>

          {/* Category */}
          <div className="hidden sm:block w-1/6">
            <div className="h-4 bg-[#e7e8e9] rounded-md w-2/3" />
          </div>

          {/* Price */}
          <div className="w-1/6 text-left">
            <div className="h-4 bg-[#e7e8e9] rounded-md w-16" />
          </div>

          {/* Status Badge */}
          <div className="hidden md:block w-1/6">
            <div className="h-6 bg-[#e7e8e9] rounded-full w-20" />
          </div>

          {/* Created Date */}
          <div className="hidden lg:block w-1/6">
            <div className="h-3 bg-[#f3f4f5] rounded-md w-24" />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 w-20">
            <div className="w-8 h-8 rounded-lg bg-[#f3f4f5]" />
            <div className="w-8 h-8 rounded-lg bg-[#f3f4f5]" />
          </div>
        </div>
      ))}
    </div>
  );
};
