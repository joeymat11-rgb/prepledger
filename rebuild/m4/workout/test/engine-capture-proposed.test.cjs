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
Module._load=function guardedLoad(request,parent,isMain){
 let file=null;try{file=Module._resolveFilename(request,parent,isMain);}catch{file=null;}
 if(typeof file==='string'&&PROTECTED.test(file)){const e=new Error('PROTECTED_ENGINE_MODULE_REFUSED '+path.basename(file));e.code='PROTECTED_ENGINE_MODULE_REFUSED';throw e;}
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
function state({wSets,queue}){
 const s=F.createSyntheticState(CARD_DAY);s.sessionLog={};
 const ex={id:LIFT,n:'Fx Row',mg:'back',day:'U',w:100,inc:5,sets:wSets?wSets.length:3,hi:10,holdFlag:false,topAt:null,topRun:0,setup:'SYNTHETIC',note:'SYNTHETIC',forks:[]};
 if(wSets)ex.wSets=wSets.slice();
 s.exercises.push(ex);s.queue.push(...queue.map(q=>structuredClone(q)));return s;
}
// Field shapes of earn.cjs:80 (PROPOSED two-rung) and earn.cjs:88 (DEBUT), invented loads.
const offer=(newW,newWSets)=>({id:'q_fx_'+newW+'_2r',kind:'debut',exId:LIFT,newW,...(newWSets?{newWSets}:{}),done:false,state:'PROPOSED',t:'FX ROW '+newW+' TWO-RUNG DEBUT PROPOSED'});
const debut=(newW,newWSets,kind='debut')=>({id:'q_fx_'+newW+'_'+kind,kind,exId:LIFT,newW,...(newWSets?{newWSets}:{}),done:false,state:'DEBUT',t:'FX ROW '+newW+' DEBUT'});
function run(s){
 const E=engineAt(CARD_DAY),adapter=createEngineWorkoutCapture({engine:E,prescriptionCapture:stubCapture,producerIdentity:producer});
 const card=E.genSession(structuredClone(s),CARD_DAY).ex.find(c=>c.id===LIFT);
 assert.ok(card,'PRECONDITION fixture lift is on the '+CARD_DAY+' card');
 let out=null,refused=null;
 try{out=adapter.prepare({state:s,day:CARD_DAY,basis:{plan_basis:'synthetic-plan',input_basis:'synthetic-input',source_revision:1}});}catch(e){refused=e.code||String(e);}
 const loads=out?out.capture.slots.filter(x=>x.lift_lineage_id===LIFT).map(x=>JSON.parse(x.load.source_json).value):null;
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
test('CAP-G guard: the protected five are refused before load',()=>{
 for(const n of ['seed','migrate','merge','index','oracle-shim'])
  assert.throws(()=>require(path.join(ROOT,'rebuild/engine',n+'.cjs')),{code:'PROTECTED_ENGINE_MODULE_REFUSED'});
});
