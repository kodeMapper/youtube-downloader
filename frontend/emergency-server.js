const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log('Request for:', req.url);
  
  // Serve the main page
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Downloader</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="text-center mb-16">
            <div class="flex justify-center items-center mb-8">
                <div class="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-3xl shadow-2xl">
                    <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </div>
            </div>
            <h1 class="text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6">
                YouTube Downloader
            </h1>
            <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Experience the <span class="text-red-400 font-semibold">fastest and most reliable</span> YouTube video downloader.
                <br/>Just paste your URL and watch the magic happen! ✨
            </p>
        </header>

        <!-- Main Download Section -->
        <div class="max-w-4xl mx-auto mb-20">
            <div class="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div class="flex items-center gap-4 mb-8">
                    <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                    </svg>
                    <h2 class="text-3xl font-bold text-white">Enter YouTube URL</h2>
                </div>
                
                <div class="space-y-6">
                    <div class="relative">
                        <input
                            type="text"
                            id="urlInput"
                            placeholder="Paste your YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
                            class="w-full px-6 py-4 text-lg bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
                        />
                    </div>

                    <button
                        onclick="downloadVideo()"
                        class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-3 text-lg"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Download Video Now
                    </button>

                    <div id="message" class="hidden p-4 rounded-xl"></div>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
            <div class="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div class="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">⚡ Lightning Fast</h3>
                <p class="text-gray-300 leading-relaxed">
                    Our advanced algorithms ensure maximum download speeds with optimized compression technology.
                </p>
            </div>

            <div class="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">🎯 Premium Quality</h3>
                <p class="text-gray-300 leading-relaxed">
                    Download in up to 4K resolution with crystal clear audio quality that preserves every detail.
                </p>
            </div>

            <div class="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                <div class="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-white mb-4">🔒 Simple & Secure</h3>
                <p class="text-gray-300 leading-relaxed">
                    100% secure and private - no registration required. Your data never leaves your device.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <footer class="text-center">
            <div class="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 inline-block">
                <div class="flex items-center justify-center gap-2 mb-2">
                    <span class="text-gray-300">Crafted with</span>
                    <div class="w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
                    <span class="text-gray-300">for video enthusiasts worldwide</span>
                </div>
                <p class="text-gray-400 text-sm">
                    This tool is designed for educational purposes only. Please respect copyright laws.
                </p>
            </div>
        </footer>
    </div>

    <script>
        function downloadVideo() {
            const urlInput = document.getElementById('urlInput');
            const messageDiv = document.getElementById('message');
            const url = urlInput.value.trim();
            
            if (!url) {
                showMessage('Please enter a YouTube URL', 'error');
                return;
            }
            
            if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
                showMessage('Please enter a valid YouTube URL', 'error');
                return;
            }
            
            showMessage('Download functionality will be implemented with the API backend!', 'success');
        }
        
        function showMessage(text, type) {
            const messageDiv = document.getElementById('message');
            messageDiv.className = type === 'error' 
                ? 'p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200'
                : 'p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200';
            messageDiv.textContent = text;
            messageDiv.classList.remove('hidden');
            
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        }
    </script>
</body>
</html>
    `);
    return;
  }
  
  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`✅ YouTube Downloader server running at http://localhost:${PORT}`);
  console.log('🎉 Beautiful interface is now available!');
});
