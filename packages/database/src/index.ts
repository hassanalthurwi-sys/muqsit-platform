// Sprint 19 — Prisma client + fallback.
//
// In production: connects to PostgreSQL via DATABASE_URL.
// In sandbox / dev without DATABASE_URL: prisma is undefined and the
// app falls back to the in-memory mock store (Sprint 18).

import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __muqsitPrisma: PrismaClient | undefined;
}

let prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient | undefined {
  if (!process.env.DATABASE_URL) return undefined;
  if (!prisma) {
    prisma =
      global.__muqsitPrisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    if (process.env.NODE_ENV !== "production") {
      global.__muqsitPrisma = prisma;
    }
  }
  return prisma;
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export * from "@prisma/client";
