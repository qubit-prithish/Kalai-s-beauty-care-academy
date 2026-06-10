"use client";

import { useEffect } from "react";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const plausibleSrc = "https://plausible.io/js/script.js";

export function PlausibleScript() {
  useEffect(() => {
    if (!plausibleDomain) return;
    if (navigator.doNotTrack === "1") return;
    if ((window as Window & { doNotTrack?: string }).doNotTrack === "1") return;

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.src = plausibleSrc;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
