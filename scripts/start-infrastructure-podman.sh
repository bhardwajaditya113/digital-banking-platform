#!/bin/bash

# Start infrastructure services using podman directly
# This is a workaround for docker-compose permission issues with podman

set -e

echo "🚀 Starting infrastructure services with podman..."

# Create network if it doesn't exist
podman network create banking-network 2>/dev/null || echo "Network already exists"

# Start SQL Server
echo "Starting SQL Server..."
podman run -d --name banking-sqlserver \
  --network banking-network \
  -e ACCEPT_EULA=Y \
  -e SA_PASSWORD=Banking@123! \
  -e MSSQL_PID=Developer \
  -p 1433:1433 \
  -v sqlserver-data:/var/opt/mssql \
  mcr.microsoft.com/mssql/server:2022-latest || echo "SQL Server already running"

# Start PostgreSQL
echo "Starting PostgreSQL..."
podman run -d --name banking-postgresql \
  --network banking-network \
  -e POSTGRES_DB=banking_analytics \
  -e POSTGRES_USER=banking_user \
  -e POSTGRES_PASSWORD=Banking@123! \
  -p 5432:5432 \
  -v postgresql-data:/var/lib/postgresql/data \
  postgres:15-alpine || echo "PostgreSQL already running"

# Start MongoDB
echo "Starting MongoDB..."
podman run -d --name banking-mongodb \
  --network banking-network \
  -e MONGO_INITDB_ROOT_USERNAME=banking_admin \
  -e MONGO_INITDB_ROOT_PASSWORD=Banking@123! \
  -e MONGO_INITDB_DATABASE=banking_documents \
  -p 27017:27017 \
  -v mongodb-data:/data/db \
  docker.io/library/mongo:7.0 || echo "MongoDB already running"

# Start Zookeeper
echo "Starting Zookeeper..."
podman run -d --name banking-zookeeper \
  --network banking-network \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000 \
  -p 2181:2181 \
  docker.io/confluentinc/cp-zookeeper:7.5.0 || echo "Zookeeper already running"

# Wait for Zookeeper to be ready
echo "Waiting for Zookeeper to be ready..."
sleep 5

# Start Kafka
echo "Starting Kafka..."
podman run -d --name banking-kafka \
  --network banking-network \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_ZOOKEEPER_CONNECT=banking-zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://banking-kafka:29092 \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT_INTERNAL \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_AUTO_CREATE_TOPICS_ENABLE=true \
  -p 9092:9092 \
  -p 9093:9093 \
  docker.io/confluentinc/cp-kafka:7.5.0 || echo "Kafka already running"

# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
sleep 10

# Start Kafka UI
echo "Starting Kafka UI..."
podman run -d --name banking-kafka-ui \
  --network banking-network \
  -e KAFKA_CLUSTERS_0_NAME=local \
  -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=banking-kafka:29092 \
  -e KAFKA_CLUSTERS_0_ZOOKEEPER=banking-zookeeper:2181 \
  -p 8080:8080 \
  docker.io/provectuslabs/kafka-ui:latest || echo "Kafka UI already running"

# Start Redis
echo "Starting Redis..."
podman run -d --name banking-redis \
  --network banking-network \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine || echo "Redis already running"

echo "✅ Infrastructure services started!"
echo "Waiting 30 seconds for services to initialize..."
sleep 30

echo "Checking service status..."
podman ps --filter "name=banking-" --format "table {{.Names}}\t{{.Status}}"

