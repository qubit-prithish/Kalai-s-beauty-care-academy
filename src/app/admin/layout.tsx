import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = { title: "Admin · Kalai's", robots: { index: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink-page text-cream antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
