"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingCube({ position, color, delay }: { position: [number, number, number], color: string, delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.rotation.x = time * 0.3;
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.5;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        wireframe
      />
    </mesh>
  );
}

export function Simple3DElements() {
  const elements = [
    { position: [-8, 2, -5] as [number, number, number], color: "#3b82f6", delay: 0 },
    { position: [8, -2, -3] as [number, number, number], color: "#8b5cf6", delay: 1 },
    { position: [-6, -3, -7] as [number, number, number], color: "#ec4899", delay: 2 },
    { position: [6, 3, -4] as [number, number, number], color: "#10b981", delay: 3 },
    { position: [0, 4, -6] as [number, number, number], color: "#f59e0b", delay: 4 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        {elements.map((element, index) => (
          <FloatingCube
            key={index}
            position={element.position}
            color={element.color}
            delay={element.delay}
          />
        ))}
      </Canvas>
    </div>
  );
}
