'use strict';
// D-EPP-2 RED-FIRST CELL (Claude review f0a5eb1a section 4 and D-EPP-2; DECISIONS:639,
// :644 D2, :784-785 2b; NATIVE-LOAD-SPEC 6ddf7af R7). engine-capture.cjs:69-70 counts
// PROPOSED debut entries when proving which load vector won, so the producer-issued
// pair (earn.cjs:80 PROPOSED two-rung, then earn.cjs:88 DEBUT) refuses the whole day.
// Intended shape (f0a5eb1a D-EPP-2): line 69 takes the same x.state!=="PROPOSED"
// exclusion as the EPP clauses (today.cjs:97, writers.cjs:227 at 0d38b8e) and keeps
// the plurality refusal for two ELIGIBLE entries. The engine is composed here from
// the twelve public factories by explicit name (engine-runtime.cjs MODULES order);
// rebuild/engine/index.cjs is never required and a loader guard refuses the
// protected five before any engine file loads. The prescription validator is a
// declared identity stub: this cell measures load selection only. Every fixture
// value is INVENTED; the queue entries copy the producer's field shapes.
const Module=require('node:module'),path=require('node:path');
const ROOT=path.resolve(__dirname,'../../../..');
const PROTECTED=/[\\/]rebuild[\\/]engine[\\/](seed|migrate|merge|index|oracle-shim)\.cjs$/;
const originalLoad=Module._load;
const refuse=file=>{const e=new Error('PROTECTED_ENGINE_MODULE_REFUSED '+path.basename(file));e.code='PROTECTED_ENGINE_MODULE_REFUSED';throw e;};
Module._load=function guardedLoad(request,parent,isMain){
 // D-CR-6: judge the request itself BEFORE resolution, so an absent or relocated protected file is refused,
 // never reported as MODULE_NOT_FOUND; then judge the resolved file as before.
 if(typeof request==='string'&&(path.isAbsolute(request)||request.startsWith('.'))){
  const literal=path.resolve(parent&&parent.filename?path.dirname(parent.filename):process.cwd(),request);
  if(PROTECTED.test(literal)||PROTECTED.test(literal+'.cjs'))refuse(literal);
 }
 let file=null;try{file=Module._resolveFilename(request,parent,isMain);}catch{file=null;}
 if(typeof file==='string'&&PROTECTED.test(file))refuse(file);
 return originalLoad.apply(this,arguments);
};
const test=require('node:test'),assert=require('node:assert/strict');
const F=require(path.join(ROOT,'rebuild/m3/w7-preview/fixtures.cjs'));
const {createEngineWorkoutCapture,PROFILE}=require(path.join(ROOT,'rebuild/m4/workout/engine-capture.cjs'));
const MODULES=Object.freeze(['dates','constants','plan','performed','progression','sleep','energy','policy','today','volume','earn','writers']);
const FACTORIES=Object.freeze(Object.fromEntries(MODULES.map(n=>[n,require(path.join(ROOT,'rebuild/engine',n+'.cjs'))])));
function absentProvider(name){const fail=()=>{const e=new Error('ENGINE_RUNTIME_'+name+'_PROVIDER_REQUIRED');e.code=e.message;throw e;};
 const trap={};for(const k of ['filter','map','forEach','slice','find','some','every','reduce','flatMap','concat','entries','values','keys','at','includes'])trap[k]=fail;
 Object.defineProperty(trap,Symbol.iterator,{value:fail});Object.defineProperty(trap,'length',{get:fail});return Object.freeze(trap);}
const clockFor=day=>({today:()=>day,nowISO:()=>day+'T12:00:00.000Z',nowMs:()=>Date.parse(day+'T12:00:00.000Z'),hour:()=>12,dow:()=>new Date(day+'T00:00:00Z').getUTCDay()});
const assumedContext=request=>({...request,hard:false,rushed:false,debt:false});
function engineAt(day){
 const mint=()=>{const e=new Error('ENGINE_RUNTIME_IDS_UNAVAILABLE');e.code=e.message;throw e;};
 const deps={clock:clockFor(day),ids:Object.freeze({next:mint,fresh:mint}),drafts:Object.freeze({length:0,key:()=>null})};
 const E={HISTORY:absentProvider('HISTORY'),ROLLUPS:absentProvider('ROLLUPS'),exById:(s,id)=>s.exercises.find(e=>e.id===id)};
 for(const name of MODULES)Object.assign(E,name==='performed'?FACTORIES[name](E,{nativeTrendContext:assumedContext}):FACTORIES[name](E,deps));
 return E;
}

// ---------- INVENTED fixture ----------
const LIFT='fx-row',CARD_DAY='2026-10-12'; // a Monday: day type 'U' in createSyntheticState's split
const producer={app_build:'synthetic-capture-proposed-test',engine_build:'synthetic',rule_profile:PROFILE,source_schema:'synthetic-complete-engine-input'};
const stubCapture=Object.freeze({profile:'earned/workout-prescription/v1',prepare:x=>structuredClone(x)});
function state({wSets,queue,extra=[]}){
 const s=F.createSyntheticState(CARD_DAY);s.sessionLog={};
 const ex={id:LIFT,n:'Fx Row',mg:'back',day:'U',w:100,inc:5,sets:wSets?wSets.length:3,hi:10,holdFlag:false,topAt:null,topRun:0,setup:'SYNTHETIC',note:'SYNTHETIC',forks:[]};
 if(wSets)ex.wSets=wSets.slice();
 s.exercises.push(ex,...extra.map(x=>structuredClone(x)));s.queue.push(...queue.map(q=>structuredClone(q)));return s;
}
// Field shapes of earn.cjs:80 (PROPOSED two-rung) and earn.cjs:88 (DEBUT), invented loads.
const offer=(newW,newWSets)=>({id:'q_fx_'+newW+'_2r',kind:'debut',exId:LIFT,newW,...(newWSets?{newWSets}:{}),done:false,state:'PROPOSED',t:'FX ROW '+newW+' TWO-RUNG DEBUT PROPOSED'});
const debut=(newW,newWSets,kind='debut')=>({id:'q_fx_'+newW+'_'+kind,kind,exId:LIFT,newW,...(newWSets?{newWSets}:{}),done:false,state:'DEBUT',t:'FX ROW '+newW+' DEBUT'});
function run(s,lift=LIFT){
 const E=engineAt(CARD_DAY),adapter=createEngineWorkoutCapture({engine:E,prescriptionCapture:stubCapture,producerIdentity:producer});
 const card=E.genSession(structuredClone(s),CARD_DAY).ex.find(c=>c.id===lift);
 assert.ok(card,'PRECONDITION fixture lift is on the '+CARD_DAY+' card');
 let out=null,refused=null;
 try{out=adapter.prepare({state:s,day:CARD_DAY,basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:1}});}catch(e){refused=e.code||String(e);}
 const loads=out?out.capture.slots.filter(x=>x.lift_lineage_id===lift).map(x=>JSON.parse(x.load.source_json).value):null;
 return {card,loads,refused};
}

test('CAP-P1 producer pair, uneven vector: PROPOSED 110 [110,105] then DEBUT 105 [105,100] captures the DEBUT',()=>{
 const r=run(state({wSets:[100,95],queue:[offer(110,[110,105]),debut(105,[105,100])]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION the DEBUT wins the structural slot (today.cjs:55)');
 assert.equal(r.refused,null,'RED D-EPP-2: capture refused '+r.refused+' (engine-capture.cjs:69-70 counts the PROPOSED entry)');
 assert.equal(r.card.w,105,'the card is the DEBUT load, never the untapped offer');
 assert.deepEqual(r.loads,[105,100],'captured loads are the DEBUT vector');
});
test('CAP-P2 producer pair, scalar lift: PROPOSED 110 then DEBUT 105 captures 105 on every set',()=>{
 const r=run(state({queue:[offer(110),debut(105)]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION the DEBUT wins the structural slot (today.cjs:55)');
 assert.equal(r.refused,null,'RED D-EPP-2: capture refused '+r.refused+' (engine-capture.cjs:69-70 counts the PROPOSED entry)');
 assert.equal(r.card.w,105,'the card is the DEBUT load, never the untapped offer');
 assert.deepEqual(r.loads,r.card.tgt.map(()=>105),'captured loads are the DEBUT load, never the untapped offer');
});
test('CAP-P3 reversed pair: DEBUT 105 then PROPOSED 110 captures the DEBUT',()=>{
 const r=run(state({wSets:[100,95],queue:[debut(105,[105,100]),offer(110,[110,105])]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION');
 assert.equal(r.refused,null,'RED D-EPP-2: capture refused '+r.refused);
 assert.equal(r.card.w,105);assert.deepEqual(r.loads,[105,100]);
});
test('CAP-C1 control: two ELIGIBLE entries still refuse (plurality refusal kept, f0a5eb1a D-EPP-2)',()=>{
 const r=run(state({wSets:[100,95],queue:[debut(105,[105,100]),debut(110,[110,105],'unlock'),offer(115,[115,110])]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION');
 assert.equal(r.refused,'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');
});
test('CAP-C2 control: a lone PROPOSED never wins the slot and the card captures the old load',()=>{
 const r=run(state({wSets:[100,95],queue:[offer(110,[110,105])]}));
 assert.equal(r.card.isDebutNow,false,'PRECONDITION today.cjs:55 excludes PROPOSED from the structural pick');
 assert.equal(r.refused,null);assert.equal(r.card.w,100);assert.deepEqual(r.loads,[100,95]);
});
test('CAP-G guard: the protected five are refused before load, and before resolution (D-CR-6)',()=>{
 for(const n of ['seed','migrate','merge','index','oracle-shim'])
  assert.throws(()=>require(path.join(ROOT,'rebuild/engine',n+'.cjs')),{code:'PROTECTED_ENGINE_MODULE_REFUSED'});
 // A request that names a protected file refuses even where no such file exists (no MODULE_NOT_FOUND first).
 const absent=path.join(require('node:os').tmpdir(),'earned-capture-guard-absent-'+process.pid,'rebuild','engine');
 for(const n of ['seed.cjs','migrate.cjs','merge','index','oracle-shim.cjs'])
  assert.throws(()=>require(path.join(absent,n)),{code:'PROTECTED_ENGINE_MODULE_REFUSED'},'pre-resolve '+n);
});
// ---------- Round 2 (Fable D-CR-4, D-CR-5; Astra D4): durable kills for every clause of engine-capture.cjs:69-70.
// The eligibility clauses mirror today.cjs:97 (same lift, unfinished, not PROPOSED, debut/unlock) behind the
// isDebutNow gate. Only the PROPOSED clause is this repair's; the rest are PRE-EXISTING gates pinned as-is.
const legacy=(newW,newWSets)=>{const q=debut(newW,newWSets);delete q.state;q.id='q_fx_'+newW+'_legacy';return q;};
test('CAP-L1 a state-less legacy entry beside a PROPOSED stays eligible, as today.cjs:97 treats it (Fable M3, Astra M8)',()=>{
 const r=run(state({wSets:[100,95],queue:[offer(110,[110,105]),legacy(105,[105,100])]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION a state-less entry wins the structural slot (today.cjs:55)');
 assert.equal(r.refused,null,'capture refused '+r.refused);
 assert.equal(r.card.w,105);assert.deepEqual(r.loads,[105,100],'captured loads are the state-less entry vector');
});
test('CAP-D1 a finished debut is not a selected move (pre-existing !q.done gate; Fable M4, Astra M4)',()=>{
 const r=run(state({wSets:[100,95],queue:[{...debut(105,[105,100]),id:'q_fx_105_done',done:true},debut(110,[110,105])]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION');
 assert.equal(r.refused,null,'capture refused '+r.refused);
 assert.equal(r.card.w,110);assert.deepEqual(r.loads,[110,105]);
});
test('CAP-O1 another lift\'s debut is not this lift\'s move (pre-existing same-lift gate; Astra M5)',()=>{
 const r=run(state({wSets:[100,95],queue:[{...debut(105,[105,100]),id:'q_fx_other_105',exId:'fx-absent-lift'},debut(110,[110,105])]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION');
 assert.equal(r.refused,null,'capture refused '+r.refused);
 assert.equal(r.card.w,110);assert.deepEqual(r.loads,[110,105]);
});
test('CAP-K1 a same-lift entry of another kind is not a move (pre-existing debut/unlock gate; Astra M6)',()=>{
 const r=run(state({wSets:[100,95],queue:[{...debut(105,[105,100]),id:'q_fx_note_105',kind:'note'},debut(110,[110,105])]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION');
 assert.equal(r.refused,null,'capture refused '+r.refused);
 assert.equal(r.card.w,110);assert.deepEqual(r.loads,[110,105]);
});
test('CAP-U1 an unlock is a move (pre-existing debut/unlock gate; Astra M7)',()=>{
 const r=run(state({wSets:[100,95],queue:[offer(115,[115,110]),debut(110,[110,105],'unlock')]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION');
 assert.equal(r.refused,null,'capture refused '+r.refused);
 assert.equal(r.card.w,110);assert.deepEqual(r.loads,[110,105]);
});
test('CAP-A1 a lift that did not win the slot keeps its old vector although its debut is queued (pre-existing isDebutNow gate; Fable M7)',()=>{
 const other={id:'fx-curl',n:'Fx Curl',mg:'arms',day:'U',w:100,wSets:[100,95],inc:5,sets:2,hi:10,holdFlag:false,topAt:null,topRun:0,setup:'SYNTHETIC',note:'SYNTHETIC',forks:[]};
 const s=state({wSets:[100,95],extra:[other],queue:[debut(110,[110,105]),{...debut(105,[105,100]),id:'q_fx_curl_105',exId:'fx-curl'}]});
 const r=run(s,'fx-curl');
 assert.equal(r.card.isDebutNow,false,'PRECONDITION the first non-rider debut is the only main (today.cjs:57)');
 assert.equal(r.refused,null,'capture refused '+r.refused);
 assert.equal(r.card.w,100);assert.deepEqual(r.loads,[100,95],'the queued debut vector is not captured for a lift that did not win');
 const main=run(s);assert.equal(main.card.w,110);assert.deepEqual(main.loads,[110,105]);
});
test('CAP-C3 two same-state DEBUT entries refuse (plurality refusal; Astra I-two-debuts)',()=>{
 const r=run(state({wSets:[100,95],queue:[debut(105,[105,100]),{...debut(110,[110,105]),id:'q_fx_110_second'}]}));
 assert.equal(r.card.isDebutNow,true,'PRECONDITION');
 assert.equal(r.refused,'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED');
});
