import { ok, paginate, parseListQuery } from "@/lib/api/respond";
import { searchByFields, stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);
  let items = stores.offices.list();

  if (query.filter && query.filter !== "all") {
    items = items.filter((o) => o.subscriptionStatus === query.filter);
  }

  items = searchByFields(items, query.q ?? "", ["name", "cr", "managerName"]);
  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}
