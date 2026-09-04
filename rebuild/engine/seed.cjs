"use strict";

module.exports = function createSeed(E) {
const { DAY, SCHEMA_V, SEAL_UNTIL } = E;
const mk = (...args) => E.mk(...args);
const isoOf = (...args) => E.isoOf(...args);
const fmtShort = (...args) => E.fmtShort(...args);

/* Auto-extracted from Prep-Tracker.xlsx — 6/10 through 7/21. Verbatim daily record. */
const HISTORY = [{"d":"2026-06-10","wk":1,"w":170.0,"cal":2440.0,"pro":173.0,"steps":13500.0,"slp":8.0,"note":"Rest day \u2014 REFEED. Weighed post-\u00bd Core Power (~169.5 true). DAY 1.","flag":null},{"d":"2026-06-11","wk":1,"w":169.6,"cal":1564.0,"pro":170.0,"steps":15500.0,"slp":7.25,"note":"Upper: Press 235x10,6,5(F); Lat 15 in range; Rows 145x7,7 in range; set-1 falloff to fix","flag":null},{"d":"2026-06-12","wk":1,"w":170.2,"cal":1550.0,"pro":195.0,"steps":12000.0,"slp":null,"note":"Lower: Ham curl 100x13,11,9 PR; Calves 295x10,8,8,8; Leg press 240x11,6; Ext 120x12,10; Sulek 80x14,7; Abs\u2026","flag":null},{"d":"2026-06-13","wk":1,"w":169.8,"cal":3500.0,"pro":196.0,"steps":17600.0,"slp":null,"note":"Rest \u2014 night out, NO alcohol. Cals high-estimate. Activity creep flagged.","flag":null},{"d":"2026-06-14","wk":1,"w":173.4,"cal":1530.0,"pro":182.0,"steps":13500.0,"slp":9.0,"note":"Rest. AM 173.4 = water spike from night out (sodium/food), not fat. Reined activity back, no penance.","flag":null},{"d":"2026-06-15","wk":1,"w":170.8,"cal":1573.0,"pro":183.0,"steps":19000.0,"slp":null,"note":"Upper: Press 240x8,6,6 PR; Pulldown 150x6,6 (wider grip); Rows 150x9,7; Lat 15x14,11,9,9; Rear\u2026","flag":null},{"d":"2026-06-16","wk":1,"w":170.0,"cal":1530.0,"pro":184.0,"steps":21000.0,"slp":6.5,"note":"Lower: Calves 300x9,8,7,6 PR; Leg press 240x11,6 / 255x12,12; Ham curl 110x11,11,9 PR; Abs 80x13,13,13\u2026","flag":null},{"d":"2026-06-17","wk":2,"w":169.4,"cal":2170.0,"pro":181.0,"steps":21700.0,"slp":7.0,"note":"Rest \u2014 REFEED (~maintenance, carbs up). Vacation steps. Incline skipped (right call w/ 21k flat).","flag":"slow"},{"d":"2026-06-18","wk":2,"w":169.2,"cal":1590.0,"pro":185.0,"steps":23000.0,"slp":7.5,"note":"Upper (forgot straps \u2014 back PRd anyway): Rows 160x8,8 PR & Pulldown 150x7,7, both strapless; Lat\u2026","flag":"slow"},{"d":"2026-06-19","wk":2,"w":168.2,"cal":1570.0,"pro":171.0,"steps":22000.0,"slp":7.0,"note":"Lower: Calves 300x10,9,9,7 (cascade flattened, +5 reps); Abs 85x11,11,9 (load PR); Leg press 270x7,7 (3\u2026","flag":"slow"},{"d":"2026-06-20","wk":2,"w":167.9,"cal":1595.0,"pro":191.0,"steps":18500.0,"slp":7.5,"note":"Rest day. Steps 18.5k \u2014 easing back from the 22-23k vacation creep toward protocol. Protein back up to 191.","flag":"slow"},{"d":"2026-06-21","wk":2,"w":168.2,"cal":1610.0,"pro":170.0,"steps":22000.0,"slp":7.0,"note":"Rest day (upper tomorrow). Steps back to 22k after yesterdays 18.5k - not settling toward protocol. Slept 7h,\u2026","flag":"track"},{"d":"2026-06-22","wk":2,"w":168.4,"cal":1680.0,"pro":175.0,"steps":17500.0,"slp":7.5,"note":"Upper (strong, strapless): Rear 17.5x10,10 x3 (load PR); Curl 50x10,10,9 (target cracked); Lat 15x12,12,11,10\u2026","flag":"track"},{"d":"2026-06-23","wk":2,"w":168.3,"cal":1720.0,"pro":181.0,"steps":19000.0,"slp":8.0,"note":"Lower: Calves 300x10,9,9,9 (cascade gone, F); Abs 85x11,11,11 (even, load PR held); Hanging raise x5 (new, 1\u2026","flag":"ceiling"},{"d":"2026-06-24","wk":3,"w":167.9,"cal":2610.0,"pro":173.0,"steps":20000.0,"slp":8.0,"note":"REFEED day: 2,610 cal (~maintenance, nailed the to-maintenance rule), 173g protein held, 347g carbs (~59g\u2026","flag":"ceiling"},{"d":"2026-06-25","wk":3,"w":168.6,"cal":1660.0,"pro":187.0,"steps":21000.0,"slp":7.0,"note":"Upper (fueled, strapless): Lat 15x13,12,12,11 (reps up); Rear 17.5x11,11/11,11/10,10 (+1); Curl 50x12,10,9\u2026","flag":"ceiling"},{"d":"2026-06-26","wk":3,"w":168.2,"cal":1691.0,"pro":190.0,"steps":16000.0,"slp":8.0,"note":"Lower: Calves 300x10,10,10,10 (cascade GONE - load bump earned); Abs 90x10,10,11 (load PR, climbing); Hanging\u2026","flag":"track"},{"d":"2026-06-27","wk":3,"w":167.8,"cal":1700.0,"pro":197.0,"steps":19600.0,"slp":7.0,"note":"Rest day. Intake 1,700/197 (floor held exactly, protein top of band). Steps 19.6k (settled steady in range\u2026","flag":"track"},{"d":"2026-06-28","wk":3,"w":168.2,"cal":1685.0,"pro":184.0,"steps":20000.0,"slp":7.0,"note":"Rest day. Intake 1,685/184 (floor held). Steps 20k (top of range, steady). 7h sleep. First clean directional\u2026","flag":"slow"},{"d":"2026-06-29","wk":3,"w":167.0,"cal":1711.0,"pro":178.0,"steps":23000.0,"slp":7.5,"note":"Upper (PR-heavy): Lat 15x14,14,12,11 (rep PR); Rear 17.5x11,11/11,11/11,10; Rows 170x9,8 (load PR); Pulldown\u2026","flag":"slow"},{"d":"2026-06-30","wk":3,"w":166.2,"cal":1725.0,"pro":175.0,"steps":22000.0,"slp":7.0,"note":"Whoosh CONFIRMED 168.2->167.0->166.2 (carb-up water cleared, masked loss surfacing; validates not-reacting).","flag":"slow"},{"d":"2026-07-01","wk":4,"w":165.8,"cal":2636.0,"pro":194.0,"steps":20000.0,"slp":7.0,"note":"REFEED: 2,636 (~maintenance, target ~2,600 - clean), 194P held high, 342C, 57F. Steps 20k (at ceiling). 7h\u2026","flag":"slow"},{"d":"2026-07-02","wk":4,"w":168.6,"cal":1711.0,"pro":181.0,"steps":21000.0,"slp":7.0,"note":"Post-refeed bump +2.8 (165.8->168.6): glycogen water, zero fat, clears 1-2 days. Upper (fueled): Rear\u2026","flag":"slow"},{"d":"2026-07-03","wk":4,"w":167.3,"cal":3200.0,"pro":null,"steps":21000.0,"slp":null,"note":"Refeed water draining (168.6->167.3). PLANNED CHEAT NIGHT (~3k+ cal, no alcohol - ran it right). Steps 21k\u2026","flag":"slow"},{"d":"2026-07-04","wk":4,"w":170.0,"cal":1730.0,"pro":190.0,"steps":20000.0,"slp":7.0,"note":"POST-CHEAT weigh-in 170.0 (+2.7): water/glycogen/gut, NOT fat - clears 2-4 days. CLEAN RETURN: 1,730/190\u2026","flag":"slow"},{"d":"2026-07-05","wk":4,"w":167.6,"cal":1830.0,"pro":175.0,"steps":25000.0,"slp":null,"note":"Cheat water draining 170.0->167.6. CITY DAY: 25k steps (incidental) FED CORRECTLY at 1,830 (pairing rule\u2026","flag":"slow"},{"d":"2026-07-06","wk":4,"w":168.8,"cal":1731.0,"pro":168.0,"steps":19000.0,"slp":7.0,"note":"City-day rebound 167.6->168.8 (water, drained since). Upper: rear 17.5x12,12/12,12/13,13 (ladder DONE - earns\u2026","flag":"slow"},{"d":"2026-07-07","wk":4,"w":167.6,"cal":1731.0,"pro":180.0,"steps":21000.0,"slp":7.0,"note":"Draining resumed: 168.8 -> 167.6, 166s expected next.","flag":"slow"},{"d":"2026-07-08","wk":5,"w":166.5,"cal":2600.0,"pro":180.0,"steps":20000.0,"slp":8.0,"note":"*** EASE 1 FIRES *** Weigh-in 166.5 = clean read, water fully drained, ~1.5/wk confirmed. STEPS 20k -> 16-17k\u2026","flag":"slow"},{"d":"2026-07-09","wk":5,"w":167.0,"cal":1850.0,"pro":165.0,"steps":17800.0,"slp":8.0,"note":"First Ease-1 morning. 166.5 -> 167.0 (+0.5): refeed water + town-food sodium, expected & mild. Read through\u2026","flag":"slow"},{"d":"2026-07-10","wk":5,"w":166.2,"cal":1770.0,"pro":170.0,"steps":17000.0,"slp":7.0,"note":"Refeed/town water clearing on schedule: 167.0 -> 166.2 (ties the pre-refeed low). Trend ~166 intact, Ease-1\u2026","flag":"slow"},{"d":"2026-07-11","wk":5,"w":166.0,"cal":4000.0,"pro":null,"steps":19000.0,"slp":null,"note":"Cheat/city/refeed water fully cleared - new post-stack low, trend ~166 confirmed. Ease-1 slope now forming\u2026","flag":"slow"},{"d":"2026-07-12","wk":5,"w":170.6,"cal":1700.0,"pro":null,"steps":17000.0,"slp":7.0,"note":"POST-BIRTHDAY-DINNER: 166.0 -> 170.6 (+4.6 overnight). Sodium + gut content + glycogen from ~4,000 cal\u2026","flag":"slow"},{"d":"2026-07-13","wk":5,"w":168.2,"cal":1800.0,"pro":175.0,"steps":18000.0,"slp":7.0,"note":"Dinner water draining: 170.6 -> 168.2 (-2.4 in one day, as predicted). Confirms it was sodium/gut/glycogen,\u2026","flag":"slow"},{"d":"2026-07-14","wk":5,"w":166.8,"cal":1750.0,"pro":175.0,"steps":19000.0,"slp":7.0,"note":"Dinner water nearly cleared: 170.6 -> 168.2 -> 166.8. Approaching the ~166 trend line, as predicted. Lower\u2026","flag":"slow"},{"d":"2026-07-15","wk":6,"w":165.4,"cal":1780.0,"pro":170.0,"steps":16700.0,"slp":6.5,"note":"Rest day, REFEED SKIPPED (wedding Sat intended to serve the function). Close: 1,780/170, steps 16.7k - FIRST\u2026","flag":"slow"},{"d":"2026-07-16","wk":6,"w":166.4,"cal":null,"pro":null,"steps":null,"slp":4.5,"note":"Weigh-in 166.4 (note: ~16oz water pre-weigh, reads ~0.5-1lb high; true ~165.5-166). Within wedding-fortnight\u2026","flag":"slow"},{"d":"2026-07-17","wk":6,"w":null,"cal":1790.0,"pro":175.0,"steps":11500.0,"slp":8.0,"note":"LOWER on 4.5h sleep (wired, compressed AM, wedding travel after) - conservative by design, executed well.\u2026","flag":"slow"},{"d":"2026-07-18","wk":6,"w":null,"cal":2300.0,"pro":170.0,"steps":13000.0,"slp":7.0,"note":"WEDDING #1 (PA): ~2,300 cal / 170g protein - protein-forward executed, came in BELOW Ease-1 maintenance\u2026","flag":"slow"},{"d":"2026-07-19","wk":6,"w":null,"cal":2000.0,"pro":170.0,"steps":12500.0,"slp":7.5,"note":"Away/travel-home day: 2,000/170 (250 over band - travel day, corrected from initial 1,750 estimate; protein 5\u2026","flag":"slow"},{"d":"2026-07-20","wk":6,"w":163.8,"cal":1780.0,"pro":180.0,"steps":14000.0,"slp":7.5,"note":"NEW TREND LOW 163.8 (-1.6 vs prior low 165.4 on 7/15). Came in BELOW expectation - I predicted a post-wedding\u2026","flag":"ceiling"},{"d":"2026-07-21","wk":6,"w":163.2,"cal":null,"pro":null,"steps":null,"slp":null,"note":"163.2 - SECOND consecutive new low (163.8 -> 163.2). Two dailies now agree, which materially strengthens the\u2026","flag":"redline"}];


// Copied from frozen src/app.jsx @ fe516c1:386-432.
const EXERCISES = [
  /* UPPER — order per the 7/20 session note */
  { id: "lateral", mg: "delts", head: "delts_side", lastMeta: { d: "2026-07-20", w: 80, reps: [14, 13, 13], debt: true }, n: "Lateral machine", day: "U", w: 80, inc: 5, sets: 4, hi: 15, last: [14, 13, 13],
    setup: "SET · resistance profile 5 · seat 5\nRaise elbow-first through your full pain-free arc to the same height · keep torso fixed—no swing or late-rep shoulder hike" },
  { id: "rearDelt", mg: "delts", head: "delts_rear", lastMeta: { d: "2026-07-20", w: 20, reps: [10, 10], debt: true }, n: "Rear-delt fly (cable, unilateral)", day: "U", w: 20, inc: 2.5, sets: 3, setsAt: "2026-08-12T00:00:00.000Z", hi: 12, last: [10, 10], note: "honest 10s — no hot opener · 3 sets per side, log the weaker side",
    setup: "SET · unilateral · cable highest · handle [PIN] · stance [PIN]\nSweep through your full pain-free arc to the same endpoint · keep torso fixed—no twist or swing" },
  { id: "rows", mg: "back", lastMeta: { d: "2026-07-20", w: 175, reps: [10, 10], debt: true }, n: "Prime seated row (hooks)", day: "U", w: 175, inc: 5, sets: 2, hi: 10, last: [10, 10],
    setup: "SET · seat 4 · chest pad 7 · resistance profile 1 · grip [PIN] · Gymreapers hooks fitted the same way\nUse your full pain-free reach and finish at the same points with chest on pad · keep torso still—no pad lift" },
  /* C5/Q4 (PROGRESSION-1) — THE WORKING LOAD IS A NUMBER; THE PER-SET LINE RIDES BESIDE IT.
     "55·55·50" was a string, so every numeric path skipped this lift: nextLoad returned
     null, the earn walk was gated on typeof ex.w === "number", and the ladder branch
     returned before the walk ever ran — two top sessions at [12,12,12] banked nothing and
     q_curl_grad sat as a coach flag forever. That is not a viable steady state (both
     auditors). ex.w is the working load, ex.wSets is the per-set vector the card, the gym
     screen and the receipts print, and the vector steps UNIFORMLY by inc — the owner's
     graduation line 60·60·55 is exactly 55·55·50 + 5. Historical entries keep the w/wKey
     they were logged with; history is never rewritten. */
  { id: "curl", mg: "biceps", lastMeta: { d: "2026-07-20", w: "55·55·50", reps: [12, 8, 10], debt: true }, n: "Curls (preacher)", day: "U", w: 55, wSets: [55, 55, 50], inc: 5, sets: 3, hi: 12, last: [12, 8, 10],
    setup: "SET · resistance profile 5 · seat 3\nKeep upper arms on the pad through your full pain-free elbow range · stop before a shoulder roll starts" },
  { id: "fly", mg: "chest", n: "Machine fly", day: "U", w: null, wAt: "2026-08-12T00:00:00.000Z", inc: 5, incAt: "2026-08-12T00:00:00.000Z", sets: 2, setsAt: "2026-08-12T00:00:00.000Z", hi: 20, hiAt: "2026-08-12T00:00:00.000Z", last: null,
    setup: "SET · fly mode · seat [PIN] · start [PIN] · resistance profile [PIN]\nKeep back on pad and elbows at the same bend through your full pain-free range · open and close to the same endpoints—no bounce", setupAt: "2026-08-12T00:00:00.000Z" },
  { id: "press", mg: "chest", lastMeta: { d: "2026-07-20", w: 245, reps: [8, 7, 6], debt: true }, n: "Press", day: "U", w: 245, inc: 5, sets: 3, hi: 9, last: [8, 7, 6], std: [8, 8, 7], own: true, ownNote: "repeat 8,8,7 — no load until owned",
    setup: "SET · cam 5 · lowest seat · neutral grip\nLower through your full pain-free range to the same depth with upper back on pad · press on the same elbow path—no bounce" },
  { id: "pulldown", mg: "back", lastMeta: { d: "2026-07-20", w: 160, reps: [8, 8], debt: true }, n: "Pulldown", day: "U", w: 160, inc: 5, sets: 3, setsAt: "2026-08-12T00:00:00.000Z", hi: 10, last: [8, 8],
    setup: "SET · silver bar · Gymreapers hooks fitted the same way · thumbs at the same marks\nUse your full pain-free reach at the top and pull to the same body landmark · keep torso angle fixed—no swing" },
  { id: "sulek", mg: "forearms", lastMeta: { d: "2026-07-20", w: 87.5, reps: [12, 8], debt: true }, n: "Sulek wrist curl (high cable)", day: "U", w: 87.5, inc: 2.5, sets: 2, hi: 15, last: [12, 8],
    setup: "SET · cable highest rung · straight bar · grip [PIN]\nBend only the wrists—palms curl toward the inner forearm through your full pain-free range · elbows still at sides, no swing" },
  { id: "tricep", mg: "triceps", lastMeta: { d: "2026-07-20", w: 55, reps: [12, 11, 10], debt: true }, n: "Tricep", day: "U", w: 55, inc: 5, sets: 3, hi: 13, last: [12, 11, 10],
    setup: "SET · seat 4 · back pad fully forward · middle peg\nKeep upper arms supported through your full pain-free elbow range · stop before shoulder roll or bounce" },
  /* SPLIT — pronated EZ curl leaves the FRESH seed: retired by the owner's
     8/12 split ruling. Migrated states keep the full record, tombstoned; the
     retirements marker below is what a fresh install ships instead. */
  { id: "calves", mg: "calves", lastMeta: { d: "2026-07-21", w: 315, reps: [12, 10, 9, 8], debt: true }, n: "Calves", day: "L", w: 315, inc: 5, sets: 3, setsAt: "2026-08-12T00:00:00.000Z", hi: 13, last: [12, 10, 9, 8],
    setup: "SET · shoulder height 4 · foot placement [PIN]\nWith the same near-straight knee angle, pause 2 s (gym-mode timed) at the same deepest pain-free point · rise to the same top height—no bounce" },
  { id: "abs", mg: "abs", lastMeta: { d: "2026-07-21", w: 95, reps: [14, 13, 13], debt: true }, n: "Prime abdominal crunch", day: "L", w: 100, inc: 5, sets: 3, hi: 14, last: null, first: [12, 12, 12], debutNote: "DEBUT — new baseline, log honest",
    setup: "SET · resistance profile [PIN] · back pad A · seat 6\nCurl ribs toward pelvis through your full pain-free range · keep hips on pad" },
  { id: "hanging", mg: "abs", lastMeta: { d: "2026-07-21", w: "BW", reps: [6, 5], debt: true }, n: "Supported leg raise (medicine-ball pad)", day: "L", w: "BW", inc: null, sets: 2, hi: 8, last: [6, 5],
    setup: "SET · bodyweight · medicine-ball pad at [PIN] · knee bend [PIN]\nStart with low back rounded against the pad and raise through your full pain-free range to the same height · keep knee bend fixed—no swing" },
  { id: "hack", mg: "quads", lastMeta: { d: "2026-07-21", w: "hold", reps: [13, 12], debt: true }, n: "Hack squat", day: "L", w: "hold",   /* hi is authored 10 below by weave (the 2026-08-10 ruling) — the seed is already-current */ inc: 10, sets: 2, hi: 12, last: null, pendingThird: true,
    setup: "SET · foot placement = pinned photo\nMatch the photo and descend through your full pain-free range to the same depth · keep feet, hips, and back contact unchanged" },
  { id: "hipthrust", mg: "glutes", n: "Hip thrust machine", day: "L", w: null, wAt: "2026-08-12T00:00:00.000Z", inc: 5, incAt: "2026-08-12T00:00:00.000Z", sets: 3, setsAt: "2026-08-12T00:00:00.000Z", hi: 12, hiAt: "2026-08-12T00:00:00.000Z", last: null,
    setup: "SET · machine setting [PIN] · belt/pad landmark [PIN] · foot marks [PIN]\nUse your full pain-free hip range to the same depth and finish height · keep upper back on pad—do not arch the low back to finish", setupAt: "2026-08-12T00:00:00.000Z" },
  { id: "extension", mg: "quads", lastMeta: { d: "2026-07-21", w: 155, reps: [9, 6], debt: true }, n: "Leg extension", day: "L", w: 150, inc: 5, sets: 2, hi: 10, last: [9, 6], std: [9, 9], own: true, ownNote: "own 150×9,9 — then the 155 gate reopens",
    setup: "SET · shin pad A · start range 3 · seat fully reclined · load peg/profile [PIN]\nKeep hips and back on pad through your full pain-free knee range · extend smoothly—no kick or lockout jerk" },
  { id: "ham", mg: "hams", lastMeta: { d: "2026-07-21", w: 120, reps: [10, 10], debt: true }, n: "Ham curl", day: "L", w: 120, inc: 5, sets: 2, hi: 12, last: [10, 10],
    setup: "SET · back 5 · thigh pad [PIN] · calf pad C · start range 3 · resistance profile 5\nKeep hips down through your full pain-free knee range · stop before lift-off or shortened late reps" },
];

// Copied from frozen src/app.jsx @ fe516c1:435-517.
const SEED = {
  v: 2,
  phase: "EASE 1",
  rate: { band: [1.0, 1.4] },
  skinfolds: [],   /* R5 — authored already-current; a fresh install does not run the patch chain */   /* R3 - redline 1.9 and floor 0.8 removed: authored, uncited, and in POUNDS. cutRateBand derives both from BC.CUT_REDLINE_PCT / BC.CUT_FLOOR_PCT in %BW. Nothing reads these fields any more; a live state that still carries them is inert. */
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

// Copied from frozen src/app.jsx @ fe516c1:520-594.
(function weave() {
  SEED.v = SCHEMA_V;
  /* v7.53.0 — the cue adoption stamp: every rewritten setup is deliberate config
     under the v7.52.0 merge discipline, and the seed carries the SAME fixed
     stamp patchV48 writes, so a fresh install and a migrated state agree. */
  SEED.exercises.forEach((e0) => { if (!e0.setupAt) e0.setupAt = "2026-08-13T12:00:00.000Z"; });   /* seed-authored — the cue-adoption stamp; lifts that carry their OWN authored stamp (the split's newborns at RULING_EPOCH) keep it, so a real 8/13 athlete edit outranks a fresh device's unfilled setup */
  /* R11 fix-4 — the pin BIRTHDAY, authored on the seed exactly as patchV51
     backfills it, so a fresh install and a migrated state agree (the seed is
     authored already-current and never walks the patch chain). */
  SEED.exercises.forEach((e0) => { if (!e0.pinsBornAt && ((e0.setup ? String(e0.setup).indexOf("[PIN]") > -1 : false) || e0.pinsSeen || e0.calibratedAt)) e0.pinsBornAt = e0.setupAt; });   /* seed-authored — unstamped by design */
  /* v7.53.0 — the two technique changes that are REAL today fork their lifts:
     hooks standardize on both pulls (R1) and the calf pause changes 5s → 2s
     (R2). A word rewrite is not a technique change; these two are. */
  [["pulldown", "hooks standardized", "Pulldown"], ["rows", "hooks standardized", "Rows (strapless)"], ["calves", "2 s pause replaces 5 s", "Calves"]].forEach(([id0, why0, pn0]) => {
    const e0 = SEED.exercises.find((x) => x.id === id0); if (e0) e0.forks = [{ from: "2026-08-13", why: why0, prevN: pn0 }];
  });
  { const c0 = SEED.exercises.find((x) => x.id === "calves"); if (c0) c0.pauseSec = 2; }
  /* SPLIT — fresh installs are BORN split: plan register, insertion markers,
     and the retirement tombstone, with NO transition seams or receipts (there
     is nothing to transition FROM on a fresh install). */
  SEED.planGen = 51;
  SEED.insertions = { fly: "2026-08-14", hipthrust: "2026-08-14" };
  SEED.retirements = { pronated: "2026-08-12" };   /* FIX 3a item 8 — the pause is a FIELD, not prose */
  [["rows", "Rows (strapless)"], ["rearDelt", "Rear-delt fly (cable · uni)"], ["curl", "Curls"], ["sulek", "Sulek curl (forearm)"], ["abs", "Abs"], ["hanging", "Hanging raise"]].forEach(([id0, pn0]) => {
    const e0 = SEED.exercises.find((x) => x.id === id0); if (e0) e0.renames = [{ from: "2026-08-13", prevN: pn0 }];
  });
  /* v43 — the seed is authored already-current: hack carries the 6-10 ruling */
  { const hk0 = SEED.exercises.find((x) => x.id === "hack"); if (hk0) hk0.hi = 10; }   /* seed-authored — unstamped by design */
  /* v45 — the seed carries the calves/rows ruling too */
  { const c0 = SEED.exercises.find((x) => x.id === "calves"); if (c0) c0.hi = 11; const r0 = SEED.exercises.find((x) => x.id === "rows"); if (r0) r0.hi = 9; }   /* seed-authored — unstamped by design */
  /* v40 — the seed is authored already-current: a fresh install carries the athlete's
     dated split entry exactly as the migration writes it. */
  SEED.split = [{ from: "2026-08-09", map: { 0: "U", 1: "L", 2: "REST", 3: "REST", 4: "U", 5: "L", 6: "REST" }, why: "athlete-stated 2026-08-09 — Sun U · Mon L · Thu U · Fri L (consent relayed on the record, R19)" }];
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
  SEED.learned = { tdee: [], anchors: [] };   // v7.3.0 Slice 4 — the n-of-1 learning store (seeded empty; migrated state matches byte-for-byte)
  SEED.labSeen = {};
  SEED.sleep.anchor = { wake: "06:45", inBed: 8.25 };
  SEED.sleep.caffMg = null;
  SEED.sleep.melaExp = { started: "2026-07-23", arm: "none", baseline: "5 mg most nights · ~6 h wakes" };
  SEED.creatine = null;
  SEED.photos = [];
  SEED.sync = { last: null, status: "" };
  /* SPLIT — the fresh seed is BORN on the ruled orders, not the literal's layout */
  SEED.exOrder = { U: ["lateral", "press", "fly", "pulldown", "rows", "rearDelt", "curl", "tricep", "sulek"], L: ["hack", "hipthrust", "extension", "ham", "abs", "hanging", "calves"] };
  SEED.waist = [];
  SEED.plan = { goals: [], ifthen: [], share: false, autonomy: "propose", phaseLog: [] };
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

// Copied from frozen src/app.jsx @ fe516c1:597-625.
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

// Copied from frozen src/app.jsx @ fe516c1:626-626.
const ROLLUPS = weekRollups();

// Copied from frozen src/app.jsx @ fe516c1:633-633.
const exById = (s, id) => s.exercises.find((e) => e.id === id);

return { HISTORY, EXERCISES, SEED, weekRollups, ROLLUPS, exById };
};
