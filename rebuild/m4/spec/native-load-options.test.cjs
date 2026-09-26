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
// Round 18: skippedAt names original positions the athlete skipped (performed.cjs:61-62 shape).
function C(n,{date=dayAt(n-1),reps,loads=100,effort,prescribed=100,unresolvedAt=[],corrected={},skippedAt=[]}){
 const start='fx-start-'+n,close='fx-close-'+n,ops=[start];
 const L=Array.isArray(loads)?loads:reps.map(()=>loads),P=Array.isArray(prescribed)?prescribed:reps.map(()=>prescribed);
 const slots=reps.map((r,k)=>{
  const position=k+1,logical_set_slot=JSON.stringify([LIFT,position]),id='fx-set-'+n+'-'+position;
  const prescribed_load=P[k]==null?{state:'not_prescribed'}:{state:'specified',source:lb(P[k])};
  if(unresolvedAt.includes(position))return {position,logical_set_slot,prescribed_load,state:'unresolved',issues:['SET_INTERPRETATION_REQUIRED']};
  if(skippedAt.includes(position)){const skip='fx-skip-'+n+'-'+position;ops.push(skip);return {position,logical_set_slot,prescribed_load,state:'skipped',skip_op_id:skip};}
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

// ======================================================================
// [YES-ONLY] CELLS (owner answer YES, route B; DECISIONS:784-785). Spec R7
// (6ddf7af, sha256 98c0cf7a...) B0 table column "YES, route B" and every D1
// "[Y]" clause. The sealed consent constant is consent='yes-only': the ordinary
// one-rung DEBUT (earn.cjs:88) is an OFFER that waits for a yes, exactly like
// the PROPOSED candidates (earn.cjs:63,80,97). Same guard, same composition,
// same red gates as the common cells above.
// ======================================================================
const ORD=oracleRow=>({kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,105,105)},candidate:oracleRow,baseW:{present:true,value:100}});
const inter=(a,b)=>a.filter(x=>b.includes(x));
function n02cY(){
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],s=withFacts(F0(),cs),E=engineAt(cs[1].date);
 preconditions(E,s,cs);
 const oracle=canonical(E,s,{ex:{topAt:100,topRun:1},en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:cs[1].date});
 assert.deepEqual(oracle.map(q=>[q.state,q.newW,q.newWSets]),[['DEBUT',105,null]],'unchanged earnWalk: the ordinary one-rung DEBUT (earn.cjs:88) on two sightings');
 assert.ok(oracle[0].rule.startsWith('Auto-queued'),'READ earn.cjs:88: classic text claims automatic queuing');
 return {cs,s,E,oracle};
}
test('N02c [Y] WINDOW-NOT-CARD offer (I1/I5): C1, C2 [10,9,8] e(2,1,1) -> offers exactly [ORD] consuming [C1,C2]; yes -> queue [Q], ex.w 100, next card debuts 105 on every set; re-check TARGET_QUEUED',()=>{
 const {cs,s,E,oracle}=n02cY();
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[1])),offers=expectOffers(ev);
 assert.equal(offers.length,1,'[Y] the ordinary DEBUT is an offer, and the only one');
 expectDecision(offers[0],{...ORD(oracle[0])});
 assert.equal(offers[0].consumes.length,2,'consumes [C1,C2]: the run of two (C1 is also the noise comparator)');
 assert.deepEqual(offers[0].evidence.map(x=>x.close.op_id),[cs[0].close,cs[1].close],'evidence names exactly the consumed completions, in registered order');
 assert.equal(typeof ev.offers[0].reason,'string');assert.ok(ev.offers[0].reason.length>0,'native explanation present');
 assert.ok(!/automatic/i.test(ev.offers[0].reason),'[YES-ONLY] spec :137: the native explanation never promises automatic queuing');
 assert.ok(ev.offers[0].reason.includes('105'),'the native explanation names the target load');
 assert.deepEqual(s.queue,[],'no queue entry before yes');
 const {t,body}=applyAccept(E,s,ev,ev.offers[0]);
 assert.equal(t.status,'applied');assert.equal(t.effect.kind,'queued');
 assert.equal(t.state.queue.length,1);const q=t.state.queue[0];
 assert.deepEqual([q.id,q.kind,q.exId,q.newW,q.state,q.done,q.native_load_spend],[body.spend_id,'debut',LIFT,105,'DEBUT',false,body.spend_id]);
 assert.equal(Object.hasOwn(q,'newWSets'),false,'D1 Q: no newWSets key for a scalar lift');
 assert.equal(exOf(t.state).w,100,'w stays 100 until the debut lands');
 const card=E.genSession(t.state,CARD_DAY,{}).ex.find(c=>c.id===LIFT);
 assert.equal(card.isDebutNow,true);assert.equal(card.w,105);assert.equal(card.tgt.length,3,'three original positions, each captured at 105 (engine-capture.cjs scalar arm)');
 const again=evaluate(E,t.state,request(t.state,cs,cs[1],{frontier:[{spend_id:body.spend_id,response_refs:[ref('fx-resp-1')],close_ref:null}]}));
 expectRefusal(again,'TARGET_QUEUED',[ref('fx-resp-1')]);assert.equal(again.refusal.field,null);
});
test('N03c [Y] NOISE-AND-EARLY (I1/I5): C0 [8,7,6], C1 [10,10,10] e(2,1,1) -> margin 9 >= need 4.4, ordinary on one sighting -> offers exactly [ORD] consuming [C0,C1]',()=>{
 const cs=[C(0,{reps:[8,7,6],effort:e(2,1,1)}),C(1,{reps:[10,10,10],effort:e(2,1,1)})],s=withFacts(F0(),cs),E=engineAt(cs[1].date);
 preconditions(E,s,cs);
 const bn=E.beatsNoise(s,LIFT,[10,10,10],[8,7,6]);assert.deepEqual([bn.clear,bn.margin,bn.need],[true,9,4.4],'READ constants.cjs:50 and progression.cjs:586-603');
 const oracle=canonical(E,s,{en:{w:100,reps:[10,10,10],rir:2,rirSets:[2,1,1]},r:[10,10,10],prevMeta:{w:100,reps:[8,7,6]},dEarn:cs[1].date});
 assert.deepEqual(oracle.map(q=>[q.state,q.newW]),[['DEBUT',105]]);
 nativeGate(E);
 const offers=expectOffers(evaluate(E,s,request(s,cs,cs[1])));
 assert.equal(offers.length,1);expectDecision(offers[0],ORD(oracle[0]));
 assert.equal(offers[0].consumes.length,2,'spec :121: the current completion plus the noise comparator C0');
});
test('N04c [Y] REPEAT-AND-HOLD presentation (I5): C3 offers exactly [ORD] consuming [C2,C3]; unanswered, C4 offers exactly [ORD] consuming [C3,C4] and C3 becomes COMPLETION_SUPERSEDED',()=>{
 const cs=[C(1,{reps:[9,8,8],effort:e(0,1,1)}),C(2,{reps:[9,8,8],effort:e(0,1,1)}),C(3,{reps:TOP,effort:e(2,1,1)}),C(4,{reps:TOP,effort:e(2,1,1)})];
 const s3=withFacts(F0(),cs.slice(0,3)),E3=engineAt(cs[2].date);preconditions(E3,s3,cs.slice(0,3));
 const o3=canonical(E3,s3,{en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,prevMeta:{w:100,reps:[9,8,8]},dEarn:cs[2].date});
 const s4=withFacts(F0(),cs),E4=engineAt(cs[3].date);preconditions(E4,s4,cs);
 const o4=canonical(E4,s4,{ex:{topAt:100,topRun:1},en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:cs[3].date});
 assert.deepEqual([o3.map(q=>q.state),o4.map(q=>q.state)],[['DEBUT'],['DEBUT']]);
 nativeGate(E3);
 const a=expectOffers(evaluate(E3,s3,request(s3,cs.slice(0,3),cs[2])));
 assert.equal(a.length,1);expectDecision(a[0],ORD(o3[0]));assert.equal(a[0].consumes.length,2);
 const b=expectOffers(evaluate(E4,s4,request(s4,cs,cs[3])));
 assert.equal(b.length,1);expectDecision(b[0],ORD(o4[0]));assert.equal(b[0].consumes.length,2);
 assert.equal(inter(a[0].consumes,b[0].consumes).length,1,'C3 is the one root shared by [C2,C3] and [C3,C4]');
 assert.notEqual(a[0].spend_id,b[0].spend_id);
 const old=evaluate(E4,s4,request(s4,cs,cs[2]));expectRefusal(old,'COMPLETION_SUPERSEDED');
});
test('N11 [Y] VECTOR-PREFIX (I3/I5): offers exactly the two candidates in earnWalk push order, PROPOSED 110 [110,105] then DEBUT 105 [105,100]; the DEBUT yes queues [105,100] and the card debuts that vector',()=>{
 const {cs,s,E,oracle}=n11(AT_LEAST_3);
 assert.deepEqual(oracle.map(q=>[q.state,q.newW,q.newWSets]),[['PROPOSED',110,[110,105]],['DEBUT',105,[105,100]]]);
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[1])),offers=expectOffers(ev);
 assert.equal(offers.length,2,'[Y] the DEBUT is offered beside the PROPOSED two-rung');
 expectDecision(offers[0],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(110),vector:Loads(110,105)},candidate:oracle[0],baseW:{present:true,value:100}});
 expectDecision(offers[1],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,100)},candidate:oracle[1],baseW:{present:true,value:100}});
 assert.equal(offers[0].spend_id,offers[1].spend_id,'spec :122: the offered alternative is not part of spend_id');
 const {t}=applyAccept(E,s,ev,ev.offers[1]);assert.equal(t.status,'applied');
 const q=t.state.queue.at(-1);assert.deepEqual([q.newW,q.newWSets,q.state],[105,[105,100],'DEBUT']);
 assert.deepEqual([exOf(t.state).w,exOf(t.state).wSets],[100,[100,95]],'w/wSets unchanged until landing');
 const card=E.genSession(t.state,CARD_DAY,{}).ex.find(c=>c.id===LIFT);assert.equal(card.isDebutNow,true);assert.equal(card.w,105);
});
test('N12 [Y] EFFORT-VARIANTS (I5): terminal exact 0, exact 2 or unknown -> offers exactly [DEBUT 105 [105,100]]; at least 3 with the ladder -> DEBUT plus the two-rung, gate text "at least 3"',()=>{
 const variants=[X(0),X(2),UNKNOWN].map(term=>({term,...n11(term)}));
 for(const v of variants)assert.deepEqual(v.oracle.map(q=>[q.state,q.newW]),[['DEBUT',105]]);
 const bound=n11(AT_LEAST_3);
 nativeGate(bound.E);
 for(const v of variants){
  const offers=expectOffers(evaluate(v.E,v.s,request(v.s,v.cs,v.cs[1])));
  assert.equal(offers.length,1,'DEBUT only for terminal '+JSON.stringify(v.term));
  expectDecision(offers[0],{kind:'earn',reason_key:'canonical-earn',target:{scalar:lb(105),vector:Loads(105,100)},candidate:v.oracle[0],baseW:{present:true,value:100}});
 }
 const ev=evaluate(bound.E,bound.s,request(bound.s,bound.cs,bound.cs[1])),offers=expectOffers(ev);
 assert.deepEqual(offers.map(d=>d.candidate.state),['PROPOSED','DEBUT']);assert.ok(offers[0].candidate.gate.includes('at least 3'));
 assert.ok(ev.offers.every(o=>!/\[object|valueOf/.test(JSON.stringify(o))),'no token serialized in any offer');
});
test('N13 [Y] LATE-AND-SAME-DAY (I2/I5): C1, C2 on the same local_date, distinct Starts, order C1 < C2, no fork -> C2 offers exactly [ORD] as N02c',()=>{
 const cs=[C(1,{date:D0,reps:TOP,effort:e(2,1,1)}),C(2,{date:D0,reps:TOP,effort:e(2,1,1)})],s=withFacts(F0(),cs),E=engineAt(D0);
 preconditions(E,s,cs);
 const oracle=canonical(E,s,{ex:{topAt:100,topRun:1},en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:D0});
 nativeGate(E);
 const offers=expectOffers(evaluate(E,s,request(s,cs,cs[1])));
 assert.equal(offers.length,1);expectDecision(offers[0],ORD(oracle[0]));assert.equal(offers[0].consumes.length,2,'two distinct same-date Starts, two roots');
 expectRefusal(evaluate(E,s,request(s,cs,cs[0])),'COMPLETION_SUPERSEDED');
});
test('N18 [Y] NO-NEXT-RUNG (I4/I5): without inc -> NO_NEXT_LOAD; after inc 5 through existing authority the same banked C1, C2 -> offers exactly [ORD] consuming [C1,C2]',()=>{
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],E=engineAt(cs[1].date);
 const bare=withFacts(F0({inc:undefined}),cs),s=withFacts(F0(),cs);
 preconditions(E,bare,cs);preconditions(E,s,cs);assert.equal(E.nextLoad(exOf(s)),105);
 const oracle=canonical(E,s,{ex:{topAt:100,topRun:1},en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:cs[1].date});
 nativeGate(E);
 expectRefusal(evaluate(E,bare,request(bare,cs,cs[1])),'NO_NEXT_LOAD',[ref(cs[1].close)]);
 const offers=expectOffers(evaluate(E,s,request(s,cs,cs[1],{authority:['fx-inc-edit-1']})));
 assert.equal(offers.length,1,'an equipment-only change is not PLAN_CHANGED (spec step 2)');expectDecision(offers[0],ORD(oracle[0]));assert.equal(offers[0].consumes.length,2);
});
test('N21 [Y] CONSENT-BRANCH (evaluator part; I1/I4): the N02c input produces an offer and NO queue entry; nothing reaches state without an accept transition',()=>{
 const {cs,s,E}=n02cY();
 nativeGate(E);
 const before=structuredClone(s),ev=evaluate(E,s,request(s,cs,cs[1]));
 assert.equal(ev.status,'offer');assert.deepEqual(s,before,'state untouched by the evaluator');assert.deepEqual(s.queue,[]);
 assert.equal(E.genSession(s,CARD_DAY,{}).ex.find(c=>c.id===LIFT).isDebutNow,false,'no automatic debut on the card');
 assert.equal(ev.offers.length,1);assert.ok(!Object.hasOwn(ev,'state')&&!Object.hasOwn(ev,'effect'),'an Evaluation carries no state or effect');
});

// ---------- FC03 fold rows under [Y] (spec B "Apply and fold", D1 N05/N15/N21/N22) ----------
// The fold is driven through its own exported surface: checkNativeLoad builds the
// basis at the current cut and evaluates, issuanceFor seals the exact issuance the
// host commits through respond, foldNativeLoad reconstructs the programme from the
// immutable base, the authenticated operations and the registered typed facts.
// Operations are synthetic client-shaped envelopes (one device, device_seq order).
const EFFECTS_FILE=path.join(ROOT,'rebuild/m4/workout/native-load-effects.cjs');
const EFFECTS=(()=>{try{return {m:require(EFFECTS_FILE),reason:null};}
 catch(e){if(e&&e.code==='MODULE_NOT_FOUND'&&String(e.message).split('\n')[0].includes('native-load-effects.cjs'))return {m:null,reason:'MODULE_NOT_FOUND rebuild/m4/workout/native-load-effects.cjs'};throw e;}})();
function effectsGate(){
 assert.ok(EFFECTS.m,'RED NATIVE_LOAD_EFFECTS_ABSENT: '+EFFECTS.reason+' (FC03; spec B foldNativeLoad)');
 for(const n of ['foldNativeLoad','checkNativeLoad','issuanceFor','proposalDigest'])assert.equal(typeof EFFECTS.m[n],'function','RED NATIVE_LOAD_EFFECTS_EXPORT_ABSENT: '+n);
}
const DEVICE='fx-device';
function opsFor(comps,extra=[]){
 const out={};let seq=0;
 const put=(op_id,klass,kind,payload={},device=DEVICE)=>{out[op_id]={op_id,athlete_id:ATH,device_id:device,device_seq:++seq,class:klass,kind,payload,canonical_content_commitment:commit(op_id)};};
 for(const c of comps){for(const id of c.ops)put(id,'session',id===c.start?'session-start':id===c.close?'session-close':id.startsWith('fx-edit')?'correction':'session-set');
  for(const x of extra.filter(x=>x.after===c.n))put(x.op_id,'plan','proposal-response',x.payload,x.device||DEVICE);}
 return {collections:{ops:out,rejected:{},dispositions:{}}};
}
const SOURCE=Object.freeze({W:0,log_digest:'fx-empty-prefix',selection_id:null});
const engineR=revision=>({revision,at:day=>engineAt(day)});
// Round 12 (spec R9.1 :127, FC16): a native Start carries an FC16 prescription capture. Every
// typed (v2) entry's Start gets one here, exactly as engine-capture.cjs writes it: a load
// cell per slot from the slot's own prescribed_load, and a reps cell whose window_hi is
// the base plan's hi. Host v1 entries (no prescribed_load) get none; rows that need their
// capture write it (captureOn, captureReps, captureWindow). Before round 12 no fixture Start
// carried a capture; a capture-less completion is now pre-FC16 and never earns.
function fc16Capture(gen,comps,base){
 for(const c of comps){
  const slots=[];
  for(const en of c.session.record.entries){
   if(!en.slots.every(s=>s.prescribed_load))continue;
   const ex=(base.exercises||[]).find(x=>x&&x.id===en.lift_lineage_id),hi=ex&&Number.isSafeInteger(ex.hi)&&ex.hi>0?ex.hi:null;
   for(const s of en.slots){
    const p=s.prescribed_load,load=p.state==='specified'?{state:'specified',display:p.source.value+' lb',source_json:JSON.stringify({value:p.source.value,unit:'lb'})}:{state:'not_prescribed',display:'Find a working load',source_json:null};
    const reps=p.state==='specified'&&hi!==null?{state:'specified',display:String(hi),source_json:JSON.stringify({value:hi,unit:'rep',window_hi:hi})}:{state:'not_prescribed',display:'Record the reps performed',source_json:null};
    slots.push({logical_set_slot:s.logical_set_slot,lift_lineage_id:en.lift_lineage_id,load,reps});
   }
  }
  if(slots.length&&gen.collections.ops[c.start])gen.collections.ops[c.start].prescription_capture={slots};
 }
 return gen;
}
const foldArgs=(comps,extra,revision='fx-revision-1',base=F0())=>({base,generation:fc16Capture(opsFor(comps,extra),comps,base),workoutFacts:withFacts(base,comps).workoutFacts,engine:engineR(revision),source:SOURCE,athleteId:ATH});
function acceptOp(offer,{op_id='fx-resp-1',after,revision='fx-revision-1',moment='2026-10-02T12:00:00.000Z'}={}){
 const {proposal_id,issuance}=EFFECTS.m.issuanceFor(offer,{revision,source:JSON.stringify(SOURCE),moment});
 return {op_id,after,payload:{proposal_id,answer:'accept',issuance}};
}
test('N21 [Y] CONSENT-BRANCH (fold part; I1/I4): the N02c facts alone fold to NO queue entry; only the accepted response queues exactly one Q',()=>{
 const {cs,oracle}=n02cY();
 effectsGate();
 const bare=EFFECTS.m.foldNativeLoad(foldArgs(cs,[]));
 assert.equal(bare.status,'ready');assert.deepEqual(bare.state.queue,[],'[YES-ONLY] no automatic effect ever');assert.deepEqual(bare.effects,[]);
 const checked=EFFECTS.m.checkNativeLoad({...foldArgs(cs,[]),request:{lift_lineage_id:LIFT,completion_op_id:cs[1].close,intent:'check'}});
 assert.equal(checked.evaluation.status,'offer');assert.equal(checked.evaluation.offers.length,1);
 assert.deepEqual(decisionOf(checked.evaluation.offers[0]).candidate,oracle[0]);
 const folded=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(checked.evaluation.offers[0],{after:2})]));
 assert.equal(folded.status,'ready');assert.equal(folded.state.queue.length,1);
 assert.equal(folded.state.queue[0].native_load_spend,decisionOf(checked.evaluation.offers[0]).spend_id);
 assert.deepEqual(folded.effects.map(x=>x.kind),['queued']);assert.equal(exOf(folded.state).w,100);
});
function landingScenario(revision){
 const {cs}=n02cY();
 const checked=EFFECTS.m.checkNativeLoad({...foldArgs(cs,[]),request:{lift_lineage_id:LIFT,completion_op_id:cs[1].close,intent:'check'}});
 const offer=checked.evaluation.offers[0],resp=acceptOp(offer,{after:2});
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)}),all=[...cs,c3];
 return {cs,c3,all,offer,resp,fold:rev=>EFFECTS.m.foldNativeLoad(foldArgs(all,[resp],rev||revision))};
}
test('N05 [Y] YES-OR-NOTHING (fold part; I1/I3): the exact yes queues Q with w 100; the later debut Close [10,9,8] at 105 lands it: w 105, wAt that Close local_date, Q done/ESTABLISH; the landing Close checks DEBUT_LANDED',()=>{
 effectsGate();
 const {c3,all,offer,fold}=landingScenario('fx-revision-1'),f=fold();
 assert.equal(f.status,'ready');
 const q=f.state.queue.find(x=>x.native_load_spend===decisionOf(offer).spend_id);
 assert.deepEqual([q.done,q.state],[true,'ESTABLISH']);assert.equal(exOf(f.state).w,105);assert.equal(exOf(f.state).wAt,c3.date);
 assert.deepEqual(exOf(f.state).last,TOP,'last from performedLine');
 assert.deepEqual(f.effects.map(x=>x.kind),['landed']);assert.deepEqual(f.effects[0].close_ref,ref(c3.close));
 assert.deepEqual(EFFECTS.m.foldNativeLoad(foldArgs(all,[landingScenario().resp])).state,f.state,'cold rebuild: the same single landing');
 const again=EFFECTS.m.checkNativeLoad({...foldArgs(all,[landingScenario().resp]),request:{lift_lineage_id:LIFT,completion_op_id:c3.close,intent:'check'}});
 expectRefusal(again.evaluation,'DEBUT_LANDED',[ref(c3.close)]);
});
test('N05 [Y] YES-OR-NOTHING (forged record; I1/I2): an accept whose issuance does not reproduce its proposal id, or names another producer body, is never consent',()=>{
 effectsGate();
 const {cs,offer}=landingScenario('fx-revision-1');
 const forged=acceptOp(offer,{after:2});forged.payload.issuance.body={...forged.payload.issuance.body,target_load:{scalar:lb(115),vector:Loads(115,115,115)}};
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[forged]));
 assert.deepEqual(f.state===null?[]:f.state.queue,[],'no target from a forged body');
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),'malformed native accept is refused by name, never dropped');
});
test('N15 [Y] SPEND-ONCE (fold part; I4): the same issuance delivered twice with distinct response ids folds to ONE Q carrying both response refs',()=>{
 effectsGate();
 const {cs,offer}=landingScenario('fx-revision-1');
 const a=acceptOp(offer,{after:2,op_id:'fx-resp-1'}),b=acceptOp(offer,{after:2,op_id:'fx-resp-2'});
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[a,b]));
 assert.equal(f.status,'ready');assert.equal(f.state.queue.length,1);
 assert.equal(f.effects.length,1);assert.deepEqual(f.effects[0].response_refs,[ref('fx-resp-1'),ref('fx-resp-2')]);
});
test('N22 [Y] REVISION-RETENTION (fold part; I4): accept and landing under R1, re-sealed to R2 with R1 absent -> the same w 105, Q done/ESTABLISH and spend, with issue PRODUCER_REVISION_ABSENT_APPLIED',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),r1=s.fold('fx-revision-1'),r2=s.fold('fx-revision-2');
 assert.equal(r2.status,'ready');assert.deepEqual(r2.state,r1.state,'the recorded body applies as written, never re-priced');
 assert.deepEqual(r2.spent,r1.spent);
 assert.ok(r2.issues.some(i=>i.code==='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED'));
 assert.ok(!r1.issues.some(i=>i.code==='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED'),'present revision re-validates instead');
});

// ======================================================================
// ROUND 2 rows (REVIEW-NATIVE-LOAD-BUILD-l1, sha 84b450dd): D-B-3 (five LIVE
// mutants), D-B-5 (two devices), D-B-2 (producer revision bound to bytes,
// per-lift refusal). Invented inputs; engine constants READ.
// ======================================================================
test('R2-ERA N19 ERA-AND-TENURE (FIX 3c, D-B-3 m-era): the era-first completion itself banks nothing even with a clear margin -> PROVISIONAL',()=>{
 const cs=[C(1,{reps:[8,7,6],effort:e(2,1,1)}),C(2,{reps:[10,10,10],effort:e(2,1,1)})];
 const s=withFacts(F0({forks:[{from:dayAt(1),kind:'reset',why:'SYNTHETIC'}]}),cs),E=engineAt(cs[1].date);
 preconditions(E,s,cs);
 const pre=structuredClone(s);pre.workoutFacts.sessions=pre.workoutFacts.sessions.slice(0,1);pre.workoutFacts.order.start_ids=pre.workoutFacts.order.start_ids.slice(0,1);
 assert.equal(E.eraFresh(pre,LIFT,cs[1].date),true,'READ plan.cjs:291: C2 opens the new technique era');
 const oracle=canonical(E,s,{en:{w:100,reps:[10,10,10],rir:2,rirSets:[2,1,1]},r:[10,10,10],prevMeta:{w:100,reps:[8,7,6]},dEarn:cs[1].date});
 assert.deepEqual(oracle.map(q=>q.state),['DEBUT'],'earnWalk alone would earn: only the era guard (writers.cjs FIX 3c) stops it');
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,cs,cs[1])),'PROVISIONAL',[ref(cs[1].close)]);
});
test('R2-REFS applyNativeLoadDecision (D-B-3 m-refs): an accept with no response Ref is not consent -> CAPABILITY_REQUIRED, state unchanged',()=>{
 const {c1,s,E}=n03b();
 nativeGate(E);
 const ev=evaluate(E,s,request(s,[c1],c1)),body=decisionOf(ev.offers[0]),before=JSON.stringify(s);
 const t=E.applyNativeLoadDecision(s,body,{event:'accept',basis:ev.basis,spent:[],completion:null,
  authority:{response_refs:[],issuance:{producer:'earned/native-load/v1',body,reason:ev.offers[0].reason,revision:'fx-revision-1',source:'x',moment:'2026-10-02T12:00:00.000Z'},source_cut:'x'}});
 assert.equal(t.status,'refused');assert.equal(t.refusal.code,'NATIVE_LOAD_CAPABILITY_REQUIRED');assert.equal(t.effect,null);
 assert.equal(JSON.stringify(t.state),before,'input state retained by value');assert.deepEqual(t.state.queue,[]);
});
test('R2-DIGEST fold (D-B-3 m-digest): a record whose proposal id is not the digest of its own producer/body/reason is refused RECORD_INVALID even when its revision is absent (no re-validation to catch it)',()=>{
 effectsGate();
 const {cs,offer}=landingScenario('fx-revision-1');
 const bad=acceptOp(offer,{after:2,revision:'fx-revision-0'});bad.payload.proposal_id='prop-0000000000000000';
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[bad],'fx-revision-2'));
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),'refused by name');
 assert.ok(f.state===null||f.state.queue.length===0,'no target from a record that is not the issued one');
});
function n11Checked(){
 const {cs,s,oracle}=n11(AT_LEAST_3);
 const base=F0(N11EX),args=foldArgs(cs,[],'fx-revision-1',base);
 const checked=EFFECTS.m.checkNativeLoad({...args,request:{lift_lineage_id:LIFT,completion_op_id:cs[1].close,intent:'check'}});
 assert.equal(checked.evaluation.offers.length,2,'PROPOSED 110 and DEBUT 105: one spend, two bodies');
 return {cs,base,offers:checked.evaluation.offers,oracle,s};
}
test('R2-CONFLICT fold (D-B-3 m-coalesce, spec :156): two accepts of the SAME spend with DIFFERENT bodies never coalesce -> EFFECT_CONFLICT with both refs, nothing queued, and only that lift is refused',()=>{
 effectsGate();
 const {cs,base,offers}=n11Checked();
 const a=acceptOp(offers[0],{after:2,op_id:'fx-resp-a'}),b=acceptOp(offers[1],{after:2,op_id:'fx-resp-b'});
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[a,b],'fx-revision-1',base));
 const issue=f.issues.find(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT');
 assert.ok(issue,'named conflict');assert.deepEqual(issue.refs,[ref('fx-resp-a'),ref('fx-resp-b')],'both refs reported');
 assert.equal(f.status,'ready','per lift: the programme still projects (spec :156 other fact saves remain available)');
 assert.ok(f.state&&Array.isArray(f.state.exercises),'state present');
 assert.deepEqual(f.state.queue.filter(q=>q.exId===LIFT),[],'no target from either body');
 const again=EFFECTS.m.checkNativeLoad({...foldArgs(cs,[a,b],'fx-revision-1',base),request:{lift_lineage_id:LIFT,completion_op_id:cs[1].close,intent:'check'}});
 // R9.3 :162 (G3): this completion was closed before the hold on a numeric card, so its check
 // refuses PLAN_CHANGED [its Close Ref]; the named hold is asserted on the fold above.
 expectRefusal(again.evaluation,'PLAN_CHANGED',[ref(cs[1].close)]);
});
test('R2-DEVICE fold (D-B-3 m-device, D-B-5, spec :153 and table :198): a yes recorded on device B and a debut Close on device A has no proven causal order -> DEBUT_BASIS_UNPROVEN issue with the Close and response Refs; the target stays pending and w does not land',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),resp={...s.resp,device:'fx-device-B'};
 const f=EFFECTS.m.foldNativeLoad(foldArgs(s.all,[resp],'fx-revision-1'));
 assert.equal(f.status,'ready');
 const issue=f.issues.find(i=>i.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN');
 assert.ok(issue,'a named issue, never a silent pending');
 assert.deepEqual(issue.refs,[ref(s.c3.close),ref('fx-resp-1')]);
 assert.equal(exOf(f.state).w,100,'w does not land');
 const q=f.state.queue.find(x=>x.native_load_spend===decisionOf(s.offer).spend_id);assert.deepEqual([q.done,q.state],[false,'DEBUT'],'target stays pending');
 const same=EFFECTS.m.foldNativeLoad(foldArgs(s.all,[s.resp],'fx-revision-1'));
 assert.equal(exOf(same.state).w,105,'positive control: the same Close on the same device lands');
});
test('R2-REVISION (D-B-2): PRODUCER_REVISION is bound to the producer bytes: the digest of the composed engine modules and native-load.cjs, recomputed here',()=>{
 effectsGate();
 const fs=require('node:fs');
 const files=[...MODULES,'native-load','entered-load'].map(n=>'rebuild/engine/'+n+'.cjs');
 const h=crypto.createHash('sha256');
 for(const f of files)h.update(f+'\0'+crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,f))).digest('hex')+'\n');
 assert.equal(EFFECTS.m.PRODUCER_REVISION,'earned/native-load/v1+sha256:'+h.digest('hex'),'the sealed revision names the exact producer bytes');
});
test('R2-PERLIFT (D-B-2, spec :154/:156): a present-revision record that does not re-validate at its cut refuses that lift only (RECORD_INVALID); the programme still projects',()=>{
 effectsGate();
 const {cs,offer}=landingScenario('fx-revision-1');
 const body=structuredClone(decisionOf(offer));body.target_load={scalar:lb(150),vector:Loads(150,150,150)};body.candidate={...body.candidate,newW:150};
 const forged=acceptOp({body,reason:offer.reason},{after:2});
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[forged]));
 assert.equal(f.status,'ready','never the whole programme');assert.ok(f.state&&f.state.exercises.length>1);
 const issue=f.issues.find(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');assert.ok(issue);assert.equal(issue.lift,LIFT);
 assert.deepEqual(f.state.queue,[],'no target');
 const E=engineAt(CARD_DAY);assert.ok(E.genSession(f.state,CARD_DAY,{}),'the day still prescribes');
 const again=EFFECTS.m.checkNativeLoad({...foldArgs(cs,[forged]),request:{lift_lineage_id:LIFT,completion_op_id:cs[1].close,intent:'check'}});
 // R9.3 :162 (G3): this completion was closed before the hold on a numeric card, so its check
 // refuses PLAN_CHANGED [its Close Ref]; the named hold is asserted on the fold above.
 expectRefusal(again.evaluation,'PLAN_CHANGED',[ref(cs[1].close)]);
});

// ======================================================================
// ROUND 3 rows (Astra NATIVE-LOAD-BUILD-REVIEW-L1 REJECT of ec0dbff, sha E63139E0...):
// B1, B2, B3, B4, B6, B8 (M3, M6, M11, M12), D5 (compensation, conflict order) and
// D7a. Invented inputs; engine constants READ.
// ======================================================================
const ROW='fx-row';
// The host projects earned/performed-lift/v1 entries whose slots carry no prescribed_load.
const v1Of=c=>{const x=structuredClone(c);for(const en of x.session.record.entries){en.profile='earned/performed-lift/v1';for(const slot of en.slots)delete slot.prescribed_load;}return x;};
// The immutable Start capture, in the engine-capture.cjs loadCell shape, one cell per slot.
function captureOn(gen,c,loads){
 // Round 12: a reps cell the Start already carries (the fixture's FC16 capture) is kept.
 const had=new Map(((gen.collections.ops[c.start].prescription_capture||{}).slots||[]).map(x=>[x.lift_lineage_id+'|'+x.logical_set_slot,x.reps]));
 gen.collections.ops[c.start].prescription_capture={slots:c.session.record.entries.flatMap(en=>en.slots.map((slot,i)=>({logical_set_slot:slot.logical_set_slot,lift_lineage_id:en.lift_lineage_id,
  load:loads[i]==null?{state:'not_prescribed',display:'Find a working load',source_json:null}:{state:'specified',display:loads[i]+' lb',source_json:JSON.stringify({value:loads[i],unit:'lb'})},
  ...(had.get(en.lift_lineage_id+'|'+slot.logical_set_slot)?{reps:had.get(en.lift_lineage_id+'|'+slot.logical_set_slot)}:{})})))};
 return gen;
}
const checkOf=(args,lift,c,intent='check')=>EFFECTS.m.checkNativeLoad({...args,request:{lift_lineage_id:lift,completion_op_id:c.close,intent}}).evaluation;
// C2 exactly as the yes saw it, then its last set corrected 8 -> 7 AFTER the yes.
function correctedScenario(){
 const s=landingScenario('fx-revision-1'),c2x=C(2,{reps:TOP,effort:e(2,1,1),corrected:{3:7}});
 return {...s,c2x,cs2:[s.cs[0],c2x],spend:decisionOf(s.offer).spend_id};
}
test('R3-B1 LANDING ON HOST FACTS (Astra B1, spec :151-152, :122 "using the immutable Start capture"): v1 slots carry no prescribed_load; the debut lands from the Start capture',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),c3=v1Of(s.c3),all=[...s.cs,c3];
 const args=foldArgs(all,[s.resp]);captureOn(args.generation,c3,[105,105,105]);
 const f=EFFECTS.m.foldNativeLoad(args);
 assert.equal(f.status,'ready');
 assert.equal(exOf(f.state).w,105,'the consented, captured and performed debut becomes the working weight');
 assert.deepEqual(f.effects.map(x=>x.kind),['landed']);
 const q=f.state.queue.find(x=>x.native_load_spend===decisionOf(s.offer).spend_id);assert.deepEqual([q.done,q.state],[true,'ESTABLISH']);
 const old=foldArgs(all,[s.resp]);captureOn(old.generation,c3,[100,100,100]);
 assert.equal(exOf(EFFECTS.m.foldNativeLoad(old).state).w,100,'a Start that captured the old load is not the debut, whatever was lifted');
});
test('R3-B2 DISPUTED BASIS (Astra B2, spec :157): C2 corrected after the yes -> BASIS_REPAIR_REQUIRED, effect retained, a later debut Close on that basis does NOT land; the compensating yes resolves it',()=>{
 effectsGate();
 const {cs2,resp,spend}=correctedScenario();
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)});
 const f=EFFECTS.m.foldNativeLoad(foldArgs([...cs2,c3],[resp]));
 assert.equal(f.status,'ready');
 assert.equal(exOf(f.state).w,100,'no landing on the disputed basis');
 const issue=f.issues.find(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED');assert.ok(issue);assert.deepEqual(issue.refs,[ref('fx-resp-1')]);
 const q=f.state.queue.find(x=>x.native_load_spend===spend);assert.deepEqual([q.done,q.state],[false,'DEBUT'],'effect kept, never a hidden rollback');
 assert.deepEqual(f.effects.map(x=>x.kind),['queued']);
 const args=foldArgs(cs2,[resp]);
 // R9.3 :162 (G3): this completion was closed before the hold on a numeric card, so its check
 // refuses PLAN_CHANGED [its Close Ref]; the named hold is asserted on the fold above.
 expectRefusal(checkOf(args,LIFT,cs2[1]),'PLAN_CHANGED',[ref(cs2[1].close)]);
 const undo=checkOf(args,LIFT,cs2[1],{compensate:spend});
 assert.equal(undo.status,'offer','the dispute never blocks its own compensation: '+JSON.stringify(undo.refusal));
 const g=EFFECTS.m.foldNativeLoad(foldArgs(cs2,[resp,acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:2})]));
 assert.ok(!g.issues.some(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED'),'resolved by the compensating yes');
 const q2=g.state.queue.find(x=>x.native_load_spend===spend);assert.deepEqual([q2.done,q2.state],[true,'COMPENSATED']);assert.equal(exOf(g.state).w,100);
});
test('R3-B3 COMPENSATION (Astra B3, D5, spec :153): an accepted, unused earn offers its compensation while its target is queued; the yes retires Q, keeps w and the spend tombstone; a cold replay folds the same',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const undo=checkOf(foldArgs(cs,[resp]),LIFT,cs[1],{compensate:spend});
 assert.equal(undo.status,'offer','never TARGET_QUEUED: '+JSON.stringify(undo.refusal));
 const d=decisionOf(undo.offers[0]);
 assert.deepEqual([d.kind,d.compensates,d.consumes,d.evidence],['compensate',spend,[],[]]);
 assert.deepEqual(d.target_load,{scalar:lb(100),vector:Loads(100,100,100)});
 const comp=acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:2}),f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,comp]));
 assert.equal(f.status,'ready');assert.equal(exOf(f.state).w,100);assert.deepEqual(f.issues,[]);
 const q=f.state.queue.find(x=>x.native_load_spend===spend);assert.deepEqual([q.done,q.state,q.native_load_compensated_by],[true,'COMPENSATED',d.spend_id]);
 assert.equal(f.spent.find(x=>x.spend_id===spend).cancelled_by,d.spend_id,'tombstone kept');
 assert.deepEqual(f.effects.map(x=>x.kind),['compensated']);
 assert.deepEqual(EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,comp])).state,f.state,'cold replay');
 assert.notEqual(checkOf(foldArgs(cs,[resp,comp]),LIFT,cs[1]).status,'offer','compensation refunds no evidence');
});
// Two lifts completed under ONE Close, exactly as the host records a multi-lift session.
function withRow(patch){const s=F0(patch);s.exercises.push({...structuredClone(exOf(s)),id:ROW,n:'Fx Row'});return s;}
function twoLift(n,opts){
 const c=C(n,opts),row=structuredClone(c.session.record.entries[0]);row.lift_lineage_id=ROW;
 for(const slot of row.slots){slot.logical_set_slot=JSON.stringify([ROW,slot.position]);
  if(slot.fact){const id='fx-rset-'+n+'-'+slot.position;slot.fact.source_op_id=id;slot.fact.logical_set_slot=slot.logical_set_slot;slot.fact.lift_lineage_id=ROW;c.ops.splice(c.ops.length-1,0,id);}}
 c.session.record.entries.push(row);return c;
}
test('R3-B4 SHARED CLOSE (Astra B4): a yes on the SECOND lift of a shared Close, nothing edited -> no BASIS_REPAIR_REQUIRED, its target queued, its compensation reachable',()=>{
 effectsGate();
 const cs=[twoLift(1,{reps:TOP,effort:e(2,1,1)}),twoLift(2,{reps:TOP,effort:e(2,1,1)})],base=withRow();
 const checked=checkOf(foldArgs(cs,[],'fx-revision-1',base),ROW,cs[1]);
 assert.equal(checked.status,'offer',JSON.stringify(checked.refusal));
 const spend=decisionOf(checked.offers[0]).spend_id,resp=acceptOp(checked.offers[0],{after:2}),args=foldArgs(cs,[resp],'fx-revision-1',base);
 const f=EFFECTS.m.foldNativeLoad(args);
 assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED'),[],'the unchanged second lift is not disputed');
 assert.deepEqual(f.state.queue.filter(q=>!q.done).map(q=>[q.exId,q.newW]),[[ROW,105]]);
 assert.equal(checkOf(args,ROW,cs[1],{compensate:spend}).status,'offer');
});
test('R3-B6 PROVEN CROSS-DEVICE DEBUT (Astra B6; spec :151 "Require acceptance before Start by proven causality", :156 "witnessed causal/source order"): device B Start naming device A accept as causal parent lands; without it the debut is reported unproven',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),args=foldArgs(s.all,[s.resp]);
 let seq=0;for(const id of s.c3.ops){const op=args.generation.collections.ops[id];op.device_id='fx-device-B';op.device_seq=++seq;}
 args.generation.collections.ops[s.c3.start].causal_parents=['fx-resp-1'];
 const f=EFFECTS.m.foldNativeLoad(args);
 assert.equal(exOf(f.state).w,105,'the proven debut lands whatever the local sequence numbers say');
 assert.deepEqual(f.effects.map(x=>x.kind),['landed']);assert.ok(!f.issues.some(i=>i.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN'));
 delete args.generation.collections.ops[s.c3.start].causal_parents;
 const g=EFFECTS.m.foldNativeLoad(args);
 assert.equal(exOf(g.state).w,100);
 assert.deepEqual(g.issues.find(i=>i.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN').refs,[ref(s.c3.close),ref('fx-resp-1')],'unproven order is reported, never silent');
});
test('R3-M3 SPEND INDEX (Astra B8 M3): a folded yes is in the spend index exactly once and a re-check names its response as the TARGET_QUEUED authority',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),args=foldArgs(cs,[resp]),f=EFFECTS.m.foldNativeLoad(args);
 assert.deepEqual(f.spent.map(x=>[x.spend_id,x.response_refs,x.close_ref,x.cancelled_by]),[[decisionOf(offer).spend_id,[ref('fx-resp-1')],null,null]]);
 expectRefusal(checkOf(args,LIFT,cs[1]),'TARGET_QUEUED',[ref('fx-resp-1')]);
});
test('R3-M6 SET COUNT (Astra B8 M6, spec step 2): a host-shaped v1 completion with two original slots against configured sets 3 -> PLAN_CHANGED, never a two-set baseline',()=>{
 const c1=v1Of(C(1,{reps:[10,9],loads:60,prescribed:null,effort:e(2,1)})),s=withFacts(F0({w:null}),[c1]),E=engineAt(c1.date);
 assert.deepEqual(E.performedHistoryRows(s).filter(r=>r.source==='performed').map(r=>r.start_op_id),[c1.start],'v1 facts admitted by the unchanged reader');
 nativeGate(E);
 expectRefusal(evaluate(E,s,request(s,[c1],c1)),'PLAN_CHANGED',[ref(c1.close)]);
});
test('R3-M11 CORRECTED AFTER YES (Astra B8 M11, spec :157): the fold sees the changed consumed completion, keeps the queued effect and names BASIS_REPAIR_REQUIRED, never RECORD_INVALID',()=>{
 effectsGate();
 const {cs2,resp,spend}=correctedScenario(),f=EFFECTS.m.foldNativeLoad(foldArgs(cs2,[resp]));
 assert.deepEqual(f.issues.map(i=>[i.code,i.refs]),[['NATIVE_LOAD_BASIS_REPAIR_REQUIRED',[ref('fx-resp-1')]]]);
 assert.deepEqual(f.effects.map(x=>[x.kind,x.spend_id]),[['queued',spend]]);
});
test('R3-M12 STORED DECLINE (Astra B8 M12, spec :100/:166): a native-shaped stored response whose answer is not accept is never consent -> RECORD_INVALID, nothing queued',()=>{
 effectsGate();
 const {cs,resp}=landingScenario('fx-revision-1'),declined=structuredClone(resp);declined.payload.answer='decline';
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[declined]));
 assert.deepEqual(f.state.queue,[]);assert.deepEqual(f.effects,[]);
 assert.deepEqual(f.issues.find(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').refs,[ref('fx-resp-1')]);
});
test('R3-D5 CONFLICT CONVERGENCE (D5, spec :156/:168): the two incompatible accepts in either delivery order fold to the same named conflict and the same programme',()=>{
 effectsGate();
 const {cs,base,offers}=n11Checked();
 const a=acceptOp(offers[0],{after:2,op_id:'fx-resp-a'}),b=acceptOp(offers[1],{after:2,op_id:'fx-resp-b'});
 const one=EFFECTS.m.foldNativeLoad(foldArgs(cs,[a,b],'fx-revision-1',base)),two=EFFECTS.m.foldNativeLoad(foldArgs(cs,[b,a],'fx-revision-1',base));
 assert.deepEqual(two.issues,one.issues);assert.deepEqual(two.state,one.state);assert.deepEqual(two.spent,one.spent);
 assert.ok(one.issues.some(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT'));
});
test('R3-D7a ORIGINAL CUT (D7, spec :154 "validates each historical issuance at its ORIGINAL cut", step 2): an equipment-only inc change after the yes re-validates at the recorded load basis; the target stays queued',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp],'fx-revision-1',F0({inc:10})));
 assert.deepEqual(f.issues,[],'no RECORD_INVALID for an increment chosen later');
 assert.deepEqual(f.state.queue.map(q=>[q.native_load_spend,q.newW]),[[decisionOf(offer).spend_id,105]]);
});

// ======================================================================
// ROUND 4 rows (spec R8 b849508, sha 297bf999; Astra L2 B7, B9, B11; D7b/N24;
// N23). Invented inputs; engine constants READ.
// ======================================================================
const GOV=Object.freeze({event:'governor',basis:null,spent:[],authority:null,completion:null});
function n23(openers){
 const cs=openers.map((o,i)=>C(i+1,{reps:[10],effort:[o]})),base=F0({sets:1}),s=withFacts(base,cs),E=engineAt(cs.at(-1).date);
 preconditions(E,s,cs);
 return {cs,base,s,E};
}
test('R4-N23 HOLD-PROJECTION (Astra B7, spec R8 :92 governor event, :135 step 6, D1 N23): two one-set openers exactly 0 -> event governor applies holdFlag true and nothing else; the card effort is the canonical [2], not [0]',()=>{
 const {cs,base,s,E}=n23([X(0),X(0)]);
 const card=E.genSession(s,CARD_DAY,{}).ex.find(c=>c.id===LIFT);
 assert.deepEqual(E.rirPlan(s,{...card,holdFlag:false},{}).plan,[0],'READ: the unprojected one-set card effort');
 assert.deepEqual(E.rirPlan(s,{...card,holdFlag:true},{}).plan,[2],'READ: the canonical held one-set card effort');
 nativeGate(E);
 const before=JSON.stringify(s),t=E.applyNativeLoadDecision(s,null,structuredClone(GOV));
 assert.equal(JSON.stringify(s),before,'input never modified');
 assert.deepEqual([t.status,t.effect,t.refusal],['applied',null,null]);
 const want=structuredClone(s);exOf(want).holdFlag=true;assert.deepEqual(t.state,want,'ONLY holdFlag changes; rirHist and every other byte equal');
 assert.ok(!JSON.stringify(t).includes('[object'),'no token escapes');
 for(const bad of [[{},GOV],[null,{...GOV,spent:[{spend_id:'x'}]}],[null,{...GOV,authority:{}}],[null,{...GOV,completion:{}}]]){
  const r=E.applyNativeLoadDecision(s,bad[0],structuredClone(bad[1]));assert.equal(r.status,'refused');assert.equal(r.refusal.code,'NATIVE_LOAD_RECORD_INVALID');
 }
 const W=require(path.join(ROOT,'rebuild/m4/workout/engine-runtime.cjs')),H=require(path.join(ROOT,'rebuild/m3/w6/host/engine-runtime-host.cjs'));
 for(const R of [W,H]){const r=R.createEngineRuntime({clock:clockFor(cs[1].date),nativeTrendContext:assumedContext});
  assert.equal(JSON.stringify(r.applyNativeLoadDecision(structuredClone(s),null,structuredClone(GOV))),JSON.stringify(t),'both runtimes byte-equal');
  assert.equal(Object.hasOwn(r,'updateOpenerHold'),false);}
 assert.deepEqual(Object.keys(evaluate(E,s,request(s,cs,cs[1]))),['profile','status','basis','offers','refusal'],'the Evaluation carries no holdFlag');
 effectsGate();
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[],'fx-revision-1',base));
 assert.equal(exOf(f.state).holdFlag,true,'the fold projects the governor once per projection');
 assert.deepEqual(E.rirPlan(f.state,{...card,holdFlag:exOf(f.state).holdFlag},{}).plan,[2],'the captured card effort equals the canonical governor');
 const again=EFFECTS.m.foldNativeLoad({...foldArgs(cs,[],'fx-revision-1',base)});assert.deepEqual(again.state,f.state,'re-projection from the immutable base is stable');
});
test('R4-N23b HOLD-PROJECTION variants (D1 N23): an honest C3 opener releases (unchanged, false); an unknown C2 opener never becomes 0 (unchanged, false)',()=>{
 const rel=n23([X(0),X(0),X(1)]),unk=n23([X(0),UNKNOWN]);
 nativeGate(rel.E);
 for(const v of [rel,unk]){
  const t=v.E.applyNativeLoadDecision(v.s,null,structuredClone(GOV));
  assert.equal(t.status,'unchanged');assert.deepEqual(t.state,v.s);assert.equal(exOf(t.state).holdFlag,false);
 }
});
test('R4-N24 ORDER-UNPROVABLE (D7b; spec R8 :156, :196, D1 N24): accepted Q then a base w 102.5 with no authenticated plan op -> EFFECT_CONFLICT for fx-press only, refs [accept], field load_basis, identical under R1/R2 and both delivery orders; compensation is retire-only',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id,moved=()=>F0({w:102.5});
 const runs=[];
 for(const rev of ['fx-revision-1','fx-revision-2'])for(const first of [false,true]){
  const args=foldArgs(cs,[resp],rev,moved());if(first)args.generation.collections.ops['fx-resp-1'].device_seq=0;
  runs.push(EFFECTS.m.foldNativeLoad(args));
 }
 const f=runs[0];
 assert.equal(f.status,'ready','never the whole programme');
 assert.deepEqual(f.issues.map(i=>[i.code,i.refs,i.field,i.lift]),[['NATIVE_LOAD_EFFECT_CONFLICT',[ref('fx-resp-1')],'load_basis',LIFT]]);
 const q=f.state.queue.find(x=>x.native_load_spend===spend);assert.deepEqual([q.done,q.state],[false,'DEBUT'],'neither landed nor dropped');
 assert.deepEqual(f.spent.map(x=>x.spend_id),[spend],'spend kept');assert.equal(exOf(f.state).w,102.5);
 for(const r of runs.slice(1)){assert.deepEqual(r.state,f.state);assert.deepEqual(r.issues,f.issues);assert.deepEqual(r.spent,f.spent);}
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)}),late=EFFECTS.m.foldNativeLoad(foldArgs([...cs,c3],[resp],'fx-revision-1',moved()));
 assert.equal(exOf(late.state).w,102.5,'a Close that captured 105 still never lands a conflicted effect');
 assert.equal(late.state.queue.find(x=>x.native_load_spend===spend).done,false);
 const args=foldArgs(cs,[resp],'fx-revision-1',moved());
 // R9.3 :162 (G3): this completion was closed before the hold on a numeric card, so its check
 // refuses PLAN_CHANGED [its Close Ref]; the named hold is asserted on the fold above.
 expectRefusal(checkOf(args,LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 const undo=checkOf(args,LIFT,cs[1],{compensate:spend});
 assert.equal(undo.status,'offer','compensation stays reachable: '+JSON.stringify(undo.refusal));
 const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:2})],'fx-revision-1',moved()));
 const q2=g.state.queue.find(x=>x.native_load_spend===spend);assert.deepEqual([q2.done,q2.state],[true,'COMPENSATED']);
 assert.equal(exOf(g.state).w,102.5,'retire-only: no w write');assert.equal(g.spent.find(x=>x.spend_id===spend).cancelled_by,decisionOf(undo.offers[0]).spend_id);
 assert.ok(!g.issues.some(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT'),'conflict cleared');
});
test('R4-B9 CAPTURED BEFORE UNDO (Astra L2 B9; spec :153 "offers the prior field image only if no later Start captured the accepted effect"): a Start that captured 105 refuses compensation COMPENSATION_DESCENDANTS; a raced undo is not applied and the debut lands',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),spend=decisionOf(s.offer).spend_id;
 const early=checkOf(foldArgs(s.cs,[s.resp]),LIFT,s.cs[1],{compensate:spend});assert.equal(early.status,'offer','before any capture the undo is offered');
 const args=foldArgs(s.cs,[s.resp]);
 args.generation.collections.ops[s.c3.start]={op_id:s.c3.start,athlete_id:ATH,device_id:DEVICE,device_seq:100,class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(s.c3.start)};
 captureOn(args.generation,s.c3,[105,105,105]);
 expectRefusal(checkOf(args,LIFT,s.cs[1],{compensate:spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
 const all=foldArgs(s.all,[s.resp,acceptOp(early.offers[0],{op_id:'fx-resp-2',after:3})]);captureOn(all.generation,s.c3,[105,105,105]);
 const f=EFFECTS.m.foldNativeLoad(all);
 assert.equal(exOf(f.state).w,105,'the captured, performed debut lands');
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_COMPENSATION_DESCENDANTS'),'the raced undo is refused by name');
});
test('R4-B11 UNDO AFTER TRAINING (Astra L2 B11/M13; spec :153 "After subsequent training/landing return COMPENSATION_DESCENDANTS", N16): C3 completed at the old 100 while Q105 is pending -> COMPENSATION_DESCENDANTS',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),spend=decisionOf(s.offer).spend_id;
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:100,prescribed:100,effort:e(2,1,1)}),args=foldArgs([...s.cs,c3],[s.resp]);
 assert.equal(EFFECTS.m.foldNativeLoad(args).state.queue.find(q=>q.native_load_spend===spend).done,false,'Q105 still pending: C3 captured 100');
 expectRefusal(checkOf(args,LIFT,c3,{compensate:spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
});

// ======================================================================
// ROUND 5 rows (Astra L3 B12, B13, D11; Claude l3 D-B3-1, D-B3-2). Invented inputs.
// ======================================================================
function heldAdoption({baseline}){
 const c1=baseline?C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}):C(1,{reps:TOP,loads:105,effort:e(2,1,1)});
 const base=baseline?F0({w:null}):F0(),moved=()=>F0({w:baseline?45:102.5});
 const checked=checkOf(foldArgs([c1],[],'fx-revision-1',base),LIFT,c1);
 assert.equal(checked.status,'offer',JSON.stringify(checked.refusal));
 const offer=checked.offers[0];assert.equal(decisionOf(offer).kind,baseline?'adopt-baseline':'adopt-observed');
 return {c1,offer,spend:decisionOf(offer).spend_id,resp:acceptOp(offer,{after:1}),moved,now:baseline?45:102.5};
}
for(const baseline of [false,true])test('R5-B12'+(baseline?'b':'a')+' HELD ADOPTION UNDO (Astra L3 B12, Claude l3 D-B3-1; spec R8 :156 "Compensation stays reachable ... writes no w/wSets", :196): an '+(baseline?'adopt-baseline 60 (w null)':'adopt-observed 105 (w 100)')+' held by an unordered base change keeps a retire-only undo; its yes writes no w and clears the conflict',()=>{
 effectsGate();
 const h=heldAdoption({baseline});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp],rev,h.moved()));
  assert.deepEqual(f.issues.map(i=>[i.code,i.field,i.lift]),[['NATIVE_LOAD_EFFECT_CONFLICT','load_basis',LIFT]]);
  assert.equal(exOf(f.state).w,h.now,'the held adoption is never applied');
 }
 const args=foldArgs([h.c1],[h.resp],'fx-revision-1',h.moved());
 const undo=checkOf(args,LIFT,h.c1,{compensate:h.spend});
 assert.equal(undo.status,'offer','never COMPENSATION_DESCENDANTS when nothing captured or trained on it: '+JSON.stringify(undo.refusal));
 const d=decisionOf(undo.offers[0]);assert.deepEqual([d.kind,d.compensates],['compensate',h.spend]);
 assert.deepEqual(d.target_load.vector,Loads(h.now,h.now,h.now),'retire-only: the current load stands');
 const g=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:1})],'fx-revision-1',h.moved()));
 assert.equal(exOf(g.state).w,h.now,'no w write');
 assert.ok(!g.issues.some(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT'),'conflict cleared');
 assert.equal(g.spent.find(x=>x.spend_id===h.spend).cancelled_by,d.spend_id,'tombstone kept');
});
test('R5-B13 UNDO SURVIVES A LATER FRESH YES (Astra L3 B13; spec R8 :151 proven causality, :153 "no later Start captured the accepted effect", :154 original cut): C1,C2 yes A 105, undo A, C3,C4 at 100, fresh yes B 105, C5 captures and lifts 105 -> A stays compensated and B lands',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),A=decisionOf(s.offer).spend_id;
 const undo=checkOf(foldArgs(s.cs,[s.resp]),LIFT,s.cs[1],{compensate:A});assert.equal(undo.status,'offer');
 const comp=acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:2});
 const c3=C(3,{reps:TOP,effort:e(2,1,1)}),c4=C(4,{reps:TOP,effort:e(2,1,1)}),four=[...s.cs,c3,c4];
 const fresh=checkOf(foldArgs(four,[s.resp,comp]),LIFT,c4);
 assert.equal(fresh.status,'offer','the fresh work earns again: '+JSON.stringify(fresh.refusal));
 const B=decisionOf(fresh.offers[0]).spend_id;assert.notEqual(B,A);
 const respB=acceptOp(fresh.offers[0],{op_id:'fx-resp-3',after:4});
 const c5=C(5,{date:'2026-10-12',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)}),five=[...four,c5];
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const args=foldArgs(five,[s.resp,comp,respB],rev);captureOn(args.generation,c5,[105,105,105]);
  const f=EFFECTS.m.foldNativeLoad(args);
  assert.equal(f.spent.find(x=>x.spend_id===A).cancelled_by,decisionOf(undo.offers[0]).spend_id,'the earlier undo stays applied ('+rev+')');
  assert.deepEqual(f.state.queue.filter(q=>q.native_load_spend).map(q=>[q.native_load_spend===A?'A':'B',q.done,q.state]),[['A',true,'COMPENSATED'],['B',true,'ESTABLISH']]);
  assert.equal(exOf(f.state).w,105);
  assert.ok(!f.issues.some(i=>['NATIVE_LOAD_COMPENSATION_DESCENDANTS','NATIVE_LOAD_RECORD_INVALID','NATIVE_LOAD_TARGET_QUEUED'].includes(i.code)),JSON.stringify(f.issues));
 }
});
test('R5-RACED FOLD (Claude l3 D-B3-2; spec :153): a compensation recorded AFTER a Start captured its target is not applied by the fold: Q stays pending, no tombstone, issue COMPENSATION_DESCENDANTS names the undo',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),spend=decisionOf(s.offer).spend_id;
 const undo=checkOf(foldArgs(s.cs,[s.resp]),LIFT,s.cs[1],{compensate:spend});
 const args=foldArgs(s.cs,[s.resp,acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:2})]);
 const ops=args.generation.collections.ops;
 ops[s.c3.start]={op_id:s.c3.start,athlete_id:ATH,device_id:DEVICE,device_seq:ops['fx-resp-2'].device_seq-0.5,class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(s.c3.start)};
 captureOn(args.generation,s.c3,[105,105,105]);
 const f=EFFECTS.m.foldNativeLoad(args);
 const q=f.state.queue.find(x=>x.native_load_spend===spend);assert.deepEqual([q.done,q.state],[false,'DEBUT'],'the captured target is not retired');
 assert.equal(f.spent.find(x=>x.spend_id===spend).cancelled_by,null);
 assert.deepEqual(f.issues.find(i=>i.code==='NATIVE_LOAD_COMPENSATION_DESCENDANTS').refs,[ref('fx-resp-2')]);
});
test('R5-D11 FULL ISSUANCE EQUALITY (Astra L3 D11; spec :60 "semantic equality compares the validated full data, not merely the client\'s shortened proposal digest", :148): a held issuance whose body, reason or producer was substituted under the genuine proposal id is never fresh',()=>{
 effectsGate();
 const {cs}=landingScenario('fx-revision-1');
 const ev=checkOf(foldArgs(cs,[]),LIFT,cs[1]),offer=ev.offers[0];
 const held=EFFECTS.m.issuanceFor(offer,{revision:'fx-revision-1',source:JSON.stringify(SOURCE),moment:'2026-10-02T12:00:00.000Z'});
 const sub=(patch)=>({proposal_id:held.proposal_id,issuance:{...structuredClone(held.issuance),...patch}});
 const body150=structuredClone(held.issuance.body);body150.target_load={scalar:lb(150),vector:Loads(150,150,150)};
 const swaps=[sub({body:body150}),sub({reason:'SYNTHETIC substituted reason'}),sub({producer:'earned/other/v1'})];
 for(const x of swaps)assert.equal(EFFECTS.m.proposalDigest(EFFECTS.m.PRODUCER,offer.body,offer.reason),x.proposal_id,'the shortened digest alone would call it fresh');
 assert.equal(typeof EFFECTS.m.sameIssued,'function','RED NATIVE_LOAD_FULL_EQUALITY_ABSENT: FC03 exposes no full issued-body comparison for FC08');
 assert.equal(EFFECTS.m.sameIssued(offer,held),true,'the genuine issuance is fresh');
 for(const x of swaps)assert.equal(EFFECTS.m.sameIssued(offer,x),false,'a substitution is never fresh');
});

// ======================================================================
// ROUND 6 rows (Astra L4 B14, B15, B16). One root: a retire-only undo must be a
// durable cancellation rebuilt from its response on every projection. Invented inputs.
// ======================================================================
function heldUndo(baseline){
 const h=heldAdoption({baseline});
 const u1=checkOf(foldArgs([h.c1],[h.resp],'fx-revision-1',h.moved()),LIFT,h.c1,{compensate:h.spend});
 assert.equal(u1.status,'offer',JSON.stringify(u1.refusal));
 return {...h,u1,comp1:acceptOp(u1.offers[0],{op_id:'fx-resp-2',after:1}),compSpend:decisionOf(u1.offers[0]).spend_id};
}
const noConflict=f=>f.issues.filter(i=>['NATIVE_LOAD_EFFECT_CONFLICT','NATIVE_LOAD_RECORD_INVALID'].includes(i.code));
for(const baseline of [false,true])test('R6-B14'+(baseline?'b':'a')+' HELD UNDO ONCE (Astra L4 B14; spec R8 :121 "permanently cancels the targeted effect", :153, :156): a compensated held '+(baseline?'baseline':'observed')+' adoption offers no second undo; a second recorded undo with another body folds unchanged and never re-conflicts',()=>{
 effectsGate();
 const h=heldUndo(baseline);
 expectRefusal(checkOf(foldArgs([h.c1],[h.resp,h.comp1],'fx-revision-1',h.moved()),LIFT,h.c1,{compensate:h.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
 const other=h.moved();exOf(other).w=h.now+2.5;
 const u2=checkOf(foldArgs([h.c1],[h.resp],'fx-revision-1',other),LIFT,h.c1,{compensate:h.spend});
 assert.equal(u2.status,'offer');assert.equal(decisionOf(u2.offers[0]).spend_id,h.compSpend);
 assert.notDeepEqual(decisionOf(u2.offers[0]),decisionOf(h.u1.offers[0]),'the same undo, another body');
 const comp2=acceptOp(u2.offers[0],{op_id:'fx-resp-3',after:1});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,h.comp1,comp2],rev,h.moved()));
  assert.deepEqual(noConflict(f),[],'unchanged, never a conflict ('+rev+')');
  assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,h.compSpend,'the tombstone stands');
  assert.equal(exOf(f.state).w,h.now);
 }
});
for(const baseline of [false,true])test('R6-B15'+(baseline?'b':'a')+' UNDO SURVIVES A LATER BASE (Astra L4 B15; spec R8 :153-156, :154 original cut): a retire-only undo of a held '+(baseline?'baseline':'observed')+' adoption stays COMPENSATED when a later immutable base moves again, under R1 and R2',()=>{
 effectsGate();
 const h=heldUndo(baseline),later=h.moved();exOf(later).w=h.now+5;
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,h.comp1],rev,later));
  assert.deepEqual(noConflict(f),[],'no conflict, no RECORD_INVALID ('+rev+')');
  assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,h.compSpend);
  assert.equal(exOf(f.state).w,h.now+5,'the later base stands; nothing is written');
 }
});
// Round 16 (Astra L8 B28): this row required w 102.5 under the superseded R8 :156 reading
// (retire-only because the replay-time state carries no trace). R9.4 :156 classifies AND
// applies by the RECORD'S OWN SHAPE: the undo was issued on the applied 105 with target 100
// (a RESTORE), so replay restores 100 over any later base; the RESTORE is never lost.
test('R6-B15c UNDONE APPLIED ADOPTION SURVIVES A LATER BASE (Astra L4 B15, L8 B28; spec R9.4 :156 "classified by the RECORD\'S OWN SHAPE, never by replay-time state ... RESTORE ... replay restores it"): adopt-observed 105 applied at base 100, undone to 100 (RESTORE), then a base 102.5 -> still COMPENSATED, no conflict, w 100 (the RESTORE applies)',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false}),base=F0();
 assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp],'fx-revision-1',base)).state).w,105,'applied at its own base');
 const u=checkOf(foldArgs([h.c1],[h.resp],'fx-revision-1',base),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer');
 const comp=acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1});
 assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,comp],'fx-revision-1',base)).state).w,100,'undone to the prior image');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,comp],rev,F0({w:102.5})));
  assert.deepEqual(noConflict(f),[],rev);assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,decisionOf(u.offers[0]).spend_id);
  assert.equal(exOf(f.state).w,100,'the RESTORE applies by its own shape, never lost to the later base ('+rev+')');
 }
});
test('R6-B16 CAPTURED HELD ADOPTION (Astra L4 B16; spec R8 :153 "only if no later Start captured the accepted effect"): a Start that captured the adopted 105 refuses the undo with COMPENSATION_DESCENDANTS at check, and the fold refuses a recorded one by the SAME predicate',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false}),c2=C(2,{reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)});
 const u=checkOf(foldArgs([h.c1],[h.resp],'fx-revision-1',h.moved()),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer','before the capture');
 const withStart=extra=>{const a=foldArgs([h.c1],[h.resp,...extra],'fx-revision-1',h.moved());
  a.generation.collections.ops[c2.start]={op_id:c2.start,athlete_id:ATH,device_id:DEVICE,device_seq:a.generation.collections.ops['fx-resp-1'].device_seq+0.5,class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(c2.start)};
  captureOn(a.generation,c2,[105,105,105]);return a;}; // the Start follows the yes and precedes the undo
 expectRefusal(checkOf(withStart([]),LIFT,h.c1,{compensate:h.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
 const f=EFFECTS.m.foldNativeLoad(withStart([acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1})]));
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_COMPENSATION_DESCENDANTS'),'the fold agrees');
 assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,null);
});

// ======================================================================
// ROUND 7 rows (Astra L5 B18, B19, B20, B22; Claude l5 D-B5-1). Invented inputs.
// ======================================================================
for(const baseline of [false,true])test('R7-B18'+(baseline?'b':'a')+' UNDO SURVIVES A RETURN TO THE ORIGINAL BASE (Astra L5 B18; spec R8 :121 "permanently cancels", :153-156): a '+(baseline?'baseline':'observed')+' adoption undone while held stays COMPENSATED when the base returns to its original value, R1 and R2',()=>{
 effectsGate();
 const h=heldUndo(baseline),original=baseline?F0({w:null}):F0();
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,h.comp1],rev,original));
  assert.deepEqual(noConflict(f),[],'no conflict, no RECORD_INVALID ('+rev+')');
  assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,h.compSpend,'the cancellation stands ('+rev+')');
  assert.equal(exOf(f.state).w,baseline?null:100,'the agreed '+(baseline?60:105)+' never returns ('+rev+')');
 }
});
function b19Scenario(u2Seq,u2Id='fx-resp-u2'){
 const s=landingScenario('fx-revision-1'),A=decisionOf(s.offer).spend_id;
 const dupA=acceptOp(s.offer,{op_id:'fx-resp-1b',after:2});
 const u1=checkOf(foldArgs(s.cs,[s.resp]),LIFT,s.cs[1],{compensate:A}),u2=checkOf(foldArgs(s.cs,[s.resp,dupA]),LIFT,s.cs[1],{compensate:A});
 assert.equal(u1.status,'offer');assert.equal(u2.status,'offer');
 assert.notDeepEqual(decisionOf(u1.offers[0]),decisionOf(u2.offers[0]),'two bodies of one cancellation');
 const U1=acceptOp(u1.offers[0],{op_id:'fx-resp-2',after:2}),U2=acceptOp(u2.offers[0],{op_id:u2Id,after:2});
 const c3=C(3,{reps:TOP,effort:e(2,1,1)}),c4=C(4,{reps:TOP,effort:e(2,1,1)}),four=[...s.cs,c3,c4];
 const fresh=checkOf(foldArgs(four,[s.resp,dupA,U1]),LIFT,c4);assert.equal(fresh.status,'offer',JSON.stringify(fresh.refusal));
 const B=decisionOf(fresh.offers[0]).spend_id,respB=acceptOp(fresh.offers[0],{op_id:'fx-resp-3',after:4});
 const c5=C(5,{date:'2026-10-12',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)});
 return rev=>{
  const args=foldArgs([...four,c5],[s.resp,dupA,U1,U2,respB],rev);captureOn(args.generation,c5,[105,105,105]);
  const u=args.generation.collections.ops[u2Id];u.device_id='fx-device-B';u.device_seq=u2Seq;u.causal_parents=['fx-resp-1'];
  return {f:EFFECTS.m.foldNativeLoad(args),A,B,undo:decisionOf(u1.offers[0]).spend_id};
 };
}
// The last two variants give the OTHER device's record the least op id, so it is the
// canonical representative and only the first device's record proves the undo came
// before the C5 Start (every record is proof: review B19).
for(const [u2Seq,u2Id] of [[1,'fx-resp-u2'],[100,'fx-resp-u2'],[1,'fx-resp-0u2'],[100,'fx-resp-0u2']])test('R7-B19 COALESCED UNDO IS ORDER-FREE (Astra L5 B19, Claude l5 D-B5-1; spec R8 :151, :153, :156): two bodies of one cancellation on two devices (other device seq '+u2Seq+(u2Id==='fx-resp-u2'?'':', record '+u2Id)+') keep A cancelled and land the fresh B under R1 and R2',()=>{
 effectsGate();
 const run=b19Scenario(u2Seq,u2Id);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const {f,A,B,undo}=run(rev);
  assert.equal(f.spent.find(x=>x.spend_id===A).cancelled_by,undo,'the proven cancellation is never lost ('+rev+')');
  assert.deepEqual(f.state.queue.filter(q=>q.native_load_spend).map(q=>[q.native_load_spend===A?'A':q.native_load_spend===B?'B':'?',q.done,q.state]),[['A',true,'COMPENSATED'],['B',true,'ESTABLISH']],rev);
  assert.ok(!f.issues.some(i=>['NATIVE_LOAD_COMPENSATION_DESCENDANTS','NATIVE_LOAD_RECORD_INVALID','NATIVE_LOAD_TARGET_QUEUED'].includes(i.code)),JSON.stringify(f.issues));
 }
});
test('R7-B20 RENAME KEEPS AGREED WEIGHTS (Astra L5 B20; spec :103 lineage "never display name", :120, :154 original cut, N19c): an accepted earn and an accepted adoption survive a rename of the lift under R1 and R2',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id,renamed=()=>F0({n:'Renamed Synthetic Press'});
 const h=heldAdoption({baseline:false});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp],rev,renamed()));
  assert.deepEqual(noConflict(f),[],rev);
  assert.deepEqual(f.state.queue.filter(q=>q.native_load_spend).map(q=>[q.native_load_spend===spend,q.done]),[[true,false]],'the agreed target is kept ('+rev+')');
  const g=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp],rev,renamed()));
  assert.deepEqual(noConflict(g),[],rev);assert.equal(exOf(g.state).w,105,'the agreed working weight is kept ('+rev+')');
 }
});
test('R7-B22 V1 CAPTURE BEFORE A PLAN EDIT (Astra L5 B22; spec :127, :148, step 2 "an older completion cannot silently replace a newer athlete choice"): a host-shaped completion captured 100 cannot be offered or adopted over a newer plan of 102.5 -> PLAN_CHANGED',()=>{
 effectsGate();
 const c1=v1Of(C(1,{reps:TOP,loads:100,effort:e(2,1,1)}));
 const at=w=>{const a=foldArgs([c1],[],'fx-revision-1',F0({w}));captureOn(a.generation,c1,[100,100,100]);return a;};
 assert.equal(checkOf(at(100),LIFT,c1).status,'refused','control: the captured plan still holds (PROVISIONAL)');
 expectRefusal(checkOf(at(102.5),LIFT,c1),'PLAN_CHANGED',[ref(c1.close)]);
});
// Property counterexamples, 20,000-sequence walk from seed 20260923: seeds 20269845 and
// 20274085 (I3, R1 vs R2). The second yes was issued on the working weight the first yes
// adopted (its spend_id's load authority root IS the first spend). A later plan base moves,
// so the first effect is held (D7b); the second read an authority the fold never applied.
test('R7-P1 DEPENDENT OF A HELD EFFECT (property seeds 20269845, 20274085; spec R8 :156 "same-lift dependencies follow witnessed causal/source order", "every revision and delivery order reproduces the same conflict"): an adoption issued on a held adoption is held too, identically under R1 and R2',()=>{
 effectsGate();
 const pickTarget=(ev,v)=>{assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));const o=ev.offers.find(x=>decisionOf(x).target_load.scalar.value===v);assert.ok(o,JSON.stringify(ev.offers.map(x=>[decisionOf(x).kind,decisionOf(x).target_load.scalar.value])));return o;};
 const c1=C(1,{reps:TOP,loads:100,effort:e(2,1,1)}),c2=C(2,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)});
 const o1=pickTarget(checkOf(foldArgs([c1,c2],[]),LIFT,c2),105),r1=acceptOp(o1,{op_id:'fx-p-1',after:2}),S1=decisionOf(o1).spend_id;
 const c3=C(3,{reps:TOP,loads:110,prescribed:105,effort:e(2,1,1)});
 const o2=pickTarget(checkOf(foldArgs([c1,c2,c3],[r1]),LIFT,c3),110),r2=acceptOp(o2,{op_id:'fx-p-2',after:3}),S2=decisionOf(o2).spend_id;
 assert.equal(JSON.parse(S2)[2],S1,'control: the second yes stands on the first yes');
 const out={};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([c1,c2,c3],[r1,r2],rev,F0({w:105})));
  out[rev]={w:exOf(f.state).w,spent:f.spent.map(x=>x.spend_id).sort(),held:f.issues.filter(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT'&&i.field==='load_basis').map(i=>i.spend_id).sort(),
   bad:f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').length};
 }
 assert.deepEqual(out['fx-revision-2'],out['fx-revision-1'],'R1 and R2 agree');
 assert.deepEqual(out['fx-revision-1'],{w:105,spent:[S1,S2].sort(),held:[S1,S2].sort(),bad:0},'both held, both kept, no weight written');
});

// ======================================================================
// ROUND 7 MODEL-BASED PROPERTY ROW (PM methodology order, round 7). Seeded and
// deterministic. Each sequence is a random walk over one lift of: tops and misses (typed
// v2 and host-shaped v1 with a Start capture), checks and yeses, undos, repeated undo
// checks, base moves (including a return to the original value), renames, plan edits,
// captures by a later Start, and cold reopens; every projection is the cold fold.
// Invariants, after every step and at the end:
//  I1 no working weight exists that no yes authorized (w is the base's or an accepted target;
//     round 17c, spec R9.8 :156: a consented RESTORE target is an accepted target too);
//  I2 a proven cancellation (an undo offered and recorded) is never lost, and never re-offered;
//  I3 the same result under both delivery orders (responses moved to a second device,
//     causal parents chained, device B's own sequence ascending with that chain, round 18;
//     since round 21c by deliveryTransform, which keeps FC03 provenBefore identical)
//     and under revision R1 or R2;
//  I4 a rename never changes an outcome;
//  I5 a stale offer never writes: after a plan edit the old issuance is never fresh (round 18:
//     except under a consented RESTORE, whose recorded target a w-only edit cannot move).
// NATIVE_LOAD_PROPERTY_RUNS (default 150) and NATIVE_LOAD_PROPERTY_SEED (default 20260923).
// ======================================================================
// Round 21c (spec R9.13 (viii) WALK-I3-PARTIAL-ORDER; Fable R21 l1 F2 = D-R21L1-2): a delivery transform that I3 compares
// against must keep provenBefore (FC03's own function, read out of the product file and evaluated as written, as ALV is) for
// every ordered pair of ops. orderKept is that precondition, before and after each transformed log: it throws
// TRANSFORM_ORDER_CHANGED, which is not a counterexample, so the walk stops loudly (never a skip).
const PROVEN=(()=>{try{const src=require('node:fs').readFileSync(EFFECTS_FILE,'utf8'),a=src.indexOf('\nfunction provenBefore('),b=a<0?-1:src.indexOf('\n}\n',a),t=src.match(/\nconst text = [^\n]*;\n/);
 if(a<0||b<0||!t)return {fn:null,reason:'function provenBefore or const text absent from '+EFFECTS_FILE};
 return {fn:new Function(t[0].trim()+src.slice(a,b+2)+'\nreturn provenBefore;')(),reason:null};}catch(err){return {fn:null,reason:String(err&&err.message||err)};}})();
const provenPairs=ops=>{assert.ok(PROVEN.fn,'RED PROVEN_BEFORE_ABSENT: '+PROVEN.reason);const xs=Object.values(ops),byId=new Map(xs.map(x=>[x.op_id,x])),out=[];
 for(const a of xs)for(const b of xs)if(a!==b&&PROVEN.fn([a],b,byId))out.push(a.op_id+' < '+b.op_id);return out.sort();};
function orderKept(before,ops,where){const after=provenPairs(ops);if(JSON.stringify(after)===JSON.stringify(before))return;
 const A=new Set(after),B=new Set(before),e=new Error('TRANSFORM_ORDER_CHANGED '+where+' added '+JSON.stringify(after.filter(x=>!B.has(x)))+' dropped '+JSON.stringify(before.filter(x=>!A.has(x))));
 e.code='TRANSFORM_ORDER_CHANGED';throw e;}
// The delivery transform both walks use (R7 and R8 twoDevice). provenBefore is not transitive across a device's own sequence:
// it walks only causal_parents (and device_predecessor_op_id) and uses device_seq at the two end points only. So chaining each
// op after its same-device predecessor (round 21a's R8 form) ADDS pairs whenever an op on another device names a causal parent
// on that device (measured, R8 seed 20261001: the device-B dup fx-p-3 names fx-p-1, and fx-close-1 .. fx-start-4 became proven
// before it). Rule (viii) allows a move "only where that adds no pair": each plan op of an original device d may move, in
// original order, to device 'fx-2dev|'+d (sequence 1000+i); a moved op p gains as causal parents the ops of d below it that do
// not move, and each op of d above it that does not move gains p; the ops of d that move keep their order on the new device.
// All plan ops move when that keeps provenBefore identical; otherwise ops are admitted one at a time in (device, sequence)
// order, each only if the whole relation stays identical. orderKept is then asserted. stats counts moved and kept plan ops.
function deliveryTransform(ops,where,stats){
 const pre=provenPairs(ops),all=Object.values(ops),orig=new Map(all.map(op=>[op.op_id,{device_id:op.device_id,device_seq:op.device_seq,has:Object.hasOwn(op,'causal_parents'),parents:Array.isArray(op.causal_parents)?op.causal_parents.slice():op.causal_parents}]));
 const byDev=new Map();for(const op of all){if(!byDev.has(op.device_id))byDev.set(op.device_id,[]);byDev.get(op.device_id).push(op);}
 for(const xs of byDev.values())xs.sort((x,y)=>x.device_seq-y.device_seq||(x.op_id<y.op_id?-1:1));
 const plan=[...byDev.values()].flat().filter(op=>op.class==='plan');
 const add=(op,id)=>{const ps=Array.isArray(op.causal_parents)?op.causal_parents:[];if(!ps.includes(id))op.causal_parents=[...ps,id];};
 const apply=moved=>{
  for(const op of all){const o=orig.get(op.op_id);op.device_id=o.device_id;op.device_seq=o.device_seq;if(o.has)op.causal_parents=Array.isArray(o.parents)?o.parents.slice():o.parents;else delete op.causal_parents;}
  for(const [d,xs] of byDev){
   for(const p of xs){if(!moved.has(p.op_id))continue;const s=orig.get(p.op_id).device_seq;
    for(const q of xs){if(q===p||moved.has(q.op_id))continue;const t=orig.get(q.op_id).device_seq;if(t<s)add(p,q.op_id);else if(t>s)add(q,p.op_id);}}
   let i=0;for(const p of xs)if(moved.has(p.op_id)){p.device_id='fx-2dev|'+d;p.device_seq=1000+(i++);}}
  return JSON.stringify(provenPairs(ops))===JSON.stringify(pre);
 };
 let chosen=new Set(plan.map(p=>p.op_id));
 if(!apply(chosen)){chosen=new Set();for(const p of plan){chosen.add(p.op_id);if(!apply(chosen))chosen.delete(p.op_id);}apply(chosen);}
 orderKept(pre,ops,where);
 if(stats){stats.moved+=chosen.size;stats.kept+=plan.length-chosen.size;}
}
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function propertySequence(seed){
 const rnd=mulberry32(seed),pick=xs=>xs[Math.floor(rnd()*xs.length)],chance=p=>rnd()<p;
 const baseline=chance(0.25),origW=baseline?null:100;
 const m={w:origW,n:'Fx Press',comps:[],extras:[],starts:[],proven:[],accepted:new Set(),restores:new Set(),trace:[],k:0,dev2:{moved:0,kept:0}};
 const base=(patch={})=>{const b=F0(origW===null?{w:null}:{});exOf(b).w=patch.w!==undefined?patch.w:m.w;exOf(b).n=patch.n||m.n;return b;};
 const gen=(o={})=>{
  const a=foldArgs(m.comps,m.extras,o.rev||'fx-revision-1',base(o.base));
  const ops=a.generation.collections.ops;let seq=Math.max(0,...Object.values(ops).map(x=>x.device_seq));
  for(const s of m.starts){if(!ops[s.anchor])continue;/* an older view (undo2) predates this Start */ops[s.c.start]={op_id:s.c.start,athlete_id:ATH,device_id:DEVICE,device_seq:s.afterSeq(ops),class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(s.c.start)};captureOn(a.generation,s.c,s.loads);}
  for(const c of m.comps)if(c.v1)captureOn(a.generation,c,c.cap);
  if(o.twoDevice){
   // Round 21c (spec R9.13 (viii); D-R21L1-2 (b)): the round-18 form chained every op after the previous op of ONE global
   // device_seq sort and put every plan op on device 'fx-device-B' (the dup/undo2 device), so a dup or an older-view undo
   // on device B became ordered against every op of the main device (R7 seed 20260960, TRANSFORM_ORDER_CHANGED: fx-p-2 and
   // fx-p-3 gained 30+ pairs). Round 18's rule stands (a moved sequence ascends with its causal chain, 1000+i; R8 seed
   // 20261438, R7 seed 20270133); the move itself is now deliveryTransform's (above), shared with R8.
   deliveryTransform(ops,'R7 twoDevice seed='+seed,m.dev2);
   void seq;
  }
  return a;
 };
 const fold=o=>EFFECTS.m.foldNativeLoad(gen(o));
 const held=f=>f.issues.some(i=>i.lift===LIFT&&['NATIVE_LOAD_EFFECT_CONFLICT','NATIVE_LOAD_BASIS_REPAIR_REQUIRED','NATIVE_LOAD_RECORD_INVALID'].includes(i.code));
 const fail=(what,extra)=>{const e=new Error('PROPERTY '+what+' seed='+seed+' trace='+JSON.stringify(m.trace)+(extra?' '+JSON.stringify(extra):''));e.code='PROPERTY_COUNTEREXAMPLE';throw e;};
 // Round 17c (Astra L10 D-L10-8; spec R9.8 :156): a consented RESTORE (an Undo whose target is
 // unlike its own base, the shape FC01 classifies by) writes its recorded target, so that target
 // is an accepted image for I1, as an accepted adoption or earn target is (seed 20261085). A
 // RETIRE (target = its base) adds nothing. The shape test is R8's (acceptUndo, sameShape).
 const consentUndo=d=>{if(JSON.stringify(d.target_load.scalar)===JSON.stringify(d.base_load.scalar)&&JSON.stringify(d.target_load.vector)===JSON.stringify(d.base_load.vector))return;
  m.accepted.add(d.target_load.scalar?d.target_load.scalar.value:null);m.restores.add(d.spend_id);m.trace.push('undo-restore');};
 // The queue entry's title t is a display label written from the CURRENT name; it is not an outcome.
 const norm=f=>({state:(()=>{const s=structuredClone(f.state);const ex=exOf(s);delete ex.n;return {ex,queue:s.queue.filter(q=>q.native_load_spend).map(q=>{const x={...q};delete x.t;return x;})};})(),
  spent:f.spent.map(x=>[x.spend_id,x.cancelled_by,x.close_ref&&x.close_ref.op_id]).sort(),
  issues:[...new Set(f.issues.filter(i=>!['NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED'].includes(i.code)).map(i=>i.code))].sort()});
 const checkInvariants=(stage)=>{
  const f=fold();
  const w=exOf(f.state).w;
  if(!(w===m.w||m.accepted.has(w)))fail('I1 unauthorized weight '+w+' at '+stage,{base:m.w,accepted:[...m.accepted]});
  for(const p of m.proven){
   const x=f.spent.find(y=>y.spend_id===p.target);
   if(!x||!x.cancelled_by)fail('I2 proven cancellation lost at '+stage,{target:p.target});
   const again=checkOf(gen(),LIFT,m.comps.at(-1),{compensate:p.target});
   if(again.status==='offer')fail('I2 cancelled spend offered again at '+stage);
  }
  return f;
 };
 const steps=6+Math.floor(rnd()*8);
 for(let step=0;step<steps;step++){
  const f=fold(),action=pick(m.comps.length<2?['train','train','train','base','rename']:['train','train','check','check','undo','base','rename','plan','capture','reopen','dup','undo2']);
  m.trace.push(action);
  if(action==='train'){
   if(held(f)){m.trace.push('skip-held');continue;}
   const n=m.comps.length+1,q=f.state.queue.find(x=>x&&x.exId===LIFT&&!x.done&&typeof x.native_load_spend==='string');
   let card=q?q.newW:exOf(f.state).w;const lifted=card===null?pick([60,65]):chance(0.15)?card+5:card;
   const reps=pick([TOP,TOP,TOP,[10,9,7],[9,8,8]]),effort=chance(0.8)?e(2,1,1):e(0,1,1);
   let c=C(n,{reps,loads:lifted,prescribed:card,effort});
   if(chance(0.3)){c=v1Of(c);c.v1=true;c.cap=[card,card,card];}
   m.comps.push(c);m.trace.push([n,card,lifted,reps.join('')]);
  }else if(action==='check'){
   const ev=checkOf(gen(),LIFT,m.comps.at(-1));
   if(ev.status==='offer'){
    const offer=pick(ev.offers),held0=EFFECTS.m.issuanceFor(offer,{revision:'fx-revision-1',source:JSON.stringify(SOURCE),moment:'2026-10-02T12:00:00.000Z'});
    m.lastOffer={offer,held:held0,w:m.w,n:m.comps.length};
    if(chance(0.7)){m.extras.push(acceptOp(offer,{op_id:'fx-p-'+(++m.k),after:m.comps.length}));m.accepted.add(decisionOf(offer).target_load.scalar.value);m.trace.push('yes');}
   }
  }else if(action==='undo'){
   const live=f.spent.filter(x=>!x.cancelled_by&&!x.spend_id.startsWith('["native-load-compensation"'));
   if(!live.length)continue;
   const target=pick(live).spend_id,ev=checkOf(gen(),LIFT,m.comps.at(-1),{compensate:target});
   if(ev.status==='offer'){const d=decisionOf(ev.offers[0]);m.extras.push(acceptOp(ev.offers[0],{op_id:'fx-p-'+(++m.k),after:m.comps.length}));m.proven.push({target,undo:d.spend_id});m.trace.push('undo-yes');consentUndo(d);}
  }else if(action==='base'||action==='plan'){
   const ws=origW===null?[null,45,50]:[100,102.5,97.5,105];m.w=pick(ws);m.trace.push(m.w);
   // Round 18 (DECISIONS:801 (3), the R8 round-16 restoreRooted convention, R8 seed 5016917;
   // R7 seed 20265787; spec R9.8 :156): a consented RESTORE writes its own recorded target
   // whatever the base on replay, so a later w-only edit under it (every R7 base edit is w-only)
   // changes nothing the lift's offers read, and the old issuance may stay fresh.
   const restoreRooted=(()=>{const a=exOf(fold().state).native_load_authority;return !!a&&a.kind==='compensated'&&m.restores.has(a.spend_id);})();
   if(m.lastOffer&&m.lastOffer.w!==m.w&&m.lastOffer.n===m.comps.length&&!restoreRooted){
    const ev=checkOf(gen(),LIFT,m.comps.at(-1));
    if(ev.status==='offer'&&ev.offers.some(o=>EFFECTS.m.sameIssued(o,m.lastOffer.held)))fail('I5 stale offer still fresh after plan edit',{from:m.lastOffer.w,to:m.w});
   }
  }else if(action==='dup'){
   // The same recorded yes or undo delivered again from a second device (distinct response id).
   if(!m.extras.length)continue;
   const src=pick(m.extras);m.extras.push({...src,op_id:'fx-p-'+(++m.k),after:m.comps.length,device:'fx-device-B'});m.trace.push('dup');
  }else if(action==='undo2'){
   // A second device records the SAME cancellation from its own older view (another body).
   if(!m.proven.length)continue;
   const p=pick(m.proven),idx=m.extras.findIndex(x=>x.payload.issuance.body.compensates===p.target);
   const older=m.extras.slice(0,idx),save=m.extras;m.extras=older;const ev=checkOf(gen(),LIFT,m.comps.at(-1),{compensate:p.target});m.extras=save;
   if(ev.status==='offer'){m.extras.push({...acceptOp(ev.offers[0],{op_id:'fx-p-'+(++m.k),after:m.comps.length}),device:'fx-device-B'});m.trace.push('undo2-yes');consentUndo(decisionOf(ev.offers[0]));}
  }else if(action==='rename'){m.n=pick(['Fx Press','Renamed Press','Bench (renamed)','Fx: Press']);m.trace.push(m.n);}
  else if(action==='capture'){
   if(held(f)||m.starts.length)continue;
   const q=f.state.queue.find(x=>x&&x.exId===LIFT&&!x.done&&typeof x.native_load_spend==='string'),card=q?q.newW:exOf(f.state).w;
   if(card===null)continue;
   // A later Start that captured the current card and is still open, placed right after
   // the newest operation that exists now (not after operations recorded later).
   const c=C(900+m.starts.length,{reps:TOP,effort:e(2,1,1)}),lastExtra=m.extras.filter(x=>x.after===m.comps.length).at(-1);
   const anchor=lastExtra?lastExtra.op_id:m.comps.at(-1).close;
   m.starts.push({c,anchor,loads:[card,card,card],afterSeq:ops=>ops[anchor].device_seq+0.5});m.trace.push(['capture',card]);
  }
  checkInvariants('step '+step);
 }
 const f=checkInvariants('end');
 const ref0=norm(f);
 for(const o of [{rev:'fx-revision-2'},{twoDevice:true},{twoDevice:true,rev:'fx-revision-2'}]){
  const g=norm(fold(o));
  if(JSON.stringify(g)!==JSON.stringify(ref0))fail('I3 differs under '+JSON.stringify(o),{ref:ref0,got:g});
 }
 const r=norm(fold({base:{n:'Property Rename'}}));
 if(JSON.stringify(r)!==JSON.stringify(ref0))fail('I4 rename changes the outcome',{ref:ref0,got:r});
 const tally={};for(const t of m.trace)if(typeof t==='string')tally[t]=(tally[t]||0)+1;
 for(const e2 of f.effects)tally['effect:'+e2.kind]=(tally['effect:'+e2.kind]||0)+1;
 for(const i of f.issues)tally['issue:'+i.code]=(tally['issue:'+i.code]||0)+1;
 if(baseline)tally.baseline=1;
 tally['twoDevice:moved']=m.dev2.moved;tally['twoDevice:kept']=m.dev2.kept; // Round 21c: plan ops deliveryTransform moved / kept
 Object.defineProperty(tally,'detail',{value:{trace:m.trace,issues:f.issues,spent:f.spent,w:exOf(f.state).w},enumerable:false});
 return tally;
}
test('R7-PROPERTY MODEL-BASED WALK (PM round 7; invariants I1-I5 above; seeded, deterministic)',()=>{
 effectsGate();
 const runs=Number(process.env.NATIVE_LOAD_PROPERTY_RUNS||150),seed0=Number(process.env.NATIVE_LOAD_PROPERTY_SEED||20260923);
 const found=[],coverage={};
 for(let i=0;i<runs;i++){
  try{const t=propertySequence(seed0+i);if(runs<=3)coverage['detail '+(seed0+i)]=t.detail;for(const [k,v] of Object.entries(t)){coverage[k]=(coverage[k]||0)+v;if(k.startsWith('issue:')){const s='seeds '+k;coverage[s]=coverage[s]||[];if(coverage[s].length<5)coverage[s].push(seed0+i);}}}
  catch(err){if(err&&err.code==='PROPERTY_COUNTEREXAMPLE'){found.push(err.message);if(!process.env.NATIVE_LOAD_PROPERTY_ALL)break;}else throw new Error('seed='+(seed0+i)+' '+(err&&err.stack||err));}
 }
 if(process.env.NATIVE_LOAD_PROPERTY_REPORT)require('node:fs').writeFileSync(process.env.NATIVE_LOAD_PROPERTY_REPORT,JSON.stringify({runs,seed0,found,coverage},null,1));
 assert.deepEqual(found,[],'counterexamples');
});

// Round-8 walk counterexamples, seeds 20261016 and 20261036 (I3, R1 vs R2): a legacy
// structural PROPOSED entry appears for the lift after an adoption yes. R2 applies the
// body and the transition refuses LEGACY_PENDING; R1 re-validated first, the evaluation
// refused LEGACY_PENDING too, and the fold called the record RECORD_INVALID.
test('R8-P2 A STATE PRECONDITION IS NOT A BAD RECORD (round-8 property seeds 20261016, 20261036; spec R8 :156 "every revision and delivery order reproduces the same conflict", :176): a yes held back by a later legacy PROPOSED entry folds LEGACY_PENDING under R1 and R2, and lands once the entry is gone',()=>{
 effectsGate();
 const c1=C(1,{reps:TOP,loads:100,effort:e(2,1,1)}),c2=C(2,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)});
 const ev=checkOf(foldArgs([c1,c2],[]),LIFT,c2);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
 const o=ev.offers.find(x=>decisionOf(x).target_load.scalar.value===105);assert.ok(o,'control: adopt 105 offered');
 const r=acceptOp(o,{op_id:'fx-p-1',after:2}),legacy=()=>{const s=F0();s.queue.push({exId:LIFT,kind:'debut',done:false,state:'PROPOSED',newW:105,t:'SYNTHETIC legacy'});return s;};
 const out={};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([c1,c2],[r],rev,legacy()));
  out[rev]={w:exOf(f.state).w,codes:[...new Set(f.issues.map(i=>i.code))].filter(c=>c!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').sort()};
  const g=EFFECTS.m.foldNativeLoad(foldArgs([c1,c2],[r],rev,F0()));
  assert.equal(exOf(g.state).w,105,'without the legacy entry the yes applies ('+rev+')');
 }
 assert.deepEqual(out['fx-revision-2'],out['fx-revision-1'],'R1 and R2 agree');
 assert.deepEqual(out['fx-revision-1'],{w:100,codes:['NATIVE_LOAD_LEGACY_PENDING']},'held back by name, never RECORD_INVALID');
});
// Round-8 walk counterexample, seed 20261004 (I2): an earn yes, its undo recorded, then a
// legacy PROPOSED entry for the lift. The accept's transition refuses LEGACY_PENDING, the
// yes vanished from the spend index, and with it the proven cancellation.
test('R8-P3 A HELD-BACK YES STAYS CANCELLED (round-8 property seed 20261004; spec R8 :121 "permanently cancels", :153 tombstone, :156 "Keep accepted history ... Compensation stays reachable"): after yes Q and its undo, a later legacy PROPOSED entry keeps the spend and its cancellation under R1 and R2, writes no w',()=>{
 effectsGate();
 const s=landingScenario('fx-revision-1'),A=decisionOf(s.offer).spend_id;
 const u=checkOf(foldArgs(s.cs,[s.resp]),LIFT,s.cs[1],{compensate:A});assert.equal(u.status,'offer',JSON.stringify(u.refusal));
 const U=acceptOp(u.offers[0],{op_id:'fx-resp-2',after:2}),undo=decisionOf(u.offers[0]).spend_id;
 const legacy=()=>{const b=F0();b.queue.push({exId:LIFT,kind:'debut',done:false,state:'PROPOSED',newW:105,t:'SYNTHETIC legacy'});return b;};
 const out={};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(s.cs,[s.resp,U],rev,legacy()));
  const x=f.spent.find(y=>y.spend_id===A);
  assert.ok(x,'the yes is kept in the spend index ('+rev+')');
  assert.equal(x.cancelled_by,undo,'the proven cancellation is never lost ('+rev+')');
  assert.equal(exOf(f.state).w,100,'no weight written ('+rev+')');
  out[rev]={spent:f.spent.map(y=>[y.spend_id,y.cancelled_by]).sort(),codes:[...new Set(f.issues.map(i=>i.code))].filter(c=>c!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').sort()};
  assert.ok(!f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),JSON.stringify(f.issues));
 }
 assert.deepEqual(out['fx-revision-2'],out['fx-revision-1'],'R1 and R2 agree');
});
// Round-8 walk counterexample, seed 20273709 (I3, R1 vs R2): an earn yes on Fx Row from two
// sessions shared with Fx Press, then a fork on Fx PRESS dated the second session (any
// kind, even 'context'). The engine's noise comparator pools every lift's pairs by each
// lift's own era (progression.cjs typicalError, frozen app.jsx:2130-2160), so the press
// fork moves the pool and a fresh Fx Row check is PROVISIONAL. R1 re-validation of the
// ROW yes then fails (RECORD_INVALID on fx-row); R2 applies it as written (:154).
// Round 8 STOP, answered by DECISIONS:793: re-validation judges ONLY at the original cut,
// with every input the evaluator read taken as of that cut (pooled readers included);
// later edits elsewhere never revoke consent, so R1 folds as R2 (applied as written).
for(const v1First of [false,true])test('R8-P4 ANOTHER LIFT\'S FORK (round-8 property seed 20273709; spec R8 :154, :156 "Distinct-lift independent effects commute"; DECISIONS:793): a fork on Fx Press never invalidates an accepted Fx Row earn, R1 and R2 alike'+(v1First?' (first session host v1)':''),()=>{
 effectsGate();
 // The walk's exact sessions: Fx Row misses then tops; Fx Press tops, its second opener honest (0 in reserve).
 const both=(n,v1,rowReps,pressEffort)=>sess2(n,{entries:[{lift:LIFT,reps:TOP,effort:pressEffort},{lift:ROW,reps:rowReps,effort:e(2,1,1)}].map(x=>({...x,loads:[100,100,100],prescribed:[100,100,100],v1}))});
 const cs=[both(1,v1First,[9,8,8],e(2,1,1)),both(2,false,TOP,e(0,1,1))],cap={[LIFT]:[100,100,100],[ROW]:[100,100,100]};
 const at=(base,extra=[],rev='fx-revision-1')=>{const a=foldArgs(cs,extra,rev,base);for(const c of cs)captureLifts(a.generation,c,cap,{[LIFT]:10,[ROW]:10},true);return a;}; // round 12: FC16 captures (spec R9.1 :127)
 const ev=checkOf(at(withRow()),ROW,cs[1]);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
 const o=ev.offers.find(x=>decisionOf(x).kind==='earn');assert.ok(o,'control: an earn is offered for Fx Row');
 const r=acceptOp(o,{op_id:'fx-p-1',after:2}),spend=decisionOf(o).spend_id;
 const forked=()=>{const b=withRow();exOf(b).forks=[{from:dayAt(1),kind:'reset',why:'SYNTHETIC'}];return b;};
 const out={};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=at(forked(),[r],rev);
  const f=EFFECTS.m.foldNativeLoad(a);
  out[rev]={q:f.state.queue.filter(q=>q.native_load_spend===spend).map(q=>[q.newW,q.done]),bad:f.issues.filter(i=>i.lift===ROW&&i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code)};
 }
 const fresh=checkOf(at(forked()),ROW,cs[1]);
 assert.deepEqual(out['fx-revision-2'],out['fx-revision-1'],'R1 and R2 agree (a fresh Fx Row check on the forked plan: '+JSON.stringify(fresh.refusal||fresh.offers.map(x=>decisionOf(x).kind))+')');
 assert.deepEqual(out['fx-revision-1'],{q:[[105,false]],bad:[]},'the Fx Row yes stands');
});
// The same yes, then a later fact CORRECTION on Fx Press's shared session (an edit op
// the yes never covered): the pooled comparator moves again; consent stands (DECISIONS:793).
test('R9-B24c ANOTHER LIFT\'S LATER CORRECTION (DECISIONS:793; spec :154 original cut, :157 only consumed facts dispute): an Fx Press fact corrected after an Fx Row yes never revokes it, R1 and R2 alike',()=>{
 effectsGate();
 const both=(n,rowReps,pressEffort,fix)=>sess2(n,{entries:[{lift:LIFT,reps:TOP,effort:pressEffort,corrected:fix},{lift:ROW,reps:rowReps,effort:e(2,1,1)}].map(x=>({...x,loads:[100,100,100],prescribed:[100,100,100],v1:false}))});
 const cap={[LIFT]:[100,100,100],[ROW]:[100,100,100]};
 const at=(cs,base,extra=[],rev='fx-revision-1')=>{const a=foldArgs(cs,extra,rev,base);for(const c of cs)captureLifts(a.generation,c,cap,{[LIFT]:10,[ROW]:10},true);return a;}; // round 12: FC16 captures (spec R9.1 :127)
 const cs=[both(1,[9,8,8],e(2,1,1)),both(2,TOP,e(0,1,1))];
 const o=checkOf(at(cs,withRow()),ROW,cs[1]).offers.find(x=>decisionOf(x).kind==='earn');assert.ok(o,'control: an earn is offered for Fx Row');
 const r=acceptOp(o,{op_id:'fx-p-1',after:2}),spend=decisionOf(o).spend_id;
 let moved=0;
 for(const [s1,s2] of [[{1:9},null],[null,{3:7}],[{1:4,2:4,3:4},null],[null,{1:4,2:4,3:4}],[{1:14,2:14,3:14},{1:4,2:4,3:4}],[{1:4,2:4,3:4},{1:14,2:14,3:14}]]){
  const fix=[s1,s2],later=[both(1,[9,8,8],e(2,1,1),s1||undefined),both(2,TOP,e(0,1,1),s2||undefined)],out={};
  if(checkOf(at(later,withRow()),ROW,later[1]).status!=='offer')moved++;
  for(const rev of ['fx-revision-1','fx-revision-2']){
   const f=EFFECTS.m.foldNativeLoad(at(later,withRow(),[r],rev));
   out[rev]={q:f.state.queue.filter(q=>q.native_load_spend===spend).map(q=>[q.newW,q.done]),bad:f.issues.filter(i=>i.lift===ROW&&i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code)};
  }
  assert.deepEqual(out['fx-revision-1'],{q:[[105,false]],bad:[]},'the Fx Row yes stands after correcting Fx Press '+JSON.stringify(fix));
  assert.deepEqual(out['fx-revision-2'],out['fx-revision-1'],'R1 and R2 agree after '+JSON.stringify(fix));
 }
 assert.ok(moved>0,'control: at least one correction changes a fresh Fx Row judgement');
});
// Re-validation still runs whenever the original cut IS reproduced: a tampered record
// (its body re-digested by the caller, spec :35 "A caller can hash its own body") is not
// consent, including when the governor holds the lift at that cut (the cut's programme
// digest includes the replayed hold).
test('R9-FORGED ORIGINAL CUT STILL JUDGED (DECISIONS:793; spec :154, N05 forged): an adoption offered at 105 under a governor hold, re-digested at 110 and recorded, folds RECORD_INVALID under R1 and writes nothing',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,loads:100,effort:e(0,1,1)}),C(2,{reps:TOP,loads:105,prescribed:100,effort:e(0,1,1)})];
 const args=foldArgs(cs,[]);assert.equal(exOf(EFFECTS.m.foldNativeLoad(args).state).holdFlag,true,'control: the governor holds the lift at this cut');
 const ev=checkOf(args,LIFT,cs[1]),o=ev.offers&&ev.offers.find(x=>decisionOf(x).target_load.scalar.value===105);assert.ok(o,'control: adopt 105 offered '+JSON.stringify(ev.refusal));
 const honest=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(o,{op_id:'fx-p-1',after:2})]));assert.equal(exOf(honest.state).w,105,'control: the honest record applies');
 const forged=structuredClone(o);forged.body.target_load.scalar.value=110;for(const v of forged.body.target_load.vector)v.value=110;
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(forged,{op_id:'fx-p-1',after:2})]));
 assert.equal(exOf(f.state||{exercises:[{id:LIFT,w:100}]}).w,100,'nothing written');
 // Round 11 (spec R9 :156): DERIVABLE runs before any re-evaluation, so the forged target is named first.
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='target_load'),JSON.stringify(f.issues));
 // A derivable body with a tampered explanation reaches the re-evaluation, which still judges it.
 const told=structuredClone(o);told.reason=told.reason+' (edited)';
 const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(told,{op_id:'fx-p-1',after:2})]));
 assert.equal(exOf(g.state).w,100,'nothing written');
 assert.ok(g.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='issuance'),JSON.stringify(g.issues));
});

// ---------- ROUND 9 (DECISIONS:793 original-cut ruling; Astra L6 B23-B25) ----------
const R9_NAMES=[Array(12).fill('A').join(': '),Array(11).fill('A').join(': '),String.fromCharCode(0x3a9,58,32,0x416,58,32,0x529b),' ',': ','A:B::C: ','','x'.repeat(200)+': y'];
test('R9-B23 NAMES ARE NOT IDENTITY (Astra L6 B23; spec :103, :120 lineage, :154 original cut; DECISIONS:793): a yes issued under a colon-rich, unicode or empty-like name survives a rename under R1 and R2, nothing guessed',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 for(const name of R9_NAMES){
  const base=F0({n:name}),ev=checkOf(foldArgs(cs,[],'fx-revision-1',base),LIFT,cs[1]);
  assert.equal(ev.status,'offer','control: offered under '+JSON.stringify(name)+' '+JSON.stringify(ev.refusal));
  const resp=acceptOp(ev.offers[0],{after:2}),out={};
  for(const rev of ['fx-revision-1','fx-revision-2']){
   const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp],rev,F0({n:'Renamed'})));
   out[rev]={q:f.state.queue.filter(q=>q.native_load_spend).map(q=>[q.done,q.newW]),spent:f.spent.length,bad:f.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code)};
  }
  assert.deepEqual(out['fx-revision-1'],{q:[[false,105]],spent:1,bad:[]},'consent survives the rename of '+JSON.stringify(name));
  assert.deepEqual(out['fx-revision-2'],out['fx-revision-1'],'R1 and R2 agree for '+JSON.stringify(name));
 }
});
test('R9-B24 A LATER WINDOW OR CACHE NEVER REVOKES A YES (Astra L6 B24; spec :154 original cut, :156; DECISIONS:793): after yes Q105 the rep window moves (hi 11, 12, 8) or the cached line changes; the effect, spend and queue stand under R1 and R2',()=>{
 effectsGate();
 const x=landingScenario('fx-revision-1');
 for(const patch of [{hi:11},{hi:12},{hi:8},{last:[9,8,7]},{last:null},{lastMeta:{d:'2026-09-01'}}]){
  const out={};
  for(const rev of ['fx-revision-1','fx-revision-2']){
   const f=EFFECTS.m.foldNativeLoad(foldArgs(x.cs,[x.resp],rev,F0(patch)));
   out[rev]={w:exOf(f.state).w,q:f.state.queue.filter(q=>q.native_load_spend).map(q=>[q.done,q.newW]),effects:f.effects.map(y=>y.kind),spent:f.spent.length,
    bad:f.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code)};
  }
  assert.deepEqual(out['fx-revision-1'],{w:100,q:[[false,105]],effects:['queued'],spent:1,bad:[]},'consent stands after '+JSON.stringify(patch));
  assert.deepEqual(out['fx-revision-2'],out['fx-revision-1'],'R1 and R2 agree after '+JSON.stringify(patch));
 }
});
// The Start capture with its window cell, as engine-capture.cjs writes it (loads and reps per slot).
function captureWindow(gen,c,loads,hi){
 captureOn(gen,c,loads);
 for(const cell of gen.collections.ops[c.start].prescription_capture.slots)cell.reps={state:'specified',display:hi+' reps',source_json:JSON.stringify({value:hi,unit:'rep'})};
 return gen;
}
// The capture records the rep TARGET per set (engine-capture.cjs `reps`), not the window:
// a target above the current window top proves the window moved down since completion.
test('R9-B25 COMPLETED WORK IS NOT PRICED UNDER A NEW WINDOW (Astra L6 B25; spec :126 "load/vector/count/window/technique", :184 PLAN_CHANGED): two tops whose Starts captured target 10, the window then edited down to 9 or 8 -> PLAN_CHANGED [Close Ref] (typed and host v1); the captured window still offers; a raised window never offers old work',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const at=hi=>{const a=foldArgs(cs,[],'fx-revision-1',F0({hi}));for(const c of cs)captureWindow(a.generation,c,[100,100,100],10);return a;};
 // Round 12 (spec R9.1 :127): these are pre-FC16 captures (targets, no window_hi), so even the
 // unchanged window refuses (the legacy-earning cost); the same Starts with FC16 cells offer.
 expectRefusal(checkOf(at(10),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 {const a=foldArgs(cs,[],'fx-revision-1',F0({hi:10}));for(const c of cs)captureReps(a.generation,c,[100,100,100],10,10);assert.equal(checkOf(a,LIFT,cs[1]).status,'offer','control: an FC16 capture at the current window offers');}
 for(const hi of [9,8])expectRefusal(checkOf(at(hi),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 assert.notEqual(checkOf(at(12),LIFT,cs[1]).status,'offer','a raised window never prices the old work');
 const v1=[v1Of(cs[0]),v1Of(cs[1])],a=foldArgs(v1,[],'fx-revision-1',F0({hi:9}));for(const c of v1)captureWindow(a.generation,c,[100,100,100],10);
 expectRefusal(checkOf(a,LIFT,v1[1]),'PLAN_CHANGED',[ref(v1[1].close)]);
 // Step 2 precedes the window reader: a miss under the edited window is PLAN_CHANGED, not WINDOW_NOT_TOP.
 const miss=[cs[0],C(2,{reps:[8,7,6],effort:e(2,1,1)})],b=foldArgs(miss,[],'fx-revision-1',F0({hi:9}));for(const c of miss)captureWindow(b.generation,c,[100,100,100],10);
 {const f=EFFECTS.m.foldNativeLoad(b),bs=EFFECTS.m.basisOf({state:f.state,generation:b.generation,workoutFacts:b.workoutFacts,source:SOURCE,athleteId:ATH,lift:LIFT,spent:f.spent});
  const raw=engineAt(miss[1].date).evaluateNativeLoad(f.state,{lift_lineage_id:LIFT,completion_op_id:miss[1].close,intent:'check',basis:bs});
  assert.equal(raw.refusal&&raw.refusal.code,'NATIVE_LOAD_WINDOW_NOT_TOP','control: FC01 alone reaches the window reader');}
 expectRefusal(checkOf(b,LIFT,miss[1]),'PLAN_CHANGED',[ref(miss[1].close)]);
});

// ---------- ROUND 10 (Astra L7 B26/B27; Claude l7 D-B7-1) ----------
// Astra's executed B26 inputs (native-load-astra-l7-0e4fc74/probes.cjs), verbatim edits: a
// caller-re-digested body (spec :35) with a forged cut must never be applied. Round 10's
// STOP witness; round 11 (spec R9 :155-157 STRUCTURAL CORRESPONDENCE and DERIVABLE) closes it.
test('R10-B26 FORGED CUT IS NEVER CONSENT (Astra L7 B26, Claude l7 D-B7-1; spec :35 "A caller can hash its own body", :60, :103, :120, :154; R9 :155-157): a re-digested 125 with a forged programme/queue digest, trimmed coverage, a later rename, emptied evidence, another lift, a deleted consumed Start, a forged spend or source, or a missing cut folds RECORD_INVALID and never prescribes 125',()=>{
 effectsGate();
 const clone=structuredClone,base=F0(),cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const original=checkOf(foldArgs(cs,[],'fx-revision-1',base),LIFT,cs[1]).offers[0];assert.ok(original,'control offer');
 const heavier=o=>{o.body.target_load.scalar.value=125;o.body.target_load.vector.forEach(v=>v.value=125);o.body.candidate.newW=125;if(o.body.candidate.newWSets)o.body.candidate.newWSets.fill(125);o.reason=o.reason.replaceAll('105 lb','125 lb');};
 const Z='sha256:'+'0'.repeat(64);
 const cases=[
  ['forged-body-only',o=>heavier(o)],
  ['forged-body-programme',o=>{heavier(o);o.body.basis.plan.programme_sha256=Z;}],
  ['forged-body-queue',o=>{heavier(o);o.body.basis.plan.structural_queue_sha256=Z;}],
  ['forged-body-coverage',o=>{heavier(o);o.body.basis.coverage=o.body.basis.coverage.filter(c=>c.op_id!==cs[0].start);}],
  ['forged-body-later-rename',o=>heavier(o),a=>{exOf(a.base).n='Renamed';}],
  ['forged-body-empty-evidence',o=>{heavier(o);o.body.evidence=[];o.body.basis.plan.programme_sha256='bad';}],
  ['forged-other-lift',o=>{heavier(o);o.body.lift_lineage_id=ROW;o.body.evidence=[];o.body.basis.plan.programme_sha256='bad';},a=>a.base.exercises.push({...clone(exOf(a.base)),id:ROW,n:'Fx Row'})],
  ['deleted-consumed-op',()=>{},a=>{delete a.generation.collections.ops[cs[0].start];}],
  ['deleted-fact-forged-evidence',o=>{heavier(o);o.body.evidence.shift();o.body.basis.plan.programme_sha256='bad';},a=>{delete a.generation.collections.ops[cs[0].start];a.workoutFacts.sessions.shift();a.workoutFacts.order.start_ids.shift();}],
  ['forged-spend-tuple',o=>{heavier(o);o.body.spend_id='anything';o.body.basis.plan.programme_sha256='bad';}],
  ['forged-source',o=>{heavier(o);o.body.basis.source={W:999,log_digest:'wrong',selection_id:'wrong'};o.body.basis.plan.programme_sha256='bad';}],
  ['forged-body-missing-cut',o=>{heavier(o);o.body.basis.order.start_ids=['absent-start'];o.body.basis.order.frontier=1;o.body.basis.plan.programme_sha256='bad';}],
 ];
 const bad=[];
 for(const [name,edit,alter] of cases)for(const rev of ['fx-revision-1','fx-revision-2']){
  const o=clone(original);edit(o);const a=foldArgs(cs,[acceptOp(o,{after:2})],rev,clone(base));if(alter)alter(a);
  const f=EFFECTS.m.foldNativeLoad(a),queued=f.state?f.state.queue.filter(q=>q.native_load_spend).map(q=>q.newW):[],w=f.state?f.state.exercises.map(x=>x.w):[];
  if(queued.includes(125)||w.includes(125)||!f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'))bad.push({name,rev,queued,w,issues:f.issues.map(i=>i.code)});
 }
 assert.deepEqual(bad,[],'every forged cut is refused by name and never prescribes 125');
});
test('R10-B26b FORGED ADOPTION CUT (Astra L7 B26 on R9-FORGED): an adoption observed at 105, re-digested at 110 with a forged programme digest, folds RECORD_INVALID and writes nothing',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,loads:100,effort:e(0,1,1)}),C(2,{reps:TOP,loads:105,prescribed:100,effort:e(0,1,1)})];
 const o=structuredClone(checkOf(foldArgs(cs,[]),LIFT,cs[1]).offers.find(x=>decisionOf(x).target_load.scalar.value===105));
 o.body.target_load.scalar.value=110;for(const v of o.body.target_load.vector)v.value=110;o.body.basis.plan.programme_sha256='sha256:'+'0'.repeat(64);
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(o,{op_id:'fx-p-1',after:2})]));
 assert.equal(exOf(f.state).w,100,'nothing written');assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),JSON.stringify(f.issues));
});

// ---------- ROUND 11 (spec R9 draft sha256 88371bfd...: N25 FORGED-RECORD, N26 WINDOW-CAPTURE) ----------
test('N25 FORGED-RECORD (spec R9 :155 S1-S8, :156 DERIVABLE; I1/I2/I4): each of Astra L7\'s twelve forged records and the forged adoption, under R1 and R2 -> RECORD_INVALID for fx-press by the named first failing field, refs [its response Ref], nothing above the engine\'s rung; the genuine record with a later rename still applies',()=>{
 effectsGate();
 const clone=structuredClone,base=F0(),cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const original=checkOf(foldArgs(cs,[],'fx-revision-1',base),LIFT,cs[1]).offers[0];assert.equal(decisionOf(original).candidate.newW,105,'control: ORD 105');
 const heavier=o=>{o.body.target_load.scalar.value=125;o.body.target_load.vector.forEach(v=>v.value=125);o.body.candidate.newW=125;if(o.body.candidate.newWSets)o.body.candidate.newWSets.fill(125);o.reason=o.reason.replaceAll('105 lb','125 lb');};
 const Z='sha256:'+'0'.repeat(64);
 const cases=[
  ['1 body only','target_load',o=>heavier(o)],
  ['2 programme zeroed','target_load',o=>{heavier(o);o.body.basis.plan.programme_sha256=Z;}],
  ['3 queue zeroed','target_load',o=>{heavier(o);o.body.basis.plan.structural_queue_sha256=Z;}],
  ['4 coverage without C1 Start','basis.coverage',o=>{heavier(o);o.body.basis.coverage=o.body.basis.coverage.filter(c=>c.op_id!==cs[0].start);}],
  ['5 body plus a later rename','target_load',o=>heavier(o),a=>{exOf(a.base).n='Renamed';}],
  ['6 evidence emptied','evidence',o=>{heavier(o);o.body.evidence=[];o.body.basis.plan.programme_sha256='bad';}],
  ['7 lift set to fx-row','lift_lineage_id',o=>{heavier(o);o.body.lift_lineage_id=ROW;o.body.evidence=[];o.body.basis.plan.programme_sha256='bad';},a=>a.base.exercises.push({...clone(exOf(a.base)),id:ROW,n:'Fx Row'})],
  ['8 C1 Start deleted','consumes',()=>{},a=>{delete a.generation.collections.ops[cs[0].start];}],
  ['9 C1 Start, evidence and facts deleted','consumes',o=>{heavier(o);o.body.evidence.shift();o.body.basis.plan.programme_sha256='bad';},a=>{delete a.generation.collections.ops[cs[0].start];a.workoutFacts.sessions.shift();a.workoutFacts.order.start_ids.shift();}],
  ['10 spend_id anything','spend_id',o=>{heavier(o);o.body.spend_id='anything';o.body.basis.plan.programme_sha256='bad';}],
  ['11 source forged','basis.source',o=>{heavier(o);o.body.basis.source={W:999,log_digest:'wrong',selection_id:'wrong'};o.body.basis.plan.programme_sha256='bad';}],
  ['12 order names an absent Start','basis.order',o=>{heavier(o);o.body.basis.order.start_ids=['absent-start'];o.body.basis.order.frontier=1;o.body.basis.plan.programme_sha256='bad';}],
 ];
 const out=[],want=[];
 for(const [name,field,edit,alter] of cases)for(const rev of ['fx-revision-1','fx-revision-2']){
  const o=clone(original);edit(o);const a=foldArgs(cs,[acceptOp(o,{after:2})],rev,clone(base));if(alter)alter(a);
  const f=EFFECTS.m.foldNativeLoad(a),bad=f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');
  const heavy=(f.state?f.state.queue:[]).some(q=>q.newW>105)||(f.state?f.state.exercises:[]).some(x=>x.w>100);
  out.push({name,rev,field:bad.length?bad[0].field:null,lift:bad.length?bad[0].lift:null,refs:bad.length?bad[0].refs:null,heavy});
  want.push({name,rev,field,lift:LIFT,refs:[ref('fx-resp-1')],heavy:false});
 }
 const acs=[C(1,{reps:TOP,loads:100,effort:e(0,1,1)}),C(2,{reps:TOP,loads:105,prescribed:100,effort:e(0,1,1)})];
 const ao=structuredClone(checkOf(foldArgs(acs,[]),LIFT,acs[1]).offers.find(x=>decisionOf(x).target_load.scalar.value===105));
 ao.body.target_load.scalar.value=110;for(const v of ao.body.target_load.vector)v.value=110;ao.body.basis.plan.programme_sha256='sha256:'+'0'.repeat(64);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(acs,[acceptOp(ao,{after:2})],rev)),bad=f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');
  out.push({name:'adoption 110',rev,field:bad.length?bad[0].field:null,lift:bad.length?bad[0].lift:null,refs:bad.length?bad[0].refs:null,heavy:exOf(f.state).w>100});
  want.push({name:'adoption 110',rev,field:'target_load',lift:LIFT,refs:[ref('fx-resp-1')],heavy:false});
 }
 assert.deepEqual(out,want,'first failing field per case, never a heavier prescription');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs(cs,[acceptOp(clone(original),{after:2})],rev,F0({n:'Renamed'})),f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual(f.state.queue.filter(q=>q.native_load_spend).map(q=>[q.newW,q.done]),[[105,false]],'control: the genuine record applies after a rename ('+rev+')');
  assert.ok(!f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),JSON.stringify(f.issues));
 }
});
// Round 11 walk counterexample seed 20261111: a forged record whose base the plan later
// moved was held as unprovable-order history (EFFECT_CONFLICT load_basis, spend kept) before
// S1-S8 ran, so a compensation could "cancel" it and the plan's return dropped that proof.
test('R11-FORGED-HELD FORGED RECORD UNDER A MOVED BASE (spec R9 :155-156 before R8 :156 unprovable order; property seed 20261111): with the plan moved to 105 after the forgery, each forged record still folds RECORD_INVALID by its field, under R1 and R2, and never enters the spent history',()=>{
 effectsGate();
 const clone=structuredClone,cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const original=checkOf(foldArgs(cs,[],'fx-revision-1',F0()),LIFT,cs[1]).offers[0];assert.equal(decisionOf(original).candidate.newW,105,'control: ORD 105');
 const heavier=o=>{o.body.target_load.scalar.value=125;o.body.target_load.vector.forEach(v=>v.value=125);o.body.candidate.newW=125;if(o.body.candidate.newWSets)o.body.candidate.newWSets.fill(125);o.reason=o.reason.replaceAll('105 lb','125 lb');};
 const cases=[
  ['body only','target_load',o=>heavier(o)],
  ['coverage without C1 Start','basis.coverage',o=>{heavier(o);o.body.basis.coverage=o.body.basis.coverage.filter(c=>c.op_id!==cs[0].start);}],
  ['evidence emptied','evidence',o=>{heavier(o);o.body.evidence=[];o.body.basis.plan.programme_sha256='bad';}],
  ['spend_id anything','spend_id',o=>{heavier(o);o.body.spend_id='anything';o.body.basis.plan.programme_sha256='bad';}],
  ['source forged','basis.source',o=>{heavier(o);o.body.basis.source={W:999,log_digest:'wrong',selection_id:'wrong'};o.body.basis.plan.programme_sha256='bad';}],
  ['order names an absent Start','basis.order',o=>{heavier(o);o.body.basis.order.start_ids=['absent-start'];o.body.basis.order.frontier=1;o.body.basis.plan.programme_sha256='bad';}],
 ];
 const out=[],want=[];
 for(const [name,field,edit] of cases)for(const rev of ['fx-revision-1','fx-revision-2']){
  const o=clone(original);edit(o);const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(o,{after:2})],rev,F0({w:105})));
  const bad=f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');
  out.push({name,rev,field:bad.length?bad[0].field:null,refs:bad.length?bad[0].refs:null,spent:f.spent.map(x=>x.spend_id),held:f.issues.some(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT')});
  want.push({name,rev,field,refs:[ref('fx-resp-1')],spent:[],held:false});
 }
 assert.deepEqual(out,want,'a forged record is refused by its field before any unprovable-order hold');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(clone(original),{after:2})],rev,F0({w:105})));
  assert.deepEqual(f.issues.map(i=>[i.code,i.field]),[['NATIVE_LOAD_EFFECT_CONFLICT','load_basis']],'control: the genuine record under the moved base is still held by R8 :156 ('+rev+')');
  assert.equal(f.spent.length,1,'control: its spend is kept');
 }
});
// Round 11: the S4 value clause and the S8 anchors each have a forgery only they refuse
// (the other checks and DERIVABLE pass on it).
test('R11-FORGED-EVIDENCE-VALUE (spec R9 :155 S4 "its current equals the slot\'s value after exactly those edits"): the genuine 105 earn body recorded against a C2 whose authentic sets missed [9,8,8] (no edit op) -> RECORD_INVALID field evidence under R1 and R2, nothing queued',()=>{
 effectsGate();
 const good=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],miss=[good[0],C(2,{reps:[9,8,8],effort:e(2,1,1)})];
 const o=checkOf(foldArgs(good,[]),LIFT,good[1]).offers[0];assert.equal(decisionOf(o).candidate.newW,105,'control: ORD 105');
 assert.notEqual(checkOf(foldArgs(miss,[]),LIFT,miss[1]).status,'offer','control: the authentic C2 earns nothing');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(miss,[acceptOp(o,{after:2})],rev)),bad=f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');
  assert.deepEqual(bad.map(i=>[i.field,i.lift,i.refs]),[['evidence',LIFT,[ref('fx-resp-1')]]],rev+' '+JSON.stringify(f.issues));
  assert.deepEqual(f.state.queue.filter(q=>q.native_load_spend),[],'nothing queued ('+rev+')');assert.deepEqual(f.spent,[]);
 }
});
test('R11-FORGED-ANCHOR (spec R9 :155 S8): a self-consistent forged base (base_load, its FieldImage and load_basis all 105, target the engine\'s 110) and a forged earn on a C2 lifted at 95 under a 100 capture (evidence rewritten to the authentic 95) -> RECORD_INVALID field base_load under R1 and R2, nothing queued or held',()=>{
 effectsGate();
 const clone=structuredClone,good=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const o=checkOf(foldArgs(good,[]),LIFT,good[1]).offers[0];assert.equal(decisionOf(o).candidate.newW,105,'control: ORD 105');
 const Z='sha256:'+'0'.repeat(64);
 const base=clone(o);{const b=base.body;b.base_load.scalar.value=105;b.base_load.vector.forEach(v=>v.value=105);b.base_load.fields.w.value=105;b.basis.load_basis.w.value=105;
  b.target_load.scalar.value=110;b.target_load.vector.forEach(v=>v.value=110);b.candidate.newW=110;b.basis.plan.programme_sha256=Z;base.reason=base.reason.replaceAll('105 lb','110 lb');}
 const light=[good[0],C(2,{reps:TOP,loads:95,effort:e(2,1,1)})],act=clone(o);
 for(const item of act.body.evidence)if(item.close.op_id===light[1].close)for(const s of item.sets)if(s.current)s.current.load={value:95,unit:'lb'};
 act.body.basis.plan.programme_sha256=Z;
 for(const [name,rec,comps] of [['forged base',base,good],['lifted light',act,light]])for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(comps,[acceptOp(rec,{after:2})],rev)),bad=f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');
  assert.deepEqual(f.issues.map(i=>[i.code,i.field,i.lift]),[['NATIVE_LOAD_RECORD_INVALID','base_load',LIFT]],name+' '+rev);
  assert.deepEqual(bad[0].refs,[ref('fx-resp-1')]);assert.deepEqual(f.state.queue.filter(q=>q.native_load_spend),[],name+' nothing queued ('+rev+')');assert.deepEqual(f.spent,[]);
 }
});
// Round 11 mutants R11-S2 and R11-derivable-base: a WELL-FORMED spend_id that is not the
// body's canonical one (N25's 'anything' is caught by shape alone), and a load_basis.w
// above the anchored base_load (S8 anchors base_load; only DERIVABLE ties load_basis to it).
test('R11-FORGED-CANONICAL (spec R9 :155 S2 canonical spend, :156 DERIVABLE load_basis.w = base_load): a well-formed spend_id naming only C2, and a load_basis.w of 105 over an authentic base_load of 100 with the engine\'s 110 from it -> RECORD_INVALID fields spend_id and base_load under R1 and R2, nothing queued',()=>{
 effectsGate();
 const clone=structuredClone,cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const o=checkOf(foldArgs(cs,[]),LIFT,cs[1]).offers[0];assert.equal(decisionOf(o).candidate.newW,105,'control: ORD 105');
 const Z='sha256:'+'0'.repeat(64);
 const spend=clone(o);{const b=spend.body,d=JSON.parse(b.spend_id);assert.equal(d.length,5);d[4]=[b.consumes.at(-1)];b.spend_id=JSON.stringify(d);b.basis.plan.programme_sha256=Z;}
 const lb5=clone(o);{const b=lb5.body;b.basis.load_basis.w.value=105;b.target_load.scalar.value=110;b.target_load.vector.forEach(v=>v.value=110);b.candidate.newW=110;
  b.basis.plan.programme_sha256=Z;lb5.reason=lb5.reason.replaceAll('105 lb','110 lb');}
 const out=[];
 for(const [name,rec] of [['spend_id',spend],['base_load',lb5]])for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(rec,{after:2})],rev));
  out.push({name,rev,issues:f.issues.map(i=>[i.code,i.field,i.lift]),queued:f.state.queue.filter(q=>q.native_load_spend).map(q=>q.newW),spent:f.spent.length});
 }
 assert.deepEqual(out,out.map(x=>({...x,issues:[['NATIVE_LOAD_RECORD_INVALID',x.name,LIFT]],queued:[],spent:0})));
});
// Round 11 walk counterexample seed 1003155 (I3 under two devices): one spend recorded with
// two bodies naming different lifts (a forged lift) took the conflict's lift from whichever
// op the log listed first, so the delivery order chose which lift was held.
test('R11-CONFLICT-LIFTS SAME SPEND, BODIES NAMING DIFFERENT LIFTS (spec :150 incompatible accepts refused together, :156 order-free; property seed 1003155): the genuine fx-press record and a copy naming fx-row fold to the same issues in either log order, under R1 and R2, holding BOTH named lifts; nothing applied',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const o=checkOf(foldArgs(cs,[],'fx-revision-1',withRow()),LIFT,cs[1]).offers[0];assert.equal(decisionOf(o).candidate.newW,105,'control: ORD 105');
 const forged=structuredClone(o);forged.body.lift_lineage_id=ROW;
 const out=[];
 for(const rev of ['fx-revision-1','fx-revision-2'])for(const order of [['fx-p-1','fx-p-2'],['fx-p-2','fx-p-1']]){
  const recs={'fx-p-1':acceptOp(forged,{op_id:'fx-p-1',after:2}),'fx-p-2':acceptOp(o,{op_id:'fx-p-2',after:2})};
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,order.map(id=>recs[id]),rev,withRow()));
  out.push({rev,order:order.join(),issues:f.issues.map(i=>[i.code,i.lift,i.refs.map(r=>r.op_id)]).sort(),queue:f.state.queue.filter(q=>q.native_load_spend).length,spent:f.spent.length});
 }
 const want=[['NATIVE_LOAD_EFFECT_CONFLICT',LIFT,['fx-p-1','fx-p-2']],['NATIVE_LOAD_EFFECT_CONFLICT',ROW,['fx-p-1','fx-p-2']]];
 assert.deepEqual(out,out.map(x=>({...x,issues:want,queue:0,spent:0})),'order-free, both lifts held, nothing applied');
});
// ---------- ROUND 12 (spec R9.1 df90e70f: :155 compensation identity, :156 DECODE FIRST and RESTORE/RETIRE, N24, N25 v1 control) ----------
test('N24 ORDER-UNPROVABLE R9.1 (spec :156 DERIVABLE RETIRE; :155 compensation identity): the undo of the conflicted effect is retire-only under R1 and R2 and both delivery orders; its display target is never compared (a retire record showing 999 still retires with no w write); every replay keeps the tombstone (no second undo)',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id,moved=()=>F0({w:102.5});
 const undo=checkOf(foldArgs(cs,[resp],'fx-revision-1',moved()),LIFT,cs[1],{compensate:spend});assert.equal(undo.status,'offer',JSON.stringify(undo.refusal));
 const odd=structuredClone(undo.offers[0]);odd.body.target_load={scalar:lb(999),vector:[lb(999),lb(999),lb(999)]};
 const out=[];
 for(const [name,rec] of [['genuine',undo.offers[0]],['display 999',odd]])for(const rev of ['fx-revision-1','fx-revision-2'])for(const first of [false,true]){
  const args=foldArgs(cs,[resp,acceptOp(rec,{op_id:'fx-resp-2',after:2})],rev,moved());if(first)args.generation.collections.ops['fx-resp-1'].device_seq=0;
  const g=EFFECTS.m.foldNativeLoad(args),q=g.state.queue.find(x=>x.native_load_spend===spend),again=checkOf(args,LIFT,cs[1],{compensate:spend});
  out.push({name,rev,first,q:[q.done,q.state],w:exOf(g.state).w,cancelled:!!g.spent.find(x=>x.spend_id===spend).cancelled_by,issues:g.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code),again:again.status==='refused'?again.refusal.code:again.status});
 }
 // Round 13 (spec R9.2 :156, classified by the record's OWN SHAPE): a retire shows its own
 // base; a record showing 999 is RESTORE-shaped, and a restore must name an adoption, so the
 // 999 record of this EARN is RECORD_INVALID target_load and retires nothing (round 12 let it
 // retire as display-only).
 assert.deepEqual(out,out.map(x=>x.name==='genuine'?{...x,q:[true,'COMPENSATED'],w:102.5,cancelled:true,issues:[],again:'NATIVE_LOAD_COMPENSATION_DESCENDANTS'}
  :{...x,q:[false,'DEBUT'],w:102.5,cancelled:false,issues:['NATIVE_LOAD_EFFECT_CONFLICT','NATIVE_LOAD_RECORD_INVALID'],again:x.again}));
});
test('R12-RESTORE (spec R9.1 :156 RESTORE, builder round-11 deviation closed): the undo of an APPLIED adoption must restore exactly the adoption\'s recorded base (100); a record showing 95 folds RECORD_INVALID target_load under R1 and R2 and w stays 105; the genuine undo restores 100',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)})];
 const o=checkOf(foldArgs(cs,[]),LIFT,cs[0]).offers.find(x=>decisionOf(x).kind==='adopt-observed');assert.ok(o,'control: adopt-observed 105');
 const yes=acceptOp(o,{op_id:'fx-resp-1',after:1});
 assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs(cs,[yes])).state).w,105,'control: adopted');
 const undo=checkOf(foldArgs(cs,[yes]),LIFT,cs[0],{compensate:decisionOf(o).spend_id});assert.equal(undo.status,'offer',JSON.stringify(undo.refusal));
 assert.deepEqual(decisionOf(undo.offers[0]).target_load.scalar,lb(100),'control: the offered undo restores 100');
 const bad=structuredClone(undo.offers[0]);bad.body.target_load={scalar:lb(95),vector:[lb(95),lb(95),lb(95)]};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[yes,acceptOp(bad,{op_id:'fx-resp-2',after:1})],rev));
  assert.deepEqual(g.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>[i.field,i.refs]),[['target_load',[ref('fx-resp-2')]]],rev+' '+JSON.stringify(g.issues));
  assert.equal(exOf(g.state).w,105,'no restore from a mismatched target ('+rev+')');
  const h=EFFECTS.m.foldNativeLoad(foldArgs(cs,[yes,acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:1})],rev));
  assert.equal(exOf(h.state).w,100,'the genuine undo restores ('+rev+')');assert.ok(!h.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),JSON.stringify(h.issues));
 }
});
test('R12-COMPENSATION-IDENTITY (spec R9.1 :155 for kind compensate): a non-reproduced undo record naming another lift, carrying consumes, or carrying evidence folds RECORD_INVALID by lift_lineage_id, consumes, evidence; nothing retired',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const undo=checkOf(foldArgs(cs,[resp],'fx-revision-1',withRow()),LIFT,cs[1],{compensate:spend}).offers[0];assert.ok(undo,'control undo');
 const cases=[['lift_lineage_id',b=>{b.lift_lineage_id=ROW;}],['consumes',b=>{b.consumes=[JSON.stringify(['fx-start-absent',LIFT,'fx-close-absent'])];}],['evidence',b=>{b.evidence=structuredClone(offer.body.evidence);}]];
 for(const [field,edit] of cases){
  const r=structuredClone(undo);edit(r.body);
  const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,acceptOp(r,{op_id:'fx-resp-2',after:2})],'fx-revision-2',withRow()));
  assert.deepEqual(g.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>[i.field,i.refs]),[[field,[ref('fx-resp-2')]]],field+' '+JSON.stringify(g.issues));
  assert.ok(!g.spent.find(x=>x.spend_id===spend).cancelled_by,'nothing retired ('+field+')');
 }
 // Tombstone (spec R9.1 :156 "no later compensation of it"): a second undo record of an
 // already cancelled spend whose cut still reproduces (a retire of an unapplied spend
 // behind a hold writes nothing, N27), re-evaluated under R1, is RECORD_INVALID compensates.
 const bad=acceptOp(earlyCutForgery(cs,offer),{op_id:'fx-bad-1',after:1});
 const held=checkOf(foldArgs(cs,[bad,resp],'fx-revision-1',withRow()),LIFT,cs[1],{compensate:spend});assert.equal(held.status,'offer',JSON.stringify(held.refusal));
 const u1=acceptOp(held.offers[0],{op_id:'fx-resp-2',after:2}),second=structuredClone(held.offers[0]);second.body.spend_id=JSON.stringify(['native-load-compensation',LIFT,spend,'again']);
 const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[bad,resp,u1,acceptOp(second,{op_id:'fx-resp-3',after:2})],'fx-revision-1',withRow()));
 assert.equal(g.spent.find(x=>x.spend_id===spend).cancelled_by,decisionOf(held.offers[0]).spend_id,'the first undo stands');
 assert.deepEqual(g.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>[i.field,i.refs.map(r=>r.op_id)]),[['consumes',['fx-bad-1']],['compensates',['fx-resp-3']]],JSON.stringify(g.issues));
});
test('R12-DECODE (spec R9.1 :156 DECODE FIRST, B-R9-1): dec() is never null for an ABSENT member: a baseline record whose load_basis.w and base_load.fields.w are both ABSENT folds RECORD_INVALID base_load under R1 and R2; a base_load.vector unlike dec(w) repeated folds base_load; the genuine v1-shape record (presence wrappers, typed Loads) decodes to r1 = 105 and applies',()=>{
 effectsGate();
 const bs=[C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)})];
 const bo=checkOf(foldArgs(bs,[],'fx-revision-1',F0({w:null})),LIFT,bs[0]).offers[0];assert.equal(decisionOf(bo).kind,'adopt-baseline');
 assert.deepEqual([bo.body.basis.load_basis.w,bo.body.base_load.fields.w],[{present:true,value:null},{present:true,value:null}],'control: w present, null');
 const absent=structuredClone(bo);absent.body.basis.load_basis.w={present:false,value:null};absent.body.base_load.fields.w={present:false,value:null};
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],eo=checkOf(foldArgs(cs,[]),LIFT,cs[1]).offers[0];
 assert.deepEqual([eo.body.basis.load_basis.w,eo.body.base_load.scalar],[{present:true,value:100},lb(100)],'control: v1 shape, presence wrapper and typed Load');
 const vec=structuredClone(eo);vec.body.base_load.vector=[lb(100),lb(100),lb(95)];
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=EFFECTS.m.foldNativeLoad(foldArgs(bs,[acceptOp(absent,{after:1})],rev,F0({w:null})));
  // Round 13 (spec R9.2 :156 c3): a baseline record may carry w ABSENT ("a genuine baseline
  // record of either shape passes"), so this is no longer RECORD_INVALID; against this
  // present-null plan its recorded image differs, which is the :160 unprovable-order hold.
  assert.deepEqual(a.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),[],'ABSENT w decodes ('+rev+') '+JSON.stringify(a.issues));
  assert.deepEqual(a.issues.map(i=>[i.code,i.field]).filter(x=>x[0]==='NATIVE_LOAD_EFFECT_CONFLICT'),[['NATIVE_LOAD_EFFECT_CONFLICT','load_basis']],'held, not applied ('+rev+')');
  assert.equal(exOf(a.state).w,null);
  const v=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(vec,{after:2})],rev));
  assert.deepEqual(v.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['base_load'],'vector ('+rev+') '+JSON.stringify(v.issues));
  const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(eo,{after:2})],rev,F0({n:'Renamed'})));
  assert.deepEqual(g.state.queue.filter(q=>q.native_load_spend).map(q=>q.newW),[105],'the genuine v1 record decodes to r1 = 105 ('+rev+')');
 }
});
function earlyCutForgery(cs,offer){
 // A record claiming the earlier cut C1 for fx-press, consuming work that does not exist.
 const f=structuredClone(offer),b=f.body,root=JSON.stringify(['fx-start-absent',LIFT,'fx-close-absent']),d=JSON.parse(b.spend_id);
 b.consumes=[root];d[4]=[root];b.spend_id=JSON.stringify(d);b.evidence=[];
 b.basis.order={...b.basis.order,start_ids:[cs[0].start],frontier:cs[0].ops.length};
 return f;
}
// N27 NO-TRAP (spec R9.2 :158, D1 :311; DECISIONS:794 via the spec). A hold refuses EARNS
// only; a held lift projects w/wSets null (baseline ask), its held native entries are hidden
// from that projection, and a later adoption of the athlete's actual loads, on a completion
// ordered after every holding record, supersedes the holds (w = the adopted loads, held
// native entries retired, spends kept, holding records stay recorded). Undo stays where the
// guards allow it (COMPENSATION_DESCENDANTS unchanged).
const liveQ=(f,spend)=>f.state.queue.filter(q=>q.native_load_spend===spend).map(q=>[q.done,q.state]);
test('N27 (a) NO-TRAP (spec R9.2 :158, D1 :311 (a)): N02c yes (Q105); a record claiming the earlier cut C1, written after the yes, holds fx-press; the earn check refuses by that hold, refs [its Ref]; Undo of the genuine spend retires Q105 with no w write; the held projection shows fx-press w/wSets null; C3 at 100 offers [adopt-baseline 100]; its yes -> w 100, holds superseded, spends kept; C4, C5 tops at 100 then offer ORD 105; R1 and R2',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const bad=acceptOp(earlyCutForgery(cs,offer),{op_id:'fx-bad-1',after:2});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const args=foldArgs(cs,[resp,bad],rev),f=EFFECTS.m.foldNativeLoad(args);
  assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>[i.lift,i.refs.map(r=>r.op_id)]),[[LIFT,['fx-bad-1']]],rev+' '+JSON.stringify(f.issues));
  assert.deepEqual(liveQ(f,spend),[[false,'DEBUT']],'Q105 stands: the yes precedes the invalid record in the log ('+rev+')');
  // R9.3 :162 (G3): C2 was closed before the hold on a numeric card: PLAN_CHANGED [its Close Ref].
  expectRefusal(checkOf(args,LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
  const shown=EFFECTS.m.heldProjection(f).state,px=shown.exercises.find(x=>x.id===LIFT);
  assert.deepEqual([px.w,px.wSets],[null,null],'held: w and wSets project null (the baseline ask) ('+rev+')');
  assert.deepEqual(shown.queue.filter(q=>q.exId===LIFT&&q.native_load_spend),[],'held native entries are not prescribed');
  assert.equal(exOf(f.state).w,100,'the projection is a projection: the fold state keeps w');
  // Exit (a): Undo where eligible.
  const undo=checkOf(args,LIFT,cs[1],{compensate:spend});assert.equal(undo.status,'offer',JSON.stringify(undo.refusal));
  const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,bad,acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:2})],rev));
  assert.deepEqual(liveQ(g,spend),[[true,'COMPENSATED']],'Q105 retired ('+rev+')');assert.equal(exOf(g.state).w,100,'no w write');
  // Exit (b): C3 trained on the baseline ask at 100.
  const c3=C(3,{date:'2026-10-12',reps:TOP,loads:100,prescribed:null,effort:e(2,1,1)}),three=[...cs,c3];
  const a3=foldArgs(three,[resp,bad],rev),ev3=checkOf(a3,LIFT,c3);
  assert.equal(ev3.status,'offer',JSON.stringify(ev3.refusal));
  assert.deepEqual(ev3.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',100]],rev);
  const yes=acceptOp(ev3.offers[0],{op_id:'fx-resp-3',after:3});
  const h=EFFECTS.m.foldNativeLoad(foldArgs(three,[resp,bad,yes],rev));
  assert.equal(exOf(h.state).w,100,'w = the adopted loads ('+rev+')');
  assert.deepEqual(h.state.queue.filter(q=>q.native_load_spend===spend).map(q=>q.done),[true],'held native entry retired');
  assert.deepEqual(h.spent.map(x=>x.spend_id).sort(),[spend,decisionOf(ev3.offers[0]).spend_id].sort(),'spends kept');
  const holds=h.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');
  assert.deepEqual(holds.map(i=>[i.refs.map(r=>r.op_id),i.superseded_by]),[[['fx-bad-1'],decisionOf(ev3.offers[0]).spend_id]],'the holding record stays recorded, superseded');
  const c4=C(4,{date:'2026-10-13',reps:TOP,loads:100,prescribed:100,effort:e(2,1,1)}),c5=C(5,{date:'2026-10-14',reps:TOP,loads:100,prescribed:100,effort:e(2,1,1)});
  const ev5=checkOf(foldArgs([...three,c4,c5],[resp,bad,yes],rev),LIFT,c5);
  assert.equal(ev5.status,'offer',JSON.stringify(ev5.refusal));assert.equal(decisionOf(ev5.offers.find(o=>decisionOf(o).kind==='earn')).candidate.newW,105,'C4, C5 tops then earn normally ('+rev+')');
 }
});
test('N27 (b) NO-TRAP descendant variant (spec R9.2 :158, D1 :311 (b)): C1 at 105 adopted (w 105, applied); C2 trained on the 105 card; C1 corrected -> BASIS_REPAIR_REQUIRED; Undo refuses COMPENSATION_DESCENDANTS (guard unchanged); the held projection is the baseline ask; C3 at 105 offers [adopt-baseline 105]; its yes -> w 105, the dispute superseded, history kept; R1 and R2',()=>{
 effectsGate();
 const c1=C(1,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)}),o=checkOf(foldArgs([c1],[]),LIFT,c1).offers.find(x=>decisionOf(x).kind==='adopt-observed');
 assert.ok(o,'control: adopt-observed 105');const yes=acceptOp(o,{op_id:'fx-resp-1',after:1}),spend=decisionOf(o).spend_id;
 const c1x=C(1,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1),corrected:{3:7}}),c2=C(2,{reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const args=foldArgs([c1x,c2],[yes],rev),f=EFFECTS.m.foldNativeLoad(args);
  assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED').map(i=>i.refs.map(r=>r.op_id)),[['fx-resp-1']],rev+' '+JSON.stringify(f.issues));
  assert.equal(exOf(f.state).w,105,'the disputed adoption keeps its effect');
  const undo=checkOf(args,LIFT,c2,{compensate:spend});expectRefusal(undo,'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
  const px=EFFECTS.m.heldProjection(f).state.exercises.find(x=>x.id===LIFT);assert.deepEqual([px.w,px.wSets],[null,null],'baseline ask ('+rev+')');
  const c3=C(3,{reps:TOP,loads:105,prescribed:null,effort:e(2,1,1)}),three=[c1x,c2,c3];
  const ev3=checkOf(foldArgs(three,[yes],rev),LIFT,c3);assert.equal(ev3.status,'offer',JSON.stringify(ev3.refusal));
  assert.deepEqual(ev3.offers.map(x=>[decisionOf(x).kind,decisionOf(x).target_load.scalar.value]),[['adopt-baseline',105]],rev);
  const y3=acceptOp(ev3.offers[0],{op_id:'fx-resp-3',after:3}),h=EFFECTS.m.foldNativeLoad(foldArgs(three,[yes,y3],rev));
  assert.equal(exOf(h.state).w,105,'w 105 ('+rev+')');
  assert.deepEqual(h.issues.filter(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED').map(i=>i.superseded_by),[decisionOf(ev3.offers[0]).spend_id],'the dispute is superseded, kept as history');
  assert.deepEqual(h.spent.map(x=>x.spend_id).sort(),[spend,decisionOf(ev3.offers[0]).spend_id].sort());
  assert.equal(EFFECTS.m.heldProjection(h).state.exercises.find(x=>x.id===LIFT).w,105,'no longer held');
 }
});
test('N27 held lift refuses EARNS only (spec R9.2 :158): on a held lift, a completion closed before the holding record on a numeric card refuses PLAN_CHANGED (R9.3 :162), an earn-shaped completion after it is refused by the hold on the real plan, and TARGET_QUEUED on the held lift never blocks the adoption',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1');
 const bad=acceptOp(earlyCutForgery(cs,offer),{op_id:'fx-bad-1',after:2});
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:100,prescribed:null,effort:e(2,1,1)});
 const args=foldArgs([...cs,c3],[resp,bad]);
 assert.ok(EFFECTS.m.foldNativeLoad(args).state.queue.some(q=>q.native_load_spend&&!q.done),'control: Q105 queued, which would refuse TARGET_QUEUED on the real plan');
 // R9.3 :162 (G3): a completion closed before the hold on a numeric card refuses PLAN_CHANGED.
 expectRefusal(checkOf(args,LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 assert.deepEqual(checkOf(args,LIFT,c3).offers.map(o=>decisionOf(o).kind),['adopt-baseline'],'TARGET_QUEUED blocks earns only');
 const c3e=C(3,{date:'2026-10-12',reps:TOP,loads:100,prescribed:100,effort:e(2,1,1)});
 expectRefusal(checkOf(foldArgs([...cs,c3e],[resp,bad]),LIFT,c3e),'RECORD_INVALID',[ref('fx-bad-1')]);
});
// Round 14 (spec R9.3 :158-163, D1 :316 (c)-(e)).
const pressRow=(n,press,row={})=>sess2(n,{entries:[{lift:LIFT,reps:TOP,effort:e(2,1,1),loads:[100,100,100],prescribed:[100,100,100],...press},
 {lift:ROW,reps:TOP,effort:e(2,1,1),loads:[100,100,100],prescribed:[100,100,100],...row}]});
test('N27 (c) B-R9-6 UNLANDED CAPTURED DESCENDANT, SECOND LIFT, COLD REPLAY (spec R9.3 :159-161, D1 :316 (c)): Q105 accepted at base 100; C3 captured Q105 but performed 100 (no landing); C1 corrected -> BASIS_REPAIR_REQUIRED; Undo refuses COMPENSATION_DESCENDANTS; the next card: fx-row normal, fx-press the baseline ask (w null, isDebutNow false), Q hidden; cold replay identical; C4 at 100 -> [adopt-baseline 100]; yes -> w 100, Q done/SUPERSEDED, spend kept; R1 and R2',()=>{
 effectsGate();
 const base=()=>withRow(),c1=pressRow(1),c2=pressRow(2);
 const ev=checkOf(foldArgs([c1,c2],[],'fx-revision-1',base()),LIFT,c2);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
 const o=ev.offers.find(x=>decisionOf(x).kind==='earn');assert.equal(decisionOf(o).candidate.newW,105,'control: Q105');
 const yes=acceptOp(o,{op_id:'fx-resp-1',after:2}),spend=decisionOf(o).spend_id;
 const c1x=pressRow(1,{corrected:{3:7}}),c3=pressRow(3,{prescribed:[105,105,105]});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const three=[c1x,c2,c3],args=foldArgs(three,[yes],rev,base()),f=EFFECTS.m.foldNativeLoad(args);
  assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED').map(i=>[i.lift,i.refs.map(r=>r.op_id)]),[[LIFT,['fx-resp-1']]],rev+' '+JSON.stringify(f.issues));
  assert.deepEqual(liveQ(f,spend),[[false,'DEBUT']],'C3 captured Q105 but performed 100: no landing ('+rev+')');
  expectRefusal(checkOf(args,LIFT,c3,{compensate:spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
  const shown=EFFECTS.m.heldProjection(f).state,E=engineAt(dayAt(3));
  assert.deepEqual(shown.queue.filter(q=>q.native_load_spend),[],'Q hidden from structural selection');
  const cards=E.genSession(shown,CARD_DAY,{}).ex,press=cards.find(c=>c.id===LIFT),row=cards.find(c=>c.id===ROW);
  assert.ok(press&&row,'both lifts on the day');
  assert.deepEqual([press.w,press.baselineAsk,press.isDebutNow],[null,true,false],'fx-press: the baseline ask, never a numeric load (ENGINE_CAPTURE_BASELINE_UNPROVEN unreachable)');
  assert.equal(row.w,100,'fx-row normal');
  const cold=EFFECTS.m.foldNativeLoad(foldArgs(three,[yes],rev,base()));
  assert.deepEqual(JSON.stringify([cold.state,cold.issues,cold.spent]),JSON.stringify([f.state,f.issues,f.spent]),'cold replay identical');
  assert.deepEqual(EFFECTS.m.heldProjection(cold).state,shown);
  const c4=pressRow(4,{prescribed:[null,null,null]}),four=[...three,c4];
  const ev4=checkOf(foldArgs(four,[yes],rev,base()),LIFT,c4);assert.equal(ev4.status,'offer',JSON.stringify(ev4.refusal));
  assert.deepEqual(ev4.offers.map(x=>[decisionOf(x).kind,decisionOf(x).target_load.scalar.value]),[['adopt-baseline',100]],rev);
  const h=EFFECTS.m.foldNativeLoad(foldArgs(four,[yes,acceptOp(ev4.offers[0],{op_id:'fx-resp-4',after:4})],rev,base()));
  assert.equal(exOf(h.state).w,100);assert.deepEqual(liveQ(h,spend),[[true,'SUPERSEDED']],rev);
  assert.ok(h.spent.some(x=>x.spend_id===spend&&!x.cancelled_by),'spend kept');
 }
});
test('N27 (d) G2 APPLIED BASE (spec R9.3 :160, D1 :316 (d)): C1 at 60 adopted by adopt-baseline (applied w 60, prior null), C1 corrected -> held, no descendants; Undo is offered on the APPLIED state: base 60, target null (RESTORE); yes -> w null, the baseline ask; R1 and R2',()=>{
 effectsGate();
 const base=()=>F0({w:null}),c1=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)});
 const ab=checkOf(foldArgs([c1],[],'fx-revision-1',base()),LIFT,c1).offers[0];assert.equal(decisionOf(ab).kind,'adopt-baseline','control');
 const yes=acceptOp(ab,{op_id:'fx-resp-1',after:1}),spend=decisionOf(ab).spend_id,c1x=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1),corrected:{3:7}});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const args=foldArgs([c1x],[yes],rev,base()),f=EFFECTS.m.foldNativeLoad(args);
  assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED'&&i.lift===LIFT),rev+' '+JSON.stringify(f.issues));
  assert.equal(exOf(f.state).w,60,'the disputed adoption is applied');
  const undo=checkOf(args,LIFT,c1x,{compensate:spend});assert.equal(undo.status,'offer',JSON.stringify(undo.refusal));
  const u=decisionOf(undo.offers[0]);
  assert.deepEqual([u.base_load.scalar&&u.base_load.scalar.value,u.target_load.scalar],[60,null],'issued on the applied state: base 60, target null ('+rev+')');
  assert.deepEqual(u.target_load.vector,[null,null,null],'RESTORE-shaped');
  const g=EFFECTS.m.foldNativeLoad(foldArgs([c1x],[yes,acceptOp(undo.offers[0],{op_id:'fx-resp-2',after:1})],rev,base()));
  assert.ok(!g.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),JSON.stringify(g.issues));
  assert.equal(exOf(g.state).w,null,'restored: w null, the baseline ask ('+rev+')');
  assert.equal(exOf(g.state).native_load_authority.kind,'compensated');
 }
});
test('N27 (e) G3 NAMED REFUSALS (spec R9.3 :162, D1 :316 (e)): a completion closed before the hold on a numeric card refuses PLAN_CHANGED [its Close Ref]; a device-B completion after the hold with no causal link refuses by the hold, refs [the holding record], with no adoption',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1');
 const bad=acceptOp(earlyCutForgery(cs,offer),{op_id:'fx-bad-1',after:2});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  expectRefusal(checkOf(foldArgs(cs,[resp,bad],rev),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
  const c3=C(3,{date:'2026-10-12',reps:TOP,loads:100,prescribed:null,effort:e(2,1,1)}),a=foldArgs([...cs,c3],[resp,bad],rev);
  for(const id of c3.ops)Object.assign(a.generation.collections.ops[id],{device_id:'fx-device-B',device_seq:1000+c3.ops.indexOf(id)});
  const ev=checkOf(a,LIFT,c3);expectRefusal(ev,'RECORD_INVALID',[ref('fx-bad-1')]);assert.deepEqual(ev.offers,[],'no adoption');
 }
});
test('N27 (f) D-R9-LEGACY-ENTRY (spec R9.4 :159, D1 :316 (f)): fx-press carries an unfinished legacy (non-native) DEBUT 110 and is held; fx-row is on the same day. The held projection hides the legacy entry (kept in the fold state): fx-row normal, fx-press the baseline ask (w null, isDebutNow false, so ENGINE_CAPTURE_BASELINE_UNPROVEN is unreachable); cold replay identical; R1 and R2',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1');
 const bad=acceptOp(earlyCutForgery(cs,offer),{op_id:'fx-bad-1',after:2});
 const LEG={exId:LIFT,kind:'debut',done:false,state:'DEBUT',newW:110,t:'SYNTHETIC legacy debut'};
 const base=()=>{const s=withRow();s.queue.push(structuredClone(LEG));return s;};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,bad],rev,base()));
  assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.lift===LIFT&&!i.superseded_by),'fx-press is held ('+rev+') '+JSON.stringify(f.issues));
  assert.ok(f.state.queue.some(q=>q.exId===LIFT&&q.kind==='debut'&&!q.done&&typeof q.native_load_spend!=='string'&&q.newW===110),'the legacy entry stays in the fold state');
  const shown=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual(shown.queue.filter(q=>q.exId===LIFT&&!q.done&&['debut','unlock'].includes(q.kind)),[],'every unfinished debut/unlock entry of the held lift is hidden ('+rev+')');
  const cards=engineAt(CARD_DAY).genSession(shown,CARD_DAY,{}).ex,press=cards.find(c=>c.id===LIFT),row=cards.find(c=>c.id===ROW);
  assert.ok(press&&row,'both lifts on the day');
  assert.deepEqual([press.w,press.baselineAsk,press.isDebutNow],[null,true,false],'fx-press: the baseline ask, never the legacy 110 ('+rev+')');
  assert.equal(row.w,100,'fx-row normal');
  const cold=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,bad],rev,base()));
  assert.equal(JSON.stringify(EFFECTS.m.heldProjection(cold).state),JSON.stringify(shown),'cold replay identical');
  // Control: an unheld lift's legacy entry is not hidden (the projection touches held lifts only).
  const u=EFFECTS.m.foldNativeLoad(foldArgs(cs,[],rev,base()));
  assert.ok(!u.issues.some(i=>i.lift===LIFT&&i.code==='NATIVE_LOAD_RECORD_INVALID'),'control: not held');
  assert.ok(EFFECTS.m.heldProjection(u).state.queue.some(q=>q.exId===LIFT&&q.newW===110&&!q.done),'control: the legacy entry stays visible when the lift is not held');
 }
});
test('R15-LEGACY-ON-HELD (spec R9.4 :159 "unfinished", :162 "keeps LEGACY_PENDING"; mutants R15-legacy-done, R15-legacy-everywhere): on a held lift, a DONE legacy entry is not hidden by the projection, and a completion after the hold trained on the baseline ask is refused LEGACY_PENDING [its Close Ref] while a legacy PROPOSED entry is pending, never offered the adoption; R1 and R2',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1');
 const bad=acceptOp(earlyCutForgery(cs,offer),{op_id:'fx-bad-1',after:2});
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:100,prescribed:null,effort:e(2,1,1)}),three=[...cs,c3];
 const withQ=(...qs)=>{const s=F0();for(const q of qs)s.queue.push(structuredClone(q));return s;};
 const DONE={exId:LIFT,kind:'debut',done:true,state:'ESTABLISH',newW:95,t:'SYNTHETIC finished legacy debut'};
 const PROP={exId:LIFT,kind:'debut',done:false,state:'PROPOSED',newW:105,t:'SYNTHETIC legacy proposed'};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(three,[resp,bad],rev,withQ(DONE)));
  assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.lift===LIFT),'held ('+rev+')');
  assert.ok(EFFECTS.m.heldProjection(f).state.queue.some(q=>q.exId===LIFT&&q.done&&q.newW===95),'a finished legacy entry is not hidden ('+rev+')');
  assert.deepEqual(checkOf(foldArgs(three,[resp,bad],rev,withQ(DONE)),LIFT,c3).offers.map(o=>decisionOf(o).kind),['adopt-baseline'],'control: a finished entry leaves the exit open');
  const ev=checkOf(foldArgs(three,[resp,bad],rev,withQ(PROP)),LIFT,c3);
  expectRefusal(ev,'LEGACY_PENDING',[ref(c3.close)]);assert.deepEqual(ev.offers,[],'no adoption past a pending legacy entry ('+rev+')');
 }
});
// ======================================================================
// ROUND 16 rows (spec R9.6 b739c2f8; Astra L8 B28-B30; fresh Fable l1 D-FRESH-1..3, N1, N2).
// ======================================================================
test('R16-B28 RESTORE BY RECORD SHAPE (Astra L8 B28; spec R9.4 :156): base 100, C1 at 105 adopted, Undo issued on the applied 105 (RESTORE: base 105, target 100), both replayed over an admitted base 102.5 with no ordering op -> w 100 (the RESTORE), authority compensated, both responses and the tombstone kept, no open conflict; R1 and R2 (R2 adds only PRODUCER_REVISION_ABSENT_APPLIED)',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false});
 const u=checkOf(foldArgs([h.c1],[h.resp]),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer');
 const ud=decisionOf(u.offers[0]);assert.deepEqual([ud.base_load.scalar.value,ud.target_load.scalar.value],[105,100],'control: a RESTORE-shaped undo');
 const comp=acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,comp],rev,F0({w:102.5})));
  assert.equal(exOf(f.state).w,100,'the consented 100 is restored, never the admitted 102.5 ('+rev+')');
  assert.equal(exOf(f.state).native_load_authority.kind,'compensated');
  assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,ud.spend_id,'tombstone');
  assert.deepEqual(f.spent.map(x=>x.response_refs.map(r=>r.op_id)).flat().sort(),['fx-resp-1','fx-resp-2'],'both responses kept');
  assert.deepEqual(f.issues.filter(i=>!['NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED'].includes(i.code)&&!i.superseded_by&&['NATIVE_LOAD_EFFECT_CONFLICT','NATIVE_LOAD_RECORD_INVALID'].includes(i.code)),[],rev);
 }
 // The baseline variant: adopt-baseline 60 (w null) undone on the applied 60 (RESTORE to null), replayed over base 45.
 const b=heldAdoption({baseline:true}),bu=checkOf(foldArgs([b.c1],[b.resp],'fx-revision-1',F0({w:null})),LIFT,b.c1,{compensate:b.spend});
 assert.equal(bu.status,'offer');const bcomp=acceptOp(bu.offers[0],{op_id:'fx-resp-2',after:1});
 for(const rev of ['fx-revision-1','fx-revision-2'])assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([b.c1],[b.resp,bcomp],rev,F0({w:45}))).state).w,null,'restored to the null prior image ('+rev+')');
});
test('R16-CANON-SHAPES ONE CANCELLATION, TWO SHAPES, ANY ORDER (spec R9.4 :156 shape classification with review B19 order-free canonical records; round-16 LIVE mutant R7-canon-order): the same Undo recorded twice, once as a RESTORE (issued on the applied 105: base 105, target 100) and once as a RETIRE (issued on the held adoption under base 102.5: target = base), folds identically whichever record the log carries first, R1 and R2',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false});
 const u1=checkOf(foldArgs([h.c1],[h.resp]),LIFT,h.c1,{compensate:h.spend}),u2=checkOf(foldArgs([h.c1],[h.resp],'fx-revision-1',F0({w:102.5})),LIFT,h.c1,{compensate:h.spend});
 assert.deepEqual([u1.status,u2.status],['offer','offer']);
 const d1=decisionOf(u1.offers[0]),d2=decisionOf(u2.offers[0]);
 assert.deepEqual([d1.base_load.scalar.value,d1.target_load.scalar.value,d2.base_load.scalar.value,d2.target_load.scalar.value],[105,100,102.5,102.5],'control: a RESTORE and a RETIRE');
 assert.equal(d1.spend_id,d2.spend_id,'control: one cancellation');
 const A=acceptOp(u1.offers[0],{op_id:'fx-resp-9',after:1}),B=acceptOp(u2.offers[0],{op_id:'fx-resp-2',after:1});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const out=[[A,B],[B,A]].map(xs=>{const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,...xs],rev,F0({w:102.5}))),ex=exOf(f.state);
   return {w:ex.w,auth:ex.native_load_authority&&ex.native_load_authority.kind,cancelled:f.spent.find(x=>x.spend_id===h.spend).cancelled_by,
    refs:f.spent.map(x=>x.response_refs.map(r=>r.op_id)).flat().sort(),issues:f.issues.map(i=>i.code+':'+(i.superseded_by?'s':'')).sort()};});
  assert.deepEqual(out[0],out[1],'order-free ('+rev+')');
  assert.ok([100,102.5].includes(out[0].w),'one of the recorded shapes applies');assert.equal(out[0].cancelled,d1.spend_id);
  assert.deepEqual(out[0].refs,['fx-resp-1','fx-resp-2','fx-resp-9'],'every record kept');
 }
});
// Round 16b (coordinator: close R7-comp-reprice, R7-comp-any, R7-canon-cut). A compensation
// body is a pure function of its request (lift, compensates, the echoed basis with its own
// effect_frontier) and of the lift's exercise and the queue, which the cut digests cover, so a
// GENUINE record re-evaluates at a reproducible cut to exactly its own body. A body that does
// not is not an issuance of that cut (spec :155 "validates each historical issuance at its
// ORIGINAL cut"), whatever compensates it names.
function heldUndoForgery(){
 const h=heldAdoption({baseline:false});
 const u1=checkOf(foldArgs([h.c1],[h.resp]),LIFT,h.c1,{compensate:h.spend}),u2=checkOf(foldArgs([h.c1],[h.resp],'fx-revision-1',F0({w:102.5})),LIFT,h.c1,{compensate:h.spend});
 assert.deepEqual([u1.status,u2.status],['offer','offer']);
 const retire=u2.offers[0],forged=structuredClone(retire);forged.body.target_load=structuredClone(decisionOf(u1.offers[0]).target_load);
 assert.deepEqual([decisionOf(retire).target_load.scalar.value,forged.body.target_load.scalar.value,forged.body.base_load.scalar.value],[102.5,100,102.5],'control: a genuine RETIRE and its RESTORE-shaped forgery');
 return {h,u1,retire,forged};
}
test('R16b-COMP-REPRICE FORGED UNDO BODY AT ITS OWN CUT (spec R9 :155 re-validation at the ORIGINAL cut, threat model :35; round-16 LIVE mutant R7-comp-reprice): the genuine RETIRE issued on the held adoption under base 102.5, re-shaped into a RESTORE to 100 and re-digested, recorded under the PRESENT revision at a reproducible cut -> RECORD_INVALID issuance [its Ref], w stays 102.5; control: the genuine RETIRE applies with no RECORD_INVALID; under R2 (revision absent) the body applies as written after S1-S8 and DERIVABLE (spec :155), which bound it to the adoption\'s prior image 100',()=>{
 effectsGate();
 const {h,retire,forged}=heldUndoForgery();
 const g=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(retire,{op_id:'fx-resp-2',after:1})],'fx-revision-1',F0({w:102.5})));
 assert.ok(!g.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),'control '+JSON.stringify(g.issues));assert.equal(exOf(g.state).w,102.5);
 const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(forged,{op_id:'fx-resp-2',after:1})],'fx-revision-1',F0({w:102.5})));
 assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>[i.field,i.refs.map(r=>r.op_id)]),[['issuance',['fx-resp-2']]],JSON.stringify(f.issues));
 assert.equal(exOf(f.state).w,102.5,'the forged RESTORE writes nothing');
 const r2=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(forged,{op_id:'fx-resp-2',after:1})],'fx-revision-2',F0({w:102.5})));
 assert.equal(exOf(r2.state).w,100,'R2: applied as written, bounded by DERIVABLE to the prior image');
});
test('R16b-COMP-EVERY EVERY RECORD OF A CANCELLATION IS AN ISSUANCE (spec R9 :155 "validates each historical issuance"; round-16 LIVE mutant R7-comp-any): the genuine RETIRE (fx-resp-2, the representative) and its RESTORE-shaped forgery (fx-resp-3) of the same cancellation, both at the reproducible cut under the present revision -> RECORD_INVALID issuance naming both records, nothing written; control: the genuine record alone applies',()=>{
 effectsGate();
 const {h,retire,forged}=heldUndoForgery();
 const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(retire,{op_id:'fx-resp-2',after:1}),acceptOp(forged,{op_id:'fx-resp-3',after:1})],'fx-revision-1',F0({w:102.5})));
 assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>[i.field,i.refs.map(r=>r.op_id)]),[['issuance',['fx-resp-2','fx-resp-3']]],JSON.stringify(f.issues));
 assert.equal(exOf(f.state).w,102.5);
});
test('R16b-CANON-CUT A FORGED EARLY-CUT COPY OF AN UNDO (spec R9 :155 threat model, :156 compensates names a fold effect; review B19 earliest cut; round-16 LIVE mutant R7-canon-cut): C1 at 105 adopted (fx-resp-1); its genuine RESTORE undo (fx-resp-2, cut [C1]); a re-digested copy claiming the empty cut (fx-resp-9). The cancellation sits at the earliest cut any record claims, before the adoption it names, so it is refused RECORD_INVALID compensates naming every record and is never applied silently; the adoption stands (w 105); R1 and R2. Control: the genuine undo alone -> w 100',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false});
 const u=checkOf(foldArgs([h.c1],[h.resp]),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer');
 const early=structuredClone(u.offers[0]);early.body.basis.order.start_ids=[];
 for(const rev of ['fx-revision-1','fx-revision-2']){
  assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1})],rev)).state).w,100,'control ('+rev+')');
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1}),acceptOp(early,{op_id:'fx-resp-9',after:1})],rev));
  const bad=f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID');
  assert.deepEqual(bad.map(i=>i.refs.map(r=>r.op_id)),[['fx-resp-2','fx-resp-9']],rev+' '+JSON.stringify(f.issues));
  assert.equal(exOf(f.state).w,105,'the adoption stands; the undo is not applied silently ('+rev+')');
  assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,null);
 }
});
test('R16-ADOPT-LATEST-ACTUAL (spec R9 :155 S8 "for adoption target_load equals those actual loads exactly" of the LATEST consumed completion; round-16 LIVE mutant R11-S8-adopt): C1 at 110 and C2 at 105 on the 100 card; C2\'s genuine adopt-observed 105 re-issued to consume [C1, C2] with evidence ordered [C2, C1] and target 110 -> RECORD_INVALID target_load, w stays 100, R1 (cut zeroed) and R2',()=>{
 effectsGate();
 const c1=C(1,{reps:TOP,loads:110,effort:e(2,1,1)}),c2=C(2,{reps:TOP,loads:105,effort:e(2,1,1)}),cs=[c1,c2];
 const o2=checkOf(foldArgs(cs,[]),LIFT,c2).offers.find(o=>decisionOf(o).kind==='adopt-observed'),o1=checkOf(foldArgs([c1],[]),LIFT,c1).offers.find(o=>decisionOf(o).kind==='adopt-observed');
 assert.ok(o1&&o2,'control: adopt-observed on each completion');
 assert.deepEqual([decisionOf(o1).target_load.scalar.value,decisionOf(o2).target_load.scalar.value,decisionOf(o2).consumes.length],[110,105,1]);
 const f0=structuredClone(o2),b=f0.body;
 b.consumes=[...decisionOf(o1).consumes,...b.consumes].sort();const d0=JSON.parse(b.spend_id);d0[4]=b.consumes;b.spend_id=JSON.stringify(d0);
 b.evidence=[...b.evidence,...structuredClone(decisionOf(o1).evidence)];
 b.target_load.scalar.value=110;for(const v of b.target_load.vector)v.value=110;b.basis.plan.programme_sha256='sha256:'+'0'.repeat(64);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(f0,{after:2})],rev));
  assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['target_load'],rev+' '+JSON.stringify(f.issues));
  assert.equal(exOf(f.state).w,100,'never the earlier completion\'s 110 ('+rev+')');
 }
});
test('R16-B29 SPEND-SUFFIX (Astra L8 B29, M14; spec :154 spend once): C1, C2 tops [10,9,8] at 100 e(2,1,1), ORD 105 accepted and undone before any further training; C3 the same top at 100 -> PROVISIONAL [C3 Close Ref] (the spent C1, C2 sightings are never reused); C4 top -> ORD consuming exactly [C3, C4]',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const u=checkOf(foldArgs(cs,[resp]),LIFT,cs[1],{compensate:spend});assert.equal(u.status,'offer');
 const comp=acceptOp(u.offers[0],{op_id:'fx-resp-2',after:2});
 const c3=C(3,{reps:TOP,effort:e(2,1,1)}),c4=C(4,{reps:TOP,effort:e(2,1,1)});
 expectRefusal(checkOf(foldArgs([...cs,c3],[resp,comp]),LIFT,c3),'PROVISIONAL',[ref(c3.close)]);
 const ev=checkOf(foldArgs([...cs,c3,c4],[resp,comp]),LIFT,c4);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
 const d=decisionOf(ev.offers.find(o=>decisionOf(o).kind==='earn'));
 assert.deepEqual(d.consumes,[JSON.stringify([c3.start,LIFT,c3.close]),JSON.stringify([c4.start,LIFT,c4.close])].sort(),'only the unspent sightings');
});
test('N30 HELD-UNEQUAL (spec R9.6 :163, fresh l1 N1, Astra L8 B30): the N11 ladder lift [100,95] held by EFFECT_CONFLICT; C3 on the baseline ask, Start after both records, performed [100,95] -> VECTOR_ADOPTION_UNDEFINED [C3 Close Ref], not EFFECT_CONFLICT; control C3 at [100,100] -> [adopt-baseline 100]',()=>{
 effectsGate();
 const {cs,base,offers}=n11Checked();
 const a=acceptOp(offers[0],{after:2,op_id:'fx-resp-a'}),b=acceptOp(offers[1],{after:2,op_id:'fx-resp-b'});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[a,b],rev,base));
  assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT'&&i.lift===LIFT),'held ('+rev+')');
  const c3=C(3,{reps:[10,9],loads:[100,95],prescribed:[null,null],effort:e(2,1)});
  expectRefusal(checkOf(foldArgs([...cs,c3],[a,b],rev,base),LIFT,c3),'VECTOR_ADOPTION_UNDEFINED',[ref(c3.close)]);
  const c3e=C(3,{reps:[10,9],loads:[100,100],prescribed:[null,null],effort:e(2,1)});
  assert.deepEqual(checkOf(foldArgs([...cs,c3e],[a,b],rev,base),LIFT,c3e).offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',100]],rev);
 }
});
test('N31 UNKNOWN-LINEAGE (spec R9.6 :155 S1, fresh l1 N2): N02c\'s genuine offer re-issued with lift_lineage_id \'fx-ghost\', absent from the base, absent revision -> RECORD_INVALID, field lift_lineage_id, nothing applied',()=>{
 effectsGate();
 const {cs,offer}=landingScenario('fx-revision-1');
 const ghost=structuredClone(offer);ghost.body.lift_lineage_id='fx-ghost';
 const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(ghost,{after:2})],'fx-revision-2'));
 assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['lift_lineage_id'],JSON.stringify(f.issues));
 assert.deepEqual(f.state.queue,[],'nothing applied');assert.equal(exOf(f.state).w,100);
});
test('R16-D-FRESH-2 REGISTRAR FOLDS WITH SOURCE (spec R9.6 :164, :155 S7; fresh l1 D-FRESH-2): N02c\'s genuine offer re-issued with a forged basis.source under an absent revision. A fold that omits `source` (the pre-fix registrar shape) cannot check S7 and applies it; the fold with the admitted source (project(), check() and now the registrar) refuses RECORD_INVALID basis.source and applies nothing',()=>{
 effectsGate();
 const {cs,offer}=landingScenario('fx-revision-1');
 const forged=structuredClone(offer);forged.body.basis.source={W:7,log_digest:'fx-forged-source',selection_id:null};
 const a=foldArgs(cs,[acceptOp(forged,{after:2})],'fx-revision-2'),bare={...a};delete bare.source;
 const without=EFFECTS.m.foldNativeLoad(bare),withSrc=EFFECTS.m.foldNativeLoad(a);
 assert.equal(without.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='basis.source'),false,'without source the S7 source check has nothing to compare');
 assert.deepEqual(withSrc.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['basis.source'],JSON.stringify(withSrc.issues));
 assert.deepEqual(withSrc.state.queue,[],'nothing applied');assert.equal(exOf(withSrc.state).w,100);
 assert.notDeepEqual(without.state.queue,withSrc.state.queue,'the two folds disagree: the registrar must fold with source');
});
// ======================================================================
// ROUND 18: N29 MISSED DEBUT under H11 OPTION 1 (spec R9.9 679567a :152, :155, :158, J, K;
// DECISIONS:796 (c), :801 (1), :802). The first normal Close of a Start whose card was generated
// from the selected native entry (SELECTED ENTRY: a scalar target's newW on every captured
// original slot whatever their number; a vector target equal to newWSets) CONSUMES it: it lands,
// or it is MISSED (done, state 'MISSED', native_load_missed_by that Close, effect 'missed') and
// writes nothing else. A miss holds nothing. The check on the missed Close (MISSED CLOSE)
// compares its capture with the missed entry's target, refuses its earn branch PLAN_CHANGED and
// offers adopt-observed of equal actual loads claiming load_basis.authority_refs [its Close Ref]
// (the MISSED-DEBUT ANCHOR, verified on replay against the missed earn's recorded base).
// Retired in round 18 (red evidence in the round report): the R9.6-R9.8 N29 rows (missed hold,
// baseline-ask projection, adopt-baseline exit naming the Close, SUPERSEDED on its yes) and N29
// MISSED-DEBUT HOLD NAME.
// ======================================================================
function missedDebut(loads,reps=[8,7,6],opts={}){
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const c3=C(3,{date:'2026-10-12',reps,loads,prescribed:105,effort:e(...reps.map((_,k)=>k?1:2)),...opts});
 return {cs,resp,offer,spend,c3,three:[...cs,c3]};
}
// The same completion as typed v2 slots, or as host v1 slots whose card lives only on the Start
// capture (the host writes no prescribed_load on a slot).
function n29Args(cs,c3,extra,{v1=false,rev='fx-revision-1',base=F0(),card}={}){
 const c=v1?v1Of(c3):c3,a=foldArgs([...cs,c],extra,rev,base);
 if(v1)captureOn(a.generation,c,card||c.session.record.entries[0].slots.map(()=>105));
 return {a,c};
}
// The next card through the public capture boundary (engine-capture.cjs over this file's composed
// engine, validated by capture.cjs): each lift slot's load, null for the baseline ask.
function cardLoads(state,{lift=LIFT,day=CARD_DAY}={}){
 const CF=require(path.join(ROOT,'rebuild/m4/workout/engine-capture.cjs')),PC=require(path.join(ROOT,'rebuild/m4/workout/capture.cjs'));
 const producer={app_build:'fx-app',engine_build:'fx-engine',rule_profile:CF.PROFILE,source_schema:'fx-schema'},basis={plan_basis:'fx-plan',input_basis:'fx-input',source_revision:1};
 const adapter=CF.createEngineWorkoutCapture({engine:engineAt(day),prescriptionCapture:PC.createPrescriptionCapture({parseStrictJson:JSON.parse}),producerIdentity:producer});
 const {capture}=adapter.prepare({state,day,sleep:{},basis});
 return capture.slots.filter(s=>s.lift_lineage_id===lift).map(s=>s.load.state==='specified'?JSON.parse(s.load.source_json).value:null);
}
// A completion whose original sets were later corrected to other loads (edit ops before its Close).
function loadFix(c,fix){
 const x=structuredClone(c),en=x.session.record.entries[0];
 for(const [p,load] of Object.entries(fix)){const slot=en.slots[p-1],id='fx-edit-'+x.n+'-'+p;
  slot.fact.edit_op_ids=[id];slot.fact.current={...slot.fact.current,load:lb(load)};if(!x.ops.includes(id))x.ops.splice(x.ops.indexOf(x.close),0,id);}
 return x;
}
const n29Fields=f=>{const x=exOf(f.state);return {w:x.w,wSets:x.wSets,wAt:x.wAt,last:x.last,auth:x.native_load_authority};};
const N29_UNCHANGED={w:100,wSets:undefined,wAt:undefined,last:undefined,auth:undefined};
const PRIOR_F0={w:{present:true,value:100},wSets:{present:false,value:null},wAt:{present:false,value:null},last:{present:false,value:null},lastMeta:{present:false,value:null},
 own:{present:false,value:null},std:{present:false,value:null},topAt:{present:true,value:null},topRun:{present:true,value:0}};
const recordInvalid=f=>f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field);
const N29_VARIANTS=[
 {name:'95',loads:95,want:'offer',target:95},
 {name:'100',loads:100,want:'PLAN_CHANGED'},
 {name:'[100,95,95]',loads:[100,95,95],want:'VECTOR_ADOPTION_UNDEFINED'},
 {name:'110',loads:110,want:'offer',target:110},
 {name:'95, set 2 later corrected to 6 reps',loads:95,opts:{corrected:{2:6}},want:'offer',target:95,edit:'fx-edit-3-2'},
 {name:'95, 95, third set skipped',loads:95,opts:{skippedAt:[3]},want:'PREFIX_UNRESOLVED'},
 {name:'every set skipped',loads:95,opts:{skippedAt:[1,2,3]},want:'PREFIX_UNRESOLVED'},
 {name:'105 with [8,7,6]',loads:105,want:'DEBUT_LANDED'},
];
test('N29-R9.9 MISSED DEBUT, OPTION 1 (spec R9.9 :152, J (a)-(i), D1 N29; DECISIONS:796 (c), :801 (1)): Q105 accepted; C3 captures the 105 debut card. Off the target (95, 100, [100,95,95], 110, 95 with a later rep correction, 95 95 and a skipped set, every set skipped) its Close consumes Q (done, MISSED, native_load_missed_by C3, effect missed with close_ref C3, spend kept with close_ref null), raises no issue, holds nothing and writes nothing else; the next card is 100, never 105; the check on C3 offers [adopt-observed of the lifted load] claiming [C3 Close Ref] (95, 110), or refuses PLAN_CHANGED (100), VECTOR_ADOPTION_UNDEFINED ([100,95,95]) or PREFIX_UNRESOLVED (a skipped slot; every slot skipped) [C3 Close Ref]; Undo of Q refuses COMPENSATION_DESCENDANTS; 105 with [8,7,6] lands (DEBUT_LANDED). R1 and R2, typed v2 and host v1 slots',()=>{
 effectsGate();
 for(const v of N29_VARIANTS)for(const v1 of [false,true])for(const rev of ['fx-revision-1','fx-revision-2']){
  const label=v.name+(v1?' v1 ':' v2 ')+rev,m=missedDebut(v.loads,[8,7,6],v.opts||{});
  const {a,c}=n29Args(m.cs,m.c3,[m.resp],{v1,rev}),f=EFFECTS.m.foldNativeLoad(a);
  assert.equal(f.status,'ready',label);
  const q=f.state.queue.find(x=>x.native_load_spend===m.spend),x=f.spent.find(y=>y.spend_id===m.spend);
  assert.ok(!f.issues.some(i=>i.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN'||EFFECTS.m.isHold(i)),label+' '+JSON.stringify(f.issues));
  assert.equal(EFFECTS.m.heldProjection(f).lifts.has(LIFT),false,label+' not held');
  assert.ok(x&&!x.cancelled_by,label+' spend kept');
  const shown=EFFECTS.m.heldProjection(f).state,card=cardLoads(shown);
  assert.equal(engineAt(CARD_DAY).genSession(shown,CARD_DAY,{}).ex.find(k=>k.id===LIFT).isDebutNow,false,label+' never a debut card again');
  if(v.want==='DEBUT_LANDED'){
   assert.deepEqual([q.done,q.state],[true,'ESTABLISH'],label);
   assert.deepEqual(n29Fields(f),{w:105,wSets:undefined,wAt:c.date,last:[8,7,6],auth:{kind:'landed',spend_id:m.spend,close_op_id:c.close,response_refs:[ref('fx-resp-1')]}},label);
   assert.deepEqual(f.effects.map(y=>[y.kind,y.close_ref]),[['landed',ref(c.close)]],label);
   assert.deepEqual(x.close_ref,ref(c.close),label);assert.deepEqual(card,[105,105,105],label);
   expectRefusal(checkOf(a,LIFT,c),'DEBUT_LANDED',[ref(c.close)]);
   continue;
  }
  assert.deepEqual([q.done,q.state,q.native_load_missed_by],[true,'MISSED',c.close],label);
  assert.deepEqual(n29Fields(f),N29_UNCHANGED,label+' the miss writes nothing else');
  assert.deepEqual(f.effects.map(y=>[y.kind,y.close_ref]),[['missed',ref(c.close)]],label);
  assert.equal(x.close_ref,null,label+' a landing alone writes the spend index close_ref');
  assert.deepEqual(card,[100,100,100],label+' the next card is the working weight, never 105');
  expectRefusal(checkOf(a,LIFT,c,{compensate:m.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
  const ev=checkOf(a,LIFT,c);
  if(v.want!=='offer'){expectRefusal(ev,v.want,[ref(c.close)]);continue;}
  assert.equal(ev.status,'offer',label+' '+JSON.stringify(ev.refusal));
  const d=decisionOf(ev.offers[0]);
  assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load]),[['adopt-observed',{scalar:lb(v.target),vector:Loads(v.target,v.target,v.target)}]],label);
  assert.deepEqual([d.candidate,d.reason_key,d.consumes,d.base_load.scalar,d.base_load.vector],[null,'observed-load',[JSON.stringify([c.start,LIFT,c.close])],lb(100),Loads(100,100,100)],label);
  assert.deepEqual(d.basis.load_basis.authority_refs,[ref(c.close)],label+' the MISSED-DEBUT ANCHOR claim');
  const why=ev.offers[0].reason;
  assert.ok(why.includes('105 lb on every set')&&why.includes('100 lb on every set')&&!why.includes('the card said 100'),label+' names the debut card and the kept working weight: '+why);
  if(v.edit)assert.deepEqual(d.evidence[0].sets[1].edits,[ref(v.edit)],label+' the evidence names the edit Ref');
 }
});
test('N29-ALL-SKIPPED (spec R9.9 :152 ALL SKIPPED, J (i); D-R9.9-SKIPPED, DECISIONS:801 (1)): C3 captures the 105 debut card and every original set is skipped -> Q consumed MISSED with nothing lifted and nothing written, C1 and C2 stay spent, no offer: the check refuses PREFIX_UNRESOLVED [C3 Close Ref]; Undo of Q refuses COMPENSATION_DESCENDANTS; R1 and R2, typed v2 and host v1',()=>{
 effectsGate();
 const m=missedDebut(95,[8,7,6],{skippedAt:[1,2,3]});
 for(const v1 of [false,true])for(const rev of ['fx-revision-1','fx-revision-2']){
  const {a,c}=n29Args(m.cs,m.c3,[m.resp],{v1,rev}),f=EFFECTS.m.foldNativeLoad(a),label=(v1?'v1 ':'v2 ')+rev;
  assert.deepEqual(liveQ(f,m.spend),[[true,'MISSED']],label);assert.deepEqual(n29Fields(f),N29_UNCHANGED,label);
  assert.deepEqual(f.spent.find(x=>x.spend_id===m.spend).consumes,decisionOf(m.offer).consumes,label+' C1 and C2 stay spent');
  expectRefusal(checkOf(a,LIFT,c),'PREFIX_UNRESOLVED',[ref(c.close)]);
  expectRefusal(checkOf(a,LIFT,c,{compensate:m.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
 }
});
test('N29-NO-HOLD (spec R9.9 :152 "A missed debut raises no issue and holds nothing", :158 NO TRAP; replaces N29 MISSED-DEBUT HOLD NAME): on the missed lift the fold has no DEBUT_BASIS_UNPROVEN issue and no hold, and an Undo naming no live spend refuses RECORD_INVALID field intent (FC01 compensation), never DEBUT_BASIS_UNPROVEN; R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(95);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs(m.three,[m.resp],rev),f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN'||EFFECTS.m.isHold(i)),[],rev);
  const ev=checkOf(a,LIFT,m.c3,{compensate:JSON.stringify(['native-load-compensation',LIFT,'fx-no-spend'])});
  expectRefusal(ev,'RECORD_INVALID',[]);assert.equal(ev.refusal.field,'intent',rev);
 }
});
test('N29-UNDO-LOWER (spec R9.9 :152, :154, J (a) and UNDO OF THE LOWER-WEIGHT YES, D-L8F-1): the yes to [adopt-observed 95] on C3 -> w 95, wAt C3 local_date, authority adopted with the prior image (w 100; wSets, wAt, last absent; topAt null, topRun 0), Q stays MISSED; its Undo before C4 -> the whole prior image (w 100), Q stays MISSED, C3 stays spent, so a re-check of C3 refuses SOURCE_OVERLAP [C3 Close Ref]; once C4 is trained on the 95 card the Undo refuses COMPENSATION_DESCENDANTS; R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(95),exit=checkOf(foldArgs(m.three,[m.resp]),LIFT,m.c3).offers[0],d=decisionOf(exit),yes=acceptOp(exit,{op_id:'fx-resp-3',after:3});
 const c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:95,effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,yes],rev)),ex=exOf(f.state);
  assert.deepEqual([ex.w,ex.wAt,liveQ(f,m.spend)],[95,m.c3.date,[[true,'MISSED']]],rev);
  assert.deepEqual([ex.native_load_authority.kind,ex.native_load_authority.prior],['adopted',PRIOR_F0],rev);
  const u=checkOf(foldArgs(m.three,[m.resp,yes],rev),LIFT,m.c3,{compensate:d.spend_id});assert.equal(u.status,'offer',rev+' '+JSON.stringify(u.refusal));
  const undo=acceptOp(u.offers[0],{op_id:'fx-resp-4',after:3}),g=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,yes,undo],rev)),gx=exOf(g.state),before=exOf(F0());
  for(const k of ['w','wSets','wAt','last','lastMeta','own','std','topAt','topRun'])assert.deepEqual([k,gx[k]],[k,before[k]],'prior image field '+k+' ('+rev+')');
  assert.deepEqual(liveQ(g,m.spend),[[true,'MISSED']],rev+' the Undo names the adoption spend only');
  assert.ok(g.spent.find(x=>x.spend_id===d.spend_id).cancelled_by,rev);
  expectRefusal(checkOf(foldArgs(m.three,[m.resp,yes,undo],rev),LIFT,m.c3),'SOURCE_OVERLAP',[ref(m.c3.close)]);
  assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(g).state),[100,100,100],rev+' the next card is 100, never 105');
  expectRefusal(checkOf(foldArgs([...m.three,c4],[m.resp,yes],rev),LIFT,c4,{compensate:d.spend_id}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-3')]);
 }
});
test('N29-NEXT-TIME (spec R9.9 :152 "a lower weight lifted on the working-weight card is offered by the ordinary adoption (N09)", :399 option 1, J (a) no answer): no answer on C3; C4 at 95 on the 100 card -> [adopt-observed 95] with authority_refs [] and base 100; C3 is now COMPLETION_SUPERSEDED; nothing was written (w 100); R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(95),c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:100,effort:e(2,1,1)}),four=[...m.three,c4];
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs(four,[m.resp],rev);
  assert.equal(exOf(EFFECTS.m.foldNativeLoad(a).state).w,100,rev);
  const ev=checkOf(a,LIFT,c4);assert.equal(ev.status,'offer',rev+' '+JSON.stringify(ev.refusal));
  const d=decisionOf(ev.offers[0]);
  assert.deepEqual([ev.offers.length,d.kind,d.target_load.scalar,d.base_load.scalar,d.basis.load_basis.authority_refs],[1,'adopt-observed',lb(95),lb(100),[]],rev);
  expectRefusal(checkOf(a,LIFT,m.c3),'COMPLETION_SUPERSEDED',[ref(m.c3.close)]);
 }
});
test('N29-EARN (spec R9.9 :152 MISSED CLOSE earn branch, J (b)): C3 at 100 [10,9,8] on the 105 card -> Q MISSED, w 100, the check refuses PLAN_CHANGED [C3 Close Ref] for typed and host slots (a debut session is never the checked completion of an earn); C4 at 100 [10,9,8] on the 100 card -> ORD 105 consuming C3 and C4; only its new yes queues a NEW entry (Q stays MISSED); R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(100,TOP),c4=C(4,{date:'2026-10-15',reps:TOP,loads:100,prescribed:100,effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  for(const v1 of [false,true]){const {a,c}=n29Args(m.cs,m.c3,[m.resp],{v1,rev});
   assert.deepEqual(liveQ(EFFECTS.m.foldNativeLoad(a),m.spend),[[true,'MISSED']],rev);expectRefusal(checkOf(a,LIFT,c),'PLAN_CHANGED',[ref(c.close)]);}
  const a=foldArgs([...m.three,c4],[m.resp],rev),ev=checkOf(a,LIFT,c4);assert.equal(ev.status,'offer',rev+' '+JSON.stringify(ev.refusal));
  const d=decisionOf(ev.offers[0]);
  assert.deepEqual([ev.offers.length,d.kind,d.candidate.newW,d.consumes],[1,'earn',105,[JSON.stringify([m.c3.start,LIFT,m.c3.close]),JSON.stringify([c4.start,LIFT,c4.close])].sort()],rev);
  const f=EFFECTS.m.foldNativeLoad(foldArgs([...m.three,c4],[m.resp,acceptOp(ev.offers[0],{op_id:'fx-resp-5',after:4})],rev));
  assert.deepEqual(f.state.queue.filter(q=>q.native_load_spend).map(q=>[q.native_load_spend===m.spend?'Q':'new',q.done,q.state,q.newW]),[['Q',true,'MISSED',105],['new',false,'DEBUT',105]],rev);
 }
});
test('N29 MISSED-DEBUT REPLAY AND FORGERY R9.9 (spec R9.9 :155 MISSED-DEBUT ANCHOR, D1 N29 REPLAY; l11 A1): the accepted [adopt-observed 95] claiming [C3 Close Ref], replayed under R2 and after a rename (cut not reproducible), applies as written: w 95, Q stays MISSED, spend kept, PRODUCER_REVISION_ABSENT_APPLIED under R2, identical cold replay. Forged, each -> RECORD_INVALID: base 102.5 (load_basis and base_load together) base_load; a claim naming a non-missed Close (C2) base_load; target 105 target_load; the R9.8-shaped adopt-baseline naming [C3 Close Ref] base_load; the claim dropped ([]) base_load; the claim naming the C3 Start base_load; nothing applied',()=>{
 effectsGate();
 const m=missedDebut(95),exit=checkOf(foldArgs(m.three,[m.resp]),LIFT,m.c3).offers[0];
 assert.deepEqual(decisionOf(exit).basis.load_basis.authority_refs,[ref(m.c3.close)],'control: the offer claims the missed Close');
 const yes=acceptOp(exit,{op_id:'fx-resp-3',after:3});
 for(const [label,rev,base] of [['R2','fx-revision-2',F0()],['rename','fx-revision-1',F0({n:'Fx Press Renamed'})],['rename R2','fx-revision-2',F0({n:'Fx Press Renamed'})]]){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,yes],rev,base));
  assert.equal(exOf(f.state).w,95,label);assert.deepEqual(liveQ(f,m.spend),[[true,'MISSED']],label);
  assert.ok(f.spent.some(x=>x.spend_id===m.spend&&!x.cancelled_by),label);
  assert.deepEqual(recordInvalid(f),[],label+' '+JSON.stringify(f.issues));
  if(rev==='fx-revision-2')assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED'),label);
  const cold=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,yes],rev,base));
  assert.equal(JSON.stringify([cold.state,cold.issues,cold.spent]),JSON.stringify([f.state,f.issues,f.spent]),label+' cold replay identical');
 }
 const forge=(patch)=>{const o=structuredClone(exit);patch(decisionOf(o));return EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,acceptOp(o,{op_id:'fx-resp-3',after:3})],'fx-revision-2'));};
 const w1025={present:true,value:102.5},nil={present:true,value:null};
 const cases=[
  ['base 102.5',d=>{d.basis.load_basis.w=w1025;d.base_load.fields.w=w1025;d.base_load.scalar=lb(102.5);d.base_load.vector=Loads(102.5,102.5,102.5);},'base_load'],
  ['a claim naming a non-missed Close',d=>{d.basis.load_basis.authority_refs=[ref(m.cs[1].close)];},'base_load'],
  ['target 105',d=>{d.target_load={scalar:lb(105),vector:Loads(105,105,105)};},'target_load'],
  ['the R9.8-shaped adopt-baseline naming the Close',d=>{d.kind='adopt-baseline';d.reason_key='baseline';d.basis.load_basis.w=nil;d.base_load.fields.w=nil;d.base_load.scalar=null;d.base_load.vector=d.base_load.vector.map(()=>null);},'base_load'],
  ['the claim dropped',d=>{d.basis.load_basis.authority_refs=[];},'base_load'],
  ['the claim naming the C3 Start',d=>{d.basis.load_basis.authority_refs=[ref(m.c3.start)];},'base_load'],
  ['a wSets image unlike the missed earn\'s (present null)',d=>{d.basis.load_basis.wSets={present:true,value:null};d.base_load.fields.wSets={present:true,value:null};},'base_load'],
 ];
 const out=[],want=[];
 for(const [name,patch,field] of cases){const f=forge(patch);out.push([name,recordInvalid(f),exOf(f.state).w]);want.push([name,[field],100]);}
 assert.deepEqual(out,want);
});
test('N29-CLAIM (spec R9.9 :152 "FC01 judges a Close as the MISSED CLOSE only with both that mark and that claim", :155; l11 A1): the check on C3 carries authority_refs [C3 Close Ref]; the same request with the MISSED mark but the claim removed refuses PLAN_CHANGED [C3 Close Ref] at FC01 step 2 (typed slots); a claim on a Close the fold did not mark is ignored by FC01 (the ordinary N09 offer, the claim echoed in its basis) and refused at replay RECORD_INVALID base_load (R2, not re-evaluated)',()=>{
 effectsGate();
 const m=missedDebut(95),a=foldArgs(m.three,[m.resp]),ev=checkOf(a,LIFT,m.c3),b=decisionOf(ev.offers[0]).basis;
 assert.deepEqual(b.load_basis.authority_refs,[ref(m.c3.close)]);
 const f=EFFECTS.m.foldNativeLoad(a),E=engineAt(m.c3.date),bare=structuredClone(b);bare.load_basis.authority_refs=[];
 expectRefusal(E.evaluateNativeLoad(f.state,{lift_lineage_id:LIFT,completion_op_id:m.c3.close,intent:'check',basis:bare}),'PLAN_CHANGED',[ref(m.c3.close)]);
 const c1=C(1,{reps:TOP,loads:105,effort:e(2,1,1)}),n9=foldArgs([c1],[]),o=checkOf(n9,LIFT,c1).offers[0];
 assert.deepEqual(decisionOf(o).basis.load_basis.authority_refs,[],'control: an ordinary adoption claims nothing');
 const claimed=structuredClone(decisionOf(o).basis);claimed.load_basis.authority_refs=[ref(c1.close)];
 const g=EFFECTS.m.foldNativeLoad(n9),again=E.evaluateNativeLoad(g.state,{lift_lineage_id:LIFT,completion_op_id:c1.close,intent:'check',basis:claimed});
 assert.equal(again.status,'offer',JSON.stringify(again.refusal));
 const x=again.offers[0];assert.deepEqual([decisionOf(x).kind,decisionOf(x).target_load.scalar,decisionOf(x).basis.load_basis.authority_refs],['adopt-observed',lb(105),[ref(c1.close)]],'ignored by FC01');
 const h=EFFECTS.m.foldNativeLoad(foldArgs([c1],[acceptOp(x,{after:1})],'fx-revision-2'));
 assert.deepEqual([recordInvalid(h),exOf(h.state).w],[['base_load'],100],'a claim the fold did not mark is refused at replay');
 // A claim on a later ordinary Close (C4 on the 100 card at 95, after C3 missed Q105 unanswered):
 // no accepted earn's card is its capture, so it is refused base_load (never anchored to any earn).
 const c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:100,effort:e(2,1,1)}),four=[...m.three,c4];
 const o4=structuredClone(checkOf(foldArgs(four,[m.resp]),LIFT,c4).offers[0]);assert.deepEqual(decisionOf(o4).basis.load_basis.authority_refs,[],'control: C4 claims nothing');
 decisionOf(o4).basis.load_basis.authority_refs=[ref(c4.close)];
 const k4=EFFECTS.m.foldNativeLoad(foldArgs(four,[m.resp,acceptOp(o4,{op_id:'fx-resp-4',after:4})],'fx-revision-2'));
 assert.deepEqual([recordInvalid(k4),exOf(k4.state).w],[['base_load'],100],'a claim on a Close that captured no accepted earn\'s card');
 // The pick is the MOST RECENTLY accepted matching earn (:155): with the ladder [95,100,105,110],
 // Q1 (DEBUT 105 on base 100) is missed at 95 on C3 and that 95 is adopted; C4, C5 top at 95 with
 // at least 3 reps left and PROPOSED 105 on base 95 is accepted (Q2); C6 captures Q2's 105 card and
 // is lifted at 100 (missed). Both Q1 and Q2 are unlanded, uncancelled earns whose card is C6's
 // capture: C6's claimed adoption is anchored to Q2's base 95, never to Q1's 100 (R2 and a rename).
 const S=()=>F0({steps:[95,100,105,110]}),SR=()=>F0({steps:[95,100,105,110],n:'Fx Press Renamed'});
 const d1=C(1,{reps:TOP,effort:e(2,1,1)}),d2=C(2,{reps:TOP,effort:e(2,1,1)}),d3=C(3,{date:'2026-10-12',reps:[8,7,6],loads:95,prescribed:105,effort:e(2,1,1)});
 const q1=checkOf(foldArgs([d1,d2],[],'fx-revision-1',S()),LIFT,d2).offers.find(o=>decisionOf(o).candidate.newW===105);assert.ok(q1,'control: DEBUT 105 on base 100');
 const y1=acceptOp(q1,{op_id:'fx-resp-1',after:2}),a3=checkOf(foldArgs([d1,d2,d3],[y1],'fx-revision-1',S()),LIFT,d3).offers[0];
 assert.deepEqual([decisionOf(a3).kind,decisionOf(a3).target_load.scalar],['adopt-observed',lb(95)],'control: the claimed 95');
 const y3=acceptOp(a3,{op_id:'fx-resp-3',after:3});
 const d4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:95,effort:e(2,1,AT_LEAST_3)}),d5=C(5,{date:'2026-10-19',reps:TOP,loads:95,prescribed:95,effort:e(2,1,AT_LEAST_3)});
 const ev5=checkOf(foldArgs([d1,d2,d3,d4,d5],[y1,y3],'fx-revision-1',S()),LIFT,d5),q2=ev5.status==='offer'?ev5.offers.find(o=>decisionOf(o).candidate&&decisionOf(o).candidate.newW===105):null;
 assert.ok(q2,'control: PROPOSED 105 on base 95 '+JSON.stringify(ev5.refusal||ev5.offers.map(o=>decisionOf(o).candidate)));
 assert.equal(decisionOf(q2).base_load.scalar.value,95);
 const y5=acceptOp(q2,{op_id:'fx-resp-5',after:5}),d6=C(6,{date:'2026-10-22',reps:[8,7,6],loads:100,prescribed:105,effort:e(2,1,1)}),six=[d1,d2,d3,d4,d5,d6];
 const a6=checkOf(foldArgs(six,[y1,y3,y5],'fx-revision-1',S()),LIFT,d6);assert.equal(a6.status,'offer',JSON.stringify(a6.refusal));
 assert.deepEqual([decisionOf(a6.offers[0]).kind,decisionOf(a6.offers[0]).base_load.scalar,decisionOf(a6.offers[0]).basis.load_basis.authority_refs],['adopt-observed',lb(95),[ref(d6.close)]],'control: claimed, base 95');
 const y6=acceptOp(a6.offers[0],{op_id:'fx-resp-6',after:6});
 for(const [label,base] of [['R2',S()],['rename R2',SR()]]){
  const g=EFFECTS.m.foldNativeLoad(foldArgs(six,[y1,y3,y5,y6],'fx-revision-2',base));
  assert.deepEqual([exOf(g.state).w,recordInvalid(g)],[100,[]],label+' the most recent matching earn anchors the claim '+JSON.stringify(g.issues));
 }
});
test('N29-ANCHOR-CONTROL (spec R9.9 :155 "The claim is never inferred", D1 N29 ANCHOR CONTROL; l11 A1): no answer on C3 (missed at 95); C4 at 105 on the 100 card -> [adopt-observed 105] (base 100, authority_refs []), yes -> w 105; C5 on the 105 card at 100 -> [adopt-observed 100] (base 105, authority_refs []), yes -> w 100; both records replayed under R2 and after a rename apply as written, and C5\'s is anchored to its capture 105, never to Q105\'s base 100',()=>{
 effectsGate();
 const m=missedDebut(95),c4=C(4,{date:'2026-10-15',reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)}),c5=C(5,{date:'2026-10-19',reps:TOP,loads:100,prescribed:105,effort:e(2,1,1)});
 const four=[...m.three,c4],five=[...four,c5];
 const ev4=checkOf(foldArgs(four,[m.resp]),LIFT,c4),d4=decisionOf(ev4.offers[0]);
 assert.deepEqual([ev4.offers.length,d4.kind,d4.target_load.scalar,d4.base_load.scalar,d4.basis.load_basis.authority_refs],[1,'adopt-observed',lb(105),lb(100),[]]);
 const y4=acceptOp(ev4.offers[0],{op_id:'fx-resp-4',after:4});
 assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs(four,[m.resp,y4])).state).w,105);
 const ev5=checkOf(foldArgs(five,[m.resp,y4]),LIFT,c5),d5=decisionOf(ev5.offers[0]);
 assert.deepEqual([ev5.offers.length,d5.kind,d5.target_load.scalar,d5.base_load.scalar,d5.basis.load_basis.authority_refs],[1,'adopt-observed',lb(100),lb(105),[]]);
 const y5=acceptOp(ev5.offers[0],{op_id:'fx-resp-5',after:5});
 for(const [label,rev,base] of [['R1','fx-revision-1',F0()],['R2','fx-revision-2',F0()],['rename','fx-revision-1',F0({n:'Fx Press Renamed'})],['rename R2','fx-revision-2',F0({n:'Fx Press Renamed'})]]){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(five,[m.resp,y4,y5],rev,base));
  assert.deepEqual([exOf(f.state).w,recordInvalid(f),liveQ(f,m.spend)],[100,[],[[true,'MISSED']]],label+' '+JSON.stringify(f.issues));
 }
});
test('N29-FLIP (spec R9.9 :152 "Land versus miss is a projection of the current facts at every fold ... never re-queues the entry", J (h)): C3 landed at 105, then set 2 corrected to 95 -> at the next projection Q is MISSED and w 100, never pending again; the reverse (C3 at 95, every set corrected to 105) lands (w 105, ESTABLISH); R1 and R2',()=>{
 effectsGate();
 const land=missedDebut(105),miss=missedDebut(95);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs(land.three,[land.resp],rev)).state).w,105,'control: C3 lands before the correction');
  const f=EFFECTS.m.foldNativeLoad(foldArgs([...land.cs,loadFix(land.c3,{2:95})],[land.resp],rev));
  assert.deepEqual([liveQ(f,land.spend),n29Fields(f)],[[[true,'MISSED']],N29_UNCHANGED],rev);
  const g=EFFECTS.m.foldNativeLoad(foldArgs([...miss.cs,loadFix(miss.c3,{1:105,2:105,3:105})],[miss.resp],rev));
  assert.deepEqual([liveQ(g,miss.spend),exOf(g.state).w],[[[true,'ESTABLISH']],105],rev);
 }
});
test('N29-FLIP-YES (spec R9.9 :155 A2 "landed by the claimed Close itself", D1 N29 FLIP-YES; l11 A2): yes to 95 on C3 (claim [C3 Close Ref]), then every C3 set corrected to 105 -> at the next projection C3 lands (Q ESTABLISH, w 105); the 95 record\'s claim still verifies, so it is never RECORD_INVALID: it is held by the ordinary later-edit rules with its spend kept, and nothing raises; R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(95),exit=checkOf(foldArgs(m.three,[m.resp]),LIFT,m.c3).offers[0],d=decisionOf(exit),yes=acceptOp(exit,{op_id:'fx-resp-3',after:3});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([...m.cs,loadFix(m.c3,{1:105,2:105,3:105})],[m.resp,yes],rev));
  assert.deepEqual([liveQ(f,m.spend),exOf(f.state).w,recordInvalid(f)],[[[true,'ESTABLISH']],105,[]],rev+' '+JSON.stringify(f.issues));
  assert.ok(f.spent.some(x=>x.spend_id===d.spend_id&&!x.cancelled_by),rev+' spend kept');
  assert.ok(f.issues.some(i=>i.lift===LIFT&&EFFECTS.m.isHold(i)&&(i.refs||[]).some(r=>r.op_id==='fx-resp-3')),rev+' held by the later-edit rules '+JSON.stringify(f.issues));
 }
});
test('N29-LATER-HOLD R9.10 (spec R9.9 J OTHER-HOLD ANCHOR, LATER HOLD; D-R9.9-LATER-HOLD; R9.10 J LATER HOLD and L LATER HOLD UNDO, DECISIONS:804): yes to 95 applied (w 95), then C1 corrected -> Q105\'s accept is BASIS_REPAIR_REQUIRED, so C3 does not consume it: Q pending again and hidden, the lift shows the baseline ask; the 95 record meets TARGET_QUEUED (refused and not applied; R9.10: held back with its spend kept in the spend index); exit (a) on Q refuses COMPENSATION_DESCENDANTS; exit (b): C4 on the baseline ask proven after the hold offers [adopt-baseline 95], whose yes supersedes Q (done, SUPERSEDED, spend kept); nothing raises; R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(95),exit=checkOf(foldArgs(m.three,[m.resp]),LIFT,m.c3).offers[0],d=decisionOf(exit),yes=acceptOp(exit,{op_id:'fx-resp-3',after:3});
 const cs=[C(1,{reps:TOP,effort:e(2,1,1),corrected:{3:7}}),m.cs[1]],three=[...cs,m.c3],c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:null,effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs(three,[m.resp,yes],rev),f=EFFECTS.m.foldNativeLoad(a);
  assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED'&&i.spend_id===m.spend),rev+' '+JSON.stringify(f.issues));
  assert.deepEqual(liveQ(f,m.spend),[[false,'DEBUT']],rev+' not consumed on a disputed spend');
  assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_TARGET_QUEUED'&&(i.refs||[]).some(r=>r.op_id==='fx-resp-3')),rev+' the 95 record meets TARGET_QUEUED');
  assert.ok(f.spent.some(x=>x.spend_id===d.spend_id&&!x.cancelled_by),rev+' R9.10 LATER HOLD UNDO: held back, its spend kept (was: not in the spend index)');
  assert.deepEqual([exOf(f.state).w,cardLoads(EFFECTS.m.heldProjection(f).state)],[100,[null,null,null]],rev+' the baseline ask');
  expectRefusal(checkOf(a,LIFT,m.c3,{compensate:m.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
  const ev=checkOf(foldArgs([...three,c4],[m.resp,yes],rev),LIFT,c4);assert.equal(ev.status,'offer',rev+' '+JSON.stringify(ev.refusal));
  assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',95]],rev);
  const g=EFFECTS.m.foldNativeLoad(foldArgs([...three,c4],[m.resp,yes,acceptOp(ev.offers[0],{op_id:'fx-resp-4',after:4})],rev));
  assert.deepEqual([exOf(g.state).w,liveQ(g,m.spend)],[95,[[true,'SUPERSEDED']]],rev);
  assert.ok(g.spent.some(x=>x.spend_id===m.spend&&!x.cancelled_by),rev+' spend kept');
 }
});
test('N29-DISPUTED (spec R9.9 :152 "its spend is neither disputed, :166, nor held", J OTHER-HOLD ANCHOR): C2 corrected after the yes (BASIS_REPAIR_REQUIRED) and C3 lifted at 95 on the 105 card -> Q is not consumed: pending, held and hidden (the baseline ask, never 105 again); exit (b), C4 on the baseline ask at 95, supersedes it (done, SUPERSEDED, spend kept, w 95); R1 and R2',()=>{
 effectsGate();
 const {cs2,resp,spend}=correctedScenario();
 const c3=C(3,{date:'2026-10-12',reps:[8,7,6],loads:95,prescribed:105,effort:e(2,1,1)}),c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:null,effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([...cs2,c3],[resp],rev));
  assert.deepEqual(liveQ(f,spend),[[false,'DEBUT']],rev);assert.equal(exOf(f.state).w,100,rev);
  assert.ok(EFFECTS.m.heldProjection(f).lifts.has(LIFT),rev+' held');
  assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(f).state),[null,null,null],rev+' hidden: the baseline ask');
  const ev=checkOf(foldArgs([...cs2,c3,c4],[resp],rev),LIFT,c4);assert.equal(ev.status,'offer',rev+' '+JSON.stringify(ev.refusal));
  assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',95]],rev);
  const g=EFFECTS.m.foldNativeLoad(foldArgs([...cs2,c3,c4],[resp,acceptOp(ev.offers[0],{op_id:'fx-resp-4',after:4})],rev));
  assert.deepEqual([exOf(g.state).w,liveQ(g,spend)],[95,[[true,'SUPERSEDED']]],rev);assert.ok(g.spent.some(x=>x.spend_id===spend&&!x.cancelled_by),rev);
 }
});
test('N29-DEVICE (spec R9.9 :152, :165, J SECOND DEVICE (i)-(iii), D-R9.9-TWO-CLOSE-YES, D-R9.9-TWO-CLOSE-LAND): (i) the yes on device B with no proven order before C3\'s Start -> DEBUT_BASIS_UNPROVEN causality [C3 Close, yes], Q pending and unconsumed, w 100, the check TARGET_QUEUED, and a claimed yes on that Close refuses base_load; (iii) an Undo of Q recorded on a device that had not seen C3 is not applied (COMPENSATION_DESCENDANTS) and C3 consumes Q; (ii) C3 (95) and C4 (105) both captured 105 after the yes: C3, first in the workout order, consumes Q as MISSED and the check on C4 refuses PLAN_CHANGED [C4 Close Ref], identically under both delivery orders and R1/R2; a yes recorded on C4 while it was the visible missed Close stands when C3 missed (w 95; a new check on C4 is PLAN_CHANGED) and refuses RECORD_INVALID base_load when C3 landed (the lift held, nothing raises)',()=>{
 effectsGate();
 const m=missedDebut(95);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs(m.three,[{...m.resp,device:'fx-device-B'}],rev),f=EFFECTS.m.foldNativeLoad(a);
  const i=f.issues.find(x=>x.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN');
  assert.deepEqual(i&&[i.field,i.refs],['causality',[ref(m.c3.close),ref('fx-resp-1')]],rev+' '+JSON.stringify(f.issues));
  assert.deepEqual([liveQ(f,m.spend),exOf(f.state).w],[[[false,'DEBUT']],100],rev);
  expectRefusal(checkOf(a,LIFT,m.c3),'TARGET_QUEUED',[ref('fx-resp-1')]);
  // A claimed adoption of that Close (issued where the order was proven) is refused base_load here:
  // the earn's acceptance is not proven before the Start, so the claim does not verify (:155).
  const claimed=checkOf(foldArgs(m.three,[m.resp]),LIFT,m.c3).offers[0];
  const u=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[{...m.resp,device:'fx-device-B'},acceptOp(claimed,{op_id:'fx-resp-3',after:3})],'fx-revision-2'));
  assert.deepEqual([recordInvalid(u),exOf(u.state).w],[['base_load'],100],rev+' '+JSON.stringify(u.issues));
  // (iii) An Undo of Q105 recorded on a device that had not seen C3 (issued at the C1, C2 cut, no
  // causal link to C3's Start) is not applied: C3's Start captured Q105 (COMPENSATION_DESCENDANTS,
  // :154), and C3 then consumes Q as MISSED.
  const undo=checkOf(foldArgs(m.cs,[m.resp]),LIFT,m.cs[1],{compensate:m.spend});assert.equal(undo.status,'offer','control: Undo offered before C3');
  const ua=foldArgs(m.three,[m.resp],rev);ua.generation.collections.ops['fx-resp-u']={op_id:'fx-resp-u',athlete_id:ATH,device_id:'fx-device-B',device_seq:1,class:'plan',kind:'proposal-response',payload:acceptOp(undo.offers[0],{op_id:'fx-resp-u'}).payload,canonical_content_commitment:commit('fx-resp-u')};
  const uf=EFFECTS.m.foldNativeLoad(ua);
  assert.deepEqual([liveQ(uf,m.spend),uf.spent.find(x=>x.spend_id===m.spend).cancelled_by,(uf.issues.find(i=>i.code==='NATIVE_LOAD_COMPENSATION_DESCENDANTS')||{}).refs],[[[true,'MISSED']],null,[ref('fx-resp-u')]],rev+' (iii) '+JSON.stringify(uf.issues));
 }
 const c4=C(4,{date:'2026-10-15',reps:[8,7,6],loads:105,prescribed:105,effort:e(2,1,1)}),c4m=C(4,{date:'2026-10-15',reps:[8,7,6],loads:95,prescribed:105,effort:e(2,1,1)});
 const late=a=>{const ops=a.generation.collections.ops;let k=0;for(const id of m.c3.ops){ops[id].device_id='fx-device-B';ops[id].device_seq=2000+(++k);}ops[m.c3.start].causal_parents=['fx-resp-1'];return a;};
 const outcome=f=>JSON.stringify([f.state.queue.filter(q=>q.native_load_spend),exOf(f.state).w,f.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code)]);
 const seen=new Set();
 for(const rev of ['fx-revision-1','fx-revision-2'])for(const [name,lay] of [['one device',a=>a],['C3 delivered late',late]]){
  const a=lay(foldArgs([...m.three,c4],[m.resp],rev)),f=EFFECTS.m.foldNativeLoad(a),q=f.state.queue.find(x=>x.native_load_spend===m.spend);
  assert.deepEqual([q.done,q.state,q.native_load_missed_by,exOf(f.state).w],[true,'MISSED',m.c3.close,100],name+' '+rev);
  expectRefusal(checkOf(a,LIFT,c4),'PLAN_CHANGED',[ref(c4.close)]);seen.add(outcome(f));
 }
 assert.equal(seen.size,1,'identical under both delivery orders and both revisions');
 // A claim on C4, which captured the debut card but did not consume Q (C3 did) and whose actual
 // loads EQUAL the target, does not verify (no original slot differs from it): base_load.
 const eq=structuredClone(checkOf(foldArgs([...m.cs,c4m],[m.resp]),LIFT,c4m).offers[0]),eb=decisionOf(eq);
 for(const it of eb.evidence)for(const st of it.sets)for(const fk of ['original','current'])if(st&&st[fk]&&st[fk].load)st[fk].load={...st[fk].load,value:105};
 eb.target_load={scalar:lb(105),vector:Loads(105,105,105)};
 const kf=EFFECTS.m.foldNativeLoad(foldArgs([...m.three,c4],[m.resp,acceptOp(eq,{op_id:'fx-resp-E',after:4})],'fx-revision-2'));
 assert.deepEqual([recordInvalid(kf),exOf(kf.state).w],[['base_load'],100],'a claim whose actual loads equal the target is no miss '+JSON.stringify(kf.issues));
 const view=checkOf(foldArgs([...m.cs,c4m],[m.resp]),LIFT,c4m);assert.equal(view.status,'offer',JSON.stringify(view.refusal));
 assert.deepEqual(decisionOf(view.offers[0]).basis.load_basis.authority_refs,[ref(c4m.close)],'control: device A saw C4 as the missed Close');
 const yesA=acceptOp(view.offers[0],{op_id:'fx-resp-A',after:4});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs([...m.three,c4m],[m.resp,yesA],rev),f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([exOf(f.state).w,recordInvalid(f),liveQ(f,m.spend)],[95,[],[[true,'MISSED']]],rev+' the recorded yes stands '+JSON.stringify(f.issues));
  expectRefusal(checkOf(a,LIFT,c4m),'PLAN_CHANGED',[ref(c4m.close)]);
  const land=missedDebut(105),g=EFFECTS.m.foldNativeLoad(foldArgs([...land.three,c4m],[land.resp,yesA],rev));
  assert.deepEqual([exOf(g.state).w,liveQ(g,land.spend)],[105,[[true,'ESTABLISH']]],rev);
  assert.ok(g.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='base_load'&&i.lift===LIFT&&(i.refs||[]).some(r=>r.op_id==='fx-resp-A')),rev+' '+JSON.stringify(g.issues));
 }
});
test('N29-VECTOR (spec R9.9 J UNEQUAL VECTORS, :144): the N11 lift (w 100, wSets [100,95], sets 2) with DEBUT [105,100] accepted; its debut card missed at [100,95] -> Q MISSED, w 100, wSets [100,95], the check refuses PLAN_CHANGED [C3 Close Ref] (earn branch of a missed Close); missed at [95,90] -> VECTOR_ADOPTION_UNDEFINED [C3 Close Ref] (a vector plan never adopts); R1 and R2',()=>{
 effectsGate();
 const {cs,base,offers}=n11Checked(),b=acceptOp(offers[1],{after:2,op_id:'fx-resp-b'}),spend=decisionOf(offers[1]).spend_id;
 assert.deepEqual(decisionOf(offers[1]).candidate.newWSets,[105,100],'control: the DEBUT [105,100]');
 for(const [loads,want] of [[[100,95],'PLAN_CHANGED'],[[95,90],'VECTOR_ADOPTION_UNDEFINED']])for(const rev of ['fx-revision-1','fx-revision-2']){
  const c3=C(3,{date:'2026-10-12',reps:[8,7],loads,prescribed:[105,100],effort:e(2,1)}),a=foldArgs([...cs,c3],[b],rev,base),f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([liveQ(f,spend),exOf(f.state).w,exOf(f.state).wSets],[[[true,'MISSED']],100,[100,95]],loads+' '+rev+' '+JSON.stringify(f.issues));
  assert.equal(EFFECTS.m.heldProjection(f).lifts.has(LIFT),false);
  expectRefusal(checkOf(a,LIFT,c3),want,[ref(c3.close)]);
 }
});
// N29-VECTOR-LAYOUT (the R9.9 characterization of the refused day, DECISIONS:802 (A)) is updated for R9.10 to
// N29-VECTOR-LAYOUT-R9.10 in the round-19 block at the end of this file (spec R9.10 D1 N29 VECTOR LAYOUT "replaces the
// R9.9 refused-day expectation", L; DECISIONS:803 (e)); its red on the R9.10 product is retained in the round-19 report.
const SETS=n=>F0({sets:n});
test('N29-LAYOUT-LAND (spec R9.9 :152 LAYOUT, J (j); DECISIONS:801 (1)): fx-press sets edited 3 -> 2 after the yes; C3\'s card is 105 on 2 sets (Q105\'s card, SELECTED ENTRY); C3 at 105 on both [8,7] lands: Q ESTABLISH, w 105, wAt C3, last [8,7], wSets absent, effect landed, the spend index close_ref C3, DEBUT_LANDED; the next card 105 on 2 sets; R1 and R2, typed v2 and host v1',()=>{
 effectsGate();
 const m=missedDebut(105,[8,7]);
 assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs(m.cs,[m.resp],'fx-revision-1',SETS(2)))).state),[105,105],'control: the debut card is 105 on 2 sets');
 for(const v1 of [false,true])for(const rev of ['fx-revision-1','fx-revision-2']){
  const label=(v1?'v1 ':'v2 ')+rev,{a,c}=n29Args(m.cs,m.c3,[m.resp],{v1,rev,base:SETS(2),card:[105,105]}),f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([liveQ(f,m.spend),n29Fields(f)],[[[true,'ESTABLISH']],{w:105,wSets:undefined,wAt:c.date,last:[8,7],auth:{kind:'landed',spend_id:m.spend,close_op_id:c.close,response_refs:[ref('fx-resp-1')]}}],label+' '+JSON.stringify(f.issues));
  assert.deepEqual([f.effects.map(y=>[y.kind,y.close_ref]),f.spent.find(x=>x.spend_id===m.spend).close_ref],[[['landed',ref(c.close)]],ref(c.close)],label);
  expectRefusal(checkOf(a,LIFT,c),'DEBUT_LANDED',[ref(c.close)]);
  assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(f).state),[105,105],label);
 }
});
test('N29-LAYOUT-MISS (spec R9.9 :152 LAYOUT, :155 anchor projection, J (k); DECISIONS:801 (1)): sets edited 3 -> 2 after the yes; C3 at 95 on both sets -> Q MISSED, every field unchanged, no hold; the check on C3 offers [adopt-observed 95 on 2 slots] with base scalar 100, fields.w present 100, fields.wSets absent, base vector [100,100] (Q105\'s recorded base projected over the 2 captured slots), load_basis.sets 2, claim [C3 Close Ref]; Undo of Q refuses COMPENSATION_DESCENDANTS; the next card 100 on 2 sets (95 after the yes), never 105; the yes replayed under R2 and after a rename applies as written; the same record with the accepted-count base vector [100,100,100] refuses RECORD_INVALID base_load (also with load_basis.sets 3); variant [105,95] -> MISSED, VECTOR_ADOPTION_UNDEFINED [C3 Close Ref]; R1 and R2, typed v2 and host v1',()=>{
 effectsGate();
 const m=missedDebut(95,[8,7]),mixed=missedDebut([105,95],[8,7]);
 for(const v1 of [false,true])for(const rev of ['fx-revision-1','fx-revision-2']){
  const label=(v1?'v1 ':'v2 ')+rev,{a,c}=n29Args(m.cs,m.c3,[m.resp],{v1,rev,base:SETS(2),card:[105,105]}),f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([liveQ(f,m.spend),n29Fields(f),EFFECTS.m.heldProjection(f).lifts.has(LIFT)],[[[true,'MISSED']],N29_UNCHANGED,false],label+' '+JSON.stringify(f.issues));
  assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(f).state),[100,100],label);
  const ev=checkOf(a,LIFT,c);assert.equal(ev.status,'offer',label+' '+JSON.stringify(ev.refusal));
  const d=decisionOf(ev.offers[0]);
  assert.deepEqual([d.kind,d.target_load,d.base_load.scalar,d.base_load.fields.w,d.base_load.fields.wSets,d.base_load.vector,d.basis.load_basis.sets,d.basis.load_basis.authority_refs],
   ['adopt-observed',{scalar:lb(95),vector:Loads(95,95)},lb(100),{present:true,value:100},{present:false,value:null},Loads(100,100),2,[ref(c.close)]],label);
  expectRefusal(checkOf(a,LIFT,c,{compensate:m.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
  const x=n29Args(mixed.cs,mixed.c3,[mixed.resp],{v1,rev,base:SETS(2),card:[105,105]});
  assert.deepEqual(liveQ(EFFECTS.m.foldNativeLoad(x.a),mixed.spend),[[true,'MISSED']],label);
  expectRefusal(checkOf(x.a,LIFT,x.c),'VECTOR_ADOPTION_UNDEFINED',[ref(x.c.close)]);
 }
 const exit=checkOf(foldArgs(m.three,[m.resp],'fx-revision-1',SETS(2)),LIFT,m.c3).offers[0],yes=acceptOp(exit,{op_id:'fx-resp-3',after:3});
 for(const [label,rev,base] of [['R1','fx-revision-1',SETS(2)],['R2','fx-revision-2',SETS(2)],['rename','fx-revision-1',F0({sets:2,n:'Fx Press Renamed'})],['rename R2','fx-revision-2',F0({sets:2,n:'Fx Press Renamed'})]]){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,yes],rev,base));
  assert.deepEqual([exOf(f.state).w,liveQ(f,m.spend),recordInvalid(f)],[95,[[true,'MISSED']],[]],label+' '+JSON.stringify(f.issues));
  assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(f).state),[95,95],label);
 }
 const forged=(sets)=>{const o=structuredClone(exit),d=decisionOf(o);d.base_load.vector=Loads(100,100,100);if(sets)d.basis.load_basis.sets=sets;
  return EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,acceptOp(o,{op_id:'fx-resp-3',after:3})],'fx-revision-2',SETS(2)));};
 for(const sets of [null,3]){const f=forged(sets);assert.deepEqual([recordInvalid(f),exOf(f.state).w],[['base_load'],100],'accepted-count base vector, load_basis.sets '+sets);}
});
test('N29-LAYOUT-UNDO (spec R9.9 :154, K LAYOUT (3) capturedAfter; DECISIONS:801 (1)): sets edited 3 -> 2 after the yes; a Start capturing the scalar debut card at 2 slots [105,105] is a descendant of Q105: after J (k) the Undo of Q refuses COMPENSATION_DESCENDANTS; while that Start is still open the Undo check refuses COMPENSATION_DESCENDANTS; an Undo issued before the Start and recorded after it is not applied by the fold (Q stays pending, no tombstone, COMPENSATION_DESCENDANTS names the Undo); R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(95,[8,7]);
 const openStart=(a)=>{const ops=a.generation.collections.ops,last=Object.values(ops).reduce((x,y)=>Math.max(x,y.device_seq),0);
  ops[m.c3.start]={op_id:m.c3.start,athlete_id:ATH,device_id:DEVICE,device_seq:last+1,class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(m.c3.start)};captureOn(a.generation,m.c3,[105,105]);return a;};
 const undo=checkOf(foldArgs(m.cs,[m.resp]),LIFT,m.cs[1],{compensate:m.spend});assert.equal(undo.status,'offer','control: Undo offered before any Start');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  expectRefusal(checkOf(foldArgs(m.three,[m.resp],rev,SETS(2)),LIFT,m.c3,{compensate:m.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
  expectRefusal(checkOf(openStart(foldArgs(m.cs,[m.resp],rev,SETS(2))),LIFT,m.cs[1],{compensate:m.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-1')]);
  const a=openStart(foldArgs(m.cs,[m.resp],rev,SETS(2))),ops=a.generation.collections.ops,u=acceptOp(undo.offers[0],{op_id:'fx-resp-2'});
  ops['fx-resp-2']={op_id:'fx-resp-2',athlete_id:ATH,device_id:DEVICE,device_seq:ops[m.c3.start].device_seq+1,class:'plan',kind:'proposal-response',payload:u.payload,canonical_content_commitment:commit('fx-resp-2')};
  const f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([liveQ(f,m.spend),f.spent.find(x=>x.spend_id===m.spend).cancelled_by],[[[false,'DEBUT']],null],rev+' '+JSON.stringify(f.issues));
  assert.deepEqual(f.issues.find(i=>i.code==='NATIVE_LOAD_COMPENSATION_DESCENDANTS').refs,[ref('fx-resp-2')],rev);
 }
});
test('N29-LAYOUT-UP (spec R9.9 :152 LAYOUT "An increase lands the same way", J (j); DECISIONS:801 (1)): sets edited 3 -> 4 after the yes; C3 at 105 on all 4 lands (w 105, last [8,7,6,5]); C3 at 105 on 3 of 4 with 100 on the fourth is MISSED (w 100) and its check refuses VECTOR_ADOPTION_UNDEFINED [C3 Close Ref]; R1 and R2, typed v2 and host v1',()=>{
 effectsGate();
 const land=missedDebut(105,[8,7,6,5]),miss=missedDebut([105,105,105,100],[8,7,6,5]);
 for(const v1 of [false,true])for(const rev of ['fx-revision-1','fx-revision-2']){
  const label=(v1?'v1 ':'v2 ')+rev,L4={v1,rev,base:SETS(4),card:[105,105,105,105]};
  const x=n29Args(land.cs,land.c3,[land.resp],L4),f=EFFECTS.m.foldNativeLoad(x.a);
  assert.deepEqual([liveQ(f,land.spend),exOf(f.state).w,exOf(f.state).last],[[[true,'ESTABLISH']],105,[8,7,6,5]],label+' '+JSON.stringify(f.issues));
  const y=n29Args(miss.cs,miss.c3,[miss.resp],L4),g=EFFECTS.m.foldNativeLoad(y.a);
  assert.deepEqual([liveQ(g,miss.spend),n29Fields(g)],[[[true,'MISSED']],N29_UNCHANGED],label);
  expectRefusal(checkOf(y.a,LIFT,y.c),'VECTOR_ADOPTION_UNDEFINED',[ref(y.c.close)]);
 }
});
// Round 17 (Fable l8 D-L8F-4), rewritten in round 18 for spec R9.9 :155 (l11 A1): the Close claim
// moved from the adopt-baseline exit to the adopt-observed offer (the MISSED-DEBUT ANCHOR). A Close
// is never an admitted ref of an adopt-baseline; a claim is exactly [the latest consumed Close],
// verified structurally from the fold's accepted records. Otherwise RECORD_INVALID base_load.
test('R17-ANCHOR-STRUCTURAL R9.9 (spec R9.9 :155 MISSED-DEBUT ANCHOR, Fable l8 D-L8F-4 P4a): two lifts, yes Q105 on fx-press (fx-resp-1) and on fx-row (fx-resp-r); C3 captures 105 and fx-press is lifted at 95 (the missed debut); its genuine [adopt-observed 95] claiming [C3 Close] applies under R2 (w 95). The same record claiming instead a Close that is not the consumed one, the C3 Start, the Q yes, or fx-row\'s record -> RECORD_INVALID base_load each, w stays 100; an adopt-baseline naming the consumed C3 Close -> base_load; the adopt-baseline naming the Q yes that no hold names is RE-PINNED by the PM ruling STOP-R912-1/-2 option (C) (spec R9.12 revision 3, RESIDUAL (iv) :157): w 95, no issue of fx-press, under R2 and R1 alike (R17-anchor-holding is now killed by N28-B5-POST-ANCHOR (a) and N28-B5-SUPERSEDED-HOLD, round 20 part B2). P4a unchanged. Device B: an adopt-observed 105 claiming the unproven Close (actual equal to the target, no miss, Q pending) -> base_load',()=>{
 effectsGate();
 const base=()=>withRow(),cs=[twoLift(1,{reps:TOP,effort:e(2,1,1)}),twoLift(2,{reps:TOP,effort:e(2,1,1)})];
 const oL=checkOf(foldArgs(cs,[],'fx-revision-1',base()),LIFT,cs[1]).offers[0],oR=checkOf(foldArgs(cs,[],'fx-revision-1',base()),ROW,cs[1]).offers[0];
 assert.ok(oL&&oR,'control: an earn offer on each lift');
 const respL=acceptOp(oL,{op_id:'fx-resp-1',after:2}),respR=acceptOp(oR,{op_id:'fx-resp-r',after:2});
 const c3=C(3,{date:'2026-10-12',reps:[8,7,6],loads:95,prescribed:105,effort:e(2,1,1)}),three=[...cs,c3];
 const ev=checkOf(foldArgs(three,[respL,respR],'fx-revision-1',base()),LIFT,c3);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
 const exit=ev.offers[0];assert.deepEqual([decisionOf(exit).kind,decisionOf(exit).basis.load_basis.authority_refs],['adopt-observed',[ref(c3.close)]],'control: the offer claims the missed Close');
 const run=(patch)=>{const o=structuredClone(exit);if(patch)patch(decisionOf(o));
  return EFFECTS.m.foldNativeLoad(foldArgs(three,[respL,respR,acceptOp(o,{op_id:'fx-resp-3',after:3})],'fx-revision-2',base()));};
 const g=run(null);assert.equal(exOf(g.state).w,95,'control: the genuine claim applies');
 assert.ok(!g.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.lift===LIFT),JSON.stringify(g.issues));
 const nil={present:true,value:null},baseline=d=>{d.kind='adopt-baseline';d.reason_key='baseline';d.basis.load_basis.w=nil;d.base_load.fields.w=nil;d.base_load.scalar=null;d.base_load.vector=d.base_load.vector.map(()=>null);};
 const out=[],want=[];
 for(const [name,patch] of [['a Close that is not the consumed one',d=>{d.basis.load_basis.authority_refs=[ref(cs[1].close)];}],['the C3 Start',d=>{d.basis.load_basis.authority_refs=[ref(c3.start)];}],
   ['the Q yes',d=>{d.basis.load_basis.authority_refs=[ref('fx-resp-1')];}],['fx-row\'s record',d=>{d.basis.load_basis.authority_refs=[ref('fx-resp-r')];}],['an adopt-baseline naming the consumed Close',baseline],
   ['an adopt-baseline naming the Q yes (no hold names it)',d=>{baseline(d);d.basis.load_basis.authority_refs=[ref('fx-resp-1')];}]]){
  const f=run(patch);
  out.push([name,f.issues.filter(i=>i.lift===LIFT&&['NATIVE_LOAD_RECORD_INVALID','NATIVE_LOAD_EFFECT_CONFLICT'].includes(i.code)).map(i=>i.code+':'+i.field),exOf(f.state).w]);
  // R9.12 revision 3 RE-PIN of this loop's last case only (PM ruling STOP-R912-1/-2, option (C); spec M R9.12 NEW ROWS, RESIDUAL
  // (iv) :157; a ruled semantics change, not a fit; D-R12L3-4: every other tuple of this loop is built exactly as before). 'an
  // adopt-baseline naming the Q yes (no hold names it)' was [name, ['NATIVE_LOAD_RECORD_INVALID:base_load'], 100] at 189d076 and on
  // the round-20 part-B1 product: under R2 (this row's revision) RECORD_INVALID base_load [fx-resp-3], w 100, the record absent from
  // spent; under R1 EFFECT_CONFLICT load_basis [fx-resp-3], w 100 (R912W out-base.json; printed again in round 20 part B2). As ruled
  // it is the never-held exit: no RECORD_INVALID or EFFECT_CONFLICT of fx-press, w 95, wSets absent, the record in spent and not
  // cancelled, under R2 and R1 alike (the R1 case is asserted below). Native entry state after it (D-R12L3-1): Q105 stays done/MISSED (C3 consumed it before the record; the exit retires nothing), and the record's recorded Undo (RESTORE, base 95, target null) restores w null, the held projection's image, not the pre-exit 100 (measured in round 20 part B2 under R2 and R1).
  want.push(name==='an adopt-baseline naming the Q yes (no hold names it)'?[name,[],95]:[name,['NATIVE_LOAD_RECORD_INVALID:base_load'],100]);
 }
 assert.deepEqual(out,want);
 {const o=structuredClone(exit),d=decisionOf(o);baseline(d);d.basis.load_basis.authority_refs=[ref('fx-resp-1')];
  const f1=EFFECTS.m.foldNativeLoad(foldArgs(three,[respL,respR,acceptOp(o,{op_id:'fx-resp-3',after:3})],'fx-revision-1',base()));
  assert.deepEqual([f1.issues.filter(i=>i.lift===LIFT&&['NATIVE_LOAD_RECORD_INVALID','NATIVE_LOAD_EFFECT_CONFLICT'].includes(i.code)).map(i=>i.code+':'+i.field),exOf(f1.state).w],[[],95],'R9.12 re-pin: the Q-yes adopt-baseline under R1 equals R2 '+JSON.stringify(f1.issues));}
 // P4a: a non-held lift, card 100, lifted 110; the genuine adopt-observed re-shaped into a baseline exit.
 const p1=C(1,{reps:TOP,loads:110,effort:e(2,1,1)}),po=checkOf(foldArgs([p1],[]),LIFT,p1).offers.find(o=>decisionOf(o).kind==='adopt-observed');
 assert.ok(po,'control: adopt-observed 110');
 const craft=structuredClone(po),b=decisionOf(craft);baseline(b);b.basis.load_basis.authority_refs=[ref(p1.close)];
 const f=EFFECTS.m.foldNativeLoad(foldArgs([p1],[acceptOp(craft,{after:1})],'fx-revision-2'));
 assert.deepEqual(f.issues.filter(i=>['NATIVE_LOAD_RECORD_INVALID','NATIVE_LOAD_EFFECT_CONFLICT'].includes(i.code)).map(i=>i.code+':'+i.field),['NATIVE_LOAD_RECORD_INVALID:base_load'],JSON.stringify(f.issues));
 assert.equal(exOf(f.state).w,100);
 // Not a miss: the yes on device B has no proven order before C3's Start (R2-DEVICE: C3 does not
 // consume Q, which stays pending). An adopt-observed 105 claiming that Close, whose actual loads
 // EQUAL the target, is refused base_load.
 const m=missedDebut(95),mx=checkOf(foldArgs(m.three,[m.resp]),LIFT,m.c3).offers[0];
 const c3e=C(3,{date:'2026-10-12',reps:[8,7,6],loads:105,prescribed:105,effort:e(2,1,1)});
 const eq=structuredClone(mx),eb=decisionOf(eq);
 for(const it of eb.evidence)for(const st of it.sets)for(const k of ['original','current'])if(st&&st[k]&&st[k].load)st[k].load={...st[k].load,value:105};
 eb.target_load={scalar:lb(105),vector:Loads(105,105,105)};
 const fe=EFFECTS.m.foldNativeLoad(foldArgs([...m.cs,c3e],[{...m.resp,device:'fx-device-B'},acceptOp(eq,{op_id:'fx-resp-3',after:3})],'fx-revision-2'));
 assert.deepEqual(liveQ(fe,m.spend),[[false,'DEBUT']],'control: Q105 was not consumed');
 assert.deepEqual(fe.issues.filter(i=>['NATIVE_LOAD_RECORD_INVALID','NATIVE_LOAD_EFFECT_CONFLICT'].includes(i.code)).map(i=>i.code+':'+i.field),['NATIVE_LOAD_RECORD_INVALID:base_load'],'actual equal to the target is no miss '+JSON.stringify(fe.issues));
 assert.equal(exOf(fe.state).w,100);
});
// Round 17 walk seed 20268799: the claim is verified from the fold's ACCEPTED records, so a legacy
// entry admitted later (which holds the Q yes back, LEGACY_PENDING, and so leaves no queued entry)
// never turns the genuine claimed adoption or its Undo into RECORD_INVALID.
test('R17-ANCHOR-LEGACY-LATER R9.9 (spec R9.9 :155 "never read from the replay-time queue", :158 NO TRAP; DECISIONS:793; walk seed 20268799): the [adopt-observed 95] claiming [C3 Close] and its Undo, replayed over a base that later carries a legacy PROPOSED entry for fx-press -> no RECORD_INVALID; the adoption is held back LEGACY_PENDING with its spend kept and its cancellation stands; R2',()=>{
 effectsGate();
 const m=missedDebut(95),exit=checkOf(foldArgs(m.three,[m.resp]),LIFT,m.c3).offers[0],yes=acceptOp(exit,{op_id:'fx-resp-3',after:3});
 assert.deepEqual(decisionOf(exit).basis.load_basis.authority_refs,[ref(m.c3.close)],'control: the claimed adoption');
 const u=checkOf(foldArgs(m.three,[m.resp,yes]),LIFT,m.c3,{compensate:decisionOf(exit).spend_id});assert.equal(u.status,'offer',JSON.stringify(u.refusal));
 const legacy=F0();legacy.queue.push({exId:LIFT,kind:'debut',done:false,state:'PROPOSED',newW:105,t:'SYNTHETIC legacy'});
 const f0=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,yes],'fx-revision-2',legacy));
 assert.deepEqual(recordInvalid(f0),[],JSON.stringify(f0.issues));
 assert.ok(f0.issues.some(i=>i.code==='NATIVE_LOAD_LEGACY_PENDING'&&(i.refs||[]).some(r=>r.op_id==='fx-resp-3')),'held back LEGACY_PENDING '+JSON.stringify(f0.issues));
 assert.ok(f0.spent.some(x=>x.spend_id===decisionOf(exit).spend_id&&!x.cancelled_by),'its spend kept');
 const f=EFFECTS.m.foldNativeLoad(foldArgs(m.three,[m.resp,yes,acceptOp(u.offers[0],{op_id:'fx-resp-4',after:3})],'fx-revision-2',legacy));
 assert.deepEqual(recordInvalid(f),[],JSON.stringify(f.issues));
 assert.ok(f.spent.find(x=>x.spend_id===decisionOf(exit).spend_id&&x.cancelled_by),'its cancellation stands');
});
// Round 17 (Fable l8 P5.edited), rewritten in round 18: under R9.9 :152 an edited below-target debut
// counts as done "whatever was lifted" (an edit that leaves a slot off the target is a MISSED DEBUT).
test('R17-EDITED-DEBUT R9.9 (spec R9.9 :152 "an edit that leaves a slot off the target (captured 105, performed 95)", J (f); retires the R9.7 expectation, mutant M15): Q105 accepted; C3 captures 105, is lifted at 95 and set 2 is then corrected -> Q consumed MISSED, never prescribed again, no DEBUT_BASIS_UNPROVEN, not held; the check on C3 offers [adopt-observed 95] whose evidence names the edit Ref; R1 and R2',()=>{
 effectsGate();
 const m=missedDebut(95,[8,7,6],{corrected:{2:6}});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs(m.three,[m.resp],rev),f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([liveQ(f,m.spend),f.issues.filter(i=>i.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN'||EFFECTS.m.isHold(i))],[[[true,'MISSED']],[]],rev+' '+JSON.stringify(f.issues));
  assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(f).state),[100,100,100],rev+' never 105 again');
  const ev=checkOf(a,LIFT,m.c3);assert.equal(ev.status,'offer',rev+' '+JSON.stringify(ev.refusal));
  const d=decisionOf(ev.offers[0]);
  assert.deepEqual([d.kind,d.target_load.scalar,d.evidence[0].sets[1].edits],['adopt-observed',lb(95),[ref('fx-edit-3-2')]],rev);
 }
});
// Round 17 (Fable l8 D-L8F-1, PM ruling): undoing an APPLIED adoption reverts to its prior image
// whatever the record's shape; a RETIRE writes no w/wSets only when the adoption never applied.
test('R17-RETIRE-MEETS-APPLIED (PM ruling on D-L8F-1; spec amendment pending): the RETIRE-shaped undo issued while the observed 105 adoption was held under base 102.5 (base = target = 102.5), replayed when the base is back at 100 so the adoption applies -> the full prior image (every native field as before the adoption, w 100), authority compensated; the same RETIRE with the base still moved writes nothing (w 102.5); R1 and R2',()=>{
 effectsGate();
 const h=heldUndo(false),d=decisionOf(h.u1.offers[0]);
 assert.deepEqual([d.base_load.scalar.value,d.target_load.scalar.value],[102.5,102.5],'control: a RETIRE-shaped record');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp],rev,F0())).state).w,105,'control: the adoption applies at base 100 ('+rev+')');
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,h.comp1],rev,F0())),ex=exOf(f.state),before=exOf(F0());
  for(const k of ['w','wSets','wAt','last','lastMeta','own','std','topAt','topRun'])assert.deepEqual([k,ex[k]],[k,before[k]],'prior image field '+k+' ('+rev+')');
  assert.equal(ex.native_load_authority.kind,'compensated',rev);
  assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,h.comp1],rev,h.moved())).state).w,102.5,'never applied: RETIRE writes nothing ('+rev+')');
 }
});
// Round 17 (Fable l8 D-L8F-3): a spoiled cancellation group offers no dead Undo.
test('R17-DEAD-YES (Fable l8 D-L8F-3 P3; spec R9.7 :158 NO TRAP, I7): after R16b-CANON-CUT spoils the cancellation group (RECORD_INVALID compensates naming both records), Undo of the adoption is no longer offered (refused by that hold, never an offer whose yes cannot apply); exit (b) still resolves the group: C2 trained on the baseline ask at 100 offers [adopt-baseline 100], whose yes gives w 100 and supersedes the hold; R1 and R2',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false});
 const u=checkOf(foldArgs([h.c1],[h.resp]),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer');
 const early=structuredClone(u.offers[0]);early.body.basis.order.start_ids=[];
 const recs=[h.resp,acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1}),acceptOp(early,{op_id:'fx-resp-9',after:1})];
 const c2=C(2,{reps:TOP,loads:100,prescribed:null,effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const again=checkOf(foldArgs([h.c1],recs,rev),LIFT,h.c1,{compensate:h.spend});
  assert.deepEqual([again.status,again.refusal&&again.refusal.code,again.refusal&&again.refusal.field],['refused','NATIVE_LOAD_RECORD_INVALID','compensates'],rev+' '+JSON.stringify(again.offers&&again.offers.length));
  const ev=checkOf(foldArgs([h.c1,c2],recs,rev),LIFT,c2);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
  assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',100]],rev);
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1,c2],[...recs,acceptOp(ev.offers[0],{op_id:'fx-resp-4',after:2})],rev));
  assert.equal(exOf(f.state).w,100,rev);
  assert.ok(f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.lift===LIFT).every(i=>i.superseded_by),'the spoiled group\'s hold is superseded ('+rev+')');
 }
});
// Round 17b (Astra L9 B31; PM ruling, spec R9.8 :156 D-L8F-1): undoing an APPLIED adoption
// restores the prior image whatever the record's shape, including a LOWER adoption: the prior is
// the weight the athlete had before the adoption, never above it.
test('R17b-B31 LOWER ADOPTION UNDONE (Astra L9 RETIRE_SILENT_INCREASE input; spec R9.8 :156): adopt-observed 95 on the 100 card; the Undo issued while the adoption was held under 97.5 is RETIRE-shaped (97.5/97.5); replayed at base 100 the adoption applies (w 95) and the Undo restores exactly its prior image 100, the weight accepted before the adoption, never above it; replayed at 97.5 (never applied) it writes nothing; R1 and R2',()=>{
 effectsGate();
 const low=C(1,{reps:TOP,loads:95,prescribed:100,effort:e(2,1,1)});
 const ad=checkOf(foldArgs([low],[]),LIFT,low).offers[0];assert.equal(decisionOf(ad).kind,'adopt-observed');
 const accept=acceptOp(ad,{after:1}),spend=decisionOf(ad).spend_id;
 const retire=checkOf(foldArgs([low],[accept],'fx-revision-1',F0({w:97.5})),LIFT,low,{compensate:spend}).offers[0];
 const rd=decisionOf(retire);assert.deepEqual([rd.base_load.scalar.value,rd.target_load.scalar.value],[97.5,97.5],'control: a RETIRE-shaped record');
 const undo=acceptOp(retire,{after:1,op_id:'fx-undo'});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=EFFECTS.m.foldNativeLoad(foldArgs([low],[accept],rev,F0())),prior=exOf(a.state).native_load_authority.prior;
  assert.deepEqual([exOf(a.state).w,prior.w],[95,{present:true,value:100}],'control: applied at 95 over the prior 100 ('+rev+')');
  const f=EFFECTS.m.foldNativeLoad(foldArgs([low],[accept,undo],rev,F0())),ex=exOf(f.state);
  assert.equal(ex.w,prior.w.value,'the prior image ('+rev+')');assert.ok(ex.w<=prior.w.value,'never above the prior accepted image');
  assert.equal(ex.native_load_authority.kind,'compensated');assert.ok(f.spent.find(x=>x.spend_id===spend).cancelled_by);
  assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([low],[accept,undo],rev,F0({w:97.5}))).state).w,97.5,'never applied: no write ('+rev+')');
 }
});
// Round 17b (Astra L9 B34): discriminating rows for L9-M03, L9-M04, L9-M05 and L9-M07 (Astra's inputs).
// Round 18 (spec R9.9): L9-M03 is retired and replaced (an edited mismatch is now a MISSED DEBUT);
// L9-M04 and L9-M05 keep their clauses (the other-hold anchor of an adopt-baseline exit, :155) on
// a fixture that reaches them: a host v1 completion whose Start captured a numeric card, proven
// after the hold, is offered exit (b)'s adopt-baseline naming the hold's records (spec K OUTSIDE (2)).
test('R17b-L9-M03 R9.9 EDITED MISMATCH IS A MISSED DEBUT (Astra L9 B34 input, corrected set 1; spec R9.9 :152): consumed MISSED, no DEBUT_BASIS_UNPROVEN issue, no hold',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const c3=C(3,{date:'2026-10-12',reps:[8,7,6],loads:95,prescribed:105,effort:e(2,1,1),corrected:{1:7}});
 const f=EFFECTS.m.foldNativeLoad(foldArgs([...cs,c3],[resp]));
 assert.deepEqual([liveQ(f,spend),f.issues.filter(i=>i.code==='NATIVE_LOAD_DEBUT_BASIS_UNPROVEN'||EFFECTS.m.isHold(i))],[[[true,'MISSED']],[]],JSON.stringify(f.issues));
});
// The R13-EXIT-160 hold (yes Q105, base moved to 102.5 with no ordering op: EFFECT_CONFLICT) with C3
// on host v1 slots whose Start captured the 105 card, lifted at 102.5: the exit names [fx-resp-1].
function exit160v1(rev,extra=[],base=()=>F0({w:102.5})){
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const c3=v1Of(C(3,{date:'2026-10-12',reps:TOP,loads:102.5,prescribed:105,effort:e(2,1,1)}));
 const args=()=>{const a=foldArgs([...cs,c3],[resp,...extra],rev,base());captureOn(a.generation,c3,[105,105,105]);return a;};
 return {cs,resp,spend,c3,args};
}
test('R17b-L9-M04 R9.9 EVERY ANCHOR MUST RESOLVE (Astra L9 B34; spec R9.9 :155 other-hold anchor): the exit (b) adopt-baseline on a numeric capture naming its valid holding record [fx-resp-1] supersedes the EFFECT_CONFLICT hold (control); the same exit PLUS a set-op ref -> RECORD_INVALID base_load, w unchanged 102.5, the hold stands; R2',()=>{
 effectsGate();
 const s=exit160v1('fx-revision-1'),ev=checkOf(s.args(),LIFT,s.c3);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
 const exit=ev.offers[0];assert.deepEqual([decisionOf(exit).kind,decisionOf(exit).basis.load_basis.authority_refs],['adopt-baseline',[ref('fx-resp-1')]],'control: exit (b) names the holding record');
 const ok=EFFECTS.m.foldNativeLoad(exit160v1('fx-revision-2',[acceptOp(exit,{op_id:'fx-exit',after:3})]).args());
 assert.deepEqual([recordInvalid(ok),liveQ(ok,s.spend)],[[],[[true,'SUPERSEDED']]],'control: the genuine exit applies '+JSON.stringify(ok.issues));
 const o=structuredClone(exit);o.body.basis.load_basis.authority_refs.push(ref('fx-set-3-1'));
 const f=EFFECTS.m.foldNativeLoad(exit160v1('fx-revision-2',[acceptOp(o,{op_id:'fx-exit',after:3})]).args());
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='base_load'&&(i.refs||[]).some(r=>r.op_id==='fx-exit')),JSON.stringify(f.issues));
 assert.equal(exOf(f.state).w,102.5);assert.deepEqual(liveQ(f,s.spend).filter(([,st])=>st==='SUPERSEDED'),[]);
});
test('R17b-L9-M05 R9.9 ANOTHER LIFT\'S RECORD NAMED BY THIS LIFT\'S HOLD (Astra L9 B34; spec R9.9 :155 "a proposal-response OF THIS LIFT"): a re-digested copy of the Q yes claiming fx-row makes one spend with two bodies, so fx-press is held EFFECT_CONFLICT with refs naming that fx-row record; an adopt-baseline exit on a numeric capture anchored on it is RECORD_INVALID base_load (the record is not of this lift), w not 95; R2',()=>{
 effectsGate();
 const m=missedDebut(95),c3=v1Of(m.c3);
 const x=structuredClone(m.resp);x.op_id='fx-resp-x';const iss=x.payload.issuance;iss.body.lift_lineage_id=ROW;x.payload.proposal_id=EFFECTS.m.proposalDigest(iss.producer,iss.body,iss.reason);
 const src=checkOf((()=>{const a=foldArgs([...m.cs,c3],[m.resp]);captureOn(a.generation,c3,[105,105,105]);return a;})(),LIFT,c3).offers[0];
 assert.ok(src,'control: an offer on the v1 completion to shape the exit from');
 const o=structuredClone(src),d=decisionOf(o),nil={present:true,value:null};
 d.kind='adopt-baseline';d.reason_key='baseline';d.basis.load_basis.w=nil;d.base_load.fields.w=nil;d.base_load.scalar=null;d.base_load.vector=d.base_load.vector.map(()=>null);d.basis.load_basis.authority_refs=[ref('fx-resp-x')];
 const a=foldArgs([...m.cs,c3],[m.resp,x,acceptOp(o,{op_id:'fx-exit',after:3})],'fx-revision-2',withRow());captureOn(a.generation,c3,[105,105,105]);
 const f=EFFECTS.m.foldNativeLoad(a);
 assert.ok(f.issues.some(i=>i.lift===LIFT&&EFFECTS.m.isHold(i)&&(i.refs||[]).some(r=>r.op_id==='fx-resp-x')),'control: a hold of fx-press names the fx-row record '+JSON.stringify(f.issues));
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='base_load'&&(i.refs||[]).some(r=>r.op_id==='fx-exit')),JSON.stringify(f.issues));
 assert.notEqual(exOf(f.state).w,95);
});
test('R17b-L9-M07 THE WHOLE UNDO BODY IS COMPARED (Astra L9 B34): the genuine RETIRE with only base_load.fields.last altered to [1,2,3], re-digested, at its reproducible present-revision cut -> RECORD_INVALID issuance, w 102.5',()=>{
 effectsGate();
 const {h,retire}=heldUndoForgery(),o=structuredClone(retire);
 o.body.base_load.fields.last={present:true,value:[1,2,3]};
 const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,acceptOp(o,{op_id:'fx-undo',after:1})],'fx-revision-1',F0({w:102.5})));
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='issuance'));
 assert.equal(exOf(f.state).w,102.5);
});
// Round 17c (Astra L10 B35, B36): regression rows for two single-clause mutants no earlier row
// killed (L10-M02, L10-M09). Test bytes only; the product is unchanged.
// The public capture boundary: engine-capture.cjs over this file's composed engine, its capture
// validated by the shared prescription capture (capture.cjs). Neither requires another module.
const CAPTURE_FACTORY=require(path.join(ROOT,'rebuild/m4/workout/engine-capture.cjs')),PRESCRIPTION=require(path.join(ROOT,'rebuild/m4/workout/capture.cjs'));
function capturedLoads(state,day=CARD_DAY){
 const producer={app_build:'fx-app',engine_build:'fx-engine',rule_profile:CAPTURE_FACTORY.PROFILE,source_schema:'fx-schema'},basis={plan_basis:'fx-plan',input_basis:'fx-input',source_revision:1};
 const adapter=CAPTURE_FACTORY.createEngineWorkoutCapture({engine:engineAt(day),prescriptionCapture:PRESCRIPTION.createPrescriptionCapture({parseStrictJson:JSON.parse}),producerIdentity:producer});
 const {capture}=adapter.prepare({state,day,sleep:{},basis});
 return capture.slots.filter(s=>s.lift_lineage_id===LIFT).map(s=>JSON.parse(s.load.source_json).value);
}
test('R17c-B35 A NEVER-APPLIED RESTORE RESTORES AN ABSENT PRIOR VECTOR, THROUGH THE CAPTURE BOUNDARY (Astra L10 B35, mutant L10-M02; spec R9.8 :156 "a never-applied RESTORE writes w/wSets from the recorded base_load.fields"): C1 at 105 adopted on the 100 card (prior image w 100, wSets ABSENT); its genuine RESTORE Undo (base 105, target 100); both replayed over a later unordered base w 102.5 with wSets [102.5,100,97.5] -> w 100 and NO wSets, authority compensated, the adoption cancelled, no open conflict, and the public engine-capture adapter captures [100,100,100], never the stale vector; R1 and R2',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false}),vec=[102.5,100,97.5],moved=()=>F0({w:102.5,wSets:vec});
 const ad=decisionOf(h.offer);assert.deepEqual([ad.base_load.fields.w.present,ad.base_load.fields.w.value,ad.base_load.fields.wSets.present],[true,100,false],'control: the adoption was issued on w 100 with NO wSets');
 const u=checkOf(foldArgs([h.c1],[h.resp]),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer',JSON.stringify(u.refusal));
 const ud=decisionOf(u.offers[0]);assert.deepEqual([ud.base_load.scalar.value,ud.target_load.scalar.value],[105,100],'control: a RESTORE-shaped undo');
 const comp=acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1});
 assert.deepEqual(capturedLoads(moved()),vec,'control: the capture boundary carries a present wSets vector as the card loads');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const held0=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp],rev,moved()));
  assert.deepEqual([exOf(held0.state).w,exOf(held0.state).wSets],[102.5,vec],'control: without the Undo the adoption is held and the later vector stands ('+rev+')');
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,comp],rev,moved())),ex=exOf(f.state);
  assert.equal(ex.w,100,'the consented prior w ('+rev+')');
  assert.deepEqual(capturedLoads(EFFECTS.m.heldProjection(f).state),[100,100,100],'the next Start captures the restored 100 on every set, never [102.5,100,97.5] ('+rev+')');
  assert.equal(Object.hasOwn(ex,'wSets'),false,'the prior image had NO wSets, so none survives the RESTORE ('+rev+')');
  assert.equal(ex.native_load_authority.kind,'compensated',rev);
  assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,ud.spend_id,'tombstone ('+rev+')');
  assert.deepEqual(f.issues.filter(i=>!i.superseded_by&&['NATIVE_LOAD_EFFECT_CONFLICT','NATIVE_LOAD_RECORD_INVALID'].includes(i.code)),[],rev);
 }
});
test('R17c-B36 A DEAD YES IS REFUSED WITH EXACTLY THE HOLD\'S OWN REFS (Astra L10 B36, mutant L10-M09; spec R9.8 :158 DEAD YES "the check refuses with that hold\'s own code, field and refs"): the R16b-CANON-CUT input (the genuine RESTORE fx-resp-2 and its early-cut copy fx-resp-9) holds fx-press RECORD_INVALID compensates with refs [fx-resp-2, fx-resp-9]; a new Undo check of the adoption refuses with exactly that code, field and refs array; R1 and R2',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false});
 const u=checkOf(foldArgs([h.c1],[h.resp]),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer');
 const early=structuredClone(u.offers[0]);early.body.basis.order.start_ids=[];
 const recs=[h.resp,acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1}),acceptOp(early,{op_id:'fx-resp-9',after:1})];
 const want=[ref('fx-resp-2'),ref('fx-resp-9')];
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const args=foldArgs([h.c1],recs,rev),f=EFFECTS.m.foldNativeLoad(args);
  const hold=f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.lift===LIFT&&!i.superseded_by);
  assert.deepEqual(hold.map(i=>[i.field,i.refs]),[['compensates',want]],'control: the spoiled group\'s hold ('+rev+') '+JSON.stringify(f.issues));
  const again=checkOf(args,LIFT,h.c1,{compensate:h.spend});
  assert.deepEqual([again.status,again.offers],['refused',[]],rev);
  assert.deepEqual(again.refusal,{code:'NATIVE_LOAD_RECORD_INVALID',refs:want,field:'compensates'},'exactly the hold\'s own code, refs and field ('+rev+')');
  assert.deepEqual(again.refusal.refs,hold[0].refs,'the refusal refs ARE the hold refs ('+rev+')');
 }
});
test('R13-EXIT-160 (spec R9.2 :160 unprovable order, :158 exit (b)): yes Q105, then the base moves to 102.5 with no ordering op -> EFFECT_CONFLICT load_basis; C3 trained on the baseline ask at 102.5 offers [adopt-baseline 102.5]; its yes -> w 102.5, Q105 retired with its spend kept, the conflict superseded; R1 and R2',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id,moved=()=>F0({w:102.5});
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:102.5,prescribed:null,effort:e(2,1,1)}),three=[...cs,c3];
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const ev=checkOf(foldArgs(three,[resp],rev,moved()),LIFT,c3);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
  assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',102.5]],rev);
  const h=EFFECTS.m.foldNativeLoad(foldArgs(three,[resp,acceptOp(ev.offers[0],{op_id:'fx-resp-3',after:3})],rev,moved()));
  assert.equal(exOf(h.state).w,102.5);assert.deepEqual(liveQ(h,spend),[[true,'SUPERSEDED']],rev);
  assert.ok(h.spent.some(x=>x.spend_id===spend&&!x.cancelled_by),'spend kept');
  assert.deepEqual(h.issues.filter(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT').map(i=>!!i.superseded_by),[true],rev);
 }
});
test('R13-EXIT-ORDER (spec R9.2 :158 "accepted after every holding record"; walk seeds 20261013, 20261282, 20261316): the holding record came from a second device and the Start that showed the baseline ask names it as a causal parent; the adoption recorded after that Start on the Start\'s own device is the one the check offered, so the fold accepts it as the exit',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id,moved=()=>F0({w:102.5});
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:102.5,prescribed:null,effort:e(2,1,1)}),three=[...cs,c3];
 const layout=a=>{const ops=a.generation.collections.ops;Object.assign(ops[resp.op_id],{device_id:'fx-device-B',device_seq:1000});ops[c3.start].causal_parents=[resp.op_id];return a;};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const ev=checkOf(layout(foldArgs(three,[resp],rev,moved())),LIFT,c3);assert.equal(ev.status,'offer',JSON.stringify(ev.refusal));
  assert.deepEqual(ev.offers.map(o=>decisionOf(o).kind),['adopt-baseline'],rev);
  const h=EFFECTS.m.foldNativeLoad(layout(foldArgs(three,[resp,acceptOp(ev.offers[0],{op_id:'fx-resp-3',after:3})],rev,moved())));
  assert.equal(exOf(h.state).w,102.5,rev+' the offered exit is accepted');assert.deepEqual(liveQ(h,spend),[[true,'SUPERSEDED']],rev);
  assert.deepEqual(h.issues.filter(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT').map(i=>!!i.superseded_by),[true],rev);
  // Control: without the Start's causal link the order is unprovable, so no exit is offered.
  const u=foldArgs(three,[resp],rev,moved());Object.assign(u.generation.collections.ops[resp.op_id],{device_id:'fx-device-B',device_seq:1000});
  assert.equal(checkOf(u,LIFT,c3).status,'refused',rev);
  // Mutant R13-exit-any-order: that adoption recorded without the link is not after the
  // holding record, so it supersedes nothing (the hold stands, the adoption waits behind it).
  const uh=foldArgs(three,[resp,acceptOp(ev.offers[0],{op_id:'fx-resp-3',after:3})],rev,moved());Object.assign(uh.generation.collections.ops[resp.op_id],{device_id:'fx-device-B',device_seq:1000});
  const k=EFFECTS.m.foldNativeLoad(uh);
  const sup=k.issues.filter(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT').map(i=>!!i.superseded_by);
  assert.ok(sup.length&&sup.every(s=>!s),rev+' '+JSON.stringify(k.issues));assert.deepEqual(liveQ(k,spend).filter(([,st])=>st==='SUPERSEDED'),[],rev);
 }
});
test('R13-C2 WINDOW AFTER STEP 3 (spec R9.2 :127 C2): a completion with an unresolved slot under a pre-FC16 capture keeps FC01\'s PREFIX_UNRESOLVED (step 3 never chose earn); an observed-load completion under a pre-FC16 capture is adopted',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1),unresolvedAt:[3]})];
 const a=foldArgs(cs,[]);for(const c of cs)captureReps(a.generation,c,[100,100,100],10,undefined);
 expectRefusal(checkOf(a,LIFT,cs[1]),'PREFIX_UNRESOLVED',[ref(cs[1].close)]);
 // Mutant R13-C2-step3: an adoption-side VECTOR_ADOPTION_UNDEFINED (unequal observed loads,
 // not every slot at the planned load) is not on the earn branch, so the window never binds it.
 const vs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,loads:[105,105,100],effort:e(2,1,1)})];
 const b=foldArgs(vs,[]);for(const c of vs)captureReps(b.generation,c,[100,100,100],10,undefined);
 expectRefusal(checkOf(b,LIFT,vs[1]),'VECTOR_ADOPTION_UNDEFINED',[ref(vs[1].close)]);
});
test('R13-C3 KIND-AWARE BASE (spec R9.2 :156 c3; mutants R13-c3-baseline, R13-c3-earn): under an absent revision (no re-evaluation), an adopt-observed record relabelled adopt-baseline over a numeric w, and an adopt-baseline record relabelled adopt-observed over a null w, are RECORD_INVALID base_load and move nothing',()=>{
 effectsGate();
 const c1=C(1,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)}),ao=checkOf(foldArgs([c1],[]),LIFT,c1).offers.find(o=>decisionOf(o).kind==='adopt-observed');
 assert.ok(ao,'control: adopt-observed 105');
 const asBaseline=structuredClone(ao);asBaseline.body.kind='adopt-baseline';asBaseline.body.reason_key='baseline';
 const f=EFFECTS.m.foldNativeLoad(foldArgs([c1],[acceptOp(asBaseline,{after:1})],'fx-revision-2'));
 assert.deepEqual(f.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['base_load'],JSON.stringify(f.issues));assert.equal(exOf(f.state).w,100);
 const bs=[C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)})],ab=checkOf(foldArgs(bs,[],'fx-revision-1',F0({w:null})),LIFT,bs[0]).offers[0];
 assert.equal(decisionOf(ab).kind,'adopt-baseline','control');
 const asObserved=structuredClone(ab);asObserved.body.kind='adopt-observed';asObserved.body.reason_key='observed-load';
 const g=EFFECTS.m.foldNativeLoad(foldArgs(bs,[acceptOp(asObserved,{after:1})],'fx-revision-2',F0({w:null})));
 assert.deepEqual(g.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['base_load'],JSON.stringify(g.issues));assert.equal(exOf(g.state).w,null);
 // FC03's S8 names the same records; FC01's own transition refuses them too (c3 is FC01's
 // DERIVABLE rule, so a caller of the engine transition alone is bound by it).
 const {c1:n1,s:s9,E:E9}=n09(),ev9=evaluate(E9,s9,request(s9,[n1],n1)),f9=structuredClone(ev9.offers[0]);f9.body.kind='adopt-baseline';f9.body.reason_key='baseline';
 const t9=applyAccept(E9,s9,ev9,f9).t;assert.deepEqual([t9.status,t9.refusal&&t9.refusal.code,t9.refusal&&t9.refusal.field],['refused','NATIVE_LOAD_RECORD_INVALID','base_load']);
 const s10=withFacts(F0({w:null}),bs),E10=engineAt(bs[0].date),ev10=evaluate(E10,s10,request(s10,bs,bs[0])),f10=structuredClone(ev10.offers[0]);f10.body.kind='adopt-observed';f10.body.reason_key='observed-load';
 const t10=applyAccept(E10,s10,ev10,f10).t;assert.deepEqual([t10.status,t10.refusal&&t10.refusal.code,t10.refusal&&t10.refusal.field],['refused','NATIVE_LOAD_RECORD_INVALID','base_load']);
});
test('R13-DECODE (spec R9.2 :156 c1/c2/c3, supported wSets): a genuine baseline record of either shape passes (w present-null, and w ABSENT); a baseline whose load_basis.w and fields.w wrappers differ refuses base_load; an ABSENT w cannot earn; a present-null wSets repeats the scalar; a present non-array wSets refuses load_basis.wSets at issuance and in DERIVABLE',()=>{
 effectsGate();
 const bs=[C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)})];
 for(const [name,base] of [['present-null',()=>F0({w:null})],['ABSENT',()=>F0({w:undefined})]]){
  const ev=checkOf(foldArgs(bs,[],'fx-revision-1',base()),LIFT,bs[0]);assert.equal(ev.status,'offer',name+' '+JSON.stringify(ev.refusal));
  const o=ev.offers[0];assert.equal(decisionOf(o).kind,'adopt-baseline',name);
  for(const rev of ['fx-revision-1','fx-revision-2']){
   const f=EFFECTS.m.foldNativeLoad(foldArgs(bs,[acceptOp(o,{after:1})],rev,base()));
   assert.ok(!f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'),name+' '+rev+' '+JSON.stringify(f.issues));assert.equal(exOf(f.state).w,60,name+' '+rev);
  }
  const mixed=structuredClone(o);mixed.body.basis.load_basis.w=name==='ABSENT'?{present:true,value:null}:{present:false,value:null};
  const g=EFFECTS.m.foldNativeLoad(foldArgs(bs,[acceptOp(mixed,{after:1})],'fx-revision-2',base()));
  assert.deepEqual(g.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['base_load'],'c1 wrappers differ ('+name+')');
 }
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],eo=checkOf(foldArgs(cs,[]),LIFT,cs[1]).offers[0];
 const noW=structuredClone(eo);noW.body.basis.load_basis.w={present:false,value:null};noW.body.base_load.fields.w={present:false,value:null};noW.body.base_load.scalar=null;noW.body.base_load.vector=[null,null,null];
 const n=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(noW,{after:2})],'fx-revision-2'));
 assert.ok(n.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&['base_load','target_load'].includes(i.field)),'c3: an ABSENT w cannot earn '+JSON.stringify(n.issues));
 const nul=checkOf(foldArgs(cs,[],'fx-revision-1',F0({wSets:null})),LIFT,cs[1]);assert.equal(nul.status,'offer',JSON.stringify(nul.refusal));
 const no=nul.offers[0];assert.deepEqual([no.body.basis.load_basis.wSets,no.body.base_load.vector.map(v=>v.value)],[{present:true,value:null},[100,100,100]],'present-null wSets: the scalar repeats');
 assert.equal(EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(no,{after:2})],'fx-revision-2',F0({wSets:null}))).state.queue.filter(q=>q.native_load_spend).length,1,'and it applies');
 expectRefusal(checkOf(foldArgs(cs,[],'fx-revision-1',F0({wSets:7})),LIFT,cs[1]),'RECORD_INVALID',[]);
 assert.equal(checkOf(foldArgs(cs,[],'fx-revision-1',F0({wSets:7})),LIFT,cs[1]).refusal.field,'load_basis.wSets','refused at issuance');
 const odd=structuredClone(eo);odd.body.basis.load_basis.wSets={present:true,value:7};odd.body.base_load.fields.wSets={present:true,value:7};
 const k=EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(odd,{after:2})],'fx-revision-2'));
 assert.deepEqual(k.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['load_basis.wSets'],JSON.stringify(k.issues));
});
test('R13-RESTORE-SHAPE (spec R9.2 :156, by the record\'s own shape): a restore-shaped undo (target unlike its own base) of an EARN is RECORD_INVALID target_load; a retire-shaped undo is display-only; R1 and R2',()=>{
 effectsGate();
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const undo=checkOf(foldArgs(cs,[resp]),LIFT,cs[1],{compensate:spend}).offers[0];
 assert.deepEqual([undo.body.target_load.scalar,undo.body.target_load.vector],[undo.body.base_load.scalar,undo.body.base_load.vector],'control: FC01 issues a RETIRE with target = its own base');
 const restore=structuredClone(undo);restore.body.target_load={scalar:lb(95),vector:[lb(95),lb(95),lb(95)]};
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const g=EFFECTS.m.foldNativeLoad(foldArgs(cs,[resp,acceptOp(restore,{op_id:'fx-resp-2',after:2})],rev));
  assert.deepEqual(g.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>i.field),['target_load'],rev+' '+JSON.stringify(g.issues));
  assert.ok(!g.spent.find(x=>x.spend_id===spend).cancelled_by,'nothing retired ('+rev+')');
 }
});
// N28 EXTERNAL-GATE (spec R9.1 :157): Astra R9 L1 input A (hot opener, PROPOSED 110
// fabricated) and input B (one top, DEBUT 105 fabricated). Locally constructed and folded
// under an absent revision they pass S1-S8 and DERIVABLE (the named RESIDUAL); delivered
// inside an imported generation they refuse SOURCE_FRONTIER_UNPROVEN with zero writes.
function n28Inputs(){
 const A=[C(1,{reps:TOP,effort:e(0,1,AT_LEAST_3)}),C(2,{reps:TOP,effort:e(0,1,AT_LEAST_3)})],baseA=()=>F0({steps:[100,105,110]});
 const evA=checkOf(foldArgs(A,[],'fx-revision-1',baseA()),LIFT,A[1]);
 const fa=evA.status==='offer'?structuredClone(evA.offers.find(o=>decisionOf(o).kind==='earn')):null;
 if(fa){const b=fa.body;b.candidate.newW=110;b.candidate.state='PROPOSED';b.target_load.scalar.value=110;b.target_load.vector.forEach(v=>v.value=110);fa.reason=fa.reason.replaceAll('105 lb','110 lb');}
 const two=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})],B=[two[0]];
 const o2=checkOf(foldArgs(two,[]),LIFT,two[1]).offers[0],fb=structuredClone(o2),b=fb.body,root=JSON.stringify([B[0].start,LIFT,B[0].close]),d=JSON.parse(b.spend_id);
 b.consumes=[root];d[4]=[root];b.spend_id=JSON.stringify(d);b.evidence=b.evidence.filter(i=>i.close.op_id===B[0].close);
 const keep=new Set(B[0].ops);b.basis.coverage=b.basis.coverage.filter(c=>keep.has(c.op_id));b.basis.order={...b.basis.order,start_ids:[B[0].start],frontier:B[0].ops.length};
 b.candidate.state='DEBUT';
 return {A,baseA,evA,fa,B,fb};
}
test('N28 EXTERNAL-GATE (spec R9.1 :157; I1/I2): inputs A (PROPOSED 110) and B (DEBUT 105), locally constructed under an absent revision, pass S1-S8 and DERIVABLE (RESIDUAL, named); inside an imported generation both refuse SOURCE_FRONTIER_UNPROVEN, zero writes, w 100',()=>{
 effectsGate();
 const {A,baseA,evA,fa,B,fb}=n28Inputs();
 assert.ok(fa,'control: input A has a genuine earn offer to fabricate from: '+JSON.stringify(evA.refusal));
 assert.notEqual(checkOf(foldArgs(B,[]),LIFT,B[0]).status,'offer','control: input B earns nothing');
 const local=[EFFECTS.m.foldNativeLoad(foldArgs(A,[acceptOp(fa,{after:2})],'fx-revision-2',baseA())),EFFECTS.m.foldNativeLoad(foldArgs(B,[acceptOp(fb,{after:1})],'fx-revision-2'))];
 assert.deepEqual(local.map(f=>f.state.queue.filter(q=>q.native_load_spend).map(q=>q.newW)),[[110],[105]],'RESIDUAL: local fabrications are admitted '+JSON.stringify(local.map(f=>f.issues)));
 for(const [name,args] of [['A',foldArgs(A,[acceptOp(fa,{after:2})],'fx-revision-2',baseA())],['B',foldArgs(B,[acceptOp(fb,{after:1})],'fx-revision-2')]]){
  args.generation.collections.sourceImports={'fx-import-1':{profile:'earned/source-import/v1'}};
  const f=EFFECTS.m.foldNativeLoad(args);
  assert.deepEqual([f.status,f.issues.map(i=>i.code),f.effects.length,f.spent.length],['refused',['NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN'],0,0],name);
  const ev=checkOf(args,LIFT,name==='A'?A[1]:B[0]);assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code],['refused','NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN'],name);
 }
});
// A Start capture with its reps cells: legacy (targets only) or FC16 (window_hi, spec R9 :127).
function captureReps(gen,c,loads,target,windowHi){
 captureOn(gen,c,loads);
 for(const cell of gen.collections.ops[c.start].prescription_capture.slots)cell.reps={state:'specified',display:String(target),source_json:JSON.stringify({value:target,unit:'rep',...(windowHi===undefined?{}:{window_hi:windowHi})})};
 return gen;
}
test('N26 WINDOW-CAPTURE (spec R9 :127 WINDOW BINDING, G6 PLAN_CHANGED [Close Ref]; I2/I5): C2 over-performs [12,12,12] under a window of 10; the window is then raised to 11 -> PLAN_CHANGED [C2 Close Ref] with an FC16 capture (window_hi 10) and with a legacy capture (largest target 10 < performed 12, new hi 11 > 10); unchanged window offers; a legacy target above the new hi refuses by the B25 clause',()=>{
 effectsGate();
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:[12,12,12],effort:e(2,1,1)})];
 const at=(hi,target,windowHi)=>{const a=foldArgs(cs,[],'fx-revision-1',F0({hi}));for(const c of cs)captureReps(a.generation,c,[100,100,100],target,windowHi);return a;};
 // Round 12 (spec R9.1 :127): a capture made before FC16 cannot prove its window, so EVERY
 // new earn check on it refuses PLAN_CHANGED, the unchanged window included (the stated
 // legacy-earning cost); only an FC16 capture at the current hi reaches the earn readers.
 assert.equal(checkOf(at(10,10,10),LIFT,cs[1]).status,'offer','control (window_hi): the window is unchanged');
 expectRefusal(checkOf(at(11,10,10),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 expectRefusal(checkOf(at(10,10,undefined),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 expectRefusal(checkOf(at(11,10,undefined),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 expectRefusal(checkOf(at(11,12,undefined),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
 assert.equal(checkOf(at(11,11,11),LIFT,cs[1]).status,'offer','control: an FC16 capture at the current window offers');
});
test('N26 WINDOW-CAPTURE legacy rows (spec R9.1 :127, Astra R9 L1 B-R9-3): floor case (hi 12, captured [14,14,14], performed [14,14,14], hi raised to 14) and fresh case (hi 14, captured [12,12,12], performed [12,12,12], hi lowered to 12) -> PLAN_CHANGED [Close Ref], field null, offers []; the same completions with an FC16 capture at the current hi reach the earn readers',()=>{
 effectsGate();
 for(const [name,hiThen,target,reps,hiNow] of [['floor',12,14,[14,14,14],14],['fresh',14,12,[12,12,12],12]]){
  const cs=[C(1,{reps,effort:e(2,1,1)}),C(2,{reps,effort:e(2,1,1)})];
  const at=windowHi=>{const a=foldArgs(cs,[],'fx-revision-1',F0({hi:hiNow}));for(const c of cs)captureReps(a.generation,c,[100,100,100],target,windowHi);return a;};
  const ev=checkOf(at(undefined),LIFT,cs[1]);
  expectRefusal(ev,'PLAN_CHANGED',[ref(cs[1].close)]);assert.equal(ev.refusal.field,null,name);assert.deepEqual(ev.offers,[],name);
  expectRefusal(checkOf(at(hiThen),LIFT,cs[1]),'PLAN_CHANGED',[ref(cs[1].close)]);
  const now=checkOf(at(hiNow),LIFT,cs[1]);
  assert.ok(!(now.status==='refused'&&now.refusal.code==='NATIVE_LOAD_PLAN_CHANGED'),name+': an FC16 capture at the current hi is not window-refused '+JSON.stringify(now.refusal));
 }
});
test('N26 WINDOW-CAPTURE adoption and compensation are never window-bound (spec R9.1 :127, N10): a pre-FC16 baseline (not_prescribed reps, w null) at 60 offers [adopt-baseline 60]; an observed 105 under a legacy capture whose performed top exceeds its targets with hi raised offers adopt-observed; the undo of a yes survives a window change',()=>{
 effectsGate();
 const bs=[C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)})];
 const b=foldArgs(bs,[],'fx-revision-1',F0({w:null}));captureOn(b.generation,bs[0],[null,null,null]);
 for(const cell of b.generation.collections.ops[bs[0].start].prescription_capture.slots)cell.reps={state:'not_prescribed',display:'Record the reps performed',source_json:null};
 const be=checkOf(b,LIFT,bs[0]);assert.equal(be.status,'offer',JSON.stringify(be.refusal));
 assert.deepEqual(be.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',60]]);
 const os=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:[12,12,12],loads:105,prescribed:100,effort:e(2,1,1)})];
 const o=foldArgs(os,[],'fx-revision-1',F0({hi:11}));for(const c of os)captureReps(o.generation,c,[100,100,100],10,undefined);
 const oe=checkOf(o,LIFT,os[1]);assert.equal(oe.status,'offer',JSON.stringify(oe.refusal));
 assert.deepEqual(oe.offers.map(x=>decisionOf(x).kind),['adopt-observed']);
 const cs=[C(1,{reps:TOP,effort:e(2,1,1)}),C(2,{reps:TOP,effort:e(2,1,1)})];
 const y=foldArgs(cs,[],'fx-revision-1',F0());for(const c of cs)captureReps(y.generation,c,[100,100,100],10,10);
 const offer=checkOf(y,LIFT,cs[1]).offers[0];assert.equal(decisionOf(offer).candidate.newW,105);
 const z=foldArgs(cs,[acceptOp(offer,{after:2})],'fx-revision-1',F0({hi:12}));for(const c of cs)captureReps(z.generation,c,[100,100,100],10,10);
 const spend=decisionOf(offer).spend_id,undo=checkOf(z,LIFT,cs[1],{compensate:spend});
 assert.equal(undo.status,'offer',JSON.stringify(undo.refusal));assert.equal(decisionOf(undo.offers[0]).kind,'compensate');
});

// ======================================================================
// ROUND 8 MODEL (Claude l6 D-B6-1): the round-7 walk plus the classes it lacked, and a
// real oracle for I1. Seeded, deterministic, every projection the cold fold.
// Added classes: fact corrections after the yes (BASIS_REPAIR_REQUIRED paths), technique
// forks, a second lift (Fx Row) trained alone or in the same session, a legacy PROPOSED
// structural queue entry (and its removal), wSets vector plans, the Close of a Start that
// captured the card earlier (the Start sits where it was captured), host v1 sessions,
// and delivery whose order is NOT provable (responses on a second device, no causal
// parents, three different counter layouts).
// I1 ORACLE, per lift, from a model ledger of every yes {lift, spend, kind, target, op}:
//  no native authority -> w and wSets are exactly the plan's (a compensated or held
//  adoption, an unlanded or held earn: none of them moves w);
//  authority 'adopted' -> a recorded, non-cancelled, non-held adoption yes of that lift
//  names it and w is its target;
//  authority 'landed'  -> a recorded, non-cancelled, non-held earn yes of that lift names
//  it, the fold reports its landing, w is its target, and the model has a CLOSED session
//  whose Start captured exactly that target after the yes was recorded (spec :151).
// I2-I5 as round 7, per lift; I6 the three unprovable delivery layouts (and R2) fold alike.
// Round 9 (DECISIONS:793, Astra L6 D13): rep-window edits, cached-line changes, pathological
// names (12 delimiters, unicode, empty, blank, long), Start captures with rep targets; the
// round-8 stop-P4 exemption is removed, so every R1/R2 difference is a counterexample.
// NATIVE_LOAD_PROPERTY8_RUNS (default 100), _SEED (default 20261001), _REPORT, _ALL.
// ======================================================================
function sess2(n,{date=dayAt(n-1),entries}){
 const start='fx-start-'+n,close='fx-close-'+n,ops=[start];
 const recs=entries.map(en=>{
  const tag=en.lift===LIFT?'p':'r';
  const slots=en.reps.map((r,k)=>{
   const position=k+1,logical_set_slot=JSON.stringify([en.lift,position]),id='fx-set-'+n+'-'+tag+'-'+position,P=en.prescribed[k];
   ops.push(id);
   const original={load:lb(en.loads[k]),reps:rep(r),reserve:structuredClone(en.effort[k])},fix=en.corrected?en.corrected[position]:undefined;
   const edit_op_ids=fix===undefined?[]:['fx-edit-'+n+'-'+tag+'-'+position];ops.push(...edit_op_ids);
   // Round 18: a correction is a rep count, or {load} for a load correction (spec R9.9 :152 J (h)).
   const current=!edit_op_ids.length?structuredClone(original):fix&&typeof fix==='object'?{...structuredClone(original),load:lb(fix.load)}:{...structuredClone(original),reps:rep(fix)};
   const slot={position,logical_set_slot,prescribed_load:P==null?{state:'not_prescribed'}:{state:'specified',source:lb(P)},state:'performed',
    fact:{source_op_id:id,source_status:'stored-on-this-device',included:true,current,current_status:'stored-on-this-device',edit_op_ids,issues:[],original,logical_set_slot,lift_lineage_id:en.lift}};
   if(en.v1)delete slot.prescribed_load;
   return slot;
  });
  return {profile:en.v1?'earned/performed-lift/v1':'earned/performed-lift/v2',start_op_id:start,lift_lineage_id:en.lift,completion:{op_id:close,kind:'normal',status:'stored-on-this-device'},slots};
 });
 ops.push(close);
 return {n,start,close,date,ops,session:{start_op_id:start,effective:{local_date:date,local_time:'10:00',utc_offset:'+00:00'},record:{entries:recs}}};
}
function captureLifts(gen,c,byLift,repsByLift,windowHi){
 const cell=v=>v==null?{state:'not_prescribed',display:'Find a working load',source_json:null}:{state:'specified',display:v+' lb',source_json:JSON.stringify({value:v,unit:'lb'})};
 // Round 11 (FC16, spec R9 :127): an FC16 capture also records the window top it was captured under.
 const reps=v=>({state:'specified',display:String(v),source_json:JSON.stringify({value:v,unit:'rep',...(windowHi?{window_hi:v}:{})})});
 // Round 11: only the captured lifts get cells. engine-capture.cjs writes a not_prescribed
 // load cell only for a baseline ask, never beside a typed 97.5 prescription (seed 20261192,
 // an unreachable pair that S8 rightly refuses); an uncaptured lift reads its typed slot.
 gen.collections.ops[c.start].prescription_capture={slots:c.session.record.entries.filter(en=>byLift[en.lift_lineage_id]).flatMap(en=>en.slots.map((slot,i)=>({logical_set_slot:slot.logical_set_slot,lift_lineage_id:en.lift_lineage_id,
  load:cell(byLift[en.lift_lineage_id][i]),...(repsByLift&&Number.isFinite(repsByLift[en.lift_lineage_id])?{reps:reps(repsByLift[en.lift_lineage_id])}:{})})))};
}
// Round 9: pathological display names (delimiters, unicode, empty-like, long).
const R9_WALK_NAMES=['Fx Press','Renamed Press','Bench (renamed)','Fx: Press','Fx Row',Array(12).fill('A').join(': '),': : :','',' ',String.fromCharCode(0x3a9,58,32,0x416),'x'.repeat(120)+': z'];
// Round 20 part B1 (spec R9.12 PART B (B2), PM brief round 20 part B1; R9.11 M WALK (a)): every Start of this walk takes its
// card through the real capture (realCard below), and the athlete route admits only a non-blank exercise name
// (plan-edit-commands.cjs:48 fieldOf -> text(), :32, at 189d076), so the walk's rename draws only such names. '' and ' '
// stay covered where no capture is prepared: R9-B23 NAMES ARE NOT IDENTITY and the fold-level I4 check.
const R9_WALK_CARD_NAMES=R9_WALK_NAMES.filter(n=>typeof n==='string'&&n.trim()!=='');
// Round 20 part B1 (spec R9.12 PART B (B1)): the walk's plan trains its lifts on every day. The fixture split puts day
// type 'U' on two weekdays only, so most walk dates (dayAt(n-1)) would prescribe no walk lift at all. FC01 and FC03 read
// no split, so the fold is unchanged; the real capture prepares each Start at that Start's own local date (day type 'U').
const WALK_SPLIT=Object.freeze({from:D0,map:Object.freeze({0:'U',1:'U',2:'U',3:'U',4:'U',5:'U',6:'U'})});
const WALK_CAP_BASIS=Object.freeze({plan_basis:'fx-plan',input_basis:'fx-input',source_revision:1});
function walkCapture(state,day){
 const adapter=CAPTURE_FACTORY.createEngineWorkoutCapture({engine:engineAt(day),prescriptionCapture:PRESCRIPTION.createPrescriptionCapture({parseStrictJson:JSON.parse}),
  producerIdentity:{app_build:'fx-app',engine_build:'fx-engine',rule_profile:CAPTURE_FACTORY.PROFILE,source_schema:'fx-schema'}});
 return adapter.prepare({state,day,sleep:{},basis:structuredClone(WALK_CAP_BASIS)}).capture;
}
const liftOfSpend=s=>{try{return JSON.parse(s)[1];}catch{return null;}};
// Round 21b (spec R9.13 (iv) A-LEGACY-VECTOR, D-L13-LEGACY-WALK; owner approval DECISIONS:819 "Spread it evenly"): the walk and the
// R913-ALV-* rows call the PRODUCT's admission conversion. rebuild/m3/w6/local/source-admission.mjs cannot be loaded here: its module
// graph reaches a protected-five file (it imports m4/import/engine-provider.cjs, which requires rebuild/engine/migrate.cjs; the guard
// refuses it). So its dependency-free conversion is read out of the product file between its A-LEGACY-VECTOR markers and evaluated
// as written: the product's own bytes, never a copy (R913-ALV-PRODUCT pins the markers, the export and the call site).
const ALV=(()=>{const file=path.join(ROOT,'rebuild/m3/w6/local/source-admission.mjs');
 try{const src=require('node:fs').readFileSync(file,'utf8'),a=src.indexOf('/* A-LEGACY-VECTOR BEGIN'),b=src.indexOf('/* A-LEGACY-VECTOR END */');
  if(a<0||b<a)return {fn:null,src,reason:'A-LEGACY-VECTOR markers absent from '+file};
  const at=src.indexOf('export function legacyVectorAdmission(',a);if(at<0||at>b)return {fn:null,src,reason:'export function legacyVectorAdmission absent between the markers'};
  return {fn:new Function(src.slice(at+'export '.length,b).trim()+'\nreturn legacyVectorAdmission;')(),src,reason:null};}
 catch(err){return {fn:null,src:null,reason:String(err&&err.message||err)};}})();
// I18's own predicate (never the product's): a LEGACY SCALAR STRUCTURAL ENTRY (spec R9.13 (iv) DEFINITIONS).
const alvScalar=q=>!!q&&!q.done&&q.state!=='PROPOSED'&&(q.kind==='debut'||q.kind==='unlock')&&typeof q.native_load_spend!=='string'&&typeof q.newW==='number'&&Number.isFinite(q.newW)&&q.newWSets===undefined;
function propertySequence8(seed){
 const rnd=mulberry32(seed),pick=xs=>xs[Math.floor(rnd()*xs.length)],chance=p=>rnd()<p;
 const baseline=chance(0.25),rowOn=chance(0.5),origW=baseline?null:100;
 const lifts=rowOn?[LIFT,ROW]:[LIFT];
 const m={base:{},legacy:{},comps:[],extras:[],starts:[],proven:[],ledger:[],lastOffer:{},trace:[],k:0,cross:new Set(),missed:[],dev2:{moved:0,kept:0}};
 // Lifts with a yes that an edit of ANOTHER lift (fork, fact correction) followed.
 const touch=X=>{for(const y of m.ledger)if(y.lift!==X&&y.kind!=='compensate')m.cross.add(y.lift);};
 for(const L of lifts)m.base[L]={w:origW,wSets:null,forks:[],n:L===LIFT?'Fx Press':'Fx Row'};
 const base=(patch={})=>{
  const s=rowOn?withRow(origW===null?{w:null}:{}):F0(origW===null?{w:null}:{});
  s.split=[...(s.split||[]),structuredClone(WALK_SPLIT)]; // Round 20 part B1 (B1): every walk date is a 'U' day
  for(const L of lifts){const ex=s.exercises.find(x=>x.id===L),B=m.base[L];ex.w=B.w;if(B.wSets)ex.wSets=B.wSets.slice();else delete ex.wSets;ex.forks=structuredClone(B.forks);ex.n=patch.n?patch.n+' '+L:B.n;
   if(B.hi!==undefined)ex.hi=B.hi;if(B.last!==undefined){if(B.last===null)delete ex.last;else ex.last=B.last.slice();}if(B.sets!==undefined)ex.sets=B.sets;}
  for(const L of lifts)if(m.legacy[L])s.queue.push(structuredClone(m.legacy[L]));
  // Round 21b (spec R9.13 D-L13-LEGACY-WALK): the 'base', 'plan' and 'vector' actions model a RE-ADMISSION (no athlete op writes w
  // or wSets, W/plan-edit-commands.cjs:46), so the admitted base passes through the product's A-LEGACY-VECTOR conversion (ALV above);
  // an entry it names (out of precondition, N-Q1) is kept for I18's class (a).
  if(ALV.fn)m.outOfP=ALV.fn(s);
  return s;
 };
 const gen=(o={})=>{
  const a=foldArgs(m.comps.map(c=>c.built),m.extras,o.rev||'fx-revision-1',base(o.base));
  const ops=a.generation.collections.ops;
  for(const s of m.starts){if(!ops[s.anchor])continue;ops[s.built.start]={op_id:s.built.start,athlete_id:ATH,device_id:DEVICE,device_seq:ops[s.anchor].device_seq+0.5,class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(s.built.start)};captureLifts(a.generation,s.built,{[LIFT]:s.card},{[LIFT]:s.hi},true);}
  // Round 12 (spec R9.1 :127): each completion's Start capture is FC16 (window_hi = the hi at
  // training), legacy (targets only) or absent; foldArgs' default capture (today's hi) is
  // replaced so that the window a completion was captured under is the one it trained at.
  for(const c of m.comps){
   if(c.mode==='none')delete ops[c.built.start].prescription_capture;
   else if(c.cap)captureLifts(a.generation,c.built,c.cap,c.hiAt,c.mode==='fc16');
   if(c.anchor&&ops[c.anchor])ops[c.built.start].device_seq=ops[c.anchor].device_seq+0.5;
   // Round 13 (spec R9.2 :158): a device showing the baseline ask has folded the log's plan
   // ops, holding records included, so its Start names them as causal parents (seeds
   // 20261013, 20261212: a record delivered from a second device is otherwise unordered).
   if(c.startParents)ops[c.built.start].causal_parents=c.startParents.filter(id=>ops[id]);}
  for(const x of m.extras)if(x.parents&&ops[x.op_id])ops[x.op_id].causal_parents=x.parents.filter(id=>ops[id]);
  if(o.twoDevice){
   // Round 21a (Astra L13 D-L13-WALK-I3, seed 13030374): the transform moves the plan ops to other devices and must keep the
   // ORIGINAL partial order exactly, never add one. Until round 20 it chained every op after the previous op of one global
   // device_seq sort and put every plan op on ONE device B in that order, which ordered two exits that the log leaves
   // concurrent (fx-p-7 -> fx-p-8). Now each op keeps its own causal_parents and gains, as causal parents, the op(s) just
   // before it on its ORIGINAL device (strictly smaller device_seq); the plan ops of each original device d move to their own
   // device 'fx-2dev|'+d in their original order (1000+i). The happens-before relation is the transitive closure of the same
   // edges before and after (same-device chains plus causal parents), so the transform neither adds nor drops an order.
   // Round 21c (spec R9.13 (viii) precondition, D-R21L1-2 (a)): measured against FC03 provenBefore, that round-21a form is NOT
   // order-preserving: chaining every op after its same-device predecessor made ops of the main device proven before a device-B
   // op that names one of them as a causal parent (seed 20261001, the first default seed: 26 pairs added, TRANSFORM_ORDER_CHANGED
   // with the precondition asserted over it). It is replaced by deliveryTransform (R7-PROPERTY's section), which asserts the
   // precondition itself.
   deliveryTransform(ops,'R8 twoDevice seed='+seed,m.dev2);
  }
  if(o.unproven){
   // Responses recorded on a second device that shares no causal link with the sessions:
   // their order against every Start is unprovable (spec :151, :156). Three layouts.
   const resp=Object.values(ops).filter(op=>op.class==='plan').sort((x,y)=>x.device_seq-y.device_seq||(x.op_id<y.op_id?-1:1));
   resp.forEach((op,i)=>{op.device_id='fx-device-B';delete op.causal_parents;op.device_seq=o.unproven==='late'?1000+i:o.unproven==='early'?(i+1)/1000:op.device_seq;});
  }
  return a;
 };
 const fold=o=>EFFECTS.m.foldNativeLoad(gen(o));
 const heldCodes=['NATIVE_LOAD_EFFECT_CONFLICT','NATIVE_LOAD_BASIS_REPAIR_REQUIRED','NATIVE_LOAD_RECORD_INVALID'];
 // Round 13 (spec R9.2 :158): a hold superseded by a later adoption is history.
 // Round 18 (spec R9.9 :152, :158): a missed debut is NOT a hold (round 16's isMissedHold is gone).
 const held=(f,L)=>f.issues.some(i=>(i.lift===L||i.lift===null)&&heldCodes.includes(i.code)&&!i.superseded_by);
 // Round 18 (DECISIONS:801 (1)): the set count a lift is trained at (3 unless a 'sets' edit moved it).
 const setsOf=L=>m.base[L].sets===undefined?3:m.base[L].sets;
 const fit=(xs,k)=>Array.from({length:k},(_,i)=>xs[Math.min(i,xs.length-1)]);
 const fail=(what,extra)=>{const e=new Error('PROPERTY8 '+what+' seed='+seed+' trace='+JSON.stringify(m.trace)+(extra?' '+JSON.stringify(extra):''));e.code='PROPERTY_COUNTEREXAMPLE';throw e;};
 const exIn=(s,L)=>s.exercises.find(x=>x.id===L);
 // The lift's EFFECTIVE plan (an edit that sets a field to the value it had is no edit).
 const effOf=L=>JSON.stringify(exIn(base(),L));
 // Round 13: the lift's plan as the held projection shows it (w and wSets null).
 const effShown=L=>JSON.stringify({...exIn(base(),L),w:null,wSets:null});
 const lastWith=L=>[...m.comps].reverse().find(c=>c.spec.entries.some(en=>en.lift===L));
 // Round 13 (spec R9.2 :158): the card is the registered projection: a held lift is the baseline ask.
 // Round 18: a scalar card has the lift's current set count (E/today.cjs:128-129; engine-capture.cjs:81).
 // Round 20 part B2 (STOP-R20B1-3; spec R9.11 M WALK (a) CARD-PARITY, R9.12 PART B): cardOf is EXTENDED to the engine's own
 // card rules, never replaced by the capture: E/today.cjs genSession (:92-98) makes a lift's card a debut only when
 // pickStructural (:53-60) made it active (at most one non-co-approved debut/unlock entry a day, legacy or native), and an active
 // lift reads its FIRST unfinished debut/unlock entry (so a visible legacy DEBUT on an unheld lift prescribes its newW);
 // W/engine-capture.cjs:92-95 then writes newWSets (fitted, R9.10 FIT), else the plan's wSets (fitted), else newW (or w) on every set.
 const engDay=new Map(),engOf=d=>{if(!engDay.has(d))engDay.set(d,engineAt(d));return engDay.get(d);};
 const activeEntry=(st,L,day)=>{const pk=engOf(day).pickStructural(st,day,{});if(![pk.main,...pk.riders].some(q=>q&&q.exId===L))return null;
  return st.queue.find(x=>x&&x.exId===L&&!x.done&&(x.kind==='debut'||x.kind==='unlock'))||null;};
 const cardOf=(f,L,day=CARD_DAY)=>{const st=EFFECTS.m.heldProjection(f).state,k=setsOf(L),ex=exIn(st,L),q=activeEntry(st,L,day);
  if(q)return Array.isArray(q.newWSets)?fit(q.newWSets,k):Array.isArray(ex.wSets)?fit(ex.wSets,k):Array(k).fill(q.newW!=null?q.newW:ex.w);return Array.isArray(ex.wSets)?fit(ex.wSets,k):Array(k).fill(ex.w);};
 // The native debut entry that the day's card prescribes for L (null when none is active, or the active entry is legacy).
 const nativeActive=(fS,L,day)=>{const q=activeEntry(EFFECTS.m.heldProjection(fS).state,L,day);return q&&typeof q.native_load_spend==='string'?q:null;};
 // Round 20 part B2 I17 HOST-NO-NEVER-HELD (spec R9.12 WALK (b'); RESIDUAL (iv) :157; N28-HOST-NO-NEVER-HELD): after every check
 // the walk makes, an adopt-baseline offer carries authority_refs [] unless an active hold issue of the lift at that point (the
 // check's own fold) names each ref. This local checkOf is the file's checkOf plus that assertion.
 const checkOf=(args,lift,c,intent='check')=>{const r=EFFECTS.m.checkNativeLoad({...args,request:{lift_lineage_id:lift,completion_op_id:c.close,intent}}),ev=r.evaluation;
  if(intent==='check'&&ev&&ev.status==='offer'){const act=((r.fold&&r.fold.issues)||EFFECTS.m.foldNativeLoad(args).issues).filter(i=>i&&i.lift===lift&&EFFECTS.m.isHold(i)&&!i.superseded_by);
   for(const o of ev.offers){const d=decisionOf(o),ar=(d&&d.basis&&d.basis.load_basis&&d.basis.load_basis.authority_refs)||[];if(!d||d.kind!=='adopt-baseline')continue;
    if(ar.length&&!ar.every(x=>x&&act.some(i=>(i.refs||[]).some(y=>y&&y.op_id===x.op_id))))fail('I17 HOST-NO-NEVER-HELD an adopt-baseline offer names a ref that no active hold names',{lift,refs:ar,holds:act.map(i=>[i.code,(i.refs||[]).map(y=>y.op_id)])});
    m.trace.push(ar.length?'i17-exit-refs':'i17-empty');}}
  return ev;};
 // Round 20 part B1 (spec R9.11 M WALK (a); R9.12 PART B (B1)): every generated Start takes its card from the registered
 // projection through the REAL capture boundary (W/engine-capture.cjs prepare({state,day,sleep:{},basis})), where state is
 // EFFECTS.m.heldProjection(fStart).state of the fold taken just before that Start and day is that Start's own local date.
 // A prepare refusal is counterexample I15 NO-TRAP-CAPTURE: never skipped, never replaced by cardOf. cardOf stays only as
 // the CARD-PARITY oracle: wherever prepare succeeds, cardOf equals the captured loads (null for the baseline ask).
 const realCard=(fStart,L,day,stage)=>{
  const st=EFFECTS.m.heldProjection(fStart).state;let capture;
  try{capture=walkCapture(st,day);}
  catch(err){fail('I15 NO-TRAP-CAPTURE '+(err&&err.code||String(err&&err.message||err))+' at '+stage,{lift:L,day,projected:exIn(st,L),queue:st.queue.filter(q=>q&&q.exId===L&&!q.done),
   day_lifts:lifts.map(x=>({lift:x,ex:exIn(st,x),queue:st.queue.filter(q=>q&&q.exId===x&&!q.done)}))});} // the whole day prepares: name every lift
  const got=capture.slots.filter(x=>x.lift_lineage_id===L).map(x=>x.load.state==='specified'?JSON.parse(x.load.source_json).value:null),want=cardOf(fStart,L,day);
  if(JSON.stringify(got)!==JSON.stringify(want))fail('CARD-PARITY the real capture differs from cardOf at '+stage,{lift:L,day,captured:got,cardOf:want,projected:exIn(st,L)});
  m.trace.push(got[0]===null?'capture-ask':'capture-card');
  return got;
 };
 const norm=f=>({state:f.state?lifts.map(L=>{const ex=structuredClone(exIn(f.state,L));delete ex.n;return ex;}):null,
  queue:f.state?f.state.queue.filter(q=>q.native_load_spend).map(q=>{const x={...q};delete x.t;return x;}):null,
  spent:f.spent.map(x=>[x.spend_id,x.cancelled_by,x.close_ref&&x.close_ref.op_id]).sort(),
  issues:[...new Set(f.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code+'@'+i.lift))].sort()});
 // Live = kept, not cancelled, not held back. A corrected basis (BASIS_REPAIR_REQUIRED)
 // RETAINS its effect, labeled disputed (spec :157); it only refuses further authorization.
 const live=(f,y)=>{const x=f.spent.find(s=>s.spend_id===y.spend);return !!x&&!x.cancelled_by&&!f.issues.some(i=>i.spend_id===y.spend&&i.code!=='NATIVE_LOAD_BASIS_REPAIR_REQUIRED');};
 const checkInvariants=stage=>{
  // Round 21b I18 A-LEGACY-VECTOR (spec R9.13 (iv), D-L13-LEGACY-WALK): after every re-admission no legacy scalar structural entry
  // sits on a lift whose wSets is an array. Class (a), an out-of-precondition base (N-Q1), is named, never exempted.
  {const b0=base();
   for(const L of lifts){const ex=exIn(b0,L);if(!Array.isArray(ex.wSets))continue;const bad=b0.queue.filter(q=>q&&q.exId===L&&alvScalar(q));
    if(bad.length)fail('I18 A-LEGACY-VECTOR a legacy scalar structural entry on a per-set-weight lift after re-admission'+((m.outOfP||[]).some(x=>x.exId===L)?' (class (a) out of precondition, N-Q1)':'')+' at '+stage,{lift:L,w:ex.w,wSets:ex.wSets,queue:bad});}}
  const f=fold();
  if(f.status!=='ready'||!f.state){m.refusedFold=(m.refusedFold||0)+1;return f;}
  // Round 15 I12 (spec R9.4 :159, D-R9-LEGACY-ENTRY): the registered projection hides EVERY
  // unfinished debut/unlock entry of a held lift, native or legacy; legacy entries stay in the
  // fold state; a held lift carrying a legacy entry is the baseline ask on its card.
  {const hp=EFFECTS.m.heldProjection(f).state;
   for(const L of lifts){
    const heldL=f.issues.some(i=>i.lift===L&&EFFECTS.m.isHold(i)&&!i.superseded_by);
    if(m.legacy[L]&&!f.state.queue.some(q=>q.exId===L&&!q.done&&typeof q.native_load_spend!=='string'))fail('I12 a legacy entry left the fold state at '+stage,{lift:L});
    if(!heldL)continue;
    if(hp.queue.some(q=>q&&q.exId===L&&!q.done&&['debut','unlock'].includes(q.kind)))fail('I12 an unfinished debut/unlock entry of a held lift is visible at '+stage,{lift:L,queue:hp.queue});
    if(m.legacy[L]){m.trace.push('legacy-held-projected');
     const card=engineAt(CARD_DAY).genSession(hp,CARD_DAY,{}).ex.find(c=>c.id===L);
     if(card&&(card.w!==null||card.isDebutNow))fail('I12 a held lift with a legacy entry is not the baseline ask at '+stage,{lift:L,w:card.w,isDebutNow:card.isDebutNow});}
   }}
  // Round 20 part B2 I16 (spec R9.11 M WALK (a), :158 INVARIANT, NO TRAP capture): no registered projection carries a visible
  // unfinished native entry of a lift whose w is null or ABSENT, and no programme carries a numeric w over a present-null wSets.
  {const hp=EFFECTS.m.heldProjection(f).state;
   for(const L of lifts){const pe=exIn(f.state,L),he=exIn(hp,L);
    if(he.w==null&&hp.queue.some(q=>q&&q.exId===L&&!q.done&&typeof q.native_load_spend==='string'))fail('I16 a visible unfinished native entry over w null or absent at '+stage,{lift:L,ex:he,queue:hp.queue.filter(q=>q&&q.exId===L&&!q.done)});
    // Round 21b (spec R9.13 (v) LEGACY-OVER-NULL, :158 INVARIANT widened): nor a visible unfinished LEGACY debut/unlock entry.
    if(he.w==null&&hp.queue.some(q=>q&&q.exId===L&&!q.done&&typeof q.native_load_spend!=='string'&&['debut','unlock'].includes(q.kind)))fail('I16 a visible unfinished legacy debut/unlock entry over w null or absent at '+stage,{lift:L,ex:he,queue:hp.queue.filter(q=>q&&q.exId===L&&!q.done)});
    if(typeof pe.w==='number'&&Object.hasOwn(pe,'wSets')&&pe.wSets===null)fail('I16 a numeric w over a present-null wSets at '+stage,{lift:L,ex:pe});}}
  for(const L of lifts){
   const ex=exIn(f.state,L),B=m.base[L],auth=ex.native_load_authority,ctx={lift:L,base:B,auth,w:ex.w,wSets:ex.wSets,ledger:m.ledger.filter(y=>y.lift===L)};
   if(!auth){
    if(ex.w!==B.w||JSON.stringify(ex.wSets||null)!==JSON.stringify(B.wSets||null))fail('I1 weight moved without a live authority at '+stage,ctx);
   }else if(auth.kind==='adopted'){
    const y=m.ledger.find(y=>y.lift===L&&y.spend===auth.spend_id&&y.kind!=='earn'&&y.kind!=='compensate');
    if(!y||!live(f,y))fail('I1 adopted authority without a live adoption yes at '+stage,ctx);
    if(ex.w!==y.targetW)fail('I1 adopted w is not its target at '+stage,ctx);
   }else if(auth.kind==='landed'){
    const y=m.ledger.find(y=>y.lift===L&&y.spend===auth.spend_id&&y.kind==='earn');
    if(!y||!live(f,y))fail('I1 landed authority without a live earn yes at '+stage,ctx);
    if(ex.w!==y.targetW)fail('I1 landed w is not its target at '+stage,ctx);
    // Round 18 (spec R9.9 :152 SELECTED ENTRY, DECISIONS:801 (1)): the debut's card is newW on every
    // captured slot whatever their number (a scalar target), or exactly newWSets (a vector target).
    const selected=s=>Array.isArray(s)&&s.length>0&&(Array.isArray(y.newWSets)?JSON.stringify(s)===JSON.stringify(y.newWSets):s.every(v=>v===y.targetW));
    if(!m.comps.some(c=>c.seen[L]&&selected(c.seen[L])&&c.capExtras.includes(y.op)))fail('I1 landed without a closed Start that captured the target after the yes at '+stage,ctx);
   }else if(auth.kind==='compensated'){
    // A cancellation restores the prior image (applied) or retires only (held): the
    // cancelled weight never survives it. The prior image is the weight the cancelled yes
    // was issued on: its load authority root's target when that yes is still live, else
    // the plan's. It names a recorded cancellation of a recorded yes.
    const y=m.ledger.find(y=>y.lift===L&&y.spend===auth.spend_id&&y.kind==='compensate'),t=m.ledger.find(y=>y.lift===L&&y.spend===auth.compensates);
    if(!y||!t)fail('I1 compensated authority without a recorded cancellation of a recorded yes at '+stage,ctx);
    const rootSp=(()=>{try{const d=JSON.parse(auth.compensates);return typeof d[2]==='string'?d[2]:null;}catch{return null;}})();
    const root=rootSp?m.ledger.find(z=>z.lift===L&&z.spend===rootSp):null;
    // A root that is itself a cancellation restored the plan's weight (seed 20270192).
    // Round 13 (spec R9.2 :156 c2, :158): an exit adoption was issued on the held
    // projection (w null), so its cancellation restores the baseline ask, not the plan's
    // weight (seeds 20261085, 20261243, 20261376).
    // Round 14 (seed 1006807): a root cancellation OF AN EXIT restored the baseline ask (null),
    // so the prior image of a yes rooted in it is null, not the plan's weight.
    const rootUndoesExit=root&&root.kind==='compensate'&&(()=>{try{const d=JSON.parse(root.spend);const x=m.ledger.find(z=>z.lift===L&&z.spend===d[2]);return !!(x&&x.exit);}catch{return false;}})();
    // Round 16 (spec R9.4 :156, Astra L8 B28): a RESTORE is classified AND applied by the
    // record's own shape: its recorded target (the adoption's recorded base_load) is the
    // weight, whatever the base is on this replay (moved or not, the adoption applied or held).
    const want=y.restore?y.restoreW:t.exit||rootUndoesExit?null:root&&root.kind!=='compensate'&&live(f,root)?root.targetW:B.w;
    if(y.restore)m.trace.push(B.w!==y.restoreW?'restore-moved-base':'restore-same-base');
    if(ex.w!==want)fail('I1 an agreed weight survives its cancellation at '+stage,{...ctx,want});
    if(ex.w===t.targetW&&t.targetW!==want)fail('I1 the cancelled weight is current at '+stage,ctx);
   }else fail('I1 unknown authority kind '+auth.kind+' at '+stage,ctx);
  }
  // Round 18 (spec R9.9 :155; l11 A1, A2): a genuine adoption claiming a missed debut Close, and
  // an unclaimed adoption on the card of an old missed target (the A1 class), are never
  // RECORD_INVALID: a later correction that lands the claimed Close keeps its claim verifiable (A2),
  // and an unclaimed record is anchored to its own capture, never to an inferred miss (A1).
  for(const y of m.ledger)if((y.claimed||y.a1)&&f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&(i.refs||[]).some(r=>r&&r.op_id===y.op)))
   fail('I14 a '+(y.claimed?'claimed':'A1 unclaimed')+' adoption is RECORD_INVALID at '+stage,{y,issues:f.issues});
  for(const p of m.proven){
   const x=f.spent.find(y=>y.spend_id===p.target);
   // Round 19 (spec R9.10 L LATER HOLD UNDO, D-R9.9-LATER-HOLD-UNDO, DECISIONS:804): round 18's 'later-hold-undo'
   // exemption (walk seeds 20264386, 20266433) is removed: a claimed adoption refused TARGET_QUEUED behind the earn a later
   // correction disputes is held back with its spend kept, so a cancellation of it recorded before that correction cancels it.
   // Round 12 (spec R9.1 :158 NO TRAP): a yes behind a hold is kept as accepted history and
   // its undo applies, so round 11's exemption (seeds 20262492, 20264171) is removed.
   if(!x||!x.cancelled_by)fail('I2 proven cancellation lost at '+stage,{target:p.target,issues:f.issues.map(i=>[i.code,i.field,i.lift,(i.refs||[]).map(r=>r.op_id),i.reason||null,!!i.superseded_by]),spent:f.spent.map(s=>[s.spend_id,s.cancelled_by,s.response_refs.map(r=>r.op_id)]),extras:m.extras.map(e=>[e.op_id,e.after,e.device||null,e.payload.issuance.body.kind,e.payload.issuance.body.kind==='compensate'?e.payload.issuance.body.compensates:null])});
   const L=liftOfSpend(p.target),c=lastWith(L);
   if(c&&!held(f,L)){const again=checkOf(gen(),L,c.built,{compensate:p.target});if(again.status==='offer')fail('I2 cancelled spend offered again at '+stage);}
  }
  return f;
 };
 // Round 14 I11 (spec R9.3 :160 APPLIED BASE, G2): an Undo of a DISPUTED APPLIED adoption
 // (the lift held, the adoption still its applied authority) is issued on the applied state
 // (base = the applied w, target = the adoption's prior image) and its yes restores that prior
 // image, never leaving the adopted w applied. f is the fold the offer was checked on.
 const acceptUndo=(L,target,f,ev)=>{
  const ex0=exIn(f.state,L),a0=ex0&&ex0.native_load_authority,disputedApplied=!!a0&&a0.kind==='adopted'&&a0.spend_id===target&&held(f,L)&&!!a0.prior&&!!a0.prior.w;
  const d=decisionOf(ev.offers[0]),op_id='fx-p-'+(++m.k);m.extras.push(acceptOp(ev.offers[0],{op_id,after:m.comps.length}));m.proven.push({target,undo:d.spend_id});
  const sameShape=JSON.stringify(d.target_load.scalar)===JSON.stringify(d.base_load.scalar)&&JSON.stringify(d.target_load.vector)===JSON.stringify(d.base_load.vector);
  m.ledger.push({lift:L,spend:d.spend_id,kind:'compensate',target:null,targetW:null,op:op_id,restore:!sameShape,restoreW:d.target_load.scalar?d.target_load.scalar.value:null});m.trace.push(sameShape?'undo-yes':'undo-yes-restore');
  if(!disputedApplied)return;
  m.trace.push('undo-disputed-applied');
  const want=a0.prior.w.present?a0.prior.w.value:undefined,ts=d.target_load.scalar?d.target_load.scalar.value:null;
  if(ts!==(want===undefined?null:want)||!(d.base_load.scalar&&d.base_load.scalar.value===ex0.w))fail('I11 an Undo of a disputed applied adoption is not issued on the applied state',{lift:L,base:d.base_load,target:d.target_load,prior:a0.prior.w,w:ex0.w});
  const g=fold(),exG=exIn(g.state,L);
  if(JSON.stringify(exG.w)!==JSON.stringify(want))fail('I11 an Undo of a disputed applied adoption does not restore the prior image',{lift:L,w:exG.w,want,issues:g.issues});
 };
 const steps=8+Math.floor(rnd()*12);
 for(let step=0;step<steps;step++){
  const f=fold();
  if(f.status!=='ready'||!f.state){m.trace.push('fold-refused');break;}
  // Weights: the rare classes appear about once per walk so that yeses stay frequent.
  const L=pick(lifts),action=pick(m.comps.length<2?['train','train','train','train','base','rename']:
   ['train','train','train','train','check','check','check','check','undo','undo','base','rename','plan','capture','finish','reopen','dup','undo2',
    ...(chance(0.5)?['correct','fork','legacy','vector','sets']:[]),...(chance(0.5)?['window','cache']:[]),...(chance(0.6)?['forge','forge']:[])]);
  m.trace.push(action);
  if(action==='train'){
   // Round 13 (spec R9.2 :158 TRAINABLE WHILE HELD): a held lift is trained on its baseline ask.
   const on=rowOn?pick([[LIFT],[ROW],[LIFT,ROW],[LIFT,ROW]]):[LIFT],heldNow=new Set(on.filter(x=>held(f,x)));
   const n=m.comps.length+1,v1=chance(0.3),cap={},entries=[],missCand=[],a1Cand=[];
   let fStart=f; // Round 20 part B1: the fold just before this Start (folded again after a set-count edit)
   for(const X of on){
    // Round 16, rewritten in round 18 (spec R9.9 :152 MISSED DEBUT, DECISIONS:801 (1)): a native
    // debut card is trained at its target (a landing), 5 lb light on every set (the working
    // weight of a scalar debut), 2.5 lb light or 5 lb heavy on every set (an equal other load),
    // or with its last set 5 lb light (mixed loads): every one of these Closes CONSUMES the entry,
    // landing only at the target. The set-count class: a scalar debut's set count is sometimes
    // edited (2 or 4) between the yes and this Start, so its card is newW on the new count.
    // A1 (l11): after a miss, a later training lifts the old missed target on the working-weight
    // card (the adoption that makes w equal it), and a training on that target's card lifts
    // another equal load; the check and yes that follow are made below (a1Cand).
    const one=pick([60,65]),debutQ=!heldNow.has(X)&&!!nativeActive(f,X,dayAt(n-1)); // Round 20 part B2: the native debut the day's card prescribes
    const scalarDebut=debutQ&&!m.base[X].wSets&&!Array.isArray(nativeActive(f,X,dayAt(n-1)).newWSets);
    if(scalarDebut&&setsOf(X)===3&&chance(0.2)){m.base[X].sets=pick([2,4]);m.trace.push(['sets-before-debut',X,setsOf(X)]);fStart=fold();}
    const card=realCard(fStart,X,dayAt(n-1),'train '+n),k=card.length;
    const onMissed=!debutQ&&card[0]!==null&&!m.base[X].wSets&&m.missed.some(z=>z.lift===X&&card.every(v=>v===z.T));
    const upTo=!debutQ&&card[0]!==null&&!m.base[X].wSets&&!onMissed?m.missed.find(z=>z.lift===X&&z.T!==card[0]&&!heldNow.has(X)):null;
    const cls=card[0]===null?'ask':debutQ?pick(['land','land','light','light','other','other','heavy','mixed']):onMissed&&chance(0.5)?'a1':upTo&&chance(0.3)?'a1-setup':chance(0.15)?'heavy':'card';
    const lifted=cls==='ask'?(heldNow.has(X)?card.map(()=>one):card.map(()=>pick([60,65]))):cls==='light'||cls==='a1'?card.map(v=>v-5):cls==='other'?card.map(v=>v-2.5):
     cls==='heavy'?card.map(v=>v+5):cls==='mixed'?card.map((v,i)=>i===k-1?v-5:v):cls==='a1-setup'?card.map(()=>upTo.T):card.slice();
    if(debutQ)missCand.push(X);
    if(cls==='a1'||cls==='a1-setup')a1Cand.push(X);
    // Round 11: over-performance above the window top (spec R9 :127 legacy clause). Round 18: reps
    // and effort follow the card's set count (a 'sets' edit, DECISIONS:801 (1)).
    entries.push({lift:X,reps:fit(pick([TOP,TOP,TOP,[10,9,7],[9,8,8],[12,12,11],[13,12,12]]),k),loads:lifted,prescribed:card,effort:fit(chance(0.8)?e(2,1,1):e(0,1,1),k),v1});
    cap[X]=card;
   }
   // Round 12 (spec R9.1 :127): the Start's capture is FC16 (most), made before FC16 (legacy
   // targets), or absent (an old Start). Legacy and absent captures never earn again.
   // A host v1 session always has its Start capture (the host writes it through
   // engine-capture.cjs); only a typed v2 entry can come from a capture-less Start (seed
   // 20261315: a capture-less v1 adoption fails S8 under R2 only).
   const r=rnd(),mode=r<0.7?'fc16':r<0.9||v1?'legacy':'none';
   const spec={n,entries},seen={};
   // What the landing reads (FC03 captureOf): the Start's capture cell, else a typed v2
   // slot's own prescribed_load (the card it was prescribed), never a v1 slot's.
   for(const en of entries)seen[en.lift]=mode!=='none'?cap[en.lift]:en.v1?null:en.prescribed.slice();
   // Round 9: the Start capture also carries a rep target per set (<= the window top then).
   const hiAt={};for(const X of on)hiAt[X]=m.base[X].hi===undefined?10:m.base[X].hi;
   // The device that showed a baseline ask folded every plan op in the log (seed 20263860:
   // naming only the holds of that moment leaves a record that a later base change turns into
   // a hold unordered against the exit, while the two-device layout orders it).
   const startParents=heldNow.size?m.extras.map(x=>x.op_id):[];
   m.comps.push({spec,built:sess2(n,spec),cap:mode==='none'?null:cap,hiAt,mode,seen,capExtras:m.extras.map(x=>x.op_id),...(startParents.length?{startParents}:{})});
   m.trace.push([n,on.map(x=>x===LIFT?'P':'R').join(''),entries[0].prescribed[0],entries[0].loads[0],v1?'v1':'v2',mode]);
   // Round 18 I14 (spec R9.9 :152, :155, :158; DECISIONS:796 (c), :801 (1)): a Close whose Start
   // captured the pending native debut's card (acceptance proven, spend neither disputed nor held:
   // the entry is visible on the registered projection) CONSUMES it: it lands iff every original
   // slot was performed at the target load, else the entry is done/'MISSED' (never landed, never
   // pending), the lift is not held, w, wSets, wAt and last are as before the Close, and the next
   // card is not the debut target. The check on a missed Close offers exactly [adopt-observed of
   // the actual loads] claiming authority_refs [that Close's Ref] when they are equal and differ
   // from w, refuses PLAN_CHANGED [Close Ref] when they are the plan and VECTOR_ADOPTION_UNDEFINED
   // [Close Ref] when unequal or on a vector plan (PREFIX_UNRESOLVED when incomplete: this walk
   // records no incomplete debut); its yes sets w to that load and leaves the entry 'MISSED'; its
   // Undo before descendants restores the prior image (I1, compensated branch).
   for(const X of missCand){
    const en=entries.find(x=>x.lift===X),q0=nativeActive(f,X,dayAt(n-1));
    if(!en||!q0||JSON.stringify(seen[X])!==JSON.stringify(en.prescribed))continue;
    const tgt=Array.isArray(q0.newWSets)?q0.newWSets.slice():en.prescribed.map(()=>q0.newW),exact=en.loads.every((v,i)=>v===tgt[i]);
    const c=m.comps.at(-1),g=fold();if(g.status!=='ready')continue;
    const gq=g.state.queue.find(q=>q.native_load_spend===q0.native_load_spend);
    if(!gq||!gq.done||gq.state!==(exact?'ESTABLISH':'MISSED'))fail('I14 a debut Close did not consume its entry '+(exact?'as a landing':'as a MISSED DEBUT'),{lift:X,q:gq,loads:en.loads,card:en.prescribed,issues:g.issues});
    if(setsOf(X)!==3)m.trace.push(exact?'setcount-landed':'setcount-missed');
    if(exact){m.trace.push('debut-landed');continue;}
    if(gq.native_load_missed_by!==c.built.close)fail('I14 the missed entry does not name its Close',{lift:X,q:gq});
    if(held(g,X))fail('I14 a missed debut holds the lift',{lift:X,issues:g.issues});
    const b0=exIn(f.state,X),b1=exIn(g.state,X);
    for(const key of ['w','wSets','wAt','last'])if(JSON.stringify(b0[key])!==JSON.stringify(b1[key]))fail('I14 a missed debut wrote '+key,{lift:X,before:b0[key],after:b1[key]});
    if(JSON.stringify(cardOf(g,X,dayAt(n)))===JSON.stringify(tgt))fail('I14 the missed debut target is prescribed again',{lift:X,card:cardOf(g,X,dayAt(n))});
    m.trace.push('missed-consumed');m.missed.push({lift:X,n,close:c.built.close,card:en.prescribed.slice(),T:q0.newW});
    if(m.legacy[X]||m.base[X].forks.some(fk=>String(fk.from)>dayAt(n-1))||g.issues.some(i=>i.lift===null&&heldCodes.includes(i.code)))continue;
    const ev=checkOf(gen(),X,c.built),plan=Array.isArray(b1.wSets)?b1.wSets:en.prescribed.map(()=>b1.w);
    const uniform=en.loads.every(v=>v===en.loads[0]),atPlan=en.loads.every((v,i)=>v===plan[i]);
    const refusedAs=(code,trace)=>{if(!(ev.status==='refused'&&ev.refusal.code===code&&JSON.stringify(ev.refusal.refs.map(r=>r.op_id))===JSON.stringify([c.built.close])))
     fail('I14 a missed Close is not '+code+' [its Close Ref]',{lift:X,ev:ev.status,refusal:ev.refusal,offers:(ev.offers||[]).map(o=>decisionOf(o).kind),loads:en.loads,plan});m.trace.push(trace);};
    if(atPlan){refusedAs('NATIVE_LOAD_PLAN_CHANGED','missed-plan-changed');continue;}
    if(!uniform||Array.isArray(b1.wSets)){refusedAs('NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED','missed-unequal');continue;}
    if(!(ev.status==='offer'&&ev.offers.length===1&&decisionOf(ev.offers[0]).kind==='adopt-observed'))
     fail('I14 a missed debut at another equal load is not offered exactly one adopt-observed',{lift:X,refusal:ev.refusal,offers:(ev.offers||[]).map(o=>decisionOf(o).kind)});
    const o=ev.offers[0],d=decisionOf(o);
    if(JSON.stringify(d.target_load.vector.map(v=>v&&v.value))!==JSON.stringify(en.loads))fail('I14 the missed offer is not the actual loads',{lift:X,target:d.target_load,loads:en.loads});
    if(JSON.stringify((d.basis.load_basis.authority_refs||[]).map(r=>r&&r.op_id))!==JSON.stringify([c.built.close]))fail('I14 the missed offer does not claim exactly [its Close Ref]',{lift:X,refs:d.basis.load_basis.authority_refs});
    m.trace.push('missed-observed-offered');
    if(chance(0.7)){const op_id='fx-p-'+(++m.k);m.extras.push(acceptOp(o,{op_id,after:m.comps.length}));
     m.ledger.push({lift:X,spend:d.spend_id,kind:d.kind,target:d.target_load.vector.map(v=>v?v.value:null),targetW:d.target_load.scalar.value,op:op_id,claimed:true});m.trace.push('missed-observed-yes');
     const g1=fold(),q1=g1.state.queue.find(q=>q.native_load_spend===q0.native_load_spend);
     if(exIn(g1.state,X).w!==d.target_load.scalar.value||!q1||q1.state!=='MISSED')fail('I14 the yes to a missed offer does not set w with the entry left MISSED',{lift:X,w:exIn(g1.state,X).w,q:q1,issues:g1.issues});}
   }
   // Round 18 A1 class (spec R9.9 :155 "The claim is never inferred"; l11 A1): the check and yes
   // that follow the A1 trainings above, so that the unclaimed adoption this class needs (w made
   // equal to an old missed target, then another equal load on that target's card) is recorded.
   // Such a record claims nothing (authority_refs []), is anchored to its own capture and is
   // never RECORD_INVALID (checked at every step, I14 above).
   for(const X of a1Cand){
    const c=m.comps.at(-1),g=fold();if(g.status!=='ready'||held(g,X))continue;
    const ev=checkOf(gen(),X,c.built),o=ev.status==='offer'?ev.offers.find(x=>decisionOf(x).kind==='adopt-observed'):null;
    if(!o||!chance(0.8))continue;
    const d=decisionOf(o);if((d.basis.load_basis.authority_refs||[]).length)fail('A1 an adoption on an ordinary card claims a Close',{lift:X,refs:d.basis.load_basis.authority_refs});
    const seenX=c.seen[X],a1=Array.isArray(seenX)&&seenX.length>0&&m.missed.some(z=>z.lift===X&&seenX.every(v=>v===z.T)),op_id='fx-p-'+(++m.k);
    m.extras.push(acceptOp(o,{op_id,after:m.comps.length}));
    m.ledger.push({lift:X,spend:d.spend_id,kind:d.kind,target:d.target_load.vector.map(v=>v?v.value:null),targetW:d.target_load.scalar.value,op:op_id,...(a1?{a1:true}:{})});
    m.trace.push(a1?'a1-unclaimed-yes':'a1-setup-yes');
   }
   // Round 13 I10 (spec R9.2 :158, N27): a held lift trained again always reaches an exit: its
   // new completion (after every holding record) is offered an adoption of what was lifted.
   // Not a trap by the spec's own terms: an unattributable hold (lift null), and a lift whose
   // legacy PROPOSED entry keeps its legacy branch (LEGACY_PENDING), which is not a hold.
   for(const X of heldNow){
    const g0=fold();if(g0.status!=='ready'||g0.issues.some(i=>i.lift===null&&heldCodes.includes(i.code)))continue;
    // Round 15 I10b (spec R9.4 :162): a pending legacy entry keeps its own branch: the held
    // lift trained again is never offered the adoption past it (LEGACY_PENDING, named).
    if(m.legacy[X]){const lv=checkOf(gen(),X,m.comps.at(-1).built);
     if(lv.status==='offer')fail('I10b an adoption offered past a pending legacy entry',{lift:X,offers:lv.offers.map(o=>decisionOf(o).kind)});
     m.trace.push('legacy-held-check:'+lv.refusal.code);continue;}
    // A completion dated before a technique fork the athlete already declared is older than
    // that choice (step 2 PLAN_CHANGED, spec :126; seeds 20261170, 20261189): the exit is
    // reached by the first training on or after the fork, which I10 checks in turn.
    if(m.base[X].forks.some(fk=>String(fk.from)>dayAt(n-1)))continue;
    const c=m.comps.at(-1),ev=checkOf(gen(),X,c.built);
    if(!(ev.status==='offer'&&ev.offers.some(o=>decisionOf(o).kind==='adopt-baseline')))fail('I10 a held lift trained again reaches no exit',{lift:X,refusal:ev.refusal,offers:(ev.offers||[]).map(o=>decisionOf(o).kind)});
    m.trace.push('exit-offered');
    if(chance(0.7)){const o=ev.offers.find(x=>decisionOf(x).kind==='adopt-baseline'),d=decisionOf(o),op_id='fx-p-'+(++m.k);m.extras.push(acceptOp(o,{op_id,after:m.comps.length}));
     m.ledger.push({lift:X,spend:d.spend_id,kind:d.kind,target:d.target_load.vector.map(v=>v?v.value:null),targetW:d.target_load.scalar.value,op:op_id,exit:true});m.trace.push('exit-yes');
     const g1=fold();if(held(g1,X))fail('I10 an accepted exit adoption leaves the lift held',{lift:X,issues:g1.issues});}
   }
  }else if(action==='check'){
   const c=lastWith(L);if(!c)continue;
   const ev=checkOf(gen(),L,c.built);
   // Round 12 I8 (spec R9.1 :127): only an FC16 capture at the current hi can be the checked
   // completion of an earn offer; legacy and absent captures never earn, adoption is free.
   const hiNow=m.base[L].hi===undefined?10:m.base[L].hi;
   if(ev.status==='offer'&&ev.offers.some(o=>decisionOf(o).kind==='earn')&&(c.mode!=='fc16'||!c.hiAt||c.hiAt[L]!==hiNow))
    fail('I8 an earn offer on a completion whose window is unproven',{lift:L,mode:c.mode,hiAt:c.hiAt,hiNow});
   if(ev.status==='refused'&&c.mode!=='fc16')m.trace.push('legacy-check:'+c.mode+':'+ev.refusal.code);
   // Round 16 I13 (spec :154 SPEND ONCE; Astra L8 B29): a sighting a recorded yes consumed,
   // live or undone, is never consumed again, and a one-root earn is either the EARLY
   // proposal or carries a noise margin over the prior line (below).
   if(ev.status==='offer'){
    const spentRoots=new Set(f.spent.filter(x=>liftOfSpend(x.spend_id)===L).flatMap(x=>{try{const d=JSON.parse(x.spend_id);return d[0]==='native-load'?d[4]:[];}catch{return [];}}));
    for(const o of ev.offers){const d=decisionOf(o);if(d.kind!=='earn')continue;
     const roots=d.consumes.map(r=>typeof r==='string'?r:JSON.stringify(r));
     if(roots.some(r=>spentRoots.has(r)))fail('I13 an earn offer consumes a spent sighting',{lift:L,consumes:roots,spent:[...spentRoots]});
     // A one-root earn that is not the EARLY proposal (earn.cjs:64) can only be the noise
     // margin (earn.cjs:75-76, "banks on one sighting"): the consumed line must be strictly
     // more reps than the immediately prior line of the lift. A lone unspent top level with
     // a spent top (the M14 spend-suffix defect) has no margin and must stay PROVISIONAL.
     if(roots.length<2&&!/one sighting/i.test(JSON.stringify(d.candidate))){
      const repsOf=en=>en.reps.map((r,k)=>en.corrected&&typeof en.corrected[k+1]==='number'?en.corrected[k+1]:r).reduce((a,b)=>a+b,0);
      const rows=m.comps.map(c=>({c,en:c.spec.entries.find(en=>en.lift===L)})).filter(x=>x.en);
      const i=rows.findIndex(x=>JSON.stringify([x.c.built.start,L,x.c.built.close])===roots[0]);
      if(i<1||!(repsOf(rows[i].en)>repsOf(rows[i-1].en)))fail('I13 a one-root earn offer without a noise margin',{lift:L,consumes:roots,candidate:d.candidate,reason:o.reason,lines:rows.map(x=>[x.c.spec.n,x.en.loads,x.en.reps]),spent:[...spentRoots]});
      m.trace.push('i13-one-root');}
     m.trace.push(spentRoots.size?'i13-after-spend':'i13');}
   }
   if(ev.status==='offer'){
    const offer=pick(ev.offers),d=decisionOf(offer),held0=EFFECTS.m.issuanceFor(offer,{revision:'fx-revision-1',source:JSON.stringify(SOURCE),moment:'2026-10-02T12:00:00.000Z'});
    // Round 13 (spec R9.2 :156 c2, :158): an offer on a held lift is an exit, issued on the
    // held projection (w/wSets null), so only an edit that projection shows can stale it
    // (walk seeds 20262292, 20269566, 20271259); its cancellation restores the baseline ask.
    const heldAt=held(f,L);
    m.lastOffer[L]={held:held0,base:heldAt?effShown(L):effOf(L),shown:effShown(L),n:m.comps.length,heldAt};
    if(chance(0.7)){
     // Round 16: an exit response (held lift) names the plan ops its device folded, as a
     // held-lift Start does (Round 13 startParents; seed 1001107: a duplicate synced from a
     // second device was otherwise unordered against an exit whose only anchor Start precedes
     // it; under R9.9 a missed debut makes no exit, and the convention stays for every exit).
     const op_id='fx-p-'+(++m.k),parents=heldAt?m.extras.map(x=>x.op_id):null;m.extras.push({...acceptOp(offer,{op_id,after:m.comps.length}),...(parents?{parents}:{})});
     // Round 18 (spec R9.9 :155): a yes claiming a missed debut Close (claimed), and an unclaimed
     // adoption checked on the card of an old missed target (A1, l11), are tracked for I14.
     const claimRefs=(d.basis.load_basis.authority_refs||[]).length,seenL=c.seen&&c.seen[L];
     const a1=d.kind==='adopt-observed'&&!claimRefs&&Array.isArray(seenL)&&seenL.length>0&&m.missed.some(z=>z.lift===L&&seenL.every(v=>v===z.T));
     m.ledger.push({lift:L,spend:d.spend_id,kind:d.kind,target:d.target_load.vector.map(v=>v?v.value:null),targetW:d.target_load.scalar?d.target_load.scalar.value:null,op:op_id,
      newWSets:d.candidate?d.candidate.newWSets:null,...(heldAt?{exit:true}:{}),...(d.kind==='adopt-observed'&&claimRefs?{claimed:true}:{}),...(a1?{a1:true}:{})});
     m.trace.push('yes:'+d.kind+':'+(d.target_load.scalar&&d.target_load.scalar.value));if(a1)m.trace.push('a1-unclaimed-yes');
    }
   }else m.trace.push('refused:'+ev.refusal.code);
  }else if(action==='undo'){
   const c=lastWith(L);if(!c)continue;
   const liveSp=f.spent.filter(x=>!x.cancelled_by&&liftOfSpend(x.spend_id)===L&&!x.spend_id.startsWith('["native-load-compensation"'));
   if(!liveSp.length)continue;
   const target=pick(liveSp).spend_id,ev=checkOf(gen(),L,c.built,{compensate:target});
   if(ev.status==='offer')acceptUndo(L,target,f,ev);
  }else if(action==='base'||action==='plan'||action==='vector'||action==='fork'||action==='sets'){
   const B=m.base[L];
   if(action==='fork'){if(B.forks.length>=2)continue;touch(L);B.forks.push({from:pick([dayAt(m.comps.length),dayAt(Math.max(0,m.comps.length-1)),dayAt(m.comps.length+1)]),kind:'reset',why:'SYNTHETIC'});m.trace.push(['fork',L,B.forks.at(-1).from]);}
   else if(action==='vector'){if(B.w===null||setsOf(L)!==3)continue;B.wSets=B.wSets?null:[B.w,B.w,B.w-5];m.trace.push(['vector',L,B.wSets]);}
   else if(action==='sets'){
    // Round 18 set-count class (spec R9.9 :152 LAYOUT, DECISIONS:801 (1)), widened in round 19 (below): an authenticated
    // set-count edit (it writes sets alone) between the yes and the Start of a SCALAR debut: the
    // debut card is newW on the new count and its Close consumes the entry (I14). A vector plan
    // keeps its count (its fitted cards, spec R9.10 L FIT, are pinned by the FIT rows and N29-VECTOR-LAYOUT-R9.10).
    // Round 19 (spec R9.10 L RESTORE COUNT, D-R18-SETS-RESTORE, DECISIONS:804): the class is widened again to straddle an
    // adoption and its Undo: an unheld scalar lift's count is set to 2, 3 or 4 (up, down, back, or unchanged) at any
    // step: before a yes, between a yes and its Undo, and back. A RESTORE is issued over the slots its adoption
    // consumed, so its yes restores the prior image whatever the count now is (I1, I2; walk seed 20266884).
    if(!B.wSets&&!held(f,L))B.sets=pick([2,3,4]);
    else continue;
    m.trace.push(['sets',L,setsOf(L)]);
   }
   else{B.w=pick(origW===null?[null,45,50]:[100,102.5,97.5,105]);B.wSets=B.wSets&&B.w!==null?[B.w,B.w,B.w-5]:null;m.trace.push([action,L,B.w]);}
   const lo=m.lastOffer[L];
   // Round 13 (spec R9.2 :156 c2): an exit adoption was issued on the held projection, so
   // its base is w/wSets null whatever the plan's w: a w-only edit under a live exit (or an
   // effect rooted in one, or its cancellation, which restores that null base) changes
   // nothing the lift's offers read (seeds 20262292, 5012075).
   const exitRooted=(()=>{const ex=exIn(fold().state,L),a=ex&&ex.native_load_authority;if(!a)return false;
    const byS=sp=>m.ledger.find(y=>y.lift===L&&y.spend===sp);let sp=a.kind==='compensated'?a.compensates:a.spend_id;
    for(let k=0;k<8&&sp;k++){const y=byS(sp);if(y&&y.exit)return true;try{const d=JSON.parse(sp);sp=typeof d[2]==='string'?d[2]:null;}catch{sp=null;}}return false;})();
   // Round 16 (spec R9.4 :156, Astra L8 B28; seed 5016917): a RESTORE compensation writes its
   // own recorded target whatever the base on replay, so a later w-only edit under it changes
   // nothing the lift's offers read (the I1 oracle wants that same restored weight).
   const restoreRooted=(()=>{const ex=exIn(fold().state,L),a=ex&&ex.native_load_authority;if(!a||a.kind!=='compensated')return false;
    const y=m.ledger.find(z=>z.lift===L&&z.spend===a.spend_id&&z.kind==='compensate');return !!(y&&y.restore);})();
   if(lo&&lo.base!==(lo.heldAt?effShown(L):effOf(L))&&!((exitRooted||restoreRooted)&&lo.shown===effShown(L))&&lo.n===m.comps.length){
    const c=lastWith(L),ev=checkOf(gen(),L,c.built);
    if(ev.status==='offer'&&ev.offers.some(o=>EFFECTS.m.sameIssued(o,lo.held)))fail('I5 stale offer still fresh after a plan edit',{lift:L});
   }
  }else if(action==='dup'){
   if(!m.extras.length)continue;
   // Round 13: the second device holds a copy only after syncing the log that carried it, so
   // its copy names the plan ops it synced as causal parents (seed 1003348: an unordered copy
   // of a forged record made an earlier valid yes unprovably behind it in one layout only).
   const src=pick(m.extras);m.extras.push({...src,op_id:'fx-p-'+(++m.k),after:m.comps.length,device:'fx-device-B',parents:m.extras.map(x=>x.op_id)});m.trace.push('dup');
  }else if(action==='undo2'){
   if(!m.proven.length)continue;
   const p=pick(m.proven),idx=m.extras.findIndex(x=>x.payload.issuance.body.compensates===p.target),PL=liftOfSpend(p.target),c=lastWith(PL);
   const save=m.extras;m.extras=m.extras.slice(0,idx);const ev=checkOf(gen(),PL,c.built,{compensate:p.target});m.extras=save;
   if(ev.status==='offer'){const op_id='fx-p-'+(++m.k);m.extras.push({...acceptOp(ev.offers[0],{op_id,after:m.comps.length}),device:'fx-device-B'});m.trace.push('undo2-yes');}
  }else if(action==='rename'){m.base[L].n=pick(R9_WALK_CARD_NAMES);m.trace.push(['rename',L,m.base[L].n]);}
  else if(action==='window'||action==='cache'){
   // Round 9: a later rep-window edit or cached-line change; never revokes a recorded yes
   // (DECISIONS:793); a new check on work captured above the new window is PLAN_CHANGED.
   const B=m.base[L];
   if(action==='window'){B.hi=pick([9,10,11,12]);m.trace.push(['window',L,B.hi]);}
   else{B.last=pick([null,[9,8,7],[10,10,10],[12,11,10]]);m.trace.push(['cache',L,B.last]);}
   // Round 11 I8 (spec R9 :127 WINDOW BINDING): the latest completion's capture binds the
   // window it was priced under: FC16 window_hi must equal the current hi; a legacy capture
   // moved when a target exceeds the current hi, or the performed top exceeds the largest
   // target while the current hi is also above it. A moved window never offers.
   {const c=lastWith(L),f1=fold();
    // Round 12 (spec R9.1 :127): the window binds the earn branch only; a legacy or absent
    // capture never proves its window, so it never earns, whatever the hi.
    if(action==='window'&&c&&c.hiAt&&c.hiAt[L]!==undefined&&f1.status==='ready'&&!held(f1,L)){
     const hi=B.hi,t=c.hiAt[L],moved=c.mode!=='fc16'||hi!==t;
     if(moved){const ev=checkOf(gen(),L,c.built);
      if(ev.status==='offer'&&ev.offers.some(o=>decisionOf(o).kind==='earn'))fail('I8 an earn offer priced under a moved or unproven window',{lift:L,hi,t,mode:c.mode});
      m.trace.push('window-moved:'+c.mode+':'+(ev.status==='offer'?'offer-'+decisionOf(ev.offers[0]).kind:ev.refusal.code));}
    }}
   const lo=m.lastOffer[L];
   // Round 18 (walk seed 5009774): an offer on a held lift was issued on the held projection, so
   // its base is compared with that projection (effShown), as the plan-edit branch has done since
   // round 13; comparing it with the unprojected plan called every exit stale after an edit that
   // changed nothing (a cache set to null where none was cached).
   if(lo&&lo.base!==(lo.heldAt?effShown(L):effOf(L))&&lo.n===m.comps.length){
    const c=lastWith(L),ev=checkOf(gen(),L,c.built);
    if(ev.status==='offer'&&ev.offers.some(o=>EFFECTS.m.sameIssued(o,lo.held)))fail('I5 stale offer still fresh after a window or cache edit',{lift:L});
   }
  }
  else if(action==='forge'){
   // Round 11 I7 (spec R9 THREAT MODEL, :155 S1-S8, :156 DERIVABLE): a caller re-digests
   // its own body from a genuine offer, in one S1-S8 or DERIVABLE variant, and records it.
   // It is never consent: the fold refuses it RECORD_INVALID naming its response Ref, and it
   // never enters the ledger, so the I1 oracle also fails any weight it would move.
   const c=lastWith(L);if(!c||held(f,L))continue;
   const ev=checkOf(gen(),L,c.built);if(ev.status!=='offer'){m.trace.push('forge-no-offer');continue;}
   const o=structuredClone(pick(ev.offers)),b=decisionOf(o),Z='sha256:'+'0'.repeat(64);
   const up=()=>{if(b.target_load.scalar)b.target_load.scalar.value+=20;for(const v of b.target_load.vector)if(v)v.value+=20;
    if(b.candidate){if(typeof b.candidate.newW==='number')b.candidate.newW+=20;if(Array.isArray(b.candidate.newWSets))b.candidate.newWSets=b.candidate.newWSets.map(x=>x+20);}};
   const other=L===LIFT?ROW:LIFT,d0=(()=>{try{return JSON.parse(b.spend_id);}catch{return null;}})();
   const variants={
    'body':()=>up(),
    'programme':()=>{up();b.basis.plan.programme_sha256=Z;},
    'queue':()=>{up();b.basis.plan.structural_queue_sha256=Z;},
    'coverage':()=>{up();b.basis.coverage=b.basis.coverage.slice(1);},
    'lift':()=>{up();b.lift_lineage_id=other;b.basis.plan.programme_sha256=Z;},
    'spend':()=>{up();b.spend_id='anything';b.basis.plan.programme_sha256=Z;},
    'consumes':()=>{up();const bogus=typeof b.consumes[0]==='string'?JSON.stringify(['fx-start-absent',L,'fx-close-absent']):['fx-start-absent',L,'fx-close-absent'];
     b.consumes=[bogus,...b.consumes.slice(1)];if(d0){d0[4]=b.consumes;b.spend_id=JSON.stringify(d0);}b.basis.plan.programme_sha256=Z;},
    'evidence-empty':()=>{up();b.evidence=[];b.basis.plan.programme_sha256=Z;},
    'evidence-value':()=>{up();const s=b.evidence[0]&&b.evidence[0].sets.find(x=>x&&x.current&&x.current.reps);if(s)s.current.reps={...s.current.reps,value:s.current.reps.value+3};b.basis.plan.programme_sha256=Z;},
    'source':()=>{up();b.basis.source={W:999,log_digest:'wrong',selection_id:'wrong'};b.basis.plan.programme_sha256=Z;},
    'order':()=>{up();b.basis.order.start_ids=['absent-start'];b.basis.order.frontier=1;b.basis.plan.programme_sha256=Z;},
    'base':()=>{up();if(b.base_load.scalar&&typeof b.base_load.scalar.value==='number')b.base_load.scalar.value+=5;for(const v of b.base_load.vector)if(v&&typeof v.value==='number')v.value+=5;b.basis.plan.programme_sha256=Z;},
    'derivable':()=>{up();b.basis.plan.programme_sha256=Z;},
   };
   const variant=pick(Object.keys(variants));variants[variant]();
   const op_id='fx-p-'+(++m.k);m.extras.push(acceptOp(o,{op_id,after:m.comps.length}));
   const g=fold(),bad=g.issues.find(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&(i.refs||[]).some(r=>r&&r.op_id===op_id));
   // Round 12 (spec R9.1 :158): a record behind a hold is still examined, so the forgery is
   // named itself: RECORD_INVALID, or EFFECT_CONFLICT when it overlaps accepted work; never
   // unexamined (round 11's 'waits' exemption, seed 20267386, is gone).
   const waits=!bad&&g.issues.some(i=>i.code==='NATIVE_LOAD_EFFECT_CONFLICT'&&(i.refs||[]).some(r=>r&&r.op_id===op_id))&&!g.spent.some(x=>x.spend_id===b.spend_id);
   if(g.status==='ready'&&!bad&&!waits)fail('I7 a forged record ('+variant+') is not refused RECORD_INVALID',{issues:g.issues});
   m.trace.push('forge:'+variant+':'+(bad?bad.field:waits?'conflict':g.status));
  }
  else if(action==='capture'){
   if(held(f,LIFT)||m.starts.length)continue;
   const card=realCard(f,LIFT,dayAt(m.comps.length),'capture');if(card[0]===null)continue;
   const built=sess2(900,{entries:[{lift:LIFT,reps:fit(TOP,card.length),loads:card,prescribed:card,effort:fit(e(2,1,1),card.length)}]}),lastExtra=m.extras.filter(x=>x.after===m.comps.length).at(-1);
   m.starts.push({built,card,hi:m.base[LIFT].hi===undefined?10:m.base[LIFT].hi,anchor:lastExtra?lastExtra.op_id:m.comps.at(-1).built.close,nAt:m.comps.length,capExtras:m.extras.map(x=>x.op_id)});m.trace.push(['capture',card]);
  }else if(action==='finish'){
   // The Close of the Start that captured the card: the session keeps its Start where it
   // was captured, before any yes recorded after the capture.
   const s=m.starts[0];if(!s||s.nAt!==m.comps.length)continue;
   const n=m.comps.length+1,spec={n,entries:[{lift:LIFT,reps:fit(pick([TOP,TOP,[10,9,7]]),s.card.length),loads:s.card.slice(),prescribed:s.card.slice(),effort:fit(e(2,1,1),s.card.length),v1:false}]};
   m.comps.push({spec,built:sess2(n,spec),cap:{[LIFT]:s.card.slice()},hiAt:{[LIFT]:s.hi},mode:'fc16',seen:{[LIFT]:s.card.slice()},capExtras:s.capExtras,anchor:s.anchor});m.starts=[];m.trace.push(['finish',s.card]);
  }else if(action==='correct'){
   // Round 18 (spec R9.9 :152 "Land versus miss is a projection of the current facts", J (h);
   // l11 A2): sometimes a missed debut Close's loads are corrected to its card, so it now lands;
   // any claimed yes on it stays verifiable (never RECORD_INVALID, checked every step) and the
   // entry is never re-queued (I1 and I14 hold at every fold).
   const mz=m.missed.filter(z=>{const c0=m.comps[z.n-1],en0=c0&&c0.spec.entries.find(x=>x.lift===z.lift);return !!en0&&!en0.corrected;});
   if(mz.length&&chance(0.7)){
    const z=pick(mz),c0=m.comps[z.n-1],en0=c0.spec.entries.find(x=>x.lift===z.lift),fix={};
    z.card.forEach((v,i)=>{if(en0.loads[i]!==v)fix[i+1]={load:v};});
    if(!Object.keys(fix).length)continue;
    en0.corrected=fix;touch(en0.lift);c0.built=sess2(c0.spec.n,c0.spec);m.trace.push(['correct-load',z.n,z.lift]);
    const q=fold().state.queue.find(x=>x&&x.exId===z.lift&&x.native_load_spend&&x.state==='ESTABLISH');if(q)m.trace.push('missed-corrected-landed');
    continue;
   }
   // Mostly a completion some recorded yes consumed (the BASIS_REPAIR_REQUIRED path, :157).
   const consumed=new Set(f.spent.flatMap(x=>{try{const d=JSON.parse(x.spend_id);return d[0]==='native-load'?d[4]:[];}catch{return [];}}));
   const hits=m.comps.flatMap(c=>c.spec.entries.filter(en=>consumed.has(JSON.stringify([c.built.start,en.lift,c.built.close]))).map(en=>[c,en]));
   const [c,en]=hits.length&&chance(0.8)?pick(hits):(()=>{const c0=pick(m.comps);return [c0,pick(c0.spec.entries)];})(),pos=1+Math.floor(rnd()*en.reps.length);
   if(en.corrected||en.reps[pos-1]<2)continue;
   en.corrected={[pos]:en.reps[pos-1]-1};touch(en.lift);c.built=sess2(c.spec.n,c.spec);m.trace.push(['correct',c.spec.n,en.lift,pos]);
   const root=JSON.stringify([c.built.start,en.lift,c.built.close]);
   if(f.spent.some(x=>{try{const d=JSON.parse(x.spend_id);return d[0]==='native-load'&&d[4].includes(root);}catch{return false;}})){
    m.trace.push('correct-consumed');if(fold().issues.some(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED'))m.trace.push('correct-consumed-repair');
    // Round 14: half the time the athlete undoes the disputed adoption at once (I11).
    const g0=fold(),ex0=g0.state&&exIn(g0.state,en.lift),a0=ex0&&ex0.native_load_authority,cl=lastWith(en.lift);
    if(chance(0.5)&&cl&&a0&&a0.kind==='adopted'&&held(g0,en.lift)){
     const ev=checkOf(gen(),en.lift,cl.built,{compensate:a0.spend_id});
     m.trace.push(ev.status==='offer'?'dispute-undo-offer':'dispute-undo:'+ev.refusal.code);
     if(ev.status==='offer')acceptUndo(en.lift,a0.spend_id,g0,ev);
    }
   }
  }else if(action==='legacy'){
   // Round 15 (spec R9.4 :159, D-R9-LEGACY-ENTRY): legacy entries go mostly onto a HELD lift,
   // as a lone PROPOSED or a DEBUT that today.cjs would pick if it were visible.
   // Round 20 part C (PM ruling on STOP-R20B1-1/-2, option (b); the Fable advisor's invariants): the generator draws only the
   // legacy entries a writer can queue. NEEDS-LOAD: no writer queues a legacy debut on a lift whose w is null (E/writers.cjs:383
   // calls earnWalk only over a numeric w; E/progression.cjs:365 nextLoad of a null w is null, so earn.cjs pushes nothing;
   // FC01:549 is reached only by an earn, refused RECORD_INVALID base_load at :501 over a null w; row R20-LEGACY-NEEDS-LOAD), so
   // a draw on a w-null lift is PROPOSED only (E/today.cjs:55 never picks a PROPOSED entry). VECTOR-SHIFT: a debut queued on a
   // vector lift carries the shifted vector (E/earn.cjs:63, :88; FC01:516-517 refuses a scalar candidate over a vector; row
   // R20-LEGACY-VECTOR-SHIFT), so an entry drawn on a lift with B.wSets carries newWSets = wSets.map(x=>x+(newW-w)). The state
   // draw is kept (then overridden), so every seed keeps its action sequence. A null w reached LATER through a native RESTORE
   // is not excluded: that is D-R20-RESTORE-OVER-LEGACY (row R20-RESTORE-OVER-LEGACY), a carried debt.
   const hl=lifts.filter(x=>held(f,x)),LL=hl.length&&chance(0.7)?pick(hl):L;
   if(m.legacy[LL])delete m.legacy[LL];
   else{const B=m.base[LL],drawn=pick(['PROPOSED','DEBUT']),newW=B.w===null?60:B.w+5;
    m.legacy[LL]={exId:LL,kind:'debut',done:false,state:B.w===null?'PROPOSED':drawn,newW,...(Array.isArray(B.wSets)&&typeof B.w==='number'?{newWSets:B.wSets.map(x=>x+(newW-B.w))}:{}),t:'SYNTHETIC legacy'};}
   m.trace.push(['legacy',LL,m.legacy[LL]?m.legacy[LL].state:false,held(f,LL)?'held':'free']);
  }
  checkInvariants('step '+step);
 }
 // Round 20 part B2 WALK CLASSES (spec R9.11 M WALK (b) exit-undo-return and (c) two-exit, D-R9.11-TWO-EXIT, report only; spec
 // R9.12 WALK (b') exit-on-numeric-capture). A class runs after the walk's own steps and draws only from a SEPARATE generator, so
 // every seed keeps its earlier action sequence (seeds 11301954 and 12035226 included). Every class step checks I1-I17 as the walk
 // does (I15 at each Start, I17 at each check) and R1 = R2 (I3) on the whole log; the end checks below then run as for any walk.
 {const rnd2=mulberry32((seed^0x2f1a5c3b)>>>0),pick2=xs=>xs[Math.floor(rnd2()*xs.length)],chance2=p=>rnd2()<p;
  const same12=stage=>{const a=norm(fold()),b=norm(fold({rev:'fx-revision-2'}));if(JSON.stringify(a)!==JSON.stringify(b))fail('I3 R1 differs from R2 at '+stage,{r1:a,r2:b});};
  // One completion of lift X alone; its Start takes the real card (I15, CARD-PARITY); how(card) gives the loads lifted.
  const trainOne=(X,how,stage)=>{const f0=fold(),n=m.comps.length+1,card=realCard(f0,X,dayAt(n-1),stage),k=card.length,v1=chance2(0.5);
   const spec={n,entries:[{lift:X,reps:fit(TOP,k),loads:how(card),prescribed:card,effort:fit(e(2,1,1),k),v1}]},startParents=held(f0,X)?m.extras.map(x=>x.op_id):[];
   m.comps.push({spec,built:sess2(n,spec),cap:{[X]:card},hiAt:{[X]:m.base[X].hi===undefined?10:m.base[X].hi},mode:'fc16',seen:{[X]:card},capExtras:m.extras.map(x=>x.op_id),...(startParents.length?{startParents}:{})});
   m.trace.push([n,X===LIFT?'P':'R',card[0],spec.entries[0].loads[0],v1?'v1':'v2','fc16',stage]);checkInvariants('class '+stage);return m.comps.at(-1);};
  // A recorded yes (an exit response names the plan ops its device folded, as the walk's check action does).
  const yes=(o,X,{exit=false,device=null,parents=null}={})=>{const d=decisionOf(o),op_id='fx-p-'+(++m.k),ps=parents||(exit?m.extras.map(x=>x.op_id):null);
   m.extras.push({...acceptOp(o,{op_id,after:m.comps.length}),...(ps?{parents:ps}:{}),...(device?{device}:{})});
   m.ledger.push({lift:X,spend:d.spend_id,kind:d.kind,target:d.target_load.vector.map(v=>v?v.value:null),targetW:d.target_load.scalar?d.target_load.scalar.value:null,op:op_id,newWSets:d.candidate?d.candidate.newWSets:null,...(exit?{exit:true}:{})});
   m.trace.push('class-yes:'+d.kind);return {d,op_id};};
  const kinds=ev=>ev.status==='offer'?ev.offers.map(x=>decisionOf(x).kind).join(','):ev.refusal.code;
  const offerOf=(ev,kind)=>ev.status==='offer'?ev.offers.find(x=>decisionOf(x).kind===kind)||null:null;
  // The hold, then the exit(s), then in random order the optional Undo and the optional return of the base, then training.
  const exitAndAfter=(X,orig,cExit,name)=>{
   const two=name==='c',vt=cExit.spec.entries[0].v1?'v1':'v2',ev=checkOf(gen(),X,cExit.built),o=offerOf(ev,'adopt-baseline');if(!o)return 'no-exit:'+vt+'-'+kinds(ev);
   // (c): the second completion is trained on the same held card before either exit is answered, and offered its own exit.
   let oB=null;if(two){const one=pick2([60,65]),cB=trainOne(X,card=>card.map(v=>v===null?one:v),name+'-second'),evB=checkOf(gen(),X,cB.built);
    oB=offerOf(evB,'adopt-baseline');if(!oB)return 'no-second-exit:'+(cB.spec.entries[0].v1?'v1':'v2')+'-'+kinds(evB);}
   const before=m.extras.map(x=>x.op_id),y2=yes(o,X,{exit:true});checkInvariants('class '+name+' exit');same12('class '+name+' exit');m.trace.push('class-exit-yes');
   if(two){const y2b=yes(oB,X,{exit:true,device:'fx-device-B',parents:before});const g=checkInvariants('class c second exit');same12('class c second exit');
    const mine=g.issues.filter(i=>(i.refs||[]).some(r=>r&&r.op_id===y2b.op_id)).map(i=>i.code.replace('NATIVE_LOAD_','')+':'+i.field);
    m.trace.push('class-c-second:'+(mine.join('+')||(g.spent.some(x=>x.spend_id===y2b.d.spend_id)?'kept':'absent')));}
   const steps=[];if(chance2(0.7))steps.push('undo');if(chance2(0.7))steps.push('return');if(steps.length===2&&chance2(0.5))steps.reverse();
   for(const st of steps){
    if(st==='return'){m.base[X].w=orig;m.trace.push(['class-return',X,orig]);}
    else{const g0=fold(),ev2=checkOf(gen(),X,cExit.built,{compensate:y2.d.spend_id});if(ev2.status==='offer')acceptUndo(X,y2.d.spend_id,g0,ev2);else m.trace.push('class-undo:'+ev2.refusal.code);}
    checkInvariants('class '+name+' '+st);same12('class '+name+' '+st);}
   for(let i=0,k=1+Math.floor(rnd2()*2);i<k;i++){const one=pick2([60,65]),c=trainOne(X,card=>card.map(v=>v===null?one:v),name+'-after'),g1=fold();
    const ev3=checkOf(gen(),X,c.built);if(ev3.status==='offer'&&chance2(0.6)){yes(pick2(ev3.offers),X,{exit:held(g1,X)});checkInvariants('class '+name+' after yes');}
    same12('class '+name+' after');}
   return 'done:'+vt+'-'+(steps.join('+')||'none');};
  const moveBase=X=>{const orig=m.base[X].w;m.base[X].w=orig===null?pick2([45,50]):pick2([orig+2.5,orig-2.5]);m.trace.push(['class-base',X,m.base[X].w]);return orig;};
  // (b') exit-on-numeric-capture: an adoption makes w numeric; a Start captures that numeric card; an unordered base
  // re-admission ordered after that Start holds the yes; the check on that completion offers the exit and it is accepted.
  const classBprime=X=>{
   const c1=trainOne(X,card=>card.map(v=>v===null?60:v+5),'bp-adopt'),ev=checkOf(gen(),X,c1.built),o=offerOf(ev,'adopt-observed')||offerOf(ev,'adopt-baseline');
   if(!o)return 'no-adoption:'+kinds(ev);
   yes(o,X,{exit:held(fold(),X)});checkInvariants('class bp y1');
   const c2=trainOne(X,card=>card.slice(),'bp-capture');if(c2.seen[X][0]===null)return 'card-not-numeric';
   const orig=moveBase(X);if(!held(checkInvariants('class bp moved base'),X))return 'not-held';
   return exitAndAfter(X,orig,c2,'bp');};
  // (b) exit-undo-return: an earn accept; an unordered base re-admission; a baseline-ask completion proven after the hold; its exit.
  const classB=(X,name)=>{
   let o=null;
   for(let i=0;i<3&&!o;i++){const c=trainOne(X,card=>card.map(v=>v===null?60:v),name+'-top'),ev=checkOf(gen(),X,c.built);o=offerOf(ev,'earn');
    if(!o){const a=offerOf(ev,'adopt-baseline')||offerOf(ev,'adopt-observed');if(a){yes(a,X,{exit:held(fold(),X)});checkInvariants('class '+name+' adopt');}}}
   if(!o)return 'no-earn';
   yes(o,X);checkInvariants('class '+name+' earn yes');
   const orig=moveBase(X);if(!held(checkInvariants('class '+name+' moved base'),X))return 'not-held';
   const one=pick2([60,65]),c3=trainOne(X,card=>card.map(()=>one),name+'-ask');if(c3.seen[X][0]!==null)return 'not-ask';
   return exitAndAfter(X,orig,c3,name);};
  const f0=fold();
  if(f0.status==='ready'&&f0.state&&!m.starts.length&&chance2(0.5)){
   const X=pick2(lifts),name=pick2(['b','bp','c']);
   const out=held(f0,X)||m.legacy[X]||m.base[X].wSets||m.base[X].forks.length?'skip':name==='bp'?classBprime(X):classB(X,name);
   m.trace.push('class-'+name+':'+String(out).split(':')[0]);m.trace.push('class-'+name+'-detail:'+String(out).replace(/:/g,'-'));
  }
 }
 const f=checkInvariants('end'),ref0=norm(f);
 // Round 9 (DECISIONS:793): the round-8 'stop-P4' exemption is gone; every revision or
 // delivery difference is a counterexample.
 const differ=(what,o,a,b,extra)=>{if(JSON.stringify(a)===JSON.stringify(b))return;fail(what+' '+JSON.stringify(o),{ref:a,got:b,...extra});};
 for(const o of [{rev:'fx-revision-2'},{twoDevice:true},{twoDevice:true,rev:'fx-revision-2'}]){const g=fold(o);
  differ('I3 differs under',o,ref0,norm(g),{refIssues:f.issues,gotIssues:g.issues,ledger:m.ledger,comps:m.comps.map(c=>({spec:c.spec,cap:c.cap,anchor:c.anchor||null})),base:m.base,legacy:m.legacy});}
 const u0=norm(fold({unproven:'same'}));
 for(const o of [{unproven:'late'},{unproven:'early'},{unproven:'same',rev:'fx-revision-2'},{unproven:'late',rev:'fx-revision-2'}])
  differ('I6 unprovable order differs under',o,u0,norm(fold(o)),{});
 const r=norm(fold({base:{n:'Property Rename'}}));
 if(JSON.stringify(r)!==JSON.stringify(ref0))fail('I4 rename changes the outcome',{ref:ref0,got:r});
 // Round 12 I9 (spec R9.1 :157 ADMISSION GATE): the same log delivered inside an imported
 // generation folds no native record at all.
 {const a=gen();
  if(Object.values(a.generation.collections.ops).some(op=>op.class==='plan'&&op.kind==='proposal-response')){
   a.generation.collections.sourceImports={'fx-import-1':{profile:'earned/source-import/v1'}};
   const gf=EFFECTS.m.foldNativeLoad(a);
   if(gf.status!=='refused'||gf.effects.length||gf.spent.length||!gf.issues.some(i=>i.code==='NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN'))fail('I9 an imported native record is admitted',{status:gf.status,issues:gf.issues});
   m.trace.push('gate-refused');
  }}
 const tally={};for(const t of m.trace){const k=typeof t==='string'?t.split(':').slice(0,/^(forge|window-moved|legacy-check):/.test(t)?3:2).join(':'):Array.isArray(t)&&typeof t[0]==='string'?t[0]:null;if(k)tally[k]=(tally[k]||0)+1;}
 for(const e2 of f.effects)tally['effect:'+e2.kind]=(tally['effect:'+e2.kind]||0)+1;
 for(const i of f.issues)tally['issue:'+i.code]=(tally['issue:'+i.code]||0)+1;
 for(const i of fold({unproven:'same'}).issues)tally['unproven-issue:'+i.code]=(tally['unproven-issue:'+i.code]||0)+1;
 if(baseline)tally.baseline=1;if(rowOn)tally.rowOn=1;if(m.refusedFold)tally.refusedFold=m.refusedFold;if(m.stopP4)tally['stop-P4']=1;
 tally['twoDevice:moved']=m.dev2.moved;tally['twoDevice:kept']=m.dev2.kept; // Round 21c: plan ops deliveryTransform moved / kept
 for(const L of lifts)if(f.state&&exIn(f.state,L).native_load_authority)tally['authority:'+exIn(f.state,L).native_load_authority.kind]=(tally['authority:'+exIn(f.state,L).native_load_authority.kind]||0)+1;
 Object.defineProperty(tally,'detail',{value:{trace:m.trace,issues:f.issues,spent:f.spent},enumerable:false});
 return tally;
}
test('R8-PROPERTY MODEL WITH ORACLE (Claude l6 D-B6-1; invariants I1 oracle, I2-I6 above; seeded, deterministic)',()=>{
 effectsGate();
 const runs=Number(process.env.NATIVE_LOAD_PROPERTY8_RUNS||100),seed0=Number(process.env.NATIVE_LOAD_PROPERTY8_SEED||20261001);
 const found=[],coverage={};
 for(let i=0;i<runs;i++){
  try{const t=propertySequence8(seed0+i);for(const [k,v] of Object.entries(t)){coverage[k]=(coverage[k]||0)+v;if(k.startsWith('issue:')||k.startsWith('authority:')||k==='stop-P4'){const s='seeds '+k;coverage[s]=coverage[s]||[];if(coverage[s].length<(k==='stop-P4'?50:5))coverage[s].push(seed0+i);}}}
  catch(err){if(err&&err.code==='PROPERTY_COUNTEREXAMPLE'){found.push(err.message);if(!process.env.NATIVE_LOAD_PROPERTY8_ALL)break;}else throw new Error('seed='+(seed0+i)+' '+(err&&err.stack||err));}
 }
 if(process.env.NATIVE_LOAD_PROPERTY8_REPORT)require('node:fs').writeFileSync(process.env.NATIVE_LOAD_PROPERTY8_REPORT,JSON.stringify({runs,seed0,found,coverage},null,1));
 assert.deepEqual(found,[],'counterexamples');
});

// ======================================================================
// ROUND 19: spec R9.10 (origin/rebuild/c-native-load-spec d3a3ffa, rebuild/coach/NATIVE-LOAD-SPEC.md sha256
// 6bd14f81..., section L; DECISIONS:803 (e) FIT, :804 (f) READER, :804 D-R18-SETS-RESTORE and
// D-R9.9-LATER-HOLD-UNDO). FIT: W/engine-capture.cjs:79-80 fit a per-set-weight lift's stored vector (the
// selected debut entry's newWSets, else the plan's wSets) to the card's slot count after validating the WHOLE
// stored vector: fewer sets capture the first n, extra sets repeat the last listed weight; nothing stored
// changes. SELECTED ENTRY (FC01 entryTarget, FC03 selectedEntry/entryTargetOf) reads a vector entry through the
// same fit; a vector debut lands only at its accepted layout; the FIT GUARD refuses
// SET_COUNT_BASIS_UNPROVEN [Close Ref], field null, when the projected lift's stored vector length differs from
// the captured original slots. READER: an added position reads the last listed weight (E/progression.cjs:80-82
// and its mirrors FC01 planVector, FC03 projectBase and planNow). RESTORE COUNT and LATER HOLD UNDO as L states.
// ======================================================================
const fitOracle=(v,n)=>Array.from({length:n},(_,i)=>v[Math.min(i,v.length-1)]);
// Spec R9.10 L READER, and the dfc4445 E/progression.cjs:81 rule it replaces (test-side oracles).
const readerOracle=ex=>Array.from({length:Math.max(1,ex.sets||1)},(_,i)=>{const k=Array.isArray(ex.wSets)&&ex.wSets.length>0?Math.min(i,ex.wSets.length-1):-1;return k>=0&&ex.wSets[k]!=null?ex.wSets[k]:ex.w;});
const oldReaderOracle=ex=>Array.from({length:Math.max(1,ex.sets||1)},(_,i)=>(Array.isArray(ex.wSets)&&ex.wSets[i]!=null?ex.wSets[i]:ex.w));
const N11S=n=>F0({...N11EX,sets:n});
const CAP_BASIS=Object.freeze({plan_basis:'fx-plan',input_basis:'fx-input',source_revision:1});
function adapterFor(engine,profile=CAPTURE_FACTORY.PROFILE){
 return CAPTURE_FACTORY.createEngineWorkoutCapture({engine,prescriptionCapture:PRESCRIPTION.createPrescriptionCapture({parseStrictJson:JSON.parse}),
  producerIdentity:{app_build:'fx-app',engine_build:'fx-engine',rule_profile:profile,source_schema:'fx-schema'}});
}
// The public capture boundary for one day: the capture and layout, the adapter and its exact input.
function prepareDay(state,{day=CARD_DAY,engine=engineAt(day),profile}={}){
 const adapter=adapterFor(engine,profile),input={state,day,sleep:{},basis:structuredClone(CAP_BASIS)},before=JSON.stringify(input),out=adapter.prepare(input);
 assert.equal(JSON.stringify(input),before,'the capture never writes its input (engine-capture.cjs:52, :97)');
 return {adapter,input,...out};
}
const liftCells=(capture,lift=LIFT)=>capture.slots.filter(x=>x.lift_lineage_id===lift);
const cellLoads=(capture,lift=LIFT)=>liftCells(capture,lift).map(x=>x.load.state==='specified'?JSON.parse(x.load.source_json).value:null);
// The composed engine of this file and both accepted runtimes (N20).
function runtimes(day){
 const W=require(path.join(ROOT,'rebuild/m4/workout/engine-runtime.cjs')),H=require(path.join(ROOT,'rebuild/m3/w6/host/engine-runtime-host.cjs'));
 return [['E',engineAt(day)],['W',W.createEngineRuntime({clock:clockFor(day),nativeTrendContext:assumedContext})],['H',H.createEngineRuntime({clock:clockFor(day),nativeTrendContext:assumedContext})]];
}
// The N11 lift with DEBUT [105,100] (offers[1]) accepted at sets 2 as fx-resp-b, folded over a base at `sets`.
function vectorDebut(sets,{rev='fx-revision-1',comps=[],extra=[],prep}={}){
 const {cs,offers}=n11Checked(),b=acceptOp(offers[1],{after:2,op_id:'fx-resp-b'}),spend=decisionOf(offers[1]).spend_id;
 const a=foldArgs([...cs,...comps],[b,...extra],rev,N11S(sets));if(prep)prep(a);
 const f=EFFECTS.m.foldNativeLoad(a);
 return {cs,b,spend,a,f,shown:EFFECTS.m.heldProjection(f).state,offer:offers[1]};
}
const atLoadOf=(E,wSets,P,sets=3)=>{const x=C(1,{reps:P.map(()=>9),loads:P,prescribed:P,effort:P.map(()=>X(2))}),s=withFacts(F0({sets,wSets}),[x]);return E._loadTenure(exOf(s),s,null,null).tenure.length===1;};
test('FIT-ORDINARY-UP R9.10 (spec R9.10 L FIT, CLAUSES THAT CHANGE :80; DECISIONS:803 (e)): the N11 lift (w 100, wSets [100,95]) at sets 3, no entry -> the day captures; its load cells are 100 lb, 95 lb, 95 lb (the last listed weight repeated), three reps cells (targetsFor padded), the whole capture equals that of the stored vector [100,95,95] (so the day\'s other lifts are unchanged), the input is unchanged and w, wSets and sets are not written',()=>{
 const s=N11S(3),before=JSON.stringify(s),out=prepareDay(s),cells=liftCells(out.capture);
 assert.deepEqual(cells.map(x=>[x.load.display,JSON.parse(x.load.source_json)]),[['100 lb',lb(100)],['95 lb',lb(95)],['95 lb',lb(95)]]);
 const card=engineAt(CARD_DAY).genSession(s,CARD_DAY,{}).ex.find(c=>c.id===LIFT);
 assert.deepEqual([card.tgt.length,cells.map(x=>JSON.parse(x.reps.source_json).value)],[3,card.tgt]);
 assert.deepEqual(out.capture,prepareDay(F0({...N11EX,sets:3,wSets:[100,95,95]})).capture,'the fitted card is the card of the full vector');
 assert.equal(JSON.stringify(s),before);assert.deepEqual([exOf(s).w,exOf(s).wSets,exOf(s).sets],[100,[100,95],3]);
});
test('FIT-ORDINARY-DOWN R9.10 (spec R9.10 L FIT, :80): the N11 lift at sets 1, no entry -> the day captures 100 lb on its one slot (what is performed), the whole capture equals that of the stored vector [100]; nothing written',()=>{
 const s=N11S(1),before=JSON.stringify(s),out=prepareDay(s);
 assert.deepEqual(liftCells(out.capture).map(x=>[x.load.display,JSON.parse(x.load.source_json)]),[['100 lb',lb(100)]]);
 assert.deepEqual(out.capture,prepareDay(F0({...N11EX,sets:1,wSets:[100]})).capture);
 assert.equal(JSON.stringify(s),before);
});
test('FIT-DEBUT-UP and FIT-DEBUT-DOWN R9.10 (spec R9.10 L FIT, :79; J (l)): DEBUT [105,100] pending on the N11 lift; sets 2 -> 3: the debut card captures 105 lb, 100 lb, 100 lb; sets 2 -> 1: 105 lb; isDebutNow true, card w 105; the entry keeps newW 105 and newWSets [105,100] and the lift w 100 and wSets [100,95]; R1 and R2',()=>{
 effectsGate();
 for(const rev of ['fx-revision-1','fx-revision-2'])for(const [sets,want] of [[3,[105,100,100]],[1,[105]]]){
  const v=vectorDebut(sets,{rev}),out=prepareDay(v.shown),card=engineAt(CARD_DAY).genSession(v.shown,CARD_DAY,{}).ex.find(c=>c.id===LIFT),label=rev+' sets '+sets;
  assert.deepEqual([card.isDebutNow,card.w,card.tgt.length],[true,105,sets],label);
  assert.deepEqual(liftCells(out.capture).map(x=>x.load.display),want.map(x=>x+' lb'),label);
  assert.deepEqual(cellLoads(out.capture),want,label);
  const q=v.f.state.queue.find(x=>x.native_load_spend===v.spend),ex=exOf(v.f.state);
  assert.deepEqual([q.done,q.newW,q.newWSets,ex.w,ex.wSets,ex.sets],[false,105,[105,100],100,[100,95],sets],label);
 }
});
// The dfc4445 capture bytes of every card that captured before R9.10 (digest measured on the dfc4445 product).
const FIT_IDENTITY_PIN='cfbab354334f2d16ad121bb42f3d468d434bf97a396907611a2ed15a7eaf52d5';
test('FIT-IDENTITY R9.10 (green-kept, red by mutant; spec R9.10 L FIT "When n === v.length the result is JSON-identical to today\'s copy(v)"): every capture that captured at dfc4445 (scalar, equal-length vector, the debut vector at its layout, a configured card, the baseline ask, a held projection) is byte-identical to its dfc4445 capture (pinned digest of captures and layouts), and resolveLayout and readLayout return the same layout',()=>{
 effectsGate();
 const {cs,base,offers}=n11Checked();
 const held=EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs(cs,[acceptOp(offers[0],{after:2,op_id:'fx-resp-a'}),acceptOp(offers[1],{after:2,op_id:'fx-resp-b'})],'fx-revision-1',base))).state;
 const cases=[['scalar',F0()],['vector',N11S(2)],['debut vector',vectorDebut(2).shown],['configured',F0({w:'BW'}),CAPTURE_FACTORY.CONFIGURATION_PROFILE],['baseline ask',F0({w:null})],['held',held]];
 const all=[];
 for(const [name,state,profile] of cases){
  const out=prepareDay(state,{profile});
  assert.deepEqual(out.adapter.resolveLayout({start:{prescription_capture:out.capture},originalInput:out.input}),out.layout,name);
  assert.deepEqual(out.adapter.readLayout(out.capture),out.layout,name);
  all.push([name,out.capture,out.layout]);
 }
 assert.deepEqual(all.map(([n,c])=>[n,cellLoads(c)]),[['scalar',[100,100,100]],['vector',[100,95]],['debut vector',[105,100]],['configured',[undefined,undefined,undefined]],['baseline ask',[null,null,null]],['held',[null,null]]]);
 assert.equal(sha(all),FIT_IDENTITY_PIN,'byte-identical to the dfc4445 captures and layouts');
});
test('FIT-MALFORMED R9.10 (green-kept, red by mutant; spec R9.10 L FIT "EVERY entry of the whole stored v ... BEFORE fitting, so truncation never hides a malformed entry"): on a 2-slot card wSets [], [100,95,NaN] and [100,95,-0] (a malformed entry beyond the card count); a sparse vector on 3 slots; a sparse vector whose only hole lies beyond a 1-slot card (first entry 100, length 3; L12-B1: the whole stored vector, holes included, is checked before the crop, so the card never captures [100]); a present-null wSets; a legacy debut entry with newWSets null; a scalar debut on a vector lift (its newW is not the stored w, :80); a configured card with a vector (:72-77): each refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED',()=>{
 const refuses=(label,state,profile)=>assert.throws(()=>prepareDay(state,{profile}),e=>e&&e.code==='ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED',label);
 for(const wSets of [[],[100,95,NaN],[100,95,-0]])refuses(String(wSets),F0({sets:2,wSets}));
 refuses('sparse',F0({sets:3,wSets:new Array(2)}));
 // L12-B1 (Astra L12; mutant L12-M03, Array.from(v).every -> v.every at engine-capture.cjs:22): the crop keeps [100], so only
 // the whole-vector check can see the hole.
 const cropped=[100];cropped.length=3;
 assert.deepEqual(cellLoads(prepareDay(F0({sets:1,wSets:[100,100,100]})).capture),[100],'control: the same card with the hole filled captures');
 refuses('cropped hole',F0({sets:1,wSets:cropped}));
 refuses('present-null',F0({wSets:null}));
 const legacy=F0();legacy.queue.push({id:'fx-legacy-debut',kind:'debut',exId:LIFT,newW:105,newWSets:null,state:'DEBUT',done:false,t:'SYNTHETIC legacy debut'});refuses('newWSets null',legacy);
 const scalar=N11S(2);scalar.queue.push({id:'fx-scalar-debut',kind:'debut',exId:LIFT,newW:105,state:'DEBUT',done:false,t:'SYNTHETIC scalar debut'});refuses('scalar debut on a vector lift',scalar);
 refuses('configured vector',F0({w:'BW',wSets:[40,35]}),CAPTURE_FACTORY.CONFIGURATION_PROFILE);
});
test('FIT-REPLAY and FIT-WINDOW R9.10 (spec R9.10 L; engine-capture.cjs:103-110 unchanged; FC16 :91): resolveLayout of a fitted Start (the N11 lift at sets 3) reproduces its layout and readLayout reads it; a stored vector changed after that Start refuses ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT; each fitted reps cell carries window_hi 10',()=>{
 const out=prepareDay(N11S(3)),start={prescription_capture:out.capture};
 assert.deepEqual(out.adapter.resolveLayout({start,originalInput:out.input}),out.layout);
 assert.deepEqual(out.adapter.readLayout(out.capture),out.layout);
 const later=structuredClone(out.input);exOf(later.state).wSets=[100,90];
 assert.throws(()=>out.adapter.resolveLayout({start,originalInput:later}),e=>e&&e.code==='ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT');
 assert.deepEqual(liftCells(out.capture).map(x=>JSON.parse(x.reps.source_json).window_hi),[10,10,10]);
});
test('FIT-STORED R9.10 (spec R9.10 L STORED VALUES): after a fitted debut Start and Close (MISSED) and its refused check, then a fitted ordinary Start, Close and refused check, the lift\'s w, wSets, sets, wAt and last and the entry\'s newW and newWSets are byte-identical to before (the miss writes only done, state and native_load_missed_by); R1 and R2',()=>{
 effectsGate();
 const c3=C(3,{date:'2026-10-12',reps:[8,7,6],loads:[105,100,100],prescribed:[105,100,100],effort:e(2,1,1)});
 const c4=C(4,{date:'2026-10-15',reps:[10,9,8],loads:[100,95,95],prescribed:[100,95,95],effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const v0=vectorDebut(3,{rev}),q0=structuredClone(v0.f.state.queue.find(x=>x.native_load_spend===v0.spend)),ex0=structuredClone(exOf(v0.f.state));
  for(const comps of [[c3],[c3,c4]]){
   const v=vectorDebut(3,{rev,comps}),q=v.f.state.queue.find(x=>x.native_load_spend===v.spend),ex=exOf(v.f.state),label=rev+' '+comps.length;
   assert.deepEqual([q.done,q.state,q.native_load_missed_by],[true,'MISSED',c3.close],label);
   assert.deepEqual({...q,done:q0.done,state:q0.state,native_load_missed_by:undefined},{...q0,native_load_missed_by:undefined},label+' only done, state and native_load_missed_by change');
   for(const k of ['w','wSets','sets','wAt','last'])assert.deepEqual([k,ex[k]],[k,ex0[k]],label);
   expectRefusal(checkOf(v.a,LIFT,comps.at(-1)),'SET_COUNT_BASIS_UNPROVEN',[ref(comps.at(-1).close)]);
  }
 }
});
test('FIT-PARITY R9.10 (spec R9.10 L FIT-PARITY; N20): on every fitted card (the ordinary N11 lift at sets 3 and 1, the vector debut at sets 3 and 1) the captured loads equal fit(stored vector, n), identically through this file\'s engine and both accepted runtimes; SELECTED ENTRY (FC03 selectedEntry, FC01 entryTarget) reads the fitted debut card as the entry\'s card: its Close at the fitted loads consumes the entry (MISSED, another layout) with no issue, typed v2 and host v1',()=>{
 effectsGate();
 for(const [name,state,stored,n] of [['ordinary 3',N11S(3),[100,95],3],['ordinary 1',N11S(1),[100,95],1],['debut 3',vectorDebut(3).shown,[105,100],3],['debut 1',vectorDebut(1).shown,[105,100],1]])
  for(const [rt,engine] of runtimes(CARD_DAY))assert.deepEqual(cellLoads(prepareDay(state,{engine}).capture),fitOracle(stored,n),name+' '+rt);
 for(const n of [3,1]){
  const cardW=fitOracle([105,100],n),c3=C(3,{date:'2026-10-12',reps:[8,7,6].slice(0,n),loads:cardW,prescribed:cardW,effort:e(2,1,1).slice(0,n)});
  for(const v1 of [false,true]){
   const c=v1?v1Of(c3):c3,v=vectorDebut(n,{comps:[c],prep:a=>{if(v1)captureOn(a.generation,c,cardW);}});
   assert.deepEqual([liveQ(v.f,v.spend),v.f.issues.map(i=>i.code)],[[[true,'MISSED']],[]],n+(v1?' v1 ':' v2 ')+JSON.stringify(v.f.issues));
  }
 }
});
test('FIT-GUARD R9.10 (spec R9.10 L FC01/FC03 (3), :146): the N11 lift at sets 3, C1-C3 captured fitted [100,95,95] and performed there at tops [10,9,8]: each check, made while its completion is the latest, refuses SET_COUNT_BASIS_UNPROVEN [its Close Ref], field null, offers [], and writes no op; the same at sets 1 on [100]; typed v2 and host v1 slots, R1 and R2; with the count back to 2, two tops at [100,95] give the unchanged N11 offers (PROPOSED 110 [110,105], DEBUT 105 [105,100])',()=>{
 effectsGate();
 for(const [sets,loads,reps,eff] of [[3,[100,95,95],TOP,e(2,1,1)],[1,[100],[10],e(2)]])for(const v1 of [false,true])for(const rev of ['fx-revision-1','fx-revision-2']){
  const cs=[1,2,3].map(n=>C(n,{reps,loads,prescribed:loads,effort:eff}));
  for(let k=1;k<=3;k++){
   const comps=cs.slice(0,k).map(c=>(v1?v1Of(c):c)),a=foldArgs(comps,[],rev,N11S(sets));
   if(v1)for(const c of comps)captureOn(a.generation,c,loads);
   const before=JSON.stringify(a.generation),ev=checkOf(a,LIFT,comps[k-1]),label='sets '+sets+(v1?' v1 ':' v2 ')+rev+' C'+k;
   assert.deepEqual([ev.status,ev.offers,ev.refusal],['refused',[],{code:'NATIVE_LOAD_SET_COUNT_BASIS_UNPROVEN',refs:[ref(comps[k-1].close)],field:null}],label);
   assert.equal(JSON.stringify(a.generation),before,label+' no response op');
  }
 }
 // The guard precedes the typed comparison (L (3) (b) before (c)): a typed completion whose Start captured another
 // card at the current count ([100,100,100], before the vector was stored) refuses SET_COUNT_BASIS_UNPROVEN, not PLAN_CHANGED.
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const c1=C(1,{reps:TOP,loads:100,prescribed:100,effort:e(2,1,1)});
  expectRefusal(checkOf(foldArgs([c1],[],rev,N11S(3)),LIFT,c1),'SET_COUNT_BASIS_UNPROVEN',[ref(c1.close)]);
 }
 const {offers}=n11Checked();
 assert.deepEqual(offers.map(o=>[decisionOf(o).candidate.state,decisionOf(o).target_load.vector.map(x=>x.value)]),[['PROPOSED',[110,105]],['DEBUT',[105,100]]],'the count back to 2: the unchanged N11 outcome');
});
test('FIT-UNDO R9.10 (spec R9.10 L UNDO; :154 capturedAfter through SELECTED ENTRY): DEBUT [105,100] pending on the N11 lift at sets 3: its Undo is offered before any Start; a Start that captured the fitted debut card [105,100,100], open and then closed, makes the Undo refuse COMPENSATION_DESCENDANTS [its yes Ref]; R1 and R2',()=>{
 effectsGate();
 const c3=C(3,{date:'2026-10-12',reps:[8,7,6],loads:[105,100,100],prescribed:[105,100,100],effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const v=vectorDebut(3,{rev});
  assert.equal(checkOf(v.a,LIFT,v.cs[1],{compensate:v.spend}).status,'offer',rev+' before the Start');
  const open=vectorDebut(3,{rev,prep:a=>{const ops=a.generation.collections.ops,last=Object.values(ops).reduce((x,y)=>Math.max(x,y.device_seq),0);
   ops[c3.start]={op_id:c3.start,athlete_id:ATH,device_id:DEVICE,device_seq:last+1,class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(c3.start)};captureOn(a.generation,c3,[105,100,100]);}});
  expectRefusal(checkOf(open.a,LIFT,v.cs[1],{compensate:v.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-b')]);
  const closed=vectorDebut(3,{rev,comps:[c3]});
  expectRefusal(checkOf(closed.a,LIFT,c3,{compensate:v.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-b')]);
 }
});
test('FIT-DEVICE R9.10 (spec R9.10 L TWO DEVICES; J SECOND DEVICE (ii)): DEBUT [105,100] accepted, sets edited 2 -> 3; device A had not received the edit and its Start captured the unfitted card [105,100]; device B captured the fitted card [105,100,100]. The Close first in the workout order consumes the entry: A first at [105,100] lands (w 105, wSets [105,100]) and the check on B refuses SET_COUNT_BASIS_UNPROVEN [B Close Ref]; B first at [105,100,100] is MISSED (w 100, wSets [100,95]) and the check on A refuses PLAN_CHANGED [A Close Ref] (count clause); the same under both delivery orders and R1/R2',()=>{
 effectsGate();
 const A=n=>C(n,{date:dayAt(n+8),reps:[8,7],loads:[105,100],prescribed:[105,100],effort:e(2,1)}),B=n=>C(n,{date:dayAt(n+8),reps:[8,7,6],loads:[105,100,100],prescribed:[105,100,100],effort:e(2,1,1)});
 for(const [first,second,want] of [[A(3),B(4),'A'],[B(3),A(4),'B']]){
  const seen=new Set();
  for(const rev of ['fx-revision-1','fx-revision-2'])for(const late of [false,true]){
   const v=vectorDebut(3,{rev,comps:[first,second],prep:a=>{if(!late)return;const ops=a.generation.collections.ops;let k=0;
    for(const id of second.ops){ops[id].device_id='fx-device-B';ops[id].device_seq=2000+(++k);}ops[second.start].causal_parents=['fx-resp-b'];}});
   const q=v.f.state.queue.find(x=>x.native_load_spend===v.spend),ex=exOf(v.f.state),label=want+' first '+rev+(late?' delivered late':'');
   if(want==='A'){
    assert.deepEqual([q.done,q.state,ex.w,ex.wSets],[true,'ESTABLISH',105,[105,100]],label+' '+JSON.stringify(v.f.issues));
    expectRefusal(checkOf(v.a,LIFT,second),'SET_COUNT_BASIS_UNPROVEN',[ref(second.close)]);
   }else{
    assert.deepEqual([q.done,q.state,q.native_load_missed_by,ex.w,ex.wSets],[true,'MISSED',first.close,100,[100,95]],label+' '+JSON.stringify(v.f.issues));
    expectRefusal(checkOf(v.a,LIFT,second),'PLAN_CHANGED',[ref(second.close)]);
   }
   seen.add(JSON.stringify([q,ex.w,ex.wSets,v.f.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code)]));
  }
  assert.equal(seen.size,1,want+' first: identical under both delivery orders and R1/R2');
 }
});
test('FIT-HELD R9.10 (green-kept; spec R9.10 L FIT-HELD, :159 held projection): the N11 lift held by EFFECT_CONFLICT (both N11 offers accepted) at sets 3 projects w and wSets null, so its card is the baseline ask on 3 slots (no fit); exit (b): C3 on the baseline ask at [100,100,100] is offered [adopt-baseline 100 on 3 slots], at [100,95,95] VECTOR_ADOPTION_UNDEFINED [C3 Close Ref]; R1 and R2',()=>{
 effectsGate();
 const {cs,offers}=n11Checked(),a=acceptOp(offers[0],{after:2,op_id:'fx-resp-a'}),b=acceptOp(offers[1],{after:2,op_id:'fx-resp-b'});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs(cs,[a,b],rev,N11S(3))),shown=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(shown).w,exOf(shown).wSets],[null,null],rev);
  assert.deepEqual(cellLoads(prepareDay(shown).capture),[null,null,null],rev+' the baseline ask');
  const c3e=C(3,{reps:TOP,loads:[100,100,100],prescribed:[null,null,null],effort:e(2,1,1)});
  assert.deepEqual(checkOf(foldArgs([...cs,c3e],[a,b],rev,N11S(3)),LIFT,c3e).offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.vector.map(x=>x.value)]),[['adopt-baseline',[100,100,100]]],rev);
  const c3=C(3,{reps:TOP,loads:[100,95,95],prescribed:[null,null,null],effort:e(2,1,1)});
  expectRefusal(checkOf(foldArgs([...cs,c3],[a,b],rev,N11S(3)),LIFT,c3),'VECTOR_ADOPTION_UNDEFINED',[ref(c3.close)]);
 }
});
test('N29-VECTOR-LAYOUT-R9.10 (spec R9.10 J (l), D1 N29 VECTOR LAYOUT (:320), L; DECISIONS:803 (e), :801 (1); updates the R9.9 refused-day characterization N29-VECTOR-LAYOUT, D-VECTOR-SETS paid): the N11 lift with DEBUT [105,100] accepted and its set count edited 2 -> 3: before the Start the entry is pending (TARGET_QUEUED) and its Undo offered; the Start captures the debut card fitted, [105,100,100], with 3 specified reps cells, and with no entry the ordinary day captures [100,95,95]; C3 at [105,100,100] (or [100,95,95], or [95,90,90]) consumes Q as MISSED (another layout) with w 100, wSets [100,95] and sets 3 unchanged and no hold; the check on C3 refuses SET_COUNT_BASIS_UNPROVEN [C3 Close Ref] with no offer; the Undo of Q refuses COMPENSATION_DESCENDANTS; the next card is the ordinary card fitted, [100,95,95], never the debut; variant 2 -> 1: debut card [105], missed, next card [100]; variant 2 -> 3 -> 2 before any Start: debut card [105,100], and C3 at [105,100] lands (w 105, wSets [105,100]); R1 and R2, typed v2 and host v1',()=>{
 effectsGate();
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const v=vectorDebut(3,{rev});
  assert.deepEqual(liveQ(v.f,v.spend),[[false,'DEBUT']],rev);
  expectRefusal(checkOf(v.a,LIFT,v.cs[1]),'TARGET_QUEUED',[ref('fx-resp-b')]);
  assert.equal(checkOf(v.a,LIFT,v.cs[1],{compensate:v.spend}).status,'offer',rev+' its Undo stays offered');
  const card=prepareDay(v.shown).capture;
  assert.deepEqual([cellLoads(card),liftCells(card).map(x=>x.reps.state)],[[105,100,100],['specified','specified','specified']],rev+' the debut card, fitted');
  assert.deepEqual(cellLoads(prepareDay(withFacts(N11S(3),v.cs)).capture),[100,95,95],rev+' no entry: the ordinary day, fitted');
  for(const [sets,cardW,loadsList,next] of [[3,[105,100,100],[[105,100,100],[100,95,95],[95,90,90]],[100,95,95]],[1,[105],[[105],[100]],[100]]])for(const loads of loadsList)for(const v1 of [false,true]){
   const k=cardW.length,c3=C(3,{date:'2026-10-12',reps:[8,7,6].slice(0,k),loads,prescribed:cardW,effort:e(2,1,1).slice(0,k)}),c=v1?v1Of(c3):c3;
   const x=vectorDebut(sets,{rev,comps:[c],prep:a=>{if(v1)captureOn(a.generation,c,cardW);}}),label='sets '+sets+' at '+loads+(v1?' v1 ':' v2 ')+rev;
   assert.deepEqual([liveQ(x.f,x.spend),exOf(x.f.state).w,exOf(x.f.state).wSets,exOf(x.f.state).sets,EFFECTS.m.heldProjection(x.f).lifts.has(LIFT)],[[[true,'MISSED']],100,[100,95],sets,false],label+' '+JSON.stringify(x.f.issues));
   expectRefusal(checkOf(x.a,LIFT,c),'SET_COUNT_BASIS_UNPROVEN',[ref(c.close)]);
   expectRefusal(checkOf(x.a,LIFT,c,{compensate:x.spend}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-b')]);
   assert.deepEqual(cellLoads(prepareDay(x.shown).capture),next,label+' the next card, never the debut');
  }
  const back=vectorDebut(2,{rev});
  assert.deepEqual(cellLoads(prepareDay(back.shown).capture),[105,100],rev+' 2 -> 3 -> 2: the debut card at its layout');
  const c3=C(3,{date:'2026-10-12',reps:[8,7],loads:[105,100],prescribed:[105,100],effort:e(2,1)}),l=vectorDebut(2,{rev,comps:[c3]});
  assert.deepEqual([liveQ(l.f,l.spend),exOf(l.f.state).w,exOf(l.f.state).wSets],[[[true,'ESTABLISH']],105,[105,100]],rev+' '+JSON.stringify(l.f.issues));
 }
});
test('READER-UP R9.10 (spec R9.10 L READER, DECISIONS:804 (f); E/progression.cjs:80-82): the N11 lift at sets 3; C1 at sets 2 [100,95] reps [7,6], then C2 captured fitted [100,95,95] and performed there, reps [10,9,8]: the day prepares; C2 is in E._loadTenure\'s tenure and is progressAnchor\'s line ([10,9,8]); the next card\'s reps targets are those of the same history under the stored vector [100,95,95] (as after any other workout); the check on C2 still refuses SET_COUNT_BASIS_UNPROVEN [C2 Close Ref], field null (nothing is offered, spent or written)',()=>{
 effectsGate();
 const c1=C(1,{reps:[7,6],loads:[100,95],prescribed:[100,95],effort:e(2,1)}),c2=C(2,{reps:TOP,loads:[100,95,95],prescribed:[100,95,95],effort:e(2,1,1)});
 const s=withFacts(N11S(3),[c1,c2]),full=withFacts(F0({...N11EX,sets:3,wSets:[100,95,95]}),[c1,c2]),E=engineAt(CARD_DAY);
 assert.deepEqual(cellLoads(prepareDay(s).capture),[100,95,95],'the day prepares');
 assert.ok(E._loadTenure(exOf(s),s,null,null).tenure.some(t=>t[3]&&t[3].start_op_id===c2.start),'C2 extends the load tenure');
 assert.deepEqual(E.progressAnchor(exOf(s),s),TOP,'C2 is the reps anchor');
 const card=E.genSession(s,CARD_DAY,{}).ex.find(k=>k.id===LIFT),cardFull=E.genSession(full,CARD_DAY,{}).ex.find(k=>k.id===LIFT);
 assert.deepEqual(card.tgt,cardFull.tgt,'the next card\'s reps targets follow C2');
 const a=foldArgs([c1,c2],[],'fx-revision-1',N11S(3)),before=JSON.stringify(a.generation);
 expectRefusal(checkOf(a,LIFT,c2),'SET_COUNT_BASIS_UNPROVEN',[ref(c2.close)]);assert.equal(JSON.stringify(a.generation),before);
});
test('READER-DOWN R9.10 (green-kept; spec R9.10 L READER "(iii) every row is judged as before when the stored vector is at least as long as the set count"): the N11 lift at sets 1: a row performed at [100] is the tenure and the anchor; a row performed at [100,95] has a performed position the card does not hold and is not at the current load, as before',()=>{
 const E=engineAt(CARD_DAY),c1=C(1,{reps:[10],loads:[100],prescribed:[100],effort:e(2)}),s=withFacts(N11S(1),[c1]);
 assert.deepEqual([E._loadTenure(exOf(s),s,null,null).tenure.length,E.progressAnchor(exOf(s),s)],[1,[10]]);
 assert.deepEqual([atLoadOf(E,[100,95],[100],1),atLoadOf(E,[100,95],[100,95],1)],[true,false]);
});
test('READER-IDENTITY R9.10 (green-kept wherever no position lies beyond the stored vector, red on dfc4445 at the two that do, red by mutant; spec R9.10 L READER "today\'s rule at every position below the stored vector\'s length ... an empty array, present-null or ABSENT wSets read ex.w everywhere"): over wSets ABSENT, null, [], shorter, equal and longer than the set count, with null entries inside and at the end, a native row is at the current load exactly when its performed positions equal the READER vector; that vector is dfc4445\'s except at a position beyond a non-empty stored vector whose last entry is not w; a legacy-only input keeps the legacy rule (String(w)) whatever wSets holds; an explicit zero is a value, never a missing entry: wSets [100,0] at sets 3 (w 100) reads 100, 0, 0, so a native row performed at [100,100,100] is not at the current load (L12-B2)',()=>{
 const E=engineAt(CARD_DAY);
 const matrix=[[undefined,3],[null,3],[[],3],[[100,95],3],[[100,95],2],[[100,95,90],3],[[100,95,90,85],3],[[100,null,90],3],[[100,95,null],3],[[95,null],3],[[100,100],3],[[95],1],[[95],3],[[100],3]];
 let beyond=0;
 for(const [wSets,sets] of matrix){
  const ex={w:100,sets,...(wSets===undefined?{}:{wSets})},R=readerOracle(ex),O=oldReaderOracle(ex),label=JSON.stringify([wSets,sets]);
  if(JSON.stringify(R)!==JSON.stringify(O)){beyond++;assert.ok(Array.isArray(wSets)&&wSets.length>0&&wSets.length<sets&&wSets[wSets.length-1]!=null&&wSets[wSets.length-1]!==100,'a difference only beyond the stored vector '+label);}
  for(const P of [R,O,R.map(()=>100),R.map((v,i)=>(i?v:v-5))])assert.equal(atLoadOf(E,wSets,P,sets),JSON.stringify(P)===JSON.stringify(R),label+' performed '+JSON.stringify(P));
 }
 assert.equal(beyond,2,'[100,95] and [95] at sets 3 read beyond their stored vectors');
 // L12-B2 (Astra L12; mutant L12-M07, != null -> truthiness at E/progression.cjs:81): an explicit zero is an in-range
 // non-null entry and is read as written (R9.10 L READER), never replaced by w.
 assert.deepEqual(readerOracle({w:100,wSets:[100,0],sets:3}),[100,0,0]);
 assert.equal(atLoadOf(E,[100,0],[100,100,100],3),false,'explicit zero: a row at [100,100,100] is not at the current load');
 for(const [w,want] of [[100,1],[95,0]])for(const view of [false,true]){
  // Legacy-only input, and a legacy row read in the native view (_rowAtCurrentLoad's legacy branch).
  const s=view?withFacts(F0({sets:3,wSets:[100,95]}),[]):F0({sets:3,wSets:[100,95]});s.sessionLog={[dayAt(0)]:{entries:[{id:LIFT,w,reps:[9,9,9]}]}};
  assert.equal(E._loadTenure(exOf(s),s,null,null).tenure.length,want,'legacy row at '+w+(view?' in the native view':''));
 }
});
test('READER-NULL-LAST R9.10 (green on dfc4445 by construction, red by mutant; spec R9.10 L READER "a null last entry falls back to ex.w exactly as a null entry does today"): wSets [100,null] at sets 3 reads 100, w, w; wSets [95,null] at sets 3 (w 100) reads 95, 100, 100: a native row performed at [95,100,100] is at the current load and one at [95,95,95] is not',()=>{
 const E=engineAt(CARD_DAY);
 assert.deepEqual([atLoadOf(E,[100,null],[100,100,100]),atLoadOf(E,[95,null],[95,100,100]),atLoadOf(E,[95,null],[95,95,95])],[true,true,false]);
});
test('READER-HISTORY R9.10 (spec R9.10 L READER (ii)): with the stored vector [100,95,95] a native row performed at [100,95,95] is at the current load and one at [100,95,100] is not; with the stored vector [100,95] at sets 3 the same holds (dfc4445 gave the reverse)',()=>{
 const E=engineAt(CARD_DAY);
 assert.deepEqual([atLoadOf(E,[100,95,95],[100,95,95]),atLoadOf(E,[100,95,95],[100,95,100]),atLoadOf(E,[100,95],[100,95,95]),atLoadOf(E,[100,95],[100,95,100])],[true,false,true,false]);
});
// FC01 DERIVABLE (c2) through the public transition (spec R9 :156): a compensate record naming no fold spend
// passes (c2) exactly when its base vector is FC01 planVector's projection of its recorded image over
// load_basis.sets, and is then refused at the next clause ('compensates'); otherwise 'base_load'.
function c2Field(R,{w=100,wSets,sets},base){
 const abs={present:false,value:null},W={present:true,value:w},S=wSets===undefined?abs:{present:true,value:wSets};
 const fields={w:W,wSets:S,wAt:abs,last:abs,lastMeta:abs,own:abs,std:abs,topAt:abs,topRun:abs};
 const d={profile:'earned/native-load-decision/v1',kind:'compensate',lift_lineage_id:LIFT,basis:{load_basis:{authority_refs:[],sets,w:W,wSets:S,inc:abs,steps:abs}},evidence:[],
  base_load:{scalar:lb(w),vector:base.map(lb),fields},target_load:{scalar:lb(w),vector:base.map(lb)},candidate:null,reason_key:'compensation',
  spend_id:JSON.stringify(['native-load-compensation',LIFT,'fx-none']),consumes:[],compensates:'fx-none'};
 const t=R.applyNativeLoadDecision(F0(),d,{event:'accept',basis:d.basis,spent:[],authority:{response_refs:[ref('fx-resp-p')]},completion:null});
 return t.status==='refused'&&t.refusal?t.refusal.field:t.status;
}
test('READER-PARITY R9.10 (spec R9.10 L READER, READER-PARITY; N20): over the matrix, E (a native row at the current load, E/progression.cjs through _rowAtCurrentLoad) and FC01 planVector (DERIVABLE (c2), through this file\'s engine and both accepted runtimes) read the same vector, which equals the fitted loads wherever the stored vector has no null entry; FC03 projectBase (the MISSED-DEBUT ANCHOR base check, :155) accepts a claimed adoption of the fitted N11 debut Close re-based on the earn\'s recorded image with base [100,95,95] (it then meets the vector plan: VECTOR_ADOPTION_UNDEFINED, held back) and refuses base_load on [100,95,100]; R1 and R2; an explicit zero (w 100, wSets [100,0], sets 3): E finds a row at [100,100,100] not at the current load and FC01 planVector (DERIVABLE (c2), E, W and H) accepts the base [100,0,0] and refuses [100,100,100] (L12-B2)',()=>{
 effectsGate();
 const E=engineAt(CARD_DAY),matrix=[[undefined,3],[null,3],[[],3],[[100,95],3],[[100,95],2],[[100,95,90],3],[[100,95,90,85],3],[[100,null,90],3],[[95,null],3],[[95],3],[[95],1]];
 for(const [wSets,sets] of matrix){
  const R=readerOracle({w:100,sets,...(wSets===undefined?{}:{wSets})}),label=JSON.stringify([wSets,sets]);
  assert.equal(atLoadOf(E,wSets,R,sets),true,label+' E');
  if(Array.isArray(wSets)&&wSets.length&&wSets.every(v=>v!=null))assert.deepEqual(R,fitOracle(wSets,sets),label+' the fitted loads');
  const other=R.map((v,i)=>(i===R.length-1?v+2.5:v));
  for(const [rt,engine] of runtimes(CARD_DAY))assert.deepEqual([c2Field(engine,{wSets,sets},R),c2Field(engine,{wSets,sets},other)],['compensates','base_load'],label+' FC01 '+rt);
 }
 // L12-B2: the explicit zero in parity (E through _rowAtCurrentLoad, FC01 planVector through DERIVABLE (c2)).
 assert.equal(atLoadOf(E,[100,0],[100,100,100],3),false,'explicit zero E');
 for(const [rt,engine] of runtimes(CARD_DAY))assert.deepEqual([c2Field(engine,{wSets:[100,0],sets:3},[100,0,0]),c2Field(engine,{wSets:[100,0],sets:3},[100,100,100])],['compensates','base_load'],'explicit zero FC01 '+rt);
 const c3=C(3,{date:'2026-10-12',reps:[8,7,6],loads:95,prescribed:[105,100,100],effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const v=vectorDebut(3,{rev,comps:[c3]});
  assert.deepEqual(liveQ(v.f,v.spend),[[true,'MISSED']],rev+' control: the fitted debut Close missed');
  // The claimed adoption, issued by FC01 on a scalar view of the lift, then re-based on the earn's recorded image.
  const view=structuredClone(v.f.state);delete exOf(view).wSets;
  const comps=[...v.cs,c3],basis=basisFor(view,comps,{frontier:v.f.spent.map(x=>({spend_id:x.spend_id,response_refs:x.response_refs,close_ref:x.close_ref}))});
  basis.load_basis.authority_refs=[ref(c3.close)];
  const ev=engineAt(c3.date).evaluateNativeLoad(view,{lift_lineage_id:LIFT,completion_op_id:c3.close,intent:'check',basis});
  assert.equal(ev.status,'offer',rev+' '+JSON.stringify(ev.refusal));
  for(const [vec,want] of [[[100,95,95],'NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED'],[[100,95,100],'NATIVE_LOAD_RECORD_INVALID']]){
   const o=structuredClone(ev.offers[0]),d=decisionOf(o);
   assert.deepEqual([d.kind,d.basis.load_basis.authority_refs],['adopt-observed',[ref(c3.close)]],rev);
   d.base_load.vector=vec.map(lb);d.base_load.fields.wSets={present:true,value:[100,95]};d.basis.load_basis.wSets={present:true,value:[100,95]};
   const g=vectorDebut(3,{rev,comps:[c3],extra:[acceptOp(o,{op_id:'fx-resp-o',after:3})]}).f;
   const mine=g.issues.filter(i=>(i.refs||[]).some(r=>r.op_id==='fx-resp-o')&&i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>[i.code,i.field]);
   assert.deepEqual(mine,[[want,want==='NATIVE_LOAD_RECORD_INVALID'?'base_load':null]],rev+' '+vec+' '+JSON.stringify(g.issues));
   assert.equal(exOf(g.state).w,100,rev+' nothing raised');
  }
 }
});
test('READER-UNDO-TEXT R9.10 (spec R9.10 L READER, Records): the Undo of the pending vector Q (DEBUT [105,100]) after sets 2 -> 3, before its Start, is a RETIRE whose target and base are [100,95,95] and whose sentence names \'100 lb, 95 lb, 95 lb\'; its yes replays under R1 and R2 (Q COMPENSATED, no RECORD_INVALID, w 100 and wSets [100,95] unchanged)',()=>{
 effectsGate();
 const v=vectorDebut(3),u=checkOf(v.a,LIFT,v.cs[1],{compensate:v.spend});assert.equal(u.status,'offer',JSON.stringify(u.refusal));
 const d=decisionOf(u.offers[0]);
 assert.deepEqual([d.kind,d.target_load.vector,d.base_load.vector],['compensate',Loads(100,95,95),Loads(100,95,95)]);
 assert.ok(u.offers[0].reason.includes('goes back to 100 lb, 95 lb, 95 lb.'),u.offers[0].reason);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=vectorDebut(3,{rev,extra:[acceptOp(u.offers[0],{op_id:'fx-resp-u',after:2})]}).f;
  assert.deepEqual([liveQ(f,v.spend),recordInvalid(f),exOf(f.state).w,exOf(f.state).wSets],[[[true,'COMPENSATED']],[],100,[100,95]],rev+' '+JSON.stringify(f.issues));
 }
});
// J D-L8F-1: Q105 missed on C3 at 95 (3 sets) and the yes to its [adopt-observed 95] (fx-resp-3), typed v2 or host v1.
function lowerYes(v1){
 const m=missedDebut(95),e0=n29Args(m.cs,m.c3,[m.resp],{v1}),exit=checkOf(e0.a,LIFT,e0.c).offers[0];
 return {m,d:decisionOf(exit),yes:acceptOp(exit,{op_id:'fx-resp-3',after:3}),args:(extra,o={})=>n29Args(m.cs,m.c3,[m.resp,...extra],{v1,card:[105,105,105],...o})};
}
test('RESTORE-COUNT R9.10 (spec R9.10 L RESTORE COUNT, D-R18-SETS-RESTORE, DECISIONS:804; J D-L8F-1): Q105 missed on C3 at 95 (3 sets) and the yes to [adopt-observed 95] applied (w 95), then a sets-only plan edit 3 -> 2 (and 3 -> 4): the adoption stays applied; its Undo is offered with target 100 on the 3 slots the adoption consumed and base 95 on the current count; its yes restores w 100 and the whole prior image, keeps the edited count, authority compensated, no issue, and the next card is 100 on the edited count; R1 and R2, typed v2 and host v1; an ADDED set is never an original slot: the yes to [adopt-baseline 60] from three original sets plus one added set (w null), then sets 3 -> 2: the Undo is offered with target null on the 3 original slots and base 60 on 2, and its yes restores w null, keeps sets 2, authority compensated, no RECORD_INVALID (L12-B3)',()=>{
 effectsGate();
 for(const v1 of [false,true]){
  const L=lowerYes(v1);
  for(const k of [2,4])for(const rev of ['fx-revision-1','fx-revision-2']){
   const label=(v1?'v1 ':'v2 ')+'sets '+k+' '+rev,{a,c}=L.args([L.yes],{rev,base:SETS(k)}),f0=EFFECTS.m.foldNativeLoad(a);
   assert.deepEqual([exOf(f0.state).w,exOf(f0.state).sets],[95,k],label+' the adoption stays applied across the count edit '+JSON.stringify(f0.issues));
   const u=checkOf(a,LIFT,c,{compensate:L.d.spend_id});assert.equal(u.status,'offer',label+' '+JSON.stringify(u.refusal));
   const ud=decisionOf(u.offers[0]);
   assert.deepEqual([ud.target_load.scalar,ud.target_load.vector,ud.base_load.scalar,ud.base_load.vector],[lb(100),Loads(100,100,100),lb(95),Array(k).fill(lb(95))],label);
   const g=EFFECTS.m.foldNativeLoad(L.args([L.yes,acceptOp(u.offers[0],{op_id:'fx-resp-4',after:3})],{rev,base:SETS(k)}).a),gx=exOf(g.state),before=exOf(SETS(k));
   for(const x of ['w','wSets','wAt','last','lastMeta','own','std','topAt','topRun','sets'])assert.deepEqual([x,gx[x]],[x,before[x]],label+' prior image '+x);
   assert.deepEqual([gx.native_load_authority.kind,g.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED')],['compensated',[]],label+' '+JSON.stringify(g.issues));
   assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(g).state),Array(k).fill(100),label+' the next card');
  }
 }
 // L12-B3 (Astra L12; mutant L12-M08, originalSlots(entry).length -> entry.slots.length at native-load.cjs:401): the Undo's
 // target counts the adoption's ORIGINAL slots; the added fourth set (origin 'added', no capture cell) is not one.
 const ca=C(1,{reps:[10,9,8,7],loads:60,prescribed:null,effort:e(2,1,1,1)});ca.session.record.entries[0].slots[3].origin='added';
 const added=(extra=[],rev='fx-revision-1',sets=3)=>{const a=foldArgs([ca],extra,rev,F0({w:null,sets}));a.generation.collections.ops[ca.start].prescription_capture.slots.pop();return a;};
 const ao=checkOf(added(),LIFT,ca);assert.equal(ao.status,'offer','added: '+JSON.stringify(ao.refusal));
 const ad=decisionOf(ao.offers[0]),ay=acceptOp(ao.offers[0],{after:1});assert.deepEqual([ad.kind,ad.target_load.scalar.value],['adopt-baseline',60]);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=added([ay],rev,2),label='added '+rev;assert.equal(exOf(EFFECTS.m.foldNativeLoad(a).state).w,60,label+' the adoption applied');
  const u=checkOf(a,LIFT,ca,{compensate:ad.spend_id});assert.equal(u.status,'offer',label+' '+JSON.stringify(u.refusal));
  const ud=decisionOf(u.offers[0]);
  assert.deepEqual([ud.target_load.scalar,ud.target_load.vector,ud.base_load.vector],[null,[null,null,null],Loads(60,60)],label+' the offered Undo');
  const g=EFFECTS.m.foldNativeLoad(added([ay,acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1})],rev,2)),gx=exOf(g.state);
  assert.deepEqual([gx.w,gx.sets,gx.native_load_authority.kind,recordInvalid(g)],[null,2,'compensated',[]],label+' the accepted Undo '+JSON.stringify(g.issues));
 }
});
test('RESTORE-COUNT-BASELINE R9.10 (spec R9.10 L RESTORE COUNT): the yes to [adopt-baseline 60] on C1 (w null, 3 sets) applied, then sets 3 -> 2: the Undo is offered with target null on the 3 slots the adoption consumed and base 60 on 2; its yes restores the prior image as recorded (w null), sets 2, authority compensated, no issue; R1 and R2',()=>{
 effectsGate();
 const c1=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),base=k=>F0({w:null,...(k?{sets:k}:{})});
 const ad=checkOf(foldArgs([c1],[],'fx-revision-1',base()),LIFT,c1).offers[0];assert.equal(decisionOf(ad).kind,'adopt-baseline');
 const y=acceptOp(ad,{after:1});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=foldArgs([c1],[y],rev,base(2));assert.equal(exOf(EFFECTS.m.foldNativeLoad(a).state).w,60,rev);
  const u=checkOf(a,LIFT,c1,{compensate:decisionOf(ad).spend_id});assert.equal(u.status,'offer',rev+' '+JSON.stringify(u.refusal));
  const ud=decisionOf(u.offers[0]);
  assert.deepEqual([ud.target_load.scalar,ud.target_load.vector,ud.base_load.vector],[null,[null,null,null],Loads(60,60)],rev);
  const g=EFFECTS.m.foldNativeLoad(foldArgs([c1],[y,acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1})],rev,base(2))),gx=exOf(g.state);
  assert.deepEqual([gx.w,gx.sets,gx.native_load_authority.kind,g.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED')],[null,2,'compensated',[]],rev+' '+JSON.stringify(g.issues));
 }
});
test('RESTORE-FORGED R9.10 (green-kept, red by mutant; spec R9.10 L RESTORE COUNT "the RESTORE check is not weakened"): the RESTORE-COUNT Undo re-shaped as round 18 issued it (target 100 projected at the edited count, 2 slots) and re-digested is refused RECORD_INVALID target_load [its Ref]; the adopted 95 stays applied; R1 and R2',()=>{
 effectsGate();
 const L=lowerYes(false),{a,c}=L.args([L.yes],{base:SETS(2)}),u=checkOf(a,LIFT,c,{compensate:L.d.spend_id});assert.equal(u.status,'offer',JSON.stringify(u.refusal));
 const forged=structuredClone(u.offers[0]);decisionOf(forged).target_load.vector=Loads(100,100);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const g=EFFECTS.m.foldNativeLoad(L.args([L.yes,acceptOp(forged,{op_id:'fx-resp-4',after:3})],{rev,base:SETS(2)}).a);
  assert.deepEqual([g.issues.filter(i=>i.code==='NATIVE_LOAD_RECORD_INVALID').map(i=>[i.field,i.refs]),exOf(g.state).w],[[['target_load',[ref('fx-resp-4')]]],95],rev+' '+JSON.stringify(g.issues));
 }
});
// Every compensation body issued with no set-count edit (measured on the dfc4445 product).
const RESTORE_NO_EDIT_PIN='00ab2971f1a908ba65b99de737c7cbe219c2eb7d44c4833a481cb705415ca5f3';
test('RESTORE-NO-EDIT R9.10 (green-kept; spec R9.10 L RESTORE COUNT "with no set-count edit every compensation body is byte-identical to dfc4445"): the Undo offers of an applied adoption (J D-L8F-1), of an applied adopt-baseline, of a queued earn (N02c) and of a pending vector debut at its own count are byte-identical to their dfc4445 bodies and sentences (pinned digest)',()=>{
 effectsGate();
 const out=[];
 const L=lowerYes(false),{a,c}=L.args([L.yes]);out.push(checkOf(a,LIFT,c,{compensate:L.d.spend_id}).offers[0]);
 const c1=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),ad=checkOf(foldArgs([c1],[],'fx-revision-1',F0({w:null})),LIFT,c1).offers[0];
 out.push(checkOf(foldArgs([c1],[acceptOp(ad,{after:1})],'fx-revision-1',F0({w:null})),LIFT,c1,{compensate:decisionOf(ad).spend_id}).offers[0]);
 const s=landingScenario('fx-revision-1');out.push(checkOf(foldArgs(s.cs,[s.resp]),LIFT,s.cs[1],{compensate:decisionOf(s.offer).spend_id}).offers[0]);
 const v=vectorDebut(2);out.push(checkOf(v.a,LIFT,v.cs[1],{compensate:v.spend}).offers[0]);
 assert.ok(out.every(o=>o&&decisionOf(o).kind==='compensate'),JSON.stringify(out.map(o=>!!o)));
 assert.equal(sha(out.map(o=>[decisionOf(o),o.reason])),RESTORE_NO_EDIT_PIN,'byte-identical to the dfc4445 compensation bodies');
});
// J LATER HOLD: the yes to [adopt-observed 95] claiming the missed debut Close C3 (fx-resp-3; applied, w 95), its
// Undo offered then (fx-resp-4, RESTORE-shaped), and C1 corrected afterwards (Q105's accept BASIS_REPAIR_REQUIRED).
function laterHold(v1=false){
 const m=missedDebut(95),c3=v1?v1Of(m.c3):m.c3,cap=a=>{if(v1)captureOn(a.generation,c3,[105,105,105]);return a;};
 const at=(cs,extra,rev='fx-revision-1',more=[])=>cap(foldArgs([...cs,c3,...more],[m.resp,...extra],rev));
 const exit=checkOf(at(m.cs,[]),LIFT,c3).offers[0],d=decisionOf(exit),yes=acceptOp(exit,{op_id:'fx-resp-3',after:3});
 const u=checkOf(at(m.cs,[yes]),LIFT,c3,{compensate:d.spend_id});assert.equal(u.status,'offer','control: the Undo is offered before the correction '+JSON.stringify(u.refusal));
 const undo=acceptOp(u.offers[0],{op_id:'fx-resp-4',after:3}),fixed=[C(1,{reps:TOP,effort:e(2,1,1),corrected:{3:7}}),m.cs[1]];
 return {m,c3,d,yes,undo,ud:decisionOf(u.offers[0]),fixed,at};
}
// L12-B4 (Astra L12; mutant L12-M12, held-back consumes -> [] at native-load-effects.cjs:749): the held-back claimed yes keeps
// its whole spend record (spec :123 context.spent/Fold.spent transport, LATER HOLD conservation): consumes exactly [C3's root]
// in the decision, in Fold.spent and in Fold.coverage.
function keptRoot(f,h,label){
 const root=[JSON.stringify([h.c3.start,LIFT,h.c3.close])],x=f.spent.find(y=>y.spend_id===h.d.spend_id),c=f.coverage.find(y=>y.spend_id===h.d.spend_id);
 assert.deepEqual([h.d.consumes,x&&x.consumes,c&&c.consumes],[root,root,root],label+' the kept spend record');
}
// STOP-R19-1 (named for the PM in the round-19 report): L's row text says that with the recorded Undo the fold "issues
// exactly BASIS_REPAIR_REQUIRED [Q105 response Ref] and TARGET_QUEUED [95 response Ref]". L's mechanism holds the 95 yes
// back through held.set (FC03:527 entryOf and the held book), and the fold resolves a held-back issue when its spend is
// cancelled (as for every HELD_BACK record since round 8, R17-ANCHOR-LEGACY-LATER), so measured: TARGET_QUEUED [fx-resp-3]
// stands without the Undo and is resolved by it. This row pins the measured lists; the PM confirms which the spec means.
test('N29-LATER-HOLD-UNDO R9.10 (spec R9.10 L LATER HOLD UNDO, D-R9.9-LATER-HOLD-UNDO, DECISIONS:804; J LATER HOLD; STOP-R19-1 on the issue list): with no Undo the fold issues exactly BASIS_REPAIR_REQUIRED [the Q105 yes Ref] and TARGET_QUEUED [the 95 yes Ref] with the 95 spend kept as its whole record (Fold.spent and Fold.coverage both carry consumes [C3], L12-B4); with the recorded Undo there is no RECORD_INVALID, the Undo cancels the kept spend and resolves its held-back TARGET_QUEUED issue, BASIS_REPAIR_REQUIRED is the only hold, w 100, Q105 pending and hidden (the baseline ask); exit (b) on C4 on the baseline ask offers [adopt-baseline 95] as J; R1 and R2',()=>{
 effectsGate();
 const h=laterHold(),c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:null,effort:e(2,1,1)});
 const listed=f=>f.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>[i.code,(i.refs||[]).map(r=>r.op_id)]);
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f0=EFFECTS.m.foldNativeLoad(h.at(h.fixed,[h.yes],rev));
  assert.deepEqual([listed(f0),!!f0.spent.find(y=>y.spend_id===h.d.spend_id&&!y.cancelled_by)],[[['NATIVE_LOAD_BASIS_REPAIR_REQUIRED',['fx-resp-1']],['NATIVE_LOAD_TARGET_QUEUED',['fx-resp-3']]],true],rev+' without the Undo');
  assert.deepEqual(EFFECTS.m.heldProjection(f0).issues.map(i=>i.code),['NATIVE_LOAD_BASIS_REPAIR_REQUIRED'],rev+' TARGET_QUEUED keeps its code and is not a hold (HOLD_CODES unchanged)');
  keptRoot(f0,h,rev+' without the Undo');
  const f=EFFECTS.m.foldNativeLoad(h.at(h.fixed,[h.yes,h.undo],rev)),label=rev+' '+JSON.stringify(f.issues.map(i=>[i.code,i.field,(i.refs||[]).map(r=>r.op_id)]));
  assert.deepEqual(listed(f),[['NATIVE_LOAD_BASIS_REPAIR_REQUIRED',['fx-resp-1']]],label);
  assert.deepEqual(recordInvalid(f),[],label);
  assert.deepEqual(EFFECTS.m.heldProjection(f).issues.map(i=>[i.code,i.refs]),[['NATIVE_LOAD_BASIS_REPAIR_REQUIRED',[ref('fx-resp-1')]]],label);
  const x=f.spent.find(y=>y.spend_id===h.d.spend_id);
  assert.ok(x&&x.cancelled_by===h.ud.spend_id,label+' the 95 spend is kept and cancelled by its Undo');
  keptRoot(f,h,label+' with the Undo');
  assert.deepEqual([exOf(f.state).w,liveQ(f,h.m.spend),cardLoads(EFFECTS.m.heldProjection(f).state)],[100,[[false,'DEBUT']],[null,null,null]],label);
  const ev=checkOf(h.at(h.fixed,[h.yes,h.undo],rev,[c4]),LIFT,c4);assert.equal(ev.status,'offer',rev+' '+JSON.stringify(ev.refusal));
  assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',95]],rev);
 }
});
test('N29-LATER-HOLD-EXIT-A R9.10 (spec R9.10 L LATER HOLD UNDO, exit (a)): with no Undo recorded, the check offers the Undo of the held-back 95 yes (a RETIRE: it never applied in this projection, so it writes no weight) and its yes cancels the spend with w 100 and no RECORD_INVALID; once a Start captured 95 after that yes (C4 on the 95 card), the Undo refuses COMPENSATION_DESCENDANTS [its Ref]; R1 and R2',()=>{
 effectsGate();
 const h=laterHold(),c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:95,effort:e(2,1,1)});
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const a=h.at(h.fixed,[h.yes],rev),u=checkOf(a,LIFT,h.c3,{compensate:h.d.spend_id});assert.equal(u.status,'offer',rev+' '+JSON.stringify(u.refusal));
  const ud=decisionOf(u.offers[0]);assert.deepEqual([ud.target_load,ud.base_load.vector],[{scalar:lb(100),vector:Loads(100,100,100)},Loads(100,100,100)],rev+' RETIRE-shaped');
  const g=EFFECTS.m.foldNativeLoad(h.at(h.fixed,[h.yes,acceptOp(u.offers[0],{op_id:'fx-resp-5',after:3})],rev));
  assert.deepEqual([exOf(g.state).w,recordInvalid(g),!!(g.spent.find(y=>y.spend_id===h.d.spend_id)||{}).cancelled_by],[100,[],true],rev+' '+JSON.stringify(g.issues));
  expectRefusal(checkOf(h.at(h.fixed,[h.yes],rev,[c4]),LIFT,c4,{compensate:h.d.spend_id}),'COMPENSATION_DESCENDANTS',[ref('fx-resp-3')]);
 }
});
// STOP-R19-2 (named for the PM in the round-19 report): L LATER HOLD UNDO names the C3 refusal SOURCE_OVERLAP [C3 Close
// Ref] (host v1) and PLAN_CHANGED "as at dfc4445" (typed v2). Measured: FC01 on the held projection refuses C3 so (v1:
// SOURCE_OVERLAP, C3 now spent), but the unchanged exit (b) of FC03 checkNativeLoad answers any refusal it does not pass
// through with the hold's own refusal, so both slot kinds refuse BASIS_REPAIR_REQUIRED [the Q105 yes Ref]; dfc4445 also
// refused typed v2 so, and offered host v1 [adopt-baseline 95]. This row pins what R9.10 fixes (no offer on C3, the
// kept spend) and leaves the refusal's name to the PM; no FC03 exit (b) byte is in L's scope.
// DECISIONS:807 ruled it: the measured refusal stands; round 20 pins its code, refs and field (D-R19-C3-CODE).
test('N29-LATER-HOLD-C3 R9.10 (spec R9.10 L LATER HOLD UNDO, J LATER HOLD exit (b); STOP-R19-2 on the refusal name, ruled at DECISIONS:807, D-R19-C3-CODE): C3 is spent by the kept 95 yes (its whole record kept, L12-B4), so exit (b) never adopts it: on host v1 and typed v2 slots the check on C3 refuses exactly BASIS_REPAIR_REQUIRED [the Q105 yes Ref], field null, and offers nothing (dfc4445 offered host v1 [adopt-baseline 95]); C4 on the baseline ask is offered [adopt-baseline 95] as J; R1 and R2',()=>{
 effectsGate();
 const c4=C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:null,effort:e(2,1,1)});
 for(const v1 of [false,true]){
  const h=laterHold(v1);
  for(const rev of ['fx-revision-1','fx-revision-2']){
   const label=(v1?'v1 ':'v2 ')+rev,c3v=checkOf(h.at(h.fixed,[h.yes],rev),LIFT,h.c3);
   assert.deepEqual([c3v.status,c3v.offers],['refused',[]],label+' '+JSON.stringify(c3v.refusal));
   // D-R19-C3-CODE (DECISIONS:807): the hold's own refusal, BASIS_REPAIR_REQUIRED [the Q105 yes Ref], field null.
   assert.deepEqual([h.m.resp.op_id,c3v.refusal],['fx-resp-1',{code:'NATIVE_LOAD_BASIS_REPAIR_REQUIRED',refs:[ref('fx-resp-1')],field:null}],label);
   keptRoot(EFFECTS.m.foldNativeLoad(h.at(h.fixed,[h.yes],rev)),h,label);
   const ev=checkOf(h.at(h.fixed,[h.yes],rev,[c4]),LIFT,c4);assert.equal(ev.status,'offer',label+' '+JSON.stringify(ev.refusal));
   assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',95]],label);
  }
 }
});
test('N29-LATER-HOLD-REVERT R9.10 (green-kept; spec R9.10 L LATER HOLD UNDO): the correction reverted, Q105 is consumed MISSED again and the 95 yes applies as written (w 95, authority adopted); with its Undo recorded, w 100 and the prior image (authority compensated); no issue; R1 and R2',()=>{
 effectsGate();
 const h=laterHold();
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(h.at(h.m.cs,[h.yes],rev)),g=EFFECTS.m.foldNativeLoad(h.at(h.m.cs,[h.yes,h.undo],rev));
  const quiet=x=>x.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED');
  assert.deepEqual([exOf(f.state).w,exOf(f.state).native_load_authority.kind,liveQ(f,h.m.spend),quiet(f)],[95,'adopted',[[true,'MISSED']],[]],rev);
  assert.deepEqual([exOf(g.state).w,exOf(g.state).native_load_authority.kind,liveQ(g,h.m.spend),quiet(g)],[100,'compensated',[[true,'MISSED']],[]],rev);
 }
});
test('LATER-HOLD-SCOPE R9.10 (green-kept, red by mutant; spec R9.10 L LATER HOLD UNDO "any other TARGET_QUEUED refusal keeps today\'s rule"): Q105 accepted at the C1, C2 cut on this device; device B, which had not received that yes, trained C3 at 95 on the 100 card and recorded the unclaimed [adopt-observed 95] its own check offered (authority_refs []); in the merged log that record meets TARGET_QUEUED (Q105 pending, C3 is not its card): the issue names its Ref, the record is not in the spend index, w stays 100 and Q105 stays pending; R1 and R2',()=>{
 effectsGate();
 const {cs,resp}=landingScenario('fx-revision-1'),c3=C(3,{date:'2026-10-12',reps:TOP,loads:95,prescribed:100,effort:e(2,1,1)});
 const o=checkOf(foldArgs([...cs,c3],[]),LIFT,c3).offers[0],d=decisionOf(o);
 assert.deepEqual([d.kind,d.basis.load_basis.authority_refs],['adopt-observed',[]],'control: device B\'s own unclaimed offer');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([...cs,c3],[resp,{...acceptOp(o,{op_id:'fx-resp-B',after:3}),device:'fx-device-B'}],rev));
  const mine=f.issues.filter(i=>(i.refs||[]).some(r=>r.op_id==='fx-resp-B')&&i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code);
  assert.deepEqual([mine,f.spent.some(x=>x.spend_id===d.spend_id),exOf(f.state).w,liveQ(f,decisionOf(landingScenario('fx-revision-1').offer).spend_id)],
   [['NATIVE_LOAD_TARGET_QUEUED'],false,100,[[false,'DEBUT']]],rev+' '+JSON.stringify(f.issues));
 }
});

// ======================================================================
// ROUND 20 part B1: spec R9.11 section M (origin/rebuild/c-native-load-spec d91e4df, rebuild/coach/NATIVE-LOAD-SPEC.md),
// FC01 clause (3) SCALAR ADOPTION OVER A NULL VECTOR (:150): in transition()'s adoption branch, after the scalar write, a
// PRESENT null wSets is removed (the prior image is taken first, unchanged). Without it, an exit issued on the held projection
// (w null, wSets null) and then undone leaves wSets present-null, and the next adopt-baseline yes leaves a numeric w over it:
// W/engine-capture.cjs:80-82 then refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED for the whole day (M SECOND TRAP).
// M (1)/(1b), the dissolved-hold exit, is NOT built in this part (it waits for R9.12 rev 3 review).
// ======================================================================
// M (m) fixture: Q105 accepted at base 100 (fx-resp-1); the base re-admitted at 97.5 with no ordering op holds it
// EFFECT_CONFLICT load_basis; C3 on the baseline ask at 60 on every set, proven after the hold; its exit (b) yes and the
// exit's Undo (RESTORE: base 60, target null); the base does not return. C4 on the baseline ask at 60 on every set.
function b39Control(v1=false){
 const {cs,resp,offer}=landingScenario('fx-revision-1'),spend=decisionOf(offer).spend_id;
 const mk=(n,date)=>{const c=C(n,{date,reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)});return v1?v1Of(c):c;};
 const c3=mk(3,'2026-10-12'),c4=mk(4,'2026-10-15');
 const at=(more,extra,rev='fx-revision-1')=>{const a=foldArgs([...cs,c3,...more],[resp,...extra],rev,F0({w:97.5}));if(v1)for(const c of [c3,...more])captureOn(a.generation,c,[null,null,null]);return a;};
 const ev3=checkOf(at([],[]),LIFT,c3);assert.equal(ev3.status,'offer','control: exit (b) on C3 '+JSON.stringify(ev3.refusal));
 const xd=decisionOf(ev3.offers[0]);
 assert.deepEqual([ev3.offers.length,xd.kind,xd.target_load.scalar.value,xd.basis.load_basis.authority_refs],[1,'adopt-baseline',60,[ref('fx-resp-1')]],'control: the exit names the Q105 yes');
 const exit=acceptOp(ev3.offers[0],{op_id:'fx-exit',after:3});
 const u=checkOf(at([],[exit]),LIFT,c3,{compensate:xd.spend_id});assert.equal(u.status,'offer',"control: the exit's Undo "+JSON.stringify(u.refusal));
 const ud=decisionOf(u.offers[0]);assert.deepEqual([ud.base_load.scalar,ud.target_load.scalar],[lb(60),null],'control: a RESTORE (base 60, target null)');
 const undo=acceptOp(u.offers[0],{op_id:'fx-undo',after:3});
 return {spend,c3,c4,xd,ud,exit,undo,at};
}
const b39Card=state=>{try{return cardLoads(state);}catch(err){return String(err&&err.code||err);}};
test("N27-B39-CONTROL R9.11 (spec R9.11 M (m), FC01 clause (3); green-kept through C4's yes, red on 189d076 at the next capture by the SECOND TRAP): Q105 accepted at base 100, the base re-admitted at 97.5 (EFFECT_CONFLICT load_basis), C3 on the baseline ask at 60, its exit yes and the exit's Undo, no return -> Q105 done/SUPERSEDED with its spend kept, the exit cancelled by its Undo, w null over wSets null, no active hold, the next card the baseline ask; C4 at 60 on every set offers [adopt-baseline 60]; its yes writes w 60 and REMOVES wSets (:150), and the next Start captures [60,60,60]; typed v2 and host v1, R1 and R2",()=>{
 effectsGate();
 for(const v1 of [false,true]){
  const s=b39Control(v1);
  for(const rev of ['fx-revision-1','fx-revision-2']){
   const label=(v1?'v1 ':'v2 ')+rev,f=EFFECTS.m.foldNativeLoad(s.at([],[s.exit,s.undo],rev)),ex=exOf(f.state);
   const active=f.issues.filter(i=>i.lift===LIFT&&EFFECTS.m.isHold(i)&&!i.superseded_by).map(i=>i.code);
   assert.deepEqual([ex.w,Object.hasOwn(ex,'wSets'),ex.wSets,liveQ(f,s.spend),active,ex.native_load_authority&&ex.native_load_authority.kind],[null,true,null,[[true,'SUPERSEDED']],[],'compensated'],label+' after the Undo '+JSON.stringify(f.issues));
   assert.ok(f.spent.some(x=>x.spend_id===s.spend&&!x.cancelled_by),label+' the Q105 spend is kept');
   assert.equal((f.spent.find(x=>x.spend_id===s.xd.spend_id)||{}).cancelled_by,s.ud.spend_id,label+' the exit is cancelled by its Undo');
   assert.deepEqual(b39Card(EFFECTS.m.heldProjection(f).state),[null,null,null],label+' the next card is the baseline ask, and it captures');
   const ev=checkOf(s.at([s.c4],[s.exit,s.undo],rev),LIFT,s.c4);assert.equal(ev.status,'offer',label+' '+JSON.stringify(ev.refusal));
   assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',60]],label);
   const g=EFFECTS.m.foldNativeLoad(s.at([s.c4],[s.exit,s.undo,acceptOp(ev.offers[0],{op_id:'fx-resp-c4',after:4})],rev)),gx=exOf(g.state);
   assert.deepEqual([gx.w,gx.native_load_authority&&gx.native_load_authority.kind],[60,'adopted'],label+" C4's yes "+JSON.stringify(g.issues));
   assert.deepEqual(b39Card(EFFECTS.m.heldProjection(g).state),[60,60,60],label+' the next Start captures 60 on every set');
   assert.equal(Object.hasOwn(gx,'wSets'),false,label+' no wSets key after the scalar adoption (:150)');
  }
 }
});
// N27-B39-NULL-VECTOR fixture (M SECOND TRAP alone, on another hold): base w null; C1 on the baseline ask at 60 and its
// adopt-baseline yes (fx-resp-1, applied w 60); C1's last set corrected 8 -> 7 after the yes -> BASIS_REPAIR_REQUIRED holds
// fx-press (N27 (d)); C2 on the baseline ask at 65, proven after the hold: its exit (b) yes and the exit's Undo (target null);
// C3 on the baseline ask at 65: [adopt-baseline 65] and its yes.
function b39NullVector(v1=false){
 const base=()=>F0({w:null}),c1=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)});
 const ab=checkOf(foldArgs([c1],[],'fx-revision-1',base()),LIFT,c1).offers[0];assert.equal(decisionOf(ab).kind,'adopt-baseline','control: C1 is offered the baseline adoption');
 const yes=acceptOp(ab,{op_id:'fx-resp-1',after:1}),c1x=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1),corrected:{3:7}});
 const mk=n=>{const c=C(n,{reps:TOP,loads:65,prescribed:null,effort:e(2,1,1)});return v1?v1Of(c):c;},c2=mk(2),c3=mk(3);
 const at=(more,extra,rev='fx-revision-1')=>{const a=foldArgs([c1x,...more],[yes,...extra],rev,base());if(v1)for(const c of more)captureOn(a.generation,c,[null,null,null]);return a;};
 const f0=EFFECTS.m.foldNativeLoad(at([],[]));
 assert.ok(f0.issues.some(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED'&&i.lift===LIFT&&!i.superseded_by),'control: the correction holds fx-press '+JSON.stringify(f0.issues));
 const ev2=checkOf(at([c2],[]),LIFT,c2);assert.equal(ev2.status,'offer','control: exit (b) on C2 '+JSON.stringify(ev2.refusal));
 const xd=decisionOf(ev2.offers[0]);assert.deepEqual([ev2.offers.length,xd.kind,xd.target_load.scalar.value],[1,'adopt-baseline',65],'control: the exit');
 const exit=acceptOp(ev2.offers[0],{op_id:'fx-exit',after:2});
 const u=checkOf(at([c2],[exit]),LIFT,c2,{compensate:xd.spend_id});assert.equal(u.status,'offer',"control: the exit's Undo "+JSON.stringify(u.refusal));
 const ud=decisionOf(u.offers[0]);assert.equal(ud.target_load.scalar,null,'control: the Undo targets null');
 const undo=acceptOp(u.offers[0],{op_id:'fx-undo',after:2});
 return {c2,c3,xd,ud,exit,undo,at};
}
test("N27-B39-NULL-VECTOR R9.11 (spec R9.11 M SECOND TRAP, FC01 clause (3); red on 189d076): a hold (here BASIS_REPAIR_REQUIRED), its exit and the exit's Undo leave w null over a PRESENT null wSets (the exit was issued and applied on the held projection); C3 on the baseline ask at 65 offers [adopt-baseline 65]; after its yes the stored exercise has w 65 and NO wSets key (its prior image, taken first, still records the present null wSets), and the next Start captures [65,65,65] through cardLoads (on 189d076: w 65 over wSets null, ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED); typed v2 and host v1, R1 and R2",()=>{
 effectsGate();
 for(const v1 of [false,true]){
  const s=b39NullVector(v1);
  for(const rev of ['fx-revision-1','fx-revision-2']){
   const label=(v1?'v1 ':'v2 ')+rev,f=EFFECTS.m.foldNativeLoad(s.at([s.c2],[s.exit,s.undo],rev)),ex=exOf(f.state);
   assert.deepEqual([ex.w,Object.hasOwn(ex,'wSets'),ex.wSets],[null,true,null],label+' the precondition: w null over a present null wSets '+JSON.stringify(f.issues));
   assert.equal((f.spent.find(x=>x.spend_id===s.xd.spend_id)||{}).cancelled_by,s.ud.spend_id,label+' the exit is cancelled by its Undo');
   const ev=checkOf(s.at([s.c2,s.c3],[s.exit,s.undo],rev),LIFT,s.c3);assert.equal(ev.status,'offer',label+' '+JSON.stringify(ev.refusal));
   assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',65]],label);
   const g=EFFECTS.m.foldNativeLoad(s.at([s.c2,s.c3],[s.exit,s.undo,acceptOp(ev.offers[0],{op_id:'fx-resp-c3',after:3})],rev)),gx=exOf(g.state);
   assert.equal(gx.w,65,label+' '+JSON.stringify(g.issues));
   assert.equal(Object.hasOwn(gx,'wSets'),false,label+' no wSets key after the scalar adoption (:150)');
   assert.deepEqual(b39Card(EFFECTS.m.heldProjection(g).state),[65,65,65],label+' the next Start captures 65 on every set');
   assert.deepEqual(gx.native_load_authority&&gx.native_load_authority.prior&&gx.native_load_authority.prior.wSets,{present:true,value:null},label+' the prior image is taken before the removal');
  }
 }
});
// ======================================================================
// ROUND 20 PART B2: spec R9.11 section M (1), (1b) and the R9.12 revision-3 rows (rebuild/coach/NATIVE-LOAD-SPEC.md
// sha256 cef5ade5..., M R9.12; Fable REVIEW-NATIVE-LOAD-SPEC-R12-l3 ACCEPT, debts D-R12L3-1..4; PM ruling STOP-R912-1/-2,
// option (C)). FC03 builds the dissolved-hold exit (M (1), ONE ANCHOR: the Start of the latest consumed completion ranked
// by facts.order) and correspondence's arm (ii) (1b); no witness. A ref that no hold ever named passes the same test:
// RESIDUAL (iv) (:157), which the guarded host never issues (N28-HOST-NO-NEVER-HELD, FA03; walk I17).
// ======================================================================
const R1='fx-revision-1',R2='fx-revision-2';
// The lift's issues as [code, field, refs, active|sup] (the R2-only PRODUCER_REVISION_ABSENT_APPLIED note left out).
const b2Issues=(f,lift=LIFT)=>f.issues.filter(i=>i.lift===lift&&i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>[i.code.replace('NATIVE_LOAD_',''),i.field,(i.refs||[]).map(r=>r.op_id),i.superseded_by?'sup':'act']);
const b2Active=(f,lift=LIFT)=>b2Issues(f,lift).filter(x=>x[3]==='act');
const b2Out=(f,spend)=>{const ex=exOf(f.state),x=f.spent.find(y=>y.spend_id===spend);
 return {w:ex.w,wSets:Object.hasOwn(ex,'wSets')?ex.wSets:'absent',inSpent:!!x,cancelled:!!(x&&x.cancelled_by),issues:b2Issues(f),card:b39Card(EFFECTS.m.heldProjection(f).state)};};
// Every observable R1 = R2 compares (N28-B5-R1R2-PARITY): w, wSets presence and value, the spend index with its
// cancellations, active and superseded issues, and the next card through the real capture.
const b2Norm=f=>JSON.stringify({...b2Out(f,null),inSpent:undefined,cancelled:undefined,spent:f.spent.map(x=>[x.spend_id,x.cancelled_by]).sort(),issues:b2Issues(f).map(x=>JSON.stringify(x)).sort()});
// Spec R9.11 INVARIANT (:158, M N27-B39-INVARIANT): no registered projection carries a visible unfinished native entry
// of a lift whose w is null or ABSENT; no programme carries a numeric w over a present-null wSets; the next day prepares
// through the real capture (the whole day, every lift of it).
function b2Invariant(f,label,lifts=[LIFT]){
 const hp=EFFECTS.m.heldProjection(f).state;
 for(const L of lifts){const ex=hp.exercises.find(x=>x.id===L),pe=f.state.exercises.find(x=>x.id===L);
  assert.ok(!(ex.w==null&&hp.queue.some(q=>q&&q.exId===L&&!q.done&&typeof q.native_load_spend==='string')),label+' INVARIANT: a visible unfinished native entry of '+L+' over w null or absent');
  assert.ok(!(typeof pe.w==='number'&&Object.hasOwn(pe,'wSets')&&pe.wSets===null),label+' INVARIANT: '+L+' carries a numeric w over a present-null wSets');}
 const c=b39Card(hp);assert.ok(Array.isArray(c),label+' INVARIANT: the next day does not prepare through the real capture: '+c);
}
// L12-B5 fixture (spec M R9.12 L12-B5 INPUT, Astra verbatim; invented numbers): base 100; C1 captures 100 and performs 105,
// y1 [adopt-observed 105] (l12-y1), C1 typed v2 or host v1 (its card on the Start capture); C2 (host v1, as the input states)
// captures and performs 105 after y1; a replay over an unordered base 102.5 holds y1 EFFECT_CONFLICT load_basis; the check on C2 offers the exit
// [adopt-baseline 105] naming [y1's response Ref] and y2 (l12-y2) accepts; y2's genuine Undo (target null on three original
// slots) is issued at base 102.5 (l12-undo); 'at' folds any extras over the base w given (102.5, or 100 after the return).
function b5Fixture(v1=false){
 const c1t=C(1,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)}),c1=v1?v1Of(c1t):c1t,a1=foldArgs([c1],[]);if(v1)captureOn(a1.generation,c1,[100,100,100]);
 const o1=checkOf(a1,LIFT,c1);assert.equal(o1.status,'offer','control: C1 '+JSON.stringify(o1.refusal));
 assert.deepEqual(o1.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-observed',105]],'control: y1 is [adopt-observed 105]');
 const y1=acceptOp(o1.offers[0],{op_id:'l12-y1',after:1}),y1spend=decisionOf(o1.offers[0]).spend_id;
 const c2=v1Of(C(2,{date:'2026-10-08',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)}));
 const at=(extra,baseW=102.5,rev=R1,pre=[],more=[])=>{const a=foldArgs([c1,c2,...more],[y1,...pre,...extra],rev,F0({w:baseW}));
  if(v1)captureOn(a.generation,c1,[100,100,100]);for(const c of [c2,...more])captureOn(a.generation,c,[105,105,105]);return a;};
 const f0=EFFECTS.m.foldNativeLoad(at([]));
 assert.deepEqual(b2Active(f0),[['EFFECT_CONFLICT','load_basis',['l12-y1'],'act']],'control: base 102.5 holds y1');
 const ev=checkOf(at([]),LIFT,c2);assert.equal(ev.status,'offer','control: the exit on C2 '+JSON.stringify(ev.refusal));
 const xd=decisionOf(ev.offers[0]);
 assert.deepEqual([ev.offers.length,xd.kind,xd.target_load.scalar.value,xd.basis.load_basis.authority_refs],[1,'adopt-baseline',105,[ref('l12-y1')]],'control: the exit names [y1 response Ref]');
 const y2=acceptOp(ev.offers[0],{op_id:'l12-y2',after:2});
 const u=checkOf(at([y2]),LIFT,c2,{compensate:xd.spend_id});assert.equal(u.status,'offer',"control: y2's Undo at base 102.5 "+JSON.stringify(u.refusal));
 const ud=decisionOf(u.offers[0]);
 assert.deepEqual([ud.target_load.scalar,ud.target_load.vector],[null,[null,null,null]],"control: y2's Undo targets null on three original slots");
 const undoA=acceptOp(u.offers[0],{op_id:'l12-undo',after:2}),dup={...acceptOp(ev.offers[0],{op_id:'l12-y2-copy',after:2}),device:'fx-device-B'};
 const probe=(ar,op='l12-y2p')=>{const o=structuredClone(ev.offers[0]);decisionOf(o).basis.load_basis.authority_refs=ar;return acceptOp(o,{op_id:op,after:2});};
 return {c1,c2,o1,y1,y1spend,y2,undoA,dup,xd,ud,offer:ev.offers[0],at,probe,spend:xd.spend_id,v1};
}
// Order (B): the base returns first, then the check issues y2's Undo on the applied exit and it is accepted.
function b5OrderB(s,rev,strict=true){
 const uB=checkOf(s.at([s.y2],100,rev),LIFT,s.c2,{compensate:s.spend});
 if(!strict&&uB.status!=='offer')return {refused:uB.refusal.code+':'+uB.refusal.field};
 assert.equal(uB.status,'offer',(s.v1?'v1 ':'v2 ')+rev+' order (B): the Undo of the applied exit '+JSON.stringify(uB.refusal));
 const dB=decisionOf(uB.offers[0]);
 assert.deepEqual([dB.target_load.vector,dB.base_load.vector.map(v=>v&&v.value)],[[null,null,null],[105,105,105]],(s.v1?'v1 ':'v2 ')+rev+' order (B): RESTORE, base 105 x3, target null x3');
 return acceptOp(uB.offers[0],{op_id:'l12-undoB',after:2});
}
// The variants of N28-B5-ASTRA and N28-B5-NO-UNDO, each a fold of the L12-B5 log.
function b5Variants(s,rev,strict=true){
 return [['order (A) at base 102.5',()=>s.at([s.y2,s.undoA],102.5,rev)],['order (A) after the return',()=>s.at([s.y2,s.undoA],100,rev)],
  ['order (A) with a duplicate y2 on device B, after the return',()=>s.at([s.y2,s.dup,s.undoA],100,rev)],['order (B)',()=>{const u=b5OrderB(s,rev,strict);return u.refused?u:s.at([s.y2,u],100,rev);}],
  ['no Undo at base 102.5',()=>s.at([s.y2],102.5,rev)],['no Undo after the return',()=>s.at([s.y2],100,rev)]];
}
test('N28-B5-ASTRA R9.12 (spec M R9.12 NEW RED-FIRST ROWS, ACCEPTED END STATE; Astra L12-B5; red on 189d076 and on the part-B1 product): the L12-B5 input in both delivery orders. Order (A) (Astra\'s): y2\'s Undo recorded at base 102.5, then the base returns to 100; order (B): the base returns first, then the check issues y2\'s Undo on the applied exit (RESTORE, base 105, target null on three original slots) and it is accepted; variant (D-R12L1-3): a duplicate y2 accepted again on device B, order (A). Every one -> w null, wSets null, y2 in spent with cancelled=true, no active issue of fx-press, the next card the baseline ask through the real capture (on 189d076 and part B1, after the return: RECORD_INVALID base_load [y2] and compensates [Undo], y2 absent from spent, stored w 105; order (B): RECORD_INVALID base_load, no Undo issuable); C1 typed v2 or host v1 (C2 host v1, as the input states), R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b5Fixture(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   for(const [name,args] of b5Variants(s,rev).slice(0,4)){
    const f=EFFECTS.m.foldNativeLoad(args()),o=b2Out(f,s.spend);
    assert.deepEqual([o.w,o.wSets,o.inSpent,o.cancelled,b2Active(f),o.card],[null,null,true,true,[],[null,null,null]],L+' '+name+' '+JSON.stringify(f.issues));
    assert.ok(f.spent.some(x=>x.spend_id===s.y1spend&&!x.cancelled_by),L+' '+name+": y1's spend is kept");
    b2Invariant(f,L+' '+name);
   }
  }
 }
});
test('N28-B5-NO-UNDO R9.12 (spec M R9.12 NEW RED-FIRST ROWS; red on 189d076 and on the part-B1 product after the return): the L12-B5 input without the Undo. At base 102.5 y2 applies as exit (b) and supersedes y1\'s EFFECT_CONFLICT; after the return y1 applies and y2 applies as M (1)\'s dissolved-hold exit, replacing y1\'s weight for the lift with y1\'s spend kept. Both -> w 105, wSets absent, y2 applied, no active issue, the next card 105 on every set, and y2\'s Undo offered because no later Start captured it (:154) (on 189d076 and part B1 after the return: RECORD_INVALID base_load [y2], y2 absent from spent, w 105 from y1 with the lift held, the card the baseline ask); C1 typed v2 or host v1 (C2 host v1, as the input states), R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b5Fixture(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   for(const bw of [102.5,100]){
    const f=EFFECTS.m.foldNativeLoad(s.at([s.y2],bw,rev)),o=b2Out(f,s.spend),ex=exOf(f.state);
    assert.deepEqual([o.w,o.wSets,o.inSpent,o.cancelled,b2Active(f),o.card],[105,'absent',true,false,[],[105,105,105]],L+' base '+bw+' '+JSON.stringify(f.issues));
    assert.deepEqual(o.issues,bw===102.5?[['EFFECT_CONFLICT','load_basis',['l12-y1'],'sup']]:[],L+' base '+bw+': y1\'s hold superseded at 102.5; no issue after the return');
    assert.deepEqual([ex.native_load_authority&&ex.native_load_authority.kind,ex.native_load_authority&&ex.native_load_authority.spend_id],['adopted',s.spend],L+' base '+bw+': the exit is the lift\'s authority');
    assert.ok(f.spent.some(x=>x.spend_id===s.y1spend&&!x.cancelled_by),L+' base '+bw+": y1's spend is kept");
    const u=checkOf(s.at([s.y2],bw,rev),LIFT,s.c2,{compensate:s.spend});
    assert.equal(u.status,'offer',L+' base '+bw+": y2's Undo is offered (no later Start captured it) "+JSON.stringify(u.refusal));
    b2Invariant(f,L+' base '+bw);
   }
  }
 }
});
test('N28-B5-R1R2-PARITY R9.12 (spec M R9.12 NEW RED-FIRST ROWS, WHY R1 = R2 NEEDS (1b); GREEN on 189d076 as an equality, not red-first; kills mutant (iv) and a build of M (1) without (1b)): every N28-B5-ASTRA and N28-B5-NO-UNDO variant folds byte-equal under R1 and R2 (w, wSets presence and value, the spend index with its cancellations, active and superseded issues, the next card), C1 typed v2 or host v1 (C2 host v1). The path R1 takes per variant is measured by the builder (report, round 20 part B2)',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b5Fixture(v1);
  const one=rev=>b5Variants(s,rev,false).map(([name,args])=>{const a=args();return [name,a.refused?'the Undo is refused '+a.refused:b2Norm(EFFECTS.m.foldNativeLoad(a))];});
  assert.deepEqual(one(R1),one(R2),(v1?'v1':'v2')+': R1 = R2 on every variant');
 }
});
// GREEN-KEPT PROBES (spec M R9.12): the L12-B5 input after the return, no Undo; y2's load_basis.authority_refs replaced and
// the body re-digested as a synthetic local record (l12-y2p). Each -> RECORD_INVALID base_load [l12-y2p], absent from spent,
// w 105 from y1 (still its applied authority), under R1 and R2 with typed v2 and host v1.
function b5Probe(s,rev,ar,{pre=[],label,mod=a=>a}){
 const f=EFFECTS.m.foldNativeLoad(mod(s.at([s.probe(ar)],100,rev,pre))),ex=exOf(f.state);
 assert.deepEqual(b2Active(f),[['RECORD_INVALID','base_load',['l12-y2p'],'act']],label+' '+JSON.stringify(f.issues));
 assert.equal(f.spent.some(x=>x.spend_id===s.spend),false,label+': the probe is absent from spent');
 assert.deepEqual([ex.w,ex.native_load_authority&&ex.native_load_authority.kind,ex.native_load_authority&&ex.native_load_authority.spend_id],[105,'adopted',s.y1spend],label+': w 105 from y1; the probe adopts nothing');
 return f;
}
test('N28-B5-FORGED-REF R9.12 (green-kept, killed by mutant (v); spec M R9.12 GREEN-KEPT PROBES): a ref whose op_id is not in the log, and a ref to y1\'s op with a commitment that does not match it (authentic fails) -> RECORD_INVALID base_load [l12-y2p], absent from spent, w 105 from y1; C1 typed v2 or host v1 (C2 host v1, as the input states), R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b5Fixture(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   b5Probe(s,rev,[ref('fx-ghost')],{label:L+' absent op'});
   b5Probe(s,rev,[{op_id:'l12-y1',commitment:commit('fx-other')}],{label:L+' wrong commitment'});
  }
 }
});
test('N28-B5-WRONG-LIFT R9.12 (green-kept, killed by mutant (iii); spec M R9.12 GREEN-KEPT PROBES): F0 plus fx-row; C1 lifts both at 105 on the 100 card; yL [adopt-observed 105] on fx-press (l12-y1) and yR on fx-row (l12-yR); C2 on fx-press at 105; the genuine exit at base 102.5 names [l12-y1]; re-shaped to name fx-row\'s yes (proven before C2\'s Start, named by no hold) -> RECORD_INVALID base_load [l12-y2p] after the return, absent from spent, w 105 from yL; C1 typed v2 or host v1 (C2 host v1), R1 and R2',()=>{
 effectsGate();
 const rowBase=w=>withRow({w});
 for(const v1 of [false,true]){
  const r1t=twoLift(1,{reps:TOP,loads:105,prescribed:100,effort:e(2,1,1)}),r1=v1?v1Of(r1t):r1t,cap1=a=>{if(v1)captureOn(a.generation,r1,[100,100,100]);return a;};
  const oL=checkOf(cap1(foldArgs([r1],[],R1,rowBase(100))),LIFT,r1).offers[0],oR=checkOf(cap1(foldArgs([r1],[],R1,rowBase(100))),ROW,r1).offers[0];
  assert.deepEqual([decisionOf(oL).kind,decisionOf(oR).kind],['adopt-observed','adopt-observed'],'control: an adoption on each lift');
  const yL=acceptOp(oL,{op_id:'l12-y1',after:1}),yR=acceptOp(oR,{op_id:'l12-yR',after:1});
  const c2=v1Of(C(2,{date:'2026-10-08',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)}));
  const RB=(extra,bw,rev)=>{const a=cap1(foldArgs([r1,c2],[yL,yR,...extra],rev,rowBase(bw)));captureOn(a.generation,c2,[105,105,105]);return a;};
  const ev=checkOf(RB([],102.5,R1),LIFT,c2);assert.equal(ev.status,'offer','control: the exit '+JSON.stringify(ev.refusal));
  assert.deepEqual(decisionOf(ev.offers[0]).basis.load_basis.authority_refs,[ref('l12-y1')],'control: the genuine exit names l12-y1');
  const o=structuredClone(ev.offers[0]);decisionOf(o).basis.load_basis.authority_refs=[ref('l12-yR')];
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,f=EFFECTS.m.foldNativeLoad(RB([acceptOp(o,{op_id:'l12-y2p',after:2})],100,rev)),ex=exOf(f.state);
   assert.deepEqual(b2Active(f),[['RECORD_INVALID','base_load',['l12-y2p'],'act']],L+' '+JSON.stringify(f.issues));
   assert.equal(f.spent.some(x=>x.spend_id===decisionOf(o).spend_id),false,L+': absent from spent');
   assert.deepEqual([ex.w,ex.native_load_authority&&ex.native_load_authority.spend_id],[105,decisionOf(oL).spend_id],L+': w 105 from yL');
  }
 }
});
test('N28-B5-CLOSE-REF R9.12 (green-kept, killed by mutant (vi) through variant (c): a Close already fails the issuance-body shape test; spec M R9.12 GREEN-KEPT PROBES): the probe naming C1\'s Close Ref, a variant naming C2\'s Close Ref (not a proposal-response), and (c) a variant naming a plan op of fx-press that is not a proposal-response but carries an issuance-shaped body, recorded before C2\'s Start (fx-nonresp) -> RECORD_INVALID base_load [l12-y2p], absent from spent, w 105 from y1; C1 typed v2 or host v1 (C2 host v1, as the input states), R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b5Fixture(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   b5Probe(s,rev,[ref(s.c1.close)],{label:L+' C1 Close'});
   b5Probe(s,rev,[ref(s.c2.close)],{label:L+' C2 Close'});
   b5Probe(s,rev,[ref('fx-nonresp')],{label:L+' (c) a non-response plan op',mod:a=>{const ops=a.generation.collections.ops,k=ops[s.c1.close];
    ops['fx-nonresp']={op_id:'fx-nonresp',athlete_id:ATH,device_id:k.device_id,device_seq:k.device_seq+0.5,class:'plan',kind:'plan-edit',payload:{issuance:{body:{lift_lineage_id:LIFT}}},canonical_content_commitment:commit('fx-nonresp')};return a;}});
  }
 }
});
test('N28-B5-POST-ANCHOR R9.12 (green-kept, killed by mutants (i) and (xi); spec M R9.12 GREEN-KEPT PROBES, ONE ANCHOR, D-R12L1-5): a genuine proposal-response of fx-press named by no hold and NOT proven before C2\'s Start: (a) a copy of y1 recorded on device B with no causal order to C2\'s Start (l12-y1B); (b) the sub-case, a copy of y1 recorded on this device AFTER C2\'s Start and before the probe\'s own response (l12-y1C: proven before the response, not before the anchor). Each -> RECORD_INVALID base_load [l12-y2p], absent from spent, w 105 from y1; C1 typed v2 or host v1 (C2 host v1, as the input states), R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b5Fixture(v1);
  const y1B={...acceptOp(s.o1.offers[0],{op_id:'l12-y1B',after:2}),device:'fx-device-B'},y1C=acceptOp(s.o1.offers[0],{op_id:'l12-y1C',after:2});
  {const ops=s.at([s.probe([ref('l12-y1C')])],100,R1,[y1C]).generation.collections.ops;
   assert.ok(ops['l12-y1C'].device_id===ops[s.c2.start].device_id&&ops['l12-y1C'].device_seq>ops[s.c2.start].device_seq&&ops['l12-y1C'].device_seq<ops['l12-y2p'].device_seq,'control: l12-y1C follows C2\'s Start and precedes the probe\'s response on one device');}
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   b5Probe(s,rev,[ref('l12-y1B')],{pre:[y1B],label:L+' (a) device B'});
   b5Probe(s,rev,[ref('l12-y1C')],{pre:[y1C],label:L+' (b) after the anchor, before the response'});
  }
 }
});
test('N28-B5-SUPERSEDED-HOLD R9.12 (green-kept, killed by mutant (ii); spec M R9.12 GREEN-KEPT PROBES, D-R9.11-TWO-EXIT numeric-capture refusal only): the two-exit race on a numeric capture with no return (base 102.5): device A\'s exit y2 on C2 applies and supersedes y1\'s EFFECT_CONFLICT; C3 captured 105 after y1; device B\'s check on C3 offers the exit [adopt-baseline 105] naming [l12-y1] and y2b accepts, following y2 in fold order -> y2 applies (w 105), y2b RECORD_INVALID base_load [l12-y2b] and absent from spent; C1 typed v2 or host v1 (C2 host v1, as the input states), R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b5Fixture(v1);
  const c3=v1Of(C(3,{date:'2026-10-12',reps:TOP,loads:105,prescribed:105,effort:e(2,1,1)}));
  const ev3=checkOf(s.at([],102.5,R1,[],[c3]),LIFT,c3);assert.equal(ev3.status,'offer','control: device B\'s exit on C3 '+JSON.stringify(ev3.refusal));
  const d3=decisionOf(ev3.offers[0]);assert.deepEqual([d3.kind,d3.basis.load_basis.authority_refs],['adopt-baseline',[ref('l12-y1')]],'control: y2b names [l12-y1]');
  const y2b={...acceptOp(ev3.offers[0],{op_id:'l12-y2b',after:3}),device:'fx-device-B'};
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,f=EFFECTS.m.foldNativeLoad(s.at([s.y2,y2b],102.5,rev,[],[c3])),ex=exOf(f.state);
   assert.deepEqual(b2Issues(f),[['EFFECT_CONFLICT','load_basis',['l12-y1'],'sup'],['RECORD_INVALID','base_load',['l12-y2b'],'act']],L+' '+JSON.stringify(f.issues));
   assert.deepEqual([ex.w,ex.native_load_authority&&ex.native_load_authority.spend_id,f.spent.some(x=>x.spend_id===d3.spend_id)],[105,s.spend,false],L+': y2 applies, y2b absent from spent');
  }
 }
});
// N28-NEVER-HELD-NULL fixture (spec M R9.12 NEW ROWS; RESIDUAL (iv) :157, D-R12L1-7): base w null; C1 at 60 on the baseline
// ask, its yes nc-y1 [adopt-baseline 60] recorded after C1 (proven before C2's Start) applies (w 60) and is never held; C2 at
// 65 on the baseline ask: its record [adopt-baseline 65] is the offer the check gives on a fold without nc-y1
// (authority_refs []); nc-rec is that offer, as issued (ORDINARY) or re-shaped to name [nc-y1's response Ref] and re-digested.
function neverHeldNull(v1=false){
 const n1=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),n2t=C(2,{date:'2026-10-08',reps:TOP,loads:65,prescribed:null,effort:e(2,1,1)}),n2=v1?v1Of(n2t):n2t;
 const at=(extra,rev=R1,more=[])=>{const a=foldArgs([n1,n2,...more],extra,rev,F0({w:null}));if(v1)for(const c of [n2,...more])captureOn(a.generation,c,[null,null,null]);return a;};
 const on1=checkOf(foldArgs([n1],[],R1,F0({w:null})),LIFT,n1);
 assert.deepEqual(on1.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',60]],'control: nc-y1 is [adopt-baseline 60]');
 const ny1=acceptOp(on1.offers[0],{op_id:'nc-y1',after:1});
 const on2=checkOf(at([]),LIFT,n2);
 assert.deepEqual(on2.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value,decisionOf(o).basis.load_basis.authority_refs]),[['adopt-baseline',65,[]]],'control: C2 offers [adopt-baseline 65] with authority_refs []');
 const named=structuredClone(on2.offers[0]);decisionOf(named).basis.load_basis.authority_refs=[ref('nc-y1')];
 {const ops=at([ny1]).generation.collections.ops;assert.ok(ops['nc-y1'].device_id===ops[n2.start].device_id&&ops['nc-y1'].device_seq<ops[n2.start].device_seq,'control: nc-y1 is proven before C2\'s Start');}
 return {n1,n2,ny1,at,ordinary:on2.offers[0],named,spend:decisionOf(on2.offers[0]).spend_id,y1spend:decisionOf(on1.offers[0]).spend_id};
}
test('N28-NEVER-HELD-NULL R9.12 (spec M R9.12 NEW ROWS; RESIDUAL (iv) :157, the ruled outcome, PM ruling STOP-R912-1/-2 option (C); red on 189d076 and on the part-B1 product: w 60, EFFECT_CONFLICT load_basis [nc-rec]; killed by R9.11\'s mutant "the dissolved-hold exit disabled"): base w null; nc-y1 [adopt-baseline 60] applies and is never held; C2\'s baseline-ask record re-shaped to name [nc-y1] (nc-rec) -> w 65, wSets absent, nc-rec in spent and not cancelled, no issue of the lift, next card 65 on every set; the lift has no native queue entry before or after (D-R12L3-1: entry state recorded); its recorded Undo is the Undo of an APPLIED adoption and restores the held projection\'s image, w null (D-R12L3-1: not the pre-exit 60). Control N28-NEVER-HELD-NULL-ORDINARY (green-kept): the same record with authority_refs [] -> EFFECT_CONFLICT load_basis [nc-rec], w 60; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=neverHeldNull(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   const g=EFFECTS.m.foldNativeLoad(s.at([s.ny1,acceptOp(s.ordinary,{op_id:'nc-rec',after:2})],rev)),go=b2Out(g,s.spend);
   assert.deepEqual([go.w,go.issues],[60,[['EFFECT_CONFLICT','load_basis',['nc-rec'],'act']]],L+' ORDINARY control '+JSON.stringify(g.issues));
   const rec=acceptOp(s.named,{op_id:'nc-rec',after:2}),f=EFFECTS.m.foldNativeLoad(s.at([s.ny1,rec],rev)),o=b2Out(f,s.spend);
   assert.deepEqual([o.w,o.wSets,o.inSpent,o.cancelled,o.issues,o.card],[65,'absent',true,false,[],[65,65,65]],L+' '+JSON.stringify(f.issues));
   assert.deepEqual(f.state.queue.filter(q=>q&&q.exId===LIFT&&typeof q.native_load_spend==='string'),[],L+': the lift has no native queue entry (D-R12L3-1 entry state)');
   b2Invariant(f,L);
   const u=checkOf(s.at([s.ny1,rec],rev),LIFT,s.n2,{compensate:s.spend});assert.equal(u.status,'offer',L+': the Undo of nc-rec '+JSON.stringify(u.refusal));
   const h=EFFECTS.m.foldNativeLoad(s.at([s.ny1,rec,acceptOp(u.offers[0],{op_id:'nc-undo',after:2})],rev)),ho=b2Out(h,s.spend);
   assert.deepEqual([ho.w,ho.cancelled,b2Active(h)],[null,true,[]],L+': the recorded Undo restores w null, the held projection\'s image (D-R12L3-1) '+JSON.stringify(h.issues));
  }
 }
});
// Spec R9.11 M J ROWS (m)-(p) fixture with the return: b39Control's log (Q105 yes at base 100, base 97.5, C3 on the
// baseline ask at 60, the exit [adopt-baseline 60, authority_refs [Q105 yes]] and its Undo issued at base 97.5), folded over
// any base w ('return' is w 100).
function b39Return(v1=false){
 const s=b39Control(v1),{cs,resp}=landingScenario(R1);
 const atW=(w,more,extra,rev=R1)=>{const a=foldArgs([...cs,s.c3,...more],[resp,...extra],rev,F0({w}));if(v1)for(const c of [s.c3,...more])captureOn(a.generation,c,[null,null,null]);return a;};
 return {...s,cs,resp,atW};
}
// After an exit and its Undo: the programme of M (m): w null over wSets null, Q105 done/SUPERSEDED with its spend kept, the
// exit cancelled, no active hold, the baseline ask captures; C4 at 60 offers [adopt-baseline 60]; its yes gives 60 on every set.
function b39AfterUndo(s,rev,label,extra,w){
 const f=EFFECTS.m.foldNativeLoad(s.atW(w,[],extra,rev)),ex=exOf(f.state);
 assert.deepEqual([ex.w,Object.hasOwn(ex,'wSets'),ex.wSets,liveQ(f,s.spend),b2Active(f),ex.native_load_authority&&ex.native_load_authority.kind],[null,true,null,[[true,'SUPERSEDED']],[],'compensated'],label+' '+JSON.stringify(f.issues));
 assert.ok(f.spent.some(x=>x.spend_id===s.spend&&!x.cancelled_by),label+': the Q105 spend is kept');
 assert.ok(f.spent.some(x=>x.spend_id===s.xd.spend_id&&x.cancelled_by),label+': the exit is cancelled by its Undo');
 assert.deepEqual(b39Card(EFFECTS.m.heldProjection(f).state),[null,null,null],label+': the next card is the baseline ask, and it captures');
 b2Invariant(f,label);
 const ev=checkOf(s.atW(w,[s.c4],extra,rev),LIFT,s.c4);assert.equal(ev.status,'offer',label+' C4 '+JSON.stringify(ev.refusal));
 assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',60]],label+' C4');
 const g=EFFECTS.m.foldNativeLoad(s.atW(w,[s.c4],[...extra,acceptOp(ev.offers[0],{op_id:'fx-resp-c4',after:4})],rev)),gx=exOf(g.state);
 assert.deepEqual([gx.w,Object.hasOwn(gx,'wSets'),b39Card(EFFECTS.m.heldProjection(g).state)],[60,false,[60,60,60]],label+" C4's yes "+JSON.stringify(g.issues));
 b2Invariant(g,label+" after C4's yes");
}
// D-R20L1-3 (Fable R20-l1 F3): this row's own measured red on 189d076 and on the part-B1 product is its STATE assertion
// (Q105 [false,'DEBUT'], w null), which precedes its capture assertion. The spec's named red for (n), ENGINE_CAPTURE_BASELINE_UNPROVEN
// through the real capture, is retained elsewhere: FA03 N27-B39-HOST (gym.read blocked ENGINE_CAPTURE_BASELINE_UNPROVEN with Q45
// pending on 189d076 and on part B1; round-20 part B2 logs z-fa-189 d209c0e9, z-fa-b1 fb89e46d) and the walk at seed 11301954 on
// 189d076 and on part B1 (I15 ENGINE_CAPTURE_BASELINE_UNPROVEN at train 4 with Q105 pending; part B1 log 9F4AC1FD).
test('N27-B39-RETURN-UNDO R9.11 (spec R9.11 M (n), B39; red on dfc4445, 189d076 and the part-B1 product: ENGINE_CAPTURE_BASELINE_UNPROVEN through the real capture with Q105 pending): the exit and its Undo (recorded at base 97.5), then the base returns to 100 -> the exit applies as M (1)\'s dissolved-hold exit on the held projection and its Undo restores w null (wSets null); Q105 done/SUPERSEDED with its spend kept; no issue; the baseline ask captures; then as (m): C4 offers [adopt-baseline 60] and its yes gives 60 on every set; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b39Return(v1);
  for(const rev of [R1,R2])b39AfterUndo(s,rev,(v1?'v1 ':'v2 ')+rev+' (n)',[s.exit,s.undo],100);
 }
});
test('N27-B39-UNDO-AFTER-RETURN R9.11 (spec R9.11 M (p); the other delivery order of (n); red on 189d076 and the part-B1 product): the exit, then the base returns to 100, then the check issues the Undo on the APPLIED exit (RESTORE, base 60, target null) and it is accepted -> as (n); typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b39Return(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev+' (p)';
   const u=checkOf(s.atW(100,[],[s.exit],rev),LIFT,s.c3,{compensate:s.xd.spend_id});assert.equal(u.status,'offer',L+': the Undo of the applied exit '+JSON.stringify(u.refusal));
   const ud=decisionOf(u.offers[0]);assert.deepEqual([ud.base_load.scalar,ud.target_load.scalar],[lb(60),null],L+': RESTORE, base 60, target null');
   b39AfterUndo(s,rev,L,[s.exit,acceptOp(u.offers[0],{op_id:'fx-undo-p',after:3})],100);
  }
 }
});
test('N27-B39-RETURN R9.11 (spec R9.11 M (o); red on dfc4445, 189d076 and the part-B1 product: EFFECT_CONFLICT load_basis on the exit, the lift held): the exit, then the base returns to 100, no Undo -> w 60 with wSets absent, Q105 done/SUPERSEDED with its spend kept, no issue, the next card 60 on every set, and the exit\'s Undo offered while no Start has captured 60; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b39Return(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev+' (o)',f=EFFECTS.m.foldNativeLoad(s.atW(100,[],[s.exit],rev)),ex=exOf(f.state);
   assert.deepEqual([ex.w,Object.hasOwn(ex,'wSets'),liveQ(f,s.spend),b2Issues(f),b39Card(EFFECTS.m.heldProjection(f).state)],[60,false,[[true,'SUPERSEDED']],[],[60,60,60]],L+' '+JSON.stringify(f.issues));
   assert.ok(f.spent.some(x=>x.spend_id===s.spend&&!x.cancelled_by),L+': the Q105 spend is kept');
   const u=checkOf(s.atW(100,[],[s.exit],rev),LIFT,s.c3,{compensate:s.xd.spend_id});assert.equal(u.status,'offer',L+": the exit's Undo is offered "+JSON.stringify(u.refusal));
   b2Invariant(f,L);
  }
 }
});
test('N27-B39-REPAIR-REVERT R9.11 (spec R9.11 M J ROWS variant, the BASIS_REPAIR_REQUIRED hold; measured R912W m1b): Q105 yes over C1, C2; C2 corrected after it (BASIS_REPAIR_REQUIRED); C3 on the baseline ask at 60; the exit [adopt-baseline 60, authority_refs [Q105 yes]]; then the correction reverted (FC12 LATER-HOLD-REVERT convention: the correction is absent from the facts and the log) -> without the Undo: w 60, wSets absent, Q105 SUPERSEDED, no issue; with the Undo: w null, wSets null, Q105 SUPERSEDED, the exit cancelled, no issue, the baseline ask captures. Control (not reverted): w 60, Q105 SUPERSEDED, the repair superseded; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 const s=correctedScenario();
 for(const v1 of [false,true]){
  const c3t=C(3,{date:'2026-10-12',reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c3=v1?v1Of(c3t):c3t;
  const RR=(comps,extra,rev)=>{const a=foldArgs([...comps,c3],[s.resp,...extra],rev);if(v1)captureOn(a.generation,c3,[null,null,null]);return a;};
  const evx=checkOf(RR(s.cs2,[],R1),LIFT,c3);assert.equal(evx.status,'offer','control: the exit on C3 '+JSON.stringify(evx.refusal));
  const dx=decisionOf(evx.offers[0]);assert.deepEqual([dx.kind,dx.target_load.scalar.value,dx.basis.load_basis.authority_refs],['adopt-baseline',60,[ref('fx-resp-1')]],'control: the exit');
  const exit=acceptOp(evx.offers[0],{op_id:'fx-exit',after:3});
  const ux=checkOf(RR(s.cs2,[exit],R1),LIFT,c3,{compensate:dx.spend_id});assert.equal(ux.status,'offer','control: its Undo '+JSON.stringify(ux.refusal));
  const undo=acceptOp(ux.offers[0],{op_id:'fx-exit-undo',after:3});
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   const c0=EFFECTS.m.foldNativeLoad(RR(s.cs2,[exit],rev)),co=b2Out(c0,dx.spend_id);
   assert.deepEqual([co.w,co.wSets,liveQ(c0,s.spend),co.issues],[60,'absent',[[true,'SUPERSEDED']],[['BASIS_REPAIR_REQUIRED',null,['fx-resp-1'],'sup']]],L+' control (not reverted) '+JSON.stringify(c0.issues));
   const f=EFFECTS.m.foldNativeLoad(RR(s.cs,[exit],rev)),o=b2Out(f,dx.spend_id);
   assert.deepEqual([o.w,o.wSets,o.inSpent,liveQ(f,s.spend),o.issues,o.card],[60,'absent',true,[[true,'SUPERSEDED']],[],[60,60,60]],L+' reverted, no Undo '+JSON.stringify(f.issues));
   b2Invariant(f,L+' reverted, no Undo');
   const g=EFFECTS.m.foldNativeLoad(RR(s.cs,[exit,undo],rev)),go=b2Out(g,dx.spend_id);
   assert.deepEqual([go.w,go.wSets,go.cancelled,liveQ(g,s.spend),go.issues,go.card],[null,null,true,[[true,'SUPERSEDED']],[],[null,null,null]],L+' reverted, with the Undo '+JSON.stringify(g.issues));
   b2Invariant(g,L+' reverted, with the Undo');
  }
 }
});
test('N27-B39-ORDINARY R9.11 (green-kept, killed by mutant "authority_refs [] treated as a claim"; spec R9.11 M, N24): base w null; C1 at 60 on the baseline ask, its [adopt-baseline 60] yes with authority_refs []; a replay over an unordered base w 50 -> EFFECT_CONFLICT load_basis [its response Ref], w 50, the yes kept unapplied; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){
  const c1t=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c1=v1?v1Of(c1t):c1t;
  const A=(extra,w,rev)=>{const a=foldArgs([c1],extra,rev,F0({w}));if(v1)captureOn(a.generation,c1,[null,null,null]);return a;};
  const ev=checkOf(A([],null,R1),LIFT,c1);assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).basis.load_basis.authority_refs]),[['adopt-baseline',[]]],'control: an ordinary adopt-baseline');
  const yes=acceptOp(ev.offers[0],{op_id:'fx-ord',after:1}),spend=decisionOf(ev.offers[0]).spend_id;
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,f=EFFECTS.m.foldNativeLoad(A([yes],50,rev)),o=b2Out(f,spend);
   assert.deepEqual([o.w,o.inSpent,b2Active(f)],[50,true,[['EFFECT_CONFLICT','load_basis',['fx-ord'],'act']]],L+' '+JSON.stringify(f.issues));
  }
 }
});
test('N27-B39-CLAIM-ORDER R9.11 (green-kept, killed by the mutants that drop M (1)\'s order test or widen its anchor to the record\'s own response; spec R9.11 M, R9.12 ONE ANCHOR): the (o) log after the return, with the exit re-shaped to name a copy of the Q105 yes that is NOT proven before C3\'s Start: (a) recorded on device B with no causal order (fx-resp-1B); (b) recorded on this device after C3\'s Start and before the exit\'s response (fx-resp-1C) -> not a dissolved-hold exit: EFFECT_CONFLICT load_basis [the exit], w 100, as on dfc4445; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b39Return(v1);
  const q=landingScenario(R1),qB={...acceptOp(q.offer,{op_id:'fx-resp-1B',after:3}),device:'fx-device-B'},qC=acceptOp(q.offer,{op_id:'fx-resp-1C',after:3});
  for(const [name,copy] of [['(a) device B',qB],['(b) after the anchor, before the response',qC]]){
   const o=structuredClone(s.exit);
   const body=structuredClone(o.payload.issuance.body);body.basis.load_basis.authority_refs=[ref(copy.op_id)];
   const exit2=acceptOp({body,reason:o.payload.issuance.reason},{op_id:'fx-exit-2',after:3});
   for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev+' '+name,f=EFFECTS.m.foldNativeLoad(s.atW(100,[],[copy,exit2],rev));
    assert.deepEqual([exOf(f.state).w,b2Active(f)],[100,[['EFFECT_CONFLICT','load_basis',['fx-exit-2'],'act']]],L+' '+JSON.stringify(f.issues));
   }
  }
 }
});
// D-R20L1-3 (Fable R20-l1 F4): the aggregate also folds the logs of N27-B39-ORDINARY, -CLAIM-ORDER (a) (b) and -REPAIR-REVERT (its
// control, reverted, reverted with the Undo), rebuilt here exactly as those rows build them (each row also asserts its own
// controls and calls b2Invariant where it did before).
function b39MoreLogs(v1,rev,r){
 const out=[];
 {const c1t=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c1=v1?v1Of(c1t):c1t;
  const A=(extra,w,rv)=>{const a=foldArgs([c1],extra,rv,F0({w}));if(v1)captureOn(a.generation,c1,[null,null,null]);return a;};
  const yes=acceptOp(checkOf(A([],null,R1),LIFT,c1).offers[0],{op_id:'fx-ord',after:1});
  out.push(['ORDINARY',A([yes],50,rev)]);}
 {const q=landingScenario(R1),qB={...acceptOp(q.offer,{op_id:'fx-resp-1B',after:3}),device:'fx-device-B'},qC=acceptOp(q.offer,{op_id:'fx-resp-1C',after:3});
  for(const [name,copy] of [['(a)',qB],['(b)',qC]]){const body=structuredClone(r.exit.payload.issuance.body);body.basis.load_basis.authority_refs=[ref(copy.op_id)];
   const exit2=acceptOp({body,reason:r.exit.payload.issuance.reason},{op_id:'fx-exit-2',after:3});out.push(['CLAIM-ORDER '+name,r.atW(100,[],[copy,exit2],rev)]);}}
 {const s=correctedScenario(),c3t=C(3,{date:'2026-10-12',reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c3=v1?v1Of(c3t):c3t;
  const RR=(comps,extra,rv)=>{const a=foldArgs([...comps,c3],[s.resp,...extra],rv);if(v1)captureOn(a.generation,c3,[null,null,null]);return a;};
  const evx=checkOf(RR(s.cs2,[],R1),LIFT,c3),dx=decisionOf(evx.offers[0]),exit=acceptOp(evx.offers[0],{op_id:'fx-exit',after:3});
  const undo=acceptOp(checkOf(RR(s.cs2,[exit],R1),LIFT,c3,{compensate:dx.spend_id}).offers[0],{op_id:'fx-exit-undo',after:3});
  out.push(['REPAIR-REVERT control',RR(s.cs2,[exit],rev)],['REPAIR-REVERT reverted',RR(s.cs,[exit],rev)],['REPAIR-REVERT reverted with the Undo',RR(s.cs,[exit,undo],rev)]);}
 return out;
}
test('N27-B39-INVARIANT R9.11 (spec R9.11 M, :158 INVARIANT; D-R20L1-3): over the end states of N27-B39-CONTROL (m), RETURN-UNDO (n), RETURN (o), UNDO-AFTER-RETURN (p), NULL-VECTOR, N28-B5-ASTRA, N28-B5-NO-UNDO, N28-NEVER-HELD-NULL, N27-B39-ORDINARY, -CLAIM-ORDER (a) (b) and -REPAIR-REVERT (control, reverted, reverted with the Undo): no registered projection has a lift with w null or ABSENT and a visible unfinished native entry, no programme has a numeric w over a present-null wSets, and the next day prepares through the real capture; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
  const r=b39Return(v1),n=b39NullVector(v1),b=b5Fixture(v1),h=neverHeldNull(v1);
  const u=checkOf(r.atW(100,[],[r.exit],rev),LIFT,r.c3,{compensate:r.xd.spend_id}),undoP=acceptOp(u.offers[0],{op_id:'fx-undo-p',after:3});
  const folds=[['(m)',r.atW(97.5,[],[r.exit,r.undo],rev)],['(n)',r.atW(100,[],[r.exit,r.undo],rev)],['(o)',r.atW(100,[],[r.exit],rev)],['(p)',r.atW(100,[],[r.exit,undoP],rev)],
   ['NULL-VECTOR',n.at([n.c2],[n.exit,n.undo],rev)],...b5Variants(b,rev).map(([k,a])=>['B5 '+k,a()]),['NEVER-HELD-NULL',h.at([h.ny1,acceptOp(h.named,{op_id:'nc-rec',after:2})],rev)],...b39MoreLogs(v1,rev,r)];
  for(const [k,a] of folds)b2Invariant(EFFECTS.m.foldNativeLoad(a),L+' '+k);
 }
});
// ======================================================================
// ROUND 20 PART C (test bytes only). The PM rulings on STOP-R20B1-1/-2 (walk option (b), the Fable advisor's invariants: rows
// R20-LEGACY-NEEDS-LOAD and R20-LEGACY-VECTOR-SHIFT, stated in the walk's legacy generator), D-R20-RESTORE-OVER-LEGACY (the one
// real path for -1: a carried-debt row asserting the current refusal; spec R9.13 is prepared separately) and STOP-R20B2-2
// (D-R9.11-TWO-EXIT's null-capture second exit pinned as measured: N27-B39-TWO-EXIT-NULL).
// ======================================================================
// An accept context for a body of the evaluation ev (as applyAccept builds it, for a body that may differ from the offer's).
const r20Ctx=(ev,b)=>({event:'accept',basis:b.basis,spent:[],completion:null,authority:{response_refs:[ref('fx-resp-1')],
 issuance:{producer:'earned/native-load/v1',body:b,reason:ev.offers[0].reason??null,revision:'fx-revision-1',source:ev.basis.source,moment:'2026-10-20T12:00:00.000Z'},source_cut:ev.basis.source}});
// The three earnWalk arms that queue at w 100 on the N02c facts: the DEBUT (earn.cjs:88), the PROPOSED on one sighting with the
// terminal set 2 in reserve (:97) and the PROPOSED after a hot opener with the terminal set 2 in reserve (:63).
const r20Arms=d1=>[['DEBUT (earn.cjs:88)','DEBUT',{ex:{topAt:100,topRun:1},en:{w:100,reps:TOP,rir:2,rirSets:[2,1,1]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:d1}],
 ['PROPOSED one sighting (earn.cjs:97)','PROPOSED',{en:{w:100,reps:TOP,rir:2,rirSets:[2,1,2]},r:TOP,dEarn:d1}],
 ['PROPOSED hot opener (earn.cjs:63)','PROPOSED',{ex:{topAt:100,topRun:1},en:{w:100,reps:TOP,rir:0,rirSets:[0,1,2]},r:TOP,prevMeta:{w:100,reps:TOP},dEarn:d1}]];
test('R20-LEGACY-NEEDS-LOAD (PM ruling on STOP-R20B1-1, option (b): the invariant the walk\'s legacy generator states; green-kept, killed by planted defects at FC01:501 and E/progression.cjs:365): no writer emits a debut on a lift whose w is null. (1) The reader-exposed earn path: nextLoad of a w-null lift is null (E/progression.cjs:365) and the unchanged earnWalk queues nothing on the three inputs that queue at w 100 (the DEBUT of earn.cjs:88, the PROPOSED of :97 and :63); E/writers.cjs:383 calls earnWalk only over a numeric w. (2) FC01:549, the native DEBUT push, is reached only by an earn: the N02c earn body re-recorded over a null w (load_basis.w, base_load.fields.w present null, base_load null on every slot) is refused RECORD_INVALID base_load at :501, with no queue write, where the body as issued queues; evaluateNativeLoad on the w-null lift offers no earn',()=>{
 const {cs,s,E}=n02cY();
 for(const [name,want,inp] of r20Arms(cs[1].date)){
  assert.deepEqual(canonical(E,s,inp).map(q=>[q.state,q.newW]),[[want,105]],'control at w 100: '+name);
  assert.deepEqual(canonical(E,s,{...inp,ex:{...(inp.ex||{}),w:null}}),[],'w null: '+name+' queues nothing');
 }
 assert.deepEqual([E.nextLoad(exOf(s)),E.nextLoad({...exOf(s),w:null})],[105,null],'E/progression.cjs:365: an absent load has no next load');
 nativeGate(E);
 const ev=evaluate(E,s,request(s,cs,cs[1])),good=decisionOf(ev.offers[0]);assert.equal(good.kind,'earn','control: the earn offer at w 100');
 const t0=E.applyNativeLoadDecision(s,good,r20Ctx(ev,good));
 assert.deepEqual([t0.status,t0.effect&&t0.effect.kind,t0.state.queue.length],['applied','queued',1],'control: the earn as issued queues its DEBUT (FC01:549)');
 const sN=withFacts(F0({w:null}),cs),bad=structuredClone(good),nul={present:true,value:null};
 bad.basis.load_basis.w=nul;bad.base_load.fields.w=structuredClone(nul);bad.base_load.scalar=null;bad.base_load.vector=bad.base_load.vector.map(()=>null);
 const t=E.applyNativeLoadDecision(sN,bad,r20Ctx(ev,bad));
 assert.deepEqual([t.status,t.refusal&&t.refusal.code,t.refusal&&t.refusal.field],['refused','NATIVE_LOAD_RECORD_INVALID','base_load'],'FC01:501: an earn over a null w is refused before :549 '+JSON.stringify(t.refusal));
 assert.ok(!t.state||!t.state.queue.some(q=>q&&q.exId===LIFT&&q.kind==='debut'),'no debut queued over the null w');
 const evN=evaluate(E,sN,request(sN,cs,cs[1]));
 assert.ok(!(evN.offers||[]).some(o=>decisionOf(o).kind==='earn'),'the w-null lift is offered no earn '+JSON.stringify([evN.status,evN.refusal,(evN.offers||[]).map(o=>decisionOf(o).kind)]));
});
test('R20-LEGACY-VECTOR-SHIFT (PM ruling on STOP-R20B1-2, option (b): the invariant the walk\'s legacy generator states; green-kept, killed by planted defects on the earn.cjs vector shift and at FC01:516-517): a debut queued on a per-set-weight lift carries the shifted vector. (1) The unchanged earnWalk on the N02c facts with fx-press wSets [100,100,95]: each of the three arms (earn.cjs:88, :97, :63) queues newW 105 with newWSets [105,105,100], never a scalar debut over the vector. (2) FC01:516-517 on N11 (wSets [100,95]): the DEBUT 105 [105,100] body as issued applies and queues newWSets [105,100]; the same body with a scalar candidate (newWSets null) is refused RECORD_INVALID candidate. (A scalar legacy debut over a stored vector at the capture boundary, ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED, W/engine-capture.cjs:82-83, is pinned by FIT-MALFORMED R9.10.)',()=>{
 const {cs,s,E}=n02cY(),vec={wSets:[100,100,95]};
 for(const [name,want,inp] of r20Arms(cs[1].date))
  assert.deepEqual(canonical(E,s,{...inp,ex:{...(inp.ex||{}),...vec}}).map(q=>[q.state,q.newW,q.newWSets]),[[want,105,[105,105,100]]],'vector lift: '+name+' carries the shifted vector');
 const n=n11(X(2));nativeGate(n.E);
 const ev=evaluate(n.E,n.s,request(n.s,n.cs,n.cs[1])),good=decisionOf(ev.offers[0]);
 assert.deepEqual([ev.offers.length,good.kind,good.candidate.newW,good.candidate.newWSets],[1,'earn',105,[105,100]],'control: N11 offers DEBUT 105 [105,100]');
 const t0=n.E.applyNativeLoadDecision(n.s,good,r20Ctx(ev,good));
 assert.deepEqual([t0.status,t0.state.queue.at(-1).newW,t0.state.queue.at(-1).newWSets],['applied',105,[105,100]],'control: the queued debut carries the shifted vector');
 const bad=structuredClone(good);bad.candidate.newWSets=null;
 const t=n.E.applyNativeLoadDecision(n.s,bad,r20Ctx(ev,bad));
 assert.deepEqual([t.status,t.refusal&&t.refusal.code,t.refusal&&t.refusal.field],['refused','NATIVE_LOAD_RECORD_INVALID','candidate'],'FC01:516-517: a scalar candidate over a vector basis '+JSON.stringify(t.refusal));
});
// D-R20-RESTORE-OVER-LEGACY fixture (the Fable advisor's one real path for STOP-R20B1-1: FC01:542 dispatches a compensate
// BEFORE the :544 LEGACY_PENDING test, and the unapplied-RESTORE branch :578-586 writes the recorded base_load.fields): base w
// null; C1 on the baseline ask at 60 and its [adopt-baseline 60] yes (rl-y1, applied: w 60); its Undo issued and recorded
// while that adoption is applied (RESTORE: base 60, target null; rl-undo); then the base re-admitted at w 100 carrying a
// pending legacy DEBUT 105 (a shape a writer can queue: numeric w, no vector).
function restoreOverLegacy(v1=false){
 const c1t=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c1=v1?v1Of(c1t):c1t;
 const LEG={exId:LIFT,kind:'debut',done:false,state:'DEBUT',newW:105,t:'SYNTHETIC legacy debut'};
 const at=(extra,w,rev=R1)=>{const b=F0({w});if(w!==null)b.queue.push(structuredClone(LEG));const a=foldArgs([c1],extra,rev,b);if(v1)captureOn(a.generation,c1,[null,null,null]);return a;};
 const ev=checkOf(at([],null),LIFT,c1);
 assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',60]],'control: C1 offers [adopt-baseline 60]');
 const y1=acceptOp(ev.offers[0],{op_id:'rl-y1',after:1}),spend=decisionOf(ev.offers[0]).spend_id;
 const u=checkOf(at([y1],null),LIFT,c1,{compensate:spend});assert.equal(u.status,'offer','control: the Undo while applied '+JSON.stringify(u.refusal));
 const ud=decisionOf(u.offers[0]);assert.deepEqual([ud.base_load.scalar,ud.target_load.scalar],[lb(60),null],'control: a RESTORE (base 60, target null)');
 return {c1,y1,spend,ud,undo:acceptOp(u.offers[0],{op_id:'rl-undo',after:1}),at};
}
test('R20-RESTORE-OVER-LEGACY R9.13 (v) LEGACY-OVER-NULL (FLIPPED from part C\'s KNOWN-RED CARRIED DEBT D-R20-RESTORE-OVER-LEGACY by PM ruling (v), DECISIONS:819; the retained red, measured on 40eb702 and part C: the next day\'s capture refused the whole day ENGINE_CAPTURE_BASELINE_UNPROVEN through cardLoads): an adopt-baseline, its RESTORE Undo recorded while applied, then the base re-admitted at w 100 carrying a pending legacy DEBUT 105 -> the adoption is held back (the legacy entry is pending, FC01:544) while its Undo applies through the unapplied-RESTORE branch (FC01:542 before :544; :578-586) and writes w null under the legacy DEBUT, which stays pending in the fold state; the registered projection hides it (w null), so the next card is the baseline ask and the day prepares; the check on a later baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue (E/native-load.cjs:222; N-Q2), and after it w stays null with no adoption receipt (D-R13L1-4). Controls: not re-admitted (base w null, no legacy entry), the Undo leaves the baseline ask, which captures; re-admitted without the Undo, the moved base holds the adoption (EFFECT_CONFLICT load_basis [rl-y1], w 100) and the held projection hides the legacy entry (R9.4 :159), so the baseline ask captures; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=restoreOverLegacy(v1);
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
   const c0=EFFECTS.m.foldNativeLoad(s.at([s.y1,s.undo],null,rev));
   assert.deepEqual([exOf(c0.state).w,b2Active(c0),b39Card(EFFECTS.m.heldProjection(c0).state)],[null,[],[null,null,null]],L+' control: not re-admitted, the Undo leaves the baseline ask '+JSON.stringify(c0.issues));
   const c1=EFFECTS.m.foldNativeLoad(s.at([s.y1],100,rev));
   assert.deepEqual([exOf(c1.state).w,b2Active(c1),b39Card(EFFECTS.m.heldProjection(c1).state)],[100,[['EFFECT_CONFLICT','load_basis',['rl-y1'],'act']],[null,null,null]],L+' control: re-admitted without the Undo, the adoption is held and the held projection hides the legacy entry '+JSON.stringify(c1.issues));
   const f=EFFECTS.m.foldNativeLoad(s.at([s.y1,s.undo],100,rev)),ex=exOf(f.state);
   assert.deepEqual([ex.w,f.state.queue.filter(q=>q&&q.exId===LIFT&&!q.done&&typeof q.native_load_spend!=='string').map(q=>[q.state,q.newW])],[null,[['DEBUT',105]]],L+' the Undo writes w null under the pending legacy DEBUT '+JSON.stringify(f.issues));
   const hp=EFFECTS.m.heldProjection(f).state;
   assert.deepEqual(hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done),[],L+' R9.13 (v): the registered projection hides the pending legacy DEBUT of the w-null lift');
   assert.deepEqual(b39Card(hp),[null,null,null],L+' R9.13 (v): the next card is the baseline ask and the day prepares (40eb702: ENGINE_CAPTURE_BASELINE_UNPROVEN)');
   const c2t=C(2,{date:'2026-10-08',reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c2=v1?v1Of(c2t):c2t,b2=F0({w:100});
   b2.queue.push({exId:LIFT,kind:'debut',done:false,state:'DEBUT',newW:105,t:'SYNTHETIC legacy debut'});
   const a2=foldArgs([s.c1,c2],[s.y1,s.undo],rev,b2);if(v1){captureOn(a2.generation,s.c1,[null,null,null]);captureOn(a2.generation,c2,[null,null,null]);}
   const ev2=checkOf(a2,LIFT,c2);
   assert.deepEqual([ev2.status,ev2.refusal&&ev2.refusal.code,ev2.refusal&&ev2.refusal.refs,ev2.refusal&&ev2.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c2.close)],'queue'],L+' the check on the later baseline-ask completion '+JSON.stringify(ev2.refusal||ev2.offers));
   const f2=EFFECTS.m.foldNativeLoad(a2),ex2=exOf(f2.state);
   assert.deepEqual([ex2.w,JSON.stringify(ex2.native_load_authority),JSON.stringify(f2.state).includes('adopt:'+LIFT)],[null,JSON.stringify(ex.native_load_authority),false],L+' D-R13L1-4: after that completion w stays null, the authority unchanged, no adoption receipt');
  }
 }
});
test('N27-B39-TWO-EXIT-NULL R9.11 (PM ruling on STOP-R20B2-2: D-R9.11-TWO-EXIT\'s NULL-capture second exit pinned as measured, walk class (c) EFFECT_CONFLICT load_basis 3455/3455 in round 20 part B2; kills the M (1)-only half of mutant (ii), "a superseded hold treated as dissolved", which applied the second exit): b39Control\'s hold (the Q105 yes at base 100, the base re-admitted at 97.5 with no ordering op: EFFECT_CONFLICT load_basis), C3 at 60 and C3b at 65 both trained on the held baseline ask and each offered the exit naming [the Q105 yes] before either is answered; device A accepts C3\'s exit (fx-exit-a), then device B accepts C3b\'s (fx-exit-b; its causal parents are the plan ops device B had folded: the Q105 yes) -> the first exit applies: w 60, Q105 done/SUPERSEDED with its spend kept, the Q105 hold superseded; the second is refused EFFECT_CONFLICT load_basis [fx-exit-b] (an active hold), its effect not live; the next card is therefore the baseline ask; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true]){const s=b39Control(v1);
  const cbt=C(4,{date:'2026-10-13',reps:TOP,loads:65,prescribed:null,effort:e(2,1,1)}),cb=v1?v1Of(cbt):cbt;
  const evB=checkOf(s.at([cb],[]),LIFT,cb);assert.equal(evB.status,'offer','control: C3b\'s exit '+JSON.stringify(evB.refusal));
  const dB=decisionOf(evB.offers[0]);
  assert.deepEqual([evB.offers.length,dB.kind,dB.target_load.scalar.value,dB.basis.load_basis.authority_refs],[1,'adopt-baseline',65,[ref('fx-resp-1')]],'control: the second exit names the Q105 yes');
  const exA={...s.exit,op_id:'fx-exit-a',after:4},exB={...acceptOp(evB.offers[0],{op_id:'fx-exit-b',after:4}),device:'fx-device-B'};
  const log=rev=>{const a=s.at([cb],[exA,exB],rev);a.generation.collections.ops['fx-exit-b'].causal_parents=['fx-resp-1'];return a;};
  for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,f=EFFECTS.m.foldNativeLoad(log(rev)),ex=exOf(f.state);
   assert.deepEqual([ex.w,ex.native_load_authority&&ex.native_load_authority.spend_id,liveQ(f,s.spend)],[60,s.xd.spend_id,[[true,'SUPERSEDED']]],L+' the first exit applies '+JSON.stringify(f.issues));
   assert.ok(f.spent.some(x=>x.spend_id===s.spend&&!x.cancelled_by),L+': the Q105 spend is kept');
   assert.deepEqual(b2Issues(f),[['EFFECT_CONFLICT','load_basis',['fx-resp-1'],'sup'],['EFFECT_CONFLICT','load_basis',['fx-exit-b'],'act']],L+' the second exit: EFFECT_CONFLICT load_basis '+JSON.stringify(f.issues));
   assert.equal(f.spent.some(x=>x.spend_id===dB.spend_id&&!x.cancelled_by&&!f.issues.some(i=>i.spend_id===dB.spend_id)),false,L+': the second exit has no live effect');
   assert.deepEqual(b39Card(EFFECTS.m.heldProjection(f).state),[null,null,null],L+' the next card');
  }
 }
});

// ======================================================================
// ROUND 21a (test bytes only; Astra L13 REJECT of a42168d: B1, B2, B3, D-L13-WALK-I3; PM rulings (i)-(v) of 2026-09-25).
// ======================================================================
// Round 21a registered the four L13-B1 rows below as node:test todos (KNOWN_RED 'L13-B1') until ruling (i) was built. Round
// 21b built it and round 21c (Fable R21 l1 F5 (a)) deleted the registration and the mechanism (no other entry used it): the four
// rows are ordinary tests, so a regression fails a default whole-file run.
// L13-B2: Astra L13 probes.cjs NULL_REF, on N28-NEVER-HELD-NULL's input (base w null; nc-y1 [adopt-baseline 60] applied and never
// held; C2's baseline-ask record re-shaped to name authority_refs). 'valid' names [nc-y1] (the ruled residual: it applies 65).
function nullRefProbe(mode,rev){
 const s=neverHeldNull(false),offer=structuredClone(s.named),d=decisionOf(offer),r=ref('r21-bad-ref');
 const a=s.at([s.ny1],rev),ops=a.generation.collections.ops,src=ops['nc-y1'];
 let refs=[ref('nc-y1')];
 if(mode==='mixed')refs.push(ref('r21-missing'));
 if(mode==='wrong-commitment')refs=[{...ref('nc-y1'),commitment:commit('r21-not-y1')}];
 if(mode==='wrong-lift'||mode==='wrong-kind'){
  ops[r.op_id]={...structuredClone(src),op_id:r.op_id,canonical_content_commitment:r.commitment};
  if(mode==='wrong-lift'){ops[r.op_id].payload={issuance:{body:{lift_lineage_id:'fx-row'}}};a.base.exercises.push({...structuredClone(a.base.exercises[0]),id:'fx-row',n:'Invented Row'});}
  if(mode==='wrong-kind')ops[r.op_id].kind='plan-edit';
  refs=[r];
 }
 d.basis.load_basis.authority_refs=refs;
 const rec=acceptOp(offer,{op_id:'r21-probe',after:2});
 ops[rec.op_id]={op_id:rec.op_id,athlete_id:ATH,device_id:src.device_id,device_seq:99,class:'plan',kind:'proposal-response',payload:rec.payload,canonical_content_commitment:commit(rec.op_id)};
 const f=EFFECTS.m.foldNativeLoad(a),hp=EFFECTS.m.heldProjection(f).state;
 return {w:exOf(f.state).w,issues:b2Issues(f),card:cardLoads(hp)};
}
const nullRefRow=(mode,clause,mutant)=>test('L13-B2-NULL-REF-'+mode.toUpperCase()+' R9.12 (Astra L13 B2, mutant '+mutant+' "'+clause+'"; spec M R9.12 M (1) dissolved-hold exit, RESIDUAL (iv) :157): on N28-NEVER-HELD-NULL\'s input the C2 baseline-ask record names authority_refs that fail only the '+clause+' clause -> not a dissolved exit: w 60, EFFECT_CONFLICT load_basis [r21-probe] active, the next card the baseline ask; control \'valid\' ([nc-y1]) applies 65 on every set with no issue; typed v2, R1 and R2',()=>{
 effectsGate();
 for(const rev of [R1,R2]){
  assert.deepEqual(nullRefProbe('valid',rev),{w:65,issues:[],card:[65,65,65]},rev+' control: the valid ref applies');
  assert.deepEqual(nullRefProbe(mode,rev),{w:60,issues:[['EFFECT_CONFLICT','load_basis',['r21-probe'],'act']],card:[null,null,null]},rev+' '+mode);
 }
});
nullRefRow('mixed','every ref authentic (one valid ref beside an absent one)','L13-M03 every->some');
nullRefRow('wrong-lift','same lift (an authentic proposal-response of fx-row)','L13-M04 omit same lift');
nullRefRow('wrong-commitment','commitment equality (the nc-y1 op_id with another commitment)','L13-M05 omit commitment');
nullRefRow('wrong-kind','proposal-response kind (an issuance-shaped plan-edit)','L13-M06 omit response kind');
test('L13-B2-ANCHOR-KIND R9.12 (Astra L13 B2, mutant L13-M08 "anchor without the session-start kind"; spec M R9.12 ONE ANCHOR, D-R12L3-2): b39Return\'s exit over the returned base 100 with the consumed C3 Start re-kinded session-set -> the anchor is not an authenticated session-start, so the exit is no dissolved exit: w 100, RECORD_INVALID consumes [fx-exit] active, Q105 pending DEBUT, the next card the baseline ask; typed v2, R1 and R2',()=>{
 effectsGate();
 const s=b39Return(false);
 for(const rev of [R1,R2]){
  const a=s.atW(100,[],[s.exit],rev);a.generation.collections.ops[s.c3.start].kind='session-set';
  const f=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([exOf(f.state).w,b2Issues(f),f.state.queue.filter(q=>q&&q.exId===LIFT).map(q=>[q.newW,!!q.done,q.state]),cardLoads(EFFECTS.m.heldProjection(f).state)],
   [100,[['RECORD_INVALID','consumes',['fx-exit'],'act']],[[105,false,'DEBUT']],[null,null,null]],rev+' '+JSON.stringify(f.issues));
 }
});
test('L13-B3-TWO-EXIT-RETURNED R9.11 (Astra L13 B3, author mutant b2-ii-superseded-M1 "a superseded hold treated as dissolved"; D-R9.11-TWO-EXIT, PM ruling on STOP-R20B2-2): b39Return\'s hold at base 97.5; two genuine baseline-ask exit offers issued for the one hold before either yes: fx-exit (C3 at 60) and r21-exit-B (C4 at 65, its Start and response on device B knowing only the Q105 yes, not the first exit); both accepted -> the first applies (w 60, Q105 done/SUPERSEDED, the Q105 hold superseded) and the second is EFFECT_CONFLICT load_basis [r21-exit-B] active, recorded in spent with no live effect; the next card the baseline ask; typed v2, R1 and R2',()=>{
 effectsGate();
 for(const rev of [R1,R2]){
  const s=b39Return(false),c4=C(4,{date:'2026-10-15',reps:TOP,loads:65,prescribed:null,effort:e(2,1,1)});
  const ev=checkOf(s.atW(97.5,[c4],[],rev),LIFT,c4);assert.equal(ev.status,'offer',rev+' control: the second exit '+JSON.stringify(ev.refusal));
  const d=decisionOf(ev.offers[0]);
  assert.deepEqual([ev.offers.length,d.kind,d.target_load.scalar.value,d.basis.load_basis.authority_refs],[1,'adopt-baseline',65,[ref('fx-resp-1')]],rev+' control: issued before either yes, naming the Q105 yes');
  const yb={...acceptOp(ev.offers[0],{op_id:'r21-exit-B',after:4}),device:'fx-device-B'};
  const a=s.atW(97.5,[c4],[s.exit,yb],rev),ops=a.generation.collections.ops;
  ops[c4.start].causal_parents=[s.resp.op_id];ops['r21-exit-B'].causal_parents=[s.resp.op_id,c4.close];
  const f=EFFECTS.m.foldNativeLoad(a),ex=exOf(f.state);
  assert.deepEqual([ex.w,ex.native_load_authority&&ex.native_load_authority.kind,f.state.queue.filter(q=>q&&q.exId===LIFT).map(q=>[q.newW,!!q.done,q.state])],[60,'adopted',[[105,true,'SUPERSEDED']]],rev+' the first exit applies '+JSON.stringify(f.issues));
  assert.deepEqual(b2Issues(f),[['EFFECT_CONFLICT','load_basis',['fx-resp-1'],'sup'],['EFFECT_CONFLICT','load_basis',['r21-exit-B'],'act']],rev+' the second exit is held');
  assert.ok(f.spent.some(x=>x.spend_id===d.spend_id),rev+': the second exit is recorded in spent');
  assert.deepEqual(cardLoads(EFFECTS.m.heldProjection(f).state),[null,null,null],rev+' the next card');
 }
});
// L13-B1 (Astra P/reduce-i6.cjs): two tops at 100 -> earn yes Q105 (fx-resp-1); C3 captures 105 and lifts 95 -> the missed
// debut's [adopt-observed 95] yes (r21-missed-yes); host-v1 C4 captures and lifts 95 at the admitted base 102.5 -> the check
// issues [adopt-baseline 95] naming both earlier responses (r21-exit); accepted; the base returns to 100. 'unproven': every
// plan op on device B in increasing sequence without causal parents (the R8 UNPROVABLE ORDER layout); issued bodies unchanged.
function reduceI6(rev,layout,opt={}){
 const s=landingScenario(R1);
 const c3=C(3,{date:'2026-10-12',reps:TOP,loads:95,prescribed:105,effort:e(2,1,1)}),three=[...s.cs,c3];
 const ev=checkOf(foldArgs(three,[s.resp]),LIFT,c3);assert.equal(ev.status,'offer','control: the missed debut offer '+JSON.stringify(ev.refusal));
 const y=acceptOp(ev.offers[0],{op_id:'r21-missed-yes',after:3});
 const c4=v1Of(C(4,{date:'2026-10-15',reps:TOP,loads:95,prescribed:95,effort:e(2,1,1)})),cs=[...three,c4];
 const args=(extras,bw,r)=>{const a=foldArgs(cs,[s.resp,y,...extras],r,F0({w:bw}));captureOn(a.generation,c4,[95,95,95]);return a;};
 const exit=checkOf(args([],102.5,R1),LIFT,c4);assert.equal(exit.status,'offer','control: the exit on C4 '+JSON.stringify(exit.refusal));
 const xd=decisionOf(exit.offers[0]);
 assert.deepEqual([decisionOf(s.offer).kind,decisionOf(ev.offers[0]).kind,xd.kind,xd.target_load.scalar.value,xd.basis.load_basis.authority_refs.map(r=>r.op_id)],['earn','adopt-observed','adopt-baseline',95,['fx-resp-1','r21-missed-yes']],'control: the issued kinds and the exit refs');
 const xo=structuredClone(exit.offers[0]);if(opt.exitRefs)decisionOf(xo).basis.load_basis.authority_refs=opt.exitRefs;
 const a=args(opt.noExit?[]:[acceptOp(xo,{op_id:'r21-exit',after:4})],100,rev);
 if(layout==='unproven'){let seq=0;for(const op of Object.values(a.generation.collections.ops).filter(o=>o.class==='plan').sort((p,q)=>p.device_seq-q.device_seq)){op.device_id='fx-device-B';op.device_seq=++seq;delete op.causal_parents;}}
 const f=EFFECTS.m.foldNativeLoad(a),hp=EFFECTS.m.heldProjection(f).state;
 return {w:exOf(f.state).w,shown:exOf(hp).w,issues:b2Issues(f),exitInSpent:f.spent.some(z=>z.spend_id===xd.spend_id),queue:f.state.queue.filter(q=>q&&q.exId===LIFT).map(q=>[q.newW,!!q.done,q.state]),card:cardLoads(hp)};
}
test('L13-B1-ORDERED-CONTROL (green-kept; PM ruling (i): "a genuine host exit (refs = activeHolds at check, all proven before the Start) is unchanged in the ordered layout"; Astra L13 reduce-i6): the reduction in its own authenticated order -> R1 and R2 alike: the exit applies, w 95 shown 95, no issue, the exit spent, Q105 done/MISSED, the next card 95 on every set',()=>{
 effectsGate();
 const want={w:95,shown:95,issues:[],exitInSpent:true,queue:[[105,true,'MISSED']],card:[95,95,95]};
 for(const rev of [R1,R2])assert.deepEqual(reduceI6(rev,'ordered'),want,rev);
});
test('L13-B1-REDUCE-I6 (KNOWN-RED in round 21a, an ordinary row since 21c; Astra L13 B1 / STOP-R20B2-3, PM ruling (i): the R1 versus R2 difference is not acceptable, FC12 :3765-3766, DECISIONS:793; spec R8 UNPROVABLE ORDER): the reduction in the unproven layout -> R1 refuses exactly as R2: w 100, nothing shown (the baseline ask), DEBUT_BASIS_UNPROVEN causality [fx-close-3, fx-resp-1], RECORD_INVALID base_load [r21-missed-yes] and [r21-exit], the exit not spent, Q105 pending DEBUT. Measured on 40eb702: R2 as stated; R1 applies the exit (w 95 shown 95, card 95, Q105 SUPERSEDED)',()=>{
 effectsGate();
 const r2=reduceI6(R2,'unproven');
 assert.deepEqual(r2,{w:100,shown:null,issues:[['DEBUT_BASIS_UNPROVEN','causality',['fx-close-3','fx-resp-1'],'act'],['RECORD_INVALID','base_load',['r21-missed-yes'],'act'],['RECORD_INVALID','base_load',['r21-exit'],'act']],exitInSpent:false,queue:[[105,false,'DEBUT']],card:[null,null,null]},'R2 refuses (unchanged by the ruling)');
 assert.deepEqual(reduceI6(R1,'unproven'),r2,'R1 = R2 in the unproven layout');
});
// Round 21c (Fable R21 l1 F1 = D-R21L1-1): FC03 refsArm's non-empty clause ("ar.length > 0 &&") had no pin; Fable's mutant
// fable-m2 (the clause dropped) survived the whole FC12 strict at f5380f51.
test('R913-REFS-ARM-EMPTY R9.13 (i) (Fable R21 l1 F1 / D-R21L1-1; kills fable-m2 "return ar.every(ok)" in FC03 refsArm): the L13-B1 reduction in its ordered layout with the accepted exit\'s load_basis.authority_refs rewritten to [] (a numeric-capture adopt-baseline with EMPTY refs: a forged record, the guarded host never issues it) -> RECORD_INVALID base_load [r21-exit] active, the exit NOT spent, w 95 and Q105 done/MISSED exactly as with no exit at all (the missed debut\'s adopt-observed 95 yes), the lift held (nothing shown, the next card the baseline ask); control: without the exit record, no issue and the card 95; R1 and R2',()=>{
 effectsGate();
 for(const rev of [R1,R2]){
  const none=reduceI6(rev,'ordered',{noExit:true});
  assert.deepEqual(none,{w:95,shown:95,issues:[],exitInSpent:false,queue:[[105,true,'MISSED']],card:[95,95,95]},rev+' control: no exit record');
  assert.deepEqual(reduceI6(rev,'ordered',{exitRefs:[]}),{w:95,shown:null,issues:[['RECORD_INVALID','base_load',['r21-exit'],'act']],exitInSpent:false,queue:[[105,true,'MISSED']],card:[null,null,null]},rev+' empty authority_refs: refused, not spent');
 }
});
for(const seed of [20262146,20262505,20262924])test('L13-B1-SEED-'+seed+' (KNOWN-RED in round 21a, an ordinary row since 21c; STOP-R20B2-3 walk seed, PM ruling (i); R8 propertySequence8 I6 "unprovable order differs under" rev 2): the whole walk at this seed yields no counterexample. Measured on 40eb702: I6 (R1 applies the exit, R2 refuses RECORD_INVALID base_load)',()=>{
 effectsGate();
 propertySequence8(seed);
});

// ======================================================================
// ROUND 21b (spec R9.13 at e092afa, Fable R13-l1 ACCEPT WITH NAMED DEBTS D-R13L1-1..4; PM rulings (i)-(v), DECISIONS:819).
// (i) is pinned by round 21a's L13-B1-* rows (ordinary rows since round 21c) and R913-REFS-ARM-EMPTY; below: (iii), (iv) and (v).
// ======================================================================
// (v) LEGACY-OVER-NULL: an admitted base whose fx-press has w null (never held) and a pending legacy DEBUT 60, beside fx-row at
// w 55 with its own pending legacy DEBUT 60 (the STOP-R20B1-1 class; part C walk seeds 20264592, 20273214, 20271211).
function legacyOverNullBase(){
 const b=withRow({w:null});b.exercises.find(x=>x.id===ROW).w=55;
 b.queue.push({exId:LIFT,kind:'debut',done:false,state:'DEBUT',newW:60,t:'SYNTHETIC legacy debut press'},{exId:ROW,kind:'debut',done:false,state:'DEBUT',newW:60,t:'SYNTHETIC legacy debut row'});
 return b;
}
const legacyPending=(f,lift=LIFT)=>f.state.queue.filter(q=>q&&q.exId===lift&&!q.done&&typeof q.native_load_spend!=='string').map(q=>[q.state,q.newW]);
test('R913-LEGACY-OVER-NULL-UNHELD R9.13 (v) (PM ruling (v), DECISIONS:819; red on 40eb702: the capture refuses the whole day ENGINE_CAPTURE_BASELINE_UNPROVEN, W/engine-capture.cjs:67): a never-held fx-press with w null and a pending legacy DEBUT 60 in the admitted base, beside fx-row at w 55 with its own pending legacy DEBUT 60 -> the fold state keeps both entries, the registered projection hides fx-press\'s (w null) and keeps fx-row\'s; fx-press\'s card is the baseline ask and the day prepares; fx-row\'s debut takes the structural slot (60 on every set); the check on fx-press\'s baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue (E/native-load.cjs:222; N-Q2); after that completion w stays null, no authority and no adoption receipt (D-R13L1-4); typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,b=legacyOverNullBase();
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([b2Issues(f),legacyPending(f),legacyPending(f,ROW)],[[],[['DEBUT',60]],[['DEBUT',60]]],L+' the fold state keeps both legacy entries; fx-press is never held');
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,hp.queue.filter(q=>q&&q.exId===ROW&&!q.done).length],[0,1],L+' the registered projection hides the w-null lift\'s legacy entry only');
  let row;try{row=cardLoads(hp,{lift:ROW});}catch(err){row=String(err&&err.code||err);}
  assert.deepEqual([b39Card(hp),row],[[null,null,null],[60,60,60]],L+' fx-press is the baseline ask and the day prepares; fx-row\'s debut takes the structural slot');
  const c1t=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c1=v1?v1Of(c1t):c1t;
  const a=foldArgs([c1],[],rev,legacyOverNullBase());if(v1)captureOn(a.generation,c1,[null,null,null]);
  const ev=checkOf(a,LIFT,c1);
  assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' the check on the baseline-ask completion '+JSON.stringify(ev.refusal||ev.offers));
  const f1=EFFECTS.m.foldNativeLoad(a),ex1=exOf(f1.state);
  assert.deepEqual([ex1.w,ex1.native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),legacyPending(f1)],[null,true,false,[['DEBUT',60]]],L+' D-R13L1-4: w stays null, no authority, no adoption receipt, the legacy entry pending');
 }
});
test('R913-LEGACY-OVER-NULL-CONTROL R9.13 (v) (green-kept; kills the mutant that hides on a numeric-w lift too): the same pending legacy DEBUT 60 on fx-press at w 55 stays visible in the registered projection and the card prescribes 60 on every set (E/today.cjs:98); R1 and R2',()=>{
 effectsGate();
 for(const rev of [R1,R2]){const b=F0({w:55});b.queue.push({exId:LIFT,kind:'debut',done:false,state:'DEBUT',newW:60,t:'SYNTHETIC legacy debut press'});
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).map(q=>[q.state,q.newW]),b39Card(hp)],[[['DEBUT',60]],[60,60,60]],rev);
 }
});
// (iv) A-LEGACY-VECTOR (owner approval DECISIONS:819 "Spread it evenly"): the product conversion (ALV, read out of
// L/source-admission.mjs by its markers, before propertySequence8) over invented old-app states at fx-press w 100.
const alvGate=()=>assert.ok(ALV.fn,'RED A_LEGACY_VECTOR_ABSENT: '+ALV.reason+' (spec R9.13 (iv): L/source-admission.mjs replay())');
const LEGQ=(p={})=>({exId:LIFT,kind:'debut',done:false,state:'DEBUT',newW:105,t:'SYNTHETIC legacy debut',...p});
const alvState=(qs,patch={w:100,wSets:[100,100,95]})=>{const s=F0(patch);s.queue.push(...qs.map(q=>structuredClone(q)));return s;};
const alvCard=s=>b39Card(EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs([],[],R1,s))).state);
test('R913-ALV-PRODUCT R9.13 (iv) (red on 40eb702: absent): L/source-admission.mjs carries the conversion between its A-LEGACY-VECTOR markers as the exported dependency-free function legacyVectorAdmission, and replay() calls it on the replayed state immediately after the document-lift append and before any family reads the state (the ORDERING rule; kills the mutant that runs it after the families)',()=>{
 alvGate();
 const src=ALV.src,append=src.indexOf('state.retirements={...(state.retirements||{}),[row.id]:currentDay()};'),call=src.indexOf('legacyVectorAdmission(state);'),facts=src.indexOf('const facts=reading({operations:ops');
 assert.ok(append>0&&call>append&&facts>call,'placement: append '+append+' < call '+call+' < first family read '+facts);
 assert.equal(src.split('legacyVectorAdmission(state);').length,2,'called exactly once');
});
test('R913-ALV-CONVERT R9.13 (iv) (red on 40eb702: no newWSets, and the capture refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED at W/engine-capture.cjs:83): fx-press w 100 wSets [100,100,95] with a pending legacy DEBUT newW 105 and no newWSets -> the entry gets newWSets [105,105,100], nothing is named and every other byte is unchanged; the registered projection\'s card then captures [105,105,100] through the real capture',()=>{
 effectsGate();
 const s=alvState([LEGQ()]);
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvGate();
 const before=structuredClone(s),named=ALV.fn(s),q=s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut');
 assert.deepEqual([named,q.newWSets],[[],[105,105,100]],'the shifted vector (E/earn.cjs:88 shape)');
 const back=structuredClone(s);delete back.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newWSets;
 assert.deepEqual(back,before,'nothing else is written');
 assert.ok(q.newWSets.every(x=>x<=q.newW),'no set above the old card newW');
 assert.deepEqual(alvCard(s),[105,105,100],'the card captures the converted vector');
});
test('R913-ALV-KINDS R9.13 (iv) (green-kept except the unlock case, red on 40eb702): an unlock entry is converted the same way; a PROPOSED entry, a done entry, an entry already carrying newWSets, a native entry and an entry on a lift without wSets are byte-identical after the conversion (kills the mutants that convert PROPOSED entries or also write newW or wSets)',()=>{
 alvGate();
 const u=alvState([LEGQ({kind:'unlock'})]);assert.deepEqual([ALV.fn(u),u.queue.find(x=>x&&x.kind==='unlock').newWSets],[[],[105,105,100]],'unlock');
 const same=[['PROPOSED',alvState([LEGQ({state:'PROPOSED'})])],['done',alvState([LEGQ({done:true,state:'ESTABLISH'})])],['own newWSets',alvState([LEGQ({newW:110,newWSets:[110,110,105]})])],
  ['native',alvState([LEGQ({native_load_spend:'["native-load","fx-press",null,null,[]]'})])],['no wSets',alvState([LEGQ()],{w:100})],['w-null lift, no wSets',alvState([LEGQ({newW:60})],{w:null})]];
 for(const [name,s] of same){const before=JSON.stringify(s);assert.deepEqual(ALV.fn(s),[],name+': nothing named');assert.equal(JSON.stringify(s),before,name+': byte-identical');}
});
test('R913-ALV-P R9.13 (iv) (characterization, open question N-Q1): an entry on a per-set-weight lift that fails PRECONDITION P (a set above w, a non-number set, a non-numeric w) is left unconverted and named; its day refuses as today (nothing raised)',()=>{
 alvGate();
 for(const [name,patch] of [['a set above w',{w:100,wSets:[100,105]}],['a non-number set',{w:100,wSets:[100,'x',95]}],['w not a number',{w:'BW',wSets:[100,100,95]}]]){
  const s=alvState([LEGQ()],patch),before=JSON.stringify(s),named=ALV.fn(s);
  assert.deepEqual(named,[{exId:LIFT,kind:'debut',newW:105,w:patch.w,wSets:patch.wSets}],name+': named');assert.equal(JSON.stringify(s),before,name+': unconverted');
 }
 assert.equal(alvCard(alvState([LEGQ()],{w:100,wSets:[100,105]})),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','the day refuses as today');
});
test('R913-ALV-IDEMPOTENT R9.13 (iv): a converted entry is never converted again: the conversion run twice (a reopen or a re-admission of the same source replays it) gives byte-identical state and names the same out-of-precondition entries',()=>{
 alvGate();
 const s=alvState([LEGQ(),LEGQ({kind:'unlock',t:'SYNTHETIC unlock'}),{exId:ROW,kind:'debut',done:false,state:'DEBUT',newW:105,t:'SYNTHETIC row debut'}]);
 s.exercises.push({...structuredClone(exOf(s)),id:ROW,n:'Fx Row',wSets:[100,105]});
 const n1=ALV.fn(s),j1=JSON.stringify(s),n2=ALV.fn(s);
 assert.equal(JSON.stringify(s),j1,'byte-identical after a second run');assert.deepEqual(n2,n1,'the same named entries');
 assert.deepEqual(n1.map(x=>x.exId),[ROW],'fx-row fails P');
});
test('R913-ALV-LAND R9.13 (iv) (E/writers.cjs:270): after the conversion a completion at [105,105,100] on the debut card lands it through the old app\'s own writer: w 105, wSets [105,105,100], the entry ESTABLISH; no load above 105 anywhere',()=>{
 alvGate();
 const s=alvState([LEGQ()]);ALV.fn(s);
 const E=engineAt(CARD_DAY),r=E.completeSession(s,CARD_DAY,[{id:LIFT,w:105,reps:[10,10,10],rir:2,rirSets:[2,1,1],tgt:[10,10,10],isDebutNow:true}],{clean:true}),ex=r.s.exercises.find(x=>x.id===LIFT);
 assert.deepEqual([ex.w,ex.wSets,r.s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').state],[105,[105,105,100],'ESTABLISH']);
 assert.ok(Math.max(ex.w,...ex.wSets)<=105,'no load above the old card');
});
// (iii) D-L13-TYPED-C2, a NAMED CARRIED LIMIT (PM ruling (iii): Joe's trial uses host v1; typed-v2 exit parity is carried).
// CARRIED-LIMIT convention (Fable D-R20C-3): the title names the limit, the row asserts the CURRENT output, and it is flipped to
// the fixed expectation when the limit is paid, never deleted. C2 typed v2 exactly as Astra's P/probes.cjs B5_TYPED_C2 builds it.
const typedC2=(a,c2)=>{const en=a.workoutFacts.sessions.find(x=>x.start_op_id===c2.start).record.entries[0];en.profile='earned/performed-lift/v2';
 for(const slot of en.slots)slot.prescribed_load={state:'specified',source:{value:105,unit:'lb'}};return a;};
test('R913-TYPED-C2-CARRIED CARRIED LIMIT D-L13-TYPED-C2 (spec R9.13 (iii); PM ruling (iii), DECISIONS:819; STOP-R20B2-1 = Fable D-R20L1-2; Astra L13 B5_TYPED_C2): (a) the L12-B5 input at base 102.5 with C2 typed v2 (prescribed_load 105 on every original slot): the check on C2 refuses NATIVE_LOAD_EFFECT_CONFLICT field load_basis refs [y1 response Ref] (FC01 step 2\'s typed comparison against planNow null on the held projection, E/native-load.cjs:229/:247; the hold\'s own refusal, FC03 holdRefusal) - the CARRIED output, no offer, nothing raised; (b) control: the same input with host v1 C2 is offered exactly [adopt-baseline 105] naming [y1 response Ref]; (c) NO TRAP for typed v2: a typed-v2 C3 on the baseline ask, its Start proven after y1\'s hold, is offered exactly [adopt-baseline 60] naming [y1 response Ref] and its yes applies as exit (b): w 60, wSets absent, y1\'s hold superseded; R1 and R2',()=>{
 effectsGate();
 const s=b5Fixture(false),kinds=ev=>ev.status==='offer'?ev.offers.map(o=>{const d=decisionOf(o);return [d.kind,d.target_load.scalar&&d.target_load.scalar.value,d.basis.load_basis.authority_refs];}):[ev.refusal.code,ev.refusal.field,ev.refusal.refs];
 for(const rev of [R1,R2]){
  assert.deepEqual(kinds(checkOf(typedC2(s.at([],102.5,rev),s.c2),LIFT,s.c2)),['NATIVE_LOAD_EFFECT_CONFLICT','load_basis',[ref('l12-y1')]],rev+' (a) CARRIED: typed-v2 C2 is refused the exit');
  assert.deepEqual(kinds(checkOf(s.at([],102.5,rev),LIFT,s.c2)),[['adopt-baseline',105,[ref('l12-y1')]]],rev+' (b) control: host v1 C2 is offered the exit');
  const c3=C(3,{date:'2026-10-15',reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)});
  const at3=extra=>{const a=typedC2(s.at(extra,102.5,rev,[],[c3]),s.c2);captureOn(a.generation,c3,[null,null,null]);return a;};
  const ev=checkOf(at3([]),LIFT,c3);
  assert.deepEqual(kinds(ev),[['adopt-baseline',60,[ref('l12-y1')]]],rev+' (c) NO TRAP: the typed-v2 baseline-ask C3 is offered exit (b)');
  const f=EFFECTS.m.foldNativeLoad(at3([acceptOp(ev.offers[0],{op_id:'r21b-c3-exit',after:3})])),ex=exOf(f.state);
  assert.deepEqual([ex.w,Object.hasOwn(ex,'wSets'),b2Issues(f)],[60,false,[['EFFECT_CONFLICT','load_basis',['l12-y1'],'sup']]],rev+' (c) the yes applies as exit (b) '+JSON.stringify(f.issues));
 }
});

// ======================================================================
// ROUND 22 (test bytes only; Astra L14 REJECT of bd7654a on four TEST-COVERAGE blockers B1-B4; the head product is unchanged:
// FC03 b25d2e61, L/source-admission.mjs 10bd5cfb, FC01 92a4a0b4). Each row pins a boundary spec R9.13 states that one of
// Astra's single-clause mutants (P/own-manifest.json: L14-M01 in FC03 heldProjection; L14-M02, -M03 and -M10 in the
// A-LEGACY-VECTOR conversion) crossed while all 235 FC12 rows stayed green. Every value is invented.
// ======================================================================
// L14-B1: R9.13 (v) hides the legacy entry of every lift whose projected w is "null or ABSENT". Every earlier row used a
// PRESENT null (F0({w:null}); FA03 withPress {w:null}); F0({w:undefined}) deletes the field, so these rows use the ABSENT form.
const absentW=(...qs)=>{const b=F0({w:undefined});b.queue.push(...qs.map(q=>structuredClone(q)));return b;};
const wField=f=>Object.hasOwn(exOf(f.state),'w')?exOf(f.state).w:'ABSENT';
const l14c1=v1=>{const c=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)});return v1?v1Of(c):c;};
const l14at=v1=>(extra,base,r,cs)=>{const a=foldArgs(cs,extra,r,base);if(v1)for(const c of cs)captureOn(a.generation,c,[null,null,null]);return a;};
test('L14-B1-ABSENT-W-PROJECTION R9.13 (v) LEGACY-OVER-NULL ("every lift whose projected w is null or ABSENT"; EXPECTED CARD; THE CHECK) (Astra L14 B1, mutant L14-M01 "x.w == null -> x.w === null" in FC03 heldProjection, which survived 235/235): a never-held fx-press with NO w field and a pending legacy DEBUT 60 in the admitted base -> the fold keeps w ABSENT and the entry pending, the registered projection hides it, the card is the baseline ask and the day prepares (under M01 the entry is shown and the capture refuses ENGINE_CAPTURE_BASELINE_UNPROVEN); the check on its baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue, and after it w stays ABSENT with no authority and no adoption receipt; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,absentW(LEGQ({newW:60})))),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([wField(f),b2Issues(f),legacyPending(f)],['ABSENT',[],[['DEBUT',60]]],L+' the fold keeps w ABSENT and the legacy DEBUT 60 pending; never held');
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,b39Card(hp)],[0,[null,null,null]],L+' R9.13 (v): the registered projection hides the entry; the card is the baseline ask and the day prepares');
  const c1=l14c1(v1),a1=l14at(v1)([],absentW(LEGQ({newW:60})),rev,[c1]),ev1=checkOf(a1,LIFT,c1);
  assert.deepEqual([ev1.status,ev1.refusal&&ev1.refusal.code,ev1.refusal&&ev1.refusal.refs,ev1.refusal&&ev1.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' the check on the baseline-ask completion '+JSON.stringify(ev1.refusal||ev1.offers));
  const f1=EFFECTS.m.foldNativeLoad(a1);
  assert.deepEqual([wField(f1),exOf(f1.state).native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),legacyPending(f1)],['ABSENT',true,false,[['DEBUT',60]]],L+' after that completion: w ABSENT, no authority, no adoption receipt, the entry pending');
 }
});
test('L14-B1-ABSENT-W-UNDO R9.13 (v) LEGACY-OVER-NULL ("null or ABSENT"), the reachable RECORDED variant of Astra L14 B1 (mutant L14-M01; the ABSENT-w form of R20-RESTORE-OVER-LEGACY): C1 at 60 on the ABSENT-w baseline ask, its [adopt-baseline 60] yes, its RESTORE Undo recorded while applied, then the base re-admitted at w 100 carrying a pending legacy DEBUT 105 -> the Undo restores the ABSENT w under the pending DEBUT 105, the registered projection hides it and the next card is the baseline ask and the day prepares (under M01 the capture refuses the day ENGINE_CAPTURE_BASELINE_UNPROVEN); control: not re-admitted, the Undo leaves w ABSENT and the baseline ask; the check on a later baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue and after it w stays ABSENT, the authority unchanged, no adoption receipt; typed v2 and host v1, R1 and R2',()=>{
 effectsGate();
 const readmitted=()=>{const b=F0({w:100});b.queue.push(LEGQ());return b;};
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
  const c1=l14c1(v1),at=(extra,base,r,cs=[c1])=>l14at(v1)(extra,base,r,cs);
  const ev=checkOf(at([],absentW(),R1),LIFT,c1);
  assert.deepEqual(ev.offers.map(o=>[decisionOf(o).kind,decisionOf(o).target_load.scalar.value]),[['adopt-baseline',60]],L+' control: C1 on the ABSENT-w baseline ask is offered [adopt-baseline 60] '+JSON.stringify(ev.refusal));
  const d=decisionOf(ev.offers[0]),y=acceptOp(ev.offers[0],{op_id:'l14-absent-adopt',after:1});
  assert.equal(exOf(EFFECTS.m.foldNativeLoad(at([y],absentW(),rev)).state).w,60,L+' control: the yes applies 60');
  const u=checkOf(at([y],absentW(),R1),LIFT,c1,{compensate:d.spend_id});assert.equal(u.status,'offer',L+' control: the Undo while applied '+JSON.stringify(u.refusal));
  const ud=decisionOf(u.offers[0]);assert.deepEqual([ud.base_load.scalar,ud.target_load.scalar],[lb(60),null],L+' control: a RESTORE (base 60, target null)');
  const z=acceptOp(u.offers[0],{op_id:'l14-absent-undo',after:1});
  const c0=EFFECTS.m.foldNativeLoad(at([y,z],absentW(),rev));
  assert.deepEqual([wField(c0),b2Active(c0),b39Card(EFFECTS.m.heldProjection(c0).state)],['ABSENT',[],[null,null,null]],L+' control: not re-admitted, the Undo restores w ABSENT and the baseline ask '+JSON.stringify(c0.issues));
  const fr=EFFECTS.m.foldNativeLoad(at([y,z],readmitted(),rev)),hr=EFFECTS.m.heldProjection(fr).state;
  assert.deepEqual([wField(fr),legacyPending(fr)],['ABSENT',[['DEBUT',105]]],L+' the Undo restores the ABSENT w under the pending legacy DEBUT 105 '+JSON.stringify(fr.issues));
  assert.deepEqual([hr.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,b39Card(hr)],[0,[null,null,null]],L+' R9.13 (v): the registered projection hides it; the next card is the baseline ask and the day prepares');
  const c2t=C(2,{date:'2026-10-08',reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c2=v1?v1Of(c2t):c2t;
  const a2=at([y,z],readmitted(),rev,[c1,c2]),ev2=checkOf(a2,LIFT,c2);
  assert.deepEqual([ev2.status,ev2.refusal&&ev2.refusal.code,ev2.refusal&&ev2.refusal.refs,ev2.refusal&&ev2.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c2.close)],'queue'],L+' the check on a later baseline-ask completion '+JSON.stringify(ev2.refusal||ev2.offers));
  const f2=EFFECTS.m.foldNativeLoad(a2);
  assert.deepEqual([wField(f2),JSON.stringify(exOf(f2.state).native_load_authority),JSON.stringify(f2.state).includes('adopt:'+LIFT)],['ABSENT',JSON.stringify(exOf(fr.state).native_load_authority),false],L+' after it: w ABSENT, the authority unchanged, no adoption receipt');
 }
});
// L14-B2: R9.13 (iv) DEFINITIONS take "q.newWSets === undefined" (the test W/engine-capture.cjs makes before its :83 refusal);
// a PRESENT null newWSets is an existing present-null legacy load-vector shape (D-L14-LEGACY-NULL), never read as absent.
test('L14-B2-EXPLICIT-NULL-NEWWSETS R9.13 (iv) DEFINITIONS ("q.newWSets === undefined") and UNCHANGED BY THE RULE ("entries that already carry newWSets"; "a legacy present-null wSets with a numeric w ... refuses at W/engine-capture.cjs:83 as today") (Astra L14 B2 and D-L14-LEGACY-NULL, mutant L14-M02 "q.newWSets!==undefined -> q.newWSets!=null", which survived 235/235): fx-press w 100 wSets [100,100,95] with a pending legacy DEBUT newW 105 whose own newWSets is PRESENT null -> not a legacy scalar structural entry: nothing named, every byte unchanged (newWSets stays null), and the day still refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (the carried present-null limit; nothing raised; M02 writes [105,105,100] and the day captures it); the present-null wSets shape (w 100, wSets null, a scalar DEBUT 105) is likewise untouched and refuses as today; control: the same entry with newWSets ABSENT converts to [105,105,100]',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newWSets:null})]),before=JSON.stringify(s),named=ALV.fn(s);
 assert.deepEqual([named,JSON.stringify(s)===before,s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newWSets],[[],true,null],'present-null newWSets: nothing named, byte-identical, still null');
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','present-null newWSets: the day refuses as before admission');
 const n=alvState([LEGQ()],{w:100,wSets:null}),nb=JSON.stringify(n);
 assert.deepEqual([ALV.fn(n),JSON.stringify(n)===nb],[[],true],'present-null wSets: nothing named, byte-identical');
 assert.equal(alvCard(n),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','present-null wSets: the day refuses as today');
 const c=alvState([LEGQ()]);
 assert.deepEqual([ALV.fn(c),c.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newWSets],[[],[105,105,100]],'control: an ABSENT newWSets converts (R913-ALV-CONVERT)');
});
// L14-B3 and L14-B4: the CONVERSION is exactly ex.wSets.map((x) => x + (q.newW - ex.w)), a uniform shift by newW - w of the
// imported vector as it stands (Fable R21 l1 F4), with no rounding; every earlier ALV input had its first set equal to w and
// integer loads, so neither the anchor (ex.w) nor the exact value was pinned.
const alvRow=(s,newWSets,label)=>{const before=structuredClone(s),named=ALV.fn(s),q=s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut');
 assert.deepEqual([named,q.newWSets],[[],newWSets],label+': the shifted vector');
 const back=structuredClone(s);delete back.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newWSets;
 assert.deepEqual(back,before,label+': nothing else is written (newW, w, wSets and every other byte unchanged)');
 assert.ok(q.newWSets.every(x=>x<=q.newW),label+': no set above the old card newW '+q.newW+' '+JSON.stringify(q.newWSets));
 assert.deepEqual(alvCard(s),newWSets,label+': the card captures the converted vector through the real capture');};
test('L14-B3-SHIFT-ANCHOR-FIRST-BELOW-W R9.13 (iv) CONVERSION ("q.newWSets = ex.wSets.map((x) => x + (q.newW - ex.w))"; PROPERTIES: a uniform shift that keeps the shape of ex.wSets exactly, non-monotone vectors included, Fable R21 l1 F4) (Astra L14 B3, mutant L14-M03 "the shift anchored on ex.wSets[0] instead of ex.w", which survived 235/235): fx-press w 100 with wSets [95,100,97.5] (first set below w, non-monotone; P holds) and a pending legacy DEBUT newW 107.5 -> newWSets [102.5,107.5,105] (every set + 7.5), nothing named, w 100 and wSets [95,100,97.5] unchanged, no set above 107.5; the card captures [102.5,107.5,105]; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. M03 shifts by 12.5 and writes [107.5,112.5,110], a set above the old card',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newW:107.5})],{w:100,wSets:[95,100,97.5]});
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[102.5,107.5,105],'first set below w');
});
test('L14-B4-FRACTIONAL-ALV R9.13 (iv) CONVERSION (the exact shifted value, "nothing else is written"; PROPERTIES "every element is <= q.newW") (Astra L14 B4, mutant L14-M10 "Math.round around the shifted load", which survived 235/235): fx-press w 100, inc 2.5, wSets [100,100,95] with a pending legacy DEBUT at the fractional newW 102.5 -> newWSets [102.5,102.5,97.5], nothing named, w 100 and newW 102.5 unchanged, no set above 102.5; the card captures [102.5,102.5,97.5]; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. M10 writes [103,103,98], two sets above newW without a yes',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newW:102.5})],{w:100,wSets:[100,100,95],inc:2.5});
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[102.5,102.5,97.5],'fractional newW');
});

// ======================================================================
// ROUND 22b (test bytes only; Fable R22 l1 REJECT of the round-22 working tree on blocker B-R22-1, with named debt D-R22-1,
// both paid here by PM ruling; the head product is unchanged: FC03 b25d2e61, L/source-admission.mjs 10bd5cfb, FC01 92a4a0b4,
// W/engine-capture.cjs fa68a748). Every value is invented.
// ======================================================================
// B-R22-1: R9.13 (iv) CONVERSION anchors the shift on the lift's own scalar ex.w. Every earlier ALV input had max(wSets) = w
// (alvState's [100,100,95], L14-B3's [95,100,97.5], the walk's [w,w,w-5]), so a shift anchored on Math.max(...ex.wSets)
// (Fable's mutant N5) agreed with ex.w on all of them; these two inputs have EVERY set strictly below w (P still holds).
test('L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W R9.13 (iv) CONVERSION ("q.newWSets = ex.wSets.map((x) => x + (q.newW - ex.w))": the anchor is the lift\'s own scalar ex.w, never a member of ex.wSets; PROPERTIES "every element is <= q.newW") (Fable R22 l1 B-R22-1, mutant N5 "the shift anchored on Math.max(...ex.wSets) instead of ex.w", which survived 240/240 because every earlier ALV input had max(wSets) = w): fx-press w 100 with wSets [95,95,90] (every set strictly below w; P holds) and a pending legacy DEBUT newW 105 -> newWSets exactly [100,100,95] (every set + 5), nothing named, w 100, wSets [95,95,90] and newW 105 unchanged and nothing else written, no set above 105; the card captures [100,100,95] through the real capture; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. N5 shifts by 10 and writes [105,105,100], 5 lb heavier on every set than the approved conversion (every set still <= 105, so only the formula tells them apart); L14-M03 (the ex.wSets[0] anchor) writes the same',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ()],{w:100,wSets:[95,95,90]});
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[100,100,95],'every set below w');
 assert.deepEqual([exOf(s).w,exOf(s).wSets,s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newW],[100,[95,95,90],105],'every set below w: w, wSets and newW unchanged');
});
test('L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W-FRACTIONAL R9.13 (iv) CONVERSION (the fractional twin of L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W: the anchor is ex.w and the shifted value is exact; PROPERTIES "every element is <= q.newW") (Fable R22 l1 B-R22-1, mutant N5): fx-press w 100, inc 2.5, wSets [97.5,97.5,92.5] (every set strictly below w; P holds) and a pending legacy DEBUT at the fractional newW 102.5 -> newWSets exactly [100,100,95] (every set + 2.5), nothing named, w 100, wSets [97.5,97.5,92.5] and newW 102.5 unchanged and nothing else written, no set above 102.5; the card captures [100,100,95]; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. N5 (and L14-M03) shift by 5 and write [102.5,102.5,97.5]',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newW:102.5})],{w:100,wSets:[97.5,97.5,92.5],inc:2.5});
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[100,100,95],'every set below w, fractional');
 assert.deepEqual([exOf(s).w,exOf(s).wSets,s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newW],[100,[97.5,97.5,92.5],102.5],'every set below w, fractional: w, wSets and newW unchanged');
});
// D-R22-1: R9.13 (iv) DEFINITIONS take a queue item with "q.done falsy" and (v) RULE hides an entry that is "not done"; an
// old-app entry that carries NO done key is inside both. Every earlier fixture wrote done:false, so a predicate on done === false
// (Fable's mutant N4 in the conversion, E1 in FC03 heldProjection's hide predicate) agreed with the spec on all of them.
test('R22-ABSENT-DONE-ALV R9.13 (iv) DEFINITIONS ("a LEGACY SCALAR STRUCTURAL ENTRY is a queue item q of S with q.done falsy": an entry with NO done key is one) and CONVERSION (Fable R22 l1 D-R22-1, mutant N4 "q.done|| -> q.done!==false||" in the A-LEGACY-VECTOR conversion, which survived 240/240 because every fixture wrote done:false): fx-press w 100 wSets [100,100,95] with a pending legacy DEBUT newW 105 whose done key is ABSENT -> converted exactly like its done:false twin: newWSets [105,105,100], nothing named, the done key still absent and nothing else written, no set above 105; the card captures [105,105,100]; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED; the done:false twin names the same (nothing) and ends in the same state apart from its own done:false key. N4 skips the entry: no newWSets, so the state stays the unconverted control whose day refuses',()=>{
 effectsGate();alvGate();
 const noDone=()=>{const q=LEGQ();delete q.done;return alvState([q]);},legacy=s=>s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut');
 const s=noDone();
 assert.equal(Object.hasOwn(legacy(s),'done'),false,'the fixture: the entry carries no done key');
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[105,105,100],'no done key');
 assert.equal(Object.hasOwn(legacy(s),'done'),false,'no done key: the key is still absent after the conversion');
 const twin=alvState([LEGQ()]);
 assert.deepEqual(ALV.fn(twin),[],'the done:false twin: nothing named');
 delete legacy(twin).done;
 assert.deepEqual(twin,s,'converted exactly like the done:false twin (the same state apart from the twin\'s own done:false key)');
});
test('R22-ABSENT-DONE-HIDDEN R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== \'string\', not done, kind in HIDDEN_LEGACY_KINDS)": an entry with NO done key is unfinished), EXPECTED CARD and THE CHECK (Fable R22 l1 D-R22-1, mutant E1 "!q.done -> q.done === false" in FC03 heldProjection\'s hide predicate, which survived 240/240 and FA03 48/48 because every fixture wrote done:false): the R913-LEGACY-OVER-NULL-UNHELD base (fx-press never held at w null, fx-row at w 55, each with a pending legacy DEBUT 60) with fx-press\'s entry carrying NO done key -> the fold state keeps both entries pending, fx-press\'s key still absent; the registered projection hides fx-press\'s entry and keeps fx-row\'s, exactly like the done:false twin (the same registered projection); fx-press\'s card is the baseline ask and the day prepares, fx-row\'s debut takes the structural slot; the check on fx-press\'s baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue, and after it w stays null, no authority, no adoption receipt, the entry pending with no done key; typed v2 and host v1, R1 and R2. Under E1 the entry is shown and the capture refuses the day ENGINE_CAPTURE_BASELINE_UNPROVEN',()=>{
 effectsGate();
 const pressQ=s=>s.queue.find(q=>q&&q.t==='SYNTHETIC legacy debut press'),noDone=()=>{const b=legacyOverNullBase();delete pressQ(b).done;return b;};
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,b=noDone();
  assert.equal(Object.hasOwn(pressQ(b),'done'),false,L+' the fixture: fx-press\'s legacy entry carries no done key');
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([b2Issues(f),legacyPending(f),legacyPending(f,ROW),Object.hasOwn(pressQ(f.state),'done')],[[],[['DEBUT',60]],[['DEBUT',60]],false],L+' the fold state keeps both legacy entries pending, fx-press\'s with no done key; fx-press is never held');
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,hp.queue.filter(q=>q&&q.exId===ROW&&!q.done).length,b39Card(hp)],[0,1,[null,null,null]],L+' R9.13 (v): the registered projection hides the w-null lift\'s entry with no done key, and only it; its card is the baseline ask');
  const twin=EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,legacyOverNullBase()))).state;
  assert.deepEqual(hp,twin,L+' exactly like the done:false twin: the same registered projection');
  let row;try{row=cardLoads(hp,{lift:ROW});}catch(err){row=String(err&&err.code||err);}
  assert.deepEqual([b39Card(hp),row],[[null,null,null],[60,60,60]],L+' EXPECTED CARD: fx-press is the baseline ask and the day prepares; fx-row\'s debut takes the structural slot');
  const c1t=C(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c1=v1?v1Of(c1t):c1t;
  const a=foldArgs([c1],[],rev,noDone());if(v1)captureOn(a.generation,c1,[null,null,null]);
  const ev=checkOf(a,LIFT,c1);
  assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on the baseline-ask completion '+JSON.stringify(ev.refusal||ev.offers));
  const f1=EFFECTS.m.foldNativeLoad(a),ex1=exOf(f1.state);
  assert.deepEqual([ex1.w,ex1.native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),legacyPending(f1),Object.hasOwn(pressQ(f1.state),'done')],[null,true,false,[['DEBUT',60]],false],L+' after that completion: w null, no authority, no adoption receipt, the entry pending with no done key');
 }
});

// ======================================================================
// ROUND 22c (test bytes only; Fable R22 l2 REJECT of the round-22b working tree on blocker B-R22L2-1, with named debts
// D-R22L2-1 and D-R22L2-2, all three paid here by PM ruling; the head product is unchanged: FC03 b25d2e61,
// L/source-admission.mjs 10bd5cfb, FC01 92a4a0b4, W/engine-capture.cjs fa68a748). Every value is invented.
// ======================================================================
// B-R22L2-1: R9.13 (v) RULE hides "every unfinished LEGACY debut/unlock entry (... kind in HIDDEN_LEGACY_KINDS) of EVERY lift
// whose projected w is null or ABSENT", and its INVARIANT reads "no registered projection carries an unfinished debut/unlock
// entry, native or legacy, of a lift whose w is null or ABSENT". Every earlier legacy entry over a null or ABSENT w was kind
// 'debut', so a hide predicate narrowed to q.kind === 'debut' (Fable's mutant X6 in FC03 heldProjection) agreed with the spec
// on all of them. These two rows are the UNLOCK twins of R913-LEGACY-OVER-NULL-UNHELD (w null) and
// L14-B1-ABSENT-W-PROJECTION (w ABSENT): the same entry with kind 'unlock' and nothing else changed but its label (state
// 'DEBUT' as R913-ALV-KINDS's unlock; no rebuild writer mints kind 'unlock', so every such entry is an admitted old-app entry).
const r22cUnlockQ=(p={})=>({exId:LIFT,kind:'unlock',done:false,state:'DEBUT',newW:60,t:'SYNTHETIC legacy unlock press',...p});
function r22cNullBase(){const b=legacyOverNullBase(),i=b.queue.findIndex(q=>q&&q.t==='SYNTHETIC legacy debut press');b.queue[i]=r22cUnlockQ();return b;}
const r22cKinds=(f,lift=LIFT)=>f.state.queue.filter(q=>q&&q.exId===lift&&!q.done&&typeof q.native_load_spend!=='string').map(q=>[q.kind,q.state,q.newW]);
test('R22L2-UNLOCK-OVER-NULL-UNHELD R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== \'string\', not done, kind in HIDDEN_LEGACY_KINDS) of EVERY lift whose projected w is null or ABSENT"), INVARIANT ("no registered projection carries an unfinished debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT"), EXPECTED CARD and THE CHECK (Fable R22 l2 B-R22L2-1, mutant X6 "HIDDEN_LEGACY_KINDS.has(q.kind) -> q.kind === \'debut\'" in FC03 heldProjection\'s hide predicate, which survived 244/244 and FA03 48/48 because every legacy entry over a null or ABSENT w was kind debut): the UNLOCK twin of R913-LEGACY-OVER-NULL-UNHELD: fx-press never held at w null with a pending legacy UNLOCK newW 60, beside fx-row at w 55 with its own pending legacy DEBUT 60 -> the fold state keeps both entries pending (fx-press\'s still kind unlock), no issue; the registered projection hides fx-press\'s unlock and keeps fx-row\'s debut, exactly like the debut twin (the same registered projection); fx-press\'s card is the baseline ask and the day prepares, fx-row\'s debut takes the structural slot; the check on fx-press\'s baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue as the debut row does (E/native-load.cjs:222; STRUCTURAL at :20 includes unlock), and nothing is written: after it w stays null, no authority, no adoption receipt, the unlock pending; typed v2 and host v1, R1 and R2. Under X6 the unlock is shown and the capture refuses the day ENGINE_CAPTURE_BASELINE_UNPROVEN',()=>{
 effectsGate();
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,b=r22cNullBase();
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([b2Issues(f),r22cKinds(f),r22cKinds(f,ROW)],[[],[['unlock','DEBUT',60]],[['debut','DEBUT',60]]],L+' the fold state keeps both legacy entries pending, fx-press\'s an unlock; fx-press is never held');
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,hp.queue.filter(q=>q&&q.exId===ROW&&!q.done).length,b39Card(hp)],[0,1,[null,null,null]],L+' R9.13 (v): the registered projection hides the w-null lift\'s legacy UNLOCK, and only it; its card is the baseline ask');
  const twin=EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,legacyOverNullBase()))).state;
  assert.deepEqual(hp,twin,L+' exactly like the debut twin (R913-LEGACY-OVER-NULL-UNHELD): the same registered projection');
  let row;try{row=cardLoads(hp,{lift:ROW});}catch(err){row=String(err&&err.code||err);}
  assert.deepEqual([b39Card(hp),row],[[null,null,null],[60,60,60]],L+' EXPECTED CARD: fx-press is the baseline ask and the day prepares; fx-row\'s debut takes the structural slot');
  const c1=l14c1(v1),a=l14at(v1)([],r22cNullBase(),rev,[c1]),ev=checkOf(a,LIFT,c1);
  assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on the baseline-ask completion, as the debut row '+JSON.stringify(ev.refusal||ev.offers));
  const f1=EFFECTS.m.foldNativeLoad(a),ex1=exOf(f1.state);
  assert.deepEqual([ex1.w,ex1.native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),r22cKinds(f1)],[null,true,false,[['unlock','DEBUT',60]]],L+' nothing is written: after that completion w null, no authority, no adoption receipt, the unlock pending');
 }
});
test('R22L2-UNLOCK-OVER-ABSENT-W R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry ... of EVERY lift whose projected w is null or ABSENT"), INVARIANT ("no registered projection carries an unfinished debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT"), EXPECTED CARD and THE CHECK (Fable R22 l2 B-R22L2-1, mutant X6 "HIDDEN_LEGACY_KINDS.has(q.kind) -> q.kind === \'debut\'" in FC03 heldProjection): the UNLOCK twin of L14-B1-ABSENT-W-PROJECTION: a never-held fx-press with NO w field and a pending legacy UNLOCK newW 60 in the admitted base -> the fold keeps w ABSENT and the unlock pending, no issue; the registered projection hides it, exactly like the debut twin (the same registered projection); the card is the baseline ask and the day prepares; the check on its baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue as the debut row does (E/native-load.cjs:222; STRUCTURAL at :20 includes unlock), and nothing is written: after it w stays ABSENT, no authority, no adoption receipt, the unlock pending; typed v2 and host v1, R1 and R2. Under X6 the unlock is shown and the capture refuses the day ENGINE_CAPTURE_BASELINE_UNPROVEN',()=>{
 effectsGate();
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,absentW(r22cUnlockQ()))),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([wField(f),b2Issues(f),r22cKinds(f)],['ABSENT',[],[['unlock','DEBUT',60]]],L+' the fold keeps w ABSENT and the legacy UNLOCK 60 pending; never held');
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,b39Card(hp)],[0,[null,null,null]],L+' R9.13 (v): the registered projection hides the legacy UNLOCK; the card is the baseline ask and the day prepares');
  const twin=EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,absentW(LEGQ({newW:60}))))).state;
  assert.deepEqual(hp,twin,L+' exactly like the debut twin (L14-B1-ABSENT-W-PROJECTION): the same registered projection');
  const c1=l14c1(v1),a1=l14at(v1)([],absentW(r22cUnlockQ()),rev,[c1]),ev1=checkOf(a1,LIFT,c1);
  assert.deepEqual([ev1.status,ev1.refusal&&ev1.refusal.code,ev1.refusal&&ev1.refusal.refs,ev1.refusal&&ev1.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on the baseline-ask completion, as the debut row '+JSON.stringify(ev1.refusal||ev1.offers));
  const f1=EFFECTS.m.foldNativeLoad(a1);
  assert.deepEqual([wField(f1),exOf(f1.state).native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),r22cKinds(f1)],['ABSENT',true,false,[['unlock','DEBUT',60]]],L+' nothing is written: after that completion w ABSENT, no authority, no adoption receipt, the unlock pending');
 }
});
// D-R22L2-1: R9.13 (iv) DEFINITIONS take a queue item with "q.done falsy", and UNCHANGED BY THE RULE lists "done entries".
// Every earlier fixture's done was a boolean, so a conversion that treats only done === true as done (Fable's mutant X4) agreed
// with the spec on all of them. A truthy non-boolean done (1, a string) is done: the conversion must leave its entry alone.
test('R22L2-TRUTHY-DONE-ALV R9.13 (iv) DEFINITIONS ("a LEGACY SCALAR STRUCTURAL ENTRY is a queue item q of S with q.done falsy": an entry whose done is a truthy non-boolean is NOT one) and UNCHANGED BY THE RULE ("done entries") (Fable R22 l2 D-R22L2-1, mutant X4 "q.done|| -> q.done===true||" in the A-LEGACY-VECTOR conversion, which survived 244/244 because every fixture wrote a boolean done): fx-press w 100 wSets [100,100,95] with a finished legacy DEBUT newW 105 whose done is 1 (and, the same, the string \'yes\') -> nothing named and every byte unchanged: no newWSets written, done still 1; its done:true twin (R913-ALV-KINDS\'s done entry) is likewise untouched, and the two states deep-equal once the entry\'s done is read as true. X4 converts the done:1 entry: newWSets [105,105,100] written onto a finished entry',()=>{
 alvGate();
 const legacy=s=>s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut');
 const twin=alvState([LEGQ({done:true,state:'ESTABLISH'})]),tb=JSON.stringify(twin);
 assert.deepEqual([ALV.fn(twin),JSON.stringify(twin)===tb],[[],true],'the done:true twin: nothing named, byte-identical');
 for(const done of [1,'yes']){const s=alvState([LEGQ({done,state:'ESTABLISH'})]),before=JSON.stringify(s),named=ALV.fn(s);
  assert.deepEqual([named,JSON.stringify(s)===before,Object.hasOwn(legacy(s),'newWSets'),legacy(s).done],[[],true,false,done],'done '+JSON.stringify(done)+': nothing named, byte-identical, no newWSets, done unchanged '+JSON.stringify(legacy(s).newWSets));
  const t=structuredClone(s);legacy(t).done=true;
  assert.deepEqual(t,twin,'done '+JSON.stringify(done)+': the same state as the done:true twin apart from its own done value');
 }
});

// ======================================================================
// ROUND 22d (test bytes only; Fable R22 l3 REJECT of the round-22c working tree on blocker B-R22L3-1, with named debts
// D-R22L3-1..5, all six paid here by PM ruling (DECISIONS:834); the head product is unchanged: FC03 b25d2e61,
// L/source-admission.mjs 10bd5cfb, FC01 92a4a0b4, W/engine-capture.cjs fa68a748). Every value is invented.
// ======================================================================
// B-R22L3-1: R9.13 (v) RULE hides "every unfinished LEGACY debut/unlock entry ... of EVERY lift whose projected w is null or
// ABSENT", and its INVARIANT reads "no registered projection carries an unfinished debut/unlock entry, native or legacy, of a
// lift whose w is null or ABSENT". Every earlier fixture carried exactly one hideable entry at a time, so a registered
// projection that hides only the FIRST hideable entry (Fable's mutant z09 in FC03 heldProjection) agreed with the spec on all
// of them. These two rows carry two at once: two w-null lifts, and one w-null (or ABSENT-w) lift with a debut and an unlock.
function r22dTwoNullBase(){const b=legacyOverNullBase();b.exercises.find(x=>x.id===ROW).w=null;return b;}
const r22dInvariant=hp=>hp.queue.filter(q=>q&&!q.done&&(q.kind==='debut'||q.kind==='unlock')&&hp.exercises.some(x=>x&&x.id===q.exId&&x.w==null)).map(q=>[q.exId,q.kind,q.newW]);
const r22dPair=()=>[LEGQ({newW:60,t:'SYNTHETIC legacy debut press'}),r22cUnlockQ({newW:65})];
function r22dPairBase(form){if(form==='ABSENT')return absentW(...r22dPair());const b=F0({w:null});b.queue.push(...r22dPair());return b;}
test('R22L3-EVERY-LIFT-OVER-NULL R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== \'string\', not done, kind in HIDDEN_LEGACY_KINDS) of EVERY lift whose projected w is null or ABSENT"), INVARIANT ("no registered projection carries an unfinished debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT"), EXPECTED CARD and THE CHECK (Fable R22 l3 B-R22L3-1, mutant z09 "state.queue.filter((q) => !hide(q)) -> state.queue.filter((q, i) => !hide(q) || i !== state.queue.findIndex(hide))" in FC03 heldProjection, which hides only the first hideable entry and survived 247/247 and FA03 50/50 because every fixture carried one hideable entry at a time): the R913-LEGACY-OVER-NULL-UNHELD base with fx-row ALSO never held at w null (two w-null lifts, each with its own pending legacy DEBUT 60) -> the fold state keeps both entries pending and both w null, no issue on either lift; the registered projection hides BOTH entries (0 visible for each lift; the INVARIANT holds); both cards are the baseline ask and the day prepares; the check on each lift\'s baseline-ask completion (one shared Close) refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue (E/native-load.cjs:222), and nothing is written: after it both w stay null, no authority, no adoption receipt, both entries pending; typed v2 and host v1, R1 and R2. Under z09 fx-row\'s debut is shown and the capture refuses the day ENGINE_CAPTURE_BASELINE_UNPROVEN',()=>{
 effectsGate();
 const rowOf=s=>s.exercises.find(x=>x.id===ROW);
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev,b=r22dTwoNullBase();
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,rowOf(f.state).w,b2Issues(f),b2Issues(f,ROW),legacyPending(f),legacyPending(f,ROW)],[null,null,[],[],[['DEBUT',60]],[['DEBUT',60]]],L+' the fold state keeps both legacy entries pending over two w-null lifts; neither lift is held');
  let row;try{row=cardLoads(hp,{lift:ROW});}catch(err){row=String(err&&err.code||err);}
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,hp.queue.filter(q=>q&&q.exId===ROW&&!q.done).length,r22dInvariant(hp),b39Card(hp),row],[0,0,[],[null,null,null],[null,null,null]],L+' R9.13 (v): the registered projection hides BOTH lifts\' legacy entries (EVERY lift; the INVARIANT holds); both cards are the baseline ask and the day prepares');
  const c1t=twoLift(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),c1=v1?v1Of(c1t):c1t;
  const a=foldArgs([c1],[],rev,r22dTwoNullBase());if(v1)captureOn(a.generation,c1,[null,null,null]);
  for(const lift of [LIFT,ROW]){const ev=checkOf(a,lift,c1);
   assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on '+lift+'\'s baseline-ask completion '+JSON.stringify(ev.refusal||ev.offers));}
  const f1=EFFECTS.m.foldNativeLoad(a),j1=JSON.stringify(f1.state);
  assert.deepEqual([exOf(f1.state).w,rowOf(f1.state).w,exOf(f1.state).native_load_authority===undefined,rowOf(f1.state).native_load_authority===undefined,j1.includes('adopt:'+LIFT),j1.includes('adopt:'+ROW),legacyPending(f1),legacyPending(f1,ROW)],[null,null,true,true,false,false,[['DEBUT',60]],[['DEBUT',60]]],L+' nothing is written: after that completion both w null, no authority, no adoption receipt, both entries pending');
 }
});
test('R22L3-EVERY-ENTRY-OVER-NULL R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry ... of EVERY lift whose projected w is null or ABSENT"), INVARIANT ("no registered projection carries an unfinished debut/unlock entry, native or legacy, of a lift whose w is null or ABSENT"), EXPECTED CARD and THE CHECK (Fable R22 l3 B-R22L3-1, mutant z09 "state.queue.filter((q) => !hide(q)) -> state.queue.filter((q, i) => !hide(q) || i !== state.queue.findIndex(hide))" in FC03 heldProjection): one never-held fx-press carrying a pending legacy DEBUT 60 AND a pending legacy UNLOCK 65 at once, with w null and again with NO w field -> the fold keeps both entries pending and w as admitted, no issue; the registered projection hides BOTH entries (0 visible; the INVARIANT holds); the card is the baseline ask and the day prepares; the check on the baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue (E/native-load.cjs:222), and nothing is written: after it w as admitted, no authority, no adoption receipt, both entries pending; typed v2 and host v1, R1 and R2. Under z09 the unlock is shown and the capture refuses the day ENGINE_CAPTURE_BASELINE_UNPROVEN',()=>{
 effectsGate();
 const both=[['debut','DEBUT',60],['unlock','DEBUT',65]];
 for(const form of ['null','ABSENT'])for(const v1 of [false,true])for(const rev of [R1,R2]){const L=form+'-w '+(v1?'v1 ':'v2 ')+rev,wAs=form==='null'?null:'ABSENT';
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,r22dPairBase(form))),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([wField(f),b2Issues(f),r22cKinds(f)],[wAs,[],both],L+' the fold keeps both legacy entries pending and w as admitted; never held');
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,r22dInvariant(hp),b39Card(hp)],[0,[],[null,null,null]],L+' R9.13 (v): the registered projection hides BOTH entries (EVERY entry; the INVARIANT holds); the card is the baseline ask and the day prepares');
  const c1=l14c1(v1),a=l14at(v1)([],r22dPairBase(form),rev,[c1]),ev=checkOf(a,LIFT,c1);
  assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on the baseline-ask completion '+JSON.stringify(ev.refusal||ev.offers));
  const f1=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([wField(f1),exOf(f1.state).native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),r22cKinds(f1)],[wAs,true,false,both],L+' nothing is written: after that completion w as admitted, no authority, no adoption receipt, both entries pending');
 }
});
// D-R22L3-1: R9.13 (v) hides for a w that is "null or ABSENT" only; a lift at w 0 is a numeric-w lift, whose pending legacy
// debut stays visible and whose card prescribes newW (E/today.cjs:98). Every earlier w was null, ABSENT or positive, so a hide on
// a falsy w (Fable's mutant z04) agreed with the spec on all of them.
test('R22L3-ZERO-W-VISIBLE R9.13 (v) LEGACY-OVER-NULL RULE ("of EVERY lift whose projected w is null or ABSENT": w 0 is neither) and its numeric-w side ("the same entry on a lift with numeric w ... stays visible, and the card prescribes ... as today (E/today.cjs:98)", R913-LEGACY-OVER-NULL-CONTROL) (Fable R22 l3 D-R22L3-1, mutant z04 "x && x.w == null -> x && !x.w" in FC03 heldProjection, which survived 247/247 and FA03 50/50): fx-press at w 0 (no wSets) with a pending legacy DEBUT newW 5 -> the fold keeps w 0 and the entry pending, no issue; the registered projection keeps w 0 and the entry visible, and the card prescribes 5 on every set through the real capture; R1 and R2. Under z04 the entry is hidden and the card falls back to the w 0 scalar',()=>{
 effectsGate();
 for(const rev of [R1,R2]){const b=F0({w:0});b.queue.push(LEGQ({newW:5}));
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,b2Issues(f),legacyPending(f)],[0,[],[['DEBUT',5]]],rev+' the fold keeps w 0 and the legacy DEBUT 5 pending');
  assert.deepEqual([exOf(hp).w,hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).map(q=>[q.kind,q.state,q.newW]),b39Card(hp)],[0,[['debut','DEBUT',5]],[5,5,5]],rev+' R9.13 (v): w 0 is not null or ABSENT: the entry stays visible and the card prescribes 5 on every set');
 }
});
// D-R22L3-2: R9.13 (v) hides kind in HIDDEN_LEGACY_KINDS (FC03:250: debut and unlock) only. FC01's STRUCTURAL
// (E/native-load.cjs:20) also lists own, reclaim and ladder, which THE CHECK reads, but the registered projection keeps them.
// No earlier fixture carried a pending own/reclaim/ladder entry, so widening the hide set to STRUCTURAL (z06) agreed with all.
test('R22L3-OTHER-KINDS-KEPT R9.13 (v) LEGACY-OVER-NULL RULE ("kind in HIDDEN_LEGACY_KINDS, :250", the set {debut, unlock}; "only the registered projection changes ... nothing durable is written") (Fable R22 l3 D-R22L3-2, mutant z06 "new Set([\'debut\', \'unlock\']) -> new Set([\'debut\', \'unlock\', \'own\', \'reclaim\', \'ladder\'])" in FC03, FC01\'s STRUCTURAL set, which survived 247/247 and FA03 50/50): a never-held fx-press at w null with a pending legacy entry of kind own (and, the same, reclaim and ladder) beside a pending legacy DEBUT 60 -> the fold keeps both pending, no issue; the registered projection hides the debut only and keeps the own/reclaim/ladder entry; the card is the baseline ask and the day prepares (E/today.cjs:55 picks debut/unlock only); R1 and R2. Under z06 the own/reclaim/ladder entry is hidden too',()=>{
 effectsGate();
 for(const kind of ['own','reclaim','ladder'])for(const rev of [R1,R2]){const L=kind+' '+rev,b=F0({w:null});
  b.queue.push({exId:LIFT,kind,done:false,state:'DEBUT',newW:60,t:'SYNTHETIC legacy '+kind+' press'},LEGQ({newW:60}));
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,b2Issues(f),r22cKinds(f)],[null,[],[[kind,'DEBUT',60],['debut','DEBUT',60]]],L+' the fold keeps both legacy entries pending; never held');
  assert.deepEqual([r22cKinds({state:hp}),b39Card(hp)],[[[kind,'DEBUT',60]],[null,null,null]],L+' R9.13 (v): the registered projection hides the debut only and keeps the '+kind+' entry; the card is the baseline ask and the day prepares');
 }
});
// D-R22L3-3: R9.13 (iv) DEFINITIONS take "q.kind 'debut' or 'unlock'" only, and the CONVERSION writes nothing else ("every
// other entry ... unchanged"). No earlier ALV fixture carried another kind with a finite newW on a vector lift, so dropping the
// kind clause (Fable's mutant y02) agreed with the spec on all of them.
test('R22L3-OTHER-KINDS-ALV R9.13 (iv) DEFINITIONS ("q.kind \'debut\' or \'unlock\'") and CONVERSION ("Nothing else is written: q.newW, q.state, q.t, every other entry, ex.w and ex.wSets are unchanged") (Fable R22 l3 D-R22L3-3, mutant y02 "||(q.kind!==\'debut\'&&q.kind!==\'unlock\')|| -> ||" in the A-LEGACY-VECTOR conversion, which survived 247/247): fx-press w 100 wSets [100,100,95] with a pending legacy entry of kind own (and, the same, reclaim, ladder and info) carrying newW 105 and no newWSets -> nothing named and every byte unchanged (no newWSets); beside R913-ALV-KINDS\'s pending legacy DEBUT newW 105 in the same state the debut converts to [105,105,100] and the other entry stays byte-identical. y02 writes newWSets [105,105,100] onto the own entry',()=>{
 alvGate();
 const other=s=>s.queue.find(x=>x&&x.t==='SYNTHETIC legacy other');
 for(const kind of ['own','reclaim','ladder','info']){
  const s=alvState([LEGQ({kind,t:'SYNTHETIC legacy other'})]),before=JSON.stringify(s),named=ALV.fn(s);
  assert.deepEqual([named,JSON.stringify(s)===before,Object.hasOwn(other(s),'newWSets')],[[],true,false],kind+' alone: nothing named, byte-identical, no newWSets '+JSON.stringify(other(s).newWSets));
  const m=alvState([LEGQ(),LEGQ({kind,t:'SYNTHETIC legacy other'})]),ob=JSON.stringify(other(m)),mn=ALV.fn(m);
  assert.deepEqual([mn,m.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newWSets,JSON.stringify(other(m))===ob],[[],[105,105,100],true],kind+' beside a debut: the debut converts and the '+kind+' entry is byte-identical '+JSON.stringify(other(m).newWSets));
 }
});
// D-R22L3-4: R9.13 (iv) DEFINITIONS take "q.state !== 'PROPOSED'": an entry in any other state, or with no state key, is a
// legacy scalar structural entry. Every converted fixture had state DEBUT, so a clause narrowed to q.state === 'DEBUT' (Fable's
// mutant y05) agreed with the spec on all of them.
test('R22L3-STATE-NOT-PROPOSED-ALV R9.13 (iv) DEFINITIONS ("q.state !== \'PROPOSED\'": any other state, or none, is in) and CONVERSION (Fable R22 l3 D-R22L3-4, mutant y05 "q.state===\'PROPOSED\' -> q.state!==\'DEBUT\'" in the A-LEGACY-VECTOR conversion, which survived 247/247 because every converted fixture had state DEBUT): fx-press w 100 wSets [100,100,95] with a pending legacy DEBUT newW 105 whose state is QUEUED, and again one with NO state key -> each converts exactly like the DEBUT-state entry: newWSets [105,105,100], nothing named, nothing else written (the state, or its absence, kept), no set above 105; the card captures [105,105,100]; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (E/today.cjs:55 picks any non-PROPOSED entry). y05 leaves both unconverted, so their day refuses',()=>{
 effectsGate();alvGate();
 const legacy=s=>s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut'),twin=alvState([LEGQ()]);ALV.fn(twin);
 for(const [name,mk,kept] of [['state QUEUED',()=>alvState([LEGQ({state:'QUEUED'})]),['QUEUED',true]],['no state key',()=>{const q=LEGQ();delete q.state;return alvState([q]);},[undefined,false]]]){
  const s=mk();
  assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED',name+' control: unconverted, the day refuses (W/engine-capture.cjs:83)');
  alvRow(s,[105,105,100],name);
  assert.deepEqual([legacy(s).state,Object.hasOwn(legacy(s),'state')],kept,name+': the state kept as admitted');
  assert.deepEqual(legacy(s).newWSets,legacy(twin).newWSets,name+': converted exactly like the DEBUT-state twin (R913-ALV-CONVERT)');
 }
});
// D-R22L3-5: R9.13 (iv) PRECONDITION P takes "typeof ex.w === 'number' and finite". R913-ALV-P's non-numeric w was 'BW', which
// fails P under a w-type clause and under a bare null test alike (NaN comparisons), so replacing the clause by ex.w==null
// (Fable's mutant y16) agreed with the spec there; a numeric STRING w is coerced by that mutant and converted.
test('R22L3-STRING-W-ALV R9.13 (iv) PRECONDITION P ("typeof ex.w === \'number\' and finite") and OUT OF PRECONDITION ("w not a finite number ... is left unconverted and named ...; its day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (:83) as today, and nothing is raised") (Fable R22 l3 D-R22L3-5, mutant y16 "typeof ex.w!==\'number\'||!Number.isFinite(ex.w)|| -> ex.w==null||" in the A-LEGACY-VECTOR conversion, which survived 247/247): fx-press with the numeric STRING w \'100\', wSets [100,100,95] and a pending legacy DEBUT newW 105 -> named exactly [{exId fx-press, kind debut, newW 105, w \'100\', wSets [100,100,95]}] and every byte unchanged (no newWSets); the day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. y16 coerces \'100\' and writes [105,105,100]',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ()],{w:'100',wSets:[100,100,95]}),before=JSON.stringify(s),named=ALV.fn(s),q=s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut');
 assert.deepEqual(named,[{exId:LIFT,kind:'debut',newW:105,w:'100',wSets:[100,100,95]}],'a numeric-string w fails P: named '+JSON.stringify(q.newWSets));
 assert.deepEqual([JSON.stringify(s)===before,Object.hasOwn(q,'newWSets')],[true,false],'unconverted: byte-identical, no newWSets');
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','the day refuses as today (W/engine-capture.cjs:83)');
});

// ======================================================================
// ROUND 22e (test bytes only; Fable R22 l4 REJECT of the round-22d working tree on blockers B-R22L4-1 and B-R22L4-2, with named
// debts D-R22L4-1..3, all five paid here by PM ruling; the head product is unchanged: FC03 b25d2e61, L/source-admission.mjs
// 10bd5cfb, FC01 92a4a0b4, W/engine-capture.cjs fa68a748). Every value is invented.
// ======================================================================
// B-R22L4-1: R9.13 (v) EXPECTED CARD says "The day's other lifts are unaffected", THE CHECK is stated "on that baseline-ask
// completion" (the w-null lift's), and "FC01's LEGACY_PENDING rules (E/native-load.cjs:221-222 in evaluation ...) are unchanged";
// spec B returns LEGACY_PENDING for a legacy branch "for the lift". Every earlier two-lift legacy fixture gave BOTH lifts an
// entry, so a check that refuses on ANY lift's pending legacy structural entry (Fable's mutant k05, FC01 :222 "q.exId === lift
// -> true") agreed with the spec on all of them. This row gives fx-row NO entry beside fx-press's.
function r22eOtherLiftBase(withPressEntry){const b=legacyOverNullBase();b.queue=b.queue.filter(q=>!(q&&(q.exId===ROW||(!withPressEntry&&q.exId===LIFT))));return b;}
// The completion of one lift of a shared Close, performed on that lift's numeric card (slot prescribed_load and loads set).
function r22eAtCard(c,lift,load){const en=c.session.record.entries.find(x=>x.lift_lineage_id===lift);
 for(const slot of en.slots){slot.prescribed_load={state:'specified',source:lb(load)};if(slot.fact){slot.fact.original.load=lb(load);slot.fact.current.load=lb(load);}}return c;}
// The immutable Start capture of a shared Close, per lift (captureOn writes one load list for every entry), in fc16Capture's
// shape: a load cell per slot and, on a numeric card, a reps cell whose window_hi is the base plan's hi.
function r22eCaptureBy(gen,c,byLift,hi){
 gen.collections.ops[c.start].prescription_capture={slots:c.session.record.entries.flatMap(en=>en.slots.map((slot,i)=>{const l=byLift[en.lift_lineage_id][i];
  return {logical_set_slot:slot.logical_set_slot,lift_lineage_id:en.lift_lineage_id,load:l==null?{state:'not_prescribed',display:'Find a working load',source_json:null}:{state:'specified',display:l+' lb',source_json:JSON.stringify({value:l,unit:'lb'})},
   reps:l==null?{state:'not_prescribed',display:'Record the reps performed',source_json:null}:{state:'specified',display:String(hi),source_json:JSON.stringify({value:hi,unit:'rep',window_hi:hi})}};}))};
 return gen;
}
test('R22L4-CHECK-OTHER-LIFT-UNAFFECTED R9.13 (v) EXPECTED CARD ("The day\'s other lifts are unaffected") and THE CHECK ("THE CHECK on that baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING, refs [its Close Ref], field \'queue\' (E/native-load.cjs:222)"; "FC01\'s LEGACY_PENDING rules (E/native-load.cjs:221-222 in evaluation ...) are unchanged"; spec B: a legacy branch "for the lift" returns LEGACY_PENDING) (Fable R22 l4 B-R22L4-1, mutant k05 "q.exId === lift -> true" at FC01 :222, which survived 254/254 and FA03 51/51 because every two-lift legacy fixture gave both lifts an entry): the R913-LEGACY-OVER-NULL-UNHELD base minus fx-row\'s entry (fx-press never held at w null with a pending legacy DEBUT 60; fx-row at w 55 with NO entry) -> the fold keeps fx-press\'s entry pending and fx-row entry-free, no issue on either lift; the registered projection hides fx-press\'s entry, fx-press\'s card is the baseline ask and fx-row\'s is 55 on every set; on one shared Close (fx-press on the baseline ask, fx-row on its 55 card) THE CHECK on fx-press refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue, and the check on fx-row is NOT LEGACY_PENDING: it equals fx-row\'s check on the same Close over the same base without fx-press\'s entry (status, refusal, offers and every basis field but the digest of the whole day\'s queue; the other lift unaffected), the ordinary first top NATIVE_LOAD_PROVISIONAL [its Close Ref]; typed v2 and host v1, R1 and R2. Under k05 fx-row\'s check refuses NATIVE_LOAD_LEGACY_PENDING too',()=>{
 effectsGate();
 const rowOf=s=>s.exercises.find(x=>x.id===ROW),brief=ev=>[ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.field];
 // basis.plan.structural_queue_sha256 hashes the whole day's queue (FC03 basisOf), fx-press's entry included, so it is the one
 // byte that may differ; the outcome (status, refusal, offers) and every other basis field must not.
 const outcome=ev=>({status:ev.status,refusal:ev.refusal,offers:ev.offers,basis:ev.basis&&{...ev.basis,plan:{...ev.basis.plan,structural_queue_sha256:'(the whole day queue)'}}});
 for(const v1 of [false,true])for(const rev of [R1,R2]){const L=(v1?'v1 ':'v2 ')+rev;
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,r22eOtherLiftBase(true))),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,rowOf(f.state).w,b2Issues(f),b2Issues(f,ROW),legacyPending(f),legacyPending(f,ROW)],[null,55,[],[],[['DEBUT',60]],[]],L+' the fold keeps fx-press\'s legacy entry pending and fx-row entry-free; neither lift is held');
  let row;try{row=cardLoads(hp,{lift:ROW});}catch(err){row=String(err&&err.code||err);}
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,b39Card(hp),row],[0,[null,null,null],[55,55,55]],L+' R9.13 (v): fx-press\'s entry hidden, its card the baseline ask; fx-row\'s card 55 on every set');
  const t=r22eAtCard(twoLift(1,{reps:TOP,loads:60,prescribed:null,effort:e(2,1,1)}),ROW,55),c1=v1?v1Of(t):t;
  const at=base=>{const a=foldArgs([c1],[],rev,base);if(v1)r22eCaptureBy(a.generation,c1,{[LIFT]:[null,null,null],[ROW]:[55,55,55]},exOf(base).hi);return a;};
  const a=at(r22eOtherLiftBase(true)),twin=at(r22eOtherLiftBase(false));
  const press=checkOf(a,LIFT,c1),rowEv=checkOf(a,ROW,c1),rowTwin=checkOf(twin,ROW,c1);
  assert.deepEqual([press.status,press.refusal&&press.refusal.code,press.refusal&&press.refusal.refs,press.refusal&&press.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on fx-press\'s baseline-ask completion '+JSON.stringify(press.refusal||press.offers));
  assert.notEqual(rowEv.refusal&&rowEv.refusal.code,'NATIVE_LOAD_LEGACY_PENDING',L+' fx-row carries no legacy entry: its check is not LEGACY_PENDING '+JSON.stringify(brief(rowEv)));
  assert.deepEqual(outcome(rowEv),outcome(rowTwin),L+' R9.13 (v) "the day\'s other lifts are unaffected": fx-row\'s check equals its check without fx-press\'s entry (only the basis digest of the whole day\'s queue differs) '+JSON.stringify([brief(rowEv),brief(rowTwin)]));
  assert.deepEqual([rowEv.status,rowEv.refusal&&rowEv.refusal.code,rowEv.refusal&&rowEv.refusal.refs,rowEv.refusal&&rowEv.refusal.field],['refused','NATIVE_LOAD_PROVISIONAL',[ref(c1.close)],null],L+' measured: fx-row\'s one top completion reaches the earn readers and is the ordinary first top, PROVISIONAL [its Close Ref] (N03a)');
 }
});
// B-R22L4-2: R9.13 (v) RULE "Only the registered projection changes" and "the entry, its history and the fold state are
// unchanged" (it hides; it does not reorder), and EXPECTED CARD "The day's other lifts are unaffected". E/today.cjs:55 picks the
// FIRST unfinished non-PROPOSED debut/unlock in QUEUE ORDER and :97-98 prescribes that lift's first such entry's newW, so the
// order of the kept entries is the other lift's card. Every earlier fixture kept at most one structural entry per lift beside a
// hidden one, so a projection that reverses the kept entries whenever it hides (Fable's mutant w07) agreed with all of them.
// Measured on the head: the real capture refuses a day whose debut-now lift carries MORE than one unfinished debut/unlock entry
// (W/engine-capture.cjs:76-77, "Multiple matching moves do not prove which load vector won": ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED),
// with or without the hide, so fx-row's two-entry card is read at E/today.cjs genSession (the engine's own card), and the day's
// capture outcome is compared with the same base without fx-press's entry. The structural-slot form (one entry per lift beside a
// third lift fx-curl) shows the kept order at the real capture: the first remaining debut in queue order takes the slot.
const R22E_CURL='fx-curl';
function r22eOrderBase(withPressEntry){const b=legacyOverNullBase();if(!withPressEntry)b.queue=b.queue.filter(q=>!(q&&q.exId===LIFT));
 b.queue.push({exId:ROW,kind:'unlock',done:false,state:'DEBUT',newW:65,t:'SYNTHETIC legacy unlock row'});return b;}
function r22eSlotBase(withPressEntry){const b=legacyOverNullBase();if(!withPressEntry)b.queue=b.queue.filter(q=>!(q&&q.exId===LIFT));
 b.exercises.push({...structuredClone(exOf(b)),id:R22E_CURL,n:'Fx Curl',w:45});b.queue.push({exId:R22E_CURL,kind:'debut',done:false,state:'DEBUT',newW:50,t:'SYNTHETIC legacy debut curl'});return b;}
test('R22L4-KEPT-ORDER-OVER-NULL R9.13 (v) LEGACY-OVER-NULL RULE ("Only the registered projection changes"; "the entry, its history and the fold state are unchanged": the projection hides and keeps every other entry as it is) and EXPECTED CARD ("The day\'s other lifts are unaffected"; E/today.cjs:55 and :97-98 read the queue in order) (Fable R22 l4 B-R22L4-2, mutant w07 "state.queue.filter((q) => !hide(q)) -> state.queue.filter((q) => !hide(q)).reverse()" in FC03 heldProjection, which survived 254/254 and FA03 51/51 because every fixture kept at most one structural entry per lift beside a hidden one): the R913-LEGACY-OVER-NULL-UNHELD base (fx-press never held at w null with a pending legacy DEBUT 60; fx-row at w 55 with a pending legacy DEBUT 60) plus a pending legacy UNLOCK 65 on fx-row after its debut -> the fold keeps the three entries pending in the order admitted; the registered projection is the fold queue minus fx-press\'s entry, every kept entry in fold order (fx-row: [debut 60, unlock 65]); fx-row\'s engine card (E/today.cjs genSession) takes its first entry in queue order, w 60, exactly as over the same base without fx-press\'s entry, and the day\'s capture outcome equals that base\'s (ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED: two matching moves on one lift, W/engine-capture.cjs:76-77, not an R9.13 rule). Structural-slot form: the same base with fx-row\'s debut 60 alone before a third lift fx-curl (w 45) with its own pending legacy DEBUT 50 -> the projection keeps fold order, fx-press is the baseline ask, the first remaining debut in queue order (fx-row\'s) takes the structural slot: fx-row 60 and fx-curl 45 on every set through the real capture, as without fx-press\'s entry; R1 and R2. Under w07 fx-row\'s unlock comes first (engine card 65), and in the slot form fx-curl\'s debut takes the slot (fx-curl 50, fx-row 55)',()=>{
 effectsGate();
 const hidden=q=>!!q&&q.exId===LIFT&&q.t==='SYNTHETIC legacy debut press';
 const reg=(rev,b)=>{const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b));return {f,hp:EFFECTS.m.heldProjection(f).state};};
 const genCard=(state,lift)=>{const c=engineAt(CARD_DAY).genSession(structuredClone(state),CARD_DAY,{}).ex.find(x=>x.id===lift);return c?[c.w,c.isDebutNow===true]:'ABSENT';};
 const day=(hp,lift)=>{try{return cardLoads(hp,{lift});}catch(err){return String(err&&err.code||err);}};
 for(const rev of [R1,R2]){
  const {f,hp}=reg(rev,r22eOrderBase(true)),twin=reg(rev,r22eOrderBase(false)).hp;
  assert.deepEqual([b2Issues(f),b2Issues(f,ROW),r22cKinds(f),r22cKinds(f,ROW)],[[],[],[['debut','DEBUT',60]],[['debut','DEBUT',60],['unlock','DEBUT',65]]],rev+' the fold keeps the three legacy entries pending, fx-row\'s in the order admitted');
  assert.deepEqual(hp.queue,f.state.queue.filter(q=>!hidden(q)),rev+' R9.13 (v): the registered projection only hides fx-press\'s entry and keeps every other entry in fold order');
  assert.deepEqual([r22cKinds({state:hp},ROW),genCard(hp,ROW),genCard(twin,ROW)],[[['debut','DEBUT',60],['unlock','DEBUT',65]],[60,true],[60,true]],rev+' fx-row\'s kept entries in fold order; its engine card (E/today.cjs:55, :97-98) takes the first, the DEBUT 60, as over the same base without fx-press\'s entry');
  assert.deepEqual([day(hp,ROW),day(twin,ROW)],['ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'],rev+' the day\'s capture outcome is the one over the same base without fx-press\'s entry (two matching moves on fx-row, W/engine-capture.cjs:76-77)');
  const s=reg(rev,r22eSlotBase(true)),st=reg(rev,r22eSlotBase(false)).hp;
  assert.deepEqual([r22cKinds(s.f),r22cKinds(s.f,ROW),r22cKinds(s.f,R22E_CURL)],[[['debut','DEBUT',60]],[['debut','DEBUT',60]],[['debut','DEBUT',50]]],rev+' slot form: the fold keeps the three legacy entries pending');
  assert.deepEqual(s.hp.queue,s.f.state.queue.filter(q=>!hidden(q)),rev+' slot form R9.13 (v): only fx-press\'s entry hidden, fold order kept');
  assert.deepEqual([b39Card(s.hp),day(s.hp,ROW),day(s.hp,R22E_CURL)],[[null,null,null],[60,60,60],[45,45,45]],rev+' slot form R9.13 (v) EXPECTED CARD: fx-press is the baseline ask; the first remaining debut in queue order (fx-row\'s) takes the structural slot (E/today.cjs:55): fx-row 60, fx-curl at its w 45');
  assert.deepEqual([day(st,ROW),day(st,R22E_CURL)],[[60,60,60],[45,45,45]],rev+' slot form: the same cards over the base without fx-press\'s entry (the other lifts unaffected)');
 }
});
// D-R22L4-1: FC01 :222 refuses a pending legacy entry of any STRUCTURAL kind (E/native-load.cjs:20: debut, unlock, own, reclaim,
// ladder), spec B "Existing active legacy debut/unlock/own/reclaim/ladder/pendingThird branches ... return LEGACY_PENDING with the
// named queue/branch reference", unchanged by R9.13 (v). R22L3-OTHER-KINDS-KEPT built the own/reclaim/ladder fixture beside a
// debut and never ran the check, so narrowing :222 to debut/unlock (Fable's mutant k03) agreed with every row.
test('R22L4-OTHER-KINDS-CHECK R9.13 (v) ("FC01\'s LEGACY_PENDING rules (E/native-load.cjs:221-222 in evaluation, :544 in transition) are unchanged"; "kind in HIDDEN_LEGACY_KINDS, :250": the registered projection keeps the entry) and spec B ("Existing active legacy debut/unlock/own/reclaim/ladder/pendingThird branches ... return LEGACY_PENDING with the named queue/branch reference") (Fable R22 l4 D-R22L4-1, mutant k03 "STRUCTURAL.includes(q.kind) -> [\'debut\', \'unlock\'].includes(q.kind)" at FC01 :222, which survived 254/254 and FA03 51/51): R22L3-OTHER-KINDS-KEPT\'s fixture with the debut removed: a never-held fx-press at w null with a pending legacy entry of kind own (and, the same, reclaim and ladder; state DEBUT, newW 60) alone -> the fold keeps it pending, no issue; the registered projection keeps it and the card is the baseline ask; THE CHECK on the baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue, and nothing is written: after it w null, no authority, no adoption receipt, the entry pending; typed v2 and host v1, R1 and R2. Under k03 the check passes :222 and no longer refuses LEGACY_PENDING',()=>{
 effectsGate();
 for(const kind of ['own','reclaim','ladder'])for(const v1 of [false,true])for(const rev of [R1,R2]){const L=kind+' '+(v1?'v1 ':'v2 ')+rev;
  const base=()=>{const b=F0({w:null});b.queue.push({exId:LIFT,kind,done:false,state:'DEBUT',newW:60,t:'SYNTHETIC legacy '+kind+' press'});return b;};
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,base())),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,b2Issues(f),r22cKinds(f)],[null,[],[[kind,'DEBUT',60]]],L+' the fold keeps the legacy '+kind+' entry pending; never held');
  assert.deepEqual([r22cKinds({state:hp}),b39Card(hp)],[[[kind,'DEBUT',60]],[null,null,null]],L+' the registered projection keeps the '+kind+' entry; the card is the baseline ask');
  const c1=l14c1(v1),a=l14at(v1)([],base(),rev,[c1]),ev=checkOf(a,LIFT,c1);
  assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on the baseline-ask completion (E/native-load.cjs:222) '+JSON.stringify(ev.refusal||ev.offers));
  const f1=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([exOf(f1.state).w,exOf(f1.state).native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),r22cKinds(f1)],[null,true,false,[[kind,'DEBUT',60]]],L+' nothing is written: after that completion w null, no authority, no adoption receipt, the entry pending');
 }
});
// D-R22L4-2: FC01 :223 refuses a legacy EXERCISE branch ((ex.std && ex.own) || ex.reclaim || ex.ladder || ex.pendingThird) with
// field 'exercise' (spec B "the named queue/branch reference": the branch, not a queue entry). No row named field 'exercise', so
// that branch's field changed to 'queue' (Fable's mutant k06) agreed with every row. Invented branch values in the old app's
// shapes (E/writers.cjs:263-325: std and reclaim arrays, own a boolean, ladder an object with a set index).
test('R22L4-EXERCISE-BRANCH-FIELD R9.13 (v) ("FC01\'s LEGACY_PENDING rules (E/native-load.cjs:221-222 in evaluation, :544 in transition) are unchanged") and spec B ("Existing active legacy debut/unlock/own/reclaim/ladder/pendingThird branches ... return LEGACY_PENDING with the named queue/branch reference") (Fable R22 l4 D-R22L4-2, mutant k06 "refuse(\'LEGACY_PENDING\', [closeRef], \'exercise\') -> ... \'queue\'" at FC01 :223, which survived 254/254 and FA03 51/51): fx-press at w 100 with no queue entry and a legacy exercise branch (std [100,100,95] with own true; reclaim [90,90,90]; ladder {set 1}; pendingThird true), one normal completion on the 100 card -> THE CHECK refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] with field exercise (the branch, not the queue); typed v2 and host v1, R1 and R2. Under k06 the field is queue',()=>{
 effectsGate();
 for(const [name,patch] of [['std and own',{std:[100,100,95],own:true}],['reclaim',{reclaim:[90,90,90]}],['ladder',{ladder:{set:1}}],['pendingThird',{pendingThird:true}]])for(const v1 of [false,true])for(const rev of [R1,R2]){
  const L=name+' '+(v1?'v1 ':'v2 ')+rev,t=C(1,{reps:TOP,effort:e(2,1,1)}),c1=v1?v1Of(t):t,a=foldArgs([c1],[],rev,F0(patch));if(v1)captureOn(a.generation,c1,[100,100,100]);
  const ev=checkOf(a,LIFT,c1);
  assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'exercise'],L+' THE CHECK on a legacy exercise branch (E/native-load.cjs:223) '+JSON.stringify(ev.refusal||ev.offers));
 }
});

// ======================================================================
// ROUND 23 (test bytes only; Astra L15 REJECT of bd7654a (the round-22d bytes) on six TEST-COVERAGE blockers B1-B6, all six paid
// here by PM ruling; the head product is unchanged: FC03 b25d2e61, L/source-admission.mjs 10bd5cfb, FC01 92a4a0b4,
// W/engine-capture.cjs fa68a748). Each row pins a boundary spec R9.13 (iv) or (v) states that one of Astra's single-clause
// mutants (P/new-manifest.json: L15-N02, -N09, -N10 and -N12 in the A-LEGACY-VECTOR conversion; L15-N13 and -N14 in FC03
// heldProjection's hide predicate) crossed while every earlier row stayed green (measured again on the round-22e bytes: 258/258
// and FA03 54/54 under each). Every value is invented.
// ======================================================================
// L15-B1: R9.13 (iv) CONVERSION is the SIGNED shift x + (q.newW - ex.w); nothing in (iv) excludes q.newW < ex.w (D-R13L1-3 names
// that case). Every earlier ALV input had q.newW >= ex.w, so a shift by the absolute difference (Astra's mutant N02) agreed with the
// spec on all of them. This input shifts downward and keeps every element >= 0.
test('L15-B1-SIGNED-DELTA-ALV R9.13 (iv) CONVERSION ("q.newWSets = ex.wSets.map((x) => x + (q.newW - ex.w))": a signed shift, newW below w included; PROPERTIES "every element is <= q.newW") (Astra L15 B1, mutant N02 "x+(q.newW-ex.w) -> x+Math.abs(q.newW-ex.w)" at L/source-admission.mjs:859, which survived 254/254 and FA03 51/51 because every earlier ALV input had newW >= w): fx-press w 100, wSets [100,95,90] and a pending legacy DEBUT newW 95 (below w) -> newWSets exactly [95,90,85] (every set - 5), nothing named, w 100, wSets [100,95,90] and newW 95 unchanged and nothing else written, no set above 95; the card captures [95,90,85] through the real capture; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. N02 shifts up by 5 and writes [105,100,95], sets above the old card 95',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newW:95})],{w:100,wSets:[100,95,90]});
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[95,90,85],'newW below w');
 assert.deepEqual([exOf(s).w,exOf(s).wSets,s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newW],[100,[100,95,90],95],'newW below w: w, wSets and newW unchanged');
});
// L15-B2: D-R13L1-3 is CARRIED by name with P unchanged: "P has no lower bound, so an entry with q.newW < ex.w can shift a trailing
// set below zero; that negative case refuses the day at W/engine-capture.cjs:85 (ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED), and nothing
// is raised" (Astra L15: "do not silently clamp or change P"). No earlier row wrote a negative element, so clamping the shifted
// load at 0 (Astra's mutant N09) agreed with every row.
test('L15-B2-NEGATIVE-SHIFT-NOT-CLAMPED R9.13 (iv) CONVERSION (the exact signed shift, no clamp) and PRECONDITION P (no lower bound) with D-R13L1-3 CARRIED ("an entry with q.newW < ex.w can shift a trailing set below zero; that negative case refuses the day at W/engine-capture.cjs:85 (ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED), and nothing is raised") (Astra L15 B2, mutant N09 "x+(q.newW-ex.w) -> Math.max(0,x+(q.newW-ex.w))" at L/source-admission.mjs:859, which survived 254/254 and FA03 51/51): fx-press w 100, wSets [100,0,95] (P holds: every element a finite number <= w) and a pending legacy DEBUT newW 95 -> newWSets exactly [95,-5,90] (every set - 5; the second set below zero, not clamped), nothing named, w, wSets and newW unchanged and nothing else written; the day still refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (the carried negative case, :85), as it did unconverted (:83). N09 writes [95,0,90] and the day captures that card',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newW:95})],{w:100,wSets:[100,0,95]}),legacy=x=>x.queue.find(q=>q&&q.t==='SYNTHETIC legacy debut');
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 const before=structuredClone(s),named=ALV.fn(s);
 assert.deepEqual([named,legacy(s).newWSets],[[],[95,-5,90]],'the signed shift, not clamped: the second set below zero');
 const back=structuredClone(s);delete legacy(back).newWSets;
 assert.deepEqual(back,before,'nothing else is written (newW, w, wSets and every other byte unchanged)');
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','D-R13L1-3: the negative case refuses the day (W/engine-capture.cjs:85)');
});
// L15-B3: R9.13 (iv) PRECONDITION P requires "every element of ex.wSets a finite number <= ex.w" and OUT OF PRECONDITION names "a
// non-number element". R913-ALV-P's non-number element was 'x' (not numeric), which a coercing test (Number(x), Astra's mutant N10)
// also rejects; a numeric STRING element is coerced by that mutant and its entry written.
test('L15-B3-ELEMENT-TYPE-ALV R9.13 (iv) PRECONDITION P ("every element of ex.wSets a finite number <= ex.w") and OUT OF PRECONDITION ("a non-number element ... is left unconverted and named ...; its day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED (:83) as today, and nothing is raised") (Astra L15 B3, mutant N10 "typeof x===\'number\'&&Number.isFinite(x)&&x<=ex.w -> Number.isFinite(Number(x))&&Number(x)<=ex.w" at L/source-admission.mjs:857, which survived 254/254 and FA03 51/51 because R913-ALV-P\'s non-number element \'x\' is not numeric): fx-press w 100 with wSets [100,\'95\',90] (the numeric STRING \'95\') and a pending legacy DEBUT newW 105 -> named exactly [{exId fx-press, kind debut, newW 105, w 100, wSets [100,\'95\',90]}], every byte unchanged, no newWSets; the day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. N10 names nothing and writes [105,\'955\',95] (a string concatenation) onto the entry',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ()],{w:100,wSets:[100,'95',90]}),before=JSON.stringify(s),named=ALV.fn(s),q=s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut');
 assert.deepEqual(named,[{exId:LIFT,kind:'debut',newW:105,w:100,wSets:[100,'95',90]}],'a numeric-string element fails P: named '+JSON.stringify(q.newWSets));
 assert.deepEqual([JSON.stringify(s)===before,Object.hasOwn(q,'newWSets')],[true,false],'unconverted: byte-identical, no newWSets');
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','the day refuses as today (W/engine-capture.cjs:83)');
});
// L15-B4: R9.13 (iv) CONVERSION applies "for each such q": every legacy scalar structural entry, whatever precedes it in the queue.
// Every earlier converted input carried one convertible entry per lift that came first for its lift (R913-ALV-IDEMPOTENT's second
// same-lift unlock is converted by the first run, and under the mutant it simply stays scalar on both runs, byte-identical), so
// converting only the FIRST queue entry of each lift (Astra's mutant N12) agreed with every row. Two inputs: finished history
// before a pending entry on one lift, and two pending entries on one lift beside another lift.
test('L15-B4-HISTORY-THEN-PENDING-ALV R9.13 (iv) DEFINITIONS ("q.done falsy") and CONVERSION ("for each such q"; "Nothing else is written: ... every other entry ... unchanged"; UNCHANGED BY THE RULE "done entries") (Astra L15 B4, mutant N12 "for(const q of queue){ -> for(const q of queue.filter(the first entry of each exId)){" at L/source-admission.mjs:852, which survived 254/254 and FA03 51/51): fx-press w 100, wSets [100,100,95] with a FINISHED legacy DEBUT newW 95 (done true, state ESTABLISH: its history) before a pending legacy DEBUT newW 105 -> the pending entry converts to [105,105,100], nothing named, the finished entry byte-identical (no newWSets) and nothing else written, no set above 105; the card captures [105,105,100]; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. N12 reaches the finished entry only: the pending entry stays scalar and its day refuses',()=>{
 effectsGate();alvGate();
 const hist=LEGQ({newW:95,done:true,state:'ESTABLISH',t:'SYNTHETIC finished history'}),s=alvState([hist,LEGQ()]);
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[105,105,100],'finished history before the pending entry');
 assert.deepEqual(s.queue.find(x=>x&&x.t==='SYNTHETIC finished history'),hist,'the finished entry is byte-identical: no newWSets, done and state kept');
});
test('L15-B4-EVERY-ENTRY-ALV R9.13 (iv) CONVERSION ("for each such q whose lift has Array.isArray(ex.wSets) and meets PRECONDITION P") and INVARIANT ("after admission, no legacy scalar structural entry sits on a lift whose ex.wSets is an array") (Astra L15 B4, mutant N12): fx-press w 100, wSets [100,100,95] with a pending legacy DEBUT newW 105 AND a pending legacy UNLOCK newW 107.5, beside fx-row w 40, wSets [40,35,35] with its own pending legacy DEBUT newW 45 -> each entry converts on its own lift\'s vector: fx-press debut [105,105,100], fx-press unlock [107.5,107.5,102.5], fx-row debut [45,40,40]; nothing named, nothing else written, no set above its own entry\'s newW, and the INVARIANT holds (no legacy scalar structural entry left on an array-wSets lift). N12 converts fx-press\'s first entry and fx-row\'s but leaves fx-press\'s unlock scalar',()=>{
 alvGate();
 const s=alvState([LEGQ(),LEGQ({kind:'unlock',newW:107.5,t:'SYNTHETIC legacy unlock'}),LEGQ({exId:ROW,newW:45,t:'SYNTHETIC legacy debut row'})]);
 s.exercises.push({...structuredClone(exOf(s)),id:ROW,n:'Fx Row',w:40,wSets:[40,35,35]});
 const before=structuredClone(s),named=ALV.fn(s);
 assert.deepEqual([named,s.queue.map(q=>[q.exId,q.kind,q.newWSets===undefined?'SCALAR':q.newWSets])],[[],[[LIFT,'debut',[105,105,100]],[LIFT,'unlock',[107.5,107.5,102.5]],[ROW,'debut',[45,40,40]]]],'every entry converts on its own lift\'s vector');
 const back=structuredClone(s);for(const q of back.queue)delete q.newWSets;
 assert.deepEqual(back,before,'nothing else is written (newW, state, t, w, wSets and every other byte unchanged)');
 assert.ok(s.queue.every(q=>Array.isArray(q.newWSets)&&q.newWSets.every(x=>x<=q.newW)),'no set above its own entry\'s newW');
 const scalarOnVector=s.queue.filter(q=>q&&!q.done&&q.state!=='PROPOSED'&&(q.kind==='debut'||q.kind==='unlock')&&typeof q.native_load_spend!=='string'&&typeof q.newW==='number'&&q.newWSets===undefined&&Array.isArray((s.exercises.find(x=>x&&x.id===q.exId)||{}).wSets));
 assert.deepEqual(scalarOnVector,[],'the INVARIANT: no legacy scalar structural entry left on an array-wSets lift');
});
// L15-B5: R9.13 (v) RULE classifies an entry as LEGACY by "typeof native_load_spend !== 'string'" (FC03 :271). Every earlier
// hidden entry carried NO native_load_spend key, so a predicate that requires the key to be absent (Astra's mutant N13,
// "q.native_load_spend === undefined") agreed with every row. A PRESENT non-string marker (null and, the same, 0 and false) is legacy.
test('L15-B5-NONSTRING-MARKER-HIDDEN R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== \'string\', not done, kind in HIDDEN_LEGACY_KINDS) of EVERY lift whose projected w is null or ABSENT"; "Nothing durable is written"), INVARIANT, EXPECTED CARD and THE CHECK (Astra L15 B5, mutant N13 "typeof q.native_load_spend !== \'string\' -> q.native_load_spend === undefined" at FC03 :271, which survived 254/254 and FA03 51/51 because every earlier hidden entry carried no native_load_spend key): a never-held fx-press with w null and a pending legacy DEBUT 60 whose native_load_spend is PRESENT and null (and, the same, 0 and false) -> the fold keeps the entry pending with its marker, no issue; the registered projection hides it (the INVARIANT holds) and the fold state is unchanged by the projection; the card is the baseline ask and the day prepares; THE CHECK on its baseline-ask completion refuses NATIVE_LOAD_LEGACY_PENDING [its Close Ref] field queue (E/native-load.cjs:222 reads the same typeof), and nothing is written: after it w null, no authority, no adoption receipt, the entry pending with its marker; typed v2 and host v1, R1 and R2. Under N13 the entry is shown and the capture refuses the day ENGINE_CAPTURE_BASELINE_UNPROVEN',()=>{
 effectsGate();
 const base=marker=>{const b=F0({w:null});b.queue.push(LEGQ({newW:60,native_load_spend:marker,t:'SYNTHETIC legacy debut press'}));return b;};
 const markerOf=f=>{const q=f.state.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut press');return q&&Object.hasOwn(q,'native_load_spend')?q.native_load_spend:'ABSENT';};
 for(const marker of [null,0,false])for(const v1 of [false,true])for(const rev of [R1,R2]){const L='native_load_spend '+JSON.stringify(marker)+' '+(v1?'v1 ':'v2 ')+rev;
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,base(marker))),fb=JSON.stringify(f),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,b2Issues(f),r22cKinds(f),markerOf(f)],[null,[],[['debut','DEBUT',60]],marker],L+' the fold keeps the legacy entry pending with its present non-string marker; never held');
  assert.deepEqual([hp.queue.filter(q=>q&&q.exId===LIFT&&!q.done).length,r22dInvariant(hp),b39Card(hp),JSON.stringify(f)===fb],[0,[],[null,null,null],true],L+' R9.13 (v): the registered projection hides it (the INVARIANT holds); the card is the baseline ask and the day prepares; the fold state is unchanged');
  const c1=l14c1(v1),a=l14at(v1)([],base(marker),rev,[c1]),ev=checkOf(a,LIFT,c1);
  assert.deepEqual([ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field],['refused','NATIVE_LOAD_LEGACY_PENDING',[ref(c1.close)],'queue'],L+' THE CHECK on the baseline-ask completion (E/native-load.cjs:222) '+JSON.stringify(ev.refusal||ev.offers));
  const f1=EFFECTS.m.foldNativeLoad(a);
  assert.deepEqual([exOf(f1.state).w,exOf(f1.state).native_load_authority===undefined,JSON.stringify(f1.state).includes('adopt:'+LIFT),r22cKinds(f1),markerOf(f1)],[null,true,false,[['debut','DEBUT',60]],marker],L+' nothing is written: after that completion w null, no authority, no adoption receipt, the entry pending with its marker');
 }
});
// L15-B6: R9.13 (v) RULE hides only an entry that is "not done" (FC03 :271 "!q.done"). R22L2-TRUTHY-DONE-ALV pinned that a truthy
// non-boolean done (1, 'yes') is done for the conversion ((iv)), but no row read the registered projection over such an entry, so
// hiding every entry whose done is not exactly true (Astra's mutant N14) agreed with every row. A finished entry stays.
test('L15-B6-FINISHED-ENTRY-SHOWN R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== \'string\', not done, kind in HIDDEN_LEGACY_KINDS)": a finished entry is not hidden; "Only the registered projection changes") read with (iv) DEFINITIONS ("q.done falsy": a truthy done is done) (Astra L15 B6, mutant N14 "!q.done -> q.done !== true" at FC03 :271, which survived 254/254 and FA03 51/51 because R22L2-TRUTHY-DONE-ALV reads the conversion, never the projection): a never-held fx-press with w null and a FINISHED legacy DEBUT newW 60, state ESTABLISH, done 1 (and, the same, the string \'yes\') -> the fold keeps the entry as admitted, no issue; the registered projection KEEPS it ([[debut, 1, ESTABLISH]]) and equals its done:true twin\'s once the entry\'s done is read as true; the fold state is unchanged by the projection; the card is the baseline ask (no unfinished entry; E/today.cjs:103) and the day prepares; R1 and R2. Under N14 the finished entry is missing from the registered projection (the card and the fold queue unchanged)',()=>{
 effectsGate();
 const base=done=>{const b=F0({w:null});b.queue.push(LEGQ({newW:60,done,state:'ESTABLISH',t:'SYNTHETIC finished legacy debut'}));return b;};
 const shown=st=>st.queue.filter(q=>q&&q.exId===LIFT).map(q=>[q.kind,q.done,q.state]);
 for(const done of [1,'yes'])for(const rev of [R1,R2]){const L='done '+JSON.stringify(done)+' '+rev;
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,base(done))),fb=JSON.stringify(f),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,b2Issues(f),shown(f.state)],[null,[],[['debut',done,'ESTABLISH']]],L+' the fold keeps the finished legacy entry as admitted; never held');
  assert.deepEqual([shown(hp),b39Card(hp),JSON.stringify(f)===fb],[[['debut',done,'ESTABLISH']],[null,null,null],true],L+' R9.13 (v): the registered projection keeps the finished entry (not hidden); the card is the baseline ask and the day prepares; the fold state is unchanged');
  const twin=EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,base(true)))).state,t=structuredClone(hp);
  for(const q of t.queue)if(q&&q.t==='SYNTHETIC finished legacy debut')q.done=true;
  assert.deepEqual(t,twin,L+' the same registered projection as the done:true twin apart from the entry\'s own done value');
 }
});

// ======================================================================
// ROUND 23b (test bytes only; Fable R22 l5 ACCEPT WITH NAMED DEBTS on round 22e: D-R22L5-1 paid here by PM ruling as a NEW row,
// R22L4-EXERCISE-BRANCH-FIELD not edited; plus the INFO row Fable l5 named for mutant w16. The head product is unchanged: FC03
// b25d2e61, L/source-admission.mjs 10bd5cfb, FC01 92a4a0b4, W/engine-capture.cjs fa68a748). Every value is invented.
// ======================================================================
// R22L5-1: spec B's ACTIVE own branch is the conjunction std && own: FC01 :223 reads `(ex.std && ex.own)`, the old app's own test at
// E/writers.cjs:279 reads the same predicate, and every rebuild-side clearing site clears both together. R22L4-EXERCISE-BRANCH-FIELD
// fed std and own only together, so halving the conjunct (Fable l5 mutant k08, `ex.own`; its mirror `ex.std`) agreed with every row.
// Own alone and std alone are not an active own branch: the check reaches the ordinary readers, as with no branch at all.
test('R22L5-EXERCISE-OWN-STD-CONJUNCT spec B ("Existing active legacy debut/unlock/own/reclaim/ladder/pendingThird branches ... return LEGACY_PENDING with the named queue/branch reference": the own branch is active iff ex.std && ex.own, E/writers.cjs:279 and FC01 E/native-load.cjs:223) and R9.13 (v) ("FC01\'s LEGACY_PENDING rules ... are unchanged") (Fable R22 l5 D-R22L5-1, mutant k08 "(ex.std && ex.own) -> ex.own" at FC01 :223, which survived 258/258 and FA03 54/54): fx-press at w 100 with no queue entry and own true WITHOUT std (and, the same, std [100,100,95] WITHOUT own), one normal completion on the 100 card -> THE CHECK is not LEGACY_PENDING: it refuses NATIVE_LOAD_PROVISIONAL [its Close Ref] field null (the ordinary first top, N03a); typed v2 and host v1, R1 and R2. Under k08 own alone refuses LEGACY_PENDING field exercise',()=>{
 effectsGate();
 for(const [name,patch] of [['own alone',{own:true}],['std alone',{std:[100,100,95]}]])for(const v1 of [false,true])for(const rev of [R1,R2]){
  // v1: the Start's immutable capture carries the 100 card's load and reps cells (r22eCaptureBy, fc16Capture's shape).
  const L=name+' '+(v1?'v1 ':'v2 ')+rev,t=C(1,{reps:TOP,effort:e(2,1,1)}),c1=v1?v1Of(t):t;
  const at=base=>{const a=foldArgs([c1],[],rev,base);if(v1)r22eCaptureBy(a.generation,c1,{[LIFT]:[100,100,100]},exOf(base).hi);return a;};
  const brief=ev=>[ev.status,ev.refusal&&ev.refusal.code,ev.refusal&&ev.refusal.refs,ev.refusal&&ev.refusal.field];
  const ev=checkOf(at(F0(patch)),LIFT,c1),got=brief(ev),none=brief(checkOf(at(F0()),LIFT,c1));
  assert.notEqual(got[1],'NATIVE_LOAD_LEGACY_PENDING',L+' not an active own branch: THE CHECK is not LEGACY_PENDING (E/native-load.cjs:223) '+JSON.stringify(ev.refusal||ev.offers));
  assert.deepEqual(got,none,L+' the same outcome as with no branch at all '+JSON.stringify([got,none]));
  assert.deepEqual(got,['refused','NATIVE_LOAD_PROVISIONAL',[ref(c1.close)],null],L+' measured: the ordinary first top, PROVISIONAL [its Close Ref] (N03a) '+JSON.stringify(ev.refusal||ev.offers));
 }
});
// R22L5-INFO: R9.13 (v) hides only UNFINISHED legacy debut/unlock entries ("not done", FC03 :271 `!q.done`). R15-LEGACY-ON-HELD pins
// the done side on a HELD lift and L15-B6-FINISHED-ENTRY-SHOWN pins truthy non-boolean done values (1, 'yes') on a never-held w-null
// lift; this row pins a plain done:true entry, debut and unlock, at the UNHELD w-null quantifier Fable l5 named (mutant w16 drops
// `!q.done && ` from the hide predicate).
test('R22L5-DONE-LEGACY-OVER-NULL-SHOWN R9.13 (v) LEGACY-OVER-NULL RULE ("hides every unfinished LEGACY debut/unlock entry (typeof native_load_spend !== \'string\', not done, kind in HIDDEN_LEGACY_KINDS) of EVERY lift whose projected w is null or ABSENT"; "Only the registered projection changes") (Fable R22 l5 INFO, mutant w16 "!q.done && " dropped from FC03 :271 hide, killed at l5 only by the HELD row R15-LEGACY-ON-HELD): a never-held fx-press with w null and a DONE legacy DEBUT 60 (done true, state ESTABLISH) (and, the same, a DONE legacy UNLOCK 65) -> the fold keeps it as admitted, no issue; the registered projection keeps it and its queue deep-equals the fold queue (nothing hidden); the fold state is unchanged by the projection; the card is the baseline ask and the day prepares; R1 and R2. Under w16 the done entry is missing from the registered projection',()=>{
 effectsGate();
 const mine=st=>st.queue.filter(q=>q&&q.exId===LIFT).map(q=>[q.kind,q.done,q.state,q.newW]);
 for(const [kind,newW] of [['debut',60],['unlock',65]])for(const rev of [R1,R2]){const L='done '+kind+' '+rev;
  const b=F0({w:null});b.queue.push(LEGQ({kind,newW,done:true,state:'ESTABLISH',t:'SYNTHETIC done legacy '+kind}));
  const f=EFFECTS.m.foldNativeLoad(foldArgs([],[],rev,b)),fb=JSON.stringify(f),hp=EFFECTS.m.heldProjection(f).state;
  assert.deepEqual([exOf(f.state).w,b2Issues(f),mine(f.state)],[null,[],[[kind,true,'ESTABLISH',newW]]],L+' the fold keeps the done legacy entry as admitted; never held');
  assert.deepEqual([mine(hp),b39Card(hp),JSON.stringify(f)===fb],[[[kind,true,'ESTABLISH',newW]],[null,null,null],true],L+' R9.13 (v): the registered projection keeps the done entry (not hidden); the card is the baseline ask and the day prepares; the fold state is unchanged');
  assert.deepEqual(hp.queue,f.state.queue,L+' nothing hidden: the registered queue is the fold queue');
 }
});

// ======================================================================
// ROUND 24 (test bytes only; Astra L16 REJECT of the round-23b bytes on six TEST-COVERAGE blockers B1-B6, all six paid here by PM
// ruling, followed by a bounded single-clause sweep of the A-LEGACY-VECTOR conversion, FC03's registered projection, FC01's check
// and the host projection (report, Round 24); the head product is unchanged: FC03 b25d2e61, L/source-admission.mjs 10bd5cfb, FC01
// 92a4a0b4, W/engine-capture.cjs fa68a748). Each row asserts the outcome R9.13 (iv) states for Astra's input. Every value is invented.
// ======================================================================
// L16-B1: R9.13 (iv) DEFINITIONS take any q.newW that is "a number and finite", and P has no lower bound (D-R13L1-3), so a target of
// 0 is converted. Every earlier converted entry had newW > 0, so skipping a non-positive target (Astra's mutant) agreed with every row.
test('L16-B1-ZERO-TARGET-ALV R9.13 (iv) DEFINITIONS ("typeof q.newW === \'number\' and finite": 0 is) and CONVERSION ("q.newWSets = ex.wSets.map((x) => x + (q.newW - ex.w))"; "Nothing else is written") (Astra L16 B1, mutant "q.newW<=0|| added to the skip condition" at L/source-admission.mjs:854, which survived 267/267 and FA03 56/56): fx-press w 5, wSets [5,5,5] and a pending legacy DEBUT newW 0 -> newWSets exactly [0,0,0] (every set - 5), nothing named, w 5, wSets [5,5,5] and newW 0 unchanged and nothing else written, no set above 0; the card captures [0,0,0] through the real capture; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. Under the mutant the entry stays scalar and its day refuses',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newW:0})],{w:5,wSets:[5,5,5]});
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[0,0,0],'zero target');
 assert.deepEqual([exOf(s).w,exOf(s).wSets,s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newW],[5,[5,5,5],0],'zero target: w, wSets and newW unchanged');
});
// L16-B2: R9.13 (iv) DEFINITIONS classify an entry as legacy by "typeof q.native_load_spend !== 'string'". L15-B5 pins that typeof in
// FC03's projection; no ALV row carried a PRESENT non-string marker, so treating every present marker as native (Astra's mutant)
// agreed with every row.
test('L16-B2-NONSTRING-MARKER-ALV R9.13 (iv) DEFINITIONS ("typeof q.native_load_spend !== \'string\' (legacy, not native)": a PRESENT non-string marker is legacy) and CONVERSION (Astra L16 B2, mutant "typeof q.native_load_spend===\'string\' -> q.native_load_spend!==undefined" at L/source-admission.mjs:853, which survived 267/267 and FA03 56/56): fx-press w 100, wSets [100,100,95] and a pending legacy DEBUT newW 105 whose native_load_spend is PRESENT and null (and, the same, 0 and false) -> newWSets exactly [105,105,100], nothing named, the marker kept and nothing else written, no set above 105; the card captures [105,105,100] through the real capture; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. Under the mutant the entry stays scalar and its day refuses',()=>{
 effectsGate();alvGate();
 for(const marker of [null,0,false]){const L='native_load_spend '+JSON.stringify(marker);
  const s=alvState([LEGQ({native_load_spend:marker})]);
  assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED',L+' control: unconverted, the day refuses (W/engine-capture.cjs:83)');
  alvRow(s,[105,105,100],L);
  assert.equal(s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').native_load_spend,marker,L+': the marker is kept');
 }
});
// L16-B3: R9.13 (iv) converts "each such q", and an out-of-precondition entry is only "left unconverted and named"; its own day
// refuses as today. No earlier row put an out-of-P entry before a convertible entry of ANOTHER lift, so stopping the loop at the
// first named entry (Astra's mutant, break for continue) agreed with every row. fx-press sits on an L day so the U day's card is
// fx-row's alone to decide (W/engine-capture.cjs refuses per day).
test('L16-B3-OUT-OF-P-DOES-NOT-STOP-ALV R9.13 (iv) CONVERSION ("for each such q whose lift has Array.isArray(ex.wSets) and meets PRECONDITION P") and OUT OF PRECONDITION ("an entry on an array-wSets lift that fails P ... is left unconverted and named ...; its day refuses ... as today") (Astra L16 B3, mutant "continue -> break" after the naming at L/source-admission.mjs:858, which survived 267/267 and FA03 56/56): an out-of-P entry first in the queue (fx-press on an L day, w 100, wSets [100,105], a pending legacy DEBUT newW 105) before a convertible entry of another lift (fx-row on the U day, w 40, wSets [40,35,35], a pending legacy DEBUT newW 45) -> fx-press is named exactly and left without newWSets, fx-row converts to exactly [45,40,40] and nothing else is written; the U day\'s card captures fx-row at [45,40,40] through the real capture; unconverted, that U day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. Under the mutant the naming stops the loop: fx-row stays scalar and its day refuses',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ(),LEGQ({exId:ROW,newW:45,t:'SYNTHETIC legacy debut row'})],{w:100,wSets:[100,105],day:'L'});
 s.exercises.push({...structuredClone(exOf(s)),id:ROW,n:'Fx Row',day:'U',w:40,wSets:[40,35,35]});
 const rowCard=st=>{try{return cardLoads(EFFECTS.m.heldProjection(EFFECTS.m.foldNativeLoad(foldArgs([],[],R1,st))).state,{lift:ROW});}catch(err){return String(err&&err.code||err);}};
 assert.equal(rowCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the U day refuses (W/engine-capture.cjs:83)');
 const before=structuredClone(s),named=ALV.fn(s),press=s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut'),row=s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut row');
 assert.deepEqual([named,Object.hasOwn(press,'newWSets'),row.newWSets],[[{exId:LIFT,kind:'debut',newW:105,w:100,wSets:[100,105]}],false,[45,40,40]],'the out-of-P entry is named and left; the other lift still converts');
 const back=structuredClone(s);delete back.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut row').newWSets;
 assert.deepEqual(back,before,'nothing else is written (the named entry, w, wSets and every other byte unchanged)');
 assert.deepEqual(rowCard(s),[45,40,40],'the U day card captures fx-row\'s converted vector through the real capture');
});
// L16-B4: R9.13 (iv) PRECONDITION P bounds every element above only ("a finite number <= ex.w"); D-R13L1-3 names "P has no lower
// bound". L15-B2 has a negative OUTPUT from a nonnegative input, so an added lower bound on the INPUT (Astra's mutant) agreed with it.
test('L16-B4-NO-LOWER-BOUND-ALV R9.13 (iv) PRECONDITION P ("every element of ex.wSets a finite number <= ex.w": no lower bound) and CONVERSION, with D-R13L1-3 CARRIED ("P has no lower bound") (Astra L16 B4, mutant "x>=0&& added to P" at L/source-admission.mjs:857, which survived 267/267 and FA03 56/56): fx-press w 5, wSets [-1,5,0] (a negative element; P holds) and a pending legacy DEBUT newW 10 -> newWSets exactly [4,10,5] (every set + 5), nothing named, w 5, wSets [-1,5,0] and newW 10 unchanged and nothing else written, no set above 10; the card captures [4,10,5] through the real capture; unconverted, the same day refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. Under the mutant the entry is named, left scalar, and its day refuses',()=>{
 effectsGate();alvGate();
 const s=alvState([LEGQ({newW:10})],{w:5,wSets:[-1,5,0]});
 assert.equal(alvCard(s),'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED','control: unconverted, the day refuses (W/engine-capture.cjs:83)');
 alvRow(s,[4,10,5],'a negative input element');
 assert.deepEqual([exOf(s).w,exOf(s).wSets,s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newW],[5,[-1,5,0],10],'a negative input element: w, wSets and newW unchanged');
});
// L16-B5: R9.13 (iv) converts on "Array.isArray(ex.wSets)" and P ("every element ...") holds vacuously for an empty array, so the
// entry gets newWSets = [].map(...) = [] and the INVARIANT holds. No row had an empty wSets, so a non-empty requirement (Astra's
// mutant) agreed with every row. (iv) states no card for an empty vector, so no capture is asserted (Astra L16 measured that the
// converted and the unconverted state both refuse the day ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED).
test('L16-B5-EMPTY-VECTOR-ALV R9.13 (iv) CONVERSION ("for each such q whose lift has Array.isArray(ex.wSets) and meets PRECONDITION P ..., set q.newWSets = ex.wSets.map((x) => x + (q.newW - ex.w))": an empty array is an array and meets P vacuously) and INVARIANT ("after admission, no legacy scalar structural entry sits on a lift whose ex.wSets is an array") (Astra L16 B5, mutant "||!ex.wSets.length added to the skip" at L/source-admission.mjs:856, which survived 267/267 and FA03 56/56): fx-press w 100, wSets [] and a pending legacy DEBUT newW 105 -> newWSets exactly [] (present), nothing named, w 100, wSets [] and newW 105 unchanged and nothing else written; the INVARIANT holds. No capture is asserted ((iv) states none for an empty vector). Under the mutant the entry stays a legacy scalar structural entry on an array-wSets lift',()=>{
 alvGate();
 const s=alvState([LEGQ()],{w:100,wSets:[]}),before=structuredClone(s),named=ALV.fn(s),q=s.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut');
 assert.deepEqual([named,Object.hasOwn(q,'newWSets'),q.newWSets],[[],true,[]],'the empty vector converts: newWSets is a present empty array');
 const back=structuredClone(s);delete back.queue.find(x=>x&&x.t==='SYNTHETIC legacy debut').newWSets;
 assert.deepEqual(back,before,'nothing else is written (newW, w, wSets and every other byte unchanged)');
 const scalarOnVector=s.queue.filter(x=>x&&!x.done&&x.state!=='PROPOSED'&&(x.kind==='debut'||x.kind==='unlock')&&typeof x.native_load_spend!=='string'&&typeof x.newW==='number'&&x.newWSets===undefined&&Array.isArray((s.exercises.find(e=>e&&e.id===x.exId)||{}).wSets));
 assert.deepEqual(scalarOnVector,[],'the INVARIANT: no legacy scalar structural entry left on an array-wSets lift');
});
