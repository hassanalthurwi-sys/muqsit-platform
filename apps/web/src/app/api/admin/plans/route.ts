// Sprint 28 — first route wired to DB-or-mock.
// Other routes adopt the same pattern in subsequent sprints.

import { ok, paginate, parseListQuery } from "@/lib/api/respond";
import { dbOrMock } from "@/lib/api/db-or-mock";
import { stores } from "@/lib/api/server-store";
import type {
  SubscriptionDuration,
  SubscriptionFeature,
  SubscriptionPlan,
} from "@/lib/mock/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = parseListQuery(url);

  const all = await dbOrMock<SubscriptionPlan[]>(
    async (prisma) => {
      const rows = await prisma.subscriptionPlan.findMany({
        orderBy: { displayOrder: "asc" },
      });
      // Prisma returns JSON for features/prices; coerce to typed objects.
      return rows.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        features: p.features as Record<SubscriptionFeature, boolean>,
        prices: p.prices as Record<SubscriptionDuration, number>,
        active: p.active,
        displayOrder: p.displayOrder,
        createdAt: p.createdAt.toISOString(),
      }));
    },
    () => stores.plans.list().sort((a, b) => a.displayOrder - b.displayOrder),
  );

  let items = all;
  if (query.filter === "active") items = items.filter((p) => p.active);
  if (query.filter === "inactive") items = items.filter((p) => !p.active);

  const { rows, meta } = paginate(items, query);
  return ok(rows, meta);
}
