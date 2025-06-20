@echo off
title YouTube Downloader - Final Startup
color 0A

echo ==========================================
echo   YOUTUBE DOWNLOADER - FINAL STARTUP
echo ==========================================
echo.

cd /d "c:\Users\acer\Desktop\YouTube Downloader\frontend"

echo 1. Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo.
echo 2. Checking for build errors...
call npm run build > build.log 2>&1
if errorlevel 1 (
    echo BUILD ERRORS DETECTED:
    type build.log
    echo.
    echo Continuing with Express fallback server...
) else (
    echo Build successful!
)

echo.
echo 3. Starting server...
echo Starting Express fallback server on port 3000...
echo.
echo ==========================================
echo  SERVER STARTING - DO NOT CLOSE THIS WINDOW
echo ==========================================
echo  Open your browser to: http://localhost:3000
echo ==========================================
echo.

node express-server.js

pause
