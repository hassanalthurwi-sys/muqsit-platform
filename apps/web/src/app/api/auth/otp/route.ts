// POST /api/auth/otp { phone, channel? }
// Issues an OTP via SMS (or WhatsApp in Sprint 21+). Returns the code
// only in non-production environments so the prototype can show it.

import { fail, ok, requireFields } from "@/lib/api/respond";
import { issueOtp } from "@/lib/auth/otp-store";

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

  const { code, expiresAt } = issueOtp(body.phone!, body.channel ?? "sms");

  // In production: dispatch via Sprint 22 SMS gateway / Sprint 21
  // WhatsApp. In the sandbox we just log the code.
  console.log(`[OTP] ${body.phone} → ${code}`);

  return ok({
    sent: true,
    expiresAt,
    // Surfaced only outside production so the prototype is testable.
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
  });
}
