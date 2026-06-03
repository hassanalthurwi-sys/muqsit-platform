# Sprint 6 — Investor & Customer Portals (prototype)

Static review assets for the Sprint 6 portal prototype on
`claude/sprint6-portals` (stacked on `claude/sprint5-financial`).
**Prototype only. No backend. No real authentication. No OTP. No APIs. No
database. No payment gateway. No real notifications. Not merged to `main`.**

## Philosophy

Self-service apps — not office tools.

The office system is a dense operator console. The portals are deliberately the
opposite: mobile-first, soft cards over tables, three numbers over twenty, a
bottom tab bar over a sidebar. The investor wants to know how their money is
doing in 5 seconds. The customer wants to pay the next installment in 5
seconds. Everything else is one tap away under "حسابي".

## Identity

Hard-coded for the prototype via `useInvestorIdentity()` / `useCustomerIdentity()`
in `apps/web/src/lib/portal/use-portal-identity.ts`.

| Portal | Identity |
| --- | --- |
| Investor | محمد بن عبدالله السبيعي (`inv-ext-2`) — external, 2 active contracts, 2.5M ر.س |
| Customer | فاطمة محمد القحطاني (`cus-2`) — active installment contract `INS-2024-018` (مكيف سبليت سامسونج 24K), 18 installments, 8 paid |

The shape of the hook matches what a real auth context would return, so when
real authentication is added later, only `use-portal-identity.ts` changes; no
component is rewritten.

## Information architecture

### Bottom tab bar

The portal shell uses a bottom tab bar on mobile and a top horizontal nav on
desktop (`lg:`+). Both share the same five entries per portal.

| Portal | Tabs |
| --- | --- |
| Investor | الرئيسية · الاستثمارات · الأرباح · الإشعارات · حسابي |
| Customer | الرئيسية · الأقساط · السداد · الإشعارات · حسابي |

The investor simulator and statements live one tap deeper under "حسابي"; the
customer documents page lives the same way under "حسابي". These features are
real-feeling and present but don't earn primary tab real estate.

### Pages (16 total)

| # | Investor (`/portal/investor/...`) | Customer (`/portal/customer/...`) |
| --- | --- | --- |
| 1 | dashboard | dashboard |
| 2 | investments — list | installments — schedule |
| 3 | investments — detail | payments — hub |
| 4 | profits | payments/upload — generic |
| 5 | notifications | payments/upload/[installmentId] — pre-filled |
| 6 | account | notifications |
| 7 | simulator | account |
| 8 | statements | documents |

## What's covered

### Investor portal

- **Dashboard** — Capital hero card with live utilization bar, this-month and
  YTD profit tiles, next distribution card, quick CTAs to simulator and
  statement, and recent activity list.
- **Investments list** — Per-contract card with principal, utilization bar,
  recycling status pill, and end date. Tap → contract detail.
- **Investment detail** — Principal hero, full data row breakdown, profit
  terms, contract document download row, full activity timeline.
- **Profits** — YTD total hero, last/next distribution tiles, full
  distribution history list.
- **Notifications** — All / unread filter; soft-card list with priority dot
  and per-type icon.
- **Account** — Profile summary + bank account preview + 5 destination tiles
  (profile, statements, simulator, preferences, support) + sign-out + "powered
  by".
- **Simulator** — Pure-client growth simulation. Capital slider + 4-period
  toggle + 3-risk toggle + reinvest checkbox. Outputs **one sparkline + three
  numbers** (current capital · expected value · cumulative return) + persistent
  disclaimer. No comparison row, no spreadsheet, no exhaustive table.
- **Statements** — Print-styled HTML "official document": office letterhead,
  document title, recipient block, period meta, capital summary cards,
  distributions table with totals, reference number, signature block. Period
  picker (monthly / quarterly / annual). `@media print` strips the app chrome
  so browser print produces a clean PDF.

### Customer portal

- **Dashboard** — Conditional overdue alert (warning tone, upload CTA),
  next-installment hero with prominent "رفع إيصال" button, remaining/paid
  tiles, installments-paid progress bar, contract meta link.
- **Installments** — Three summary tiles + full numbered schedule. Each row
  shows due date, status pill (paid · overdue · partial · scheduled), and a
  contextual "رفع إيصال" link for unpaid rows.
- **Payments hub** — Big "Upload new proof" CTA + list of recent proofs with
  per-proof status (under review / approved / rejected).
- **Upload flow** — Installment picker (radio cards), selected-installment
  banner, amount input, method tabs (bank transfer / STC Pay / cash),
  reference field, drag-and-drop file zone, notes, submit. Includes a
  success state (mock — no actual upload).
- **Upload pre-filled** — Same component, deep-linked from dashboard or
  schedule with the installment preselected.
- **Notifications** — Same shape as investor portal.
- **Account** — Profile + address + 4 destination tiles (profile, documents,
  preferences, support) + sign-out + "powered by".
- **Documents** — Contract copy + schedule + approved receipts list.

## What's deliberately NOT included

- No login flow / no OTP / no user-creation; identity is hard-coded.
- No real upload — file picker stores nothing.
- No real notifications — list is static.
- No real PDF generation — the statement page is print-styled HTML.
- No mode switcher between investor and customer; each portal is its own URL.
- No mock store mutations from the portal — these views are read-only on the
  underlying mock data.

## Files

| File | Description |
| --- | --- |
| `sprint6.pdf` | Paginated PDF — cover + 25 captioned screenshots |
| `01-investor-dashboard-ar-light.png` | Investor dashboard (mobile · AR · light) |
| `02-investor-investments-ar-light.png` | Investments list (mobile · AR · light) |
| `03-investor-investment-detail-ar-light.png` | Investment detail (mobile · AR · light) |
| `04-investor-profits-ar-light.png` | Profits & distributions (mobile · AR · light) |
| `05-investor-simulator-ar-light.png` | Capital growth simulator (mobile · AR · light) |
| `06-investor-statements-ar-light.png` | PDF-style statement, quarterly (mobile · AR · light) |
| `07-investor-notifications-ar-light.png` | Investor notifications (mobile · AR · light) |
| `08-investor-account-ar-light.png` | Investor account hub (mobile · AR · light) |
| `09-customer-dashboard-ar-light.png` | Customer dashboard (mobile · AR · light) |
| `10-customer-installments-ar-light.png` | Customer schedule (mobile · AR · light) |
| `11-customer-payments-ar-light.png` | Customer payments hub (mobile · AR · light) |
| `12-customer-upload-ar-light.png` | Upload proof flow (mobile · AR · light) |
| `13-customer-notifications-ar-light.png` | Customer notifications (mobile · AR · light) |
| `14-customer-account-ar-light.png` | Customer account hub (mobile · AR · light) |
| `15-customer-documents-ar-light.png` | Customer documents (mobile · AR · light) |
| `16-investor-dashboard-ar-dark.png` | Investor dashboard (mobile · AR · dark) |
| `17-investor-simulator-ar-dark.png` | Simulator (mobile · AR · dark) |
| `18-customer-dashboard-ar-dark.png` | Customer dashboard (mobile · AR · dark) |
| `19-customer-upload-ar-dark.png` | Upload flow (mobile · AR · dark) |
| `20-investor-dashboard-en-light.png` | Investor dashboard (mobile · EN · light) |
| `21-customer-dashboard-en-light.png` | Customer dashboard (mobile · EN · light) |
| `22-investor-dashboard-desktop-ar.png` | Investor dashboard (desktop 1280 · AR · light) |
| `23-customer-dashboard-desktop-ar.png` | Customer dashboard (desktop 1280 · AR · light) |
| `24-investor-statement-desktop-ar.png` | Full statement spread (desktop 1280 · AR · light) |
| `25-investor-simulator-desktop-ar.png` | Simulator (desktop 1280 · AR · light) |

## Mock pool

The portals consume the existing Sprint 2/3/5 mock pool — no new data was added.

- Investor: `inv-ext-2` with contracts `c-2024-001` (INV-2024-001, 1.5M
  recycling on, 15% op fee) and `c-2024-007` (INV-2024-007, 1M, 13% op fee).
- Customer: `cus-2` with installment contract `ins-2024-018` (INS-2024-018,
  مكيف سبليت سامسونج 24K, 18 installments, 8 paid through).
- Distributions are derived live from the contract `timeline` activity
  entries via regex against the `توزيع أرباح N,NNN ر.س` pattern.
- Notifications are static prototype lists in `lib/portal/data.ts`.

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ no warnings or errors |
| `pnpm --filter @muqsit/web build` | ✅ 16 portal routes built |
| Visual screenshots | ✅ 25 captured (mobile + desktop, AR + EN, light + dark) |

## Stack on top of

```
main
└── claude/sprint4-operations
    └── claude/sprint5-financial
        └── claude/sprint6-portals   ← this sprint
```

Not merged to `main`. Intended for product / direction review only.
