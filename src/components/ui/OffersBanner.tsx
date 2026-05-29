import { TrustBadge } from "./TrustBadge";

export type OfferItem = {
  id: string;
  title: string;
  description: string;
  badge: string;
};

/** Compact marquee-free offers strip (a11y + perf friendly). */
export function OffersBanner({ offers }: { offers: OfferItem[] }) {
  if (offers.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((o) => (
        <div
          key={o.id}
          className="rounded-2xl border border-gold-500/25 bg-gold-500/[0.06] p-5"
        >
          <TrustBadge tone="gold">{o.badge}</TrustBadge>
          <h3 className="heading-display mt-3 text-lg text-cream">{o.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-cream-muted">
            {o.description}
          </p>
        </div>
      ))}
    </div>
  );
}
