#!/bin/bash

# Health Check Script
# Checks if all services are running and healthy

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏥 Health Check - Digital Banking Platform"
echo "=========================================="

check_service() {
    local service_name=$1
    local url=$2
    
    if curl -f -s "$url/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not responding${NC}"
        return 1
    fi
}

# Check infrastructure
echo -e "\n${YELLOW}Checking Infrastructure Services...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "sqlserver|mongodb|kafka|redis" || echo "Some infrastructure services may not be running"

# Check backend services
echo -e "\n${YELLOW}Checking Backend Services...${NC}"
check_service "Auth Service" "http://localhost:5001"
check_service "Account Service" "http://localhost:5002"
check_service "Transaction Service" "http://localhost:5003"
check_service "Notification Service" "http://localhost:5004"
check_service "Investment Service" "http://localhost:5005"
check_service "Loan Service" "http://localhost:5006"

# Check API Gateway
echo -e "\n${YELLOW}Checking API Gateway...${NC}"
if curl -f -s "http://localhost:8000" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway is responding${NC}"
else
    echo -e "${RED}❌ API Gateway is not responding${NC}"
fi

# Check frontend
echo -e "\n${YELLOW}Checking Frontend...${NC}"
if curl -f -s "http://localhost:3000" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

echo -e "\n${GREEN}Health check complete!${NC}"


