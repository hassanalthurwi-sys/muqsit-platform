import { fail, noContent, notFound, ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import type { Employee } from "@/lib/mock/types";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = stores.employees.find(id);
  if (!item) return notFound("Employee", id);
  return ok(item);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let patch: Partial<Employee>;
  try {
    patch = (await req.json()) as Partial<Employee>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const next = stores.employees.update(id, patch);
  if (!next) return notFound("Employee", id);
  return ok(next);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!stores.employees.remove(id)) return notFound("Employee", id);
  return noContent();
}
