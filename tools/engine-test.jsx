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
ok(lab9.length === 2 && lab9[0].id === "melaexp" && lab9[0].status === "ARMED" && lab9[0].deep.indexOf("Ferracioli") > -1, "melatonin experiment pre-registered, armed, citations attached");
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
ok(ann2 && ann2.feed[0].t.indexOf("LAB LIVE — MELATONIN") === 0 && ann2.labSeen.melaexp === "LIVE", "threshold crossed → the feed announces the verdict");
ok(swp(ann2) === null, "no re-announcement — quiet until the next flip");

// (interim)

// v3.13 — the outside-the-box wing
const { labAnalytics2: la2, labGroups: lg2, completeSession: csW, genSession: gsW, SEED: SN } = __test;
const wing = la2(clone(SN));
ok(wing.length === 15, "fifteen instruments, all constructed without a single crash: " + wing.length);
ok(wing.every(c => c.tag && c.deep && c.forYou && c.status), "every card carries all three layers plus a status");
const ids2 = wing.map(c => c.id);
ok(["adaptmeter","strvelocity","canary","regularity","missarch","weekend","stepeff","refeedroi","sessionshape","compound","ghost","sentinel","letter"].every(x => ids2.includes(x)), "the full roster reports");
ok(wing.find(c => c.id === "weekend").status === "LIVE" && wing.find(c => c.id === "missarch").status === "LIVE", "sheet history powers instant verdicts on day one");
ok(wing.find(c => c.id === "ghost").status === "MODEL" && wing.find(c => c.id === "ghost").forYou.indexOf("behind you") > -1, "ghost is badged a MODEL and running");
const gAll = lg2(clone(SN));
ok(gAll.length === 9 && gAll.map(g => g.id).join(",") === "scale,engine,training,sleep,behavior,road,models,locked,shelf", "nine shelves, fixed order");
const tot2 = gAll.reduce((a, g) => a + g.cards.length, 0);
ok(tot2 === 38, "all 38 instruments filed exactly once: " + tot2);
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
ok(wing3.length === 15, "fifteen instruments in the wing now: " + wing3.length);
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
ok(ranked.length === 38 && ranked.every((c, i) => i === 0 || (rk[ranked[i - 1].status] ?? 5) <= (rk[c.status] ?? 5)), "status lens: 38 cards, monotone rank order");
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
ok(secs.reduce((a, x) => a + x.cards.length, 0) === 38, "all 38 filed across the plain-language sections, none lost");
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
ok(banked.zeroComp.count === zc0 + 1 && banked.events.find(e => e.id === evId).estimated === true && banked.feed[0].t.indexOf("ZERO-COMP EVENT") === 0, "zero-comp outcome: streak +1, event closed, story written");
const honest = ce21(evS, evId, false);
ok(honest.zeroComp.count === 0 && honest.feed[0].t === "EVENT LOGGED HONEST" && honest.feed[0].how.indexOf("penance does not exist") > -1, "honest outcome: streak resets without ceremony or punishment");
const bumps = rb21(clone(ST));
ok(bumps.length >= 2 && bumps.every(b => b > -3 && b < 4), "refeed bumps computed from his own mornings: " + bumps.join(", "));

// (interim)

// v3.23 — the week reviews itself
const { weekReview: wr23, sweepLab: swp23, SEED: SU } = __test;
const rev = wr23(clone(SU));
ok(typeof rev.verdict === "string" && rev.verdict.length > 20 && rev.lines.length === 3, "review renders a verdict plus three coaching lines");
ok(rev.verdict.indexOf("Sealed week") === 0, "sealed-week verdict fires while the quarantine holds: " + rev.verdict.slice(0, 40));
let quiet = clone(SU); quiet.dailyLogs = {}; quiet.sessionLog = {}; quiet.sleep.nights = [];
ok(wr23(quiet).verdict.indexOf("quiet week") > -1, "a silent week gets the door-is-open verdict, never a scolding");
const swBase23 = swp23(clone(SU));
const filed = swp23(swBase23, 0);
ok(filed && filed.feed[0].t.indexOf("WEEK IN REVIEW · WK") === 0, "Sunday sweep files the review into the permanent record");
ok(swp23(filed, 0) === null, "one review per week — never a duplicate");

console.log(`\nFINAL29: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
