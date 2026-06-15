import { fail, noContent, notFound, ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import type { InstallmentContract } from "@/lib/mock/types";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = stores.installmentContracts.find(id);
  if (!item) return notFound("InstallmentContract", id);
  return ok(item);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let patch: Partial<InstallmentContract>;
  try {
    patch = (await req.json()) as Partial<InstallmentContract>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const next = stores.installmentContracts.update(id, patch);
  if (!next) return notFound("InstallmentContract", id);
  return ok(next);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!stores.installmentContracts.remove(id))
    return notFound("InstallmentContract", id);
  return noContent();
}
