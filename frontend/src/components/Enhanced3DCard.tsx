"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  RoundedBox, 
  Text, 
  Html, 
  Float,
  ContactShadows,
  Environment,
  MeshDistortMaterial,
  Sphere
} from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Enhanced3DCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

function Card3DGeometry({ 
  mousePosition, 
  isHovered 
}: { 
  mousePosition: { x: number; y: number };
  isHovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current && cardRef.current) {
      // Smooth rotation based on mouse
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.y * 0.2,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition.x * 0.2,
        0.1
      );
      
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Scale on hover
      const targetScale = isHovered ? 1.02 : 1;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1)
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main card body */}
      <RoundedBox 
        ref={cardRef}
        args={[4, 3, 0.1]} 
        radius={0.05} 
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#1a1a2e"
          transparent
          opacity={0.95}
          roughness={0.1}
          metalness={0.2}
          transmission={0.05}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </RoundedBox>
      
      {/* Glass overlay effect */}
      <RoundedBox 
        args={[4.02, 3.02, 0.02]} 
        radius={0.05} 
        smoothness={4}
        position={[0, 0, 0.06]}
      >
        <meshPhysicalMaterial
          color="#4a90e2"
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.1}
        />
      </RoundedBox>
      
      {/* Glow rim */}
      <RoundedBox 
        args={[4.1, 3.1, 0.05]} 
        radius={0.05} 
        smoothness={4}
        position={[0, 0, -0.03]}
      >
        <meshBasicMaterial
          color={isHovered ? "#4a90e2" : "#2a2a3e"}
          transparent
          opacity={isHovered ? 0.4 : 0.2}
        />
      </RoundedBox>
      
      {/* Particle effects when hovered */}
      {isHovered && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <Sphere args={[0.05]} position={[2.2, 1.6, 0.2]}>
            <meshBasicMaterial color="#4a90e2" />
          </Sphere>
          <Sphere args={[0.03]} position={[-2.1, -1.4, 0.15]}>
            <meshBasicMaterial color="#e24a90" />
          </Sphere>
          <Sphere args={[0.04]} position={[1.8, -1.2, 0.18]}>
            <meshBasicMaterial color="#90e24a" />
          </Sphere>
        </Float>
      )}
      
      {/* Ambient particles */}
      <group>
        {Array.from({ length: 8 }).map((_, i) => (
          <Float 
            key={i}
            speed={1 + i * 0.2}
            rotationIntensity={0.1}
            floatIntensity={0.1}
            position={[
              (Math.random() - 0.5) * 5,
              (Math.random() - 0.5) * 4,
              0.2 + Math.random() * 0.3
            ]}
          >
            <Sphere args={[0.01 + Math.random() * 0.02]}>
              <meshBasicMaterial
                color={`hsl(${200 + Math.random() * 100}, 70%, 60%)`}
                transparent
                opacity={0.6}
              />
            </Sphere>
          </Float>
        ))}
      </group>
    </group>
  );
}

function CardLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 1]} intensity={0.8} />
      <pointLight position={[0, 0, 2]} color="#4a90e2" intensity={0.3} />
    </>
  );
}

export function Enhanced3DCard({ children, className = "", title }: Enhanced3DCardProps) {
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

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ height: '400px' }}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <CardLighting />
          <Environment preset="night" />
          
          <Card3DGeometry 
            mousePosition={mousePosition} 
            isHovered={isHovered}
          />
          
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.2} 
            scale={5} 
            blur={1} 
          />
        </Canvas>
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col">
        {title && (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {title}
            </h2>
          </motion.div>
        )}
        
        <motion.div
          className="flex-1 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * -2}deg) rotateY(${mousePosition.x * 2}deg)`,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {children}
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-2xl blur-xl -z-10"
          animate={{
            opacity: isHovered ? 0.6 : 0.2,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
