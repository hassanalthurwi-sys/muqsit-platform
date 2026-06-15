// POST /api/auth/verify { phone, code }
// Verifies the OTP and writes the session cookie.

import { fail, ok, requireFields } from "@/lib/api/respond";
import { verifyOtp } from "@/lib/auth/otp-store";
import { setSession } from "@/lib/auth/session";
import { stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { phone?: string; code?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const err = requireFields(body as Record<string, unknown>, ["phone", "code"]);
  if (err) return fail("UNPROCESSABLE", err);

  const result = verifyOtp(body.phone!, body.code!);
  if (!result.ok) {
    return fail("UNAUTHORIZED", `OTP ${result.reason}`);
  }

  // Resolve who this phone belongs to. Order: office manager,
  // platform employee, employee, investor, customer.
  const office = stores.offices.list().find((o) => o.managerPhone === body.phone);
  if (office) {
    await setSession({
      uid: `user-${office.id}`,
      phone: body.phone!,
      name: office.managerName,
      role: "officeManager",
      officeId: office.id,
    });
    return ok({ role: "officeManager", officeId: office.id, name: office.managerName });
  }

  const sysemp = stores.systemEmployees.list().find((e) => e.phone === body.phone);
  if (sysemp) {
    await setSession({
      uid: sysemp.id,
      phone: body.phone!,
      name: sysemp.name,
      role: sysemp.role,
    });
    return ok({ role: sysemp.role, name: sysemp.name });
  }

  const emp = stores.employees.list().find((e) => e.phone === body.phone);
  if (emp) {
    await setSession({
      uid: emp.id,
      phone: body.phone!,
      name: emp.name,
      role: "officeEmployee",
      // The employee's officeId — in production reconstructed from the
      // db join; here the prototype seeds belong to office-default.
      officeId: "office-default",
    });
    return ok({ role: "officeEmployee", name: emp.name });
  }

  return fail("NOT_FOUND", "phone not registered");
}
