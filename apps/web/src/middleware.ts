// Sprint 20 — Route-group middleware.
//
// In production: guards /admin/* (system roles only), /portal/*
// (investor/customer only), and (app) routes (any authenticated
// office user). In the sandbox the localStorage-based session from
// Sprint 13 keeps working — middleware doesn't block it because the
// fallback path is enabled when AUTH_SECRET is not set.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

const PROTECTED_PATTERNS: { pattern: RegExp; allowed: string[] }[] = [
  { pattern: /^\/admin(\/|$)/, allowed: ["systemAdmin", "systemEmployee"] },
  { pattern: /^\/portal\/investor(\/|$)/, allowed: ["investor"] },
  { pattern: /^\/portal\/customer(\/|$)/, allowed: ["customer"] },
];

const SANDBOX_MODE = !process.env.AUTH_SECRET;

export function middleware(req: NextRequest) {
  if (SANDBOX_MODE) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const rule = PROTECTED_PATTERNS.find((r) => r.pattern.test(pathname));
  if (!rule) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = verifySession(token);
  if (!session || !rule.allowed.includes(session.role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
