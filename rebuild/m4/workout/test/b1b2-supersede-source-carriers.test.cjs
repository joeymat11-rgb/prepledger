'use strict';
// New evidence; no original carrier, fixture, or runtime byte is rewritten.
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./b1b2-evidence.cjs');
test('B1B2/SOURCE-1 full eight-file literal forward and inverse construction',()=>{
  const rows=H.reconstructRuntime();assert.equal(rows.length,8);assert.equal(rows.reduce((n,r)=>n+r.hunks,0),65);
});
test('B1B2/SOURCE-2 original H3 four-hunk construction and retained sites',()=>assert.equal(H.reconstructH3(),4));
test('B1B2/SOURCE-3 closed complete engine disk/HEAD/source inventory',()=>{
  const r=H.closedEngineInventory();assert.equal(r.changed,8);assert.equal(r.added,4);assert.ok(r.unchanged>0);
});
test('B1B2/SOURCE-4 red-first preimage and one-byte/noop/extra/omitted refusals',()=>{
  assert.throws(()=>H.reconstructRuntime(H.changes,f=>H.blob(H.M,f)),/current post/);
  assert.throws(()=>H.reconstructRuntime(H.changes,f=>Buffer.concat([H.disk(f),Buffer.from(' ')])),/current post/);
  const clone=()=>structuredClone(H.changes);
  let t=clone();t.runtime[0].hunks[0].after=t.runtime[0].hunks[0].before;assert.throws(()=>H.reconstructRuntime(t));
  t=clone();t.runtime[0].hunks.push({...t.runtime[0].hunks[0],id:'unlisted-extra'});assert.throws(()=>H.reconstructRuntime(t),/unique source site|whole forward/);
  t=clone();t.runtime.pop();assert.throws(()=>H.reconstructRuntime(t),/exact eight/);
});
test('B1B2/SOURCE-5 S1 exact eight assertion sites and unchanged fourteen-test remainder',()=>{
  assert.equal(H.sha(H.s1Source()),H.changes.s1.post);
  assert.notEqual(H.changes.s1.pre,H.changes.s1.post);
});
