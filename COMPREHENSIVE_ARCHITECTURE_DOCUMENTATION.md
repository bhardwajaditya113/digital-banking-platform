# Comprehensive Architecture Documentation
## Digital Banking Platform - Complete Technical Overview

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [High-Level Architecture (HLD)](#high-level-architecture-hld)
4. [System Design](#system-design)
5. [Data Flow Diagrams](#data-flow-diagrams)
6. [Low-Level Design (LLD)](#low-level-design-lld)
7. [Component Interactions](#component-interactions)
8. [Database Design](#database-design)
9. [Security Architecture](#security-architecture)
10. [Deployment Architecture](#deployment-architecture)

---

## 🎯 Executive Summary

The Digital Banking Platform is a **production-grade, microservices-based FinTech application** that provides comprehensive banking, trading, investment, and loan management services. Built with modern cloud-native principles, it supports horizontal scaling, event-driven architecture, and multi-currency operations.

### Key Characteristics:
- **Architecture Pattern**: Microservices with API Gateway
- **Communication**: REST APIs + Event-Driven (Kafka)
- **Deployment**: Containerized (Docker/Podman) with Kubernetes support
- **Scalability**: Stateless services, horizontal scaling ready
- **Resilience**: Circuit breakers, retry policies, graceful degradation

---

## 🛠️ Technology Stack

### Backend Technologies

#### Core Framework
- **.NET 8.0** - Latest LTS version
  - ASP.NET Core Web API
  - Entity Framework Core (ORM)
  - Dependency Injection Container
  - Configuration Management

#### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Password hashing (cost factor 12)
- **OAuth2/OIDC** - Industry-standard protocols
- **ASP.NET Core Identity** - User management foundation

#### Data Storage
- **SQL Server 2022** - Primary relational database
  - ACID transactions
  - Foreign key constraints
  - Indexed queries
  - Stored procedures ready

- **MongoDB 7.0** - Document database
  - Notification storage
  - Event logs
  - Flexible schema for documents

- **PostgreSQL 15** - Analytics database
  - Time-series data
  - Complex queries
  - Reporting and analytics

- **Redis 7** - In-memory cache
  - Session storage
  - Rate limiting counters
  - Hot data caching

#### Messaging & Event Streaming
- **Apache Kafka** - Event streaming platform
  - Topic-based pub/sub
  - Event sourcing ready
  - Message persistence
  - Consumer groups for scaling

#### API Gateway
- **Kong Gateway** - API management
  - Request routing
  - Rate limiting
  - CORS handling
  - JWT validation middleware
  - Load balancing

#### Logging & Monitoring
- **Serilog** - Structured logging
  - JSON format
  - Log levels (Debug, Info, Warning, Error)
  - Context enrichment
  - Console and file sinks

#### Testing
- **xUnit** - Unit testing framework
- **Moq** - Mocking framework
- **Integration Tests** - End-to-end service testing

### Frontend Technologies

#### Core Framework
- **React 18.2** - UI library
  - Component-based architecture
  - Hooks (useState, useEffect, useContext)
  - Lazy loading with Suspense
  - Error boundaries

- **TypeScript 4.9** - Type safety
  - Interface definitions
  - Type checking at compile time
  - Better IDE support

#### State Management
- **Redux Toolkit 2.0** - State management
  - Centralized store
  - Slice-based reducers
  - Async thunks for API calls
  - DevTools integration

#### Routing
- **React Router DOM 6.21** - Client-side routing
  - Protected routes
  - Lazy route loading
  - Navigation guards
  - URL parameter handling

#### UI Libraries
- **Bootstrap 5.3** - CSS framework
  - Responsive grid system
  - Pre-built components
  - Utility classes

- **React Bootstrap 2.9** - React components
  - Bootstrap components as React
  - Form controls
  - Modal dialogs

- **Framer Motion 10.16** - Animation library
  - Smooth transitions
  - Page transitions
  - Component animations

#### Data Visualization
- **Recharts 2.10** - Chart library
  - Line charts
  - Bar charts
  - Pie charts
  - Responsive charts

#### HTTP Client
- **Axios 1.6** - HTTP client
  - Request/response interceptors
  - Automatic JSON parsing
  - Error handling
  - Request cancellation

#### UI Enhancements
- **React Icons 4.12** - Icon library
- **React Toastify 9.1** - Toast notifications
- **html2canvas 1.4** - Screenshot generation
- **jspdf 2.5** - PDF generation

#### Testing
- **Playwright 1.57** - End-to-end testing
  - Cross-browser testing
  - Visual regression
  - API mocking
  - Screenshot capture

### Infrastructure Technologies

#### Containerization
- **Docker** - Container runtime
  - Multi-stage builds
  - Layer caching
  - Image optimization

- **Podman** - Alternative container runtime
  - Rootless containers
  - Docker-compatible CLI

#### Orchestration
- **Kubernetes** - Container orchestration
  - Deployment manifests
  - Service discovery
  - Auto-scaling ready
  - ConfigMaps and Secrets

#### Infrastructure as Code
- **Docker Compose** - Multi-container apps
- **Kubernetes Manifests** - K8s resources

---

## 🏗️ High-Level Architecture (HLD)

### Architecture Pattern: Microservices with API Gateway

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Web App    │  │  Mobile App  │  │  Admin Portal │        │
│  │  (React)     │  │  (Future)    │  │  (React)     │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Kong API Gateway (Port 8000)                 │  │
│  │  • Request Routing                                        │  │
│  │  • Rate Limiting                                          │  │
│  │  • CORS Handling                                          │  │
│  │  • JWT Validation                                         │  │
│  │  • Load Balancing                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼─────────┐ ┌──────▼──────┐ ┌─────────▼─────────┐
│  AUTH SERVICE     │ │  ACCOUNT    │ │  TRANSACTION     │
│  (Port 5001)      │ │  SERVICE    │ │  SERVICE         │
│                   │ │  (Port 5002)│ │  (Port 5003)     │
│ • Registration    │ │ • Accounts  │ │ • Transfers      │
│ • Login           │ │ • Wallets   │ │ • Payments       │
│ • JWT Generation  │ │ • Balances  │ │ • Fees           │
└─────────┬─────────┘ └──────┬──────┘ └─────────┬─────────┘
          │                   │                   │
┌─────────▼─────────┐ ┌──────▼──────┐ ┌─────────▼─────────┐
│  INVESTMENT       │ │  LOAN       │ │  TRADING          │
│  SERVICE          │ │  SERVICE    │ │  SERVICE          │
│  (Port 5005)      │ │  (Port 5006)│ │  (Port 5007)      │
│ • Portfolios     │ │ • Loans     │ │ • Stocks          │
│ • Investments     │ │ • Payments  │ │ • Crypto          │
└─────────┬─────────┘ └──────┬──────┘ └─────────┬─────────┘
          │                   │                   │
┌─────────▼─────────┐ ┌──────▼──────┐ ┌─────────▼─────────┐
│  NOTIFICATION     │ │  AI AGENT   │ │  CRYPTO           │
│  SERVICE          │ │  SERVICE    │ │  SERVICE          │
│  (Port 5004)      │ │  (Port 5008)│ │  (Domain)         │
│ • Notifications   │ │ • AI Advice │ │ • Crypto Ops     │
│ • Events         │ │ • Analysis  │ │ • Web3            │
└─────────┬─────────┘ └─────────────┘ └──────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                    EVENT STREAMING LAYER                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Apache Kafka                                │  │
│  │  Topics:                                                 │  │
│  │  • user-registered                                       │  │
│  │  • account-created                                       │  │
│  │  • transaction-completed                                 │  │
│  │  • notification-sent                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │h
│  │ SQL Server   │  │   MongoDB    │  │  PostgreSQL   │        │
│  │ (Primary DB)  │  │ (Documents)  │  │ (Analytics)  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐                                           │
│  │    Redis     │                                           │
│  │   (Cache)   │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

### Service Responsibilities

#### 1. Auth Service (Port 5001)
- **Purpose**: Authentication and authorization
- **Responsibilities**:
  - User registration with password hashing
  - User login and JWT token generation
  - Token validation and refresh
  - Role-based access control (RBAC)
  - User profile management
- **Database**: SQL Server (BankingAuth)
- **Events Published**: `user-registered`, `user-logged-in`

#### 2. Account Service (Port 5002)
- **Purpose**: Account and wallet management
- **Responsibilities**:
  - Account creation and management
  - Multi-currency wallet support (USD, EUR, GBP, AED)
  - Balance tracking and updates
  - Account statements
  - Account type management (Savings, Checking, Investment)
- **Databases**: SQL Server (BankingAccounts) + MongoDB (documents)
- **Cache**: Redis for hot account data
- **Events Published**: `account-created`, `balance-updated`
- **Events Consumed**: `transaction-completed`

#### 3. Transaction Service (Port 5003)
- **Purpose**: Payment processing and transfers
- **Responsibilities**:
  - Money transfers between accounts
  - Transaction fee calculation (1% with $0.50 minimum)
  - Transaction history
  - Transaction status management
  - Multi-currency transfers
- **Databases**: SQL Server (BankingTransactions) + MongoDB (documents)
- **Events Published**: `transaction-initiated`, `transaction-completed`, `transaction-failed`
- **Events Consumed**: None (initiates transactions)

#### 4. Notification Service (Port 5004)
- **Purpose**: Real-time notifications
- **Responsibilities**:
  - Consume events from Kafka
  - Generate notifications (email, SMS, in-app)
  - Store notification history
  - Notification preferences management
- **Database**: MongoDB (banking_documents)
- **Events Consumed**: All user-related events
- **Events Published**: None

#### 5. Investment Service (Port 5005)
- **Purpose**: Investment portfolio management
- **Responsibilities**:
  - Portfolio creation and management
  - Investment tracking
  - Performance analytics
  - Investment recommendations
- **Database**: SQL Server (BankingInvestments)
- **Events Published**: `investment-created`, `portfolio-updated`

#### 6. Loan Service (Port 5006)
- **Purpose**: Loan management
- **Responsibilities**:
  - Loan application processing
  - Loan approval workflow
  - Loan repayment tracking
  - Interest calculation
- **Database**: SQL Server (BankingLoans)
- **Events Published**: `loan-applied`, `loan-approved`, `loan-repaid`

#### 7. Trading Service (Port 5007)
- **Purpose**: Stock and cryptocurrency trading
- **Responsibilities**:
  - Stock trading (buy/sell)
  - Cryptocurrency trading
  - Market data integration (Yahoo Finance, CoinGecko)
  - Order management
  - Portfolio tracking
- **Database**: SQL Server (BankingTrading)
- **External APIs**: Yahoo Finance, CoinGecko, Forex APIs

#### 8. AI Agent Service (Port 5008)
- **Purpose**: AI-powered financial advisor
- **Responsibilities**:
  - Investment recommendations
  - Risk analysis
  - Financial planning advice
  - Market trend analysis
- **Integration**: Trading Service API
- **AI Models**: Local LLM or cloud-based (configurable)

#### 9. Crypto Service (Domain)
- **Purpose**: Cryptocurrency operations
- **Responsibilities**:
  - Web3 wallet integration
  - Blockchain interactions
  - Crypto transaction processing
- **Integration**: Trading Service

---

## 🎨 System Design

### Design Principles

1. **Separation of Concerns**
   - Each service has a single responsibility
   - Clear boundaries between services
   - Domain-driven design (DDD)

2. **Loose Coupling**
   - Services communicate via APIs and events
   - No direct database access between services
   - API contracts define interfaces

3. **High Cohesion**
   - Related functionality grouped in same service
   - Domain models encapsulate business logic

4. **Scalability**
   - Stateless services (can scale horizontally)
   - Database per service pattern
   - Caching layer for performance

5. **Resilience**
   - Circuit breakers for external calls
   - Retry policies with exponential backoff
   - Graceful degradation

6. **Security**
   - Defense in depth
   - JWT-based authentication
   - API rate limiting
   - Input validation at all layers

### Service Communication Patterns

#### 1. Synchronous Communication (REST)
- **Use Case**: Request-response operations
- **Examples**:
  - User login → Auth Service
  - Get account balance → Account Service
  - Create transaction → Transaction Service
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Timeout**: 30 seconds default

#### 2. Asynchronous Communication (Event-Driven)
- **Use Case**: Event notifications, eventual consistency
- **Examples**:
  - User registered → Notification Service
  - Transaction completed → Account Service (balance update)
  - Account created → Notification Service
- **Protocol**: Kafka
- **Format**: JSON messages
- **Guarantees**: At-least-once delivery

### Data Consistency Strategy

#### Strong Consistency (Synchronous)
- **Account Balance Updates**: Transaction Service → Account Service (via API)
- **User Authentication**: Immediate validation

#### Eventual Consistency (Asynchronous)
- **Notifications**: Event-driven, eventual delivery
- **Analytics**: Batch processing from events
- **Audit Logs**: Asynchronous writes

---

## 📊 Data Flow Diagrams

### 1. User Registration Flow

```
┌──────────┐
│  User   │
└────┬─────┘
     │ 1. POST /api/auth/register
     │    {email, password, firstName, lastName}
     ▼
┌─────────────────┐
│  React Frontend │
└────┬────────────┘
     │ 2. HTTP Request
     ▼
┌─────────────────┐
│ Kong API Gateway│
│  (Port 8000)    │
└────┬────────────┘
     │ 3. Route to /api/auth
     │ 4. Rate limiting check
     ▼
┌─────────────────┐
│  Auth Service   │
│  (Port 5001)    │
└────┬────────────┘
     │ 5. Validate input
     │ 6. Hash password (BCrypt)
     │ 7. Check email uniqueness
     ▼
┌─────────────────┐
│   SQL Server    │
│  BankingAuth DB │
└────┬────────────┘
     │ 8. Insert User record
     │
┌─────────────────┐
│  Auth Service   │
└────┬────────────┘
     │ 9. Generate JWT token
     │ 10. Publish event (non-blocking)
     ▼
┌─────────────────┐
│  Kafka Topic:   │
│ user-registered │
└────┬────────────┘
     │
     ├─► 11. Notification Service consumes
     │    → Creates welcome notification
     │
     └─► 12. Analytics Service (future)
         → Updates user metrics

┌─────────────────┐
│  Auth Service   │
└────┬────────────┘
     │ 13. Return JWT token + user info
     ▼
┌─────────────────┐
│  React Frontend │
└────┬────────────┘
     │ 14. Store token in localStorage
     │ 15. Redirect to dashboard
     ▼
┌──────────┐
│  User    │
│ (Logged) │
└──────────┘
```

### 2. Money Transfer Flow

```
┌──────────┐
│  User   │
└────┬─────┘
     │ 1. Initiate transfer
     │    {fromAccount, toAccount, amount, currency}
     ▼
┌─────────────────┐
│  React Frontend │
└────┬────────────┘
     │ 2. POST /api/transaction/transfer
     │    Authorization: Bearer <JWT>
     ▼
┌─────────────────┐
│ Kong API Gateway│
└────┬────────────┘
     │ 3. Validate JWT
     │ 4. Route to Transaction Service
     ▼
┌──────────────────────┐
│  Transaction Service │
│  (Port 5003)         │
└────┬─────────────────┘
     │ 5. Validate request
     │ 6. Check account existence
     │ 7. Calculate fee (1% or $0.50 min)
     │ 8. Check sufficient balance
     ▼
┌─────────────────┐
│  Account Service│
│  (Port 5002)     │
└────┬────────────┘
     │ 9. GET /api/account/{id}/balance
     │ 10. Verify balance
     │ 11. Lock account (optimistic locking)
     ▼
┌──────────────────────┐
│  Transaction Service │
└────┬─────────────────┘
     │ 12. Create transaction record
     │ 13. Update balances (via Account Service API)
     │ 14. Publish event: transaction-completed
     ▼
┌─────────────────┐
│  Account Service│
└────┬────────────┘
     │ 15. Debit from account
     │ 16. Credit to account
     │ 17. Update balances in SQL Server
     │ 18. Update Redis cache
     ▼
┌─────────────────┐
│  Kafka Topic:   │
│transaction-     │
│completed        │
└────┬────────────┘
     │
     ├─► 19. Notification Service
     │    → Sends confirmation notification
     │
     └─► 20. Analytics Service (future)
         → Updates transaction metrics

┌──────────────────────┐
│  Transaction Service │
└────┬─────────────────┘
     │ 21. Return transaction details
     ▼
┌─────────────────┐
│  React Frontend │
└────┬────────────┘
     │ 22. Display success message
     │ 23. Refresh account balances
     ▼
┌──────────┐
│  User    │
└──────────┘
```

### 3. Event-Driven Notification Flow

```
┌─────────────────┐
│  Any Service    │
│  (Event Source) │
└────┬────────────┘
     │ 1. Publish event to Kafka
     │    Topic: user-registered
     │    {userId, email, timestamp}
     ▼
┌─────────────────┐
│  Kafka Broker   │
│  Topic: user-   │
│  registered     │
└────┬────────────┘
     │ 2. Message persisted
     │ 3. Consumer group notified
     ▼
┌──────────────────────┐
│ Notification Service │
│  (Port 5004)         │
│  Kafka Consumer      │
└────┬─────────────────┘
     │ 4. Consume message
     │ 5. Parse event data
     │ 6. Generate notification
     │    {type: "welcome", userId, message}
     ▼
┌─────────────────┐
│   MongoDB       │
│  Notifications  │
│  Collection     │
└────┬────────────┘
     │ 7. Store notification
     │
┌──────────────────────┐
│ Notification Service │
└────┬─────────────────┘
     │ 8. Send via channels:
     │    - In-app notification
     │    - Email (future)
     │    - SMS (future)
     │    - Push (future)
     ▼
┌─────────────────┐
│  User receives  │
│  notification   │
└─────────────────┘
```

---

## 🔧 Low-Level Design (LLD)

### Service Architecture Pattern: Clean Architecture / Onion Architecture

Each microservice follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                            │
│  • Controllers (HTTP endpoints)                         │
│  • Request/Response DTOs                               │
│  • Input validation                                     │
│  • Authentication middleware                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                APPLICATION LAYER                        │
│  • Command Handlers (CQRS pattern)                      │
│  • Business logic orchestration                         │
│  • Event publishing                                      │
│  • DTOs mapping                                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  DOMAIN LAYER                           │
│  • Domain entities                                       │
│  • Business rules                                       │
│  • Repository interfaces                                │
│  • Domain events                                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              INFRASTRUCTURE LAYER                       │
│  • Repository implementations                           │
│  • Database context (EF Core)                           │
│  • External service clients                             │
│  • Kafka producers/consumers                            │
│  • Cache implementations                                 │
└─────────────────────────────────────────────────────────┘
```

### Example: Auth Service Structure

```
AuthService/
├── AuthService.API/                    # API Layer
│   ├── Controllers/
│   │   ├── AuthController.cs          # /api/auth/register, /api/auth/login
│   │   └── HealthController.cs        # /health
│   ├── Program.cs                      # Service configuration
│   └── appsettings.json               # Configuration
│
├── AuthService.Application/            # Application Layer
│   ├── Commands/
│   │   ├── RegisterCommand.cs         # Command DTO
│   │   ├── RegisterCommandHandler.cs  # Business logic
│   │   ├── LoginCommand.cs
│   │   └── LoginCommandHandler.cs
│   └── DTOs/
│       ├── RegisterRequestDto.cs
│       ├── RegisterResponseDto.cs
│       └── LoginResponseDto.cs
│
├── AuthService.Domain/                 # Domain Layer
│   ├── Entities/
│   │   └── User.cs                    # Domain entity
│   └── Repositories/
│       └── IUserRepository.cs         # Repository interface
│
└── AuthService.Infrastructure/        # Infrastructure Layer
    ├── Data/
    │   └── AuthDbContext.cs           # EF Core context
    ├── Repositories/
    │   └── UserRepository.cs          # Repository implementation
    └── Consumers/                     # Kafka consumers (if needed)
```

### Key Design Patterns

#### 1. CQRS (Command Query Responsibility Segregation)
- **Commands**: Write operations (Register, Login, CreateAccount)
- **Queries**: Read operations (GetAccount, GetTransactions)
- **Benefits**: Separation of read/write, optimization per operation type

#### 2. Repository Pattern
- **Interface**: Defined in Domain layer
- **Implementation**: In Infrastructure layer
- **Benefits**: Abstraction, testability, database-agnostic

#### 3. Dependency Injection
- **Constructor Injection**: All dependencies injected via constructors
- **Lifetime**: Scoped (per request), Singleton (shared), Transient (new instance)
- **Benefits**: Loose coupling, testability

#### 4. Event-Driven Architecture
- **Producer**: Services publish events to Kafka
- **Consumer**: Services consume events asynchronously
- **Benefits**: Decoupling, scalability, eventual consistency

#### 5. API Gateway Pattern
- **Single Entry Point**: All requests go through Kong
- **Routing**: Kong routes to appropriate service
- **Cross-Cutting Concerns**: Auth, rate limiting, CORS handled at gateway

### Database Design

#### SQL Server Schema (Example: Auth Service)

```sql
-- Users Table
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20),
    Roles NVARCHAR(MAX), -- JSON array: ["user", "admin"]
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    INDEX IX_Users_Email (Email),
    INDEX IX_Users_IsActive (IsActive)
);
```

#### MongoDB Schema (Example: Notifications)

```json
{
  "_id": ObjectId("..."),
  "userId": "guid",
  "type": "welcome|transaction|account",
  "title": "Welcome to Banking Platform",
  "message": "Your account has been created successfully",
  "read": false,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "metadata": {
    "accountId": "guid",
    "transactionId": "guid"
  }
}
```

---

## 🔄 Component Interactions

### Request Flow (Synchronous)

```
Client Request
    │
    ▼
[Kong API Gateway]
    │ • Validate JWT (if protected)
    │ • Rate limiting
    │ • CORS
    │
    ▼
[Target Service Controller]
    │ • Parse request
    │ • Validate input
    │
    ▼
[Command Handler]
    │ • Business logic
    │ • Validation
    │
    ▼
[Repository]
    │ • Database query
    │
    ▼
[SQL Server / MongoDB]
    │
    ▼
[Response flows back]
```

### Event Flow (Asynchronous)

```
[Service A]
    │ • Business operation completes
    │
    ▼
[Kafka Producer]
    │ • Serialize event
    │ • Publish to topic
    │
    ▼
[Kafka Broker]
    │ • Persist message
    │ • Notify consumers
    │
    ▼
[Service B - Kafka Consumer]
    │ • Consume message
    │ • Deserialize
    │ • Process event
    │
    ▼
[Service B Business Logic]
    │ • Update state
    │ • Trigger actions
```

---

## 🔐 Security Architecture

### Authentication Flow

1. **User Registration**
   - Password hashed with BCrypt (cost factor 12)
   - Email uniqueness check
   - JWT token generated upon success

2. **User Login**
   - Email/password validated
   - Password hash comparison
   - JWT token generated (expires in 60 minutes)
   - Token includes: userId, email, roles

3. **Token Validation**
   - Kong Gateway validates JWT on protected routes
   - Token signature verified
   - Expiration checked
   - Roles extracted for authorization

### Authorization

- **Role-Based Access Control (RBAC)**
  - Roles: `user`, `admin`
  - Stored in JWT claims
  - Checked at API Gateway and service level

### Security Measures

1. **Password Security**
   - BCrypt hashing (one-way)
   - Minimum password requirements (enforced in frontend)
   - No password storage in plain text

2. **API Security**
   - JWT tokens (stateless)
   - HTTPS enforcement (production)
   - Rate limiting (Kong)
   - CORS configuration

3. **Input Validation**
   - Frontend validation (UX)
   - Backend validation (security)
   - SQL injection prevention (EF Core parameterized queries)
   - XSS prevention (React auto-escaping)

4. **Database Security**
   - Connection strings in environment variables
   - SQL Server authentication
   - MongoDB authentication
   - No direct database exposure

---

## 🚀 Deployment Architecture

### Container Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Container Host                        │
│  (Docker/Podman or Kubernetes Node)                    │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Auth Service │  │ Account     │  │ Transaction  │   │
│  │ Container    │  │ Service     │  │ Service      │   │
│  │ Port: 5001   │  │ Container   │  │ Container    │   │
│  │              │  │ Port: 5002  │  │ Port: 5003   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Kong Gateway │  │ SQL Server   │  │ MongoDB      │   │
│  │ Container    │  │ Container   │  │ Container   │   │
│  │ Port: 8000   │  │ Port: 1433   │  │ Port: 27017  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Kafka        │  │ Redis        │  │ PostgreSQL   │   │
│  │ Container    │  │ Container    │  │ Container    │   │
│  │ Port: 9092   │  │ Port: 6379   │  │ Port: 5432   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Kubernetes Deployment (Future)

- **Deployments**: Each service as a Kubernetes Deployment
- **Services**: Kubernetes Service for service discovery
- **ConfigMaps**: Configuration management
- **Secrets**: Sensitive data (passwords, keys)
- **Ingress**: External access via Ingress controller
- **Horizontal Pod Autoscaler**: Auto-scaling based on metrics

### Scaling Strategy

1. **Horizontal Scaling**
   - Multiple instances of stateless services
   - Load balanced by Kong Gateway
   - Database connection pooling

2. **Vertical Scaling**
   - Increase container resources (CPU, memory)
   - Database server scaling

3. **Caching Strategy**
   - Redis for hot data
   - Reduce database load
   - Faster response times

---

## 📈 Performance Considerations

### Optimization Strategies

1. **Database**
   - Indexed queries
   - Connection pooling
   - Query optimization
   - Read replicas (future)

2. **Caching**
   - Redis for frequently accessed data
   - Account balances cached
   - Session data cached

3. **API**
   - Response compression
   - Pagination for large datasets
   - Lazy loading in frontend

4. **Frontend**
   - Code splitting
   - Lazy route loading
   - Image optimization
   - CDN for static assets (future)

---

## 🔍 Monitoring & Observability

### Logging
- **Structured Logging**: Serilog with JSON format
- **Log Levels**: Debug, Info, Warning, Error
- **Context**: Request ID, User ID, Service name

### Health Checks
- **Endpoint**: `/health` on each service
- **Checks**: Database connectivity, Kafka connectivity
- **Response**: `{"status": "healthy", "timestamp": "..."}`

### Metrics (Future)
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **Application Insights**: Azure monitoring (if deployed to Azure)

---

## 📝 Summary

This Digital Banking Platform is built with:

✅ **Modern Microservices Architecture** - Scalable, maintainable, testable
✅ **Event-Driven Communication** - Loose coupling, high availability
✅ **Security-First Design** - JWT, BCrypt, rate limiting, input validation
✅ **Production-Ready Infrastructure** - Docker, Kubernetes, monitoring ready
✅ **Clean Code Architecture** - Separation of concerns, SOLID principles
✅ **Comprehensive Technology Stack** - .NET 8, React 18, Kafka, SQL Server, MongoDB

The platform is designed to handle:
- High transaction volumes
- Multi-currency operations
- Real-time notifications
- Horizontal scaling
- Fault tolerance

All services are containerized, can be deployed independently, and follow industry best practices for microservices architecture.

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintained By**: Digital Banking Platform Team

