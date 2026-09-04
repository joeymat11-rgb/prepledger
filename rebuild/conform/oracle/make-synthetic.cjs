/* oracle/make-synthetic.cjs — builds fixtures/synthetic-pending-debut.json: a SYNTHETIC ledger (generated series, one
   synthetic lift with a PENDING PROPOSED debut carrying newWSets, a former name, a volume receipt) on the public
   preimage's SHAPE only. Shippable. Sol suite-pass-2 port objection 7: "the current live fixture has zero pending
   debuts and cannot prove that path". */
const fs = require("node:fs"), path = require("node:path");
const base = JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures/preimage-2026-08-15.json"), "utf8"));
const s = JSON.parse(JSON.stringify(base));
const day = (i) => new Date(Date.parse("2026-07-10T12:00:00Z") + i * 86400000).toISOString().slice(0, 10);
s.reads = []; s.dailyLogs = {}; s.sleep = { nights: {} }; s.events = []; s.waist = []; s.photos = []; s.forecasts = []; s.labNews = []; s.trials = []; s.caffLog = []; s.medsLog = []; s.energy = []; s.soreness = []; s.grip = []; s.pulse = []; s.temp = []; s.skinfolds = []; s.suggestionLog = []; s.agentProposals = []; s.proposals = []; s.adjustments = []; s.dayCtx = {}; s.labSeen = {}; s.weekly = {}; s.reclassLog = [];
for (let i = 0; i < 35; i++) { const d = day(i); s.reads.push({ d, w: Math.round((185 - i * 0.18 + ((i * 7) % 5) * 0.12) * 10) / 10, note: "", sealed: false }); s.dailyLogs[d] = { cal: 2400 + ((i * 13) % 7) * 20, pro: 175 + (i % 3) * 5, steps: 9000 + ((i * 11) % 9) * 300 }; s.sleep.nights[String(i)] = { d, h: 7 + (i % 4) * 0.25 }; }
s.exercises = [{ id: "press", n: "PRESS", mg: "CHEST", day: "U", w: 55, inc: 5, sets: 3, hi: 12, lo: 8, wSets: [55, 55, 50], renames: [{ prevN: "CHEST PRESS", at: "2026-08-01" }], forks: [], last: { d: day(30), w: 55, reps: [12, 12, 12] }, topAt: 55, topRun: 2 },
  { id: "rows", n: "ROWS", mg: "BACK", day: "U", w: 180, inc: 5, sets: 2, hi: 9, lo: 6, wSets: [180, 180], renames: [], forks: [], last: { d: day(30), w: 180, reps: [9, 8] }, topAt: null, topRun: 0 }];
s.exOrder = { U: ["press", "rows"], L: [] }; s.retirements = {}; s.split = null; s.planGen = 3;
s.sessionLog = { [day(23)]: { entries: [{ id: "press", w: 55, reps: [12, 12, 12], rir: 2, rirSets: [2, null, null] }, { id: "rows", w: 180, reps: [9, 8], rir: 2, rirSets: [2, null] }] }, [day(30)]: { entries: [{ id: "press", w: 55, reps: [12, 12, 12], rir: 2, rirSets: [2, null, 3] }, { id: "rows", w: 180, reps: [9, 8], rir: 1, rirSets: [1, null] }] } };
s.queue = [{ id: "q_press_60_" + day(30), kind: "debut", exId: "press", newW: 60, newWSets: [60, 60, 55], t: "PRESS 60 DEBUT", state: "ESTABLISH", gate: "Debuted 12,12,12", rule: "The structural change for the next upper day", done: false },
  { id: "q_press_65_" + day(30) + "_2r", kind: "debut", exId: "press", newW: 65, newWSets: [65, 65, 60], t: "PRESS 65 — TWO-RUNG DEBUT PROPOSED", state: "PROPOSED", gate: "", rule: "Rides only on your tap", done: false },
  { id: "q_rows_180_" + day(10), kind: "debut", exId: "rows", newW: 180, newWSets: [180, 180], t: "ROWS 180 DEBUT", state: "ESTABLISH", gate: "Debuted 7,7", rule: "", done: true }];
s.feed = [{ d: day(30), t: "PRESS 55 × 12·12·12 — TOP OF WINDOW, PROVISIONAL", op: "sess:" + day(30) + ":press", how: "second sighting at the top of the window" }, { d: day(30), t: "ROWS 180 × 9·8", op: "sess:" + day(30) + ":rows", how: "" }, { d: day(23), t: "CHEST PRESS 55 × 12·12·12 — TOP OF WINDOW, PROVISIONAL", op: "sess:" + day(23) + ":press", how: "first sighting" }, { d: day(20), t: "VOLUME +1 — CHEST via Chest Press (now 3 sets)", op: "vol:" + day(20) + ":press", how: "volume push accepted" }, { d: day(10), t: "ROWS 180 DEBUT EARNED", op: "earn:rows:180:" + day(10), how: "graduation" }];
s.trend = 180.2; s.phase = "EASE 1"; s.rate = -1.0; s.maintenance = 2500; s.model = s.model || {}; s.sync = { last: null, status: "idle" };
fs.writeFileSync(path.join(__dirname, "../fixtures/synthetic-pending-debut.json"), JSON.stringify(s));
console.log("wrote fixtures/synthetic-pending-debut.json", JSON.stringify(s).length, "bytes; pending debuts", s.queue.filter((q) => q.kind === "debut" && !q.done).length);
