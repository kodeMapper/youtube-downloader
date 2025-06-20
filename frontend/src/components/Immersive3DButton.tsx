"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Immersive3DButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function ButtonGeometry({ 
  isHovered, 
  isPressed, 
  variant = 'primary',
  size = 'md',
  disabled = false
}: {
  isHovered: boolean;
  isPressed: boolean;
  variant: string;
  size: string;
  disabled: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const buttonRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const dimensions = {
    sm: [2.5, 0.8, 0.3],
    md: [3.5, 1, 0.4],
    lg: [5, 1.4, 0.5]
  }[size] as [number, number, number];

  const colors = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    danger: '#ef4444'
  }[variant];
  useFrame((state) => {
    if (groupRef.current && buttonRef.current && glowRef.current) {
      const time = state.clock.elapsedTime;
      
      // Floating animation
      groupRef.current.position.y = Math.sin(time * 2) * 0.02;
      
      // Hover effects
      if (isHovered && !disabled) {
        buttonRef.current.scale.setScalar(1.05 + Math.sin(time * 8) * 0.01);
        glowRef.current.material.opacity = 0.8 + Math.sin(time * 6) * 0.2;
        
        // Rotation on hover
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.02;
        groupRef.current.rotation.x = Math.cos(time * 3) * 0.01;
        
        // Color shift on hover
        const hue = (time * 50) % 360;
        buttonRef.current.material.emissive.setHSL(hue / 360, 0.5, 0.1);
      } else {
        buttonRef.current.scale.setScalar(1);
        glowRef.current.material.opacity = 0.3;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
        buttonRef.current.material.emissive.setHSL(0, 0, 0);
      }
      
      // Press effect
      if (isPressed && !disabled) {
        buttonRef.current.scale.setScalar(0.95);
        groupRef.current.position.z = -0.05;
        
        // Energy burst effect on click
        const burstIntensity = Math.sin(time * 20) * 0.5 + 0.5;
        buttonRef.current.material.emissiveIntensity = burstIntensity * 0.3;
      } else {
        groupRef.current.position.z = 0;
        buttonRef.current.material.emissiveIntensity = 0.1;
      }
      
      // Disabled state
      if (disabled) {
        buttonRef.current.material.opacity = 0.5;
        glowRef.current.material.opacity = 0.1;
      } else {
        buttonRef.current.material.opacity = 1;
      }
    }
  });
      
      // Press animation
      const targetZ = isPressed ? -0.1 : 0;
      buttonRef.current.position.z = THREE.MathUtils.lerp(
        buttonRef.current.position.z,
        targetZ,
        0.3
      );
      
      // Hover effects
      const targetScale = isHovered && !disabled ? 1.05 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
      
      // Glow animation
      glowRef.current.material.opacity = disabled ? 0.1 : 
        isHovered ? 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.1 : 0.2;
      
      // Rotation on hover
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        isHovered && !disabled ? Math.sin(state.clock.elapsedTime * 2) * 0.05 : 0,
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
        radius={0.1} 
        smoothness={4}
        castShadow
      >
        <meshPhysicalMaterial
          color={disabled ? '#374151' : colors}
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0}
          emissive={disabled ? '#000000' : new THREE.Color(colors).multiplyScalar(isHovered ? 0.15 : 0.05)}
        />
      </RoundedBox>
      
      {/* Glass overlay */}
      <RoundedBox 
        args={[dimensions[0] + 0.02, dimensions[1] + 0.02, 0.05]} 
        radius={0.1} 
        smoothness={4}
        position={[0, 0, dimensions[2]/2 + 0.025]}
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
        ref={glowRef}
        args={[dimensions[0] + 0.2, dimensions[1] + 0.2, dimensions[2] - 0.1]} 
        radius={0.1} 
        smoothness={4}
        position={[0, 0, -0.05]}
      >
        <meshBasicMaterial
          color={colors}
          transparent
          opacity={0.2}
        />
      </RoundedBox>
      
      {/* Energy particles */}
      {isHovered && !disabled && (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <Float 
              key={i}
              speed={4 + i * 0.2}
              rotationIntensity={0.5}
              floatIntensity={0.6}
              position={[
                (Math.random() - 0.5) * (dimensions[0] + 1.5),
                (Math.random() - 0.5) * (dimensions[1] + 1.5),
                dimensions[2]/2 + 0.2 + Math.random() * 0.5
              ]}
            >
              <sphereGeometry args={[0.015 + Math.random() * 0.02]} />
              <meshBasicMaterial
                color={colors}
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

export function Immersive3DButton({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = "" 
}: Immersive3DButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'h-16 px-6 text-sm',
    md: 'h-20 px-8 text-base',
    lg: 'h-28 px-12 text-xl'
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      className={`relative ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={1} />
          <pointLight position={[0, 0, 2]} intensity={0.5} />
          <Environment preset="studio" />
          
          <ButtonGeometry 
            isHovered={isHovered}
            isPressed={isPressed}
            variant={variant}
            size={size}
            disabled={disabled}
          />
        </Canvas>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.span
          className={`font-bold drop-shadow-lg ${
            disabled ? 'text-gray-400' : 'text-white'
          }`}
          animate={{ 
            y: isPressed ? 2 : 0,
            textShadow: isHovered && !disabled 
              ? "0 0 20px rgba(255,255,255,0.8)" 
              : "0 4px 8px rgba(0,0,0,0.8)"
          }}
          transition={{ duration: 0.1 }}
        >
          {children}
        </motion.span>
      </div>
      
      {/* Ripple effect */}
      {isPressed && !disabled && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}
