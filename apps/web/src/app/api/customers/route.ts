// GET  /api/customers — list with q + filter (all|low|medium|high)
// POST /api/customers — create

import {
  created,
  fail,
  ok,
  paginate,
  parseListQuery,
  requireFields,
} from "@/lib/api/respond";
import { nextId, searchByFields, stores } from "@/lib/api/server-store";
import type { Customer } from "@/lib/mock/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);
  let items = stores.customers.list();

  if (query.filter === "low") items = items.filter((c) => c.riskClass === "low");
  if (query.filter === "medium") items = items.filter((c) => c.riskClass === "medium");
  if (query.filter === "high") items = items.filter((c) => c.riskClass === "high");

  items = searchByFields(items, query.q ?? "", ["name", "mobile", "employer", "city"]);

  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}

export async function POST(req: Request) {
  let body: Partial<Customer>;
  try {
    body = (await req.json()) as Partial<Customer>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }

  const err = requireFields(body as Record<string, unknown>, [
    "name",
    "identity",
    "mobile",
  ]);
  if (err) return fail("UNPROCESSABLE", err);

  const customer: Customer = {
    id: nextId("cust"),
    name: body.name!,
    identity: body.identity!,
    mobile: body.mobile!,
    nationality: body.nationality ?? "سعودي",
    dateOfBirth: body.dateOfBirth ?? "",
    employer: body.employer ?? "",
    monthlySalary: body.monthlySalary ?? 0,
    obligations: body.obligations,
    city: body.city ?? "",
    address: body.address ?? "",
    riskClass: body.riskClass ?? "medium",
    notes: body.notes ?? "",
    createdAt: body.createdAt ?? new Date().toISOString(),
  };

  stores.customers.add(customer);
  return created(customer);
}
