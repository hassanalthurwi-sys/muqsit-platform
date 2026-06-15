// POST /api/payments/webhook — Moyasar webhook receiver.
//
// Moyasar signs every webhook with a secret token in the request
// header. We verify, then update the SubscriptionTransaction status
// and (when paid) activate the office's subscription.

import { ok } from "@/lib/api/respond";
import { stores } from "@/lib/api/server-store";

export const runtime = "nodejs";

interface WebhookPayload {
  type?: string;
  data?: {
    id?: string;
    status?: string;
    metadata?: { reference?: string };
    amount?: number;
  };
}

export async function POST(req: Request) {
  // Verify webhook secret.
  const expected = process.env.MOYASAR_WEBHOOK_SECRET;
  const provided = req.headers.get("x-moyasar-webhook-token");
  if (expected && provided !== expected) {
    return new Response("forbidden", { status: 403 });
  }

  let body: WebhookPayload;
  try {
    body = (await req.json()) as WebhookPayload;
  } catch {
    return ok({ processed: false });
  }

  const ref = body.data?.metadata?.reference;
  const status = body.data?.status;
  console.log(`[payments] webhook type=${body.type} ref=${ref} status=${status}`);

  // Sandbox: activate the matching office if we can find one.
  if (status === "paid" && ref) {
    // In production: lookup SubscriptionTransaction by id, mark
    // paid, then update the office. For the prototype path we just
    // log; the checkout UI already shows the success state.
    const office = stores.offices.list().find((o) => o.id === ref);
    if (office) {
      stores.offices.update(office.id, { subscriptionStatus: "active" });
    }
  }
  return ok({ processed: true });
}
