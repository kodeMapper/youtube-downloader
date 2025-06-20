"use client";

import { useState, useEffect } from 'react';
import { Download, Youtube, Check, Link } from "lucide-react";

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

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
      alert('Please enter a YouTube URL');
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(10); // Start progress
    
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to download video' }));
        throw new Error(errorData.error || 'Failed to download video');
      }

      // For medium to large files, we'll get a blob
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
      
      alert('Download started!');
      setDownloadProgress(100);
    } catch (error) {
      console.error('Download error:', error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-br from-black to-gray-900">
      <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-3xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center mb-2">
            <Youtube size={40} className="text-red-600 mr-2" />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-red-500 to-amber-500">
              YouTube Downloader
            </h1>
          </div>
          <p className="text-gray-300 max-w-lg">
            Fast, reliable, and easy-to-use YouTube video downloader. Just paste the URL and click download.
          </p>
        </div>

        {/* Download Form */}
        <div className="w-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row w-full items-stretch space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="block w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500"
                  disabled={isDownloading}
                />
              </div>
              <button
                onClick={handleDownload}
                disabled={isDownloading || !url}
                className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                  isDownloading || !url 
                  ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white'
                }`}
              >
                {isDownloading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download size={20} className="mr-2" />
                    Download
                  </span>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {downloadProgress > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                <div 
                  className="bg-gradient-to-r from-red-500 to-amber-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            )}

            {downloadProgress === 100 && !isDownloading && (
              <div className="flex items-center justify-center mt-2 text-green-400">
                <Check size={16} className="mr-1" />
                <span>Download complete!</span>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Download className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast Download</h3>
            <p className="text-gray-400 text-sm">Our service uses optimized methods to download videos at maximum speed.</p>
          </div>

          <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Check className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">High Quality</h3>
            <p className="text-gray-400 text-sm">Download videos in the best quality available from YouTube.</p>
          </div>

          <div className="flex flex-col items-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Youtube className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-400 text-sm">Just paste the URL, click download and you're done!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-400 text-center pt-8">
          <p>Made with ❤️ for video enthusiasts</p>
          <p className="mt-1">This tool is for educational purposes only. Please respect copyright laws.</p>
        </div>
      </div>
    </main>
  );
}
