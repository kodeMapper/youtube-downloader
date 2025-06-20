"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles as DreiSparkles } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';

// Enhanced rotating cube with Float from Drei
function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color="#6366f1" 
          transparent 
          opacity={0.6}
          emissive="#3730a3"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Add some sparkles around the cube */}
      <DreiSparkles 
        count={50}
        scale={3}
        size={2}
        speed={0.5}
        color="#fbbf24"
      />
    </Float>
  );
}

// Enhanced 3D Scene Background with PostProcessing
export function Simple3DBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Environment preset="night" />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        <FloatingCube />
        
        {/* PostProcessing Effects */}
        <EffectComposer>
          <Bloom 
            intensity={0.5}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.025}
            blendFunction={BlendFunction.SCREEN}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.001, 0.001] as [number, number]}
          />
          <Vignette
            offset={0.5}
            darkness={0.3}
            blendFunction={BlendFunction.MULTIPLY}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
