# Muqssit Platform — Design Brief (BRS for Designers)

> **Purpose of this document**: A single, comprehensive reference that a designer (human or AI) can read once and immediately understand the entire system — what it is, who uses it, what it looks like, what each screen does, and how users move through it. Companion to `Muqsit_BRS_v1.0.md` (the engineering BRS) but organized for design work.
>
> **Latest version reflects**: Sprints 1 → 28 (prototype complete, MVP deploying to test.muqssit.com).

| Field | Value |
|---|---|
| Product | Muqssit — Operational SaaS for Saudi installment offices |
| Stage | MVP (deploying to test.muqssit.com) |
| Default language | Arabic (RTL) · English (LTR) as secondary |
| Visual register | Saudi modern banking (Al Rajhi / Alinma / STC Bank / Tamara / Tabby) |
| Primary user | Office owner-operator (non-technical) |
| Brand spelling | Domain: `muqssit.com` · Internal/AR: `مُقسِّط` |

---

## 1. The product in 60 seconds

**Muqssit** is a web platform that helps Saudi installment offices run their daily operations — from accepting capital from investors, to selling goods on installment to customers, to collecting installments, to distributing profits automatically.

It replaces the mix of Excel spreadsheets, paper notebooks, and generic accounting software that most installment offices use today.

It is **operational, not accounting** — it shows what's happening today, this week, this month. It does not maintain a general ledger or produce statutory financial statements.

It is built for **non-technical owner-operators**: every screen answers an operational question without requiring accounting knowledge.

---

## 2. Who uses it

Six user types, three contexts:

### 2.1 Platform side (`/admin/*`)

| Role | Who they are | What they need |
|---|---|---|
| **Platform admin** | The Muqssit team / owner | A bird's-eye view of all offices, plans, and platform staff |
| **Platform staff** | Support / accounting team at Muqssit | Filtered views based on their custom permission matrix |

### 2.2 Office side (`/`, `/employees`, `/subscription`, etc.)

| Role | Who they are | What they need |
|---|---|---|
| **Office manager** | The shop owner — usually 40-60 yo, not technical | A simple dashboard showing cash, risk, collections, investments — and one-click access to everyday tasks |
| **Office employee** | 1-5 staff per office (collections clerk, accountant, customer service) | A focused workspace for their specific role, gated by per-employee permissions |

### 2.3 Portals (`/portal/investor/*`, `/portal/customer/*`)

| Role | Who they are | What they need |
|---|---|---|
| **Investor** | Person/entity funding the office's purchases | Transparent view of their capital, contracts, profit, recent activity |
| **Customer** | End buyer paying in installments | Their installment schedule + ability to upload bank transfer proof |

---

## 3. Visual identity & design principles

### 3.1 Visual register

**Warm, premium, trustworthy.** The aesthetic of modern Saudi banking — not flashy startup, not legacy enterprise. Soft financial green, warm whites, muted gold accents.

| Token | Light theme | Dark theme |
|---|---|---|
| **Background** | `#FBF9F4` (warm off-white) | `#0F1A14` (deep forest) |
| **Card** | `#FFFFFF` | `#1A2A21` |
| **Primary (financial green)** | `#1F6B47` | `#3FA17C` |
| **Primary-soft** | `#E8F2EC` | `#1F3D2C` |
| **Gold accent** | `#B8923A` | `#D4AE5F` |
| **Gold-soft** | `#FBF1D7` | `#3D2F12` |
| **Success** | `#1F6B47` (same as primary) | `#3FA17C` |
| **Warning** | `#B8923A` (gold) | `#D4AE5F` |
| **Destructive** | `#A6353F` (muted brick) | `#D85461` |
| **Muted text** | `#586473` | `#8B95A3` |
| **Borders** | `#E7E2D8` | `#2C3D31` |

**Forbidden**:
- Pitch-black backgrounds (`#000000`) — use `#0F1A14` or warmer.
- Flashy startup gradients (purple → pink, neon).
- Pure white in dark mode.

### 3.2 Typography

| | Arabic | English |
|---|---|---|
| **Primary font** | IBM Plex Sans Arabic | IBM Plex Sans |
| **Headings** | Weights 600-700 | Weights 600-700 |
| **Body** | Weight 400 | Weight 400 |
| **Numeric** | Latin digits, tabular variant in financial figures | Same |

**Important convention**: All money/quantity numbers render in **Latin digits with comma separators**, even in Arabic UI. This is the Saudi banking standard (Al Rajhi, Alinma, STC Pay all do this).

Examples:
- ✅ `2,500 ر.س` in Arabic UI
- ❌ `٢٬٥٠٠ ر.س` (Arabic-Indic digits — feels old / less clear)

### 3.3 Layout grid

- **Mobile** (390 × 844): single column, stacked cards.
- **Tablet** (768 × 1024): two columns for KPI cards.
- **Desktop** (1280+): max content width `1152px` (max-w-6xl), centered, with `256px` sidebar.

### 3.4 Core design principles (apply to every screen)

1. **Operational-first.** Cards over charts. Charts only when they read at a glance.
2. **Four office-dashboard priorities.** Every dashboard surface should reinforce one of: cash position · risk · collections · investment performance.
3. **Simplicity over complexity.** When in doubt, remove. Fewer KPIs done well > many done poorly.
4. **Arabic-first clarity.** Plain terminology. No internal jargon. A non-technical owner should understand every word.
5. **Latin digits in finance.** Standard for Saudi banking.
6. **Less density unless it earns its keep.** No tightly packed tables when cards would do.
7. **Hide the math.** The user sees "balance" not "current_balance computed from voucher streams". Algorithms live in the code, not in copy.

### 3.5 Common components (already implemented)

| Component | Purpose |
|---|---|
| `Card` | The primary content container — rounded-2xl, soft border |
| `StatusPill` | Small badge with tone (primary, gold, success, warning, destructive) |
| `Currency` | Renders amounts with Latin digits + ر.س suffix |
| `IdentityBadge` | Shows the type of identity (Saudi ID, GCC ID, passport, CR) |
| `PermissionTriState` | 3-state toggle: allow · requireApproval · deny |
| `InvestorAvatar` | Circle with initials, colored by investor type |

---

## 4. Information architecture

### 4.1 Office side (`/`) — primary sidebar

```
العمليات
  ├─ لوحة العمليات (/)              ← الشاشة الرئيسية
  ├─ لوحة المكتب (/dashboard)
  ├─ عقود الاستثمار (/contracts)
  ├─ عقود التقسيط (/installment-contracts)
  ├─ العملاء (/customers)
  ├─ التحصيلات (/collections)
  └─ المستثمرون (/investors)

الإدارة
  ├─ الموافقات (/approvals)
  ├─ الأدوار والصلاحيات (/permissions)
  ├─ موظفو المكتب (/employees)
  └─ سجل العمليات (/audit)

المالية
  ├─ المالية (/financial)
  └─ التقارير (/reports)

الأرشيف
  └─ المستندات (/documents)

البوابات (preview links)
  ├─ بوابة المستثمر (/portal/investor)
  └─ بوابة العميل (/portal/customer)

النظام
  └─ الإعدادات (/settings)

الحساب  (bottom of sidebar)
```

### 4.2 Platform side (`/admin/*`) — separate sidebar

```
لوحة المنصة (/admin/dashboard)
المكاتب (/admin/offices)
الباقات (/admin/plans)
موظفو النظام (/admin/employees)
إعدادات المنصة (/admin/settings)
سجل العمليات (/admin/audit)
```

### 4.3 Auth / public

```
/login
/register
/register/verify
/welcome
/invite/[token]
/select-tenant
/subscription
/subscription/checkout
```

### 4.4 Portals (separate shells)

```
/portal/investor/
  ├─ /  (dashboard)
  ├─ /account
  ├─ /investments
  ├─ /investments/[id]
  ├─ /profits
  ├─ /statements
  ├─ /simulator
  └─ /notifications

/portal/customer/
  ├─ /  (dashboard)
  ├─ /account
  ├─ /installments
  ├─ /payments
  ├─ /payments/upload
  ├─ /documents
  └─ /notifications
```

---

## 5. Screen-by-screen reference

Every implemented screen, what it does, and what's on it. Designers should reference the PDFs in `docs/review/sprint*/` for the latest visual state.

### 5.1 The headline screen — Operations Center (`/operations`)

The owner's command center. Four sections vertical:

**Section 1 — Critical Alerts (red bar at top, only if triggered)**
- Duplicate transfer-reference payment proofs awaiting review.
- Defaulted customers (90+ days overdue).
- Investors approaching low capital threshold.

**Section 2 — 5 Work Queue Tiles** (the dispatch board)
- Overdue installments (count + amount)
- Pending approvals
- Payment proofs awaiting review
- Low-confidence OCR proofs (Pro plan)
- WhatsApp follow-ups needed

**Section 3 — Investor / Investment Cards**
- Investors approaching capital recycling threshold (gold badge)
- Investment contracts ending within 30 days

**Section 4 — Quick-pick row for critical approvals**

### 5.2 Office Dashboard (`/dashboard`)

The lighter daily view. Four KPI cards in a row:
- التحصيلات (collections)
- المتأخرات (overdues)
- العقود النشطة (active contracts)
- العقود المعلَّقة (pending contracts)

Then: a bar chart of monthly cash flow, profit-and-profitability cards, internal-vs-external capital utilization donut, and 4-tab installment tracker (today / overdue / upcoming / defaulted).

### 5.3 Investors (`/investors`, `/investors/[id]`)

**List**: Cards on mobile, table on desktop. 4 KPIs per investor: current balance, total capital invested, realized profit, active contract count. Filter pills: All / Internal / External. Gold badge when balance ≥ recycling threshold.

**Detail**: KPI strip → recycling alert (if applicable) → balance card with two action buttons (`+ Receipt`, `+ Payment`) → contact info → identity → investment contracts → activity log derived from vouchers + distributions.

### 5.4 Investment Contracts (`/contracts`, `/contracts/[id]`)

**Create**: Pick investor → its type (internal/external) auto-fills the profit-fields shape. External: 2 profit amounts (office + investor). Internal: 1 profit amount (office only). Add capital, dates, recycling settings.

**Detail**: 3 cards across:
- Contract profit (office + investor + total)
- Capital usage (used vs available, progress bar)
- Active installment contracts linked, each with two thin progress bars (office collected / investor collected)

### 5.5 Customers (`/customers`, `/customers/[id]`)

**List**: Filter by risk class (low / medium / high). Search by name or mobile.

**Detail**: Card with employer + salary + city, list of current contracts with their states, payment history, WhatsApp thread preview (when Pro plan).

### 5.6 Installment Contracts (`/installment-contracts`, `/installment-contracts/[id]`)

**Create**: Customer → mandatory link to a funding investment contract → cash price + installment price → schedule generated automatically.

**Detail**: Distribution policy card with two long progress bars (office / investor recovery progress). Schedule table — one row per installment with status pill and "Pay" button.

### 5.7 Collections (`/collections`)

Focused on the collection officer. Sorted by due date. Filter pills: due today / overdue / upcoming / defaulted. One-click "Pay" per row.

### 5.8 Financial (`/financial/*`)

- `/financial` — hub with summary cards
- `/financial/cash-ledger` — unified in/out ledger
- `/financial/receipts` — receipt vouchers list
- `/financial/receipts/new` — create receipt
- `/financial/receipts/[id]` — receipt detail
- `/financial/payments` — payment vouchers list
- `/financial/payments/new` — create payment
- `/financial/payments/[id]` — payment detail (with approval status if > 10K SAR)
- `/financial/balances` — investor balance overview
- `/financial/purchases` — goods purchases (for office's own buying)

### 5.9 Permissions (`/permissions`, `/permissions/[id]`)

**List**: 4 preset roles as cards (Office Manager · Employee · Collections Officer · Accountant), each with member count chip and Rename/Duplicate actions.

**Detail**: 14 actions in 5 groups (contracts · payments · customers · investors · system), each with a tri-state toggle (allow / requireApproval / deny).

### 5.10 Approvals (`/approvals`, `/approvals/[id]`)

**Queue**: Filter pills (all / pending / critical / approved / rejected). Reminder badges, escalation badge after 48h.

**Detail**: Requester card → action details → flags (duplicate ref / high-risk / amount-above-threshold) → requester's note → decision footer (Approve · Reject · Request Clarification + note).

### 5.11 Audit Log (`/audit`)

Grouped by day (Today / Yesterday). Filter by today / this week. "before → after" pills when a state changed.

### 5.12 Office Settings (`/settings`)

**Single-page, six cards, auto-save**:
1. Office identity (name AR/EN, logo, CR, tax number)
2. Contact (phone, email, city, address)
3. Bank accounts (multiple)
4. Investment defaults (recycling threshold)
5. Profit distribution policy (3 options)
6. Notifications (channels + quiet hours + alert types)

### 5.13 Office Employees (`/employees`, `/employees/new`, `/employees/[id]`)

**List**: Filter pills (all / active / pending / suspended). Status badges. Search.

**Invite form** (`/new`):
- Personal info card (name, ID, phone, email)
- Free-text **job title** (not derived from a role)
- **Permissions matrix** — 14 actions × 3 states, grouped, with "Load from template" picker
- Submit triggers SMS invite

**Detail**: Editable title + editable matrix per action + "Customized" / "Based on template: X" indicator + bypass-approvals toggle + actions (suspend / reactivate / delete / resend invite).

### 5.14 Subscription (`/subscription`, `/subscription/checkout`)

**Plans page**:
- Trial banner (if applicable) with days remaining + Subscribe-now CTA.
- Duration selector (6 months / 1 year / 2 years) with "Save X%" badges.
- Two plan cards side by side: Basic + Pro (Pro highlighted with subtle ring).
- Each card shows the 4 premium features with ✓ / ✗ marks.
- Per feature: an expandable "How does it actually work?" with a real scenario + a 4-6 step dialogue example (AI ↔ customer ↔ employee).
- Floating "Ask about plans" chat button bottom-end → opens an LLM-powered chat panel.

**Checkout** (`/subscription/checkout?plan=...&duration=...`):
- Order summary card.
- 6 Saudi payment methods in a 2×3 grid: Mada (default) · Apple Pay · STC Pay · Visa · Mastercard · Bank Transfer.
- Each method shows logo, name, one-line hint.
- "Pay X SAR" button.
- After submit: success card with receipt-style summary + ZATCA QR code.

### 5.15 Reports (`/reports`)

Four sections:
- 3 KPI cards (scheduled / collected / collection rate).
- Aging report table with color-coded buckets (current / 1-30 / 31-60 / 61-90 / 90+).
- Investor performance (5 columns).
- Monthly P&L.

### 5.16 Migration journey (`/migration`)

For new offices switching from Excel/paper. Seven sequential steps:
1. Investors
2. Investment Contracts
3. Customers
4. Installment Contracts
5. Receipt Vouchers
6. Payment Vouchers
7. Final Review

Each step (1-6) has:
- A question: "What type of files do you have?"
- 5 options: Excel · PDF · Screenshots from current system · Photos/scans of paper · Manual entry.
- Simulated 1.4s analysis.
- Review table with 3 field states: confirmed / needsReview / missing.
- "Is this the same person?" Yes/No prompts for entity matching.
- Approve / Skip.

Final review: 6 cards (one per type) with record counts, big "Activate" button → celebration screen.

### 5.17 Investor Portal (`/portal/investor/*`)

Simpler shell with 4-5 sidebar items. Capital summary, active investments, profits, statements, simulator, notifications.

### 5.18 Customer Portal (`/portal/customer/*`)

Even simpler. Installment list, payment status, upload proof flow (camera or file), receipt confirmation, contract documents, notifications.

### 5.19 Platform Admin screens (`/admin/*`)

- **Dashboard**: 6 KPIs (total offices · in trial · active subs · expired · suspended · new this month) + recent activity feed.
- **Offices list**: Filter pills by subscription status. Search by name/CR. Per-row: manager, subscription status, days left in trial.
- **Office detail**: Manager info + subscription info + "Current Plan" section + actions (extend trial, suspend, reactivate, change plan).
- **Plans list**: Two cards (Basic + Pro). Each card: features with ✓/✗, 3 prices grid, active badge, Edit button.
- **Plan editor**: Name, description, 4 feature toggles with hints, 3 price inputs, active toggle.
- **Platform employees**: Same UX as office employees — free-text title + 15-action permission matrix + 4 starting templates. Auth role (admin vs staff) is a separate toggle; admin bypasses the matrix.
- **Settings**: Default trial days, auto-suspend days, global announcement, allow self-registration.
- **Audit**: Same shape as office audit.

---

## 6. Critical user journeys

### Journey A — Office registration to first installment
1. Owner opens `/register` → 4-field form (office name, CR, manager name+ID, phone).
2. Verifies OTP → lands on `/dashboard` in TRIAL state (30 days).
3. Optionally starts migration from old system (`/migration`).
4. Adds first employee → assigns title + permissions.
5. Adds first investor → creates investment contract → balance deducted.
6. Adds first customer → creates installment contract → capital deducted from investment.
7. Collection officer accepts first payment → automatic profit distribution.

### Journey B — Trial ends, office subscribes
1. Owner sees "5 days left of trial" banner.
2. Clicks "Subscribe now" → `/subscription`.
3. Compares plans, opens feature cards to read scenarios, asks chat assistant questions.
4. Picks Pro + 2 years.
5. `/subscription/checkout` → picks Mada → pays.
6. Success screen → subscription active, ZATCA invoice generated.

### Journey C — Customer pays installment
1. Customer transfers money to office's bank account.
2. Customer opens `/portal/customer` → uploads receipt photo.
3. (Pro plan) OCR reads amount + sender + date + reference.
4. Office employee opens proof, sees auto-filled fields with validity score.
5. Approves → triggers `automatic profit distribution` event → investor balance increases, office profit counter advances.

### Journey D — Investor checks status
1. Investor receives WhatsApp link to portal.
2. Logs in → `/portal/investor` → sees balance, active contracts, realized profit.
3. Opens statement → can use simulator to model a new investment.

---

## 7. Cross-cutting business rules that affect UI

| Rule | UI implication |
|---|---|
| Permission matrix is **tri-state** | Every action button needs 3 visual states: enabled / "needs approval" badge / hidden |
| Profit policy is **snapshotted** on each distribution event | Historical events show the policy at the time, not the current policy |
| `bypassApprovals` flag on employee | Shown as a checkbox on the detail page, opens approval-bypass for that employee only |
| Subscription `planSnapshot` | Office's invoice always shows the price at subscription time, not the current plan price |
| Office trial banner | Appears on dashboard top until subscribed; disappears after subscription |
| Migration banner | Appears on Operations Center until the journey is completed |
| Critical actions banner | Red bar at top of Operations Center, only when triggered |
| Internal investor = 0-profit investor | UI shows same investor screens, but profit fields collapse to one field |
| Latin digits in money | Apply `dir="ltr"` to all numeric spans inside Arabic UI |

---

## 8. What's NOT in scope (do not design for these)

- General Ledger / Chart of Accounts
- Double-entry bookkeeping
- Income Statement / Balance Sheet / Cash Flow statements
- Per-contract profit-distribution overrides (it's only office + investor level)
- Multiple balance categories (available / pending / withdrawable) — investors see ONE balance
- SIMAH / Yakeen / SAMA integrations (out of scope per product owner)
- Accounting system integrations (SAP / Oracle)

---

## 9. Beta-deferred features (UI ready, integrations later)

These four features are sold in the Pro plan and have full UI, but their backend integrations are postponed to Beta:

| Feature | UI exists for | Mock behavior in MVP |
|---|---|---|
| **AI assistant on WhatsApp** | Reading customer messages, validating payment proofs | Returns plausible mock validity scores |
| **OCR** | Receipt fields auto-fill, ID document scanning | Returns mock extracted fields with 0.85 confidence |
| **WhatsApp messages** | "Send reminder" buttons throughout the app | Logs to console; UI shows "sent" |
| **SMS messages** | OTP delivery, short reminders | Logs to console; UI shows "sent" |

Design should treat these as **fully functional** — the integration is invisible to the end user.

---

## 10. Existing visual evidence

All visual states are captured in PDFs and screenshots, organized by sprint:

| Folder | Contains |
|---|---|
| `docs/review/sprint2/` to `sprint12/` | Original prototype screens — investors, customers, contracts, vouchers, dashboard, settings, migration |
| `docs/review/sprint13-auth-entry/` | Registration + login + welcome |
| `docs/review/sprint14-system-admin/` | Platform admin screens |
| `docs/review/sprint15-office-employees/` | Employees (free title + matrix) |
| `docs/review/sprint16-subscriptions/` | Admin plan management |
| `docs/review/sprint17-subscription-flow/` | Office subscription page + chat + checkout |
| `docs/review/sprint26-reports/` | Reports module |

Each folder has a `README.md` documenting the sprint goal + a PDF with captioned screenshots.

---

## 11. Where designers add value

Areas where design polish would have the highest impact:

1. **Operations Center polish** — the headline screen the office owner sees most often. Currently functional but could be more emotionally engaging.
2. **Empty states** — many screens lack thoughtful empty states for first-day users.
3. **Mobile-first review** — most screens render on mobile but weren't designed mobile-first. Worth a pass.
4. **Onboarding tour** — there's no in-app tour for new offices. A 4-5 step coachmark walkthrough would help adoption.
5. **Investor & Customer portals** — these are the simplest screens but reach the largest audience. They deserve more love than the operational screens.
6. **Trust signals** — security badges, "your data is in KSA", "your office is one of N active offices" type micro-copy.
7. **Dark mode pass** — light mode is polished; dark mode is functional but not refined.
8. **Print stylesheets** — vouchers and reports need print-friendly versions.

---

## 12. Reference documents (in this repo)

| Document | Purpose |
|---|---|
| `docs/Muqsit_BRS_v1.0.md` | Detailed BRS for engineers (1,258 lines) |
| `docs/Muqsit_TDD_v1.0.md` | Technical design — architecture, deployment, integrations |
| `docs/Muqsit_BRD_v1.0.docx` | Original BRD (Sprints 2-12) |
| `docs/DEPLOY_CHECKLIST.md` | Step-by-step deployment guide |
| `apps/web/src/lib/i18n/dictionaries.ts` | Every UI string in AR + EN |
| `apps/web/src/lib/mock/types.ts` | Complete data model (TypeScript) |

---

## 13. Glossary (for translators / designers)

| Arabic | English | Note |
|---|---|---|
| مكتب التقسيط | Installment office | The customer of this platform |
| مدير المكتب | Office manager / owner-operator | The primary user |
| موظف المكتب | Office employee | Has a free-text job title |
| المستثمر الداخلي | Internal investor | The office funding its own purchases (zero-profit-share investor) |
| المستثمر الخارجي | External investor | Person/entity funding the office for a share of profit |
| عقد استثمار | Investment contract | Agreement between office and investor about capital + profit split |
| عقد تقسيط | Installment contract | Sale of goods to a customer on installment, funded by an investment contract |
| قيمة كاش | Cash price | What the office paid the supplier for the goods |
| قيمة تقسيطًا | Installment price | Total amount the customer will pay over time |
| الربح | Profit | The difference between installment price and cash price |
| سند قبض | Receipt voucher | A document recording money entering the office |
| سند صرف | Payment voucher | A document recording money leaving the office |
| نوع الطرف | Party type | One of: investor / customer / other — distinguishes vouchers |
| سياسة المكتب أولاً | Office-first policy | Profit distribution: each installment fills office's profit first |
| سياسة المستثمر أولاً | Investor-first policy | Inverse |
| سياسة بالتساوي | Proportional policy | Each installment split immediately |
| إعادة التشغيل | Recycling | Creating a new investment contract from investor's accumulated balance |
| رصيد المستثمر | Investor balance | The single number an investor sees — what's currently held for them at the office |
| الباقة الأساسية | Basic plan | No premium features |
| الباقة الاحترافية | Pro plan | All four premium features |
| المسمى الوظيفي | Job title | Free-text label on an employee (decoupled from permissions) |
| المصفوفة | Permission matrix | The table of 14 actions × 3 states per employee |

---

*Document version: 1.0 · Sprint 28-aligned · Last updated: 2026-06-21*
*For technical implementation details, see `Muqsit_BRS_v1.0.md` and `Muqsit_TDD_v1.0.md` in the same folder.*
