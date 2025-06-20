"use client";

import dynamic from 'next/dynamic';
import { useRef, useMemo } from 'react';

// Dynamically import Three.js components to avoid SSR issues
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Float })), { ssr: false });
const Environment = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Environment })), { ssr: false });
const Sparkles = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Sparkles })), { ssr: false });
const EffectComposer = dynamic(() => import('@react-three/postprocessing').then(mod => ({ default: mod.EffectComposer })), { ssr: false });
const Bloom = dynamic(() => import('@react-three/postprocessing').then(mod => ({ default: mod.Bloom })), { ssr: false });
const ChromaticAberration = dynamic(() => import('@react-three/postprocessing').then(mod => ({ default: mod.ChromaticAberration })), { ssr: false });
const Vignette = dynamic(() => import('@react-three/postprocessing').then(mod => ({ default: mod.Vignette })), { ssr: false });

let THREE: any;
if (typeof window !== 'undefined') {
  THREE = require('three');
}

interface CinematicBackgroundProps {
  sectionIndex: number;
}

function FloatingGeometry({ position, sectionIndex }: { position: [number, number, number], sectionIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  const geometry = useMemo(() => {
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
    ];
    return geometries[sectionIndex % geometries.length];
  }, [sectionIndex]);

  const color = useMemo(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];
    return colors[sectionIndex % colors.length];
  }, [sectionIndex]);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={meshRef} geometry={geometry} position={position}>
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function CameraController({ sectionIndex }: { sectionIndex: number }) {
  useFrame((state) => {
    const camera = state.camera;
    const targetPosition = [
      Math.sin(sectionIndex * 0.5) * 2,
      sectionIndex * 0.5,
      5 + sectionIndex * 0.3
    ];
    
    camera.position.lerp(new THREE.Vector3(...targetPosition), 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function ParticleField({ sectionIndex }: { sectionIndex: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
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
        color={sectionIndex % 2 === 0 ? "#3b82f6" : "#8b5cf6"}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ sectionIndex }: { sectionIndex: number }) {
  const lightColor = useMemo(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];
    return colors[sectionIndex % colors.length];
  }, [sectionIndex]);

  return (
    <>
      <CameraController sectionIndex={sectionIndex} />
      
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        color={lightColor}
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.6} 
        color={lightColor}
      />

      {/* Floating Geometries */}
      {Array.from({ length: 8 }, (_, i) => (
        <FloatingGeometry
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ]}
          sectionIndex={(sectionIndex + i) % 4}
        />
      ))}

      <ParticleField sectionIndex={sectionIndex} />

      <Sparkles
        count={100}
        scale={[20, 20, 20]}
        size={2}
        speed={0.4}
        opacity={0.6}
        color={lightColor}
      />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom 
          intensity={0.3} 
          luminanceThreshold={0.9} 
          luminanceSmoothing={0.025}
        />
        <ChromaticAberration 
          offset={[0.001, 0.001]} 
        />
        <Vignette 
          eskil={false} 
          offset={0.1} 
          darkness={0.5} 
        />
      </EffectComposer>
    </>
  );
}

export default function CinematicBackground({ sectionIndex }: CinematicBackgroundProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene sectionIndex={sectionIndex} />
      </Canvas>
    </div>
  );
}
