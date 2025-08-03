'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Yes, Proceed',
  cancelText = 'Cancel',
  onConfirm,
  showCancel = true,
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-yellow-500" size={24} />
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              </div>

              <p className="text-sm text-gray-600">{message}</p>

              <div className="mt-6 flex justify-end gap-3">
                {showCancel && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition shadow"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
