"use strict";

// Frozen read bodies; E and both identity caches belong to this engine instance.
module.exports = function createEnergy(E, { clock, ids }) {
const { DRIP_DEFAULT, DAY, ANCHOR_ERR_DEXA, ANCHOR_ERR_EYE, DRIP_HI, DRIP_LO, PROTEIN_FLOOR_G_PER_KG, PROTEIN_TOL_G, EA_KCAL_PER_1K_STEPS_PER_KG, REGIME_HOLD_D, PACE_PROJ_WKS, RATE_DP, STALE_DAYS, WALK_J_PER_KG_M, STEP_LEN_M, KCAL_PER_LB_FAT, EA_KCAL_PER_SESSION, EA_SPARING, EXIT_HOLD_MIN_WK, EXIT_HOLD_FULL_WK, COSTING_SEVERE_SE, BC, MAINT_KCAL_PER_LB, PHASES, EA_STEP_BASELINE, EA_LOW, PARTITION_REF_BF, PARTITION_FORBES_SLOPE, PRIOR_FAT_FRAC, PARTITION_ANCHORS_TO_NARROW, PARTITION_LABEL, KCAL_PER_LB_LEAN, KCAL_PER_LB_MIX, GAIN_FAT_FRAC_LO, GAIN_FAT_FRAC_HI, GAIN_FAT_FRAC, TDEE_ACC_LO, TDEE_ACC_HI, TDEE_EMA_ALPHA, TDEE_LABEL, TDEE_CONVERGE_MIN, ADAPT_LABEL, ADAPT_PERSIST_MIN, START, ROLLUPS, STEP_PUSH_CAP_OVER_BASE, STEP_PUSH_ABS_CEIL, STEP_PUSH_WEEKLY } = E;
const mk = (...args) => E.mk(...args);
const isoOf = (...args) => E.isoOf(...args);
const todayStart = (...args) => E.todayStart(...args);
const weeksBetween = (...args) => E.weeksBetween(...args);
const activeAdjustment = (...args) => E.activeAdjustment(...args);
const progressionTrend = (...args) => E.progressionTrend(...args);
const daysUntil = (...args) => E.daysUntil(...args);
const fmtShort = (...args) => E.fmtShort(...args);
const dayType = (...args) => E.dayType(...args);
const signalState = (...args) => E.signalState(...args);
const weekWeather = (...args) => E.weekWeather(...args);
const recoveryIndex = (...args) => E.recoveryIndex(...args);
const cleanAtDate = (...args) => E.cleanAtDate(...args);

// Copied from frozen src/app.jsx @ fe516c1:2835-2835.
function dripOf(s) { const d = s && s.model ? s.model.drip : null; return d == null ? DRIP_DEFAULT : d; }

// Copied from frozen src/app.jsx @ fe516c1:2874-2877.
function _sitesKey(sites) {
  const a = Array.isArray(sites) ? sites.filter((x) => typeof x === "string" && x).map((x) => x.toLowerCase().trim()) : [];
  return a.slice().sort().join("|");
}

// Copied from frozen src/app.jsx @ fe516c1:2878-2878.
function _skinSeriesKey(e) { return _sitesKey(e && e.sites) + "@@" + String((e && e.tester) || "").toLowerCase().trim(); }

// Copied from frozen src/app.jsx @ fe516c1:2883-2899.
function skinfoldCheck(s, entry) {
  const all = ((s && s.skinfolds) || []).slice().sort((a, b) => String(a.d).localeCompare(String(b.d)));
  const prev = all.length ? all[all.length - 1] : null;
  if (!entry || !Array.isArray(entry.sites) || !entry.sites.length) return { ok: false, breaks: false, why: "an entry needs the list of sites that were measured — the sum means nothing without it" };
  if (!prev) return { ok: true, breaks: false, first: true, why: "first entry — this starts the series" };
  const wasSites = _sitesKey(prev.sites), nowSites = _sitesKey(entry.sites);
  const missing = (prev.sites || []).filter((x) => !(entry.sites || []).some((y) => String(y).toLowerCase().trim() === String(x).toLowerCase().trim()));
  const extra = (entry.sites || []).filter((x) => !(prev.sites || []).some((y) => String(y).toLowerCase().trim() === String(x).toLowerCase().trim()));
  const testerChanged = String(prev.tester || "").toLowerCase().trim() !== String(entry.tester || "").toLowerCase().trim();
  if (wasSites === nowSites && !testerChanged) return { ok: true, breaks: false, why: "same sites, same tester — this continues the series" };
  const bits = [];
  if (missing.length) bits.push("missing " + missing.join(", "));
  if (extra.length) bits.push("added " + extra.join(", "));
  if (testerChanged) bits.push("different tester (" + (prev.tester || "unknown") + " -> " + (entry.tester || "unknown") + ")");
  return { ok: true, breaks: true, missing, extra, testerChanged,
    why: "This starts a NEW series — " + bits.join("; ") + ". The old one stays on file and stays readable; no change is computed across the boundary, because a difference in the instrument is not a change in you." };
}

// Copied from frozen src/app.jsx @ fe516c1:2902-2921.
function skinfoldSeries(s) {
  const all = ((s && s.skinfolds) || []).filter((e) => e && e.d && isFinite(+e.sumMm)).slice().sort((a, b) => String(a.d).localeCompare(String(b.d)));
  const out = [];
  for (const e of all) {
    const k = _skinSeriesKey(e);
    const cur = out.length ? out[out.length - 1] : null;
    if (!cur || cur.key !== k) out.push({ key: k, sites: (e.sites || []).slice(), tester: e.tester || null, entries: [e] });
    else cur.entries.push(e);
  }
  return out.map((sr) => {
    const n = sr.entries.length;
    const first = sr.entries[0], last = sr.entries[n - 1];
    const deltaMm = n >= 2 ? +(last.sumMm - first.sumMm).toFixed(1) : null;
    const days = n >= 2 ? Math.round((mk(last.d) - mk(first.d)) / DAY) : null;
    return { ...sr, n, from: first.d, to: last.d, firstMm: +first.sumMm, lastMm: +last.sumMm, deltaMm, days,
      /* null, never 0 — "no change measured" and "one reading" are different answers */
      why: n < 2 ? "one reading on this series — a tracker needs two before it can say anything about change"
        : `${deltaMm > 0 ? "+" : ""}${deltaMm} mm across ${days} days, same sites and same tester throughout. Millimetres, not a percentage: this tracks the DIRECTION and SIZE of fat change between anchors, and says nothing about lean mass.` };
  });
}

// Copied from frozen src/app.jsx @ fe516c1:2924-2930.
function skinfoldTrend(s) {
  const sr = skinfoldSeries(s);
  if (!sr.length) return { gated: true, n: 0, deltaMm: null, why: "no skinfold readings on file yet" };
  const cur = sr[sr.length - 1];
  return { gated: cur.n < 2, n: cur.n, deltaMm: cur.deltaMm, days: cur.days, from: cur.from, to: cur.to,
    sites: cur.sites, tester: cur.tester, priorSeries: sr.length - 1, why: cur.why };
}

// Copied from frozen src/app.jsx @ fe516c1:2932-2947.
function bfEst(s, trend = s.trend, atISO = isoOf(todayStart())) {
  const wks = Math.max(0, weeksBetween(s.model.anchorISO, atISO));
  const drip = dripOf(s);
  const lean = s.model.lean + drip * wks;
  const pct = +(((trend - lean) / trend) * 100).toFixed(1);
  /* The band. Two independent sources of error, neither of which shrinks with
     time: the anchor's own accuracy, and the unknown lean trajectory since. */
  const anchorErr = s.model.src === "DEXA" ? ANCHOR_ERR_DEXA : ANCHOR_ERR_EYE;
  const fromLean = (l) => ((trend - l) / trend) * 100;
  const lo = +(fromLean(s.model.lean + DRIP_HI * wks) - anchorErr).toFixed(1);
  const hi = +(fromLean(s.model.lean + DRIP_LO * wks) + anchorErr).toFixed(1);
  return {
    pct, lean: +lean.toFixed(1), lo, hi, wks: +wks.toFixed(1), anchorErr, src: s.model.src, drip,
    why: `Anchored ${wks < 1 ? "today" : `${Math.round(wks)} week${Math.round(wks) === 1 ? "" : "s"} ago`} by ${s.model.src === "DEXA" ? "DEXA (±1 point)" : `your coach's eye — and the live band is ${(hi - lo).toFixed(1)} points wide (${lo}–${hi}), asymmetric, because the anchor's own ±3.5 never washes out and the band integrates away from it`}. Lean mass since then is assumed flat — the evidence for a trained lean male in a deficit is −0.11 lb/wk median, and nothing in this app can measure it. The band is that uncertainty made visible rather than hidden behind a decimal.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:2959-2972.
function anchorTighten(s) {
  const bf = bfEst(s);
  const eye = ANCHOR_ERR_EYE, dexa = ANCHOR_ERR_DEXA;
  const half = +(((bf.hi - bf.lo) / 2)).toFixed(1);
  // A waist tape measures the lean trajectory (the drift half), leaving the
  // anchor's own accuracy; it cannot turn an eye anchor into a scan.
  const waistHalf = +Math.min(half, eye).toFixed(1);
  const steps = [
    { key: "today", label: "TODAY", note: s.model.src === "DEXA" ? `DEXA · ±${dexa}` : `coach's eye · ±${eye}`, half, state: "quiet" },
    { key: "waist", label: "+ WEEKLY WAIST TREND", note: "trajectory measured", half: waistHalf, state: "measurable" },
    { key: "dexa", label: "+ DEXA RE-ANCHOR", note: "measured ◆", half: dexa, state: "measured" },
  ];
  return { pct: bf.pct, lo: bf.lo, hi: bf.hi, wks: bf.wks, src: s.model.src, eye, dexa, steps };
}

// Copied from frozen src/app.jsx @ fe516c1:2977-3001.
function proteinTarget(s) {
  const bf = bfEst(s);
  const ffmKg = bf.lean / 2.2046;
  /* N5/B1 (nutrition round) — THE DYNAMIC EVIDENCE TARGET. The 12.2% body-fat switch
     is REMOVED: a sample-quartile boundary with subgroup intervals overlapping zero —
     a range cannot rescue an unsupported discontinuity. The target is 2.5 g/kg of his
     CURRENT measured FFM (2025 Bayesian deficit-protein meta-regression, authorship
     TBC — the zero-crossing for net lean change), recomputed whenever the estimate
     updates and moving in EITHER direction, shown against the estimate's own FFM
     interval. Eating above it is continuous owner preference, never body-fat-
     triggered. Joe's standing principle, on the record: "it should always be a
     dynamic evidence based target" — for every future target display, not just this
     one. */
  const floor = Math.round(ffmKg * PROTEIN_FLOOR_G_PER_KG);
  const g = Math.round(floor / 5) * 5;
  const bw9 = (s && s.trend) || (bf.lean / Math.max(0.5, 1 - bf.pct / 100));
  const gLo = Math.round(((bw9 * (1 - bf.hi / 100)) / 2.2046) * PROTEIN_FLOOR_G_PER_KG);
  const gHi = Math.round(((bw9 * (1 - bf.lo / 100)) / 2.2046) * PROTEIN_FLOOR_G_PER_KG);
  return {
    g, lo: g, hi: Math.max(g, Math.round(gHi / 5) * 5), floor, perKg: PROTEIN_FLOOR_G_PER_KG,
    gLo, gHi, inLeanSubgroup: false, straddles: false,
    ffmKg: +ffmKg.toFixed(1), bf: bf.pct, bfLo: bf.lo, bfHi: bf.hi,
    why: `${g} g today — ${PROTEIN_FLOOR_G_PER_KG} g per kg of your current measured ${(+ffmKg.toFixed(1))} kg lean mass (${gLo}–${gHi} g across the estimate's own ${bf.lo}–${bf.hi}% spread). It moves when the estimate moves, in either direction — the TARGET is always the evidence number, never a pinned constant; eating above it is preference, and legal. Protein is a FLOOR, not a bullseye — over it is never a miss. It does not rise on training days: the one study that compared day types found requirement HIGHER on REST days`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:3003-3003.
function proteinHit(target, g) { return g != null && g >= target - PROTEIN_TOL_G; }

// Copied from frozen src/app.jsx @ fe516c1:3032-3067.
function stepTarget(s) {
  /* STEPS ITEM A audit fix — the WHY used to claim "your maintenance was measured across
     [21-day window] averaging [21-day steps]" while observedTDEE measures it over the
     rate-matched window (36 days at ~16.8k). Two baseline-step numbers for one athlete,
     and the copy asserted the identity the mismatch broke. observedTDEE owns the
     measured-at figure now; this band owns recent behaviour; the copy states both. */
  let _tdA = null; try { _tdA = observedTDEE(s); } catch (e) { _tdA = null; }
  const cutoff = isoOf(new Date(todayStart().getTime() - 21 * DAY));
  /* SORTED, not insertion-ordered. dailyLogs is a plain object and its key order
     is whatever the writes happened to be; taking .slice(-7) off that gave the
     oldest seven days on a state written newest-first, which flipped the sign of
     the drift. A test caught it, which is the only reason this comment exists. */
  const rows = Object.entries(s.dailyLogs || {}).filter(([d, v]) => d >= cutoff && v && v.steps != null)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, v]) => v.steps);
  const bwKg = s.trend / 2.2046;
  const kcalPer1k = +(EA_KCAL_PER_1K_STEPS_PER_KG * bwKg).toFixed(1);
  if (rows.length < 8) return { gated: true, have: rows.length, need: 8, kcalPer1k, why: `${rows.length} of 8 logged step days — until then the target stays as written.` };
  const avg = rows.reduce((a, b) => a + b, 0) / rows.length;
  const r5 = (x) => Math.round(x / 500) * 500;
  const mid = r5(avg);
  const lo = r5(avg - 1000), hi = r5(avg + 1000);
  const recent = rows.slice(-7);
  const recentAvg = recent.length >= 5 ? recent.reduce((a, b) => a + b, 0) / recent.length : null;
  const drift = recentAvg != null ? Math.round(recentAvg - avg) : 0;
  const driftKcal = Math.round((drift / 1000) * kcalPer1k);
  /* v7.3.1 — an APPROVED "add steps" steer raises the effective step target by the same tracked,
     reversible offset (activeAdjustment), reconciling at the next weigh-in. Zero when none active. */
  const aaStep = activeAdjustment(s);
  const stepAdj = aaStep.via === "steps" ? (aaStep.stepDelta || 0) : 0;
  const midE = Math.max(0, mid + stepAdj), loE = Math.max(0, lo + stepAdj), hiE = Math.max(0, hi + stepAdj);
  return {
    gated: false, lo: loE, hi: hiE, mid: midE, baseMid: mid, adjSteps: stepAdj, days: rows.length, kcalPer1k, avg: Math.round(avg),
    recentAvg: recentAvg == null ? null : Math.round(recentAvg), drift, driftKcal,
    why: `Your maintenance was measured at ${(_tdA && _tdA.atSteps != null) ? _tdA.atSteps.toLocaleString() : Math.round(avg).toLocaleString()} average steps over its own ${(_tdA && _tdA.days) || rows.length}-day window — that number owns the claim. This band holds you to your RECENT ${rows.length}-day average of ${Math.round(avg).toLocaleString()}, and the two differ because your walking has been falling — so the calorie band is only right while the walking that produced it continues. Every 1,000 steps is worth about ${kcalPer1k} kcal at your bodyweight.${Math.abs(driftKcal) >= 40 ? ` Your last week runs ${drift > 0 ? "+" : ""}${drift.toLocaleString()} against that, which is about ${driftKcal > 0 ? "+" : ""}${driftKcal} kcal/day of maintenance the target has not caught up with yet.` : ""}`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:3380-3389.
function _stateAsOf(s, iso) {
  const out = { ...(s || {}) };
  out.reads = ((s && s.reads) || []).filter((r) => r && r.d && r.d <= iso);
  out.sessionLog = {};
  for (const d of Object.keys((s && s.sessionLog) || {})) if (d <= iso) out.sessionLog[d] = s.sessionLog[d];
  out.dailyLogs = {};
  for (const d of Object.keys((s && s.dailyLogs) || {})) if (d <= iso) out.dailyLogs[d] = s.dailyLogs[d];
  out.sleep = { ...((s && s.sleep) || {}), nights: (((s && s.sleep) || {}).nights || []).filter((n) => n && n.d && n.d <= iso) };
  return out;
}

// Copied from frozen src/app.jsx @ fe516c1:3391-3404.
function _regimeRaw(s) {
  const prog = progressionTrend(s);
  if (prog.state === "unknown") return { key: "unknown", prog, rate: null, why: prog.why };
  let r = null;
  try { r = currentRate(s); } catch (e) { r = null; }
  if (!r || !isFinite(r.scale) || !isFinite(r.lo) || !isFinite(r.hi)) return { key: "unknown", prog, rate: r, why: "no usable scale rate" };
  /* DERIVED, not authored: "losing" is the rate's own 95% interval sitting above
     zero; "~zero" is that interval spanning zero. No lb/wk constant appears. */
  const losing = r.lo > 0, zero = r.lo <= 0 && r.hi >= 0;
  if (prog.state !== "falling" && losing) return { key: "free", prog, rate: r, why: "lifts " + prog.state + " and fat still falling — both terms improving at once" };
  if (prog.state === "falling" && losing) return { key: "costing", prog, rate: r, why: "lifts falling while fat falls — this is now a trade, not a free lunch" };
  if (prog.state !== "rising" && zero) return { key: "accretionBound", prog, rate: r, why: "rate is indistinguishable from zero and lifts are not rising — the fat term is exhausted" };
  return { key: "unknown", prog, rate: r, why: "rate and progression do not describe a named regime" };
}

// Copied from frozen src/app.jsx @ fe516c1:3413-3422.
function regime(s, opts) {
  const asOf = (opts && opts.asOf) || isoOf(todayStart());
  const now = _regimeRaw(s);
  if (now.key === "unknown") return { key: "unknown", confirmed: false, pending: null, pendingSince: null, prog: now.prog, rate: now.rate, why: now.why };
  let prev = { key: "unknown" };
  try { prev = _regimeRaw(_stateAsOf(s, isoOf(new Date(mk(asOf).getTime() - REGIME_HOLD_D * DAY)))); } catch (e) { prev = { key: "unknown" }; }
  if (prev.key === now.key) return { key: now.key, confirmed: true, pending: null, pendingSince: null, prog: now.prog, rate: now.rate, why: now.why };
  if (prev.key === "unknown") return { key: now.key, confirmed: false, pending: null, pendingSince: null, basis: "first-establishment", prog: now.prog, rate: now.rate, why: now.why + " — not yet confirmed by a second reading a week back" };
  return { key: prev.key, confirmed: true, pending: now.key, pendingSince: asOf, prog: now.prog, rate: now.rate, why: "holding " + prev.key + " — " + now.key + " has been read once and needs a second reading " + REGIME_HOLD_D + " days apart before it counts" };
}

// Copied from frozen src/app.jsx @ fe516c1:3424-3504.
function currentRate(s) {
  const w = s.weekly || [];
  const rates = [];
  for (let i = 1; i < w.length; i++) rates.push((w[i - 1].trend - w[i].trend) / Math.max(0.5, weeksBetween(w[i - 1].wk, w[i].wk)));
  const reads = (s.reads || []).filter((r) => !r.sealed && !r.offWindow && r.w != null).slice(-28);
  if (reads.length >= 10) {
    const t0 = mk(reads[0].d).getTime();
    const xs = reads.map((r) => (mk(r.d).getTime() - t0) / DAY), ys = reads.map((r) => r.w);
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
    if (sxx > 0) {
      const slope = sxy / sxx;
      let sse = 0;
      const resid = [];
      for (let i = 0; i < n; i++) { const fit = my + slope * (xs[i] - mx); const e = ys[i] - fit; resid.push(e); sse += e * e; }
      const seOls = n > 2 && sxx > 0 ? Math.sqrt(sse / (n - 2) / sxx) : 0;
      /* ---------- AUTOCORRELATION_NOTE ----------
         Daily scale readings are strongly autocorrelated: water, glycogen and gut
         content persist across days, so today's residual carries yesterday's. OLS
         standard errors assume independent residuals, and under positive
         autocorrelation that assumption makes the printed interval TOO NARROW —
         overconfident in exactly the number the whole calorie prescription hangs
         off, which then propagates into observedTDEE, the forecast and the
         adaptation meter. One overconfident number, three dependent claims.

         Newey-West HAC with a Bartlett kernel fixes the variance without touching
         the slope: the point estimate is unchanged, only its honesty about spread
         moves. Bandwidth from the standard plug-in rule L = 4(n/100)^(2/9), which
         is 3 lags at n=28 — long enough to capture a multi-day water swing, short
         enough not to eat the sample.

         Both intervals are kept. `ci` is the HAC one, because that is the one worth
         believing; `ciOls` stays so the difference is visible rather than asserted,
         and rho1 is reported because it is the reason the correction is needed. */
      const L = Math.max(1, Math.floor(4 * Math.pow(n / 100, 2 / 9)));
      const u = resid.map((e, i) => e * (xs[i] - mx));
      let hac = u.reduce((a, b) => a + b * b, 0);
      for (let k = 1; k <= Math.min(L, n - 1); k++) {
        const wk = 1 - k / (L + 1);
        let cross = 0;
        for (let i = k; i < n; i++) cross += u[i] * u[i - k];
        hac += 2 * wk * cross;
      }
      /* A Bartlett-weighted sum can go negative in tiny samples; fall back to OLS
         rather than print an imaginary interval. */
      const seHac = hac > 0 ? Math.sqrt((hac / (sxx * sxx)) * (n / Math.max(1, n - 2))) : seOls;
      const se = Math.max(seHac, seOls);
      /* lag-1 residual autocorrelation — the diagnostic that justifies all of this */
      const rho1 = (() => {
        if (n < 4) return null;
        const m0 = resid.reduce((a, b) => a + b, 0) / n;
        let num = 0, den = 0;
        for (let i = 1; i < n; i++) num += (resid[i] - m0) * (resid[i - 1] - m0);
        for (let i = 0; i < n; i++) den += (resid[i] - m0) ** 2;
        return den > 0 ? +(num / den).toFixed(2) : null;
      })();
      const scale = +(-slope * 7).toFixed(2);
      const ci = +(1.96 * se * 7).toFixed(2);
      return {
        scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates,
        method: "regression", n, ci, lo: +(scale - ci).toFixed(2), hi: +(scale + ci).toFixed(2),
        /* the residual SD around the fitted trend, in lb — this is the RIGHT quantity
           for banding a single morning against the trend (see the noise floor card) */
        sigma: n > 2 ? +Math.sqrt(sse / (n - 2)).toFixed(2) : null,
        ciOls: +(1.96 * seOls * 7).toFixed(2), hacL: L, rho1, hacInflation: seOls > 0 ? +(se / seOls).toFixed(2) : null,
        /* the endpoints, not just the printable span — observedTDEE has to
           average intake over exactly this period or the arithmetic is wrong */
        from: reads[0].d, to: reads[n - 1].d,
        span: `${reads[0].d} → ${reads[n - 1].d}`,
      };
    }
  }
  if (rates.length >= 2) {
    const recent = rates.slice(-2);
    const scale = +(recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(2);
    return { scale, fat: +(scale + s.model.drip).toFixed(2), measured: true, rates, method: "snapshots", n: recent.length, ci: null };
  }
  return { scale: 1.0, fat: 1.25, measured: false, rates, method: "prior", n: 0, ci: null };
}

// Copied from frozen src/app.jsx @ fe516c1:3530-3530.
function paceShown(rc, pp) { return !!(rc && rc.showRate && pp && pp.ok); }

// Copied from frozen src/app.jsx @ fe516c1:3532-3549.
function paceProjection(s, wks = PACE_PROJ_WKS) {
  if (s == null || s.trend == null) return { ok: false, measured: false, wks, banded: false };   // G2 — BEFORE currentRate, which dereferences s immediately
  const cr = currentRate(s);
  if (!cr || !cr.measured) return { ok: false, measured: false, wks, banded: false };
  /* F — the card prints the rate at 1dp and the sentence invites the reader to multiply
     it out. Projecting off the raw 2dp rate made that arithmetic fail by up to the width
     of the band itself (trend 164.2, scale 1.34 shown as −1.3: 164.2 − 1.3×4 = 159.0, not
     the 158.8 the card printed). Project off the SHOWN figure, so what he can check by
     hand is what the card says. */
  const shown = +cr.scale.toFixed(RATE_DP);
  const mid = +(s.trend - shown * wks).toFixed(1);
  const banded = cr.ci != null && cr.lo != null && cr.hi != null;
  return {
    ok: true, measured: true, wks, mid, banded, rateShown: shown, fat: cr.fat, ci: cr.ci,   // I2 — no raw `rate`: rateShown is the one the card prints
    lo: banded ? +(s.trend - cr.hi * wks).toFixed(1) : null,   // G — raw CI bound: this endpoint is never printed AS a rate
    hi: banded ? +(s.trend - cr.lo * wks).toFixed(1) : null,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:3559-3566.
function readRecency(s) {
  const rs = ((s && s.reads) || []).filter((r) => r && r.d && r.w != null);
  if (!rs.length) return { lastISO: null, days: null, stale: false, threshold: STALE_DAYS, flag: null };
  const lastISO = rs.reduce((mx, r) => (r.d > mx ? r.d : mx), rs[0].d);
  const days = Math.max(0, Math.round((todayStart().getTime() - mk(lastISO).getTime()) / DAY));
  const stale = days >= STALE_DAYS;
  return { lastISO, days, stale, threshold: STALE_DAYS, flag: stale ? `reading is ${days} day${days === 1 ? "" : "s"} old · weigh in to refresh` : null };
}

// Copied from frozen src/app.jsx @ fe516c1:3651-3659 (hour read uses injected clock).
function readWindow(s, hour) {
  const h = typeof hour === "number" ? hour : clock.hour();
  const tISO = isoOf(todayStart());
  const dl = (s.dailyLogs || {})[tISO];
  const trained = !!(s.sessionLog || {})[tISO];
  const logged = !!(dl && dl.cal != null) || trained;
  const hasRead = (s.reads || []).some((r) => r && r.d === tISO && !r.offWindow);
  return { open: h < 12 && !trained, hasRead, logged, trained, hour: h };
}

// Copied from frozen src/app.jsx @ fe516c1:3664-3671.
function missedReadCost(s) {
  const tISO = isoOf(todayStart());
  const a = currentRate(s);
  if (!a || !a.measured) return { delta: null, why: "no measured rate to price against" };
  const s2 = { ...s, reads: [...(s.reads || []), { d: tISO, w: s.trend, sealed: false, pt: s.trend, note: "counterfactual — never stored" }] };
  const b = currentRate(s2);
  return { delta: (b && b.measured) ? +Math.abs(b.scale - a.scale).toFixed(2) : null, asIs: a.scale, withRead: b && b.scale };
}

// Copied from frozen src/app.jsx @ fe516c1:3729-3733.
function stepKcal(bwLb, steps, jPerKgM) {
  const kg = (Number(bwLb) || 0) / 2.2046;
  const j = (jPerKgM || WALK_J_PER_KG_M) * kg * STEP_LEN_M * (Number(steps) || 0);
  return j / 4184;
}

// Copied from frozen src/app.jsx @ fe516c1:3735-3856.
function observedTDEE(s, opts) {
  if (daysUntil(s.blackout.until) > 0) return null;
  const r = currentRate(s);
  if (!r.measured) return null;
  /* ---------- WINDOW_NOTE — the two halves of this sum must be the same period ----------
     Maintenance is (mean intake) + (weight lost x 3500 / days). Both terms have
     to come from the SAME stretch of calendar or the identity does not hold, and
     they did not: the rate ran a 28-read regression across 35 days while the
     intake average ran a fixed 21-day window. On this ledger those halves are
     genuinely different — the earlier fortnight averaged 1,953 kcal on 20,471
     steps, the later one 2,072 kcal on 16,526. Roughly 220 kcal/day of extra
     deficit produced part of the measured rate and never entered the intake
     average, so recent higher eating was being credited with a rate partly
     earned by an older, lower-intake, higher-step period. Result: maintenance
     read 2,681 when the matched-window figure is 2,631.

     ("Leaner" is the wrong word for that period and this file used it once. In
     an app that tracks lean mass as a quantity, and where he was six pounds
     HEAVIER then, it reads as body composition every time. Say kcal and steps.)

     The intake window is therefore taken from the rate's own endpoints. If the
     rate came from weekly snapshots rather than a regression it has no
     endpoints, and the old 21-day window is the fallback — stated, not hidden. */
  const fallback = isoOf(new Date(todayStart().getTime() - 21 * DAY));
  const from = r.from || fallback, to = r.to || isoOf(todayStart());
  let rows = Object.entries(s.dailyLogs).filter(([d, v]) => d >= from && d <= to && v && v.cal != null);
  const estOf9 = (d) => !!(((s.dayCtx || {})[d] || {}).est);
  const estW9 = opts && opts.estWeight != null ? opts.estWeight : null;   /* N2 — the DAILY FIT series down-weights estimate days; the primary band path stays byte-identical (THE HOLD) */
  /* matched only when the rate actually HAD endpoints to match against — a
     snapshot rate has none, and claiming a match there would be the same
     quiet fiction this whole note exists to remove */
  let matched = !!(r.from && r.to);
  if (rows.length < 8) { rows = Object.entries(s.dailyLogs).filter(([d, v]) => d >= fallback && v && v.cal != null); matched = false; }
  const estShare = rows.length ? rows.filter(([d]) => estOf9(d)).length / rows.length : 0;
  const cals = rows.map(([, v]) => v.cal);
  if (cals.length < 8) return null;
  const avg = estW9 == null ? ( cals.reduce((a, b) => a + b, 0) / cals.length) : (rows.reduce((a9, [d, v]) => a9 + v.cal * (estOf9(d) ? estW9 : 1), 0) / Math.max(1, rows.reduce((a9, [d]) => a9 + (estOf9(d) ? estW9 : 1), 0)));
  /* The two halves of the window, so the card can SHOW the difference rather
     than assert it. The first draft of that sentence said his earlier weeks
     "ran leaner", meaning ate less — in an app where lean mass is a tracked
     quantity and he was in fact six pounds heavier then, that is the one word
     it could not afford. Numbers do not have synonyms. */
  const sorted = rows.slice().sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const halfAt = Math.floor(sorted.length / 2);
  const halfAvg = (arr, k) => (arr.length ? Math.round(arr.reduce((a, [, v]) => a + (k === "cal" ? v.cal : v.steps || 0), 0) / arr.length) : null);
  const stepsOf = (arr) => { const w = arr.filter(([, v]) => v.steps != null); return w.length ? Math.round(w.reduce((a, [, v]) => a + v.steps, 0) / w.length) : null; };
  const half1 = sorted.slice(0, halfAt), half2 = sorted.slice(halfAt);
  const split = half1.length >= 4 && half2.length >= 4
    ? { calA: halfAvg(half1, "cal"), calB: halfAvg(half2, "cal"), stepA: stepsOf(half1), stepB: stepsOf(half2) }
    : null;
  /* The old ceiling was 1.6 lb/wk, and it BOUND on his real data: a rate of 1.55
     and a rate of 1.73 both saturated to the same number, so the estimate
     stopped responding to the data exactly where the data had most to say. The
     ceiling now sits at a genuinely physiological bound rather than a typical
     one, and it reports when it binds instead of silently truncating. */
  /* ---------- Two errors that were partly cancelling each other ----------
     The rate had the drip ADDED to it — the app assumed he must be losing more
     fat than the scale showed, because lean was going up. It was not (DRIP_NOTE).
     And the conversion used 3,500 kcal/lb, which is Wishnofsky's 1958 figure and
     is arithmetically equivalent to assuming 23% of the loss is lean tissue —
     a sedentary partitioning. For a lean male training hard on 2.76 g/kg FFM of
     protein, ~87% of the loss is fat, which prices at ~3,800 kcal/lb (Hall 2008:
     fat 4,282, lean 816).

     Inflating the pounds and under-pricing each pound pushed in opposite
     directions, which is why the total error is only ~100 kcal/day rather than
     300. Both are now correct rather than conveniently wrong together. */
  const RAW = r.scale;
  const CEIL = 3.0;
  const fatWk = Math.min(CEIL, RAW);
  const ed = energyDensity(s);   // v7.3.0 Slice 4 — the ONE fat-mass-dependent kcal/lb owner (== the prior 3800 until a DEXA identifies fat mass)
  const kcal = (f) => Math.round(avg + (f * ed.perLb) / 7);
  const tdee = kcal(fatWk);
  /* A thermodynamic floor check. If the implied deficit per pound exceeds the
     energy density of pure lipid, the model is claiming something impossible and
     should say so rather than print it. This is the check that caught the drip. */
  const impliedPerLb = fatWk > 0 ? Math.round(((tdee - avg) * 7) / fatWk) : null;
  const impossible = impliedPerLb != null && impliedPerLb > KCAL_PER_LB_FAT;
  /* The rate's own confidence interval, carried through to the TDEE. A single
     "measured TDEE" with no band invites a precision nobody has. */
  const lo = r.ci != null ? kcal(Math.min(CEIL, Math.max(0, r.lo))) : null;
  const hi = r.ci != null ? kcal(Math.min(CEIL, r.hi)) : null;
  /* R6 — the conditioning variable, reported. tdee itself is untouched. */
  const _logs6 = (s && s.dailyLogs) || {};
  const _d6 = Object.keys(_logs6).sort();
  const _stepsIn = (arr) => { const v = arr.map((d) => (_logs6[d] || {}).steps).filter((n) => n != null && isFinite(+n)).map(Number); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
  const atSteps = _stepsIn(_d6.slice(-Math.max(1, cals.length)));
  const stepsNow = _stepsIn(_d6.slice(-7));
  const bw6 = (s && s.trend) || null;
  const stepDelta = (atSteps != null && stepsNow != null && bw6) ? Math.round(stepKcal(bw6, stepsNow - atSteps)) : null;
  const tdeeAtNow = stepDelta != null ? tdee + stepDelta : null;
  /* STEPS ITEM A (R13) — the step delta is priced NET OF COMPENSATION, as a BAND.
     Added or removed activity is only partly additive: the body claws back ~25-30% in a
     lean subject (Careau et al., constrained-expenditure literature; leaner compensates
     less, ~30% vs ~46% at higher body fat). GRADE: MODERATE-HIGH, and the copy says so.
     The band runs gross at one edge to 70%-of-gross at the other, so the uncertainty is
     visible instead of hidden inside a coefficient.

     PROMOTION IS CONSERVATIVE, which is what unblocked R13's original hold: the measured
     35-day figure stays the headline UNLESS even the SMALLEST net reading of the drift
     (70% of gross) clears the measured number's own band halfwidth. Measured on the live
     ledger 2026-08-07: gross -115, net -80..-86, halfwidth 185 -> NOT promoted; the
     step story changes, the number he eats to does not. A projection must carry MORE
     uncertainty than a measurement, never quietly replace it inside its own noise. */
  const STEP_COMP_LO = 0.25, STEP_COMP_HI = 0.30;   // lean-subject compensation, Careau et al.
  const _halfw = (isFinite(hi) && isFinite(lo)) ? Math.round((hi - lo) / 2) : null;
  const tdeeAtNowGross = tdeeAtNow;
  const tdeeAtNowNet = stepDelta != null ? Math.round(tdee + stepDelta * (1 - STEP_COMP_HI)) : null;   // 70% of gross — the smallest honest reading
  const tdeeAtNowMid = stepDelta != null ? Math.round(tdee + stepDelta * (1 - (STEP_COMP_LO + STEP_COMP_HI) / 2)) : null;
  const stepPromoted = stepDelta != null && _halfw != null && Math.abs(stepDelta * (1 - STEP_COMP_HI)) > _halfw;
  const tdeePrimary = stepPromoted ? tdeeAtNowMid : tdee;
  return {
    tdee, days: cals.length, avg: Math.round(avg),
    atSteps, stepsNow, stepDelta, tdeeAtNow, tdeeAtNowGross, tdeeAtNowNet, tdeeAtNowMid,
    stepPromoted, tdeePrimary, stepCompLo: STEP_COMP_LO, stepCompHi: STEP_COMP_HI,
    stepsWhy: (atSteps == null || stepsNow == null) ? null
      : `${tdee} is your maintenance AT ${atSteps.toLocaleString()} average steps — the activity level of the ${cals.length} days it was measured over. You are averaging ${stepsNow.toLocaleString()} over the last seven, which prices at about ${tdeeAtNowNet}–${tdeeAtNowGross} once compensation is carried — the body claws back roughly a quarter to a third of an activity change in someone your leanness, so the gross figure is the edge of the band, not the number. ${stepPromoted ? `That drift clears the measured number's own noise, so the primary is now ${tdeePrimary}, if this week's steps hold — seven days is a projection, not a measurement.` : `That drift sits inside the measured number's own noise band (±${_halfw}), so ${tdee} stays the headline and this is the story behind it, not a new number.`} Steps are the cheapest lever here because adding them does not deepen the food deficit.`,
    lo, hi, clamped: RAW > CEIL, method: r.method, rateN: r.n,
    rate: r.scale, rateCi: r.ci, from, to, matched, split, estShare: +estShare.toFixed(2), estWeighted: estW9 != null,
    perLb: ed.perLb, perLbLo: ed.lo, perLbHi: ed.hi, edIdentified: ed.identified, impliedPerLb, impossible,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:3902-3914.
function calorieFloor(s) {
  const bf = bfEst(s);
  const ffmKg = bf.lean / 2.2046;
  const ea = energyAvailability(s);
  const eee = ea && !ea.gated ? ea.trainKcal : Math.round((EA_KCAL_PER_SESSION * 4) / 7);
  const raw = EA_SPARING * ffmKg + eee;
  const floor = Math.round(raw / 50) * 50;
  const soft = Math.round(((EA_SPARING + 5) * ffmKg + eee) / 50) * 50;
  return {
    floor, soft, ffmKg: +ffmKg.toFixed(1), eee: Math.round(eee),
    why: `${floor} is ${EA_SPARING} kcal per kg of your ${(+ffmKg.toFixed(1))} kg lean mass plus the ~${Math.round(eee)} a day your training costs — the IOC's own energy-availability formula, run backwards. No position stand anywhere states an absolute calorie floor for an athlete; all four I checked express it per kg of lean mass, which is why this one moves with you instead of sitting at a round number. Treat the 25 as a convention rather than a measurement: it comes from three single-subject case reports, and the IOC declines to set a threshold at all.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:3948-3987.
function dietExit(s) {
  const td = observedTDEE(s);
  const ct = energyBalanceTarget(s);
  const bf = bfEst(s);
  /* The hold clock only means something if something can start it. Nothing
     wrote exitStart, so readReady/decideReady were permanently false and the
     plan promised two milestones that could never arrive. It now reads the
     feed — the same place every other dated decision in this app lives — so
     applying the exit proposal starts the clock without a new storage field. */
  const started = (s.targets || {}).exitStart
    || (((s.feed || []).filter((f) => f.t === "DIET EXIT — MAINTENANCE HELD").pop() || {}).d)
    || null;
  if (!td) {
    /* N4 — the wash-in SEAL gates the maintenance read, never the hold CLOCK: the
       clock is a date fact and keeps counting through the sealed fortnight */
    return { gated: true, started, wksHeld: started ? +(((todayStart() - mk(started)) / DAY) / 7).toFixed(1) : 0, why: "Your maintenance is not measured yet, and the whole point of this plan is that the number you step up to is YOURS. Two clean weekly snapshots and it prints." };
  }
  const wksHeld = started ? +(((todayStart() - mk(started)) / DAY) / 7).toFixed(1) : 0;
  const step = ct.gated ? null : td.tdee - ct.mid;
  return {
    gated: false, started, wksHeld,
    maintenance: td.tdee, lo: td.lo, hi: td.hi, days: td.days,
    from: ct.gated ? null : ct.mid, step,
    holdMin: EXIT_HOLD_MIN_WK, holdFull: EXIT_HOLD_FULL_WK,
    readReady: started ? wksHeld >= EXIT_HOLD_MIN_WK : false,
    decideReady: started ? wksHeld >= EXIT_HOLD_FULL_WK : false,
    bf: bf.pct, bfLo: bf.lo, bfHi: bf.hi,
    /* The plan, in his words, with his numbers in it. */
    plan: [
      step == null
        ? `Step one: eat at ${td.tdee} — your measured maintenance, from ${td.days} logged days of your own intake against your own measured rate.`
        : `Step one: ${ct.mid} → ${td.tdee}. That is ${step > 0 ? "+" : ""}${step} kcal a day, in ONE step, not a ramp. ${td.tdee} is your measured maintenance from ${td.days} logged days — not a number anyone picked.`,
      `Step two: hold it — the REPLENISHMENT WASH-IN. ${EXIT_HOLD_MIN_WK} weeks before the scale means anything again — the first few pounds back are glycogen and the water bound to it, and reading those as fat is how people talk themselves back into a deficit they do not need. ${EXIT_HOLD_FULL_WK} weeks before your re-measured maintenance has enough days behind it to trust.`,
      `Step three: decide, with the numbers the hold produced. Not before, and not on a date. A surplus is one option; staying here is another, and there is no rule that says the next phase has to be a build.`,
    ],
    why: `Reverse dieting — creeping up a hundred calories a week — has no controlled trial behind it; it is practitioner convention. What is replicated is the value of time spent AT maintenance (MATADOR, Byrne 2018, and the diet-break literature), and none of that requires arriving there slowly. The old plan in this app aimed at ~2,450, which was authored and sits ${td.tdee - 2450 > 0 ? `${td.tdee - 2450} kcal under` : `${2450 - td.tdee} kcal over`} your actual measured maintenance — walking into a "maintenance" that is not your maintenance is just a smaller cut wearing a better name.`,
    /* Honest about what nobody knows. */
    unknown: `What no study can tell you: where to stop cutting. Your body fat reads ${bf.pct}% and the honest interval is ${bf.lo}–${bf.hi}%, which is too wide to hang a decision on. That call is yours and your coach's, from the mirror and the lifts — the app's job is to make sure the number you step UP to is real, not to tell you when to step.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:4118-4127.
function costingStep(deficit0, bandWidth, prog) {
  /* how many standard errors the UPPER bound sits below zero. hi < 0 is the definition of
     falling, so this is zero at the threshold and grows with the strength of the decline. */
  const hi = prog && isFinite(prog.hi) ? prog.hi : 0;
  const se = prog && isFinite(prog.se) && prog.se > 0 ? prog.se : null;
  const sev = (hi < 0 && se) ? Math.max(0, Math.min(1, Math.abs(hi) / (COSTING_SEVERE_SE * se))) : 0;
  const base = bandWidth > 0 ? bandWidth : deficit0;
  const step = base + sev * Math.max(0, deficit0 - base);
  return Math.max(1, Math.min(step, deficit0));   /* clamped at deficit0 — one step straight to measured maintenance, never past it */
}

// Copied from frozen src/app.jsx @ fe516c1:4133-4143.
function _costingWeeks(s, asOf, cap) {
  const lim = cap || 12;
  let held = 1;
  for (let k = 1; k <= lim; k++) {
    let r = null;
    try { r = _regimeRaw(_stateAsOf(s, isoOf(new Date(mk(asOf).getTime() - k * REGIME_HOLD_D * DAY)))); } catch (e) { break; }
    if (!r || r.key !== "costing") break;
    held++;
  }
  return held;
}

// Copied from frozen src/app.jsx @ fe516c1:4145-4245.
function energyBalanceTargetUncached(s, opts) {
  const reg = (opts && opts.regime) || regime(s);
  const key = reg && reg.key ? reg.key : "unknown";
  const cur = calorieTarget(s);
  const ed = energyDensity(s, "gain");
  const base = { regime: key, regimeWhy: reg && reg.why, regimeConfirmed: !!(reg && reg.confirmed) };
  /* PROVISIONAL IS NOT A PROPERTY OF THE BRANCH, IT IS A PROPERTY OF THE EVIDENCE.
     Every non-error return used to hardcode provisional:false while base carried
     regimeConfirmed from regime().confirmed — so on the first-establishment path
     the same object contradicted itself.

     That path is his next likely transition, and it is the one that moves the most
     money: he is in unknown now; the trend fills in and reads a steep decline;
     _regimeRaw(asOf-7) is still unknown, so regime() returns costing with
     confirmed:false and _costingWeeks returns 1. With severity maximal, immediate
     fires and a SINGLE UNCONFIRMED READING takes him from a ~530 kcal/day deficit
     to measured maintenance in one evaluation.

     The action is right and must not be slowed — waiting a week on a steep decline
     costs lean that takes months to rebuild. THE LABEL was wrong: a ~530 kcal move
     made on an unconfirmed regime is a STRONGER claim than a provisional hold, and
     it was announcing itself as a weaker one. */
  const unconfirmed = !base.regimeConfirmed;

  /* CARRY THE UNDERLYING REASON THROUGH. This used to replace calorieTarget's why with
     "the calorie band is gated upstream", which tells him a mechanism and not a reason —
     and drops the one sentence that says what the gate is waiting for. The regime genuinely
     cannot override a gate, so that fact is appended rather than substituted. */
  if (cur.gated) return { ...cur, ...base, dir: "deficit", provisional: true,
    why: (cur.why || "the calorie band is gated upstream") + " The regime cannot override a gate, so it is not deciding here either." };

  if (key === "accretionBound") {
    const bw = (s && s.trend) || null;
    const td = observedTDEE(s);
    if (!bw || !td || !isFinite(td.tdee)) return { ...cur, ...base, dir: "deficit", provisional: true, why: "accretion-bound, but no usable bodyweight or maintenance to price a surplus from — holding" };
    const kcalFor = (pct) => Math.round((((pct / 100) * bw) * ed.perLb) / 7);
    const lo = td.tdee + kcalFor(BC.BULK_CORR_PCT[0]);
    const hi = td.tdee + kcalFor(BC.BULK_REDLINE_PCT);
    return { ...cur, ...base, dir: "surplus", provisional: unconfirmed, lo, hi, mid: Math.round((lo + hi) / 2),
      capPct: BC.BULK_REDLINE_PCT, perLb: ed.perLb,
      why: `Lifts are not rising and the scale rate is indistinguishable from zero — the fat term is exhausted, so the only remaining way to move body composition is to build. ${lo}–${hi} is a surplus capped at ${+(BC.BULK_REDLINE_PCT * 4.345).toFixed(2)} %BW/MONTH (the settled monthly cap).`,
      doesNotBuy: "The cap is defensible, not optimal. The only trial in trained lifters ran at 18% of its own required sample size; what is well supported is that a bigger surplus reliably adds fat, not that it builds faster." };
  }

  if (key === "costing") {
    /* COSTING MUST NOT BE ABSORBING. The first build collapsed to a single fixed
       point (the shallow end of his own band) and stayed there forever. At that
       target the scale rate stays clearly above zero, so _regimeRaw reads costing
       again on every later evaluation and the state has no exit but progression
       recovering or Joe intervening by hand. accretionBound requires the rate
       interval to SPAN ZERO, and a fixed deficit never gets there — so the only
       door to a surplus was permanently shut by the branch that is supposed to be
       walking toward it.

       So each sustained costing evaluation steps the deficit DOWN toward zero and
       floors there. The step is one width of his own band — derived, so no new
       constant is authored — and a degenerate band goes straight to maintenance
       rather than stepping by a number nobody measured. */
    const td2 = observedTDEE(s);
    const asOf2 = (opts && opts.asOf) || isoOf(todayStart());
    if (!td2 || !isFinite(td2.tdee)) { const h0 = (opts && opts.heldWeeks != null) ? opts.heldWeeks : 1; return { ...cur, ...base, dir: "deficit", provisional: true, lo: cur.hi, hi: cur.hi, mid: cur.hi, shrunk: true, heldWeeks: h0, why: "lifts are falling but there is no usable maintenance to step the deficit against — holding at the shallow end of your band" }; }
    const deficit0 = Math.max(0, td2.tdee - cur.hi);
    const bandWidth = cur.hi - cur.lo;
    const prog = (opts && opts.prog) || (reg && reg.prog) || null;
    const step = costingStep(deficit0, bandWidth, prog);
    const conf = (reg && reg.prog && reg.prog.confidence) || "normal";
    /* THE CAP MUST DERIVE FROM THE WALK, NOT BE A FIXED 12. A hard cap re-creates
       the absorbing state at a different point: if the band ever narrows so that
       cap x step < deficit0, the walk strands short of maintenance and costing is
       terminal again. Derive the number of steps the walk actually needs and the
       failure mode cannot exist for any band. */
    const needed = step > 0 ? Math.ceil(deficit0 / step) + 1 : 1;
    const held = (opts && opts.heldWeeks != null) ? opts.heldWeeks : _costingWeeks(s, asOf2, needed);
    /* held === 1 is the evaluation at which costing is FIRST read, and it lands on
       cur.hi — the shallow end of his own band — rather than overshooting deeper
       than the free regime. That is right for a drift.

       It is wrong for a collapse. When severity is maximal the step is clamped to
       deficit0, and holding an intermediate week before exiting costs exactly what
       the asymmetry argument says not to spend: lean mass, during a deficit already
       diagnosed as costing it, recoverable only over months. So a maximal decline
       exits ON detection. The trigger is the clamp itself (step >= deficit0), not a
       second threshold. */
    const immediate = step >= deficit0;
    const stepsTaken = (held - 1) + (immediate ? 1 : 0);
    const deficit = step > 0 ? Math.max(0, deficit0 - stepsTaken * step) : 0;
    const tgt = Math.round(td2.tdee - deficit);
    if (deficit <= 0) return { ...cur, ...base, dir: "maintenance", provisional: unconfirmed, lo: tgt, hi: tgt, mid: tgt, shrunk: true, heldWeeks: held, steppedTo: 0,
      why: (conf === "low" ? "Your lifts are down and I cannot separate it from the short sleep — stepping the deficit out anyway, because waiting costs more here than being wrong does. " : "") + `Lifts have been falling for ${held} evaluation${held === 1 ? "" : "s"} and the deficit has been stepped all the way out. You are at measured maintenance (${tgt}). If progression still does not return from here, the fat term is exhausted and the next honest state is a surplus — which is what accretion-bound means.` };
    return { ...cur, ...base, dir: "deficit", provisional: unconfirmed, lo: tgt, hi: tgt, mid: tgt, shrunk: true, heldWeeks: held, steppedTo: deficit,
      why: (conf === "low" ? "Your lifts are down and I cannot separate it from the short sleep — stepping out anyway, because waiting costs more here than being wrong does. " : "") + `Lifts are falling while the scale still is, so the deficit has stopped being free and become a trade. Stepped down to ${tgt} — ${deficit} kcal under maintenance, one band-width less than last time. It keeps stepping toward maintenance for as long as this lasts, rather than parking at a number nobody measured.` };
  }

  if (key === "unknown") {
    return { ...cur, ...base, dir: "deficit", provisional: true,
      why: `Not enough clean training data to read a regime yet, so this HOLDS the prescription your own record validated — ${cur.lo}–${cur.hi}. The engine is not deciding here; it is holding. Abstaining is not a reason to stop doing the thing that is working.` };
  }

  return { ...cur, ...base, dir: "deficit", provisional: unconfirmed,
    why: `Lifts are holding or rising while fat falls — both halves of the objective are improving at once, which is the best state available. Hold ${cur.lo}–${cur.hi}.` };
}

// Copied from frozen src/app.jsx @ fe516c1:4253-4253.
const _ebtMemo = memoOnState(energyBalanceTargetUncached);

// Copied from frozen src/app.jsx @ fe516c1:4254-4254.
function energyBalanceTarget(s, opts) { return opts ? energyBalanceTargetUncached(s, opts) : _ebtMemo(s); }

// Copied from frozen src/app.jsx @ fe516c1:4256-4355.
function calorieTarget(s) {
  const td = observedTDEE(s);
  const band = cutRateBand(s).band;   // v6.2.1 — the Auto-Pilot mode now drives the calorie band (was fixed s.rate.band)
  const fl = calorieFloor(s);
  const floor = fl.floor;
  if (!td) {
    /* R4 — THE THIN-DATA FALLBACK, REPLACED BEFORE s.phase WAS DELETED, NOT AFTER.

       This read PHASES[s.phase] and returned the authored band. R4 deletes s.phase with
       the two body-fat triggers it serves, so done naively this returns lo:null hi:null —
       the fallback that exists PRECISELY for thin data returning nothing. And R2b made it
       load-bearing: energyBalanceTarget's first branch is `if (cur.gated)`, so the single
       owner of the calorie decision now routes through here.

       Same question, answered without a phase table and without a body-fat estimate: what
       to eat before there are enough clean days to measure his own maintenance. Measured
       bodyweight times a LABELLED convention, minus his own %BW-derived band. Every input
       is measured or cited; nothing here is authored except the convention, which says so. */
    const bwG = (s && s.trend) || null;
    if (!bwG) return { gated: true, from: "none", lo: null, hi: null,
      why: "No bodyweight on file yet, so there is nothing to price a target from. Log a weigh-in and this fills in immediately." };
    const estG = Math.round(MAINT_KCAL_PER_LB * bwG);
    const kcalForG = (lbWk) => Math.round((lbWk * energyDensity(s).perLb) / 7);
    const hiG = Math.max(floor, estG - kcalForG(band[0]));
    const loG = Math.max(floor, estG - kcalForG(band[1]));
    return { gated: true, from: "mass-estimate", lo: loG, hi: hiG, mid: Math.round((loG + hiG) / 2),
      tdee: estG, floor, band,
      /* R10 abstention rule: say what it is waiting for, not just that it is waiting. */
      why: `Not enough clean days to measure your own maintenance yet, so this prices ${estG} from your measured ${bwG} lb at ${MAINT_KCAL_PER_LB} kcal/lb — a labelled convention, not a measurement of you — and takes your own ${band[0]}–${band[1]} lb/wk band off it. It is an ESTIMATE standing in for a measurement, and it stops being one as soon as there are enough logged days; nothing here reads a body-fat number.` };
  }
  /* ---------- KCAL_PER_LB_NOTE — one conversion, not three ----------
     This used 3,500 kcal/lb while observedTDEE used KCAL_PER_LB_MIX (3,800) and
     the thermodynamic sanity check used KCAL_PER_LB_FAT (4,282). Three places
     converting pounds to calories, three different constants, all derived from
     the same ledger — which is the "number that changes between screens" failure
     the canonical block was built to stop, sitting inside the engine itself.

     3,500 is the Wishnofsky figure: 1958, pure adipose assumed, and wrong on its
     own terms — Hall 2008 puts adipose at 4,282 kcal/lb. What comes off the
     scale in a deficit is not pure adipose either, which is why the mixed figure
     exists and why observedTDEE already uses it. The target now uses the same
     one, so the calorie band and the maintenance it is subtracted from speak the
     same units. It moves the band down by roughly 40-60 kcal/day, which is the
     size of the error that was there. */
  const ed = energyDensity(s);   // v7.3.0 Slice 4 — the ONE energy-density owner (== the prior 3800 until a DEXA identifies fat mass; then fat-mass-dependent)
  const kcalFor = (lbWk) => Math.round((lbWk * ed.perLb) / 7);
  /* STEPS ITEM A — the target divides from tdeePrimary, which EQUALS the measured tdee
     until the net step drift clears the measurement's own noise (the no-precision-theatre
     guard). Today they are identical and the eat band is byte-identical; the promoted
     branch is driven by fixture. */
  const tdEff = (td.tdeePrimary != null ? td.tdeePrimary : td.tdee);
  const baseHi = Math.max(floor, tdEff - kcalFor(band[0]));
  const baseLo = Math.max(floor, tdEff - kcalFor(band[1]));
  /* v7.3.1 — an APPROVED Auto-Pilot steer is a tracked, reversible offset ADDED to the engine-owned
     base band (never mutating it): a tighten lowers it, an ease raises it, floored the same way, and it
     reconciles away at the next weigh-in (activeAdjustment). Zero offset when none is active, so every
     pre-existing band assertion is byte-identical. */
  const aaCal = activeAdjustment(s);
  const adjK = aaCal.via === "cal" ? (aaCal.calDelta || 0) : 0;
  const hi = Math.max(floor, baseHi + adjK);
  const lo = Math.max(floor, baseLo + adjK);
  const ph = PHASES[s.phase];
  const phaseLo = ph ? ph.band[0] : null, phaseHi = ph ? ph.band[1] : null;
  const drift = phaseHi != null ? Math.round((lo + hi) / 2 - (phaseLo + phaseHi) / 2) : 0;
  /* ---------- The number he was never shown: what he ACTUALLY averaged ----------
     A daily band tells him what to eat. It does not tell him whether he ate it,
     and on a plan with one high day a week those are different questions — his
     Wednesdays ran 2,395 against 1,893 on every other day, which lifted his
     weekly average about 72 kcal/day above his own band without a single card
     ever saying so. The target is daily; the result is weekly; both belong on
     the screen. */
  const wkRows = Object.entries(s.dailyLogs || {}).filter(([d, v]) => v && v.cal != null)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-7);
  const wkAvg = wkRows.length >= 4 ? Math.round(wkRows.reduce((a, [, v]) => a + v.cal, 0) / wkRows.length) : null;
  const wkOff = wkAvg == null ? null : wkAvg - Math.round((lo + hi) / 2);
  return {
    gated: false, from: "measured", lo, hi, mid: Math.round((lo + hi) / 2),
    baseLo, baseHi, adj: { delta: adjK, active: adjK !== 0, from: aaCal.from, rid: aaCal.rid, why: aaCal.why, clipped: (baseLo + adjK) < floor || (baseHi + adjK) < floor },
    wkAvg, wkN: wkRows.length, wkOff,
    /* "Inside the band" now means inside the BAND, not within an authored 60
       kcal of its midpoint — the band has width and that width is the whole
       point of expressing the target as one. And the lb/wk conversion uses the
       same kcal-per-pound the rest of the engine does; it was quoting 3,500 in
       the sentence he reads while the number above it was built on 3,800. */
    wkWhy: wkAvg == null ? null
      : (wkAvg >= lo && wkAvg <= hi) ? `Your last ${wkRows.length} logged days average ${wkAvg} — inside the ${lo}–${hi} band. The target and the result agree, which is the only state worth being in.`
      : `Your last ${wkRows.length} logged days average ${wkAvg}, which is ${Math.abs(wkAvg > hi ? wkAvg - hi : lo - wkAvg)} kcal/day ${wkAvg > hi ? "above the top" : "below the bottom"} of the ${lo}–${hi} band — about ${(Math.abs(wkAvg > hi ? wkAvg - hi : lo - wkAvg) * 7 / ed.perLb).toFixed(2)} lb/wk ${wkAvg > hi ? "slower" : "faster"} than the band is aiming for. Not a scolding, just the arithmetic: a daily target and a weekly result are different questions.`,
    tdee: td.tdee, tdeePrimary: td.tdeePrimary, stepPromoted: !!td.stepPromoted, tdeeLo: td.lo, tdeeHi: td.hi, days: td.days, avg: td.avg,
    band, phaseLo, phaseHi, drift, floorHit: lo === floor,
    floor, floorSoft: fl.soft, floorWhy: fl.why,
    /* If the floor is what's binding, the rate target is asking for more than
       energy availability allows — and the honest reading is that the rate is
       misconfigured, not that he should eat at the floor. */
    floorBinds: lo === floor && td.tdee - kcalFor(band[1]) < floor,
    floorBindsWhy: lo === floor && td.tdee - kcalFor(band[1]) < floor
      ? `Your band's fast end asks for ${td.tdee - kcalFor(band[1])}, which is under the ${floor} energy-availability floor, so the floor is what you are actually eating to. That is worth noticing rather than accepting: a floor that binds is telling you the rate target is set faster than your lean mass can fund, not that ${floor} is the right number. The fix is a slower band, not a lower plate.`
      : null,
    why: `Your measured maintenance is ${td.tdee}${td.lo && td.hi ? ` (${td.lo}–${td.hi} once the rate's own error is carried through)` : ""}, from ${td.days} logged days and a ${td.method === "regression" ? `least-squares rate across ${td.rateN} daily reads` : "snapshot rate"}${td.matched && td.from ? `, both measured over the same stretch — ${fmtShort(td.from)} to ${fmtShort(td.to)}. That matters because the two halves of that stretch are not the same: ${td.split ? `you averaged ${td.split.calA} kcal on ${td.split.stepA != null ? td.split.stepA.toLocaleString() + " steps" : "more walking"} in the first half and ${td.split.calB} on ${td.split.stepB != null ? td.split.stepB.toLocaleString() : "fewer"} in the second` : "you ate less and walked more earlier on"}. Averaging only the recent food against a rate the earlier weeks helped produce would read maintenance high` : ""}. Your band asks for ${band[0]}–${band[1]} lb/wk, which is ${kcalFor(band[0])}–${kcalFor(band[1])} kcal/day under it. That lands at ${lo}–${hi}.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:4416-4478.
function energyAvailability(s) {
  const cutoff = isoOf(new Date(todayStart().getTime() - 21 * DAY));
  const rows = Object.entries(s.dailyLogs || {}).filter(([d, v]) => d >= cutoff && v && v.cal != null);
  if (rows.length < 8) return { gated: true, have: rows.length, need: 8 };
  const cals = rows.map(([, v]) => v.cal);
  const intake = cals.reduce((a, b) => a + b, 0) / cals.length;
  const stepRows = rows.filter(([, v]) => v.steps != null).map(([, v]) => v.steps);
  const steps = stepRows.length ? stepRows.reduce((a, b) => a + b, 0) / stepRows.length : null;
  const bf = bfEst(s);
  const ffmKg = bf.lean / 2.2046;
  const bwKg = s.trend / 2.2046;
  if (!(ffmKg > 0)) return { gated: true, have: rows.length, need: 8 };

  /* Sessions per week. Measured from the log where the log is complete — but he
     started logging in-app part way through, so a raw count read 1.5 sessions a
     week for a man who trains four times, and under-charged training by two
     thirds. The programme itself knows the answer: dayType marks the upper and
     lower days. Take the higher of the two, because under-charging exercise
     inflates energy availability, which is the direction that hides a problem. */
  const sessDays = Object.keys(s.sessionLog || {}).filter((d) => d >= cutoff).length;
  const wks = Math.max(1, rows.length / 7);
  const logged = sessDays / wks;
  let scheduled = 0;
  for (let i = 0; i < 7; i++) { const d = isoOf(new Date(todayStart().getTime() - i * DAY)); const t2 = dayType(d, s); if (t2 === "U" || t2 === "L") scheduled++; }
  const perWk = Math.max(logged, scheduled);
  const sessPerDay = perWk / 7;
  const trainKcal = sessPerDay * EA_KCAL_PER_SESSION;
  const walkKcal = steps == null ? 0 : Math.max(0, (steps - EA_STEP_BASELINE) / 1000) * EA_KCAL_PER_1K_STEPS_PER_KG * bwKg;

  /* eaTrain is the CONVENTIONAL number and the only one comparable to the
     published thresholds. eaAll counts deliberate walking as training — a real
     reading of everything he burns in a day, but against no published line. */
  const eaTrain = +((intake - trainKcal) / ffmKg).toFixed(1);
  const eaAll = +((intake - trainKcal - walkKcal) / ffmKg).toFixed(1);
  const lo = Math.min(eaTrain, eaAll), hi = Math.max(eaTrain, eaAll);
  /* MARGINAL is a narrow early-warning band just above the line, not a wide
     anxious one: 25 is itself extrapolated, so a number 20% clear of it should
     read as clear rather than as nearly-in-trouble. */
  const band = eaTrain < EA_LOW ? "VERY LOW" : eaTrain < EA_SPARING ? "LOW" : eaTrain < EA_SPARING + 3 ? "MARGINAL" : "ADEQUATE";

  /* Which lever is cheaper — the actionable half, now priced off the
     conventional number so the instruction matches the verdict. Order matters:
     the trained-population evidence links LEAN MASS LOSS to deficit magnitude
     (Murphy & Koehler 2022, ES -3.1e-4 per kcal/day of deficit), and has nothing
     against walking as such — no concurrent-training meta-analysis has ever
     included a walking arm. So food is named first and steps second. */
  const needKcal = Math.max(0, Math.round(EA_SPARING * ffmKg - (intake - trainKcal)));
  const stepsToDrop = needKcal > 0 && walkKcal > 0 ? Math.round((needKcal / (EA_KCAL_PER_1K_STEPS_PER_KG * bwKg)) * 1000) : null;

  return {
    gated: false, lo, hi, band, ea: eaTrain, eaAll, intake: Math.round(intake), steps: steps == null ? null : Math.round(steps),
    ffmKg: +ffmKg.toFixed(1), trainKcal: Math.round(trainKcal), walkKcal: Math.round(walkKcal),
    sessPerWk: +(sessPerDay * 7).toFixed(1), days: rows.length, needKcal, stepsToDrop,
    receipts: [
      `Intake ${Math.round(intake)} kcal/day averaged over ${rows.length} logged days.`,
      `Training costs about ${Math.round(trainKcal)} kcal/day at ${(+perWk.toFixed(1))} sessions a week${logged < scheduled ? ` (the programme's ${scheduled}, not the ${(+logged.toFixed(1))} in the log — in-app logging started part way through, and under-charging training would flatter this number)` : ""} — an estimate, not a measurement.`,
      steps == null ? "No step data in the window." : `Walking ${Math.round(steps).toLocaleString()} steps/day costs roughly ${Math.round(walkKcal)} kcal/day above a sedentary baseline.`,
      `Fat-free mass ${(+ffmKg.toFixed(1))} kg, from the anchored lean model.`,
      `Counting structured training only — ${eaTrain} — is the convention the IOC's 2023 formula uses and the only one comparable to the 25 line, so it is the one banded above. Counting deliberate walking as training gives ${eaAll}; that is a true reading of everything you burn in a day but there is no published threshold built that way. Espinar 2026 measured the same swap in free-living athletes and it moved EA from ~32 to ~20 with nothing changing physiologically.`,
      `The 25 itself is extrapolated, not measured. Fagerberg 2018 proposes it from semi-starvation work and bodybuilder case reports and says plainly that no controlled male threshold study exists; the IOC 2023 declines a universal cut-off and gives males roughly 9-25. Treat it as a direction, and watch resting pulse, morning temperature and whether the lifts hold — those are measurements.`,
    ],
  };
}

// Copied from frozen src/app.jsx @ fe516c1:4481-4491.
function etaWeeks(s, targetPct, leanRate) {
  const r = currentRate(s);
  const dr = leanRate == null ? dripOf(s) : leanRate;
  let trend = s.trend, wks = 0;
  let lean = bfEst(s).lean;
  for (; wks < 30; wks++) {
    if (((trend - lean) / trend) * 100 <= targetPct) return wks;
    trend -= Math.max(0.3, r.scale); lean += dr;
  }
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:4498-4505.
function etaRange(s, targetPct) {
  const mid = etaWeeks(s, targetPct, DRIP_DEFAULT);
  const fast = etaWeeks(s, targetPct, DRIP_HI);
  const slow = etaWeeks(s, targetPct, DRIP_LO);
  const lean = bfEst(s).lean;
  const atWeight = +(lean / (1 - targetPct / 100)).toFixed(1);
  return { mid, fast, slow, atWeight, lean: +lean.toFixed(1) };
}

// Copied from frozen src/app.jsx @ fe516c1:4590-4590.
function apModeOf(s) { return (s && s.plan && s.plan.apMode === "fatloss") ? "fatloss" : "recomp"; }

// Copied from frozen src/app.jsx @ fe516c1:4591-4615.
function cutRateBand(s, mode) {
  const bw = (s && s.trend) || 165;
  const m = (mode || apModeOf(s)) === "fatloss" ? "fatloss" : "recomp";
  const pct = m === "fatloss" ? BC.CUT_FATLOSS_PCT : BC.CUT_RECOMP_PCT;
  /* R3 - ONE OWNER, AND IT IS THE CITED ONE. These were read raw off SEED.rate in
     POUNDS while the band beside them was converted from %BW by pctToLb, so they
     represented a LARGER fraction of bodyweight as he leaned out: the redline
     getting more permissive exactly when lean tissue is most at risk.

     And they were not merely inconsistent, they were INVERTED. bodyCompBand
     publishes redlinePct = BC.CUT_REDLINE_PCT = 1.0 %BW (Garthe 2011) and both the
     zone and escalation read it; redlineCrossing derived its own from the raw
     1.9 lb = 1.157 %BW. The ANTICIPATORY layer ran a threshold 16% more permissive
     than the alarm it exists to predict, so between 1.0 and 1.157 %BW/wk the
     escalation fired while the forecast still read clear. A foresight layer that
     triggers after the thing it forecasts is worse than none.

     SEED.rate.redline = 1.9 was authored and uncited, so it is DELETED rather than
     converted. At 163 lb this tightens the redline 1.9 -> 1.63 lb, the correct
     direction; his measured 1.17 lb/wk keeps a comfortable margin. */
  const floor = +((BC.CUT_FLOOR_PCT / 100) * bw).toFixed(2);
  const redline = +((BC.CUT_REDLINE_PCT / 100) * bw).toFixed(2);
  const pctToLb = (p) => +((p / 100) * bw).toFixed(2);
  return { mode: m, pct: pct.slice(), band: [pctToLb(pct[0]), pctToLb(pct[1])], floor, redline, floorPct: BC.CUT_FLOOR_PCT, redlinePct: BC.CUT_REDLINE_PCT };
}

// Copied from frozen src/app.jsx @ fe516c1:4623-4636.
function bodyCompBand(s, dir, mode) {
  const bw = (s && s.trend) || 165;
  const pctToLb = (p) => +((p / 100) * bw).toFixed(2);
  if (dir === "bulk") {
    return { dir: "bulk", bw, corrPct: BC.BULK_CORR_PCT.slice(), redlinePct: BC.BULK_REDLINE_PCT, floorPct: BC.BULK_CORR_PCT[0],
      corrLb: [pctToLb(BC.BULK_CORR_PCT[0]), pctToLb(BC.BULK_CORR_PCT[1])], redlineLb: pctToLb(BC.BULK_REDLINE_PCT), floorLb: pctToLb(BC.BULK_CORR_PCT[0]) };
  }
  const rb = cutRateBand(s, mode);   // v6.2.1 — mode-aware corridor; the Twin gauge + Auto-Pilot read this
  const band = rb.band;
  const floorLb = rb.floor;
  const lbToPct = (lb) => +((lb / bw) * 100).toFixed(2);
  return { dir: "cut", bw, corrPct: [lbToPct(band[0]), lbToPct(band[1])], redlinePct: BC.CUT_REDLINE_PCT, floorPct: lbToPct(floorLb),
    corrLb: [band[0], band[1]], redlineLb: pctToLb(BC.CUT_REDLINE_PCT), floorLb };
}

// Copied from frozen src/app.jsx @ fe516c1:4645-4651.
function rtAdherence(s) {
  const tISO = isoOf(todayStart());
  const keys = Object.keys((s && s.sessionLog) || {});
  if (!keys.length) return 1;                              // no history yet -> assume RT present
  const sess14 = keys.filter((d) => { const g = (mk(tISO) - mk(d)) / DAY; return g >= 0 && g < 14; }).length;
  return Math.max(0, Math.min(1, sess14 / 8));
}

// Copied from frozen src/app.jsx @ fe516c1:4652-4673.
function partitionRates(rate, s, dir) {
  const bw = (s && s.trend) || 165;
  const pct = Math.abs(rate) / bw * 100;
  if (dir === "cut") {
    const rt = rtAdherence(s);
    let leanFrac = Math.max(BC.CUT_LEAN_MIN, Math.min(BC.CUT_LEAN_MAX, BC.CUT_LEAN_BASE + (pct - BC.CUT_OPT_PCT) * BC.CUT_LEAN_SLOPE));
    // RT + protein retain most of the otherwise-lost lean; full retention holds lean flat, never
    // positive. A missed block (rt -> 0) lets the baseline lean loss back through.
    leanFrac = Math.max(0, leanFrac * (1 - BC.CUT_RT_RETENTION * rt));
    const lean = +(rate * leanFrac).toFixed(2);
    return { fat: +(rate - lean).toFixed(2), lean, leanFrac: +leanFrac.toFixed(3), rt: +rt.toFixed(2) };
  }
  // bulk: lean fraction of the GAIN, then HARD-capped by the MPS lean-gain ceiling — muscle
  // cannot be built faster than the ceiling no matter the surplus; the rest spills to fat.
  const gain = Math.abs(rate);
  let leanFrac = Math.max(BC.BULK_LEAN_MIN, Math.min(BC.BULK_LEAN_MAX, BC.BULK_LEAN_BASE - Math.max(0, pct - BC.BULK_REDLINE_PCT) * BC.BULK_LEAN_SLOPE));
  const ceilLb = (BC.BULK_LEAN_CEIL_PCT / 100) * bw;
  const leanMag = Math.min(gain * leanFrac, ceilLb);
  if (gain > 0) leanFrac = leanMag / gain;
  const lean = +(rate < 0 ? -leanMag : leanMag).toFixed(2);
  return { fat: +(rate - lean).toFixed(2), lean, leanFrac: +leanFrac.toFixed(3), rt: 1 };
}

// Copied from frozen src/app.jsx @ fe516c1:4749-4777.
function partitionPrior(s) {
  /* His personal p-ratio (fat fraction of each lb lost) as a RANGE — never a point. Governed by BF
     level (Forbes: leaner ⇒ a larger fraction of loss is lean), only WEAKLY identifiable from the
     scale, so the range narrows only as real DEXA anchors accumulate over months. Shares the physiology
     with partitionRates (the Twin's rate-decomposition) — this is the STANDING personal prior, that is
     the split of a specific projected rate: related, not a competing fit. Off a coach's-eye anchor the
     POINT stays the labeled prior (no faked precision); a DEXA lets it personalise. */
  let bf; try { bf = bfEst(s); } catch (e) { bf = null; }
  const anchors = (s && s.learned && Array.isArray(s.learned.anchors)) ? s.learned.anchors : [];
  const dexaN = anchors.filter((a) => a && a.src === "DEXA").length + ((s && s.model && s.model.src === "DEXA") ? 1 : 0);
  const identified = dexaN >= 1;   // a real fat-mass measurement before the point moves off the prior
  const bwKg = ((s && s.trend) ? s.trend : 165) / 2.2046;
  const fmKg = bf ? Math.max(0, (bf.pct / 100) * bwKg) : null;
  const tiltOf = (bfPct) => Math.max(-0.20, Math.min(0.20, (bfPct - PARTITION_REF_BF) * PARTITION_FORBES_SLOPE));
  const mid = Math.max(0.55, Math.min(0.97, PRIOR_FAT_FRAC + ((identified && bf) ? tiltOf(bf.pct) : 0)));
  // the RANGE half-width: from the BF band mapped through the same tilt, floored by identifiability
  const fromBand = (bf && identified) ? Math.abs(tiltOf(bf.hi) - tiltOf(bf.lo)) / 2 : 0;
  const idFloor = dexaN >= PARTITION_ANCHORS_TO_NARROW ? 0.03 : (dexaN === 1 ? 0.05 : 0.08);   // never a point; narrows with anchors
  const half = Math.max(fromBand, idFloor);
  const lo = Math.max(0.50, mid - half), hi = Math.min(0.98, mid + half);
  return {
    range: true, fatFrac: { lo: +lo.toFixed(3), mid: +mid.toFixed(3), hi: +hi.toFixed(3) },
    leanFrac: { lo: +(1 - hi).toFixed(3), mid: +(1 - mid).toFixed(3), hi: +(1 - lo).toFixed(3) },
    fmKg: fmKg != null ? +fmKg.toFixed(1) : null, dexaN, identified, label: PARTITION_LABEL,
    why: identified
      ? `Anchored to your measured body fat${bf ? " (" + bf.pct + "%)" : ""}. The range still carries the residual uncertainty — one scan sharpens the point, several narrow the band.`
      : `A prior from your body-fat level, held WIDE because the split is not identifiable from the scale alone. It narrows only as real DEXA anchors accumulate — ${dexaN} on file.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:4779-4797.
function energyDensityUncached(s) {
  /* ONE owner of kcal-per-lb-of-loss (was the fixed KCAL_PER_LB_MIX 3800). Fat-mass-dependent through
     the partition prior: perLb = fatFrac·fat-density + leanFrac·lean-density. HONEST degradation — off a
     coach's-eye BF the split is not identifiable, so the POINT stays the labeled prior (3800 EXACTLY, so
     nothing downstream shifts) with a WIDE band; a DEXA pins fat mass and lets it personalise (leaner ⇒
     lower kcal/lb ⇒ an asymmetric, smaller deficit per lb — Forbes/Hall). observedTDEE, the calorie band,
     the Twin and Auto-Pilot all READ this — no competing constant. */
  const p = partitionPrior(s);
  const dens = (ff) => ff * KCAL_PER_LB_FAT + (1 - ff) * KCAL_PER_LB_LEAN;
  const perLb = p.identified ? Math.round(dens(p.fatFrac.mid)) : KCAL_PER_LB_MIX;   // prior EXACTLY until a DEXA identifies fat mass
  const e1 = Math.round(dens(p.fatFrac.lo)), e2 = Math.round(dens(p.fatFrac.hi));
  return {
    perLb, lo: Math.min(e1, e2), hi: Math.max(e1, e2), prior: KCAL_PER_LB_MIX,
    identified: p.identified, fatFrac: p.fatFrac.mid, dexaN: p.dexaN,
    label: p.identified
      ? `~${perLb} kcal per lb lost, from your measured partition (${Math.round(p.fatFrac.mid * 100)}% fat). Leaner tissue prices lower, so the deficit per pound is fat-mass-dependent — not a fixed 3,500.`
      : `${KCAL_PER_LB_MIX} kcal per lb — the labeled prior (~${Math.round(PRIOR_FAT_FRAC * 100)}% fat). Held at the prior until a DEXA measures your fat mass; the ${Math.min(e1, e2)}–${Math.max(e1, e2)} band is that uncertainty made visible.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:4798-4798.
const _energyDensityLoss = memoOnState(energyDensityUncached);

// Copied from frozen src/app.jsx @ fe516c1:4802-4809.
function energyDensity(s, dir) {
  const base = _energyDensityLoss(s);
  if (dir !== "gain") return base;
  const dens = (f) => f * KCAL_PER_LB_FAT + (1 - f) * KCAL_PER_LB_LEAN;
  const g1 = Math.round(dens(GAIN_FAT_FRAC_LO)), g2 = Math.round(dens(GAIN_FAT_FRAC_HI));
  return { ...base, dir: "gain", perLb: Math.round(dens(GAIN_FAT_FRAC)), lo: Math.min(g1, g2), hi: Math.max(g1, g2), fatFrac: GAIN_FAT_FRAC, identified: false,
    label: Math.round(dens(GAIN_FAT_FRAC)) + " kcal per lb GAINED — a labelled prior (~" + Math.round(GAIN_FAT_FRAC * 100) + "% fat), not a measurement. Tissue gained is not tissue lost: pricing a surplus at the loss figure would overstate its cost by about 60%." };
}

// Copied from frozen src/app.jsx @ fe516c1:4817-4852.
function tdeeLearned(s, deps) {
  /* TDEE as a slowly-DRIFTING LATENT STATE, self-learning from HIS OWN data. observedTDEE(s) is today's
     matched-window fit; this smooths the PERSISTED SERIES of those fits with an exponential-forgetting
     update (EWMA α≈0.1/day ~ 10-day constant) so the estimate TRACKS his true maintenance responsively
     WITHOUT overfitting one noisy window. Converges ~2–4 wk. HONEST: it is TDEE-minus-logging-bias (not
     physiology), carries a band (~130–215 kcal/day realistic accuracy, Sanghvi 2015, widened when the
     fits disagree), and DEGRADES GRACEFULLY — a thin series just reports today's fit / still-calibrating. */
  const series = (deps && deps.series) || ((s && s.learned && Array.isArray(s.learned.tdee)) ? s.learned.tdee : []);
  const rows = series.filter((x) => x && typeof x.tdee === "number").slice(-60);
  const today = (deps && ("today" in deps)) ? deps.today : (() => { try { return observedTDEE(s); } catch (e) { return null; } })();
  if (!rows.length) {
    if (today && today.tdee) return { value: today.tdee, lo: today.lo, hi: today.hi, n: 0, converged: false, source: "today", accLo: TDEE_ACC_LO, accHi: TDEE_ACC_HI, alpha: TDEE_EMA_ALPHA, label: TDEE_LABEL, why: "Not enough history to smooth yet — this is today's matched-window fit, still calibrating (~2–4 wk to converge)." };
    return { value: null, lo: null, hi: null, n: 0, converged: false, source: "none", accLo: TDEE_ACC_LO, accHi: TDEE_ACC_HI, alpha: TDEE_EMA_ALPHA, label: TDEE_LABEL, why: "Maintenance is not measurable yet — keep logging and it converges in ~2–4 weeks." };
  }
  let ema = rows[0].tdee;
  for (let i = 1; i < rows.length; i++) ema = TDEE_EMA_ALPHA * rows[i].tdee + (1 - TDEE_EMA_ALPHA) * ema;
  if (today && today.tdee && rows[rows.length - 1].tdee !== today.tdee) ema = TDEE_EMA_ALPHA * today.tdee + (1 - TDEE_EMA_ALPHA) * ema;   // fold today in — stays responsive between writes
  const recent = rows.slice(-TDEE_CONVERGE_MIN).map((x) => x.tdee);
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const sd = recent.length >= 3 ? Math.sqrt(recent.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (recent.length - 1)) : 0;
  const n = rows.length, converged = n >= TDEE_CONVERGE_MIN;
  /* N2 — the band is EMPIRICAL: rolling one-step forecast errors of this very EMA
     against each next fit (his own data grading his own estimator). Under 6 errors the
     provisional floor stands, widened before convergence. */
  const fErr = [];
  { let e9 = null;
    for (const r9 of series) { if (e9 != null && r9.tdee != null) fErr.push(Math.abs(r9.tdee - e9)); e9 = e9 == null ? r9.tdee : TDEE_EMA_ALPHA * r9.tdee + (1 - TDEE_EMA_ALPHA) * e9; } }
  const q90 = fErr.length >= 6 ? fErr.slice().sort((a, b) => a - b)[Math.min(fErr.length - 1, Math.floor(fErr.length * 0.9))] : null;
  const acc = Math.round(Math.max(q90 != null ? Math.max(q90, sd) : (converged ? TDEE_ACC_HI : TDEE_ACC_HI + 120), sd));   // empirical when it can be, honest floor until then
  const value = Math.round(ema);
  return {
    value, lo: value - acc, hi: value + acc, n, converged, source: "ema", acc, sd: +sd.toFixed(0),
    accLo: TDEE_ACC_LO, accHi: TDEE_ACC_HI, alpha: TDEE_EMA_ALPHA, label: TDEE_LABEL,
    why: `A ${Math.round(1 / TDEE_EMA_ALPHA)}-day exponential average of ${n} of your own maintenance fits — it tracks the drift without chasing one noisy morning. ${converged ? "Converged" : "Still converging (~2–4 wk)"}. This is APPARENT maintenance under a 3,500-kcal/lb convention — it includes net log error, which can run either direction — carried with a ±${acc} kcal band calibrated from your own forecast errors. Not a physiological TDEE.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:4859-4930.
function adaptationSignal(s, deps) {
  /* METABOLIC ADAPTATION = observed maintenance drifting BELOW the twin's MASS-predicted maintenance by
     more than noise. As he loses weight, expected maintenance falls from mass alone; adaptation is the
     EXTRA drop (adaptive thermogenesis). GATED on SIGNIFICANCE (the residual band clears zero AND the
     underlying rate signal is real) + PERSISTENCE (below-expected across ≥3 updates, never one reading)
     — the same discipline as the staleness/confidence gates, because short windows confound adaptation
     with logging drift. Directional CALIBRATION (~−85 kcal/day after moderate loss in trained athletes),
     never a target. FEEDS FORWARD — informs the forecast cone + the Slice-5 phase arc. The mass
     expectation is a labeled ESTIMATE (a maintenance coefficient), preferred over naïve RMR-per-kg but
     not claimed as physiology. */
  const series = (deps && deps.series) || ((s && s.learned && Array.isArray(s.learned.tdee)) ? s.learned.tdee : []);
  const rows = series.filter((x) => x && typeof x.tdee === "number" && typeof x.w === "number").slice(-60);
  let sig; try { sig = (deps && deps.sig) || signalState(s); } catch (e) { sig = { state: "calibrating" }; }
  const off = (reason) => ({ detected: false, reason, kcal: null, lo: null, hi: null, n: rows.length, persistent: false, significant: false, perLbCoef: MAINT_KCAL_PER_LB, label: ADAPT_LABEL, why: "No confident adaptation signal yet — gated on significance + persistence so a single low week can't fire it." });
  if (rows.length < ADAPT_PERSIST_MIN + 1) return off("too-thin");                                   // graceful: not enough history
  if (!(sig.state === "measured" || sig.state === "measurable")) return off("signal-not-real");       // significance gate on the rate itself
  const base = rows[0];
  /* R6 — SUBTRACT THE DETERMINISTIC STEP TERM BEFORE LOOKING FOR RESIDUAL ADAPTATION.

     This predicted expected maintenance from BODY MASS ONLY. Observed maintenance falls
     when he walks less; mass-predicted maintenance barely moves. So the residual absorbed
     an activity change and reported it as adaptive thermogenesis — THE APP WOULD DIAGNOSE
     METABOLIC ADAPTATION FOR A MAN WHO STOPPED WALKING, pointing him away from a real and
     fixable behaviour. His steps are down 19,794 -> 14,694 across the window.

     Attributing the step term deterministically beats estimating a coefficient from 35
     noisy days: the walking cost is measured (Sci Rep 2019, 2.4 J/kg/m) and the step count
     is logged, so there is nothing to fit.

     AND IT ABSTAINS WHEN STEPS ARE TOO VARIABLE to attribute cleanly — a residual dominated
     by activity swings is not evidence about metabolism either way. Abstention is a first-
     class answer here, the same as everywhere else in this engine. */
  const _lg6 = (s && s.dailyLogs) || {};
  const _stepAt = (iso) => { const v = (_lg6[iso] || {}).steps; return v != null && isFinite(+v) ? Number(v) : null; };
  const _baseSteps = _stepAt(base.d);
  const stepTermAt = (x) => {
    const sN = _stepAt(x.d);
    if (sN == null || _baseSteps == null || !x.w) return 0;
    return stepKcal(x.w, sN - _baseSteps);
  };
  /* variance gate: if the step record swings more than the effect being measured, abstain */
  const _sVals = rows.map((x) => _stepAt(x.d)).filter((n) => n != null);
  const _sMean = _sVals.length ? _sVals.reduce((a, b) => a + b, 0) / _sVals.length : null;
  const _sSd = _sVals.length > 1 && _sMean ? Math.sqrt(_sVals.reduce((a, b) => a + (b - _sMean) * (b - _sMean), 0) / (_sVals.length - 1)) : null;
  const stepSwingKcal = (_sSd != null && base.w) ? Math.abs(stepKcal(base.w, _sSd)) : null;
  const predAt = (w) => base.tdee + MAINT_KCAL_PER_LB * (w - base.w);                                  // mass-driven expectation (falls as mass falls)
  const resid = rows.map((x) => ({ d: x.d, stepAdj: Math.round(stepTermAt(x)), r: x.tdee - predAt(x.w) - stepTermAt(x), lo: (x.lo != null ? x.lo : x.tdee) - predAt(x.w) - stepTermAt(x), hi: (x.hi != null ? x.hi : x.tdee) - predAt(x.w) - stepTermAt(x) }));
  /* N3 — NONOVERLAPPING persistence: each daily fit spans ~the same 21-28d window, so
     consecutive rows are pseudo-replicates. Keep one row per 21 days, then ask for
     ADAPT_PERSIST_MIN of THOSE below zero. */
  const last = resid[resid.length - 1];
  const spaced9 = [];
  for (const z9 of resid) { if (!spaced9.length || (mk(z9.d) - mk(spaced9[spaced9.length - 1].d)) / DAY >= 21) spaced9.push(z9); }
  const tail = spaced9.slice(-ADAPT_PERSIST_MIN);
  const persistent = tail.length >= ADAPT_PERSIST_MIN && tail.every((z) => z.r < 0);                    // persistently BELOW mass-expected, on NONOVERLAPPING windows
  /* R6 abstention — a residual smaller than the activity swing that produced it is not
     evidence about metabolism. Named in the reason so it does not read as "no adaptation". */
  if (stepSwingKcal != null && Math.abs(last.r) < stepSwingKcal) return off("activity-drift");
  if (tail.length < ADAPT_PERSIST_MIN) return off("too-thin");   /* N3 — not enough NONOVERLAPPING windows yet */
  const significant = last.hi < 0;                                                                      // the whole residual band clears zero
  const detected = persistent && significant;
  const kcal = Math.round(tail.reduce((a, z) => a + z.r, 0) / tail.length);
  return {
    detected, reason: detected ? "adaptation" : (persistent ? "not-significant" : "not-persistent"),
    kcal, lo: Math.round(last.lo), hi: Math.round(last.hi), n: rows.length,
    stepAdj: Math.round(stepTermAt(rows[rows.length - 1])), stepSwingKcal: stepSwingKcal == null ? null : Math.round(stepSwingKcal),
    persistent, significant, perLbCoef: MAINT_KCAL_PER_LB, label: ADAPT_LABEL,
    why: detected
      ? `Your measured maintenance has run ~${Math.abs(kcal)} kcal/day BELOW what mass loss alone predicts, across the last ${ADAPT_PERSIST_MIN}+ updates with the band clear of zero — a persistent signal across NONOVERLAPPING windows with the band clear of zero. It informs the forecast only — never a phase change, never a break. Calibration for the plan (it informs the phase arc + the forecast), not a target; the mass expectation is an estimate, so this is a direction, not a decimal.`
      : `No confident residual: ${persistent ? "the drop isn't yet clear of the noise band" : "it hasn't persisted across enough nonoverlapping windows"}. Gated on significance + persistence so a single low week can't fire it — and even fired, it informs forecasts only.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5157-5166.
function memoOnState(fn) {
  const cache = new WeakMap();
  return (s) => {
    if (s == null || typeof s !== "object") return fn(s);
    if (cache.has(s)) return cache.get(s);
    const v = fn(s);
    cache.set(s, v);
    return v;
  };
}

// Copied from frozen src/app.jsx @ fe516c1:6935-6964.
function liveRollups(s) {
  const dates = [...new Set([...Object.keys(s.dailyLogs), ...s.reads.map((r) => r.d), ...s.sleep.nights.map((n) => n.d), ...Object.keys(s.sessionLog)])].filter((d) => d > "2026-07-21").sort();
  if (!dates.length) return [];
  const wkOf = (d) => Math.floor((mk(d) - mk(START)) / (7 * DAY)) + 1;
  const wks = {};
  dates.forEach((d) => { (wks[wkOf(d)] = wks[wkOf(d)] || []).push(d); });
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  return Object.keys(wks).map(Number).sort((a, b) => b - a).map((wk) => {
    const rows = wks[wk].map((d) => ({
      d,
      w: (s.reads.find((r) => r.d === d && !r.sealed && !r.offWindow) || {}).w ?? null,
      sealedW: (s.reads.find((r) => r.d === d && r.sealed) || {}).w ?? null,
      cal: (s.dailyLogs[d] || {}).cal ?? null, pro: (s.dailyLogs[d] || {}).pro ?? null,
      steps: (s.dailyLogs[d] || {}).steps ?? null, slp: (s.sleep.nights.find((n) => n.d === d) || {}).h ?? null,
      note: (s.sessionLog[d] || {}).note || "", niggles: (s.sessionLog[d] || {}).niggles || [],
    }));
    const ws = rows.filter((r) => r.w != null).map((r) => r.w);
    const cals = rows.filter((r) => r.cal != null).map((r) => r.cal);
    const pros = rows.filter((r) => r.pro != null).map((r) => r.pro);
    const st = rows.filter((r) => r.steps != null).map((r) => r.steps);
    const sl = rows.filter((r) => r.slp != null).map((r) => r.slp);
    const startD = isoOf(new Date(mk(START).getTime() + (wk - 1) * 7 * DAY));
    const endRaw = new Date(mk(START).getTime() + ((wk - 1) * 7 + 6) * DAY);
    const endD = isoOf(endRaw > todayStart() ? todayStart() : endRaw);
    return { wk, live: true, rows, days: rows.map((r) => r.d), range: `${fmtShort(startD)} – ${fmtShort(endD)}`,
      avgW: ws.length ? +avg(ws).toFixed(1) : null, avgCal: cals.length ? Math.round(avg(cals)) : null,
      avgPro: pros.length ? Math.round(avg(pros)) : null, proHit: pros.filter((x) => proteinHit(proteinTarget(s).lo, x)).length, proN: pros.length,
      avgSteps: st.length ? +(avg(st) / 1000).toFixed(1) : null, avgSlp: sl.length ? +avg(sl).toFixed(1) : null, flags: 0 };
  });
}

// Copied from frozen src/app.jsx @ fe516c1:7164-7187.
function stepEfficacy(s) {
  const wks = [...liveRollups(s), ...ROLLUPS].filter((w) => w.avgSteps != null && w.avgW != null);
  const pairs = [];
  let excluded = 0;
  for (let i = 0; i < wks.length - 1; i++) {
    const wkDays = (wks[i].days || []).concat(wks[i + 1].days || []);
    if (wkDays.length && !weekWeather(s, wkDays).clean) { excluded++; continue; }
    const drop = wks[i + 1].avgW - wks[i].avgW; pairs.push({ steps: wks[i].avgSteps, drop });
  }
  if (pairs.length < 4) return { status: "ARMED", n: pairs.length, need: 4, slopePer1k: null, excluded };
  const ms = pairs.reduce((a, p) => a + p.steps, 0) / pairs.length, md = pairs.reduce((a, p) => a + p.drop, 0) / pairs.length;
  let num = 0, den = 0; pairs.forEach((p2) => { num += (p2.steps - ms) * (p2.drop - md); den += (p2.steps - ms) ** 2; });
  const slopePer1k = den ? +((num / den) * 1000).toFixed(3) : 0;
  /* PHYSICAL BOUND — the observedTDEE `impossible` precedent, applied here. 1,000 daily
     steps is ~stepKcal(bw,1000) kcal/day ≈ 0.06 lb/wk at his mass. A fitted slope far
     outside that is calorie confounding wearing a step costume: the verdict is UNRESOLVED,
     not negative. On the live ledger the n=4 fit reads -78.9 — thirteen hundred times the
     ceiling — and the old per-step toFixed(2) display bug had been rounding that absurdity
     to 0.00, hiding it. An instrument must never deliver a verdict physics forbids. */
  const bwSE = (s && s.trend) || 163;
  const boundPer1k = +((stepKcal(bwSE, 1000) * 7) / KCAL_PER_LB_MIX).toFixed(3);
  const resolved = den > 0 && Math.abs(slopePer1k) <= boundPer1k * 5;   /* AUDIT rider: den === 0 (zero step variance) fitted slope 0 and called it a RESOLVED null verdict — a health claim on zero evidence. Unreachable with real float averages; explicit anyway. */
  return { status: "LIVE", n: pairs.length, need: 4, slopePer1k, boundPer1k, resolved, excluded };
}

// Copied from frozen src/app.jsx @ fe516c1:7218-7260.
function stepPush(s, opts) {
  const today = isoOf(todayStart());
  const st = stepTarget(s);
  if (st.gated) return { mode: "HOLD", why: "too few logged step days to steer from" };
  let td = null; try { td = observedTDEE(s); } catch (e) { td = null; }
  const base = (td && td.atSteps != null) ? td.atSteps : st.avg;
  const bw = (s && s.trend) || null;
  let r = null; try { r = currentRate(s); } catch (e) { r = null; }
  const bc = bodyCompBand(s);
  const pctRate = (r && r.measured && isFinite(r.scale) && bw) ? (r.scale / bw) * 100 : null;
  const below = bc.dir === "cut" && pctRate != null && pctRate < bc.corrPct[0];
  if (!below && !(opts && opts.accelerate)) {
    /* AUDIT rider: this string claimed "inside the corridor" unconditionally — live today
       the rate is ABOVE the corridor top, which is a different fact. Dead surface until
       R15 reads these modes, but a mode string that misstates the state is the R10 family. */
    const above = bc.dir === "cut" && pctRate != null && pctRate > bc.corrPct[1];
    return { mode: "HOLD", base, why: (above ? "the rate is ABOVE the corridor — the deficit is already running hotter than the band asks, so more steps is not the question today. " : pctRate != null ? "the rate is inside the corridor — " : "the rate is not measurable yet — ") + "hold the walking that produced your maintenance. The coach reaches for this lever only when the objective wants more deficit." };
  }
  const rec = recoveryIndex(s);
  const slept = cleanAtDate(s, today);
  if (rec.band === "LOW" || !slept) return { mode: "WITHHELD", base, veto: rec.band === "LOW" ? "recovery" : "sleep",
    why: `more deficit is wanted, but ${rec.band === "LOW" ? "recovery is LOW" : "sleep is in debt"} — the body is not funding what it already does, so it is not asked to fund more. The push returns when the flag clears.` };
  /* A5 (volume-verdicts round) — the sets arm is DELETED: sets and the scale are
     different attribution domains, so a set-count change no longer blocks a steps push
     (and a steer no longer blocks a set-add — volumePush's mirror arm died in the same
     change). The scale's one-at-a-time budget lives with the calorie/step levers;
     Auto-Pilot's tighten still waits out new-volume repair water, which is a
     measurement-honesty rule about the SCALE READ, not a budget coupling. */
  const cap = Math.min(Math.max(base + STEP_PUSH_CAP_OVER_BASE, 12000), STEP_PUSH_ABS_CEIL);
  const cur = st.mid;
  if (cur + 500 > cap) return { mode: "WITHHELD", base, veto: "ceiling", cap,
    why: `you are already at the step ceiling (${cap.toLocaleString()} — your measured baseline plus the headroom the evidence supports). Past here compensation eats the return and the recovery caveats bite: more deficit now comes from food, priced by the calorie card.` };
  const se = (opts && opts.stepeff) || stepEfficacy(s);
  if (se.status === "LIVE" && se.resolved && se.slopePer1k != null && se.slopePer1k <= 0) return { mode: "NOPUSH_HEALTH", base, stepeff: se,
    why: `across ${se.n} clean week-pairs, your own record shows extra steps NOT converting to extra loss — so steps are cardiovascular health here, and calories are your fat lever. The coach will not push a lever your data says is not connected.` };
  const inc = Math.min(STEP_PUSH_WEEKLY, cap - cur);
  const gross = bw ? Math.round(stepKcal(bw, inc)) : null;
  const netLo = gross != null ? Math.round(gross * 0.70) : null;
  const netHi = gross != null ? Math.round(gross * 0.75) : null;
  return { mode: "PUSH", inc, cap, base, cur, grossKcal: gross, netLoKcal: netLo, netHiKcal: netHi, stepeff: se,
    grade: se.status === "LIVE" && se.resolved ? "measured-on-you" : "moderate",
    why: `the rate is under the corridor, and steps are the lean-cheaper deficit: +${inc.toLocaleString()} steps/day is worth about ${netLo}\u2013${netHi} kcal/day once compensation is carried — the body claws back a quarter to a third of an activity change — against the same kcal cut from food, which is the variable tied to lean loss. ${se.status === "LIVE" && se.resolved ? `Your own ${se.n} clean week-pairs show extra steps converting to loss.` : `The mechanism is sound and coaches agree, but no trial handed us this number — your own step-efficacy read is ${se.status === "LIVE" ? "too confounded to resolve yet" : "still accruing"}, so this is checked against your weeks as they arrive.`}` };
}

return { currentRate, _stateAsOf, _regimeRaw, regime, observedTDEE, stepKcal, calorieFloor, bfEst, dripOf, anchorTighten, proteinTarget, proteinHit, cutRateBand, bodyCompBand, apModeOf, calorieTarget, energyBalanceTarget, energyBalanceTargetUncached, costingStep, _costingWeeks, energyAvailability, energyDensity, energyDensityUncached, partitionPrior, tdeeLearned, adaptationSignal, readRecency, paceProjection, paceShown, readWindow, missedReadCost, stepTarget, stepPush, stepEfficacy, etaWeeks, etaRange, dietExit, partitionRates, rtAdherence, memoOnState, skinfoldCheck, skinfoldSeries, skinfoldTrend, _sitesKey, _skinSeriesKey, liveRollups };
};
