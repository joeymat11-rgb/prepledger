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
 assert.deepEqual(adapter.readLayout(out.capture),out.layout);
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
 assert.deepEqual(current.adapter.readLayout(start.prescription_capture),captured.layout,'Captured facts need neither original engine replay nor the current clock');
 const currentInput={...structuredClone(original.input),day:laterDay,basis:{...original.input.basis,source_revision:2}};
 const today=current.adapter.prepare(currentInput);assert.deepEqual(today.capture.slots.slice(0,2).map(s=>JSON.parse(s.effort.source_json).target),[2,0]);
 assert.deepEqual(original.input,originalBefore);assert.deepEqual(original.adapter.resolveLayout({start,originalInput:original.input}),captured.layout);
});
test('actual baseline prompt does not turn placeholder zero reps into a numeric target or invent a load',async()=>{
 const {adapter,input}=await fixture();input.state.exercises[0].w=null;input.state.exercises[0].last=null;const out=adapter.prepare(input);
 const slots=out.capture.slots.filter(s=>s.lift_lineage_id==='demo-press');assert(slots.every(s=>s.load.state==='not_prescribed'&&s.reps.state==='not_prescribed'));
 assert(slots.every(s=>s.load.source_json===null&&s.reps.source_json===null));assert.match(slots[0].reason.display,/DEBUT/);
});
test('an explicit zero prescribed load stays numeric and distinct from an absent baseline load',async()=>{
 const {adapter,input}=await fixture();input.state.exercises[0].w=0;input.state.exercises[0].wSets=[0,0];
 const slots=adapter.prepare(input).capture.slots.slice(0,2);
 assert(slots.every(s=>s.load.state==='specified'));assert.deepEqual(slots.map(s=>JSON.parse(s.load.source_json)),[{value:0,unit:'lb'},{value:0,unit:'lb'}]);
 input.state.exercises[0].wSets=[0,-0];assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});
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
 input.state.exercises[0].wSets=new Array(2);assert.throws(()=>adapter.prepare(input),{code:'ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED'});
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

test('actual Start/correction/reopen reads registered captured positions without a second original-state store',async t=>{
 const {engine,adapter,input,prescriptionCapture,parseStrictJson}=await fixture(),load=p=>import(pathToFileURL(path.join(w6,p)));
 input.state.sessionLog={}; // Explicit native-only fixture; no imported rows are discarded.
 const [{fixture:store,initial,config,O,createT2Stage},{createDurablePublicClient},{projectWorkoutRecords}]=await Promise.all([
  load('rebuild/m3/w6/test/support.mjs'),load('rebuild/m3/w6/public-client.mjs'),load('rebuild/m4/workout/project-history.mjs')]);
 const Sign=require(path.join(w6,'rebuild/m3/w5/crypto.cjs')),Commands=require(path.join(w6,'rebuild/m4/workout/commands.cjs'));
 const {webcrypto}=require('node:crypto'),{createEngineHistoryProjector}=require('../engine-history.cjs');
 const key=Sign.generateSigningKey('synthetic-engine-capture'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},key),f=await store();t.after(()=>f.repo.close());
 const g=initial();g.metadata.authorityLease=lease;await f.repo.initialize(g,'synthetic-enrollment-only');
 // Current engine inputs are synthetic. Historical layout comes only from the
 // exact captured operation through the real authenticated history reader.
 const args={repository:f.repo,stage:createT2Stage(config,{allowInbound:true,workoutCommands:Commands.createWorkoutCommands({prescriptionCapture})}),
  namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===1,observationEpoch:()=>1,
  observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[Sign.publicKeyOf(key)],schemaVersion:2,crypto:webcrypto,prescriptionCapture,workoutProducerIdentity:producer,
  resolveWorkoutBasis:()=>({plan_basis:input.basis.plan_basis,input_basis:input.basis.input_basis,causal_parents:[]}),
  workoutProducer:(_generation,context)=>adapter.prepare({...structuredClone(input),basis:context.basis}).capture};
 const c=createDurablePublicClient(args),p=await c.prepareWorkout({planned_split_slot_id:'synthetic-upper'});assert(p.prepared,p.code);
 const started=await c.startPreparedWorkout({preparedId:p.preparedId});assert(started.acknowledged,started.code);
 const slot=p.view.slots[0],set=await c.execute('workout',{action:'set',input:{session_start_op_id:started.op_id,logical_set_slot:slot.logical_set_slot,lift_lineage_id:slot.lift_lineage_id,load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}}});assert(set.acknowledged,set.code);
 const close=await c.execute('workout',{action:'close',input:{session_start_op_id:started.op_id,completion_kind:'early',causal_parents:[started.op_id,set.op_id]}});assert(close.acknowledged,close.code);
 const edit=await c.prepareWorkoutEdit({target_op_id:set.op_id});assert(edit.prepared,edit.code);const corrected=await c.commitWorkoutEdit({editId:edit.editId,action:'correct',change:{reps:{value:9,unit:'rep'}}});assert(corrected.acknowledged,corrected.code);
 input.state.exercises[0].w=60;input.state.exercises[0].sets=3; // Later plan cannot reconstruct the original capture.
 const fresh=await f.fresh();t.after(()=>fresh.repository.close());const read=await createDurablePublicClient({...args,repository:fresh.repository}).readWorkoutHistory();assert(read.read,read.code);
 const snapshot=await fresh.repository.load(),mapper=createEngineHistoryProjector({athleteId:'ath-1',deviceId:'dev-A',parseStrictJson,projectWorkoutRecords,
  resolveCapturedLayout:({start})=>adapter.readLayout(start.prescription_capture)});
 const facts=mapper.project(read.history,snapshot.generation,{sourceRevision:snapshot.revision}),entry=facts.sessions[0].record.entries.find(e=>e.lift_lineage_id===slot.lift_lineage_id);
 assert.equal(engine.sessionScore(entry),360);assert.equal(entry.slots.length,2);assert.equal(entry.slots[1].state,'unlogged');assert.equal(entry.slots[0].fact.original.reps.value,8);
 assert.deepEqual(entry.slots[0].fact.edit_op_ids,[corrected.op_id]);assert.deepEqual(read.history.sessions[0].original,p.view);
 let seenFacts;
 const next=createDurablePublicClient({...args,repository:fresh.repository,
  resolveWorkoutBasis:()=>({plan_basis:'synthetic-current-plan',input_basis:'synthetic-current-input',causal_parents:[close.op_id,corrected.op_id]}),
  projectWorkoutHistory:({history,generation,source_revision})=>mapper.project(history,generation,{sourceRevision:source_revision}),
  workoutProducer:(_generation,context)=>{
   seenFacts=structuredClone(context.workoutFacts);
   return adapter.prepare({...structuredClone(input),state:{...structuredClone(input.state),workoutFacts:context.workoutFacts},basis:context.basis}).capture;
  }});
 const current=await next.prepareWorkout({planned_split_slot_id:'synthetic-next-upper'});assert(current.prepared,current.code);
 assert.equal(seenFacts.sessions[0].record.entries[0].slots[0].fact.current.reps.value,9);
 assert.equal(current.view.slots.filter(s=>s.lift_lineage_id===slot.lift_lineage_id).length,3);
 assert.deepEqual(JSON.parse(current.view.slots[0].load.source_json),{value:60,unit:'lb'});
 const nextStart=await next.startPreparedWorkout({preparedId:current.preparedId});assert(nextStart.acknowledged,nextStart.code);
 const final=await f.fresh();t.after(()=>final.repository.close());const finalRead=await createDurablePublicClient({...args,repository:final.repository}).readWorkoutHistory();assert(finalRead.read,finalRead.code);
 assert.deepEqual(finalRead.history.sessions.find(s=>s.start.operation.op_id===started.op_id).original,p.view);
 assert.deepEqual(finalRead.history.sessions.find(s=>s.start.operation.op_id===nextStart.op_id).original,current.view);
});
test('actual corrected opener history changes next captured effort without rewriting previous captures',async t=>{
 const {adapter,input,prescriptionCapture,parseStrictJson}=await fixture(),load=p=>import(pathToFileURL(path.join(w6,p)));
 input.state.sessionLog={};
 const [{fixture:store,initial,config,O,createT2Stage},{createDurablePublicClient},{projectWorkoutRecords}]=await Promise.all([
  load('rebuild/m3/w6/test/support.mjs'),load('rebuild/m3/w6/public-client.mjs'),load('rebuild/m4/workout/project-history.mjs')]);
 const Sign=require(path.join(w6,'rebuild/m3/w5/crypto.cjs')),Commands=require(path.join(w6,'rebuild/m4/workout/commands.cjs'));
 const {webcrypto}=require('node:crypto'),{createEngineHistoryProjector}=require('../engine-history.cjs');
 const key=Sign.generateSigningKey('synthetic-opener-capture'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2},key),f=await store();t.after(()=>f.repo.close());
 const g=initial();g.metadata.authorityLease=lease;await f.repo.initialize(g,'synthetic-enrollment-only');
 const mapper=createEngineHistoryProjector({athleteId:'ath-1',deviceId:'dev-A',parseStrictJson,projectWorkoutRecords,
  resolveCapturedLayout:({start})=>adapter.readLayout(start.prescription_capture)});
 let parents=[];
 const args={repository:f.repo,stage:createT2Stage(config,{allowInbound:true,workoutCommands:Commands.createWorkoutCommands({prescriptionCapture})}),
  namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===1,observationEpoch:()=>1,
  observationGuard:{run:async(_kind,fn)=>fn()},validateCommit:()=>null,keys:[Sign.publicKeyOf(key)],schemaVersion:2,crypto:webcrypto,prescriptionCapture,workoutProducerIdentity:producer,
  resolveWorkoutBasis:()=>({plan_basis:input.basis.plan_basis,input_basis:input.basis.input_basis,causal_parents:parents}),
  projectWorkoutHistory:({history,generation,source_revision})=>mapper.project(history,generation,{sourceRevision:source_revision}),
  workoutProducer:(_g,context)=>adapter.prepare({...structuredClone(input),state:{...structuredClone(input.state),workoutFacts:context.workoutFacts},basis:context.basis}).capture};
 const client=createDurablePublicClient(args),sets=[],originals=[];
 for(let i=0;i<3;i++){
  const p=await client.prepareWorkout({planned_split_slot_id:'synthetic-upper'});assert(p.prepared,p.code);originals.push(p.view);
  const start=await client.startPreparedWorkout({preparedId:p.preparedId});assert(start.acknowledged,start.code);
  const slot=p.view.slots[0],set=await client.execute('workout',{action:'set',input:{session_start_op_id:start.op_id,logical_set_slot:slot.logical_set_slot,lift_lineage_id:slot.lift_lineage_id,
   load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'exact',value:0,unit:'rep'}}});assert(set.acknowledged,set.code);sets.push(set.op_id);
  const close=await client.execute('workout',{action:'close',input:{session_start_op_id:start.op_id,completion_kind:'early',causal_parents:[start.op_id,set.op_id]}});assert(close.acknowledged,close.code);parents=[close.op_id];
 }
 const effort=p=>JSON.parse(p.view.slots[0].effort.source_json).target;
 const hot=await client.prepareWorkout({planned_split_slot_id:'synthetic-upper'});assert(hot.prepared,hot.code);
 assert.equal(effort(hot),3,'ACTUAL_CORRECTED_OPENER_HISTORY_REACHES_CAPTURE');
 for(const id of sets.slice(0,2)){
  const edit=await client.prepareWorkoutEdit({target_op_id:id});assert(edit.prepared,edit.code);
  const correction=await client.commitWorkoutEdit({editId:edit.editId,action:'correct',change:{reserve:{tag:'at_least',value:3,unit:'rep'}}});assert(correction.acknowledged,correction.code);parents.push(correction.op_id);
 }
 const stale=await client.startPreparedWorkout({preparedId:hot.preparedId});assert.equal(stale.acknowledged,false,'Correction retires the previous current prescription');
 const fresh=await f.fresh();t.after(()=>fresh.repository.close());const reopened=createDurablePublicClient({...args,repository:fresh.repository});
 const current=await reopened.prepareWorkout({planned_split_slot_id:'synthetic-upper'});assert(current.prepared,current.code);assert.equal(effort(current),2);
 const start=await reopened.startPreparedWorkout({preparedId:current.preparedId});assert(start.acknowledged,start.code);
 const final=await f.fresh();t.after(()=>final.repository.close());const history=await createDurablePublicClient({...args,repository:final.repository}).readWorkoutHistory();assert(history.read,history.code);
 assert.deepEqual(history.history.sessions.slice(0,3).map(s=>s.original),originals);assert.deepEqual(history.history.sessions.at(-1).original,current.view);
});
test('registered capture interpretation rejects a foreign producer, tuple mismatch, repeated lift block and malformed effort',async()=>{
 const {adapter,input}=await fixture(),{capture}=adapter.prepare(input);
 for(const mutate of [c=>{c.producer.app_build='other-build';},c=>{c.slots[1].logical_set_slot='arbitrary-id';},
  c=>{c.slots=[c.slots[0],c.slots[2],c.slots[1],c.slots[3]];},c=>{c.slots[0].effort.source_json='{"target":2,"unit":"rep","extra":1}';}]){
  const changed=structuredClone(capture);mutate(changed);assert.throws(()=>adapter.readLayout(changed));
 }
 let invoked=0;const getter=structuredClone(capture);Object.defineProperty(getter,'basis',{enumerable:true,get(){invoked++;return capture.basis;}});
 assert.throws(()=>adapter.readLayout(getter),{code:'ENGINE_CAPTURE_PROFILE_INVALID'});assert.equal(invoked,0);
 const spelling=structuredClone(capture);spelling.slots[0].effort.source_json=' { "unit": "rep", "target": 2.00 } ';
 const before=JSON.stringify(spelling);assert.deepEqual(adapter.readLayout(spelling),adapter.readLayout(capture));assert.equal(JSON.stringify(spelling),before,'Original instruction spelling/order stays unchanged');
});
