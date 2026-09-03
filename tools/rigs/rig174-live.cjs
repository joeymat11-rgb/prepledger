/* rig174 — FIX-4b re-drive on the LIVE blob (origin/main:ledger/state.json @ 6e06ee9, 2026-09-03)
   Three engines: fix4b = 66bc7c3 (tip under review) · fix4 = 7ff2c62 (pre-fix) · main = deployed v7.55.9.
   Clock: MEASURED_TEST_NOW=2026-09-03 (declared asOf), TZ America/New_York. Every assert reads INPUTS. */
const fs = require("node:fs");
const JP = JSON.stringify, clP = (x) => JSON.parse(JP(x));
const RAW = JSON.parse(fs.readFileSync("/tmp/rig174/live.json", "utf8"));
const E = {};
for (const n of ["fix4b", "fix4", "main"]) E[n] = require(`/tmp/rig174/engine-${n}.cjs`).__test;
let pass = 0, fail = 0;
const ok = (c, name) => { c ? pass++ : fail++; console.log((c ? "PASS" : "FAIL") + " — " + name); };
const counts = (s) => ({ reads: (s.reads || []).length, nights: Object.keys((s.sleep && s.sleep.nights) || {}).length, dailyLogs: Object.keys(s.dailyLogs || {}).length,
  sessionLog: Object.keys(s.sessionLog || {}).length, queue: (s.queue || []).length, feed: (s.feed || []).length,
  earned: (s.feed || []).filter((f) => f && / EARNED$/.test(String(f.t || ""))).length,
  debuts: (s.queue || []).filter((q) => q && q.kind === "debut").length, pendingDebuts: (s.queue || []).filter((q) => q && q.kind === "debut" && !q.done).length,
  volume: (s.feed || []).filter((f) => f && String(f.t || "").indexOf("VOLUME ") === 0).length });
const norm = (a, w) => { const t = a && a.topAt != null ? a.topAt : null, r = (a && a.topRun) || 0; return (r === 0 || String(t) !== String(w)) ? JP([null, 0]) : JP([t, r]); };
const g = (s, id) => (s.exercises || []).find((x) => x.id === id);

console.log("== R1 — counts law on the live blob (raw → migrate on each engine)");
const c0 = counts(RAW); console.log("   raw:", JP(c0));
const M = {};
for (const n of ["fix4b", "fix4", "main"]) { M[n] = E[n].migrate(clP(RAW)); console.log("   " + n + ":", JP(counts(M[n])), "v=" + M[n].v); }
for (const n of ["fix4b", "fix4"]) {
  const c = counts(M[n]);
  ok(c.reads === c0.reads && c.nights === c0.nights && c.dailyLogs === c0.dailyLogs && c.sessionLog === c0.sessionLog && c.queue === c0.queue && c.earned === c0.earned && c.debuts === c0.debuts,
    n + " — counts held through migrate: reads/nights/dailyLogs/sessionLog/queue equal, EARNED " + c0.earned + "→" + c.earned + ", debuts " + c0.debuts + "→" + c.debuts + " (feed " + c0.feed + "→" + c.feed + ")");
}

console.log("\n== R2 — the name family per lift (fix4b _formerNames) and the INPUT truth of old-name receipts");
const fam = {}; for (const ex of M.fix4b.exercises) fam[ex.id] = E.fix4b._formerNames(ex);
for (const id of ["rearDelt", "curl", "sulek", "abs", "hanging", "rows"]) console.log("   " + id.padEnd(9), JP(fam[id]));
/* INPUT truth: every VOLUME line's "via <name>" and every EARNED line's leading name, vs the CURRENT names */
const curNames = new Set(M.fix4b.exercises.map((x) => String(x.n)));
const viaOf = (t) => { const i = t.indexOf("via "); return i < 0 ? null : t.slice(i + 4).trim(); };
const oldVol = (RAW.feed || []).filter((f) => f && String(f.t || "").indexOf("VOLUME ") === 0 && viaOf(f.t) && ![...curNames].some((n) => viaOf(f.t).indexOf(n) === 0));
const oldEarn = (RAW.feed || []).filter((f) => f && / EARNED$/.test(String(f.t || "")) && ![...curNames].some((n) => String(f.t).indexOf(n.toUpperCase()) === 0));
console.log("   VOLUME lines whose via-name is NOT a current name:", JP(oldVol.map((f) => [f.d, f.t])));
console.log("   EARNED lines whose leading name is NOT a current name:", JP(oldEarn.map((f) => [f.d, f.t])));
/* the PRE-FIX family, from INPUTS: ex.n + forks[].prevN (renames[].from was a date and matched nothing) */
const preFam = {}; for (const ex of M.fix4b.exercises) preFam[ex.id] = [String(ex.n)].concat(((ex.forks) || []).filter((f) => f && f.prevN).map((f) => String(f.prevN)));
const preReach = (f) => M.fix4b.exercises.filter((x) => preFam[x.id].some((n) => (String(f.t).indexOf("via " + n) > -1) || (/ EARNED$/.test(f.t) && String(f.t).indexOf(n.toUpperCase()) === 0)));
const invisiblePre = oldVol.concat(oldEarn).filter((f) => preReach(f).length === 0);
console.log("   INVISIBLE to the pre-fix family (ex.n + forks[].prevN):", JP(invisiblePre.map((f) => [f.d, f.t])));
ok(invisiblePre.length === 4 && oldVol.length === 4 && oldEarn.length === 1,
  "INPUT — five receipts sit under former names; FOUR were invisible pre-fix (curl 8/09, rearDelt 8/07, abs 8/09, abs 7/21 EARNED) and one (rows 8/09) was reachable only through a fork's prevN (observed " + invisiblePre.length + " invisible of " + (oldVol.length + oldEarn.length) + ")");
/* and the fix4b family reaches every one of them */
const reach = (f) => M.fix4b.exercises.filter((x) => fam[x.id].some((n) => (String(f.t).indexOf("via " + n) > -1) || (/ EARNED$/.test(f.t) && String(f.t).indexOf(n.toUpperCase()) === 0)));
for (const f of oldVol.concat(oldEarn)) { const r = reach(f); console.log("   reach:", f.d, JP(f.t), "→", JP(r.map((x) => x.id))); }
ok(oldVol.concat(oldEarn).every((f) => reach(f).length === 1), "fix4b — each former-name receipt is reached by EXACTLY ONE lift's name family (no orphan, no double attribution)");

console.log("\n== R3 — _volDeltas on fix4b: curl 8/09, rearDelt 8/07, abs 8/09 now counted");
for (const [id, d] of [["curl", "2026-08-09"], ["rearDelt", "2026-08-07"], ["abs", "2026-08-09"]]) {
  const dv = E.fix4b._volDeltas(g(M.fix4b, id), M.fix4b);
  ok(dv.some((p) => String(p[0]) === d && p[1] > 0), "fix4b _volDeltas(" + id + ") counts the " + d + " push (observed " + JP(dv) + ")");
}

console.log("\n== R4 — records: stored vs derived on fix4b AND fix4 (nothing he sees moves; drift set = [abs])");
const drift = {}, recs = {};
for (const n of ["fix4b", "fix4"]) {
  drift[n] = []; recs[n] = {};
  for (const ex of M[n].exercises) {
    if (!E[n].exActive(M[n], ex.id)) continue;
    const st = g(RAW, ex.id) || {};
    const der = E[n].deriveSighting(M[n], ex);
    recs[n][ex.id] = norm(der, ex.w);
    if (norm(st, ex.w) !== norm(der, ex.w)) drift[n].push(ex.id + ":" + norm(st, ex.w) + "→" + norm(der, ex.w));
  }
  console.log("   " + n + " drift:", JP(drift[n]));
}
ok(JP(recs.fix4b) === JP(recs.fix4), "fix4b derives the SAME record as fix4 for every active lift on the live blob (the receipts becoming visible changes nothing he sees) " + JP(recs.fix4b));
ok(drift.fix4b.length === 1 && drift.fix4b[0].indexOf("abs:") === 0, "fix4b — the only stored≠derived lift is abs, the A6-enumerated legacy drift (observed " + JP(drift.fix4b) + ")");

console.log("\n== R5 — targets per lift: fix4b vs fix4 (identical) and vs deployed main (deltas listed)");
const tg = {};
for (const n of ["fix4b", "fix4", "main"]) { tg[n] = {}; for (const ex of M[n].exercises) { if (!E[n].exActive(M[n], ex.id)) continue; try { tg[n][ex.id] = [ex.w, E[n].targetsFor(ex, M[n])]; } catch (e) { tg[n][ex.id] = "THREW " + e.message; } } }
ok(JP(tg.fix4b) === JP(tg.fix4), "fix4b targets byte-identical to fix4 on the live blob");
const dm = Object.keys(tg.fix4b).filter((id) => JP(tg.fix4b[id]) !== JP(tg.main[id]));
console.log("   vs deployed main — lifts whose (load, targets) differ:", dm.length);
for (const id of dm) console.log("     " + id.padEnd(10), "main", JP(tg.main[id]), "→ tip", JP(tg.fix4b[id]));
console.log("   unchanged:", JP(Object.keys(tg.fix4b).filter((id) => dm.indexOf(id) < 0)));

console.log("\n== R6 — merge-with-self on fix4b (zero mints, records unchanged, queue count held)");
{
  const a = clP(M.fix4b), b = clP(M.fix4b); delete b._dictionary;
  const m = E.fix4b.mergeState(a, b);
  const cm = counts(m), ca = counts(M.fix4b);
  ok(cm.earned === ca.earned && cm.debuts === ca.debuts && cm.queue === ca.queue, "merge(m,m) mints nothing: EARNED " + ca.earned + "→" + cm.earned + ", debuts " + ca.debuts + "→" + cm.debuts + ", queue " + ca.queue + "→" + cm.queue);
  const rm = {}; for (const ex of m.exercises) if (E.fix4b.exActive(m, ex.id)) rm[ex.id] = norm(ex, ex.w);
  const ra = {}; for (const ex of M.fix4b.exercises) if (E.fix4b.exActive(M.fix4b, ex.id)) ra[ex.id] = norm(ex, ex.w);
  ok(JP(rm) === JP(ra), "merge(m,m) leaves every stored record unchanged");
  const bo = E.fix4b.migrate(clP(m)); const cb = counts(bo);
  ok(cb.earned === ca.earned && cb.debuts === ca.debuts, "boot after merge(m,m) still mints nothing (EARNED " + cb.earned + ", debuts " + cb.debuts + ")");
}

console.log("\n== R7 — RED-FIRST: the earn→rename→top→BOOT witness on the PRE-FIX engine vs the tip");
const witness = (T) => {
  const mk = () => { const s9 = T.migrate(null); const ex = s9.exercises.find((x) => x.id === "press");
    ex.forks = []; ex.std = null; ex.own = false; ex.reclaim = null; ex.ladder = null; ex.w = 250; ex.sets = 2; ex.hi = 9; ex.last = [9, 9]; ex.inc = 5; ex.topAt = null; ex.topRun = 0;
    ex.lastMeta = { d: "2026-08-16", w: 250, reps: [9, 9] }; s9.queue = []; s9.feed = []; return s9; };
  const top = (s9, d9) => T.completeSession(s9, d9, [{ id: "press", w: 250, tgt: [9, 9], reps: [9, 9], rir: 2, rirSets: [2, 0] }], { clean: true, last: { h: 8 }, mean3: 8 }, { pg: 52 }).s;
  const v = (s9) => { const e9 = s9.exercises.find((x) => x.id === "press"); return { rec: [e9.topAt == null ? null : e9.topAt, e9.topRun || 0],
    earned: (s9.feed || []).filter((f) => f && / EARNED$/.test(String(f.t || ""))).length, debut: (s9.queue || []).filter((q) => q && q.exId === "press" && q.kind === "debut" && !q.done).length }; };
  let n9 = top(top(mk(), "2026-08-18"), "2026-08-20");
  const ex = n9.exercises.find((x) => x.id === "press");
  ex.renames = [{ from: "2026-08-22", prevN: ex.n }]; ex.n = "Overhead press (Prime)"; ex.lastMeta = { d: "2026-08-20", w: 250, reps: [9, 9] };
  n9 = top(n9, "2026-08-24");
  const booted = T.migrate(clP(n9));
  const more = top(clP(booted), "2026-08-26");
  return { afterEarn: v(n9), booted: v(booted), nextTop: v(more) };
};
const wPre = witness(E.fix4), wTip = witness(E.fix4b);
console.log("   pre-fix 7ff2c62:", JP(wPre)); console.log("   tip 66bc7c3:   ", JP(wTip));
ok(JP(wPre.booted.rec) === JP([250, 3]) && JP(wPre.nextTop.rec) === JP([250, 4]), "RED on the pre-fix engine — a plain boot inflates the spent record to 250/3 and the next top to 250/4 (observed " + JP(wPre.booted.rec) + " / " + JP(wPre.nextTop.rec) + ")");
ok(JP(wTip.booted) === JP({ rec: [250, 1], earned: 1, debut: 1 }) && JP(wTip.nextTop) === JP({ rec: [250, 2], earned: 1, debut: 1 }), "GREEN at the tip — boot keeps 250/1, next top is sighting TWO, one earn receipt, one debut (observed " + JP(wTip.booted) + " / " + JP(wTip.nextTop) + ")");

console.log("\n== R8 — HUNT: cross-attribution census — can one feed line be claimed by two lifts' name families?");
{
  const claims = new Map();
  for (const f of (M.fix4b.feed || [])) {
    if (!f || typeof f.t !== "string") continue;
    const isVol = f.t.indexOf("VOLUME ") === 0, isEarn = / EARNED$/.test(f.t);
    if (!isVol && !isEarn) continue;
    const who = M.fix4b.exercises.filter((x) => fam[x.id].some((n) => isVol ? f.t.indexOf("via " + n) > -1 : f.t.indexOf(n.toUpperCase()) === 0)).map((x) => x.id);
    if (who.length > 1) claims.set(f.d + " " + f.t, who);
  }
  console.log("   lines claimed by >1 lift:", claims.size, claims.size ? JP([...claims]) : "");
  /* and the structural risk: is any lift's family name a PREFIX of another lift's family name? */
  const pre = [];
  for (const a of M.fix4b.exercises) for (const b of M.fix4b.exercises) { if (a.id === b.id) continue;
    for (const na of fam[a.id]) for (const nb of fam[b.id]) if (nb.toUpperCase().indexOf(na.toUpperCase()) === 0) pre.push(a.id + ":" + JP(na) + " ⊂ " + b.id + ":" + JP(nb)); }
  console.log("   prefix collisions between families:", pre.length, pre.length ? JP(pre) : "");
  ok(claims.size === 0, "no live feed line is claimed by two lifts (observed " + claims.size + ")");
  ok(pre.length === 0, "no lift's family name is a prefix of another lift's family name on the live roster (observed " + JP(pre) + ")");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
