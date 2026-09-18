# Portainer deployment

The frontend image is published from `master` to
`ghcr.io/csa-tech-team/axios-event-registration-page-2025` as `latest` and
immutable `sha-<commit>` tags. The public API URL is built into the Vite bundle
as `https://darpanet.axios.psgtech.ac.in/api`.

Create a Portainer stack from `docker-compose.yml`. Add `IMAGE_TAG` in
Portainer's environment-variable UI: use `latest` to track the newest published
release, or a `sha-<commit>` tag for an immutable deployment. Configure GHCR
registry credentials in Portainer before deploying private images.

The container is bound only to `127.0.0.1:31847`. Configure the host Nginx
virtual host to proxy the public frontend domain to that address. On releases,
set the desired `IMAGE_TAG` and select **Re-pull image and redeploy**.
