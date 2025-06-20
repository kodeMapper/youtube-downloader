import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testServer() {
  try {
    console.log('Testing server startup...');
    
    // Try to start the server
    const serverProcess = exec('npm run dev');
    
    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
      if (data.includes('Ready') || data.includes('started server')) {
        console.log('✅ Server started successfully!');
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });
    
    // Wait a bit then test
    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:3000');
        console.log('✅ Server is responding!');
      } catch (error) {
        console.error('❌ Server not responding:', error.message);
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
}

testServer();
