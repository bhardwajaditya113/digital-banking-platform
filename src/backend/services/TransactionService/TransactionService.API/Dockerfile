FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["services/TransactionService/TransactionService.API/TransactionService.API.csproj", "services/TransactionService/TransactionService.API/"]
COPY ["services/TransactionService/TransactionService.Application/TransactionService.Application.csproj", "services/TransactionService/TransactionService.Application/"]
COPY ["services/TransactionService/TransactionService.Domain/TransactionService.Domain.csproj", "services/TransactionService/TransactionService.Domain/"]
COPY ["services/TransactionService/TransactionService.Infrastructure/TransactionService.Infrastructure.csproj", "services/TransactionService/TransactionService.Infrastructure/"]
COPY ["shared/Shared.Kernel/Shared.Kernel.csproj", "shared/Shared.Kernel/"]
COPY ["shared/Shared.Messaging/Shared.Messaging.csproj", "shared/Shared.Messaging/"]

RUN dotnet restore "services/TransactionService/TransactionService.API/TransactionService.API.csproj"
COPY . .
WORKDIR "/src/services/TransactionService/TransactionService.API"
RUN dotnet build "TransactionService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TransactionService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TransactionService.API.dll"]


