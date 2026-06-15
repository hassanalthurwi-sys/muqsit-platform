import { ok, paginate, parseListQuery } from "@/lib/api/respond";
import { searchByFields, stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);
  const investorId = url.searchParams.get("investorId");
  const status = url.searchParams.get("status");

  let items = stores.investmentContracts.list();
  if (investorId) items = items.filter((c) => c.investorId === investorId);
  if (status) items = items.filter((c) => c.status === status);

  items = searchByFields(items, query.q ?? "", ["number"]);
  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}
