'use strict';

// Frozen v7.56.0 volume readers; cross-module calls resolve through this engine's E.
module.exports = function createVolume(E, { clock, ids }) {
const { DAY, DELIVERED_MAJ, HYP_B, HYP_SDES, INDIRECT, MG_LABEL, REVIEW_CLASSIFY_D, REVIEW_DELIV_D, REVIEW_OUTCOME_D, TREND_MIN_SESSIONS, TREND_SE_FLOOR, VOL_BANDS } = E;
const _tCrit = (...args) => E._tCrit(...args);
const cap = (...args) => E.cap(...args);
const dayType = (...args) => E.dayType(...args);
const dayWeather = (...args) => E.dayWeather(...args);
const energyBalanceTarget = (...args) => E.energyBalanceTarget(...args);
const exActive = (...args) => E.exActive(...args);
const fmtShort = (...args) => E.fmtShort(...args);
const isoOf = (...args) => E.isoOf(...args);
const liftCall = (...args) => E.liftCall(...args);
const liftTrend = (...args) => E.liftTrend(...args);
const mk = (...args) => E.mk(...args);
const paceRushed = (...args) => E.paceRushed(...args);
const phaseArc = (...args) => E.phaseArc(...args);
const recoveryIndex = (...args) => E.recoveryIndex(...args);
const rirSetsOf = (...args) => E.rirSetsOf(...args);
const sessionScore = (...args) => E.sessionScore(...args);
const todayStart = (...args) => E.todayStart(...args);
const windowFor = (...args) => E.windowFor(...args);

// Copied from frozen src/app.jsx @ fe516c1:1398-1401.
function coarseLifts(s) {
  return (s.exercises || []).filter((e) => exActive(s, e.id)).map((e) => ({ e, w: windowFor(e) })).filter((x) => x.w.derived && x.w.tight)   /* FIX split-1 (P1-1): a retired lift's plates are nobody's problem — the migrated microload note named pronated */
    .map((x) => ({ id: x.e.id, n: x.e.n, w: x.e.w, step: x.w.step, pct: x.w.pct, lost: x.w.lost, hi: x.e.hi, lo: x.w.lo }));
}

// Copied from frozen src/app.jsx @ fe516c1:8361-8361.
const mgLabel = (k) => MG_LABEL[k] || k;

// Copied from frozen src/app.jsx @ fe516c1:8627-8627.
const volBucket = (ex) => (ex && (ex.head || ex.mg)) || null;

// Copied from frozen src/app.jsx @ fe516c1:8628-8649.
function muscleVolume(s) {
  const tISO6 = isoOf(todayStart());
  const win = (backLo, backHi) => Object.keys(s.sessionLog).filter((d) => { const g = (mk(tISO6) - mk(d)) / DAY; return g >= backLo && g < backHi; });
  const count = (days2) => { const by = {}; days2.forEach((d) => { (s.sessionLog[d].entries || []).forEach((e) => { const ex6 = (s.exercises || []).find((x) => x.id === e.id); const b6 = volBucket(ex6); if (!b6) return; const n6 = (e.reps || []).length; by[b6] = (by[b6] || 0) + n6; const lend = INDIRECT[e.id]; if (lend) Object.entries(lend).forEach(([mg2, f2]) => { by[mg2] = (by[mg2] || 0) + n6 * f2; }); }); }); return by; };
  const now7 = count(win(0, 7)), prev7 = count(win(7, 14));
  const mgs = [...new Set((s.exercises || []).filter((x) => exActive(s, x.id)).map(volBucket).filter(Boolean))];   /* FIX split-1 (P1-1): buckets come from ACTIVE lifts — logged history still counts above, but a retired-only bucket offers nothing to add sets to */
  return mgs.map((mg) => {
    const n7 = now7[mg] || 0, p7 = prev7[mg] || 0;
    const zone = n7 < VOL_BANDS.floor ? "UNDER" : n7 < VOL_BANDS.lo ? "LOW" : n7 <= VOL_BANDS.hi ? "IN-BAND" : n7 <= VOL_BANDS.ceil ? "HIGH" : "OVER";
    const lifts = (s.exercises || []).filter((x) => exActive(s, x.id) && volBucket(x) === mg && typeof x.w !== "undefined");   /* FIX split-1 (P1-1): candidate reconstruction is CURRENT-state — retired ids may never re-enter future offers */
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

// Copied from frozen src/app.jsx @ fe516c1:8674-8705.
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
  (s.exercises || []).filter((eA) => exActive(s, eA.id)).forEach((e) => {   /* SPLIT — a retired lift's sets stopped being designed the day it retired */
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
    const lifts = (s.exercises || []).filter((x) => exActive(s, x.id) && (x.head || x.mg) === mg);   /* R6 fix-2: the candidate REBUILD projects through exActive too — the totals filter alone still let tombstoned pronated re-enter lifts[] and become a routing target */
    /* A bucket fed only by what compounds lend has no exercise to add sets to,
       so it cannot be the subject of a volume recommendation — the anterior delt
       here is pressing, and the honest lever on it is the press. */
    return { mg, sets, zone, tier, indirectOnly: lifts.length === 0, lifts: lifts.map((x) => ({ id: x.id, n: x.n, sets: x.sets, day: x.day })) };
  }).sort((a, b) => b.sets - a.sets);
}

// Copied from frozen src/app.jsx @ fe516c1:8713-8713.
const hypGain = (from, to) => +(HYP_B * (Math.sqrt(Math.max(0, to)) - Math.sqrt(Math.max(0, from)))).toFixed(2);

// Copied from frozen src/app.jsx @ fe516c1:8744-8787.
function volumeImbalance(s) {
  const pv = programmeVolume(s);
  if (!pv.length) return null;
  const under = pv.filter((m) => m.sets < VOL_BANDS.floor && !m.indirectOnly);
  const low = pv.filter((m) => m.sets >= VOL_BANDS.floor && m.sets < VOL_BANDS.lo && !m.indirectOnly);
  const over = pv.filter((m) => m.sets > VOL_BANDS.hi && !m.indirectOnly);
  /* THE GATE — rewired from the exitStart flag to the REGIME DETECTOR (volume-lever spec,
     the key §3 finding). "Are we in a deficit?" was decided by whether a diet-exit date had
     ever been recorded — the old binary phase flag — while the rest of the engine had moved
     to regime(s), which reads measured lifts + rate. "free" (lifts holding or rising while
     fat still falls) is exactly the state this gate existed to wait for, and it could not
     see it. Now: growth action needs regime free AND the hysteresis confirmation;
     "unknown" ABSTAINS (filed, never proposed — no growth push on missing data, which is
     the live state today); costing / accretionBound keep the retention framing, which is
     correct THERE. Read through energyBalanceTarget's memo — regime() is expensive and
     this function runs inside render. */
  const eb0 = energyBalanceTarget(s);
  const growthOK = eb0.regime === "free" && !!eb0.regimeConfirmed;
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
  /* The gate that matters: growth action fires only when his own measured state sanctions it. */
  const actionable = detectable && growthOK;
  return { pv, under, low, over, donor, taker, need, gain, detectable, actionable, growthOK, regimeKey: eb0.regime, sdes: HYP_SDES,
    why: !growthOK
      ? `Filed, not proposed — ${eb0.regime === "unknown"
          ? `the regime detector cannot yet read your state${eb0.regimeWhy ? ` (${eb0.regimeWhy})` : ""}, and a growth decision is earned by measured lifts and rate — the engine abstains rather than guesses`
          : `your measured regime reads ${eb0.regime}${eb0.regimeWhy ? ` — ${eb0.regimeWhy}` : ""}, and adding sets there spends recovery the state says is already paying for something`}. The 6-12 band is a GROWTH dose-response measured in people eating enough to build. The one trial that asked the retention question of trained men in energy restriction (Roth 2023, n=38, six weeks at a 30 kcal/kg deficit and 2.8 g/kg protein) found 20 weekly sets and 12 preserved lean mass identically — 0.51 kg lost against 0.92, not a significant difference, and no difference in muscle thickness. Retention is cheaper still: Bickel 2011 held young adults' thigh lean mass for 32 weeks on one-ninth of their original volume. So ${taker ? `${mgLabel(taker.mg)} at ${taker.sets} sets` : "your current allocation"} is adequate for what you are actually asking of it right now, which is to hold. This is the first thing worth raising when the detector reads free — and it is on the record so nobody has to rediscover it then.`
      : `Your own measured state sanctions growth — lifts holding or rising while fat still falls, confirmed a week apart (regime: free). ${taker ? `${cap(mgLabel(taker.mg))} sits at ${taker.sets} sets a week` : "One muscle sits below the band"}${need ? `, and the full climb to a gain the literature can even detect is +${need} weekly sets (SDES ${HYP_SDES}%) — a two-set move is worth about ${hypGain(taker.sets, taker.sets + 2)}pp on its own, so the ladder climbs in read, earned steps rather than pretending one nudge is a finding` : ""}.` };
}

// Copied from frozen src/app.jsx @ fe516c1:8815-8836.
function structuralMovesThisWeek(s) {
  const t = isoOf(todayStart());
  const d0 = mk(t); const off = (d0.getDay() + 6) % 7;
  const monday = isoOf(new Date(d0 - off * DAY));
  const moves = [];
  const spillOf = (exId) => { const ex = (s.exercises || []).find((x) => x.id === exId); if (!ex) return [];
    return [(ex.head || ex.mg), ...Object.keys(INDIRECT[ex.id] || {}).map((m) => (m === "delts" ? "delts_front" : m))]; };
  (s.adjustments || []).forEach((a) => {
    if (!a || a.undone || a.dismissed || !a.d || a.d < monday) return;
    if (a.via === "cal" || a.via === "steps") moves.push({ kind: a.via, d: a.d, rid: a.rid });
    if (a.exUndo && a.exUndo.field === "sets") moves.push({ kind: "sets", d: a.d, rid: a.rid, exId: a.exUndo.exId, mgs: spillOf(a.exUndo.exId) });
  });
  (s.feed || []).slice(0, 80).forEach((f) => {
    if (!f || !f.t || !f.d || f.d < monday || f.t.indexOf("VOLUME ") !== 0) return;
    const ex = (s.exercises || []).find((x) => f.t.indexOf("via " + x.n) > -1);   /* "VOLUME PASSED" carries no "via" — declines are not moves */
    if (ex && !moves.some((m) => m.kind === "sets" && m.exId === ex.id)) moves.push({ kind: "sets", d: f.d, rid: null, exId: ex.id, mgs: spillOf(ex.id) });
  });
  return { monday, moves,
    calOrSteps: moves.filter((m) => m.kind === "cal" || m.kind === "steps"),
    sets: moves.filter((m) => m.kind === "sets"),
    mgsTouched: [...new Set(moves.filter((m) => m.kind === "sets").flatMap((m) => m.mgs || []))] };
}

// Copied from frozen src/app.jsx @ fe516c1:8862-8879.
function _blockSlope(pts9) {
  const ys = pts9.map((p) => sessionScore(p.en)).filter((y) => y != null);
  const n = ys.length;
  if (n < TREND_MIN_SESSIONS) return null;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  if (!(my > 0)) return null;
  const mx = (n - 1) / 2;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (i - mx) * (i - mx); sxy += (i - mx) * (ys[i] - my); }
  if (!(sxx > 0)) return null;
  const b = sxy / sxx;
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = my + b * (i - mx); sse += (ys[i] - yh) * (ys[i] - yh); }
  const sePct = Math.max((Math.sqrt(Math.max(sse / (n - 2), 0) / sxx) / my) * 100, TREND_SE_FLOOR);
  const pct = (b / my) * 100;
  const t9 = _tCrit(n - 2);
  return { n, pct: +pct.toFixed(3), lo: +(pct - t9 * sePct).toFixed(3), hi: +(pct + t9 * sePct).toFixed(3) };
}

// Copied from frozen src/app.jsx @ fe516c1:8883-8911.
function setOneRead(s, exId) {
  const ex9 = (s.exercises || []).find((x) => x && x.id === exId);
  if (!ex9 || typeof ex9.w !== "number") return { status: "IDLE", exId };
  const pts = [];
  for (const d of Object.keys(s.sessionLog || {}).sort()) {
    const sl = s.sessionLog[d];
    const en = (sl.entries || []).find((x) => x && x.id === exId);
    if (!en || !en.reps || !en.reps.length || String(en.w) !== String(ex9.w)) continue;
    let evt = false; try { evt = !!dayWeather(s, d).hardSession; } catch (e) { evt = false; }
    if (evt || paceRushed(sl)) continue;
    pts.push({ d, y: Number(en.reps[0]) || 0 });
  }
  const n = pts.length;
  if (n < TREND_MIN_SESSIONS) return { status: "COUNTING", exId, n, need: TREND_MIN_SESSIONS };
  const ys = pts.map((p) => p.y);
  const my = ys.reduce((a, b) => a + b, 0) / n;
  if (!(my > 0)) return { status: "COUNTING", exId, n: 0, need: TREND_MIN_SESSIONS };
  const mx = (n - 1) / 2;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (i - mx) * (i - mx); sxy += (i - mx) * (ys[i] - my); }
  if (!(sxx > 0)) return { status: "COUNTING", exId, n: 0, need: TREND_MIN_SESSIONS };
  const b = sxy / sxx;
  let sse = 0;
  for (let i = 0; i < n; i++) { const yh = my + b * (i - mx); sse += (ys[i] - yh) * (ys[i] - yh); }
  const sePct = Math.max((Math.sqrt(Math.max(sse / (n - 2), 0) / sxx) / my) * 100, TREND_SE_FLOOR);
  const pct = (b / my) * 100;
  const t9 = _tCrit(n - 2);
  return { status: "LIVE", exId, n, pct: +pct.toFixed(3), lo: +(pct - t9 * sePct).toFixed(3), hi: +(pct + t9 * sePct).toFixed(3), from: pts[0].d, to: pts[n - 1].d };
}

// Copied from frozen src/app.jsx @ fe516c1:8913-8989.
function volumeConversion(s, exId) {
  const log = (s && s.sessionLog) || {};
  const days = Object.keys(log).sort();
  const seq = [];
  for (const d of days) { const en = (log[d].entries || []).find((e) => e && e.id === exId); if (en) seq.push({ d, k: (en.reps || []).length, en }); }
  if (!seq.length) return { status: "IDLE", exId };
  const lastK = seq[seq.length - 1].k;
  let cut = seq.length;
  while (cut > 0 && seq[cut - 1].k === lastK) cut--;
  if (cut === 0) return { status: "IDLE", exId };
  const prevK = seq[cut - 1].k, dK = lastK - prevK;
  const post = seq.slice(cut);
  const changedAt = post[0].d;
  /* the derived calendar — every review date comes off THIS muscle's own change date */
  const revAt = (n9) => isoOf(new Date(mk(changedAt).getTime() + n9 * DAY));
  const reviews = { delivery: revAt(REVIEW_DELIV_D), outcome: revAt(REVIEW_OUTCOME_D), classify: revAt(REVIEW_CLASSIFY_D) };
  const blockDays = Math.max(0, Math.round((mk(isoOf(todayStart())) - mk(changedAt)) / DAY));
  const t = liftTrend(s, exId);
  if (!t || t.n < TREND_MIN_SESSIONS) return { status: "READING", exId, changedAt, prevK, k: lastK, dK, have: post.length, need: TREND_MIN_SESSIONS, reviews, blockDays,
    why: "the read window is open — " + post.length + " of " + TREND_MIN_SESSIONS + " post-change sessions logged; the window is liftTrend's own minimum, derived, never hand-picked. Reviews derive from the change date itself: delivery/tolerance " + fmtShort(reviews.delivery) + ", earliest outcome " + fmtShort(reviews.outcome) + ", credible classification " + fmtShort(reviews.classify) };
  const terms = post.map((p9) => { const rs = rirSetsOf(p9.en); return rs.length > 1 ? rs[rs.length - 1] : null; }).filter((x) => x != null);
  const delivered = terms.length >= 2 ? (terms.filter((x) => x <= 1).length / terms.length >= DELIVERED_MAJ) : null;
  const ex = (s.exercises || []).find((x) => x.id === exId);
  const falling = t.hi < 0;
  const tolerated = !falling && !(ex && ex.holdFlag);
  const band9 = recoveryIndex(s).band;
  /* MIXED-PHASE (F): a phase transition inside the read window — labeled, never
     force-classified into a cut or surplus response. */
  const phLog9 = (s.plan && Array.isArray(s.plan.phaseLog)) ? s.plan.phaseLog : [];
  const mixedPhase = phLog9.some((p9) => p9 && p9.at && String(p9.at).slice(0, 10) > changedAt);
  /* A2 — THE STAGED HOLD. Subtract needs the lift ITSELF deteriorating (interval fully
     below zero) AND one of: the deterioration repeating past the minimum window, the
     governor holding the lift (pain speaks there — the immediate safety path), or
     recovery leaving GREEN. An interval spanning zero can never subtract. */
  const safety = falling && !!(ex && ex.holdFlag);
  const subtract = dK > 0 && falling && (t.n >= TREND_MIN_SESSIONS + 2 || safety || band9 !== "GREEN");
  const effort9 = delivered === true ? "delivered (the terminal-set RIR reports say the hard sets ran hard)" : delivered === false ? "NOT delivered" : "unrated (fewer than 2 terminal-set RIR reports)";
  const revLine9 = "Reviews derive from the change date: outcome opens " + fmtShort(reviews.outcome) + " (day " + blockDays + " of " + REVIEW_OUTCOME_D + "), credible classification " + fmtShort(reviews.classify) + ".";
  /* THE LADDER (F): UNDELIVERED / NOT-TOLERATED / MIXED-PHASE / UNCLEAR / TOLERATED /
     OUTCOME-COMPATIBLE / REPLICATED. Outcome tiers need the long block AND more than one
     signal agreeing (the long strength trend AND the effort record — two different
     instruments; a body-composition corroborant joins when a re-anchor exists). */
  let tier, tLong = null, why;
  if (delivered === false) { tier = "UNDELIVERED";
    why = "the added set never arrived as prescribed effort — the final-set RIR reports say the hard sets were left in the tank, so this read says nothing about volume: the dose was not delivered";
  } else if (!tolerated) { tier = "NOT-TOLERATED";
    why = "post-change, the lift itself is deteriorating (" + t.pct + "%/session, CI " + t.lo + " to " + t.hi + ") — the added set is not being tolerated. Delivery was " + effort9 + "; execution, rest and technique standardization are yours to check — the instrument cannot see them. " + (subtract
      ? "The staged review's subtract condition is met" + (safety ? " on the safety path (the governor holds this lift while it falls)" : (band9 !== "GREEN" ? " — recovery has left GREEN while the lift falls" : " — the deterioration repeated past the minimum window")) + "; the card carries the receipt."
      : "A set comes off only if this repeats, pain speaks, or recovery leaves GREEN — a hold is not a verdict.");
  } else if (mixedPhase) { tier = "MIXED-PHASE";
    why = "the phase flipped inside this read window — the observation is filed MIXED-PHASE and never force-classified: a cut read and a surplus read answer different questions. " + revLine9;
  } else if (delivered === null && !(t.lo > 0) && !falling) { tier = "UNCLEAR";
    why = "the read is UNCLEAR — final-set effort is " + effort9 + " and the fresh window's interval spans zero (" + t.lo + " to " + t.hi + "): nothing here supports any claim, including a negative one. A null read HOLDS — even +120% habitual volume did not impair growth in the one direct test (Camargo 2026, a preprint: it informs the hold, it never fires a subtraction). " + revLine9;
  } else {
    const needD9 = (function () { try { return phaseArc(s).key === "leangain" ? REVIEW_CLASSIFY_D : REVIEW_OUTCOME_D; } catch (e) { return REVIEW_OUTCOME_D; } })();
    if (blockDays >= needD9) {
      tLong = liftTrend(s, exId, { window: 999 });
      if (tLong && tLong.lo > 0 && delivered === true) {
        /* replication — any EARLIER stable block of outcome length that also rose */
        const segs = [];
        let s0 = 0;
        for (let i = 1; i <= seq.length; i++) { if (i === seq.length || seq[i].k !== seq[i - 1].k) { segs.push(seq.slice(s0, i)); s0 = i; } }
        segs.pop();
        const priorOK = segs.some((g9) => g9.length >= TREND_MIN_SESSIONS && (mk(g9[g9.length - 1].d) - mk(g9[0].d)) / DAY >= REVIEW_OUTCOME_D && ((_blockSlope(g9) || {}).lo > 0));
        tier = priorOK ? "REPLICATED" : "OUTCOME-COMPATIBLE";
        why = priorOK
          ? "the benefit recurred across comparable stable blocks — REPLICATED, the only tier where an individual-response claim may live."
          : "the long window is rising (" + tLong.pct + "%/session over " + blockDays + " days) with the effort record agreeing — OUTCOME-COMPATIBLE, two signals. Not REPLICATED: the benefit has not yet recurred in a comparable block, and one block never brands a muscle.";
      } else { tier = "TOLERATED";
        why = "effort " + effort9 + " and the lift is carrying the added set — TOLERATED. The block is long enough to ask the outcome question, but the two signals do not yet agree" + (delivered === true ? " (the long window is not rising with confidence)" : " (the effort record is unrated)") + ". " + revLine9;
      }
    } else { tier = "TOLERATED";
      why = "effort " + effort9 + " and the lift is carrying the added set — TOLERATED. Growth is a longer question: a short-horizon lift trend is performance evidence, never tissue evidence. " + revLine9;
    }
  }
  return { status: "LIVE", exId, changedAt, prevK, k: lastK, dK, trend: t, delivered, tolerated, tier, mixedPhase, reviews, blockDays, subtract, safety, why };
}

// Copied from frozen src/app.jsx @ fe516c1:9015-9021.
function _setsMovesSince(s, sinceISO) {
  const out = [];
  (s.feed || []).slice(0, 120).forEach((f) => {
    if (f && f.t && f.d && f.d >= sinceISO && f.t.indexOf("VOLUME ") === 0 && f.t.indexOf("via ") > -1) out.push({ d: f.d, t: f.t });
  });
  return out.sort((a, b) => (a.d < b.d ? -1 : 1));
}

return { coarseLifts, mgLabel, volBucket, muscleVolume, programmeVolume, hypGain, volumeImbalance, structuralMovesThisWeek, _blockSlope, setOneRead, volumeConversion, _setsMovesSince };
};
