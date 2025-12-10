#!/bin/bash

# Environment Setup Script
# Creates .env files from templates

set -e

echo "🔧 Setting up environment configuration..."

# Create .env files if they don't exist
if [ ! -f ".env" ]; then
    cat > .env << EOF
# Environment Configuration
ENVIRONMENT=development
API_URL=http://localhost:8000
JWT_SECRET_KEY=YourSuperSecretKeyForJWTTokenGeneration123456789
JWT_ISSUER=BankingPlatform
JWT_AUDIENCE=BankingPlatform

# Database Connections
SQL_SERVER=localhost
SQL_PORT=1433
SQL_USER=sa
SQL_PASSWORD=Banking@123!

MONGODB_CONNECTION=mongodb://banking_admin:Banking@123!@localhost:27017/banking_documents?authSource=admin
POSTGRES_CONNECTION=Host=localhost;Port=5432;Database=banking_analytics;Username=banking_user;Password=Banking@123!

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Redis
REDIS_CONNECTION=localhost:6379

# API Gateway
API_GATEWAY_URL=http://localhost:8000
EOF
    echo "✅ Created .env file"
else
    echo "ℹ️  .env file already exists"
fi

# Create frontend .env
if [ ! -f "src/frontend/.env" ]; then
    cat > src/frontend/.env << EOF
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
EOF
    echo "✅ Created src/frontend/.env file"
else
    echo "ℹ️  src/frontend/.env file already exists"
fi

echo "✅ Environment setup complete!"


