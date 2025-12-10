#!/bin/bash

# Digital Banking Platform - Deployment Script
# This script automates the deployment process

set -e

echo "🚀 Starting Digital Banking Platform Deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Aborting." >&2; exit 1; }
command -v dotnet >/dev/null 2>&1 || { echo ".NET SDK is required but not installed. Aborting." >&2; exit 1; }

# Step 1: Start Infrastructure
echo -e "${BLUE}Step 1: Starting infrastructure services...${NC}"
docker-compose -f docker-compose.infrastructure.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 30

# Step 2: Build Backend Services
echo -e "${BLUE}Step 2: Building backend services...${NC}"
cd src/backend
dotnet restore BankingPlatform.sln
dotnet build BankingPlatform.sln -c Release

# Step 3: Run Database Migrations
echo -e "${BLUE}Step 3: Running database migrations...${NC}"
# Add migration commands here if using EF Core migrations
# dotnet ef database update --project services/AuthService/AuthService.Infrastructure

# Step 4: Build Docker Images
echo -e "${BLUE}Step 4: Building Docker images...${NC}"
cd ../..
docker-compose build

# Step 5: Start Services
echo -e "${BLUE}Step 5: Starting all services...${NC}"
docker-compose up -d

# Step 6: Build Frontend
echo -e "${BLUE}Step 6: Building frontend...${NC}"
cd src/frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}Services are running:${NC}"
echo "  - Frontend: http://localhost:3000"
echo "  - API Gateway: http://localhost:8000"
echo "  - Auth Service: http://localhost:5001"
echo "  - Account Service: http://localhost:5002"
echo "  - Transaction Service: http://localhost:5003"
echo "  - Notification Service: http://localhost:5004"
echo "  - Investment Service: http://localhost:5005"
echo "  - Loan Service: http://localhost:5006"


