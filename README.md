# Digital Banking Platform (FinTech)

A production-grade, microservices-based digital banking platform built with .NET Core and React, designed to handle core banking operations, multi-currency wallets, investment portfolios, and loan management.

## 🏗️ Architecture

### Microservices
- **API Gateway** - Kong/Azure API Gateway for routing and rate limiting
- **Auth Service** - OAuth2/JWT authentication and authorization
- **Account Service** - Account management and operations
- **Transaction Service** - Payment processing and transfers
- **Notification Service** - Real-time notifications via Kafka
- **Investment Service** - Portfolio and investment management
- **Loan Service** - Loan applications and management

### Technology Stack

#### Backend
- .NET 8.0 Core
- ASP.NET Core MVC
- Entity Framework Core
- OAuth2, JWT, OIDC
- Kafka (Event Streaming)
- SQL Server (Primary DB)
- MongoDB (Document Store)
- PostgreSQL (Analytics)

#### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- Bootstrap 5 for UI
- Axios for API calls

#### Infrastructure
- Docker & Docker Compose
- Kubernetes
- Azure/AWS ready
- CI/CD with GitHub Actions
- API Gateway (Kong)

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- Docker Desktop
- SQL Server (or use Docker)
- MongoDB (or use Docker)
- Kafka (or use Docker)

### Quick Start

1. **Clone and setup:**
```bash
git clone <repo>
cd "Abu Dhabi"
```

2. **Start infrastructure (Kafka, Databases):**
```bash
docker-compose -f docker-compose.infrastructure.yml up -d
```

3. **Run backend services:**
```bash
cd src/backend
dotnet restore
dotnet build
dotnet run --project services/AuthService/AuthService.API
# Repeat for other services or use docker-compose
```

4. **Run frontend:**
```bash
cd src/frontend
npm install
npm start
```

5. **Access:**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- Auth Service: http://localhost:5001
- Account Service: http://localhost:5002

## 📁 Project Structure

```
.
├── src/
│   ├── backend/
│   │   ├── services/          # Microservices
│   │   ├── shared/            # Shared libraries
│   │   └── gateway/           # API Gateway config
│   ├── frontend/              # React application
│   └── tests/                 # Integration tests
├── infrastructure/
│   ├── docker/                # Dockerfiles
│   ├── kubernetes/            # K8s manifests
│   └── terraform/             # Infrastructure as code
├── docs/                      # Documentation
└── scripts/                   # Deployment scripts
```

## 🔐 Security Features

- OAuth2/OIDC authentication
- JWT token-based authorization
- Role-based access control (RBAC)
- API rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- HTTPS enforcement

## 🧪 Testing

- Unit tests (>80% coverage)
- Integration tests
- API tests
- End-to-end tests

Run tests:
```bash
dotnet test
cd src/frontend && npm test
```

## 📊 Monitoring & Logging

- Application Insights / CloudWatch
- Structured logging (Serilog)
- Health checks
- Metrics endpoints

## 💰 Monetization Features

- Transaction fees
- Premium account tiers
- Investment management fees
- Loan processing fees
- Multi-currency conversion fees

## 📝 License

Proprietary - All rights reserved


