#!/bin/bash

# Build and start backend services using podman
set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔨 Building backend service images..."

# Build Auth Service
echo "Building Auth Service..."
podman build -f src/backend/services/AuthService/AuthService.API/Dockerfile \
  -t banking-auth-service:latest \
  src/backend || echo "Build failed or image exists"

# Build Account Service
echo "Building Account Service..."
podman build -f src/backend/services/AccountService/AccountService.API/Dockerfile \
  -t banking-account-service:latest \
  src/backend || echo "Build failed or image exists"

# Build Transaction Service
echo "Building Transaction Service..."
podman build -f src/backend/services/TransactionService/TransactionService.API/Dockerfile \
  -t banking-transaction-service:latest \
  src/backend || echo "Build failed or image exists"

# Build Notification Service
echo "Building Notification Service..."
podman build -f src/backend/services/NotificationService/NotificationService.API/Dockerfile \
  -t banking-notification-service:latest \
  src/backend || echo "Build failed or image exists"

# Build Investment Service
echo "Building Investment Service..."
podman build -f src/backend/services/InvestmentService/InvestmentService.API/Dockerfile \
  -t banking-investment-service:latest \
  src/backend || echo "Build failed or image exists"

# Build Loan Service
echo "Building Loan Service..."
podman build -f src/backend/services/LoanService/LoanService.API/Dockerfile \
  -t banking-loan-service:latest \
  src/backend || echo "Build failed or image exists"

echo "✅ Build complete!"
echo ""
echo "Starting services..."

# Start Auth Service
podman run -d --name banking-auth-service \
  --network banking-network \
  -p 5001:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__DefaultConnection="Server=banking-sqlserver;Database=BankingAuth;User Id=sa;Password=Banking@123!;TrustServerCertificate=True;" \
  -e JwtSettings__SecretKey=YourSuperSecretKeyForJWTTokenGeneration123456789 \
  -e JwtSettings__Issuer=BankingPlatform \
  -e JwtSettings__Audience=BankingPlatform \
  -e KafkaSettings__BootstrapServers=banking-kafka:29092 \
  banking-auth-service:latest || echo "Auth service already running"

# Start Account Service
podman run -d --name banking-account-service \
  --network banking-network \
  -p 5002:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__DefaultConnection="Server=banking-sqlserver;Database=BankingAccounts;User Id=sa;Password=Banking@123!;TrustServerCertificate=True;" \
  -e ConnectionStrings__MongoDB="mongodb://banking_admin:Banking@123!@banking-mongodb:27017/banking_documents?authSource=admin" \
  -e ConnectionStrings__Redis="banking-redis:6379" \
  -e KafkaSettings__BootstrapServers=banking-kafka:29092 \
  banking-account-service:latest || echo "Account service already running"

# Start Transaction Service
podman run -d --name banking-transaction-service \
  --network banking-network \
  -p 5003:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__DefaultConnection="Server=banking-sqlserver;Database=BankingTransactions;User Id=sa;Password=Banking@123!;TrustServerCertificate=True;" \
  -e ConnectionStrings__MongoDB="mongodb://banking_admin:Banking@123!@banking-mongodb:27017/banking_documents?authSource=admin" \
  -e KafkaSettings__BootstrapServers=banking-kafka:29092 \
  banking-transaction-service:latest || echo "Transaction service already running"

# Start Notification Service
podman run -d --name banking-notification-service \
  --network banking-network \
  -p 5004:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__MongoDB="mongodb://banking_admin:Banking@123!@banking-mongodb:27017/banking_documents?authSource=admin" \
  -e KafkaSettings__BootstrapServers=banking-kafka:29092 \
  banking-notification-service:latest || echo "Notification service already running"

# Start Investment Service
podman run -d --name banking-investment-service \
  --network banking-network \
  -p 5005:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__DefaultConnection="Server=banking-sqlserver;Database=BankingInvestments;User Id=sa;Password=Banking@123!;TrustServerCertificate=True;" \
  -e JwtSettings__SecretKey=YourSuperSecretKeyForJWTTokenGeneration123456789 \
  -e JwtSettings__Issuer=BankingPlatform \
  -e JwtSettings__Audience=BankingPlatform \
  -e KafkaSettings__BootstrapServers=banking-kafka:29092 \
  banking-investment-service:latest || echo "Investment service already running"

# Start Loan Service
podman run -d --name banking-loan-service \
  --network banking-network \
  -p 5006:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e ASPNETCORE_URLS=http://+:8080 \
  -e ConnectionStrings__DefaultConnection="Server=banking-sqlserver;Database=BankingLoans;User Id=sa;Password=Banking@123!;TrustServerCertificate=True;" \
  -e JwtSettings__SecretKey=YourSuperSecretKeyForJWTTokenGeneration123456789 \
  -e JwtSettings__Issuer=BankingPlatform \
  -e JwtSettings__Audience=BankingPlatform \
  -e KafkaSettings__BootstrapServers=banking-kafka:29092 \
  banking-loan-service:latest || echo "Loan service already running"

echo "✅ Services started!"
echo "Waiting 30 seconds for services to initialize..."
sleep 30

echo "Checking service status..."
podman ps --filter "name=banking-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"


