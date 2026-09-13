'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./b1b2-evidence.cjs');
// Whole SUP-8/9/10: original seven states, frozen/live/trap clocks and source
// assertions. No selected rows or exception-to-success adapters.
H.loadOriginal('h3-supersede-writers-differential.test.cjs');
test('B1B2/WRITERS-1 whole applyRead span and constants remain M-identical',()=>{
  const span=src=>{const start=src.indexOf('function applyRead(');assert.ok(start>=0);const end=src.indexOf('function proteinTargetForRegime(',start+1);assert.ok(end>start);return src.slice(start,end);};
  assert.equal(span(H.disk('rebuild/engine/writers.cjs').toString()),span(H.blob(H.M,'rebuild/engine/writers.cjs').toString()));
  assert.deepEqual(H.disk('rebuild/engine/constants.cjs'),H.blob(H.M,'rebuild/engine/constants.cjs'));
});
// These are the existing pinned U/FG cells, including real writer and bodyAlarm
// consumers. The package also registers their independent combined child.
require('../../../engine/test/b1-unknown-recovery.test.cjs');
require('../../../engine/test/b1b2-sleep-target-cells.cjs');
