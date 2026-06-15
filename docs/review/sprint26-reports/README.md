# Sprint 26 — Reports module

Operational reporting for the office: aging, investor performance,
P&L, collections summary. Closes the Phase 1 web track.

## Deliverables

### Aggregation library
- `lib/reports/aggregations.ts` — pure functions over entity shapes:
  - `agingReport(contracts, installments, asOf)` → buckets
    `current | 1-30 | 31-60 | 61-90 | 90+` with count + amount.
  - `investorPerformance(investors, contracts)` → capital deployed,
    capital available, realized profit, expected profit remaining per
    investor.
  - `pnlByMonth(receipts, distributions)` → `{month, collected,
    officeProfit, investorProfit}` rows.
  - `collectionsSummary(contracts, installments)` → totals + rate.

### API routes
- `GET /api/reports/aging`
- `GET /api/reports/investor-performance`
- `GET /api/reports/pnl`
- `GET /api/reports/collections`

### Hooks
- `lib/api/hooks-reports.ts` — `useAgingReport()`,
  `useInvestorPerformance()`, `usePnlReport()`, `useCollectionsReport()`.

### UI
- `/reports` is no longer a placeholder. New page renders:
  - 3 KPI cards (scheduled, collected, collection rate).
  - Aging table with color-coded buckets.
  - Investor performance table (5 columns).
  - Monthly P&L table.

## Why this closes Phase 1
The eight Phase 1 sprints (18-26) deliver:
1. API contract (S18).
2. Database (S19).
3. Auth (S20).
4. WhatsApp (S21).
5. SMS (S22).
6. OCR (S23).
7. Payments (S24).
8. ZATCA invoices (S25).
9. Reports (S26).

After Sprint 26, the platform is feature-complete on the web. Each
piece works in sandbox out of the box, and flips to live providers
when env vars are set — no UI changes needed.

## Verification
- type-check / lint / build ✅
- Screenshot of /reports in AR rendering all four sections from the
  live API.
