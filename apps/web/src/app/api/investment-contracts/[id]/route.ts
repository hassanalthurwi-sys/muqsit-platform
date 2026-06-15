import { fail, noContent, notFound, ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import type { InvestmentContract } from "@/lib/mock/types";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = stores.investmentContracts.find(id);
  if (!item) return notFound("InvestmentContract", id);
  return ok(item);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let patch: Partial<InvestmentContract>;
  try {
    patch = (await req.json()) as Partial<InvestmentContract>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const next = stores.investmentContracts.update(id, patch);
  if (!next) return notFound("InvestmentContract", id);
  return ok(next);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!stores.investmentContracts.remove(id)) return notFound("InvestmentContract", id);
  return noContent();
}
