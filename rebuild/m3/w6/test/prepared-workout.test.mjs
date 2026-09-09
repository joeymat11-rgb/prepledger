import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createDurablePublicClient} from '../public-client.mjs';
import {parseStrictJson} from '../strict-json.mjs';
import {fixture,initial,config,O,createT2Stage,faultDatabase,mutateActive,deferred} from './support.mjs';
import Capture from '../../../m4/workout/capture.cjs';
import Commands from '../../../m4/workout/commands.cjs';
import Schema from '../../../m4/workout/schema.cjs';
import Sign from '../../w5/crypto.cjs';
import Wire from '../../w5/public-client.cjs';
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
 const commands=Commands.createWorkoutCommands({prescriptionCapture:capture});
 const stage=createT2Stage(()=>({...config(),...options.config}),{allowInbound:true,workoutCommands:commands});
 let produced=0,lastCapture;const scope={session:1,observation:1};
 const args={repository:options.wrapRepository?options.wrapRepository(f.repo):f.repo,stage:options.wrapStage?options.wrapStage(stage):stage,
 namespace:f.setup.namespace,athleteId:'ath-1',deviceId:'dev-A',sessionEpoch:1,isCurrentSession:x=>x===scope.session,
 observationEpoch:()=>scope.observation,observationGuard:{run:async(_kind,fn)=>fn()}, // Synthetic, not K1/CLOCK qualification.
 validateCommit:options.validateCommit||(()=>null),keys:[Sign.publicKeyOf(signingKey)],schemaVersion:2,crypto:webcrypto,
 prescriptionCapture:capture,workoutProducerIdentity:identity,
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
