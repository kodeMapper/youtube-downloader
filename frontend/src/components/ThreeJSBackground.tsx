"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Create particle positions
  const particleCount = 1000;
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  // Create particle colors
  const colors = useMemo(() => {
    const colors = new Float32Array(particleCount * 3);
    const colorPalette = [
      new THREE.Color('#3b82f6'), // blue
      new THREE.Color('#8b5cf6'), // purple
      new THREE.Color('#ec4899'), // pink
      new THREE.Color('#10b981'), // green
      new THREE.Color('#f59e0b'), // yellow
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return colors;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the entire particle field
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;

      // Mouse interaction
      const { mouse } = state;
      mousePosition.current.x = mouse.x * 2;
      mousePosition.current.y = mouse.y * 2;

      // Update particle positions for wave effect
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Create wave effect
        positions[i3 + 1] = y + Math.sin(time + x * 0.1) * 0.01;
        positions[i3 + 2] = z + Math.cos(time + y * 0.1) * 0.01;
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
      meshRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

function WaveGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && meshRef.current.geometry) {
      const time = state.clock.elapsedTime;
      const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x * 0.3 + time) * Math.cos(y * 0.3 + time) * 0.5;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -10]}>
      <planeGeometry args={[20, 20, 50, 50]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.1}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function ThreeJSBackground() {
  return (
    <div className="fixed inset-0 -z-50">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ParticleField />
        <FloatingGeometry />
        <WaveGeometry />
        
        {/* Multiple floating geometries */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i * 2) * 8,
              Math.cos(i * 2) * 4,
              -15 + i * 2
            ]}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial
              color={`hsl(${i * 60}, 70%, 60%)`}
              transparent
              opacity={0.2}
              wireframe
            />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
}
