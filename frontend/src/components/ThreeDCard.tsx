"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

export function ThreeDCard({ children, className = "", depth = 20 }: ThreeDCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setMousePosition({
      x: (e.clientX - centerX) / rect.width,
      y: (e.clientY - centerY) / rect.height,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`relative transform-gpu ${className}`}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: depth }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: isHovered ? mousePosition.y * -10 : 0,
          rotateY: isHovered ? mousePosition.x * 10 : 0,
          z: isHovered ? depth : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Main card */}
        <div
          className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            transform: `translateZ(0px)`,
          }}
        >
          {children}
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              transform: "translateX(-100%)",
            }}
            animate={isHovered ? {
              transform: "translateX(100%)",
            } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {/* 3D depth layers */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 backdrop-blur-sm border border-white/5 rounded-2xl"
            style={{
              transform: `translateZ(-${(i + 1) * 5}px)`,
              filter: `blur(${i * 0.5}px)`,
              opacity: 0.8 - i * 0.2,
            }}
          />
        ))}

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl blur-xl"
          style={{
            transform: `translateZ(-15px)`,
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0.2,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
