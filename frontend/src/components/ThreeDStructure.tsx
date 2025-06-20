"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export function ThreeDStructure() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

    // 3D Grid lines
    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;

      const gridSize = 50;
      const perspective = 800;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Perspective effect based on mouse position
      const mouseOffsetX = (mousePosition.x - centerX) * 0.0005;
      const mouseOffsetY = (mousePosition.y - centerY) * 0.0005;

      // Draw horizontal lines with perspective
      for (let i = -20; i <= 20; i++) {
        const y = centerY + i * gridSize;
        const z = i * 20;
        
        const scale = perspective / (perspective + z);
        const perspectiveY = centerY + (y - centerY) * scale + mouseOffsetY * 100;
        
        ctx.globalAlpha = Math.max(0.1, scale);
        ctx.beginPath();
        ctx.moveTo(0, perspectiveY);
        ctx.lineTo(canvas.width, perspectiveY);
        ctx.stroke();
      }

      // Draw vertical lines with perspective
      for (let i = -20; i <= 20; i++) {
        const x = centerX + i * gridSize;
        const z = i * 20;
        
        const scale = perspective / (perspective + z);
        const perspectiveX = centerX + (x - centerX) * scale + mouseOffsetX * 100;
        
        ctx.globalAlpha = Math.max(0.1, scale);
        ctx.beginPath();
        ctx.moveTo(perspectiveX, 0);
        ctx.lineTo(perspectiveX, canvas.height);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      drawGrid();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mousePosition]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
        style={{ mixBlendMode: "screen" }}
      />
      
      {/* 3D Floating Elements */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + (i % 3) * 30}%`,
              top: `${20 + Math.floor(i / 3) * 40}%`,
            }}
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 180],
              z: [0, 50, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
            whileHover={{
              scale: 1.2,
              rotateX: 45,
              rotateY: 45,
              z: 100,
            }}
          >
            <div
              className={`
                w-16 h-16 
                bg-gradient-to-br from-blue-500/20 to-purple-600/20
                backdrop-blur-sm
                border border-white/10
                rounded-lg
                shadow-2xl
                transform-gpu
                perspective-1000
              `}
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 0.01}deg) rotateY(${mousePosition.x * 0.01}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-transparent rounded border border-white/5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-blue-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            z: [0, Math.random() * 100, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
