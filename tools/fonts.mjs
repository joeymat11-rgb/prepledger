// Regenerates fonts.css — the self-hosted, base64-inlined web fonts.
//
//   npm i -D @fontsource/barlow @fontsource/barlow-condensed @fontsource/ibm-plex-mono
//   node tools/fonts.mjs
//
// Deliberately NOT part of the build or the gate. fonts.css is committed and
// changes roughly never; making every test run depend on three font packages
// would slow the suite down for no benefit. Run this by hand if the type
// changes, then ship the regenerated fonts.css like any other change.
//
// (The old version wrote to pwa/fonts.css, a directory that no longer exists,
// so running it silently produced nothing where it mattered.)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { at } from "../scripts/lib.mjs";

const spec = [
  ["Barlow Condensed", "barlow-condensed", [600, 700]],
  ["Barlow", "barlow", [400, 500, 600]],
  ["IBM Plex Mono", "ibm-plex-mono", [400, 500, 600]],
];

let css = "/* Prep Ledger — self-hosted fonts (latin), inlined for offline */\n";
for (const [family, pkg, weights] of spec) {
  for (const weight of weights) {
    const file = at("node_modules", "@fontsource", pkg, "files", `${pkg}-latin-${weight}-normal.woff2`);
    if (!existsSync(file)) {
      console.error(`\n  Missing ${pkg} @ ${weight}. Install the font packages first:\n` +
        `  npm i -D @fontsource/barlow @fontsource/barlow-condensed @fontsource/ibm-plex-mono\n`);
      process.exit(1);
    }
    const b64 = readFileSync(file).toString("base64");
    css += `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};` +
           `font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}\n`;
  }
}

writeFileSync(at("fonts.css"), css);
console.log(`fonts.css written: ${(css.length / 1024).toFixed(0)} KB`);
