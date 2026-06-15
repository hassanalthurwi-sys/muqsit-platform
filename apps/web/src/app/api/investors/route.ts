// GET  /api/investors        — list with q + filter (all|internal|external)
// POST /api/investors        — create

import {
  created,
  fail,
  ok,
  paginate,
  parseListQuery,
  requireFields,
} from "@/lib/api/respond";
import { nextId, searchByFields, stores } from "@/lib/api/server-store";
import type { Investor } from "@/lib/mock/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);

  let items = stores.investors.list();

  if (query.filter === "internal") items = items.filter((i) => i.type === "internal");
  if (query.filter === "external") items = items.filter((i) => i.type === "external");

  items = searchByFields(items, query.q ?? "", ["name", "email", "phone"]);

  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}

export async function POST(req: Request) {
  let body: Partial<Investor>;
  try {
    body = (await req.json()) as Partial<Investor>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }

  const err = requireFields(body as Record<string, unknown>, [
    "name",
    "type",
    "identity",
    "bankAccount",
  ]);
  if (err) return fail("UNPROCESSABLE", err);

  const now = new Date().toISOString();
  const investor: Investor = {
    id: nextId("inv"),
    name: body.name!,
    type: body.type!,
    identity: body.identity!,
    email: body.email,
    phone: body.phone,
    joinedAt: body.joinedAt ?? now.slice(0, 10),
    status: body.status ?? "active",
    totalCapital: body.totalCapital ?? 0,
    currentBalance: body.currentBalance ?? 0,
    realizedProfit: body.realizedProfit ?? 0,
    activeContractCount: body.activeContractCount ?? 0,
    bankAccount: body.bankAccount!,
    profitTerms: body.profitTerms ?? "",
    profitPolicyOverride: body.profitPolicyOverride,
  };

  stores.investors.add(investor);
  return created(investor);
}
