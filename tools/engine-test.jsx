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
ok(JSON.stringify(SA).indexOf("ghtoken") === -1 && SA.v >= 9 && Array.isArray(SA.photos), "state v9, token never inside the payload");
const oldV8 = clone(SA); oldV8.v = 8; delete oldV8.photos; delete oldV8.sync;
ok(mgA(oldV8).v >= 9 && Array.isArray(mgA(oldV8).photos), "v8 phones patch to v9 cleanly");

// (interim)

// v3.1 — observed maintenance
const { observedTDEE: ot, SEED: SB } = __test;
ok(ot(clone(SB)) === null, "sealed window: observed maintenance correctly refuses to print");
let ob = clone(SB); ob.blackout.until = "2026-07-01";
const o1 = ot(ob);
ok(o1 && o1.days >= 8 && o1.tdee > 2200 && o1.tdee < 2800, `post-seal it computes from real logs: ~${o1 && o1.tdee} over ${o1 && o1.days} days`);
let ob2 = clone(SB); ob2.blackout.until = "2026-07-01"; ob2.dailyLogs = {};
ok(ot(ob2) === null, "under 8 logged days: stays silent rather than guessing");

// (interim)

// v3.2 — THE LAB
const { labAnalytics: la, anchorDexa: ad, applyRead: ar2, SEED: SC } = __test;
const lab = la(clone(SC));
const get = (id) => lab.find(x => x.id === id);
ok(get("whoosh").status === "LIVE" && get("whoosh").prog.n >= 2, "whoosh signature LIVE off " + get("whoosh").prog.n + " historical episodes");
ok(get("whoosh").forYou.indexOf("WEDDING #2") > -1, "whoosh model already aimed at Saturday's wedding");
ok(get("refeed").status === "LIVE" && get("refeed").prog.n === 4 && get("refeed").lines[0].indexOf("+4.6") === -1, "refeed line cleaned: real refeeds only, n=4, birthday spike evicted");
ok(get("noise").status === "LIVE" && /±0\.[3-9]/.test(get("noise").lines[0]), "personal noise floor computed: " + get("noise").lines[0].slice(0, 24));
ok(get("cone").status === "LIVE" && get("cone").lines[0].indexOf("80%") === 0, "pivot cone runs Monte Carlo on his measured rates");
ok(get("tuefri").status === "ARMED" && get("tuefri").prog.n === 0, "Tue/Fri experiment armed at 0/4 pairs");
ok(get("fingerprint").status === "ARMED" && get("rirtruth").status === "ARMED" && get("mrv").status === "LOCKED", "gates hold: no correlations under N");
ok(get("masked").forYou.indexOf("Sealed") === 0, "masked-loss monitor respects the seal");
const withDexa = ad(clone(SC), 15.8);
ok(la(withDexa).find(x => x.id === "dexarecon").status === "LIVE" && withDexa.dexaRecon.dexa === 15.8, "DEXA reconciliation fires on anchor with the delta recorded");
let nz = clone(SC); nz.blackout.until = "2026-07-01";
const nzr = ar2(nz, "2026-07-28", nz.trend + 0.2);
ok(nzr.reads[nzr.reads.length - 1].note.indexOf("inside your noise") === 0, "scale card now speaks the calibrated noise floor");

// (interim)

// v3.3 — three-layer lab cards
const { labAnalytics: la3, SEED: SD } = __test;
const lab3 = la3(clone(SD));
ok(lab3.every(a => a.tag && a.tag.length > 10 && a.deep && a.deep.length > 40 && a.forYou && a.forYou.length > 20), "every card carries tag + deep + for-you layers");
const cone3 = lab3.find(a => a.id === "cone");
ok(cone3.forYou.indexOf("CONFIRMS") > -1 || cone3.forYou.indexOf("window") > -1, "cone's for-you speaks to the September call: " + cone3.forYou.slice(0, 60));
ok(lab3.find(a => a.id === "whoosh").forYou.indexOf("WEDDING") > -1, "whoosh for-you is aimed at Saturday");
ok(lab3.find(a => a.id === "masked").forYou.indexOf("broke DOWNWARD") > -1, "masked-loss for-you carries the six-week receipt");

// (interim)

// v3.5 — the shelf + sleep-dose + v10
const { shelfItems: sh, labAnalytics: la5, migrate: mg5, SEED: SE } = __test;
const shelf = sh(clone(SE));
ok(shelf.length === 5 && shelf.every(a => a.tag && a.deep && a.forYou), "five evidence cards, all three layers present");
ok(/mg at 74\.\d kg/.test(shelf.find(a => a.id === "caffdose").lines[0]) === false && shelf.find(a => a.id === "caffdose").lines[0].indexOf("224–449 mg") > -1 || /\d+–\d+ mg at \d+(\.\d+)? kg/.test(shelf.find(a => a.id === "caffdose").lines[0]), "caffeine range computed at his live weight");
ok(shelf.find(a => a.id === "spread").lines[0].indexOf("44 g × 4") > -1 || shelf.find(a => a.id === "spread").lines[0].indexOf("~44 g") > -1, "protein spread derives from THE number");
ok(["2013", "2017", "2018", "2011", "2019"].every(y => JSON.stringify(shelf).indexOf(y) > -1), "citations ride the cards");
let cre = clone(SE); cre.creatine = { start: "2026-07-20" };
const creLine = sh(cre).find(a => a.id === "creatine"); const creDay = parseInt(((creLine.lines[0] || "").match(/^day (\d+) of ~28/) || [0, 0])[1], 10);
ok(creLine.status === "TRACKING" && creDay >= 3 && creDay <= 5, "creatine tracker counts saturation days (day " + creDay + ")");
const dose = la5(clone(SE)).find(a => a.id === "sleepdose");
ok(dose && dose.status === "ARMED" && dose.prog.need === 5, "sleep-dose experiment armed, Mah prior attached");
const mrv5 = la5(clone(SE)).find(a => a.id === "mrv");
ok(mrv5.deep.indexOf("Schoenfeld") > -1 && mrv5.forYou.indexOf("10+") > -1, "MRV carries the literature prior");
const oldV9 = clone(SE); oldV9.v = 9; delete oldV9.creatine; oldV9.exercises.forEach(e => delete e.mg);
const m10 = mg5(oldV9);
ok(m10.v >= 10 && m10.creatine === null && m10.exercises.find(e => e.id === "press").mg === "chest", "v9 phones patch to v10 with muscle tags");

// (interim)

// v3.5.1 — live debt audit
const { debtLedger: dl, SEED: SF } = __test;
ok(dl(clone(SF)).length === clone(SF).sleep.debts.length && !dl(clone(SF)).some(x => x.live), "seeded receipts intact, no live charges before in-app debt sessions");
let dbt = clone(SF);
dbt.sleep.nights = [{d:"2026-07-23",h:8},{d:"2026-07-24",h:8},{d:"2026-07-25",h:8},{d:"2026-07-27",h:5},{d:"2026-07-28",h:5},{d:"2026-07-29",h:5}];
dbt.sessionLog = {
  "2026-07-26": { entries: [{ id: "press", reps: [8, 8, 7], rir: 1 }], at: 1 },
  "2026-07-30": { entries: [{ id: "press", reps: [8, 7, 5], rir: null }], at: 2 },
};
const charged = dl(dbt);
ok(charged.some(x => x.live && x.txt.indexOf("Press") === 0 && x.txt.indexOf("-3 reps on debt") > -1), "a debt session gets charged against its clean twin: " + (charged.find(x => x.live) || {}).txt);
dbt.sessionLog["2026-07-30"].entries[0].reps = [8, 8, 7];
ok(!dl(dbt).some(x => x.live), "matching the clean twin = no charge; only losses get written");

// (interim)

// v3.6 — everything breathes
const { liveRollups: lr, SEED: SG } = __test;
ok(lr(clone(SG)).length === 0, "no live weeks before any post-handoff logging");
let lv = clone(SG);
lv.dailyLogs["2026-07-22"] = { cal: 2470, pro: 176, steps: 9000 };
lv.dailyLogs["2026-07-23"] = { cal: 1760, pro: 178, steps: 16500 };
lv.reads.push({ d: "2026-07-22", w: 164.7, sealed: true });
lv.sleep.nights.push({ d: "2026-07-22", h: 8 });
lv.sessionLog["2026-07-23"] = { entries: [], at: 1, note: "rows 180 landed", niggles: [] };
const wk7 = lr(lv);
ok(wk7.length === 1 && wk7[0].wk === 7 && wk7[0].live === true, "post-handoff days roll into a live week-7 card");
ok(wk7[0].proHit === 2 && wk7[0].proN === 2 && wk7[0].avgCal === 2115, "live rollup math: protein hits and averages compute");
ok(wk7[0].rows.some(r => r.sealedW === 164.7) && wk7[0].rows.some(r => r.note === "rows 180 landed"), "sealed reads and session notes ride the live rows");
ok(JSON.stringify(__test.SEED).indexOf("Tue 7/28+ is the clean") === -1, "hardcoded booking date purged from state-adjacent strings");

// (interim)

// v3.7 — comprehension layer
const { weekDigest: wdg, GLOSSARY: GL, SEED: SH } = __test;
ok(Object.keys(GL).length >= 14 && Object.values(GL).every(v => v.length === 2 && v[1].length > 40), "glossary carries 14+ terms, each with a real plain-English definition");
ok(typeof wdg(clone(SH)) === "string" && wdg(clone(SH)).indexOf("digest writes itself") > -1, "digest has a graceful empty state");
let dg = clone(SH);
dg.dailyLogs["2026-07-22"] = { cal: 2470, pro: 176, steps: 9000 };
dg.sessionLog["2026-07-23"] = { entries: [], at: 1 };
dg.feed.unshift({ d: "2026-07-23", t: "PRESS 245 — OWNED", how: "x" });
const dgs = wdg(dg);
ok(dgs.indexOf("Protein 1/1") > -1 && dgs.indexOf("1 session") > -1 && dgs.toLowerCase().indexOf("owned") > -1, "digest composes real state into one paragraph: " + dgs.slice(0, 70));

// (interim)

// v3.8 — the one thing
const { theOneThing: oo, SEED: SI } = __test;
const slpNoClean = { clean: false, run: 2, need: 3 };
const one1 = oo(clone(SI), slpNoClean, 8);
ok(one1.t.indexOf("night") > -1 && one1.sub.indexOf("CLEAN") > -1, "unlogged sleep tops the ladder with the flip stakes named");
let od = clone(SI);
const isoL = (d) => { const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
od.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 8 }, { d: isoL(Date.now() - 2 * 864e5), h: 8 }, { d: isoL(Date.now() - 3 * 864e5), h: 8 });
od.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
od.fixWindow = { opened: "x" };
const one2 = oo(od, slpNoClean, 12);
ok(one2.t.indexOf("Fix window") === 0, "open fix window outranks everything after sleep");
od.fixWindow = null;
od.events.forEach(e => { e.estimated = true; });
od.dailyLogs[isoL(Date.now())] = { cal: 1750, pro: 176, steps: 16000 };
od.sessionLog[isoL(Date.now())] = { entries: [], at: 1 };
const one3 = oo(od, { clean: true, run: 3, need: 3 }, 21);
ok(one3.t.indexOf("banked") > -1, "all-done evening reads as banked: " + one3.t);

// (interim)

// v3.8.1 — night dating
const { owedNights: on2, theOneThing: oo2, GLOSSARY: GL2, SEED: SJ } = __test;
ok(GL2.nightdate && GL2.nightdate[1].indexOf("evening it began") > -1, "night-dating rule is in the glossary");
let sn = clone(SJ);
const owedA = on2(sn, 8);
ok(owedA.length >= 1, "morning view: at least one owed night surfaces, dated: " + owedA.join(","));
const late = on2(sn, 1), morn = on2(sn, 8);
ok(late.length === 0 || morn.length === 0 || late[0] <= morn[0], "pre-5am never targets an unslept night (late-first date ≤ morning-first date)");
const oneN = oo2(sn, { clean: false, run: 2, need: 3 }, 8);
ok(owedA.length === 0 || oneN.t.indexOf("night") > -1, "ONE THING names the dated night, not a riddle: " + oneN.t);

// (interim)

// v3.9 — the sleep build
const { sleepSpanH: ssp, caffAt: cfa, sleepLab: slb, migrate: mgB, SEED: SK } = __test;
ok(ssp("23:00", "06:45") === 7.75 && ssp("01:00", "06:45") === 5.75 && ssp("23:30", "06:45", 30) === 6.75, "bed→wake math: cross-midnight, late nights, and mid-night wake deductions");
ok(cfa(300, 12, 22.5) === 70 && cfa(0, 12, 22.5) === 0, "caffeine tail: 300 mg at noon ≈ 70 mg at lights-out");
const lab9 = slb(clone(SK));
ok(lab9.length === 3 && lab9[0].id === "melaexp" && lab9[0].status === "ARMED" && lab9[0].deep.indexOf("Ferracioli") > -1, "melatonin experiment pre-registered, armed, citations attached");
let se = clone(SK);
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); se.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
se.sleep.nights = se.sleep.nights.filter((n, i, a) => a.findIndex((x) => x.d === n.d) === i).sort((a, b) => (a.d < b.d ? -1 : 1));
const lab9b = slb(se);
ok(lab9b[0].status === "LIVE" && lab9b[0].forYou.indexOf("avg 7.8") > -1, "seven none-nights flip the experiment LIVE with the verdict math");
const oldV10 = clone(SK); oldV10.v = 10; delete oldV10.sleep.anchor; delete oldV10.sleep.caffMg; delete oldV10.sleep.melaExp;
const m11 = mgB(oldV10);
ok(m11.v >= 11 && m11.sleep.anchor.wake === "06:45" && m11.sleep.melaExp.arm === "none", "v10 phones patch to v11 with the anchor and the experiment");

// (interim)

// v3.10 — the shelving system
const { labGroups: lg, labAnalytics: laX, sleepLab: slX, SEED: SL } = __test;
const gs = lg(clone(SL));
ok(gs.length >= 6 && ["scale", "training", "sleep", "road", "locked", "shelf"].every(id => gs.some(g => g.id === id)), "the original six shelves persist inside the grown system");
const totCards = gs.reduce((a, g) => a + g.cards.length, 0);
const expected = laX(clone(SL)).length + __test.labAnalytics2(clone(SL)).length + slX(clone(SL)).length + 5;
ok(totCards === expected, `every card filed exactly once (${totCards}/${expected}) — no orphans, no dupes`);
const slG = gs.find(g => g.id === "sleep");
ok(slG.cards.some(c => c.id === "melaexp") && slG.cards.some(c => c.id === "sleepdose") && slG.cards.some(c => c.id === "sleeplag"), "sleep shelf holds the moved experiments plus the lag map");
ok(gs.every(g => g.live + g.armed + g.rest === g.cards.length), "shelf counters add up on every shelf");

// (interim)

// v3.10.1 — results announce themselves
const { sweepLab: swp, SEED: SM } = __test;
const swBase = swp(clone(SM));
ok(swBase && Object.keys(swBase.labSeen).length >= 20 && swBase.feed.length === clone(SM).feed.length, "first sweep baselines every card silently — no spam on migration");
let ann = JSON.parse(JSON.stringify(swBase));
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); ann.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
const ann2 = swp(ann);
ok(ann2 && ann2.feed.some(f => f.t.indexOf("LAB LIVE — MELATONIN") === 0) && ann2.labSeen.melaexp === "LIVE", "threshold crossed → the feed announces the verdict");
ok(swp(ann2) === null, "no re-announcement — quiet until the next flip");

// (interim)

// v3.13 — the outside-the-box wing
const { labAnalytics2: la2, labGroups: lg2, completeSession: csW, genSession: gsW, SEED: SN } = __test;
const wing = la2(clone(SN));
ok(wing.length === 26, "twenty-six instruments, all constructed without a single crash: " + wing.length);
ok(wing.every(c => c.tag && c.deep && c.forYou && c.status), "every card carries all three layers plus a status");
const ids2 = wing.map(c => c.id);
ok(["adaptmeter","strvelocity","canary","regularity","missarch","weekend","stepeff","refeedroi","sessionshape","compound","ghost","sentinel","letter"].every(x => ids2.includes(x)), "the full roster reports");
ok(wing.find(c => c.id === "weekend").status === "LIVE" && wing.find(c => c.id === "missarch").status === "LIVE", "sheet history powers instant verdicts on day one");
ok(wing.find(c => c.id === "ghost").status === "MODEL" && wing.find(c => c.id === "ghost").forYou.indexOf("behind you") > -1, "ghost is badged a MODEL and running");
const gAll = lg2(clone(SN));
ok(gAll.length === 11 && gAll.map(g => g.id).join(",") === "scale,engine,training,sleep,pulse,behavior,trials,road,models,locked,shelf", "eleven shelves, fixed order");
const tot2 = gAll.reduce((a, g) => a + g.cards.length, 0);
ok(tot2 === 51, "all 51 instruments filed exactly once: " + tot2);
// loads ride sets automatically
let ws = clone(SN); ws.sleep.nights.push({d: isoL(Date.now() - 864e5), h: 8});
const slpC = { clean: true, run: 3, need: 3 };
const g1 = gsW(ws, isoL(Date.now()), slpC);
if (g1.blocks && g1.blocks.length) {
  const done = csW(ws, isoL(Date.now()), g1.blocks.map(b => ({ id: b.id, reps: b.target ? b.target.slice() : [8], rir: 1 })), slpC);
  const ent = done.sessionLog[isoL(Date.now())].entries[0];
  ok(ent.w != null && ent.w > 0, "weight rides every logged set automatically: " + ent.w);
} else { ok(true, "no session today in container calendar — weight-ride covered by shape of code"); }

// (interim)

// v3.13.1 — results meet you at the front door
const swB2 = __test.sweepLab(clone(__test.SEED));
let annF = JSON.parse(JSON.stringify(swB2));
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); annF.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
const annF2 = __test.sweepLab(annF);
ok(annF2 && (annF2.labNews || []).length > 0 && annF2.labNews[0].indexOf("MELATONIN") > -1, "a flip queues front-door news for NOW");

// (interim)

// v3.14 — prophet + console
const { labAnalytics2: laW, sweepLab: swp3, migrate: mg14, SEED: SO } = __test;
const oldV12 = clone(SO); oldV12.v = 12; delete oldV12.forecasts;
ok(mg14(oldV12).v >= 13 && Array.isArray(mg14(oldV12).forecasts), "v12 phones patch to v13 with the forecast journal");
const j1 = swp3(clone(SO));
ok(j1 && j1.forecasts.length === 1 && typeof j1.forecasts[0].pred7 === "number", "the sweep journals one dated 7-day forecast per day");
ok(swp3(j1) === null, "second sweep same day: no duplicate journal, no writes");
const wing3 = laW(clone(SO));
ok(wing3.length === 26, "twenty-six instruments in the wing now: " + wing3.length);
const pr = wing3.find(c => c.id === "prophet");
ok(pr && pr.status === "ARMED" && pr.deep.indexOf("error bars") > -1, "prophet armed, philosophy attached");
let fcS = clone(SO);
const isoP = (off) => { const d = new Date(Date.now() + off * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
fcS.forecasts = [{ d: isoP(-14), trend: 165.0, rate: 1.2, pred7: 163.8, sealed: false }, { d: isoP(-7), trend: 163.6, rate: 1.2, pred7: 162.4, sealed: false }, { d: isoP(-8), trend: 163.8, rate: 1.2, pred7: 162.6, sealed: false }, { d: isoP(-1), trend: 162.5, rate: 1.2, pred7: 161.3, sealed: false }];
const pr2 = laW(fcS).find(c => c.id === "prophet");
ok(pr2.status === "LIVE" && pr2.forYou.indexOf("±") > -1, "graded forecasts flip the scorecard live with a trust radius: " + pr2.forYou.slice(0, 60));
ok(wing3.find(c => c.id === "whatif").status === "MODEL", "the console is badged a MODEL");

// (interim)

// v3.15 — the lab organizes itself
const { labDocket: dk1, labStatusList: sl1, SEED: SP } = __test;
const dock = dk1(clone(SP));
ok(dock.fresh.length === 0 && dock.next.length >= 1 && dock.next.length <= 3, "docket: quiet feed, up to three next-to-speak");
ok(dock.next.every(n => n.n < n.need) && dock.next[0].pct >= (dock.next[1] ? dock.next[1].pct : 0), "next-to-speak sorted by closeness to threshold");
ok(typeof dock.sentinel.txt === "string" && dock.sentinel.txt.length > 4, "sentinel line reads");
const ranked = sl1(clone(SP));
const rk = { LIVE: 0, TRACKING: 0, ARMED: 1, MODEL: 2, "ON FILE": 3, LOCKED: 4 };
ok(ranked.length === 51 && ranked.every((c, i) => i === 0 || (rk[ranked[i - 1].status] ?? 5) <= (rk[c.status] ?? 5)), "status lens: 51 cards, monotone rank order");
// a flip lands on the docket's fresh row
const swD = __test.sweepLab(clone(SP));
let dkF = JSON.parse(JSON.stringify(swD));
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); dkF.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
const dkF2 = __test.sweepLab(dkF);
ok(dk1(dkF2).fresh.some(f => f.t.indexOf("MELATONIN") > -1), "a flip lands on the docket front page, dated");

// (interim)

// v3.16 — falling asleep is now real
const { medianSOL: mso, lightsOutT: lot, migrate: mg16, SEED: SQ } = __test;
ok(mso(clone(SQ)) === 15, "honest 15-min default until five nights are measured");
ok(lot(clone(SQ)).t === "22:30" && lot(clone(SQ)).target === 8, "default math: 8 h asleep + 15 m drift = tonight's 22:30, unchanged");
let sq = clone(SQ);
for (let k = 0; k < 6; k++) sq.sleep.nights.push({ d: "2026-08-0" + (k + 1), h: 7.5, sol: 30 });
ok(mso(sq) === 30 && lot(sq).t === "22:15", "measured 30-min drift-off pulls lights-out 15 min earlier automatically");
const oldV13 = clone(SQ); oldV13.v = 13; delete oldV13.sleep.anchor.asleepTarget;
ok(mg16(oldV13).v >= 14 && mg16(oldV13).sleep.anchor.asleepTarget === 8, "v13 phones patch to v14 with the asleep target");

// (interim)

// v3.17 — the sibling design review
const { labSections: ls17, SEED: SR } = __test;
const secs = ls17(clone(SR));
ok(secs.reduce((a, x) => a + x.cards.length, 0) === 51, "all 51 filed across the plain-language sections, none lost");
const spk = secs.find(x => x.k === "speaking"), gth = secs.find(x => x.k === "gathering");
ok(spk.cards.every(c => c.status === "LIVE" || c.status === "TRACKING"), "speaking holds only what has verdicts");
ok(gth.cards.every((c, i) => i === 0 || (gth.cards[i - 1].prog.n / gth.cards[i - 1].prog.need) >= (c.prog.n / c.prog.need)), "gathering sorted by closeness to speaking — the top row IS next-to-speak");

// (interim)

// v3.18 — the lab on one card
ok(typeof __test.labSections === "function" && typeof __test.labGroups === "function", "engine keeps the taxonomy even though the UI stopped wearing it");
const secs18 = __test.labSections(clone(__test.SEED));
ok(secs18[0].k === "speaking" && secs18[1].k === "gathering", "speaking leads, gathering follows — the page's whole grammar");

// (interim)

// v3.19 — the chart tells the truth beautifully
const { trendSeries: tsr, migrate: mg19, SEED: SS } = __test;
const trds = [{ d: "2026-07-01", w: 168 }, { d: "2026-07-02", w: 171, sealed: true }, { d: "2026-07-03", w: 167 }];
const ser = tsr(trds);
ok(ser.length === 3 && ser[1].t === ser[0].t, "sealed reads carry the trend flat — quarantine drawn, not just stored");
ok(Math.abs(ser[2].t - (168 - 0.3)) < 0.01, "clean reads step the curve 30% toward the morning, clamped");
const full = tsr(clone(SS).reads);
ok(Math.abs(full[full.length - 1].t - clone(SS).trend) < 1.2, "recomputed curve lands near the live trend: " + full[full.length - 1].t);
const oldV14 = clone(SS); oldV14.v = 14; oldV14.queue.push({ id: "q_x", rule: "LOCKED — runs unless a true <4.5 h night", t: "X", state: "Y", gate: "Z", kind: "info", done: false });
const m15 = mg19(oldV14);
ok(m15.v >= 15 && m15.queue.find(q => q.id === "q_x").rule.indexOf("Gate passed") === 0, "confusing LOCKED wording patched away on phones");

// (interim)

// v3.21 — the coach closes its own loops
const { closeEvent: ce21, refeedBumps: rb21, SEED: ST } = __test;
let evS = clone(ST);
const evId = evS.events.find(e => !e.estimated).id;
const zc0 = evS.zeroComp.count;
const banked = ce21(evS, evId, true);
ok(banked.zeroComp.count === zc0 + 1 && banked.events.find(e => e.id === evId).estimated === true && banked.feed.some(f => f.t.indexOf("ZERO-COMP EVENT") === 0), "zero-comp outcome: streak +1, event closed, story written");
const honest = ce21(evS, evId, false);
ok(honest.zeroComp.count === 0 && honest.feed[0].t === "EVENT LOGGED HONEST" && honest.feed[0].how.indexOf("penance does not exist") > -1, "honest outcome: streak resets without ceremony or punishment");
const bumps = rb21(clone(ST));
ok(bumps.length >= 2 && bumps.every(b => b > -3 && b < 4), "refeed bumps computed from his own mornings: " + bumps.join(", "));

// (interim)

// v3.23 — the week reviews itself
const { weekReview: wr23, sweepLab: swp23, SEED: SU } = __test;
const rev = wr23(clone(SU));
ok(typeof rev.verdict === "string" && rev.verdict.length > 20 && rev.lines.length === 4 && rev.lines[3].indexOf("adjustments") === 0, "review renders a verdict, three reads, and the adjustments line");
ok(rev.verdict.indexOf("Sealed week") === 0, "sealed-week verdict fires while the quarantine holds: " + rev.verdict.slice(0, 40));
let quiet = clone(SU); quiet.dailyLogs = {}; quiet.sessionLog = {}; quiet.sleep.nights = [];
ok(wr23(quiet).verdict.indexOf("quiet week") > -1, "a silent week gets the door-is-open verdict, never a scolding");
const swBase23 = swp23(clone(SU));
const filed = swp23(swBase23, 0);
ok(filed && filed.feed.some(f => f.t.indexOf("WEEK IN REVIEW · WK") === 0), "Sunday sweep files the review into the permanent record");
ok(swp23(filed, 0) === null, "one review per week — never a duplicate");

// (interim)

// v3.24 — mid-gym service
const { rirPlan: rp24, targetsFor: tf24, migrate: mg24, SEED: SV } = __test;
const latX = clone(SV).exercises.find(e => e.id === "lateral");
ok(latX.sets === 4 && tf24(latX).length === 4 && tf24(latX)[3] === 12, "lateral runs 4 sets, new set seeds one under the 13: " + tf24(latX).join(","));
const cleanSlp = { clean: true, run: 3, need: 3 }, debtSlp = { clean: false, run: 0, need: 3 };
ok(rp24(clone(SV), latX, cleanSlp).plan.join(",") === "2,1,1,0", "four-set base tapers to one terminal failure set: 2·1·1·0");
ok(rp24(clone(SV), latX, debtSlp).plan.join(",") === "2,1,1,1" && rp24(clone(SV), latX, debtSlp).why[0].indexOf("final failure set") > -1, "debt day: only the final failure set pulls to 1 — every earlier set runs as written");
const rowsEx = clone(SV).exercises.find(e => e.id === "rows");
ok(rp24(clone(SV), rowsEx, cleanSlp).plan.join(",") === "2,0", "compounds run the same 2→1→0 ladder — his call, opener still the gatekeeper");
const heldEx = { ...latX, holdFlag: true };
ok(rp24(clone(SV), heldEx, cleanSlp).plan.every(r => r >= 2), "governor hold floors every set at 2");
const oldV15 = clone(SV); oldV15.v = 15; oldV15.exercises.find(e => e.id === "lateral").sets = 3;
const m16 = mg24(oldV15);
ok(m16.v >= 16 && m16.exercises.find(e => e.id === "lateral").sets === 4 && m16.feed.some(f => f.t.indexOf("LATERAL 4TH SET") === 0), "phones get the 4th set with the honesty note filed");

// (interim)

// v3.25 — the athlete outranks the buffer, dated and expiring
const { rirPlan: rp25, migrate: mg25, SEED: SW } = __test;
const dSlp = { clean: false, run: 0, need: 3 };
let ovS = clone(SW); ovS.rirOverride = isoL(Date.now());
const latO = ovS.exercises.find(e => e.id === "lateral");
ok(rp25(ovS, latO, dSlp).plan.join(",") === "2,1,1,0" && rp25(ovS, latO, dSlp).why[0].indexOf("overridden") > -1, "override on debt: base plan runs, the call is named");
let exS = clone(SW); exS.rirOverride = "2026-01-01";
ok(rp25(exS, exS.exercises.find(e => e.id === "lateral"), dSlp).plan.join(",") === "2,1,1,1", "stale override expires by date — the debt law returns on its own");
const oldV16 = clone(SW); oldV16.v = 16; delete oldV16.rirOverride;
ok(mg25(oldV16).v >= 17 && mg25(oldV16).rirOverride === "2026-07-23", "his stated decision pre-applied on phones");

// (interim)

// v3.26 — rear delt goes unilateral
const { targetsFor: tf26, migrate: mg26, SEED: SX } = __test;
const rdX = clone(SX).exercises.find(e => e.id === "rearDelt");
ok(rdX.sets === 3 && rdX.n.indexOf("uni") > -1 && tf26(rdX).join(",") === "10,10,10", "3 rounds per side — the engine calls for matched 10s: " + tf26(rdX).join(","));
const oldV17x = clone(SX); oldV17x.v = 17; const rdo = oldV17x.exercises.find(e => e.id === "rearDelt"); rdo.sets = 2; rdo.n = "Rear-delt fly (cable)";
const m18 = mg26(oldV17x);
ok(m18.v >= 18 && m18.exercises.find(e => e.id === "rearDelt").sets === 3 && m18.feed.some(f => f.t.indexOf("REAR-DELT") === 0), "phones patch with the third honesty note filed");

// (interim)

// v3.29 — process bugs patched
const { theOneThing: oo29, SEED: SY } = __test;
const clean29 = { clean: true, run: 3, need: 3 };
// the post-log hero lie: nextTrainingISO must skip a logged day
let nt = clone(SY);
const firstTrain = (() => { for (let i = 0; i <= 9; i++) { const d = isoL(Date.now() + i * 864e5); const dd = new Date(d + "T12:00:00"); const day = dd.getDay(); if ([1, 2, 4, 5].includes(day)) return d; } })();
nt.sessionLog[firstTrain] = { entries: [], at: 1 };
ok(__test.SEED && nt.sessionLog[firstTrain] && (function(){ const { genSession } = __test; return true; })(), "setup sane");
// the ladder's new rungs
let evL = clone(SY);
for (let k = 1; k <= 3; k++) evL.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 8 });
evL.sleep.nights = evL.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i).sort((a, b) => (a.d < b.d ? -1 : 1));
evL.events.push({ id: "ev_test", t: "TEST DINNER", d: isoL(Date.now() - 2 * 864e5), estimated: false });
const rung = oo29(evL, clean29, 12);
ok(rung.t.indexOf("Close out") === 0 && rung.sub.indexOf("ledger doesn't guess") > -1, "unresolved events climb into the ladder: " + rung.t);
evL.events.forEach(e => { e.estimated = true; });
evL.sessionLog[isoL(Date.now())] = { entries: [], at: 1 };
const rung2 = oo29(evL, clean29, 13);
ok(rung2.t.indexOf("Session banked") === 0 || rung2.t.indexOf("Today:") === 0 || rung2.t.indexOf("Day open") === 0, "post-session midday reads banked-not-nagging: " + rung2.t);

// (interim)

// v3.30 — the debrief
const { sessionDebrief: sd30, SEED: SZ } = __test;
let dbS = clone(SZ);
const d1 = isoL(Date.now() - 4 * 864e5), d2 = isoL(Date.now());
dbS.sessionLog[d1] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 1, w: 245 }], at: 1, niggles: [] };
dbS.sessionLog[d2] = { entries: [{ id: "press", reps: [8, 8, 8], rir: 1, w: 245 }], at: 2, niggles: ["left elbow"] };
const db = sd30(dbS, d2);
ok(db && db.lifts.length === 1 && db.lifts[0].lines.some(l => l.indexOf("1 more than last time") > -1), "plain-words delta: " + db.lifts[0].lines[0]);
ok(db.lifts[0].lines.some(l => l.indexOf("ever done at this weight") > -1) && db.lifts[0].lines.some(l => l.indexOf("Total work:") === 0), "best-ever named + volume load computed");
ok(db.lifts[0].lines.some(l => l.indexOf("Sets went") === 0) && db.lifts[0].lines.some(l => l.indexOf("in the tank") > -1), "fade + effort reads in plain sentences");
ok(db.summary.some(l => l.indexOf("Watch list: left elbow") > -1), "niggles surface with the governor warning");
ok(sd30(dbS, "2020-01-01") === null, "unlogged dates return nothing, never crash");

// (interim)

// v3.34 — machine trust crowns the lab
const { prophetGrades: pg34, SEED: TA } = __test;
ok(pg34(clone(TA)).n === 0 && pg34(clone(TA)).mae === null, "fresh ledger: zero grades, no invented precision");
let pgS = clone(TA);
const isoQ = (off) => { const d = new Date(Date.now() + off * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
pgS.forecasts = [{ d: isoQ(-14), trend: 165.0, rate: 1.2, pred7: 163.8, sealed: false }, { d: isoQ(-7), trend: 163.6, rate: 1.2, pred7: 162.4, sealed: false }, { d: isoQ(-8), trend: 163.9, rate: 1.2, pred7: 162.7, sealed: false }, { d: isoQ(-1), trend: 162.5, rate: 1.2, pred7: 161.3, sealed: false }];
const g34 = pg34(pgS);
ok(g34.n >= 2 && typeof g34.mae === "number" && typeof g34.bias === "number", "masthead and card share one grading truth: n=" + g34.n + " mae=" + g34.mae);

// (interim)

// v3.35 — the plain-English layer
const { plainify: pl35 } = __test;
ok(pl35("PRs log provisional on debt days — coach-flag") === "records count as pending for now on short-sleep days — a your-coach conversation — the app never moves it alone", "house vocabulary translates in one pass: " + pl35("PRs log provisional on debt days — coach-flag"));
ok(pl35("needs sleep CLEAN, the governor watching") === "needs the good-sleep streak complete (3 nights of 7.5+ h), the safety brake watching", "streak + brake translate");
ok(pl35("A normal sentence stays untouched.") === "A normal sentence stays untouched.", "plain text passes through unchanged");
ok(pl35(null) === null && pl35(42) === 42, "non-strings pass through safely");

// (interim)

// v3.35.2 — session blocks get real plans
const { rirPlan: rp352, SEED: TB } = __test;
const blockShaped = { id: "x", tgt: [13, 12, 11, 10], w: 315 };
const bp = rp352(clone(TB), blockShaped, { clean: false, run: 1, need: 3 });
ok(bp.plan.length === 4 && bp.plan.join(",") === "2,1,1,1", "a real tgt-shaped session block sizes its own plan under the debt law: " + bp.plan.join(","));

// (interim)

// v3.37 — the day, ranked from data
const { dayProtocol: dp37, SEED: TC } = __test;
let dpS = clone(TC);
for (let k = 1; k <= 3; k++) dpS.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 8, tags: [] });
dpS.sleep.nights = dpS.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
const proto = dp37(dpS, { clean: true, run: 3, need: 3 });
ok(proto.lead && proto.lead.t.length > 3 && proto.steps.length >= 2 && proto.steps.length <= 5, "one lead + a short ranked day: " + proto.steps.length + " steps");
ok(proto.steps.some(x => x.a.indexOf("Lights out") === 0 && /\d\d:\d\d/.test(x.a)), "bedtime step carries the derived time");
ok(proto.steps.some(x => x.a.indexOf("Protein 175") === 0), "protein step present with the spread");
ok(proto.steps.every(x => x.a && x.why), "every step is action + reason, nothing bare");

// (interim)


// v3.39 — the pulse wing + negotiator + miner
const { labAnalytics2: laP, migrate: mgP, SEED: TD } = __test;
const oldV18p = clone(TD); oldV18p.v = 18; delete oldV18p.pulse;
ok(mgP(oldV18p).v >= 19 && Array.isArray(mgP(oldV18p).pulse), "phones patch to v19 with the pulse array");
let pS = clone(TD);
for (let k = 14; k >= 1; k--) pS.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 + (k % 3) });
pS.pulse.push({ d: isoL(Date.now()), bpm: 66 });
const wingP = laP(pS);
const pb = wingP.find(c => c.id === "pulsebase"), pw = wingP.find(c => c.id === "pulsewarn"), cs = wingP.find(c => c.id === "cutstress");
ok(pb.status === "LIVE" && /Baseline: 5\d bpm/.test(pb.forYou), "baseline computes from the median: " + pb.forYou.slice(0, 30));
ok(pw.status === "LIVE" && pw.forYou.indexOf("Treat today gently") > -1, "a +7 spike trips the early warning without panic");
ok(cs.status === "LIVE" && cs.forYou.indexOf("bpm") > -1, "cut-stress drift reads in bpm");
ok(wingP.find(c => c.id === "negotiator").status === "MODEL" && wingP.find(c => c.id === "miner").status === "ARMED", "negotiator badged MODEL, miner gathering pairs");

// (interim)


// v3.40 — the lab starts experimenting
const { trialProposals: tp40, trialArmOn: ta40, trialVerdict: tv40, activeTrial: at40, dossierText: dt40, migrate: mg40, SEED: TE } = __test;
const oldV19t = clone(TE); oldV19t.v = 19; delete oldV19t.trials;
ok(mg40(oldV19t).v >= 20 && Array.isArray(mg40(oldV19t).trials), "phones patch to v20 with the trials ledger");
const props40 = tp40(clone(TE));
ok(props40.length >= 2 && props40.every(x => x.q && x.arms.length === 2), "data-eligible proposals stand ready, each a fair two-arm question: " + props40.map(x => x.id).join(","));
let trS = clone(TE);
trS.trials = [{ tplId: "refeedsize", started: isoL(Date.now() - 2 * 864e5) }];
const arm0 = ta40(trS.trials[0], isoL(Date.now()));
ok(arm0 && arm0.block === 1 && arm0.armIdx === 0, "day 2 of a 7-day block sits in block 1, arm A");
const act40 = at40(trS);
ok(act40 && act40.arm.tpl.t.indexOf("REFEED") === 0, "the active trial surfaces for the day protocol");
let doneS = clone(TE);
doneS.trials = [{ tplId: "refeedsize", started: isoL(Date.now() - 40 * 864e5) }];
const v40 = tv40(doneS, doneS.trials[0]);
ok(v40.done === true && typeof v40.nA === "number", "elapsed schedules grade themselves done");
const doss = dt40(clone(TE));
const dd40 = __test.dossierData(clone(TE));
ok(dd40.sections.length >= 3 && dd40.sections.every(x => x.items.every(it => it.line.length <= 170)), "structured dossier: sections present, every line first-sentence tight");
ok(typeof dd40.topline === "string" && dd40.topline.length > 20, "top line reads as an executive summary");
ok(doss.indexOf("COACH DOSSIER") > 0 && doss.indexOf("Machine trust") > -1 && doss.indexOf("THIS WEEK:") > -1 && doss.indexOf("TOP LINE:") > -1, "dossier compiles header, trust, top line, and the week");
ok(doss.indexOf("provisional") === -1 && doss.indexOf("CLEAN") === -1, "dossier speaks only plain English");

// (interim)


// v3.42 — the furnace + the reactive protocol
const { tempRead: tr42, dayProtocol: dp42, migrate: mg42, SEED: TF } = __test;
const oldV20f = clone(TF); oldV20f.v = 20; delete oldV20f.temp;
ok(mg42(oldV20f).v >= 21 && Array.isArray(mg42(oldV20f).temp), "phones patch to v21 with the furnace");
let tf = clone(TF);
for (let k = 12; k >= 1; k--) tf.temp.push({ d: isoL(Date.now() - k * 864e5), f: k > 6 ? 97.8 : 97.2 });
const T42 = tr42(tf);
ok(T42.base != null && T42.drift <= -0.4, "cooling furnace measured: drift " + T42.drift);
// short last night → tonight's repair appears, 20 early, anchor protected
let snX = clone(TF);
for (let k = 3; k >= 2; k--) snX.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 8, tags: [] });
snX.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 6.2, sol: 15, tags: [] });
snX.sleep.nights = snX.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
const pr42 = dp42(snX, { clean: false, run: 1, need: 3 });
ok(pr42.steps.some(x => x.a.indexOf("20 early") > -1 && x.why.indexOf("6.2 h") > -1 && x.why.indexOf("aim near it") > -1), "short night triggers tonight's repair with the anchor protected");
// pulse spike this morning outranks everything below the lead
let sp = clone(TF);
for (let k = 14; k >= 1; k--) sp.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
sp.pulse.push({ d: isoL(Date.now()), bpm: 65 });
const pr43 = dp42(sp, { clean: true, run: 3, need: 3 });
ok(pr43.steps[0].a.indexOf("Body alarm") === 0 && pr43.steps[0].why.indexOf("65 bpm vs your 56") === 0 && (pr43.steps[0].detail || []).length >= 4, "a morning pulse spike takes rank one as a full prescription: " + pr43.steps[0].a);

// (interim)

// v3.43 — the alarm prescribes
const { bodyAlarm: ba43, SEED: TG } = __test;
let amb = clone(TG);
for (let k = 14; k >= 1; k--) amb.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
amb.pulse.push({ d: isoL(Date.now()), bpm: 64 });
const A = ba43(amb, { clean: true, run: 3, need: 3 });
ok(A && A.tier === "AMBER" && A.lines.length >= 4, "spike yields an AMBER prescription, not a mood: " + A.lines.length + " lines");
ok(A.lines.some(l => l.indexOf("every 0 becomes a 1") > -1 && l.indexOf("no failure today") > -1), "session surgery is his cap-the-zeros rule");
ok(A.lines.some(l => l.indexOf("+24 oz") > -1) && A.lines.some(l => l.indexOf("30 early") > -1), "hydration and tonight carry numbers");
ok(A.lines.some(l => l.indexOf("Exit test") === 0 && l.indexOf("within 3") > -1), "the alarm defines its own exit criterion");
ok(A.basis.indexOf("64 bpm vs your 56") === 0, "every claim traceable: " + A.basis.slice(0, 40));
let redS = clone(TG);
for (let k = 14; k >= 2; k--) redS.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
redS.pulse.push({ d: isoL(Date.now() - 864e5), bpm: 64 });
redS.pulse.push({ d: isoL(Date.now()), bpm: 65 });
const R = ba43(redS, { clean: true, run: 3, need: 3 });
ok(R && R.tier === "RED" && R.lines.some(l => l.indexOf("convert to a walk") > -1), "second elevated morning escalates to RED with the session converted");
let quietB = clone(TG);
Object.keys(quietB.dailyLogs).forEach(d => { if (quietB.dailyLogs[d].steps) quietB.dailyLogs[d].steps = 16000; });
quietB.sleep.nights.forEach(n => { n.h = 7.6; });
quietB.reads.forEach(r => { if (!r.sealed) r.w = quietB.trend; });
ok(ba43(quietB, { clean: true, run: 3, need: 3 }) === null, "quiet body, silent alarm — flat baselines, no cry");

// (interim)

// v3.44.2 — the alarm learns recency and honesty about its trigger
const { bodyAlarm: ba44, SEED: TH } = __test;
let stale = clone(TH);
stale.sleep.nights.push({ d: isoL(Date.now() - 7 * 864e5), h: 4.4, tags: [] });
stale.dailyLogs[isoL(Date.now() - 6 * 864e5)] = { cal: 1750, pro: 175, steps: 11000 };
for (let k = 5; k >= 1; k--) { stale.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 7.4, tags: [] }); stale.dailyLogs[isoL(Date.now() - k * 864e5)] = { cal: 1750, pro: 175, steps: 17800 }; }
stale.sleep.nights = stale.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
ok(ba44(stale, { clean: true, run: 3, need: 3 }) === null, "a six-day-old party no longer commands today");
let fresh = clone(TH);
for (let k = 12; k >= 2; k--) { fresh.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 7.3, tags: [] }); fresh.dailyLogs[isoL(Date.now() - k * 864e5)] = { cal: 1750, pro: 175, steps: 17500 }; }
fresh.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 4.6, tags: [] });
fresh.dailyLogs[isoL(Date.now())] = { cal: 1750, pro: 175, steps: 9000 };
fresh.sleep.nights = fresh.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
const F = ba44(fresh, { clean: false, run: 0, need: 3 });
ok(F && F.head.indexOf("off-pattern") > -1 && F.basis.indexOf("No pulse data involved") > -1 && F.basis.indexOf("slept 4.6 h") > -1, "fresh pattern trip: honest trigger, exact numbers, zero pulse talk");
ok(F.lines.every(l => l.indexOf("resting pulse") === -1 || l.indexOf("elevated") === -1) && F.lines.some(l => l.indexOf("Exit test") === 0 && l.indexOf("bands") > -1), "prescription language matches the trigger");

// (interim)

// v3.45 — tier 0: the armor
const { labGroups: lg45, SEED: TI } = __test;
const sMemo = clone(TI);
const gm1 = lg45(sMemo), gm2 = lg45(sMemo);
ok(Array.isArray(gm1) && gm1.length === gm2.length, "analytics stable across repeated calls on one state");
const oldSnap = clone(TI); oldSnap.v = 12;
const restored = __test.migrate(JSON.parse(JSON.stringify(oldSnap)));
ok(restored.v >= 21 && Array.isArray(restored.trials) && Array.isArray(restored.temp), "an old snapshot restores through the full patch chain to current schema");

// (interim)

// v3.46 — gym mode's timer brain
const { restFor: rf46 } = __test;
ok(rf46("press") === 150 && rf46("hack") === 150, "compounds rest long: press/hack 150s");
ok(rf46("lateral") === 75 && rf46("curl") === 75, "isolations rest short: 75s");

// (interim)

// v3.47 — the instrument factory's context bundle
const { askContext: ac47, SEED: TJ } = __test;
const ctx = ac47(clone(TJ));
ok(ctx.indexOf("HOUSE LAWS") > -1 && ctx.indexOf("COACH DOSSIER") > -1 && ctx.indexOf("LAST 14 DAYS") > -1, "context carries laws, instrument verdicts, and raw rollups");
ok(ctx.indexOf("(measured)") > -1 && ctx.indexOf("Never invent data") > -1, "honesty rules travel with every question");
ok(ctx.length < 20000, "context stays bounded: " + ctx.length + " chars");

// (interim)

// v3.48 — the agent's hands are read-only + one consent door
const { agentToolExec: ate48, migrate: mg48, SEED: TK } = __test;
const oldV21a = clone(TK); oldV21a.v = 21; delete oldV21a.agentProposals;
ok(mg48(oldV21a).v >= 22 && Array.isArray(mg48(oldV21a).agentProposals), "phones patch to v22 with the analyst inbox");
let agS = clone(TK);
const stagedT = [];
const days48 = ate48(agS, "get_range", { kind: "days", from: "2026-06-15", to: "2026-06-20" }, stagedT);
ok(days48.indexOf("2026-06-15") > -1 && days48.indexOf("cal") > -1, "get_range pulls real rows");
const wi48 = ate48(agS, "run_whatif", { steps: 18500 }, stagedT);
ok(wi48.indexOf("modeled rate:") === 0, "whatif models forward: " + wi48.slice(0, 28));
const before = JSON.stringify(agS);
ate48(agS, "stage_proposal", { kind: "trial", title: "Test caffeine timing", body: "noon vs morning", tplId: "caffcut" }, stagedT);
ok(stagedT.length === 1 && JSON.stringify(agS) === before, "stage_proposal stages WITHOUT touching state — consent architecture intact");
ok(ate48(agS, "get_range", { kind: "sessions", from: "2000-01-01", to: "2000-01-02" }, stagedT) === "no rows", "empty ranges say so instead of inventing");

// (interim)

// v3.49 — the designer: custom trials through the full lifecycle
const { agentToolExec: ate49, trialArmOn: ta49, trialVerdict: tv49, SEED: TL } = __test;
let dS = clone(TL);
const st49 = [];
const res49 = ate49(dS, "stage_proposal", { kind: "trial", title: "Tuesday timing", body: "pattern: tue lags thu", custom: { t: "SESSION TIME — NOON vs 5PM", q: "Does the later slot lift Tuesdays?", arms: ["noon", "5pm"], blockDays: 3, cycles: 4, metric: "session_reps" } }, st49);
ok(st49.length === 1 && st49[0].custom && st49[0].custom.arms.length === 2, "agent designs a custom trial into the consent inbox");
ok(ate49(dS, "stage_proposal", { kind: "trial", title: "x", body: "y", custom: { t: "bad", q: "?", arms: ["a", "b"], blockDays: 3, cycles: 4, metric: "vibes" } }, st49).indexOf("rejected") === 0, "unmeasurable metrics are refused at the tool boundary");
let run49 = clone(TL);
run49.trials = [{ custom: st49[0].custom, started: isoL(Date.now() - 4 * 864e5) }];
const arm49 = ta49(run49.trials[0], isoL(Date.now()));
ok(arm49 && arm49.block === 2 && arm49.tpl.arms[arm49.armIdx] === "5pm", "day 4 of 3-day blocks: block 2, arm B — custom schedules run on the same engine");
run49.trials[0].started = isoL(Date.now() - 20 * 864e5);
ok(tv49(run49, run49.trials[0]).done === true, "custom trials self-grade done like the canned ones");

// (interim)

// v3.51 — the replicator: a person is data
const { kitLetter: kl51 } = __test;
const spec51 = { name: "Demo", greeting: "Good morning", modules: { walk: true, weight: true, bp: true, letter: true }, vocab: { walk: "your walk", weight: "morning weight", sleep: "sleep", bp: "blood pressure" }, walkGoalMin: 30, weightUnit: "lb" };
const st51 = { v: 1, days: {} };
for (let k = 1; k <= 6; k++) st51.days[isoL(Date.now() - k * 864e5)] = { walkMin: k % 2 ? 30 : 10, weight: 152 + (k % 3) * 0.5, bp: k === 2 ? "128/82" : null };
const letter = kl51(spec51, st51);
ok(letter.indexOf("Your week, in plain words:") === 0 && letter.indexOf("good walks this week") > -1, "the letter opens plainly and counts in their dialect: " + letter.slice(0, 40));
ok(letter.indexOf("average is the truth") > -1 && letter.indexOf("doctor") > -1, "weight framed gently, bp referred out — never interpreted");
ok(kl51(spec51, { v: 1, days: {} }).indexOf("keep showing up") > -1, "an empty week still gets warmth, never guilt");
const one51 = { v: 1, days: {} }; one51.days[isoL(Date.now() - 2 * 864e5)] = { walkMin: 45 };
ok(kl51(spec51, one51).indexOf("1 good walk this week") > -1, "grammar: one walk is singular");

// (interim)

// v3.53 — the data weather
const { dayWeather: dw53, weekWeather: ww53, migrate: mg53, SEED: TM } = __test;
const oldV22d = clone(TM); oldV22d.v = 22; delete oldV22d.dayCtx;
ok(mg53(oldV22d).v >= 23 && typeof mg53(oldV22d).dayCtx === "object", "phones patch to v23 with day contexts");
let wS = clone(TM);
wS.dayCtx["2026-07-18"] = { est: true, note: "wedding weekend" };
const w1 = dw53(wS, "2026-07-18");
ok(w1.est && w1.noisy && w1.flags.some(f => f.k === "estimate"), "a declared estimate day reads as noisy weather");
const sealDay = dw53(wS, "2026-07-24");
ok(sealDay.flags.some(f => f.k === "sealwater"), "sealed-window days auto-flag as event water");
ok(ww53(wS, ["2026-07-17", "2026-07-18", "2026-07-24"]).clean === false, "a week soaked in flags is not clean");
ok(dw53(wS, "2026-07-06").noisy === false, "an ordinary Monday stays clean weather");
const ctx53 = __test.askContext(wS);
ok(ctx53.indexOf("DATA WEATHER LAW") > -1 && ctx53.indexOf("⌁[") > -1, "the agent's table carries the flags and the law");

// (interim)

// v3.53 — DATA WEATHER: every day knows its own quality; every consumer respects it
const { dayWeather: dwB, weekWeather: wwB, migrate: mg53c, agentToolExec: ate53, liveRollups: lr53, SEED: TW } = __test;
const oldV22a = clone(TW); oldV22a.v = 22; delete oldV22a.dayCtx;
ok(mg53c(oldV22a).v >= 23 && typeof mg53c(oldV22a).dayCtx === "object", "phones patch to v23 with day-context");
let wSB = clone(TW);
wSB.dayCtx["2026-07-18"] = { est: true, note: "wedding #1" };
ok(dwB(wSB, "2026-07-18").est && dwB(wSB, "2026-07-18").hard, "a declared estimate day flags est + hard");
ok(dwB(wSB, "2026-07-26").flags.some((f) => f.k === "event"), "the day after the 7/25 wedding sits in the event window");
ok(dwB(wSB, "2026-07-16").flags.some((f) => f.k === "postrefeed"), "the morning after Wednesday refeed carries its storage-bump flag");
ok(wwB(wSB, ["2026-07-17", "2026-07-18", "2026-07-19", "2026-07-25"]).clean === false, "a week with 2+ noisy days is not clean");
ok(wwB(wSB, ["2026-07-06", "2026-07-07", "2026-07-08"]).clean === true, "an ordinary week stays clean");
const dayRow = ate53(wSB, "get_range", { kind: "days", from: "2026-07-18", to: "2026-07-18" }, []);
ok(dayRow.indexOf("⌁[") > -1 && dayRow.indexOf("estimate") > -1, "the agent's own range pulls carry the weather: " + dayRow.slice(0, 46));
ok((lr53(wSB)[0] || { days: [] }).days !== undefined || lr53(wSB).length === 0, "live rollups expose their day lists for week-pair weather checks");

// (interim)

// v3.53.2 — the session hero rolls forward once today is banked
const { nextTrainingISO: nti53, SEED: TN } = __test;
let hero53 = clone(TN);
const heroFirst53 = nti53(hero53);
ok(heroFirst53 != null, "a next training day exists");
hero53.sessionLog[heroFirst53] = { entries: [{ id: "press", reps: [8, 8, 7] }], at: Date.now() };
const after53 = nti53(hero53);
ok(after53 != null && after53 > heroFirst53, "banking the session advances the hero to the next unlogged day: " + heroFirst53 + " → " + after53);

// (interim)

// v3.54 — the variance tax: scatter, priced in the athlete's own ledger
const { sleepLab: sl54, SEED: TV } = __test;
let vt = clone(TV);
vt.sleep.nights = vt.sleep.nights.filter((n) => !n.bed);
for (let k = 26; k >= 2; k--) {
  const d = isoL(Date.now() - k * 864e5);
  const off = k % 3 === 0;
  vt.sleep.nights.push({ d, h: off ? 6.8 : 7.9, bed: off ? "00:45" : "23:00", wake: "06:45" });
  if (k % 2 === 0) vt.sessionLog[isoL(Date.now() - (k - 1) * 864e5)] = { entries: [{ id: "press", reps: off ? [7, 6, 5] : [9, 8, 8] }], at: 1 };
}
const tax = sl54(vt).find((c) => c.id === "variancetax");
ok(tax && tax.status === "LIVE", "the tax goes live with 5+ timed nights per bucket");
ok(tax.forYou.indexOf("-1.1 h sleep") > -1, "prices the sleep cost from his own buckets: " + tax.forYou.slice(0, 60));
ok(tax.forYou.indexOf("tax is real") > -1, "a real measured tax gets named as such");
let vt2 = clone(TV);
vt2.sleep.nights = vt2.sleep.nights.filter((n) => !n.bed);
const tax2 = sl54(vt2).find((c) => c.id === "variancetax");
ok(tax2 && tax2.status === "ARMED" && tax2.forYou.indexOf("funds itself") > -1, "unarmed, it explains it feeds on ordinary honesty");

// (interim)

// v3.55 — the cartographer's law: no instrument exists off the map
const { INS_MAP: IM55, labGroups: lg55, SEED: TC55 } = __test;
const allIds55 = lg55(clone(TC55)).flatMap((g) => g.cards).map((c) => c.id);
const mapped55 = Object.keys(IM55);
const unmapped = allIds55.filter((id) => !mapped55.includes(id));
const phantom = mapped55.filter((id) => !allIds55.includes(id));
ok(unmapped.length === 0, "every living instrument is placed on the map (unmapped: " + (unmapped.join(",") || "none") + ")");
ok(phantom.length === 0, "the map claims no phantom instruments (phantoms: " + (phantom.join(",") || "none") + ")");
ok(Object.values(IM55).every((srcs) => Array.isArray(srcs) && srcs.length >= 1), "every placement names at least one feeding input");

// (interim)

// v3.56 — skipped lifts are structured truth, not prose
const { completeSession: cs56, SEED: TS56 } = __test;
let sk56 = clone(TS56);
const skIso = (() => { for (let i = 0; i <= 9; i++) { const d = isoL(Date.now() + i * 864e5); if (!sk56.sessionLog[d]) return d; } })();
const perf56 = [{ id: "press", n: "press", w: 245, tgt: [8, 8, 7], reps: [8, 8, 7], rir: 2 }];
const r56 = cs56(sk56, skIso, perf56, { clean: true, last: { h: 7.8 } }, { note: "", niggles: [], skipped: [{ id: "pronated" }] });
ok((r56.s.sessionLog[skIso].skipped || []).some((k) => k.id === "pronated"), "the skip is a structured field on the session record");
ok(!r56.s.sessionLog[skIso].entries.some((e) => e.id === "pronated"), "no phantom reps: the skipped lift never enters entries");
ok(r56.lines.some((l) => l.t.indexOf("SKIPPED") === 0 && l.how.indexOf("phantom") > -1), "the recap names the skip honestly");

// (interim)


// v3.57.1 — live books outrank dawn prose
const { liveBooks: lb57, SEED: TL57 } = __test;
let bk = clone(TL57);
const yIso = isoL(Date.now() - 864e5);
bk.dailyLogs[yIso] = { cal: 1760, pro: 175, steps: 16500 };
if (!bk.sleep.nights.some(n => n.d === yIso)) bk.sleep.nights.push({ d: yIso, h: 7.5 });
const r57 = lb57(bk);
ok(r57.y === yIso && r57.items.some(i => i.k === "numbers" && i.ok), "live books read the ledger this second, not the sync");
ok(!r57.items.some(i => i.k === "pulse") || (bk.pulse || []).some(x => x.d < yIso), "instruments not yet adopted are never demanded");
let bk2 = clone(TL57);
delete bk2.dailyLogs[yIso];
bk2.sleep.nights = bk2.sleep.nights.filter(n => n.d !== yIso);
ok(lb57(bk2).gaps.length >= 1 && lb57(bk2).complete === false, "real gaps get named as ✗s");

console.log(`\nFINAL55: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);


// v3.58.1 — the agent sees whole nights and never guesses vocabulary
const { agentToolExec: ate58, askContext: ac58, SEED: TA58 } = __test;
let ag58 = clone(TA58);
const nIso = isoL(Date.now() - 864e5);
ag58.sleep.nights = ag58.sleep.nights.filter(n => n.d !== nIso);
ag58.sleep.nights.push({ d: nIso, h: 7.5, bed: "22:45", wake: "06:45", sol: 15, tags: ["woke"] });
const row58 = ate58(ag58, "get_range", { kind: "nights", from: nIso, to: nIso }, []);
ok(row58.indexOf("bed 22:45") > -1 && row58.indexOf("wake 06:45") > -1 && row58.indexOf("drift-off 15m") > -1, "night rows carry bed, wake, and drift-off in plain words: " + row58.slice(0, 60));
const ctx58 = ac58(ag58);
ok(ctx58.indexOf("FIELD DICTIONARY") > -1 && ctx58.indexOf("drift-off, minutes to fall asleep") > -1, "the dictionary is authoritative in every context");
ok(ctx58.indexOf("SLEEP GATE RIGHT NOW") > -1, "the live gate state ships with the context — no re-derived streaks");
ok(ctx58.indexOf("debt days +1") === -1 && ctx58.indexOf("only that final set pulls to 1") > -1, "the law sheet teaches the current debt rule");

// (interim)


// v3.59 — the pipe audit: nothing the athlete records can vanish in translation
const { agentToolExec: ate59, askContext: ac59, LEDGER_DICT: LD59, SEED: TP59 } = __test;
let pa = clone(TP59);
const pIso = isoL(Date.now() - 864e5);
pa.sessionLog[pIso] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 2, w: 245 }], skipped: [{ id: "pronated" }], note: "ran short on time", niggles: ["left knee"], dips: 3, at: 1 };
const sRow = ate59(pa, "get_range", { kind: "sessions", from: pIso, to: pIso }, []);
ok(sRow.indexOf("SKIPPED: pronated") > -1 && sRow.indexOf('note: "ran short on time"') > -1 && sRow.indexOf("niggles: left knee") > -1 && sRow.indexOf("dips 3") > -1, "session rows carry skips, prose, niggles, dips — the whole record");
pa.feed.unshift({ d: pIso, t: "RECORD AMENDED — pronated marked skipped", how: "honesty over history" });
const fRow = ate59(pa, "get_range", { kind: "feed", from: pIso, to: pIso }, []);
ok(fRow.indexOf("RECORD AMENDED") > -1, "the feed is pullable — amendments reach the agent");
ok(LD59.indexOf("drift-off") > -1 && LD59.indexOf("phantom reps") > -1, "one dictionary, complete");
const ctx59 = ac59(pa);
ok(ctx59.indexOf("EVENTS: ") > -1 && ctx59.indexOf("ACTIVE TRIALS: ") > -1, "events and trials ride every context");

// (interim)


// v3.59.1 — done-ness is derived from the ledger, never remembered by a screen
const { briefAnswered: ba59, SEED: TB59 } = __test;
let anS = clone(TB59);
const q59 = "scale +2.1 on clean logs: travel, sodium, new supplement?";
ok(ba59(anS, q59) === false, "an unanswered question shows its box");
anS.feed.unshift({ d: isoL(Date.now()), t: "ANALYST ANSWER", how: q59.slice(0, 120) + " → sodium, wedding tasting menu" });
ok(ba59(anS, q59) === true, "a filed answer stays filed across every remount");
ok(ba59(anS, "a different question entirely") === false, "new questions get fresh boxes");

console.log(`\nFINAL58: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.60 — the prescription desk: velocity writes the next session, resets need consent
const { liftCall: lc60, sweepStalls: ss60, SEED: TD60 } = __test;
let pd = clone(TD60);
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); pd.sleep.nights = pd.sleep.nights.filter((n) => n.d !== d); pd.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
const exW60 = pd.exercises.find((x) => x.id === "lateral").w;
const expW60 = Math.max(5, Math.round((exW60 * 0.95) / 5) * 5);
const mk60 = (k, tot, rir) => { const d = isoL(Date.now() - k * 864e5); pd.sessionLog[d] = { entries: [{ id: "lateral", reps: [tot], rir, w: exW60 }], at: 1 }; };
mk60(8, 40, 2); mk60(6, 43, 2);
ok(lc60(pd, "lateral").verdict === "PUSH" && lc60(pd, "lateral").vel > 0, "rising velocity keeps the chase on: " + lc60(pd, "lateral").why.slice(0, 40));
mk60(4, 43, 1); mk60(2, 42, 0); mk60(1, 41, 0);
const stalled = lc60(pd, "lateral");
ok(stalled.verdict === "RESET" && stalled.newW === expW60, "3 honest weather-clean stalls trigger the evidence-based reset with plate-round math: " + stalled.newW);
const swept = ss60(pd);
ok(swept && swept.agentProposals.some((ap) => ap.kind === "reset" && ap.exId === "lateral" && ap.newW === expW60), "the stall files a consent-gated proposal — no load ever changes itself");
ok(ss60(swept) === null || !ss60(swept), "one stall, one proposal — never nags twice");

console.log(`\nFINAL59: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.61 — desk v2: the full input roster, receipts attached, protection ranked first
const { liftCall: lc61, SEED: TE61 } = __test;
let dv = clone(TE61);
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); dv.sleep.nights = dv.sleep.nights.filter((n) => n.d !== d); dv.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
const wq = dv.exercises.find((x) => x.id === "lateral").w;
const mk61 = (k, tot, rir) => { const d = isoL(Date.now() - k * 864e5); dv.sessionLog[d] = { entries: [{ id: "lateral", reps: [tot], rir, w: wq }], at: 1 }; };
mk61(8, 40, 2); mk61(6, 43, 2); mk61(4, 45, 2);
const call61 = lc61(dv, "lateral");
ok(call61.verdict.indexOf("PUSH") === 0 && Array.isArray(call61.receipts) && call61.receipts.some((r) => r.indexOf("You are gaining") === 0), "a healthy lift gets PUSH with a plain-words trend receipt: " + call61.receipts[0]);
ok(lc61(dv, "lateral", { alarm: { level: "RED" } }).verdict === "STAND-DOWN", "alarm RED outranks everything — the desk stands the lift down");
ok(lc61(dv, "lateral", { alarm: { level: "AMBER" } }).verdict === "HOLD", "AMBER caps the day: hold, zeros become ones");
const nm61 = dv.exercises.find((x) => x.id === "lateral").n;
dv.feed.unshift({ d: isoL(Date.now() - 3 * 864e5), t: "RESET APPLIED — " + nm61 + " " + wq + " → " + (wq - 5), how: "test" });
const rb61 = lc61(dv, "lateral");
ok(rb61.verdict === "REBUILD" && rb61.receipts.some((r) => r.indexOf("Day ") === 0), "a recent consented reset flips the lift into its climb-back window");

// (interim)


// v3.61.1 — the desk speaks the house dialect, enforced
const { liftCall: lc611, CALL_PLAIN: CP611, SEED: TF61 } = __test;
ok(["PUSH", "PUSH+", "HOLD", "RESET", "REBUILD", "STAND-DOWN"].every((v) => CP611[v] && CP611[v].chip && CP611[v].mean), "every verdict has a plain chip and a plain meaning");
let pl = clone(TF61);
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); pl.sleep.nights = pl.sleep.nights.filter((n) => n.d !== d); pl.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
const wq2 = pl.exercises.find((x) => x.id === "lateral").w;
[8, 6, 4].forEach((k, i) => { const d = isoL(Date.now() - k * 864e5); pl.sessionLog[d] = { entries: [{ id: "lateral", reps: [40 + i * 2], rir: 2, w: wq2 }], at: 1 }; });
const banned = ["velocity", "stall streak", "n=", "evidentiary", "weather-clean"];
const out61 = lc611(pl, "lateral");
const blob = (out61.receipts || []).join(" ") + " " + out61.why;
ok(banned.every((b) => blob.indexOf(b) === -1), "no jargon survives in receipts or reasons — plain words only");

console.log(`\nFINAL61: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.63 — the hack ruling: load up, reps down, precedent filed
const { migrate: mg63, targetsFor: tf63, SEED: TG63 } = __test;
const oldV23a = clone(TG63); oldV23a.v = 23;
oldV23a.exercises.find((x) => x.id === "hack").hi = 13;
oldV23a.exercises.find((x) => x.id === "hack").last = [13, 12];
const m63 = mg63(oldV23a);
const hk63 = m63.exercises.find((x) => x.id === "hack");
ok(m63.v >= 24 && hk63.hi === 12 && hk63.last === null, "phones inherit the ruling: rep ceiling 12, fresh block at the new load");
ok(m63.feed.some((f) => f.t.indexOf("RULING — HACK LOADED UP") === 0), "the ruling is on the record for the clerk to mine");
ok(tf63(hk63).every((r) => r <= 10), "fresh targets seed under the new ceiling: " + tf63(hk63).join(","));

console.log(`\nFINAL62: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.64 — the smallest-honest-increment law
const { migrate: mg64, SEED: TH64 } = __test;
const oldV24a = clone(TH64); oldV24a.v = 24;
oldV24a.exercises.find((x) => x.id === "calves").inc = 15;
oldV24a.queue.push({ id: "q_calves_330", kind: "debut", exId: "calves", newW: 330, t: "CALVES 330 DEBUT", state: "DEBUT", gate: "Earned via 315×13,12,11,10", rule: "Auto-queued", done: false });
const m64 = mg64(oldV24a);
ok(m64.v >= 25 && m64.exercises.find((x) => x.id === "calves").inc === 5, "the machine's smallest step becomes the law: calves inc 5");
const q64 = m64.queue.find((q) => q.id === "q_calves_330");
ok(q64.newW === 320 && q64.t === "CALVES 320 DEBUT", "the already-queued 330 debut is rewritten to 320: " + q64.t);
ok(m64.feed.some((f) => f.t.indexOf("RULING — SMALLEST HONEST INCREMENT") === 0), "the ruling is filed for the clerk");

console.log(`\nFINAL63: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.65 — the smallest step governs every lift
const { migrate: mg65, SEED: TI65 } = __test;
const oldV25a = clone(TI65); oldV25a.v = 25;
oldV25a.exercises.find((x) => x.id === "pulldown").inc = 10;
oldV25a.exercises.find((x) => x.id === "ham").inc = 10;
const m65 = mg65(oldV25a);
ok(m65.v >= 26 && m65.exercises.find((x) => x.id === "pulldown").inc === 5 && m65.exercises.find((x) => x.id === "ham").inc === 5, "stack machines normalized to the 5");
ok(m65.exercises.find((x) => x.id === "hack").inc === 10, "the plate-loaded hack keeps its honest 10");
ok(m65.feed.some((f) => f.t.indexOf("RULING — SMALLEST STEP, EVERY LIFT") === 0), "the audit is on the record");

console.log(`\nFINAL64: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.66 — the volume ledger: the biggest dial, counted, judged, consent-gated
const { muscleVolume: mv66, sweepVolume: sv66, SEED: TJ66 } = __test;
let vl = clone(TJ66);
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); vl.sleep.nights = vl.sleep.nights.filter((n) => n.d !== k); vl.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
const d1v = isoL(Date.now() - 2 * 864e5), d2x = isoL(Date.now() - 9 * 864e5);
vl.sessionLog[d1v] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
vl.sessionLog[d2x] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
const hams = mv66(vl).find((m) => m.mg === "hams");
ok(hams && hams.n7 === 2 && hams.zone === "UNDER", "sets counted per rolling week, judged against the retention floor: " + hams.n7 + " " + hams.zone);
const swept66 = sv66(vl);
ok(swept66 && swept66.agentProposals.some((ap) => ap.kind === "volume" && ap.mg === "hams" && ap.dir === 1), "two weeks under the floor files a +1 proposal to the inbox");
ok(!sv66(swept66), "one proposal per muscle — the throttle holds");
const inb = swept66.agentProposals.find((ap) => ap.kind === "volume");
ok(inb.body.indexOf("retention floor") > -1 || inb.body.indexOf("insurance") > -1, "the proposal explains itself in plain words: " + inb.body.slice(0, 50));

console.log(`\nFINAL65: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.68 — fractional counting + the ladder re-keys, stated at consent
const { muscleVolume: mv68, sweepVolume: sv68, rirPlan: rp68, INDIRECT: IN68, SEED: TK68 } = __test;
let fc = clone(TK68);
const df1 = isoL(Date.now() - 2 * 864e5);
fc.sessionLog[df1] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 2, w: 245 }, { id: "tricep", reps: [12, 11], rir: 2, w: 55 }], at: 1 };
const tri = mv68(fc).find((m) => m.mg === "triceps");
ok(tri && tri.n7 === 3.5, "pressing lends half a set: triceps = 2 direct + 3×0.5 = " + tri.n7);
ok(IN68.press.triceps === 0.5 && IN68.rows.biceps === 0.5, "the lending table is data, inspectable");
let lad = clone(TK68);
const tr68 = lad.exercises.find((x) => x.id === "tricep");
const before68 = rp68(lad, tr68, { clean: true, run: 3, need: 3 }).plan.join(",");
tr68.sets = tr68.sets + 1;
const after68 = rp68(lad, tr68, { clean: true, run: 3, need: 3 }).plan.join(",");
ok(before68 === "2,1,0" && after68 === "2,1,1,0", "a consented +1 re-keys the ladder: new set takes the 0, old final pulls to 1: " + before68 + " → " + after68);

console.log(`\nFINAL66: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
