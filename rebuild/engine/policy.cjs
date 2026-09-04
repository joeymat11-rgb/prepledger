'use strict';

// Frozen v7.56.0 read functions; cyclic calls resolve through this engine's E.
module.exports = function createPolicy(E, { clock, ids }) {
const { AUTONOMY_LEVELS, AUTONOMY_META, AUTO_MAG_KCAL, BC, BREAK_LEN_DAYS, BREAK_RECENT_DAYS, DAY, EA_LOW, EA_SPARING, FORE, GRADE_LAG, INDIRECT, PHASE_META, PHASE_ORDER, RATE_DP, START, TRACK_ROWS, WALK_J_HI, WALK_J_LO } = E;
const apModeOf = (...args) => E.apModeOf(...args);
const bfEst = (...args) => E.bfEst(...args);
const bodyCompBand = (...args) => E.bodyCompBand(...args);
const currentRate = (...args) => E.currentRate(...args);
const cutRateBand = (...args) => E.cutRateBand(...args);
const dietExit = (...args) => E.dietExit(...args);
const energyAvailability = (...args) => E.energyAvailability(...args);
const energyBalanceTarget = (...args) => E.energyBalanceTarget(...args);
const energyDensity = (...args) => E.energyDensity(...args);
const fmtShort = (...args) => E.fmtShort(...args);
const isoOf = (...args) => E.isoOf(...args);
const memoOnState = (...args) => E.memoOnState(...args);
const mk = (...args) => E.mk(...args);
const observedTDEE = (...args) => E.observedTDEE(...args);
const partitionRates = (...args) => E.partitionRates(...args);
const proteinTarget = (...args) => E.proteinTarget(...args);
const readRecency = (...args) => E.readRecency(...args);
const recoveryIndex = (...args) => E.recoveryIndex(...args);
const sleepMean3At = (...args) => E.sleepMean3At(...args);
const stepKcal = (...args) => E.stepKcal(...args);
const stepTarget = (...args) => E.stepTarget(...args);
const todayStart = (...args) => E.todayStart(...args);

// Copied from frozen src/app.jsx @ fe516c1:3568-3568.
const cap = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

// Copied from frozen src/app.jsx @ fe516c1:4675-4712.
function digitalTwin(s, opts) {
  const o = opts || {};
  const td = observedTDEE(s);
  const r0 = currentRate(s);
  const rate0 = r0 && r0.measured ? r0.scale : null;        // lb/wk, + = losing
  const bf = bfEst(s);
  const stg = stepTarget(s);
  const kcalPer1k = stg.kcalPer1k || 20;
  const stepsNow = stg.gated ? 8000 : (stg.recentAvg || stg.avg || 8000);
  const baseTDEE = td && td.tdee ? td.tdee : null;
  const calDelta = o.calDelta || 0;                         // kcal/day vs current (neg = eat less)
  const stepsTarget = o.steps != null ? o.steps : (stepsNow + (o.stepsDelta || 0));   // v7.4.1 — stepsDelta models a STEP steer relative to current NEAT (additive; default 0 = unchanged), so conditionalForesight can route a live step adjustment through the ONE twin rate
  const stepKcal = ((stepsTarget - stepsNow) / 1000) * kcalPer1k;   // extra expenditure/day
  const perKcal = 7 / energyDensity(s).perLb;              // v7.3.0 Slice 4 — the ONE energy-density owner (== the prior 3800 until a DEXA anchors fat mass)
  const extraDeficit = (-calDelta) + stepKcal;              // eating less OR moving more both add deficit
  const newRate = rate0 != null ? +(rate0 + extraDeficit * perKcal).toFixed(2) : null;
  const targetPct = 11;
  const atWeight = +(bf.lean / (1 - targetPct / 100)).toFixed(1);
  const weeksAt = (rate) => (rate == null || rate <= 0 ? null : Math.max(0, Math.round((s.trend - atWeight) / rate)));
  /* HONEST FAN (v7.1.0 · Slice 2) — the ETA range is no longer a fixed ±25% on the rate (a
     made-up interval). It derives from the rate's OWN measured uncertainty: the HAC-corrected
     95% CI already computed in currentRate (r0.ci, lb/wk). etaFast/etaSlow are the arrival weeks
     at the fast/slow ends of that CI, so a noisy rate fans WIDE and a firm one fans TIGHT — the
     fan reflects real confidence, never a constant. The slow end is floored just above zero so
     "the ETA is a range" stays finite; the genuinely-unbounded case (a rate CI that reaches
     no-loss) is surfaced honestly by forecast()'s greyed cone + the crossing's self-suppression,
     not faked into a number here. Falls back to the old ±25% only when there is no measured CI. */
  const rateCI = (rate0 != null && r0 && r0.ci != null && r0.ci > 0) ? r0.ci : (newRate != null ? Math.abs(newRate) * 0.25 : 0);
  const rateHi = newRate != null ? newRate + rateCI : null;                   // fast plausible loss
  const rateLo = newRate != null ? Math.max(0.05, newRate - rateCI) : null;   // slow plausible loss (floored > 0)
  return {
    ok: rate0 != null && baseTDEE != null,
    baseTDEE, stepsNow, kcalPer1k, rate0, newRate, calDelta, stepsTarget, protein: o.protein,
    atWeight, targetPct,
    etaMid: weeksAt(newRate), etaFast: weeksAt(rateHi), etaSlow: weeksAt(rateLo),
    fanRate: newRate, seRate: rateCI > 0 ? +(rateCI / 1.96).toFixed(3) : null, rateCI: +rateCI.toFixed(2),
  };
}

// Copied from frozen src/app.jsx @ fe516c1:4718-4729.
function twinBodyComp(s, opts) {
  const tw = digitalTwin(s, opts);
  if (!tw.ok || tw.newRate == null) return { ...tw, bc: null };
  const bw = s.trend;
  const rate = tw.newRate;                       // + = losing
  const dir = rate >= 0 ? "cut" : "bulk";
  const band = bodyCompBand(s, dir);
  const pctRate = +(Math.abs(rate) / bw * 100).toFixed(2);
  const part = partitionRates(rate, s, dir);
  const zone = pctRate > band.redlinePct ? "redline" : pctRate >= band.corrPct[0] ? "corridor" : "below";
  return { ...tw, bc: { dir, pctRate, band, fat: part.fat, lean: part.lean, leanFrac: part.leanFrac, rt: part.rt, zone } };
}

// Copied from frozen src/app.jsx @ fe516c1:4955-4960.
function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp(-z * z / 2);
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - p : p;
}

// Copied from frozen src/app.jsx @ fe516c1:4967-4972.
function coneHalfWidth(sigmaLevel, seRate, h, z) {
  const hh = Math.max(0, h);
  const lvl = (sigmaLevel || 0) * Math.pow(hh, FORE.LEVEL_EXP);
  const slp = (seRate || 0) * Math.pow(hh, FORE.SLOPE_EXP);
  return (z || 1) * (lvl + slp);   // RAW (unrounded) so the ∝√h / ∝h^1.5 laws hold exactly; the display rounds
}

// Copied from frozen src/app.jsx @ fe516c1:5007-5086.
function rateDivergence(s, opts) {
  const off = (reason) => ({ flagged: false, reason, measured: null, implied: null, gap: null, combined: null, why: null, intakeWhy: null });
  /* total: an empty or partial state must abstain with a named reason, not throw. currentRate
     and observedTDEE both reach into s.blackout and s.reads and will throw on {}. */
  let r = null, td = null, ed = null;
  try { r = (opts && opts.rate) || currentRate(s); td = (opts && opts.td) || observedTDEE(s); ed = energyDensity(s); }
  catch (e) { return off("state-incomplete"); }
  if (!ed || !isFinite(ed.perLb)) return off("no-energy-density");
  if (!r || !r.measured || !isFinite(r.scale) || !isFinite(r.ci)) return off("no-measured-rate");
  if (!td || !isFinite(td.tdee) || td.tdeeAtNow == null) return off("no-activity-conditioning");

  /* what he is actually eating NOW, not the window average the tdee was solved over */
  const logs = (s && s.dailyLogs) || {};
  const days = Object.keys(logs).sort().slice(-7);
  const cals = days.map((d) => (logs[d] || {}).cal).filter((c) => c != null && isFinite(+c)).map(Number);
  const eatenOverride = (opts && isFinite(opts.eaten)) ? Number(opts.eaten) : null;
  if (eatenOverride == null && cals.length < 4) return off("intake-too-thin");
  const eaten = eatenOverride != null ? eatenOverride : cals.reduce((a, b) => a + b, 0) / cals.length;

  /* DETECTION AND ATTRIBUTION ARE DIFFERENT JOBS, and my first rebuild collapsed them.

     The flag's purpose is to warn when THE DISPLAYED RATE NO LONGER DESCRIBES HIS CURRENT
     BEHAVIOUR. That is live right now: the gauge shows 1.17 lb/wk and his last seven days
     imply 0.25. He can read the gauge, conclude he is on track, and be behaving like
     someone losing a quarter-pound a week.

     I narrowed the comparator to "what the PRESCRIBED intake at current steps implies",
     which asks a different and narrower question — would the step change alone make the
     target under-deliver — and answers no. That is a counterfactual he is not living.

     Worse, the narrowed gap was a CATEGORY ERROR. 0.28 decomposes into 0.11 (target 2,220
     vs the 2,160 window intake the regression describes) plus 0.17 (14,357 vs 17,171
     steps). Both are DETERMINISTIC differences between specified scenarios; neither carries
     sampling error. Testing their sum against the regression's +/-0.38 compares a scenario
     delta to a sampling interval.

     So: FIRE on measured vs BEHAVIOUR-implied, which is the honest test of whether the
     displayed number still describes him and does not care which component causes the gap.
     Then ATTRIBUTE the gap and point each part at its owner — intake at calorieTarget's
     wkOff, which already reports it, and steps at R6's conditioning line. Attribution names
     the owner; it does not require the flag to ignore anything. One flag, no duplicated
     ownership, fires on the condition that is actually live. */
  const toRate = (kcalDeficit) => (kcalDeficit * 7) / ed.perLb;
  const implied = toRate(td.tdeeAtNow - eaten);

  /* attribution: both terms are differences from the WINDOW scenario the regression
     describes, so they sum to the gap by construction rather than by coincidence. */
  const intakeEffect = +toRate(eaten - td.avg).toFixed(2);
  const stepEffect = +toRate(td.tdee - td.tdeeAtNow).toFixed(2);
  let tgt = null;
  try { tgt = (opts && opts.target) || energyBalanceTarget(s); } catch (e) { tgt = null; }
  const prescribed = (tgt && !tgt.gated && isFinite(tgt.mid)) ? tgt.mid : null;

  /* the implied rate's own band: the walking-cost range is the dominant term, and it is a
     coefficient uncertainty rather than anything about him */
  const bw = (s && s.trend) || null;
  const stepSpan = (bw && td.atSteps != null && td.stepsNow != null)
    ? Math.abs(stepKcal(bw, td.stepsNow - td.atSteps, WALK_J_HI) - stepKcal(bw, td.stepsNow - td.atSteps, WALK_J_LO)) / 2
    : 0;
  const impliedCi = Math.abs(toRate(stepSpan));
  const gap = Math.abs(r.scale - implied);
  const combined = Math.sqrt(r.ci * r.ci + impliedCi * impliedCi);
  const flagged = gap > combined;
  return {
    flagged, reason: flagged ? "divergent" : "consistent",
    measured: +r.scale.toFixed(2), measuredCi: +r.ci.toFixed(2),
    implied: +implied.toFixed(2), impliedCi: +impliedCi.toFixed(2),
    eaten: Math.round(eaten), prescribed, intakeEffect, stepEffect,
    atSteps: td.atSteps, stepsNow: td.stepsNow,
    gap: +gap.toFixed(2), combined: +combined.toFixed(2),
    why: flagged
      ? `Your gauge shows ${r.scale.toFixed(2)} lb/wk. What you have actually been eating and walking over the last week implies ${implied.toFixed(2)} — they disagree by ${gap.toFixed(2)}, more than their combined error. The displayed rate is a 28-day regression and your behaviour changed inside it, so it no longer describes what you are doing now. It changes nothing on its own.`
      : `Your gauge shows ${r.scale.toFixed(2)} lb/wk and your recent eating and walking imply ${implied.toFixed(2)}. They agree inside their combined error (${combined.toFixed(2)}), so the long window is not hiding a behaviour change.`,    /* ATTRIBUTION, with owners named. Neither line re-decides anything. */
    attribution: !flagged ? null : [
      { part: "intake", lbWk: intakeEffect, owner: "the weekly line on the calorie card (wkAvg / wkOff)" },
      { part: "steps", lbWk: stepEffect, owner: "the maintenance conditioning line (R6)" },
    ],
    attributionWhy: !flagged ? null
      : `Of that ${gap.toFixed(2)}: about ${Math.abs(intakeEffect).toFixed(2)} is intake (${Math.round(eaten)} against the ${td.avg} the rate was measured over) and about ${Math.abs(stepEffect).toFixed(2)} is steps (${(td.stepsNow || 0).toLocaleString()} against ${(td.atSteps || 0).toLocaleString()}). The intake part is ${Math.abs(intakeEffect) > Math.abs(stepEffect) ? "the larger one and" : ""} already reported on the calorie card — this flag is not a second opinion on it, it just says the gauge has stopped describing you.`,  };
}

// Copied from frozen src/app.jsx @ fe516c1:5088-5133.
function redlineCrossing(s, opts) {
  const o = opts || {};
  const r = o.rate || currentRate(s);
  const rb = o.band || cutRateBand(s);
  const sig = o.sig || signalState(s);
  const bw = o.bw || (s && s.trend) || 165;
  const off = (reason) => ({ fires: false, reason, tStar: null, range: null, prob: 0, redlinePct: null });
  if (!r || !r.measured || r.ci == null || r.ci <= 0) return off("no-signal");
  if (!(sig.state === "measured" || sig.state === "measurable")) return off("ambiguous-signal");
  const m = r.scale;                                   // lb/wk, + = losing
  if (!(m > 0)) return off("not-losing");
  const seRate = r.ci / FORE.PI95;                     // lb/wk — HAC 95% half-width back to 1σ
  /* READ the owner, never derive a second one. This line WAS the second redline:
     rb.redline was raw pounds, so it produced 1.157 %BW against the 1.0 %BW that
     escalation and the zone both use, and the foresight layer fired LATER than the
     alarm it forecasts. bodyCompBand is the single publisher of redlinePct. */
  const redlinePct = (rb && isFinite(rb.redlinePct)) ? rb.redlinePct : BC.CUT_REDLINE_PCT;   /* fall back to the CITED constant, never to a second derivation off pounds */
  if (!(redlinePct > 0)) return off("no-redline");
  const K = 100 / redlinePct;
  const tStarOf = (rate) => (rate > 0 ? bw / rate - K : Infinity);
  const tStar = tStarOf(m);                                     // point crossing
  if (!(tStar > 0)) return off("already-past");
  if (tStar > FORE.H_INFO) return off("beyond-horizon");        // point crossing too far to quote honestly (a straight line over-predicts past here)
  /* RESOLVABILITY / self-suppression (t*→∞): the SLOW end of the slope CI must ALSO cross within the
     display horizon. If the slope CI includes a rate slow enough to stay safe past H_MAX — i.e. the
     CI includes the safe rate — the crossing is ambiguous (its slow-end t*→∞) and the alert
     self-silences. mLo is the 95% lower slope bound (r.lo). Reads ONE slope CI + ONE redline. */
  const mLo = r.lo != null ? r.lo : +(m - r.ci).toFixed(2);
  const tLate = tStarOf(mLo);
  if (!(tLate > 0) || tLate > FORE.H_MAX) return off("ci-includes-safe");
  const mCrit = bw / (FORE.H_INFO + K);                         // the rate that just crosses at H_INFO
  // Honest probability of crossing within H_INFO — floored at P_FIRE (we warn even at a LOW
  // probability, because muscle loss is costly) and capped at 0.95 (a fan chart never claims certainty).
  const prob = +Math.min(0.95, Math.max(FORE.P_FIRE, normCdf((m - mCrit) / seRate))).toFixed(2);
  const clamp = (t) => Math.max(0, Math.min(FORE.H_MAX, t));
  const early = clamp(tStarOf(m + FORE.PI80 * seRate));         // faster plausible loss → sooner
  const late = clamp(tStarOf(m - FORE.PI80 * seRate));          // slower plausible loss → later
  const wksEarly = Math.round(early), wksLate = Math.round(late);
  return {
    fires: true, reason: "resolvable", tStar: +tStar.toFixed(1),
    range: [+early.toFixed(1), +late.toFixed(1)], wksEarly, wksLate, prob, redlinePct,
    dateEarly: isoOf(new Date(todayStart().getTime() + early * 7 * DAY)),
    dateLate: isoOf(new Date(todayStart().getTime() + late * 7 * DAY)),
    cause: `Approaching the lean-loss rate — on this trend you'd reach it in about ${wksEarly}–${wksLate} wks (~${Math.round(prob * 100)}% within ${FORE.H_INFO} wks). Easing the deficit back now keeps the loss off muscle.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5168-5201.
function forecastUncached(s, opts) {
  const o = opts || {}, d = o.deps || {};
  try {
    const r = d.rate || currentRate(s);
    const sig = d.sig || signalState(s);
    const rb = d.band || cutRateBand(s);
    const tw = d.tw || digitalTwin(s, o.twin || {});
    const bw = (s && s.trend) || 165;
    const confident = sig.state === "measured" || sig.state === "measurable";
    const z = confident ? FORE.PI90 : FORE.PI95;                  // low confidence → a WIDER band
    const seRate = r && r.ci != null && r.ci > 0 ? +(r.ci / FORE.PI95).toFixed(3) : null;
    const sigma = r && r.sigma != null ? r.sigma : (d.sigma != null ? d.sigma : null);
    const rate = tw && tw.ok ? tw.newRate : (r && r.measured ? r.scale : null);   // the ONE rate
    const cone = [];
    if (rate != null && seRate != null && sigma != null) {
      for (let h = 0; h <= FORE.H_MAX; h++) {
        const mid = +(bw - rate * h).toFixed(2);
        const hw = coneHalfWidth(sigma, seRate, h, z);
        cone.push({ wk: h, mid, lo: +(mid - hw).toFixed(2), hi: +(mid + hw).toFixed(2), hw: +hw.toFixed(3) });
      }
    }
    const crossing = redlineCrossing(s, { rate: r, band: rb, sig, bw });
    return {
      ok: rate != null && cone.length > 1, rate, seRate, sigma, z,
      pi: z === FORE.PI95 ? 95 : z === FORE.PI90 ? 90 : 80, confident, greyed: !confident,
      cone, crossing,
      atWeight: tw && tw.atWeight != null ? tw.atWeight : null,
      targetPct: tw && tw.targetPct != null ? tw.targetPct : null,
      etaMid: tw ? tw.etaMid : null, etaFast: tw ? tw.etaFast : null, etaSlow: tw ? tw.etaSlow : null,
    };
  } catch (e) {
    return { ok: false, rate: null, seRate: null, sigma: null, confident: false, greyed: true, cone: [], crossing: { fires: false, reason: "no-data", range: null, prob: 0 } };
  }
}

// Copied from frozen src/app.jsx @ fe516c1:5202-5202.
const _forecastCached = memoOnState((s) => forecastUncached(s));

// Copied from frozen src/app.jsx @ fe516c1:5205-5205.
function forecast(s, opts) { return opts === undefined ? _forecastCached(s) : forecastUncached(s, opts); }

// Copied from frozen src/app.jsx @ fe516c1:5210-5210.
function safeCrossing(s) { try { const f = forecast(s); return f && f.crossing ? f.crossing : { fires: false }; } catch (e) { return { fires: false }; } }

// Copied from frozen src/app.jsx @ fe516c1:5225-5242.
function conditionalForesight(s) {
  try {
    const aa = activeAdjustment(s);
    if (!aa || !aa.active) return null;                        // only while a steer is actually live
    const r = currentRate(s);
    if (!r || !r.measured) return null;                        // gated on enough n — no measured rate, no conditional line
    const twinOpts = aa.via === "steps" ? { stepsDelta: aa.stepDelta || 0 } : { calDelta: aa.calDelta || 0 };
    const tw = digitalTwin(s, twinOpts);                       // the EXISTING engine — the ONE conditional rate and its eta
    if (!tw || !tw.ok || tw.etaMid == null) return null;
    return {
      conditional: true, measured: false,                      // labeled hypothetical — never the measured trend
      via: aa.via, etaWks: tw.etaMid, atWeight: tw.atWeight, targetPct: tw.targetPct,
      newRate: tw.newRate, title: aa.title || null,
      label: aa.via === "steps" ? "at the new step target" : "at the new calorie target",
      why: "Plan-conditional: what your trend becomes IF you hold this new target — not your measured rate yet. It converges on the projection above as new weigh-ins land.",
    };
  } catch (e) { return null; }
}

// Copied from frozen src/app.jsx @ fe516c1:5249-5249.
function etaReached(wks) { return wks === 0; }

// Copied from frozen src/app.jsx @ fe516c1:5264-5344.
function autoPilot(s, mode) {
  const r = currentRate(s);
  const td = observedTDEE(s);
  if (!r.measured || !td || !td.tdee) return { ok: false, goalRate: cutRateBand(s, mode).band[0] };
  const measRate = r.scale;                        // + = losing (cut), − = gaining (bulk)
  const dir = measRate >= 0 ? "cut" : "bulk";
  const band = bodyCompBand(s, dir, mode);   // v6.2.1 — honor the toggle's mode, not just stored state
  const bw = s.trend;
  const pctRate = +(Math.abs(measRate) / bw * 100).toFixed(2);
  // MODE (v6.2) — which slice of the corridor Auto-Pilot steers to. CUT: MAX BODY COMPOSITION
  // (recomp) targets the lean-preserving optimum CUT_OPT_PCT (Garthe 2011 ~0.70 %BW/wk — best pure
  // body-comp change); MAX FAT LOSS targets the corridor top, just under the redline (fastest fat
  // off, muscle held flat). BULK: no fat-loss analog — both ride the disciplined lean-gain ceiling
  // (corridor top, never past the redline). ONE corridor engine (bodyCompBand); the mode only
  // selects the target slice — no second computation.
  const apMode = mode === "fatloss" ? "fatloss" : "recomp";
  const targetLb = dir === "cut"
    ? (apMode === "fatloss" ? band.corrLb[1] : +((BC.CUT_OPT_PCT / 100) * bw).toFixed(2))
    : band.corrLb[1];
  const targetPct = +((targetLb / bw) * 100).toFixed(2);
  const gapLb = Math.abs(measRate) - targetLb;    // + = running hotter than the mode target
  let action = "hold";
  if (gapLb > 0.05) action = "ease";              // faster than target -> ease toward it
  else if (gapLb < -0.05) action = "tighten";     // slower than target -> tighten toward it
  /* STALENESS SAFEGUARD (v6.3.2) — the rate is FROZEN, not aged (currentRate spans the
     last 28 READS, so no weigh-in never widens it). When his last weigh-in is STALE_DAYS+
     old, Auto-Pilot will not steer off a number the scale hasn't refreshed: it HOLDS and
     asks for a fresh morning instead of proposing a move — especially the MAX FAT LOSS
     tighten the 8/2 audit caught. Propose-only is untouched; this only makes it abstain
     when the data can't back a move. */
  const rec = readRecency(s);
  const intendedAction = action;
  if (rec.stale) action = "hold";
  /* R18e — THE BUDGET REACHES AUTO-PILOT, in the one direction it is sound: for the
     budget week after a SETS change, TIGHTEN abstains (the mirror of the exact veto
     volumePush applies to cal moves — one budget, symmetric). Mechanism, not calendar
     superstition: new-volume repair water inflates the scale for ~1-2 weeks, so a
     slower-looking rate right after added sets is the one steer most likely to be
     false. EASE and the redline floor are NEVER held — safety does not wait. The
     daily band itself is untouched: prescription is measurement, not a lever. */
  let setsWeekHold = false;
  if (action === "tighten") { try { const smw9 = structuralMovesThisWeek(s); if (smw9.sets.length) { action = "hold"; setsWeekHold = true; } } catch (e) {} }
  /* CONFIDENCE GATE (v6.3.2, Slice 0) - a proposal must clear NOISE, not just the +/-90 kcal
     dead-band. `proposed` fired off the POINT estimate, so one big morning (a +3 lb water/sodium
     spike) drops the 28-read rate ~0.2 lb/wk and can tip a false "tighten" past the band while the
     trend never moved (8/2 sodium check: measRate 1.15->0.96, recomp HOLD->tighten ~103 kcal). Only
     steer when the drift is STATISTICALLY RESOLVABLE: the rate's own 95% CI (r.lo..r.hi - the same
     interval signalState reads for ciExcludesZero) must EXCLUDE the mode target. A spike widens that
     CI and pulls the target back inside it, so the false move abstains to a hold; a real, tight-CI
     drift still clears it. Propose-only and engine-owned, exactly like the staleness hold above. */
  const targetRate = dir === "cut" ? targetLb : -targetLb;
  const hasRateCI = r.ci != null && r.lo != null && r.hi != null;   // regression path only; a coarse "snapshots" rate has NO CI
  const driftSig = hasRateCI && (targetRate < Math.min(r.lo, r.hi) || targetRate > Math.max(r.lo, r.hi));
  if (!driftSig) action = "hold";   // within noise, OR no CI to resolve it (snapshots/cold) -> abstain, never steer
  const corrKcal = Math.round((Math.abs(gapLb) * energyDensity(s).perLb) / 7);   // v7.3.0 Slice 4 — the ONE energy-density owner (== the prior 3800 until a DEXA anchors fat mass)
  const stg = stepTarget(s);
  const kcalPer1k = stg.kcalPer1k || 20;
  const stepsAdd = Math.max(500, Math.round((corrKcal / kcalPer1k) * 1000 / 500) * 500);
  let proposed = action !== "hold" && corrKcal >= 90;   // hysteresis: a full adaptation's worth — a stale rate has already forced hold, so nothing fires off a frozen number
  /* v7.3.1 — the loop CLEARS: once THIS steer is handled (approved → a live offset, or dismissed
     today), stop re-raising it so the cockpit doesn't sit on a stale NEEDS YOU / ADJUSTING. The next
     weigh-in expires the offset (activeAdjustment) and autoPilot re-evaluates off fresh data. */
  const steerHandled = apSteerHandled(s, isoOf(todayStart()));
  if (steerHandled) proposed = false;
  // protein as a body-comp lever — the partition depends on it. Flag if the last logged day is
  // under the derived lean-retention floor (proteinTarget.lo = 2.5 g/kg FFM; 2025 Bayesian meta-regression [authorship TBC]/Helms/Longland).
  const pt = proteinTarget(s);
  // Cut floor = FFM-based lean-retention (proteinTarget.lo, 2.5 g/kg FFM). Bulk floor = MPS
  // saturation, 1.6 g/kg BW (Morton 2018) — direction-aware, both from BC / the derived target.
  const proFloorG = dir === "bulk" ? Math.round(BC.BULK_PROTEIN_G_PER_KG_BW * (s.trend / 2.2046)) : pt.lo;
  const proRows = Object.entries(s.dailyLogs || {}).filter(([, v]) => v && v.pro != null).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const lastPro = proRows.length ? proRows[proRows.length - 1][1].pro : null;
  const proteinOff = lastPro != null && lastPro < proFloorG;
  return {
    ok: true, dir, mode: apMode, goalRate: targetLb, targetLb, targetPct, measRate: +measRate.toFixed(2), tdee: Math.round(td.tdee), n: r.n || 0,
    band, pctRate, action, corrKcal, stepsAdd, proposed, onLine: !proposed, handledForToday: steerHandled, setsWeekHold, setsWeekWhy: setsWeekHold ? "a set change landed this week — repair water inflates the scale for a week or two, so a slower-looking rate right now is the steer most likely to be false. Tighten waits for the budget week to close; easing and the floor never wait." : null,
    proteinOff, proteinTargetG: pt.g, proteinFloorG: proFloorG, lastPro,
    stale: rec.stale, staleDays: rec.days, lastReadISO: rec.lastISO, heldForStale: rec.stale && intendedAction !== "hold",
    driftSig, heldForNoise: !driftSig && !rec.stale && intendedAction !== "hold" && corrKcal >= 90,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5366-5369.
function autonomyOf(s) {
  const a = s && s.plan && s.plan.autonomy;
  return AUTONOMY_LEVELS.indexOf(a) >= 0 ? a : "propose";   // absent / unknown -> most supervised (never auto-promote)
}

// Copied from frozen src/app.jsx @ fe516c1:5384-5401.
function escalation(s, ap) {
  ap = ap || autoPilot(s, apModeOf(s));
  let sig; try { sig = signalState(s); } catch (e) { sig = { state: "calibrating", n: 0 }; }
  let rec; try { rec = readRecency(s); } catch (e) { rec = { stale: false }; }
  const coachOwed = (((s && s.proposals) || [])).some((p) => p && !p.resolved && p.gate === "coach");
  const ask = [], abstain = [];
  if (coachOwed) ask.push({ code: "coach", kind: "ask", text: "a coach-flagged call is waiting for your sign-off" });
  if (sig.state === "reversed") ask.push({ code: "reversed", kind: "ask", text: "the trend has reversed — that needs your eyes, not an auto-move" });
  if (ap && ap.ok && ap.proteinOff) ask.push({ code: "floor-protein", kind: "ask", text: `protein is under the ${ap.proteinFloorG}g lean-retention floor — a floor call, never automated` });
  if (ap && ap.ok && ap.band && ap.pctRate != null && ap.band.redlinePct != null && ap.pctRate >= ap.band.redlinePct)
    ask.push({ code: "redline", kind: "ask", text: `you're at or past the ${ap.band.redlinePct}%BW/wk muscle-loss redline — too aggressive to auto-apply` });
  if (ap && ap.ok && ap.proposed && ap.corrKcal >= AUTO_MAG_KCAL)
    ask.push({ code: "magnitude", kind: "ask", text: `a big move (~${ap.corrKcal} kcal, over the ${AUTO_MAG_KCAL}-kcal routine limit) — your call` });
  if ((ap && ap.heldForStale) || rec.stale) abstain.push({ code: "stale", kind: "abstain", text: "the rate is frozen — weigh in first" });
  if (ap && ap.heldForNoise) abstain.push({ code: "noise", kind: "abstain", text: "this week is inside your noise — not resolvable yet" });
  if (sig.state === "calibrating") abstain.push({ code: "calibrating", kind: "abstain", text: "still calibrating your baseline" });
  return { ask, abstain, escalate: ask.length > 0, first: ask[0] || null, reasons: ask.concat(abstain) };
}

// Copied from frozen src/app.jsx @ fe516c1:5410-5423.
function autoPilotPolicy(s, deps) {
  const ap = (deps && deps.ap) || autoPilot(s, apModeOf(s));
  const level = (deps && deps.level) || autonomyOf(s);
  const esc = (deps && deps.esc) || escalation(s, ap);
  const rank = (AUTONOMY_META[level] || AUTONOMY_META.propose).rank;
  const hasMove = !!(ap && ap.ok && ap.proposed);
  const routine = hasMove && !!ap.driftSig && !ap.heldForStale && !ap.heldForNoise && !esc.escalate;   // the safe-to-automate class
  const autoApply = routine && rank >= 1;                          // L2 / L3 only; L1 always asks
  return {
    level, rank, hasMove, routine, autoApply,
    mustAsk: hasMove && !autoApply,                                // a staged move a human still owns
    escalate: esc.escalate, escReason: esc.first, ask: esc.ask, abstain: esc.abstain,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5428-5439.
function confidenceField(s, deps) {
  let sig = deps && deps.sig; if (!sig) { try { sig = signalState(s); } catch (e) { sig = { state: "calibrating", n: 0, ticks: 0 }; } }
  const map = {
    measured:       { word: "MEASURED",     detail: `your trend is real — the rate's 95% CI excludes zero (n=${sig.n || 0}). That badge is HIGH confidence, not the only grade of evidence — and at these sample sizes the interval itself is a small-sample estimate` },
    measurable:     { word: "MEASURABLE",   detail: "a real direction, still tightening — treat the number as a range" },
    calibrating:    { word: "CALIBRATING",  detail: "baseline still forming — no confident rate yet" },
    "inside-noise": { word: "INSIDE NOISE", detail: "this week sits inside your scale noise — holding for a clear read" },
    reversed:       { word: "REVERSED",     detail: "the trend is going the other way — this needs your eyes" },
  };
  const m = map[sig.state] || map.calibrating;
  return { state: sig.state, word: m.word, detail: m.detail, ticks: sig.ticks != null ? sig.ticks : 0 };
}

// Copied from frozen src/app.jsx @ fe516c1:5446-5474.
function whyThisNumber(s, deps) {
  const ap = (deps && deps.ap) || autoPilot(s, apModeOf(s));
  const conf = confidenceField(s, deps);
  const modeLabel = ap && ap.mode === "fatloss" ? "MAX FAT LOSS" : "MAX BODY COMP";
  if (!ap || !ap.ok) return {
    ok: false,
    l1: { label: "INTENT", text: "Calibrating — not enough clean data to steer yet." },
    l2: { label: "RATIONALE", text: "Auto-Pilot holds until your trend is measurable; it won't act on a number it can't stand behind." },
    l3: { label: "PROJECTION", text: "No confident projection yet — keep logging and it sharpens." },
    confidence: conf,
  };
  const act = ap.action === "ease" ? "ease back" : ap.action === "tighten" ? "pick up the pace" : "hold";
  const intent = ap.action === "hold"
    ? `Hold your ${modeLabel} line — ~${ap.targetPct}%BW/wk.`
    : `${cap(act)} toward your ${modeLabel} line — from ~${ap.pctRate}%BW/wk to ~${ap.targetPct}%BW/wk (≈${ap.corrKcal} kcal).`;
  let pt = null; try { pt = proteinTarget(s); } catch (e) {}
  const rationale = `Measured from your own trend: ~${ap.pctRate}%BW/wk over n=${ap.n} mornings, observed TDEE ~${ap.tdee} kcal. The corridor is engine-owned (Garthe 2011 ≈0.7%/wk for the best body-comp change; the redline guards muscle)${pt ? `, and protein holds at ${pt.g} g (${pt.lo}–${pt.hi}) — 2.5 g/kg FFM, the lean-retention floor (2025 Bayesian meta-regression, authorship TBC; Helms)` : ""}.`;
  let fx = null; try { fx = forecast(s); } catch (e) {}
  const projection = fx && fx.ok && fx.confident && fx.etaMid != null
    ? `On this line, ~${fx.etaMid} wks to ${fx.targetPct}% BF (range ${fx.etaFast}–${fx.etaSlow} wks — the fan widens with distance, not a promise).`
    : "No confident ETA yet — the projection stays greyed until a few more clean mornings.";
  return {
    ok: true,
    l1: { label: "INTENT", text: intent },
    l2: { label: "RATIONALE", text: rationale },
    l3: { label: "PROJECTION", text: projection },
    confidence: conf,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5482-5509.
function trackRecord(s, deps) {
  const reads = (s && Array.isArray(s.reads)) ? s.reads.filter((r) => r && r.d) : [];
  const fc = (s && Array.isArray(s.forecasts)) ? s.forecasts.filter((f) => f && f.d && !f.sealed && typeof f.pred7 === "number") : [];
  let sd = 0.3; try { const wn = weightNoise(reads); if (wn && wn.sd) sd = wn.sd; } catch (e) {}
  const tol = +Math.max(0.3, sd).toFixed(2);   // honest tolerance = the athlete's own 1-sigma noise, floored
  const sorted = reads.slice().sort((a, b) => (a.d < b.d ? -1 : 1));
  const actualTrendAt = (iso) => { for (const r of sorted) if (r.d >= iso && r.pt != null) return r.pt; return null; };
  const rows = [];
  for (const f of fc) {
    const dueISO = isoOf(new Date(mk(f.d).getTime() + GRADE_LAG * DAY));
    const actual = actualTrendAt(dueISO);
    if (actual == null) { rows.push({ d: f.d, pred: +(+f.pred7).toFixed(1), actual: null, err: null, graded: false, hit: null, miss: false }); continue; }
    const err = +(actual - f.pred7).toFixed(2);
    const hit = Math.abs(err) <= tol;
    rows.push({ d: f.d, pred: +(+f.pred7).toFixed(1), actual: +actual.toFixed(1), err, graded: true, hit, miss: !hit });
  }
  const graded = rows.filter((r) => r.graded);
  const hits = graded.filter((r) => r.hit).length;
  const misses = graded.filter((r) => r.miss).length;
  const mae = graded.length ? +(graded.reduce((a, r) => a + Math.abs(r.err), 0) / graded.length).toFixed(2) : null;
  let cleanStreak = 0; for (let i = graded.length - 1; i >= 0; i--) { if (graded[i].hit) cleanStreak++; else break; }
  const decisions = ((s && s.adjustments) || []).filter((a) => a && a.rid && (String(a.rid).indexOf("ap_") === 0 || String(a.rid).indexOf("apauto_") === 0))
    .slice(-8).map((a) => ({ d: a.d, title: a.title, applied: !a.dismissed, auto: !!a.auto }));
  const calibration = graded.length
    ? `Over ${graded.length} graded 7-day call${graded.length > 1 ? "s" : ""}, the trend landed within your ±${tol} lb noise ${hits} time${hits !== 1 ? "s" : ""} and missed ${misses} — mean miss ±${mae} lb. Misses are shown, not hidden.`
    : "No 7-day calls have come due yet — the record fills as each prediction ages into an outcome.";
  return { rows: rows.slice(-TRACK_ROWS), graded: graded.length, hits, misses, mae, tol, calibration, hasMiss: misses > 0, cleanStreak, decisions };
}

// Copied from frozen src/app.jsx @ fe516c1:5530-5530.
const daysBetween = (a, b) => Math.round((mk(b) - mk(a)) / DAY);

// Copied from frozen src/app.jsx @ fe516c1:5531-5531.
const _phaseSafe = (fn, dflt) => { try { const v = fn(); return v == null ? dflt : v; } catch (e) { return dflt; } };

// Copied from frozen src/app.jsx @ fe516c1:5536-5543.
function dietBreakHonest() {
  return {
    what: "A planned week eating at maintenance — a recovery and adherence pause, then the cut picks back up.",
    metabolic: "It is not a metabolic trick. In lean, trained people a diet break does not rescue metabolic rate: ICECAP (Peos 2021, n=61 resistance-trained) found hunger and diet-satisfaction improved while fat mass, fat-free mass, resting metabolism, leptin, testosterone and T3 were all unchanged. MATADOR's benefit in this population is adherence — and a water/glycogen swing on the scale — not a faster metabolism.",
    scale: "Expect the scale to jump a few pounds within days. That is glycogen and the water bound to it (~3 g of water per gram of carbohydrate stored), transient — not fat regained — and it comes back off when the deficit resumes. Reading it as fat is how people talk themselves out of a break they benefited from.",
    buys: "What it buys is a break from hunger and dietary restraint, which is the effect the evidence actually replicates. It is not a fat-loss accelerator and buys no extra muscle — the trained-subgroup resting-metabolism effect is ~11 kcal/day with an interval spanning zero (−46 to +67) — and the app will never sell it as one. The trend window is SEALED across it, so the water back is never read as fat.",
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5547-5563.
function dietBreakState(s, deps) {
  s = s || {};
  const today = (deps && deps.today) || isoOf(todayStart());
  const plan = (s.plan && typeof s.plan === "object") ? s.plan : {};
  const brk = (plan.brk && typeof plan.brk === "object") ? plan.brk : null;
  const honest = dietBreakHonest();
  const dx = _phaseSafe(() => dietExit(s), null);
  const maintenance = dx && !dx.gated ? dx.maintenance : null;
  const maintDays = dx && !dx.gated ? dx.days : null;
  const base = { maintenance, maintDays, honest, why: honest.what };
  if (!brk || !brk.start || !brk.end) return { status: "none", start: null, end: null, daysLeft: 0, daysSince: 0, startsIn: 0, ...base };
  if (today < brk.start)  return { status: "proposed", start: brk.start, end: brk.end, startsIn: daysBetween(today, brk.start), daysLeft: daysBetween(brk.start, brk.end), daysSince: 0, ...base };
  if (today <= brk.end)   return { status: "active",   start: brk.start, end: brk.end, startsIn: 0, daysLeft: Math.max(0, daysBetween(today, brk.end)), daysSince: daysBetween(brk.start, today), ...base };
  const daysSince = daysBetween(brk.end, today);
  if (daysSince <= BREAK_RECENT_DAYS) return { status: "recent", start: brk.start, end: brk.end, startsIn: 0, daysLeft: 0, daysSince, ...base };
  return { status: "none", start: null, end: null, daysLeft: 0, daysSince: 0, startsIn: 0, ...base };
}

// Copied from frozen src/app.jsx @ fe516c1:5569-5612.
function phaseArc(s, deps) {
  s = s || {};
  const today = (deps && deps.today) || isoOf(todayStart());
  const brkS = (deps && deps.brk) || dietBreakState(s, deps);
  const dx = _phaseSafe(() => dietExit(s), null);
  const committed = (s.plan && typeof s.plan === "object" && typeof s.plan.phase === "string") ? s.plan.phase : null;
  const exitStarted = (dx && dx.started) || null;

  let key;
  if (brkS.status === "active") key = "break";
  else if (committed === "leangain") key = "leangain";
  else if (committed === "maintenance" || exitStarted) key = "maintenance";
  else key = "cut";

  const startOf = { cut: START, break: brkS.start, maintenance: exitStarted, leangain: _phaseSince(s, "leangain") };
  const since = startOf[key] || START;
  const weeks = +(((mk(today) - mk(since)) / DAY) / 7).toFixed(1);
  const meta = PHASE_META[key] || PHASE_META.cut;

  // NEXT — honest foresight, one line, never a countdown (no show date exists — GOALS.md).
  let next;
  if (key === "cut") {
    if (brkS.status === "proposed") next = { key: "break", label: PHASE_META.break.label, when: `starts ${fmtShort(brkS.start)}`, note: "a planned week at maintenance — adherence and recovery, not a metabolic reset" };
    else next = { key: "maintenance", label: PHASE_META.maintenance.label, when: "when you and your coach call it — no date", note: "one step to your measured maintenance, hold, then decide — no automatic surplus" };
  } else if (key === "break") {
    next = { key: "cut", label: PHASE_META.cut.label, when: `resumes ${fmtShort(brkS.end)}`, note: "the deficit picks back up; the scale settles as the glycogen water comes back off" };
  } else if (key === "maintenance") {
    const ready = dx && dx.decideReady;
    next = { key: "leangain", label: "DECIDE", when: ready ? "your hold has the days behind it — decide with the numbers" : (dx && dx.readReady ? "a couple more weeks before the re-measured number is worth trusting" : "hold first — the scale means nothing for two weeks"), note: "a surplus is one option; staying here is another — there is no rule that the next phase is a build" };
  } else {
    next = { key: "leangain", label: "HOLD THE BUILD", when: "no fixed length — advanced lean-gain has no longitudinal data", note: "rate is expert-recommendation, not measurement (Iraki 2019); the app never quotes 1–2 lb of muscle a month for you" };
  }

  const sup = (deps && deps.sup) || phaseSupervisor(s, deps);
  const line = key === "break"
    ? `Diet break — day ${brkS.daysSince} of ${BREAK_LEN_DAYS}, ${brkS.daysLeft} to go. Eating at maintenance; the cut resumes ${fmtShort(brkS.end)}.`
    : key === "maintenance"
    ? `Maintenance hold — week ${weeks}. ${next.when}.`
    : key === "leangain"
    ? `Lean gain — week ${weeks}. Disciplined surplus, honest ceiling.`
    : `Cut — week ${weeks}. Next: ${next.label.toLowerCase()} (${next.when}).`;

  return { key, label: meta.label, toneKey: meta.toneKey, since, weeks, current: { key, label: meta.label, since, weeks }, next, line, brk: brkS, sup, order: PHASE_ORDER };
}

// Copied from frozen src/app.jsx @ fe516c1:5615-5619.
function _phaseSince(s, key) {
  const log = (s && s.plan && Array.isArray(s.plan.phaseLog)) ? s.plan.phaseLog : [];
  for (let i = log.length - 1; i >= 0; i--) { const e = log[i]; if (e && e.to === key && e.at) return String(e.at).slice(0, 10); }
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:5630-5666.
function phaseSupervisor(s, deps) {
  s = s || {};
  const ap = (deps && deps.ap) || _phaseSafe(() => autoPilot(s, apModeOf(s)), { ok: false });
  const esc = (deps && deps.esc) || _phaseSafe(() => escalation(s, ap), { ask: [], abstain: [], escalate: false });
  const ea = (deps && deps.ea) || _phaseSafe(() => energyAvailability(s), { gated: true });
  const ct = (deps && deps.ct) || _phaseSafe(() => energyBalanceTarget(s), { gated: true });
  // The supervisor's authority is over pressing the CUT deeper. Outside a cut (an active break, a
  // committed maintenance hold or lean gain) there is no deficit to press, so the cut-floor vetoes
  // do not apply — the supervisor stays quiet rather than nagging about a rate he is not running.
  const _spTISO = isoOf(todayStart());
  const _brk = s && s.plan && s.plan.brk;
  const _brkActive = !!(_brk && _brk.start && _brk.end && _spTISO >= _brk.start && _spTISO <= _brk.end);
  const _committed = (s && s.plan && typeof s.plan.phase === "string") ? s.plan.phase : null;
  const _exitStarted = !!(s && s.targets && s.targets.exitStart);
  const inCut = (deps && deps.inCut != null) ? deps.inCut : (!_brkActive && _committed !== "leangain" && _committed !== "maintenance" && !_exitStarted);
  const reasons = [];
  if (inCut) {
    // REUSE the per-adjustment supervisor's phase-relevant hard asks (redline / protein floor) verbatim.
    (esc.ask || []).forEach((a) => { if (a && (a.code === "redline" || a.code === "floor-protein")) reasons.push({ code: a.code, floor: true, text: a.text }); });
    // ENERGY AVAILABILITY under the engine's sparing line — the canonical "pause before pressing further" signal.
    if (ea && !ea.gated && ea.ea != null && ea.ea < EA_SPARING)
      reasons.push({ code: "ea", floor: true, text: `energy availability is ${ea.ea} kcal/kg lean, ${ea.ea < EA_LOW ? "under the " + EA_LOW + " line where over 40% of loss comes off muscle" : "under the " + EA_SPARING + " sparing line"} — a week at maintenance is the honest move before pressing the deficit further` });
    // The rate band's fast end is UNFUNDABLE (the floor binds) — the rate is misconfigured, not "eat at the floor".
    if (ct && !ct.gated && ct.floorBinds) reasons.push({ code: "floor", floor: true, text: "the band's fast end is under your energy-availability floor — the rate is set faster than your lean mass can fund, so ease it before going deeper" });
  }
  const veto = reasons.some((r) => r.floor);
  let kind = null;
  if (reasons.some((r) => r.code === "ea")) kind = "leaSentinel";         // N7/N8 — calculated EA can RAISE A SENTINEL, never propose a break (never clearance, never a calorie heuristic)
  else if (veto) kind = "blockDeeper";                                    // redline / protein / floor -> don't deepen; ease / transition
  return {
    veto, kind, reasons, first: reasons[0] || null,
    escalate: !!esc.escalate, escReason: esc.first || null,
    why: veto
      ? "A hard floor blocks pressing the cut further. The engine proposes the protective move — it never applies it on its own, and the number stays the engine's."
      : "Every hard floor is clear — the phase plan can proceed.",
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5672-5722.
function phaseProposal(s, deps) {
  s = s || {};
  const today = (deps && deps.today) || isoOf(todayStart());
  const brkS = (deps && deps.brk) || dietBreakState(s, deps);
  const sup = (deps && deps.sup) || phaseSupervisor(s, deps);
  const arc = (deps && deps.arc) || phaseArc(s, { ...(deps || {}), brk: brkS, sup });
  const h = brkS.honest;
  // 1) SUPERVISOR forces a break (EA under the sparing line) and none is armed/active -> propose one.
  if (sup.kind === "leaSentinel") {
    /* N8 — THE LEA SENTINEL: floor-binding/EA events surface a small symptom check —
       proposal-only, never a calorie heuristic. Libido/morning function is the one
       discriminating item (LEAM-Q, n=405); the rest is context. Persistent clusters
       are a HUMAN MEDICAL REVIEW conversation. */
    return { rid: "leasent_" + today, title: "LOW-ENERGY CHECK — ONE QUESTION THAT DISCRIMINATES", gate: null,
      why: "Calculated energy availability is running low. A number is never clearance and never a diagnosis — so the check is symptoms, and the one that discriminates in men is libido/morning function; energy, mood and hunger are context. Nothing here changes a calorie. If a cluster like that persists across weeks, the honest next step is a human medical review, not another heuristic.",
      apply: { kind: "note" } };
  }
  const brkCluster = (() => {
    /* N7 — the ONLY break proposer: a SUSTAINED reported adherence/recovery cluster,
       after sleep and logging are checked. Never duration, never one rate-floor
       event, never the residual. */
    try {
      const t7 = isoOf(todayStart());
      const eH7 = (s.energy || []).filter((x) => x.d < t7).slice(-7).map((x) => x.v);
      const lowEnergy = eH7.length >= 4 && eH7.slice().sort((a9, b9) => a9 - b9)[Math.floor(eH7.length / 2)] <= 2;
      const eb7 = energyBalanceTarget(s);
      const last7 = Object.entries(s.dailyLogs || {}).filter(([d, v]) => v && v.cal != null).slice(-7);
      const unmet = eb7 && eb7.hi ? last7.filter(([, v]) => v.cal > eb7.hi).length >= 3 : false;
      const recOff = recoveryIndex(s).band !== "GREEN";
      const sleepOK = sleepMean3At(s, t7);
      const estShare7 = last7.length ? last7.filter(([d]) => (((s.dayCtx || {})[d] || {}).est)).length / last7.length : 0;
      const n9 = [lowEnergy, unmet, recOff].filter(Boolean).length;
      return (n9 >= 2 && sleepOK && estShare7 < 0.5) ? { lowEnergy, unmet, recOff } : null;
    } catch (e) { return null; }
  })();
  if (brkCluster && (brkS.status === "none" || brkS.status === "recent")) {
    const start = today, end = isoOf(new Date(mk(today).getTime() + (BREAK_LEN_DAYS - 1) * DAY));
    return { rid: "phase_break_" + today, title: "DIET BREAK — A WEEK AT MAINTENANCE", gate: null,
      why: `${sup.first ? sup.first.text : "adherence and recovery"}. ${h.metabolic} ${h.scale}`,
      apply: { kind: "break", start, end, maintenance: brkS.maintenance } };
  }
  // 2) The cut has run to the diet exit and the athlete has committed nothing — offer the transition to
  //    maintenance (reuses the existing 'exit' machinery). Only once decideReady is meaningful; here it is
  //    offered as calm foresight, gated to the coach's call (no date, no auto-move).
  if (arc.key === "cut" && sup.kind === "blockDeeper") {
    return { rid: "phase_hold_" + today, title: "AT A FLOOR — REVIEW THE RATE WITH YOUR COACH", gate: null,
      why: `${sup.first ? sup.first.text : "a hard floor is binding"}. This is a flag to REVIEW the rate with your coach — nothing changes automatically, no target moves on its own, and the engine still owns the band.`,
      apply: { kind: "note" } };
  }
  return null;
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

// Copied from frozen src/app.jsx @ fe516c1:9812-9817.
function proposalDial(p) {
  if (!p || !p.apply) return null;
  if (p.apply.kind === "cal") return { unit: "kcal", step: 25, max: 50, base: p.apply.delta || 0 };
  if (p.apply.kind === "sets") return { unit: "set", step: 1, max: 1, base: p.apply.delta || 0 };
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:9833-9844.
function proposalEffect(p, nudge = 0) {
  const a = (p && p.apply) || {};
  if (a.kind !== "cal") return { via: null, calDelta: 0, stepsDelta: 0, nudge: 0 };
  const dial = proposalDial(p);
  const adj = dial ? Math.max(-dial.max, Math.min(dial.max, Math.round(nudge / dial.step) * dial.step)) : 0;
  const baseSigned = a.calDelta != null ? a.calDelta
    : (a.dir === "ease" ? Math.abs(a.delta || 0) : -Math.abs(a.delta || 0));   // labelled fallback: dir + magnitude
  const sgn = baseSigned < 0 ? -1 : 1;
  const calDelta = baseSigned + sgn * adj;   // the constrained dial moves the magnitude in the base direction (Dietvorst 2018)
  const stepsDelta = a.stepsDelta != null ? a.stepsDelta : 0;   // present only when the walking lever was armed
  return { via: "cal", calDelta, stepsDelta, nudge: adj };
}

// Copied from frozen src/app.jsx @ fe516c1:9848-9862.
function activeAdjustment(s) {
  const adj = (s && Array.isArray(s.adjustments)) ? s.adjustments : [];
  const reads = (s && Array.isArray(s.reads)) ? s.reads : [];
  for (let i = adj.length - 1; i >= 0; i--) {
    const a = adj[i];
    if (!a || a.undone || a.dismissed || !a.via) continue;   // only a live, applied steer carries an effect
    const from = a.from || a.d;
    const superseded = reads.some((r) => r && !r.sealed && !r.offWindow && r.d && from && r.d > from);   // next weigh-in reconciles it
    if (superseded) continue;
    return { active: true, via: a.via, calDelta: a.via === "cal" ? (a.calDelta || 0) : 0,
      stepDelta: a.via === "steps" ? (a.stepDelta || 0) : 0, rid: a.rid, title: a.title, from,
      why: "Holds until your next weigh-in, then the engine re-measures and takes the wheel." };
  }
  return { active: false, via: null, calDelta: 0, stepDelta: 0, rid: null, from: null, why: "" };
}

// Copied from frozen src/app.jsx @ fe516c1:9866-9870.
function apSteerHandled(s, tISO) {
  if (activeAdjustment(s).active) return true;
  return ((s && s.adjustments) || []).some((a) => a && !a.undone && a.d === tISO && a.rid &&
    (String(a.rid).indexOf("ap_") === 0 || String(a.rid).indexOf("apauto_") === 0));
}

// Copied from frozen src/app.jsx @ fe516c1:15046-15053.
function trendSeries(reads) {
  let t = null;
  return reads.map((r) => {
    if (t === null) t = r.w;
    else if (!r.sealed && !r.offWindow) t = +(t + Math.max(-1.5, Math.min(1.5, r.w - t)) * 0.3).toFixed(2);
    return { d: r.d, t };
  });
}

// Copied from frozen src/app.jsx @ fe516c1:15059-15071.
function weightNoise(reads) {
  const rs = (reads || []).filter((r) => !r.sealed && !r.offWindow && r.w != null);
  if (rs.length < 5) return { sd: 0.8, n: rs.length, measured: false };
  const byDate = Object.create(null);
  trendSeries(reads).forEach((p) => { byDate[p.d] = p.t; });
  const res = rs.map((r) => r.w - (byDate[r.d] != null ? byDate[r.d] : r.w)).filter((x) => isFinite(x));
  if (res.length < 5) return { sd: 0.8, n: res.length, measured: false };
  const mean = res.reduce((a, b) => a + b, 0) / res.length;
  const sd = Math.sqrt(res.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (res.length - 1));
  /* Clamped: under 0.3 would draw a hairline that implies scale precision nobody
     has, over 2.5 would swallow the chart. Both ends are honesty guards. */
  return { sd: +Math.max(0.3, Math.min(2.5, sd)).toFixed(2), n: res.length, measured: true };
}

// Copied from frozen src/app.jsx @ fe516c1:15085-15093.
function signalTicks(tau) {
  if (!isFinite(tau)) return 0;
  if (tau >= 3.3) return 5;
  if (tau >= 2.6) return 4;
  if (tau >= 1.9) return 3;
  if (tau >= 1.3) return 2;
  if (tau >= 1.0) return 1;
  return 0;
}

// Copied from frozen src/app.jsx @ fe516c1:15094-15128.
function signalState(s) {
  const r = currentRate(s);
  const clean = ((s && s.reads) || []).filter((x) => x && !x.sealed && x.w != null);
  const wn = weightNoise(clean);
  const sd = wn.sd;
  const n = r.n || 0;
  // persistence: consecutive same-direction steps at the end of the smoothed trend
  const ts = trendSeries(clean).map((p) => p.t);
  const dir = Math.sign(r.scale) || 1; // +1 = losing (trend descending)
  let run = ts.length >= 2 ? 1 : 0;
  for (let i = ts.length - 1; i >= 1; i--) {
    const step = ts[i - 1] - ts[i]; // > 0 when descending (losing)
    if (step !== 0 && Math.sign(step) === dir) run++;
    else break;
  }
  const hasCI = r.ci != null && r.ci > 0;
  const ciExcludesZero = hasCI && Math.sign(r.lo) === Math.sign(r.hi) && r.lo !== 0;
  const clearsNoise = Math.abs(r.scale) >= sd;
  const persists = run >= 6;
  const enough = n >= 14;
  const tau = hasCI ? Math.abs(r.scale) / (r.ci / 1.96) : 0;
  let state;
  if (!r.measured || r.method === "prior") state = "calibrating";
  else if (ciExcludesZero && r.scale < 0) state = "reversed";
  else if (ciExcludesZero && clearsNoise && persists && enough) state = "measured";
  else if (ciExcludesZero) state = "measurable";
  else state = "inside-noise";
  const WORD = { calibrating: "CALIBRATING", "inside-noise": "INSIDE NOISE", measurable: "MEASURABLE", measured: "MEASURED", reversed: "REVERSED" };
  return {
    state, word: WORD[state],
    scale: r.scale, lo: r.lo, hi: r.hi, ci: r.ci, n, sd, run,
    tau: +tau.toFixed(2), ticks: signalTicks(tau), finalDashed: state !== "measured",
    ciExcludesZero, clearsNoise, persists, enough, method: r.method,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:15146-15168.
// BRIEF-2 excludes UI wordColor: declaration and returned property omitted.
function signalReadCopy(s, sig) {
  const losing = sig.scale > 0;
  const rate = sig.scale != null ? `${losing ? "−" : "+"}${Math.abs(sig.scale).toFixed(RATE_DP)} lb/wk` : "";
  const showRate = sig.state === "measured" || sig.state === "measurable" || sig.state === "reversed";
  let sentence;
  switch (sig.state) {
    case "measured": sentence = losing ? "The cut is working — this week's drop is real now, not noise." : "The gain is real now — the trend has left the noise behind."; break;
    case "measurable": sentence = "The trend is leaning, but not certain yet — a few more clean mornings and we'll know."; break;
    case "reversed": sentence = "The trend has turned the wrong way — worth a look before it settles in."; break;
    case "calibrating": sentence = "Still learning your baseline — keep logging and the read sharpens."; break;
    default: sentence = "This week is still inside your noise — no real change to read yet.";
  }
  const clean = (s.reads || []).filter((r) => r && !r.sealed && !r.offWindow && r.w != null);
  const last = clean.length ? clean[clean.length - 1] : null;
  let rawLine = "";
  if (last) {
    const gap = last.w - (s.trend != null ? s.trend : last.w);
    const rel = Math.abs(gap) < 0.35 ? "on your trend" : gap > 0 ? "above trend" : "below trend";
    rawLine = `${last.w.toFixed(1)} lb this morning · ${rel}`;
  }
  return { rate, showRate, sentence, rawLine, word: sig.word };
}

return { signalState, weightNoise, trendSeries, signalReadCopy, autoPilot, autonomyOf, escalation, autoPilotPolicy, confidenceField, whyThisNumber, trackRecord, digitalTwin, twinBodyComp, forecastUncached, forecast, safeCrossing, redlineCrossing, rateDivergence, coneHalfWidth, normCdf, conditionalForesight, etaReached, phaseArc, dietBreakState, dietBreakHonest, phaseSupervisor, phaseProposal, activeAdjustment, apSteerHandled, proposalEffect, proposalDial, cap, signalTicks, structuralMovesThisWeek, daysBetween, _phaseSafe, _phaseSince };
};
