import type { Locale } from "@/lib/i18n/dictionaries";

export function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB",
    { year: "numeric", month: "short", day: "numeric" },
  ).format(d);
}

export function initialsFor(name: string): string {
  return name
    .replace(/^مكتب|^شركة|^مؤسسة/u, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase();
}
