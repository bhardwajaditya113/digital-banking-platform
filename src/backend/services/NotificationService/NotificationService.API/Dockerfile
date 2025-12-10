FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["services/NotificationService/NotificationService.API/NotificationService.API.csproj", "services/NotificationService/NotificationService.API/"]
COPY ["shared/Shared.Messaging/Shared.Messaging.csproj", "shared/Shared.Messaging/"]

RUN dotnet restore "services/NotificationService/NotificationService.API/NotificationService.API.csproj"
COPY . .
WORKDIR "/src/services/NotificationService/NotificationService.API"
RUN dotnet build "NotificationService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NotificationService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.API.dll"]


