#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 YouTube Downloader - Auto Start & Test Script');
console.log('================================================');

// Change to the frontend directory
process.chdir('c:\\Users\\acer\\Desktop\\YouTube Downloader\\frontend');

console.log(`📂 Working directory: ${process.cwd()}`);

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found!');
    process.exit(1);
}

console.log('✅ package.json found');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    const npmInstall = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
    
    npmInstall.on('close', (code) => {
        if (code !== 0) {
            console.error('❌ npm install failed');
            process.exit(1);
        }
        startServer();
    });
} else {
    console.log('✅ node_modules found');
    startServer();
}

function startServer() {
    console.log('🔄 Starting Next.js development server...');
    
    const server = spawn('npm', ['run', 'dev'], { 
        stdio: 'pipe', 
        shell: true 
    });
    
    server.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`📡 ${output.trim()}`);
        
        if (output.includes('Ready') || output.includes('started server')) {
            console.log('✅ Server is ready!');
            console.log('🌐 Opening browser at http://localhost:3000');
            
            // Test the server
            setTimeout(() => {
                testServer();
            }, 2000);
        }
    });
    
    server.stderr.on('data', (data) => {
        console.error(`❌ ${data.toString().trim()}`);
    });
    
    server.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
    });
}

async function testServer() {
    try {
        const response = await fetch('http://localhost:3000');
        console.log('✅ Server responding successfully!');
        console.log('🎉 YouTube Downloader is ready to use!');
    } catch (error) {
        console.error(`❌ Server test failed: ${error.message}`);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down...');
    process.exit(0);
});
