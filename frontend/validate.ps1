# YouTube Downloader - Final Validation Script
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "YouTube Downloader - Final Validation" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

# Check Node.js installation
Write-Host "`n1. Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js v16+" -ForegroundColor Red
    exit 1
}

# Check Python installation
Write-Host "`n2. Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ Python version: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.7+" -ForegroundColor Red
    exit 1
}

# Check project structure
Write-Host "`n3. Validating project structure..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "next.config.js",
    "tailwind.config.ts",
    "src\app\page.jsx",
    "src\app\layout.tsx",
    "src\app\api\download\route.ts",
    "src\app\api\cleanup\route.ts"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    }
}

# Install dependencies
Write-Host "`n4. Installing dependencies..." -ForegroundColor Yellow
npm install

# Build check
Write-Host "`n5. Testing build..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed. Check console for errors." -ForegroundColor Red
}

# Check for port availability
Write-Host "`n6. Checking available ports..." -ForegroundColor Yellow
$availablePorts = @()
for ($port = 3000; $port -le 3005; $port++) {
    try {
        $null = New-Object System.Net.Sockets.TcpClient "localhost", $port
        Write-Host "Port $port is in use" -ForegroundColor Yellow
    } catch {
        $availablePorts += $port
        Write-Host "✅ Port $port is available" -ForegroundColor Green
        break
    }
}

if ($availablePorts.Count -eq 0) {
    Write-Host "❌ No available ports found. Please close other applications." -ForegroundColor Red
} else {
    $usePort = $availablePorts[0]
    Write-Host "✅ Will use port: $usePort" -ForegroundColor Green
}

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "Validation Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open browser to: http://localhost:$usePort" -ForegroundColor White
Write-Host "3. Test with a YouTube URL" -ForegroundColor White

Write-Host "`nQuick Start Options:" -ForegroundColor Cyan
Write-Host "• Double-click RUN-APP.bat" -ForegroundColor White
Write-Host "• Run: .\start-app.ps1" -ForegroundColor White
Write-Host "• Manual: npm run dev" -ForegroundColor White

Write-Host "`n=========================================" -ForegroundColor Cyan
