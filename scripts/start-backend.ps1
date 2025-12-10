# Start all backend services
$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent $PSScriptRoot
$dotnetPath = "C:\Program Files\dotnet\dotnet.exe"

Write-Host ""
Write-Host "Starting Backend Services..." -ForegroundColor Cyan
Write-Host ""

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
        
        $command = "cd '$servicePath'; & '$dotnetPath' run"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
        
        Write-Host "[OK] $($service.Name) starting in new window" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Host "All backend services are starting!" -ForegroundColor Green
Write-Host "Wait 15-20 seconds for services to fully start." -ForegroundColor Yellow
Write-Host ""


