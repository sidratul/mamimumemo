# Docker Setup Guide

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Git

## Quick Start with Docker

### 1. Clone and Setup

```bash
cd /Users/sidr/Documents/learn/daycare/mami-api

# Copy environment file
cp .env.example .env

# Edit .env with your preferred settings
# (Optional - defaults work for local development)
```

### 2. Start All Services

```bash
# Build and start MongoDB + Deno API
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f mongo
docker-compose logs -f deno-app
```

### 3. Access Services

- **GraphQL API**: http://localhost:8000/graphql
- **MongoDB**: localhost:27017

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v
```

## Development Workflow

### Hot Reload

The Docker setup includes volume mounting for hot reload:

```yaml
volumes:
  - .:/app        # Mount source code
  - /app/node_modules  # Preserve node_modules
```

Changes to your code will automatically restart the Deno app.

### Running Commands

```bash
# Run inside Deno container
docker-compose exec deno-app deno task start
docker-compose exec deno-app deno task g Product

# Run inside MongoDB container
docker-compose exec mongo mongosh
```

## MongoDB Connection

### From Host Machine

```bash
# Connect to MongoDB
mongosh "mongodb://mami-admin:mami-password-2026@localhost:27017/mami-db?authSource=admin"
```

### From Deno Container

```bash
docker-compose exec deno-app mongosh "mongodb://mami-admin:mami-password-2026@mongo:27017/mami-db?authSource=admin"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API port | `8000` |
| `MONGO_URI` | MongoDB connection string | (see .env) |
| `JWT_SECRET` | JWT signing secret | (change in production!) |
| `JWT_EXPIRES_IN` | JWT token expiry | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `30d` |

## Production Deployment

### MongoDB Atlas (Recommended)

1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Update `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mami-db?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

```env
MONGO_URI=mongodb://<host>:27017/mami-db
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs mongo
docker-compose logs deno-app

# Rebuild
docker-compose up -d --build
```

### Database Connection Issues

```bash
# Test MongoDB connection
docker-compose exec mongo mongosh --eval "db.runCommand('ping')"

# Check MongoDB status
docker-compose exec mongo mongosh --eval "db.stats()"
```

### Port Already in Use

Change port in `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Use 8001 instead of 8000
```

## Backup & Restore

### Backup MongoDB

```bash
docker-compose exec mongo mongodump --out /data/backup
```

### Restore MongoDB

```bash
docker-compose exec mongo mongorestore /data/backup
```

## Useful Commands

```bash
# View running containers
docker-compose ps

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart deno-app

# View resource usage
docker stats

# Remove unused volumes (free up space)
docker volume prune
```

## Security Notes

⚠️ **Before deploying to production:**

1. Change `JWT_SECRET` to a strong random string
2. Change MongoDB default credentials
3. Use environment variables from secrets manager
4. Enable MongoDB authentication
5. Use SSL/TLS for MongoDB connections
6. Restrict network access to MongoDB port
