'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return  {
  defect: 'D11', theme: 'numeric-values-and-units', family: 'engine',
  id: 'E-D11-gain-interval-is-ordered-and-zero-drift-never-promoted', cite: 'REPORT-M2-2 D11; app.jsx @ fe516c1:3815-3816,3840,3844; energy.cjs:449-450,474,478', expect: 'GREEN',
  run(B) { const T = B.engine(), s = state(); s.model.src = 'eye'; for (let i = 0; i < 10; i++) { const d = T.isoOf(new Date(T.mk('2026-08-25').getTime() + i * T.DAY)); s.reads.push({ d, w: 180 + i * 0.1 }); s.dailyLogs[d] = { cal: 2000, steps: 10000 }; } const r = T.observedTDEE(s); return { ok: !!r && r.lo <= r.tdee && r.tdee <= r.hi && r.lo <= r.hi && r.stepDelta === 0 && r.stepPromoted === false, detail: { lo: r && r.lo, tdee: r && r.tdee, hi: r && r.hi, stepDelta: r && r.stepDelta, stepPromoted: r && r.stepPromoted } }; },
  control(B) { return patch(B, 'observedTDEE', (old, T) => (s, opts) => { const out = old(s, opts); if (!out || out.rateCi == null) return out; const r = T.currentRate(s), kcal = (v) => Math.round(out.avg + Math.min(3, v) * out.perLb / 7), lo = Math.min(kcal(r.lo), kcal(r.hi)), hi = Math.max(kcal(r.lo), kcal(r.hi)); const stepPromoted = out.stepDelta != null && Math.abs(out.stepDelta * (1 - out.stepCompHi)) > Math.round((hi - lo) / 2); return { ...out, lo, hi, stepPromoted, tdeePrimary: stepPromoted ? out.tdeeAtNowMid : out.tdee }; }); },
  mutants: [{ name: 'clamp-only-lower-endpoint-to-zero', make(B) { return patch(B, 'observedTDEE', (old, T) => T.__auditOriginal.observedTDEE); } }]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return  {
  defect: 'D12', theme: 'numeric-values-and-units', family: 'engine',
  id: 'E-D12-step-slope-keeps-per-thousand-units', cite: 'REPORT-M2-2 D12; app.jsx @ fe516c1:6962,7176; energy.cjs:1169,1186', expect: 'GREEN',
  run(B) { const T = B.engine(), s = state(); T.ROLLUPS.length = 0; ['2026-07-29', '2026-08-05', '2026-08-12', '2026-08-19', '2026-08-26'].forEach((d, i) => { s.reads.push({ d, w: [180, 179.9, 179.7, 179.4, 179][i] }); s.dailyLogs[d] = { cal: 2000, pro: 180, steps: 10000 + i * 1000 }; }); const inputUnits = T.liveRollups(s).map((w) => w.avgSteps), out = T.stepEfficacy(s); return { ok: JSON.stringify(inputUnits) === '[14,13,12,11,10]' && out.slopePer1k === 0.1 && out.resolved === true, detail: { inputUnits, out } }; },
  control(B) { return patch(B, 'stepEfficacy', (old) => (s) => { const out = old(s); if (out.slopePer1k == null) return out; const slopePer1k = out.slopePer1k / 1000; return { ...out, slopePer1k, resolved: out.slopePer1k === 0 ? out.resolved : Math.abs(slopePer1k) <= out.boundPer1k * 5 }; }); },
  mutants: [{ name: 'multiply-already-per-thousand-slope-by-thousand', make(B) { return patch(B, 'stepEfficacy', (old, T) => T.__auditOriginal.stepEfficacy); } }]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return  {
  defect: 'D14', theme: 'numeric-values-and-units', family: 'engine',
  id: 'E-D14-current-rate-uses-missing-drip-default', cite: 'REPORT-M2-2 D14; app.jsx @ fe516c1:3485,3501,2835; energy.cjs:285,301,21', expect: 'GREEN',
  run(B) { const T = B.engine(), s = state(); s.model = { lean: 150, anchorISO: '2026-08-01', src: 'DEXA' }; s.weekly = [{ wk: '2026-08-01', trend: 180 }, { wk: '2026-08-08', trend: 179 }, { wk: '2026-08-15', trend: 178 }]; const out = T.currentRate(s), def = T.dripOf(s), explicit = T.currentRate({ ...s, model: { ...s.model, drip: 0 } }); return { ok: def === 0 && Number.isFinite(out.fat) && out.fat === explicit.fat && out.scale === explicit.scale, detail: { missing: out, explicit, def } }; },
  control(B) { return patch(B, 'currentRate', (old, T) => (s) => old({ ...s, model: { ...s.model, drip: T.dripOf(s) } })); },
  mutants: [{ name: 'fat-rate-adds-undefined-drip-directly', make(B) { return patch(B, 'currentRate', (old, T) => T.__auditOriginal.currentRate); } }]
};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
