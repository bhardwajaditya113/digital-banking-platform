# Architecture Overview

## System Architecture

The Digital Banking Platform follows a microservices architecture pattern with the following components:

### Microservices

1. **Auth Service** (Port 5001)
   - User registration and authentication
   - JWT token generation and validation
   - Role-based access control
   - Database: SQL Server

2. **Account Service** (Port 5002)
   - Account creation and management
   - Multi-currency wallet support
   - Account balance tracking
   - Databases: SQL Server (primary), MongoDB (documents)

3. **Transaction Service** (Port 5003)
   - Payment processing
   - Money transfers
   - Transaction history
   - Fee calculation
   - Databases: SQL Server (primary), MongoDB (documents)

4. **Notification Service** (Port 5004)
   - Real-time notifications
   - Event-driven messaging
   - Database: MongoDB

5. **Investment Service** (Port 5005)
   - Portfolio management
   - Investment tracking
   - Database: SQL Server

6. **Loan Service** (Port 5006)
   - Loan applications
   - Loan management
   - Database: SQL Server

### API Gateway

- **Kong API Gateway** (Port 8000)
  - Request routing
  - Rate limiting
  - CORS handling
  - JWT validation

### Frontend

- **React Application** (Port 3000)
  - TypeScript
  - Redux Toolkit for state management
  - Bootstrap for UI
  - Responsive design

## Technology Stack

### Backend
- .NET 8.0 Core
- ASP.NET Core MVC
- Entity Framework Core
- OAuth2/JWT
- Kafka (Event Streaming)
- SQL Server
- MongoDB
- PostgreSQL

### Frontend
- React 18
- TypeScript
- Redux Toolkit
- Bootstrap 5
- Axios

### Infrastructure
- Docker & Docker Compose
- Kubernetes
- Kong API Gateway
- Kafka
- Redis (Caching)

## Data Flow

1. **User Registration/Login**
   - Frontend → API Gateway → Auth Service
   - Auth Service generates JWT token
   - Token stored in frontend localStorage

2. **Account Creation**
   - Frontend → API Gateway → Account Service
   - Account Service creates account
   - Publishes event to Kafka
   - Notification Service consumes event

3. **Transaction Processing**
   - Frontend → API Gateway → Transaction Service
   - Transaction Service creates transaction record
   - Publishes event to Kafka
   - Account Service consumes event to update balances

## Security

- JWT-based authentication
- Password hashing with BCrypt
- HTTPS enforcement
- API rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## Scalability

- Horizontal scaling with Kubernetes
- Stateless services
- Event-driven architecture
- Database sharding ready
- Caching layer (Redis)

## Monitoring & Logging

- Structured logging (Serilog)
- Health check endpoints
- Application Insights ready
- Prometheus metrics ready

## Monetization Features

- Transaction fees (1% with minimum $0.50)
- Premium account tiers (ready for implementation)
- Multi-currency conversion fees
- Investment management fees
- Loan processing fees


