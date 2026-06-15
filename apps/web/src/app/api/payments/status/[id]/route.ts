import { ok } from "@/lib/api/respond";
import { fetchPaymentStatus } from "@/lib/integrations/payments";

export const runtime = "nodejs";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const res = await fetchPaymentStatus(id);
  return ok(res);
}
