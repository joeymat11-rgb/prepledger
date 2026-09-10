import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createReadingProjector} from '../reading-history.mjs';
import {Client,config} from './support.mjs';
// Actual T2 envelopes/model/face, with deliberately synthetic retained receipt
// fixtures. Source-import.test.mjs covers actual signed authority/recovery.
const project=createReadingProjector({athleteId:'ath-1',deviceId:'dev-A'}),cfg=config();
let serial=0;
function op({device='dev-B',day='2026-09-04',kind='fact',value=171,target,parents=[]}={}){
  const n=++serial;return Client.ops.build({op_id:'reading-'+n,athlete_id:'ath-1',device_id:device,device_seq:n,
    parents,kind,class:'reading',target,lease_id:cfg.lease.lease_id,
    effective:{local_date:day,local_time:'08:00',utc_offset:'+00:00'},
    payload:kind==='fact'?{lb:{value,unit:'lb'}}:kind==='correction'?{replacement_fields:{lb:{value,unit:'lb'}}}:{reason:'synthetic removal'}},cfg.identityKey);
}
function input(accepted=[],pending=[]){
  return {operations:Object.fromEntries([...accepted,...pending].map(o=>[o.op_id,o])),
    dispositions:Object.fromEntries(accepted.map((o,i)=>[o.op_id,{op_id:o.op_id,canonical_content_commitment:o.canonical_content_commitment,status:'ACCEPTED',athlete_log_seq:i+1}])),
    receipts:Object.fromEntries(accepted.map((o,i)=>[String(i+1),{seq:i+1,op_id:o.op_id,canonical_content_commitment:o.canonical_content_commitment}])),
    frontier:{W:accepted.length,authorityW:accepted.length},outbox:Object.fromEntries(pending.map(o=>[o.op_id,{op_id:o.op_id}])),rejected:{}};
}
function reader(source,snapshot={},enabled=true){
  const collections={ops:source.operations,dispositions:source.dispositions,receipts:source.receipts,outbox:source.outbox,rejected:source.rejected,
    meta:{checkpoint:{counts:{ops:Object.keys(source.operations).length,outbox:Object.keys(source.outbox).length}}},
    sync:{frontier:source.frontier,snapshot}};
  const client=Client.createClient({...cfg,backend:Client.memoryBackend(collections),...(enabled?{readingProjector:project}:{})});client.boot();return client;
}
test('accepted remote and pending local records stay distinct without a same-date winning value',()=>{
  const a=op(),b=op({device:'dev-A',value:172}),source=input([a],[b]),before=structuredClone(source),view=project(source);
  assert.deepEqual(view.reads.map(r=>r.op_id),[a.op_id,b.op_id]);assert.deepEqual(view.acceptedReads.map(r=>r.op_id),[a.op_id]);
  assert.equal(view.days[0].interpretation,'DAILY_READING_RESOLUTION_REQUIRED');assert.equal(view.days[0].selection,null);
  assert.deepEqual(source,before);view.records[0].original.payload.lb.value=999;assert.equal(project(source).records[0].original.payload.lb.value,171);
});
test('remote correction followed by local correction/removal preserves accepted quantity and all originals',()=>{
  const a=op(),b=op({kind:'correction',target:a.op_id,parents:[a.op_id],value:172});
  const c=op({device:'dev-A',kind:'correction',target:a.op_id,parents:[a.op_id,b.op_id],value:173});
  let view=project(input([a,b],[c])),row=view.records[0];assert.equal(row.accepted.quantity.value,172);assert.equal(row.local.quantity.value,173);
  assert.deepEqual(row.effects.map(e=>e.original.op_id),[b.op_id,c.op_id]);assert.equal(row.original.payload.lb.value,171);
  const d=op({device:'dev-A',kind:'tombstone',target:a.op_id,parents:[a.op_id,b.op_id,c.op_id]});
  view=project(input([a,b],[c,d]));assert.equal(view.records[0].local.state,'removed');assert.equal(view.acceptedReads[0].lb,172);assert.equal(view.reads.length,0);
  const accepted=project(input([a,b,c,d]));assert.equal(accepted.acceptedReads.length,0);assert.equal(accepted.records[0].original.payload.lb.value,171);
});
test('concurrent corrections retain explicit unresolved facts rather than using receipt order',()=>{
  const a=op(),b=op({kind:'correction',target:a.op_id,parents:[a.op_id],value:172}),c=op({kind:'correction',target:a.op_id,parents:[a.op_id],value:173});
  for(const edits of [[b,c],[c,b]]){
    const view=project(input([a,...edits]));assert.equal(view.records[0].accepted.state,'unresolved');assert.equal(view.acceptedReads.length,0);
    assert(view.records[0].accepted.issues.includes('READING_CONCURRENT_EDITS'));assert.equal(view.records[0].effects.length,2);
  }
});
test('missing causal target, unsupported correction and rejected effect never replace an original',()=>{
  const a=op(),b=op({kind:'correction',target:a.op_id,value:172});
  assert(project(input([a,b])).records[0].local.issues.includes('READING_TARGET_CAUSAL_EDGE_REQUIRED'));
  const c=op({kind:'correction',target:a.op_id,parents:[a.op_id],value:173});c.payload.replacement_fields.extra=true;
  assert(project(input([a,c])).records[0].local.issues.includes('READING_REPLACEMENT_UNSUPPORTED'));
  const source=input([a],[b]);source.dispositions[b.op_id]={op_id:b.op_id,canonical_content_commitment:b.canonical_content_commitment,status:'REJECTED'};
  const view=project(source);assert.equal(view.records[0].local.quantity.value,171);assert.equal(view.records[0].effects[0].status,'rejected');
});
test('actual face does not promote a pending reading into freshness or machine calculations',()=>{
  for(const [day,board]of [['2026-09-01','STALE'],['2026-08-27','RE_ENTRY']]){
    const a=op({day}),snapshot={plan:{},reads:[{date:day}],trend:170,rate:-0.5,maintenance:2500,instruction:'synthetic old guidance',instructionDeps:['fact:reading'],asOf:day};
    const client=reader(input([a]),snapshot),before=client.face();assert.equal(before.layer2.board,board);
    const saved=client.weighIn({lb:174});assert(saved.acknowledged);const after=client.face();
    assert(after.layer1.reads.some(r=>r.op_id===saved.op_id),'New actual T2 operation immediately reaches current factual projection');
    assert.equal(after.layer2.board,board);assert.equal(after.layer2.paceCurrent,false);assert.equal(after.layer2.instruction,null);
    assert.equal(after.readingHistory.acceptedReads.length,1);assert.equal(after.layer2.trend,null);
  }
});
test('new accepted dates cannot freshen an old snapshot without an actual machine projection',()=>{
  const a=op({day:'2026-09-01'}),b=op(),view=reader(input([a,b]),{plan:{},reads:[{date:'2026-09-01'}],trend:170}).face();
  assert.equal(view.layer1.reads.length,2);assert.equal(view.layer2.board,'STALE');assert.equal(view.layer2.paceCurrent,false);
});

test('earlier-date effects withdraw dependent old computations even while a newer snapshot date remains',()=>{
  const a=op({day:'2026-09-01'}),b=op(),snapshot={plan:{},reads:[{date:'2026-09-01'},{date:'2026-09-04'}],trend:170,rate:-0.5,maintenance:2500,
    instruction:'old reading-dependent instruction',instructionDeps:['fact:reading'],outputs:[{id:'reading',deps:['fact:reading']},{id:'unrelated',deps:['fact:other']}],
    proposals:[{id:'reading',deps:['fact:reading']}],actionLoci:[{id:'reading',deps:['fact:reading']}]};
  for(const pending of [true,false]){
    const c=op({device:pending?'dev-A':'dev-B',day:'2026-09-01',kind:'correction',target:a.op_id,parents:[a.op_id],value:174});
    const view=reader(pending?input([a,b],[c]):input([a,b,c]),snapshot).face();
    assert.equal(view.layer2.missingDates,0);assert.equal(view.layer2.paceCurrent,false);
    for(const k of ['trend','rate','maintenance','instruction'])assert.equal(view.layer2[k],null);
    assert.deepEqual(view.layer2.outputs.map(o=>o.id),['unrelated']);assert.deepEqual(view.layer2.proposals,[]);assert.deepEqual(view.layer2.actionLoci,[]);
  }
});

test('orphan reading edits remain explicit without inventing an observation',()=>{
  const a=op({device:'dev-A',kind:'correction',target:'absent',parents:['absent']}),view=project(input([],[a]));
  assert.equal(view.records.length,1);assert.deepEqual(view.records[0].original,a);assert.equal(view.reads.length,0);
  assert.equal(view.records[0].local.state,'unresolved');assert.deepEqual(view.records[0].local.issues,['READING_TARGET_UNAVAILABLE']);
});

test('actual T2 correction and removal stay local and cannot silently resolve competing effects',()=>{
  const a=op(),client=reader(input([a]),{plan:{},reads:[{date:'2026-09-04'}]});
  const edit=client.correction(a.op_id,{lb:{value:174,unit:'lb'}});assert(edit.acknowledged);
  let view=client.face(),record=view.readingHistory.records[0];assert.equal(record.accepted.quantity.value,171);assert.equal(record.local.quantity.value,174);
  const remove=client.tombstone(a.op_id,'Synthetic removal');assert(remove.acknowledged);
  record=client.face().readingHistory.records[0];assert.equal(record.local.state,'unresolved');
  assert(record.local.issues.includes('READING_CONCURRENT_EDITS'));assert.deepEqual(record.effects.map(e=>e.original.op_id),[edit.op_id,remove.op_id]);
});

test('pending withdrawal of the sole accepted date cannot turn no dates into fresh old guidance',()=>{
  const a=op(),b=op({device:'dev-A',kind:'tombstone',target:a.op_id,parents:[a.op_id]});
  const view=reader(input([a],[b]),{plan:{},reads:[{date:'2026-09-04'}],trend:170,rate:-0.5,maintenance:2500,instruction:'synthetic old guidance'}).face();
  assert.equal(view.layer1.reads.length,0);assert.equal(view.layer2.paceCurrent,false);assert.equal(view.layer2.readingResolutionRequired,true);
  for(const k of ['trend','rate','maintenance','instruction'])assert.equal(view.layer2[k],null);assert.equal(view.readingHistory.acceptedReads.length,1);
});
test('default T2 path is unchanged and a malformed projector cannot masquerade as a valid view',()=>{
  const a=op(),b=op({device:'dev-A',value:172}),source=input([a],[b]);
  assert.deepEqual(reader(source,{},false).face().layer1.reads.map(r=>r.op_id),[b.op_id]);
  assert.equal(reader(source,{},false).face().readingHistory,undefined);
  const bad=Client.createClient({...cfg,readingProjector:()=>({profile:'earned/reading-projection/v1'})});
  bad.boot();assert.throws(()=>bad.face(),{code:'READING_PROJECTION_INVALID'});
});
test('broken prefix or mismatched original disposition refuses before factual output',()=>{
  const a=op(),source=input([a]);source.receipts['1'].canonical_content_commitment='changed';assert.throws(()=>project(source),{code:'READING_PROJECTION_RECEIPT'});
  const missing=input([a]);delete missing.receipts['1'];assert.throws(()=>project(missing),{code:'READING_PROJECTION_PREFIX'});
  const changed=input([a]);changed.dispositions[a.op_id].op_id='other';assert.throws(()=>project(changed),{code:'READING_PROJECTION_DISPOSITION'});
});
