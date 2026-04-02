# GitHub Actions

Deployment is through [GitHub Action triggers](https://github.com/ls1intum/Apollon/actions/workflows/deploy-prod.yml).

Click on "Run workflow" dropdown and select the main branch, then run the workflow.

## Deploy Workflow

The deploy workflow supports three independent components:

| Input | Default | What it deploys |
|-------|---------|----------------|
| **deploy-app** | true | Server + Webapp (every deploy) |
| **deploy-db** | false | Redis database (only when infra changes) |
| **deploy-proxy** | false | Caddy reverse proxy (only when proxy config changes) |

Each component deploys to its own directory under `/opt/apollon/`:

```
/opt/apollon/
├── app/    ← Server + Webapp (CI/CD)
├── db/     ← Redis
└── proxy/  ← Caddy
```

## GitHub Environment Variables

Set these in the GitHub Environment (e.g., "Production"):

| Type | Name | Example | Required |
|------|------|---------|----------|
| Variable | `VM_HOST` | `apollon2.aet.cit.tum.de` | Yes |
| Variable | `VM_USERNAME` | `github_deployment` | Yes |
| Variable | `DOMAIN` | `apollon2.aet.cit.tum.de` | Yes |
| Secret | `VM_SSH_PRIVATE_KEY` | *(SSH key)* | Yes |

`DOMAIN` supports multiple domains (Caddy serves them all):

```
# Single domain
DOMAIN=apollon2.aet.cit.tum.de

# Multiple domains (comma-separated)
DOMAIN=apollon.ase.in.tum.de, apollon.ase.cit.tum.de, apollon.aet.cit.tum.de
```

## First-Time Deployment

1. Set up the GitHub Environment variables above
2. Run the deploy workflow with **all three boxes checked**
3. The workflow creates directories, pulls images, and starts all services

## Run Docker Locally

Make sure Docker is up and running.

### Build and Run with Docker Compose

1. **Start local Redis database:**

   ```bash
   docker compose -f ./docker/compose.local.db.yml up -d
   ```

2. **Build and run all services:**

   ```bash
   docker compose -f ./docker/compose.local.yml up --build
   ```

   The webapp will be available at `http://localhost:8080`.

## Available Docker Compose Files

Production (3-file split, each deployed independently):

| File | Purpose | Lifecycle |
|------|---------|-----------|
| `docker/compose.proxy.yml` | Caddy reverse proxy | Deployed when proxy config changes |
| `docker/compose.db.yml` | Redis database | Deployed when infra changes |
| `docker/compose.app.yml` | Server + Webapp | Deployed via CI/CD on every merge |

Local development:

| File | Purpose |
|------|---------|
| `docker/compose.local.yml` | All services (builds from source) |
| `docker/compose.local.db.yml` | Redis only (for running server outside Docker) |
