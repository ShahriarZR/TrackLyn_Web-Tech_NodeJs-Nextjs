'use client';

import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}: ModalProps) {
    useEffect(() => {
        function onEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }

        if (isOpen) {
            document.addEventListener('keydown', onEsc);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('keydown', onEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby={title ? "modal-title" : undefined}
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        onClick={(e) => e.stopPropagation()}
                        className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} mx-auto relative overflow-hidden`}
                    >
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between p-6 pb-0">
                                <h2
                                    id="modal-title"
                                    className="text-2xl font-bold text-gray-900"
                                >
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    aria-label="Close modal"
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        {/* Content */}
                        <div className="p-6 text-center flex flex-col items-center justify-center">
                            <p className="text-lg text-gray-800 font-medium leading-relaxed">
                                {children}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}