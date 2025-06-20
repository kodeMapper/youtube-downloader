"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Toast from '../components/Toast';
import SectionNavigation from '../components/SectionNavigation';
import ScrollIndicator from '../components/ScrollIndicator';
import ModernLoader from '../components/ModernLoader';
import useSwipe from '../hooks/useSwipe';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  
  const [currentSection, setCurrentSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Implement swipe navigation for mobile
  useSwipe({
    onSwipeUp: () => {
      const maxSection = sectionRefs.current.length - 1;
      const nextSection = Math.min(currentSection + 1, maxSection);
      if (nextSection !== currentSection) {
        scrollToSection(nextSection);
      }
    },
    onSwipeDown: () => {
      const prevSection = Math.max(currentSection - 1, 0);
      if (prevSection !== currentSection) {
        scrollToSection(prevSection);
      }
    }
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Increased to 3.5 seconds for better experience

    return () => clearTimeout(timer);
  }, []);  // Improved scroll detection to accurately update current section
  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionRefs.current;
      const windowHeight = window.innerHeight;
      
      // Use IntersectionObserver concepts for more reliable section detection
      let newActiveSection = currentSection;
      let maxVisibility = 0;
      
      // Find the section that is most visible in the viewport
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          
          // Calculate how much of the section is visible as a percentage of the viewport
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          const visiblePercentage = visibleHeight / windowHeight;
          
          // Consider a section active if it's the most visible one and at least 30% visible
          if (visiblePercentage > maxVisibility && visiblePercentage > 0.3) {
            maxVisibility = visiblePercentage;
            newActiveSection = i;
          }
        }
      }
      
      // Only update if the section changed to avoid unnecessary re-renders
      if (currentSection !== newActiveSection) {
        setCurrentSection(newActiveSection);
      }
    };

    // Initial call to set the correct section with a slight delay to ensure DOM is ready
    const initialTimer = setTimeout(handleScroll, 100);
    
    // Use both scroll and resize events for better detection
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Create an interval to periodically check section visibility
    // This helps when scrolling is triggered programmatically or by arrow keys
    const intervalTimer = setInterval(handleScroll, 200);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [currentSection]);// Keyboard navigation with improved responsiveness
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

      const maxSection = sectionRefs.current.length - 1;
      
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

    // Use both the document and window for better event catching
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
    
    // Focus on main element to ensure keyboard events work properly
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.setAttribute('tabindex', '-1');
      mainElement.focus({preventScroll: true});
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection]);  const scrollToSection = (sectionIndex: number) => {
    const section = sectionRefs.current[sectionIndex];
    if (section) {
      // Update current section state immediately for a responsive feel
      setCurrentSection(sectionIndex);
      
      // Scroll to section smoothly
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Focus on main element to ensure keyboard events work properly
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.setAttribute('tabindex', '-1'); // Make it focusable
        mainElement.focus({preventScroll: true}); // Focus without scrolling
      }
      
      // Ensure the currentSection state is correct after scrolling
      setTimeout(() => {
        if (currentSection !== sectionIndex) {
          setCurrentSection(sectionIndex);
        }
      }, 100);
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
    }  };

const handleDownload = async () => {
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
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus('');
    setVideoInfo(null);
    setIsLoadingInfo(true);

    try {
      // First, try to get video info from the main API
      let infoResponse = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          infoOnly: true
        }),
      });

      let info;
      let useFallback = false;

      if (!infoResponse.ok) {
        // If main API fails, try fallback
        console.log('Main API failed, trying fallback...');
        const fallbackResponse = await fetch('/api/download-fallback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url.trim()
          }),
        });

        if (!fallbackResponse.ok) {
          const error = await fallbackResponse.json();
          throw new Error(error.error || 'Failed to fetch video info');
        }

        info = await fallbackResponse.json();
        useFallback = true;
      } else {
        info = await infoResponse.json();
      }

      setVideoInfo(info);
      setIsLoadingInfo(false);
      setDownloadProgress(25);

      if (useFallback) {
        // For fallback, provide external download link
        setDownloadStatus('Using external download service...');
        setDownloadProgress(75);
        
        // Open external download link
        if (info.downloadUrl) {
          window.open(info.downloadUrl, '_blank');
          setDownloadProgress(100);
          setDownloadStatus('Redirected to external download service');
          showToast('Opened external download service in new tab', 'info');
        } else {
          throw new Error('No download link available');
        }

        // Reset after showing success
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
          setDownloadStatus('');
          setUrl('');
        }, 3000);
        return;
      }

      // Continue with main API download
      setDownloadStatus('Preparing download...');

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
      document.body.removeChild(a);

      window.URL.revokeObjectURL(downloadUrl);

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
    }
  };

  if (isLoading) {
    return <ModernLoader />;
  }

  return (
    <main className="relative bg-black text-white h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory touch-pan-y overscroll-y-none">
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
      />
      
      {/* Scroll Indicator (only show when not on last section and not downloading) */}
      {currentSection !== sectionRefs.current.length - 1 && !isDownloading && (
        <ScrollIndicator isLastSection={currentSection === sectionRefs.current.length - 1} />
      )}
      
      {/* Hero Section */}
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
        >          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full px-2 md:px-0">
            <div className="flex-1 relative">
              <input
                type="url"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isDownloading}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 pr-10 md:pr-12 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              />
              <button
                onClick={handlePasteFromClipboard}
                disabled={isDownloading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-full touch-action-manipulation"
                title="Paste from clipboard"
                aria-label="Paste from clipboard"
              >
                <span className="sr-only">Paste from clipboard</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 2a2 2 0 012 2h4a2 2 0 012 2v2h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2V4a2 2 0 012-2zm0 4V4m8 0v2m-8 4h8m-8 4h8m-8 4h4"
                  />
                </svg>
              </button>
            </div>
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading || !url.trim()}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm md:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-action-manipulation"
              whileHover={!isDownloading ? { scale: 1.03 } : {}}
              whileTap={!isDownloading ? { scale: 0.97 } : {}}
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </motion.button>
          </div>            {/* Download Status - Only show when there's actual status to display and not just loading info */}
          {downloadStatus && !isLoadingInfo && (
            <motion.div 
              className="mt-3 md:mt-4 p-2.5 md:p-3 rounded-lg bg-gray-800/70 backdrop-blur-sm border border-gray-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs md:text-sm text-gray-300">{downloadStatus}</p>
              {isDownloading && downloadProgress > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 md:h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}{/* Video Info */}
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
                </div>              ) : videoInfo ? (
                <>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {videoInfo.thumbnail && (
                      <div className="w-full md:w-auto md:flex-shrink-0 order-1 md:order-none">
                        <img 
                          src={videoInfo.thumbnail} 
                          alt="Video thumbnail" 
                          className="w-full max-w-[180px] mx-auto rounded-lg border border-gray-600 shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          loading="lazy"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-blue-300 line-clamp-2">{videoInfo.title}</h3>
                      
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs md:text-sm">
                        {videoInfo.channel && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-xs">📺</span>
                            <span className="text-gray-300 truncate">{videoInfo.channel}</span>
                          </div>
                        )}
                        {videoInfo.duration && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-xs">⏱️</span>
                            <span className="text-gray-300">{formatDuration(videoInfo.duration)}</span>
                          </div>
                        )}
                        {videoInfo.view_count && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-xs">👀</span>
                            <span className="text-gray-300">{formatViewCount(videoInfo.view_count)}</span>
                          </div>
                        )}
                        {videoInfo.filesize && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-xs">💾</span>
                            <span className="text-gray-300">{formatFileSize(videoInfo.filesize)}</span>
                          </div>
                        )}
                        {videoInfo.formats && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-xs">🎥</span>
                            <span className="text-gray-300">{videoInfo.formats} formats</span>
                          </div>
                        )}
                        {videoInfo.upload_date && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-xs">📅</span>
                            <span className="text-gray-300">{new Date(videoInfo.upload_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </motion.div>
          )}
        </motion.div>        {/* Spacer at the bottom of the hero section */}
        <div className="h-8"></div>
      </section>{/* Features Section */}      <section 
        ref={(el) => { sectionRefs.current[1] = el; }}
        className="h-screen flex flex-col items-center justify-center px-4 md:px-6 snap-start py-16 md:py-0 overflow-hidden"
      >
        <motion.h2 
          className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6 md:mb-8 lg:mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Features
          </span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 max-w-6xl overflow-y-auto md:overflow-visible px-2 pb-16 md:pb-0">
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
            <motion.div              key={index}
              className="p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}            >
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-3 lg:mb-4">{feature.icon}</div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-1.5 md:mb-2 lg:mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">{feature.description}</p>
              <div className={`h-0.5 md:h-1 w-full bg-gradient-to-r ${feature.color} rounded-full mt-2 md:mt-3 lg:mt-4`}></div>
            </motion.div>
          ))}
        </div>
      </section>      {/* About/Contact Section */}
      <section 
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="h-screen flex flex-col items-center justify-center px-4 md:px-6 snap-start pb-16 md:pb-0"
      >
        <motion.h2 
          className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6 md:mb-8 lg:mb-12 text-center"
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
          <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed mb-5 md:mb-8">
            We believe that accessing and sharing digital content should be simple, fast, and free for everyone. 
            Our mission is to democratize video downloading through cutting-edge technology and user-friendly design.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-8 lg:mt-12">
            <motion.div 
              className="p-4 md:p-5 lg:p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 lg:mb-4">🌟 Our Vision</h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                To be the world's most trusted platform for video downloading, 
                providing seamless access to digital content for creators and consumers alike.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-4 md:p-5 lg:p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 lg:mb-4">🚀 Our Technology</h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                Built with modern web technologies including React, Next.js, and advanced 
                video processing algorithms for optimal performance.
              </p>
            </motion.div>
          </div>

          <motion.div 
            className="mt-6 md:mt-8 lg:mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 lg:mb-6">Thank You!</h3>
            <p className="text-gray-300 max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
              Thank you for choosing our platform. Your trust and feedback help us 
              continuously improve and innovate. Together, we're building the future of digital content accessibility.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
