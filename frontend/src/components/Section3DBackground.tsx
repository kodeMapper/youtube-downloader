"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float,
  Sphere,
  RoundedBox,
  Stars,
  Sparkles,
  Environment
} from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

interface Section3DBackgroundProps {
  variant?: 'hero' | 'downloader' | 'features' | 'testimonials';
  intensity?: number;
}

function FloatingParticles({ variant, count = 15 }: { variant: string; count?: number }) {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30,
      ] as [number, number, number],
      scale: Math.random() * 0.8 + 0.2,
      color: variant === 'hero' 
        ? `hsl(${220 + Math.random() * 60}, 80%, 60%)`
        : variant === 'downloader'
        ? `hsl(${260 + Math.random() * 60}, 80%, 60%)`
        : variant === 'features'
        ? `hsl(${160 + Math.random() * 60}, 80%, 60%)`
        : `hsl(${300 + Math.random() * 60}, 80%, 60%)`,
      speed: Math.random() * 2 + 0.5,
      shape: Math.random() > 0.5 ? 'sphere' : 'box',
    })), [variant, count]
  );

  return (
    <>
      {particles.map((particle, i) => (
        <Float 
          key={i}
          speed={particle.speed}
          rotationIntensity={0.3}
          floatIntensity={0.4}
          position={particle.position}
        >
          {particle.shape === 'sphere' ? (
            <Sphere args={[particle.scale]} castShadow>
              <meshPhysicalMaterial
                color={particle.color}
                roughness={0.2}
                metalness={0.8}
                emissive={particle.color}
                emissiveIntensity={0.1}
                transmission={0.2}
                thickness={0.5}
                ior={1.5}
              />
            </Sphere>
          ) : (
            <RoundedBox args={[particle.scale, particle.scale, particle.scale]} radius={0.1}>
              <meshPhysicalMaterial
                color={particle.color}
                roughness={0.1}
                metalness={0.9}
                emissive={particle.color}
                emissiveIntensity={0.15}
                clearcoat={1}
                clearcoatRoughness={0.1}
              />
            </RoundedBox>
          )}
        </Float>
      ))}
    </>
  );
}

function BackgroundGeometry({ variant }: { variant: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.02;
    }
  });

  const getGeometryColor = () => {
    switch (variant) {
      case 'hero': return '#4a90e2';
      case 'downloader': return '#9333ea';
      case 'features': return '#10b981';
      default: return '#ec4899';
    }
  };

  return (
    <group ref={groupRef} position={[0, -8, -15]}>
      {/* Central geometric structure */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh castShadow>
          <icosahedronGeometry args={[3, 2]} />
          <meshPhysicalMaterial
            color={getGeometryColor()}
            roughness={0.1}
            metalness={0.8}
            emissive={getGeometryColor()}
            emissiveIntensity={0.2}
            transmission={0.3}
            thickness={2}
            ior={2.4}
          />
        </mesh>
      </Float>

      {/* Orbiting rings */}
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={0.8 + i * 0.2} rotationIntensity={0.2}>
          <mesh 
            position={[
              Math.cos((i / 3) * Math.PI * 2) * 6,
              Math.sin(i * 0.5) * 2,
              Math.sin((i / 3) * Math.PI * 2) * 6
            ]}
            rotation={[i * 0.3, i * 0.5, 0]}
            castShadow
          >
            <torusGeometry args={[2, 0.3, 16, 32]} />
            <meshPhysicalMaterial
              color={getGeometryColor()}
              roughness={0.05}
              metalness={0.95}
              wireframe={i % 2 === 0}
              emissive={getGeometryColor()}
              emissiveIntensity={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function Section3DBackground({ 
  variant = 'hero', 
  intensity = 1 
}: Section3DBackgroundProps) {
  const particleCount = Math.floor(15 * intensity);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 2, 20],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.1} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight 
          position={[-10, -10, -10]} 
          color={variant === 'hero' ? '#4a90e2' : variant === 'downloader' ? '#9333ea' : '#10b981'} 
          intensity={0.3} 
        />
        <pointLight 
          position={[10, 10, 10]} 
          color={variant === 'hero' ? '#e24a90' : variant === 'downloader' ? '#3b82f6' : '#f59e0b'} 
          intensity={0.3} 
        />

        {/* Scene elements */}
        <BackgroundGeometry variant={variant} />
        <FloatingParticles variant={variant} count={particleCount} />
        
        {/* Environment effects */}
        <Stars 
          radius={150} 
          depth={80} 
          count={variant === 'hero' ? 3000 : 1500} 
          factor={5} 
          saturation={0.9} 
          fade 
        />
        <Sparkles 
          count={variant === 'hero' ? 80 : 40} 
          scale={30} 
          size={3} 
          speed={0.2} 
          opacity={0.6}
        />
        
        <Environment preset="night" />

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.15} 
            luminanceSmoothing={0.9} 
            height={400} 
            intensity={intensity * 1.2}
          />
          <ChromaticAberration 
            offset={[0.001 * intensity, 0.001 * intensity]} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
