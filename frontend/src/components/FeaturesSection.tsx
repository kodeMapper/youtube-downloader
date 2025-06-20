"use client";

import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Cpu, Heart, Star } from 'lucide-react';
import Simple3DCard from './Simple3DCard';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "100% Secure",
      description: "Your privacy is our priority. All downloads are processed securely with end-to-end encryption."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Instant Processing",
      description: "Advanced algorithms ensure your videos are processed and ready for download in seconds."
    },
    {
      icon: <Globe className="w-8 h-8 text-cyan-400" />,
      title: "Global Servers",
      description: "Worldwide server network ensures fast downloads regardless of your location."
    },
    {
      icon: <Cpu className="w-8 h-8 text-violet-400" />,
      title: "AI-Powered",
      description: "Machine learning optimizes download quality and speed for the best user experience."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-400" />,
      title: "Always Free",
      description: "Our commitment to keeping YouTube downloading free and accessible for everyone."
    },
    {
      icon: <Star className="w-8 h-8 text-amber-400" />,
      title: "Premium Quality",
      description: "Support for 4K, 8K, and HDR video downloads with pristine audio quality."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-6xl md:text-7xl font-black mb-6">
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Powerful
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Features
          </span>
        </h2>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Experience the next generation of video downloading with cutting-edge technology
          and unmatched performance that sets us apart from the rest.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
          >            <Simple3DCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className="h-72"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {[
          { number: "10M+", label: "Downloads" },
          { number: "99.9%", label: "Uptime" },
          { number: "150+", label: "Countries" },
          { number: "4K", label: "Max Quality" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">
              {stat.number}
            </div>
            <div className="text-gray-400 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
