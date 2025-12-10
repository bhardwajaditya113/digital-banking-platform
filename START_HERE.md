# 🚀 START HERE - Deployment Instructions

## ⚡ Quick Start (3 Steps)

### Step 1: Start Docker Desktop ⚠️ IMPORTANT

1. **Open Docker Desktop** from Windows Start Menu
2. **Wait for it to fully start** (whale icon should be steady)
3. You'll see "Docker Desktop is running" notification

**Verify Docker is running:**
```powershell
docker ps
```
If this works, Docker is ready!

---

### Step 2: Start Infrastructure Services

Once Docker is running, open PowerShell in the project folder and run:

```powershell
docker-compose -f docker-compose.infrastructure.yml up -d
```

**Wait 30-60 seconds** for databases to initialize.

**Verify services started:**
```powershell
docker ps
```

You should see: sqlserver, mongodb, postgresql, kafka, zookeeper, redis

---

### Step 3: Start Application Services

#### Option A: Start Backend Services (4 Terminals)

**Terminal 1 - Auth Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\AuthService\AuthService.API"
dotnet run
```

**Terminal 2 - Account Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\AccountService\AccountService.API"
dotnet run
```

**Terminal 3 - Transaction Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\TransactionService\TransactionService.API"
dotnet run
```

**Terminal 4 - Notification Service:**
```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\backend\services\NotificationService\NotificationService.API"
dotnet run
```

#### Option B: Use Docker Compose (All Services)

```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi"
docker-compose up -d
```

---

### Step 4: Start Frontend

Open a **new PowerShell window**:

```powershell
cd "C:\Users\dell\Desktop\Abu Dhabi\src\frontend"
npm install
npm start
```

The browser will automatically open to: **http://localhost:3000**

---

## 🧪 Quick Test

1. **Open browser:** http://localhost:3000
2. **Click "Sign up here"**
3. **Register** with:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Fill other fields
4. **Click "Create Account"**
5. **You're in!** Explore the dashboard

---

## ✅ Verify Everything Works

### Check Services:
- Frontend: http://localhost:3000 ✅
- Auth Service: http://localhost:5001/health ✅
- Account Service: http://localhost:5002/health ✅
- Transaction Service: http://localhost:5003/health ✅
- Kafka UI: http://localhost:8080 ✅

### Test Features:
1. ✅ Create an account
2. ✅ Make a transfer
3. ✅ View transactions
4. ✅ Export to CSV
5. ✅ Generate PDF statement
6. ✅ Toggle dark mode
7. ✅ Explore all pages

---

## 🐛 If Something Doesn't Work

### Docker Not Starting?
- Make sure Docker Desktop is fully started
- Restart Docker Desktop
- Check Windows WSL 2 is enabled

### Services Not Starting?
- Check logs: `docker-compose logs`
- Verify ports aren't in use
- Wait longer for databases to initialize

### Frontend Errors?
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (need 18+)

---

## 📚 More Help

- **Detailed Guide:** `SETUP_AND_TESTING.md`
- **Quick Test:** `QUICK_DEPLOY_TEST.md`
- **Testing Checklist:** `TESTING_CHECKLIST.md`

---

## 🎉 Ready!

**Start Docker Desktop first**, then follow the steps above.

**The platform will be running and ready to test!** 🚀


