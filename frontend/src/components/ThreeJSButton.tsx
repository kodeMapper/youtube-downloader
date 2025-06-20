"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ThreeJSButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

function ButtonGeometry({ isHovered, isPressed, variant }: { 
  isHovered: boolean; 
  isPressed: boolean; 
  variant: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Subtle rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      
      // Scale animation
      const targetScale = isPressed ? 0.9 : isHovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
      
      // Position animation
      const targetZ = isPressed ? -0.1 : isHovered ? 0.1 : 0;
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 5);
    }
  });

  const getColor = () => {
    switch (variant) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#8b5cf6';
      case 'danger': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 0.4, 0.1]} />
      <meshBasicMaterial
        color={getColor()}
        transparent
        opacity={isHovered ? 0.3 : 0.1}
        wireframe
      />
    </mesh>
  );
}

export function ThreeJSButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = "" 
}: ThreeJSButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white';
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white';
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ButtonGeometry 
            isHovered={isHovered} 
            isPressed={isPressed} 
            variant={variant}
          />
        </Canvas>
      </div>

      {/* Button Content */}
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative z-10 px-8 py-4 rounded-xl font-semibold text-lg
          shadow-lg backdrop-blur-sm border border-white/20
          transition-all duration-300 ease-out
          ${getVariantClasses()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isHovered && !disabled ? 'shadow-2xl shadow-blue-500/25' : ''}
        `}
        style={{
          transform: `perspective(1000px) rotateX(${isPressed ? 5 : 0}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
          style={{
            transform: "translateX(-100%)",
          }}
          animate={isHovered && !disabled ? {
            transform: "translateX(100%)",
          } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.button>

      {/* Glow effect */}
      <motion.div
        className={`
          absolute inset-0 rounded-xl blur-lg -z-10
          ${variant === 'primary' ? 'bg-blue-400/20' : ''}
          ${variant === 'secondary' ? 'bg-purple-400/20' : ''}
          ${variant === 'danger' ? 'bg-red-400/20' : ''}
        `}
        animate={{
          opacity: isHovered && !disabled ? 0.8 : 0.3,
          scale: isHovered && !disabled ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
