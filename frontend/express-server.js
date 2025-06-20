const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Express server as fallback...');

const app = express();
const PORT = 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Basic API endpoints for testing
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'working', 
    message: 'Express fallback server is running!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/download', express.json(), (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }
  
  // For testing, return a success response
  res.json({ 
    status: 'success',
    message: 'URL validated successfully! (Full download requires Python/yt-dlp setup)',
    url: url
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Try to start Next.js in background
const tryNextServer = () => {
  console.log('🔄 Attempting to start Next.js server...');
  const nextProcess = spawn('npm', ['run', 'dev'], { 
    stdio: 'pipe',
    shell: true 
  });
  
  nextProcess.stdout.on('data', (data) => {
    console.log(`Next.js: ${data.toString().trim()}`);
  });
  
  nextProcess.stderr.on('data', (data) => {
    console.log(`Next.js Error: ${data.toString().trim()}`);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
  });
};

app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'public')}`);
  console.log(`🧪 Test API at: http://localhost:${PORT}/api/test`);
  console.log('\n🌐 Open http://localhost:3000 to see the YouTube Downloader!');
  
  // Try to start Next.js as well
  setTimeout(tryNextServer, 2000);
});

module.exports = app;
