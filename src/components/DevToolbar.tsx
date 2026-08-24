import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Eye,
  Check
} from 'lucide-react';

interface DevToolbarProps {
  onToggleLoading: () => void;
  isLoadingForced: boolean;
  onToggleError: () => void;
  isErrorForced: boolean;
  onResetData: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const DevToolbar: React.FC<DevToolbarProps> = ({
  onToggleLoading,
  isLoadingForced,
  onToggleError,
  isErrorForced,
  onResetData,
  currentTab,
  onSelectTab
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {isExpanded ? (
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-[#c7c4d8] shadow-2xl p-4 w-72 text-xs text-[#191c1d] animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d8]/40 mb-3 font-bold">
            <span className="flex items-center gap-1.5 text-[#3e32d3]">
              <Sliders className="w-3.5 h-3.5" />
              Evaluation & QA Toolbar
            </span>
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-1 text-[#777587] hover:text-[#191c1d] rounded"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
              Simulate States
            </p>

            <button
              onClick={onToggleLoading}
              className={`w-full px-3 py-1.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                isLoadingForced
                  ? 'bg-[#3e32d3]/10 border-[#3e32d3] text-[#3e32d3] font-bold'
                  : 'border-[#c7c4d8] hover:bg-[#f3f4f5]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Loader2 className={`w-3.5 h-3.5 ${isLoadingForced ? 'animate-spin' : ''}`} />
                Loading Skeletons
              </span>
              {isLoadingForced && <Check className="w-3.5 h-3.5 text-[#3e32d3]" />}
            </button>

            <button
              onClick={onToggleError}
              className={`w-full px-3 py-1.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                isErrorForced
                  ? 'bg-[#ffdad6]/40 border-[#EF4444] text-[#ba1a1a] font-bold'
                  : 'border-[#c7c4d8] hover:bg-[#f3f4f5]'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Error & Retry State
              </span>
              {isErrorForced && <Check className="w-3.5 h-3.5 text-[#EF4444]" />}
            </button>

            <div className="pt-2 border-t border-[#c7c4d8]/40">
              <button
                onClick={onResetData}
                className="w-full px-3 py-1.5 rounded-lg border border-[#c7c4d8] text-left flex items-center gap-2 text-[#575e70] hover:bg-[#f3f4f5] hover:text-[#191c1d]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Mock Dataset
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white/90 hover:bg-white backdrop-blur-md px-3 py-2 rounded-full border border-[#c7c4d8] shadow-md text-xs font-semibold text-[#575e70] hover:text-[#3e32d3] flex items-center gap-2 transition-all hover:scale-105"
          title="Open QA State Toolbar"
        >
          <Sliders className="w-3.5 h-3.5 text-[#3e32d3]" />
          <span>QA Controls</span>
          <ChevronUp className="w-3 h-3 text-[#777587]" />
        </button>
      )}
    </div>
  );
};
