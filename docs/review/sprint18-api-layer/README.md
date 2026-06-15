# Sprint 18 — API layer (mock-backed)

First production sprint after the prototype phase. No new UX surfaces;
the work establishes the API contract that every later sprint builds
on (real DB in 19, real auth in 20, integrations in 21–24).

## Goal
Introduce a stable server-side API between the screens and the data,
backed by the same mock seeds that powered the prototype so behaviour
is unchanged.

## Deliverables
- **`lib/api/respond.ts`** — `ApiResponse<T>` envelope (`ok | error`),
  `created/ok/notFound/fail` helpers, `parseListQuery`/`paginate` for
  list endpoints.
- **`lib/api/server-store.ts`** — module-scope in-memory clones of
  every mock seed, exposed via a uniform `list/find/add/update/remove`
  store API. Replaced by Prisma in Sprint 19.
- **`lib/api/client.ts`** — `apiFetch<T>()`, `ApiClientError`,
  `qk` query-key map, `qs(params)` helper.
- **`lib/api/hooks.ts`** — typed React Query hooks per resource
  (`useInvestors`, `useCustomer`, `useAdminPlans`, …) +
  mutations (`useCreateInvestor`, `useUpdateAdminPlan`).
- **`components/providers/query-provider.tsx`** — single QueryClient
  for the app, defaults: 30s stale, no refetch-on-focus, retry once.

## Routes added (8 resources, 18 endpoints)

| Resource | List | Read | Create | Update | Delete |
|---|---|---|---|---|---|
| Investors | `GET /api/investors` (q + filter) | `GET /api/investors/[id]` | `POST` | `PUT` | `DELETE` |
| Customers | `GET /api/customers` (q + risk filter) | `GET /api/customers/[id]` | `POST` | `PUT` | `DELETE` |
| Investment contracts | `GET /api/investment-contracts` (investorId, status) | `GET /api/investment-contracts/[id]` | — | `PUT` | `DELETE` |
| Installment contracts | `GET /api/installment-contracts` (customerId, investmentContractId, status) | `GET /api/installment-contracts/[id]` | — | `PUT` | `DELETE` |
| Vouchers | `GET /api/vouchers` (type=receipt\|payment + party filters) | — | — | — | — |
| Employees | `GET /api/employees` (status filter) | `GET /api/employees/[id]` | `POST` | `PUT` | `DELETE` |
| Admin offices | `GET /api/admin/offices` (status filter) | `GET /api/admin/offices/[id]` | — | `PUT` | `DELETE` |
| Admin plans | `GET /api/admin/plans` (active filter) | `GET /api/admin/plans/[id]` | — | `PUT` | — |

### Standard response shape
```jsonc
// success — list
{ "ok": true, "data": [...], "meta": { "total": 42, "page": 1, "pageSize": 50 } }

// success — single
{ "ok": true, "data": { ... } }

// error
{ "ok": false, "error": { "code": "NOT_FOUND", "message": "Investor 'x' not found" } }
```

### Query conventions
- `q` — text search across relevant string fields.
- `filter` — resource-specific (status / risk / type).
- `page`, `pageSize` — pagination (max 200).
- Domain filters: `investorId`, `customerId`, `investmentContractId`,
  `partyType`, `type` (vouchers), `status`.

## Screens migrated to the API (2 proof-of-pattern)
1. **`/investors`** — list fetched via `useInvestors({ filter, q })`.
   The derived metrics (current balance, invested capital,
   recycling eligibility) still read from the in-memory store, since
   the aggregate queries land in Sprint 19.
2. **`/admin/plans`** — list fetched via `useAdminPlans()`. Server
   sorts by `displayOrder`; the screen no longer re-sorts.

Both screens added loading and error states using new i18n strings
(`investors.loading`, `investors.errorLoading`).

## What stays out of scope
- Auth on the routes (Sprint 20 will add session checks).
- Per-office tenant scoping (Sprint 20).
- DB persistence (Sprint 19).
- Vitest setup (Sprint 18.1 — small follow-up).
- Migration of the remaining ~30 screens (tracked sprint by sprint).
- Zod validation on request bodies (Sprint 19, when the schema lands).

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| Smoke tests via curl | ✅ list, filter, 404 paths all correct |
| Visual regression on migrated screens | ✅ identical to Sprint 17 |

```bash
# Smoke test transcript
$ curl /api/investors?filter=internal       # 1 internal investor
$ curl /api/customers?filter=high           # 1 high-risk customer
$ curl /api/admin/plans                     # [Basic, Pro]
$ curl /api/investors/inv-internal-1        # "المكتب الذاتي — مُقسِط" · 620,000
$ curl /api/investors/nonexistent           # {"ok":false,"error":{"code":"NOT_FOUND",...}}
```

## Stack on top of
```
main
└── … (16)
    └── claude/sprint17-subscription-flow
        └── claude/sprint18-api-layer   ← this sprint
```

## Next
**Sprint 19** swaps `server-store.ts` for Prisma + PostgreSQL with the
same surface area, so screens don't change. Then the remaining
screens get migrated to the API in waves alongside auth (Sprint 20)
and integrations (21–24).
