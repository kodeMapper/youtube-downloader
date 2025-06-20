"use client";

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, RoundedBox, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

interface Interactive3DCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function AnimatedBox({ isHovered }: { isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      if (isHovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <RoundedBox
        ref={meshRef}
        args={[2, 2, 0.3]}
        radius={0.2}
        smoothness={4}
      >
        <meshStandardMaterial
          color={isHovered ? "#8b5cf6" : "#3b82f6"}
          metalness={0.8}
          roughness={0.2}
          emissive={isHovered ? "#4c1d95" : "#1e40af"}
          emissiveIntensity={0.2}
        />
      </RoundedBox>
    </Float>
  );
}

function Scene({ isHovered }: { isHovered: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      <AnimatedBox isHovered={isHovered} />
      
      <Environment preset="city" />
      
      <EffectComposer>
        <Bloom intensity={0.5} />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
    </>
  );
}

export default function Interactive3DCard({ 
  title, 
  description, 
  icon, 
  onClick,
  className = "" 
}: Interactive3DCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative group cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Scene isHovered={isHovered} />
        </Canvas>
      </div>

      {/* Glass Effect Overlay */}
      <motion.div
        className="relative z-10 h-full p-6 rounded-2xl backdrop-blur-sm border border-white/20"
        style={{
          background: isHovered 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
        }}
        animate={{
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(139, 92, 246, 0.3)'
            : '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Icon */}
        <motion.div
          className="mb-4 text-4xl"
          animate={{
            scale: isHovered ? 1.2 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-xl font-bold text-white mb-2"
          animate={{
            y: isHovered ? -2 : 0
          }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-gray-300 text-sm"
          animate={{
            opacity: isHovered ? 1 : 0.8
          }}
        >
          {description}
        </motion.p>

        {/* Hover Indicator */}
        <motion.div
          className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600"
          animate={{
            scale: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
