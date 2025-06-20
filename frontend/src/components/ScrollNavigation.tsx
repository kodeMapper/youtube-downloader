"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Home, Download, Zap, Star } from 'lucide-react';

interface ScrollNavigationProps {
  currentSection?: number;
}

export function ScrollNavigation({ currentSection = 0 }: ScrollNavigationProps) {
  const [activeSection, setActiveSection] = useState(currentSection);
  const [isVisible, setIsVisible] = useState(true);

  const sections = [
    { id: 'hero', name: 'Home', icon: Home, color: 'from-blue-400 to-purple-600' },
    { id: 'downloader-section', name: 'Download', icon: Download, color: 'from-purple-400 to-pink-600' },
    { id: 'features', name: 'Features', icon: Zap, color: 'from-green-400 to-cyan-600' },
    { id: 'testimonials', name: 'Reviews', icon: Star, color: 'from-pink-400 to-rose-600' }
  ];

  const scrollToSection = (sectionId: string, index: number) => {
    setActiveSection(index);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollNext = () => {
    const nextIndex = Math.min(activeSection + 1, sections.length - 1);
    scrollToSection(sections[nextIndex].id, nextIndex);
  };

  const scrollPrev = () => {
    const prevIndex = Math.max(activeSection - 1, 0);
    scrollToSection(sections[prevIndex].id, prevIndex);
  };

  // Detect current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollY / windowHeight);
      setActiveSection(Math.min(sectionIndex, sections.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  // Hide/show based on scroll
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      setIsVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsVisible(false), 3000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
        >
          <div className="flex flex-col items-center space-y-2">
            {/* Previous section button */}
            <motion.button
              onClick={scrollPrev}
              disabled={activeSection === 0}
              className={`p-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                activeSection === 0 
                  ? 'bg-gray-800/20 border-gray-600/20 text-gray-500 cursor-not-allowed' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-110'
              }`}
              whileHover={activeSection !== 0 ? { scale: 1.1 } : {}}
              whileTap={activeSection !== 0 ? { scale: 0.95 } : {}}
            >
              <ChevronUp className="w-4 h-4" />
            </motion.button>

            {/* Section indicators */}
            <div className="flex flex-col space-y-3 py-4">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id, index)}
                  className="group relative"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 whitespace-nowrap"
                  >
                    <div className="px-3 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg border border-white/10">
                      {section.name}
                    </div>
                  </motion.div>

                  {/* Indicator dot */}
                  <div className="relative">
                    <motion.div
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                        activeSection === index
                          ? 'border-white bg-white'
                          : 'border-white/40 bg-transparent hover:border-white/80'
                      }`}
                      layoutId="activeIndicator"
                    />
                    
                    {/* Active section glow */}
                    {activeSection === index && (
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${section.color} opacity-60 blur-sm scale-150`}
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 0.6, scale: 1.5 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Next section button */}
            <motion.button
              onClick={scrollNext}
              disabled={activeSection === sections.length - 1}
              className={`p-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
                activeSection === sections.length - 1
                  ? 'bg-gray-800/20 border-gray-600/20 text-gray-500 cursor-not-allowed' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-110'
              }`}
              whileHover={activeSection !== sections.length - 1 ? { scale: 1.1 } : {}}
              whileTap={activeSection !== sections.length - 1 ? { scale: 0.95 } : {}}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
