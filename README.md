# Axios

Frontend for the Axios event website.

Run `yarn install` and then `yarn dev` to start the development server.

## Running Locally

### Option A: Localhost (recommended for development)

```bash
yarn install
yarn dev
```

Vite prints the local URL (defaults to `http://localhost:5173`). This gives you hot-reload on every file change.

Copy `.env` and point `VITE_DARPANET_HOST` at your backend, e.g. `http://localhost:9198/api` if you're running [axios-backend-2025](../axios-backend-2025) locally.

### Option B: Docker

```bash
docker compose -f .docker/docker-compose.yaml up -d
```

This pulls the pre-built `ghcr.io/csa-tech-team/axios:master` image and serves it on `http://localhost:9298`. Note: this repo doesn't ship its own `Dockerfile`, so the compose file runs the last image published to GHCR rather than your local changes — use it to sanity-check a production build, not for day-to-day development.

To stop it:
```bash
docker compose -f .docker/docker-compose.yaml down
```