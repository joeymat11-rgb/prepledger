import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createDurablePublicClient} from '../public-client.mjs';
import {parseStrictJson} from '../strict-json.mjs';
import {fixture,initial,config,O,Client,createT2Stage,faultDatabase,mutateActive,deferred} from './support.mjs';
import Capture from '../../../m4/workout/capture.cjs';
import Commands from '../../../m4/workout/commands.cjs';
import Schema from '../../../m4/workout/schema.cjs';
import Sign from '../../w5/crypto.cjs';
import Wire from '../../w5/public-client.cjs';
import Source from '../../w5/source/codec.cjs';
import {workoutContinuation} from '../../../m4/workout/continuation.mjs';
const capture=Capture.createPrescriptionCapture({parseStrictJson});
const identity={app_build:'synthetic-app',engine_build:'synthetic-engine',rule_profile:'synthetic-rule',source_schema:'synthetic-source'};
const unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
const cell=(display,source_json)=>({state:'specified',display,source_json});
function prescription(context){return {profile:capture.profile,producer:context.producer,basis:context.basis,
 session:{instruction:cell('Synthetic workout','"instruction"'),reason:unknown(),confidence:unknown()},
 slots:[40,45,40].map((n,i)=>({logical_set_slot:'slot-'+i,lift_lineage_id:'same-lineage',label:'Synthetic lift',
 load:cell(n+' lb',` {"value":${n}.00,"unit":"lb"} `),reps:cell('8–10','{"min":8,"max":10}'),
 effort:cell('At least 3','{"tag":"at_least","value":3,"unit":"rep"}'),setup:unknown(),reason:unknown(),confidence:unknown()}))};}
async function setup(options={}){
 const signingKey=Sign.generateSigningKey('synthetic-capture'),lease=Sign.signLease({...O.lease('dev-A'),schema_version:2,signature:undefined},signingKey);
 const f=await fixture(options.repository||{}),generation=initial();generation.metadata.authorityLease=lease;
 await f.repo.initialize(generation,'synthetic-enrollment-only');
 const selectedCapture=options.capture||capture;
 const commands=Commands.createWorkoutCommands({prescriptionCapture:selectedCapture});
 const stage=createT2Stage(()=>({...config(),...options.config}),{allowInbound:true,workoutCommands:commands});
 let produced=0,lastCapture;const scope={session:1,observation:1};
 const args={repository:options.wrapRepository?options.wrapRepository(f.repo):f.repo,stage:options.wrapStage?options.wrapStage(stage):stage,
 namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===scope.session,
 observationEpoch:()=>scope.observation,observationGuard:{run:async(_kind,fn)=>fn()}, // Synthetic, not K1/CLOCK qualification.
 validateCommit:options.validateCommit||(()=>null),keys:[Sign.publicKeyOf(signingKey)],schemaVersion:2,crypto:webcrypto,
 prescriptionCapture:selectedCapture,workoutProducerIdentity:identity,
 resolveWorkoutBasis:()=>({plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-input',causal_parents:[]}),
 workoutProducer:(_generation,context)=>{produced++;lastCapture=prescription(context);return lastCapture;},...options.client};
 const c=createDurablePublicClient(args);return {...f,c,args,scope,commands,signingKey,produced:()=>produced,lastCapture:()=>lastCapture};
}
const prepare=f=>f.c.prepareWorkout({planned_split_slot_id:'synthetic-slot'});
const start=(f,p,extra={})=>f.c.startPreparedWorkout({preparedId:p.preparedId,...extra});
const operations=async f=>(await f.repo.load()).generation.collections.ops||{};
const recreate=f=>createDurablePublicClient({...f.args,repository:f.repo});
const close=(f,id)=>f.c.execute('workout',{action:'close',input:{session_start_op_id:id,completion_kind:'early',causal_parents:[id]}});
const perform=(f,id,slot='slot-0')=>f.c.execute('workout',{action:'set',input:{session_start_op_id:id,logical_set_slot:slot,lift_lineage_id:'same-lineage',load:{value:42.5,unit:'lb'},reps:{value:8,unit:'rep'}}});
const editSet=(f,target,fields,parents)=>f.c.execute('workout',{action:'correct',input:{target_op_id:target,lift_lineage_id:'same-lineage',replacement_fields:fields,...(parents?{causal_parents:parents}:{})}});
const prepareEdit=(c,id)=>c.prepareWorkoutEdit({target_op_id:id});
const correctPrepared=(c,p,change)=>c.commitWorkoutEdit({editId:p.editId,action:'correct',change});
const syntheticFacts=({source_revision})=>({profile:'earned/workout-facts/v1',source_revision,sessions:[],incomplete_sessions:[],progression_eligible:false});

// Actual old T2 constructors; signed synthetic authority history is then saved
// through W6 and read after opening a fresh encrypted repository connection.
function legacyWriter(){
 const c=Client.createClient({...config(),deviceId:'dev-B',lease:O.lease('dev-B'),backend:Client.memoryBackend(initial().collections),transport:{}});
 c.boot();assert.equal(c.logSession({date:'2026-09-03',sets:[{lift:'old label',slot:'first',load:45,reps:8},{lift:'old label',slot:'second',load:-5,reps:1.5}]}).acknowledged,true);
 assert.equal(c.finishSession().acknowledged,true);return c;
}
async function readLegacy(f,ops){
 const receipts=ops.map((op,i)=>Sign.signReceipt({seq:i+1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},f.signingKey));
 const pull=Sign.signPull({athlete_id:'ath-1',device_id:'dev-A',after:0,through:receipts.length,receipts,wire_version:Wire.WIRE_VERSION,key_epoch:f.signingKey.kid},f.signingKey);
 const accepted=await f.c.acceptResponse('pull',{wireVersion:Wire.WIRE_VERSION,body:pull});assert.equal(accepted.accepted,true,JSON.stringify(accepted));
 const fresh=await f.fresh();try{const r=await createDurablePublicClient({...f.args,repository:fresh.repository}).readWorkoutHistory();assert.equal(r.read,true,JSON.stringify(r));return r.history;}finally{fresh.repository.close();}
}
function legacyEdit(ops,{id='legacy-extra',target=ops[1].op_id,parents=[target],kind='correction',fields={reps:{value:11,unit:'rep'}}}={}){
 return Client.ops.build({op_id:id,athlete_id:'ath-1',device_id:'dev-C',device_seq:1,predecessor:null,parents,class:'reading',kind,target,
  effective:ops[1].effective,lease_id:'synthetic-legacy-lease',payload:kind==='correction'?{replacement_fields:fields}:{reason:'Mistaken entry'}},O.K_IDENTITY);
}
test('legacy history: actual old writer observations and correction survive signed durable reopen without invented capture',async()=>{
 const f=await setup();try{const c=legacyWriter();assert.equal(c.correction('op-dev-B-2',{load:{value:40,unit:'lb'}}).acknowledged,true);
  const ops=[...c.model.ops.values()],original=structuredClone(ops),h=await readLegacy(f,ops),s=h.sessions[0],p=s.projection;
  assert.equal(p.facts[0].current?.load.value,40);assert.equal(p.facts[0].original.load.value,45);assert.equal(p.facts[1].current.load.value,-5);assert.equal(p.facts[1].current.reps.value,1.5);
  assert.deepEqual(p.facts[0].current.reserve,{tag:'unknown',reason:'NOT_RECORDED_BY_SCHEMA1_WRITER'});
  assert.equal(p.facts[0].association,'RECORDED_REFERENCE');assert.deepEqual(p.facts[0].legacy_context,{lift:'old label',slot:'first',session_start_id:'op-dev-B-1'});
  assert.equal(Object.hasOwn(p.facts[0],'lift_lineage_id'),false);assert.equal(Object.hasOwn(p.facts[0],'logical_set_slot'),false);
  assert.equal(p.facts[0].issues.includes('SET_SLOT_RESOLUTION_REQUIRED'),false);assert(p.facts[0].issues.includes('LEGACY_CONTEXT_UNQUALIFIED'));
  assert.equal(s.original,null);assert.equal(Object.hasOwn(p.start_record.current,'planned_split_slot_id'),false);assert.equal(p.start_record.current.recorded_slot,'AD_HOC');
  assert.equal(p.close_records[0].kind,null);assert.deepEqual(p.close_records[0].current.closed,{value:1,unit:'flag'});assert.equal(p.progression_eligible,false);
  assert.deepEqual(ops,original);assert.deepEqual(s.records.find(r=>r.operation.op_id===ops[4].op_id).operation,ops[4]);
  assert.notEqual((await f.c.prepareWorkoutContinuation({session_start_op_id:ops[0].op_id})).prepared,true);
 }finally{f.repo.close();}
});
test('legacy history: accepted concurrent corrections remain unresolved while unrelated sets stay readable',async()=>{
 const f=await setup();try{const c=legacyWriter();c.correction('op-dev-B-2',{load:{value:40,unit:'lb'}});c.correction('op-dev-B-2',{reps:{value:9,unit:'rep'}});
  const h=await readLegacy(f,[...c.model.ops.values()]),facts=h.sessions[0].projection.facts;
  assert.equal(facts[1].current?.load.value,-5);assert.equal(facts[0].current,null);assert.equal(facts[0].accepted.current,null);assert(facts[0].issues.includes('CONCURRENT_TARGET_EDITS'));
 }finally{f.repo.close();}
});
test('legacy history: causal correction chain and removal work but an edit after removal stays unresolved',async()=>{
 for(const phase of ['corrected','removed','after-removal']){const afterRemoval=phase==='after-removal',f=await setup();try{const c=legacyWriter();c.correction('op-dev-B-2',{load:{value:40,unit:'lb'}});const ops=[...c.model.ops.values()],target=ops[1].op_id;
  const next=legacyEdit(ops,{id:'causal-edit',parents:[target,ops[4].op_id]});ops.push(next);
  const removal=legacyEdit(ops,{id:'causal-removal',kind:'tombstone',parents:[target,next.op_id]});if(phase!=='corrected')ops.push(removal);
  if(afterRemoval)ops.push(legacyEdit(ops,{id:'after-removal',parents:[target,removal.op_id]}));
  const fact=(await readLegacy(f,ops)).sessions[0].projection.facts[0];
  assert.equal(fact.included,phase==='corrected'?true:afterRemoval?null:false);
  if(phase==='corrected'){assert.equal(fact.current.load.value,40);assert.equal(fact.current.reps.value,11);}else assert.equal(fact.current,null);
  assert.equal(fact.original.load.value,45);
  if(afterRemoval)assert(fact.issues.includes('EDIT_AFTER_REMOVAL_UNSUPPORTED'));
 }finally{f.repo.close();}}
});
test('legacy history: unrecognized effort and raw slot remain original context instead of new schema meaning',async()=>{
 const f=await setup();try{const ops=[...legacyWriter().model.ops.values()];ops[1].payload.reserve={tag:'exact',value:0,unit:'rep'};ops[1].payload.slot={arbitrary:'legacy value'};
  ops[1].canonical_content_commitment=Client.ops.commitmentOf(ops[1],O.K_IDENTITY);
  const fact=(await readLegacy(f,ops)).sessions[0].projection.facts[0];assert.equal(fact.current?.reserve.tag,'unknown');assert(fact.issues.includes('UNINTERPRETED_SET_FIELDS'));
  assert.deepEqual(fact.legacy_context.slot,{arbitrary:'legacy value'});assert.equal(fact.original.reserve.value,0);
 }finally{f.repo.close();}
});
test('legacy history: missing explicit target causality cannot be replaced by a signed accepted position',async()=>{
 const f=await setup();try{const ops=[...legacyWriter().model.ops.values()];ops.push(legacyEdit(ops,{parents:[]}));
  const fact=(await readLegacy(f,ops)).sessions[0].projection.facts[0];assert(fact.issues.includes('MISSING_EXPLICIT_TARGET_CAUSAL_EDGE'));assert.equal(fact.current,null);
 }finally{f.repo.close();}
});
test('legacy history: unsupported target effects remain attached and cannot silently leave a usable set',async()=>{
 const f=await setup();try{const ops=[...legacyWriter().model.ops.values()],target=ops[1].op_id;
  const effect=Client.ops.build({op_id:'legacy-reclassification',athlete_id:'ath-1',device_id:'dev-C',device_seq:1,predecessor:null,parents:[target],class:'reading',kind:'reclassification',target,
   effective:ops[1].effective,lease_id:'synthetic-legacy-lease',payload:{classification:'unspecified'}},O.K_IDENTITY);ops.push(effect);
  const s=(await readLegacy(f,ops)).sessions[0],fact=s.projection.facts[0];assert(fact.issues.includes('UNSUPPORTED_TARGET_EFFECT'));assert.equal(fact.current,null);assert(fact.edit_op_ids.includes(effect.op_id));
  assert.deepEqual(s.records.find(r=>r.operation.op_id===effect.op_id).operation,effect);assert.equal(s.projection.facts[1].current.load.value,-5);
 }finally{f.repo.close();}
});
test('legacy history: absent or malformed Start context preserves original observations and named mapping needs',async()=>{
 for(const payload of [null,{load:{value:45,unit:'lb'},reps:{value:8,unit:'rep'},session_start_id:'missing-start'}]){const f=await setup();try{
  const ops=[...legacyWriter().model.ops.values()];ops[1].payload=payload;ops[1].canonical_content_commitment=Client.ops.commitmentOf(ops[1],O.K_IDENTITY);
  const h=await readLegacy(f,ops),row=h.other_records.find(r=>r.operation.op_id===ops[1].op_id);assert(row);assert.deepEqual(row.operation,ops[1]);
  if(payload){assert.equal(row.interpretation.local.current.load.value,45);assert(row.interpretation.local.issues.includes('MISSING_OR_UNSUPPORTED_START_REFERENCE'));}
  else{assert.equal(row.interpretation.local.current,null);assert(row.interpretation.local.issues.includes('UNSUPPORTED_SESSION_PAYLOAD'));}
  assert.equal(h.sessions[0].projection.facts[0].current.load.value,-5);
 }finally{f.repo.close();}}
});

test('shared edit history: nested replacement and removal restoration survive actual durable reopen',async()=>{
 const f=await setup();try{
  const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),other=await perform(f,a.op_id,'slot-1');
  const one=await editSet(f,set.op_id,{load:{value:10,unit:'lb'}});
  const two=await editSet(f,set.op_id,{load:{value:20,unit:'lb'}},[one.op_id]);
  const revised=await editSet(f,one.op_id,{replacement_fields:{load:{value:30,unit:'lb'}}},[two.op_id]);
  assert.equal(revised.acknowledged,true,'actual command must save a correction of an earlier correction');
  const read=async()=>{const r=await recreate(f).readWorkoutHistory();assert.equal(r.read,true,r.code);return r.history.sessions[0].projection.facts.find(x=>x.source_op_id===set.op_id);};
  assert.equal((await read()).current.load.value,20,'revising an earlier correction preserves its logical position');
  const removed=await f.c.execute('workout',{action:'remove',input:{target_op_id:two.op_id,lift_lineage_id:'same-lineage',reason:'Mistaken edit',causal_parents:[revised.op_id]}});
  assert.equal(removed.acknowledged,true);assert.equal((await read()).current.load.value,30);
  const restored=await f.c.execute('workout',{action:'remove',input:{target_op_id:removed.op_id,lift_lineage_id:'same-lineage',reason:'Restore the edit',causal_parents:[removed.op_id]}});
  assert.equal(restored.acknowledged,true);assert.equal((await read()).current.load.value,20);
  const fresh=await f.fresh();try{const r=await createDurablePublicClient({...f.args,repository:fresh.repository}).readWorkoutHistory();assert.equal(r.read,true,r.code);
   const facts=r.history.sessions[0].projection.facts,first=facts.find(x=>x.source_op_id===set.op_id);
   assert.equal(first.original.load.value,42.5);assert.equal(first.current.load.value,20);
   assert.equal(facts.find(x=>x.source_op_id===other.op_id).current.load.value,42.5);
   assert(first.edit_op_ids.includes(revised.op_id));assert(first.edit_op_ids.includes(restored.op_id));
  }finally{fresh.repository.close();}
 }finally{f.repo.close();}
});

test('shared edit history: reserve clear is a durable correction and never a recorded observation',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id);
  const rated=await editSet(f,set.op_id,{reserve:{tag:'exact',value:0,unit:'rep'}});
  const cleared=await editSet(f,set.op_id,{reserve:{clear:true}},[rated.op_id]);
  assert.equal(cleared.acknowledged,true,'actual correction path must support optional clearing');
  const r=await recreate(f).readWorkoutHistory();assert.equal(r.read,true,r.code);
  assert.equal(Object.hasOwn(r.history.sessions[0].projection.facts[0].current,'reserve'),false);
  const before=await f.repo.load();
  const bad=await f.c.execute('workout',{action:'set',input:{session_start_op_id:a.op_id,logical_set_slot:'slot-1',lift_lineage_id:'same-lineage',load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{clear:true}}});
  assert.notEqual(bad.acknowledged,true);assert.deepEqual((await f.repo.load()).generation.collections.ops,before.generation.collections.ops);
 }finally{f.repo.close();}
});

test('shared edit history: corrected Start Skip and Close drive actual resume and next-Start refusal',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),original=structuredClone((await operations(f))[a.op_id]);
  const correction=await f.c.execute('workout',{action:'correct',input:{target_op_id:a.op_id,replacement_fields:{effective:{local_date:'2026-09-03',local_time:'11:00',utc_offset:'-04:00'},planned_split_slot_id:'corrected-slot'}}});
  assert.equal(correction.acknowledged,true,'Start correction does not require fictitious lift lineage');
  const skipped=await f.c.execute('workout',{action:'skip',input:{session_start_op_id:a.op_id,lift_lineage_id:'same-lineage',skip_scope:'lift',reason:'Time'}});assert.equal(skipped.acknowledged,true);
  const scoped=await editSet(f,skipped.op_id,{skip_scope:'set',logical_set_slot:'slot-1'});assert.equal(scoped.acknowledged,true);
  let r=await recreate(f).readWorkoutHistory();assert.equal(r.read,true,r.code);let s=r.history.sessions[0];
  assert.deepEqual(s.start.operation,original);assert.deepEqual(s.original,original.prescription_capture);
  assert.equal(s.projection.start_record.current.effective.local_date,'2026-09-03');
  let state=workoutContinuation(r.history,(await f.repo.load()).generation,a.op_id);
  assert.equal(state.planned_split_slot_id,'corrected-slot');assert.equal(state.slots[0].completion,null);assert.equal(state.slots[1].completion.kind,'skipped');assert.equal(state.slots[2].completion,null);
  const unskip=await f.c.execute('workout',{action:'remove',input:{target_op_id:skipped.op_id,lift_lineage_id:'same-lineage',reason:'Resume lift',causal_parents:[scoped.op_id]}});assert.equal(unskip.acknowledged,true);
  const finished=await close(f,a.op_id);assert.equal(finished.acknowledged,true);
  const finishEdit=await f.c.execute('workout',{action:'correct',input:{target_op_id:finished.op_id,replacement_fields:{completion_kind:'normal'}}});assert.equal(finishEdit.acknowledged,true);
  r=await recreate(f).readWorkoutHistory();s=r.history.sessions[0];assert.equal(s.projection.close_records[0].kind,'normal');assert.equal(s.records.find(x=>x.operation.op_id===finished.op_id).operation.payload.completion_kind,'early');
  const unfinish=await f.c.execute('workout',{action:'remove',input:{target_op_id:finished.op_id,reason:'Workout not finished',causal_parents:[finishEdit.op_id]}});assert.equal(unfinish.acknowledged,true);
  assert.notEqual((await prepare(f)).prepared,true,'removed Finish must not unlock another Start');
  r=await recreate(f).readWorkoutHistory();state=workoutContinuation(r.history,(await f.repo.load()).generation,a.op_id);assert(state.slots.every(slot=>slot.completion===null));
  const removeStart=await f.c.execute('workout',{action:'remove',input:{target_op_id:a.op_id,reason:'Mistaken workout',causal_parents:[correction.op_id]}});assert.equal(removeStart.acknowledged,true);
  r=await recreate(f).readWorkoutHistory();assert.equal(r.history.sessions[0].projection.start_record.included,false);assert(r.history.sessions[0].records.some(x=>x.operation.op_id===finished.op_id));
  const removedSnapshot=await f.repo.load();assert.throws(()=>workoutContinuation(r.history,removedSnapshot.generation,a.op_id),error=>error.code==='WORKOUT_RESUME_START_UNRESOLVED');
 }finally{f.repo.close();}
});

test('shared edit history: signed accepted ties resolve while a concurrent pending edit remains separate',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id);
  await editSet(f,set.op_id,{reps:{value:9,unit:'rep'}});await editSet(f,set.op_id,{reps:{value:10,unit:'rep'}});
  let r=await recreate(f).readWorkoutHistory();assert.equal(r.history.sessions[0].projection.facts[0].current,null);
  const ops=Object.values(await operations(f)),receipts=ops.map((op,i)=>Sign.signReceipt({seq:i+1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},f.signingKey));
  const pull=Sign.signPull({athlete_id:'ath-1',device_id:'dev-A',after:0,through:receipts.length,receipts,wire_version:Wire.WIRE_VERSION,key_epoch:f.signingKey.kid},f.signingKey);
  assert.equal((await f.c.acceptResponse('pull',{wireVersion:Wire.WIRE_VERSION,body:pull})).accepted,true);
  r=await recreate(f).readWorkoutHistory();let fact=r.history.sessions[0].projection.facts[0];assert.equal(fact.current.reps.value,10);assert.equal(fact.accepted.current.reps.value,10);
  const pending=await editSet(f,set.op_id,{reps:{value:11,unit:'rep'}});assert.equal(pending.acknowledged,true);
  r=await recreate(f).readWorkoutHistory();fact=r.history.sessions[0].projection.facts[0];assert.equal(fact.current,null);assert.equal(fact.accepted.current.reps.value,10);assert(fact.issues.includes('CONCURRENT_EDIT_INTERPRETATION_REQUIRED'));
  const before=await f.repo.load();assert.equal(Object.values(before.generation.collections.receipts).some(x=>x.op_id===pending.op_id),false);
 }finally{f.repo.close();}
});

test('configured history projection is private to authenticated preparation and isolated between callbacks',async()=>{
 let f,seen;f=await setup({client:{projectWorkoutHistory:input=>{assert.equal(input.history.sessions.length,0);input.generation.metadata.syntheticMutation=true;return syntheticFacts(input);},
  resolveWorkoutBasis:(_g,_input,context)=>{context.workoutFacts.sessions.push('basis mutation');return {plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-input',causal_parents:[]};},
  workoutProducer:(g,context)=>{seen=context.workoutFacts;assert.equal(g.metadata.syntheticMutation,undefined);return prescription(context);}}});
 try{const before=await f.repo.load(),p=await prepare(f);assert.equal(p.prepared,true,p.code);assert.deepEqual(seen.sessions,[]);
  assert.equal(seen.source_revision,before.revision);assert.equal(p.workoutFacts,undefined);assert.deepEqual(await f.repo.load(),before);
  const forged=await f.c.prepareWorkout({planned_split_slot_id:'synthetic-slot',workoutFacts:syntheticFacts({source_revision:1})});assert.notEqual(forged.prepared,true);
 }finally{f.repo.close();}
});

for(const bad of ['revision','throw'])test(`unavailable history ${bad} prevents basis and producer callbacks`,async()=>{
 let calls=0;const f=await setup({client:{projectWorkoutHistory:x=>{if(bad==='throw')throw Error('Synthetic unavailable original layout');return {...syntheticFacts(x),source_revision:x.source_revision+1};},
  resolveWorkoutBasis:()=>{calls++;throw Error('Must not reach');},workoutProducer:()=>{calls++;throw Error('Must not reach');}}});
 try{const before=await f.repo.load(),r=await prepare(f);assert.notEqual(r.prepared,true);assert.equal(r.preparedId,undefined);assert.equal(r.view,undefined);assert.equal(calls,0);assert.deepEqual(await f.repo.load(),before);}finally{f.repo.close();}
});

test('changed stored original cannot reach the configured history projector',async()=>{
 const f=await setup();try{const started=await start(f,await prepare(f)),set=await perform(f,started.op_id);assert.equal((await close(f,started.op_id)).acknowledged,true);
  const snapshot=await f.repo.load(),changed=structuredClone(snapshot.generation);changed.collections.ops[set.op_id].payload.reps.value=99;
  await f.repo.commit(snapshot,changed,()=>null);const before=await f.repo.load();let projected=0,produced=0;
  const c=createDurablePublicClient({...f.args,projectWorkoutHistory:x=>{projected++;return syntheticFacts(x);},workoutProducer:(_g,x)=>{produced++;return prescription(x);}});
  const r=await c.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert.notEqual(r.prepared,true);assert.equal(r.preparedId,undefined);assert.equal(r.view,undefined);
  assert.equal(projected,0);assert.equal(produced,0);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

for(const change of ['revision','token','observation','retirement'])test(`history-based preparation checks ${change} again before publishing instructions`,async()=>{
 const f=await setup();let c,reads=0;try{
  const repo={...f.repo,async load(){if(++reads===2){
   const s=await f.repo.load();
   if(change==='revision')await f.repo.commit(s,s.generation,()=>null);
   if(change==='token'){const iv=webcrypto.getRandomValues(new Uint8Array(12)),aad=new TextEncoder().encode(JSON.stringify(['earned/local-generation/v1',1,f.setup.namespace,s.revision]));
    const ciphertext=await webcrypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},f.key,new TextEncoder().encode(JSON.stringify(s.generation)));
    await mutateActive(f.indexedDB,record=>({...record,iv,ciphertext}));}
   if(change==='observation')f.scope.observation++;
   if(change==='retirement')c.retireWorkoutPreparations();
  }return f.repo.load();}};
  c=createDurablePublicClient({...f.args,repository:repo,projectWorkoutHistory:syntheticFacts});
  const r=await c.prepareWorkout({planned_split_slot_id:'synthetic-slot'});assert.notEqual(r.prepared,true);assert.equal(r.preparedId,undefined);assert.equal(r.view,undefined);
  assert.equal(r.code,change==='observation'?'OBSERVATION_CHANGED':change==='retirement'?'WORKOUT_PREPARATION_RETIRED':'WORKOUT_PREPARATION_STALE');
  assert.equal(Object.keys(await operations(f)).length,0);
 }finally{f.repo.close();}
});

test('finished partial workout preserves captured terminal identity and bounded opener through removal and fresh read',async()=>{
 // Actual stored client/projection evidence for the rich-reader join. This
 // supplies no progression eligibility or scientific recommendation.
 const f=await setup();try{
  const a=await start(f,await prepare(f));assert.equal(a.acknowledged,true);
  const set=async(slot,reserve)=>f.c.execute('workout',{action:'set',input:{session_start_op_id:a.op_id,
   logical_set_slot:slot,lift_lineage_id:'same-lineage',load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve}});
  const opener=await set('slot-0',{tag:'at_least',value:3,unit:'rep'}),middle=await set('slot-1',{tag:'exact',value:0,unit:'rep'});
  assert.equal(opener.acknowledged,true);assert.equal(middle.acknowledged,true);
  const skip=await f.c.execute('workout',{action:'skip',input:{session_start_op_id:a.op_id,logical_set_slot:'slot-2',
   lift_lineage_id:'same-lineage',skip_scope:'set',reason:'Time'}});assert.equal(skip.acknowledged,true);
  const finished=await close(f,a.op_id);assert.equal(finished.acknowledged,true);
  const originalOps=await operations(f),fresh=await f.fresh();try{
   const c=createDurablePublicClient({...f.args,repository:fresh.repository});
   const read=await c.readWorkoutHistory();assert.equal(read.read,true);
   const s=read.history.sessions.find(x=>x.start.operation.op_id===a.op_id);
   assert.deepEqual(s.original.slots.map(x=>x.logical_set_slot),['slot-0','slot-1','slot-2']);
   assert.deepEqual(s.projection.facts.map(x=>[x.source_op_id,x.logical_set_slot]),[[opener.op_id,'slot-0'],[middle.op_id,'slot-1']]);
   assert.deepEqual(s.projection.facts[0].current.reserve,{tag:'at_least',value:3,unit:'rep'});
   assert.deepEqual(s.projection.facts[1].current.reserve,{tag:'exact',value:0,unit:'rep'});
   assert.equal(s.projection.facts.some(x=>x.logical_set_slot==='slot-2'),false,'A skipped terminal has no performed measurement');
   assert.deepEqual(s.projection.skipped_record_ids,[skip.op_id]);
   assert.equal(s.records.find(x=>x.operation.op_id===skip.op_id).operation.logical_set_slot,'slot-2');
   assert.equal(s.projection.progression_eligible,false,'Factual history cannot grant training eligibility');
   const p=await prepareEdit(c,middle.op_id);assert.equal(p.prepared,true);
   const removed=await c.commitWorkoutEdit({editId:p.editId,action:'remove',change:'Mistaken middle entry'});assert.equal(removed.acknowledged,true);
   const reread=createDurablePublicClient({...f.args,repository:fresh.repository}),next=await reread.readWorkoutHistory();assert.equal(next.read,true);
   const after=next.history.sessions.find(x=>x.start.operation.op_id===a.op_id);
   assert.deepEqual(after.original,s.original);assert.deepEqual(after.projection.skipped_record_ids,[skip.op_id]);
   assert.deepEqual(after.projection.facts.filter(x=>x.included).map(x=>x.logical_set_slot),['slot-0']);
   assert.deepEqual(after.projection.facts.find(x=>x.source_op_id===middle.op_id).original,{load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'exact',value:0,unit:'rep'}});
   const now=(await fresh.repository.load()).generation.collections.ops;for(const [id,op]of Object.entries(originalOps))assert.deepEqual(now[id],op);
  }finally{fresh.repository.close();}
 }finally{f.repo.close();}
});

test('actual prepared correction/removal chain preserves the original, later sets and finished session on reopen',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),one=await perform(f,a.op_id),two=await perform(f,a.op_id,'slot-1');await close(f,a.op_id);
 const before=await operations(f),p=await prepareEdit(f.c,one.op_id);assert.equal(p.prepared,true,JSON.stringify(p));assert.equal(p.view.current.load.value,42.5);
 p.view.target_op_id=two.op_id;p.view.current.load.value=999;const c1=await correctPrepared(f.c,p,{load:{value:45,unit:'lb'},reserve:{tag:'at_least',value:3,unit:'rep'}});assert.equal(c1.acknowledged,true,JSON.stringify(c1));
 assert.equal((await correctPrepared(f.c,p,{reps:{value:10,unit:'rep'}})).code,'WORKOUT_EDIT_REQUIRED');
 const fresh=recreate(f),p2=await prepareEdit(fresh,one.op_id),c2=await correctPrepared(fresh,p2,{reps:{value:10,unit:'rep'}});assert.equal(c2.acknowledged,true);
 const ops=await operations(f);for(const [id,op]of Object.entries(before))assert.deepEqual(ops[id],op);assert.equal(ops[c1.op_id].target_op_id,one.op_id);assert.deepEqual(ops[c2.op_id].causal_parents,[one.op_id,c1.op_id]);
 let h=await fresh.readWorkoutHistory(),fact=h.history.sessions[0].projection.facts.find(x=>x.source_op_id===one.op_id);assert.deepEqual(fact.current,{load:{value:45,unit:'lb'},reps:{value:10,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}});assert.deepEqual(fact.original,before[one.op_id].payload);
 const p3=await prepareEdit(fresh,one.op_id),removed=await fresh.commitWorkoutEdit({editId:p3.editId,action:'remove',change:'Mistaken entry'});assert.equal(removed.acknowledged,true);
 h=await recreate(f).readWorkoutHistory();const s=h.history.sessions[0];assert.equal(s.projection.facts.find(x=>x.source_op_id===one.op_id).included,false);assert.deepEqual(s.projection.facts.find(x=>x.source_op_id===two.op_id).current,before[two.op_id].payload);assert.equal(s.projection.close_records.length,1);assert.equal((await prepareEdit(fresh,one.op_id)).code,'WORKOUT_EDIT_INTERPRETATION_REQUIRED');
 }finally{f.repo.close();}
});

for(const changed of ['revision','retired','session','observation'])test(`prepared correction refuses changed ${changed} without rewriting history`,async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),p=await prepareEdit(f.c,set.op_id);
 if(changed==='revision'){const s=await f.repo.load();s.generation.metadata.syntheticOtherWrite=true;await f.repo.commit(s,s.generation,()=>null);}
 if(changed==='retired')f.c.retireWorkoutPreparations();if(changed==='session')f.scope.session++;if(changed==='observation')f.scope.observation++;
 const before=await f.repo.load(),r=await correctPrepared(f.c,p,{reps:{value:11,unit:'rep'}});assert.equal(r.acknowledged,false,JSON.stringify(r));assert.deepEqual(await f.repo.load(),before);
 assert.equal(r.code,changed==='retired'?'WORKOUT_EDIT_REQUIRED':changed==='session'?'SESSION_CHANGED':changed==='observation'?'OBSERVATION_CHANGED':'WORKOUT_EDIT_STALE');
 }finally{f.repo.close();}
});

test('ambiguous, missing and incomplete known history cannot issue a prepared correction',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id);assert.equal((await prepareEdit(f.c,'missing')).code,'WORKOUT_EDIT_TARGET_UNAVAILABLE');
 await editSet(f,set.op_id,{reps:{value:9,unit:'rep'}});await editSet(f,set.op_id,{reps:{value:10,unit:'rep'}});assert.equal((await prepareEdit(f.c,set.op_id)).code,'WORKOUT_EDIT_INTERPRETATION_REQUIRED');
 const s=await f.repo.load();s.generation.collections.sync.frontier.authorityW=1;await f.repo.commit(s,s.generation,()=>null);assert.equal((await prepareEdit(f.c,set.op_id)).code,'WORKOUT_EDIT_PREFIX_INCOMPLETE');
 }finally{f.repo.close();}
});

test('prepared correction lost acknowledgement is one actual fact after fresh history reconciliation',async()=>{
 let lose=false;const f=await setup({wrapRepository:repo=>({...repo,async commit(...args){const r=await repo.commit(...args);if(lose){lose=false;throw Error('synthetic lost acknowledgement');}return r;}})});
 try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),p=await prepareEdit(f.c,set.op_id);lose=true;
 const r=await correctPrepared(f.c,p,{reps:{value:12,unit:'rep'}});assert.equal(r.acknowledged,false);assert.equal(r.outcomeUnknown,true);assert.equal((await correctPrepared(f.c,p,{reps:{value:12,unit:'rep'}})).code,'WORKOUT_EDIT_REQUIRED');
 const h=await recreate(f).readWorkoutHistory();assert.equal(h.history.sessions[0].projection.facts[0].current.reps.value,12);assert.equal(Object.values(await operations(f)).filter(o=>o.kind==='correction').length,1);
 }finally{f.repo.close();}
});

test('authenticated rejected target refuses correction with state19 in-process and after relaunch',async()=>{
 const f=await setup();try{
  const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),op=(await operations(f))[set.op_id];
  const disposition=Sign.signDisposition({op_id:op.op_id,device_id:op.device_id,device_seq:op.device_seq,
   canonical_content_commitment:op.canonical_content_commitment,status:'REJECTED',athlete_log_seq:null,rejection_code:'LEASE_EXPIRED',decided_at:'2026-09-04T00:00:00Z'},f.signingKey);
  const stored=await f.c.acceptResponse('disposition',{wireVersion:Wire.WIRE_VERSION,body:{disposition}});assert.equal(stored.accepted,true);assert.equal(stored.result.durable,true);
  const before=await f.repo.load();assert.deepEqual(before.generation.collections.ops[op.op_id],op);
  for(const c of [f.c,recreate(f)]){
   const p=await prepareEdit(c,op.op_id);assert.notEqual(p.prepared,true);assert.equal(p.state,19);assert.equal(p.code,'WORKOUT_EDIT_TARGET_REJECTED');assert.equal(p.editId,undefined);
   assert.deepEqual(await f.repo.load(),before,'Rejection read cannot rewrite the original, outbox, sequences or stored disposition');
  }
 }finally{f.repo.close();}
});

test('prepared correction refuses a substituted payload at the final transaction cut',async()=>{
 const f=await setup({wrapStage:stage=>(...args)=>{const r=stage(...args);if(args[1]==='workout'&&args[2]?.action==='correct'&&r.result?.acknowledged)for(const op of r.commit.batch.operations){op.payload.replacement_fields.reps.value=999;r.generation.collections.ops[op.op_id].payload.replacement_fields.reps.value=999;}return r;}});
 try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),p=await prepareEdit(f.c,set.op_id),before=await f.repo.load(),r=await correctPrepared(f.c,p,{reps:{value:9,unit:'rep'}});
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_EDIT_COMMAND_MISMATCH');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

for(const field of ['target_op_id','causal_parents','lift_lineage_id'])test(`prepared correction refuses substituted ${field} at the final transaction cut`,async()=>{
 let substitute=null,hits=0;
 const f=await setup({wrapStage:stage=>(...args)=>{
  const r=stage(...args);
  if(substitute&&args[1]==='workout'&&args[2]?.action==='correct'&&r.result?.acknowledged){
   for(const op of r.commit.batch.operations){op[field]=structuredClone(substitute);r.generation.collections.ops[op.op_id][field]=structuredClone(substitute);hits++;}
  }
  return r;
 }});
 try{
  const a=await start(f,await prepare(f)),one=await perform(f,a.op_id),two=await perform(f,a.op_id,'slot-1');
  const previous=await correctPrepared(f.c,await prepareEdit(f.c,one.op_id),{reps:{value:9,unit:'rep'}});assert.equal(previous.acknowledged,true);
  const p=await prepareEdit(f.c,one.op_id);assert.equal(p.prepared,true);const before=await f.repo.load();
  substitute=field==='target_op_id'?two.op_id:field==='causal_parents'?[one.op_id]:'synthetic-other-lineage';
  const refused=await correctPrepared(f.c,p,{reps:{value:10,unit:'rep'}});
  assert.equal(hits,1,'The substitution must reach the actual staged operation');
  assert.equal(refused.acknowledged,false);assert.equal(refused.code,'WORKOUT_EDIT_COMMAND_MISMATCH');assert.deepEqual(await f.repo.load(),before);
  // A consumed handle cannot retry; a fresh preparation still commits exactly
  // the intended identity and full observed edit ancestry after the fault ends.
  substitute=null;assert.equal((await correctPrepared(f.c,p,{reps:{value:10,unit:'rep'}})).code,'WORKOUT_EDIT_REQUIRED');
  const yes=await correctPrepared(f.c,await prepareEdit(f.c,one.op_id),{reps:{value:10,unit:'rep'}});assert.equal(yes.acknowledged,true);
  const ops=await operations(f);assert.equal(ops[yes.op_id].target_op_id,one.op_id);assert.equal(ops[yes.op_id].lift_lineage_id,'same-lineage');
  assert.deepEqual(ops[yes.op_id].causal_parents,[one.op_id,previous.op_id]);
  for(const [id,op]of Object.entries(before.generation.collections.ops))assert.deepEqual(ops[id],op);
 }finally{f.repo.close();}
});

test('prepared correction rejects nested getters and caller-supplied target fields',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),p=await prepareEdit(f.c,set.op_id);let called=0;
 const change={};Object.defineProperty(change,'reps',{enumerable:true,get(){called++;return {value:10,unit:'rep'};}});const before=await f.repo.load();assert.equal((await correctPrepared(f.c,p,change)).acknowledged,false);assert.equal(called,0);
 assert.equal((await f.c.commitWorkoutEdit({editId:p.editId,action:'correct',change:{reps:{value:10,unit:'rep'}},target_op_id:'foreign'})).acknowledged,false);assert.deepEqual(await f.repo.load(),before);
 const malformed={};Object.defineProperty(malformed,'nested',{enumerable:true,get(){called++;return 'target';}});assert.notEqual((await prepareEdit(f.c,malformed)).prepared,true);assert.equal(called,0);
 }finally{f.repo.close();}
});

test('a mistaken duplicate can be removed by its exact identity without deleting the other attempt',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),one=await perform(f,a.op_id),two=await perform(f,a.op_id);await close(f,a.op_id);
 let h=await f.c.readWorkoutHistory();assert(h.history.sessions[0].projection.facts.every(x=>x.issues.includes('SET_SLOT_RESOLUTION_REQUIRED')));
 const p=await prepareEdit(f.c,one.op_id);assert.equal(p.prepared,true,JSON.stringify(p));const r=await f.c.commitWorkoutEdit({editId:p.editId,action:'remove',change:'Duplicate entry'});assert.equal(r.acknowledged,true);
 h=await recreate(f).readWorkoutHistory();const facts=h.history.sessions[0].projection.facts;assert.equal(facts.find(x=>x.source_op_id===one.op_id).included,false);assert.equal(facts.find(x=>x.source_op_id===two.op_id).included,true);assert.deepEqual(facts.find(x=>x.source_op_id===two.op_id).issues,[]);assert.equal(h.history.sessions[0].projection.progression_eligible,false);
 }finally{f.repo.close();}
});

test('late retirement during correction validation prevents the durable effect',async()=>{
 let armed=false,f;f=await setup({validateCommit:()=>{if(armed)f.c.retireWorkoutPreparations();return null;}});try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),p=await prepareEdit(f.c,set.op_id),before=await f.repo.load();armed=true;
 const r=await correctPrepared(f.c,p,{reps:{value:10,unit:'rep'}});assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_EDIT_STALE');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

test('correction history guard refusal is typed, not a successful preparation or escaped exception',async()=>{
 let blocked=false;const f=await setup({client:{observationGuard:{run:async(_kind,fn)=>{if(blocked){const e=new Error('synthetic lost guard');e.state=18;throw e;}return fn();}}}});try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),before=await f.repo.load();blocked=true;
 const p=await prepareEdit(f.c,set.op_id);assert.notEqual(p.prepared,true);assert.equal(p.state,18);assert.equal(p.code,'WORKOUT_EDIT_GUARD_UNAVAILABLE');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

// Explicit synthetic safety producer: exercises custody/binding, not a personal
// recommendation or the production issuer's scientific qualification.
const resumePolicy=(_generation,context)=>({allowed_actions:['set','skip','close'],reason:'Synthetic current assessment',current_capture:prescription(context)});
const resume=(c,id)=>c.prepareWorkoutContinuation({session_start_op_id:id});
const resumedSet=(c,p,id,slot='slot-1')=>c.executeResumedWorkout({resumeId:p.resumeId,action:'set',input:{session_start_op_id:id,logical_set_slot:slot,lift_lineage_id:'same-lineage',load:{value:47.5,unit:'lb'},reps:{value:9,unit:'rep'}}});

test('continuation reopens the actual stored workout and finishes once with original capture and exact performed facts',async()=>{
 const f=await setup({client:{workoutResumePolicy:(_g,c)=>{const r=resumePolicy(_g,c);r.current_capture.slots[1].load=cell('35 lb','{"value":35,"unit":"lb"}');return r;}}});
 try{const a=await start(f,await prepare(f));assert.equal((await perform(f,a.op_id)).acknowledged,true);const original=(await operations(f))[a.op_id];
 const fresh=await f.fresh();try{const c=createDurablePublicClient({...f.args,repository:fresh.repository});let p=await resume(c,a.op_id);
 assert.equal(p.prepared,true,JSON.stringify(p));assert.equal(p.view.slots[0].completion.values.load.value,42.5);assert.equal(p.view.slots[1].completion,null);
 assert.deepEqual(p.view.original,original.prescription_capture);assert.equal(p.view.current.slots[1].load.display,'35 lb');assert.equal(p.view.original.slots[1].load.display,'45 lb');
 assert.equal((await resumedSet(c,p,a.op_id)).acknowledged,true);assert.equal((await resumedSet(c,p,a.op_id)).code,'WORKOUT_RESUME_REQUIRED');
 p=await resume(c,a.op_id);const skip=await c.executeResumedWorkout({resumeId:p.resumeId,action:'skip',input:{session_start_op_id:a.op_id,logical_set_slot:'slot-2',lift_lineage_id:'same-lineage',skip_scope:'set',reason:'Time'}});assert.equal(skip.acknowledged,true,JSON.stringify(skip));
 p=await resume(c,a.op_id);assert(p.view.slots.every(s=>s.completion));const finish=await c.executeResumedWorkout({resumeId:p.resumeId,action:'close',input:{session_start_op_id:a.op_id,completion_kind:'normal'}});assert.equal(finish.acknowledged,true,JSON.stringify(finish));
 assert.equal((await resume(c,a.op_id)).code,'WORKOUT_ALREADY_CLOSED');const history=await c.readWorkoutHistory();assert.equal(history.read,true);const s=history.history.sessions[0];
 assert.deepEqual(s.original,original.prescription_capture);assert.equal(s.projection.close_records.length,1);assert.equal(s.projection.close_records[0].kind,'normal');
 assert.deepEqual(s.projection.facts.map(x=>x.current.load.value),[42.5,47.5]);assert.equal(s.projection.skipped_record_ids.length,1);assert.equal(Object.values(await operations(f)).filter(o=>o.kind==='session-start').length,1);
 }finally{fresh.repository.close();}
 }finally{f.repo.close();}
});

test('original capture is never current safety permission and normal Finish cannot hide remaining work',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f));assert.equal((await resume(f.c,a.op_id)).code,'WORKOUT_RESUME_POLICY_UNAVAILABLE');
 const c=createDurablePublicClient({...f.args,workoutResumePolicy:(_g,ctx)=>({...resumePolicy(_g,ctx),allowed_actions:['skip','close']})});let p=await resume(c,a.op_id);const before=await f.repo.load();
 assert.equal((await resumedSet(c,p,a.op_id)).code,'WORKOUT_CURRENT_SAFETY_REFUSES');p=await resume(c,a.op_id);
 assert.equal((await c.executeResumedWorkout({resumeId:p.resumeId,action:'close',input:{session_start_op_id:a.op_id,completion_kind:'normal'}})).code,'WORKOUT_RESUME_INCOMPLETE');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

for(const change of ['revision','retired','standing','observation'])test(`prepared continuation refuses ${change} change before a durable command`,async()=>{
 const f=await setup({client:{workoutResumePolicy:resumePolicy}});try{const a=await start(f,await prepare(f)),p=await resume(f.c,a.op_id);assert.equal(p.prepared,true,JSON.stringify(p));
 if(change==='revision'){const s=await f.repo.load();s.generation.metadata.syntheticChange=true;await f.repo.commit(s,s.generation,()=>null);}
 if(change==='retired')f.c.retireWorkoutPreparations();if(change==='standing')f.scope.session++;if(change==='observation')f.scope.observation++;
 const before=await f.repo.load(),r=await resumedSet(f.c,p,a.op_id);assert.equal(r.acknowledged,false,JSON.stringify(r));assert.deepEqual(await f.repo.load(),before);
 assert.equal(r.code,change==='revision'?'WORKOUT_RESUME_STALE':change==='retired'?'WORKOUT_RESUME_REQUIRED':change==='standing'?'SESSION_CHANGED':'OBSERVATION_CHANGED');
 }finally{f.repo.close();}
});

for(const malformed of ['actions','reason','slot'])test(`continuation rejects malformed current safety ${malformed} without modifying stored original`,async()=>{
 const f=await setup({client:{workoutResumePolicy:(_g,c)=>{const r=resumePolicy(_g,c);if(malformed==='actions')r.allowed_actions=['set','set'];if(malformed==='reason')r.reason='';if(malformed==='slot')r.current_capture.slots[0].logical_set_slot='substituted-slot';return r;}}});
 try{const a=await start(f,await prepare(f)),before=await f.repo.load(),p=await resume(f.c,a.op_id);assert.notEqual(p.prepared,true);assert.equal(p.code,malformed==='slot'?'WORKOUT_RESUME_SLOT_MAPPING_REQUIRED':'WORKOUT_RESUME_POLICY_INVALID');assert.deepEqual(await f.repo.load(),before);}finally{f.repo.close();}
});

test('continuation refuses colliding facts, but actual targeted removal restores an unambiguous slot',async()=>{
 const f=await setup({client:{workoutResumePolicy:resumePolicy}});try{const a=await start(f,await prepare(f)),one=await perform(f,a.op_id);await perform(f,a.op_id);
 assert.equal((await resume(f.c,a.op_id)).code,'WORKOUT_SET_INTERPRETATION_REQUIRED');assert.equal((await f.c.execute('workout',{action:'remove',input:{target_op_id:one.op_id,lift_lineage_id:'same-lineage',reason:'Duplicate entry'}})).acknowledged,true);
 const p=await resume(f.c,a.op_id);assert.equal(p.prepared,true,JSON.stringify(p));assert.equal(p.view.slots[0].completion.kind,'performed');
 assert.equal((await resumedSet(f.c,p,a.op_id,'slot-0')).code,'WORKOUT_RESUME_SLOT_UNAVAILABLE');
 }finally{f.repo.close();}
});

for(const [earlier,later,date,ambiguous] of [['12:00','13:00','2026-09-04',true],['23:00','01:00','2026-09-05',true],['22:59','01:00','2026-09-05',false],['23:00','01:01','2026-09-05',false]])test(`continuation uses actual session candidate rule: ${earlier}/${later}/${date}`,async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),h=(await f.c.readWorkoutHistory()).history,g=(await f.repo.load()).generation;
 // Pure interpretation boundary only: authenticate the real first Start above,
 // then introduce the second projected Start synthetically. No signature claim.
 h.sessions[0].projection.start_record.current.effective.local_time=earlier;const other=structuredClone(h.sessions[0]);other.start.operation.op_id='synthetic-second-start';other.start.operation.device_id='dev-B';other.projection.start_record.current.effective.local_date=date;other.projection.start_record.current.effective.local_time=later;h.sessions.push(other);
 if(ambiguous)assert.throws(()=>workoutContinuation(h,g,a.op_id),e=>e.code==='WORKOUT_SESSION_PARTITION_REQUIRED'&&e.state===14);
 else assert.deepEqual(workoutContinuation(h,g,a.op_id).component_members,[a.op_id]);
 }finally{f.repo.close();}
});

test('continuation cannot treat partial authority prefix or unresolved edits as permission',async()=>{
 const f=await setup({client:{workoutResumePolicy:resumePolicy}});try{const a=await start(f,await prepare(f)),h=(await f.c.readWorkoutHistory()).history,g=(await f.repo.load()).generation;
 g.collections.sync.frontier.authorityW=1;assert.throws(()=>workoutContinuation(h,g,a.op_id),e=>e.code==='WORKOUT_RESUME_PREFIX_INCOMPLETE'&&e.state===18);
 const set=await perform(f,a.op_id);await editSet(f,set.op_id,{reps:{value:9,unit:'rep'}});await editSet(f,set.op_id,{reps:{value:10,unit:'rep'}});
 assert.equal((await resume(f.c,a.op_id)).code,'WORKOUT_SET_INTERPRETATION_REQUIRED');
 }finally{f.repo.close();}
});

test('resumed write lost acknowledgement is reconciled by actual fresh history, not a second set',async()=>{
 let lose=false;const f=await setup({client:{workoutResumePolicy:resumePolicy},wrapRepository:repo=>({...repo,async commit(...args){const r=await repo.commit(...args);if(lose){lose=false;throw Error('synthetic lost response');}return r;}})});
 try{const a=await start(f,await prepare(f)),p=await resume(f.c,a.op_id);lose=true;
 const lost=await resumedSet(f.c,p,a.op_id);assert.equal(lost.acknowledged,false);assert.equal((await resumedSet(f.c,p,a.op_id)).code,'WORKOUT_RESUME_REQUIRED');
 const c=recreate(f),next=await resume(c,a.op_id);assert.equal(next.prepared,true,JSON.stringify(next));assert.equal(next.view.slots[1].completion.values.load.value,47.5);
 assert.equal((await resumedSet(c,next,a.op_id)).code,'WORKOUT_RESUME_SLOT_UNAVAILABLE');assert.equal(Object.values(await operations(f)).filter(o=>o.kind==='session-set').length,1);
 }finally{f.repo.close();}
});

test('late downstream validator retirement refuses a resumed write at the actual commit cut',async()=>{
 let armed=false,f;f=await setup({client:{workoutResumePolicy:resumePolicy},validateCommit:()=>{if(armed)f.c.retireWorkoutPreparations();return null;}});
 try{const a=await start(f,await prepare(f)),p=await resume(f.c,a.op_id),before=await f.repo.load();armed=true;const result=await resumedSet(f.c,p,a.op_id);
 assert.equal(result.acknowledged,false);assert.equal(result.code,'WORKOUT_RESUME_STALE');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

test('resumed final command guard rejects a substituted performed value in an otherwise matching batch',async()=>{
 const f=await setup({client:{workoutResumePolicy:resumePolicy},wrapStage:stage=>(...args)=>{const c=stage(...args);if(args[1]==='workout'&&args[2]?.action==='set'&&c.result?.acknowledged){
   for(const op of c.commit.batch.operations){op.payload.load.value=999;c.generation.collections.ops[op.op_id].payload.load.value=999;}
 }return c;}});
 try{const a=await start(f,await prepare(f)),p=await resume(f.c,a.op_id),before=await f.repo.load(),r=await resumedSet(f.c,p,a.op_id);
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_RESUME_COMMAND_MISMATCH');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

test('resumed command rejects nested accessors before executing any caller getter',async()=>{
 const f=await setup({client:{workoutResumePolicy:resumePolicy}});try{const a=await start(f,await prepare(f)),p=await resume(f.c,a.op_id);let called=0;
 const load={unit:'lb'};Object.defineProperty(load,'value',{enumerable:true,get(){called++;return 47.5;}});
 const before=await f.repo.load(),r=await f.c.executeResumedWorkout({resumeId:p.resumeId,action:'set',input:{session_start_op_id:a.op_id,logical_set_slot:'slot-1',lift_lineage_id:'same-lineage',load,reps:{value:8,unit:'rep'}}});
 assert.equal(called,0);assert.equal(r.acknowledged,false);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

async function acceptedCurrentHead(f,op){
 assert.equal(typeof Sign.signCurrentHead,'function','CURRENT_HEAD_DEPENDENCY_MISSING: use run-current-head.cjs --workout-history');
 const receipt=Sign.signReceipt({seq:1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},f.signingKey);
 let signed;
 const outcome=await f.c.exchangeCurrentHead(request=>({wireVersion:Wire.WIRE_VERSION,body:signed=Sign.signCurrentHead({...request,
   athlete_id:'ath-1',head:1,through:1,receipts:[receipt],wire_version:Wire.WIRE_VERSION,key_epoch:f.signingKey.kid},f.signingKey)}),{issuanceAttempt:'synthetic-history-read'});
 assert.equal(outcome.accepted,true,JSON.stringify(outcome));assert.equal(outcome.result.confirmed,true);
 assert.deepEqual((await f.repo.load()).generation.metadata.wireProofs.currentHead[signed.authority_signature],signed);
 return signed;
}

test('actual currentHead exchange persists original workout proof for a fresh history read with a different current key',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),op=(await operations(f))[a.op_id];await acceptedCurrentHead(f,op);
 const before=await f.repo.load(),stage=createT2Stage(()=>({...config(),identityKey:'different-synthetic-current-identity'}),{allowInbound:true,workoutCommands:f.commands});
 const fresh=await f.fresh();try{
   const r=await createDurablePublicClient({...f.args,repository:fresh.repository,stage}).readWorkoutHistory();
   assert.equal(r.read,true,JSON.stringify(r));assert.equal(r.history.frontier,1);assert.equal(r.history.sessions[0].start.status,'accepted-through-frontier');
   assert.deepEqual(r.history.sessions[0].original,op.prescription_capture);assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{fresh.repository.close();}
 }finally{f.repo.close();}
});

for(const alteration of ['rewritten','missing'])test(`currentHead identity exemption cannot conceal a ${alteration} record behind a lowered local frontier`,async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),op=(await operations(f))[a.op_id];await acceptedCurrentHead(f,op);
 const snapshot=await f.repo.load(),c=snapshot.generation.collections;
 // The attacker owns only the synthetic storage key. A lower local prefix
 // takes this proof outside the assembly's prefix comparison, so the actual
 // currentHead limb must still authenticate its retained record before exemption.
 c.receipts={};c.sync.frontier={W:0,authorityW:1};
 if(alteration==='rewritten')c.ops[a.op_id].prescription_capture.basis.input_basis='resealed-different-basis';
 else{delete c.ops[a.op_id];delete c.outbox[a.op_id];c.meta.checkpoint.counts={ops:0,outbox:0};}
 await f.repo.commit(snapshot,snapshot.generation,()=>null);const before=await f.repo.load();
 const r=await recreate(f).readWorkoutHistory();assert.equal(r.read,false);assert.equal(r.state,18);assert.equal(r.code,'HISTORICAL_PROOF_UNPROVEN');assert.equal(r.history,undefined);
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});

for(const changed of ['producer','basis','performed','correction'])test(`resealed local ${changed} substitution cannot become original or corrected history`,async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),edit=await editSet(f,set.op_id,{reps:{value:9,unit:'rep'}});
 const s=await f.repo.load(),ops=s.generation.collections.ops;
 if(changed==='producer')ops[a.op_id].prescription_capture.producer.app_build='different-synthetic-build';
 if(changed==='basis')ops[a.op_id].prescription_capture.basis.input_basis='different-synthetic-basis';
 if(changed==='performed')ops[set.op_id].payload.reps.value=12;
 if(changed==='correction')ops[edit.op_id].payload.replacement_fields.reps.value=12;
 // A storage-key holder can reseal a generation, but has not reproduced the
 // identity commitment made by the actual committer. Neither key is exported.
 await f.repo.commit(s,s.generation,()=>null);const before=await f.repo.load();
 const r=await recreate(f).readWorkoutHistory();assert.equal(r.read,false);assert.equal(r.state,18);assert.equal(r.code,'LOCAL_HISTORY_IDENTITY_UNPROVEN');assert.equal(r.history,undefined);
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});

for(const identityKey of [undefined,'different-synthetic-identity'])test(`unavailable matching local identity key refuses history (${identityKey===undefined?'missing':'changed'})`,async()=>{
 const f=await setup();try{await start(f,await prepare(f));const before=await f.repo.load();
 const stage=createT2Stage(()=>({...config(),identityKey}),{allowInbound:true,workoutCommands:f.commands});
 const r=await createDurablePublicClient({...f.args,stage}).readWorkoutHistory();assert.equal(r.read,false);assert.equal(r.state,18);assert.equal(r.code,'LOCAL_HISTORY_IDENTITY_UNPROVEN');assert.equal(r.history,undefined);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});

test('exact server-signed history remains readable without the original local identity key',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),op=(await operations(f))[a.op_id];
 const receipt=Sign.signReceipt({seq:1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},f.signingKey);
 const pull=Sign.signPull({athlete_id:'ath-1',device_id:'dev-A',after:0,through:1,receipts:[receipt],wire_version:Wire.WIRE_VERSION,key_epoch:f.signingKey.kid},f.signingKey);
 assert.equal((await f.c.acceptResponse('pull',{wireVersion:Wire.WIRE_VERSION,body:pull})).accepted,true);const before=await f.repo.load();
 const stage=createT2Stage(()=>({...config(),identityKey:'different-synthetic-current-identity'}),{allowInbound:true,workoutCommands:f.commands});
 const r=await createDurablePublicClient({...f.args,stage}).readWorkoutHistory();assert.equal(r.read,true,JSON.stringify(r));assert.equal(r.history.sessions[0].start.status,'accepted-through-frontier');assert.deepEqual(r.history.sessions[0].original,op.prescription_capture);assert.deepEqual(await f.repo.load(),before);
 const keyless=createT2Stage(()=>({...config(),identityKey:undefined}),{allowInbound:true,workoutCommands:f.commands});
 const missing=await createDurablePublicClient({...f.args,stage:keyless}).readWorkoutHistory();assert.equal(missing.read,false);assert.equal(missing.state,18);assert.equal(missing.history,undefined);
 }finally{f.repo.close();}
});
test('actual reference-only first correction projects without fabricating a causal edge or rewriting its original',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),edit=await editSet(f,set.op_id,{reps:{value:9,unit:'rep'}});assert.equal(edit.acknowledged,true);
 const before=await f.repo.load();assert.deepEqual(before.generation.collections.ops[edit.op_id].causal_parents,[]);
 const r=await recreate(f).readWorkoutHistory();assert.equal(r.read,true);const p=r.history.sessions[0].projection,fact=p.facts[0];
 assert.equal(fact.original.reps.value,8);assert.equal(fact.current.reps.value,9);assert.equal(fact.current.load.value,42.5);assert.equal(Object.hasOwn(fact.current,'reserve'),false);
 assert.deepEqual(fact.edit_op_ids,[edit.op_id]);assert.equal(fact.included,true);assert.equal(p.progression_eligible,false);assert.equal(p.continuation_allowed,false);
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('actual causal edit chain and removal preserve originals and unrelated sets after reopen',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id),other=await perform(f,a.op_id,'slot-1');
 const c1=await editSet(f,set.op_id,{reps:{value:9,unit:'rep'}}),c2=await editSet(f,set.op_id,{load:{value:45,unit:'lb'}},[c1.op_id]);
 const c3=await editSet(f,set.op_id,{reserve:{tag:'at_least',value:3,unit:'rep'}},[c2.op_id]);assert.equal(c3.acknowledged,true);
 let r=await recreate(f).readWorkoutHistory(),fact=r.history.sessions[0].projection.facts.find(x=>x.source_op_id===set.op_id);
 assert.deepEqual(fact.current,{load:{value:45,unit:'lb'},reps:{value:9,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}});assert.deepEqual(fact.edit_op_ids,[c1.op_id,c2.op_id,c3.op_id]);
 const removed=await f.c.execute('workout',{action:'remove',input:{target_op_id:set.op_id,lift_lineage_id:'same-lineage',reason:'Mistaken set',causal_parents:[c3.op_id]}});assert.equal(removed.acknowledged,true);
 const before=await f.repo.load();r=await recreate(f).readWorkoutHistory();const facts=r.history.sessions[0].projection.facts;fact=facts.find(x=>x.source_op_id===set.op_id);
 assert.equal(fact.included,false);assert.equal(fact.original.reps.value,8);assert.equal(fact.current.reps.value,9);assert(fact.edit_op_ids.includes(removed.op_id));
 assert.equal(facts.find(x=>x.source_op_id===other.op_id).included,true);assert.equal(facts.find(x=>x.source_op_id===other.op_id).current.reps.value,8);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('transport succession cannot silently resolve competing corrections in either stored arrival order',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id);await editSet(f,set.op_id,{reps:{value:9,unit:'rep'}});await editSet(f,set.op_id,{reps:{value:10,unit:'rep'}});
 const read=async()=>{const r=await recreate(f).readWorkoutHistory();assert.equal(r.read,true);const fact=r.history.sessions[0].projection.facts[0];assert.equal(fact.current,null);assert.equal(fact.included,null);assert.deepEqual(fact.issues,['CONCURRENT_EDIT_INTERPRETATION_REQUIRED']);};
 await read();const s=await f.repo.load();s.generation.collections.ops=Object.fromEntries(Object.entries(s.generation.collections.ops).reverse());await f.repo.commit(s,s.generation,()=>null);const before=await f.repo.load();await read();assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('colliding set records stay separate and a targeted removal cannot remove the other attempt',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),one=await perform(f,a.op_id),two=await perform(f,a.op_id);
 let r=await recreate(f).readWorkoutHistory();let facts=r.history.sessions[0].projection.facts;assert.equal(facts.length,2);assert(facts.every(x=>x.issues.includes('SET_SLOT_RESOLUTION_REQUIRED')));
 assert.equal((await f.c.execute('workout',{action:'remove',input:{target_op_id:one.op_id,lift_lineage_id:'same-lineage',reason:'Duplicate entry'}})).acknowledged,true);
 r=await recreate(f).readWorkoutHistory();facts=r.history.sessions[0].projection.facts;assert.equal(facts.find(x=>x.source_op_id===one.op_id).included,false);
 assert.equal(facts.find(x=>x.source_op_id===two.op_id).included,true);assert.deepEqual(facts.find(x=>x.source_op_id===two.op_id).issues,[]);assert.equal(r.history.continuation.allowed,false);
 }finally{f.repo.close();}
});
test('fresh client recovers exact original workout and stored Set/edit/Skip/Close facts without a new Start or producer',async()=>{
 const f=await setup();try{
 const a=await start(f,await prepare(f)),set=await f.c.execute('workout',{action:'set',input:{session_start_op_id:a.op_id,logical_set_slot:'slot-0',lift_lineage_id:'same-lineage',load:{value:42.5,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'},causal_parents:[a.op_id]}});assert.equal(set.acknowledged,true);
 const edit=await f.c.execute('workout',{action:'correct',input:{target_op_id:set.op_id,lift_lineage_id:'same-lineage',replacement_fields:{reps:{value:9,unit:'rep'}},causal_parents:[set.op_id]}});assert.equal(edit.acknowledged,true);
 const skip=await f.c.execute('workout',{action:'skip',input:{session_start_op_id:a.op_id,logical_set_slot:'slot-1',lift_lineage_id:'same-lineage',skip_scope:'set',reason:'Time',causal_parents:[a.op_id]}});assert.equal(skip.acknowledged,true);
 assert.equal((await close(f,a.op_id)).acknowledged,true);
 const before=await f.repo.load(),fresh=await f.fresh();try{
 const c=createDurablePublicClient({...f.args,repository:fresh.repository}),r=await c.readWorkoutHistory();assert.equal(r.read,true,JSON.stringify(r));
 assert.equal(r.source_revision,before.revision);assert.equal(r.history.sessions.length,1);const session=r.history.sessions[0];
 assert.deepEqual(session.original,before.generation.collections.ops[a.op_id].prescription_capture);
 assert.deepEqual(session.records.map(x=>x.operation.kind),['session-set','correction','session-skip','session-close']);
 assert.equal(session.records[0].operation.payload.reps.value,8);assert.equal(session.records[1].operation.payload.replacement_fields.reps.value,9);
 assert(session.records.every(x=>x.status==='stored-on-this-device'));assert.equal(r.history.continuation.allowed,false);
 session.original.slots[0].load.display='external mutation';assert.equal((await c.readWorkoutHistory()).history.sessions[0].original.slots[0].load.display,'40 lb');
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{fresh.repository.close();}
 }finally{f.repo.close();}
});
test('history distinguishes actual signed accepted prefix from local pending facts',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),op=(await operations(f))[a.op_id];
 const receipt=Sign.signReceipt({seq:1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},f.signingKey);
 const pull=Sign.signPull({athlete_id:'ath-1',device_id:'dev-A',after:0,through:1,receipts:[receipt],wire_version:Wire.WIRE_VERSION,key_epoch:f.signingKey.kid},f.signingKey);
 assert.equal((await f.c.acceptResponse('pull',{wireVersion:Wire.WIRE_VERSION,body:pull})).accepted,true);
 assert.equal((await close(f,a.op_id)).acknowledged,true);const before=await f.repo.load(),r=await recreate(f).readWorkoutHistory();assert.equal(r.read,true,JSON.stringify(r));
 assert.equal(r.history.frontier,1);assert.equal(r.history.sessions[0].start.status,'accepted-through-frontier');assert.equal(r.history.sessions[0].records[0].status,'stored-on-this-device');
 assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('invented stored receipt/frontier cannot promote an unsigned operation to accepted history',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),snapshot=await f.repo.load(),op=snapshot.generation.collections.ops[a.op_id];
 snapshot.generation.collections.receipts={'1':{seq:1,op_id:a.op_id,canonical_content_commitment:op.canonical_content_commitment}};snapshot.generation.collections.sync.frontier={W:1,authorityW:1};
 await f.repo.commit(snapshot,snapshot.generation,()=>null);const before=await f.repo.load(),r=await recreate(f).readWorkoutHistory();assert.equal(r.read,false);assert.equal(r.state,18);assert.equal(r.code,'WORKOUT_PREFIX_UNPROVEN');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('standing lost during history authentication never exposes the stored workout',async()=>{
 let f;f=await setup({wrapStage:stage=>(...args)=>{const r=stage(...args);if(args[1]===null&&f)f.scope.session=2;return r;}});try{
 const r=await f.c.readWorkoutHistory();assert.equal(r.read,false);assert.equal(r.state,17);assert.equal(r.history,undefined);assert.equal(f.produced(),0);
 }finally{f.repo.close();}
});
test('interleaved durable change retires a history read instead of returning mixed generations',async()=>{
 let armed=false,reads=0;const f=await setup({wrapRepository:repo=>({...repo,async load(){
  const s=await repo.load();if(armed&&++reads===2){const next=structuredClone(s.generation);next.metadata.concurrentSynthetic=true;await repo.commit(s,next,()=>null);return repo.load();}return s;
 }})});try{await start(f,await prepare(f));armed=true;
 const r=await f.c.readWorkoutHistory();assert.equal(r.read,false);assert.equal(r.code,'WORKOUT_HISTORY_CHANGED');assert.equal(r.history,undefined);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('malformed receipt index is an integrity refusal, never an empty workout',async()=>{
 const f=await setup();try{await start(f,await prepare(f));const s=await f.repo.load();s.generation.collections.receipts={bad:null};await f.repo.commit(s,s.generation,()=>null);
 const r=await recreate(f).readWorkoutHistory();assert.equal(r.read,false);assert.equal(r.state,18);assert.equal(r.code,'WORKOUT_RECEIPT_INDEX_INVALID');assert.equal(r.history,undefined);
 }finally{f.repo.close();}
});
for(const loss of ['missing','rewritten'])test(`actual stored receipt index with a ${loss} operation refuses integrity before preparing`,async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),op=(await operations(f))[a.op_id];
 const receipt=Sign.signReceipt({seq:1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},f.signingKey);
 const pull=Sign.signPull({athlete_id:'ath-1',device_id:'dev-A',after:0,through:1,receipts:[receipt],wire_version:Wire.WIRE_VERSION,key_epoch:f.signingKey.kid},f.signingKey);
 const accepted=await f.c.acceptResponse('pull',{wireVersion:Wire.WIRE_VERSION,body:pull});assert.equal(accepted.accepted,true,JSON.stringify(accepted));
 const s=await f.repo.load();assert.equal(s.generation.collections.receipts['1'].op,undefined);assert.equal(s.generation.collections.receipts['1'].op_id,op.op_id);
 // Synthetic authenticated-but-inconsistent generation: preserve the real signed
 // proof and actual T2 receipt index; counts-only integrity must not mask lost truth.
 if(loss==='missing'){
  delete s.generation.collections.ops[op.op_id];delete s.generation.collections.outbox[op.op_id];s.generation.collections.meta.checkpoint.counts={ops:0,outbox:0};
 }else s.generation.collections.ops[op.op_id].prescription_capture.session.instruction.display='Rewritten stored instruction';
 await f.repo.commit(s,s.generation,()=>null);const before=await f.repo.load();
 const r=await recreate(f).prepareWorkout({planned_split_slot_id:'next-slot'});
 assert.equal(r.prepared,undefined);assert.equal(r.state,18);assert.equal(r.code,'HISTORICAL_PROOF_UNPROVEN');
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('fresh client cannot create another prepared Start over an unresolved durable workout',async()=>{
 let lose=true;const f=await setup({wrapRepository:repo=>({...repo,async commit(...args){const r=await repo.commit(...args);if(lose){lose=false;throw new Error('synthetic lost reply');}return r;}})});
 try{const p=await prepare(f),lost=await start(f,p);assert.equal(lost.outcomeUnknown,true);f.c.retireWorkoutPreparations();
 const before=await f.repo.load(),fresh=await f.fresh();try{
 const c=createDurablePublicClient({...f.args,repository:fresh.repository});
 const next=await c.prepareWorkout({planned_split_slot_id:'another-slot'});
 assert.equal(next.prepared,undefined);assert.equal(next.code,'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{fresh.repository.close();}
 }finally{f.repo.close();}
});
test('confirmed Start also requires history reconciliation after recreating the client',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f));assert.equal(a.acknowledged,true);
 const before=await f.repo.load(),r=await recreate(f).prepareWorkout({planned_split_slot_id:'another-slot'});
 assert.equal(r.code,'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('a matching durable close allows the next preparation without rewriting the original',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f));const ended=await close(f,a.op_id);assert.equal(ended.acknowledged,true,JSON.stringify(ended));
 const original=(await operations(f))[a.op_id],c=recreate(f),p=await c.prepareWorkout({planned_split_slot_id:'next-slot'});assert.equal(p.prepared,true);
 const next=await c.startPreparedWorkout({preparedId:p.preparedId});assert.equal(next.acknowledged,true);assert.notEqual(next.op_id,a.op_id);
 assert.deepEqual((await operations(f))[a.op_id],original);
 }finally{f.repo.close();}
});
test('a rejected close cannot unlock a new Start',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),ended=await close(f,a.op_id);assert.equal(ended.acknowledged,true);
 const s=await f.repo.load();s.generation.collections.rejected={[ended.op_id]:{op_id:ended.op_id}};await f.repo.commit(s,s.generation,()=>null);
 assert.equal((await recreate(f).prepareWorkout({planned_split_slot_id:'next-slot'})).code,'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
 }finally{f.repo.close();}
});
test('another workout close does not close the current Start',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f));await close(f,a.op_id);
 f.c=recreate(f);const b=await start(f,await prepare(f));assert.equal(b.acknowledged,true);
 const repeated=await close(f,a.op_id);assert.equal(repeated.acknowledged,true);
 assert.equal((await recreate(f).prepareWorkout({planned_split_slot_id:'next-slot'})).code,'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
 }finally{f.repo.close();}
});
test('two client instances prepared on one generation can durably start only once',async()=>{
 const f=await setup();try{const c=recreate(f),[p,q]=await Promise.all([prepare(f),c.prepareWorkout({planned_split_slot_id:'another-slot'})]);
 assert.equal(p.prepared,true);assert.equal(q.prepared,true);
 const results=await Promise.all([start(f,p),c.startPreparedWorkout({preparedId:q.preparedId})]);
 assert.equal(results.filter(r=>r.acknowledged===true).length,1);assert.equal(Object.keys(await operations(f)).length,1);
 assert.equal((await recreate(f).prepareWorkout({planned_split_slot_id:'next-slot'})).code,'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
 }finally{f.repo.close();}
});
test('receipt-only workout history is not mistaken for an empty local session list',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f)),s=await f.repo.load(),op=s.generation.collections.ops[a.op_id];
 s.generation.collections.ops={};s.generation.collections.outbox={};s.generation.collections.meta.checkpoint.counts={ops:0,outbox:0};
 s.generation.collections.receipts={1:{seq:1,op}};await f.repo.commit(s,s.generation,()=>null);
 const r=await recreate(f).prepareWorkout({planned_split_slot_id:'next-slot'});
 assert.equal(r.code,'WORKOUT_HISTORY_RECONCILIATION_REQUIRED');
 }finally{f.repo.close();}
});
test('prepared actual Start stores the displayed original in one T2 batch and encrypted generation',async()=>{
 const f=await setup();try{
  const before=await f.repo.load(),p=await prepare(f);assert.equal(p.prepared,true);assert.deepEqual(await f.repo.load(),before);
  const original=structuredClone(p.view);p.view.slots[0].load.display='caller mutation';f.lastCapture().slots[0].load.display='producer later mutation';
  const r=await start(f,p);assert.equal(r.acknowledged,true,JSON.stringify(r));
  const saved=await f.repo.load(),op=saved.generation.collections.ops[r.op_id];
  assert.deepEqual(op.prescription_capture,original);assert.deepEqual(op.payload,{});assert.equal(op.schema_version,2);
  assert.equal(Object.keys(saved.generation.collections.ops).length,1);assert.equal(Object.keys(saved.generation.collections.outbox).length,1);
  assert.equal(saved.revision,before.revision+1);assert.equal(f.produced(),1);
  assert.equal(Schema.validateWorkoutShape(op).valid,false);assert.equal(Schema.validateWorkoutShape(op,{prescriptionCapture:capture}).valid,true);
  const fresh=await f.fresh();try{assert.deepEqual(await fresh.repository.load(),saved);}finally{fresh.repository.close();}
 }finally{f.repo.close();}
});
test('concurrent and repeated handle Start produce one effect and never re-run the producer',async()=>{
 const f=await setup();try{const p=await prepare(f),[a,b]=await Promise.all([start(f,p),start(f,p)]);
 assert.equal(a.acknowledged,true,JSON.stringify(a));assert.equal(b.acknowledged,true);assert.equal(a.op_id,b.op_id);
 assert.equal(Object.keys(await operations(f)).length,1);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('raw caller capture cannot bypass the private handle',async()=>{
 const f=await setup();try{const p=await prepare(f),before=await f.repo.load();
 const r=await f.c.execute('workout',{action:'start',input:{planned_split_slot_id:'synthetic-slot',plan_basis:p.view.basis.plan_basis,prescription_capture:p.view,causal_parents:[]}});
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('a selected captured writer without the preparation configuration still fails closed',async()=>{
 const f=await setup({client:{workoutProducer:undefined,workoutProducerIdentity:undefined,resolveWorkoutBasis:undefined,prescriptionCapture:undefined}});
 try{const before=await f.repo.load(),value=prescription({producer:identity,basis:{plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-input',source_revision:before.revision}});
 const r=await f.c.execute('workout',{action:'start',input:{planned_split_slot_id:'synthetic-slot',plan_basis:'NO_ACCEPTED_PLAN',prescription_capture:value,causal_parents:[]}});
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('another durable generation invalidates prepared Start without recapturing',async()=>{
 const f=await setup();try{const p=await prepare(f),s=await f.repo.load();await f.repo.commit(s,s.generation,()=>null);const before=await f.repo.load();
 const r=await start(f,p);assert.equal(r.acknowledged,false);assert.equal(r.state,3);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');
 assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('same revision with a different authenticated token invalidates the earlier preparation',async()=>{
 const f=await setup();try{const p=await prepare(f),s=await f.repo.load(),iv=webcrypto.getRandomValues(new Uint8Array(12));
 const aad=new TextEncoder().encode(JSON.stringify(['earned/local-generation/v1',1,f.setup.namespace,s.revision]));
 const ciphertext=await webcrypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},f.key,new TextEncoder().encode(JSON.stringify(s.generation)));
 await mutateActive(f.indexedDB,record=>({...record,iv,ciphertext}));const changed=await f.repo.load();assert.equal(changed.revision,s.revision);assert.notEqual(changed.token,s.token);
 const r=await start(f,p);assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');assert.deepEqual(await f.repo.load(),changed);
 }finally{f.repo.close();}
});
for(const [name,change,state]of[['session',f=>f.scope.session=2,17],['observation',f=>f.scope.observation=2,18]])test(`changed ${name} refuses before Start`,async()=>{
 const f=await setup();try{const p=await prepare(f),before=await f.repo.load();change(f);const r=await start(f,p);assert.equal(r.acknowledged,false);assert.equal(r.state,state);assert.deepEqual(await f.repo.load(),before);}finally{f.repo.close();}
});
test('late downstream validator retirement cannot pass the final transaction',async()=>{
 let f;f=await setup({validateCommit(){f.c.retireWorkoutPreparations();return null;}});try{const p=await prepare(f),before=await f.repo.load(),r=await start(f,p);
 assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('quota abort permits exact retry without recapture',async()=>{
 const faults=faultDatabase(),f=await setup({repository:{indexedDB:faults.indexedDB}});try{const p=await prepare(f),before=await f.repo.load();faults.state.armed=true;faults.state.mode='quota';
 const no=await start(f,p);assert.equal(no.acknowledged,false);assert.deepEqual(await f.repo.load(),before);faults.state.armed=false;
 const yes=await start(f,p);assert.equal(yes.acknowledged,true,JSON.stringify(yes));assert.equal(f.produced(),1);assert.equal(Object.keys(await operations(f)).length,1);
 }finally{f.repo.close();}
});
test('lost commit reply reconciles the actual stored Start, never another operation',async()=>{
 let lose=true;const f=await setup({wrapRepository:repo=>({...repo,async commit(...args){const result=await repo.commit(...args);if(lose){lose=false;throw new Error('synthetic lost reply');}return result;}})});
 try{const p=await prepare(f),lost=await start(f,p);assert.equal(lost.acknowledged,false);assert.equal(Object.keys(await operations(f)).length,1);
 assert.equal(lost.outcomeUnknown,true);assert(!lost.copy.includes('not saved'));
 assert.equal((await prepare(f)).code,'WORKOUT_START_OUTCOME_UNRESOLVED');const recovered=await start(f,p);
 assert.equal(recovered.acknowledged,true);assert.equal(recovered.recovered,true);assert.equal(Object.keys(await operations(f)).length,1);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('retirement after the final validator does not claim cancellation or Saved',async()=>{
 const faults=faultDatabase(),f=await setup({repository:{indexedDB:faults.indexedDB}});try{const p=await prepare(f);faults.state.armed=true;faults.state.mode='delay';
 const pending=start(f,p);await faults.state.write.promise;f.c.retireWorkoutPreparations();faults.state.release=true;const r=await pending;
 assert.equal(r.acknowledged,false);assert.equal(r.committed,true);assert.equal(r.code,'WORKOUT_PREPARATION_RETIRED');assert.equal(Object.keys(await operations(f)).length,1);
 }finally{faults.state.release=true;f.repo.close();}
});
test('hostile getters never run and caller request changes cannot change queued preparation',async()=>{
 const f=await setup();try{let hits=0;const bad=Object.defineProperty({},'planned_split_slot_id',{enumerable:true,get(){hits++;return 'bad';}});
 assert.equal((await f.c.prepareWorkout(bad)).state,3);assert.equal(hits,0);
 const request={planned_split_slot_id:'original'},pending=f.c.prepareWorkout(request);request.planned_split_slot_id='changed';const p=await pending;
 const r=await start(f,p);assert.equal(r.acknowledged,true);assert.equal((await operations(f))[r.op_id].planned_split_slot_id,'original');
 }finally{f.repo.close();}
});
test('another client instance cannot use an old local handle',async()=>{
 const f=await setup();try{const p=await prepare(f),other=createDurablePublicClient(f.args);const r=await other.startPreparedWorkout({preparedId:p.preparedId});
 assert.equal(r.code,'WORKOUT_PREPARATION_REQUIRED');assert.equal(Object.keys(await operations(f)).length,0);
 }finally{f.repo.close();}
});
test('retirement during asynchronous preparation cannot create a surviving handle',async()=>{
 const entered=deferred(),release=deferred();let hold=false;
 const f=await setup({wrapRepository:repo=>({...repo,async load(){const s=await repo.load();if(hold){entered.resolve();await release.promise;}return s;}})});
 try{hold=true;const pending=prepare(f);await entered.promise;f.c.retireWorkoutPreparations();release.resolve();const r=await pending;
 assert.equal(r.prepared,undefined);assert.equal(r.code,'WORKOUT_PREPARATION_RETIRED');assert.equal(Object.keys(await operations(f)).length,0);
 }finally{release.resolve();f.repo.close();}
});
test('definitely refused retirement does not leave a fabricated uncertain write',async()=>{
 let retire=true,f;f=await setup({validateCommit(){if(retire)f.c.retireWorkoutPreparations();return null;}});
 try{const p=await prepare(f),no=await start(f,p);assert.equal(no.acknowledged,false);retire=false;
 const next=await prepare(f);assert.equal(next.prepared,true,JSON.stringify(next));assert.equal((await start(f,next)).acknowledged,true);
 }finally{f.repo.close();}
});
test('competing write before commit cannot silently recapture on a CAS retry',async()=>{
 // Inject the competing write at the actual repository commit boundary.
 let raced=false;const g=await setup({wrapRepository:repo=>({...repo,async commit(...args){if(!raced){raced=true;const current=await repo.load();await repo.commit(current,current.generation,()=>null);}return repo.commit(...args);}})});
 try{const p=await prepare(g),r=await start(g,p);assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');assert.equal(g.produced(),1);assert.equal(Object.keys(await operations(g)).length,0);}finally{g.repo.close();}
});

test('retirement also invalidates a preparation queued before disposal',async()=>{
 const entered=deferred(),release=deferred();let hold=false;
 const f=await setup({wrapRepository:repo=>({...repo,async load(){const s=await repo.load();if(hold){entered.resolve();await release.promise;}return s;}})});
 try{hold=true;const first=prepare(f);await entered.promise;const queued=prepare(f);
 f.c.retireWorkoutPreparations();release.resolve();
 for(const result of await Promise.all([first,queued]))assert.equal(result.code,'WORKOUT_PREPARATION_RETIRED');
 assert.equal(Object.keys(await operations(f)).length,0);
 }finally{release.resolve();f.repo.close();}
});

// Host-only v2 fixture. The real source codec validates frontier representation;
// synthetic signed reference operations and a static metadata resolver below do
// NOT authenticate a source selection, register an engine projection, qualify
// the producer/current policy, or establish schema2 authority issuance.
const sourceCapture=Capture.createPrescriptionCapture({parseStrictJson,profile:Capture.SOURCE_PROFILE,sourceCodec:Source});
const emptySource=()=>Source.frontier(()=>undefined,0);
const sourcePrescription=context=>({...prescription(context),profile:sourceCapture.profile,source_basis:context.source_basis});
const sourceResumePolicy=(_g,context)=>({allowed_actions:['set','skip','close'],reason:'Synthetic v2 current assessment',current_capture:sourcePrescription(context)});
function sourceBasis(generation){const source_basis=structuredClone(generation.metadata.syntheticWorkoutSource||emptySource());return {
 plan_basis:'NO_ACCEPTED_PLAN',input_basis:'synthetic-input',causal_parents:source_basis.selection_id===null?[]:[source_basis.selection_id],source_basis};}
const sourceSetup=(options={})=>setup({...options,capture:sourceCapture,client:{resolveWorkoutBasis:sourceBasis,
 workoutProducer:(_g,context)=>sourcePrescription(context),workoutResumePolicy:sourceResumePolicy,...options.client}});
async function selectSyntheticSource(f,label){
 const before=await f.repo.load(),seq=before.generation.collections.sync.frontier.W+1;
 const op=Client.ops.build({op_id:'synthetic-source-'+label,athlete_id:'ath-1',device_id:'dev-B',device_seq:seq,
  predecessor:before.generation.metadata.syntheticWorkoutSource?.selection_id||null,parents:[],class:'event',kind:'fact',
  effective:{local_date:'2026-09-04',local_time:'08:00',utc_offset:'-04:00'},lease_id:'synthetic-source-reference-only',
  payload:{type:'source-import-intent',interval:{start:'2026-09-04',end:'2026-09-04'},source_id:'synthetic-'+label,
   material_digest:Source.hash('synthetic-host-material-'+label,new Uint8Array())}},O.K_IDENTITY);
 const receipt=Sign.signReceipt({seq,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:'2026-09-04T00:00:00Z',op},f.signingKey);
 const pull=Sign.signPull({athlete_id:'ath-1',device_id:'dev-A',after:seq-1,through:seq,receipts:[receipt],wire_version:Wire.WIRE_VERSION,key_epoch:f.signingKey.kid},f.signingKey);
 const accepted=await f.c.acceptResponse('pull',{wireVersion:Wire.WIRE_VERSION,body:pull});assert.equal(accepted.accepted,true,JSON.stringify(accepted));
 const snapshot=await f.repo.load(),source={W:seq,log_digest:Source.hash('synthetic-host-cut-'+label,new Uint8Array()),selection_id:op.op_id};
 snapshot.generation.metadata.syntheticWorkoutSource=source;await f.repo.commit(snapshot,snapshot.generation,()=>null);return structuredClone(source);
}

test('v2 host owns resolved source and exact capture through atomic Start and durable reopen',async()=>{
 let resolved,produced,seen,productions=0;
 const f=await sourceSetup({client:{resolveWorkoutBasis:g=>(resolved=sourceBasis(g)),workoutProducer:(_g,context)=>{productions++;seen=context;return produced=sourcePrescription(context);}}});
 try{const source=await selectSyntheticSource(f,'A'),before=await f.repo.load(),p=await prepare(f);assert.equal(p.prepared,true,JSON.stringify(p));
  assert.deepEqual(seen.source_basis,source);assert.notEqual(seen.source_basis,resolved.source_basis);assert.deepEqual(p.view.source_basis,source);
  const original=JSON.stringify(p.view);p.view.source_basis.W=999;resolved.source_basis.selection_id='later resolver mutation';produced.source_basis.W=777;
  const [a,b]=await Promise.all([start(f,p),start(f,p)]);assert.equal(a.acknowledged,true,JSON.stringify(a));assert.equal(b.op_id,a.op_id);assert.equal(productions,1);
  const saved=await f.repo.load(),op=saved.generation.collections.ops[a.op_id];assert.equal(JSON.stringify(op.prescription_capture),original);
  assert.deepEqual(op.causal_parents,[source.selection_id]);assert.deepEqual(Schema.validateWorkoutShape(op,{prescriptionCapture:sourceCapture}).references,[source.selection_id]);
  assert.equal(saved.revision,before.revision+1);assert.equal(Object.keys(saved.generation.collections.outbox).length,1);
  const fresh=await f.fresh();try{const read=await createDurablePublicClient({...f.args,repository:fresh.repository}).readWorkoutHistory();assert.equal(read.read,true,JSON.stringify(read));assert.equal(JSON.stringify(read.history.sessions[0].original),original);}finally{fresh.repository.close();}
 }finally{f.repo.close();}
});

for(const field of ['W','log_digest','selection_id','missing','extra'])test(`v2 host refuses producer source ${field} mismatch before a handle or write`,async()=>{
 const f=await sourceSetup({client:{workoutProducer:(_g,context)=>{const value=sourcePrescription(context);
  if(field==='W')value.source_basis.W++;if(field==='log_digest')value.source_basis.log_digest=Source.hash('synthetic-other-cut',new Uint8Array());
  if(field==='selection_id')value.source_basis.selection_id='synthetic-other-selection';if(field==='missing')delete value.source_basis;if(field==='extra')value.source_basis.clearance=true;return value;}}});
 try{const before=await f.repo.load(),p=await prepare(f);assert.notEqual(p.prepared,true);assert.equal(p.code,'WORKOUT_PREPARATION_INVALID');assert.equal(p.preparedId,undefined);assert.equal(p.view,undefined);assert.deepEqual(await f.repo.load(),before);}finally{f.repo.close();}
});
for(const change of ['missing','extra','getter'])test(`v2 host refuses ${change} static source basis without invoking the producer`,async()=>{
 let calls=0,getters=0;const f=await sourceSetup({client:{resolveWorkoutBasis:g=>{const value=sourceBasis(g);
  if(change==='missing')delete value.source_basis;if(change==='extra')value.source_basis.clearance=true;
  if(change==='getter')Object.defineProperty(value.source_basis,'W',{enumerable:true,get(){getters++;return 0;}});return value;},
  workoutProducer:(_g,context)=>{calls++;return sourcePrescription(context);}}});
 try{const before=await f.repo.load(),p=await prepare(f);assert.notEqual(p.prepared,true);assert.equal(p.code,'WORKOUT_INPUT_INVALID');assert.equal(calls,0);assert.equal(getters,0);assert.deepEqual(await f.repo.load(),before);}finally{f.repo.close();}
});
test('v2 host requires the selected reference as a parent and actual Start refuses its absence from stored operations',async()=>{
 for(const listed of [false,true]){const f=await sourceSetup({client:{resolveWorkoutBasis:g=>{const value=sourceBasis(g);value.source_basis.selection_id='synthetic-missing-selection';value.causal_parents=listed?[value.source_basis.selection_id]:[];return value;}}});
  try{const before=await f.repo.load(),p=await prepare(f);
   if(listed){assert.equal(p.prepared,true,JSON.stringify(p));assert.equal((await start(f,p)).acknowledged,false);}
   else{assert.notEqual(p.prepared,true);assert.equal(p.code,'WORKOUT_BASIS_INVALID');}
   assert.deepEqual(await f.repo.load(),before);
  }finally{f.repo.close();}}
});
test('v1 host keeps its closed resolver and source-free producer context',async()=>{
 let context;const f=await setup({client:{workoutProducer:(_g,c)=>{context=c;return prescription(c);}}});
 try{const p=await prepare(f);assert.equal(p.prepared,true);assert.equal(Object.hasOwn(context,'source_basis'),false);assert.equal(Object.hasOwn(p.view,'source_basis'),false);assert.equal((await start(f,p)).acknowledged,true);}finally{f.repo.close();}
 const extra=await setup({client:{resolveWorkoutBasis:sourceBasis}});try{assert.equal((await prepare(extra)).code,'WORKOUT_INPUT_INVALID');}finally{extra.repo.close();}
});

for(const override of ['source_basis','allowed_actions','clearance'])test(`v2 public prepare Start and resume reject renderer ${override}`,async()=>{
 const f=await sourceSetup();try{const value=override==='source_basis'?emptySource():true,before=await f.repo.load();
  assert.equal((await f.c.prepareWorkout({planned_split_slot_id:'synthetic-slot',[override]:value})).code,'WORKOUT_INPUT_INVALID');
  const p=await prepare(f);assert.equal(p.prepared,true,JSON.stringify(p));assert.equal((await start(f,p,{[override]:value})).code,'WORKOUT_INPUT_INVALID');assert.deepEqual(await f.repo.load(),before);
  const a=await start(f,p);assert.equal(a.acknowledged,true,JSON.stringify(a));const saved=await f.repo.load();
  assert.equal((await f.c.prepareWorkoutContinuation({session_start_op_id:a.op_id,[override]:value})).code,'WORKOUT_INPUT_INVALID');
  const r=await resume(f.c,a.op_id);assert.equal(r.prepared,true,JSON.stringify(r));
  assert.equal((await f.c.executeResumedWorkout({resumeId:r.resumeId,action:'close',input:{session_start_op_id:a.op_id,completion_kind:'early'},[override]:value})).acknowledged,false);
  assert.deepEqual(await f.repo.load(),saved);
 }finally{f.repo.close();}
});

test('v2 source change between preparation and Start refuses through the actual revision fence without recapture',async()=>{
 let calls=0;const f=await sourceSetup({client:{workoutProducer:(_g,c)=>{calls++;return sourcePrescription(c);}}});
 try{await selectSyntheticSource(f,'A');const p=await prepare(f);assert.equal(p.prepared,true,JSON.stringify(p));await selectSyntheticSource(f,'B');const before=await f.repo.load(),r=await start(f,p);
  assert.equal(r.acknowledged,false);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');assert.equal(calls,1);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('v2 source change at the actual Start commit cut refuses the CAS retry without recapture',async()=>{
 let raced=false,calls=0;const f=await sourceSetup({client:{workoutProducer:(_g,c)=>{calls++;return sourcePrescription(c);}},
  wrapRepository:repo=>({...repo,async commit(...args){if(!raced){raced=true;const s=await repo.load();s.generation.metadata.syntheticWorkoutSource={...emptySource(),log_digest:Source.hash('synthetic-interleaved-source',new Uint8Array())};await repo.commit(s,s.generation,()=>null);}return repo.commit(...args);}})});
 try{const p=await prepare(f);assert.equal(p.prepared,true,JSON.stringify(p));const r=await start(f,p);assert.equal(r.code,'WORKOUT_PREPARATION_STALE');assert.equal(r.acknowledged,false);assert.equal(calls,1);assert.equal(Object.keys(await operations(f)).length,0);}finally{f.repo.close();}
});

for(const oldProfile of ['v2','v1'])test(`v2 current resume source B preserves exact ${oldProfile} original without recapturing`,async()=>{
 let policyContext,productions=0;const f=await (oldProfile==='v2'?sourceSetup:setup)();
 try{if(oldProfile==='v2')await selectSyntheticSource(f,'A');const p=await prepare(f),a=await start(f,p);assert.equal(a.acknowledged,true,JSON.stringify(a));
  const original=JSON.stringify((await operations(f))[a.op_id].prescription_capture);assert.equal((await perform(f,a.op_id)).acknowledged,true);
  const sourceB=await selectSyntheticSource(f,'B'),fresh=await f.fresh();try{
   const c=createDurablePublicClient({...f.args,repository:fresh.repository,prescriptionCapture:sourceCapture,resolveWorkoutBasis:sourceBasis,
    workoutProducer:()=>{productions++;throw Error('Original must never be regenerated');},workoutResumePolicy:(_g,context)=>{policyContext=context;const value=sourceResumePolicy(_g,context);value.current_capture.slots[1].load=cell('35 lb',' {"value":35.00,"unit":"lb"} ');context.original.slots[0].load.display='policy mutation';return value;}});
   const before=await fresh.repository.load(),r=await resume(c,a.op_id);assert.equal(r.prepared,true,JSON.stringify(r));assert.deepEqual(policyContext.source_basis,sourceB);assert.deepEqual(r.view.current.source_basis,sourceB);
   assert.equal(JSON.stringify(r.view.original),original);assert.equal(r.view.current.slots[1].load.display,'35 lb');assert.equal(r.view.original.slots[1].load.display,'45 lb');assert.equal(productions,0);
   if(oldProfile==='v1'){assert.equal(r.view.original.profile,capture.profile);assert.equal(Object.hasOwn(r.view.original,'source_basis'),false);}else assert.notEqual(r.view.original.source_basis.selection_id,sourceB.selection_id);
   assert.deepEqual(await fresh.repository.load(),before);r.view.current.source_basis.W=999;policyContext.source_basis.selection_id='later policy mutation';
   assert.equal((await resumedSet(c,r,a.op_id)).acknowledged,true);const read=await c.readWorkoutHistory();assert.equal(read.read,true);assert.equal(JSON.stringify(read.history.sessions[0].original),original);
  }finally{fresh.repository.close();}
 }finally{f.repo.close();}
});
for(const field of ['W','log_digest','selection_id','missing'])test(`v2 resume refuses current source ${field} mismatch while preserving original`,async()=>{
 const f=await sourceSetup();try{await selectSyntheticSource(f,'A');const a=await start(f,await prepare(f));assert.equal(a.acknowledged,true,JSON.stringify(a));await selectSyntheticSource(f,'B');
  const c=createDurablePublicClient({...f.args,workoutResumePolicy:(_g,context)=>{const value=sourceResumePolicy(_g,context);
   if(field==='W')context.source_basis.W=context.original.source_basis.W;if(field==='log_digest')context.source_basis.log_digest=context.original.source_basis.log_digest;
   if(field==='selection_id')context.source_basis.selection_id=context.original.source_basis.selection_id;if(field==='missing')delete value.current_capture.source_basis;return value;}});
  const before=await f.repo.load(),r=await resume(c,a.op_id);assert.notEqual(r.prepared,true);assert.equal(r.code,'WORKOUT_CAPTURE_INVALID');assert.equal(r.resumeId,undefined);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('v2 uncertain Start reconciles its same stored capture once without invoking the producer again',async()=>{
 let lose=true,calls=0;const f=await sourceSetup({client:{workoutProducer:(_g,c)=>{calls++;return sourcePrescription(c);}},wrapRepository:repo=>({...repo,async commit(...args){const r=await repo.commit(...args);if(lose){lose=false;throw Error('Synthetic lost v2 reply');}return r;}})});
 try{const p=await prepare(f);assert.equal(p.prepared,true,JSON.stringify(p));const original=JSON.stringify(p.view),lost=await start(f,p);assert.equal(lost.acknowledged,false);assert.equal(lost.outcomeUnknown,true);
  assert.equal((await prepare(f)).code,'WORKOUT_START_OUTCOME_UNRESOLVED');const recovered=await start(f,p);assert.equal(recovered.acknowledged,true);assert.equal(recovered.recovered,true);assert.equal(calls,1);
  const ops=await operations(f);assert.equal(Object.keys(ops).length,1);assert.equal(JSON.stringify(ops[recovered.op_id].prescription_capture),original);
 }finally{f.repo.close();}
});

// PM308/312 foundation controls. These callbacks emulate a trusted future host;
// they are not a production controller, consumer, import or phone qualification.
async function replacementBasis(f){const snapshot=await f.repo.load();return {
 namespace:f.args.namespace,athleteId:f.args.athleteId,deviceId:f.args.deviceId,sessionEpoch:f.args.sessionEpoch,
 observationEpoch:f.scope.observation,revision:snapshot.revision,token:snapshot.token};}
async function replaceHost(f,callbacks,basis){return f.c.replaceIdleWorkoutHost(basis||await replacementBasis(f),callbacks);}
const replacementCallbacks=publishReplacement=>({isReplacementCurrent:()=>true,publishReplacement});
async function expectReplacementRefused(f,code,callbacks,basis){
 let calls=0;const before=await f.repo.load(),r=await replaceHost(f,callbacks||replacementCallbacks(()=>{calls++;}),basis);
 assert.equal(r.replaced,false,JSON.stringify(r));if(code)assert.equal(r.code,code,JSON.stringify(r));
 assert.equal(calls,0);assert.equal(r.stored,false);assert.equal(r.durable,false);assert.equal(r.acknowledged,undefined);
 assert.deepEqual(await f.repo.load(),before);return r;
}
for(const prepared of [false,true])test(`idle replacement: idle ${prepared?'prepared':'unprepared'} host publishes exactly once without a write`,async()=>{
 const f=await setup();try{
  const p=prepared?await prepare(f):null;if(p)assert.equal(p.prepared,true);
  const next=recreate(f);let host=f.c,calls=0;const before=await f.repo.load(),basis=await replacementBasis(f);
  const callbacks=replacementCallbacks(()=>{calls++;host=next;});
  const r=await f.c.replaceIdleWorkoutHost(basis,callbacks);assert.equal(r.replaced,true,JSON.stringify(r));
  assert.equal(r.sourceRevision,before.revision);assert.equal(r.stored,false);assert.equal(r.durable,false);assert.equal(r.acknowledged,undefined);
  assert.equal(calls,1);assert.equal(host,next);assert.deepEqual(await f.repo.load(),before);assert.equal(f.produced(),prepared?1:0);
  assert.equal((await f.c.replaceIdleWorkoutHost(basis,callbacks)).code,'SESSION_CHANGED');assert.equal(calls,1);
  assert.equal((await start(f,p||{preparedId:'missing'})).code,'SESSION_CHANGED');assert.notEqual((await prepare(f)).prepared,true);
  assert.deepEqual(await f.repo.load(),before);
  const fresh=await next.prepareWorkout({planned_split_slot_id:'replacement-slot'});assert.equal(fresh.prepared,true);
  assert.equal((await next.startPreparedWorkout({preparedId:fresh.preparedId})).acknowledged,true);
 }finally{f.repo.close();}
});
test('idle replacement: fully closed recorded workout preserves complete generation ops outbox and retained history',async()=>{
 const f=await setup();try{const a=await start(f,await prepare(f));assert.equal(a.acknowledged,true);
  for(const slot of ['slot-0','slot-1','slot-2'])assert.equal((await perform(f,a.op_id,slot)).acknowledged,true);
  assert.equal((await close(f,a.op_id)).acknowledged,true);const before=await f.repo.load();assert.equal(Object.keys(before.generation.collections.ops).length,5);
  assert.equal(Object.keys(before.generation.collections.outbox).length,5);let calls=0;
  assert.equal((await replaceHost(f,replacementCallbacks(()=>{calls++;}))).replaced,true);assert.equal(calls,1);
  assert.deepEqual(await f.repo.load(),before);assert.equal((await start(f,{preparedId:'uncreated'})).code,'SESSION_CHANGED');
 }finally{f.repo.close();}
});
for(const cause of ['false','throw','promise'])test(`idle replacement: ${cause} before publication retains the old usable preparation`,async()=>{
 const f=await setup();try{const p=await prepare(f),before=await f.repo.load();let calls=0;
  const callbacks={isReplacementCurrent(){if(cause==='throw')throw Error('Synthetic currentness failure');return cause==='promise'?Promise.resolve(true):false;},publishReplacement(){calls++;}};
  await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_NOT_CURRENT',callbacks);
  assert.equal(calls,0);assert.deepEqual(await f.repo.load(),before);assert.equal((await start(f,p)).acknowledged,true);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
test('idle replacement: actual failed candidate preparation leaves the old bundle usable',async()=>{
 const f=await setup();try{const p=await prepare(f),old=f.c;let host=old,calls=0;
  const next=createDurablePublicClient({...f.args,workoutProducer(){throw Error('Synthetic candidate construction failure');}});
  const candidate=await next.prepareWorkout({planned_split_slot_id:'replacement-slot'});assert.notEqual(candidate.prepared,true);
  assert.equal(candidate.code,'WORKOUT_PREPARATION_INVALID');
  await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_NOT_CURRENT',{isReplacementCurrent:()=>candidate.prepared===true,publishReplacement(){calls++;host=next;}});
  assert.equal(host,old);assert.equal(calls,0);assert.equal((await start(f,p)).acknowledged,true);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
for(const cause of ['throw-before','assign-throw','assign-promise','assign-value'])test(`idle replacement: publisher ${cause} is unknown publication without rolling back external effects`,async()=>{
 const f=await setup();try{const p=await prepare(f),old=f.c,next=recreate(f);let host=old,calls=0;
  const r=await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_PUBLICATION_UNKNOWN',replacementCallbacks(()=>{
   calls++;if(cause==='throw-before')throw Error('Before assignment');host=next;
   if(cause==='assign-throw')throw Error('After assignment');return cause==='assign-promise'?Promise.resolve():42;
  }));
  assert.equal(r.outcomeUnknown,true);assert.equal(calls,1);assert.equal(host,cause==='throw-before'?old:next);
  assert.equal((await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_PUBLICATION_UNRESOLVED')).outcomeUnknown,true);
  assert.equal((await start(f,p)).acknowledged,true);assert.equal(f.produced(),1); // Old preparation was NOT retired.
  assert.equal(host,cause==='throw-before'?old:next); // External assignment was NOT undone.
 }finally{f.repo.close();}
});
for(const bad of ['expected-getter','callback-getter','async-check','async-publish','generator-check','generator-publish','missing-token','object-epoch','extra'])test(`idle replacement: rejects ${bad} capability shape before any accessor or publication`,async()=>{
 const f=await setup();try{const p=await prepare(f),basis=await replacementBasis(f);let hits=0;
  const callbacks=replacementCallbacks(()=>{hits++;});
  if(bad==='expected-getter')Object.defineProperty(basis,'token',{enumerable:true,get(){hits++;return 'bad';}});
  if(bad==='callback-getter')Object.defineProperty(callbacks,'publishReplacement',{enumerable:true,get(){hits++;return ()=>{};}});
  if(bad==='async-check')callbacks.isReplacementCurrent=async()=>true;if(bad==='async-publish')callbacks.publishReplacement=async()=>{hits++;};
  if(bad==='generator-check')callbacks.isReplacementCurrent=function*(){hits++;yield true;};if(bad==='generator-publish')callbacks.publishReplacement=function*(){hits++;};
  if(bad==='missing-token')delete basis.token;if(bad==='object-epoch')basis.observationEpoch={value:1};if(bad==='extra')basis.idle=true;
  await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_INPUT_INVALID',callbacks,basis);assert.equal(hits,0);
  assert.equal((await start(f,p)).acknowledged,true);
 }finally{f.repo.close();}
});
for(const key of ['namespace','athleteId','deviceId','sessionEpoch','observationEpoch','revision','token'])test(`idle replacement: actual ${key} binding cannot be replaced by caller claims`,async()=>{
 const f=await setup();try{const p=await prepare(f),basis=await replacementBasis(f);basis[key]=typeof basis[key]==='number'?basis[key]+1:basis[key]+'-other';
  await expectReplacementRefused(f,key==='observationEpoch'?'OBSERVATION_CHANGED':['revision','token'].includes(key)?'WORKOUT_REPLACEMENT_STALE':'WORKOUT_REPLACEMENT_SCOPE_CHANGED',undefined,basis);
  assert.equal((await start(f,p)).acknowledged,true);
 }finally{f.repo.close();}
});
for(const condition of ['active-today','unfinished-earlier','legacy-closed','other-device-closed','rejected-start','rejected-close','unproved-local','unproved-signature','unresolved-edit','unproved-prefix'])test(`idle replacement: ${condition} history never proves idle`,async()=>{
 const f=await setup();try{
  if(condition==='legacy-closed')await readLegacy(f,[...legacyWriter().model.ops.values()]);
  else if(condition==='other-device-closed'){
   const other=await setup();try{const a=await start(other,await prepare(other));await close(other,a.op_id);
    const ops=Object.values(await operations(other)).map(op=>{const r=structuredClone(op);r.device_id='dev-B';r.canonical_content_commitment=Client.ops.commitmentOf(r,O.K_IDENTITY);return r;});
    await readLegacy(f,ops);
   }finally{other.repo.close();}
  }else{
   const p=await prepare(f),a=await start(f,p,condition==='unfinished-earlier'?{effective:{local_date:'2026-09-03',local_time:'08:00:00',utc_offset:'+00:00'}}:{});
   assert.equal(a.acknowledged,true,JSON.stringify(a));
   let fact;if(condition==='unresolved-edit'){fact=await perform(f,a.op_id);await editSet(f,fact.op_id,{reps:{value:9,unit:'rep'}});await editSet(f,fact.op_id,{reps:{value:10,unit:'rep'}});}
   const ended=['active-today','unfinished-earlier'].includes(condition)?null:await close(f,a.op_id);if(ended)assert.equal(ended.acknowledged,true);
   if(condition.startsWith('rejected-')){
    const op=(await operations(f))[condition==='rejected-start'?a.op_id:ended.op_id];
    const disposition=Sign.signDisposition({op_id:op.op_id,device_id:op.device_id,device_seq:op.device_seq,canonical_content_commitment:op.canonical_content_commitment,
     status:'REJECTED',athlete_log_seq:null,rejection_code:'LEASE_EXPIRED',decided_at:'2026-09-04T00:00:00Z'},f.signingKey);
    assert.equal((await f.c.acceptResponse('disposition',{wireVersion:Wire.WIRE_VERSION,body:{disposition}})).accepted,true);
   }
   if(['unproved-local','unproved-signature','unproved-prefix'].includes(condition)){
    const s=await f.repo.load();
    if(condition==='unproved-local')s.generation.collections.ops[a.op_id].prescription_capture.session.instruction.display='Rewritten';
    if(condition==='unproved-signature')s.generation.metadata.authorityLease.signature='unproved-signature';
    if(condition==='unproved-prefix')s.generation.collections.sync.frontier.authorityW=1;
    await f.repo.commit(s,s.generation,()=>null);
   }
  }
  f.c=recreate(f);await expectReplacementRefused(f);
 }finally{f.repo.close();}
});

test('idle replacement: a previously queued history read refuses replacement even after that read completes',async()=>{
 const f=await setup();try{const p=await prepare(f),basis=await replacementBasis(f),before=await f.repo.load();let calls=0;
  const read=f.c.readWorkoutHistory(),replacement=f.c.replaceIdleWorkoutHost(basis,replacementCallbacks(()=>{calls++;}));
  assert.equal((await read).read,true);assert.equal((await replacement).code,'WORKOUT_REPLACEMENT_BUSY');assert.equal(calls,0);
  assert.deepEqual(await f.repo.load(),before);assert.equal((await start(f,p)).acknowledged,true);
 }finally{f.repo.close();}
});
for(const phase of ['initial-read','verification','final-read','guard-exit'])for(const work of ['Start','edit'])test(`idle replacement: ${work} queued during ${phase} keeps its original scheduling and result`,async()=>{
 const entered=deferred(),release=deferred();let armed=false,reads=0;
 const pause=async()=>{if(armed){armed=false;entered.resolve();await release.promise;}};
 const f=await setup({wrapRepository:repo=>({...repo,async load(){const s=await repo.load();if(armed&&++reads===(phase==='final-read'?6:1)&&phase.endsWith('read'))await pause();return s;}}),
  client:{subtle:{importKey:(...a)=>webcrypto.subtle.importKey(...a),async verify(...a){const valid=await webcrypto.subtle.verify(...a);if(phase==='verification')await pause();return valid;}},
   observationGuard:{async run(kind,fn){const r=await fn();if(kind==='idle-workout-replacement'&&phase==='guard-exit')await pause();return r;}}}});
 try{
  let edit;if(work==='edit'){const a=await start(f,await prepare(f)),set=await perform(f,a.op_id);await close(f,a.op_id);edit=await prepareEdit(f.c,set.op_id);assert.equal(edit.prepared,true);}
  const p=await prepare(f),basis=await replacementBasis(f),before=await f.repo.load();let calls=0;
  armed=true;reads=0;const replacement=f.c.replaceIdleWorkoutHost(basis,replacementCallbacks(()=>{calls++;}));await entered.promise;
  const competitor=work==='Start'?start(f,p):correctPrepared(f.c,edit,{reps:{value:9,unit:'rep'}});
  release.resolve();const no=await replacement;assert.equal(no.code,'WORKOUT_REPLACEMENT_BUSY',JSON.stringify(no));assert.equal(no.replaced,false);assert.equal(calls,0);
  const saved=await competitor;assert.equal(saved.acknowledged,true,JSON.stringify(saved));
  const after=await f.repo.load();assert.equal(Object.keys(after.generation.collections.ops).length,Object.keys(before.generation.collections.ops||{}).length+1);
  assert.equal(after.revision,before.revision+1);
 }finally{release.resolve();f.repo.close();}
});
async function resealSameRevision(f){const s=await f.repo.load(),iv=webcrypto.getRandomValues(new Uint8Array(12));
 const aad=new TextEncoder().encode(JSON.stringify(['earned/local-generation/v1',1,f.setup.namespace,s.revision]));
 const ciphertext=await webcrypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},f.key,new TextEncoder().encode(JSON.stringify(s.generation)));
 await mutateActive(f.indexedDB,record=>({...record,iv,ciphertext}));const next=await f.repo.load();assert.equal(next.revision,s.revision);assert.notEqual(next.token,s.token);
}
for(const phase of ['initial-read','verification','final-read'])for(const change of ['revision','token','session','observation'])test(`idle replacement: ${change} changing during ${phase} refuses before publication`,async()=>{
 const entered=deferred(),release=deferred();let armed=false,reads=0;
 const pause=async()=>{if(armed){armed=false;entered.resolve();await release.promise;}};
 const f=await setup({wrapRepository:repo=>({...repo,async load(){const s=await repo.load();if(armed&&++reads===(phase==='final-read'?6:1)&&phase.endsWith('read'))await pause();return s;}}),
  client:{subtle:{importKey:(...a)=>webcrypto.subtle.importKey(...a),async verify(...a){const r=await webcrypto.subtle.verify(...a);if(phase==='verification')await pause();return r;}}}});
 try{const p=await prepare(f),basis=await replacementBasis(f);let calls=0;armed=true;reads=0;
  const pending=f.c.replaceIdleWorkoutHost(basis,replacementCallbacks(()=>{calls++;}));await entered.promise;
  if(change==='revision'){const s=await f.repo.load();await f.repo.commit(s,s.generation,()=>null);}
  if(change==='token')await resealSameRevision(f);if(change==='session')f.scope.session++;if(change==='observation')f.scope.observation++;
  const before=await f.repo.load();release.resolve();const r=await pending;
  assert.equal(r.replaced,false,JSON.stringify(r));assert.equal(r.code,change==='session'?'SESSION_CHANGED':change==='observation'?'OBSERVATION_CHANGED':'WORKOUT_REPLACEMENT_STALE');
  assert.equal(calls,0);assert.deepEqual(await f.repo.load(),before);
  if(change==='session'||change==='observation'){f.scope.session=1;f.scope.observation=1;assert.equal((await start(f,p)).acknowledged,true);}
 }finally{release.resolve();f.repo.close();}
});
for(const behavior of ['throws-after','omits','twice'])test(`idle replacement: observation guard ${behavior} never publishes`,async()=>{
 const f=await setup({client:{observationGuard:{async run(kind,fn){if(kind!=='idle-workout-replacement')return fn();
  if(behavior==='omits')return;const r=await fn();if(behavior==='throws-after')throw Error('Synthetic guard failed after verification');await fn();return r;}}}});
 try{const p=await prepare(f);await expectReplacementRefused(f);assert.equal((await start(f,p)).acknowledged,true);}finally{f.repo.close();}
});
test('idle replacement: synchronous currentness reentrancy cannot publish ahead of a queued Start',async()=>{
 const f=await setup();try{const p=await prepare(f),basis=await replacementBasis(f);let pending,calls=0;
  const r=await f.c.replaceIdleWorkoutHost(basis,{isReplacementCurrent(){pending=start(f,p);return true;},publishReplacement(){calls++;}});
  assert.equal(r.code,'WORKOUT_REPLACEMENT_BUSY');assert.equal(calls,0);assert.equal((await pending).acknowledged,true);
 }finally{f.repo.close();}
});
for(const invalidation of ['preparations','history'])test(`idle replacement: synchronous ${invalidation} invalidation changes the private fence`,async()=>{
 const f=await setup();try{const p=await prepare(f);let calls=0;
  const r=await replaceHost(f,{isReplacementCurrent(){if(invalidation==='preparations')f.c.retireWorkoutPreparations();else f.c.invalidateCurrentHead();return true;},publishReplacement(){calls++;}});
  assert.equal(r.code,'WORKOUT_REPLACEMENT_BUSY');assert.equal(calls,0);
  if(invalidation==='history')assert.equal((await start(f,p)).acknowledged,true);
 }finally{f.repo.close();}
});
test('idle replacement: unknown Start retains same-handle authenticated retry without a second Start',async()=>{
 let lose=true;const f=await setup({wrapRepository:repo=>({...repo,async commit(...a){const r=await repo.commit(...a);if(lose){lose=false;throw Error('Lost Start reply');}return r;}})});
 try{const p=await prepare(f),lost=await start(f,p);assert.equal(lost.outcomeUnknown,true);
  const r=await expectReplacementRefused(f,'WORKOUT_START_OUTCOME_UNRESOLVED');assert.equal(r.outcomeUnknown,true);
  const saved=await start(f,p);assert.equal(saved.acknowledged,true);assert.equal(saved.recovered,true);assert.equal(Object.keys(await operations(f)).length,1);
  assert.equal((await close(f,saved.op_id)).acknowledged,true);let calls=0;
  assert.equal((await replaceHost(f,replacementCallbacks(()=>{calls++;}))).replaced,true);assert.equal(calls,1);assert.equal(f.produced(),1);
 }finally{f.repo.close();}
});
for(const command of ['edit','resume','general-close'])test(`idle replacement: unknown ${command} write remains fenced after finally unrelated success and read`,async()=>{
 let lose=false;const f=await setup({client:{workoutResumePolicy:resumePolicy},wrapRepository:repo=>({...repo,async commit(...a){const r=await repo.commit(...a);if(lose){lose=false;throw Error('Synthetic durable write lost reply');}return r;}})});
 try{const a=await start(f,await prepare(f));let pending;
  if(command==='edit'){const set=await perform(f,a.op_id);await close(f,a.op_id);const p=await prepareEdit(f.c,set.op_id);assert.equal(p.prepared,true);lose=true;pending=correctPrepared(f.c,p,{reps:{value:9,unit:'rep'}});}
  else if(command==='resume'){const p=await resume(f.c,a.op_id);assert.equal(p.prepared,true);lose=true;pending=f.c.executeResumedWorkout({resumeId:p.resumeId,action:'close',input:{session_start_op_id:a.op_id,completion_kind:'early',causal_parents:[a.op_id]}});}
  else{lose=true;pending=close(f,a.op_id);}
  const lost=await pending;assert.equal(lost.acknowledged,false);assert.equal(lost.code,'STAGING_FAILED');
  if(command==='edit')assert.equal(lost.outcomeUnknown,true);else assert.equal(lost.outcomeUnknown,undefined); // Preserve original result shape.
  const s=await f.repo.load();assert.equal(Object.values(s.generation.collections.ops).filter(op=>op.kind==='session-close').length,1);
  const accepted=await f.c.acceptResponse('lease',{wireVersion:Wire.WIRE_VERSION,body:{lease:s.generation.metadata.authorityLease}});assert.equal(accepted.accepted,true,JSON.stringify(accepted));
  assert.equal((await f.c.readWorkoutHistory()).read,true);assert((await f.c.reopen()).view);
  assert.equal((await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_WRITE_UNRESOLVED')).outcomeUnknown,true);
  assert.equal((await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_WRITE_UNRESOLVED')).outcomeUnknown,true);
  // A new handle authenticates the actual closed history; it does not clear or retry the old handle's uncertainty.
  const fresh=recreate(f);let calls=0;const before=await f.repo.load();
  assert.equal((await fresh.replaceIdleWorkoutHost(await replacementBasis(f),replacementCallbacks(()=>{calls++;}))).replaced,true);assert.equal(calls,1);assert.deepEqual(await f.repo.load(),before);
 }finally{f.repo.close();}
});
test('idle replacement: a known aborted edit does not create a false unknown-write fence',async()=>{
 const faults=faultDatabase(),f=await setup({repository:{indexedDB:faults.indexedDB}});
 try{const a=await start(f,await prepare(f)),set=await perform(f,a.op_id);await close(f,a.op_id);const p=await prepareEdit(f.c,set.op_id),before=await f.repo.load();
  faults.state.armed=true;faults.state.mode='quota';const no=await correctPrepared(f.c,p,{reps:{value:9,unit:'rep'}});faults.state.armed=false;
  assert.equal(no.acknowledged,false);assert(['TRANSACTION_ABORTED','TRANSACTION_WRITE_FAILED'].includes(no.code),JSON.stringify(no));assert.deepEqual(await f.repo.load(),before);
  assert.equal((await replaceHost(f,replacementCallbacks(()=>{}))).replaced,true);
 }finally{faults.state.armed=false;f.repo.close();}
});

for(const kind of ['time','head'])test(`idle replacement: an in-flight ${kind} exchange is not idle even while the write queue is free`,async()=>{
 const entered=deferred(),release=deferred(),f=await setup();let exchange;
 try{const p=await prepare(f);const request=async()=>{entered.resolve();await release.promise;return {wireVersion:'synthetic-invalid-response'};};
  exchange=kind==='time'?f.c.exchangeServerTime(request):f.c.exchangeCurrentHead(request,{issuanceAttempt:'synthetic-idle-head'});
  await entered.promise;await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_BUSY');
  assert.equal((await start(f,p)).acknowledged,true); // Existing local scheduling remains usable while HTTP waits.
 }finally{release.resolve();if(exchange)await exchange;f.repo.close();}
});
for(const command of ['Start','edit','resume-close'])test(`idle replacement: queued behind an active ${command} cannot erase that operation`,async()=>{
 const faults=faultDatabase(),f=await setup({repository:{indexedDB:faults.indexedDB},client:{workoutResumePolicy:resumePolicy}});
 try{let request;
  if(command==='Start'){const p=await prepare(f);request=()=>start(f,p);}
  else{const a=await start(f,await prepare(f));
   if(command==='edit'){const set=await perform(f,a.op_id);await close(f,a.op_id);const p=await prepareEdit(f.c,set.op_id);request=()=>correctPrepared(f.c,p,{reps:{value:9,unit:'rep'}});}
   else{const p=await resume(f.c,a.op_id);request=()=>f.c.executeResumedWorkout({resumeId:p.resumeId,action:'close',input:{session_start_op_id:a.op_id,completion_kind:'early',causal_parents:[a.op_id]}});}
  }
  const before=await f.repo.load(),basis=await replacementBasis(f);faults.state.armed=true;faults.state.mode='delay';const pending=request();await faults.state.write.promise;
  let calls=0;const replacement=f.c.replaceIdleWorkoutHost(basis,replacementCallbacks(()=>{calls++;}));faults.state.release=true;
  assert.equal((await pending).acknowledged,true);assert.equal((await replacement).code,'WORKOUT_REPLACEMENT_BUSY');assert.equal(calls,0);
  assert.equal((await f.repo.load()).revision,before.revision+1);
 }finally{faults.state.release=true;f.repo.close();}
});
test('idle replacement: a late durable refusal survives observation restoration and blocks publication',async()=>{
 const faults=faultDatabase(),f=await setup({repository:{indexedDB:faults.indexedDB}});
 try{const p=await prepare(f);faults.state.armed=true;faults.state.mode='delay';const pending=start(f,p);await faults.state.write.promise;
  f.scope.observation=2;faults.state.release=true;const result=await pending;assert.equal(result.acknowledged,false);assert.equal(result.committed,true);
  f.scope.observation=1;await expectReplacementRefused(f,'OBSERVATION_CHANGED');assert.equal((await start(f,p)).acknowledged,false);
 }finally{faults.state.release=true;f.repo.close();}
});
for(const standing of ['revoked','lease-expired','contract-obsolete'])test(`idle replacement: ${standing} standing is not inferred from a renderer history list`,async()=>{
 const f=await setup({config:standing==='revoked'?{standing:'revoked'}:standing==='lease-expired'?{clock:{...config().clock,now:()=> '2030-01-01T00:00:00Z'}}:{contract:{client:'1',required:'2'}}});
 try{await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_STANDING_UNPROVEN');}finally{f.repo.close();}
});

// Real fake-indexeddb transactions/connections, with observation and deterministic
// I/O faults only. No successful repository/head guard is replaced by a stub.
function headDatabase(){
 const inner=faultDatabase().inner,state={arm:false,mode:null,events:[],transactions:[],writes:[],beforeBegin:null,afterRead:null,afterCallback:null};
 const indexedDB={open(...args){const request=inner.open(...args);request.addEventListener('success',()=>{
  const db=request.result,transaction=db.transaction.bind(db);
  db.transaction=(...args)=>{
   const head=state.arm&&args[1]==='readonly';if(head){state.arm=false;state.events.push('head-begin');state.beforeBegin?.();if(state.mode==='begin-failure')throw new DOMException('Synthetic begin fault','InvalidStateError');}
   const tx=transaction(...args);state.transactions.push({head,mode:args[1]});
   if(head){state.tx=tx;tx.addEventListener('complete',()=>state.events.push('head-complete'));tx.addEventListener('abort',()=>state.events.push('head-abort'));}
   const objectStore=tx.objectStore.bind(tx);tx.objectStore=name=>{
    const store=objectStore(name);
    for(const method of ['put','delete','clear']){const original=store[method].bind(store);store[method]=(...a)=>{state.writes.push({head,method});return original(...a);};}
    if(head){const get=store.get.bind(store);state.headGet=get;store.get=(key)=>{
     if(state.mode==='read-failure')throw new DOMException('Synthetic read fault','UnknownError');
     const reading=get(key);let handler;
     Object.defineProperty(reading,'onsuccess',{configurable:true,get:()=>handler,set(fn){handler=event=>{
      state.events.push('head-read');state.recordSeen=structuredClone(reading.result);state.afterRead?.(tx);
      if(state.mode==='abort-before'){tx.abort();return;}
      fn.call(reading,event);state.afterCallback?.(tx);
      if(state.mode==='abort-after')tx.abort();
     };}});return reading;
    };}
    return store;
   };
   return tx;
  };
 });return request;}};
 return {inner,indexedDB,state};
}
async function nativeConnection(inner){return new Promise((resolve,reject)=>{const r=inner.open('w6-synthetic',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function storedRecords(db){return new Promise((resolve,reject)=>{const tx=db.transaction('generations','readonly'),store=tx.objectStore('generations');let keys,values;
 const k=store.getAllKeys(),v=store.getAll();k.onsuccess=()=>keys=k.result;v.onsuccess=()=>values=v.result;
 tx.oncomplete=()=>resolve(keys.map((key,i)=>[key,values[i]]));tx.onabort=()=>reject(tx.error);
});}
function nativeWriter(db,{record,remove=false,hold=false,events=[]}={}){
 const entered=deferred(),state={release:!hold},tx=db.transaction('generations','readwrite'),store=tx.objectStore('generations');
 const complete=new Promise((resolve,reject)=>{tx.oncomplete=()=>{events.push('writer-complete');resolve();};tx.onabort=()=>reject(tx.error);});
 const request=store.get('active');request.onsuccess=()=>{
  events.push('writer-read');if(remove)store.delete('active');else if(record!==undefined)store.put(record,'active');entered.resolve();
  const keepAlive=()=>{if(state.release)return;const r=store.get('active');r.onsuccess=keepAlive;};keepAlive();
 };
 return {entered:entered.promise,complete,release(){state.release=true;}};
}
async function nextHeadRecord(f,snapshot,revision){const iv=webcrypto.getRandomValues(new Uint8Array(12));
 const aad=new TextEncoder().encode(JSON.stringify(['earned/local-generation/v1',1,f.setup.namespace,revision]));
 const ciphertext=await webcrypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},f.key,new TextEncoder().encode(JSON.stringify(snapshot.generation)));
 return {format:1,namespace:f.setup.namespace,revision,iv,ciphertext};
}
async function headSetup(){const db=headDatabase();const f=await setup({repository:{indexedDB:db.indexedDB},wrapRepository:repo=>({...repo,
 withCurrentHead(expected,fn){db.state.arm=true;return repo.withCurrentHead(expected,fn);}})});return {...f,headDB:db};}
test('atomic head: success is readonly and preserves active previous adoption and every stored collection byte',async()=>{
 const f=await headSetup(),db=await nativeConnection(f.headDB.inner);try{const a=await start(f,await prepare(f));await close(f,a.op_id);const p=await prepare(f);
  const before=await storedRecords(db),snapshot=await f.repo.load();assert(before.some(([key])=>key==='previous'));let calls=0;
  f.headDB.state.transactions=[];f.headDB.state.writes=[];
  const r=await replaceHost(f,replacementCallbacks(()=>{calls++;f.headDB.state.events.push('published');assert.deepEqual(f.headDB.state.recordSeen,before.find(([key])=>key==='active')[1]);}));
  assert.equal(r.replaced,true);assert.equal(calls,1);assert.deepEqual(await storedRecords(db),before);assert.deepEqual(await f.repo.load(),snapshot);
  assert.equal(f.headDB.state.transactions.filter(t=>t.head).length,1);assert(f.headDB.state.transactions.every(t=>t.mode==='readonly'));
  assert.deepEqual(f.headDB.state.writes,[]);assert(f.headDB.state.events.indexOf('published')<f.headDB.state.events.indexOf('head-complete'));
  assert.equal((await start(f,p)).code,'SESSION_CHANGED');
 }finally{db.close();f.repo.close();}
});
for(const change of ['revision','token','missing','malformed'])test(`atomic head: earlier independent ${change} write refuses inside the real readonly transaction`,async()=>{
 const f=await headSetup(),db=await nativeConnection(f.headDB.inner),reader=await f.fresh();let writer;
 try{const p=await prepare(f),snapshot=await f.repo.load();let record;
  if(change==='revision'||change==='token')record=await nextHeadRecord(f,snapshot,snapshot.revision+(change==='revision'?1:0));
  if(change==='malformed')record={format:1,namespace:f.setup.namespace,revision:snapshot.revision,iv:new Uint8Array(1),ciphertext:new ArrayBuffer(16)};
  f.headDB.state.beforeBegin=()=>{writer=nativeWriter(db,{record,remove:change==='missing'});};let calls=0;
  const result=await replaceHost(f,replacementCallbacks(()=>{calls++;}));await writer.complete;
  assert.equal(result.replaced,false);assert.equal(result.code,['revision','token'].includes(change)?'WORKOUT_REPLACEMENT_STALE':'STORED_INTEGRITY_UNPROVEN');assert.equal(calls,0);
  assert.equal(f.headDB.state.events.includes('head-read'),true);assert.equal(result.outcomeUnknown,undefined);
  assert.equal(f.headDB.state.writes.some(w=>w.head),false);
  if(change==='revision'||change==='token'){
   const after=await reader.repository.load();assert.equal(after.revision,record.revision);assert.notEqual(after.token,snapshot.token);assert.deepEqual(after.generation,snapshot.generation);
   assert.equal((await start(f,p)).code,'WORKOUT_PREPARATION_STALE');assert.equal((await prepare(f)).prepared,true); // Refusal did not retire the client.
  }
 }finally{writer?.release();db.close();reader.repository.close();f.repo.close();}
});
test('atomic head: a later independent writer waits for synchronous publication and transaction completion',async()=>{
 const f=await headSetup(),db=await nativeConnection(f.headDB.inner),reader=await f.fresh();let writer;
 try{const snapshot=await f.repo.load(),record=await nextHeadRecord(f,snapshot,snapshot.revision+1),events=f.headDB.state.events;let calls=0;
  f.headDB.state.afterRead=()=>{events.push('writer-scheduled');writer=nativeWriter(db,{record,events});};
  const r=await replaceHost(f,replacementCallbacks(()=>{calls++;events.push('published');assert.equal(events.includes('writer-read'),false);assert.equal(f.headDB.state.recordSeen.revision,snapshot.revision);}));
  assert.equal(r.replaced,true);assert.equal(calls,1);await writer.complete;
  assert(events.indexOf('published')<events.indexOf('head-complete'));assert(events.indexOf('head-complete')<events.indexOf('writer-read'));
  assert.equal((await reader.repository.load()).revision,snapshot.revision+1);assert.equal(f.headDB.state.writes.some(w=>w.head),false);
 }finally{writer?.release();db.close();reader.repository.close();f.repo.close();}
});
for(const change of ['queue','session','observation'])test(`atomic head: ${change} changing while an earlier transaction blocks the read refuses publication`,async()=>{
 const f=await headSetup(),db=await nativeConnection(f.headDB.inner),waiting=deferred();let writer,pendingStart;
 try{const p=await prepare(f),before=await f.repo.load();let calls=0;
  f.headDB.state.beforeBegin=()=>{writer=nativeWriter(db,{hold:true});writer.entered.then(waiting.resolve);};
  const pending=replaceHost(f,replacementCallbacks(()=>{calls++;}));await waiting.promise;
  assert.equal(f.headDB.state.events.includes('head-read'),false);
  if(change==='queue')pendingStart=start(f,p);if(change==='session')f.scope.session++;if(change==='observation')f.scope.observation++;
  writer.release();const result=await pending;await writer.complete;
  assert.equal(result.code,change==='queue'?'WORKOUT_REPLACEMENT_BUSY':change==='session'?'SESSION_CHANGED':'OBSERVATION_CHANGED');assert.equal(calls,0);
  if(pendingStart)assert.equal((await pendingStart).acknowledged,true);
  else{assert.deepEqual(await f.repo.load(),before);f.scope.session=1;f.scope.observation=1;assert.equal((await start(f,p)).acknowledged,true);}
 }finally{writer?.release();db.close();f.repo.close();}
});
for(const failure of ['begin-failure','read-failure','abort-before'])test(`atomic head: ${failure} leaves the old preparation usable and writes nothing`,async()=>{
 const f=await headSetup();try{const p=await prepare(f),before=await f.repo.load();f.headDB.state.mode=failure;
  const r=await expectReplacementRefused(f,{ 'begin-failure':'CURRENT_HEAD_READ_BEGIN_FAILED','read-failure':'CURRENT_HEAD_READ_FAILED','abort-before':'CURRENT_HEAD_READ_ABORTED'}[failure]);
  assert.equal(r.outcomeUnknown,undefined);assert.deepEqual(await f.repo.load(),before);assert.equal(f.headDB.state.writes.some(w=>w.head),false);
  f.headDB.state.mode=null;assert.equal((await start(f,p)).acknowledged,true);
 }finally{f.repo.close();}
});
for(const failure of ['abort-after','close-after'])test(`atomic head: ${failure} after publication is unknown and never revives the old handle`,async()=>{
 const f=await headSetup(),reader=await f.fresh();try{const p=await prepare(f),before=await reader.repository.load(),old=f.c,next=recreate(f);let host=old,calls=0;
  if(failure==='abort-after')f.headDB.state.mode=failure;else f.headDB.state.afterCallback=()=>f.repo.close();
  const result=await replaceHost(f,replacementCallbacks(()=>{calls++;host=next;}));assert.equal(result.replaced,false);assert.equal(result.outcomeUnknown,true);
  assert.equal(result.code,'WORKOUT_REPLACEMENT_PUBLICATION_UNKNOWN');assert.equal(result.publicationCompleted,true);assert.equal(result.oldHandleRetired,true);
  assert.equal(result.failureCode,failure==='abort-after'?'CURRENT_HEAD_READ_ABORTED':'CURRENT_HEAD_CONNECTION_CLOSED');assert.equal(calls,1);assert.equal(host,next);
  assert.equal((await start(f,p)).code,'SESSION_CHANGED');assert.equal((await f.c.replaceIdleWorkoutHost(await replacementBasis({...f,repo:reader.repository}),replacementCallbacks(()=>{calls++;}))).code,'SESSION_CHANGED');
  assert.equal(calls,1);assert.deepEqual(await reader.repository.load(),before);assert.equal(f.headDB.state.writes.some(w=>w.head),false);
 }finally{reader.repository.close();f.repo.close();}
});
test('atomic head: missing capability refuses rather than falling back to a snapshot check',async()=>{
 const f=await setup({wrapRepository:repo=>({...repo,withCurrentHead:undefined})});try{const p=await prepare(f);await expectReplacementRefused(f,'WORKOUT_REPLACEMENT_ATOMIC_HEAD_UNAVAILABLE');assert.equal((await start(f,p)).acknowledged,true);}finally{f.repo.close();}
});
test('atomic head: successful replacement stays pending until the readonly transaction completes',async()=>{
 const f=await headSetup(),entered=deferred();let release=false,settled=false;
 try{const before=await f.repo.load();f.headDB.state.afterCallback=()=>{
   const keepAlive=()=>{if(release)return;const request=f.headDB.state.headGet('active');request.onsuccess=keepAlive;};keepAlive();entered.resolve();
  };
  const pending=replaceHost(f,replacementCallbacks(()=>{})).then(result=>{settled=true;return result;});
  await entered.promise;await new Promise(resolve=>setImmediate(resolve));assert.equal(settled,false);assert.equal(f.headDB.state.events.includes('head-complete'),false);
  release=true;assert.equal((await pending).replaced,true);assert.equal(f.headDB.state.events.includes('head-complete'),true);assert.deepEqual(await f.repo.load(),before);
 }finally{release=true;f.repo.close();}
});
