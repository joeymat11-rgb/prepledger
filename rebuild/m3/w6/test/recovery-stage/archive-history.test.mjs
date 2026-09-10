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
   ['local receipt claims cannot replace deleted archive proof',g=>{delete g.metadata.recoveryArchives;delete g.collections.sync.snapshot.recoveryPlan;g.metadata.recoveryReceipts=[{seq:1,op_id:remote.op_id,canonical_content_commitment:remote.canonical_content_commitment}];},'RECOVERY_SNAPSHOT_PROOF_MISSING']  /* This fault deletes the archive proof AND the snapshot binding. Each deletion applied singly already expects RECOVERY_SNAPSHOT_PROOF_MISSING in the cases table below, and every other entry here names its own injected fault. WORKOUT_PREFIX_UNPROVEN was a downstream symptom that only surfaced first while the both-absent branch returned [] silently — the K1 defect itself. The refusal is unchanged: read=false, state=18. */
  ];
  for(const [name,mutate,code]of historyFaults)await t.test('new read/edit path refuses '+name,async()=>{
   const current=await fresh.repository.load(),g=structuredClone(authenticated.generation);mutate(g);
   const b=Client.memoryBackend(g.collections);assert(new Client.Store(b).transaction(()=>{}).ok);g.collections=T2.snapshotBackend(b,Object.keys(g.collections));
   await fresh.repository.commit(current,g);const before=await fresh.repository.load();
   // Guaranteed restoration: a failed assertion here must never leave the
   // shared fixture mutated for the edit/lease cases that run after this loop.
   try{
    const refused=await c.readWorkoutHistory();assert.equal(refused.read,false);assert.equal(refused.state,18);assert.equal(refused.code,code);assert.equal(refused.history,undefined);
    const edit=await c.prepareWorkoutEdit({target_op_id:performed.op_id});assert.notEqual(edit.prepared,true);assert.equal(edit.state,18);assert.equal(edit.code,code);assert.equal(edit.editId,undefined);
    assert.deepEqual(await fresh.repository.load(),before);
   }finally{
    await fresh.repository.commit(await fresh.repository.load(),structuredClone(authenticated.generation));
   }
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
  // Same restoration guarantee as the history-fault loop above.
  try{
   const refused=await createDurablePublicClient({...args,repository:fresh.repository}).prepareLocalRecovery();assert.equal(refused.prepared,false);assert.equal(refused.state,18);assert.equal(refused.code,code);
   assert.deepEqual(await fresh.repository.load(),corrupted);
  }finally{
   await fresh.repository.commit(await fresh.repository.load(),structuredClone(clean.generation));
  }
  assert((await createDurablePublicClient({...args,repository:fresh.repository}).prepareLocalRecovery()).prepared);
 });
 await t.test('session change during real archive open refuses without publishing old truth',async()=>{
  const before=await fresh.repository.load(),repository={...fresh.repository,recovery(options){const store=fresh.repository.recovery(options);return {...store,async openArchive(ref){const archive=await store.openArchive(ref);session=2;return archive;}};}};
  const refused=await createDurablePublicClient({...args,repository}).prepareLocalRecovery();assert.equal(refused.prepared,false);assert.equal(refused.state,17);assert.deepEqual(await fresh.repository.load(),before);
 });
 assert.equal((await newClient.prepareLocalRecovery()).state,17);
});

// ─── K1 correction-02: adoption-bound witnesses and controls ────────────────
// The fixture in the test above cannot serve as the K1 witness: it admits an
// other-device reading AND performs a local weighIn AND a local workout
// start + set, so its generation is neither baseline-only nor zero-workout.
// Each test below builds its OWN generation with no local write at all.
//
//   zero-workout  = no workout rows, but local operations may exist.
//   baseline-only = no local operations at all; every fact came from the
//                   recovered baseline, so the outbox is empty too.
//
// APM's qualified local run established the RED:
//   same-device  -> prepareLocalRecovery returned prepared:true after both
//                   proofs were erased. That is the K1 defect.
//   cross-device -> already refused prepared:false / state 18 via the
//                   documented safe branch LOCAL_HISTORY_IDENTITY_UNPROVEN
//                   (t2-stage.cjs:53). Cross-device was never unsafe.
// Same-device escapes that branch precisely because the recovered originals
// carry THIS device's id, so local-history identity is satisfiable without
// the archive proof.
//
// TERMINAL COMPLETION IS NOT ADOPTION. recovery-stage.mjs:146 states that the
// archive and the terminal page/head are one transaction and NEITHER IS AN
// ACTIVATION; :147 writes the archive at the terminal page. The archive
// therefore exists as soon as the recovery completes, BEFORE any generation
// adopts it — as this fixture itself shows: evidenceReady, then assemble()
// reporting activated:false/complete:false, and only then a separate
// repo.commit. Evidence of adoption is therefore taken from the COMMIT of a
// generation carrying archive proofs, never from the archive's existence.
//
// Controls are independent subtests, and the fault subtest restores in a
// finally, so source-preservation and restoration controls EXECUTE even when
// the fault assertion fails.
//
// Synthetic/test-only boundaries retained: 'synthetic-enrollment-only'
// enrollment evidence, the repository commit as a TEST-ONLY activation
// fixture, R1 issuer at schema 1. No currentness, issuance or activation.

const baselineSpecs = n => Array.from({ length: n }, (_, i) => ({
  seq: i + 1, local_date: '2026-09-0' + (6 + i), lb: 170 + i,
}));

async function enrolledRuntime(t, label) {
  const runtime = await require('./test/r1-workerd.cjs').createR1Runtime({ p1: true });
  t.after(() => runtime.close());
  await runtime.bridge.initializeR1({ first: { plan: { protein_g: 155 }, devices: {} } }, { 'subject-first': 'first' });
  const enroll = async id => (await runtime.bridge.enrollScoped('subject-first', { intent_id: id, schema_version: 1, nonce: hash(id) })).payload.issuance.lease;
  return { runtime, enroll, lease: await enroll(label + '-recovering') };
}

function clientArgs({ runtime, f, lease, keys, scopeDigest, isCurrent }) {
  const device = lease.device_id;
  const cfg = () => ({ ...config(), athleteId: 'first', deviceId: device, identityKey: runtime.identityKeys.first });
  return {
    repository: f.repo, stage: createT2Stage(cfg, { allowInbound: true }), namespace: f.setup.namespace,
    athleteId: 'first', deviceId: device, sessionEpoch: 1, isCurrentSession: isCurrent, observationEpoch: () => 1,
    observationGuard: { run: async (_kind, action) => action() }, validateCommit: () => null, keys, crypto: webcrypto,
    permissionNowIso: () => lease.not_before, recovery: { codec: C, protocol: P, scopeDigest, keyRange: IDBKeyRange },
  };
}

async function enrolledProfile(t, label) {
  const { runtime, enroll, lease } = await enrolledRuntime(t, label);
  const device = lease.device_id, keys = [S.publicKeyOf(runtime.authorityKey)];
  const f = await fixture({ namespace: 'first/' + device });
  t.after(() => f.repo.close());
  const generation = initial(); generation.metadata.authorityLease = lease;
  await f.repo.initialize(generation, 'synthetic-enrollment-only');
  const scopeDigest = C.scopeDigest({ issuer: runtime.issuer.config.issuer, origin: runtime.issuer.config.origins[0], subject: 'subject-first', athleteId: 'first', actorDeviceId: device });
  return { runtime, enroll, lease, device, keys, f, args: clientArgs({ runtime, f, lease, keys, scopeDigest, isCurrent: () => true }) };
}

// Runs an ACTUAL recovery to its terminal page. `adopt:false` stops before the
// commit, leaving the completed archive present but unadopted.
async function baselineOnlyRecovery(t, { sameDevice, label, adopt = true }) {
  const profile = await enrolledProfile(t, label);
  const { runtime, enroll, lease, device, keys, f, args } = profile;
  const producer = sameDevice ? lease : await enroll(label + '-producer');

  const producedBy = new Map();
  for (const spec of baselineSpecs(2)) {
    const op = Ops.build({
      op_id: `${label}-baseline-${spec.seq}`, athlete_id: 'first', device_id: producer.device_id, device_seq: spec.seq,
      parents: [], kind: 'fact', class: 'reading', lease_id: producer.lease_id,
      effective: { local_date: spec.local_date, local_time: '08:00', utc_offset: '-04:00' },
      payload: { lb: { value: spec.lb, unit: 'lb' } },
    }, runtime.identityKeys.first);
    const disposition = await runtime.bridge.invokeScoped('subject-first', producer.device_id, 'admit', ['first', op]);
    assert.equal(disposition.status, 'ACCEPTED', `baseline fact ${op.op_id} must be accepted by the actual authority`);
    producedBy.set(op.op_id, producer.device_id);
  }

  const empty = await f.repo.load();
  assert.deepEqual(Object.keys(empty.generation.collections.ops || {}), [], 'baseline-only precondition: no local operations before recovery');
  assert.deepEqual(Object.keys(empty.generation.collections.outbox || {}), [], 'baseline-only precondition: no local outbox before recovery');

  const prepared = await createDurablePublicClient(args).prepareLocalRecovery();
  assert(prepared.prepared, `baseline-only prepareLocalRecovery must prepare with no local history (code ${prepared.code})`);

  const basis = prepared.basis;
  const stage = f.repo.recovery({ codec: C, protocol: P, verificationKeys: keys, keyRange: IDBKeyRange, validateContext: () => null });
  const verifier = P.createRowsVerifier({ keys, subtle: webcrypto.subtle });
  const result = await createRowsRecovery({
    stage, codec: C, protocol: P,
    newRequest: async () => basis.request({ nonce: hash(label + '-request'), contextId: hash(label + '-context') }),
    expected: request => basis.expected(request),
    fetchPage: createRowsFetcher({ baseURL: runtime.url, codec: C, protocol: P, headers: async () => ({ Origin: runtime.issuer.config.origins[0], Authorization: 'Bearer ' + runtime.issuer.token('subject-first') }) }),
    observeNegative: async (reply, context) => assert((await verifier.verify(reply.bodyBytes, { expected: context.expected, previousCursor: context.previousCursor })).verified),
    validateProfile: input => basis.reconcile(input),
  }).run();
  assert(result.evidenceReady, result.reason);

  // The terminal archive now exists. assemble() still reports activated:false
  // and complete:false — completion is not adoption.
  const before = await f.repo.load();
  let candidate; const held = await result.evidence.assemble(); await held.inspect(g => { candidate = g; });
  assert.equal(held.activated, false); assert.equal(held.complete, false);

  const ctx = { ...profile, producer, producedBy, before, candidate };
  if (!adopt) return ctx;
  await f.repo.commit(before, candidate);
  return { ...ctx, recovered: await f.repo.load() };
}

function assertBaselineOnly(recovered, { producedBy, device, sameDevice }) {
  const g = recovered.generation;
  const ops = g.collections.ops || {}, outbox = g.collections.outbox || {};
  const shape = {
    frontierW: g.collections.sync?.frontier?.W ?? null,
    recoveredPlanW: g.collections.sync?.snapshot?.recoveryPlan?.W ?? null,
    acceptedOperationIds: Object.keys(ops).sort(),
    outboxIds: Object.keys(outbox).sort(),
    factDevices: Object.fromEntries(Object.entries(ops).map(([id, op]) => [id, op.device_id])),
    classes: [...new Set(Object.values(ops).map(op => op.class))].sort(),
    archiveProofs: (g.metadata.recoveryArchives || []).length,
    recoveryPlanProfile: g.collections.sync?.snapshot?.recoveryPlan?.profile ?? null,
  };
  assert.deepEqual(shape.outboxIds, [], 'baseline-only: recovered generation carries no local outbox entry');
  assert.deepEqual(shape.acceptedOperationIds, [...producedBy.keys()].sort(), 'baseline-only: retained ops are exactly the admitted baseline facts');
  assert.deepEqual(shape.classes, ['reading'], 'no workout prefix: only reading facts were recovered');
  for (const [id, op] of Object.entries(ops)) {
    assert.equal(op.payload?.session_start_op_id, undefined, 'no workout prefix: no set row');
    assert.equal(op.device_id, producedBy.get(id), `fact ${id} keeps its producing device`);
    if (sameDevice) assert.equal(op.device_id, device, 'same-device recovery: the recovering device produced this fact');
    else assert.notEqual(op.device_id, device, 'cross-device baseline: another device produced this fact');
  }
  assert.equal(shape.archiveProofs, 1, 'genuinely recovered: one archive proof written by prepareRecoveryProjection');
  assert.equal(shape.recoveryPlanProfile, 'earned/recovered-plan-snapshot/v1', 'genuinely recovered: snapshot binding written by the product');
  assert(Number.isSafeInteger(shape.frontierW) && shape.frontierW >= shape.recoveredPlanW, 'frontier covers the recovered source plan');
  return shape;
}

async function commitMutated(repo, cleanGeneration, mutate) {
  const current = await repo.load(), changed = structuredClone(cleanGeneration);
  mutate(changed);
  const b = Client.memoryBackend(changed.collections);
  assert(new Client.Store(b).transaction(() => {}).ok);
  changed.collections = T2.snapshotBackend(b, Object.keys(changed.collections));
  await repo.commit(current, changed);
  return repo.load();
}

for (const sameDevice of [false, true]) {
  const label = sameDevice ? 'same-device' : 'cross-device';
  test(`baseline-only ${label} recovery: both-proof loss cannot regain permission`, async t => {
    const ctx = await baselineOnlyRecovery(t, { sameDevice, label });
    const { f, args, producedBy, device } = ctx;
    const shape = assertBaselineOnly(ctx.recovered, { producedBy, device, sameDevice });
    assert.equal(shape.acceptedOperationIds.length, 2, 'two baseline facts recovered');
    const clean = await f.repo.load();

    await t.test('positive control: authentic recovered generation still prepares', async () => {
      const again = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
      assert(again.prepared, `authentic recovered baseline must still prepare (code ${again.code})`);
      assert.deepEqual(await f.repo.load(), clean, 'a positive preparation publishes nothing');
    });

    await t.test('K1 fault: erasing BOTH proofs must not downgrade recovered truth', async () => {
      let erased;
      try {
        erased = await commitMutated(f.repo, clean.generation, g => {
          delete g.metadata.recoveryArchives;
          delete g.collections.sync.snapshot.recoveryPlan;
        });
        const refused = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
        assert.equal(refused.prepared, false, 'baseline-only recovered truth with both proofs erased must refuse');
        assert.equal(refused.state, 18);
        // The adoption evidence written with the adopting commit survives the
        // erasure, so both branches now refuse here. Unrepaired, cross-device
        // still refused safely one layer later with
        // LOCAL_HISTORY_IDENTITY_UNPROVEN and same-device did not refuse.
        assert.equal(refused.code, 'RECOVERY_SNAPSHOT_PROOF_MISSING');
        assert.deepEqual(await f.repo.load(), erased, 'a refusal publishes nothing');
      } finally {
        if (erased) await f.repo.commit(await f.repo.load(), structuredClone(clean.generation));
      }
    });

    await t.test('restoration control: the same source restores and prepares again', async () => {
      const restored = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
      assert(restored.prepared, `restored source must prepare again (code ${restored.code})`);
      const now = await f.repo.load();
      assert.deepEqual(now.generation.collections.outbox || {}, {}, 'outbox unchanged by the fault cycle');
      assert.deepEqual(Object.keys(now.generation.collections.ops || {}).sort(), shape.acceptedOperationIds, 'retained originals unchanged by the fault cycle');
      assert.equal((now.generation.metadata.recoveryArchives || []).length, 1, 'archive proof restored');
    });
  });
}

test('completed terminal recovery that was never committed does not block the ordinary generation', async t => {
  // recovery-stage.mjs:146 — the archive and the terminal head are one
  // transaction and NEITHER IS AN ACTIVATION. The archive exists now; nothing
  // has adopted it. The ordinary generation must stay usable AND unchanged.
  const { f, args, before } = await baselineOnlyRecovery(t, { sameDevice: true, label: 'terminal-uncommitted', adopt: false });
  assert.deepEqual(await f.repo.load(), before, 'a completed but uncommitted recovery publishes nothing');
  const prepared = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
  assert(prepared.prepared, `a terminal-but-uncommitted recovery must not block the profile (code ${prepared.code})`);
  assert.deepEqual(await f.repo.load(), before, 'the prior ordinary generation is unchanged');
  assert((await createDurablePublicClient({ ...args, repository: f.repo }).execute('weighIn', { lb: 173 })).acknowledged, 'ordinary writer keeps working');
});

test('failed adoption leaves the prior ordinary generation usable and unchanged', async t => {
  // Adoption evidence is written inside the SAME transaction as the active
  // record, so a refused commit writes neither. An abandoned or failed
  // adoption of a completed recovery must not block anything.
  const { f, args, before, candidate } = await baselineOnlyRecovery(t, { sameDevice: true, label: 'failed-adoption', adopt: false });
  await assert.rejects(
    f.repo.commit(before, candidate, () => ({ code: 'SYNTHETIC_ADOPTION_REFUSED', state: 18 })),
    error => error.code === 'SYNTHETIC_ADOPTION_REFUSED');
  assert.deepEqual(await f.repo.load(), before, 'a refused adoption publishes nothing');
  const prepared = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
  assert(prepared.prepared, `a failed adoption must not block the prior generation (code ${prepared.code})`);
  assert.deepEqual(await f.repo.load(), before, 'the prior ordinary generation is unchanged');
  assert((await createDurablePublicClient({ ...args, repository: f.repo }).execute('weighIn', { lb: 174 })).acknowledged, 'ordinary writer keeps working');
});

test('ordinary never-recovered profile stays usable and is never blocked', async t => {
  const { f, args } = await enrolledProfile(t, 'never-recovered');
  const client = createDurablePublicClient(args);
  assert((await client.execute('weighIn', { lb: 170 })).acknowledged, 'ordinary local write works');
  const prepared = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
  assert(prepared.prepared, `never-recovered profile must still prepare (code ${prepared.code})`);
  const live = await f.repo.load();
  assert.equal(live.generation.metadata.recoveryArchives, undefined, 'never-recovered: no archive proof exists');
  assert.equal(live.generation.collections.sync?.snapshot?.recoveryPlan, undefined, 'never-recovered: no snapshot binding exists');
  assert((await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery()).prepared, 'never-recovered profile is not blanket-blocked');
  assert((await createDurablePublicClient({ ...args, repository: f.repo }).execute('weighIn', { lb: 171 })).acknowledged, 'ordinary writer keeps working');
});

test('an incomplete recovery attempt never blocks a profile', async t => {
  // A basis is prepared, so an attempt exists, but the recovery is never run
  // to a terminal page and nothing is committed. No adoption evidence exists.
  const { f, args } = await enrolledProfile(t, 'incomplete-attempt');
  assert((await createDurablePublicClient(args).execute('weighIn', { lb: 169 })).acknowledged);
  const attempt = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
  assert(attempt.prepared, `attempt must prepare (code ${attempt.code})`);
  const after = await createDurablePublicClient({ ...args, repository: f.repo }).prepareLocalRecovery();
  assert(after.prepared, `an incomplete attempt must not block the profile (code ${after.code})`);
  assert((await createDurablePublicClient({ ...args, repository: f.repo }).execute('weighIn', { lb: 170 })).acknowledged, 'ordinary writer still works after an incomplete attempt');
});

test('active and adoption records are sealed from ONE snapshot despite caller mutation', async t => {
  // The commit path seals two records. If the active record were sealed from a
  // clone and the adoption record then read the caller's still-mutable
  // generation, a caller mutating between the two awaits would produce records
  // describing DIFFERENT generations. The clone is taken once, synchronously,
  // before any await, so both records must describe the same snapshot.
  const { f } = await baselineOnlyRecovery(t, { sameDevice: true, label: 'snapshot-divergence' });
  const clean = await f.repo.load();
  const proof = clean.generation.metadata.recoveryArchives[0];
  const originalAttempt = proof.reference.attempt;
  assert.equal(typeof originalAttempt, 'string');
  assert(originalAttempt.length > 0, 'the adopted archive reference carries an attempt id');

  const live = structuredClone(clean.generation);
  const current = await f.repo.load();
  // Start the commit but do NOT await: the synchronous prefix (including the
  // clone) has run, and the seals are still pending.
  const pending = f.repo.commit(current, live);
  // Mutate the caller's object while those seals are in flight. A second read
  // of `live` after the first await would capture this substituted reference.
  const substituted = 'ffffffffffffffffffffffffffffffff';
  live.metadata.recoveryArchives = [{ ...proof, reference: { ...proof.reference, attempt: substituted } }];
  live.metadata.mutatedDuringSeal = true;
  await pending;

  const stored = await f.repo.load();
  const adoption = await f.repo.recoveryAdoption();
  assert(adoption, 'the adopting commit wrote adoption evidence');

  // Both records describe the pre-mutation snapshot.
  assert.equal(stored.generation.metadata.recoveryArchives[0].reference.attempt, originalAttempt,
    'active record describes the snapshot taken at call time');
  assert.equal(stored.generation.metadata.mutatedDuringSeal, undefined,
    'the caller mutation did not reach the sealed active record');
  assert.deepEqual(adoption.references.map(reference => reference.attempt), [originalAttempt],
    'adoption record describes the SAME snapshot as the active record, not the mutated caller object');
  assert.notEqual(adoption.references[0].attempt, substituted,
    'the substituted reference never became adoption evidence');
  assert.equal(adoption.revision, stored.revision,
    'both records were sealed at the same revision');
});
