# Fast development script for YouTube Downloader
Write-Host "YouTube Downloader Fast Development Setup" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

# Kill existing Next.js processes if any are running
Write-Host "Stopping any running Next.js processes..." -ForegroundColor Yellow
$nextProcesses = Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.CommandLine -like "*next*" }
if ($nextProcesses) {
    $nextProcesses | ForEach-Object { Stop-Process -Id $_.Id -Force }
    Write-Host "Stopped running Next.js processes." -ForegroundColor Green
}

# Clean cache files
Write-Host "Cleaning build cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Create minimal .env file to speed up startup
@"
# Environment variables for faster development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
"@ | Out-File -FilePath ".env.local" -Encoding utf8 -Force

# Start with optimized dev server
Write-Host "Starting optimized development server..." -ForegroundColor Green
$env:NODE_OPTIONS="--max-old-space-size=4096"
npx next dev
