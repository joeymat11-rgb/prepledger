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

const APP_V = "2.6.0";
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
  { id: "lateral", lastMeta: { d: "2026-07-20", w: 80, reps: [14, 13, 13], debt: true }, n: "Lateral machine", day: "U", w: 80, inc: 5, sets: 3, hi: 15, last: [14, 13, 13],
    setup: "SET · resistance profile 5 · seat 5\nUpright, elbow-led (the set-4 fix) · no shrug creep · smooth top, no swing" },
  { id: "rearDelt", lastMeta: { d: "2026-07-20", w: 20, reps: [10, 10], debt: true }, n: "Rear-delt fly (cable)", day: "U", w: 20, inc: 2.5, sets: 2, hi: 12, last: [10, 10], note: "honest 10s — no hot opener",
    setup: "SET · unilateral · cable at highest height\nChest tall, shoulders back & down (?) · pure sweep — the opener fix is proven here" },
  { id: "rows", lastMeta: { d: "2026-07-20", w: 175, reps: [10, 10], debt: true }, n: "Rows (strapless)", day: "U", w: 175, inc: 5, sets: 2, hi: 10, last: [10, 10],
    setup: "SET · seat 4 · chest pad 7 · retrace profile 1\nChest stays glued to pad · pinch the blades at the back · strapless is the standard" },
  { id: "curl", lastMeta: { d: "2026-07-20", w: "55·55·50", reps: [12, 8, 10], debt: true }, n: "Curls", day: "U", w: "55·55·50", inc: 5, sets: 3, hi: 12, last: [12, 8, 10], ladder: { set: 1, top: 12 },
    setup: "SET · resistance profile 5 · seat 3\nSet 2 is the money set · no shoulder creep when it grinds" },
  { id: "press", lastMeta: { d: "2026-07-20", w: 245, reps: [8, 7, 6], debt: true }, n: "Press", day: "U", w: 245, inc: 5, sets: 3, hi: 9, last: [8, 7, 6], std: [8, 8, 7], own: true, ownNote: "repeat 8,8,7 on a clean day — no load until owned",
    setup: "SET · cam 5 · lowest seat\nShoulders back & down into the pad · no bottom bounce — this lift was won on the honest opener" },
  { id: "pulldown", lastMeta: { d: "2026-07-20", w: 160, reps: [8, 8], debt: true }, n: "Pulldown", day: "U", w: 160, inc: 10, sets: 2, hi: 10, last: [8, 8],
    setup: "SET · silver bar · thumbs in the same spot every session\nSame grip = comparable reps · chest up, elbows down-and-in · strapless" },
  { id: "sulek", lastMeta: { d: "2026-07-20", w: 87.5, reps: [12, 8], debt: true }, n: "Sulek curl (forearm)", day: "U", w: 87.5, inc: 2.5, sets: 2, hi: 15, last: [12, 8],
    setup: "SET · cable, highest rung · straight bar\nSam Sulek's signature — strict curl biasing the forearm flexors · elbows quiet, slow negative" },
  { id: "tricep", lastMeta: { d: "2026-07-20", w: 55, reps: [12, 11, 10], debt: true }, n: "Tricep", day: "U", w: 55, inc: 5, sets: 3, hi: 13, last: [12, 11, 10],
    setup: "SET · seat 4 · back pad all the way forward · middle peg through the cut\nElbows pinned · bottom-peg stretch waits for the build phase" },
  { id: "pronated", lastMeta: { d: "2026-07-20", w: 40, reps: [12, 11], debt: true }, n: "Pronated EZ curl", day: "U", w: 40, inc: 5, sets: 2, hi: 13, last: [12, 11],
    setup: "SET · EZ bar, pronated grip\nElbows pinned to sides, zero swing · wrists locked — don't let them bend back under load · 2–3 s negative, that's where this one grows · your 11,6 session was the hot-opener demo" },
  /* LOWER — order per the 7/17 & 7/21 notes, identical both days */
  { id: "calves", lastMeta: { d: "2026-07-21", w: 315, reps: [12, 10, 9, 8], debt: true }, n: "Calves", day: "L", w: 315, inc: 15, sets: 4, hi: 13, last: [12, 10, 9, 8], reclaim: [13, 12, 11, 10],
    setup: "SET · shoulder height 4\n5 s pause in the stretched position · back up to neutral · no bounce out of the hole — the pause IS the rep · drive through the big toe" },
  { id: "abs", lastMeta: { d: "2026-07-21", w: 95, reps: [14, 13, 13], debt: true }, n: "Abs", day: "L", w: 100, inc: 5, sets: 3, hi: 14, last: null, first: [12, 12, 12], debutNote: "DEBUT — new baseline, log honest",
    setup: "SET · back pad A · seat 6\nSame tempo every session — the load only moves on clean, even reps" },
  { id: "hanging", lastMeta: { d: "2026-07-21", w: "BW", reps: [6, 5], debt: true }, n: "Hanging raise", day: "L", w: "BW", inc: null, sets: 2, hi: 8, last: [6, 5],
    setup: "SET · bodyweight\nSlouch down/out to engage the core at rep 1 · constant tension, spine stays rounded · no swing between reps" },
  { id: "hack", lastMeta: { d: "2026-07-21", w: "hold", reps: [13, 12], debt: true }, n: "Hack squat", day: "L", w: "hold", inc: null, sets: 2, hi: 13, last: [13, 12], pendingThird: true,
    setup: "SET · foot placement = your favorited pic\nSame depth every rep · even sets are the standard here (11,11 → 12,12 → 13,13)" },
  { id: "extension", lastMeta: { d: "2026-07-21", w: 155, reps: [9, 6], debt: true }, n: "Leg extension", day: "L", w: 150, inc: 5, sets: 2, hi: 10, last: [9, 6], std: [9, 9], own: true, ownNote: "own 150×9,9 — then the 155 gate reopens",
    setup: "SET · shin pad height A · depth 3 · seat back all the way back — max quad stretch\nNo jerk at lockout · runs after hack by design — read dips as order effect, not regression" },
  { id: "ham", lastMeta: { d: "2026-07-21", w: 120, reps: [10, 10], debt: true }, n: "Ham curl", day: "L", w: 120, inc: 10, sets: 2, hi: 12, last: [10, 10],
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
  SEED.v = 8;
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
  const push = (t, how) => lines.push({ t, how });
  const debtTag = slp.clean ? "" : " · on debt — provisional";
  const qFind = (pred) => s.queue.find(pred);

  entries.forEach((en) => {
    const ex = exById(s, en.id);
    if (!ex || !en.reps || !en.reps.length) return;
    const r = en.reps.map((x) => Number(x) || 0);
    const q = qFind((x) => x.exId === ex.id && !x.done && (x.kind === "debut" || x.kind === "unlock"));

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
  s.sessionLog[iso] = { entries: entries.map((e) => ({ id: e.id, reps: e.reps, rir: e.rir ?? null })), at: Date.now(), note: extras.note || "", niggles };
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
function migrate(old) {
  if (old && old.v === 8) return old;
  if (old && old.v >= 3 && old.v <= 7) return patchV8(patchV7(patchV6(patchV5(patchV4(JSON.parse(JSON.stringify(old)))))));
  const s = JSON.parse(JSON.stringify(SEED));
  if (!old || (old.v !== 1 && old.v !== 2)) return s;
  ["feed", "sessionLog", "events", "boosts", "thesisConfirms", "lastThesisWk", "zeroComp", "fixWindow"].forEach((k) => { if (old[k] !== undefined) s[k] = old[k]; });
  (old.reads || []).forEach((r) => { if (!s.reads.some((x) => x.d === r.d)) s.reads.push(r); });
  s.reads.sort((a, b) => (a.d < b.d ? -1 : 1));
  s.reads.filter((r) => !r.sealed && r.d > "2026-07-21").forEach((r) => { s.trend = +(s.trend * 0.7 + r.w * 0.3).toFixed(1); });
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
  return patchV8(patchV7(patchV6(patchV5(patchV4(s)))));
}

export const __test = { targetsFor, genSession, completeSession, runAdaptive, bfEst, currentRate, etaWeeks, migrate, applyProposal, undoRead, SEED, dayType, HISTORY, ROLLUPS };

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

function NowTab({ s, setS, save, slp, openRules }) {
  const tISO = isoOf(todayStart());
  const wd = weekDay();
  const dt = dayType(tISO);
  const isRefeed = dt === "REFEED";
  const nextISO = nextTrainingISO(s);
  const sess = nextISO ? genSession(s, nextISO, slp) : null;
  const heroToday = nextISO === tISO;
  const dl = s.dailyLogs[tISO] || {};
  const [cal, setCal] = useState(dl.cal ?? "");
  const [pro, setPro] = useState(dl.pro ?? "");
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
        <button onClick={openRules} style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.14em", color: T.steel, background: "none", border: `1px solid ${T.line}`, borderRadius: 6, padding: "6px 10px" }}>RULES</button>
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
        </Card>
      )}

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {cleanIn > 0 && <Chip c={T.chalk}>Scale sealed · clean read {fmtShort(SEAL_UNTIL)} · {cleanIn}d</Chip>}
        {(!s.waist.length || Math.round((mk(tISO) - mk(s.waist[s.waist.length - 1].d)) / DAY) >= 7) && <Chip c={T.brass}>Waist due — 10 sec in BODY</Chip>}
        <Chip c={slp.clean ? T.jade : T.brass}>Sleep {slp.clean ? "CLEAN" : `reset ${slp.run}/${slp.need}`}</Chip>
        {ev && <Chip c={T.chalk}>{ev.t} · {fmtShort(ev.d)}</Chip>}
      </div>

      <Card>
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
      </Card>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Eyebrow c={T.chalk}>CROSSOVER · AUG 28</Eyebrow>
          <span style={{ fontFamily: mono, fontSize: 11, color: T.steel }}>{xoverIn}d · {xPct}%</span>
        </div>
        <div style={{ margin: "8px 0 6px" }}><Bar pct={xPct} c={T.chalk} /></div>
        <div style={{ fontFamily: body, fontSize: 12, color: T.steel }}>~158.5 at ~12% — last cut's best with 4–5 lb more muscle. The marquee.</div>
      </Card>

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
          <div style={{ marginTop: 10, fontFamily: mono, fontSize: 11, color: T.brass }}>FIX WINDOW OPEN — a miss fixed inside 24 h extends the standard. No resets here.</div>
        )}
        <div style={{ marginTop: 10 }}><Btn tone="jade" full onClick={saveDaily}>Log today</Btn></div>
      </Card>

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
              {ex.prev.debt && <span style={{ color: T.brass }}> · on debt</span>}
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
            <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.1em" }}>OPENER RIR</span>
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

function QueueTab({ s }) {
  const live = s.queue.filter((x) => !x.done);
  const flipped = s.queue.filter((x) => x.done);
  const curl = exById(s, "curl");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Eyebrow>THE LIVE QUEUE · REFILLS ITSELF AS GATES RESOLVE</Eyebrow>
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
  const already = s.reads.some((r) => r.d === tISO);
  const [w, setW] = useState(s.trend);
  const [waistIn, setWaistIn] = useState(s.waist && s.waist.length ? s.waist[s.waist.length - 1].v : 32);
  const [dexaIn, setDexaIn] = useState("");
  const wd = weekDay();
  const xPct = Math.round(((todayStart() - mk(START)) / (mk(CROSSOVER) - mk(START))) * 100);
  const bf = bfEst(s);
  const cur = currentRate(s);
  const eta12 = etaWeeks(s, 12), eta11 = etaWeeks(s, 11);
  const canThesis = wd.wk > s.lastThesisWk;
  const mirrorEra = wd.wk >= 10;

  const logWeight = () => {
    if (already) return;
    const ns = JSON.parse(JSON.stringify(s));
    ns.reads.push({ d: tISO, w, sealed, note: sealed ? "sealed — excluded from trend" : "", pt: ns.trend });
    if (!sealed) ns.trend = +(ns.trend * 0.7 + w * 0.3).toFixed(1);
    const ns2 = runAdaptive(ns, tISO);
    setS(ns2); save(ns2);
  };

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
        <Eyebrow>TREND — THE HERO NUMBER</Eyebrow>
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
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <Stepper v={w} set={setW} step={0.1} min={140} />
          <div style={{ flex: 1 }}>
            <Btn full small onClick={logWeight} disabled={already}>{already ? "Logged — once a day is the cap" : sealed ? "Log read (auto-sealed)" : "Log fasted read"}</Btn>
          </div>
        </div>
        {already && (
          <div style={{ marginTop: 8 }}>
            <Btn small onClick={() => { const ns = undoRead(s, tISO); setS(ns); save(ns); }}>Undo today's read — fat-fingers happen</Btn>
          </div>
        )}
        <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 6 }}>PROTOCOL: fasted · post-void · pre-food/water · 16 oz water ≈ +0.5–1 lb</div>
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
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
                <Stepper v={waistIn} set={setWaistIn} step={0.1} min={20} />
                <div style={{ flex: 1 }}>
                  <Btn full small tone={due ? "jade" : "ghost"} disabled={!due} onClick={() => {
                    const ns = JSON.parse(JSON.stringify(s));
                    const prev = ns.waist[ns.waist.length - 1];
                    ns.waist.push({ d: tISO, v: waistIn });
                    if (prev && waistIn < prev.v) ns.feed.unshift({ d: tISO, t: "WAIST DOWN", how: `${prev.v}" → ${waistIn}" at trend ${ns.trend} — fat loss the scale can't argue with` });
                    setS(ns); save(ns);
                  }}>{due ? (lastW ? "Log this week's waist" : "Log baseline waist") : `Logged — next ${fmtShort(isoOf(new Date(mk(lastW.d).getTime() + 7 * DAY)))}`}</Btn>
                </div>
              </div>
              {lastW && lastW.d === tISO && (
                <div style={{ marginTop: 8 }}>
                  <Btn small onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.waist = ns.waist.filter((x) => x.d !== tISO); setS(ns); save(ns); }}>Undo today's waist</Btn>
                </div>
              )}
              <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 6 }}>PROTOCOL: fasted · post-void · at navel · relaxed tape · weekly</div>
            </>
          );
        })()}
      </Card>

      <Card>
        <Eyebrow>RATE OF LOSS · PHASE-AWARE</Eyebrow>
        <div style={{ marginTop: 10 }}><RateGauge rate={s.rate} cur={cur} /></div>
        <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, marginTop: 8 }}>Rules run themselves: floor and redline arm one-tap adjustments on the NOW screen when trend data trips them.</div>
      </Card>

      <Card>
        <Eyebrow>MAINTENANCE LEDGER</Eyebrow>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          {s.maintenance.map((m, i) => (
            <div key={i}><Num size={20}>{m.cal}</Num><div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, textTransform: "uppercase" }}>{m.label}{m.note ? ` · ${m.note}` : ""}</div></div>
          ))}
        </div>
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
  const [h, setH] = useState(7.5);
  const tISO = isoOf(todayStart());
  const lastNight = isoOf(new Date(todayStart().getTime() - DAY));
  const already = s.sleep.nights.some((n) => n.d === lastNight);
  const nights = s.sleep.nights.slice(-8);
  const maxH = 9;

  const log = () => {
    if (already) return;
    const ns = JSON.parse(JSON.stringify(s));
    ns.sleep.nights.push({ d: lastNight, h });
    let run = 0;
    for (let i = ns.sleep.nights.length - 1; i >= 0; i--) { if (ns.sleep.nights[i].h >= ns.sleep.cleanH) run++; else break; }
    if (run === ns.sleep.needed) ns.feed.unshift({ d: tISO, t: "SLEEP RESET COMPLETE", how: `${run} consecutive clean nights — PRs can be OWNED again · #1 lever for the back half, and for the ADHD` });
    setS(ns); save(ns);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card accent={slp.clean ? T.jade : T.brass}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Eyebrow>THE MASTER VARIABLE</Eyebrow>
            <H size={24} c={slp.clean ? T.jade : T.brass}>{slp.clean ? "CLEAN" : `RESET ${slp.run} / ${slp.need}`}</H>
          </div>
          <div style={{ textAlign: "right", fontFamily: mono, fontSize: 10.5, color: T.steel }}>target 7.5–8 h<br />clean night = ≥7.5</div>
        </div>
        <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 8 }}>
          {slp.clean ? "Own-it attempts count. Earns bank. Reward circuitry back online." : `${slp.need - slp.run} more clean night${slp.need - slp.run === 1 ? "" : "s"} → clean. Debt downregulates dopamine receptors — it costs focus, drive, and honest RIR, not just recovery.`}
        </div>
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

      <Card>
        <Eyebrow>LOG LAST NIGHT</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
          <Stepper v={h} set={setH} step={0.5} min={0} />
          <div style={{ flex: 1 }}><Btn full small tone="jade" disabled={already} onClick={log}>{already ? "Logged" : "Bank it"}</Btn></div>
        </div>
        {already && (
          <div style={{ marginTop: 8 }}>
            <Btn small onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.sleep.nights = ns.sleep.nights.filter((n) => n.d !== lastNight); setS(ns); save(ns); }}>Undo last night's entry</Btn>
          </div>
        )}
      </Card>

      <Card>
        <Eyebrow c={T.brass}>WHAT THE DEBT COST — ATTRIBUTED, NOT BLAMED</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {s.sleep.debts.map((d, i) => (
            <div key={i} style={{ fontFamily: mono, fontSize: 11, color: T.steel }}>· {d}</div>
          ))}
        </div>
        <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 8 }}>Down sessions on debt read as context, not regression.</div>
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

function HistTab({ s }) {
  const [open, setOpen] = useState(null);
  const first = ROLLUPS[ROLLUPS.length - 1], latest = ROLLUPS[0];
  const wDelta = first && latest && first.avgW && latest.avgW ? +(first.avgW - latest.avgW).toFixed(1) : null;
  const proHitTot = ROLLUPS.reduce((a, w) => a + w.proHit, 0), proNTot = ROLLUPS.reduce((a, w) => a + w.proN, 0);
  const stat = (v, l) => (
    <div><Num size={19}>{v}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div></div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Card accent={T.jade}>
        <Eyebrow>THE RECORD · {HISTORY.length} DAYS · 6/10 →</Eyebrow>
        <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap" }}>
          {stat(wDelta != null ? `−${wDelta}` : "—", "lb · wk-avg vs wk 1")}
          {stat(`${proHitTot}/${proNTot}`, "protein on target")}
          {stat(`${s.zeroComp.count}`, "events · zero comp")}
          {stat(`${latest && latest.avgSteps != null ? latest.avgSteps + "k" : "—"}`, "steps avg · this wk")}
        </div>
        <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 8 }}>Weight fell while every headline lift rose — the whole thesis, in one screen. Tap a week for the day-by-day.</div>
      </Card>

      {(() => {
        const dates = [...new Set([...Object.keys(s.dailyLogs), ...s.reads.map((r) => r.d), ...s.sleep.nights.map((n) => n.d)])].filter((d) => d > "2026-07-21").sort();
        if (!dates.length) return null;
        const live = dates.map((d) => ({
          d, w: (s.reads.find((r) => r.d === d) || {}).w ?? null,
          cal: (s.dailyLogs[d] || {}).cal ?? null, pro: (s.dailyLogs[d] || {}).pro ?? null,
          steps: (s.dailyLogs[d] || {}).steps ?? null, slp: (s.sleep.nights.find((n) => n.d === d) || {}).h ?? null,
          sealed: (s.reads.find((r) => r.d === d) || {}).sealed,
        }));
        return (
          <Card style={{ padding: 12 }} accent={T.orange}>
            <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 18, color: T.chalk, textTransform: "uppercase" }}>Live · since handoff</div>
            <div style={{ marginTop: 6 }}>
              {live.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontFamily: mono, fontSize: 10.5, color: T.steel, padding: "8px 0", borderBottom: i < live.length - 1 ? `1px solid ${T.line}` : "none", flexWrap: "wrap" }}>
                  <span style={{ color: T.chalk, minWidth: 34 }}>{fmtShort(h.d).split(" ")[1]}</span>
                  <span style={{ color: h.sealed ? T.dim : T.chalk }}>{h.w != null ? h.w + (h.sealed ? " (sealed)" : "") : "—"}</span>
                  <span>{h.cal != null ? Math.round(h.cal) : "—"}/{h.pro != null ? Math.round(h.pro) : "—"}</span>
                  <span>{h.steps != null ? (h.steps >= 1000 ? (h.steps / 1000).toFixed(1) + "k" : h.steps + "k") : "—"}</span>
                  <span>{h.slp != null ? h.slp + "h" : "—"}</span>
                  {((s.sessionLog[h.d] || {}).niggles || []).map((j, k) => (<span key={k} style={{ color: T.brass }}>{j}</span>))}
                </div>
              ))}
            </div>
            {live.some((h) => (s.sessionLog[h.d] || {}).note) && live.filter((h) => (s.sessionLog[h.d] || {}).note).map((h, i) => (
              <div key={i} style={{ fontFamily: body, fontSize: 11, color: T.dim, marginTop: 6, lineHeight: 1.45 }}><span style={{ fontFamily: mono, color: T.steel }}>{fmtShort(h.d).split(" ")[1]}</span> — {s.sessionLog[h.d].note}</div>
            ))}
          </Card>
        );
      })()}

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

function Rules({ onClose, onReset, onExport, onImport }) {
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
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    try { setS(loadState()); }
    catch (e) { setS(JSON.parse(JSON.stringify(SEED))); setOffline(true); }
  }, []);

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

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "env(safe-area-inset-top)", background: T.ink, zIndex: 55 }} />

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "calc(14px + env(safe-area-inset-top)) 14px 132px" }}>
        {tab === "NOW" && <NowTab s={s} setS={setS} save={save} slp={slp} openRules={() => setRules(true)} />}
        {tab === "TRAIN" && <LogTab s={s} setS={setS} save={save} slp={slp} />}
        {tab === "QUEUE" && <QueueTab s={s} />}
        {tab === "BODY" && <BodyTab s={s} setS={setS} save={save} />}
        {tab === "SLEEP" && <SleepTab s={s} setS={setS} save={save} slp={slp} />}
        {tab === "HIST" && <HistTab s={s} />}
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

      {rules && <Rules onClose={() => setRules(false)} onReset={reset} onExport={doExport} onImport={doImport} />}
    </div>
  );
}
