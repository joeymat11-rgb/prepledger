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

/* ============================================================================
   FIX 2a ITEM 5 — THE BEHAVIORAL STORAGE SMOKE. The v7.52.0 storage claims were
   pinned as SOURCE SUBSTRINGS, and cowork's browser executions covered the
   behavior exactly once — the repo must defend itself. Two hostile boots of the
   REAL shipped bundle: (a) a getItem that throws, (b) a corrupt blob. Both must
   RENDER the load banner and write ZERO bytes to the main key during boot —
   the old code seed-booted silently and then overwrote the real blob.
   Storage.prototype is patched (not localStorage replaced), so the app runs
   against the genuine store with a recorder in front of it.
   ============================================================================ */
const KEY9 = "prep-ledger-v1";
const BANNER9 = "STORED DATA UNREADABLE — this device's copy would not load.";
async function hostileBoot(label, prep) {
  const d9 = new JSDOM(
    `<!doctype html><html><body><div id="root"></div></body></html>`,
    { url: "https://smoke.local/", runScripts: "outside-only", pretendToBeVisual: true }
  );
  d9.window.scrollTo = () => {};
  d9.window.matchMedia = d9.window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  const writes = [];
  const SP = d9.window.Storage.prototype;
  const realGet = SP.getItem, realSet = SP.setItem;
  prep(d9.window, SP, realGet, writes);
  SP.setItem = function (k, v) { if (k === KEY9) writes.push(String(v).slice(0, 40)); return realSet.call(this, k, v); };
  try { d9.window.eval(fs.readFileSync(bundlePath, "utf8")); }
  catch (e) { check(false, "", `[storage/${label}] the bundle threw clean out of boot — the component catch did not hold: ${e && e.message}`); d9.window.close(); return; }
  await new Promise((r) => setTimeout(r, 400));
  const txt = d9.window.document.body.textContent || "";
  check(txt.includes(BANNER9), `[storage/${label}] the load banner RENDERS — behavior, not a substring`, `[storage/${label}] the load banner did not render`);
  check(writes.length === 0, `[storage/${label}] ZERO writes to ${KEY9} during boot — the real blob is never overwritten`, `[storage/${label}] boot WROTE the main key ${writes.length} time(s): ${writes.join(" · ")}`);
  d9.window.close();
}
/* (a) storage access itself throws — the iOS fault class. Only the main key
   throws: the app's other keys keep working, which is the harder case (a
   wholesale storage death would also stop the overwrite by itself). */
await hostileBoot("thrown-getItem", (w9, SP, realGet) => {
  SP.getItem = function (k) { if (k === KEY9) throw new Error("SecurityError: storage unreadable (smoke)"); return realGet.call(this, k); };
});
/* (b) the blob is present but corrupt — parse throws, the boot must banner and
   the bytes must survive untouched for the stash to rescue on first save. */
await hostileBoot("corrupt-blob", (w9) => {
  w9.localStorage.setItem(KEY9, "{corrupt json, not even close");
});

/* FIX 2b — RESET OVER A CORRUPT BLOB, driven end to end. reset() was the ONE
   writer that never entered the hardened path: its own direct setItem destroyed
   the only recoverable copy with no stash and no banner (cowork drove it). It
   routes through save(fresh, {force:true}) now — this drive proves the route,
   by walking the real UI: corrupt boot → PROGRESS → SETTINGS & DATA → RULES →
   Reset, then asserting the corrupt bytes are IN THE STASH and the main key
   parses as the fresh seed. */
{
  const CORRUPT9 = "{corrupt json, not even close — reset drive";
  const d9 = new JSDOM(
    `<!doctype html><html><body><div id="root"></div></body></html>`,
    { url: "https://smoke.local/", runScripts: "outside-only", pretendToBeVisual: true }
  );
  d9.window.scrollTo = () => {};
  d9.window.matchMedia = d9.window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  d9.window.localStorage.setItem(KEY9, CORRUPT9);
  try { d9.window.eval(fs.readFileSync(bundlePath, "utf8")); }
  catch (e) { check(false, "", `[storage/reset] the bundle threw on boot: ${e && e.message}`); }
  await new Promise((r) => setTimeout(r, 400));
  const tap9 = async (pred, what) => {
    const el = [...d9.window.document.querySelectorAll("button, [role=button]")].find(pred);
    if (!el) { check(false, "", `[storage/reset] could not find ${what} on the walk`); return false; }
    el.click();
    await new Promise((r) => setTimeout(r, 250));
    return true;
  };
  await tap9((b) => b.tagName === "BUTTON" && b.textContent.trim().startsWith("PROGRESS"), "the PROGRESS tab");
  await tap9((b) => b.textContent.trim().startsWith("SETTINGS & DATA") && b.textContent.trim().length < 400, "the SETTINGS & DATA door");
  await tap9((b) => b.textContent.trim().startsWith("RULES") && b.textContent.trim().length < 400, "the RULES row");
  await tap9((b) => b.textContent.trim() === "Reset to seeded state (7/22)", "the Reset button");
  check(d9.window.localStorage.getItem("prep-ledger-corrupt") === CORRUPT9,
    "[storage/reset] the corrupt bytes are IN THE STASH after Reset — reset now stashes before it overwrites",
    "[storage/reset] the stash does not hold the corrupt bytes — reset destroyed the only recoverable copy");
  let seedOk = false;
  try { const st9 = JSON.parse(d9.window.localStorage.getItem(KEY9)); seedOk = st9 && typeof st9.v === "number" && Array.isArray(st9.exercises); } catch (e) {}
  check(seedOk,
    "[storage/reset] and the main key parses as the fresh seed — the reset itself still worked",
    "[storage/reset] the main key does not parse as a seed after Reset");
  d9.window.close();
}

if (failed) {
  console.error(`DOM-SMOKE: ${failed} failure(s)`);
  process.exit(1);
}
console.log("DOM-SMOKE: the shipped bundle boots clean, both hostile-storage boots banner without touching the blob, and reset over a corrupt blob stashes before it overwrites");
process.exit(0);
