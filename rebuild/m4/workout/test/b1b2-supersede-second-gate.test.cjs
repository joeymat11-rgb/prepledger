'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./b1b2-evidence.cjs');
// Retains SUP-14/15/16, including the whole first-read constructor fixture,
// independent of the additional M/R reader projection below. Native: PC only.
H.loadOriginal('h3-supersede-second-gate.test.cjs');
test('B1B2/SECOND-1 every original reader and whole applyRead M/R output',()=>{
  H.closedEngineInventory();
  const a=H.nativeBrowser(H.M),b=H.nativeBrowser(H.R),state=structuredClone(a.SEED);
  assert.equal(H.READERS.length,15);assert.ok(Number.isFinite(state.trend));
  assert.deepEqual(a.SEED,b.SEED,'same original frozen input');
  const pa=H.projection(a,state),pb=H.projection(b,state);
  const reports=[H.approvedNativeDifference('second-readers',pa,pb)];
  const ra=a.applyRead(structuredClone(state),H.DAY,186.4,{hour:8}),rb=b.applyRead(structuredClone(state),H.DAY,186.4,{hour:8});
  reports.push(H.approvedNativeDifference('second-applyRead',ra,rb));
  console.log('B1B2 SECOND GATE: '+JSON.stringify(reports));
});
