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
docker compose up -d
```

This pulls the pre-built `ghcr.io/csa-tech-team/axios-event-registration-page-2025:latest` image and serves it on `http://127.0.0.1:31847`. Set `IMAGE_TAG=sha-<commit>` to test a specific published release. Note: this runs the last image published to GHCR rather than your local changes — use it to sanity-check a production build, not for day-to-day development.

To stop it:
```bash
docker compose down
```
