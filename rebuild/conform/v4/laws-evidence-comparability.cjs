'use strict';
// Proposed desired behavior; red-first audit seeds, not ratified v3 laws.
const laws=[];
laws.push((()=>{
'use strict';
const { state, lift, patch } = require('./helpers.cjs');
return {
  id:'P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit',defect:'D29',theme: 'evidence-comparability',family:'progression',
  cite:'src/app.jsx@fe516c1:8631,8693; rebuild/engine/volume.cjs:41,81; defect-witnesses-4.cjs D29',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.exercises=[lift({id:'press',sets:3,hi:12}),lift({id:'front',n:'Synthetic front raise',mg:'delts',head:'delts_front',sets:2})];for(const d of ['2026-08-31','2026-09-03'])s.sessionLog[d]={entries:[{id:'press',w:100,reps:[10,10,10],rirSets:[0,0,0]},{id:'front',w:100,reps:[10,10],rirSets:[0,0]}]};const p=T.programmeVolume(s).find(m=>m.mg==='delts_front'),r=T.muscleVolume(s).find(m=>m.mg==='delts_front');return{ok:p.sets===7&&r.n7===p.sets,detail:'Completing the planned presses and front raises retains the same indirect front-delt credit in the logged total.'};},
  control:B=>patch(B,'muscleVolume',(old,T)=>s=>{const out=old(s);const delta=(lo,hi)=>Object.entries(s.sessionLog||{}).reduce((sum,[d,sl])=>{const age=(T.todayStart()-T.mk(d))/T.DAY;return age>=lo&&age<hi?sum+(sl.entries||[]).reduce((n,en)=>n+((T.INDIRECT[en.id]||{}).delts||0)*(en.reps||[]).length,0):sum;},0);return out.map(m=>m.mg==='delts_front'?{...m,n7:m.n7+delta(0,7),p7:m.p7+delta(7,14)}:m);}),
  mutants:[{name:'press-credit-goes-to-unreturned-coarse-delt-bucket',make:B=>patch(B,'muscleVolume',(_old,T)=>T.__auditOriginal.muscleVolume)}]
};

})());

laws.push((()=>{
'use strict';
const { state, lift, patch } = require('./helpers.cjs');
return {
  id:'P-D30-first-set-trend-respects-the-recorded-technique-era',defect:'D30',theme: 'evidence-comparability',family:'progression',
  cite:'src/app.jsx@fe516c1:8887-8893,3187-3191; rebuild/engine/volume.cjs:193-200; defect-witnesses-4.cjs D30',expect:'GREEN',
  run(B){const T=B.engine(),s=state();s.exercises=[lift({id:'synthetic-press',sets:3,hi:12,forks:[{from:'2026-09-01',kind:'technique',prevN:'Other technique'}]})];for(const [i,d] of ['2026-08-10','2026-08-17','2026-08-24','2026-09-03'].entries())s.sessionLog[d]={entries:[{id:'synthetic-press',w:100,reps:[10+i,10+i],rirSets:[0,0]}]};const r=T.setOneRead(s,'synthetic-press');return{ok:T.liftTrend(s,'synthetic-press')===null&&r.status==='COUNTING'&&r.n===1,detail:'A single session in the current technique era cannot inherit a live first-set trend from three earlier-era sessions.'};},
  control:B=>patch(B,'setOneRead',(old,T)=>(s,id)=>{const forks=T.forksOf(s,id),today=T.isoOf(T.todayStart());const sessionLog=Object.fromEntries(Object.entries(s.sessionLog||{}).filter(([d])=>T.sameEra(forks,d,today)));return old({...s,sessionLog},id);}),
  mutants:[{name:'same-load-first-sets-pool-across-technique-forks',make:B=>patch(B,'setOneRead',(_old,T)=>T.__auditOriginal.setOneRead)}]
};

})());

laws.push((()=>{
'use strict';
const {state,lift,clone,patch}=require('./helpers.cjs');
return {id:'V4-volume-tolerance-post-change',defect:'D31',theme: 'evidence-comparability',family:'progression',cite:'D31; app.jsx @ fe516c1:8917-8932,3213,3237-3243',expect:'GREEN',
 run(B){const T=B.engine(),s=state();s.exercises=[lift({id:'synthetic-press',sets:3,hi:12})];s.events=[{d:'2026-09-01',t:'Synthetic event',estimated:false}];for(const [i,d] of ['2026-08-10','2026-08-14','2026-08-18','2026-08-22'].entries())s.sessionLog[d]={entries:[{id:'synthetic-press',w:100,reps:[10+i,10+i],rirSets:[0,0]}]};s.sessionLog['2026-09-01']={entries:[{id:'synthetic-press',w:100,reps:[14,14,14],rirSets:[0,0,0]}]};if(!T.dayWeather(s,'2026-09-01').hardSession)throw Error('D31 synthetic exclusion missing');const r=T.volumeConversion(s,'synthetic-press');return {ok:r.status!=='LIVE'||(r.trend.k===r.k&&r.trend.pts.every(p=>p.d>=r.changedAt)),detail:'Tolerance must use qualifying evidence after the set change.'};},
 control(B){return patch(B,'volumeConversion',(old)=>function(s,id){const r=old(s,id);return r.status==='LIVE'&&(r.trend.k!==r.k||r.trend.pts.some(p=>p.d<r.changedAt))?{...r,status:'READING',tier:undefined,tolerated:null}:r;});},
 mutants:[{name:'reuse-pre-change-tolerance',make:B=>patch(B,'volumeConversion',(_,T)=>T.__auditOriginal.volumeConversion)}]};

})());

laws.push((()=>{
'use strict';
const {state,lift,clone,patch}=require('./helpers.cjs');
return {id:'V4-volume-replication-same-era',defect:'D32',theme: 'evidence-comparability',family:'progression',cite:'D32; app.jsx @ fe516c1:8971-8979,1798-1813',expect:'GREEN',
 run(B){const T=B.engine(),s=state();s.exercises=[lift({id:'synthetic-press',sets:3,hi:12,forks:[{from:'2026-04-01',kind:'technique',prevN:'Other technique'}]})];for(const [dates,k]of [[['2026-01-01','2026-01-20','2026-02-10','2026-02-28','2026-03-15'],2],[['2026-07-01','2026-07-15','2026-08-01','2026-08-15','2026-09-03'],3]])for(const[i,d]of dates.entries())s.sessionLog[d]={entries:[{id:'synthetic-press',w:100,reps:Array(k).fill(8+i),rirSets:Array(k).fill(0)}]};if(T.sameEra(T.forksOf(s,'synthetic-press'),'2026-03-15','2026-09-03'))throw Error('D32 synthetic era seam missing');const r=T.volumeConversion(s,'synthetic-press');return {ok:r.tier!=='REPLICATED',detail:'No current-era earlier block exists to establish replication.'};},
 control(B){return patch(B,'volumeConversion',(old,T)=>function(s,id){const v=clone(s),forks=T.forksOf(s,id),asOf=Object.keys(v.sessionLog).sort().at(-1);for(const d of Object.keys(v.sessionLog))if(!T.sameEra(forks,d,asOf))v.sessionLog[d].entries=v.sessionLog[d].entries.filter(e=>e.id!==id);return old(v,id);});},
 mutants:[{name:'compare-earlier-technique-block',make:B=>patch(B,'volumeConversion',(_,T)=>T.__auditOriginal.volumeConversion)}]};

})());
module.exports={laws,INVENTORY:laws.map(l=>l.id)};
