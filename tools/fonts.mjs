import { readFileSync, writeFileSync } from "fs";

const spec = [
  ["Barlow Condensed", "barlow-condensed", [600, 700]],
  ["Barlow", "barlow", [400, 500, 600]],
  ["IBM Plex Mono", "ibm-plex-mono", [400, 500, 600]],
];

let css = "/* Prep Ledger — self-hosted fonts (latin), inlined for offline */\n";
for (const [fam, pkg, weights] of spec) {
  for (const w of weights) {
    const p = `node_modules/@fontsource/${pkg}/files/${pkg}-latin-${w}-normal.woff2`;
    const b64 = readFileSync(p).toString("base64");
    css += `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}\n`;
  }
}
writeFileSync("pwa/fonts.css", css);
console.log("fonts.css written:", (css.length / 1024).toFixed(0), "KB");
