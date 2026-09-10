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
if(!process.env.EARNED_ROWS_R1_ROOT)throw Error('Use the pinned recovery runner');
const require=createRequire(resolve(process.env.EARNED_ROWS_R1_ROOT,'rebuild/m3/w5/package.json'));
const C=require('./reconciliation/codec.cjs'),P=require('./reconciliation/paged-codec.cjs'),S=require('./crypto.cjs');
const hash=value=>P.hash('local-recovery-test',value);

test('complete signed inventory cannot replace a divergent local terminal cache',async t=>{
  const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});t.after(()=>runtime.close());
  await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
  const lease=(await runtime.bridge.enrollScoped('subject-first',{intent_id:'consistency-guards',schema_version:1,nonce:hash('consistency-enroll')})).payload.issuance.lease;
  const device=lease.device_id,keys=[S.publicKeyOf(runtime.authorityKey)],f=await fixture({namespace:'first/'+device});t.after(()=>f.repo.close());
  const generation=initial();generation.metadata.authorityLease=lease;await f.repo.initialize(generation,'synthetic-enrollment-only');
  const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:device});
  const args={repository:f.repo,stage:createT2Stage(()=>({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first}),{allowInbound:true}),
    namespace:f.setup.namespace,athleteId:'first',deviceId:device,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
    observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys,crypto:webcrypto,permissionNowIso:()=>lease.not_before,recovery:{codec:C,protocol:P,scopeDigest}};
  const client=createDurablePublicClient(args);assert((await client.execute('weighIn',{lb:170})).acknowledged);
  const original=Object.values((await f.repo.load()).generation.collections.ops)[0];
  const accepted=await runtime.bridge.invokeScoped('subject-first',device,'admit',['first',original]);assert.equal(accepted.status,'ACCEPTED');
  const stored=await client.acceptResponse('disposition',{wireVersion:require('./public-client.cjs').WIRE_VERSION,body:{disposition:accepted}});assert(stored.accepted,stored.code);
  const clean=await f.repo.load();assert(!Object.hasOwn(clean.generation.collections.outbox,original.op_id));
  assert.deepEqual(clean.generation.collections.dispositions[original.op_id],accepted);
  const stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null}),verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle});
  let nonce=0;
  async function compare(explicitRetry){
    const fresh=createDurablePublicClient(args),prepared=await fresh.prepareLocalRecovery();assert(prepared.prepared,prepared.code);
    const basis=prepared.basis;let diagnostic=null,profileEntered=false;
    const result=await createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>{await basis.assertCurrent();return basis.request({nonce:hash(['consistency',++nonce]),contextId:hash('consistency-context')});},expected:req=>basis.expected(req),
      fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),
      observeNegative:async(reply,context)=>{assert.equal(reply.status,200);assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified);},
      validateProfile:async input=>{profileEntered=true;try{return await basis.reconcile(input);}catch(error){diagnostic={code:error.code,state:error.state};throw error;}}
    }).run({explicitRetry});
    assert(profileEntered,'A complete staged inventory must reach local comparison');return {result,diagnostic};
  }
  // Positive control uses an actual public-client write, signed D1 acceptance,
  // authenticated durable drain, fresh public client and complete HTTP inventory.
  const control=await compare(false);assert(control.result.evidenceReady,control.result.reason);assert.equal(control.diagnostic,null);
  for(const field of ['dispositions','rejected'])await t.test(field==='dispositions'?'divergent terminal disposition refuses only after full profile validation':'divergent rejected entry refuses only after full profile validation',async()=>{
    const before=await f.repo.load(),changed=structuredClone(clean.generation),backend=Client.memoryBackend(changed.collections),store=new Client.Store(backend);
    // Deliberate cached-local corruption, resealed through the real repository.
    // The original operation, its valid signed wire proof and the entire server
    // inventory stay unchanged. This is NOT a lawful authority state transition
    // or evidence that the normal UI writes an invented rejection.
    assert(store.transaction(tx=>tx.put(field,original.op_id,field==='dispositions'?{...accepted,status:'REJECTED'}:
      {op_id:original.op_id,commitment:original.canonical_content_commitment,reason:'SYNTHETIC_CACHE_CONTRADICTION',status:'REJECTED',decided_at:null,kind:original.kind,class:original.class})).ok);
    changed.collections=T2.snapshotBackend(backend,Object.keys(changed.collections));await f.repo.commit(before,changed);const divergent=await f.repo.load();
    const checked=await compare(true);assert.equal(checked.result.evidenceReady,false);assert.equal(checked.result.evidence,undefined);
    assert.equal(checked.result.reason,'TRANSPORT_EXHAUSTED');
    assert.deepEqual(checked.diagnostic,{code:field==='dispositions'?'LOCAL_TERMINAL_DISAGREEMENT':'LOCAL_REJECTION_DISAGREEMENT',state:18});
    assert.deepEqual(await f.repo.load(),divergent,'Refusal cannot overwrite the contradictory original or publish recovered truth');
    await f.repo.commit(divergent,structuredClone(clean.generation));
    const restored=await compare(true);assert(restored.result.evidenceReady,restored.result.reason);assert.equal(restored.diagnostic,null);
    const queue=[];await restored.result.evidence.pending(entry=>queue.push(entry));assert.deepEqual(queue,[]);
  });
});

for(const kind of ['WAITING','REJECTED','ENVELOPE_MISMATCH','IDENTITY_CONFLICT'])test(`actual signed recovery preserves ${kind} local original without choosing or applying an outcome`,async t=>{
  const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});t.after(()=>runtime.close());
  await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
  const lease=(await runtime.bridge.enrollScoped('subject-first',{intent_id:'local-'+kind,schema_version:1,nonce:hash(kind)})).payload.issuance.lease;
  const device=lease.device_id,Ops=require('../../client/ops.cjs'),keys=[S.publicKeyOf(runtime.authorityKey)];
  const spec={op_id:'synthetic-'+kind,athlete_id:'first',device_id:device,device_seq:kind==='REJECTED'?lease.range[1]+1:1,
    parents:kind==='WAITING'?['synthetic-unsubmitted-parent']:[],kind:'fact',class:'reading',lease_id:lease.lease_id,
    effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},payload:{lb:{value:170,unit:'lb'},note:'Caf\u00e9'}};
  const remote=Ops.build(spec,runtime.identityKeys.first),local=Ops.build({...spec,payload:{...spec.payload,...(kind==='ENVELOPE_MISMATCH'?{note:'Cafe\u0301'}:kind==='IDENTITY_CONFLICT'?{note:'different'}:{})}},runtime.identityKeys.first);
  if(kind==='ENVELOPE_MISMATCH')assert.equal(local.canonical_content_commitment,remote.canonical_content_commitment);
  const disposition=await runtime.bridge.invokeScoped('subject-first',device,'admit',['first',remote]);assert.equal(disposition.status,['WAITING','REJECTED'].includes(kind)?kind:'ACCEPTED');
  const f=await fixture({namespace:'first/'+device});t.after(()=>f.repo.close());const generation=initial();generation.metadata.authorityLease=lease;
  // Declared synthetic source envelopes, including an out-of-range rejected
  // envelope. Actual Ops/Store build them; no claim that the UI permits that write.
  const backend=Client.memoryBackend(generation.collections),store=new Client.Store(backend);
  assert(store.transaction(tx=>{tx.put('ops',local.op_id,local);tx.put('outbox',local.op_id,{op_id:local.op_id,order:1,enqueued:'2026-09-06T12:00:00Z'});}).ok);
  generation.collections=T2.snapshotBackend(backend,Object.keys(generation.collections));
  await f.repo.initialize(generation,'synthetic-enrollment-only');const before=await f.repo.load();
  const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:device});
  const client=createDurablePublicClient({repository:f.repo,stage:createT2Stage(()=>({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first}),{allowInbound:true}),namespace:f.setup.namespace,athleteId:'first',deviceId:device,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys,crypto:webcrypto,permissionNowIso:()=>lease.not_before,recovery:{codec:C,protocol:P,scopeDigest}});
  const prepared=await client.prepareLocalRecovery();assert(prepared.prepared,prepared.code);const basis=prepared.basis,stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null});
  const verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle});let nonce=0;
  const result=await createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>basis.request({nonce:hash([kind,++nonce]),contextId:hash('context')}),expected:req=>basis.expected(req),fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),observeNegative:async(reply,context)=>{assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified);},validateProfile:input=>basis.reconcile(input)}).run();
  assert(result.evidenceReady,result.code);const compared=[];await result.evidence.pending(x=>compared.push(x));assert.equal(compared.length,1);
  assert.equal(compared[0].action,{WAITING:'RETAIN_WAITING',REJECTED:'TERMINAL_EVIDENCE',ENVELOPE_MISMATCH:'EXPLICIT_RESTORE_REQUIRED',IDENTITY_CONFLICT:'IDENTITY_CONFLICT'}[kind]);
  assert.deepEqual(compared[0].original,local);assert.deepEqual(compared[0].authorityOperation,remote);assert.deepEqual(await f.repo.load(),before);
  if(['ENVELOPE_MISMATCH','IDENTITY_CONFLICT'].includes(kind)) {
    await assert.rejects(result.evidence.assemble(),e=>e.state===18&&e.code===(kind==='ENVELOPE_MISMATCH'?'RECOVERY_EXPLICIT_RESTORE_REQUIRED':'RECOVERY_IDENTITY_CONFLICT'));
  } else {
    const held=await result.evidence.assemble();let candidate;await held.inspect(x=>{candidate=x;});
    const reference=Client.memoryBackend(before.generation.collections),sink=Client.createClient({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first,
      backend:reference,authorityVerification:{verifyDisposition:d=>S.verifyDisposition(d,keys[0]),verifyLease:l=>S.verifyLease(l,keys[0])}});sink.boot();
    assert.equal(sink.deliverDisposition(disposition).stored,true);
    for(const name of ['ops','outbox','dispositions','rejected'])assert.deepEqual(candidate.collections[name]||{},structuredClone(T2.snapshotBackend(reference))[name]||{},name+' agrees with actual T2 disposition transaction');
    assert.deepEqual(candidate.collections.sync.snapshot.plan,{},'Verified unchanged source plan is empty');
    assert.deepEqual(candidate.metadata.recoveryPriorSnapshots[0].snapshot,before.generation.collections.sync.snapshot);
    assert.deepEqual(candidate.metadata.budget,before.generation.metadata.budget);
    assert(held.projectionPending&&!held.activated&&!held.complete&&!held.checkpoint);
  }
  assert.deepEqual(await f.repo.load(),before,'Candidate or refusal never changes the active generation');
});

test('actual public client captures and reconciles all local pending originals through D1 HTTP',async t=>{
  const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});t.after(()=>runtime.close());
  await runtime.bridge.initializeR1({first:{plan:{},devices:{}}},{'subject-first':'first'});
  const enrollment=await runtime.bridge.enrollScoped('subject-first',{intent_id:'local-recovery',schema_version:1,nonce:hash('enroll')}),lease=enrollment.payload.issuance.lease;
  const keys=[S.publicKeyOf(runtime.authorityKey)],device=lease.device_id;
  const f=await fixture({namespace:'first/'+device});t.after(()=>f.repo.close());
  const generation=initial();generation.metadata.authorityLease=lease;
  await f.repo.initialize(generation,'synthetic-enrollment-only');
  const state={session:1,observation:1};
  const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:device});
  const args={repository:f.repo,stage:createT2Stage(()=>({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first}),{allowInbound:true}),
    namespace:f.setup.namespace,athleteId:'first',deviceId:device,sessionEpoch:1,isCurrentSession:x=>x===state.session,observationEpoch:()=>state.observation,
    observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys,crypto:webcrypto,permissionNowIso:()=>lease.not_before,
    recovery:{codec:C,protocol:P,scopeDigest}};
  const client=createDurablePublicClient(args);
  for(let n=0;n<3;n++)assert.equal((await client.execute('weighIn',{lb:170+n})).acknowledged,true);
  const original=await f.repo.load(),ops=Object.values(original.generation.collections.ops).sort((a,b)=>a.device_seq-b.device_seq);
  assert.equal((await runtime.bridge.invokeScoped('subject-first',device,'admit',['first',ops[0]])).status,'ACCEPTED');
  assert.equal((await runtime.bridge.invokeScoped('subject-first',device,'admit',['first',ops[2]])).status,'ACCEPTED');
  const uncreated=require('../../client/ops.cjs').build({...ops[2],op_id:'server-only-rejected',device_seq:lease.range[1]+1},runtime.identityKeys.first);
  assert.equal((await runtime.bridge.invokeScoped('subject-first',device,'admit',['first',uncreated])).status,'REJECTED');
  const prepared=await client.prepareLocalRecovery();assert(prepared.prepared,prepared.code);const basis=prepared.basis;
  const verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle});let nonce=0;
  const stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null});
  const options={stage,codec:C,protocol:P,newRequest:async()=>{await basis.assertCurrent();return basis.request({nonce:hash(++nonce),contextId:hash('context')});},expected:req=>basis.expected(req),
    fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),
    observeNegative:async(reply,context)=>{assert.equal(reply.status,200);assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified);},
    validateProfile:input=>basis.reconcile(input)};
  // Observer/standing control is explicitly synthetic. This test exercises real
  // signatures, HTTP, public client, local identity checks and IndexedDB only.
  const result=await createRowsRecovery(options).run();assert(result.evidenceReady,result.code);assert(result.evidence.localCompared);
  let compared=[],retainedHistory,heldCandidate;await result.evidence.pending((item,history)=>{compared.push(item);retainedHistory??=history;});
  await t.test('accepted and absent entries remain distinct without any active mutation',async()=>{
    assert.deepEqual(compared.map(x=>x.action),['TERMINAL_EVIDENCE','RETAIN_UNACKNOWLEDGED','TERMINAL_EVIDENCE']);
    assert.deepEqual(compared.map(x=>x.original),ops);assert.deepEqual(compared.map(x=>x.outboxEntry),Object.values(original.generation.collections.outbox));
    assert.equal(compared[0].disposition.status,'ACCEPTED');assert.equal(compared[1].authorityOperation,null);assert.equal(compared[2].disposition.status,'ACCEPTED');
    assert.equal(result.evidence.activated,false);assert.equal(result.evidence.checkpoint,false);assert.deepEqual(await f.repo.load(),original);
  });
  await t.test('request cannot omit, replace or duplicate a pending original',()=>{
    for(const change of [r=>r.claims.pop(),r=>r.claims[0].envelope_b64=r.claims[1].envelope_b64,r=>r.claims.push(r.claims[0]),r=>r.requested_lease_ids.pop()]){
      const req=basis.request({nonce:hash('tamper'),contextId:hash('context')});change(req);assert.throws(()=>basis.expected(req));
    }
  });
  await t.test('assembled candidate preserves unsent originals and matches actual T2 terminal and receipt sinks',async()=>{
    heldCandidate=await result.evidence.assemble();let candidate;await heldCandidate.inspect(x=>{candidate=x;});
    assert.deepEqual(Object.values(candidate.collections.ops),ops);
    assert(!Object.hasOwn(candidate.collections.ops,uncreated.op_id),'Signed rejection of an uncreated request is archive evidence, not a new local operation');
    assert.deepEqual(Object.keys(candidate.collections.outbox),[ops[1].op_id]);
    const backend=Client.memoryBackend(original.generation.collections),sink=Client.createClient({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first,
      backend,authorityVerification:{verifyDisposition:d=>S.verifyDisposition(d,keys[0]),verifyLease:l=>S.verifyLease(l,keys[0])}});sink.boot();
    for(const item of compared.filter(x=>x.action==='TERMINAL_EVIDENCE')){
      assert(sink.deliverDisposition(item.disposition).stored);
      sink.deliverReceipts([{seq:item.disposition.athlete_log_seq,op_id:item.original.op_id,canonical_content_commitment:item.original.canonical_content_commitment,accepted_at:item.disposition.accepted_at,op:item.original}]);
    }
    const reference=structuredClone(T2.snapshotBackend(backend));
    for(const name of ['ops','outbox','dispositions','receipts'])assert.deepEqual(candidate.collections[name],reference[name],name);
    assert.deepEqual(candidate.collections.sync.frontier,reference.sync.frontier);
    assert.deepEqual(candidate.collections.sync.snapshot.plan,{});
    assert.deepEqual(candidate.metadata.recoveryPriorSnapshots[0].snapshot,original.generation.collections.sync.snapshot);
    assert.deepEqual(candidate.collections.futureCollection,original.generation.collections.futureCollection);
    for(const [name,value]of Object.entries(original.generation.metadata))assert.deepEqual(candidate.metadata[name],value);
    assert.deepEqual(candidate.metadata.recoveryArchives,[await result.evidence.archiveProof()]);
    assert.equal(heldCandidate.projectionPending,true);assert.equal(heldCandidate.activated,false);assert.equal(heldCandidate.complete,false);assert.equal(heldCandidate.checkpoint,false);
    candidate.collections.ops[ops[1].op_id].payload.lb.value=-1;candidate.metadata.recoveryArchives.length=0;
    await heldCandidate.inspect(copy=>{assert.deepEqual(copy.collections.ops[ops[1].op_id],ops[1]);assert.equal(copy.metadata.recoveryArchives.length,1);});
    assert.deepEqual(await f.repo.load(),original);
  });
  await t.test('consumer edits never mutate retained originals or later comparison output',async()=>{
    compared[0].original.payload.lb.value=-1;compared[0].outboxEntry.op_id='wrong';const again=[];await result.evidence.pending(x=>again.push(x));assert.deepEqual(again.map(x=>x.original),ops);assert.deepEqual(await f.repo.load(),original);
  });
  await t.test('new local operation invalidates both captured request basis and late comparison',async()=>{
    assert((await client.execute('weighIn',{lb:174})).acknowledged);
    await assert.rejects(basis.assertCurrent(),e=>e.code==='LOCAL_RECOVERY_CHANGED');
    let called=false;await assert.rejects(result.evidence.pending(()=>{called=true;}),e=>e.code==='LOCAL_RECOVERY_CHANGED');assert.equal(called,false);
    await assert.rejects(retainedHistory(()=>{called=true;}),e=>e.code==='LOCAL_RECOVERY_CHANGED');assert.equal(called,false);
    await assert.rejects(heldCandidate.inspect(()=>{called=true;}),e=>e.code==='LOCAL_RECOVERY_CHANGED');assert.equal(called,false);
    await assert.rejects(result.evidence.assemble(),e=>e.code==='LOCAL_RECOVERY_CHANGED');
  });
  await t.test('already drained local originals are compared without queue recreation',async()=>{
    const disposition=await runtime.bridge.invokeScoped('subject-first',device,'admit',['first',ops[0]]);
    const accepted=await client.acceptResponse('disposition',{wireVersion:require('./public-client.cjs').WIRE_VERSION,body:{disposition}});assert(accepted.accepted,accepted.code);
    const local=await f.repo.load();assert(!Object.hasOwn(local.generation.collections.outbox,ops[0].op_id));
    const p=await client.prepareLocalRecovery();assert(p.prepared,p.code);const b=p.basis;
    const again=await createRowsRecovery({...options,newRequest:async()=>b.request({nonce:hash(++nonce),contextId:hash('context')}),expected:req=>b.expected(req),validateProfile:input=>b.reconcile(input)}).run({explicitRetry:true});
    assert(again.evidenceReady,again.reason);const queue=[];await again.evidence.pending(x=>queue.push(x));assert(!queue.some(x=>x.op_id===ops[0].op_id));assert.deepEqual(await f.repo.load(),local);
  });
  await t.test('a resealed missing queue record cannot erase a locally retained original during recovery',async()=>{
    const snapshot=await f.repo.load(),changed=structuredClone(snapshot.generation),id=Object.keys(changed.collections.ops).find(id=>!ops.some(op=>op.op_id===id));assert(id);
    const backend=Client.memoryBackend(changed.collections),store=new Client.Store(backend);assert(store.transaction(tx=>tx.del('outbox',id)).ok);
    changed.collections=T2.snapshotBackend(backend,Object.keys(changed.collections));await f.repo.commit(snapshot,changed);const before=await f.repo.load();
    const p=await client.prepareLocalRecovery();assert(p.prepared,p.code);const b=p.basis;
    let diagnostic;
    const refused=await createRowsRecovery({...options,newRequest:async()=>b.request({nonce:hash(++nonce),contextId:hash('context')}),expected:req=>b.expected(req),validateProfile:async input=>{try{return await b.reconcile(input);}catch(e){diagnostic=e.code;throw e;}}}).run({explicitRetry:true});
    assert.equal(refused.evidenceReady,false);assert.equal(refused.reason,'TRANSPORT_EXHAUSTED');assert.equal(diagnostic,'LOCAL_RETAINED_ORIGINAL_UNPROVEN');assert.deepEqual(await f.repo.load(),before);
  });
  await t.test('a fresh public client refuses a resealed forged pending original',async()=>{
    const snapshot=await f.repo.load(),changed=structuredClone(snapshot.generation);changed.collections.ops[ops[1].op_id].payload.lb.value=999;
    await f.repo.commit(snapshot,changed);const fresh=createDurablePublicClient(args),answer=await fresh.prepareLocalRecovery();assert.equal(answer.prepared,false);assert.equal(answer.state,18);assert.equal(answer.code,'LOCAL_HISTORY_IDENTITY_UNPROVEN');
  });
  await t.test('old-scope handles cannot disclose request envelopes after session change',()=>{
    state.session=2;assert.throws(()=>basis.request({nonce:hash('old'),contextId:hash('context')}),e=>e.state===17);
  });
});
