#!/bin/powershell
# YouTube Downloader Process Manager

Write-Host "YouTube Downloader Process Manager" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan

# Find all Next.js processes
$nextProcesses = Get-Process | Where-Object { ($_.ProcessName -like "*node*") -and ($_.CommandLine -like "*next*") }

if ($nextProcesses.Count -eq 0) {
    Write-Host "No Next.js processes found running." -ForegroundColor Green
} else {
    Write-Host "Found $($nextProcesses.Count) Next.js processes running:" -ForegroundColor Yellow
    
    $i = 1
    foreach ($process in $nextProcesses) {
        Write-Host "$i. PID: $($process.Id), Command: $($process.CommandLine)" -ForegroundColor Yellow
        $i++
    }
    
    Write-Host "`nOptions:" -ForegroundColor Cyan
    Write-Host "1. Stop all Next.js processes" -ForegroundColor White
    Write-Host "2. Stop a specific process" -ForegroundColor White  
    Write-Host "3. Exit without changes" -ForegroundColor White
    
    $option = Read-Host "Enter option number"
    
    switch ($option) {
        "1" {
            Write-Host "Stopping all Next.js processes..." -ForegroundColor Red
            $nextProcesses | ForEach-Object { Stop-Process -Id $_.Id -Force }
            Write-Host "All Next.js processes stopped." -ForegroundColor Green
        }
        "2" {
            $pid = Read-Host "Enter the PID of the process to stop"
            try {
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "Process with PID $pid stopped." -ForegroundColor Green
            } catch {
                Write-Host "Failed to stop process with PID $pid. Error: $_" -ForegroundColor Red
            }
        }
        "3" {
            Write-Host "Exiting without changes." -ForegroundColor Cyan
        }
        default {
            Write-Host "Invalid option. Exiting." -ForegroundColor Red
        }
    }
}

Write-Host "`nProcess management complete." -ForegroundColor Cyan
Write-Host "To start a clean development server, run: .\clean-start.ps1" -ForegroundColor Cyan
