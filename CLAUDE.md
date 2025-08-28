# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a cryptocurrency arbitrage trading system built with Bun and TypeScript. The system consists of multiple microservices in a monorepo structure:

### Core Applications
- **lister** (`apps/lister/`): API server using oRPC that manages cryptocurrency, exchange, and trading pair data. Uses Drizzle ORM with PostgreSQL
- **sender** (`apps/sender/`): Data collection service that spawns multiple workers to collect orderbook data from various cryptocurrency exchanges (Binance, Gate.io, MEXC, Indodax, etc.)
- **ui** (`apps/ui/`): Web interface using KitaJS for HTML rendering
- **old-lister-migrator** (`apps/old-lister-migrator/`): Migration utility for legacy data
- **receiver**, **ticker**, **galactus**, **gate-proxy**, **potential**: Additional microservices

### Shared Packages
- **@arbitrator/logger**: Centralized logging using Winston
- **@arbitrator/env-loader**: Environment configuration management
- **@arbitrator/sdk**: Shared SDK utilities

## Development Commands

### Root Level
```bash
bun install                    # Install all dependencies
bun run format                 # Format code with Prettier
```

### Lister Service (API Server)
```bash
cd apps/lister
bun run dev                    # Development with hot reload
bun run start                  # Production start
```

### UI Service
```bash
cd apps/ui  
bun run dev                    # Development with hot reload
bun run start                  # Production start
```

### Database Management (Lister)
The lister service uses Drizzle ORM with PostgreSQL:
- Schema files: `src/**/*.sql.ts`
- Migrations: `migrations/` directory
- Configuration: `drizzle.config.ts`
- Database URL: `postgres://sulthonuladib:123456@localhost:5432/lister`

## Architecture Patterns

### Workspace Structure
- Uses Bun workspaces with catalog dependencies for version management
- Core dependencies (drizzle-orm, zod, @orpc/*) defined in workspace catalog
- Each app has its own package.json with specific dependencies

### API Layer
- **oRPC**: Main RPC framework for API communication
- **CORS enabled**: All origins allowed via CORSPlugin
- **Port allocation**: lister (3000), ui (3001)

### Data Collection
- **Worker-based**: sender service uses Bun Workers for parallel exchange data collection  
- **Exchange integrations**: Binance, Gate.io, MEXC, Indodax, and others via their respective APIs
- **Message passing**: Workers communicate via postMessage for orderbook updates

### Database Schema
- **Modular schema**: Each domain has its own `.sql.ts` file (cryptocurrency, exchange, chains)
- **Relations**: Defined in `database/relations.ts`
- **Type safety**: Uses drizzle-zod for runtime validation

## Technology Stack
- **Runtime**: Bun
- **Language**: TypeScript with strict mode enabled
- **Database**: PostgreSQL with Drizzle ORM
- **API**: oRPC for RPC communication
- **UI**: KitaJS for server-side HTML rendering
- **Logging**: Winston via @arbitrator/logger
- **Exchange APIs**: Various exchange SDKs (binance, bitget-api, kucoin-api, etc.)