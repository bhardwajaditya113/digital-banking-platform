# Fix and Start All Services Script
$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FIXING AND STARTING ALL SERVICES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check .NET SDK
$dotnetPath = "C:\Program Files\dotnet\dotnet.exe"
if (-not (Test-Path $dotnetPath)) {
    Write-Host "[ERROR] .NET SDK not found at $dotnetPath" -ForegroundColor Red
    Write-Host "Please install .NET 8.0 SDK" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] .NET SDK found" -ForegroundColor Green

# Check Docker
try {
    docker ps | Out-Null
    Write-Host "[OK] Docker is running" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker is not running. Please start Docker Desktop" -ForegroundColor Red
    exit 1
}

# Start Infrastructure if not running
Write-Host "`nChecking infrastructure services..." -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}}"
$required = @("banking-sqlserver", "banking-mongodb", "banking-kafka", "banking-redis")
$missing = @()

foreach ($req in $required) {
    if ($containers -notmatch $req) {
        $missing += $req
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Starting missing infrastructure services..." -ForegroundColor Yellow
    docker-compose -f docker-compose.infrastructure.yml up -d
    Write-Host "Waiting 30 seconds for databases to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
} else {
    Write-Host "[OK] All infrastructure services running" -ForegroundColor Green
}

# Kill existing backend processes
Write-Host "`nStopping any existing backend services..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*Auth*" -or $_.MainWindowTitle -like "*Account*" -or $_.MainWindowTitle -like "*Transaction*" -or $_.MainWindowTitle -like "*Notification*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend Services
Write-Host "`nStarting backend services..." -ForegroundColor Cyan
$services = @(
    @{Name="Auth Service"; Path="src\backend\services\AuthService\AuthService.API"; Port=5001},
    @{Name="Account Service"; Path="src\backend\services\AccountService\AccountService.API"; Port=5002},
    @{Name="Transaction Service"; Path="src\backend\services\TransactionService\TransactionService.API"; Port=5003},
    @{Name="Notification Service"; Path="src\backend\services\NotificationService\NotificationService.API"; Port=5004}
)

foreach ($service in $services) {
    $servicePath = Join-Path $projectRoot $service.Path
    if (Test-Path $servicePath) {
        Write-Host "Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Yellow
        
        $command = "cd '$servicePath'; Write-Host 'Starting $($service.Name)...' -ForegroundColor Cyan; & '$dotnetPath' run"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
        
        Write-Host "  [OK] $($service.Name) starting" -ForegroundColor Green
        Start-Sleep -Seconds 3
    } else {
        Write-Host "  [FAIL] Path not found: $servicePath" -ForegroundColor Red
    }
}

# Start Frontend
Write-Host "`nStarting frontend..." -ForegroundColor Cyan
$frontendPath = Join-Path $projectRoot "src\frontend"
if (Test-Path $frontendPath) {
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    $frontendRunning = $false
    
    if ($nodeProcesses) {
        # Check if port 3000 is in use
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
            $frontendRunning = $true
        } catch {
            $frontendRunning = $false
        }
    }
    
    if (-not $frontendRunning) {
        Write-Host "Starting React app..." -ForegroundColor Yellow
        $command = "cd '$frontendPath'; Write-Host 'Starting React app...' -ForegroundColor Cyan; npm start"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
        Write-Host "  [OK] Frontend starting" -ForegroundColor Green
    } else {
        Write-Host "  [OK] Frontend already running" -ForegroundColor Green
    }
} else {
    Write-Host "  [FAIL] Frontend path not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 60 seconds for services to fully initialize, then:" -ForegroundColor Yellow
Write-Host "  1. Check service health: .\scripts\quick-test.ps1" -ForegroundColor White
Write-Host "  2. Open frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  3. Test the application!" -ForegroundColor White
Write-Host ""


