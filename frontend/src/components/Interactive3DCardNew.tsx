"use client";

import { useRef, useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Three.js components to avoid SSR issues
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Float })), { ssr: false });
const Environment = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Environment })), { ssr: false });
const RoundedBox = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.RoundedBox })), { ssr: false });

interface Interactive3DCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

const Card3DFallback = ({ title, description, icon }: Interactive3DCardProps) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
  </div>
);

function Card3DContent({ title, description, icon }: Interactive3DCardProps) {
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  // Dynamically import useFrame to avoid SSR issues
  const useFrame = require('@react-three/fiber').useFrame;

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
        <RoundedBox
          ref={meshRef}
          args={[2, 2.5, 0.3]}
          radius={0.1}
          smoothness={4}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={hovered ? '#8b5cf6' : '#6366f1'}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </RoundedBox>
      </Float>
      <Environment preset="city" />
    </group>
  );
}

export default function Interactive3DCard({ title, description, icon, delay = 0, className = '' }: Interactive3DCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || hasError) {
    return <Card3DFallback title={title} description={description} icon={icon} />;
  }
  
  return <ClientSideCard 
    title={title} 
    description={description} 
    icon={icon} 
    delay={delay} 
    className={className} 
    onError={() => setHasError(true)}
    onHoverChange={setIsHovered}
    isHovered={isHovered}
  />;
}

function ClientSideCard({ 
  title, 
  description, 
  icon, 
  delay = 0, 
  className = '', 
  onError, 
  onHoverChange, 
  isHovered 
}: 
  Interactive3DCardProps & { 
    onError?: () => void;
    onHoverChange?: (hover: boolean) => void;
    isHovered?: boolean;
  }) {
  try {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`group relative ${className}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {/* 3D Canvas */}
      <div className="h-64 w-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg border border-white/20">
        <Suspense fallback={<Card3DFallback title={title} description={description} icon={icon} />}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Card3DContent title={title} description={description} icon={icon} />
          </Canvas>
        </Suspense>
      </div>

      {/* Content Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex flex-col justify-end p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </motion.div>

      {/* Bottom Card Info */}      <div className="mt-4 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </motion.div>
  );
  } catch (error) {
    console.error("Error rendering 3D card:", error);
    onError?.();
    return <Card3DFallback title={title} description={description} icon={icon} />;
  }
}
