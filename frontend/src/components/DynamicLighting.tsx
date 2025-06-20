"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function DynamicLighting() {
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

    let time = 0;

    const drawLighting = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create multiple light sources
      const lights = [
        {
          x: canvas.width * 0.3 + Math.sin(time * 0.01) * 100,
          y: canvas.height * 0.3 + Math.cos(time * 0.015) * 80,
          color: [59, 130, 246], // blue
          intensity: 0.4 + Math.sin(time * 0.02) * 0.2,
        },
        {
          x: canvas.width * 0.7 + Math.cos(time * 0.012) * 120,
          y: canvas.height * 0.6 + Math.sin(time * 0.018) * 90,
          color: [147, 51, 234], // purple
          intensity: 0.3 + Math.cos(time * 0.025) * 0.15,
        },
        {
          x: canvas.width * 0.5 + Math.sin(time * 0.008) * 150,
          y: canvas.height * 0.8 + Math.cos(time * 0.01) * 60,
          color: [236, 72, 153], // pink
          intensity: 0.35 + Math.sin(time * 0.03) * 0.18,
        },
      ];

      lights.forEach(light => {
        const gradient = ctx.createRadialGradient(
          light.x, light.y, 0,
          light.x, light.y, 300
        );
        
        gradient.addColorStop(0, `rgba(${light.color.join(',')}, ${light.intensity})`);
        gradient.addColorStop(0.5, `rgba(${light.color.join(',')}, ${light.intensity * 0.3})`);
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      time++;
    };

    const animate = () => {
      drawLighting();
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
      className="fixed inset-0 pointer-events-none z-1 mix-blend-overlay"
      style={{ filter: "blur(2px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
    />
  );
}
