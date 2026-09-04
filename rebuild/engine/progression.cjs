'use strict';

// Frozen v7.56.0 function bodies; cross-module calls resolve through this engine's E.
module.exports = function createProgression(E, { clock, ids }) {
const { DAY, PACE, LADDER_MIN_N, PUBLISHED_SET_SEM, T_CRIT_95, TREND_WINDOW, TREND_MIN_SESSIONS, TREND_MIN_LIFTS, TREND_SE_FLOOR, TREND_CLEAN_MIN_SESSIONS, FLAT_HALFWIDTH, DEBT_LAST_H, DEBT_MEAN3_H } = E;
const mk = (...args) => E.mk(...args);
const isoOf = (...args) => E.isoOf(...args);
const todayStart = (...args) => E.todayStart(...args);
const eraFresh = (...args) => E.eraFresh(...args);
const forksOf = (...args) => E.forksOf(...args);
const sameEra = (...args) => E.sameEra(...args);
const resetForksOf = (...args) => E.resetForksOf(...args);
const exActive = (...args) => E.exActive(...args);
const dayType = (...args) => E.dayType(...args);
const cleanAtDate = (...args) => E.cleanAtDate(...args);
const dayWeather = (...args) => E.dayWeather(...args);

// Copied from frozen src/app.jsx @ fe516c1:926-959.
function progressStep(ex, s) {
  /* Q8b (PROGRESSION-1) — THE HOLD HOLDS THE LOAD, NOT THE REPS. This early return zeroed
     the rep step too, so a held lift was prescribed its own last line and the instrument the
     governor is waiting for — an honest opener at a climbing target — was never asked for.
     The hold keeps blocking the automatic load earn (earnWalk), the two-grind-opener trigger
     and the opener->=1 release are untouched, and rirPlan still clamps the OPENER to two in
     reserve; the rep step reads the delivered line's terminal RIR as normal. Witness: abs's
     08-10 card was held at [14,12,14]; the ruled card is [14,13,14], which is what he
     delivered. */
  /* FIX 3c — no step sizes off a cross-era comparison: the last known numbers
     prescribe as a baseline plan, and progression resumes from what the new
     era's own first session says. One era's worth of patience, bought by his
     own ruled protocol change. */
  if (s && eraFresh(s, ex.id)) return { add: 0, why: "new baseline — the setup changed, so the first session under it sets the line; steps resume from what it says" };
  /* v7.53.0 JOB 1 — the U1 flat-freeze is RETIRED with the failure A/B (Joe's
     ruling, before a single session ran under it). Progression is RIR-driven on
     every lift again; a stray lift_pair trial on an unsynced device can no
     longer freeze what he lifts. */
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

// Copied from frozen src/app.jsx @ fe516c1:970-995.
function progressAnchor(ex, s) {
  /* SPLIT item h — THE STALE-ANCHOR FIX. Non-numeric configs ("55·55·50",
     "hold", "BW") log entries with en.w null, so the same-load test below
     could never match and the anchor silently fell to a stale fill (curl
     prescribed [9,8,7] on the live record against an honest [11,10,10,9] four
     days old). Entries now carry wKey = String(config) at log time; a
     non-numeric config anchors ONLY on its own wKey; legacy null/string
     entries never match and the fallback stays ex.last. */
  const base = (ex.last || []).slice();
  if (!s || !base.length) return base;
  const numericCfg = typeof ex.w === "number";
  const days9 = Object.keys(s.sessionLog || {}).sort();
  const fkA = forksOf(s, ex.id);
  const atA = isoOf(todayStart());
  for (let i = days9.length - 1; i >= 0; i--) {
    if (!sameEra(fkA, days9[i], atA)) continue;   /* FIX 3c — an anchor from another technique era anchors nothing */
    const sl = s.sessionLog[days9[i]];
    if (paceRushed(sl)) continue;
    const en = (sl.entries || []).find((x) => x.id === ex.id);
    if (!en || !en.reps || !en.reps.length) continue;
    if (numericCfg) { if (String(en.w) !== String(ex.w)) continue; }
    else { if (en.wKey !== String(ex.w)) continue; }
    return en.reps.slice();
  }
  return base;
}

// Copied from frozen src/app.jsx @ fe516c1:1003-1005.
function maxedOut(ex) {
  return typeof ex.w === "number" && ex.hi != null && nextLoad(ex) == null;
}

// Copied from frozen src/app.jsx @ fe516c1:1019-1022.
function _padFrom9(arr, hi) {
  for (let i = arr.length - 1; i >= 0; i--) { const v = arr[i]; if (typeof v === "number" && v > 0) return v; }
  return hi - 2;
}

// Copied from frozen src/app.jsx @ fe516c1:1034-1046.
function _loadTenure(ex, s, ref, fks) {
  const all9 = [];
  for (const d9 of Object.keys((s && s.sessionLog) || {}).sort()) {
    if (ref != null && d9 > String(ref)) continue;
    if (fks && fks.length && !sameEra(fks, d9, ref)) continue;
    const en9 = (((s.sessionLog[d9] || {}).entries) || []).find((e9) => e9 && e9.id === ex.id && Array.isArray(e9.reps) && e9.reps.length);
    if (en9) all9.push([d9, en9]);
  }
  const key9 = String(ex.w);
  let i0 = all9.length;
  while (i0 > 0 && String(all9[i0 - 1][1].w != null ? all9[i0 - 1][1].w : all9[i0 - 1][1].wKey) === key9) i0--;
  return { all: all9, tenure: all9.slice(i0) };
}

// Copied from frozen src/app.jsx @ fe516c1:1064-1070.
function _formerNames(ex) {
  const out9 = new Set([String((ex && ex.n) || "")]);
  for (const f9 of (((ex && ex.forks)) || [])) if (f9 && f9.prevN) out9.add(String(f9.prevN));
  for (const r9 of (((ex && ex.renames)) || [])) if (r9 && r9.prevN) out9.add(String(r9.prevN));
  out9.delete("");
  return [...out9];
}

// Copied from frozen src/app.jsx @ fe516c1:1071-1087.
function _volDeltas(ex, s) {
  const names9 = _formerNames(ex);
  const out9 = [];
  for (const f9 of ((s && s.feed) || [])) {
    if (!f9 || typeof f9.t !== "string" || f9.t.indexOf("VOLUME ") !== 0) continue;
    let named9 = false;
    for (const n9 of names9) if (n9 && f9.t.indexOf("via " + n9) > -1) named9 = true;
    if (!named9) continue;
    const body9 = f9.t.slice(7).trim();
    const sign9 = body9.charAt(0) === "+" ? 1 : (body9.charAt(0) === "-" || body9.charAt(0) === "\u2212") ? -1 : 0;
    if (!sign9) continue;
    const mag9 = parseInt(body9.slice(1), 10);
    if (!isFinite(mag9) || mag9 <= 0) continue;
    out9.push([String(f9.d || ""), sign9 * mag9]);
  }
  return out9;
}

// Copied from frozen src/app.jsx @ fe516c1:1098-1112.
function _setsAtTime(baseSets, deltas, d) {
  /* FIX-4c §1 (Sol PACK-3, rig185 W1) — THE SAME-DAY MAXIMUM IS THE END-OF-DAY COUNT PLUS THE
     SAME-DAY DECREASES, NEVER PLUS THE INCREASES. The count walked back to the end of day d
     already INCLUDES every push filed on d, so adding a same-day +1 counted it twice: a +1
     with the lift at four read five, a count the lift never carried that day. And a same-day
     -1 was invisible: with the lift at three, the -1 says it was FOUR before the undo, so the
     maximum that day was four, and a three-set line proves nothing. The balanced +1/-1 case
     read five either way, which is the only case the old pin covered. */
  let end9 = baseSets, dec9 = 0;
  for (const p9 of (deltas || [])) {
    if (p9[0] > String(d)) end9 -= p9[1];
    else if (p9[0] === String(d) && p9[1] < 0) dec9 += -p9[1];
  }
  return Math.max(1, end9 + dec9);
}

// Copied from frozen src/app.jsx @ fe516c1:1113-1159.
function targetsFor(ex, s) {
  /* OWNER'S CALL rider — std/reclaim are AUTHORED target arrays sized for the set count
     they were written at. A set-count change must not silently shrink or crash the
     session: pad to ex.sets one rep under the last authored slot (the same rule the
     anchor path uses below), truncate when sets fall. The own-hold survives — the
     authored slots are untouched; the added slot banks whatever it gives. Identity on
     every current lift (each std/reclaim already matches its ex.sets), asserted. */
  const fitN = (arr) => { const t9 = arr.slice(0, ex.sets); while (t9.length < ex.sets) t9.push(Math.max(1, _padFrom9(t9, ex.hi) - 1)); return t9; };
  if (ex.std) return fitN(ex.std);
  if (ex.reclaim) return fitN(ex.reclaim);
  if (!ex.last) return (ex.first || Array(ex.sets).fill(Math.max(1, ex.hi - 2))).slice();
  const t = progressAnchor(ex, s).slice(0, ex.sets);
  while (t.length < ex.sets) t.push(Math.max(1, _padFrom9(t, ex.hi) - 1));
  const { add } = progressStep(ex, s);
  const cap9 = maxedOut(ex) ? Infinity : ex.hi;   /* MAXED-LADDER — reps are the ladder past the top of a maxed stack */
  /* Q7a (PROGRESSION-1, order G): climb TOWARD the shape the earn accepts — atTopOfWindow's
     taper (r[0] >= hi, r[i] >= hi - i) — never toward flat. A dropped set fills only while it is
     below the set before it AND below its own taper ceiling; the opener goes last, so the
     2-RIR opener is never the set asked to carry the climb. A line that already IS the taper
     eats the add and repeats until its sighting confirms. On a maxed ladder every ceiling is
     Infinity and the loop is byte-identical to the old one. Executed on the live ledger: the
     shipped loop took an 87.5 lateral debut through TEN chases to [15,14,14,14,14] — about six
     reps at a load the window never asked for — while the top was four reps away; this reaches
     it in four. C15: the add is distributed over the PROGRESSION-BEARING PREFIX only; slots a
     later volume push added keep their delivered floor and bank without gating this load. */
  const pref9 = progressionSetCount(ex, s);
  const ceilI = (i) => maxedOut(ex) ? Infinity : ex.hi - i;
  for (let n = 0; n < add; n++) {
    let idx = -1;
    for (let i = 1; i < Math.min(t.length, pref9); i++) if (t[i] < t[i - 1] && t[i] < ceilI(i)) { idx = i; break; }
    if (idx === -1 && t[0] < cap9 && t[0] < ceilI(0)) idx = 0;
    if (idx < 0) break;
    t[idx] = Math.min(cap9, t[idx] + 1);
  }
  /* THE LAW, mechanized for the whole roster: at UNCHANGED load the final targets floor at
     the same set's delivered reps — the sweep caught abs (a RUNGED lift) delivering past
     hi and then being prescribed below it, the same contradiction in a second costume.
     hi keeps its load-jump job (the earn line is untouched); it just can never REGRESS
     the card: a runged lift at the top repeats its own delivered line until the debut. */
  /* THE LAW + P1 PRECEDENCE: never prescribe below the last COMPARABLE delivered
     line — the SAME single-session line the anchor is (protocol-valid: a rushed
     session cannot floor a target), reversible by construction (it rolls with the
     line). This floor is the ONLY thing that may hold a target above the anchor,
     and on a maxed ladder it is what keeps reps the ladder. */
  const floor9 = progressAnchor(ex, s);
  return t.map((r, i) => { const c9 = Math.min(cap9, r); return (floor9[i] != null) ? Math.max(c9, floor9[i]) : c9; });
}

// Copied from frozen src/app.jsx @ fe516c1:1196-1229.
function proposeLadder(s, exId) {
  const ex = s && s.exercises ? s.exercises.find((e) => e && e.id === exId) : null;
  if (!ex) return null;
  if (Array.isArray(ex.steps) && ex.steps.length >= 2) return null;        // already has a ladder
  if (typeof ex.w !== "number") return null;                                // see [needs Joe] Q2·F
  const seen = [];
  for (const d of Object.keys((s && s.sessionLog) || {})) {
    for (const en of (s.sessionLog[d].entries || [])) {
      if (en && en.id === exId && typeof en.w === "number" && isFinite(en.w) && en.w > 0 && !seen.includes(en.w)) seen.push(en.w);
    }
  }
  if (typeof ex.w === "number" && !seen.includes(ex.w)) seen.push(ex.w);
  const rungs = seen.sort((a, b) => a - b);
  if (rungs.length < LADDER_MIN_N) return null;
  const gaps = rungs.slice(1).map((x, i2) => +(x - rungs[i2]).toFixed(2));
  const inc = +(ex.inc || 0);
  /* EVENNESS — this used to test whether every gap EQUALS inc, and that is wrong in a way
     that makes real weights unreachable. Given 80, 90, 100, 110 on a stack whose authored
     step is 5, equality sees uneven gaps and proposes [80,90,100,110] as the ladder — which
     tells nextLoad that 85, 95 and 105 do not exist. His next jump doubles from 5 lb to 10,
     and deloadLoad loses half its options on the way down.

     The old comment defending it — “a gap the machine can make but he has never selected
     stays absent, which is the honest state” — is the part that was wrong. A ladder is a
     claim about what the MACHINE CAN PRODUCE, not about what he has chosen. When every
     observed gap is a clean multiple of the authored step, the step is direct evidence the
     intermediate weights exist, and discarding it asserts something false.

     So: uneven means some gap is NOT a whole multiple of inc. A sparsely-sampled even stack
     proposes nothing, which is the correct silence. */
  const uneven = inc > 0 && gaps.some((g) => Math.abs(g / inc - Math.round(g / inc)) > 1e-6);
  if (!uneven) return null;                                                  // an even stack: proposing it changes nothing
  return { exId, n: ex.n, rungs, gaps, n_obs: rungs.length, inc, uneven: true };
}

// Copied from frozen src/app.jsx @ fe516c1:1258-1262.
function loadRungs(ex) {
  const r = Array.isArray(ex && ex.steps) ? ex.steps.map(Number).filter((x) => isFinite(x) && x > 0) : [];
  if (r.length < 2) return null;
  return [...new Set(r)].sort((a, b) => a - b);
}

// Copied from frozen src/app.jsx @ fe516c1:1271-1274.
function debutDebit(from9, to9) {
  if (!(typeof from9 === "number" && typeof to9 === "number" && from9 > 0 && to9 > from9)) return 1;
  return Math.max(1, Math.round(100 * (to9 - from9) / from9 / 5));
}

// Copied from frozen src/app.jsx @ fe516c1:1275-1287.
function nextLoad(ex, from) {
  /* C6 (PROGRESSION-1) — a MISSING load is not a load of zero. Number(null) and
     Number("") are both 0, so a lift with no working weight on file reported a next
     load of `inc` — the live hip thrust, never performed, advertised "5". Absent is
     absent: the card shows no next load until a real one lands. */
  const raw9 = from != null ? from : ex.w;
  if (raw9 == null || raw9 === "") return null;
  const w = Number(raw9);
  if (!isFinite(w)) return null;
  const rungs = loadRungs(ex);
  if (rungs) { const up = rungs.find((x) => x > w); return up == null ? null : up; }
  return ex.inc ? +(w + ex.inc).toFixed(2) : null;
}

// Copied from frozen src/app.jsx @ fe516c1:1289-1298.
function prevLoad(ex, from) {
  /* C6 — the same guard on the way down: RESET must not invent a weight either. */
  const raw9 = from != null ? from : ex.w;
  if (raw9 == null || raw9 === "") return null;
  const w = Number(raw9);
  if (!isFinite(w)) return null;
  const rungs = loadRungs(ex);
  if (rungs) { const down = rungs.filter((x) => x < w); return down.length ? down[down.length - 1] : null; }
  return ex.inc ? Math.max(ex.inc, +(w - ex.inc).toFixed(2)) : null;
}

// Copied from frozen src/app.jsx @ fe516c1:1300-1305.
function snapLoad(ex, w) {
  const rungs = loadRungs(ex);
  if (!rungs) return w;
  const at = rungs.filter((x) => x <= w);
  return at.length ? at[at.length - 1] : rungs[0];
}

// Copied from frozen src/app.jsx @ fe516c1:1310-1319.
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

// Copied from frozen src/app.jsx @ fe516c1:1321-1324.
function parseRungs(text) {
  const r = String(text || "").split(/[^0-9.]+/).map(Number).filter((x) => isFinite(x) && x > 0);
  return r.length >= 2 ? [...new Set(r)].sort((a, b) => a - b) : null;
}

// Copied from frozen src/app.jsx @ fe516c1:1376-1385.
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

// Copied from frozen src/app.jsx @ fe516c1:1387-1396.
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

// Copied from frozen src/app.jsx @ fe516c1:1398-1401.
function coarseLifts(s) {
  return (s.exercises || []).filter((e) => exActive(s, e.id)).map((e) => ({ e, w: windowFor(e) })).filter((x) => x.w.derived && x.w.tight)   /* FIX split-1 (P1-1): a retired lift's plates are nobody's problem — the migrated microload note named pronated */
    .map((x) => ({ id: x.e.id, n: x.e.n, w: x.e.w, step: x.w.step, pct: x.w.pct, lost: x.w.lost, hi: x.e.hi, lo: x.w.lo }));
}

// Copied from frozen src/app.jsx @ fe516c1:1414-1457.
function progressionSetCount(ex, s, through) {
  try {
    if (!ex || !ex.sets) return (ex && ex.sets) || 0;
    if (maxedOut(ex)) return ex.sets;
    if (ex.w == null || ex.w === "") return ex.sets;
    const key9 = String(ex.w);
    const fks9 = resetForksOf(s, ex.id);
    const ref9 = through || isoOf(todayStart());
    const tenure9 = _loadTenure(ex, s, ref9, fks9).tenure;   /* the contiguous run at the current load */
    /* A5 (Sol, FIX-2) — THE PREFIX COMES FROM THE CURRENT TENURE, NOT THE EARLIEST SIGHTING OF
       THE LOAD. Taking the first-ever entry at this load reached back past an intervening
       deload: press ran 250 at three sets, grew to four, dropped to 245 and came back to 250 —
       and the prefix was still 3, so the climb went to the opener and a genuine four-set top
       could not read as one. The tenure is the maximal contiguous suffix of THIS lift's entries
       whose load key is the current load; an off-load session of this lift ends the previous
       tenure (other lifts are irrelevant).
       AND THE ESTABLISHING LINE MUST BE COMPLETE. A partial entry — one set logged of four —
       would otherwise establish a prefix of 1, and [9,1,1,1] would read as a top of window. An
       entry establishes only if it carries at least ex.sets reps, OR a volume receipt for this
       lift is dated after it (proof the set count grew later — T20's own case: 250's first line
       precedes the push). Otherwise take the next tenure entry that does; if none does, every
       set is progression-bearing, which is the conservative answer. */
    if (!tenure9.length) return ex.sets;
    /* FIX-3 §1 — AND "COMPLETE" MEANS COMPLETE AT ITS OWN TIME. FIX-2 exempted a short line
       whenever any volume receipt was dated after it, which exempts ANY short line however
       short: a bare [9] opener at a new load, with one push happening to follow it, established
       a prefix of 1 and [9,1,1,1] read as a top of the window. The set count the lift carried on
       a past day is not a guess — it is ex.sets walked back through the volume receipts filed
       since. So: setsAtTime(d) = ex.sets minus the deltas dated after d, and an entry establishes
       iff it carries at least that many reps. T20 is unchanged (250's first line is three long
       and one push followed it, so setsAtTime is 3 and 3 >= 3), and a delivered ZERO still
       counts toward the length — it was a set that was part of the test, which is the same
       ruling A8 makes about the pad.
       BOTH MINUS SPELLINGS ARE ON FILE: the agent lane writes U+2212 ("VOLUME −1") and the
       analyst lane interpolates a negative number ("VOLUME -1"), so the sign is read from
       either. A decline ("VOLUME PASSED") carries no "via" and no sign, and is not a move. */
    const volDeltas9 = _volDeltas(ex, s);
    const setsAtTime9 = (d9) => _setsAtTime(ex.sets, volDeltas9, d9);
    for (const [d9, en9] of tenure9) {
      if (en9.reps.length >= setsAtTime9(d9)) return Math.min(ex.sets, en9.reps.length);
    }
  } catch (e) {}
  return ex.sets;
}

// Copied from frozen src/app.jsx @ fe516c1:1458-1468.
function atTopOfWindow(reps, ex, s, through) {
  /* Q8c — judged on the progression-bearing prefix, not on every configured set. */
  const pref9 = s ? progressionSetCount(ex, s, through) : ex.sets;
  const r = (reps || []).slice(0, pref9);
  if (r.length < pref9) return false;
  /* MAXED-LADDER — on a maxed stack the window top is the MOVING DELIVERED CEILING (the
     best opener on file), so the two-sightings discipline, the hot-guard and the banked
     records keep their meaning above the old hi instead of going dark at it. */
  const top9 = maxedOut(ex) ? Math.max(ex.hi, ((ex.last || [])[0] || ex.hi)) : ex.hi;
  return r[0] >= top9 && r.every((x, i) => x >= top9 - i);
}

// Copied from frozen src/app.jsx @ fe516c1:1649-1657.
function buildRirSets(en, n) {
  const len = n != null ? n : ((en && en.reps) || []).length;
  if (!len) return [];
  const arr = new Array(len).fill(null);
  if (len === 1) { arr[0] = en.rirEnd != null ? en.rirEnd : (en.rir != null ? en.rir : null); return arr; }
  if (en.rir != null) arr[0] = en.rir;
  if (en.rirEnd != null) arr[len - 1] = en.rirEnd;
  return arr;
}

// Copied from frozen src/app.jsx @ fe516c1:1664-1677.
function deriveLastMeta(s, exId) {
  const log = (s && s.sessionLog) || {};
  const days = Object.keys(log).sort();                       // insertion order is not date order
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i], rec = log[d] || {};
    const en = (rec.entries || []).find((e) => e && e.id === exId);
    if (!en || !Array.isArray(en.reps) || !en.reps.length) continue;
    const prev = ((s.exercises || []).find((e) => e && e.id === exId) || {}).lastMeta || {};
    let debt = prev.d === d ? !!prev.debt : false;
    if (prev.d !== d) { try { debt = !cleanAtDate(s, d); } catch (e) { debt = false; } }   /* cleanAtDate returns a BOOLEAN. Shipped as .clean in v7.10.0, so !undefined forced debt TRUE on every re-derive after a correction. Every other call site treats it as a boolean. */
    return { d, w: en.w, reps: en.reps.slice(), rir: en.rir ?? null, rirSets: rirSetsOf(en), debt };
  }
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:1679-1686.
function rirSetsOf(en) {
  if (!en) return [];
  const len = (en.reps || []).length;
  const arr = Array.isArray(en.rirSets) ? en.rirSets.slice(0, len) : [];
  while (arr.length < len) arr.push(null);
  if (len && arr[0] == null && en.rir != null) arr[0] = en.rir;
  return arr;
}

// Copied from frozen src/app.jsx @ fe516c1:1704-1711.
function rirReceipt(en) {
  const arr = rirSetsOf(en);
  if (!arr.length) return null;
  const open = arr[0], last = arr[arr.length - 1];
  if (arr.length === 1) return open == null ? null : "RIR " + open;
  if (open == null && last == null) return null;
  return "RIR " + (open == null ? "?" : open) + "→" + (last == null ? "?" : last);
}

// Copied from frozen src/app.jsx @ fe516c1:1738-1738.
function paceRushed(sl) { return !!sl && sl.pace === PACE.rushed; }

// Copied from frozen src/app.jsx @ fe516c1:1740-1740.
function openerRir(en) { const a = rirSetsOf(en); return a.length ? a[0] : null; }

// Copied from frozen src/app.jsx @ fe516c1:1742-1742.
function terminalRir(en) { const a = rirSetsOf(en); return a.length ? a[a.length - 1] : null; }

// Copied from frozen src/app.jsx @ fe516c1:2130-2160.
function typicalError(s, exId, asOf) {
  const byId = {};
  const at9 = asOf || isoOf(todayStart());   /* v7.53.0 (b) — no date means "now", and now belongs to whichever era today is in */
  const fkCache = {};
  const fkOf = (id9) => (id9 in fkCache ? fkCache[id9] : (fkCache[id9] = forksOf(s, id9)));
  Object.keys((s && s.sessionLog) || {}).sort().forEach((d) =>
    ((s.sessionLog[d] || {}).entries || []).forEach((e) => {
      if (!(e && e.reps && e.reps.length)) return;
      if (!sameEra(fkOf(e.id), d, at9)) return;   /* v7.53.0 (b) — pairs from a different technique era are a different lift's noise */
      (byId[e.id] = byId[e.id] || []).push(e);
    }));
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

// Copied from frozen src/app.jsx @ fe516c1:2162-2174.
function beatsNoise(s, exId, reps, prev) {
  const te = typicalError(s, exId);
  if (!prev || !prev.length || !reps || !reps.length) return { clear: false, te, margin: 0, need: 0 };
  const n = Math.min(reps.length, prev.length);
  const margin = reps.slice(0, n).reduce((a, b) => a + (Number(b) || 0), 0) - prev.slice(0, n).reduce((a, b) => a + (Number(b) || 0), 0);
  /* P3 — two standard errors of the NEW-MINUS-OLD DIFFERENCE: the old line carries
     error too, so SE(diff) = √2·TE·√n under equal independent per-set errors.
     Within-session covariance is documented as unmodeled (a LOOK item — it would
     widen this further); the old 2·TE·√n band treated the old record as noiseless
     and ran ~7.9% one-sided false-positive before selection. */
  const need = +(2 * Math.SQRT2 * te.reps * Math.sqrt(n)).toFixed(1);
  return { clear: margin >= need, te, margin, need, n };
}

// Copied from frozen src/app.jsx @ fe516c1:2220-2262.
function _deriveSightingFull(s, ex) {
  try {
    if (!ex || typeof ex.w !== "number" || !isFinite(ex.w)) return { topAt: null, topRun: 0, tops: [] };
    const names9 = _formerNames(ex).map((n9) => n9.toUpperCase());   /* FIX-4b §1 — including every renames[].prevN, or an earn filed under the old name is an invisible spend */
    const tech9 = resetForksOf(s, ex.id).slice().sort((a9, b9) => (a9.from < b9.from ? -1 : 1));
    const eraFrom9 = tech9.length ? tech9[tech9.length - 1].from : null;
    /* the walk's own receipts are the record of what it decided — an EARNED line SPENDS the
       sighting record, so the derivation starts counting after the last one */
    let lastEarn9 = null;
    for (const f9 of ((s && s.feed) || [])) {
      if (!f9 || typeof f9.t !== "string" || !/ EARNED$/.test(f9.t)) continue;
      let hit9 = false;
      for (const n9 of names9) if (f9.t.indexOf(n9) === 0) hit9 = true;
      if (hit9 && f9.d && (!lastEarn9 || String(f9.d) > String(lastEarn9))) lastEarn9 = String(f9.d);
    }
    const start9 = [eraFrom9, lastEarn9].filter((x9) => x9 != null).sort().pop() || null;
    const lt9 = _loadTenure(ex, s, null, null);
    const mine9 = lt9.all;
    const tenure9 = lt9.tenure;
    /* the era's opening session is a fact about the ERA, not about the tenure: it is found over
       the lift's whole history, so a tenure that begins later does not skip its own first day */
    const eraFirst9 = eraFrom9 != null ? ((mine9.find((p9) => p9[0] >= eraFrom9) || [null])[0]) : null;
    const volD9 = _volDeltas(ex, s);
    let topAt9 = null, topRun9 = 0; const tops9 = [];
    for (const p9 of tenure9) {
      const d9 = p9[0], en9 = p9[1];
      if (start9 != null && d9 < start9) continue;
      if (eraFirst9 != null && d9 === eraFirst9) continue;                       /* FIX 3c — the first era session banks nothing */
      if (lastEarn9 != null && d9 === lastEarn9) { topAt9 = null; topRun9 = 0; tops9.length = 0; continue; }   /* the earn day ends spent */
      const r9 = en9.reps.map((x9) => Number(x9) || 0);
      const exR9 = { ...ex, w: ex.w, sets: r9.length || ex.sets };               /* inside the tenure the load IS the current load */
      /* FIX-4 §3 — a line that was INCOMPLETE at its own time is not a sighting of anything.
         The derivation used to judge every entry against its own delivered length, which makes
         any line trivially complete — so a three-of-four session read as a top of a three-set
         window. It is judged against the count the lift actually carried that day. */
      if (r9.length < _setsAtTime(ex.sets, volD9, d9)) { topAt9 = null; topRun9 = 0; tops9.length = 0; continue; }
      if (atTopOfWindow(r9, exR9, s, d9)) { topRun9 = topRun9 + 1; topAt9 = ex.w; tops9.push(d9); }
      else { topAt9 = null; topRun9 = 0; tops9.length = 0; }                     /* fell off the top */
    }
    if (topRun9 === 0 || String(topAt9) !== String(ex.w)) return { topAt: null, topRun: 0, tops: [] };
    return { topAt: topAt9, topRun: topRun9, tops: tops9 };
  } catch (e) { return { topAt: (ex && ex.topAt) != null ? ex.topAt : null, topRun: (ex && ex.topRun) || 0, tops: [] }; }
}

// Copied from frozen src/app.jsx @ fe516c1:2263-2263.
function deriveSighting(s, ex) { const f9 = _deriveSightingFull(s, ex); return { topAt: f9.topAt, topRun: f9.topRun }; }

// Copied from frozen src/app.jsx @ fe516c1:3145-3155.
function sessionScore(entry) {
  if (!entry) return null;
  const w = Number(entry.w);
  if (entry.w == null || entry.w === "" || !isFinite(w) || w <= 0) return null;
  const reps = Array.isArray(entry.reps) ? entry.reps : null;
  if (!reps || !reps.length) return null;
  let tot = 0;
  for (const r of reps) { const n = Number(r); if (!isFinite(n)) return null; tot += n; }
  if (!(tot > 0)) return null;
  return w * tot;
}

// Copied from frozen src/app.jsx @ fe516c1:3160-3160.
function _tCrit(df) { return T_CRIT_95[df] || (df > 10 ? 1.96 + 2.7 / df : 12.706); }

// Copied from frozen src/app.jsx @ fe516c1:3182-3267.
function liftTrend(s, exId, opts) {
  const cleanOnly = !!(opts && opts.cleanOnly);
  const minN = (opts && opts.minN) || TREND_MIN_SESSIONS;
  const log = (s && s.sessionLog) || {};
  const days = Object.keys(log).sort();
  const fkT = forksOf(s, exId);
  const atT = (opts && opts.asOf) || isoOf(todayStart());   /* v7.53.0 (b) — era-aware: the trend reads the regime containing the query date */
  const pts = [];
  for (const d of days) {
    if (!sameEra(fkT, d, atT)) continue;
    const rec = log[d] || {};
    const en = (rec.entries || []).find((e) => e && e.id === exId);
    if (!en) continue;
    const sc = sessionScore(en);
    if (sc == null) continue;
    let hard = false, rushed = false, debt = false;
    try { hard = !!dayWeather(s, d).hardSession; } catch (e) { hard = false; }   /* R17 — the SESSION question, not the food one */
    try { rushed = !!paceRushed(rec); } catch (e) { rushed = false; }
    try { debt = !cleanAtDate(s, d); } catch (e) { debt = false; }
    /* EXCLUDE hard only. hard is a DATA-QUALITY flag (declared estimate day, event
       day) — the number itself is not trustworthy. rushed and short-sleep days are
       different: the number is real, the day was just harder.

       Dropping them outright STARVES THE INSTRUMENT. Measured on his ledger
       2026-08-05: 6 of 8 sessions carry debt and 3 carry hard, so the full
       exclusion set leaves at most 1 usable point per lift and progressionTrend
       can never read anything. That is not protection, it is blindness — and the
       constitution says short sleep PROTECTS, it does not punish.

       So they are KEPT here and handled downside-only in progressionTrend: a
       short-sleep or rushed session can never be what makes the verdict falling. */
    if (hard) continue;
    if (cleanOnly && (rushed || debt)) continue;   /* the DOWNGRADE test re-estimates on clean SESSIONS, which is what the comment always promised */
    pts.push({ d, y: sc, soft: rushed || debt, k: ((en.reps || []).length) });
  }
  /* AUDIT A (volume lever) — THE FEEDBACK LOOP, SEVERED AT ITS SOURCE. sessionScore is
     w x TOTAL reps, so a set-count change steps this series ~+1/oldSets instantly (2 -> 3
     sets is +50%) — far larger than any real slope, and the 6-point OLS below would read
     it as strong progression for the next ~6 sessions. Pooled at inverse-variance weight
     (a clean step leaves SMALL residuals, hence LARGE weight), that manufactured slope
     reaches progressionTrend, then regime, then the calorie decision — the R1_NOTE
     warning ("raising volume would MANUFACTURE THE SIGNAL IT MEASURES") realized as a
     self-exciting loop the moment volume became a lever. The clean re-pool cannot catch
     it: post-change sessions are neither rushed nor debt-flagged.

     So ANY set-count change starts a fresh trend window — the typicalError discipline
     (same-load AND same-set-count pairing, line ~1290) arriving at the trend layer. The
     cut reads the LOGGED series (reps.length per session), not the exercise config, so it
     is author-blind by construction: engine-proposed, user-called, and undone changes all
     land in the log as a count change, and a lookback (_stateAsOf) that cannot see
     s.exercises history still sees the honest series. Measured on his real ledger
     2026-08-07: every lift logs its designed count every session — zero blips — so this
     cut is a no-op on all live data until a set-count change actually ships. Until the
     fresh window accrues minN sessions the lift returns null and simply leaves the pool:
     abstention, not blindness. */
  const lastK = pts.length ? pts[pts.length - 1].k : 0;
  let cutAt = pts.length;
  while (cutAt > 0 && pts[cutAt - 1].k === lastK) cutAt--;
  const series = cutAt > 0 ? pts.slice(cutAt) : pts;
  const use = series.slice(-((opts && opts.window) || TREND_WINDOW));   /* opts.window — the outcome read's long horizon; default unchanged */
  const n = use.length;
  if (n < minN) return null;   /* R17 — the contract stays null-or-a-trend: a truthy stub broke every `if (t)` consumer downstream (volumeConversion read have/need as undefined). The set-aside days are reported by progressionTrend, which owns the pooled view. */
  const ys = use.map((p) => p.y);
  const my = ys.reduce((a, b) => a + b, 0) / n;
  if (!(my > 0)) return null;
  const mx = (n - 1) / 2;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (i - mx) * (i - mx); sxy += (i - mx) * (ys[i] - my); }
  if (!(sxx > 0)) return null;
  const b = sxy / sxx;
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = my + b * (i - mx); sse += (ys[i] - yh) * (ys[i] - yh); }
  const seB = Math.sqrt(Math.max(sse / (n - 2), 0) / sxx);
  const pct = (b / my) * 100;
  /* a perfect fit gives se 0, which would take infinite weight in the pooling
     below. Floor it — n=4 never earns unbounded confidence. */
  /* A perfectly straight 4-point line gives sse 0 and therefore se 0. That is not
     certainty, it is a small sample — and an se of 0 takes INFINITE weight in the
     pooling below, which turns the pooled mean into NaN. Floor it above the 3dp
     rounding the return value applies, or the floor is rounded away and the bug
     comes back silently. */
  const sePct = Math.max((seB / my) * 100, TREND_SE_FLOOR);
  const t = _tCrit(n - 2);
  const nSoft = use.filter((p) => p.soft).length;
  return { id: exId, n, nSoft, pct: +pct.toFixed(3), se: +sePct.toFixed(3), lo: +(pct - t * sePct).toFixed(3), hi: +(pct + t * sePct).toFixed(3) /* se is rounded to 3dp HERE — that is why the floor above is 0.001 and not 1e-6. A tighter floor is silently rounded back to exactly 0 by this line, and a zero se takes infinite weight in the pooling. The guard was real; the formatter erased it. */, from: use[0].d, to: use[n - 1].d, pts: use, k: lastK, resetAt: cutAt > 0 ? series[0].d : null };
}

// Copied from frozen src/app.jsx @ fe516c1:3273-3372.
function progressionTrend(s) {
  const log = (s && s.sessionLog) || {};
  const days = Object.keys(log).sort();
  const seen = [];
  for (const d of days) for (const e of (log[d].entries || [])) if (e && e.id && seen.indexOf(e.id) < 0) seen.push(e.id);
  let nExcludedNonNumeric = 0;
  const excludedIds = [];
  /* R17 — THE RECEIPT. Any session day the trend layer sets aside is named here, from
     the same predicate liftTrend uses, so a count that drops always carries its reason
     to the coach card. Silent was the failure: 3 → 0 with no sentence anywhere. */
  const setAsideDays = Object.keys(log).filter((d) => { try { return !!dayWeather(s, d).hardSession; } catch (e) { return false; } }).sort();
  const trends = [];
  for (const id of seen) {
    let any = false, scored = false;
    for (const d of days) {
      const en = (log[d].entries || []).find((e) => e && e.id === id);
      if (!en) continue;
      any = true;
      if (sessionScore(en) != null) { scored = true; break; }
    }
    if (any && !scored) { nExcludedNonNumeric++; excludedIds.push(id); continue; }
    const t = liftTrend(s, id);
    if (t) trends.push(t);
  }
  const base = { nLifts: trends.length, nExcludedNonNumeric, excludedIds, setAsideDays: setAsideDays.slice().sort(), lifts: trends };
  if (trends.length < TREND_MIN_LIFTS) return { ...base, state: "unknown", pct: null, lo: null, hi: null, why: "only " + trends.length + " lift(s) carry a usable trend — " + TREND_MIN_LIFTS + " needed before this reads anything" };
  let sw = 0, swx = 0;
  for (const t of trends) { const w = 1 / (t.se * t.se); sw += w; swx += w * t.pct; }   /* no epsilon guard: TREND_SE_FLOOR makes se >= 0.001 by construction, so an epsilon here could never fire and would be one more guard that cannot. The invariant is asserted instead. */
  const pct = swx / sw, se = Math.sqrt(1 / sw);
  const lo = pct - 1.96 * se, hi = pct + 1.96 * se;
  let state = lo > 0 ? "rising" : hi < 0 ? "falling" : (hi - lo) / 2 < FLAT_HALFWIDTH ? "flat" : "unknown";
  /* DOWNSIDE-ONLY protection, the constitution applied literally: a rushed or
     short-sleep session cannot be what CREATES a falling verdict. Re-pool on the
     unprotected points only; if falling does not survive, it is not a decline he
     has to answer for. It can still bank a rise — short sleep protects, it does
     not punish, and it never blocks the upside. */
  let protectedBy = null, confidence = "normal";
  if (state === "falling") {
    /* RE-POOL ON CLEAN POINTS, NOT ON SPOTLESS LIFTS. The previous version filtered to
       lifts whose ENTIRE window carried no flagged session — so on his ledger, where
       cleanAtDate is false on 6 of 8 sessions, a lift needed six consecutive clean-sleep
       sessions to qualify and the gate needed four such lifts. That is roughly three
       unbroken weeks of clean sleep on a 6.23 h five-night average, so the earned-downgrade
       branch was UNREACHABLE IN PRODUCTION while passing in every fixture.

       A NEW VARIANT OF THE STANDING PATTERN: a guard that fires in the fixture and cannot
       fire in production. The assertions were correct and passed; the branch was still dead
       where it mattered. Guards must be driven against the real ledger, not only a fixture.

       Each lift is now re-estimated on its own unflagged SESSIONS at a lower minimum, and
       those are pooled — a lift with two clean sessions out of six contributes a weak clean
       estimate instead of nothing. */
    const clean2 = [];
    for (const t of trends) { const ct = liftTrend(s, t.id, { cleanOnly: true, minN: TREND_CLEAN_MIN_SESSIONS }); if (ct) clean2.push(ct); }
    const cleanPts = clean2.reduce((a, t) => a + t.n, 0);
    if (!clean2.length) {
      /* THE MIRROR OF THE BUG THIS RE-POOL FIXES. He has ONE session clean on both
         flags (2026-07-24). A trend cannot be pooled from one point, so if the
         re-pool were allowed to erase the verdict here, "falling" could never
         survive and COSTING would be structurally unreachable for as long as his
         sleep stays short — the app going blind to the exact state it exists to
         detect, under precisely the conditions where detecting it matters most.
         ABSENCE OF CLEAN SESSIONS IS NOT EVIDENCE OF NO DECLINE. The re-pool may
         only downgrade when it has the power to. With too few unflagged sessions
         to test, the verdict STANDS and is marked low-confidence instead. */
      confidence = "low";
      protectedBy = "kept at low confidence — no lift has " + TREND_CLEAN_MIN_SESSIONS + " unflagged sessions, so the decline cannot be tested. Absence of clean sessions is not evidence of no decline";
    }
    else {
      let sw2 = 0, swx2 = 0;
      for (const t of clean2) { const w = 1 / (t.se * t.se); sw2 += w; swx2 += w * t.pct; }   /* same: TREND_SE_FLOOR owns it */
      const p2 = swx2 / sw2, se2 = Math.sqrt(1 / sw2);
      /* FOUR OUTCOMES, AND ONLY ONE OF THEM DOWNGRADES.
         The previous version downgraded whenever p2 >= 0 — a BARE POINT ESTIMATE on a
         df=1 sample this file's own comment calls "deliberately weak". At p2 = +0.01 the
         state became flat; at −0.01 it stayed falling. That difference is noise, and it
         decided whether the calorie target kept stepping the deficit out. A coin flip on
         the weakest sample in the system was defending the deficit.

         NOTE THIS IS NOT THE pct-OVER-hi CALL FROM R2c, though it looks identical. There
         the interval had already gated ENTRY, so reusing it double-counted the same noise.
         Here the clean re-pool is a FRESH sample that nothing has gated, so a bare point
         estimate is doing inference it has not earned. The two cases look alike and are
         opposite.

         The asymmetry is the usual one: downgrading wrongly continues a deficit that is
         costing lean, which takes months to rebuild. Keeping falling wrongly means a
         shallower deficit for a few weeks, which is recoverable. THE DOWNGRADE IS THE
         EXPENSIVE ERROR, so it must need MORE evidence than the cheap one — and it needed
         less. Demanding the clean interval exclude zero at t=12.706 would be unreachable,
         which is the defect one layer up, so the bar is one standard error (~68%): a real
         condition, reachable at df=1, and not a coin flip. */
      if (p2 - se2 > 0) { state = "flat"; protectedBy = "downgraded — the clean sessions point UP with power (" + p2.toFixed(2) + " ± " + se2.toFixed(2) + " %/session across " + cleanPts + " clean points, clearing zero by more than one standard error). This is the only outcome that changes the verdict"; }
      else if (p2 >= 0) { confidence = "low"; protectedBy = "kept — the clean sessions lean up (" + p2.toFixed(2) + " %/session across " + cleanPts + " clean points) but cannot resolve either direction at this sample size. UNTESTABLE is not the same as contradicted"; }
      else if (!(p2 + 1.96 * se2 < 0)) { confidence = "medium"; protectedBy = "clean sessions agree on the direction (" + p2.toFixed(2) + " %/session across " + cleanPts + " clean points) but cannot confirm it on their own"; }
    }
  }
  return { ...base, state, protectedBy, confidence, nSoft: trends.reduce((a, t) => a + t.nSoft, 0), pct: +pct.toFixed(3), se: Math.max(+se.toFixed(3), TREND_SE_FLOOR), lo: +lo.toFixed(3), hi: +hi.toFixed(3),   /* THIRD TIME toFixed HAS EATEN A GUARD. liftTrend floors its se above the rounding for exactly this reason; the POOLED se is rounded separately here and a tight pool rounds to 0.000. R2c divides by this se to size the step, so a zero read as "no information" and a perfect decline came out MILD. Floor it above the rounding, at the point of rounding. */
    why: state === "unknown" ? "pooled interval " + lo.toFixed(1) + " to " + hi.toFixed(1) + " %/session is too wide to call" : "pooled " + pct.toFixed(2) + " %/session across " + trends.length + " lifts" };
}




return {
  progressStep, progressAnchor, maxedOut, _padFrom9, _loadTenure, _formerNames, _volDeltas, _setsAtTime, targetsFor, proposeLadder, loadRungs, debutDebit, nextLoad, prevLoad, snapLoad, deloadLoad, parseRungs, repsLostOnJump, windowFor, coarseLifts, progressionSetCount, atTopOfWindow, buildRirSets, deriveLastMeta, rirSetsOf, rirReceipt, paceRushed, openerRir, terminalRir, typicalError, beatsNoise, _deriveSightingFull, deriveSighting, sessionScore, _tCrit, liftTrend, progressionTrend
};
};
