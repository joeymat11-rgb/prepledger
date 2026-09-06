'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { state, clone, patch } = require('./helpers.cjs');
return {
  id:'E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash',defect:'D22',theme: 'state-shape-and-failure',family:'engine',
  cite:'src/app.jsx@fe516c1:3592,7062,7821; rebuild/engine/sleep.cjs:237,1067,1621; census-partial.cjs synthetic-pending-debut exception; REPORT-M2-2-ASTRA.md D22',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.sleep={nights:[{d:'2026-08-31',h:8},{d:'2026-09-01',h:8},{d:'2026-09-02',h:2}],cleanH:7.5,needed:3};const keyed=clone(s);keyed.sleep.nights={...keyed.sleep.nights};const expected=T.recoveryIndex(s);let actual;try{actual=T.recoveryIndex(keyed);}catch(e){if(e.name!=='TypeError'||e.message!=='(((s || {}).sleep || {}).nights || []).filter is not a function')throw e;return{ok:false,detail:'An indexed sleep collection crashes the recovery read instead of preserving the same recorded nights.'};}return{ok:JSON.stringify(actual)===JSON.stringify(expected),detail:'Array and indexed-object encodings of the same recorded nights must retain the same recovery facts.'};},
  control:B=>patch(B,'recoveryIndex',old=>s=>{const nights=s.sleep.nights;if(Array.isArray(nights))return old(s);const keys=Object.keys(nights||{});if(!keys.every(k=>/^\d+$/.test(k)))throw new TypeError('invalid indexed sleep collection');return old({...s,sleep:{...s.sleep,nights:keys.sort((a,b)=>Number(a)-Number(b)).map(k=>nights[k])}});}),
  mutants:[{name:'reader-assumes-array-methods-on-accepted-indexed-shape',make:B=>patch(B,'recoveryIndex',(_old,T)=>T.__auditOriginal.recoveryIndex)}]
};

})());

laws.push((()=>{
'use strict';
const { state, patch } = require('./helpers.cjs');
return {
  id:'E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day',defect:'D23',theme: 'state-shape-and-failure',family:'engine',
  cite:'src/app.jsx@fe516c1:1474,15484,15491; rebuild/engine/today.cjs:54,567,574; defect-witnesses-3.cjs D23',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.exercises=[{id:'hack',n:'Synthetic squat',day:'L',w:null,sets:3,hi:12,lo:8}];s.queue=[{id:'q_test',exId:'hack',kind:'debut',state:'READY',done:false,newW:100}];s.split=[{from:'2026-08-01',map:{4:'L'}}];
    const session=T.genSession(s,'2026-09-03',{last:null});const model=T.nowModel(s,{face:{word:'CALIBRATING',glyph:'x',cause:'Synthetic read'},fix:{state:'good'},prog:{state:'unknown',why:'only 0 lifts'}});
    return{ok:session.name==='LOWER'&&model.workout.today===true&&model.workout.iso==='2026-09-03'&&model.workout.title.startsWith('LOWER BODY'),detail:'The real scheduled lower session remains a workout when a hack debut is ready.'};},
  control:B=>patch(B,'nowModel',(old,T)=>(s,deps)=>{const out=old(s,deps);for(let i=0;i<7;i++){const d=T.todayStart();d.setDate(d.getDate()+i);const iso=T.isoOf(d),dt=T.dayType(iso,s);if(!['U','L'].includes(dt))continue;const session=T.genSession(s,iso,T.sleepInfo(s));if(session)return{...out,workout:{...out.workout,title:(dt==='U'?'UPPER BODY':'LOWER BODY')+' · '+(i===0?'TODAY':i===1?'TOMORROW':T.fmtShort(iso).toUpperCase()),today:i===0,iso}};}return out;}),
  mutants:[{name:'missing-sleep-argument-falls-through-to-rest-day',make:B=>patch(B,'nowModel',(_old,T)=>T.__auditOriginal.nowModel)}]
};

})());

laws.push((()=>{
'use strict';
const {clone,patch}=require('./helpers.cjs');
return {id:'V4-unknown-schema-return-untouched',defect:'D35',theme: 'state-shape-and-failure',family:'engine',cite:'D35; app.jsx @ fe516c1:12266,12268-12274',expect:'GREEN',
 run(B){const T=B.engine(),s={v:T.SCHEMA_V+1,sleep:null,reads:null,dailyLogs:null,sessionLog:null,futurePayload:{marker:'invented-future-schema'}},before=clone(s),out=T.migrate(s);return {ok:out===s&&JSON.stringify(s)===JSON.stringify(before),detail:'Unknown schema input must return by identity without field mutation.'};},
 control(B){return patch(B,'migrate',(old,T)=>s=>s&&s.v>T.SCHEMA_V?s:old(s));},
 mutants:[{name:'heal-before-version-guard',make:B=>patch(B,'migrate',(_,T)=>T.__auditOriginal.migrate)}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
