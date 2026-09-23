'use strict';
// FC12 RED-FIRST CELLS, COMMON PART ONLY (NATIVE-LOAD-SPEC 60bb5e9, sha256 cb68ebd2...).
// Test bytes only. Implements the D1 rows (or the common parts of D1 rows) that
// hold under EVERY owner answer: nothing marked [YES-ONLY]/[NO-ONLY] is asserted.
// The engine under test is composed HERE from the twelve public factories by
// explicit name (the MODULES order of rebuild/m4/workout/engine-runtime.cjs),
// plus rebuild/engine/native-load.cjs appended after writers when it exists
// (FC04). rebuild/engine/index.cjs is never required. A loader guard refuses the
// protected five (seed, migrate, merge, index, oracle-shim) before any engine
// file is loaded. Every fixture value is INVENTED (D1); engine constants are READ.
// RED CONTRACT: until FC01/FG01 exist every row fails at a precise gate
// (RED NATIVE_LOAD_MODULE_ABSENT / RED UPDATE_OPENER_HOLD_NOT_EXPORTED), after
// its green fixture preconditions against the unchanged engine have passed.
// SPEC GAPS (declared seams, one place each; the build package adapts only here):
//  G1 basisFor: the spec fixes the Basis field NAMES, not their encodings.
//  G2 decisionOf: an Evaluation offer is read as the Decision body (or offer.body).
//  G3 completionId: request.completion_op_id is the completion's Close op id.
//  G4 retired (spec R6 :126): TARGET_QUEUED refs are the queued effect's authority Refs from basis.effect_frontier, [] when absent.
//  G5 and G6 are spec R6 :108 (absent typed origin -> null) and :176 (refusal refs, with named exceptions).
const Module=require('node:module'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../../..');
const PROTECTED=/[\\/]rebuild[\\/]engine[\\/](seed|migrate|merge|index|oracle-shim)\.cjs$/;
const originalLoad=Module._load;
Module._load=function guardedLoad(request,parent,isMain){
 let file=null;try{file=Module._resolveFilename(request,parent,isMain);}catch{file=null;}
 if(typeof file==='string'&&PROTECTED.test(file)){const e=new Error('PROTECTED_ENGINE_MODULE_REFUSED '+path.basename(file));e.code='PROTECTED_ENGINE_MODULE_REFUSED';throw e;}
 return originalLoad.apply(this,arguments);
};
const test=require('node:test'),assert=require('node:assert/strict');
const F=require(path.join(ROOT,'rebuild/m3/w7-preview/fixtures.cjs'));
const MODULES=Object.freeze(['dates','constants','plan','performed','progression','sleep','energy','policy','today','volume','earn','writers']);
const FACTORIES=Object.freeze(Object.fromEntries(MODULES.map(n=>[n,require(path.join(ROOT,'rebuild/engine',n+'.cjs'))])));
const NATIVE_FILE=path.join(ROOT,'rebuild/engine/native-load.cjs');
const NATIVE=(()=>{try{return {factory:require(NATIVE_FILE),reason:null};}
 catch(e){if(e&&e.code==='MODULE_NOT_FOUND'&&String(e.message).split('\n')[0].includes('native-load.cjs'))return {factory:null,reason:'MODULE_NOT_FOUND rebuild/engine/native-load.cjs'};throw e;}})();
function absentProvider(name){const fail=()=>{const e=new Error('ENGINE_RUNTIME_'+name+'_PROVIDER_REQUIRED');e.code=e.message;throw e;};
 const trap={};for(const k of ['filter','map','forEach','slice','find','some','every','reduce','flatMap','concat','entries','values','keys','at','includes'])trap[k]=fail;
 Object.defineProperty(trap,Symbol.iterator,{value:fail});Object.defineProperty(trap,'length',{get:fail});return Object.freeze(trap);}
const clockFor=day=>({today:()=>day,nowISO:()=>day+'T12:00:00.000Z',nowMs:()=>Date.parse(day+'T12:00:00.000Z'),hour:()=>12,dow:()=>new Date(day+'T00:00:00Z').getUTCDay()});
// Declared synthetic context assumption (the native-next-target-candidate pattern), not a physiological provider.
const assumedContext=request=>({...request,hard:false,rushed:false,debt:false});
function engineAt(day){
 const mint=()=>{const e=new Error('ENGINE_RUNTIME_IDS_UNAVAILABLE');e.code=e.message;throw e;};
 const deps={clock:clockFor(day),ids:Object.freeze({next:mint,fresh:mint}),drafts:Object.freeze({length:0,key:()=>null})};
 const E={HISTORY:absentProvider('HISTORY'),ROLLUPS:absentProvider('ROLLUPS'),exById:(s,id)=>s.exercises.find(e=>e.id===id)};
 for(const name of MODULES)Object.assign(E,name==='performed'?FACTORIES[name](E,{nativeTrendContext:assumedContext}):FACTORIES[name](E,deps));
 if(NATIVE.factory)Object.assign(E,NATIVE.factory(E,deps));
 return E;
}
// PRECISE RED GATES. Nothing else in a row may fail first on the unchanged engine.
function nativeGate(E){
 assert.ok(NATIVE.factory,'RED NATIVE_LOAD_MODULE_ABSENT: '+NATIVE.reason+' (FC01; spec B Functions)');
 assert.equal(typeof NATIVE.factory,'function','RED NATIVE_LOAD_NOT_A_FACTORY: native-load.cjs must export an engine factory (FC04 appends it after writers)');
 for(const n of ['evaluateNativeLoad','applyNativeLoadDecision'])assert.equal(typeof E[n],'function','RED NATIVE_LOAD_EXPORT_ABSENT: '+n);
}
function holdGate(E){assert.equal(typeof E.updateOpenerHold,'function','RED UPDATE_OPENER_HOLD_NOT_EXPORTED: writers factory return table (writers.cjs:2928) lacks updateOpenerHold (FG01)');}

// ---------- D1 fixture F0 and completions (INVENTED) ----------
const LIFT='fx-press',ATH='ath-fx',D0='2026-10-01',CARD_DAY='2026-10-12'; // CARD_DAY is a Monday: day type 'U' in createSyntheticState's split
const lb=value=>({value,unit:'lb'}),rep=value=>({value,unit:'rep'});
const X=value=>({tag:'exact',value,unit:'rep'}),AT_LEAST_3=Object.freeze({tag:'at_least',value:3,unit:'rep'}),UNKNOWN=Object.freeze({tag:'unknown'});
const e=(...xs)=>xs.map(x=>typeof x==='number'?X(x):structuredClone(x));
const dayAt=i=>F.dayOffset(D0,i);
const commit=id=>'sha256:'+crypto.createHash('sha256').update('fx-commitment|'+id).digest('hex');
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function F0(patch={}){
 const s=F.createSyntheticState(CARD_DAY);s.sessionLog={};
 const ex={id:LIFT,n:'Fx Press',mg:'chest',day:'U',w:100,inc:5,sets:3,hi:10,holdFlag:false,topAt:null,topRun:0,setup:'SYNTHETIC',note:'SYNTHETIC',forks:[]};
 for(const [k,v]of Object.entries(patch)){if(v===undefined)delete ex[k];else ex[k]=structuredClone(v);}
 s.exercises.push(ex);return s;
}
// One native Start/set/normal Close. reps/effort are per ORIGINAL position; loads
// and prescribed are a number (every set) or an array; prescribed null = not_prescribed.
function C(n,{date=dayAt(n-1),reps,loads=100,effort,prescribed=100,unresolvedAt=[],corrected={}}){
 const start='fx-start-'+n,close='fx-close-'+n,ops=[start];
 const L=Array.isArray(loads)?loads:reps.map(()=>loads),P=Array.isArray(prescribed)?prescribed:reps.map(()=>prescribed);
 const slots=reps.map((r,k)=>{
  const position=k+1,logical_set_slot=JSON.stringify([LIFT,position]),id='fx-set-'+n+'-'+position;
  const prescribed_load=P[k]==null?{state:'not_prescribed'}:{state:'specified',source:lb(P[k])};
  if(unresolvedAt.includes(position))return {position,logical_set_slot,prescribed_load,state:'unresolved',issues:['SET_INTERPRETATION_REQUIRED']};
  ops.push(id);
  const original={load:lb(L[k]),reps:rep(r),reserve:structuredClone(effort[k])},fix=corrected[position];
  const edit_op_ids=fix===undefined?[]:['fx-edit-'+n+'-'+position];ops.push(...edit_op_ids);
  const current=fix===undefined?structuredClone(original):{...structuredClone(original),reps:rep(fix)};
  return {position,logical_set_slot,prescribed_load,state:'performed',fact:{source_op_id:id,source_status:'stored-on-this-device',included:true,current,
   current_status:'stored-on-this-device',edit_op_ids,issues:[],original,logical_set_slot,lift_lineage_id:LIFT}};
 });
 ops.push(close);
 return {n,start,close,date,ops,session:{start_op_id:start,effective:{local_date:date,local_time:'10:00',utc_offset:'+00:00'},
  record:{entries:[{profile:'earned/performed-lift/v2',start_op_id:start,lift_lineage_id:LIFT,completion:{op_id:close,kind:'normal',status:'stored-on-this-device'},slots}]}}};
}
function withFacts(state,comps){
 const s=structuredClone(state);
 s.workoutFacts={profile:'earned/workout-facts/v1',source_revision:1,
  order:{profile:'earned/workout-order/v1',frontier:comps.reduce((a,c)=>a+c.ops.length,0),start_ids:comps.map(c=>c.start)},
  sessions:comps.map(c=>structuredClone(c.session))};
 return s;
}
const ref=id=>({op_id:id,commitment:commit(id)});
// G1: Basis with the spec's exact eight field names; encodings are this test's declared choice.
// ctx.frontier: effect_frontier entries {spend_id,response_refs,close_ref}; ctx.authority: plan authority op ids
// (load_basis.authority_refs); ctx.forks: technique-fork op ids (technique.fork_refs). Their ops join coverage.
function basisFor(state,comps,ctx={}){
 const frontier=ctx.frontier||[],authority=ctx.authority||[],forkOps=ctx.forks||[];
 const extra=[...authority,...forkOps,...frontier.flatMap(f=>f.response_refs.map(r=>r.op_id))];
 const ex=state.exercises.find(x=>x.id===LIFT),opt=k=>Object.hasOwn(ex,k)?{present:true,value:structuredClone(ex[k])}:{present:false,value:null};
 return {athlete_id:ATH,source:{W:0,log_digest:'fx-empty-prefix',selection_id:null},
  coverage:[...comps.flatMap(c=>c.ops),...extra].sort().map(op_id=>({op_id,commitment:commit(op_id),disposition:'stored-on-this-device',source_member:null})),
  order:{start_ids:comps.map(c=>c.start),frontier:state.workoutFacts.order.frontier},
  plan:{plan_basis:'fx-plan',input_basis:'fx-input',programme_sha256:sha(state.exercises),capture_sha256:sha(comps.map(c=>c.session.record.entries[0].slots.map(x=>x.prescribed_load))),structural_queue_sha256:sha(state.queue)},
  technique:{forks:structuredClone(ex.forks||[]),fork_refs:forkOps.map(ref)},
  load_basis:{authority_refs:authority.map(ref),tenure_start:null,sets:ex.sets,prefix:ex.sets,hi:ex.hi,steps:opt('steps'),inc:opt('inc'),w:opt('w'),wSets:opt('wSets')},
  effect_frontier:structuredClone(frontier).sort((a,b)=>a.spend_id<b.spend_id?-1:a.spend_id>b.spend_id?1:0)};
}
const completionId=c=>c.close; // G3
const request=(state,comps,c,ctx={})=>({lift_lineage_id:LIFT,completion_op_id:completionId(c),intent:'check',basis:basisFor(state,comps,ctx)});
const decisionOf=o=>o&&o.body&&typeof o.body==='object'&&o.body.profile?o.body:o; // G2

// ---------- shared assertions ----------
const Loads=(...vs)=>vs.map(lb);
const DECISION_KEYS=['base_load','basis','candidate','compensates','consumes','evidence','kind','lift_lineage_id','profile','reason_key','spend_id','target_load'];
const FIELD_KEYS=['last','lastMeta','own','std','topAt','topRun','w','wAt','wSets'];
function evaluate(E,state,req){
 const before=JSON.stringify(state),ev=E.evaluateNativeLoad(state,req);
 assert.equal(JSON.stringify(state),before,'FC01 never modifies state');
 assert.deepEqual(JSON.parse(JSON.stringify(ev)),ev,'Evaluation is strict plain JSON (no token, getter or undefined escapes)');
 assert.ok(!JSON.stringify(ev).includes('[object'),'no coerced object text anywhere in the Evaluation');
 assert.equal(ev.profile,'earned/native-load/v1');
 assert.deepEqual(ev.basis,req.basis,'Evaluation.basis is the claimed basis of the request, unchanged');
 SEEN.set(ev,{state:structuredClone(state),req:structuredClone(req)});
 return ev;
}
const SEEN=new WeakMap();
// Spec :82/:108 evidence set from a typed slot. R6 :108 (G5): an absent typed origin (original slot) is carried as null.
function evidenceSet(slot){
 const f=slot.fact,cur=slot.state==='performed'&&f.current?f.current:null;
 return {slot:slot.logical_set_slot,position:slot.position,origin:slot.origin??null,state:slot.state,
  original:f?ref(f.source_op_id):slot.skip_op_id?ref(slot.skip_op_id):null,edits:(f?f.edit_op_ids:[]).map(ref),
  current:cur?{load:structuredClone(cur.load),reps:structuredClone(cur.reps),reserve:structuredClone(cur.reserve)}:null};
}
function expectEvidence(d,state,req){
 const byClose=new Map(state.workoutFacts.sessions.map(s=>{const en=s.record.entries.find(x=>x.lift_lineage_id===LIFT);return [en.completion.op_id,{s,en}];}));
 assert.ok(Array.isArray(d.evidence)&&d.evidence.length>0);
 for(const item of d.evidence){
  assert.deepEqual(Object.keys(item).sort(),['close','sets','start']);
  const hit=byClose.get(item.close&&item.close.op_id);assert.ok(hit,'evidence names a registered completion');
  assert.deepEqual(item,{start:ref(hit.s.start_op_id),close:ref(hit.en.completion.op_id),sets:hit.en.slots.map(evidenceSet)},'spec :82 per-slot evidence, every original and added slot, no compaction');
 }
 assert.ok(d.evidence.some(item=>item.close.op_id===req.completion_op_id),'evidence includes the checked completion');
}
function expectRefusal(ev,code,refs){
 assert.equal(ev.status,'refused');assert.deepEqual(ev.offers,[]);
 assert.deepEqual(Object.keys(ev.refusal||{}).sort(),['code','field','refs']);
 assert.equal(ev.refusal.code,'NATIVE_LOAD_'+code);assert.ok(Array.isArray(ev.refusal.refs));
 if(refs!==undefined)assert.deepEqual(ev.refusal.refs,refs);
}
function expectOffers(ev){
 assert.equal(ev.status,'offer');assert.equal(ev.refusal,null);assert.ok(Array.isArray(ev.offers)&&ev.offers.length>0);
 const seen=SEEN.get(ev),decisions=ev.offers.map(decisionOf);assert.ok(seen,'Evaluation produced through evaluate()');
 for(const d of decisions){
  assert.deepEqual(d.basis,seen.req.basis,'Decision.basis binds exactly the request basis (I2), not a re-derived or shortened one');
  expectEvidence(d,seen.state,seen.req);
 }
 return decisions;
}
function expectDecision(d,{kind,reason_key,target,candidate,baseW}){
 assert.deepEqual(Object.keys(d).sort(),DECISION_KEYS,'Decision has exactly the spec fields');
 assert.equal(d.profile,'earned/native-load-decision/v1');assert.equal(d.kind,kind);assert.equal(d.lift_lineage_id,LIFT);
 assert.equal(d.reason_key,reason_key);assert.deepEqual(d.target_load,target);assert.deepEqual(d.candidate,candidate);
 assert.equal(d.compensates,null);assert.equal(typeof d.spend_id,'string');assert.ok(d.spend_id.length>0);
 assert.ok(Array.isArray(d.consumes)&&d.consumes.length>0);assert.deepEqual(d.consumes,[...new Set(d.consumes)].sort(),'consumes canonically sorted and unique');
 assert.deepEqual(Object.keys(d.base_load.fields).sort(),FIELD_KEYS);assert.deepEqual(d.base_load.fields.w,baseW);
 assert.ok(Array.isArray(d.evidence)&&d.evidence.length>0);
}
// Canonical oracle: the UNCHANGED earnWalk on a scratch copy yields the candidate
// fields the evaluator must copy verbatim (t/gate/rule are never restated here).
function canonical(E,state,{ex:patch={},en,r,prevMeta=null,dEarn}){
 const s=structuredClone(state);s.queue=[];const ex={...structuredClone(s.exercises.find(x=>x.id===LIFT)),...patch};
 E.earnWalk(s,ex,en,r,prevMeta,()=>{},dEarn);
 return s.queue.filter(q=>q.exId===LIFT).map(q=>({kind:q.kind,newW:q.newW,newWSets:q.newWSets??null,state:q.state,t:q.t,gate:q.gate,rule:q.rule}));
}
// Green preconditions on the unchanged engine: facts admitted, card unchanged, queue empty.
function preconditions(E,state,comps){
 const rows=E.performedHistoryRows(state).filter(r=>r.source==='performed');
 assert.deepEqual(rows.map(r=>r.start_op_id),comps.map(c=>c.start),'fixture admitted by the unchanged typed reader in registered order');
 const card=E.genSession(state,CARD_DAY,{}).ex.find(c=>c.id===LIFT);
 assert.ok(card,'fixture lift is on the card day');assert.equal(card.isDebutNow,false,'no native effect exists without a yes');
 return card;
}
function applyAccept(E,state,ev,offer,{response='fx-resp-1'}={}){
 const body=decisionOf(offer),before=JSON.stringify(state);
 const context={event:'accept',basis:ev.basis,spent:[],completion:null,
  authority:{response_refs:[ref(response)],issuance:{producer:'earned/native-load/v1',body,reason:offer.reason??null,revision:'fx-revision-1',source:ev.basis.source,moment:'2026-10-20T12:00:00.000Z'},source_cut:ev.basis.source}};
 const t=E.applyNativeLoadDecision(state,body,context);
 assert.equal(JSON.stringify(state),before,'transition returns a copy; input retained by value');
 assert.deepEqual(JSON.parse(JSON.stringify(t)),t,'Transition is strict plain JSON');
 return {t,body};
}
const exOf=s=>s.exercises.find(x=>x.id===LIFT);

const TOP=[10,9,8];
const TOKEN3=Object.freeze({valueOf:()=>3,toString:()=>'at least 3'}); // test-side oracle stand-in for the private bound token
test('GUARD: the protected five are refused by the loader and none is loaded; twelve public factories compose',()=>{
 for(const name of ['seed','migrate','merge','index','oracle-shim'])
  assert.throws(()=>require(path.join(ROOT,'rebuild/engine',name+'.cjs')),e=>e.code==='PROTECTED_ENGINE_MODULE_REFUSED');
 assert.deepEqual(Object.keys(require.cache).filter(f=>PROTECTED.test(f)),[]);
 const E=engineAt(D0);for(const n of ['earnWalk','_deriveSightingFull','performedHistoryRows','genSession','nextLoad','atTopOfWindow'])assert.equal(typeof E[n],'function',n);
});

// ---------- FG01 ----------
test('FG01 UPDATE-OPENER-HOLD (N04c governor; I5): the exported pure move of writers.cjs:234-239 replays D1 openers on an isolated lift',()=>{
 const E=engineAt(dayAt(2));
 holdGate(E);
 const ex={id:LIFT,n:'Fx Press',holdFlag:false,rirHist:[]},titles=[],push=t=>titles.push(t);
 assert.equal(E.updateOpenerHold(ex,{rir:0},push),undefined);assert.equal(ex.holdFlag,false,'one hot opener does not hold');
 E.updateOpenerHold(ex,{rir:0},push);assert.equal(ex.holdFlag,true,'held after C2 (writers.cjs:238)');assert.equal(titles.length,1);
 E.updateOpenerHold(ex,{rir:2},push);assert.equal(ex.holdFlag,false,'released after C3 (writers.cjs:236)');assert.equal(titles.length,2);
 assert.deepEqual(ex.rirHist,[0,0,2]);assert.ok(titles.every(t=>t.startsWith('FX PRESS')));
 E.updateOpenerHold(ex,{rir:null},()=>{});assert.deepEqual(ex.rirHist,[0,0,2],'unknown opener leaves history unchanged, never zero');
 const held={id:LIFT,n:'Fx Press',holdFlag:true,rirHist:[0,0]};E.updateOpenerHold(held,{rir:TOKEN3},()=>{});
 assert.equal(held.holdFlag,false,'a known bound releases a hold (en.rir >= 1)');
});

// ---------- N02 WINDOW-NOT-CARD ----------
test('N02a WINDOW-NOT-CARD (I5): C1 [10,9,7] -> WINDOW_NOT_TOP, refs [C1 Close Ref], field null',()=>{
 const c1=C(1,{reps:[10,9,7],effort:e(2,1,1)}),s=withFacts(F0(),[c1]),E=engineAt(c1.date);
 preconditions(E,s,[c1]);assert.equal(E.atTopOfWindow([10,9,7],exOf(s),s),false,'READ progression.cjs:490-491');
 nativeGate(E);
 const ev=evaluate(E,s,request(s,[c1],c1));expectRefusal(ev,'WINDOW_NOT_TOP',[ref(c1.close)]);assert.equal(ev.refusal.field,null);
});
test('N02b WINDOW-NOT-CARD (I5): C1 top, C2 [10,8,8] breaks the run, C3 top -> PROVISIONAL',()=>{
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:[10,8,8],effort:e(2,1,1)}),C(3,{reps:TOP,effort:e(2,1,1)})];
 const s=withFacts(F0(),cs),E=engineAt(cs[2].date);
 preconditions(E,s,cs);assert.equal(E.atTopOfWindow([10,8,8],exOf(s),s),false);assert.equal(E.atTopOfWindow(TOP,exOf(s),s),true);
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[2])),'PROVISIONAL',[ref(cs[2].close)]);
});
function queuedFixture(){
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],spend='fx-spend-queued';
 const base=F0();base.queue=[{id:spend,kind:'debut',exId:LIFT,newW:105,state:'DEBUT',done:false,t:'FX PRESS 105 fixture',gate:'fixture',rule:'fixture',native_load_spend:spend}];
 const s=withFacts(base,cs),E=engineAt(cs[1].date);
 assert.equal(E.performedHistoryRows(s).filter(r=>r.source==='performed').length,2);
 return {cs,spend,s,E};
}
test('N02c TARGET-QUEUED (common part, spec R6 :126; I3/I4): the queued accepted effect is in basis.effect_frontier -> TARGET_QUEUED, refs = its accept response Ref, field null, no offer',()=>{
 const {cs,spend,s,E}=queuedFixture();
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[1],{frontier:[{spend_id:spend,response_refs:[ref('fx-resp-q')],close_ref:null}]}));
 expectRefusal(ev,'TARGET_QUEUED',[ref('fx-resp-q')]);assert.equal(ev.refusal.field,null);
});
test('N02c TARGET-QUEUED frontier-absent (spec R6 :126): the queued effect is missing from basis.effect_frontier -> TARGET_QUEUED, refs [], field null',()=>{
 const {cs,s,E}=queuedFixture();
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[1]));
 expectRefusal(ev,'TARGET_QUEUED',[]);assert.equal(ev.refusal.field,null);
});

// ---------- N03 NOISE-AND-EARLY ----------
test('N03a NOISE-AND-EARLY (I1/I5): first ordinary top C1 [10,9,8] e(2,1,1) -> PROVISIONAL',()=>{
 const c1=C(1,{reps:TOP,effort:e(2,1,1)}),s=withFacts(F0(),[c1]),E=engineAt(c1.date);
 preconditions(E,s,[c1]);
 assert.deepEqual(canonical(E,s,{en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,dEarn:c1.date}),[],'unchanged earnWalk: no candidate on one ordinary sighting');
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,[c1],c1)),'PROVISIONAL',[ref(c1.close)]);
});
function n03b(){
 const c1=C(1,{reps:TOP,effort:e(2,2,2)}),s=withFacts(F0(),[c1]),E=engineAt(c1.date);
 const card=preconditions(E,s,[c1]);assert.equal(card.w,100);
 const oracle=canonical(E,s,{en:{w:100,reps:TOP,rir:2,rirSets:[2,2,2]},r:TOP,dEarn:c1.date});
 assert.equal(oracle.length,1);assert.equal(oracle[0].state,'PROPOSED');assert.equal(oracle[0].newW,105);assert.equal(oracle[0].newWSets,null);
 assert.ok(oracle[0].rule.includes('two-for-two'),'earn.cjs:97 early one-sighting arm');
 return {c1,s,E,oracle};
}
test('N03b NOISE-AND-EARLY (I1/I5): C1 [10,9,8] e(2,2,2) -> offers exactly [EARLY] under every answer; nothing queued before yes',()=>{
 const {c1,s,E,oracle}=n03b();
 nativeGate(E);
 const ev=evaluate(E,s,request(s,[c1],c1)),offers=expectOffers(ev);
 assert.equal(offers.length,1,'exactly one offer');
 expectDecision(offers[0],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,105,105)},candidate:oracle[0],baseW:{present:true,value:100}});
 assert.equal(offers[0].consumes.length,1,'the current completion only');
 assert.deepEqual(s.queue,[],'queue [] before yes');
});

// ---------- N04 REPEAT-AND-HOLD ----------
test('N04a REPEAT-AND-HOLD (I5): C1, C2 [10,9,8] e(0,1,1) -> HELD_OR_HOT',()=>{
 const cs=[C(1,{reps:TOP,effort:e(0,1,1)}),C(2,{reps:TOP,effort:e(0,1,1)})],s=withFacts(F0(),cs),E=engineAt(cs[1].date);
 preconditions(E,s,cs);
 assert.deepEqual(canonical(E,s,{ex:{topAt:100,topRun:1,holdFlag:true},en:{w:100,reps:TOP,rir:0,rirSets:[0,1,1]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:cs[1].date}),[],'unchanged earnWalk: hot, no tapped exception');
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[1])),'HELD_OR_HOT',[ref(cs[1].close)]);
});
test('N04b REPEAT-AND-HOLD (I5): as N04a with C2 e(0,1,2) -> offers [one PROPOSED 105, earn.cjs:63 strings]',()=>{
 const cs=[C(1,{reps:TOP,effort:e(0,1,1)}),C(2,{reps:TOP,effort:e(0,1,2)})],s=withFacts(F0(),cs),E=engineAt(cs[1].date);
 preconditions(E,s,cs);
 const oracle=canonical(E,s,{ex:{topAt:100,topRun:1,holdFlag:true},en:{w:100,reps:TOP,rir:0,rirSets:[0,1,2]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:cs[1].date});
 assert.equal(oracle.length,1);assert.equal(oracle[0].state,'PROPOSED');assert.ok(oracle[0].rule.includes('honest opener'),'earn.cjs:63 hot-terminal arm');
 nativeGate(E);
 const offers=expectOffers(evaluate(E,s,request(s,cs,cs[1])));
 assert.equal(offers.length,1);
 expectDecision(offers[0],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,105,105)},candidate:oracle[0],baseW:{present:true,value:100}});
});
// D1 N04c as corrected in spec R5 (earned-astra-96, sha256 29dbde56...): C3 banks on ONE sighting
// (typicalError 0.37 over six own deltas, need 1.8, margin 2 vs C2), so unchanged earnWalk yields the
// ORDINARY DEBUT 105; its presentation is [Y]/[N]-split. Common part asserted here: the hold is
// released, C3 is never HELD_OR_HOT, and any offer is exactly ORD, consuming two roots [C2,C3]
// (C3 the run of one, C2 the noise comparator; both measured below on the unchanged readers).
test('N04c REPEAT-AND-HOLD (common part, spec R5; I5): C1, C2 [9,8,8] e(0,1,1) hold; C3 [10,9,8] e(2,1,1) releases; never HELD_OR_HOT; any offer is exactly ORD consuming [C2,C3]',()=>{
 const cs=[C(1,{reps:[9,8,8],effort:e(0,1,1)}),C(2,{reps:[9,8,8],effort:e(0,1,1)}),C(3,{reps:TOP,effort:e(2,1,1)})];
 const s=withFacts(F0(),cs),E=engineAt(cs[2].date);
 preconditions(E,s,cs);
 const pre=structuredClone(s);pre.workoutFacts.sessions=pre.workoutFacts.sessions.slice(0,2);pre.workoutFacts.order.start_ids=pre.workoutFacts.order.start_ids.slice(0,2);
 assert.deepEqual(E._deriveSightingFull(pre,{...exOf(pre),topAt:null,topRun:0}),{topAt:null,topRun:0,tops:[]},'V_pre: no prior sighting, so the run is C3 alone');
 assert.equal(E.performedLoadMatches(s.workoutFacts.sessions[1].record.entries[0],[100,100,100]),true,'C2 is the immediately prior comparable line: the noise comparator');
 const bn=E.beatsNoise(s,LIFT,TOP,[9,8,8]);assert.deepEqual([bn.clear,bn.margin,bn.need,bn.te.reps,bn.te.n],[true,2,1.8,0.37,6],'spec R5: C3 clears the noise on one sighting');
 const oracle=canonical(E,s,{en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,prevMeta:{w:100,reps:[9,8,8]},dEarn:cs[2].date});
 assert.deepEqual(oracle.map(q=>[q.state,q.newW]),[['DEBUT',105]]);
 holdGate(E);
 const gov={id:LIFT,n:'Fx Press',holdFlag:false,rirHist:[]};
 E.updateOpenerHold(gov,{rir:0},()=>{});E.updateOpenerHold(gov,{rir:0},()=>{});assert.equal(gov.holdFlag,true,'held after C2');
 E.updateOpenerHold(gov,{rir:2},()=>{});assert.equal(gov.holdFlag,false,'released after C3');
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[2]));
 if(ev.status==='offer'){const offers=expectOffers(ev);assert.equal(offers.length,1);
  expectDecision(offers[0],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,105,105)},candidate:oracle[0],baseW:{present:true,value:100}});
  assert.equal(offers[0].consumes.length,2,'consumes [C2,C3]: the run of one plus the noise comparator (spec R5)');}
 else{assert.equal(ev.status,'refused');assert.deepEqual(ev.offers,[]);assert.notEqual(ev.refusal.code,'NATIVE_LOAD_HELD_OR_HOT','the honest C3 opener released the hold');}
});

// ---------- N05 YES-OR-NOTHING (FC01 transition part) ----------
test('N05 YES-OR-NOTHING (common FC01 part; I1/I3): accept of the EARLY offer appends exactly one native Q, w stays 100; re-check -> TARGET_QUEUED; card debuts 105',()=>{
 const {c1,s,E}=n03b();
 nativeGate(E);
 const ev=evaluate(E,s,request(s,[c1],c1)),offer=ev.offers[0],{t,body}=applyAccept(E,s,ev,offer);
 assert.deepEqual(Object.keys(t).sort(),['effect','refusal','state','status']);assert.equal(t.status,'applied');assert.equal(t.refusal,null);
 assert.deepEqual(Object.keys(t.effect).sort(),['base_load','close_ref','kind','response_refs','spend_id','target_load']);
 assert.equal(t.effect.kind,'queued');assert.equal(t.effect.close_ref,null);assert.deepEqual(t.effect.response_refs,[ref('fx-resp-1')]);
 assert.equal(t.effect.spend_id,body.spend_id);assert.deepEqual(t.effect.target_load,body.target_load);
 assert.equal(t.state.queue.length,1);const q=t.state.queue[0];
 assert.deepEqual(Object.keys(q).sort(),['done','exId','gate','id','kind','native_load_spend','newW','rule','state','t'],'D1 Q shape, no newWSets key');
 assert.equal(q.id,body.spend_id);assert.equal(q.native_load_spend,body.spend_id);assert.equal(q.kind,'debut');assert.equal(q.exId,LIFT);
 assert.equal(q.newW,105);assert.equal(q.state,'DEBUT');assert.equal(q.done,false);for(const k of ['t','gate','rule'])assert.ok(typeof q[k]==='string'&&q[k].length>0);
 assert.equal(exOf(t.state).w,100,'w remains base until the debut lands');assert.equal(exOf(t.state).wAt,exOf(s).wAt);
 const again=evaluate(E,t.state,request(t.state,[c1],c1,{frontier:[{spend_id:body.spend_id,response_refs:[ref('fx-resp-1')],close_ref:null}]}));
 expectRefusal(again,'TARGET_QUEUED',[ref('fx-resp-1')]);assert.equal(again.refusal.field,null);
 const card=E.genSession(t.state,CARD_DAY,{}).ex.find(c=>c.id===LIFT);assert.equal(card.isDebutNow,true);assert.equal(card.w,105);
});

// ---------- N07 / N08 ----------
test('N07 EDITED-PLAN-WINS (common FC01 part; I2/I4): working load edited 100 -> 102.5 after C2 -> new check PLAN_CHANGED',()=>{
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],s=withFacts(F0({w:102.5}),cs),E=engineAt(cs[1].date);
 const card=preconditions(E,s,cs);assert.equal(card.w,102.5,'the newer athlete choice is on the card');
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[1],{authority:['fx-plan-edit-1']}));
 expectRefusal(ev,'PLAN_CHANGED',[ref(cs[1].close),ref('fx-plan-edit-1')]); // R6 :176: [Close Ref, superseding plan op Ref]
});
test('N08 EDITED-FACT (before-yes common part; I2/I5): C2 corrected to [10,9,7] -> new check WINDOW_NOT_TOP, original fact retained',()=>{
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1),corrected:{3:7}})],s=withFacts(F0(),cs),E=engineAt(cs[1].date);
 preconditions(E,s,cs);
 const slot=s.workoutFacts.sessions[1].record.entries[0].slots[2];assert.equal(slot.fact.original.reps.value,8);assert.equal(slot.fact.current.reps.value,7);
 assert.deepEqual(E.performedLine(s.workoutFacts.sessions[1].record.entries[0]).reps,[10,9,7],'unchanged reader uses the corrected current value');
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[1])),'WINDOW_NOT_TOP',[ref(cs[1].close)]);
});
test('N08b EDITED-FACT offer variant (I2/I5): C1 [10,9,7] corrected to [10,9,8], e(2,2,2), still tops -> offers [EARLY]; evidence carries the original and the edit Ref',()=>{
 const c1=C(1,{reps:[10,9,7],effort:e(2,2,2),corrected:{3:8}}),s=withFacts(F0(),[c1]),E=engineAt(c1.date);
 preconditions(E,s,[c1]);assert.deepEqual(E.performedLine(s.workoutFacts.sessions[0].record.entries[0]).reps,TOP,'the correction tops the window');
 const oracle=canonical(E,s,{en:{w:100,reps:TOP,rir:2,rirSets:[2,2,2]},r:TOP,dEarn:c1.date});assert.equal(oracle.length,1);assert.equal(oracle[0].state,'PROPOSED');
 nativeGate(E);
 const offers=expectOffers(evaluate(E,s,request(s,[c1],c1)));assert.equal(offers.length,1);
 expectDecision(offers[0],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,105,105)},candidate:oracle[0],baseW:{present:true,value:100}});
 const set3=offers[0].evidence.find(x=>x.close.op_id===c1.close).sets[2];
 assert.deepEqual(set3.edits,[ref('fx-edit-1-3')],'edit Ref retained in evidence');assert.deepEqual(set3.original,ref('fx-set-1-3'));assert.equal(set3.current.reps.value,8);
});

// ---------- N09 / N10 adoption (yes-required under every answer, H6) ----------
function n09(name){
 const c1=C(1,{reps:TOP,loads:105,effort:e(2,1,1)}),s=withFacts(F0(name?{n:name}:{}),[c1]),E=engineAt(c1.date);
 const card=preconditions(E,s,[c1]);assert.equal(card.w,100,'Close does not auto-adopt');
 return {c1,s,E};
}
test('N09 ACTUAL-LOAD (I3/I5): C1 [10,9,8] at 105 on every set -> offers [adopt-observed 105x3]; yes: w 105, wAt C1 local_date, no queue',()=>{
 const {c1,s,E}=n09();
 nativeGate(E);
 const ev=evaluate(E,s,request(s,[c1],c1)),offers=expectOffers(ev);assert.equal(offers.length,1);
 expectDecision(offers[0],{kind:'adopt-observed',reason_key:'observed-load',target:{scalar:lb(105),vector:Loads(105,105,105)},candidate:null,baseW:{present:true,value:100}});
 const {t}=applyAccept(E,s,ev,ev.offers[0]);
 assert.equal(t.status,'applied');assert.equal(t.effect.kind,'adopted');assert.equal(t.effect.close_ref,null);
 assert.equal(exOf(t.state).w,105);assert.equal(exOf(t.state).wAt,c1.date,'N2: wAt from the adopted completion local_date');
 assert.deepEqual(t.state.queue,[],'adoption is not earning: nothing queued');
});
test('N10 FRESH-BASELINE (I3/I5): w null + C1 [10,9,8] at 60 -> offers [adopt-baseline 60x3]; yes removes baselineAsk; blank original set -> PREFIX_UNRESOLVED',()=>{
 const c1=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),s=withFacts(F0({w:null}),[c1]),E=engineAt(c1.date);
 const card=preconditions(E,s,[c1]);assert.equal(card.baselineAsk,true,'unchanged engine: the ask stands until a load exists');
 const v1=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1),unresolvedAt:[2]}),sv=withFacts(F0({w:null}),[v1]);preconditions(E,sv,[v1]);
 nativeGate(E);
 const ev=evaluate(E,s,request(s,[c1],c1)),offers=expectOffers(ev);assert.equal(offers.length,1);
 expectDecision(offers[0],{kind:'adopt-baseline',reason_key:'baseline',target:{scalar:lb(60),vector:Loads(60,60,60)},candidate:null,baseW:{present:true,value:null}});
 const {t}=applyAccept(E,s,ev,ev.offers[0]);assert.equal(t.status,'applied');assert.equal(t.effect.kind,'adopted');
 assert.equal(exOf(t.state).w,60);const after=E.genSession(t.state,CARD_DAY,{}).ex.find(c=>c.id===LIFT);
 assert.equal(after.baselineAsk,undefined,'no baselineAsk after the yes');assert.equal(after.w,60);
 const bad=evaluate(E,sv,request(sv,[v1],v1));expectRefusal(bad,'PREFIX_UNRESOLVED',[ref(v1.close)]);
 assert.ok(!JSON.stringify({offers:bad.offers,refusal:bad.refusal}).includes('"value":0'),'never a zero load');
});

// ---------- N11 / N12 vector and effort ----------
const N11EX={w:100,wSets:[100,95],sets:2,hi:10,steps:[100,105,110,115]};
function n11(terminal){
 const cs=[C(1,{reps:[10,9],loads:[100,95],prescribed:[100,95],effort:e(2,terminal)}),C(2,{reps:[10,9],loads:[100,95],prescribed:[100,95],effort:e(2,terminal)})];
 const s=withFacts(F0(N11EX),cs),E=engineAt(cs[1].date);preconditions(E,s,cs);
 const oracleTerminal=terminal===AT_LEAST_3?TOKEN3:terminal.tag==='exact'?terminal.value:null;
 const oracle=canonical(E,s,{ex:{topAt:100,topRun:1},en:{w:100,reps:[10,9],rir:2,rirSets:[2,oracleTerminal]},r:[10,9],prevMeta:{w:100,reps:[10,9]},dEarn:cs[1].date});
 return {cs,s,E,oracle};
}
test('N11 VECTOR-PREFIX (common part; I3/I5): established [100,95] tops with ladder -> first offer PROPOSED 110 [110,105] (then DEBUT 105 [105,100] if offered); its yes queues that vector; fresh unequal -> VECTOR_ADOPTION_UNDEFINED',()=>{
 const {cs,s,E,oracle}=n11(AT_LEAST_3);
 assert.deepEqual(oracle.map(q=>[q.state,q.newW,q.newWSets]),[['PROPOSED',110,[110,105]],['DEBUT',105,[105,100]]],'reviewer-executed l2 push order, unchanged earnWalk');
 const f1=C(1,{reps:[10,9],loads:[60,55],prescribed:null,effort:e(2,AT_LEAST_3)}),fresh=withFacts(F0({...N11EX,w:null,wSets:undefined}),[f1]);preconditions(E,fresh,[f1]);
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[1])),offers=expectOffers(ev);
 assert.ok(offers.length===1||offers.length===2,'[Y] two offers, [N] only the PROPOSED one');
 expectDecision(offers[0],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(110),vector:Loads(110,105)},candidate:oracle[0],baseW:{present:true,value:100}});
 if(offers.length===2)expectDecision(offers[1],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,100)},candidate:oracle[1],baseW:{present:true,value:100}});
 assert.deepEqual(offers[0].base_load.fields.wSets,{present:true,value:[100,95]});
 const {t}=applyAccept(E,s,ev,ev.offers[0]);assert.equal(t.status,'applied');const q=t.state.queue.at(-1);
 assert.equal(q.newW,110);assert.deepEqual(q.newWSets,[110,105]);assert.equal(q.state,'DEBUT');assert.equal(q.native_load_spend,offers[0].spend_id);
 assert.equal(exOf(t.state).w,100);assert.deepEqual(exOf(t.state).wSets,[100,95]);
 expectRefusal(evaluate(E,fresh,request(fresh,[f1],f1)),'VECTOR_ADOPTION_UNDEFINED');
});
test('N12 EFFORT-VARIANTS (common part; I5): at_least 3 keeps "at least 3" and never serializes a token; exact 0 / exact 2 / unknown terminal offer no PROPOSED; unknown opener -> EFFORT_UNRESOLVED',()=>{
 const bound=n11(AT_LEAST_3);assert.ok(bound.oracle[0].gate.includes('at least 3'));
 const variants=[X(0),X(2),UNKNOWN].map(term=>({term,...n11(term)}));
 for(const v of variants)assert.deepEqual(v.oracle.map(q=>q.state),['DEBUT'],'unchanged earnWalk: DEBUT only for terminal '+JSON.stringify(v.term));
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(UNKNOWN,1,1)})],s=withFacts(F0(),cs),E=engineAt(cs[1].date);preconditions(E,s,cs);
 nativeGate(bound.E);
 const ev=evaluate(bound.E,bound.s,request(bound.s,bound.cs,bound.cs[1]));
 assert.ok(expectOffers(ev)[0].candidate.gate.includes('at least 3'));assert.ok(!JSON.stringify(ev).includes('"valueOf"'));
 for(const v of variants){const r=evaluate(v.E,v.s,request(v.s,v.cs,v.cs[1]));
  assert.ok(!r.offers.map(decisionOf).some(d=>d.candidate&&d.candidate.state==='PROPOSED'),'no two-rung/early offer for terminal '+JSON.stringify(v.term));
  if(r.status==='refused')assert.notEqual(r.refusal.code,'NATIVE_LOAD_EFFORT_UNRESOLVED','a terminal gap is not an opener gap');}
 expectRefusal(evaluate(E,s,request(s,cs,cs[1])),'EFFORT_UNRESOLVED',[ref(cs[1].close)]);
});

// ---------- N13 / N18 / N19 ----------
test('N13 LATE-AND-SAME-DAY (common part; I2/I5): two same-date Starts survive in order; technique fork dated that day -> ERA_ORDER_BRIDGE_UNPROVEN',()=>{
 const cs=[C(1,{date:D0,reps:TOP,effort:e(2,1,1)}),C(2,{date:D0,reps:TOP,effort:e(2,1,1)})];
 const s=withFacts(F0({forks:[{from:D0,kind:'reset',why:'SYNTHETIC'}]}),cs),E=engineAt(D0);
 preconditions(E,s,cs);
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[1],{forks:['fx-fork-1']})),'ERA_ORDER_BRIDGE_UNPROVEN',[ref(cs[1].close),ref('fx-fork-1')]); // R6 :176: [Close Ref, fork op Ref]
});
test('N18 NO-NEXT-RUNG (common part; I4/I5): F0 without inc, C1, C2 tops -> NO_NEXT_LOAD, no invented increment',()=>{
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],s=withFacts(F0({inc:undefined}),cs),E=engineAt(cs[1].date);
 preconditions(E,s,cs);assert.equal(E.nextLoad(exOf(s)),null,'READ progression.cjs:370');
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[1])),'NO_NEXT_LOAD',[ref(cs[1].close)]);
});
test('N19a ERA-AND-TENURE (I2/I5): technique fork at C2; C1 top (old era), C2, C3 tops -> C3 PROVISIONAL',()=>{
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)}),C(3,{reps:TOP,effort:e(2,1,1)})];
 const s=withFacts(F0({forks:[{from:dayAt(1),kind:'reset',why:'SYNTHETIC'}]}),cs),E=engineAt(cs[2].date);
 preconditions(E,s,cs);
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[2])),'PROVISIONAL',[ref(cs[2].close)]);
});
test('N19b ERA-AND-TENURE (I2/I5): C1 top at 100, C2 at 95, C3 top at 100 -> C3 PROVISIONAL (off-load line ends tenure)',()=>{
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,loads:95,effort:e(2,1,1)}),C(3,{reps:TOP,effort:e(2,1,1)})];
 const s=withFacts(F0(),cs),E=engineAt(cs[2].date);
 preconditions(E,s,cs);
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[2])),'PROVISIONAL',[ref(cs[2].close)]);
});
test('N19c ERA-AND-TENURE (I4): renaming the lift keeps the same lineage and the same spend_id',()=>{
 const a=n09(),b=n09('Fx Press Renamed');
 nativeGate(a.E);
 const da=expectOffers(evaluate(a.E,a.s,request(a.s,[a.c1],a.c1)))[0],db=expectOffers(evaluate(b.E,b.s,request(b.s,[b.c1],b.c1)))[0];
 assert.equal(db.lift_lineage_id,da.lift_lineage_id);assert.equal(db.spend_id,da.spend_id,'spend_id excludes the display name');
});

// ---------- N20 HOST-PARITY (composition part) ----------
test('N20 HOST-PARITY (composition part; I7): both runtimes compose native-load after writers, forward exactly the two new names, hide forbidden names, and return byte-equal Evaluations',()=>{
 const c1=C(1,{reps:[10,9,7],effort:e(2,1,1)}),s=withFacts(F0(),[c1]),E=engineAt(c1.date);
 preconditions(E,s,[c1]);
 const W=require(path.join(ROOT,'rebuild/m4/workout/engine-runtime.cjs')),H=require(path.join(ROOT,'rebuild/m3/w6/host/engine-runtime-host.cjs'));
 const FORBIDDEN=['updateOpenerHold','_deriveSightingFull','earnWalk','completeSession','seed','migrate','mergeState'];
 const readers=['genSession','rirPlan','dayWeather','cleanAtDate','sessionMembership'];
 for(const R of [W.createEngineRuntime({clock:clockFor(c1.date),nativeTrendContext:assumedContext}),H.createEngineRuntime({clock:clockFor(c1.date),nativeTrendContext:assumedContext})])
  for(const n of FORBIDDEN)assert.equal(Object.hasOwn(R,n),false,'forbidden name absent from the returned object: '+n);
 nativeGate(E);
 assert.deepEqual(W.COMPOSITION.modules,[...MODULES,'native-load'],'FC04 appends native-load after writers');assert.deepEqual(H.MODULES,[...MODULES,'native-load'],'FC05 mirror');
 assert.deepEqual(W.COMPOSITION.exposed,[...readers,'evaluateNativeLoad','applyNativeLoadDecision']);assert.deepEqual(H.EXPOSED,[...W.COMPOSITION.exposed]);
 for(const n of FORBIDDEN){assert.ok(!W.COMPOSITION.exposed.includes(n));assert.ok(!H.EXPOSED.includes(n));}
 const direct=JSON.stringify(evaluate(E,s,request(s,[c1],c1)));
 for(const R of [W.createEngineRuntime({clock:clockFor(c1.date),nativeTrendContext:assumedContext}),H.createEngineRuntime({clock:clockFor(c1.date),nativeTrendContext:assumedContext})]){
  assert.equal(typeof R.evaluateNativeLoad,'function');assert.equal(typeof R.applyNativeLoadDecision,'function');
  assert.equal(JSON.stringify(R.evaluateNativeLoad(structuredClone(s),request(s,[c1],c1))),direct,'byte-equal Evaluation');
 }
 assert.deepEqual(Object.keys(require.cache).filter(f=>PROTECTED.test(f)),[],'no protected module reached through either runtime');
});
