'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {createEngineWorkoutCapture,PROFILE}=require('../engine-capture.cjs'),Source=require('../../spec/performed-proposal/source.cjs');
const F=require('../../../m3/w7-preview/fixtures.cjs'),sources=Source.construct(Source.baseline()).sources;
const w6=process.env.PERFORMED_W6_DIR;if(!w6)throw Error('Provide retained PERFORMED_W6_DIR');
const producer={app_build:'synthetic-engine-capture-test',engine_build:Source.base,rule_profile:PROFILE,source_schema:'synthetic-complete-engine-input'};
const clock={today:()=>F.SYNTHETIC_DAY,nowISO:()=>F.SYNTHETIC_DAY+'T12:00:00.000Z',hour:()=>12};
async function fixture({clockDay=F.SYNTHETIC_DAY}={}){
 const {parseStrictJson}=await import(pathToFileURL(path.join(w6,'rebuild/m3/w6/strict-json.mjs'))),Capture=require(path.join(w6,'rebuild/m4/workout/capture.cjs'));
 const heldClock={...clock,today:()=>clockDay};
 const load=Source.load(sources),engine=load('rebuild/m3/w7-preview/browser-engine.cjs').createBrowserEngine({clock:heldClock});
 Object.assign(engine,load('rebuild/engine/writers.cjs')(engine,{clock:heldClock,ids:{next(){throw Error('Unexpected writer');}},drafts:{length:0,key:()=>null}}));
 const adapter=createEngineWorkoutCapture({engine,prescriptionCapture:Capture.createPrescriptionCapture({parseStrictJson}),producerIdentity:producer});
 const input={state:F.createSyntheticState(),day:F.SYNTHETIC_DAY,basis:{plan_basis:'synthetic-original-plan',input_basis:'synthetic-input',source_revision:1}};
 return {engine,adapter,input,prescriptionCapture:Capture.createPrescriptionCapture({parseStrictJson}),parseStrictJson};
}
test('actual engine targets and per-set plan loads produce a validated complete capture and registered layout',async()=>{
 const {engine,adapter,input}=await fixture();input.state.exercises[0].wSets=[40,35];const before=structuredClone(input),out=adapter.prepare(input);
 const card=engine.genSession(input.state,input.day).ex[0],slots=out.capture.slots.filter(s=>s.lift_lineage_id===card.id);
 assert.deepEqual(slots.map(s=>JSON.parse(s.load.source_json).value),[40,35]);assert.deepEqual(slots.map(s=>JSON.parse(s.reps.source_json).value),card.tgt);
 assert.deepEqual(slots.map(s=>JSON.parse(s.effort.source_json).target),engine.rirPlan(input.state,card).plan);
 assert.deepEqual(slots.map(s=>s.logical_set_slot),[JSON.stringify([card.id,1]),JSON.stringify([card.id,2])]);
 assert.equal(out.layout.correspondence_profile,PROFILE);assert.deepEqual(out.layout.slots.slice(0,2).map(s=>s.position),[1,2]);
 assert(slots.every(s=>s.confidence.state==='unknown'));assert.deepEqual(input,before);
});
test('original layout reconstruction requires the complete original engine input and exact capture',async()=>{
 const {adapter,input}=await fixture(),out=adapter.prepare(input),start={prescription_capture:out.capture};
 const current=structuredClone(input);current.state.exercises[0].w=60;current.basis.source_revision=2;
 assert.deepEqual(adapter.resolveLayout({start,originalInput:input}),out.layout);
 assert.throws(()=>adapter.resolveLayout({start,originalInput:current}),{code:'ENGINE_CAPTURE_ORIGINAL_INPUT_REQUIRED'});
 current.basis=structuredClone(input.basis);assert.throws(()=>adapter.resolveLayout({start,originalInput:current}),{code:'ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT'});
 const changed=structuredClone(start);changed.prescription_capture.slots[0].logical_set_slot='renamed';
 assert.throws(()=>adapter.resolveLayout({start:changed,originalInput:input}),{code:'ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT'});
 delete changed.prescription_capture.producer.engine_build;assert.throws(()=>adapter.resolveLayout({start:changed,originalInput:input}),{code:'ENGINE_CAPTURE_ORIGINAL_INPUT_REQUIRED'});
});
test('clock-dependent alarm reconstruction uses the held original engine while current capture uses the current clock',async()=>{
 const original=await fixture(),laterDay=F.dayOffset(F.SYNTHETIC_DAY,3),current=await fixture({clockDay:laterDay});
 original.input.state.pulse=Array.from({length:14},(_,i)=>({d:F.dayOffset(F.SYNTHETIC_DAY,i-13),bpm:i===13?70:60}));
 const originalBefore=structuredClone(original.input),captured=original.adapter.prepare(original.input),start={prescription_capture:captured.capture};
 assert(original.engine.bodyAlarm(original.input.state),'Actual original-day alarm fires');
 assert.equal(current.engine.bodyAlarm(structuredClone(original.input.state)),null,'Actual later clock no longer treats that old spike as current');
 assert.deepEqual(captured.capture.slots.slice(0,2).map(s=>JSON.parse(s.effort.source_json).target),[2,1]);
 assert.throws(()=>current.adapter.resolveLayout({start,originalInput:original.input}),{code:'ENGINE_CAPTURE_ORIGINAL_DISAGREEMENT'},'Old day string cannot override the wrong injected clock');
 assert.deepEqual(original.adapter.resolveLayout({start,originalInput:original.input}),captured.layout);
 const currentInput={...structuredClone(original.input),day:laterDay,basis:{...original.input.basis,source_revision:2}};
 const today=current.adapter.prepare(currentInput);assert.deepEqual(today.capture.slots.slice(0,2).map(s=>JSON.parse(s.effort.source_json).target),[2,0]);
 assert.deepEqual(original.input,originalBefore);assert.deepEqual(original.adapter.resolveLayout({start,originalInput:original.input}),captured.layout);
});
test('actual baseline prompt does not turn placeholder zero reps into a numeric target or invent a load',async()=>{
 const {adapter,input}=await fixture();input.state.exercises[0].w=null;input.state.exercises[0].last=null;const out=adapter.prepare(input);
 const slots=out.capture.slots.filter(s=>s.lift_lineage_id==='demo-press');assert(slots.every(s=>s.load.state==='not_prescribed'&&s.reps.state==='not_prescribed'));
 assert(slots.every(s=>s.load.source_json===null&&s.reps.source_json===null));assert.match(slots[0].reason.display,/DEBUT/);
});
test('a one-set held lift retains its actual opener effort guard across the generated card boundary',async()=>{
 const {engine,adapter,input}=await fixture(),ex=input.state.exercises[0];ex.sets=1;ex.last=[10];ex.holdFlag=true;
 const card=engine.genSession(input.state,input.day).ex[0];assert.equal(card.holdFlag,undefined,'Actual card omits the guard');
 assert.deepEqual(engine.rirPlan(input.state,{...card,holdFlag:ex.holdFlag}).plan,[2]);
 const slot=adapter.prepare(input).capture.slots[0];assert.deepEqual(JSON.parse(slot.effort.source_json),{target:2,unit:'rep'});
});
test('incomplete per-set plan vectors cannot silently flatten to the scalar card load',async()=>{
 const {adapter,input}=await fixture();input.state.exercises[0].wSets=[40];
 assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});
 input.state.exercises[0].wSets=[40,NaN];assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});
});
test('an actual selected debut keeps its supplied vector and does not reuse old or ambiguous loads',async()=>{
 const {engine,adapter,input}=await fixture();input.state.exercises[0].wSets=[40,35];
 const q={id:'synthetic-debut',kind:'debut',state:'DEBUT',done:false,exId:'demo-press',newW:45,newWSets:[45,40],t:'Synthetic debut'};input.state.queue.push(q);
 assert.equal(engine.genSession(input.state,input.day).ex[0].w,45);
 assert.deepEqual(adapter.prepare(input).capture.slots.slice(0,2).map(s=>JSON.parse(s.load.source_json).value),[45,40]);
 delete q.newWSets;assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});
 q.newWSets=[45,40];input.state.queue.unshift({...q,id:'synthetic-proposed',state:'PROPOSED',newWSets:[45,30]});
 assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});
});
test('a rest day has no invented workout capture',async()=>{
 const {adapter,input}=await fixture();input.day=F.dayOffset(input.day,-1);
 assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_NO_WORKOUT'});
});

test('actual Start/correction/reopen resolves captured positions by reconstructing ORIGINAL engine inputs',async t=>{
 const {engine,adapter,input,prescriptionCapture,parseStrictJson}=await fixture(),load=p=>import(pathToFileURL(path.join(w6,p)));
 const [{fixture:store,initial,config,O,createT2Stage},{createDurablePublicClient},{projectWorkoutRecords}]=await Promise.all([
  load('rebuild/m3/w6/test/support.mjs'),load('rebuild/m3/w6/public-client.mjs'),load('rebuild/m4/workout/project-history.mjs')]);
 const Sign=require(path.join(w6,'rebuild/m3/w5/crypto.cjs')),Commands=require(path.join(w6,'rebuild/m4/workout/commands.cjs'));
 const {webcrypto}=require('node:crypto'),{createEngineHistoryProjector}=require('../engine-history.cjs');
 const key=Sign.generateSigningKey('synthetic-engine-capture'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},key),f=await store();t.after(()=>f.repo.close());
 const g=initial();g.metadata.authorityLease=lease;await f.repo.initialize(g,'synthetic-enrollment-only');
 // This test-owned immutable source map is explicit setup, NOT the missing
 // production import/controller or a trusted metadata/capture claim.
 const originals=new Map(),args={repository:f.repo,stage:createT2Stage(config,{allowInbound:true,workoutCommands:Commands.createWorkoutCommands({prescriptionCapture})}),
  namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===1,observationEpoch:()=>1,
  observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[Sign.publicKeyOf(key)],schemaVersion:2,crypto:webcrypto,prescriptionCapture,workoutProducerIdentity:producer,
  resolveWorkoutBasis:()=>({plan_basis:input.basis.plan_basis,input_basis:input.basis.input_basis,causal_parents:[]}),
  workoutProducer:(_generation,context)=>{const original={...structuredClone(input),basis:context.basis};originals.set(context.basis.source_revision,structuredClone(original));return adapter.prepare(original).capture;}};
 const c=createDurablePublicClient(args),p=await c.prepareWorkout({planned_split_slot_id:'synthetic-upper'});assert(p.prepared,p.code);
 const started=await c.startPreparedWorkout({preparedId:p.preparedId});assert(started.acknowledged,started.code);
 const slot=p.view.slots[0],set=await c.execute('workout',{action:'set',input:{session_start_op_id:started.op_id,logical_set_slot:slot.logical_set_slot,lift_lineage_id:slot.lift_lineage_id,load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}}});assert(set.acknowledged,set.code);
 const close=await c.execute('workout',{action:'close',input:{session_start_op_id:started.op_id,completion_kind:'early',causal_parents:[started.op_id,set.op_id]}});assert(close.acknowledged,close.code);
 const edit=await c.prepareWorkoutEdit({target_op_id:set.op_id});assert(edit.prepared,edit.code);const corrected=await c.commitWorkoutEdit({editId:edit.editId,action:'correct',change:{reps:{value:9,unit:'rep'}}});assert(corrected.acknowledged,corrected.code);
 input.state.exercises[0].w=60;input.state.exercises[0].sets=3; // Later plan cannot reconstruct the original capture.
 const fresh=await f.fresh();t.after(()=>fresh.repository.close());const read=await createDurablePublicClient({...args,repository:fresh.repository}).readWorkoutHistory();assert(read.read,read.code);
 const snapshot=await fresh.repository.load(),mapper=createEngineHistoryProjector({athleteId:'ath-1',deviceId:'dev-A',parseStrictJson,projectWorkoutRecords,
  resolveCapturedLayout:({start})=>adapter.resolveLayout({start,originalInput:originals.get(start.prescription_capture.basis.source_revision)})});
 const facts=mapper.project(read.history,snapshot.generation,{sourceRevision:snapshot.revision}),entry=facts.sessions[0].record.entries.find(e=>e.lift_lineage_id===slot.lift_lineage_id);
 assert.equal(engine.sessionScore(entry),360);assert.equal(entry.slots.length,2);assert.equal(entry.slots[1].state,'unlogged');assert.equal(entry.slots[0].fact.original.reps.value,8);
 assert.deepEqual(entry.slots[0].fact.edit_op_ids,[corrected.op_id]);assert.deepEqual(read.history.sessions[0].original,p.view);
});
