@echo off
echo Checking YouTube Downloader App...
cd /d "c:\Users\acer\Desktop\YouTube Downloader\frontend"

echo Installing dependencies...
call npm install

echo Building the application...
call npm run build

echo Starting development server...
call npm run dev

pause
