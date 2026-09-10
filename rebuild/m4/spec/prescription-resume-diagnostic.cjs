'use strict';
// Actual unchanged engine paths, invented public data only. This diagnoses lost
// prescription provenance; it neither fixes an engine nor defines a new rule.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../../..'),base='075f37c0e0cbe51ade41f42a667469cc4684cd0e';
const sources=['dates','constants','plan','progression','sleep','energy','policy','today','volume','writers'].map(n=>'rebuild/engine/'+n+'.cjs');
sources.push('rebuild/m3/w7-preview/browser-engine.cjs','rebuild/m3/w7-preview/fixtures.cjs');
const pins={};
for(const name of sources){
 const bytes=fs.readFileSync(path.join(root,name));
 const old=cp.spawnSync('git',['show',base+':'+name],{cwd:root,windowsHide:true,maxBuffer:8e6});
 assert.equal(old.status,0,'Missing public source pin');assert(bytes.equals(old.stdout),'Changed source: '+name);
 pins[name]=crypto.createHash('sha256').update(bytes).digest('hex');
}
const F=require(path.join(root,'rebuild/m3/w7-preview/fixtures.cjs')),clock={today:()=>F.SYNTHETIC_DAY};
const E=require(path.join(root,'rebuild/m3/w7-preview/browser-engine.cjs')).createBrowserEngine({clock});
Object.assign(E,require(path.join(root,'rebuild/engine/writers.cjs'))(E,{clock,ids:{next(){throw Error('Read-only diagnostic');}},drafts:{length:0,key:()=>null}}));
const copy=structuredClone;
// Explicit observed rendering inputs, not the whole engine return, an accepted
// prescription or a signed capture format. Missing setup remains absent.
function presented(state,session,id){
 const card=session.ex.find(e=>e.id===id);assert(card,'Synthetic card is missing');
 const value={id:card.id,name:card.n,load:card.w,targets:copy(card.tgt),effort:copy(E.rirPlan(state,card))};
 if(Object.hasOwn(card,'setup'))value.setup=copy(card.setup);
 return value;
}
function state(){
 const s=F.createSyntheticState();
 s.pulse=Array.from({length:14},(_,i)=>({d:F.dayOffset(F.SYNTHETIC_DAY,i-13),bpm:60}));
 return s;
}
const changes=[
 ['configured-load','load',s=>{s.exercises[0].w=60;}],
 ['configured-targets','targets',s=>{s.exercises[0].std=[6,6];}],
 ['configured-setup','setup',s=>{s.exercises[0].setup='SYNTHETIC changed seat and grip';}],
 ['configured-name','name',s=>{s.exercises[0].n='SYNTHETIC changed exercise label';}],
 ['current-alarm','effort',s=>{s.pulse[s.pulse.length-1].bpm=70;}],
 ['current-opener-history','effort',s=>{const id=s.exercises[0].id;s.sessionLog=Object.fromEntries([0,0,1].map((rir,i)=>[F.dayOffset(F.SYNTHETIC_DAY,-i-1),{type:'U',entries:[{id,rir,w:40,reps:[10,10]}]}]));}],
];
const observations=[];
// Refuted first hypothesis: changing last alone need not change today's target.
// Preserve the actual targetsFor/progressAnchor guard instead of stubbing it out.
{const s=state(),id=s.exercises[0].id,before=presented(s,E.genSession(s,F.SYNTHETIC_DAY),id);
 const changed=copy(s);changed.exercises[0].last=[6,6];
 assert.deepEqual(presented(changed,E.genSession(changed,F.SYNTHETIC_DAY),id).targets,before.targets);
 console.log('RESUME CONTROL last-only change: target unchanged under actual anchor path');}
// Non-vacuous slot-count control: current configuration has three slots, while
// the actual resumed card must keep the two captured slots in each draft form.
for(const form of ['ids-and-reps','legacy-reps-only']){
 const s=state(),id=s.exercises[0].id,dr={reps:{[id]:[9,8]}};
 if(form==='ids-and-reps')dr.ids=[id];
 s.exercises[0].sets=3;s.exercises[0].std=[6,6,6];
 const original=copy(dr),base=E.genSession(s,F.SYNTHETIC_DAY);
 assert.equal(base.ex.find(e=>e.id===id).tgt.length,3);
 const resumed=E.sessionFromDraft(s,F.SYNTHETIC_DAY,null,dr,base);
 assert.equal(resumed.ex.find(e=>e.id===id).tgt.length,2);assert.deepEqual(dr,original);
 console.log('RESUME CONTROL '+form+': current three slots / captured two slots retained');
}
for(const form of ['ids-and-reps','legacy-reps-only'])for(const [name,field,change]of changes){
 const initial=state(),id=initial.exercises[0].id,first=E.genSession(initial,F.SYNTHETIC_DAY),before=presented(initial,first,id);
 const draft={reps:{[id]:[9,8]}};if(form==='ids-and-reps')draft.ids=first.ex.map(e=>e.id);
 const draftBefore=copy(draft),firstBefore=copy(first),changed=copy(initial);change(changed);
 const changedBefore=copy(changed),newBase=E.genSession(changed,F.SYNTHETIC_DAY);
 const resumed=E.sessionFromDraft(changed,F.SYNTHETIC_DAY,null,draft,newBase),after=presented(changed,resumed,id);
 assert.deepEqual(draft,draftBefore,'Draft observations were mutated');assert.deepEqual(first,firstBefore,'Prior card object was mutated');
 assert.deepEqual(changed,changedBefore,'Read path mutated state');
 assert.notDeepEqual(after[field],before[field],'Expected actual source dependency did not fire: '+name);
 assert.equal(after.targets.length,draft.reps[id].length,'Captured slot count is not retained');
 observations.push({form,name,field,before,after,draft:copy(draft),status:'CURRENT_CONFIGURATION_REUSED'});
 console.log('RESUME DIAGNOSTIC '+form+' / '+name+': CURRENT_CONFIGURATION_REUSED; captured observations unchanged');
}
const outputIndex=process.argv.indexOf('--evidence');
if(outputIndex!==-1){assert(process.argv[outputIndex+1],'--evidence requires a new public output path');
 fs.writeFileSync(path.resolve(process.argv[outputIndex+1]),JSON.stringify({base,pins,observations,limits:'Actual source dependencies; no signed/durable capture, rule qualification, private data or phone.'},null,2)+'\n',{flag:'wx'});}
console.log('PRESCRIPTION RESUME DIAGNOSTIC: 12/12 actual-path differences CONFIRMED; observation/slot/read-only controls PASS; capture/qualification NOT IMPLEMENTED');
