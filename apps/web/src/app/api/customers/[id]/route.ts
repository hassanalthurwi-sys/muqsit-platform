import { fail, noContent, notFound, ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import type { Customer } from "@/lib/mock/types";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = stores.customers.find(id);
  if (!item) return notFound("Customer", id);
  return ok(item);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let patch: Partial<Customer>;
  try {
    patch = (await req.json()) as Partial<Customer>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const next = stores.customers.update(id, patch);
  if (!next) return notFound("Customer", id);
  return ok(next);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!stores.customers.remove(id)) return notFound("Customer", id);
  return noContent();
}
