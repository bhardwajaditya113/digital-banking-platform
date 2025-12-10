# Complete Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- .NET 8.0 SDK
- Node.js 18+
- Git

### One-Command Deployment

**Linux/Mac:**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\deploy.ps1
```

## 📋 Manual Deployment Steps

### 1. Environment Setup

```bash
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

This creates `.env` files with default configuration.

### 2. Start Infrastructure

```bash
docker-compose -f docker-compose.infrastructure.yml up -d
```

Wait for services to be ready (about 30 seconds).

### 3. Build and Start Services

```bash
docker-compose up -d --build
```

### 4. Build Frontend

```bash
cd src/frontend
npm install
npm run build
npm start
```

## 🔍 Health Checks

Run health check script:
```bash
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

Or check manually:
```bash
curl http://localhost:5001/health  # Auth Service
curl http://localhost:5002/health  # Account Service
curl http://localhost:5003/health  # Transaction Service
```

## 🌐 Production Deployment

### Kubernetes Deployment

1. **Create namespace:**
```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
```

2. **Create secrets:**
```bash
kubectl apply -f infrastructure/kubernetes/secrets.yaml
# Edit secrets.yaml with your actual values first!
```

3. **Create configmap:**
```bash
kubectl apply -f infrastructure/kubernetes/configmap.yaml
```

4. **Deploy services:**
```bash
kubectl apply -f infrastructure/kubernetes/auth-service.yaml
kubectl apply -f infrastructure/kubernetes/account-service.yaml
# ... apply other services
```

5. **Create ingress:**
```bash
kubectl apply -f infrastructure/kubernetes/ingress.yaml
```

### Environment Variables

Set these in your Kubernetes secrets or environment:

- `JWT_SECRET_KEY` - JWT signing key
- `SQL_CONNECTION` - SQL Server connection string
- `MONGODB_CONNECTION` - MongoDB connection string
- `KAFKA_BOOTSTRAP_SERVERS` - Kafka servers
- `REDIS_CONNECTION` - Redis connection

## 📊 Monitoring

### Logs

View service logs:
```bash
# Docker
docker-compose logs -f auth-service
docker-compose logs -f account-service

# Kubernetes
kubectl logs -f deployment/auth-service -n banking-platform
```

### Metrics

Services expose metrics at `/metrics` endpoint (when configured).

### Health Endpoints

All services have `/health` endpoint:
- Returns 200 if healthy
- Returns 503 if unhealthy

## 🔧 Troubleshooting

### Services not starting
1. Check Docker is running
2. Check ports are not in use
3. Check logs: `docker-compose logs`

### Database connection errors
1. Verify SQL Server is running
2. Check connection strings
3. Verify credentials

### Kafka connection errors
1. Check Zookeeper is running
2. Verify Kafka is accessible
3. Check network connectivity

## 📝 Post-Deployment

1. **Verify all services:**
   ```bash
   ./scripts/health-check.sh
   ```

2. **Test API:**
   ```bash
   curl http://localhost:8000/api/auth/register -X POST ...
   ```

3. **Access Swagger:**
   - Auth Service: http://localhost:5001/swagger
   - Account Service: http://localhost:5002/swagger

4. **Access Frontend:**
   - http://localhost:3000

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Update JWT secret key
- [ ] Configure HTTPS
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Enable audit logging

## 📈 Scaling

### Horizontal Scaling

Update Kubernetes deployments:
```yaml
spec:
  replicas: 3  # Increase for more instances
```

### Database Scaling

- Use read replicas for SQL Server
- Shard MongoDB collections
- Use connection pooling

### Caching

- Redis is already configured
- Increase Redis memory if needed
- Use Redis Cluster for high availability

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Secrets properly managed
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Backup strategy in place
- [ ] Disaster recovery plan
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Documentation reviewed

Your platform is ready for production! 🚀


