# Vite inlines VITE_* variables at build time, so the API URL is baked into the
# bundle here and cannot be changed by the running container. Point it at a new
# host by rebuilding with a different VITE_DARPANET_HOST.
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
<<<<<<< HEAD
RUN corepack enable && yarn install --frozen-lockfile

COPY . .

ARG VITE_DARPANET_HOST
ENV VITE_DARPANET_HOST=$VITE_DARPANET_HOST
RUN test -n "$VITE_DARPANET_HOST" || (echo "VITE_DARPANET_HOST build-arg is required" && exit 1)
RUN yarn build

# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine

COPY .docker/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/html

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1
