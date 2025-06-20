"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Orbital Planet Component
function OrbitalPlanet({ position, color, size = 1, speed = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed * 0.3) * 2;
      meshRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * speed * 0.3) * 2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

// Main 3D Background Scene
export default function DoraInspired3DBackground({ section = 0 }) {
  const planetColors = useMemo(() => [
    '#4ade80', // Section 0 - Green
    '#8b5cf6', // Section 1 - Purple  
    '#f59e0b', // Section 2 - Orange
  ], []);

  const currentColor = planetColors[section] || planetColors[0];

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color={currentColor} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

        {/* Stars */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

        {/* Orbital Planets */}
        <OrbitalPlanet position={[-8, 2, -5]} color={currentColor} size={0.8} speed={1.2} />
        <OrbitalPlanet position={[6, -3, -8]} color="#60a5fa" size={0.6} speed={0.8} />
        <OrbitalPlanet position={[4, 5, -6]} color="#f472b6" size={0.4} speed={1.5} />

        {/* Main central sphere */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
          <Sphere args={[1.5, 64, 64]} position={[0, 0, -10]}>
            <meshPhysicalMaterial
              color={currentColor}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.3}
              transmission={0.9}
              thickness={1}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
}
