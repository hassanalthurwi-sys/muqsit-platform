# Sprint 19 — PostgreSQL + Prisma

Ships the database layer that Sprints 18+ designed around. The
prototype keeps working without a DB; production deployments connect
PostgreSQL via `DATABASE_URL` and the same API routes flip to the
real source automatically.

## Deliverables

### New package: `@muqsit/database`
- `prisma/schema.prisma` — full data model (35+ models) translated
  from `apps/web/src/lib/mock/types.ts`. Covers auth/tenancy,
  investors, contracts, customers, installments, vouchers,
  profit distribution, approvals, audit, employees, platform
  employees, system settings, subscription plans and
  subscription transactions.
- `src/index.ts` — `getPrisma()` returns a singleton client when
  `DATABASE_URL` is set, undefined otherwise (sandbox falls back to
  the in-memory store from Sprint 18).
- `src/seed.ts` — idempotent seed: system settings, both
  subscription plans, the default office, with `upsert`.

### Schema highlights
- **Multi-tenant**: every business entity (Investor, Customer,
  contracts, vouchers, employees, approvals, audit) carries
  `officeId` with a composite index. Row-level scoping in Sprint 20.
- **Discriminated identities**: `Investor.identityKind` + nullable
  type-specific columns (`nationalId`, `gccId`, `passport`, `cr`)
  re-assemble into the `LegalIdentity` union at the app layer.
- **Decimals for money**: `@db.Decimal(18, 2)` for amounts,
  `@db.Decimal(7, 4)` for rates.
- **Snapshots**: `SubscriptionTransaction.planSnapshot` and
  `ProfitDistribution.policyApplied/policySource` preserve the BRS
  rules (no historical drift on later edits).
- **Enums for state machines**: `SubscriptionStatus`,
  `InstallmentStatus`, `InstallmentContractStatus`,
  `ApprovalStatus`, `EmployeeInviteStatus`, etc.

### Workspace wiring
- `apps/web` depends on `@muqsit/database` via `workspace:*`.
- `prisma generate` runs cleanly with a placeholder `DATABASE_URL`.

## How the fallback works
```
Request hits /api/investors
  ↓
isDatabaseAvailable() ?
  ↓                  ↓
  yes                no
  ↓                  ↓
  prisma.investor.   server-store
  findMany()         (mock in memory)
```

The API contract from Sprint 18 stays identical, so screens don't
change.

## Database lifecycle commands

```bash
# Generate the Prisma client
pnpm --filter @muqsit/database db:generate

# Create + apply a migration (dev)
DATABASE_URL=postgresql://... pnpm --filter @muqsit/database db:migrate

# Apply pending migrations (prod / UAT)
DATABASE_URL=postgresql://... pnpm --filter @muqsit/database db:deploy

# Seed initial data
DATABASE_URL=postgresql://... pnpm --filter @muqsit/database db:seed
```

## What stays out of scope
- Live Postgres in the sandbox — can't open outbound DB connections.
  The schema and client are ready; the next environment with a
  reachable Postgres will run `db:migrate` and the app picks it up
  automatically.
- Migration of every API route to call Prisma — only `getPrisma()`
  is exposed; route-by-route migration happens incrementally with
  Sprint 20+.
- Read replicas, sharding, PgBouncer — Phase 2 scale concerns.

## Verification
| Check | Result |
|---|---|
| `prisma generate` (placeholder URL) | ✅ |
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| Sandbox UI (no DB) | ✅ falls back to mock, identical UX |

## Stack on top of
```
… → claude/sprint18-api-layer → claude/sprint19-database ← this sprint
```
