# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files first (better layer caching)
COPY backend/src/Todo.Api.Controllers/Todo.Api.Controllers.csproj backend/src/Todo.Api.Controllers/
COPY backend/src/Todo.Data/Todo.Data.csproj backend/src/Todo.Data/
COPY backend/src/Todo.Domain/Todo.Domain.csproj backend/src/Todo.Domain/

# Restore dependencies
RUN dotnet restore backend/src/Todo.Api.Controllers/Todo.Api.Controllers.csproj

# Copy the rest of the source
COPY backend/ backend/

# Publish
RUN dotnet publish backend/src/Todo.Api.Controllers/Todo.Api.Controllers.csproj -c Release -o /app/publish

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# ASP.NET inside container should listen on 0.0.0.0
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Todo.Api.Controllers.dll"]
