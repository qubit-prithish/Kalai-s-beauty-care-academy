// One-time helper: downloads .woff2 files from Google Fonts and saves them
// locally so the Next.js build NEVER fetches fonts at build time.
// Run with: node scripts/download-fonts.mjs
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "src", "fonts");

const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// family -> { cssUrl, weights mapped to friendly filenames }
const FAMILIES = [
  {
    name: "Inter",
    css: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    file: (w) => `Inter-${w}.woff2`,
    // only keep the 'latin' subset block (avoid downloading every subset)
    subset: "latin",
  },
  {
    name: "Playfair Display",
    css: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap",
    file: (w) => `PlayfairDisplay-${w}.woff2`,
    subset: "latin",
  },
  {
    name: "Noto Sans Tamil",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap",
    file: (w) => `NotoSansTamil-${w}.woff2`,
    subset: "tamil",
  },
  {
    name: "Noto Serif Tamil",
    css: "https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@500;600;700&display=swap",
    file: (w) => `NotoSerifTamil-${w}.woff2`,
    subset: "tamil",
  },
];

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": CHROME_UA } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { "User-Agent": CHROME_UA } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Parse @font-face blocks, return [{ weight, subset, url }]
function parseFaces(css) {
  const faces = [];
  const blocks = css.split("@font-face").slice(1);
  let currentSubset = null;
  // subsets are marked by /* comment */ before each block in google css
  const commentRe = /\/\*\s*([a-z0-9-]+)\s*\*\//gi;
  // Easier: iterate raw lines tracking last comment
  const lines = css.split("\n");
  let lastComment = null;
  let buf = [];
  let inFace = false;
  const flush = () => {
    if (!buf.length) return;
    const block = buf.join("\n");
    const weightM = block.match(/font-weight:\s*(\d+)/);
    const urlM = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (weightM && urlM) {
      faces.push({
        weight: weightM[1],
        subset: lastComment,
        url: urlM[1],
      });
    }
    buf = [];
  };
  for (const line of lines) {
    const c = line.match(/\/\*\s*([a-z0-9\[\]-]+)\s*\*\//i);
    if (c) lastComment = c[1];
    if (line.includes("@font-face")) {
      flush();
      inFace = true;
    }
    if (inFace) buf.push(line);
    if (line.includes("}")) {
      if (inFace) flush();
      inFace = false;
    }
  }
  flush();
  return faces;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const fam of FAMILIES) {
    const css = await fetchText(fam.css);
    const faces = parseFaces(css);
    // group by weight, prefer the requested subset
    const byWeight = new Map();
    for (const f of faces) {
      const key = f.weight;
      const prefer = f.subset === fam.subset;
      if (!byWeight.has(key) || prefer) {
        if (prefer || !byWeight.get(key)?.preferred) {
          byWeight.set(key, { ...f, preferred: prefer });
        }
      }
    }
    for (const [weight, f] of byWeight) {
      const buf = await fetchBuffer(f.url);
      const outFile = path.join(OUT, fam.file(weight));
      await fs.writeFile(outFile, buf);
      console.log(
        `saved ${fam.name} ${weight} (${f.subset}) -> ${path.relative(process.cwd(), outFile)} (${buf.length} bytes)`,
      );
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
