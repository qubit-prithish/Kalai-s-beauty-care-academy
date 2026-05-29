import localFont from "next/font/local";

// Display serif (Latin headings/hero)
export const playfair = localFont({
  src: [
    { path: "../fonts/PlayfairDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/PlayfairDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/PlayfairDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

// Body sans (Latin UI/paragraphs)
export const inter = localFont({
  src: [
    { path: "../fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Inter-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

// Tamil headings (serif)
export const notoSerifTamil = localFont({
  src: [
    { path: "../fonts/NotoSerifTamil-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/NotoSerifTamil-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/NotoSerifTamil-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-tamil-display",
  display: "swap",
  fallback: ["Latha", "sans-serif"],
});

// Tamil body (sans)
export const notoSansTamil = localFont({
  src: [
    { path: "../fonts/NotoSansTamil-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/NotoSansTamil-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/NotoSansTamil-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/NotoSansTamil-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-tamil-sans",
  display: "swap",
  fallback: ["Latha", "sans-serif"],
});

export const fontVariables = [
  playfair.variable,
  inter.variable,
  notoSerifTamil.variable,
  notoSansTamil.variable,
].join(" ");
