import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {initial,config,Client} from './support.mjs';
import T2 from '../t2-stage.cjs';
const require=createRequire(import.meta.url),Ops=require('../../../client/ops.cjs');

for(const status of ['REJECTED','REJECTED_DEPENDENCY'])test('rejected initial-plan consent is retained in audit but cannot govern '+status,()=>{
 const cfg=config(),generation=initial(),backend=Client.memoryBackend(generation.collections),client=Client.createClient({...cfg,backend});client.boot();
 assert(client.logSet({lift:'Press',load:155,reps:5}).acknowledged);
 const choice=client.acceptInitialPlan('from-session');assert(choice.acknowledged);
 const op=client.envelope(choice.op_id),consent=backend.get('planTransactions',op.requested_transaction_id);
 assert.equal(client.plan().press,155);
 const d={op_id:op.op_id,device_id:op.device_id,device_seq:op.device_seq,canonical_content_commitment:op.canonical_content_commitment,status,rejection_code:'SYNTHETIC_REJECTION',decided_at:cfg.clock.now()};
 d.authority_signature=Ops.signatureOver(cfg.authorityKey,'earned/disposition/v1',d,'authority_signature');
 assert(client.deliverDisposition(d).rejected);client.restart();
 assert.equal(Object.hasOwn(client.plan()||{},'press'),false,'REJECTED_CONSENT_CANNOT_GOVERN');
 assert(!client.acceptedPlanTransactions().some(t=>t.op_id===op.op_id));
 assert.deepEqual(backend.get('planTransactions',op.requested_transaction_id),consent);
 assert.deepEqual(backend.get('ops',op.op_id),op);assert.equal(client.rejectedLedger().length,1);
});

test('verified source suspension covers old fallback without losing newer source fields or audit',()=>{
 const x=setup(),backend=Client.memoryBackend(x.saved.collections),client=Client.createClient({...x.cfg,backend});client.boot();
 client.planHistory([{txn_id:'synthetic-base',members:[{field:'protein_g',value:150,provenance:'athlete_edited'},{field:'sets',value:3,provenance:'athlete_edited'}],parents:[]},
  {txn_id:x.op.requested_transaction_id,members:x.op.members,parents:['synthetic-base']}]);
 assert(client.conflictSuspend(x.op.requested_transaction_id).suspended);
 const retained=backend.get('suspensions',x.op.requested_transaction_id);
 const source={plan:{protein_g:165,sets:5},planTransactionIds:[x.op.requested_transaction_id],planSuspendedTransactionIds:[x.op.requested_transaction_id],
  planTransactionSources:[{txn_id:x.op.requested_transaction_id,op_id:x.op.op_id}],recoveryPlan:{profile:'earned/recovered-plan-snapshot/v1',W:1}};
 assert(client.receiveSnapshot(source).stored);client.restart();
 assert.deepEqual(client.plan(),source.plan,'SOURCE_SUSPENSION_CANNOT_REPLAY_OLD_WHOLE_PLAN');
 assert.deepEqual(backend.get('suspensions',x.op.requested_transaction_id),retained);assert.equal(client.face().history.length,1);
 assert(client.planEdit({domain:'protein_g',value:180,unit:'g/day'}).acknowledged);assert.equal(client.plan().protein_g,180);
 for(const [name,change]of [
  ['no source suspension',s=>{s.planSuspendedTransactionIds=[];}],
  ['no effect source',s=>{delete s.planTransactionSources;}],
  ['different source original',s=>{s.planTransactionSources[0].op_id='unrelated';}],
  ['source before original',s=>{s.recoveryPlan.W=0;}],
  ['source frontier not held',s=>{s.recoveryPlan.W=2;}],
 ]){const changed=structuredClone(source);change(changed);assert(client.receiveSnapshot(changed).stored);client.restart();
  assert.equal(client.plan().sets,3,'Uncovered local suspension retained: '+name);}
 assert(client.receiveSnapshot(source).stored);client.restart();assert.deepEqual(client.plan(),{protein_g:180,sets:5});
});

// Actual T2 writes, receipt folding and fresh boot with synthetic source DTOs.
// This is the read-side reconciliation boundary, not authentication/activation.
function setup({fold=true,consent=false}={}){
 const cfg=config(),generation=initial(),backend=Client.memoryBackend(generation.collections),client=Client.createClient({...cfg,backend});client.boot();
 assert(client.planEdit({domain:'protein_g',value:155,unit:'g/day'}).acknowledged);
 const op=backend.get('ops',backend.keys('ops')[0]);
 const d={op_id:op.op_id,device_id:op.device_id,device_seq:op.device_seq,canonical_content_commitment:op.canonical_content_commitment,status:'ACCEPTED',athlete_log_seq:1,decided_at:cfg.clock.now()};
 d.authority_signature=Ops.signatureOver(cfg.authorityKey,'earned/disposition/v1',d,'authority_signature');
 assert(client.deliverDisposition(d).stored);
 client.deliverReceipts([{seq:1,op_id:op.op_id,canonical_content_commitment:op.canonical_content_commitment,accepted_at:cfg.clock.now()}]);
 if(fold){assert(client.receivePlanTransaction(op.op_id,{committed:true,effective:true,at:cfg.clock.now()}).stored);client.reduceThroughW();}
 if(consent){
  // Exact local consent shape; no claim this fixture came from initial-plan UI.
  const rec={op_id:op.op_id,txn_id:op.requested_transaction_id,members:op.members,provenance:'consented',version:op.requested_transaction_id};
  assert(new Client.Store(backend).transaction(tx=>{tx.put('plan','accepted',rec);tx.put('planTransactions',rec.txn_id,rec);}).ok);
 }
 const saved={collections:structuredClone(T2.snapshotBackend(backend,Object.keys(generation.collections))),metadata:generation.metadata};
 return {cfg,saved,op};
}
function reopen(x,change=()=>{}){
 const candidate=structuredClone(x.saved);
 candidate.collections.sync.snapshot={...candidate.collections.sync.snapshot,plan:{protein_g:165},planTransactionIds:[x.op.requested_transaction_id,'synthetic-later-authority-txn']};
 change(candidate);
 const backend=Client.memoryBackend(candidate.collections),client=Client.createClient({...x.cfg,backend});client.boot();return {client,backend,candidate};
}
for(const options of [{fold:true},{fold:false},{fold:true,consent:true}])test('source-covered plan is not replayed at fresh boot '+JSON.stringify(options),()=>{
 const x=setup(options),before=JSON.stringify(x.saved),{client,backend}=reopen(x);
 assert.equal(client.plan().protein_g,165,'RECOVERY_SOURCE_COVERED_PLAN_NOT_REPLAYED');
 assert.equal(client.acceptedPlanTransactions().length,1,'RECOVERY_SOURCE_COVERED_TRANSACTION_NOT_DUPLICATED');
 // Representation changes no facts, consent audit, disposition or saved table.
 for(const name of ['ops','dispositions','plan','planTransactions','planTxns'])for(const [id,value]of Object.entries(x.saved.collections[name]||{}))assert.deepEqual(backend.get(name,id),value);
 assert(client.planEdit({domain:'protein_g',value:180,unit:'g/day'}).acknowledged);
 assert.equal(client.plan().protein_g,180,'RECOVERY_PENDING_LOCAL_EDIT_STILL_GOVERNS');
 assert.equal(JSON.stringify(x.saved),before);
});
for(const [name,change]of[
 ['absent transaction ids',g=>delete g.collections.sync.snapshot.planTransactionIds],
 ['different transaction id',g=>g.collections.sync.snapshot.planTransactionIds=['unrelated']],
 ['missing original',g=>{delete g.collections.ops['op-dev-A-1'];g.collections.meta.checkpoint.counts.ops=0;}],
 ['missing disposition',g=>delete g.collections.dispositions['op-dev-A-1']],
 ['different disposition identity',g=>g.collections.dispositions['op-dev-A-1'].op_id='different'],
 ['different disposition commitment',g=>g.collections.dispositions['op-dev-A-1'].canonical_content_commitment='different'],
 ['unaccepted disposition',g=>g.collections.dispositions['op-dev-A-1'].status='WAITING'],
 ['not reduced through frontier',g=>{g.collections.sync.frontier.W=0;g.collections.receipts={};}],
 ['different original transaction id',g=>g.collections.ops['op-dev-A-1'].requested_transaction_id='different'],
])test('snapshot membership alone does not discard local projection: '+name,()=>{
 const x=setup(),{client}=reopen(x,change);
 assert.equal(client.plan().protein_g,155,'RECOVERY_UNPROVEN_COVERAGE_RETAINS_LOCAL');
 assert.equal(client.acceptedPlanTransactions().length,2);
});
test('accepted snapshot id cannot suppress an unsent operation',()=>{
 const x=setup(),{client,backend}=reopen(x);
 assert(client.planEdit({domain:'protein_g',value:180,unit:'g/day'}).acknowledged);
 const queued=backend.get('ops','op-dev-A-2');assert(queued);
 client.receiveSnapshot({plan:{protein_g:165},planTransactionIds:[x.op.requested_transaction_id,queued.requested_transaction_id]});
 assert.equal(client.plan().protein_g,180,'RECOVERY_UNACKNOWLEDGED_LOCAL_EDIT_RETAINED');
});
