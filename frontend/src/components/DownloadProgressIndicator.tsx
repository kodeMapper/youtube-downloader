"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DownloadProgressIndicatorProps {
  isVisible: boolean;
  downloadProgress?: number;
  fileName?: string;
  fileSize?: string;
  onCancel?: () => void;
}

export default function DownloadProgressIndicator({
  isVisible,
  downloadProgress = 0,
  fileName = "video.mp4",
  fileSize = "Unknown size",
  onCancel
}: DownloadProgressIndicatorProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (downloadProgress >= 100) {
      setTimeout(() => {
        setIsComplete(true);
      }, 1000);
    } else {
      setIsComplete(false);
    }
  }, [downloadProgress]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl border border-white/10 z-50 w-11/12 md:w-auto min-w-[320px] shadow-2xl"
    >
      <div className="mb-3 flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-white text-lg">
            {isComplete ? "Download Complete" : "Downloading..."}
          </h4>
          <p className="text-gray-300 text-sm truncate max-w-[220px]">{fileName}</p>
        </div>
        
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${downloadProgress}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full ${
              isComplete 
                ? "bg-green-500" 
                : "bg-gradient-to-r from-blue-500 to-purple-600"
            }`}
          />
        </div>
        <span className="text-white text-sm font-medium">{Math.round(downloadProgress)}%</span>
      </div>
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>{fileSize}</span>
        {isComplete ? (
          <span className="text-green-400">Completed</span>
        ) : (
          <span>Downloading...</span>
        )}
      </div>
    </motion.div>
  );
}
