FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["services/AccountService/AccountService.API/AccountService.API.csproj", "services/AccountService/AccountService.API/"]
COPY ["services/AccountService/AccountService.Application/AccountService.Application.csproj", "services/AccountService/AccountService.Application/"]
COPY ["services/AccountService/AccountService.Domain/AccountService.Domain.csproj", "services/AccountService/AccountService.Domain/"]
COPY ["services/AccountService/AccountService.Infrastructure/AccountService.Infrastructure.csproj", "services/AccountService/AccountService.Infrastructure/"]
COPY ["shared/Shared.Kernel/Shared.Kernel.csproj", "shared/Shared.Kernel/"]
COPY ["shared/Shared.Messaging/Shared.Messaging.csproj", "shared/Shared.Messaging/"]

RUN dotnet restore "services/AccountService/AccountService.API/AccountService.API.csproj"
COPY . .
WORKDIR "/src/services/AccountService/AccountService.API"
RUN dotnet build "AccountService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AccountService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AccountService.API.dll"]


