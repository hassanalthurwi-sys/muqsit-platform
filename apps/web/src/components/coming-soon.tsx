"use client";

import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/components/providers/i18n-provider";

export function ComingSoon() {
  const { dict } = useI18n();
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Construction className="size-6" />
        </div>
        <p className="text-lg font-medium">{dict.common.comingSoon}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{dict.common.comingSoonHint}</p>
      </CardContent>
    </Card>
  );
}
