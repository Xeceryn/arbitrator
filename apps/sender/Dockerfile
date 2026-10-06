# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.2 AS builder
WORKDIR /app

COPY package.json bun.lock tsconfig.base.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

RUN cd apps/sender && bun run build

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.2-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/sender/dist ./dist

USER bun
EXPOSE 3002

CMD ["bun", "dist/index.js"]
