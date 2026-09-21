// Fails the build when a page breaks the budget. A budget that does not fail
// the build is a wish.
import { readFile } from "node:fs/promises";

const LIMITS = {
  kb: 250,          // hard limit per page; target 200
  kbHome: 180,      // hard limit for the home; target 150
  grams: 0.05,      // hard limit per pageview; target 0.03
  cssBrotli: 12288, // 12 KB; target 8 KB
};

const { pages, cssGz } = JSON.parse(await readFile(".budget.json", "utf8"));
const cssBrotli = Math.round(cssGz * 0.85); // gzip is a safe proxy; Brotli is smaller
const fails = [];

for (const p of pages) {
  const isHome = p.page === "/index.html" || p.page === "/";
  const limit = isHome ? LIMITS.kbHome : LIMITS.kb;
  if (p.kb > limit) fails.push(`${p.page}: ${p.kb} KB > ${limit} KB`);
  if (p.grams > LIMITS.grams) fails.push(`${p.page}: ${p.grams} g > ${LIMITS.grams} g`);
}
if (cssBrotli > LIMITS.cssBrotli) fails.push(`CSS: ≈${cssBrotli} B Brotli > ${LIMITS.cssBrotli} B`);

if (fails.length) {
  console.error("\nCarbon budget exceeded:\n" + fails.map((f) => "  · " + f).join("\n") + "\n");
  process.exit(1);
}
console.log(`\nBudget OK — ${pages.length} page(s), CSS ≈${cssBrotli} B Brotli.\n`);
