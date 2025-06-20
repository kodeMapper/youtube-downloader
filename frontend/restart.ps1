# Simple script to restart Next.js
Write-Host "Stopping all Next.js processes..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq 'node' } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Cleaning .next folder..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Starting development server..." -ForegroundColor Green
npm run dev
