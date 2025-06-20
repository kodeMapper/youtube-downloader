"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreLoaderProps {
  onComplete: () => void;
}

export default function PreLoader({ onComplete }: PreLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
        >
          <div className="text-center">
            {/* Logo/Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              </div>
            </motion.div>

            {/* Loading Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl font-bold text-white mb-8"
            >
              App is Loading...
            </motion.h2>

            {/* Progress Bar */}
            <div className="w-80 mx-auto">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="h-1 bg-white/20 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
                  style={{
                    width: `${progress}%`,
                  }}
                  transition={{ ease: "easeOut" }}
                />
              </motion.div>

              {/* Progress Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-white/60 mt-4 text-sm"
              >
                {Math.round(progress)}%
              </motion.p>
            </div>            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {typeof window !== 'undefined' && [...Array(20)].map((_, i) => {
                // Generate random positions safely on client-side only
                const randomX = () => Math.random() * (window?.innerWidth || 1920);
                const randomY = () => Math.random() * (window?.innerHeight || 1080);
                
                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/10 rounded-full"
                    initial={{
                      x: randomX(),
                      y: randomY() + 100,
                    }}
                    animate={{
                      y: -100,
                      x: randomX(),
                    }}
                    transition={{
                      duration: Math.random() * 10 + 10,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "linear",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
