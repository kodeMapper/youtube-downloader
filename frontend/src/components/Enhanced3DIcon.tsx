"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface Floating3DIconProps {
  icon: React.ComponentType<any>;
  position?: [number, number, number];
  color?: string;
  size?: number;
  className?: string;
}

function Icon3DGeometry({ 
  color = "#4a90e2", 
  size = 1 
}: { 
  color: string; 
  size: number; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      // Pulsing effect
      const scale = size + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.1}
        metalness={0.9}
        clearcoat={1}
        clearcoatRoughness={0}
        emissive={new THREE.Color(color).multiplyScalar(0.1)}
      />
    </mesh>
  );
}

export function Floating3DIcon({ 
  icon: Icon, 
  position = [0, 0, 0], 
  color = "#4a90e2", 
  size = 1,
  className = ""
}: Floating3DIconProps) {
  return (
    <div className={`w-16 h-16 ${className}`}>
      <div className="relative w-full h-full">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[2, 2, 2]} intensity={1} />
            <Environment preset="studio" />
            
            <Float
              speed={2}
              rotationIntensity={0.3}
              floatIntensity={0.5}
              position={position}
            >
              <Icon3DGeometry color={color} size={size} />
            </Float>
          </Canvas>
        </div>
        
        {/* Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-white z-10">
          <Icon className="w-8 h-8 drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}
