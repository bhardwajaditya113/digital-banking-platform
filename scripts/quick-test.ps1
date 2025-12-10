# Quick Test Script - Test the application end-to-end
$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "END-TO-END TESTING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Infrastructure
Write-Host "Test 1: Infrastructure Services" -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}}" 2>&1
$required = @("banking-sqlserver", "banking-mongodb", "banking-kafka", "banking-redis")
$running = 0
foreach ($req in $required) {
    if ($containers -match $req) {
        Write-Host "  [OK] $req" -ForegroundColor Green
        $running++
    } else {
        Write-Host "  [FAIL] $req" -ForegroundColor Red
    }
}
Write-Host "  Status: $running/$($required.Count) services running" -ForegroundColor $(if ($running -eq $required.Count) { "Green" } else { "Yellow" })
Write-Host ""

# Test 2: Check Frontend
Write-Host "Test 2: Frontend Service" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "  [OK] Frontend is running on http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "  [FAIL] Frontend not responding (may still be starting)" -ForegroundColor Red
    Write-Host "  Start it with: cd src/frontend; npm start" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Check Backend Services
Write-Host "Test 3: Backend Services" -ForegroundColor Yellow
$services = @(
    @{Name="Auth Service"; Url="http://localhost:5001/health"},
    @{Name="Account Service"; Url="http://localhost:5002/health"},
    @{Name="Transaction Service"; Url="http://localhost:5003/health"},
    @{Name="Notification Service"; Url="http://localhost:5004/health"}
)

$backendRunning = 0
foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  [OK] $($service.Name)" -ForegroundColor Green
            $backendRunning++
        }
    } catch {
        Write-Host "  [FAIL] $($service.Name) - Not responding" -ForegroundColor Red
    }
}
Write-Host "  Status: $backendRunning/$($services.Count) services running" -ForegroundColor $(if ($backendRunning -eq $services.Count) { "Green" } else { "Yellow" })
Write-Host ""

# Test 4: API Test - Register User
Write-Host "Test 4: API Functionality Test" -ForegroundColor Yellow
try {
    $registerData = @{
        email = "test@example.com"
        password = "Test123!"
        firstName = "Test"
        lastName = "User"
        phoneNumber = "1234567890"
        dateOfBirth = "1990-01-01"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/register" -Method Post -Body $registerData -ContentType "application/json" -ErrorAction SilentlyContinue
    if ($response) {
        Write-Host "  [OK] User registration works" -ForegroundColor Green
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 400 -or $statusCode -eq 409) {
        Write-Host "  [OK] API is responding (user may already exist)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] API not responding: $_" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Gray
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host ""
Write-Host "Infrastructure: $running/$($required.Count) running" -ForegroundColor $(if ($running -eq $required.Count) { "Green" } else { "Yellow" })
Write-Host "Backend Services: $backendRunning/$($services.Count) running" -ForegroundColor $(if ($backendRunning -eq $services.Count) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "  2. Register a new user account" -ForegroundColor White
Write-Host "  3. Login and explore the platform" -ForegroundColor White
Write-Host ""


