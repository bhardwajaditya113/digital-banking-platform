# Setup and Testing Guide

## 🔧 Prerequisites Setup

### 1. Install Docker Desktop

**Download and Install:**
- Visit: https://www.docker.com/products/docker-desktop
- Download Docker Desktop for Windows
- Install and restart your computer
- **Start Docker Desktop** (important!)

**Verify Installation:**
```powershell
docker --version
docker-compose --version
```

### 2. Install .NET 8.0 SDK

**Download and Install:**
- Visit: https://dotnet.microsoft.com/download/dotnet/8.0
- Download .NET 8.0 SDK for Windows
- Install the SDK

**Verify Installation:**
```powershell
dotnet --version
```

### 3. Install Node.js 18+

**Download and Install:**
- Visit: https://nodejs.org/
- Download Node.js 18 LTS or higher
- Install Node.js

**Verify Installation:**
```powershell
node --version
npm --version
```

---

## 🚀 Deployment Steps

### Step 1: Start Docker Desktop

1. Open Docker Desktop application
2. Wait for it to fully start (whale icon in system tray)
3. Verify it's running: Docker icon should be green

### Step 2: Start Infrastructure Services

Open PowerShell in the project directory and run:

```powershell
docker-compose -f docker-compose.infrastructure.yml up -d
```

**Wait 30-60 seconds** for services to initialize.

**Verify services are running:**
```powershell
docker ps
```

You should see:
- sqlserver
- mongodb
- postgresql
- zookeeper
- kafka
- kafka-ui
- redis

### Step 3: Build Backend Services

```powershell
cd src/backend
dotnet restore BankingPlatform.sln
dotnet build BankingPlatform.sln -c Release
```

### Step 4: Start Backend Services

**Option A: Run Individually (Recommended for Testing)**

Open multiple PowerShell windows:

**Terminal 1 - Auth Service:**
```powershell
cd src/backend/services/AuthService/AuthService.API
dotnet run
```

**Terminal 2 - Account Service:**
```powershell
cd src/backend/services/AccountService/AccountService.API
dotnet run
```

**Terminal 3 - Transaction Service:**
```powershell
cd src/backend/services/TransactionService/TransactionService.API
dotnet run
```

**Terminal 4 - Notification Service:**
```powershell
cd src/backend/services/NotificationService/NotificationService.API
dotnet run
```

**Option B: Use Docker Compose**

```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi"
docker-compose up -d
```

### Step 5: Start Frontend

Open a new PowerShell window:

```powershell
cd src/frontend
npm install
npm start
```

The frontend will open at: **http://localhost:3000**

---

## 🧪 Testing Guide

### 1. Test Infrastructure Services

**Check SQL Server:**
```powershell
docker exec -it banking-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Banking@123!" -Q "SELECT @@VERSION"
```

**Check MongoDB:**
```powershell
docker exec -it banking-mongodb mongosh -u banking_admin -p "Banking@123!" --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

**Check Kafka:**
- Open browser: http://localhost:8080 (Kafka UI)
- You should see Kafka topics

### 2. Test Backend Services

**Auth Service:**
```powershell
curl http://localhost:5001/health
```

**Account Service:**
```powershell
curl http://localhost:5002/health
```

**Transaction Service:**
```powershell
curl http://localhost:5003/health
```

**Or use browser:**
- Auth Service Swagger: http://localhost:5001/swagger
- Account Service Swagger: http://localhost:5002/swagger
- Transaction Service Swagger: http://localhost:5003/swagger

### 3. Test Frontend

1. Open browser: http://localhost:3000
2. You should see the beautiful login page
3. Click "Sign up here" to register
4. Fill in the registration form
5. After registration, you'll be redirected to dashboard

### 4. Test Complete Flow

#### A. Register a New User
1. Go to http://localhost:3000
2. Click "Sign up here"
3. Fill in:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +1234567890
   - Password: SecurePass123!
4. Click "Create Account"
5. You should be logged in and see the dashboard

#### B. Create an Account
1. Click "Accounts" in navbar
2. Click "Create New Account"
3. Select "Savings" and "USD"
4. Click "Create Account"
5. You should see your new account card

#### C. Make a Transfer
1. Note your account ID from Accounts page
2. Go to "Transfer" page
3. Select your account
4. Enter another account ID (or use the same for testing)
5. Enter amount: 100
6. Click "Transfer Money"
7. Check the transfer summary shows correct fee calculation

#### D. View Transactions
1. Go to "Transactions" page
2. You should see your transfer
3. Try the filters and search
4. Click "Export CSV" to download

#### E. View Statements
1. Go to "Statements" page
2. Select your account
3. Choose date range
4. View statement
5. Try "Download PDF" and "Print"

#### F. Test Other Features
- Investments: Create a portfolio
- Loans: Apply for a loan
- Settings: Update profile
- Help: Browse FAQ
- Dark Mode: Toggle theme

---

## 🔍 Troubleshooting

### Docker Not Running
**Error:** `error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine...`

**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start
3. Try again

### .NET SDK Not Found
**Error:** `dotnet : The term 'dotnet' is not recognized`

**Solution:**
1. Install .NET 8.0 SDK
2. Restart PowerShell
3. Verify: `dotnet --version`

### Port Already in Use
**Error:** `Address already in use`

**Solution:**
1. Find process using port:
   ```powershell
   netstat -ano | findstr :5001
   ```
2. Kill process or change port in appsettings.json

### Database Connection Errors
**Error:** `Cannot open database`

**Solution:**
1. Check SQL Server is running: `docker ps | findstr sqlserver`
2. Wait 30 seconds after starting
3. Check connection string in appsettings.json

### Frontend Build Errors
**Error:** `npm install` fails

**Solution:**
```powershell
cd src/frontend
rm -r node_modules
rm package-lock.json
npm install
```

### Services Not Starting
**Check logs:**
```powershell
docker-compose logs auth-service
docker-compose logs account-service
```

---

## ✅ Quick Health Check

Run this script to check all services:

```powershell
# Check Docker
docker ps

# Check Backend Services
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health

# Check Frontend
Start-Process "http://localhost:3000"
```

---

## 🎯 Expected Results

### After Successful Deployment:

1. **Infrastructure:**
   - 7 Docker containers running
   - All databases accessible
   - Kafka UI accessible at http://localhost:8080

2. **Backend Services:**
   - Auth Service: http://localhost:5001 (Swagger available)
   - Account Service: http://localhost:5002
   - Transaction Service: http://localhost:5003
   - Notification Service: http://localhost:5004
   - Investment Service: http://localhost:5005
   - Loan Service: http://localhost:5006

3. **Frontend:**
   - Beautiful login page at http://localhost:3000
   - All pages accessible after login
   - Dark mode toggle works
   - All features functional

---

## 📝 Testing Checklist

- [ ] Infrastructure services running
- [ ] Backend services responding to /health
- [ ] Frontend loads successfully
- [ ] User registration works
- [ ] User login works
- [ ] Account creation works
- [ ] Money transfer works
- [ ] Transaction history displays
- [ ] Export to CSV works
- [ ] PDF generation works
- [ ] Dark mode toggle works
- [ ] All pages load correctly
- [ ] Search and filters work
- [ ] Settings page works
- [ ] Help page accessible

---

## 🚀 Ready to Test!

Follow the steps above to deploy and test the platform. If you encounter any issues, check the troubleshooting section or the logs.

**Happy Testing! 🎉**


