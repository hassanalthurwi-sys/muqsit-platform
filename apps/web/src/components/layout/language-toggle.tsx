"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";

export function LanguageToggle() {
  const { locale, toggleLocale, dict } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={dict.common.language}
      onClick={toggleLocale}
      className="gap-2"
    >
      <Languages className="size-4" />
      <span>{locale === "ar" ? "EN" : "ع"}</span>
    </Button>
  );
}
