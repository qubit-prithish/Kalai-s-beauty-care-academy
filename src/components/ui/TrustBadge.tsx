import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TrustBadgeProps = {
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "gold" | "signature";
  className?: string;
};

export function TrustBadge({
  children,
  icon,
  tone = "default",
  className,
}: TrustBadgeProps) {
  const tones = {
    default: "bg-ink-raised text-cream-50 border-ink-border",
    gold: "bg-gold-500/15 text-gold-700 border-gold-500/40",
    signature: "bg-gold-gradient text-ink-page border-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </span>
  );
}
