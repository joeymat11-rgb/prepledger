// STATE-MATRIX RENDER SMOKE — mounts the real app, walks every tab in three states,
// fails on empty screens or silent-fallback fingerprints. The lesson, as machinery.
import { JSDOM } from "jsdom";
import { execSync } from "child_process";
import fs from "fs";

const BANNED = ["RIR —", "undefined", "NaN", "[object Object]"];
const TABS = ["NOW", "TRAIN", "QUEUE", "BODY", "SLEEP", "LAB"];
const MIN = { NOW: 300, TRAIN: 150, QUEUE: 200, BODY: 250, SLEEP: 250, LAB: 200 };

execSync(`npx esbuild src/main.jsx --bundle --loader:.jsx=jsx --jsx=automatic --define:process.env.NODE_ENV='"production"' --outfile=/tmp/smoke-bundle.js`, { stdio: "pipe" });
const bundle = fs.readFileSync("/tmp/smoke-bundle.js", "utf8");

async function mount(mutateState) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, { runScripts: "outside-only", pretendToBeVisual: true, url: "https://smoke.local/" });
  const { window } = dom;
  window.scrollTo = () => {};
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener: () => {}, removeListener: () => {} }));
  if (mutateState) {
    const seedProbe = new JSDOM(`<!doctype html><body><div id="root"></div>`, { runScripts: "outside-only", url: "https://smoke.local/" }).window;
    seedProbe.scrollTo = () => {}; seedProbe.matchMedia = window.matchMedia;
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

async function tabText(window, label) {
  let btn = null;
  for (let tries = 0; tries < 40 && !btn; tries++) {
    btn = [...window.document.querySelectorAll("button")].find((b) => b.textContent.trim().startsWith(label));
    if (!btn) await new Promise((r) => setTimeout(r, 50));
  }
  if (!btn) throw new Error("tab button missing after wait: " + label);
  btn.click();
  return new Promise((r) => setTimeout(() => r(window.document.getElementById("root").textContent || ""), 60));
}

const todayISO = (() => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); })();
const states = [
  ["fresh", null],
  ["logged-today", (st) => { st.sessionLog[todayISO] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 1, w: 245 }], at: Date.now(), note: "", niggles: [], dips: 0 }; }],
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
      hits.forEach((b) => { let i = txt.indexOf(b); while (i > -1) { console.error("   ctx: …" + txt.slice(Math.max(0, i - 90), i + 25).replace(/\s+/g, " ") + "…"); i = txt.indexOf(b, i + 1); } });
      failed++;
    }
    if (txt.length < MIN[t]) { console.error(`RENDER-SMOKE FAIL [${name}/${t}] suspiciously empty (${txt.length} chars)`); failed++; }
  }
  w.close();
}
if (failed) { console.error(`RENDER-SMOKE: ${failed} failures`); process.exit(1); }
console.log("RENDER-SMOKE: all tabs alive in all states — no silent fallbacks");

process.exit(0);
