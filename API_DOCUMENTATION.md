# API Documentation

## Base URLs

- **Development**: http://localhost:8000 (API Gateway)
- **Auth Service**: http://localhost:5001
- **Account Service**: http://localhost:5002
- **Transaction Service**: http://localhost:5003
- **Investment Service**: http://localhost:5005
- **Loan Service**: http://localhost:5006

## Authentication

All protected endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Auth Service

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "guid-here",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "guid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["Customer"]
  }
}
```

#### POST /api/auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** Same as register endpoint.

### Account Service

#### POST /api/account
Create a new account (requires authentication).

**Request Body:**
```json
{
  "accountType": "Savings",
  "currency": "USD"
}
```

**Response:**
```json
{
  "id": "guid",
  "userId": "guid",
  "accountNumber": "123456789012",
  "accountType": "Savings",
  "currency": "USD",
  "balance": 0.00,
  "availableBalance": 0.00,
  "isActive": true,
  "wallets": [
    {
      "id": "guid",
      "currency": "USD",
      "balance": 0.00
    }
  ]
}
```

#### GET /api/account/{id}
Get account details by ID.

#### GET /api/account/user/{userId}
Get all accounts for a user.

### Transaction Service

#### POST /api/transaction/transfer
Initiate a money transfer (requires authentication).

**Request Body:**
```json
{
  "fromAccountId": "guid",
  "toAccountId": "guid",
  "amount": 100.00,
  "currency": "USD",
  "description": "Payment for services"
}
```

**Response:**
```json
{
  "id": "guid",
  "fromAccountId": "guid",
  "toAccountId": "guid",
  "transactionType": "Transfer",
  "amount": 100.00,
  "currency": "USD",
  "status": "Pending",
  "description": "Payment for services",
  "referenceNumber": "TXN20240101ABC12345",
  "fee": 1.00,
  "createdAt": "2024-01-01T12:00:00Z"
}
```

#### GET /api/transaction/{id}
Get transaction details by ID.

#### GET /api/transaction/account/{accountId}
Get all transactions for an account.

### Investment Service

#### POST /api/portfolio
Create a new investment portfolio (requires authentication).

**Request Body:**
```json
{
  "name": "My Investment Portfolio"
}
```

#### GET /api/portfolio/{id}
Get portfolio details by ID.

#### GET /api/portfolio/user/{userId}
Get all portfolios for a user.

### Loan Service

#### POST /api/loan
Create a new loan application (requires authentication).

**Request Body:**
```json
{
  "loanType": "Personal",
  "principalAmount": 10000.00,
  "interestRate": 5.5,
  "termMonths": 36
}
```

**Response:**
```json
{
  "id": "guid",
  "userId": "guid",
  "loanNumber": "LOAN20240101ABC12345",
  "loanType": "Personal",
  "principalAmount": 10000.00,
  "interestRate": 5.5,
  "termMonths": 36,
  "monthlyPayment": 301.92,
  "remainingBalance": 10000.00,
  "status": "Pending",
  "payments": []
}
```

#### GET /api/loan/{id}
Get loan details by ID.

#### GET /api/loan/user/{userId}
Get all loans for a user.

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized access"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An error occurred while processing your request"
}
```

## Rate Limiting

- Auth endpoints: 100 requests/minute
- Account endpoints: 200 requests/minute
- Transaction endpoints: 100 requests/minute

## Health Checks

All services expose a health check endpoint:

```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Swagger UI

Interactive API documentation is available at:
- Auth Service: http://localhost:5001/swagger
- Account Service: http://localhost:5002/swagger
- Transaction Service: http://localhost:5003/swagger
- Investment Service: http://localhost:5005/swagger
- Loan Service: http://localhost:5006/swagger


