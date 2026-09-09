import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {IDBKeyRange} from 'fake-indexeddb';
import {fixture,initial,config,createT2Stage,Client} from '../support.mjs';
import {createDurablePublicClient} from '../../public-client.mjs';
import {createRowsRecovery,createRowsFetcher} from '../../recovery-transport.mjs';
import T2 from '../../t2-stage.cjs';
import Capture from '../../../../m4/workout/capture.cjs';
import Commands from '../../../../m4/workout/commands.cjs';
import {parseStrictJson} from '../../strict-json.mjs';
if(!process.env.EARNED_ROWS_R1_ROOT)throw Error('Use the pinned recovery runner');
const require=createRequire(resolve(process.env.EARNED_ROWS_R1_ROOT,'rebuild/m3/w5/package.json'));
const C=require('./reconciliation/codec.cjs'),P=require('./reconciliation/paged-codec.cjs'),S=require('./crypto.cjs'),Ops=require('../../client/ops.cjs');
const hash=x=>P.hash('archive-history-test',x);

test('archive original authentication joins the actual public client across repository reopen',async t=>{
 const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});t.after(()=>runtime.close());
 await runtime.bridge.initializeR1({first:{plan:{protein_g:155},devices:{}}},{'subject-first':'first'});
 const enroll=async id=>(await runtime.bridge.enrollScoped('subject-first',{intent_id:id,schema_version:1,nonce:hash(id)})).payload.issuance.lease;
 const lease=await enroll('archive-A'),other=await enroll('archive-B'),device=lease.device_id,keys=[S.publicKeyOf(runtime.authorityKey)];
 const remote=Ops.build({op_id:'synthetic-other-device-reading',athlete_id:'first',device_id:other.device_id,device_seq:1,parents:[],kind:'fact',class:'reading',lease_id:other.lease_id,
  effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:{lb:{value:172,unit:'lb'}}},runtime.identityKeys.first);
 const disposition=await runtime.bridge.invokeScoped('subject-first',other.device_id,'admit',['first',remote]);assert.equal(disposition.status,'ACCEPTED');
 const f=await fixture({namespace:'first/'+device});t.after(()=>f.repo.close());const generation=initial();generation.metadata.authorityLease=lease;await f.repo.initialize(generation,'synthetic-enrollment-only');
 let session=1;const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:device});
 const cfg=()=>({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first});
 const capture=Capture.createPrescriptionCapture({parseStrictJson});
 const identity={app_build:'synthetic-app',engine_build:'synthetic-engine',rule_profile:'synthetic-rule',source_schema:'synthetic-source'};
 let produced=0,resumeAssessed=0,basisResolved=0;
 const args={repository:f.repo,stage:createT2Stage(cfg,{allowInbound:true}),namespace:f.setup.namespace,athleteId:'first',deviceId:device,sessionEpoch:1,isCurrentSession:x=>session===x,observationEpoch:()=>1,
  observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys,crypto:webcrypto,permissionNowIso:()=>lease.not_before,recovery:{codec:C,protocol:P,scopeDigest,keyRange:IDBKeyRange}};
 const client=createDurablePublicClient(args);assert((await client.execute('weighIn',{lb:170})).acknowledged);
 // Local schema2 writer capability is deliberately synthetic. The actual R1
 // issuer stays schema1, and these workout originals are never admitted there.
 // This proves retained pending workouts can join a real recovered prefix;
 // it is not schema2 issuance/activation or accepted-workout recovery evidence.
 const syntheticLease=S.signLease({...lease,schema_version:2},runtime.authorityKey);
 const replaceLease=async(repository,value)=>{const loaded=await repository.load(),g=structuredClone(loaded.generation);g.metadata.authorityLease=value;await repository.commit(loaded,g);};
 const commands=Commands.createWorkoutCommands({prescriptionCapture:capture}),unknown=()=>({state:'unknown',display:'Unknown',source_json:null});
 const workoutArgs={...args,stage:createT2Stage(cfg,{allowInbound:true,workoutCommands:commands}),schemaVersion:2,prescriptionCapture:capture,workoutProducerIdentity:identity,
  resolveWorkoutBasis:()=>({plan_basis:'synthetic-plan',input_basis:'synthetic-input',causal_parents:[]}),
  workoutProducer:(_g,context)=>({profile:capture.profile,producer:context.producer,basis:context.basis,session:{instruction:unknown(),reason:unknown(),confidence:unknown()},
   slots:[0,1].map(i=>({logical_set_slot:'synthetic-slot-'+i,lift_lineage_id:'synthetic-lift',label:'Synthetic lift',load:unknown(),reps:unknown(),effort:unknown(),setup:unknown(),reason:unknown(),confidence:unknown()}))})};
 await replaceLease(f.repo,syntheticLease);const writer=createDurablePublicClient(workoutArgs),preparedWorkout=await writer.prepareWorkout({planned_split_slot_id:'synthetic-workout'});assert(preparedWorkout.prepared,preparedWorkout.code);
 const started=await writer.startPreparedWorkout({preparedId:preparedWorkout.preparedId});assert(started.acknowledged,started.code);
 const performed=await writer.execute('workout',{action:'set',input:{session_start_op_id:started.op_id,logical_set_slot:'synthetic-slot-0',lift_lineage_id:'synthetic-lift',load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{tag:'at_least',value:3,unit:'rep'}}});assert(performed.acknowledged,performed.code);
 const originalStart=(await f.repo.load()).generation.collections.ops[started.op_id];
 await replaceLease(f.repo,lease);const before=await f.repo.load();
 const p=await client.prepareLocalRecovery();assert(p.prepared,p.code);const basis=p.basis,stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null}),verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle});
 let submittedBytes;
 const result=await createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>basis.request({nonce:hash('request'),contextId:hash('context')}),expected:req=>basis.expected(req),
  fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),
  observeNegative:async(reply,context)=>assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified),validateProfile:input=>{submittedBytes=input.requestBytes;return basis.reconcile(input);}}).run();
 assert(result.evidenceReady,result.reason);let proof;
 await t.test('archive proof retains exact request bytes after caller buffer mutation',async()=>{
  const original=C.bytes(submittedBytes);submittedBytes.fill(0);proof=await result.evidence.archiveProof();assert(C.sameBytes(C.decode64(proof.request_bytes_b64,C.LIMITS.request),original));submittedBytes.set(original);
 });assert.deepEqual(await f.repo.load(),before);
 // Actual inactive assembler; the repository commit below is a TEST-ONLY
 // activation fixture, not a production current-standing or K1 protocol.
 let candidate;const held=await result.evidence.assemble();await held.inspect(g=>{candidate=g;});
 assert.equal(held.activated,false);assert.equal(held.complete,false);
 await stage.start({expected:(await(await stage.inventory()).bindings()).expected,explicitRetry:true});await assert.rejects(result.evidence.archiveProof(),e=>e.code==='RECOVERY_STAGE_CHANGED');
 await f.repo.commit(before,candidate);const loaded=await f.repo.load();assert.deepEqual(loaded.generation.collections.outbox,before.generation.collections.outbox);
 const fresh=await f.fresh();t.after(()=>fresh.repository.close());const newClient=createDurablePublicClient({...args,repository:fresh.repository});
 const authenticated=await newClient.prepareLocalRecovery();assert(authenticated.prepared,authenticated.code);
 const recovered=await fresh.repository.load(),reader=Client.createClient({...cfg(),backend:Client.memoryBackend(recovered.generation.collections)});reader.boot();
 assert.deepEqual(reader.plan(),{protein_g:155},'Actual rebuilt source plan survives authenticated fresh boot');
 assert((await newClient.execute('weighIn',{lb:171})).acknowledged,'Existing writer works with authenticated historical originals under synthetic standing');
 const clean=await fresh.repository.load();assert.deepEqual(clean.generation.collections.ops[remote.op_id],remote);
 await t.test('real archive prefix joins retained pending workout history and correction on reopen',async t=>{
  await replaceLease(fresh.repository,syntheticLease);
  const c=createDurablePublicClient({...workoutArgs,repository:fresh.repository});
  const read=await c.readWorkoutHistory();assert.equal(read.read,true,read.code);
  const session=read.history.sessions.find(s=>s.start.operation.op_id===started.op_id);assert(session);
  assert.deepEqual(session.original,originalStart.prescription_capture);assert.equal(session.start.status,'stored-on-this-device');
  assert.deepEqual(session.projection.facts[0].current.reserve,{tag:'at_least',value:3,unit:'rep'});
  const authenticated=await fresh.repository.load();
  const historyFaults=[
   ['changed archived original',g=>{g.collections.ops[remote.op_id].payload.lb.value=999;},'RECOVERY_ARCHIVE_ORIGINAL_CHANGED'],
   ['missing archived original',g=>{delete g.collections.ops[remote.op_id];},'RECOVERY_ARCHIVE_ORIGINAL_MISSING'],
   ['conflicting receipt index',g=>{g.collections.receipts['1'].canonical_content_commitment='invented';},'WORKOUT_PREFIX_UNPROVEN'],
   ['changed pending workout original',g=>{g.collections.ops[performed.op_id].payload.reps.value=99;},'LOCAL_HISTORY_IDENTITY_UNPROVEN'],
   ['local receipt claims cannot replace deleted archive proof',g=>{delete g.metadata.recoveryArchives;delete g.collections.sync.snapshot.recoveryPlan;g.metadata.recoveryReceipts=[{seq:1,op_id:remote.op_id,canonical_content_commitment:remote.canonical_content_commitment}];},'WORKOUT_PREFIX_UNPROVEN']
  ];
  for(const [name,mutate,code]of historyFaults)await t.test('new read/edit path refuses '+name,async()=>{
   const current=await fresh.repository.load(),g=structuredClone(authenticated.generation);mutate(g);
   const b=Client.memoryBackend(g.collections);assert(new Client.Store(b).transaction(()=>{}).ok);g.collections=T2.snapshotBackend(b,Object.keys(g.collections));
   await fresh.repository.commit(current,g);const before=await fresh.repository.load();
   const refused=await c.readWorkoutHistory();assert.equal(refused.read,false);assert.equal(refused.state,18);assert.equal(refused.code,code);assert.equal(refused.history,undefined);
   const edit=await c.prepareWorkoutEdit({target_op_id:performed.op_id});assert.notEqual(edit.prepared,true);assert.equal(edit.state,18);assert.equal(edit.code,code);assert.equal(edit.editId,undefined);
   assert.deepEqual(await fresh.repository.load(),before);await fresh.repository.commit(before,structuredClone(authenticated.generation));
  });
  const edit=await c.prepareWorkoutEdit({target_op_id:performed.op_id});assert(edit.prepared,edit.code);
  const saved=await c.commitWorkoutEdit({editId:edit.editId,action:'correct',change:{reps:{value:9,unit:'rep'}}});assert(saved.acknowledged,saved.code);
  const reopened=await f.fresh();try{
   const again=await createDurablePublicClient({...workoutArgs,repository:reopened.repository}).readWorkoutHistory();assert(again.read,again.code);
   const fact=again.history.sessions[0].projection.facts[0];assert.equal(fact.current.reps.value,9);assert.equal(fact.original.reps.value,8);assert.deepEqual(fact.edit_op_ids,[saved.op_id]);
  }finally{reopened.repository.close();}
  // The same position may also arrive in an ordinary signed pull. It must
  // agree with the archive, and must not duplicate or discard pending facts.
  const pulled=await runtime.request('/pull',{device_id:device,after:0},'subject-first');assert.equal(pulled.status,200);
  const received=await c.acceptResponse('pull',{wireVersion:require('./public-client.cjs').WIRE_VERSION,body:pulled.body});assert(received.accepted,received.code);
  const mixed=await c.readWorkoutHistory();assert(mixed.read,mixed.code);assert.equal(mixed.history.frontier,1);assert.equal(mixed.history.sessions.length,1);
  assert.equal(mixed.history.sessions[0].projection.facts[0].current.reps.value,9);
  // Restore the existing test-only generation for the independent fault table.
  const current=await fresh.repository.load();await fresh.repository.commit(current,structuredClone(clean.generation));
 });
 await t.test('historical recovery refuses current workout production and resume assessment before granting a lease',async()=>{
  // Pinned R1 issuer enrolls schema1 only. Configure the schema2 consumer to
  // prove the historical-view refusal precedes any schema/lease grant. This
  // does not claim a qualified schema2 issuance or a resumed workout story.
  const workoutClient=createDurablePublicClient({...args,repository:fresh.repository,schemaVersion:2,prescriptionCapture:capture,workoutProducerIdentity:identity,
   resolveWorkoutBasis:()=>{basisResolved++;throw Error('Unexpected basis');},workoutProducer:()=>{produced++;throw Error('Unexpected producer');},
   workoutResumePolicy:()=>{resumeAssessed++;throw Error('Unexpected current resume assessment');}});
  const counts=[produced,basisResolved,resumeAssessed],before=await fresh.repository.load();
  for(const result of [await workoutClient.prepareWorkout({planned_split_slot_id:'synthetic-slot'}),await workoutClient.prepareWorkoutContinuation({session_start_op_id:'synthetic-start'})]){
   assert.equal(result.code,'RECOVERY_PROJECTION_REQUIRED');assert.notEqual(result.prepared,true);assert.equal(result.state,18);
  }
  assert.deepEqual([produced,basisResolved,resumeAssessed],counts,'No current producer, basis resolver or resume assessor called');
  assert.deepEqual(await fresh.repository.load(),before,'Preparations publish no recovery generation');
 });
 for(const [id,entry]of Object.entries(before.generation.collections.outbox))assert.deepEqual(clean.generation.collections.outbox[id],entry);
 const cases=[
  ['injected cached instruction refuses',g=>{g.collections.sync.snapshot.instruction='Add another set today';},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['injected derived trend refuses',g=>{g.collections.sync.snapshot.trend=171;},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['unknown extra projection refuses',g=>{g.collections.sync.snapshot.futureProjection={current:true};},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['changed archived original refuses',g=>{g.collections.ops[remote.op_id].payload.lb.value=999;},'RECOVERY_ARCHIVE_ORIGINAL_CHANGED'],
  ['missing accepted archived original refuses',g=>{delete g.collections.ops[remote.op_id];},'RECOVERY_ARCHIVE_ORIGINAL_MISSING'],
  ['missing archive proof refuses recovered snapshot',g=>{delete g.metadata.recoveryArchives;},'RECOVERY_SNAPSHOT_PROOF_MISSING'],
  ['changed recovered plan refuses',g=>{g.collections.sync.snapshot.plan.protein_g=999;},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['invented recovered transaction refuses',g=>{g.collections.sync.snapshot.planTransactionIds=['invented'];},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['invented transaction source refuses',g=>{g.collections.sync.snapshot.planTransactionSources=[{txn_id:'invented',op_id:remote.op_id}];},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['invented suspension coverage refuses',g=>{g.collections.sync.snapshot.planSuspendedTransactionIds=['invented'];},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['invented historical proposal basis refuses',g=>{g.collections.sync.snapshot.planBasis='invented';},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['invented historical version refuses',g=>{g.collections.sync.snapshot.planVersion='invented';},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['invented historical provenance refuses',g=>{g.collections.sync.snapshot.planProvenance='invented';},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['changed source frontier refuses',g=>{g.collections.sync.snapshot.recoveryPlan.W=0;},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['changed source archive refuses',g=>{g.collections.sync.snapshot.recoveryPlan.reference.attempt='invented';},'RECOVERY_SNAPSHOT_DISAGREEMENT'],
  ['empty archive list refuses',g=>{g.metadata.recoveryArchives=[];},'RECOVERY_SNAPSHOT_PROOF_MISSING'],
  ['missing snapshot binding refuses',g=>{delete g.collections.sync.snapshot.recoveryPlan;},'RECOVERY_SNAPSHOT_PROOF_MISSING'],
  ['replaced snapshot refuses',g=>{g.collections.sync.snapshot={plan:{protein_g:999}};},'RECOVERY_SNAPSHOT_PROOF_MISSING'],
  ['foreign archive scope refuses',g=>{g.metadata.recoveryArchives[0].expected.actorDeviceId=other.device_id;},'RECOVERY_ARCHIVE_SCOPE'],
  ['replaced request bytes cannot borrow a valid archive',g=>{const req=C.decodeRequest(C.decode64(proof.request_bytes_b64,C.LIMITS.request));req.nonce=hash('wrong');g.metadata.recoveryArchives[0].request_bytes_b64=C.encode64(C.encode(req));},'RETAINED_INTEGRITY'],
 ];
 for(const [name,change,code]of cases)await t.test(name,async()=>{
  const current=await fresh.repository.load(),changed=structuredClone(clean.generation);change(changed);
  // Maintain the real Store checkpoint so this reaches identity/proof checking,
  // rather than claiming an earlier count-only failure tested the target guard.
  const b=Client.memoryBackend(changed.collections);assert(new Client.Store(b).transaction(()=>{}).ok);changed.collections=T2.snapshotBackend(b,Object.keys(changed.collections));
  await fresh.repository.commit(current,changed);const corrupted=await fresh.repository.load();
  const refused=await createDurablePublicClient({...args,repository:fresh.repository}).prepareLocalRecovery();assert.equal(refused.prepared,false);assert.equal(refused.state,18);assert.equal(refused.code,code);
  assert.deepEqual(await fresh.repository.load(),corrupted);await fresh.repository.commit(corrupted,structuredClone(clean.generation));
  assert((await createDurablePublicClient({...args,repository:fresh.repository}).prepareLocalRecovery()).prepared);
 });
 await t.test('session change during real archive open refuses without publishing old truth',async()=>{
  const before=await fresh.repository.load(),repository={...fresh.repository,recovery(options){const store=fresh.repository.recovery(options);return {...store,async openArchive(ref){const archive=await store.openArchive(ref);session=2;return archive;}};}};
  const refused=await createDurablePublicClient({...args,repository}).prepareLocalRecovery();assert.equal(refused.prepared,false);assert.equal(refused.state,17);assert.deepEqual(await fresh.repository.load(),before);
 });
 assert.equal((await newClient.prepareLocalRecovery()).state,17);
});
