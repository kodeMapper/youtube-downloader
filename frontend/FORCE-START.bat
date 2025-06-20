@echo off
echo Stopping any existing Node processes...
taskkill /im node.exe /f > nul 2>&1

echo Starting fresh Next.js development server...
cd /d "c:\Users\acer\Desktop\YouTube Downloader\frontend"

echo Running npm run dev...
start cmd /k "npm run dev"

echo Server starting... Check ports 3000-3006 in a few seconds
timeout /t 5

echo Opening browser...
start http://localhost:3000
