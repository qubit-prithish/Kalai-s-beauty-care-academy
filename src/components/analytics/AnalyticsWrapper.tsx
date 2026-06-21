"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { PlausibleScript } from "./PlausibleScript";

export function AnalyticsWrapper({ analyticsEnabled }: { analyticsEnabled: boolean }) {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setConsent(localStorage.getItem("cookie-consent"));

    const handleConsentChange = () => {
      setConsent(localStorage.getItem("cookie-consent"));
    };

    window.addEventListener("cookie-consent-changed", handleConsentChange);
    return () => window.removeEventListener("cookie-consent-changed", handleConsentChange);
  }, []);

  if (consent !== "accepted") {
    return null;
  }

  return (
    <>
      <PlausibleScript />
      {analyticsEnabled ? <Analytics /> : null}
    </>
  );
}
