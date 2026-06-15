// POST /api/invoices  { officeId, planId, durationMonths, totalSar, officeVatNumber? }
// Returns a ZATCA-compliant invoice for a paid subscription.

import { fail, ok, requireFields } from "@/lib/api/respond";
import { buildSubscriptionInvoice } from "@/lib/integrations/zatca";
import { stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const err = requireFields(body, ["officeId", "planId", "durationMonths", "totalSar"]);
  if (err) return fail("UNPROCESSABLE", err);

  const office = stores.offices.find(String(body.officeId));
  const plan = stores.plans.find(String(body.planId));
  if (!office) return fail("NOT_FOUND", "office not found");
  if (!plan) return fail("NOT_FOUND", "plan not found");

  const year = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  const invoiceNumber = `INV-${year}-${seq}`;

  const { invoice, totals, qr } = buildSubscriptionInvoice({
    invoiceNumber,
    officeName: office.name,
    officeVatNumber: body.officeVatNumber as string | undefined,
    planName: plan.name,
    durationMonths: Number(body.durationMonths),
    totalSar: Number(body.totalSar),
  });

  return ok({ invoice, totals, qr });
}
