import { cn } from "@/lib/cn";

type PlaceholderProps = {
  src?: string;
  alt?: string;
  label?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Elegant image slot. While photos are PENDING (empty src), it renders a
 * gold-on-charcoal placeholder. When a src arrives, it shows the image.
 */
export function Placeholder({
  src,
  alt = "",
  label,
  ratio = "aspect-[4/3]",
  className,
}: PlaceholderProps) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn("h-full w-full object-cover", ratio, className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={alt || label || "Photo coming soon"}
      className={cn(
        "relative grid place-items-center overflow-hidden bg-ink-surface",
        ratio,
        className,
      )}
    >
      <div className="absolute inset-0 bg-radial-glow opacity-70" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8A24A 0 1px, transparent 1px 14px)",
        }}
      />
      <div className="relative text-center px-4">
        <div className="heading-display text-2xl text-gold-200/80">Kalai&apos;s</div>
        <div className="mt-1 text-[10px] uppercase tracking-luxe text-cream-dim">
          {label ?? "Photo coming soon"}
        </div>
      </div>
    </div>
  );
}
