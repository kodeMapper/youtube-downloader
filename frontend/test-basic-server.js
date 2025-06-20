const { execSync } = require('child_process');
const http = require('http');

console.log('🧪 Testing YouTube Downloader Server Startup');
console.log('===========================================');

// Test Node.js
try {
  console.log('✅ Node.js is working');
} catch (error) {
  console.error('❌ Node.js test failed:', error.message);
  process.exit(1);
}

// Test if we can reach port 3000
function testPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.close();
      resolve(true);
    });
    server.on('error', () => {
      resolve(false);
    });
  });
}

async function main() {
  // Test port availability
  const port3000Available = await testPort(3000);
  console.log(`Port 3000 available: ${port3000Available ? '✅' : '❌'}`);
  
  if (!port3000Available) {
    console.log('Port 3000 is in use. Trying port 3001...');
    const port3001Available = await testPort(3001);
    console.log(`Port 3001 available: ${port3001Available ? '✅' : '❌'}`);
  }
  
  // Try to start a simple test server
  console.log('\n📡 Starting test server...');
  
  const testServer = http.createServer((req, res) => {
    if (req.url === '/test') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>YouTube Downloader - Test</title>
          <style>
            body { 
              background: linear-gradient(135deg, #000 0%, #333 100%); 
              color: white; 
              font-family: Arial; 
              text-align: center; 
              padding: 50px; 
            }
            h1 { color: #ff6b6b; }
            .status { background: rgba(0,255,0,0.2); padding: 20px; border-radius: 10px; margin: 20px; }
          </style>
        </head>
        <body>
          <h1>🎉 YouTube Downloader Test Server</h1>
          <div class="status">
            ✅ HTTP Server is working!<br>
            ✅ Basic HTML/CSS is working!<br>
            🔄 Next.js server: Testing...
          </div>
          <p>This confirms the basic server functionality works.</p>
          <p>Now we need to get the Next.js server running.</p>
        </body>
        </html>
      `);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });
  
  const testPort = port3000Available ? 3000 : 3001;
  
  testServer.listen(testPort, () => {
    console.log(`✅ Test server running at http://localhost:${testPort}/test`);
    console.log(`\n🌐 Open this URL to verify the server works:`);
    console.log(`   http://localhost:${testPort}/test`);
    console.log(`\nPress Ctrl+C to stop the test server`);
  });
  
  testServer.on('error', (error) => {
    console.error('❌ Test server failed:', error.message);
  });
}

main();
