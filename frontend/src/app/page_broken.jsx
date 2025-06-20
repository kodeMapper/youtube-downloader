"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { Download, Youtube, Sparkles, ChevronDown, Play, Zap, Shield } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Create smooth scroll-based background like Dora.run
  const { scrollYProgress } = useScroll();
  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      // Hero: Clean dark with subtle blue
      "radial-gradient(ellipse 50% 30% at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0.8) 50%, #000000 100%)",
      // Middle: Subtle purple
      "radial-gradient(ellipse 40% 25% at 70% 60%, rgba(124, 58, 237, 0.2) 0%, rgba(15, 23, 42, 0.9) 50%, #000000 100%)",
      // End: Clean orange
      "radial-gradient(ellipse 45% 30% at 30% 70%, rgba(251, 146, 60, 0.25) 0%, rgba(15, 23, 42, 0.8) 50%, #000000 100%)"
    ]
  );

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking for cursor effects
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);// Simple section tracking
  useEffect(() => {
    const updateSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSection = Math.floor(scrollY / (windowHeight * 0.8));
      setCurrentSection(Math.min(newSection, 2));
    };

    window.addEventListener('scroll', updateSection);
    return () => window.removeEventListener('scroll', updateSection);
  }, []);
  const handleDownload = async () => {
    if (!url) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Download started successfully!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const scrollToSection = (sectionIndex) => {
    const element = document.getElementById(`section-${sectionIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };  // Cleaner SmartCard Component - more like Dora.run
  const SmartCard = ({ children, className = "", delay = 0 }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay: delay,
            ease: "easeOut"
          }
        }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 }
        }}
        className={`${className} cursor-pointer`}
      >
        {children}
      </motion.div>
    );
  };// Enhanced Input Field with cleaner Dora.run-style focus effects
  const SmartInput = ({ value, onChange, placeholder, className = "" }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <motion.div
        className={`relative ${className}`}
        animate={{
          scale: isFocused ? 1.01 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-6 py-4 text-lg rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all duration-300"
        />
      </motion.div>
    );
  };

  // Loading Screen Component
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-semibold text-white mb-2"
          >
            YouTube Downloader
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-400"
          >
            Loading amazing experience...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black min-h-screen">
      <Toaster position="top-center" />
      
      {/* Clean background with subtle gradient - Dora.run style */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ 
          background: backgroundTransform
        }}
      />
      
      {/* Subtle cursor glow - much cleaner */}
      <motion.div
        className="fixed w-32 h-32 pointer-events-none z-10 opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          filter: "blur(20px)"
        }}
      />      {/* Navigation dots - cleaner and more minimal */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-2">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-white scale-125' 
                : 'bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>{/* Hero Section - much cleaner */}
      <section id="section-0" className="relative min-h-screen flex items-center justify-center px-6">
        <div className="relative z-20 text-center max-w-6xl mx-auto">          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-semibold text-white mb-8 tracking-tight"
          >
            YouTube Downloader
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed"
          >
            Downloads beyond imagination, one URL away.
          </motion.p>

          {/* Clean input section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <SmartInput
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your YouTube URL here..."
                className="flex-1"
              />
                <motion.button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-10 py-4 bg-white text-black font-medium rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 hover:bg-gray-100 min-w-[180px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isDownloading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download
                  </>
                )}              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Clean Dora.run style */}
      <section id="section-1" className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Advanced Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of YouTube downloading with cutting-edge technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Youtube, 
                title: "8K Ultra HD", 
                desc: "Download videos in pristine 8K quality with advanced codec optimization",
                color: "from-red-500 to-pink-500"
              },
              { 
                icon: Zap, 
                title: "Lightning Speed", 
                desc: "Multi-threaded downloading with intelligent bandwidth optimization",
                color: "from-green-500 to-emerald-500"
              },
              { 
                icon: Shield, 
                title: "Zero Limits", 
                desc: "Unlimited downloads with enterprise-grade security and privacy",
                color: "from-purple-500 to-violet-500"
              }
            ].map((feature, index) => (
              <SmartCard key={feature.title} delay={index * 0.1}>
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 h-full hover:bg-white/10 transition-all duration-300">
                  <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-center text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </SmartCard>
            ))}
          </div>
        </div>
      </section>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-200px" }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="text-center mb-20"
          >            <h2 className="text-6xl font-black text-white mb-6">
              Features beyond limits
            </h2>            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the most advanced YouTube downloading technology      {/* Features Section - Clean Dora.run style */}
      <section id="section-1" className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              Advanced Features
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of YouTube downloading with cutting-edge technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Youtube, 
                title: "8K Ultra HD", 
                desc: "Download videos in pristine 8K quality with advanced codec optimization",
                color: "from-red-500 to-pink-500"
              },
              { 
                icon: Zap, 
                title: "Lightning Speed", 
                desc: "Multi-threaded downloading with intelligent bandwidth optimization",
                color: "from-green-500 to-emerald-500"
              },
              { 
                icon: Shield, 
                title: "Zero Limits", 
                desc: "Unlimited downloads with enterprise-grade security and privacy",
                color: "from-purple-500 to-violet-500"
              }
            ].map((feature, index) => (              <SmartCard key={feature.title} delay={index * 0.1}>
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 h-full hover:bg-white/10 transition-all duration-300">
                  <div className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-center text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </SmartCard>
            ))}
          </div>
        </div>
      </section>      {/* How It Works Section - Clean and simple */}
      <section id="section-2" className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Three simple steps to download any YouTube video in the highest quality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Paste", desc: "Simply paste your YouTube URL", icon: "📋" },
              { step: "02", title: "Process", desc: "Our AI analyzes and optimizes", icon: "🤖" },
              { step: "03", title: "Download", desc: "Get your video in seconds", icon: "⚡" }
            ].map((item, index) => (              <SmartCard key={item.step} delay={index * 0.1}>
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 h-full text-center hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-xl font-semibold text-orange-400 mb-3">{item.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </SmartCard>
            ))}
          </div>
        </div>
      </section>
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl">
                <div className="flex items-center gap-2 p-6 bg-gray-800/50 border-b border-gray-700">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-gray-400 text-sm font-mono">youtube-downloader</span>
                </div>
                <div className="p-8 font-mono text-left space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="text-lg"
                  >
                    <span className="text-yellow-300">$</span> youtube-downloader --url 
                    <span className="text-green-300"> "https://youtu.be/example"</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="text-gray-300 space-y-1"
                  >
                    <div>⚡ Analyzing video metadata...</div>
                    <div>📊 Selecting optimal quality stream...</div>
                    <div>🚀 Download initiated at maximum speed!</div>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ delay: 2.5, duration: 2 }}
                      className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded mt-4"
                    />
                    <div className="text-green-400 mt-2">✅ Download complete!</div>
                  </motion.div>
                </div>
              </div>            </SmartCard>
          </motion.div>
        </div>
      </motion.section>      {/* Final CTA Section - Clean and professional */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-semibold text-white mb-6"
          >
            Start Downloading Now
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-400 mb-12 leading-relaxed"
          >
            Join millions who trust our platform for seamless YouTube downloads
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <SmartInput
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Try another YouTube URL..."
              className="md:w-96"
            />
              <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-8 py-4 bg-white text-black font-medium rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 hover:bg-gray-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isDownloading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Now
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Stats - Clean and simple */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-12 mt-16 flex-wrap"
          >
            {[
              { label: "10M+", desc: "Downloads" },
              { label: "99.9%", desc: "Success Rate" },
              { label: "4K-8K", desc: "Quality" },
              { label: "0s", desc: "Wait Time" }            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider">{stat.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
