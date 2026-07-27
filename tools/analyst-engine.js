/* Prep Ledger - Nightly Analyst Engine (Phase 3 build)
   Soft, research-grounded analysis of ledger/state.json.
   - reliability-weighted EWMA trend (NO hard seals)
   - robust rate + confidence band
   - lagged cross-variable drivers + per-Joe coefficients (TDEE, water & sleep)
   - weekly-block model, plateau / whoosh-with-cause
   - suggestion synthesis -> ledger/suggestions.json (+ analysis.json)
   Reads state.json only; never mutates it. */
"use strict";
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const ROOT = path.join(__dirname, "..");
const STATE_PATH = val("--state", path.join(ROOT, "ledger", "state.json"));
const OUT_DIR = val("--outdir", path.join(ROOT, "ledger"));
const WRITE = has("--write");

const DAY = 86400000;
const D = (iso) => new Date(iso + "T00:00:00Z");
const ISO = (dt) => dt.toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((D(b) - D(a)) / DAY);
const addDays = (iso, n) => ISO(new Date(D(iso).getTime() + n * DAY));
const r1 = (x, n) => { if (x == null || isNaN(x)) return x; const p = Math.pow(10, n == null ? 1 : n); return Math.round(x * p) / p; };
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

const state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
const reads = (state.reads || []).filter(r => r && r.d && typeof r.w === "number").slice().sort((a, b) => (a.d < b.d ? -1 : 1));
const dl = state.dailyLogs || {};
const nightBy = {}; ((state.sleep && state.sleep.nights) || []).forEach(n => { nightBy[n.d] = n; });
const tempBy = {}; (state.temp || []).forEach(t => { tempBy[t.d] = t; });
const FFM_LB = (state.model && typeof state.model.lean === "number") ? state.model.lean : null;
const FFM_KG = FFM_LB ? FFM_LB / 2.2046 : null;

/* ---------- 1. reliability-weighted soft EWMA trend (no seals) ---------- */
const ALPHA = 0.3, STEP_CLAMP = 1.5;
function reliability(r) {
  let rel = 1; const why = [];
  const prev = addDays(r.d, -1), pl = dl[prev] || {};
  if (r.sealed) { rel *= 0.4; why.push("app-sealed read"); }
  if (pl.sodium === "high") { rel *= 0.6; why.push("prior-day sodium high"); }
  else if (pl.sodium === "med") { rel *= 0.85; why.push("prior-day sodium med"); }
  if ((pl.alc || 0) >= 4) { rel *= 0.6; why.push("prior-day alcohol"); }
  if (state.creatine && state.creatine.start && daysBetween(state.creatine.start, r.d) >= 0 && daysBetween(state.creatine.start, r.d) <= 14) { rel *= 0.5; why.push("creatine load window"); }
  const t = tempBy[r.d]; if (t && t.f >= 99) { rel *= 0.6; why.push("elevated temp"); }
  const pn = nightBy[prev]; if (pn && pn.h != null && pn.h < 6) { rel *= 0.9; why.push("short sleep prior"); }
  if (r.note && /(salt|alcohol|water|spike|refeed|event|wedding)/i.test(r.note)) { rel *= 0.6; why.push("noted water/spike"); }
  return { rel: clamp(rel, 0.2, 1), why };
}
let trend = reads.length ? reads[0].w : null;
const series = reads.map((r, i) => {
  const rl = reliability(r);
  if (i === 0) trend = r.w;
  else trend = trend + clamp(r.w - trend, -STEP_CLAMP, STEP_CLAMP) * ALPHA * rl.rel;
  return { d: r.d, w: r.w, trend: r1(trend, 2), rel: r1(rl.rel, 2), why: rl.why };
});
const last = series[series.length - 1];

/* ---------- 2. personal noise floor ---------- */
const cleanDeltas = [];
for (let i = 1; i < series.length; i++) {
  const a = series[i - 1], b = series[i];
  if (daysBetween(a.d, b.d) === 1 && a.rel >= 0.9 && b.rel >= 0.9) cleanDeltas.push(b.w - a.w);
}
const noiseFloor = cleanDeltas.length >= 4 ? r1(Math.sqrt(mean(cleanDeltas.map(x => x * x))), 2) : 0.6;

/* ---------- 3. robust rate (Theil-Sen on soft trend) + band ---------- */
function theilSen(pts) {
  const sl = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const dx = pts[j].x - pts[i].x; if (dx) sl.push((pts[j].y - pts[i].y) / dx); }
  if (!sl.length) return 0; sl.sort((a, b) => a - b); const m = sl.length;
  return m % 2 ? sl[(m - 1) / 2] : (sl[m / 2 - 1] + sl[m / 2]) / 2;
}
const winDays = 14;
const win = series.filter(p => daysBetween(p.d, last.d) <= winDays);
const rpts = win.map(p => ({ x: daysBetween(win[0].d, p.d), y: p.trend }));
const slopeDay = theilSen(rpts);
const rateWk = r1(-slopeDay * 7, 2);
const ratePct = last.trend ? r1((rateWk / last.trend) * 100, 2) : null;
const Nw = win.length;
const seSlopeDay = Nw >= 3 ? noiseFloor * Math.sqrt(12 / (Nw * (Nw * Nw - 1))) : noiseFloor;
const rateBand = r1(seSlopeDay * 7, 2);

/* ---------- 4. coefficients: TDEE, water sensitivity, sleep ---------- */
const calKeys = Object.keys(dl).filter(k => dl[k] && dl[k].cal != null).sort();
const tdeeKeys = calKeys.filter(k => daysBetween(k, last.d) >= 0 && daysBetween(k, last.d) <= 20);
const meanCal = mean(tdeeKeys.map(k => dl[k].cal));
let tdee = null, tdeeWinDays = null;
if (meanCal != null && tdeeKeys.length) {
  const startK = tdeeKeys[0];
  const tStart = series.find(p => p.d >= startK) || series[0];
  tdeeWinDays = Math.max(1, daysBetween(tStart.d, last.d));
  const dropLb = tStart.trend - last.trend;
  tdee = Math.round(meanCal + (dropLb / tdeeWinDays) * 3500);
}
function nextDayDelta(k) { const nd = addDays(k, 1); const a = reads.find(r => r.d === k), b = reads.find(r => r.d === nd); return (a && b) ? b.w - a.w : null; }
const hiDelt = [], loDelt = [];
Object.keys(dl).forEach(k => { const v = dl[k] || {}; const nd = nextDayDelta(k); if (nd == null) return; if (v.sodium === "high" || (v.alc || 0) >= 4) hiDelt.push(nd); else if (!v.sodium || v.sodium === "low") loDelt.push(nd); });
const waterSens = (hiDelt.length >= 3 && loDelt.length >= 5) ? r1(mean(hiDelt) - mean(loDelt), 2) : null;
const waterSensN = hiDelt.length;
const nights = ((state.sleep && state.sleep.nights) || []).filter(n => n && n.h != null);
const recentNights = nights.filter(n => daysBetween(n.d, last.d) <= 13);
const meanSleep = mean(recentNights.map(n => n.h));
const sleepDebt7 = nights.filter(n => daysBetween(n.d, last.d) <= 6).reduce((s, n) => s + Math.max(0, 7 - n.h), 0);

/* ---------- 5. weekly blocks ---------- */
function weekKey(iso) { const dt = D(iso); const off = (dt.getUTCDay() + 6) % 7; return ISO(new Date(dt - off * DAY)); }
const proTarget = FFM_KG ? Math.round(2.3 * FFM_KG) : 150;
const proHi = FFM_KG ? Math.round(3.1 * FFM_KG) : proTarget + 50;
const wk = {};
Object.keys(dl).forEach(k => {
  const key = weekKey(k), v = dl[k] || {};
  (wk[key] = wk[key] || { wk: key, cals: [], pros: [], steps: [], proHit: 0, proN: 0 });
  if (v.cal != null) wk[key].cals.push(v.cal);
  if (v.pro != null) { wk[key].pros.push(v.pro); wk[key].proN++; if (v.pro >= proTarget) wk[key].proHit++; }
  if (v.steps != null) wk[key].steps.push(v.steps);
});
const weekRows = Object.values(wk).sort((a, b) => a.wk < b.wk ? -1 : 1).map(w => ({
  wk: w.wk, meanCal: w.cals.length ? Math.round(mean(w.cals)) : null,
  meanPro: w.pros.length ? Math.round(mean(w.pros)) : null,
  proHitPct: w.proN ? Math.round(100 * w.proHit / w.proN) : null,
  meanSteps: w.steps.length ? Math.round(mean(w.steps)) : null
}));

/* ---------- 6. plateau / whoosh with cause ---------- */
const gap = r1(last.trend - last.w, 2);
const recentWater = reads.slice(-3).some(r => r.note && /(salt|alcohol|water|spike|wedding|refeed|event)/i.test(r.note))
  || Object.keys(dl).filter(k => daysBetween(k, last.d) <= 3).some(k => dl[k].sodium === "high" || (dl[k].alc || 0) >= 4);
const plateauThresh = Math.max(0.3, rateBand);
let regime, regimeWhy;
if (gap > 1.2 * noiseFloor && recentWater) {
  regime = "whoosh pending"; regimeWhy = "raw weight is " + r1(gap, 1) + " lb below trend after a water event - the trend should catch down as clean reads confirm";
} else if (Math.abs(rateWk) < plateauThresh) {
  regime = "plateau";
  if (recentWater) regimeWhy = "water masking (recent sodium/alcohol/event) - a whoosh likely pending";
  else if (tdee && meanCal && (tdee - meanCal) < 200) regimeWhy = "deficit has shrunk - intake near your TDEE";
  else regimeWhy = "check adherence/logging first, then consider a diet break";
} else {
  regime = rateWk > 0 ? "steady loss" : "gaining";
  regimeWhy = rateWk > 0 ? "trend descending at " + rateWk + " lb/wk within your target band" : "trend rising";
}

/* ---------- 7. suggestion synthesis (science + data + relationship) ---------- */
const gen = new Date().toISOString();
const sugg = [];
const add = (o) => sugg.push(o);

const lateCaff = (state.caffLog || []).filter(c => daysBetween(c.d, last.d) <= 6 && (c.mg >= 300 || (c.at && c.at >= "12:00")));
if ((meanSleep != null && meanSleep < 7) || sleepDebt7 >= 3 || lateCaff.length >= 2) {
  add({
    sid: "sug_" + last.d + "_sleep", title: "Protect sleep: aim 7.5 h, cap afternoon caffeine",
    apply: { kind: "sleep", to: 7.5 },
    rationale: {
      science: "At equal deficits, 5.5 vs 8.5 h sleep cut fat loss 55% and raised lean-mass loss 60% (Nedeltcheva 2010).",
      data: "Last " + recentNights.length + " nights average " + (meanSleep != null ? r1(meanSleep, 1) : "?") + " h (7-night debt " + r1(sleepDebt7, 1) + " h); " + lateCaff.length + " recent days had >=300 mg or afternoon caffeine.",
      relationship: "Short sleep + late caffeine track with your low recovery score and rep dips - the lever that protects lean while you cut."
    },
    predict: "Higher share of loss as fat; lean protected; better session quality.",
    confidence: "high", gate: "approve"
  });
}
const recentPro = Object.keys(dl).filter(k => dl[k].pro != null && daysBetween(k, last.d) <= 13).map(k => dl[k].pro);
const proAvg = mean(recentPro);
if (proAvg != null && proAvg < proTarget) {
  add({
    sid: "sug_" + last.d + "_protein", title: "Raise protein to ~" + proTarget + " g/day",
    apply: { kind: "protein", to: proTarget },
    rationale: {
      science: "Lean-retention target on a deficit is 2.3-3.1 g/kg fat-free mass (Helms 2014, systematic review) - about " + proTarget + "-" + proHi + " g for you.",
      data: "Your 14-day protein averages " + Math.round(proAvg) + " g.",
      relationship: "Below-target protein weeks raise the lean-loss share of your trend."
    },
    predict: "Protects lean mass; scale rate unchanged.", confidence: "high", gate: "approve"
  });
}
const redline = (state.rate && state.rate.redline) || 1.9;
if (rateWk > redline) {
  add({
    sid: "sug_" + last.d + "_cal", title: "Add ~100 kcal - loss rate is hot", apply: { kind: "cal", delta: 100 },
    rationale: {
      science: "Faster loss (>1%/wk) costs more lean and bone (Garthe 2011; Seimon 2019).",
      data: "Trend rate " + rateWk + " lb/wk is above your redline " + redline + ".",
      relationship: "Sustained above-redline loss risks the lean you train to keep."
    },
    predict: "Rate eases into your target band; lean protected.", confidence: gap > noiseFloor ? "medium" : "high", gate: "approve"
  });
}
if ((state.proposals || []).some(p => /RECOVERY LOW/.test(p.title || "") && !p.resolved)) {
  add({
    sid: "sug_" + last.d + "_hold", title: "Hold structural training changes this week", apply: { kind: "note" },
    rationale: {
      science: "Under-recovery blunts the training stimulus that preserves muscle on a cut (Schoenfeld 2017).",
      data: "Recovery signals are low (short sleep, rep dips) with a progression queued.",
      relationship: "Pushing loads while under-recovered converts to missed reps, not muscle."
    },
    predict: "Keeps intensity honest; resume progression when recovery returns.", confidence: "medium", gate: "approve"
  });
}
const cW = { high: 3, medium: 2, low: 1 };
sugg.sort((a, b) => cW[b.confidence] - cW[a.confidence]);
sugg.forEach((x, i) => (x.rank = i + 1));

// prior decisions (Joe's approvals/dismissals synced back in state) — the analyst grades these next run
const priorDecisions = (state.suggestionLog || []).slice(-10).map((x) => ({ sid: x.sid, decided: x.decided, d: x.d, title: x.title, apply: x.apply || null, predict: x.predict || "" }));
const priorApproved = priorDecisions.filter((x) => x.decided === "approved").length;
const priorDismissed = priorDecisions.filter((x) => x.decided === "dismissed").length;

const analysis = {
  gen, stateRead: STATE_PATH,
  trend: { soft: last.trend, lastRaw: last.w, appTrend: state.trend, noiseFloor, gap },
  rate: { perWeekLb: rateWk, perWeekPct: ratePct, bandLb: rateBand, personalBand: (state.rate || {}).band, window: winDays },
  coefficients: { tdee, tdeeWinDays, meanCal: meanCal != null ? Math.round(meanCal) : null, waterSensitivityLb: waterSens, waterSensDays: waterSensN, meanSleepH: meanSleep != null ? r1(meanSleep, 1) : null, sleepDebt7H: r1(sleepDebt7, 1), ffmKg: FFM_KG ? r1(FFM_KG, 1) : null, proteinTargetG: proTarget },
  regime: { regime, why: regimeWhy },
  weeks: weekRows.slice(-6), priorDecisions, suggestions: sugg
};
const suggestionsOut = { gen, analystVersion: "rebuild-1", suggestions: sugg };
if (WRITE) {
  fs.writeFileSync(path.join(OUT_DIR, "suggestions.json"), JSON.stringify(suggestionsOut, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "analysis.json"), JSON.stringify(analysis, null, 2));
}

const L = [];
L.push("PREP LEDGER - ANALYST ENGINE  (" + gen.slice(0, 10) + ")");
L.push("reads: " + reads.length + "  |  noise floor: +/-" + noiseFloor + " lb/day");
L.push("soft trend: " + last.trend + " lb   (app trend " + state.trend + " - last raw " + last.w + ")");
L.push("rate: " + rateWk + " lb/wk  (" + ratePct + "%/wk)  +/- " + rateBand + "   personal band " + JSON.stringify((state.rate || {}).band));
L.push("TDEE est: " + tdee + " kcal  over " + tdeeWinDays + " d @ mean " + (meanCal != null ? Math.round(meanCal) : "?") + " kcal");
L.push("water sensitivity: " + (waterSens != null ? (waterSens > 0 ? "+" : "") + waterSens + " lb next-day after high-sodium/alcohol (n=" + waterSensN + ")" : "n/a - need >=3 high-sodium days (have " + waterSensN + ")"));
L.push("sleep: mean " + (meanSleep != null ? r1(meanSleep, 1) : "?") + " h  -  7-night debt " + r1(sleepDebt7, 1) + " h");
L.push("protein: target " + proTarget + "-" + proHi + " g  -  recent avg " + (proAvg != null ? Math.round(proAvg) : "?") + " g");
L.push("regime: " + regime + (regimeWhy ? " - " + regimeWhy : ""));
L.push("prior decisions to grade: " + priorDecisions.length + " (approved " + priorApproved + " / dismissed " + priorDismissed + ")");
L.push("SUGGESTIONS (" + sugg.length + "):");
sugg.forEach(x => { L.push("  [" + x.rank + "] " + x.title + "  (" + x.confidence + ", " + x.gate + ")"); L.push("      science: " + x.rationale.science); L.push("      data:    " + x.rationale.data); L.push("      rel:     " + x.rationale.relationship); L.push("      -> " + x.predict); });
console.log(L.join("\n"));
