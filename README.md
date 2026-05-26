# Muqsit Platform

Turborepo + pnpm monorepo for the Muqsit platform. **Sprint 1** scope is a bootable
skeleton only — no domain models, auth, or business logic yet.

## Stack

| Path                     | Package               | Tech                        |
| ------------------------ | --------------------- | --------------------------- |
| `apps/api`               | `@muqsit/api`         | NestJS 11, Prisma 6         |
| `apps/web`               | `@muqsit/web`         | Next.js 15, React 19, Tailwind 4 |
| `packages/shared-types`  | `@muqsit/shared-types`| Shared TypeScript types     |

Infrastructure (PostgreSQL 16, Redis 7) runs locally via Docker Compose.

## Prerequisites

- Node.js >= 22 (see `.nvmrc`)
- pnpm 10 (`corepack enable`)
- Docker + Docker Compose

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Start infrastructure (Postgres + Redis)
cp .env.example .env
docker compose up -d

# 3. Configure app env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Generate the Prisma client
pnpm --filter @muqsit/api prisma:generate

# 5. Run everything in dev
pnpm dev
```

- API: http://localhost:4000 — health check at `GET /health`
- Web: http://localhost:3000

## Common scripts (run from repo root)

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Run all apps in watch mode (via Turborepo)   |
| `pnpm build`       | Build all packages                           |
| `pnpm lint`        | Lint all packages                            |
| `pnpm type-check`  | Type-check all packages                      |
| `pnpm format`      | Format the repo with Prettier                |

## Docker Compose

```bash
docker compose up -d      # start postgres + redis
docker compose ps         # check health
docker compose down       # stop (use -v to drop volumes)
```

Defaults: Postgres on `5432` (db/user/pass `muqsit`), Redis on `6379`. Override via `.env`.

## Layout

```
apps/
  api/                 NestJS API (health endpoint, Prisma connection)
  web/                 Next.js front end
packages/
  shared-types/        Types shared across apps
docker-compose.yml     Postgres + Redis
turbo.json             Task pipelines
```
