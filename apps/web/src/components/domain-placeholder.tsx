"use client";

import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { useI18n } from "@/components/providers/i18n-provider";
import type { NavKey } from "@/lib/nav";

export function DomainPlaceholder({ pageKey }: { pageKey: NavKey }) {
  const { dict } = useI18n();
  const copy = dict.pages[pageKey];

  return (
    <div className="space-y-6">
      <PageHeader title={copy.title} description={copy.description} />
      <ComingSoon />
    </div>
  );
}
