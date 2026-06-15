// Sprint 20 — OTP store.
//
// In production: backed by Redis or a Postgres table with TTL.
// In sandbox: module-scope in-memory map.

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  channel: "sms" | "whatsapp";
}

const TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

const store = new Map<string, OtpEntry>();

function key(phone: string): string {
  return phone.replace(/\s+/g, "");
}

export function issueOtp(
  phone: string,
  channel: "sms" | "whatsapp" = "sms",
): { code: string; expiresAt: number } {
  const code = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = Date.now() + TTL_MS;
  store.set(key(phone), { code, expiresAt, attempts: 0, channel });
  return { code, expiresAt };
}

export type OtpVerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "wrong" | "locked" | "unknown" };

export function verifyOtp(phone: string, code: string): OtpVerifyResult {
  const entry = store.get(key(phone));
  if (!entry) return { ok: false, reason: "unknown" };
  if (entry.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "locked" };
  if (Date.now() > entry.expiresAt) {
    store.delete(key(phone));
    return { ok: false, reason: "expired" };
  }
  entry.attempts++;
  if (entry.code !== code) return { ok: false, reason: "wrong" };
  store.delete(key(phone));
  return { ok: true };
}
