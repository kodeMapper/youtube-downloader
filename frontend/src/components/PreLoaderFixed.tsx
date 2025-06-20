"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreLoader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{ x: number, y: number, duration: number, delay: number }>>([]);

  useEffect(() => {
    // Generate floating element positions only on client side
    const elements = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setFloatingElements(elements);

    // Progress simulation
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsComplete(true), 500);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="relative w-full max-w-sm mx-auto px-6">
            <div className="text-center">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold text-white mb-2">YouTube <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Downloader</span></h1>
                <p className="text-white/60 text-sm">Loading immersive experience...</p>
              </motion.div>

              {/* Progress Bar */}
              <div className="relative h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>

              {/* Progress Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-white/60 mt-4 text-sm"
              >
                {Math.round(progress)}%
              </motion.p>
            </div>

            {/* Floating Elements - Client-side only rendering */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {floatingElements.map((element, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/10 rounded-full"
                  initial={{
                    x: element.x,
                    y: element.y + 100,
                  }}
                  animate={{
                    y: -100,
                    x: element.x,
                  }}
                  transition={{
                    duration: element.duration,
                    repeat: Infinity,
                    delay: element.delay,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
