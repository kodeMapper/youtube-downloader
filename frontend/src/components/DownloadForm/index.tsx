"use client";

import { useState } from 'react';
import { Download, Link } from "lucide-react";

interface DownloadFormProps {
  onDownload: (url: string) => Promise<void>;
  isDownloading: boolean;
  downloadProgress: number;
}

export function DownloadForm({ onDownload, isDownloading, downloadProgress }: DownloadFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !isDownloading) {
      onDownload(url);
    }
  };

  return (
    <div className="w-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
            type="submit"
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Download complete!</span>
          </div>
        )}
      </form>
    </div>
  );
}
