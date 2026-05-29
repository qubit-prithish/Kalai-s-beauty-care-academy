"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight, non-blocking page-view beacon for the in-house analytics
 * dashboard (built in B3). Inserts into public.page_views via PostgREST (anon
 * key, public INSERT allowed by RLS). Respects Do Not Track and never blocks
 * rendering or navigation.
 */
export function PageViews() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return;

    const device = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      ? "mobile"
      : "desktop";

    // Fire-and-forget; keepalive so it survives navigation.
    fetch(`${url}/rest/v1/page_views`, {
      method: "POST",
      keepalive: true,
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        device,
      }),
    }).catch(() => {
      /* analytics must never throw */
    });
  }, [pathname]);

  return null;
}
