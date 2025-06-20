"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float,
  RoundedBox,
  Stars,
  Sparkles
} from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Simplified floating platform
function FloatingPlatform() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={[0, -2, -5]}>
      {/* Main platform */}
      <RoundedBox args={[14, 1, 10]} radius={0.4} smoothness={6} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0f1419"
          roughness={0.05}
          metalness={0.95}
          clearcoat={1}
        />
      </RoundedBox>
      
      {/* Center core */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshPhysicalMaterial
          color="#4a90e2"
          roughness={0.1}
          metalness={0.8}
          emissive="#4a90e2"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Simple energy rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.2 + i * 0.15, 0]} rotation={[0, i * Math.PI / 3, 0]}>
          <torusGeometry args={[3 + i * 0.5, 0.1, 8, 32]} />
          <meshBasicMaterial
            color={`hsl(${200 + i * 40}, 90%, 70%)`}
            transparent
            opacity={0.8 - i * 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// Simplified floating elements
function SimpleFloatingElements() {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <Float 
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.2}
          floatIntensity={0.3}
          position={[
            (Math.random() - 0.5) * 20,
            Math.random() * 8 + 2,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <mesh castShadow>
            <sphereGeometry args={[0.3 + Math.random() * 0.5]} />
            <meshPhysicalMaterial
              color={`hsl(${i * 45}, 80%, 60%)`}
              roughness={0.2}
              metalness={0.8}
              emissive={`hsl(${i * 45}, 80%, 30%)`}
              emissiveIntensity={0.1}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Main stable scene component
interface StableImmersiveSceneProps {
  children?: React.ReactNode;
}

export function StableImmersiveScene({ children }: StableImmersiveSceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        shadows
        camera={{
          position: [0, 5, 15],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} color="#4a90e2" intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#e24a90" intensity={0.5} />

          {/* Scene elements */}
          <FloatingPlatform />
          <SimpleFloatingElements />
          
          {/* Environment and effects */}
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.8} fade />
          <Sparkles count={50} scale={20} size={2} speed={0.3} />
          <Environment preset="night" />
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            autoRotate
            autoRotateSpeed={0.2}
          />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={300} 
              intensity={1.5}
            />
            <ChromaticAberration 
              offset={[0.0015, 0.0015]} 
              blendFunction={BlendFunction.NORMAL} 
            />
            <Vignette 
              offset={0.3} 
              darkness={0.4} 
              blendFunction={BlendFunction.NORMAL} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      
      {/* Render children on top */}
      {children}
    </div>
  );
}
