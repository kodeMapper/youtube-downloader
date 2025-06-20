"use client";

import { motion } from 'framer-motion';

interface SectionNavigationProps {
  currentSection: number;
  onSectionClick: (section: number) => void;
}

const sections = [
  { id: 0, name: 'Home', icon: '🏠' },
  { id: 1, name: 'Features', icon: '⚡' },
  { id: 2, name: 'About', icon: '💫' }
];

export default function SectionNavigation({ currentSection, onSectionClick }: SectionNavigationProps) {
  return (
    <>
      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-40 flex justify-center">
        <div className="flex space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700/30">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-full
                transition-all duration-300 border-2 overflow-hidden
                ${currentSection === section.id 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg border-purple-400' 
                  : 'bg-gray-800/50 border-gray-600'
                }
              `}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: currentSection === section.id ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <span className={`text-lg ${
                currentSection === section.id ? 'text-white' : 'text-gray-300'
              }`}>
                {section.icon}
              </span>
              
              {currentSection === section.id && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Desktop Navigation (Right side) */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-4 hidden md:block">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`
              relative flex items-center justify-center w-12 h-12 rounded-full
              transition-all duration-300 group border-2 overflow-hidden
              ${currentSection === section.id 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg border-purple-400' 
                : 'bg-gray-800/50 hover:bg-gray-700/70 border-gray-600 hover:border-gray-500'
              }
            `}
            whileHover={{ scale: currentSection === section.id ? 1.15 : 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: currentSection === section.id ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Active indicator ring */}
            {currentSection === section.id && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            <span className={`text-lg transition-all duration-200 ${
              currentSection === section.id ? 'text-white' : 'text-gray-300'
            }`}>
              {section.icon}
            </span>
            
            {/* Tooltip */}
            <div className={`
              absolute right-16 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              whitespace-nowrap pointer-events-none
            `}>
              {section.name}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 
                            border-l-4 border-l-gray-900 border-t-2 border-b-2 
                            border-t-transparent border-b-transparent"></div>
            </div>
          </motion.button>
        ))}
      </div>
    </>
  );
}
