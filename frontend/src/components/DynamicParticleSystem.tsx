"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface InteractiveParticleSystemProps {
  intensity?: number;
  color?: string;
  count?: number;
}

function InteractiveParticles({ 
  intensity = 1, 
  color = '#4a90e2', 
  count = 100 
}: InteractiveParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  
  // Generate particle data
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const mouse = mouseRef.current;

    particles.forEach((particle, i) => {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3(...particle.position);
      
      // Add floating movement
      position.x += Math.sin(time * particle.speed + particle.phase) * 0.5;
      position.y += Math.cos(time * particle.speed + particle.phase) * 0.3;
      position.z += Math.sin(time * particle.speed * 0.5 + particle.phase) * 0.2;
      
      // Mouse interaction - particles are attracted to mouse
      const mouseInfluence = new THREE.Vector3(
        mouse.x * viewport.width * 0.5,
        mouse.y * viewport.height * 0.5,
        0
      );
      
      const direction = mouseInfluence.clone().sub(position);
      const distance = direction.length();
      
      if (distance < 10) {
        direction.normalize();
        position.add(direction.multiplyScalar(0.1 * intensity));
      }
      
      // Scale based on mouse proximity for interactive effect
      const proximityScale = Math.max(0.1, Math.min(1, 10 / (distance + 1)));
      const scale = particle.scale * (1 + proximityScale * 0.5) * intensity;
      
      matrix.compose(
        position,
        new THREE.Quaternion().setFromEuler(new THREE.Euler(time + i, time * 0.5 + i, 0)),
        new THREE.Vector3(scale, scale, scale)
      );
      
      meshRef.current!.setMatrixAt(i, matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2 * intensity}
        transparent
        opacity={0.8}
        roughness={0.2}
        metalness={0.8}
      />
    </instancedMesh>
  );
}

function FloatingGeometry({ intensity }: { intensity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1 * intensity;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 5 }, (_, i) => (
        <Float 
          key={i}
          speed={1 + i * 0.2} 
          rotationIntensity={0.2 * intensity} 
          floatIntensity={0.3 * intensity}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 15,
            Math.sin(i * 0.8) * 5,
            Math.sin((i / 5) * Math.PI * 2) * 15
          ]}
        >
          <mesh>
            <icosahedronGeometry args={[1, 1]} />
            <meshPhysicalMaterial
              color={`hsl(${(i * 72) % 360}, 70%, 60%)`}
              roughness={0.1}
              metalness={0.9}
              emissive={`hsl(${(i * 72) % 360}, 70%, 30%)`}
              emissiveIntensity={0.2 * intensity}
              transmission={0.1}
              thickness={1}
              ior={1.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function DynamicParticleSystem({ 
  intensity = 1, 
  color = '#4a90e2', 
  count = 80 
}: InteractiveParticleSystemProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsInteracting(true);
      const timer = setTimeout(() => setIsInteracting(false), 2000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={0.3} />
        <pointLight position={[-10, -10, -10]} color={color} intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#e24a90" intensity={0.2} />

        {/* Interactive particles */}
        <InteractiveParticles 
          intensity={isInteracting ? intensity * 1.5 : intensity} 
          color={color} 
          count={count} 
        />
        
        {/* Floating geometry */}
        <FloatingGeometry intensity={intensity} />
        
        {/* Environmental effects */}
        <Stars 
          radius={100} 
          depth={50} 
          count={isInteracting ? 3000 : 2000} 
          factor={4} 
          saturation={0.8} 
          fade 
        />
        <Sparkles 
          count={isInteracting ? 100 : 50} 
          scale={25} 
          size={2} 
          speed={0.2} 
          opacity={0.6}
        />

        {/* Enhanced post-processing */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.9} 
            height={400} 
            intensity={isInteracting ? intensity * 2 : intensity * 1.2}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
