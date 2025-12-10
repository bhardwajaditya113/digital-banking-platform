# Comprehensive Startup and Test Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Digital Banking Platform" -ForegroundColor Cyan
Write-Host "  Startup and Test Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"

# Step 1: Check Prerequisites
Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Yellow

# Check Docker
$dockerRunning = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
if (-not $dockerRunning) {
    Write-Host "  ⚠️  Docker Desktop is NOT running" -ForegroundColor Yellow
    Write-Host "  Please start Docker Desktop and wait for it to be ready, then run this script again." -ForegroundColor Yellow
    Write-Host "  Press any key to continue anyway..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} else {
    Write-Host "  ✅ Docker Desktop is running" -ForegroundColor Green
}

# Check .NET SDK
$dotnetVersion = dotnet --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ .NET SDK: $dotnetVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ .NET SDK not found" -ForegroundColor Red
    exit 1
}

# Check Node.js
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js not found" -ForegroundColor Red
    exit 1
}

# Step 2: Start Infrastructure
Write-Host "`nStep 2: Starting Infrastructure Services..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\.."

if (Test-Path "docker-compose.infrastructure.yml") {
    Write-Host "  Starting Docker infrastructure..." -ForegroundColor Cyan
    docker-compose -f docker-compose.infrastructure.yml up -d
    
    Write-Host "  Waiting 30 seconds for services to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host "  Checking infrastructure status..." -ForegroundColor Cyan
    docker ps --format "  {{.Names}}: {{.Status}}" | Select-Object -First 7
} else {
    Write-Host "  ⚠️  docker-compose.infrastructure.yml not found" -ForegroundColor Yellow
}

# Step 3: Build Backend Services
Write-Host "`nStep 3: Building Backend Services..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\..\src\backend"

if (Test-Path "BankingPlatform.sln") {
    Write-Host "  Building solution..." -ForegroundColor Cyan
    dotnet build BankingPlatform.sln --no-incremental 2>&1 | Select-String -Pattern "error|Error|ERROR|succeeded|failed" | Select-Object -Last 5
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Backend build succeeded" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Backend build had warnings/errors" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  Solution file not found" -ForegroundColor Yellow
}

# Step 4: Start Backend Services
Write-Host "`nStep 4: Starting Backend Services..." -ForegroundColor Yellow
Write-Host "  Starting services in separate windows..." -ForegroundColor Cyan

$services = @(
    @{ Name = "AuthService"; Path = "services\AuthService\AuthService.API"; Port = 5001 },
    @{ Name = "AccountService"; Path = "services\AccountService\AccountService.API"; Port = 5002 },
    @{ Name = "TransactionService"; Path = "services\TransactionService\TransactionService.API"; Port = 5003 },
    @{ Name = "NotificationService"; Path = "services\NotificationService\NotificationService.API"; Port = 5004 }
)

foreach ($service in $services) {
    $servicePath = Join-Path "$PSScriptRoot\..\src\backend" $service.Path
    if (Test-Path $servicePath) {
        Write-Host "  Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; Write-Host '[$($service.Name)] Starting on port $($service.Port)...' -ForegroundColor Cyan; dotnet run"
        Start-Sleep -Seconds 3
    }
}

Write-Host "  Waiting 15 seconds for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Step 5: Check Backend Health
Write-Host "`nStep 5: Checking Backend Services Health..." -ForegroundColor Yellow
$healthyServices = 0
foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -TimeoutSec 3 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $($service.Name) is healthy" -ForegroundColor Green
            $healthyServices++
        }
    } catch {
        Write-Host "  ⚠️  $($service.Name) not responding yet" -ForegroundColor Yellow
    }
}

Write-Host "  Health Status: $healthyServices/$($services.Count) services responding" -ForegroundColor $(if ($healthyServices -eq $services.Count) { "Green" } else { "Yellow" })

# Step 6: Start Frontend
Write-Host "`nStep 6: Starting Frontend Application..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\..\src\frontend"

if (Test-Path "package.json") {
    if (-not (Test-Path "node_modules")) {
        Write-Host "  Installing dependencies..." -ForegroundColor Cyan
        npm install --force
    }
    
    Write-Host "  Starting React development server..." -ForegroundColor Cyan
    Write-Host "  Frontend will be available at: http://localhost:3000" -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '`n✅ Frontend starting...`n' -ForegroundColor Green; Write-Host 'The app will open at: http://localhost:3000`n' -ForegroundColor Yellow; npm start"
} else {
    Write-Host "  ⚠️  Frontend package.json not found" -ForegroundColor Yellow
}

# Step 7: Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Startup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Services Status:" -ForegroundColor Yellow
Write-Host "  Infrastructure: Check Docker Desktop" -ForegroundColor Cyan
Write-Host "  Backend Services: Check PowerShell windows" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan

Write-Host "`nBackend API Endpoints:" -ForegroundColor Yellow
Write-Host "  Auth Service: http://localhost:5001/swagger" -ForegroundColor Cyan
Write-Host "  Account Service: http://localhost:5002/swagger" -ForegroundColor Cyan
Write-Host "  Transaction Service: http://localhost:5003/swagger" -ForegroundColor Cyan
Write-Host "  Notification Service: http://localhost:5004/swagger" -ForegroundColor Cyan

Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "  - Wait a few seconds for all services to fully start" -ForegroundColor White
Write-Host "  - Check PowerShell windows for any error messages" -ForegroundColor White
Write-Host "  - If services fail, check Docker containers are running" -ForegroundColor White
Write-Host "  - Frontend may show proxy errors until backend is ready" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

