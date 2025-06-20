@echo off
echo === YouTube Downloader Server Test ===
cd /d "c:\Users\acer\Desktop\YouTube Downloader\frontend"

echo Checking Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js is installed.

echo.
echo Installing/updating dependencies...
npm install

echo.
echo Attempting to start server...
echo Press Ctrl+C to stop the server when done testing
echo.
start /B npm run dev

echo.
echo Waiting for server to start...
timeout /t 10 /nobreak > nul

echo.
echo Testing server...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing | Out-Null; Write-Host 'SUCCESS: Server is running on http://localhost:3000' -ForegroundColor Green } catch { Write-Host 'FAILED: Server not responding' -ForegroundColor Red }"

echo.
echo Opening browser to test...
start http://localhost:3000

echo.
echo Server should be running. Check the browser window.
echo Press any key to continue...
pause > nul
