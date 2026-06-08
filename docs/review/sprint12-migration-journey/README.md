# Sprint 12 — الانتقال إلى مُقسِّط / Migration Journey

Static review assets for the Sprint 12 prototype on
`claude/sprint12-migration-journey` (stacked on `claude/sprint11-profit-distribution`).
**Prototype only. No backend. No real OCR. No real file parsing.**

## Product principle

The office should feel that Muqsit is helping them move, **step by
step**. The user thinks in terms of data they want to bring across,
not Excel columns or database mappings. The system does ~90% of the
work; the user only reviews, corrects, and approves.

## The seven-step journey

A single new route `/migration` hosts the journey. Each step has the
same shape — the data type changes, the UI doesn't:

| # | Step | What gets imported |
|---|---|---|
| 1 | المستثمرون · Investors | Name, identity, phone, email, bank, IBAN |
| 2 | عقود الاستثمار · Investment contracts | Investor, capital, office profit, investor profit, dates |
| 3 | العملاء · Customers | Name, identity, phone, city, employer, salary |
| 4 | عقود التقسيط · Installment contracts | Customer, product, cash price, installment price, funding source |
| 5 | سندات القبض · Receipt vouchers | Date, party, amount, method, description |
| 6 | سندات الصرف · Payment vouchers | Date, party, amount, method, description |
| 7 | المراجعة النهائية · Final review | Summary + approval CTA |

## Per-step flow

```
Choose method  →  Simulate analysis  →  Review extracted rows
       │                                       │
       └── methods ──┐                          ├── reconciliation prompts
   Excel · PDF · Scan · Manual                  │      (only when matches found)
                                                │
                                       Approve / Skip
```

Each step's UI is identical so the user learns it once. The only
variable is the data type.

## Data-centric, not file-centric

Per the user's adjustment: the **data type is the step**. The file
question comes second. So when the user is on `/migration/investors`,
the page title is "المستثمرون — Investors" — they're moving *that
data*. Inside the step, the question is "what kind of files do you
have for this data?".

Four input methods are offered, all with the same visual treatment:

- **ملف Excel** — تحليل دقيق
- **ملفات PDF** — تحليل جيد (بعض الحقول تحتاج مراجعة)
- **صور أو مسح ضوئي** — تحليل أوّلي
- **إدخال يدوي** — ابدأ بسجل فارغ

The method affects the **confidence** of the extraction simulation
(Excel → mostly confirmed, scan → more `needsReview` cells), nothing
else.

## Review table — three cell states

Each extracted cell carries one of:

- ✓ **مؤكد** (white) — system is confident
- ⚠ **يحتاج مراجعة** (yellow tint) — review recommended
- ⚫ **ناقص** (gray + "—") — missing, must be filled before approving

A summary chip at the top shows the totals across all cells of the
table. The approve button stays available; the prototype doesn't
block on missing cells (a future production version would).

## Lightweight reconciliation

The biggest migration pain — matching the same person across files —
gets a deliberately tiny UI. When the system detects a likely match,
a gold-soft card appears below the review table:

> ✨ **هل هذان نفس الشخص؟**
>
> محمد السبيعي ↔ محمد بن عبدالله السبيعي
> *عقد استثمار 80,000 ر.س — من ملف Excel*
>
> [نعم، نفس الشخص] [لا، أشخاص مختلفون]

No technical mapping screens. No column matching. Just one human
question, one human answer. The prototype has reconciliation prompts
seeded into the investment-contracts, installment-contracts, and
receipts steps to demonstrate where they naturally arise.

## Final review + completion

The seventh step is a summary screen — six cards showing the count
imported per data type, with a single **اعتماد الانتقال إلى مُقسِّط**
CTA. After approval:

- A celebration screen: ✨ **أهلاً بك في مُقسِّط** + the total record
  count + a CTA back to the dashboard.
- A `migrationCompleted` flag persists to localStorage so the
  dashboard banner stops showing.

## Existing data is preserved (option B)

Per the user's confirmed direction:

- The seed `MOCK_*` data stays exactly as-is.
- The migration journey is additive — its mock-extracted rows are
  shown for review and the approval flow stores progress in
  localStorage, but it does **not** mutate the live operational data
  in the prototype.
- The dashboard banner appears alongside normal KPIs and operations.
- A "completed" flag hides the banner once the user finishes.

## Files

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | New `MigrationStepKey`, `MigrationInputMethod`, `MigrationStepStatus`, `MigrationFieldStatus`, `MigrationRow`, `MigrationMatchPrompt`, `MigrationStepState`. |
| `lib/mock/migration-samples.ts` (new) | Per-step sample rows for each data type, a method-aware `sampleRowsFor` helper, reconciliation prompts for the relevant steps, column ordering helper. |
| `lib/mock/store.tsx` | `migrationProgress`, `migrationCompleted`, `updateMigrationStep`, `completeMigration`, `resetMigration`. Persisted to localStorage. |
| `lib/i18n/dictionaries.ts` | New `migration.*` namespace (AR + EN) — ~80 strings. |
| `components/migration/journey-sidebar.tsx` (new) | The 7-step sidebar with per-step status icons. |
| `components/migration/input-method-picker.tsx` (new) | The 2×2 method cards. |
| `components/migration/review-table.tsx` (new) | The extracted-rows table with state-colored cells + summary. |
| `components/migration/reconciliation-card.tsx` (new) | The "هل هذان نفس الشخص؟" prompt cards. |
| `app/(app)/migration/page.tsx` (new) | The journey overview — seven step cards + start/resume CTA. |
| `app/(app)/migration/[step]/page.tsx` (new) | The shared per-step page — handles choose / analyzing / review phases for all 7 steps including the final review. |
| `app/(app)/migration/complete/page.tsx` (new) | The celebration screen. |
| `app/(app)/dashboard/page.tsx` | New `MigrationBanner` component above the existing KPIs (hides after completion). |

## What's deliberately NOT included

- No real Excel parser, OCR engine, or PDF reader.
- No actual file upload — the dropzone is decorative.
- No mutation of the existing seed operational data when migration is approved.
- No column-mapping screens, no technical settings.
- No edit mode for individual cells in the review table (visible but
  not interactive — adding this is straightforward later).
- No backend, no API.
- No multi-user reconciliation workflow.

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
| `sprint12.pdf` | Cover + 6 captioned screenshots. |
| `01-dashboard-banner-desktop-ar.png` | Dashboard with the gold-soft migration banner. Desktop · AR · light. |
| `02-migration-overview-desktop-ar.png` | The journey overview — sidebar + 7 step cards + start CTA. Desktop · AR · light. |
| `03-method-picker-desktop-ar.png` | Per-step "what files do you have?" picker — 4 cards + dropzone hint. Desktop · AR · light. |
| `04-analyzing-desktop-ar.png` | Simulated analysis state with sparkles + progress bar. Desktop · AR · light. |
| `05-review-table-desktop-ar.png` | Review table with confirmed / needs-review / missing cells + summary chips. Desktop · AR · light. |
| `06-reconciliation-desktop-ar.png` | Investment-contracts step with the lightweight reconciliation card and Yes/No prompts. Desktop · AR · light. |

## Stack on top of

```
main
└── … (8)
    └── claude/sprint9-investor-workspace
        └── claude/sprint10-investor-wallet
            └── claude/sprint11-profit-distribution
                └── claude/sprint12-migration-journey   ← this sprint
```
