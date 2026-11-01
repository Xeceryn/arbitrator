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

RUN cd apps/lister && bun run build

# ---------------------------------------------------------------------------
# One-off migration runner (drizzle-kit lives in the build stage's node_modules)
#
#   docker build -f apps/lister/Dockerfile --target migrate -t arbitrator-lister:migrate .
#   docker run --rm -e DATABASE_URL=... arbitrator-lister:migrate
# ---------------------------------------------------------------------------
FROM builder AS migrate
WORKDIR /app/apps/lister
ENV NODE_ENV=production

CMD ["bunx", "--bun", "drizzle-kit", "migrate"]

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.3-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/lister/dist ./dist

# The production logger writes to $PWD/logs; the runtime user must own it.
RUN mkdir -p /app/logs && chown bun:bun /app/logs

USER bun
EXPOSE 3001

CMD ["bun", "dist/index.js"]
