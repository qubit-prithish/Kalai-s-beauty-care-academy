"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * EN ⇄ TA toggle. Uses next-intl navigation so the current path is preserved
 * when switching locale.
 */
export function LocaleToggle({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const current = (params?.locale as Locale) ?? "en";
  const next: Locale = current === "en" ? "ta" : "en";

  const switchLocale = () => {
    startTransition(() => {
      // Replace at the same pathname with the other locale.
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={isPending}
      aria-label={next === "ta" ? "Switch to Tamil" : "Switch to English"}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-cream-muted transition hover:text-gold-200",
        className,
      )}
    >
      <span className={current === "en" ? "text-gold-200" : "text-cream-muted"}>EN</span>
      <span className="text-ink-border">·</span>
      <span className={current === "ta" ? "text-gold-200" : "text-cream-muted"} style={{ fontFamily: "var(--font-tamil-sans)" }}>
        தமிழ்
      </span>
    </button>
  );
}
