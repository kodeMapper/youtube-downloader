"use client";

import { motion } from 'framer-motion';

interface SectionProgressProps {
  currentSection: number;
  totalSections: number;
}

export default function SectionProgress({ currentSection, totalSections }: SectionProgressProps) {
  const progress = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-sm text-gray-300">
          {currentSection + 1} / {totalSections}
        </span>
        
        <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
