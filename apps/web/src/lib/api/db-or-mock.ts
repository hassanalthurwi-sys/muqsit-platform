// Sprint 28 — DB-first, mock-fallback helper.
//
// Pattern adopted across API routes from Sprint 28 onwards. Each
// route calls `dbOrMock(prismaFn, mockFn)` and the helper resolves
// to whichever source is available at request time.
//
// Production (DATABASE_URL set): runs prismaFn against PostgreSQL.
// Sandbox (no DATABASE_URL): runs mockFn against the in-memory store.
//
// Routes don't import @muqsit/database directly so the bundle stays
// lean when the DB isn't in use.

import { getPrisma, isDatabaseAvailable } from "@muqsit/database";

export async function dbOrMock<T>(
  prismaFn: (prisma: NonNullable<ReturnType<typeof getPrisma>>) => Promise<T>,
  mockFn: () => T | Promise<T>,
): Promise<T> {
  if (isDatabaseAvailable()) {
    const prisma = getPrisma();
    if (prisma) {
      try {
        return await prismaFn(prisma);
      } catch (err) {
        console.error("[db-or-mock] Prisma error, falling back to mock:", err);
        return await mockFn();
      }
    }
  }
  return await mockFn();
}
