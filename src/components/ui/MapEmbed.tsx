import * as React from "react";

export interface MapEmbedProps {
  mapEmbedQuery: string;
  landmark: string;
  directionsLink: string;
  directionsLabel: string;
}

export function MapEmbed({
  mapEmbedQuery,
  landmark,
  directionsLink,
  directionsLabel,
}: MapEmbedProps) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapEmbedQuery,
  )}&output=embed`;

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-border">
      <iframe
        title="Google map — Kalai's Beauty Care & Academy"
        src={mapSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin"
        className="h-72 w-full border-0"
        style={{ border: 0 }}
      />
      <div className="flex items-center justify-between gap-3 p-4">
        <span className="text-sm text-cream-dim">{landmark}</span>
        <a
          href={directionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gold-200 transition-colors hover:text-gold-300 hover:underline"
        >
          {directionsLabel} →
        </a>
      </div>
    </div>
  );
}
