import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default:
      "Kalai's Beauty Care & Academy | Beauty Academy & Salon in Ambattur, Chennai",
    template: "%s | Kalai's Beauty Care & Academy",
  },
  description:
    "Premier beauty academy and salon in Ambattur, Chennai. 20+ years, 1000+ students trained, 4.8★ rated. Beautician courses, bridal makeup, ear lobe treatment and more.",
};

export const viewport: Viewport = {
  themeColor: "#0E0E0F",
  width: "device-width",
  initialScale: 1,
};

// Root layout is a pass-through. The <html>/<body> + font variables live in the
// [locale] layout so next-intl can drive the lang attribute (next-intl pattern).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
