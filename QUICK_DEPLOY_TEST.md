# 🚀 Quick Deploy and Test Guide

## ⚠️ IMPORTANT: Before Starting

### 1. Start Docker Desktop
1. **Open Docker Desktop** from Start Menu
2. **Wait for it to fully start** (whale icon should be steady, not animating)
3. You'll see "Docker Desktop is running" when ready

### 2. Verify Prerequisites

Open PowerShell and run:

```powershell
# Check Docker
docker --version
docker ps

# Check .NET (if installed)
dotnet --version

# Check Node.js
node --version
npm --version
```

---

## 🎯 Option 1: Full Deployment (Recommended)

### Step 1: Start Infrastructure

```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi"
docker-compose -f docker-compose.infrastructure.yml up -d
```

**Wait 30-60 seconds**, then verify:

```powershell
docker ps
```

You should see: sqlserver, mongodb, postgresql, kafka, zookeeper, redis

### Step 2: Start Backend Services

**Open 4 separate PowerShell windows:**

**Window 1 - Auth Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\AuthService\AuthService.API"
dotnet run
```
Should start on: http://localhost:5001

**Window 2 - Account Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\AccountService\AccountService.API"
dotnet run
```
Should start on: http://localhost:5002

**Window 3 - Transaction Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\TransactionService\TransactionService.API"
dotnet run
```
Should start on: http://localhost:5003

**Window 4 - Notification Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\NotificationService\NotificationService.API"
dotnet run
```
Should start on: http://localhost:5004

### Step 3: Start Frontend

**Open a new PowerShell window:**

```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\frontend"
npm install
npm start
```

Frontend will open at: **http://localhost:3000**

---

## 🧪 Testing Steps

### Test 1: Access Frontend
1. Open browser: http://localhost:3000
2. You should see the **beautiful login page** with gradient background
3. Click "Sign up here"

### Test 2: Register User
1. Fill in registration form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Phone: `1234567890`
   - Password: `Test123!`
2. Click "Create Account"
3. You should be redirected to **Dashboard**

### Test 3: Explore Dashboard
1. See welcome message with your name
2. View stat cards (Total Balance, etc.)
3. See transaction history chart
4. See account distribution pie chart

### Test 4: Create Account
1. Click "Accounts" in navbar
2. Click "Create New Account" button
3. Select "Savings" and "USD"
4. Click "Create Account"
5. See your new account card appear

### Test 5: Make Transfer
1. Click "Transfer" in navbar
2. Select your account from dropdown
3. Enter a recipient account ID (use same account for testing)
4. Enter amount: `50`
5. See fee calculation in sidebar
6. Click "Transfer Money"
7. See success toast notification

### Test 6: View Transactions
1. Click "Transactions" in navbar
2. See your transfer in the list
3. Try search functionality
4. Try filters (status, type)
5. Click "Export CSV" button

### Test 7: Test Other Features
- **Statements**: Generate PDF statement
- **Investments**: Create portfolio
- **Loans**: Apply for loan
- **Settings**: Update profile
- **Help**: Browse FAQ
- **Dark Mode**: Toggle theme (moon icon in navbar)

---

## 🔍 Verify Services

### Check Backend Health

Open browser and visit:
- http://localhost:5001/health (Auth Service)
- http://localhost:5002/health (Account Service)
- http://localhost:5003/health (Transaction Service)

Should return: `{"status":"healthy","timestamp":"..."}`

### Check Swagger Documentation

- http://localhost:5001/swagger (Auth Service API docs)
- http://localhost:5002/swagger (Account Service API docs)
- http://localhost:5003/swagger (Transaction Service API docs)

### Check Kafka UI

- http://localhost:8080 (Kafka topics and messages)

---

## 🐛 Troubleshooting

### Docker Not Running
**Solution:** Start Docker Desktop and wait for it to fully load

### Port Already in Use
**Solution:** 
```powershell
# Find what's using the port
netstat -ano | findstr :5001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### .NET SDK Not Found
**Install:** https://dotnet.microsoft.com/download/dotnet/8.0

### Node.js Not Found
**Install:** https://nodejs.org/ (LTS version)

### Database Connection Errors
**Solution:** Wait 30-60 seconds after starting Docker, databases need time to initialize

### Frontend Build Errors
```powershell
cd src/frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Docker shows 7+ containers running
2. ✅ Backend services show "Now listening on: http://localhost:XXXX"
3. ✅ Frontend opens at http://localhost:3000
4. ✅ Beautiful login page displays
5. ✅ You can register and login
6. ✅ Dashboard shows charts and stats
7. ✅ All pages load without errors
8. ✅ Dark mode toggle works
9. ✅ Export functions work
10. ✅ PDF generation works

---

## 🎉 Ready to Test!

**Start Docker Desktop first**, then follow the steps above.

If you need help with any step, check `SETUP_AND_TESTING.md` for detailed instructions.

**Happy Testing! 🚀**


