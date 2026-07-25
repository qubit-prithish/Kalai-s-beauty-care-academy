import Image from "next/image";
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
  priority = false,
}: PlaceholderProps) {
  if (process.env.NODE_ENV !== "production" && src && !alt) {
    console.warn("Placeholder: 'src' was provided without descriptive 'alt' text.");
  }

  if (src) {
    return (
      <div className={cn("relative overflow-hidden", ratio, className)}>
        <Image
          src={src}
          alt={alt || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
        />
      </div>
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
            "repeating-linear-gradient(45deg, #B85C72 0 1px, transparent 1px 14px)",
        }}
      />
      <div className="relative flex flex-col items-center justify-center px-4 text-center">
        <svg className="mb-3 h-16 w-16 opacity-40 text-cream-dim" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-cream-dim">{label ?? "Photo coming soon"}</p>
      </div>
    </div>
  );
}
