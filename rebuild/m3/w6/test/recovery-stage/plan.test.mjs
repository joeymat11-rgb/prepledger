import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto,createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
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
const hash=x=>P.hash('recovery-plan-test',x);

test('browser plan reader preserves the pinned accepted pure source closure',()=>{
 const source=readFileSync(new URL('../../../../authority/plan.cjs',import.meta.url),'utf8');
 assert.equal(createHash('sha256').update(source).digest('hex'),'696c170f15c411ee0e7101032f6a508c7c3cb8eac4885241758c94331c01363a','accepted authority source changed: explicit requalification required');
 const block=(start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a);assert(a>=0&&b>a);return source.slice(a,b);};
 const declarations=['digest','basis','setField','fields'].map(name=>{const line=source.split('\n').find(l=>l.startsWith('const '+name+' ='));assert(line);return line+'\n';}).join('');
 const closure=declarations+'\n'+block('function compareKeys(', '// All graph identities')+block('function ancestry(', 'function causalPlanParents(')+block('function projection(', 'function append(');
 const reader=readFileSync(new URL('../../recovery-plan-reader.cjs',import.meta.url),'utf8');
 const body=reader.slice(reader.indexOf('const digest ='),reader.lastIndexOf('return { plan, planState, planTransactions };'));
 assert.equal(body,closure,'browser read closure differs from accepted authority');
});

test('real accepted stale conflict selection remains recoverable without inventing a plan transaction',async t=>{
 const runtime=await require('./test/r1-workerd.cjs').createR1Runtime({p1:true});t.after(()=>runtime.close());
 await runtime.bridge.initializeR1({first:{plan:{protein_g:150},devices:{}}},{'subject-first':'first'});
 const enroll=async id=>(await runtime.bridge.enrollScoped('subject-first',{intent_id:id,schema_version:1,nonce:hash(id)})).payload.issuance.lease;
 const lease=await enroll('plan-A'),other=await enroll('plan-B'),keys=[S.publicKeyOf(runtime.authorityKey)],device=lease.device_id;
 const build=(l,id,seq,extra)=>Ops.build({op_id:id,athlete_id:'first',device_id:l.device_id,device_seq:seq,lease_id:l.lease_id,
  effective:{local_date:'2026-09-06',local_time:'08:00',utc_offset:'-04:00'},kind:'plan-mutation',class:'plan',payload:null,
  plan:{domain:'protein',members:[{field:'protein_g',value:155,unit:'g/day',provenance:'athlete_edited'}]},...extra},runtime.identityKeys.first);
 const invoke=(method,args=[])=>runtime.bridge.invokeScoped('subject-first',device,method,['first',...args]);
 const first=build(lease,'synthetic-plan-A',1,{}),second=build(other,'synthetic-plan-B',1,{plan:{domain:'protein',members:[{field:'protein_g',value:165,unit:'g/day',provenance:'athlete_edited'}]}});
 assert.equal((await invoke('admit',[first])).status,'ACCEPTED');const observed=await invoke('planState',['protein']);
 assert.equal((await runtime.bridge.invokeScoped('subject-first',other.device_id,'admit',['first',second])).status,'ACCEPTED');
 const stale=build(lease,'synthetic-stale-selection',2,{kind:'conflict-selection',predecessor:first.op_id,parents:[first.op_id],
  extra:{conflict_domain_id:'protein',conflict_domain_lineage_id:'lin-protein-1',requested_transaction_id:'txn-synthetic-stale-selection',
   seen_conflict_basis:observed.basis,chosen_alternative_commitment:observed.memberSetCommitments[first.op_id]}});
 const terminal=await invoke('admit',[stale]);assert.equal(terminal.status,'ACCEPTED');assert.equal(terminal.applied,false);assert.equal(terminal.reason_code,'BASIS_STALE');
 const transactions=await invoke('planTransactions');assert.equal(transactions.length,2);assert(!transactions.some(x=>x.op_id===stale.op_id));
 assert.equal((await invoke('plan')).protein_g,155);
 const f=await fixture({namespace:'first/'+device});t.after(()=>f.repo.close());const generation=initial();generation.metadata.authorityLease=lease;
 // Original request retained in a synthetic local queue through the actual
 // Store. This does not claim an implemented conflict-selection UI.
 const backend=Client.memoryBackend(generation.collections),store=new Client.Store(backend);
 assert(store.transaction(tx=>{tx.put('ops',stale.op_id,stale);tx.put('outbox',stale.op_id,{op_id:stale.op_id,order:1});}).ok);
 generation.collections=T2.snapshotBackend(backend,Object.keys(generation.collections));
 await f.repo.initialize(generation,'synthetic-enrollment-only');const before=await f.repo.load();
 const scopeDigest=C.scopeDigest({issuer:runtime.issuer.config.issuer,origin:runtime.issuer.config.origins[0],subject:'subject-first',athleteId:'first',actorDeviceId:device});
 const client=createDurablePublicClient({repository:f.repo,stage:createT2Stage(()=>({...config(),athleteId:'first',deviceId:device,identityKey:runtime.identityKeys.first}),{allowInbound:true}),
  namespace:f.setup.namespace,athleteId:'first',deviceId:device,sessionEpoch:1,isCurrentSession:()=>true,observationEpoch:()=>1,observationGuard:{run:async(_kind,action)=>action()},validateCommit:()=>null,
  keys,crypto:webcrypto,permissionNowIso:()=>lease.not_before,recovery:{codec:C,protocol:P,scopeDigest,keyRange:IDBKeyRange}});
 const prepared=await client.prepareLocalRecovery();assert(prepared.prepared,prepared.code);const basis=prepared.basis;
 const stage=f.repo.recovery({codec:C,protocol:P,verificationKeys:keys,keyRange:IDBKeyRange,validateContext:()=>null}),verifier=P.createRowsVerifier({keys,subtle:webcrypto.subtle});let diagnostic,entered=false;
 let requestBytes,requestNumber=0;
 const options={stage,codec:C,protocol:P,newRequest:async()=>basis.request({nonce:hash(['request',++requestNumber]),contextId:hash('context')}),expected:req=>basis.expected(req),
  fetchPage:createRowsFetcher({baseURL:runtime.url,codec:C,protocol:P,headers:async()=>({Origin:runtime.issuer.config.origins[0],Authorization:'Bearer '+runtime.issuer.token('subject-first')})}),
  observeNegative:async(reply,context)=>{assert.equal(reply.status,200);assert((await verifier.verify(reply.bodyBytes,{expected:context.expected,previousCursor:context.previousCursor})).verified);},
  validateProfile:async input=>{entered=true;requestBytes=C.bytes(input.requestBytes);try{return await basis.reconcile(input);}catch(e){diagnostic=e.code;throw e;}}};
 const result=await createRowsRecovery(options).run();
 assert(entered,'Real complete signed inventory reaches the candidate profile');
 assert(result.evidenceReady,'Recovery of a retained non-applied selection: '+result.reason+' / '+diagnostic);
 const held=await result.evidence.assemble();
 assert.equal(held.sourcePlanProjected,true);assert.equal(held.projectionPending,true);assert.equal(held.activated,false);
 const expectedPlan=await invoke('plan'),expectedState=await invoke('planState',['protein']);
 await held.inspectSourcePlan(projected=>{
  assert.deepEqual(projected.plan,expectedPlan,'RECOVERY_SOURCE_PLAN_EXACT');
  assert.deepEqual(projected.domains.protein,expectedState,'RECOVERY_SOURCE_CONFLICT_EXACT');
  assert.equal(projected.W,3);
  assert.deepEqual(projected.transactionIds,transactions.map(x=>x.txn_id));
  assert(!projected.transactionIds.includes(stale.requested_transaction_id),'ACCEPTED_NO_EFFECT_IS_NOT_A_TRANSACTION');
  projected.plan.protein_g=-1;
 });
 await held.inspectSourcePlan(projected=>assert.deepEqual(projected.plan,expectedPlan,'SOURCE_PLAN_INSPECTION_IS_OWNED'));
 await held.inspect(candidate=>{
  assert.deepEqual(candidate.collections.dispositions[stale.op_id],terminal);assert.equal(candidate.collections.sync.frontier.W,3);
  assert(!Object.hasOwn(candidate.collections.outbox,stale.op_id),'Exact accepted no-effect request drains without inventing a plan effect');
  assert.equal(candidate.collections.planTxns,undefined);assert.equal(candidate.collections.plan,undefined);
  assert.deepEqual(candidate.collections.sync.snapshot,before.generation.collections.sync.snapshot,'No plan or consent may be invented from the no-effect receipt');
 });assert.deepEqual(await f.repo.load(),before);
 const current=await invoke('planState',['protein']);
 const selection=build(lease,'synthetic-current-selection',3,{kind:'conflict-selection',predecessor:stale.op_id,parents:[first.op_id,second.op_id],
  extra:{conflict_domain_id:'protein',conflict_domain_lineage_id:'lin-protein-1',requested_transaction_id:'txn-synthetic-current-selection',
   seen_conflict_basis:current.basis,chosen_alternative_commitment:current.memberSetCommitments[second.op_id]}});
 const applied=await invoke('admit',[selection]);assert.equal(applied.status,'ACCEPTED');assert.equal(applied.applied,true);assert.equal((await invoke('plan')).protein_g,165);
 const secondRecovery=await createRowsRecovery(options).run({explicitRetry:true});assert(secondRecovery.evidenceReady,secondRecovery.reason+' / '+diagnostic);
 const secondCandidate=await secondRecovery.evidence.assemble();
 const selectedPlan=await invoke('plan'),selectedState=await invoke('planState',['protein']);
 await secondCandidate.inspectSourcePlan(projected=>{
  assert.deepEqual(projected.plan,selectedPlan,'RECOVERY_APPLIED_SELECTION_EXACT');
  assert.deepEqual(projected.domains.protein,selectedState);assert.equal(projected.W,4);
  assert(projected.transactionIds.includes(selection.requested_transaction_id));
  assert(!projected.transactionIds.includes(stale.requested_transaction_id));
 });
 await secondCandidate.inspect(candidate=>{
  assert.equal(candidate.collections.sync.frontier.W,4);assert.deepEqual(candidate.collections.dispositions[selection.op_id],applied);
  assert.deepEqual(candidate.collections.sync.snapshot,before.generation.collections.sync.snapshot);
 });assert.deepEqual(await f.repo.load(),before);

 // Relational fault tests over captured synthetic rows, below page-signature
 // validation. Original disposition signatures remain verified. The positive
 // cases above are real signed HTTP/D1; these are not forged live responses.
 const inventory=await stage.inventory(),rows=[];await inventory.visit(row=>rows.push(row));const bindings=await inventory.bindings();
 const publicVerifier=require('./public-client.cjs').createPublicVerifier({keys,subtle:webcrypto.subtle});
 const expected=basis.expected(C.decodeRequest(requestBytes));
 function view(edited,historical=false){
  return {historicalOnly:historical,async visit(fn){for(const row of edited)await fn(structuredClone(row));},async scan(c,fn){for(const row of edited.filter(r=>r.collection===c))await fn(structuredClone(row));},
   async readRow(c,id){return structuredClone(edited.find(r=>r.collection===c&&r.row_id===id));},
   async bindings(){return {...bindings,manifest:{...bindings.manifest,collection_counts:P.COLLECTIONS.map(c=>[c,edited.filter(r=>r.collection===c).length])}};},async assertCurrent(){},async assertIntact(){}};
 }
 const validate=(edited,historical=false)=>(historical?validateArchivedRecoveryProfile:validateRecoveryProfile)({inventory:view(edited,historical),codec:C,protocol:P,publicVerifier,requestBytes,expected});
 await t.test('complete retained applied and non-applied selections validate as current and historical evidence',async()=>{
  for(const historical of [false,true])assert.equal((await(await validate(rows,historical)).summary()).W,4);
 });
 function transactionFor(edited,op){return edited.find(r=>r.collection==='transactions'&&C.parse(r.value).op_id===op.op_id);}
 function alterNoEffect(edited,fn){
  const original=edited.find(r=>r.collection==='operations'&&r.row_id===stale.op_id),record=C.parse(original.value);fn(record.disposition);
  record.disposition=S.signDisposition(record.disposition,runtime.authorityKey);original.value=JSON.stringify(record);
  edited.find(r=>r.collection==='history'&&r.row_id===JSON.stringify([stale.op_id,record.historyCount])).value=JSON.stringify(record.disposition);
 }
 for(const [name,mutate]of[
  ['missing direct-edit transaction',edited=>edited.splice(edited.indexOf(transactionFor(edited,first)),1)],
  ['missing applied-selection transaction',edited=>edited.splice(edited.indexOf(transactionFor(edited,selection)),1)],
  ['phantom effect for a non-applied selection',edited=>{const row=structuredClone(transactionFor(edited,selection)),value=C.parse(row.value);row.row_id=stale.requested_transaction_id;Object.assign(value,{txn_id:row.row_id,op_id:stale.op_id,seq:3});row.value=JSON.stringify(value);edited.push(row);}],
  ['unrecognized no-effect reason',edited=>alterNoEffect(edited,d=>{d.reason_code='SYNTHETIC_UNKNOWN';})],
  ['false applied marker hidden by another type',edited=>alterNoEffect(edited,d=>{d.applied='false';})],
 ])await t.test(name+' refuses rather than broadening the no-effect exception',async()=>{
  const edited=structuredClone(rows);mutate(edited);await assert.rejects(validate(edited),e=>e.code==='RETAINED_INTEGRITY');
 });
});
