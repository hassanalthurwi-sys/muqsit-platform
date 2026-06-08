# Sprint 11 — Profit Distribution & Investor Balance Rules

Static review assets for the Sprint 11 prototype on
`claude/sprint11-profit-distribution` (stacked on `claude/sprint10-investor-wallet`).
**Prototype only. No backend. No real authentication. Not merged to `main`.**

## Product principle

This sprint puts the previously-stored profit-distribution policy to work.
Every customer installment collection now triggers an automatic split
between the office and the investor, using the policy chain:

```
Office Settings (default)
    ↓ may be overridden per investor
Investor Profile (optional override)
    ↓ inherited automatically
Investment Contract (carries the agreed amounts, not the policy)
    ↓
Installment Contract (running counters per side)
    ↓
Each customer payment → split → counters updated → investor balance/profit move
```

The employee does nothing extra. There is **no profit-distribution screen**
and **no manual split entry**. Everything follows from the policy + the
agreed profit amounts on the parent investment contract.

## The strict rules

1. **Every installment contract must be linked to an investment contract.**
   The installment is funded by that contract; the link is mandatory.
2. **Internal investors are first-class.** The office IS the investor in
   that case. At investment-contract creation, only one field is shown
   ("ربح المكتب من هذا العقد") and the office keeps the full profit by
   routing it through the internal investor account.
3. **Running counters live on the installment contract.** Each side has
   an expected total for that contract and a "recovered so far"
   counter. Once a side hits its expected, subsequent payments flow
   entirely to the other side (with mid-installment splits at the
   threshold crossing).

## Worked example (Office First)

```
Investment contract:
  Capital:                100,000
  Office expected profit:  30,000
  Investor expected profit: 40,000
  Total profit:            70,000   (office ratio = 30/70 = 42.86%)

Installment contract from the above:
  Cash price:              10,000
  Installment price:       17,000
  Markup:                   7,000
  Office expected from this contract:  3,000  (7,000 × 30/70)
  Investor expected from this contract: 14,000 (cash 10,000 + profit 4,000)
  Monthly installment:      1,000

Office First, starting fresh:
  Installments 1-3 → 1,000 each to office (office counter: 0→1k→2k→3k)
  Installments 4-17 → 1,000 each to investor (investor counter: 0→1k→...→14k)

Threshold crossing example — office at 2,500, next installment 1,000:
  Office: 500  (completes the 3,000 cap)
  Investor: 500 (the remainder)
```

## Data model additions

```ts
// Investment contract — agreed amounts (not a policy)
officeExpectedProfit: number;
investorExpectedProfit: number;

// Installment contract — running counters
officeRecoveredSoFar: number;
investorRecoveredSoFar: number;

// Investor — optional policy override
profitPolicyOverride?: "useOfficeDefault" | "officeFirst" | "investorFirst" | "proportional";

// New event log
interface ProfitDistribution {
  id: string;
  date: string;
  investorId: string;
  investmentContractId: string;
  installmentContractId: string;
  installmentId: string;
  installmentIndex: number;
  amountCollected: number;
  officeShare: number;
  investorShare: number;
  investorProfitPortion: number;   // counts toward realizedProfit
  investorCapitalPortion: number;  // counts toward currentBalance only
  policyApplied: ProfitDistributionPolicy;
  policySource: "officeDefault" | "investorOverride";
  createdAt: string;
}
```

## The pure split function

`lib/mock/profit.ts` exposes two utilities consumed across the app:

- `getEffectivePolicy(investor, officeSettings)` → resolves the chain.
- `splitInstallmentPayment({ amount, installmentContract, investmentContract, policy })`
  → returns `{ officeShare, investorShare, investorProfitPortion, investorCapitalPortion }`
  given the current recovery counters and policy.

The investor share is decomposed for the realized-profit metric: capital
first (up to the cash price), then profit afterwards.

## Where the new UI lands

| Screen | Addition |
|---|---|
| Investor profile | A "سياسة توزيع الأرباح" row in the Investor details card with effective-policy pill + source + inline override dropdown. Realized profit is now derived live from the event log. |
| Investment contract detail | New **"ربح العقد"** card with the agreed amounts, total, and a per-linked-installment breakdown of recovery so far. |
| Installment contract detail | New **"توزيع التحصيلات"** card with effective-policy pill + source + two recovery progress bars (office / investor). |
| New investment contract form | New profit section in the terms step. Two fields for external investors; one field for internal (with explanatory note). Auto-computed percentage preview. |

## Where profit math happens

Hooked into `addReceipt` in the store: when a receipt is created with
`partyType === "customer"`, `contractId`, and `installmentId` set
(which only happens for auto-created installment receipts), the store:

1. Looks up the installment contract → parent investment contract → investor.
2. Resolves the effective policy.
3. Calls `splitInstallmentPayment` with the live counters.
4. Updates the running counters (persisted to localStorage).
5. Records a `ProfitDistribution` event.
6. Applies the investor balance delta (`+investorShare`) and the realized-profit delta (`+investorProfitPortion`).

No new entry points, no new manual form, no new top-level routes.

## What's deliberately NOT included

- No general ledger, no journal, no double-entry, no chart of accounts,
  no trial balance, no financial statements, no tax module.
- No second-tier balances.
- No manual "تسجيل توزيع أرباح" screen.
- No retroactive recalculation when a policy changes — the policy is
  snapshotted on the event at the time it was recorded.
- No automatic profit-distribution scheduler.
- No voucher-shape changes (Sprint 10 is frozen).
- No new top-level routes.

## Seed adjustments

- All investment contracts now carry `officeExpectedProfit` and
  `investorExpectedProfit`. Internal contracts have `officeExpectedProfit: 0`
  and the full profit on `investorExpectedProfit`.
- All installment contracts include the new counters. A backfill at the
  bottom of `installment-contracts.ts` walks each contract, looks at how
  much has been paid through the seed schedule, and applies an
  "office first" split deterministically — so contracts start in a
  believable mid-flight state instead of all-zeros.

## Files

| File | Change |
| --- | --- |
| `lib/mock/types.ts` | New `ProfitDistribution`, `ProfitPolicySource`. New fields on `InvestmentContract`, `InstallmentContract`, `Investor`, `ReceiptVoucher`. |
| `lib/mock/profit.ts` (new) | Pure `getEffectivePolicy` + `splitInstallmentPayment`. |
| `lib/mock/contracts.ts` | Seed augmented with `officeExpectedProfit` / `investorExpectedProfit`. |
| `lib/mock/installment-contracts.ts` | Imports parent contracts, backfills running counters. |
| `lib/mock/store.tsx` | `profitDistributions[]` state, `getInvestorRealizedProfit`, `getEffectivePolicyFor`, `setInvestorPolicyOverride`. Split logic hooked into `addReceipt` for customer-installment receipts. |
| `lib/i18n/dictionaries.ts` | New `profitPolicy.*` and `step2.*` strings (AR + EN). |
| `app/(app)/contracts/[id]/page.tsx` | New "توزيع التحصيلات" card. Auto-receipts now carry `installmentId` + `installmentIndex`. |
| `app/(app)/contracts/new/page.tsx` | New installment contracts start with both counters at 0. |
| `app/(app)/investments/[id]/page.tsx` | New "ربح العقد" card with per-installment recovery. |
| `app/(app)/investments/new/page.tsx` | New profit-amount section (one field for internal, two for external). |
| `app/(app)/investors/[id]/page.tsx` | Policy pill + source + inline override dropdown in Investor details. Derived realized profit. ProfitDistribution events added to the activity timeline. |

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
| `sprint11.pdf` | Cover + 6 captioned screenshots. |
| `01-investor-profile-mobile-ar.png` | Investor profile with the new policy pill + override dropdown. Mobile · AR · light. |
| `02-investor-profile-desktop-ar.png` | Same profile on desktop. Desktop · AR · light. |
| `03-investment-contract-desktop-ar.png` | Investment contract with new "ربح العقد" card showing agreed amounts + per-installment recovery. Desktop · AR · light. |
| `04-installment-contract-desktop-ar.png` | Installment contract with new "توزيع التحصيلات" card (policy pill + two progress bars). Desktop · AR · light. |
| `05-new-investment-step2-mobile-ar.png` | New investment contract form, terms step — external investor variant with two profit fields. Mobile · AR · light. |
| `06-new-investment-internal-mobile-ar.png` | Same form for an internal investor — single field, locked operation %, explanatory note. Mobile · AR · light. |

## Stack on top of

```
main
└── … (7)
    └── claude/sprint8-office-settings
        └── claude/sprint9-investor-workspace
            └── claude/sprint10-investor-wallet
                └── claude/sprint11-profit-distribution   ← this sprint
```
