// STATE-MATRIX RENDER SMOKE — mounts the real app, walks every tab in three
// states, fails on empty screens or silent-fallback fingerprints.
// The lesson, as machinery.
//
// Portability note: this used to shell out to `npx esbuild` and read
// /tmp/smoke-bundle.js. On Windows, Node resolves "/tmp" to C:\tmp, so the
// read threw ENOENT and this smoke could not run at all on the dev machine.
// It now builds through scripts/build.mjs and writes to the repo's own .tmp.

import fs from "node:fs";
import { JSDOM } from "jsdom";
import { buildForTests } from "../scripts/build.mjs";

const BANNED = ["RIR —", "undefined", "NaN", "[object Object]"];
/* The rail is NOW / TRAIN / MORE, and the four rooms he rarely opens live one
   predictable tap behind MORE — static demotion, never adaptive, because an
   interface that rearranges itself measured ~8% SLOWER than one that does not
   (Findlater & McGrenere, CHI 2004). This smoke must still walk every room in
   every state: demoting a screen must never mean it stops being exercised.
   PRIMARY are reachable from the bar; BEHIND_MORE need MORE clicked first. */
const PRIMARY = ["NOW", "TRAIN"];
const BEHIND_MORE = ["QUEUE", "BODY", "SLEEP", "LAB"];
const TABS = [...PRIMARY, ...BEHIND_MORE];
const MIN = { NOW: 300, TRAIN: 150, QUEUE: 200, BODY: 250, SLEEP: 250, LAB: 200 };

const bundle = fs.readFileSync(await buildForTests(), "utf8");

async function mount(mutateState) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    runScripts: "outside-only", pretendToBeVisual: true, url: "https://smoke.local/",
  });
  const { window } = dom;
  window.scrollTo = () => {};
  window.matchMedia = window.matchMedia ||
    (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));
  if (mutateState) {
    const seedProbe = new JSDOM(`<!doctype html><body><div id="root"></div>`, {
      runScripts: "outside-only", url: "https://smoke.local/",
    }).window;
    seedProbe.scrollTo = () => {};
    seedProbe.matchMedia = window.matchMedia;
    seedProbe.eval(bundle);
    await new Promise((r) => setTimeout(r, 60));
    const raw = seedProbe.localStorage.getItem("prep-ledger-v1");
    if (!raw) throw new Error("seed probe produced no state");
    const st = JSON.parse(raw);
    mutateState(st);
    window.localStorage.setItem("prep-ledger-v1", JSON.stringify(st));
  }
  window.eval(bundle);
  await new Promise((r) => setTimeout(r, 80));
  return window;
}

async function findClickable(window, label, pred) {
  let el = null;
  for (let tries = 0; tries < 40 && !el; tries++) {
    const cands = [...window.document.querySelectorAll("button, [role=button], div")];
    el = cands.find((b) => (pred ? pred(b) : b.textContent.trim().startsWith(label)));
    if (!el) await new Promise((r) => setTimeout(r, 50));
  }
  return el;
}

async function tabText(window, label) {
  /* Rooms behind MORE need two taps, exactly as he would make them. If MORE
     itself is missing, that is a real failure and must not be swallowed. */
  if (BEHIND_MORE.includes(label)) {
    const more = await findClickable(window, "MORE", (b) => b.tagName === "BUTTON" && b.textContent.trim().startsWith("MORE"));
    if (!more) throw new Error("MORE tab button missing — the demoted rooms are unreachable");
    more.click();
    await new Promise((r) => setTimeout(r, 60));
  }
  let btn = null;
  for (let tries = 0; tries < 40 && !btn; tries++) {
    btn = [...window.document.querySelectorAll("button, div")]
      .find((b) => b.textContent.trim().startsWith(label) && b.textContent.trim().length < 400);
    if (!btn) await new Promise((r) => setTimeout(r, 50));
  }
  if (!btn) throw new Error("tab entry missing after wait: " + label);
  btn.click();
  return new Promise((r) =>
    setTimeout(() => r(window.document.getElementById("root").textContent || ""), 60));
}

const todayISO = (() => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" +
         String(d.getDate()).padStart(2, "0");
})();

const states = [
  ["fresh", null],
  ["logged-today", (st) => {
    st.sessionLog[todayISO] = {
      entries: [{ id: "press", reps: [8, 8, 7], rir: 1, w: 245 }],
      at: Date.now(), note: "", niggles: [], dips: 0,
    };
  }],
  ["mid-history", (st) => { st.sleep.nights.push({ d: todayISO, h: 8, tags: [] }); }],
];

let failed = 0;
for (const [name, mut] of states) {
  const w = await mount(mut);
  for (const t of TABS) {
    const txt = await tabText(w, t);
    const hits = BANNED.filter((b) => txt.includes(b));
    if (hits.length) {
      console.error(`RENDER-SMOKE FAIL [${name}/${t}] banned: ${hits.join(", ")}`);
      hits.forEach((b) => {
        let i = txt.indexOf(b);
        while (i > -1) {
          console.error("   ctx: …" + txt.slice(Math.max(0, i - 90), i + 25).replace(/\s+/g, " ") + "…");
          i = txt.indexOf(b, i + 1);
        }
      });
      failed++;
    }
    if (txt.length < MIN[t]) {
      console.error(`RENDER-SMOKE FAIL [${name}/${t}] suspiciously empty (${txt.length} chars)`);
      failed++;
    }
  }
  w.close();
}

if (failed) {
  console.error(`RENDER-SMOKE: ${failed} failures`);
  process.exit(1);
}
console.log("RENDER-SMOKE: all tabs alive in all states — no silent fallbacks");
process.exit(0);
