// POST /api/auth/otp { phone, channel? }
// Issues an OTP via SMS (or WhatsApp in Sprint 21+). Returns the code
// only in non-production environments so the prototype can show it.

import { fail, ok, requireFields } from "@/lib/api/respond";
import { issueOtp } from "@/lib/auth/otp-store";
import { otpSms, sendSms } from "@/lib/integrations/sms";
import { sendWhatsApp } from "@/lib/integrations/whatsapp";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { phone?: string; channel?: "sms" | "whatsapp" };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return fail("BAD_REQUEST", "invalid JSON body");
  }
  const err = requireFields(body as Record<string, unknown>, ["phone"]);
  if (err) return fail("UNPROCESSABLE", err);

  const channel = body.channel ?? "sms";
  const { code, expiresAt } = issueOtp(body.phone!, channel);

  // Dispatch via Sprint 21 (WhatsApp) or Sprint 22 (SMS). Both fall
  // back to console.log in sandbox.
  const text = otpSms(code, 5);
  const result =
    channel === "whatsapp"
      ? await sendWhatsApp({ kind: "text", to: body.phone!, body: text })
      : await sendSms({ to: body.phone!, body: text });

  return ok({
    sent: result.ok,
    expiresAt,
    provider: result.provider,
    // Surfaced only outside production so the prototype is testable.
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  });
}
