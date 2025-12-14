#!/bin/bash

# Test script to verify all services are running

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 Testing Digital Banking Platform Services"
echo "=========================================="
echo ""

test_service() {
    local url=$1
    local name=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "200" ] || [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ $name - OK (HTTP $response)${NC}"
        return 0
    else
        echo -e "${RED}❌ $name - Not responding (HTTP $response)${NC}"
        return 1
    fi
}

# Test Infrastructure
echo "Infrastructure Services:"
test_service "http://localhost:8080" "Kafka UI"
echo ""

# Test Backend Services
echo "Backend Services:"
test_service "http://localhost:5001/health" "Auth Service"
test_service "http://localhost:5002/health" "Account Service"
test_service "http://localhost:5003/health" "Transaction Service"
test_service "http://localhost:5004/health" "Notification Service"
test_service "http://localhost:5005/health" "Investment Service"
test_service "http://localhost:5006/health" "Loan Service"
echo ""

# Test Frontend
echo "Frontend:"
test_service "http://localhost:3000" "React App"
echo ""

# Summary
echo "=========================================="
echo "Test complete!"
echo ""
echo "If services are not responding:"
echo "  1. Check if containers are running: podman ps"
echo "  2. Check logs: podman logs <container-name>"
echo "  3. Wait 30-60 seconds for services to initialize"
echo ""


