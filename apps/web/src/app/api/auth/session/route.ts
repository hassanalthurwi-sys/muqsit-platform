// GET    /api/auth/session — returns current session or null
// DELETE /api/auth/session — clears the cookie (logout)

import { clearSession, getSession } from "@/lib/auth/session";
import { noContent, ok } from "@/lib/api/respond";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  return ok({ session });
}

export async function DELETE() {
  await clearSession();
  return noContent();
}
