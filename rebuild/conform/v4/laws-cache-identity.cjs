'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { state, clone, patch } = require('./helpers.cjs');
return  {
  defect: 'D13', theme: 'cache-identity', family: 'engine',
  id: 'E-D13-energy-density-cache-tracks-relevant-state', cite: 'REPORT-M2-2 D13; app.jsx @ fe516c1:5158-5163,4798,4803; energy.cjs:1130-1136,1005,1009', expect: 'GREEN',
  run(B) { const T = B.engine(), s = state(); const before = T.energyDensity(s); s.trend = 160; const after = T.energyDensity(s), recomputed = T.energyDensityUncached(s); return { ok: before.perLb !== recomputed.perLb && after.perLb === recomputed.perLb && JSON.stringify(after) === JSON.stringify(recomputed), detail: { before: before.perLb, after: after.perLb, recomputed: recomputed.perLb } }; },
  control(B) { return patch(B, 'energyDensity', (old) => (s, dir) => old(clone(s), dir)); },
  mutants: [{ name: 'memo-key-is-object-identity-without-invalidation', make(B) { return patch(B, 'energyDensity', (old, T) => T.__auditOriginal.energyDensity); } }]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return {
  id:'E-D20-forecast-refreshes-after-an-observed-rate-change',defect:'D20',theme: 'cache-identity',family:'engine',
  cite:'src/app.jsx@fe516c1:5202,5205,5157-5166; rebuild/engine/policy.cjs:271-274; defect-witnesses-2.cjs D20',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.reads=[];
    for(let i=0;i<15;i++){const d=T.isoOf(new Date(T.mk('2026-08-20').getTime()+i*T.DAY));s.reads.push({d,w:183-i*0.2+(i%3)*0.04});s.dailyLogs[d]={cal:2300,steps:10000};}
    const first=T.forecast(s);s.reads.forEach((r,i)=>{r.w=183-i*0.1+(i%3)*0.04;});
    const cached=T.forecast(s),fresh=T.forecast(s,{});
    return{ok:first.ok&&fresh.ok&&cached.ok&&first.rate!==fresh.rate&&cached.rate===fresh.rate,detail:'Real currentRate and digitalTwin derivations must refresh a viable forecast when the same state receives changed daily observations.'};},
  control:B=>patch(B,'forecast',old=>(s,opts)=>old(s,opts===undefined?{}:opts)),
  mutants:[{name:'forecast-is-cached-only-by-state-object',make:B=>patch(B,'forecast',(_old,T)=>T.__auditOriginal.forecast)}]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return {
  id:'E-D26-today-model-refreshes-when-the-calendar-day-changes',defect:'D26',theme: 'cache-identity',family:'engine',
  cite:'src/app.jsx@fe516c1:15425,15535-15536,5158-5163; rebuild/engine/today.cjs:508,622-625; defect-witnesses-3.cjs D26',expect:'GREEN',
  run(B){const clock=B.clock('2026-09-03'),T=B.engine(clock),s=state(),first=T.nowModel(s);clock.set('2026-09-04');const next=T.nowModel(s),fresh=T.nowModel(s,{});return{ok:first.tISO==='2026-09-03'&&next.tISO==='2026-09-04'&&next.tISO===fresh.tISO,detail:'An unchanged state cannot keep the previous calendar date after the clock advances.'};},
  control:B=>patch(B,'nowModel',old=>(s,deps)=>old(s,deps||{})),
  mutants:[{name:'today-cache-omits-clock-validity',make:B=>patch(B,'nowModel',(_old,T)=>T.__auditOriginal.nowModel)}]
};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
