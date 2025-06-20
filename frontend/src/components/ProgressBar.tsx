"use client";

import { motion } from "framer-motion";
import { Progress } from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showPercentage?: boolean;
  variant?: "default" | "rainbow" | "pulse";
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  className,
  showPercentage = true,
  variant = "default",
  size = "md",
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "rainbow":
        return "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500";
      case "pulse":
        return "bg-gradient-to-r from-blue-500 to-purple-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-500";
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showPercentage && (
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
          <span>Progress</span>
          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-semibold"
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      )}
      
      <Progress
        value={value}
        className={cn(
          "relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden",
            getVariantClasses()
          )}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1,
            }}
          />
          
          {/* Pulse effect for pulse variant */}
          {variant === "pulse" && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      </Progress>
    </div>
  );
}
