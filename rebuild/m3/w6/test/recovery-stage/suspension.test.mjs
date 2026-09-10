import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {IDBKeyRange} from 'fake-indexeddb';
import {fixture,initial,config,createT2Stage,Client} from '../support.mjs';
import {createDurablePublicClient} from '../../public-client.mjs';
import {createRowsRecovery,createRowsFetcher} from '../../recovery-transport.mjs';
import {validateRecoveryProfile,validateArchivedRecoveryProfile} from '../../recovery-profile.mjs';
import T2 from '../../t2-stage.cjs';
if(!process.env.EARNED_ROWS_R1_ROOT)throw Error('Use the pinned recovery runner');
const require=createRequire(resolve(process.env.EARNED_ROWS_R1_ROOT,'rebuild/m3/w5/package.json'));
const C=require('./reconciliation/codec.cjs'),P=require('./reconciliation/paged-codec.cjs'),S=require('./crypto.cjs'),Ops=require('../../client/ops.cjs');
const hash=x=>P.hash('suspension-recovery-test',x);

test('real delayed consent and contradictory response recover without replaying old local plan or fallback',async t=>{
 const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});t.after(()=>runtime.close());
 const baseline={protein_g:150,sets:3};await runtime.bridge.initializeR1({first:{plan:baseline,devices:{}}},{'subject-first':'first'});
 const enroll=async id=>(await runtime.bridge.enrollScoped('subject-first',{intent_id:id,schema_version:1,nonce:hash(id)})).payload.issuance.lease;
 const lease=await enroll('suspension-A'),other=await enroll('suspension-B'),device=lease.device_id,keys=[S.publicKeyOf(runtime.authorityKey)];
 const invoke=(method,args=[])=>runtime.bridge.invokeScoped('subject-first',device,method,['first',...args]);
 const build=(l,id,seq,extra)=>Ops.build({op_id:id,athlete_id:'first',device_id:l.device_id,device_seq:seq,lease_id:l.lease_id,
  effective:{local_date:'2026-09-09',local_time:'08:00',utc_offset:'-04:00'},...extra},runtime.identityKeys.first);
 const issuance={issuance_id:'synthetic-offer',proposal_family_id:'synthetic-protein',evidence_generation:1,offer_digest:hash('offer'),computed_through_watermark:0,
  apply_members:[{field:'protein_g',value:155,unit:'g/day',provenance:'inherited'}]};
 const issued=await invoke('issue',[issuance]);assert(issued.accepted);
 const response=build(lease,'synthetic-apply-answer',1,{kind:'proposal-response',class:'plan',payload:{issuance_id:issuance.issuance_id,chosen_outcome_id:'APPLY',consent_digest:hash('consent')}});
 assert.equal((await invoke('admit',[response])).status,'ACCEPTED');
 const newer=build(other,'synthetic-newer-sets',1,{kind:'plan-mutation',class:'plan',payload:null,plan:{domain:'training',members:[{field:'sets',value:5,unit:'set',provenance:'athlete_edited'}]}});
 assert.equal((await runtime.bridge.invokeScoped('subject-first',other.device_id,'admit',['first',newer])).status,'ACCEPTED');
 const paused=await invoke('apply',[{apply_request_id:'synthetic-paused',response_op_id:response.op_id}]);assert.equal(paused.reason_code,'PAUSED_COVERAGE');
 assert((await invoke('confirmBasis',[issued.instance,true])).confirmed);
 const applied=await invoke('apply',[{apply_request_id:'synthetic-applied',response_op_id:response.op_id}]);assert.equal(applied.status,'effective');
 const effect=(await invoke('planTransactions')).find(x=>x.txn_id===applied.plan_transaction_id);
 assert.equal(effect.seq,2);assert.equal((await invoke('disposition',[device,1])).athlete_log_seq,1,'Consent effect may be evaluated after its response');
 const no=build(other,'synthetic-no-answer',2,{predecessor:newer.op_id,parents:[],kind:'proposal-response',class:'plan',payload:{issuance_id:issuance.issuance_id,chosen_outcome_id:'NO',consent_digest:hash('consent')}});
 assert.equal((await runtime.bridge.invokeScoped('subject-first',other.device_id,'admit',['first',no])).status,'ACCEPTED');
 assert.equal((await invoke('instanceState',[issued.instance])).status,'conflict_suspended');
 const sourcePlan=await invoke('plan');assert.deepEqual(sourcePlan,{protein_g:150,sets:5});
 // Declared invalid historical envelope, built by actual Ops and rejected by
 // actual authority. The current UI does not permit an out-of-range write.
 const rejected=build(lease,'synthetic-rejected-consent',lease.range[1]+1,{kind:'plan-mutation',class:'plan',payload:null,
  plan:{domain:'calories',members:[{field:'kcal',value:2100,unit:'kcal/day',provenance:'athlete_edited'}]}});
 const rejection=await invoke('admit',[rejected]);assert.equal(rejection.status,'REJECTED');

 const f=await fixture({namespace:'first/'+device});t.after(()=>f.repo.close());const generation=initial();generation.metadata.authorityLease=lease;
 const cfg=()=>({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first});
 const backend=Client.memoryBackend(generation.collections),store=new Client.Store(backend);
 // Actual source response plus a declared retained consent DTO. This is not
 // a claim that W6 already exposes the proposal/consent command or UI.
 const consent={txn_id:effect.txn_id,op_id:response.op_id,members:effect.members,provenance:'consented',version:effect.txn_id};
 const rejectedConsent={txn_id:rejected.requested_transaction_id,op_id:rejected.op_id,members:rejected.members,provenance:'consented',version:rejected.requested_transaction_id};
  assert(store.transaction(tx=>{tx.put('ops',response.op_id,response);tx.put('outbox',response.op_id,{op_id:response.op_id,order:1});
  tx.put('ops',rejected.op_id,rejected);tx.put('outbox',rejected.op_id,{op_id:rejected.op_id,order:2});
  tx.put('plan','applied',{list:[consent]});tx.put('plan','accepted',rejectedConsent);
  tx.put('planTransactions',effect.txn_id,consent);tx.put('planTransactions',rejectedConsent.txn_id,rejectedConsent);}).ok);
 const local=Client.createClient({...cfg(),backend});local.boot();
 assert(local.planHistory([{txn_id:'synthetic-local-baseline',members:Object.entries(baseline).map(([field,value])=>({field,value,provenance:'athlete_edited'})),parents:[]},
  {...effect,parents:['synthetic-local-baseline']}]).stored);
 assert(local.conflictSuspend(effect.txn_id).suspended);assert.deepEqual(local.plan(),{...baseline,kcal:2100},'Locally unacknowledged intent still governs before recovery learns its rejection');
 generation.collections=T2.snapshotBackend(backend,Object.keys(generation.collections));await f.repo.initialize(generation,'synthetic-enrollment-only');const before=await f.repo.load();
 const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:device});
 const args={repository:f.repo,stage:createT2Stage(cfg,{allowInbound:true}),namespace:f.setup.namespace,athleteId:'first',deviceId:device,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,
  observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,keys,crypto:webcrypto,permissionNowIso:()=>lease.not_before,recovery:{codec:C,protocol:P,scopeDigest,keyRange:IDBKeyRange}};
 const client=createDurablePublicClient(args),prepared=await client.prepareLocalRecovery();assert(prepared.prepared,prepared.code);const basis=prepared.basis;
 const stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null}),verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle});let diagnostic,requestBytes;
 const result=await createRowsRecovery({stage,codec:C,protocol:P,newRequest:async()=>basis.request({nonce:hash('request'),contextId:hash('context')}),expected:req=>basis.expected(req),
  fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),
  observeNegative:async(reply,context)=>assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified),
  validateProfile:async input=>{requestBytes=C.bytes(input.requestBytes);try{return await basis.reconcile(input);}catch(error){diagnostic=error.code;throw error;}}}).run();
 assert(result.evidenceReady,'ACTUAL_DELAYED_CONSENT_RECOVERS '+result.reason+' / '+diagnostic);
 const held=await result.evidence.assemble();let candidate;await held.inspect(x=>{candidate=x;});
 assert(held.projectionPending&&!held.complete&&!held.activated);
 assert.deepEqual(candidate.collections.sync.snapshot.plan,sourcePlan);
 assert.deepEqual(candidate.collections.sync.snapshot.planSuspendedTransactionIds,[effect.txn_id]);
 assert(candidate.collections.sync.snapshot.planTransactionSources.some(x=>x.txn_id===effect.txn_id&&x.op_id===response.op_id));
 for(const name of ['plan','planTransactions','planHistory','suspensions'])assert.deepEqual(candidate.collections[name],before.generation.collections[name]);
 assert.deepEqual(await f.repo.load(),before);
 // Relational faults below signature validation, over captured synthetic rows.
 // These are not forged live pages. Both current and historical interpreters
 // must retain the narrow proof for the legitimate delayed application.
 const inventory=await stage.inventory(),rows=[];await inventory.visit(row=>rows.push(row));const bindings=await inventory.bindings();
 const expected=basis.expected(C.decodeRequest(requestBytes)),publicVerifier=require('./public-client.cjs').createPublicVerifier({keys,subtle:webcrypto.subtle});
 function view(edited,historical){return {historicalOnly:historical,async visit(fn){for(const row of edited)await fn(structuredClone(row));},
  async scan(c,fn){for(const row of edited.filter(r=>r.collection===c))await fn(structuredClone(row));},async readRow(c,id){return structuredClone(edited.find(r=>r.collection===c&&r.row_id===id));},
  async bindings(){return {...bindings,manifest:{...bindings.manifest,collection_counts:P.COLLECTIONS.map(c=>[c,edited.filter(r=>r.collection===c).length])}};},async assertCurrent(){},async assertIntact(){}};}
 const validate=(edited,historical)=>(historical?validateArchivedRecoveryProfile:validateRecoveryProfile)({inventory:view(edited,historical),codec:C,protocol:P,publicVerifier,requestBytes,expected});
 const mutateRow=(rows,c,id,fn)=>{const row=rows.find(r=>r.collection===c&&r.row_id===id),value=C.parse(row.value);fn(value);row.value=JSON.stringify(value);};
 for(const [name,mutate]of[
  ['missing original successful apply',r=>r.splice(r.findIndex(x=>x.collection==='applies'&&x.row_id==='synthetic-applied'),1)],
  ['application frontier changed to response ordinal',r=>mutateRow(r,'transactions',effect.txn_id,x=>{x.seq=1;})],
  ['application points to another response',r=>mutateRow(r,'applies','synthetic-applied',x=>{x.request.response_op_id=newer.op_id;})],
  ['issuance members disagree with effect',r=>mutateRow(r,'issuances',issuance.issuance_id,x=>{x.apply_members[0].value=999;})],
  ['non-applied result cannot prove effect',r=>mutateRow(r,'applies','synthetic-applied',x=>{x.result.reason_code='EXISTING_TRANSACTION';})],
  ['suspension without a transaction',r=>r.push({collection:'suspensions',row_id:'synthetic-unknown',value:JSON.stringify({suspended:true})})],
  ['false suspension marker',r=>mutateRow(r,'suspensions',effect.txn_id,x=>{x.suspended=false;})],
 ])await t.test(name+' refuses in current and historical recovery',async()=>{
  const edited=structuredClone(rows);mutate(edited);
  for(const historical of [false,true])await assert.rejects(validate(edited,historical),e=>e.code==='RETAINED_INTEGRITY');
 });
 // Test-only placement of the inactive candidate; no production activation.
 await f.repo.commit(before,candidate);const fresh=await f.fresh();t.after(()=>fresh.repository.close());
 const reopened=createDurablePublicClient({...args,repository:fresh.repository}),authenticated=await reopened.prepareLocalRecovery();assert(authenticated.prepared,authenticated.code);
 const saved=await fresh.repository.load(),reader=Client.createClient({...cfg(),backend:Client.memoryBackend(saved.generation.collections)});reader.boot();
 assert.deepEqual(reader.plan(),sourcePlan,'ACTUAL_SUSPENSION_COVERAGE_PRESERVES_NEWER_SOURCE');
 assert.equal(reader.acceptedPlanTransactions().length,1,'Old consent remains audit, not a second governing transaction');
 assert.equal(reader.rejectedLedger().length,1);assert.equal(reader.rejectedLedger()[0].op_id,rejected.op_id);
 assert.equal(reader.outbox().length,0);assert.equal(Object.hasOwn(reader.plan(),'kcal'),false,'Actual rejected consent cannot govern after authenticated recovery');
 assert.equal(reader.face().history.length,1);assert(!/Undone|Reversed/.test(reader.face().history[0].copy));
});
