"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { LocaleToggle } from "./LocaleToggle";
import { whatsappHref, waMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Settings } from "@/lib/content/types";
import { pick } from "@/lib/locale";

const NAV = [
  { href: "/", key: "home" },
  { href: "/courses", key: "courses" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export function Header({ settings }: { settings: Settings }) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        buttonRef.current?.focus();
        wasOpen.current = false;
      }
      return;
    }

    wasOpen.current = true;
    const menu = menuRef.current;
    if (!menu) return;

    const focusable = Array.from(
      menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) {
      setTimeout(() => first.focus(), 50);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  const logo = settings.navbarLogo;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border/70 bg-ink-page/80 backdrop-blur-md">
      <div className="container-luxe flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label={tc("brand")}>
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            {logo?.url ? (
              <Image
                src={logo.url}
                alt={pick(logo.alt, locale as Locale)}
                fill
                className="object-cover"
                priority
                sizes="40px"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gold-gradient text-ink-page">
                <span className="heading-display text-lg font-bold">K</span>
              </span>
            )}
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="heading-display text-sm font-semibold text-cream leading-snug">
              {tc("brandNamePart1")}
            </span>
            <span className="text-[10px] uppercase tracking-luxe text-gold-300">
              {tc("brandNamePart2")}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={isActive(item.href) ? "page" : undefined}
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
            variant="primary"
            className="hidden md:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {tc("enquireWhatsApp")}
          </Button>

          {/* Hamburger */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-cream lg:hidden"
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
      {mounted && open ? (
        <motion.div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={tc("brandNamePart1")}
          initial={reduce ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden border-t border-ink-border bg-ink-page lg:hidden"
        >
          <nav className="container-luxe grid gap-1 py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
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
                variant="primary"
                className="flex-1"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {tc("enquireWhatsApp")}
              </Button>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </header>
  );
}
