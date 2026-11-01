# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.3 AS builder
WORKDIR /app

COPY package.json bun.lock tsconfig.base.json tsconfig.json ./
# `patchedDependencies` in package.json points here; bun install needs it.
COPY patches ./patches
COPY apps ./apps
COPY packages ./packages

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

RUN cd apps/sender && bun run build

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.3-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/sender/dist ./dist

# The production logger writes to $PWD/logs; the runtime user must own it.
RUN mkdir -p /app/logs && chown bun:bun /app/logs

USER bun
EXPOSE 3002

CMD ["bun", "dist/index.js"]
