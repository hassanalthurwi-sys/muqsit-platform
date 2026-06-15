// GET    /api/investors/[id]  — read
// PUT    /api/investors/[id]  — partial update
// DELETE /api/investors/[id]  — remove

import { fail, noContent, notFound, ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import type { Investor } from "@/lib/mock/types";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const investor = stores.investors.find(id);
  if (!investor) return notFound("Investor", id);
  return ok(investor);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let patch: Partial<Investor>;
  try {
    patch = (await req.json()) as Partial<Investor>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const next = stores.investors.update(id, patch);
  if (!next) return notFound("Investor", id);
  return ok(next);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ok_ = stores.investors.remove(id);
  if (!ok_) return notFound("Investor", id);
  return noContent();
}
