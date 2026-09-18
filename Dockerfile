FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY . .

# Vite substitutes this public URL into the static bundle at build time.
ARG VITE_DARPANET_HOST=https://darpanet.axios.psgtech.ac.in/api
ENV VITE_DARPANET_HOST=${VITE_DARPANET_HOST}

RUN yarn build

FROM nginx:1.27-alpine AS runtime

COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
