// Generates a static OG image (public/og.png) from an SVG using sharp.
// Run once: node scripts/make-og.mjs  (re-run if branding text changes)
import sharp from "sharp";
import path from "node:path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="#C8A24A" stop-opacity="0.28"/>
      <stop offset="70%" stop-color="#0E0E0F" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0E0E0F"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="600" y="150" text-anchor="middle" fill="#C8A24A"
        font-family="Georgia, serif" font-size="26" letter-spacing="6">
    ESTABLISHED 2006 · AMBATTUR, CHENNAI
  </text>
  <text x="600" y="300" text-anchor="middle" fill="#E6D2A8"
        font-family="Georgia, serif" font-size="78" font-weight="700">
    Kalai's Beauty Care
  </text>
  <text x="600" y="385" text-anchor="middle" fill="#E6D2A8"
        font-family="Georgia, serif" font-size="78" font-weight="700">
    &amp; Academy
  </text>
  <text x="600" y="470" text-anchor="middle" fill="#B7B2A8"
        font-family="Arial, sans-serif" font-size="30">
    Beautician courses &amp; salon · 4.8★ · 1000+ students trained
  </text>
</svg>`;

const out = path.join(process.cwd(), "public", "og.png");
await sharp(Buffer.from(svg)).png().toFile(out);
console.log("Wrote " + out);
