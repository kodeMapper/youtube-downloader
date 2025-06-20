"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Html, Float, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Immersive3DCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

function CardGeometry({ 
  mousePosition, 
  isHovered 
}: { 
  mousePosition: { x: number; y: number };
  isHovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth mouse-based rotation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.15,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.15,
        0.1
      );
      
      // Gentle floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      
      // Hover scale
      const targetScale = isHovered ? 1.03 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }

    if (glowRef.current) {
      // Pulsing glow
      glowRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main card body with depth */}
      <RoundedBox args={[5, 3.5, 0.2]} radius={0.1} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.1}
          thickness={0.5}
        />
      </RoundedBox>
      
      {/* Glass front layer */}
      <RoundedBox 
        args={[5.02, 3.52, 0.02]} 
        radius={0.1} 
        smoothness={4}
        position={[0, 0, 0.11]}
      >
        <meshPhysicalMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.1}
        />
      </RoundedBox>
      
      {/* Animated glow outline */}
      <RoundedBox 
        ref={glowRef}
        args={[5.1, 3.6, 0.05]} 
        radius={0.1} 
        smoothness={4}
        position={[0, 0, -0.05]}
      >
        <meshBasicMaterial
          color={isHovered ? "#3b82f6" : "#1e293b"}
          transparent
          opacity={0.3}
        />
      </RoundedBox>
      
      {/* Floating particles around card */}
      {isHovered && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <Float 
              key={i}
              speed={2 + i * 0.3}
              rotationIntensity={0.3}
              floatIntensity={0.4}
              position={[
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 4,
                0.3 + Math.random() * 0.5
              ]}
            >
              <sphereGeometry args={[0.02 + Math.random() * 0.03]} />
              <meshBasicMaterial
                color={`hsl(${200 + Math.random() * 60}, 70%, 60%)`}
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

export function Immersive3DCard({ children, className = "", title }: Immersive3DCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setMousePosition({
        x: (e.clientX - centerX) / rect.width,
        y: (e.clientY - centerY) / rect.height,
      });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ 
        height: '500px',
        perspective: '1000px',
      }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-20">
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 2, 1]} intensity={0.8} />
          <pointLight position={[0, 0, 3]} color="#3b82f6" intensity={0.3} />
          <Environment preset="night" />
          
          <CardGeometry 
            mousePosition={mousePosition} 
            isHovered={isHovered}
          />
          
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.3} 
            scale={6} 
            blur={1.5} 
          />
        </Canvas>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col p-8">
        {title && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {title}
            </h2>
          </motion.div>
        )}
          <motion.div
          className="flex-1 backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * -3}deg) rotateY(${mousePosition.x * 3}deg)`,
            transformStyle: "preserve-3d",
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(59,130,246,0.03) 50%, rgba(255,255,255,0.02) 100%)',
          }}
          animate={{
            boxShadow: isHovered 
              ? "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
        
        {/* Enhanced glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-600/10 to-cyan-400/10 rounded-3xl blur-2xl -z-10"
          animate={{
            opacity: isHovered ? 0.8 : 0.3,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
