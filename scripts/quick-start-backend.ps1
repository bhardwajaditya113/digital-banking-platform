# Quick Backend Services Startup Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Services" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Continue"
$rootPath = Split-Path -Parent $PSScriptRoot

# Check Docker
Write-Host "Step 1: Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "  ✅ Docker is running" -ForegroundColor Green
    
    # Start infrastructure if not running
    Write-Host "`nStep 2: Starting Docker Infrastructure..." -ForegroundColor Yellow
    Set-Location $rootPath
    if (Test-Path "docker-compose.infrastructure.yml") {
        Write-Host "  Starting infrastructure services..." -ForegroundColor Cyan
        docker-compose -f docker-compose.infrastructure.yml up -d
        Write-Host "  ⏳ Waiting 30 seconds for databases to initialize..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
    }
} catch {
    Write-Host "  ⚠️  Docker is NOT running!" -ForegroundColor Red
    Write-Host "  Please start Docker Desktop first!" -ForegroundColor Yellow
    Write-Host "  Services will start but database connections will fail." -ForegroundColor Yellow
    Write-Host "`nPress any key to continue anyway..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Build solution
Write-Host "`nStep 3: Building Backend Services..." -ForegroundColor Yellow
Set-Location "$rootPath\src\backend"
if (Test-Path "BankingPlatform.sln") {
    Write-Host "  Building solution..." -ForegroundColor Cyan
    dotnet build BankingPlatform.sln --no-incremental 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Build succeeded" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Build had errors - check output above" -ForegroundColor Yellow
    }
}

# Start services
Write-Host "`nStep 4: Starting Backend Services..." -ForegroundColor Yellow
$services = @(
    @{ Name = "AuthService"; Path = "services\AuthService\AuthService.API"; Port = 5001 },
    @{ Name = "AccountService"; Path = "services\AccountService\AccountService.API"; Port = 5002 },
    @{ Name = "TransactionService"; Path = "services\TransactionService\TransactionService.API"; Port = 5003 },
    @{ Name = "NotificationService"; Path = "services\NotificationService\NotificationService.API"; Port = 5004 }
)

foreach ($service in $services) {
    $servicePath = Join-Path "$rootPath\src\backend" $service.Path
    if (Test-Path $servicePath) {
        Write-Host "  Starting $($service.Name) on port $($service.Port)..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$servicePath'; Write-Host '`n[$($service.Name)] Starting on port $($service.Port)...' -ForegroundColor Cyan; Write-Host 'Swagger UI: http://localhost:$($service.Port)/swagger' -ForegroundColor Green; Write-Host 'Health: http://localhost:$($service.Port)/health' -ForegroundColor Green; Write-Host ''; dotnet run"
        Start-Sleep -Seconds 3
    }
}

Write-Host "`n✅ All services are starting in separate PowerShell windows" -ForegroundColor Green
Write-Host "`n⏳ Waiting 30 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Health check
Write-Host "`nStep 5: Checking Service Health..." -ForegroundColor Yellow
$healthyCount = 0
foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($service.Port)/health" -TimeoutSec 3 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $($service.Name) (port $($service.Port)): Healthy" -ForegroundColor Green
            $healthyCount++
        }
    } catch {
        Write-Host "  ⚠️  $($service.Name) (port $($service.Port)): Not responding yet" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Startup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Service Status: $healthyCount/$($services.Count) services responding" -ForegroundColor $(if ($healthyCount -eq $services.Count) { "Green" } else { "Yellow" })

Write-Host "`nService URLs:" -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "  $($service.Name): http://localhost:$($service.Port)/swagger" -ForegroundColor Cyan
}

Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "  - Check PowerShell windows for any error messages" -ForegroundColor White
Write-Host "  - Services may take up to 60 seconds to fully start" -ForegroundColor White
Write-Host "  - If services fail, check Docker containers are running" -ForegroundColor White
Write-Host "  - Frontend should now be able to connect!" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


