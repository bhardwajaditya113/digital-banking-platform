# Digital Banking Platform - Deployment Script (PowerShell)
# This script automates the deployment process on Windows

Write-Host "🚀 Starting Digital Banking Platform Deployment..." -ForegroundColor Blue

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Cyan
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is required but not installed. Aborting." -ForegroundColor Red
    exit 1
}
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Host ".NET SDK is required but not installed. Aborting." -ForegroundColor Red
    exit 1
}

# Step 1: Start Infrastructure
Write-Host "Step 1: Starting infrastructure services..." -ForegroundColor Cyan
docker-compose -f docker-compose.infrastructure.yml up -d

# Wait for services
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Step 2: Build Backend Services
Write-Host "Step 2: Building backend services..." -ForegroundColor Cyan
Set-Location src/backend
dotnet restore BankingPlatform.sln
dotnet build BankingPlatform.sln -c Release

# Step 3: Build Docker Images
Write-Host "Step 3: Building Docker images..." -ForegroundColor Cyan
Set-Location ../..
docker-compose build

# Step 4: Start Services
Write-Host "Step 4: Starting all services..." -ForegroundColor Cyan
docker-compose up -d

# Step 5: Build Frontend
Write-Host "Step 5: Building frontend..." -ForegroundColor Cyan
Set-Location src/frontend
if (-not (Test-Path "node_modules")) {
    npm install
}
npm run build

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "Services are running:" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:3000"
Write-Host "  - API Gateway: http://localhost:8000"
Write-Host "  - Auth Service: http://localhost:5001"
Write-Host "  - Account Service: http://localhost:5002"
Write-Host "  - Transaction Service: http://localhost:5003"
Write-Host "  - Notification Service: http://localhost:5004"
Write-Host "  - Investment Service: http://localhost:5005"
Write-Host "  - Loan Service: http://localhost:5006"


