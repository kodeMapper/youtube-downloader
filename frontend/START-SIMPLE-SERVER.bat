@echo off
echo ========================================
echo YouTube Downloader - Simple Test Server
echo ========================================
echo.

cd /d "c:\Users\acer\Desktop\YouTube Downloader\frontend"

echo Starting simple HTTP server on port 3000...
echo.
echo The server will serve the HTML version of the app
echo while we debug the Next.js issues.
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

node simple-server.js
