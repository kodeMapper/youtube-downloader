"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Text, 
  MeshDistortMaterial,
  Float,
  Sphere,
  Box,
  RoundedBox,
  Html,
  PerspectiveCamera
} from '@react-three/drei';
import { useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

// Main floating island/platform
function MainPlatform() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main platform */}
      <RoundedBox args={[8, 0.5, 6]} radius={0.2} smoothness={4} position={[0, -1, 0]}>
        <MeshDistortMaterial
          color="#1a1a2e"
          attach="material"
          distort={0.1}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>
      
      {/* Glass overlay */}
      <RoundedBox args={[8.2, 0.1, 6.2]} radius={0.2} smoothness={4} position={[0, -0.7, 0]}>
        <meshPhysicalMaterial
          color="#4a90e2"
          transparent
          opacity={0.2}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.5}
        />
      </RoundedBox>
    </group>
  );
}

// Interactive floating elements
function FloatingElements() {
  const elements = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 15,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 15,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.3,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      shape: Math.random() > 0.5 ? 'sphere' : 'box',
    }));
  }, []);

  return (
    <>
      {elements.map((element) => (
        <Float 
          key={element.id}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.5}
          position={element.position}
        >
          {element.shape === 'sphere' ? (
            <Sphere args={[element.scale]}>
              <meshPhysicalMaterial
                color={element.color}
                roughness={0.1}
                metalness={0.9}
                clearcoat={1}
                clearcoatRoughness={0}
              />
            </Sphere>
          ) : (
            <Box args={[element.scale, element.scale, element.scale]}>
              <MeshDistortMaterial
                color={element.color}
                distort={0.2}
                speed={3}
                roughness={0.2}
                metalness={0.7}
              />
            </Box>
          )}
        </Float>
      ))}
    </>
  );
}

// Dynamic particle system
function DynamicParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2000;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  const colors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return colors;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + x * 0.01 + z * 0.01) * 0.002;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Interactive UI element
function Interactive3DUI({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(hovered ? 1.05 : 1);
    }
  });

  return (
    <group 
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main UI container */}
      <RoundedBox args={[6, 4, 0.2]} radius={0.1} smoothness={4}>
        <meshPhysicalMaterial
          color="#1e1e2e"
          transparent
          opacity={0.9}
          roughness={0.1}
          metalness={0.2}
          transmission={0.1}
          thickness={0.5}
        />
      </RoundedBox>
      
      {/* Glow effect */}
      <RoundedBox args={[6.2, 4.2, 0.1]} radius={0.1} smoothness={4} position={[0, 0, -0.05]}>
        <meshBasicMaterial
          color={hovered ? "#4a90e2" : "#2a2a3e"}
          transparent
          opacity={0.3}
        />
      </RoundedBox>
      
      {/* HTML content overlay */}
      <Html
        transform
        occlude
        position={[0, 0, 0.11]}
        style={{
          width: '400px',
          height: '300px',
          pointerEvents: 'auto',
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </Html>
    </group>
  );
}

// Camera controller for cinematic movement
function CameraController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.position.z = 8 + Math.cos(time * 0.1) * 2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Lighting setup
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} castShadow />
      <pointLight position={[-10, 0, -5]} color="#4a90e2" intensity={0.5} />
      <pointLight position={[10, 0, -5]} color="#e24a90" intensity={0.5} />
    </>
  );
}

interface DoraInspired3DSceneProps {
  children?: React.ReactNode;
}

export function DoraInspired3DScene({ children }: DoraInspired3DSceneProps) {
  return (
    <div className="fixed inset-0 -z-50">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Environment and lighting */}
          <Environment preset="night" />
          <SceneLighting />
          
          {/* Scene elements */}
          <MainPlatform />
          <FloatingElements />
          <DynamicParticles />
          
          {/* Interactive UI */}
          {children && (
            <Interactive3DUI>
              {children}
            </Interactive3DUI>
          )}
          
          {/* Effects */}
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={1.5} 
          />
            {/* Post-processing effects */}
          <EffectComposer>
            <Bloom intensity={0.5} />
            <ChromaticAberration offset={[0.0005, 0.0005]} />
          </EffectComposer>
          
          {/* Camera animation */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
