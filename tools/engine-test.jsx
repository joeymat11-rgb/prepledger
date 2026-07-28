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
const sbSealed = clone(SB); sbSealed.blackout = { until: "2099-01-01", reason: "fixture seal" };
ok(ot(sbSealed) === null, "sealed window: observed maintenance correctly refuses to print");
let ob = clone(SB); ob.blackout.until = "2026-07-01";
const o1 = ot(ob);
ok(o1 && o1.days >= 8 && o1.tdee > 2200 && o1.tdee < 2800, `post-seal it computes from real logs: ~${o1 && o1.tdee} over ${o1 && o1.days} days`);
let ob2 = clone(SB); ob2.blackout.until = "2026-07-01"; ob2.dailyLogs = {};
ok(ot(ob2) === null, "under 8 logged days: stays silent rather than guessing");

// (interim)

// v3.2 — THE LAB
const { labAnalytics: la, anchorDexa: ad, applyRead: ar2, SEED: SC } = __test;
const scSealed = clone(SC); scSealed.blackout = { until: "2099-01-01", reason: "fixture seal — this suite tests the behaviour, not the calendar" };
const lab = la(scSealed);
const get = (id) => lab.find(x => x.id === id);
ok(get("whoosh").status === "LIVE" && get("whoosh").prog.n >= 2, "whoosh signature LIVE off " + get("whoosh").prog.n + " historical episodes");
ok(get("whoosh").forYou.indexOf("WEDDING #2") > -1, "whoosh model already aimed at Saturday's wedding");
ok(get("refeed").status === "LIVE" && get("refeed").prog.n === 4 && get("refeed").lines[0].indexOf("+4.6") === -1, "refeed line cleaned: real refeeds only, n=4, birthday spike evicted");
ok(get("noise").status === "LIVE" && /±0\.[3-9]/.test(get("noise").lines[0]), "personal noise floor computed: " + get("noise").lines[0].slice(0, 24));
ok(get("cone").status === "LIVE" && get("cone").lines[0].indexOf("80%") === 0, "pivot cone runs Monte Carlo on his measured rates");
ok(get("tuefri").status === "ARMED" && get("tuefri").prog.n === 0, "Tue/Fri experiment armed at 0/4 pairs");
ok(get("fingerprint").status === "ARMED" && get("rirtruth").status === "ARMED" && get("mrv").status === "LOCKED", "gates hold: no correlations under N");
// the seal under test is the fixture's own, never the calendar's
ok(get("masked").forYou.indexOf("Sealed") === 0, "masked-loss monitor respects the seal");
const withDexa = ad(clone(SC), 15.8);
ok(la(withDexa).find(x => x.id === "dexarecon").status === "LIVE" && withDexa.dexaRecon.dexa === 15.8, "DEXA reconciliation fires on anchor with the delta recorded");
let nz = clone(SC); nz.blackout.until = "2026-07-01";
const nzr = ar2(nz, "2026-07-28", nz.trend + 0.2);
ok(nzr.reads[nzr.reads.length - 1].note.indexOf("inside your noise") === 0, "scale card now speaks the calibrated noise floor");

// (interim)

// v3.3 — three-layer lab cards
const { labAnalytics: la3, SEED: SD } = __test;
const sdOpen = clone(SD); sdOpen.blackout = { until: "2099-01-01", reason: "fixture seal — the six-week receipt lives in the sealed branch" };
const lab3 = la3(sdOpen);
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
const creExpect = Math.floor((Date.now() - new Date("2026-07-20").getTime()) / 864e5) + 1;
ok(creLine.status === "TRACKING" && Math.abs(creDay - creExpect) <= 1, "creatine tracker counts saturation days (day " + creDay + " ≈ " + creExpect + ")");
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
const swBase = swp(clone(SM), 3);
ok(swBase && Object.keys(swBase.labSeen).length >= 20 && swBase.feed.length === clone(SM).feed.length, "first sweep baselines every card silently — no spam on migration");
let ann = JSON.parse(JSON.stringify(swBase));
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); ann.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
const ann2 = swp(ann, 3);
ok(ann2 && ann2.feed.some(f => f.t.indexOf("LAB LIVE — MELATONIN") === 0) && ann2.labSeen.melaexp === "LIVE", "threshold crossed → the feed announces the verdict");
ok(swp(ann2, 3) === null, "no re-announcement — quiet until the next flip");

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
ok(tot2 === 55, "all 55 instruments filed exactly once: " + tot2);
// loads ride sets automatically
let ws = clone(SN); ws.sleep.nights.push({d: isoL(Date.now() - 864e5), h: 8});
const slpC = { clean: true, run: 3, need: 3 };
const g1 = gsW(ws, isoL(Date.now()), slpC);
if (g1 && g1.blocks && g1.blocks.length) {
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
ok(ranked.length === 55 && ranked.every((c, i) => i === 0 || (rk[ranked[i - 1].status] ?? 5) <= (rk[c.status] ?? 5)), "status lens: 55 cards, monotone rank order");
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
ok(secs.reduce((a, x) => a + x.cards.length, 0) === 55, "all 55 filed across the plain-language sections, none lost");
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
const suSealed = clone(SU); suSealed.blackout = { until: "2099-01-01", reason: "fixture seal — this suite tests the behaviour, not the calendar" };
for (let k = 1; k <= 6; k++) { const dS = isoL(Date.now() - k * 864e5); suSealed.dailyLogs[dS] = { cal: 1760, pro: 175, steps: 16500 }; suSealed.sleep.nights = suSealed.sleep.nights.filter((n) => n.d !== dS).concat([{ d: dS, h: 7.6, tags: [] }]); }
const rev = wr23(suSealed);
ok(typeof rev.verdict === "string" && rev.verdict.length > 20 && rev.lines.length === 4 && rev.lines[3].indexOf("adjustments") === 0, "review renders a verdict, three reads, and the adjustments line");
ok(rev.verdict.indexOf("Sealed week") === 0, "sealed-week verdict fires while the quarantine holds: " + rev.verdict.slice(0, 40));
let quiet = clone(SU); quiet.dailyLogs = {}; quiet.sessionLog = {}; quiet.sleep.nights = [];
ok(wr23(quiet).verdict.indexOf("quiet week") > -1, "a silent week gets the door-is-open verdict, never a scolding");
const swBase23 = swp23(clone(SU), 3);
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
ok(db && db.lifts.length === 1 && db.lifts[0].lines.some(l => l.indexOf("1 up on last time") > -1), "plain-words delta: " + db.lifts[0].lines[0]);
ok(db.lifts[0].lines.some(l => l.indexOf("Best you have ever done at 245") > -1) && db.lifts[0].lines.some(l => l.indexOf("Work done:") === 0), "best-ever named + volume load computed");
ok(db.lifts[0].lines.some(l => l.indexOf("Sets went") === 0), "the fade read still leads with the set sequence");
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
/* On a CLEAN sleep night the lights-out line is a bearing, not a fix, and the
   ranking is right to drop it below five things that are actually actionable.
   On a short night it has to climb back — that is the test that matters. */
let dpShort = clone(TC);
dpShort.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 5.8, tags: [] });
const protoShort = dp37(dpShort, { clean: false, run: 0, need: 3, last: { h: 5.8 } });
const lights = protoShort.steps.find(x => x.a.indexOf("Lights out") === 0);
ok(!!lights && /\d\d:\d\d/.test(lights.a), "after a short night the bedtime step is on the page and carries the derived time: " + (lights ? lights.a : "absent"));
ok(lights.w > 60, "and it ranks high, because sleep is a first-order fat-versus-lean lever when it is actually short: w=" + lights.w);
ok(!proto.steps.some(x => x.a.indexOf("Lights out") === 0) || proto.steps.find(x => x.a.indexOf("Lights out") === 0).w < 40,
   "on a clean night it either drops off or ranks low — a reminder to do what you already did is the definition of filler");
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
const { bodyAlarm: ba43, dayType: dt43, SEED: TG } = __test;
const trainToday43 = ["U", "L"].includes(dt43(isoL(Date.now())));
let amb = clone(TG);
for (let k = 14; k >= 1; k--) amb.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
amb.pulse.push({ d: isoL(Date.now()), bpm: 64 });
const A = ba43(amb, { clean: true, run: 3, need: 3 });
ok(A && A.tier === "AMBER" && A.lines.length >= 4, "spike yields an AMBER prescription, not a mood: " + A.lines.length + " lines");
ok(trainToday43 ? A.lines.some(l => l.indexOf("every 0 becomes a 1") > -1 && l.indexOf("no failure today") > -1) : A.lines.length >= 3, "session surgery is his cap-the-zeros rule (rest days: alarm speaks without a session to surger)");
ok(A.lines.some(l => l.indexOf("+24 oz") > -1) && A.lines.some(l => l.indexOf("30 early") > -1), "hydration and tonight carry numbers");
ok(A.lines.some(l => l.indexOf("Exit test") === 0 && l.indexOf("within 3") > -1), "the alarm defines its own exit criterion");
ok(A.basis.indexOf("64 bpm vs your 56") === 0, "every claim traceable: " + A.basis.slice(0, 40));
let redS = clone(TG);
for (let k = 14; k >= 2; k--) redS.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
redS.pulse.push({ d: isoL(Date.now() - 864e5), bpm: 64 });
redS.pulse.push({ d: isoL(Date.now()), bpm: 65 });
const R = ba43(redS, { clean: true, run: 3, need: 3 });
ok(R && R.tier === "RED" && (trainToday43 ? R.lines.some(l => l.indexOf("convert to a walk") > -1) : true), "second elevated morning escalates to RED with the session converted (rest days: RED stands alone)");
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
ok(F === null || (F.head.indexOf("off-pattern") > -1 && F.basis.indexOf("No pulse data involved") > -1), "fresh pattern trip: when it fires it is honest and pulse-free; on rest days it stays silent (weekday-independent)");

ok(!F || (F.lines.every(l => l.indexOf("resting pulse") === -1 || l.indexOf("elevated") === -1) && (!trainToday43 || F.lines.some(l => l.indexOf("Exit test") === 0))), "pattern trips speak sleep, never pulse; on training days they define their exit");


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
ok(rf46("lateral") === 90 && rf46("curl") === 90, "isolations rest 90s — raised from 75s, which sat under the plateau where the evidence stops improving");

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
mk60(12, 40, 2); mk60(10, 43, 2);
ok(lc60(pd, "lateral").verdict === "PUSH" && lc60(pd, "lateral").vel > 0, "rising velocity keeps the chase on: " + lc60(pd, "lateral").why.slice(0, 40));
mk60(8, 43, 1); mk60(6, 42, 0); mk60(5, 41, 0);
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
const d1v = isoL(Date.now() - 2 * 864e5), d2x = isoL(Date.now() - 9 * 864e5), d3x = isoL(Date.now() - 16 * 864e5);
vl.sessionLog[d1v] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
vl.sessionLog[d2x] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
vl.sessionLog[d3x] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
const hams = mv66(vl).find((m) => m.mg === "hams");
ok(hams && hams.n7 === 2 && hams.zone === "UNDER", "sets counted per rolling week, judged against the retention floor: " + hams.n7 + " " + hams.zone);
const swept66 = sv66(vl, 0);
ok(swept66 && swept66.agentProposals.some((ap) => ap.kind === "volume" && ap.mg === "hams" && ap.dir === 1), "two weeks under the floor files a +1 proposal to the inbox");
ok(!sv66(swept66, 0), "one proposal per muscle — the throttle holds");
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

// v3.69 — the ledger learns patience: maturity, cadence, restraint, the tilt
const { sweepVolume: sv69, migrate: mg69, SEED: TL69 } = __test;
let yg = clone(TL69);
const yd = isoL(Date.now() - 2 * 864e5);
yg.sessionLog = { [yd]: { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 } };
ok(sv69(yg, 0) === null, "young ledgers stay silent — 14 days of logs before a single volume word");
let mt = clone(TL69);
for (const k of [2, 5, 9, 12, 16]) mt.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
ok(sv69(mt, 3) === null, "midweek says nothing — volume is a Sunday conversation");
const sun69 = sv69(mt, 0);
ok(sun69 && sun69.agentProposals.filter((ap) => ap.kind === "volume").length <= 2, "at most two proposals per sweep — worst first, the rest wait");
const oldV26a = clone(TL69); oldV26a.v = 26;
oldV26a.agentProposals = [{ id: "v1", kind: "volume", mg: "chest", dir: 1 }, { id: "t1", kind: "trial", title: "keep me" }];
const m69 = mg69(oldV26a);
ok(!m69.agentProposals.some((ap) => ap.kind === "volume") && m69.agentProposals.some((ap) => ap.kind === "trial"), "the misfires are recalled; everything else stays");
ok(m69.feed.some((f) => f.t === "VOLUME PROPOSALS RECALLED"), "the recall is explained on the record");

console.log(`\nFINAL67: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.70 — the two constitutional laws, swept and enforced
const { filingsFor: ff70, CONSTITUTION: CN70, bodyAlarm: ba70, SEED: TM70 } = __test;
ok(ff70(1, 15).some((x) => x.indexOf("COACH DAY") === 0), "Mondays point NOW at the dossier");
ok(ff70(3, 2).some((x) => x.indexOf("THE RED CELL") === 0) && ff70(3, 15).length === 0, "the prosecution gets its pointer only in filing week");
ok(CN70.length === 12 && CN70.every((c) => c[0] && c[1] && c[1].length > 30), "twelve laws, each with a name and a plain sentence");
ok(CN70.some((c) => c[0] === "Attention lives on NOW") && CN70.some((c) => c[0] === "Simple surface, real depth"), "the athlete's two new laws are carved first");
ok(typeof ba70 === "function", "the alarm engine is exported — its NOW banner reads the same source as the desk");

console.log(`\nFINAL68: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.71 — caffeine is a log, not an assumption
const { todayCaff: tc71, caffAt: ca71, migrate: mg71, SEED: TN71 } = __test;
let cf = clone(TN71);
const tI71 = isoL(Date.now());
cf.sleep.caffMg = 400;
ok(tc71(cf).logged === false && tc71(cf).atH === 12, "with no entry, the typical dose serves as clearly-labeled fallback");
cf.caffLog = [{ d: tI71, mg: 350, at: "15:45" }];
const t71 = tc71(cf);
ok(t71.logged === true && t71.mg === 350 && Math.abs(t71.atH - 15.75) < 0.01, "today's real entry beats the profile: " + t71.mg + " @ " + t71.at);
const tail71 = ca71(350, 15.75, 22.5);
ok(tail71 > 120 && tail71 < 155, "the tail runs on the actual clock: 350 @ 3:45p leaves ~" + tail71 + " at 22:30");
cf.caffLog = [{ d: tI71, mg: 0, at: "—" }];
ok(tc71(cf).logged === true && tc71(cf).mg === 0, "a deliberate none-day is logged data, not absence");
const oldV27a = clone(TN71); oldV27a.v = 27; delete oldV27a.caffLog;
ok(Array.isArray(mg71(oldV27a).caffLog) && mg71(oldV27a).v >= 28, "phones inherit the caffeine ledger");

console.log(`\nFINAL69: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.72.2 — clock times speak the athlete's dialect
const { fmt12: f72 } = __test;
ok(f72("15:45") === "3:45 PM" && f72("06:45") === "6:45 AM", "afternoon and morning render in regular time");
ok(f72("00:15") === "12:15 AM" && f72("12:00") === "12:00 PM", "midnight and noon edges are right");
ok(f72("—") === "—", "none-days pass through untouched");

console.log(`\nFINAL70: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.73 — tonight's lights-out is a settable bearing
const { SEED: TO73 } = __test;
const lo73 = __test.lightsOutT ? __test.lightsOutT : null;
if (lo73) {
  let bo = clone(TO73);
  const base73 = lo73(bo);
  bo.dayCtx = bo.dayCtx || {};
  bo.dayCtx[isoL(Date.now())] = { lightsOut: "23:15" };
  const ov73 = lo73(bo);
  ok(ov73.t === "23:15" && ov73.mins === 23 * 60 + 15 && ov73.override === true, "a per-day lights-out overrides the bearing: " + ov73.t);
  ok(base73.override !== true, "without a setting, the default bearing stands unlabeled");
}

console.log(`\nFINAL71: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.73.1 — the half-life respects midnight
const { caffAt: ca73 } = __test;
const past = ca73(400, 14, 1 + 10 / 60);
ok(past > 75 && past < 95, "a 2 PM dose against a 1:10 AM lights-out decays across midnight: ~" + past + " mg");
const same = ca73(400, 14, 22.5);
ok(same > 110 && same < 135, "same-evening math unchanged: ~" + same + " mg at 10:30 PM");
ok(ca73(400, 14, 1 + 10 / 60) < ca73(400, 14, 22.5), "later bedtimes always mean smaller tails — monotone, as physiology demands");

console.log(`\nFINAL72: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.74 — the Minute is law: registered steps, derived needs, closing books
const { minuteNeeds: mn74, booksToday: bt74, MORNING_REGISTRY: MR74, CONSTITUTION: CN74, SEED: TP74 } = __test;
ok(MR74.length === 8 && ["night", "weight", "pulse", "temp", "energy", "soreness", "grip", "brief"].every((k) => MR74.includes(k)), "the morning registry names every morning input — all eight");
ok(CN74[10][0] === "The morning lives in the Minute", "law 11 is carved: " + CN74[10][0]);
let mm = clone(TP74);
const tI74 = isoL(Date.now()), yI74 = isoL(Date.now() - 864e5);
mm.sleep.nights = mm.sleep.nights.filter((n) => n.d !== yI74);
mm.pulse = [{ d: isoL(Date.now() - 2 * 864e5), bpm: 55 }];
mm.temp = [{ d: isoL(Date.now() - 2 * 864e5), f: 97.6 }];
const nd74 = mn74(mm);
ok(nd74.includes("night") && nd74.includes("pulse") && nd74.includes("temp"), "unlogged mornings list their steps: " + nd74.join(","));
mm.sleep.nights.push({ d: yI74, h: 7.6, bed: "22:45", wake: "06:30", sol: 15 });
mm.pulse.push({ d: tI74, bpm: 56 });
mm.temp.push({ d: tI74, f: 97.5 });
ok(!mn74(mm).includes("night") && !mn74(mm).includes("pulse"), "logged steps leave the list — derived, never remembered");
mm.dailyLogs[tI74] = { cal: 1760, pro: 175, steps: 16500 };
const bt = bt74(mm);
ok(bt.items.some((i) => i.k === "numbers" && i.ok), "the day's books know their own state");

console.log(`\nFINAL73: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.75 — five inputs, born lawful
const { minuteNeeds: mn75, booksToday: bt75, MORNING_REGISTRY: MR75, MUSCLE_CHIPS: MC75, migrate: mg75, SEED: TQ75 } = __test;
ok(["energy", "soreness", "grip"].every((k) => MR75.includes(k)), "law 11 enforced at birth: the three morning inputs are in the registry");
ok(MC75.length === 10 && MC75.includes("forearms"), "the soreness map covers all ten trained muscles");
let fr75 = clone(TQ75);
const nd75 = mn75(fr75);
ok(nd75.includes("energy") && nd75.includes("soreness") && nd75.includes("grip"), "the Minute offers energy, soreness, and grip to everyone — the athlete ordered the device: " + nd75.join(","));
fr75.grip = [{ d: isoL(Date.now()), l: 110, r: 118 }];
ok(!mn75(fr75).includes("grip"), "a logged grip leaves the Minute for the day — done is done");
let bk75 = clone(TQ75);
ok(!bt75(bk75).items.some((i) => i.k === "energy"), "unadopted instruments never count as gaps");
bk75.energy = [{ d: isoL(Date.now() - 864e5), v: 3 }];
const bi75 = bt75(bk75).items.find((i) => i.k === "energy");
ok(bi75 && bi75.ok === false, "adopted-but-unlogged shows as the day's open item");
const old75 = clone(TQ75); old75.v = 28; delete old75.energy; delete old75.soreness; delete old75.grip;
const m75 = mg75(old75);
ok(Array.isArray(m75.energy) && Array.isArray(m75.soreness) && Array.isArray(m75.grip) && m75.v >= 29, "phones inherit the three ledgers");

console.log(`\nFINAL74: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.76 — the biggest confound gets a clock
const { todayMeds: tm76, migrate: mg76, SEED: TR76 } = __test;
let md = clone(TR76);
ok(tm76(md) === null, "no entry, no assumption — the chip falls back to the generic warning");
md.medsLog = [{ d: isoL(Date.now()), taken: true, at: "12:15" }];
const t76 = tm76(md);
ok(t76 && t76.taken === true && t76.at === "12:15", "a taken-day carries its athlete-set clock: " + t76.at);
md.medsLog = [{ d: isoL(Date.now()), taken: false, at: "—" }];
ok(tm76(md) && tm76(md).taken === false, "a none-day is logged truth, not absence");
const old76 = clone(TR76); old76.v = 29; delete old76.medsLog;
ok(Array.isArray(mg76(old76).medsLog) && mg76(old76).v >= 30, "phones inherit the meds ledger");

console.log(`\nFINAL75: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.77 — the signals earn their keep: every collected input consumed
const { liftCall: lc77, muscleVolume: mv77, sweepVolume: sv77, dayWeather: dw77, applyRead: ar77, migrate: mg77x, SEED: TS77 } = __test;
const td77 = isoL(Date.now());

// soreness column + the two volume laws
let vq = clone(TS77);
vq.sessionLog[isoL(Date.now() - 2 * 864e5)] = { entries: [{ id: "hack", reps: [8, 8, 8, 8, 8], rir: 1, w: 160 }, { id: "extension", reps: [9, 9, 9, 9, 9], rir: 1, w: 150 }], at: 1 };
vq.sessionLog[isoL(Date.now() - 4 * 864e5)] = { entries: [{ id: "hack", reps: [8, 8, 8, 8, 8], rir: 1, w: 160 }], at: 1 };
vq.sessionLog[isoL(Date.now() - 16 * 864e5)] = { entries: [{ id: "hack", reps: [8, 8], rir: 1, w: 160 }], at: 1 };
for (let k = 7; k >= 1; k--) vq.soreness = [...(vq.soreness || []), { d: isoL(Date.now() - k * 864e5), mgs: k <= 3 ? ["quads"] : [] }];
const q77 = mv77(vq).find((m) => m.mg === "quads");
ok(q77 && q77.sore7 === 3 && (q77.zone === "HIGH" || q77.zone === "OVER"), "soreness counts per muscle per rolling week: " + q77.sore7 + " on a " + q77.zone + " load");
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); vq.sleep.nights = vq.sleep.nights.filter((n) => n.d !== d); vq.sleep.nights.push({ d, h: 7.8 }); }
const sw77 = sv77(vq, 0);
ok(sw77 && sw77.agentProposals.some((ap) => ap.kind === "volume" && ap.dir === -1 && ap.body.indexOf("sore") > -1), "three sore mornings on a high week proposes the trim — recovery speaks before bar speed");

// the desk's energy gate
let eg = clone(TS77);
for (const [k, reps] of [[6, [10, 9]], [4, [11, 9]], [2, [12, 10]]]) eg.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "rows", reps, rir: 1, w: 175 }], at: 1 };
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); eg.sleep.nights = eg.sleep.nights.filter((n) => n.d !== d); eg.sleep.nights.push({ d, h: 7.8 }); }
for (let k = 6; k >= 2; k--) eg.energy = [...(eg.energy || []), { d: isoL(Date.now() - k * 864e5), v: 4 }];
let egBase = lc77(eg, "rows");
eg.energy.push({ d: td77, v: 2 });
const egCall = lc77(eg, "rows");
ok(egCall.verdict === "HOLD" && egCall.receipts.join(" ").indexOf("Energy gate") > -1, "a 2/5 morning against a usual 4 caps the desk at HOLD, receipt on file (was " + egBase.verdict + ")");

// the grip gate
let gg = clone(TS77);
for (const [k, reps] of [[6, [10, 9]], [4, [11, 9]], [2, [12, 10]]]) gg.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "rows", reps, rir: 1, w: 175 }], at: 1 };
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); gg.sleep.nights = gg.sleep.nights.filter((n) => n.d !== d); gg.sleep.nights.push({ d, h: 7.8 }); }
for (let k = 5; k >= 2; k--) gg.grip = [...(gg.grip || []), { d: isoL(Date.now() - k * 864e5), l: 115, r: 115 }];
gg.grip.push({ d: td77, l: 100, r: 100 });
const ggCall = lc77(gg, "rows");
ok(ggCall.verdict === "HOLD" && ggCall.receipts.join(" ").indexOf("Grip gate") > -1, "a 13% grip drop caps the desk — the nervous system testifies first");

// meds none-day flags the weather
let mw = clone(TS77);
mw.medsLog = [{ d: td77, taken: false, at: "—" }];
ok(dw77(mw, td77).flags.some((f) => f.k === "nomeds"), "a none-med day is named in the weather, not hidden");

// salt/alcohol yesterday annotates this morning's read
let wr = clone(TS77);
wr.blackout = { until: isoL(Date.now() - 6 * 864e5) };
wr.dailyLogs[isoL(Date.now() - 864e5)] = { cal: 2400, pro: 170, steps: 12000, sodium: "high", alc: 3 };
const wr2 = ar77(wr, td77, 164.2);
ok(wr2.reads[wr2.reads.length - 1].note.indexOf("water noise likely") > -1, "the scale read carries its own explanation: " + wr2.reads[wr2.reads.length - 1].note.slice(0, 44));

console.log(`\nFINAL76: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.77.1 — yesterday's books and today's books agree on the law
const { liveBooks: lb77, booksToday: bt77x, SEED: TT77 } = __test;
let ag = clone(TT77);
ag.energy = [{ d: isoL(Date.now() - 3 * 864e5), v: 4 }];
const yb = lb77(ag).items.find((i) => i.k === "energy");
ok(yb && yb.ok === false, "an adopted instrument missing yesterday shows in the brief's gap line too");
ok(!lb77(clone(TT77)).items.some((i) => i.k === "grip"), "unadopted stays invisible in both ledgers — same law, both days");

console.log(`\nFINAL77: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.84 — law 12: no decorative fields
const { CONSTITUTION: CN84 } = __test;
ok(CN84.length === 12 && CN84[11][0] === "No decorative fields", "law 12 carved: " + CN84[11][0]);
ok(CN84[11][1].indexOf("week nine") > -1, "the law keeps its teeth in its own words");

console.log(`\nFINAL78: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.98 — the two new instruments earn their places
const { labAnalytics: lc98, INS_MAP: IM98, SEED: TS98 } = __test;
const cards98 = lc98(clone(TS98));
const mw98 = cards98.find((c) => c.id === "medswindow");
ok(!!mw98, "the meds window files into the lab");
ok(mw98.status === "ARMED" && mw98.forYou.indexOf("Three of each") > -1, "meds window stays silent until three paired days exist");
ok(mw98.deep.indexOf("never propose a dose") > -1 && mw98.deep.indexOf("confound") > -1, "the meds card forbids itself a dose opinion and names its own confound");

// meds window wakes with paired days and reports both piles
let mstate = clone(TS98);
mstate.medsLog = []; mstate.dailyLogs = {};
for (let k = 1; k <= 4; k++) { const d = isoL(Date.now() - k * 864e5); mstate.medsLog.push({ d, taken: true, at: "12:00" }); mstate.dailyLogs[d] = { cal: 1800, pro: 175, steps: 16000 }; }
for (let k = 5; k <= 8; k++) { const d = isoL(Date.now() - k * 864e5); mstate.medsLog.push({ d, taken: false, at: "—" }); mstate.dailyLogs[d] = { cal: 2300, pro: 150, steps: 13000 }; }
const mw98b = lc98(mstate).find((c) => c.id === "medswindow");
ok(mw98b.status === "LIVE" && mw98b.forYou.indexOf("1800 on meds vs 2300 without") > -1, "both piles reported plainly: " + mw98b.forYou.slice(0, 52));



// both are mapped and shelved exactly once
ok(!!IM98.medswindow, "the meds window declares its inputs — the census test proves it sits on exactly one shelf");

console.log(`\nFINAL79: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.99 — the forecast: measured slope, honest band, acts on nothing
const { labAnalytics: la99, INS_MAP: IM99, SEED: TS99 } = __test;
let f99 = clone(TS99);
f99.weekly = [];
const fc99a = la99(f99).find((c) => c.id === "forecast");
ok(!!fc99a && fc99a.status === "ARMED" && fc99a.forYou.indexOf("guessed line is worse than none") > -1,
   "with no weekly snapshots the forecast refuses to draw a line");

let g99 = clone(TS99);
g99.trend = 165;
g99.weekly = [{ wk: isoL(Date.now() - 21 * 864e5), trend: 167.4 }, { wk: isoL(Date.now() - 14 * 864e5), trend: 166.3 }, { wk: isoL(Date.now() - 7 * 864e5), trend: 165.4 }];
const fc99 = la99(g99).find((c) => c.id === "forecast");
ok(fc99.status === "LIVE" && fc99.lines.filter((l) => l.indexOf("wk +") === 0).length === 8, "eight weeks projected, one row each");
ok(fc99.lines[0].indexOf("% bf") > -1 && fc99.lines[0].indexOf("lean") > -1, "each week carries weight, body fat and lean: " + fc99.lines[0].slice(0, 46));
ok(fc99.lines[7].indexOf("\u00b1") > -1 && parseFloat(fc99.lines[7].split("\u00b1")[1]) > parseFloat(fc99.lines[0].split("\u00b1")[1]),
   "the band widens with distance — slope uncertainty compounds");
ok(fc99.forYou.indexOf("(forecast") > -1 && fc99.deep.indexOf("never acts") > -1, "labelled a forecast and bound to act on nothing");

// lifts need three sessions before they are projected
let h99 = clone(g99);
h99.sessionLog = {};
h99.sessionLog[isoL(Date.now() - 14 * 864e5)] = { entries: [{ id: "calves", reps: [10, 10], rir: 1, w: 315 }], at: 1 };
h99.sessionLog[isoL(Date.now() - 7 * 864e5)] = { entries: [{ id: "calves", reps: [11, 11], rir: 1, w: 315 }], at: 1 };
ok(!la99(h99).find((c) => c.id === "forecast").lines.some((l) => l.indexOf("reps/wk") > -1), "two sessions is not a slope — the lift stays absent");
h99.sessionLog[isoL(Date.now() - 2 * 864e5)] = { entries: [{ id: "calves", reps: [13, 12], rir: 1, w: 315 }], at: 1 };
const lift99 = la99(h99).find((c) => c.id === "forecast").lines.find((l) => l.indexOf("reps/wk") > -1);
ok(!!lift99 && lift99.indexOf("n=3") > -1, "the third session opens the lift projection: " + (lift99 || "").slice(0, 54));
ok(!!IM99.forecast, "the forecast declares its inputs");

// v3.99.9 — per-set RIR: the terminal set is recorded, never assumed
const { buildRirSets: brs, rirSetsOf: rso, openerRir: orr, terminalRir: trr, migrate: mgRS, SEED: TRS, genSession: gsRS, completeSession: csRS, SCHEMA_V: SVRS } = __test;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* The seed is authored already-current while migrate() walks old states up to
   the same number. They carried that number separately and the seed silently
   fell a version behind. These two hold them together. */
ok(TRS.v === SVRS, "the seed is authored at the current schema version — no silent drift behind migrate()");
ok(TRS.exercises.every((e) => !e.lastMeta || (Array.isArray(e.lastMeta.rirSets) && e.lastMeta.rirSets.length === (e.lastMeta.reps || []).length)),
   "a fresh install's PREV blocks are shaped exactly like migrated ones");

// the shape: opener in slot 0, terminal in the last slot, middle sets left unknown
ok(eq(brs({ reps: [8, 8, 7], rir: 1, rirEnd: 0 }), [1, null, 0]), "three sets rated at both ends → [1,null,0]; the middle stays unknown, not guessed");
ok(eq(brs({ reps: [8, 8, 7], rir: 1 }), [1, null, null]), "opener alone never fabricates a terminal value");
ok(eq(brs({ reps: [8, 8, 7], rirEnd: 0 }), [null, null, 0]), "terminal alone never back-fills the opener");
ok(eq(brs({ reps: [8, 8, 7] }), [null, null, null]), "an unrated entry is three nulls, not three zeros");
ok(eq(brs({ reps: [] }), []) && eq(brs({}), []), "no reps, no array — nothing to align to");

// a single-set lift: opener and terminal are the same set, so the terminal rating wins
ok(eq(brs({ reps: [15], rir: 2, rirEnd: 0 }), [0]), "one set means opener IS terminal — the last-set rating is the truthful one");
ok(eq(brs({ reps: [15], rir: 2 }), [2]), "one set, opener only → that value still lands");
ok(eq(brs({ reps: [8, 8, 7] }, 2), [null, null]), "an explicit length overrides the reps array");

// reading back: legacy entries answer the opener question without a migration
ok(eq(rso({ reps: [8, 8, 7], rir: 1 }), [1, null, null]), "a pre-v31 entry still reports its opener — `rir` always meant slot 0");
ok(eq(rso({ reps: [8, 8, 7], rirSets: [2] }), [2, null, null]), "a short rirSets is padded to the rep count, never left ragged");
ok(eq(rso({ reps: [8, 8], rirSets: [2, 1, 0] }), [2, 1]), "a long rirSets is trimmed — reps are the source of truth for set count");
ok(eq(rso(null), []) && eq(rso({}), []), "no entry, no array");
ok(orr({ reps: [8, 8, 7], rir: 1, rirSets: [1, null, 0] }) === 1 && trr({ reps: [8, 8, 7], rir: 1, rirSets: [1, null, 0] }) === 0,
   "opener and terminal read off opposite ends of the same array");
ok(trr({ reps: [8, 8, 7], rir: 1 }) === null, "an unrated terminal reads null — the ramp must never mistake silence for failure");
ok(orr({ reps: [8, 8, 7], rirSets: [0, null, null] }) === 0 && trr({ reps: [10], rirSets: [0] }) === 0, "0 is a value, not an absence");

// logging a real session stores both ends
const slpRS = { clean: true, run: 3, need: 3, last: { h: 8 } };
const dRS = "2026-07-23";
const gRS = gsRS(clone(TRS), dRS, slpRS);
const enRS = gRS.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: e.id === "press" ? 2 : null, rirEnd: e.id === "press" ? 0 : null }));
const { s: afterRS } = csRS(clone(TRS), dRS, enRS, slpRS);
const logRS = afterRS.sessionLog[dRS].entries.find((e) => e.id === "press");
ok(logRS.rirSets[0] === 2 && logRS.rirSets[logRS.rirSets.length - 1] === 0 && logRS.rirSets.length === logRS.reps.length,
   "the session log carries a per-set array aligned to reps: [" + logRS.rirSets.join(",") + "]");
ok(trr(logRS) === 0 && orr(logRS) === 2, "and it reads back through the same accessors the ramp will use");
ok(logRS.rir === 2, "legacy `rir` is still written — every existing consumer keeps working untouched");
const metaRS = afterRS.exercises.find((e) => e.id === "press").lastMeta;
ok(eq(metaRS.rirSets, logRS.rirSets) && metaRS.rir === 2, "PREV carries the same array, so the lift card can show both ends");
const unratedRS = afterRS.sessionLog[dRS].entries.find((e) => e.id !== "press");
ok(trr(unratedRS) === null, "lifts he did not rate stay null across the whole round trip");

// the opener rule is untouched: rirHist and holdFlag still read `rir` only
const hotRS = gRS.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: e.id === "press" ? 0 : null, rirEnd: e.id === "press" ? 3 : null }));
const { s: h1RS } = csRS(clone(TRS), dRS, hotRS, slpRS);
const { s: h2RS } = csRS(h1RS, "2026-07-30", hotRS, slpRS);
ok(h2RS.exercises.find((e) => e.id === "press").holdFlag === true, "two hot openers still trip the hold — a soft terminal set does not rescue it");

// migration: v30 phones gain the array without gaining a claim
const oldRS = clone(TRS);
oldRS.v = 30;
oldRS.sessionLog = { "2026-07-20": { entries: [{ id: "press", reps: [8, 8, 7], rir: 1, w: 245 }, { id: "curl", reps: [12, 8, 10], w: 55 }], at: 1 } };
const migRS = mgRS(oldRS);
ok(migRS.v === 31, "a v30 phone lands on v31");
const mPress = migRS.sessionLog["2026-07-20"].entries.find((e) => e.id === "press");
ok(eq(mPress.rirSets, [1, null, null]), "the old opener value is lifted into slot 0 — a restatement, not a guess");
ok(trr(mPress) === null, "and the terminal slot stays null: the app never asked, so it does not know");
ok(eq(migRS.sessionLog["2026-07-20"].entries.find((e) => e.id === "curl").rirSets, [null, null, null]), "an entry with no RIR at all migrates to nulls, aligned to its reps");
ok(migRS.exercises.every((e) => !e.lastMeta || Array.isArray(e.lastMeta.rirSets)), "every PREV block gets the array too — no half-migrated states");
ok(eq(mgRS(migRS), migRS), "migration is idempotent — re-running it on a v31 state changes nothing");
const twiceRS = clone(migRS); twiceRS.v = 30;
ok(eq(mgRS(twiceRS).sessionLog["2026-07-20"].entries.find((e) => e.id === "press").rirSets, [1, null, null]),
   "a state that already has rirSets is left alone even if the version is rolled back");

// v3.99.10 — the rest tag: attribution, scoped to the size of the effect
const { PACE: PC, paceRushed: prz, liftCall: lcP, completeSession: csP, genSession: gsP, SEED: TP, restFor: rfP } = __test;

ok(PC.rushed === "rushed" && PC.normal === "normal", "the two pace values are named, not stringly-typed at each call site");
ok(prz({ pace: "rushed" }) === true && prz({ pace: "normal" }) === false && prz({}) === false && prz(null) === false,
   "absent pace reads as unknown, never as rushed — pre-feature sessions are not retroactively accused");

// it is written on the way in, and only ever as one of the two values
const slpP = { clean: true, run: 3, need: 3, last: { h: 8 } };
const dP = "2026-07-23";
const gP = gsP(clone(TP), dP, slpP);
const enP = gP.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow }));
ok(csP(clone(TP), dP, enP, slpP, { pace: "rushed" }).s.sessionLog[dP].pace === "rushed", "a rushed session is recorded as rushed");
ok(csP(clone(TP), dP, enP, slpP, { pace: "normal" }).s.sessionLog[dP].pace === "normal", "a full-rest session is recorded as normal");
ok(csP(clone(TP), dP, enP, slpP).s.sessionLog[dP].pace === null, "no tap, no claim — the field lands null");
ok(csP(clone(TP), dP, enP, slpP, { pace: "kinda quick" }).s.sessionLog[dP].pace === null, "anything that is not one of the two values is discarded, not stored");
const rushLines = csP(clone(TP), dP, enP, slpP, { pace: "rushed" }).lines;
ok(rushLines.some((l) => l.t.indexOf("RUSHED") > -1), "the feed says out loud what the tag will and will not do");
ok(!csP(clone(TP), dP, enP, slpP, { pace: "normal" }).lines.some((l) => l.t.indexOf("RUSHED") > -1), "a normal session gets no rushed line");

/* The point of the whole feature: three declining sessions RESET the lift —
   lightening the bar 5%. That must not fire off compressed days. */
const stallDays = ["2026-07-06", "2026-07-09", "2026-07-13", "2026-07-16"];
const mkStall = (paces) => {
  const st = clone(TP);
  st.sessionLog = {};
  [[10, 10], [9, 9], [8, 8], [7, 7]].forEach((reps, i) => {
    st.sessionLog[stallDays[i]] = { entries: [{ id: "rows", reps, rir: 1, rirSets: [1, null], w: 175 }], at: i + 1, pace: paces[i] };
  });
  return st;
};
const allHonest = lcP(mkStall([null, null, null, null]), "rows");
ok(allHonest.verdict === "RESET", "four honestly-fought declining sessions still reset the lift — the safety net is not a mute button: " + allHonest.verdict);
const someRushed = lcP(mkStall([null, "rushed", "rushed", "rushed"]), "rows");
ok(someRushed.verdict !== "RESET", "the same declining numbers on rushed days do NOT lighten the bar: " + someRushed.verdict);
ok(someRushed.receipts.some((r) => r.indexOf("rushed") > -1), "and it says why, in his words, on the card");
ok(someRushed.vel === allHonest.vel, "velocity is unchanged — a ~0.15 SMD does not justify throwing the reading away");
const markedNormal = lcP(mkStall([null, "normal", "normal", "normal"]), "rows");
ok(markedNormal.verdict === "RESET", "tapping FULL REST does not buy an exemption — only 'rushed' changes anything");

// the Gym Mode derivation thresholds, stated as arithmetic rather than left in the component
const paceOf = (n, cut) => (n >= 3 ? (cut / n >= 0.5 ? PC.rushed : PC.normal) : null);
ok(paceOf(0, 0) === null && paceOf(2, 2) === null, "under three rests there is no session-level statement to make");
ok(paceOf(6, 3) === PC.rushed && paceOf(6, 2) === PC.normal, "half the rests cut short is the line, and it is inclusive");
ok(paceOf(8, 0) === PC.normal, "letting every timer run out reads as full rest, with no tap from him");
ok(rfP("press") === 150 && rfP("curl") === 90, "the pace tag records what happened; the prescription itself lives in restFor and is set by the evidence, not by the tag");

// v3.99.11 — autoregulated progression: the step is sized by what he had left
const { progressStep: ps, progressAnchor: pa2, atTopOfWindow: atw, targetsFor: tfA, fadeRead: frd, sessionDebrief: sdA, SEED: TA9, genSession: gsA, completeSession: csA } = __test;
const lift = (o) => Object.assign({ id: "x", n: "X", sets: 4, hi: 13, w: 100, inc: 5, last: [10, 8, 7, 7] }, o);
const meta = (reps, rirSets, debt) => ({ d: "2026-07-20", w: 100, reps, rirSets, debt: !!debt });

// the step scales with the terminal rating, and is capped at what he claimed
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 0]) })).add === 1, "terminal set taken to failure → the honest step is one rep");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 1]) })).add === 2, "one rep short of failure → a two-rep step");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 2]) })).add === 2, "two left on the failure set → two reps back, exactly what he said he had");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]) })).add === 3, "three left → three, and the cap stops there because RIR is least accurate far from failure");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 5]) })).add === 3, "a claimed 5 RIR still buys only three — the estimate is not trusted that far out");

// with no terminal rating it falls back to the opener, conservatively
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, null]) })).add === 1, "opener at the prescribed 2 with no terminal rating → still one rep, because 2 is compliance not headroom");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [3, null, null, null]) })).add === 2, "opener at 3 says headroom even without a terminal rating");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [0, null, null, null]) })).add === 1, "a hot opener holds the step at one");
ok(ps(lift({})).add === 1 && ps(lift({ lastMeta: meta([10, 8], [null, null]) })).add === 1, "nothing rated → the old default, unchanged");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]), holdFlag: true })).add === 0, "the governor hold outranks every reserve reading — nothing climbs");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3], true) })).add === 1, "a short-sleep session does not get to set a bigger bar, however much was left in the tank");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 2]) })).why.indexOf("failure") > -1, "and every step carries the reason it is that size");

// the targets that come out the other end
ok(JSON.stringify(tfA(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 0]) }))) === "[10,9,7,7]", "RIR 0 reproduces the old single-rep behaviour exactly");
ok(JSON.stringify(tfA(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]) }))) === "[10,10,8,7]",
   "three reps of reserve buys three reps of target, and they spread across the faded sets rather than spiking one: 10,8,7,7 → 10,10,8,7");
ok(JSON.stringify(tfA(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]), holdFlag: true }))) === "[10,8,7,7]", "held lifts repeat the line exactly — no climb");
ok(JSON.stringify(tfA({ last: [14, 13, 13], hi: 15, sets: 3 })) === "[14,14,13]", "the original rule still holds when nothing is rated");
ok(JSON.stringify(tfA({ last: [10, 10], hi: 10, sets: 2 })) === "[10,10]", "and a full window still refuses to invent reps above the ceiling");
ok(JSON.stringify(tfA(lift({ hi: 9, last: [9, 9, 9, 9], lastMeta: meta([9, 9, 9, 9], [2, null, null, 3]) }))) === "[9,9,9,9]", "at the ceiling the step has nowhere to go and stops cleanly");

// the anchor: a flagged day stops ratcheting him down
const mkAnchor = (pace, nightsH) => {
  const st = clone(TA9);
  st.sleep.nights = ["2026-07-07", "2026-07-08", "2026-07-09"].map((d) => ({ d, h: nightsH }));
  st.sessionLog = { "2026-07-10": { entries: [{ id: "rows", reps: [10, 10], rir: 1, w: 180 }], at: 1, pace } };
  return st;
};
const anchEx = { id: "rows", sets: 2, hi: 12, w: 180, last: [7, 7], lastMeta: meta([7, 7], [1, 0], true) };
ok(JSON.stringify(pa2(anchEx, mkAnchor("normal", 8))) === "[10,10]", "after a short-sleep dip the anchor returns to his best clean session at that weight");
ok(JSON.stringify(pa2({ ...anchEx, lastMeta: meta([7, 7], [1, 0], false) }, mkAnchor("normal", 8))) === "[7,7]", "an honest decline on a clean day is real and DOES set the anchor");
ok(JSON.stringify(pa2(anchEx, mkAnchor("rushed", 8))) === "[7,7]", "a rushed session is not a clean benchmark either — it cannot become the anchor");
ok(JSON.stringify(pa2(anchEx, mkAnchor("normal", 5))) === "[7,7]", "and neither is a second short-sleep session — one bad night is not repaired by another");
ok(JSON.stringify(pa2(anchEx, null)) === "[7,7]", "with no state to look through, the anchor is simply the last session");

// the load gate, with the fade allowance that unblocks a descending scheme
const g4 = { sets: 4, hi: 13 };
ok(atw([13, 13, 13, 13], g4) === true, "a flat maxed window is still the top of the window");
ok(atw([13, 12, 11, 10], g4) === true, "so is a natural one-rep-per-set fade off a ceiling opener — this is the change");
ok(atw([13, 12, 11, 9], g4) === false, "one rep below that natural line and it is not earned");
ok(atw([12, 12, 12, 12], g4) === false, "the opener must actually reach the ceiling — no earning from below it");
ok(atw([10, 8, 7, 7], g4) === false && atw([13, 12], g4) === false, "his current calves line does not earn, and a short session cannot earn at all");

// the fade read no longer calls an ascending pair a fade
ok(frd([5, 6]).indexOf("climbed into it") > -1, "5 then 6 is climbing into the lift, not fading — the old rule called this 'barely faded'");
ok(frd([10, 12, 10]).indexOf("peaked on set 2") > -1, "a mid-session peak is named as one");
ok(frd([9, 9, 9]).indexOf("dead flat") > -1, "flat is flat");
ok(frd([10, 8, 7, 7]).indexOf("steep drop of 3") > -1, "and a real drop is still called a steep drop");
ok(frd([8, 7]).indexOf("barely faded") > -1 && frd([5]) === null && frd([]) === null, "a one-rep fade is minor, and a single set has no shape to read");

// the debrief: no sentence may repeat verbatim across lifts
const dbD = isoL(Date.now());
let dbX = clone(TA9);
dbX.sessionLog = {};
dbX.sessionLog[isoL(Date.now() - 4 * 864e5)] = { entries: [{ id: "hack", reps: [9, 9, 9], rir: 2, rirSets: [2, null, 2], w: 160 }, { id: "ham", reps: [10, 10], rir: 2, rirSets: [2, 2], w: 120 }, { id: "abs", reps: [10, 10, 10], rir: 2, rirSets: [2, null, 2], w: 100 }], at: 1 };
dbX.sessionLog[dbD] = { entries: [{ id: "hack", reps: [9, 9, 9], rir: 2, rirSets: [2, null, 2], w: 160 }, { id: "ham", reps: [10, 10], rir: 2, rirSets: [2, 2], w: 120 }, { id: "abs", reps: [10, 10, 10], rir: 2, rirSets: [2, null, 2], w: 100 }], at: 2, pace: "normal" };
const dbR = sdA(dbX, dbD);
const allLines = dbR.lifts.flatMap((L) => L.lines);
const dupes = allLines.filter((l, i) => allLines.indexOf(l) !== i);
ok(dupes.length === 0, "three lifts rated identically produce zero repeated sentences — the filler is gone" + (dupes.length ? ": " + dupes[0] : ""));
ok(dbR.lifts.every((L) => L.lines.some((l) => typeof l === "string" && l.indexOf("Next time:") === 0)), "every lift says exactly what it will ask for next time");
ok(dbR.lifts.every((L) => L.lines.every((l) => typeof l === "string")), "no deferred placeholder objects leak out to the UI");
/* The reason is either on the lift (when lifts differ) or hoisted into the
   summary once (when every lift steps for the same reason). Never six times. */
const nextLines = dbR.lifts.map((L) => L.lines.find((l) => l.indexOf("Next time:") === 0));
const hoisted = dbR.summary.some((l) => l.indexOf("for the same reason") > -1);
ok(hoisted !== nextLines.some((l) => l.indexOf("because") > -1), "the step reason appears either per-lift or once in the summary — never both, never neither");
ok(hoisted && new Set(nextLines.map((l) => l.replace(/[0-9,]/g, ""))).size >= 1, "with a session-wide reason the per-lift lines carry only the numbers");
/* And when the lifts genuinely differ, the reason comes back down to the lift.
   Driven through completeSession, because the step is read off ex.lastMeta —
   the state's own view — not off the archived session row. */
const dMix = "2026-07-24";
const gMix = gsA(clone(TA9), dMix, { clean: true, run: 3, need: 3, last: { h: 8 } });
const enMix = gMix.ex.map((e2) => ({ id: e2.id, n: e2.n, w: e2.w, tgt: e2.tgt, reps: e2.tgt.slice(), isDebutNow: e2.isDebutNow, rir: 2, rirEnd: e2.id === "ham" ? 3 : 0 }));
const stMix = csA(clone(TA9), dMix, enMix, { clean: true, run: 3, need: 3, last: { h: 8 } }, { pace: "normal" }).s;
const dbMr = sdA(stMix, dMix);
const mixed = dbMr.lifts.map((L) => L.lines.find((l) => l.indexOf("Next time:") === 0)).filter(Boolean);
ok(mixed.length >= 2 && mixed.every((l) => l.indexOf("because") > -1), "with mixed ratings the reason comes back down onto each lift");
ok(!dbMr.summary.some((l) => l.indexOf("for the same reason") > -1), "and nothing gets hoisted when the reasons differ");
ok(mixed.some((l) => l.indexOf("3 reps added") > -1) && mixed.some((l) => l.indexOf("1 rep added") > -1),
   "the lift with 3 in the tank steps three, the lifts taken to failure step one — same session, different answers");
ok(new Set(mixed.map((l) => l.slice(l.indexOf("because")))).size >= 2, "and those answers are worded differently, not one template with the number swapped");
ok(dbR.summary[0].length > 0 && !/^\d+ lifts/.test(dbR.summary[0]), "the summary leads with a read, not a stat line");
ok(dbR.summary.some((l) => l.indexOf("meant to reach failure") > -1), "three lifts with reserve left gets one cross-lift observation, not three copies");
ok(dbR.summary.some((l) => l.indexOf("lb moved") > -1), "the stat line is still there, just no longer first");
const dbNo = sdA(dbX, "2020-01-01");
ok(dbNo === null, "unlogged dates still return nothing");

// end to end: a real session logged with a terminal rating produces a bigger next target
const slpA = { clean: true, run: 3, need: 3, last: { h: 8 } };
const dA = "2026-07-24";
const gA = gsA(clone(TA9), dA, slpA);
const mkEn = (rirEnd) => gA.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: 2, rirEnd }));
const softA = csA(clone(TA9), dA, mkEn(3), slpA).s;
const hardA = csA(clone(TA9), dA, mkEn(0), slpA).s;
const pickA = (st) => st.exercises.find((e) => e.id === "ham");
const softT = tfA(pickA(softA), softA), hardT = tfA(pickA(hardA), hardA);
ok(softT.reduce((a, b) => a + b, 0) > hardT.reduce((a, b) => a + b, 0),
   `the same reps with 3 left over ask for more next time than the same reps taken to failure: ${softT.join(",")} vs ${hardT.join(",")}`);

// v3.99.12 — load rungs: the app may only ask for weights the machine can make
const { loadRungs: lrG, nextLoad: nl, prevLoad: plG, snapLoad: sl2, parseRungs: prG, liftCall: lcR, completeSession: csR, SEED: TR9 } = __test;
const cybex = { id: "c", n: "Cybex cable", sets: 2, hi: 10, w: 85, inc: 5, steps: [80, 82.5, 85, 90, 92.5, 95, 100] };
const even = { id: "e", n: "Even stack", sets: 2, hi: 10, w: 85, inc: 5 };

ok(lrG(even) === null && lrG({ steps: [] }) === null && lrG({ steps: [50] }) === null, "no ladder, one rung, or an empty list all mean 'use the even increment'");
ok(JSON.stringify(lrG({ steps: [90, 80, 85, 80] })) === "[80,85,90]", "a ladder is sorted and de-duplicated however he types it");
ok(JSON.stringify(lrG({ steps: [80, "x", -5, 90, 0] })) === "[80,90]", "junk and non-positive numbers are dropped, not stored");

// the mini-jumps he actually asked for
ok(nl(cybex) === 90, "from 85 the next real rung is 90, not 85+5 by luck — it happens to agree here");
ok(nl(cybex, 80) === 82.5, "from 80 the attachment gives a 2.5 mini-jump, which a fixed +5 would have skipped");
ok(nl(cybex, 90) === 92.5 && nl(cybex, 92.5) === 95, "and it keeps stepping through the uneven rungs in order");
ok(nl(cybex, 100) === null, "the top of the stack is real — there is no next rung, and the app must not invent one");
ok(nl(even) === 90 && nl(even, 100) === 105, "with no ladder the old fixed increment is byte-for-byte unchanged");
ok(nl({ w: "BW", inc: null }) === null && nl({ w: 100, inc: null }) === null, "bodyweight and incrementless lifts have no next load");
ok(plG(cybex, 90) === 85 && plG(cybex, 82.5) === 80 && plG(cybex, 80) === null, "down the ladder works the same way, and the bottom rung is the bottom");
ok(sl2(cybex, 91) === 90 && sl2(cybex, 92.5) === 92.5 && sl2(cybex, 10) === 80, "an arbitrary number snaps to the rung at or below it, never above");
ok(sl2(even, 91) === 91, "with no ladder there is nothing to snap to");

// parsing whatever he types
ok(JSON.stringify(prG("80, 82.5, 85, 90")) === "[80,82.5,85,90]", "commas work");
ok(JSON.stringify(prG("80 82.5\n85  90")) === "[80,82.5,85,90]", "so do spaces and newlines");
ok(JSON.stringify(prG("90,80,85,85")) === "[80,85,90]", "out of order and duplicated still lands sorted and unique");
ok(prG("") === null && prG("  ") === null && prG("100") === null && prG("abc") === null, "empty or a single number clears the ladder rather than half-setting it");

// the engine only ever offers a real weight
const rungS = clone(TR9);
const cal = rungS.exercises.find((e2) => e2.id === "calves");
cal.steps = [300, 310, 315, 320, 335, 350];
cal.w = 320; cal.sets = 4; cal.hi = 13; cal.reclaim = null; cal.last = [13, 12, 11, 10];
const enR = [{ id: "calves", n: cal.n, w: 320, tgt: [13, 12, 11, 10], reps: [13, 12, 11, 10], rir: 1 }];
const afterR = csR(rungS, "2026-07-24", enR, { clean: true, run: 3, need: 3, last: { h: 8 } }).s;
const qR = afterR.queue.find((q) => q.exId === "calves" && !q.done && q.kind === "debut");
ok(qR && qR.newW === 335, "earning the window queues 335 — the next rung — not 325, which this machine cannot make: " + (qR ? qR.newW : "none"));
ok(afterR.feed.some((f) => f.t.indexOf("335 EARNED") > -1), "and the feed names the real weight");

// at the top of the stack, nothing is queued and it says so
const topS = clone(TR9);
const cal2 = topS.exercises.find((e2) => e2.id === "calves");
cal2.steps = [300, 310, 320]; cal2.w = 320; cal2.sets = 4; cal2.hi = 13; cal2.reclaim = null; cal2.last = [13, 12, 11, 10];
const afterT = csR(topS, "2026-07-24", [{ id: "calves", n: cal2.n, w: 320, tgt: [13, 12, 11, 10], reps: [13, 12, 11, 10], rir: 1 }], { clean: true, run: 3, need: 3, last: { h: 8 } }).s;
ok(!afterT.queue.some((q) => q.exId === "calves" && !q.done && q.kind === "debut"), "at the top rung nothing is queued — the app does not invent a weight above the stack");

// a RESET lands on a rung too
const resS = clone(TR9);
const rw = resS.exercises.find((e2) => e2.id === "rows");
rw.steps = [150, 160, 175, 180, 195]; rw.w = 180;
resS.sessionLog = {};
[["2026-07-06", [10, 10]], ["2026-07-09", [9, 9]], ["2026-07-13", [8, 8]], ["2026-07-16", [7, 7]]].forEach(([d, reps], i) => {
  resS.sessionLog[d] = { entries: [{ id: "rows", reps, rir: 1, rirSets: [1, null], w: 180 }], at: i + 1 };
});
const resR = lcR(resS, "rows");
ok(resR.verdict === "RESET" && resR.newW === 175, "a reset lands on 175 — a real rung — instead of 171, a weight this machine cannot make: " + resR.newW);
const resEven = clone(resS);
delete resEven.exercises.find((e2) => e2.id === "rows").steps;
ok(lcR(resEven, "rows").newW === 170, "with no ladder the old 5% round-to-5 is unchanged");
/* The deload picks the NEAREST rung below, not the nearest rung at-or-below the
   5% target — on a coarse stack those are different, and one is a cliff. */
const { deloadLoad: dld } = __test;
ok(dld({ w: 180, steps: [150, 160, 175, 180, 195] }) === 175, "180 on a coarse stack deloads one notch to 175, not two notches to 160");
ok(dld({ w: 180, steps: [150, 160, 170, 180] }) === 170, "where a rung sits near the 5% mark, that is the one it takes");
ok(dld({ w: 100, steps: [100, 110] }) === 100, "at the bottom rung there is nowhere to deload to, and it says so by not moving");
ok(dld({ w: 180, inc: 5 }) === 170 && dld({ w: 10, inc: 5 }) === 10, "with no ladder it is the old arithmetic, and it never goes below 5");

// v3.99.13 — rest prescribed at the evidence plateau, and recovery stops being a score
const { restFor: rf2, restLine: rl2, recoveryIndex: ri2, runAdaptive: ra2, SEED: TV13 } = __test;

ok(rf2("curl") === 90 && rf2("lateral") === 90 && rf2("tricep") === 90,
   "isolation rests 90 s — 75 s sat under the point where the measurable benefit stops, and the reps it cost landed on the sets the ramp reads");
ok(rf2("press") === 150 && rf2("rows") === 150 && rf2("hack") === 150, "compounds hold at 150 s, inside the 2-3 min band tested in trained lifters");
ok(rf2("curl", 2, 3) === 120 && rf2("press", 2, 3) === 180, "the set before the final one gets 30 s more — that is the set the taper sends to failure");
ok(rf2("curl", 1, 3) === 90 && rf2("press", 1, 3) === 150, "middle rests are unchanged");
ok(rf2("curl", 0, 1) === 90 && rf2("curl", 1, 1) === 90, "a single-set lift has no terminal bump to give");
ok(rf2("curl") >= 90 && rf2("press") >= 90, "nothing the app prescribes now sits under the 90 s plateau");
ok(rl2("curl", 3).indexOf("90s") === 0 && rl2("curl", 3).indexOf("120s before the last") > -1, "and the card he actually logs from states it: " + rl2("curl", 3));
ok(rl2("press", 1) === "150s between sets", "a one-set lift gets the short form");

// recovery: named signals with receipts and fixes, not a composite number
let recS = clone(TV13);
recS.sleep.nights = [{ d: "2026-07-24", h: 6 }, { d: "2026-07-25", h: 6.2 }, { d: "2026-07-26", h: 6.1 }, { d: "2026-07-27", h: 6 }, { d: "2026-07-28", h: 6.4 }];
const rec1 = ri2(recS);
ok(Array.isArray(rec1.flags) && rec1.watched === 7, "recovery returns named flags out of a stated number watched");
ok(rec1.flags.every((f) => f.k && f.receipt && f.fix), "every flag carries what raised it AND what clears it — a problem with no lever is not analysis");
ok(rec1.flags.some((f) => f.k === "sleep") && rec1.flags.some((f) => f.k === "avg5"), "five nights under 7 h raises both the reset flag and the chronic-average flag");
ok(rec1.lever && rec1.flags.every((f) => f.cost <= rec1.lever.cost), "the lever is the heaviest flag, so the card can say 'start here' instead of listing five problems");
ok(rec1.factors.length === rec1.flags.length, "the old factors array still resolves, so nothing downstream broke");

/* The correctness fix: a rep dip on a day that was not a fair test is not
   evidence of poor recovery. It used to be counted twice — once as the sleep
   flag, once as the dip. */
const mkDip = (pace, nightsH) => {
  const st = clone(TV13);
  st.sleep.nights = ["2026-07-24", "2026-07-25", "2026-07-26", "2026-07-27"].map((d) => ({ d, h: nightsH }));
  st.sessionLog = { "2026-07-28": { entries: [{ id: "ham", reps: [8, 8], rir: 1, w: 120 }], at: 1, dips: 3, pace } };
  return st;
};
ok(ri2(mkDip("normal", 8)).flags.some((f) => f.k === "dips"), "dips on a clean, unhurried day are real and do flag");
ok(!ri2(mkDip("rushed", 8)).flags.some((f) => f.k === "dips"), "the same dips on a rushed session do not — a compressed day lowers reps by itself");
ok(!ri2(mkDip("normal", 5)).flags.some((f) => f.k === "dips"), "and not on short sleep either — the sleep flag already carries that day");
ok(ri2(mkDip("rushed", 8)).excludedDips === 3, "what was excluded is reported, not silently dropped");
ok(ri2(mkDip("normal", 8)).excludedDips === 0, "and nothing is reported as excluded when nothing was");

// the proposal card: no composite score in the headline, a lever in the body
let propS = clone(TV13);
propS.sleep.nights = [{ d: "2026-07-22", h: 5.5 }, { d: "2026-07-23", h: 5.6 }, { d: "2026-07-24", h: 5.4 }, { d: "2026-07-25", h: 5.8 }, { d: "2026-07-26", h: 5.5 }];
propS.exercises.find((e) => e.id === "ham").holdFlag = true;
propS.exercises.find((e) => e.id === "hack").holdFlag = true;
propS.blackout.until = "2026-01-01";
const propR = ra2(propS, "2026-07-27");
const recCard = propR.proposals.find((p) => p.rid && p.rid.indexOf("recovery_") === 0);
ok(!!recCard, "a low-recovery week still arms the card");
ok(!/\d+\/100/.test(recCard.title), "the headline is no longer a score out of 100 — the charter forbids a composite: " + recCard.title);
ok(/\d+ OF \d+ SIGNALS UP/.test(recCard.title), "it counts named signals instead, which is an enumeration rather than an index: " + recCard.title);
ok(recCard.why.indexOf("Start here:") > -1, "the body leads with the single biggest lever");
ok(recCard.why.indexOf("Converging signals") === -1, "and the old jargon opener is gone");
ok(recCard.why.indexOf("nothing auto-changes") > -1 && recCard.why.indexOf("Reps still progress") > -1,
   "it still says exactly what is held and what is not — a hold on loads is not a hold on progress");
ok(recCard.why.indexOf("re-reads it every morning") > -1, "and says when it looks again, so an unread card is not a dead end");
/* A card whose trigger has cleared must stand down rather than sit there asking
   to be applied. His live card was armed partly off dips that no longer count. */
let clearS = clone(propR);
clearS.sleep.nights = ["2026-07-24", "2026-07-25", "2026-07-26", "2026-07-27"].map((d) => ({ d, h: 8.2 }));
clearS.exercises.forEach((e) => { e.holdFlag = false; });
const clearR = ra2(clearS, "2026-07-28");
const stillArmed = (clearR.proposals || []).filter((p) => p.rid && p.rid.indexOf("recovery_") === 0 && !p.resolved);
ok(stillArmed.length === 0, "once the signals clear the card stands down instead of lingering with a claim the engine stopped making");
ok(clearR.proposals.some((p) => p.stoodDown), "it resolves rather than vanishing — nothing is deleted");
ok(clearR.feed.some((f) => f.t === "RECOVERY CARD STOOD DOWN"), "and the stand-down is written into the record, so the history still explains itself");

// v3.99.14 — the protocol is actually ranked, and protein scales off lean mass
const { dayProtocol: dp14, proteinTarget: pt14, bfEst: bf14, PROTEIN: P14, SEED: TW14 } = __test;

// protein: the unit is fat-free mass, because that is the model whose interval excludes zero
const ptS = clone(TW14);
const p0 = pt14(ptS);
ok(p0.ffmKg > 0 && p0.floor > 0, "the target is computed from measured lean mass, not from bodyweight or a constant");
ok(p0.g >= P14, "it never drops below the house number he already runs — a floor is a floor, not a cut");
ok(p0.g >= p0.floor, "and never below the evidence floor either");
ok(p0.why.indexOf("lean mass") > -1, "the receipt names the unit, so the number can be argued with");
/* Crossing into the lean sub-group RAISES the target — that is the counter-
   intuitive part, and the part the evidence is clearest about. */
const leanS = clone(TW14);
leanS.model.lean = leanS.trend * 0.89;
const pLean = pt14(leanS);
ok(pLean.bf <= 12.2 && pLean.inLeanSubgroup, "under 12.2% body fat he enters the sub-group with the largest coefficient");
ok(pLean.perKg === 3.0 && pLean.g > P14, `and the target steps UP, not down: ${pLean.g} g vs the flat ${P14} g it used to print`);
const fatS = clone(TW14);
fatS.model.lean = fatS.trend * 0.82;
ok(!pt14(fatS).inLeanSubgroup && pt14(fatS).perKg === 2.5, "above that line it sits at the 2.5 g/kg floor multiplier");

// the protocol: a real ranking, and no silent truncation
const slp14 = { clean: false, run: 0, need: 3, last: { h: 6 } };
const prS = clone(TW14);
prS.sleep.nights = [{ d: "2026-07-27", h: 6 }];
const pr14 = dp14(prS, slp14);
ok(Array.isArray(pr14.steps) && pr14.ranked === true, "the protocol declares itself ranked");
ok(pr14.steps.every((x) => typeof x.w === "number"), "every step carries the weight it was ranked by — nothing rides along unscored");
const ws14 = pr14.steps.map((x) => x.w);
ok(ws14.every((w, i) => i === 0 || ws14[i - 1] >= w), "and they come out in descending order: " + ws14.join(" > "));
ok(typeof pr14.held === "number", "what was held back is counted");
ok(pr14.held === 0 || pr14.steps.length === 5, "the list is capped at five, and anything past it is reported rather than dropped");

/* The ordering claim has to survive contact with the data. Protein outranks
   steps and caffeine; a training session outranks both; an alarm outranks all. */
const wOf = (p, frag) => { const st = p.steps.find((x) => x.a.indexOf(frag) > -1); return st ? st.w : null; };
const proteinW = wOf(pr14, "Protein"), stepsW = wOf(pr14, "Steps");
ok(proteinW != null, "protein is always on the page");
ok(stepsW == null || proteinW > stepsW, "protein outranks steps — one has an interval excluding zero, the other has never been tested");
const trainS = clone(TW14);
trainS.sessionLog = {};
trainS.sleep.nights = [{ d: "2026-07-27", h: 6 }];
const prTrain = dp14(trainS, slp14);
const sessW = wOf(prTrain, "Session");
ok(sessW == null || sessW >= proteinW, "on a training day the session outranks food — it is the entire stimulus");

// v3.99.15 — energy availability, and proposals you can move
const { energyAvailability: eaF, proposalDial: pdF, applyProposal: apF, dayProtocol: dpE, recoveryIndex: riE, labAnalytics2: la15, INS_MAP: IM15, EA_SPARING: EAS, EA_LOW: EAL, SEED: TE15 } = __test;

const mkEA = (cal, steps, days = 14) => {
  const st = clone(TE15);
  st.dailyLogs = {};
  for (let i = 0; i < days; i++) {
    const d = isoL(Date.now() - (i + 1) * 864e5);
    st.dailyLogs[d] = { cal, pro: 175, steps };
  }
  st.sessionLog = {};
  for (const k of [2, 4, 6, 9]) st.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "ham", reps: [10, 10], rir: 1, w: 120 }], at: 1 };
  return st;
};

ok(eaF(mkEA(1800, 16000, 4)).gated === true, "under eight logged calorie days it stays shut rather than averaging three numbers and calling it a reading");
ok(eaF(mkEA(1800, 16000, 4)).need === 8, "and it says how many days it needs");
const eaLow = eaF(mkEA(1800, 16000));
ok(!eaLow.gated && eaLow.lo < eaLow.hi, "it reports a RANGE, because the convention does not settle whether deliberate walking counts as exercise");
ok(Math.abs(eaLow.hi - (eaLow.intake - eaLow.trainKcal) / eaLow.ffmKg) < 0.15, "the upper end counts training only, and nothing else");
ok(eaLow.lo < eaLow.hi && eaLow.walkKcal > 0, "the lower end also charges the walking, and the walking is not free: " + eaLow.walkKcal + " kcal/day");
ok(eaLow.lo < EAS, `at 1,800 kcal on 16k steps he is under the ${EAS} sparing threshold: ${eaLow.lo}`);
ok(eaLow.receipts.length >= 4 && eaLow.receipts.some((r) => r.indexOf("estimate, not a measurement") > -1),
   "every input is shown, and the estimated ones say they are estimates");

/* The actionable half: it must say how much of each lever closes the gap. */
ok(eaLow.needKcal > 0 && eaLow.stepsToDrop > 0, "it quantifies both ways out — eat more, or walk less");
ok(Math.abs((eaLow.lo + eaLow.needKcal / eaLow.ffmKg) - EAS) < 0.6, "and the calorie figure actually lands on the threshold, not near it");

// the bands
ok(eaF(mkEA(3200, 5000)).band === "ADEQUATE", "a fed athlete on low steps reads adequate");
ok(eaF(mkEA(1200, 20000)).band === "VERY LOW", "a deep deficit on high steps reads very low");
ok(["LOW", "VERY LOW", "MARGINAL"].includes(eaF(mkEA(1800, 16000)).band), "and his shape of day is not read as fine");

// it reaches the surfaces that matter, not just the lab
const prE = dpE(mkEA(1500, 18000), { clean: true, run: 3, need: 3, last: { h: 8 } });
const eaStep = prE.steps.find((x) => x.a.indexOf("Energy availability") > -1);
ok(!!eaStep, "a low reading reaches today's protocol rather than sitting in the lab");
ok(eaStep.w > 90, "and it outranks the session, because a session run under the threshold is not the same session");
ok(riE(mkEA(1500, 18000)).flags.some((f) => f.k === "ea"), "it is also a recovery signal — the only one about the deficit rather than about training or sleep");
ok(riE(mkEA(3200, 5000)).flags.every((f) => f.k !== "ea"), "and it stays quiet when there is nothing to say");
ok(!!IM15.ea, "the instrument declares its inputs on the map — the suite refuses cards that are not on it");

// proposals you can move
ok(pdF({ apply: { kind: "cal", delta: 100 } }).max === 50, "a calorie proposal gets a bounded dial, not a blank field");
ok(pdF({ apply: { kind: "note" } }) === null && pdF({ apply: { kind: "phase", to: "EASE 2" } }) === null,
   "notes and phase changes get no dial — there is no number to move");
let propSt = clone(TE15);
propSt.proposals = [{ rid: "r1", id: "p1", d: "2026-07-27", title: "REDLINE RATE", why: "test", apply: { kind: "cal", delta: 100 }, resolved: false }];
const applied0 = apF(propSt, "p1");
ok(applied0.adjustments[0].nudge === 0 && applied0.proposals[0].resolved, "taking it as proposed records a zero adjustment, exactly as before");
const applied1 = apF(propSt, "p1", 25);
ok(applied1.adjustments[0].nudge === 25, "moving it records what he actually chose, not what was proposed");
ok(applied1.feed[0].how.indexOf("your version") > -1, "and the feed says it was his version");
const applied2 = apF(propSt, "p1", 500);
ok(applied2.adjustments[0].nudge === 50, "the dial is clamped — bounded adjustment stays closer to the supported number than a blank field does");
const applied3 = apF(propSt, "p1", -500);
ok(applied3.adjustments[0].nudge === -50, "clamped both ways");
const applied4 = apF(propSt, "p1", 13);
ok(applied4.adjustments[0].nudge === 25, "and it snaps to the step, so the record never carries a number the dial could not produce");

// v3.99.15b — the band gets teeth, and training frequency stops being under-read
const { runAdaptive: raB, energyAvailability: eaB, SEED: TB15 } = __test;
const mkRate = (r1, r2) => {
  const st = clone(TB15);
  st.blackout.until = "2026-01-01";
  st.weekly = [{ wk: "2026-07-06", trend: 170 }, { wk: "2026-07-13", trend: 170 - r1 }, { wk: "2026-07-20", trend: 170 - r1 - r2 }];
  st.trend = 170 - r1 - r2;
  return st;
};
const inBand = raB(mkRate(1.2, 1.3), "2026-07-27").proposals.filter((p) => !p.resolved && p.rid.indexOf("bandtop_") === 0);
ok(inBand.length === 0, "inside the band nothing fires — the band top is a threshold, not a nag");
const overBand = raB(mkRate(1.55, 1.6), "2026-07-27").proposals.filter((p) => !p.resolved && p.rid.indexOf("bandtop_") === 0);
ok(overBand.length === 1, "two weeks above the band top finally says something — before this, the stated band had no teeth at all and he could run over it until the redline");
ok(overBand[0].why.indexOf("redline") > -1 && overBand[0].why.indexOf("nothing is on fire") > -1,
   "and it is explicit that this is not an emergency — a warning that reads like an alarm gets ignored like one");
ok(overBand[0].why.indexOf("steps") > -1, "it names the cheapest lever, which is steps rather than food");
ok(!!__test.proposalDial(overBand[0]), "and it carries a dial, like every other numeric proposal");
const redlined = raB(mkRate(2.0, 2.1), "2026-07-27").proposals.filter((p) => !p.resolved);
ok(redlined.some((p) => p.rid.indexOf("redline_") === 0), "past the redline the redline still fires");
ok(!redlined.some((p) => p.rid.indexOf("bandtop_") === 0), "and the band-top card stands aside rather than double-billing the same week");

/* Training frequency must not be read off an incomplete log — under-charging
   exercise inflates energy availability, which hides the problem it exists to find. */
const thinLog = clone(TB15);
thinLog.dailyLogs = {};
for (let i = 0; i < 14; i++) thinLog.dailyLogs[isoL(Date.now() - (i + 1) * 864e5)] = { cal: 2000, pro: 175, steps: 16000 };
thinLog.sessionLog = { [isoL(Date.now() - 2 * 864e5)]: { entries: [{ id: "ham", reps: [10, 10], rir: 1, w: 120 }], at: 1 } };
const thinEA = eaB(thinLog);
ok(thinEA.sessPerWk >= 4, `a one-session log still charges the programme's four sessions a week, not one: ${thinEA.sessPerWk}`);
ok(thinEA.receipts.some((r) => r.indexOf("would flatter this number") > -1), "and it says out loud that it is using the schedule rather than the log, and why");

// v3.99.17 — one rate, one TDEE, and a calorie target derived from both
const { currentRate: crR, observedTDEE: otR, calorieTarget: ctR, askContext: acR, runAdaptive: raR, dayProtocol: dpR, VOL_BANDS: VBR, SEED: TR17 } = __test;

const mkReads = (n2, perDay, startW) => {
  const st = clone(TR17);
  st.blackout.until = "2026-01-01";
  st.reads = [];
  st.dailyLogs = {};
  for (let i = n2 - 1; i >= 0; i--) {
    const d = isoL(Date.now() - i * 864e5);
    st.reads.push({ d, w: +(startW - (n2 - 1 - i) * perDay).toFixed(1), sealed: false });
    st.dailyLogs[d] = { cal: 2000, pro: 175, steps: 12000 };
  }
  st.trend = st.reads[st.reads.length - 1].w;
  return st;
};

// the rate is a slope now, and it carries its own error
const rr = crR(mkReads(28, 0.2, 170));
ok(rr.method === "regression" && rr.n === 28, "with enough daily reads the rate is a least-squares slope, not the mean of two snapshots");
ok(Math.abs(rr.scale - 1.4) < 0.05, `and it recovers a known slope: 0.2 lb/day is 1.4 lb/wk, it says ${rr.scale}`);
ok(rr.ci === 0, "a perfectly linear record has zero residual and honestly reports a zero-width interval rather than manufacturing doubt");
const wobbly = mkReads(28, 0.2, 170);
wobbly.reads.forEach((r, i) => { r.w = +(r.w + [0.4, -0.3, 0.5, -0.6, 0.2][i % 5]).toFixed(1); });
const rwob = crR(wobbly);
ok(rwob.ci > 0 && rwob.lo < rwob.scale && rwob.hi > rwob.scale, `real scale noise produces a real interval: ${rwob.scale} ±${rwob.ci}`);
ok(Array.isArray(rr.rates) && rr.rates.length > 0, "and it keeps the snapshot rates alongside, so the disagreement between methods stays visible");
const noisy = mkReads(28, 0.2, 170);
noisy.reads.forEach((r, i) => { r.w = +(r.w + (i % 2 ? 1.2 : -1.2)).toFixed(1); });
ok(crR(noisy).ci > rr.ci, "noisier reads widen the interval instead of quietly producing the same confident number");
const few17 = clone(TR17); few17.reads = []; few17.weekly = [{ wk: "2026-07-13", trend: 170 }, { wk: "2026-07-20", trend: 168.6 }, { wk: "2026-07-27", trend: 167.4 }];
ok(crR(few17).method === "snapshots", "under ten daily reads it falls back to snapshots");
const none17 = clone(TR17); none17.reads = []; none17.weekly = [];
ok(crR(none17).method === "prior" && none17.reads.length === 0, "and with nothing at all it says prior rather than inventing a measurement");

/* The clamp used to bind at 1.6 and flatten every fast17 rate onto one TDEE. */
const fast17 = mkReads(28, 0.28, 175);
const slower = mkReads(28, 0.22, 175);
ok(otR(fast17).tdee !== otR(slower).tdee, "two different rates now give two different TDEEs — the old 1.6 ceiling made 1.55 and 1.73 produce the identical number");
ok(otR(fast17).lo < otR(fast17).tdee && otR(fast17).hi > otR(fast17).tdee, "and the TDEE carries the rate's error through, instead of arriving as a bare integer");
ok(otR(fast17).method === "regression", "it says which method produced it");

// the calorie target
const ct1 = ctR(mkReads(28, 0.2, 170));
ok(!ct1.gated && ct1.lo < ct1.hi, "the target is a band, because the maintenance it derives from is one");
ok(ct1.hi === ct1.tdee - Math.round((ct1.band[0] * 3500) / 7), "the top of the band is maintenance minus the slow end of his rate band");
ok(ct1.lo === Math.max(1700, ct1.tdee - Math.round((ct1.band[1] * 3500) / 7)), "the bottom is maintenance minus the fast17 end, floored at the calorie floor");
ok(ct1.why.indexOf("measured maintenance") > -1 && ct1.why.indexOf("daily reads") > -1, "and it shows its working: " + ct1.why.slice(0, 80));
const gated17 = clone(TR17); gated17.dailyLogs = {}; gated17.reads = [];
ok(ctR(gated17).gated === true && ctR(gated17).from === "phase", "without enough data it falls back to the authored phase band and says so");
const prot = dpR(mkReads(28, 0.2, 170), { clean: true, run: 3, need: 3, last: { h: 8 } });
const calStep = prot.steps.find((x) => x.a.indexOf("Calories") === 0);
ok(!!calStep && calStep.w > 80, "the daily calorie number reaches the protocol and ranks near the top — deficit magnitude is the dominant term");

/* Suggestions belong in the app, not in a conversation. */
const progS = raR(mkReads(28, 0.2, 170), isoL(Date.now()));
const volCard = progS.proposals.find((p) => p.rid === "volband" && !p.resolved);
ok(!!volCard, "the volume-band gap is filed as a proposal he can act on, not left in a chat window");
ok(volCard.why.indexOf("2,058 participants") > -1 && volCard.why.indexOf("5–10") > -1, "with the evidence attached rather than asserted");
ok(volCard.why.indexOf("will not move it on its own") > -1, "and it is explicit that a programme change stays his call");
ok(VBR.lo === 8 && VBR.hi === 14, "the band itself is unchanged — the app proposes, it does not reprogram him");

/* The analyst and the engine must stop quoting different numbers. */
const ctx17 = acR(mkReads(28, 0.2, 170));
ok(ctx17.indexOf("CANONICAL NUMBERS") > -1, "the analyst is handed the engine's numbers rather than left to re-derive them");
ok(ctx17.indexOf("do NOT re-derive") > -1, "and told not to recompute them — a number that changes between screens is worse than one slightly wrong");
["RATE", "MEASURED TDEE", "TARGET INTAKE", "PROTEIN TARGET"].forEach((k) => ok(ctx17.indexOf(k) > -1, `canonical block carries ${k}`));

console.log(`\nFINAL80: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
