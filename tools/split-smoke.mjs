// SPLIT SMOKE — the fix-round-2 PRODUCTION-BOUNDARY drives (R2 + R3), run
// against the SHIPPED bundle (app.js — the exact bytes Netlify serves) in
// jsdom with real clicks and real typed input. No helper injection, no source
// substrings: the named straw classes from round 1 are replaced here.
//
// Fail-first: PL_BUNDLE=<path> points the same drives at another bundle
// (the 554c5b7 artifact), and every check prints its OBSERVATION, so the red
// run records failure signatures, not statuses.
//
// The window's clock is PINNED (2026-08-20, a U day) — the suite's own
// fixed-clock lesson applied to the smoke: a drive that only works on
// training days would rot by weekday.

import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { at, tmp, ROOT } from "../scripts/lib.mjs";
import { pathToFileURL } from "node:url";

const bundlePath = process.env.PL_BUNDLE ? path.resolve(process.env.PL_BUNDLE) : at("app.js");
if (!fs.existsSync(bundlePath)) { console.error("SPLIT-SMOKE FAIL: bundle missing at " + bundlePath); process.exit(1); }
const BUNDLE = fs.readFileSync(bundlePath, "utf8");
const KEY = "prep-ledger-v1";
const PIN_ISO = "2026-08-20";
let failed = 0;
const check = (ok, good, bad) => { console.log(ok ? "  OK: " + good : "  FAIL: " + bad); if (!ok) failed++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function boot(prep, isoDay) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`,
    { url: "https://smoke.local/", runScripts: "outside-only", pretendToBeVisual: true });
  const w = dom.window;
  w.scrollTo = () => {};
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));
  w.fetch = () => Promise.resolve({ ok: false, status: 0, json: async () => ({}), text: async () => "" });
  /* THE PINNED CLOCK — with a mutable offset so rest timers can be advanced */
  const RealDate = w.Date;
  const BASE = new RealDate((isoDay || PIN_ISO) + "T15:00:00").getTime();
  const clock = { offset: 0 };
  function FakeDate(...a) { return a.length ? new RealDate(...a) : new RealDate(BASE + clock.offset); }
  FakeDate.now = () => BASE + clock.offset;
  FakeDate.parse = RealDate.parse; FakeDate.UTC = RealDate.UTC;
  FakeDate.prototype = RealDate.prototype;
  w.Date = FakeDate;
  if (prep) prep(w);
  try { w.eval(BUNDLE); } catch (e) { check(false, "", "bundle threw on boot: " + (e && e.message)); }
  return { dom, w, clock };
}
const q = (w, sel) => [...w.document.querySelectorAll(sel)];
const btnByText = (w, txt) => q(w, "button, [role=button]").find((b) => (b.textContent || "").includes(txt));
const clickText = async (w, txt, what) => {
  const b = btnByText(w, txt);
  if (!b) { check(false, "", "could not find control \"" + txt + "\" for " + what); return false; }
  b.click(); await sleep(90); return true;
};
const typeInto = async (w, el, v) => {
  Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, "value").set.call(el, v);
  el.dispatchEvent(new w.Event("input", { bubbles: true }));
  await sleep(60);
  el.dispatchEvent(new w.FocusEvent("focusout", { bubbles: true }));
  await sleep(60);
};
const stored = (w) => { try { return JSON.parse(w.localStorage.getItem(KEY) || "null"); } catch (e) { return null; } };
const openGroup = async (w, gid) => { const g = w.document.getElementById(gid); const hd = g && g.querySelector("[role=button]"); if (!hd) return false; if (hd.getAttribute("aria-expanded") === "true") return true; hd.click(); await sleep(160); return true; };   /* the header TOGGLES — re-calling it on an open room closed it and the surface under test went unrendered (caught by the R11 drive) */
const ruleSuspects = async (w) => { let n = 0; for (const b of q(w, "button").filter((x) => (x.textContent || "") === "I did this")) { b.click(); n++; await sleep(50); } return n; };

/* ================= DRIVE A — R2 TRAIN: typed debut load, real handler ================= */
async function driveTrainTyped() {
  console.log("[R2/train-typed]");
  const { dom, w } = boot();
  await sleep(500);
  await clickText(w, "TRAIN", "tab nav");
  await openGroup(w, "pl-train-setup");
  const card = w.document.getElementById("tr-fly");
  check(!!card, "the fly card renders in TRAIN", "no tr-fly card in TRAIN (observed ids: " + q(w, "[id^=tr-]").map((x) => x.id).join(",") + ")");
  const input = card && card.querySelector('input[aria-label="load used"]');
  check(!!input, "the LOAD USED entry renders on the null-w fly card (R2, manual mode)", "no load entry on the fly card — the debut load has no path in classic mode");
  if (!input) { dom.window.close(); return; }
  await typeInto(w, input, "90");
  await clickText(w, "Complete session — what moved?", "the classic complete handler");
  await sleep(300);
  const st = stored(w);
  const fly = st && (st.exercises || []).find((x) => x.id === "fly");
  const en = st && st.sessionLog && st.sessionLog[PIN_ISO] && (st.sessionLog[PIN_ISO].entries || []).find((e) => e.id === "fly");
  check(!!(fly && fly.w === 90 && typeof fly.wAt === "string"),
    "FINISH through the real handler ADOPTED the typed load, stamped (w=90)",
    "adoption did not fire through the classic handler (observed fly.w=" + JSON.stringify(fly && fly.w) + ", wAt=" + JSON.stringify(fly && fly.wAt) + ")");
  check(!!(en && en.w === 90 && en.og === 51),
    "the persisted entry carries the load and its generation (w=90, og=51)",
    "the persisted entry lost the load or generation (observed entry=" + JSON.stringify(en) + ")");
  dom.window.close();
}

/* ================= DRIVE B — R2 TRAIN: the BLANK completion leg ================= */
async function driveTrainBlank() {
  console.log("[R2/train-blank]");
  const { dom, w } = boot();
  await sleep(500);
  await clickText(w, "TRAIN", "tab nav");
  await clickText(w, "Complete session — what moved?", "the classic complete handler (nothing typed)");
  await sleep(300);
  const st = stored(w);
  const fly = st && (st.exercises || []).find((x) => x.id === "fly");
  const en = st && st.sessionLog && st.sessionLog[PIN_ISO] && (st.sessionLog[PIN_ISO].entries || []).find((e) => e.id === "fly");
  check(!!(fly && fly.w == null && en && en.w == null),
    "a BLANK completion logs honestly: no load invented, config stays null, the ask stands",
    "the blank leg invented a load (observed fly.w=" + JSON.stringify(fly && fly.w) + ", entry.w=" + JSON.stringify(en && en.w) + ")");
  dom.window.close();
}

/* ================= DRIVE C — R2 GYM: typed debut, full finish ================= */
async function driveGymTyped() {
  console.log("[R2/gym-typed]");
  const RULED_U = ["lateral", "press", "fly", "pulldown", "rows", "rearDelt", "curl", "tricep", "sulek"];
  const { dom, w, clock } = boot((w9) => {
    w9.sessionStorage.setItem("pl-resume-gym", "1");
    w9.localStorage.setItem("prep-ledger-gymdraft-" + PIN_ISO, JSON.stringify({
      reps: {}, rir: {}, rirEnd: {}, gskip: {}, touched: {}, rests: { n: 0, cut: 0 },
      idx: 2, setN: 0, restStart: 0, restLen: 0, phase: "lift",
      ids: RULED_U, pg: 51,
    }));
  });
  await sleep(500);
  await clickText(w, "TRAIN", "tab nav (the resume effect lives in LogTab)");
  await sleep(300);
  const body = () => w.document.body.textContent || "";
  check(body().includes("first session: enter the load you used") || body().includes("Machine fly"), "gym mode mounts at the fly (draft idx honoured)", "gym did not mount at the fly (body head: " + body().slice(0, 160) + ")");
  check(body().includes("first session: enter the load you used"), "the debut copy is VISIBLE on the null-w gym screen (round 1 wrote it inside a numeric gate — dead code)", "the gym debut copy did not render");
  const input = q(w, 'input[aria-label="weight lifted"]')[0];
  check(!!input, "the weight input renders for the null-w lift in gym mode", "no weight input on the null-w gym screen");
  if (!input) { dom.window.close(); return; }
  await typeInto(w, input, "90");
  check(body().includes("first load, adopts on finish"), "typing flips the copy to the adoption promise", "the adoption promise copy did not appear after typing (observed: " + body().slice(0, 60) + ")");
  const plus = q(w, 'button[aria-label="one rep more"]')[0];
  if (plus) { for (let i = 0; i < 12; i++) { plus.click(); await sleep(15); } }
  await clickText(w, "LOG SET", "bank set 1");
  const rirBtn = q(w, "button").filter((b) => (b.textContent || "").trim() === "2").pop();
  if (rirBtn) { rirBtn.click(); await sleep(90); }
  clock.offset += 10 * 60 * 1000;   /* the rest expires under the pinned clock */
  await sleep(900);
  await clickText(w, "LOG SET", "bank set 2 (terminal)");
  const preDone = body();
  const rirEndBtn = q(w, "button").filter((b) => (b.textContent || "").trim() === "1").pop();
  if (rirEndBtn) { rirEndBtn.click(); await sleep(90); }
  /* F2 (round 3): the lift-done receipt prints the EFFECTIVE load — the typed
     90, not the null config (which rendered as "at " on 0c4c2a0) */
  check(body().includes("at 90"), "the lift-done receipt prints the TYPED load (at 90) — F2", "the lift-done receipt does not print the typed load — 'at 90' absent (old bytes printed 'at ' from the null config)");
  /* fly is 3rd of 9 — walk the tail: NEXT LIFT off fly's done screen, then
     "skip lift" through each remaining lift (the honest skip path), and the
     last skip lands on the all-done screen */
  await clickText(w, "NEXT LIFT", "advance off the fly's done screen");
  for (let g = 0; g < 12; g++) {
    if (btnByText(w, "LOG IT — RECEIPT + DEBRIEF")) break;
    const sk = btnByText(w, "skip lift");
    if (sk) { sk.click(); await sleep(80); continue; }
    const fin = btnByText(w, "FINISH SESSION");
    if (fin) { fin.click(); await sleep(80); continue; }
    const nx = btnByText(w, "NEXT LIFT");
    if (nx) { nx.click(); await sleep(80); continue; }
    break;
  }
  /* F2 (round 3): the session-complete belt prints the EFFECTIVE load too —
     "@ 90", and the word null appears NOWHERE on the attestation screen */
  check(body().includes("@ 90"), "the all-done belt prints the TYPED load (@ 90) — F2", "the all-done belt does not print the typed load (old bytes printed '@ null')");
  check(!body().includes("@ null") && !body().includes("at null"), "no 'null' anywhere on the attestation screens — F2", "the attestation screen prints the word null (observed '@ null': " + body().includes("@ null") + ")");
  await ruleSuspects(w);
  await clickText(w, "LOG IT — RECEIPT + DEBRIEF", "the gym finish handler");
  await sleep(300);
  const st = stored(w);
  const fly = st && (st.exercises || []).find((x) => x.id === "fly");
  const en = st && st.sessionLog && st.sessionLog[PIN_ISO] && (st.sessionLog[PIN_ISO].entries || []).find((e) => e.id === "fly");
  check(!!(fly && fly.w === 90 && typeof fly.wAt === "string" && en && en.w === 90 && en.og === 51),
    "gym FINISH through the real handler: typed load adopted + persisted with generation (w=90, og=51)",
    "the gym finish did not carry the typed load through (observed fly.w=" + JSON.stringify(fly && fly.w) + ", entry=" + JSON.stringify(en) + ")");
  dom.window.close();
}

/* ================= DRIVE D — R3: a REAL pre-upgrade draft crosses the migration ================= */
function v50State() {
  /* boot once to obtain the seed bytes, then shape a REAL v50 state from them */
  const { dom, w } = boot();
  return new Promise(async (resolve) => {
    await sleep(500);
    const s = stored(w);
    dom.window.close();
    s.v = 50; delete s.insertions; delete s.retirements; delete s.planGen;
    s.exercises = (s.exercises || []).filter((e) => e.id !== "fly" && e.id !== "hipthrust");
    s.exercises.push({ id: "pronated", mg: "forearms", n: "Pronated EZ curl", day: "U", w: 40, inc: 5, sets: 2, hi: 13, last: [12, 11], setup: "SET · EZ bar, pronated grip\ncue" });
    s.exOrder = { U: s.exercises.filter((e) => e.day === "U").map((e) => e.id), L: s.exercises.filter((e) => e.day === "L").map((e) => e.id) };
    resolve(s);
  });
}
async function driveOldDraft() {
  console.log("[R3/pre-upgrade draft]");
  const v50 = await v50State();
  /* the EXACT 9e40815 draft field set: no ids, no pg, no wOver */
  const oldDraft = JSON.stringify({ reps: { pronated: [12, 11] }, rir: { pronated: 2 }, rirEnd: { pronated: 1 }, gskip: {}, touched: { pronated: true }, rests: { n: 2, cut: 0 }, idx: 0, setN: 0, restStart: 0, restLen: 0, phase: "lift" });
  /* leg 1 — GYM mount across the migration */
  {
    const { dom, w } = boot((w9) => {
      w9.localStorage.setItem(KEY, JSON.stringify(v50));
      w9.localStorage.setItem("prep-ledger-gymdraft-" + PIN_ISO, oldDraft);
      w9.sessionStorage.setItem("pl-resume-gym", "1");
    });
    await sleep(500);
    await clickText(w, "TRAIN", "tab nav (the resume effect lives in LogTab)");
    await sleep(300);
    const body = w.document.body.textContent || "";
    check((stored(w) || {}).v === 51 || (stored(w) || {}).v > 50, "the v50 state migrated on boot (v=" + JSON.stringify((stored(w) || {}).v) + ")", "migration did not run (v=" + JSON.stringify((stored(w) || {}).v) + ")");
    /* SHARPENED after the fail-first run: the orphan-belt card at TRAIN top
       prints the draft's lift NAMES, so a bare string match went green on the
       old bundle while the draft sat quarantined. The mount claim requires the
       name present AND the orphan card absent. */
    check((body.includes("Pronated EZ curl") || body.includes("PRONATED EZ CURL")) && !body.includes("A DRAFT FROM"),
      "GYM resume mounts the captured pronated from the PRESERVED record across the migration (and it was NOT orphaned)",
      "the captured pronated did not truly mount in gym mode (orphaned: " + body.includes("A DRAFT FROM") + ", name present: " + (body.includes("Pronated EZ curl") || body.includes("PRONATED EZ CURL")) + ")");
    dom.window.close();
  }
  /* leg 2 — CLASSIC mount + FINISH with old-era provenance */
  {
    const { dom, w } = boot((w9) => {
      w9.localStorage.setItem(KEY, JSON.stringify(v50));
      w9.localStorage.setItem("prep-ledger-gymdraft-" + PIN_ISO, oldDraft);
    });
    await sleep(600);
    await clickText(w, "TRAIN", "tab nav");
    await openGroup(w, "pl-train-setup");
    const body2 = w.document.body.textContent || "";
    check(!!w.document.getElementById("tr-pronated") && !body2.includes("A DRAFT FROM"),
      "CLASSIC mode mounts the draft's frozen template too (the tr-pronated card itself, not the orphan belt's name-drop)",
      "classic mode did not truly mount the frozen template (tr-pronated card: " + !!w.document.getElementById("tr-pronated") + ", orphaned: " + body2.includes("A DRAFT FROM") + ")");
    await clickText(w, "Complete session — what moved?", "the classic complete handler");
    await sleep(300);
    const st = stored(w);
    const sess = st && st.sessionLog && st.sessionLog[PIN_ISO];
    const en = sess && (sess.entries || []).find((e) => e.id === "pronated");
    check(!!(en && en.og === 50),
      "the pre-upgrade draft finishes with OLD-ERA provenance (og=50 — absent draft provenance classifies old, the proposals' own rule)",
      "the completion carried the WRONG generation (observed entry=" + JSON.stringify(en) + " of " + JSON.stringify((sess && (sess.entries || []).map((e) => e.id)) || null) + ")");
    const pd = st && (st.exercises || []).find((e) => e.id === "pulldown");
    check(!!(pd && (pd.forks || []).some((f) => f && f.ops && f.ops.indexOf("fly inserted upstream") > -1)),
      "the V51 seams are intact after the old-draft completion",
      "a seam was lost finishing the old draft (pulldown forks: " + JSON.stringify(pd && pd.forks) + ")");
    dom.window.close();
  }
}

/* ============ DRIVE E — R11: Sol's chronology through the REAL fill surface ============
   8/20 session logged -> 8/21 pins filled BY CLICKING the surface (not a state
   write) -> 8/22 sweep stamps calibratedAt -> the 8/20 session must STILL read
   provisional. Round 2's rig wrote setupAt directly under the frozen clock and
   passed falsely; this drives the writer that actually exists. */
async function drivePinFill() {
  console.log("[R11/pin-fill surface]");
  /* leg 1 — log the 8/20 fly session */
  const b1 = boot();
  await sleep(500);
  await clickText(b1.w, "TRAIN", "tab nav");
  await openGroup(b1.w, "pl-train-setup");
  const card0 = b1.w.document.getElementById("tr-fly");
  const wIn0 = card0 && card0.querySelector('input[aria-label="load used"]');
  if (wIn0) await typeInto(b1.w, wIn0, "90");
  await clickText(b1.w, "Complete session — what moved?", "log the 8/20 session");
  await sleep(300);
  const st0 = stored(b1.w);
  check(!!(st0 && st0.sessionLog && st0.sessionLog[PIN_ISO]), "the 8/20 session is on the record", "no 8/20 session logged");
  b1.dom.window.close();
  /* leg 2 — THE FILL SURFACE, on the next unlogged U day (8/23). In production
     the SETUP room renders the CURRENT unlogged session's lifts, so a day
     already logged unmounts it; Joe fills at the machine on a training day.
     Same real surface, same real clicks. */
  const FILL_ISO = "2026-08-23";
  const b2 = boot((w9) => { w9.localStorage.setItem(KEY, JSON.stringify(st0)); }, FILL_ISO);
  const w = b2.w, dom = b2.dom;
  await sleep(500);
  await clickText(w, "TRAIN", "tab nav");
  await openGroup(w, "pl-train-setup");
  await sleep(150);
  const pinInputs = q(w, 'input[aria-label^="pin "]');
  check(pinInputs.length > 0, "the SETUP room renders a fill input per unfilled [PIN] (R11b — the surface the R3 ruling ordered)", "no pin-fill surface exists in the SETUP room ([PIN]s can never be filled on a device, so calibratedAt can never stamp)");
  if (!pinInputs.length) { dom.window.close(); return; }
  const beforeBorn = (stored(w).exercises.find((e) => e.id === "fly") || {}).pinsBornAt;
  /* fill EVERY pin on the fly card by clicking Pin it, one at a time */
  for (let g = 0; g < 8; g++) {
    const cardP = w.document.getElementById("tr-fly");
    const inp = cardP && cardP.querySelector('input[aria-label^="pin "]');
    if (!inp) break;
    await typeInto(w, inp, "3");
    const row = inp.closest("div");
    const btn = row && [...row.querySelectorAll("button")].find((b) => (b.textContent || "").indexOf("Pin it") > -1);
    if (!btn) { check(false, "", "the Pin it control is missing beside the input"); break; }
    btn.click(); await sleep(160);
  }
  const st1 = stored(w);
  const fly1 = st1.exercises.find((e) => e.id === "fly");
  check(String(fly1.setup).indexOf("[PIN]") < 0, "every [PIN] token is filled through the real surface", "tokens remain after the fill walk (observed setup: " + String(fly1.setup).slice(0, 90) + ")");
  check(fly1.pinsBornAt === beforeBorn, "the fill did NOT move the pin birthday (pinsBornAt immutable)", "the fill moved pinsBornAt (observed " + JSON.stringify(fly1.pinsBornAt) + " was " + JSON.stringify(beforeBorn) + ")");
  const cardAfter = w.document.getElementById("tr-fly");
  check(!!cardAfter && (cardAfter.textContent || "").indexOf("CALIBRATION INCOMPLETE") < 0, "the blocker line is gone after the last pin", "the blocker line survives a complete fill");
  dom.window.close();
  /* the SWEEP stamps calibratedAt, then the 8/20 debrief must still be provisional.
     runAdaptive is the same sweep the app runs on open — driven here on the
     PERSISTED bytes the browser just wrote, which is the production artifact. */
  /* PORTABILITY (fix-5): this bundle is built through esbuild's JS API — the
     same library scripts/build.mjs uses — and NEVER by invoking
     node_modules/esbuild/bin/esbuild through node. On Windows that file is a
     JS shim, so the child process worked here and the gate read ALL GREEN; on
     Linux esbuild's install replaces it with the NATIVE ELF binary, node
     cannot execute ELF, and the child dies with "SyntaxError: Invalid or
     unexpected token" — which is CI, on ubuntu, printing BLOCKED the moment
     this merged. The API call has no platform surface at all.
     PL_ENGINE still overrides: it is the fail-first lever, pointing these same
     legs at another tip's engine bundle. */
  const engPath = process.env.PL_ENGINE ? path.resolve(process.env.PL_ENGINE) : await (async () => {
    const out = tmp("_smoke-engine.mjs");
    const esbuild = (await import("esbuild")).default;
    await esbuild.build({
      entryPoints: [at("src/app.jsx")],
      bundle: true, platform: "node", format: "esm", outfile: out,
      loader: { ".jsx": "jsx" },
      external: ["react", "react-dom", "react/jsx-runtime"],
      absWorkingDir: ROOT, logLevel: "silent",
    });
    return out;
  })();
  const eng = await import(pathToFileURL(engPath).href).catch((e) => { check(false, "", "could not load the engine for the post-fill sweep: " + (e && e.message)); return null; });
  const T2 = eng && eng.__test;
  if (!T2) return;
  const swept = T2.runAdaptive(JSON.parse(JSON.stringify(st1)), "2026-08-22");
  const flyS = swept.exercises.find((e) => e.id === "fly");
  check(!!flyS.calibratedAt, "the sweep stamps calibratedAt with no new mechanism (observed " + JSON.stringify(flyS.calibratedAt) + ")", "calibratedAt never stamped after a complete fill");
  const db = T2.sessionDebrief(swept, PIN_ISO);
  const lab = JSON.stringify(db || {}).toLowerCase().indexOf("logged before calibration") > -1;
  check(lab === true, "SOL'S CHRONOLOGY: the 8/20 session STILL reads provisional after the pins were filled and the stamp landed", "the pre-calibration session lost its provisional status (the exact R11 defect: observed label present: " + lab + ")");
  const swept2 = T2.completeSession(swept, "2026-08-23", [{ id: "fly", reps: [13, 12], rir: 2 }], { clean: true, last: { h: 8 }, mean3: 8 }, { pg: 51 }).s;
  const lab2 = JSON.stringify(T2.sessionDebrief(swept2, "2026-08-23") || {}).toLowerCase().indexOf("logged before calibration") > -1;
  check(lab2 === false, "a POST-calibration session reads normal", "a post-calibration session is wrongly labeled provisional");
  const preCue = JSON.parse(JSON.stringify(swept));
  const lab3 = JSON.stringify(T2.sessionDebrief(preCue, "2026-08-06") || {}).toLowerCase().indexOf("logged before calibration") > -1;
  check(lab3 === false, "a PRE-CUE session (before the pin birthday) is never labeled", "a pre-cue session is wrongly labeled provisional");
}

/* ============ DRIVE F — R11-B: the fill surface, NON-SERIALLY ============
   The round-4 smoke always filled the FIRST input and so masked both defects
   Sol and cowork then found in the browser: every input carried the FIRST
   token's label, and the buffers were keyed by index in the SHRINKING
   unfilled list, so committing an earlier token slid a later token's typed
   value onto the wrong setting and orphaned the last.

   THE CONTRACT, not the shape: every sentinel is typed EXACTLY ONCE, for its
   own token ordinal, and is never re-typed after a commit — so a design that
   displaces values cannot be rescued by the driver. Each pass types the next
   untyped sentinel into any EMPTY rendered input (in DOM order), then commits
   the first rendered input. Works against one input or three. */
async function drivePinTokens() {
  console.log("[R11-B/pin tokens, non-serial]");
  const L_ISO = "2026-08-21";   /* an L day — hip thrust and hanging both live there */
  const CASES = [
    { id: "hipthrust", labels: ["machine setting", "belt/pad landmark", "foot marks"] },
    { id: "hanging", labels: ["medicine-ball pad at", "knee bend"] },
  ];
  const { dom, w } = boot(null, L_ISO);
  await sleep(500);
  await clickText(w, "TRAIN", "tab nav");
  await openGroup(w, "pl-train-setup");
  await sleep(150);
  for (const c of CASES) {
    const card0 = w.document.getElementById("tr-" + c.id);
    if (!card0) { check(false, "", "[" + c.id + "] no card in the SETUP room"); continue; }
    const n0 = (String((stored(w).exercises.find((e) => e.id === c.id) || {}).setup || "").match(/\[PIN\]/g) || []).length;
    const sent = Array.from({ length: n0 }, (_, i) => "FOR-TOKEN-" + (i + 1));
    const typed = new Set();
    const seenLabels = [];
    for (let pass = 0; pass < n0 + 2; pass++) {
      const card = w.document.getElementById("tr-" + c.id);
      const inputs = card ? [...card.querySelectorAll('input[aria-label^="pin "]')] : [];
      if (!inputs.length) break;
      for (const inp of inputs) {
        const lb = (inp.getAttribute("aria-label") || "").replace(/^pin /, "");
        if (seenLabels.indexOf(lb) < 0) seenLabels.push(lb);
      }
      const before = String((stored(w).exercises.find((e) => e.id === c.id) || {}).setup || "");
      for (const inp of inputs) {
        if (inp.value) continue;                      /* never overwrite what is already on screen */
        const next = sent.find((x) => !typed.has(x));
        if (!next) continue;                          /* every sentinel has been typed ONCE — no re-typing rescues a displacing design */
        typed.add(next);
        await typeInto(w, inp, next);
      }
      const card2 = w.document.getElementById("tr-" + c.id);
      const first = card2 && card2.querySelector('input[aria-label^="pin "]');
      const row = first && first.closest("div");
      const btn = row && [...row.querySelectorAll("button")].find((b) => (b.textContent || "").indexOf("Pin it") > -1);
      if (!btn) break;
      btn.click(); await sleep(160);
      const after = String((stored(w).exercises.find((e) => e.id === c.id) || {}).setup || "");
      if (after === before) break;                    /* no progress — a swallowed commit */
    }
    const cue = String((stored(w).exercises.find((e) => e.id === c.id) || {}).setup || "");
    const placed = c.labels.map((lb, i) => cue.indexOf(lb + " FOR-TOKEN-" + (i + 1)) > -1);
    check(placed.every(Boolean),
      "[" + c.id + "] every typed value commits to the token it was typed for, under a non-serial fill (" + c.labels.map((lb, i) => lb + "=" + (placed[i] ? "ok" : "WRONG")).join(" · ") + ")",
      "[" + c.id + "] a value landed on the wrong setting or was lost (cue now: " + cue.split(String.fromCharCode(10))[0] + ")");
    check(cue.indexOf("[PIN]") < 0, "[" + c.id + "] no token left unfilled — nothing was silently dropped", "[" + c.id + "] a token is still unfilled after the walk (cue: " + cue.split(String.fromCharCode(10))[0] + ")");
    check(seenLabels.length === c.labels.length && new Set(seenLabels).size === seenLabels.length,
      "[" + c.id + "] each token's input carried ITS OWN label — " + seenLabels.length + " distinct across the walk",
      "[" + c.id + "] labels repeated across tokens (observed: " + JSON.stringify(seenLabels) + ")");
    const rec = stored(w).exercises.find((e) => e.id === c.id) || {};
    check(rec.pinsBornAt === "2026-08-12T00:00:00.000Z" || (rec.pinsBornAt || "").indexOf("2026-08-13") === 0,
      "[" + c.id + "] pinsBornAt untouched by every commit (observed " + JSON.stringify(rec.pinsBornAt) + ")",
      "[" + c.id + "] a commit moved the pin birthday (observed " + JSON.stringify(rec.pinsBornAt) + ")");
  }
  const stF = stored(w);
  dom.window.close();
  const engPath2 = process.env.PL_ENGINE ? path.resolve(process.env.PL_ENGINE) : tmp("_smoke-engine.mjs");
  const eng2 = await import(pathToFileURL(engPath2).href).catch(() => null);
  const T3 = eng2 && eng2.__test;
  if (!T3) { check(false, "", "could not load the engine for the post-fill calibration sweep"); return; }
  const swept = T3.runAdaptive(JSON.parse(JSON.stringify(stF)), "2026-08-23");
  const ht = swept.exercises.find((e) => e.id === "hipthrust") || {};
  check(!!ht.calibratedAt, "the calibration sweep still stamps after the last token (observed " + JSON.stringify(ht.calibratedAt) + ")", "calibratedAt never stamped after a complete non-serial fill");
}

await driveTrainTyped();
await driveTrainBlank();
await driveGymTyped();
await driveOldDraft();
await drivePinFill();
await drivePinTokens();
if (failed) { console.log("SPLIT-SMOKE: " + failed + " check(s) failed"); process.exit(1); }
console.log("SPLIT-SMOKE: both modes drive the debut load and the pre-upgrade draft through the REAL handlers — render, type, finish, persist");
