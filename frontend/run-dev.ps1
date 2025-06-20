# Run script for YouTube Downloader
Write-Host "YouTube Downloader Development Setup" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Check if node modules exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "Node modules found" -ForegroundColor Green
}

# Check for conflicts
if ((Test-Path "src\app\page.tsx") -and (Test-Path "src\app\page.jsx")) {
    Write-Host "Conflict detected: Both page.tsx and page.jsx exist" -ForegroundColor Red
    Write-Host "Creating backup of page.tsx and removing it..." -ForegroundColor Yellow
    Copy-Item "src\app\page.tsx" -Destination "src\app\page.tsx.backup" -Force
    Remove-Item "src\app\page.tsx" -Force
    Write-Host "Conflict resolved: Using page.jsx as the main page" -ForegroundColor Green
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Cyan
npm run dev
