// A1 (design round) — THE CONTRAST AUDITOR. Every resolved text-on-surface pair in
// BOTH themes must clear WCAG 4.5:1. This gate exists because two token systems
// collided and light mode shipped its most important numbers at 1.10:1 (V1) — and
// because a queued ~30-token 3.0-3.2 class needed one net, not thirty hand fixes.
// Runs in scripts/check.mjs; exits 1 on any failing pair, naming it.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import esbuild from "esbuild";
import { createRequire } from "node:module";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, ".tmp", "contrast-probe.cjs");

await esbuild.build({
  entryPoints: [join(ROOT, "tools", "_contrast-probe.jsx")],
  bundle: true, platform: "node", jsx: "automatic", loader: { ".jsx": "jsx" },
  outfile: OUT, absWorkingDir: ROOT, logLevel: "silent",
});
const require2 = createRequire(import.meta.url);
delete require2.cache[OUT];
const { PALETTE, DT_PALETTE } = require2(OUT);

const lum = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const l1 = lum(a), l2 = lum(b);
  return +(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05))).toFixed(2);
};

const MIN = 4.5;
const fails = [];
let checked = 0;
for (const mode of ["dark", "light"]) {
  const P = PALETTE[mode], D = DT_PALETTE[mode];
  /* themed text on themed surfaces */
  for (const fg of ["chalk", "steel", "jade", "brass", "orange", "redline", "gauge"]) {
    for (const bg of ["ink", "plate", "plate2"]) {
      checked++;
      const r = ratio(P[fg], P[bg]);
      if (r < MIN) fails.push(`${mode} T.${fg} on T.${bg} = ${r}:1`);
    }
  }
  { checked++; const r = ratio(P.dim, P.plate); if (r < MIN) fails.push(`${mode} T.dim on T.plate = ${r}:1`); }
  /* DT text on DT surfaces */
  for (const fg of ["ink", "steel", "dim", "jade", "amber", "red", "decision"]) {
    for (const bg of ["bg", "bg2", "card", "card2", "well"]) {
      checked++;
      const r = ratio(D[fg], D[bg]);
      if (r < MIN) fails.push(`${mode} DT.${fg} on DT.${bg} = ${r}:1`);
    }
  }
  /* the CROSS pairs that caused the P0: themed text landing on DT plates, and
     brass-register text on themed paper (V1's 1.71:1 ON COURSE case) */
  { checked++; const r = ratio(P.chalk, D.card); if (r < MIN) fails.push(`${mode} T.chalk on DT.card = ${r}:1 (the V1 class)`); }
  { checked++; const r = ratio(P.brass, P.plate); if (r < MIN) fails.push(`${mode} T.brass on T.plate = ${r}:1 (the ON COURSE class)`); }
  { checked++; const r = ratio(P.steel, D.card); if (r < MIN) fails.push(`${mode} T.steel on DT.card = ${r}:1`); }
}

if (fails.length) {
  console.log("CONTRAST AUDIT — " + fails.length + " of " + checked + " resolved pairs under " + MIN + ":1:");
  fails.forEach((f) => console.log("  FAIL  " + f));
  process.exit(1);
}
console.log("contrast audit: " + checked + " resolved pairs, both themes, all >= " + MIN + ":1");
