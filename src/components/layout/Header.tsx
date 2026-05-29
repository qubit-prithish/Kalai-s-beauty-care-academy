"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LocaleToggle } from "./LocaleToggle";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/courses", key: "courses" },
  { href: "/services", key: "services" },
  { href: "/gallery", key: "gallery" },
  { href: "/testimonials", key: "testimonials" },
  { href: "/offers", key: "offers" },
  { href: "/blog", key: "blog" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border/70 bg-ink-page/80 backdrop-blur-md">
      <div className="container-luxe flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label={tc("brand")}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-ink-page">
            <span className="heading-display text-lg font-bold">K</span>
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="heading-display text-sm font-semibold text-cream">
              Kalai&apos;s Beauty Care
            </span>
            <span className="text-[10px] uppercase tracking-luxe text-gold-300">
              &amp; Academy · Est. 2006
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-gold-200"
                  : "text-cream-muted hover:text-cream",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleToggle className="hidden sm:inline-flex" />
          <Button
            href={whatsappHref(waMessage.general())}
            variant="whatsapp"
            className="hidden md:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {tc("enquireWhatsApp")}
          </Button>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-cream xl:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink-border bg-ink-page xl:hidden"
          >
            <nav className="container-luxe grid gap-1 py-4" aria-label="Mobile">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-ink-raised text-gold-200"
                      : "text-cream-muted hover:bg-ink-raised hover:text-cream",
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-3">
                <LocaleToggle />
                <Button
                  href={whatsappHref(waMessage.general())}
                  variant="whatsapp"
                  className="flex-1"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {tc("enquireWhatsApp")}
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
