'use strict';
// Focused adapter tests. These do NOT spin workerd and do NOT award a resource
// verdict: they calibrate that the wrapper's detection and refusal paths work,
// so a measured run that reports PASS cannot be a detector stuck at PASS.
const {test}=require('node:test'),assert=require('node:assert/strict');
const A=require('./rows-resource.cjs');

const entry=over=>({label:'x',guardedCpuMs:100,stats:{statements:6,batchMaxWallMs:44,domainWrites:0},...over});

test('ROWS-V3 ADAPTER — the agreed ceilings are the original ones, unrelaxed',()=>{
  assert.deepEqual(A.CEILINGS,{cpuMs:1000,observedAllocationBytes:96*1024*1024,statements:1000,batchMs:30000,domainWrites:0});
});

test('ROWS-V3 ADAPTER — an in-budget request and phase raise nothing',()=>{
  assert.deepEqual(A.requestViolations(A.CEILINGS,entry()),[]);
  assert.deepEqual(A.phaseViolations(A.CEILINGS,{name:'p',observedPeakBytes:56329746}),[]);
  assert.equal(A.verdictFor([]),'PASS');
});

test('ROWS-V3 ADAPTER — every ceiling class is actually detected',()=>{
  const codes=e=>A.requestViolations(A.CEILINGS,e).map(v=>v.code);
  assert.deepEqual(codes(entry({guardedCpuMs:1001})),['CPU_CEILING']);
  assert.deepEqual(codes(entry({guardedCpuMs:1000})),[],'the ceiling itself is not a violation');
  assert.deepEqual(codes(entry({stats:{statements:1001,batchMaxWallMs:0,domainWrites:0}})),['STATEMENT_CEILING']);
  assert.deepEqual(codes(entry({stats:{statements:1,batchMaxWallMs:30000,domainWrites:0}})),['BATCH_CEILING']);
  assert.deepEqual(codes(entry({stats:{statements:1,batchMaxWallMs:0,domainWrites:1}})),['DOMAIN_WRITE']);
  const memory=A.phaseViolations(A.CEILINGS,{name:'p',observedPeakBytes:96*1024*1024+1});
  assert.deepEqual(memory.map(v=>v.code),['OBSERVED_ALLOCATION_CEILING']);
  assert.equal(A.verdictFor(memory),'FAIL');
});

test('ROWS-V3 ADAPTER — the observed 151,260,366-byte peak is detected, not passed',()=>{
  // The value actually measured by the near-row/key-limit attempt.
  const v=A.phaseViolations(A.CEILINGS,{name:'rows-v3-near-row-key-limit-attempt',observedPeakBytes:151260366});
  assert.equal(v.length,1);assert.equal(A.verdictFor(v),'FAIL');
  // and the valid-account peaks are genuinely inside the same ceiling
  for(const peak of [56329746,74374147])assert.deepEqual(A.phaseViolations(A.CEILINGS,{name:'p',observedPeakBytes:peak}),[]);
});

test('ROWS-V3 ADAPTER — the inventory fold is order- and boundary-sensitive',()=>{
  const of=parts=>{const f=A.createInventoryFold();for(const [c,i,v] of parts)f.fold(c,Buffer.from(i),Buffer.from(v));return f.result();};
  const base=of([['history','a','bc'],['log','d','e']]);
  assert.equal(base.rows,2);assert.equal(base.bytes,1+2+1+1);
  assert.notEqual(of([['log','d','e'],['history','a','bc']]).digest,base.digest,'row order must matter');
  // Length framing: a shifted field boundary must not collide.
  assert.notEqual(of([['history','ab','c'],['log','d','e']]).digest,base.digest);
  assert.notEqual(of([['history','a','bc']]).digest,base.digest,'a dropped row must not collide');
  assert.equal(of([['history','a','bc'],['log','d','e']]).digest,base.digest,'identical input is stable');
});

test('ROWS-V3 ADAPTER — incomplete or invalid recovery is refused, never reported successful',()=>{
  const expected={rows:3,bytes:30,digest:'D'};
  const manifest={collection_counts:[['history',2],['log',1]]};
  const complete={manifest,cumulativeCounts:[2,1],observed:{rows:3,bytes:30,digest:'D'},expected};
  assert.equal(A.assertCompleteInventory(complete),true);
  const refuses=(over,code)=>assert.throws(()=>A.assertCompleteInventory({...complete,...over}),e=>e.message===code||
    (code==='ROWS_INCOMPLETE'&&e.message.startsWith('ROWS_INCOMPLETE_')),code);
  refuses({cumulativeCounts:[1,1]},'ROWS_INCOMPLETE');                       // a short collection
  refuses({cumulativeCounts:[2]},'ROWS_COUNT_SHAPE');                        // a truncated count vector
  refuses({observed:{rows:2,bytes:30,digest:'D'}},'ROWS_COUNT_MISMATCH');    // a dropped row
  refuses({observed:{rows:3,bytes:29,digest:'D'}},'ROWS_BYTE_COUNT_MISMATCH');
  refuses({observed:{rows:3,bytes:30,digest:'TAMPERED'}},'ROWS_BYTE_IDENTITY_MISMATCH');
});

test('ROWS-V3 ADAPTER — a false finish that under-reports counts cannot pass',()=>{
  // Manifest says the cut holds 5 history rows; the traversal claims 2 and stops.
  assert.throws(()=>A.assertCompleteInventory({manifest:{collection_counts:[['history',5]]},
    cumulativeCounts:[2],observed:{rows:2,bytes:10,digest:'D'},expected:{rows:2,bytes:10,digest:'D'}}),
    e=>e.message==='ROWS_INCOMPLETE_history');
});
