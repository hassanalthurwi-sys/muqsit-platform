# Sprint 4 — Operations · Permissions · Notifications · Approvals · Audit · Portals (prototype)

Static review assets for the Sprint 4 prototype on
`claude/sprint4-operations` (stacked on `claude/sprint3-installments`).
**No backend, no APIs, no real notifications, no authentication, no deployment.**
Not merged to `main`.

## What's covered

### Operations Center (`/operations`)
- Critical actions banner (duplicate-reference proofs, defaulted customers, low-capital investors).
- Five work-queue tiles: overdue installments · pending approvals · proofs to review · low-confidence OCR · WhatsApp follow-ups.
- Low-remaining-capital investors section + investment contracts expiring within 30 days.
- Quick-pick row for critical pending approvals.

### Notifications
- TopBar bell with unread count badge + 5-most-recent dropdown.
- Full `/notifications` page with filters (All · Unread · Critical · Reminders), per-row mark-read / dismiss, deep links to related entities.

### Approvals
- `/approvals` queue with search, filters (All · Pending · Critical · Approved · Rejected), reminder badges, escalation badge after 48h.
- `/approvals/[id]` review screen — requester card, action details, flags, requester's note, decision footer with Approve · Reject · Request clarification + employee note. Decision persists via localStorage.

### Roles & permissions
- `/permissions` list of preset roles (Office Manager · Employee · Collections Officer · Accountant), each with description, one-line action summary, member chips, Rename / Duplicate actions.
- `/permissions/[id]` role detail with 3-state toggles (Allow · Require approval · Deny) grouped by domain (Contracts · Payments · Customers · Investors · System). Trusted-employee bypass flag surfaces here.

### Audit log
- `/audit` operational diary: who, what, when, on whom. Grouped by day with Today / Yesterday labels. Filter by Today / This week. Before → After pills when state changes.

### Portal previews
- `/portal/investor` stub: investment summary · active contracts · profit distribution · capital recycling · statements.
- `/portal/customer` stub: installment summary · remaining balance · upload proof · contract documents · notifications.
- Both clearly marked "Preview — not active until a later phase".

### Sidebar IA additions
- New **Administration** group (Approvals · Permissions · Audit log).
- New **Portals** group (Investor portal · Customer portal).
- Operations Center added as the first item in Operations.

### List-page polish
- Search input added to Customers, Approvals, Notifications, Audit.
- Existing filter pills and status badges preserved.

## Files

| File | Description |
| --- | --- |
| `sprint4.pdf` | Paginated PDF — cover + 13 captioned screenshots |
| `01-operations-ar-light.png` | Operations Center (desktop AR light) |
| `02-approvals-list-ar-light.png` | Approvals queue with reminder + age badges |
| `03-approval-detail-ar-light.png` | Critical approval review with duplicate flag |
| `05-notifications-page-ar-light.png` | Notifications center full page |
| `06-permissions-list-ar-light.png` | Roles list |
| `07-role-detail-ar-light.png` | Role detail with 3-state permission toggles |
| `08-audit-ar-light.png` | Audit log timeline |
| `09-portal-investor-ar-light.png` | Investor portal preview |
| `10-portal-customer-ar-light.png` | Customer portal preview |
| `11-operations-en-light.png` | Operations Center (English LTR) |
| `12-operations-ar-dark.png` | Operations Center (AR dark) |
| `13-operations-mobile-ar.png` | Operations Center (mobile) |
| `14-approvals-mobile-ar.png` | Approvals queue (mobile) |

## Mock pool

- 5 employees across 4 preset roles. One employee carries the "trusted — bypass approvals" flag.
- 7 approval requests (5 pending: 2 critical + 2 normal + 1 low; 2 historic: 1 approved + 1 rejected).
- 10 notifications mixing all 8 types and all 3 priorities; 4 unread.
- 15 audit log entries across ~10 days.
- All 4 preset roles include realistic per-action defaults aligned with the small-office philosophy.

## Verification

| Check | Result |
| --- | --- |
| `pnpm type-check` | ✅ |
| `pnpm --filter @muqsit/web lint` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ 32 routes |
| Visual screenshots | ✅ 14 captured (including bell dropdown attempt) |
