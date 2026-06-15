import { ok, paginate, parseListQuery } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);
  let items = stores.plans.list().sort((a, b) => a.displayOrder - b.displayOrder);

  if (query.filter === "active") items = items.filter((p) => p.active);
  if (query.filter === "inactive") items = items.filter((p) => !p.active);

  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}
