import React, { useState, useEffect, useCallback, useRef } from "react";
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
  chalk: "#E8E4DA", steel: "#8A93A0", dim: "#838D9A",
  jade: "#4CC38A", brass: "#E5B454", orange: "#FF8C42", redline: "#EA5E62",
};
const disp = "'Barlow Condensed', system-ui, sans-serif";
const mono = "'IBM Plex Mono', ui-monospace, monospace";
const body = "'Barlow', system-ui, sans-serif";

/* ---------- type scale — six roles, one source ----------
   The old file carried ~15 ad-hoc font sizes. These are the roles everything
   should map onto. The floor for anything a user must READ is `label` (11px):
   below that trips iOS legibility and, on this athlete's ADHD, glance-ability.
   `micro` (10) is reserved for genuinely decorative/forensic text only. To make
   something bigger, move it to the right role here — do not invent a new number. */
const TS = { display: 26, title: 16, body: 12.5, label: 11, micro: 10 };

/* ---------- spacing — 4px baseline, 8px rhythm ----------
   One constrained scale for every gap and pad. Whitespace encodes relationship:
   tight within a group, generous between groups (Gestalt proximity; Refactoring
   UI). Snap paddings/gaps to these so the whole surface shares one vertical
   rhythm instead of ~a dozen ad-hoc pixel values. */
const SP = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

/* ---------- date utils ---------- */
const DAY = 86400000;
const mk = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
const todayStart = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const daysUntil = (s) => Math.round((mk(s) - todayStart()) / DAY);
const fmtShort = (s) => { const d = mk(s); return `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`; };
const weeksBetween = (aISO, bISO) => (mk(bISO) - mk(aISO)) / DAY / 7;

if (typeof document !== "undefined" && !document.getElementById("pl-gx")) {
  const st0 = document.createElement("style"); st0.id = "pl-gx";
  st0.textContent = "*{box-sizing:border-box;-webkit-tap-highlight-color:transparent} html,body,#root{max-width:100%;overflow-x:hidden} body{-webkit-text-size-adjust:100%} input,select,textarea{font-size:16px !important;max-width:100%} button{max-width:100%}";
  document.head.appendChild(st0);
}
const APP_V = "4.0.9";
/* The schema version, declared once. Two places must agree: the SEED (which is
   authored already-current) and migrate() (which walks old states up to it).
   They used to carry the number independently and drifted — the seed sat a
   version behind for a whole release. Bumping this constant plus appending to
   PATCHES is now the entire ritual. */
const SCHEMA_V = 34;
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
  { id: "lateral", mg: "delts", head: "delts_side", lastMeta: { d: "2026-07-20", w: 80, reps: [14, 13, 13], debt: true }, n: "Lateral machine", day: "U", w: 80, inc: 5, sets: 4, hi: 15, last: [14, 13, 13],
    setup: "SET · resistance profile 5 · seat 5\nUpright, elbow-led (the set-4 fix) · no shrug creep · smooth top, no swing" },
  { id: "rearDelt", mg: "delts", head: "delts_rear", lastMeta: { d: "2026-07-20", w: 20, reps: [10, 10], debt: true }, n: "Rear-delt fly (cable · uni)", day: "U", w: 20, inc: 2.5, sets: 3, hi: 12, last: [10, 10], note: "honest 10s — no hot opener · 3 sets per side, log the weaker side",
    setup: "SET · unilateral · cable at highest height\nChest tall, shoulders back & down (?) · pure sweep — the opener fix is proven here" },
  { id: "rows", mg: "back", lastMeta: { d: "2026-07-20", w: 175, reps: [10, 10], debt: true }, n: "Rows (strapless)", day: "U", w: 175, inc: 5, sets: 2, hi: 10, last: [10, 10],
    setup: "SET · seat 4 · chest pad 7 · retrace profile 1\nChest stays glued to pad · pinch the blades at the back · strapless is the standard" },
  { id: "curl", mg: "biceps", lastMeta: { d: "2026-07-20", w: "55·55·50", reps: [12, 8, 10], debt: true }, n: "Curls", day: "U", w: "55·55·50", inc: 5, sets: 3, hi: 12, last: [12, 8, 10], ladder: { set: 1, top: 12 },
    setup: "SET · resistance profile 5 · seat 3\nSet 2 is the money set · no shoulder creep when it grinds" },
  { id: "press", mg: "chest", lastMeta: { d: "2026-07-20", w: 245, reps: [8, 7, 6], debt: true }, n: "Press", day: "U", w: 245, inc: 5, sets: 3, hi: 9, last: [8, 7, 6], std: [8, 8, 7], own: true, ownNote: "repeat 8,8,7 — no load until owned",
    setup: "SET · cam 5 · lowest seat\nShoulders back & down into the pad · no bottom bounce — this lift was won on the honest opener" },
  { id: "pulldown", mg: "back", lastMeta: { d: "2026-07-20", w: 160, reps: [8, 8], debt: true }, n: "Pulldown", day: "U", w: 160, inc: 5, sets: 2, hi: 10, last: [8, 8],
    setup: "SET · silver bar · thumbs in the same spot every session\nSame grip = comparable reps · chest up, elbows down-and-in · strapless" },
  { id: "sulek", mg: "forearms", lastMeta: { d: "2026-07-20", w: 87.5, reps: [12, 8], debt: true }, n: "Sulek curl (forearm)", day: "U", w: 87.5, inc: 2.5, sets: 2, hi: 15, last: [12, 8],
    setup: "SET · cable, highest rung · straight bar\nSam Sulek's signature — strict curl biasing the forearm flexors · elbows quiet, control the weight rather than drop it" },
  { id: "tricep", mg: "triceps", lastMeta: { d: "2026-07-20", w: 55, reps: [12, 11, 10], debt: true }, n: "Tricep", day: "U", w: 55, inc: 5, sets: 3, hi: 13, last: [12, 11, 10],
    setup: "SET · seat 4 · back pad all the way forward · middle peg through the cut\nElbows pinned · middle peg, settled — the peg sets the resistance profile, not the shoulder angle, so it was never the overhead question" },
  { id: "pronated", mg: "forearms", lastMeta: { d: "2026-07-20", w: 40, reps: [12, 11], debt: true }, n: "Pronated EZ curl", day: "U", w: 40, inc: 5, sets: 2, hi: 13, last: [12, 11],
    setup: "SET · EZ bar, pronated grip\nElbows pinned to sides, zero swing · wrists locked — don't let them bend back under load · your 11,6 session was the hot-opener demo" },
  /* LOWER — order per the 7/17 & 7/21 notes, identical both days */
  { id: "calves", mg: "calves", lastMeta: { d: "2026-07-21", w: 315, reps: [12, 10, 9, 8], debt: true }, n: "Calves", day: "L", w: 315, inc: 5, sets: 4, hi: 13, last: [12, 10, 9, 8], reclaim: [13, 12, 11, 10],
    setup: "SET · shoulder height 4\n5 s pause in the stretched position · back up to neutral · no bounce out of the hole — the pause IS the rep · drive through the big toe" },
  { id: "abs", mg: "abs", lastMeta: { d: "2026-07-21", w: 95, reps: [14, 13, 13], debt: true }, n: "Abs", day: "L", w: 100, inc: 5, sets: 3, hi: 14, last: null, first: [12, 12, 12], debutNote: "DEBUT — new baseline, log honest",
    setup: "SET · back pad A · seat 6\nThe load only moves on clean, even reps — consistency of execution, not of speed" },
  { id: "hanging", mg: "abs", lastMeta: { d: "2026-07-21", w: "BW", reps: [6, 5], debt: true }, n: "Hanging raise", day: "L", w: "BW", inc: null, sets: 2, hi: 8, last: [6, 5],
    setup: "SET · bodyweight\nSlouch down/out to engage the core at rep 1 · constant tension, spine stays rounded · no swing between reps" },
  { id: "hack", mg: "quads", lastMeta: { d: "2026-07-21", w: "hold", reps: [13, 12], debt: true }, n: "Hack squat", day: "L", w: "hold", inc: 10, sets: 2, hi: 12, last: null, pendingThird: true,
    setup: "SET · foot placement = your favorited pic\nSame depth every rep · even sets are the standard here (11,11 → 12,12 → 13,13)" },
  { id: "extension", mg: "quads", lastMeta: { d: "2026-07-21", w: 155, reps: [9, 6], debt: true }, n: "Leg extension", day: "L", w: 150, inc: 5, sets: 2, hi: 10, last: [9, 6], std: [9, 9], own: true, ownNote: "own 150×9,9 — then the 155 gate reopens",
    setup: "SET · shin pad height A · depth 3 · seat back all the way back — max quad stretch\nNo jerk at lockout · runs after hack by design — read dips as order effect, not regression" },
  { id: "ham", mg: "hams", lastMeta: { d: "2026-07-21", w: 120, reps: [10, 10], debt: true }, n: "Ham curl", day: "L", w: 120, inc: 5, sets: 2, hi: 12, last: [10, 10],
    setup: "SET · back 5 · calf pad height C · depth 3 · resistance profile 5\nHips pinned down, no lift-off · full stretch at the top of every rep" },
];

/* ---------- seed state ---------- */
const SEED = {
  v: 2,
  phase: "EASE 1",
  rate: { band: [1.0, 1.4], redline: 1.9, floor: 0.8 },
  maintenance: [{ label: "Hard-block steps", cal: 2590, note: "validated" }, { label: "Ease-1 steps", cal: 2470 }],
  trend: 164.2,
  model: { lean: 139.7, anchorISO: "2026-07-21", drip: 0, src: "coach's eye", err: "±1.5–3" },
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
    { id: "q_press_own", kind: "own", exId: "press", t: "PRESS · OWN 245", state: "OWN-IT", gate: "Repeat 8,8,7 — the repeat is the confirmation", rule: "Do NOT load until owned", done: false },
    { id: "q_hack3", kind: "debut", exId: "hack", t: "HACK 3RD SET DEBUT", state: "DEBUT", gate: "Gate passed — it runs on its next lower day", rule: "Runs when it wins the day's structural slot", done: false },
    { id: "q_abs", kind: "debut", exId: "abs", coApproved: true, t: "ABS 100 DEBUT", state: "DEBUT", gate: "Earned 7/21 via 95×14,13,13", rule: "Doc-approved to ride alongside the hack debut", done: false },
    { id: "q_calves", kind: "reclaim", exId: "calves", t: "CALF INCREMENT OFF 315", state: "RECLAIM", gate: "Needs 13,12,11,10 back (last: 12,10,9,8)", rule: "Hold 315 — increment stays locked", done: false },
    { id: "q_ext", kind: "own", exId: "extension", t: "EXTENSION · OWN 150×9,9", state: "REVERT", gate: "Self-bump to 155 cratered (9,6) — back to 150", rule: "155 reopens after 9,9 lands", done: false },
    { id: "q_curl", kind: "ladder", exId: "curl", t: "CURL 55 LADDER", state: "LADDER", gate: "Set 2: 8 → 9–10 → 12", done: false },
    { id: "q_primeRD", kind: "info", t: "PRIME REAR-DELT SWITCH", state: "PARKED", gate: "Cable + conscious retraction is working", rule: "Fires only if rounding returns at fatigue — coach territory", done: false },
    /* ---------- TRICEP_NOTE — asked, answered, closed ----------
       The literature says overhead beats pushdown for the long head at d =
       0.54-0.61, because the long head crosses the shoulder and only an
       overhead position lengthens it. His Prime 3-peg is a pushdown-pattern
       machine: changing the peg changes the RESISTANCE PROFILE — where in the
       range the load peaks — not the shoulder angle. So no peg setting can buy
       the overhead effect. They are different variables, and this queue item
       had them confused.

       Asked directly, he chose to keep the Prime. That is defensible and the
       app should stop raising it: it is the lift he will actually do, adherence
       is the largest lever in the whole literature, triceps are one muscle of
       roughly ten, and his pressing already loads them indirectly. A d = 0.55
       on one muscle's long head, against a swap he does not want, is not a
       trade worth nagging a man about twice a week.

       It also stops waiting for a "build phase" that has no date and that he
       has not decided on — see DIET_EXIT. A queue item gated on an undecided
       phase is a phantom that never resolves. */
    { id: "q_peg", kind: "info", t: "TRICEP SETUP — SETTLED", state: "PARKED", gate: "Your call: the Prime 3-peg stays", rule: "Closed — the app stops raising this", done: true },
    { id: "q_ease2", kind: "phase", t: "EASE 2", state: "ARMS @ ~13%", gate: "~2,350–2,400 cal · step taper", rule: "Arms itself from the live BF estimate", done: false },
    { id: "q_pivot", kind: "exit", t: "THE DIET EXIT", state: "COACH'S EYE", gate: "When you and your coach call it — no date", rule: "One step to your MEASURED maintenance, hold, then decide", done: false },
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
  SEED.v = SCHEMA_V;
  SEED.medsLog = [];
  SEED.energy = []; SEED.soreness = []; SEED.grip = [];
  SEED.caffLog = [];
  SEED.dayCtx = {};
  SEED.agentProposals = [];
  SEED.temp = [];
  SEED.trials = [];
  SEED.pulse = [];
  SEED.sleep.anchor = { wake: "06:45", inBed: 8.25, asleepTarget: 8 };
  SEED.forecasts = [];
  SEED.labSeen = {};
  SEED.sleep.anchor = { wake: "06:45", inBed: 8.25 };
  SEED.sleep.caffMg = null;
  SEED.sleep.melaExp = { started: "2026-07-23", arm: "none", baseline: "5 mg most nights · ~6 h wakes" };
  SEED.creatine = null;
  SEED.photos = [];
  SEED.sync = { last: null, status: "" };
  SEED.exOrder = { U: SEED.exercises.filter((e) => e.day === "U").map((e) => e.id), L: SEED.exercises.filter((e) => e.day === "L").map((e) => e.id) };
  SEED.waist = [];
  SEED.exercises.forEach((e) => { e.rirHist = []; });
  /* seeded PREV blocks predate per-set RIR, so their arrays are all-null —
     exactly what patchV31 produces for the same data. A fresh install and a
     migrated one must be indistinguishable. */
  SEED.exercises.forEach((e) => { if (e.lastMeta) e.lastMeta.rirSets = new Array(((e.lastMeta.reps) || []).length).fill(null); });
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
      wk, rows, days: rows.map((r) => r.d),
      range: `${fmtShort(rows[0].d)} – ${fmtShort(rows[rows.length - 1].d)}`,
      avgW: ws.length ? +avg(ws).toFixed(1) : null,
      avgCal: cals.length ? Math.round(avg(cals)) : null,
      avgPro: pros.length ? Math.round(avg(pros)) : null,
      /* Historic weeks were graded against an authored 175 +/- 10 while live
         weeks used the derived floor, so one screen summed two standards. These
         rollups are built at module load with no state to derive from, so they
         carry the raw values and the hit count is computed by rollupHits() at
         the call sites, where the derived floor exists. */
      pros, proN: pros.length,
      avgSteps: stepsA.length ? +(avg(stepsA) / 1000).toFixed(1) : null,
      avgSlp: slps.length ? +avg(slps).toFixed(1) : null,
      flags: rows.filter((r) => r.flag && r.flag !== "track").length,
    };
  });
}
const ROLLUPS = weekRollups();
/* One standard for every week on screen, historic or live. */
function rollupHits(w, floor) { return (w.pros ? w.pros.filter((p) => proteinHit(floor, p)).length : (w.proHit || 0)); }

/* ============================================================
   ENGINE — pure functions
   ============================================================ */
const exById = (s, id) => s.exercises.find((e) => e.id === id);

/* ---------- REFEED_RETIREMENT ----------
   Wednesday is a refeed because his programme says so. When he retires it — a
   proposal, applied — it has to actually stop being one, and the first version
   of that proposal had no hands: applying it logged a note and Wednesday stayed
   a refeed day in all 34 places this function is called. A card that says "the
   proposal is to retire the weekly refeed", takes the tap, and changes nothing
   is worse than no card.

   The retirement is dated, and only applies FORWARD. Past Wednesdays stay
   refeeds because they were refeeds — the refeed-bump line, the post-refeed
   water flag and the Tue/Fri experiment are all reading history and must keep
   reading it truthfully. Callers reasoning about today or tomorrow pass state;
   callers analysing the record do not, and get the historical answer. */
function dayType(iso, s) {
  const d = mk(iso).getDay();
  if (d === 3) {
    const off = s && s.targets && s.targets.refeedOff;
    return off && iso >= off ? "REST" : "REFEED";
  }
  return d === 1 || d === 4 ? "U" : d === 2 || d === 5 ? "L" : "REST";
}

/* target generator: climb the earliest set that lags the one before it */
const CALL_PLAIN = {
  "PUSH": { chip: "CHASE", mean: "Beat last time. Add reps wherever you honestly can — weight bumps queue themselves when you hit the standard." },
  "PUSH+": { chip: "CHASE — GREEN LIGHT", mean: "Best conditions you get: refeed fuel aboard, sleep clean. If a record is coming, it comes today." },
  "HOLD": { chip: "REPEAT", mean: "Run the exact same numbers as last time. Nothing banks today, so we protect the pattern instead of spending it." },
  "RESET": { chip: "LIGHTEN", mean: "Drop the weight a notch and rebuild. Grinding a stall just burns recovery — stepping back is how walls fall." },
  "REBUILD": { chip: "CLIMB BACK", mean: "You just lightened this lift. Climb the reps back up — the old numbers usually fall within three sessions." },
  "STAND-DOWN": { chip: "REST TODAY", mean: "The body alarm is on. Today buys nothing worth its cost — walk, eat, sleep, come back." },
};
/* Fourteen mornings before the readiness gate may act, not five: Tolusso 2022's
   own caveat is that the perceived-recovery relationship is individual, so the
   personal reference has to be real before a rule is allowed to fire off it. The
   trigger is the lower quartile of his own history rather than a fixed number,
   for the same reason. */
const READY_BASELINE_N = 14, READY_SCALE_MAX = 10;
function readyLowFor(hist) {
  const a = (hist || []).slice().sort((x, y) => x - y);
  if (a.length < READY_BASELINE_N) return -1;
  return a[Math.floor(a.length * 0.25)];
}
/* THE DESK CHARTER: maximize muscle retained per unit of recovery while the
   deficit does the cutting. Precision = named inputs with receipts, each gated
   on its own n — never a composite score.

   "Strike for records only in green windows" used to be the third clause. It is
   deleted: it was the clean-sleep gate stated as principle, and GOALS.md is
   explicit that design authority comes from research and his data, never from
   the app's own constitution. A record is a rep line that clears his measured
   noise (see beatsNoise) and repeats. The window it lands in is not evidence. */
function liftCall(s, exId, opts = {}) {
  const tISO3 = isoOf(todayStart());
  const R2 = [];
  const all = Object.keys(s.sessionLog).sort().map((d) => { const sl0 = s.sessionLog[d]; const e = (sl0.entries || []).find((x) => x.id === exId); return e ? { d, tot: (e.reps || []).reduce((a, b) => a + b, 0), rir: e.rir, w: e.w, rushed: paceRushed(sl0), debt: !cleanAtDate(s, d) } : null; }).filter(Boolean);
  const hist = all.slice(-5);
  if (hist.length < 2) return { verdict: "PUSH", vel: null, n: hist.length, why: "New lift — just chase reps and build the story.", receipts: ["Only " + hist.length + " session" + (hist.length === 1 ? "" : "s") + " on file — two more and the desk starts reading your trend."] };
  const clean = hist.filter((h) => !dayWeather(s, h.d).hard);
  const vel = clean.length >= 2 ? +(((clean[clean.length - 1].tot - clean[0].tot) / (clean.length - 1)).toFixed(1)) : null;
  if (vel != null) R2.push(vel > 0.2 ? `You are gaining about ${vel} reps per session lately (last ${clean.length} normal days).` : vel < -0.2 ? `You have been slipping about ${Math.abs(vel)} reps per session (last ${clean.length} normal days).` : `Your total reps have been flat across the last ${clean.length} normal days.`);
  /* Stalls are counted over UNRUSHED, UNFLAGGED days only. Three of them lighten
     the bar 5%, and neither a compressed session nor a short-sleep one is
     evidence that the weight is too heavy — see PACE_NOTE and SLEEP_NOTE.

     This is where the sleep flag now earns its keep. It used to sit on the
     upside, blocking a record from banking; the evidence for that was empty.
     Craven 2022 does establish a real if small performance decrement (-2.85% on
     strength, -9.85% on multi-rep efforts), and the honest use of a known small
     decrement is to stop it being read as a stall — i.e. to protect him from
     being deloaded for a bad night, not to stop him gaining on one.

     Velocity above still uses every non-hard day, because both effects are too
     small to justify discarding the reading. */
  const honest = clean.filter((h) => !h.rushed && !h.debt);
  const rushedN = clean.filter((h) => h.rushed).length;
  const debtN = clean.filter((h) => h.debt && !h.rushed).length;
  let stall = 0;
  for (let i = honest.length - 1; i >= 1; i--) { if (honest[i].tot <= honest[i - 1].tot && (honest[i].rir == null || honest[i].rir <= 2)) stall++; else break; }
  if (stall) R2.push(`${stall} session${stall > 1 ? "s" : ""} in a row without beating your total — honestly fought; party, estimate, rushed and short-sleep days not counted.`);
  if (rushedN) R2.push(`${rushedN} of your last ${clean.length} on this lift ${rushedN === 1 ? "was" : "were"} logged rushed — short rest costs you reps on the back sets, so ${rushedN === 1 ? "it does" : "they do"} not count toward a stall.`);
  if (debtN) R2.push(`${debtN} of your last ${clean.length} ran on short sleep — worth about 2.85% on strength — inside the test-retest error, so it is context for reading the day, not a reason to change it, so ${debtN === 1 ? "it does" : "they do"} not count toward a stall either. ${debtN === 1 ? "It still counts" : "They still count"} for reps, records and every trend on this page.`);
  const slp2 = sleepInfo(s);
  const lastN = s.sleep.nights[s.sleep.nights.length - 1];
  if (lastN) R2.push(`Last night: ${lastN.h} hours` + (lastN.sol != null ? `, took about ${lastN.sol} min to fall asleep.` : "."));
  /* per-lift day-of-week pattern — computed, n-gated at 3 per bucket */
  const dow3 = mk(tISO3).getDay();
  const byDow = all.filter((h) => mk(h.d).getDay() === dow3 && !dayWeather(s, h.d).hard);
  const byOther = all.filter((h) => mk(h.d).getDay() !== dow3 && !dayWeather(s, h.d).hard);
  let dowLag = null;
  if (byDow.length >= 3 && byOther.length >= 3) {
    const m1 = byDow.reduce((a, h) => a + h.tot, 0) / byDow.length, m2 = byOther.reduce((a, h) => a + h.tot, 0) / byOther.length;
    dowLag = +(m1 - m2).toFixed(1);
    if (Math.abs(dowLag) >= 2) R2.push(`${["Sundays","Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays"][dow3]} usually run about ${Math.abs(dowLag)} reps ${dowLag > 0 ? "stronger" : "lighter"} for you on this lift — judge today against that, not your best ever.`);
  }
  /* bedtime scatter — the variance tax's live coefficient, applied when its instrument is armed */
  if (lastN && lastN.bed) {
    const mins3 = (t2) => { const [a3, b3] = t2.split(":").map(Number); let m3 = a3 * 60 + b3; if (m3 < 720) m3 += 1440; return m3; };
    const timed = s.sleep.nights.filter((n) => n.bed).slice(-21);
    if (timed.length >= 8) {
      const med2 = timed.map((n) => mins3(n.bed)).sort((a3, b3) => a3 - b3)[Math.floor(timed.length / 2)];
      const dev = Math.abs(mins3(lastN.bed) - med2);
      if (dev > 45) R2.push(`Bedtime was about ${Math.round(dev / 15) * 15} min off your usual last night — the kind of night the lab is pricing.`);
    }
  }
  /* pulse vs baseline — cut-stress context when both exist */
  const pReads2 = (s.pulse || []).slice(-14);
  const pToday = (s.pulse || []).find((x) => x.d === tISO3);
  if (pReads2.length >= 7 && pToday) {
    const base2 = pReads2.map((x) => x.bpm).sort((a3, b3) => a3 - b3)[Math.floor(pReads2.length / 2)];
    const dp = pToday.bpm - base2;
    if (dp >= 5) R2.push(`Your pulse ran ${dp} beats above normal this morning — your body is still paying for something. Do not spend records on a day like this.`);
  }
  const wx = dayWeather(s, tISO3);
  const postRf = wx.flags.some((f) => f.k === "postrefeed");
  const estToday = wx.est;
  const alarm = opts.alarm !== undefined ? opts.alarm : (typeof bodyAlarm === "function" ? bodyAlarm(s, slp2) : null);
  const ex2 = s.exercises.find((x) => x.id === exId);
  /* verdict ladder — most protective first */
  if (alarm && alarm.level === "RED") return { verdict: "STAND-DOWN", vel, n: clean.length, why: "Body alarm is RED. Skip the iron today — walk, eat, sleep, and come back tomorrow ahead.", receipts: R2.concat(["Body alarm: RED — the pattern held a second day."]) };
  const recentReset = (s.feed || []).slice(0, 60).find((f) => f.t && ex2 && f.t.indexOf("RESET APPLIED — " + ex2.n) === 0 && (mk(tISO3) - mk(f.d)) / DAY <= 14);
  if (recentReset) return { verdict: "REBUILD", vel, n: clean.length, why: `You lightened this on ${fmtShort(recentReset.d)}. Climb the reps back — the old numbers usually fall within three sessions.`, receipts: R2.concat(["Day " + Math.round((mk(tISO3) - mk(recentReset.d)) / DAY) + " of your 14-day climb-back."]) };
  /* A reset must land on a weight the machine can actually make — see
     deloadLoad. Never a number he cannot set on the machine. */
  if (stall >= 3) { const newW = ex2 && typeof ex2.w === "number" ? deloadLoad(ex2) : null; return { verdict: "RESET", vel, n: clean.length, newW, why: `${stall} honest sessions without beating your total. Time to lighten a notch and rebuild — that is how walls fall.`, receipts: R2 }; }
  if (alarm && alarm.level === "AMBER") return { verdict: "HOLD", vel, n: clean.length, why: "Body alarm is AMBER. Normal session, but no all-out sets and no record attempts today.", receipts: R2.concat(["Body alarm: AMBER — off day, not a failure."]) };
  /* ---------- SLEEP_HOLD_NOTE — the verdict that should never have been here ----------
     This used to return HOLD on any short-sleep morning: "repeat last time,
     nothing counts as a record today anyway." It was the last place the retired
     clean-sleep gate still decided what he lifted, and it decided it for every
     lift on the day at once.

     The evidence does not support holding a session on a short night. Craven
     2022's meta-analysis puts sleep restriction at -2.85% on strength — inside
     the test-retest coefficient of variation for these lifts, i.e. smaller than
     the day-to-day noise the app already models at +/-0.8 reps per set. Knowles
     2022 ran nine consecutive nights at 5 h and volume load fell under 1%. Gong
     2024 finds start-of-night restriction indistinguishable from zero (d=-0.25,
     95% CI -0.53 to +0.04). Holding a whole session for an effect that small
     costs real training to avoid a rounding error.

     Sleep still matters more than almost anything here — it is just a NUTRITION
     lever, not a session one. Nedeltcheva 2010: 5.5 h vs 8.5 h at a matched
     deficit shifted 60% more of the loss onto fat-free mass. That belongs on the
     body-composition read and the daily protocol, and it is where it now lives.

     So a short night becomes a RECEIPT — say it, then let him lift. The one
     thing it still buys him is the stall exemption: a bad night's session cannot
     be read as evidence the load is too heavy. */
  if (!slp2.clean) R2.push(`Short night on the books${(slp2.last || {}).h ? ` (${slp2.last.h} h)` : ""} — the reps still count and a record still banks. What it buys you is that today cannot be read as a stall.`);
  {
    const md2 = (a2) => { const b2 = a2.slice().sort((x2, y2) => x2 - y2); return b2.length ? b2[Math.floor(b2.length / 2)] : 0; };
    const mT = todayMeds(s); if (mT && !mT.taken) R2.push("No meds today — effort reads truer; energy may sit lower than usual.");
    const eT = (s.energy || []).find((x) => x.d === tISO3); const eH = (s.energy || []).filter((x) => x.d < tISO3).slice(-14).map((x) => x.v);
    if (eT) R2.push(`Readiness ${eT.v}/10${eH.length >= READY_BASELINE_N ? ` — your usual is ${md2(eH)}` : ` — ${READY_BASELINE_N - eH.length} more mornings before this can gate anything`}.`);
    /* ---------- READINESS_NOTE — the gate that survived, and the one that did not ----------
       The grip gate is gone. Its threshold was 8% below his recent median;
       handgrip's minimal detectable change is about 11% (MDC ~5.5 kg on a ~50 kg
       grip), so the rule fired inside its own noise. Worse, the reference median
       was built on four entries, whose own standard error is ~3.6% — a noisy
       number compared against a noisy anchor. And grip does not measure what it
       was being asked to measure: in the one direct test, 10x10 back squats moved
       leg-extension torque (p=0.03) and jump velocity (p=0.04) while grip did not
       budge (p=0.47). It is a forearm test. It would have flagged him the morning
       after rowing and deadlifting — precisely the wrong signal. He logged it zero
       times, which is its own verdict.

       The subjective gate stays, because it is the one input here with a real
       base. Tolusso et al. 2022, in eleven resistance-trained men doing 8x10 back
       squats with retesting at 24/48/72 h: Perceived Recovery Status correlated
       r = .84 with countermovement jump and r = .80 with mean bar velocity. Saw,
       Main & Gastin's 56-study review found subjective measures track training
       load with better sensitivity and consistency than objective ones.

       Two fixes to it, both from that literature. The scale moves 1-5 to 0-10,
       because on a five-point scale a single step is a 25% jump across the whole
       range and there is no room between "fine" and "flagged". And the baseline
       goes from five mornings to fourteen, because Tolusso's own caveat is that
       the relationship is individual — the same number means different things in
       different people, so the personal reference has to be real before the rule
       may act on it. */
    const eLow = eT && eH.length >= READY_BASELINE_N && eT.v <= readyLowFor(eH);
    if (eLow) return { verdict: "HOLD", vel, n: clean.length,
      why: `Readiness ${eT.v}/10 against your usual ${md2(eH)} — repeat last time rather than chasing. This is the one morning reading that predicts the session: in resistance-trained men it tracks bar velocity at r = .80.`,
      receipts: R2.concat([`Readiness gate: ${eT.v}/10 vs a ${md2(eH)} median across ${eH.length} mornings.`]) };
  }
  if (estToday) return { verdict: "PUSH", vel, n: clean.length, why: "Estimate day — train normally; the numbers just count a little lighter, like you asked.", receipts: R2.concat(["You declared today an estimate day — numbers count, just lighter."]) };
  /* The old line here promised "refeed fuel aboard" as if that were an
     established performance edge. It is not: 11 of 19 acute carbohydrate studies
     found no effect, every study that favoured higher carbs also had higher
     energy intake, and no isocaloric comparison has ever favoured the high-carb
     arm (Henselmans 2022, 49 studies). What survives is the honest half — the
     day after a refeed is a day he is well fed and well slept, which is a fine
     day to try for a record without needing a mechanism story attached. */
  if (postRf && (vel == null || vel >= 0)) return { verdict: "PUSH+", vel, n: clean.length, why: `Green light: fed and slept${vel != null && vel > 0 ? ", and you have been gaining" : ""}. If a record is in you, today is a good day for it.`, receipts: R2.concat(["Yesterday was the refeed. Worth being straight about why that helps: no isocaloric study has ever shown extra carbohydrate improves the next session, so this is not glycogen — it is that you are rested and not hungry."]) };
  if (dowLag != null && dowLag <= -3) return { verdict: "PUSH", vel, n: clean.length, why: `Chase — but this weekday usually runs about ${Math.abs(dowLag)} reps lighter for you here. Beat THAT line and it is a win.`, receipts: R2 };
  if (vel != null && vel <= 0 && stall > 0) return { verdict: "PUSH", vel, n: clean.length, why: `Progress has gone flat here. Chase honestly — one more session without a gain and the desk suggests lightening.`, receipts: R2 };
  return { verdict: "PUSH", vel, n: clean.length, why: `${vel != null && vel > 0.2 ? "You are gaining here — keep chasing." : "Keep chasing."} Weight goes up on its own the day you hit the standard.`, receipts: R2 };
}

/* ---------- PROGRESSION_NOTE — how big the next step should be ----------
   The old rule added exactly +1 rep to one set, every session, forever. Run
   against his real state that produced a median of ~3.5 weeks to a single load
   increase and TEN WEEKS on calves (10,8,7,7 at 320, ceiling 13, needing a flat
   13,13,13,13 before the weight could move). On a 12-20 week prep that is one
   load increase for the whole block. Progressive overload that arrives after
   the block ends is not progressive overload.

   Three things the evidence actually says:

   1. HOW you progress barely matters. Bergamasco et al. 2024 randomised each
      leg of 39 participants to load-progression vs rep-progression for 10
      weeks: 1RM 52.9->69.1 kg vs 51.7->66.8 kg, vastus lateralis CSA
      21.3->23.5 cm2 vs 21.1->23.4 cm2, no statistical difference on either.
      So there is no evidence basis for demanding a maxed flat rep window
      before the load is allowed to move. The RATE is the lever, not the mode.

   2. Proximity to failure has a dose-response with hypertrophy. Refalo et al.'s
      meta-regressions find muscle size increases as sets are terminated closer
      to failure, while strength gains are flat across a wide RIR range. His
      goal is the hypertrophy side. Reps left in reserve are therefore not just
      a safety readout — they are a direct measure of unspent stimulus, and the
      right thing to do with unspent stimulus is spend it.

   3. Self-reported RIR is least accurate far from failure — lifters
      systematically underestimate how many reps they have left. So the step
      scales with reported reserve but is CAPPED: a claimed 3 RIR buys a
      3-rep step across the whole session, never 3 reps on every set. It stays
      inside what he said he had, with room for the estimate to be wrong.

   And two things his own data says:

   - Every opener on file sits at 1 or 2 RIR (median 2, n=28), which is exactly
     what the 2-1-1-0 taper prescribes. So the opener is a weak progression
     signal: it reports compliance, not headroom. The TERMINAL set is the one
     that carries information, which is why it is now logged.
   - A short-sleep session used to become the new baseline, and the next target
     was built by climbing off the dip. That ratchets him down permanently for
     one bad night. Flagged days (debt, rushed) no longer set the anchor. An
     honest decline on a clean, unhurried day still does — that one is real. */
/* ---------- SLEEP_NOTE — why short sleep no longer caps the step ----------
   This branch used to sit first and return a flat +1 on any short-sleep day,
   which meant the RIR branches below it never ran. On this athlete's record
   that was not an edge case: every one of 30 logged entries carried debt, so
   every progression decision he has ever received fell through to a token
   single rep while he was faithfully rating 28 of those 30 sets.

   The evidence does not support the branch either. Craven et al. (2022; 69
   studies, 959 participants) put acute sleep loss at -2.85% on strength — below
   the 1.8-3.3% test-retest CV of a trained lifter (Grgic 2020), i.e. inside the
   measurement noise. The subgroup matching his pattern (late bedtime rather
   than early waking) is -5.85%, 95% CI -13.4 to +1.66, p=0.125 — not
   distinguishable from zero. And no trial has ever tested damping progression
   on low-readiness days against not damping it: the literature on that question
   is empty. Meanwhile RIR autoregulation, which he already supplies, is the one
   readiness method with outcome evidence behind it (Helms 2018, ES 0.48, 72%
   likelihood of benefit; Larsen 2021, ES 0.51-0.64 across 14 studies).

   So RIR now drives the step and sleep stays out of it. Sleep did not vanish
   from the engine — it moved to where it is actually earned: a short-sleep day
   cannot count toward a STALL (three of which lighten the bar 5%), the same
   protection a rushed session already gets. The flag now shields him from being
   punished for a bad night instead of blocking him from gaining on one. */
function progressStep(ex) {
  if (ex.holdFlag) return { add: 0, why: "governor hold — the opener has run hot two sessions straight, so nothing climbs until an honest one lands" };
  const rs = ex.lastMeta ? rirSetsOf(ex.lastMeta) : [];
  const term = rs.length > 1 ? rs[rs.length - 1] : null;
  const open = rs.length ? rs[0] : null;
  if (term != null) {
    if (term >= 3) return { add: 3, why: `you finished the last set with ${term} reps still in the tank, on the set the taper sends to failure — that is unspent stimulus, so the step is real` };
    if (term === 2) return { add: 2, why: "two reps left on the set meant to reach failure — there is room above, and a token single rep would waste it" };
    if (term === 1) return { add: 2, why: "one rep short of failure on the last set — close enough that the next step can be more than a token" };
    return { add: 1, why: "you took the last set to failure exactly as prescribed — one rep is the honest step from there" };
  }
  if (open != null) {
    if (open >= 3) return { add: 2, why: `opener at ${open} RIR and no last-set rating — the opener alone says there was headroom` };
    if (open === 2) return { add: 1, why: "opener at the prescribed 2 RIR, last set unrated — one rep until the terminal set is on file to say otherwise" };
    return { add: 1, why: "opener ran at 1 RIR or hotter — the step holds at one rep" };
  }
  return { add: 1, why: "nothing rated last time, so the step defaults to a single rep — rate the last set and this gets sharper" };
}
/** The per-set line to build from: the last session, unless that session was
 *  flagged, in which case the best unflagged session at this same weight. */
function progressAnchor(ex, s) {
  const base = (ex.last || []).slice();
  if (!s || !base.length) return base;
  /* The anchor is the best RECENT session at this same load, not the most
     recent one. The old version only reached for a better line when the last
     session was sleep-flagged, and required the replacement to come from a
     sleep-clean day — on a record with no clean days at all, that made the whole
     mechanism inert while still ratcheting him down off any dip.

     Capacity is what the anchor is trying to estimate, and a single low session
     is the noisiest possible estimate of it: his own set-to-set spread is ±0.75
     reps, so one bad set moves the whole next target. Taking the best of the
     last three sessions at this load is a max-of-three estimator, which is
     biased slightly high and therefore ambitious — the correct direction of
     error when the cost of an over-ambitious target is one missed rep and the
     cost of an under-ambitious one is a block of wasted progression.

     A rushed session still cannot set the line: short rest lowers volume load
     on the later sets by construction, so it is measuring something else. */
  const window = 3;
  const seen = [];
  Object.keys(s.sessionLog || {}).sort().forEach((d) => {
    const sl = s.sessionLog[d];
    if (paceRushed(sl)) return;
    const en = (sl.entries || []).find((x) => x.id === ex.id);
    if (!en || !en.reps || !en.reps.length || String(en.w) !== String(ex.w)) return;
    seen.push(en.reps);
  });
  const recent = seen.slice(-window);
  if (!recent.length) return base;
  const better = [];
  recent.forEach((reps) => reps.forEach((r, i) => { better[i] = Math.max(better[i] ?? 0, Number(r) || 0); }));
  return base.map((r, i) => Math.max(r, better[i] ?? 0));
}
function targetsFor(ex, s) {
  if (ex.std) return ex.std.slice();
  if (ex.reclaim) return ex.reclaim.slice();
  if (!ex.last) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
  const t = progressAnchor(ex, s).slice(0, ex.sets);
  while (t.length < ex.sets) t.push(Math.max(1, (t[t.length - 1] || ex.hi - 2) - 1));
  const { add } = progressStep(ex);
  for (let n = 0; n < add; n++) {
    let idx = -1;
    for (let i = 1; i < t.length; i++) if (t[i] < t[i - 1]) { idx = i; break; }
    if (idx === -1 && t[0] < ex.hi) idx = 0;
    if (idx < 0) break;
    t[idx] = Math.min(ex.hi, t[idx] + 1);
  }
  return t.map((r) => Math.min(ex.hi, r));
}
/* ---------- LOAD RUNGS — what this machine can actually make ----------
   A single `inc` assumes every machine steps evenly. Real ones do not. A Cybex
   cable stack with hang-on attachments makes 80, 82.5, 85, 90, 100; dumbbells
   go up in 5s then jump to 10s at the top; some pin stacks are 15 lb plates
   with a 5 lb adder. Guessing +5 on those either invents a weight that does not
   exist or skips a rung he could have used.

   `steps` is the explicit ladder of loads the machine can produce, in order. It
   is optional: with no ladder the old `inc` behaviour is exactly unchanged, so
   nothing needed a migration. Every load decision — earning up, resetting down,
   forecasting forward — goes through these three helpers, so a machine gets
   described once and the whole engine respects it. */
function loadRungs(ex) {
  const r = Array.isArray(ex && ex.steps) ? ex.steps.map(Number).filter((x) => isFinite(x) && x > 0) : [];
  if (r.length < 2) return null;
  return [...new Set(r)].sort((a, b) => a - b);
}
/** The next load up, or null when there is none — the top of the stack is real. */
function nextLoad(ex, from) {
  const w = Number(from != null ? from : ex.w);
  if (!isFinite(w)) return null;
  const rungs = loadRungs(ex);
  if (rungs) { const up = rungs.find((x) => x > w); return up == null ? null : up; }
  return ex.inc ? +(w + ex.inc).toFixed(2) : null;
}
/** The next load down. Used by RESET, which must never invent a weight either. */
function prevLoad(ex, from) {
  const w = Number(from != null ? from : ex.w);
  if (!isFinite(w)) return null;
  const rungs = loadRungs(ex);
  if (rungs) { const down = rungs.filter((x) => x < w); return down.length ? down[down.length - 1] : null; }
  return ex.inc ? Math.max(ex.inc, +(w - ex.inc).toFixed(2)) : null;
}
/** Snap an arbitrary number to the nearest rung at or below it. */
function snapLoad(ex, w) {
  const rungs = loadRungs(ex);
  if (!rungs) return w;
  const at = rungs.filter((x) => x <= w);
  return at.length ? at[at.length - 1] : rungs[0];
}
/** A deload target that exists. Snapping DOWN to the nearest rung is wrong on a
 *  coarse ladder — 180 on a 150/160/175/180 stack would land at 160, an 11%
 *  drop, when the intent was 5%. So: the rung NEAREST the target, constrained
 *  to be strictly lighter than where he is now. One notch, not a cliff. */
function deloadLoad(ex, pct = 0.95) {
  const w = Number(ex.w);
  if (!isFinite(w)) return null;
  const rungs = loadRungs(ex);
  if (!rungs) return Math.max(5, Math.round((w * pct) / 5) * 5);
  const below = rungs.filter((x) => x < w);
  if (!below.length) return w;
  const want = w * pct;
  return below.reduce((best, x) => (Math.abs(x - want) < Math.abs(best - want) ? x : best), below[below.length - 1]);
}
/** Parse the ladder he types: commas, spaces, newlines all work. */
function parseRungs(text) {
  const r = String(text || "").split(/[^0-9.]+/).map(Number).filter((x) => isFinite(x) && x > 0);
  return r.length >= 2 ? [...new Set(r)].sort((a, b) => a - b) : null;
}

/* The load gate. It used to demand every set at the ceiling — a flat window a
   descending scheme may never reach. Sets fade; that is what sets do. A natural
   one-rep-per-set descent off a ceiling opener is the top of the window, and
   per Bergamasco 2024 there is no reason to hold the load hostage past it. The
   real guards stay exactly where they were: clean sleep, and an opener that is
   not a grind. */
/* ---------- WINDOW_NOTE — the ceiling is arbitrary; the WIDTH is not ----------
   His ceilings were authored per lift: press 9, rows 10, hack 12, calves 13,
   abs 14, lateral 15. I went looking for the physiology that justified varying
   them and there is none. Hypertrophy is indifferent to rep range from roughly
   5 to 30 reps once sets end at a matched distance from failure — Schoenfeld
   2017 (21 studies, all sets to failure) puts high vs low load at ES 0.53 vs
   0.42, p=0.10; Lopez 2021 (28 studies, 747 participants) finds no difference
   across <=8RM, 9-15RM and >15RM, p=0.113-0.469. Fibre type does not rescue the
   idea either: Schoenfeld 2020 found soleus and gastrocnemius grew the same
   regardless of load, which kills the "calves need high reps" rationale
   specifically. And no trial has ever compared rep ranges BY exercise class.

   So the ceilings are not defended as physiology any more. What IS real is
   mechanical, and the app was ignoring it: when the load goes up, reps fall, and
   the window has to be wide enough to catch him. Otherwise he tops out, the
   weight jumps, he lands below the bottom of the window, and the scheme has no
   rule to get him back.

   How far reps fall is answerable. Nuzzo et al. 2024 (Sports Medicine; 952
   reps-to-failure tests, 7,289 individuals, 269 studies, 60% resistance-trained)
   is the best available load-repetition model. Differentiating Epley against
   their anchors gives a mean absolute error of 0.31 reps; Brzycki underestimates
   the cost by about 40% and is not used here:

     reps lost ~ (top_of_window + 30) x step / (load + step)

   Roughly 0.4 reps per 1% of load, in the 6-15 rep range.

   Against his own equipment that produces a clean split. Ten lifts sit at 5% or
   under and lose about a rep — a 10-12 window is fine. Two do not: the rear-delt
   fly is 2.5 lb on 20 (12.5%) and the pronated EZ curl is 5 lb on 40 (12.5%),
   and both cost about 4.7 reps. A window narrower than that is a trap, and it is
   the same trap in both cases — small-muscle exercises with fixed plates.

   The ACSM's 2009 progression stand asks for 2-10% increments, LOWER on
   small-muscle exercises and HIGHER on large ones. His hardware delivers the
   exact inverse: 12.5% on the rear delt, 1.6% on calves. That is not a
   programming error, it is what fixed plates do, and the fix is either a wider
   window or 1.25 lb add-ons.

   Stated plainly because it matters: there is NO published guidance on rep-
   window width in a double-progression scheme. Not in the ACSM stand, not
   anywhere. This derivation is mine, built on their load-rep data. */
function repsLostOnJump(ex) {
  const w = typeof ex.w === "number" ? ex.w : null;
  if (!w || !ex.hi) return null;
  const rungs = loadRungs(ex);
  const nxt = rungs ? rungs.find((x) => x > w) : (ex.inc ? w + ex.inc : null);
  if (nxt == null) return null;
  const step = nxt - w;
  if (!(step > 0)) return null;
  return { step: +step.toFixed(2), pct: +((step / w) * 100).toFixed(1), lost: +((ex.hi + 30) * (step / (w + step))).toFixed(1) };
}
/** The bottom of the rep window: wide enough to catch him after a load jump. */
function windowFor(ex) {
  const r = repsLostOnJump(ex);
  if (!r || !ex.hi) return { lo: Math.max(1, (ex.hi || 8) - 2), hi: ex.hi, derived: false };
  const width = Math.ceil(r.lost) + 1;
  return {
    lo: Math.max(1, ex.hi - width), hi: ex.hi, width, derived: true,
    step: r.step, pct: r.pct, lost: r.lost, tight: r.pct > 10,
    why: `${r.step} lb on ${ex.w} is a ${r.pct}% jump, which costs about ${r.lost} reps — so the window runs ${Math.max(1, ex.hi - width)}-${ex.hi} to catch you on the far side of it.${r.pct > 10 ? ` That is a big jump for a small-muscle lift: the ACSM asks for 2-10% and wants the SMALLER end on exercises like this one. A 1.25 lb add-on would halve it and let the window tighten.` : ""}`,
  };
}
/** Lifts where the plate is too coarse for the muscle — the micro-loading case. */
function coarseLifts(s) {
  return (s.exercises || []).map((e) => ({ e, w: windowFor(e) })).filter((x) => x.w.derived && x.w.tight)
    .map((x) => ({ id: x.e.id, n: x.e.n, w: x.e.w, step: x.w.step, pct: x.w.pct, lost: x.w.lost, hi: x.e.hi, lo: x.w.lo }));
}

function atTopOfWindow(reps, ex) {
  const r = (reps || []).slice(0, ex.sets);
  if (r.length < ex.sets) return false;
  return r[0] >= ex.hi && r.every((x, i) => x >= ex.hi - i);
}

/* pick THE structural change for a session (one per session, hard rule) */
function pickStructural(s, iso, slp) {
  const dt = dayType(iso, s);
  const candidates = s.queue.filter((q) => !q.done && (q.kind === "debut" || q.kind === "unlock") && q.exId && exById(s, q.exId) && exById(s, q.exId).day === dt);
  const passes = candidates.filter((q) => !(q.exId === "hack" && slp.last && slp.last.h < 4.5));
  const main = passes.find((q) => !q.coApproved) || null;
  const riders = passes.filter((q) => q.coApproved && q !== main);
  return { main, riders, deferred: candidates.filter((q) => !passes.includes(q)) };
}

/* generate a full session for any date */
function genSession(s, iso, slp) {
  const dt = dayType(iso, s);
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
    if (e.id === "hack" && e.pendingThird && isDebutNow) { tgt = [...targetsFor(e, s), Math.max(8, e.hi - 3)]; note = "DEBUT — third set banks whatever it gives"; }
    else if (q && q.kind === "debut" && e.last) { tgt = e.last.map((r) => Math.max(6, r - 1)); note = `DEBUT at ${w} — smallest honest jump: expect to keep almost every rep`; }
    else if (q && !e.last) { tgt = targetsFor(e, s); note = e.debutNote || `DEBUT at ${w}`; }
    else { tgt = targetsFor(e, s); note = e.own ? `OWN-IT — ${e.ownNote}` : e.reclaim ? "RECLAIM — the exact standard" : e.ladder ? `set ${e.ladder.set + 1} is the ladder — top of rung ${e.ladder.top}` : e.note; }
    if (e.holdFlag) note = "HELD — opener ran 0 RIR twice · one honest session releases it";
    const live = (() => {
      if (e.holdFlag) return "HELD — one honest opener (RIR ≥1) releases the load";
      if (isDebutNow && q) return `debut at ${w} — log what it gives, zero expectations`;
      if (e.std && e.own) return `${e.std.join(",")} clean owns it — honest opener, controlled every rep`;
      if (e.reclaim) return `reclaim the exact ${e.reclaim.join(",")} — ${e.reclaim.reduce((a, b) => a + b, 0)} honest reps buys the increment`;
      if (e.ladder) return `set ${e.ladder.set + 1} is the money set — ${e.last ? e.last[e.ladder.set] : "?"} → ${e.ladder.top} finishes the rung`;
      return `chase ${tgt.join(",")} — ${progressStep(e).why}`;
    })();
    return { id: e.id, n: e.n, w, tgt, note, isDebutNow, setup: e.setup, live, prev: e.lastMeta };
  });
  return { name: dt === "U" ? "UPPER" : "LOWER", structural: main ? main.t : "none queued — rep progression day", structuralId: main ? main.id : null, riderIds: riders.map((r) => r.id), ex };
}

/* evaluate a completed session — transitions, earns, own-flips, refills */
/* ---------- per-set RIR ----------
   `rir` has always meant the OPENER's reps-in-reserve, and every existing
   consumer reads it that way — the opener is the diagnostic set for whether a
   load is still honest. That stays exactly as it was.

   `rirSets` extends it to an array aligned index-for-index with `reps`, null
   wherever a set was not rated. The opener is mirrored into slot 0, so nothing
   downstream has to change.

   The TERMINAL set is what this adds. The prescription tapers to one failure
   set (2·1·1·0), so whether that last set actually reached failure is the
   question that separates a real working set from junk volume — and it is the
   signal the build-phase volume ramp needs before it can add sets safely.
   Middle sets stay unrated on purpose: they are prescribed and predictable, and
   asking for a tap on every set buys little while costing adherence. */
function buildRirSets(en, n) {
  const len = n != null ? n : ((en && en.reps) || []).length;
  if (!len) return [];
  const arr = new Array(len).fill(null);
  if (len === 1) { arr[0] = en.rirEnd != null ? en.rirEnd : (en.rir != null ? en.rir : null); return arr; }
  if (en.rir != null) arr[0] = en.rir;
  if (en.rirEnd != null) arr[len - 1] = en.rirEnd;
  return arr;
}
/** Per-set RIR for a logged entry, back-filling the opener from legacy `rir`. */
function rirSetsOf(en) {
  if (!en) return [];
  const len = (en.reps || []).length;
  const arr = Array.isArray(en.rirSets) ? en.rirSets.slice(0, len) : [];
  while (arr.length < len) arr.push(null);
  if (len && arr[0] == null && en.rir != null) arr[0] = en.rir;
  return arr;
}
/* ---------- PACE_NOTE — why a session carries a rest tag ----------
   Rest between sets is NOT an independent driver worth its own instrument. The
   2024 Bayesian meta-analysis (9 studies, 19 measurements) puts short vs long
   rest at 0.13 [-0.27, 0.51] for arms and 0.17 [-0.13, 0.43] for thigh — small,
   credible intervals crossing zero — and finds the effect is mediated by
   reductions in VOLUME LOAD, with nothing detectable beyond ~90 s. This app
   already measures volume load directly, set by set. Logging rest to predict
   rep decay would be measuring the cause when the effect is already on file.

   What rest buys that volume load cannot is ATTRIBUTION. When reps fall on the
   later sets, the engine has to decide between two very different worlds: real
   fatigue at this volume (stop adding sets, maybe lighten) or a session he had
   to compress. Same numbers, opposite correct response. `pace` is the flag that
   separates them — the training-side analogue of `debt` for short sleep.

   Scope is deliberately narrow, because the effect is small. A rushed session
   still counts for rep velocity: throwing the day away entirely would cost more
   information than the ~0.15 SMD justifies. It cannot count toward a STALL,
   because three stalls trigger a RESET — lightening the bar 5% — and that is an
   expensive action to take on a day he simply ran out of time.

   The signal was already there in prose. His 2026-07-23 note reads "Had to skip
   pronated today due to time constraints" — and the notes box says outright that
   the engines only read the numbers. This promotes that to something they can. */
const PACE = { rushed: "rushed", normal: "normal" };
/** True when a logged session was compressed — short rest, under ~60-90 s. */
function paceRushed(sl) { return !!sl && sl.pace === PACE.rushed; }

function openerRir(en) { const a = rirSetsOf(en); return a.length ? a[0] : null; }
/** RIR on the set that was programmed to failure. null = not rated, never assumed. */
function terminalRir(en) { const a = rirSetsOf(en); return a.length ? a[a.length - 1] : null; }

/* ---------- NOISE_NOTE — the number the confirmation rule should have used ----------
   The app already refused to promote a new best on the first sighting, which is
   correct. It justified that with sleep, which is not.

   The real justification is measurement error, and it applies every day.
   Mitter et al. (2022; n=24 resistance-trained, sessions a week apart) report
   reps-to-failure at 70-80% 1RM with ICC 0.82-0.86 and a standard error of
   measurement of 0.7-1.1 reps — a standard error of PREDICTION for a single
   future observation of 0.9-1.4 reps. A +1 rep "record" is inside that. It is
   not evidence, on any amount of sleep. Grgic et al. (2020; 32 studies, 1,595
   participants) put trained 1RM test-retest CV at a median 3.3%, so a 5 lb jump
   on a 160 lb machine (3.1%) is inside one standard error too.

   Rather than hard-code the published figure, this measures HIS. Set-wise
   differences between consecutive sessions at an identical load are pooled and
   the standard deviation halved by root-two (the difference of two independent
   observations carries twice the variance). On the ledger as it stands that
   returns 0.75 reps per set across 33 paired sets — the middle of Mitter's
   published range, arrived at from his own record.

   Consequence, and it is the whole point: confirmation now scales with noise
   instead of sleep. A gain inside the noise band waits for a repeat whatever
   the night was; a gain clearly outside it banks immediately, also whatever the
   night was. That is the ACSM two-for-two rule (Ratamess 2009), which is the
   only published precedent for this decision and carries no readiness
   qualifier of any kind. */
const PUBLISHED_SET_SEM = 0.9;
function typicalError(s, exId) {
  const byId = {};
  Object.keys((s && s.sessionLog) || {}).sort().forEach((d) =>
    ((s.sessionLog[d] || {}).entries || []).forEach((e) => { if (e && e.reps && e.reps.length) (byId[e.id] = byId[e.id] || []).push(e); }));
  const pooled = [], mine = [];
  Object.keys(byId).forEach((id) => {
    const rs = byId[id];
    for (let i = 1; i < rs.length; i++) {
      const a = rs[i - 1], b = rs[i];
      if (a.w == null || b.w == null || String(a.w) !== String(b.w) || a.reps.length !== b.reps.length) continue;
      b.reps.forEach((x, j) => { const dlt = (Number(x) || 0) - (Number(a.reps[j]) || 0); pooled.push(dlt); if (id === exId) mine.push(dlt); });
    }
  });
  const sd = (arr) => {
    if (arr.length < 6) return null;
    const m = arr.reduce((a, b) => a + b, 0) / arr.length;
    return Math.sqrt(arr.reduce((a, b) => a + (b - m) * (b - m), 0) / (arr.length - 1)) / Math.SQRT2;
  };
  const own = sd(mine);
  if (own != null && own > 0) return { reps: +own.toFixed(2), n: mine.length, src: "this lift's own repeats" };
  const all = sd(pooled);
  if (all != null && all > 0) return { reps: +all.toFixed(2), n: pooled.length, src: "your lifts pooled" };
  return { reps: PUBLISHED_SET_SEM, n: 0, src: "published (Mitter 2022) until you have repeats on file" };
}
/** Does a session clear the old line by enough to bank on one sighting? */
function beatsNoise(s, exId, reps, prev) {
  const te = typicalError(s, exId);
  if (!prev || !prev.length || !reps || !reps.length) return { clear: false, te, margin: 0, need: 0 };
  const n = Math.min(reps.length, prev.length);
  const margin = reps.slice(0, n).reduce((a, b) => a + (Number(b) || 0), 0) - prev.slice(0, n).reduce((a, b) => a + (Number(b) || 0), 0);
  /* two standard errors of the SESSION total, which grows as root-n across sets */
  const need = +(2 * te.reps * Math.sqrt(n)).toFixed(1);
  return { clear: margin >= need, te, margin, need, n };
}

function completeSession(state, iso, entries, slp, extras = {}) {
  const s = JSON.parse(JSON.stringify(state));
  const lines = [];
  let dipCount = 0;
  const push = (t, how) => lines.push({ t, how });
  const debtTag = slp.clean ? "" : " · short sleep, logged as such";
  const qFind = (pred) => s.queue.find(pred);

  entries.forEach((en) => {
    const ex = exById(s, en.id);
    if (!ex || !en.reps || !en.reps.length) return;
    const r = en.reps.map((x) => Number(x) || 0);
    const q = qFind((x) => x.exId === ex.id && !x.done && (x.kind === "debut" || x.kind === "unlock"));

    const prevMeta = ex.lastMeta;
    if (prevMeta && prevMeta.reps && String(prevMeta.w) === String(en.w) && r.reduce((a, b) => a + b, 0) < prevMeta.reps.reduce((a, b) => a + b, 0)) dipCount++;
    ex.lastMeta = { d: iso, w: en.w, reps: r.slice(), rir: en.rir ?? null, rirSets: buildRirSets(en, r.length), debt: !slp.clean };

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
      /* This IS the confirmation. The standard was written down on a previous
         session; hitting it again is the second independent observation, which
         is the whole statistical content of the rule. Sleep used to be a third
         condition on top of it and is now gone — see NOISE_NOTE. */
      if (hit) {
        ex.own = false; const oldStd = ex.std.join(","); ex.std = null; ex.last = r.slice();
        const oq = qFind((x) => x.exId === ex.id && (x.kind === "own"));
        if (oq) { oq.done = true; oq.state = "OWNED"; }
        if (ex.id === "press") {
          const upP = nextLoad(ex);
          if (upP != null) {
            s.queue.push({ id: "q_press250", kind: "debut", exId: "press", newW: upP, t: `PRESS ${upP} DEBUT`, state: "DEBUT", gate: `Earned by repeating ${ex.w}×${oldStd}`, rule: "Coach flag before it runs — structural queue", done: false });
            push(`PRESS ${ex.w} OWNED`, `${oldStd} repeated — that is the confirmation, so ${upP} enters the queue at coach flag`);
          } else push(`PRESS ${ex.w} OWNED`, `${oldStd} repeated — but ${ex.w} is the top rung this machine makes, so there is nothing to queue`);
        } else if (ex.id === "extension") {
          s.queue.push({ id: "q_ext155", kind: "debut", exId: "extension", newW: ex.w + 5, t: `EXTENSION ${ex.w + 5} — GATE REOPENED`, state: "DEBUT", gate: `Earned this time: ${ex.w}×${oldStd}`, rule: "Queued as a structural change", done: false });
          push(`EXTENSION ${ex.w} RE-OWNED`, `${oldStd} — the ${ex.w + 5} gate reopens, earned`);
        } else push(`${ex.n.toUpperCase()} OWNED`, `${oldStd} repeated — confirmed`);
      } else push(`${ex.n.toUpperCase()} — NOT YET`, `${r.join(",")} · the standard stays ${ex.std.join(",")} · nothing loads`);
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
        const upR = nextLoad(ex) ?? (Number(ex.w) || 0);
        s.queue.push({ id: `q_${ex.id}_inc`, kind: "debut", exId: ex.id, newW: upR, t: `${ex.n.toUpperCase()} ${upR} DEBUT`, state: "DEBUT", gate: `Re-earned ${ex.w}×${std}`, rule: "Increment unlocked — queued as a structural change", done: false });
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
    const atTop = atTopOfWindow(r, ex);
    ex.last = r.slice();
    const upNext = typeof ex.w === "number" ? nextLoad(ex) : null;
    if (atTop && typeof ex.w === "number" && upNext != null) {
      const already = s.queue.some((x) => x.exId === ex.id && !x.done && x.kind === "debut");
      /* Two-for-two, from measurement error rather than sleep. Topping the rep
         window once at a given load can be a good day: Mitter 2022 puts a single
         set's prediction error at 0.9-1.4 reps, and his own repeats put it at
         0.75, so the last rep of a window is routinely inside the noise. Two
         sightings at the same load is the ACSM rule (Ratamess 2009) and is the
         only published precedent — applied there, as here, with no readiness
         qualifier. The escape hatch is size: a session that clears the previous
         line by two standard errors of the session total is not a good day, it
         is a different capacity, and it banks on the spot. */
      const topRun = String(ex.topAt) === String(ex.w) ? (ex.topRun || 0) + 1 : 1;
      ex.topAt = ex.w; ex.topRun = topRun;
      const bn = beatsNoise(s, ex.id, r, (prevMeta && String(prevMeta.w) === String(en.w) && prevMeta.reps) || null);
      const confirmed = topRun >= 2 || bn.clear;
      if (en.rir === 0 || ex.holdFlag) {
        if (!already) push(`${ex.n.toUpperCase()} — TOP OF WINDOW, BUT HOT`, `${r.join(",")} at RIR 0 — a grind is not an earn; repeat it honest and the load queues itself`);
      } else if (confirmed && !already) {
        ex.topRun = 0; ex.topAt = null;
        const how = bn.clear && topRun < 2
          ? `${ex.w}×${r.join(",")} — ${bn.margin} reps clear of last time, and two standard errors of your own measured spread is ${bn.need}. That is outside the noise, so it banks on one sighting.`
          : `${ex.w}×${r.join(",")} — second session at the top of the window at this load. One is inside your ±${(typicalError(s, ex.id).reps).toFixed(2)}-rep spread; two is not.`;
        s.queue.push({ id: `q_${ex.id}_${upNext}`, kind: "debut", exId: ex.id, newW: upNext, t: `${ex.n.toUpperCase()} ${upNext} DEBUT`, state: "DEBUT", gate: `Earned via ${ex.w}×${r.join(",")}`, rule: "Auto-queued — runs when it wins the structural slot", done: false });
        push(`${ex.n.toUpperCase()} ${upNext} EARNED`, how + (loadRungs(ex) ? " Next rung this machine makes." : ""));
      } else if (!already) {
        const te = typicalError(s, ex.id);
        push(`${ex.n.toUpperCase()} — TOP OF WINDOW, PROVISIONAL`, `${r.join(",")} tops the window${bn.margin > 0 ? `, ${bn.margin} rep${bn.margin === 1 ? "" : "s"} up on last time` : ""} — but your own set-to-set spread is ±${te.reps.toFixed(2)} reps (${te.src}), so one sighting cannot be told apart from a good day. Repeat it and the load queues itself. Sleep does not enter into it.`);
      }
    } else {
      if (typeof ex.w === "number" && String(ex.topAt) === String(ex.w)) { ex.topRun = 0; }
      if (tgtMet) push(`${ex.n.toUpperCase()} — TARGET MET`, `${en.w} × ${r.join(",")}`);
    }

    /* rows special: establish → earn 185 via 10,10 handled by generic atTop (hi=10) */

    /* hot opener heuristic */
    if (en.tgt && en.tgt.length >= 2 && r[0] > en.tgt[0] + 1 && (r[en.tgt.length - 1] ?? 0) < en.tgt[en.tgt.length - 1] - 1)
      push(`${ex.n.toUpperCase()} — HOT OPENER?`, `set 1 ran ${r[0]} vs ${en.tgt[0]} and the tail gave it back`);
  });

  const niggles = extras.niggles || [];
  /* `pace` — see PACE_NOTE. Written on every session from here on; deliberately
     NOT back-filled onto older ones, because there is nothing to back-fill and
     law 12 forbids a field that buys no attribution. Absent reads as unknown. */
  s.sessionLog[iso] = { entries: entries.map((e) => { const ex2 = s.exercises.find((x) => x.id === e.id); return { id: e.id, reps: e.reps, rir: e.rir ?? null, rirSets: buildRirSets(e), w: ex2 && typeof ex2.w === "number" ? ex2.w : null }; }), at: Date.now(), note: extras.note || "", niggles, dips: dipCount, skipped: extras.skipped || [], pace: extras.pace === "rushed" || extras.pace === "normal" ? extras.pace : null };
  if (extras.pace === "rushed") push("RUSHED SESSION — LOGGED AS SUCH", "reps still count; this day cannot count toward a stall, because short rest lowers volume load on the later sets");
  if ((extras.skipped || []).length) push("SKIPPED — " + extras.skipped.map((k) => { const ex3 = exById(s, k.id); return ex3 ? ex3.n : k.id; }).join(", "), "your call, on the record — zero phantom reps, nothing counted");
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
/* ---------- DRIP_NOTE — the worst number this app ever contained ----------
   `drip` was +0.3 lb/wk: an assumption that a lean, multi-year-trained male
   GAINS lean mass while running a 600 kcal/day deficit. It was hardcoded, never
   verified, and load-bearing in three places at once — the body-fat estimate,
   the maintenance calculation, and every forecast.

   It is not optimistic. It is the wrong sign, and the app's own arithmetic says
   so without needing a single citation:

     maintenance 2,631 − intake 2,021 = 610 kcal/day = 4,270 kcal/week
     against 0.97 lb/week of scale loss = 4,402 kcal per pound
     pure body fat is 4,282 kcal/lb (Hall 2008)

   The app was claiming he liberated more energy per pound than lipid contains.
   That is only possible if lean mass genuinely rose.

   It did not. Every study matched to this population shows lean flat to falling:
   Roth, Schoenfeld & Behringer 2022 (EJAP) — trained males, 14.9% body fat, 6.0
   years trained, 3.06 g/kg FFM protein, essentially this athlete — median
   −0.11 lb/wk, mean −0.34. Roth et al. 2023 (Scand J Med Sci Sports, n=38
   resistance-trained males at 2.8 g/kg FFM) lost 0.5–0.9 kg of lean in six
   weeks. Murphy & Koehler 2022's meta-regression puts the deficit at which lean
   gains stop at ~500 kcal/day; he runs 610. And Forbes' partitioning (Hall 2007)
   says at his 11 kg of fat mass the untreated baseline is 49% of loss coming
   off fat-free mass — leanness is a headwind here, not a tailwind.

   The two studies that DO show gains are the two that do not describe him:
   Longland 2016 (overweight, explicitly untrained, 4 weeks of a novel stimulus)
   and Garthe 2011's slow arm (elite athletes newly added to a strength
   programme, 1.6 g/kg protein, n≈6 men). Taking +0.3 from those is applying the
   upper tail of the wrong population.

   What it cost him: body fat understated 1.3–2.7 percentage points and drifting
   a further 0.2–0.4 pp per week; maintenance overstated ~100 kcal/day; the ETA
   to 10% reading 6.7 weeks against an honest ~11.5. And worst — because it told
   him he was gaining muscle anyway, it made the 610 kcal/day deficit look free,
   which is exactly the deficit the evidence says costs him lean tissue. A wrong
   constant that argues for the behaviour that makes it wronger.

   Now 0.0, with the band the evidence supports, and body fat is reported as a
   RANGE that widens with distance from the last real measurement — because an
   anchor from a coach's eye carries ±3–4 points that never wash out, and open-
   loop integration of an unverified constant off an unverified initial
   condition is the one thing a model must not do quietly. */
const DRIP_DEFAULT = 0.0;
const DRIP_LO = -0.35, DRIP_HI = 0.10;
const KCAL_PER_LB_FAT = 4282;   /* Hall 2008: 39.5 MJ/kg */
const KCAL_PER_LB_MIX = 3800;   /* ~87% fat for a lean, high-protein, training male */
const ANCHOR_ERR_EYE = 3.5, ANCHOR_ERR_DEXA = 1.0;
function dripOf(s) { const d = s && s.model ? s.model.drip : null; return d == null ? DRIP_DEFAULT : d; }
function bfEst(s, trend = s.trend, atISO = isoOf(todayStart())) {
  const wks = Math.max(0, weeksBetween(s.model.anchorISO, atISO));
  const drip = dripOf(s);
  const lean = s.model.lean + drip * wks;
  const pct = +(((trend - lean) / trend) * 100).toFixed(1);
  /* The band. Two independent sources of error, neither of which shrinks with
     time: the anchor's own accuracy, and the unknown lean trajectory since. */
  const anchorErr = s.model.src === "DEXA" ? ANCHOR_ERR_DEXA : ANCHOR_ERR_EYE;
  const fromLean = (l) => ((trend - l) / trend) * 100;
  const lo = +(fromLean(s.model.lean + DRIP_HI * wks) - anchorErr).toFixed(1);
  const hi = +(fromLean(s.model.lean + DRIP_LO * wks) + anchorErr).toFixed(1);
  return {
    pct, lean: +lean.toFixed(1), lo, hi, wks: +wks.toFixed(1), anchorErr, src: s.model.src, drip,
    why: `Anchored ${wks < 1 ? "today" : `${Math.round(wks)} week${Math.round(wks) === 1 ? "" : "s"} ago`} by ${s.model.src === "DEXA" ? "DEXA (±1 point)" : "your coach's eye (±3–4 points, and that error never washes out)"}. Lean mass since then is assumed flat — the evidence for a trained lean male in a deficit is −0.11 lb/wk median, and nothing in this app can measure it. The band is that uncertainty made visible rather than hidden behind a decimal.`,
  };
}

/* ---------- PROTEIN_NOTE — why the number is no longer a constant ----------
   175 g was hard-coded. The current best evidence scales protein to FAT-FREE
   MASS, not bodyweight, and says so with numbers: Refalo, Trexler & Helms
   (2025) meta-regressed 29 studies / 729 participants and found the per-FFM
   model's interval EXCLUDES zero (b = 0.06 [0.01, 0.12], 99% probability of
   direction) while the per-bodyweight model's does not (b = 0.07 [-0.01, 0.14]).
   Scaling to lean mass is therefore the better-supported unit, not a preference.

   Two numbers matter. 2.5 g/kg FFM is where the trend line crosses zero — the
   floor below which protein stops reliably protecting lean mass. And the
   sub-group with the LARGEST coefficient is lean males under 12.2% body fat
   (b = 0.12, 94% probability) — leaner means more return per gram, which is the
   opposite of the intuition that a smaller person needs less.

   So: the floor tracks his measured lean mass, and crossing 12.2% body fat
   steps the target up, because that is where his own subgroup's evidence gets
   stronger. It never drops below the house number he already runs. */
const PROTEIN_FLOOR_G_PER_KG = 2.5;
const PROTEIN_LEAN_G_PER_KG = 3.0;
const LEAN_SUBGROUP_BF = 12.2;
function proteinTarget(s) {
  const bf = bfEst(s);
  const ffmKg = bf.lean / 2.2046;
  /* ---------- PROTEIN_BAND_NOTE — a knife-edge threshold on a number with
     three and a half points of error ----------
     inLeanSubgroup used to be a hard test of the POINT estimate against 12.2%.
     His body-fat read is 15% with an honest interval of 11.4–18.7 — the
     threshold sits INSIDE his own confidence band. So a single decimal of drift
     in a coach's-eye anchor would swing the target thirty grams, and the app
     would state either number with the same flat confidence. That is a hard
     seal on a noisy reading, which is precisely what the charter forbids.

     Soft design instead: when the band straddles the line, carry BOTH numbers
     as a range rather than picking one and hiding the coin-flip. The floor is
     the evidence-backed line either way — the deficit meta-regression's trend
     crosses zero net lean-mass change at 2.5 g/kg FFM. The top of the range is
     the lean-subgroup coefficient, which applies if he is at the low end of his
     own interval. Anywhere in between is defensible; below the floor is not. */
  const straddles = bf.lo <= LEAN_SUBGROUP_BF && bf.hi >= LEAN_SUBGROUP_BF;
  const inLeanSubgroup = bf.hi <= LEAN_SUBGROUP_BF;
  const perKg = inLeanSubgroup ? PROTEIN_LEAN_G_PER_KG : PROTEIN_FLOOR_G_PER_KG;
  const evidence = Math.round((ffmKg * perKg) / 5) * 5;
  const floor = Math.round(ffmKg * PROTEIN_FLOOR_G_PER_KG);
  const hi = Math.round((ffmKg * PROTEIN_LEAN_G_PER_KG) / 5) * 5;
  /* ---------- PROTEIN_CONST_NOTE — the authored 175 finally leaves ----------
     This read Math.max(PROTEIN, evidence), where PROTEIN was a hardcoded 175.
     That is the exact failure the rest of this file spent the session removing:
     a derived number wearing a constant as a floor, so the constant kept
     winning whenever the evidence sat below it and nothing ever recalculated.
     It also meant the card DISPLAYED the derived figure while the fix-window
     logic JUDGED against 175 — the app showing one number and testing another.

     There is no evidence for 175 specifically. The deficit meta-regression's
     trend line crosses zero net lean-mass change at 2.5 g/kg FFM, and the lean
     subgroup coefficient roughly doubles under ~12.2% body fat. Both of those
     are per-kg-of-HIS-lean-mass numbers, and both are already computed above.
     The target is now whichever of those two the evidence points at, rounded to
     something a person can actually hit. If his lean mass moves, so does it. */
  const lo = Math.max(Math.round(floor / 5) * 5, evidence);
  /* When the band straddles, the headline number is the middle of the defended
     range, not either end. Quoting the top would tell him to eat thirty grams
     more on the strength of a coin-flip; quoting the bottom would quietly drop
     his target on the same coin-flip. The midpoint is the standard estimator
     when you know the interval and not the point — and the range is printed
     next to it, so the width is visible rather than implied. */
  const g = straddles ? Math.round(((lo + hi) / 2) / 5) * 5 : lo;
  return {
    g, lo, hi: Math.max(lo, hi), floor, perKg, inLeanSubgroup, straddles,
    ffmKg: +ffmKg.toFixed(1), bf: bf.pct, bfLo: bf.lo, bfHi: bf.hi,
    why: inLeanSubgroup
      ? `${perKg} g per kg of your ${(+ffmKg.toFixed(1))} kg lean mass — under ${LEAN_SUBGROUP_BF}% body fat the measured return per gram is at its largest (the per-FFM coefficient roughly doubles), so the target steps up rather than down`
      : straddles
      /* The honest version of "we do not know which side of the line you are
         on." Say the range and say why it is a range, rather than quoting one
         end with false confidence. */
      ? `${lo}–${Math.max(lo, hi)} g, and the range is the point. ${lo} g is ${PROTEIN_FLOOR_G_PER_KG} g per kg of your ${(+ffmKg.toFixed(1))} kg lean mass — the line where the deficit meta-regression's trend crosses zero net lean-mass change. ${Math.max(lo, hi)} g is the lean-subgroup number, which applies below ${LEAN_SUBGROUP_BF}% body fat. Your body-fat read is ${bf.pct}% with an honest spread of ${bf.lo}–${bf.hi}%, so the threshold sits inside your own error bars and nobody can say which side you are on. Anywhere in the range is defended; under ${floor} g is not. It does not rise on training days — the one study that compared day types found requirement higher on REST days`
      /* Say plainly that this is ONE number, held every day, and why it does not
         move: the only direct training-day-vs-rest-day comparison (Moore 2024,
         indicator amino acid oxidation) found requirement HIGHER on the rest day,
         and no study has ever tested raising protein on a short-sleep day. */
      : `Same number every day — ${g} g, which is ${(+(g / ffmKg).toFixed(2))} g per kg of your ${(+ffmKg.toFixed(1))} kg lean mass. The deficit meta-regression's trend line crosses zero net lean-mass change at ${PROTEIN_FLOOR_G_PER_KG} g/kg (${floor} g for you), so you sit clear of it. It does not rise on training days: the one study that compared day types found requirement higher on REST days, not lower`,
  };
}
/* ---------- PROTEIN_HIT_NOTE — protein is a floor, not a bullseye ----------
   Every caller used to ask Math.abs(logged - 175) <= 10, which counts eating
   MORE protein than the target as a miss. Nothing in the literature supports
   that. The meta-regression identifies a lower threshold below which lean-mass
   loss rises; there is no upper threshold anywhere near this range, and the
   only real cost of overshoot is that protein calories displace carbohydrate
   inside a fixed budget — a note, not a failure.

   The symmetric band was invisible while the target sat at 175, because that is
   roughly where he eats. The moment the target became derived it would have
   retroactively reclassified 25 of his 44 logged days from hit to miss, days he
   ate 175–186 g — the app inventing a compliance problem out of arithmetic.
   So the test is: at or above the floor, with a small tolerance for the fact
   that nobody weighs food to the gram. */
/* The tolerance is ZERO on a floor. It was carried over from the symmetric
   band, where +/-10 was a food-scale allowance either side of a bullseye — but
   subtracting it from a floor just moves the floor and creates a third number.
   The app was saying "under 158 is not defended" and "anywhere 160-190 counts"
   while actually passing anything at or above 150. One number now. */
const PROTEIN_TOL_G = 0;
function proteinHit(target, g) { return g != null && g >= target - PROTEIN_TOL_G; }

/* ---------- STEP_NOTE — why the step target is now his own number ----------
   16-17k was authored, not derived, and nothing recalculated it. Two problems
   with a fixed step target, one arithmetic and one evidential.

   The arithmetic one is the important one. His measured maintenance is measured
   AT a step count. Walking is a large share of his daily expenditure — about 370
   kcal above a sedentary baseline at 16.5k — so the TDEE the calorie target is
   derived from is only valid while the walking that produced it continues. Drift
   down 3,000 steps and maintenance drifts down with it by roughly 90 kcal, and
   the calorie band silently becomes 90 kcal too generous. He HAS drifted: the
   last fourteen logged days average 15,657 against a June average of 18,924.
   The target therefore anchors to the window the maintenance figure came from,
   and says what a deviation costs, rather than naming a round number.

   The evidential one: there is no trial of a step prescription in lean trained
   people in a deficit — the step-target RCT literature is sedentary and
   overweight populations. What there IS: no concurrent-training meta-analysis
   has ever included a walking arm (Schumann 2022, 43 studies, hypertrophy SMD
   -0.01, 95% CI -0.16 to 0.18, modality non-significant), so the interference
   case against walking is a plausibility argument with nothing behind it; and
   walking economy improves under a prescribed programme (Knaan 2026), so the
   same target buys fewer calories in month four than in week one.

   So this is a band, not a point, with a floor — and when energy availability
   needs to rise, the app names food first and steps second, because the
   trained-population evidence links lean-mass loss to deficit magnitude
   (Murphy & Koehler 2022) and has nothing at all against walking. */
function stepTarget(s) {
  const cutoff = isoOf(new Date(todayStart().getTime() - 21 * DAY));
  /* SORTED, not insertion-ordered. dailyLogs is a plain object and its key order
     is whatever the writes happened to be; taking .slice(-7) off that gave the
     oldest seven days on a state written newest-first, which flipped the sign of
     the drift. A test caught it, which is the only reason this comment exists. */
  const rows = Object.entries(s.dailyLogs || {}).filter(([d, v]) => d >= cutoff && v && v.steps != null)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, v]) => v.steps);
  const bwKg = s.trend / 2.2046;
  const kcalPer1k = +(EA_KCAL_PER_1K_STEPS_PER_KG * bwKg).toFixed(1);
  if (rows.length < 8) return { gated: true, have: rows.length, need: 8, kcalPer1k, why: `${rows.length} of 8 logged step days — until then the target stays as written.` };
  const avg = rows.reduce((a, b) => a + b, 0) / rows.length;
  const r5 = (x) => Math.round(x / 500) * 500;
  const mid = r5(avg);
  const lo = r5(avg - 1000), hi = r5(avg + 1000);
  const recent = rows.slice(-7);
  const recentAvg = recent.length >= 5 ? recent.reduce((a, b) => a + b, 0) / recent.length : null;
  const drift = recentAvg != null ? Math.round(recentAvg - avg) : 0;
  const driftKcal = Math.round((drift / 1000) * kcalPer1k);
  return {
    gated: false, lo, hi, mid, days: rows.length, kcalPer1k, avg: Math.round(avg),
    recentAvg: recentAvg == null ? null : Math.round(recentAvg), drift, driftKcal,
    why: `Your measured maintenance was measured across ${rows.length} days averaging ${Math.round(avg).toLocaleString()} steps — so the calorie band is only right while the walking that produced it continues. Every 1,000 steps is worth about ${kcalPer1k} kcal at your bodyweight.${Math.abs(driftKcal) >= 40 ? ` Your last week runs ${drift > 0 ? "+" : ""}${drift.toLocaleString()} against that, which is about ${driftKcal > 0 ? "+" : ""}${driftKcal} kcal/day of maintenance the target has not caught up with yet.` : ""}`,
  };
}

/* ---------- RATE_NOTE — one rate, and it stops changing its mind ----------
   This used to be the mean of the last TWO weekly snapshots. Two points, each
   of which is already a damped average, is the noisiest estimator available.
   On his real record the weekly rates run 1.80, 0.80, 0.20, 0.40, 1.80, 1.30 —
   and the answer you get depends entirely on the method you pick:

     mean of last 2 weekly    1.55 lb/wk
     mean of last 3 weekly    1.17
     regression, 28 days      0.97
     regression, 14 days      1.73

   A 0.8 lb/wk spread on the number the entire calorie prescription hangs off.
   Worse, it fed observedTDEE, which then reported "measured" TDEEs 160 kcal
   apart depending on where a Monday happened to fall.

   So the rate is now a least-squares slope across the daily reads themselves.
   More points, and it does not care where a week boundary lands. It carries
   its own standard error, so the uncertainty is shown rather than implied, and
   it keeps the snapshot rates alongside so the disagreement between methods is
   visible instead of quietly resolved in the estimator's favour. Below ten
   unsealed reads it falls back to snapshots, and below two of those to a
   labelled prior. */
function currentRate(s) {
  const w = s.weekly || [];
  const rates = [];
  for (let i = 1; i < w.length; i++) rates.push((w[i - 1].trend - w[i].trend) / Math.max(0.5, weeksBetween(w[i - 1].wk, w[i].wk)));
  const reads = (s.reads || []).filter((r) => !r.sealed && r.w != null).slice(-28);
  if (reads.length >= 10) {
    const t0 = mk(reads[0].d).getTime();
    const xs = reads.map((r) => (mk(r.d).getTime() - t0) / DAY), ys = reads.map((r) => r.w);
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
    if (sxx > 0) {
      const slope = sxy / sxx;
      let sse = 0;
      for (let i = 0; i < n; i++) { const fit = my + slope * (xs[i] - mx); sse += (ys[i] - fit) ** 2; }
      const se = n > 2 && sxx > 0 ? Math.sqrt(sse / (n - 2) / sxx) : 0;
      const scale = +(-slope * 7).toFixed(2);
      const ci = +(1.96 * se * 7).toFixed(2);
      return {
        scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates,
        method: "regression", n, ci, lo: +(scale - ci).toFixed(2), hi: +(scale + ci).toFixed(2),
        /* the endpoints, not just the printable span — observedTDEE has to
           average intake over exactly this period or the arithmetic is wrong */
        from: reads[0].d, to: reads[n - 1].d,
        span: `${reads[0].d} → ${reads[n - 1].d}`,
      };
    }
  }
  if (rates.length >= 2) {
    const recent = rates.slice(-2);
    const scale = +(recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(2);
    return { scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates, method: "snapshots", n: recent.length, ci: null };
  }
  return { scale: 1.0, fat: 1.25, measured: false, rates, method: "prior", n: 0, ci: null };
}

const cap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);
/* recovery signals — named, individually gated, each with a receipt and a fix */
function recoveryIndex(s) {
  /* ---------- RECOVERY_NOTE ----------
     This used to hand back "45/100" as a headline. The app's own charter says
     precision means named inputs with receipts, each gated on its own n, and
     NEVER a composite score — so the headline was breaking the rule the rest of
     the engine keeps. Worse, the weights behind it (−10, −20, −21, −15) have no
     evidence behind them at all; readiness indices of this kind are widely used
     and poorly validated, and a single number hides which input moved.

     So the unit is now a FLAG: a named signal, individually gated, carrying the
     receipt that raised it and the specific thing that clears it. The count of
     flags is what gets shown, because a count of named things is an
     enumeration, not an index. `score` survives only to drive the old bar.

     One correctness fix while here: rep dips on a short-sleep or rushed session
     are not evidence of poor recovery — the sleep flag already accounts for the
     first, and a compressed session lowers reps by itself. Counting them again
     double-charged him for one bad night. Same rule the stall counter uses. */
  const flags = [];
  const add = (k, receipt, fix, cost) => flags.push({ k, receipt, fix, cost });
  const slp = sleepInfo(s);
  if (!slp.clean) add("sleep", `sleep reset — ${slp.run} of ${s.sleep.needed} clean nights`, `${s.sleep.needed - slp.run} more night${s.sleep.needed - slp.run === 1 ? "" : "s"} at ${s.sleep.cleanH} h or better, back to back`, Math.min(3, s.sleep.needed - slp.run) * 10);
  const last5 = s.sleep.nights.slice(-5).map((n) => n.h);
  /* two decimals, because 6.96 rounded to one reads "7.0 h — under 7" and looks
     like the app cannot do arithmetic. A receipt that looks wrong is not a receipt. */
  if (last5.length === 5 && last5.reduce((a, b) => a + b, 0) / 5 < 7) add("avg5", `five-night average is ${(last5.reduce((a, b) => a + b, 0) / 5).toFixed(2)} h — under 7`, "this one is chronic, not last night — it needs a week of earlier lights-out, not one long lie-in", 10);
  const holds = s.exercises.filter((e) => e.holdFlag);
  if (holds.length) add("held", `${holds.length} lift${holds.length > 1 ? "s" : ""} held by the governor: ${holds.map((e) => e.n).join(", ")}`, "one honest opener at 1 RIR or better on each releases it — the load is not lost, just parked", Math.min(20, holds.length * 10));
  const rirs = [];
  Object.keys(s.sessionLog).sort().slice(-3).forEach((d) => (s.sessionLog[d].entries || []).forEach((e) => { if (e.rir != null) rirs.push(e.rir); }));
  if (rirs.length >= 4 && rirs.filter((x) => x === 0).length / rirs.length >= 0.5) add("hot", `${rirs.filter((x) => x === 0).length} of your last ${rirs.length} openers ground out at 0 RIR`, "the taper asks for 2 on the opener, not 0 — back the first set off and let the LAST set be the one that goes to failure", 10);
  const cutoff = isoOf(new Date(todayStart().getTime() - 14 * DAY));
  let ng = 0;
  Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cutoff) ng += (sl.niggles || []).length; });
  if (ng) add("joints", `${ng} joint flag${ng > 1 ? "s" : ""} in the last 14 days`, "three of the same joint in three weeks and it goes to your coach as a pattern rather than a day", Math.min(21, ng * 7));
  /* dips, counted only on days that were a fair test */
  const recent = Object.keys(s.sessionLog).sort().slice(-2);
  const fairDips = recent.reduce((a, d) => {
    const sl = s.sessionLog[d];
    if (paceRushed(sl) || !cleanAtDate(s, d)) return a;
    return a + (sl.dips || 0);
  }, 0);
  const excluded = recent.reduce((a, d) => a + (paceRushed(s.sessionLog[d]) || !cleanAtDate(s, d) ? (s.sessionLog[d].dips || 0) : 0), 0);
  if (fairDips) add("dips", `${fairDips} rep dip${fairDips > 1 ? "s" : ""} across your last two sessions, on days that were a fair test`, "one session that beats its own previous totals clears this", Math.min(15, fairDips * 5));
  /* Energy availability belongs here too. It is the only flag on this card that
     is about the DEFICIT rather than about training or sleep, and it is the one
     with a published male threshold attached — see ENERGY_AVAILABILITY. */
  const eaR = energyAvailability(s);
  if (!eaR.gated && eaR.hi < EA_SPARING) {
    add("ea", `energy availability ${eaR.lo}–${eaR.hi} kcal per kg lean — under the ${EA_SPARING} where a lean male spares muscle`,
      eaR.stepsToDrop ? `eat ~${eaR.needKcal} more or walk ~${eaR.stepsToDrop.toLocaleString()} fewer steps — the steps are the cheaper half to give back` : `close a ~${eaR.needKcal} kcal/day gap`,
      eaR.lo < EA_LOW ? 25 : 15);
  }
  const score = Math.max(0, Math.round(100 - flags.reduce((a, f) => a + f.cost, 0)));
  const lever = flags.slice().sort((a, b) => b.cost - a.cost)[0] || null;
  return {
    score, band: score >= 80 ? "GREEN" : score >= 55 ? "WATCH" : "LOW",
    flags, lever, watched: 7, excludedDips: excluded,
    factors: flags.map((f) => f.receipt),
  };
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
  const ydl9 = (s.dailyLogs || {})[isoOf(new Date(mk(iso).getTime() - DAY))] || {};
  const water9 = ydl9.sodium === "high" || (ydl9.alc || 0) > 0 ? "salt or alcohol yesterday — water noise likely" : "";
  const base9 = sealed ? "sealed — excluded from trend" : spike ? "spike — damped in trend" : nf && Math.abs(dRaw) <= nf ? "inside your noise — not information" : "";
  s.reads.push({ d: iso, w, sealed, pt: s.trend, note: water9 && base9 ? water9 + " · " + base9 : water9 || base9 });
  if (!sealed) s.trend = +(s.trend + 0.3 * dCl).toFixed(1);
  return s;
}

/* observed maintenance — your own intake and measured rate are the only honest calculator */
function observedTDEE(s) {
  if (daysUntil(s.blackout.until) > 0) return null;
  const r = currentRate(s);
  if (!r.measured) return null;
  /* ---------- WINDOW_NOTE — the two halves of this sum must be the same period ----------
     Maintenance is (mean intake) + (weight lost x 3500 / days). Both terms have
     to come from the SAME stretch of calendar or the identity does not hold, and
     they did not: the rate ran a 28-read regression across 35 days while the
     intake average ran a fixed 21-day window. On this ledger those halves are
     genuinely different — the earlier fortnight averaged 1,953 kcal on 20,471
     steps, the later one 2,072 kcal on 16,526. Roughly 220 kcal/day of extra
     deficit produced part of the measured rate and never entered the intake
     average, so recent higher eating was being credited with a rate partly
     earned by an older, lower-intake, higher-step period. Result: maintenance
     read 2,681 when the matched-window figure is 2,631.

     ("Leaner" is the wrong word for that period and this file used it once. In
     an app that tracks lean mass as a quantity, and where he was six pounds
     HEAVIER then, it reads as body composition every time. Say kcal and steps.)

     The intake window is therefore taken from the rate's own endpoints. If the
     rate came from weekly snapshots rather than a regression it has no
     endpoints, and the old 21-day window is the fallback — stated, not hidden. */
  const fallback = isoOf(new Date(todayStart().getTime() - 21 * DAY));
  const from = r.from || fallback, to = r.to || isoOf(todayStart());
  let rows = Object.entries(s.dailyLogs).filter(([d, v]) => d >= from && d <= to && v && v.cal != null);
  /* matched only when the rate actually HAD endpoints to match against — a
     snapshot rate has none, and claiming a match there would be the same
     quiet fiction this whole note exists to remove */
  let matched = !!(r.from && r.to);
  if (rows.length < 8) { rows = Object.entries(s.dailyLogs).filter(([d, v]) => d >= fallback && v && v.cal != null); matched = false; }
  const cals = rows.map(([, v]) => v.cal);
  if (cals.length < 8) return null;
  const avg = cals.reduce((a, b) => a + b, 0) / cals.length;
  /* The two halves of the window, so the card can SHOW the difference rather
     than assert it. The first draft of that sentence said his earlier weeks
     "ran leaner", meaning ate less — in an app where lean mass is a tracked
     quantity and he was in fact six pounds heavier then, that is the one word
     it could not afford. Numbers do not have synonyms. */
  const sorted = rows.slice().sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const halfAt = Math.floor(sorted.length / 2);
  const halfAvg = (arr, k) => (arr.length ? Math.round(arr.reduce((a, [, v]) => a + (k === "cal" ? v.cal : v.steps || 0), 0) / arr.length) : null);
  const stepsOf = (arr) => { const w = arr.filter(([, v]) => v.steps != null); return w.length ? Math.round(w.reduce((a, [, v]) => a + v.steps, 0) / w.length) : null; };
  const half1 = sorted.slice(0, halfAt), half2 = sorted.slice(halfAt);
  const split = half1.length >= 4 && half2.length >= 4
    ? { calA: halfAvg(half1, "cal"), calB: halfAvg(half2, "cal"), stepA: stepsOf(half1), stepB: stepsOf(half2) }
    : null;
  /* The old ceiling was 1.6 lb/wk, and it BOUND on his real data: a rate of 1.55
     and a rate of 1.73 both saturated to the same number, so the estimate
     stopped responding to the data exactly where the data had most to say. The
     ceiling now sits at a genuinely physiological bound rather than a typical
     one, and it reports when it binds instead of silently truncating. */
  /* ---------- Two errors that were partly cancelling each other ----------
     The rate had the drip ADDED to it — the app assumed he must be losing more
     fat than the scale showed, because lean was going up. It was not (DRIP_NOTE).
     And the conversion used 3,500 kcal/lb, which is Wishnofsky's 1958 figure and
     is arithmetically equivalent to assuming 23% of the loss is lean tissue —
     a sedentary partitioning. For a lean male training hard on 2.76 g/kg FFM of
     protein, ~87% of the loss is fat, which prices at ~3,800 kcal/lb (Hall 2008:
     fat 4,282, lean 816).

     Inflating the pounds and under-pricing each pound pushed in opposite
     directions, which is why the total error is only ~100 kcal/day rather than
     300. Both are now correct rather than conveniently wrong together. */
  const RAW = r.scale;
  const CEIL = 3.0;
  const fatWk = Math.min(CEIL, RAW);
  const kcal = (f) => Math.round(avg + (f * KCAL_PER_LB_MIX) / 7);
  const tdee = kcal(fatWk);
  /* A thermodynamic floor check. If the implied deficit per pound exceeds the
     energy density of pure lipid, the model is claiming something impossible and
     should say so rather than print it. This is the check that caught the drip. */
  const impliedPerLb = fatWk > 0 ? Math.round(((tdee - avg) * 7) / fatWk) : null;
  const impossible = impliedPerLb != null && impliedPerLb > KCAL_PER_LB_FAT;
  /* The rate's own confidence interval, carried through to the TDEE. A single
     "measured TDEE" with no band invites a precision nobody has. */
  const lo = r.ci != null ? kcal(Math.min(CEIL, Math.max(0, r.lo))) : null;
  const hi = r.ci != null ? kcal(Math.min(CEIL, r.hi)) : null;
  return {
    tdee, days: cals.length, avg: Math.round(avg),
    lo, hi, clamped: RAW > CEIL, method: r.method, rateN: r.n,
    rate: r.scale, rateCi: r.ci, from, to, matched, split,
    perLb: KCAL_PER_LB_MIX, impliedPerLb, impossible,
  };
}

/* ---------- FLOOR_NOTE — 1,700 was invented ----------
   I checked all four documents that could plausibly authorise it. The
   ACSM/AND/DC 2016 Joint Position Stand, the IOC 2023 REDs consensus, the ISSN
   position stand on diets and body composition, and Helms 2014 on natural
   bodybuilding contest prep. Not one contains an absolute calorie floor for an
   athlete. Every one expresses the constraint per kilogram of fat-free mass.

   The 1,200/1,500 figures everyone half-remembers are not a micronutrient
   finding either. They come from the 2013 AHA/ACC/TOS obesity guideline, where
   the graded recommendation is the DEFICIT and the calorie numbers are the
   arithmetic consequence of applying it to a typical sedentary adult. They carry
   no independent evidence grade and were never derived from nutrient modelling.
   I searched specifically for a study establishing an intake below which a
   well-built diet cannot meet micronutrient needs, for men or anyone, and it
   does not exist. So this floor is about energy availability, and micronutrients
   are treated as a composition problem rather than an energy one.

   floor = EA_SPARING x FFM + net training cost — inverting the IOC's own
   formula. For him that is 25 x 63.5 + ~170 = ~1,760, which is ABOVE the
   hardcoded 1,700 he has been running under.

   Two honest corrections to my own framing while here. First, this is NOT the
   same magnitude of error as the rate band's units: fat-free mass is the thing a
   well-run cut defends, so it barely drifts — losing a kilogram of it moves the
   floor about 25 kcal. The real value of indexing to FFM is personalisation, not
   drift. Second, and more useful: for this athlete the floor should almost never
   be the binding constraint. At 1,700 he would be running 1.04% of bodyweight a
   week, past the ACSM/AND/DC 1%/week line, so the RATE cap should bite first. A
   floor that fires routinely is not protecting him — it is telling you the rate
   target is wrong. The engine now says so out loud when that happens. */
function calorieFloor(s) {
  const bf = bfEst(s);
  const ffmKg = bf.lean / 2.2046;
  const ea = energyAvailability(s);
  const eee = ea && !ea.gated ? ea.trainKcal : Math.round((EA_KCAL_PER_SESSION * 4) / 7);
  const raw = EA_SPARING * ffmKg + eee;
  const floor = Math.round(raw / 50) * 50;
  const soft = Math.round(((EA_SPARING + 5) * ffmKg + eee) / 50) * 50;
  return {
    floor, soft, ffmKg: +ffmKg.toFixed(1), eee: Math.round(eee),
    why: `${floor} is ${EA_SPARING} kcal per kg of your ${(+ffmKg.toFixed(1))} kg lean mass plus the ~${Math.round(eee)} a day your training costs — the IOC's own energy-availability formula, run backwards. No position stand anywhere states an absolute calorie floor for an athlete; all four I checked express it per kg of lean mass, which is why this one moves with you instead of sitting at a round number. Treat the 25 as a convention rather than a measurement: it comes from three single-subject case reports, and the IOC declines to set a threshold at all.`,
  };
}

/* ---------- DIET_EXIT — straight to maintenance, hold, then decide ----------
   The app's exit plan was a queue item reading "Fast reverse (~1-2 wk to
   ~2,450) → lean surplus 2,700-2,950 · MRV build". Three problems, in order of
   size.

   First, it is not what the athlete wants. Asked directly, he said: straight to
   maintenance, hold, then decide. The queue item committed him to a surplus and
   a build phase before the hold had produced a single number to decide on.

   Second, the numbers were authored. 2,450 was never his maintenance — his
   measured maintenance is what observedTDEE computes from his own intake and
   his own rate, and it is nowhere near 2,450. Walking into a "maintenance" that
   is several hundred kcal under actual maintenance is not maintenance; it is a
   smaller cut with a reassuring label, which is the single most common way a
   diet exit fails.

   Third, "fast reverse over 1-2 weeks" implies a ramp, and the ramp has no
   evidence behind it. Reverse dieting as a protocol has no controlled trial —
   the literature is case series and practitioner convention. What DOES have
   replicated support is time spent AT maintenance: MATADOR (Byrne 2018) and the
   diet-break literature show adherence and metabolic benefits from maintenance
   blocks, and none of it requires approaching maintenance slowly. A ramp mostly
   buys anxiety management, and it costs weeks at a deficit he has already
   decided to stop running.

   So: one step to his own measured number, hold long enough to get a clean read
   of it, then decide with data instead of on a schedule. The hold length is a
   judgement call and is labelled as one — two weeks is where glycogen and water
   finish rebounding, which is the minimum before the scale means anything again,
   and four is where a re-measured maintenance has enough days behind it to be
   worth trusting. No date, no countdown, no automatic surplus. */
const EXIT_HOLD_MIN_WK = 2, EXIT_HOLD_FULL_WK = 4;
function dietExit(s) {
  const td = observedTDEE(s);
  const ct = calorieTarget(s);
  const bf = bfEst(s);
  /* The hold clock only means something if something can start it. Nothing
     wrote exitStart, so readReady/decideReady were permanently false and the
     plan promised two milestones that could never arrive. It now reads the
     feed — the same place every other dated decision in this app lives — so
     applying the exit proposal starts the clock without a new storage field. */
  const started = (s.targets || {}).exitStart
    || (((s.feed || []).filter((f) => f.t === "DIET EXIT — MAINTENANCE HELD").pop() || {}).d)
    || null;
  if (!td) {
    return { gated: true, started, why: "Your maintenance is not measured yet, and the whole point of this plan is that the number you step up to is YOURS. Two clean weekly snapshots and it prints." };
  }
  const wksHeld = started ? +(((todayStart() - mk(started)) / DAY) / 7).toFixed(1) : 0;
  const step = ct.gated ? null : td.tdee - ct.mid;
  return {
    gated: false, started, wksHeld,
    maintenance: td.tdee, lo: td.lo, hi: td.hi, days: td.days,
    from: ct.gated ? null : ct.mid, step,
    holdMin: EXIT_HOLD_MIN_WK, holdFull: EXIT_HOLD_FULL_WK,
    readReady: started ? wksHeld >= EXIT_HOLD_MIN_WK : false,
    decideReady: started ? wksHeld >= EXIT_HOLD_FULL_WK : false,
    bf: bf.pct, bfLo: bf.lo, bfHi: bf.hi,
    /* The plan, in his words, with his numbers in it. */
    plan: [
      step == null
        ? `Step one: eat at ${td.tdee} — your measured maintenance, from ${td.days} logged days of your own intake against your own measured rate.`
        : `Step one: ${ct.mid} → ${td.tdee}. That is ${step > 0 ? "+" : ""}${step} kcal a day, in ONE step, not a ramp. ${td.tdee} is your measured maintenance from ${td.days} logged days — not a number anyone picked.`,
      `Step two: hold it. ${EXIT_HOLD_MIN_WK} weeks before the scale means anything again — the first few pounds back are glycogen and the water bound to it, and reading those as fat is how people talk themselves back into a deficit they do not need. ${EXIT_HOLD_FULL_WK} weeks before your re-measured maintenance has enough days behind it to trust.`,
      `Step three: decide, with the numbers the hold produced. Not before, and not on a date. A surplus is one option; staying here is another, and there is no rule that says the next phase has to be a build.`,
    ],
    why: `Reverse dieting — creeping up a hundred calories a week — has no controlled trial behind it; it is practitioner convention. What is replicated is the value of time spent AT maintenance (MATADOR, Byrne 2018, and the diet-break literature), and none of that requires arriving there slowly. The old plan in this app aimed at ~2,450, which was authored and sits ${td.tdee - 2450 > 0 ? `${td.tdee - 2450} kcal under` : `${2450 - td.tdee} kcal over`} your actual measured maintenance — walking into a "maintenance" that is not your maintenance is just a smaller cut wearing a better name.`,
    /* Honest about what nobody knows. */
    unknown: `What no study can tell you: where to stop cutting. Your body fat reads ${bf.pct}% and the honest interval is ${bf.lo}–${bf.hi}%, which is too wide to hang a decision on. That call is yours and your coach's, from the mirror and the lifts — the app's job is to make sure the number you step UP to is real, not to tell you when to step.`,
  };
}

/* ---------- CALORIE_TARGET — the number the app should have been giving him ----------
   The phase band is a constant authored months ago: EASE 1 says 1,725–1,800.
   His measured TDEE and his own target rate band imply something else entirely,
   and nothing in the app reconciled them — so the prescription said 1,750 while
   the record said 2,072, and both were labelled correct.

   This derives intake the only way that survives contact with his data: take the
   measured TDEE, subtract the deficit his own stated rate band asks for, and
   carry the TDEE's uncertainty into the answer instead of hiding it. 3,500 kcal
   per pound is the conventional figure and is itself an approximation — which is
   why the output is a band, and why it never overrides the calorie floor. */
function calorieTarget(s) {
  const td = observedTDEE(s);
  const band = (s.rate && s.rate.band) || [1.0, 1.4];
  const fl = calorieFloor(s);
  const floor = fl.floor;
  if (!td) {
    const ph = PHASES[s.phase];
    return { gated: true, from: "phase", lo: ph ? ph.band[0] : null, hi: ph ? ph.band[1] : null,
      why: "Not enough clean days to measure your own maintenance yet, so this is the phase band as authored." };
  }
  /* ---------- KCAL_PER_LB_NOTE — one conversion, not three ----------
     This used 3,500 kcal/lb while observedTDEE used KCAL_PER_LB_MIX (3,800) and
     the thermodynamic sanity check used KCAL_PER_LB_FAT (4,282). Three places
     converting pounds to calories, three different constants, all derived from
     the same ledger — which is the "number that changes between screens" failure
     the canonical block was built to stop, sitting inside the engine itself.

     3,500 is the Wishnofsky figure: 1958, pure adipose assumed, and wrong on its
     own terms — Hall 2008 puts adipose at 4,282 kcal/lb. What comes off the
     scale in a deficit is not pure adipose either, which is why the mixed figure
     exists and why observedTDEE already uses it. The target now uses the same
     one, so the calorie band and the maintenance it is subtracted from speak the
     same units. It moves the band down by roughly 40-60 kcal/day, which is the
     size of the error that was there. */
  const kcalFor = (lbWk) => Math.round((lbWk * KCAL_PER_LB_MIX) / 7);
  const hi = Math.max(floor, td.tdee - kcalFor(band[0]));
  const lo = Math.max(floor, td.tdee - kcalFor(band[1]));
  const ph = PHASES[s.phase];
  const phaseLo = ph ? ph.band[0] : null, phaseHi = ph ? ph.band[1] : null;
  const drift = phaseHi != null ? Math.round((lo + hi) / 2 - (phaseLo + phaseHi) / 2) : 0;
  /* ---------- The number he was never shown: what he ACTUALLY averaged ----------
     A daily band tells him what to eat. It does not tell him whether he ate it,
     and on a plan with one high day a week those are different questions — his
     Wednesdays ran 2,395 against 1,893 on every other day, which lifted his
     weekly average about 72 kcal/day above his own band without a single card
     ever saying so. The target is daily; the result is weekly; both belong on
     the screen. */
  const wkRows = Object.entries(s.dailyLogs || {}).filter(([d, v]) => v && v.cal != null)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-7);
  const wkAvg = wkRows.length >= 4 ? Math.round(wkRows.reduce((a, [, v]) => a + v.cal, 0) / wkRows.length) : null;
  const wkOff = wkAvg == null ? null : wkAvg - Math.round((lo + hi) / 2);
  return {
    gated: false, from: "measured", lo, hi, mid: Math.round((lo + hi) / 2),
    wkAvg, wkN: wkRows.length, wkOff,
    /* "Inside the band" now means inside the BAND, not within an authored 60
       kcal of its midpoint — the band has width and that width is the whole
       point of expressing the target as one. And the lb/wk conversion uses the
       same kcal-per-pound the rest of the engine does; it was quoting 3,500 in
       the sentence he reads while the number above it was built on 3,800. */
    wkWhy: wkAvg == null ? null
      : (wkAvg >= lo && wkAvg <= hi) ? `Your last ${wkRows.length} logged days average ${wkAvg} — inside the ${lo}–${hi} band. The target and the result agree, which is the only state worth being in.`
      : `Your last ${wkRows.length} logged days average ${wkAvg}, which is ${Math.abs(wkAvg > hi ? wkAvg - hi : lo - wkAvg)} kcal/day ${wkAvg > hi ? "above the top" : "below the bottom"} of the ${lo}–${hi} band — about ${(Math.abs(wkAvg > hi ? wkAvg - hi : lo - wkAvg) * 7 / KCAL_PER_LB_MIX).toFixed(2)} lb/wk ${wkAvg > hi ? "slower" : "faster"} than the band is aiming for. Not a scolding, just the arithmetic: a daily target and a weekly result are different questions.`,
    tdee: td.tdee, tdeeLo: td.lo, tdeeHi: td.hi, days: td.days, avg: td.avg,
    band, phaseLo, phaseHi, drift, floorHit: lo === floor,
    floor, floorSoft: fl.soft, floorWhy: fl.why,
    /* If the floor is what's binding, the rate target is asking for more than
       energy availability allows — and the honest reading is that the rate is
       misconfigured, not that he should eat at the floor. */
    floorBinds: lo === floor && td.tdee - kcalFor(band[1]) < floor,
    floorBindsWhy: lo === floor && td.tdee - kcalFor(band[1]) < floor
      ? `Your band's fast end asks for ${td.tdee - kcalFor(band[1])}, which is under the ${floor} energy-availability floor, so the floor is what you are actually eating to. That is worth noticing rather than accepting: a floor that binds is telling you the rate target is set faster than your lean mass can fund, not that ${floor} is the right number. The fix is a slower band, not a lower plate.`
      : null,
    why: `Your measured maintenance is ${td.tdee}${td.lo && td.hi ? ` (${td.lo}–${td.hi} once the rate's own error is carried through)` : ""}, from ${td.days} logged days and a ${td.method === "regression" ? `least-squares rate across ${td.rateN} daily reads` : "snapshot rate"}${td.matched && td.from ? `, both measured over the same stretch — ${fmtShort(td.from)} to ${fmtShort(td.to)}. That matters because the two halves of that stretch are not the same: ${td.split ? `you averaged ${td.split.calA} kcal on ${td.split.stepA != null ? td.split.stepA.toLocaleString() + " steps" : "more walking"} in the first half and ${td.split.calB} on ${td.split.stepB != null ? td.split.stepB.toLocaleString() : "fewer"} in the second` : "you ate less and walked more earlier on"}. Averaging only the recent food against a rate the earlier weeks helped produce would read maintenance high` : ""}. Your band asks for ${band[0]}–${band[1]} lb/wk, which is ${kcalFor(band[0])}–${kcalFor(band[1])} kcal/day under it. That lands at ${lo}–${hi}.`,
  };
}

/* ---------- ENERGY_AVAILABILITY ----------
   The reading this ledger was missing. Everything else here measures what he
   does; this measures what is LEFT after training is paid for, which is the
   variable that governs whether a lean male keeps muscle in a deficit.

     EA = (intake − exercise energy expenditure) / fat-free mass

   Fagerberg's 2018 review of lean male physique athletes puts the thresholds at
   >25 kcal/kg FFM/day to spare muscle, and below ~20 more than 40% of the
   weight lost comes off fat-free mass — with testosterone, T3, leptin and RMR
   falling alongside. Those are the only male-specific numbers in this space;
   most of the LEA literature is female and built on instruments (LEAF-Q) that
   are unusable in men because half the items concern menstrual function.

   The honest difficulty is what counts as EXERCISE, and the first version of
   this got it wrong in a way that mattered. It reported both ends — training
   only, and training plus deliberate walking — which was right. But it then
   BANDED on the walking-inclusive end, which is the one the published
   thresholds were never built against.

   The IOC's 2023 REDs consensus states the formula as (EI - EEE) / FFM where
   EEE is purposeful structured exercise. Fagerberg 2018, the source of the 25,
   is explicit in the other direction: non-exercise expenditure gets subtracted
   OUT of gross exercise cost before it becomes EEE. And Espinar et al. (2026)
   measured exactly this substitution in free-living athletes — swapping
   structured EEE for activity-induced expenditure dropped estimated EA from
   ~32 to ~20 kcal/kg FFM/day in the same people, with nothing changing
   physiologically. On this ledger the same swap runs 29.9 to 24: the entire
   distance between "adequate" and "below the male line", produced by
   bookkeeping.

   So the band is now taken on the conventional number, which is the only one
   comparable to 25. The walking-inclusive figure is still shown, because it is
   a real and useful reading of everything he burns in a day — it is just labelled as a different
   convention rather than silently used as the verdict.

   The 25 itself is flagged as extrapolated, because it is. Fagerberg derives it
   from Keys' 1950 semi-starvation work, Müller 2015, Pasiakos 2013 and natural
   bodybuilder case reports with self-reported intake; he states outright that no
   controlled male threshold study comparable to Loucks' exists. The IOC 2023
   declines a universal cut-off and gives males a range of roughly 9-25. The only
   controlled male data anywhere is endurance athletes at 17-22 over 14 days
   (Jurov 2021/2022) and a single combat-athlete case study. Nobody has tested a
   lean resistance-trained male at 23 versus 30 for eight weeks.

   Everything below is an ESTIMATE and says so. Session cost and walking cost
   are population averages, not his measured expenditure — and walking economy
   improves under a prescribed programme (Knaan 2026), so the same step count
   buys progressively fewer calories as the block runs. The instrument's job is
   to say which side of the line he is on, not to claim a decimal place. */
const EA_SPARING = 25;
const EA_LOW = 20;
const EA_STEP_BASELINE = 4000;
const EA_KCAL_PER_1K_STEPS_PER_KG = 0.4;
const EA_KCAL_PER_SESSION = 300;
function energyAvailability(s) {
  const cutoff = isoOf(new Date(todayStart().getTime() - 21 * DAY));
  const rows = Object.entries(s.dailyLogs || {}).filter(([d, v]) => d >= cutoff && v && v.cal != null);
  if (rows.length < 8) return { gated: true, have: rows.length, need: 8 };
  const cals = rows.map(([, v]) => v.cal);
  const intake = cals.reduce((a, b) => a + b, 0) / cals.length;
  const stepRows = rows.filter(([, v]) => v.steps != null).map(([, v]) => v.steps);
  const steps = stepRows.length ? stepRows.reduce((a, b) => a + b, 0) / stepRows.length : null;
  const bf = bfEst(s);
  const ffmKg = bf.lean / 2.2046;
  const bwKg = s.trend / 2.2046;
  if (!(ffmKg > 0)) return { gated: true, have: rows.length, need: 8 };

  /* Sessions per week. Measured from the log where the log is complete — but he
     started logging in-app part way through, so a raw count read 1.5 sessions a
     week for a man who trains four times, and under-charged training by two
     thirds. The programme itself knows the answer: dayType marks the upper and
     lower days. Take the higher of the two, because under-charging exercise
     inflates energy availability, which is the direction that hides a problem. */
  const sessDays = Object.keys(s.sessionLog || {}).filter((d) => d >= cutoff).length;
  const wks = Math.max(1, rows.length / 7);
  const logged = sessDays / wks;
  let scheduled = 0;
  for (let i = 0; i < 7; i++) { const d = isoOf(new Date(todayStart().getTime() - i * DAY)); const t2 = dayType(d); if (t2 === "U" || t2 === "L") scheduled++; }
  const perWk = Math.max(logged, scheduled);
  const sessPerDay = perWk / 7;
  const trainKcal = sessPerDay * EA_KCAL_PER_SESSION;
  const walkKcal = steps == null ? 0 : Math.max(0, (steps - EA_STEP_BASELINE) / 1000) * EA_KCAL_PER_1K_STEPS_PER_KG * bwKg;

  /* eaTrain is the CONVENTIONAL number and the only one comparable to the
     published thresholds. eaAll counts deliberate walking as training — a real
     reading of everything he burns in a day, but against no published line. */
  const eaTrain = +((intake - trainKcal) / ffmKg).toFixed(1);
  const eaAll = +((intake - trainKcal - walkKcal) / ffmKg).toFixed(1);
  const lo = Math.min(eaTrain, eaAll), hi = Math.max(eaTrain, eaAll);
  /* MARGINAL is a narrow early-warning band just above the line, not a wide
     anxious one: 25 is itself extrapolated, so a number 20% clear of it should
     read as clear rather than as nearly-in-trouble. */
  const band = eaTrain < EA_LOW ? "VERY LOW" : eaTrain < EA_SPARING ? "LOW" : eaTrain < EA_SPARING + 3 ? "MARGINAL" : "ADEQUATE";

  /* Which lever is cheaper — the actionable half, now priced off the
     conventional number so the instruction matches the verdict. Order matters:
     the trained-population evidence links LEAN MASS LOSS to deficit magnitude
     (Murphy & Koehler 2022, ES -3.1e-4 per kcal/day of deficit), and has nothing
     against walking as such — no concurrent-training meta-analysis has ever
     included a walking arm. So food is named first and steps second. */
  const needKcal = Math.max(0, Math.round(EA_SPARING * ffmKg - (intake - trainKcal)));
  const stepsToDrop = needKcal > 0 && walkKcal > 0 ? Math.round((needKcal / (EA_KCAL_PER_1K_STEPS_PER_KG * bwKg)) * 1000) : null;

  return {
    gated: false, lo, hi, band, ea: eaTrain, eaAll, intake: Math.round(intake), steps: steps == null ? null : Math.round(steps),
    ffmKg: +ffmKg.toFixed(1), trainKcal: Math.round(trainKcal), walkKcal: Math.round(walkKcal),
    sessPerWk: +(sessPerDay * 7).toFixed(1), days: rows.length, needKcal, stepsToDrop,
    receipts: [
      `Intake ${Math.round(intake)} kcal/day averaged over ${rows.length} logged days.`,
      `Training costs about ${Math.round(trainKcal)} kcal/day at ${(+perWk.toFixed(1))} sessions a week${logged < scheduled ? ` (the programme's ${scheduled}, not the ${(+logged.toFixed(1))} in the log — in-app logging started part way through, and under-charging training would flatter this number)` : ""} — an estimate, not a measurement.`,
      steps == null ? "No step data in the window." : `Walking ${Math.round(steps).toLocaleString()} steps/day costs roughly ${Math.round(walkKcal)} kcal/day above a sedentary baseline.`,
      `Fat-free mass ${(+ffmKg.toFixed(1))} kg, from the anchored lean model.`,
      `Counting structured training only — ${eaTrain} — is the convention the IOC's 2023 formula uses and the only one comparable to the 25 line, so it is the one banded above. Counting deliberate walking as training gives ${eaAll}; that is a true reading of everything you burn in a day but there is no published threshold built that way. Espinar 2026 measured the same swap in free-living athletes and it moved EA from ~32 to ~20 with nothing changing physiologically.`,
      `The 25 itself is extrapolated, not measured. Fagerberg 2018 proposes it from semi-starvation work and bodybuilder case reports and says plainly that no controlled male threshold study exists; the IOC 2023 declines a universal cut-off and gives males roughly 9-25. Treat it as a direction, and watch resting pulse, morning temperature and whether the lifts hold — those are measurements.`,
    ],
  };
}

/* ETA (weeks) until est. BF reaches a target, simulating trend − rate, lean + drip */
function etaWeeks(s, targetPct, leanRate) {
  const r = currentRate(s);
  const dr = leanRate == null ? dripOf(s) : leanRate;
  let trend = s.trend, wks = 0;
  let lean = bfEst(s).lean;
  for (; wks < 30; wks++) {
    if (((trend - lean) / trend) * 100 <= targetPct) return wks;
    trend -= Math.max(0.3, r.scale); lean += dr;
  }
  return null;
}
/* An ETA is a range or it is a fiction. The old one walked a single line off a
   drip of +0.3, which made it ~41% too short: 6.7 weeks to 10% where the honest
   answer under flat lean mass is ~11.5. This runs the same walk at both ends of
   the evidence-supported lean band and reports the spread, plus the one figure
   that is arithmetic rather than prophecy — the weight at which he hits the
   target IF lean mass holds. */
function etaRange(s, targetPct) {
  const mid = etaWeeks(s, targetPct, DRIP_DEFAULT);
  const fast = etaWeeks(s, targetPct, DRIP_HI);
  const slow = etaWeeks(s, targetPct, DRIP_LO);
  const lean = bfEst(s).lean;
  const atWeight = +(lean / (1 - targetPct / 100)).toFixed(1);
  return { mid, fast, slow, atWeight, lean: +lean.toFixed(1) };
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
  const ev = s.events.find((e) => !e.estimated && daysUntil(e.d) <= 3);
  const ds0 = eps.map((e) => e.days).sort((a, b) => a - b);
  const hiC = ds0.length >= 3 ? ds0[ds0.length - 2] : ds0[ds0.length - 1];
  out.push({ id: "whoosh", t: "WHOOSH SIGNATURE", status: eps.length >= 2 ? "LIVE" : "ARMED", prog: { n: eps.length, need: 2, label: "spike→drain episodes" },
    tag: "How fast event water leaves YOUR body — measured, per event.",
    deep: "Big meals spike the scale with sodium, glycogen, and gut content — not fat (a 4.6 lb fat gain would need ~16,000 surplus calories, not one dinner). This model measured how long each of your spikes took to clear, so future spikes arrive pre-labeled with an exit date instead of a panic.",
    forYou: eps.length >= 2
      ? (ev ? `${ev.t} ${fmtShort(ev.d)}: expect a next-morning spike somewhere in your +${Math.min(...eps.map(e => e.jump))} to +${Math.max(...eps.map(e => e.jump))} range, clearing in ${ds0[0]}–${hiC} days. Every reading in that window is pre-dismissed. the first clean read after may still carry residue — the damped trend already knows.`
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
    forYou: sdN ? `Judge any morning against the trend (${s.trend}), never against a single prior read — a move within ±${sdN.toFixed(1)} of expectation is zero information. The scale card now stamps those automatically. Two consecutive lows = signal beginning.` : "Eight clean consecutive-day pairs calibrate it.",
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
  const proTgtA = proteinTarget(s).lo;
  const misses = Object.entries(s.dailyLogs).filter(([d, v]) => d > "2026-07-21" && v.pro != null && !proteinHit(proTgtA, v.pro));
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
  (() => {
    const mv = muscleVolume(s);
    const line = mv.slice().sort((a, b) => (a.zone === "UNDER" ? -1 : b.zone === "UNDER" ? 1 : a.n7 - b.n7)).map((m) => `${m.mg} ${m.n7}${m.zone === "IN-BAND" ? " ✓" : m.zone === "UNDER" ? " ▼▼" : m.zone === "LOW" ? " ▼" : m.zone === "OVER" ? " ▲▲" : " ▲"}`).join(" · ");
    out.push({ id: "volumeledger", t: "THE VOLUME LEDGER — WEEKLY SETS PER MUSCLE", status: mv.length ? "LIVE" : "ARMED", prog: { n: mv.length, need: 1, label: "muscle groups with logged sets" },
      tag: "The biggest dial in hypertrophy, counted from your actual logs.",
      deep: "Weekly hard sets per muscle is the strongest known volume dial. Counting here uses the half-credit convention: direct sets count 1, and heavy secondary work lends half — pressing lends 0.5 to triceps and delts, rows and pulldowns lend 0.5 to biceps, curls lend 0.5 to forearms. Counting conventions genuinely differ across the literature; half-credit is the defensible middle — direct-only starves muscles that live off compounds, full-credit double-books the same set twice. The bands are deficit-calibrated: " + VOL_BANDS.floor + " is the retention floor (below it for two straight weeks and the ledger proposes +1 as cheap insurance), " + VOL_BANDS.lo + "–" + VOL_BANDS.hi + " is the working zone, past " + VOL_BANDS.ceil + " is caution — recoverable volume compresses in a cut, and sets you cannot recover from are pure fatigue. THE TILT: this house presumes volume useful until your own bar speed says otherwise — adds fire on lighter evidence, while trims demand two confirmed weeks past the ceiling or slipping bars on clean sleep. Every proposal also cross-references the muscle's lift velocities, your sleep gate, and the alarm before it fires; changes go one set at a time through your consent inbox, and each muscle rests two weeks between moves so the change has time to speak. Adds go to the muscle's strongest mover, trims come off its weakest. Soreness testifies too: two-plus sore mornings blocks a headroom add for that muscle, and three sore mornings on a high week can propose the trim before the bar speed slips.",
      forYou: mv.length ? `This week: ${line}. ✓ in the working zone · ▼ light · ▼▼ under the retention floor · ▲ high · ▲▲ past the deficit ceiling. Proposals arrive in your inbox only when the signals agree.` : "Log a session and the ledger opens.",
      lines: [] });
  })();
  (() => {
    const nsig = (s.energy || []).length + (s.grip || []).length + (s.soreness || []).length;
    const eT2 = (s.energy || []).find((x) => x.d === isoOf(todayStart()));
    const gT2 = (s.grip || []).find((x) => x.d === isoOf(todayStart()));
    const soreToday = (s.soreness || []).find((x) => x.d === isoOf(todayStart()));
    out.push({ id: "signals", t: "MORNING SIGNALS — WIRED INTO THE MACHINE", status: nsig >= 5 ? "LIVE" : "ARMED", prog: { n: nsig, need: 5, label: "morning entries banked" },
      tag: "Energy, grip, soreness, meds — collected in the Minute, consumed by the desk, the volume ledger, the weather, and the scale.",
      deep: "Nothing here is decoration; each signal has a law. ENERGY GATE: 2-or-under on a morning at least a point below your usual (five-plus mornings on file) and the desk caps every push at HOLD — repeat, don't chase. GRIP GATE: today's left-plus-right at or under 92% of your recent median (four-plus entries) triggers the same cap; the nervous system testifies before the bar does. SORENESS LAW: two-plus sore mornings this week blocks a headroom add for that muscle; three sore mornings on a high-volume week can propose the trim before bar speed slips. MEDS: none-days flag the day's weather and the desk's receipts so appetite, energy, and effort read against the truth. SALT AND ALCOHOL: a high-sodium or alcohol evening annotates the next morning's scale read — water noise, named at the moment you'd otherwise worry. Every gate is silence until its data has standing.",
      forYou: nsig ? `Today: energy ${eT2 ? eT2.v + "/5" : "—"} · grip ${gT2 ? ((gT2.l || 0) + (gT2.r || 0)) + " lb" + (() => { const gh = (s.grip || []).filter((x) => x.d < isoOf(todayStart())).slice(-7).map((x) => (x.l || 0) + (x.r || 0)).filter((v) => v > 0); if (gh.length < 4) return ""; const b = gh.slice().sort((a, c) => a - c); const m = b[Math.floor(b.length / 2)]; const d = Math.round((((gT2.l || 0) + (gT2.r || 0)) / m - 1) * 100); return ` (${d >= 0 ? "+" : ""}${d}% vs median)`; })() : "—"} · sore ${soreToday ? (soreToday.mgs.length ? soreToday.mgs.join(", ") : "nothing") : "—"}. The desk's receipts on TRAIN show these being consulted, lift by lift.` : "Log a first morning signal and this card wakes; the gates arm themselves as history accrues.",
      lines: [] });
  })();
  (() => {
    const ml9 = s.medsLog || [];
    const onD9 = ml9.filter((x) => x.taken).map((x) => x.d);
    const offD9 = ml9.filter((x) => !x.taken).map((x) => x.d);
    const nMin9 = Math.min(onD9.length, offD9.length);
    const avgM = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
    const grabM = (days, f) => days.map(f).filter((v) => v != null && !isNaN(v));
    const rowsM = [];
    const cmpM = (label, f, fmt) => {
      const a = grabM(onD9, f), b = grabM(offD9, f);
      if (a.length < 2 || b.length < 2) return;
      rowsM.push(label + ": " + fmt(avgM(a)) + " on meds vs " + fmt(avgM(b)) + " without (n=" + a.length + "/" + b.length + ")");
    };
    cmpM("calories", (d) => (s.dailyLogs[d] || {}).cal, (v) => String(Math.round(v)));
    cmpM("protein", (d) => (s.dailyLogs[d] || {}).pro, (v) => Math.round(v) + " g");
    cmpM("steps", (d) => (s.dailyLogs[d] || {}).steps, (v) => (v / 1000).toFixed(1) + "k");
    cmpM("morning energy", (d) => { const e = (s.energy || []).find((x) => x.d === d); return e ? e.v : null; }, (v) => v.toFixed(1) + "/5");
    const liveM = nMin9 >= 3 && rowsM.length > 0;
    out.push({ id: "medswindow", t: "THE MEDS WINDOW \u2014 WHAT CHANGES WHEN THEY DON'T", status: liveM ? "LIVE" : "ARMED",
      prog: { n: nMin9, need: 3, label: "paired days on file" },
      tag: "Adherence already has a clock. This reads what that clock is worth \u2014 your days on meds against your days without, in your own numbers.",
      deep: "Method: every entry in the meds log is either taken or none. This card sorts your logged days into those two piles and reports the plain average of each \u2014 no modelling, no adjustment, no attempt to explain the gap. It needs three days on each side before it speaks, because two days of anything is an anecdote wearing a lab coat. What this is not: a verdict on medication. The house treats meds as weather, never as judgment, and this card will never propose a dose, a schedule, or a change \u2014 that conversation belongs to you and your prescriber, and the app has no standing in it. Read the confound before the numbers: none-days are not randomly assigned. If yours cluster on weekends, travel, or event days, part of what you are seeing is weekends rather than medication, and the honest reading is a flag for attention, never a causal claim. The nightly analyst is bound to name that confound whenever it quotes these lines.",
      forYou: liveM ? rowsM.join(" \u00b7 ") : (onD9.length + " days on meds and " + offD9.length + " without are on file. Three of each opens the comparison \u2014 until then this card counts and says nothing."),
      lines: [] });
  })();
  (() => {
    const rateF = currentRate(s);
    const t0F = isoOf(todayStart());
    const rsF = rateF.rates || [];
    const mF = rsF.length ? rsF.reduce((a, b) => a + b, 0) / rsF.length : 0;
    const sdF = rsF.length >= 2 ? Math.sqrt(rsF.reduce((a, r) => a + (r - mF) * (r - mF), 0) / (rsF.length - 1)) : null;
    const rowsF = [];
    /* The rate can now come from a regression over daily reads, which means it
       exists before any weekly snapshot does. The BAND cannot: it is the spread
       of his own weekly rates, and with fewer than two of those there is no
       spread to widen. A line without a band is the fake-precise forecast this
       card exists to refuse, so the gate stays on snapshots. */
    if (rateF.measured && s.trend && sdF != null) {
      for (let k = 1; k <= 8; k++) {
        const wF = +(s.trend - rateF.scale * k).toFixed(1);
        const dF = isoOf(new Date(mk(t0F).getTime() + k * 7 * DAY));
        const bF = bfEst(s, wF, dF);
        rowsF.push("wk +" + k + " \u00b7 " + fmtShort(dF) + " \u00b7 " + wF.toFixed(1) + " lb" + (sdF ? " \u00b1" + (sdF * k).toFixed(1) : "") + " \u00b7 " + bF.pct.toFixed(1) + "% bf \u00b7 lean " + bF.lean.toFixed(1));
      }
    }
    const ptsF = (id) => Object.keys(s.sessionLog || {}).map((d) => {
      const e = ((s.sessionLog[d] || {}).entries || []).find((x) => x.id === id);
      return e && e.reps && e.reps.length ? { d, top: Math.max.apply(null, e.reps) } : null;
    }).filter(Boolean).sort((a, b) => (a.d < b.d ? -1 : 1));
    const slopeF = (pts) => {
      if (pts.length < 3) return null;
      const x = pts.map((q) => weeksBetween(pts[0].d, q.d)), y = pts.map((q) => q.top);
      const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
      let num = 0, den = 0;
      for (let i = 0; i < n; i++) { num += (x[i] - mx) * (y[i] - my); den += (x[i] - mx) * (x[i] - mx); }
      return den > 0 ? num / den : null;
    };
    const liftF = [];
    (s.exercises || []).forEach((ex) => {
      const pts = ptsF(ex.id), sl = slopeF(pts);
      if (!sl || sl <= 0.02 || typeof ex.w !== "number") return;
      let reps = pts[pts.length - 1].top, w = ex.w;
      for (let k = 1; k <= 8; k++) { reps += sl; while (reps > (ex.hi || 12)) { const up = nextLoad(ex, w); if (up == null) { reps = ex.hi || 12; break; } w = up; reps -= 3; } }
      liftF.push({ s: sl, line: ex.n + ": " + ex.w + "\u00d7" + pts[pts.length - 1].top + " now \u2192 " + w + "\u00d7" + Math.round(reps) + " in 8 wks (+" + sl.toFixed(2) + " reps/wk, n=" + pts.length + ")" });
    });
    liftF.sort((a, b) => b.s - a.s);
    const heldF = Math.max(0, liftF.length - 5);
    const linesF = rowsF.concat(liftF.length ? ["\u2014"].concat(liftF.slice(0, 5).map((x) => x.line), heldF ? [`+ ${heldF} more lift${heldF === 1 ? "" : "s"} projected but not shown — the five climbing fastest are here`] : []) : []);
    const liveF = rowsF.length > 0;
    const endF = liveF ? rowsF[rowsF.length - 1] : null;
    out.push({ id: "forecast", t: "THE FORECAST \u2014 WEEK BY WEEK, ON YOUR OWN SLOPE", status: liveF ? "LIVE" : "ARMED",
      prog: { n: (s.weekly || []).length, need: 2, label: "weekly snapshots" },
      tag: "Where the current data lands you, week by week \u2014 body first, then the lifts. It refits itself every time you log.",
      deep: "Method, body: your weekly trend snapshots give a measured rate of loss; the projection walks that rate forward eight weeks and runs each future weight through the same body model the app uses today, so lean mass drips at your fitted rate rather than being assumed constant. The band is not decoration \u2014 it is the spread of your own weekly rates, widening with each week out, because uncertainty in a slope compounds the further you extrapolate. Two snapshots is the minimum; a single rate has no spread and therefore no honest band. Method, lifts: for every exercise with three or more logged sessions, the top set is regressed against time to get a reps-per-week slope, then walked forward under your own double-progression rules \u2014 when projected reps pass the top of the range, the bar goes up by that lift's increment and the reps reset the way they actually do in the gym. Lifts with fewer than three sessions are absent rather than guessed. What this is: a forecast, and it is labelled one everywhere it appears. It assumes the deficit holds, adherence holds, sleep holds, and nothing intervenes \u2014 assumptions that a single wedding, a cold, or a bad fortnight will break. It is not a promise and it never acts: no target changes, no volume moves, no proposal is filed off the back of it. When the data disagrees with the line, the data is right and the line redraws itself the next morning.",
      forYou: liveF ? (endF.split(" \u00b7 ").slice(1).join(" \u00b7 ") + " \u2014 eight weeks out at your measured rate of " + rateF.scale.toFixed(2) + " lb/wk" + (blackoutOn(s, t0F) ? ", drawn from the pre-blackout trend while the scale is sealed" : "") + ". (forecast \u2014 refits every log)") : "Two weekly snapshots open the projection. Until then the trend has no measured rate to walk forward, and a guessed line is worse than none.",
      lines: linesF });
  })();
  (() => {
    const ea = energyAvailability(s);
    out.push({
      id: "ea", t: "ENERGY AVAILABILITY — WHAT IS LEFT AFTER TRAINING IS PAID FOR", status: ea.gated ? "ARMED" : "LIVE",
      prog: ea.gated ? { n: ea.have, need: ea.need, label: "logged days of calories" } : null,
      tag: "The one reading that decides whether the deficit costs you muscle rather than fat.",
      deep: `Energy availability is intake minus the energy training costs, divided by fat-free mass — what is left to run the body on. Fagerberg's 2018 review of lean male physique athletes puts the sparing threshold at ${EA_SPARING} kcal per kg of fat-free mass per day; below about ${EA_LOW}, more than 40% of the weight lost comes off lean mass, alongside falls in testosterone, T3, leptin and resting metabolic rate. Those are the only male-specific thresholds in this literature — most low-energy-availability work is female and built on a questionnaire (LEAF-Q) that cannot be used in men, since half its items concern menstrual function. Two honesty notes. First, the convention counts PURPOSEFUL exercise, and a deliberate 16k-step day sits exactly on the boundary between training and incidental movement, which the convention does not resolve — so this shows both ends of the range rather than picking one and pretending. Second, session cost and walking cost are population estimates, not your measured expenditure. The instrument's job is to say which side of ${EA_SPARING} you are on, and to say which lever closes the gap more cheaply. It is not precise enough to argue about a decimal, and it never changes anything on its own.`,
      forYou: ea.gated
        ? `${ea.have} of ${ea.need} logged calorie days — this opens once there is enough intake data to average honestly.`
        : `${ea.lo}–${ea.hi} kcal per kg lean, which reads ${ea.band}. ${ea.hi < EA_SPARING ? `You are under the ${EA_SPARING} line on every way of counting it. ${ea.stepsToDrop ? `Closing it takes about ${ea.needKcal} more calories a day, or about ${ea.stepsToDrop.toLocaleString()} fewer steps — and steps are the cheaper half to give back, because they cost you nothing you are trying to keep.` : ""}` : ea.lo < EA_SPARING ? `Counting the walking you are under the line; counting training alone you are over it. That gap is the accounting question, not a measurement error — and at 16k deliberate steps a day the lower number is the more honest one.` : `Above the sparing threshold on both ways of counting.`}`,
      lines: ea.gated ? [] : ea.receipts,
    });
  })();
  out.push({ id: "mrv", t: "VOLUME RETURN CURVE — WHERE ADDED SETS STOP PAYING", status: "LOCKED", prog: null,
    tag: "Finds where your own added sets stop earning their fatigue — not a template's number.",
    deep: "Weekly sets per muscle plotted against volume-load slope and recovery response — the point where an added set stops improving output. What this can find is a marginal-return inflection, NOT a 'maximum recoverable volume': MRV is a coaching model, not a measured quantity, and no study validates training just beneath it. The literature prior it starts from: Schoenfeld, Ogborn & Krieger 2017 (meta-analysis) found a graded dose-response, 10+ weekly sets per muscle outgrowing lower volumes; later meta-regressions sharpen that to roughly logarithmic returns — each added set keeps buying a little, and buys less than the one before it. That's the build-phase climb target. The cut deliberately sits below it, because in a deficit load is what protects muscle and volume is the lever that comes down.",
    forYou: (() => { const cut7 = isoOf(new Date(todayStart().getTime() - 7 * DAY)); const perMg = {}; Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cut7) (sl.entries || []).forEach((e2) => { const ex2 = exById(s, e2.id); if (ex2 && ex2.mg && e2.reps) perMg[ex2.mg] = (perMg[ex2.mg] || 0) + e2.reps.length; }); }); const parts = Object.entries(perMg).map(([m, n2]) => `${m} ${n2}`); return `MEV on purpose while cutting — growing on the minimum is the plan. Your logged sets this week: ${parts.length ? parts.join(" · ") : "none in-app yet"} · the build climbs each toward the 10+ landmark, then keeps climbing only while the volume-load slope still pays for the fatigue.`; })(),
    lines: ["engine ships with the September program push"] });
  out.push({ id: "debutmodel", t: "DEBUT-READINESS MODEL", status: "LOCKED", prog: null,
    tag: "Learns the exact conditions under which your debuts land.",
    deep: "Recovery signals and prior-session context at each debut versus its outcome, once ~15 build-phase debuts exist to learn from. There is no sleep gate to replace any more — that rule was retired for having no evidence behind it — so what this would learn is whether ANY pre-session signal predicts how a debut lands, which is currently an open question rather than an assumed yes.",
    forYou: "Nothing gates a debut today. It runs when it wins the day's structural slot, and the first outing carries no rep expectations — which is the honest default until something is shown to predict better.",
    lines: ["needs ~15 build-phase debuts"] });

  const rank = { LIVE: 0, ARMED: 1, LOCKED: 2 };
  return out.sort((a, b) => rank[a.status] - rank[b.status]);
}

/* sleep math helpers */
function sleepSpanH(bed, wake, awakeMin = 0) {
  const m = (t) => { const [h2, m2] = t.split(":").map(Number); return h2 * 60 + m2; };
  let span = m(wake) - m(bed);
  if (span <= 0) span += 1440;
  return Math.max(0, +(((span - awakeMin) / 60)).toFixed(2));
}
function fmt12(t2) { if (!t2 || t2 === "—") return t2; const [a3, b3] = t2.split(":").map(Number); const ap = a3 >= 12 ? "PM" : "AM"; const h12 = a3 % 12 === 0 ? 12 : a3 % 12; return `${h12}:${String(b3 || 0).padStart(2, "0")} ${ap}`; }
function parseHM(t2) { const [a3, b3] = (t2 || "12:00").split(":").map(Number); return a3 + (b3 || 0) / 60; }
function todayMeds(s) {
  return (s.medsLog || []).find((x) => x.d === isoOf(todayStart())) || null;
}
function todayCaff(s) {
  const e2 = (s.caffLog || []).find((x) => x.d === isoOf(todayStart()));
  if (e2) return { mg: e2.mg, atH: parseHM(e2.at), at: e2.at, logged: true };
  if (s.sleep && s.sleep.caffMg != null) return { mg: s.sleep.caffMg, atH: 12, at: "12:00", logged: false };
  return null;
}
function caffAt(mg, doseHour, atHour) {
  if (!mg) return 0;
  let dt = atHour - doseHour;
  if (dt < 0) dt += 24;
  return Math.round(mg * Math.pow(0.5, dt / 5));
}

/* ---------- THE DEBRIEF ----------
   Held to the same standard as the NOW page: lead with what it means and what
   to do, plain voice, no jargon, and never a sentence that would read the same
   on a different lift. The version this replaced emitted three fixed templates
   per lift, so a six-lift day printed "First set felt like 2 reps in the tank —
   reserve banked, room above" six times word for word. That is filler wearing
   the costume of analysis. Rules for anything added here:

   1. A line must be able to come out DIFFERENT for a different lift. If it
      can't, it belongs in the summary once, or nowhere.
   2. Say why, not just what. "Next time asks for 10,9,7,7" is a readout; the
      reason it asks for that is the analysis.
   3. Volunteer nothing that is merely true. "Set of 6 — biggest single set" on
      a two-set lift buys no attribution — law 12 applies to sentences too.
   4. Read the shape honestly. Sets that ASCEND are not a fade. The old rule
      computed first-minus-last and called 5 → 6 "you barely faded". */
function fadeRead(reps) {
  if (reps.length < 2) return null;
  const first = reps[0], last = reps[reps.length - 1], drop = first - last;
  const peak = Math.max(...reps), peakAt = reps.indexOf(peak);
  const seq = reps.join(" → ");
  if (last > first) return `Sets went ${seq} — you climbed into it. Set ${reps.length} beat set 1, which usually means set 1 was a warm-up in disguise: start heavier, or take the opener closer in.`;
  if (peakAt > 0 && peak > first) return `Sets went ${seq} — you peaked on set ${peakAt + 1}, not set 1. The opener left something behind.`;
  if (drop === 0) return `Sets went ${seq} — dead flat. Nothing was near the limit; the whole lift had room.`;
  if (drop <= 1) return `Sets went ${seq} — barely faded. Strength held to the end, so the last set was not the wall.`;
  if (drop >= Math.max(3, Math.round(first * 0.3))) return `Sets went ${seq} — a steep drop of ${drop}. Those back sets cost full price; that is fatigue, not weakness.`;
  return `Sets went ${seq} — a normal fade of ${drop}.`;
}
function sessionDebrief(s, iso) {
  const sess = s.sessionLog[iso];
  if (!sess) return null;
  const dates = Object.keys(s.sessionLog).sort();
  const wasClean = cleanAtDate(s, iso);
  const night = s.sleep.nights.find((n) => n.d === isoOf(new Date(mk(iso).getTime() - DAY)));
  const rushedDay = paceRushed(sess);
  let sessLoad = 0, prevSessLoad = 0;
  const marks = { up: [], down: [], pr: [], hot: [], room: [], unrated: [] };
  const whys = [];
  const lifts = (sess.entries || []).map((e) => {
    const ex = exById(s, e.id);
    const name = ex ? ex.n : e.id;
    const reps = e.reps || [];
    const tot = reps.reduce((a, b) => a + b, 0);
    const lines = [];
    try {
      const prevD = dates.filter((d) => d < iso && (s.sessionLog[d].entries || []).some((x) => x.id === e.id)).pop();
      const prev = prevD ? (s.sessionLog[prevD].entries || []).find((x) => x.id === e.id) : null;
      const meta = ex && ex.lastMeta && ex.lastMeta.d < iso ? ex.lastMeta : null;
      const baseReps = prev ? prev.reps || [] : meta ? meta.reps : null;
      const baseTot = baseReps ? baseReps.reduce((a, b) => a + b, 0) : null;
      const baseW = prev && prev.w != null ? prev.w : meta ? meta.w : null;
      const heavier = e.w != null && baseW != null && Number(e.w) > Number(baseW);
      if (baseTot != null) {
        const dR = tot - baseTot;
        if (dR > 0) marks.up.push(name); else if (dR < 0) marks.down.push(name);
        const perSet = reps.map((r, i) => `${r}${baseReps[i] == null ? " (new set)" : r > baseReps[i] ? " (+" + (r - baseReps[i]) + ")" : r < baseReps[i] ? " (−" + (baseReps[i] - r) + ")" : " (=)"}`).join(" · ");
        lines.push(`${tot} reps, ${dR > 0 ? dR + " up on" : dR < 0 ? Math.abs(dR) + " down on" : "level with"} last time${heavier ? " — and the bar was heavier, so reps given back here are the price of the jump, not a step backwards" : ""}. Set by set: ${perSet}.`);
      } else lines.push(`${tot} reps — first time this lift is on record, so there is nothing to judge it against yet. This is the line everything later gets measured from.`);
      if (typeof e.w === "number") {
        const load = e.w * tot;
        sessLoad += load;
        const pLoad = typeof baseW === "number" && baseTot != null ? baseW * baseTot : null;
        if (pLoad) { prevSessLoad += pLoad; const pc = Math.round(((load - pLoad) / pLoad) * 100); lines.push(`Work done: ${load.toLocaleString()} lb (${pc >= 0 ? "+" : ""}${pc}% vs last time)${heavier && pc < 0 ? " — the heavier bar has not paid for the lost reps yet; on a jump this usually turns positive within two sessions" : ""}.`); }
        else lines.push(`Work done: ${load.toLocaleString()} lb.`);
        const allTots = dates.filter((d) => d <= iso).map((d) => { const x = (s.sessionLog[d].entries || []).find((y) => y.id === e.id); return x && String(x.w) === String(e.w) ? (x.reps || []).reduce((a, b) => a + b, 0) : null; }).filter((x) => x != null);
        if (allTots.length >= 2 && tot >= Math.max(...allTots)) {
          marks.pr.push(name);
          /* The confirmation line is now sized against HIS measured spread, and
             says the arithmetic out loud. A best that clears the old line by two
             standard errors banks on the spot; one inside it waits for a repeat.
             Sleep is not part of this sentence any more — see NOISE_NOTE. */
          const prev9 = allTots.slice(0, -1);
          const bn9 = beatsNoise(s, e.id, reps, prev9.length ? [Math.max(...prev9)] : null);
          const te9 = typicalError(s, e.id);
          lines.push(prev9.length && tot - Math.max(...prev9) >= 2 * te9.reps * Math.sqrt(Math.max(1, reps.length))
            ? `Best you have ever done at ${e.w} — and it clears the old line by ${tot - Math.max(...prev9)} reps against a spread of ±${te9.reps} per set, so it banks now rather than waiting for a repeat.`
            : `Best you have ever done at ${e.w} — pending one repeat. Your own set-to-set spread is ±${te9.reps} reps (${te9.src}), so a margin this size cannot yet be told apart from a good day. Nothing to do with how you slept.`);
        }
      }
      const fr = fadeRead(reps);
      if (fr) lines.push(fr);
      /* RIR is said once, and only where it carries something about THIS lift. */
      const rs = rirSetsOf(e);
      const opener = rs.length ? rs[0] : null;
      const term = rs.length > 1 ? rs[rs.length - 1] : null;
      if (term != null) {
        const nS = reps.length, lastR = reps[nS - 1];
        if (term === 0) lines.push(`Set ${nS} of ${nS} went to failure at ${lastR} reps, exactly as the taper asks — that is the set that buys the next weight.`);
        else { marks.room.push(name); lines.push(`Set ${nS} of ${nS} stopped at ${lastR} with ${term} left. That is the set prescribed to reach failure, so ${term >= 2 ? `you paid the fatigue for roughly ${term} more reps and did not collect them` : "you were one rep short of collecting all of it"}.`); }
      } else {
        marks.unrated.push(name);
        if (opener === 0) { marks.hot.push(name); lines.push(`Opener ground out at 0. That is the one reading that can freeze the load, because a grind is not an earn.`); }
      }
      const laterPrint = dates.some((d) => d > iso && (s.sessionLog[d].entries || []).some((x) => x.id === e.id));
      if (!laterPrint && ex) {
        const step = progressStep(ex);
        const t2 = targetsFor(ex, s);
        /* The reason clause is collected, not printed, so that a reason shared by
           EVERY lift gets hoisted into the summary and said once. Six lifts on
           one short-sleep day used to print the same excuse six times. */
        whys.push(step.why);
        lines.push({ t: "next", add: step.add, why: step.why, text: `Next time: ${t2.join(", ")} at ${ex.w}` });
        const upW = typeof ex.w === "number" ? nextLoad(ex) : null;
        if (ex.hi && upW != null && !ex.std && !ex.reclaim && !ex.ladder) {
          const gate = Array.from({ length: ex.sets }, (_, i) => Math.max(1, ex.hi - i));
          const gap = gate.reduce((a2, g, i) => a2 + Math.max(0, g - (t2[i] ?? 0)), 0);
          if (gap === 0) lines.push(`That line IS the top of the window — hit it on clean sleep without grinding the opener and ${upW} queues itself.`);
          else if (step.add > 0) { const n2 = Math.ceil(gap / step.add); lines.push(`${gap} more rep${gap === 1 ? "" : "s"} above that and ${upW} queues itself — about ${n2} more session${n2 === 1 ? "" : "s"} at the current step.`); }
        } else if (ex.hi && typeof ex.w === "number" && loadRungs(ex) && !ex.std && !ex.reclaim) {
          lines.push(`${ex.w} is the top rung this machine makes — reps are the only progression left here until the exercise changes.`);
        }
      }
    } catch (err) { if (!lines.length) lines.push(`${tot} total reps.`); }
    return { n: name, lines };
  });
  const totalReps = (sess.entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0);
  const sameType = dates.filter((d) => d < iso && dayType(d) === dayType(iso));
  const typeTots = sameType.map((d) => (s.sessionLog[d].entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0)).sort((a, b) => a - b);
  const med = typeTots.length ? typeTots[Math.floor(typeTots.length / 2)] : null;
  /* Resolve the deferred "Next time" lines. A reason every lift shares is a
     fact about the SESSION, not about any lift, so it is said once up top and
     struck from all of them. Rule 1: a line that cannot come out different for
     a different lift does not belong on the lift. */
  const sharedWhy = whys.length > 1 && whys.every((w) => w === whys[0]) ? whys[0] : null;
  lifts.forEach((L) => {
    L.lines = L.lines.map((l) => {
      if (typeof l === "string") return l;
      const tail = l.add === 0 ? " — unchanged" : ` — ${l.add} rep${l.add === 1 ? "" : "s"} added`;
      return `${l.text}${tail}${sharedWhy ? "" : `, because ${l.why}`}.`;
    });
  });
  const loadPc = prevSessLoad ? Math.round(((sessLoad - prevSessLoad) / prevSessLoad) * 100) : null;
  const nLift = (sess.entries || []).length;
  const summary = [];
  /* The read first — one sentence saying what this session WAS. */
  summary.push((() => {
    if (marks.pr.length >= 2) return `A strong day: your best ever at this weight on ${marks.pr.length} lifts (${marks.pr.join(", ")}).`;
    if (marks.pr.length === 1) return `${marks.pr[0]} was the story — your best ever at that weight.`;
    if (loadPc != null && loadPc <= -8 && marks.down.length > marks.up.length) return `A down day: ${marks.down.length} of ${nLift} lifts gave back reps and total work fell ${Math.abs(loadPc)}%. Worth knowing why before reading anything into it.`;
    if (marks.up.length > marks.down.length) return `A quietly good day — ${marks.up.length} lifts up, ${marks.down.length} down.`;
    if (!marks.up.length && !marks.down.length) return `Baseline day — nothing here has a comparison yet.`;
    return `A holding day — ${marks.up.length} up, ${marks.down.length} down, nothing decided either way.`;
  })());
  /* Then the one thing that explains it, if there is one. */
  if (!wasClean) summary.push(`Short sleep${night ? ` (${night.h} h)` : ""} — worth about 3% on a heavy set and closer to 10% on a long one, so it is the likeliest reason for anything down here. It does not cost you anything else: the reps count, a record can still bank, and the step is still sized by what you had left. What the flag buys is that today cannot be read as a stall.`);
  else if (rushedDay) summary.push(`You logged this one rushed. Short rest costs reps on the back sets, so nothing here counts toward a stall.`);
  else summary.push(`Normal sleep, unhurried — nothing here needs discounting.${night ? ` ${night.h} h into it.` : ""}`);
  summary.push(`${nLift} lifts · ${totalReps} reps${med ? ` (your usual ${dayType(iso) === "U" ? "upper" : "lower"} day: ~${med})` : ""}${sessLoad ? ` · ${sessLoad.toLocaleString()} lb moved${loadPc != null ? ` (${loadPc >= 0 ? "+" : ""}${loadPc}% vs the same lifts last time)` : ""}` : ""}.`);
  /* Cross-lift reads. Each earns its place by needing more than one lift to see. */
  if (marks.room.length >= 2) summary.push(`${marks.room.length} lifts finished with reps left on the set that is meant to reach failure (${marks.room.join(", ")}). Muscle growth tracks how close a set ends to failure, so that is the cheapest thing on this page to fix — and the app has already sized bigger steps there because of it.`);
  if (nLift && marks.unrated.length === nLift) summary.push(`No last-set ratings anywhere today, so every step below defaults to a single rep. Rating the final set is what lets the app size the jump to what you actually had left.`);
  else if (marks.unrated.length >= 2) summary.push(`${marks.unrated.length} lifts have no last-set rating (${marks.unrated.join(", ")}) — those default to the smallest step until the terminal set is on file.`);
  if (marks.hot.length) summary.push(`Opener ground out at 0 on ${marks.hot.join(", ")}. Two in a row and the load holds itself — that is the governor, not a punishment.`);
  if (sharedWhy) summary.push(`Every lift here steps the same way, for the same reason: ${sharedWhy}.`);
  if (sess.niggles && sess.niggles.length) summary.push(`Watch list: ${sess.niggles.join(" · ")} — three flags in three weeks and it goes to your coach as a pattern, not a day.`);
  if (sess.note) summary.push(`Your note: \u201c${sess.note}\u201d`);
  return { lifts, summary };
}

/* per-set RIR prescription — literature base, tuned by his own logs */
function rirPlan(s, ex, slp) {
  const n = ex.sets || (ex.tgt ? ex.tgt.length : ex.target ? ex.target.length : ex.last ? ex.last.length : 3);
  let plan = Array.from({ length: n }, (_, i) => (i === n - 1 ? 0 : i === 0 ? 2 : 1));
  const why = [];
  /* The short-sleep RIR pull is deleted — see SLEEP_HOLD_NOTE in liftCall.
     Proximity to failure is THE hypertrophy variable in the dose-response
     literature; backing the terminal set off to 1 RIR on a short night traded
     the one thing that reliably drives growth for a -2.85% strength effect that
     sits inside the test-retest noise. It also fired on roughly one morning in
     three, which made "the set that reaches failure" a set that often did not.
     Effort is defended; the night is a receipt, not a governor. */
  if (ex.holdFlag) { plan = plan.map((r) => Math.max(r, 2)); why.push("governor hold — stay two clean reps back"); }
  const opens = Object.values(s.sessionLog).flatMap((sl) => (sl.entries || []).filter((e) => e.id === ex.id && e.rir != null).map((e) => e.rir)).sort((a, b) => a - b);
  if (opens.length >= 3 && opens[Math.floor(opens.length / 2)] <= 0) { plan = plan.map((r, i) => (i === 0 ? r + 1 : r)); why.push("your openers run hot on this lift — bank one early"); }
  return { plan, why };
}

/* THE WEEK IN REVIEW — the coaching read, written by the data */
function weekReview(s) {
  const endD = todayStart();
  const winStart = isoOf(new Date(endD.getTime() - 6 * DAY));
  const endISO = isoOf(endD);
  const inWin = (d) => d >= winStart && d <= endISO;
  const dls = Object.entries(s.dailyLogs).filter(([d]) => inWin(d));
  const proN = dls.filter(([, v]) => v.pro != null).length;
  const proTgtW = proteinTarget(s).lo;
  const proHit = dls.filter(([, v]) => proteinHit(proTgtW, v.pro)).length;
  const sess = Object.keys(s.sessionLog).filter(inWin);
  const wins = s.feed.filter((f) => inWin(f.d) && /OWNED|DEBUT|EARNED|RECLAIM|ZERO-COMP|RESET COMPLETE/.test(f.t));
  const nights = s.sleep.nights.filter((n) => inWin(n.d));
  const cleanN = nights.filter((n) => n.h >= s.sleep.cleanH).length;
  const fixes = s.feed.filter((f) => inWin(f.d) && f.t.indexOf("FIX WINDOW CLOSED") === 0).length;
  const holds = s.exercises.filter((e) => e.holdFlag).length;
  const cur = currentRate(s);
  const sealedNow = blackoutOn(s);
  const props = (s.proposals || []).filter((p) => !p.applied && !p.dismissed);
  const appliedAdj = s.feed.filter((f) => inWin(f.d) && /(PROPOSAL|EASE|RATE RULE|4TH SET|UNI|OVERRIDDEN)/.test(f.t)).length;
  const adjLine = props.length
    ? `adjustments armed on NOW: ${props.slice(0, 2).map((p) => p.t || p.id).join(" · ")} — one tap applies`
    : appliedAdj
    ? `adjustments this week: ${appliedAdj} — all filed in the story, all reversible`
    : sealedNow
    ? "adjustments: rate rules muted under the seal — they re-arm with Monday's clean read"
    : "adjustments: none needed — targets moved themselves per-session, the band is holding";
  const lines = [
    `protein ${proHit}/${proN} on target${fixes ? ` · ${fixes} fix window${fixes > 1 ? "s" : ""} closed same-day` : ""}`,
    `${sess.length} session${sess.length === 1 ? "" : "s"} logged · ${wins.length} win${wins.length === 1 ? "" : "s"} filed${holds ? ` · ${holds} lift on hold` : ""}`,
    `sleep ${cleanN}/${nights.length} clean${sealedNow ? " · scale sealed — verdict Monday" : cur.measured ? ` · rate ~${cur.fat}/wk vs band ${s.rate.band.join("–")}` : ""}`,
    adjLine,
  ];
  let verdict;
  if (proN + sess.length + nights.length === 0) verdict = "A quiet week on the log — the return is the whole skill, and the door is open.";
  else if (sealedNow) verdict = "Sealed week: adherence carried it while the scale sat quarantined — Monday's read inherits a clean house.";
  else if (cur.measured && cur.fat >= s.rate.band[0] && cur.fat <= s.rate.band[1] && wins.length) verdict = "Textbook week: strength moved while the trend held the corridor.";
  else if (proN && proHit / proN >= 0.7 && sess.length >= 3) verdict = "The boring, winning kind of week — the kind that compounds.";
  else verdict = "Mixed week, honestly logged — the ledger's favorite kind to coach from.";
  return { wk: weekDay().wk, window: `${fmtShort(winStart)} – ${fmtShort(endISO)}`, lines, verdict };
}

/* events resolve themselves — the coach closes its own loops */
function closeEvent(s, evId, zero) {
  const ns = JSON.parse(JSON.stringify(s));
  const e = ns.events.find((x) => x.id === evId);
  if (!e) return ns;
  e.estimated = true;
  const tI = isoOf(todayStart());
  if (zero) {
    ns.zeroComp = { count: ns.zeroComp.count + 1, last: `${e.t} · ${fmtShort(e.d)}` };
    ns.feed.unshift({ d: tI, t: `ZERO-COMP EVENT #${ns.zeroComp.count}`, how: `${e.t} — estimated once, after · targets unchanged tomorrow · no penance` });
  } else {
    ns.zeroComp = { count: 0, last: `reset · ${e.t}` };
    ns.feed.unshift({ d: tI, t: "EVENT LOGGED HONEST", how: `${e.t} — off-plan, named without ceremony · streak restarts at 0 · targets unchanged tomorrow, because penance does not exist here` });
  }
  return ns;
}
/* your refeeds' measured next-morning bumps */
function refeedBumps(s) {
  const out = [];
  s.reads.forEach((r) => {
    if (r.sealed || dayType(r.d) !== "REFEED") return;
    const nx = s.reads.find((x) => x.d === isoOf(new Date(mk(r.d).getTime() + DAY)) && !x.sealed);
    if (nx) out.push(+(nx.w - r.w).toFixed(1));
  });
  return out;
}

/* onset latency — median of measured, honest default until data */
function medianSOL(s) {
  const sols = s.sleep.nights.filter((n) => n.sol != null).slice(-14).map((n) => n.sol).sort((a, b) => a - b);
  if (sols.length < 5) return 15;
  return sols[Math.floor(sols.length / 2)];
}
/* ---------- LIGHTS_OUT_NOTE — the second bedtime the app was printing ----------
   This derived lights-out by counting backwards from s.sleep.anchor.wake, which
   is the authored 06:45 the sleep audit removed everywhere else. The result was
   two bedtimes in one app: the sleep card said "THE LEVER — lights out 1:20 AM"
   from his measured clock, while NOW's daily protocol said "lights out ~10:35 PM,
   wake ~6:45 AM" from the constant. Two hours forty-five minutes apart, same day,
   same screen session. Whichever he believed, the other one was lying to him.

   It also poisoned the caffeine tail: evaluating residual mg at 22:35 instead of
   his real ~01:45 overstated what is still aboard at lights-out by roughly half.

   The wake reference is now his measured median, and the target is his own
   cleanH rather than a separate asleepTarget that nothing else reads. The
   authored anchor survives only as a fallback for a state with no timed nights,
   which is the one case where there is genuinely nothing better to use. */
function lightsOutT(s) {
  const ov = ((s.dayCtx || {})[isoOf(todayStart())] || {}).lightsOut;
  const an = sleepAnchor(s);
  const target = an.measured ? an.target : (((s.sleep || {}).anchor || {}).asleepTarget || ((s.sleep || {}).cleanH) || 8);
  const sol = an.measured && an.sol != null ? an.sol : medianSOL(s);
  if (ov) { const [oh, om] = ov.split(":").map(Number); return { t: ov, mins: oh * 60 + om, target, sol, override: true, wakeRef: an.measured ? an.wake : ((s.sleep || {}).anchor || {}).wake }; }
  const wakeRef = an.measured ? an.wake : (((s.sleep || {}).anchor || {}).wake || "07:30");
  const wm = wakeRef.split(":").map(Number);
  let lo = wm[0] * 60 + wm[1] - Math.round(target * 60) - sol;
  lo = ((lo % 1440) + 1440) % 1440;
  return { t: `${String(Math.floor(lo / 60)).padStart(2, "0")}:${String(lo % 60).padStart(2, "0")}`, mins: lo, sol, target, wakeRef, measured: an.measured };
}

/* THE SLEEP LAB — experiments running on the master variable */
function sleepLab(s) {
  const out = [];
  const exp = s.sleep.melaExp || { started: "2026-07-23", arm: "none" };
  const post = s.sleep.nights.filter((n) => n.d >= exp.started);
  const noneN = post.filter((n) => !(n.tags || []).includes("mela"));
  const melaN = post.filter((n) => (n.tags || []).includes("mela"));
  const pre = s.sleep.nights.filter((n) => n.d < exp.started);
  const avg = (a) => (a.length ? +(a.reduce((x, y) => x + y.h, 0) / a.length).toFixed(2) : null);
  const wokeRate = (a) => (a.length ? Math.round(100 * a.filter((n) => (n.tags || []).includes("woke")).length / a.length) : null);
  out.push({ id: "melaexp", t: "MELATONIN EXPERIMENT — ARM 1: NONE", status: noneN.length >= 7 ? "LIVE" : "ARMED", prog: { n: noneN.length, need: 7, label: "nights off melatonin" },
    tag: "Do you need the pill at all? Pre-registered " + fmtShort(exp.started) + ".",
    deep: "Baseline on file: 5 mg most nights, waking ~6 h in — right where a 5 mg bolus finishes clearing (half-life ~40–60 min). The literature says melatonin's average effect is minutes, not hours (Ferracioli-Oda 2013: ~7 min faster onset), it works as a clock signal at 0.3–0.5 mg (Zhdanova), and OTC labels are unreliable (−83% to +478% measured content). Arm 1 removes it entirely. If a low-dose arm is ever warranted — onset consistently ballooning past ~30–40 min — it gets pre-registered the same way.",
    forYou: (() => {
      const solAvg = (arr) => { const v = arr.filter((n) => n.sol != null); return v.length ? Math.round(v.reduce((a, n) => a + n.sol, 0) / v.length) : null; };
      return noneN.length >= 7
        ? `Off melatonin: avg ${avg(noneN)} h ASLEEP over ${noneN.length} nights (baseline ${avg(pre) ?? "—"} h)${solAvg(noneN) != null ? ` · drifting off in ~${solAvg(noneN)} min` : ""} · mid-night wakes ${wokeRate(noneN)}% of nights. ${solAvg(noneN) != null && solAvg(noneN) > 35 ? "Onset is the one signature where the 0.5 mg-early arm earns a trial — prescriber conversation attached." : avg(noneN) != null && avg(pre) != null && avg(noneN) >= avg(pre) ? "The pill was doing nothing you'll miss — case closing." : "Wake pattern persisting off the pill shifts suspicion to the caffeine tail or deficit-cortisol — next lever below."}`
        : `${noneN.length}/7 nights banked. Onset now measures itself from your drift-off entry — the low-dose trigger (>35 min) is finally a number, not a guess. Tonight counts.`;
    })(),
    lines: [] });
  const woke = post.filter((n) => (n.tags || []).includes("woke"));
  out.push({ id: "wakesig", t: "WAKE SIGNATURE", status: woke.length >= 5 ? "LIVE" : "ARMED", prog: { n: woke.length, need: 5, label: "tagged mid-night wakes" },
    tag: "Is the 6-hour wake a pattern with an address, or noise?",
    deep: "Every mid-night wake you tag carries a duration. Enough of them reveal whether the wakes cluster (a clock/clearance signature pointing at melatonin timing or the caffeine tail) or scatter (ordinary arousals everyone has and forgets). Deficit-cortisol wakes — the 3–4 a.m. classic in deep cuts — are also on the suspect list, and the pre-bed protein feed is their counter.",
    forYou: woke.length >= 5 ? `${woke.length} tagged wakes · avg ${Math.round(woke.reduce((a, n) => a + (n.awakeMin || 30), 0) / woke.length)} min awake · on ${wokeRate(post)}% of nights. Persisting off melatonin = caffeine-tail or cortisol; tell me and the clock-time capture ships.` : `${woke.length}/5 — may this one starve. Tag honestly; untagged solid nights are data too.`,
    lines: [] });
  /* variance tax — deviation from your own median bedtime, priced */
  (() => {
    const mins2 = (t) => { const [a2, b2] = t.split(":").map(Number); let m2 = a2 * 60 + b2; if (m2 < 720) m2 += 1440; return m2; };
    const timed = s.sleep.nights.filter((n) => n.bed).slice(-30);
    const med = (arr) => { const v = arr.slice().sort((a2, b2) => a2 - b2); return v.length ? v[Math.floor(v.length / 2)] : null; };
    const mB = med(timed.map((n) => mins2(n.bed)));
    const nd2 = (d) => isoOf(new Date(mk(d).getTime() + DAY));
    const bucket = (lo2, hi2) => timed.filter((n) => { const dv = Math.abs(mins2(n.bed) - mB); return dv >= lo2 && (hi2 == null || dv < hi2); });
    const onT = mB != null ? bucket(0, 31) : [];
    const offT = mB != null ? timed.filter((n) => Math.abs(mins2(n.bed) - mB) > 45) : [];
    const avgH = (a2) => (a2.length ? +(a2.reduce((x2, n) => x2 + n.h, 0) / a2.length).toFixed(1) : null);
    const reps2 = (a2) => { const v = a2.map((n) => s.sessionLog[nd2(n.d)]).filter(Boolean).map((sl2) => (sl2.entries || []).reduce((x2, e2) => x2 + (e2.reps || []).reduce((p2, q2) => p2 + q2, 0), 0)); return v.length >= 3 ? Math.round(v.reduce((x2, y2) => x2 + y2, 0) / v.length) : null; };
    const live2 = onT.length >= 5 && offT.length >= 5;
    const dH = live2 ? +(avgH(offT) - avgH(onT)).toFixed(1) : null;
    const rOn = live2 ? reps2(onT) : null, rOff = live2 ? reps2(offT) : null;
    out.push({ id: "variancetax", t: "THE VARIANCE TAX", status: live2 ? "LIVE" : "ARMED", prog: { n: Math.min(onT.length, offT.length), need: 5, label: "timed nights per bucket (on-schedule vs 45+ min off)" },
      tag: "Life will move your bedtime — this measures what each move costs YOU.",
      deep: "Regularity research (Phillips 2017 onward) says timing scatter predicts outcomes about as strongly as duration — but that's a population claim. This instrument prices YOUR scatter: every timed night is measured against your own rolling median bedtime, bucketed on-schedule (within 30 min) vs off (45+ min), then the buckets are compared on hours slept and next-day session output. If the tax is real in you, the anchor earns its keep with receipts; if it's tiny, the app relaxes about bedtime honestly. Either verdict is a win — and the aim-time on NOW is a bearing, never a test.",
      forYou: live2
        ? `Off-schedule nights (${offT.length}) vs on-schedule (${onT.length}): ${dH > 0 ? "+" : ""}${dH} h sleep${rOn != null && rOff != null ? ` · next-day output ${rOff - rOn >= 0 ? "+" : ""}${rOff - rOn} reps` : ""} (measured). ${dH <= -0.5 || (rOn != null && rOff != null && rOff - rOn <= -5) ? "The tax is real in you — drifting bedtime costs actual iron; the anchor is earning its keep." : "The tax runs small so far — your system absorbs bedtime drift better than the literature's average. The anchor stays a bearing, not a leash."}`
        : `${Math.min(onT.length, offT.length)}/5 per bucket. It funds itself from the bed times you already log — ordinary messy life fills the off-schedule arm without you trying. No behavior required except honesty.`,
      lines: [] });
  })();
  return out;
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
function theOneThing(s, slp, hour = new Date().getHours(), graceDays = Infinity) {
  const tISO = isoOf(todayStart());
  const owed = owedNights(s, hour);
  const slLogged = owed.length === 0;
  const dLogged = s.dailyLogs[tISO] && s.dailyLogs[tISO].cal != null;
  const dt = dayType(tISO, s);
  const trainToday = dt === "U" || dt === "L";
  const sessDone = !!s.sessionLog[tISO];
  if (!slLogged) {
    const flips = !slp.clean && slp.run + 1 >= slp.need;
    return { t: `Log ${fmtShort(owed[0])}'s night`, sub: flips ? "one tap — ≥7.5 flips you CLEAN and today's attempts count for keeps" : "one tap — the whole engine keys off it" };
  }
  if (s.fixWindow && !dLogged) return { t: "Fix window is open", sub: `hit ${proteinTarget(s).g} today and yesterday's miss becomes a save — bouncing back is the skill being scored` };
  const openEv = s.events.find((e) => !e.estimated && daysUntil(e.d) < 0 && daysUntil(e.d) >= -graceDays);
  if (openEv) return { t: "Close out " + openEv.t, sub: "zero-comp or honest — one tap, the ledger doesn't guess" };
  if (trainToday && sessDone && !dLogged && hour < 17) return { t: "Session banked ✓ — day open", sub: "numbers close it tonight · everything else is reading" };
  if (trainToday && !sessDone && hour >= 10) { const g = genSession(s, tISO, slp); return { t: "Today: " + (g.structural || g.name), sub: "log it in TRAIN when the iron's down" }; }
  if (!dLogged && hour >= 17) return { t: "Close the day", sub: "cal · protein · steps — pre-filled to targets, adjust and tap" };
  if (!dLogged) return { t: "Day open — nothing owed yet", sub: "numbers close it tonight · everything else is optional reading" };
  const lo2 = lightsOutT(s);
  /* wake reference comes off lightsOutT, which now reads his measured median
     rather than the authored 06:45 — see LIGHTS_OUT_NOTE. */
  return { t: "Everything's banked ✓", sub: (slp.clean ? "protect the streak" : "tonight rebuilds the reset") + ` — lights out ${fmt12(lo2.t)}, up ${fmt12(lo2.wakeRef || "07:30")}` };
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
    return { wk, live: true, rows, days: rows.map((r) => r.d), range: `${fmtShort(startD)} – ${fmtShort(endD)}`,
      avgW: ws.length ? +avg(ws).toFixed(1) : null, avgCal: cals.length ? Math.round(avg(cals)) : null,
      avgPro: pros.length ? Math.round(avg(pros)) : null, proHit: pros.filter((x) => proteinHit(proteinTarget(s).lo, x)).length, proN: pros.length,
      avgSteps: st.length ? +(avg(st) / 1000).toFixed(1) : null, avgSlp: sl.length ? +avg(sl).toFixed(1) : null, flags: 0 };
  });
}

/* ---------- DEBT_NOTE — what "short sleep" has to mean to be worth flagging ----------
   This asked for three consecutive nights at or above his 7.5 h TARGET. On the
   record that produced 3 qualifying days out of 42 and zero clean sessions ever:
   his modal night is exactly 7.0 h — 17 of 42 — so the gate sat half an hour
   above where his sleep actually lives, and a flag that fires 93% of the time is
   not a flag, it is a constant.

   Two different questions were being answered by one number:

   1. Is he sleeping as much as he should? That is 7.5 h, it is his target, and
      it belongs to the sleep score and the lean-mass argument. Nedeltcheva 2010
      is the citation there — 5.5 h vs 8.5 h in a deficit shifted 60% more of the
      loss onto fat-free mass — and it is a NUTRITION finding, not a session one.
   2. Was last night short enough to depress this session measurably? That is a
      performance question and it has its own literature, which does not live at
      7 h. Craven 2022's protocols run 3-5.5 h; Knowles 2022 ran nine straight
      nights at 5 h and volume load fell under 1%; Gong 2024 finds start-of-night
      restriction indistinguishable from zero (d=-0.25, 95% CI -0.53 to +0.04).

   So the performance flag now sits where the performance evidence sits: a night
   under 6.5 h, or a three-night mean under 7. On his record that flags roughly
   one day in eight instead of eight in eight, which is what a flag is for.

   Also fixed: "back to back" now checks the calendar. The old loop walked
   backwards through the ARRAY, so a night he simply did not log counted as
   consecutive with the one before the gap. */
const DEBT_LAST_H = 6.5;
const DEBT_MEAN3_H = 7.0;
function nightsBefore(s, iso) {
  return (((s || {}).sleep || {}).nights || []).filter((n) => n.d < iso).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
}
function cleanAtDate(s, iso) {
  const nights = nightsBefore(s, iso);
  if (!nights.length) return true;
  const last = nights[nights.length - 1];
  if (last.h < DEBT_LAST_H) return false;
  /* three CALENDAR-consecutive nights ending last night, if we have them */
  const run = [last];
  for (let i = nights.length - 2; i >= 0 && run.length < 3; i--) {
    if (Math.round((mk(run[0].d) - mk(nights[i].d)) / DAY) !== 1) break;
    run.unshift(nights[i]);
  }
  if (run.length < 3) return true;
  return run.reduce((a, b) => a + b.h, 0) / run.length >= DEBT_MEAN3_H;
}
/* Is he hitting his sleep TARGET? A separate question from the one above, and
   the one the sleep score, the lights-out nudge and the lean-mass line ask. */
function atSleepTarget(s, iso) {
  const nights = iso ? nightsBefore(s, iso) : (((s || {}).sleep || {}).nights || []);
  let run = 0;
  for (let i = nights.length - 1; i >= 0; i--) {
    if (i < nights.length - 1 && Math.round((mk(nights[i + 1].d) - mk(nights[i].d)) / DAY) !== 1) break;
    if (nights[i].h >= s.sleep.cleanH) run++; else break;
  }
  return { run, at: run >= s.sleep.needed };
}

/* ---------- SLEEP_LEVER_NOTE — which end of the night is actually the lever ----------
   The app told him "fixed wake time is the strongest single move" and defaulted
   his inputs to bed 23:00 / wake 06:45. He has never logged either. On the six
   nights with times on file his bed sits at 01:38 with a 20-minute spread and
   his wake at 08:53 with a 43-minute spread — so bedtime is already the STABLE
   end and wake is the variable one. Both of his short nights were a late bed
   plus an early rise.

   That inverts the advice. Telling a man whose wake time is the noisy variable
   to fix his wake time is asking him to control the end of the night he
   controls least, and it leaves the hour of slack sitting untouched at the
   other end. Sleep opportunity is bounded by lights-out; you cannot make up at
   the back what you did not start at the front.

   So this returns HIS measured anchors and does the arithmetic out loud: at his
   own median wake, what bedtime clears the target, and how far that is from
   where he actually goes to bed. No authored times anywhere. */
const SLEEP_ANCHOR_MIN_N = 3;
function hmToMin(t) { if (!t || t.indexOf(":") < 0) return null; const [a, b] = t.split(":").map(Number); if (!isFinite(a) || !isFinite(b)) return null; return a * 60 + b; }
function minToHM(m) { const x = ((Math.round(m) % 1440) + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, "0") + ":" + String(x % 60).padStart(2, "0"); }
function medOf(a) { const b = a.slice().sort((x, y) => x - y); return b.length ? (b.length % 2 ? b[(b.length - 1) / 2] : (b[b.length / 2 - 1] + b[b.length / 2]) / 2) : null; }
function sdOf(a) { if (a.length < 2) return null; const m = a.reduce((p, c) => p + c, 0) / a.length; return Math.sqrt(a.reduce((p, c) => p + (c - m) * (c - m), 0) / a.length); }
function sleepAnchor(s) {
  const nights = (((s || {}).sleep || {}).nights || []).filter((n) => n.bed && n.wake).slice(-14);
  const target = ((s || {}).sleep || {}).cleanH || 7.5;
  if (nights.length < SLEEP_ANCHOR_MIN_N) {
    return { n: nights.length, measured: false, target, bed: null, wake: null,
      why: `${SLEEP_ANCHOR_MIN_N - nights.length} more night${SLEEP_ANCHOR_MIN_N - nights.length === 1 ? "" : "s"} with bed and wake times and this reads off your own clock instead of a guess.` };
  }
  /* bedtimes after midnight sort as small numbers; shift them past 24 h so a
     01:40 bed is LATER than a 23:00 bed rather than 21 hours earlier. */
  const beds = nights.map((n) => { const m = hmToMin(n.bed); return m == null ? null : (m < 12 * 60 ? m + 1440 : m); }).filter((v) => v != null);
  const wakes = nights.map((n) => hmToMin(n.wake)).filter((v) => v != null);
  if (beds.length < SLEEP_ANCHOR_MIN_N || wakes.length < SLEEP_ANCHOR_MIN_N) return { n: nights.length, measured: false, target, bed: null, wake: null, why: "not enough clock times on file yet." };
  const bedMed = medOf(beds), wakeMed = medOf(wakes);
  const bedSD = sdOf(beds), wakeSD = sdOf(wakes);
  /* the honest average latency: what he actually reports falling asleep in */
  const sols = nights.map((n) => (typeof n.sol === "number" ? n.sol : null)).filter((v) => v != null);
  const sol = sols.length ? medOf(sols) : 15;
  /* the bedtime that clears target at HIS OWN median wake */
  const needBedMin = (wakeMed + 1440) - target * 60 - sol;
  const shiftMin = Math.round(bedMed - needBedMin);
  const cur = +(((wakeMed + 1440) - bedMed - sol) / 60).toFixed(2);
  return {
    n: nights.length, measured: true, target, sol: Math.round(sol),
    bed: minToHM(bedMed), wake: minToHM(wakeMed),
    bedSDmin: bedSD == null ? null : Math.round(bedSD), wakeSDmin: wakeSD == null ? null : Math.round(wakeSD),
    needBed: minToHM(needBedMin), shiftMin, curH: cur,
    /* which end is the lever: the one he already holds steady is the one he can
       move on purpose. Steadier end wins; ties go to bed, because sleep
       opportunity is bounded at the front. */
    lever: bedSD != null && wakeSD != null && wakeSD < bedSD - 5 ? "wake" : "bed",
    why: shiftMin <= 0
      ? `Your own clock already clears it: bed ${minToHM(bedMed)}, up ${minToHM(wakeMed)} is ${cur} h.`
      : `You go to bed ${minToHM(bedMed)} and get up ${minToHM(wakeMed)} — ${cur} h. To clear ${target} h without getting up later, lights out ${minToHM(needBedMin)}: ${shiftMin} minutes earlier.`,
  };
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
        if (delta < 0) { const ex = exById(s, e.id); out.push({ txt: `${ex ? ex.n : e.id} ${fmtShort(d)}: ${e.reps.join(",")} vs clean ${pe.reps.join(",")} — ${delta} reps after a short night`, live: true }); }
        break;
      }
    });
  });
  return [...seeded, ...out];
}

/* THE SHELF — established literature, imported as priors, computed at his numbers. The LAB tests; the shelf informs. */
function shelfItems(s) {
  const kg = +(s.trend / 2.205).toFixed(1);
  const proTgtS = proteinTarget(s).g;
  const perFeed = Math.round(proTgtS / 4);
  const out = [];
  out.push({ id: "spread", t: "PROTEIN SPREAD", status: "ON FILE",
    tag: `${proTgtS} works harder split into 4.`,
    lines: [`~${perFeed} g × 4 feeds · every 3–4 h · wake / pre-lift / post-lift / pre-bed`],
    deep: "Areta et al. 2013 (J Physiol): 20 g every 3 h beat both 40 g every 6 h and 10 g every 1.5 h for 24-hour muscle protein synthesis at equal totals. Mamerow et al. 2014: even distribution across meals out-synthesized the typical dinner-skewed pattern. In a deficit, distribution is muscle protection — the same grams, better spent.",
    forYou: `No new logging — this is a shape, not a chore. Your noon lift makes the anchors natural: feed ~1 h pre-lift, feed after, and keep the last feed near bed (slow protein there works with the overnight fast). Four ~${perFeed} g landings and the day's ${proTgtS} places itself.` });
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

/* THE OUTSIDE-THE-BOX WING — thirteen auto-running instruments. Each defensive: one failing card never darkens the lab. */
function labAnalytics2(s) {
  const out = [];
  const add = (fn) => { try { const c = fn(); if (c) out.push(c); } catch (e) {} };
  const allDaily = [...HISTORY.map((h) => ({ d: h.d, cal: h.cal, pro: h.pro, steps: h.steps })), ...Object.entries(s.dailyLogs).map(([d, v]) => ({ d, ...v }))].filter((x) => x.cal != null);
  const nightOf = (d) => s.sleep.nights.find((n) => n.d === d);
  const prevISO = (d) => isoOf(new Date(mk(d).getTime() - DAY));
  const sessDates = Object.keys(s.sessionLog).sort();
  const totReps = (d) => ((s.sessionLog[d] || {}).entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0);
  const kg = s.trend / 2.205;

  /* 1 · adaptation meter */
  add(() => {
    const obs = observedTDEE(s);
    const bmr = Math.round(10 * kg + 6.25 * 178 - 5 * 24 + 5);
    const pred = Math.round(bmr * 1.55);
    return { id: "adaptmeter", t: "THE ADAPTATION METER", status: obs ? "LIVE" : "ARMED", prog: { n: obs ? 1 : 0, need: 1, label: "observed maintenance (prints with clean post-seal weeks)" },
      tag: "How much has the deficit slowed your engine, in kcal?",
      deep: "Predicted burn = Mifflin-St Jeor at your live weight (BMR ~" + bmr + ") × 1.55 for your activity pattern — a textbook estimate, stated as such. Observed burn = the maintenance your own ledger measures. The gap is adaptive thermogenesis: the metabolic slowdown dieting causes. It's the single number that sizes September's reverse — eat to the OBSERVED number fast, then build.",
      forYou: obs ? `Textbook says ~${pred}. Your ledger says ~${obs.tdee}. Adaptation: ~${pred - obs.tdee > 0 ? pred - obs.tdee : 0} kcal — ${pred - obs.tdee > 250 ? "real but normal for week " + weekDay().wk + "; the MATADOR card is the counter-move." : "small. Your engine is holding remarkably well."}` : "Arms with the first clean post-seal maintenance print (Mon 7/27+). The textbook half is already computed and waiting.",
      lines: [] };
  });

  /* 2 · strength velocity */
  add(() => {
    const perLift = {};
    sessDates.forEach((d) => ((s.sessionLog[d] || {}).entries || []).forEach((e) => { if (e.w != null && e.reps && e.reps.length) (perLift[e.id] = perLift[e.id] || []).push({ d, load: e.w * e.reps.reduce((a, b) => a + b, 0) }); }));
    const ready = Object.entries(perLift).filter(([, v]) => v.length >= 4);
    const best = ready.map(([id, v]) => { const first = v[0].load, last = v[v.length - 1].load; const wks = Math.max(1, (mk(v[v.length - 1].d) - mk(v[0].d)) / (7 * DAY)); return { id, pctWk: +(((last - first) / first) * 100 / wks).toFixed(1), n: v.length }; }).sort((a, b) => b.pctWk - a.pctWk);
    const nMax = Math.max(0, ...Object.values(perLift).map((v) => v.length));
    return { id: "strvelocity", t: "STRENGTH VELOCITY", status: best.length ? "LIVE" : "ARMED", prog: { n: nMax, need: 4, label: "logged sessions per lift (loads now ride every set automatically)" },
      tag: "Getting stronger while shrinking — the recomp thesis, as a slope.",
      deep: "Volume-load (weight × total reps) per lift, plotted across your sessions, expressed as %/week. Positive slopes in a deficit are the strongest recomp evidence that exists outside a DEXA. Loads attach to every set automatically as of today — the instrument builds itself while you train.",
      forYou: best.length ? `Fastest climber: ${(exById(s, best[0].id) || {}).n} at +${best[0].pctWk}%/wk while cutting${best[1] ? ` · then ${(exById(s, best[1].id) || {}).n} +${best[1].pctWk}%/wk` : ""}. Say this sentence out loud the next time a week feels pointless.` : "Every session you log from today feeds the slopes. First verdicts at 4 sessions per lift (~2 weeks).",
      lines: [] };
  });

  /* 3 · the canary lift */
  add(() => {
    const rows = [];
    sessDates.forEach((d) => { const n = nightOf(prevISO(d)); if (!n) return; ((s.sessionLog[d] || {}).entries || []).forEach((e) => { if (e.reps && e.reps.length) rows.push({ id: e.id, h: n.h, reps: e.reps.reduce((a, b) => a + b, 0) }); }); });
    const byLift = {};
    rows.forEach((r) => (byLift[r.id] = byLift[r.id] || []).push(r));
    const scored = Object.entries(byLift).filter(([, v]) => v.length >= 5 && new Set(v.map((x) => x.h)).size > 1).map(([id, v]) => { const mh = v.reduce((a, x) => a + x.h, 0) / v.length, mr = v.reduce((a, x) => a + x.reps, 0) / v.length; let num = 0, den = 0; v.forEach((x) => { num += (x.h - mh) * (x.reps - mr); den += (x.h - mh) ** 2; }); return { id, slope: den ? +(num / den).toFixed(1) : 0, n: v.length }; }).sort((a, b) => b.slope - a.slope);
    return { id: "canary", t: "THE CANARY LIFT", status: scored.length ? "LIVE" : "ARMED", prog: { n: Math.max(0, ...Object.values(byLift).map((v) => v.length)), need: 5, label: "sessions with the prior night logged" },
      tag: "Which lift feels missing sleep first — your early-warning instrument.",
      deep: "Reps-per-hour-of-sleep slope, per lift. One lift is always most sleep-sensitive; once named, it becomes a canary: when IT dips out of nowhere, check the pillow before blaming the program. The inverse lift — most sleep-proof — is what you lean on during unavoidable short-sleep weeks.",
      forYou: scored.length ? `Canary: ${(exById(s, scored[0].id) || {}).n} (+${scored[0].slope} reps per extra hour). Most sleep-proof: ${(exById(s, scored[scored.length - 1].id) || {}).n}. Debt-day programming writes itself.` : "Arming as you log sessions with the prior night on file — which you now do by default.",
      lines: [] };
  });

  /* 4 · regularity index */
  add(() => {
    const timed = s.sleep.nights.filter((n) => n.bed && n.wake).slice(-14);
    const mins = (t) => { const [a, b] = t.split(":").map(Number); let m = a * 60 + b; if (m < 720) m += 1440; return m; };
    const sd = (arr) => { if (arr.length < 2) return null; const m = arr.reduce((a, b) => a + b, 0) / arr.length; return Math.round(Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length)); };
    const bedSD = sd(timed.map((n) => mins(n.bed)));
    const wakeSD = sd(timed.filter((n) => n.wake).map((n) => { const [a, b] = n.wake.split(":").map(Number); return a * 60 + b; }));
    return { id: "regularity", t: "REGULARITY INDEX", status: timed.length >= 7 ? "LIVE" : "ARMED", prog: { n: timed.length, need: 7, label: "nights with bed→wake times" },
      tag: "Consistency rivals duration — your scatter, in minutes.",
      deep: "Standard deviation of your bed and wake times over the last 14 timed nights. Sleep-regularity research (Phillips 2017 onward) keeps finding that timing scatter predicts outcomes about as strongly as duration. Under ±30 min is elite; the 6:45 anchor attacks the wake half directly, and the countdown attacks the bed half.",
      forYou: timed.length >= 7 ? `Bed scatter ±${bedSD} min · wake scatter ±${wakeSD} min. ${wakeSD <= 30 ? "Wake side is anchored — " : "The anchor hasn't bitten yet — "}${bedSD > 45 ? "bedtime is the loose end; the 22:30 countdown is the tool." : "both ends tightening. This is what the anchor was for."}` : `${timed.length}/7 timed nights. Every bed→wake log is a data point — no extra effort, it's already your capture format.`,
      lines: [] };
  });

  /* 5 · miss archaeology */
  add(() => {
    const proTgtM = proteinTarget(s).lo;
    const misses = allDaily.filter((x) => x.pro != null && !proteinHit(proTgtM, x.pro));
    if (!misses.length) return { id: "missarch", t: "MISS ARCHAEOLOGY", status: "ARMED", prog: { n: 0, need: 3, label: "protein misses on file" }, tag: "Every miss gets an autopsy — patterns, not blame.", deep: "Each protein miss is examined for what preceded it: prior-night sleep, day of week, event proximity. Willpower problems usually turn out to be scheduling problems wearing a disguise.", forYou: "Zero misses on file to autopsy. Honestly? Elite. This card hopes to stay bored.", lines: [] };
    const dow = {};
    let shortSleep = 0, slept = 0;
    misses.forEach((m) => { const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][mk(m.d).getDay()]; dow[day] = (dow[day] || 0) + 1; const n = nightOf(prevISO(m.d)); if (n) { slept++; if (n.h < 7) shortSleep++; } });
    const topDay = Object.entries(dow).sort((a, b) => b[1] - a[1])[0];
    return { id: "missarch", t: "MISS ARCHAEOLOGY", status: "LIVE", prog: null,
      tag: "Every miss autopsied — patterns, not blame.",
      deep: `Each protein shortfall (under ${proTgtM} g, the evidence floor) is examined for precursors: prior-night sleep, day of week, event adjacency. Overshoot is not counted — there is no upper threshold in the literature and this card used to treat a 186 g day as a failure. The point is mechanical: if shortfalls cluster after short nights or on one weekday, the fix is scheduling — a prepped meal on that day, a protein-forward default after bad nights — not more discipline.`,
      forYou: `${misses.length} misses across the whole record. ${topDay ? topDay[0] + " owns " + topDay[1] + " of them" : ""}${slept ? ` · ${Math.round(100 * shortSleep / slept)}% followed a sub-7 night` : ""}. ${shortSleep / Math.max(1, slept) > 0.5 ? "Sleep is upstream of your protein too — the anchor defends both." : "No strong sleep link — day-structure is the lever."}`,
      lines: [] };
  });

  /* 6 · weekend split */
  add(() => {
    const wk = allDaily.filter((x) => ![0, 6].includes(mk(x.d).getDay()));
    const we = allDaily.filter((x) => [0, 6].includes(mk(x.d).getDay()));
    if (wk.length < 5 || we.length < 3) return { id: "weekend", t: "THE WEEKEND SPLIT", status: "ARMED", prog: { n: we.length, need: 3, label: "weekend days logged" }, tag: "Weekday-you vs weekend-you.", deep: "Two athletes share your body. This card audits them separately.", forYou: "Filling from your record.", lines: [] };
    const avg = (a, k) => Math.round(a.reduce((x, y) => x + (y[k] || 0), 0) / a.length);
    const proTgtWe = proteinTarget(s).lo;
    const hit = (a) => Math.round(100 * a.filter((x) => proteinHit(proTgtWe, x.pro)).length / a.length);
    return { id: "weekend", t: "THE WEEKEND SPLIT", status: "LIVE", prog: null,
      tag: "Weekday-you vs weekend-you — two athletes, one audit.",
      deep: "Every metric split by weekday vs weekend across your entire record. Most preps are lost between Friday night and Sunday dinner; knowing YOUR split turns a vague fear into a number — and events (weddings, holidays) get judged inside their own protocol, not as failures.",
      forYou: `Weekdays: ${avg(wk, "cal")} cal · ${hit(wk)}% protein hits · ${(avg(wk, "steps") / 1000).toFixed(1)}k steps. Weekends: ${avg(we, "cal")} · ${hit(we)}% · ${(avg(we, "steps") / 1000).toFixed(1)}k. ${hit(we) >= hit(wk) - 10 ? "Weekend-you is nearly the same athlete — genuinely rare, and this whole wedding month proves it." : "The gap is the weekend; one prepped Saturday meal closes most of it."}`,
      lines: [] };
  });

  /* 7 · step efficacy */
  add(() => {
    const wks = [...liveRollups(s), ...ROLLUPS].filter((w) => w.avgSteps != null && w.avgW != null);
    const pairs = [];
    let excluded = 0;
    for (let i = 0; i < wks.length - 1; i++) {
      const wkDays = (wks[i].days || []).concat(wks[i + 1].days || []);
      if (wkDays.length && !weekWeather(s, wkDays).clean) { excluded++; continue; }
      const drop = wks[i + 1].avgW - wks[i].avgW; pairs.push({ steps: wks[i].avgSteps, drop });
    }
    if (pairs.length < 4) return { id: "stepeff", t: "STEP EFFICACY", status: "ARMED", prog: { n: pairs.length, need: 4, label: "week pairs" }, tag: "Do your extra steps actually show up on the scale?", deep: "Weekly step averages vs that week's scale movement.", forYou: "Accruing weekly.", lines: [] };
    const ms = pairs.reduce((a, p) => a + p.steps, 0) / pairs.length, md = pairs.reduce((a, p) => a + p.drop, 0) / pairs.length;
    let num = 0, den = 0; pairs.forEach((p2) => { num += (p2.steps - ms) * (p2.drop - md); den += (p2.steps - ms) ** 2; });
    const slope = den ? +(num / den).toFixed(2) : 0;
    return { id: "stepeff", t: "STEP EFFICACY", status: "LIVE", prog: null,
      tag: "Do your extra steps show up on the scale? Directional verdict.",
      deep: "Weekly average steps vs that week's weight change, across every week on file. Small n and confounded (calories move too) — stated honestly as directional, not causal. But if high-step weeks consistently out-drop low-step weeks at similar intake, your NEAT is doing real work; if not, steps are cardiovascular health, and calories are the fat lever.",
      forYou: `Across ${pairs.length} clean week-pairs${excluded ? ` (${excluded} excluded for event water/estimates — they were poisoning this read)` : ""}: each extra 1k daily steps associates with ~${Math.abs(Math.round(slope * 10) / 10)} lb/wk ${slope > 0 ? "faster" : "slower"} loss (directional, n=${pairs.length}). ${slope > 0.05 ? "Your 16–17k target is earning its keep." : "Signal weak so far — steps stay for health; the deficit does the cutting."}`,
      lines: [] };
  });

  /* 8 · refeed ROI */
  add(() => {
    const refeedDays = allDaily.filter((x) => dayType(x.d) === "REFEED" && x.d > "2026-07-21");
    const pairsR = refeedDays.map((r) => { const nd = isoOf(new Date(mk(r.d).getTime() + DAY)); return s.sessionLog[nd] ? { cal: r.cal, reps: totReps(nd) } : null; }).filter(Boolean);
    return { id: "refeedroi", t: "REFEED ROI", status: pairsR.length >= 3 ? "LIVE" : "ARMED", prog: { n: pairsR.length, need: 3, label: "refeed → next-day-session pairs" },
      tag: "What does each refeed buy you in next-day iron?",
      deep: "Refeed-day calories vs the following session's total output, plus the trend cost already measured by the refeed-bump line. Enough pairs reveal your dose-response: whether 2,400 buys what 2,600 buys — i.e., your optimal refeed size, discovered instead of guessed.",
      forYou: pairsR.length >= 3 ? `${pairsR.length} pairs: avg ${Math.round(pairsR.reduce((a, x) => a + x.cal, 0) / pairsR.length)} cal → ${Math.round(pairsR.reduce((a, x) => a + x.reps, 0) / pairsR.length)} next-day reps. Spread widens the picture — one lighter refeed (~2,300) would be an informative experiment, coach-flag.` : `${pairsR.length}/3 pairs. Every Wednesday→Thursday you log builds this — tomorrow is literally a data point.`,
      lines: [] };
  });

  /* 9 · session shape */
  add(() => {
    const shapes = {};
    sessDates.forEach((d) => ((s.sessionLog[d] || {}).entries || []).forEach((e) => { if (e.reps && e.reps.length >= 2) (shapes[e.id] = shapes[e.id] || []).push(e.reps.map((r, i) => (i === 0 ? 0 : r - e.reps[0]))); }));
    const ready = Object.entries(shapes).filter(([, v]) => v.length >= 4);
    return { id: "sessionshape", t: "SESSION SHAPE", status: ready.length ? "LIVE" : "ARMED", prog: { n: Math.max(0, ...Object.values(shapes).map((v) => v.length), 0), need: 4, label: "sessions per lift" },
      tag: "Your set-to-set fade pattern — joints complain here first.",
      deep: "Each lift's rep-decay across sets (8,8,7 = fade of 0,-1) has a stable personal fingerprint. When the SHAPE changes — set 2 suddenly sagging on a lift that never sags — it precedes joint complaints and stalls by about a week in most lifters. The instrument watches for shape breaks, not bad days.",
      forYou: ready.length ? `${ready.length} lifts fingerprinted. Latest shapes match your baselines — no silent breaks. This card matters most the week it disagrees with you.` : "Fingerprints form at 4 sessions per lift; the abs and hack debuts start theirs this week.",
      lines: [] };
  });

  /* 10 · compounding curve */
  add(() => {
    const reads = s.reads.filter((r) => !r.sealed);
    if (reads.length < 20) return null;
    let best = 0, sum = 0, cnt = 0;
    for (let i = 0; i < reads.length; i++) { const j = reads.findIndex((r) => mk(r.d) >= mk(reads[i].d) + 13 * DAY); if (j > i) { const drop = reads[i].w - reads[j].w; best = Math.max(best, drop); sum += drop; cnt++; } }
    const avgD = cnt ? +(sum / cnt).toFixed(1) : 0;
    return { id: "compound", t: "THE COMPOUNDING CURVE", status: "LIVE", prog: null,
      tag: "Your best fortnight vs your average — the cost of chaos, in pounds.",
      deep: "Every rolling 14-day window in your record, ranked. The best window is what YOU produce when everything clicks — sleep, protein, steps aligned. The average includes life. The gap between them is the honest price of chaos, and shrinking it beats chasing any new protocol.",
      forYou: `Best fortnight: −${best.toFixed(1)} lb. Average: −${avgD} lb. Gap ≈ ${(best - avgD).toFixed(1)} lb of pure execution — you don't need a better plan anywhere in this app; you need more weeks that look like your best ones. No checkpoint, no date — the only thing worth chasing here is more weeks that look like your best one.`,
      lines: [] };
  });

  /* 11 · ghost joey */
  add(() => {
    const days = Math.max(1, Math.round((todayStart() - mk("2026-07-21")) / DAY));
    /* Priced at his measured per-step cost and the same kcal/lb the rest of the
       engine uses, not 0.35 and 3,500. The old copy also sold two retired
       claims as facts about the model: that a short night voids a record, and
       that refeeds prevent an adherence problem his record does not show. */
    const stG = stepTarget(s);
    const perStepG = stG.gated ? 0.35 : stG.kcalPer1k / 1000;
    const stepPen = (4000 * perStepG * days) / KCAL_PER_LB_MIX;
    const sleepPen = 0.15 * (days / 7);
    const ghost = +(s.trend + stepPen + sleepPen).toFixed(1);
    return { id: "ghost", t: "GHOST JOEY", status: "MODEL", prog: null,
      tag: "The you who walks 4k fewer steps and sleeps six — simulated, clearly badged.",
      deep: "A counterfactual twin built from YOUR measured coefficients, not textbook ones: 4,000 fewer daily steps priced at your own per-step cost, and a short-sleep penalty on the side where short sleep actually costs — body composition, not the session. It is a MODEL, the badge says so, and it exists for one purpose: on the days discipline feels pointless, the gap is the receipt that it isn't.",
      forYou: `Ghost's trend today: ~${ghost} (${(ghost - s.trend).toFixed(1)} lb behind you) and falling further behind by ~${((4000 * perStepG * 7) / KCAL_PER_LB_MIX + 0.15).toFixed(1)} lb/week. Ghost also sleeps six — his sessions look about the same as yours, and that is exactly the trap: the cost lands on what his weight loss is made of, not on his reps. You are the control group's nightmare.`,
      lines: [] };
  });

  /* 12 · the sentinel */
  add(() => {
    const base = (arr) => { if (arr.length < 8) return null; const m = arr.reduce((a, b) => a + b, 0) / arr.length; const sdv = Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1; return { m, sdv }; };
    const slB = base(s.sleep.nights.slice(-30).map((n) => n.h));
    const stB = base(allDaily.slice(-30).filter((x) => x.steps).map((x) => x.steps));
    if (!slB || !stB) return null;
    let flagged = null;
    [...allDaily].slice(-10).forEach((d2) => { const n = nightOf(prevISO(d2.d)); let hits = 0; if (n && Math.abs((n.h - slB.m) / slB.sdv) > 1.8) hits++; if (d2.steps && Math.abs((d2.steps - stB.m) / stB.sdv) > 1.8) hits++; const rd = s.reads.find((r) => r.d === d2.d && !r.sealed); if (rd && Math.abs(rd.w - s.trend) > 1.6) hits++; if (hits >= 2 && !dayWeather(s, d2.d).hard) flagged = { d: d2.d, hits }; });
    return { id: "sentinel", t: "THE SENTINEL", status: "LIVE", prog: null,
      tag: "Multivariate weird-day detector — often smells illness a day early.",
      deep: "Each recent day is z-scored against your own 30-day baselines across sleep, steps, and scale-vs-trend. Two or more dimensions going strange TOGETHER is the signature of incoming illness, unlogged stress, or a tracking slip — usually a day before you'd feel or notice it. It never diagnoses; it points.",
      forYou: flagged ? `${fmtShort(flagged.d)} tripped ${flagged.hits} baselines at once — if you remember why, no action; if you don't, treat today gently and watch tonight's sleep.` : "All quiet — every recent day sits inside your own baselines. The best sentinel report is boredom.",
      lines: [] };
  });

  /* 13 · the monthly letter */
  add(() => {
    const july = allDaily.filter((x) => x.d >= "2026-07-01");
    const june = allDaily.filter((x) => x.d < "2026-07-01");
    if (june.length < 10 || july.length < 10) return null;
    const avg2 = (a, k) => Math.round(a.reduce((x, y) => x + (y[k] || 0), 0) / a.length);
    const proTgtJ = proteinTarget(s).lo;
    const hit2 = (a) => Math.round(100 * a.filter((x) => proteinHit(proTgtJ, x.pro)).length / a.length);
    const wins = s.feed.filter((f) => f.d >= "2026-07-01" && /OWNED|DEBUT|EARNED|RECLAIM/.test(f.t)).length;
    return { id: "letter", t: "THE MONTHLY LETTER", status: "LIVE", prog: null,
      tag: "State of the prep, auto-written on the 1st. Latest: July (running).",
      deep: "On the first of each month, the ledger writes itself a letter: every metric vs the prior month, changepoints named, wins counted. It becomes the prep's chapter structure — and in September, the reverse gets judged against these letters instead of vibes. August 1 prints the first complete one.",
      forYou: `July so far vs June: calories ${avg2(july, "cal")} vs ${avg2(june, "cal")} · protein hits ${hit2(july)}% vs ${hit2(june)}% · steps ${(avg2(july, "steps") / 1000).toFixed(1)}k vs ${(avg2(june, "steps") / 1000).toFixed(1)}k · ${wins} gates flipped in July. Trajectory: tightening while the scale seal holds — exactly what a mid-prep month should read like. Full letter prints Aug 1.`,
      lines: [] };
  });

  /* 14 · the prophet's scorecard */
  add(() => {
    const { graded, mae, bias } = prophetGrades(s);
    const fc = s.forecasts || [];
    return { id: "prophet", t: "THE PROPHET'S SCORECARD", status: graded.length >= 2 ? "LIVE" : "ARMED", prog: { n: graded.length, need: 2, label: "graded 7-day forecasts (journaling began today, first grades in ~1 wk)" },
      tag: "The lab grades its own predictions — trust, with error bars.",
      deep: "Every day the lab quietly journals a 7-day trend forecast; a week later, reality grades it. Mean absolute error = how far to trust any forecast in this app; bias = whether the machine runs optimistic or pessimistic about you. The cone's long-range September calls are journaled too, gradable at the pivot. An instrument that publishes its own error bars is the only kind worth believing — most coaching advice never submits to this test.",
      forYou: graded.length >= 2 ? `${graded.length} forecasts graded: typical miss ±${mae} lb, bias ${bias > 0 ? "+" + bias + " (runs optimistic — mentally pad ETAs)" : bias < 0 ? bias + " (runs pessimistic — you keep beating the machine)" : "0.00 (dead calibrated)"}. Read every ETA in this lab through that lens.` : `Journal opened today — entry #${fc.length} on file. The machine has put its predictions in writing; in a week, reality starts marking the homework.`,
      lines: [] };
  });

  /* 15 · the what-if console */
  add(() => ({ id: "whatif", t: "THE WHAT-IF CONSOLE", status: "MODEL", prog: null,
    tag: "Touch the levers — steps, calories, refeed, sleep — watch the dates move.",
    deep: "A live counterfactual engine: sliders re-run the model with hypothetical settings and show what moves — the weekly rate, and when the current pace would reach roughly 11%. There is no date tile any more, because there is no date. Coefficients are your measured ones: your own rate, your own per-step cost, and the same kcal-per-pound the rest of the engine uses. Sleep is on the panel but deliberately does NOT move the pound-per-week figure — it changes what those pounds are made of, which this model cannot draw. It answers 'what if I just…' with arithmetic instead of vibes. Changes here change NOTHING real — it is a sandbox, badged MODEL, and actual target changes stay coach-flag.",
    forYou: "Open the card — the sliders are inside. Try sleep at 6.5 first and watch what it says about your own-attempts; that one isn't hypothetical this week.",
    lines: [] }));


  /* 16-18 · THE PULSE WING */
  const pReads = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
  const pBase = pReads.length >= 7 ? pReads.slice(-14).map((x) => x.bpm).sort((a, b) => a - b)[Math.floor(Math.min(14, pReads.length) / 2)] : null;
  add(() => ({ id: "pulsebase", t: "YOUR RESTING PULSE", status: pBase ? "LIVE" : "ARMED", prog: { n: pReads.length, need: 7, label: "morning pulse readings (5 seconds, on NOW)" },
    tag: "Your engine's idle speed — the cheapest recovery dial that exists.",
    deep: "Morning resting heart rate is the most information-dense five-second measurement in sports science: it reflects recovery, stress, illness, and diet strain all at once. Seven readings build your personal baseline (a rolling median, so one weird morning can't move it); everything else in this wing reads against that number.",
    forYou: pBase ? `Baseline: ${pBase} bpm. Last reading ${pReads[pReads.length - 1].bpm} (${pReads[pReads.length - 1].bpm - pBase >= 0 ? "+" : ""}${pReads[pReads.length - 1].bpm - pBase} vs you). Steady is the goal — steady means the deficit is being absorbed, not endured.` : `${pReads.length}/7 readings. The input lives at the bottom of NOW's log cards — five seconds after the weigh-in.`,
    lines: [] }));
  add(() => {
    if (pReads.length < 10 || !pBase) return { id: "cutstress", t: "CUT-STRESS INDEX", status: "ARMED", prog: { n: pReads.length, need: 10, label: "readings across 10+ days" }, tag: "Is the diet being absorbed or endured? Your pulse answers first.", deep: "A sustained climb in resting pulse (~+5 bpm over baseline) is the classic sign a deficit has outrun recovery — it shows up before strength stalls and before the mirror changes. It's the physiological answer to when September's diet-exit is DUE, versus when the calendar says so.", forYou: "Arms at 10 readings — then the reverse gets timed by your body, not the calendar.", lines: [] };
    const firstWk = pReads.slice(0, 5).map((x) => x.bpm).reduce((a, b) => a + b, 0) / Math.min(5, pReads.length);
    const last5 = pReads.slice(-5).map((x) => x.bpm).reduce((a, b) => a + b, 0) / Math.min(5, pReads.length);
    const drift = +(last5 - firstWk).toFixed(1);
    return { id: "cutstress", t: "CUT-STRESS INDEX", status: "LIVE", prog: null,
      tag: "Is the diet being absorbed or endured? Your pulse answers first.",
      deep: "A sustained climb of ~5+ bpm over your early baseline is the classic signature of a deficit outrunning recovery — visible before strength stalls or the mirror changes. Flat or falling pulse deep into a cut is the green light that the pace is sustainable; a climb is the body's own vote for the diet-exit date.",
      forYou: `Drift so far: ${drift >= 0 ? "+" : ""}${drift} bpm vs your first readings. ${drift >= 5 ? "That's the strain signature — worth showing your coach; the diet-exit conversation may be due early." : drift >= 3 ? "Mild climb — watch it alongside sleep; not alarming yet." : "Being absorbed, not endured — the pace is sustainable by your own physiology."}`,
      lines: [] };
  });
  add(() => {
    const latest = pReads[pReads.length - 1];
    const spike = pBase && latest ? latest.bpm - pBase : null;
    return { id: "pulsewarn", t: "ILLNESS EARLY-WARNING", status: pBase ? "LIVE" : "ARMED", prog: { n: pReads.length, need: 7, label: "readings to build the baseline" },
      tag: "A pulse spike usually beats the sore throat by a day.",
      deep: "A single-morning jump of ~7+ bpm over baseline — without a hard session or bad night to explain it — precedes noticeable illness with startling reliability. The play is never to panic: it's to go easy for 24 hours, hydrate, sleep early, and often skip the sickness entirely because you saw it coming.",
      forYou: spike != null ? (spike >= 7 ? `${latest.bpm} today vs ${pBase} baseline — +${spike}. No hard session or short night to blame it on? Treat today gently and protect tonight's sleep; check again tomorrow.` : `${latest.bpm} today vs ${pBase} baseline — inside normal. The best report this card gives is boredom.`) : "Builds with the baseline — seven readings.",
      lines: [] };
  });

  /* 19 · THE NEGOTIATOR */
  add(() => ({ id: "negotiator", t: "THE NEGOTIATOR", status: "MODEL", prog: null,
    tag: "Name the goal — it solves backward for the cheapest path, priced by YOUR habits.",
    deep: "The what-if console runs forward from levers; this runs backward from a goal. You set a target body fat and how long you are willing to give it — an offset from today, never a deadline, because you have not set one and building urgency around a date nobody picked is how a cut turns into a rushed one. It computes the pace that would require, checks it against your own rate band, and proposes the cheapest lever set — 'cheapest' priced by your record: steps before calorie cuts, because steps cost you nothing you are trying to keep. It respects your DERIVED calorie floor, not an authored number. It proposes; you and your coach decide.",
    forYou: "Open the card — the goal controls are inside. Try the current plan's own goal first and see how much slack you actually have.",
    lines: [] }));

  /* 20 · THE NATURAL-EXPERIMENT MINER */
  add(() => {
    const sess2 = Object.keys(s.sessionLog).sort();
    const rows2 = sess2.map((d) => { const n = s.sleep.nights.find((x) => x.d === isoOf(new Date(mk(d).getTime() - DAY))); const dl2 = s.dailyLogs[isoOf(new Date(mk(d).getTime() - DAY))]; return { d, t: dayType(d), slp: n ? n.h : null, cal: dl2 ? dl2.cal : null, reps: ((s.sessionLog[d] || {}).entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0), postRefeed: dayType(isoOf(new Date(mk(d).getTime() - DAY))) === "REFEED" }; }).filter((r) => r.slp != null && r.cal != null && r.reps > 0 && !dayWeather(s, r.d).hard && !dayWeather(s, isoOf(new Date(mk(r.d).getTime() - DAY))).hard);
    const pairs2 = [];
    for (let i = 0; i < rows2.length; i++) for (let j = i + 1; j < rows2.length; j++) {
      const a2 = rows2[i], b2 = rows2[j];
      if (a2.t === b2.t && Math.abs(a2.slp - b2.slp) <= 0.5 && Math.abs(a2.cal - b2.cal) <= 75 && a2.postRefeed !== b2.postRefeed) pairs2.push({ diff: (a2.postRefeed ? a2.reps - b2.reps : b2.reps - a2.reps) });
    }
    const avgD2 = pairs2.length ? Math.round(pairs2.reduce((x, y) => x + y.diff, 0) / pairs2.length) : null;
    return { id: "miner", t: "NATURAL-EXPERIMENT MINER", status: pairs2.length >= 3 ? "LIVE" : "ARMED", prog: { n: pairs2.length, need: 3, label: "matched day-pairs (same day type, sleep ±0.5 h, calories ±75)" },
      tag: "Controlled studies you accidentally ran on yourself — found and reported.",
      deep: "The miner hunts your history for near-twin days — same session type, same sleep, same calories — where exactly one thing differed, then reports the contrast like the experiment it accidentally was. First contrast under study: the day-after-refeed effect on total output. More contrasts join as your record deepens. It's the closest thing to causal evidence a single human life can produce.",
      forYou: pairs2.length >= 3 ? `${pairs2.length} matched pairs found: the post-refeed twin averages ${avgD2 >= 0 ? "+" : ""}${avgD2} reps over its match. That's your refeed's real next-day purchase, measured under fair conditions.` : `${pairs2.length}/3 pairs so far — every logged session gives the miner more twins to hunt. This one rewards patience with the rarest kind of proof.`,
      lines: [] };
  });

  /* 21 · THE TRIALS DESK */
  add(() => {
    const props3 = trialProposals(s);
    const recs = (s.trials || []).filter((t) => !t.declined);
    const runningN = recs.filter((t) => { const v = trialVerdict(s, t); return v && !v.done; }).length;
    return { id: "trialsdesk", t: "THE TRIALS DESK", status: runningN ? "TRACKING" : "LIVE", prog: null,
      tag: props3.length ? `${props3.length} experiment${props3.length > 1 ? "s" : ""} proposed — one tap starts, nothing runs without you.` : runningN ? `${runningN} trial${runningN > 1 ? "s" : ""} running — follow the day's arm on NOW.` : "Watching for the next worthwhile experiment.",
      deep: "This is the lab going from watching to testing. It proposes formal experiments on your levers — alternating blocks, fair comparisons, honest sample sizes — and runs them only after your one-tap consent. The day's arm appears in TODAY'S PROTOCOL so following a trial costs zero thought. Verdicts come badged like everything else: direction, sample size, and never gospel.",
      forYou: "Open the card — proposals, running trials, and finished verdicts all live inside.",
      lines: [] };
  });

  /* 22 · REFEED REBOUND (pulse × refeed) */
  add(() => {
    const pairsRB = [];
    (s.pulse || []).forEach((pr) => {
      const dayBefore = isoOf(new Date(mk(pr.d).getTime() - DAY));
      if (dayType(dayBefore) === "REFEED" && pBase) pairsRB.push(pr.bpm - pBase);
    });
    const avgRB = pairsRB.length ? +(pairsRB.reduce((a, b) => a + b, 0) / pairsRB.length).toFixed(1) : null;
    return { id: "refeedpulse", t: "REFEED REBOUND", status: pairsRB.length >= 2 ? "LIVE" : "ARMED", prog: { n: pairsRB.length, need: 2, label: "post-refeed pulse mornings" },
      tag: "Does Wednesday's food show up in Thursday's heartbeat?",
      deep: "A resting-pulse dip the morning after a refeed is the parasympathetic rebound — the nervous system cashing the recovery the extra food bought. If your Thursdays reliably beat baseline, the refeed is doing systemic work far beyond glycogen; if they don't, its value is purely the fuel and the psychology.",
      forYou: avgRB != null ? `Your post-refeed mornings run ${avgRB > 0 ? "+" : ""}${avgRB} bpm vs baseline (${pairsRB.length} measured). ${avgRB <= -1 ? "That's the rebound — recovery, purchased and visible." : "No systemic dip yet — the refeed's value is fuel and sanity, which still counts."}` : "Arms with two post-refeed pulse mornings — the first candidate is the morning after your next Wednesday.",
      lines: [] };
  });

  /* 23 · SEASON ONE */
  add(() => {
    const wkNow = weekDay().wk;
    const letters = s.feed.filter((f) => f.t.indexOf("WEEK IN REVIEW") === 0).length;
    const wins2 = s.feed.filter((f) => /OWNED|DEBUT|EARNED|RECLAIM|ZERO-COMP/.test(f.t)).length;
    return { id: "seasonone", t: "SEASON ONE — THE BOOK OF THE CUT", status: "ARMED", prog: { n: wkNow, need: 12, label: "weeks of story (compiles in full at the diet-exit)" },
      tag: "When the cut ends, the app writes the book — chapters, turning points, receipts.",
      deep: "Every feed entry, weekly review, letter, and debrief is a page already written. At the diet-exit the app compiles them into chapters — The Sheet Era, The Handoff, The Wedding Fortnight — with the numbers as plot. A document you keep; proof the whole thing happened the way you remember it.",
      forYou: `${wkNow} weeks of story so far · ${s.feed.length} entries · ${wins2} wins · ${letters} weekly reviews on file. The manuscript is accumulating on its own — nothing to do but live the chapters.`,
      lines: [] };
  });

  /* 24 · THE HANDOFF DOSSIER */
  add(() => ({ id: "dossier", t: "THE HANDOFF DOSSIER", status: "LIVE", prog: null,
    tag: "One tap: every live verdict, compiled plain, for your coach.",
    deep: "Generated fresh on request — never stale, never stored. It compiles the machine-trust line, every speaking instrument's current verdict in plain words, running trials, this week's review, and anything athlete-called awaiting sign-off. Its whole job: your coach gets the lab's depth in two minutes of reading, whenever he asks.",
    forYou: "Open the card and tap GENERATE — then copy it straight into a text to him.",
    lines: [] }));

  /* 25 · YOUR FURNACE */
  add(() => {
    const T2 = tempRead(s);
    return { id: "furnacebase", t: "YOUR FURNACE", status: T2.base != null ? "LIVE" : "ARMED", prog: { n: T2.n, need: 7, label: "morning temperatures (15 seconds, on NOW)" },
      tag: "Morning temperature — the deficit's most honest gauge.",
      deep: "Your body literally turns the thermostat down as a diet deepens — morning temperature is the most direct read on metabolic adaptation that exists outside a lab. Seven readings set your early baseline; from there, a sustained drop of ~0.4°F+ means the furnace is banking energy, which is normal, expected, and exactly what the refeeds and the eventual diet-exit are for.",
      forYou: T2.base != null ? `Early baseline ${T2.base}°F · recent ${T2.last5}°F (${T2.drift > 0 ? "+" : ""}${T2.drift}). ${T2.drift <= -0.4 ? "The furnace is cooling — adaptation is visible in you now, not just in theory. The band's top end exists for weeks like this." : "Holding warm — the deficit is being absorbed without the thermostat flinching."}` : `${T2.n}/7 readings. The thermometer takes 15 seconds, right after the pulse — same card on NOW.`,
      lines: [] };
  });

  /* 26 · THE EXIT THERMOMETER */
  add(() => {
    const T2 = tempRead(s);
    return { id: "exittherm", t: "THE EXIT THERMOMETER", status: "ARMED", prog: { n: T2.n, need: 7, label: "building your cut-depth baseline now — fires at the diet-exit" },
      tag: "September's reverse ends when your body re-warms — not when the calendar says.",
      deep: "This is the instrument nothing on the market has: a physiological finish line for the post-cut reverse. Every temperature you log now maps how cool the cut runs; when the diet-exit begins, calories climb until your mornings warm back to baseline — that re-warming IS metabolic recovery, measured. The reverse stops being a calendar guess and becomes a thermostat reading.",
      forYou: `Learning your cut-depth signature (${T2.n} readings${T2.drift != null ? `, currently ${T2.drift > 0 ? "+" : ""}${T2.drift}°F vs early baseline` : ""}). At the diet-exit this card flips LIVE and calls the finish line itself.`,
      lines: [] };
  });
  return out;
}

/* THE MAP — what feeds every instrument; the suite refuses cards that aren't on it */
const INS_MAP = {
  whoosh: ["weigh-in"], refeed: ["weigh-in"], noise: ["weigh-in"], masked: ["weigh-in", "day numbers"], creep: ["day numbers"],
  adaptmeter: ["day numbers", "weigh-in"], stepeff: ["day numbers", "weigh-in"], refeedroi: ["day numbers", "session"],
  tuefri: ["session"], volumeledger: ["session"], signals: ["morning"], fingerprint: ["session"], strvelocity: ["session"], sessionshape: ["session"], rirtruth: ["session"], notes: ["session"], miss: ["day numbers"],
  sleepdose: ["sleep night", "session"], sleeplag: ["sleep night", "session"], melaexp: ["sleep night"], wakesig: ["sleep night"], regularity: ["sleep night"], variancetax: ["sleep night", "session"], canary: ["sleep night", "session"],
  pulsebase: ["pulse"], cutstress: ["pulse"], pulsewarn: ["pulse"], refeedpulse: ["pulse"], furnacebase: ["temperature"], exittherm: ["temperature"],
  missarch: ["day numbers", "sleep night"], weekend: ["day numbers"], compound: ["weigh-in"], miner: ["session", "sleep night", "day numbers"],
  trialsdesk: ["your consent"], cone: ["weigh-in"], dexarecon: ["a DEXA scan"], seasonone: ["the feed"],
  ghost: ["weigh-in", "day numbers"], sentinel: ["sleep night", "day numbers", "weigh-in"], letter: ["day numbers", "the feed"], prophet: ["weigh-in"], whatif: ["weigh-in", "day numbers"], negotiator: ["weigh-in", "day numbers"], dossier: ["the whole lab"],
  ea: ["day numbers", "session", "weigh-in"], mrv: ["session"], debutmodel: ["session", "sleep night"], medswindow: ["morning", "day numbers"], forecast: ["weigh-in", "session", "day numbers"],
  spread: ["the shelf"], caffdose: ["the shelf"], creatine: ["the shelf"], matador: ["the shelf"], sleepceil: ["the shelf"],
};
const MAP_CHAINS = [
  "weigh-in → TREND → rate → cone · negotiator · what-if · ghost · prophet",
  "weigh-in → NOISE FLOOR → sentinel's scale-band · the 'not information' stamps",
  "sleep nights → CLEAN streak → what banks · RIR plan · debut gates",
  "sessions → strength velocity · fingerprints → the recomp thesis itself",
  "day flags (⌁ weather) → step efficacy · miner · sentinel · the agent's law",
  "trial verdicts → measured coefficients → protocol & negotiator sharpen",
];
function MapView({ s, onClose }) {
  const groups = labGroupsM(s);
  const byId = {}; groups.forEach((g) => g.cards.forEach((c) => { byId[c.id] = c; }));
  const inputs = {};
  Object.entries(INS_MAP).forEach(([id, srcs]) => srcs.forEach((src) => { (inputs[src] = inputs[src] || []).push(id); }));
  const order = ["weigh-in", "sleep night", "session", "day numbers", "pulse", "temperature", "your consent", "a DEXA scan", "the feed", "the whole lab", "the shelf"];
  return (
    <div style={{ position: "fixed", inset: 0, background: T.ink, zIndex: 70, overflowY: "auto", padding: "0 16px", paddingTop: "calc(env(safe-area-inset-top, 24px) + 14px)", paddingBottom: "calc(env(safe-area-inset-bottom, 10px) + 14px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow c={T.jade}>THE MAP — WHAT FEEDS WHAT</Eyebrow>
        <span onClick={onClose} style={{ fontFamily: mono, fontSize: 10, color: T.dim, cursor: "pointer", padding: "8px" }}>close ✕</span>
      </div>
      <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel, marginTop: 6, lineHeight: 1.5 }}>Every instrument, traced to the logging that funds it. The test suite refuses any instrument that isn't on this map — nothing gets built unplaced.</div>
      {order.filter((k) => inputs[k]).map((k) => (
        <div key={k} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.brass, letterSpacing: "0.1em", textTransform: "uppercase" }}>{k} feeds {inputs[k].length}:</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
            {inputs[k].map((id) => { const c = byId[id]; const live = c && (c.status === "LIVE" || c.status === "TRACKING"); return (
              <span key={id} style={{ fontFamily: mono, fontSize: 9.5, color: live ? T.jade : T.dim, border: `1px solid ${live ? T.jade : T.line}`, borderRadius: 999, padding: "4px 9px" }}>{c ? c.t.split(" — ")[0].split(" · ")[0] : id}</span>
            ); })}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: T.brass, letterSpacing: "0.1em" }}>THE CHAINS — DERIVED TRUTHS</div>
        {MAP_CHAINS.map((c2, i) => <div key={i} style={{ fontFamily: mono, fontSize: 10, color: T.steel, marginTop: 6, lineHeight: 1.5 }}>{c2}</div>)}
      </div>
    </div>
  );
}

/* THE RED CELL — the prosecution's monthly filing, rendered when fresh */
function RedCellCard() {
  const raw = useRepoDoc("ledger/redcell.md");
  const txt = (() => {
    if (!raw) return null;
    const m = raw.match(/^<!-- (\d{4}-\d{2}-\d{2}) -->/);
    if (m && (mk(isoOf(todayStart())) - mk(m[1])) / DAY <= 35) return raw.replace(/^<!--.*-->\n?/, "");
    return null;
  })();
  const [open2, setOpen2] = useState(false);
  if (!txt) return null;
  return (
    <Card accent={T.redline} style={{ marginTop: 10 }}>
      <div onClick={() => setOpen2(!open2)} style={{ cursor: "pointer" }}>
        <Eyebrow c={T.redline}>⚔ THE RED CELL — THE CASE AGAINST YOUR PREP {open2 ? "▾" : "▸"}</Eyebrow>
        <div style={{ fontFamily: body, fontSize: 11, color: T.dim, marginTop: 4 }}>An adversary hired to argue the thesis is failing, from your own numbers. Prosecution, not belief — if this case is weak, your confidence is earned.</div>
      </div>
      {open2 && <div style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: 8, lineHeight: 1.6, whiteSpace: "pre-wrap", borderTop: `1px solid ${T.line}`, paddingTop: 9 }}>{txt.slice(0, 3000)}</div>}
    </Card>

);
}

/* LAB GROUPS — every analytic, experiment, and evidence card filed on one shelf system */
function labGroups(s) {
  const all = [...labAnalytics(s), ...labAnalytics2(s), ...sleepLab(s), ...shelfItems(s)];
  const MAP = {
    scale: ["whoosh", "refeed", "noise", "masked", "creep"],
    engine: ["ea", "adaptmeter", "stepeff", "refeedroi"],
    training: ["tuefri", "fingerprint", "strvelocity", "sessionshape", "rirtruth", "notes", "miss", "volumeledger", "signals"],
    sleep: ["sleepdose", "sleeplag", "melaexp", "wakesig", "regularity", "variancetax", "canary"],
    pulse: ["pulsebase", "cutstress", "pulsewarn", "refeedpulse", "furnacebase", "exittherm"],
    behavior: ["missarch", "weekend", "compound", "miner", "medswindow"],
    trials: ["trialsdesk"],
    road: ["cone", "dexarecon", "seasonone"],
    models: ["forecast", "ghost", "sentinel", "letter", "prophet", "whatif", "negotiator", "dossier"],
    locked: ["mrv", "debutmodel"],
    shelf: ["spread", "caffdose", "creatine", "matador", "sleepceil"],
  };
  const TITLES = {
    scale: "SCALE & BODY — decoding the number",
    engine: "THE ENGINE — your metabolism, measured",
    training: "TRAINING — what the reps are saying",
    sleep: "SLEEP — the master-variable wing",
    pulse: "PULSE & FURNACE — seconds a day, deep truths",
    trials: "THE TRIALS DESK — experiments you approved",
    behavior: "PATTERNS OF A HUMAN — behavior, decoded",
    road: "THE ROAD — timing the pivot",
    models: "MODELS, SENTINELS & META — badged honestly",
    locked: "BUILD PHASE — sealed until September",
    shelf: "THE SHELF — evidence on file",
  };
  const groups = Object.keys(MAP).map((k) => ({ id: k, title: TITLES[k], cards: MAP[k].map((id) => all.find((c) => c.id === id)).filter(Boolean) }));
  const placed = new Set(Object.values(MAP).flat());
  const orphans = all.filter((c) => !placed.has(c.id));
  if (orphans.length) groups.push({ id: "more", title: "UNFILED", cards: orphans });
  groups.forEach((g) => {
    g.live = g.cards.filter((c) => c.status === "LIVE" || c.status === "TRACKING").length;
    g.armed = g.cards.filter((c) => c.status === "ARMED").length;
    g.rest = g.cards.length - g.live - g.armed;
  });
  return groups;
}

/* THE BODY ALARM — when physiology deviates, the answer is a prescription with numbers */
function bodyAlarm(s, slp) {
  const tI = isoOf(todayStart());
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const pr5 = pulseRead(s);
  const lastNight = s.sleep.nights.find((n) => n.d === yISO);
  const todaySpike = pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 7 ? pr5.spike : null;
  const prevRead = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1)).slice(-2)[0];
  const prevSpike = pr5.base && prevRead && prevRead.d === yISO ? prevRead.bpm - pr5.base : null;
  const partial = todaySpike == null && pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 4 && prevSpike != null && prevSpike >= 7;

  /* pattern check — yesterday and today ONLY; old anomalies are the sentinel card's business, not today's orders */
  let patParts = [];
  try {
    const zbase = (arr) => { if (arr.length < 8) return null; const m = arr.reduce((a, b) => a + b, 0) / arr.length; const sdv = Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1; return { m, sdv }; };
    const slB = zbase(s.sleep.nights.slice(-30).map((n) => n.h));
    const dls = Object.entries(s.dailyLogs).sort((a, b) => (a[0] < b[0] ? -1 : 1));
    const stB = zbase(dls.slice(-30).map(([, v]) => v.steps).filter(Boolean));
    for (const d2 of [yISO, tI]) {
      let hits = 0, parts = [];
      const n = s.sleep.nights.find((x) => x.d === isoOf(new Date(mk(d2).getTime() - DAY)));
      if (slB && n && Math.abs((n.h - slB.m) / slB.sdv) > 1.8) { hits++; parts.push(`slept ${n.h} h (your norm ${slB.m.toFixed(1)}±${slB.sdv.toFixed(1)})`); }
      const dl2 = s.dailyLogs[d2];
      if (stB && dl2 && dl2.steps && Math.abs((dl2.steps - stB.m) / stB.sdv) > 1.8) { hits++; parts.push(`steps ${(dl2.steps / 1000).toFixed(1)}k (norm ${(stB.m / 1000).toFixed(1)}k)`); }
      const rd = s.reads.find((r) => r.d === d2 && !r.sealed);
      if (rd && Math.abs(rd.w - s.trend) > 1.6) { hits++; parts.push(`scale ${rd.w} vs trend ${s.trend}`); }
      if (hits >= 2 && !dayWeather(s, d2).hard) patParts = parts;
    }
  } catch (e) {}
  const patternHot = patParts.length >= 2;
  if (!todaySpike && !partial && !patternHot) return null;

  const pulseTrig = todaySpike != null || partial;
  const red = todaySpike != null && (todaySpike >= 10 || (prevSpike != null && prevSpike >= 7 && todaySpike >= 7) || (lastNight && lastNight.h < 6));
  const t = dayType(tI, s);
  const trainDay = (t === "U" || t === "L") && !s.sessionLog[tI];
  let canaryName = null;
  try { const can = labGroupsM(s).flatMap((g) => g.cards).find((c) => c.id === "canary"); if (can && can.status === "LIVE") { const m = (can.forYou || "").match(/Canary: ([^(]+)\(/); if (m) canaryName = m[1].trim(); } } catch (e) {}
  const lo = lightsOutT(s);
  const early = (() => { let m = lo.mins - 30; if (m < 0) m += 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; })();
  const lines = [];
  if (trainDay) {
    if (red) lines.push("Session: convert to a walk or push it a day — nothing is lost; targets wait, the structural pick keeps its slot, and no gate closes.");
    else {
      lines.push("Session runs, one rule changed: normal plan, but every 0 becomes a 1 — no failure today. The early sets carry the growth cheap; the zeros carry the strain, and those are the only thing benched.");
      lines.push("No make-it-official attempts and no new-weight tries today — those need a normal body to mean anything; the standards wait untouched.");
      if (canaryName) lines.push(`Watch ${canaryName} — your measured stress-first lift; a dip there today is the alarm confirming, not you failing.`);
    }
  }
  lines.push(pulseTrig ? "Hydrate +24 oz across the morning — an elevated resting pulse frequently rides mild dehydration, and it's the cheapest test of the alarm." : "Hydrate +24 oz across the morning — the cheapest first test of an off-pattern day.");
  lines.push(`Protein stays ${proteinTarget(s).g} and calories stay on plan — recovery is protein-hungry, and eating extra fixes nothing here.`);
  lines.push(`Tonight: lights out ${early} (30 early, up at your usual ${fmt12(lightsOutT(s).wakeRef || "07:30")})${s.sleep.caffMg ? " · skip any afternoon caffeine entirely today" : ""}.`);
  lines.push(pulseTrig && pr5.base != null
    ? `Exit test — tomorrow 6:45: pulse within 3 of your ${pr5.base} baseline → every limit above lifts automatically. Still +7? ${red ? "Full rest day, and a third day is a doctor conversation, not a training one." : "Tomorrow escalates to a rest-day recommendation."}`
    : "Exit test — this clears the moment today's logs land back inside your own bands; a second off-pattern day in a row means treat it as real, not noise.");
  const basis = pulseTrig
    ? `${pr5.latest.bpm} bpm vs your ${pr5.base} baseline (+${todaySpike ?? pr5.spike})${prevSpike != null && prevSpike >= 7 ? (todaySpike != null ? " · second elevated morning" : " · recovering from yesterday") : ""}${lastNight ? ` · slept ${lastNight.h} h` : ""}${s.sessionLog[yISO] ? " · trained yesterday (a day-after bump is common — weigh that)" : ""} · ${(s.pulse || []).length} mornings behind the baseline`
    : `in the last day: ${patParts.join(" + ")} — two of your own baselines at once. No pulse data involved${(s.pulse || []).length === 0 ? " (none logged yet)" : ""}.`;
  return { tier: red ? "RED" : "AMBER", head: red ? `Body alarm — RED (pulse +${todaySpike ?? "?"}, second signal)` : partial ? `Body alarm — recovering (pulse +${pr5.spike}, down from +${prevSpike})` : pulseTrig ? `Body alarm — dial back (pulse +${todaySpike})` : "Body alarm — off-pattern day (dial back)", lines, basis };
}

/* quick pulse read — shared by cards and the day protocol */
function pulseRead(s) {
  const pr = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
  const base = pr.length >= 7 ? pr.slice(-14).map((x) => x.bpm).sort((a, b) => a - b)[Math.floor(Math.min(14, pr.length) / 2)] : null;
  const latest = pr[pr.length - 1] || null;
  return { base, latest, spike: base && latest ? latest.bpm - base : null };
}
function tempRead(s) {
  const tr = (s.temp || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
  const base = tr.length >= 7 ? +(tr.slice(0, 5).reduce((a, x) => a + x.f, 0) / Math.min(5, tr.length)).toFixed(1) : null;
  const last5 = tr.length >= 5 ? +(tr.slice(-5).reduce((a, x) => a + x.f, 0) / 5).toFixed(1) : null;
  return { n: tr.length, base, last5, drift: base != null && last5 != null ? +(last5 - base).toFixed(1) : null, latest: tr[tr.length - 1] || null };
}

/* THE HANDOFF DOSSIER — every live verdict, compiled plain, on request */
function dossierData(s) {
  const firstLine = (t) => { const x = Array.isArray(t) ? t[0] : t || ""; const cut = x.indexOf(". "); return (cut > 25 ? x.slice(0, cut + 1) : x).slice(0, 165); };
  const pg = prophetGrades(s);
  const groups = labGroupsM(s);
  const bySh = (ids) => groups.filter((g) => ids.includes(g.id)).flatMap((g) => g.cards).filter((c) => (c.status === "LIVE" || c.status === "TRACKING") && c.id !== "dossier" && c.id !== "trialsdesk");
  const secDef = [["THE BODY", ["scale", "engine"]], ["TRAINING", ["training"]], ["SLEEP & PULSE", ["sleep", "pulse"]], ["BEHAVIOR", ["behavior"]], ["MODELS & FORECASTS", ["road", "models"]]];
  const sections = secDef.map(([h, ids]) => ({ h, items: bySh(ids).map((c) => ({ t: c.t.split(" — ")[0], line: plainify(firstLine(c.forYou || c.tag)) })) })).filter((x) => x.items.length);
  const wr = weekReview(s);
  const trials = (s.trials || []).filter((t) => !t.declined).map((t) => { const tpl = trialTpl(t); const v = trialVerdict(s, t); const arm = trialArmOn(t, isoOf(todayStart())); return { t: tpl.t, line: v.done ? `finished: ${tpl.arms[0]} ${v.a ?? "—"} vs ${tpl.arms[1]} ${v.b ?? "—"} (${v.nA + v.nB} blocks — direction, not gospel)` : arm ? `running · block ${arm.block}/${arm.of} · current arm: ${tpl.arms[arm.armIdx]}` : "scheduled" }; });
  const signoff = s.feed.filter((f) => f.d >= isoOf(new Date(todayStart().getTime() - 7 * DAY)) && /4TH SET|UNI|DEBUT|OVERRIDDEN/.test(f.t)).map((f) => f.t.toLowerCase());
  return {
    header: { d: fmtShort(isoOf(todayStart())), wk: weekDay().wk, trend: s.trend, bf: bfEst(s).pct, pace: currentRate(s).fat, sealed: blackoutOn(s) ? fmtShort(SEAL_UNTIL) : null },
    trust: pg.n >= 2 ? `Forecasts run ±${pg.mae} lb, bias ${pg.bias > 0 ? "+" : ""}${pg.bias} — read every projection through that.` : "Machine still calibrating its own forecasts — first self-grades land ~1 week in.",
    topline: plainify(`${wr.verdict} ${signoff.length ? signoff.length + " athlete-called change" + (signoff.length > 1 ? "s" : "") + " below need your sign-off." : "Nothing awaits your sign-off."}`),
    sections, trials,
    week: { verdict: plainify(wr.verdict), lines: wr.lines.map(plainify) },
    signoff,
  };
}
function dossierText(s) {
  const d = dossierData(s);
  const L = [`PREP LEDGER — COACH DOSSIER · ${d.header.d} · wk ${d.header.wk}`,
    `Trend ${d.header.trend} lb · body fat ~${d.header.bf}% · pace ${d.header.pace} lb/wk${d.header.sealed ? ` · scale sealed until ${d.header.sealed}` : ""}`,
    `Machine trust: ${d.trust}`, "", `TOP LINE: ${d.topline}`, ""];
  d.sections.forEach((sec) => { L.push(sec.h); sec.items.forEach((it) => L.push(`  • ${it.t}: ${it.line}`)); L.push(""); });
  if (d.trials.length) { L.push("TRIALS"); d.trials.forEach((t) => L.push(`  • ${t.t}: ${t.line}`)); L.push(""); }
  L.push("THIS WEEK: " + d.week.verdict);
  d.week.lines.forEach((l) => L.push("  " + l));
  if (d.signoff.length) { L.push(""); L.push("NEEDS YOUR SIGN-OFF"); d.signoff.forEach((x) => L.push("  • " + x)); }
  return L.join("\n");
}

/* THE TRIALS ENGINE — the lab proposes, you consent, it runs and grades */
const TRIAL_TPL = {
  refeedsize: { t: "REFEED SIZE — 2,450 vs 2,300", blockDays: 7, cycles: 4, arms: ["refeed 2,450", "refeed 2,300"],
    q: "Does the smaller refeed buy the same next-day lifting?",
    eligible: (s) => Object.keys(s.dailyLogs).filter((d) => dayType(d) === "REFEED").length >= 1,
    metric: "next-day session total reps per block" },
  caffcut: { t: "CAFFEINE — USUAL vs −100 MG", blockDays: 3, cycles: 6, arms: ["usual dose", "usual −100 mg"],
    q: "Does a smaller pre-lift dose cost reps — or buy sleep?",
    eligible: (s) => !!s.sleep.caffMg,
    metric: "session reps + hours asleep per block" },
  lightsshift: { t: "LIGHTS-OUT — ON TIME vs 30 MIN EARLIER", blockDays: 3, cycles: 4, arms: ["derived time", "30 min earlier"],
    q: "Does the earlier window buy next-day output?",
    eligible: (s) => s.sleep.nights.filter((n) => n.sol != null).length >= 5,
    metric: "hours asleep + next-day reps per block" },
  steptarget: { t: "STEPS — 16.5K vs 18K", blockDays: 7, cycles: 4, arms: ["16.5k/day", "18k/day"],
    q: "Do the extra steps show up on your scale, in you?",
    eligible: () => true,
    metric: "weekly weight change per block" },
};
function trialProposals(s) {
  return Object.entries(TRIAL_TPL).filter(([id, t]) => !(s.trials || []).some((x) => x.tplId === id) && t.eligible(s)).map(([id, t]) => ({ id, ...t }));
}
function trialTpl(trial) { return trial.custom ? trial.custom : TRIAL_TPL[trial.tplId]; }
function trialArmOn(trial, iso) {
  const tpl = trialTpl(trial);
  if (!tpl) return null;
  const day = Math.floor((mk(iso) - mk(trial.started)) / DAY);
  if (day < 0 || day >= tpl.blockDays * tpl.cycles) return null;
  return { armIdx: Math.floor(day / tpl.blockDays) % 2, block: Math.floor(day / tpl.blockDays) + 1, of: tpl.cycles, tpl };
}
function trialVerdict(s, trial) {
  const tpl = trialTpl(trial);
  if (!tpl) return null;
  const endISO = isoOf(new Date(mk(trial.started).getTime() + tpl.blockDays * tpl.cycles * DAY));
  const done = isoOf(todayStart()) >= endISO;
  const perArm = [[], []];
  try {
    for (let b = 0; b < tpl.cycles; b++) {
      const from = mk(trial.started).getTime() + b * tpl.blockDays * DAY;
      const to = from + tpl.blockDays * DAY;
      const inBlock = (d) => mk(d).getTime() >= from && mk(d).getTime() < to;
      let val = null;
      if (trial.tplId === "steptarget" || (trial.custom && trial.custom.metric === "trend_delta")) {
        const ts2 = trendSeries(s.reads);
        const a2 = ts2.filter((x) => inBlock(x.d));
        if (a2.length >= 2) val = +(a2[0].t - a2[a2.length - 1].t).toFixed(1);
      } else if (trial.custom && trial.custom.metric === "sleep_h") {
        const ns2 = s.sleep.nights.filter((n) => inBlock(n.d));
        if (ns2.length >= 2) val = +(ns2.reduce((a3, n) => a3 + n.h, 0) / ns2.length).toFixed(2);
      } else {
        const sessDs = Object.keys(s.sessionLog).filter(inBlock);
        if (sessDs.length) val = Math.round(sessDs.reduce((a3, d) => a3 + (s.sessionLog[d].entries || []).reduce((x, e) => x + (e.reps || []).reduce((p, q) => p + q, 0), 0), 0) / sessDs.length);
      }
      if (val != null) perArm[b % 2].push(val);
    }
  } catch (e) {}
  const mean = (a2) => (a2.length ? +(a2.reduce((x, y) => x + y, 0) / a2.length).toFixed(1) : null);
  return { done, endISO, a: mean(perArm[0]), b: mean(perArm[1]), nA: perArm[0].length, nB: perArm[1].length };
}
function activeTrial(s) {
  const tI = isoOf(todayStart());
  for (const tr of s.trials || []) {
    if (tr.declined) continue;
    const arm = trialArmOn(tr, tI);
    if (arm) return { tr, arm };
  }
  return null;
}

/* TODAY'S PROTOCOL — one lead action, then the day ranked, every line from live data */
function dayProtocol(s, slp) {
  /* ---------- PROTOCOL_NOTE — what "ranked, from your data" has to mean ----------
     The header promised a ranking and the code delivered a fixed script: alarms,
     then trial, then session, then food, then sleep, then steps, truncated to
     five with no word about what fell off. Order never moved, whatever the data
     said. So it is a real ranking now: every candidate carries a weight built
     from (a) how much the evidence says the lever moves body composition and
     (b) how far HE currently sits from it. Ties break toward the safety items.

     The weights come from the size of the effects, not from taste:
     - Deficit magnitude is the dominant term. Murphy & Koehler's meta-regression
       (52 studies, 1,213 participants) puts each extra 100 kcal/day of deficit
       at -0.031 on the lean-mass effect size, with ~500 kcal/day predicted to
       blunt lean-mass gains entirely. Nothing else on this page is that big.
     - Protein scaled to FAT-FREE MASS is the next lever, and it is the one with
       an interval that excludes zero (Refalo, Trexler & Helms 2025 meta-
       regression, 29 studies, 729 participants: per-FFM b = 0.06 [0.01, 0.12],
       99% probability of direction; the per-bodyweight model's interval does
       NOT exclude zero). That is why the target below is computed off lean mass.
     - The session itself is the entire training stimulus, so on a training day
       it outranks everything except an alarm.
     - Sleep is his live constraint and gates whether anything counts.
     - Caffeine and steps are real but small, and they say so by ranking low.

     No silent caps: if the list is trimmed, the count that was held back is
     reported rather than quietly dropped. */
  const lead = theOneThing(s, slp, undefined, 1);
  const steps = [];
  const tI = isoOf(todayStart());
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const t = dayType(tI, s);
  const trainDay = t === "U" || t === "L";
  const sessDone = !!s.sessionLog[tI];
  const lastNight = s.sleep.nights.find((n) => n.d === yISO);
  const pr4 = pulseRead(s);
  const T4 = tempRead(s);
  const lo = lightsOutT(s);

  /* 1 · body alarms first — a prescription with numbers, never a mood */
  const al = bodyAlarm(s, slp);
  if (al) steps.push({ a: al.head, why: al.basis, detail: al.lines, w: 100 });

  /* 2 · trial arm */
  const at2 = activeTrial(s);
  if (at2) steps.push({ a: `Trial: ${at2.arm.tpl.arms[at2.arm.armIdx]}`, why: `${at2.arm.tpl.t.toLowerCase()} · block ${at2.arm.block}/${at2.arm.of} — the lab is measuring, just follow the arm`, w: 45 });

  /* 3 · the session */
  if (trainDay && !sessDone) {
    const g = genSession(s, tI, slp);
    if (g && g.ex && g.ex.length) steps.push({ a: `Session: ${g.ex.length} lifts`, why: (g.structural && g.structural.indexOf("NONE") !== 0 ? g.structural.toLowerCase() + " · " : "") + (slp.clean ? "rate the LAST set of each lift — that is the number that sizes the next jump" : "short sleep — the reps still count and a record can still bank; what the flag buys you is that today cannot be read as a stall. Rate the last set anyway"), w: 90 });
  }

  /* 3.5 · energy availability — the reading that outranks everything except an
     alarm when it is low, because it is the variable that decides whether the
     deficit costs him muscle. Weighted above the session deliberately: a
     session run at 20 kcal/kg FFM is not the same session. */
  const ea = energyAvailability(s);
  if (!ea.gated && (ea.band === "LOW" || ea.band === "VERY LOW" || ea.band === "MARGINAL")) {
    /* Eating first, walking second — deliberately. The trained-population
       evidence ties lean-mass loss to deficit magnitude (Murphy & Koehler 2022,
       ES -3.1e-4 per kcal/day) and has nothing at all against walking: no
       concurrent-training meta-analysis has ever included a walking arm. The old
       line called steps "the cheaper one to give back", which had it backwards. */
    const fix = ea.needKcal > 0
      ? `Closing it takes ~${ea.needKcal} kcal/day. Food is the first lever — deficit size is what the trained-population evidence actually links to lean-mass loss${ea.stepsToDrop ? `, and walking ~${ea.stepsToDrop.toLocaleString()} fewer steps is the same arithmetic if you would rather not eat it` : ""}`
      : `Nothing to close — this is the accounting question, not a shortfall`;
    steps.push({
      a: `Energy availability ${ea.ea} — ${ea.band.toLowerCase()}`,
      why: `Counting structured training only, which is the convention the ${EA_SPARING} line was built on. Counting your walking as training too gives ${ea.eaAll} — a real reading of everything you burn in a day, but against no published threshold. ${fix}. And treat ${EA_SPARING} as a direction rather than a cliff: it is extrapolated from semi-starvation work and bodybuilder case reports, and the IOC's own 2023 range for males spans 9 to 25.`,
      w: ea.band === "VERY LOW" ? 96 : ea.band === "LOW" ? 94 : 62,
    });
  }

  /* 4 · food — calories first, because deficit magnitude is the dominant term
     for body composition and it is the one number here derived from his own
     measured maintenance rather than an authored constant. */
  const ct = calorieTarget(s);
  if (!ct.gated) {
    /* The rolling week, not the whole measurement window — that is the number
       that answers "am I actually eating this?", and it is the one that moves. */
    steps.push({
      a: `Calories ${ct.lo}–${ct.hi}`,
      why: `${ct.why}${ct.wkWhy ? " " + ct.wkWhy : ""}`,
      w: 84 + (ct.wkOff != null && Math.abs(ct.wkOff) > 120 ? 6 : 0),
    });
  }
  const pt = proteinTarget(s);
  /* Weight rises when he is near or under the evidence floor, and when he has
     crossed into the sub-group where the coefficient is largest. */
  const pW = 62 + (pt.inLeanSubgroup ? 12 : 0) + (pt.g > Math.round(pt.floor / 5) * 5 ? 10 : 0);
  if (s.fixWindow) steps.push({ a: `Protein ${pt.g} — non-negotiable today`, why: "closes the open fix window; the miss becomes a save · " + pt.why, w: pW + 15 });
  else steps.push({ a: `Protein ${pt.g}`, why: `~${Math.round(pt.g / 4)} g × 4 feeds · wake / pre-lift / post-lift / pre-bed. ${pt.why}.`, w: pW });
  if (T4.drift != null && T4.drift <= -0.4) steps.push({ a: "Eat the top of the range (1,800)", why: `your furnace runs ${T4.drift}°F under baseline — the band's ceiling exists for exactly this; still a full deficit`, w: 70 });
  /* The refeed is still on the calendar because it is his programme and the app
     does not reprogramme him — but it no longer gets a sentence claiming it
     works. See REFEED_NOTE. */
  if (dayType(isoOf(new Date(todayStart().getTime() + DAY)), s) === "REFEED") steps.push({ a: "Normal day — refeed is tomorrow", why: "no pre-saving calories tonight. Worth knowing what tomorrow does and does not buy: at a matched weekly total, the only refeed RCT in trained people did not survive independent reanalysis, and across 12 trials the resting-metabolism benefit in resistance-trained subgroups is 11 kcal/day, 95% CI −67 to +46. It is a day you enjoy, not a metabolic intervention — and it is not free, because a higher Wednesday against a fixed week is a deeper Monday.", w: 35 });

  /* 5 · repair last night, tonight */
  if (lastNight) {
    if (lastNight.h < (s.sleep.cleanH || 7.5)) steps.push({ a: `Lights out ~${fmt12((() => { let m = lo.mins - 20; if (m < 0) m += 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; })())} — 20 early`, why: `last night ran ${lastNight.h} h — one modestly early night repays most of it; up at your usual ~${fmt12(lo.wakeRef || "07:30")} (aim near it — the morning log takes whatever really happened). If you must nap: ≤25 min, before 3 pm`, w: 55 + Math.min(25, Math.round(((s.sleep.cleanH || 7.5) - lastNight.h) * 12)) });
    else if (lastNight.sol != null && lastNight.sol >= 30) steps.push({ a: `Wind-down 30 min before ${fmt12(lo.t)}`, why: `drift-off ran ${lastNight.sol} min last night — screens off, lights low; the drift is usually paying for the evening's light`, w: 50 });
    else if ((lastNight.awakeMin || 0) >= 30) steps.push({ a: "Tonight: cooler room, no fluids after ~8:30", why: `you were awake ${lastNight.awakeMin} min mid-night — the two cheapest fixes first`, w: 48 });
    else steps.push({ a: `Lights out ~${fmt12(lo.t)}${lo.override ? " (set by you tonight)" : ""}`, why: `a bearing, not a test — up ~${fmt12(lo.wakeRef || "07:30")} · ${lo.target} h asleep + ~${lo.sol} min drift-off${(() => { const melaN = s.sleep.nights.filter((n) => n.d >= ((s.sleep.melaExp || {}).started || "2026-07-23") && !(n.tags || []).includes("mela")).length; return melaN < 7 ? ` · no-melatonin night ${melaN + 1}/7 — note your drift-off` : ""; })()}`, w: 30 });
  } else steps.push({ a: `Lights out ~${fmt12(lo.t)}${lo.override ? " (set by you tonight)" : ""}`, why: `a bearing, not a test — up ~${fmt12(lo.wakeRef || "07:30")} · ${lo.target} h asleep + ~${lo.sol} min drift-off`, w: 30 });
  { const tc3 = todayCaff(s); if (tc3 && tc3.mg > 0) { const at3 = caffAt(tc3.mg, tc3.atH, lo.mins / 60); if (at3 > 50) steps.push({ a: "Caffeine: earlier or smaller", why: `~${at3} mg still aboard at lights-out${tc3.logged ? "" : " (typical dose — log today's real one on NOW)"} — above ~50 mg deep sleep measurably thins`, w: 28 }); } }

  /* 6 · floor */
  /* Walking has never been tested as an interference modality — the concurrent-
     training literature studies running and cycling, and even there hypertrophy
     interference pools at SMD -0.01 to -0.04. So steps do not cost muscle
     directly. What they do is deepen the deficit, and deficit magnitude IS the
     dominant term for lean mass. That is the honest framing, and it is why this
     ranks last rather than being cheered. */
  /* Derived, not authored — see STEP_NOTE. Ranks up when he has drifted far
     enough off the window his maintenance was measured in that the calorie band
     is quietly wrong. */
  const stT = stepTarget(s);
  steps.push(stT.gated
    ? { a: "Steps 16.5k", why: `${stT.why} Walking is the deficit's quiet engine, and no concurrent-training meta-analysis has ever included a walking arm — the interference case against it is a plausibility argument, not a finding.`, w: 22 }
    : { a: `Steps ${(stT.lo / 1000).toFixed(1)}–${(stT.hi / 1000).toFixed(1)}k`, why: `${stT.why} No trial has ever tested a step prescription in a lean trained lifter in a deficit, and no concurrent-training meta-analysis has included a walking arm, so this is arithmetic rather than an evidence claim: it holds the number your calorie target is derived from.`, w: 22 + Math.min(30, Math.round(Math.abs(stT.driftKcal) / 4)) });
  const SHOW = 5;
  steps.sort((x, y) => (y.w || 0) - (x.w || 0));
  const held = Math.max(0, steps.length - SHOW);
  return { lead, steps: steps.slice(0, SHOW), held, ranked: true };
}

/* PLAIN ENGLISH LAYER — house vocabulary translated at render time, everywhere, forever */
const PLAIN_MAP = [
  ["provisional until a clean-sleep repeat", "pending until you repeat it"],
  ["logs provisional", "counts as pending for now"],
  ["log as provisional", "count as pending for now"],
  ["log provisional", "count as pending for now"],
  ["stamp provisional", "get marked pending"],
  ["provisional", "pending"],
  ["CLEAN is unreachable", "a good-sleep streak can't happen"],
  ["CLEAN unreachable", "a good-sleep streak impossible"],
  ["CLEAN stays reachable", "a good-sleep streak stays possible"],
  ["CLEAN sustainable", "the good-sleep streak holds"],
  ["needs sleep CLEAN", "needs the good-sleep streak complete (3 nights of 7.5+ h)"],
  ["sleep CLEAN", "a complete good-sleep streak"],
  ["Sleep clean", "Sleep streak complete"],
  ["CLEAN", "good-sleep streak"],
  ["own-attempts", "make-it-official attempts"],
  ["own-attempt", "make-it-official attempt"],
  ["coach-flag Monday", "a your-coach conversation Monday — the app never moves it alone"],
  ["coach-flag", "a your-coach conversation — the app never moves it alone"],
  ["stay coach-flag", "stay a your-coach decision"],
  ["nothing banks", "nothing becomes official"],
  ["everything banks", "everything becomes official"],
  ["everything here banks for real", "everything here counts as official"],
  ["it counts for real", "it counts as official"],
  ["debt-day", "short-sleep-day"],
  ["debt days", "short-sleep days"],
  ["debt day", "short-sleep day"],
  ["on debt", "on short sleep"],
  ["PRs", "records"],
  ["the governor", "the safety brake"],
  ["The governor", "The safety brake"],
  ["governor hold", "safety-brake hold"],
  ["zero-comp", "no-make-up-eating"],
  ["until owned", "until it's officially yours"],
  ["Gate passed", "Requirement met"],
  ["increment stays locked", "the weight increase stays locked"],
];
function plainify(t) {
  if (t == null) return t;
  if (typeof t !== "string") return t;
  let out = t;
  PLAIN_MAP.forEach(([a, b]) => { out = out.split(a).join(b); });
  return out;
}

/* shared grading math — the masthead and the scorecard read one truth */
function prophetGrades(s) {
  const fc = s.forecasts || [];
  const graded = [];
  fc.forEach((f) => {
    if (f.sealed) return;
    const targetD = isoOf(new Date(mk(f.d).getTime() + 7 * DAY));
    const g = fc.find((x) => x.d === targetD);
    if (g) graded.push({ err: +(g.trend - f.pred7).toFixed(1) });
  });
  const mae = graded.length ? +(graded.reduce((a, x) => a + Math.abs(x.err), 0) / graded.length).toFixed(2) : null;
  const bias = graded.length ? +(graded.reduce((a, x) => a + x.err, 0) / graded.length).toFixed(2) : null;
  return { graded, mae, bias, n: graded.length };
}

/* THE DOCKET — the lab's self-writing front page */
function labDocket(s) {
  const flat = labGroups(s).flatMap((g) => g.cards);
  const wkAgo = isoOf(new Date(todayStart().getTime() - 7 * DAY));
  const fresh = (s.feed || []).filter((f) => f.t && f.t.indexOf("LAB LIVE — ") === 0 && f.d >= wkAgo).map((f) => ({ t: f.t.replace("LAB LIVE — ", ""), d: f.d }));
  const armed = flat.filter((c) => c.status === "ARMED" && c.prog && c.prog.need > 0);
  const withEta = armed.map((c) => {
    const pct = c.prog.n / c.prog.need;
    const lbl = (c.prog.label || "").toLowerCase();
    let days = null;
    if (lbl.indexOf("night") > -1) days = c.prog.need - c.prog.n;
    else if (lbl.indexOf("week") > -1) days = (c.prog.need - c.prog.n) * 7;
    else if (lbl.indexOf("session") > -1 || lbl.indexOf("pair") > -1) days = Math.ceil((c.prog.need - c.prog.n) * 1.75);
    return { id: c.id, t: c.t, n: c.prog.n, need: c.prog.need, pct, eta: days != null ? isoOf(new Date(todayStart().getTime() + Math.max(1, days) * DAY)) : null };
  }).sort((a, b) => b.pct - a.pct).slice(0, 3);
  const sen = flat.find((c) => c.id === "sentinel");
  const quiet = sen ? sen.forYou.indexOf("quiet") > -1 : true;
  return { fresh, next: withEta, sentinel: { quiet, txt: sen ? (quiet ? "all quiet — every recent day inside your own baselines" : sen.forYou.split(".")[0]) : "arming" } };
}
const STATUS_RANK = { LIVE: 0, TRACKING: 0, ARMED: 1, MODEL: 2, "ON FILE": 3, LOCKED: 4 };
function labSections(s) {
  const flat = labGroups(s).flatMap((g) => g.cards);
  const speaking = flat.filter((c) => c.status === "LIVE" || c.status === "TRACKING");
  const gathering = flat.filter((c) => c.status === "ARMED").sort((a, b) => ((b.prog ? b.prog.n / b.prog.need : 0) - (a.prog ? a.prog.n / a.prog.need : 0)));
  const models = flat.filter((c) => c.status === "MODEL");
  const shelf2 = flat.filter((c) => c.status === "ON FILE");
  const later = flat.filter((c) => c.status === "LOCKED");
  return [
    { k: "speaking", title: `SPEAKING NOW (${speaking.length})`, sub: null, cards: speaking },
    { k: "gathering", title: `GATHERING — YOUR LOGGING FUNDS THESE (${gathering.length})`, sub: null, cards: gathering },
    { k: "models", title: `SANDBOX MODELS (${models.length})`, sub: "simulations, badged — touch, nothing real moves", cards: models },
    { k: "shelf2", title: `ON THE SHELF (${shelf2.length})`, sub: "settled science at your numbers — nothing to do here", cards: shelf2 },
    { k: "later", title: `LATER (${later.length})`, sub: null, cards: later },
  ].filter((sec) => sec.cards.length);
}
function labStatusList(s) {
  const flat = labGroups(s).flatMap((g) => g.cards);
  return [...flat].sort((a, b) => {
    const r = (STATUS_RANK[a.status] ?? 5) - (STATUS_RANK[b.status] ?? 5);
    if (r !== 0) return r;
    if (a.status === "ARMED" && b.status === "ARMED") { const pa = a.prog ? a.prog.n / a.prog.need : 0, pb = b.prog ? b.prog.n / b.prog.need : 0; return pb - pa; }
    return 0;
  });
}

/* results announce themselves — any card crossing its threshold posts to the feed */
const VOL_BANDS = { floor: 6, lo: 8, hi: 14, ceil: 16 };
const INDIRECT = { press: { triceps: 0.5, delts: 0.5 }, rows: { biceps: 0.5 }, pulldown: { biceps: 0.5 }, curl: { forearms: 0.5 } };
/* ---------- HEAD_BUCKET_NOTE — the instrument behind a card I already retracted ----------
   patchV33 split the deltoids into heads, withdrew a set-reallocation proposal
   built on the pooled bucket, and told him in his own feed that "when split by
   head it is 5-7 each — the high-return tier". Then this function went on
   counting by ex.mg, so the TRAIN chip kept printing `delts 17` flagged OVER in
   red, and sweepVolume kept reading OVER as grounds to trim a set.

   The retraction shipped. The instrument that produced it did not. Pelland 2025
   classifies anterior, lateral and posterior deltoid as separate muscles with
   separate exercises; pooling them makes a 17-set bucket that is not comparable
   to any per-muscle band in the literature. It buckets by head now, exactly like
   programmeVolume, so the two cannot disagree about the same athlete on the same
   day — which they did, on screen, for three commits. */
/* Head buckets are internal keys. They must never reach a screen raw — the
   TRAIN chip row and every volume card print this name. */
const MG_LABEL = { delts_side: "side delt", delts_rear: "rear delt", delts_front: "front delt" };
const mgLabel = (k) => MG_LABEL[k] || k;

/* ---------- EXERCISE_SELECTION — the biggest training lever, finally audited ----------
   The app spent its attention on rep tempo (SMD 0.09), eccentric speed (-0.06),
   periodisation (d = -0.02) and machines-vs-free-weights (-0.055, p=0.751) —
   all of them retired this session for being indistinguishable from zero. The
   variable that is 5-15x larger never appeared anywhere in the app at all.

   For a biarticular muscle, the joint you are NOT training sets the muscle's
   length, and length under load is what the growth difference tracks:
     standing vs seated calf raise   d = 0.88-1.58   (knee straight = gastroc loaded)
     overhead vs pushdown triceps    d = 0.54-0.61   (shoulder flexed = long head loaded)
     seated vs lying ham curl        favours seated  (hip flexed = hamstring lengthened)

   Audited against his actual gym, confirmed by him directly: his calf raise is
   standing, his ham curl is seated, and his leg extension seats him back for
   maximum quad stretch. He is already on the right side of every one of these.
   That is worth more than everything else this session removed, and the app had
   never once said so — an app that only speaks up to correct you is an app that
   teaches you nothing about what you are getting right.

   The triceps are the one deliberate exception and stay that way by his call.
   See TRICEP_NOTE. */
const SELECTION_AUDIT = [
  { id: "calves", ok: (ex) => /pause|stretch|standing|shoulder height/i.test(ex.setup || ""),
    lever: "knee angle", d: "0.88-1.58",
    right: "Standing, knee straight, with a pause in the stretch. The gastrocnemius crosses the knee, so a seated calf raise takes it almost entirely out of the movement and trains soleus instead. This is the single largest exercise-selection effect anywhere in the hypertrophy literature and you are on the right side of it.",
    wrong: "A seated calf raise bends the knee and slackens the gastrocnemius. Switching to a standing or leg-press calf raise is the largest single upgrade available in this programme." },
  { id: "ham", ok: (ex) => /seated|back d|hips pinned/i.test(ex.setup || ""),
    lever: "hip angle", d: "seated favoured",
    right: "Seated, hips flexed, hips pinned down. Flexing the hip lengthens the hamstring across it before the knee even moves, and the lengthened position is where the growth difference lives. A lying curl leaves the hip extended and the muscle short.",
    wrong: "A lying or standing curl keeps the hip extended, so the hamstring works short. A seated curl is the better buy if the gym has one." },
  { id: "extension", ok: (ex) => /max quad stretch|seat back/i.test(ex.setup || ""),
    lever: "hip angle", d: "smaller, same direction",
    right: "Seat back for maximum stretch. Rectus femoris crosses the hip too, so reclining lengthens it — the same principle as the other two, with a smaller effect because three of the four quad heads are single-joint.",
    wrong: "An upright seat shortens rectus femoris. Reclining the seat back is free." },
];
function exerciseSelection(s) {
  const out = [];
  SELECTION_AUDIT.forEach((a) => {
    const ex = (s.exercises || []).find((x) => x.id === a.id);
    if (!ex) return;
    const good = a.ok(ex);
    out.push({ id: a.id, n: ex.n, lever: a.lever, d: a.d, good, why: good ? a.right : a.wrong });
  });
  return { items: out, allGood: out.length > 0 && out.every((x) => x.good) };
}

/* ---------- NOW_FOCUS — the page knows why he opened it ----------
   NOW carried 28 cards and showed all 28 at 7am and at 9pm. His actual jobs in
   this app are about ninety seconds long — log the night and the scale in the
   morning, log three numbers at night — and everything between them is reading.
   Making him scroll a reading surface to reach a ninety-second job taxes the
   one variable this whole app agrees is the biggest: adherence.

   What the evidence does and does not license here matters, because the obvious
   move is wrong. Burden is NOT simply bad: comparing lower-burden logging (a
   wearable bite counter, a photo app) against a higher-burden manual database
   app, the MANUAL app produced better habit formation (remembering to track
   2.35 vs 5.0 and 4.0 on a 7-point scale, p<0.001) and more than double the
   weight loss (-6.8 vs -3.0 kg, p<0.001). The act of logging is part of the
   intervention. So the act stays exactly as manual as it is — what gets cut is
   the distance to it, which is a different quantity entirely.

   And what sustains logging is not automaticity. Modelling 97 participants over
   21 days found habit contributed only in the early stage and faded by day 21,
   while GOAL PURSUIT stayed dominant throughout — and the thing that predicted
   sustained practice was tailored feedback. So the personalised read is not
   decoration to be trimmed; it is the mechanism. It stays above the fold. The
   generic science goes one tap down.

   Times are his, not authored: the morning window closes when he has actually
   filed the morning inputs, and the evening window opens from his own logged
   dinner-to-bed pattern rather than a fixed hour. */
function nowFocus(s, hour) {
  const h = typeof hour === "number" ? hour : new Date().getHours();
  const tISO = isoOf(todayStart());
  const owed = [];
  /* morning: the two inputs the whole engine reads */
  const nightOwed = owedNights(s, h).length > 0;
  const weighed = (s.reads || []).some((r) => r.d === tISO);
  if (nightOwed) owed.push({ k: "night", t: "Log last night", why: "bed, wake, and how long you took to drop off — the body-composition read leans on this harder than anything else you enter" });
  if (!weighed) owed.push({ k: "weight", t: "Log the scale", why: "one number, fasted — the trend absorbs the noise so a single morning never moves a decision" });
  /* evening: the day's numbers */
  const dl = (s.dailyLogs || {})[tISO];
  const dayOpen = !dl || dl.cal == null;
  /* his own pattern: the hour by which he has historically closed the day.
     Falls back to 17:00 only until there is enough of his own record. */
  const eveningFrom = 17;
  if (dayOpen && h >= eveningFrom) owed.push({ k: "day", t: "Close the day", why: "calories, protein, steps — three numbers, then it is done" });
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && !(s.dailyLogs || {})[yISO];
  if (yOpen) owed.push({ k: "yesterday", t: "Yesterday never closed", why: "same numbers, honest timestamp — the ledger marks it logged-late, which is a fact rather than a fault" });

  const phase = h < 12 ? "MORNING" : h < eveningFrom ? "MIDDAY" : "EVENING";
  return {
    phase, hour: h, owed,
    clear: owed.length === 0,
    /* the single line at the top of the page */
    lead: owed.length
      ? { t: owed[0].t, sub: owed[0].why, more: owed.length - 1 }
      : phase === "MORNING"
        ? { t: "Morning's in", sub: "nothing owed until tonight — everything below is reading, not doing", more: 0 }
        : phase === "MIDDAY"
          ? { t: "Nothing owed right now", sub: "the day's numbers close it tonight", more: 0 }
          : { t: "Books closed", sub: "everything the analysts need is in", more: 0 },
  };
}
const volBucket = (ex) => (ex && (ex.head || ex.mg)) || null;
function muscleVolume(s) {
  const tISO6 = isoOf(todayStart());
  const win = (backLo, backHi) => Object.keys(s.sessionLog).filter((d) => { const g = (mk(tISO6) - mk(d)) / DAY; return g >= backLo && g < backHi; });
  const count = (days2) => { const by = {}; days2.forEach((d) => { (s.sessionLog[d].entries || []).forEach((e) => { const ex6 = (s.exercises || []).find((x) => x.id === e.id); const b6 = volBucket(ex6); if (!b6) return; const n6 = (e.reps || []).length; by[b6] = (by[b6] || 0) + n6; const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { by[mg2] = (by[mg2] || 0) + n6 * f2; }); }); }); return by; };
  const now7 = count(win(0, 7)), prev7 = count(win(7, 14));
  const mgs = [...new Set((s.exercises || []).map(volBucket).filter(Boolean))];
  return mgs.map((mg) => {
    const n7 = now7[mg] || 0, p7 = prev7[mg] || 0;
    const zone = n7 < VOL_BANDS.floor ? "UNDER" : n7 < VOL_BANDS.lo ? "LOW" : n7 <= VOL_BANDS.hi ? "IN-BAND" : n7 <= VOL_BANDS.ceil ? "HIGH" : "OVER";
    const lifts = (s.exercises || []).filter((x) => volBucket(x) === mg && typeof x.w !== "undefined");
    const vels = lifts.map((x) => ({ id: x.id, n: x.n, v: liftCall(s, x.id).vel })).filter((x) => x.v != null);
    const slipping = vels.filter((x) => x.v < -0.2).length;
    const gaining = vels.filter((x) => x.v > 0.2).length;
    /* Soreness stays keyed to the coarse muscle name, because that is what he
       taps on the morning card. A man reports sore shoulders, not a sore
       posterior deltoid. */
    const soreKey = (lifts[0] && lifts[0].mg) || mg;
    const sore7 = (s.soreness || []).filter((x) => (mk(tISO6) - mk(x.d)) / DAY < 7 && (x.mgs || []).includes(soreKey)).length;
    const fmtN = (x2) => (Number.isInteger(x2) ? x2 : +x2.toFixed(1));
    return { mg, n7: fmtN(n7), p7: fmtN(p7), zone, lifts, vels, slipping, gaining, sore7 };
  }).filter((m) => m.n7 > 0 || m.p7 > 0);
}
/* ---------- STRUCTURAL_VOLUME ----------
   muscleVolume() counts sets out of the session LOG, and sweepVolume() waits
   fourteen days of it before proposing anything. That is right for the fine
   adjustments — whether a muscle is recovering, whether bar speed is slipping —
   because those are questions only the log can answer.

   It is wrong for the question underneath. Weekly sets per muscle is not
   observed here, it is DESIGNED: the split is fixed at two upper and two lower
   days, and each lift has a set count written into it. Hamstrings get one
   exercise at two sets, twice a week. That is four sets a week by construction,
   below the retention floor, and no quantity of further logging will discover
   otherwise. Waiting a fortnight to notice an arithmetic fact is not caution.

   So this reads the programme rather than the record, and fires immediately.
   Same half-credit convention as the log-based ledger, so the two numbers are
   comparable and neither double-books a set.

   What the bands mean, from Pelland et al. 2025 (67 studies, 2,058 participants,
   the largest dose-response analysis available): return per set is highest at
   5-10 weekly sets, intermediate at 11-18, and lower above that. Every added set
   keeps buying something and buys less than the one before it. In a deficit the
   marginal set is worth less AND costs recovery he does not have — which makes
   an imbalance expensive in both directions at once: sets sitting on the flat
   part of one muscle's curve are sets not spent on the steep part of another's. */
function programmeVolume(s) {
  const perWeek = {};
  for (let i = 0; i < 7; i++) { const t = dayType(isoOf(new Date(mk("2026-07-27").getTime() + i * DAY)), s); if (t === "U" || t === "L") perWeek[t] = (perWeek[t] || 0) + 1; }
  const by = {};
  const add = (mg, n) => { if (mg) by[mg] = (by[mg] || 0) + n; };
  /* Bucket by HEAD where a muscle has separately-trained heads. Pelland 2025
     classifies anterior, lateral and posterior deltoid as different muscles with
     different exercise lists — pooling them produces a number that cannot be
     compared to any per-muscle band under any counting convention, and on this
     programme it produced a 17 that looked like an excess when the three heads
     are 5-7 each: the highest-return tier. Bench press is indirect for the
     ANTERIOR head only, which is what INDIRECT already encodes. */
  const bucket = (e) => e.head || e.mg;
  (s.exercises || []).forEach((e) => {
    const days = perWeek[e.day] || 0;
    if (!days || !e.sets) return;
    const n = e.sets * days;
    add(bucket(e), n);
    const lend = INDIRECT[e.id];
    if (lend) Object.entries(lend).forEach(([mg2, f2]) => add(mg2 === "delts" ? "delts_front" : mg2, n * f2));
  });
  return Object.keys(by).map((mg) => {
    const sets = +by[mg].toFixed(1);
    const zone = sets < VOL_BANDS.floor ? "UNDER" : sets < VOL_BANDS.lo ? "LOW" : sets <= VOL_BANDS.hi ? "IN-BAND" : sets <= VOL_BANDS.ceil ? "HIGH" : "OVER";
    const tier = sets <= 10 ? "highest return per set" : sets <= 18 ? "intermediate return" : "lowest return";
    const lifts = (s.exercises || []).filter((x) => (x.head || x.mg) === mg);
    /* A bucket fed only by what compounds lend has no exercise to add sets to,
       so it cannot be the subject of a volume recommendation — the anterior delt
       here is pressing, and the honest lever on it is the press. */
    return { mg, sets, zone, tier, indirectOnly: lifts.length === 0, lifts: lifts.map((x) => ({ id: x.id, n: x.n, sets: x.sets, day: x.day })) };
  }).sort((a, b) => b.sets - a.sets);
}
/* Pelland 2025's smallest detectable effect for hypertrophy is 2.05%. Their
   model is a square root of fractional weekly sets, calibrated so the marginal
   slope at 12.25 sets is 0.24%/set — which reproduces their own published
   "~6 extra sets from a base of 4" tier step, so the calibration holds.
   A recommendation whose modelled effect is under 2.05% is beneath the noise
   floor of the literature it comes from, and this app does not surface those. */
const HYP_SDES = 2.05, HYP_B = 1.76;
const hypGain = (from, to) => +(HYP_B * (Math.sqrt(Math.max(0, to)) - Math.sqrt(Math.max(0, from)))).toFixed(2);
/* The cheapest change available: sets moved from the flat part of one curve to
   the steep part of another cost nothing in recovery and buy real growth. */
/* ---------- CUTTING_VOLUME_NOTE — the right curve, the wrong phase ----------
   This function was about to propose adding SEVEN sets a week to his
   hamstrings. The arithmetic was correct and the recommendation was wrong,
   because the curve it reads is a GROWTH dose-response and he is in a DEFICIT.

   Pelland 2025 measures return-per-set for hypertrophy, in people eating enough
   to build. The one trial that put the same question to trained men in energy
   restriction found the opposite of a dose-response — Roth et al. 2023, n=38,
   six weeks at a 30 kcal/kg deficit with protein at 2.8 g/kg fat-free mass,
   which is close to his exact situation: high volume (5 sets per exercise, ~20
   weekly sets on quads) against moderate (3 sets, ~12). Lean mass fell 0.51 kg
   against 0.92 kg, NOT significantly different, with no difference in muscle
   thickness either. The paper's title is the finding: resistance training volume
   does not influence lean mass preservation during energy restriction.

   And retention is far cheaper than the growth band implies. Bickel 2011 took
   seventy adults through sixteen weeks of training, then cut them to a fraction
   of it for thirty-two weeks: young adults held their thigh lean mass on
   one-NINTH of the original volume — one session a week, one set per exercise —
   and gained strength doing it.

   So during a cut the honest bar is retention, and his four hamstring sets clear
   it. Adding seven would buy nothing measurable, cost recovery he does not have
   in a deficit, and lengthen every lower session — in service of a number
   borrowed from the wrong context. The distribution is still worth SHOWING,
   because it is real and it is the first thing to fix when he starts building.
   It is filed, not pushed. When the deficit ends the growth band becomes the
   right yardstick and this unparks itself. */
function volumeImbalance(s) {
  const pv = programmeVolume(s);
  if (!pv.length) return null;
  const under = pv.filter((m) => m.sets < VOL_BANDS.floor && !m.indirectOnly);
  const low = pv.filter((m) => m.sets >= VOL_BANDS.floor && m.sets < VOL_BANDS.lo && !m.indirectOnly);
  const over = pv.filter((m) => m.sets > VOL_BANDS.hi && !m.indirectOnly);
  /* Cutting is the default state of this app; the exit is what changes it. */
  const cutting = !((s.targets || {}).exitStart);
  if (!under.length && !over.length) return null;
  const donor = over.length ? over[0] : null;
  const taker = under.length ? under[under.length - 1] : (low.length ? low[low.length - 1] : null);
  /* How many sets does the taker actually need before the modelled gain clears
     the literature's own smallest detectable effect? On this programme the
     answer for hamstrings is SIX, not the two or three that reads as a sensible
     nudge — a three-set move is worth 0.47 percentage points against an SDES of
     2.05, which is a recommendation dressed as a finding. If nothing on the
     board clears the bar, this returns null and the app says nothing. */
  let need = null, gain = null;
  if (taker) {
    for (let k = 1; k <= 12; k++) {
      const g = hypGain(taker.sets, taker.sets + k);
      if (g >= HYP_SDES) { need = k; gain = g; break; }
    }
  }
  const detectable = need != null && (!donor || donor.sets - need >= VOL_BANDS.lo);
  /* The gate that matters: a proposal only fires when the deficit is over. */
  const actionable = detectable && !cutting;
  return { pv, under, low, over, donor, taker, need, gain, detectable, actionable, cutting, sdes: HYP_SDES,
    why: cutting
      ? `Filed, not proposed — you are in a deficit. The 6-12 band is a GROWTH dose-response measured in people eating enough to build. The one trial that asked the same question of trained men in energy restriction (Roth 2023, n=38, six weeks at a 30 kcal/kg deficit and 2.8 g/kg protein) found 20 weekly sets and 12 preserved lean mass identically — 0.51 kg lost against 0.92, not a significant difference, and no difference in muscle thickness. Retention is cheaper still: Bickel 2011 held young adults' thigh lean mass for 32 weeks on one-ninth of their original volume. So ${taker ? `${mgLabel(taker.mg)} at ${taker.sets} sets` : "your current allocation"} is adequate for what you are actually asking of it right now, which is to keep what you have while the deficit does the cutting. This is the first thing worth fixing when you start building — and it is on the record so nobody has to rediscover it then.`
      : `You are no longer in a deficit, so the growth band is the right yardstick again. ${taker ? `${cap(mgLabel(taker.mg))} sits at ${taker.sets} sets a week` : "One muscle sits below the band"}${need ? `, and it takes +${need} before the modelled gain clears the literature's own smallest detectable effect of ${HYP_SDES}% — a two-set nudge is worth about ${hypGain(taker.sets, taker.sets + 2)}pp, which is a recommendation dressed as a finding` : ""}.` };
}

function sweepVolume(s, dow7 = new Date().getDay()) {
  const tISO7 = isoOf(todayStart());
  const firstS = Object.keys(s.sessionLog).sort()[0];
  if (!firstS || (mk(tISO7) - mk(firstS)) / DAY < 14) return null;
  if (![0, 1].includes(dow7)) return null;
  const slp7 = sleepInfo(s);
  let ns = null;
  const cands = [];
  muscleVolume(s).forEach((m) => {
    const recent = (s.agentProposals || []).some((ap) => ap.kind === "volume" && ap.mg === m.mg) || (s.feed || []).slice(0, 80).some((f) => f.t && f.t.indexOf("VOLUME ") === 0 && f.t.indexOf("— " + m.mg.toUpperCase()) > -1 && (mk(tISO7) - mk(f.d)) / DAY < 14);
    if (recent) return;
    let dir = 0, why = "";
    if (m.zone === "UNDER" && m.p7 < VOL_BANDS.floor) { dir = +1; why = `${m.mg} has run under the retention floor (${m.n7} sets this week, ${m.p7} last week — floor is ${VOL_BANDS.floor}). One more weekly set is cheap insurance for keeping this muscle through the cut.`; }
    else if ((m.zone === "OVER" && m.p7 > VOL_BANDS.ceil) || (m.zone === "HIGH" && m.slipping >= 2 && slp7.clean) || false /* SORENESS_NOTE: the sore-blocks-volume rule is deleted. Soreness is a
       valid readout of what he DID and an invalid predictor of what he CAN DO.
       It does not track muscle damage (Schoenfeld & Contreras 2013: poorly
       correlated with strength loss, ROM, circumference and creatine kinase; MRI
       oedema peaks long after soreness does), it does not track hypertrophy
       (Damas 2016: myofibrillar protein synthesis only tracks growth once damage
       subsides), and no trial has ever shown that training a sore muscle impairs
       adaptation. The frequency literature points the other way — higher
       frequency means training muscles more often while still sore, and it
       slightly HELPS. On a four-day week with the question asked every morning,
       a sore-blocks-progression rule systematically suppresses exactly the
       muscles being trained hardest. It was an anti-progression engine. */) { dir = -1; why = m.zone === "OVER" ? `${m.mg} has run past the deficit ceiling two weeks straight (${m.n7} now, ${m.p7} last — caution starts at ${VOL_BANDS.ceil}). This house tilts toward stimulus, but two confirmed weeks over the line is the data speaking.` : (m.slipping >= 2 && slp7.clean) ? `${m.mg} sits high (${m.n7} sets) and ${m.slipping} of its lifts are slipping on clean sleep — that is your own bar speed saying this specific volume is costing more than it buys.` : `${m.mg} sits high (${m.n7} sets) and reported sore ${m.sore7} of the last 7 mornings — recovery is the constraint speaking before the bar speed does.`; }
    else if (m.zone === "IN-BAND" && m.n7 <= (VOL_BANDS.lo + VOL_BANDS.hi) / 2 && m.gaining >= 1 && m.slipping === 0 && slp7.clean && m.sore7 <= 1) { dir = +1; why = `${m.mg} is mid-band (${m.n7} sets), every lift is holding or gaining, and sleep is clean — the signals say there is headroom. One added set is the smallest honest experiment.`; }
    if (!dir) return;
    const pool = m.vels.length ? m.vels : m.lifts.map((x) => ({ id: x.id, n: x.n, v: 0 }));
    const pick = dir > 0 ? pool.slice().sort((a, b) => (b.v ?? 0) - (a.v ?? 0))[0] : pool.slice().sort((a, b) => (a.v ?? 0) - (b.v ?? 0))[0];
    if (!pick) return;
    cands.push({ m, dir, why, pick, sev: dir > 0 ? VOL_BANDS.floor - m.n7 : m.n7 - VOL_BANDS.hi });
  });
  cands.sort((a, b) => b.sev - a.sev).slice(0, 2).forEach(({ m, dir, why, pick }) => {
    ns = ns || JSON.parse(JSON.stringify(s));
    ns.agentProposals = [...(ns.agentProposals || []), { id: "vol" + m.mg + Date.now(), kind: "volume", mg: m.mg, exId: pick.id, dir, title: `VOLUME ${dir > 0 ? "+1" : "−1"} — ${m.mg.toUpperCase()} via ${pick.n}`, body: why + ` ${dir > 0 ? "Adds one set to " + pick.n + " (its strongest mover). The new set arrives as the final set — the effort ladder re-keys itself: it becomes the all-out set, the old final pulls back to 1 in reserve, and its rep target seeds one under your current last set." : "Removes the final set from " + pick.n + " (its weakest mover) — the effort ladder re-keys to the shorter shape automatically."} Two weeks of data before the ledger revisits this muscle.`, at: tISO7 }];
  });
  return ns;
}
function sweepStalls(s) {
  let ns = null;
  (s.exercises || []).forEach((ex) => {
    if (typeof ex.w !== "number") return;
    const lc = liftCall(s, ex.id);
    if (lc.verdict !== "RESET" || !lc.newW) return;
    const already = (s.agentProposals || []).some((ap) => ap.kind === "reset" && ap.exId === ex.id) || (s.feed || []).slice(0, 40).some((f) => f.t && f.t.indexOf("RESET APPLIED — " + ex.n) === 0);
    if (already) return;
    ns = ns || JSON.parse(JSON.stringify(s));
    ns.agentProposals = [...(ns.agentProposals || []), { id: "rs" + ex.id + Date.now(), kind: "reset", exId: ex.id, newW: lc.newW, title: `RESET ${ex.n} — ${ex.w} → ${lc.newW}`, body: lc.why + ` Rebuild the reps at ${lc.newW}; the bar comes back stronger than the stall left it.`, at: isoOf(todayStart()) }];
  });
  return ns;
}

function sweepLab(s, dow = new Date().getDay()) {
  let st0 = sweepStalls(s); if (st0) s = st0;
  const sv0 = sweepVolume(s); if (sv0) { s = sv0; st0 = sv0; }
  const flat = labGroups(s).flatMap((g) => g.cards);
  const seen = s.labSeen || {};
  const first = Object.keys(seen).length === 0;
  const flips = flat.filter((c) => (c.status === "LIVE" || c.status === "TRACKING") && seen[c.id] !== c.status);
  const tISO2 = isoOf(todayStart());
  const needJournal = !(s.forecasts || []).some((f) => f.d === tISO2);
  const wkAgo2 = isoOf(new Date(todayStart().getTime() - 6 * DAY));
  const needReview = (dow === 0 || dow === 1) && !(s.feed || []).some((f) => f.d >= wkAgo2 && f.t && f.t.indexOf("WEEK IN REVIEW") === 0);
  if (!flips.length && !first && !needJournal && !needReview) return st0 || null;
  const ns = JSON.parse(JSON.stringify(s));
  if (needJournal) {
    const cur2 = currentRate(ns);
    const r2 = cur2.measured ? cur2.scale : 1.2;
    ns.forecasts = [...(ns.forecasts || []), { d: tISO2, trend: ns.trend, rate: r2, pred7: +(ns.trend - r2).toFixed(1), sealed: blackoutOn(ns) }].slice(-60);
  }
  if (needReview) {
    const wr = weekReview(ns);
    ns.feed.unshift({ d: tISO2, t: `WEEK IN REVIEW · WK ${wr.wk}`, how: `${wr.verdict} — ${wr.lines.join(" · ")}`.slice(0, 220) });
  }
  ns.labSeen = {};
  flat.forEach((c) => { ns.labSeen[c.id] = c.status; });
  if (!first) {
    ns.labNews = ns.labNews || [];
    flips.forEach((c) => {
      ns.feed.unshift({ d: isoOf(todayStart()), t: "LAB LIVE — " + c.t, how: (c.forYou || (c.lines || [])[0] || "the shelf turned jade — open it").slice(0, 170) });
      ns.labNews.unshift(c.t);
    });
    ns.labNews = ns.labNews.slice(0, 4);
  }
  return ns;
}

/* the macro engine: snapshots + rule proposals. Idempotent per day. */
function runAdaptive(state, todayISO) {
  const s = JSON.parse(JSON.stringify(state));
  const monday = (() => { const d = mk(todayISO); const off = (d.getDay() + 6) % 7; return isoOf(new Date(d - off * DAY)); })();
  if (!s.weekly.some((w) => w.wk === monday) && s.reads.some((r) => !r.sealed && weeksBetween(monday, r.d) >= 0 && weeksBetween(monday, r.d) < 1))
    s.weekly.push({ wk: monday, trend: s.trend });

  const applied = (rid) => s.adjustments.some((a) => a.rid === rid);
  /* An open proposal is a live recommendation, not a postcard from the day it
     was raised. The old propose() skipped entirely when one was already armed,
     so its title and receipt froze at whatever the engine said the first time —
     and after an engine change they could freeze at something the engine no
     longer computes at all. A recovery card was still reading "45/100" weeks
     after the composite score it quotes was removed for violating this app's
     own rule against composite scores. Refresh the text and the dial on
     anything he has not acted on; leave the raised-on date alone so the age of
     the flag stays honest, and never resurrect one he already applied. */
  const propose = (rid, title, why, apply) => {
    if (applied(rid)) return;
    const open = s.proposals.find((p) => p.rid === rid && !p.resolved);
    if (open) { open.title = title; open.why = why; open.apply = apply; open.refreshed = todayISO; return; }
    s.proposals.push({ rid, id: `${rid}_${todayISO}`, d: todayISO, title, why, apply, resolved: false });
  };

  const sealed = daysUntil(s.blackout.until) > 0;
  const r = currentRate(s);
  if (!sealed && r.measured && r.rates.slice(-2).length === 2 && r.rates.slice(-2).every((x) => x < s.rate.floor))
    propose("floor_" + monday, "RATE FLOOR TRIPPED", `Two weeks under ${s.rate.floor}/wk (${r.rates.slice(-2).map((x) => x.toFixed(1)).join(", ")}). Your rule: restore steps FIRST. If steps are already at target, trim ~50 off the calorie band.`, { kind: "note" });
  /* The band had no teeth. floor and redline both fired, but the stated working
     band's UPPER edge did nothing — he could run above his own band for weeks
     and hear nothing until the redline, which sits far above it. His band top
     is 1.4 lb/wk; the redline is 1.9. That gap is 0.3%/wk of bodyweight, and it
     is exactly the gap Garthe 2011 measured: the 0.7%/wk arm gained 1.7% lean
     mass while the 1.0%/wk arm lost 2.0%, on identical total weight lost. A
     stated band that never speaks is decoration. */
  const above = r.measured ? r.rates.slice(-2).filter((x) => x > s.rate.band[1] && x < s.rate.redline) : [];
  if (!sealed && above.length === 2)
    propose("bandtop_" + monday, "RUNNING ABOVE YOUR BAND", `Two weeks at ${above.map((x) => x.toFixed(1)).join(" and ")} lb/wk, against a band that tops out at ${s.rate.band[1]}. Not a redline — the redline is ${s.rate.redline} and nothing is on fire. But this is the range where the evidence starts charging you: matched for total weight lost, the slower arm of the closest trial kept more muscle AND lost more fat than the faster one. The cheapest fix is not food — it is steps, because they cost you nothing you are trying to keep.`, { kind: "cal", delta: 75 });
  if (!sealed && r.measured && r.rates[r.rates.length - 1] >= s.rate.redline)
    propose("redline_" + monday, "REDLINE RATE", `${r.rates[r.rates.length - 1].toFixed(1)}/wk ≥ ${s.rate.redline}. Your rule: add ~100 back and flag your coach — this is not a win, it's muscle risk.`, { kind: "cal", delta: 100 });

  const bf = bfEst(s);
  if (!sealed && s.phase === "EASE 1" && bf.pct <= 13.2 && s.trend < 163)
    propose("ease2", "EASE 2 — CONDITIONS MET", `Est. BF ${bf.pct}% has crossed the ~13% line. Applying moves you to ${PHASES["EASE 2"].band.join("–")} cal with the step taper — scale will slow by design while fat loss holds.`, { kind: "phase", to: "EASE 2" });
  /* The exit prompt fires on the INTERVAL, not the point estimate. His anchor
     carries +/-3.5 points, so "BF crossed 11.2" is a claim the instrument
     cannot make — and prompting a man to end his cut on a number that could be
     three points out either way is exactly the false precision the charter
     forbids. It now fires when the estimate is low enough that the question is
     worth ASKING, and says out loud that the number cannot answer it. */
  const pivQ = s.queue.find((q) => q.id === "q_pivot");
  if (!sealed && bf.lo <= 11.2 && pivQ && !pivQ.done) {
    const dx = dietExit(s);
    propose("pivot", "WORTH ASKING: IS THE CUT DONE?",
      `Your body fat reads ${bf.pct}% and the honest range is ${bf.lo}–${bf.hi}% — the bottom of that range is into the zone where this question belongs on the table. The number cannot decide it; the range is ${(bf.hi - bf.lo).toFixed(1)} points wide, which is wider than the decision. Book the look with your coach.` +
      (dx.gated ? "" : ` If the answer is yes: one step from ${dx.from ?? "your current band"} to ${dx.maintenance} — your own measured maintenance, from ${dx.days} logged days — then hold ${dx.holdMin}–${dx.holdFull} weeks before deciding anything else. No ramp, no surplus on a schedule.`),
      { kind: "exit" });
  }

  /* ---------- PROGRAM_NOTE — the app has to make its own suggestions ----------
     The point of this ledger is to optimise the programme. A recommendation
     that only exists in a conversation is a recommendation the app failed to
     make. These are the standing evidence-vs-programme gaps, filed the same way
     every other change is: as a proposal, with the receipt, for his tap. They
     re-arm weekly while the gap is open and go quiet when it closes. */

  /* BAND_OWNERSHIP — the calorie band is engine-owned. calorieTarget() computes it
     live (the "Today's Protocol" card on NOW) from measured maintenance and the
     target rate over a matched window, and RE-DERIVES it every day — including the
     step taper a hand adjustment would chase. So no proposal may restate or
     re-derive the band: a second band figure in the inbox is exactly the
     agent-vs-engine conflict Joe flagged ("the proposals should never confuse me").
     A band-adjacent concern surfaces as an observation that cites the live band,
     never a competing number and never an approvable band change. (Retired here:
     "CALORIE BAND HAS DRIFTED FROM YOUR DATA", which offered to move the band by
     ct.drift — a redundant restatement of what the protocol card already shows.)
     ct stays: the refeed proposal below quotes the live band. */
  const ct = calorieTarget(s);

  /* ---------- REFEED_NOTE — the standing recommendation the app owed him ----------
     The programme runs a weekly Wednesday refeed at 2,450-2,500. The evidence
     for that, examined properly, is this:

     - Campbell et al. 2020 (JFMK) is the ONLY refeed RCT at a matched weekly
       total in resistance-trained people. Peos, Brown, Vorland, Allison &
       Sainsbury reanalysed it in the same journal later that year and found only
       DRY fat-free mass differed between arms — total FFM did not — because the
       original compared within-group significance across arms instead of testing
       the interaction. The headline did not survive.
     - Poon et al. 2025 (Nutrition Reviews), 12 RCTs, n=881: body mass -0.01 kg,
       fat mass 0.26 kg (p=0.38), FFM 0.17 kg (p=0.67). RMR favours intermittent
       by 47 kcal/day overall — but the RESISTANCE-TRAINED subgroup is 11 kcal/day,
       95% CI -67 to +46, p=0.71.
     - Peos 2021 measured leptin, testosterone and free T3 across a full week at
       maintenance in trained athletes. All three were unchanged. The mechanism a
       refeed is supposed to work through was flat.
     - Henselmans 2022 (49 studies) and 2026 (11 RCTs, hypertrophy SMD 0.15,
       95% CI -0.10 to 0.40, p=0.230): no isocaloric carbohydrate study has shown
       a strength or hypertrophy benefit, so the "fuel for tomorrow's session"
       case has nothing behind it either.

     And it is not free. Against a fixed weekly total, a Wednesday 400 kcal above
     the band means the other six days run ~67 kcal deeper, and deficit magnitude
     is the one variable the trained-population evidence does link to lean-mass
     loss (Murphy & Koehler 2022, ES -3.1e-4 per kcal/day).

     Where the evidence IS positive is DIET BREAKS — a full week at maintenance —
     and it is positive on adherence, not metabolism: ICECAP found lower hunger
     (p=0.002) and higher satisfaction (p=0.016); Siedler 2023 found disinhibition
     improved with breaks and worsened without (p<0.01). No trial has ever
     randomised a weekly refeed DAY with adherence as the outcome, so there is no
     basis for assuming one day inherits that.

     This is filed as a proposal rather than applied, because the calendar is his
     programme and law 3 says every change arrives as a proposal. */
  const nextWed = (() => { const t9 = todayStart(); const off9 = ((3 - t9.getDay()) + 7) % 7 || 7; return isoOf(new Date(t9.getTime() + off9 * DAY)); })();
  if (!sealed && dayType(nextWed, s) === "REFEED")
    propose("refeed_review", "THE WEEKLY REFEED HAS NO EVIDENCE BEHIND IT",
      `Your Wednesday refeed is prescribed at 2,450-2,500 against a band that is now ${ct.gated ? "derived from your maintenance" : `${ct.lo}-${ct.hi}`}. Applying this actually retires it: Wednesdays stop being refeed days from the day you tap, everywhere in the app, while every past Wednesday stays a refeed on the record because it was one. The case for refeeds does not hold up: the only matched-energy RCT in trained people (Campbell 2020) had its fat-free-mass result overturned on independent reanalysis, and across 12 trials the resting-metabolism advantage in resistance-trained subgroups is 11 kcal/day with a confidence interval from -67 to +46. Leptin, testosterone and free T3 were all unchanged across a full week at maintenance in the one trial that measured them. Higher-carbohydrate days have never beaten matched-calorie days for strength or hypertrophy in any isocaloric comparison. Meanwhile it costs something real: a Wednesday above the band deepens the other six days, and deficit size is the variable that actually predicts lean-mass loss. The proposal is to retire the fixed weekly refeed and simply run the band every day — keeping a DIET BREAK (a full week at maintenance) in reserve, which is the intervention the adherence evidence actually supports. If you keep the refeed, keep it because you enjoy it and it keeps you in the game. That is a real reason. It is just not the one the app has been giving you.`,
      { kind: "refeed" });

  /* The programme's own set allocation, which is arithmetic and needs no waiting. */
  const vi = volumeImbalance(s);
  if (!sealed && vi && vi.actionable && vi.taker) {
    const line = (m) => `${m.mg.replace("delts_", "delt ")} ${m.sets}`;
    propose("volstruct_" + monday, `${cap(vi.taker.mg.replace("delts_", "delt "))} IS AT THE MINIMUM EFFECTIVE DOSE`,
      `Counting what the programme allocates — two upper days and two lower, each lift's own set count, half-credit for what compounds lend, and deltoid heads counted separately because they are separately trained — your week runs: ${vi.pv.map(line).join(" · ")}. ${cap(vi.taker.mg.replace("delts_", "delt "))} sits at ${vi.taker.sets}, which Pelland 2025 (67 studies, 2,058 participants) identifies as the minimum effective dose: enough to HOLD the muscle, not enough to grow it. Bickel 2011 is the reassurance there — in young adults roughly three sets a week held quadriceps size across thirty-two weeks of otherwise no training, so nothing is being lost. The point is that nothing is being gained either. To move it into growth territory the honest number is ${vi.need} more sets a week, not two or three: their model's smallest detectable effect for hypertrophy is ${vi.sdes}%, and ${vi.need} sets is worth ${vi.gain}% where three would be worth under half of that — a recommendation the literature cannot tell apart from zero. ${vi.donor ? `${cap(vi.donor.mg.replace("delts_", "delt "))} at ${vi.donor.sets} is the only bucket with sets to spare, and it would still sit in the working band after giving them up.` : "There is no obvious donor, so this is an addition rather than a reallocation — which costs recovery you are short of in a deficit, and is a coach conversation."} This is arithmetic from your programme rather than a reading of your log, so it does not need more weeks to become true.`,
      { kind: "note" });
  }

  /* ---------- SELECTION_NOTE — the one training change worth the ink ----------
     The whole lengthened-partials story collapsed under testing: a 297-person
     multi-site trial found lengthened partials and full ROM practically
     equivalent, and a trained-subject RCT returned Bayes factors of 0.16-0.30 —
     moderate evidence FOR the null. The pattern nobody advertises is that every
     large pro-lengthened effect is in UNTRAINED subjects and every trained-subject
     study is null. And there are ZERO range-of-motion studies in pecs, delts or
     lats, which is five of his thirteen lifts.

     What survives is not about how he reps. It is about which machine he sits in,
     and the effects are five to fifteen times larger than anything in the ROM
     literature — because a biarticular muscle's length is set by the OTHER joint:

       standing vs seated calf raise  d = 0.88-1.58   gastrocnemius +9-12% vs +0.6-1.7%
       overhead vs pushdown triceps   d = 0.54-0.61   long head +28.5% vs +19.6%
       seated vs lying ham curl       direction confirmed, magnitude not retrieved

     The app cannot tell which variant he uses — "Calves", "Ham curl", "Tricep" are
     just names. So it asks rather than assuming, because a d=1.5 finding applied
     to the wrong machine is worth nothing and guessing would be the same error as
     every authored constant this audit has removed. */
  if (!sealed && (s.exercises || []).some((e) => ["calves", "ham", "tricep"].includes(e.id)))
    propose("selection", "THREE MACHINES MIGHT BE THE WRONG ONES — WORTH CHECKING",
      `This is the largest training effect in anything I have read for you, and it is not about reps or range of motion — it is about which machine, because a muscle that crosses two joints has its length set by the joint you are NOT training. Three questions. Is your calf raise done with the knee STRAIGHT (standing, or on a leg press) or BENT (seated)? Straight-knee produced +9-12% gastrocnemius growth against +0.6-1.7% for seated in a within-person MRI study — d = 0.88 to 1.58, the biggest single effect in this whole literature. Seated calf work essentially trains soleus only. Is your triceps work an overhead extension or a pushdown? Overhead grew the long head +28.5% vs +19.6% and the whole triceps +19.9% vs +13.9%, achieved with LIGHTER loads, because shoulder flexion puts the long head on stretch. And is your ham curl seated or lying? Seated flexes the hip and lengthens the hamstrings; the direction is established though I could not retrieve the exact percentages. Caveats worth having: these are small studies, mostly untrained subjects, and the calf one is n=14 — but they are within-person MRI designs and the mechanism is not in dispute. Set against that, the fashionable stuff is dead: lengthened partials came back practically equivalent to full range in a 297-person trial, tempo does not matter and if anything favours going faster, and slow eccentrics cost a great deal of perceived effort for a hypertrophy effect of −0.06. If any of the three answers is the short-muscle version, switching machines is free and worth more than every rep-mechanics tweak combined.`,
      { kind: "note" });

  /* Plates too coarse for the muscle — a hardware finding, not a programming one. */
  const coarse = coarseLifts(s);
  if (!sealed && coarse.length)
    propose("microload", "TWO LIFTS HAVE PLATES TOO COARSE FOR THEM",
      `${coarse.map((c) => `${c.n} steps ${c.step} lb on ${c.w} — a ${c.pct}% jump`).join(", and ")}. Reps fall about 0.4 for every 1% of load (Nuzzo 2024, 952 reps-to-failure tests across 269 studies), so ${coarse.length > 1 ? "each of those costs" : "that costs"} roughly ${coarse[0].lost} reps. Top out at ${coarse[0].hi}, take the jump, and you land near ${Math.max(1, coarse[0].hi - Math.round(coarse[0].lost))} — outside a tight window, with no rule to climb back. The ACSM's progression stand asks for 2-10% increments and specifically wants the SMALLER end on small-muscle exercises; fixed plates give you the exact inverse, 12.5% on a rear-delt fly against 1.6% on calves. Two fixes and the cheap one is hardware: 1.25 lb magnetic add-ons halve the jump and let the window stay tight. Otherwise the window has to widen to ${coarse[0].lo}-${coarse[0].hi}, which the app has already done. Worth knowing this is a derivation, not a citation — nobody has published guidance on rep-window width in a double-progression scheme.`,
      { kind: "note" });

  /* The rate band's UNIT, which quietly tightens the screw as he leans out. */
  const bwNow = s.trend;
  const bandPct = [((s.rate.band[0] / bwNow) * 100), ((s.rate.band[1] / bwNow) * 100)];
  if (!sealed && r.measured && bwNow > 0)
    propose("rateunit", "YOUR RATE BAND IS IN THE WRONG UNIT",
      `Your band is written as ${s.rate.band[0]}-${s.rate.band[1]} lb/wk — an absolute weight. At today's ${bwNow} lb that is ${bandPct[0].toFixed(2)}-${bandPct[1].toFixed(2)}% of bodyweight per week. At 148 lb the same band would be ${((s.rate.band[0] / 148) * 100).toFixed(2)}-${((s.rate.band[1] / 148) * 100).toFixed(2)}%. So the band gets steadily more aggressive as you get lighter, which is backwards twice over: the leaner you are the more of any deficit comes off lean tissue, and the closest trial we have (Garthe 2011) had the 0.7%/wk arm gain 1.7% lean mass while the 1.0%/wk arm lost 2.0% — on identical total weight lost. A band anchored in pounds tightens the screw exactly where it should loosen it. The proposal is to restate it as ${bandPct[0].toFixed(2)}-${bandPct[1].toFixed(2)}% of bodyweight and let the pound figures follow your weight down. Nothing about today changes — you are running ${((r.scale / bwNow) * 100).toFixed(2)}%/wk, which is ${r.scale / bwNow * 100 < bandPct[0] ? "just under the slow end already" : "inside it"}.`,
      { kind: "note" });

  /* The volume band vs the dose-response evidence, in a deficit. */
  const volDrift = VOL_BANDS.lo !== 6 || VOL_BANDS.hi !== 12;
  if (!sealed && volDrift)
    propose("volband", "VOLUME BAND SITS ABOVE THE HIGH-RETURN TIER",
      `Your working zone is ${VOL_BANDS.lo}–${VOL_BANDS.hi} weekly sets per muscle. The largest dose-response analysis available (67 studies, 2,058 participants) finds returns per set highest at 5–10 sets, intermediate at 11–18, and lower above that — each added set keeps buying something, and buys less than the one before it. In a deficit the marginal set is worth less AND costs recovery you do not have, which argues for living in the high-return tier rather than the middle one. The proposal is to tighten to 6–12. This is a programme change, so it is a coach conversation as much as a tap — the app will not move it on its own.`,
      { kind: "note" });

  const rec = recoveryIndex(s);
  /* A proposal whose trigger no longer holds should stand down, not sit on the
     NOW page asking to be applied. This one was armed partly off rep dips that
     are no longer counted, so without this it would linger forever making a
     claim the engine has stopped making. It resolves rather than vanishing —
     the record keeps it, the screen does not. */
  if (rec.band !== "LOW") {
    s.proposals.filter((p) => p.rid && p.rid.indexOf("recovery_") === 0 && !p.resolved).forEach((p) => {
      p.resolved = true; p.stoodDown = true;
      s.feed.unshift({ d: todayISO, t: "RECOVERY CARD STOOD DOWN", how: `the signals that raised it have cleared — ${rec.flags.length} of ${rec.watched} still up, which is below the line that holds structural changes` });
    });
  }
  if (rec.band === "LOW") {
    /* Named inputs, each with the receipt that raised it and the thing that
       clears it — not a composite score. Leads with the single biggest lever,
       because "here are five problems" is a list and "fix this one first" is
       advice. See RECOVERY_NOTE. */
    const others = rec.flags.filter((f) => f !== rec.lever);
    const why = [
      `${rec.flags.length} of the ${rec.watched} signals I watch are up.`,
      rec.lever ? `Start here: ${rec.lever.receipt}. ${cap(rec.lever.fix)}.` : "",
      others.length ? `Also up — ${others.map((f) => f.receipt).join("; ")}.` : "",
      rec.excludedDips ? `Not counted: ${rec.excludedDips} rep dip${rec.excludedDips > 1 ? "s" : ""} on short-sleep or rushed sessions, because those days lower reps by themselves and the sleep signal already has them.` : "",
      "Until these clear, no structural change runs this week — loads hold exactly where they are. Reps still progress, the record still counts, and nothing auto-changes. Tap to log the hold; leave it and the app re-reads it every morning.",
    ].filter(Boolean).join(" ");
    propose("recovery_" + monday, `RECOVERY LOW — ${rec.flags.length} OF ${rec.watched} SIGNALS UP`, why, { kind: "note" });
  }

  return s;
}

/* ---------- ADJUST_NOTE — why every proposal now carries a dial ----------
   These arrived as a single Apply button: take the number the machine chose, or
   take nothing. Dietvorst, Simmons & Massey (2018, Management Science, three
   studies, n = 288 / 816 / 818) tested exactly that against a version where the
   person could nudge the recommendation before accepting it. Uptake went from
   32% to 73-76% in one study and 47% to 68-71% in another.

   Two details decide the design. First, the effect was INSENSITIVE to how much
   adjustment was allowed — letting people move it by 2 worked as well as by 10.
   Second, CONSTRAINED adjustment produced more accurate outcomes than unlimited
   adjustment, because bounded users deviated less from the algorithm than users
   handed a blank field. So the dial is small on purpose: it is there to convert
   a decision he is refusing into one he will make, not to let him rewrite the
   engine. A free-text field would cost accuracy and buy nothing extra.

   The adjustment is recorded with the adjustment, so the record still says what
   actually happened rather than what was proposed. */
function proposalDial(p) {
  if (!p || !p.apply) return null;
  if (p.apply.kind === "cal") return { unit: "kcal", step: 25, max: 50, base: p.apply.delta || 0 };
  if (p.apply.kind === "sets") return { unit: "set", step: 1, max: 1, base: p.apply.delta || 0 };
  return null;
}
function applyProposal(state, pid, nudge = 0) {
  const s = JSON.parse(JSON.stringify(state));
  const p = s.proposals.find((x) => x.id === pid);
  if (!p || p.resolved) return s;
  const dial = proposalDial(p);
  const adj = dial ? Math.max(-dial.max, Math.min(dial.max, Math.round(nudge / dial.step) * dial.step)) : 0;
  p.resolved = true;
  p.nudge = adj;
  s.adjustments.push({ rid: p.rid, d: isoOf(todayStart()), title: p.title, nudge: adj });
  if (p.apply.kind === "refeed") {
    /* Dated, so history keeps reading as history — see REFEED_RETIREMENT. */
    s.targets = s.targets || {};
    s.targets.refeedOff = isoOf(todayStart());
    s.feed.unshift({ d: isoOf(todayStart()), t: "WEEKLY REFEED RETIRED", how: `Wednesdays stop being refeed days from today. Past ones stay on the record as refeeds, because they were. Your band is the same every day now — which is also about ${Math.round((2395 - 1893) / 7)} kcal/day less than you were averaging, since a 2,400 Wednesday against a 1,900 week was quietly raising the average nobody was showing you.` });
  } else if (p.apply.kind === "exit") {
    /* ---------- The hold clock starts here ----------
       dietExit promises two milestones — two weeks before the scale means
       anything, four before the re-measured maintenance is trustworthy — and
       nothing wrote the date they count from, so both were permanently
       unreachable. A plan with milestones that cannot arrive is a plan the app
       is only pretending to run. This is a dated decision like any other. */
    s.targets = s.targets || {};
    s.targets.exitStart = isoOf(todayStart());
    const dxA = dietExit(s);
    s.feed.unshift({ d: isoOf(todayStart()), t: "DIET EXIT — MAINTENANCE HELD",
      how: dxA.gated
        ? "The cut is over. Maintenance is not measured yet, so the number to eat at is the one you and your coach set — the hold still starts today."
        : `The cut is over. From today you eat at ${dxA.maintenance} — your own measured maintenance from ${dxA.days} logged days, in one step, not a ramp. Hold it ${dxA.holdMin} weeks before the scale means anything (the first pounds back are glycogen and water), and ${dxA.holdFull} before the re-measured number is worth trusting. Nothing about a surplus is decided; that is what the hold is for.` });
  } else if (p.apply.kind === "phase" && p.apply.to) {
    s.phase = p.apply.to;
    const q = s.queue.find((x) => x.id === "q_ease2"); if (q) { q.done = true; q.state = "FIRED"; }
    s.feed.unshift({ d: isoOf(todayStart()), t: `${p.apply.to} FIRED`, how: `est. BF crossed the line — targets now ${PHASES[p.apply.to].band.join("–")} · steps: ${PHASES[p.apply.to].steps}. Mirror outranks scale from here.` });
  } else {
    const tail = adj ? ` · you took it ${adj > 0 ? "+" : ""}${adj}${dial ? " " + dial.unit : ""} off the proposed number — recorded as applied, your version` : "";
    s.feed.unshift({ d: isoOf(todayStart()), t: "ADJUSTMENT LOGGED", how: `${p.title} — ${p.why}${tail}` });
  }
  return s;
}

/* analyst suggestions (from ledger/suggestions.json) — approve applies + logs; dismiss logs. Both sync back for grading. */
function applySuggestion(state, sug) {
  const s = JSON.parse(JSON.stringify(state));
  s.suggestionLog = s.suggestionLog || [];
  s.targets = s.targets || {};
  if (s.suggestionLog.some((x) => x.sid === sug.sid)) return s;
  const d = isoOf(todayStart());
  const a = sug.apply || { kind: "note" };
  let how = sug.title;
  if (a.kind === "protein" && a.to != null) { s.targets.proteinG = a.to; how = `protein target set to ${a.to} g/day`; }
  else if (a.kind === "sleep" && a.to != null) { s.targets.sleepH = a.to; how = `sleep target set to ${a.to} h`; }
  else if (a.kind === "cal") { how = "logged only — the engine owns the calorie band, so no analyst suggestion moves it"; }
  else if (a.kind === "dietbreak") { s.targets.dietBreak = d; how = "diet break armed — hold at maintenance this week"; }
  else if (a.kind === "progression") { s.targets.progression = a.to || true; how = "training progression noted — coach territory"; }
  s.suggestionLog.push({ sid: sug.sid, decided: "approved", d, title: sug.title, apply: a, predict: sug.predict || "" });
  s.adjustments.push({ rid: sug.sid, d, title: sug.title });
  s.feed.unshift({ d, t: "ANALYST SUGGESTION APPLIED", how: `${sug.title} — ${how}` });
  return s;
}
function dismissSuggestion(state, sug) {
  const s = JSON.parse(JSON.stringify(state));
  s.suggestionLog = s.suggestionLog || [];
  if (s.suggestionLog.some((x) => x.sid === sug.sid)) return s;
  const d = isoOf(todayStart());
  s.suggestionLog.push({ sid: sug.sid, decided: "dismissed", d, title: sug.title });
  s.feed.unshift({ d, t: "ANALYST SUGGESTION DISMISSED", how: sug.title });
  return s;
}

/* agent proposals (s.agentProposals) — approve applies the kind's change + logs, then
   clears it from the inbox; dismiss clears it (volume records a two-week cooldown).
   Extracted verbatim from the old inline NOW block so the one-door inbox can reuse it. */
function applyAgentProposal(state, ap, tISO) {
  const s = JSON.parse(JSON.stringify(state));
  if (ap.kind === "volume" && ap.exId && ap.dir) {
    const ex7 = s.exercises.find((x) => x.id === ap.exId);
    if (ex7) { ex7.sets = Math.max(1, (ex7.sets || 1) + ap.dir); s.feed.unshift({ d: tISO, t: `VOLUME ${ap.dir > 0 ? "+1" : "−1"} — ${ap.mg.toUpperCase()} via ${ex7.n} (now ${ex7.sets} sets)`, how: "the volume ledger proposed, you consented — two weeks of data before this muscle is revisited" }); }
  } else if (ap.kind === "reset" && ap.exId && ap.newW) {
    const ex3 = s.exercises.find((x) => x.id === ap.exId);
    if (ex3) { const oldW = ex3.w; ex3.w = ap.newW; ex3.last = null; s.feed.unshift({ d: tISO, t: "RESET APPLIED — " + ex3.n + " " + oldW + " → " + ap.newW, how: "3-session stall, evidence-based back-off, your consent — rebuild starts next session" }); }
  } else if (ap.kind === "trial") {
    const rec = ap.custom ? { custom: ap.custom, started: tISO } : { tplId: ap.tplId, started: tISO };
    s.trials = [...(s.trials || []), rec];
    s.feed.unshift({ d: tISO, t: "TRIAL STARTED — " + (ap.custom ? ap.custom.t : TRIAL_TPL[ap.tplId].t), how: ap.custom ? "designed by your analyst for a pattern in YOUR data, consented by you" : "proposed by your analyst, consented by you" });
  }
  s.agentProposals = (s.agentProposals || []).filter((x) => x.id !== ap.id);
  return s;
}
function dismissAgentProposal(state, ap, tISO) {
  const s = JSON.parse(JSON.stringify(state));
  if (ap.kind === "volume" && ap.mg) s.feed.unshift({ d: tISO, t: `VOLUME PASSED — ${ap.mg.toUpperCase()}`, how: "athlete dismissed — the ledger waits two weeks before raising this muscle again" });
  s.agentProposals = (s.agentProposals || []).filter((x) => x.id !== ap.id);
  return s;
}

/* dismiss an engine proposal (s.proposals). Law 10: the athlete overrides — even the
   engine's own autoregulation is a proposal he can decline, not a verdict. Marks it
   resolved so it leaves the door; the record keeps the decline; the engine re-arms it
   if the pattern that raised it still holds. */
function dismissProposal(state, pid) {
  const s = JSON.parse(JSON.stringify(state));
  const p = s.proposals.find((x) => x.id === pid);
  if (!p || p.resolved) return s;
  p.resolved = true; p.dismissed = true;
  s.adjustments.push({ rid: p.rid, d: isoOf(todayStart()), title: p.title, dismissed: true });
  s.feed.unshift({ d: isoOf(todayStart()), t: "ADJUSTMENT DECLINED", how: `${p.title} — you passed; nothing changed. The engine re-arms it if the pattern that raised it holds.` });
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
function patchV31(s) {
  /* `rir` has always been the OPENER's value, so lifting it into rirSets[0] is a
     lossless restatement of what was already recorded — not a guess. Every other
     slot stays null: the app did not ask for those sets, so it does not know. */
  const lift = (o) => {
    if (!o || Array.isArray(o.rirSets)) return;
    const len = ((o.reps) || []).length;
    const arr = new Array(len).fill(null);
    if (len && o.rir != null) arr[0] = o.rir;
    o.rirSets = arr;
  };
  Object.values(s.sessionLog || {}).forEach((sl) => (sl.entries || []).forEach(lift));
  (s.exercises || []).forEach((e) => lift(e.lastMeta));
  s.v = 31; return s;
}
function patchV32(s) {
  /* He applied the refeed-retirement proposal on a build where applying it did
     nothing but write a feed line — the proposal carried { kind: "note" }, so
     `dayType` never heard about it and Wednesday stayed a refeed day in all 34
     places it is called. The tap was real and his intent was recorded in
     `adjustments`; only the effect was missing. This honours it rather than
     asking him to tap a card he has already dismissed.

     Dated from the adjustment, not from today, so the retirement starts where he
     actually made it and every Wednesday before that stays a refeed on the
     record — which is what the refeed-bump line and the post-refeed water flag
     need in order to keep reading history truthfully. */
  const adj = (s.adjustments || []).find((a) => a.rid === "refeed_review");
  if (adj) {
    s.targets = s.targets || {};
    if (!s.targets.refeedOff) s.targets.refeedOff = adj.d || isoOf(todayStart());
  }
  s.v = 32; return s;
}
function patchV33(s) {
  /* The drip goes to zero — see DRIP_NOTE. Not a preference: the app's own
     arithmetic was claiming 4,402 kcal liberated per pound of scale weight
     against 4,282 in pure lipid, which is impossible, and every population-
     matched study puts lean mass flat to falling in a deficit this size.

     Kept as a field rather than deleted, because a DEXA re-anchor may one day
     give it a measured value. Assumed values are what this replaces. */
  if (s.model && s.model.drip !== 0) { s.model.dripWas = s.model.drip; s.model.drip = 0; }
  /* Deltoid heads, separated. Pelland 2025 classifies anterior, lateral and
     posterior deltoid as different muscles with different exercises — pooling
     them made a 17-set bucket that is not comparable to any per-muscle band, and
     that pooling is what produced a set-reallocation recommendation the same
     paper's own detection threshold says is indistinguishable from zero. */
  (s.exercises || []).forEach((e) => {
    if (e.head) return;
    if (e.id === "lateral") e.head = "delts_side";
    else if (e.id === "rearDelt") e.head = "delts_rear";
  });
  /* Retract the reallocation card if it is still open and unacted-on. It was
     built on the pooled bucket and sized below the literature's noise floor;
     leaving it up would be leaving a recommendation I know to be wrong. */
  (s.proposals || []).filter((p) => p.rid && p.rid.indexOf("volstruct_") === 0 && !p.resolved).forEach((p) => {
    p.resolved = true; p.stoodDown = true; p.retracted = true;
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "SET-REALLOCATION CARD WITHDRAWN", how: "It counted your three deltoid heads as one muscle, which made 17 sets look excessive when split by head it is 5-7 each — the high-return tier. And the move it proposed was worth about 0.5 percentage points of growth against a smallest-detectable-effect of 2.05%. It was a recommendation the evidence cannot distinguish from zero, so it is withdrawn rather than left standing." });
  });
  s.v = 33; return s;
}
/* ---------- v34 — the retired clean-sleep gate leaves his saved state ----------
   The gate came out of progressStep earlier, out of liftCall and rirPlan today,
   and out of every string in the source. But queue gates and exercise notes are
   DATA: they were seeded once and live in his saved state, so his phone would
   keep showing "Repeat 8,8,7 on a clean day" and "deferred 2x for sleep" long
   after the code stopped believing it. A rule that survives only in copy is
   still a rule, because he reads the copy.

   Nothing is deleted. The queue items keep their ids, their history and their
   done-state; only the sentence explaining the gate is rewritten to the rule
   the engine actually runs. */
function patchV34(s) {
  let touched = 0;
  /* ---------- The rule that makes this migration safe ----------
     A DONE queue item's gate field is not a gate any more — it is a RECEIPT.
     q_hack3 on his live state reads "Debuted 7,8,7", the actual result of the
     set, and the queue renders exactly that string on the win card. The first
     version of this function overwrote it unconditionally with future-tense
     text about a set he had already done, which is data loss on a hard
     guardrail. Nothing here touches a finished item, ever. */
  const rewrite = (str) => str
    .replace(/ on a clean day/gi, "")
    .replace(/ on a clean-sleep day/gi, "")
    .replace(/ on debt/gi, "")
    .replace(/\s*·\s*deferred \d+\s*[×x] for sleep/gi, "")
    .replace(/LOCKED\s*—\s*runs unless a true\s*<?\s*[\d.]+\s*h night/gi, "Runs when it wins the day's structural slot")
    .replace(/Gate passed\s*—\s*runs unless a true\s*<?\s*[\d.]+\s*h night/gi, "Gate passed — runs when it wins the day's structural slot")
    .replace(/\s{2,}/g, " ")
    .trim();
  (s.queue || []).forEach((q) => {
    if (q.done) return;                       /* finished items are receipts */
    ["gate", "rule"].forEach((k) => {
      if (typeof q[k] !== "string") return;
      const was = q[k], now = rewrite(was);
      if (now !== was) { q[k] = now; touched++; }
    });
  });
  /* The press OWN gate is the one whose remaining text needs a real sentence
     rather than a deletion — "Repeat 8,8,7 (last: 8,7,6)" with the sleep clause
     stripped reads like the app forgot why it was asking. Only if still open. */
  const pw = (s.queue || []).find((x) => x.id === "q_press_own");
  if (pw && !pw.done && /8,8,7/.test(pw.gate || "")) {
    const want = "Repeat 8,8,7 — the repeat is the confirmation";
    if (pw.gate !== want) { pw.gate = want; touched++; }
  }
  /* ---------- The diet exit reaches his phone ----------
     The seed changed q_pivot to kind:"exit" with the maintenance-first plan.
     Without this his saved copy keeps kind:"phase" and keeps printing the
     authored "Fast reverse (~1-2 wk to ~2,450) → lean surplus 2,700-2,950 ·
     MRV build" — the exact text the DIET_EXIT note says was deleted, rendering
     through a branch that describes a different card entirely. */
  /* The triceps question, closed on his answer. Same lesson as q_pivot: the
     seed is not the state. It was also waiting on a "build phase" that has no
     date and that he has not chosen — a gate on an undecided phase never
     resolves, it just sits there implying an unfinished decision. */
  const pg = (s.queue || []).find((x) => x.id === "q_peg");
  if (pg && !pg.done && /bottom-peg|BOTTOM-PEG/i.test(pg.t + " " + (pg.gate || "") + " " + (pg.rule || ""))) {
    pg.t = "TRICEP SETUP — SETTLED";
    pg.gate = "Your call: the Prime 3-peg stays";
    pg.rule = "Closed — the app stops raising this";
    pg.done = true;
    pg.state = "PARKED";
    touched++;
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "TRICEP QUESTION CLOSED",
      how: "This sat in your queue waiting for a build phase that has no date and that you have not decided on. It was also a confused question: the research says overhead beats pushdown for the long head at d = 0.54-0.61, because the long head crosses the shoulder — but the Prime's peg changes the RESISTANCE PROFILE, not the shoulder angle, so no peg setting could ever have bought that effect. Different variables. Asked directly, you chose to keep the Prime, and that holds up: it is the lift you will actually do, adherence is the biggest lever in the literature, triceps are one muscle of about ten, and your pressing already loads them indirectly. Closed. The app will not raise it again." });
  }
  const pv = (s.queue || []).find((x) => x.id === "q_pivot");
  if (pv && !pv.done && pv.kind !== "exit") {
    pv.kind = "exit";
    pv.t = "THE DIET EXIT";
    pv.gate = "When you and your coach call it — no date";
    pv.rule = "One step to your MEASURED maintenance, hold, then decide";
    touched++;
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "THE EXIT PLAN IS NOW YOURS",
      how: "It used to read 'fast reverse to ~2,450, then a lean surplus and an MRV build'. You said straight to maintenance, hold, then decide — so that is what it says now, and the number is your own measured maintenance rather than an authored 2,450, which sits about a hundred calories under it. Stepping up to a maintenance that is not your maintenance is just a smaller cut with a better name. No ramp: reverse dieting as a protocol has no controlled trial behind it. No surplus assumed: the hold exists so that decision has data under it." });
  }
  (s.exercises || []).forEach((e) => {
    if (e.ownNote && /clean day|sleep-clean|on debt/i.test(e.ownNote)) {
      const was = e.ownNote;
      e.ownNote = rewrite(was);
      if (e.ownNote !== was) touched++;
    }
  });
  /* The rirOverride flag has nothing left to override. Kept on the record
     rather than deleted — it is a decision he made, and this app does not
     rewrite history. It is simply no longer read by anything. */
  if (touched) {
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "THE CLEAN-SLEEP GATE IS GONE",
      how: "It was retired in the engine earlier but survived in three places that decided what you lift: the prescription desk held every lift on a short night, the set plan pulled your last set off failure, and the queue still told you sleep decided before your muscles did. None of that had evidence behind it — a short night costs about 2.85% on strength, which is smaller than your own set-to-set spread. Sleep still matters enormously, just for a different thing: at a matched deficit it decides how much of what you lose comes off muscle instead of fat. It is now on your sleep card as that, and nothing anywhere gates a rep on it." });
  }
  s.v = 34; return s;
}
function patchV30(s) {
  s.medsLog = s.medsLog || [];
  s.v = 30; return s;
}
function patchV29(s) {
  s.energy = s.energy || []; s.soreness = s.soreness || []; s.grip = s.grip || [];
  s.v = 29; return s;
}
function patchV28(s) {
  s.caffLog = s.caffLog || [];
  s.v = 28; return s;
}
function patchV27(s) {
  const had = (s.agentProposals || []).some((ap) => ap.kind === "volume");
  s.agentProposals = (s.agentProposals || []).filter((ap) => ap.kind !== "volume");
  if (had) { s.feed = s.feed || []; s.feed.unshift({ d: isoOf(todayStart()), t: "VOLUME PROPOSALS RECALLED", how: "cold-start misfire — the ledger compared your first logged week against a week before this app existed. It now waits for 14 full days of your logs and speaks on Sundays, two proposals at most." }); }
  s.v = 27; return s;
}
function patchV26(s) {
  (s.exercises || []).forEach((ex) => {
    if (ex.id === "hack") return;
    if (typeof ex.inc === "number" && ex.inc > 5) ex.inc = 5;
  });
  s.feed = s.feed || [];
  if (!s.feed.some((f) => f.t && f.t.indexOf("RULING — SMALLEST STEP, EVERY LIFT") === 0)) {
    s.feed.unshift({ d: isoOf(todayStart()), t: "RULING — SMALLEST STEP, EVERY LIFT", how: "every increment audited: stack machines take 5s (pulldown and ham curl were jumping 10); the hack stays 10 as plate-loaded; jump size is now editable on any card via the pencil" });
  }
  s.v = 26; return s;
}
function patchV25(s) {
  const cv = (s.exercises || []).find((x) => x.id === "calves");
  if (cv) cv.inc = 5;
  (s.queue || []).forEach((q) => {
    if (q.exId === "calves" && q.kind === "debut" && !q.done && typeof q.newW === "number" && q.newW > 320) {
      q.newW = 320; q.t = "CALVES 320 DEBUT"; q.gate = (q.gate || "") + " · rewritten to the machine's smallest step";
    }
  });
  s.feed = s.feed || [];
  if (!s.feed.some((f) => f.t && f.t.indexOf("RULING — SMALLEST HONEST INCREMENT") === 0)) {
    s.feed.unshift({ d: isoOf(todayStart()), t: "RULING — SMALLEST HONEST INCREMENT", how: "weight jumps take the machine's smallest step (calves 315 → 320, not 330) and debut targets expect to keep almost every rep — small steps, fast rebuilds, more honest sets near the top" });
  }
  s.v = 25; return s;
}
function patchV24(s) {
  const hk = (s.exercises || []).find((x) => x.id === "hack");
  if (hk) { hk.hi = 12; hk.last = null; }
  s.feed = s.feed || [];
  if (!s.feed.some((f) => f.t && f.t.indexOf("RULING — HACK LOADED UP") === 0)) {
    s.feed.unshift({ d: isoOf(todayStart()), t: "RULING — HACK LOADED UP +20", how: "when breathing fails before the quads, the weight rises and the reps drop — athlete call on the gym floor; rep ceiling now 12, fresh targets seeded at the new load" });
  }
  s.v = 24; return s;
}
function patchV23(s) { s.dayCtx = s.dayCtx || {}; s.v = 23; return s; }
function patchV22(s) { s.agentProposals = s.agentProposals || []; s.v = 22; return s; }
function patchV21(s) { s.temp = s.temp || []; s.v = 21; return s; }
function patchV20(s) { s.trials = s.trials || []; s.v = 20; return s; }
function patchV19(s) { s.pulse = s.pulse || []; s.v = 19; return s; }
function patchV18(s) {
  const rd = s.exercises.find((x) => x.id === "rearDelt");
  if (rd && rd.sets < 3) {
    rd.sets = 3;
    rd.n = "Rear-delt fly (cable · uni)";
    rd.note = "honest 10s — no hot opener · 3 sets per side, log the weaker side";
    s.feed.unshift({ d: isoOf(todayStart()), t: "REAR-DELT → 3×/SIDE (UNI)", how: "user-called mid-session 7/23 · log one number per round = the weaker side · third structural move today — the whole batch flags for the coach Monday" });
  }
  s.v = 18;
  return s;
}
function patchV17(s) {
  if (s.rirOverride === undefined) s.rirOverride = "2026-07-23";
  s.v = 17;
  return s;
}
function patchV16(s) {
  const lat = s.exercises.find((x) => x.id === "lateral");
  if (lat && lat.sets < 4) {
    lat.sets = 4;
    s.feed.unshift({ d: isoOf(todayStart()), t: "LATERAL 4TH SET — USER-CALLED", how: "added mid-session 7/23 · reference: last set ran 13 · rides beside today's rows debut — two structural moves in one day, flagged for the coach Monday" });
  }
  s.v = 16;
  return s;
}
function patchV15(s) {
  (s.queue || []).forEach((q) => { if (q.rule && q.rule.indexOf("LOCKED — runs unless") === 0) q.rule = q.rule.replace("LOCKED — runs unless", "Gate passed — runs unless"); });
  s.v = 15;
  return s;
}
function patchV14(s) { s.sleep.anchor = s.sleep.anchor || { wake: "06:45", inBed: 8.25 }; if (!s.sleep.anchor.asleepTarget) s.sleep.anchor.asleepTarget = 8; s.v = 14; return s; }
function patchV13(s) { s.forecasts = s.forecasts || []; s.v = 13; return s; }
function patchV12(s) { s.labSeen = s.labSeen || {}; s.v = 12; return s; }
function patchV11(s) {
  s.sleep.anchor = s.sleep.anchor || { wake: "06:45", inBed: 8.25 };
  if (s.sleep.caffMg === undefined) s.sleep.caffMg = null;
  s.sleep.melaExp = s.sleep.melaExp || { started: "2026-07-23", arm: "none", baseline: "5 mg most nights · ~6 h wakes" };
  s.v = 11;
  return s;
}
/* Applied in order, oldest first. To add a schema version: write patchVn, append
   it here, and bump SCHEMA_V — nothing else. The old nested-call chain was 31
   parentheses deep and a missing one only showed up at build time. */
const PATCHES = [patchV4, patchV5, patchV6, patchV7, patchV8, patchV9, patchV10, patchV11, patchV12, patchV13, patchV14, patchV15, patchV16, patchV17, patchV18, patchV19, patchV20, patchV21, patchV22, patchV23, patchV24, patchV25, patchV26, patchV27, patchV28, patchV29, patchV30, patchV31, patchV32, patchV33, patchV34];
function migrate(old) {
  if (old && old.v === SCHEMA_V) return old;
  /* A state NEWER than this build — he upgraded, then the app was rolled back.
     Hand it back untouched: no patch here understands schema n+1, and the only
     other exit below is a fresh SEED, which would wipe every read, night,
     dailyLog, session and queue item and then sync the wipe up. Some instruments
     may read oddly on fields this code does not know; re-upgrading restores full
     function. A visible misbehaviour is recoverable — a wipe is not. */
  if (old && old.v > SCHEMA_V) return old;
  if (old && old.v >= 3 && old.v < SCHEMA_V) return PATCHES.reduce((s, p) => p(s), JSON.parse(JSON.stringify(old)));
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
  return PATCHES.reduce((acc, p) => p(acc), s);
}

const GLOSSARY = {
  fixwindow: ["Fix window", "Yesterday's protein landed SHORT of the floor, so a 24-hour repair window opened. Clear the floor today and the record EXTENDS — the app measures recovery speed, never an unbroken chain. Unfixed, it just closes; nothing compounds. Only a shortfall opens it: protein is a floor, and eating over it was never a miss, whatever this entry used to say."],
  rir: ["RIR — reps in reserve", "How many clean reps were left when you racked it. 1 is 'honest' — one more good rep existed. 0 is a grind. Rate two sets: the FIRST, which says whether the load is still honest (0 twice running holds the weight), and the LAST, which the taper programs to failure — 0 there is the target, not a warning. Middle sets are prescribed, so they go unrated on purpose. When unsure at noon on the stim stack, call it 0."],
  ea: ["Energy availability", "What is left to run your body on after training is paid for: calories in, minus what training and deliberate walking cost, divided by your lean mass. The threshold that matters for a lean man is 25 kcal per kg of lean mass per day — above it, a deficit mostly takes fat; below about 20, more than 40% of what you lose comes off lean mass, and testosterone, thyroid and resting metabolism go with it. It shows a RANGE, not a number, and that is deliberate: the convention counts purposeful exercise, and 16,000 deliberate steps sit exactly on the line between training and just moving. Nobody has settled that, so the app shows both ways of counting instead of picking one and sounding certain. The session and step costs are population estimates, not measurements of you — which is why this instrument only ever claims which side of the line you are on."],
  rest: ["Rest between sets", "90 s on isolation, 150 s on compounds, and 30 s more before the final set. The number comes from where the evidence stops moving: pooled across nine studies, longer rest beats short rest by a small margin that runs through volume load — you keep more reps on the back sets — but no further benefit is measurable past about 90 s. So 90 is the floor worth holding and anything beyond it on isolation work is session time you are spending for nothing. Compounds sit at 150 s because that is inside the 2–3 min band tested directly in trained lifters. The extra 30 s before the last set is a judgement call, not a finding: that set is the one prescribed to failure, and it is the one the progression engine reads to size your next jump — so it is the set worth protecting."],
  pace: ["RUSHED (pace)", "That session ran on short rest — under about a minute between sets. It matters for one reason: less rest means fewer reps on the back sets, so the volume load drops. The reps still count and still move your trend. What a rushed day can't do is count toward a stall — three stalls lighten the bar 5%, and running out of time is not evidence that the weight is too heavy. The research here is modest and honest about itself: pooled across nine studies the rest effect is small and mostly runs through volume load, with nothing measurable past ~90 s. So the app records it as context, not as a verdict on the session."],
  debt: ["Short night", "That session followed a night under 6.5 h, or a three-night run averaging under 7. Down numbers on a short night read as context rather than regression, so the day is exempt from counting toward a stall. It does NOT make a record provisional — the strength cost of a short night is about 2.85%, smaller than the set-to-set noise the app already models, and no record here was ever gated on sleep once the desk stopped holding lifts."],
  clean: ["AT TARGET (sleep)", "A run of consecutive nights at your sleep target. It is NOT a gate — owns and earns count whenever you hit them, on any amount of sleep, because the strength cost of a short night is about 2.85% and that is smaller than your own set-to-set spread. What a run at target buys sits on the body-composition side: at a matched deficit, short sleep sends roughly 60% more of what you lose off lean mass instead of fat."],
  seal: ["Sealed scale", "Around events, reads are quarantined: logged but excluded from the trend, and every rate rule is muted. The seal exists so event water can never trigger a false alarm."],
  trend: ["Trend", "The damped average the whole app runs on: each clean read moves it 30% of the way, spikes clamp at ±1.5 lb, sealed reads don't touch it. Mornings are static; the trend is the instrument."],
  own: ["OWNED", "The standard repeated. One hit is a visit; a repeat is an address — and the repeat IS the confirmation, which is the entire statistical content of the rule. Sleep used to be a third condition stacked on top of it and is gone. Only owned standards let the load move."],
  earned: ["EARNED", "Reps hit the top of the window — the increment is bought and queues itself for a debut. Grinds at RIR 0 never earn."],
  debut: ["DEBUT", "An earned load's first outing. It runs when it wins its day's single structural slot, with zero rep expectations — log what it gives."],
  gated: ["GATED", "Visible but locked behind a named condition. The condition decides, not memory or mood."],
  reclaim: ["RECLAIM", "A standard that slipped. The exact rep line must be re-earned before anything moves — records here can fall and be won back."],
  parked: ["PARKED", "Deliberately shelved with a written trigger (a date, a phase, a coach call). Parked isn't forgotten; it's staged."],
  structural: ["Structural change", "A load jump, new set, or machine change. One per session, auto-picked from the queue — so every response stays attributable. Rep progression is unlimited."],
  whoosh: ["Whoosh", "Event water leaving days after the event — a spike that drains to a NEW low. Yours clears in 1–3 days; the LAB predicts the window in advance."],
  noonwindow: ["Why noon lifts read easy", "You lift at your stimulant peak, and stimulants mask effort — a set that feels like 2 in the tank is often 1 or 0. That's why the app asks you to read effort conservatively at noon, and why the honest-opener rule matters most here: the governor can only protect you from numbers you report truthfully."],
  rirplan: ["Suggested RIR — where it comes from", "The literature (Refalo 2023–24 meta-analyses; Helms-style RIR prescription) says 0–5 reps-in-reserve all build muscle, with a slight edge nearer failure — so everything tapers to a single terminal failure set — 2→1→0, and four-set movements run 2·1·1·0; only the last set of an exercise is ever programmed to failure. Your machine-based setup makes that true failure safe, and the opener stays the honest gatekeeper (earns judge the opener, so the final 0 can never corrupt the signal). Then YOUR data adjusts it: a governor hold floors everything at 2, and lifts where your logged openers run hot get one extra in the bank up front. It recomputes every session. What it no longer does is back the terminal set off failure after a short night — that rule is retired, because proximity to failure is the variable growth actually tracks and the strength cost of a short night is about 2.85%, inside the set-to-set noise this app already models."],
  driftoff: ["Estimating drift-off", "Morning-after guessing is the clinical standard (it's how sleep diaries work). Anchor on the last thing you remember — final position change, a thought, a sound — and count minutes from lights-out to that, rounded to 5. Truly no idea? Leave the 15: the math uses a rolling median and within-you comparisons, so honest-rough beats fake-precise. A wearable's latency number can go in the same box anytime."],
  nightdate: ["How nights are dated", "A night belongs to the evening it began: Tuesday night = Tue evening → Wed morning, filed under Tuesday. You log it the morning after. Before 5 a.m. the app still means the night you already finished — never the one you haven't slept yet. Missed a morning? The row stays, dated, for up to 3 days."],
  noise: ["Noise floor", "Your scale's day-to-day static, measured from your own deltas rather than assumed — the trend absorbs it so a single morning never moves a decision. Any single-morning move inside it is not information, and the app stamps it so."],
};

export const __test = { targetsFor, genSession, completeSession, runAdaptive, bfEst, currentRate, etaWeeks, migrate, applyProposal, undoRead, recoveryIndex, applyRead, observedTDEE, labAnalytics, shelfItems, debtLedger, liveRollups, weekDigest, theOneThing, owedNights, sleepSpanH, caffAt, medianSOL, lightsOutT, trendSeries, closeEvent, refeedBumps, weekReview, rirPlan, sessionDebrief, sleepLab, labAnalytics2, labGroups, labDocket, labStatusList, labSections, prophetGrades, plainify, dayProtocol, trialProposals, trialArmOn, trialVerdict, activeTrial, dossierText, dossierData, pulseRead, tempRead, bodyAlarm, restFor, askContext, agentToolExec, trialTpl, kitLetter, dayWeather, weekWeather, sweepLab, GLOSSARY, anchorDexa, SEED, dayType, HISTORY, ROLLUPS };

/* ---------- github self-filing (token never enters exportable state) ---------- */
const TOKEN_KEY = "prep-ledger-ghtoken";
const LEDGER_DICT = "FIELD DICTIONARY (authoritative — never guess a meaning): NIGHTS: h = hours asleep · bed/wake = clock times as logged (they vary; that is expected) · sol = drift-off, minutes to fall asleep · tags: woke = woke mid-night, caff = late caffeine. DAYS: cal/pro/steps as logged · dayCtx est = athlete-declared estimate day (rough numbers, lower evidentiary weight) · ⌁flags = day weather (event window / seal water / post-refeed / estimate). SESSIONS: entries = performed lifts only, w = load, reps per set, rir = reps in reserve on the opener · skipped = lifts deliberately not done (structured truth, zero phantom reps) · note = athlete prose, read it · niggles = flagged aches · dips = incidental dip count. READS: raw morning scale, sealed = quarantined event water, judge only via damped trend. PULSE bpm / TEMP °F = 60s wrist count and oral reading at wake. MEDSLOG: prescription taken/none with clock time — pure adherence bookkeeping; the system's biggest confound (appetite, pulse, effort, drift-off all move with it) now has a clock. ENERGY: morning 1–5 (1 fumes · 5 caged animal). SORENESS: muscles tapped sore at wake (empty list = nothing sore, logged). GRIP: best squeeze per hand in lb, same posture daily — a CNS-readiness number. DAILY sodium low/med/high and alcohol units ride the day numbers — units are a COUNT ONLY, a covariate for sleep/pulse/scale attribution; their calories live inside the athlete's logged cal and are never added by the app; on estimate days the unit count is a bracket midpoint like everything else. CAFFLOG: actual daily caffeine — mg and clock time as logged (mg 0 = a deliberate none-day); tail math runs on these, never an assumed noon. FEED: the app's event log — amendments and corrections here OVERRIDE older raw rows. RECORDS: a rep line becomes his when it clears his own measured set-to-set spread and then repeats — sleep is NOT a condition on it and never mention pending-on-sleep, that rule is retired. LAWS: a single terminal failure set per exercise, every session, including after a short night.";

async function ghSync(state) {
  let tok = null;
  try { tok = localStorage.getItem(TOKEN_KEY); } catch (e) {}
  if (!tok) return { ok: false, msg: "no token saved" };
  const url = "https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/state.json";
  const hdr = { Authorization: "Bearer " + tok, Accept: "application/vnd.github+json" };
  let sha = null;
  try { const g = await fetch(url + "?t=" + Date.now(), { cache: "no-store", headers: hdr }); if (g.ok) sha = (await g.json()).sha; } catch (e) {}
  const body = { message: "ledger auto-sync " + isoOf(todayStart()) + " [skip ci]", content: btoa(unescape(encodeURIComponent(JSON.stringify({ ...state, _dictionary: LEDGER_DICT })))), ...(sha ? { sha } : {}) };
  try {
    let put = await fetch(url, { method: "PUT", headers: { ...hdr, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const tr9 = [put.status];
    for (let rt = 0; !put.ok && (put.status === 409 || put.status === 422) && rt < 4; rt++) {
      await new Promise((r9) => setTimeout(r9, 500 + rt * 300));
      try { const g2 = await fetch(url + "?t=" + Date.now(), { cache: "no-store", headers: hdr }); if (g2.ok) body.sha = (await g2.json()).sha; } catch (e) {}
      put = await fetch(url, { method: "PUT", headers: { ...hdr, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      tr9.push(put.status);
    }
    if (put.ok) { try { snapshotMaybe(state, tok); localStorage.setItem("pl-lastsync", String(Date.now())); localStorage.removeItem("plSyncErr"); } catch (e) {} }
    if (!put.ok) { let et9 = ""; try { et9 = (await put.text()).slice(0, 140); } catch (e) {} try { localStorage.setItem("plSyncErr", JSON.stringify({ at: new Date().toISOString(), status: put.status, msg: et9, tr: tr9 })); } catch (e) {} }
    return put.ok ? { ok: true } : { ok: false, msg: "HTTP " + put.status + (put.status === 401 ? " — token expired?" : "") };
  } catch (e) { try { localStorage.setItem("plSyncErr", JSON.stringify({ at: new Date().toISOString(), status: 0, msg: "network" })); } catch (e2) {} return { ok: false, msg: "network" }; }
}
class TabGuard extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    const report = `Prep Ledger ${APP_V} · tab ${this.props.name} · ${new Date().toISOString()}\n${this.state.err.message}\n${(this.state.err.stack || "").slice(0, 600)}`;
    return (
      <Card accent={T.brass}>
        <Eyebrow c={T.brass}>THIS TAB HIT AN ERROR</Eyebrow>
        <div style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: 6 }}>Your data is safe — this is a display error, and the other tabs still work.</div>
        <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 6 }}>{this.state.err.message}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Btn small tone="jade" onClick={() => this.setState({ err: null })}>Try again</Btn>
          <Btn small onClick={() => { try { navigator.clipboard.writeText(report); } catch (e) {} }}>Copy report</Btn>
          <Btn small onClick={() => { try { localStorage.setItem("prep-ledger-crash", report); alert("Saved. Open LAB → Ask the Ledger and ask: diagnose my last crash"); } catch (e) {} }}>Ask the Ledger</Btn>
        </div>
      </Card>
    );
  }
}

/* analytics memo — the 49 instruments compute once per state object, not once per render */
const _labMemo = new WeakMap();
function labGroupsM(s) { if (_labMemo.has(s)) return _labMemo.get(s); const g = labGroups(s); _labMemo.set(s, g); return g; }
const _docketMemo = new WeakMap();
function labDocketM(s) { if (_docketMemo.has(s)) return _docketMemo.get(s); const d = labDocket(s); _docketMemo.set(s, d); return d; }

/* DATA WEATHER — every day carries its quality context; every consumer respects it */
function dayWeather(s, iso) {
  const flags = [];
  const manual = (s.dayCtx || {})[iso];
  if (manual && manual.est) flags.push({ k: "estimate", why: manual.note || "declared estimate day" });
  (s.events || []).forEach((e) => { const gap = (mk(iso) - mk(e.d)) / DAY; if (gap >= -1 && gap <= 2) flags.push({ k: "event", why: e.t || "event window", pre: gap < 0 }); });
  if (s.blackout && iso <= s.blackout.until && (mk(s.blackout.until) - mk(iso)) / DAY <= 9) flags.push({ k: "sealwater", why: "scale carries event water — sealed window" });
  { const mm2 = (s.medsLog || []).find((x) => x.d === iso); if (mm2 && !mm2.taken) flags.push({ k: "nomeds", why: "no meds this day — appetite, energy, and effort read differently" }); }
  if (dayType(isoOf(new Date(mk(iso).getTime() - DAY)), s) === "REFEED") flags.push({ k: "postrefeed", why: "morning after refeed — storage bump expected" });
  return { flags, noisy: flags.some((f) => f.k === "estimate" || f.k === "event" || f.k === "sealwater"), hard: flags.some((f) => f.k === "estimate" || (f.k === "event" && !f.pre)), est: flags.some((f) => f.k === "estimate") };
}
function weekWeather(s, days) {
  const hits = days.filter((d) => dayWeather(s, d).noisy).length;
  return { noisyDays: hits, clean: hits <= 1 };
}

/* KIT MODE — the replicator: a person is a JSON spec, not a codebase */
const KIT_SPECS = {
  demo: {
    name: "Demo", greeting: "Good morning", textScale: 1.25,
    modules: { walk: true, weight: true, sleep: true, bp: true, letter: true },
    vocab: { walk: "your walk", weight: "morning weight", sleep: "last night's sleep", bp: "blood pressure" },
    walkGoalMin: 30, weightUnit: "lb",
    safety: "This app never interprets blood pressure — it only keeps the record tidy for your doctor.",
  },
};
const KIT_KEY = "prep-ledger-person";
function kitLoad(name) {
  try { const raw = localStorage.getItem("prep-ledger-p-" + name); return raw ? JSON.parse(raw) : { v: 1, days: {} }; } catch (e) { return { v: 1, days: {} }; }
}
function kitSave(name, st) { try { localStorage.setItem("prep-ledger-p-" + name, JSON.stringify(st)); } catch (e) {} }
function kitLetter(spec, st) {
  const ds = Object.keys(st.days).sort();
  const now = todayStart().getTime();
  const inWk = (d, back) => { const t2 = mk(d).getTime(); return t2 > now - back * 7 * DAY && t2 <= now - (back - 1) * 7 * DAY; };
  const wk = (back) => ds.filter((d) => inWk(d, back)).map((d) => st.days[d]);
  const thisW = wk(1), lastW = wk(2);
  const walks = (a) => a.filter((x) => x.walkMin >= (spec.walkGoalMin || 20)).length;
  const avgW = (a) => { const v = a.filter((x) => x.weight).map((x) => x.weight); return v.length ? +(v.reduce((p, q) => p + q, 0) / v.length).toFixed(1) : null; };
  const L = ["Your week, in plain words:"];
  if (spec.modules.walk) { const wN = walks(thisW); L.push(`You took ${wN} good ${wN === 1 ? "walk" : "walks"} this week${lastW.length ? ` (${walks(lastW)} the week before${walks(thisW) > walks(lastW) ? " — more than last week, which is the whole game" : walks(thisW) === walks(lastW) ? " — steady, which counts" : ""})` : ""}.`); }
  if (spec.modules.weight) { const a2 = avgW(thisW), b2 = avgW(lastW); if (a2) L.push(`Average ${spec.vocab.weight}: ${a2} ${spec.weightUnit}${b2 ? ` (was ${b2})` : ""} — single days wiggle; the average is the truth.`); }
  if (spec.modules.bp) { const n2 = thisW.filter((x) => x.bp).length; if (n2) L.push(`${n2} ${spec.vocab.bp} reading${n2 > 1 ? "s" : ""} on file this week — a tidy record is exactly what your doctor wants to see.`); }
  L.push("Nothing to fix. Just keep showing up.");
  return L.join(" ");
}
function kitGreet() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; }
function KitApp({ spec, onExit }) {
  const [st, setSt] = useState(() => kitLoad(spec.id));
  const tI = isoOf(todayStart());
  const day = st.days[tI] || {};
  const up = (patch) => { const ns = { ...st, days: { ...st.days, [tI]: { ...day, ...patch } } }; setSt(ns); kitSave(spec.id, ns); };
  const F = (x) => Math.round(x * (spec.textScale || 1));
  const [w2, setW2] = useState(day.weight || 150);
  const [bp1, setBp1] = useState(120); const [bp2, setBp2] = useState(80);
  return (
    <div style={{ position: "fixed", inset: 0, background: T.ink, zIndex: 80, overflowY: "auto", padding: "16px", paddingTop: "calc(env(safe-area-inset-top, 24px) + 18px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <H size={F(20)}>{kitGreet()}, {spec.name}</H>
        <button onClick={onExit} style={{ fontFamily: mono, fontSize: 10, color: T.steel, background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 8, padding: "8px 12px", flexShrink: 0 }}>switch ✕</button>
      </div>
      {spec.modules.walk && (
        <Card accent={day.walkMin >= spec.walkGoalMin ? T.jade : undefined} style={{ marginTop: 12 }}>
          <Eyebrow c={T.jade}>{spec.vocab.walk.toUpperCase()}</Eyebrow>
          {day.walkMin >= spec.walkGoalMin ? <div style={{ fontFamily: body, fontSize: F(15), color: T.jade, marginTop: 6 }}>✓ done — {day.walkMin} minutes</div> : (
            <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
              {[spec.walkGoalMin, spec.walkGoalMin + 15].map((m2) => <Btn key={m2} tone="jade" onClick={() => up({ walkMin: m2 })}><span style={{ fontSize: F(13) }}>{m2} min ✓</span></Btn>)}
            </div>
          )}
        </Card>
      )}
      {spec.modules.weight && (
        <Card style={{ marginTop: 10 }}>
          <Eyebrow>{spec.vocab.weight.toUpperCase()}</Eyebrow>
          {day.weight ? <div style={{ fontFamily: mono, fontSize: F(15), color: T.jade, marginTop: 6 }}>✓ {day.weight} {spec.weightUnit}</div> : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}><Stepper v={w2} set={setW2} step={0.5} min={60} /><Btn small tone="jade" onClick={() => up({ weight: w2 })}>Save</Btn></div>
          )}
        </Card>
      )}
      {spec.modules.sleep && (
        <Card style={{ marginTop: 10 }}>
          <Eyebrow>{spec.vocab.sleep.toUpperCase()}</Eyebrow>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            {["good", "ok", "rough"].map((v2) => <Btn key={v2} small tone={day.sleepQ === v2 ? "jade" : undefined} onClick={() => up({ sleepQ: v2 })}><span style={{ fontSize: F(12) }}>{v2}{day.sleepQ === v2 ? " ✓" : ""}</span></Btn>)}
          </div>
        </Card>
      )}
      {spec.modules.bp && (
        <Card style={{ marginTop: 10 }}>
          <Eyebrow>{spec.vocab.bp.toUpperCase()} — WHEN YOU TAKE IT</Eyebrow>
          {day.bp ? <div style={{ fontFamily: mono, fontSize: F(14), color: T.jade, marginTop: 6 }}>✓ {day.bp} on file</div> : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <Stepper v={bp1} set={setBp1} step={2} min={70} /><span style={{ color: T.dim }}>/</span><Stepper v={bp2} set={setBp2} step={2} min={40} />
              <Btn small tone="jade" onClick={() => up({ bp: bp1 + "/" + bp2 })}>Save</Btn>
            </div>
          )}
          <div style={{ fontFamily: body, fontSize: F(9.5), color: T.dim, marginTop: 7 }}>{spec.safety}</div>
        </Card>
      )}
      {spec.modules.letter && (
        <Card accent={T.jade} style={{ marginTop: 10 }}>
          <Eyebrow c={T.jade}>YOUR SUNDAY LETTER</Eyebrow>
          <div style={{ fontFamily: body, fontSize: F(12.5), color: T.chalk, marginTop: 6, lineHeight: 1.65 }}>{kitLetter(spec, st)}</div>
        </Card>
      )}
    </div>
  );
}

/* ASK THE LEDGER — bespoke instruments on demand, standing on the 49 built ones */
const ANTH_KEY = "prep-ledger-anthkey";
function askContext(s, docs) {
  docs = docs || {};
  const days = Object.entries(s.dailyLogs).sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-14)
    .map(([d, v]) => { const w2 = dayWeather(s, d); return `${d}: cal ${v.cal ?? "—"} · pro ${v.pro ?? "—"} · steps ${v.steps ?? "—"}${w2.flags.length ? "  ⌁[" + w2.flags.map((f) => f.k).join(",") + "]" : ""}`; }).join("\n");
  const sess2 = Object.keys(s.sessionLog).sort().slice(-6).map((d) => { const sl2 = s.sessionLog[d]; const parts = [(sl2.entries || []).map((e) => `${e.id} ${e.w}×${(e.reps || []).join(",")}${e.rir != null ? ` RIR${e.rir}` : ""}`).join(" · ") || "no lifts"]; if ((sl2.skipped || []).length) parts.push("SKIPPED: " + sl2.skipped.map((k) => k.id).join(", ")); if (sl2.note) parts.push(`note: "${sl2.note.slice(0, 120)}"`); return `${d}: ` + parts.join(" · "); }).join("\n");
  const nights2 = s.sleep.nights.slice(-14).map((n) => `${n.d}: ${n.h}h · bed ${n.bed || "—"} → wake ${n.wake || "—"} · drift-off ${n.sol ?? "?"}m${(n.tags || []).length ? " · " + n.tags.join("/") : ""}`).join("\n");
  const laws = `DATA WEATHER LAW: days marked ⌁[event/sealwater/estimate/postrefeed] carry water or intake noise — NEVER build causal or trend claims on them without naming the flag; prefer clean days, and say when a finding leans on flagged ones. HOUSE LAWS: fat-loss corridor ${(s.rate && s.rate.band ? s.rate.band : [1.0, 1.4]).join('–')} lb/wk (${(s.rate || {}).redline || 1.9}+ = too fast); calorie floor ${calorieFloor(s).floor} (DERIVED from energy availability at his lean mass — not the old authored 1,700); calories, protein and steps are all DERIVED from his record, never quoted as constants — take them from the CANONICAL NUMBERS block and nowhere else; a new best becomes official on ONE repeat, because his own measured set-to-set spread is about ±${typicalError(s, null).reps} reps (${typicalError(s, null).src}) and a +1 record sits inside it — a jump two standard errors clear of the old line banks on the first sighting instead; short sleep does NOT block a record and does NOT cap the step (that rule was retired — Craven 2022 puts acute sleep loss at −2.85% on strength, inside the 1.8–3.3% test-retest CV, and no trial has ever tested damping progression on low-readiness days), what it does is exempt the day from counting toward a stall; RIR on the LAST set is what sizes the next jump and is the most valuable number he enters; one structural change per session; effort tapers to a single terminal failure set per exercise (RIR 2→1→…→0) — proximity to failure is the training variable with the dose-response, not load or rep range, which are interchangeable from about 5 to 30 reps; the scale seal quarantines event water; the weekly refeed is RETIRED — he took it off the calendar himself after the evidence was laid out, so do not propose one and never claim a refeed aids fat loss, muscle retention, metabolism or next-day performance; past Wednesdays on the record were refeeds and stay described as such, because they were; every change is a proposal — the athlete consents, the coach holds structural authority. NEVER assert a mechanism this app cannot cite; saying 'there is no good evidence either way' is always available and always preferred to a confident guess.`;
  const evs = (s.events || []).map((e) => `${e.d}: ${e.t}${e.estimated ? " (est-declared)" : ""}`).join(" · ") || "none";
  const trls = (s.trials || []).map((t3) => { const tp = trialTpl(t3); return tp ? `${tp.t} (started ${t3.started})` : ""; }).filter(Boolean).join(" · ") || "none";
  const gate2 = sleepInfo(s);
  /* The canonical numbers, handed over rather than left to be re-derived. The
     analyst and the engine were quoting TDEEs 200+ kcal apart because each was
     computing its own rate from the same ledger by a different method. One
     source, stated method, stated uncertainty — and an instruction not to
     recompute it, because a second opinion here is not insight, it is drift. */
  const rC = currentRate(s), tdC = observedTDEE(s), ctC = calorieTarget(s), eaC = energyAvailability(s);
  const bfC = bfEst(s);
  const canon = " CANONICAL NUMBERS (use these verbatim; do NOT re-derive them from the raw logs — the engine already did, with a stated method): "
    + `BODY FAT ${bfC.pct}% with an honest interval of ${bfC.lo}-${bfC.hi}% (anchored by ${bfC.src}, +/-${bfC.anchorErr} points, ${bfC.wks} weeks ago). That width is real and does not shrink by being ignored — quote the interval whenever the answer turns on which side of a threshold he sits. `
    + `RATE ${rC.scale} lb/wk by ${rC.method}${rC.ci ? ` (95% CI ${rC.lo}–${rC.hi}, n=${rC.n} daily reads)` : ""}. `
    + (tdC ? `MEASURED TDEE ${tdC.tdee} kcal${tdC.lo && tdC.hi ? ` (${tdC.lo}–${tdC.hi} carrying the rate's error)` : ""} from ${tdC.days} logged days at ${tdC.avg} kcal/day average intake. ` : "MEASURED TDEE: not enough clean days yet. ")
    + (ctC.gated ? "" : `TARGET INTAKE ${ctC.lo}–${ctC.hi} kcal/day, derived from that maintenance and his ${ctC.band[0]}–${ctC.band[1]} lb/wk band. `)
    + (eaC.gated ? "" : `ENERGY AVAILABILITY ${eaC.ea} kcal/kg lean (${eaC.band}) counting structured training only — that is the IOC's convention and the only figure comparable to the ${EA_SPARING} threshold. Counting his deliberate walking as training instead gives ${eaC.eaAll}, which is a real reading of everything he burns in a day but has no published threshold behind it: quote ${eaC.ea} against the line and mention ${eaC.eaAll} only as the other convention. The ${EA_SPARING} itself is EXTRAPOLATED from semi-starvation work and bodybuilder case reports — the IOC's 2023 male range is roughly 9–25 and no controlled study has tested a lean resistance-trained male at 23 vs 30. Say so if you cite it. `)
    + (() => { const p9 = proteinTarget(s); return p9.straddles
        ? `PROTEIN TARGET ${p9.g} g, and the honest statement is a RANGE of ${p9.lo}-${p9.hi} g. ${p9.lo} is 2.5 g/kg of his ${p9.ffmKg} kg lean mass — the line where the deficit meta-regression's trend crosses zero net lean-mass change. ${p9.hi} is the lean-subgroup coefficient, which applies under ${LEAN_SUBGROUP_BF}% body fat. His body-fat read is ${p9.bf}% with an interval of ${p9.bfLo}-${p9.bfHi}%, so that threshold sits INSIDE his own error bars and neither end can be stated with confidence — give the range if he asks. Anything at or above ${p9.floor} g is defended: protein is a FLOOR, not a bullseye, so never call a high-protein day a miss. `
        : `PROTEIN TARGET ${p9.g} g (${p9.perKg} g/kg of ${p9.ffmKg} kg lean), floor ${p9.floor} g. Protein is a FLOOR, not a bullseye — never call a day above it a miss. `; })()
    + `Do NOT vary it by day type: the only direct training-vs-rest-day comparison (Moore 2024, indicator amino acid oxidation) found requirement HIGHER on rest days, and no study has ever tested raising protein on a short-sleep or low-recovery day. `
    + (() => { const stC = stepTarget(s); return stC.gated ? "" : `STEP TARGET ${stC.lo.toLocaleString()}–${stC.hi.toLocaleString()}/day — this is not a health guideline, it is the step count his measured maintenance was measured at (${stC.avg.toLocaleString()} across ${stC.days} days). Every 1,000 steps is about ${stC.kcalPer1k} kcal at his bodyweight, so drifting off it silently invalidates the calorie band. `; })()
    + (() => { const an = sleepAnchor(s); if (!an.measured) return `SLEEP CLOCK: not enough nights with bed and wake times yet — ${an.why} `;
        const shift = an.shiftMin > 0 ? `To clear his ${an.target} h target at the wake time he already keeps, lights out ${an.needBed} — ${an.shiftMin} minutes earlier.` : "He already clears his target.";
        return `HIS SLEEP CLOCK (measured, do NOT re-derive): bed ${an.bed} +/-${an.bedSDmin} min, up ${an.wake} +/-${an.wakeSDmin} min, ${an.curH} h asleep across ${an.n} nights. ${shift} His BEDTIME is the steadier end of the night and his WAKE is the variable one, so name bedtime as the lever — never 'fix your wake time', which asks him to control the end he controls least. Sleep is a BODY-COMPOSITION lever here, not a session one: at a matched deficit short sleep shifts roughly 60% more of the loss onto lean mass (Nedeltcheva 2010), while the session cost sits inside the noise. `; })()
    + (() => { const dx = dietExit(s); if (dx.gated) return "";
        return `THE DIET EXIT (his stated plan, not a default): straight to maintenance, hold, then decide. One step from ${dx.from} to ${dx.maintenance} — his MEASURED maintenance — then hold ${dx.holdMin}-${dx.holdFull} weeks before choosing anything else. Do NOT propose a reverse-diet ramp: it has no controlled trial behind it, only practitioner convention, and what is replicated is time spent AT maintenance (MATADOR, Byrne 2018), which does not require arriving slowly. Do NOT assume a surplus or a build follows — he has not decided that, and the hold exists so the decision has data behind it. If he asks when to stop cutting, say plainly that no study answers it and his body-fat interval (${dx.bfLo}-${dx.bfHi}%) is wider than the decision. `; })()
    + (() => { const se8 = exerciseSelection(s); if (!se8.items.length || !se8.allGood) return "";
        return `EXERCISE SELECTION (audited against his real gym, confirmed by him directly): every biarticular lift in his programme is already in the lengthened position — standing calf raise with a stretch pause, seated ham curl with hips pinned, reclined leg extension. That is the largest effect in the training literature (standing vs seated calf raise d = 0.88-1.58, against rep tempo at 0.09) and he is on the right side of all of it. Say so if training comes up, and do NOT go hunting for exercise-selection upgrades that are not there. His triceps use a Prime 3-peg rather than an overhead position: he was shown the d = 0.54-0.61 case and chose to keep it. That is settled — the peg changes the resistance profile, not the shoulder angle, so it was never the same variable — and it must not be raised again. `; })()
    + (() => { const vi8 = volumeImbalance(s); if (!vi8) return "";
        return `WEEKLY SET ALLOCATION (by head; deltoids counted separately because they are separately trained): ${vi8.pv.map((m) => mgLabel(m.mg) + " " + m.sets + (m.indirectOnly ? " (indirect only)" : "")).join(", ")}. ${vi8.cutting ? "He is in a DEFICIT, so do NOT recommend adding sets to a muscle sitting below the 6-12 band. That band is a GROWTH dose-response measured in people eating enough to build. Roth 2023 (n=38, six weeks, 30 kcal/kg deficit, 2.8 g/kg protein) compared ~20 weekly sets against ~12 and found lean mass preserved identically with no muscle-thickness difference; Bickel 2011 held young adults' thigh lean mass for 32 weeks on one-ninth of the volume that built it. Retention is cheap and is not volume-sensitive. If he asks about a low muscle, say it is adequate for holding and is the first thing to raise when he starts building." : "He is no longer in a deficit, so the growth band applies again and raising the lowest muscle is worth proposing."} `; })()
    + `HIS MEASURED SET-TO-SET REP SPREAD ${typicalError(s, null).reps} reps (n=${typicalError(s, null).n} paired sets at identical load) — use this when judging whether a rep change is real. A +1 rep session is inside it. `
    + "If you disagree with any of these, say WHY and by how much rather than quietly substituting your own — a number that changes between screens is worse than one that is slightly wrong.";
  const dict = LEDGER_DICT + canon + " SLEEP RIGHT NOW (do not re-derive): last night " + ((gate2.last || {}).h ?? "—") + " h; " + gate2.run + " consecutive night(s) at his " + s.sleep.cleanH + " h target; the session is flagged " + (gate2.clean ? "NORMAL" : "SHORT SLEEP") + ". Short sleep no longer blocks a record or caps a progression step — it only exempts the day from counting toward a stall. EVENTS: " + evs + ". ACTIVE TRIALS: " + trls + ".";
  const clip = (t, n) => (t ? String(t).replace(/^<!--.*-->\n?/, "").slice(0, n) : "");
  const analysisSec = docs.analysis ? `\n\n=== TONIGHT'S ENGINE ANALYSIS (analysis.json — soft trend, rate, TDEE, drivers, regime, prior decisions) ===\n${clip(docs.analysis, 3500)}` : "";
  const suggSec = docs.suggestions ? `\n\n=== YOUR CURRENT APPROVE/DISMISS SUGGESTIONS (the NOW cards) ===\n${clip(docs.suggestions, 1800)}` : "";
  const briefSec = docs.brief ? `\n\n=== YOUR LATEST READ (brief.md — your own nightly words, the voice to match) ===\n${clip(docs.brief, 1800)}` : "";
  const caselawSec = docs.caselaw ? `\n\n=== CASE-LAW / MEMORY (what has held true before) ===\n${clip(docs.caselaw, 1800)}` : "";
  return `You are Joe's Analyst — the same analyst that writes his nightly read. When Joe asks something here, he is asking you: answer in the same voice, from the same knowledge. Your one goal: the best body-composition change — fat down, lean held or built — as fast as he can sustain. Read everything through two lenses only: established sports-science research, and Joe's own data. HOW YOU TALK: plain conversational prose, exactly like your nightly read — the way you'd say it out loud to a sharp friend who lifts. Use no markdown at all — no # headers, no **bold**, no bullet lists or numbered scaffolding, no tables. No jargon, no (measured)/(speculation) tags, no "provisional". Lead with the answer and the one thing that matters, use his real numbers, keep it tight; if the data is thin, just say so in plain words. TWO LAWS: look at everything relevant and how the variables move each other; and weigh science and his own data together — where they agree, say it plainly, where they disagree, name the tension. Never go dark on a noisy number: a single scale reading is noise around a slow trend, so attribute spikes to their cause (water from sodium, carbs, a big meal, a short night) instead of hiding them. THE SCIENCE FLOOR (your prior): lean-safe loss is about 0.5–1.0%/wk (~1.0–1.4 lb/wk for him; 1.9+ is too fast) and deficit MAGNITUDE is the variable most tightly linked to lean-mass loss in trained people; protein ~2.3–3.1 g/kg fat-free mass, fixed daily, not varied by training vs rest day; sleep is a first-order fat-vs-LEAN lever in a deficit (Nedeltcheva 2010: 5.5 h vs 8.5 h shifted 60% more of the loss onto fat-free mass) but only a small SESSION lever (Craven 2022: −2.85% on strength, inside the test-retest CV) — do not tell him a short night ruins a session or invalidates a record, because the app no longer treats it that way and the evidence never did; train to roughly 6–12 hard sets per muscle per week at 0–2 reps in reserve, where the dose-response return per set is highest. Things that DO NOT matter and must never be presented as if they do: rep tempo (meta-analytic SMD 0.09, and it favours going faster, not slower), slow or accentuated eccentrics (hypertrophy SMD −0.06 while perceived effort rises SMD +1.72 — a pure fatigue tax), periodisation model (d = −0.02 for linear vs undulating), machines vs free weights (SMD −0.055, p=0.751 — his machine-heavy programme costs him nothing), planned deloads (zero positive RCTs; the only trained-subject trial found a 3.6 kg squat 1RM decrement and reduced motivation), and lengthened partials (a 297-person multi-site trial found them practically equivalent to full range; trained-subject Bayes factors of 0.16–0.30 are moderate evidence FOR the null, and there are no range-of-motion studies at all in pecs, delts or lats). What DOES matter and is 5–15× larger: exercise selection for biarticular muscles, where the joint you are not training sets the muscle's length — standing vs seated calf raise d = 0.88–1.58, overhead vs pushdown triceps d = 0.54–0.61, seated vs lying ham curl. "Defend load on a cut" is folklore — the only trial that manipulated load under energy restriction (Carlson 2022, n=115 trained, 80% vs 60% 1RM both to failure) found no difference in fat or lean mass, so defend EFFORT and keep the deficit under ~500 kcal/day instead; sodium, carbs and creatine move water, not fat; caffeine helps training but taken late steals sleep; DIET BREAKS (a full week at maintenance) have replicated adherence benefits and no metabolic ones in trained people; weekly REFEED DAYS have neither — the only matched-energy RCT was overturned on reanalysis and no isocaloric carbohydrate study has ever improved strength or hypertrophy, so never claim a refeed buys fat loss, lean retention, metabolism or next-day performance; adherence is the biggest lever; metabolic adaptation is real but small. A single set of reps carries about ±0.8 reps of noise for him, so treat a one-rep change as weather, not signal. Answer only from the knowledge below plus that science. Never invent data, and when the evidence is absent say so — "nobody has tested this" is a better answer than a confident mechanism.\n\n${laws}\n\n${dict}\n\n=== CURRENT INSTRUMENT VERDICTS (the lab) ===\n${dossierText(s)}${analysisSec}${suggSec}${briefSec}${caselawSec}\n\n=== LAST 14 DAYS ===\n${days}\n\n=== LAST 14 NIGHTS ===\n${nights2}\n\n=== MORNING SIGNALS (last 7) ===\n${[...Array(7)].map((_, i8) => { const d8 = isoOf(new Date(Date.now() - (6 - i8) * 864e5)); const en = (s.energy || []).find((x) => x.d === d8); const so = (s.soreness || []).find((x) => x.d === d8); const gp = (s.grip || []).find((x) => x.d === d8); if (!en && !so && !gp) return null; return `${d8}: energy ${en ? en.v : "—"} · sore ${so ? (so.mgs.length ? so.mgs.join("/") : "none") : "—"} · grip ${gp ? `${gp.l ?? "—"}/${gp.r ?? "—"}` : "—"}`; }).filter(Boolean).join("\\n") || "none yet"}\n\n=== MEDS (last 7 logged) ===\n${(s.medsLog || []).slice(-7).map((m8) => `${m8.d}: ${m8.taken ? "taken @ " + m8.at : "none"}`).join("\\n") || "none logged"}\n\n=== CAFFEINE (last 7 logged) ===\n${(s.caffLog || []).slice(-7).map((c8) => `${c8.d}: ${c8.mg === 0 ? "none" : c8.mg + " mg @ " + c8.at}`).join("\\n") || "none logged"}\n\n=== LAST 6 SESSIONS ===\n${sess2}\n\n=== NEXT-SESSION CALLS (deterministic prescription desk) ===\n${(s.exercises || []).filter((e) => e.last || e.std).slice(0, 12).map((e) => { const lc = liftCall(s, e.id); return `${e.n}: ${lc.verdict}${lc.vel != null ? ` (velocity ${lc.vel >= 0 ? "+" : ""}${lc.vel}/session)` : ""} — ${lc.why}`; }).join("\n")}`;
}
const AGENT_TOOLS = [
  { name: "get_range", description: "Fetch raw logs between ISO dates. kind: days|nights|sessions|pulse|temp|reads|feed. Feed = the app event log; amendments there override older raw rows. Day rows carry ⌁[flags] (estimate/event/sealwater/postrefeed) — respect the DATA WEATHER LAW when they appear.", input_schema: { type: "object", properties: { kind: { type: "string" }, from: { type: "string" }, to: { type: "string" } }, required: ["kind", "from", "to"] } },
  { name: "read_instruments", description: "All current lab instrument verdicts, compiled plain.", input_schema: { type: "object", properties: {} } },
  { name: "run_whatif", description: "Forward-model a lever change. Any of: steps, cal, sleep, refeed.", input_schema: { type: "object", properties: { steps: { type: "number" }, cal: { type: "number" }, sleep: { type: "number" }, refeed: { type: "number" } } } },
  { name: "stage_proposal", description: "Stage a proposal for the athlete's one-tap consent. NEVER changes anything itself. kind: trial|note|coach. For trials: either tplId (refeedsize|caffcut|lightsshift|steptarget) OR a custom design.", input_schema: { type: "object", properties: { kind: { type: "string" }, title: { type: "string" }, body: { type: "string" }, tplId: { type: "string" }, custom: { type: "object", properties: { t: { type: "string" }, q: { type: "string" }, arms: { type: "array", items: { type: "string" } }, blockDays: { type: "number" }, cycles: { type: "number" }, metric: { type: "string", enum: ["session_reps", "sleep_h", "trend_delta"] } }, required: ["t", "q", "arms", "blockDays", "cycles", "metric"] } }, required: ["kind", "title", "body"] } },
];
function agentToolExec(s, name, input, staged) {
  try {
    if (name === "get_range") {
      const inR = (d) => d >= input.from && d <= input.to;
      if (input.kind === "days") return Object.entries(s.dailyLogs).filter(([d]) => inR(d)).map(([d, v]) => { const w3 = dayWeather(s, d); return `${d}: cal ${v.cal ?? "—"} pro ${v.pro ?? "—"} steps ${v.steps ?? "—"}${w3.flags.length ? "  ⌁[" + w3.flags.map((f) => f.k).join(",") + "]" : ""}`; }).join("\n") || "no rows";
      if (input.kind === "nights") return s.sleep.nights.filter((n) => inR(n.d)).map((n) => `${n.d}: ${n.h}h · bed ${n.bed || "—"} → wake ${n.wake || "—"} · drift-off ${n.sol ?? "?"}m${(n.tags || []).length ? " · " + n.tags.join("/") : ""}`).join("\n") || "no rows";
      if (input.kind === "sessions") return Object.keys(s.sessionLog).filter(inR).map((d) => { const sl2 = s.sessionLog[d]; const parts = [(sl2.entries || []).map((e) => `${e.id} ${e.w}×${(e.reps || []).join(",")}${e.rir != null ? ` RIR${e.rir}` : ""}`).join(" · ") || "no lifts"]; if ((sl2.skipped || []).length) parts.push("SKIPPED: " + sl2.skipped.map((k) => k.id).join(", ")); if (sl2.dips) parts.push(`dips ${sl2.dips}`); if ((sl2.niggles || []).length) parts.push("niggles: " + sl2.niggles.join(", ")); if (sl2.note) parts.push(`note: "${sl2.note.slice(0, 140)}"`); return `${d}: ` + parts.join(" · "); }).join("\n") || "no rows";
      if (input.kind === "pulse") return (s.pulse || []).filter((x) => inR(x.d)).map((x) => `${x.d}: ${x.bpm}`).join("\n") || "no rows";
      if (input.kind === "temp") return (s.temp || []).filter((x) => inR(x.d)).map((x) => `${x.d}: ${x.f}°F`).join("\n") || "no rows";
      if (input.kind === "reads") return s.reads.filter((r) => inR(r.d)).map((r) => { const w4 = dayWeather(s, r.d); return `${r.d}: ${r.w}${r.sealed ? " (sealed — event water, trend only)" : ""}${w4.flags.length ? "  ⌁[" + w4.flags.map((f) => f.k).join(",") + "]" : ""}`; }).join("\n") || "no rows";
      if (input.kind === "feed") return (s.feed || []).slice(0, 25).map((f) => `${f.d}: ${f.t}${f.how ? " — " + f.how.slice(0, 100) : ""}`).join("\n") || "no rows";
      if (input.kind === "crash") { try { return localStorage.getItem("prep-ledger-crash") || "no crash on file"; } catch (e) { return "no crash on file"; } }
      return "unknown kind";
    }
    if (name === "read_instruments") return dossierText(s);
    if (name === "run_whatif") {
      const cur = currentRate(s);
      const base = cur.measured ? cur.scale : 1.2;
      /* Every reference point here was authored: 16,500 steps, 1,760 kcal and
         3,500 kcal/lb, none of which the engine still uses. The tool the analyst
         reaches for to model a lever was modelling a different athlete. It now
         starts from his measured step average, his measured calorie target and
         the same kcal-per-pound the rest of the engine uses. */
      const stW = stepTarget(s), ctW = calorieTarget(s);
      const stepRef = stW.gated ? null : stW.avg;
      /* Anchor to what he ACTUALLY eats, not to what he is told to eat. Using
         the prescription meant modelling his current intake returned a rate
         0.23 lb/wk off the rate his ledger already measured at that intake. */
      const tdW = observedTDEE(s);
      const calRef = tdW ? tdW.avg : (ctW.gated ? null : ctW.mid);
      const perStepKcal = stW.gated ? 0.35 : stW.kcalPer1k / 1000;
      const dSteps = input.steps != null && stepRef != null ? ((input.steps - stepRef) * perStepKcal * 7) / KCAL_PER_LB_MIX : 0;
      const dCal = input.cal != null && calRef != null ? ((calRef - input.cal) * 7) / KCAL_PER_LB_MIX : 0;
      const rate = +(base + dSteps + dCal).toFixed(2);
      const rb = (s.rate && s.rate.band) || [1.0, 1.4];
      const notes = [];
      if (input.steps != null && stepRef == null) notes.push("step effect not modelled — not enough logged step days to know his baseline");
      if (input.cal != null && calRef == null) notes.push("calorie effect not modelled — maintenance is not measured yet");
      /* The sleep warning used to say the streak never completes and nothing
         becomes official. That gate is retired. What a short night actually
         costs is on the body-composition side, so that is what it warns about. */
      if (input.sleep != null && input.sleep < s.sleep.cleanH) notes.push(`at ${input.sleep} h the session is unaffected, but at a matched deficit short sleep sends about 60% more of the loss onto lean mass — this model shows scale pounds and cannot show what they are made of`);
      if (rate > rb[1]) notes.push(`past his ${rb[1]} lb/wk band top — deficit magnitude is the variable most tightly linked to lean-mass loss`);
      if (input.refeed != null) notes.push("refeeds are retired — a higher day against a fixed weekly total is just a deeper day somewhere else");
      return `modeled rate: ${rate} lb/wk (base ${base}${notes.length ? " · " + notes.join(" · ") : ""})`;
    }
    if (name === "stage_proposal") {
      let custom = null;
      if (input.custom) {
        const c = input.custom;
        if (!Array.isArray(c.arms) || c.arms.length !== 2) return "rejected: custom trials need exactly 2 arms";
        if (!["session_reps", "sleep_h", "trend_delta"].includes(c.metric)) return "rejected: metric must be one the engines can measure";
        custom = { t: String(c.t).slice(0, 60), q: String(c.q).slice(0, 140), arms: [String(c.arms[0]).slice(0, 40), String(c.arms[1]).slice(0, 40)], blockDays: Math.min(7, Math.max(3, Math.round(c.blockDays))), cycles: Math.min(6, Math.max(3, Math.round(c.cycles))), metric: c.metric };
      }
      staged.push({ id: "ap" + Date.now() + Math.floor(Math.random() * 999), kind: input.kind, title: input.title, body: input.body, tplId: input.tplId || null, custom, at: isoOf(todayStart()) });
      return "staged for the athlete's consent — do not assume it will be accepted";
    }
  } catch (e) { return "tool error: " + e.message; }
  return "unknown tool";
}
async function agentLoop(s, question, history, onStatus, docs) {
  const key = localStorage.getItem(ANTH_KEY);
  if (!key) return { ok: false, msg: "no API key saved — RULES → ASK THE LEDGER" };
  const staged = [];
  const msgs = [...history, { role: "user", content: question }];
  const sys = askContext(s, docs) + "\n\nYou also have TOOLS. Investigate before answering: pull the exact ranges you need, contrast periods, use run_whatif for counterfactuals. If you find something actionable, stage_proposal it (kind trial|note|coach) — you can change NOTHING directly; every proposal waits for the athlete's tap. You may DESIGN custom trials when no canned template fits: 2 arms, 3-7 day blocks, 3-6 cycles, metric strictly from [session_reps, sleep_h, trend_delta]. In the body, state the pattern that motivated it (with n), the expected effect size, and roughly why the block count could detect it through his noise — if it can't, say the honest thing: more blocks or don't run it. Then answer in plain conversational prose — no markdown, no headers, no bullet scaffolding, no badges — exactly the way your nightly read sounds.";
  try {
    for (let turn = 0; turn < 6; turn++) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 1500, system: sys, tools: AGENT_TOOLS, messages: msgs }),
      });
      if (!r.ok) return { ok: false, msg: r.status === 401 ? "key rejected — check RULES" : "HTTP " + r.status, staged };
      const j = await r.json();
      msgs.push({ role: "assistant", content: j.content });
      const uses = (j.content || []).filter((c) => c.type === "tool_use");
      if (!uses.length || j.stop_reason !== "tool_use") {
        return { ok: true, text: (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join(""), staged };
      }
      onStatus && onStatus("investigating: " + uses.map((u) => u.name).join(", "));
      msgs.push({ role: "user", content: uses.map((u) => ({ type: "tool_result", tool_use_id: u.id, content: String(agentToolExec(s, u.name, u.input || {}, staged)).slice(0, 6000) })) });
    }
    return { ok: true, text: "(investigation ran long — ask a narrower question)", staged };
  } catch (e) { return { ok: false, msg: "network — the API needs a signal", staged }; }
}

async function askLedger(s, question, history) {
  const key = localStorage.getItem(ANTH_KEY);
  if (!key) return { ok: false, msg: "no API key saved — RULES → ASK THE LEDGER" };
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 1024, system: askContext(s), messages: [...history, { role: "user", content: question }] }),
    });
    if (!r.ok) return { ok: false, msg: r.status === 401 ? "key rejected — check it in RULES" : "HTTP " + r.status };
    const j = await r.json();
    return { ok: true, text: (j.content || []).map((c) => c.text || "").join("") };
  } catch (e) { return { ok: false, msg: "network — the API needs a signal" }; }
}
const ASKHIST_KEY = "prep-ledger-askhist";
function stripMd(t) {
  if (typeof t !== "string") return t;
  return t.replace(/^\s{0,3}#{1,6}\s+/gm, "").replace(/\*\*/g, "").replace(/__/g, "").replace(/`+/g, "").replace(/^\s{0,3}[-*+]\s+/gm, "• ").replace(/^\s{0,3}>\s?/gm, "");
}
function AskLedger({ s, setS, save, onClose }) {
  const askBrief = useRepoDoc("ledger/brief.md");
  const askAnalysis = useRepoDoc("ledger/analysis.json");
  const askSuggestions = useRepoDoc("ledger/suggestions.json");
  const askCaselaw = useRepoDoc("ledger/caselaw.md");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState(() => { try { return JSON.parse(localStorage.getItem(ASKHIST_KEY) || "[]"); } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem(ASKHIST_KEY, JSON.stringify(log.slice(-12))); } catch (e) {} }, [log]);
  const [status, setStatus] = useState(null);
  const ask = async () => {
    const question = q.trim();
    if (!question || busy) return;
    setBusy(true); setQ(""); setStatus(null);
    const history = log.flatMap((x) => [{ role: "user", content: x.q }, { role: "assistant", content: typeof x.a === "string" ? x.a : "" }]).slice(-8);
    const r = await agentLoop(s, question, history, setStatus, { brief: askBrief, analysis: askAnalysis, suggestions: askSuggestions, caselaw: askCaselaw });
    if (r.staged && r.staged.length && setS && save) {
      const ns = JSON.parse(JSON.stringify(s));
      ns.agentProposals = [...(ns.agentProposals || []), ...r.staged];
      setS(ns); save(ns);
    }
    setLog([...log, { q: question, a: (r.ok ? r.text : "⚠ " + r.msg) + (r.staged && r.staged.length ? `\n\n📥 staged ${r.staged.length} proposal${r.staged.length > 1 ? "s" : ""} — waiting on NOW for your tap` : "") }]);
    setBusy(false); setStatus(null);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: T.ink, zIndex: 70, display: "flex", flexDirection: "column", padding: "0 16px", paddingTop: "calc(env(safe-area-inset-top, 24px) + 14px)", paddingBottom: "calc(env(safe-area-inset-bottom, 10px) + 10px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow c={T.jade}>ASK THE ANALYST — SAME BRAIN AS YOUR READ</Eyebrow>
        <span onClick={onClose} style={{ fontFamily: mono, fontSize: 10, color: T.dim, cursor: "pointer" }}>close ✕</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", marginTop: 10 }}>
        {!log.length && <div style={{ fontFamily: body, fontSize: 12, color: T.dim, lineHeight: 1.6 }}>Try: "why did week 4 stall?" · "what's my one thing this week?" · "is my refeed earning its calories?" — it's the same analyst that writes your read, answering in plain words from your data and the science.</div>}
        {log.map((x, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: T.jade }}>▸ {x.q}</div>
            <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 5, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{stripMd(x.a)}</div>
          </div>
        ))}
        {busy && <div style={{ fontFamily: mono, fontSize: 10, color: T.dim }}>{status || "assembling the instrument…"}</div>}
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: `1px solid ${T.line}` }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="ask anything about your data…"
          style={{ flex: 1, fontFamily: body, fontSize: 13, padding: "11px 12px", borderRadius: 9, border: `1px solid ${T.line}`, background: T.plate2, color: T.chalk, outline: "none" }} />
        <Btn small tone="jade" onClick={ask}>{busy ? "…" : "Ask"}</Btn>
      </div>
    </div>
  );
}

/* dated snapshots — a weekly vault beside the live state */
async function snapshotMaybe(state, tok) {
  const last = +(localStorage.getItem("prep-ledger-lastsnap") || 0);
  if (Date.now() - last < 6 * 86400 * 1000) return;
  localStorage.setItem("prep-ledger-lastsnap", String(Date.now()));
  const d = isoOf(todayStart());
  const url2 = `https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/snapshots/state-${d}.json`;
  const hdr2 = { Authorization: "Bearer " + tok, Accept: "application/vnd.github+json", "Content-Type": "application/json" };
  try { await fetch(url2, { method: "PUT", headers: hdr2, body: JSON.stringify({ message: `weekly snapshot ${d} [skip ci]`, content: btoa(unescape(encodeURIComponent(JSON.stringify(state)))) }) }); } catch (e) {}
}
async function listSnapshots() {
  const tok = localStorage.getItem(TOKEN_KEY);
  if (!tok) return { ok: false, msg: "no token saved" };
  try {
    const r = await fetch("https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/snapshots", { headers: { Authorization: "Bearer " + tok } });
    if (!r.ok) return { ok: false, msg: r.status === 404 ? "no snapshots yet — the first files this Sunday" : "HTTP " + r.status };
    const arr = await r.json();
    return { ok: true, items: arr.filter((x) => x.name.endsWith(".json")).map((x) => ({ name: x.name, path: x.path })).reverse() };
  } catch (e) { return { ok: false, msg: "network" }; }
}
async function fetchStateFile(path) {
  const tok = localStorage.getItem(TOKEN_KEY);
  const r = await fetch(`https://api.github.com/repos/joeymat11-rgb/prepledger/contents/${path}`, { headers: { Authorization: "Bearer " + tok, Accept: "application/vnd.github.raw" } });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return JSON.parse(await r.text());
}

function ApiKeyBlock() {
  const [v, setV] = useState(() => { try { return localStorage.getItem(ANTH_KEY) || ""; } catch (e) { return ""; } });
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.line}` }}>
      <Eyebrow c={T.jade}>ASK THE LEDGER · API KEY (SEPARATE FROM THE GITHUB TOKEN)</Eyebrow>
      <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel, marginTop: 5, lineHeight: 1.5 }}>Two locks, two keys: the GitHub token files your data; this Anthropic key answers questions about it. Both live only on this phone — neither syncs, neither replaces the other. Get one at console.anthropic.com → API Keys.</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input value={v} onChange={(e) => { setV(e.target.value); setSaved(false); }} placeholder="sk-ant-…" style={{ flex: 1, fontFamily: mono, fontSize: 10.5, padding: "9px 10px", borderRadius: 8, border: `1px solid ${T.line}`, background: T.plate2, color: T.chalk, outline: "none" }} />
        <Btn small tone="jade" onClick={() => { try { v.trim() ? localStorage.setItem(ANTH_KEY, v.trim()) : localStorage.removeItem(ANTH_KEY); setSaved(true); } catch (e) {} }}>{saved ? "Saved ✓" : "Save"}</Btn>
      </div>
    </div>
  );
}

const CONSTITUTION = [
  ["Attention lives on NOW", "If something deserves your eyes, it comes to the front page when it does — never buried in a tab."],
  ["Simple surface, real depth", "Every card reads in one glance; every card opens into its receipts. Plain words are enforced by tests."],
  ["Many sources, one door", "Every change the machine wants — sets, weights, trials — arrives as an inbox proposal. Your tap decides."],
  ["Facts are live, prose is dawn", "Numbers come from engines reading this second; the analyst's essay is a morning newspaper and says so."],
  ["Done-ness is derived", "The ledger decides what's complete — never a screen's memory. In-progress work is a draft that survives."],
  ["Smallest honest increment", "Weight moves by the machine's real smallest step; new sets and loads expect to keep almost every rep."],
  ["One terminal failure set", "Each exercise ends in exactly one all-out set, and the RIR you give that set is what sizes the next session's jump. It is the single most valuable number you enter."],
  ["The tilt", "Volume is presumed useful until your own bar speed says otherwise. Adds come easier than trims."],
  ["Records need repeating, not good sleep", "A new best waits for one confirmation — because your own measured set-to-set spread is small, so a +1 record cannot be told apart from a good day. A jump clearly outside that spread banks immediately. This used to depend on a three-night sleep streak; that condition had no evidence behind it and, at 7.5 h against your 7 h median, it never once opened."],
  ["Short sleep protects, it does not punish", "A short night is logged and it counts — for reps, for records, for every trend. What the flag buys you is that the day cannot be read as a stall, so you are never deloaded for a bad night. Sleep still matters most where it is actually measured: in a deficit, short sleep shifts what you lose toward lean mass."],
  ["Every target is derived, none authored", "Calories come from your measured maintenance, protein from your measured lean mass, steps from the window that measured that maintenance. A number the app cannot derive from your record is a number it should not be showing you as if it could."],
  ["Cite or say you cannot", "Every rule here names the evidence it rests on, and says plainly when there is none. Three of this app's rules were retired for having nothing behind them; that is the mechanism working, not failing."],
  ["The athlete overrides", "Every number is yours to change on the floor. The machine rebases instantly and files your ruling as precedent."],
  ["The morning lives in the Minute", "Any input that belongs to the morning joins the Morning Minute — one guided flow, about sixty seconds, before the day starts pulling. New morning inputs must register a step; the test suite enforces it."],
  ["No decorative fields", "Every field must buy attribution — a clock, a tap, a number that changes what the machine can conclude. Friction that buys nothing is deleted, because friction is what kills tracking systems by week nine."],
];
function MinuteView({ s, setS, save, onClose }) {
  const t9 = isoOf(todayStart());
  const y9 = isoOf(new Date(todayStart().getTime() - DAY));
  const briefRaw = useRepoDoc("ledger/brief.md");
  const brief9 = briefRaw ? briefRaw.replace(/^<!--.*-->\n?/, "") : null;
  const qm9 = brief9 ? brief9.match(/^QUESTION:\s*(.+)$/m) : null;
  const qOpen = qm9 && !briefAnswered(s, qm9[1]);
  const [steps] = useState(() => [...minuteNeeds(s), "brief"]);
  const [idx9, setIdx9] = useState(0);
  /* His own clock, same source as the NOW logger — never an authored time,
     because whatever sits here gets WRITTEN to the sleep record on tap. */
  const anM = sleepAnchor(s);
  const [bed9, setBed9] = useState(anM.bed || (s.sleep.anchor || {}).bed || "23:30");
  const [wake9, setWake9] = useState(anM.wake || (s.sleep.anchor || {}).wake || "07:30");
  const [sol9, setSol9] = useState(anM.measured && anM.sol != null ? anM.sol : 15);
  const [tags9, setTags9] = useState([]);
  const [bpm9, setBpm9] = useState(() => { const pr = (s.pulse || []); return pr.length ? pr[pr.length - 1].bpm : 55; });
  const [tf9, setTf9] = useState(() => { const tr = (s.temp || []); return tr.length ? tr[tr.length - 1].f : 97.6; });
  const [wt9, setWt9] = useState(() => +(s.trend || 164.5));
  const [ans9, setAns9] = useState("");
  const [sore9, setSore9] = useState([]);
  const [gl9, setGl9] = useState(() => { const g = (s.grip || []); return g.length ? String(g[g.length - 1].l || "") : ""; });
  const [gr9, setGr9] = useState(() => { const g = (s.grip || []); return g.length ? String(g[g.length - 1].r || "") : ""; });
  const cur = steps[idx9];
  const advance = () => { if (idx9 + 1 < steps.length) setIdx9(idx9 + 1); else onClose(); };
  const w9 = (fn) => { const ns = JSON.parse(JSON.stringify(s)); fn(ns); setS(ns); save(ns); advance(); };
  const spanH = (() => { const [bh, bm] = bed9.split(":").map(Number); const [wh, wm] = wake9.split(":").map(Number); const mins = ((wh * 60 + wm) - (bh * 60 + bm) + 1440) % 1440; return Math.round(((mins - sol9) / 60) * 4) / 4; })();
  if (!steps.length) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: T.ink, zIndex: 70, overflowY: "auto", padding: "0 16px", paddingTop: "calc(env(safe-area-inset-top, 24px) + 14px)", paddingBottom: "calc(env(safe-area-inset-bottom, 10px) + 20px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow c={T.jade}>☀ THE MORNING MINUTE · {Math.min(idx9 + 1, steps.length)} / {steps.length}</Eyebrow>
        <span onClick={onClose} style={{ fontFamily: mono, fontSize: 10, color: T.dim, cursor: "pointer", padding: "8px" }}>close ✕</span>
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 8 }}>{steps.map((st, i) => <div key={st} style={{ flex: 1, height: 3, borderRadius: 2, background: i < idx9 ? T.jade : i === idx9 ? T.chalk : T.line }} />)}</div>
      {idx9 >= steps.length && (
        <div style={{ maxWidth: 480, margin: "60px auto 0", textAlign: "center" }}>
          <div style={{ fontSize: 44, color: T.jade }}>✓</div>
          <div style={{ fontFamily: body, fontSize: 15, color: T.chalk, marginTop: 10 }}>Morning banked — the day's yours.</div>
          <Btn tone="jade" full style={{ marginTop: 18 }} onClick={onClose}>Close</Btn>
        </div>
      )}
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%" }}>
      {cur && <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.12em", color: T.dim, marginTop: 14 }}>{["pulse", "energy", "soreness", "night"].includes(cur) ? "STILL IN BED" : ["temp", "weight", "grip"].includes(cur) ? "ON YOUR FEET" : "WITH COFFEE"}</div>}
      {cur === "night" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>Last night</div>
          <Cond how="Bed and wake are clock times. Drift-off is your best guess at the minutes it took to fall asleep." when="Any time you remember the night. Within fifteen minutes is close enough — consistency beats precision here." />
          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center", flexWrap: "wrap", fontFamily: mono, fontSize: 11, color: T.steel }}>
            <span>bed</span><input type="time" value={bed9} onChange={(e) => setBed9(e.target.value)} style={{ background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 13, padding: "6px" }} />
            <span>wake</span><input type="time" value={wake9} onChange={(e) => setWake9(e.target.value)} style={{ background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 13, padding: "6px" }} />
            <span>drift-off</span><Stepper v={sol9} set={setSol9} step={5} min={0} /><span>m</span>
            <span style={{ color: T.jade }}>= {spanH} h asleep</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {["woke", "screens", "mela"].map((tg) => <span key={tg} onClick={() => setTags9(tags9.includes(tg) ? tags9.filter((x) => x !== tg) : [...tags9, tg])} style={{ fontFamily: mono, fontSize: 10, color: tags9.includes(tg) ? T.brass : T.dim, border: `1px solid ${tags9.includes(tg) ? T.brass : T.line}`, borderRadius: 999, padding: "5px 10px" }}>{tg === "woke" ? "woke mid-night" : tg === "mela" ? "melatonin" : "screens"}</span>)}
          </div>
          <Btn full tone="jade" style={{ marginTop: 14 }} onClick={() => w9((ns) => { ns.sleep.nights = ns.sleep.nights.filter((n) => n.d !== y9); ns.sleep.nights.push({ d: y9, h: spanH, bed: bed9, wake: wake9, sol: sol9, tags: tags9 }); })}>Bank the night →</Btn>
        </div>
      )}
      {cur === "weight" && (
        <div style={{ marginTop: 18 }}>
          {blackoutOn(s, t9) && <div style={{ fontFamily: mono, fontSize: 9.5, color: T.brass, marginBottom: 8 }}>scale sealed through the blackout — this read files quarantined and never touches the trend</div>}
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>Scale, fasted</div>
          <Cond how="Same scale, minimal clothing, same spot on the floor." when="After the bathroom, before food or water. Same order every morning or the number drifts for reasons that are not you." />
          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}><Stepper v={wt9} set={setWt9} step={0.1} min={100} /><span style={{ fontFamily: mono, fontSize: 11, color: T.dim }}>lb</span></div>
          <Btn full tone="jade" style={{ marginTop: 14 }} onClick={() => w9((ns) => { ns.reads = ns.reads.filter((r) => r.d !== t9); const r2 = applyRead(ns, t9, +wt9); Object.assign(ns, r2); })}>{blackoutOn(s, t9) ? "Log weight (quarantined) →" : "Log weight →"}</Btn>
        </div>
      )}
      {cur === "energy" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>Morning energy</div>
          <Cond how="One tap. 1 is running on fumes, 3 is normal, 5 is caged animal." when="Any time this morning. No conditions at all — this one just needs an honest answer." />
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 3 }}>One tap — how much do you have today?</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {[1, 2, 3, 4, 5].map((v9) => (
              <span key={v9} onClick={() => w9((ns) => { ns.energy = [...(ns.energy || []).filter((x) => x.d !== t9), { d: t9, v: v9 }]; })}
                style={{ flex: 1, textAlign: "center", fontFamily: mono, fontSize: 16, color: T.chalk, border: `1px solid ${T.line}`, borderRadius: 8, padding: "14px 0", cursor: "pointer" }}>{v9}</span>
            ))}
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 8 }}>1 = running on fumes · 3 = normal · 5 = caged animal</div>
        </div>
      )}
      {cur === "soreness" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>Soreness</div>
          <div style={{ fontFamily: body, fontSize: 13, color: T.chalk }}>Anything sore? Tap all that apply.</div>
          <Cond how="Tap any muscle sore to the touch or on the first movement. Nothing sore is an answer — log it empty." when="Any time today. You are reporting on what yesterday's training left behind." />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {MUSCLE_CHIPS.map((m9) => (
              <span key={m9} onClick={() => setSore9(sore9.includes(m9) ? sore9.filter((x) => x !== m9) : [...sore9, m9])}
                style={{ fontFamily: mono, fontSize: 10.5, color: sore9.includes(m9) ? T.brass : T.dim, border: `1px solid ${sore9.includes(m9) ? T.brass : T.line}`, borderRadius: 999, padding: "7px 12px", cursor: "pointer" }}>{m9}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Btn full tone="jade" onClick={() => w9((ns) => { ns.soreness = [...(ns.soreness || []).filter((x) => x.d !== t9), { d: t9, mgs: sore9.slice() }]; })}>{sore9.length ? "Log soreness →" : "Nothing sore ✓ →"}</Btn>
          </div>
        </div>
      )}
      {cur === "grip" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>Grip</div>
          <div style={{ fontFamily: body, fontSize: 13, color: T.chalk }}>Grip — best of 2–3 squeezes each hand, same posture as always.</div>
          <Cond how="Standing, arm at your side, elbow about 90 degrees. Two or three squeezes per hand — log the best of each." when="Same handle setting forever, same point in the morning. The number only means something against your own past numbers." />
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>LEFT (lb)</div><input inputMode="decimal" value={gl9} onChange={(e9) => setGl9(e9.target.value)} style={{ width: "100%", boxSizing: "border-box", background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 16, padding: "10px", outline: "none", marginTop: 4 }} /></div>
            <div style={{ flex: 1 }}><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>RIGHT (lb)</div><input inputMode="decimal" value={gr9} onChange={(e9) => setGr9(e9.target.value)} style={{ width: "100%", boxSizing: "border-box", background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 16, padding: "10px", outline: "none", marginTop: 4 }} /></div>
          </div>
          <Btn full tone="jade" style={{ marginTop: 14 }} onClick={() => w9((ns) => { ns.grip = [...(ns.grip || []).filter((x) => x.d !== t9), { d: t9, l: +gl9 || null, r: +gr9 || null }]; })}>Log grip →</Btn>
        </div>
      )}
      {cur === "pulse" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>Morning pulse</div>
          <Cond how="Count beats for 60 seconds, or 30 and double it." when="Within a few minutes of waking, still lying down, before coffee, food, or getting up. Already up and moving? Skip it — a contaminated number is worse than none." />
          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}><Stepper v={bpm9} set={setBpm9} step={1} min={30} /><span style={{ fontFamily: mono, fontSize: 11, color: T.dim }}>bpm</span></div>
          <Btn full tone="jade" style={{ marginTop: 14 }} onClick={() => w9((ns) => { ns.pulse = [...(ns.pulse || []).filter((x) => x.d !== t9), { d: t9, bpm: bpm9 }]; })}>Log pulse →</Btn>
        </div>
      )}
      {cur === "temp" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>Temperature</div>
          <Cond how="Same thermometer, same site, every single time." when="Right after waking, before food, drink, or a shower. Anything warm in your mouth invalidates it." />
          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}><Stepper v={tf9} set={setTf9} step={0.1} min={90} /><span style={{ fontFamily: mono, fontSize: 11, color: T.dim }}>°F</span></div>
          <Btn full tone="jade" style={{ marginTop: 14 }} onClick={() => w9((ns) => { ns.temp = [...(ns.temp || []).filter((x) => x.d !== t9), { d: t9, f: +tf9 }]; })}>Log temp →</Btn>
        </div>
      )}
      {cur === "brief" && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 20, color: T.chalk }}>The overnight brief</div>
          <Cond how="Read it. If it asks a question, answer — your reply goes straight to tonight's analyst." when="Any time. It was written at 4 AM from the last sync, so the live lines on NOW outrank it." />
          {brief9 ? <div style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: 8, lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: "44vh", overflowY: "auto", border: `1px solid ${T.line}`, borderRadius: 8, padding: "10px 12px" }}>{plainify(brief9).slice(0, 2200)}</div> : <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, marginTop: 8 }}>no brief on file yet this morning</div>}
          {qOpen && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontFamily: mono, fontSize: 9.5, color: T.brass }}>THE ANALYST ASKS — 10 SECONDS, BECOMES LABELED DATA</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input value={ans9} onChange={(e) => setAns9(e.target.value)} placeholder="your answer…" style={{ flex: 1, background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 8, color: T.chalk, fontFamily: body, fontSize: 12, padding: "9px 10px", outline: "none" }} />
                <Btn small tone="jade" onClick={() => { if (!ans9.trim()) return; const ns = JSON.parse(JSON.stringify(s)); ns.feed.unshift({ d: t9, t: "ANALYST ANSWER", how: qm9[1].slice(0, 120) + " → " + ans9.trim() }); setS(ns); save(ns); setAns9(""); }}>File it</Btn>
              </div>
            </div>
          )}
          <Btn full tone="jade" style={{ marginTop: 14 }} onClick={advance}>Done ☀</Btn>
        </div>
      )}
      <div onClick={advance} style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, textAlign: "center", marginTop: 16, cursor: "pointer" }}>conditions not right? skip — its card stays open on NOW, and a skip is never a miss</div>
      </div>
    </div>
  );
}
function LawsView({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: T.ink, zIndex: 70, overflowY: "auto", padding: "0 16px", paddingTop: "calc(env(safe-area-inset-top, 24px) + 14px)", paddingBottom: "calc(env(safe-area-inset-bottom, 10px) + 20px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow c={T.jade}>⚖ THE HOUSE LAWS</Eyebrow>
        <span onClick={onClose} style={{ fontFamily: mono, fontSize: 10, color: T.dim, cursor: "pointer", padding: "8px" }}>close ✕</span>
      </div>
      <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel, marginTop: 4 }}>The rules this app runs on. Every feature answers to them; four were written by the athlete.</div>
      {CONSTITUTION.map((c9, i9) => (
        <div key={i9} style={{ marginTop: 14, paddingBottom: 12, borderBottom: i9 < CONSTITUTION.length - 1 ? `1px solid ${T.line}` : "none" }}>
          <div style={{ fontFamily: mono, fontSize: 11, color: T.jade, letterSpacing: "0.06em", textTransform: "uppercase" }}>{i9 + 1}. {c9[0]}</div>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 4, lineHeight: 1.6 }}>{c9[1]}</div>
        </div>
      ))}
    </div>
  );
}
function filingsFor(dow, dom) {
  const out9 = [];
  if (dow === 1) out9.push("COACH DAY — the dossier and your night shift's draft are ready behind the COACH button");
  if (dom >= 1 && dom <= 3) out9.push("THE RED CELL files this week — the case against your prep waits in LAB");
  return out9;
}
/* ---------- MINUTE_NOTE — four taps removed, and he had already removed them ----------
   Pulse, temperature and grip are out of the guided flow. Each failed the same
   way: the app's threshold sat inside the measurement's own noise. A 5-second
   manual pulse count quantises at 6-12 bpm against a 5 bpm rule; oral morning
   temperature has a within-person SD of 0.58 F against a 0.4 F rule, so it fired
   on roughly a quarter of all mornings; handgrip's minimal detectable change is
   ~11% against an 8% rule. Two of the three additionally had no validated link to
   what they claimed to detect, and the pulse rule was watching for a RISE in a
   variable that energy deficiency pushes down.

   His own record said the same thing first: grip logged zero times, pulse twice,
   temperature three times, then abandoned. Law 12 says a field that buys no
   attribution is deleted, because friction is what kills tracking systems by week
   nine. This is week nine arriving early.

   The data is kept and the inputs remain loggable — nothing is destroyed. They
   simply stop costing him a tap every morning to produce a number no rule may
   act on. */
const MORNING_REGISTRY = ["energy", "soreness", "night", "weight", "brief"];
const MORNING_PARKED = ["pulse", "temp", "grip"];
const MUSCLE_CHIPS = ["quads", "hams", "calves", "chest", "back", "delts", "biceps", "triceps", "forearms", "abs"];
function minuteNeeds(s) {
  const t9 = isoOf(todayStart());
  const y9 = isoOf(new Date(todayStart().getTime() - DAY));
  const out9 = [];
  if (!(s.energy || []).some((x) => x.d === t9)) out9.push("energy");
  if (!(s.soreness || []).some((x) => x.d === t9)) out9.push("soreness");
  if (!s.sleep.nights.some((n) => n.d === y9)) out9.push("night");
  if (!s.reads.some((r) => r.d === t9)) out9.push("weight");
  return out9;
}
function booksToday(s) {
  const t9 = isoOf(todayStart());
  const y9 = isoOf(new Date(todayStart().getTime() - DAY));
  const items = [];
  const dl9 = s.dailyLogs[t9];
  items.push({ k: "numbers", ok: !!(dl9 && dl9.cal != null) });
  items.push({ k: "night", ok: s.sleep.nights.some((n) => n.d === y9) });
  const ty9 = dayType(t9, s);
  if (ty9 === "U" || ty9 === "L") items.push({ k: "session", ok: !!s.sessionLog[t9] });
  if ((s.pulse || []).some((x) => x.d < t9)) items.push({ k: "pulse", ok: (s.pulse || []).some((x) => x.d === t9) });
  if ((s.temp || []).some((x) => x.d < t9)) items.push({ k: "temp", ok: (s.temp || []).some((x) => x.d === t9) });
  if ((s.energy || []).some((x) => x.d < t9)) items.push({ k: "energy", ok: (s.energy || []).some((x) => x.d === t9) });
  if ((s.grip || []).some((x) => x.d < t9)) items.push({ k: "grip", ok: (s.grip || []).some((x) => x.d === t9) });
  if (!blackoutOn(s, t9)) items.push({ k: "scale", ok: s.reads.some((r) => r.d === t9) });
  return { items, complete: items.every((i) => i.ok) };
}
function liveBooks(s) {
  const y = isoOf(new Date(todayStart().getTime() - DAY));
  const est = !!(((s.dayCtx || {})[y] || {}).est);
  const items = [];
  const dl = s.dailyLogs[y];
  items.push({ k: "numbers", ok: !!(dl && dl.cal != null) });
  items.push({ k: "night", ok: s.sleep.nights.some((n) => n.d === y) });
  const t2 = dayType(y, s);
  if (t2 === "U" || t2 === "L") items.push({ k: "session", ok: !!s.sessionLog[y] });
  if ((s.pulse || []).some((x) => x.d < y)) items.push({ k: "pulse", ok: (s.pulse || []).some((x) => x.d === y) });
  if ((s.temp || []).some((x) => x.d < y)) items.push({ k: "temp", ok: (s.temp || []).some((x) => x.d === y) });
  if ((s.energy || []).some((x) => x.d < y)) items.push({ k: "energy", ok: (s.energy || []).some((x) => x.d === y) });
  if ((s.grip || []).some((x) => x.d < y)) items.push({ k: "grip", ok: (s.grip || []).some((x) => x.d === y) });
  if (!blackoutOn(s, y)) items.push({ k: "scale", ok: s.reads.some((r) => r.d === y) });
  const gaps = items.filter((i) => !i.ok);
  return { y, est, items, gaps, complete: gaps.length === 0 };
}

function useRepoDoc(path) {
  const [txt, setTxt] = useState(null);
  useEffect(() => {
    let dead = false;
    const go = async () => {
      try {
        const tok = localStorage.getItem(TOKEN_KEY);
        if (!tok) return;
        const r = await fetch("https://api.github.com/repos/joeymat11-rgb/prepledger/contents/" + path + "?t=" + Date.now(), { headers: { Authorization: "Bearer " + tok, Accept: "application/vnd.github.raw" }, cache: "no-store" });
        if (!r.ok) return;
        const t2 = await r.text();
        if (!dead) setTxt(t2);
      } catch (e) {}
    };
    let last = 0;
    const goT = () => { const n2 = Date.now(); if (n2 - last < 45e3) return; last = n2; go(); };
    goT();
    const onVis = () => { if (document.visibilityState === "visible") goT(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onVis);
    window.addEventListener("pageshow", onVis);
    const iv = setInterval(() => { if (document.visibilityState === "visible") goT(); }, 15 * 60 * 1000);
    return () => { dead = true; document.removeEventListener("visibilitychange", onVis); window.removeEventListener("focus", onVis); window.removeEventListener("pageshow", onVis); clearInterval(iv); };
  }, [path]);
  return txt;
}

function briefAnswered(s, q) { return (s.feed || []).some((f) => f.t === "ANALYST ANSWER" && (f.how || "").indexOf(q.slice(0, 120) + " →") === 0); }
function BriefCard({ s, setS: setS2, save: save2 }) {
  const raw = useRepoDoc("ledger/brief.md");
  const [openB, setOpenB] = useState(() => new Date().getHours() < 12);
  const [ans, setAns] = useState("");
  const [answered, setAnswered] = useState(false);
  const brief = (() => {
    if (!raw) return null;
    const m = raw.match(/^<!-- (\d{4}-\d{2}-\d{2}) -->/);
    if (m && (isoOf(todayStart()) === m[1] || isoOf(new Date(todayStart().getTime() - DAY)) === m[1])) return raw.replace(/^<!--.*-->\n?/, "");
    return null;
  })();
  if (!brief) { const lb0 = liveBooks(s); return (
    <Card style={{ padding: "10px 14px" }}>
      <div style={{ fontFamily: mono, fontSize: 10, color: lb0.complete ? T.jade : T.brass, lineHeight: 1.6 }}>
        BOOKS · {fmtShort(lb0.y)} (live) — {lb0.complete ? "complete ✓" : lb0.items.map((i) => `${i.k} ${i.ok ? "✓" : "✗"}`).join(" · ") + " — the ✗s take 30 seconds"}
      </div>
      <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 3 }}>no analyst read on file yet — the live line above is the ledger's own reading</div>
    </Card>
  ); }
  const qm = brief.match(/^QUESTION:\s*(.+)$/m);
  const already = qm ? briefAnswered(s, qm[1]) : false;
  return (
    <Card accent={T.jade}>
      <div onClick={() => setOpenB(!openB)} style={{ cursor: "pointer" }}>
        <Eyebrow c={T.jade}>THE ANALYST'S READ {openB ? "▾" : "▸"}</Eyebrow>
        <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 3 }}>your nightly read, in plain English — the live line below always outranks it</div>
      </div>
      {(() => { const lb = liveBooks(s); return (
        <div style={{ fontFamily: mono, fontSize: 10, color: lb.complete ? T.jade : T.brass, marginTop: 7, lineHeight: 1.6 }}>
          BOOKS · {fmtShort(lb.y)} (live) — {lb.complete ? "complete ✓ — whatever the brief says above, the ledger has it all" : lb.items.map((i) => `${i.k} ${i.ok ? "✓" : "✗"}`).join(" · ") + " — the ✗s take 30 seconds"}
        </div>
      ); })()}
      {openB && <div style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: 6, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{plainify(brief).slice(0, 2200)}</div>}
      {qm && !already && !answered && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 9 }}>
          <div style={{ fontFamily: mono, fontSize: 9.5, color: T.brass, letterSpacing: "0.06em" }}>THE ANALYST ASKS — 10 SECONDS, BECOMES LABELED DATA</div>
          <div style={{ display: "flex", gap: 8, marginTop: 7 }}>
            <input value={ans} onChange={(e) => setAns(e.target.value)} placeholder="your answer…" style={{ flex: 1, fontFamily: body, fontSize: 12, padding: "9px 10px", borderRadius: 8, border: `1px solid ${T.line}`, background: T.plate2, color: T.chalk, outline: "none" }} />
            <Btn small tone="jade" onClick={() => { if (!ans.trim()) return; const ns = JSON.parse(JSON.stringify(s)); ns.feed.unshift({ d: isoOf(todayStart()), t: "ANALYST ANSWER", how: qm[1].slice(0, 120) + " → " + ans.trim().slice(0, 200) }); setS2 && setS2(ns); save2 && save2(ns); setAnswered(true); }}>File it</Btn>
          </div>
        </div>
      )}
      {(answered || (qm && already)) && <div style={{ fontFamily: mono, fontSize: 10, color: T.jade, marginTop: 8 }}>✓ filed — the night shift reads it on its next run</div>}
    </Card>
  );
}

function RndDesk({ s, setS: sS, save: sv }) {
  const [draft, setDraft] = useState(null);
  const [open, setOpen] = useState(false);
  const [ruling, setRuling] = useState("");
  const [filed, setFiled] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const tok = localStorage.getItem(TOKEN_KEY);
        if (!tok) return;
        const r = await fetch("https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/rnd.md", { headers: { Authorization: "Bearer " + tok, Accept: "application/vnd.github.raw" } });
        if (!r.ok) return;
        const txt = await r.text();
        const m = txt.match(/^<!-- (\d{4}-\d{2}-\d{2}) -->/);
        if (m && (mk(isoOf(todayStart())) - mk(m[1])) / DAY <= 8) setDraft(txt.replace(/^<!--.*-->\n?/, ""));
      } catch (e) {}
    })();
  }, []);
  if (!draft) return null;
  return (
    <Card accent={T.brass} style={{ padding: 12 }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Eyebrow c={T.brass}>🜍 R&D DESK — THE IDEA SHIFT'S WEEKLY DRAFT</Eyebrow>
        <span style={{ fontFamily: mono, fontSize: 10, color: T.dim }}>{open ? "▾" : "▸"}</span>
      </div>
      {open && (
        <>
          <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 8, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{draft.slice(0, 2600)}</div>
          <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 9 }}>
            <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, letterSpacing: "0.06em" }}>YOUR RULING — read next Sunday by the desk (e.g. "variance map: build" · "idea 2: refine, smaller" · "idea 3: kill")</div>
            {!filed ? (
              <div style={{ display: "flex", gap: 8, marginTop: 7 }}>
                <input value={ruling} onChange={(e) => setRuling(e.target.value)} placeholder="your ruling…" style={{ flex: 1, fontFamily: body, fontSize: 12, padding: "9px 10px", borderRadius: 8, border: `1px solid ${T.line}`, background: T.plate2, color: T.chalk, outline: "none" }} />
                <Btn small tone="jade" onClick={() => { if (!ruling.trim()) return; const ns = JSON.parse(JSON.stringify(s)); ns.feed.unshift({ d: isoOf(todayStart()), t: "RND VERDICT", how: ruling.trim().slice(0, 220) }); sS && sS(ns); sv && sv(ns); setFiled(true); }}>File ruling</Btn>
              </div>
            ) : <div style={{ fontFamily: mono, fontSize: 10, color: T.jade, marginTop: 7 }}>✓ filed — the desk reads it on Sunday's run</div>}
          </div>
        </>
      )}
    </Card>
  );
}

function RndCard() {
  const rnd = useRepoDoc("ledger/rnd.md");
  if (![0, 1].includes(new Date().getDay())) return null;
  if (!rnd) return null;
  return (
    <Card accent={T.brass}>
      <Eyebrow c={T.brass}>THE DRAWING BOARD — YOUR R&D LAB'S WEEKLY PITCH</Eyebrow>
      <div style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: 6, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{rnd.slice(0, 2400)}</div>
      <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 8 }}>anything you like: tell the builder, it ships through the gate</div>
    </Card>
  );
}

function BackupsBlock() {
  const [items, setItems] = useState(null);
  const [msg, setMsg] = useState(null);
  const restore = async (path, label) => {
    if (!window.confirm(`Restore "${label}"? Current state will be replaced (a pre-restore copy is saved locally first).`)) return;
    try {
      try { localStorage.setItem("prep-ledger-prerestore", localStorage.getItem(KEY) || ""); } catch (e) {}
      const st = migrate(await fetchStateFile(path));
      localStorage.setItem(KEY, JSON.stringify(st));
      setMsg("restored — reloading…");
      setTimeout(() => window.location.reload(), 600);
    } catch (e) { setMsg("restore failed: " + e.message); }
  };
  return (
    <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.line}` }}>
      <Eyebrow c={T.jade}>BACKUPS · WEEKLY VAULT + ONE-TAP RESTORE</Eyebrow>
      <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel, marginTop: 5, lineHeight: 1.5 }}>A dated snapshot files itself beside the live state every ~7 days. A lost or wiped phone costs at most a week — usually nothing, since the live copy syncs too.</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <Btn small onClick={async () => { setMsg(null); const r = await listSnapshots(); if (r.ok) setItems(r.items); else setMsg(r.msg); }}>List backups</Btn>
        <Btn small onClick={() => restore("ledger/state.json", "live synced state")}>Restore live copy</Btn>
      </div>
      {msg && <div style={{ fontFamily: mono, fontSize: 9.5, color: T.brass, marginTop: 6 }}>{msg}</div>}
      {(items || []).map((it) => (
        <div key={it.path} onClick={() => restore(it.path, it.name)} style={{ fontFamily: mono, fontSize: 10.5, color: T.chalk, marginTop: 6, cursor: "pointer" }}>↺ {it.name.replace("state-", "").replace(".json", "")}</div>
      ))}
    </div>
  );
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
/* `clean` is the PERFORMANCE question — see DEBT_NOTE — and now answers it with
   the threshold the performance literature uses. `run`/`at` stay as the TARGET
   question, which is what the sleep score and the lean-mass line ask. */
function sleepInfo(s) {
  const n = s.sleep.nights;
  const tomorrow = isoOf(new Date(todayStart().getTime() + DAY));
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at, clean: cleanAtDate(s, tomorrow), last: n[n.length - 1], need: s.sleep.needed };
}
function weekDay() {
  const diff = Math.round((todayStart() - mk(START)) / DAY);
  return { wk: Math.floor(diff / 7) + 1, day: diff + 1 };
}
const blackoutOn = (s) => daysUntil(s.blackout.until) > 0;
const nextTrainingISO = (s) => { for (let i = 0; i <= 7; i++) { const d = isoOf(new Date(todayStart().getTime() + i * DAY)); const t = dayType(d); if ((t === "U" || t === "L") && !s.sessionLog[d]) return d; } return null; };
__test.nextTrainingISO = nextTrainingISO;
__test.typicalError = typicalError;
__test.MORNING_PARKED = MORNING_PARKED;
__test.rulebook = rulebook;
__test.windowFor = windowFor;
__test.repsLostOnJump = repsLostOnJump;
__test.coarseLifts = coarseLifts;
__test.calorieFloor = calorieFloor;
__test.nowFocus = nowFocus;
__test.mgLabel = mgLabel;
__test.exerciseSelection = exerciseSelection;
__test.dietExit = dietExit;
__test.KCAL_PER_LB_MIX = KCAL_PER_LB_MIX;
__test.KCAL_PER_LB_FAT = KCAL_PER_LB_FAT;
__test.DEBT_LAST_H = DEBT_LAST_H;
__test.DEBT_MEAN3_H = DEBT_MEAN3_H;
__test.EA_SPARING = EA_SPARING;
__test.etaRange = etaRange;
__test.bfEst = bfEst;
__test.stepTarget = stepTarget;
__test.beatsNoise = beatsNoise;
__test.cleanAtDate = cleanAtDate;
__test.progressStep = progressStep;
__test.sleepInfo = sleepInfo;
__test.atSleepTarget = atSleepTarget;
__test.labAnalytics = labAnalytics;
__test.INS_MAP = INS_MAP;
__test.liveBooks = liveBooks;
__test.LEDGER_DICT = LEDGER_DICT;
__test.briefAnswered = briefAnswered;
__test.liftCall = liftCall;
__test.applyRead = applyRead;
__test.dayWeather = dayWeather;
__test.CALL_PLAIN = CALL_PLAIN;
__test.sweepStalls = sweepStalls;
__test.muscleVolume = muscleVolume;
__test.programmeVolume = programmeVolume;
__test.volumeImbalance = volumeImbalance;
__test.sweepVolume = sweepVolume;
__test.INDIRECT = INDIRECT;
__test.filingsFor = filingsFor;
__test.bodyAlarm = bodyAlarm;
__test.todayCaff = todayCaff;
__test.fmt12 = fmt12;
__test.lightsOutT = lightsOutT;
__test.minuteNeeds = minuteNeeds;
__test.booksToday = booksToday;
__test.MORNING_REGISTRY = MORNING_REGISTRY;
__test.MUSCLE_CHIPS = MUSCLE_CHIPS;
__test.todayMeds = todayMeds;
__test.dayType = dayType;
__test.caffAt = caffAt;
__test.CONSTITUTION = CONSTITUTION;
__test.SCHEMA_V = SCHEMA_V;
__test.PACE = PACE;
__test.progressStep = progressStep;
__test.proteinTarget = proteinTarget;
__test.energyAvailability = energyAvailability;
__test.calorieTarget = calorieTarget;
__test.VOL_BANDS = VOL_BANDS;
__test.proposalDial = proposalDial;
__test.EA_SPARING = EA_SPARING;
__test.EA_LOW = EA_LOW;
__test.proteinHit = proteinHit;
__test.sleepAnchor = sleepAnchor;
__test.proteinTargetFn = proteinTarget;
__test.loadRungs = loadRungs;
__test.nextLoad = nextLoad;
__test.prevLoad = prevLoad;
__test.snapLoad = snapLoad;
__test.deloadLoad = deloadLoad;
__test.parseRungs = parseRungs;
__test.progressAnchor = progressAnchor;
__test.atTopOfWindow = atTopOfWindow;
__test.fadeRead = fadeRead;
__test.paceRushed = paceRushed;
__test.restFor = restFor;
__test.restLine = restLine;
__test.REST_BASE = REST_BASE;
__test.buildRirSets = buildRirSets;
__test.rirSetsOf = rirSetsOf;
__test.openerRir = openerRir;
__test.terminalRir = terminalRir;

/* ---------- atoms ---------- */
const Eyebrow = ({ children, c = T.dim }) => (
  <div style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.18em", color: c, textTransform: "uppercase" }}>{children}</div>
);
const stampColor = (st) => {
  if (["OWNED", "RECLAIMED", "ESTABLISH", "ESTABLISHED", "BASELINE", "RUNG DONE", "BOOKED", "FIRED", "ANCHORED"].includes(st)) return T.jade;
  if (["DEBUT"].includes(st)) return T.orange;
  if (st === "LIVE") return T.jade;
  if (st === "LOCKED") return T.dim;
  if (st === "ON FILE") return T.steel;
  if (st === "TRACKING") return T.jade;
  if (st === "MODEL") return T.chalk;
  if (["PARKED", "UNBOOKED", "COACH'S EYE", "ARMS @ ~13%", "COACH FLAG"].includes(st)) return T.dim;
  return T.brass;
};
const STAMP_LABEL = { GATED: "LOCKED", DEBUT: "FIRST RUN", OWNED: "YOURS", "OWN-IT": "MAKE IT YOURS", RECLAIM: "WIN IT BACK", PARKED: "ON HOLD", REVERT: "ROLLED BACK" };
const Stamp = ({ st }) => (
  <span style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.14em", color: stampColor(st), border: `1px solid ${stampColor(st)}`, borderRadius: 3, padding: "2px 6px", whiteSpace: "nowrap" }}>{STAMP_LABEL[st] || st}</span>
);
const Card = ({ children, style = {}, accent, ...rest }) => (
  <div {...rest} style={{ background: T.plate, border: `1px solid ${T.line}`, borderLeft: accent ? `3px solid ${accent}` : `1px solid ${T.line}`, borderRadius: 8, padding: SP.lg, ...style }}>{children}</div>
);
const Cond = ({ how, when }) => (
  <div style={{ marginTop: 12, padding: "10px 12px", background: T.plate2, borderRadius: 8, border: `1px solid ${T.line}` }}>
    <div style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.16em", color: T.dim }}>HOW</div>
    <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 3, lineHeight: 1.45 }}>{how}</div>
    <div style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.16em", color: T.dim, marginTop: 9 }}>COUNTS WHEN</div>
    <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 3, lineHeight: 1.45 }}>{when}</div>
  </div>
);
const SecRule = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: SP.md, margin: `${SP.xl}px 2px ${SP.sm}px` }}>
    <span style={{ fontFamily: mono, fontSize: TS.label, fontWeight: 600, letterSpacing: "0.2em", color: T.steel, whiteSpace: "nowrap" }}>{children}</span>
    <span style={{ flex: 1, height: 1, background: T.line }} />
  </div>
);
const Chip = ({ children, c = T.steel }) => (
  <span style={{ fontFamily: mono, fontSize: TS.label, color: c, border: `1px solid ${T.line}`, borderRadius: 999, padding: "6px 11px", whiteSpace: "nowrap" }}>{children}</span>
);
const Btn = ({ onClick, children, tone = "ghost", full, small, disabled }) => {
  const tones = {
    ghost: { background: "transparent", color: T.chalk, border: `1px solid ${T.line}` },
    jade: { background: T.jade, color: T.ink, border: `1px solid ${T.jade}` },
    orange: { background: T.orange, color: T.ink, border: `1px solid ${T.orange}` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...tones[tone], opacity: disabled ? 0.4 : 1, fontFamily: mono, fontSize: small ? 11 : 12.5, letterSpacing: "0.06em", borderRadius: 6, padding: small ? "9px 13px" : "11px 15px", width: full ? "100%" : "auto", fontWeight: 600, cursor: disabled ? "default" : "pointer" }}>
      {children}
    </button>
  );
};
const Stepper = ({ v, set, step = 1, min = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <button onClick={() => set(Math.max(min, +(v - step).toFixed(1)))} style={{ width: 40, height: 40, borderRadius: 6, fontSize: 18, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>−</button>
    <div style={{ fontFamily: mono, fontSize: 15, color: T.chalk, minWidth: 38, textAlign: "center" }}>{v}</div>
    <button onClick={() => set(+(v + step).toFixed(1))} style={{ width: 40, height: 40, borderRadius: 6, fontSize: 18, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>+</button>
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

function Section({ title, meta, c = T.chalk, children }) {
  const [open, setOpen] = useState(false);
  return (
    <Card style={{ padding: 12 }} accent={open ? c : undefined}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontFamily: disp, fontWeight: 700, fontSize: TS.title, color: T.chalk, textTransform: "uppercase" }}>{title}</div>
          <div style={{ fontFamily: mono, fontSize: TS.label, color: T.dim, textAlign: "right", minWidth: 0, flex: "1 1 auto", overflowWrap: "anywhere" }}>{meta} {open ? "▾" : "▸"}</div>
        </div>
      </div>
      {open && <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>}
    </Card>
  );
}

function More({ deep, forYou, c = T.jade }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setOpen(!open)} style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.1em", color: open ? T.chalk : T.dim, background: "none", border: "none", padding: 0 }}>{open ? "▾ CLOSE" : "▸ MORE"}</button>
      {open && (
        <div style={{ marginTop: 8, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
          <Eyebrow>WHAT IT IS</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 5, lineHeight: 1.55 }}>{plainify(deep)}</div>
          {forYou && (
            <div style={{ marginTop: 10 }}>
              <Eyebrow c={c}>FOR YOU · RIGHT NOW</Eyebrow>
              {(Array.isArray(forYou) ? forYou : [forYou]).map((l, i) => (
                <div key={i} style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: i ? 6 : 5, lineHeight: 1.55 }}>{plainify(l)}</div>
              ))}
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

function trendSeries(reads) {
  let t = null;
  return reads.map((r) => {
    if (t === null) t = r.w;
    else if (!r.sealed) t = +(t + Math.max(-1.5, Math.min(1.5, r.w - t)) * 0.3).toFixed(2);
    return { d: r.d, t };
  });
}
function Spark({ reads, trend }) {
  const W = 300, Hh = 96, pad = 8;
  const all = reads.slice(-45);
  if (!all.length) return null;
  const ts = trendSeries(reads).slice(-45);
  const t0 = mk(all[0].d).getTime(), t1 = Math.max(mk(all[all.length - 1].d).getTime(), todayStart().getTime());
  const ws = all.map((r) => r.w).concat(ts.map((p) => p.t)).concat([trend]);
  const lo = Math.min(...ws) - 0.8, hi = Math.max(...ws) + 0.8;
  const x = (d) => pad + ((mk(d).getTime() - t0) / Math.max(1, t1 - t0)) * (W - 2 * pad);
  const y = (w) => pad + (1 - (w - lo) / (hi - lo)) * (Hh - 2 * pad);
  const tPath = ts.map((pnt, i) => `${i ? "L" : "M"}${x(pnt.d).toFixed(1)},${y(pnt.t).toFixed(1)}`).join(" ");
  const yEnd = y(ts[ts.length - 1].t);
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${Hh}`} style={{ display: "block" }}>
        {all.map((r, i) => (
          <circle key={i} cx={x(r.d)} cy={y(r.w)} r={r.sealed ? 1.9 : 1.5} fill={r.sealed ? "none" : T.steel} stroke={r.sealed ? T.dim : "none"} strokeWidth="1" opacity={r.sealed ? 0.75 : 0.5} />
        ))}
        <path d={tPath} fill="none" stroke={T.jade} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(ts[ts.length - 1].d)} cy={yEnd} r="2.8" fill={T.jade} />
      </svg>
      <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 5 }}>
        <span style={{ color: T.jade }}>— trend {trend}</span> · grey = mornings · hollow = sealed · last {all.length} reads
      </div>
    </div>
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

/* ---------- THE ONE DOOR — FOR YOUR APPROVAL ----------
   Law 3: "many sources, one door — every machine-initiated change routes through
   the proposals inbox." Law 10: "the athlete overrides." The engine (s.proposals),
   the analyst (ledger/suggestions.json, graded on its scorecard) and the agents
   (s.agentProposals) used to render three cards in three styles with three
   interactions — the exact consistency violation Nielsen #4 warns about, three
   patterns to learn where one would do. They are ONE inbox now: one card, one
   place, ordered by leverage, Approve + Dismiss on every item (Law 10 makes even
   the engine's own autoregulation declinable). Only the SOURCE tag and the
   under-the-hood dispatch differ — each keeps its real behaviour: the engine its
   bounded nudge dial, the analyst its grade, the agents their consent copy. */
function ApprovalInbox({ s, setS, save, tISO }) {
  const [nudge, setNudge] = useState({});
  const raw = useRepoDoc("ledger/suggestions.json");
  const sugData = (() => { try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; } })();
  const doneSug = new Set((s.suggestionLog || []).map((x) => x.sid));
  const items = [];

  (s.proposals || []).filter((p) => !p.resolved).forEach((p) => {
    const k = (p.apply || {}).kind;
    const pri = (k === "phase" || k === "exit") ? 0 : (k === "cal" || k === "rate" || k === "refeed") ? 1 : 4;
    items.push({
      key: "eng_" + p.id, from: "ENGINE", type: "ADJUSTMENT ARMED", meta: fmtShort(p.d), accent: T.brass, pri,
      title: p.title, why: p.why, dial: proposalDial(p),
      approve: (n) => { const ns = applyProposal(s, p.id, n || 0); setS(ns); save(ns); },
      approveLabel: (n) => (n ? "Apply my version — log it" : "Apply — log it"),
      dismiss: () => { const ns = dismissProposal(s, p.id); setS(ns); save(ns); },
    });
  });

  (s.agentProposals || []).forEach((ap) => {
    const consent = ap.kind === "volume" ? (ap.dir > 0 ? "Approve: one set is added to that lift starting next session." : "Approve: one set comes off that lift starting next session.")
      : ap.kind === "reset" ? `Approve: the weight drops to ${ap.newW} and rep targets re-seed for the lighter load.`
      : ap.kind === "trial" ? "Approve: the experiment rides your daily protocol in blocks and files its own verdict when done."
      : "";
    const canApprove = (ap.kind === "volume" && ap.exId && ap.dir) || (ap.kind === "reset" && ap.exId && ap.newW) || (ap.kind === "trial" && (ap.custom || (ap.tplId && TRIAL_TPL[ap.tplId] && !(s.trials || []).some((t) => t.tplId === ap.tplId))));
    const label = ap.kind === "volume" ? (ap.dir > 0 ? "Add the set — approve" : "Trim the set — approve") : ap.kind === "reset" ? "Apply reset — approve" : "Start trial — approve";
    items.push({
      key: "agt_" + ap.id, from: "AGENT", type: "PROPOSAL", accent: T.jade, pri: ap.kind === "reset" ? 2 : ap.kind === "volume" ? 3 : 5,
      title: ap.title, why: plainify(ap.body), consent,
      approve: canApprove ? () => { const ns = applyAgentProposal(s, ap, tISO); setS(ns); save(ns); } : null,
      approveLabel: () => label,
      dismiss: () => { const ns = dismissAgentProposal(s, ap, tISO); setS(ns); save(ns); },
    });
  });

  if (sugData && Array.isArray(sugData.suggestions)) {
    sugData.suggestions.filter((x) => x && x.sid && !doneSug.has(x.sid)).forEach((p) => {
      const conf = String(p.confidence || "").toLowerCase();
      items.push({
        key: "ana_" + p.sid, from: "ANALYST", type: "SUGGESTION" + (p.confidence ? " · " + conf.toUpperCase() : ""), accent: T.jade,
        pri: 3 + (conf === "high" ? 0 : conf === "medium" ? 0.3 : 0.6),
        title: p.title, rationale: p.rationale, predict: p.predict, conf,
        approve: () => { const ns = applySuggestion(s, p); setS(ns); save(ns); },
        approveLabel: () => "Approve — apply it",
        dismiss: () => { const ns = dismissSuggestion(s, p); setS(ns); save(ns); },
      });
    });
  }

  items.sort((a, b) => a.pri - b.pri);
  const rline = { fontFamily: body, fontSize: TS.body, color: T.steel, lineHeight: 1.5, marginTop: SP.xs };

  return (
    <>
      <SecRule>FOR YOUR APPROVAL · your tap decides</SecRule>
      {items.length === 0 && (
        <Card style={{ padding: SP.md }}>
          <div style={{ fontFamily: mono, fontSize: TS.micro, color: T.dim, lineHeight: 1.5 }}>Nothing waiting. Every change the machine wants — from the engine, your analyst, or an agent — arrives here first, in plain words, for one tap.</div>
        </Card>
      )}
      {items.map((it) => {
        const n = nudge[it.key] || 0;
        return (
          <Card key={it.key} accent={it.accent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: SP.sm }}>
              <Eyebrow c={it.accent}>{it.type}</Eyebrow>
              <span style={{ fontFamily: mono, fontSize: TS.micro, color: T.dim, letterSpacing: "0.16em", whiteSpace: "nowrap" }}>{it.from}{it.meta ? " · " + it.meta : ""}</span>
            </div>
            <div style={{ marginTop: SP.xs }}><H size={19}>{it.title}</H></div>
            {it.why && <div style={{ fontFamily: body, fontSize: TS.body, color: T.steel, marginTop: SP.xs, lineHeight: 1.5 }}>{it.why}</div>}
            {it.rationale && (
              <>
                {it.rationale.science && <div style={rline}><b style={{ color: T.chalk }}>Science:</b> {it.rationale.science}</div>}
                {it.rationale.data && <div style={rline}><b style={{ color: T.chalk }}>Your data:</b> {it.rationale.data}</div>}
                {it.rationale.relationship && <div style={rline}><b style={{ color: T.chalk }}>Why it matters:</b> {it.rationale.relationship}</div>}
              </>
            )}
            {it.predict && <div style={{ fontFamily: mono, fontSize: TS.label, color: it.conf === "high" ? T.jade : it.conf === "low" ? T.steel : T.brass, marginTop: SP.sm }}>→ expected: {it.predict}</div>}
            {it.consent && <div style={{ fontFamily: mono, fontSize: TS.micro, color: T.dim, marginTop: SP.sm, lineHeight: 1.5 }}>{it.consent} Dismiss: nothing changes.</div>}
            {it.dial && (
              <div style={{ marginTop: SP.sm }}>
                <div style={{ fontFamily: mono, fontSize: TS.micro, color: T.dim, letterSpacing: "0.08em" }}>TAKE IT AS PROPOSED, OR MOVE IT — YOUR CALL EITHER WAY</div>
                <div style={{ display: "flex", alignItems: "center", gap: SP.sm, marginTop: 7, flexWrap: "wrap" }}>
                  <button onClick={() => setNudge({ ...nudge, [it.key]: Math.max(-it.dial.max, n - it.dial.step) })} style={{ width: 40, height: 40, borderRadius: 6, fontSize: 18, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>−</button>
                  <div style={{ fontFamily: mono, fontSize: 14, color: n ? T.jade : T.chalk, minWidth: 74, textAlign: "center" }}>{it.dial.base + n > 0 ? "+" : ""}{it.dial.base + n} {it.dial.unit}{Math.abs(it.dial.base + n) === 1 ? "" : "s"}</div>
                  <button onClick={() => setNudge({ ...nudge, [it.key]: Math.min(it.dial.max, n + it.dial.step) })} style={{ width: 40, height: 40, borderRadius: 6, fontSize: 18, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>+</button>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: SP.sm, marginTop: SP.md, flexWrap: "wrap" }}>
              {it.approve && <Btn small tone="jade" onClick={() => { it.approve(n); if (it.dial) setNudge({ ...nudge, [it.key]: 0 }); }}>{it.approveLabel(n)}</Btn>}
              <Btn small onClick={it.dismiss}>Dismiss</Btn>
            </div>
          </Card>
        );
      })}
    </>
  );
}

function NowTab({ s, setS, save, slp, openRules, openCoach }) {
  const [askOpen, setAskOpen] = useState(false);
  const [lawsOpen, setLawsOpen] = useState(false);
  const [minOpen, setMinOpen] = useState(false);
  const [nCMg, setNCMg] = useState(200);
  const [nCAt, setNCAt] = useState(() => { const d9 = new Date(); return String(d9.getHours()).padStart(2, "0") + ":" + String(Math.floor(d9.getMinutes() / 15) * 15).padStart(2, "0"); });
  const [mAt, setMAt] = useState(() => { const ml = (s.medsLog || []).filter((x) => x.taken && x.at && x.at !== "—"); return ml.length ? ml[ml.length - 1].at : "12:00"; });
  const [yCal, setYCal] = useState(""); const [yPro, setYPro] = useState(""); const [yStp, setYStp] = useState("");
  const [ySod, setYSod] = useState(null); const [yAlc, setYAlc] = useState(0);
  const [amendY, setAmendY] = useState(false);
  useEffect(() => { if (!amendY) return; const t0 = setTimeout(() => { const el = document.getElementById("pl-amend"); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 60); return () => clearTimeout(t0); }, [amendY]);
  const tISO = isoOf(todayStart());
  /* His own clock, not an authored one. The defaults used to be bed 23:00 /
     wake 06:45 — times he has never logged once — so every morning started with
     two pickers about two and a half hours wrong. Friction on the one input the
     body-composition read leans on hardest. See SLEEP_LEVER_NOTE. */
  const anch = sleepAnchor(s);
  const [bedT, setBedT] = useState(anch.bed || (s.sleep.anchor || {}).bed || "23:30");
  const [wakeT, setWakeT] = useState(anch.wake || (s.sleep.anchor || {}).wake || "07:30");
  const [slTags, setSlTags] = useState([]);
  const [awakeMin, setAwakeMin] = useState(30);
  const [solMin, setSolMin] = useState(15);
  const [dayEdit, setDayEdit] = useState(false);
  /* Collapsed by default, and it STAYS collapsed unless he opens it — the room
     never rearranges itself. See NOW_FOCUS and NAV_NOTE. */
  const [restOpen, setRestOpen] = useState(false);
  const focus = nowFocus(s);
  const [wIn, setWIn] = useState(s.trend);
  const [waistIn, setWaistIn] = useState(s.waist && s.waist.length ? s.waist[s.waist.length - 1].v : 32);
  const [pulseIn, setPulseIn] = useState(((s.pulse || [])[Math.max(0, (s.pulse || []).length - 1)] || {}).bpm || 58);
  const [tempIn, setTempIn] = useState(((s.temp || [])[Math.max(0, (s.temp || []).length - 1)] || {}).f || 97.6);
  const wd = weekDay();
  const dt = dayType(tISO, s);
  const isRefeed = dt === "REFEED";
  const nextISO = nextTrainingISO(s);
  const sess = nextISO ? genSession(s, nextISO, slp) : null;
  const heroToday = nextISO === tISO;
  const dl = s.dailyLogs[tISO] || {};
  /* Every default here is derived. The calorie box used to fall back to 1760
     and the step box to a flat 16500 — two authored numbers sitting next to a
     measured one, which made the card look like it knew three things when it
     knew one. Both now read the same engine the labels read. */
  const stpT0 = stepTarget(s), ctT0 = calorieTarget(s);
  /* A gated calorieTarget has no mid, and an undefined useState flips the
     input uncontrolled->controlled on the first keystroke and writes NaN. */
  const [cal, setCal] = useState(dl.cal ?? (ctT0.gated ? "" : ctT0.mid));
  const [pro, setPro] = useState(dl.pro ?? proteinTarget(s).g);
  const [stp, setStp] = useState(dl.steps ?? (stpT0.gated ? "" : Math.round((stpT0.lo + stpT0.hi) / 2)));
  const cleanIn = daysUntil(SEAL_UNTIL);
  const ev = s.events.find((e) => !e.estimated && daysUntil(e.d) >= 0);
  const ph = PHASES[s.phase];
  /* The band he is actually shown, derived from measured maintenance — see
     CALORIE_TARGET. The refeed branch is gone: it hardcoded a 2,450–2,500
     Wednesday, which against a fixed weekly total is simply a deeper Monday. */
  const ctT = calorieTarget(s);
  const calT = !ctT.gated ? [ctT.lo, ctT.hi] : ph.band;
  const bf = bfEst(s);
  const nextUnlocks = s.queue.filter((x) => !x.done && x.kind !== "info" && x.kind !== "phase").slice(0, 2);

  const [sod9, setSod9] = useState(() => (s.dailyLogs[tISO] || {}).sodium || null);
  const [alc9, setAlc9] = useState(() => (s.dailyLogs[tISO] || {}).alc ?? 0);
  useEffect(() => { const d0 = s.dailyLogs[tISO] || {}; const st1 = stepTarget(s); const ct1 = calorieTarget(s); setCal(d0.cal ?? (ct1.gated ? "" : ct1.mid)); setPro(d0.pro ?? proteinTarget(s).g); setStp(d0.steps ?? (st1.gated ? "" : Math.round((st1.lo + st1.hi) / 2))); setSod9(d0.sodium ?? null); setAlc9(d0.alc ?? 0); }, [tISO]);
  const saveDaily = () => {
    const ns = { ...s };
    const c = cal === "" ? null : Number(cal), p = pro === "" ? null : Number(pro), st = stp === "" ? null : Number(stp);
    ns.dailyLogs = { ...ns.dailyLogs, [tISO]: { cal: c, pro: p, steps: st, sodium: sod9, alc: +alc9 || 0 } };
    if (p != null) {
      const hit = proteinHit(proteinTarget(s).lo, p);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: SP.md }}>
        <div style={{ minWidth: 0 }}>
          <H size={24}>Prep Ledger</H>
          {/* The band, not just the point. bfEst has carried lo/hi since the
              drip was zeroed, but the interval only ever showed on BODY — a tab
              he says he very rarely opens. A naked "BF 12%" on the page he
              opens every day reads as a measurement; it is a model output with
              a couple of points of width on it, and hiding that width is
              exactly the "misleading read of the athlete's state" GOALS.md
              calls a regression. */}
          <div style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.14em", color: T.steel, marginTop: SP.sm, textTransform: "uppercase" }}>WK {wd.wk} · D{wd.day} · {s.phase} · BF {bf.pct}%<span style={{ color: T.dim }}> ({bf.lo}–{bf.hi})</span></div>
        </div>
        <div style={{ display: "flex", gap: SP.sm, flexShrink: 0 }}>
          <button onClick={openCoach} style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.12em", color: T.steel, background: "none", border: `1px solid ${T.line}`, borderRadius: 6, padding: "7px 11px", whiteSpace: "nowrap" }}>COACH</button>
          <button onClick={openRules} style={{ fontFamily: mono, fontSize: TS.label, letterSpacing: "0.12em", color: T.steel, background: "none", border: `1px solid ${T.line}`, borderRadius: 6, padding: "7px 11px", whiteSpace: "nowrap" }}>RULES</button>
        </div>
      </div>

      {/* ---------- THE ONE THING ----------
          The page used to open with 28 cards regardless of why he came. This is
          what he owes right now, in one line, with everything else still below
          it. It never hides an input — it points at one. See NOW_FOCUS. */}
      <Card accent={focus.clear ? T.jade : T.brass} style={{ padding: SP.lg }}>
        <Eyebrow c={focus.clear ? T.jade : T.brass}>
          {focus.clear ? "NOTHING OWED" : focus.phase === "MORNING" ? "THIS MORNING · WHAT YOU OWE" : focus.phase === "EVENING" ? "TONIGHT · WHAT YOU OWE" : "WHAT YOU OWE"}
        </Eyebrow>
        <div style={{ marginTop: SP.sm }}><H size={focus.clear ? 20 : 24}>{focus.lead.t}</H></div>
        <div style={{ fontFamily: body, fontSize: TS.body, color: T.steel, marginTop: SP.xs, lineHeight: 1.5 }}>{focus.lead.sub}</div>
        {focus.lead.more > 0 && (
          <div style={{ fontFamily: mono, fontSize: TS.label, color: T.dim, marginTop: SP.sm, letterSpacing: "0.04em" }}>
            then {focus.owed.slice(1).map((o) => o.t.toLowerCase()).join(" · ")}
          </div>
        )}
      </Card>

      {askOpen && <AskLedger s={s} setS={setS} save={save} onClose={() => setAskOpen(false)} />}
      {lawsOpen && <LawsView onClose={() => setLawsOpen(false)} />}
      {minOpen && <MinuteView s={s} setS={setS} save={save} onClose={() => setMinOpen(false)} />}
      {(s.labNews || []).length > 0 && (
        <Card accent={T.jade} style={{ padding: 10, cursor: "pointer" }}>
          <div onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.labNews = []; setS(ns); save(ns); }}>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: T.jade, letterSpacing: "0.06em" }}>🧪 LAB LIVE — {s.labNews.join(" · ")}</div>
            <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 3 }}>verdict waiting on the LAB tab · tap to dismiss</div>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {s.sessionLog[tISO] && <Chip c={T.jade}>Session ✓ — receipt in TRAIN</Chip>}
        {cleanIn > 0 && <Chip c={T.chalk}>Scale sealed · clean read {fmtShort(SEAL_UNTIL)} · {cleanIn}d</Chip>}
        {(() => { try { const se9 = JSON.parse(localStorage.getItem("plSyncErr") || "null"); if (se9) return <Chip c={T.redline}>⚠ SYNC FAILING · HTTP {se9.status} since {se9.at.slice(11, 16)} — RULES → Sync now</Chip>; } catch (e) {} return null; })()}
        {ev && <Chip c={T.chalk}>{ev.t} · {fmtShort(ev.d)}</Chip>}
        {(() => { try { const ls2 = +(localStorage.getItem("pl-lastsync") || 0); if (localStorage.getItem(TOKEN_KEY) && ls2 && Date.now() - ls2 > 36 * 36e5) return <Chip c={T.brass}>books haven't reached your analyst since {new Date(ls2).toLocaleDateString(undefined, { month: "numeric", day: "numeric" })} — tap sync in RULES</Chip>; } catch (e) {} return null; })()}
      </div>
      {(() => { const al9 = bodyAlarm(s, slp); if (!al9 || (al9.level !== "RED" && al9.level !== "AMBER")) return null; return (
        <Card accent={al9.level === "RED" ? T.redline : T.brass}>
          <Eyebrow c={al9.level === "RED" ? T.redline : T.brass}>{al9.level === "RED" ? "⚠ BODY ALARM — REST TODAY" : "⚠ BODY ALARM — OFF DAY"}</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: 5, lineHeight: 1.55 }}>{al9.level === "RED" ? "The pattern held a second day. Today buys nothing worth its cost — walk, eat, sleep, and come back tomorrow ahead. Every lift's desk already says REST TODAY." : "Normal session, one rule changed: no all-out sets and no record attempts. Every zero becomes a one — the desk chips already carry it."}</div>
        </Card>
      ); })()}
      {(() => {
        const owed = owedNights(s);
        const lastNight = isoOf(new Date((new Date().getHours() < 5 ? todayStart().getTime() - DAY : todayStart().getTime()) - DAY));
        const slAlready = owed.length === 0;
        const wAlready = s.reads.some((r) => r.d === tISO);
        const sealedNow = blackoutOn(s);
        const logW = () => { const ns2 = runAdaptive(applyRead(s, tISO, wIn), tISO); setS(ns2); save(ns2); };
        return (
          <>
      <SecRule>THIS MORNING</SecRule>
      {(() => { const bk9 = booksToday(s); if (bk9.complete) return (
        <Card style={{ padding: "9px 14px" }}><div style={{ fontFamily: mono, fontSize: 10, color: T.jade }}>📕 {fmtShort(isoOf(todayStart()))} closed — everything the analysts need is in.</div></Card>
      ); const mn9 = minuteNeeds(s); if (new Date().getHours() < 14 && !mn9.length) return (<Card style={{ padding: "9px 14px" }}><div style={{ fontFamily: mono, fontSize: 10, color: T.jade }}>✓ the morning minute · complete</div></Card>); if (new Date().getHours() < 12 && mn9.length) return (
        <Card accent={T.jade} style={{ padding: "11px 14px", cursor: "pointer" }} onClick={() => setMinOpen(true)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: mono, fontSize: 10.5, color: T.chalk }}>☀ THE MORNING MINUTE <span style={{ color: T.dim }}>— {mn9.length + 1} steps · ~60 seconds, then the day's yours</span></div>
            <span style={{ fontFamily: mono, fontSize: 14, color: T.jade }}>▸</span>
          </div>
        </Card>
      ); return null; })()}

            <Card accent={T.chalk} style={slAlready && wAlready ? { padding: 10 } : undefined}>
              {!(slAlready && wAlready) && <Eyebrow>MORNING · CAPTURE — EVERYTHING LOGS HERE</Eyebrow>}
              {!slAlready ? (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim }}><Term k="nightdate" c={T.dim}>SLEEP</Term> · {fmtShort(owed[0])} night{owed.length > 1 ? " (+" + (owed.length - 1) + " missed)" : ""}</div>
                    <div style={{ display: "flex", gap: 8, rowGap: 10, alignItems: "center", flexWrap: "wrap", fontFamily: mono, fontSize: 10.5, color: T.steel }}>
                      <span>bed</span>
                      <input type="time" value={bedT} onChange={(e) => setBedT(e.target.value)} style={{ background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 12, padding: "6px 6px" }} />
                      <span>wake</span>
                      <input type="time" value={wakeT} onChange={(e) => setWakeT(e.target.value)} style={{ background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 12, padding: "6px 6px" }} />
                      <span><Term k="driftoff" c={T.steel}>asleep in</Term></span>
                      <Stepper v={solMin} set={setSolMin} step={5} min={0} />
                      <span>m</span>
                      <span style={{ color: T.jade }}>= {sleepSpanH(bedT, wakeT, solMin + (slTags.includes("woke") ? awakeMin : 0))} h asleep</span>
                    </div>
                  </div>
                  {/* The lever, named, with the arithmetic showing. This is the
                      single highest-value line on the page: Nedeltcheva 2010 put
                      5.5 h vs 8.5 h at a matched deficit at 60% MORE of the loss
                      coming off fat-free mass. Not a session effect — a
                      fat-versus-muscle effect, which is the entire point of the
                      app. See SLEEP_LEVER_NOTE for why it names bedtime. */}
                  {anch.measured && anch.shiftMin > 0 && (
                    <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 8, lineHeight: 1.5, paddingLeft: 8, borderLeft: `2px solid ${T.jade}` }}>
                      <span style={{ fontFamily: mono, fontSize: 9.5, color: T.jade, letterSpacing: "0.06em" }}>THE LEVER — LIGHTS OUT {fmt12(anch.needBed)}</span>
                      <div style={{ marginTop: 3 }}>
                        Your last {anch.n} nights: bed {fmt12(anch.bed)}, up {fmt12(anch.wake)} — {anch.curH} h.
                        {anch.bedSDmin != null && anch.wakeSDmin != null && anch.bedSDmin <= anch.wakeSDmin
                          ? ` Your bedtime is the steady end (${anch.bedSDmin} min of spread against ${anch.wakeSDmin} on your wake), so it is the end you can actually move.`
                          : ""}
                          {" "}Going down {anch.shiftMin} minutes earlier clears {anch.target} h without getting up any later — and short sleep in a deficit sends about 60% more of what you lose off your muscle instead of your fat.
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {[["mela", "melatonin"], ["woke", "woke mid-night"], ["screen", "late screens"]].map(([k2, lbl]) => {
                      const on = slTags.includes(k2);
                      return (
                        <button key={k2} onClick={() => setSlTags(on ? slTags.filter((x) => x !== k2) : [...slTags, k2])}
                          style={{ fontFamily: mono, fontSize: 9.5, padding: "5px 9px", borderRadius: 999, border: `1px solid ${on ? T.brass : T.line}`, background: on ? T.plate2 : "transparent", color: on ? T.brass : T.dim }}>{lbl}</button>
                      );
                    })}
                    {slTags.includes("woke") && (
                      <span style={{ display: "flex", gap: 5, alignItems: "center", fontFamily: mono, fontSize: 9.5, color: T.brass }}>
                        ~<Stepper v={awakeMin} set={setAwakeMin} step={15} min={0} /> min awake
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Btn full small tone="jade" onClick={() => {
                      const od = owed[0];
                      const ns = JSON.parse(JSON.stringify(s));
                      ns.sleep.nights.push({ d: od, h: sleepSpanH(bedT, wakeT, solMin + (slTags.includes("woke") ? awakeMin : 0)), bed: bedT, wake: wakeT, tags: slTags.slice(), awakeMin: slTags.includes("woke") ? awakeMin : 0, sol: solMin });
                      ns.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
                      /* The old message here said "PRs can be OWNED again" —
                         the retired gate, congratulating him for unlocking
                         something that was never locked. What a run at target
                         actually buys is on the body-composition side, so that
                         is what it now says. */
                      const t9 = atSleepTarget(ns, null);
                      if (t9.run === ns.sleep.needed) ns.feed.unshift({ d: tISO, t: "SLEEP AT TARGET", how: `${t9.run} nights running at ${ns.sleep.cleanH} h or better. This is the lever that decides how much of what you lose comes off fat instead of muscle — at a matched deficit, short sleep sends about 60% more of it off lean mass.` });
                      setS(ns); save(ns); setSlTags([]);
                    }}>Log {fmtShort(owed[0]).split(" ")[1]} night</Btn>
                  </div>
                </div>
              ) : (
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
              {!(slAlready && wAlready) && <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 10 }}>evening numbers below · sessions in TRAIN · everything else is reading</div>}
            </Card>
          </>
        );
      })()}

      <SecRule>THE READ · what the machine says</SecRule>
      <BriefCard s={s} setS={setS} save={save} />
      <Card accent={T.jade} style={{ padding: "11px 14px", cursor: "pointer" }} onClick={() => setAskOpen(true)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: T.chalk }}>🜁 ASK THE ANALYST <span style={{ color: T.dim }}>— anything about your data, same voice as the read</span></div>
          <span style={{ fontFamily: mono, fontSize: 14, color: T.jade, flexShrink: 0 }}>▸</span>
        </div>
      </Card>

      <ApprovalInbox s={s} setS={setS} save={save} tISO={tISO} />











      <SecRule>TODAY'S PLAN · what to do today</SecRule>
      {(() => { const pr = dayProtocol(s, slp); return (
        <Card accent={T.jade}>
          <Eyebrow c={T.jade}>TODAY'S PROTOCOL — RANKED, FROM YOUR DATA</Eyebrow>
          <div style={{ marginTop: 6 }}><H size={22}>{pr.lead.t}</H></div>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 4 }}>{plainify(pr.lead.sub)}</div>
          <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 9, display: "flex", flexDirection: "column", gap: 7 }}>
            {pr.steps.map((st2, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: T.dim, flexShrink: 0 }}>{i + 2}.</span>
                <div>
                  <div style={{ fontFamily: mono, fontSize: 11, color: st2.detail ? T.brass : T.chalk }}>{plainify(st2.a)}</div>
                  <div style={{ fontFamily: body, fontSize: 11, color: T.dim, lineHeight: 1.45 }}>{plainify(st2.why)}</div>
                  {(st2.detail || []).map((dl, k) => (
                    <div key={k} style={{ fontFamily: body, fontSize: 11, color: T.chalk, lineHeight: 1.5, marginTop: 4, paddingLeft: 8, borderLeft: `2px solid ${T.line}` }}>{plainify(dl)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 9, lineHeight: 1.5 }}>
            ranked by how much each moves body composition and how far you sit from it — deficit and protein outrank sleep, sleep outranks caffeine and steps
            {pr.held > 0 ? ` · ${pr.held} more held back, not dropped — open the day's full read for the rest` : ""}
          </div>
        </Card>
      ); })()}

      {ev && (
        <Card accent={T.chalk}>
          <Eyebrow>EVENT MODE · {fmtShort(ev.d)}</Eyebrow>
          <H size={19}>{ev.t}</H>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 4 }}>{ev.protocol}. Events filed without a make-up day: <span style={{ color: T.chalk, fontFamily: mono }}>{s.zeroComp.count}</span> straight — an event never buys a punishment here: tomorrow runs exactly as planned.</div>
          {daysUntil(ev.d) <= 0 && (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {daysUntil(ev.d) < 0 && <div style={{ fontFamily: mono, fontSize: 9.5, color: T.brass }}>waiting on you to close it — the ledger doesn't guess</div>}
            <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginBottom: 8 }}>after tonight: one tap files the day — tomorrow runs the normal plan, and whether it went big lives in the numbers you log, not in a button</div>
              <Btn full tone="jade" onClick={() => { const ns = closeEvent(s, ev.id, true); setS(ns); save(ns); }}>File the event ✓ — your estimate goes in tonight's numbers</Btn>
            </div>
          )}
        </Card>
      )}



      {(() => {
        const y8 = isoOf(new Date(todayStart().getTime() - DAY));
        if ((s.dailyLogs[y8] && !amendY) || Object.keys(s.dailyLogs).length === 0) return null;
        const isAmend = !!s.dailyLogs[y8];
        return (
          <Card id="pl-amend" accent={T.brass}>
            <Eyebrow c={T.brass}>{isAmend ? `AMEND ${fmtShort(y8).toUpperCase()} — HONEST CORRECTIONS WELCOME` : `YESTERDAY'S BOOKS STILL OPEN — CLOSE ${fmtShort(y8).toUpperCase()} IN 30 SECONDS`}</Eyebrow>
            <div style={{ marginTop: 6 }}>
              <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.dayCtx = ns.dayCtx || {}; if ((ns.dayCtx[y8] || {}).est) delete ns.dayCtx[y8]; else ns.dayCtx[y8] = { est: true, note: "declared estimate day" }; setS(ns); save(ns); }}
                style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.05em", color: ((s.dayCtx || {})[y8] || {}).est ? T.brass : T.dim, border: `1px solid ${((s.dayCtx || {})[y8] || {}).est ? T.brass : T.line}`, borderRadius: 999, padding: "4px 9px", cursor: "pointer" }}>
                {((s.dayCtx || {})[y8] || {}).est ? "⌁ ESTIMATE DAY ✓" : "was it an estimate day?"}
              </span>
            </div>
            <div style={{ fontFamily: body, fontSize: 11, color: T.steel, marginTop: 4 }}>{isAmend ? "Late bites count on the day they belong to. Corrected numbers replace the old ones; the amendment itself goes on the record — that is accuracy, not failure." : "Midnight passed but the day didn't file itself. Same numbers, honest timestamp — the ledger marks it logged-late, which is a fact, not a fault."}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
              {[["CAL", yCal, setYCal], ["PRO", yPro, setYPro], ["STEPS", yStp, setYStp]].map(([l8, v8, f8]) => (
                <div key={l8} style={{ flex: 1 }}>
                  <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.1em", marginBottom: 4 }}>{l8}</div>
                  <input inputMode="decimal" value={v8} onChange={(e8) => f8(e8.target.value)} style={{ width: "100%", boxSizing: "border-box", background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 8, color: T.chalk, fontFamily: mono, fontSize: 15, padding: "9px 8px", outline: "none" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>SODIUM</span>
              {["low", "med", "high"].map((sv) => (
                <span key={sv} onClick={() => setYSod(sv)} style={{ fontFamily: mono, fontSize: 9.5, color: ySod === sv ? T.jade : T.dim, border: `1px solid ${ySod === sv ? T.jade : T.line}`, borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}>{sv}</span>
              ))}
              <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginLeft: 8 }}>ALCOHOL</span>
              {[2, 4, 6, 8, 10, 12].map((u0) => (
                <span key={u0} onClick={() => setYAlc(u0)} style={{ fontFamily: mono, fontSize: 9.5, color: +yAlc === u0 ? T.jade : T.dim, border: `1px solid ${+yAlc === u0 ? T.jade : T.line}`, borderRadius: 999, padding: "4px 9px", cursor: "pointer" }}>{u0}</span>
              ))}
              <Stepper v={+yAlc} set={setYAlc} step={1} min={0} />
            </div>
            <div style={{ marginTop: 10 }}>
              <Btn full tone="jade" onClick={() => { if (yCal === "" && yPro === "" && yStp === "") return; const ns = JSON.parse(JSON.stringify(s)); ns.dailyLogs[y8] = { cal: yCal === "" ? null : +yCal, pro: yPro === "" ? null : +yPro, steps: yStp === "" ? null : +yStp, sodium: ySod, alc: +yAlc || 0 }; ns.feed.unshift(isAmend ? { d: y8, t: `DAY AMENDED — ${fmtShort(y8)}: ${(s.dailyLogs[y8] || {}).cal ?? "—"}→${yCal || "—"} cal · ${(s.dailyLogs[y8] || {}).pro ?? "—"}→${yPro || "—"} g`, how: "athlete corrected the record after close — late bites logged where they belong" } : { d: y8, t: `BOOKS CLOSED LATE — ${fmtShort(y8)} logged after midnight`, how: "the repair door on NOW — same numbers, honest timestamp" }); setAmendY(false); setS(ns); save(ns); }}>{isAmend ? `Refile ${fmtShort(y8)} — corrected` : `Close ${fmtShort(y8)} — file it`}</Btn>
            </div>
          </Card>
        );
      })()}

      <SecRule>TODAY'S LOGS · what you file</SecRule>
      {dl.cal != null && !dayEdit ? (
        <Card style={{ padding: 12 }} accent={T.jade}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: mono, fontSize: 11.5, color: T.jade }}>✓ day closed · {Math.round(dl.cal)} cal · {Math.round(dl.pro)} pro · {dl.steps != null ? (dl.steps / 1000).toFixed(1) + "k" : "—"}</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              {(() => { const est = ((s.dayCtx || {})[tISO] || {}).est; return (
                <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.dayCtx = ns.dayCtx || {}; if (est) delete ns.dayCtx[tISO]; else ns.dayCtx[tISO] = { est: true, note: "declared estimate day" }; setS(ns); save(ns); }}
                  style={{ fontFamily: mono, fontSize: 8.5, color: est ? T.brass : T.dim, border: `1px solid ${est ? T.brass : T.line}`, borderRadius: 999, padding: "3px 8px", cursor: "pointer" }}>{est ? "⌁ EST ✓" : "⌁ est?"}</span>
              ); })()}
              <button onClick={() => setDayEdit(true)} style={{ fontFamily: mono, fontSize: 9, color: T.dim, background: "none", border: "none" }}>edit</button>
            </span>
          </div>
        </Card>
      ) : (
      <Card accent={new Date().getHours() >= 17 && !(dl && dl.cal != null) ? T.brass : undefined}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Eyebrow c={((s.dayCtx || {})[tISO] || {}).est ? T.brass : new Date().getHours() >= 17 && !(dl && dl.cal != null) ? T.brass : undefined}>{((s.dayCtx || {})[tISO] || {}).est ? "ESTIMATE DAY — ROUGH NUMBERS COUNT" : new Date().getHours() >= 17 && !(dl && dl.cal != null) ? "TONIGHT — CLOSE THE DAY" : "TODAY'S NUMBERS — LOG THESE TONIGHT"}</Eyebrow>
          {(() => { const est = ((s.dayCtx || {})[tISO] || {}).est; return (
            <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.dayCtx = ns.dayCtx || {}; if (est) delete ns.dayCtx[tISO]; else ns.dayCtx[tISO] = { est: true, note: "declared estimate day" }; setS(ns); save(ns); }}
              style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.05em", color: est ? T.brass : T.dim, border: `1px solid ${est ? T.brass : T.line}`, borderRadius: 999, padding: "4px 9px", cursor: "pointer" }}>
              {est ? "⌁ ESTIMATE DAY ✓" : "estimates today?"}
            </span>
          ); })()}
        </div>
        {ev && ev.d === tISO && !((s.dayCtx || {})[tISO] || {}).est && (
          <div style={{ fontFamily: mono, fontSize: 10, color: T.brass, marginTop: 8 }}>today is {ev.t} — days like this usually get the estimates chip (top right of this card)</div>
        )}
        {((s.dayCtx || {})[tISO] || {}).est && (
          <div style={{ fontFamily: body, fontSize: 11, color: T.steel, marginTop: 8, lineHeight: 1.55 }}>The method: anchor protein first — four palm-sized servings still lands near {proteinTarget(s).g}. Then calories as the midpoint of your honest bracket: "definitely over 2,300, definitely under 2,700" writes 2,500. Units the same way — "somewhere 10–14" writes 12. One entry after the event, never the optimistic edge. A labeled estimate protects the trend; false precision poisons it.</div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {[
            /* All three numbers now come from the same place: his own record.
               Calories from measured maintenance, protein from measured lean
               mass, steps from the window that measured the maintenance. The
               protein and step lines used to be constants sitting next to a
               derived calorie number, which made the card look like it knew
               three things when it knew one. */
            { l: `CAL ${calT[0]}–${calT[1]}${!isRefeed && !ctT.gated ? " · from your measured maintenance" : ""}`, v: cal, set: setCal },
            { l: (() => { const p9 = proteinTarget(s); return p9.straddles ? `PRO ${p9.g} · anywhere ${p9.lo}–${p9.hi} counts` : `PRO ${p9.g} · ${p9.perKg} g per kg lean`; })(), v: pro, set: setPro },
            { l: (() => { const st9 = stepTarget(s); return st9.gated ? `STEPS ${ph.steps}` : `STEPS ${(st9.lo / 1000).toFixed(1)}–${(st9.hi / 1000).toFixed(1)}k · what your maintenance was measured at`; })(), v: stp, set: setStp },
          ].map((f, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.1em", marginBottom: 4, textTransform: "uppercase" }}>{f.l}</div>
              <input inputMode="decimal" value={f.v} onChange={(e) => f.set(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 15, padding: "8px 8px", outline: "none" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>SODIUM</span>
          {["low", "med", "high"].map((sv) => (
            <span key={sv} onClick={() => { setSod9(sv); if (dl) { const ns = JSON.parse(JSON.stringify(s)); ns.dailyLogs[tISO].sodium = sv; setS(ns); save(ns); } }}
              style={{ fontFamily: mono, fontSize: 9.5, color: sod9 === sv ? T.jade : T.dim, border: `1px solid ${sod9 === sv ? T.jade : T.line}`, borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}>{sv}</span>
          ))}
          <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginLeft: 8 }}>ALCOHOL{((s.dayCtx || {})[tISO] || {}).est ? " ~ est" : ""}</span>
          {[2, 4, 6, 8, 10, 12].map((u0) => (
            <span key={u0} onClick={() => { setAlc9(u0); if (dl) { const ns = JSON.parse(JSON.stringify(s)); ns.dailyLogs[tISO].alc = u0; setS(ns); save(ns); } }}
              style={{ fontFamily: mono, fontSize: 9.5, color: +alc9 === u0 ? T.jade : T.dim, border: `1px solid ${+alc9 === u0 ? T.jade : T.line}`, borderRadius: 999, padding: "4px 9px", cursor: "pointer" }}>{u0}</span>
          ))}
          <Stepper v={+alc9} set={(v0) => { setAlc9(v0); if (dl) { const ns = JSON.parse(JSON.stringify(s)); ns.dailyLogs[tISO].alc = v0; setS(ns); save(ns); } }} step={1} min={0} />
          <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>units</span>
        </div>
        {(() => { const yd9 = s.dailyLogs[isoOf(new Date(todayStart().getTime() - DAY))]; if (!yd9) return null; return <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 6 }}>yest: {yd9.cal ?? "—"} · {yd9.pro ?? "—"} · {yd9.steps != null ? (yd9.steps / 1000).toFixed(1) + "k" : "—"} · {(yd9.alc ?? 0)}u <span onClick={() => { setYCal(yd9.cal != null ? String(yd9.cal) : ""); setYPro(yd9.pro != null ? String(yd9.pro) : ""); setYStp(yd9.steps != null ? String(yd9.steps) : ""); setYSod(yd9.sodium || null); setYAlc(yd9.alc || 0); setAmendY(true); }} style={{ cursor: "pointer", color: T.steel }}>✎ amend</span></div>; })()}
        {s.fixWindow && (
          <div style={{ marginTop: 10, fontFamily: mono, fontSize: 11, color: T.brass }}><Term k="fixwindow" c={T.brass}>FIX WINDOW OPEN</Term> — hit protein today and yesterday's miss counts as a save, not a break. Nothing resets.</div>
        )}
        <div style={{ marginTop: 10 }}><Btn tone="jade" full onClick={() => { const h9 = new Date().getHours(); if (h9 < 4) { const y8 = isoOf(new Date(todayStart().getTime() - DAY)); if (window.confirm("It's after midnight — should these numbers file as YESTERDAY (" + fmtShort(y8) + ")?\n\nOK = yesterday, the day they belong to\nCancel = today")) { const ns = JSON.parse(JSON.stringify(s)); ns.dailyLogs[y8] = { cal: cal === "" ? null : +cal, pro: pro === "" ? null : +pro, steps: stp === "" ? null : +stp, sodium: sod9, alc: +alc9 || 0 }; ns.feed.unshift({ d: y8, t: "FILED TO YESTERDAY — " + fmtShort(y8) + " logged after midnight", how: "the midnight intercept asked; the athlete chose the day it belonged to" }); setS(ns); save(ns); setDayEdit(false); return; } } saveDaily(); setDayEdit(false); }}>Log today</Btn></div>
        {dl && <div style={{ textAlign: "center", marginTop: 6 }}><span onClick={() => { if (window.confirm("Clear today's saved numbers? Use this if last night's log landed on the wrong day. Tonight's real numbers will close the day fresh.")) { const ns = JSON.parse(JSON.stringify(s)); delete ns.dailyLogs[tISO]; ns.feed.unshift({ d: tISO, t: "TODAY'S LOG CLEARED — filed in error after midnight", how: "the day reopens; tonight closes it honestly" }); setS(ns); save(ns); setCal(""); setPro(""); setStp(""); setSod9(null); setAlc9(0); } }} style={{ fontFamily: mono, fontSize: 9, color: T.dim, cursor: "pointer" }}>logged by mistake? clear today ✗</span></div>}

        <More deep="Protein is a FLOOR, not a bullseye. This card used to say the opposite — that the number was proximity and chronic overshoot was drift too — and the code behind it counted any day more than 10 g either side as a miss. Nothing supports the upper half of that: the deficit meta-regression finds a lower threshold where lean-mass loss starts rising and no upper one anywhere near this range. Eating over it costs you carbohydrate inside a fixed calorie budget, which is worth knowing and is not a failure. Calories live in a band, not a point. A shortfall opens a 24-hour fix window, and closing it EXTENDS the standard instead of resetting it — recovery speed is the metric, never an unbroken chain."
          forYou={(() => { const p9 = proteinTarget(s); return s.fixWindow
            ? `The fix window is OPEN — clearing ${p9.lo} g today closes it and the record extends.`
            : p9.straddles
              ? [`Your floor is ${p9.lo} g and the lean-subgroup number is ${p9.hi} g. Body fat reads ${p9.bf}% with a real spread of ${p9.bfLo}–${p9.bfHi}%, and the ${LEAN_SUBGROUP_BF}% line that separates those two targets sits inside it — so the honest answer is the range, and ${p9.g} is its middle.`,
                 `Both numbers come off your ${p9.ffmKg} kg of lean mass. Neither was authored. If your lean mass moves, they move.`,
                 "Log once, done — the app rewards the logging, never the checking."]
              : "Standard intact. Log once, done — the app rewards the logging, never the checking."; })()} />
      </Card>

)}

      {(() => {
        const tc0 = todayCaff(s);
        const e0 = (s.caffLog || []).find((x) => x.d === tISO);
        const lo0 = lightsOutT(s);
        if (e0) {
          const tl0 = e0.mg > 0 ? caffAt(e0.mg, parseHM(e0.at), lo0.mins / 60) : 0;
          return (
            <Card style={{ padding: "9px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: T.jade }}>✓ caffeine · {e0.mg === 0 ? "none today" : `${e0.mg} mg @ ${fmt12(e0.at)}`}{e0.mg > 0 ? ` · ~${tl0} mg at ${fmt12(lo0.t)}` : ""}</span>
                <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.caffLog = (ns.caffLog || []).filter((x) => x.d !== tISO); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 9, color: T.dim, cursor: "pointer" }}>undo</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                <span style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>tonight's lights-out:</span>
                <input type="time" value={lo0.t} onChange={(e5) => { const ns = JSON.parse(JSON.stringify(s)); ns.dayCtx = ns.dayCtx || {}; ns.dayCtx[tISO] = { ...(ns.dayCtx[tISO] || {}), lightsOut: e5.target.value }; setS(ns); save(ns); }} style={{ background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 11, padding: "3px 6px", outline: "none" }} />
                <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>{lo0.override ? "set by you — tail math follows it" : "default bearing — tap to set tonight's real one"}</span>
              </div>
            </Card>
          );
        }
        return (
          <Card style={{ padding: "10px 14px" }}>
            <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, letterSpacing: "0.06em" }}>CAFFEINE — WHAT DID YOU ACTUALLY TAKE TODAY?</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
              {[0, 100, 175, 200, 350, 400].map((m0) => (
                <span key={m0} onClick={() => setNCMg(m0)} style={{ fontFamily: mono, fontSize: 10, color: nCMg === m0 ? T.jade : T.dim, border: `1px solid ${nCMg === m0 ? T.jade : T.line}`, borderRadius: 999, padding: "5px 10px", cursor: "pointer" }}>{m0 === 0 ? "none ✓" : m0}</span>
              ))}
              <input type="time" value={nCAt} onChange={(e3) => setNCAt(e3.target.value)} style={{ width: 60, background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 12, padding: "6px 7px", outline: "none", opacity: nCMg === 0 ? 0.4 : 1 }} />
              <Btn small tone="jade" onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.caffLog = [...(ns.caffLog || []).filter((x) => x.d !== tISO), { d: tISO, mg: nCMg, at: nCMg === 0 ? "—" : nCAt }]; ns.feed.unshift({ d: tISO, t: nCMg === 0 ? "CAFFEINE — NONE TODAY" : `CAFFEINE — ${nCMg} mg at ${fmt12(nCAt)}`, how: "logged on NOW — the tail math runs on this" }); setS(ns); save(ns); }}>Log</Btn>
            </div>
          </Card>
        );
      })()}

      {(() => {
        const me0 = todayMeds(s);
        if (me0) {
          return (
            <Card style={{ padding: "9px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: T.jade }}>✓ meds · {me0.taken ? `taken @ ${fmt12(me0.at)}` : "none today"}</span>
                <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.medsLog = (ns.medsLog || []).filter((x) => x.d !== tISO); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 9, color: T.dim, cursor: "pointer" }}>undo</span>
              </div>
            </Card>
          );
        }
        return (
          <Card style={{ padding: "10px 14px" }}>
            <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, letterSpacing: "0.06em" }}>MEDS — TAKEN TODAY? (adherence bookkeeping, nothing more)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
              <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.medsLog = [...(ns.medsLog || []).filter((x) => x.d !== tISO), { d: tISO, taken: false, at: "—" }]; ns.feed.unshift({ d: tISO, t: "MEDS — NONE TODAY", how: "logged — the analysts read appetite, pulse, and effort against this" }); setS(ns); save(ns); }}
                style={{ fontFamily: mono, fontSize: 10, color: T.dim, border: `1px solid ${T.line}`, borderRadius: 999, padding: "5px 10px", cursor: "pointer" }}>none today ✓</span>
              <input type="time" value={mAt} onChange={(e6) => setMAt(e6.target.value)} style={{ background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 12, padding: "6px 7px", outline: "none" }} />
              <Btn small tone="jade" onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.medsLog = [...(ns.medsLog || []).filter((x) => x.d !== tISO), { d: tISO, taken: true, at: mAt }]; ns.feed.unshift({ d: tISO, t: `MEDS — TAKEN AT ${fmt12(mAt)}`, how: "logged — the biggest confound in the system now has a clock" }); setS(ns); save(ns); }}>Log</Btn>
            </div>
          </Card>
        );
      })()}

{(() => {
        const todayP = (s.pulse || []).find((x) => x.d === tISO);
        return (
          <Card style={{ padding: 11 }}>
            {todayP ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: T.jade }}>✓ morning pulse {todayP.bpm} logged</span>
                <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.pulse = ns.pulse.filter((x) => x.d !== tISO); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, cursor: "pointer" }}>undo</span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, letterSpacing: "0.08em" }}>MORNING PULSE<div style={{ fontSize: 8 }}>optional · 5 s · feeds the lab</div></div>
                <Stepper v={pulseIn} set={setPulseIn} step={1} min={35} />
                <Btn small tone="jade" onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.pulse = [...(ns.pulse || []), { d: tISO, bpm: pulseIn }]; setS(ns); save(ns); }}>Log</Btn>
              </div>
            )}
            {(() => { const todayT = (s.temp || []).find((x) => x.d === tISO); return todayT ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, borderTop: `1px solid ${T.line}`, paddingTop: 8 }}>
                <span style={{ fontFamily: mono, fontSize: 11, color: T.jade }}>✓ temperature {todayT.f}°F logged</span>
                <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.temp = ns.temp.filter((x) => x.d !== tISO); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, cursor: "pointer" }}>undo</span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 8, borderTop: `1px solid ${T.line}`, paddingTop: 8 }}>
                <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, letterSpacing: "0.08em" }}>TEMPERATURE °F<div style={{ fontSize: 8 }}>optional · 15 s · the furnace</div></div>
                <Stepper v={tempIn} set={setTempIn} step={0.1} min={94} />
                <Btn small tone="jade" onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.temp = [...(ns.temp || []), { d: tISO, f: +tempIn.toFixed(1) }]; setS(ns); save(ns); }}>Log</Btn>
              </div>
            ); })()}
          </Card>
        );
      })()}



      {(() => {
        const lastWaist = s.waist[s.waist.length - 1];
        const waistDue = !lastWaist || Math.round((mk(tISO) - mk(lastWaist.d)) / DAY) >= 7;
        const lastP = s.photos[s.photos.length - 1];
        const photoDue = !lastP || Math.round((mk(tISO) - mk(lastP.d)) / DAY) >= 7;
        return (
          <>
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
                    }}>{lastWaist ? "Log waist" : "Log baseline"}</Btn></div>
                  </div>
                )}
                {photoDue && (
                  <div style={{ marginTop: waistDue ? 12 : 10 }}>
                    <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginBottom: 6 }}>same light · same spots · fasted</div>
                    <Btn full small onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.photos.push({ d: tISO }); setS(ns); save(ns); }}>Mark photos done</Btn>
                  </div>
                )}
              </Card>
            )}
          </>
        );
      })()}

      {(() => { const fl = filingsFor(new Date().getDay(), new Date().getDate()); if (!fl.length) return null; return (
        <Card style={{ padding: "9px 14px" }}>
          {fl.map((f9, i9) => <div key={i9} style={{ fontFamily: mono, fontSize: 9.5, color: T.steel, lineHeight: 1.7 }}>🗎 {f9}</div>)}
        </Card>
      ); })()}

      {/* ---------- everything below here is READING, not doing ----------
          Collapsed by default and it stays where he left it. Nothing is
          removed — the whole room is one tap away, in the same place, every
          time. Adaptive promotion was considered and rejected: an interface
          that rearranges itself measured ~8% slower than a static one
          (Findlater & McGrenere, CHI 2004) because it destroys the spatial
          memory that makes a daily app fast. */}
      <Card style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => setRestOpen(!restOpen)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: T.chalk, letterSpacing: "0.06em" }}>
            {restOpen ? "▾ THE REST OF THE DAY" : "▸ THE REST OF THE DAY"}
            <span style={{ color: T.dim }}> — session plan, recovery, the big picture</span>
          </div>
          <span style={{ fontFamily: mono, fontSize: 9, color: T.dim, flexShrink: 0 }}>{restOpen ? "hide" : "open"}</span>
        </div>
      </Card>

      {restOpen && (<>
      <SecRule>THE ROOM · plan and rules</SecRule>


      {sess && (
        <Card style={{ padding: "11px 14px", borderLeft: `3px solid ${T.orange}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: mono, fontSize: 10, color: T.orange, letterSpacing: "0.08em" }}>{heroToday ? "TODAY" : daysUntil(nextISO) === 1 ? "TOMORROW" : "NEXT"} · {fmtShort(nextISO)} · {sess.name.toUpperCase()}</div>
              <div style={{ fontFamily: mono, fontSize: 11.5, color: T.chalk, marginTop: 4 }}>{sess.ex.length} lifts · {sess.structural.toLowerCase()} · full plan in TRAIN</div>
            </div>
            {/* Was "records live / records pend" — the retired clean-sleep gate,
                printed on the surface he opens most. Records were never gated on
                sleep once liftCall stopped holding; see SLEEP_HOLD_NOTE. What
                belongs here is the thing that actually decides the session. */}
            <span style={{ fontFamily: mono, fontSize: 9.5, color: T.steel, flexShrink: 0, textAlign: "right" }}>every set counts</span>
          </div>
        </Card>
      )}
      {/* The refeed card is gone with the refeed. It claimed the weekly
          high-carb day bought glycogen, next-day performance and a hormonal
          breather; the only matched-energy RCT in trained people was overturned
          on reanalysis, and no isocaloric carbohydrate study has ever improved
          strength or hypertrophy. Past refeeds stay on the record because they
          happened. Nothing on this page prescribes another one. */}



      <RndCard />

      {[0, 1].includes(new Date().getDay()) && (() => { const wr = weekReview(s); return (
        <Card accent={T.jade}>
          <Eyebrow c={T.jade}>THE WEEK IN REVIEW — WRITTEN BY YOUR DATA · {wr.window}</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 13.5, color: T.chalk, marginTop: 6, lineHeight: 1.5 }}>{wr.verdict}</div>
          {wr.lines.map((l, i) => (
            <div key={i} style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: i ? 4 : 8 }}>{l}</div>
          ))}
        </Card>
      ); })()}

      {/* the crossover countdown is gone from here too — see COUNTDOWN_NOTE below */}
      <Section title="The Big Picture" meta={(() => { const rec = recoveryIndex(s); const cr9 = currentRate(s); return `${rec.flags.length}/${rec.watched} signals up${cr9.measured ? ` · ${cr9.scale} lb/wk` : ""}`; })()}>
      {(() => {
        const rec = recoveryIndex(s);
        const c = rec.band === "GREEN" ? T.jade : rec.band === "WATCH" ? T.brass : T.brass;
        return (
          <Card accent={c}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Eyebrow>RECOVERY — HOW BEAT-UP AM I?</Eyebrow>
              <span style={{ fontFamily: mono, fontSize: 12, color: c }}>{rec.flags.length} of {rec.watched} signals up</span>
            </div>
            <div style={{ margin: "8px 0 4px" }}><Bar pct={rec.score} c={c} /></div>
            {rec.flags.length ? rec.flags.map((f, i) => (
              <div key={f.k} style={{ marginTop: i ? 7 : 4 }}>
                <div style={{ fontFamily: mono, fontSize: 10, color: T.chalk, lineHeight: 1.45 }}>· {f.receipt}</div>
                <div style={{ fontFamily: body, fontSize: 11, color: T.dim, lineHeight: 1.45, paddingLeft: 10 }}>{cap(f.fix)}.</div>
              </div>
            )) : <div style={{ fontFamily: mono, fontSize: 10, color: T.steel }}>no drag on the system — earns count, send it</div>}
            {rec.excludedDips > 0 && <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 7, lineHeight: 1.5 }}>not counted: {rec.excludedDips} rep dip{rec.excludedDips > 1 ? "s" : ""} on short-sleep or rushed sessions — those days lower reps by themselves</div>}
            <More c={c} deep="Six signals, each watched separately and each gated on its own evidence: sleep reset progress; the five-night average (only once five nights exist); lifts the governor is holding; openers grinding at 0 RIR (only once four are on file); joint flags over 14 days; and rep dips across your last two sessions — counted ONLY on days that were a fair test, because a short-sleep or rushed session lowers reps by itself and the sleep signal already carries it. What is deliberately NOT here is a single readiness number to act on. The bar is a rough visual, nothing more: the charter says named inputs with receipts, never a composite score, and a score would hide which input actually moved. Three or more signals arms the hold-structure rule — loads stay put, reps still progress, and nothing auto-changes."
              forYou={rec.lever ? `Start with one thing: ${rec.lever.receipt}. ${cap(rec.lever.fix)}.` : "Nothing dragging. The rarest state in a deficit — protect it."} />
          </Card>
        );
      })()}
<Card>
        <Eyebrow>CLOSEST UNLOCKS · THE QUEUE REFILLS ITSELF</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
          {nextUnlocks.map((u) => (
            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div>
                <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 16, color: T.chalk, textTransform: "uppercase" }}>{u.t}</div>
                <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel }}>{plainify(u.gate)}</div>
              </div>
              <Stamp st={u.state} />
            </div>
          ))}
        </div>
      </Card>
{/* ---------- COUNTDOWN_NOTE — the deadline that does not exist ----------
    This was a CROSSOVER card: an Aug 28 date, a days-remaining counter, a
    percentage-complete bar, and a "~158.5 at ~12%" marquee target. GOALS.md is
    explicit — no competition or show date is set, and countdowns or urgency
    mechanics that assume one must not be built. A progress bar filling toward a
    date he never picked manufactures a deadline, and a deadline is the standard
    way a cut turns into a rushed one: the deficit gets pushed to make the date,
    and deficit MAGNITUDE is the variable most tightly linked to lean-mass loss
    in trained people. The urgency mechanic and the goal are in direct conflict.

    What survives is the part that is real: where the current measured rate
    lands him, with the honest interval around it, and no clock. */}
<Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Eyebrow c={T.chalk}>WHERE THIS PACE LANDS YOU</Eyebrow>
          <span style={{ fontFamily: mono, fontSize: 11, color: T.steel }}>no date set</span>
        </div>
        {(() => {
          const cr = currentRate(s); const bfN = bfEst(s);
          const wks = 4;
          const proj = +(s.trend - cr.scale * wks).toFixed(1);
          return (
            <>
              <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 6, lineHeight: 1.5 }}>
                {cr.measured
                  ? `At the ${cr.scale} lb/wk you are actually moving, four more weeks puts you near ${proj} lb. There is no date on this — you stop when the body-fat read and the mirror say stop, not when a calendar does.`
                  : `Two clean weekly snapshots and this reads off your measured rate instead of an estimate.`}
              </div>
              <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, marginTop: 7 }}>body fat {bfN.pct}% · honest range {bfN.lo}–{bfN.hi}%</div>
            </>
          );
        })()}
        <More c={T.chalk} deep="There is no show, no weigh-in and no date. That is a feature: the single best predictor of losing lean mass in a deficit is the size of the deficit, and the thing that makes people run a deficit too big is a date they are trying to make. Without one, the only reasons to go faster are impatience and boredom — and both of those cost muscle. The rate band, the calorie floor and the protein target are the guard rails; the finish line is a body-composition read, not a day on the calendar."
          forYou={(() => { const cr = currentRate(s); const bfN = bfEst(s); return [
            cr.measured ? `Measured pace ${cr.scale} lb/wk on the scale, about ${cr.fat} lb/wk of that fat-equivalent.` : "Pace still settling — two clean weekly snapshots and it goes fully measured.",
            `Body fat reads ${bfN.pct}%, and the honest interval is ${bfN.lo}–${bfN.hi}% — that width is real, not decoration, and it narrows as the trend lengthens.`,
            "The cone on the LAB tab shows the same thing across time.",
          ]; })()} />
      </Card>
      </Section>

      <Card style={{ padding: "10px 14px" }}>
        <div onClick={() => setLawsOpen(true)} style={{ cursor: "pointer", fontFamily: mono, fontSize: 9.5, color: T.dim }}>⚖ THE HOUSE LAWS — the rules this app runs on · tap to read ▸</div>
      </Card>

      </>)}

      <div style={{ textAlign: "center", fontFamily: mono, fontSize: 8, color: T.dim, opacity: 0.55, padding: "10px 0 2px" }}>PREP LEDGER · v{APP_V}</div>

    </div>
  );
}

function LogTab({ s, setS, save, slp }) {
  const tISO = isoOf(todayStart());
  const nextISO = nextTrainingISO(s);
  const [dateSel, setDateSel] = useState(dayType(tISO) === "U" || dayType(tISO) === "L" ? tISO : nextISO);
  const sess = dateSel && !s.sessionLog[dateSel] ? genSession(s, dateSel, slp) : null;
  const logged = dateSel && s.sessionLog[dateSel];
  const [reps, setReps] = useState({});
  const [rir, setRir] = useState({});
  const [note, setNote] = useState("");
  const [dbOpen, setDbOpen] = useState(false);
  const [nig, setNig] = useState([]);
  const [reorder, setReorder] = useState(false);
  const [showSetup, setShowSetup] = useState({});
  const [skipped, setSkipped] = useState({});
  const [callOpen, setCallOpen] = useState(null);
  const [wEdit, setWEdit] = useState(null);
  const [wVal, setWVal] = useState(180);
  const [rungEdit, setRungEdit] = useState(null);
  /* terminal-set RIR — the set the taper programs to failure. Separate from the
     opener, which answers a different question (is the load still honest). */
  const [rirEnd, setRirEnd] = useState({});
  const [pace, setPace] = useState(null);
  const draftKey = "prep-ledger-draft-" + dateSel;
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(draftKey) || "null");
      setReps(d && d.reps ? d.reps : {}); setRir(d && d.rir ? d.rir : {}); setRirEnd(d && d.rirEnd ? d.rirEnd : {}); setSkipped(d && d.skipped ? d.skipped : {}); setNote(d && d.note ? d.note : ""); setNig(d && d.nig ? d.nig : []); setPace(d && d.pace ? d.pace : null);
    } catch (e) {}
  }, [dateSel]);
  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify({ reps, rir, rirEnd, skipped, note, nig, pace })); } catch (e) {}
  }, [reps, rir, rirEnd, skipped, note, nig, pace, draftKey]);
  const [recap, setRecap] = useState(null);
  const [boosted, setBoosted] = useState(false);
  const hackPending = s.queue.some((q) => q.id === "q_hack3" && !q.done);

  const options = [];
  for (let i = 0; i <= 10 && options.length < 4; i++) {
    const d = isoOf(new Date(todayStart().getTime() + i * DAY));
    const t2 = dayType(d);
    if (t2 === "U" || t2 === "L") options.push(d);
  }

  if (!sess && !logged) return (
    <Card><Eyebrow>REST DAY</Eyebrow>
      <div style={{ fontFamily: body, color: T.steel, fontSize: 13, marginTop: 6 }}>Next session {nextISO ? fmtShort(nextISO) : "—"} — your numbers will be waiting, built from last time.</div></Card>
  );

  const getReps = (ex) => reps[ex.id] ?? ex.tgt.slice();
  const setRep = (ex, i, v) => setReps({ ...reps, [ex.id]: getReps(ex).map((r, j) => (j === i ? v : r)) });

  const [gym, setGym] = useState(false);
  const complete = () => {
    const entries = sess.ex.filter((ex) => !skipped[ex.id]).map((ex) => ({ id: ex.id, n: ex.n, w: ex.w, tgt: ex.tgt, reps: getReps(ex), isDebutNow: ex.isDebutNow, rir: rir[ex.id] ?? null, rirEnd: rirEnd[ex.id] ?? null }));
    const skippedList = sess.ex.filter((ex) => skipped[ex.id]).map((ex) => ({ id: ex.id }));
    const { s: ns, lines } = completeSession(s, dateSel, entries, slp, { note: note.trim(), niggles: nig, skipped: skippedList, pace });
    setS(ns); save(ns); setRecap(lines); setBoosted(false); setReps({}); setRir({}); setRirEnd({}); setNote(""); setNig([]); setSkipped({}); setPace(null); try { localStorage.removeItem(draftKey); } catch (e) {}
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {gym && sess && <GymMode s={s} setS={setS} save={save} slp={slp} sess={sess} dateSel={dateSel} onClose={() => setGym(false)} />}
      {sess && !s.sessionLog[dateSel] && (
        <Btn full tone="jade" onClick={() => setGym(true)}>▶ GYM MODE — one lift at a time, timers on</Btn>
      )}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", touchAction: "pan-x", paddingBottom: 2 }}>
        {dateSel && !options.includes(dateSel) && (
          <button style={{ flex: "1 0 auto", minWidth: 118, fontFamily: mono, fontSize: TS.label, letterSpacing: "0.05em", padding: "10px 8px", borderRadius: 7, border: `1px solid ${T.jade}`, background: T.plate2, color: T.jade }}>
            ✓ {fmtShort(dateSel)} · RECEIPT
          </button>
        )}
        {logged && !options.includes(dateSel) && (
          <button style={{ flex: "1 0 auto", minWidth: 118, fontFamily: mono, fontSize: TS.label, letterSpacing: "0.05em", padding: "10px 8px", borderRadius: 7, border: `1px solid ${T.jade}`, background: T.plate2, color: T.jade }}>✓ {fmtShort(dateSel)} · RECEIPT</button>
        )}
        {options.map((d) => (
          <button key={d} onClick={() => { setDateSel(d); setReps({}); setRir({}); setRirEnd({}); setPace(null); setNote(""); setNig([]); setSkipped({}); }} style={{ flex: "1 0 auto", minWidth: 118, fontFamily: mono, fontSize: TS.label, letterSpacing: "0.05em", padding: "10px 8px", borderRadius: 7, border: `1px solid ${dateSel === d ? T.chalk : T.line}`, background: dateSel === d ? T.plate2 : "transparent", color: dateSel === d ? T.chalk : s.sessionLog[d] ? T.jade : T.steel }}>
            {s.sessionLog[d] ? "✓ " : ""}
            {fmtShort(d)} · {dayType(d) === "U" ? "UPPER" : "LOWER"}
          </button>
        ))}
      </div>

      {logged ? (() => {
        const done = s.sessionLog[dateSel];
        const nd = (() => { for (let i = 1; i <= 7; i++) { const d2 = isoOf(new Date(mk(dateSel).getTime() + i * DAY)); if (dayType(d2) === dayType(dateSel)) return d2; } return null; })();
        const preview = nd ? genSession(s, nd, slp) : null;
        const wins = s.feed.filter((f) => f.d === dateSel && /OWNED|DEBUT|EARNED|RECLAIM|COMPLETE|4TH SET|UNI/.test(f.t)).slice(0, 4);
        return (
          <>
            <Card accent={T.jade}>
              <Eyebrow c={T.jade}>SESSION LOGGED · {fmtShort(dateSel)}</Eyebrow>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 7 }}>
                {done.entries.map((e, i) => { const ex = exById(s, e.id); return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontFamily: mono, fontSize: 11, alignItems: "center" }}>
                    <span style={{ color: T.chalk }}>{ex ? ex.n : e.id}</span>
                    <span style={{ color: T.steel, display: "flex", gap: 8, alignItems: "center" }}>{e.w != null ? e.w + " × " : ""}{(e.reps || []).join(",")}{e.rir != null ? " · RIR " + e.rir : ""}
                      <span onClick={() => { if (!window.confirm("Mark " + (ex ? ex.n : e.id) + " as skipped? Its reps leave the record.")) return; const ns = JSON.parse(JSON.stringify(s)); const rec = ns.sessionLog[dateSel]; rec.skipped = [...(rec.skipped || []), { id: e.id }]; rec.entries = rec.entries.filter((x2) => x2.id !== e.id); ns.feed.unshift({ d: isoOf(todayStart()), t: "RECORD AMENDED — " + (ex ? ex.n : e.id) + " marked skipped on " + fmtShort(dateSel), how: "honesty over history — phantom reps removed from every instrument" }); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, border: `1px solid ${T.line}`, borderRadius: 999, padding: "2px 7px", cursor: "pointer" }}>✕</span>
                    </span>
                  </div>
                ); })}
                {(done.skipped || []).map((k, i) => { const ex = exById(s, k.id); return (
                  <div key={"sk" + i} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontFamily: mono, fontSize: 11 }}>
                    <span style={{ color: T.dim, textDecoration: "line-through" }}>{ex ? ex.n : k.id}</span>
                    <span style={{ color: T.brass, fontSize: 9.5 }}>skipped — on record</span>
                  </div>
                ); })}
              </div>
              {done.pace && (
                <div style={{ fontFamily: mono, fontSize: 9.5, color: done.pace === PACE.rushed ? T.brass : T.jade, marginTop: 8 }}>
                  {done.pace === PACE.rushed ? <>◆ <Term k="pace" c={T.brass}>RUSHED</Term> — logged; reps count, stalls don't</> : "◆ FULL REST — a clean read on this volume"}
                </div>
              )}
              {done.note && <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 8 }}>{done.note}</div>}
              {wins.length > 0 && (
                <div style={{ marginTop: 9, borderTop: `1px solid ${T.line}`, paddingTop: 8 }}>
                  {wins.map((w2, i) => <div key={i} style={{ fontFamily: mono, fontSize: 9.5, color: T.jade, marginTop: i ? 3 : 0 }}>◆ {w2.t.toLowerCase()}</div>)}
                </div>
              )}
              <div onClick={() => setDbOpen(!dbOpen)} style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 8, letterSpacing: "0.1em", cursor: "pointer" }}>{dbOpen ? "▾ CLOSE DEBRIEF" : "▸ FULL DEBRIEF — PER-LIFT DEPTH"}</div>
              {dbOpen && (() => { const db = sessionDebrief(s, dateSel); return db && (
                <div style={{ marginTop: 8, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
                  {db.summary.map((l, i) => <div key={i} style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: i ? 4 : 0, lineHeight: 1.5 }}>{l}</div>)}
                  {db.lifts.map((L, i) => (
                    <div key={i} style={{ marginTop: 10 }}>
                      <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 13.5, textTransform: "uppercase", color: T.chalk }}>{L.n}</div>
                      {L.lines.map((l, j) => <div key={j} style={{ fontFamily: mono, fontSize: 10, color: T.steel, marginTop: 3, lineHeight: 1.5 }}>{l}</div>)}
                    </div>
                  ))}
                  <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 10 }}>recomputed live — old sessions get smarter as the engine does</div>
                </div>
              ); })()}
            </Card>
            {preview && (
              <Card>
                <Eyebrow>NEXT {dayType(dateSel) === "U" ? "UPPER" : "LOWER"} · {fmtShort(nd)} — TARGETS ALREADY SET</Eyebrow>
                {(() => { const t5 = dayType(nd); for (let k5 = 1; k5 < 10; k5++) { const dd = isoOf(new Date(mk(nd).getTime() - k5 * DAY)); if (dd <= isoOf(todayStart())) break; if (dayType(dd) === t5 && !s.sessionLog[dd]) return <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 3 }}>provisional — these re-key the moment {fmtShort(dd)} is logged</div>; } return null; })()}
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                  {(preview.ex || []).map((b, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontFamily: mono, fontSize: 10.5 }}>
                      <span style={{ color: T.steel }}>{b.n}</span>
                      <span style={{ color: T.dim }}>{b.w} · tgt {(b.tgt || []).join(",")}</span>
                    </div>
                  ))}
                </div>
                {preview.structural && <div style={{ fontFamily: mono, fontSize: 9.5, color: T.orange, marginTop: 8 }}>structural: {preview.structural}</div>}
                <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 8 }}>these numbers belong to {fmtShort(nd)} — today's receipt above is closed</div>
              </Card>
            )}
          </>
        );
      })() : (<>

      <Card accent={T.orange}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <Eyebrow c={T.orange}>TODAY'S ONE <Term k="structural" c={T.orange}>CHANGE</Term> — PICKED FOR YOU</Eyebrow>
            <H size={22}>{sess.structural}</H>
          </div>
          <button onClick={() => setReorder(!reorder)} style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.1em", color: reorder ? T.chalk : T.steel, background: reorder ? T.plate2 : "none", border: `1px solid ${reorder ? T.chalk : T.line}`, borderRadius: 6, padding: "6px 9px", whiteSpace: "nowrap" }}>{reorder ? "DONE" : "REORDER"}</button>
        </div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: T.dim, marginTop: 4 }}>Everything else just chases reps — no limit on that. New weight increases you earn wait in line for their own day.</div>
        <More c={T.orange} deep="One structural change per session keeps the signal clean — when something moves, you know exactly what caused the response. Rep progression stays unlimited because it's the noise-free kind of change. The scheduler auto-picks from the queue in order; doc-approved riders are the only exception."
          forYou={(() => { const cand = s.queue.filter((q) => !q.done && q.kind === "debut" && q.exId && exById(s, q.exId) && exById(s, q.exId).day === dayType(dateSel)); return cand.length > 1 ? `Waiting behind today's slot: ${cand.slice(1).map((q) => q.t).join(" · ")} — each gets its own session.` : cand.length === 1 ? "The queue empties after this one — new earns will refill it as you log." : "Nothing structural queued for this day type — pure rep-progression day, which is where most muscle actually gets built."; })()} />
      </Card>

      {/* The hack-debut card used to be a sleep gate with a hardcoded 4.5 h
          release valve and a "deferral #3" counter — a lock, a countdown and an
          escape hatch built around a rule that no longer exists. A third set is
          a set. It runs on its next lower day like any other structural change. */}
      {dayType(dateSel) === "L" && hackPending && (
        <Card accent={T.jade}>
          <Eyebrow c={T.jade}>HACK — THIRD SET DEBUTS TODAY</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 4 }}>
            It takes today's one structural slot. Log whatever the third set gives you — that number becomes the baseline the next one is measured against, so there is nothing to hit and nothing to protect.
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {/* Was "records count as pending" on a short night — the retired gate, at the
        top of the page he opens to train. What replaces it says the true thing:
        a short night is context for reading the session, never a verdict on it. */}
        <Chip c={slp.clean ? T.jade : T.brass}>{slp.clean ? "NORMAL NIGHT — nothing to caveat" : <>SHORT NIGHT{slp.last && slp.last.h ? " · " + slp.last.h + " h" : ""} — reps still count, records still bank; today just cannot be read as a stall</>}</Chip>
        <Chip><Term k="noonwindow" c={T.steel}>STIM CHECK</Term>{(() => { const me1 = todayMeds(s); if (me1 && me1.taken) return <> — meds @ {fmt12(me1.at)} · effort feels easier mid-peak than it is</>; if (me1 && !me1.taken) return <> — none today · effort reads truer, energy may run lower</>; return <> — meds peak midday · if lifting then, effort feels easier than it is · log it on NOW</>; })()}</Chip>
      </div>

      {(() => { const mv2 = muscleVolume(s); if (!mv2.length) return null; const fS = Object.keys(s.sessionLog).sort()[0]; const matureV = !!fS && (mk(isoOf(todayStart())) - mk(fS)) / DAY >= 14; return (
        <div style={{ fontFamily: mono, fontSize: 9.5, color: T.steel, padding: "8px 2px", lineHeight: 1.7 }}>
          {matureV ? "THIS WEEK'S SETS · holding, not growing — see below · " : "SETS THIS WEEK — counting only, no verdicts until the ledger has 14 days of your logs · "}{(() => { const cut9 = !((s.targets || {}).exitStart); return mv2.map((m) => {
            /* In a deficit, red on a muscle below the GROWTH band is the app
               telling him to add work the direct evidence says buys nothing —
               and it would contradict the card immediately below. Below-band
               reads as neutral while cutting; the card explains why. */
            const c9 = !matureV ? T.dim
              : m.zone === "IN-BAND" ? T.jade
              : (m.zone === "UNDER" || m.zone === "LOW") ? (cut9 ? T.steel : T.brass)
              : m.zone === "OVER" ? T.redline : T.brass;
            const mark = !matureV ? "" : m.zone === "IN-BAND" ? " ✓" : (m.zone === "UNDER" || m.zone === "LOW") ? (cut9 ? " · holding" : " ▼") : m.zone === "OVER" ? " ▲▲" : " ▲";
            return <span key={m.mg} style={{ color: c9, marginRight: 8 }}>{mgLabel(m.mg)} {m.n7}{mark}</span>;
          }); })()}
        </div>
      ); })()}
      {/* ---------- The thing he is getting right, said out loud ----------
          An app that only ever speaks to correct you teaches you nothing about
          what to protect. His exercise selection is on the right side of the
          largest effect in the training literature — larger than everything
          this session removed put together — and the app had never mentioned
          it. See EXERCISE_SELECTION. */}
      {(() => { const sel = exerciseSelection(s); if (!sel.items.length) return null; return (
        <Card accent={sel.allGood ? T.jade : T.brass} style={{ padding: 12 }}>
          <Eyebrow c={sel.allGood ? T.jade : T.brass}>{sel.allGood ? "EXERCISE SELECTION — ALREADY RIGHT, AND IT IS THE BIGGEST ONE" : "EXERCISE SELECTION — ONE TO LOOK AT"}</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 6, lineHeight: 1.55 }}>
            For a muscle that crosses two joints, the joint you are NOT training sets its length — and length under load is where the growth difference actually lives. These effects run {"d ="} 0.5 to 1.6. Rep tempo is 0.09. Eccentric speed is −0.06. Periodisation is −0.02. This is the lever; those were rounding.
          </div>
          <div style={{ marginTop: 9, display: "flex", flexDirection: "column", gap: 7 }}>
            {sel.items.map((it) => (
              <div key={it.id} style={{ borderLeft: `2px solid ${it.good ? T.jade : T.brass}`, paddingLeft: 8 }}>
                <div style={{ fontFamily: mono, fontSize: 10, color: it.good ? T.jade : T.brass }}>{it.good ? "✓" : "▸"} {it.n.toUpperCase()} · {it.lever} · d {it.d}</div>
                <div style={{ fontFamily: body, fontSize: 11, color: T.steel, lineHeight: 1.5, marginTop: 2 }}>{it.why}</div>
              </div>
            ))}
          </div>
          <More c={sel.allGood ? T.jade : T.brass}
            deep="Standing versus seated calf raise is d = 0.88 to 1.58 — the largest exercise-selection effect measured anywhere in hypertrophy research, and it comes from one thing: the gastrocnemius crosses the knee, so bending the knee slackens it and a seated raise trains mostly soleus instead. Overhead versus pushdown triceps is d = 0.54 to 0.61 for the same structural reason at the shoulder. Seated versus lying ham curl runs the same way at the hip. Set against those, the variables this app used to fuss over are noise: rep tempo SMD 0.09 (and favouring FASTER, not slower), accentuated eccentrics −0.06 on growth while perceived effort rises +1.72, periodisation model d = −0.02, machines versus free weights −0.055 at p = 0.751. Every one of those has been removed from this app. This is what replaced them."
            forYou={sel.allGood
              ? ["Every biarticular lift in your programme is already in the lengthened position — the calf raise standing with a pause in the stretch, the ham curl seated with the hips pinned, the leg extension reclined.",
                 "Nobody set that up by accident and nothing in this app told you to do it. It is the most valuable thing in your training and the app had never once mentioned it.",
                 "What it means practically: there is no training-side upgrade left worth chasing here. The remaining levers are volume where a muscle is short, and everything on the nutrition side."]
              : sel.items.filter((x) => !x.good).map((x) => x.n + ": " + x.why)} />
        </Card>
      ); })()}

      {/* What the set counts mean while he is cutting — see CUTTING_VOLUME_NOTE.
          Colouring a muscle red against a GROWTH band, in a deficit, tells a man
          to add work the one direct trial says buys him nothing. */}
      {(() => { const vi9 = volumeImbalance(s); if (!vi9) return null; return (
        <Card style={{ padding: 12 }} accent={vi9.cutting ? undefined : T.brass}>
          <Eyebrow c={vi9.cutting ? T.steel : T.brass}>{vi9.cutting ? "YOUR SET ALLOCATION — AND WHY IT IS FINE RIGHT NOW" : "YOUR SET ALLOCATION — WORTH ACTING ON NOW"}</Eyebrow>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.steel, marginTop: 6, lineHeight: 1.7 }}>
            {vi9.pv.map((m) => <span key={m.mg} style={{ marginRight: 9, color: m.indirectOnly ? T.dim : T.steel }}>{mgLabel(m.mg)} {m.sets}{m.indirectOnly ? "*" : ""}</span>)}
          </div>
          <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 8, lineHeight: 1.55 }}>{vi9.why}</div>
          <More c={vi9.cutting ? T.steel : T.brass}
            deep="Two different questions wear the same units. How many sets per muscle per week to GROW is Pelland 2025's dose-response — 67 studies, 2,058 participants — and return per set peaks between five and ten weekly sets, measured in people eating enough to build. How many to KEEP what you have in a deficit is a different question with its own direct evidence, and the answer is: fewer than you would guess, and not sensitive to volume. Roth 2023 ran trained men six weeks at a 30 kcal/kg deficit with protein at 2.8 g/kg fat-free mass and compared roughly twenty weekly sets against twelve — lean mass fell 0.51 kg and 0.92 kg, not a significant difference, with no difference in muscle thickness either. Bickel 2011 is starker: after sixteen weeks of building, young adults held their thigh lean mass for thirty-two weeks on ONE-NINTH of the volume that built it, one session a week, and got stronger doing it. Adding sets in a deficit costs recovery you have less of and session time you have to find, in exchange for an effect the direct evidence cannot detect. The allocation still matters — it is the first thing to fix when you start building — which is why it is on this card instead of thrown away."
            forYou={(() => { const out = []; const th = vi9.taker; if (th) out.push(vi9.cutting
              ? cap(mgLabel(th.mg)) + " at " + th.sets + " sets a week is the lowest allocation in your programme, and while you are cutting that is adequate — you are asking it to hold, and holding is cheap."
              : cap(mgLabel(th.mg)) + " at " + th.sets + " sets is the first thing to raise now that you are building.");
              out.push("Your deltoids read correctly here for the first time — they were being counted as one 17-set muscle instead of three heads at 5 to 8 each, which is why the app used to flag them red.");
              out.push("* = credited from compound work only, with no direct lift of its own. The lever there is the press, not another isolation movement."); return out; })()} />
        </Card>
      ); })()}

      {sess.ex.map((ex) => (
        <Card key={ex.id} style={{ padding: 12, opacity: skipped[ex.id] ? 0.45 : 1 }} accent={ex.isDebutNow && !skipped[ex.id] ? T.orange : undefined}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 17, textTransform: "uppercase", color: T.chalk, textDecoration: skipped[ex.id] ? "line-through" : "none" }}>{ex.n}</div>

            {!reorder && (() => { const lc = liftCall(s, ex.id); const vc = lc.verdict === "RESET" || lc.verdict === "STAND-DOWN" ? T.redline : lc.verdict === "HOLD" ? T.brass : lc.verdict === "PUSH+" ? T.jade : lc.verdict === "REBUILD" ? T.orange : T.jade; return (
              <span onClick={(ev2) => { ev2.stopPropagation(); setCallOpen(callOpen === ex.id ? null : ex.id); }} style={{ fontFamily: mono, fontSize: 8.5, color: vc, border: `1px solid ${vc}`, borderRadius: 999, padding: "3px 8px", flexShrink: 0, cursor: "pointer" }}>{(CALL_PLAIN[lc.verdict] || { chip: lc.verdict }).chip}{lc.vel != null ? (lc.vel > 0.2 ? " ▲" : lc.vel < -0.2 ? " ▼" : " ▶") : ""} ▾</span>
            ); })()}
            {!reorder && (
              <button onClick={() => setSkipped({ ...skipped, [ex.id]: !skipped[ex.id] })} style={{ fontFamily: mono, fontSize: 9, color: skipped[ex.id] ? T.brass : T.dim, background: "none", border: `1px solid ${skipped[ex.id] ? T.brass : T.line}`, borderRadius: 999, padding: "4px 9px", flexShrink: 0 }}>{skipped[ex.id] ? "skipped — undo" : "skip"}</button>
            )}
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
              <div style={{ fontFamily: mono, fontSize: 12, color: T.steel, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {wEdit === ex.id ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {loadRungs(ex) ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => setWVal(prevLoad(ex, wVal) ?? wVal)} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>−</button>
                        <div style={{ fontFamily: mono, fontSize: 15, color: T.chalk, minWidth: 44, textAlign: "center" }}>{wVal}</div>
                        <button onClick={() => setWVal(nextLoad(ex, wVal) ?? wVal)} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.line}`, background: T.plate2, color: T.steel, fontFamily: mono }}>+</button>
                        <span style={{ fontFamily: mono, fontSize: 8.5, color: T.jade }}>rung {loadRungs(ex).indexOf(snapLoad(ex, wVal)) + 1}/{loadRungs(ex).length}</span>
                      </span>
                    ) : (
                      <Stepper v={wVal} set={setWVal} step={ex.inc || 5} min={5} />
                    )}
                    <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>jump:</span>
                    {[2.5, 5, 10].map((jz) => (
                      <span key={jz} onClick={() => { const ns = JSON.parse(JSON.stringify(s)); const ex5 = ns.exercises.find((x) => x.id === ex.id); ex5.inc = jz; delete ex5.steps; ns.feed.unshift({ d: isoOf(todayStart()), t: `JUMP SIZE — ${ex5.n.toUpperCase()} steps by ${jz}`, how: "athlete set the machine's smallest honest increment — even ladder" }); setS(ns); save(ns); }}
                        style={{ fontFamily: mono, fontSize: 9, color: !loadRungs(ex) && (ex.inc || 5) === jz ? T.jade : T.dim, border: `1px solid ${!loadRungs(ex) && (ex.inc || 5) === jz ? T.jade : T.line}`, borderRadius: 999, padding: "3px 8px", cursor: "pointer" }}>{jz}</span>
                    ))}
                    <span onClick={() => setRungEdit(rungEdit === ex.id ? null : ex.id)}
                      style={{ fontFamily: mono, fontSize: 9, color: loadRungs(ex) ? T.jade : T.dim, border: `1px solid ${loadRungs(ex) ? T.jade : T.line}`, borderRadius: 999, padding: "3px 8px", cursor: "pointer" }}>
                      {loadRungs(ex) ? `uneven · ${loadRungs(ex).length} rungs ✎` : "uneven ✎"}
                    </span>
                    <Btn small tone="jade" onClick={() => { const ns = JSON.parse(JSON.stringify(s)); const ex4 = ns.exercises.find((x) => x.id === ex.id); const oldW = ex4.w; ex4.w = loadRungs(ex4) ? snapLoad(ex4, wVal) : wVal; if (oldW !== ex4.w) ex4.last = null; ns.feed.unshift({ d: isoOf(todayStart()), t: `WEIGHT SET — ${ex4.n.toUpperCase()} ${typeof oldW === "number" ? oldW + " → " : ""}${ex4.w}`, how: "athlete entry on the card — targets re-seeded for the new load" }); setS(ns); save(ns); setWEdit(null); setRungEdit(null); }}>Save</Btn>
                    {rungEdit === ex.id && (
                      <div style={{ width: "100%", marginTop: 6, padding: "9px 10px", background: T.plate2, border: `1px solid ${T.line}`, borderRadius: 8 }}>
                        <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.08em", lineHeight: 1.6 }}>
                          EVERY WEIGHT THIS MACHINE CAN ACTUALLY MAKE — commas or spaces.<br />
                          For a stack with hang-on attachments, list the real rungs: 80, 82.5, 85, 90, 92.5, 95, 100…
                        </div>
                        <textarea defaultValue={(loadRungs(ex) || []).join(", ")} rows={2} id={"rungs-" + ex.id}
                          placeholder="80, 82.5, 85, 90, 100"
                          style={{ width: "100%", boxSizing: "border-box", marginTop: 7, background: T.ink, border: `1px solid ${T.line}`, borderRadius: 6, color: T.chalk, fontFamily: mono, fontSize: 13, padding: 8, outline: "none", resize: "vertical" }} />
                        <div style={{ display: "flex", gap: 8, marginTop: 7, flexWrap: "wrap" }}>
                          <Btn small tone="jade" onClick={() => {
                            const el = document.getElementById("rungs-" + ex.id);
                            const parsed = parseRungs(el ? el.value : "");
                            const ns = JSON.parse(JSON.stringify(s)); const ex6 = ns.exercises.find((x) => x.id === ex.id);
                            if (!parsed) { delete ex6.steps; ns.feed.unshift({ d: isoOf(todayStart()), t: `LADDER CLEARED — ${ex6.n.toUpperCase()}`, how: `back to even ${ex6.inc || 5} lb jumps` }); }
                            else { ex6.steps = parsed; ex6.w = snapLoad(ex6, typeof ex6.w === "number" ? ex6.w : parsed[0]); setWVal(ex6.w); ns.feed.unshift({ d: isoOf(todayStart()), t: `LADDER SET — ${ex6.n.toUpperCase()} ${parsed.length} rungs`, how: `${parsed[0]} to ${parsed[parsed.length - 1]} — every earn, reset and forecast now lands on a weight this machine makes` }); }
                            setS(ns); save(ns); setRungEdit(null);
                          }}>Save ladder</Btn>
                          <button onClick={() => setRungEdit(null)} style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, background: "none", border: `1px solid ${T.line}`, borderRadius: 8, padding: "7px 12px" }}>cancel</button>
                          <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, alignSelf: "center" }}>empty = back to even jumps</span>
                        </div>
                      </div>
                    )}
                  </span>
                ) : (
                  <span onClick={() => { setWEdit(ex.id); setWVal(typeof ex.w === "number" ? ex.w : 180); }} style={{ cursor: "pointer", color: typeof ex.w === "number" ? T.steel : T.brass }}>{typeof ex.w === "number" ? ex.w : "set weight"} ✎</span>
                )}
                <span>· tgt {ex.tgt.join(",")}</span>
                <span style={{ fontFamily: mono, fontSize: 9, color: T.dim, width: "100%" }}>
                  <Term k="rest" c={T.dim}>REST</Term> · {restLine(ex.id, ex.tgt.length)}
                </span>
              </div>
            )}
          </div>
          {callOpen === ex.id && (() => { const lc2 = liftCall(s, ex.id); return (
            <div style={{ marginTop: 8, padding: "9px 11px", background: T.plate2, borderRadius: 8, border: `1px solid ${T.line}` }}>
              <div style={{ fontFamily: mono, fontSize: 9.5, color: T.jade, letterSpacing: "0.05em" }}>{(CALL_PLAIN[lc2.verdict] || { mean: "" }).mean}</div>
              <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, lineHeight: 1.55, marginTop: 6 }}>{lc2.why}</div>
              {(lc2.receipts || []).map((r3, i3) => <div key={i3} style={{ fontFamily: mono, fontSize: 9.5, color: T.steel, marginTop: 5, lineHeight: 1.5 }}>· {r3}</div>)}
              <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 7 }}>THE CHARTER: retain muscle per unit of recovery; the deficit does the cutting; a record is a rep line that clears your own noise and repeats.</div>
            </div>
          ); })()}
          {ex.prev && (
            <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 3 }}>
              PREV ▸ {fmtShort(ex.prev.d)} · {ex.prev.w} × {ex.prev.reps.join(",")}
              {(() => {
                const rs = rirSetsOf(ex.prev);
                const o = rs.length ? rs[0] : null, t = rs.length > 1 ? rs[rs.length - 1] : null;
                if (o == null && t == null) return null;
                return (
                  <span> · RIR {o == null ? "?" : o}
                    {t != null && <span> → <span style={{ color: t === 0 ? T.jade : T.brass }}>{t}</span> last</span>}
                  </span>
                );
              })()}
              {ex.prev.debt && <span style={{ color: T.brass }}> · <Term k="debt" c={T.brass}>short night</Term></span>}
            </div>
          )}
          {ex.note && <div style={{ fontFamily: mono, fontSize: TS.label, color: ex.isDebutNow || (ex.note || "").startsWith("OWN") ? T.orange : T.dim, marginTop: 3, letterSpacing: "0.04em" }}>{ex.note}</div>}
          {ex.setup && (
            <div style={{ marginTop: 7 }}>
              <button onClick={() => setShowSetup({ ...showSetup, [ex.id]: !showSetup[ex.id] })}
                style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.12em", color: showSetup[ex.id] ? T.chalk : T.dim, background: "none", border: "none", padding: 0 }}>
                {showSetup[ex.id] ? "▾ SETUP + CUES" : "▸ SETUP + CUES"}
              </button>
              {showSetup[ex.id] && ex.setup.split("\n").map((l, i) => (
                <div key={i} style={{ fontFamily: mono, fontSize: TS.label, color: i === 0 ? T.chalk : T.steel, marginTop: i === 0 ? 6 : 4, lineHeight: 1.55 }}>{l}</div>
              ))}
              {showSetup[ex.id] && ex.live && (
                <div style={{ fontFamily: mono, fontSize: TS.label, color: ex.isDebutNow ? T.orange : T.jade, marginTop: 5, lineHeight: 1.55 }}>NOW ▸ {ex.live}</div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            {(() => { const rp2 = rirPlan(s, ex, slp); return getReps(ex).map((r, i) => (
              <div key={i}>
                <div style={{ fontFamily: mono, fontSize: TS.label, color: T.dim, marginBottom: 3 }}>SET {i + 1} · <span style={{ color: rp2.plan[i] === 0 ? T.jade : T.steel, fontWeight: 700 }}>RIR {rp2.plan[i] ?? "—"}</span>{rp2.plan[i] === 0 ? <span style={{ color: T.jade }}> · TO FAILURE</span> : null}</div>
                <Stepper v={r} set={(v) => setRep(ex, i, v)} />
              </div>
            )); })()}
          </div>
          {/* The tap-to-override control is gone with the rule it overrode. Its
              only job was cancelling the short-sleep RIR pull; with that rule
              deleted the switch guarded nothing, and a control that does nothing
              is worse than no control — tapping it teaches him the app is
              theatre. The plan's reasons still print, they just are not
              clickable any more. */}
          {(() => { const rp = rirPlan(s, ex, slp); return rp.why.length ? (
            <div style={{ fontFamily: mono, fontSize: 9, color: T.steel, marginTop: 9 }}><Term k="rirplan" c={T.steel}>RIR plan</Term>
              <span style={{ color: T.brass }}> — {rp.why[0]}</span>
            </div>
          ) : null; })()}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8 }}>
            {/* LAST SET first, deliberately. This is the field the progression
                engine reads; the opener only feeds the hot-opener governor. The
                two sat the other way round with both marked "optional", and the
                record shows exactly what that produced — 28 openers rated, zero
                terminal sets, and every jump defaulting to a token single rep. */}
            <span style={{ fontFamily: mono, fontSize: 8.5, color: T.jade, letterSpacing: "0.1em" }}>LAST SET <Term k="rir" c={T.jade}>RIR</Term></span>
            {[0, 1, 2, 3].map((v) => {
              const on = rirEnd[ex.id] === v;
              const c = v === 0 ? T.jade : T.brass;
              return (
                <button key={v} onClick={() => setRirEnd({ ...rirEnd, [ex.id]: on ? null : v })}
                  style={{ width: 34, height: 26, borderRadius: 6, border: `1px solid ${on ? c : T.line}`, background: on ? T.plate2 : "transparent", color: on ? c : T.steel, fontFamily: mono, fontSize: 11 }}>
                  {v === 3 ? "3+" : v}
                </button>
              );
            })}
            <span style={{ fontFamily: mono, fontSize: 8.5, color: T.jade }}>this one sizes the jump · 0 = it was the failure set</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6 }}>
            <span style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, letterSpacing: "0.1em" }}>FIRST SET <Term k="rir" c={T.dim}>RIR</Term></span>
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
        <Eyebrow>PACE · HOW LONG BETWEEN SETS</Eyebrow>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {[["normal", "FULL REST", T.jade], ["rushed", "RUSHED", T.brass]].map(([v, label, c]) => {
            const on = pace === v;
            return (
              <button key={v} onClick={() => setPace(on ? null : v)}
                style={{ flex: 1, fontFamily: mono, fontSize: 10.5, letterSpacing: "0.06em", padding: "9px 6px", borderRadius: 7, border: `1px solid ${on ? c : T.line}`, background: on ? T.plate2 : "transparent", color: on ? c : T.steel }}>
                {label}
              </button>
            );
          })}
        </div>
        <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 6, lineHeight: 1.5 }}>
          RUSHED = under about a minute between sets. Reps still count — but a compressed day can't count toward a stall, so it never lightens your bar by mistake.
        </div>
      </Card>

      <Card style={{ padding: 12 }}>
        <Eyebrow>SESSION NOTES · OPTIONAL — THE "SET-4 ANOMALY" BOX</Eyebrow>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="anything the numbers missed — your night analyst reads this; the engines only read the numbers…"
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
                <div style={{ fontFamily: body, fontSize: 13, color: T.steel }}>Nothing flipped state — reps banked, standards held, tomorrow's targets regenerated. Normal days are what actually compound.</div>
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
</>)}


      {Object.keys(s.sessionLog).length > 0 && (
        <Section title="The Session Archive" meta={`${Object.keys(s.sessionLog).length} logged · tap any for its receipt + debrief`}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {Object.keys(s.sessionLog).sort().reverse().map((d) => { const sl = s.sessionLog[d]; const tr = (sl.entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0); return (
              <div key={d} onClick={() => { setDateSel(d); setDbOpen(true); try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e2) { window.scrollTo(0, 0); } }} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "10px 0", borderBottom: `1px solid ${T.line}`, cursor: "pointer", fontFamily: mono, fontSize: 10.5 }}>
                <span style={{ color: T.chalk }}>{fmtShort(d)} · {dayType(d) === "U" ? "UPPER" : "LOWER"}</span>
                <span style={{ color: T.steel }}>{(sl.entries || []).length} lifts · {tr} reps{cleanAtDate(s, d) ? "" : " · debt"} <span style={{ color: T.dim }}>▸</span></span>
              </div>
            ); })}
          </div>
        </Section>
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
      <Eyebrow>WHAT'S NEXT — UPDATES ITSELF AS YOU TRAIN</Eyebrow>
      <Card style={{ padding: 11 }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: T.steel, letterSpacing: "0.05em", lineHeight: 2 }}>
          <Term k="gated" c={T.dim}>LOCKED</Term> → <Term k="earned" c={T.jade}>EARNED</Term> → <Term k="debut" c={T.orange}>FIRST RUN</Term> → <Term k="own" c={T.jade}>YOURS</Term>
          <span style={{ color: T.dim }}>  ·  other paths: </span><Term k="reclaim" c={T.brass}>WIN IT BACK</Term> · <Term k="parked" c={T.dim}>ON HOLD</Term>
          <span style={{ color: T.dim }}>  — tap any word</span>
        </div>
      </Card>
      {live.map((u) => (
        <Card key={u.id}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 17, textTransform: "uppercase", color: T.chalk }}>{u.t}</div>
            <Stamp st={u.state} />
          </div>
          <div style={{ fontFamily: mono, fontSize: 11, color: T.steel, marginTop: 6 }}>{plainify(u.gate)}</div>
          {u.rule && <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, marginTop: 3 }}>{plainify(u.rule)}</div>}
          {u.kind === "ladder" && curl && curl.ladder && (
            <div style={{ marginTop: 8 }}>
              <Bar pct={((curl.last ? curl.last[curl.ladder.set] : 8) / curl.ladder.top) * 100} c={T.brass} />
              <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 4 }}>set 2 · {curl.last ? curl.last[curl.ladder.set] : 8} of {curl.ladder.top}</div>
            </div>
          )}
          <More c={T.brass}
            deep={({
              debut: "EARNED → DEBUT: this load was bought with reps at the top of the window. It runs when it wins its day's single structural slot — one change per session keeps the response readable.",
              unlock: "EARNED → DEBUT: bought at the top of the window; it runs when it wins the day's single structural slot.",
              own: "One hit isn't ownership — the standard has to repeat before anything loads, because a repeat is the second independent observation and that is the whole statistical content of the rule. Sleep is not part of it: a hit on a short night is a hit.",
              reclaim: "The standard slipped, so the exact rep line has to be re-earned before the increment unlocks. Records here can fall and be won back — that's what makes the ledger honest.",
              ladder: "A rep ladder on the money set: top out the rung and the next gate opens. Load moves on this lift stay coach-flag.",
              phase: "Fires from the live body-fat estimate, not the calendar. Applying it swaps every daily target at once — one tap, whole new phase.",
              exit: "The plan for ending the cut, in the athlete's own words: straight to maintenance, hold, then decide. One step to his MEASURED maintenance — not a ramp, because reverse dieting as a protocol has no controlled trial behind it, only practitioner convention — then a hold long enough that the numbers mean something before anything else is chosen. What IS replicated is the value of time spent at maintenance (MATADOR, Byrne 2018, and the diet-break literature), and none of it requires arriving slowly. The old version of this card aimed at an authored 2,450 and committed him to a surplus and a build phase before the hold had produced a single number to decide on; stepping up to a 'maintenance' that is not actually maintenance is the most common way a diet exit fails, because it is just a smaller cut with a better name.",
              info: "Parked with a named trigger, so the condition decides instead of memory. Parked isn't forgotten; it's staged.",
            })[u.kind] || "A gate with a named condition — it resolves itself the moment the condition is met, and the queue refills as you log."}
            forYou={(() => {
              const ex = u.exId ? exById(s, u.exId) : null;
              const nd = ex ? nextOfType(ex.day) : null;
              if (u.kind === "exit") { const dx = dietExit(s); return dx.gated ? [dx.why] : dx.plan.concat([dx.unknown]); }
              if (u.kind === "own" && ex && nd) return [
                `Your next try is ${fmtShort(nd)} at ${ex.w}.`,
                /* This used to say the day "couldn't count" because of sleep, and that "sleep
                   decides before your muscles do" — the retired gate telling him his own reps
                   were void. They were never void. */
                `Last time you got ${ex.last ? ex.last.join(", ") : "—"}${ex.lastMeta && ex.lastMeta.debt ? " after a short night — which counted; it just cannot be read as a stall" : ""}.`,
                `To make the weight officially yours: hit that line again. One hit is a good day, a repeat is an address — and nothing else gates it.`,
              ];
              if ((u.kind === "debut" || u.kind === "unlock") && ex && nd) { const mn = pickStructural(s, nd, slp).main; return mn && mn.id === u.id ? [
                `This is the one change running on ${fmtShort(nd)} — the slot is yours.`,
                `First outing rule: no targets, no grades. Log whatever it gives and that becomes the baseline everything else is measured against.`,
              ] : [
                `In line behind ${mn ? mn.t : "the current pick"}.`,
                `The app allows one change per session on purpose: if two things change and something improves — or hurts — you can't tell which one did it.`,
                `It runs on its own day, automatically.`,
              ]; }
              if (u.kind === "reclaim" && ex && ex.reclaim && nd) return [
                `The exact line to win back: ${ex.reclaim.join(", ")} at ${ex.w}.`,
                `Next chance is ${fmtShort(nd)}. Until then the weight holds — no increase, no penalty, just a bar to clear.`,
                `You set those numbers before; this is recovery of proof, not new ground.`,
              ];
              if (u.kind === "ladder" && curl && curl.ladder) return [
                `The money set sits at ${curl.last ? curl.last[curl.ladder.set] : "?"} of ${curl.ladder.top}.`,
                `Every session is one climb attempt — top the rung and the next gate opens by itself.`,
                `Weight changes on this lift stay a coach conversation.`,
              ];
              if (u.kind === "phase") return [
                `Your body-fat estimate reads ${bfEst(s).pct}% right now; this fires at ≤13.2%.`,
                `When it fires, one tap swaps every daily target at once — calories, steps, the whole phase.`,
                `The cone on the LAB tab shows the honest date range for when that lands.`,
              ];
              return "Resolves on its own the moment its condition is met — the queue never needs your memory.";
            })()} />
        </Card>
      ))}

      {flipped.length > 0 && (
        <Section title="Wins" meta={`${flipped.length} on the board · earned the hard way`} c={T.jade}>
          {flipped.map((u) => (
            <Card key={u.id} accent={T.jade}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 16, textTransform: "uppercase", color: T.chalk }}>{u.t}</div>
                <Stamp st={u.state} />
              </div>
              <div style={{ fontFamily: mono, fontSize: 10.5, color: T.steel, marginTop: 4 }}>{plainify(u.gate)}</div>
            </Card>
          ))}
        </Section>
      )}

      <Section title="The Story So Far" meta={`${s.feed.length} entries · latest: ${((s.feed[0] || {}).t || "—").slice(0, 22)}`} c={T.jade}>
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
      </Section>

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
  /* The crossover progress bar is gone from here too — see COUNTDOWN_NOTE.
     A bar filling toward a date he never set is an urgency mechanic whether or
     not the date is printed next to it. What replaces it is progress against
     the only thing that is real: how far the trend has actually moved. */
  const xPct = (() => { const f0 = (s.weekly || [])[0]; const start0 = f0 ? f0.trend : s.trend; const bfE = bfEst(s); const tgt0 = bfE.lean / 0.89; const span = Math.max(0.1, start0 - tgt0); return Math.max(0, Math.min(100, Math.round(((start0 - s.trend) / span) * 100))); })();
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

      <Card accent={T.jade} style={{ padding: 12 }}>
        <Eyebrow c={T.jade}>VITALS — THE FOUR NUMBERS THAT MATTER</Eyebrow>
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
          <div><Num size={20}>{s.trend}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>TREND{sealed ? " · SEALED" : ""}</div></div>
          <div><Num size={20}>{bf.pct}%</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>EST BF {s.model.err}</div></div>
          <div><Num size={20}>{cur.fat}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>FAT/WK{cur.measured ? " · MEASURED" : ""}</div></div>
          <div><Num size={20}>{s.waist.length ? s.waist[s.waist.length - 1].v + '"' : "—"}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>WAIST</div></div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 8 }}>four rooms below — tap any to enter</div>
      </Card>

      <Section title="Weight" meta={`${s.trend}${sealed ? " · sealed → " + fmtShort(SEAL_UNTIL) : " · live"}`}>
        <Card>
        <Eyebrow><Term k="trend" c={T.dim}>TREND</Term> — THE HERO NUMBER</Eyebrow>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
          <Num size={40} c={T.jade}>{s.trend}</Num>
          <span style={{ fontFamily: mono, fontSize: 11, color: T.dim }}>daily weigh-ins draw small & grey on purpose — the green line is the one to believe</span>
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
      </Section>

      <Section title="Body Fat" meta={`~${bf.pct}% · ${s.model.src}${observedTDEE(s) ? " · maint ~" + observedTDEE(s).tdee : ""}`}>
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
        <More deep="Observed TDEE = your average logged intake + the daily energy your measured loss represents (the mixed tissue you actually lose, ~3,800 kcal/lb per Hall 2008 — not the retired 3,500 pure-fat figure — minus what the muscle drip stores). No textbook formulas — arithmetic from your own ledger, recomputed over a rolling 3 weeks, sliding down ~10 kcal for every pound you lose."
          forYou={(() => { const obs = observedTDEE(s); return obs ? [
            `Your measured maintenance right now: ~${obs.tdee} calories.`,
            "That's the number September's diet-exit aims at — climb to it quickly, then build your muscle-gain surplus on top of it.",
            "Using today's measured truth instead of a June guess is the whole plan against overshooting into fat regain.",
          ] : [
            "This prints Monday, the moment the scale seal lifts.",
            "Every day you log between now and then sharpens the single number the entire post-cut plan gets built on.",
          ]; })()} />
      </Card>
      </Section>

      <Section title="Pace & Timeline" meta={`${cur.fat}/wk · wk ${wd.wk}`}>
        <Card>
        <Eyebrow>RATE OF LOSS · PHASE-AWARE</Eyebrow>
        <div style={{ marginTop: 10 }}><RateGauge rate={s.rate} cur={cur} /></div>
        <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, marginTop: 8 }}>Rules run themselves: floor and redline arm one-tap adjustments on the NOW screen when trend data trips them.</div>
        <More deep="The green band (1.0–1.4/wk) is the muscle-safe corridor for this phase. Floor rule: two weeks under 0.8 → restore steps FIRST, then trim calories. Redline: ≥1.9 → add ~100 back and coach-flag, because speed there is muscle risk, not a win. Sealed windows mute both rules so event noise can never fire them."
          forYou={sealed ? `Rules muted while sealed (clean read ${fmtShort(SEAL_UNTIL)}) — your sheet's 7/21 REDLINE gap-artifact is exactly what this muting exists to prevent.` : cur.measured ? `Measured ~${cur.fat}/wk fat-equivalent right now — ${cur.fat >= 1.0 && cur.fat <= 1.4 ? "inside the corridor; nothing to do." : cur.fat < 1.0 ? "under the corridor; the floor rule is the nearest tripwire." : "hot; the redline is the nearest tripwire."}` : "Two clean weekly snapshots and this goes fully measured."} />
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
        <More c={T.brass} deep="Straight-line ETAs from your measured rate plus the drip — useful for direction, honest about nothing else; the cone on the LAB tab is the version with uncertainty attached. The acceleration note is subcutaneous math: below ~13%, the same pound of fat comes off a smaller, leaner surface, so each BF point shows 2–3× the visible change of earlier points."
          forYou={wd.wk < 8 ? `Week ${wd.wk} now — the acceleration window opens wk 8 (~${fmtShort(isoOf(new Date(mk(START).getTime() + 49 * DAY)))}), the mirror outranks the scale from wk 10, and the pivot ETA above is the straight line the cone bends around. The boring middle is almost over.` : wd.wk < 10 ? `Week ${wd.wk} — you are IN the acceleration window: each BF point now shows 2–3× the visual change. Mirror takes over at wk 10; the pivot ETA above is the straight line the cone bends around.` : `Week ${wd.wk} — mirror era. Photos and waist outrank everything on this card; the ETAs are background math now.`} />
      </Card>
      </Section>

      <Section title="Waist & Photos" meta={`${s.waist.length ? s.waist[s.waist.length - 1].v + '"' : "waist due"} · photos ×${s.photos.length}`}>
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
      </Section>

      
    </div>
  );
}

function SleepTab({ s, setS, save, slp }) {
  const [cMg, setCMg] = useState(200);
  const [cAt, setCAt] = useState(() => { const d9 = new Date(); return String(d9.getHours()).padStart(2, "0") + ":" + String(Math.floor(d9.getMinutes() / 15) * 15).padStart(2, "0"); });
  const [caffIn, setCaffIn] = useState(200);
  const nights = s.sleep.nights.slice(-8);
  const maxH = 9;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ---------- SLEEP_CARD_NOTE — the same lever, pointed at the right thing ----------
          This card used to headline CLEAN / RESET n-of-3 and explain that "owns
          and earns require CLEAN because PRs bought on debt don't repeat." That
          was the retired gate wearing a physiology costume, and the closing
          advice — "fixed wake time is the strongest single move" — was aimed at
          the end of HIS night that varies most and that he controls least.

          Sleep did not get demoted. It got promoted to the thing it actually
          governs. Nedeltcheva 2010 is the single largest effect anywhere in this
          app: 5.5 h vs 8.5 h at a MATCHED deficit sent 60% more of the loss onto
          fat-free mass. Same food, same training, worse physique. That belongs
          at the top of the card. What does not belong is a streak counter
          deciding whether a rep counts. */}
      {(() => { const an = sleepAnchor(s); const t7 = atSleepTarget(s, null); const at = t7.at; return (
      <Card accent={at ? T.jade : T.brass}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Eyebrow>WHERE YOUR LOSS COMES FROM</Eyebrow>
            <H size={24} c={at ? T.jade : T.brass}>{an.measured ? `${an.curH} h` : at ? "AT TARGET" : `${t7.run} / ${s.sleep.needed}`}</H>
          </div>
          <div style={{ textAlign: "right", fontFamily: mono, fontSize: 10.5, color: T.steel }}>target {s.sleep.cleanH} h<br />{an.measured ? `bed ${fmt12(an.bed)} · up ${fmt12(an.wake)}` : "log bed and wake times"}</div>
        </div>
        <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 8, lineHeight: 1.55 }}>
          This is not about whether today's session counts — it always counts. It is about what the pounds you lose are made of. At a matched deficit, short sleep sent about 60% more of the loss onto lean mass in the one trial that measured it directly. You cannot out-eat or out-protein that.
        </div>
        {an.measured && an.shiftMin > 0 && (
          <div style={{ fontFamily: mono, fontSize: 11, color: T.jade, marginTop: 9, paddingLeft: 8, borderLeft: `2px solid ${T.jade}` }}>
            THE LEVER — lights out {fmt12(an.needBed)}, {an.shiftMin} min earlier than you go now
          </div>
        )}
        <More c={at ? T.jade : T.brass}
          deep="Two different questions used to share one switch, which is why the old card read as a gate. The first is whether last night was short enough to measurably depress a session — and the performance literature says almost never at his numbers: Craven 2022 puts sleep restriction at −2.85% on strength, inside the test-retest error, and Knowles 2022 ran nine straight nights at 5 h for under 1% of volume load. The second is whether chronic short sleep changes what a deficit takes off you, and there the effect is enormous: Nedeltcheva 2010, 5.5 h vs 8.5 h, 60% more of the loss shifted onto fat-free mass. The app now answers them separately. Nothing here blocks a record; everything here is about body composition. Sleep also taxes the same dopamine circuitry ADHD already taxes, which is why a short week costs drive and focus before it costs anything physical — real, and a reason to protect the night, not a reason to void a rep."
          forYou={(() => { const out = []; if (an.measured) { out.push(an.why); if (an.bedSDmin != null && an.wakeSDmin != null) out.push(an.bedSDmin <= an.wakeSDmin ? `Your bedtime is the steadier end — ${an.bedSDmin} minutes of spread against ${an.wakeSDmin} on your wake time. That makes bed the lever: it is the end of the night you already control.` : `Your wake time is the steadier end (${an.wakeSDmin} min against ${an.bedSDmin} on your bedtime), so an earlier lights-out is the whole move.`); } else { out.push(an.why); } out.push(at ? "You are at target. Protect it — this is the cheapest lean mass you will ever keep." : "Nothing about this stops you lifting or banking today. It changes what the scale is made of a month from now."); return out; })()} />
      </Card>
      ); })()}

      <Section title="Bedtime, Wake & Caffeine" meta={(() => { const tc9 = todayCaff(s); const an9 = sleepAnchor(s); return `${an9.measured ? `bed ${fmt12(an9.bed)} · up ${fmt12(an9.wake)}` : "clock times not logged yet"} · caffeine today: ${tc9 && tc9.logged ? (tc9.mg > 0 ? tc9.mg + " mg @ " + fmt12(tc9.at) : "none ✓") : "not logged"}`; })()} c={T.jade}>
        <Card accent={T.jade}>
        {/* Bedtime leads, because bedtime is the end he holds steady and the end
            that bounds the whole night. The old heading claimed a fixed wake
            time "since 7/23" that the logged record does not show — his wake
            spans 07:50 to 09:45. See SLEEP_LEVER_NOTE. */}
        <Eyebrow c={T.jade}>YOUR CLOCK — AS LOGGED, NOT AS PLANNED</Eyebrow>
        {(() => {
          const an = sleepAnchor(s);
          const a = { wake: an.wake || (s.sleep.anchor || {}).wake || "07:30", asleepTarget: (s.sleep.anchor || {}).asleepTarget || 8 };
          const lo = lightsOutT(s);
          const hr = new Date().getHours() + new Date().getMinutes() / 60;
          const loH = lo.mins / 60;
          const until = hr < loH ? loH - hr : hr >= 17 ? 24 - hr + loH : null;
          const measured = s.sleep.nights.filter((n) => n.sol != null).length >= 5;
          return (
            <>
              <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
                <div><Num size={22} c={T.jade}>{fmt12(lo.t)}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>{lo.override ? "TONIGHT — SET BY YOU ON NOW" : `LIGHTS OUT = ${lo.target} H ASLEEP + ~${lo.sol} M DRIFT${measured ? " (YOURS, MEASURED)" : " (DEFAULT)"}`}</div></div>
                <div><Num size={22}>{fmt12(a.wake)}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>{an.measured ? `WAKE · YOUR MEDIAN, ±${an.wakeSDmin} MIN` : "WAKE · TARGET"}</div></div>
                {until != null && hr >= 17 && <div><Num size={22} c={T.brass}>{Math.floor(until)}h {Math.round((until % 1) * 60)}m</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>UNTIL LIGHTS OUT</div></div>}
              </div>
              <More deep="Lights-out is derived from what actually matters: the asleep target plus your real drift-off time. Every morning's 'asleep in' entry feeds a rolling median; once five nights are measured the default fifteen minutes is replaced by YOUR number and lights-out shifts to protect actual sleep rather than bed-shaped time. This card used to lead with wake-time consistency as 'the strongest circadian lever' — true in general, and the wrong instruction for this athlete, because his wake time is the end of the night that already varies most and that he controls least. Sleep opportunity is bounded at the front: you cannot recover at the back of the night what you never started at the front."
                forYou={(() => { const out = []; if (an.measured) { out.push(`As logged: bed ${fmt12(an.bed)} (±${an.bedSDmin} min), up ${fmt12(an.wake)} (±${an.wakeSDmin} min) — ${an.curH} h.`); if (an.shiftMin > 0) out.push(`Lights out ${fmt12(an.needBed)} clears ${an.target} h at the wake time you already keep. That is ${an.shiftMin} minutes, and it is the whole intervention.`); } out.push(measured ? `Your measured drift-off is ~${lo.sol} min, so ${fmt12(lo.t)} buys a true ${lo.target} h asleep. The number keeps itself honest nightly.` : `Default 15 min drift assumed until five nights are measured — ${5 - s.sleep.nights.filter((n) => n.sol != null).length} to go, then ${fmt12(lo.t)} becomes personally calibrated.`); return out; })()} />
            </>
          );
        })()}
      </Card>
        <Card>
        <Eyebrow>CAFFEINE — TODAY'S ACTUAL, THEN THE TAIL</Eyebrow>
        {(() => {
          const tISO9 = isoOf(todayStart());
          const e9 = (s.caffLog || []).find((x) => x.d === tISO9);
          const lo9 = lightsOutT(s);
          if (e9) {
            const tail9 = e9.mg > 0 ? caffAt(e9.mg, parseHM(e9.at), lo9.mins / 60) : 0;
            return (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
                  <div><Num size={22}>{e9.mg}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>MG · LOGGED {e9.mg > 0 ? "AT " + fmt12(e9.at) : "— NONE TODAY"}</div></div>
                  <div><Num size={22} c={tail9 > 50 ? T.brass : T.jade}>~{tail9}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>MG AT {fmt12(lo9.t)} · HALF-LIFE ~5 H</div></div>
                  <span onClick={() => { const ns = JSON.parse(JSON.stringify(s)); ns.caffLog = (ns.caffLog || []).filter((x) => x.d !== tISO9); setS(ns); save(ns); }} style={{ fontFamily: mono, fontSize: 9, color: T.dim, cursor: "pointer", marginLeft: "auto" }}>undo</span>
                </div>
                <div style={{ fontFamily: body, fontSize: 11, color: T.steel, marginTop: 7, lineHeight: 1.5 }}>{tail9 > 50 ? "Above ~50 mg at lights-out, deep sleep measurably thins — tonight's drift-off is worth an honest note." : tail9 > 0 ? "Under the ~50 mg line — tonight should be largely clear of it." : "A zero-caffeine day is data too. Clean night, clean read."}</div>
              </div>
            );
          }
          return (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel }}>Nothing logged today — the ten-second entry lives on NOW, with today's work. This card is the ledger: it shows the entry and the tail once logged.</div>
              {s.sleep.caffMg != null && (
                <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, marginTop: 8 }}>planning fallback: your typical {s.sleep.caffMg} mg midday — standing advice uses it only until today's real entry exists</div>
              )}
            </div>
          );
        })()}
        <More deep="Caffeine's half-life is ~5 hours (3–7 by genetics). The tail number is computed from the dose and clock time you actually log — never an assumed noon. Residue at lights-out doesn't always block falling asleep; it thins deep sleep and can surface as mid-night wakes. Zero-days matter as much as dose-days: they're the control arm your caffeine trial will need." />
      </Card>
      </Section>

      <Section title="Night Log" meta={`${s.sleep.nights.length} nights on file`}>
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
        <Eyebrow c={T.brass}>WHAT THE DEBT COST — ATTRIBUTED, NOT BLAMED</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {debtLedger(s).map((d, i) => (
            <div key={i} style={{ fontFamily: mono, fontSize: 11, color: d.live ? T.chalk : T.steel }}>· {d.txt}</div>
          ))}
        </div>
        {!debtLedger(s).some((d) => d.live) && (
          <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, marginTop: 6 }}>live audit armed — any in-app session on a debt day gets charged here automatically</div>
        )}
        <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 8 }}>Down sessions after a short night read as context, not regression — the day is exempt from counting toward a stall, and that is the only thing it changes.</div>
        <More c={T.brass}
          deep="Debt costs output before it costs recovery — motor drive and honest RIR fade first, and it shows up as missing tail reps. The audit method: every in-app session logged on a non-clean day is compared to your nearest prior CLEAN session of the same lift at the same set count, and only losses get written. One honest caveat: if the load changed between the two sessions, an entry can muddy — the recap context usually settles it. Attribution, not blame: the grey lines are the sheet-era receipts; white lines are charges the app computed itself."
          forYou={slp.clean ? "CLEAN — the meter is off. Today's sessions get filed as clean baselines that future debt days will be audited against." : `${slp.need - slp.run} night${slp.need - slp.run === 1 ? "" : "s"} from CLEAN — until then, sessions are audited against their clean twins. Tonight ≥7.5 h ${slp.run + 1 >= slp.need ? "stops the meter entirely." : "keeps the reset alive."}`} />
      </Card>
      </Section>

      <Section title="Sleep Rules" meta="the standing orders">
        <Card>
        <Eyebrow>PROTOCOL</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8, fontFamily: mono, fontSize: 10.5, color: T.steel }}>
          <div>· Caffeine cutoff early afternoon · 100 mg &gt; 200 mg on sleep nights</div>
          <div>· Noon lifts land on the stimulant peak — effort feels easier than it is, so rate the last set honestly</div>
          <div>· Dose timing = prescriber territory — this ledger tracks, it does not advise</div>
        </div>
      </Card>
      </Section>

      <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, textAlign: "center", padding: "2px 0" }}>logging lives on NOW · this tab is the ledger</div>

      {/* the anchor */}
      {/* caffeine tail */}
      <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, textAlign: "center", padding: "2px 0" }}>the melatonin experiment + wake signature live on the LAB tab</div>

      
    </div>
  );
}

/* ---------- WHATIF_NOTE — the sandbox was modelling a different athlete ----------
   Every reference point in here was authored and none of them survived the
   audit: 16,500 steps, 1,760 kcal, a 2,450 refeed, 3,500 kcal/lb twice, and an
   Aug 28 projection tile on a block with no date. It also told him that under
   7.5 h "no record or weight increase can become official" — the retired gate,
   stated more forcefully here than anywhere else in the app.

   Rebuilt on the same numbers the rest of the engine uses: his measured step
   average, his measured intake, and KCAL_PER_LB_MIX. The refeed lever is gone
   with the refeed. The date tile is gone with the date. The sleep line now says
   what sleep actually costs, and says plainly that this model cannot show it. */
function WhatIfConsole({ s }) {
  const cur = currentRate(s);
  const stW = stepTarget(s), tdW = observedTDEE(s), ctW = calorieTarget(s);
  const stepRef = stW.gated ? 16000 : stW.avg;
  const calRef = tdW ? tdW.avg : (ctW.gated ? 1900 : ctW.mid);
  const perStep = stW.gated ? 0.35 : stW.kcalPer1k / 1000;
  const [wSteps, setWSteps] = useState(Math.round(stepRef / 500) * 500);
  const [wCal, setWCal] = useState(Math.round(calRef / 25) * 25);
  const [wSlp, setWSlp] = useState(s.sleep.cleanH || 7.5);
  const baseRate = cur.measured ? cur.scale : 1.2;
  const rate = Math.max(0.1, +(baseRate - ((wCal - calRef) * 7) / KCAL_PER_LB_MIX + ((wSteps - stepRef) * perStep * 7) / KCAL_PER_LB_MIX).toFixed(2));
  const bf = bfEst(s);
  const target11 = +(bf.lean / 0.89).toFixed(1);
  const wksToPivot = (s.trend - target11) / rate;
  const pivotD = isoOf(new Date(todayStart().getTime() + Math.max(0, Math.round(wksToPivot * 7)) * DAY));
  const basePivot = isoOf(new Date(todayStart().getTime() + Math.max(0, Math.round(((s.trend - target11) / Math.max(0.1, baseRate)) * 7)) * DAY));
  const shift = Math.round((mk(pivotD) - mk(basePivot)) / DAY);
  const rb = (s.rate && s.rate.band) || [1.0, 1.4];
  const row = (lbl, v, set, step, min, max) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
      <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, width: 74 }}>{lbl}</div>
      <Stepper v={v} set={(x) => set(Math.min(max, Math.max(min, x)))} step={step} min={min} />
    </div>
  );
  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
      <Eyebrow c={T.chalk}>THE LEVERS — SANDBOX ONLY, NOTHING REAL MOVES</Eyebrow>
      {row("STEPS /day", wSteps, setWSteps, 500, 12000, 19000)}
      {row("CAL /day", wCal, setWCal, 25, 1500, 2800)}
      {row("SLEEP avg h", wSlp, setWSlp, 0.25, 5, 9.5)}
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <div><Num size={20} c={rate > rb[1] ? T.brass : T.jade}>{rate}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>LB/WK</div></div>
        <div><Num size={20} c={shift > 3 ? T.brass : T.chalk}>{fmtShort(pivotD)}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>~11% AT THIS PACE {shift !== 0 ? `(${shift > 0 ? "+" : ""}${shift}d)` : ""}</div></div>
      </div>
      <div style={{ fontFamily: body, fontSize: 11.5, color: wSlp < (s.sleep.cleanH || 7.5) ? T.brass : T.steel, marginTop: 10, lineHeight: 1.5 }}>
        {/* The old copy here said that under 7.5 h "no record or weight increase
            can become official" — the retired gate, stated harder than anywhere
            else in the app. What sleep actually changes is invisible to this
            model, and saying so is more useful than a wrong warning. */}
        {wSlp < (s.sleep.cleanH || 7.5)
          ? `At ${wSlp} h your sessions are barely affected — the measured cost is about 2.85% on strength, inside the test-retest error, and nothing here gates a record on it. What this slider CANNOT show you is the part that matters: at a matched deficit, short sleep sends roughly 60% more of what you lose off lean mass. The pound-per-week number above would look identical and the physique underneath it would not.`
          : `At ${wSlp} h the deficit is taking mostly what you want it to take. That is the whole reason this number is on the page — it does not move the lb/wk figure above, it changes what those pounds are made of.`}
      </div>
      <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 8 }}>modelled against YOUR numbers: {Math.round(stepRef).toLocaleString()} steps and {Math.round(calRef).toLocaleString()} kcal as logged, {perStep.toFixed(2)} kcal/step at your bodyweight, {KCAL_PER_LB_MIX.toLocaleString()} kcal/lb · your band is {rb[0]}–{rb[1]} lb/wk, redline {(s.rate || {}).redline || 1.9} · sandbox only, nothing real moves</div>
    </div>
  );
}

function TrialsDesk({ s, setS, save }) {
  const tI = isoOf(todayStart());
  const props3 = trialProposals(s);
  const recs = (s.trials || []).filter((t) => !t.declined);
  const act = (tplId, declined) => { const ns = JSON.parse(JSON.stringify(s)); ns.trials = [...(ns.trials || []), declined ? { tplId, declined: true } : { tplId, started: tI }]; if (!declined) ns.feed.unshift({ d: tI, t: "TRIAL STARTED — " + TRIAL_TPL[tplId].t, how: "you consented with one tap · the day's arm rides TODAY'S PROTOCOL · verdict lands when the blocks finish" }); setS(ns); save(ns); };
  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
      {recs.map((t, i) => { const v = trialVerdict(s, t); const arm = trialArmOn(t, tI); const tpl = trialTpl(t); return (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: v.done ? T.jade : T.brass }}>{v.done ? "◆ FINISHED" : "▸ RUNNING"} · {tpl.t}</div>
          <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 3, lineHeight: 1.5 }}>
            {v.done ? `${tpl.arms[0]}: ${v.a ?? "—"} vs ${tpl.arms[1]}: ${v.b ?? "—"} (${tpl.metric}, ${v.nA + v.nB} blocks). Direction, not gospel — worth one line in the coach dossier.` : arm ? `Block ${arm.block}/${arm.of} · this block's arm: ${tpl.arms[arm.armIdx]} — it's already on TODAY'S PROTOCOL.` : `Scheduled — begins ${fmtShort(t.started)}.`}
          </div>
        </div>
      ); })}
      {props3.map((pr2) => (
        <div key={pr2.id} style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: T.chalk }}>PROPOSED · {pr2.t}</div>
          <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel, marginTop: 3 }}>{pr2.q} {pr2.cycles} blocks of {pr2.blockDays} days, alternating. Measures: {pr2.metric}.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 7 }}>
            <Btn small tone="jade" onClick={() => act(pr2.id, false)}>Start — I consent</Btn>
            <Btn small onClick={() => act(pr2.id, true)}>Not now</Btn>
          </div>
        </div>
      ))}
      {!recs.length && !props3.length && <div style={{ fontFamily: mono, fontSize: 10, color: T.dim }}>nothing proposed right now — eligibility is data-driven and re-checked daily</div>}
    </div>
  );
}
function NightDraft() {
  const raw = useRepoDoc("ledger/coach-draft.md");
  const draft = (() => {
    if (!raw) return null;
    const m = raw.match(/^<!-- (\d{4}-\d{2}-\d{2}) -->/);
    if (m && (mk(isoOf(todayStart())) - mk(m[1])) / DAY <= 2) return raw.replace(/^<!--.*-->\n?/, "");
    return null;
  })();
  if (!draft) return null;
  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
      <Eyebrow c={T.brass}>THE NIGHT SHIFT'S DRAFT — WRITTEN AT 4 AM FOR THIS MEETING</Eyebrow>
      <div style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 6, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{draft.slice(0, 1800)}</div>
    </div>
  );
}

function DossierBlock({ s }) {
  const [d, setD] = useState(null);
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
      {!d ? <Btn full tone="jade" onClick={() => setD(dossierData(s))}>Generate — fresh, right now</Btn> : (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div><Num size={19}>{d.header.trend}</Num><div style={{ fontFamily: mono, fontSize: 8, color: T.dim }}>TREND{d.header.sealed ? " · SEALED" : ""}</div></div>
            <div><Num size={19}>{d.header.bf}%</Num><div style={{ fontFamily: mono, fontSize: 8, color: T.dim }}>BODY FAT</div></div>
            <div><Num size={19}>{d.header.pace}</Num><div style={{ fontFamily: mono, fontSize: 8, color: T.dim }}>LB/WK</div></div>
            <div><Num size={19}>WK {d.header.wk}</Num><div style={{ fontFamily: mono, fontSize: 8, color: T.dim }}>{d.header.d}</div></div>
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: T.jade, marginTop: 8 }}>{d.trust}</div>
          <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 10, lineHeight: 1.55, borderLeft: `2px solid ${T.jade}`, paddingLeft: 9 }}>{d.topline}</div>
          {d.sections.map((sec, i) => (
            <div key={i} style={{ marginTop: 13 }}>
              <Eyebrow>{sec.h}</Eyebrow>
              {sec.items.map((it, j) => (
                <div key={j} style={{ marginTop: 6 }}>
                  <span style={{ fontFamily: mono, fontSize: 9.5, color: T.steel }}>{it.t} — </span>
                  <span style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, lineHeight: 1.5 }}>{it.line}</span>
                </div>
              ))}
            </div>
          ))}
          {d.trials.length > 0 && (
            <div style={{ marginTop: 13 }}>
              <Eyebrow c={T.brass}>TRIALS</Eyebrow>
              {d.trials.map((t, i) => <div key={i} style={{ fontFamily: body, fontSize: 11.5, color: T.chalk, marginTop: 5 }}><span style={{ fontFamily: mono, fontSize: 9.5, color: T.steel }}>{t.t} — </span>{t.line}</div>)}
            </div>
          )}
          <div style={{ marginTop: 13 }}>
            <Eyebrow c={T.jade}>THIS WEEK</Eyebrow>
            <div style={{ fontFamily: body, fontSize: 12, color: T.chalk, marginTop: 5, lineHeight: 1.5 }}>{d.week.verdict}</div>
            {d.week.lines.map((l, i) => <div key={i} style={{ fontFamily: mono, fontSize: 9.5, color: T.steel, marginTop: 3 }}>{l}</div>)}
          </div>
          {d.signoff.length > 0 && (
            <div style={{ marginTop: 13 }}>
              <Eyebrow c={T.orange}>NEEDS YOUR SIGN-OFF</Eyebrow>
              {d.signoff.map((x, i) => <div key={i} style={{ fontFamily: mono, fontSize: 10, color: T.chalk, marginTop: 4 }}>• {x}</div>)}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn small tone="jade" onClick={() => { try { navigator.clipboard.writeText(dossierText(s)); setCopied(true); } catch (e) { setCopied(false); } }}>{copied ? "Copied ✓" : "Copy as text"}</Btn>
            <Btn small onClick={() => { setD(null); setCopied(false); }}>Close</Btn>
          </div>
        </>
      )}
    </div>
  );
}

const COMPOUND_IDS = ["press", "row", "hack", "rdl", "pull", "bench", "dip", "squat"];
/* ---------- REST_NOTE — why isolation moved from 75 s to 90 s ----------
   The 2024 Bayesian meta-analysis compares SHORT (<=60 s) against LONGER
   (>60 s) and finds a small benefit to longer, mediated by volume load — but
   explicitly reports no appreciable difference in hypertrophy once rest exceeds
   about 90 s. That makes ~90 s the point where the measurable return stops, and
   it is therefore the cheapest correct floor: everything below it is giving up
   reps on the back sets for nothing, everything above it costs session time the
   evidence cannot justify.

   75 s sat under that line. On a 4-set isolation lift that is three rests a
   lift, and the reps it costs land on exactly the sets the volume ramp reads.
   90 s is +15 s per rest — about three minutes across a whole session.

   Compounds stay at 150 s: still comfortably past the plateau, and inside the
   2-3 min band that Schoenfeld 2016 supported directly in trained men.

   The bump before the FINAL set is reasoning from the mechanism rather than a
   trial result, and is labelled as such: rest protects volume load, the taper
   sends the last set to failure, and that set is the one the progression engine
   now reads to size the next step. Protecting it is where an extra 30 s buys
   the most. It is a small, cheap, reversible bet — not a finding. */
const REST_BASE = { compound: 150, isolation: 90 };
const REST_TERMINAL_BUMP = 30;
function restFor(exId, nextSetIdx, nSets) {
  const base = COMPOUND_IDS.some((c) => String(exId).indexOf(c) === 0) ? REST_BASE.compound : REST_BASE.isolation;
  const isBeforeTerminal = nSets != null && nextSetIdx != null && nSets >= 2 && nextSetIdx === nSets - 1;
  return isBeforeTerminal ? base + REST_TERMINAL_BUMP : base;
}
/** The one-line prescription, for the card he actually logs from. */
function restLine(exId, nSets) {
  const base = restFor(exId);
  if (!nSets || nSets < 2) return `${base}s between sets`;
  return `${base}s between sets · ${base + REST_TERMINAL_BUMP}s before the last one`;
}

function GymMode({ s, setS, save, slp, sess, dateSel, onClose }) {
  const [idx, setIdx] = useState(0);
  const [setN, setSetN] = useState(0);
  const [phase, setPhase] = useState("lift");
  const [t, setT] = useState(0);
  const [reps, setReps] = useState({});
  const [rir, setRir] = useState({});
  const [rirEnd, setRirEnd] = useState({});
  const [gskip, setGskip] = useState({});
  /* Pace is MEASURED here, not asked — the timer already knows. Every rest gets
     counted, and a rest cut short by more than half its prescription counts as
     compressed. See PACE_NOTE for why the threshold is coarse: the evidence
     resolves "under about a minute" versus "not", and nothing finer. */
  const [rests, setRests] = useState({ n: 0, cut: 0 });
  const gymKey = "prep-ledger-gymdraft-" + dateSel;
  useEffect(() => {
    try { const d = JSON.parse(localStorage.getItem(gymKey) || "null"); if (d) { setReps(d.reps || {}); setRir(d.rir || {}); setRirEnd(d.rirEnd || {}); setGskip(d.gskip || {}); setRests(d.rests || { n: 0, cut: 0 }); if (d.idx != null) setIdx(d.idx); if (d.setN != null) setSetN(d.setN); } } catch (e) {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(gymKey, JSON.stringify({ reps, rir, rirEnd, gskip, rests, idx, setN })); } catch (e) {}
  }, [reps, rir, rirEnd, gskip, rests, idx, setN, gymKey]);
  const ex = sess.ex[idx];
  const rp2 = rirPlan(s, ex, slp);
  const getR = (e2) => reps[e2.id] ?? e2.tgt.slice();
  const al2 = bodyAlarm(s, slp);
  useEffect(() => {
    if (phase !== "rest") return;
    const iv = setInterval(() => setT((x) => { if (x <= 1) { clearInterval(iv); setPhase("lift"); try { navigator.vibrate && navigator.vibrate(200); } catch (e) {} return 0; } return x - 1; }), 1000);
    return () => clearInterval(iv);
  }, [phase]);
  const doneSet = () => {
    const nSets = getR(ex).length;
    if (setN + 1 < nSets) { setSetN(setN + 1); setT(restFor(ex.id, setN + 1, nSets)); setPhase("rest"); setRests((r) => ({ ...r, n: r.n + 1 })); }
    else setPhase("lift-done");
  };
  const nextLift = () => { if (idx + 1 < sess.ex.length) { setIdx(idx + 1); setSetN(0); setPhase("lift"); } else setPhase("all-done"); };
  const finish = () => {
    const entries = sess.ex.filter((e2) => !gskip[e2.id]).map((e2) => ({ id: e2.id, n: e2.n, w: e2.w, tgt: e2.tgt, reps: getR(e2), isDebutNow: e2.isDebutNow, rir: rir[e2.id] ?? null, rirEnd: rirEnd[e2.id] ?? null }));
    try { localStorage.removeItem(gymKey); } catch (e) {}
    /* n-gated like every other read in here: under three rests there is no
       session-level statement to make, so it stays unknown rather than guessed. */
    const pace = rests.n >= 3 ? (rests.cut / rests.n >= 0.5 ? PACE.rushed : PACE.normal) : null;
    const { s: ns } = completeSession(s, dateSel, entries, slp, { note: "gym mode", niggles: [], skipped: sess.ex.filter((e2) => gskip[e2.id]).map((e2) => ({ id: e2.id })), pace });
    setS(ns); save(ns); onClose();
  };
  const big = { fontFamily: mono, fontWeight: 800, letterSpacing: "-0.02em" };
  return (
    <div style={{ position: "fixed", inset: 0, background: T.ink, zIndex: 60, display: "flex", flexDirection: "column", padding: "0 16px", paddingTop: "calc(env(safe-area-inset-top, 24px) + 14px)", paddingBottom: "calc(env(safe-area-inset-bottom, 10px) + 12px)", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: mono, fontSize: 9.5, color: T.dim }}>GYM MODE · LIFT {idx + 1}/{sess.ex.length}</span>
        <span onClick={onClose} style={{ fontFamily: mono, fontSize: 10, color: T.dim, cursor: "pointer" }}>exit ✕</span>
      </div>
      {al2 && <div style={{ fontFamily: mono, fontSize: 9.5, color: T.brass, marginTop: 6 }}>⚠ ALARM DAY — every 0 becomes a 1 · no official attempts</div>}
      {phase === "rest" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.dim, letterSpacing: "0.15em" }}>REST</div>
          <div style={{ ...big, fontSize: 84, color: T.jade }}>{Math.floor(t / 60)}:{String(t % 60).padStart(2, "0")}</div>
          <div style={{ fontFamily: mono, fontSize: 10, color: T.steel }}>next: SET {setN + 1} of {getR(ex).length} · {ex.n}</div>
          {/* A rest counts as CUT when the actual rest lands under 60 s — the
              threshold the meta-analysis actually resolves, not a fraction of
              the prescription. See REST_NOTE and PACE_NOTE. */}
          <Btn small onClick={() => { const full = restFor(ex.id, setN, getR(ex).length); if (full - t < 60) setRests((r) => ({ ...r, cut: r.cut + 1 })); setT(0); setPhase("lift"); }}>Skip rest</Btn>
        </div>
      ) : phase === "lift-done" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
          <H size={26}>{ex.n} — done</H>
          <div style={{ fontFamily: mono, fontSize: 11, color: T.steel }}>logged: {getR(ex).join(" · ")} at {ex.w}</div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, letterSpacing: "0.1em" }}>FIRST SET RIR · optional · 1 = honest</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[0, 1, 2, 3].map((v) => <button key={v} onClick={() => setRir({ ...rir, [ex.id]: rir[ex.id] === v ? null : v })} style={{ fontFamily: mono, fontSize: 16, padding: "10px 16px", borderRadius: 8, border: `1px solid ${rir[ex.id] === v ? (v === 0 ? T.brass : T.jade) : T.line}`, background: T.plate2, color: rir[ex.id] === v ? (v === 0 ? T.brass : T.jade) : T.steel }}>{v === 3 ? "3+" : v}</button>)}
            </div>
            <div style={{ fontFamily: mono, fontSize: 9, color: T.dim, letterSpacing: "0.1em", marginTop: 12 }}>LAST SET RIR · optional · 0 = it was the failure set</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              {[0, 1, 2, 3].map((v) => <button key={v} onClick={() => setRirEnd({ ...rirEnd, [ex.id]: rirEnd[ex.id] === v ? null : v })} style={{ fontFamily: mono, fontSize: 16, padding: "10px 16px", borderRadius: 8, border: `1px solid ${rirEnd[ex.id] === v ? (v === 0 ? T.jade : T.brass) : T.line}`, background: T.plate2, color: rirEnd[ex.id] === v ? (v === 0 ? T.jade : T.brass) : T.steel }}>{v === 3 ? "3+" : v}</button>)}
            </div>
          </div>
          <Btn full tone="jade" onClick={nextLift}>{idx + 1 < sess.ex.length ? "NEXT LIFT ▸" : "FINISH SESSION"}</Btn>
          <button onClick={() => { setGskip({ ...gskip, [ex.id]: true }); if (idx + 1 < sess.ex.length) { setIdx(idx + 1); setSetN(0); setPhase("lift"); } }} style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, background: "none", border: `1px solid ${T.line}`, borderRadius: 8, padding: "9px", width: "100%", marginTop: 8 }}>skip this lift — goes on the record, no phantom reps</button>
        </div>
      ) : phase === "all-done" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
          <H size={26}>Session complete</H>
          <div style={{ fontFamily: mono, fontSize: 11, color: T.steel, lineHeight: 1.7 }}>{sess.ex.map((e2) => `${e2.n}: ${getR(e2).join(",")} @ ${e2.w}`).join("\n")}</div>
          <Btn full tone="jade" onClick={finish}>LOG IT — receipt + debrief</Btn>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
          <H size={30}>{ex.n}</H>
          <div style={{ fontFamily: mono, fontSize: 12, color: T.steel }}>{ex.w} · target {ex.tgt.join(",")}{ex.isDebutNow ? " · FIRST RUN — log what it gives" : ""}</div>
          {ex.cue && <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim }}>{ex.cue}</div>}
          <div style={{ marginTop: 10 }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: T.dim }}>SET {setN + 1} OF {getR(ex).length} · <span style={{ color: rp2.plan[setN] === 0 ? T.brass : rp2.plan[setN] === 1 ? T.chalk : T.jade, fontWeight: 700 }}>RIR {rp2.plan[setN] ?? "—"}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
              <button onClick={() => { const r2 = getR(ex).slice(); r2[setN] = Math.max(0, r2[setN] - 1); setReps({ ...reps, [ex.id]: r2 }); }} style={{ ...big, fontSize: 40, width: 64, height: 64, borderRadius: 12, border: `1px solid ${T.line}`, background: T.plate2, color: T.chalk }}>−</button>
              <div style={{ ...big, fontSize: 72, color: T.chalk, minWidth: 96, textAlign: "center" }}>{getR(ex)[setN]}</div>
              <button onClick={() => { const r2 = getR(ex).slice(); r2[setN] = r2[setN] + 1; setReps({ ...reps, [ex.id]: r2 }); }} style={{ ...big, fontSize: 40, width: 64, height: 64, borderRadius: 12, border: `1px solid ${T.line}`, background: T.plate2, color: T.chalk }}>+</button>
            </div>
          </div>
          <Btn full tone="jade" onClick={doneSet}>SET DONE {setN + 1 < getR(ex).length ? "→ REST " + restFor(ex.id, setN + 1, getR(ex).length) + "s" : "→"}</Btn>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: "transparent" }}>.</span>
            <span onClick={nextLift} style={{ fontFamily: mono, fontSize: 10, color: T.dim, cursor: "pointer" }}>skip lift ▸</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- NEGOTIATOR_NOTE — a deadline nobody set, priced with dead constants ----------
   This card solved backwards from a hardcoded 2026-09-05, which is a date that
   exists nowhere in his plan, and priced the answer with 3,500 kcal/lb, a 1,700
   calorie floor and a 1,760 base — three numbers the engine had already
   replaced. GOALS.md forbids building urgency mechanics around a date he never
   picked, so the date stepper is now an offset from TODAY: "how long am I
   willing to give this", not "here is your deadline". */
function NegotiatorConsole({ s }) {
  const [tBF, setTBF] = useState(11);
  const [wkOff, setWkOff] = useState(8);
  const bf = bfEst(s);
  const cur = currentRate(s);
  const fl = calorieFloor(s);
  const ct = calorieTarget(s);
  const stN = stepTarget(s);
  const perStepN = stN.gated ? 0.35 : stN.kcalPer1k / 1000;
  const calBase = ct.gated ? (observedTDEE(s) ? observedTDEE(s).avg : 1900) : ct.mid;
  const rbN = (s.rate && s.rate.band) || [1.0, 1.4];
  const baseRate = cur.measured ? cur.scale : 1.2;
  const goalDate = isoOf(new Date(todayStart().getTime() + Math.round(wkOff * 7) * DAY));
  const targetW = +(bf.lean / (1 - tBF / 100)).toFixed(1);
  const wks = Math.max(0.5, wkOff);
  const need = +((s.trend - targetW) / wks).toFixed(2);
  const gap = +(need - baseRate).toFixed(2);
  const extraSteps = gap > 0 ? Math.round((gap * KCAL_PER_LB_MIX) / 7 / perStepN / 100) * 100 : 0;
  const wkD = Object.entries(s.dailyLogs).filter(([d]) => [0, 6].includes(mk(d).getDay()) && s.dailyLogs[d].cal);
  const wdD = Object.entries(s.dailyLogs).filter(([d]) => ![0, 6].includes(mk(d).getDay()) && s.dailyLogs[d].cal);
  const weekendGap = wkD.length >= 2 && wdD.length >= 4 ? Math.round(wkD.reduce((a, [, v]) => a + v.cal, 0) / wkD.length - wdD.reduce((a, [, v]) => a + v.cal, 0) / wdD.length) : null;
  const row = (lbl, v, set, step, min, max, fmt) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
      <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, width: 84 }}>{lbl}</div>
      <Stepper v={v} set={(x) => set(Math.min(max, Math.max(min, x)))} step={step} min={min} />
      {fmt && <span style={{ fontFamily: mono, fontSize: 10, color: T.steel }}>{fmt}</span>}
    </div>
  );
  return (
    <div style={{ marginTop: 10, borderTop: `1px solid ${T.line}`, paddingTop: 10 }}>
      <Eyebrow c={T.chalk}>THE GOAL — IT SOLVES BACKWARD</Eyebrow>
      {row("TARGET BF %", tBF, setTBF, 0.5, 9, 14)}
      {row("GIVE IT (wks)", wkOff, setWkOff, 1, 2, 26, "~" + fmtShort(goalDate) + " — an offset from today, not a deadline")}
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <div><Num size={20} c={need > rbN[1] ? T.brass : T.jade}>{need}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>LB/WK NEEDED</div></div>
        <div><Num size={20}>{baseRate}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>YOUR PACE NOW</div></div>
        <div><Num size={20}>{targetW}</Num><div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim }}>GOAL WEIGHT</div></div>
      </div>
      <div style={{ fontFamily: body, fontSize: 11.5, color: need > rbN[1] ? T.brass : T.chalk, marginTop: 10, lineHeight: 1.55 }}>
        {need > rbN[1]
          ? `Verdict: that would need ${need} lb/wk — past your ${rbN[0]}–${rbN[1]} band. The honest fixes: give it ${Math.ceil((s.trend - targetW) / rbN[1] - wks)} more weeks, or raise the target to ~${Math.max(9, +((1 - bf.lean / (s.trend - rbN[1] * wks)) * 100).toFixed(1))}%. Losing muscle to hit a date is a trade this app will not price — and you have not set a date, which is the single best thing about your situation.`
          : gap <= 0.05
          ? `Verdict: your current pace already covers it — arrive ~${fmtShort(isoOf(new Date(todayStart().getTime() + Math.round(((s.trend - targetW) / Math.max(0.1, baseRate)) * 7) * DAY)))} with ${Math.abs(Math.round((baseRate - need) * wks * 10) / 10)} lb of slack. Cheapest plan: change nothing.`
          : extraSteps <= 2500
          ? `Verdict: reachable without touching food. +${extraSteps.toLocaleString()} steps/day covers the whole gap — steps first because they cost you nothing you are trying to keep, and your ${fl.floor} calorie floor stays untouched.`
          : (() => { const cut = Math.round(((gap - (2000 * perStepN * 7) / KCAL_PER_LB_MIX) * KCAL_PER_LB_MIX) / 7 / 25) * 25; const lands = calBase - cut; return `Verdict: steps alone will not cover it. Plan: +2,000 steps/day AND −${cut} cal/day, landing at ${lands}${lands < fl.floor ? ` — which is under your ${fl.floor} floor, so the timeline has to give instead` : ` (floor is ${fl.floor}, respected)`}. Take it to your coach as a proposal, not a decision.`; })()}
        {weekendGap != null && weekendGap > 120 ? ` One more thing your record says: weekends run ~+${weekendGap} cal over weekdays — schedule any tightening Mon–Fri, where your adherence actually lives.` : ""}
      </div>
      <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, marginTop: 8 }}>sandbox — proposes only · steps priced at your measured {perStepN.toFixed(2)} kcal/step · floor {fl.floor}, derived from energy availability at your lean mass · your band {rbN[0]}–{rbN[1]} lb/wk · no date is set anywhere in this app</div>
    </div>
  );
}

function HistTab({ s, setS, save }) {
  const [mapOpen, setMapOpen] = useState(false);
  const [open, setOpen] = useState(null);
  const [labOpen, setLabOpen] = useState(null);
  const [secOpen, setSecOpen] = useState({ speaking: true, gathering: true });
  const [deskOpen, setDeskOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [gatherAll, setGatherAll] = useState(false);
  const liveWks = liveRollups(s);
  const first = ROLLUPS[ROLLUPS.length - 1];
  const latest = (liveWks.find((w) => w.avgW != null || w.avgCal != null)) || ROLLUPS[0];
  const wDelta = first && latest && first.avgW && latest.avgW ? +(first.avgW - latest.avgW).toFixed(1) : null;
  /* One protein standard across the whole history — the sheet era and the live
     weeks are now graded by the same derived floor. */
  const proFloorH = proteinTarget(s).lo;
  const proHitTot = ROLLUPS.reduce((a, w) => a + rollupHits(w, proFloorH), 0) + liveWks.reduce((a, w) => a + rollupHits(w, proFloorH), 0);
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

      {askOpen && <AskLedger s={s} setS={setS} save={save} onClose={() => setAskOpen(false)} />}
      {mapOpen && <MapView s={s} onClose={() => setMapOpen(false)} />}
      <Card style={{ padding: 11, cursor: "pointer" }} onClick={() => setMapOpen(true)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Eyebrow c={T.jade}>🗺 THE MAP</Eyebrow>
            <div style={{ fontFamily: body, fontSize: 11, color: T.steel, marginTop: 3 }}>All 50 instruments, traced to the logging that feeds them.</div>
          </div>
          <span style={{ fontFamily: mono, fontSize: 14, color: T.jade }}>▸</span>
        </div>
      </Card>
      <RedCellCard />
      <Section title="The Lab" meta={(() => { const g2 = labGroups(s); return `${g2.reduce((a3, g3) => a3 + g3.cards.length, 0)} instruments · ${g2.reduce((a3, g3) => a3 + g3.live, 0)} live`; })()} c={T.jade}>
        {(() => {
        const groups = labGroupsM(s);
        const tot = groups.reduce((a, g) => a + g.cards.length, 0);
        const totLive = groups.reduce((a, g) => a + g.live, 0);
        const totArmed = groups.reduce((a, g) => a + g.armed, 0);
        const renderCard = (a) => (
          <Card key={a.id} style={{ padding: 12, cursor: "pointer" }} accent={a.status === "LIVE" ? T.jade : undefined}>
            <div onClick={() => setLabOpen(labOpen === a.id ? null : a.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                <div style={{ fontFamily: disp, fontWeight: 600, fontSize: 15.5, textTransform: "uppercase", color: a.status === "LOCKED" ? T.steel : T.chalk }}>{a.t}</div>
                <Stamp st={a.status} />
              </div>
              <div style={{ fontFamily: body, fontSize: 11.5, color: T.dim, marginTop: 3 }}>{plainify(a.tag)}</div>
              {(a.lines || []).map((l, i) => (
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
                <div style={{ fontFamily: body, fontSize: 12.5, color: T.steel, marginTop: 5, lineHeight: 1.55 }}>{plainify(a.deep)}</div>
                <div style={{ marginTop: 10 }}>
                  <Eyebrow c={a.status === "LIVE" ? T.jade : T.brass}>FOR YOU · RIGHT NOW</Eyebrow>
                  <div style={{ fontFamily: body, fontSize: 12.5, color: T.chalk, marginTop: 5, lineHeight: 1.55 }}>{plainify(a.forYou)}</div>
                </div>
                {a.action && (
                  <div style={{ marginTop: 10 }}>
                    <Btn small tone="jade" onClick={(e) => { e.stopPropagation(); const ns = JSON.parse(JSON.stringify(s)); ns.creatine = { start: isoOf(todayStart()) }; ns.feed.unshift({ d: isoOf(todayStart()), t: "CREATINE STARTED", how: "5 g/day begins inside the sealed window — the water bump files itself under quarantine (Kreider 2017)" }); setS(ns); save(ns); }}>Log creatine start — today</Btn>
                  </div>
                )}
                {a.id === "whatif" && <WhatIfConsole s={s} />}
                {a.id === "negotiator" && <NegotiatorConsole s={s} />}
                {a.id === "trialsdesk" && <TrialsDesk s={s} setS={setS} save={save} />}
                {a.id === "dossier" && <DossierBlock s={s} />}
              </div>
            )}
          </Card>
        );
        return (
          <>
            {(() => {
              const wkAgo = isoOf(new Date(todayStart().getTime() - 7 * DAY));
              const freshMap = {};
              (s.feed || []).forEach((f) => { if (f.t && f.t.indexOf("LAB LIVE — ") === 0 && f.d >= wkAgo) freshMap[f.t.replace("LAB LIVE — ", "")] = f.d; });
              const secs = labSections(s);
              const row = (a) => labOpen === a.id ? (
                <div key={a.id} style={{ margin: "8px 0" }}>{renderCard(a)}</div>
              ) : (
                <div key={a.id} onClick={() => setLabOpen(a.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 0", borderBottom: `1px solid ${T.line}`, cursor: "pointer" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: stampColor(a.status), flexShrink: 0 }} />
                  <span style={{ fontFamily: disp, fontWeight: 600, fontSize: 14.5, textTransform: "uppercase", color: a.status === "LOCKED" ? T.steel : T.chalk, flex: 1, lineHeight: 1.2 }}>{a.t.split(" — ")[0]}</span>
                  <span style={{ fontFamily: mono, fontSize: 9.5, color: freshMap[a.t] ? T.jade : a.status === "LIVE" || a.status === "TRACKING" ? T.jade : a.status === "ARMED" ? T.brass : T.dim, whiteSpace: "nowrap" }}>
                    {freshMap[a.t] ? `new · ${fmtShort(freshMap[a.t])}` : a.status === "ARMED" && a.prog ? `${a.prog.n}/${a.prog.need}` : a.status.toLowerCase()} <span style={{ color: T.dim }}>▸</span>
                  </span>
                </div>
              );
              return (
                <Card accent={T.jade} style={{ padding: "12px 12px 10px" }}>
                  <Eyebrow c={T.jade}>THE LAB · {totLive} SPEAKING · {totArmed} GATHERING · {tot} TOTAL</Eyebrow>
                  {(() => { const pg = prophetGrades(s); const first = (s.forecasts || [])[0];
                    const firstGrade = first ? fmtShort(isoOf(new Date(mk(first.d).getTime() + 7 * DAY))) : "~1 week out";
                    return (
                      <div onClick={() => { setSecOpen({ ...secOpen, gathering: true, models: true }); setLabOpen("prophet"); }} style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.04em", color: pg.n >= 2 ? T.jade : T.brass, marginTop: 6, cursor: "pointer", lineHeight: 1.5 }}>
                        {pg.n >= 2
                          ? `MACHINE TRUST · typical miss ±${pg.mae} lb · bias ${pg.bias > 0 ? "+" + pg.bias + " (runs optimistic)" : pg.bias < 0 ? pg.bias + " (runs pessimistic — you beat it)" : "0.00 (dead-on)"} — read every date below through this ▸`
                          : `MACHINE TRUST · the lab is grading its own predictions against reality — first marks ${firstGrade} ▸`}
                      </div>
                    ); })()}
                  {(() => { const pr3 = trialProposals(s); const run3 = (s.trials || []).filter((t) => !t.declined && !trialVerdict(s, t).done).length; return (
                    <div onClick={() => setDeskOpen(!deskOpen)} style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.04em", color: run3 ? T.brass : T.chalk, marginTop: 6, cursor: "pointer" }}>
                      ⚗ TRIALS DESK · {run3 ? `${run3} running` : "none running"} · {pr3.length} proposed {deskOpen ? "▾" : "▸"}
                    </div>
                  ); })()}
                  {deskOpen && <TrialsDesk s={s} setS={setS} save={save} />}
                  <div onClick={() => setAskOpen(true)} style={{ fontFamily: mono, fontSize: 9.5, letterSpacing: "0.04em", color: T.jade, marginTop: 5, cursor: "pointer" }}>🜁 ASK THE LEDGER — any question, answered from your data ▸</div>
                  <div style={{ fontFamily: body, fontSize: 11, color: T.dim, marginTop: 4 }}>Tap any line for the full story, in plain words. Fresh verdicts carry their date.</div>
                  {secs.map((sec) => {
                    const openSec = secOpen[sec.k] !== undefined ? secOpen[sec.k] : false;
                    const cards = sec.k === "gathering" && !gatherAll ? sec.cards.slice(0, 5) : sec.cards;
                    return (
                      <div key={sec.k}>
                        <div onClick={() => setSecOpen({ ...secOpen, [sec.k]: !openSec })} style={{ fontFamily: mono, fontSize: 9, letterSpacing: "0.12em", color: T.dim, marginTop: 12, cursor: "pointer" }}>{sec.title} {openSec ? "" : "▸"}</div>
                        {openSec && sec.sub && <div style={{ fontFamily: body, fontSize: 10.5, color: T.dim, marginTop: 2 }}>{sec.sub}</div>}
                        {openSec && cards.map(row)}
                        {openSec && sec.k === "gathering" && sec.cards.length > 5 && (
                          <div onClick={() => setGatherAll(!gatherAll)} style={{ fontFamily: mono, fontSize: 9.5, color: T.dim, padding: "9px 0", cursor: "pointer" }}>{gatherAll ? "▴ show the closest five only" : `▸ ${sec.cards.length - 5} more gathering — further from speaking`}</div>
                        )}
                      </div>
                    );
                  })}
                </Card>
              );
            })()}

          </>
        );
      })()}
      </Section>

      <Section title="Live Weeks" meta={`${liveWks.length} accruing${liveWks.length ? " · wk " + liveWks[0].wk + " current" : ""}`} c={T.orange}>
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
                <span style={{ color: w.proN && rollupHits(w, proFloorH) / w.proN >= 0.6 ? T.jade : T.steel }}>pro {rollupHits(w, proFloorH)}/{w.proN}</span>
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
      </Section>

      <Section title="Sheet Era · Wks 1–6" meta="the origin story · 42 days">
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
                <span style={{ color: w.proN && rollupHits(w, proFloorH) / w.proN >= 0.6 ? T.jade : T.steel }}>pro {rollupHits(w, proFloorH)}/{w.proN}</span>
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
      </Section>
    </div>
  );
}

/* The four rooms he opens on purpose. Fixed order, always. Each carries one
   line of live state so the list itself answers "is there anything in there"
   without him having to go and look — which is the value adaptive nav promises
   and fails to deliver, without moving anything. */
function MoreTab({ s, go, openRules, openCoach }) {
  const rooms = [
    { k: "HIST", t: "LAB", sub: "the instruments — every verdict the engine is currently willing to make",
      hint: (() => { try { return labStatusList(s).filter((c) => c.status === "LIVE").length + " speaking now"; } catch (e) { return null; } })() },
    { k: "QUEUE", t: "QUEUE", sub: "what is earned, what is waiting, and the gate on each",
      hint: (() => { try { return (s.queue || []).filter((q) => !q.done).length + " open"; } catch (e) { return null; } })() },
    { k: "SLEEP", t: "SLEEP", sub: "your clock, the lever, and the caffeine tail",
      hint: (() => { try { const an = sleepAnchor(s); return an.measured ? an.curH + " h average" : "needs bed + wake times"; } catch (e) { return null; } })() },
    { k: "BODY", t: "BODY", sub: "weight, trend, and the body-fat band at its real width",
      hint: (() => { try { const b = bfEst(s); return b.pct + "% · " + b.lo + "–" + b.hi; } catch (e) { return null; } })() },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <H size={21}>More</H>
        <Eyebrow>the rooms you open on purpose — nothing here ever moves on its own</Eyebrow>
      </div>
      {rooms.map((r) => (
        <Card key={r.k} style={{ padding: "13px 14px", cursor: "pointer" }} onClick={() => go(r.k)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: disp, fontWeight: 700, fontSize: 17, color: T.chalk, textTransform: "uppercase" }}>{r.t}</div>
              <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel, marginTop: 2, lineHeight: 1.45 }}>{r.sub}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {r.hint ? <div style={{ fontFamily: mono, fontSize: 9.5, color: T.dim }}>{r.hint}</div> : null}
              <span style={{ fontFamily: mono, fontSize: 15, color: T.steel }}>▸</span>
            </div>
          </div>
        </Card>
      ))}
      <Card style={{ padding: "11px 14px", cursor: "pointer" }} onClick={openCoach}>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: T.chalk }}>COACH <span style={{ color: T.dim }}>— the handoff sheet</span></div>
      </Card>
      <Card style={{ padding: "11px 14px", cursor: "pointer" }} onClick={openRules}>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: T.chalk }}>RULES <span style={{ color: T.dim }}>— house laws, sync, backup, reset</span></div>
      </Card>
      <div style={{ fontFamily: mono, fontSize: 8.5, color: T.dim, textAlign: "center", padding: "4px 8px 0", lineHeight: 1.6 }}>
        these four used to sit in the bottom bar competing for attention every day · one predictable tap, same place every time
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
          <div style={{ marginTop: 10 }}><DossierBlock s={s} /><NightDraft /></div>
        <Eyebrow>{fmtShort(isoOf(todayStart()))} · WK {weekDay().wk} · {s.phase} · GENERATED LIVE</Eyebrow>
        <div style={{ display: "flex", gap: 18, marginTop: 16, flexWrap: "wrap" }}>
          <div><Num size={24} c={T.jade}>{s.trend}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>TREND</div></div>
          <div><Num size={24}>{bf.pct}%</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>EST BF {s.model.err}</div></div>
          <div><Num size={24}>{cur.fat}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>FAT/WK{cur.measured ? " · MEASURED" : ""}</div></div>
          <div><Num size={24} c={rec.band === "GREEN" ? T.jade : T.brass}>{rec.flags.length}/{rec.watched}</Num><div style={{ fontFamily: mono, fontSize: 9, color: T.dim }}>RECOVERY FLAGS</div></div>
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

/* ---------- RULEBOOK_NOTE — the page that describes the app, describing an app that changed ----------
   This was twelve hardcoded sentences that nothing checked. Four of them had
   drifted into describing behaviour the engine no longer performs: OWNERSHIP
   and SLEEP both still promised the clean-day gate that came out in v3.99.19,
   PROTEIN still named 175 as a constant after it became derived, and RATE quoted
   thresholds in absolute pounds that are now known to tighten as he leans out.

   That is the same defect as a proposal whose apply() does nothing — text making
   a claim the code does not keep — and it is worse here, because this is the
   page that tells him what the app IS.

   So the rules now READ FROM the engine rather than restating it, and a test
   binds every derived figure back to the function that produces it. A rule
   cannot silently disagree with its implementation any more: if the threshold
   moves, either the sentence moves with it or the suite goes red. */
function rulebook(s) {
  const pt = proteinTarget(s), fl = calorieFloor(s), ct = calorieTarget(s);
  const te = typicalError(s, null), bw = s.trend || 1;
  const pct = (lb) => ((lb / bw) * 100).toFixed(2);
  const acsmLb = +(0.01 * bw).toFixed(1);
  return [
    ["ADAPTIVE", "Session targets, earned loads, and the queue update themselves from what you log. Calorie & phase changes arm themselves from trend data but take one tap — nothing macro moves invisibly."],
    ["RATE", `IF under ${s.rate.floor}/wk two weeks → restore steps first, THEN trim — steps because adding them does not deepen the food deficit, and deficit size is the variable the trained-population evidence links to lean-mass loss. IF at or over ${s.rate.redline} → redline, add back, coach flag. Both numbers are pounds, which is a problem: at ${bw} lb they are ${pct(s.rate.floor)}% and ${pct(s.rate.redline)}% of bodyweight, and the redline sits above the ${acsmLb} lb that ${(1).toFixed(0)}%/wk works out to for you. There is an open proposal to restate the band in %BW.`],
    ["STRUCTURE", "One structural change per session — auto-picked from the queue. Rep progression unlimited."],
    ["OWNERSHIP", `A new best waits for ONE repeat before it becomes the standard, and a session that clears the old line by two standard errors banks on the spot. The bar is your own measured spread — ±${te.reps} reps per set, from ${te.n} paired sets at identical load. Sleep is not part of this: measurement error does not care how you slept, and it applies to every record rather than a sleep-selected minority.`],
    ["OPENERS", "The taper asks for a 2-RIR opener and one terminal set to failure. Two openers ground out at RIR 0 and the load holds until an honest one lands — a grind is not an earn."],
    ["SIGNALS", "Last-set RIR is the one that sizes the next jump; the opener only feeds the hold governor. Joint flags three times in three weeks surface on NOW as a pattern rather than a day. Waist is still an unlogged input — until entries exist, it changes nothing and the app will not pretend otherwise."],
    ["SCALE", "Fasted · post-void · pre-food. Once a day. Sealed windows excluded. Trend is the hero — a single reading carries several pounds of water and means nothing on its own."],
    ["EVENTS", "Estimate once, after, never at the table. Compensation does not exist in this app."],
    ["PROTEIN", `${pt.straddles ? `${pt.lo}–${pt.hi} g — ${pt.g} is the middle of that range, and the range is the honest answer: ${pt.lo} is ${PROTEIN_FLOOR_G_PER_KG} g per kg of your ${pt.ffmKg} kg of lean mass, ${pt.hi} is the lean-subgroup number, and your body-fat interval (${pt.bfLo}–${pt.bfHi}%) straddles the ${LEAN_SUBGROUP_BF}% line that separates them` : `${pt.g} g, every day, derived from your ${pt.ffmKg} kg of lean mass at ${pt.perKg} g/kg`} — not a constant. Protein is a FLOOR: over it is not a miss. It does not rise on training days: the only study that compared day types found requirement HIGHER on rest days. A miss fixed inside 24 h extends the standard.`],
    ["SLEEP", `A night under ${DEBT_LAST_H} h, or a three-night mean under ${DEBT_MEAN3_H}, flags the session. What that flag buys you is protection — the day cannot count toward a stall, so you are never deloaded for a bad night. It does NOT block a record or shrink the step; that rule was retired because acute sleep loss costs about 2.85% on strength, which is inside the test-retest noise, and no trial has ever tested damping progression on low-readiness days. Your ${s.sleep.cleanH} h target is a separate question and still stands — in a deficit, short sleep shifts what you lose toward lean mass.`],
    ["FOOD", `${ct.gated ? "Calories fall back to the phase band until there are enough clean days to measure your own maintenance." : `${ct.lo}–${ct.hi}, from your measured maintenance minus the deficit your own rate band asks for.`} The floor is ${fl.floor} — ${EA_SPARING} kcal per kg of lean mass plus what training costs, not a round number. No position stand anywhere states an absolute calorie floor for an athlete; every one of them indexes to lean mass.`],
    ["AUTHORITY", "Machine swaps, ladder graduations, the pivot call — coach territory. The app proposes; humans authorize."],
    ["ATTENTION", "From wk 10: mirror & measurements outrank the scale. The app rewards logged behavior, never checking."],
    ["EVIDENCE", "Every rule above names what it rests on, and says so when it rests on nothing. Rules retired for having no evidence behind them: the clean-sleep gate on records, the weekly refeed's benefits, and defending load rather than effort on a cut. That is the mechanism working."],
  ];
}
function Rules({ s, onClose, onReset, onExport, onImport, sync, onSync }) {
  const [tok, setTok] = useState("");
  const [hasTok, setHasTok] = useState(() => { try { return !!localStorage.getItem(TOKEN_KEY); } catch (e) { return false; } });
  const rules = rulebook(s);
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
          <Eyebrow c={T.brass}>THE LANGUAGE — TAP ANY TERM</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {Object.keys(GLOSSARY).map((k) => (
              <span key={k} style={{ fontFamily: mono, fontSize: 9.5, padding: "5px 9px", borderRadius: 999, border: `1px solid ${T.line}`, color: T.steel }}><Term k={k} c={T.steel}>{GLOSSARY[k][0]}</Term></span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 22, borderTop: `1px solid ${T.line}`, paddingTop: 14 }}>
          <Eyebrow c={T.brass}>THE MAP — SIX TABS, ONE SENTENCE EACH</Eyebrow>
          <div style={{ fontFamily: body, fontSize: 12, color: T.steel, marginTop: 8, lineHeight: 1.8 }}>
            <span style={{ color: T.chalk }}>NOW</span> — do: every daily log lives here. · <span style={{ color: T.chalk }}>TRAIN</span> — lift: today's session, generated. · <span style={{ color: T.chalk }}>QUEUE</span> — what's coming, and what it takes. · <span style={{ color: T.chalk }}>BODY</span> — is it working. · <span style={{ color: T.chalk }}>SLEEP</span> — the master lever's ledger. · <span style={{ color: T.chalk }}>LAB</span> — the science, the record, the proof.
          </div>
        </div>
        <div style={{ marginTop: 22, borderTop: `1px solid ${T.line}`, paddingTop: 14 }}>
          <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.line}` }}>
            <Eyebrow c={T.jade}>FAMILY — ONE APP, MANY PEOPLE</Eyebrow>
            <div style={{ fontFamily: body, fontSize: 11.5, color: T.steel, marginTop: 5, lineHeight: 1.5 }}>Each person is a spec, not an app. Their data lives on their own phone under their own name; this full cockpit stays yours.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {Object.keys(KIT_SPECS).map((k2) => <Btn key={k2} small onClick={() => { localStorage.setItem(KIT_KEY, k2); window.location.reload(); }}>Open as {KIT_SPECS[k2].name}</Btn>)}
            </div>
          </div>
          <BackupsBlock />
          <ApiKeyBlock />
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
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
                <Eyebrow c={T.brass}>SYNC DOCTOR — the pipe, in the open</Eyebrow>
                {(() => { const ok9 = +(localStorage.getItem("pl-lastsync") || 0); let se9 = null; try { se9 = JSON.parse(localStorage.getItem("plSyncErr") || "null"); } catch (e) {}
                  return (<div style={{ fontFamily: mono, fontSize: 10, color: T.steel, marginTop: 6 }}>
                    last success: {ok9 ? new Date(ok9).toLocaleString() : "never"}<br />
                    last error: {se9 ? `HTTP ${se9.status} at ${se9.at.slice(11, 19)} · ${se9.msg || "no body"}${se9.tr ? " · attempts " + se9.tr.join("→") : ""}` : "none on record"}
                  </div>); })()}
                <div style={{ marginTop: 10 }}><Btn small tone="jade" onClick={async () => { const r9 = await ghSync(s); alert(r9.ok ? "Synced ✓ — the server has everything on this phone now." : "STILL FAILING — " + r9.msg + "\nScreenshot this and send it to your builder."); }}>Sync now</Btn></div>
              </div>
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
  const syncTimer = useRef(null);
  const lastPush = useRef(0);
  useEffect(() => {
    if (!s) return;
    if (!localStorage.getItem(TOKEN_KEY)) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      if (Date.now() - lastPush.current < 10 * 60e3) return;
      if (!navigator.onLine) return;
      lastPush.current = Date.now();
      ghSync(s).catch(() => {});
    }, 90e3);
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [s]);
  const [kitPerson, setKitPerson] = useState(() => { try { const qp = new URLSearchParams(window.location.search).get("p"); if (qp && KIT_SPECS[qp]) { localStorage.setItem(KIT_KEY, qp); return qp; } return localStorage.getItem(KIT_KEY); } catch (e) { return null; } });
  const [updReady, setUpdReady] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    try {
      let st = loadState();
      const sw2 = sweepLab(st);
      if (sw2) { st = sw2; save(st); }
      setS(st);
    } catch (e) { setS(JSON.parse(JSON.stringify(SEED))); setOffline(true); }
  }, []);

  const [gloss, setGloss] = useState(null);
  const [, setWake] = useState(0);
  useEffect(() => { window.__setGloss = setGloss; return () => { window.__setGloss = null; }; }, []);
  const shellRef = useRef(null);
  const [vh9, setVh9] = useState(0);
  const [, beat9] = useState(0);
  const sRef9 = useRef(null);
  sRef9.current = s;
  useEffect(() => {
    const heal9 = () => { try { const se = localStorage.getItem("plSyncErr"); const last = +(localStorage.getItem("plSyncTry") || 0); if (se && Date.now() - last > 150000 && sRef9.current) { localStorage.setItem("plSyncTry", String(Date.now())); ghSync(sRef9.current); } } catch (e) {} };
    const th9 = setInterval(() => { beat9((b) => b + 1); heal9(); }, 60000);
    const onVis9 = () => { if (document.visibilityState === "visible") beat9((b) => b + 1); };
    document.addEventListener("visibilitychange", onVis9);
    return () => { clearInterval(th9); document.removeEventListener("visibilitychange", onVis9); };
  }, []);
  useEffect(() => {
    const setH = () => { try {
      const cands = [window.innerHeight || 0, (window.visualViewport && window.visualViewport.height) || 0, (document.documentElement && document.documentElement.clientHeight) || 0];
      const h = Math.round(Math.max(...cands));
      document.documentElement.style.setProperty("--app-h", h + "px");
      setVh9(h);
    } catch (e) {} };
    setH(); const t1 = setTimeout(setH, 250); const t2 = setTimeout(setH, 1000);
    window.addEventListener("resize", setH); window.addEventListener("orientationchange", setH); window.addEventListener("pageshow", setH);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", setH);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", setH); window.removeEventListener("orientationchange", setH); window.removeEventListener("pageshow", setH); if (window.visualViewport) window.visualViewport.removeEventListener("resize", setH); };
  }, []);
  useEffect(() => {
    const onVis2 = () => {
      if (document.visibilityState !== "visible") return;
      setS((prev) => { if (!prev) return prev; const sw2 = sweepLab(prev); if (sw2) { save(sw2); return sw2; } return prev; });
      setWake((x) => x + 1);
    };
    const autoFile = () => {
      try {
        if (document.visibilityState !== "visible") return;
        if (!localStorage.getItem(TOKEN_KEY)) return;
        const lastA = +(localStorage.getItem("prep-ledger-autosync") || 0);
        if (Date.now() - lastA < 12 * 3600 * 1000) return;
        localStorage.setItem("prep-ledger-autosync", String(Date.now()));
        const raw = localStorage.getItem(KEY);
        if (raw) ghSync(JSON.parse(raw)).catch(() => {});
      } catch (e) {}
    };
    document.addEventListener("visibilitychange", autoFile);
    autoFile();
    document.addEventListener("visibilitychange", onVis2);
    return () => { document.removeEventListener("visibilitychange", autoFile); document.removeEventListener("visibilitychange", onVis2); };
  }, []);

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
    <div style={{ minHeight: "100vh", background: T.ink, display: "flex", alignItems: "center", justifyContent: "center" , maxWidth: "100%", overflowX: "hidden", overflowWrap: "anywhere"}}>
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.2em", color: T.steel }}>OPENING THE LEDGER…</div>
    </div>
  );

  const slp = sleepInfo(s);
  /* ---------- NAV_NOTE — static demotion, never adaptive ----------
     He named the surfaces he actually uses: NOW, TRAIN and the Analyst, with
     LAB occasionally and BODY very rarely. Six equal tabs spent identical
     attention on all six.

     The tempting fix is to let the app promote whichever tab has news. The
     evidence says do not. Findlater & McGrenere (CHI 2004, n=27) measured
     static, adaptable and adaptive menus on real selection tasks: STATIC was
     fastest at 306.5s; ADAPTIVE — the interface rearranging itself — was
     SLOWEST at 331.6s, roughly 8% worse, because unpredictable repositioning
     breaks spatial consistency and turns every selection into a visual search.
     ADAPTABLE (the user reorders once, then it stays put) matched static at
     300.7s among those who customised, and was preferred 15 to 4 over static.
     People want control; they do not benefit from the app taking it.

     So: a fixed rail of the three he lives in, plus one MORE entry that never
     moves, holding the other four. A badge may appear — a dot saying something
     is waiting — but a badge does not move the target, and moving the target is
     what cost the 8%. */
  const PRIMARY_TABS = ["NOW", "TRAIN", "MORE"];
  const SECONDARY_TABS = ["QUEUE", "BODY", "SLEEP", "HIST"];
  const TAB_LABEL = { HIST: "LAB" };
  const inMore = SECONDARY_TABS.indexOf(tab) > -1;
  const tabs = PRIMARY_TABS;

  return (
    <div ref={shellRef} style={{ minHeight: "100vh", background: T.ink, color: T.chalk, maxWidth: "100%", overflowX: "hidden", overflowWrap: "anywhere" }}>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        input:focus, button:focus-visible { outline: 2px solid ${T.brass}; outline-offset: 1px; }
        button { cursor: pointer; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      <div id="pl-scroll" style={{ minWidth: 0, overflowX: "hidden" }}>

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

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "calc(14px + env(safe-area-inset-top)) 14px calc(88px + env(safe-area-inset-bottom))", visibility: (rules || coach || kitPerson) ? "hidden" : "visible" }}>
        {inMore && (
          <div onClick={() => setTab("MORE")} role="button" tabIndex={0} aria-label="Back to More" style={{ fontFamily: mono, fontSize: 11, color: T.steel, cursor: "pointer", padding: "0 0 12px", letterSpacing: "0.06em", display: "inline-block" }}>‹ MORE</div>
        )}
        {tab === "NOW" && <TabGuard name="NOW"><NowTab s={s} setS={setS} save={save} slp={slp} openRules={() => setRules(true)} openCoach={() => setCoach(true)} /></TabGuard>}
        {tab === "TRAIN" && <TabGuard name="TRAIN"><LogTab s={s} setS={setS} save={save} slp={slp} /></TabGuard>}
        {tab === "QUEUE" && <TabGuard name="QUEUE"><QueueTab s={s} slp={slp} /></TabGuard>}
        {tab === "BODY" && <TabGuard name="BODY"><BodyTab s={s} setS={setS} save={save} /></TabGuard>}
        {tab === "SLEEP" && <TabGuard name="SLEEP"><SleepTab s={s} setS={setS} save={save} slp={slp} /></TabGuard>}
        {tab === "HIST" && <TabGuard name="HIST"><HistTab s={s} setS={setS} save={save} /></TabGuard>}
        {tab === "MORE" && <TabGuard name="MORE"><MoreTab s={s} go={setTab} openRules={() => setRules(true)} openCoach={() => setCoach(true)} /></TabGuard>}
      </div>

      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: T.plate, borderTop: `1px solid ${T.line}` }}>
        <div style={{ position: "absolute", top: 2, right: 8, fontFamily: mono, fontSize: 7, color: T.dim, opacity: 0.7, padding: 4 }}>v{APP_V}</div>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex" }}>
          {tabs.map((t2) => (
            <button key={t2} onClick={() => setTab(t2)} style={{ flex: 1, padding: "13px 0 calc(8px + env(safe-area-inset-bottom))", background: "none", border: "none", borderTop: (tab === t2 || (t2 === "MORE" && inMore)) ? `2px solid ${T.chalk}` : "2px solid transparent", fontFamily: mono, fontSize: 9.5, letterSpacing: "0.09em", color: (tab === t2 || (t2 === "MORE" && inMore)) ? T.chalk : T.dim }}>
              {TAB_LABEL[t2] || t2}{t2 === "NOW" && (s.agentProposals || []).length > 0 ? <span style={{ color: T.jade, fontWeight: 700 }}> ●{(s.agentProposals || []).length}</span> : null}
            </button>
          ))}
        </div>
      </div>

      {kitPerson && KIT_SPECS[kitPerson] && <KitApp spec={{ ...KIT_SPECS[kitPerson], id: kitPerson }} onExit={() => { localStorage.removeItem(KIT_KEY); setKitPerson(null); }} />}
      {rules && <Rules s={s} onClose={() => setRules(false)} onReset={reset} onExport={doExport} onImport={doImport} sync={s.sync} onSync={async () => { const res = await ghSync(s); const ns = { ...s, sync: { last: isoOf(todayStart()), status: res.ok ? "synced" : res.msg } }; setS(ns); save(ns); }} />}
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
