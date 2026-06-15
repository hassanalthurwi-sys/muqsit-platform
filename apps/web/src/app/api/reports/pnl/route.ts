import { ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import { pnlByMonth } from "@/lib/reports/aggregations";
import type { ProfitDistribution } from "@/lib/mock/types";

export const runtime = "nodejs";

export async function GET() {
  // Sprint 19 replaces this with a Prisma query on ProfitDistribution.
  const distributions: ProfitDistribution[] = [];
  return ok(pnlByMonth(stores.receipts.list(), distributions));
}
