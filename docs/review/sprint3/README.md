# Sprint 3 — Customers · Installments · Collections (prototype)

Static review assets for the Sprint 3 prototype on `claude/sprint3-installments`
(stacked on `claude/sprint2-investors`). **No backend, no APIs, no real
WhatsApp, no real OCR, no deployment.** Not merged to `main`.

## What's covered

### Customers
- `/customers` — list of 10 realistic Saudi customers
- `/customers/[id]` — profile with contact, employment, address, contracts table,
  notes; "WhatsApp" + "+ new contract" actions
- `/customers/new` — single-page sectioned form; identity-kind picker swaps
  required fields per kind (Saudi NID / GCC + country / Foreign passport + nationality)

### Installment contracts
- `/contracts` — list with smart filters (active / overdue / defaulted / completed)
- `/contracts/[id]` — pricing card (cash · installment · down · financed · monthly
  · margin · margin %) + funding card linking to the investment contract +
  embedded payment schedule
- `/contracts/new` — 4-step flow: customer → product & pricing with **live
  smart-calc preview** → funding link to an investment contract with
  sufficiency check → review
- **Partial-payment sheet** opened from any "دفع" button on the schedule;
  installment status auto-transitions to `partiallyPaid` or `paid`

### Collections (payment proof verification)
- `/collections` — inbox of pending proofs flagged as
  *duplicate reference*, *amount mismatch*, or *clean match*
- `/collections/[id]` — review screen with receipt placeholder, AI/OCR
  extracted fields (editable, with confidence %), duplicate-reference warning
  banner, comparison rows (amount, customer, timing), and Approve / Reject /
  Request-clarification actions
- `/collections/whatsapp/[customerId]` — read-only WhatsApp mock thread
  showing reminder → "تم التحويل" → receipt upload → confirmation

### Nav
- New top-level `التحصيلات` item under Operations
- The old `/clients` placeholder is removed; the sidebar's "العملاء" item now
  points at `/customers`

## Files

| File | Description |
| --- | --- |
| `sprint3.pdf` | Paginated PDF: cover + 17 captioned screenshots |
| `01-customers-list-ar-light.png` | Customers list (Saudi/GCC/UK mix) |
| `02-customer-profile-ar-light.png` | Customer profile (Saudi NID example) |
| `03-customer-create-ar-light.png` | New customer form with sectioned layout |
| `04-installments-list-ar-light.png` | Installment contracts list |
| `05-installment-details-ar-light.png` | Contract details + 12-row schedule |
| `06-partial-payment-sheet-ar-light.png` | Partial-payment sheet (183 of 383) |
| `07-installment-create-step2-ar-light.png` | Create flow step 2 — smart calc preview |
| `08-installment-create-step3-ar-light.png` | Create flow step 3 — investment-contract link |
| `09-installment-create-step4-ar-light.png` | Create flow step 4 — review |
| `10-collections-inbox-ar-light.png` | Pending payment proofs inbox with flags |
| `11-collections-review-duplicate-ar-light.png` | OCR review with duplicate-reference banner |
| `12-collections-review-clean-ar-light.png` | OCR review — clean match |
| `13-whatsapp-conversation-ar-light.png` | WhatsApp conversation mock |
| `14-customers-list-en-light.png` | Customers list (English LTR) |
| `15-customers-list-ar-dark.png` | Customers list (Arabic dark) |
| `16-customer-profile-mobile-ar.png` | Customer profile (mobile) |
| `17-whatsapp-mobile-ar.png` | WhatsApp conversation (mobile) |

## Verification

| Check | Result |
| --- | --- |
| `pnpm type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ 24 routes (19 static + 5 dynamic) |
| Visual screenshots | ✅ 17 captured via headless Chromium |
