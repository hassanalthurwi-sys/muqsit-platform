import {
  created,
  fail,
  ok,
  paginate,
  parseListQuery,
  requireFields,
} from "@/lib/api/respond";
import { nextId, searchByFields, stores } from "@/lib/api/server-store";
import type { Employee } from "@/lib/mock/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);
  let items = stores.employees.list();

  if (query.filter === "active") {
    items = items.filter((e) => e.active && e.inviteStatus !== "pending");
  } else if (query.filter === "pending") {
    items = items.filter((e) => e.inviteStatus === "pending");
  } else if (query.filter === "suspended") {
    items = items.filter((e) => !e.active);
  }

  items = searchByFields(items, query.q ?? "", ["name", "email", "phone", "title"]);
  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}

export async function POST(req: Request) {
  let body: Partial<Employee>;
  try {
    body = (await req.json()) as Partial<Employee>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }

  const err = requireFields(body as Record<string, unknown>, [
    "name",
    "email",
    "title",
    "permissions",
  ]);
  if (err) return fail("UNPROCESSABLE", err);

  const now = new Date().toISOString();
  const emp: Employee = {
    id: nextId("emp"),
    name: body.name!,
    email: body.email!,
    phone: body.phone,
    nationalId: body.nationalId,
    title: body.title!,
    permissions: body.permissions!,
    templateRoleId: body.templateRoleId,
    roleId: body.roleId ?? body.templateRoleId ?? "",
    roleName: body.roleName ?? "",
    bypassApprovals: body.bypassApprovals ?? false,
    active: body.active ?? true,
    joinedAt: body.joinedAt ?? now.slice(0, 10),
    inviteStatus: body.inviteStatus ?? "pending",
    invitedAt: body.invitedAt ?? now,
  };

  stores.employees.add(emp);
  return created(emp);
}
