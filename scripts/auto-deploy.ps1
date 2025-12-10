# Auto-Deploy Script - Banking Platform
# This script attempts to deploy everything automatically

param(
    [switch]$SkipDockerCheck = $false,
    [switch]$SkipDotNetCheck = $false
)

$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AUTO-DEPLOYMENT STARTING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Function to find .NET SDK
function Find-DotNetSDK {
    $commonPaths = @(
        "C:\Program Files\dotnet\dotnet.exe",
        "C:\Program Files (x86)\dotnet\dotnet.exe",
        "$env:ProgramFiles\dotnet\dotnet.exe",
        "$env:ProgramFiles(x86)\dotnet\dotnet.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    
    $dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
    if ($dotnet) {
        return $dotnet.Source
    }
    
    return $null
}

# Function to start Docker Desktop
function Start-DockerDesktop {
    Write-Host "Attempting to start Docker Desktop..." -ForegroundColor Yellow
    
    $dockerPaths = @(
        "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe",
        "$env:ProgramFiles(x86)\Docker\Docker\Docker Desktop.exe",
        "${env:LOCALAPPDATA}\Docker\Docker Desktop.exe"
    )
    
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            Write-Host "Found Docker Desktop at: $path" -ForegroundColor Green
            Start-Process $path
            Write-Host "Waiting 30 seconds for Docker Desktop to start..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
            return $true
        }
    }
    
    Write-Host "Docker Desktop not found in common locations." -ForegroundColor Red
    return $false
}

# Step 1: Check Prerequisites
Write-Host "STEP 1: Checking Prerequisites" -ForegroundColor Cyan
Write-Host ""

# Check Docker
$dockerAvailable = $false
if (-not $SkipDockerCheck) {
    if (Test-Command "docker") {
        try {
            $dockerVersion = docker --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "[OK] Docker: $dockerVersion" -ForegroundColor Green
                $dockerAvailable = $true
            }
        } catch {
            Write-Host "[WARN] Docker command found but not responding" -ForegroundColor Yellow
        }
    }
    
    if (-not $dockerAvailable) {
        Write-Host "[INFO] Docker not available. Attempting to start Docker Desktop..." -ForegroundColor Yellow
        if (Start-DockerDesktop) {
            Start-Sleep -Seconds 10
            try {
                docker ps 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    $dockerAvailable = $true
                    Write-Host "[OK] Docker Desktop started successfully!" -ForegroundColor Green
                }
            } catch {
                Write-Host "[WARN] Docker Desktop may still be starting. Please wait..." -ForegroundColor Yellow
            }
        } else {
            Write-Host "[ERROR] Please start Docker Desktop manually and run this script again." -ForegroundColor Red
            Write-Host "        Or set -SkipDockerCheck flag to continue without Docker." -ForegroundColor Yellow
            if (-not $SkipDockerCheck) {
                exit 1
            }
        }
    }
} else {
    Write-Host "[SKIP] Skipping Docker check" -ForegroundColor Yellow
}

# Check .NET SDK
$dotnetPath = $null
if (-not $SkipDotNetCheck) {
    $dotnetPath = Find-DotNetSDK
    if ($dotnetPath) {
        $dotnetVersion = & $dotnetPath --version 2>&1
        Write-Host "[OK] .NET SDK: $dotnetVersion (found at: $dotnetPath)" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] .NET SDK not found. Backend services cannot be started." -ForegroundColor Red
        Write-Host "        Download from: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
        if (-not $SkipDotNetCheck) {
            Write-Host "        Set -SkipDotNetCheck flag to continue without .NET SDK." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "[SKIP] Skipping .NET SDK check" -ForegroundColor Yellow
}

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js not found. Frontend cannot be started." -ForegroundColor Red
}

Write-Host ""

# Step 2: Start Infrastructure Services
if ($dockerAvailable) {
    Write-Host "STEP 2: Starting Infrastructure Services" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Checking if infrastructure services are already running..." -ForegroundColor Yellow
    $runningContainers = docker ps --format "{{.Names}}" 2>&1
    
    $requiredContainers = @("banking-sqlserver", "banking-mongodb", "banking-postgresql", "banking-kafka", "banking-zookeeper", "banking-redis")
    $runningCount = 0
    
    foreach ($container in $requiredContainers) {
        if ($runningContainers -match $container) {
            Write-Host "[OK] $container is already running" -ForegroundColor Green
            $runningCount++
        }
    }
    
    if ($runningCount -lt $requiredContainers.Count) {
        Write-Host ""
        Write-Host "Starting infrastructure services..." -ForegroundColor Yellow
        docker-compose -f docker-compose.infrastructure.yml up -d
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Infrastructure services started!" -ForegroundColor Green
            Write-Host "Waiting 30 seconds for databases to initialize..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
        } else {
            Write-Host "[ERROR] Failed to start infrastructure services" -ForegroundColor Red
        }
    } else {
        Write-Host "[OK] All infrastructure services are already running!" -ForegroundColor Green
    }
    
    Write-Host ""
} else {
    Write-Host "STEP 2: Skipping Infrastructure Services (Docker not available)" -ForegroundColor Yellow
    Write-Host ""
}

# Step 3: Build Backend Services
if ($dotnetPath) {
    Write-Host "STEP 3: Building Backend Services" -ForegroundColor Cyan
    Write-Host ""
    
    $backendPath = Join-Path $projectRoot "src\backend"
    if (Test-Path $backendPath) {
        Set-Location $backendPath
        
        Write-Host "Restoring NuGet packages..." -ForegroundColor Yellow
        & $dotnetPath restore BankingPlatform.sln
        
        Write-Host "Building solution..." -ForegroundColor Yellow
        & $dotnetPath build BankingPlatform.sln -c Release --no-restore
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Backend services built successfully!" -ForegroundColor Green
        } else {
            Write-Host "[WARN] Build completed with warnings/errors" -ForegroundColor Yellow
        }
        
        Set-Location $projectRoot
        Write-Host ""
    }
} else {
    Write-Host "STEP 3: Skipping Backend Build (.NET SDK not available)" -ForegroundColor Yellow
    Write-Host ""
}

# Step 4: Start Backend Services
if ($dotnetPath) {
    Write-Host "STEP 4: Starting Backend Services" -ForegroundColor Cyan
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
            Start-Sleep -Seconds 3
        } else {
            Write-Host "[WARN] $($service.Name) path not found: $servicePath" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "[OK] Backend services are starting in separate windows" -ForegroundColor Green
    Write-Host "    Wait 10-15 seconds for services to fully start" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "STEP 4: Skipping Backend Services (.NET SDK not available)" -ForegroundColor Yellow
    Write-Host ""
}

# Step 5: Start Frontend
Write-Host "STEP 5: Starting Frontend" -ForegroundColor Cyan
Write-Host ""

$frontendPath = Join-Path $projectRoot "src\frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        npm install --legacy-peer-deps
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[WARN] npm install had issues, but continuing..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "[OK] Frontend dependencies already installed" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Starting frontend development server..." -ForegroundColor Yellow
    Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    
    $command = "cd '$frontendPath'; npm start"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    
    Write-Host "[OK] Frontend starting in new window" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[ERROR] Frontend path not found: $frontendPath" -ForegroundColor Red
}

Set-Location $projectRoot

# Step 6: Health Check
Write-Host "STEP 6: Health Check" -ForegroundColor Cyan
Write-Host ""

Write-Host "Waiting 15 seconds for all services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray

$servicesToCheck = @(
    @{Name="Frontend"; Url="http://localhost:3000"},
    @{Name="Auth Service"; Url="http://localhost:5001/health"},
    @{Name="Account Service"; Url="http://localhost:5002/health"},
    @{Name="Transaction Service"; Url="http://localhost:5003/health"},
    @{Name="Notification Service"; Url="http://localhost:5004/health"},
    @{Name="Kafka UI"; Url="http://localhost:8080"}
)

foreach ($service in $servicesToCheck) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] $($service.Name): Running" -ForegroundColor Green
        } else {
            Write-Host "[WARN] $($service.Name): Responding but status $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[INFO] $($service.Name): Not responding (may still be starting)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Final Summary
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""
Write-Host "DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host ""

Write-Host "Completed:" -ForegroundColor Green
if ($dockerAvailable) { Write-Host "  - Infrastructure services" -ForegroundColor White }
if ($dotnetPath) { Write-Host "  - Backend services built and starting" -ForegroundColor White }
Write-Host "  - Frontend starting" -ForegroundColor White

Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Auth Service: http://localhost:5001/swagger" -ForegroundColor White
Write-Host "  - Account Service: http://localhost:5002/swagger" -ForegroundColor White
Write-Host "  - Transaction Service: http://localhost:5003/swagger" -ForegroundColor White
Write-Host "  - Kafka UI: http://localhost:8080" -ForegroundColor White

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Wait for all services to fully start (30-60 seconds)" -ForegroundColor White
Write-Host "  2. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "  3. Register a new user account" -ForegroundColor White
Write-Host "  4. Explore the platform!" -ForegroundColor White

Write-Host ""
Write-Host "Deployment process completed!" -ForegroundColor Green
Write-Host ""
