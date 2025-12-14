FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["services/InvestmentService/InvestmentService.API/InvestmentService.API.csproj", "services/InvestmentService/InvestmentService.API/"]
COPY ["services/InvestmentService/InvestmentService.Application/InvestmentService.Application.csproj", "services/InvestmentService/InvestmentService.Application/"]
COPY ["services/InvestmentService/InvestmentService.Domain/InvestmentService.Domain.csproj", "services/InvestmentService/InvestmentService.Domain/"]
COPY ["services/InvestmentService/InvestmentService.Infrastructure/InvestmentService.Infrastructure.csproj", "services/InvestmentService/InvestmentService.Infrastructure/"]
COPY ["shared/Shared.Kernel/Shared.Kernel.csproj", "shared/Shared.Kernel/"]
COPY ["shared/Shared.Messaging/Shared.Messaging.csproj", "shared/Shared.Messaging/"]

RUN dotnet restore "services/InvestmentService/InvestmentService.API/InvestmentService.API.csproj"
COPY . .
WORKDIR "/src/services/InvestmentService/InvestmentService.API"
RUN dotnet build "InvestmentService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "InvestmentService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "InvestmentService.API.dll"]


