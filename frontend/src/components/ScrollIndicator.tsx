"use client";

import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  isLastSection?: boolean;
}

export default function ScrollIndicator({ isLastSection = false }: ScrollIndicatorProps) {
  // Don't render if it's the last section
  if (isLastSection) return null;
  
  return (    <motion.div
      className="fixed bottom-16 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <motion.div
        className="text-gray-400 text-xs mb-2 text-center px-3 py-1 bg-black/60 rounded-full backdrop-blur-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="hidden md:inline">Scroll or use arrow keys</span>
        <span className="md:hidden">Swipe or tap navigation</span>
      </motion.div>
      
      <motion.div
        className="flex flex-col space-y-1"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-1 h-2 bg-gradient-to-b from-purple-500 to-transparent rounded-full"></div>
        <div className="w-1 h-2 bg-gradient-to-b from-purple-500 to-transparent rounded-full opacity-75"></div>
        <div className="w-1 h-2 bg-gradient-to-b from-purple-500 to-transparent rounded-full opacity-50"></div>
      </motion.div>
    </motion.div>
  );
}
