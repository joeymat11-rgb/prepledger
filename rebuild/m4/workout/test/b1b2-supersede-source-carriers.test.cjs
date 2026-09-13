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
  assert.equal(r.runtimeSource,H.S);assert.equal(r.successor.added,H.SUCCESSOR_NEW_ENGINE.length);assert.ok(r.successor.unchanged>0);
});
test('B1B2/SOURCE-4 red-first preimage and one-byte/noop/extra/omitted refusals',()=>{
  assert.throws(()=>H.reconstructRuntime(H.changes,f=>H.blob(H.M,f)),/historical R post/);
  assert.throws(()=>H.reconstructRuntime(H.changes,f=>Buffer.concat([H.blob(H.R,f),Buffer.from(' ')])),/historical R post/);
  const clone=()=>structuredClone(H.changes);
  let t=clone();t.runtime[0].hunks[0].after=t.runtime[0].hunks[0].before;assert.throws(()=>H.reconstructRuntime(t));
  t=clone();t.runtime[0].hunks.push({...t.runtime[0].hunks[0],id:'unlisted-extra'});assert.throws(()=>H.reconstructRuntime(t),/hunk count|unique source site|whole forward/);
  t=clone();t.runtime.pop();assert.throws(()=>H.reconstructRuntime(t),/exact eight/);
});
test('B1B2/SUCCESSOR-1 exact separate R/S forward/inverse and current evidence pins',()=>{
  const r=H.reconstructSuccessor();assert.equal(r.sourceBase,H.R);assert.equal(r.runtimeSource,H.S);
  assert.deepEqual(r.runtime.map(row=>row.file),H.changes.successor.runtime.map(row=>row.file));
  assert.deepEqual(r.engineEvidence,H.changes.successor.engineEvidence);
  assert.ok(r.runtime.length>0);assert.ok(r.runtime.reduce((n,row)=>n+row.hunks,0)>0);
  assert.equal(H.changes.runtimeSource,H.R);assert.equal(H.reconstructRuntime().reduce((n,row)=>n+row.hunks,0),65);
});
test('B1B2/SUCCESSOR-2 current R preimage, disk byte and HEAD byte refuse separately',()=>{
  H.reconstructSuccessor();
  assert.throws(()=>H.reconstructSuccessor(H.changes.successor,f=>H.blob(H.R,f)),/candidate S post/);
  assert.throws(()=>H.reconstructSuccessor(H.changes.successor,f=>Buffer.concat([H.disk(f),Buffer.from(' ')])),/candidate S post/);
  assert.throws(()=>H.reconstructSuccessor(H.changes.successor,H.disk,f=>Buffer.concat([H.blob('HEAD',f),Buffer.from(' ')])),/candidate HEAD\/S post/);
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
test('B1B2/SOURCE-5 S1 exact eight assertion sites and unchanged fourteen-test remainder',()=>{
  assert.equal(H.sha(H.s1Source()),H.changes.s1.post);
  assert.notEqual(H.changes.s1.pre,H.changes.s1.post);
});
