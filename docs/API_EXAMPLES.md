# API Examples - Complete Guide

## Authentication

### Register a New User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "guid-here",
  "expiresAt": "2024-01-01T12:00:00Z",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["Customer"]
  }
}
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

## Accounts

### Create Account

```bash
curl -X POST http://localhost:8000/api/account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accountType": "Savings",
    "currency": "USD"
  }'
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "accountNumber": "123456789012",
  "accountType": "Savings",
  "currency": "USD",
  "balance": 0.00,
  "availableBalance": 0.00,
  "isActive": true,
  "wallets": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "currency": "USD",
      "balance": 0.00
    }
  ]
}
```

### Get User Accounts

```bash
curl -X GET http://localhost:8000/api/account/user/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Transactions

### Transfer Money

```bash
curl -X POST http://localhost:8000/api/transaction/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "fromAccountId": "123e4567-e89b-12d3-a456-426614174000",
    "toAccountId": "123e4567-e89b-12d3-a456-426614174001",
    "amount": 100.00,
    "currency": "USD",
    "description": "Payment for services"
  }'
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "fromAccountId": "123e4567-e89b-12d3-a456-426614174000",
  "toAccountId": "123e4567-e89b-12d3-a456-426614174001",
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

### Get Account Transactions

```bash
curl -X GET http://localhost:8000/api/transaction/account/ACCOUNT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Investments

### Create Portfolio

```bash
curl -X POST http://localhost:8000/api/portfolio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My Investment Portfolio"
  }'
```

### Get User Portfolios

```bash
curl -X GET http://localhost:8000/api/portfolio/user/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Loans

### Apply for Loan

```bash
curl -X POST http://localhost:8000/api/loan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "loanType": "Personal",
    "principalAmount": 10000.00,
    "interestRate": 5.5,
    "termMonths": 36
  }'
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
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

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "errors": ["Field 1 error", "Field 2 error"]
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

When rate limit is exceeded:
- **Status Code**: 429 Too Many Requests
- **Headers**: 
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 0
  - `X-RateLimit-Reset`: 1609459200

## Pagination (Future Enhancement)

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalCount": 100
  }
}
```


