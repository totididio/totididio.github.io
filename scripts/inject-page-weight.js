// Measures each built page and writes the real figure into its footer.
// Injected at build time on purpose: a CO2 badge computed in the browser
// costs more energy than it measures.
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { gzipSync } from "node:zlib";

const OUT = "_site";
const CSS = join(OUT, "assets/css/main.css");

// SWDM v4: 0.300 kWh/GB total, 494 gCO2e/kWh. Green host removes the
// data-centre operational share (0.055 kWh/GB).
const GREEN_HOST = true;
const KWH_PER_GB = GREEN_HOST ? 0.300 - 0.055 : 0.300;
const G_PER_KWH = 494;
const gramsFor = (bytes) => (bytes / 1e9) * KWH_PER_GB * G_PER_KWH;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (extname(entry.name) === ".html") yield p;
  }
}

const sizeOf = async (p) => (await stat(p).catch(() => ({ size: 0 }))).size;

// Assets the browser actually fetches on first visit.
// A <picture> offers several encodings of the same image but the browser takes
// exactly one, so count each picture group once — at its heaviest candidate,
// which is the honest worst case. Counting every <source> would inflate the
// figure printed in the footer, and a weight nobody pays is a wrong weight.
const IMG = /\.(avif|webp|png|jpe?g|svg)$/i;

async function assetBytes(html) {
  const refs = [...html.matchAll(/(?:href|src|srcset)="(\/[^"\s]+\.(?:css|js|avif|webp|png|jpe?g|svg|woff2))/g)]
    .map((m) => m[1]);
  const groups = new Map();
  let total = 0;
  for (const url of new Set(refs)) {
    const bytes = await sizeOf(join(OUT, url));
    if (!IMG.test(url)) { total += bytes; continue; }
    const key = url.replace(IMG, "");
    groups.set(key, Math.max(groups.get(key) ?? 0, bytes));
  }
  for (const bytes of groups.values()) total += bytes;
  return total;
}

let report = [];
for await (const file of htmlFiles(OUT)) {
  let html = await readFile(file, "utf8");
  const bytes = Buffer.byteLength(html) + (await assetBytes(html));
  const kb = Math.round(bytes / 1024);
  const grams = gramsFor(bytes);

  html = html
    .replace(/(<span class="weight" data-page-weight>)[^<]*(<\/span>)/, `$1${kb} KB$2`)
    .replace(/(<span class="weight" data-page-carbon>)[^<]*(<\/span>)/, `$1${grams.toFixed(3)} g$2`);
  await writeFile(file, html);

  report.push({ page: file.replace(OUT, "") || "/", kb, grams: +grams.toFixed(4) });
}

const cssRaw = await sizeOf(CSS);
const cssGz = gzipSync(await readFile(CSS)).length;

console.table(report);
console.log(`CSS: ${cssRaw} B raw · ${cssGz} B gzip (Brotli runs ~15% smaller: ≈ ${Math.round(cssGz * 0.85)} B)`);
await writeFile(".budget.json", JSON.stringify({ pages: report, cssRaw, cssGz }, null, 2));
