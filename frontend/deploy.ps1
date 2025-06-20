#!/bin/powershell
# YouTube Downloader Production Deployment Script

Write-Host "YouTube Downloader Production Deployment" -ForegroundColor Cyan
Write-Host "--------------------------------------" -ForegroundColor Cyan

# Ensure clean build
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Create production environment file
Write-Host "Creating production environment variables..." -ForegroundColor Yellow
@"
# Production environment variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_IGNORE_MIDDLEWARE_WARNINGS=1

# API configuration for production
NEXT_PUBLIC_API_URL=/api
API_URL=/api

# Download configuration 
NEXT_PUBLIC_MAX_FILE_SIZE=1073741824
"@ | Out-File -FilePath ".env.production" -Encoding utf8 -Force

# Set memory limits for build
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Create optimized next.config.js for production
@"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
    unoptimized: true,
  },
  transpilePackages: ['framer-motion'],
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
"@ | Out-File -FilePath "next.config.js" -Encoding utf8 -Force

# Execute production build
Write-Host "Building production version..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host "To start the production server, run: npm run start" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
