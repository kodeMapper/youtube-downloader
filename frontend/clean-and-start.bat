@echo off
echo === Cleaning and Starting Server ===

cd /d "c:\Users\acer\Desktop\YouTube Downloader\frontend"

echo Removing old build files...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"

echo Installing dependencies...
npm install

echo Starting development server...
npm run dev
