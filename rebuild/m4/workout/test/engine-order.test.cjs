'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {orderWorkoutStarts}=require('../engine-order.cjs');
// Declared synthetic authenticated-host inputs; these tests do not verify wire signatures.
function input(spec){
 const ops={},receipts={},sessions=[];let seq=0;
 for(const [id,parents=[],accepted=true,kind='session-start'] of spec){
  const op={op_id:id,athlete_id:'synthetic-athlete',kind,causal_parents:parents,
   device_seq:100-seq,device_predecessor_op_id:null,effective:{local_date:'2030-01-01',local_time:'12:00',utc_offset:'-05:00'}};
  ops[id]=op;const position=accepted?++seq:null;if(accepted)receipts[id]={op_id:id,seq:position};
  if(kind==='session-start')sessions.push({start:{operation:structuredClone(op),status:accepted?'accepted-through-frontier':'stored-on-this-device',...(accepted?{receipt_sequence:position}:{})}});
 }
 return {history:{frontier:seq,sessions},generation:{collections:{ops,receipts,sync:{frontier:{W:seq}}}}};
}
const run=x=>orderWorkoutStarts(x.history,x.generation),ids=x=>run(x).start_ids;
function replaceOp(x,id,change){Object.assign(x.generation.collections.ops[id],change);const row=x.history.sessions.find(s=>s.start.operation.op_id===id);if(row)row.start.operation=structuredClone(x.generation.collections.ops[id]);}
test('causality orders offline Starts through intermediate records, without receipt tie-break',()=>{
 const x=input([['first',[],false],['set',['first'],false,'session-set'],['last',['set'],false]]),before=JSON.stringify(x);
 x.history.sessions.reverse();assert.deepEqual(ids(x),['first','last']);x.history.sessions.reverse();assert.equal(JSON.stringify(x),before);
});
test('same-day concurrent accepted Starts retain identities in actual log order',()=>{
 const x=input([['z-start'],['a-start']]);x.history.sessions.reverse();assert.deepEqual(ids(x),['z-start','a-start']);
 assert.deepEqual(Object.keys(run(x)).sort(),['frontier','profile','start_ids']); // No partition or eligibility grant.
});
test('clocks, timezones, device order and map insertion cannot reorder accepted concurrency',()=>{
 for(const times of [['2030-01-02','00:01','+14:00','2029-12-31','23:59','-12:00'],['2030-03-10','02:30','-04:00','2030-03-10','01:30','-05:00']]){
  const x=input([['z'],['a']]);replaceOp(x,'z',{effective:{local_date:times[0],local_time:times[1],utc_offset:times[2]},device_seq:999,device_predecessor_op_id:'a'});
  replaceOp(x,'a',{effective:{local_date:times[3],local_time:times[4],utc_offset:times[5]},device_seq:1});
  x.generation.collections.ops=Object.fromEntries(Object.entries(x.generation.collections.ops).reverse());x.history.sessions.reverse();
  assert.deepEqual(ids(x),['z','a']);
 }
});
test('causality wins over transport order and does not require every local descendant accepted',()=>{
 const x=input([['a'],['b',['a'],false],['c',['b'],false]]);x.history.sessions.reverse();assert.deepEqual(ids(x),['a','b','c']);
});
test('unaccepted concurrent Starts cannot use device predecessor, clock or spelling as semantic tie-break',()=>{
 const x=input([['a',[],false],['b',[],false]]);replaceOp(x,'b',{device_predecessor_op_id:'a',device_seq:2});
 assert.throws(()=>run(x),{code:'WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED'});
});
test('accepted and local concurrent Starts remain unresolved',()=>{
 assert.throws(()=>run(input([['accepted'],['local',[],false]])),{code:'WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED'});
});
test('cycle through an intermediate operation fails',()=>{
 const x=input([['a',['middle']],['middle',['a'],true,'session-set']]);assert.throws(()=>run(x),{code:'WORKOUT_ORDER_CAUSAL_CYCLE'});
});
test('missing parent fails instead of treating a Start as independent',()=>{
 assert.throws(()=>run(input([['a',['missing']]])),{code:'WORKOUT_ORDER_CAUSAL_INPUT_UNPROVEN'});
});
test('receipt/frontier and history basis remain exact',()=>{
 const x=input([['a'],['b']]);x.history.frontier=1;assert.throws(()=>run(x),{code:'WORKOUT_ORDER_BASIS_INVALID'});
 x.history.frontier=2;delete x.generation.collections.receipts.a;assert.throws(()=>run(x),{code:'WORKOUT_ORDER_PREFIX_INCOMPLETE'});
});
test('duplicate log positions and unproved accepted status fail',()=>{
 const x=input([['a'],['b']]);x.generation.collections.receipts.b.seq=1;assert.throws(()=>run(x),{code:'WORKOUT_ORDER_PREFIX_INCOMPLETE'});
 x.generation.collections.receipts.b.seq=2;x.history.sessions[1].start.receipt_sequence=1;assert.throws(()=>run(x),{code:'WORKOUT_ORDER_RECEIPT_INVALID'});
});
test('foreign ancestry is refused, not used to order private Starts',()=>{
 const x=input([['a',['foreign']],['foreign',[],true,'fact']]);replaceOp(x,'foreign',{athlete_id:'other-synthetic-athlete'});
 assert.throws(()=>run(x),{code:'WORKOUT_ORDER_CAUSAL_INPUT_UNPROVEN'});
});
test('unresolved standing/status is not translated into a missing workout',()=>{
 const x=input([['a']]);x.history.sessions[0].start.status='stored-status-unresolved';assert.throws(()=>run(x),{code:'WORKOUT_ORDER_STATUS_UNRESOLVED'});
});
test('empty complete history yields an empty order, not a first-use declaration',()=>{
 assert.deepEqual(run(input([])),{profile:'earned/workout-order/v1',frontier:0,start_ids:[]});
});
test('accepted label alone without a receipt does not establish acceptance',()=>{
 const x=input([['a',[],false]]);x.history.sessions[0].start.status='accepted-through-frontier';
 assert.throws(()=>run(x),{code:'WORKOUT_ORDER_RECEIPT_INVALID'});
});
test('diamond ancestry remains a DAG and each Start appears once',()=>{
 const x=input([['a',[],false],['left',['a'],false,'fact'],['right',['a'],false,'fact'],['b',['left','right'],false]]);
 assert.deepEqual(ids(x),['a','b']);
});
test('import checkpoint is joined only through actual causal ancestry',()=>{
 const x=input([['activation',[],true,'fact'],['a',['activation']],['between',['a'],true,'session-set'],['b',['between'],false]]);
 const anchor={source_generation_id:'synthetic-import-generation',activation_op_id:'activation'},before=JSON.stringify(x);
 const result=orderWorkoutStarts(x.history,x.generation,{importAnchor:anchor});
 assert.deepEqual(result.start_ids,['a','b']);assert.deepEqual(result.import_anchor,anchor);assert.equal(JSON.stringify(x),before);
 result.import_anchor.source_generation_id='changed';assert.equal(anchor.source_generation_id,'synthetic-import-generation');
});
test('a later log position or date cannot impersonate import descent',()=>{
 const x=input([['activation',[],true,'fact'],['later']]);
 assert.throws(()=>orderWorkoutStarts(x.history,x.generation,{importAnchor:{source_generation_id:'synthetic-import',activation_op_id:'activation'}}),
  {code:'WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN'});
});
test('all root Starts must descend from the selected import activation',()=>{
 const x=input([['activation',[],true,'fact'],['a',['activation']],['unrelated'],['b',['a']]]);
 assert.throws(()=>orderWorkoutStarts(x.history,x.generation,{importAnchor:{source_generation_id:'synthetic-import',activation_op_id:'activation'}}),
  {code:'WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN'});
});
test('an unaccepted activation is not an import checkpoint',()=>{
 const x=input([['activation',[],false,'fact'],['a',['activation'],false]]);
 assert.throws(()=>orderWorkoutStarts(x.history,x.generation,{importAnchor:{source_generation_id:'synthetic-import',activation_op_id:'activation'}}),
  {code:'WORKOUT_ORDER_IMPORT_ANCHOR_UNPROVEN'});
});
test('named semantic-order faults are behaviorally detected without changing retained source',()=>{
 const fs=require('node:fs'),Module=require('node:module'),filename=require.resolve('../engine-order.cjs'),original=fs.readFileSync(filename,'utf8');
 const faults=[
  ['ready.sort((a, b) => sequence.get(a) - sequence.get(b));','ready.sort();',f=>{
   const x=input([['z'],['a']]);assert.deepEqual(f(x.history,x.generation).start_ids,['z','a'],'LOG_SEQUENCE_NOT_ID');}],
  ["if (ready.some(id => !sequence.has(id))) fail('WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED');",'/* missing authoritative concurrent tie guard */',f=>{
   const x=input([['a',[],false],['b',[],false]]);assert.throws(()=>f(x.history,x.generation),{code:'WORKOUT_ORDER_CONCURRENT_LOCAL_UNRESOLVED'},'LOCAL_CONCURRENCY_NOT_ORDERED');}],
  ['if (starts.has(parent)) need.add(parent);','if (starts.has(parent)) { /* lost causal dependency */ }',f=>{
   const x=input([['a',[],false],['b',['a'],false]]);let result;assert.doesNotThrow(()=>{result=f(x.history,x.generation);},'CAUSAL_LOCAL_CHAIN_MUST_SUCCEED');
   assert.deepEqual(result.start_ids,['a','b'],'CAUSAL_LOCAL_CHAIN_MUST_SUCCEED');}],
  ["fail('WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN');",'void 0;',f=>{
   const x=input([['activation',[],true,'fact'],['later']]);
   assert.throws(()=>f(x.history,x.generation,{importAnchor:{source_generation_id:'synthetic-import',activation_op_id:'activation'}}),
    {code:'WORKOUT_ORDER_IMPORT_DESCENT_UNPROVEN'},'IMPORT_DESCENT_REQUIRED');}]
 ];
 for(const [before,after,probe]of faults){assert.equal(original.split(before).length,2);const m=new Module(filename,module);
  m._compile(original.replace(before,after),filename);let failure;try{probe(m.exports.orderWorkoutStarts);}catch(error){failure=error;}
  assert.equal(failure?.code,'ERR_ASSERTION','Effective behavioral fault, not syntax/load failure');
 }
 assert.equal(fs.readFileSync(filename,'utf8'),original,'Retained module unchanged');
});
