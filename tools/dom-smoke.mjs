// DOM SMOKE — mounts the *shipped* bundle (app.js, exactly the bytes Netlify
// serves) in jsdom and checks the app actually comes up.
//
// Replaces tools/smoke.mjs and tools/smoke2.mjs, which pointed at pwa/app.js
// and prep-ledger-pwa/app.js — directories that have not existed for a long
// time. Both scripts had been silently unrunnable, so "smoke passed" meant
// nothing. Paths here derive from the repo root and cannot rot the same way.

import fs from "node:fs";
import { JSDOM } from "jsdom";
import { at } from "../scripts/lib.mjs";

const bundlePath = at("app.js");
if (!fs.existsSync(bundlePath)) {
  console.error("DOM-SMOKE FAIL: app.js is missing — run `npm run build` first");
  process.exit(1);
}

const dom = new JSDOM(
  `<!doctype html><html><body><div id="root"></div></body></html>`,
  { url: "https://smoke.local/", runScripts: "outside-only", pretendToBeVisual: true }
);
dom.window.scrollTo = () => {};
dom.window.matchMedia = dom.window.matchMedia ||
  (() => ({ matches: false, addListener() {}, removeListener() {} }));

try {
  dom.window.eval(fs.readFileSync(bundlePath, "utf8"));
} catch (e) {
  console.error("DOM-SMOKE FAIL: the bundle threw on evaluate —", e && e.message);
  process.exit(1);
}

await new Promise((r) => setTimeout(r, 400));

const html = dom.window.document.getElementById("root").innerHTML;
let failed = 0;
const check = (ok, good, bad) => {
  console.log(ok ? `  OK: ${good}` : `  FAIL: ${bad}`);
  if (!ok) failed++;
};

console.log(`  root html bytes: ${html.length}`);
check(html.length > 2000, "app mounted and rendered", `root is nearly empty (${html.length} bytes)`);
check(html.includes("EARNED") || html.includes("Earned"), "header renders — the EARNED wordmark (renamed R15f; public launch still gates on trademark clearance)", "wordmark missing");   /* R15b — the wordmark is letterspaced caps per the mockup */
/* The rail is now NOW / TRAIN / MORE — see NAV_NOTE. QUEUE and SLEEP moved
   behind MORE by design: static demotion, because an interface that rearranges
   itself measured ~8% slower than one that does not (Findlater & McGrenere,
   CHI 2004). Assert the primary rail, and that the demoted rooms are reachable
   rather than orphaned. */
check(html.includes("NOW") && html.includes("TRAIN") && html.includes("PROGRESS"), "primary tab rail renders", "primary tabs missing");   /* R6-1 — the third rail tab DISPLAYS as PROGRESS; its route key is still LEDGER */
check(
  !!dom.window.localStorage.getItem("prep-ledger-v1"),
  "state seeded to localStorage",
  "no seed stored"
);

dom.window.close();
if (failed) {
  console.error(`DOM-SMOKE: ${failed} failure(s)`);
  process.exit(1);
}
console.log("DOM-SMOKE: the shipped bundle boots clean");
process.exit(0);
