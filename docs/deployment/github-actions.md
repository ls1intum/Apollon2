# Github actions

Deployment is through [github action trigers](https://github.com/ls1intum/Apollon2/actions/workflows/deploy-prod.yml).

Click on "Run workflow" dropdown and select main branch and then run the workflow.

## Run Docker Locally

Make sure Docker is up and running.

### Build and Run with Docker Compose

1. **Build image with docker compose:**

   ```bash
   docker compose -f ./docker/compose.local.yml build
   ```

2. **Compose local db:**

   ```bash
   docker compose -f ./docker/compose.local.yml up -d
   ```

## Available Docker Compose Files

The project includes several Docker Compose configurations:

- `docker/compose.local.yml` - Local development environment
- `docker/compose.local.db.yml` - Local database setup
- `docker/compose.prod.yml` - Production environment
- `docker/compose.proxy.yml` - Proxy configuration
- `docker/compose.server.yml` - Server-only dockerization
- `docker/compose.webapp.yml` - Webapp-only dockerizatin
