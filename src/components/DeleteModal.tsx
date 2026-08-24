import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Product } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product) => Promise<void> | void;
  product: Product | null;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(product);
      onClose();
    } catch (e) {
      console.error('Delete failed', e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div 
        id="delete-confirm-modal"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#c7c4d8]/50 overflow-hidden z-10 p-6 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Red Circular Icon */}
        <div className="w-14 h-14 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>

        {/* Title & Description */}
        <h3 className="font-space font-bold text-xl text-[#191c1d] mb-2">
          Delete Product?
        </h3>
        <p className="text-sm text-[#464555] leading-relaxed mb-6">
          Are you sure you want to delete <span className="font-semibold text-[#030712]">"{product.name}"</span>? This action cannot be undone and will permanently remove this item from your catalog.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            id="cancel-delete-btn"
            onClick={onClose}
            disabled={isDeleting}
            className="w-1/2 px-4 py-2.5 rounded-lg border border-[#c7c4d8] text-sm font-semibold text-[#575e70] hover:bg-[#f3f4f5] hover:text-[#191c1d] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-1/2 px-4 py-2.5 rounded-lg bg-[#ba1a1a] hover:bg-[#a01616] text-white text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};
