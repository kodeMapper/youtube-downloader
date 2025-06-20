"use client";

import { motion } from "framer-motion";

interface EnhancedProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "rainbow" | "neon" | "pulse";
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export function EnhancedProgressBar({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showPercentage = true,
  animated = true,
  className = "",
}: EnhancedProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "rainbow":
        return {
          background: "linear-gradient(90deg, #ff6b6b 0%, #feca57 25%, #48cae4 50%, #06ffa5 75%, #ff006e 100%)",
          backgroundSize: "200% 100%",
        };
      case "neon":
        return {
          background: "linear-gradient(90deg, #00f5ff, #00d4ff, #0099ff)",
          boxShadow: "0 0 20px rgba(0, 245, 255, 0.5), inset 0 0 20px rgba(0, 245, 255, 0.2)",
        };
      case "pulse":
        return {
          background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
        };
      default:
        return {
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
        };
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Progress bar container */}
      <div className={`
        relative overflow-hidden rounded-full bg-white/10 backdrop-blur-sm
        ${sizeClasses[size]}
        border border-white/20
      `}>
        {/* Progress fill */}
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            ...getVariantStyles(),
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.5 : 0,
            ease: "easeOut" 
          }}
        >
          {/* Animated shine effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ width: "50%" }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 0.5,
              }}
            />
          )}
          
          {/* Pulse effect for pulse variant */}
          {variant === "pulse" && (
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          
          {/* Animated background for rainbow variant */}
          {variant === "rainbow" && animated && (
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ["0% 0%", "200% 0%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                background: "inherit",
                backgroundSize: "inherit",
              }}
            />
          )}
        </motion.div>
        
        {/* Glow effect for neon variant */}
        {variant === "neon" && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), transparent)",
              width: `${percentage}%`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>
      
      {/* Percentage text */}
      {showPercentage && (
        <motion.div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-white font-bold text-sm bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">
            {Math.round(percentage)}%
          </span>
        </motion.div>
      )}
      
      {/* Floating particles for enhanced effect */}
      {animated && percentage > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.min(percentage - 5, 90)}%`,
                top: "50%",
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
