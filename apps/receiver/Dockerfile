# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build
#
# src/main.ts is the supervisor: it spawns one worker per CPU. Both the
# supervisor and the worker are bundled so the runtime image needs no
# node_modules.
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.2 AS builder
WORKDIR /app

COPY package.json bun.lock tsconfig.base.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

RUN cd apps/receiver && bun run build

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.2-slim AS runtime
WORKDIR /app/apps/receiver
ENV NODE_ENV=production
# main.ts spawns the bundled worker instead of the TypeScript source.
ENV RECEIVER_WORKER=dist/index.js

COPY --from=builder /app/apps/receiver/dist ./dist

USER bun

CMD ["bun", "dist/main.js"]
