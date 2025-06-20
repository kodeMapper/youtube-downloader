"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';
import SectionNavigation from '../components/SectionNavigation';
import ScrollIndicator from '../components/ScrollIndicator';
import ModernLoader from '../components/ModernLoader';

// Helper function to format duration
function formatDuration(seconds: number): string {
  if (!seconds) return 'Unknown';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (!bytes) return 'Unknown';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Helper function to format view count
function formatViewCount(views: number): string {
  if (!views) return 'Unknown';
  
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M views';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K views';
  } else {
    return views + ' views';
  }
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);  const [downloadProgress, setDownloadProgress] = useState(0);  const [downloadStatus, setDownloadStatus] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Increased to 3.5 seconds for better experience

    return () => clearTimeout(timer);
  }, []);  // Scroll detection to update current section  useEffect(() => {    const handleScroll = () => {
      const sections = sectionRefs.current;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      let newSection = 0;
      
      // Find which section is most visible in viewport
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionMiddle = rect.top + rect.height / 2;
          
          // If section middle is in upper half of viewport, it's the current section
          if (sectionMiddle <= windowHeight / 2) {
            newSection = i;
          }
        }
      }
      
      // Update current section if it changed
      if (currentSection !== newSection) {
        setCurrentSection(newSection);
      }
    };

    // Initial call to set the correct section
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if user is typing in an input field
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      )) {
        return;
      }

      const maxSection = 2; // We have 3 sections (0, 1, 2)
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextSection = Math.min(currentSection + 1, maxSection);
        if (nextSection !== currentSection) {
          scrollToSection(nextSection);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevSection = Math.max(currentSection - 1, 0);
        if (prevSection !== currentSection) {
          scrollToSection(prevSection);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(maxSection);
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [currentSection]);  const scrollToSection = (sectionIndex: number) => {
    const section = sectionRefs.current[sectionIndex];
    if (section) {
      // Update current section immediately for responsive UI
      setCurrentSection(sectionIndex);
      
      // Add visual feedback
      const currentActiveSection = sectionRefs.current[currentSection];
      if (currentActiveSection) {
        currentActiveSection.style.transition = 'transform 0.1s ease-out';
        currentActiveSection.style.transform = 'scale(0.98)';
        setTimeout(() => {
          currentActiveSection.style.transform = 'scale(1)';
        }, 100);
      }
      
      // Use scrollIntoView with block: 'start' for more precise positioning
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText.trim()) {
          setUrl(clipboardText.trim());
          showToast('URL pasted from clipboard', 'info');
        } else {
          showToast('Clipboard is empty', 'error');
        }
      } else {
        showToast('Clipboard access not available', 'error');
      }
    } catch (error) {
      showToast('Failed to read clipboard', 'error');
    }
  };const handleDownload = async () => {
    if (!url.trim()) {
      setDownloadStatus('Please enter a YouTube URL');
      showToast('Please enter a YouTube URL', 'error');
      return;
    }

    // Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url.trim())) {
      setDownloadStatus('Please enter a valid YouTube URL');
      showToast('Please enter a valid YouTube URL', 'error');
      return;
    }    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus('Starting download...');
    setVideoInfo(null);
    setIsLoadingInfo(true);

    try {
      // First, get video info
      setDownloadStatus('Fetching video information...');
      const infoResponse = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          infoOnly: true
        }),
      });

      if (!infoResponse.ok) {
        const error = await infoResponse.json();
        throw new Error(error.error || 'Failed to fetch video info');
      }      const info = await infoResponse.json();
      setVideoInfo(info);
      setIsLoadingInfo(false);
      setDownloadStatus('Video info fetched. Starting download...');
      setDownloadProgress(25);

      // Then start the actual download
      const downloadResponse = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          infoOnly: false
        }),
      });

      if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text();
        let errorMessage = 'Download failed';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setDownloadProgress(75);
      setDownloadStatus('Processing download...');

      // Get the video file as blob
      const blob = await downloadResponse.blob();
      
      // Extract filename from Content-Disposition header or use video title
      const contentDisposition = downloadResponse.headers.get('content-disposition');
      let filename = 'video.mp4';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      } else if (info.title) {
        // Sanitize title for filename
        filename = info.title.replace(/[^\w\s.-]/g, '').replace(/\s+/g, '_') + '.mp4';
      }

      // Create download link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);      window.URL.revokeObjectURL(downloadUrl);

      setDownloadProgress(100);
      setDownloadStatus('Download completed!');
      showToast('Download completed successfully!', 'success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        setDownloadStatus('');
        setUrl(''); // Clear the URL field
        setIsLoadingInfo(false);
      }, 3000);

    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setDownloadStatus(`Error: ${errorMessage}`);
      showToast(`Download failed: ${errorMessage}`, 'error');
      setIsLoadingInfo(false);
      
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
        setDownloadStatus('');
      }, 5000); // Show error longer
    }  };

  if (isLoading) {
    return <ModernLoader />;
  }

  return (
    <main className="relative bg-black text-white h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />      {/* Section Navigation */}
      <SectionNavigation 
        currentSection={currentSection}
        onSectionClick={scrollToSection}
      />      {/* Scroll Indicator (only show on first section and when not downloading) */}
      {currentSection === 0 && !isDownloading && <ScrollIndicator />}
      
      {/* Section Navigation */}
      <SectionNavigation
        currentSection={currentSection}
        onSectionClick={scrollToSection}
      />        {/* Hero Section */}
      <section 
        ref={(el) => { sectionRefs.current[0] = el; }}
        className="flex flex-col items-center justify-center h-screen px-6 snap-start"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            YouTube
          </span>
          <br />
          <span className="text-white">Downloader</span>
        </motion.h1>
        
        <motion.p 
          className="text-gray-300 text-lg md:text-xl mb-8 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Download your favorite YouTube videos quickly and easily
        </motion.p>        {/* Download Form */}
        <motion.div 
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="url"
                placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isDownloading}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              />
              <button
                onClick={handlePasteFromClipboard}
                disabled={isDownloading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                title="Paste from clipboard"
              >
                📋
              </button>
            </div>
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading || !url.trim()}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isDownloading ? { scale: 1.05 } : {}}
              whileTap={!isDownloading ? { scale: 0.95 } : {}}
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </motion.button>
          </div>
          
          {/* Download Status */}
          {downloadStatus && (
            <motion.div 
              className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-300">{downloadStatus}</p>
              {isDownloading && downloadProgress > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}          {/* Video Info */}
          {(isLoadingInfo || videoInfo) && (
            <motion.div 
              className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {isLoadingInfo ? (
                <div className="flex items-center justify-center space-x-3">
                  <motion.div
                    className="w-4 h-4 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-4 h-4 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-4 h-4 bg-pink-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  />
                  <span className="text-gray-300 ml-2">Loading video info...</span>
                </div>
              ) : videoInfo ? (
                <>
                  <h3 className="text-lg font-semibold mb-3 text-blue-300">{videoInfo.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {videoInfo.channel && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📺 Channel:</span>
                        <span className="text-gray-300">{videoInfo.channel}</span>
                      </div>
                    )}
                    {videoInfo.duration && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">⏱️ Duration:</span>
                        <span className="text-gray-300">{formatDuration(videoInfo.duration)}</span>
                      </div>
                    )}
                    {videoInfo.view_count && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">👀 Views:</span>
                        <span className="text-gray-300">{formatViewCount(videoInfo.view_count)}</span>
                      </div>
                    )}
                    {videoInfo.filesize && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">💾 Size:</span>
                        <span className="text-gray-300">{formatFileSize(videoInfo.filesize)}</span>
                      </div>
                    )}
                    {videoInfo.formats && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🎥 Formats:</span>
                        <span className="text-gray-300">{videoInfo.formats} available</span>
                      </div>
                    )}
                    {videoInfo.upload_date && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📅 Uploaded:</span>
                        <span className="text-gray-300">{new Date(videoInfo.upload_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {videoInfo.thumbnail && (
                    <div className="mt-3">
                      <img 
                        src={videoInfo.thumbnail} 
                        alt="Video thumbnail" 
                        className="w-full max-w-xs mx-auto rounded-lg border border-gray-600"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </>
              ) : null}
            </motion.div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            {
              title: "Fast Downloads",
              description: "Lightning-fast download speeds for all video qualities",
              icon: "⚡"
            },
            {
              title: "Multiple Formats",
              description: "Support for MP4, MP3, and various other formats",
              icon: "🎬"
            },
            {
              title: "High Quality",
              description: "Download videos in up to 4K resolution",
              icon: "🎯"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>{/* Features Section */}
      <section 
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="h-screen flex flex-col items-center justify-center px-6 snap-start"
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Features
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {[
            {
              title: "Ultra-Fast Processing",
              description: "Download videos in seconds with our optimized servers",
              icon: "🚀",
              color: "from-blue-500 to-cyan-500"
            },
            {
              title: "Multiple Quality Options",
              description: "Choose from 144p to 4K resolution based on your needs",
              icon: "🎥",
              color: "from-purple-500 to-pink-500"
            },
            {
              title: "Audio Extraction",
              description: "Extract high-quality audio files in MP3 format",
              icon: "🎵",
              color: "from-green-500 to-teal-500"
            },
            {
              title: "Batch Downloads",
              description: "Download multiple videos simultaneously",
              icon: "📦",
              color: "from-orange-500 to-red-500"
            },
            {
              title: "No Registration",
              description: "Start downloading immediately without creating an account",
              icon: "🔓",
              color: "from-indigo-500 to-purple-500"
            },
            {
              title: "Safe & Secure",
              description: "Your downloads are private and secure",
              icon: "🛡️",
              color: "from-emerald-500 to-green-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              <div className={`h-1 w-full bg-gradient-to-r ${feature.color} rounded-full mt-4`}></div>
            </motion.div>
          ))}
        </div>
      </section>      {/* About/Contact Section */}
      <section 
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="h-screen flex flex-col items-center justify-center px-6 snap-start"
      >
        <motion.h2 
          className="text-3xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            About Us
          </span>
        </motion.h2>

        <motion.div 
          className="max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            We believe that accessing and sharing digital content should be simple, fast, and free for everyone. 
            Our mission is to democratize video downloading through cutting-edge technology and user-friendly design.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <motion.div 
              className="p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold mb-4">🌟 Our Vision</h3>
              <p className="text-gray-300">
                To be the world's most trusted platform for video downloading, 
                providing seamless access to digital content for creators and consumers alike.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold mb-4">🚀 Our Technology</h3>
              <p className="text-gray-300">
                Built with modern web technologies including React, Next.js, and advanced 
                video processing algorithms for optimal performance.
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6">Thank You!</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Thank you for choosing our platform. Your trust and feedback help us 
              continuously improve and innovate. Together, we're building the future              of digital content accessibility.
            </p>
          </motion.div>
        </motion.div>
      </section>    </main>

    {/* Navigation and UI Components */}
    <SectionNavigation currentSection={currentSection} onSectionClick={scrollToSection} />
    {currentSection < 2 && <ScrollIndicator />}
    
    {toast.isVisible && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    )}
    </>
  );
}
