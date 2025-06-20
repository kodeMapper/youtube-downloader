"use client";

import { useState, useEffect } from 'react';
import { Download, Youtube, Check, Link, Play, Star, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [message, setMessage] = useState('');

  // Simulate progress during download
  useEffect(() => {
    let interval;
    if (isDownloading) {
      interval = setInterval(() => {
        setDownloadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
    } else if (downloadProgress > 0 && downloadProgress < 100) {
      // If download completed or failed
      setDownloadProgress(100);
    }
    return () => clearInterval(interval);
  }, [isDownloading, downloadProgress]);

  const handleDownload = async () => {
    if (!url) {
      setMessage('Please enter a YouTube URL');
      return;
    }

    try {
      setIsDownloading(true);
      setMessage('Starting download...');
      setDownloadProgress(0);

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Handle blob response for file download
      const blob = await response.blob();
      
      // Create an object URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'youtube-video';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create an invisible anchor to trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(downloadUrl);
      
      setMessage('Download started!');
      setDownloadProgress(100);
    } catch (error) {
      console.error('Download error:', error);
      setMessage(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16 animate-float">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-3xl shadow-2xl animate-glow">
              <Youtube className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-7xl font-bold gradient-text mb-6 animate-gradient">
            YouTube Downloader
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the <span className="text-red-400 font-semibold">fastest and most reliable</span> YouTube video downloader. 
            <br />Just paste your URL and watch the magic happen! ✨
          </p>
        </header>

        {/* Main Download Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="glass rounded-3xl p-10 shadow-2xl border border-white/20 backdrop-blur-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <Link className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Enter YouTube URL</h2>
            </div>
            
            <div className="space-y-8">
              {/* URL Input */}
              <div className="relative group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
                  className="w-full px-8 py-6 text-lg bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300 group-hover:border-white/30"
                  disabled={isDownloading}
                />
                {url && (
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <div className="bg-green-500 p-2 rounded-full">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={!url || isDownloading}
                className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-6 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl hover:shadow-red-500/50 flex items-center justify-center gap-4 text-xl btn-glow group"
              >
                {isDownloading ? (
                  <>
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-white/40"></div>
                    </div>
                    <span className="animate-pulse">Downloading Your Video...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-8 h-8 group-hover:animate-bounce" />
                    <span>Download Video Now</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {isDownloading && (
                <div className="space-y-4">
                  <div className="flex justify-between text-lg text-gray-300">
                    <span className="font-semibold">Download Progress</span>
                    <span className="font-bold text-red-400">{Math.round(downloadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 via-red-400 to-red-300 transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${downloadProgress}%` }}
                    >
                      <div className="w-full h-full bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-400 animate-pulse">Please wait while we process your video...</span>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {message && (
                <div className={`p-6 rounded-2xl backdrop-blur-lg border-2 ${
                  message.includes('Error') || message.includes('Failed') 
                    ? 'bg-red-500/20 border-red-500/40 text-red-200' 
                    : message.includes('Success') || message.includes('started')
                    ? 'bg-green-500/20 border-green-500/40 text-green-200'
                    : 'bg-blue-500/20 border-blue-500/40 text-blue-200'
                } shadow-xl`}>
                  <div className="flex items-center gap-3">
                    {message.includes('Error') || message.includes('Failed') ? (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">!</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-lg font-medium">{message}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-10 mb-20">
          {/* Fast Download */}
          <div className="glass rounded-3xl p-8 text-center hover:scale-105 transition-all duration-500 group border border-white/20 backdrop-blur-2xl">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">⚡ Lightning Fast</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Our advanced algorithms ensure <span className="text-purple-400 font-semibold">maximum download speeds</span> with optimized compression technology.
            </p>
          </div>

          {/* High Quality */}
          <div className="glass rounded-3xl p-8 text-center hover:scale-105 transition-all duration-500 group border border-white/20 backdrop-blur-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">🎯 Premium Quality</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Download in <span className="text-blue-400 font-semibold">up to 4K resolution</span> with crystal clear audio quality that preserves every detail.
            </p>
          </div>

          {/* Easy to Use */}
          <div className="glass rounded-3xl p-8 text-center hover:scale-105 transition-all duration-500 group border border-white/20 backdrop-blur-2xl">
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">🔒 Simple & Secure</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              <span className="text-green-400 font-semibold">100% secure and private</span> - no registration required. Your data never leaves your device.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <div className="glass rounded-3xl p-8 inline-block border border-white/20 backdrop-blur-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-gray-300 text-lg">Crafted with</span>
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="text-gray-300 text-lg">for video enthusiasts worldwide</span>
            </div>
            <p className="text-gray-400">
              This tool is designed for educational purposes only. Please respect copyright laws and YouTube's terms of service.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
