"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function LoadingGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    
    sphereRefs.current.forEach((sphere, i) => {
      if (sphere) {
        sphere.position.y = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.5;
        sphere.rotation.y = state.clock.elapsedTime * (1 + i * 0.1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, i) => (
        <Float key={i} speed={2 + i * 0.2} rotationIntensity={0.3} floatIntensity={0.2}>
          <mesh
            ref={(el) => el && (sphereRefs.current[i] = el)}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 3,
              0,
              Math.sin((i / 8) * Math.PI * 2) * 3
            ]}
          >
            <Sphere args={[0.3]}>
              <meshPhysicalMaterial
                color={`hsl(${(i * 45) % 360}, 80%, 60%)`}
                roughness={0.1}
                metalness={0.8}
                emissive={`hsl(${(i * 45) % 360}, 80%, 30%)`}
                emissiveIntensity={0.3}
                transmission={0.2}
                thickness={1}
                ior={1.5}
              />
            </Sphere>
          </mesh>
        </Float>
      ))}
    </group>
  );
}

interface PremiumLoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

export function PremiumLoadingScreen({ isLoading, onLoadingComplete }: PremiumLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing');

  const stages = [
    'Initializing 3D Engine...',
    'Loading Immersive Components...',
    'Preparing Interactive Elements...',
    'Optimizing Performance...',
    'Ready to Experience!'
  ];

  useEffect(() => {
    if (!isLoading) return;

    let currentProgress = 0;
    let stageIndex = 0;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStage('Ready to Experience!');
        
        setTimeout(() => {
          onLoadingComplete();
        }, 800);
        
        clearInterval(interval);
        return;
      }

      setProgress(currentProgress);
      
      // Update stage based on progress
      const newStageIndex = Math.floor((currentProgress / 100) * (stages.length - 1));
      if (newStageIndex !== stageIndex && newStageIndex < stages.length) {
        stageIndex = newStageIndex;
        setStage(stages[stageIndex]);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isLoading, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center"
        >
          {/* 3D Background */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 10], fov: 60 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.2} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} color="#4a90e2" intensity={0.5} />
              <pointLight position={[10, 10, 10]} color="#e24a90" intensity={0.5} />
              
              <LoadingGeometry />
            </Canvas>
          </div>

          {/* Loading Content */}
          <div className="relative z-10 text-center max-w-md mx-auto px-6">
            {/* Logo/Title */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                style={{ 
                  backgroundSize: "300% 100%",
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                YouTube Downloader
              </motion.h1>
              <p className="text-gray-300 text-lg">Immersive 3D Experience</p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="w-full bg-gray-800/50 rounded-full h-2 mb-4 overflow-hidden backdrop-blur-sm border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{ width: '100px' }}
                  />
                </motion.div>
              </div>
              
              {/* Progress percentage */}
              <motion.div
                key={Math.floor(progress)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {Math.floor(progress)}%
              </motion.div>
            </motion.div>

            {/* Loading Stage */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.p
                key={stage}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-300 text-lg"
              >
                {stage}
              </motion.p>
            </motion.div>

            {/* Loading dots animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
