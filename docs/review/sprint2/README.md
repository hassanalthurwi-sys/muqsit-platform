# Sprint 2 — Investors & Investment Contracts (prototype)

Static review assets for the Sprint 2 prototype on `claude/sprint2-investors`.
**No backend, no database, no APIs, no deployment.** Not merged to `main`.

## Files

| File | Description |
| --- | --- |
| `sprint2.pdf` | Paginated PDF with captions: cover + 11 captioned screenshots |
| `01-investors-list-ar-light.png` | Investors list — desktop, Arabic RTL, light |
| `02-investor-profile-ar-light.png` | Investor profile — desktop, Arabic RTL, light (Saudi NID example) |
| `03-investments-list-ar-light.png` | Investment contracts list — desktop, Arabic RTL, light |
| `04-investment-details-ar-light.png` | Investment contract details — desktop, Arabic RTL, light |
| `05-new-contract-step1-ar-light.png` | Create flow step 1: select investor |
| `06-new-contract-step2-ar-light.png` | Create flow step 2: contract terms |
| `07-new-contract-step4-review-ar-light.png` | Create flow step 4: review |
| `08-investors-list-en-light.png` | Investors list — desktop, English LTR, light |
| `09-investors-list-ar-dark.png` | Investors list — desktop, Arabic RTL, dark |
| `10-investor-profile-mobile-ar.png` | Investor profile — mobile, Arabic RTL, light (GCC example) |
| `11-investments-list-mobile-ar.png` | Investment contracts list — mobile, Arabic RTL, light |

## What's covered

### Pages
- `/investors` — list (8 investors, all four identity types)
- `/investors/[id]` — profile
- `/investments` — contracts list (12 contracts, all statuses)
- `/investments/[id]` — contract details
- `/investments/new` — 4-step create flow with `localStorage` persistence

### Identity types
- Saudi NID (Muhammad Al-Subaie, Khalid Al-Otaibi, Ahmed Al-Qahtani)
- GCC ID (Abdulaziz Al-Kuwari, Qatar)
- Foreign Passport (Robert Anderson, United Kingdom)
- Commercial Registration (Muqsit office self, Al-Waha Investment Co., Al-Nakhil)

### Investor types
- Internal (office, 0% operation %)
- External (12-16% operation %)

### Bank account fields
Bank name, IBAN (formatted in groups of four), optional account holder name.
Mix of Saudi banks (Al-Rajhi, Al-Saudi Al-Faransi, NCB, Riyad, Al-Inma, Arab
National), Qatar (QNB) and UK (HSBC).

## How these were generated

- Production build (`pnpm build` + `pnpm start`).
- Headless Chromium via `puppeteer-core`, seeded with localStorage to bypass
  the mock auth guard.
- PDF rendered from `tmp/review-s2.html` via Chromium's print engine.
