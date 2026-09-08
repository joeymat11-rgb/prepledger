'use strict';
// Wholly invented states; actual factories + source-pinned trace carrier.
const Parent=require('./step-efficacy.cjs'),F=require('../helpers/set-one-era-cases.cjs');
const NativeDate=Date;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fit=(ys,dates)=>{if(ys.length!==4)throw Error('ERA30-MANUAL-FIT-SIZE');const step=ys[1]-ys[0];if(ys[2]-ys[1]!==step||ys[3]-ys[2]!==step)throw Error('ERA30-MANUAL-FIT-LINEAR');const pct=step/((ys[0]+ys[1]+ys[2]+ys[3])/4)*100,round=n=>+n.toFixed(3);return{status:'LIVE',exId:F.id,n:4,pct:round(pct),lo:round(pct-4.303*.001),hi:round(pct+4.303*.001),from:dates[0],to:dates.at(-1)};};
const claims=['result','input','host-parity','weather','pace','query-clock','idle-calls','storage','consumer'];
const cases=F.cases.map(({id})=>({id,defect:'D30',claims}));
const requiredMutants=['ERA30-NO-GUARD','ERA30-INVERTED','ERA30-LATEST-FORK','ERA30-EXCLUSIVE-BOUNDARY','ERA30-BORROW-OLD','ERA30-NO-LEGACY','ERA30-FUTURE-CUTOFF','ERA30-AMBIENT-CLOCK'];
function context(target,test){
 let day=target.day;const storage=[],calls=[];
 const clock={today(){calls.push({method:'today',day});return day;},nowMs(){const value=NativeDate.parse(day+'T12:00:00Z');calls.push({method:'nowMs',day,value});return value;},nowISO(){return new NativeDate(this.nowMs()).toISOString();},hour(){return 8;},dow(){return new NativeDate(day+'T12:00:00Z').getDay();},tz:'America/New_York'};
 const drafts={length:0,key(){return null;},getItem(k){storage.push(['get',k]);return null;},setItem(k,v){storage.push(['set',k,v]);},removeItem(k){storage.push(['remove',k]);}};
 const T=target.engine({clock,ids:{fresh(){throw Error('ERA30-UNEXPECTED-ID');}},drafts});T.HISTORY.length=0;T.ROLLUPS.length=0;
 const hosts=target.createHosts(T),assertions=[];
 return{T,clock,calls,storage,hosts,advance(d){day=d;},check(name,ok){if(!claims.includes(name))throw Error('ERA30-ASSERTION-UNKNOWN');assertions.push({id:test.id+'/'+name,ok:!!ok});},record(name,value){target.record(test.id+'.'+name,value);},assertions};
}
function runCase(c,definition,day){
 const f=definition.make(day),probeFixture=definition.make(day),before=c.hosts.snapshot(f.s),probeBefore=c.hosts.snapshot(probeFixture.s);
 const days=f.sequence||[f.queryDay||day],actual=[],probes=[],canonicalCalls=[],probeCalls=[];
 const oldDate=globalThis.Date;
 function AmbientTrap(...args){if(!args.length)throw Error('ERA30-AMBIENT-DATE');return Reflect.construct(NativeDate,args);}
 AmbientTrap.prototype=NativeDate.prototype;AmbientTrap.parse=NativeDate.parse;AmbientTrap.UTC=NativeDate.UTC;AmbientTrap.now=()=>{throw Error('ERA30-AMBIENT-NOW');};
 try{if(f.trap)globalThis.Date=AmbientTrap;
 for(const next of days){c.advance(next);c.calls.length=0;let value,error;
  try{value=c.T.setOneRead(f.s,F.id);}catch(e){error={name:e.name,message:e.message};}
  actual.push(error?{error}:{value});canonicalCalls.push(...c.calls);c.calls.length=0;
  probes.push(c.hosts.probeSetOne({state:probeFixture.s,exId:F.id,clock:c.clock,label:definition.id+'.probe'+probes.length}));probeCalls.push(...c.calls);
 }}finally{globalThis.Date=oldDate;}
 const expected=f.expectedSequence?f.expectedSequence.map(x=>({value:x.value||fit(x.fit,x.dates)})):
  f.expected?[{value:f.expected}]:f.expectedFit?[{value:fit(f.expectedFit,f.included)}]:f.error?[{error:{name:f.error.split(':')[0],message:f.error.split(':').slice(1).join(':')}}]:null;
 // No-fork outputs are additionally exact-compared to source expectations by the package.
 c.check('result',expected?same(actual,expected):actual.length===1&&!actual[0].error&&actual[0].value.status==='LIVE');
 c.check('input',same(before,c.hosts.snapshot(f.s))&&same(probeBefore,c.hosts.snapshot(probeFixture.s))&&c.T.HISTORY.length===0&&c.T.ROLLUPS.length===0);
 c.check('host-parity',same(actual,probes.map(p=>p.result))&&same(canonicalCalls,probeCalls));
 const frames=probes.flatMap(p=>p.frames),weather=frames.filter(x=>x.name==='dayWeather').map(x=>x.date),pace=frames.filter(x=>x.name==='paceRushed').map(x=>x.date);
 c.check('weather',same(weather,f.weatherDates||f.included));c.check('pace',same(pace,f.paceDates||f.included));
 c.check('query-clock',canonicalCalls.length===f.queryCalls&&probeCalls.length===f.queryCalls&&canonicalCalls.every(x=>days.includes(x.day)));
 c.check('idle-calls',!f.idle||frames.length===0);c.check('storage',c.storage.length===0);
 let lab=null;if(f.lab){c.advance(day);lab=c.T.labAnalytics2(f.s);const card=lab.find(x=>x.id==='set1');c.check('consumer',lab.length===24&&card?.status===f.labStatus&&same(before,c.hosts.snapshot(f.s)));}else c.check('consumer',true);
 c.record('complete',{state:f.s,actual,probeState:probeFixture.s,probes,canonicalCalls,probeCalls,lab,storage:c.storage});
}
const D30={id:'V4-D30-SET-ONE-ERA',defect:'D30',cite:'BRIEF-SET-ONE-ERA.md §1–3; fe516c1:8883–8911/3187–3191',expect:'GREEN',implementation:'PRESENT',requiredCases:cases.map(x=>x.id),requiredMutants,
 async run(target){const selected=F.cases.filter(x=>!target.caseId||x.id===target.caseId);if(!selected.length)throw Error('ERA30-CASE-MISSING');const assertions=[];for(const definition of selected){const test=cases.find(x=>x.id===definition.id),c=context(target,test);runCase(c,definition,target.day);if(c.assertions.length!==claims.length||new Set(c.assertions.map(x=>x.id)).size!==claims.length)throw Error('ERA30-ASSERTION-INVENTORY');assertions.push(...c.assertions);}return{ok:assertions.every(x=>x.ok),assertions};},mutant:[]};
module.exports={laws:[D30,...Parent.laws],INVENTORY:[D30.id,...Parent.INVENTORY],CASES:[...cases,...Parent.CASES],ASSERTION_INVENTORY:[...cases.flatMap(x=>claims.map(name=>({caseId:x.id,defect:'D30',id:x.id+'/'+name}))),...Parent.ASSERTION_INVENTORY],D30,FIXTURE:F,fit};
