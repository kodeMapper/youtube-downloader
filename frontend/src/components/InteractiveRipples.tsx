"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface RippleProps {
  x: number;
  y: number;
  id: number;
}

export function InteractiveRipples() {
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const rippleIdRef = useRef(0);

  const createRipple = (x: number, y: number) => {
    const id = rippleIdRef.current++;
    setRipples(prev => [...prev, { x, y, id }]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 1000);
  };

  const handleClick = (e: React.MouseEvent) => {
    createRipple(e.clientX, e.clientY);
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-20"
      onClickCapture={handleClick}
      style={{ pointerEvents: 'auto' }}
    >
      {ripples.map(ripple => (
        <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
    </div>
  );
}

function Ripple({ x, y }: { x: number; y: number }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [0, 4],
      opacity: [0.6, 0],
      transition: { duration: 1, ease: "easeOut" }
    });
  }, [controls]);

  return (
    <motion.div
      className="absolute rounded-full border-2 border-white/30"
      style={{
        left: x - 20,
        top: y - 20,
        width: 40,
        height: 40,
      }}
      animate={controls}
      initial={{ scale: 0, opacity: 0.6 }}
    />
  );
}
