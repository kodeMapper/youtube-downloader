"use client";

import { motion } from 'framer-motion';

interface Simple3DCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function Simple3DCard({ title, description, icon, delay = 0, className = '' }: Simple3DCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`group relative ${className}`}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        rotateX: 5,
        z: 50
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >      {/* Main Card */}
      <div className="h-full w-full relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg border border-white/20 p-4 md:p-6 flex flex-col justify-center items-center text-center">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 rounded-2xl"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Icon */}
        <motion.div
          className="text-4xl md:text-6xl mb-3 md:mb-4 z-10 relative"
          whileHover={{ scale: 1.2, rotateZ: 10 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 z-10 relative">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-300 text-xs md:text-sm leading-relaxed z-10 relative">{description}</p>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
