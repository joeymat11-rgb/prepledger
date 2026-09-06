'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { lift, patch } = require('./helpers.cjs');
return  {
  defect: 'D3', theme: 'receipt-identity', family: 'progression',
  id: 'P-D3-volume-receipt-belongs-to-whole-lift-name', cite: 'REPORT-M2-1 D3; app.jsx @ fe516c1:1077; progression.cjs:124', expect: 'GREEN',
  run(B) { const T = B.engine(), ex = lift(), s = { feed: [{ d: '2026-09-01', t: 'VOLUME +1 — CHEST via Press (now 3 sets)' }, { d: '2026-09-02', t: 'VOLUME +1 — CHEST via Press incline' }] }; const deltas = T._volDeltas(ex, s); return { ok: JSON.stringify(deltas) === '[["2026-09-01",1]]', detail: { deltas } }; },
  control(B) { return patch(B, '_volDeltas', (old, T) => (ex, s) => { const names = T._formerNames(ex); const feed = ((s && s.feed) || []).filter((f) => { if (!f || typeof f.t !== 'string' || !f.t.startsWith('VOLUME ')) return true; const at = f.t.indexOf('via '); if (at < 0) return false; const owner = f.t.slice(at + 4).split(' (now ')[0]; return names.includes(owner); }); return old(ex, { ...s, feed }); }); },
  mutants: [{ name: 'volume-owner-is-name-substring', make(B) { return patch(B, '_volDeltas', (old, T) => T.__auditOriginal._volDeltas); } }]
};

})());

laws.push((()=>{
'use strict';
const { lift, patch } = require('./helpers.cjs');
return  {
  defect: 'D4', theme: 'receipt-identity', family: 'progression',
  id: 'P-D4-other-lift-earn-cannot-spend-sightings', cite: 'REPORT-M2-1 D4; app.jsx @ fe516c1:2232; progression.cjs:504', expect: 'GREEN',
  run(B) { const T = B.engine(), ex = lift(), s = { exercises: [ex], feed: [], sessionLog: { '2026-08-30': { entries: [{ id: ex.id, w: 100, reps: [10, 9] }] }, '2026-09-01': { entries: [{ id: ex.id, w: 100, reps: [10, 9] }] } } }; const before = T.deriveSighting(s, ex); s.feed = [{ d: '2026-09-01', t: 'PRESS INCLINE 100 EARNED' }]; const afterOther = T.deriveSighting(s, ex); s.feed.push({ d: '2026-09-01', t: 'PRESS 100 EARNED' }); const afterOwn = T.deriveSighting(s, ex); return { ok: before.topRun === 2 && afterOther.topRun === 2 && afterOther.topAt === 100 && afterOwn.topRun === 0, detail: { before, afterOther, afterOwn } }; },
  control(B) { return patch(B, 'deriveSighting', (old, T) => (s, ex) => { const names = T._formerNames(ex).map((n) => n.toUpperCase()); const feed = (s.feed || []).filter((f) => !f || typeof f.t !== 'string' || !/ EARNED$/.test(f.t) || names.some((n) => f.t.startsWith(n) && /^ [-+]?(?:\d+(?:\.\d+)?|\.\d+) EARNED$/.test(f.t.slice(n.length)))); return old({ ...s, feed }, ex); }); },
  mutants: [{ name: 'earn-owner-is-unbounded-name-prefix', make(B) { return patch(B, 'deriveSighting', (old, T) => T.__auditOriginal.deriveSighting); } }]
};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
