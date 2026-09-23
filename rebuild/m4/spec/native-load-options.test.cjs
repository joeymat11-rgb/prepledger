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
const foldArgs=(comps,extra,revision='fx-revision-1',base=F0())=>({base,generation:opsFor(comps,extra),workoutFacts:withFacts(base,comps).workoutFacts,engine:engineR(revision),source:SOURCE,athleteId:ATH});
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
 expectRefusal(again.evaluation,'EFFECT_CONFLICT',[ref('fx-resp-a'),ref('fx-resp-b')]);
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
 expectRefusal(again.evaluation,'RECORD_INVALID',[ref('fx-resp-1')]);
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
 gen.collections.ops[c.start].prescription_capture={slots:c.session.record.entries.flatMap(en=>en.slots.map((slot,i)=>({logical_set_slot:slot.logical_set_slot,lift_lineage_id:en.lift_lineage_id,
  load:loads[i]==null?{state:'not_prescribed',display:'Find a working load',source_json:null}:{state:'specified',display:loads[i]+' lb',source_json:JSON.stringify({value:loads[i],unit:'lb'})}})))};
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
 expectRefusal(checkOf(args,LIFT,cs2[1]),'BASIS_REPAIR_REQUIRED',[ref('fx-resp-1')]);
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
 expectRefusal(checkOf(args,LIFT,cs[1]),'EFFECT_CONFLICT',[ref('fx-resp-1')]);
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
test('R6-B15c UNDONE APPLIED ADOPTION SURVIVES A LATER BASE (Astra L4 B15; spec R8 :156 "the prior image is no longer provably current"): adopt-observed 105 applied at base 100, undone to 100, then a base 102.5 -> still COMPENSATED, no conflict, w 102.5 (retire-only)',()=>{
 effectsGate();
 const h=heldAdoption({baseline:false}),base=F0();
 assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp],'fx-revision-1',base)).state).w,105,'applied at its own base');
 const u=checkOf(foldArgs([h.c1],[h.resp],'fx-revision-1',base),LIFT,h.c1,{compensate:h.spend});assert.equal(u.status,'offer');
 const comp=acceptOp(u.offers[0],{op_id:'fx-resp-2',after:1});
 assert.equal(exOf(EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,comp],'fx-revision-1',base)).state).w,100,'undone to the prior image');
 for(const rev of ['fx-revision-1','fx-revision-2']){
  const f=EFFECTS.m.foldNativeLoad(foldArgs([h.c1],[h.resp,comp],rev,F0({w:102.5})));
  assert.deepEqual(noConflict(f),[],rev);assert.equal(f.spent.find(x=>x.spend_id===h.spend).cancelled_by,decisionOf(u.offers[0]).spend_id);
  assert.equal(exOf(f.state).w,102.5);
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
//  I1 no working weight exists that no yes authorized (w is the base's or an accepted target);
//  I2 a proven cancellation (an undo offered and recorded) is never lost, and never re-offered;
//  I3 the same result under both delivery orders (responses moved to a second device,
//     causal parents chained, counters reversed) and under revision R1 or R2;
//  I4 a rename never changes an outcome;
//  I5 a stale offer never writes: after a plan edit the old issuance is never fresh.
// NATIVE_LOAD_PROPERTY_RUNS (default 150) and NATIVE_LOAD_PROPERTY_SEED (default 20260923).
// ======================================================================
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function propertySequence(seed){
 const rnd=mulberry32(seed),pick=xs=>xs[Math.floor(rnd()*xs.length)],chance=p=>rnd()<p;
 const baseline=chance(0.25),origW=baseline?null:100;
 const m={w:origW,n:'Fx Press',comps:[],extras:[],starts:[],proven:[],accepted:new Set(),trace:[],k:0};
 const base=(patch={})=>{const b=F0(origW===null?{w:null}:{});exOf(b).w=patch.w!==undefined?patch.w:m.w;exOf(b).n=patch.n||m.n;return b;};
 const gen=(o={})=>{
  const a=foldArgs(m.comps,m.extras,o.rev||'fx-revision-1',base(o.base));
  const ops=a.generation.collections.ops;let seq=Math.max(0,...Object.values(ops).map(x=>x.device_seq));
  for(const s of m.starts){if(!ops[s.anchor])continue;/* an older view (undo2) predates this Start */ops[s.c.start]={op_id:s.c.start,athlete_id:ATH,device_id:DEVICE,device_seq:s.afterSeq(ops),class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(s.c.start)};captureOn(a.generation,s.c,s.loads);}
  for(const c of m.comps)if(c.v1)captureOn(a.generation,c,c.cap);
  if(o.twoDevice){
   const all=Object.values(ops).sort((x,y)=>x.device_seq-y.device_seq||(x.op_id<y.op_id?-1:1));
   all.forEach((op,i)=>{if(i)op.causal_parents=[all[i-1].op_id];});
   const resp=all.filter(op=>op.class==='plan');resp.forEach((op,i)=>{op.device_id='fx-device-B';op.device_seq=1000-i;});
   void seq;
  }
  return a;
 };
 const fold=o=>EFFECTS.m.foldNativeLoad(gen(o));
 const held=f=>f.issues.some(i=>i.lift===LIFT&&['NATIVE_LOAD_EFFECT_CONFLICT','NATIVE_LOAD_BASIS_REPAIR_REQUIRED','NATIVE_LOAD_RECORD_INVALID'].includes(i.code));
 const fail=(what,extra)=>{const e=new Error('PROPERTY '+what+' seed='+seed+' trace='+JSON.stringify(m.trace)+(extra?' '+JSON.stringify(extra):''));e.code='PROPERTY_COUNTEREXAMPLE';throw e;};
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
   if(ev.status==='offer'){const d=decisionOf(ev.offers[0]);m.extras.push(acceptOp(ev.offers[0],{op_id:'fx-p-'+(++m.k),after:m.comps.length}));m.proven.push({target,undo:d.spend_id});m.trace.push('undo-yes');}
  }else if(action==='base'||action==='plan'){
   const ws=origW===null?[null,45,50]:[100,102.5,97.5,105];m.w=pick(ws);m.trace.push(m.w);
   if(m.lastOffer&&m.lastOffer.w!==m.w&&m.lastOffer.n===m.comps.length){
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
   if(ev.status==='offer'){m.extras.push({...acceptOp(ev.offers[0],{op_id:'fx-p-'+(++m.k),after:m.comps.length}),device:'fx-device-B'});m.trace.push('undo2-yes');}
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
 const at=(base,extra=[],rev='fx-revision-1')=>{const a=foldArgs(cs,extra,rev,base);for(const c of cs)captureLifts(a.generation,c,cap);return a;};
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
 const at=(cs,base,extra=[],rev='fx-revision-1')=>{const a=foldArgs(cs,extra,rev,base);for(const c of cs)captureLifts(a.generation,c,cap);return a;};
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
 assert.ok(f.issues.some(i=>i.code==='NATIVE_LOAD_RECORD_INVALID'&&i.field==='issuance'),JSON.stringify(f.issues));
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
 assert.equal(checkOf(at(10),LIFT,cs[1]).status,'offer','control: the captured window is current');
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
   const current=edit_op_ids.length?{...structuredClone(original),reps:rep(fix)}:structuredClone(original);
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
function captureLifts(gen,c,byLift,repsByLift){
 const cell=v=>v==null?{state:'not_prescribed',display:'Find a working load',source_json:null}:{state:'specified',display:v+' lb',source_json:JSON.stringify({value:v,unit:'lb'})};
 const reps=v=>({state:'specified',display:String(v),source_json:JSON.stringify({value:v,unit:'rep'})});
 gen.collections.ops[c.start].prescription_capture={slots:c.session.record.entries.flatMap(en=>en.slots.map((slot,i)=>({logical_set_slot:slot.logical_set_slot,lift_lineage_id:en.lift_lineage_id,
  load:cell(byLift[en.lift_lineage_id]?byLift[en.lift_lineage_id][i]:null),...(repsByLift&&Number.isFinite(repsByLift[en.lift_lineage_id])?{reps:reps(repsByLift[en.lift_lineage_id])}:{})})))};
}
// Round 9: pathological display names (delimiters, unicode, empty-like, long).
const R9_WALK_NAMES=['Fx Press','Renamed Press','Bench (renamed)','Fx: Press','Fx Row',Array(12).fill('A').join(': '),': : :','',' ',String.fromCharCode(0x3a9,58,32,0x416),'x'.repeat(120)+': z'];
const liftOfSpend=s=>{try{return JSON.parse(s)[1];}catch{return null;}};
function propertySequence8(seed){
 const rnd=mulberry32(seed),pick=xs=>xs[Math.floor(rnd()*xs.length)],chance=p=>rnd()<p;
 const baseline=chance(0.25),rowOn=chance(0.5),origW=baseline?null:100;
 const lifts=rowOn?[LIFT,ROW]:[LIFT];
 const m={base:{},legacy:{},comps:[],extras:[],starts:[],proven:[],ledger:[],lastOffer:{},trace:[],k:0,cross:new Set()};
 // Lifts with a yes that an edit of ANOTHER lift (fork, fact correction) followed.
 const touch=X=>{for(const y of m.ledger)if(y.lift!==X&&y.kind!=='compensate')m.cross.add(y.lift);};
 for(const L of lifts)m.base[L]={w:origW,wSets:null,forks:[],n:L===LIFT?'Fx Press':'Fx Row'};
 const base=(patch={})=>{
  const s=rowOn?withRow(origW===null?{w:null}:{}):F0(origW===null?{w:null}:{});
  for(const L of lifts){const ex=s.exercises.find(x=>x.id===L),B=m.base[L];ex.w=B.w;if(B.wSets)ex.wSets=B.wSets.slice();else delete ex.wSets;ex.forks=structuredClone(B.forks);ex.n=patch.n?patch.n+' '+L:B.n;
   if(B.hi!==undefined)ex.hi=B.hi;if(B.last!==undefined){if(B.last===null)delete ex.last;else ex.last=B.last.slice();}}
  for(const L of lifts)if(m.legacy[L])s.queue.push(structuredClone(m.legacy[L]));
  return s;
 };
 const gen=(o={})=>{
  const a=foldArgs(m.comps.map(c=>c.built),m.extras,o.rev||'fx-revision-1',base(o.base));
  const ops=a.generation.collections.ops;
  for(const s of m.starts){if(!ops[s.anchor])continue;ops[s.built.start]={op_id:s.built.start,athlete_id:ATH,device_id:DEVICE,device_seq:ops[s.anchor].device_seq+0.5,class:'session',kind:'session-start',payload:{},canonical_content_commitment:commit(s.built.start)};captureLifts(a.generation,s.built,{[LIFT]:s.card});}
  for(const c of m.comps){if(c.cap)captureLifts(a.generation,c.built,c.cap,c.hiAt);if(c.anchor&&ops[c.anchor])ops[c.built.start].device_seq=ops[c.anchor].device_seq+0.5;}
  if(o.twoDevice){
   const all=Object.values(ops).sort((x,y)=>x.device_seq-y.device_seq||(x.op_id<y.op_id?-1:1));
   all.forEach((op,i)=>{if(i)op.causal_parents=[all[i-1].op_id];});
   all.filter(op=>op.class==='plan').forEach((op,i)=>{op.device_id='fx-device-B';op.device_seq=1000-i;});
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
 const held=(f,L)=>f.issues.some(i=>(i.lift===L||i.lift===null)&&heldCodes.includes(i.code));
 const fail=(what,extra)=>{const e=new Error('PROPERTY8 '+what+' seed='+seed+' trace='+JSON.stringify(m.trace)+(extra?' '+JSON.stringify(extra):''));e.code='PROPERTY_COUNTEREXAMPLE';throw e;};
 const exIn=(s,L)=>s.exercises.find(x=>x.id===L);
 // The lift's EFFECTIVE plan (an edit that sets a field to the value it had is no edit).
 const effOf=L=>JSON.stringify(exIn(base(),L));
 const lastWith=L=>[...m.comps].reverse().find(c=>c.spec.entries.some(en=>en.lift===L));
 const cardOf=(f,L)=>{const q=f.state.queue.find(x=>x&&x.exId===L&&!x.done&&typeof x.native_load_spend==='string');
  if(q)return Array.isArray(q.newWSets)?q.newWSets.slice():[q.newW,q.newW,q.newW];const ex=exIn(f.state,L);return Array.isArray(ex.wSets)?ex.wSets.slice():[ex.w,ex.w,ex.w];};
 const norm=f=>({state:f.state?lifts.map(L=>{const ex=structuredClone(exIn(f.state,L));delete ex.n;return ex;}):null,
  queue:f.state?f.state.queue.filter(q=>q.native_load_spend).map(q=>{const x={...q};delete x.t;return x;}):null,
  spent:f.spent.map(x=>[x.spend_id,x.cancelled_by,x.close_ref&&x.close_ref.op_id]).sort(),
  issues:[...new Set(f.issues.filter(i=>i.code!=='NATIVE_LOAD_PRODUCER_REVISION_ABSENT_APPLIED').map(i=>i.code+'@'+i.lift))].sort()});
 // Live = kept, not cancelled, not held back. A corrected basis (BASIS_REPAIR_REQUIRED)
 // RETAINS its effect, labeled disputed (spec :157); it only refuses further authorization.
 const live=(f,y)=>{const x=f.spent.find(s=>s.spend_id===y.spend);return !!x&&!x.cancelled_by&&!f.issues.some(i=>i.spend_id===y.spend&&i.code!=='NATIVE_LOAD_BASIS_REPAIR_REQUIRED');};
 const checkInvariants=stage=>{
  const f=fold();
  if(f.status!=='ready'||!f.state){m.refusedFold=(m.refusedFold||0)+1;return f;}
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
    if(!m.comps.some(c=>c.seen[L]&&JSON.stringify(c.seen[L])===JSON.stringify(y.target)&&c.capExtras.includes(y.op)))fail('I1 landed without a closed Start that captured the target after the yes at '+stage,ctx);
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
    const want=root&&root.kind!=='compensate'&&live(f,root)?root.targetW:B.w;
    if(ex.w!==want)fail('I1 an agreed weight survives its cancellation at '+stage,{...ctx,want});
    if(ex.w===t.targetW&&t.targetW!==want)fail('I1 the cancelled weight is current at '+stage,ctx);
   }else fail('I1 unknown authority kind '+auth.kind+' at '+stage,ctx);
  }
  for(const p of m.proven){
   const x=f.spent.find(y=>y.spend_id===p.target);
   if(!x||!x.cancelled_by)fail('I2 proven cancellation lost at '+stage,{target:p.target});
   const L=liftOfSpend(p.target),c=lastWith(L);
   if(c&&!held(f,L)){const again=checkOf(gen(),L,c.built,{compensate:p.target});if(again.status==='offer')fail('I2 cancelled spend offered again at '+stage);}
  }
  return f;
 };
 const steps=8+Math.floor(rnd()*12);
 for(let step=0;step<steps;step++){
  const f=fold();
  if(f.status!=='ready'||!f.state){m.trace.push('fold-refused');break;}
  // Weights: the rare classes appear about once per walk so that yeses stay frequent.
  const L=pick(lifts),action=pick(m.comps.length<2?['train','train','train','train','base','rename']:
   ['train','train','train','train','check','check','check','check','undo','undo','base','rename','plan','capture','finish','reopen','dup','undo2',
    ...(chance(0.5)?['correct','fork','legacy','vector']:[]),...(chance(0.5)?['window','cache']:[])]);
  m.trace.push(action);
  if(action==='train'){
   const on=(rowOn?pick([[LIFT],[ROW],[LIFT,ROW],[LIFT,ROW]]):[LIFT]).filter(x=>!held(f,x));
   if(!on.length){m.trace.push('skip-held');continue;}
   const n=m.comps.length+1,v1=chance(0.3),cap={},entries=[];
   for(const X of on){
    const card=cardOf(f,X),lifted=card[0]===null?card.map(()=>pick([60,65])):chance(0.15)?card.map(v=>v+5):card.slice();
    entries.push({lift:X,reps:pick([TOP,TOP,TOP,[10,9,7],[9,8,8]]),loads:lifted,prescribed:card,effort:chance(0.8)?e(2,1,1):e(0,1,1),v1});
    if(v1||chance(0.5))cap[X]=card;
   }
   const spec={n,entries},seen={};
   // What the landing reads (FC03 captureOf): the Start's capture cell, else a typed v2
   // slot's own prescribed_load (the card it was prescribed), never a v1 slot's.
   for(const en of entries)seen[en.lift]=cap[en.lift]?cap[en.lift]:en.v1?null:en.prescribed.slice();
   // Round 9: the Start capture also carries a rep target per set (<= the window top then).
   const hiAt={};for(const X of on)hiAt[X]=m.base[X].hi===undefined?10:m.base[X].hi;
   m.comps.push({spec,built:sess2(n,spec),cap:Object.keys(cap).length?cap:null,hiAt,seen,capExtras:m.extras.map(x=>x.op_id)});
   m.trace.push([n,on.map(x=>x===LIFT?'P':'R').join(''),entries[0].prescribed[0],entries[0].loads[0],v1?'v1':'v2',Object.keys(cap).length?'cap':'']);
  }else if(action==='check'){
   const c=lastWith(L);if(!c)continue;
   const ev=checkOf(gen(),L,c.built);
   if(ev.status==='offer'){
    const offer=pick(ev.offers),d=decisionOf(offer),held0=EFFECTS.m.issuanceFor(offer,{revision:'fx-revision-1',source:JSON.stringify(SOURCE),moment:'2026-10-02T12:00:00.000Z'});
    m.lastOffer[L]={held:held0,base:effOf(L),n:m.comps.length};
    if(chance(0.7)){
     const op_id='fx-p-'+(++m.k);m.extras.push(acceptOp(offer,{op_id,after:m.comps.length}));
     m.ledger.push({lift:L,spend:d.spend_id,kind:d.kind,target:d.target_load.vector.map(v=>v?v.value:null),targetW:d.target_load.scalar?d.target_load.scalar.value:null,op:op_id});
     m.trace.push('yes:'+d.kind+':'+(d.target_load.scalar&&d.target_load.scalar.value));
    }
   }else m.trace.push('refused:'+ev.refusal.code);
  }else if(action==='undo'){
   const c=lastWith(L);if(!c)continue;
   const liveSp=f.spent.filter(x=>!x.cancelled_by&&liftOfSpend(x.spend_id)===L&&!x.spend_id.startsWith('["native-load-compensation"'));
   if(!liveSp.length)continue;
   const target=pick(liveSp).spend_id,ev=checkOf(gen(),L,c.built,{compensate:target});
   if(ev.status==='offer'){const d=decisionOf(ev.offers[0]),op_id='fx-p-'+(++m.k);m.extras.push(acceptOp(ev.offers[0],{op_id,after:m.comps.length}));m.proven.push({target,undo:d.spend_id});
    m.ledger.push({lift:L,spend:d.spend_id,kind:'compensate',target:null,targetW:null,op:op_id});m.trace.push('undo-yes');}
  }else if(action==='base'||action==='plan'||action==='vector'||action==='fork'){
   const B=m.base[L];
   if(action==='fork'){if(B.forks.length>=2)continue;touch(L);B.forks.push({from:pick([dayAt(m.comps.length),dayAt(Math.max(0,m.comps.length-1)),dayAt(m.comps.length+1)]),kind:'reset',why:'SYNTHETIC'});m.trace.push(['fork',L,B.forks.at(-1).from]);}
   else if(action==='vector'){if(B.w===null)continue;B.wSets=B.wSets?null:[B.w,B.w,B.w-5];m.trace.push(['vector',L,B.wSets]);}
   else{B.w=pick(origW===null?[null,45,50]:[100,102.5,97.5,105]);B.wSets=B.wSets&&B.w!==null?[B.w,B.w,B.w-5]:null;m.trace.push([action,L,B.w]);}
   const lo=m.lastOffer[L];
   if(lo&&lo.base!==effOf(L)&&lo.n===m.comps.length){
    const c=lastWith(L),ev=checkOf(gen(),L,c.built);
    if(ev.status==='offer'&&ev.offers.some(o=>EFFECTS.m.sameIssued(o,lo.held)))fail('I5 stale offer still fresh after a plan edit',{lift:L});
   }
  }else if(action==='dup'){
   if(!m.extras.length)continue;
   const src=pick(m.extras);m.extras.push({...src,op_id:'fx-p-'+(++m.k),after:m.comps.length,device:'fx-device-B'});m.trace.push('dup');
  }else if(action==='undo2'){
   if(!m.proven.length)continue;
   const p=pick(m.proven),idx=m.extras.findIndex(x=>x.payload.issuance.body.compensates===p.target),PL=liftOfSpend(p.target),c=lastWith(PL);
   const save=m.extras;m.extras=m.extras.slice(0,idx);const ev=checkOf(gen(),PL,c.built,{compensate:p.target});m.extras=save;
   if(ev.status==='offer'){const op_id='fx-p-'+(++m.k);m.extras.push({...acceptOp(ev.offers[0],{op_id,after:m.comps.length}),device:'fx-device-B'});m.trace.push('undo2-yes');}
  }else if(action==='rename'){m.base[L].n=pick(R9_WALK_NAMES);m.trace.push(['rename',L,m.base[L].n]);}
  else if(action==='window'||action==='cache'){
   // Round 9: a later rep-window edit or cached-line change; never revokes a recorded yes
   // (DECISIONS:793); a new check on work captured above the new window is PLAN_CHANGED.
   const B=m.base[L];
   if(action==='window'){B.hi=pick([9,10,11,12]);m.trace.push(['window',L,B.hi]);}
   else{B.last=pick([null,[9,8,7],[10,10,10],[12,11,10]]);m.trace.push(['cache',L,B.last]);}
   const lo=m.lastOffer[L];
   if(lo&&lo.base!==effOf(L)&&lo.n===m.comps.length){
    const c=lastWith(L),ev=checkOf(gen(),L,c.built);
    if(ev.status==='offer'&&ev.offers.some(o=>EFFECTS.m.sameIssued(o,lo.held)))fail('I5 stale offer still fresh after a window or cache edit',{lift:L});
   }
  }
  else if(action==='capture'){
   if(held(f,LIFT)||m.starts.length)continue;
   const card=cardOf(f,LIFT);if(card[0]===null)continue;
   const built=sess2(900,{entries:[{lift:LIFT,reps:TOP,loads:card,prescribed:card,effort:e(2,1,1)}]}),lastExtra=m.extras.filter(x=>x.after===m.comps.length).at(-1);
   m.starts.push({built,card,anchor:lastExtra?lastExtra.op_id:m.comps.at(-1).built.close,nAt:m.comps.length,capExtras:m.extras.map(x=>x.op_id)});m.trace.push(['capture',card]);
  }else if(action==='finish'){
   // The Close of the Start that captured the card: the session keeps its Start where it
   // was captured, before any yes recorded after the capture.
   const s=m.starts[0];if(!s||s.nAt!==m.comps.length)continue;
   const n=m.comps.length+1,spec={n,entries:[{lift:LIFT,reps:pick([TOP,TOP,[10,9,7]]),loads:s.card.slice(),prescribed:s.card.slice(),effort:e(2,1,1),v1:false}]};
   m.comps.push({spec,built:sess2(n,spec),cap:{[LIFT]:s.card.slice()},seen:{[LIFT]:s.card.slice()},capExtras:s.capExtras,anchor:s.anchor});m.starts=[];m.trace.push(['finish',s.card]);
  }else if(action==='correct'){
   // Mostly a completion some recorded yes consumed (the BASIS_REPAIR_REQUIRED path, :157).
   const consumed=new Set(f.spent.flatMap(x=>{try{const d=JSON.parse(x.spend_id);return d[0]==='native-load'?d[4]:[];}catch{return [];}}));
   const hits=m.comps.flatMap(c=>c.spec.entries.filter(en=>consumed.has(JSON.stringify([c.built.start,en.lift,c.built.close]))).map(en=>[c,en]));
   const [c,en]=hits.length&&chance(0.8)?pick(hits):(()=>{const c0=pick(m.comps);return [c0,pick(c0.spec.entries)];})(),pos=1+Math.floor(rnd()*en.reps.length);
   if(en.corrected||en.reps[pos-1]<2)continue;
   en.corrected={[pos]:en.reps[pos-1]-1};touch(en.lift);c.built=sess2(c.spec.n,c.spec);m.trace.push(['correct',c.spec.n,en.lift,pos]);
   const root=JSON.stringify([c.built.start,en.lift,c.built.close]);
   if(f.spent.some(x=>{try{const d=JSON.parse(x.spend_id);return d[0]==='native-load'&&d[4].includes(root);}catch{return false;}})){
    m.trace.push('correct-consumed');if(fold().issues.some(i=>i.code==='NATIVE_LOAD_BASIS_REPAIR_REQUIRED'))m.trace.push('correct-consumed-repair');
   }
  }else if(action==='legacy'){
   if(m.legacy[L])delete m.legacy[L];
   else m.legacy[L]={exId:L,kind:'debut',done:false,state:'PROPOSED',newW:(m.base[L].w===null?60:m.base[L].w+5),t:'SYNTHETIC legacy'};
   m.trace.push(['legacy',L,!!m.legacy[L]]);
  }
  checkInvariants('step '+step);
 }
 const f=checkInvariants('end'),ref0=norm(f);
 // Round 9 (DECISIONS:793): the round-8 'stop-P4' exemption is gone; every revision or
 // delivery difference is a counterexample.
 const differ=(what,o,a,b,extra)=>{if(JSON.stringify(a)===JSON.stringify(b))return;fail(what+' '+JSON.stringify(o),{ref:a,got:b,...extra});};
 for(const o of [{rev:'fx-revision-2'},{twoDevice:true},{twoDevice:true,rev:'fx-revision-2'}])
  differ('I3 differs under',o,ref0,norm(fold(o)),{refIssues:f.issues,ledger:m.ledger,comps:m.comps.map(c=>({spec:c.spec,cap:c.cap,anchor:c.anchor||null})),base:m.base,legacy:m.legacy});
 const u0=norm(fold({unproven:'same'}));
 for(const o of [{unproven:'late'},{unproven:'early'},{unproven:'same',rev:'fx-revision-2'},{unproven:'late',rev:'fx-revision-2'}])
  differ('I6 unprovable order differs under',o,u0,norm(fold(o)),{});
 const r=norm(fold({base:{n:'Property Rename'}}));
 if(JSON.stringify(r)!==JSON.stringify(ref0))fail('I4 rename changes the outcome',{ref:ref0,got:r});
 const tally={};for(const t of m.trace){const k=typeof t==='string'?t.split(':').slice(0,2).join(':'):Array.isArray(t)&&typeof t[0]==='string'?t[0]:null;if(k)tally[k]=(tally[k]||0)+1;}
 for(const e2 of f.effects)tally['effect:'+e2.kind]=(tally['effect:'+e2.kind]||0)+1;
 for(const i of f.issues)tally['issue:'+i.code]=(tally['issue:'+i.code]||0)+1;
 for(const i of fold({unproven:'same'}).issues)tally['unproven-issue:'+i.code]=(tally['unproven-issue:'+i.code]||0)+1;
 if(baseline)tally.baseline=1;if(rowOn)tally.rowOn=1;if(m.refusedFold)tally.refusedFold=m.refusedFold;if(m.stopP4)tally['stop-P4']=1;
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
