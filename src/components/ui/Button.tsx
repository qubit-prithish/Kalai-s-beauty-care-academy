import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

import { useTranslations } from "next-intl";

export function WhatsAppMicrocopy({ className }: { className?: string }) {
  const t = useTranslations("common");
  return (
    <p className={cn("mt-1 text-xs text-cream-muted", className)}>
      {t("typicalReply")}
    </p>
  );
}

type Variant = "primary" | "secondary" | "whatsapp" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-page active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // gold fill on charcoal text — AA contrast
  primary: "bg-gold-gradient text-ink-page shadow-gold hover:brightness-105",
  // gold outline
  secondary:
    "border border-gold-500/60 text-gold-200 hover:bg-gold-500/10 hover:border-gold-400",
  // Muted WhatsApp green — utility only (floating widget)
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover shadow-soft",
  ghost: "text-cream hover:bg-cream/10",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    const isExternal = external ?? /^https?:|^tel:|^mailto:/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
