"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Simple3DButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function ButtonGeometry({ 
  isHovered, 
  isPressed, 
  disabled = false
}: {
  isHovered: boolean;
  isPressed: boolean;
  disabled: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current && !disabled) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.scale.setScalar(
        isPressed ? 0.9 : isHovered ? 1.1 : 1
      );
    }
  });

  const color = disabled ? "#6b7280" : isHovered ? "#3b82f6" : "#6366f1";

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.1}>
      <RoundedBox
        ref={meshRef}
        args={[2, 0.5, 0.3]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
    </Float>
  );
}

export function Simple3DButton({ 
  children, 
  onClick, 
  disabled = false,
  className = ""
}: Simple3DButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => !disabled && setIsPressed(true)}
      onTap={() => !disabled && setIsPressed(false)}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          
          <ButtonGeometry 
            isHovered={isHovered}
            isPressed={isPressed}
            disabled={disabled}
          />
        </Canvas>
      </div>

      {/* Button Content */}
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative z-10 px-8 py-4 rounded-2xl font-semibold text-white
          bg-gradient-to-r from-blue-600/80 to-purple-600/80
          backdrop-blur-sm border border-white/20
          transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl cursor-pointer'}
        `}
        whileHover={disabled ? {} : { boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
      >
        {children}
      </motion.button>
    </motion.div>
  );
}
