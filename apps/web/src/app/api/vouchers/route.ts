// Unified vouchers endpoint — type=receipt|payment.
// GET /api/vouchers?type=receipt&investorId=...&customerId=...

import { fail, ok, paginate, parseListQuery } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);
  const type = url.searchParams.get("type") ?? "receipt";
  const investorId = url.searchParams.get("investorId");
  const customerId = url.searchParams.get("customerId");
  const partyType = url.searchParams.get("partyType");

  if (type !== "receipt" && type !== "payment") {
    return fail("BAD_REQUEST", "type must be 'receipt' or 'payment'");
  }

  const source: { investorId?: string; customerId?: string; partyType: string }[] =
    type === "receipt" ? stores.receipts.list() : stores.payments.list();
  let items = source;
  if (investorId) items = items.filter((v) => v.investorId === investorId);
  if (customerId) items = items.filter((v) => v.customerId === customerId);
  if (partyType) items = items.filter((v) => v.partyType === partyType);

  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}
