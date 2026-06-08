# Sprint 10 — Investor Balance & Vouchers

Static review assets for the Sprint 10 prototype on
`claude/sprint10-investor-wallet` (stacked on `claude/sprint9-investor-workspace`).
**Prototype only. No backend. No real authentication. Not merged to `main`.**

## Product principle

This sprint closes the investor money lifecycle with a deliberately
spare model:

- A single visible balance per investor — **رصيد المستثمر**.
- **Exactly two voucher concepts in the system** — Receipt Voucher and
  Payment Voucher.
- Vouchers are classified by the **party** the office transacted with
  (Investor / Customer / Other) — never by purpose. The reason for a
  payment or receipt belongs in the description.
- Money in (receipt) raises the investor's balance; money out (payment)
  lowers it; creating an investment contract also lowers it.

The activity timeline reflects all three streams in simple business
language — no ledger, no journal entries, no chart of accounts, no
trial balance, no tax module.

## Terminology

| Concept | Label |
|---|---|
| Investor balance | **رصيد المستثمر** · *Investor balance* — never "wallet" |
| Voucher history | **الحركات المالية** · *All movements* |
| Receipt activity | **سند قبض** · *Receipt voucher* |
| Payment activity | **سند صرف** · *Payment voucher* |
| Payment whose description mentions أرباح/profit | **توزيع أرباح** · *Profit distribution* |
| Contract activity | **عقد استثمار** · *Investment contract* |
| Contract created from balance | **عقد استثمار معاد تشغيله** · *Investment contract from balance* |

## The voucher model

There are **only two voucher types** in the system — a Receipt Voucher
and a Payment Voucher — and they share the same structure:

| Field | Receipt | Payment |
|---|---|---|
| Voucher number | auto | auto |
| Date | required | required |
| **Party type** | **investor / customer / other** | **investor / customer / other** |
| Counterparty | selected from investor list, customer list, or free-text | same |
| Amount | required | required |
| Method | required | required |
| Reference | optional | optional |
| Description | optional | optional |
| Attachment | optional | optional |

There are **no** investor-payment, profit-payment, salary, rent,
goods-purchase, office-expense, customer-installment, investor-deposit
or office-income voucher sub-types. The old `ReceiptVoucher.source` and
`PaymentVoucher.category` enums were removed from the data model
entirely; a single `partyType: "investor" | "customer" | "other"` field
replaces both.

### Party Type behavior

| Party type chosen | What the form shows |
|---|---|
| Investor | A dropdown of the investor catalog. Selecting an investor stores `investorId` on the voucher. |
| Customer | A dropdown of the customer catalog. For receipts, an optional installment-contract dropdown appears once a customer is chosen — used by the auto-receipt flow. |
| Other | Free-text name field. Stored as `fromName` / `beneficiaryName`. |

### Balance lifecycle (the only business rules that move it)

| Action | Delta |
|---|---|
| Save a receipt voucher with party = Investor | `+amount` |
| Save a payment voucher with party = Investor | `−amount` |
| Create an investment contract | `−amount` from that investor |

`Investor.currentBalance` stays as a seed value (Sprint 9) overlaid by
a persisted `investorBalanceDeltas` map in the store.
`getInvestorBalance(id)` returns `seed + delta`. No re-derivation pass,
no ledger materialization.

**Creating an investment contract does NOT generate a payment voucher.**
The contract itself represents the allocation; the balance simply
decreases.

## Automatic receipt creation from installments

When an office employee records a payment on an installment (the
"Pay" button on the contract schedule), the system **automatically
creates a Receipt Voucher** with:

- Voucher number (auto)
- Date
- Party type = **Customer**
- Customer
- Installment contract
- Installment number (in the description)
- Amount

The employee never has to create the voucher manually. This is the
primary receipt-to-contract relationship in the system.

## Investor receipts are NOT linked to investment contracts

Investor deposits may exist long before any contract. The lifecycle is
intentionally:

```
Investor deposit  →  Receipt voucher  →  Investor balance increases
                                                  ↓ (later)
                                Investment contract created
                                                  ↓
                                Investor balance decreases
```

So the receipt form does not offer a contract link when the party type
is Investor, and the seed receipts were scrubbed of any
`investmentContractId`.

## Profit distribution surfaced in the timeline

To keep a **single Payment Voucher concept** while still surfacing
"توزيع أرباح" in the activity timeline, the timeline classifies a
payment as a profit distribution **purely from its description**: if
the notes match `ربح | أرباح | الأرباح | profit`, the row is labeled
**توزيع أرباح** instead of **سند صرف**. No extra category, no extra
field, no extra form question.

## رصيد المستثمر card

Below the four-metric strip on the investor profile, a single balance
card surfaces:

> **رصيد المستثمر** · آخر حركة: 15 مايو 2025
>
> **165,000 ر.س**
>
> [+ سند قبض] [+ سند صرف] [الحركات المالية]

The action buttons are visible to all users; existing permissions and
approval thresholds keep handling restrictions.

## Voucher lists — party-type filters

`/financial/receipts` and `/financial/payments` now filter by party
type: **الكل · مستثمر · عميل · أخرى**. The previous source/category
pills were removed. Both lists honor `?investorId=…` and show a
removable filter chip when scoped.

## Files

| File | Change |
| --- | --- |
| `lib/mock/types.ts` | Replace `ReceiptSource` and `PaymentCategory` with a single `PartyType = "investor" \| "customer" \| "other"`. Both voucher interfaces now carry `partyType: PartyType`. |
| `lib/mock/investors.ts` | `recentActivity` removed (Sprint 9 leftover); `currentBalance` seed kept. |
| `lib/mock/receipts.ts` | Source-enum entries mapped to partyType. Investor deposits no longer carry `investmentContractId`. Two historical investor receipts added. |
| `lib/mock/payments.ts` | Category-enum entries mapped to partyType. Three historical investor payments with profit-distribution descriptions added. |
| `lib/mock/store.tsx` | `investorBalanceDeltas` map persisted to localStorage. `addReceipt` / `addPayment` apply ± delta when `investorId` is set. `addInvestmentContract` applies `−amount` to the investor. `getInvestorBalance(id)` selector. |
| `lib/i18n/dictionaries.ts` | Drop `receiptSource` / `paymentCategory` dictionaries. New `partyType` (investor / customer / other). New `partyLabel` / `partyHint` form copy. Column labels renamed `source` / `category` → `party`. |
| `app/(app)/financial/receipts/new/page.tsx` | Rewritten around party-type picker + conditional investor / customer / freetext counterparty field. Honors `?investorId=…`; redirects to investor profile after save. |
| `app/(app)/financial/payments/new/page.tsx` | Same shape — single payment voucher, party-type-driven counterparty. |
| `app/(app)/financial/receipts/page.tsx` + `payments/page.tsx` | Filter pills are now party-type. Column header renamed "الطرف". URL filter chip preserved. |
| `app/(app)/financial/receipts/[id]/page.tsx` + `payments/[id]/page.tsx` | Show partyType label instead of source/category. |
| `app/(app)/financial/balances/page.tsx` | Paid-to-investor total filtered by `payment.investorId`. |
| `app/(app)/investors/[id]/page.tsx` | Balance card (رصيد المستثمر) + derived activity timeline + profit-distribution classification. |
| `app/(app)/contracts/[id]/page.tsx` | Auto-creates a customer-party receipt voucher when an installment payment is recorded. |
| `app/(app)/dashboard/page.tsx` | Recyclable count derived live from `getInvestorBalance`. |
| `app/(app)/investments/new/page.tsx` | Honors `?investorId=…` and `?recycle=true` (sets `fromInvestorBalance: true`). |
| `app/(portal)/layout.tsx` | Wraps portal in `ContractStoreProvider`. |
| `app/(portal)/portal/investor/page.tsx` | Activity rebuilt from store. |

## What's deliberately NOT included

- No general ledger, no journal entries, no double-entry, no trial
  balance, no financial statements, no chart of accounts.
- No cost centers, no tax module.
- No reconciliation pass that re-derives `currentBalance` from voucher
  history (deltas only).
- No new top-level routes.
- **No voucher sub-types** — no investor-payment / profit-payment /
  salary / rent / goods-purchase / office-expense / customer-installment
  / investor-deposit categories.
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
| `01-profile-mobile-ar-balance.png` | Investor profile with رصيد المستثمر card + derived activity timeline. Mobile · AR · light. |
| `02-profile-desktop-ar-balance.png` | Same profile on desktop. Desktop · AR · light. |
| `03-receipt-new-mobile-ar.png` | New receipt voucher — party-type picker (مستثمر selected), investor dropdown. **No source picker, no contract link.** Mobile · AR · light. |
| `04-payment-new-mobile-ar.png` | New payment voucher — identical form shape to the receipt. **No category picker.** Mobile · AR · light. |
| `05-receipts-list-desktop-ar.png` | Receipts list with party-type filter pills (مستثمر / عميل / أخرى) and party column. Desktop · AR · light. |
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
