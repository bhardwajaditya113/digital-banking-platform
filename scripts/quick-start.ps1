# Quick Start Script for Windows
# This script helps you get started quickly

Write-Host "🚀 Digital Banking Platform - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check .NET SDK
Write-Host "Checking .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET SDK found: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET SDK not found. Please install .NET 8.0 SDK." -ForegroundColor Red
    Write-Host "Download from: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "All prerequisites found! Starting deployment..." -ForegroundColor Green
Write-Host ""

# Step 1: Start Infrastructure
Write-Host "Step 1: Starting infrastructure services..." -ForegroundColor Cyan
docker-compose -f docker-compose.infrastructure.yml up -d

Write-Host "Waiting for services to initialize (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Step 2: Check infrastructure status
Write-Host "Step 2: Checking infrastructure services..." -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}"

Write-Host ""
Write-Host "✅ Infrastructure services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start backend services (run each in separate terminal):" -ForegroundColor White
Write-Host "   Terminal 1: cd src/backend/services/AuthService/AuthService.API && dotnet run" -ForegroundColor Gray
Write-Host "   Terminal 2: cd src/backend/services/AccountService/AccountService.API && dotnet run" -ForegroundColor Gray
Write-Host "   Terminal 3: cd src/backend/services/TransactionService/TransactionService.API && dotnet run" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start frontend (in new terminal):" -ForegroundColor White
Write-Host "   cd src/frontend && npm install && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Access the application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "   Kafka UI: http://localhost:8080" -ForegroundColor Green
Write-Host ""
Write-Host "Or use Docker Compose to start all services:" -ForegroundColor Yellow
Write-Host "   docker-compose up -d" -ForegroundColor Gray


