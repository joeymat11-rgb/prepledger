'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return {
  id:'P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix',defect:'D18',theme: 'counts-only-guards',family:'policy',
  cite:'src/app.jsx@fe516c1:8827-8830; rebuild/engine/volume.cjs:157-160; defect-witnesses-2.cjs D18',expect:'GREEN',
  run(B){const T=B.engine(), volume={d:'2026-09-02',t:'VOLUME +1 — CHEST via Press'},notes=Array.from({length:80},(_,i)=>({d:'2026-09-03',t:'Synthetic note '+i})),ex={id:'p',n:'Press',mg:'chest'};
    const a=T.structuralMovesThisWeek({exercises:[ex],feed:[volume,...notes]}),b=T.structuralMovesThisWeek({exercises:[ex],feed:[...notes,volume]});
    return{ok:a.sets.length===1&&b.sets.length===1&&a.sets[0].exId===b.sets[0].exId,detail:'An ordinary-note prefix cannot hide a same-week set change from the structural budget.'};},
  control:B=>patch(B,'structuralMovesThisWeek',old=>s=>old({...s,feed:(s.feed||[]).filter(f=>f&&typeof f.t==='string'&&f.t.startsWith('VOLUME '))})),
  mutants:[{name:'eighty-feed-lines-only',make:B=>patch(B,'structuralMovesThisWeek',(_old,T)=>T.__auditOriginal.structuralMovesThisWeek)}]
};

})());

laws.push((()=>{
'use strict';
const {state,clone,patch}=require('./helpers.cjs');
return {id:'V4-guard-record-identities-and-sets',defect:'D33',theme: 'counts-only-guards',family:'engine',cite:'D33; app.jsx @ fe516c1:13294-13297,13329-13334',expect:'GREEN',
 run(B){const T=B.engine(),s=state();s.reads=[{d:'2026-09-01',w:170}];s.sessionLog['2026-09-01']={entries:[{id:'synthetic-lift',w:100,reps:[10,9,8]}]};const fewer=clone(s),replaced=clone(s);fewer.sessionLog['2026-09-01'].entries[0].reps.pop();replaced.reads=[{d:'2026-09-02',w:171}];const unchanged=T.dataLossGuard(s,clone(s)),a=T.dataLossGuard(s,fewer),b=T.dataLossGuard(s,replaced);return {ok:unchanged.safe&&unchanged.lost.length===0&&!a.safe&&!b.safe,detail:'An unchanged write passes; an unfiled lost set or replaced read day refuses the write.'};},
 control(B){return patch(B,'dataLossGuard',(old)=>function(a,b){const r=old(a,b),lost=[...r.lost];for(const x of a.reads||[])if(!(b.reads||[]).some(y=>y.d===x.d))lost.push('read identity');for(const[d,s]of Object.entries(a.sessionLog||{}))for(const x of s.entries||[]){const z=(b.sessionLog?.[d]?.entries||[]).find(y=>y.id===x.id);if(!z||(z.reps||[]).length<(x.reps||[]).length)lost.push('set identity');}return {safe:lost.length===0,lost};});},
 mutants:[{name:'counts-only-protection',make:B=>patch(B,'dataLossGuard',(_,T)=>T.__auditOriginal.dataLossGuard)},{name:'deny-every-write',make:B=>patch(B,'dataLossGuard',()=>()=>({safe:false,lost:['all writes refused']}))}]};

})());

laws.push((()=>{
'use strict';
const {state,clone,patch}=require('./helpers.cjs');
const canonical=value=>JSON.stringify((function sort(v){if(Array.isArray(v))return v.map(sort);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])]));return v;})(value));
return {id:'V4-pristine-compares-record-content',defect:'D34',theme: 'counts-only-guards',family:'engine',cite:'D34; app.jsx @ fe516c1:13235-13239',expect:'GREEN',
 run(B){const T=B.engine(),synthetic=state();synthetic.reads=[{d:'2026-09-01',w:123}];synthetic.sleep.nights=[{d:'2026-09-01',h:8}];synthetic.dailyLogs={'2026-09-01':{cal:2100,pro:170}};synthetic.sessionLog={'2026-09-01':{entries:[{id:'synthetic-lift',w:100,reps:[10,9]}]}};Object.assign(T.SEED,clone(synthetic));const pristine=clone(synthetic),reordered=clone(synthetic),changed=clone(synthetic);reordered.dailyLogs['2026-09-01']={pro:170,cal:2100};changed.reads[0].w=124;return {ok:T.isPristineSeed(pristine)===true&&T.isPristineSeed(reordered)===true&&T.isPristineSeed(changed)===false,detail:'A wholly synthetic pristine record passes irrespective of key order; a changed value fails despite an identical fingerprint.'};},
 control(B){return patch(B,'isPristineSeed',(old,T)=>s=>old(s)&&canonical([s.reads,s.sleep.nights,s.dailyLogs,s.sessionLog])===canonical([T.SEED.reads,T.SEED.sleep.nights,T.SEED.dailyLogs,T.SEED.sessionLog]));},
 mutants:[{name:'fingerprint-only-pristine',make:B=>patch(B,'isPristineSeed',(_,T)=>T.__auditOriginal.isPristineSeed)},{name:'nothing-is-pristine',make:B=>patch(B,'isPristineSeed',()=>()=>false)},{name:'object-order-is-record-content',make:B=>patch(B,'isPristineSeed',(_,T)=>s=>JSON.stringify([s.reads,s.sleep.nights,s.dailyLogs,s.sessionLog])===JSON.stringify([T.SEED.reads,T.SEED.sleep.nights,T.SEED.dailyLogs,T.SEED.sessionLog]))}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
