"use client";

import { motion } from "framer-motion";
import { Youtube, Sparkles, Zap, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingElements() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const elements = [
    { icon: Youtube, color: "text-red-500", delay: 0 },
    { icon: Sparkles, color: "text-yellow-500", delay: 0.5 },
    { icon: Zap, color: "text-blue-500", delay: 1 },
    { icon: Shield, color: "text-green-500", delay: 1.5 },
  ];

  // Don't render until we have dimensions
  if (dimensions.width === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((Element, index) => (
        <motion.div
          key={index}
          className={`absolute ${Element.color}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            x: [
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
              Math.random() * dimensions.width,
            ],
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: Element.delay,
            ease: "easeInOut",
          }}
        >
          <Element.icon size={24} />
        </motion.div>
      ))}
    </div>
  );
}
