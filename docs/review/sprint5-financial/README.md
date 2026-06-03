# Sprint 5 — Financial Operations Core (prototype)

Static review assets for the Sprint 5 prototype on
`claude/sprint5-financial` (stacked on `claude/sprint4-operations`).
**No backend, no APIs, no real accounting engine, no authentication.**
Not merged to `main`.

## Philosophy

Operational finance, not enterprise accounting.

- No debit/credit terminology
- No chart of accounts
- No journal entries
- Just: receipts, payments, cash movement, balances

## What's covered

### Financial hub (`/financial`)
- Four KPIs: current cash balance · month receipts · month payments · month net.
- Five tile entry points: Receipts · Payments · Cash movement · Balances · Purchases.

### Receipt vouchers (`/financial/receipts`, `/[id]`, `/new`)
- List with source filters and search.
- Detail with print/share placeholders, duplicate-reference warning banner, linked customer/contract/investment, creator + verifier signatures.
- Create flow with source picker tiles, method chips, contract picker that adapts to source.

### Payment vouchers (`/financial/payments`, `/[id]`, `/new`)
- List with category filters and "Needs approval" pill.
- Detail with auto-approval pending banner, linked entity (investor / contract / purchase).
- Create flow with **live auto-approval warning** when amount > 10,000 SAR; saved as `draft` with `needsApproval: true`.

### Cash movement ledger (`/financial/cash-ledger`)
- Opening / total in / total out / current balance KPIs.
- Chronological table with **running balance** computed across full ledger.
- Filters: All · Incoming · Outgoing · Cash only · Bank only.
- Signed amounts in green (+) and red (−). Each row links back to its voucher.

### Balances (`/financial/balances`)
- **Office cash** hero card with derivation formula visible (opening + receipts − payments).
- **Investors** table: capital · profit due · paid · net.
- **Customers** table: remaining + overdue count pill.
- No accounting jargon — just the numbers an operator cares about.

### Goods purchases (`/financial/purchases`, `/new`)
- Foundation for the future margin flow. Each purchase shows status (purchased · linked to contract · sold), supplier, amount.
- Linked contract number is clickable when set.
- Prototype: no inventory system, no asset register.

### Integration with previous sprints
- Large payment vouchers create approval requests (Sprint 4 integration).
- Duplicate-reference flag surfaces on receipts (Sprint 3 fraud-watch pattern).
- All cash movement entries carry the originating employee (Sprint 4 audit hook).

## Files

| File | Description |
| --- | --- |
| `sprint5.pdf` | Paginated PDF — cover + 17 captioned screenshots |
| `01-financial-hub-ar-light.png` | Financial hub with KPIs + section cards |
| `02-cash-ledger-ar-light.png` | Cash movement ledger (the centerpiece) |
| `03-receipts-list-ar-light.png` | Receipts list with source filters |
| `04-receipt-detail-ar-light.png` | Receipt detail with duplicate-reference warning |
| `05-receipt-new-ar-light.png` | New receipt voucher form |
| `06-payments-list-ar-light.png` | Payments list with "Needs approval" pill |
| `07-payment-detail-needsapproval-ar-light.png` | Payment awaiting approval |
| `08-payment-new-approval-warning-ar-light.png` | New payment with live auto-approval warning |
| `09-balances-ar-light.png` | Office cash + investors + customers balances |
| `10-purchases-list-ar-light.png` | Goods purchases list |
| `11-financial-hub-en-light.png` | Financial hub (English LTR) |
| `12-cash-ledger-en-light.png` | Cash ledger (English LTR) |
| `13-financial-hub-ar-dark.png` | Financial hub (AR dark) |
| `14-cash-ledger-ar-dark.png` | Cash ledger (AR dark) |
| `15-financial-hub-mobile-ar.png` | Financial hub (mobile) |
| `16-cash-ledger-mobile-ar.png` | Cash ledger (mobile) |
| `17-balances-mobile-ar.png` | Balances (mobile) |

## Mock pool

- **10 receipt vouchers** mixing all four sources (customer installment · investor deposit · office income · other) and all five methods (cash, bank, STC Pay, cheque, card).
- **10 payment vouchers** across categories (goods purchase · investor profit · salary · rent · office expense · admin expense).
- **5 goods purchases** with status mix (purchased · linkedToContract · sold).
- **Cash ledger** is derived live from the receipts + payments lists with a 125,000 SAR opening balance dated 2025-05-01.

## Verification

| Check | Result |
|---|---|
| `pnpm type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ 41 routes |
| Visual screenshots | ✅ 17 captured |
