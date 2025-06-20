#!/bin/powershell
# YouTube Downloader Production Build Script

Write-Host "YouTube Downloader Production Build" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

# Ensure clean build
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Create optimal production settings
Write-Host "Creating production environment variables..." -ForegroundColor Yellow
@"
# Production environment variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
"@ | Out-File -FilePath ".env.production" -Encoding utf8 -Force

# Set memory limits for build
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Execute production build
Write-Host "Building production version..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "To start the production server, run: npm run start" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
