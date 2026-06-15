// POST /api/sms/send { to, body, senderName? }

import { fail, ok, requireFields } from "@/lib/api/respond";
import { sendSms } from "@/lib/integrations/sms";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const err = requireFields(body, ["to", "body"]);
  if (err) return fail("UNPROCESSABLE", err);

  const result = await sendSms({
    to: body.to as string,
    body: body.body as string,
    senderName: body.senderName as string | undefined,
  });
  if (!result.ok) return fail("INTERNAL", result.error ?? "send failed");
  return ok(result);
}
