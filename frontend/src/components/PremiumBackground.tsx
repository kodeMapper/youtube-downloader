"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create flowing gradient background
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create multiple flowing gradients
      const gradient1 = ctx.createLinearGradient(
        0, 0, 
        canvas.width + Math.sin(time * 0.01) * 200, 
        canvas.height + Math.cos(time * 0.008) * 150
      );
      
      gradient1.addColorStop(0, `hsla(${240 + Math.sin(time * 0.01) * 30}, 70%, 60%, 0.03)`);
      gradient1.addColorStop(0.5, `hsla(${280 + Math.cos(time * 0.012) * 40}, 80%, 70%, 0.05)`);
      gradient1.addColorStop(1, `hsla(${320 + Math.sin(time * 0.015) * 50}, 75%, 65%, 0.02)`);
      
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Second layer
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time * 0.008) * 100,
        canvas.height * 0.6 + Math.cos(time * 0.01) * 80,
        0,
        canvas.width * 0.7,
        canvas.height * 0.4,
        canvas.width * 0.8
      );
      
      gradient2.addColorStop(0, `hsla(${200 + Math.sin(time * 0.02) * 60}, 90%, 80%, 0.04)`);
      gradient2.addColorStop(0.7, `hsla(${260 + Math.cos(time * 0.018) * 40}, 85%, 75%, 0.02)`);
      gradient2.addColorStop(1, "transparent");
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
    />
  );
}
