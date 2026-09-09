import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,Client,config} from '../support.mjs';
import T2 from '../../t2-stage.cjs';
import {StorageFailure} from '../../repository.mjs';
import {isDeepStrictEqual as equal} from 'node:util';

// Narrow internal assembler tests. These source rows are deliberately synthetic
// stand-ins, NOT signed profile/transport evidence. local.test.mjs and the native
// runner exercise that authentication boundary against the actual Worker/D1.
function setup(){
  const generation=initial(),op={op_id:'kept',athlete_id:'ath-1',device_id:'dev-A',device_seq:1,
    canonical_content_commitment:'synthetic',kind:'fact',class:'reading',payload:{value:1}};
  const backend=Client.memoryBackend(generation.collections),store=new Client.Store(backend);
  assert(store.transaction(tx=>{tx.put('ops',op.op_id,op);tx.put('outbox',op.op_id,{op_id:op.op_id,order:1});}).ok);
  generation.collections=structuredClone(T2.snapshotBackend(backend,Object.keys(generation.collections)));
  const disposition={op_id:op.op_id,status:'ACCEPTED',athlete_log_seq:1,accepted_at:'2026-09-06T12:00:00Z'};
  const row={seq:1,op,accepted_at:disposition.accepted_at},proof={reference:{attempt:'synthetic',manifestDigest:'synthetic'},request_bytes_b64:'synthetic'};
  const source={equal,fail:code=>{throw new StorageFailure(code,18);},assertContext(){},W:1,athleteId:'ath-1',archiveProof:proof,
    async operations(visit){await visit(op,disposition);},async accepted(visit){await visit(row);}};
  return {generation,source,op,disposition,row,proof};
}
test('internal candidate excludes server-only nonaccepted rows from local sequence allocation',async()=>{
  const x=setup(),foreign={...x.op,op_id:'never-created-local',device_seq:1000000},waiting={...foreign,op_id:'remote-waiting',device_seq:1000001};
  x.source.operations=async visit=>{await visit(x.op,x.disposition);await visit(foreign,{op_id:foreign.op_id,status:'REJECTED'});await visit(waiting,{op_id:waiting.op_id,status:'WAITING'});};
  const before=structuredClone(x.generation),candidate=structuredClone(await T2.prepareRecoveryProjection(x.generation,x.source));
  assert.deepEqual(Object.keys(candidate.collections.ops),['kept']);assert.deepEqual(Object.keys(candidate.collections.dispositions),['kept']);
  assert.deepEqual(candidate.collections.rejected||{},{});assert.deepEqual(x.generation,before);
  const backend=Client.memoryBackend(candidate.collections),client=Client.createClient({...config(),backend});client.boot();
  assert.equal(backend.get('meta','device')?.seq,undefined,'Assembly does not manufacture a saved device sequence');
  const next=client.weighIn({lb:171});assert(next.acknowledged);assert.equal(Math.max(...backend.keys('ops').map(id=>backend.get('ops',id).device_seq)),2);
});
test('internal candidate preserves extra local fields and identical proof without duplication',async()=>{
  const x=setup();x.generation.metadata.recoveryArchives=[x.proof];
  x.generation.collections.meta.checkpoint.future='kept';x.generation.collections.sync.frontier.future='kept';
  x.generation.collections.receipts={'1':{seq:1,op_id:x.op.op_id,canonical_content_commitment:x.op.canonical_content_commitment,accepted_at:x.row.accepted_at,future:'kept',op:x.op}};
  const candidate=structuredClone(await T2.prepareRecoveryProjection(x.generation,x.source));
  assert.deepEqual(candidate.collections.receipts,x.generation.collections.receipts);
  assert.equal(candidate.collections.meta.checkpoint.future,'kept');assert.equal(candidate.collections.sync.frontier.future,'kept');assert.equal(candidate.metadata.recoveryArchives.length,1);
});
for(const [name,change,code]of[
  ['frontier regression',x=>{x.generation.collections.sync.frontier.W=2;},'RECOVERY_FRONTIER_REGRESSION'],
  ['known head regression',x=>{x.generation.collections.sync.frontier.authorityW=2;},'RECOVERY_FRONTIER_REGRESSION'],
  ['terminal contradiction on queued original',x=>{x.generation.collections.dispositions={kept:{...x.disposition,status:'REJECTED'}};},'LOCAL_TERMINAL_DISAGREEMENT'],
  ['rejection contradiction',x=>{x.generation.collections.rejected={kept:{status:'REJECTED'}};},'LOCAL_REJECTION_DISAGREEMENT'],
  ['receipt disagreement',x=>{x.generation.collections.receipts={'1':{seq:1,op_id:'other'}};},'RECOVERY_RECEIPT_DISAGREEMENT'],
  ['original disagreement',x=>{x.source.operations=async visit=>visit({...x.op,payload:{value:2}},x.disposition);},'RECOVERY_ORIGINAL_DISAGREEMENT'],
  ['log order gap',x=>{x.source.accepted=async visit=>visit({...x.row,seq:2});},'RECOVERY_RECEIPT_ORIGINAL'],
  ['missing final receipt',x=>{x.source.accepted=async()=>{};},'RECOVERY_RECEIPT_FRONTIER'],
  ['extra retained receipt',x=>{x.generation.collections.receipts={'99':{seq:99}};},'RECOVERY_RECEIPT_FRONTIER'],
  ['proof disagreement',x=>{x.generation.metadata.recoveryArchives=[{...x.proof,request_bytes_b64:'different'}];},'RECOVERY_ARCHIVE_DISAGREEMENT'],
  ['missing integrity checkpoint',x=>{delete x.generation.collections.meta.checkpoint;},'RECOVERY_CANDIDATE_INTEGRITY'],
])test('internal candidate refuses '+name+' without partial publication',async()=>{
  const x=setup();change(x);const before=structuredClone(x.generation);
  await assert.rejects(T2.prepareRecoveryProjection(x.generation,x.source),e=>e.state===18&&e.code===code);assert.deepEqual(x.generation,before);
});
test('internal candidate refuses context loss after staged operations and before memory commit',async()=>{
  const x=setup();let lost=false;x.source.assertContext=()=>{if(lost)throw new StorageFailure('SYNTHETIC_STANDING_LOSS',17);};
  x.source.accepted=async visit=>{await visit(x.row);lost=true;};const before=structuredClone(x.generation);
  await assert.rejects(T2.prepareRecoveryProjection(x.generation,x.source),e=>e.state===17);assert.deepEqual(x.generation,before);
});
test('internal candidate awaits all source rows; async source failure cannot publish partial state',async()=>{
  const x=setup();x.source.operations=async visit=>{await visit(x.op,x.disposition);await Promise.resolve();throw new StorageFailure('SYNTHETIC_ROW_READ_FAILURE',18);};
  const before=structuredClone(x.generation);await assert.rejects(T2.prepareRecoveryProjection(x.generation,x.source),e=>e.code==='SYNTHETIC_ROW_READ_FAILURE');assert.deepEqual(x.generation,before);
});
