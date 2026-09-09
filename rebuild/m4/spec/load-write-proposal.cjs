'use strict';
// Disposable source proposal for approved D41/D43, not a product installation or
// post-fix acceptance runner. Only explicit synthetic athlete inputs are used.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),base='28ff3be3a0c47fa76b642015ac3757da5c76548c',NativeDate=Date;
const source=cp.execFileSync('git',['show',base+':rebuild/engine/writers.cjs'],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:8e6});
assert.equal(fs.readFileSync(path.join(root,'rebuild/engine/writers.cjs'),'utf8'),source,'Source proposal needs its exact integrated preimage');
for(const file of ['dates','constants','plan','progression','sleep','energy','policy','today','volume'].map(n=>'rebuild/engine/'+n+'.cjs').concat(['rebuild/m3/w7-preview/browser-engine.cjs','rebuild/m3/w7-preview/fixtures.cjs'])){
 const pinned=cp.execFileSync('git',['show',base+':'+file],{cwd:root,windowsHide:true,maxBuffer:8e6});
 assert(fs.readFileSync(path.join(root,file)).equals(pinned),'Changed data-free dependency: '+file);
}
const changes=[
 ['D41-debut','if (q.newW != null) { ex.w = q.newW; ex.wAt = clock.nowISO(); }',
  'if (q.newW != null) { ex.w = q.newW; ex.wAt = clock.nowISO(); } if (Array.isArray(q.newWSets)) ex.wSets = q.newWSets.slice();'],
 ['D41-reset','const oldW = ex3.w; ex3.w = ap.newW; ex3.wAt = clock.nowISO(); ex3.last = null;',
  'const oldW = ex3.w; ex3.w = ap.newW; ex3.wAt = clock.nowISO(); if (Array.isArray(ex3.wSets) && typeof oldW === "number") ex3.wSets = ex3.wSets.map(w => w + ex3.w - oldW); ex3.last = null;'],
 ['D43-entry','w: ex2 && typeof ex2.w === "number" ? ex2.w : null,',
  'w: typeof e.w === "number" ? e.w : ex2 && typeof ex2.w === "number" ? ex2.w : null,']
];
function proposal(exclude){let out=source;for(const [id,before,after]of changes){assert.equal(out.split(before).length,2,'Unique literal source site: '+id);if(id!==exclude)out=out.replace(before,after);}return out;}
const F=require('../../m3/w7-preview/fixtures.cjs');
// The accepted extraction parked earnWalk in migrate.cjs. Loading the complete
// migration factory is not a browser assembly. This diagnostic compiles ONLY its
// exact declaration from the integrated public source, with explicit bindings.
const migrate=cp.execFileSync('git',['show',base+':rebuild/engine/migrate.cjs'],{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:8e6});
const earnStart=migrate.indexOf('function earnWalk('),earnEnd=migrate.indexOf('// Copied from frozen',earnStart);
assert(earnStart>=0&&earnEnd>earnStart);const earnSource=migrate.slice(earnStart,earnEnd);
assert.equal(crypto.createHash('sha256').update(earnSource).digest('hex'),'888af1dc693a4a0929b6883a7ce5393f908890cb633059e193fe92fd1bb212c3');
const clock={today:()=> '2026-09-03',nowISO:()=> '2026-09-03T12:00:00.000Z',nowMs:()=>NativeDate.parse('2026-09-03T12:00:00.000Z'),hour:()=>12,dow:()=>4};
function engine(bytes){
 const E=require('../../m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});
 E.earnWalk=new Function('E','"use strict";const loadRungs=(...a)=>E.loadRungs(...a),nextLoad=(...a)=>E.nextLoad(...a),typicalError=(...a)=>E.typicalError(...a),beatsNoise=(...a)=>E.beatsNoise(...a);\n'+earnSource+'\nreturn earnWalk;')(E);
 const module={exports:{}};new Function('module','exports',bytes)(module,module.exports);
 let id=0;Object.assign(E,module.exports(E,{clock,ids:{next:()=> 'synthetic-'+(++id)},drafts:{length:0,key:()=>null}}));return E;
}
function state(){const s=F.createSyntheticState();s.sessionLog={};s.queue=[];s.feed=[];s.exercises=[{...s.exercises[0],id:'synthetic_press',n:'Synthetic press',day:'U',w:100,wSets:[100,95],sets:2,hi:10,lo:8,inc:5,last:[8,8],own:false,std:null,reclaim:null,ladder:null,topAt:null,topRun:0}];s.exOrder={U:['synthetic_press'],L:[]};s.agentProposals=[];return s;}
const entry=extra=>({id:'synthetic_press',w:100,reps:[10,10],rir:2,rirEnd:0,...extra}),slp={clean:true,last:{h:8},mean3:8};
function observe(E){
 let s=state();for(const d of ['2026-08-27','2026-08-31'])s=E.completeSession(s,d,[entry()],slp).s;
 const q=s.queue.find(x=>x.kind==='debut'&&!x.done);assert(q,'Real writer must queue the debut');assert.deepEqual(q.newWSets,[105,100]);
 const done=E.completeSession(s,'2026-09-03',[entry({w:105,reps:[9,8],isDebutNow:true})],slp).s;
 const resetState=state(),ap={id:'synthetic-reset',kind:'reset',exId:'synthetic_press',newW:90,title:'Synthetic reset'};resetState.agentProposals=[ap];
 const reset=E.applyAgentProposal(resetState,ap,'2026-09-03');
 const ownState=state();ownState.exercises[0].std=[8,8];ownState.exercises[0].own=true;
 const own=E.completeSession(ownState,'2026-09-03',[entry({w:110,reps:[8,8]})],slp);
 assert.equal(own.s.exercises[0].own,false);assert.equal(own.s.exercises[0].lastMeta.w,110);
 const repeated=E.completeSession(state(),'2026-09-03',[entry({w:110,reps:[8]}),entry({w:90,reps:[6]})],slp);
 const ordinary=E.completeSession(state(),'2026-09-03',[entry({w:100,reps:[8,8]})],slp);
 const omitted=entry({reps:[8,8]});delete omitted.w;
 const fallback=E.completeSession(state(),'2026-09-03',[omitted],slp);
 return {debut:done.exercises[0].wSets,reset:reset.exercises[0].wSets,owned:own.s.sessionLog['2026-09-03'].entries[0].w,
  repeated:repeated.s.sessionLog['2026-09-03'].entries.map(e=>e.w),ordinary,fallback,
  ownedLines:own.lines};
}
let count=0;
for(const mode of ['native','frozen']){
 if(mode==='frozen')globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[NativeDate.UTC(2027,0,1)]));}static now(){return NativeDate.UTC(2027,0,1);}};
 try{
  const old=observe(engine(source)),fixed=observe(engine(proposal()));
  assert.deepEqual(old.debut,[100,95]);assert.deepEqual(fixed.debut,[105,100]);
  assert.deepEqual(old.reset,[100,95]);assert.deepEqual(fixed.reset,[90,85]);
  assert.equal(old.owned,100);assert.equal(fixed.owned,110);
  assert.deepEqual(old.repeated,[90,90]);assert.deepEqual(fixed.repeated,[110,90]);
  assert.deepEqual(fixed.ordinary,old.ordinary);assert.deepEqual(fixed.fallback,old.fallback);assert.deepEqual(fixed.ownedLines,old.ownedLines);
  count+=7;console.log('LOAD WRITE '+mode+': 4 intended behavior changes; 3 complete-output/receipt controls PASS');
  for(const [id]of changes){const mutant=observe(engine(proposal(id)));const field={'D41-debut':'debut','D41-reset':'reset','D43-entry':'owned'}[id];assert.deepEqual(mutant[field],old[field]);assert.notDeepEqual(mutant[field],fixed[field]);count++;console.log('LOAD WRITE '+mode+' '+id+' source reversion DETECTED');}
 }finally{globalThis.Date=NativeDate;}
}
console.log('LOAD WRITE SOURCE PROPOSAL: '+count+'/'+count+' checks PASS; 3 exact proposed source replacements; product UNCHANGED; full gates NOT RUN');
console.log('SOURCE before '+crypto.createHash('sha256').update(source).digest('hex')+' proposed '+crypto.createHash('sha256').update(proposal()).digest('hex'));
