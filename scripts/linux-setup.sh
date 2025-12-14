#!/bin/bash

# Digital Banking Platform - Linux Setup Script
# This script sets up and runs the entire platform on Linux/Parrot OS

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}🚀 Digital Banking Platform - Linux Setup${NC}"
echo "=========================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
MISSING_DEPS=()

if ! command_exists docker; then
    MISSING_DEPS+=("docker")
fi

if ! command_exists node; then
    MISSING_DEPS+=("nodejs")
fi

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing dependencies: ${MISSING_DEPS[*]}${NC}"
    echo "Please install them first:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y docker.io docker-compose nodejs npm"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    echo "  sudo systemctl start docker"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Create Docker network if it doesn't exist
echo -e "${BLUE}Creating Docker network...${NC}"
docker network create banking-network 2>/dev/null || echo "Network already exists"
echo -e "${GREEN}✅ Network ready${NC}"
echo ""

# Step 1: Start Infrastructure Services
echo -e "${BLUE}Step 1: Starting infrastructure services...${NC}"
docker-compose -f docker-compose.infrastructure.yml up -d

echo -e "${YELLOW}Waiting 30 seconds for databases to initialize...${NC}"
sleep 30

# Check if services are healthy
echo -e "${BLUE}Checking infrastructure services...${NC}"
docker ps --filter "name=banking-" --format "table {{.Names}}\t{{.Status}}"
echo ""

# Step 2: Check if .NET SDK is needed
if ! command_exists dotnet; then
    echo -e "${YELLOW}⚠️  .NET SDK not found. Services will run in Docker containers.${NC}"
    echo -e "${BLUE}Step 2: Building Docker images for backend services...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Docker images built${NC}"
    echo ""
    
    echo -e "${BLUE}Step 3: Starting backend services in Docker...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Backend services started${NC}"
    echo ""
    
    echo -e "${YELLOW}Waiting 30 seconds for services to start...${NC}"
    sleep 30
else
    echo -e "${GREEN}✅ .NET SDK found${NC}"
    echo -e "${BLUE}Step 2: Building backend services...${NC}"
    cd src/backend
    dotnet restore BankingPlatform.sln
    dotnet build BankingPlatform.sln -c Release
    cd ../..
    echo -e "${GREEN}✅ Backend services built${NC}"
    echo ""
    
    echo -e "${YELLOW}⚠️  To run services locally, use separate terminals:${NC}"
    echo "  Terminal 1: cd src/backend/services/AuthService/AuthService.API && dotnet run"
    echo "  Terminal 2: cd src/backend/services/AccountService/AccountService.API && dotnet run"
    echo "  Terminal 3: cd src/backend/services/TransactionService/TransactionService.API && dotnet run"
    echo "  Terminal 4: cd src/backend/services/NotificationService/NotificationService.API && dotnet run"
    echo ""
    echo -e "${BLUE}Or use Docker Compose:${NC}"
    echo "  docker-compose up -d"
    echo ""
fi

# Step 3: Setup Frontend
echo -e "${BLUE}Step 3: Setting up frontend...${NC}"
cd src/frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
cd ../..
echo ""

# Step 4: Health Check
echo -e "${BLUE}Step 4: Checking service health...${NC}"
sleep 5

check_service() {
    local url=$1
    local name=$2
    if curl -s -f "$url" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $name is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $name is not responding yet${NC}"
        return 1
    fi
}

check_service "http://localhost:5001/health" "Auth Service"
check_service "http://localhost:5002/health" "Account Service"
check_service "http://localhost:5003/health" "Transaction Service"
check_service "http://localhost:5004/health" "Notification Service"
echo ""

# Summary
echo -e "${GREEN}=========================================="
echo "✅ Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Services are available at:"
echo "  - Frontend:        http://localhost:3000"
echo "  - Auth Service:    http://localhost:5001"
echo "  - Account Service:  http://localhost:5002"
echo "  - Transaction:     http://localhost:5003"
echo "  - Notification:    http://localhost:5004"
echo "  - Investment:      http://localhost:5005"
echo "  - Loan:            http://localhost:5006"
echo "  - Kafka UI:        http://localhost:8080"
echo ""
echo -e "${BLUE}To start the frontend:${NC}"
echo "  cd src/frontend && npm start"
echo ""
echo -e "${BLUE}To view logs:${NC}"
echo "  docker-compose logs -f"
echo ""
echo -e "${BLUE}To stop all services:${NC}"
echo "  docker-compose down"
echo "  docker-compose -f docker-compose.infrastructure.yml down"
echo ""


