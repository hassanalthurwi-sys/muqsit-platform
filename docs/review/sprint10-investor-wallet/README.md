# Sprint 10 — Investor Balance & Vouchers

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
| The investor's single balance | **رصيد المستثمر** · *Investor balance* — never "wallet", "account summary" |
| Voucher movements / history | **الحركات المالية** · *All movements* |
| Receipt activity | **سند قبض** · *Receipt voucher* |
| Payment activity | **سند صرف** · *Payment voucher* |
| Payment with "أرباح/profit" in description | **توزيع أرباح** · *Profit distribution* |
| Contract activity | **عقد استثمار** · *Investment contract* |
| Contract created from balance | **عقد استثمار معاد تشغيله** · *Investment contract from balance* |

The dashboard alert was also reworded to *"N مستثمرون يمكن إنشاء عقود
استثمار من أرصدتهم"* — no technical recycling language anywhere.

## Balance lifecycle (the only business rules that move it)

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

**Creating an investment contract does NOT generate a payment voucher.**
The contract itself represents the allocation; the balance simply
decreases.

## Receipt Voucher — single concept

A Receipt Voucher represents any amount entering the office:

- Investor deposit
- Customer installment payment
- Any other incoming amount

**Investor receipt vouchers are NOT linked to investment contracts.**
The "Linked contract" dropdown was removed from the receipt form when
the source is *إيداع مستثمر*. The lifecycle is intentionally:

```
Investor Deposit → Receipt Voucher → Investor Balance increases
                                              ↓ (later)
                              Investment Contract created
                              → Investor Balance decreases
```

There's no direct receipt-to-contract relationship for investor
deposits, because the deposit may exist long before any contract.

### Customer installment payments — auto-generated receipt

When an office employee records a payment on an installment (the
"Pay" button on the contract details schedule), the system now
**automatically creates a Receipt Voucher** carrying:

- Voucher number (auto)
- Date
- Amount
- Customer
- Installment contract
- Installment number (embedded in the description)

This is the **primary receipt-to-contract relationship** in the
system. The employee never has to create the voucher manually.

## Payment Voucher — single concept

A Payment Voucher represents any amount leaving the office:

- Transfer to investor
- Purchase of goods
- Salary, rent, operating expense
- Any other outgoing amount

**No investor-specific payment category exists.** `investorProfit`
was removed from `PaymentCategory` entirely; the reason for an
investor payment is captured in the description field. When the
payment form is opened from the investor profile (`?investorId=…`),
the category section is hidden completely — the form is just:

- Investor (selector)
- Beneficiary
- Amount
- Method
- Reference
- Notes
- Attachment

### Profit distribution in the timeline

To keep the single Payment Voucher concept while still surfacing
"توزيع أرباح" in the activity timeline (as required), the timeline
classifies a payment as a profit distribution **purely from its
description**: if the notes match `ربح | أرباح | الأرباح | profit`,
the row is labeled **توزيع أرباح** instead of **سند صرف**. No new
category, no new field, no extra UI.

## رصيد المستثمر card

Below the four-metric strip, a single balance card surfaces:

> **رصيد المستثمر** · آخر حركة: 15 مايو 2025
>
> **165,000 ر.س**
>
> [+ سند قبض] [+ سند صرف] [الحركات المالية]

Action buttons are visible to all users; existing permissions and
approval thresholds keep handling restrictions.

## Activity timeline (fully derived)

The hand-authored `recentActivity[]` field was deleted from `Investor`.
The per-investor timeline is now derived from the live store:

| Source | Activity label |
|---|---|
| `investmentContracts.filter(c => c.investorId === id)` | عقد استثمار |
| `… with c.fromInvestorBalance` or `c.sourceContractId` set | عقد استثمار معاد تشغيله |
| `receipts.filter(r => r.investorId === id)` | سند قبض |
| `payments.filter(p => p.investorId === id)`, notes match profit | توزيع أرباح |
| `payments.filter(p => p.investorId === id)`, otherwise | سند صرف |

## Seed cleanup

`MOCK_RECEIPTS` and `MOCK_PAYMENTS` had legacy `inv-1` / `inv-2`
`investorId`s that didn't match the real catalog. Sprint 10 re-keyed
them to `inv-ext-2`, `inv-ext-3`, etc., dropped the
`investmentContractId` from investor-deposit receipts, and added
historical investor vouchers (one extra receipt + three extra
payments — descriptions like *"توزيع أرباح شهري"* so they appear as
*توزيع أرباح* in the timeline).

## Files

| File | Change |
| --- | --- |
| `lib/mock/types.ts` | Drop `PaymentCategory.investorProfit`. Drop `Investor.recentActivity`. Replace `InvestorActivityType` union with `receipt / payment / profitDistribution / contract / recycledContract`. Add `InvestmentContract.fromInvestorBalance?: boolean`. |
| `lib/mock/investors.ts` | Drop the `recentActivity` arrays from all eight investors. |
| `lib/mock/receipts.ts` | Re-key legacy investor IDs; **drop `investmentContractId` from investor-deposit receipts**; add a historical investor receipt. |
| `lib/mock/payments.ts` | Re-key legacy investor IDs; remove `investorProfit` category usage; add historical investor payments (with profit-distribution descriptions). |
| `lib/mock/store.tsx` | New `investorBalanceDeltas` state persisted to localStorage. `addReceipt` / `addPayment` apply ± delta when an `investorId` is set. `addInvestmentContract` applies `−amount` to the investor. New `getInvestorBalance(id)` selector. |
| `lib/i18n/dictionaries.ts` | New `investors.wallet.*` (rendered as *رصيد المستثمر*) + `activityType.profitDistribution`. Drop `paymentCategory.investorProfit`. Reworded `dashboard.alerts.recyclableInvestors`. |
| `app/(app)/dashboard/page.tsx` | Recyclable count now derived live from `getInvestorBalance`. |
| `app/(app)/investors/page.tsx` | List balance column now uses derived `getInvestorBalance(id)`. |
| `app/(app)/investors/[id]/page.tsx` | **New balance card** (رصيد المستثمر + action buttons). Activity timeline switched to derived; profit distribution classified by description keywords. |
| `app/(app)/contracts/[id]/page.tsx` | **Auto-creates a receipt voucher** when an installment is recorded as paid. |
| `app/(app)/financial/receipts/new/page.tsx` | Honor `?investorId=…`, add investor selector when source is إيداع مستثمر, **remove the linked-contract dropdown for investor deposits**, redirect to profile after save. |
| `app/(app)/financial/payments/new/page.tsx` | Drop `investorProfit` category. Honor `?investorId=…`, hide category section when investor pre-filled, redirect to profile after save. |
| `app/(app)/financial/receipts/page.tsx` + `payments/page.tsx` | Honor `?investorId=…` URL filter with a removable filter chip. |
| `app/(app)/financial/balances/page.tsx` | Paid-to-investor total now counts any verified payment with that `investorId`. |
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
- No second-tier balances (Available, Recyclable, Pending, Entitled,
  Withdrawable — none of those exist).
- No investor-deposit-to-contract link.

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
| `01-profile-mobile-ar-balance.png` | Investor profile with رصيد المستثمر card and derived activity timeline (سند قبض / سند صرف / توزيع أرباح / عقد استثمار). Mobile · AR · light. |
| `02-profile-desktop-ar-balance.png` | Same profile on desktop. Desktop · AR · light. |
| `03-receipt-new-mobile-ar.png` | New receipt voucher — pre-filled investor, **no linked-contract dropdown**. Mobile · AR · light. |
| `04-payment-new-mobile-ar.png` | New payment voucher — pre-filled investor, no category section. Mobile · AR · light. |
| `05-receipts-filtered-desktop-ar.png` | Receipts list filtered to a single investor with removable chip. Desktop · AR · light. |
| `06-profile-desktop-en-balance.png` | Investor profile (EN). Desktop · EN · light. |

## Stack on top of

```
main
└── … (6)
    └── claude/sprint7-operations-center
        └── claude/sprint8-office-settings
            └── claude/sprint9-investor-workspace
                └── claude/sprint10-investor-wallet   ← this sprint
```
