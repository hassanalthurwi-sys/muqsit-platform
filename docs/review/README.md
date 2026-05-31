# Office Dashboard v2 — Review Pack

Static review assets for the office dashboard on `claude/dashboard-v2`.
**No deployment. Not merged to `main`.**

## Files

| File | Description |
| --- | --- |
| `dashboard-v2.pdf` | Paginated PDF with captions: cover · desktop AR/light · desktop AR/dark · desktop EN/light · mobile AR/light · mobile AR/dark |
| `01-desktop-ar-light.png` | Desktop, Arabic RTL, light theme (1440 × 900 viewport, fullPage capture) |
| `02-desktop-ar-dark.png` | Desktop, Arabic RTL, dark theme |
| `03-desktop-en-light.png` | Desktop, English LTR, light theme |
| `04-mobile-ar-light.png` | Mobile, Arabic RTL, light theme (390 × 844 viewport, fullPage) |
| `05-mobile-ar-dark.png` | Mobile, Arabic RTL, dark theme |

## What the dashboard shows

Operational view for an installment-office owner. Six sections, top to bottom:

1. **Tier 1 KPIs** — Collections this month (collected · expected · rate),
   Overdue installments (amount · count · delayed customers), Active
   contracts (count · total value · remaining balance), Pending contracts
   (count · total value · awaiting signature).
2. **Smart alerts** — five operational action rows that link to the relevant
   placeholder pages (clients, contracts, investors, documents).
3. **Office profit — this month** — split into office-owned contracts,
   management % on investor operations, and margin from goods sold to
   investors. Always shows all three lines (zeros included) for layout
   stability.
4. **Active invested capital** — internal vs external split bar, plus a
   utilization progress bar with unutilized callout.
5. **Cash movement — this month** — single compact strip: net · cash in ·
   cash out · goods purchased · investor disbursements.
6. **Installment follow-up** — tabbed table: Today, This week, Overdue,
   Defaulted 60+.

All values are realistic Saudi installment-office mock data. No backend,
no API, no Prisma.

## How these were generated

- Production build of the Next.js app served locally (`pnpm start`).
- Headless Chromium via `puppeteer-core`, seeded with localStorage to bypass
  the mock auth guard.
- PDF rendered from `tmp/review.html` via Chromium's print engine.
