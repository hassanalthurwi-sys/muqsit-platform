import { ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import { investorPerformance } from "@/lib/reports/aggregations";

export const runtime = "nodejs";

export async function GET() {
  return ok(
    investorPerformance(stores.investors.list(), stores.investmentContracts.list()),
  );
}
