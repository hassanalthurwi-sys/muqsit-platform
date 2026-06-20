#!/usr/bin/env bash
# Muqsit — one-shot local setup.
# Usage: bash scripts/setup.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

step() { echo; echo "════════ $* ════════"; }
ok()   { echo "  ✓ $*"; }
warn() { echo "  ⚠ $*"; }

step "1/6  Tool versions"
node --version
pnpm --version
docker --version 2>/dev/null || warn "docker not installed — Postgres step will be skipped"

step "2/6  Install dependencies"
pnpm install --frozen-lockfile
ok "dependencies installed"

step "3/6  Start Postgres (docker compose)"
if command -v docker >/dev/null 2>&1; then
  docker compose up -d postgres
  echo "  waiting for postgres to be healthy..."
  for i in {1..20}; do
    if docker compose ps postgres --format json 2>/dev/null | grep -q '"Health":"healthy"'; then
      ok "postgres healthy"
      break
    fi
    sleep 1
  done
else
  warn "docker not available — use Neon/Supabase or a system Postgres"
fi

step "4/6  Local environment"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  # Generate AUTH_SECRET
  if command -v openssl >/dev/null 2>&1; then
    SECRET="$(openssl rand -base64 32)"
    # macOS sed needs '' before -i; use perl for portability
    perl -i -pe "s|AUTH_SECRET=.*|AUTH_SECRET=$SECRET|" .env.local
    ok "generated AUTH_SECRET in .env.local"
  else
    warn "openssl not found — set AUTH_SECRET manually in .env.local"
  fi
else
  ok ".env.local already exists — skipping"
fi

step "5/6  Prisma — generate + migrate + seed"
export DATABASE_URL="postgresql://muqsit:muqsit@localhost:5432/muqsit?schema=public"
pnpm --filter @muqsit/database db:generate
pnpm --filter @muqsit/database exec prisma migrate deploy
pnpm --filter @muqsit/database db:seed
ok "schema applied + seed data loaded"

step "6/6  Health check (type-check + build)"
pnpm --filter @muqsit/web type-check
ok "type-check passed"

echo
echo "════════════════════════════════════════════════════════════"
echo "  Setup complete. Start the dev server:"
echo
echo "    pnpm --filter @muqsit/web dev"
echo
echo "  Open http://localhost:3000"
echo "════════════════════════════════════════════════════════════"
