import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {IDBKeyRange} from 'fake-indexeddb';
import {fixture,initial,config,createT2Stage} from '../support.mjs';
import {createDurablePublicClient} from '../../public-client.mjs';
import {createRowsRecovery,createRowsFetcher} from '../../recovery-transport.mjs';
import {parseStrictJson} from '../../strict-json.mjs';
import {createReadingProjector} from '../../reading-history.mjs';
if(!process.env.EARNED_ROWS_R1_ROOT||!process.env.EARNED_IMPORT_M4_ROOT)throw Error('Use run-source-import.cjs');
const require=createRequire(resolve(process.env.EARNED_ROWS_R1_ROOT,'rebuild/m3/w5/package.json'));
const C=require('./reconciliation/codec.cjs'),BaseP=require('./reconciliation/paged-codec.cjs'),P=BaseP.createSourceRowsCodec();
const S=require('./source/codec.cjs'),Sign=require('./crypto.cjs'),Ops=require('../../client/ops.cjs');
const hash=value=>P.hash('source-recovery-test',value);

test('actual prepared source, encrypted W6 custody, R1 binding and indexed recovery preserve pending work through rollback/reopen',async t=>{
  const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true,sourceProfile:S.PROFILE});t.after(()=>runtime.close());
  await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
  const enroll=async intent_id=>(await runtime.bridge.enrollScoped('subject-first',{intent_id,schema_version:1,nonce:hash(intent_id)})).payload.issuance.lease;
  const localLease=await enroll('local'),remoteLease=await enroll('remote'),device=localLease.device_id;
  const keys=[Sign.publicKeyOf(runtime.authorityKey)],f=await fixture({namespace:'first/'+device});t.after(()=>f.repo.close());
  const generation=initial();generation.metadata.authorityLease=localLease;await f.repo.initialize(generation,'synthetic-enrollment-only');
  const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:device});
  const recovery={codec:C,protocol:P,protocols:[BaseP,P],sourceCodec:S,scopeDigest,keyRange:IDBKeyRange};
  const args={repository:f.repo,stage:createT2Stage(()=>({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first}),{allowInbound:true}),
    namespace:f.setup.namespace,athleteId:'first',deviceId:device,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
    observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys,crypto:webcrypto,permissionNowIso:()=>localLease.not_before,recovery,
    projectReadings:createReadingProjector({athleteId:'first',deviceId:device})};
  let client=createDurablePublicClient(args),repo=f.repo;
  // Preserve an actual old v3 archive before the source-enabled transition.
  // This read uses the real old D1/P1 reader directly; new source recovery below
  // uses workerd HTTP. No old schema/record is rewritten to a new profile.
  const oldClient=createDurablePublicClient({...args,recovery:{...recovery,protocol:BaseP}});
  const oldPrepared=await oldClient.prepareLocalRecovery();assert(oldPrepared.prepared,oldPrepared.code);const oldBasis=oldPrepared.basis;
  const oldStage=repo.recovery({codec:C,protocol:BaseP,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null});
  const oldReader=require('./reconciliation/paged-bridge.cjs').createPagedBridge({db:runtime.db,authorityKey:runtime.authorityKey,
    storage:{...runtime.storage,sourceProfile:undefined},r1:{issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0]}});
  const oldVerifier=BaseP.createRowsVerifier({keys,subtle:webcrypto.subtle});
  const oldRecovery=await createRowsRecovery({stage:oldStage,codec:C,protocol:BaseP,newRequest:async()=>oldBasis.request({nonce:hash('old'),contextId:hash('old-context')}),
    expected:req=>oldBasis.expected(req),fetchPage:async body=>({status:200,bodyBytes:C.encode(await oldReader.read('subject-first',C.encode(body),
      {issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0]}))}),
    observeNegative:async(reply,context)=>{assert((await oldVerifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified);},
    validateProfile:input=>oldBasis.reconcile(input)}).run();
  assert(oldRecovery.evidenceReady,oldRecovery.reason);
  const oldProof=await oldRecovery.evidence.archiveProof();assert.equal(oldProof.profile,'earned/local-recovery-proof/v1');
  const originalBudget=await oldStage.attemptPersistence().load();
  const newBudget=repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null}).attemptPersistence();
  assert.deepEqual(await newBudget.load(),originalBudget,'Protocol change preserves the original recovery attempt accounting');
  const oldCandidate=await oldRecovery.evidence.assemble();let oldGeneration;await oldCandidate.inspect(g=>{oldGeneration=g;});
  await repo.commit(await repo.load(),oldGeneration);
  const missingRegistry=await createDurablePublicClient({...args,recovery:{...recovery,protocols:[P]}}).prepareLocalRecovery();
  assert.equal(missingRegistry.prepared,false);assert.equal(missingRegistry.code,'RECOVERY_ARCHIVE_PROTOCOL_UNAVAILABLE');
  const sourceId='synthetic-engine-source',before=await repo.load();
  const m4=process.env.EARNED_IMPORT_M4_ROOT;
  const {createEngine}=require(resolve(m4,'rebuild/engine/index.cjs'));
  const F=require(resolve(m4,'rebuild/m3/w7-preview/fixtures.cjs'));
  const sourceDay='2026-09-01',engineFor=({day,hour})=>createEngine({clock:{today:()=>day,nowISO:()=>day+'T12:00:00.000Z',hour:()=>hour},ids:{fresh:p=>p+'synthetic'}});
  const engine=engineFor({day:sourceDay,hour:12});
  const original=new TextEncoder().encode(JSON.stringify(F.createSyntheticState(sourceDay),null,2)+'\r\n');
  const prepared=require(resolve(m4,'rebuild/m4/import/prepare.cjs')).createImportPreparation({engine,parseStrictJson}).prepare(original,{localBytes:original});
  const custody=repo.importCustody({parseStrictJson,validateContext:()=>null});
  await custody.stage(sourceId,before,{sourceBytes:prepared.sourceBytes(),candidateBytes:prepared.candidateBytes(),localBytes:prepared.localBytes(),
    engineContextJson:JSON.stringify({build:'synthetic-installed-engine',clock:sourceDay})});
  const held=await custody.load(sourceId),text=bytes=>new TextDecoder().decode(bytes);
  const material={source_json:text(held.sourceBytes),candidate_json:text(held.candidateBytes),local_json:text(held.localBytes),
    checkpoint_json:JSON.stringify(held.checkpoint),engine_context_json:held.engineContextJson};
  const expected=S.frontier(()=>undefined,0),staged=S.prepareMaterial(sourceId,material,expected);
  const sourceRequest=(action,fields)=>({profile:S.PROFILE,device_id:remoteLease.device_id,action,...fields});
  const send=async body=>{const response=await runtime.request('/import',body);assert.equal(response.status,200,JSON.stringify(response.body));return response.body;};
  await send(sourceRequest('manifest',{manifest:staged.manifest}));
  for(let index=0;index<staged.chunks.length;index++)await send(sourceRequest('chunk',{source_id:sourceId,index,data_b64:staged.chunks[index]}));
  let remoteSeq=0,predecessor=null;
  const remoteOp=(payload,extra={})=>{const seq=++remoteSeq,op_id='source-remote-'+seq;const op=Ops.build({op_id,athlete_id:'first',device_id:remoteLease.device_id,
    device_seq:seq,predecessor,parents:[],kind:'fact',class:payload.type?'event':'reading',lease_id:remoteLease.lease_id,
    effective:{local_date:'2026-09-04',local_time:'08:00',utc_offset:'-04:00'},payload,...extra},runtime.identityKeys.first);predecessor=op_id;return op;};
  const intentPayload={type:'source-import-intent',interval:{start:'2026-09-04',end:'2026-09-04'},source_id:sourceId,material_digest:staged.manifest.material_digest};
  const activation=remoteOp(intentPayload),bound=await send(sourceRequest('activate',{source_id:sourceId,expected,operation:activation}));
  assert.equal(bound.binding.seq,1);
  const remote=remoteOp({lb:{value:177,unit:'lb'},note:'SYNTHETIC accepted after source'});
  assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',remote])).status,'ACCEPTED');
  for(const lb of [171,172,173])assert((await client.execute('weighIn',{lb})).acknowledged);
  const later=await repo.load(),pending=structuredClone(later.generation.collections.outbox),localOps=structuredClone(later.generation.collections.ops);
  assert.equal(Object.keys(pending).length,3);
  let nonce=0,lastRecoveryInput;
  async function recover(){
    const p=await client.prepareLocalRecovery();assert(p.prepared,p.code);const basis=p.basis;
    const stage=repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null});
    const verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle});
    const result=await createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>basis.request({nonce:hash(++nonce),contextId:hash(['context',nonce])}),
      expected:req=>basis.expected(req),fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,
        headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),
      observeNegative:async(reply,context)=>{assert.equal(reply.status,200);assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified);},
      validateProfile:input=>{lastRecoveryInput=input;return basis.reconcile(input);}}).run({explicitRetry:true});
    assert(result.evidenceReady,result.reason);return result.evidence;
  }
  const first=await recover(),selected=await first.sourceImport();assert.equal(selected.current.intent_op_id,activation.op_id);
  const noSource=await createDurablePublicClient({...args,recovery:{...recovery,sourceCodec:undefined}}).prepareLocalRecovery();
  assert(noSource.prepared,noSource.code);
  await assert.rejects(noSource.basis.reconcile(lastRecoveryInput),{code:'SOURCE_PROFILE_REQUIRED'},'New source rows cannot pass as opaque auxiliary records');
  const candidate=await first.assemble();let imported;
  await candidate.inspectSourceImport(value=>{imported=value;});
  assert.deepEqual(imported.material,material);assert.equal(imported.source.frontier.W,2);
  imported.material.source_json='{"caller":"changed"}';imported.source.frontier.W=999;
  selected.current.intent_op_id='caller-changed';
  await candidate.inspectSourceImport(value=>{assert.deepEqual(value.material,material);assert.equal(value.source.current.intent_op_id,activation.op_id);});
  await candidate.inspect(value=>{assert.deepEqual(value.collections.outbox,pending);for(const [id,op]of Object.entries(localOps))assert.deepEqual(value.collections.ops[id],op);
    assert.deepEqual(value.collections.ops[remote.op_id],remote);assert.deepEqual(value.collections.ops[activation.op_id],activation);});
  assert.deepEqual(await repo.load(),later,'Recovery handle alone publishes no active generation');
  const rollback=remoteOp({...intentPayload,type:'source-rollback-intent',target_activation_id:activation.op_id});
  await send(sourceRequest('rollback',{target_activation_id:activation.op_id,expected:selected.frontier,operation:rollback}));
  const second=await recover(),rolled=await second.assemble();let historical;
  await rolled.inspectSourceImport(value=>{assert.equal(value.source.current.action,'rollback');assert.deepEqual(value.material,material);});
  await rolled.inspect(value=>{historical=value;assert.deepEqual(value.collections.outbox,pending);assert.equal(value.collections.sync.frontier.W,3);});
  // Exercise the existing encrypted storage boundary for an INACTIVE historical
  // recovery cache, not a qualified source/current-prescription controller.
  assert.equal((await second.archiveProof()).profile,'earned/local-recovery-proof/v2');
  assert.deepEqual(historical.metadata.recoveryArchives[0],oldProof,'Old proof remains byte-for-byte represented beside v4');
  assert.equal(rolled.projectionPending,true);await repo.commit(await repo.load(),historical);
  await assert.rejects(second.archiveProof(),{code:'LOCAL_RECOVERY_CHANGED'},'Publication retires the previous local basis');
  await assert.rejects(rolled.inspectSourceImport(()=>assert.fail('Retired source must not reach visitor')),{code:'LOCAL_RECOVERY_CHANGED'});
  repo.close();const reopened=await f.fresh();repo=reopened.repository;t.after(()=>repo.close());client=createDurablePublicClient({...args,repository:repo});
  assert((await client.prepareLocalRecovery()).prepared,'Reopen authenticates the retained v4 archive/source without erasing pending work');
  for(const lb of [174,175])assert((await client.execute('weighIn',{lb})).acknowledged);
  const after=await repo.load();assert.equal(Object.keys(after.generation.collections.outbox).length,5);
  const displayed=await client.reopen();assert(displayed.view,displayed.refusal?.code);
  assert.equal(displayed.view.layer1.reads.some(row=>row.op_id===remote.op_id),true,'SOURCE_CURRENT_PROJECTION_REMOTE_READING');
  assert.equal(displayed.view.readingHistory.records.length,6,'Remote accepted and five pending originals are visible');
  assert.deepEqual(displayed.view.readingHistory.acceptedReads.map(row=>row.op_id),[remote.op_id],'Pending values never enter accepted machine inputs');
  assert.equal(displayed.view.layer2.projectionPending,true,'Complete factual display alone grants no current guidance');
  const replay=require(resolve(m4,'rebuild/m4/import/reading-replay.cjs')).createReadingReplay({engineFor,projectReadings:args.projectReadings,parseStrictJson,
    producerIdentity:'synthetic-actual-installed-factories',importBuild:'synthetic-installed-engine',deviceId:device});
  async function calculate(){
    // The SAME inactive verified handle supplies material and complete recovered
    // generation. A reproduced candidate calculation grants no publication.
    const evidence=await recover(),candidate=await evidence.assemble();let selectedSource,verifiedGeneration;
    await candidate.inspectSourceImport(x=>{selectedSource=x;});await candidate.inspect(x=>{verifiedGeneration=x;});
    const input={sourceId,material:selectedSource.material,generation:verifiedGeneration,asOf:'2026-09-07'},value=replay.project(input);
    assert.equal(value.ready,true,JSON.stringify(value.issues));assert.equal(value.qualified,false);assert.equal(value.activated,false);
    assert.deepEqual(replay.reproduce(input,value),value);assert.equal(Object.keys(verifiedGeneration.collections.outbox).length,5);
    return value;
  }
  const initialCalculation=await calculate();assert.equal(initialCalculation.coverage.steps.length,1);
  assert.equal(initialCalculation.accepted_state.reads.at(-1).w,177);assert.equal(initialCalculation.reading_history.records.length,6);
  const saved=await repo.importCustody({parseStrictJson,validateContext:()=>null}).load(sourceId);
  assert.deepEqual(saved.checkpoint,before);assert(C.sameBytes(saved.sourceBytes,prepared.sourceBytes()),'Exact source bytes survive reopen');
  const final=await recover(),finalCandidate=await final.assemble();
  await finalCandidate.inspectSourceImport(value=>{assert.equal(value.source.current.intent_op_id,rollback.op_id);assert.deepEqual(value.material,material);});
  await finalCandidate.inspect(value=>{assert.equal(Object.keys(value.collections.outbox).length,5);assert.deepEqual(value.collections.ops[remote.op_id],remote);});
  // Actual remote admission and complete recovery of reading edits. Transport
  // succession alone is not edit causality; the explicit parent chain is kept.
  const correction=remoteOp({replacement_fields:{lb:{value:178,unit:'lb'}}},{kind:'correction',target:remote.op_id,parents:[remote.op_id]});
  assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',correction])).status,'ACCEPTED');
  async function publishHistorical(){const evidence=await recover(),candidate=await evidence.assemble();let value;await candidate.inspect(x=>{value=x;});await repo.commit(await repo.load(),value);return (await client.reopen()).view;}
  const corrected=await publishHistorical();assert(corrected);const reading=corrected.readingHistory.records.find(r=>r.op_id===remote.op_id);
  assert.equal(reading.accepted.quantity.value,178);assert.deepEqual(reading.original,remote);assert.deepEqual(reading.effects[0].original,correction);
  const correctedCalculation=await calculate();assert.equal(correctedCalculation.accepted_state.reads.at(-1).w,178);
  assert.notDeepEqual(correctedCalculation.accepted_calculation.rate,initialCalculation.accepted_calculation.rate);
  assert.deepEqual(correctedCalculation.coverage.steps[0].accepted_effect_ids,[correction.op_id]);
  const removal=remoteOp({reason:'Synthetic remote removal'},{kind:'tombstone',target:remote.op_id,parents:[remote.op_id,correction.op_id]});
  assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',removal])).status,'ACCEPTED');
  const removed=await publishHistorical(),record=removed.readingHistory.records.find(r=>r.op_id===remote.op_id);
  assert.equal(record.accepted.state,'removed');assert.equal(removed.readingHistory.acceptedReads.length,0);
  assert.deepEqual(record.effects.map(e=>e.original),[correction,removal]);assert.equal(removed.layer1.reads.length,5);assert.equal(removed.layer2.projectionPending,true);
  const removedCalculation=await calculate();assert.deepEqual(removedCalculation.accepted_state,prepared.candidateState());
  assert.equal(removedCalculation.coverage.steps[0].state,'removed');assert.equal(removedCalculation.reading_history.records.length,6);
  // A second real import contains a local image actually produced from the
  // previous selected source. Subsequent edits must reconstruct that lineage.
  const at=day=>({local_date:day,local_time:'08:00',utc_offset:'-04:00'});
  const nativeBefore=remoteOp({lb:{value:179,unit:'lb'}},{effective:at('2026-09-05')});
  assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',nativeBefore])).status,'ACCEPTED');
  const nativeFood=remoteOp({kcal:{value:2200,unit:'kcal'}},{class:'food-day',effective:at('2026-09-05')});
  const nativeSteps=remoteOp({count:{value:8000,unit:'step'}},{class:'steps',effective:at('2026-09-05')});
  for(const op of [nativeFood,nativeSteps])assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',op])).status,'ACCEPTED');
  const nativeFoodComplete=remoteOp({replacement_fields:{protein_g:{value:150,unit:'g'}}},{class:'food-day',kind:'correction',target:nativeFood.op_id,parents:[nativeFood.op_id],effective:at('2026-09-05')});
  assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',nativeFoodComplete])).status,'ACCEPTED');
  await publishHistorical();const priorCalculation=await calculate(),nativeCheckpoint=await repo.load();
  const priorEvidence=await recover(),priorSource=await priorEvidence.sourceImport(),nextId='synthetic-second-source';
  const incoming=JSON.parse(material.source_json);incoming.dailyLogs['2026-08-30'].cal=2400;
  const incomingBytes=new TextEncoder().encode(JSON.stringify(incoming)),nativeBytes=new TextEncoder().encode(JSON.stringify(priorCalculation.accepted_state));
  const nextPrepared=require(resolve(m4,'rebuild/m4/import/prepare.cjs')).createImportPreparation({engine:engineFor({day:'2026-09-05',hour:12}),parseStrictJson}).prepare(incomingBytes,{localBytes:nativeBytes});
  const nextCustody=repo.importCustody({parseStrictJson,validateContext:()=>null});
  await nextCustody.stage(nextId,nativeCheckpoint,{sourceBytes:incomingBytes,candidateBytes:nextPrepared.candidateBytes(),localBytes:nativeBytes,
    engineContextJson:JSON.stringify({build:'synthetic-installed-engine',clock:'2026-09-05'})});
  const nextHeld=await nextCustody.load(nextId),nextMaterial={source_json:text(nextHeld.sourceBytes),candidate_json:text(nextHeld.candidateBytes),local_json:text(nextHeld.localBytes),checkpoint_json:JSON.stringify(nextHeld.checkpoint),engine_context_json:nextHeld.engineContextJson};
  const nextStaged=S.prepareMaterial(nextId,nextMaterial,priorSource.frontier);
  await send(sourceRequest('manifest',{manifest:nextStaged.manifest}));
  for(let index=0;index<nextStaged.chunks.length;index++)await send(sourceRequest('chunk',{source_id:nextId,index,data_b64:nextStaged.chunks[index]}));
  const nextActivation=remoteOp({...intentPayload,source_id:nextId,material_digest:nextStaged.manifest.material_digest},{effective:at('2026-09-05')});
  await send(sourceRequest('activate',{source_id:nextId,expected:priorSource.frontier,operation:nextActivation}));
  await publishHistorical();
  async function calculateLineage(){
    const evidence=await recover(),candidate=await evidence.assemble(),source=await evidence.sourceImport();let generation;
    await candidate.inspect(x=>{generation=x;});
    const value=await replay.projectLineage({selectionId:source.current.intent_op_id,generation,asOf:'2026-09-07',assertCurrent:candidate.assertCurrent,
      readSelectedSource:async id=>{let value;await candidate.inspectSelectedSource(id,x=>{value=x;});return value;}});
    assert.equal(value.ready,true,JSON.stringify(value.issues));assert.equal(value.activated,false);assert.equal(value.qualified,false);
    await assert.rejects(candidate.inspectSelectedSource('not-a-selected-source',()=>assert.fail('Unknown source cannot reach visitor')),{code:'SOURCE_SELECTION_UNKNOWN'});
    await candidate.inspectSelectedSource(activation.op_id,x=>{assert.deepEqual(x.material,material);x.material.source_json='changed caller copy';});
    await candidate.inspectSelectedSource(activation.op_id,x=>assert.deepEqual(x.material,material));
    return {value,source,candidate,generation};
  }
  let lineage=await calculateLineage();assert.deepEqual(lineage.value.accepted_state,nextPrepared.candidateState());
  const nativeAfter=remoteOp({lb:{value:180,unit:'lb'}},{effective:at('2026-09-06')});
  assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',nativeAfter])).status,'ACCEPTED');
  const inheritedEdit=remoteOp({replacement_fields:{lb:{value:178,unit:'lb'}}},{kind:'correction',target:nativeBefore.op_id,parents:[nativeBefore.op_id],effective:at('2026-09-06')});
  assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',inheritedEdit])).status,'ACCEPTED');
  const foodEdit=remoteOp({replacement_fields:{kcal:{value:2300,unit:'kcal'}}},{class:'food-day',kind:'correction',target:nativeFood.op_id,parents:[nativeFood.op_id,nativeFoodComplete.op_id],effective:at('2026-09-06')});
  const stepsRemoval=remoteOp({reason:'Synthetic step removal'},{class:'steps',kind:'tombstone',target:nativeSteps.op_id,parents:[nativeSteps.op_id],effective:at('2026-09-06')});
  for(const op of [foodEdit,stepsRemoval])assert.equal((await runtime.bridge.invokeScoped('subject-first',remoteLease.device_id,'admit',['first',op])).status,'ACCEPTED');
  await publishHistorical();lineage=await calculateLineage();
  assert.equal(lineage.value.accepted_state.reads.find(r=>r.d==='2026-09-05').w,178);
  assert.deepEqual(lineage.value.coverage.steps.map(x=>x.op_id),[remote.op_id,nativeBefore.op_id,nativeFood.op_id,nativeSteps.op_id,nativeAfter.op_id]);
  assert.deepEqual(lineage.value.accepted_state.dailyLogs['2026-09-05'],{cal:2300,pro:150});
  assert.equal(lineage.value.daily_history.records.find(r=>r.op_id===nativeSteps.op_id).accepted.state,'removed');
  assert.equal(lineage.value.coverage.source_lineage.length,1);assert.equal(Object.keys(lineage.generation.collections.outbox).length,5);
  const finalRollback=remoteOp({...intentPayload,type:'source-rollback-intent',target_activation_id:activation.op_id},{effective:at('2026-09-06')});
  await send(sourceRequest('rollback',{target_activation_id:activation.op_id,expected:lineage.source.frontier,operation:finalRollback}));
  await publishHistorical();await assert.rejects(lineage.candidate.inspectSelectedSource(activation.op_id,()=>assert.fail('Retired inventory must refuse')),{code:'RECOVERY_STAGE_CHANGED'});
  repo.close();const finalOpen=await f.fresh();repo=finalOpen.repository;t.after(()=>repo.close());client=createDurablePublicClient({...args,repository:repo});
  lineage=await calculateLineage();
  let rollbackExpected=engineFor({day:'2026-09-05',hour:8}).applyRead(prepared.candidateState(),'2026-09-05',178,{hour:8});
  rollbackExpected=engineFor({day:'2026-09-05',hour:8}).writeDaily(rollbackExpected,'2026-09-05',{cal:2300,pro:150});
  rollbackExpected=engineFor({day:'2026-09-06',hour:8}).applyRead(rollbackExpected,'2026-09-06',180,{hour:8});
  assert.deepEqual(lineage.value.accepted_state,rollbackExpected);assert.equal(lineage.value.coverage.selected_intent_id,finalRollback.op_id);
  assert.equal(Object.keys(lineage.generation.collections.outbox).length,5);
  assert.deepEqual(lineage.generation.collections.ops[nativeBefore.op_id],nativeBefore);assert.deepEqual(lineage.generation.collections.ops[nativeAfter.op_id],nativeAfter);
  for(const op of [nativeFood,nativeSteps,nativeFoodComplete,foodEdit,stepsRemoval])assert.deepEqual(lineage.generation.collections.ops[op.op_id],op);
  const nextSaved=(await repo.importCustody({parseStrictJson,validateContext:()=>null}).load(nextId));assert.deepEqual(nextSaved.checkpoint,nativeCheckpoint);
  await assert.rejects(lineage.candidate.inspectSelectedSource(activation.op_id,async()=>{
    const snapshot=await repo.load();await repo.commit(snapshot,snapshot.generation);
  }),{code:'LOCAL_RECOVERY_CHANGED'},'A local revision changed during the visitor retires selected material');
  // Resealing a changed local original does not authenticate its identity.
  const intact=await repo.load(),changed=structuredClone(intact.generation),localId=Object.keys(changed.collections.outbox)[0];
  changed.collections.ops[localId].payload.lb.value=999;await repo.commit(intact,changed);
  const refused=await client.reopen();assert.equal(refused.view,null);assert.equal(refused.refusal.code,'LOCAL_HISTORY_IDENTITY_UNPROVEN');
  await repo.commit(await repo.load(),intact.generation);assert((await client.reopen()).view,'Restore original synthetic generation');
  let epoch=1;const unchanged=await repo.load(),project=args.projectReadings;
  const retiring=createDurablePublicClient({...args,repository:repo,observationEpoch:()=>epoch,
    projectReadings:input=>{const value=project(input);epoch++;return value;}});
  const late=await retiring.reopen();assert.equal(late.view,null);assert.equal(late.refusal.code,'OBSERVATION_CHANGED');
  assert.deepEqual(await repo.load(),unchanged,'A view from a changed observation context publishes nothing');
});
