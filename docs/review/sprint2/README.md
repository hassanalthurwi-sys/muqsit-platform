# Sprint 2 — Investors & Investment Contracts (prototype)

Static review assets for the Sprint 2 prototype on `claude/sprint2-investors`.
**No backend, no database, no APIs, no deployment.** Not merged to `main`.

## Revision note

This revision removes **goods margin** from the investment-contract entity (it
belongs to the later installment-purchase flow) and adds **capital recycling
permission** with an optional minimum threshold.

## Files

| File | Description |
| --- | --- |
| `sprint2.pdf` | Paginated PDF with captions: cover + 12 captioned screenshots |
| `01-investors-list-ar-light.png` | Investors list — desktop, AR RTL, light |
| `02-investor-profile-ar-light.png` | Investor profile — desktop, AR RTL, light (Saudi NID) |
| `03-investments-list-ar-light.png` | Investment contracts list — desktop, AR RTL, light |
| `04-investment-details-ar-light.png` | Contract details with **Capital recycling** card — desktop, AR RTL, light |
| `05-new-contract-step1-ar-light.png` | Create flow — step 1: select investor |
| `06-new-contract-step2-ar-light.png` | Create flow — step 2: contract terms |
| `07-new-contract-step3-recycling-ar-light.png` | Create flow — step 3: preferences (Yes/No toggle + threshold) |
| `08-new-contract-step4-review-ar-light.png` | Create flow — step 4: review |
| `09-investors-list-en-light.png` | Investors list — desktop, EN LTR, light |
| `10-investors-list-ar-dark.png` | Investors list — desktop, AR RTL, dark |
| `11-investor-profile-mobile-ar.png` | Investor profile — mobile, AR RTL, light (GCC) |
| `12-investments-list-mobile-ar.png` | Investment contracts list — mobile, AR RTL, light |

## What changed in the entity

- **Removed**: `goodsMarginNotes` from `InvestmentContract`.
- **Added**:
  - `capitalRecyclingEnabled: boolean`
  - `capitalRecyclingMinThreshold?: number` (only meaningful when enabled)
- **Dictionary**: `investments.details.recycling.*` and
  `investments.create.step3.recycling*` keys replace the old goods-margin keys
  in both AR and EN. Generic `common.yes` / `common.no` added.

## Mock pool

8 investors (1 internal · 7 external across all 4 identity kinds), 12 contracts.
Capital recycling distribution:

- Internal contracts: recycling enabled, no threshold (auto-recycle all).
- External contracts: mix of enabled (with thresholds 25K · 50K · 100K · 200K SAR)
  and disabled (e.g. UK investor, one Saudi individual, the pending-setup contract).

## How these were generated

- Production build (`pnpm build` + `pnpm start`).
- Headless Chromium via `puppeteer-core`, seeded with `localStorage` to bypass
  the mock auth guard.
- PDF rendered from `/tmp/review-s2.html` via Chromium's print engine.
