import { ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";
import { agingReport } from "@/lib/reports/aggregations";

export const runtime = "nodejs";

export async function GET() {
  const contracts = stores.installmentContracts.list();
  const installments = contracts.flatMap((c) => c.schedule ?? []);
  return ok(agingReport(contracts, installments));
}
