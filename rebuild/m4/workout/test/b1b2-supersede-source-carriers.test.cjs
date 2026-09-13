'use strict';
// New evidence; no original carrier, fixture, or runtime byte is rewritten.
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./b1b2-evidence.cjs');
test('B1B2/SOURCE-1 preserved M/R eight-file literal forward and inverse construction',()=>{
  const rows=H.reconstructRuntime();assert.equal(rows.length,8);assert.equal(rows.reduce((n,r)=>n+r.hunks,0),65);
});
test('B1B2/SOURCE-2 original H3 four-hunk construction and retained sites',()=>assert.equal(H.reconstructH3(),4));
test('B1B2/SOURCE-3 closed complete engine disk/HEAD/source inventory',()=>{
  const r=H.closedEngineInventory();assert.equal(r.original.changed,8);assert.equal(r.original.added,4);assert.ok(r.original.unchanged>0);
  assert.equal(r.runtimeSource,H.U);assert.equal(r.successor.runtimeSource,H.S);assert.equal(r.successor.added,H.SUCCESSOR_NEW_ENGINE.length);assert.ok(r.successor.unchanged>0);
  assert.equal(r.repair.sourceBase,H.S);assert.equal(r.repair.runtimeSource,H.T);assert.equal(r.repair.added,0);assert.ok(r.repair.unchanged>0);
  assert.equal(r.r9.sourceBase,H.T);assert.equal(r.r9.runtimeSource,H.U);assert.equal(r.r9.added,0);assert.ok(r.r9.unchanged>0);
});
test('B1B2/SOURCE-4 red-first preimage and one-byte/noop/extra/omitted refusals',()=>{
  assert.throws(()=>H.reconstructRuntime(H.changes,f=>H.blob(H.M,f)),/historical R post/);
  assert.throws(()=>H.reconstructRuntime(H.changes,f=>Buffer.concat([H.blob(H.R,f),Buffer.from(' ')])),/historical R post/);
  const clone=()=>structuredClone(H.changes);
  let t=clone();t.runtime[0].hunks[0].after=t.runtime[0].hunks[0].before;assert.throws(()=>H.reconstructRuntime(t));
  t=clone();t.runtime[0].hunks.push({...t.runtime[0].hunks[0],id:'unlisted-extra'});assert.throws(()=>H.reconstructRuntime(t),/hunk count|unique source site|whole forward/);
  t=clone();t.runtime.pop();assert.throws(()=>H.reconstructRuntime(t),/exact eight/);
});
test('B1B2/SUCCESSOR-1 exact preserved R/S forward/inverse and historical evidence pins',()=>{
  const r=H.reconstructSuccessor();assert.equal(r.sourceBase,H.R);assert.equal(r.runtimeSource,H.S);
  assert.deepEqual(r.runtime.map(row=>row.file),H.changes.successor.runtime.map(row=>row.file));
  assert.deepEqual(r.engineEvidence,H.changes.successor.engineEvidence);
  assert.equal(r.runtime.length,4);assert.equal(r.runtime.reduce((n,row)=>n+row.hunks,0),10);assert.equal(r.engineEvidence.length,5);
  assert.equal(H.sha(JSON.stringify(H.changes.successor)),H.SUCCESSOR_RECORD_SHA,'entire historical R/S record retained');
  assert.equal(H.changes.runtimeSource,H.R);assert.equal(H.reconstructRuntime().reduce((n,row)=>n+row.hunks,0),65);
});
test('B1B2/SUCCESSOR-2 historical R preimage and changed S byte refuse separately',()=>{
  H.reconstructSuccessor();
  assert.throws(()=>H.reconstructSuccessor(H.changes.successor,f=>H.blob(H.R,f)),/historical S post/);
  assert.throws(()=>H.reconstructSuccessor(H.changes.successor,f=>Buffer.concat([H.blob(H.S,f),Buffer.from(' ')])),/historical S post/);
});
const successorClone=()=>structuredClone(H.changes.successor);
for(const [name,change,refusal]of[
  ['wrong R source',t=>t.sourceBase=H.M,/fixed R preimage/],
  ['source alias',t=>t.runtimeSource='HEAD',/immutable commit/],
  ['original R selected as current',t=>t.runtimeSource=H.R,/distinct source/],
  ['extra metadata field',t=>t.unruled=true,/closed fields/],
  ['omitted runtime image',t=>t.runtime.pop(),/nonempty successor|exact R\/S engine source delta/],
  ['duplicate runtime image',t=>t.runtime.push(structuredClone(t.runtime[0])),/unique successor paths/],
  ['unruled runtime file',t=>t.runtime[0].file='rebuild/engine/energy.cjs',/closed successor runtime file/],
  ['no-op hunk',t=>t.runtime[0].hunks[0].after=t.runtime[0].hunks[0].before,/nonempty non-noop/],
  ['extra hunk',t=>t.runtime[0].hunks.push({...t.runtime[0].hunks[0],id:'successor-unlisted-extra'}),/unique source site|whole successor forward/],
  ['omitted hunk',t=>t.runtime[0].hunks.pop(),/successor literal hunks|unique source site|whole successor forward|whole successor inverse/],
  ['duplicate hunk identity',t=>t.runtime[0].hunks.push({...t.runtime[0].hunks[0]}),/unique successor hunk identities/],
  ['wrong runtime preimage pin',t=>t.runtime[0].pre='0'.repeat(64),/successor R preimage/],
  ['wrong runtime postimage pin',t=>t.runtime[0].post='0'.repeat(64),/successor S postimage/],
  ['omitted new evidence',t=>t.engineEvidence.splice(t.engineEvidence.findIndex(row=>row.pre===null),1),/exact successor additions/],
  ['duplicate evidence',t=>t.engineEvidence.push({...t.engineEvidence[0]}),/unique successor paths/],
  ['unruled evidence',t=>t.engineEvidence[0].file='rebuild/engine/test/unlisted.cjs',/closed successor engine evidence file/],
  ['new evidence with a preimage',t=>t.engineEvidence.find(row=>row.pre===null).pre='0'.repeat(64),/new successor evidence preimage/],
  ['wrong evidence postimage pin',t=>t.engineEvidence[0].post='0'.repeat(64),/successor evidence S postimage/],
  ['wrong native comparison base',t=>t.nativeComparison.from=H.R,/successor native comparison M base/],
  ['wrong native comparison candidate',t=>t.nativeComparison.to=H.R,/successor native comparison S source/],
  ['unadmitted native delta',t=>t.nativeComparison.fieldDeltas.push({kind:'invented'}),/separate PM admission/],
])test('B1B2/SUCCESSOR-3 refuses '+name,()=>{
  H.reconstructSuccessor();const t=successorClone();change(t);assert.throws(()=>H.reconstructSuccessor(t),refusal);
});
test('B1B2/REPAIR-1 exact preserved S/T forward/inverse and historical evidence pins',()=>{
  const r=H.reconstructRepair();assert.equal(r.sourceBase,H.S);assert.equal(r.runtimeSource,H.T);
  assert.deepEqual(r.runtime.map(row=>row.file),H.REPAIR_RUNTIME);assert.ok(r.runtime[0].hunks>0);
  assert.deepEqual(r.engineEvidence,H.changes.repair.engineEvidence);
  assert.deepEqual(H.changes.repair.nativeComparison,{from:H.M,to:H.T,fieldDeltas:[]});
  assert.equal(H.sha(JSON.stringify(H.changes.successor)),H.SUCCESSOR_RECORD_SHA);
  assert.equal(H.reconstructRuntime().reduce((n,row)=>n+row.hunks,0),65);
  assert.equal(H.reconstructSuccessor().runtime.reduce((n,row)=>n+row.hunks,0),10);
});
test('B1B2/REPAIR-2 historical S preimage and changed T byte refuse separately',()=>{
  H.reconstructRepair();
  assert.throws(()=>H.reconstructRepair(H.changes.repair,f=>H.blob(H.S,f)),/historical T post/);
  assert.throws(()=>H.reconstructRepair(H.changes.repair,f=>Buffer.concat([H.blob(H.T,f),Buffer.from(' ')])),/historical T post/);
});
test('B1B2/REPAIR-3 every historical T evidence byte refuses separately',()=>{
  H.reconstructRepair();
  for(const row of H.changes.repair.engineEvidence) {
    const altered=f=>f===row.file?Buffer.concat([H.blob(H.T,f),Buffer.from(' ')]):H.blob(H.T,f);
    assert.throws(()=>H.reconstructRepair(H.changes.repair,altered),/historical T evidence/);
  }
});
test('B1B2/REPAIR-4 old R/S and mutable source refs refuse before native evaluation',()=>{
  H.reconstructRepair();
  for(const ref of [H.R,H.S,'HEAD','0'.repeat(40)]) {
    assert.throws(()=>H.nativeBrowser(ref),/closed native factory source BEFORE read/);
    assert.throws(()=>H.nativeEngine(ref),/closed native factory source BEFORE read/);
  }
});
test('B1B2/REPAIR-5 historical R/S metadata drift refuses before repair construction',()=>{
  const historical=H.changes.successor;
  try {
    H.changes.successor=structuredClone(historical);H.changes.successor.runtime[0].hunks[0].id+='-changed';
    assert.throws(()=>H.validateRepair(),/preserved entire R\/S source record/);
  } finally {H.changes.successor=historical;}
  assert.equal(H.sha(JSON.stringify(H.changes.successor)),H.SUCCESSOR_RECORD_SHA);
});
const repairClone=()=>structuredClone(H.changes.repair);
for(const [name,change,refusal]of[
  ['wrong S source',t=>t.sourceBase=H.R,/repair fixed S preimage/],
  ['source alias',t=>t.runtimeSource='HEAD',/repair immutable commit/],
  ['historical S selected as current',t=>t.runtimeSource=H.S,/repair distinct source/],
  ['unnamed immutable source',t=>t.runtimeSource=t.runtimeSource==='f'.repeat(40)?'e'.repeat(40):'f'.repeat(40),/fixed historical T source/],
  ['extra metadata field',t=>t.unruled=true,/repair closed fields/],
  ['omitted runtime image',t=>t.runtime.pop(),/exact one repair runtime file/],
  ['duplicate runtime image',t=>t.runtime.push(structuredClone(t.runtime[0])),/exact one repair runtime file/],
  ['unruled runtime file',t=>t.runtime[0].file='rebuild/engine/sleep.cjs',/exact one repair runtime file/],
  ['extra runtime field',t=>t.runtime[0].unruled=true,/repair runtime row closed fields/],
  ['empty hunk array',t=>t.runtime[0].hunks=[],/repair literal hunks/],
  ['no-op hunk',t=>t.runtime[0].hunks[0].after=t.runtime[0].hunks[0].before,/nonempty non-noop repair hunk/],
  ['extra hunk',t=>t.runtime[0].hunks.push({...t.runtime[0].hunks[0],id:'repair-unlisted-extra'}),/unique source site|whole repair forward/],
  ['omitted hunk',t=>t.runtime[0].hunks.pop(),/repair literal hunks|unique source site|whole repair forward|whole repair inverse/],
  ['duplicate hunk identity',t=>t.runtime[0].hunks.push({...t.runtime[0].hunks[0]}),/unique repair hunk identities/],
  ['extra hunk field',t=>t.runtime[0].hunks[0].unruled=true,/repair hunk closed fields/],
  ['wrong runtime preimage pin',t=>t.runtime[0].pre='0'.repeat(64),/repair S preimage/],
  ['wrong runtime postimage pin',t=>t.runtime[0].post='0'.repeat(64),/repair T postimage/],
  ['omitted evidence',t=>t.engineEvidence.pop(),/exact S\/T engine source delta/],
  ['duplicate evidence',t=>t.engineEvidence.push({...t.engineEvidence[0]}),/unique repair paths/],
  ['unruled evidence',t=>t.engineEvidence[0].file='rebuild/engine/test/unlisted.cjs',/closed repair engine evidence file/],
  ['unlicensed original evidence',t=>t.engineEvidence[0].file='rebuild/engine/test/b1-delta-cells.cjs',/closed repair engine evidence file/],
  ['new evidence preimage',t=>t.engineEvidence[0].pre=null,/existing repair evidence preimage/],
  ['extra evidence field',t=>t.engineEvidence[0].unruled=true,/repair engine evidence row closed fields/],
  ['wrong evidence preimage pin',t=>t.engineEvidence[0].pre='0'.repeat(64),/repair evidence S preimage/],
  ['wrong evidence postimage pin',t=>t.engineEvidence[0].post='0'.repeat(64),/repair evidence T postimage/],
  ['wrong native comparison base',t=>t.nativeComparison.from=H.R,/repair native comparison M base/],
  ['historical native comparison candidate',t=>t.nativeComparison.to=H.S,/repair native comparison T source/],
  ['extra native comparison field',t=>t.nativeComparison.unruled=true,/repair native comparison closed fields/],
  ['unadmitted native delta',t=>t.nativeComparison.fieldDeltas.push({kind:'invented'}),/separate PM admission/],
])test('B1B2/REPAIR-6 refuses '+name,()=>{
  H.reconstructRepair();const t=repairClone();change(t);assert.throws(()=>H.reconstructRepair(t),refusal);
});
test('B1B2/R9-1 exact additive T/U forward/inverse and current evidence pins',()=>{
  const r=H.reconstructR9();assert.equal(r.sourceBase,H.T);assert.equal(r.runtimeSource,H.U);
  assert.deepEqual(r.runtime.map(row=>row.file),['rebuild/engine/today.cjs']);assert.equal(r.runtime[0].hunks,1);
  assert.deepEqual(r.engineEvidence,H.changes.r9.engineEvidence);
  assert.deepEqual(H.changes.r9.nativeComparison,{from:H.M,to:H.U,fieldDeltas:[]});
  assert.equal(H.sha(JSON.stringify(H.changes.successor)),H.SUCCESSOR_RECORD_SHA);
  assert.equal(H.sha(JSON.stringify(H.changes.repair)),H.REPAIR_RECORD_SHA);
  assert.equal(H.reconstructRuntime().reduce((n,row)=>n+row.hunks,0),65);
  assert.equal(H.reconstructSuccessor().runtime.reduce((n,row)=>n+row.hunks,0),10);
  assert.equal(H.reconstructRepair().runtime.reduce((n,row)=>n+row.hunks,0),3);
});
test('B1B2/R9-2 current T preimage, disk byte and HEAD byte refuse separately',()=>{
  H.reconstructR9();
  assert.throws(()=>H.reconstructR9(H.changes.r9,f=>H.blob(H.T,f)),/candidate U post/);
  assert.throws(()=>H.reconstructR9(H.changes.r9,f=>Buffer.concat([H.disk(f),Buffer.from(' ')])),/candidate U post/);
  assert.throws(()=>H.reconstructR9(H.changes.r9,H.disk,f=>Buffer.concat([H.blob('HEAD',f),Buffer.from(' ')])),/candidate HEAD\/U post/);
});
test('B1B2/R9-3 every changed evidence disk and HEAD byte refuses separately',()=>{
  H.reconstructR9();
  for(const row of H.changes.r9.engineEvidence) {
    const altered=f=>f===row.file?Buffer.concat([H.disk(f),Buffer.from(' ')]):H.disk(f);
    const alteredHead=f=>f===row.file?Buffer.concat([H.blob('HEAD',f),Buffer.from(' ')]):H.blob('HEAD',f);
    assert.throws(()=>H.reconstructR9(H.changes.r9,altered),/candidate U evidence/);
    assert.throws(()=>H.reconstructR9(H.changes.r9,H.disk,alteredHead),/candidate HEAD\/U evidence/);
  }
});
test('B1B2/R9-4 historical T refuses before native evaluation',()=>{
  H.reconstructR9();
  assert.throws(()=>H.nativeBrowser(H.T),/closed native factory source BEFORE read/);
  assert.throws(()=>H.nativeEngine(H.T),/closed native factory source BEFORE read/);
});
test('B1B2/R9-5 historical S/T metadata drift refuses before R9 construction',()=>{
  const historical=H.changes.repair;
  try {
    H.changes.repair=structuredClone(historical);H.changes.repair.runtime[0].hunks[0].id+='-changed';
    assert.throws(()=>H.validateR9(),/preserved entire S\/T source record/);
  } finally {H.changes.repair=historical;}
  assert.equal(H.sha(JSON.stringify(H.changes.repair)),H.REPAIR_RECORD_SHA);
});
const r9Clone=()=>structuredClone(H.changes.r9);
for(const [name,change,refusal]of[
  ['wrong T source',t=>t.sourceBase=H.S,/R9 fixed T preimage/],
  ['source alias',t=>t.runtimeSource='HEAD',/R9 immutable commit/],
  ['historical T selected as current',t=>t.runtimeSource=H.T,/R9 distinct source/],
  ['unnamed immutable source',t=>t.runtimeSource=t.runtimeSource==='f'.repeat(40)?'e'.repeat(40):'f'.repeat(40),/single named R9 source/],
  ['extra metadata field',t=>t.unruled=true,/R9 closed fields/],
  ['omitted runtime image',t=>t.runtime.pop(),/exact one R9 runtime file/],
  ['duplicate runtime image',t=>t.runtime.push(structuredClone(t.runtime[0])),/exact one R9 runtime file/],
  ['unruled runtime file',t=>t.runtime[0].file='rebuild/engine/sleep.cjs',/exact one R9 runtime file/],
  ['extra runtime field',t=>t.runtime[0].unruled=true,/R9 runtime row closed fields/],
  ['empty hunk array',t=>t.runtime[0].hunks=[],/exact one R9 literal hunk/],
  ['no-op hunk',t=>t.runtime[0].hunks[0].after=t.runtime[0].hunks[0].before,/nonempty non-noop R9 hunk/],
  ['extra hunk',t=>t.runtime[0].hunks.push({...t.runtime[0].hunks[0],id:'r9-unlisted-extra'}),/exact one R9 literal hunk/],
  ['extra hunk field',t=>t.runtime[0].hunks[0].unruled=true,/R9 hunk closed fields/],
  ['wrong runtime preimage pin',t=>t.runtime[0].pre='0'.repeat(64),/R9 T preimage/],
  ['wrong runtime postimage pin',t=>t.runtime[0].post='0'.repeat(64),/R9 U postimage/],
  ['omitted evidence',t=>t.engineEvidence.pop(),/exact T\/U engine source delta/],
  ['duplicate evidence',t=>t.engineEvidence.push({...t.engineEvidence[0]}),/unique R9 paths/],
  ['unruled evidence',t=>t.engineEvidence[0].file='rebuild/engine/test/unlisted.cjs',/closed R9 engine evidence file/],
  ['unlicensed ERA evidence',t=>t.engineEvidence[0].file='rebuild/engine/test/b2-era30.test.cjs',/closed R9 engine evidence file/],
  ['new evidence preimage',t=>t.engineEvidence[0].pre=null,/existing R9 evidence preimage/],
  ['extra evidence field',t=>t.engineEvidence[0].unruled=true,/R9 engine evidence row closed fields/],
  ['wrong evidence preimage pin',t=>t.engineEvidence[0].pre='0'.repeat(64),/R9 evidence T preimage/],
  ['wrong evidence postimage pin',t=>t.engineEvidence[0].post='0'.repeat(64),/R9 evidence U postimage/],
  ['wrong native comparison base',t=>t.nativeComparison.from=H.R,/R9 native comparison M base/],
  ['historical native comparison candidate',t=>t.nativeComparison.to=H.T,/R9 native comparison U source/],
  ['extra native comparison field',t=>t.nativeComparison.unruled=true,/R9 native comparison closed fields/],
  ['unadmitted native delta',t=>t.nativeComparison.fieldDeltas.push({kind:'invented'}),/separate PM admission/],
])test('B1B2/R9-6 refuses '+name,()=>{
  H.reconstructR9();const t=r9Clone();change(t);assert.throws(()=>H.reconstructR9(t),refusal);
});

test('B1B2/SOURCE-5 S1 exact eight assertion sites and unchanged fourteen-test remainder',()=>{
  assert.equal(H.sha(H.s1Source()),H.changes.s1.post);
  assert.notEqual(H.changes.s1.pre,H.changes.s1.post);
});
