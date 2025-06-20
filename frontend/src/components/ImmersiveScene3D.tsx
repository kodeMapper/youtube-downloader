"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Float,
  Sphere,
  Box,
  RoundedBox,
  Html,
  useTexture,
  MeshDistortMaterial,
  Text,
  Stars,
  Sparkles,
  Clouds,
  Effects
} from '@react-three/drei';
import { useRef, useState, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Immersive 3D Background Scene
function FloatingPlatform() {
  const meshRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      innerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, -2, -5]}>
      {/* Main floating platform with complex geometry */}
      <RoundedBox args={[14, 1, 10]} radius={0.4} smoothness={6} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0f1419"
          roughness={0.05}
          metalness={0.95}
          clearcoat={1}
          clearcoatRoughness={0.01}
          transmission={0.05}
          thickness={0.8}
          ior={1.8}
          reflectivity={0.9}
        />
      </RoundedBox>
      
      {/* Inner rotating core */}
      <mesh ref={innerRef} position={[0, 0.3, 0]} castShadow>
        <icosahedronGeometry args={[2, 2]} />
        <meshPhysicalMaterial
          color="#4a90e2"
          roughness={0.1}
          metalness={0.8}
          emissive="#4a90e2"
          emissiveIntensity={0.3}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={0.2}
          thickness={1}
          ior={2.4}
        />
      </mesh>
        {/* Glowing energy rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.2 + i * 0.15, 0]} rotation={[0, i * Math.PI / 3, 0]}>
          <torusGeometry args={[3.5 + i * 0.7, 0.15, 8, 32]} />
          <meshBasicMaterial
            color={`hsl(${200 + i * 40}, 90%, 70%)`}
            transparent
            opacity={0.9 - i * 0.2}
          />
        </mesh>
      ))}
      
      {/* Glowing edges */}
      <RoundedBox args={[14.4, 0.15, 10.4]} radius={0.4} smoothness={6} position={[0, 0.58, 0]}>
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.9}
        />
      </RoundedBox>
        {/* Corner energy nodes */}
      {[
        [-6, 0.8, -4] as [number, number, number], 
        [6, 0.8, -4] as [number, number, number], 
        [-6, 0.8, 4] as [number, number, number], 
        [6, 0.8, 4] as [number, number, number]
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshPhysicalMaterial
            color="#e24a90"
            emissive="#e24a90"
            emissiveIntensity={0.5}
            roughness={0}
            metalness={1}
            clearcoat={1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Interactive floating elements around the scene
function FloatingGeometry() {
  const elements = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        Math.random() * 12 + 2,
        (Math.random() - 0.5) * 25,
      ] as [number, number, number],
      scale: Math.random() * 1.2 + 0.3,
      color: `hsl(${180 + Math.random() * 120}, 80%, ${40 + Math.random() * 40}%)`,
      shape: Math.random() > 0.7 ? 'sphere' : Math.random() > 0.5 ? 'box' : Math.random() > 0.3 ? 'torus' : Math.random() > 0.1 ? 'octahedron' : 'icosahedron',
      rotationSpeed: (Math.random() - 0.5) * 3,
      metalness: Math.random(),
      roughness: Math.random() * 0.4,
    })), []
  );

  return (
    <>
      {elements.map((element, i) => (
        <Float 
          key={i}
          speed={0.8 + Math.random() * 2.5}
          rotationIntensity={0.2 + Math.random() * 0.6}
          floatIntensity={0.2 + Math.random() * 0.6}
          position={element.position}
        >
          {element.shape === 'sphere' ? (
            <Sphere args={[element.scale]} castShadow receiveShadow>
              <meshPhysicalMaterial
                color={element.color}
                roughness={element.roughness}
                metalness={element.metalness}
                clearcoat={1}
                clearcoatRoughness={0.1}
                emissive={element.color}
                emissiveIntensity={0.15}
                transmission={0.1}
                thickness={0.5}
                ior={1.5}
              />
            </Sphere>
          ) : element.shape === 'box' ? (
            <Box args={[element.scale, element.scale, element.scale]} castShadow receiveShadow>
              <MeshDistortMaterial
                color={element.color}
                distort={0.4}
                speed={1.5}
                roughness={element.roughness}
                metalness={element.metalness}
                emissive={element.color}
                emissiveIntensity={0.1}
              />
            </Box>
          ) : element.shape === 'torus' ? (
            <mesh castShadow receiveShadow>
              <torusGeometry args={[element.scale, element.scale * 0.4, 16, 32]} />
              <meshPhysicalMaterial
                color={element.color}
                roughness={element.roughness}
                metalness={element.metalness}
                wireframe={Math.random() > 0.7}
                emissive={element.color}
                emissiveIntensity={0.1}
                clearcoat={0.8}
                clearcoatRoughness={0.2}
              />
            </mesh>
          ) : element.shape === 'octahedron' ? (
            <mesh castShadow receiveShadow>
              <octahedronGeometry args={[element.scale]} />
              <meshPhysicalMaterial
                color={element.color}
                roughness={element.roughness}
                metalness={element.metalness}
                emissive={element.color}
                emissiveIntensity={0.2}
                transmission={0.3}
                thickness={1}
                ior={2.4}
              />
            </mesh>
          ) : (
            <mesh castShadow receiveShadow>
              <icosahedronGeometry args={[element.scale, 1]} />
              <meshPhysicalMaterial
                color={element.color}
                roughness={element.roughness}
                metalness={element.metalness}
                emissive={element.color}
                emissiveIntensity={0.12}
                clearcoat={1}
                clearcoatRoughness={0}
                wireframe={Math.random() > 0.8}
              />
            </mesh>
          )}
        </Float>
      ))}
    </>
  );
}

// Advanced particle system
function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 5000;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Create a more distributed particle field
      const x = (Math.random() - 0.5) * 50;
      const y = Math.random() * 25;
      const z = (Math.random() - 0.5) * 50;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Enhanced color based on position for depth
      const hue = 180 + (y / 25) * 120 + Math.sin(x * 0.1) * 30;
      const saturation = 0.8 + Math.random() * 0.2;
      const lightness = 0.4 + Math.random() * 0.4 + (y / 25) * 0.3;
      const color = new THREE.Color().setHSL(hue / 360, saturation, lightness);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        
        // Wave motion
        positions[i3 + 1] += Math.sin(time * 0.5 + x * 0.01 + z * 0.01) * 0.002;
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
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Dynamic lighting system
function DynamicLighting() {
  const lightRef = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);
  const light3Ref = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (lightRef.current && light2Ref.current && light3Ref.current) {
      const time = state.clock.elapsedTime;
      
      // Complex moving lights with different patterns
      lightRef.current.position.x = Math.sin(time * 0.5) * 12;
      lightRef.current.position.z = Math.cos(time * 0.5) * 12;
      lightRef.current.position.y = 5 + Math.sin(time * 0.8) * 2;
      
      light2Ref.current.position.x = Math.cos(time * 0.3) * 10;
      light2Ref.current.position.z = Math.sin(time * 0.3) * 10;
      light2Ref.current.position.y = 3 + Math.cos(time * 0.6) * 1.5;
      
      light3Ref.current.position.x = Math.sin(time * 0.7) * 8;
      light3Ref.current.position.z = Math.cos(time * 0.4) * 8;
      light3Ref.current.position.y = 4 + Math.sin(time * 1.2) * 1;
      
      // Dynamic intensity and color changes
      lightRef.current.intensity = 1.2 + Math.sin(time * 2) * 0.4;
      light2Ref.current.intensity = 0.9 + Math.cos(time * 1.5) * 0.3;
      light3Ref.current.intensity = 0.7 + Math.sin(time * 1.8) * 0.2;
      
      // Color transitions
      const hue1 = (time * 10) % 360;
      const hue2 = (time * 15 + 120) % 360;
      const hue3 = (time * 8 + 240) % 360;
      
      lightRef.current.color.setHSL(hue1 / 360, 0.8, 0.6);
      light2Ref.current.color.setHSL(hue2 / 360, 0.7, 0.5);
      light3Ref.current.color.setHSL(hue3 / 360, 0.9, 0.4);
      
      // Moving spotlight
      if (spotRef.current) {
        spotRef.current.position.x = Math.sin(time * 0.4) * 5;
        spotRef.current.position.z = Math.cos(time * 0.4) * 5;
        spotRef.current.target.position.x = Math.sin(time * 0.6) * 3;
        spotRef.current.target.position.z = Math.cos(time * 0.6) * 3;
      }
    }
  });

  return (
    <>      {/* Enhanced ambient lighting */}
      <ambientLight intensity={0.3} color="#2a2a5e" />
      
      {/* Main directional light */}
      <directionalLight 
        position={[15, 20, 10]} 
        intensity={2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0001}
      />
        {/* Dynamic colored point lights */}
      <pointLight 
        ref={lightRef}
        position={[0, 5, 0]} 
        color="#4a90e2" 
        intensity={2.5}
        distance={30}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight 
        ref={light2Ref}
        position={[0, 3, -5]} 
        color="#e24a90" 
        intensity={2.0}
        distance={25}
        decay={2}
        castShadow
      />
      <pointLight 
        ref={light3Ref}
        position={[5, 4, 5]} 
        color="#90e24a" 
        intensity={1.8}
        distance={22}
        decay={2}
      />
      
      {/* Dynamic spotlight */}
      <spotLight 
        ref={spotRef}
        position={[0, 15, 0]} 
        angle={0.4} 
        penumbra={0.5}
        intensity={1.5}
        color="#ffffff"
        distance={30}
        decay={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
        {/* Rim lighting */}
      <directionalLight 
        position={[-10, 5, -10]} 
        intensity={0.8}
        color="#4a90e2"
      />
      <directionalLight 
        position={[10, 5, 10]} 
        intensity={0.6}
        color="#e24a90"
      />
    </>
  );
}

// Camera controller for cinematic movement
function CinematicCamera() {
  const { camera } = useThree();
    useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Complex orbital motion with multiple sine/cosine waves
    const radius = 8;
    const heightOffset = 2;
    
    // Primary orbital motion
    const primaryAngle = time * 0.05;
    const primaryX = Math.cos(primaryAngle) * radius;
    const primaryZ = Math.sin(primaryAngle) * radius;
    
    // Secondary oscillation for more complex movement
    const secondaryOffset = Math.sin(time * 0.15) * 2;
    const heightVariation = Math.sin(time * 0.08) * 1.5;
    
    // Tertiary micro-movements for organic feel
    const microX = Math.sin(time * 0.3) * 0.5;
    const microY = Math.cos(time * 0.25) * 0.3;
    const microZ = Math.sin(time * 0.4) * 0.4;
    
    // Apply complex position
    camera.position.x = primaryX + secondaryOffset + microX;
    camera.position.y = heightOffset + heightVariation + microY;
    camera.position.z = primaryZ + microZ;
    
    // Dynamic target tracking with smooth interpolation
    const targetX = Math.sin(time * 0.1) * 1;
    const targetY = Math.cos(time * 0.12) * 0.5;
    const targetZ = Math.sin(time * 0.08) * 0.8;
    
    // Smooth camera look-at with easing
    const lookAtTarget = new THREE.Vector3(targetX, targetY, targetZ);
    camera.lookAt(lookAtTarget);
    
    // Optional: Subtle camera roll for dynamic feel
    camera.rotation.z = Math.sin(time * 0.06) * 0.02;
  });

  return null;
}

interface ImmersiveScene3DProps {
  children?: React.ReactNode;
}

export function ImmersiveScene3D({ children }: ImmersiveScene3DProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 70 }}
        shadows        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
        }}
      >
        <Suspense fallback={null}>
          {/* Advanced Environment */}
          <Environment preset="night" />
          <Stars 
            radius={100} 
            depth={50} 
            count={2000} 
            factor={4} 
            saturation={0.8} 
            fade 
          />          <Sparkles 
            count={200} 
            scale={25} 
            size={4} 
            speed={0.6} 
          />
          
          {/* Enhanced Lighting System */}
          <DynamicLighting />
            {/* 3D Scene Elements */}
          <FloatingPlatform />
          <FloatingGeometry />
          <ParticleField />
          <SceneMorpher />
          
          {/* Interactive Elements */}
          {children}
          
          {/* Ground shadows */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.8} 
            scale={30} 
            blur={2.5} 
            far={4} 
            color="#4a90e2"
          />
          
          {/* Camera Animation */}
          <CinematicCamera />
            {/* Post-processing Effects */}
          <EffectComposer multisampling={8}>
            <Bloom 
              intensity={1.2} 
              kernelSize={4} 
              luminanceThreshold={0.3} 
              luminanceSmoothing={0.9} 
            />
            <ChromaticAberration 
              blendFunction={BlendFunction.NORMAL}
              offset={[0.001, 0.002]} 
            />
            <Vignette 
              offset={0.05} 
              darkness={0.4} 
              eskil={false} 
              blendFunction={BlendFunction.NORMAL} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

// Scene morphing system for smooth transitions
function SceneMorpher() {
  const [sceneState, setSceneState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      // Scene morphs based on state
      switch (sceneState) {
        case 'idle':
          // Calm, gentle movement
          groupRef.current.rotation.y = time * 0.1;
          groupRef.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.02);
          break;
          
        case 'processing':
          // More energetic, faster movement
          groupRef.current.rotation.y = time * 0.3;
          groupRef.current.rotation.x = Math.sin(time * 2) * 0.1;
          groupRef.current.scale.setScalar(1.1 + Math.sin(time * 4) * 0.05);
          break;
          
        case 'success':
          // Triumphant expansion
          groupRef.current.rotation.y = time * 0.2;
          groupRef.current.scale.setScalar(1.2 + Math.sin(time * 6) * 0.1);
          break;
          
        case 'error':
          // Agitated, shaking movement
          groupRef.current.rotation.y = time * 0.15 + Math.sin(time * 8) * 0.02;
          groupRef.current.position.x = Math.sin(time * 10) * 0.1;
          groupRef.current.scale.setScalar(0.9 + Math.sin(time * 12) * 0.03);
          break;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Morphing geometry elements */}
      {Array.from({ length: 8 }, (_, i) => (
        <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.4} floatIntensity={0.2}>
          <mesh 
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 4,
              Math.sin(i * 0.8) * 2,
              Math.sin((i / 8) * Math.PI * 2) * 4
            ]}
            castShadow
          >
            <dodecahedronGeometry args={[0.3 + Math.sin(i) * 0.1]} />
            <meshPhysicalMaterial
              color={`hsl(${(i * 45) % 360}, 70%, 60%)`}
              roughness={0.1}
              metalness={0.8}
              emissive={`hsl(${(i * 45) % 360}, 70%, 30%)`}
              emissiveIntensity={sceneState === 'processing' ? 0.3 : 0.1}
              transmission={sceneState === 'success' ? 0.3 : 0}
              thickness={1}
              ior={1.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
