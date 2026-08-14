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

/* ============ DRIVE G — v7.53.4 PARTS B + C: THE WEIGHT BOX ============
   Joe: "I can't save the weights in the weight box." Walked here on his OWN
   synced ledger, through the real SETUP-room controls.

   Part C: the room maps genSession's day-template cards, which carry no steps
   and no inc — so loadRungs read null, the free-entry input never rendered at
   all, and the -/+ stepped by a hardcoded 5. Part B: the Save then re-resolved
   the STORE record, found a ladder, and ran the entry through snapLoad, which
   keeps only rungs <= w — so an off-ladder 200 snapped DOWN to 190 and the feed
   filed "190 -> 190 · athlete entry on the card": a receipt describing a
   discarded entry as an adoption. */
async function driveWeightBox() {
  console.log("[B+C/weight box]");
  const L_ISO = "2026-08-21";   /* an unlogged LOWER day — hack and extension both live there */
  const live = JSON.parse(fs.readFileSync(at("ledger/state.json"), "utf8"));
  /* the pre-correction shape: with the 8/14 correction stamp removed, Part A's
     reconciler abstains and hack sits at 190 with its four-rung ladder — which
     is exactly the state Joe was looking at when the box refused his entry. */
  const preCorr = JSON.parse(JSON.stringify(live));
  /* LEG 3 — the gate is PER-ENTRY provenance now, so deleting the session corr
     no longer holds the load still (patchV54 stamps the entries whatever the
     session says — which is the doctrine change working). The robust way to
     express "the plan must not move here" is the athlete's OWN word being the
     newer one: his load stamps post-date any correction, so the reconciler
     abstains by its own rule and hack sits at 190 with its four-rung ladder —
     exactly the state he was looking at when the box refused his entry. This
     also survives a future schema bump, which stripping provenance would not. */
  delete preCorr.sessionLog["2026-08-14"].corr;
  for (const id9 of ["hack", "extension"]) { const e9 = preCorr.exercises.find((x) => x && x.id === id9); if (e9) e9.wAt = "2026-08-20T09:00:00.000Z"; }
  const openBox = async (w, id) => {
    await openGroup(w, "pl-train-setup");
    await sleep(120);
    const card = w.document.getElementById("tr-" + id);
    if (!card) { check(false, "", "[" + id + "] no card in the SETUP room on " + L_ISO); return null; }
    const pencil = [...card.querySelectorAll("span")].find((s) => /✎/.test(s.textContent || "") && !/rungs/.test(s.textContent || ""));
    if (!pencil) { check(false, "", "[" + id + "] no weight ✎ control on the card"); return null; }
    pencil.click(); await sleep(140);
    return w.document.getElementById("tr-" + id);
  };
  const wOf = (w, id) => ((stored(w).exercises || []).find((e) => e && e.id === id) || {});
  const feedLen = (w) => ((stored(w).feed || []).length);
  /* count only rows THIS action added (the feed unshifts, so new rows are at
     the head). His real feed already carries WEIGHT SET history — including
     two "HACK SQUAT 190 → 190" rows, the discarded-entry receipts this round
     kills — so a title filter would count production evidence as test output. */
  const addedSince = (w, n) => (stored(w).feed || []).slice(0, Math.max(0, feedLen(w) - n));

  /* ---- leg 1: the ladder lift, off-ladder entry ---- */
  {
    const { dom, w } = boot((w9) => { w9.localStorage.setItem(KEY, JSON.stringify(preCorr)); }, L_ISO);
    await sleep(600);
    await clickText(w, "TRAIN", "tab nav");
    const card = await openBox(w, "hack");
    if (!card) { dom.window.close(); return; }
    const nBefore = feedLen(w);
    const before = wOf(w, "hack");
    check(before.w === 190 && JSON.stringify(before.steps) === JSON.stringify([160, 170, 180, 190]),
      "the walk starts from the reported state: hack 190 on a four-rung ladder",
      "the fixture is not the reported state (observed w " + JSON.stringify(before.w) + " steps " + JSON.stringify(before.steps) + ")");
    const input = card.querySelector('input[aria-label="weight value"]');
    check(!!input, "PART C — the free-entry weight input RENDERS for a ladder lift (zero of these existed on the day-template read)", "no weight-value input in the SETUP room — the editor still cannot see the ladder");
    if (!input) {
      /* FAIL-FIRST EVIDENCE, not a fallback for the repaired build: on bytes
         where Part C has not landed the editor shows a Stepper instead, so the
         only reachable path is step-then-save. Drive it and RECORD what the
         save does with the displayed value — this is where the reported
         "190 → 190" receipt comes from, and the repaired build never reaches
         this branch because its input always renders. */
      const plusOld = [...card.querySelectorAll("button")].find((b) => (b.textContent || "").trim() === "+");
      if (plusOld) { for (let k = 0; k < 2; k++) { plusOld.click(); await sleep(70); } }
      const shown = (w.document.getElementById("tr-hack").textContent || "").match(/\b(\d{2,3}(?:\.\d+)?)\b/g);
      const nB = feedLen(w);
      const sv = [...w.document.getElementById("tr-hack").querySelectorAll("button")].find((b) => (b.textContent || "").trim() === "Save");
      if (sv) { sv.click(); await sleep(220); }
      const got = wOf(w, "hack");
      const rows = addedSince(w, nB);
      check(false, "", "SIGNATURE — stepped the box up and saved: persisted w " + JSON.stringify(got.w) + " (the entry was discarded by the snap), receipt filed " + JSON.stringify(rows.map((f) => f.t)) + " — a receipt describing a discarded entry as an adoption; displayed values on the card were " + JSON.stringify(shown && shown.slice(0, 4)));
      dom.window.close(); return;
    }
    check((card.textContent || "").indexOf("rung 4/4") > -1, "PART C — the rung chip reads the REAL ladder position: rung 4/4", "the rung chip is wrong or absent (card says: " + (card.textContent || "").slice(0, 120) + ")");
    await typeInto(w, input, "200");
    const card2 = w.document.getElementById("tr-hack");
    check(/new rung/.test(card2.textContent || ""), "PART C — an off-ladder 200 reads 'new rung', never a wrong n/n", "the chip did not say 'new rung' for an off-ladder entry");
    const saveBtn = [...card2.querySelectorAll("button")].find((b) => (b.textContent || "").trim() === "Save");
    check(!!saveBtn, "the Save control is present", "no Save control on the open editor");
    saveBtn.click(); await sleep(220);
    const after = wOf(w, "hack");
    check(after.w === 200 && typeof after.w === "number",
      "PART B — the entry SAVES: persisted w is the number 200, never snapped down to 190",
      "the entry was discarded (observed w " + JSON.stringify(after.w) + ", type " + typeof after.w + ")");
    check(JSON.stringify(after.steps) === JSON.stringify([160, 170, 180, 190, 200]),
      "PART B — the 200 rung JOINED the ladder, and no rung was erased",
      "the ladder did not take the new rung (observed " + JSON.stringify(after.steps) + ")");
    check(typeof after.wAt === "string" && after.last === null && after.topAt === null && after.topRun === 0,
      "PART B — CAGE parity: stamped, the old line cleared, and the sighting record reset for the new load",
      "the save skipped the stamp or the sighting reset (observed wAt " + JSON.stringify(after.wAt) + " last " + JSON.stringify(after.last) + " topAt " + JSON.stringify(after.topAt) + ")");
    const rcp = addedSince(w, nBefore);
    check(rcp.length === 1 && /190 → 200/.test(rcp[0].t) && /the 200 rung joined the ladder/.test(rcp[0].t),
      "PART B — exactly ONE new receipt, and it names what actually happened: " + JSON.stringify(rcp.map((f) => f.t)),
      "the receipt is wrong or duplicated (observed new rows " + JSON.stringify(rcp.map((f) => f.t)) + ")");
    /* the row re-reads at the new load */
    await sleep(80);
    const card3 = w.document.getElementById("tr-hack");
    check(/200/.test(card3.textContent || ""), "PART B — the row re-reads at 200", "the row still shows the old load");
    dom.window.close();
  }
  /* ---- leg 2: the no-op and garbage saves file NOTHING ---- */
  {
    const { dom, w } = boot((w9) => { w9.localStorage.setItem(KEY, JSON.stringify(preCorr)); }, L_ISO);
    await sleep(600);
    await clickText(w, "TRAIN", "tab nav");
    const card = await openBox(w, "hack");
    if (!card) { dom.window.close(); return; }
    const saveOnce = async (val) => {
      const c = w.document.getElementById("tr-hack");
      const inp = c.querySelector('input[aria-label="weight value"]');
      if (inp) await typeInto(w, inp, val);
      const c2 = w.document.getElementById("tr-hack");
      const b = [...c2.querySelectorAll("button")].find((x) => (x.textContent || "").trim() === "Save");
      if (b) { b.click(); await sleep(200); }
    };
    const n0 = feedLen(w);
    await saveOnce("190");   /* the SAME load he is already on */
    check(addedSince(w, n0).length === 0 && wOf(w, "hack").w === 190,
      "PART B — a no-change save files NOTHING: the '190 → 190' receipt that described a discarded entry as an adoption is gone (his own feed carries two of them)",
      "a no-change save still filed a receipt (observed new rows " + JSON.stringify(addedSince(w, n0).map((f) => f.t)) + ")");
    const n1 = feedLen(w);
    await openBox(w, "hack");
    await saveOnce("abc");   /* garbage */
    check(addedSince(w, n1).length === 0 && wOf(w, "hack").w === 190,
      "PART B — a garbage entry keeps the old load and files nothing",
      "garbage moved the load or filed a receipt (observed w " + JSON.stringify(wOf(w, "hack").w) + ", new rows " + JSON.stringify(addedSince(w, n1).map((f) => f.t)) + ")");
    dom.window.close();
  }
  /* ---- leg 3 (v7.53.4 FIX 5): the Save owns validation ATOMICALLY ----
     Executed on main: typed 20, CANCELED the "reads like a typo" confirm, and
     the app persisted 20 anyway, merged it as a rung and filed a receipt
     saying the rung joined the ladder. The sanity net ran on BLUR, where the
     Cancel raced the Save handler's own closure and lost. */
  {
    const { dom, w } = boot((w9) => { w9.localStorage.setItem(KEY, JSON.stringify(preCorr)); }, L_ISO);
    await sleep(600);
    await clickText(w, "TRAIN", "tab nav");
    const card = await openBox(w, "hack");
    if (!card) { dom.window.close(); return; }
    const asked = [];
    const typeSave = async (val, answer) => {
      w.confirm = (msg) => { asked.push(String(msg)); return answer; };
      const c = w.document.getElementById("tr-hack");
      const inp = c.querySelector('input[aria-label="weight value"]');
      if (inp) await typeInto(w, inp, val);
      const c2 = w.document.getElementById("tr-hack");
      const b = [...c2.querySelectorAll("button")].find((x) => (x.textContent || "").trim() === "Save");
      if (b) { b.click(); await sleep(200); }
    };
    /* (a) HE SAYS NO — nothing may move */
    const snap0 = JSON.stringify(stored(w));
    await typeSave("20", false);
    check(JSON.stringify(stored(w)) === snap0,
      "FIX 5 — CANCEL means CANCEL: the persisted state is BYTE-IDENTICAL after refusing the typo net (the executed red persisted w 20, merged 20 as a rung and filed a receipt)",
      "a refused entry still changed the state (hack now " + JSON.stringify(wOf(w, "hack").w) + ", steps " + JSON.stringify(wOf(w, "hack").steps) + ")");
    check(asked.length === 1 && /reads like a typo/.test(asked[0]),
      "FIX 5 — and the net asked EXACTLY ONCE, at the save (it used to fire on blur as well)",
      "the sanity net asked " + asked.length + " time(s): " + JSON.stringify(asked));
    check(!!w.document.getElementById("tr-hack").querySelector('input[aria-label="weight value"]'),
      "FIX 5 — the editor stays OPEN so he can correct it", "the editor closed on a refused entry");
    /* (b) HE SAYS YES — his word stands, and the override is on the record */
    const n0 = feedLen(w);
    asked.length = 0;
    await typeSave("20", true);
    const kept = wOf(w, "hack");
    const rows = addedSince(w, n0);
    check(kept.w === 20 && rows.some((f) => /^WEIGHT SET — /.test(f.t)) && rows.some((f) => /KEPT AN UNUSUAL NUMBER/.test(f.t)),
      "FIX 5 — CONFIRM means confirm: 20 persists on his say-so, with the unusual-number receipt beside the weight receipt",
      "the confirmed entry did not persist or lost its receipt (w " + JSON.stringify(kept.w) + ", rows " + JSON.stringify(rows.map((f) => f.t)) + ")");
    dom.window.close();
  }
  /* ---- leg 3: a strictly-numeric parse, at the save ---- */
  {
    const { dom, w } = boot((w9) => { w9.localStorage.setItem(KEY, JSON.stringify(preCorr)); }, L_ISO);
    await sleep(600);
    await clickText(w, "TRAIN", "tab nav");
    const card = await openBox(w, "hack");
    if (!card) { dom.window.close(); return; }
    let asked2 = 0;
    w.confirm = () => { asked2++; return true; };
    const snap1 = JSON.stringify(stored(w));
    const inp = card.querySelector('input[aria-label="weight value"]');
    if (inp) await typeInto(w, inp, "200abc");
    const b = [...w.document.getElementById("tr-hack").querySelectorAll("button")].find((x) => (x.textContent || "").trim() === "Save");
    if (b) { b.click(); await sleep(200); }
    check(JSON.stringify(stored(w)) === snap1 && asked2 === 0,
      "FIX 5 — \"200abc\" is REJECTED outright: it used to normalize silently to 200 and save with no dialog and no receipt. No mutation, no prompt",
      "garbage-with-digits still moved the state (w " + JSON.stringify(wOf(w, "hack").w) + ", prompts " + asked2 + ")");
    const still = w.document.getElementById("tr-hack").querySelector('input[aria-label="weight value"]');
    check(!!still && String(still.value) === "200abc",
      "FIX 5 — and the box still shows exactly what he typed, for him to fix",
      "the box lost or normalized his text (shows " + JSON.stringify(still && still.value) + ")");
    dom.window.close();
  }
  /* ---- leg 3: a JUMP lift (no ladder) still saves, as a NUMBER ---- */
  {
    const { dom, w } = boot((w9) => { w9.localStorage.setItem(KEY, JSON.stringify(preCorr)); }, L_ISO);
    await sleep(600);
    await clickText(w, "TRAIN", "tab nav");
    const card = await openBox(w, "extension");
    if (!card) { dom.window.close(); return; }
    check(!card.querySelector('input[aria-label="weight value"]'),
      "PART C — a lift with NO ladder still gets the Stepper, not the free input: the branch follows the real config both ways",
      "a jump lift wrongly rendered the ladder branch");
    const plus = [...card.querySelectorAll("button")].find((b) => (b.textContent || "").trim() === "+");
    if (plus) { plus.click(); await sleep(90); }
    const b = [...w.document.getElementById("tr-extension").querySelectorAll("button")].find((x) => (x.textContent || "").trim() === "Save");
    if (b) { b.click(); await sleep(200); }
    const ext = wOf(w, "extension");
    check(typeof ext.w === "number" && ext.w === 160,
      "PART B — the Stepper path saves a NUMBER (155 + one 5 lb jump = 160), never the input string",
      "the jump-lift save persisted the wrong type or value (observed " + JSON.stringify(ext.w) + ", type " + typeof ext.w + ")");
    dom.window.close();
  }
  /* ---- leg 4: A+B together on the REAL state — the box opens at the adopted load ---- */
  {
    const { dom, w } = boot((w9) => { w9.localStorage.setItem(KEY, JSON.stringify(live)); }, L_ISO);
    await sleep(600);
    await clickText(w, "TRAIN", "tab nav");
    const hk = wOf(w, "hack");
    check(hk.w === 200 && JSON.stringify(hk.steps) === JSON.stringify([160, 170, 180, 190, 200]),
      "PART A through the REAL BOOT: the reconciler runs on load and the plan follows the corrected record (200, rung joined)",
      "the boot did not reconcile the corrected load (observed w " + JSON.stringify(hk.w) + " steps " + JSON.stringify(hk.steps) + ")");
    const card = await openBox(w, "hack");
    if (!card) { dom.window.close(); return; }
    const inp = card.querySelector('input[aria-label="weight value"]');
    check(!!inp && Number(inp.value) === 200 && (card.textContent || "").indexOf("rung 5/5") > -1,
      "A+B INTERACTION — the box OPENS at 200 with the ladder already carrying the rung (rung 5/5)",
      "the box did not open at the adopted load (observed value " + JSON.stringify(inp && inp.value) + ", card: " + (card.textContent || "").slice(0, 100) + ")");
    dom.window.close();
  }
}

await driveTrainTyped();
await driveTrainBlank();
await driveGymTyped();
await driveOldDraft();
await drivePinFill();
await drivePinTokens();
await driveWeightBox();
if (failed) { console.log("SPLIT-SMOKE: " + failed + " check(s) failed"); process.exit(1); }
console.log("SPLIT-SMOKE: both modes drive the debut load and the pre-upgrade draft through the REAL handlers — render, type, finish, persist");
