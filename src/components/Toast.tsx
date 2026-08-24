import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          container: 'bg-[#ecfdf5] border-[#10B981]/30 text-[#065f46]',
          icon: <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
        };
      case 'error':
        return {
          container: 'bg-[#fef2f2] border-[#EF4444]/30 text-[#991b1b]',
          icon: <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
        };
      case 'warning':
        return {
          container: 'bg-[#fffbeb] border-[#F59E0B]/30 text-[#92400e]',
          icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0" />
        };
      default:
        return {
          container: 'bg-[#eff6ff] border-[#3e32d3]/30 text-[#1e40af]',
          icon: <Info className="w-5 h-5 text-[#3e32d3] shrink-0" />
        };
    }
  };

  const style = getStyle();

  return (
    <div
      id={`toast-notification-${toast.id}`}
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-top-4 duration-200 ${style.container}`}
      role="alert"
    >
      <div className="flex items-center gap-3 min-w-0">
        {style.icon}
        <p className="text-xs sm:text-sm font-semibold tracking-wide truncate">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors text-current shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
