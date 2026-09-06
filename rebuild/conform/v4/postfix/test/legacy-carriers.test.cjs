'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const C = require('../legacy-carriers.cjs');
const ROOT = path.resolve(__dirname, '../../../../..');
const source = id => fs.readFileSync(path.join(ROOT, 'rebuild/engine/test/' + id + '.cjs'));

for (const id of C.CARRIER_IDS) test(id + ': exact original pin and bounded successor sites', () => {
  const bytes = source(id), p = C.prepareCarrier(id, bytes);
  assert.equal(p.sourceHash, C.ORIGINAL_PINS[id]);
  assert.ok(p.edits.length > 0); assert.ok(p.edits.every(x => x.occurrences === 1));
  assert.equal(new Set(p.edits.map(x => x.site)).size, p.edits.length);
  assert.notEqual(p.sourceHash, p.carrierHash);
  new vm.Script(ModuleBody(p.source), { filename: id + '.cjs' });
  assert.throws(() => C.prepareCarrier(id, Buffer.concat([bytes, Buffer.from('\n')])), /CARRIER-ORIGINAL-PIN/);
  const wrong = C.CARRIER_IDS.find(x => x !== id);
  assert.throws(() => C.prepareCarrier(wrong, bytes), /CARRIER-ORIGINAL-PIN/);
});
function ModuleBody(s) { return '(function(exports,require,module,__filename,__dirname){\n' + s + '\n})'; }
test('unknown carrier, zero or repeated replacement sites, and no-op edits fail closed', () => {
  assert.throws(() => C.prepareCarrier('made-up', ''), /CARRIER-WRONG-TARGET/);
  for (const [whole, before, after] of [['abc', 'z', 'b'], ['aa', 'a', 'b'], ['a', 'a', 'a']])
    assert.throws(() => C.exactReplace(whole, before, after, 'test', []), /CARRIER-ONE-SITE/);
});
test('migration inventory retains all 126 original cases, order, and five exact deltas', () => {
  const rows = C.caseInventory('migrate-differential');
  assert.equal(rows.length, 127); assert.equal(new Set(rows.map(x => x.label)).size, 127);
  assert.equal(rows.filter(x => x.disposition === 'replaced-expectation').length, 5);
  assert.equal(rows[0].label, 'migrate exit null');
  assert.equal(rows.at(-2).label, 'explicit reconcile mint invokes writer');
  assert.equal(rows.at(-1).disposition, 'additional-positive');
  assert.ok(rows.findIndex(x => x.label === 'guard filed strike correction plus receipt') < rows.findIndex(x => x.label === 'read receipt full prose/order and repeat'));
});
test('D36 original witness and all remaining text stay present after selected changes', () => {
  const original = source('defect-witnesses-5').toString(), p = C.prepareCarrier('defect-witnesses-5', original);
  const start = original.indexOf("witness('D36");
  assert.ok(p.source.endsWith(original.slice(start)));
  assert.deepEqual(C.caseInventory('defect-witnesses-5').map(x => [x.label, x.disposition]), [
    ['D33', 'replaced-expectation'], ['D34', 'replaced-expectation'], ['D35', 'replaced-expectation'], ['D36', 'unchanged']
  ]);
});
test('D35 structural cells retain aliases and refuse an unexpected original preimage', () => {
  const body = { v: 61, sleep: { nights: [], needed: 3 }, reads: [], dailyLogs: {}, unknown: { x: 'unchanged' } };
  const old = { error: null, value: { old: body, first: body, second: body, firstSnapshot: structuredClone(body), oldAfterFirst: structuredClone(body), firstIsOld: true, secondIsFirst: true } };
  const before = structuredClone(old), unknown = old.value.old.unknown;
  C.adjustDifferential('migrate exit v61', old);
  assert.equal(old.value.old, old.value.first); assert.equal(old.value.first, old.value.second);
  assert.equal(old.value.old.unknown, unknown);
  for (const b of [old.value.old, old.value.firstSnapshot, old.value.oldAfterFirst]) {
    assert.equal(b.sleep, null); assert.equal(Object.hasOwn(b, 'reads'), false); assert.equal(Object.hasOwn(b, 'dailyLogs'), false);
  }
  before.value.old.reads.push('unexpected');
  assert.throws(() => C.adjustDifferential('migrate exit v61', before));
});
for (const [label, before, after] of [
  ['isPristineSeed read value', true, false],
  ['guard loss reads', { safe: false, lost: ['reads 1→0'] }, { safe: false, lost: ['reads 1→0', 'readidentity "2026-08-30"'] }],
  ['guard loss session', { safe: false, lost: ['sessionLog 1→0', 'corrections 1→0'] }, { safe: false, lost: ['sessionLog 1→0', 'corrections 1→0', 'entryidentity ["2026-08-30","rows"]'] }],
  ['guard filed strike correction plus receipt', { safe: true, lost: [] }, { safe: false, lost: ['setidentity ["2026-08-30","rows",1]'] }]
]) test(label + ': exact reviewed original and replacement cells only', () => {
  const x = { error: null, value: { prev: { marker: 'input' }, next: { feed: [{ how: '  exact receipt!  ' }] }, result: structuredClone(before) } };
  const prev = x.value.prev, next = x.value.next;
  C.adjustDifferential(label, x);
  assert.deepEqual(x.value.result, after); assert.equal(x.value.prev, prev); assert.equal(x.value.next, next);
  const withExtra = structuredClone(x); withExtra.value.next.feed[0].how += 'changed';
  assert.throws(() => assert.deepEqual(withExtra, x));
  assert.throws(() => C.adjustDifferential(label, { error: { name: 'Error', message: 'wrong' }, value: null }));
});
test('an unchanged differential label gets no output exemption', () => {
  const x = { error: null, value: { result: 'unchanged', feed: [{ how: 'exact' }] } }, before = structuredClone(x);
  C.adjustDifferential('read receipt full prose/order and repeat', x); assert.deepEqual(x, before);
});
test('witness changes are exact, D36 untouched, extra fields remain detectable', () => {
  const d33 = { sets: [10, 9], lostReadDay: true, setVerdict: { safe: true, lost: [] }, readVerdict: { safe: true, lost: [] } };
  C.adjustWitness('D33', d33); assert.equal(d33.setVerdict.safe, false); assert.equal(d33.readVerdict.safe, false);
  const d34 = { changedWeightBy: 1, incorrectlyPristine: true }; C.adjustWitness('D34', d34); assert.equal(d34.incorrectlyPristine, false);
  assert.throws(() => C.adjustWitness('D34', { changedWeightBy: 2, incorrectlyPristine: true }));
  const d36 = { claimed: '60·60·55', receipt: '  exact!  ' }, prev = structuredClone(d36);
  C.adjustWitness('D36', d36); assert.deepEqual(d36, prev);
  assert.throws(() => C.adjustWitness('D37', {}), /CARRIER-UNKNOWN-WITNESS/);
});
test('genuine additional positive uses actual filing and replay and preserves its exact receipt', () => {
  const { createEngine } = require(path.join(ROOT, 'rebuild/engine/index.cjs'));
  const T = createEngine({ clock: { today: () => '2026-09-03', hour: () => 12, nowMs: () => 1788451200000, nowISO: () => '2026-09-03T16:00:00.000Z' } });
  const prev = { v: 60, reads: [], sleep: { nights: [] }, dailyLogs: {}, sessionLog: { '2026-08-30': { entries: [{ id: 'rows', w: 100, reps: [8, 8] }] } }, feed: [] };
  const next = structuredClone(prev), row = next.sessionLog['2026-08-30']; row.entries[0].reps.pop();
  const op = 'corr:successor-genuine-strike';
  T._fileCorr(row, op, 'strike', 'rows', '2026-08-30T17:00:00.000Z', [{ id: 'rows', reps: [8] }]);
  next.feed.push({ d: '2026-08-30', t: 'SET CORRECTED', how: 'Synthetic genuine filed payload.', op });
  const replay = structuredClone(prev.sessionLog['2026-08-30']); replay.corrLog = T._unionCorrLog({}, row); T._replayCorrections(replay);
  assert.deepEqual(replay.entries[0].reps, [8]);
  const before = JSON.stringify([prev, next]);
  assert.deepEqual(T.dataLossGuard(prev, next), { safe: true, lost: [] });
  assert.equal(JSON.stringify([prev, next]), before);
});
