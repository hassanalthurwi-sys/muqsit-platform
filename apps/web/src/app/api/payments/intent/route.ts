// POST /api/payments/intent
//   { amount, description, method, reference, callbackUrl }

import { fail, ok, requireFields } from "@/lib/api/respond";
import { createPaymentIntent } from "@/lib/integrations/payments";
import type { SubscriptionPaymentMethod } from "@/lib/mock/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const err = requireFields(body, [
    "amount",
    "description",
    "method",
    "reference",
    "callbackUrl",
  ]);
  if (err) return fail("UNPROCESSABLE", err);

  const result = await createPaymentIntent({
    amount: Number(body.amount),
    description: String(body.description),
    method: body.method as SubscriptionPaymentMethod,
    reference: String(body.reference),
    callbackUrl: String(body.callbackUrl),
  });

  if (!result.ok) return fail("INTERNAL", result.error ?? "intent failed");
  return ok(result);
}
