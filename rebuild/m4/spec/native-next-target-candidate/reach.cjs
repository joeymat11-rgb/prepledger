'use strict';
// Reached-delegate inventory for the two exposed readers (evidence only). Every
// composed engine function is counted while genSession and rirPlan run over
// legacy-only and registered-native inputs on each alarm branch. Output lists
// the modules, the delegates each reader reached and what was never reached.
const fs=require('node:fs'),path=require('node:path');
const X=require('./fixture.cjs'),Runtime=X.mod('rebuild/m4/workout/engine-runtime.cjs');
const clock=X.clockFor(X.DAY),sources=X.candidateSources(),read=X.loadSources(sources);
const owner={},counts={};
const E={HISTORY:Runtime.absentProvider('HISTORY'),ROLLUPS:Runtime.absentProvider('ROLLUPS'),exById:(s,id)=>s.exercises.find(e=>e.id===id)};
const deps={clock,ids:{next(){throw new Error('no ids');}},drafts:Object.freeze({length:0,key:()=>null})};
for(const name of Runtime.COMPOSITION.modules){const create=read('rebuild/engine/'+name+'.cjs');const out=name==='performed'?create(E,{nativeTrendContext:X.assumed}):create(E,deps);
 for(const [k,v]of Object.entries(out)){owner[k]=name;if(typeof v==='function'){counts[k]=0;out[k]=function(...a){counts[k]++;return v.apply(this,a);};}}Object.assign(E,out);}
const pulses=spec=>{const out=[];for(let i=0;i<14;i++)out.push({d:X.F.dayOffset(X.DAY,i-13),bpm:60});for(const [o,b]of Object.entries(spec))out[13+Number(o)].bpm=b;return out;};
const branches={none:s=>{s.pulse=pulses({});},red:s=>{s.pulse=pulses({0:71});},amber:s=>{s.pulse=pulses({0:68});}};
(async()=>{
 const f=await X.durable();const reached={};
 try{
  await f.workout({lift:'demo-leg',sets:[{reps:8,reserve:X.bound},{reps:7,reserve:X.exact(0)}]});const facts=await f.facts();
  for(const [branch,mutate]of Object.entries(branches))for(const native of [false,true]){
   for(const k of Object.keys(counts))counts[k]=0;
   const s=native?f.engineState(facts,mutate):(()=>{const s=X.F.createSyntheticState(X.DAY);mutate(s);return s;})();
   const session=E.genSession(s,X.DAY,{});const afterGen=Object.fromEntries(Object.entries(counts).filter(([,n])=>n>0));
   for(const k of Object.keys(counts))counts[k]=0;
   for(const card of session.ex)E.rirPlan(s,{...card,holdFlag:false},{});const afterRir=Object.fromEntries(Object.entries(counts).filter(([,n])=>n>0));
   reached[branch+(native?'/native':'/legacy')]={genSession:Object.keys(afterGen).sort().map(k=>owner[k]+'.'+k),rirPlan:Object.keys(afterRir).sort().map(k=>owner[k]+'.'+k)};
  }
 }finally{f.close();}
 const all=new Set(Object.values(reached).flatMap(r=>[...r.genSession,...r.rirPlan]));
 const never=Object.keys(counts).map(k=>owner[k]+'.'+k).filter(k=>!all.has(k)).sort();
 const writers=Object.keys(owner).filter(k=>owner[k]==='writers').map(k=>'writers.'+k);
 const out={profile:'earned/engine-runtime-reach/v1',modules:Runtime.COMPOSITION.modules,exposed:Runtime.COMPOSITION.exposed,reached,reachedUnion:[...all].sort(),
  neverReached:never,writerFunctionsReached:[...all].filter(k=>k.startsWith('writers.')),writerFunctionsComposedButUnreached:writers.filter(k=>!all.has(k)).length,
  labOrHistoryReached:[...all].filter(k=>/labAnalytics|labGroups|stepEfficacy|sleepLab|shelfItems/.test(k))};
 const dest=process.argv[2];fs.writeFileSync(dest,JSON.stringify(out,null,1)+'\n');
 console.log('reached union',all.size,'| writers reached',out.writerFunctionsReached.join(','),'| lab/history reached',out.labOrHistoryReached.length,'| never',never.length);
})().catch(e=>{console.error(e);process.exit(1);});
