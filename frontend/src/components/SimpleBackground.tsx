"use client";

import { motion } from 'framer-motion';

interface SimpleBackgroundProps {
  sectionIndex: number;
}

export default function SimpleBackground({ sectionIndex }: SimpleBackgroundProps) {
  const colors = [
    'from-purple-900 via-blue-900 to-indigo-900',
    'from-blue-900 via-indigo-900 to-purple-900', 
    'from-indigo-900 via-purple-900 to-pink-900',
  ];

  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      {/* Base gradient background */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${colors[sectionIndex % colors.length]} opacity-80`}
        animate={{
          background: `linear-gradient(${45 + sectionIndex * 30}deg, rgb(88 28 135), rgb(30 58 138), rgb(17 24 39))`
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Animated radial gradients */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.4),transparent_70%)]"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.3),transparent_60%)]"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.3),transparent_50%)]"
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />

      {/* Floating orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
