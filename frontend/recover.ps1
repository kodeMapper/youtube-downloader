#!/bin/powershell
# YouTube Downloader Recovery Script

Write-Host "YouTube Downloader Recovery Tool" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

# Clean build artifacts
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Create fresh environment
Write-Host "Creating development environment..." -ForegroundColor Yellow
@"
# Recovery environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
NEXT_IGNORE_MIDDLEWARE_WARNINGS=1
"@ | Out-File -FilePath ".env.local" -Encoding utf8 -Force

# Fix package versions
Write-Host "Checking compatibility between React and Next.js..." -ForegroundColor Yellow
$packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
$reactVersion = $packageJson.dependencies.react
$nextVersion = $packageJson.dependencies.next

Write-Host "React: $reactVersion | Next.js: $nextVersion" -ForegroundColor Yellow

# Use appropriate Next.js version for React 18
if ($reactVersion -like "^19*" -or $reactVersion -like "19*") {
    Write-Host "You're using React 19, which requires careful Next.js configuration" -ForegroundColor Yellow
    Write-Host "Creating compatibility mode..." -ForegroundColor Yellow
    
    # Create special next.config.js for React 19
    @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
  transpilePackages: ['framer-motion'],
  
  webpack: (config) => {
    // Fix incompatibilities between React 19 and older Next.js
    config.resolve.alias = {
      ...config.resolve.alias,
      'middleware-manifest.json': false,
    };
    
    return config;
  },
}

module.exports = nextConfig
"@ | Out-File -FilePath "next.config.js" -Encoding utf8 -Force
}

# Run npm install with legacy peer deps to fix dependency issues
Write-Host "Reinstalling dependencies with compatibility mode..." -ForegroundColor Yellow
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm install --legacy-peer-deps

Write-Host "Starting development server..." -ForegroundColor Green
npm run dev
