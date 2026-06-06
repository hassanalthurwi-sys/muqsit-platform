# Sprint 10 — Investor Wallet & Vouchers

Static review assets for the Sprint 10 prototype on
`claude/sprint10-investor-wallet` (stacked on `claude/sprint9-investor-workspace`).
**Prototype only. No backend. No real authentication. Not merged to `main`.**

## Product principle

This sprint closes the investor money lifecycle inside the existing
voucher infrastructure:

- A single visible balance per investor — **رصيد المستثمر**.
- A single Receipt Voucher concept and a single Payment Voucher concept.
- Saving a receipt increases the investor's balance.
- Saving a payment decreases it.
- Creating an investment contract also decreases it.
- The activity timeline reflects all three streams in simple business
  language — no ledger, no journal entries, no chart of accounts.

## Terminology (consistent across the sprint)

| Concept | Label |
|---|---|
| Investor balance / wallet | **رصيد المستثمر** · *Investor balance* |
| Voucher history / movements | **الحركات المالية** · *All movements* |
| Receipt activity | **سند قبض** · *Receipt voucher* |
| Payment activity | **سند صرف** · *Payment voucher* |
| Contract activity | **عقد استثمار** · *Investment contract* |
| Contract created from balance | **عقد استثمار معاد تشغيله** · *Investment contract from balance* |

No "إعادة تشغيل" / "recycling" terminology in user-facing copy. The
dashboard alert was also reworded to *"N مستثمرون يمكن إنشاء عقود
استثمار من أرصدتهم"*.

## Wallet lifecycle (the only business rule that moved)

Three actions adjust `currentBalance`:

| Action | Delta |
|---|---|
| Save a receipt voucher with an investor | `+amount` |
| Save a payment voucher with an investor | `−amount` |
| Create an investment contract | `−amount` from that investor |

`Investor.currentBalance` stays as a seed value per investor (Sprint 9)
and is overlaid by a persisted `investorBalanceDeltas` map in the
store. No re-derivation pass, no ledger materialization.
`getInvestorBalance(id)` returns `seed + delta`.

## Single Receipt Voucher · Single Payment Voucher

**Per the brief, there is no investor-specific category.** The reason
for an investor payment lives in the description field. Concretely:

- `PaymentCategory` lost the `investorProfit` member entirely. Categories
  are now `goodsPurchase` · `officeExpense` · `salary` · `rent` ·
  `adminExpense` · `other`.
- When the new payment form is opened from the investor profile
  (`?investorId=…`), the category selector is **hidden completely** —
  the form is just Investor · Beneficiary · Amount · Method · Reference
  · Description · Attachment. The voucher is stored with `category:
  "other"` internally.
- The general-purpose payment form (`/financial/payments/new`, no
  query param) still shows the category selector for non-investor
  payments.
- The receipt form gains an Investor selector that appears when the
  source is **إيداع مستثمر**.

## New entry points on the investor profile

A new **رصيد المستثمر** card surfaces below the four-metric strip.
Always visible (no role gating — existing approval thresholds keep
handling actual restrictions):

> **رصيد المستثمر** · آخر حركة: 15 مايو 2025
>
> **165,000 ر.س**
>
> [+ سند قبض] [+ سند صرف] [الحركات المالية]

The buttons point at the existing voucher forms / list with
`?investorId=…` pre-filled. On save, the form redirects back to the
investor profile so the operator sees the new balance immediately.

## Activity timeline (now fully derived)

The hand-authored `recentActivity[]` field was deleted from `Investor`.
The per-investor timeline is now derived from the live store:

| Source | Activity label |
|---|---|
| `investmentContracts.filter(c => c.investorId === id)` | عقد استثمار |
| `… with c.fromInvestorBalance` or `c.sourceContractId` set | عقد استثمار معاد تشغيله |
| `receipts.filter(r => r.investorId === id)` | سند قبض |
| `payments.filter(p => p.investorId === id)` | سند صرف |

Each row links to the source voucher / contract. The investor portal
keeps showing a text-only activity feed; it now reads the same derived
data through the store provider (added to the portal layout).

## Seed cleanup

`MOCK_RECEIPTS` and `MOCK_PAYMENTS` had legacy `inv-1` / `inv-2`
`investorId`s that didn't match the real catalog. Sprint 10 re-keyed
them to `inv-ext-2`, `inv-ext-3`, etc., and added a handful of
historical investor vouchers (one extra receipt + three extra payments)
so the per-investor timeline isn't empty on first visit.

## Files

| File | Change |
| --- | --- |
| `lib/mock/types.ts` | Drop `PaymentCategory.investorProfit`. Drop `Investor.recentActivity`. Replace `InvestorActivityType` union with `receipt / payment / contract / recycledContract`. Add `InvestmentContract.fromInvestorBalance?: boolean`. |
| `lib/mock/investors.ts` | Drop the `recentActivity` arrays from all eight investors. |
| `lib/mock/receipts.ts` | Re-key legacy investor IDs; add one historical investor receipt per relevant investor. |
| `lib/mock/payments.ts` | Re-key legacy investor IDs; remove `investorProfit` category usage; add three historical investor payments. |
| `lib/mock/store.tsx` | New `investorBalanceDeltas` state persisted to localStorage. `addReceipt` / `addPayment` apply ± delta when an `investorId` is set. `addInvestmentContract` applies `−amount` to the investor. New `getInvestorBalance(id)` selector. |
| `lib/i18n/dictionaries.ts` | New `investors.wallet.*` + reworded `activityType.*` strings. Drop `paymentCategory.investorProfit`. Reworded `dashboard.alerts.recyclableInvestors`. |
| `app/(app)/dashboard/page.tsx` | Recyclable count now derived live from `getInvestorBalance`. |
| `app/(app)/investors/page.tsx` | List balance column now uses derived `getInvestorBalance(id)`. |
| `app/(app)/investors/[id]/page.tsx` | **New wallet card** (رصيد المستثمر + action buttons). Activity timeline switched to derived. |
| `app/(app)/financial/receipts/new/page.tsx` | Honor `?investorId=…`, add investor selector when source is إيداع مستثمر, redirect to profile after save. |
| `app/(app)/financial/payments/new/page.tsx` | Drop `investorProfit` category. Honor `?investorId=…`, hide category section when investor pre-filled, redirect to profile after save. |
| `app/(app)/financial/receipts/page.tsx` + `payments/page.tsx` | Honor `?investorId=…` URL filter with a removable filter chip. |
| `app/(app)/financial/balances/page.tsx` | Paid-to-investor total now counts any verified payment with that `investorId`. |
| `app/(app)/financial/payments/page.tsx` | Drop the `investorProfit` filter pill. |
| `app/(app)/investments/new/page.tsx` | Honor `?investorId=…` (skip step 0) and `?recycle=true` (sets `fromInvestorBalance: true`). |
| `app/(portal)/layout.tsx` | Wrap portal in `ContractStoreProvider` so portal pages can read derived store data. |
| `app/(portal)/portal/investor/page.tsx` | Activity rebuilt from the store rather than `recentActivity`. |

## What's deliberately NOT included

- No general ledger, no journal entries, no double-entry, no trial
  balance, no financial statements, no chart of accounts.
- No cost centers, no tax module.
- No reconciliation pass that re-derives `currentBalance` from voucher
  history (deltas only).
- No new top-level routes.
- No investor-specific category on payments (single Payment Voucher
  concept).
- No bulk voucher entry, no import.

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| Visual screenshots | ✅ 6 captured |

## Screenshots

| File | Description |
| --- | --- |
| `sprint10.pdf` | Cover + 6 captioned screenshots. |
| `01-profile-mobile-ar-wallet.png` | Investor profile with رصيد المستثمر card and derived activity timeline. Mobile · AR · light. |
| `02-profile-desktop-ar-wallet.png` | Internal-balance flow on desktop. Mobile · AR · light. |
| `03-receipt-new-mobile-ar.png` | New receipt form pre-filled from the wallet card. Mobile · AR · light. |
| `04-payment-new-mobile-ar.png` | New payment form pre-filled from the wallet card — single category-free flow. Mobile · AR · light. |
| `05-receipts-filtered-desktop-ar.png` | Receipts list filtered to a single investor with removable chip. Desktop · AR · light. |
| `06-profile-desktop-en-wallet.png` | Investor profile (EN). Desktop · EN · light. |

## Stack on top of

```
main
└── … (6)
    └── claude/sprint7-operations-center
        └── claude/sprint8-office-settings
            └── claude/sprint9-investor-workspace
                └── claude/sprint10-investor-wallet   ← this sprint
```
