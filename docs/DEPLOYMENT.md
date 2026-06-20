# Muqsit Platform — Deployment Guide

Step-by-step setup for the three environments defined in BRS §9.7
and TDD §16.

| Environment | Branch | Domain | Database |
|---|---|---|---|
| **Test** | `main` | `test.muqsit.sa` | `MUQSIT_TEST_DB` |
| **UAT** | `uat` | `uat.muqsit.sa` | `MUQSIT_UAT_DB` |
| **Live** | `production` | `muqsit.sa` | `MUQSIT_PROD_DB` |

---

## 1. Provision PostgreSQL (per environment)

Three independent databases — one per environment. Recommended: one
Neon project with three branches (each branch = isolated database).

### Option A — Vercel Postgres

1. Vercel dashboard → **Storage → Create Database → Postgres**.
2. Region: `iad1` (closest reliable region for KSA latency).
3. After creation, Vercel exposes `DATABASE_URL` automatically.
4. Repeat for each of the three environments OR set the env var
   manually per environment.

### Option B — Neon (recommended, supports branches)

1. https://neon.tech → **Create project** `muqsit`.
2. Region: `aws-eu-central-1` (Frankfurt) — ≤ 80ms to KSA.
3. **Branches** → create `test`, `uat`, `production`.
4. Each branch has its own connection string. Save them as:
   - `MUQSIT_TEST_DB` (GitHub secret + Vercel Test env)
   - `MUQSIT_UAT_DB` (GitHub secret + Vercel UAT env)
   - `MUQSIT_PROD_DB` (GitHub secret + Vercel Live env)

### Option C — Supabase

Same approach as Neon. Three projects, three connection strings.

---

## 2. Initialize each database

For each environment (Test → UAT → Live), run from your workstation:

```bash
cd packages/database

# Test
DATABASE_URL=<MUQSIT_TEST_DB> npx prisma migrate deploy
DATABASE_URL=<MUQSIT_TEST_DB> pnpm db:seed

# UAT
DATABASE_URL=<MUQSIT_UAT_DB> npx prisma migrate deploy
DATABASE_URL=<MUQSIT_UAT_DB> pnpm db:seed

# Live  (only after UAT sign-off)
DATABASE_URL=<MUQSIT_PROD_DB> npx prisma migrate deploy
DATABASE_URL=<MUQSIT_PROD_DB> pnpm db:seed
```

After CI/CD is wired up (step 5), the migrate step runs
automatically in the deploy workflows.

---

## 3. Vercel project setup

1. **vercel.com → New Project** → import
   `hassanalthurwi-sys/muqsit-platform`.
2. **Settings → Git → Production Branch**: change from `main` to
   `production`.
3. **Settings → Domains**:
   - `muqsit.sa` → branch `production`
   - `test.muqsit.sa` → branch `main`
   - `uat.muqsit.sa` → branch `uat`
4. Update DNS at the registrar (CNAME → `cname.vercel-dns.com`).

### Environment variables (per environment)

In **Settings → Environment Variables**, add each variable and
select which environments it applies to.

| Variable | Test | UAT | Live |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://test.muqsit.sa` | `https://uat.muqsit.sa` | `https://muqsit.sa` |
| `NEXT_PUBLIC_ENV` | `test` | `uat` | `production` |
| `DATABASE_URL` | Test branch URL | UAT branch URL | Prod branch URL |
| `AUTH_SECRET` | unique 32-char | unique 32-char | unique 32-char |
| `MUQSIT_VAT_NUMBER` | `300000000000003` | `300000000000003` | real number |

### Beta-phase variables (leave unset for now)

These trigger the built-in mock providers when unset, so you can
ship MVP without them:

- `ANTHROPIC_API_KEY` (Smart chat + OCR)
- `WHATSAPP_PHONE_ID`, `WHATSAPP_TOKEN`, `WHATSAPP_VERIFY_TOKEN`
- `UNIFONIC_APP_SID`, `UNIFONIC_SENDER`
- `MOYASAR_API_KEY`, `MOYASAR_WEBHOOK_SECRET`

Add them only when entering Beta.

---

## 4. GitHub Secrets

`Settings → Secrets and variables → Actions → New repository secret`

| Secret | Source |
|---|---|
| `VERCEL_TOKEN` | Vercel account → Settings → Tokens |
| `VERCEL_ORG_ID` | `cat .vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | Same as above |
| `UAT_DATABASE_URL` | The UAT Postgres connection string |
| `PROD_DATABASE_URL` | The Live Postgres connection string |

---

## 5. GitHub Environment Protection Rules

For the `production` environment:

1. `Settings → Environments → New environment → production`.
2. Enable **Required reviewers** → add Engineering Lead +
   Product Owner.
3. Enable **Wait timer** → 0 minutes (so the deploy waits for
   manual approval, not on a clock).
4. **Deployment branches** → limit to `production` only.

Repeat for `uat`:
- Required reviewers: Engineering Lead only.
- Deployment branches: `uat`.

For `test`: no protection — deploys automatically on `main` push.

---

## 6. Promotion flow

```
Developer Branch
    │
    ▼
PR → CI passes
    │
    ▼
merge to main → auto-deploy → ▶ TEST (test.muqsit.sa)
    │
    │ QA passes on Test?
    ▼
tag rc-2026.06.01 → ▶ UAT (uat.muqsit.sa)
    │
    │ Product owner signs off on UAT?
    ▼
tag v1.0.0 → 2-person approval → ▶ LIVE (muqsit.sa)
```

### Commands

```bash
# Promote to UAT (creates an annotated tag and pushes it)
git checkout main
git pull
git tag -a rc-2026.06.01 -m "RC: subscription flow + reports"
git push origin rc-2026.06.01

# Promote to Live
git tag -a v1.0.0 -m "Release: MVP launch"
git push origin v1.0.0
```

---

## 7. Hotfix policy

Critical production bug found:

1. Branch from the live tag: `git checkout -b hotfix/x v1.0.0`
2. Fix, test locally, PR → CI passes → merge to `main`.
3. Tag `hotfix-x.y.z` → run deploy-live workflow with 2-person
   approval. UAT may be skipped only for security incidents.
4. Cherry-pick the fix into any open feature branches.

---

## 8. Local development quick-start

```bash
# 1. Clone + install
git clone https://github.com/hassanalthurwi-sys/muqsit-platform.git
cd muqsit-platform
pnpm install

# 2. Start Postgres locally
docker compose up -d postgres

# 3. Environment
cp .env.example .env.local
# Edit .env.local — set AUTH_SECRET, leave others on defaults

# 4. Generate Prisma client + apply migrations + seed
cd packages/database
npx prisma generate
DATABASE_URL=postgresql://muqsit:muqsit@localhost:5432/muqsit \
  npx prisma migrate dev --name init
DATABASE_URL=postgresql://muqsit:muqsit@localhost:5432/muqsit \
  pnpm db:seed

# 5. Run the app
cd ../..
pnpm --filter @muqsit/web dev
# → http://localhost:3000
```

When you don't have Postgres locally, the app keeps working using
the Sprint 18 in-memory mock store. Just skip steps 2 and 4.

---

## 9. Beta-phase activation (later)

When the team is ready to activate the deferred integrations:

| Step | What to do |
|---|---|
| **Anthropic** | https://console.anthropic.com → create key → set `ANTHROPIC_API_KEY` for UAT then Live |
| **WhatsApp** | Meta Business Manager → onboard phone number → save `WHATSAPP_*` |
| **Unifonic** | Apply for sender ID → save `UNIFONIC_*` |
| **Moyasar** | Merchant onboarding → save `MOYASAR_*` |

Each integration has a built-in sandbox fallback, so the app keeps
working between "key issued" and "production traffic switched on".

---

*Last updated: 2026-06-15 · After Sprint 27 (MVP hardening).*
