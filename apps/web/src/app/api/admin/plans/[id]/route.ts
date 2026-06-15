import { fail, notFound, ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import type { SubscriptionPlan } from "@/lib/mock/types";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const item = stores.plans.find(id);
  if (!item) return notFound("SubscriptionPlan", id);
  return ok(item);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  let patch: Partial<SubscriptionPlan>;
  try {
    patch = (await req.json()) as Partial<SubscriptionPlan>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const next = stores.plans.update(id, patch);
  if (!next) return notFound("SubscriptionPlan", id);
  return ok(next);
}
