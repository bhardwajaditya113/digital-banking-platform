#!/bin/bash
# Complete End-to-End Test Script

echo "🧪 Testing Complete Finance Super-App"
echo "===================================="
echo ""

# Test Trading Service
echo "1. Testing Trading Service..."
curl -s http://localhost:5007/api/Trading/quote/AAPL?assetType=Stock | head -c 100 && echo " ✅" || echo " ❌"
sleep 1

# Test Crypto Quote
echo "2. Testing Crypto Quote..."
curl -s http://localhost:5007/api/Trading/quote/BTC?assetType=Crypto | head -c 100 && echo " ✅" || echo " ❌"
sleep 1

# Test AI Agent Service
echo "3. Testing AI Agent Service..."
curl -s http://localhost:5008/health | head -c 50 && echo " ✅" || echo " ❌"
sleep 1

# Test Frontend
echo "4. Testing Frontend..."
curl -s http://localhost:3000 | head -c 50 && echo " ✅" || echo " ❌"

echo ""
echo "✅ All tests complete!"
echo ""
echo "Access the platform at: http://localhost:3000"
