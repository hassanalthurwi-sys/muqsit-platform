import { Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialsFor } from "@/lib/format";
import type { IdentityKind } from "@/lib/mock/types";

interface Props {
  name: string;
  kind: IdentityKind;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
};

export function InvestorAvatar({ name, kind, size = "md", className }: Props) {
  const isEntity = kind === "commercialEntity";
  const initials = initialsFor(name);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary-soft-foreground",
        sizeClasses[size],
        className,
      )}
    >
      {isEntity ? (
        <Building2 className="size-1/2" />
      ) : initials ? (
        initials
      ) : (
        <User className="size-1/2" />
      )}
    </span>
  );
}
