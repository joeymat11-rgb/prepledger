import { useState, useEffect, useCallback } from "react";
import { HISTORY } from "./history.js";

/* ============================================================
   PREP LEDGER v2 — the adaptive build
   Sessions generate themselves. Loads are earned, owned, then
   queued automatically. Macro numbers recompute from trend data
   and arm as one-tap adjustments — nothing macro moves invisibly.
   Coach holds authority on structure beyond the encoded ladder.
   ============================================================ */

/* ---------- tokens ---------- */
const T = {
  ink: "#101418", plate: "#181E24", plate2: "#1E252D", line: "#2A323B",
  chalk: "#E8E4DA", steel: "#8A93A0", dim: "#5C6672",
  jade: "#4CC38A", brass: "#E5B454", orange: "#FF8C42", redline: "#E5484D",
};
const disp = "'Barlow Condensed', system-ui, sans-serif";
const mono = "'IBM Plex Mono', ui-monospace, monospace";
const body = "'Barlow', system-ui, sans-serif";

/* ---------- date utils ---------- */
const DAY = 86400000;
const mk = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
const todayStart = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const daysUntil = (s) => Math.round((mk(s) - todayStart()) / DAY);
const fmtShort = (s) => { const d = mk(s); return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`; };
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;

const APP_V = "3.8.1";
const START = "2026-06-10";
const SEAL_UNTIL = "2026-07-27";
const CROSSOVER = "2026-08-28";

/* ---------- phase definitions ---------- */
const PHASES = {
  "EASE 1": { cal: 1750, band: [1725, 1800], steps: "16–17k", note: "" },
  "EASE 2": { cal: 2375, band: [2350, 2400], steps: "taper ~10–15% off Ease-1", note: "fired by est. BF crossing ~13%" },
};
const REFEED = { cal: "2,450–2,500", note: "weekly Wednesday — prescribed, not permitted" },
  PROTEIN = 175, FAT_FLOOR = 50;

/* ---------- exercise seed (state as of Wed 7/22/26) ---------- */
const EXERCISES = [
  /* UPPER — order per the 7/20 session note */
  { id: "lateral", mg: "delts", lastMeta: { d: "2026-07-20", w: 80, reps: [14, 13, 13], debt: true }, n: "Lateral machine", day: "U", w: 80, inc: 5, sets: 3, hi: 15, last: [14, 13, 13],
    setup: "SET · resistance profile 5 · seat 5\nUpright, elbow-led (the set-4 fix) · no shrug creep · smooth top, no swing" },
  { id: "rearDelt", mg: "delts", lastMeta: { d: "2026-07-20", w: 20, reps: [10, 10], debt: true }, n: "Rear-delt fly (cable)", day: "U", w: 20, inc: 2.5, sets: 2, hi: 12, last: [10, 10], note: "honest 10s — no hot opener",
    setup: "SET · unilateral · cable at highest height\nChest tall, shoulders back & down (?) · pure sweep — the opener fix is proven here" },
  { id: "rows", mg: "back", lastMeta: { d: "2026-07-20", w: 175, reps: [10, 10], debt: true }, n: "Rows (strapless)", day: "U", w: 175, inc: 5, sets: 2, hi: 10, last: [10, 10],
    setup: "SET · seat 4 · chest pad 7 · retrace profile 1\nChest stays glued to pad · pinch the blades at the back · strapless is the standard" },
  { id: "curl", mg: "biceps", lastMeta: { d: "2026-07-20", w: "55·55·50", reps: [12, 8, 10], debt: true }, n: "Curls", day: "U", w: "55·55·50", inc: 5, sets: 3, hi: 12, last: [12, 8, 10], ladder: { set: 1, top: 12 },
    setup: "SET · resistance profile 5 · seat 3\nSet 2 is the money set · no shoulder creep when it grinds" },
  { id: "press", mg: "chest", lastMeta: { d: "2026-07-20", w: 245, reps: [8, 7, 6], debt: true }, n: "Press", day: "U", w: 245, inc: 5, sets: 3, hi: 9, last: [8, 7, 6], std: [8, 8, 7], own: true, ownNote: "repeat 8,8,7 on a clean day — no load until owned",
    setup: "SET · cam 5 · lowest seat\nShoulders back & down into the pad · no bottom bounce — this lift was won on the honest opener" },
  { id: "pulldown", mg: "back", lastMeta: { d: "2026-07-20", w: 160, reps: [8, 8], debt: true }, n: "Pulldown", day: "U", w: 160, inc: 10, sets: 2, hi: 10, last: [8, 8],
    setup: "SET · silver bar · thumbs in the same spot every session\nSame grip = comparable reps · chest up, elbows down-and-in · strapless" },
  { id: "sulek", mg: "forearms", lastMeta: { d: "2026-07-20", w: 87.5, reps: [12, 8], debt: true }, n: "Sulek curl (forearm)", day: "U", w: 87.5, inc: 2.5, sets: 2, hi: 15, last: [12, 8],
    setup: "SET · cable, highest rung · straight bar\nSam Sulek's signature — strict curl biasing the forearm flexors · elbows quiet, slow negative" },
  { id: "tricep", mg: "triceps", lastMeta: { d: "2026-07-20", w: 55, reps: [12, 11, 10], debt: true }, n: "Tricep", day: "U", w: 55, inc: 5, sets: 3, hi: 13, last: [12, 11, 10],
    setup: "SET · seat 4 · back pad all the way forward · middle peg through the cut\nElbows pinned · bottom-peg stretch waits for the build phase" },
  { id: "pronated", mg: "forearms", lastMeta: { d: "2026-07-20", w: 40, reps: [12, 11], debt: true }, n: "Pronated EZ curl", day: "U", w: 40, inc: 5, sets: 2, hi: 13, last: [12, 11],
    setup: "SET · EZ bar, pronated grip\nElbows pinned to sides, zero swing · wrists locked — don't let them bend back under load · 2–3 s negative, that's where this one grows · your 11,6 session was the hot-opener demo" },
  /* LOWER — order per the 7/17 & 7/21 notes, identical both days */
  { id: "calves", mg: "calves", lastMeta: { d: "2026-07-21", w: 315, reps: [12, 10, 9, 8], debt: true }, n: "Calves", day: "L", w: 315, inc: 15, sets: 4, hi: 13, last: [12, 10, 9, 8], reclaim: [13, 12, 11, 10],
    setup: "SET · shoulder height 4\n5 s pause in the stretched position · back up to neutral · no bounce out of the hole — the pause IS the rep · drive through the big toe" },
  { id: "abs", mg: "abs", lastMeta: { d: "2026-07-21", w: 95, reps: [14, 13, 13], debt: true }, n: "Abs", day: "L", w: 100, inc: 5, sets: 3, hi: 14, last: null, first: [12, 12, 12], debutNote: "DEBUT — new baseline, log honest",
    setup: "SET · back pad A · seat 6\nSame tempo every session — the load only moves on clean, even reps" },
  { id: "hanging", mg: "abs", lastMeta: { d: "2026-07-21", w: "BW", reps: [6, 5], debt: true }, n: "Hanging raise", day: "L", w: "BW", inc: null, sets: 2, hi: 8, last: [6, 5],
    setup: "SET · bodyweight\nSlouch down/out to engage the core at rep 1 · constant tension, spine stays rounded · no swing between reps" },
  { id: "hack", mg: "quads", lastMeta: { d: "2026-07-21", w: "hold", reps: [13, 12], debt: true }, n: "Hack squat", day: "L", w: "hold", inc: null, sets: 2, hi: 13, last: [13, 12], pendingThird: true,
    setup: "SET · foot placement = your favorited pic\nSame depth every rep · even sets are the standard here (11,11 → 12,12 → 13,13)" },
  { id: "extension", mg: "quads", lastMeta: { d: "2026-07-21", w: 155, reps: [9, 6], debt: true }, n: "Leg extension", day: "L", w: 150, inc: 5, sets: 2, hi: 10, last: [9, 6], std: [9, 9], own: true, ownNote: "own 150×9,9 — then the 155 gate reopens",
    setup: "SET · shin pad height A · depth 3 · seat back all the way back — max quad stretch\nNo jerk at lockout · runs after hack by design — read dips as order effect, not regression" },
  { id: "ham", mg: "hams", lastMeta: { d: "2026-07-21", w: 120, reps: [10, 10], debt: true }, n: "Ham curl", day: "L", w: 120, inc: 10, sets: 2, hi: 12, last: [10, 10],
    setup: "SET · back 5 · calf pad height C · depth 3 · resistance profile 5\nHips pinned down, no lift-off · full stretch at the top of every rep" },
];

/* ---------- seed state ---------- */
const SEED = {
  v: 2,
  phase: "EASE 1",
  rate: { band: [1.0, 1.4], redline: 1.9, floor: 0.8 },
  maintenance: [{ label: "Hard-block steps", cal: 2590, note: "validated" }, { label: "Ease-1 steps", cal: 2470 }],
  trend: 164.2,
  model: { lean: 139.7, anchorISO: "2026-07-21", drip: 0.3, src: "coach's eye", err: "±1.5–3" },
  dexaPred: "~16 (15–17)",
  reads: [
    { d: "2026-06-10", w: 169.8, note: "baseline · ~18% BF", sealed: false },
    { d: "2026-07-15", w: 165.4, note: "trend low", sealed: false },
    { d: "2026-07-20", w: 163.8, note: "trend low", sealed: false },
    { d: "2026-07-21", w: 163.2, note: "2nd consecutive new low", sealed: false },
  ],
  blackout: { until: SEAL_UNTIL, reason: "wedding fortnight — refeed 7/22 · wedding 7/25" },
  sleep: {
    cleanH: 7.5, needed: 3,
    nights: [
      { d: "2026-07-13", h: 6.5 }, { d: "2026-07-14", h: 4.5 }, { d: "2026-07-15", h: 8 },
      { d: "2026-07-16", h: 7 }, { d: "2026-07-17", h: 7.5 }, { d: "2026-07-18", h: 5.5 },
      { d: "2026-07-19", h: 6.5 }, { d: "2026-07-20", h: 7.5, note: "reset night 1" },
    ],
    debts: [
      "Press 8,8,7 → 8,7,6 (7/20)", "Calves −4 total reps at 315 (7/21)",
      "Hack 13,12 vs 13,13 (7/21)", "Extension crater at self-bumped 155: 9,6 (7/21)",
    ],
  },
  exercises: EXERCISES,
  queue: [
    { id: "q_rows180", kind: "debut", exId: "rows", newW: 180, t: "ROWS 180 DEBUT", state: "DEBUT", gate: "Earned via 175×10,10 — strapless", rule: "The structural change for the next upper day", done: false },
    { id: "q_press_own", kind: "own", exId: "press", t: "PRESS · OWN 245", state: "OWN-IT", gate: "Repeat 8,8,7 on a clean day (last: 8,7,6 on debt)", rule: "Do NOT load until owned", done: false },
    { id: "q_hack3", kind: "debut", exId: "hack", t: "HACK 3RD SET DEBUT", state: "DEBUT", gate: "Gate passed · deferred 2× for sleep", rule: "LOCKED — runs unless a true <4.5 h night", done: false },
    { id: "q_abs", kind: "debut", exId: "abs", coApproved: true, t: "ABS 100 DEBUT", state: "DEBUT", gate: "Earned 7/21 via 95×14,13,13", rule: "Doc-approved to ride alongside the hack debut", done: false },
    { id: "q_calves", kind: "reclaim", exId: "calves", t: "CALF INCREMENT OFF 315", state: "RECLAIM", gate: "Needs 13,12,11,10 back (last: 12,10,9,8 on debt)", rule: "Hold 315 — increment stays locked", done: false },
    { id: "q_ext", kind: "own", exId: "extension", t: "EXTENSION · OWN 150×9,9", state: "REVERT", gate: "Self-bump to 155 cratered (9,6) — back to 150", rule: "155 reopens after 9,9 lands", done: false },
    { id: "q_curl", kind: "ladder", exId: "curl", t: "CURL 55 LADDER", state: "LADDER", gate: "Set 2: 8 → 9–10 → 12", done: false },
    { id: "q_primeRD", kind: "info", t: "PRIME REAR-DELT SWITCH", state: "PARKED", gate: "Cable + conscious retraction is working", rule: "Fires only if rounding returns at fatigue — coach territory", done: false },
    { id: "q_peg", kind: "info", t: "TRICEP BOTTOM-PEG (STRETCH)", state: "PARKED", gate: "Middle peg through the cut", rule: "Unparks at build phase", done: false },
    { id: "q_ease2", kind: "phase", t: "EASE 2", state: "ARMS @ ~13%", gate: "~2,350–2,400 cal · step taper", rule: "Arms itself from the live BF estimate", done: false },
    { id: "q_pivot", kind: "phase", t: "PIVOT → REVERSE", state: "COACH'S EYE", gate: "~10.5–11% · weeks 13–16", rule: "Fast reverse (~1–2 wk to ~2,450) → lean surplus 2,700–2,950 · MRV build", done: false },
    { id: "q_dexa", kind: "info", t: "DEXA BASELINE", state: "UNBOOKED", gate: "Jericho NY · fasted · normal day · 2+ days clear of refeed", rule: "Result re-anchors the whole BF model in the Body tab", done: false },
  ],
  feed: [
    { d: "2026-07-21", t: "ABS 100 EARNED", how: "95×14,13,13 clean opener" },
    { d: "2026-07-20", t: "ROWS 175×10,10 STRAPLESS", how: "rebuild complete in 2 sessions off the 170→175 bump · 180 earned" },
    { d: "2026-07-20", t: "CURL GRADUATION 50→55", how: "55×12 clean + 55×8 · new ladder started" },
    { d: "2026-07-20", t: "REAR-DELT OPENER FIX PROVEN", how: "10,10 / 10,10 / 9,9 vs 10,10 / 8,8 / 8,10 prior" },
    { d: "2026-07-20", t: "LATERAL 80 TARGET HIT", how: "80×14,13,13 — exactly the chase off the 7/16 baseline" },
    { d: "2026-07-20", t: "SLEEP RESET · NIGHT 1", how: "7.5 h after one good night in eight" },
    { d: "2026-07-18", t: "ZERO-COMP EVENT #5", how: "Wedding #1 at ~2,300 / 170 g — below maintenance · no penance" },
    { d: "2026-07-16", t: "PRESS 245×8,8,7", how: "after two 8,8,6.8 near-misses — via honest opener" },
    { d: "2026-07-15", t: "FIRST TRUE 16k STEP DAY", how: "16.7k organic — step-creep named and self-resolved" },
  ],
  standing: "Hack: 4 straight progressing sessions to 13,13 · Calves 300→315 (+8 reps at load) · Ham 110→120 · Extension 130→150 · Rear delt 17.5→20 — all while cutting",
  zeroComp: { count: 5, last: "Wedding #1 · 7/18" },
  proteinDays: "30+ of 40",
  fixWindow: null, boosts: 0, thesisConfirms: 6, lastThesisWk: 6,
  dailyLogs: {},
  events: [{ id: "wed2", t: "WEDDING #2", d: "2026-07-25", protocol: "Protein-forward ~2,500 · never tracked at the table · estimate once after", estimated: false }],
  sessionLog: {},
  weekly: [{ wk: "2026-07-20", trend: 164.2 }],
  proposals: [], adjustments: [],
};

/* ---- weave the real 42-day record (Prep-Tracker.xlsx) into the seed ---- */
(function weave() {
  SEED.v = 10;
  SEED.creatine = null;
  SEED.photos = [];
  SEED.sync = { last: null, status: "" };
  SEED.exOrder = { U: SEED.exercises.filter((e) => e.day === "U").map((e) => e.id), L: SEED.exercises.filter((e) => e.day === "L").map((e) => e.id) };
  SEED.waist = [];
  SEED.exercises.forEach((e) => { e.rirHist = []; });
  SEED.reads = HISTORY.filter((h) => h.w != null).map((h) => ({ d: h.d, w: h.w, note: "", sealed: false }));
  const t7 = (endISO) => {
    const end = mk(endISO).getTime();
    const win = SEED.reads.filter((r) => { const t = mk(r.d).getTime(); return t <= end && t > end - 7 * DAY; });
    return win.length ? +(win.reduce((a, r) => a + r.w, 0) / win.length).toFixed(1) : null;
  };
  SEED.trend = t7("2026-07-21") ?? SEED.trend;
  SEED.weekly = [];
  for (let d = mk("2026-06-15"); d <= mk("2026-07-20"); d = new Date(d.getTime() + 7 * DAY)) {
    const v = t7(isoOf(d)); if (v != null) SEED.weekly.push({ wk: isoOf(d), trend: v });
  }
  SEED.dailyLogs = {};
  HISTORY.forEach((h) => { if (h.cal != null || h.pro != null || h.steps != null) SEED.dailyLogs[h.d] = { cal: h.cal, pro: h.pro, steps: h.steps }; });
  SEED.sleep.nights = HISTORY.filter((h) => h.slp != null).map((h) => ({ d: h.d, h: h.slp }));
})();

/* weekly rollups for the history view */
function weekRollups() {
  const wks = {};
  HISTORY.forEach((h) => { if (h.wk) (wks[h.wk] = wks[h.wk] || []).push(h); });
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  return Object.keys(wks).map(Number).sort((a, b) => b - a).map((wk) => {
    const rows = wks[wk];
    const ws = rows.filter((r) => r.w != null).map((r) => r.w);
    const cals = rows.filter((r) => r.cal != null).map((r) => r.cal);
    const pros = rows.filter((r) => r.pro != null).map((r) => r.pro);
    const stepsA = rows.filter((r) => r.steps != null).map((r) => r.steps);
    const slps = rows.filter((r) => r.slp != null).map((r) => r.slp);
    return {
      wk, rows,
      range: `${fmtShort(rows[0].d)} – ${fmtShort(rows[rows.length - 1].d)}`,
      avgW: ws.length ? +avg(ws).toFixed(1) : null,
      avgCal: cals.length ? Math.round(avg(cals)) : null,
      avgPro: pros.length ? Math.round(avg(pros)) : null,
      proHit: pros.filter((p) => Math.abs(p - 175) <= 10).length, proN: pros.length,
      avgSteps: stepsA.length ? +(avg(stepsA) / 1000).toFixed(1) : null,
      avgSlp: slps.length ? +avg(slps).toFixed(1) : null,
      flags: rows.filter((r) => r.flag && r.flag !== "track").length,
    };
  });
}
const ROLLUPS = weekRollups();

/* ============================================================
   ENGINE — pure functions
   ============================================================ */
const exById = (s, id) => s.exercises.find((e) => e.id === id);

function dayType(iso) {
  const d = mk(iso).getDay();
  return d === 1 || d === 4 ? "U" : d === 2 || d === 5 ? "L" : d === 3 ? "REFEED" : "REST";
}

/* target generator: climb the earliest set that lags the one before it */
function targetsFor(ex) {
  if (ex.std) return ex.std.slice();
  if (ex.reclaim) return ex.reclaim.slice();
  if (!ex.last) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
  const t = ex.last.slice(0, ex.sets);
  while (t.length < ex.sets) t.push(Math.max(1, (t[t.length - 1] || ex.hi - 2) - 2));
  let idx = -1;
  for (let i = 1; i < t.length; i++) if (t[i] < t[i - 1]) { idx = i; break; }
  if (idx === -1 && t[0] < ex.hi) idx = 0;
  if (idx >= 0) t[idx] = Math.min(ex.hi, t[idx] + 1);
  return t.map((r) => Math.min(ex.hi, r));
}

/* pick THE structural change for a session (one per session, hard rule) */
function pickStructural(s, iso, slp) {
  const dt = dayType(iso);
  const candidates = s.queue.filter((q) => !q.done && (q.kind === "debut" || q.kind === "unlock") && q.exId && exById(s, q.exId) && exById(s, q.exId).day === dt);
  const passes = candidates.filter((q) => !(q.exId === "hack" && slp.last && slp.last.h < 4.5));
  const main = passes.find((q) => !q.coApproved) || null;
  const riders = passes.filter((q) => q.coApproved && q !== main);
  return { main, riders, deferred: candidates.filter((q) => !passes.includes(q)) };
}

/* generate a full session for any date */
function genSession(s, iso, slp) {
  const dt = dayType(iso);
  if (dt !== "U" && dt !== "L") return null;
  const { main, riders } = pickStructural(s, iso, slp);
  const active = new Set([main, ...riders].filter(Boolean).map((q) => q.exId));
  const ord = (s.exOrder && s.exOrder[dt]) || [];
  const pool = s.exercises.filter((e) => e.day === dt).sort((a, b) => {
    const ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  const ex = pool.map((e) => {
    const isDebutNow = active.has(e.id);
    const q = isDebutNow ? s.queue.find((x) => x.exId === e.id && !x.done && (x.kind === "debut" || x.kind === "unlock")) : null;
    const w = q && q.newW != null ? q.newW : e.w;
    let tgt, note;
    if (e.id === "hack" && e.pendingThird && isDebutNow) { tgt = [...targetsFor(e), Math.max(8, e.hi - 3)]; note = "DEBUT — third set banks whatever it gives"; }
    else if (q && q.kind === "debut" && e.last) { tgt = e.last.map((r) => Math.max(6, r - 2)); note = `DEBUT at ${w} — log what it gives`; }
    else if (q && !e.last) { tgt = targetsFor(e); note = e.debutNote || `DEBUT at ${w}`; }
    else { tgt = targetsFor(e); note = e.own ? `OWN-IT — ${e.ownNote}` : e.reclaim ? "RECLAIM — the exact standard" : e.ladder ? `set ${e.ladder.set + 1} is the ladder — top of rung ${e.ladder.top}` : e.note; }
    if (e.holdFlag) note = "HELD — opener ran 0 RIR twice · one honest session releases it";
    const live = (() => {
      if (e.holdFlag) return "HELD — one honest opener (RIR ≥1) releases the load";
      if (isDebutNow && q) return `debut at ${w} — log what it gives, zero expectations`;
      if (e.std && e.own) return `${e.std.join(",")} clean owns it — honest opener, controlled every rep`;
      if (e.reclaim) return `reclaim the exact ${e.reclaim.join(",")} — ${e.reclaim.reduce((a, b) => a + b, 0)} honest reps buys the increment`;
      if (e.ladder) return `set ${e.ladder.set + 1} is the money set — ${e.last ? e.last[e.ladder.set] : "?"} → ${e.ladder.top} finishes the rung`;
      return `chase ${tgt.join(",")} — one over the weakest set, opener at RIR 1`;
    })();
    return { id: e.id, n: e.n, w, tgt, note, isDebutNow, setup: e.setup, live, prev: e.lastMeta };
  });
  return { name: dt === "U" ? "UPPER" : "LOWER", structural: main ? main.t : "none queued — rep progression day", structuralId: main ? main.id : null, riderIds: riders.map((r) => r.id), ex };
}

/* evaluate a completed session — transitions, earns, own-flips, refills */
function completeSession(state, iso, entries, slp, extras = {}) {
  const s = JSON.parse(JSON.stringify(state));
  const lines = [];
  let dipCount = 0;
  const push = (t, how) => lines.push({ t, how });
  const debtTag = slp.clean ? "" : " · on debt — provisional";
  const qFind = (pred) => s.queue.find(pred);

  entries.forEach((en) => {
    const ex = exById(s, en.id);
    if (!ex || !en.reps || !en.reps.length) return;
    const r = en.reps.map((x) => Number(x) || 0);
    const q = qFind((x) => x.exId === ex.id && !x.done && (x.kind === "debut" || x.kind === "unlock"));

    const prevMeta = ex.lastMeta;
    if (prevMeta && prevMeta.reps && String(prevMeta.w) === String(en.w) && r.reduce((a, b) => a + b, 0) < prevMeta.reps.reduce((a, b) => a + b, 0)) dipCount++;
    ex.lastMeta = { d: iso, w: en.w, reps: r.slice(), rir: en.rir ?? null, debt: !slp.clean };

    /* opener RIR — the honest-opener rule with teeth */
    if (en.rir != null) {
      ex.rirHist = [...(ex.rirHist || []).slice(-2), en.rir];
      if (en.rir >= 1 && ex.holdFlag) { ex.holdFlag = false; push(`${ex.n.toUpperCase()} — HOLD RELEASED`, `opener back to ${en.rir} RIR — honest again, loads can earn`); }
      const h2 = ex.rirHist.slice(-2);
      if (h2.length === 2 && h2.every((x) => x === 0)) { ex.holdFlag = true; push(`${ex.n.toUpperCase()} — RIR 0 TWICE`, "opener running hot two sessions straight — load HELD until an honest session lands"); }
    }

    /* debut lands */
    if (q && en.isDebutNow) {
      q.done = true; q.state = "ESTABLISH";
      if (q.newW != null) ex.w = q.newW;
      if (ex.id === "hack" && ex.pendingThird) { ex.pendingThird = false; ex.sets = 3; }
      ex.last = r.slice(); ex.own = false; ex.std = null;
      q.gate = `Debuted ${r.join(",")}`;
      push(`${q.t} COMPLETE`, `${ex.n} at ${ex.w}: ${r.join(",")}${debtTag}`);
      return;
    }

    /* own / revert standards */
    if (ex.std && ex.own) {
      const hit = ex.std.every((n, i) => (r[i] ?? 0) >= n);
      if (hit && slp.clean) {
        ex.own = false; const oldStd = ex.std.join(","); ex.std = null; ex.last = r.slice();
        const oq = qFind((x) => x.exId === ex.id && (x.kind === "own"));
        if (oq) { oq.done = true; oq.state = "OWNED"; }
        if (ex.id === "press") {
          s.queue.push({ id: "q_press250", kind: "debut", exId: "press", newW: ex.w + ex.inc, t: `PRESS ${ex.w + ex.inc} DEBUT`, state: "DEBUT", gate: `Earned by owning ${ex.w}×${oldStd} clean`, rule: "Coach flag before it runs — structural queue", done: false });
          push(`PRESS ${ex.w} OWNED`, `${oldStd} repeated clean — ${ex.w + ex.inc} enters the queue at coach flag`);
        } else if (ex.id === "extension") {
          s.queue.push({ id: "q_ext155", kind: "debut", exId: "extension", newW: ex.w + 5, t: `EXTENSION ${ex.w + 5} — GATE REOPENED`, state: "DEBUT", gate: `Earned this time: ${ex.w}×${oldStd}`, rule: "Queued as a structural change", done: false });
          push(`EXTENSION ${ex.w} RE-OWNED`, `${oldStd} — the ${ex.w + 5} gate reopens, earned`);
        } else push(`${ex.n.toUpperCase()} OWNED`, `${oldStd} clean`);
      } else if (hit) push(`${ex.n.toUpperCase()} — PROVISIONAL`, `${r.join(",")} landed on debt · must repeat clean before it counts`);
      else push(`${ex.n.toUpperCase()} — NOT YET`, `${r.join(",")} · standard stays ${ex.std.join(",")} clean · nothing loads`);
      ex.lastAttempt = r.slice();
      return;
    }

    /* reclaim standards */
    if (ex.reclaim) {
      const ok = ex.reclaim.every((n, i) => (r[i] ?? 0) >= n);
      if (ok) {
        const std = ex.reclaim.join(","); ex.reclaim = null; ex.last = r.slice();
        const rq = qFind((x) => x.exId === ex.id && x.kind === "reclaim");
        if (rq) { rq.done = true; rq.state = "RECLAIMED"; }
        s.queue.push({ id: `q_${ex.id}_inc`, kind: "debut", exId: ex.id, newW: (Number(ex.w) || 0) + ex.inc, t: `${ex.n.toUpperCase()} ${(Number(ex.w) || 0) + ex.inc} DEBUT`, state: "DEBUT", gate: `Re-earned ${ex.w}×${std}`, rule: "Increment unlocked — queued as a structural change", done: false });
        push(`${ex.n.toUpperCase()} ${ex.w} RECLAIMED`, `${std} re-earned — increment unlocked`);
      } else push(`${ex.n.toUpperCase()} — RECLAIM CONTINUES`, `${r.join(",")} vs ${ex.reclaim.join(",")} · ${r.reduce((a, b) => a + b, 0)}/${ex.reclaim.reduce((a, b) => a + b, 0)} reps`);
      return;
    }

    /* ladder (curl set-2) */
    if (ex.ladder) {
      const li = ex.ladder.set, val = r[li] ?? 0, prev = ex.last ? ex.last[li] : 0;
      ex.last = r.slice();
      if (val > prev) {
        if (val >= ex.ladder.top) {
          const lq = qFind((x) => x.exId === ex.id && x.kind === "ladder");
          if (lq) { lq.done = true; lq.state = "RUNG DONE"; }
          s.queue.push({ id: "q_curl_grad", kind: "info", t: "CURL 60 GRADUATION CANDIDATE", state: "COACH FLAG", gate: `Set 2 hit ${val} at 55`, rule: "Load graduations on the ladder are coach-flag territory", done: false });
          push("CURL LADDER — RUNG COMPLETE", `set 2: 55×${val} — graduation candidate queued`);
        } else push("CURL LADDER MOVED", `set 2: ${prev} → ${val} (top of rung: ${ex.ladder.top})`);
      }
      return;
    }

    /* generic progression + earn */
    const tgtMet = en.tgt && en.tgt.every((t2, i) => (r[i] ?? 0) >= t2);
    const atTop = r.length >= ex.sets && r.slice(0, ex.sets).every((x) => x >= ex.hi);
    ex.last = r.slice();
    if (atTop && typeof ex.w === "number" && ex.inc) {
      const already = s.queue.some((x) => x.exId === ex.id && !x.done && x.kind === "debut");
      if (en.rir === 0 || ex.holdFlag) {
        if (!already) push(`${ex.n.toUpperCase()} — TOP OF WINDOW, BUT HOT`, `${r.join(",")} at RIR 0 — a grind is not an earn; repeat it honest and the load queues itself`);
      } else if (slp.clean && !already) {
        s.queue.push({ id: `q_${ex.id}_${ex.w + ex.inc}`, kind: "debut", exId: ex.id, newW: ex.w + ex.inc, t: `${ex.n.toUpperCase()} ${ex.w + ex.inc} DEBUT`, state: "DEBUT", gate: `Earned via ${ex.w}×${r.join(",")}`, rule: "Auto-queued — runs when it wins the structural slot", done: false });
        push(`${ex.n.toUpperCase()} ${ex.w + ex.inc} EARNED`, `${ex.w}×${r.join(",")} — top of the window, clean · queued`);
      } else if (atTop && !slp.clean) push(`${ex.n.toUpperCase()} — TOP OF WINDOW, PROVISIONAL`, `${r.join(",")} on debt — repeat clean to earn the load`);
    } else if (tgtMet) push(`${ex.n.toUpperCase()} — TARGET MET`, `${en.w} × ${r.join(",")}`);

    /* rows special: establish → earn 185 via 10,10 handled by generic atTop (hi=10) */

    /* hot opener heuristic */
    if (en.tgt && en.tgt.length >= 2 && r[0] > en.tgt[0] + 1 && (r[en.tgt.length - 1] ?? 0) < en.tgt[en.tgt.length - 1] - 1)
      push(`${ex.n.toUpperCase()} — HOT OPENER?`, `set 1 ran ${r[0]} vs ${en.tgt[0]} and the tail gave it back`);
  });

  const niggles = extras.niggles || [];
  s.sessionLog[iso] = { entries: entries.map((e) => ({ id: e.id, reps: e.reps, rir: e.rir ?? null })), at: Date.now(), note: extras.note || "", niggles, dips: dipCount };
  const cutoff = isoOf(new Date(mk(iso).getTime() - 21 * DAY));
  const counts = {};
  Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cutoff) (sl.niggles || []).forEach((j) => { counts[j] = (counts[j] || 0) + 1; }); });
  Object.entries(counts).forEach(([j, c]) => {
    if (c >= 3 && !s.proposals.some((p) => !p.resolved && p.rid && p.rid.indexOf("niggle_" + j.replace(/\s/g, "")) === 0))
      s.proposals.push({ rid: `niggle_${j.replace(/\s/g, "")}_${iso}`, id: `niggle_${j.replace(/\s/g, "")}_${iso}`, d: iso, title: `${j.toUpperCase()} — 3 FLAGS IN 3 WEEKS`, why: "A pattern, not a day. Technique/deload review with your coach before it becomes a decision you don't get to make. Nothing changes automatically.", apply: { kind: "note" }, resolved: false });
  });
  lines.forEach((l) => s.feed.unshift({ d: iso, t: l.t, how: l.how }));
  return { s, lines };
}

/* live BF estimate from the anchored lean-mass model */
function bfEst(s, trend = s.trend, atISO = isoOf(todayStart())) {
  const wks = Math.max(0, weeksBetween(s.model.anchorISO, atISO));
  const lean = s.model.lean + s.model.drip * wks;
  return { pct: +(((trend - lean) / trend) * 100).toFixed(1), lean: +lean.toFixed(1) };
}

/* current weekly rate from snapshots (falls back to seeded prior) */
function currentRate(s) {
  const w = s.weekly;
  if (w.length >= 2) {
    const rates = [];
    for (let i = 1; i < w.length; i++) rates.push((w[i - 1].trend - w[i].trend) / Math.max(0.5, weeksBetween(w[i - 1].wk, w[i].wk)));
    const recent = rates.slice(-2);
    const scale = +(recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(2);
    return { scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates };
  }
  return { scale: 1.0, fat: 1.25, measured: false, rates: [] };
}

/* recovery index — sleep, RIR drift, joint flags, rep dips converge into one number */
function recoveryIndex(s) {
  const factors = []; let score = 100;
  const slp = sleepInfo(s);
  if (!slp.clean) { const miss = Math.min(3, s.sleep.needed - slp.run); score -= miss * 10; factors.push(`sleep reset ${slp.run}/${s.sleep.needed}`); }
  const last5 = s.sleep.nights.slice(-5).map((n) => n.h);
  if (last5.length === 5 && last5.reduce((a, b) => a + b, 0) / 5 < 7) { score -= 10; factors.push("5-night avg under 7 h"); }
  const holds = s.exercises.filter((e) => e.holdFlag);
  if (holds.length) { score -= Math.min(20, holds.length * 10); factors.push(`${holds.length} lift${holds.length > 1 ? "s" : ""} held (RIR)`); }
  const rirs = [];
  Object.keys(s.sessionLog).sort().slice(-3).forEach((d) => (s.sessionLog[d].entries || []).forEach((e) => { if (e.rir != null) rirs.push(e.rir); }));
  if (rirs.length >= 4 && rirs.filter((x) => x === 0).length / rirs.length >= 0.5) { score -= 10; factors.push("half of logged openers at RIR 0"); }
  const cutoff = isoOf(new Date(todayStart().getTime() - 14 * DAY));
  let ng = 0;
  Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cutoff) ng += (sl.niggles || []).length; });
  if (ng) { score -= Math.min(21, ng * 7); factors.push(`${ng} joint flag${ng > 1 ? "s" : ""} in 14 d`); }
  const dips = Object.keys(s.sessionLog).sort().slice(-2).reduce((a, d) => a + (s.sessionLog[d].dips || 0), 0);
  if (dips) { score -= Math.min(15, dips * 5); factors.push(`${dips} rep dip${dips > 1 ? "s" : ""} last 2 sessions`); }
  score = Math.max(0, Math.round(score));
  return { score, factors, band: score >= 80 ? "GREEN" : score >= 55 ? "WATCH" : "LOW" };
}

/* apply a scale read with spike damping — one meal can move a morning, not the trend */
function applyRead(state, iso, w) {
  const s = JSON.parse(JSON.stringify(state));
  if (s.reads.some((r) => r.d === iso)) return s;
  const sealed = daysUntil(s.blackout.until) > 0;
  const dRaw = w - s.trend, dCl = Math.max(-1.5, Math.min(1.5, dRaw));
  const spike = Math.abs(dRaw) > 1.5;
  const clean = s.reads.filter((r) => !r.sealed);
  const dl = [];
  for (let i = 1; i < clean.length; i++) { if (Math.round((mk(clean[i].d) - mk(clean[i - 1].d)) / DAY) === 1) { const dd = clean[i].w - clean[i - 1].w; if (Math.abs(dd) < 1.5) dl.push(dd); } }
  const nf = dl.length >= 8 ? Math.sqrt(dl.reduce((a, b) => a + b * b, 0) / dl.length) : null;
  s.reads.push({ d: iso, w, sealed, pt: s.trend, note: sealed ? "sealed — excluded from trend" : spike ? "spike — damped in trend" : nf && Math.abs(dRaw) <= nf ? "inside your noise — not information" : "" });
  if (!sealed) s.trend = +(s.trend + 0.3 * dCl).toFixed(1);
  return s;
}

/* observed maintenance — your own intake and measured rate are the only honest calculator */
function observedTDEE(s) {
  if (daysUntil(s.blackout.until) > 0) return null;
  const r = currentRate(s);
  if (!r.measured) return null;
  const cutoff = isoOf(new Date(todayStart().getTime() - 21 * DAY));
  const cals = Object.entries(s.dailyLogs).filter(([d, v]) => d >= cutoff && v && v.cal != null).map(([, v]) => v.cal);
  if (cals.length < 8) return null;
  const avg = cals.reduce((a, b) => a + b, 0) / cals.length;
  const fatWk = Math.min(1.6, r.scale + s.model.drip);
  const perDay = (fatWk * 3500 - s.model.drip * 600) / 7;
  return { tdee: Math.round(avg + perDay), days: cals.length, avg: Math.round(avg) };
}

/* ETA (weeks) until est. BF reaches a target, simulating trend − rate, lean + drip */
function etaWeeks(s, targetPct) {
  const r = currentRate(s);
  let trend = s.trend, wks = 0;
  let lean = bfEst(s).lean;
  for (; wks < 30; wks++) {
    if (((trend - lean) / trend) * 100 <= targetPct) return wks;
    trend -= Math.max(0.3, r.scale); lean += s.model.drip;
  }
  return null;
}

/* THE LAB — every analytic self-gates on its own data threshold. No correlations under N. */
function labAnalytics(s) {
  const out = [];
  const sealed = daysUntil(s.blackout.until) > 0;
  const reads = s.reads.filter((r) => !r.sealed);
  const readByD = {}; reads.forEach((r) => { readByD[r.d] = r.w; });
  const nextDay = (d) => isoOf(new Date(mk(d).getTime() + DAY));
  const bfNow = bfEst(s);

  /* 1 · whoosh signature */
  const eps = [];
  for (let i = 1; i < reads.length; i++) {
    if (reads[i].w - reads[i - 1].w >= 2) {
      const pre = reads[i - 1].w;
      for (let j = i + 1; j < reads.length; j++) {
        if (reads[j].w <= pre + 0.4) { eps.push({ jump: +(reads[i].w - reads[i - 1].w).toFixed(1), days: Math.round((mk(reads[j].d) - mk(reads[i].d)) / DAY) }); break; }
      }
    }
  }
  const ev = s.events.find((e) => !e.estimated && daysUntil(e.d) >= -1 && daysUntil(e.d) <= 3);
  const ds0 = eps.map((e) => e.days).sort((a, b) => a - b);
  const hiC = ds0.length >= 3 ? ds0[ds0.length - 2] : ds0[ds0.length - 1];
  out.push({ id: "whoosh", t: "WHOOSH SIGNATURE", status: eps.length >= 2 ? "LIVE" : "ARMED", prog: { n: eps.length, need: 2, label: "spike→drain episodes" },
    tag: "How fast event water leaves YOUR body — measured, per event.",
    deep: "Big meals spike the scale with sodium, glycogen, and gut content — not fat (a 4.6 lb fat gain would need ~16,000 surplus calories, not one dinner). This model measured how long each of your spikes took to clear, so future spikes arrive pre-labeled with an exit date instead of a panic.",
    forYou: eps.length >= 2
      ? (ev ? `${ev.t} ${fmtShort(ev.d)}: expect a next-morning spike somewhere in your +${Math.min(...eps.map(e => e.jump))} to +${Math.max(...eps.map(e => e.jump))} range, clearing in ${ds0[0]}–${hiC} days. Every reading in that window is pre-dismissed. Monday's first clean read may still carry residue — the damped trend already knows.`
        : "No event in range — nothing to brace for. The model sits ready for the next one life schedules.")
      : "Needs one more spike→clear cycle to speak.",
    lines: eps.length >= 2 ? [
      `${eps.length} episodes in you · spikes +${Math.min(...eps.map(e => e.jump))} to +${Math.max(...eps.map(e => e.jump))} · clearance ${ds0[0]}–${hiC} days (one chained-event stretch ran ${ds0[ds0.length - 1]}d)`,
    ] : [] });

  /* 2 · refeed bump line */
  const refDs = HISTORY.filter((h) => h.cal != null && h.cal >= 2100 && /\bREFEED\b/.test(h.note || "") && !/REFEED SKIPPED/i.test(h.note || "")).map((h) => h.d);
  const bumps = refDs.map((d) => (readByD[d] != null && readByD[nextDay(d)] != null ? +(readByD[nextDay(d)] - readByD[d]).toFixed(1) : null)).filter((x) => x != null);
  const nxtWed = (() => { let d = todayStart(); for (let i = 1; i <= 7; i++) { const t2 = new Date(d.getTime() + i * DAY); if (t2.getDay() === 3) return isoOf(t2); } return null; })();
  out.push({ id: "refeed", t: "REFEED BUMP LINE", status: bumps.length >= 2 ? "LIVE" : "ARMED", prog: { n: bumps.length, need: 2, label: "measured refeed mornings" },
    tag: "Your personal morning-after-refeed number.",
    deep: "Refeed carbs bind water into muscle glycogen (~3 g of water per gram of carbohydrate stored). The next-morning bump is that storage — it is literally the fullness you are dieting FOR, wearing a scary costume on the scale.",
    forYou: bumps.length >= 2 ? `Next refeed ${nxtWed ? fmtShort(nxtWed) : "Wednesday"}: the morning after can land anywhere in your measured spread. A Thursday +1 is chapter and verse — you lift heavier ON the bump, not despite it.` : "Two measured refeed mornings unlock it.",
    lines: bumps.length >= 2 ? [`your next-morning delta: ${bumps.slice().sort((a, b) => a - b).map((x) => x > 0 ? `+${x}` : `${x}`).join(" · ")} (n=${bumps.length})`] : [] });

  /* 3 · personal noise floor */
  const deltas = [];
  for (let i = 1; i < reads.length; i++) {
    if (Math.round((mk(reads[i].d) - mk(reads[i - 1].d)) / DAY) === 1) { const dd = reads[i].w - reads[i - 1].w; if (Math.abs(dd) < 1.5) deltas.push(dd); }
  }
  const sdN = deltas.length >= 8 ? Math.sqrt(deltas.reduce((a, b) => a + b * b, 0) / deltas.length) : null;
  out.push({ id: "noise", t: "YOUR NOISE FLOOR", status: sdN ? "LIVE" : "ARMED", prog: { n: deltas.length, need: 8, label: "clean day-pairs" },
    tag: "The size of a meaningless scale move, in you specifically.",
    deep: "Even at perfect protocol — fasted, post-void — daily weight wobbles from water, sodium, gut content, and timing. Below your measured band a change is statistically indistinguishable from nothing. This converts 'don't react to one day' from advice into a calibrated instrument.",
    forYou: sdN ? `Monday's first clean read: judge it against the trend (${s.trend}), never against 7/21's 163.2 — and any morning within ±${sdN.toFixed(1)} of expectation is zero information. The scale card now stamps those automatically. Two consecutive lows = signal beginning.` : "Eight clean consecutive-day pairs calibrate it.",
    lines: sdN ? [`±${sdN.toFixed(1)} lb day-to-day (n=${deltas.length})`] : [] });

  /* 4 · masked-loss monitor */
  const last5 = reads.slice(-5);
  const flatWin = !sealed && last5.length === 5 && (mk(last5[4].d) - mk(last5[0].d)) / DAY <= 6 && Math.abs(last5[4].w - last5[0].w) < 0.4;
  const ph = PHASES[s.phase];
  const cals5 = last5.map((r) => (s.dailyLogs[r.d] || {}).cal).filter((c) => c != null);
  const compliant = cals5.length >= 4 && cals5.every((c) => c <= ph.band[1] + 150);
  out.push({ id: "masked", t: "MASKED-LOSS MONITOR", status: "LIVE", prog: null,
    tag: "Catches the fake stall before you react to it.",
    deep: "Water can hold the scale flat for days while fat loss continues underneath, then release at once — your 6/28→7/2 whoosh was exactly this. Flat trend plus compliant intake for 5+ days means the drop is loading, not missing. It is the single most common moment people panic-cut, and the one your last prep's ghosts live in.",
    forYou: sealed ? "Sealed until Monday. For the record: in six weeks of history, every flat stretch under compliant intake broke DOWNWARD. The system has never actually stalled on you — remember that Tuesday if the scale plays dead."
      : flatWin && compliant ? "FIRING NOW — flat + compliant ≥5 days. The drop is loading. Touch nothing."
      : "Watching. If it fires, the card will say so here, and the correct response is written on it: hands off.",
    lines: [] });

  /* 5 · step-creep radar v2 */
  const stepDays = Object.entries(s.dailyLogs).filter(([d, v]) => d > "2026-07-21" && v.steps != null);
  out.push({ id: "creep", t: "STEP-CREEP RADAR v2", status: stepDays.length >= 14 ? "LIVE" : "ARMED", prog: { n: stepDays.length, need: 14, label: "post-handoff step days" },
    tag: "Names manufactured steps at recurrence 2, not 7.",
    deep: "Organic high-step days get fed and forgotten. A quietly rising 7-day step FLOOR — the minimum creeping up — is compensation sneaking in the back door. That pattern took seven recurrences to catch by hand last time; the radar flags the floor at two.",
    forYou: stepDays.length >= 14 ? "Live and watching the floor." : `Armed at ${stepDays.length}/14. Until then the manual tell stands: a step day that feels EARNED rather than HAPPENED is the creep talking.`,
    lines: [] });

  /* 6 · Tue/Fri experiment */
  const wkKey = (d) => { const dt = mk(d); const off = (dt.getDay() + 6) % 7; return isoOf(new Date(dt - off * DAY)); };
  const weeks = {};
  Object.keys(s.sessionLog).forEach((d) => { const dow = mk(d).getDay(); if (dayType(d) === "L") { (weeks[wkKey(d)] = weeks[wkKey(d)] || {})[dow === 2 ? "tue" : dow === 5 ? "fri" : "x"] = d; } });
  const pairs = Object.values(weeks).filter((w) => w.tue && w.fri);
  let tfAvg = 0;
  if (pairs.length >= 4) {
    const sums = pairs.map((pr) => { const sum = (d) => (s.sessionLog[d].entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0); return sum(pr.fri) - sum(pr.tue); });
    tfAvg = Math.round(sums.reduce((a, b) => a + b, 0) / sums.length);
  }
  out.push({ id: "tuefri", t: "TUE/FRI EXPERIMENT — REFEED DISTANCE", status: pairs.length >= 4 ? "LIVE" : "ARMED", prog: { n: pairs.length, need: 4, label: "paired weeks" },
    tag: "Your split accidentally built a controlled experiment.",
    deep: "Friday lower sits 2 days after the Wednesday refeed; Tuesday lower sits 6 days out. Same lifts, same you, different glycogen distance, repeating weekly — the cleanest causal test of refeed timing a training week could construct, and yours did it by accident.",
    forYou: pairs.length >= 4 ? `Friday runs ${tfAvg >= 0 ? "+" : ""}${tfAvg} total reps vs Tuesday on average — ${Math.abs(tfAvg) >= 5 ? "a real gap: evidence for repositioning or doubling refeeds at Ease 2, a coach conversation with data instead of vibes." : "no meaningful gap yet; refeed placement is fine as is."}` : "First pair completes Tue 7/28 + Fri 7/31. If a consistent gap shows by mid-August, that's ammunition for the Ease-2 refeed conversation — data, not vibes.",
    lines: [] });

  /* 7 · rep-drop fingerprints */
  const sesN = Object.keys(s.sessionLog).length;
  let fp = { opener: 0, tail: 0, broad: 0 };
  if (sesN >= 8) {
    const byEx = {};
    Object.keys(s.sessionLog).sort().forEach((d) => (s.sessionLog[d].entries || []).forEach((e) => {
      if (!e.reps || !e.reps.length) return;
      const prev = byEx[e.id];
      if (prev && prev.length === e.reps.length) {
        const o = e.reps[0] < prev[0], t2 = e.reps[e.reps.length - 1] < prev[prev.length - 1];
        if (o && t2) fp.broad++; else if (o) fp.opener++; else if (t2) fp.tail++;
      }
      byEx[e.id] = e.reps;
    }));
  }
  out.push({ id: "fingerprint", t: "REP-DROP FINGERPRINTS", status: sesN >= 8 ? "LIVE" : "ARMED", prog: { n: sesN, need: 8, label: "completed sessions" },
    tag: "WHERE reps fall says WHY they fell.",
    deep: "Opener down, tail intact = readiness (sleep, CNS). Opener intact, tail collapsing = fuel (glycogen, refeed distance). Everything down = systemic recovery. Different diagnoses, different levers — pulling the wrong one is how good preps get wrecked.",
    forYou: sesN >= 8 ? `Your distribution: opener ${fp.opener} · tail ${fp.tail} · broad ${fp.broad}. The dominant pattern names your dominant lever.` : `${sesN}/8 sessions. Already usable by hand: your 7/21 lower was the textbook BROAD dip — systemic, sleep-attributed, correctly blamed on the ledger and not the programming.`,
    lines: [] });

  /* 8 · sleep→lift lag */
  const shortNights = s.sleep.nights.filter((n) => n.d > "2026-07-21" && n.h < 6.5).length;
  out.push({ id: "sleeplag", t: "SLEEP→LIFT LAG MAP", status: shortNights >= 6 ? "LIVE" : "ARMED", prog: { n: shortNights, need: 6, label: "short-night observations (no need to rush these)" },
    tag: "Does a bad night hit you same-day or the day after?",
    deep: "Sleep-debt effects on performance can land immediately or ~24–48 h delayed, and differently by lift class — heavy compounds usually pay first. Your lag decides which day own-attempts get scheduled after a rough night.",
    forYou: shortNights >= 6 ? "Live — check the per-class lag before scheduling own-attempts." : `${shortNights}/6 — the one gate you should fail to feed quickly. Until it speaks, assume next-day risk on compounds: your 4.5 h night of 7/16 landed hardest on the 7/17 lower.`,
    lines: [] });

  /* 8b · sleep dose experiment — floor vs ceiling, tested in you */
  const postN = s.sleep.nights.filter((n) => n.d > "2026-07-21");
  const armLong = postN.filter((n) => n.h >= 8.5 && s.sessionLog[nextDay(n.d)]);
  const armStd = postN.filter((n) => n.h >= 7.5 && n.h < 8.5 && s.sessionLog[nextDay(n.d)]);
  const repsAfter = (arr) => arr.map((n) => ((s.sessionLog[nextDay(n.d)] || {}).entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0));
  const doseLive = armLong.length >= 5 && armStd.length >= 5;
  const avg2 = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
  out.push({ id: "sleepdose", t: "SLEEP DOSE — 7.5 FLOOR vs 8.5 CEILING", status: doseLive ? "LIVE" : "ARMED", prog: { n: Math.min(armLong.length, armStd.length), need: 5, label: "nights per arm (with a next-day session)" },
    tag: "Does 8.5+ beat your 7.5 clean-floor in YOUR lifts? (Mah 2011 prior)",
    deep: "Mah et al. 2011 (Sleep) extended college athletes toward 10 h in bed and got objectively faster sprints, better shooting accuracy, and improved mood — suggesting habitual sleep is a floor, not an optimum. Your CLEAN gate treats 7.5 as the line; this experiment asks whether ≥8.5 buys measurable next-day output in you specifically.",
    forYou: doseLive ? `Next-day total reps: after 8.5+ h → ~${avg2(repsAfter(armLong))} vs after 7.5–8.5 h → ~${avg2(repsAfter(armStd))} (n=${armLong.length}/${armStd.length}). ${avg2(repsAfter(armLong)) > avg2(repsAfter(armStd)) + 3 ? "The ceiling pays — bank long nights before big attempts." : "No clear edge yet — the 7.5 floor is holding its own."}` : `${armLong.length}/5 long nights · ${armStd.length}/5 standard banked. You control this experiment's pace — the long-night arm is the fun one to fill.`,
    lines: [] });

  /* 9 · RIR truth-check */
  const rir1 = [];
  Object.values(s.sessionLog).forEach((sl) => (sl.entries || []).forEach((e) => { if (e.rir === 1 && e.reps && e.reps.length >= 2) rir1.push(e.reps[e.reps.length - 1] <= e.reps[0] - 3); }));
  out.push({ id: "rirtruth", t: "RIR CALIBRATION CHECK", status: rir1.length >= 10 ? "LIVE" : "ARMED", prog: { n: rir1.length, need: 10, label: "logged RIR-1 openers" },
    tag: "Is your 'one left in the tank' actually a one?",
    deep: "Stimulants suppress perceived effort, and you lift at peak stack. If your logged 1s keep preceding tail craters, your 1 is behaving like a 0 — measurable, and correctable with a stated offset instead of a vague warning.",
    forYou: rir1.length >= 10 ? `${Math.round(100 * rir1.filter(Boolean).length / rir1.length)}% of your 1s preceded a crater — ${rir1.filter(Boolean).length / rir1.length > 0.4 ? "call your noon 1 a 0 from here." : "your 1 is honest; carry on."}` : `${rir1.length}/10. Until it speaks, the standing rule covers you: unsure between 1 and 0 at noon = it was 0.`,
    lines: [] });

  /* 10 · note-mining */
  const notes = Object.values(s.sessionLog).map((sl) => sl.note).filter((n) => n && n.length > 3);
  const stop = new Set(["with", "that", "this", "from", "sets", "reps", "good", "than", "last", "next", "after", "then", "were", "just", "very", "when", "session"]);
  const tok = {};
  notes.forEach((n) => n.toLowerCase().split(/[^a-z]+/).forEach((w) => { if (w.length >= 4 && !stop.has(w)) tok[w] = (tok[w] || 0) + 1; }));
  const top = Object.entries(tok).filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 5);
  out.push({ id: "notes", t: "NOTE-MINING · CUE GRADUATION", status: notes.length >= 10 ? "LIVE" : "ARMED", prog: { n: notes.length, need: 10, label: "session notes" },
    tag: "Your own words, mined for the patterns you keep repeating.",
    deep: "Free text catches what numbers can't — 'wired', 'set-4 anomaly', 'grinding'. A word repeating across 3+ sessions is a pattern announcing itself, and a technique cue that keeps recurring can graduate into the permanent SETUP blurb. Your notes literally author the app.",
    forYou: notes.length >= 10 ? (top.length ? `Repeating in your own words: ${top.map(([w, c]) => `"${w}" ×${c}`).join(" · ")} — say the word and any of them graduates into SETUP.` : "No phrase has repeated 3× yet — all originals so far.") : `${notes.length}/10 notes. The lateral 'upright, elbow-led' cue in SETUP came from exactly one of these — that's the bar.`,
    lines: [] });

  /* 11 · miss-antecedent map */
  const misses = Object.entries(s.dailyLogs).filter(([d, v]) => d > "2026-07-21" && v.pro != null && Math.abs(v.pro - PROTEIN) > 10);
  out.push({ id: "miss", t: "MISS-ANTECEDENT MAP", status: misses.length >= 4 ? "LIVE" : "ARMED", prog: { n: misses.length, need: 4, label: "protein misses (may this stay armed forever)" },
    tag: "Turns protein recovery into protein prevention.",
    deep: "Every miss gets its context attached — event-adjacent? travel? short sleep the night before? Repeated antecedents become trap-day warnings issued in advance, converting your excellent 24-hour-fix record into not-needing-the-fix.",
    forYou: misses.length >= 4 ? misses.map(([d]) => fmtShort(d)).join(" · ") + " — checking each for shared antecedents." : "0 misses since handoff — the correct number. Staying armed all prep is this card's win condition.",
    lines: [] });

  /* 14 · pivot probability cone */
  const w2 = s.weekly;
  const rts = [];
  for (let i = 1; i < w2.length; i++) rts.push((w2[i - 1].trend - w2[i].trend) / Math.max(0.5, weeksBetween(w2[i - 1].wk, w2[i].wk)));
  if (rts.length >= 4) {
    const mu = rts.reduce((a, b) => a + b, 0) / rts.length;
    const sg = Math.sqrt(rts.reduce((a, b) => a + (b - mu) * (b - mu), 0) / rts.length);
    let seed = 42; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
    const hits = [];
    for (let k = 0; k < 400; k++) {
      let tr = s.trend, ln = bfNow.lean, wk3 = 0;
      for (; wk3 < 30; wk3++) {
        if (((tr - ln) / tr) * 100 <= 11.2) break;
        tr -= Math.max(0.2, mu + sg * gauss()); ln += s.model.drip;
      }
      hits.push(wk3);
    }
    hits.sort((a, b) => a - b);
    const dISO = (wq) => isoOf(new Date(todayStart().getTime() + hits[Math.floor(hits.length * wq)] * 7 * DAY));
    const p50 = dISO(0.5);
    const inWindow = p50 >= "2026-09-02" && p50 <= "2026-09-29";
    out.push({ id: "cone", t: "PIVOT PROBABILITY CONE", status: "LIVE", prog: null,
      tag: "400 simulated versions of your prep, racing to the pivot.",
      deep: `Instead of one fake-precise date, it runs your prep 400 times. Each simulated week draws a loss rate from YOUR measured mean and spread (μ ${mu.toFixed(2)}, σ ${sg.toFixed(2)}), adds the muscle drip, and records when that run crosses ~11%. The gap between the fast and slow runs IS the honest uncertainty — a cone, not a promise.`,
      forYou: `Median run lands ${fmtShort(p50)} — ${inWindow ? "your own data independently CONFIRMS the coach's-eye 'mid/late September' call. Two different instruments, same answer." : "your data currently runs " + (p50 < "2026-09-02" ? "ahead of" : "behind") + " the doc's September window — worth a coach conversation, not a lever pull."} The cone narrows with every clean Monday read, shifts honestly when Ease 2 slows the scale by design, and re-anchors entirely the day DEXA lands.`,
      lines: [`80% of runs hit the pivot band between ${fmtShort(dISO(0.1))} and ${fmtShort(dISO(0.9))} · median ${fmtShort(p50)} · from your ${rts.length} weekly rates`] });
  } else {
    out.push({ id: "cone", t: "PIVOT PROBABILITY CONE", status: "ARMED", prog: { n: rts.length, need: 4, label: "weekly rates" }, tag: "400 simulated preps racing to the pivot.", deep: "Monte Carlo over your measured weekly rates.", forYou: "Four weekly rates unlock it.", lines: [] });
  }

  /* 15 · DEXA reconciliation */
  out.push({ id: "dexarecon", t: "DEXA RECONCILIATION", status: s.dexaRecon ? "LIVE" : "ARMED", prog: { n: s.dexaRecon ? 1 : 0, need: 1, label: "DEXA anchor" },
    tag: "Scores the eye against the machine — once.",
    deep: "The instant DEXA lands, the model's estimate at that moment is frozen next to the measured number. The delta tells us whose eye to trust, and every downstream estimate and ETA re-anchors to measured ground.",
    forYou: s.dexaRecon ? `The eye read ${s.dexaRecon.eye}% when DEXA said ${s.dexaRecon.dexa}% (Δ ${s.dexaRecon.delta > 0 ? "+" : ""}${s.dexaRecon.delta}). Everything since runs on measured ground.` : `Expected outcome: DEXA reads HIGHER than the eye (~16 vs ~${bfNow.pct}) — that's method offset, not bad news; lean mass is the number to watch (predicted 138–142). Cleanest booking: Tue 7/28+, fully clear of the wedding.`,
    lines: [] });

  /* 12/13 · locked build-phase slots */
  out.push({ id: "mrv", t: "EMPIRICAL MRV — YOUR VOLUME CEILINGS", status: "LOCKED", prog: null,
    tag: "Finds your real volume ceilings instead of borrowing a template's.",
    deep: "Weekly sets per muscle plotted against performance and recovery response — your maximum recoverable volume, discovered rather than assumed. The literature prior it starts from: Schoenfeld, Ogborn & Krieger 2017 (meta-analysis) found a graded dose-response with 10+ weekly sets per muscle outgrowing lower volumes. That's the build-phase climb target; the cut deliberately sits below it.",
    forYou: (() => { const cut7 = isoOf(new Date(todayStart().getTime() - 7 * DAY)); const perMg = {}; Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cut7) (sl.entries || []).forEach((e2) => { const ex2 = exById(s, e2.id); if (ex2 && ex2.mg && e2.reps) perMg[ex2.mg] = (perMg[ex2.mg] || 0) + e2.reps.length; }); }); const parts = Object.entries(perMg).map(([m, n2]) => `${m} ${n2}`); return `MEV on purpose while cutting — growing on the minimum is the plan. Your logged sets this week: ${parts.length ? parts.join(" · ") : "none in-app yet"} · the build climbs each toward the 10+ landmark, then past it until YOUR ceiling shows.`; })(),
    lines: ["engine ships with the September program push"] });
  out.push({ id: "debutmodel", t: "DEBUT-READINESS MODEL", status: "LOCKED", prog: null,
    tag: "Learns the exact conditions under which your debuts land.",
    deep: "Sleep, refeed distance, recovery score at each debut vs its outcome — a trained gate replacing the hand-tuned sleep-only one, once ~15 build-phase debuts exist to learn from.",
    forYou: "The current sleep-clean gate is the hand-tuned version and it has not been wrong yet.",
    lines: ["needs ~15 build-phase debuts"] });

  const rank = { LIVE: 0, ARMED: 1, LOCKED: 2 };
  return out.sort((a, b) => rank[a.status] - rank[b.status]);
}

/* which nights are owed? dated by the evening they began; logged the morning after; pre-5am still means the night you finished */
function owedNights(s, hour = new Date().getHours()) {
  const ref = hour < 5 ? new Date(todayStart().getTime() - DAY) : todayStart();
  const out = [];
  for (let k = 1; k <= 3; k++) {
    const d = isoOf(new Date(ref.getTime() - k * DAY));
    if (!s.sleep.nights.some((n) => n.d === d)) out.push(d);
  }
  return out.slice(0, 2);
}

/* THE ONE THING — the priority ladder that answers "what do I do?" before scrolling */
function theOneThing(s, slp, hour = new Date().getHours()) {
  const tISO = isoOf(todayStart());
  const owed = owedNights(s, hour);
  const slLogged = owed.length === 0;
  const dLogged = s.dailyLogs[tISO] && s.dailyLogs[tISO].cal != null;
  const dt = dayType(tISO);
  const trainToday = dt === "U" || dt === "L";
  const sessDone = !!s.sessionLog[tISO];
  if (!slLogged) {
    const flips = !slp.clean && slp.run + 1 >= slp.need;
    return { t: `Log ${fmtShort(owed[0])}'s night`, sub: flips ? "one tap — ≥7.5 flips you CLEAN and today's attempts count for keeps" : "one tap — the whole engine keys off it" };
  }
  if (s.fixWindow && !dLogged) return { t: "Fix window is open", sub: "175 today closes it and EXTENDS the record — recovery is the metric" };
  if (trainToday && !sessDone && hour >= 10) { const g = genSession(s, tISO, slp); return { t: "Today: " + (g.structural || g.name), sub: "log it in TRAIN when the iron's down" }; }
  if (!dLogged && hour >= 17) return { t: "Close the day", sub: "cal · protein · steps — pre-filled to targets, adjust and tap" };
  if (!dLogged) return { t: "Day open — nothing owed yet", sub: "numbers close it tonight · everything else is optional reading" };
  return { t: "Everything's banked ✓", sub: slp.clean ? "protect the streak — same bedtime tonight" : "tonight ≥7.5 keeps the reset alive" };
}

/* the week, in one paragraph — auto-written from state */
function weekDigest(s) {
  const lw = liveRollups(s)[0];
  if (!lw) return "The digest writes itself from your first logged day — trend, protein, sessions, sleep, wins, in one paragraph.";
  const parts = [];
  const cur = currentRate(s);
  const sealedNow = daysUntil(s.blackout.until) > 0;
  parts.push(sealedNow ? `Scale sealed — trend holds at ${s.trend} until ${fmtShort(SEAL_UNTIL)}.` : cur.measured ? `Trend ${s.trend}, moving ~${cur.scale}/wk.` : `Trend ${s.trend}.`);
  if (lw.proN) parts.push(`Protein ${lw.proHit}/${lw.proN} on target${s.fixWindow ? " — one fix window open" : ""}.`);
  const wkStart = isoOf(new Date(mk(START).getTime() + (lw.wk - 1) * 7 * DAY));
  const sess = Object.keys(s.sessionLog).filter((d) => d >= wkStart).length;
  if (sess) parts.push(`${sess} session${sess > 1 ? "s" : ""} logged.`);
  const wins = s.feed.filter((f) => f.d >= wkStart && /OWNED|DEBUT|EARNED|COMPLETE|RECLAIM/.test(f.t)).slice(0, 2).map((f) => f.t.toLowerCase());
  if (wins.length) parts.push(`Wins: ${wins.join(", ")}.`);
  if (lw.avgSlp != null) parts.push(`Sleep avg ${lw.avgSlp} h.`);
  return parts.join(" ");
}

/* live weekly rollups — post-handoff weeks, same shape as the sheet era, accruing forever */
function liveRollups(s) {
  const dates = [...new Set([...Object.keys(s.dailyLogs), ...s.reads.map((r) => r.d), ...s.sleep.nights.map((n) => n.d), ...Object.keys(s.sessionLog)])].filter((d) => d > "2026-07-21").sort();
  if (!dates.length) return [];
  const wkOf = (d) => Math.floor((mk(d) - mk(START)) / (7 * DAY)) + 1;
  const wks = {};
  dates.forEach((d) => { (wks[wkOf(d)] = wks[wkOf(d)] || []).push(d); });
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  return Object.keys(wks).map(Number).sort((a, b) => b - a).map((wk) => {
    const rows = wks[wk].map((d) => ({
      d,
      w: (s.reads.find((r) => r.d === d && !r.sealed) || {}).w ?? null,
      sealedW: (s.reads.find((r) => r.d === d && r.sealed) || {}).w ?? null,
      cal: (s.dailyLogs[d] || {}).cal ?? null, pro: (s.dailyLogs[d] || {}).pro ?? null,
      steps: (s.dailyLogs[d] || {}).steps ?? null, slp: (s.sleep.nights.find((n) => n.d === d) || {}).h ?? null,
      note: (s.sessionLog[d] || {}).note || "", niggles: (s.sessionLog[d] || {}).niggles || [],
    }));
    const ws = rows.filter((r) => r.w != null).map((r) => r.w);
    const cals = rows.filter((r) => r.cal != null).map((r) => r.cal);
    const pros = rows.filter((r) => r.pro != null).map((r) => r.pro);
    const st = rows.filter((r) => r.steps != null).map((r) => r.steps);
    const sl = rows.filter((r) => r.slp != null).map((r) => r.slp);
    const startD = isoOf(new Date(mk(START).getTime() + (wk - 1) * 7 * DAY));
    const endRaw = new Date(mk(START).getTime() + ((wk - 1) * 7 + 6) * DAY);
    const endD = isoOf(endRaw > todayStart() ? todayStart() : endRaw);
    return { wk, live: true, rows, range: `${fmtShort(startD)} – ${fmtShort(endD)}`,
      avgW: ws.length ? +avg(ws).toFixed(1) : null, avgCal: cals.length ? Math.round(avg(cals)) : null,
      avgPro: pros.length ? Math.round(avg(pros)) : null, proHit: pros.filter((x) => Math.abs(x - PROTEIN) <= 10).length, proN: pros.length,
      avgSteps: st.length ? +(avg(st) / 1000).toFixed(1) : null, avgSlp: sl.length ? +avg(sl).toFixed(1) : null, flags: 0 };
  });
}

/* was the sleeper clean walking into a given date? */
function cleanAtDate(s, iso) {
  const nights = s.sleep.nights.filter((n) => n.d < iso);
  let run = 0;
  for (let i = nights.length - 1; i >= 0; i--) { if (nights[i].h >= s.sleep.cleanH) run++; else break; }
  return run >= s.sleep.needed;
}

/* the debt ledger: seeded receipts + live-computed charges as sessions accrue */
function debtLedger(s) {
  const seeded = s.sleep.debts.map((t) => ({ txt: t, live: false }));
  const out = [];
  const dates = Object.keys(s.sessionLog).sort();
  dates.forEach((d, di) => {
    if (cleanAtDate(s, d)) return;
    (s.sessionLog[d].entries || []).forEach((e) => {
      if (!e.reps || !e.reps.length) return;
      for (let i = di - 1; i >= 0; i--) {
        const pd = dates[i];
        if (!cleanAtDate(s, pd)) continue;
        const pe = (s.sessionLog[pd].entries || []).find((x) => x.id === e.id && x.reps && x.reps.length === e.reps.length);
        if (!pe) continue;
        const delta = e.reps.reduce((a, b) => a + b, 0) - pe.reps.reduce((a, b) => a + b, 0);
        if (delta < 0) { const ex = exById(s, e.id); out.push({ txt: `${ex ? ex.n : e.id} ${fmtShort(d)}: ${e.reps.join(",")} vs clean ${pe.reps.join(",")} — ${delta} reps on debt`, live: true }); }
        break;
      }
    });
  });
  return [...seeded, ...out];
}

/* THE SHELF — established literature, imported as priors, computed at his numbers. The LAB tests; the shelf informs. */
function shelfItems(s) {
  const kg = +(s.trend / 2.205).toFixed(1);
  const perFeed = Math.round(PROTEIN / 4);
  const out = [];
  out.push({ id: "spread", t: "PROTEIN SPREAD", status: "ON FILE",
    tag: `${PROTEIN} works harder split into 4.`,
    lines: [`~${perFeed} g × 4 feeds · every 3–4 h · wake / pre-lift / post-lift / pre-bed`],
    deep: "Areta et al. 2013 (J Physiol): 20 g every 3 h beat both 40 g every 6 h and 10 g every 1.5 h for 24-hour muscle protein synthesis at equal totals. Mamerow et al. 2014: even distribution across meals out-synthesized the typical dinner-skewed pattern. In a deficit, distribution is muscle protection — the same grams, better spent.",
    forYou: `No new logging — this is a shape, not a chore. Your noon lift makes the anchors natural: feed ~1 h pre-lift, feed after, and keep the last feed near bed (slow protein there works with the overnight fast). Four ~${perFeed} g landings and the day's ${PROTEIN} places itself.` });
  out.push({ id: "caffdose", t: "CAFFEINE — THE STUDY RANGE, AT YOUR WEIGHT", status: "ON FILE",
    tag: "Dose by bodyweight, not by habit.",
    lines: [`3–6 mg/kg (Grgic 2019 meta) ≈ ${Math.round(3 * kg)}–${Math.round(6 * kg)} mg at ${kg} kg · ~45–60 min pre-lift`],
    deep: "Grgic et al. 2019/2020 meta-analyses support caffeine at ~3–6 mg/kg for strength and power. The range recomputes here as your weight falls. Timing matters more than most supplements' entire effect: ~45–60 minutes pre-training.",
    forYou: "The safety frame outranks the range: you stack prescribed Adderall + a pre-workout, so TOTAL stimulant load is a prescriber conversation — the study range is information, never a target to climb. Read your pre-workout's actual mg once, know your number, and your existing early-afternoon cutoff keeps protecting the sleep ledger." });
  out.push({ id: "creatine", t: "CREATINE PROTOCOL", status: s.creatine ? "TRACKING" : "ON FILE",
    tag: "The most-proven supplement, timed to hide its own water.",
    lines: s.creatine ? [`day ${Math.max(1, Math.round((todayStart() - mk(s.creatine.start)) / DAY) + 1)} of ~28 to saturation · 5 g/day`] : ["5 g/day · no loading needed · start inside the sealed window"],
    deep: "Kreider et al. 2017 (JISSN position stand): creatine monohydrate is the most effective legal ergogenic for high-intensity work; 5 g/day saturates in ~3–4 weeks without loading (loading just gets there faster). Bonus relevant to you: evidence for cognitive support under sleep restriction.",
    forYou: s.creatine ? "The 1–2 lb water bump is folding into the trend while the seal holds and the noise floor absorbs the rest — by the time it matters, it's just part of your baseline. Never stop-start; consistency is the whole mechanism." : "Start now and the water bump lands while the scale is quarantined — it never pollutes a clean read. One button below files the start date so saturation day is visible.",
    action: !s.creatine });
  out.push({ id: "matador", t: "DIET-BREAK EVIDENCE", status: "ON FILE",
    tag: "Your Ease ladder, with a citation.",
    lines: ["MATADOR · Byrne 2018 · Int J Obes"],
    deep: "The MATADOR trial (Byrne et al. 2018): 2 weeks dieting alternated with 2 weeks at maintenance preserved more resting metabolic rate and produced greater fat loss than continuous restriction at matched deficits. The mechanism story: periodic maintenance blunts adaptive slowdown.",
    forYou: "Ease 1 → Ease 2 already breathes like this — stepped, not white-knuckled. On file for one specific future: if the cut runs past week 16, the cited move is a full 2-week maintenance break before pushing on. Coach call, evidence attached." });
  out.push({ id: "sleepceil", t: "SLEEP CEILING", status: "ON FILE",
    tag: "7.5 is your floor; the ceiling may pay.",
    lines: ["Mah 2011 · tested live in THE LAB above"],
    deep: "Mah et al. 2011: extending athletes' sleep produced objectively better performance — habitual sleep is a floor, not an optimum. Your CLEAN gate guards the floor; the ceiling question is answerable only in your own data.",
    forYou: "The SLEEP DOSE experiment in the LAB is this study, running on you. Bank ≥8.5 h nights — especially before big attempts — and the experiment arms itself as a side effect of good decisions." });
  return out;
}

/* the macro engine: snapshots + rule proposals. Idempotent per day. */
function runAdaptive(state, todayISO) {
  const s = JSON.parse(JSON.stringify(state));
  const monday = (() => { const d = mk(todayISO); const off = (d.getDay() + 6) % 7; return isoOf(new Date(d - off * DAY)); })();
  if (!s.weekly.some((w) => w.wk === monday) && s.reads.some((r) => !r.sealed && weeksBetween(monday, r.d) >= 0 && weeksBetween(monday, r.d) < 1))
    s.weekly.push({ wk: monday, trend: s.trend });

  const armed = (rid) => s.proposals.some((p) => p.rid === rid && !p.resolved);
  const applied = (rid) => s.adjustments.some((a) => a.rid === rid);
  const propose = (rid, title, why, apply) => { if (!armed(rid) && !applied(rid)) s.proposals.push({ rid, id: `${rid}_${todayISO}`, d: todayISO, title, why, apply, resolved: false }); };

  const sealed = daysUntil(s.blackout.until) > 0;
  const r = currentRate(s);
  if (!sealed && r.measured && r.rates.slice(-2).length === 2 && r.rates.slice(-2).every((x) => x < s.rate.floor))
    propose("floor_" + monday, "RATE FLOOR TRIPPED", `Two weeks under ${s.rate.floor}/wk (${r.rates.slice(-2).map((x) => x.toFixed(1)).join(", ")}). Your rule: restore steps FIRST. If steps are already at target, trim ~50 off the calorie band.`, { kind: "note" });
  if (!sealed && r.measured && r.rates[r.rates.length - 1] >= s.rate.redline)
    propose("redline_" + monday, "REDLINE RATE", `${r.rates[r.rates.length - 1].toFixed(1)}/wk ≥ ${s.rate.redline}. Your rule: add ~100 back and flag your coach — this is not a win, it's muscle risk.`, { kind: "cal", delta: 100 });

  const bf = bfEst(s);
  if (!sealed && s.phase === "EASE 1" && bf.pct <= 13.2 && s.trend < 163)
    propose("ease2", "EASE 2 — CONDITIONS MET", `Est. BF ${bf.pct}% has crossed the ~13% line. Applying moves you to ${PHASES["EASE 2"].band.join("–")} cal with the step taper — scale will slow by design while fat loss holds.`, { kind: "phase", to: "EASE 2" });
  if (!sealed && bf.pct <= 11.2 && !s.queue.find((q) => q.id === "q_pivot").done)
    propose("pivot", "PIVOT WINDOW — COACH'S EYE", `Est. BF ${bf.pct}% is in the 10.5–11 band. This one is not a tap — book the look with your coach. The app proposes; humans authorize.`, { kind: "note" });

  const rec = recoveryIndex(s);
  if (rec.band === "LOW")
    propose("recovery_" + monday, `RECOVERY LOW — ${rec.score}/100`, `Converging signals: ${rec.factors.join(" · ")}. The rule: hold all structural changes this week and flag your coach for a lighter one. Nothing auto-changes.`, { kind: "note" });

  return s;
}

function applyProposal(state, pid) {
  const s = JSON.parse(JSON.stringify(state));
  const p = s.proposals.find((x) => x.id === pid);
  if (!p || p.resolved) return s;
  p.resolved = true;
  s.adjustments.push({ rid: p.rid, d: isoOf(todayStart()), title: p.title });
  if (p.apply.kind === "phase" && p.apply.to) {
    s.phase = p.apply.to;
    const q = s.queue.find((x) => x.id === "q_ease2"); if (q) { q.done = true; q.state = "FIRED"; }
    s.feed.unshift({ d: isoOf(todayStart()), t: `${p.apply.to} FIRED`, how: `est. BF crossed the line — targets now ${PHASES[p.apply.to].band.join("–")} · steps: ${PHASES[p.apply.to].steps}. Mirror outranks scale from here.` });
  } else {
    s.feed.unshift({ d: isoOf(todayStart()), t: "ADJUSTMENT LOGGED", how: `${p.title} — ${p.why}` });
  }
  return s;
}

/* undo a same-day scale read — restores trend and clears this week's snapshot if orphaned */
function undoRead(state, iso) {
  const s = JSON.parse(JSON.stringify(state));
  const i = s.reads.findIndex((r) => r.d === iso);
  if (i === -1) return s;
  const r = s.reads[i];
  s.reads.splice(i, 1);
  if (!r.sealed && r.pt != null) s.trend = r.pt;
  const d = mk(iso); const off = (d.getDay() + 6) % 7; const monday = isoOf(new Date(d - off * DAY));
  const stillClean = s.reads.some((x) => !x.sealed && x.d >= monday && weeksBetween(monday, x.d) < 1);
  if (!stillClean) s.weekly = s.weekly.filter((w) => w.wk !== monday);
  return s;
}

/* DEXA anchoring — one input recalibrates the whole model */
function anchorDexa(state, pct) {
  const s = JSON.parse(JSON.stringify(state));
  const eyeNow = bfEst(s).pct;
  s.dexaRecon = { d: isoOf(todayStart()), eye: eyeNow, dexa: pct, delta: +(pct - eyeNow).toFixed(1) };
  s.model = { lean: +(s.trend * (1 - pct / 100)).toFixed(1), anchorISO: isoOf(todayStart()), drip: s.model.drip, src: "DEXA", err: "±1" };
  const q = s.queue.find((x) => x.id === "q_dexa"); if (q) { q.done = true; q.state = "ANCHORED"; }
  s.feed.unshift({ d: isoOf(todayStart()), t: "DEXA ANCHORED", how: `${pct}% at trend ${s.trend} → lean ${s.model.lean}. Every estimate and ETA now runs off measured ground truth.` });
  return s;
}

/* migrate v1/v2/v3 → v4, preserving everything the person logged */
function patchV4(s) {
  s.waist = s.waist || [];
  (s.exercises || []).forEach((e) => { e.rirHist = e.rirHist || []; });
  s.v = 4;
  return s;
}
function patchV5(s) {
  SEED.exercises.forEach((se, i) => {
    if (!s.exercises.some((e) => e.id === se.id)) s.exercises.splice(Math.min(i, s.exercises.length), 0, JSON.parse(JSON.stringify(se)));
  });
  if (!s.exOrder) s.exOrder = JSON.parse(JSON.stringify(SEED.exOrder));
  s.v = 5;
  return s;
}
function patchV6(s) {
  SEED.exercises.forEach((se) => {
    const e = s.exercises.find((x) => x.id === se.id);
    if (e) { e.setup = se.setup; e.n = se.n; }
  });
  s.v = 6;
  return s;
}
function patchV7(s) {
  SEED.exercises.forEach((se) => { const e = s.exercises.find((x) => x.id === se.id); if (e) { e.setup = se.setup; e.n = se.n; } });
  s.v = 7;
  return s;
}
function patchV8(s) {
  const logDates = Object.keys(s.sessionLog || {}).sort().reverse();
  s.exercises.forEach((e) => {
    if (e.lastMeta) return;
    for (const d of logDates) {
      const en = (s.sessionLog[d].entries || []).find((x) => x.id === e.id);
      if (en && en.reps && en.reps.length) { e.lastMeta = { d, w: e.w, reps: en.reps.slice(), rir: en.rir ?? null }; return; }
    }
    const se = SEED.exercises.find((x) => x.id === e.id);
    if (se && se.lastMeta) e.lastMeta = JSON.parse(JSON.stringify(se.lastMeta));
  });
  s.v = 8;
  return s;
}
function patchV9(s) {
  s.photos = s.photos || [];
  s.sync = s.sync || { last: null, status: "" };
  s.v = 9;
  return s;
}
function patchV10(s) {
  if (s.creatine === undefined) s.creatine = null;
  SEED.exercises.forEach((se) => { const e = s.exercises.find((x) => x.id === se.id); if (e && se.mg) e.mg = se.mg; });
  s.v = 10;
  return s;
}
function migrate(old) {
  if (old && old.v === 10) return old;
  if (old && old.v >= 3 && old.v <= 9) return patchV10(patchV9(patchV8(patchV7(patchV6(patchV5(patchV4(JSON.parse(JSON.stringify(old)))))))));
  const s = JSON.parse(JSON.stringify(SEED));
  if (!old || (old.v !== 1 && old.v !== 2)) return s;
  ["feed", "sessionLog", "events", "boosts", "thesisConfirms", "lastThesisWk", "zeroComp", "fixWindow"].forEach((k) => { if (old[k] !== undefined) s[k] = old[k]; });
  (old.reads || []).forEach((r) => { if (!s.reads.some((x) => x.d === r.d)) s.reads.push(r); });
  s.reads.sort((a, b) => (a.d < b.d ? -1 : 1));
  s.reads.filter((r) => !r.sealed && r.d > "2026-07-21").forEach((r) => { const dCl = Math.max(-1.5, Math.min(1.5, r.w - s.trend)); s.trend = +(s.trend + 0.3 * dCl).toFixed(1); });
  ((old.sleep && old.sleep.nights) || []).forEach((n) => { if (!s.sleep.nights.some((x) => x.d === n.d)) s.sleep.nights.push(n); });
  s.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
  Object.entries(old.dailyLogs || {}).forEach(([d, v]) => { s.dailyLogs[d] = v; });
  if (old.v === 2) {
    if (old.exercises) s.exercises = old.exercises;
    if (old.queue) s.queue = old.queue;
    if (old.proposals) s.proposals = old.proposals;
    if (old.adjustments) s.adjustments = old.adjustments;
    if (old.phase) s.phase = old.phase;
  }
  if (old.v === 1 && old.queue) old.queue.filter((q) => q.done).forEach((oq) => {
    if (oq.id === "rows180") { const e = exById(s, "rows"); e.w = 180; s.queue.find((x) => x.id === "q_rows180").done = true; }
    if (oq.id === "press245") { const e = exById(s, "press"); e.own = false; e.std = null; s.queue.find((x) => x.id === "q_press_own").done = true; }
    if (oq.id === "hack3") { const e = exById(s, "hack"); e.pendingThird = false; e.sets = 3; s.queue.find((x) => x.id === "q_hack3").done = true; }
    if (oq.id === "abs100") { s.queue.find((x) => x.id === "q_abs").done = true; }
    if (oq.id === "calf315") { const e = exById(s, "calves"); e.reclaim = null; s.queue.find((x) => x.id === "q_calves").done = true; }
    if (oq.id === "ext150") { const e = exById(s, "extension"); e.own = false; e.std = null; s.queue.find((x) => x.id === "q_ext").done = true; }
    if (oq.id === "dexa") { s.queue.find((x) => x.id === "q_dexa").state = "BOOKED"; }
  });
  return patchV10(patchV9(patchV8(patchV7(patchV6(patchV5(patchV4(s)))))));
}

const GLOSSARY = {
  fixwindow: ["Fix window", "Yesterday's protein landed outside the band, so a 24-hour repair window opened. Hit 175±10 today and the record EXTENDS — the app measures recovery speed, never an unbroken chain. Unfixed, it just closes; nothing compounds."],
  rir: ["RIR — reps in reserve", "How many clean reps were left when you racked it. 1 is 'honest' — one more good rep existed. 0 is a grind. Rate only the first set, and when unsure at noon on the stim stack, call it 0."],
  debt: ["On debt", "That session happened before three consecutive ≥7.5 h nights. Down numbers on debt read as context, not regression — and PRs hit on debt log as provisional, because they don't reliably repeat."],
  clean: ["CLEAN (sleep)", "Three consecutive nights of ≥7.5 h. One good night repays acute debt, but consolidation lags ~2–3 nights — so owns and earns only count when CLEAN."],
  seal: ["Sealed scale", "Around events, reads are quarantined: logged but excluded from the trend, and every rate rule is muted. The seal exists so event water can never trigger a false alarm."],
  trend: ["Trend", "The damped average the whole app runs on: each clean read moves it 30% of the way, spikes clamp at ±1.5 lb, sealed reads don't touch it. Mornings are static; the trend is the instrument."],
  own: ["OWNED", "The standard repeated on a clean day. One hit is a visit; a repeat is an address. Only owned standards let the load move."],
  earned: ["EARNED", "Reps hit the top of the window on a clean day — the increment is bought and queues itself for a debut. Grinds at RIR 0 never earn."],
  debut: ["DEBUT", "An earned load's first outing. It runs when it wins its day's single structural slot, with zero rep expectations — log what it gives."],
  gated: ["GATED", "Visible but locked behind a named condition. The condition decides, not memory or mood."],
  reclaim: ["RECLAIM", "A standard that slipped. The exact rep line must be re-earned before anything moves — records here can fall and be won back."],
  parked: ["PARKED", "Deliberately shelved with a written trigger (a date, a phase, a coach call). Parked isn't forgotten; it's staged."],
  structural: ["Structural change", "A load jump, new set, or machine change. One per session, auto-picked from the queue — so every response stays attributable. Rep progression is unlimited."],
  whoosh: ["Whoosh", "Event water leaving days after the event — a spike that drains to a NEW low. Yours clears in 1–3 days; the LAB predicts the window in advance."],
  nightdate: ["How nights are dated", "A night belongs to the evening it began: Tuesday night = Tue evening → Wed morning, filed under Tuesday. You log it the morning after. Before 5 a.m. the app still means the night you already finished — never the one you haven't slept yet. Missed a morning? The row stays, dated, for up to 3 days."],
  noise: ["Noise floor", "Your scale's measured day-to-day static: ±0.8 lb. Any single-morning move inside it is not information, and the app stamps it so."],
};

export const __test = { targetsFor, genSession, completeSession, runAdaptive, bfEst, currentRate, etaWeeks, migrate, applyProposal, undoRead, recoveryIndex, applyRead, observedTDEE, labAnalytics, shelfItems, debtLedger, liveRollups, weekDigest, theOneThing, owedNights, GLOSSARY, anchorDexa, SEED, dayType, HISTORY, ROLLUPS };

/* ---------- github self-filing (token never enters exportable state) ---------- */
const TOKEN_KEY = "prep-ledger-ghtoken";
async function ghSync(state) {
  let tok = null;
  try { tok = localStorage.getItem(TOKEN_KEY); } catch (e) {}
  if (!tok) return { ok: false, msg: "no token saved" };
  const url = "https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/state.json";
  const hdr = { Authorization: "Bearer " + tok, Accept: "application/vnd.github+json" };
  let sha = null;
  try { const g = await fetch(url, { headers: hdr }); if (g.ok) sha = (await g.json()).sha; } catch (e) {}
  const body = { message: "ledger auto-sync " + isoOf(todayStart()) + " [skip ci]", content: btoa(unescape(encodeURIComponent(JSON.stringify(state)))), ...(sha ? { sha } : {}) };
  try {
    const put = await fetch(url, { method: "PUT", headers: { ...hdr, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return put.ok ? { ok: true } : { ok: false, msg: "HTTP " + put.status + (put.status === 401 ? " — token expired?" : "") };
  } catch (e) { return { ok: false, msg: "network" }; }
}

/* ---------- storage ---------- */
const KEY = "prep-ledger-v1";
function loadState() {
  let raw = null;
  try { raw = localStorage.getItem(KEY); } catch (e) {}
  let s = migrate(raw ? JSON.parse(raw) : null);
  s = runAdaptive(s, isoOf(todayStart()));
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  return s;
}

/* ---------- derived ---------- */
function sleepInfo(s) {
  const n = s.sleep.nights;
  let run = 0;
  for (let i = n.length - 1; i >= 0; i--) { if (n[i].h >= s.sleep.cleanH) run++; else break; }
  return { run, clean: run >= s.sleep.needed, last: n[n.length - 1], need: s.sleep.needed };
}
function weekDay() {
  const diff = Math.round((todayStart() - mk(START)) / DAY);
  return { wk: Math.floor(diff / 7) + 1, day: diff + 1 };
}
const blackoutOn = (s) => daysUntil(s.blackout.until) > 0;
const nextTrainingISO = (s) => { for (let i = 0; i <= 7; i++) { const d = isoOf(new Date(todayStart().getTime() + i * DAY)); const t = dayType(d); if (t === "U" || t === "L") return d; } return null; };

/* ---------- atoms ---------- */
const Eyebrow = ({ children, c = T.dim }) => (
  <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", color: c, textTransform: "uppercase" }}>{children}</div>
);
const stampColor = (st) => {
  if (["OWNED", "RECLAIMED", "ESTABLISH", "ESTABLISHED", "BASELINE", "RUNG DONE", "BOOKED", "FIRED", "ANCHORED"].includes(st)) return T.jade;
  if (["DEBUT"].includes(st)) return T.orange;
  if (st === "LIVE") return T.jade;
  if (st === "LOCKED") return T.dim;
  if (st === "ON FILE") return T.steel;
  if (st === "TRACKING") return T.jade;
  if (["PARKED", "UNBOOKED", "COACH'S EYE", "ARMS @ ~13%", "COACH FLAG"].includes(st)) return T.dim;
  return T.brass;
};
const Stamp = ({ st }) => (
  <span style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.14em", color: stampColor(st), border: `1px solid ${stampColor(st)}`, borderRadius: 3, padding: "2px 6px", whiteSpace: "nowrap" }}>{st}</span>
);
const Card = ({ children, style = {}, accent }) => (
  <div style={{ background: T.plate, border: `1px solid ${T.line}`, borderLeft: accent ? `3px solid ${accent}` : `1px solid ${T.line}`, borderRadius: 8, padding: 14, ...style }}>{children}</div>
);
const Chip = ({ children, c = T.steel }) => (
  <span style={{ fontFamily: mono, fontSize: 10.5, color: c, border: `1px solid ${T.line}`, borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap" }}>{children}</span>
);
const Btn = ({ onClick, children, tone = "ghost", full, small, disabled }) => {
  const tones = {
    ghost: { background: "transparent", color: T.chalk, border: `1px solid ${T.line}` },
    jade: { background: T.jade, color: T.ink, border: `1px solid ${T.jade}` },
    orange: { background: T.orange, color: T.ink, border: `1px solid ${T.orange}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...tones[tone], opacity: disabled ? 0.4 : 1, fontFamily: mono, fontSize: small ? 11 : 12.5, letterSpacing: "0.06em", borderRadius: 6, padding: small ? "6px 10px" : "10px 14px", width: full ? "100%" : "auto", fontWeight: 600, cursor: disabled ? "default" : "pointer" }}>
      {children}
    </button>
  );
};
const Stepper = ({ v, set, step = 1, min = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <button onClick={() => set(Math.max(min, +(v - step).toFixed(1)))} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>−</button>
    <div style={{ fontFamily: mono, fontSize: 15, color: T.chalk, minWidth: 38, textAlign: "center" }}>{v}</div>
    <button onClick={() => set(+(v + step).toFixed(1))} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>+</button>
  </div>
);
const Num = ({ children, size = 30, c = T.chalk }) => (
  <span style={{ fontFamily: mono, fontSize: size, fontWeight: 600, color: c, letterSpacing: "-0.02em" }}>{children}</span>
);
const H = ({ children, size = 26, c = T.chalk }) => (
  <div style={{ fontFamily: disp, fontWeight: 700, fontSize: size, lineHeight: 1.02, color: c, textTransform: "uppercase", letterSpacing: "0.01em" }}>{children}</div>
);
function Term({ k, children, c }) {
  return (
    <span onClick={(e) => { e.stopPropagation(); if (window.__setGloss) window.__setGloss(k); }}
      style={{ borderBottom: `1px dotted ${c || T.steel}`, cursor: "pointer" }}>{children}</span>
  );
}

function More({ deep, forYou, c = T.jade }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setOpen(!open)} style={{ fontFamily: mono, fontSize: 8.5, letterSpacing: "0.1em", color: open ? T.chalk : T.dim, background: "none", border: "none", padding: 0 }}>{open ? "▾ CLOSE" : "▸ MORE"}</button>
      {open && (
        <div style={{ marginTop: 8, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
          <Eyebrow>WHAT IT IS</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 5, lineHeight: 1.55 }}>{deep}</div>
          {forYou && (
            <div style={{ marginTop: 10 }}>
              <Eyebrow c={c}>FOR YOU · RIGHT NOW</Eyebrow>
              <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 5, lineHeight: 1.55 }}>{forYou}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const Bar = ({ pct, c = T.jade, h = 5 }) => (
  <div style={{ height: h, background: T.plate2, borderRadius: 99, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: "100%", background: c, borderRadius: 99 }} />
  </div>
);

function Spark({ reads, trend }) {
  const W = 300, Hh = 84, pad = 8;
  const clean = reads.filter((r) => !r.sealed);
  const all = reads;
  if (!all.length) return null;
  const t0 = mk(all[0].d).getTime(), t1 = Math.max(mk(all[all.length - 1].d).getTime(), todayStart().getTime());
  const ws = all.map((r) => r.w).concat([trend]);
  const lo = Math.min(...ws) - 1, hi = Math.max(...ws) + 1;
  const x = (d) => pad + ((mk(d).getTime() - t0) / Math.max(1, t1 - t0)) * (W - 2 * pad);
  const y = (w) => pad + (1 - (w - lo) / (hi - lo)) * (Hh - 2 * pad);
  const path = clean.map((r, i) => `${i ? "L" : "M"}${x(r.d).toFixed(1)},${y(r.w).toFixed(1)}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${Hh}`} style={{ display: "block" }}>
      <line x1={pad} x2={W - pad} y1={y(trend)} y2={y(trend)} stroke={T.jade} strokeDasharray="3 4" strokeWidth="1" opacity="0.7" />
      <path d={path} fill="none" stroke={T.steel} strokeWidth="1.4" />
      {all.map((r, i) => (
        <circle key={i} cx={x(r.d)} cy={y(r.w)} r="3.2" fill={r.sealed ? "none" : T.chalk} stroke={r.sealed ? T.dim : "none"} strokeWidth="1.2" />
      ))}
      <text x={W - pad} y={y(trend) - 4} textAnchor="end" fontFamily={mono} fontSize="9" fill={T.jade}>trend {trend}</text>
    </svg>
  );
}

function RateGauge({ rate, cur }) {
  const min = 0, max = 2.2;
  const px = (v) => `${Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))}%`;
  return (
    <div>
      <div style={{ position: "relative", height: 10, background: T.plate2, borderRadius: 99 }}>
        <div style={{ position: "absolute", left: px(rate.band[0]), width: `calc(${px(rate.band[1])} - ${px(rate.band[0])})`, top: 0, bottom: 0, background: "rgba(76,195,138,0.28)", borderRadius: 99 }} />
        <div style={{ position: "absolute", left: px(rate.floor), top: -3, bottom: -3, width: 2, background: T.brass }} />
        <div style={{ position: "absolute", left: px(rate.redline), top: -3, bottom: -3, width: 2, background: T.redline }} />
        <div style={{ position: "absolute", left: px(cur.fat), top: -4, width: 3, bottom: -4, background: T.chalk, borderRadius: 2 }} />
        <div style={{ position: "absolute", left: px(cur.scale), top: 1, width: 2, bottom: 1, background: T.steel }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, fontFamily: mono, fontSize: 9.5, color: T.dim }}>
        <span style={{ color: T.brass }}>floor {rate.floor}</span><span style={{ color: T.jade }}>band {rate.band.join("–")}</span><span style={{ color: T.redline }}>redline {rate.redline}</span>
      </div>
      <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 6 }}>
        scale ~{cur.scale}/wk · <span style={{ color: T.chalk }}>fat ~{cur.fat}/wk</span>{cur.measured ? " — measured from your trend" : " — prior until 2 clean weeks exist"}
      </div>
    </div>
  );
}

/* ============================================================ TABS */

function Proposals({ s, setS, save }) {
  const open = s.proposals.filter((p) => !p.resolved);
  if (!open.length) return null;
  return (
    <>
      {open.map((p) => (
        <Card key={p.id} accent={T.brass}>
          <Eyebrow c={T.brass}>ADJUSTMENT ARMED · {fmtShort(p.d)}</Eyebrow>
          <H size={19}>{p.title}</H>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 5 }}>{p.why}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn small tone="jade" onClick={() => { const ns = applyProposal(s, p.id); setS(ns); save(ns); }}>Apply — log it</Btn>
          </div>
        </Card>
      ))}
    </>
  );
}

function NowTab({ s, setS, save, slp, openRules, openCoach }) {
  const tISO = isoOf(todayStart());
  const [slpH, setSlpH] = useState(7.5);
  const [dayEdit, setDayEdit] = useState(false);
  const [density, setDensity] = useState(() => { try { return localStorage.getItem("prep-ledger-density") || "focus"; } catch (e) { return "focus"; } });
  const setDens = (v) => { setDensity(v); try { localStorage.setItem("prep-ledger-density", v); } catch (e) {} };
  const [wIn, setWIn] = useState(s.trend);
  const [waistIn, setWaistIn] = useState(s.waist && s.waist.length ? s.waist[s.waist.length - 1].v : 32);
  const wd = weekDay();
  const dt = dayType(tISO);
  const isRefeed = dt === "REFEED";
  const nextISO = nextTrainingISO(s);
  const sess = nextISO ? genSession(s, nextISO, slp) : null;
  const heroToday = nextISO === tISO;
  const dl = s.dailyLogs[tISO] || {};
  const [cal, setCal] = useState(dl.cal ?? 1760);
  const [pro, setPro] = useState(dl.pro ?? 175);
  const [stp, setStp] = useState(dl.steps ?? "");
  const cleanIn = daysUntil(SEAL_UNTIL);
  const xoverIn = daysUntil(CROSSOVER);
  const xPct = Math.round(((todayStart() - mk(START)) / (mk(CROSSOVER) - mk(START))) * 100);
  const ev = s.events.find((e) => !e.estimated && daysUntil(e.d) >= 0);
  const ph = PHASES[s.phase];
  const calT = isRefeed ? [2450, 2500] : ph.band;
  const bf = bfEst(s);
  const nextUnlocks = s.queue.filter((x) => !x.done && x.kind !== "info" && x.kind !== "phase").slice(0, 2);

  const saveDaily = () => {
    const ns = { ...s };
    const c = cal === "" ? null : Number(cal), p = pro === "" ? null : Number(pro), st = stp === "" ? null : Number(stp);
    ns.dailyLogs = { ...ns.dailyLogs, [tISO]: { cal: c, pro: p, steps: st } };
    if (p != null) {
      const hit = Math.abs(p - PROTEIN) <= 10;
      if (!hit && !ns.fixWindow) ns.fixWindow = { opened: tISO };
      if (hit && ns.fixWindow && ns.fixWindow.opened !== tISO) {
        ns.fixWindow = null;
        ns.feed = [{ d: tISO, t: "PROTEIN RECOVERY", how: "miss fixed inside 24 h — the standard extends, it does not reset" }, ...ns.feed];
      }
    }
    setS(ns); save(ns);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <H size={21}>Prep Ledger</H>
          <Eyebrow>WK {wd.wk} · DAY {wd.day} · {s.phase} · EST BF {bf.pct}%</Eyebrow>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setDens(density === "focus" ? "full" : "focus")} style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: density === "full" ? T.chalk : T.steel, background: "none", border: `1px solid ${density === "full" ? T.chalk : T.line}`, borderRadius: 6, padding: "6px 10px" }}>{density === "focus" ? "FULL" : "FOCUS"}</button>
          <button onClick={openCoach} style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: T.steel, background: "none", border: `1px solid ${T.line}`, borderRadius: 6, padding: "6px 10px" }}>COACH</button>
          <button onClick={openRules} style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: T.steel, background: "none", border: `1px solid ${T.line}`, borderRadius: 6, padding: "6px 10px" }}>RULES</button>
        </div>
      </div>

      <Proposals s={s} setS={setS} save={save} />

      {sess && (
        <div style={{ border: `1px solid ${T.line}`, borderRadius: 10, padding: "18px 16px 16px", background: `linear-gradient(180deg, ${T.plate} 0%, ${T.ink} 100%)`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: T.orange }} />
          <Eyebrow c={T.orange}>{heroToday ? "TODAY" : daysUntil(nextISO) === 1 ? "TOMORROW" : "NEXT"} · {fmtShort(nextISO)}</Eyebrow>
          <div style={{ marginTop: 6 }}><H size={32}>{sess.structural}</H></div>
          <div style={{ fontFamily: body, fontSize: 13.5, color: T.steel, marginTop: 6 }}>
            {sess.name} — targets already generated from your last logs. {slp.clean ? "Sleep clean: PRs can be owned." : `Sleep reset ${slp.run}/${slp.need}: PRs log provisional.`}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <Chip c={T.orange}>1 structural change — auto-picked from the queue</Chip>
          </div>
        </div>
      )}

      {isRefeed && (
        <Card accent={T.jade}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Eyebrow c={T.jade}>TODAY · ON-PLAN GREEN DAY</Eyebrow>
              <H size={22}>Rest + Refeed</H>
            </div>
            <Num size={22} c={T.jade}>{REFEED.cal}</Num>
          </div>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 6 }}>{REFEED.note}. Protein still {PROTEIN}.</div>
          <More deep="The weekly elevated-carb day refills muscle glycogen (fullness plus next-day performance), gives adherence and hormones a breather, and is prescribed — an on-plan green day that the streak logic treats as compliance, because it is."
            forYou="Tomorrow's session runs on this fuel — your PR-heavy days historically follow refeeds. Expect the next-morning bump from the LAB's refeed line; it's storage wearing a costume, and you lift heavier ON it." />
        </Card>
      )}

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {cleanIn > 0 && <Chip c={T.chalk}>Scale sealed · clean read {fmtShort(SEAL_UNTIL)} · {cleanIn}d</Chip>}
        {null}
        <Chip c={slp.clean ? T.jade : T.brass}>Sleep {slp.clean ? "CLEAN" : `reset ${slp.run}/${slp.need}`}</Chip>
        {ev && <Chip c={T.chalk}>{ev.t} · {fmtShort(ev.d)}</Chip>}
      </div>

      {(() => {
        if (density !== "full") return null;
        const rec = recoveryIndex(s);
        const c = rec.band === "GREEN" ? T.jade : rec.band === "WATCH" ? T.brass : T.brass;
        return (
          <Card accent={c}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Eyebrow>RECOVERY — HOW BEAT-UP AM I?</Eyebrow>
              <span style={{ fontFamily: mono, fontSize: 12, color: c }}>{rec.score} · {rec.band}</span>
            </div>
            <div style={{ margin: "8px 0 4px" }}><Bar pct={rec.score} c={c} /></div>
            <div style={{ fontFamily: mono, fontSize: 10, color: T.steel }}>{rec.factors.length ? rec.factors.join(" · ") : "no drag on the system — earns count, send it"}</div>
            <More c={c} deep="Four drag sources converge into one number: sleep (reset progress and 5-night average), opener honesty (active RIR holds), joint flags over 14 days, and rep dips across your last two sessions. 80+ = full send, earns and owns count. 55–79 = consolidate. Under 55 arms the hold-structure rule — nothing auto-changes, but the card appears."
              forYou={!slp.clean ? `Biggest lever tonight: ≥7.5 h returns +10 instantly${slp.run + 1 >= slp.need ? " and flips you CLEAN — tomorrow's owns and earns count" : ""}.` : s.exercises.some((e) => e.holdFlag) ? "One honest opener session (RIR ≥1) releases the active hold and returns the points." : "Nothing dragging. The rarest state in a deficit — protect it."} />
          </Card>
        );
      })()}

      {(() => { const one = theOneThing(s, slp); return (
        <Card accent={T.jade} style={{ padding: 12 }}>
          <Eyebrow c={T.jade}>THE ONE THING</Eyebrow>
          <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 19, color: T.chalk, textTransform: "uppercase", marginTop: 2 }}>{one.t}</div>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 4 }}>{one.sub}</div>
        </Card>
      ); })()}

      {(() => {
        const owed = owedNights(s);
        const lastNight = isoOf(new Date((new Date().getHours() < 5 ? todayStart().getTime() - DAY : todayStart().getTime()) - DAY));
        const slAlready = owed.length === 0;
        const wAlready = s.reads.some((r) => r.d === tISO);
        const sealedNow = blackoutOn(s);
        const logW = () => { const ns2 = runAdaptive(applyRead(s, tISO, wIn), tISO); setS(ns2); save(ns2); };
        const lastWaist = s.waist[s.waist.length - 1];
        const waistDue = !lastWaist || Math.round((mk(tISO) - mk(lastWaist.d)) / DAY) >= 7;
        const lastP = s.photos[s.photos.length - 1];
        const photoDue = !lastP || Math.round((mk(tISO) - mk(lastP.d)) / DAY) >= 7;
        return (
          <>
            <Card accent={T.chalk}>
              <Eyebrow>MORNING · CAPTURE — EVERYTHING LOGS HERE</Eyebrow>
              {!slAlready ? owed.map((od, oi) => (
                <div key={od} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: oi === 0 ? 10 : 8 }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, color: oi === 0 ? T.dim : T.brass, width: 74 }}><Term k="nightdate" c={T.dim}>SLEEP</Term><br />{fmtShort(od)} night{oi > 0 ? " · missed" : ""}</div>
                  <Stepper v={slpH} set={setSlpH} step={0.5} min={0} />
                  <div style={{ flex: 1 }}><Btn full small tone="jade" onClick={() => {
                    const ns = JSON.parse(JSON.stringify(s));
                    ns.sleep.nights.push({ d: od, h: slpH });
                    ns.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
                    let run = 0;
                    for (let i = ns.sleep.nights.length - 1; i >= 0; i--) { if (ns.sleep.nights[i].h >= ns.sleep.cleanH) run++; else break; }
                    if (run === ns.sleep.needed) ns.feed.unshift({ d: tISO, t: "SLEEP RESET COMPLETE", how: `${run} consecutive clean nights — PRs can be OWNED again · #1 lever for the back half, and for the ADHD` });
                    setS(ns); save(ns);
                  }}>Log {fmtShort(od).split(" ")[1]}</Btn></div>
                </div>
              )) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: T.jade }}>✓ {fmtShort(lastNight)} night · {(s.sleep.nights.find((n) => n.d === lastNight) || {}).h} h banked</span>
                  <button onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.sleep.nights = ns.sleep.nights.filter((n) => n.d !== lastNight); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 9, color: T.dim, background: "none", border: "none" }}>undo</button>
                </div>
              )}
              {!wAlready ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                  <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, width: 62 }}>WEIGHT<br />{sealedNow ? <Term k="seal" c={T.dim}>sealed</Term> : "fasted"}</div>
                  <Stepper v={wIn} set={setWIn} step={0.1} min={140} />
                  <div style={{ flex: 1 }}><Btn full small onClick={logW}>{sealedNow ? "Log weight (quarantined)" : "Log weight"}</Btn></div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: T.jade }}>✓ weight {(s.reads.find((r) => r.d === tISO) || {}).w} logged{(s.reads.find((r) => r.d === tISO) || {}).sealed ? " · sealed" : ""}</span>
                  <button onClick={() => { const ns = undoRead(s, tISO); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 9, color: T.dim, background: "none", border: "none" }}>undo</button>
                </div>
              )}
              <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 10 }}>evening numbers log below · sessions log in TRAIN · every other tab is reading, not homework</div>
            </Card>
            {(waistDue || photoDue) && (
              <Card accent={T.brass}>
                <Eyebrow c={T.brass}>WEEKLY · DUE — APPEARS ONLY WHEN IT'S TIME</Eyebrow>
                {waistDue && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                    <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, width: 62 }}>WAIST<br />at navel</div>
                    <Stepper v={waistIn} set={setWaistIn} step={0.1} min={20} />
                    <div style={{ flex: 1 }}><Btn full small tone="jade" onClick={() => {
                      const ns = JSON.parse(JSON.stringify(s));
                      const prev = ns.waist[ns.waist.length - 1];
                      ns.waist.push({ d: tISO, v: waistIn });
                      if (prev && waistIn < prev.v) ns.feed.unshift({ d: tISO, t: "WAIST DOWN", how: `${prev.v}" → ${waistIn}" at trend ${ns.trend} — fat loss the scale can't argue with` });
                      setS(ns); save(ns);
                    }}>{lastWaist ? "Log waist" : "Log baseline waist"}</Btn></div>
                  </div>
                )}
                {photoDue && (
                  <div style={{ marginTop: waistDue ? 12 : 10 }}>
                    <Btn full small onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.photos.push({ d: tISO }); setS(ns); save(ns); }}>Mark photos done — same light · same spots · fasted</Btn>
                  </div>
                )}
              </Card>
            )}
          </>
        );
      })()}

      {density === "full" && (<Card>
        <Eyebrow>CLOSEST UNLOCKS · THE QUEUE REFILLS ITSELF</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {nextUnlocks.map((u) => (
            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div>
                <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 16, color: T.chalk, textTransform: "uppercase" }}>{u.t}</div>
                <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel }}>{u.gate}</div>
              </div>
              <Stamp st={u.state} />
            </div>
          ))}
        </div>
      </Card>)}

      {density === "full" && (<Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Eyebrow c={T.chalk}>CROSSOVER · AUG 28</Eyebrow>
          <span style={{ fontFamily: mono, fontSize: 11, color: T.steel }}>{xoverIn}d · {xPct}%</span>
        </div>
        <div style={{ margin: "8px 0 6px" }}><Bar pct={xPct} c={T.chalk} /></div>
        <div style={{ fontFamily: body, fontSize: 12, color: T.steel }}>~158.5 at ~12% — last cut's best with 4–5 lb more muscle. The marquee.</div>
        <More c={T.chalk} deep="Aug 28 is the weight where last cut looked its best — except arriving with ~4–5 lb more muscle, lifts climbing instead of stalled, and zero panic adjustments on the books. Same scale number, different physique: the entire thesis compressed into one checkpoint."
          forYou={(() => { const cr = currentRate(s); const proj = +(s.trend - cr.scale * (daysUntil(CROSSOVER) / 7)).toFixed(1); return `${daysUntil(CROSSOVER)} days out. At your measured rate the trend projects ~${proj} by then vs the ~158.5 mark — ${proj <= 159.5 ? "on script." : "close; Ease 2 firing changes the slope by design, and the cone in HIST carries the honest range."}`; })()} />
      </Card>)}

      {density === "focus" && (
        <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, textAlign: "center", letterSpacing: "0.08em" }}>FOCUS MODE · recovery, unlocks, crossover live under FULL — nothing is gone</div>
      )}

      {dl.cal != null && !dayEdit ? (
        <Card style={{ padding: 12 }} accent={T.jade}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: mono, fontSize: 11.5, color: T.jade }}>✓ day closed · {Math.round(dl.cal)} cal · {Math.round(dl.pro)} pro · {dl.steps != null ? (dl.steps / 1000).toFixed(1) + "k" : "—"}</span>
            <button onClick={() => setDayEdit(true)} style={{ fontFamily: mono, fontSize: 9, color: T.dim, background: "none", border: "none" }}>edit</button>
          </div>
        </Card>
      ) : (
      <Card>
        <Eyebrow>TODAY'S NUMBERS · TARGETS FOLLOW THE PHASE</Eyebrow>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {[
            { l: `CAL ${calT[0]}–${calT[1]}`, v: cal, set: setCal },
            { l: `PRO — ${PROTEIN} is THE number`, v: pro, set: setPro },
            { l: `STEPS ${ph.steps}`, v: stp, set: setStp },
          ].map((f, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.1em", marginBottom: 4, textTransform: "uppercase" }}>{f.l}</div>
              <input inputMode="decimal" value={f.v} onChange={(e) => f.set(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 15, padding: "8px 8px", outline: "none" }} />
            </div>
          ))}
        </div>
        {s.fixWindow && (
          <div style={{ marginTop: 10, fontFamily: mono, fontSize: 11, color: T.brass }}><Term k="fixwindow" c={T.brass}>FIX WINDOW OPEN</Term> — a miss fixed inside 24 h extends the standard. No resets here.</div>
        )}
        <div style={{ marginTop: 10 }}><Btn tone="jade" full onClick={() => { saveDaily(); setDayEdit(false); }}>Log today</Btn></div>
        <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 8 }}>{`spread: ~4 feeds × ~${Math.round(PROTEIN / 4)} g · every 3–4 h · wake / pre-lift / post-lift / pre-bed`}</div>
        <More deep="175 is THE number — proximity, not a floor to beat; chronic overshoot is drift too. Calories live in a band, not a point. A protein miss opens a 24-hour fix window, and closing it EXTENDS the standard instead of resetting it — recovery speed is the metric, never an unbroken chain."
          forYou={s.fixWindow ? "The fix window is OPEN — hitting 175 today closes it and the record extends." : "Standard intact. Log once, done — the app rewards the logging, never the checking."} />
      </Card>
      )}

      {ev && (
        <Card accent={T.chalk}>
          <Eyebrow>EVENT MODE · {fmtShort(ev.d)}</Eyebrow>
          <H size={19}>{ev.t}</H>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 4 }}>{ev.protocol}. Zero-comp streak rides at <span style={{ color: T.chalk, fontFamily: mono }}>{s.zeroComp.count}</span> — compensation does not exist in this app.</div>
          {daysUntil(ev.d) <= 0 && (
            <div style={{ marginTop: 10 }}>
              <Btn full onClick={() => {
                const ns = JSON.parse(JSON.stringify(s));
                ns.events.find((x) => x.id === ev.id).estimated = true;
                ns.zeroComp = { count: ns.zeroComp.count + 1, last: `${ev.t} · ${fmtShort(ev.d)}` };
                ns.feed.unshift({ d: tISO, t: `ZERO-COMP EVENT #${ns.zeroComp.count}`, how: `${ev.t} — estimated once, after · targets unchanged tomorrow · no penance` });
                setS(ns); save(ns);
              }}>Estimated once, after — close it out</Btn>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function LogTab({ s, setS, save, slp }) {
  const tISO = isoOf(todayStart());
  const nextISO = nextTrainingISO(s);
  const [dateSel, setDateSel] = useState(dayType(tISO) === "U" || dayType(tISO) === "L" ? tISO : nextISO);
  const sess = dateSel ? genSession(s, dateSel, slp) : null;
  const logged = dateSel && s.sessionLog[dateSel];
  const [reps, setReps] = useState({});
  const [rir, setRir] = useState({});
  const [note, setNote] = useState("");
  const [nig, setNig] = useState([]);
  const [reorder, setReorder] = useState(false);
  const [showSetup, setShowSetup] = useState({});
  const [recap, setRecap] = useState(null);
  const [boosted, setBoosted] = useState(false);
  const trueShort = slp.last && slp.last.h < 4.5;
  const hackPending = s.queue.some((q) => q.id === "q_hack3" && !q.done);

  const options = [];
  for (let i = 0; i <= 6 && options.length < 2; i++) {
    const d = isoOf(new Date(todayStart().getTime() + i * DAY));
    const t2 = dayType(d);
    if (t2 === "U" || t2 === "L") options.push(d);
  }

  if (!sess) return (
    <Card><Eyebrow>{dayType(tISO) === "REFEED" ? "REST + REFEED TODAY" : "REST DAY"}</Eyebrow>
      <div style={{ fontFamily: body, color: T.steel, fontSize: 13, marginTop: 6 }}>Next session {nextISO ? fmtShort(nextISO) : "—"} — targets will be waiting, generated from your last logs.</div></Card>
  );

  const getReps = (ex) => reps[ex.id] ?? ex.tgt.slice();
  const setRep = (ex, i, v) => setReps({ ...reps, [ex.id]: getReps(ex).map((r, j) => (j === i ? v : r)) });

  const complete = () => {
    const entries = sess.ex.map((ex) => ({ id: ex.id, n: ex.n, w: ex.w, tgt: ex.tgt, reps: getReps(ex), isDebutNow: ex.isDebutNow, rir: rir[ex.id] ?? null }));
    const { s: ns, lines } = completeSession(s, dateSel, entries, slp, { note: note.trim(), niggles: nig });
    setS(ns); save(ns); setRecap(lines); setBoosted(false); setReps({}); setRir({}); setNote(""); setNig([]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((d) => (
          <button key={d} onClick={() => { setDateSel(d); setReps({}); setRir({}); setNote(""); setNig([]); }} style={{ flex: 1, fontFamily: mono, fontSize: 11.5, letterSpacing: "0.06em", padding: "9px 0", borderRadius: 7, border: `1px solid ${dateSel === d ? T.chalk : T.line}`, background: dateSel === d ? T.plate2 : "transparent", color: dateSel === d ? T.chalk : T.steel }}>
            {fmtShort(d)} · {dayType(d) === "U" ? "UPPER" : "LOWER"}
          </button>
        ))}
      </div>

      <Card accent={T.orange}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <Eyebrow c={T.orange}>STRUCTURAL BUDGET · 1 OF 1 — AUTO-PICKED</Eyebrow>
            <H size={22}>{sess.structural}</H>
          </div>
          <button onClick={() => setReorder(!reorder)} style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.1em", color: reorder ? T.chalk : T.steel, background: reorder ? T.plate2 : "none", border: `1px solid ${reorder ? T.chalk : T.line}`, borderRadius: 6, padding: "6px 9px", whiteSpace: "nowrap" }}>{reorder ? "DONE" : "REORDER"}</button>
        </div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: T.dim, marginTop: 4 }}>Everything else is rep progression — unlimited. New earns queue themselves for future slots.</div>
        <More c={T.orange} deep="One structural change per session keeps the signal clean — when something moves, you know exactly what caused the response. Rep progression stays unlimited because it's the noise-free kind of change. The scheduler auto-picks from the queue in order; doc-approved riders are the only exception."
          forYou={(() => { const cand = s.queue.filter((q) => !q.done && q.kind === "debut" && q.exId && exById(s, q.exId) && exById(s, q.exId).day === dayType(dateSel)); return cand.length > 1 ? `Waiting behind today's slot: ${cand.slice(1).map((q) => q.t).join(" · ")} — each gets its own session.` : cand.length === 1 ? "The queue empties after this one — new earns will refill it as you log." : "Nothing structural queued for this day type — pure rep-progression day, which is where most muscle actually gets built."; })()} />
      </Card>

      {dayType(dateSel) === "L" && hackPending && (
        <Card accent={trueShort ? T.brass : T.jade}>
          <Eyebrow c={trueShort ? T.brass : T.jade}>HACK DEBUT GATE</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 4 }}>
            {trueShort ? `Last night read ${slp.last.h} h — a true <4.5 h night. The lock releases: deferral #3 is legitimate.` : `Locked in. Last night ${slp.last ? slp.last.h : "—"} h — it runs regardless.`}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Chip c={slp.clean ? T.jade : T.brass}>{slp.clean ? "SLEEP CLEAN — earns & owns count today" : `SLEEP DEBT ${slp.run}/${slp.need} — PRs log provisional`}</Chip>
        <Chip>NOON WINDOW — peak stim · read RIR conservative</Chip>
      </div>

      {sess.ex.map((ex) => (
        <Card key={ex.id} style={{ padding: 12 }} accent={ex.isDebutNow ? T.orange : undefined}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 17, textTransform: "uppercase", color: T.chalk }}>{ex.n}</div>
            {reorder ? (
              <div style={{ display: "flex", gap: 6 }}>
                {[["▲", -1], ["▼", 1]].map(([g, dir]) => (
                  <button key={g} onClick={() => {
                    const ns = JSON.parse(JSON.stringify(s));
                    const arr = ns.exOrder[dayType(dateSel)];
                    const i = arr.indexOf(ex.id), j = i + dir;
                    if (i < 0 || j < 0 || j >= arr.length) return;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    setS(ns); save(ns);
                  }} style={{ width: 34, height: 28, borderRadius: 6, border: `1px solid ${T.line}`, background: T.plate2, color: T.chalk, fontFamily: mono, fontSize: 12 }}>{g}</button>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: mono, fontSize: 12, color: T.steel }}>{ex.w} · tgt {ex.tgt.join(",")}</div>
            )}
          </div>
          {ex.prev && (
            <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 3 }}>
              PREV ▸ {fmtShort(ex.prev.d)} · {ex.prev.w} × {ex.prev.reps.join(",")}
              {ex.prev.rir != null && <span> · RIR {ex.prev.rir}</span>}
              {ex.prev.debt && <span style={{ color: T.brass }}> · <Term k="debt" c={T.brass}>on debt</Term></span>}
            </div>
          )}
          {ex.note && <div style={{ fontFamily: mono, fontSize: 10, color: ex.isDebutNow || (ex.note || "").startsWith("OWN") ? T.orange : T.dim, marginTop: 3, letterSpacing: "0.04em" }}>{ex.note}</div>}
          {ex.setup && (
            <div style={{ marginTop: 7 }}>
              <button onClick={() => setShowSetup({ ...showSetup, [ex.id]: !showSetup[ex.id] })}
                style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.12em", color: showSetup[ex.id] ? T.chalk : T.dim, background: "none", border: "none", padding: 0 }}>
                {showSetup[ex.id] ? "▾ SETUP + CUES" : "▸ SETUP + CUES"}
              </button>
              {showSetup[ex.id] && ex.setup.split("\n").map((l, i) => (
                <div key={i} style={{ fontFamily: mono, fontSize: 10, color: i === 0 ? T.chalk : T.steel, marginTop: i === 0 ? 6 : 4, lineHeight: 1.55 }}>{l}</div>
              ))}
              {showSetup[ex.id] && ex.live && (
                <div style={{ fontFamily: mono, fontSize: 10, color: ex.isDebutNow ? T.orange : T.jade, marginTop: 5, lineHeight: 1.55 }}>NOW ▸ {ex.live}</div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            {getReps(ex).map((r, i) => (
              <div key={i}>
                <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginBottom: 3 }}>SET {i + 1}</div>
                <Stepper v={r} set={(v) => setRep(ex, i, v)} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
            <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.1em" }}>OPENER <Term k="rir" c={T.dim}>RIR</Term></span>
            {[0, 1, 2, 3].map((v) => {
              const on = rir[ex.id] === v;
              const c = v === 0 ? T.brass : T.jade;
              return (
                <button key={v} onClick={() => setRir({ ...rir, [ex.id]: on ? null : v })}
                  style={{ width: 34, height: 26, borderRadius: 6, border: `1px solid ${on ? c : T.line}`, background: on ? T.plate2 : "transparent", color: on ? c : T.steel, fontFamily: mono, fontSize: 11 }}>
                  {v === 3 ? "3+" : v}
                </button>
              );
            })}
            <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>optional · 1 = honest</span>
          </div>
        </Card>
      ))}

      <Card style={{ padding: 12 }}>
        <Eyebrow>SESSION NOTES · OPTIONAL — THE "SET-4 ANOMALY" BOX</Eyebrow>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="anything the numbers missed…"
          style={{ width: "100%", boxSizing: "border-box", marginTop: 8, background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: body, fontSize: 13, padding: 10, outline: "none", resize: "vertical" }} />
        <div style={{ marginTop: 12 }}>
          <Eyebrow>JOINT CHECK · TAP ONLY IF SOMETHING TALKED</Eyebrow>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
            {["shoulder", "elbow", "wrist", "hip", "knee", "low back"].map((j) => {
              const on = nig.includes(j);
              return (
                <button key={j} onClick={() => setNig(on ? nig.filter((x) => x !== j) : [...nig, j])}
                  style={{ fontFamily: mono, fontSize: 10.5, padding: "6px 10px", borderRadius: 999, border: `1px solid ${on ? T.brass : T.line}`, background: on ? T.plate2 : "transparent", color: on ? T.brass : T.steel }}>
                  {j}
                </button>
              );
            })}
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 8 }}>3 flags on one joint in 3 weeks → it surfaces on NOW. Nothing auto-changes.</div>
        </div>
      </Card>

      {logged ? (
        <div style={{ fontFamily: mono, fontSize: 11, color: T.jade, textAlign: "center", padding: 6 }}>SESSION BANKED — next targets already regenerated.</div>
      ) : (
        <Btn tone="orange" full onClick={complete}>Complete session — what moved?</Btn>
      )}

      {recap && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,10,13,0.9)", display: "flex", alignItems: "flex-end", zIndex: 60 }} onClick={() => setRecap(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.plate, borderTop: `3px solid ${T.jade}`, borderRadius: "14px 14px 0 0", padding: 18, width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
            <Eyebrow c={T.jade}>WHAT MOVED · {fmtShort(dateSel)}</Eyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {recap.length ? recap.map((l, i) => (
                <div key={i}>
                  <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 19, textTransform: "uppercase", color: T.chalk }}>{l.t}</div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: T.steel, marginTop: 2 }}>{l.how}</div>
                </div>
              )) : (
                <div style={{ fontFamily: body, fontSize: 13, color: T.steel }}>Nothing flipped state — reps banked, standards held, tomorrow's targets regenerated. Normal days build the crossover.</div>
              )}
            </div>
            <div style={{ marginTop: 18, borderTop: `1px solid ${T.line}`, paddingTop: 14 }}>
              <Eyebrow>THE OTHER REWARD — SHARPER THAN BEFORE THE SESSION?</Eyebrow>
              <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 4 }}>Training is the strongest non-Rx lever on your executive function today.</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Btn small tone={boosted ? "jade" : "ghost"} onClick={() => { if (!boosted) { const ns = { ...s, boosts: s.boosts + 1 }; setS(ns); save(ns); setBoosted(true); } }}>{boosted ? `Felt it · ${s.boosts}` : "Yes — felt it"}</Btn>
                <Btn small onClick={() => setRecap(null)}>Done</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QueueTab({ s, slp }) {
  const nextOfType = (t2) => { for (let i = 0; i <= 7; i++) { const d = isoOf(new Date(todayStart().getTime() + i * DAY)); if (dayType(d) === t2) return d; } return null; };
  const live = s.queue.filter((x) => !x.done);
  const flipped = s.queue.filter((x) => x.done);
  const curl = exById(s, "curl");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Eyebrow>THE LIVE QUEUE · REFILLS ITSELF AS GATES RESOLVE</Eyebrow>
      <Card style={{ padding: 11 }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: T.steel, letterSpacing: "0.05em", lineHeight: 2 }}>
          <Term k="gated" c={T.dim}>GATED</Term> → <Term k="earned" c={T.jade}>EARNED</Term> → <Term k="debut" c={T.orange}>DEBUT</Term> → <Term k="own" c={T.jade}>OWNED</Term>
          <span style={{ color: T.dim }}>  ·  side doors: </span><Term k="reclaim" c={T.brass}>RECLAIM</Term> · <Term k="parked" c={T.dim}>PARKED</Term>
          <span style={{ color: T.dim }}>  — tap any word</span>
        </div>
      </Card>
      {live.map((u) => (
        <Card key={u.id}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 17, textTransform: "uppercase", color: T.chalk }}>{u.t}</div>
            <Stamp st={u.state} />
          </div>
          <div style={{ fontFamily: mono, fontSize: 11, color: T.steel, marginTop: 6 }}>{u.gate}</div>
          {u.rule && <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, marginTop: 3 }}>{u.rule}</div>}
          {u.kind === "ladder" && curl && curl.ladder && (
            <div style={{ marginTop: 8 }}>
              <Bar pct={((curl.last ? curl.last[curl.ladder.set] : 8) / curl.ladder.top) * 100} c={T.brass} />
              <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 4 }}>set 2 · {curl.last ? curl.last[curl.ladder.set] : 8} of {curl.ladder.top}</div>
            </div>
          )}
          <More c={T.brass}
            deep={({
              debut: "EARNED → DEBUT: this load was bought with reps at the top of the window on a sleep-clean day. It runs when it wins its day's single structural slot — one change per session keeps the response readable.",
              unlock: "EARNED → DEBUT: bought at the top of the window on a clean day; it runs when it wins the day's single structural slot.",
              own: "One hit isn't ownership — the standard has to repeat on a sleep-clean day before anything loads. A debt-day hit logs as provisional: real, but not spendable.",
              reclaim: "The standard slipped, so the exact rep line has to be re-earned before the increment unlocks. Records here can fall and be won back — that's what makes the ledger honest.",
              ladder: "A rep ladder on the money set: top out the rung and the next gate opens. Load moves on this lift stay coach-flag.",
              phase: "Fires from the live body-fat estimate, not the calendar. Applying it swaps every daily target at once — one tap, whole new phase.",
              info: "Parked with a named trigger, so the condition decides instead of memory. Parked isn't forgotten; it's staged.",
            })[u.kind] || "A gate with a named condition — it resolves itself the moment the condition is met, and the queue refills as you log."}
            forYou={(() => {
              const ex = u.exId ? exById(s, u.exId) : null;
              const nd = ex ? nextOfType(ex.day) : null;
              if (u.kind === "own" && ex && nd) return `Next attempt ${fmtShort(nd)} — needs sleep CLEAN, currently ${slp.run}/${slp.need}${slp.clean ? " ✓ it counts" : ""}.`;
              if ((u.kind === "debut" || u.kind === "unlock") && ex && nd) { const mn = pickStructural(s, nd, slp).main; return mn && mn.id === u.id ? `Holds the structural slot for ${fmtShort(nd)} — it runs.` : `Waits behind ${mn ? mn.t : "the current pick"} — one structural change per session, each earns its own day.`; }
              if (u.kind === "reclaim" && ex && ex.reclaim && nd) return `The exact line: ${ex.reclaim.join(",")} — next chance ${fmtShort(nd)}.`;
              if (u.kind === "ladder" && curl && curl.ladder) return `Set ${curl.ladder.set + 1} sits at ${curl.last ? curl.last[curl.ladder.set] : "?"} of ${curl.ladder.top} — every session is a climb attempt.`;
              if (u.kind === "phase") return `Est BF ${bfEst(s).pct}% now; arms at ≤13.2% — the cone in HIST carries the honest timing.`;
              return "Resolves on its own the moment its condition is met — the queue never needs your memory.";
            })()} />
        </Card>
      ))}

      {flipped.length > 0 && (
        <>
          <Eyebrow c={T.jade}>FLIPPED</Eyebrow>
          {flipped.map((u) => (
            <Card key={u.id} accent={T.jade}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 16, textTransform: "uppercase", color: T.chalk }}>{u.t}</div>
                <Stamp st={u.state} />
              </div>
              <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 4 }}>{u.gate}</div>
            </Card>
          ))}
        </>
      )}

      <Eyebrow>EARNED · THE DATED FEED — HOW IT WAS WON</Eyebrow>
      <Card style={{ padding: 0 }}>
        {s.feed.slice(0, 40).map((f, i) => (
          <div key={i} style={{ padding: "12px 14px", borderBottom: i < Math.min(s.feed.length, 40) - 1 ? `1px solid ${T.line}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 15.5, textTransform: "uppercase", color: T.chalk }}>{f.t}</div>
              <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, whiteSpace: "nowrap" }}>{fmtShort(f.d)}</div>
            </div>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 3 }}>{f.how}</div>
          </div>
        ))}
      </Card>

      <Card>
        <Eyebrow>STANDING GAINS · ALL WHILE CUTTING</Eyebrow>
        <div style={{ fontFamily: mono, fontSize: 11, color: T.steel, marginTop: 6, lineHeight: 1.7 }}>{s.standing}</div>
      </Card>

      <Card>
        <Eyebrow>PROCESS STANDARDS</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8, fontFamily: mono, fontSize: 11, color: T.steel }}>
          <div><span style={{ color: T.jade }}>ZERO-COMP × {s.zeroComp.count}</span> — no penance cuts, no penance cardio, ever ({s.zeroComp.last})</div>
          <div><span style={{ color: T.chalk }}>PROTEIN {s.proteinDays}</span> — recovery speed is the metric, not an unbroken chain</div>
          <div><span style={{ color: T.chalk }}>POST-SESSION BOOSTS × {s.boosts}</span> — the felt executive-function return, logged</div>
        </div>
      </Card>
    </div>
  );
}

function BodyTab({ s, setS, save }) {
  const tISO = isoOf(todayStart());
  const sealed = blackoutOn(s);
  const [dexaIn, setDexaIn] = useState("");
  const wd = weekDay();
  const xPct = Math.round(((todayStart() - mk(START)) / (mk(CROSSOVER) - mk(START))) * 100);
  const bf = bfEst(s);
  const cur = currentRate(s);
  const eta12 = etaWeeks(s, 12), eta11 = etaWeeks(s, 11);
  const canThesis = wd.wk > s.lastThesisWk;
  const mirrorEra = wd.wk >= 10;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sealed && (
        <Card accent={T.chalk}>
          <Eyebrow c={T.chalk}>SCALE SEALED · {s.blackout.reason}</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 4 }}>
            First clean read in <span style={{ fontFamily: mono, color: T.chalk }}>{daysUntil(SEAL_UNTIL)}d</span>. The seal is protective — checking more won't make it move faster.
          </div>
        </Card>
      )}
      {mirrorEra && (
        <Card accent={T.brass}>
          <Eyebrow c={T.brass}>WK {wd.wk} — MIRROR ERA</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 4 }}>From wk 10 your rule stands: mirror & measurements outrank this scale. Weekly photos, same light, same time.</div>
        </Card>
      )}

      <Card>
        <Eyebrow><Term k="trend" c={T.dim}>TREND</Term> — THE HERO NUMBER</Eyebrow>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
          <Num size={40} c={T.jade}>{s.trend}</Num>
          <span style={{ fontFamily: mono, fontSize: 11, color: T.dim }}>daily reads render small & grey — by design</span>
        </div>
        <div style={{ marginTop: 8 }}><Spark reads={s.reads} trend={s.trend} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
          {s.reads.slice(-4).reverse().map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 10.5, color: r.sealed ? T.dim : T.steel }}>
              <span>{fmtShort(r.d)} · {r.w}</span><span>{r.note}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 10 }}>weigh-in lives on NOW · mornings, once a day</div>
        <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 6 }}>PROTOCOL: fasted · post-void · pre-food/water · 16 oz water ≈ +0.5–1 lb</div>
        <More deep="The trend is a damped average: each clean read moves it 30% of the way toward the morning's number, spikes clamp at ±1.5 lb so one dinner can't lie to it, sealed reads never touch it, and moves inside your measured ±0.8 noise floor get auto-stamped 'not information'. Daily reads render small and grey on purpose — the trend is the instrument; mornings are static."
          forYou={sealed ? `First clean read ${fmtShort(SEAL_UNTIL)}: judge it against the trend (${s.trend}), not against ${(s.reads.filter((r) => !r.sealed).slice(-1)[0] || {}).w ?? s.trend} — residual event water is expected and already forgiven by the math.` : `Trend ${s.trend}. Whatever tomorrow's scale screams, it moves this number by ±0.45 at most.`} />
      </Card>

      <Card>
        {(() => {
          const wk = weekDay().wk;
          const lastP = s.photos[s.photos.length - 1];
          const due = !lastP || Math.round((mk(tISO) - mk(lastP.d)) / DAY) >= 7;
          return (
            <>
              <Eyebrow c={wk >= 10 ? T.brass : T.dim}>{wk >= 10 ? "PHOTOS · MIRROR ERA — OUTRANKS THE SCALE" : "PHOTOS · WEEKLY — HABIT NOW, ERA STARTS WK 10"}</Eyebrow>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {["same light", "same spot", "fasted AM", "front / side / back", "relaxed + flexed"].map((c2, i) => (<Chip key={i}>{c2}</Chip>))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontFamily: mono, fontSize: 9.5, color: T.dim }}>
                <span>{due ? "due — the mark button is on NOW" : `done — next ${fmtShort(isoOf(new Date(mk(lastP.d).getTime() + 7 * DAY)))}`}</span>
                {s.photos.length > 0 && <span style={{ color: T.jade }}>×{s.photos.length}</span>}
              </div>
              <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 6 }}>Images live in your camera roll — make an album called PREP and compare there. The app tracks the habit, never the pictures.</div>
            </>
          );
        })()}
      </Card>

      <Card>
        <Eyebrow>BODY FAT — LIVE MODEL · ANCHORED TO {s.model.src.toUpperCase()}</Eyebrow>
        <div style={{ display: "flex", gap: 18, marginTop: 8, alignItems: "baseline" }}>
          <div><Num size={26}>{bf.pct}%</Num><div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim }}>EST NOW {s.model.err} · LEAN ~{bf.lean}</div></div>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel }}>drip +{s.model.drip}/wk (muscle memory)<br />DEXA would read {s.dexaPred}</div>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <input inputMode="decimal" placeholder="DEXA %" value={dexaIn} onChange={(e) => setDexaIn(e.target.value)}
            style={{ width: 90, background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 13, padding: "8px" }} />
          <Btn small onClick={() => { const p = Number(dexaIn); if (p > 5 && p < 30) { const ns = anchorDexa(s, p); setS(ns); save(ns); setDexaIn(""); } }}>Anchor model to DEXA</Btn>
        </div>
        <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 6 }}>One measured number recalibrates every estimate and ETA below.</div>
        <More deep="A lean-mass model, not a formula: anchored lean weight plus the muscle-memory drip (+0.3/wk), so BF% = (trend − lean) ÷ trend. It falls as the trend falls and rises as muscle returns. The eye and DEXA disagree by method (~1.5 points) — both are shown until a real scan replaces estimation with measurement."
          forYou={s.model.src === "DEXA" ? `Anchored to your DEXA — lean ≈ ${bf.lean} lb and the drip carries it forward. A post-pivot re-scan re-trues the build phase.` : `Lean mass ≈ ${bf.lean} lb today and drifting up weekly — that number rising while the trend falls IS the recomp, in two digits. One DEXA input re-anchors everything; book any clean morning ≥2 days clear of a refeed or event.`} />
      </Card>

      <Card>
        <Eyebrow>WAIST · WEEKLY — THE SIGNAL THE SCALE CAN'T FAKE</Eyebrow>
        {(() => {
          const lastW = s.waist[s.waist.length - 1];
          const due = !lastW || Math.round((mk(tISO) - mk(lastW.d)) / DAY) >= 7;
          return (
            <>
              {s.waist.length > 0 && (
                <div style={{ display: "flex", gap: 14, marginTop: 8, fontFamily: mono, fontSize: 10.5, color: T.steel, flexWrap: "wrap" }}>
                  {s.waist.slice(-4).map((x, i) => (<span key={i}>{fmtShort(x.d)} · <span style={{ color: T.chalk }}>{x.v}"</span></span>))}
                  {s.waist.length >= 2 && (
                    <span style={{ color: T.jade }}>Δ −{(s.waist[0].v - lastW.v).toFixed(1)}" total</span>
                  )}
                </div>
              )}
              <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 10 }}>{due ? "due now — the card is waiting on NOW" : `logged — next due ${fmtShort(isoOf(new Date(mk(lastW.d).getTime() + 7 * DAY)))} · logs on NOW`}</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 6 }}>PROTOCOL: fasted · post-void · at navel · relaxed tape · weekly</div>
            </>
          );
        })()}
      </Card>

      <Card>
        <Eyebrow>RATE OF LOSS · PHASE-AWARE</Eyebrow>
        <div style={{ marginTop: 10 }}><RateGauge rate={s.rate} cur={cur} /></div>
        <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, marginTop: 8 }}>Rules run themselves: floor and redline arm one-tap adjustments on the NOW screen when trend data trips them.</div>
        <More deep="The green band (1.0–1.4/wk) is the muscle-safe corridor for this phase. Floor rule: two weeks under 0.8 → restore steps FIRST, then trim calories. Redline: ≥1.9 → add ~100 back and coach-flag, because speed there is muscle risk, not a win. Sealed windows mute both rules so event noise can never fire them."
          forYou={sealed ? `Rules muted while sealed (clean read ${fmtShort(SEAL_UNTIL)}) — your sheet's 7/21 REDLINE gap-artifact is exactly what this muting exists to prevent.` : cur.measured ? `Measured ~${cur.fat}/wk fat-equivalent right now — ${cur.fat >= 1.0 && cur.fat <= 1.4 ? "inside the corridor; nothing to do." : cur.fat < 1.0 ? "under the corridor; the floor rule is the nearest tripwire." : "hot; the redline is the nearest tripwire."}` : "Two clean weekly snapshots and this goes fully measured."} />
      </Card>

      <Card>
        <Eyebrow>MAINTENANCE LEDGER · LIVE</Eyebrow>
        {(() => {
          const obs = observedTDEE(s);
          return obs ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <Num size={26} c={T.jade}>~{obs.tdee}</Num>
                <span style={{ fontFamily: mono, fontSize: 10, color: T.dim }}>±150 · OBSERVED — {obs.days} logged days, avg intake {obs.avg}, your measured rate + the muscle-drip correction</span>
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: T.steel, marginTop: 8 }}>Recalculates as you log — first estimates run hot off the whoosh week, then converge. Falls as you shrink (~10 kcal/lb). The reverse in September aims at THIS number, not June's.</div>
            </div>
          ) : (
            <div style={{ fontFamily: mono, fontSize: 11, color: T.steel, marginTop: 8 }}>
              Observed maintenance prints when the seal lifts — computed from your logged intake and measured rate, then live for the rest of prep.
            </div>
          );
        })()}
        <div style={{ display: "flex", gap: 20, marginTop: 12, opacity: 0.75 }}>
          {s.maintenance.map((m, i) => (
            <div key={i}><Num size={16} c={T.steel}>{m.cal}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim, textTransform: "uppercase" }}>{m.label} · JUNE ANCHOR</div></div>
          ))}
        </div>
        <More deep="Observed TDEE = your average logged intake + the daily energy your measured loss represents (fat at 3,500 kcal/lb, minus what the muscle drip stores). No textbook formulas — arithmetic from your own ledger, recomputed over a rolling 3 weeks, sliding down ~10 kcal for every pound you lose."
          forYou={(() => { const obs = observedTDEE(s); return obs ? `~${obs.tdee} is what the September reverse aims at — eat to it fast, then build the surplus above it. Landing on today's truth instead of June's is the whole anti-overshoot plan.` : "Prints Monday when the seal lifts. Every day you log between now and the pivot sharpens the number the entire reverse will be built on."; })()} />
      </Card>

      <Card>
        <Eyebrow>ROAD · LIVE ETAS OFF YOUR ACTUAL RATE</Eyebrow>
        <div style={{ margin: "10px 0 4px" }}><Bar pct={xPct} c={T.chalk} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10, fontFamily: mono, fontSize: 11, color: T.steel }}>
          <div>12% est → <span style={{ color: T.chalk }}>{eta12 == null ? "—" : eta12 === 0 ? "now" : `~${eta12} wk (${fmtShort(isoOf(new Date(todayStart().getTime() + eta12 * 7 * DAY)))})`}</span></div>
          <div>Pivot band (~11%) → <span style={{ color: T.chalk }}>{eta11 == null ? "—" : `~${eta11} wk (${fmtShort(isoOf(new Date(todayStart().getTime() + eta11 * 7 * DAY)))})`}</span> · coach's eye decides</div>
          <div style={{ color: T.dim }}>{cur.measured ? "ETAs from your measured trend + drip model" : "ETAs on prior rates until 2 clean weeks exist — they self-correct as reads land"}</div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 9.5, color: T.brass, marginTop: 8 }}>Weeks 8–13 = visual acceleration: each BF point worth 2–3× the visible change.</div>
        <More c={T.brass} deep="Straight-line ETAs from your measured rate plus the drip — useful for direction, honest about nothing else; the cone in HIST is the version with uncertainty attached. The acceleration note is subcutaneous math: below ~13%, the same pound of fat comes off a smaller, leaner surface, so each BF point shows 2–3× the visible change of earlier points."
          forYou={wd.wk < 8 ? `Week ${wd.wk} now — the acceleration window opens wk 8 (~${fmtShort(isoOf(new Date(mk(START).getTime() + 49 * DAY)))}), the mirror outranks the scale from wk 10, and the pivot ETA above is the straight line the cone bends around. The boring middle is almost over.` : wd.wk < 10 ? `Week ${wd.wk} — you are IN the acceleration window: each BF point now shows 2–3× the visual change. Mirror takes over at wk 10; the pivot ETA above is the straight line the cone bends around.` : `Week ${wd.wk} — mirror era. Photos and waist outrank everything on this card; the ETAs are background math now.`} />
      </Card>

      <Card>
        <Eyebrow>THE THESIS · VS LAST CUT</Eyebrow>
        <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 6, lineHeight: 1.55 }}>
          Last cut: 1,400–1,600 · 140 g · hours of incline · stalled lifts → muscle LOSS, flat at 163.<br />
          This cut: same fat rate with muscle RISING, lifts progressing, zero panic adjustments. Same weight ⇒ visibly better.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <Chip c={T.jade}>Fuller-not-flatter · ×{s.thesisConfirms}</Chip>
          <Btn small disabled={!canThesis} onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.thesisConfirms++; ns.lastThesisWk = wd.wk; ns.feed.unshift({ d: tISO, t: `THESIS CONFIRMED · WK ${wd.wk}`, how: "fuller, not flatter — the identity claim holds another week" }); setS(ns); save(ns); }}>{canThesis ? `Confirm wk ${wd.wk}` : "Weekly — done"}</Btn>
        </div>
      </Card>
    </div>
  );
}

function SleepTab({ s, setS, save, slp }) {
  const nights = s.sleep.nights.slice(-8);
  const maxH = 9;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card accent={slp.clean ? T.jade : T.brass}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Eyebrow>THE MASTER VARIABLE</Eyebrow>
            <H size={24} c={slp.clean ? T.jade : T.brass}>{slp.clean ? <Term k="clean" c={T.jade}>CLEAN</Term> : <span>RESET {slp.run} / {slp.need}</span>}</H>
          </div>
          <div style={{ textAlign: "right", fontFamily: mono, fontSize: 10.5, color: T.steel }}>target 7.5–8 h<br />clean night = ≥7.5</div>
        </div>
        <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 8 }}>
          {slp.clean ? "Own-it attempts count. Earns bank. Reward circuitry back online." : `${slp.need - slp.run} more clean night${slp.need - slp.run === 1 ? "" : "s"} → clean. Debt downregulates dopamine receptors — it costs focus, drive, and honest RIR, not just recovery.`}
        </div>
        <More c={slp.clean ? T.jade : T.brass}
          deep="Three consecutive ≥7.5 h nights = CLEAN, because one good night repays acute debt but consolidation and hormone normalization lag ~2–3 nights behind. Debt also downregulates dopamine D2/D3 receptor availability — the same circuitry ADHD already taxes — which is why it costs drive, focus, and honest RIR before it ever costs recovery. Owns and earns require CLEAN because PRs bought on debt don't repeat, and the ledger only banks what repeats."
          forYou={slp.clean ? "CLEAN — everything counts today. This is simultaneously your best muscle-retention lever and your sharpest ADHD lever; protect the streak like a PR." : `${slp.need - slp.run} clean night${slp.need - slp.run === 1 ? "" : "s"} from CLEAN. Tonight ≥7.5 ${slp.run + 1 >= slp.need ? "flips it — tomorrow's attempts count for keeps." : "keeps the reset alive."} Fixed wake time is the strongest single move.`} />
      </Card>

      <Card>
        <Eyebrow>LAST 8 NIGHTS</Eyebrow>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 92, marginTop: 12 }}>
          {nights.map((n, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>{n.h}</div>
              <div style={{ width: "100%", height: `${(n.h / maxH) * 68}px`, background: n.h >= s.sleep.cleanH ? T.jade : n.h < 5 ? T.brass : T.dim, borderRadius: 3, opacity: n.h >= s.sleep.cleanH ? 1 : 0.8 }} />
              <div style={{ fontFamily: mono, fontSize: 7.5, color: T.dim }}>{mk(n.d).getMonth() + 1}/{mk(n.d).getDate()}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, textAlign: "center", padding: "2px 0" }}>logging lives on NOW · this tab is the ledger</div>

      <Card>
        <Eyebrow c={T.brass}>WHAT THE DEBT COST — ATTRIBUTED, NOT BLAMED</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {debtLedger(s).map((d, i) => (
            <div key={i} style={{ fontFamily: mono, fontSize: 11, color: d.live ? T.chalk : T.steel }}>· {d.txt}</div>
          ))}
        </div>
        {!debtLedger(s).some((d) => d.live) && (
          <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 6 }}>live audit armed — any in-app session on a debt day gets charged here automatically</div>
        )}
        <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 8 }}>Down sessions on debt read as context, not regression.</div>
        <More c={T.brass}
          deep="Debt costs output before it costs recovery — motor drive and honest RIR fade first, and it shows up as missing tail reps. The audit method: every in-app session logged on a non-clean day is compared to your nearest prior CLEAN session of the same lift at the same set count, and only losses get written. One honest caveat: if the load changed between the two sessions, an entry can muddy — the recap context usually settles it. Attribution, not blame: the grey lines are the sheet-era receipts; white lines are charges the app computed itself."
          forYou={slp.clean ? "CLEAN — the meter is off. Today's sessions get filed as clean baselines that future debt days will be audited against." : `${slp.need - slp.run} night${slp.need - slp.run === 1 ? "" : "s"} from CLEAN — until then, sessions are audited against their clean twins. Tonight ≥7.5 h ${slp.run + 1 >= slp.need ? "stops the meter entirely." : "keeps the reset alive."}`} />
      </Card>

      <Card>
        <Eyebrow>PROTOCOL</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8, fontFamily: mono, fontSize: 10.5, color: T.steel }}>
          <div>· Caffeine cutoff early afternoon · 100 mg &gt; 200 mg on sleep nights</div>
          <div>· Noon lifts = peak stim → RIR conservative, PRs provisional until repeated</div>
          <div>· Dose timing = prescriber territory — this ledger tracks, it does not advise</div>
        </div>
      </Card>
    </div>
  );
}

function HistTab({ s, setS, save }) {
  const [open, setOpen] = useState(null);
  const [labOpen, setLabOpen] = useState(null);
  const liveWks = liveRollups(s);
  const first = ROLLUPS[ROLLUPS.length - 1];
  const latest = (liveWks.find((w) => w.avgW != null || w.avgCal != null)) || ROLLUPS[0];
  const wDelta = first && latest && first.avgW && latest.avgW ? +(first.avgW - latest.avgW).toFixed(1) : null;
  const proHitTot = ROLLUPS.reduce((a, w) => a + w.proHit, 0) + liveWks.reduce((a, w) => a + w.proHit, 0);
  const proNTot = ROLLUPS.reduce((a, w) => a + w.proN, 0) + liveWks.reduce((a, w) => a + w.proN, 0);
  const liveDayCount = liveWks.reduce((a, w) => a + w.rows.length, 0);
  const stat = (v, l) => (
    <div><Num size={19}>{v}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div></div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card accent={T.jade}>
        <Eyebrow>THE RECORD · {HISTORY.length + liveDayCount} DAYS · 6/10 → LIVE</Eyebrow>
        <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 8, lineHeight: 1.6 }}>{weekDigest(s)}</div>
        <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap" }}>
          {stat(wDelta != null ? `−${wDelta}` : "—", "lb · wk-avg vs wk 1")}
          {stat(`${proHitTot}/${proNTot}`, "protein on target")}
          {stat(`${s.zeroComp.count}`, "events · zero comp")}
          {stat(`${latest && latest.avgSteps != null ? latest.avgSteps + "k" : "—"}`, "steps avg · latest wk")}
        </div>
        <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 8 }}>Weight fell while every headline lift rose — the whole thesis, in one screen. Tap a week for the day-by-day.</div>
      </Card>

      <Eyebrow>THE LAB · PATTERNS FOUND IN YOU — TAP ANY CARD FOR THE FULL STORY</Eyebrow>
      {labAnalytics(s).map((a) => (
        <Card key={a.id} style={{ padding: 12, cursor: "pointer" }} accent={a.status === "LIVE" ? T.jade : undefined}>
          <div onClick={() => setLabOpen(labOpen === a.id ? null : a.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
              <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 15.5, textTransform: "uppercase", color: a.status === "LOCKED" ? T.steel : T.chalk }}>{a.t}</div>
              <Stamp st={a.status} />
            </div>
            <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 3 }}>{a.tag}</div>
            {a.lines.map((l, i) => (
              <div key={i} style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 6, lineHeight: 1.55 }}>{l}</div>
            ))}
            {a.status === "ARMED" && a.prog && (
              <div style={{ marginTop: 8 }}>
                <Bar pct={(a.prog.n / a.prog.need) * 100} c={T.brass} />
                <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 4 }}>{a.prog.n} / {a.prog.need} {a.prog.label}</div>
              </div>
            )}
            <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 6, letterSpacing: "0.1em" }}>{labOpen === a.id ? "▾ CLOSE" : "▸ MORE"}</div>
          </div>
          {labOpen === a.id && (
            <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
              <Eyebrow>WHAT IT IS</Eyebrow>
              <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 5, lineHeight: 1.55 }}>{a.deep}</div>
              <div style={{ marginTop: 10 }}>
                <Eyebrow c={a.status === "LIVE" ? T.jade : T.brass}>FOR YOU · RIGHT NOW</Eyebrow>
                <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 5, lineHeight: 1.55 }}>{a.forYou}</div>
              </div>
            </div>
          )}
        </Card>
      ))}

      <Eyebrow>THE SHELF · EVIDENCE ON FILE — GENERAL SCIENCE, YOUR NUMBERS</Eyebrow>
      {shelfItems(s).map((a) => (
        <Card key={a.id} style={{ padding: 12, cursor: "pointer" }}>
          <div onClick={() => setLabOpen(labOpen === a.id ? null : a.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
              <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 15.5, textTransform: "uppercase", color: T.chalk }}>{a.t}</div>
              <Stamp st={a.status} />
            </div>
            <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 3 }}>{a.tag}</div>
            {a.lines.map((l, i) => (
              <div key={i} style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 6, lineHeight: 1.55 }}>{l}</div>
            ))}
            <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 6, letterSpacing: "0.1em" }}>{labOpen === a.id ? "▾ CLOSE" : "▸ MORE"}</div>
          </div>
          {labOpen === a.id && (
            <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
              <Eyebrow>WHAT IT IS</Eyebrow>
              <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 5, lineHeight: 1.55 }}>{a.deep}</div>
              <div style={{ marginTop: 10 }}>
                <Eyebrow c={T.jade}>FOR YOU · RIGHT NOW</Eyebrow>
                <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 5, lineHeight: 1.55 }}>{a.forYou}</div>
              </div>
              {a.action && (
                <div style={{ marginTop: 10 }}>
                  <Btn small tone="jade" onClick={(e) => { e.stopPropagation(); const ns = JSON.parse(JSON.stringify(s)); ns.creatine = { start: isoOf(todayStart()) }; ns.feed.unshift({ d: isoOf(todayStart()), t: "CREATINE STARTED", how: "5 g/day begins inside the sealed window — the water bump files itself under quarantine (Kreider 2017)" }); setS(ns); save(ns); }}>Log creatine start — today</Btn>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}

      {liveWks.map((w) => (
        <div key={"live" + w.wk}>
          <Card style={{ padding: 12 }} accent={T.orange}>
            <div onClick={() => setOpen(open === w.wk ? null : w.wk)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 18, color: T.chalk, textTransform: "uppercase" }}>Week {w.wk} · LIVE</div>
                <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim }}>{w.range}</div>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 8, fontFamily: mono, fontSize: 10.5, color: T.steel, flexWrap: "wrap" }}>
                <span style={{ color: T.chalk }}>{w.avgW != null ? `${w.avgW} avg` : "sealed / no reads"}</span>
                <span>{w.avgCal != null ? `${w.avgCal} cal` : "—"}</span>
                <span style={{ color: w.proN && w.proHit / w.proN >= 0.6 ? T.jade : T.steel }}>pro {w.proHit}/{w.proN}</span>
                <span>{w.avgSteps != null ? `${w.avgSteps}k` : "—"}</span>
                <span>{w.avgSlp != null ? `${w.avgSlp}h` : "—"}</span>
              </div>
            </div>
            {open === w.wk && (
              <div style={{ marginTop: 12, borderTop: `1px solid ${T.line}`, paddingTop: 4 }}>
                {w.rows.map((h, i) => (
                  <div key={i} style={{ padding: "9px 0", borderBottom: i < w.rows.length - 1 ? `1px solid ${T.line}` : "none" }}>
                    <div style={{ display: "flex", gap: 10, fontFamily: mono, fontSize: 10.5, color: T.steel, flexWrap: "wrap" }}>
                      <span style={{ color: T.chalk, minWidth: 34 }}>{fmtShort(h.d).split(" ")[1]}</span>
                      <span style={{ color: h.w != null ? T.chalk : T.dim }}>{h.w != null ? h.w : h.sealedW != null ? h.sealedW + " (sealed)" : "—"}</span>
                      <span>{h.cal != null ? Math.round(h.cal) : "—"}/{h.pro != null ? Math.round(h.pro) : "—"}</span>
                      <span>{h.steps != null ? (h.steps / 1000).toFixed(1) + "k" : "—"}</span>
                      <span>{h.slp != null ? h.slp + "h" : "—"}</span>
                      {h.niggles.map((j, k) => (<span key={k} style={{ color: T.brass }}>{j}</span>))}
                    </div>
                    {h.note && <div style={{ fontFamily: body, fontSize: 11, color: T.dim, marginTop: 3, lineHeight: 1.45 }}>{h.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ))}

      {ROLLUPS.map((w) => (
        <div key={w.wk}>
          <Card style={{ padding: 12 }} accent={open === w.wk ? T.chalk : undefined}>
            <div onClick={() => setOpen(open === w.wk ? null : w.wk)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 18, color: T.chalk, textTransform: "uppercase" }}>Week {w.wk}</div>
                <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim }}>{w.range}</div>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 8, fontFamily: mono, fontSize: 10.5, color: T.steel, flexWrap: "wrap" }}>
                <span style={{ color: T.chalk }}>{w.avgW != null ? `${w.avgW} avg` : "no reads"}</span>
                <span>{w.avgCal != null ? `${w.avgCal} cal` : "—"}</span>
                <span style={{ color: w.proN && w.proHit / w.proN >= 0.6 ? T.jade : T.steel }}>pro {w.proHit}/{w.proN}</span>
                <span>{w.avgSteps != null ? `${w.avgSteps}k` : "—"}</span>
                <span>{w.avgSlp != null ? `${w.avgSlp}h` : "—"}</span>
                {w.flags > 0 && <span style={{ color: T.brass }}>{w.flags} flags</span>}
              </div>
            </div>
            {open === w.wk && (
              <div style={{ marginTop: 12, borderTop: `1px solid ${T.line}`, paddingTop: 4 }}>
                {w.rows.map((h, i) => (
                  <div key={i} style={{ padding: "9px 0", borderBottom: i < w.rows.length - 1 ? `1px solid ${T.line}` : "none" }}>
                    <div style={{ display: "flex", gap: 10, fontFamily: mono, fontSize: 10.5, color: T.steel, flexWrap: "wrap" }}>
                      <span style={{ color: T.chalk, minWidth: 34 }}>{fmtShort(h.d).split(" ")[1]}</span>
                      <span style={{ color: h.w != null ? T.chalk : T.dim }}>{h.w != null ? h.w : "—"}</span>
                      <span>{h.cal != null ? Math.round(h.cal) : "—"}/{h.pro != null ? Math.round(h.pro) : "—"}</span>
                      <span>{h.steps != null ? (h.steps / 1000).toFixed(1) + "k" : "—"}</span>
                      <span>{h.slp != null ? h.slp + "h" : "—"}</span>
                      {h.flag && h.flag !== "track" && <span style={{ color: T.brass }}>{h.flag}</span>}
                      {h.flag === "track" && <span style={{ color: T.jade }}>track</span>}
                    </div>
                    {h.note && <div style={{ fontFamily: body, fontSize: 11, color: T.dim, marginTop: 3, lineHeight: 1.45 }}>{h.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      ))}
      <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, textAlign: "center", padding: "2px 0 6px" }}>
        Verbatim from Prep-Tracker.xlsx · new days accrue automatically as you log
      </div>
    </div>
  );
}

function CoachView({ s, onClose }) {
  const bf = bfEst(s);
  const cur = currentRate(s);
  const rec = recoveryIndex(s);
  const slp = sleepInfo(s);
  const holds = s.exercises.filter((e) => e.holdFlag).map((e) => e.n);
  const pending = s.queue.filter((q) => !q.done && (q.kind === "own" || q.kind === "reclaim")).map((q) => q.t);
  const upcoming = s.queue.filter((q) => !q.done && q.kind === "debut").slice(0, 4).map((q) => q.t);
  const flagged = s.queue.filter((q) => !q.done && ((q.rule || "").toLowerCase().includes("coach") || q.state === "COACH FLAG" || q.state === "COACH'S EYE")).map((q) => q.t);
  const unsure = s.exercises.filter((e) => (e.setup || "").includes("(?)")).map((e) => e.n);
  const cutoff = isoOf(new Date(todayStart().getTime() - 14 * DAY));
  let ng = [];
  Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cutoff) ng = ng.concat(sl.niggles || []); });
  const Sec = ({ t, items, c = T.chalk }) => items.length ? (
    <div style={{ marginTop: 14 }}>
      <Eyebrow c={T.brass}>{t}</Eyebrow>
      {items.map((x, i) => (<div key={i} style={{ fontFamily: body, fontSize: 14, color: c, marginTop: 4 }}>· {x}</div>))}
    </div>
  ) : null;
  return (
    <div style={{ position: "fixed", inset: 0, background: T.ink, zIndex: 70, overflowY: "auto" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, margin: "0 auto", padding: "calc(26px + env(safe-area-inset-top)) 18px 60px" }}>
        <H size={26}>Coach One-Pager</H>
        <Eyebrow>{fmtShort(isoOf(todayStart()))} · WK {weekDay().wk} · {s.phase} · GENERATED LIVE</Eyebrow>
        <div style={{ display: "flex", gap: 18, marginTop: 16, flexWrap: "wrap" }}>
          <div><Num size={24} c={T.jade}>{s.trend}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>TREND</div></div>
          <div><Num size={24}>{bf.pct}%</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>EST BF {s.model.err}</div></div>
          <div><Num size={24}>{cur.fat}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>FAT/WK{cur.measured ? " · MEASURED" : ""}</div></div>
          <div><Num size={24} c={rec.band === "GREEN" ? T.jade : T.brass}>{rec.score}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>RECOVERY</div></div>
          <div><Num size={24}>{s.zeroComp.count}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>ZERO-COMP</div></div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 10 }}>
          Sleep: {slp.clean ? "CLEAN" : `reset ${slp.run}/${slp.need}`} · scale {daysUntil(s.blackout.until) > 0 ? `sealed → ${fmtShort(SEAL_UNTIL)}` : "live"}
        </div>
        <Sec t="NEEDS YOUR CALL" items={[...flagged, ...unsure.map((n) => `Confirm (?) cues — ${n}`)]} />
        <Sec t="IN THE QUEUE (STRUCTURAL)" items={upcoming} />
        <Sec t="OPEN STANDARDS" items={pending} />
        <Sec t="HELD ON RIR" items={holds} c={T.brass} />
        <Sec t="JOINT FLAGS · 14 D" items={ng.length ? [ng.join(" · ")] : []} c={T.brass} />
        <div style={{ marginTop: 24 }}><Btn small onClick={onClose}>Close</Btn></div>
      </div>
    </div>
  );
}

function Rules({ onClose, onReset, onExport, onImport, sync, onSync }) {
  const [tok, setTok] = useState("");
  const [hasTok, setHasTok] = useState(() => { try { return !!localStorage.getItem(TOKEN_KEY); } catch (e) { return false; } });
  const rules = [
    ["ADAPTIVE", "Session targets, earned loads, and the queue update themselves from what you log. Calorie & phase changes arm themselves from trend data but take one tap — nothing macro moves invisibly."],
    ["RATE", "IF <0.8/wk two weeks → restore steps first, THEN trim. IF ≥1.9 → redline, add back, coach flag. The app watches; you tap."],
    ["STRUCTURE", "One structural change per session — auto-picked from the queue. Rep progression unlimited."],
    ["OWNERSHIP", "A PR is not owned until it repeats on a clean day. Loads are earned at the top of the rep window on a clean day, then queued. Peak-stim PRs log provisional."],
    ["OPENERS", "Honest 1-RIR openers — hot openers crater tails. The app flags them."],
    ["SIGNALS", "Opener RIR, weekly waist, joint flags: ~45 sec that feed real rules. RIR-0 twice = load held. A grind at RIR 0 never earns. 3 joint flags in 3 weeks surfaces on NOW. Waist beats the scale."],
    ["SCALE", "Fasted · post-void · pre-food. Once a day. Sealed windows excluded. Trend is the hero."],
    ["EVENTS", "Estimate once, after, never at the table. Compensation does not exist in this app."],
    ["PROTEIN", "175 is THE number. A miss fixed inside 24 h extends the standard."],
    ["SLEEP", "3 consecutive 7.5–8 h nights = clean. Debuts defer only on a true <4.5 h night. Earns and owns require clean."],
    ["AUTHORITY", "Machine swaps, ladder graduations, the pivot call — coach territory. The app proposes; humans authorize."],
    ["ATTENTION", "From wk 10: mirror & measurements outrank the scale. The app rewards logged behavior, never checking."],
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,10,13,0.94)", zIndex: 70, overflowY: "auto" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, margin: "0 auto", padding: "calc(26px + env(safe-area-inset-top)) 18px 40px" }}>
        <H size={26}>The Rulebook</H>
        <Eyebrow>IF-THEN, SURFACED · YOU WROTE THESE — v2 RUNS THEM</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
          {rules.map(([k, v], i) => (
            <div key={i} style={{ borderLeft: `2px solid ${T.line}`, paddingLeft: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: T.brass }}>{k}</div>
              <div style={{ fontFamily: body, fontSize: 13, color: T.chalk, marginTop: 3, lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn small onClick={onClose}>Close</Btn>
          <Btn small onClick={onExport}>Export backup (JSON)</Btn>
          <label style={{ display: "inline-block" }}>
            <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.06em", fontWeight: 600, borderRadius: 6, padding: "6px 10px", border: `1px solid ${T.line}`, color: T.chalk, display: "inline-block", cursor: "pointer" }}>Import backup</span>
            <input type="file" accept="application/json,.json" style={{ display: "none" }} onChange={(e) => onImport(e.target.files && e.target.files[0])} />
          </label>
          <Btn small onClick={onReset}>Reset to seeded state (7/22)</Btn>
        </div>
        <div style={{ marginTop: 22, borderTop: `1px solid ${T.line}`, paddingTop: 14 }}>
          <Eyebrow c={T.brass}>THE MAP — SIX TABS, ONE SENTENCE EACH</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 8, lineHeight: 1.8 }}>
            <span style={{ color: T.chalk }}>NOW</span> — do: every daily log lives here. · <span style={{ color: T.chalk }}>TRAIN</span> — lift: today's session, generated. · <span style={{ color: T.chalk }}>QUEUE</span> — what's coming, and what it takes. · <span style={{ color: T.chalk }}>BODY</span> — is it working. · <span style={{ color: T.chalk }}>SLEEP</span> — the master lever's ledger. · <span style={{ color: T.chalk }}>HIST</span> — proof, patterns, and the science.
          </div>
        </div>
        <div style={{ marginTop: 22, borderTop: `1px solid ${T.line}`, paddingTop: 14 }}>
          <Eyebrow c={T.brass}>SELF-FILING · SUNDAY AUTO-SYNC TO YOUR PRIVATE REPO</Eyebrow>
          {hasTok ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel }}>Token saved on this device · last sync: {sync && sync.last ? `${fmtShort(sync.last)} — ${sync.status}` : "never"}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Btn small tone="jade" onClick={onSync}>Sync now</Btn>
                <Btn small onClick={() => { try { localStorage.removeItem(TOKEN_KEY); } catch (e) {} setHasTok(false); }}>Remove token</Btn>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              <input type="password" placeholder="paste the github_pat_ token" value={tok} onChange={(e) => setTok(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 12, padding: 10, outline: "none" }} />
              <div style={{ marginTop: 8 }}><Btn small tone="jade" onClick={() => { if (tok.indexOf("github_pat_") === 0) { try { localStorage.setItem(TOKEN_KEY, tok.trim()); } catch (e) {} setHasTok(true); setTok(""); } }}>Save token</Btn></div>
            </div>
          )}
          <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 8 }}>Stays on this device · never included in exports or sync payloads · scoped to prepledger only. Every Sunday the ledger commits itself — backup and coach review in one move.</div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 12 }}>
          The ledger lives on this device only. Export after big weeks — the backup file is the insurance policy. · Prep Ledger v{APP_V}
        </div>
      </div>
    </div>
  );
}

/* ---------- app ---------- */
export default function PrepLedger() {
  const [s, setS] = useState(null);
  const [tab, setTab] = useState("NOW");
  const [rules, setRules] = useState(false);
  const [coach, setCoach] = useState(false);
  const [updReady, setUpdReady] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    try { setS(loadState()); }
    catch (e) { setS(JSON.parse(JSON.stringify(SEED))); setOffline(true); }
  }, []);

  const [gloss, setGloss] = useState(null);
  useEffect(() => { window.__setGloss = setGloss; return () => { window.__setGloss = null; }; }, []);

  /* update-ready detection — replaces the kill-twice ritual */
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const had = !!navigator.serviceWorker.controller;
    const onCtrl = () => { if (had) setUpdReady(true); };
    navigator.serviceWorker.addEventListener("controllerchange", onCtrl);
    const check = () => { navigator.serviceWorker.getRegistration().then((r) => r && r.update()).catch(() => {}); };
    check();
    const onVis = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { navigator.serviceWorker.removeEventListener("controllerchange", onCtrl); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  /* sunday self-filing to github, once per day, only with a saved token */
  useEffect(() => {
    if (!s) return;
    const today = todayStart();
    let tok = null; try { tok = localStorage.getItem(TOKEN_KEY); } catch (e) {}
    if (!tok || today.getDay() !== 0 || s.sync.last === isoOf(today)) return;
    ghSync(s).then((res) => {
      const ns = { ...s, sync: { last: isoOf(today), status: res.ok ? "synced" : res.msg } };
      setS(ns); save(ns);
    });
  }, [s === null]);

  const save = useCallback((ns) => {
    try { localStorage.setItem(KEY, JSON.stringify(ns)); }
    catch (e) { setOffline(true); }
  }, []);

  const reset = () => {
    const fresh = runAdaptive(JSON.parse(JSON.stringify(SEED)), isoOf(todayStart()));
    setS(fresh); setRules(false);
    try { localStorage.setItem(KEY, JSON.stringify(fresh)); } catch (e) {}
  };

  const doExport = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `prep-ledger-backup-${isoOf(todayStart())}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const doImport = (file) => {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const data = migrate(JSON.parse(rd.result));
        if (!data || !Array.isArray(data.queue)) throw new Error("bad");
        setS(data); save(data); setRules(false);
      } catch (e) { alert("That file isn't a Prep Ledger backup — nothing was changed."); }
    };
    rd.readAsText(file);
  };

  if (!s) return (
    <div style={{ minHeight: "100vh", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.2em", color: T.steel }}>OPENING THE LEDGER…</div>
    </div>
  );

  const slp = sleepInfo(s);
  const tabs = ["NOW", "TRAIN", "QUEUE", "BODY", "SLEEP", "HIST"];

  return (
    <div style={{ minHeight: "100vh", background: T.ink, color: T.chalk }}>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        input:focus, button:focus-visible { outline: 2px solid ${T.brass}; outline-offset: 1px; }
        button { cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {offline && (
        <div style={{ background: T.plate2, borderBottom: `1px solid ${T.line}`, padding: "calc(8px + env(safe-area-inset-top)) 14px 8px", fontFamily: mono, fontSize: 10, color: T.brass, textAlign: "center" }}>
          STORAGE BLOCKED — private browsing? Nothing persists this session. Export from RULES before closing.
        </div>
      )}

      {updReady && (
        <button onClick={() => location.reload()} style={{ position: "fixed", top: "env(safe-area-inset-top)", left: 0, right: 0, zIndex: 58, background: T.orange, color: T.ink, border: "none", padding: "11px 14px", fontFamily: mono, fontSize: 11.5, letterSpacing: "0.08em", fontWeight: 700 }}>
          UPDATE READY — TAP TO LOAD IT
        </button>
      )}

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "env(safe-area-inset-top)", background: T.ink, zIndex: 55 }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "calc(14px + env(safe-area-inset-top)) 14px 132px" }}>
        {tab === "NOW" && <NowTab s={s} setS={setS} save={save} slp={slp} openRules={() => setRules(true)} openCoach={() => setCoach(true)} />}
        {tab === "TRAIN" && <LogTab s={s} setS={setS} save={save} slp={slp} />}
        {tab === "QUEUE" && <QueueTab s={s} slp={slp} />}
        {tab === "BODY" && <BodyTab s={s} setS={setS} save={save} />}
        {tab === "SLEEP" && <SleepTab s={s} setS={setS} save={save} slp={slp} />}
        {tab === "HIST" && <HistTab s={s} setS={setS} save={save} />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(14,17,21,0.96)", borderTop: `1px solid ${T.line}`, backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex" }}>
          {tabs.map((t2) => (
            <button key={t2} onClick={() => setTab(t2)} style={{ flex: 1, padding: "14px 0 calc(16px + env(safe-area-inset-bottom))", background: "none", border: "none", borderTop: tab === t2 ? `2px solid ${T.chalk}` : "2px solid transparent", fontFamily: mono, fontSize: 9.5, letterSpacing: "0.09em", color: tab === t2 ? T.chalk : T.dim }}>
              {t2}
            </button>
          ))}
        </div>
      </div>

      {rules && <Rules onClose={() => setRules(false)} onReset={reset} onExport={doExport} onImport={doImport} sync={s.sync} onSync={async () => { const res = await ghSync(s); const ns = { ...s, sync: { last: isoOf(todayStart()), status: res.ok ? "synced" : res.msg } }; setS(ns); save(ns); }} />}
      {coach && <CoachView s={s} onClose={() => setCoach(false)} />}
      {gloss && GLOSSARY[gloss] && (
        <div onClick={() => setGloss(null)} style={{ position: "fixed", inset: 0, zIndex: 66, background: "rgba(8,10,12,0.55)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: T.plate, borderTop: `1px solid ${T.line}`, padding: "16px 18px calc(20px + env(safe-area-inset-bottom))", maxWidth: 520, margin: "0 auto", borderRadius: "14px 14px 0 0" }}>
            <Eyebrow c={T.jade}>{GLOSSARY[gloss][0]}</Eyebrow>
            <div style={{ fontFamily: body, fontSize: 13.5, color: T.chalk, marginTop: 6, lineHeight: 1.6 }}>{GLOSSARY[gloss][1]}</div>
            <div style={{ marginTop: 12 }}><Btn small onClick={() => setGloss(null)}>Close</Btn></div>
          </div>
        </div>
      )}
    </div>
  );
}
