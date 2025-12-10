# Quick Start Guide

## All Issues Fixed! ✅

The following issues have been resolved:

1. **Frontend Icon Errors**: Fixed missing icons (`FaTrendUp`/`FaTrendDown` → `FaArrowUp`/`FaArrowDown`, `FaFileAlt` → `FaFile`)
2. **TypeScript Form Handler Errors**: Fixed type compatibility issues in Transfer components
3. **Backend Port Configuration**: All services now explicitly bind to correct ports (5001, 5002, 5003, 5004)
4. **MongoDB Connection String**: Fixed handling of masked connection strings

## Starting the Application

### Option 1: Full Startup (Recommended)

1. **Start Docker Desktop** and wait for it to be fully ready
2. Run the comprehensive startup script:
   ```powershell
   .\scripts\start-and-test.ps1
   ```

This will:
- Check prerequisites
- Start Docker infrastructure (SQL Server, MongoDB, Kafka, Redis)
- Build and start all backend services
- Start the frontend application
- Check service health

### Option 2: Manual Startup

#### Step 1: Start Docker Infrastructure
```powershell
docker-compose -f docker-compose.infrastructure.yml up -d
```
Wait 30-60 seconds for services to initialize.

#### Step 2: Start Backend Services

Open separate PowerShell windows for each service:

**Auth Service (Port 5001):**
```powershell
cd src\backend\services\AuthService\AuthService.API
dotnet run
```

**Account Service (Port 5002):**
```powershell
cd src\backend\services\AccountService\AccountService.API
dotnet run
```

**Transaction Service (Port 5003):**
```powershell
cd src\backend\services\TransactionService\TransactionService.API
dotnet run
```

**Notification Service (Port 5004):**
```powershell
cd src\backend\services\NotificationService\NotificationService.API
dotnet run
```

#### Step 3: Start Frontend
```powershell
cd src\frontend
npm install --force  # If not already installed
npm start
```

### Option 3: Frontend Only (For UI Testing)

If you just want to test the frontend UI without backend:
```powershell
cd src\frontend
npm start
```
The app will start at http://localhost:3000, but API calls will fail until backend is running.

## Service URLs

Once all services are running:

- **Frontend**: http://localhost:3000
- **Auth Service API**: http://localhost:5001/swagger
- **Account Service API**: http://localhost:5002/swagger
- **Transaction Service API**: http://localhost:5003/swagger
- **Notification Service API**: http://localhost:5004/swagger

## Health Checks

Test if services are running:
```powershell
# Auth Service
Invoke-WebRequest -Uri http://localhost:5001/health

# Account Service
Invoke-WebRequest -Uri http://localhost:5002/health

# Transaction Service
Invoke-WebRequest -Uri http://localhost:5003/health

# Notification Service
Invoke-WebRequest -Uri http://localhost:5004/health
```

## Troubleshooting

### Docker Not Running
- Start Docker Desktop
- Wait for it to fully initialize (whale icon in system tray)
- Check with: `docker ps`

### Port Already in Use
- Stop any existing services using those ports
- Check with: `netstat -ano | findstr :5001` (replace with your port)

### Database Connection Errors
- Ensure Docker containers are running: `docker ps`
- Check SQL Server container: `docker logs banking-sqlserver`
- Check MongoDB container: `docker logs banking-mongodb`

### Frontend Compilation Errors
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules package-lock.json && npm install --force`

### Backend Build Errors
- Clean solution: `dotnet clean`
- Restore packages: `dotnet restore`
- Rebuild: `dotnet build --no-incremental`

## Testing the Application

1. **Register a new user** at http://localhost:3000/register
2. **Login** with your credentials
3. **Create an account** from the Dashboard
4. **Make a transfer** between accounts
5. **View transactions** and account statements
6. **Explore investments and loans** features

## Next Steps

After everything is running:
- Test authentication flow
- Test account creation
- Test money transfers
- Test all features end-to-end

Enjoy your Digital Banking Platform! 🚀

