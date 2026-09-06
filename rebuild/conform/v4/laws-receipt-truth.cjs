'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return  {
  id: 'E-D16-seven-day-forecast-does-not-grade-a-month-late-read',defect:'D16',theme: 'receipt-truth',family:'engine',
  cite:'src/app.jsx@fe516c1:5483,5488,5491-5495; rebuild/engine/policy.cjs:474-486; defect-witnesses-2.cjs D16',expect:'GREEN',
  run(B) { const T=B.engine(), s={reads:[{d:'2026-09-01',w:165,pt:165}],forecasts:[{d:'2026-08-01',pred7:165}],adjustments:[]};
    const r=T.trackRecord(s),due=T.trackRecord({...s,reads:[{d:'2026-08-08',w:165,pt:165}]}),grace=T.trackRecord({...s,reads:[{d:'2026-08-09',w:165,pt:165}]}),late=T.trackRecord({...s,reads:[{d:'2026-08-10',w:165,pt:165}]});
    return {ok:r.graded===0&&r.rows.length===1&&r.rows[0].hit===null&&due.graded===1&&due.rows[0].hit===true&&grace.graded===1&&grace.rows[0].hit===true&&late.graded===0,detail:'The proposed due-day or following-day window grades valid hits and leaves later readings ungraded.'}; },
  control:B=>patch(B,'trackRecord',(old,T)=>s=>{
    const f=(s.forecasts||[])[0]; if(!f) return old(s);
    const due=T.mk(f.d).getTime()+7*T.DAY;
    return old({...s,reads:(s.reads||[]).filter(r=>!r.sealed&&!r.offWindow&&T.mk(r.d)>=due&&T.mk(r.d)<=due+T.DAY)});
  }),
  mutants:[{name:'first-later-read-has-no-horizon-limit',make:B=>patch(B,'trackRecord',(_old,T)=>T.__auditOriginal.trackRecord)}]
};

})());

laws.push((()=>{
'use strict';
const { patch } = require('./helpers.cjs');
return {
  id:'E-D17-undone-adjustment-is-not-described-as-applied',defect:'D17',theme: 'receipt-truth',family:'engine',
  cite:'src/app.jsx@fe516c1:5502-5503; rebuild/engine/policy.cjs:494-495; defect-witnesses-2.cjs D17',expect:'GREEN',
  run(B){const r=B.engine().trackRecord({reads:[],forecasts:[],adjustments:[{d:'2026-09-03',rid:'ap_test',title:'Synthetic adjustment',undone:true}]});return{ok:r.decisions.length===1&&r.decisions[0].applied===false,detail:'The retained decision must show that its effect has been undone.'};},
  control:B=>patch(B,'trackRecord',(old)=>s=>old({...s,adjustments:(s.adjustments||[]).map(a=>({...a,dismissed:!!a.dismissed||!!a.undone}))})),
  mutants:[{name:'applied-means-only-not-dismissed',make:B=>patch(B,'trackRecord',(_old,T)=>T.__auditOriginal.trackRecord)}]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return {
  id:'E-D24-partial-yesterday-remains-owed-until-calories-are-present',defect:'D24',theme: 'receipt-truth',family:'engine',
  cite:'src/app.jsx@fe516c1:8454,8460-8461,6875-6876; rebuild/engine/today.cjs:196,202-203; defect-witnesses-3.cjs D24',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.dailyLogs={'2026-09-01':{cal:2000},'2026-09-02':{steps:10000}};const f=T.nowFocus(s,12),owed=T.owedLedger(s,12);return{ok:owed.some(x=>x.k==='day'&&x.d==='2026-09-02')&&f.owed.some(x=>x.k==='yesterday')&&!f.clear,detail:'A steps-only yesterday remains open in both the ledger and Today obligation list.'};},
  control:B=>patch(B,'nowFocus',(old,T)=>(s,h)=>{const yesterday=T.todayStart();yesterday.setDate(yesterday.getDate()-1);const d=T.isoOf(yesterday),row=(s.dailyLogs||{})[d];if(!row||row.cal!=null)return old(s,h);const dailyLogs={...s.dailyLogs};delete dailyLogs[d];return old({...s,dailyLogs},h);}),
  mutants:[{name:'any-yesterday-row-counts-as-complete',make:B=>patch(B,'nowFocus',(_old,T)=>T.__auditOriginal.nowFocus)}]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return {
  id:'E-D25-zero-protein-successes-cannot-be-a-good-protein-read',defect:'D25',theme: 'receipt-truth',family:'engine',
  cite:'src/app.jsx@fe516c1:8507-8512; rebuild/engine/today.cjs:238-244; defect-witnesses-3.cjs D25',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.dailyLogs={'2026-09-03':{cal:2000,pro:0,steps:10000}};const r=T.fiveLevers(s);return{ok:T.proteinTarget(s).lo>0&&r.protein.detail==='0/1'&&r.protein.state!=='good',detail:'Zero successes out of the sole protein observation cannot support a good status.'};},
  control:B=>patch(B,'fiveLevers',(old)=>s=>{const out=old(s);if(/^0\/[1-9]/.test(out.protein.detail)){const protein={...out.protein,state:'caution'};return{...out,protein,list:out.list.map(x=>x===out.protein?protein:x)};}return out;}),
  mutants:[{name:'one-miss-allowance-permits-zero-successes',make:B=>patch(B,'fiveLevers',(_old,T)=>T.__auditOriginal.fiveLevers)}]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return {
  id:'P-D27-maintenance-is-not-described-as-a-long-stalled-cut',defect:'D27',theme: 'receipt-truth',family:'policy',
  cite:'src/app.jsx@fe516c1:8564-8569,5579-5581,14459-14461; rebuild/engine/today.cjs:298-303; defect-witnesses-3.cjs D27',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.plan.phase='maintenance';s.reads=[{d:'2026-09-03',w:180}];s.sleep.nights=['2026-08-31','2026-09-01','2026-09-02'].map(d=>({d,h:8}));s.weekly=[{wk:'2026-08-20',trend:180},{wk:'2026-08-27',trend:180},{wk:'2026-09-03',trend:180}];const fix=T.theOneFix(s);return{ok:T.phaseArc(s).key==='maintenance'&&fix.rung!=='break'&&!/held the deficit for weeks/.test(fix.body),detail:'Committed maintenance cannot be diagnosed as weeks of a stalled calorie cut.'};},
  control:B=>patch(B,'theOneFix',(old,T)=>(s,levers)=>{const out=old(s,levers);if(['break','calories'].includes(out.rung)&&T.phaseArc(s).key!=='cut')return{rung:'hold',lever:null,state:'good',title:'Continue the committed phase',body:'The current phase is not a calorie cut.',whyNot:null};return out;}),
  mutants:[{name:'global-programme-week-substitutes-for-committed-cut',make:B=>patch(B,'theOneFix',(_old,T)=>T.__auditOriginal.theOneFix)}]
};

})());

laws.push((()=>{
'use strict';
const {state,lift,patch}=require('./helpers.cjs');
return {id:'V4-curl-receipt-prices-actual-vector',defect:'D36',theme: 'receipt-truth',family:'engine',cite:'D36; app.jsx @ fe516c1:11387-11396',expect:'GREEN',
 run(B){const T=B.engine(),s=state();s.v=59;s.exercises=[lift({id:'curl',n:'Synthetic curl',w:'40·40·35',sets:3,hi:12,inc:5,mg:'biceps'})];s.queue=[{id:'q_curl_grad',kind:'unlock',exId:'curl',done:false}];const r=T.migrate(s),e=r.exercises.find(x=>x.id==='curl'),f=r.feed.find(x=>x.op==='patch60:curlgrad');if(!f||!Array.isArray(e.wSets))throw Error('D36 migration seam missing');const actual=e.wSets.map(w=>w+T.nextLoad(e)-e.w).join('·'),claimed=f.how.match(/price the next line at ([\d·]+)/)?.[1];return {ok:claimed===actual,detail:'The next per-set loads printed in the migration receipt must match its numeric prescription.'};},
 control(B){return patch(B,'migrate',(old,T)=>function(s){const r=old(s),e=r.exercises?.find(x=>x.id==='curl'),f=r.feed?.find(x=>x.op==='patch60:curlgrad');if(f&&e?.wSets)f.how=f.how.replace(/price the next line at [\d·]+/,'price the next line at '+e.wSets.map(w=>w+T.nextLoad(e)-e.w).join('·'));return r;});},
 mutants:[{name:'hard-code-authored-next-loads',make:B=>patch(B,'migrate',(_,T)=>T.__auditOriginal.migrate)}]};

})());

laws.push((()=>{
'use strict';
const {state,lift,clone,patch}=require('./helpers.cjs');
return {id:'V4-volume-receipt-requires-actual-change',defect:'D44',theme: 'receipt-truth',family:'policy',cite:'D44; app.jsx @ fe516c1:9179-9183,9220,10120,1071',expect:'GREEN',
 run(B){const T=B.engine(),s=state();s.exercises=Array.from({length:4},(_,i)=>lift({id:'synthetic_press'+i,n:'Synthetic press '+i,sets:1,hi:10}));for(let i=0;i<22;i++){const d=new Date(Date.UTC(2026,8,3)-i*86400000).toISOString().slice(0,10);s.sessionLog[d]={entries:s.exercises.map(x=>({id:x.id,w:100,reps:[8],rir:2,rirSets:[2]}))};}const offered=T.sweepVolume(s,0),ap=offered.agentProposals.find(a=>a.kind==='volume'&&a.dir===-1);if(!ap||offered.exercises.find(e=>e.id===ap.exId).sets!==1)throw Error('D44 actual one-set offer missing');const accepted=T.applyAgentProposal(offered,ap,'2026-09-03'),ex=accepted.exercises.find(e=>e.id===ap.exId);const delta=ex.sets-1,reported=T._volDeltas(ex,accepted).reduce((sum,r)=>sum+r[1],0),budget=T.structuralMovesThisWeek(accepted).sets.length;const positive=state(),add={id:'synthetic-add',kind:'volume',pg:52,mg:'chest',exId:'synthetic-positive',dir:1,title:'Synthetic add'};positive.exercises=[lift({id:'synthetic-positive',n:'Synthetic positive',sets:2})];positive.agentProposals=[add];const added=T.applyAgentProposal(positive,add,'2026-09-03'),increased=added.exercises[0],addition=T._volDeltas(increased,added).reduce((sum,r)=>sum+r[1],0);return {ok:delta===reported&&(delta!==0||budget===0)&&increased.sets===3&&addition===1&&T.structuralMovesThisWeek(added).sets.length===1,detail:'A no-op prints and spends no decrement; an allowed one-set addition still applies, reports and charges exactly one move.'};},
 control(B){return patch(B,'applyAgentProposal',(old)=>function(s,ap,d){const e=s.exercises?.find(e=>e.id===ap.exId);if(ap.kind==='volume'&&ap.dir<0&&e?.sets<=1){const r=clone(s);r.agentProposals=r.agentProposals.filter(p=>p.id!==ap.id);return r;}return old(s,ap,d);});},
 mutants:[{name:'clamped-no-op-prints-volume-minus-one',make:B=>patch(B,'applyAgentProposal',(_,T)=>T.__auditOriginal.applyAgentProposal)},{name:'ignore-all-volume-acceptances',make:B=>patch(B,'applyAgentProposal',old=>(s,ap,d)=>ap.kind==='volume'?clone(s):old(s,ap,d))}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
