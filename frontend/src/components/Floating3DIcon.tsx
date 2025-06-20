"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Floating3DIconProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
  size?: number;
}

export function Floating3DIcon({ 
  icon: Icon, 
  className = "", 
  delay = 0, 
  size = 24 
}: Floating3DIconProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateX: [0, 360],
        rotateY: [0, 180],
        z: [0, 20, 0],
      }}
      transition={{
        delay,
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.2,
        rotateX: 45,
        rotateY: 45,
        z: 30,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div 
        className="relative transform-gpu"
        style={{
          filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))",
        }}
      >
        {/* Main icon */}
        <Icon 
          size={size} 
          className="relative z-10 text-white/90"
          style={{
            transform: "translateZ(10px)",
          }}
        />
        
        {/* 3D depth shadow */}
        <Icon 
          size={size} 
          className="absolute inset-0 text-blue-500/20"
          style={{
            transform: "translateZ(-5px) translateX(2px) translateY(2px)",
          }}
        />
        
        {/* Deeper shadow */}
        <Icon 
          size={size} 
          className="absolute inset-0 text-purple-500/10"
          style={{
            transform: "translateZ(-10px) translateX(4px) translateY(4px)",
          }}
        />
      </div>
    </motion.div>
  );
}
