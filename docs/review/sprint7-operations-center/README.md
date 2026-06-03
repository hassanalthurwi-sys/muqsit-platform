# Sprint 7 — Operations Center & Capital Recycling (prototype)

Static review assets for the Sprint 7 prototype on
`claude/sprint7-operations-center` (stacked on `claude/sprint6-portals`).
**Prototype only. No backend. No real authentication. No APIs. No
database. Not merged to `main`.**

## Product principle

The Operations Center is **today's work queue**, not an enterprise command
center. Every screen earns its place by leading directly to action. No
charts, no analytics, no embedded filters or large tables.

Capital recycling is **a different source of capital, not a different type
of product** — a recycled contract is a normal investment contract with a
small visible tag. Zero new modules, zero new routes.

## What's covered

### Operations Center home — `/operations` (rewrite)

Four primary action cards. Each one card, each one count + one amount + one
CTA. A card hides itself when its count is 0 (except the recycle card, which
shows an explanatory empty state).

1. **أقساط متأخرة** · customer count + total overdue → `/collections`
2. **إيصالات بانتظار المراجعة** · proof count + low-OCR count → `/collections/whatsapp`
3. **موافقات قيد الانتظار** · request count + critical count → `/approvals`
4. **رأس مال جاهز لإعادة التشغيل** · aggregated amount + investor count → `/investments?ready=1`

Below those, one lighter informational tile: **عقود استثمار قريبة من الانتهاء** → `/investments`.

That's it. No KPI strip on top, no charts, no filters, no embedded customer lists.

### Capital recycling — extensions to existing pages (zero new routes)

| Page | Sprint 7 change |
| --- | --- |
| `/investments` | New `🔄 رأس مال جاهز لإعادة التشغيل` filter pill + a one-line threshold explanation when active. Eligible rows show an inline "🔄 تشغيل الآن" link. |
| `/investments/new` | Detects `?recycleFromId=<id>`; renders a focused recycle form instead of the 4-step normal flow. |
| `/investments/[id]` | Shows the **🔄 معاد تدويره** badge next to the contract number when recycled, plus a small `تفاصيل إعادة التشغيل` block with three info rows (collected · office share · financing). |
| `/contracts/new` (installment) | Investor picker sorted by available financing descending. Investor names show with inline "متاح للتمويل: X ر.س". Recycled contracts render with `🔄` prefix in the dropdown and the badge in the chosen-contract summary card. |
| `/portal/investor/investments` (list) | Shows the 🔄 badge on each card when applicable. |
| `/portal/investor/investments/[id]` | Shows the 🔄 badge + the same three info rows. |
| `/portal/investor/statements` | Shows the 🔄 badge next to the recycled contract number in the distributions table. |

### Recycle form (within `/investments/new?recycleFromId=...`)

A focused, single-screen form:

1. **Read-only context** — investor name + collected amount (large readable).
2. **One input** — `نسبة المكتب لهذه الدورة (%)`, 0–100.
3. **Live preview** — `متاح للتمويل` (new contract principal) + `نصيب المكتب`,
   both update as the operator types.
4. **One button** — `تشغيل الآن`. Disabled until percentage is entered.

On submit:
- Calls `addInvestmentContract` (the existing store action — no new infrastructure).
- Creates a normal investment contract with `operationPct` = entered percentage,
  `amount` = financing, plus four optional tracking fields: `sourceContractId`,
  `recyclingCycle`, `recycledFromCollected`, `recyclingOfficeMargin`.
- The source contract reference is **stored internally for tracking but never
  surfaced in the UI**.
- Numbering: `<source-number>-R{n}` where `n` is the next cycle for that source.

### Threshold explanation

The threshold rule is explained simply in one place — at the top of the
`?ready=1` filtered list:

> تظهر هنا العقود التي تجاوز فيها المبلغ المُحصَّل من الأقساط الحد الذي اتفقت
> عليه مع المستثمر.

Not on every card. Not in a help icon.

## Files touched

| File | Purpose |
| --- | --- |
| `lib/mock/types.ts` | Four optional fields added to `InvestmentContract`. |
| `lib/mock/recycling.ts` (new) | Pure selectors: `collectedFor`, `recycleReady`, `aggregateRecycleReady`, `nextRecycleNumber`. |
| `lib/mock/contracts.ts` | Two thresholds lowered to demo-realistic values + one pre-existing recycled contract added so badges render on first load. |
| `app/(app)/operations/page.tsx` | Rewritten as the lean Today view. |
| `app/(app)/investments/page.tsx` | `?ready=1` filter pill + inline "تشغيل الآن" link. |
| `app/(app)/investments/new/page.tsx` | `?recycleFromId=<id>` recycle-mode renderer added alongside the existing 4-step flow. |
| `app/(app)/investments/[id]/page.tsx` | Badge + recycling details block when source is set. |
| `app/(app)/contracts/new/page.tsx` | Sorted investor picker + inline available amount + badge. |
| `components/ui/recycled-badge.tsx` (new) | One small component, reused everywhere. |
| `app/(portal)/portal/investor/investments/page.tsx` | Badge on cards. |
| `app/(portal)/portal/investor/investments/[id]/page.tsx` | Badge + three info rows. |
| `app/(portal)/portal/investor/statements/page.tsx` | Badge in distributions table. |
| `lib/i18n/dictionaries.ts` | `operations.*` rewritten lean; `recycling.*` added. |

**No new routes.** No `/operations/recycle`, no `/recycle`, no recycling-specific
page. Everything lives inside an existing page.

## What's out of scope

- No separate recycling module, engine, analytics, or reports.
- No recycling history page beyond the badge and the timeline entry.
- No source contract surfacing anywhere in the UI (kept internal-only for tracking).
- No customer picking during recycling.
- No batch recycling across investors.
- No new approval rules around recycling.
- No persistence beyond the in-memory mock store session.

## Files

| File | Description |
| --- | --- |
| `sprint7-plan.pdf` | Bilingual plan PDF — committed earlier as the agreed scope. |
| `sprint7.pdf` | Final review pack — cover + 20 captioned screenshots. |
| `01-operations-today-mobile-ar.png` | The lean Today view (the centerpiece). |
| `02-investments-ready-mobile-ar.png` | Investments list with `ready=1` filter + threshold rule + inline CTAs. |
| `03-recycle-form-empty-mobile-ar.png` | Recycle form on first open. |
| `04-recycle-form-filled-mobile-ar.png` | Recycle form with 10% entered → live preview. |
| `05-recycle-success-mobile-ar.png` | Success state after submit. |
| `06-recycled-contract-detail-mobile-ar.png` | Recycled contract detail with badge + info block. |
| `07-investments-list-mobile-ar.png` | Full investments list — badges on recycled contracts visible. |
| `08-contracts-new-step0-mobile-ar.png` | Installment contract flow — customer step. |
| `09-contracts-new-investor-picker-mobile-ar.png` | Investor picker (empty, before selection). |
| `10-contracts-new-investor-selected-mobile-ar.png` | Investor + recycled contract selected — badge visible in summary card. |
| `11-portal-investments-list-mobile-ar.png` | Investor portal — badge on cards. |
| `12-portal-investment-detail-mobile-ar.png` | Investor portal — recycled detail with info block. |
| `13-portal-statement-mobile-ar.png` | Investor portal — statement preview. |
| `14-operations-today-mobile-ar-dark.png` | Today view (AR · dark). |
| `15-recycle-form-mobile-ar-dark.png` | Recycle form (AR · dark). |
| `16-operations-today-mobile-en-light.png` | Today view (EN). |
| `17-recycle-form-mobile-en-light.png` | Recycle form (EN). |
| `18-operations-today-desktop-ar.png` | Today view (desktop 1280 · AR). |
| `19-investments-ready-desktop-ar.png` | Investments-ready list (desktop · AR). |
| `20-recycled-detail-desktop-ar.png` | Recycled detail (desktop · AR). |

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ no warnings or errors |
| `pnpm --filter @muqsit/web build` | ✅ |
| Visual screenshots | ✅ 20 captured |

## Stack on top of

```
main
└── … (4)
    └── claude/sprint5-financial
        └── claude/sprint6-portals
            └── claude/sprint7-operations-center   ← this sprint
```
