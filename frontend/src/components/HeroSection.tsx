"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Youtube, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Simple3DCard from './Simple3DCard';
import MagicButton from './MagicButton';
import DownloadProgressIndicator from './DownloadProgressIndicator';

export default function HeroSection() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState({ fileName: '', fileSize: '' });
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    // Reset progress when a new download starts
    if (isDownloading) {
      setDownloadProgress(0);
      setShowProgress(true);
      
      // Simulate progress updates
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          const increment = Math.random() * 15;
          const newProgress = prev + increment;
          
          // Cap at 90% - the final 10% will happen when the actual download completes
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isDownloading]);

  const handleCancel = () => {
    // Here you would implement actual download cancellation
    // For now, we'll just reset the UI state
    setIsDownloading(false);
    setDownloadProgress(0);
    setShowProgress(false);
    toast.error('Download cancelled');
  };

  const handleDownload = async () => {
    if (!url) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setIsDownloading(true);
    
    try {
      // Get video info first
      const infoResponse = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, infoOnly: true }),
      });

      if (infoResponse.ok) {
        const videoInfo = await infoResponse.json();
        setDownloadInfo({
          fileName: videoInfo.title || 'video.mp4',
          fileSize: videoInfo.filesize ? `${(videoInfo.filesize / 1024 / 1024).toFixed(1)} MB` : 'Unknown size'
        });
      }

      // Start actual download
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        // Complete progress to 100%
        setDownloadProgress(100);
        
        // Get the blob and create download
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = downloadInfo.fileName || 'video.mp4';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        toast.success('Download completed successfully!');
        
        // Hide progress after a delay
        setTimeout(() => {
          setShowProgress(false);
        }, 3000);
      } else {
        toast.error('Download failed. Please try again.');
        setShowProgress(false);
      }
    } catch (error) {
      toast.error('Network error. Please check your connection.');
      setShowProgress(false);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 text-center">
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <h1 className="text-7xl md:text-9xl font-black mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            YouTube
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Downloader
          </span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Experience the future of video downloading with our immersive,
          lightning-fast platform
        </motion.p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mb-12"
      >
        <div className="relative max-w-2xl mx-auto">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-600/20 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="relative flex flex-col md:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 px-6 py-4 text-lg bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <MagicButton
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download
                  <ArrowRight size={16} />
                </>
              )}
            </MagicButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >        <Simple3DCard
          title="High Quality"
          description="Download videos in the highest available quality with crystal clear audio"
          icon={<Youtube className="w-8 h-8 text-blue-400" />}
          className="h-64"
        />
        
        <Simple3DCard
          title="Lightning Fast"
          description="Experience blazing-fast download speeds with our optimized servers"
          icon={<Download className="w-8 h-8 text-green-400" />}
          className="h-64"
        />
        
        <Simple3DCard
          title="No Limits"
          description="Download unlimited videos with no registration required, completely free"
          icon={<Sparkles className="w-8 h-8 text-purple-400" />}
          className="h-64"
        />
      </motion.div>
      
      {/* Download Progress Indicator */}
      <DownloadProgressIndicator
        isVisible={showProgress}
        downloadProgress={downloadProgress}
        fileName={downloadInfo.fileName}
        fileSize={downloadInfo.fileSize}
        onCancel={handleCancel}
      />
    </div>
  );
}
