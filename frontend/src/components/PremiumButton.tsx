"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Loader2 } from "lucide-react";

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "rainbow" | "neon";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PremiumButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
}: PremiumButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-xl",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500",
    secondary: "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 hover:from-gray-500 hover:via-gray-600 hover:to-gray-500",
    rainbow: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400",
    neon: "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400",
  };

  const glowEffect = {
    primary: "shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)]",
    secondary: "shadow-[0_0_20px_rgba(107,114,128,0.3)] hover:shadow-[0_0_30px_rgba(107,114,128,0.5)]",
    rainbow: "shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.7)]",
    neon: "shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)]",
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-2xl font-bold
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${glowEffect[variant]}
        text-white border-0 cursor-pointer
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        transform-gpu
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -2,
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.98,
        y: disabled ? 0 : 0,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        opacity: { duration: 0.3 },
        y: { duration: 0.3 }
      }}
    >
      {/* Animated background overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: variant === "rainbow" 
            ? "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)"
            : "linear-gradient(45deg, rgba(255,255,255,0.1), transparent)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: isHovered ? ["0% 50%", "100% 50%"] : "0% 50%",
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)",
        }}
        animate={{
          x: isHovered ? ["-100%", "100%"] : "-100%",
          opacity: isHovered ? [0, 1, 0] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: "linear",
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-5 h-5" />
          </motion.div>
        )}
        <span>{children}</span>
      </span>
      
      {/* Pulse effect for neon variant */}
      {variant === "neon" && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
}
