#!/usr/bin/env node
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🚀 YouTube Downloader - Ultimate Startup & Debug Script');
console.log('=====================================================');

const projectDir = 'c:\\Users\\acer\\Desktop\\YouTube Downloader\\frontend';
process.chdir(projectDir);

console.log(`📂 Working directory: ${process.cwd()}`);

// Step 1: Check prerequisites
console.log('\n1️⃣ Checking prerequisites...');

// Check Node.js
try {
  const nodeVersion = require('child_process').execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js not found or not working');
  process.exit(1);
}

// Check package.json
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found');
  process.exit(1);
}
console.log('✅ package.json found');

// Step 2: Install dependencies
console.log('\n2️⃣ Checking dependencies...');
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    require('child_process').execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }
} else {
  console.log('✅ node_modules exists');
}

// Step 3: Clean build
console.log('\n3️⃣ Cleaning previous builds...');
if (fs.existsSync('.next')) {
  fs.rmSync('.next', { recursive: true, force: true });
  console.log('✅ Cleaned .next directory');
}

// Step 4: Check for port availability
console.log('\n4️⃣ Checking port availability...');
async function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.close();
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function findAvailablePort() {
  for (let port = 3000; port <= 3010; port++) {
    if (await checkPort(port)) {
      console.log(`✅ Port ${port} is available`);
      return port;
    }
    console.log(`⚠️ Port ${port} is in use`);
  }
  console.error('❌ No available ports found');
  return null;
}

// Step 5: Try to build the project
console.log('\n5️⃣ Testing build...');
try {
  require('child_process').execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful');
} catch (error) {
  console.log('⚠️ Build failed, trying to continue with dev server...');
}

// Step 6: Start development server
async function startServer() {
  const availablePort = await findAvailablePort();
  if (!availablePort) {
    console.error('❌ Cannot start server - no available ports');
    startFallbackServer();
    return;
  }

  console.log(`\n6️⃣ Starting Next.js development server on port ${availablePort}...`);
  
  const env = { ...process.env, PORT: availablePort.toString() };
  const server = spawn('npm', ['run', 'dev'], { 
    stdio: 'pipe',
    shell: true,
    env
  });
  
  let serverStarted = false;
  
  server.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`📡 ${output.trim()}`);
    
    if ((output.includes('Ready') || output.includes('started server')) && !serverStarted) {
      serverStarted = true;
      console.log('\n🎉 SUCCESS! Next.js server is running!');
      console.log(`🌐 Open your browser to: http://localhost:${availablePort}`);
      console.log('✅ You can now test the YouTube Downloader!');
      
      // Test the server after a short delay
      setTimeout(() => testServerResponse(availablePort), 3000);
    }
  });
  
  server.stderr.on('data', (data) => {
    const error = data.toString();
    console.error(`❌ Server Error: ${error.trim()}`);
    
    if (error.includes('EADDRINUSE')) {
      console.log('⚠️ Port conflict detected, trying fallback server...');
      server.kill();
      startFallbackServer();
    }
  });
  
  server.on('close', (code) => {
    if (!serverStarted) {
      console.log(`⚠️ Server exited with code ${code}, starting fallback...`);
      startFallbackServer();
    }
  });

  // Timeout fallback
  setTimeout(() => {
    if (!serverStarted) {
      console.log('⚠️ Server startup timeout, starting fallback...');
      server.kill();
      startFallbackServer();
    }
  }, 30000);
}

// Fallback simple server
function startFallbackServer() {
  console.log('\n🔄 Starting fallback HTTP server...');
  
  const fallbackServer = http.createServer((req, res) => {
    const url = req.url;
    
    if (url === '/' || url === '/index.html') {
      // Serve our HTML file
      const htmlPath = path.join(__dirname, 'public', 'index.html');
      if (fs.existsSync(htmlPath)) {
        const html = fs.readFileSync(htmlPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>YouTube Downloader - Fallback</title>
            <style>
              body { background: linear-gradient(135deg, #000 0%, #333 100%); color: white; font-family: Arial; text-align: center; padding: 50px; }
              h1 { color: #ff6b6b; font-size: 3rem; }
              .status { background: rgba(255,165,0,0.2); padding: 20px; border-radius: 10px; margin: 20px; }
            </style>
          </head>
          <body>
            <h1>🎥 YouTube Downloader</h1>
            <div class="status">
              ⚠️ Fallback Server Mode<br>
              ✅ Basic server is working!<br>
              🔧 Next.js server needs debugging
            </div>
            <p>The basic server is working. This proves the concept is sound.</p>
            <p>Next.js server may need manual startup or debugging.</p>
          </body>
          </html>
        `);
      }
    } else if (url === '/api/test') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'working', 
        message: 'Fallback server API is responding',
        timestamp: new Date().toISOString()
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });
  
  fallbackServer.listen(3000, () => {
    console.log('✅ Fallback server running at http://localhost:3000');
    console.log('🌐 You can test the basic functionality now!');
  });
}

async function testServerResponse(port) {
  try {
    const response = await fetch(`http://localhost:${port}`);
    if (response.ok) {
      console.log('✅ Server is responding correctly!');
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.log(`⚠️ Server test failed: ${error.message}`);
  }
}

// Start the process
startServer();
