"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Download, Youtube, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function HomePageDev() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

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
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to download video');
      }

      const data = await response.json();
      
      // Create an invisible anchor to trigger download
      const a = document.createElement('a');
      a.href = data.downloadUrl;
      a.download = data.filename || 'youtube-video';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download video');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold flex items-center justify-center gap-3">
            <Youtube className="text-red-500" />
            YouTube Downloader (Dev Mode)
          </h1>
          
          <p className="mt-4 text-xl text-gray-300">
            Download any YouTube video with just a link
          </p>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Paste YouTube URL here"
              className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isDownloading}
            />
            <button
              className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                isDownloading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
              }`}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
        
        <p className="text-center text-sm text-yellow-500">
          ⚠️ Development mode active - Complex animations disabled for faster performance
        </p>

        <div className="text-center text-sm text-gray-400">
          <p>✨ Fast and secure download • No ads • High quality</p>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </main>
  );
}
