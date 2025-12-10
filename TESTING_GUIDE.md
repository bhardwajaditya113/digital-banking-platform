# End-to-End Testing Guide

## 🚀 Application Status

All services have been started! Here's what's running:

### Infrastructure
- ✅ Docker Desktop
- ✅ SQL Server (banking-sqlserver)
- ✅ PostgreSQL (banking-postgres)
- ✅ MongoDB (banking-mongodb)
- ✅ Redis (banking-redis)
- ✅ Kafka + Zookeeper (banking-kafka, banking-zookeeper)

### Backend Services
- ✅ Auth Service: http://localhost:5001
  - Swagger: http://localhost:5001/swagger
  - Health: http://localhost:5001/health

- ✅ Account Service: http://localhost:5002
  - Swagger: http://localhost:5002/swagger
  - Health: http://localhost:5002/health

- ✅ Transaction Service: http://localhost:5003
  - Swagger: http://localhost:5003/swagger
  - Health: http://localhost:5003/health

- ✅ Notification Service: http://localhost:5004
  - Swagger: http://localhost:5004/swagger
  - Health: http://localhost:5004/health

### Frontend
- ✅ React App: http://localhost:3000

---

## 🧪 End-to-End Testing Steps

### Step 1: Register a New User

1. Open http://localhost:3000 in your browser
2. Click "Register" or navigate to `/register`
3. Fill in the registration form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Phone Number: `+1234567890`
   - Password: `Test@123456`
   - Confirm Password: `Test@123456`
4. Click "Register"
5. **Expected Result:** Success message, redirected to login page

**API Test:**
```bash
POST http://localhost:5001/api/Auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "Test@123456"
}
```

### Step 2: Login

1. On the login page, enter:
   - Email: `john.doe@example.com`
   - Password: `Test@123456`
2. Click "Login"
3. **Expected Result:** Success, redirected to Dashboard

**API Test:**
```bash
POST http://localhost:5001/api/Auth/login
{
  "email": "john.doe@example.com",
  "password": "Test@123456"
}
```

### Step 3: Create an Account

1. After login, you should see the Dashboard
2. Click "Create Account" or navigate to `/accounts`
3. Fill in:
   - Account Type: `Savings` or `Checking`
   - Currency: `USD`
4. Click "Create Account"
5. **Expected Result:** Account created, appears in accounts list

**API Test:**
```bash
POST http://localhost:5002/api/Account
Authorization: Bearer <your-token>
{
  "accountType": "Savings",
  "currency": "USD"
}
```

### Step 4: View Accounts

1. Navigate to "Accounts" page
2. **Expected Result:** See your created account(s) with:
   - Account Number
   - Account Type
   - Balance
   - Currency
   - Status

**API Test:**
```bash
GET http://localhost:5002/api/Account/user/<userId>
Authorization: Bearer <your-token>
```

### Step 5: Make a Transfer

**Prerequisites:** You need at least 2 accounts or know another account ID

1. Navigate to "Transfer" page
2. Fill in transfer form:
   - From Account: Select your account
   - To Account ID: Enter recipient account ID
   - Amount: `100.00`
   - Currency: `USD`
   - Description: `Test transfer`
3. Click "Transfer"
4. **Expected Result:** Transfer successful, notification shown

**API Test:**
```bash
POST http://localhost:5003/api/Transaction/transfer
Authorization: Bearer <your-token>
{
  "fromAccountId": "<account-id>",
  "toAccountId": "<recipient-account-id>",
  "amount": 100.00,
  "currency": "USD",
  "description": "Test transfer"
}
```

### Step 6: View Transactions

1. Navigate to "Transactions" page
2. **Expected Result:** See transaction history:
   - Transfer transactions
   - Transaction details (amount, date, status)
   - Filters and search

**API Test:**
```bash
GET http://localhost:5003/api/Transaction/account/<account-id>
Authorization: Bearer <your-token>
```

### Step 7: View Account Statements

1. Navigate to "Statements" page
2. Select an account and date range
3. Click "Generate Statement"
4. **Expected Result:** Statement displayed, can export as PDF

### Step 8: Explore Other Features

- **Investments:** View investment options and portfolio
- **Loans:** View loan products and applications
- **Settings:** Update profile, change password
- **Help/Support:** FAQ and support information

---

## 🔍 Troubleshooting

### Services Not Responding

1. **Check PowerShell Windows:**
   - Look for error messages in service windows
   - Common issues: Database connection errors

2. **Check Docker:**
   ```powershell
   docker ps
   docker logs banking-sqlserver
   docker logs banking-mongodb
   ```

3. **Restart Services:**
   ```powershell
   .\scripts\quick-start-backend.ps1
   ```

### Database Connection Errors

- Ensure Docker Desktop is running
- Wait 30-60 seconds after starting Docker
- Check container health: `docker ps`

### Frontend Not Loading

- Check if Node.js is running: `Get-Process node`
- Restart frontend: `cd src/frontend && npm start`
- Clear browser cache

### API Connection Errors

- Verify backend services are running on correct ports
- Check browser console for CORS errors
- Verify API URLs in `src/frontend/src/services/api.ts`

---

## 📝 Test Checklist

- [ ] User Registration
- [ ] User Login
- [ ] Account Creation
- [ ] View Accounts
- [ ] Money Transfer
- [ ] View Transactions
- [ ] Account Statements
- [ ] Investments Page
- [ ] Loans Page
- [ ] Settings Page
- [ ] Dark Mode Toggle
- [ ] Responsive Design (mobile/tablet)

---

## 🎯 Success Criteria

✅ All services are running and healthy
✅ User can register and login
✅ User can create accounts
✅ User can make transfers
✅ Transactions are recorded
✅ UI is responsive and modern
✅ No console errors
✅ All API endpoints respond correctly

---

## 📞 Support

If you encounter issues:
1. Check PowerShell windows for error messages
2. Check Docker container logs
3. Verify all services are running on correct ports
4. Check browser console for frontend errors
5. Review service logs in PowerShell windows

**Happy Testing! 🚀**


