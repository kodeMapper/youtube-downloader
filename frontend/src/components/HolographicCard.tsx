"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
}

export function HolographicCard({ children, className = "" }: HolographicCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-white/5 via-white/10 to-white/5
        backdrop-blur-3xl border border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.1)]
        ${className}
      `}
      whileHover={{ 
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
      }}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
    >
      {/* Holographic shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `
            linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            )
          `,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Rainbow border effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-50"
        style={{
          background: `
            conic-gradient(
              from 0deg,
              #ff006e,
              #fb5607,
              #ffbe0b,
              #8338ec,
              #3a86ff,
              #06ffa5,
              #ff006e
            )
          `,
          padding: "2px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-60" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner highlights */}
      <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-white/30 to-transparent rounded-full opacity-70" />
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-gradient-to-tl from-white/20 to-transparent rounded-full opacity-50" />
    </motion.div>
  );
}
