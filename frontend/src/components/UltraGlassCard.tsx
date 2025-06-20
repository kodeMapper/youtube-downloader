"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface UltraGlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  variant?: "default" | "rainbow" | "neon";
}

export function UltraGlassCard({ 
  children, 
  className = "", 
  intensity = "medium",
  variant = "default" 
}: UltraGlassCardProps) {
  const intensityClasses = {
    light: "backdrop-blur-sm bg-white/5",
    medium: "backdrop-blur-xl bg-white/10",
    heavy: "backdrop-blur-3xl bg-white/15",
  };

  const variantClasses = {
    default: "border border-white/20",
    rainbow: "border border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20",
    neon: "border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
  };

  const glowEffect = variant === "neon" 
    ? "drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
    : "drop-shadow-2xl";

  return (
    <motion.div
      className={`
        ${intensityClasses[intensity]}
        ${variantClasses[variant]}
        rounded-3xl
        ${glowEffect}
        relative
        overflow-hidden
        group
        ${className}
      `}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: variant === "rainbow" 
            ? "linear-gradient(45deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1), rgba(236,72,153,0.1))"
            : variant === "neon"
            ? "radial-gradient(circle at center, rgba(6,182,212,0.1) 0%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)"
        }}
        animate={{
          background: variant === "rainbow" ? [
            "linear-gradient(0deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1), rgba(236,72,153,0.1))",
            "linear-gradient(360deg, rgba(236,72,153,0.1), rgba(59,130,246,0.1), rgba(147,51,234,0.1))"
          ] : undefined
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner highlights */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-tl-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/10 to-transparent rounded-br-3xl opacity-40" />
    </motion.div>
  );
}
