# Deployment Guide

## Prerequisites

- Docker Desktop (for local development)
- Kubernetes cluster (for production)
- .NET 8.0 SDK
- Node.js 18+
- SQL Server (or use Docker)
- MongoDB (or use Docker)
- Kafka (or use Docker)

## Local Development Setup

### 1. Start Infrastructure Services

```bash
docker-compose -f docker-compose.infrastructure.yml up -d
```

This starts:
- SQL Server (port 1433)
- PostgreSQL (port 5432)
- MongoDB (port 27017)
- Kafka + Zookeeper (port 9092)
- Redis (port 6379)
- Kafka UI (port 8080)

### 2. Start Backend Services

#### Option A: Using Docker Compose

```bash
docker-compose up -d
```

#### Option B: Running Individually

```bash
# Auth Service
cd src/backend/services/AuthService/AuthService.API
dotnet run

# Account Service (in new terminal)
cd src/backend/services/AccountService/AccountService.API
dotnet run

# Transaction Service (in new terminal)
cd src/backend/services/TransactionService/TransactionService.API
dotnet run

# Notification Service (in new terminal)
cd src/backend/services/NotificationService/NotificationService.API
dotnet run
```

### 3. Start Frontend

```bash
cd src/frontend
npm install
npm start
```

### 4. Access Services

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- Auth Service: http://localhost:5001
- Account Service: http://localhost:5002
- Transaction Service: http://localhost:5003
- Notification Service: http://localhost:5004
- Kafka UI: http://localhost:8080

## Production Deployment (Kubernetes)

### 1. Build Docker Images

```bash
# Build all services
docker build -t banking-platform/auth-service:latest -f src/backend/services/AuthService/AuthService.API/Dockerfile src/backend
docker build -t banking-platform/account-service:latest -f src/backend/services/AccountService/AccountService.API/Dockerfile src/backend
docker build -t banking-platform/transaction-service:latest -f src/backend/services/TransactionService/TransactionService.API/Dockerfile src/backend
docker build -t banking-platform/notification-service:latest -f src/backend/services/NotificationService/NotificationService.API/Dockerfile src/backend
```

### 2. Create Kubernetes Secrets

```bash
kubectl create namespace banking-platform
kubectl create secret generic banking-secrets \
  --from-literal=sql-connection="Server=sqlserver;Database=BankingAuth;User Id=sa;Password=YourPassword;TrustServerCertificate=True;" \
  --namespace=banking-platform
```

### 3. Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/configmap.yaml
kubectl apply -f infrastructure/kubernetes/auth-service.yaml
kubectl apply -f infrastructure/kubernetes/account-service.yaml
# ... apply other service manifests
```

### 4. Verify Deployment

```bash
kubectl get pods -n banking-platform
kubectl get services -n banking-platform
```

## Environment Variables

### Backend Services

- `ConnectionStrings__DefaultConnection`: SQL Server connection string
- `ConnectionStrings__MongoDB`: MongoDB connection string
- `JwtSettings__SecretKey`: JWT secret key
- `JwtSettings__Issuer`: JWT issuer
- `JwtSettings__Audience`: JWT audience
- `KafkaSettings__BootstrapServers`: Kafka bootstrap servers

### Frontend

- `REACT_APP_API_URL`: API Gateway URL (default: http://localhost:8000)

## CI/CD

The project includes GitHub Actions workflows for:
- Building and testing backend services
- Building and testing frontend
- Building and pushing Docker images
- Deploying to Kubernetes (configure as needed)

## Monitoring

- Health checks: `/health` endpoint on each service
- Logs: Check container logs or Kubernetes pod logs
- Metrics: Configure Application Insights or Prometheus

## Troubleshooting

### Services not starting
- Check database connections
- Verify Kafka is running
- Check environment variables

### Authentication issues
- Verify JWT secret key matches across services
- Check token expiration settings

### Database connection errors
- Verify SQL Server/MongoDB is accessible
- Check connection strings
- Ensure databases are created


