// Backend configuration for YouTube Downloader
// This file helps define settings for API routes

/**
 * Configuration for video download options
 */
export const downloadConfig = {
  // Temporary directory for downloads
  tempDir: '/tmp/youtube-downloads',
  
  // Options for yt-dlp
  ytDlpOptions: {
    // Default format options (high quality video + audio)
    formatOptions: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    
    // Maximum concurrent downloads
    maxConcurrent: 2,
    
    // Default timeout in seconds
    timeout: 300,
  },
  
  // File cleanup settings
  cleanup: {
    // Time in minutes after which temporary files should be deleted
    tempFileExpiryMinutes: 30,
    
    // Schedule automated cleanup
    enableScheduledCleanup: true,
  }
};

/**
 * Security and rate limiting options
 */
export const securityConfig = {
  // Rate limiting
  rateLimit: {
    // Number of requests allowed in the windowMs period
    limit: 10,
    
    // Time window in milliseconds
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Allowed video sources (can be expanded)
  allowedSources: [
    'youtube.com',
    'youtu.be',
    'm.youtube.com',
    'youtube-nocookie.com',
  ]
};

/**
 * Error messages used across the API
 */
export const errorMessages = {
  invalidUrl: 'Please provide a valid YouTube URL',
  downloadFailed: 'Failed to download video. Please try again later.',
  processingError: 'Error processing video. Please try a different video.',
  rateLimited: 'Too many download requests. Please try again later.',
  serverError: 'Server error occurred. Please try again later.',
};
