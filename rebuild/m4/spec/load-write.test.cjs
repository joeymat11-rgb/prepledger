'use strict';
// Actual retained modules, synthetic observations, and the exact integrated
// preimage. Focused evidence only; the complete post-fix PACKAGE remains required.
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),Module=require('node:module');
const S=require('./load-write-source.cjs'),root=path.resolve(__dirname,'../../..'),NativeDate=Date;
const before=S.baseline(root),constructed=S.construct(before);
test('closed integrated source construction',()=>{S.verify(root);assert.throws(()=>S.verify(root,{}),/accepts no caller-supplied postimage/);});
const F=require('../../m3/w7-preview/fixtures.cjs');
const clock={today:()=> '2026-09-03',nowISO:()=> '2026-09-03T12:00:00.000Z',nowMs:()=>NativeDate.parse('2026-09-03T12:00:00.000Z'),hour:()=>12,dow:()=>4};
function deps(){let id=0;return {clock,ids:{next:()=> 'synthetic-'+(++id),fresh:p=>(p||'')+'synthetic-'+(++id)},drafts:{length:0,key:()=>null}};}
// Baseline/fault loading is diagnostic only. The candidate uses normal static
// require(), including its real index.cjs order. No dynamic loader ships.
function loadSources(sources){const cache=new Map();return function load(file){
 const full=path.resolve(root,file);if(cache.has(full))return cache.get(full).exports;
 const relative=path.relative(root,full).split(path.sep).join('/');
 if(!Object.hasOwn(sources,relative))throw Error('Unlisted source import: '+relative);
 const m=new Module(full,module);m.filename=full;m.paths=Module._nodeModulePaths(path.dirname(full));cache.set(full,m);
 m.require=request=>load(path.resolve(path.dirname(full),request));m._compile(sources[relative],full);return m.exports;
};}
const baseline=()=>loadSources(before)('rebuild/engine/index.cjs').createEngine(deps());
const candidate=()=>require('../../engine/index.cjs').createEngine(deps());
function browser(){const E=require('../../m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock});Object.assign(E,require('../../engine/writers.cjs')(E,deps()));return E;}
function state(){const s=F.createSyntheticState();s.sessionLog={};s.queue=[];s.feed=[];s.exercises=[{...s.exercises[0],id:'synthetic_press',n:'Synthetic press',day:'U',w:100,wSets:[100,95],sets:2,hi:10,lo:8,inc:5,last:[8,8],own:false,std:null,reclaim:null,ladder:null,topAt:null,topRun:0}];s.exOrder={U:['synthetic_press'],L:[]};s.agentProposals=[];return s;}
const entry=extra=>({id:'synthetic_press',w:100,reps:[10,10],rir:2,rirEnd:0,...extra}),slp={clean:true,last:{h:8},mean3:8};
function queued(E){let s=state();for(const d of ['2026-08-27','2026-08-31'])s=E.completeSession(s,d,[entry()],slp).s;assert(s.queue.some(q=>q.kind==='debut'&&!q.done),'Reached real earnWalk must queue the earned increase');return s;}
function debut(E,noVector=false){const s=queued(E),q=s.queue.find(q=>q.kind==='debut'&&!q.done);if(noVector)delete q.newWSets;const out=E.completeSession(s,'2026-09-03',[entry({w:105,reps:[9,8],isDebutNow:true})],slp);return {out,id:q.id};}
function reset(E,vector=[100,95],old=100,absent=false){const s=state();s.exercises[0].w=old;if(absent)delete s.exercises[0].wSets;else s.exercises[0].wSets=vector;const ap={id:'synthetic-reset',kind:'reset',exId:'synthetic_press',newW:90,title:'Synthetic reset'};s.agentProposals=[ap];return E.applyAgentProposal(s,ap,'2026-09-03');}
function own(E){const s=state();s.exercises[0].own=true;s.exercises[0].std=[8,8];return E.completeSession(s,'2026-09-03',[entry({w:110,reps:[8,8]})],slp);}
function union(E){const a=E.completeSession(state(),'2026-08-27',[entry()],slp).s,b=E.completeSession(state(),'2026-08-31',[entry()],slp).s;return E.mergeState(a,b);}
function exactLegacyControls(E,R){
 const ordinary=[entry({w:100,reps:[8,8]})],omitted=[entry({reps:[8,8]})];delete omitted[0].w;
 for(const entries of [ordinary,omitted])assert.deepEqual(E.completeSession(state(),'2026-09-03',entries,slp),R.completeSession(state(),'2026-09-03',entries,slp));
 assert.deepEqual(debut(E,true),debut(R,true));
 assert.deepEqual(reset(E,null),reset(R,null));
 assert.deepEqual(reset(E,undefined,100,true),reset(R,undefined,100,true));
 assert.deepEqual(reset(E,[100,95],null),reset(R,[100,95],null));
}
for(const mode of ['native','frozen'])test('installed load writes and canonical earn assembly — '+mode,()=>{
 if(mode==='frozen')globalThis.Date=class extends NativeDate{constructor(...a){super(...(a.length?a:[NativeDate.UTC(2027,0,1)]));}static now(){return NativeDate.UTC(2027,0,1);}};
 try{
  const R=baseline();
  for(const factory of [candidate,browser]){
   const E=factory(),d=debut(E),q=d.out.s.queue.find(q=>q.id===d.id);
   assert.deepEqual(debut(R).out.s.exercises[0].wSets,[100,95]);
   assert.deepEqual(d.out.s.exercises[0].wSets,[105,100]);assert.notEqual(d.out.s.exercises[0].wSets,q.newWSets,'Adopted vector does not alias queue');
   assert.deepEqual(reset(R).exercises[0].wSets,[100,95]);assert.deepEqual(reset(E).exercises[0].wSets,[90,85]);
   const fixedOwn=own(E),oldOwn=own(R);assert.equal(oldOwn.s.sessionLog['2026-09-03'].entries[0].w,100);assert.equal(fixedOwn.s.sessionLog['2026-09-03'].entries[0].w,110);assert.deepEqual(fixedOwn.lines,oldOwn.lines);
   assert.deepEqual(E.completeSession(state(),'2026-09-03',[entry({w:110,reps:[8]}),entry({w:90,reps:[6]})],slp).s.sessionLog['2026-09-03'].entries.map(e=>e.w),[110,90]);
   exactLegacyControls(E,R);
  }
  const C=candidate(),other=candidate();assert.deepEqual(Object.keys(C).sort(),Object.keys(R).sort());assert.notEqual(C.earnWalk,other.earnWalk);assert.notEqual(C.SEED,other.SEED);
  const merged=union(C);assert(merged.queue.some(q=>q.kind==='debut'&&!q.done),'Merge exit reaches migration late delegate and canonical earn');assert.deepEqual(merged,union(R));
  const bare=structuredClone(merged);bare.queue=[];bare.feed=bare.feed.filter(f=>!/ EARNED$/.test(f.t));
  // Actual migrate remains byte-identical in behavior on explicit synthetic input.
  assert.deepEqual(C.migrate(structuredClone(bare)),R.migrate(structuredClone(bare)));
  for(const [id,oldBytes,newBytes]of S.CHANGES){const faulty={...constructed,'rebuild/engine/writers.cjs':S.replace(constructed['rebuild/engine/writers.cjs'],newBytes,oldBytes,id+' reversion')};const M=loadSources(faulty)('rebuild/engine/index.cjs').createEngine(deps());
   if(id==='D41-debut')assert.throws(()=>assert.deepEqual(debut(M).out.s.exercises[0].wSets,[105,100]),assert.AssertionError);
   if(id==='D41-reset')assert.throws(()=>assert.deepEqual(reset(M).exercises[0].wSets,[90,85]),assert.AssertionError);
   if(id==='D43-entry')assert.throws(()=>assert.equal(own(M).s.sessionLog['2026-09-03'].entries[0].w,110),assert.AssertionError);
  }
  const noop={...constructed,[S.EARN]:'module.exports = function(E) { return { earnWalk: function() {} }; };\n'},N=loadSources(noop)('rebuild/engine/index.cjs').createEngine(deps());
  assert.throws(()=>queued(N),/Reached real earnWalk/);assert.equal(union(N).queue.some(q=>q.kind==='debut'&&!q.done),false,'No-op cannot satisfy merge mint witness');
  const wrongOrder={...constructed,'rebuild/engine/index.cjs':S.replace(constructed['rebuild/engine/index.cjs'],'  require("./migrate.cjs"),\n  require("./earn.cjs"),\n','  require("./earn.cjs"),\n  require("./migrate.cjs"),\n','wrong assembly order')};
  const loop=loadSources(wrongOrder)('rebuild/engine/index.cjs').createEngine(deps());assert.throws(()=>queued(loop),RangeError,'Wrong factory order reaches a recursive delegate');
 }finally{globalThis.Date=NativeDate;}
});
