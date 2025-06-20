"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-500 border-green-400';
      case 'error':
        return 'from-red-500 to-pink-500 border-red-400';
      case 'info':
      default:
        return 'from-blue-500 to-purple-500 border-blue-400';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <AnimatePresence>      {isVisible && (
        <motion.div
          className="fixed top-4 left-4 right-4 md:top-4 md:right-4 md:left-auto z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`
            bg-gradient-to-r ${getToastColors()}
            p-3 md:p-4 rounded-lg shadow-lg border backdrop-blur-sm
            w-full md:max-w-sm md:min-w-[300px]
          `}>
            <div className="flex items-center gap-3">
              <span className="text-base md:text-lg">{getIcon()}</span>
              <p className="text-white font-medium text-xs md:text-sm flex-1">{message}</p>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors ml-2 p-1"
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
