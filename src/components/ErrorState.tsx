import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong while fetching products. Please check your connection and try again.',
  onRetry
}) => {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-[#ffdad6]/50 flex items-center justify-center text-[#ba1a1a] mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="font-space text-lg font-bold text-[#191c1d] mb-1">
        Unable to load products
      </h3>
      <p className="text-sm text-[#464555] max-w-md mx-auto mb-6">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3e32d3] text-white text-sm font-semibold hover:bg-[#342ab3] transition-colors shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
};
