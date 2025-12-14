# ✅ Linux Setup Complete - Parrot OS

## What Has Been Done

### 1. ✅ Fixed Linux Compatibility Issues
- Updated connection strings to use `127.0.0.1` instead of `localhost`
- Fixed Investment and Loan service connection strings
- Updated Program.cs files to use `0.0.0.0` for Docker compatibility
- Created missing Dockerfiles for Investment and Loan services
- Updated docker-compose.yml with proper environment variables

### 2. ✅ Created Linux Scripts
- `scripts/linux-setup.sh` - Comprehensive setup script
- `scripts/start-infrastructure-podman.sh` - Start infrastructure with podman
- `scripts/build-and-start-services.sh` - Build and start backend services

### 3. ✅ Infrastructure Services
- SQL Server: ✅ Running on port 1433
- Kafka: ✅ Running on port 9092
- Zookeeper: ✅ Running on port 2181
- Kafka UI: ✅ Running on port 8080
- PostgreSQL, MongoDB, Redis: Ports in use (may be from other projects)

### 4. ✅ Frontend
- Dependencies installed ✅
- Ready to start

### 5. ⏳ Backend Services
- Docker images need to be built (takes 5-10 minutes per service)
- OR install .NET SDK to run locally

## Quick Start Options

### Option A: Install .NET SDK (Recommended for Development)

```bash
# Install .NET 8.0 SDK
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0

# Add to PATH (add to ~/.bashrc)
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools

# Verify
dotnet --version
```

Then run services locally:
```bash
# Terminal 1 - Auth Service
cd src/backend/services/AuthService/AuthService.API
dotnet run

# Terminal 2 - Account Service
cd src/backend/services/AccountService/AccountService.API
dotnet run

# Terminal 3 - Transaction Service
cd src/backend/services/TransactionService/TransactionService.API
dotnet run

# Terminal 4 - Notification Service
cd src/backend/services/NotificationService/NotificationService.API
dotnet run
```

### Option B: Use Docker/Podman (Takes Longer)

```bash
# Build all services (takes 30-60 minutes)
bash scripts/build-and-start-services.sh

# Or build individually:
cd src/backend
podman build -f services/AuthService/AuthService.API/Dockerfile -t banking-auth-service:latest .
# Repeat for other services...
```

## Start Frontend

```bash
cd src/frontend
npm start
```

Frontend will be available at: http://localhost:3000

## Test End-to-End

Once services are running:

1. **Register a user:**
   - Open http://localhost:3000
   - Click "Sign up here"
   - Fill in registration form
   - Email: `test@example.com`
   - Password: `Test123!`

2. **Login:**
   - Use registered credentials
   - Should redirect to dashboard

3. **Create Account:**
   - Navigate to Accounts page
   - Click "Create Account"
   - Fill in details and submit

4. **Make Transfer:**
   - Navigate to Transfer page
   - Select accounts and amount
   - Submit transfer

5. **View Transactions:**
   - Check Transactions page
   - Verify transfer appears

## Service URLs

- Frontend: http://localhost:3000
- Auth Service: http://localhost:5001
- Account Service: http://localhost:5002
- Transaction Service: http://localhost:5003
- Notification Service: http://localhost:5004
- Investment Service: http://localhost:5005
- Loan Service: http://localhost:5006
- Kafka UI: http://localhost:8080

## Health Checks

```bash
# Check if services are running
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health
curl http://localhost:5004/health
```

## Troubleshooting

### Services Not Starting
- Check if infrastructure is running: `podman ps --filter "name=banking-"`
- Check logs: `podman logs banking-auth-service`
- Wait 30-60 seconds for database initialization

### Port Conflicts
- Some ports (5432, 27017, 6379) may be in use by other projects
- Services will use existing containers if available
- Or stop conflicting services: `podman stop <container-name>`

### Database Connection Issues
- Ensure SQL Server is running: `podman ps | grep sqlserver`
- Wait for SQL Server to fully initialize (30-60 seconds)
- Check connection string in appsettings.json

## Next Steps

1. Choose Option A (install .NET SDK) or Option B (use Docker)
2. Start backend services
3. Start frontend: `cd src/frontend && npm start`
4. Test the application end-to-end

## Files Modified for Linux

- All `appsettings.json` files - Updated connection strings
- All `Program.cs` files - Updated for Docker compatibility
- `docker-compose.yml` - Added environment variables and dependencies
- Created Dockerfiles for Investment and Loan services
- Created Linux setup scripts

---

**Status:** ✅ Infrastructure running, Frontend ready, Backend services need to be started


