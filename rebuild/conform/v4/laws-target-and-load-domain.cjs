'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { lift, patch } = require('./helpers.cjs');
return  {
  defect: 'D1', theme: 'target-and-load-domain', family: 'progression',
  id: 'P-D1-first-targets-fit-current-set-count', cite: 'REPORT-M2-1 D1; app.jsx @ fe516c1:1123; progression.cjs:164', expect: 'GREEN',
  run(B) { const T = B.engine(), s = { sessionLog: {} }; const grow = T.targetsFor(lift({ sets: 3, last: null, first: [8, 7] }), s), shrink = T.targetsFor(lift({ sets: 1, last: null, first: [8, 7] }), s); return { ok: JSON.stringify(grow) === '[8,7,6]' && JSON.stringify(shrink) === '[8]', detail: { grow, shrink } }; },
  control(B) { return patch(B, 'targetsFor', (old) => (ex, s) => !ex.last && ex.first && !ex.std && !ex.reclaim ? old({ ...ex, std: ex.first }, s) : old(ex, s)); },
  mutants: [{ name: 'first-array-bypasses-existing-authored-fit', make(B) { return patch(B, 'targetsFor', (old, T) => T.__auditOriginal.targetsFor); } }]
};

})());

laws.push((()=>{
'use strict';
const { lift, patch } = require('./helpers.cjs');
const valid = (ex) => ex && Number.isInteger(ex.sets) && ex.sets > 0 && Number.isFinite(ex.hi) && ex.hi > 0;
return  {
  defect: 'D2', theme: 'target-and-load-domain', family: 'engine',
  id: 'E-D2-invalid-set-count-stays-quarantined', cite: 'REPORT-M2-1 D2; app.jsx @ fe516c1:1858,1901,1123; plan.cjs:84,123; progression.cjs:164', expect: 'GREEN',
  run(B) { const T = B.engine(), ex = lift({ sets: -1, last: null, quarantined: 'invalid:synthetic' }), s = { exercises: [ex], feed: [], sessionLog: {} }; const accepted = T._bornValid(ex); T.canonicalizePlan(s); let negativeArrayCrash = false; if (!ex.quarantined) { try { T.targetsFor(ex, s); } catch (error) { if (error.name !== 'RangeError' || !/array length/i.test(error.message)) throw error; negativeArrayCrash = true; } } return { ok: !accepted && !!ex.quarantined && !negativeArrayCrash, detail: { accepted, quarantined: !!ex.quarantined, negativeArrayCrash } }; },
  control(B) { let C = patch(B, '_bornValid', (old) => (ex) => valid(ex) && old(ex)); return patch(C, 'canonicalizePlan', (old) => (s) => { const blocked = (s.exercises || []).filter((ex) => ex.quarantined && !valid(ex)).map((ex) => [ex, ex.quarantined]); const out = old(s); for (const [ex, marker] of blocked) ex.quarantined = marker; return out; }); },
  mutants: [{ name: 'numeric-type-admits-negative-count-and-clears-quarantine', make(B) { let M = patch(B, '_bornValid', (old, T) => T.__auditOriginal._bornValid); return patch(M, 'canonicalizePlan', (old, T) => T.__auditOriginal.canonicalizePlan); } }]
};

})());

laws.push((()=>{
'use strict';
const { lift, patch } = require('./helpers.cjs');
const sanitize = (ex) => Array.isArray(ex.steps) && new Set(ex.steps.map(Number).filter((n) => Number.isFinite(n) && n > 0)).size < 2 ? { ...ex, steps: null } : ex;
return  {
  defect: 'D5', theme: 'target-and-load-domain', family: 'progression',
  id: 'P-D5-ladder-minimum-counts-distinct-rungs', cite: 'REPORT-M2-1 D5; app.jsx @ fe516c1:1260-1261,1323; progression.cjs:241-242,301', expect: 'GREEN',
  run(B) { const T = B.engine(), ex = lift({ steps: [100, 100] }); const parsed = T.parseRungs('100,100'), rungs = T.loadRungs(ex), maxed = T.maxedOut(ex), next = T.nextLoad(ex); return { ok: parsed === null && rungs === null && !maxed && next === 105 && JSON.stringify(T.parseRungs('100,105,100')) === '[100,105]', detail: { parsed, rungs, maxed, next } }; },
  control(B) { let C = patch(B, 'parseRungs', (old) => (text) => { const r = old(text); return r && r.length < 2 ? null : r; }); for (const name of ['loadRungs', 'maxedOut', 'nextLoad']) C = patch(C, name, (old) => (ex, ...args) => old(sanitize(ex), ...args)); return C; },
  mutants: [{ name: 'raw-rung-count-checked-before-deduplication', make(B) { let M = B; for (const name of ['parseRungs', 'loadRungs', 'maxedOut', 'nextLoad']) M = patch(M, name, (old, T) => T.__auditOriginal[name]); return M; } }]
};

})());

laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return  {
  defect: 'D6', theme: 'target-and-load-domain', family: 'progression',
  id: 'P-D6-deload-preserves-absent-load', cite: 'REPORT-M2-1 D6; app.jsx @ fe516c1:1311-1314; progression.cjs:288-291', expect: 'GREEN',
  run(B) { const T = B.engine(), missing = [null, undefined, ''].map((w) => T.deloadLoad({ w, inc: 5 })), known = T.deloadLoad({ w: 100, inc: 5 }); return { ok: missing.every((w) => w === null) && known === 95, detail: { missing, known } }; },
  control(B) { return patch(B, 'deloadLoad', (old) => (ex, ...args) => ex.w == null || ex.w === '' ? null : old(ex, ...args)); },
  mutants: [{ name: 'numeric-coercion-turns-absence-into-deload-five', make(B) { return patch(B, 'deloadLoad', (old, T) => T.__auditOriginal.deloadLoad); } }]
};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
