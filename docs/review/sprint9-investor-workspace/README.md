# Sprint 9 — Investor Workspace

Static review assets for the Sprint 9 prototype on
`claude/sprint9-investor-workspace` (stacked on `claude/sprint8-office-settings`).
**Prototype only. No backend. No real authentication. Not merged to `main`.**

## Product principle

An office employee should open an investor profile and immediately answer:

1. How much does this investor currently have with us?
2. How much is currently invested?
3. How much profit has been achieved?

Nothing more. This is **operational clarity**, not accounting. Balance logic
is deliberately mock-authored for this sprint — the unified derivation
across receipts, payments, collections, and profit-distribution policy is
out of scope and will be unified later.

## Four-metric model

The investor profile shows **exactly four primary metrics** in this order:

| Metric | Source |
|---|---|
| **الرصيد الحالي** · Current Balance | Mock-authored per investor for Sprint 9. |
| **رأس المال المُستثمَر** · Invested Capital | Σ amount of active contracts (derived live from the contract store). |
| **الأرباح المحققة** · Realized Profit | Mock-authored per investor for Sprint 9. |
| **العقود النشطة** · Active Contracts | Count of active contracts. |

No utilization bar. No `unutilizedCapital`, `available`, `recyclable`,
`pending`, `entitled`, `withdrawable`, or any other balance type — anywhere.
The field was removed from `Investor`, the dashboard, the investor list,
the investor profile, and the new-contract investor picker.

**Total Capital is kept** as informational only, inside the "Investor
details" card. It captures the historical scale of the relationship —
not a primary KPI.

## Recycling alert (operational, not a balance)

When `currentBalance ≥ officeSettings.investmentDefaults.recyclingThreshold`,
the profile shows one soft-gold callout:

> ✨ يوجد مبلغ يمكن إعادة تشغيله — [إنشاء عقد جديد]

CTA links to `/investments/new?investorId=…`. When current balance is
below threshold, the callout is **completely hidden** — no empty state,
no "below threshold" hint. Absence is silence.

On the list page, eligible investors get the same inline label under
their name. The dashboard "smart alerts" card now reads "N investors have
capital that can be recycled" instead of the old "X SAR unutilized
investor capital" — fully aligned with the no-balance-category principle.

## Activity timeline

Replaces the old text-only `recentActivity` with a typed timeline:

| Type | Icon |
|---|---|
| إيصال قبض · Receipt | ⬇ |
| بدء عقد · Contract started | 📝 |
| سند صرف · Payment | ⬆ |
| إعادة تشغيل رأس مال · Capital recycled | 🔁 |
| توزيع أرباح · Profit distribution | 📈 |

Each row: typed label · amount · date · optional link to the source
contract. Default 8 items + **عرض المزيد**. No ledger entries, no
debit/credit columns, no running balance.

Existing portal code (`portal/investor`) continues to render from the
text field — the new typed fields are optional, so portal behavior is
unchanged.

## List page polish

Columns: investor · type · **current balance** · **invested** ·
**realized profit** · active contracts · status. Mobile: stacked card
with the four numbers in a 2×2 grid below the name. New search input
filters by name or identity (national ID / CR / passport / GCC ID).

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | `Investor` gets `currentBalance` + `realizedProfit`; drops `utilizedCapital` + `unutilizedCapital`. `ActivityItem` gets optional `type`, `amount`, `referenceLabel`, `referenceHref`. New `InvestorActivityType` union. |
| `lib/mock/investors.ts` | Seed data updated; new `getInvestedCapital(contracts, id)` selector. |
| `app/(app)/investors/page.tsx` | Rebuilt around the four-metric model + search + recycling badge. |
| `app/(app)/investors/[id]/page.tsx` | Four-metric strip, recycling alert, Investor details card, typed activity timeline. |
| `app/(app)/investments/new/page.tsx` | Investor picker shows Current Balance + historical Total Capital. |
| `app/(app)/dashboard/page.tsx` | "Unutilized capital" alert replaced with "N investors can be recycled". |
| `lib/i18n/dictionaries.ts` | `investors.metric.*`, `investors.recycling.*`, `investors.activityType.*`, `investors.profile.detailsSection`, `investors.profile.totalCapitalLabel` (AR + EN). Removed `utilized` / `unutilized` columns. |

## What's deliberately NOT included

- No new routes — updates `/investors` and `/investors/[id]` only.
- No accounting view, no ledger, no journal, no T-accounts.
- No second-tier balances of any kind.
- No per-investor recycling threshold override (Sprint 8 office default is the single source).
- No bulk actions, no CSV export, no statements PDF.
- No edit / new investor form.
- No portal-side changes — `portal/investor` continues to use the text-only activity shape.
- No re-keying of seed receipts/payments to derive Current Balance — Sprint 9 intentionally treats balance as a mock-authored UX number, not an accounting truth.

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ no warnings or errors |
| `pnpm --filter @muqsit/web build` | ✅ |
| Visual screenshots | ✅ 6 captured |

## Screenshots

| File | Description |
| --- | --- |
| `sprint9.pdf` | Cover + 6 captioned screenshots. |
| `01-list-mobile-ar-light.png` | Investors list — mobile · AR · light. |
| `02-list-desktop-ar-light.png` | Investors list — desktop · AR · light. |
| `03-profile-mobile-ar-light.png` | Profile (investor with recycling alert) — mobile · AR · light. |
| `04-profile-mobile-ar-dark.png` | Profile — mobile · AR · dark. |
| `05-profile-mobile-en-light.png` | Profile — mobile · EN · light. |
| `06-profile-desktop-ar-light.png` | Profile (internal office) — desktop · AR · light. |

## Stack on top of

```
main
└── … (5)
    └── claude/sprint6-portals
        └── claude/sprint7-operations-center
            └── claude/sprint8-office-settings
                └── claude/sprint9-investor-workspace   ← this sprint
```
