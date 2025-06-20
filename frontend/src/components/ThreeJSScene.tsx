"use client";

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

interface ThreeJSSceneProps {
  sectionIndex: number;
}

function FloatingGeometry({ position, sectionIndex }: { position: [number, number, number], sectionIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    
    // Change geometry based on section
    const scale = 1 + Math.sin(state.clock.elapsedTime + sectionIndex) * 0.3;
    meshRef.current.scale.setScalar(scale);
    
    // Dynamic positioning
    meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5 + sectionIndex) * 2;
    meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.7 + sectionIndex) * 1;
  });

  const getGeometry = () => {
    switch (sectionIndex % 4) {
      case 0: return <icosahedronGeometry args={[1, 1]} />;
      case 1: return <octahedronGeometry args={[1.2, 0]} />;
      case 2: return <tetrahedronGeometry args={[1.1, 0]} />;
      default: return <dodecahedronGeometry args={[1, 0]} />;
    }
  };

  const getMaterial = () => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'
    ];
    return (
      <meshStandardMaterial 
        color={colors[sectionIndex % colors.length]}
        emissive={colors[sectionIndex % colors.length]}
        emissiveIntensity={0.2}
        metalness={0.8}
        roughness={0.2}
      />
    );
  };

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        {getGeometry()}
        {getMaterial()}
      </mesh>
    </Float>
  );
}

function ParticleField({ sectionIndex }: { sectionIndex: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CameraController({ sectionIndex }: { sectionIndex: number }) {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Dynamic camera movement based on section
    state.camera.position.x = Math.sin(t * 0.1 + sectionIndex) * 5;
    state.camera.position.y = Math.cos(t * 0.15 + sectionIndex) * 3;
    state.camera.position.z = 10 + Math.sin(t * 0.05) * 2;
    
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function ThreeJSScene({ sectionIndex }: ThreeJSSceneProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <FallbackBackground />;
  }

  return <ClientSideScene sectionIndex={sectionIndex} />;
}

// Fallback static background
function FallbackBackground() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-50 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
    </div>
  );
}

// Client-only Three.js scene
function ClientSideScene({ sectionIndex }: ThreeJSSceneProps) {
  try {

  const geometryPositions: [number, number, number][] = [
    [-8, 4, -5],
    [8, -2, -8],
    [-5, -6, -3],
    [6, 6, -10],
    [0, -8, -6],
    [-10, 2, -4],
    [4, 8, -7],
    [-6, -4, -9]
  ];
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <CameraController sectionIndex={sectionIndex} />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
        <spotLight 
          position={[0, 20, 0]} 
          angle={0.3} 
          penumbra={1} 
          intensity={0.8} 
          color="#ec4899" 
          castShadow
        />

        {/* Floating Geometries */}
        {geometryPositions.map((pos, index) => (
          <FloatingGeometry 
            key={index} 
            position={pos} 
            sectionIndex={sectionIndex + index} 
          />
        ))}

        {/* Particle Field */}
        <ParticleField sectionIndex={sectionIndex} />

        {/* Environment and Effects */}
        <Environment preset="night" />
        <Sparkles 
          count={100} 
          scale={[20, 20, 20]} 
          size={2} 
          speed={0.5}
          color="#ffffff"
        />

        {/* Post-processing Effects */}
        <EffectComposer>
          <Bloom 
            intensity={0.3} 
            luminanceThreshold={0.9} 
            luminanceSmoothing={0.9}
          />
          <ChromaticAberration 
            offset={[0.002, 0.002]} 
          />          <Vignette 
            eskil={false} 
            offset={0.1} 
            darkness={0.5} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
  } catch (error) {
    console.error("Error rendering ThreeJS scene:", error);    return <FallbackBackground />;
  }
}
