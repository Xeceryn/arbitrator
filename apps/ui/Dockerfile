# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.2 AS builder
WORKDIR /app

# The UI imports the `@arbitrator/*` workspace packages directly from source, so
# the build context is the whole monorepo.
COPY package.json bun.lock tsconfig.base.json tsconfig.json ./
COPY apps ./apps
COPY packages ./packages

# Let the build scripts find workspace binaries (tailwindcss) in node_modules.
ENV PATH="/app/node_modules/.bin:${PATH}"
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Builds Tailwind + browser scripts into ./public and the server into ./dist.
RUN cd apps/ui && bun run build

# ---------------------------------------------------------------------------
# Runtime
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.2-slim AS runtime
WORKDIR /app/apps/ui
ENV NODE_ENV=production

COPY --from=builder /app/apps/ui/dist ./dist
COPY --from=builder /app/apps/ui/public ./public

USER bun
EXPOSE 3000

# `--cluster` tells src/main.ts the client assets are already built, so it skips
# the runtime Tailwind/esbuild step.
CMD ["bun", "dist/main.js", "--cluster"]
