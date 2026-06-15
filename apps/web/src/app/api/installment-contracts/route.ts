import { ok, paginate, parseListQuery } from "@/lib/api/respond";
import { searchByFields, stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);
  const customerId = url.searchParams.get("customerId");
  const investmentContractId = url.searchParams.get("investmentContractId");
  const status = url.searchParams.get("status");

  let items = stores.installmentContracts.list();
  if (customerId) items = items.filter((c) => c.customerId === customerId);
  if (investmentContractId)
    items = items.filter((c) => c.investmentContractId === investmentContractId);
  if (status) items = items.filter((c) => c.status === status);

  items = searchByFields(items, query.q ?? "", ["number", "productType"]);
  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}
