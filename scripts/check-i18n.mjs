// Verifies messages/en.json and messages/ta.json have an identical key set.
// Exits non-zero (and logs missing keys) if any key is missing in either locale.
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "messages");
const en = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf-8"));
const ta = JSON.parse(fs.readFileSync(path.join(dir, "ta.json"), "utf-8"));

function flatten(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...flatten(v, key));
    } else {
      keys.push(key);
    }
  }
  return keys;
}

const enKeys = new Set(flatten(en));
const taKeys = new Set(flatten(ta));

const missingInTa = [...enKeys].filter((k) => !taKeys.has(k));
const missingInEn = [...taKeys].filter((k) => !enKeys.has(k));

if (missingInTa.length || missingInEn.length) {
  if (missingInTa.length) {
    console.error(`\nMissing in ta.json (${missingInTa.length}):`);
    missingInTa.forEach((k) => console.error("  - " + k));
  }
  if (missingInEn.length) {
    console.error(`\nMissing in en.json (${missingInEn.length}):`);
    missingInEn.forEach((k) => console.error("  - " + k));
  }
  process.exit(1);
}

console.log(`i18n OK — ${enKeys.size} keys present in both en and ta.`);
