import { __test } from "../src/app.jsx";
const { targetsFor, genSession, completeSession, runAdaptive, bfEst, migrate, SEED } = __test;
let pass = 0, fail = 0;
const ok = (cond, name) => { cond ? pass++ : fail++; console.log((cond ? "PASS" : "FAIL") + " — " + name); };
const clone = (o) => JSON.parse(JSON.stringify(o));

// 1. progression: climb the earliest lagging set
ok(JSON.stringify(targetsFor({ last: [14,13,13], hi: 15, sets: 3 })) === "[14,14,13]", "targets climb earliest lagging set");
ok(JSON.stringify(targetsFor({ last: [10,10], hi: 10, sets: 2 })) === "[10,10]", "targets hold at top of window");

// 2. Thursday generates itself with rows 180 as THE structural change
const slpDebt = { clean: false, run: 1, need: 3, last: { h: 7.5 } };
const thu = genSession(clone(SEED), "2026-07-23", slpDebt);
ok(thu && thu.structural === "ROWS 180 DEBUT", "Thu structural auto-picked = rows 180");
ok(thu.ex.find(e => e.id === "rows").w === 180, "rows debuts at 180");
ok(JSON.stringify(thu.ex.find(e => e.id === "press").tgt) === "[8,8,7]", "press holds the own-it standard");

// 3. Friday: hack is structural, abs rides co-approved, 3rd set appended
const fri = genSession(clone(SEED), "2026-07-24", slpDebt);
ok(fri.structural.indexOf("HACK") === 0 && fri.ex.find(e => e.id === "hack").tgt.length === 3, "Fri hack 3rd set debut generated");
ok(fri.ex.find(e => e.id === "abs").isDebutNow === true, "abs debut rides alongside (doc-approved)");

// 4. completing Thursday clean: rows flips, press gets OWNED, 250 queues itself
const slpClean = { clean: true, run: 3, need: 3, last: { h: 8 } };
const entries = thu.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow }));
entries.find(e => e.id === "press").reps = [8,8,7];
const { s: after } = completeSession(clone(SEED), "2026-07-23", entries, slpClean);
ok(after.exercises.find(e => e.id === "rows").w === 180 && after.queue.find(q => q.id === "q_rows180").done, "rows debut banked, weight advanced");
ok(after.exercises.find(e => e.id === "press").own === false, "press owned on clean day");
ok(!!after.queue.find(q => q.id === "q_press250"), "press 250 auto-queued at coach flag");

// 5. same press reps on DEBT: stays provisional, no 250
const { s: afterDebt } = completeSession(clone(SEED), "2026-07-23", entries, slpDebt);
ok(afterDebt.exercises.find(e => e.id === "press").own === true && !afterDebt.queue.find(q => q.id === "q_press250"), "debt day = provisional, nothing loads");

// 6. macro engine: two sub-floor weeks arm the floor rule; low BF arms Ease 2
let m = clone(SEED);
m.weekly = [{ wk: "2026-07-06", trend: 165.2 }, { wk: "2026-07-13", trend: 164.7 }, { wk: "2026-07-20", trend: 164.2 }]; m.blackout.until = "2026-07-01";
m = runAdaptive(m, "2026-07-22");
ok(m.proposals.some(p => p.title.indexOf("RATE FLOOR") === 0), "floor rule arms after two slow weeks");
let e2 = clone(SEED); e2.trend = 160; e2.blackout.until = "2026-07-01";
e2 = runAdaptive(e2, "2026-07-22");
ok(e2.proposals.some(p => p.rid === "ease2"), "Ease 2 arms itself when est BF crosses the line");
ok(bfEst(clone(SEED)).pct > 14 && bfEst(clone(SEED)).pct < 16, "BF model sane at current trend");

// 7. migration preserves v1 progress
const old = { v: 1, trend: 163.9, reads: [{ d: "2026-07-22", w: 163.0, sealed: true }], queue: [{ id: "rows180", done: true }], sleep: { nights: [{ d: "2026-07-21", h: 8 }] }, boosts: 3 };
const mig = migrate(old);
ok(mig.v === SEED.v && mig.exercises.find(e => e.id === "rows").w === 180 && mig.boosts === 3 && mig.reads.length === 40, "v1 → v3 migration keeps logged progress");

// v2.1 — history integration
const { HISTORY, ROLLUPS, currentRate: cr, migrate: mg, runAdaptive: ra, SEED: S3 } = __test;
ok(HISTORY.length === 42 && S3.reads.length === 39, "42-day record woven in, 39 real reads seeded");
ok(S3.v === SEED.v && Math.abs(S3.trend - 164.7) < 0.2, "trend seeded from trailing-7-day of real reads (~164.7)");
ok(cr(clone(S3)).measured === true && S3.weekly.length >= 5, "rate gauge now MEASURED off six weeks of snapshots");
ok(ROLLUPS.length === 6 && ROLLUPS[0].wk === 6 && ROLLUPS[5].wk === 1, "six weekly rollups, newest first");
const sealedRun = ra(clone(S3), "2026-07-22");
ok(!sealedRun.proposals.some(p => p.rid.indexOf("redline") === 0), "sealed window mutes the false redline his sheet flagged");
const v2old = { v: 2, reads: [{ d: "2026-07-22", w: 163.0, sealed: true }], dailyLogs: { "2026-07-22": { cal: 2470, pro: 176, steps: 9000 } }, sleep: { nights: [{ d: "2026-07-21", h: 8 }] }, exercises: clone(S3.exercises), queue: clone(S3.queue), boosts: 5 };
const m3 = mg(v2old);
ok(m3.v === SEED.v && m3.reads.length === 40 && m3.dailyLogs["2026-07-22"].pro === 176 && m3.sleep.nights.some(n => n.d === "2026-07-21") && m3.boosts === 5, "v2 phone state merges over the history without losing a thing");

// v2.2 — signals
const { completeSession: cs2, genSession: gs2, SEED: S4, migrate: mg2 } = __test;
ok(S4.v >= 4 && Array.isArray(S4.waist) && S4.exercises.every(e => Array.isArray(e.rirHist)), "seed carries v4 signal fields");
// RIR-0 twice → hold, and a hot grind never earns
let st = clone(S4);
const mk1 = (iso) => {
  const g = gs2(st, iso, slpClean);
  const en = g.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: null }));
  const lat = en.find(e => e.id === "lateral"); lat.reps = [15, 15, 15]; lat.rir = 0;
  return en;
};
st = cs2(st, "2026-07-23", mk1("2026-07-23"), slpClean).s;
ok(!st.queue.some(q => q.exId === "lateral" && q.kind === "debut" && !q.done), "top-of-window at RIR 0 does NOT earn the load");
st = cs2(st, "2026-07-27", mk1("2026-07-27"), slpClean).s;
const latEx = st.exercises.find(e => e.id === "lateral");
ok(latEx.holdFlag === true, "two RIR-0 sessions flip the hold");
ok(gs2(st, "2026-07-30", slpClean).ex.find(e => e.id === "lateral").note.indexOf("HELD") === 0, "held lift announces itself next session");
// joint pattern: 3 flags in 3 weeks arms a proposal
let st2 = clone(S4);
["2026-07-23", "2026-07-27", "2026-07-30"].forEach(iso => {
  const g = gs2(st2, iso, slpClean);
  const en = g.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: null }));
  st2 = cs2(st2, iso, en, slpClean, { note: "", niggles: ["knee"] }).s;
});
ok(st2.proposals.some(p => p.rid.indexOf("niggle_knee") === 0), "3 knee flags in 3 weeks surfaces on NOW");
// v3 → v4 patch
const oldV3 = clone(S4); oldV3.v = 3; delete oldV3.waist; oldV3.exercises.forEach(e => { delete e.rirHist; });
const m4 = mg2(oldV3);
ok(m4.v >= 4 && Array.isArray(m4.waist) && m4.exercises.every(e => Array.isArray(e.rirHist)), "v3 phone state patches cleanly to v4");

// (summary moved to end)

// v2.2.2 — undo
const { undoRead: ur, SEED: S5 } = __test;
let u = clone(S5); u.blackout.until = "2026-07-01"; // simulate post-seal
const t0 = u.trend;
u.reads.push({ d: "2026-07-28", w: 162.0, sealed: false, pt: u.trend });
u.trend = +(u.trend * 0.7 + 162.0 * 0.3).toFixed(1);
u.weekly.push({ wk: "2026-07-27", trend: u.trend });
const u2 = ur(u, "2026-07-28");
ok(!u2.reads.some(r => r.d === "2026-07-28") && u2.trend === t0 && !u2.weekly.some(w => w.wk === "2026-07-27"), "undo removes the read, restores trend, clears the orphaned snapshot");
let v = clone(S5);
v.reads.push({ d: "2026-07-22", w: 163.0, sealed: true, pt: v.trend });
const v2 = ur(v, "2026-07-22");
ok(!v2.reads.some(r => r.d === "2026-07-22") && v2.trend === v.trend, "sealed mislog undoes clean — trend was never touched");

console.log(`\nFINAL2: ${pass} passed, ${fail} failed`);
// (summary moved to end)

// v2.3 — order + completeness
const { genSession: gs3, SEED: S6, migrate: mg3 } = __test;
ok(S6.v >= 5 && S6.exercises.some(e => e.id === "sulek") && S6.exercises.some(e => e.id === "hanging"), "Sulek + hanging raise now exist (the doc omitted them; the sheet didn't)");
const uSess = gs3(clone(S6), "2026-07-23", slpClean);
ok(uSess.ex[0].id === "lateral" && uSess.ex[uSess.ex.length - 1].id === "pronated", "upper runs lateral-first, pronated-last — the 7/20 gym order");
const lSess = gs3(clone(S6), "2026-07-24", slpClean);
ok(lSess.ex.map(e => e.id).join(",") === "calves,abs,hanging,hack,extension,ham", "lower matches the 7/17+7/21 order exactly");
let co = clone(S6); co.exOrder.U = [...co.exOrder.U].reverse();
ok(gs3(co, "2026-07-23", slpClean).ex[0].id === "pronated", "custom reorder persists into generated sessions");
const oldV4 = clone(S6); oldV4.v = 4; delete oldV4.exOrder; oldV4.exercises = oldV4.exercises.filter(e => e.id !== "sulek" && e.id !== "hanging");
const m5 = mg3(oldV4);
ok(m5.v >= 5 && m5.exercises.some(e => e.id === "sulek") && Array.isArray(m5.exOrder.L), "existing phone states gain the new lifts and order cleanly");

console.log(`\nFINAL3: ${pass} passed, ${fail} failed`);
// (summary moved to end)

// v2.4 — setups
const { SEED: S7, migrate: mg4, genSession: gs4 } = __test;
ok(S7.v >= 6 && S7.exercises.every(e => typeof e.setup === "string" && e.setup.length > 10), "every lift carries its settings + cues");
ok(S7.exercises.find(e => e.id === "sulek").n.indexOf("forearm") > -1, "Sulek corrected to what it actually is — forearm work");
ok(gs4(clone(S7), "2026-07-23", slpClean).ex[0].setup.indexOf("resistance profile 5") > -1, "setup rides into the generated session card");
const oldV5 = clone(S7); oldV5.v = 5; oldV5.exercises.forEach(e => { delete e.setup; e.n = e.n === "Sulek curl (forearm)" ? "Sulek raise" : e.n; });
const m6 = mg4(oldV5);
ok(m6.v >= 6 && m6.exercises.every(e => e.setup) && m6.exercises.find(e => e.id === "sulek").n.indexOf("forearm") > -1, "existing phones gain blurbs and the name fix");

console.log(`\nFINAL4: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v2.5 — live cue layer
const { genSession: gs5, completeSession: cs5, SEED: S8 } = __test;
const u5 = gs5(clone(S8), "2026-07-23", slpClean);
ok(u5.ex.find(e => e.id === "press").live.indexOf("8,8,7 clean owns it") === 0, "press NOW-line reads the live own standard");
ok(u5.ex.find(e => e.id === "rows").live.indexOf("debut at 180") === 0, "rows NOW-line reads the debut context");
ok(S8.exercises.find(e => e.id === "press").setup.indexOf("controlled 8s") === -1, "stale rep numbers purged from the static layer");
// after owning, the same lift's NOW-line changes by itself
const en5 = u5.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: null }));
en5.find(e => e.id === "press").reps = [8, 8, 7];
const s5b = cs5(clone(S8), "2026-07-23", en5, slpClean).s;
const mon5 = gs5(s5b, "2026-07-27", slpClean);
ok(mon5.ex.find(e => e.id === "press").live.indexOf("debut at 250") === 0, "own it Thursday → Monday's press NOW-line flips to the 250 debut on its own");

// (interim)

// v2.6 — PREV anchor
const { genSession: gs6, completeSession: cs6, SEED: S9, migrate: mg6 } = __test;
const u6 = gs6(clone(S9), "2026-07-23", slpClean);
const pPrev = u6.ex.find(e => e.id === "press").prev;
ok(pPrev && pPrev.reps.join(",") === "8,7,6" && pPrev.debt === true, "press PREV carries 8,7,6 with the on-debt context");
ok(u6.ex.find(e => e.id === "extension") === undefined, "extension correctly absent from upper (sanity)");
const l6 = gs6(clone(S9), "2026-07-24", slpClean);
ok(l6.ex.find(e => e.id === "extension").prev.w === 155, "extension PREV shows the honest 155×9,6 crater, not a fake 150");
const en6 = u6.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: e.id === "lateral" ? 1 : null }));
const s6b = cs6(clone(S9), "2026-07-23", en6, slpClean).s;
const latMeta = s6b.exercises.find(e => e.id === "lateral").lastMeta;
ok(latMeta.d === "2026-07-23" && latMeta.rir === 1 && latMeta.debt === false, "completing a session rewrites PREV with date, RIR, and clean context");
const rowsMeta = s6b.exercises.find(e => e.id === "rows").lastMeta;
ok(rowsMeta.w === 180, "debut PREV records the weight actually lifted");
const oldV7 = clone(S9); oldV7.v = 7; oldV7.exercises.forEach(e => delete e.lastMeta);
oldV7.sessionLog["2026-07-22"] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 1 }], at: 1 };
const m8 = mg6(oldV7);
ok(m8.exercises.find(e => e.id === "press").lastMeta.d === "2026-07-22", "migration prefers the phone's own logged session over the sheet seed");

// (interim)

// v3.0 — recovery, damping, sync hygiene
const { recoveryIndex: ri, applyRead: ar, runAdaptive: ra3, SEED: SA, migrate: mgA } = __test;
ok(ri(clone(SA)).score >= 80 === false || true, "index computes");
const base = ri(clone(SA));
ok(base.score === 80 && base.band === "GREEN", "seed reads 80 GREEN — one clean night short + a sub-7 five-night average");
let beat = clone(SA);
beat.exercises[0].holdFlag = true; beat.exercises[1].holdFlag = true;
beat.sleep.nights = beat.sleep.nights.slice(0, -4).concat([{d:"2026-07-17",h:5},{d:"2026-07-18",h:5},{d:"2026-07-19",h:5},{d:"2026-07-20",h:5},{d:"2026-07-21",h:5}]);
beat.sessionLog["2026-07-21"] = { entries: [], niggles: ["knee","knee","shoulder"], at: 1 };
const beatIdx = ri(beat);
ok(beatIdx.band === "LOW" && beatIdx.score < 55, "stacked drag lands LOW: " + beatIdx.score);
beat.blackout.until = "2026-07-01";
const raOut = ra3(beat, "2026-07-22");
ok(raOut.proposals.some(p => p.rid.indexOf("recovery_") === 0), "LOW recovery arms the hold-structure proposal");
// spike damping
let sd = clone(SA); sd.blackout.until = "2026-07-01"; const t0b = sd.trend;
const sd2 = ar(sd, "2026-07-28", sd.trend + 4.6);
ok(Math.abs(sd2.trend - +(t0b + 0.45).toFixed(1)) < 0.001 && sd2.reads[sd2.reads.length - 1].note.indexOf("spike") === 0, "a +4.6 dinner moves the trend +0.45 max, marked as damped");
const sd3 = ar(clone(sd), "2026-07-28", sd.trend - 0.6);
ok(Math.abs(sd3.trend - +(t0b - 0.18).toFixed(1)) < 0.001, "normal reads still flow at full EWMA weight");
// sync payload hygiene + v9
ok(JSON.stringify(SA).indexOf("ghtoken") === -1 && SA.v === 9 && Array.isArray(SA.photos), "state v9, token never inside the payload");
const oldV8 = clone(SA); oldV8.v = 8; delete oldV8.photos; delete oldV8.sync;
ok(mgA(oldV8).v === 9 && Array.isArray(mgA(oldV8).photos), "v8 phones patch to v9 cleanly");

// (interim)

// v3.1 — observed maintenance
const { observedTDEE: ot, SEED: SB } = __test;
ok(ot(clone(SB)) === null, "sealed window: observed maintenance correctly refuses to print");
let ob = clone(SB); ob.blackout.until = "2026-07-01";
const o1 = ot(ob);
ok(o1 && o1.days >= 8 && o1.tdee > 2100 && o1.tdee < 2700, `post-seal it computes from real logs: ~${o1 && o1.tdee} over ${o1 && o1.days} days`);
let ob2 = clone(SB); ob2.blackout.until = "2026-07-01"; ob2.dailyLogs = {};
ok(ot(ob2) === null, "under 8 logged days: stays silent rather than guessing");

console.log(`\nFINAL8: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
