// Sprint 20 — Session token (HMAC-signed JWT-lite).
//
// In production: switch to Auth.js (next-auth) with a database
// adapter. Until then this signed token is sufficient for the
// prototype-with-real-auth pattern.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "muqsit_session";
const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  uid: string;
  phone: string;
  role:
    | "systemAdmin"
    | "systemEmployee"
    | "officeManager"
    | "officeEmployee"
    | "investor"
    | "customer";
  officeId?: string;
  name: string;
  iat: number;
  exp: number;
}

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-only-secret-DO-NOT-USE-IN-PRODUCTION";
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(
    input.replace(/-/g, "+").replace(/_/g, "/") + pad,
    "base64",
  );
}

export function signSession(payload: Omit<SessionPayload, "iat" | "exp">): string {
  const now = Math.floor(Date.now() / 1000);
  const full: SessionPayload = {
    ...payload,
    iat: now,
    exp: now + TTL_SECONDS,
  };
  const body = b64url(JSON.stringify(full));
  const sig = b64url(createHmac("sha256", getSecret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = b64url(createHmac("sha256", getSecret()).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(body).toString("utf8")) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  return verifySession(c.get(COOKIE_NAME)?.value);
}

export async function setSession(payload: Omit<SessionPayload, "iat" | "exp">): Promise<void> {
  const token = signSession(payload);
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export { COOKIE_NAME as SESSION_COOKIE };
