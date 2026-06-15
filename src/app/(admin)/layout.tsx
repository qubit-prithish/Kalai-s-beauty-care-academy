import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "@/styles/globals.css";

import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Admin — Kalai's Beauty Care & Academy",
  description: "Admin dashboard.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

// The admin area is outside the [locale] segment, so it provides its own
// <html>/<body> (the root layout is a pass-through). English-only, noindex.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-screen bg-ink-page font-sans text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
