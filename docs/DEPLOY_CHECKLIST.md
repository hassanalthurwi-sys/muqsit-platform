# Muqsit — Production Deploy Checklist

Hands-on, tickable checklist that takes you from "code complete" to
"running on `test.muqsit.sa`" in ~90 minutes. UAT and Live are the
same workflow, repeated.

> Companion to `docs/DEPLOYMENT.md` (the reference) and
> `scripts/setup.sh` (local dev).

---

## Stage 1 — Pre-flight (10 min)

- [ ] **Domain registered**: `muqsit.sa` registered and DNS access
      confirmed.
- [ ] **GitHub access**: confirm push permissions to
      `hassanalthurwi-sys/muqsit-platform`.
- [ ] **Vercel account**: signed in at `vercel.com`. Team plan
      (free) is enough to start; upgrade when you exceed the free
      tier.
- [ ] **Postgres provider chosen**: pick one
      (Neon recommended — supports DB branches for the three
      environments).

---

## Stage 2 — Generate secrets (5 min)

Run locally:

```bash
# AUTH_SECRET — Run 3 times, save outputs for test/uat/prod.
openssl rand -base64 32
openssl rand -base64 32
openssl rand -base64 32
```

Save them somewhere secure (1Password, Vercel env vars). Don't
commit. Don't reuse across environments.

- [ ] `AUTH_SECRET_TEST` generated.
- [ ] `AUTH_SECRET_UAT` generated.
- [ ] `AUTH_SECRET_PROD` generated.

---

## Stage 3 — Provision Postgres (15 min)

### Neon (recommended)

- [ ] Create project `muqsit` → region `aws-eu-central-1`
      (Frankfurt — best KSA latency on free tier).
- [ ] **Branches** → `main` already exists. Create `uat` and
      `production` branches off of `main`.
- [ ] Copy three connection strings (Connection details → Pooler
      URI):
  - `DATABASE_URL_TEST` ← `main` branch
  - `DATABASE_URL_UAT` ← `uat` branch
  - `DATABASE_URL_PROD` ← `production` branch
- [ ] Save them alongside the AUTH_SECRETs.

### Apply schema to all three

From your workstation:

```bash
cd packages/database

DATABASE_URL=<TEST_URL> npx prisma migrate deploy
DATABASE_URL=<TEST_URL> pnpm db:seed

DATABASE_URL=<UAT_URL> npx prisma migrate deploy
DATABASE_URL=<UAT_URL> pnpm db:seed

DATABASE_URL=<PROD_URL> npx prisma migrate deploy
# Do NOT seed prod yet — wait until first office onboards.
```

- [ ] Test schema applied + seeded.
- [ ] UAT schema applied + seeded.
- [ ] Production schema applied (no seed).

---

## Stage 4 — Vercel project (15 min)

- [ ] `vercel.com → Add New → Project → Import` →
      `hassanalthurwi-sys/muqsit-platform`.
- [ ] Framework preset: **Next.js** (auto-detected).
- [ ] Root directory: `apps/web`.
- [ ] Build command: leave default (uses `vercel.json` we ship).
- [ ] Click **Deploy** — first deploy uses defaults, will succeed
      with placeholders. You'll fix env vars next.
- [ ] **Settings → Git → Production Branch**: change from `main`
      to `production`.

### Domains

- [ ] **Settings → Domains** → add `muqsit.sa`. Vercel shows DNS
      records — set them at your registrar (A or CNAME).
- [ ] Add `test.muqsit.sa` → assign to branch `main`.
- [ ] Add `uat.muqsit.sa` → assign to branch `uat`.
- [ ] DNS propagates in 5–30 min. Wait, then verify all three
      `https://...` URLs return Next.js 404 page (not a "domain not
      configured" page).

### Environment variables

In `Settings → Environment Variables`, add each row below.
Vercel asks "which environments" — match the column:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://test.muqsit.sa` | Preview (target: `main`) |
| `NEXT_PUBLIC_APP_URL` | `https://uat.muqsit.sa` | Preview (target: `uat`) |
| `NEXT_PUBLIC_APP_URL` | `https://muqsit.sa` | Production |
| `NEXT_PUBLIC_ENV` | `test` | Preview (`main`) |
| `NEXT_PUBLIC_ENV` | `uat` | Preview (`uat`) |
| `NEXT_PUBLIC_ENV` | `production` | Production |
| `DATABASE_URL` | `<TEST_URL>` | Preview (`main`) |
| `DATABASE_URL` | `<UAT_URL>` | Preview (`uat`) |
| `DATABASE_URL` | `<PROD_URL>` | Production |
| `AUTH_SECRET` | `<TEST_SECRET>` | Preview (`main`) |
| `AUTH_SECRET` | `<UAT_SECRET>` | Preview (`uat`) |
| `AUTH_SECRET` | `<PROD_SECRET>` | Production |
| `MUQSIT_VAT_NUMBER` | `300000000000003` | All three (placeholder OK) |

> Note: Vercel's "Preview" scope applies to every preview deploy.
> To pin env vars to specific branches, use the CLI:
> `vercel env add DATABASE_URL preview main` etc.

- [ ] All env vars set for the 3 environments.

### Trigger redeploy

- [ ] Push any commit to `main` → check `test.muqsit.sa` builds.
- [ ] Verify on the live site: `/dashboard` loads, `/admin/plans`
      shows the two seeded plans.

---

## Stage 5 — GitHub Actions setup (10 min)

### Secrets

In `github.com/hassanalthurwi-sys/muqsit-platform → Settings →
Secrets and variables → Actions`:

- [ ] `VERCEL_TOKEN` — from Vercel account → Settings → Tokens.
- [ ] `VERCEL_ORG_ID` — run `vercel link` locally, then
      `cat .vercel/project.json`.
- [ ] `VERCEL_PROJECT_ID` — same as above.
- [ ] `UAT_DATABASE_URL` — for the deploy-uat workflow.
- [ ] `PROD_DATABASE_URL` — for the deploy-live workflow.

### Environments + protection rules

In `Settings → Environments`:

- [ ] Create environment `test` — no protection.
- [ ] Create environment `uat`:
  - Required reviewers: **Engineering Lead**.
  - Deployment branches: `uat` only.
- [ ] Create environment `production`:
  - Required reviewers: **Engineering Lead + Product Owner**.
  - Deployment branches: `production` only.

### Test the pipeline

- [ ] Open a PR with a trivial doc change → confirm CI workflow
      runs green.
- [ ] Merge to `main` → confirm `deploy-test.yml` runs and the
      deploy lands on `test.muqsit.sa`.

---

## Stage 6 — First promotion to UAT (15 min)

- [ ] Smoke-test on `test.muqsit.sa`:
  - [ ] `/register` works end-to-end.
  - [ ] `/employees/new` accepts an invite.
  - [ ] `/admin/plans` shows the seeded plans.
  - [ ] `/subscription` → checkout → success (mock payment).
  - [ ] `/reports` renders the four sections.
- [ ] If green, tag and push:

```bash
git checkout main && git pull
git tag -a rc-2026.06.20 -m "RC: MVP launch candidate"
git push origin rc-2026.06.20
```

- [ ] GitHub workflow `deploy-uat.yml` triggers. Approve when
      prompted.
- [ ] Verify `uat.muqsit.sa` builds and works.
- [ ] Product owner signs off on UAT.

---

## Stage 7 — Promote to Live (10 min)

- [ ] Final smoke-test on UAT.
- [ ] Tag and push the release:

```bash
git tag -a v1.0.0 -m "Release: MVP launch"
git push origin v1.0.0
```

- [ ] `deploy-live.yml` triggers. Engineering Lead approves.
      Product Owner approves.
- [ ] Workflow runs `prisma migrate deploy` against
      `PROD_DATABASE_URL` — confirm zero errors.
- [ ] Vercel deploy lands on `muqsit.sa`.
- [ ] Verify on live:
  - [ ] HTTPS valid (Vercel auto-issues).
  - [ ] `/` loads.
  - [ ] `/admin/plans` shows plans (or empty — production is
        un-seeded by design).
  - [ ] No console errors.

---

## Stage 8 — Pilot the first office (5 min)

- [ ] Open `https://muqsit.sa/register`.
- [ ] Register the first office (manually for now — registration
      flow is auth-stubbed; will fully wire in Beta with real OTP).
- [ ] Seed any reference data (plans already there from migration).
- [ ] Hand off the URL to the pilot office.

---

## What's deferred to Beta

These don't block MVP. They activate by adding env vars when ready:

- [ ] `ANTHROPIC_API_KEY` — Smart chat + OCR live mode.
- [ ] `WHATSAPP_*` — Real WhatsApp delivery.
- [ ] `UNIFONIC_*` — Real SMS delivery.
- [ ] `MOYASAR_*` — Real Moyasar payment processing.

Each one flips its provider from sandbox → live with zero code
change. See `docs/Muqsit_TDD_v1.0.md` §18.2.1.

---

## Rollback (if anything goes wrong on Live)

Two safe paths:

```bash
# 1. Vercel UI: Deployments → previous good → "Promote to Production".
# 2. Or via CLI:
vercel rollback https://muqsit.sa
```

For DB rollback, restore the pre-migration snapshot from your
provider's dashboard (Neon: Branch History → Restore).

---

*Last updated: 2026-06-20 · After Sprint 28 (Deployment Prep).*
