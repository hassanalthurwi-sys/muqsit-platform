# Sprint 27 — MVP Hardening

Closes the gap between "Phase 1 sprints landed" and "first office can
use the system". No new product features; this sprint ships:

- The deployment guide a new engineer can follow without context.
- The CI/CD pipeline that runs every PR and every promotion.
- `.env.example` documenting every variable and what happens when
  it's missing.
- A formal record in BRS + TDD that **OCR, WhatsApp, SMS, and
  Payments are deferred to Beta**, with mock providers covering
  every UI flow until then.

## Decision recorded
> **2026-06-15** — Product owner direction:
> *Continue building the core product. Defer OCR, WhatsApp,
> SMS, and Moyasar until Beta. Keep the architecture ready;
> use mock implementations for now.*

This sprint makes that decision durable across the docs and the
CI/CD setup.

## Deliverables

### Deployment infrastructure
- `.env.example` rewritten — every variable annotated `[MVP]` or
  `[BETA]`, with comments explaining what each unset variable falls
  back to (mock provider / dev-code surfaced in API response /
  console log).
- `docs/DEPLOYMENT.md` — end-to-end guide from "fresh Vercel
  account" to "first office on `muqsit.sa`". Covers Postgres
  options (Vercel/Neon/Supabase), per-env variables, GitHub secrets,
  environment protection rules, promotion flow, hotfix policy, and
  Beta-phase activation steps.

### CI/CD (`.github/workflows/`)
- `ci.yml` — runs on every PR + push to `main`/`uat`/`production`:
  install → prisma generate → type-check → lint → build.
- `deploy-test.yml` — auto-deploys `main` to `test.muqsit.sa`.
- `deploy-uat.yml` — triggered by `rc-*` tags. Runs
  `prisma migrate deploy` against the UAT database before the
  Vercel deploy.
- `deploy-live.yml` — triggered by `v*.*.*` tags. Requires the
  `production` GitHub Environment to approve. Snapshots DB
  (placeholder for Neon/Vercel snapshot CLI), runs migrations,
  builds + deploys with `--prod`.

### Docs updates
- `Muqsit_BRS_v1.0.md` v1.0.3:
  - New §12.د.1 — formal Beta-deferred integrations table.
  - Changelog entry.
- `Muqsit_TDD_v1.0.md` v1.0.3:
  - New §18.2.1 — mock-vs-live provider table per integration file
    in `lib/integrations/`.
  - Activation policy: "inject API key → flip provider, no UI or
    business-layer change".

## Mock providers — verified working

| Provider | File | Mock behaviour |
|---|---|---|
| OCR (receipts) | `lib/integrations/ocr.ts` → `readReceipt()` | Returns `{amount: 2500, senderName, transferDate, reference, bankName, confidence: 0.85, provider: "sandbox"}` |
| OCR (IDs) | `lib/integrations/ocr.ts` → `readIdentity()` | Returns `{name, nationalId, dob, nationality, documentType, confidence: 0.85, provider: "sandbox"}` |
| WhatsApp | `lib/integrations/whatsapp.ts` → `sendWhatsApp()` | Logs payload, returns `{ok: true, messageId: "sandbox-…", provider: "sandbox"}` |
| SMS | `lib/integrations/sms.ts` → `sendSms()` | Logs payload, returns `{ok: true, messageId: "sandbox-…", provider: "sandbox"}` |
| Payments | `lib/integrations/payments.ts` → `createPaymentIntent()` | Returns `{ok: true, id: "sandbox-…", status: "paid", provider: "sandbox"}` |
| LLM Chat | `app/api/chat/route.ts` → `fallbackReply()` | Intent-matched canned Arabic answers per the Sprint 17 system prompt |
| Auth OTP | `app/api/auth/otp/route.ts` | Returns the code as `devCode` in the API response when `NODE_ENV !== "production"` |

End-to-end flows that work without any external service:
1. Office manager registers → trial activated.
2. Office invites employee → "SMS sent" (logged), employee accepts.
3. Customer payment proof uploaded → OCR returns mock fields,
   employee reviews + approves.
4. Office picks Pro plan → Moyasar checkout → "paid" → subscription
   active → invoice issued with ZATCA QR.
5. Smart-chat answers questions about plans/features.

## Roadmap update

| Sprint | Was | Now |
|---|---|---|
| 21 — WhatsApp | Live integration | **Code shipped, sandbox-only until Beta** |
| 22 — SMS | Live integration | **Code shipped, sandbox-only until Beta** |
| 23 — OCR | Live integration | **Code shipped, sandbox-only until Beta** |
| 24 — Payments | Live integration | **Code shipped, sandbox-only until Beta** |
| 25 — ZATCA | Phase 1 | **No change — VAT can use placeholder for Test/UAT** |
| 26 — Reports | Built | **No change** |
| **27 — MVP Hardening** | — | **Deployment infra + CI/CD + docs (this sprint)** |
| 28 — Beta integrations | Was Sprint 27+ for mobile | **Activate OCR + WhatsApp + SMS + Payments with real keys** |
| 29+ — Mobile apps | Phase 2 | **Phase 2 — unchanged** |

## Verification

| Check | Result |
|---|---|
| `pnpm --filter @muqsit/web type-check` | ✅ |
| `pnpm --filter @muqsit/web build` | ✅ |
| BRS / TDD updated to v1.0.3 | ✅ |
| Mock providers traced end-to-end | ✅ |

## Stack on top of
```
… → claude/sprint26-reports → claude/sprint27-mvp-hardening ← this sprint
```

## Next
After this sprint, the system is ready for MVP deployment with mock
providers. The natural next steps depend on what's most valuable:

- **MVP launch path**: Provision Postgres → set `DATABASE_URL` and
  `AUTH_SECRET` on Vercel → run `db:seed` → open `muqsit.sa` to
  pilot offices.
- **Continue product work**: build the deferred operational features
  from BRS §12.ج.٢ — Reports enhancements, advanced collections
  workflow, installment calculator, lending pipeline.
- **Pre-Beta prep**: documents needed to onboard with Moyasar /
  Meta / Unifonic so the activation in Sprint 28 is fast.
