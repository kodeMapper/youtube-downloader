"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface SectionLayoutProps {
  sections: Section[];
  onSectionChange?: (index: number) => void;
}

export default function SectionLayout({ sections, onSectionChange }: SectionLayoutProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      
      e.preventDefault();
      setIsScrolling(true);

      let newSection = currentSection;      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        newSection = currentSection + 1;
        setCurrentSection(newSection);
        onSectionChange?.(newSection);
      } else if (e.deltaY < 0 && currentSection > 0) {
        newSection = currentSection - 1;
        setCurrentSection(newSection);
        onSectionChange?.(newSection);
      }

      // Dispatch custom event for section change
      window.dispatchEvent(new CustomEvent('sectionChange', { detail: newSection }));

      setTimeout(() => setIsScrolling(false), 1000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      let newSection = currentSection;
      if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        setIsScrolling(true);
        newSection = currentSection + 1;
        setCurrentSection(newSection);
        window.dispatchEvent(new CustomEvent('sectionChange', { detail: newSection }));
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        setIsScrolling(true);
        newSection = currentSection - 1;
        setCurrentSection(newSection);
        window.dispatchEvent(new CustomEvent('sectionChange', { detail: newSection }));
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, sections.length, isScrolling]);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Section Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-2">
        {sections.map((_, index) => (
          <button
            key={index}            onClick={() => {
              if (!isScrolling) {
                setCurrentSection(index);
                onSectionChange?.(index);
                window.dispatchEvent(new CustomEvent('sectionChange', { detail: index }));
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSection
                ? 'bg-white scale-125'
                : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 1.02 }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full overflow-y-auto flex items-center justify-center p-4 md:p-8"
        >
          <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-center">
            {sections[currentSection]?.component}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Background Morphing */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: `linear-gradient(${currentSection * 45}deg, 
            ${currentSection % 2 === 0 
              ? 'rgb(17 24 39), rgb(30 58 138), rgb(88 28 135)' 
              : 'rgb(31 41 55), rgb(15 23 42), rgb(30 27 75)'
            })`,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Navigation Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm text-center"
      >
        <p>Use scroll wheel or arrow keys to navigate</p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2"
        >
          ↓
        </motion.div>
      </motion.div>
    </div>
  );
}
