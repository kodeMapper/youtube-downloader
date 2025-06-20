# Build and Start Next.js App
Write-Host "YouTube Downloader - Quick Start Script" -ForegroundColor Green

# Function to check if port is in use
function Test-PortInUse {
    param(
        [int] $Port
    )

    try {
        $null = New-Object System.Net.Sockets.TcpClient "localhost", $Port
        return $true
    } catch {
        return $false
    }
}

# Find an available port
$port = 3000
while (Test-PortInUse -Port $port) {
    Write-Host "Port $port is in use, trying next port..." -ForegroundColor Yellow
    $port++
    if ($port -gt 3010) {
        Write-Host "No available ports found in the range 3000-3010" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Starting app on port $port..." -ForegroundColor Blue

# Ensure NPM dependencies are installed
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

# Remove any lock files that might cause problems
if (Test-Path "c:\Users\acer\Desktop\YouTube Downloader\frontend\.next") {
    Write-Host "Cleaning build cache..." -ForegroundColor Blue
    Remove-Item -Recurse -Force "c:\Users\acer\Desktop\YouTube Downloader\frontend\.next"
}

# Build and start the app
Write-Host "Starting development server..." -ForegroundColor Green
$env:PORT = $port
npm run dev
