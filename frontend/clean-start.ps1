#!/bin/powershell
# YouTube Downloader Clean Start Script

Write-Host "YouTube Downloader Clean Start" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Clean build artifacts
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Clean node_modules
Write-Host "Do you want to clean node_modules? This will require reinstalling all dependencies. (y/n)" -ForegroundColor Yellow
$cleanModules = Read-Host

if ($cleanModules -eq "y") {
    Write-Host "Cleaning node_modules... (this may take a while)" -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

# Create clean environment
Write-Host "Creating clean environment..." -ForegroundColor Yellow
@"
# Clean environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
"@ | Out-File -FilePath ".env.local" -Encoding utf8 -Force

# Set memory limits for build
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Start development server
Write-Host "Starting development server..." -ForegroundColor Green
npm run dev
