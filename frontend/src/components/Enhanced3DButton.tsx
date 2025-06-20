"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Enhanced3DButtonProps {
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
        const targetScale = 1.1 + Math.sin(time * 8) * 0.02;
        buttonRef.current.scale.setScalar(targetScale);
        
        // Glow effect
        const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
        glowMaterial.opacity = 1.0 + Math.sin(time * 6) * 0.3;
        
        // Rotation on hover
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.05;
        groupRef.current.rotation.x = Math.cos(time * 3) * 0.03;
        
        // Color shift on hover
        const hue = (time * 80) % 360;
        const buttonMaterial = buttonRef.current.material as THREE.MeshPhysicalMaterial;
        buttonMaterial.emissive.setHSL(hue / 360, 0.8, 0.2);
        buttonMaterial.emissiveIntensity = 0.5;
      } else {
        buttonRef.current.scale.setScalar(1);
        const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
        glowMaterial.opacity = 0.4;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
        const buttonMaterial = buttonRef.current.material as THREE.MeshPhysicalMaterial;
        buttonMaterial.emissive.setHSL(0, 0, 0);
        buttonMaterial.emissiveIntensity = 0.1;
      }
      
      // Press effect
      if (isPressed && !disabled) {
        buttonRef.current.scale.setScalar(0.95);
        groupRef.current.position.z = -0.05;
        
        // Energy burst effect on click
        const burstIntensity = Math.sin(time * 20) * 0.5 + 0.5;
        const buttonMaterial = buttonRef.current.material as THREE.MeshPhysicalMaterial;
        buttonMaterial.emissiveIntensity = burstIntensity * 0.3;
      } else {
        groupRef.current.position.z = 0;
        const buttonMaterial = buttonRef.current.material as THREE.MeshPhysicalMaterial;
        buttonMaterial.emissiveIntensity = 0.1;
      }
      
      // Disabled state
      if (disabled) {
        const buttonMaterial = buttonRef.current.material as THREE.MeshPhysicalMaterial;
        buttonMaterial.opacity = 0.5;
        const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
        glowMaterial.opacity = 0.1;
      } else {
        const buttonMaterial = buttonRef.current.material as THREE.MeshPhysicalMaterial;
        buttonMaterial.opacity = 1;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Button body */}
      <RoundedBox 
        ref={buttonRef}
        args={dimensions} 
        radius={0.1} 
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={colors}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={colors}
          emissiveIntensity={0.1}
          transparent
          opacity={disabled ? 0.5 : 1}
        />
      </RoundedBox>
      
      {/* Glow effect */}
      <RoundedBox 
        ref={glowRef}
        args={[dimensions[0] + 0.1, dimensions[1] + 0.1, dimensions[2] + 0.1]} 
        radius={0.12} 
        smoothness={4}
      >
        <meshBasicMaterial
          color={colors}
          transparent
          opacity={0.3}
        />
      </RoundedBox>
      
      {/* Energy particles */}
      {isHovered && !disabled && (
        <>
          {Array.from({ length: 8 }, (_, i) => (
            <Float key={i} speed={2 + i * 0.5} rotationIntensity={0.5} floatIntensity={0.3}>
              <mesh position={[
                (Math.random() - 0.5) * dimensions[0] * 1.5,
                (Math.random() - 0.5) * dimensions[1] * 1.5,
                (Math.random() - 0.5) * 0.5
              ]}>
                <sphereGeometry args={[0.02]} />                <meshBasicMaterial
                  color={colors}
                />
              </mesh>
            </Float>
          ))}
        </>
      )}
    </group>
  );
}

export function Enhanced3DButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}: Enhanced3DButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (!disabled && onClick) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
      onClick();
    }
  };
  const sizeClasses = {
    sm: 'h-16 text-sm px-4',
    md: 'h-24 text-lg px-8',
    lg: 'h-28 text-xl px-10'
  }[size];

  return (
    <motion.div
      className={`relative ${sizeClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <ButtonGeometry
            isHovered={isHovered}
            isPressed={isPressed}
            variant={variant}
            size={size}
            disabled={disabled}
          />
        </Canvas>
      </div>
      
      {/* Button Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white font-semibold">
        {children}
      </div>
      
      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-white"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.div>
  );
}
