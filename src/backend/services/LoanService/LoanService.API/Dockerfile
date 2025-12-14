FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["services/LoanService/LoanService.API/LoanService.API.csproj", "services/LoanService/LoanService.API/"]
COPY ["services/LoanService/LoanService.Application/LoanService.Application.csproj", "services/LoanService/LoanService.Application/"]
COPY ["services/LoanService/LoanService.Domain/LoanService.Domain.csproj", "services/LoanService/LoanService.Domain/"]
COPY ["services/LoanService/LoanService.Infrastructure/LoanService.Infrastructure.csproj", "services/LoanService/LoanService.Infrastructure/"]
COPY ["shared/Shared.Kernel/Shared.Kernel.csproj", "shared/Shared.Kernel/"]
COPY ["shared/Shared.Messaging/Shared.Messaging.csproj", "shared/Shared.Messaging/"]

RUN dotnet restore "services/LoanService/LoanService.API/LoanService.API.csproj"
COPY . .
WORKDIR "/src/services/LoanService/LoanService.API"
RUN dotnet build "LoanService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LoanService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LoanService.API.dll"]


