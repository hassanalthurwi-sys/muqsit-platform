import { fail, noContent, notFound, ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import type { OfficeAccount } from "@/lib/mock/types";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = stores.offices.find(id);
  if (!item) return notFound("OfficeAccount", id);
  return ok(item);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let patch: Partial<OfficeAccount>;
  try {
    patch = (await req.json()) as Partial<OfficeAccount>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const next = stores.offices.update(id, patch);
  if (!next) return notFound("OfficeAccount", id);
  return ok(next);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!stores.offices.remove(id)) return notFound("OfficeAccount", id);
  return noContent();
}
