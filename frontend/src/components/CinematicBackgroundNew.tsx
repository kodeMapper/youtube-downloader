"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Create a simple fallback background
const FallbackBackground = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-50 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
  </div>
);

// Dynamically import the Three.js scene to avoid SSR issues
const ThreeJSScene = dynamic(() => import('./ThreeJSScene'), {
  ssr: false,
  loading: () => <FallbackBackground />
});

interface CinematicBackgroundProps {
  sectionIndex: number;
}

export default function CinematicBackground({ sectionIndex }: CinematicBackgroundProps) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Suspense fallback={<FallbackBackground />}>
        <ThreeJSScene sectionIndex={sectionIndex} />
      </Suspense>
    </div>
  );
}
