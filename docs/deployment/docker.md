# Docker Deployment

This guide covers different ways to deploy the Apollon2 application using Docker.

## Dockerized Web App

The webapp can be built and run with Docker. Make sure Docker is installed on your device.

### Quick Start

- **Build with docker:**

  ```bash
  npm run docker:build
  ```

- **Run with docker:**
  ```bash
  npm run docker:start
  ```

After running `npm run docker:start` you can navigate to http://localhost:8080/ and start using the application.

## Run Docker Locally

Make sure Docker is up and running.

### Build and Run with Docker Compose

1. **Build image with docker compose:**

   ```bash
   docker compose -f ./docker/compose.local.yml build
   ```

2. **Run the container with docker compose:**

   ```bash
   docker compose -f ./docker/compose.local.yml up -d
   ```

## Available Docker Compose Files

The project includes several Docker Compose configurations:

- `docker/compose.local.yml` - Local development environment
- `docker/compose.local.db.yml` - Local database setup
- `docker/compose.prod.yml` - Production environment
- `docker/compose.proxy.yml` - Proxy configuration
- `docker/compose.server.yml` - Server-only deployment
- `docker/compose.webapp.yml` - Webapp-only deployment
