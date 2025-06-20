"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Float, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Interactive3DButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Button3DGeometry({ 
  isHovered, 
  isPressed, 
  variant = 'primary',
  size = 'md'
}: {
  isHovered: boolean;
  isPressed: boolean;
  variant: string;
  size: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Mesh>(null);
  const sizeMap = {
    sm: [2, 0.6, 0.2] as [number, number, number],
    md: [3, 0.8, 0.25] as [number, number, number],
    lg: [4, 1, 0.3] as [number, number, number]
  };

  const colorMap = {
    primary: '#4a90e2',
    secondary: '#6b7280',
    danger: '#ef4444'
  } as const;

  const dimensions = sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  const baseColor = colorMap[variant as keyof typeof colorMap] || colorMap.primary;

  useFrame((state) => {
    if (groupRef.current && buttonRef.current) {
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      
      // Press animation
      const targetZ = isPressed ? -0.05 : 0;
      buttonRef.current.position.z = THREE.MathUtils.lerp(
        buttonRef.current.position.z,
        targetZ,
        0.2
      );
      
      // Hover scale
      const targetScale = isHovered ? 1.05 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
      
      // Subtle rotation on hover
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        isHovered ? Math.sin(state.clock.elapsedTime * 3) * 0.05 : 0,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main button body */}
      <RoundedBox 
        ref={buttonRef}
        args={dimensions} 
        radius={0.05} 
        smoothness={4}
      >
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0}
          emissive={isHovered ? new THREE.Color(baseColor).multiplyScalar(0.1) : new THREE.Color(0)}
        />
      </RoundedBox>
      
      {/* Glass overlay */}
      <RoundedBox 
        args={[dimensions[0] + 0.02, dimensions[1] + 0.02, 0.02]} 
        radius={0.05} 
        smoothness={4}
        position={[0, 0, dimensions[2]/2 + 0.01]}
      >
        <meshPhysicalMaterial
          color="white"
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.1}
        />
      </RoundedBox>
      
      {/* Glow effect */}
      <RoundedBox 
        args={[dimensions[0] + 0.1, dimensions[1] + 0.1, dimensions[2] - 0.05]} 
        radius={0.05} 
        smoothness={4}
        position={[0, 0, -0.02]}
      >
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={isHovered ? 0.3 : 0.1}
        />
      </RoundedBox>
      
      {/* Particle burst on hover */}
      {isHovered && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <Float 
              key={i}
              speed={3 + i}
              rotationIntensity={0.5}
              floatIntensity={0.3}
              position={[
                (Math.random() - 0.5) * (dimensions[0] + 1),
                (Math.random() - 0.5) * (dimensions[1] + 1),
                dimensions[2]/2 + 0.2 + Math.random() * 0.3
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial
                color={baseColor}
                transparent
                opacity={0.8}
              />
            </Float>
          ))}
        </>
      )}
    </group>
  );
}

function ButtonLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={1} />
      <pointLight position={[0, 0, 1]} intensity={0.5} />
    </>
  );
}

export function Interactive3DButton({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = "" 
}: Interactive3DButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleMouseDown = () => !disabled && setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const sizeClasses = {
    sm: 'h-16 px-4 text-sm',
    md: 'h-20 px-6 text-base',
    lg: 'h-24 px-8 text-lg'
  };

  return (
    <motion.button
      className={`relative ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ButtonLighting />
          <Environment preset="studio" />
          
          <Button3DGeometry 
            isHovered={isHovered}
            isPressed={isPressed}
            variant={variant}
            size={size}
          />
        </Canvas>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.span
          className="font-semibold text-white drop-shadow-lg"
          animate={{ 
            y: isPressed ? 1 : 0,
            textShadow: isHovered ? "0 0 10px rgba(255,255,255,0.5)" : "0 2px 4px rgba(0,0,0,0.5)"
          }}
          transition={{ duration: 0.1 }}
        >
          {children}
        </motion.span>
      </div>
      
      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
}
