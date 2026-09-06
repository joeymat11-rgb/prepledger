'use strict';
// Focused test for the D12 protected second-gate custody helper. The full run below uses a
// SOURCE-ONLY PROTOTYPE candidate (the projected FROZEN app) — explicitly NOT the product and NOT
// acceptance evidence; it proves the carrier mechanics, the pins, the negative control and the
// verdict-only output boundary. Nothing here reads rebuild/engine as a candidate.
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const C = require('../step-efficacy-second-gate.cjs');
const ROOT = path.resolve(__dirname, '../../../../..');
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const code = fn => { try { fn(); } catch (e) { return e.code; } return null; };

test('pins: the frozen inputs and the inherited second-gate harness are the reviewed originals on disk and in git', () => {
  C.verifyPins({ root: ROOT, baseline: ROOT });
  for (const [file, hash] of Object.entries({ ...C.FROZEN_PINS, ...C.DRIVER_PINS })) assert.equal(sha(fs.readFileSync(path.join(ROOT, file))), hash, file);
});

test('successor driver: exactly seven public one-site edits, deterministic, original bytes never written', () => {
  const original = fs.readFileSync(path.join(ROOT, C.DRIVER_FILE));
  const a = C.prepareSuccessorDriver(original), b = C.prepareSuccessorDriver(original);
  assert.equal(a.edits.length, C.DRIVER_EDITS.length); assert.equal(a.edits.length, 7);
  assert.deepEqual(a.edits.map(e => e.occurrences), Array(7).fill(1));
  assert.deepEqual(a.edits.map(e => e.site), C.DRIVER_EDITS.map(e => e[0]));
  assert.equal(a.successorSha256, b.successorSha256); assert.notEqual(a.successorSha256, a.originalSha256);
  assert.equal(sha(fs.readFileSync(path.join(ROOT, C.DRIVER_FILE))), C.DRIVER_PINS[C.DRIVER_FILE]);
  // every original check the successor keeps is still present verbatim
  for (const kept of ['assert.equal(hashes["src/app.jsx"].gitBlob, "f98671d823f0d8cd83e730cdd930afe5f5e7b628");', 'assert.equal(engine.metadata.networkCalls,6,', 'assert.deepEqual(candidate.engineMetadata.assertions,reference.engineMetadata.assertions,', 'assert.equal(redirects.length,1);', 'const vacuity = run(side,"vacuity",', 'run(side,"sync-laws",["tools/sync-laws.mjs"],{PL_ENGINE:plEngine});']) assert.ok(a.source.includes(kept), kept);
  assert.ok(!a.source.includes('process.argv[2]'));
});

test('a changed driver or a non-unique site is a re-review, never a pass', () => {
  const original = fs.readFileSync(path.join(ROOT, C.DRIVER_FILE));
  const tampered = Buffer.concat([original, Buffer.from('\n// one more line\n')]);
  assert.equal(code(() => C.prepareSuccessorDriver(tampered)), 'STEP-CUSTODY-PENDING');
  assert.equal(code(() => C.exactReplace('a a', 'a', 'b', 'twice', [])), 'CARRIER-ONE-SITE');
  assert.equal(code(() => C.exactReplace('x', 'a', 'b', 'absent', [])), 'CARRIER-ONE-SITE');
  const edits = []; assert.equal(C.exactReplace('x a y', 'a', 'b', 'once', edits), 'x b y'); assert.equal(edits[0].occurrences, 1);
});

test('the carried condition and the projection are single, exact, public texts', () => {
  const harness = fs.readFileSync(path.join(ROOT, 'tools/engine-test.jsx'), 'utf8');
  const at = harness.indexOf(C.CONDITION_106.before); assert.ok(at > 0); assert.equal(harness.split(C.CONDITION_106.before).length, 2);
  const before = harness.slice(0, at).split('\n'); assert.equal(before.length, 106); assert.equal(before.at(-1).length + 1, 5);
  assert.ok(C.CONDITION_106.after.startsWith('ok(')); assert.ok(!C.CONDITION_106.after.includes('\n'));
  const app = fs.readFileSync(path.join(ROOT, 'src/app.jsx'), 'utf8'); assert.equal(app.split(C.PROJECTION.before).length, 2);
  assert.equal(C.PROJECTION.after.length - C.PROJECTION.before.length, -9);
  assert.deepEqual(C.SURFACE_PATHS.map(p => p.join('/')), ['2026-08-06/stepEfficacy/slopePer1k', '2026-08-06/stepEfficacy/resolved', '2026-08-07/stepEfficacy/slopePer1k', '2026-08-07/stepEfficacy/resolved']);
});

test('custody requirements fail closed: undefined native mode, foreign package profile, missing frozen bundle', () => {
  assert.equal(code(() => C.runSecondGate({ root: ROOT, baseline: ROOT, bundles: { main: __filename }, mode: 'native' })), 'STEP-CUSTODY-PENDING');
  assert.equal(code(() => C.runSecondGate({ root: ROOT, baseline: ROOT, bundles: { main: __filename }, acceptance: { packageId: 'M2-IMPORT-GUARDS' } })), 'STEP-CUSTODY-PENDING');
  assert.equal(code(() => C.runSecondGate({ root: ROOT, baseline: ROOT, bundles: {} })), 'CARRIER-FROZEN-BUNDLE');
  assert.equal(code(() => C.runSecondGate({ root: ROOT, baseline: path.join(ROOT, 'does-not-exist'), bundles: { main: __filename } })), 'CUSTODY-CONFIG');
});

test('SOURCE-ONLY PROTOTYPE end-to-end: projected frozen candidate, verdict-only evidence, disk untouched (not product evidence)', () => {
  const scratch = fs.mkdtempSync(path.join(fs.mkdirSync(path.join(ROOT, '.tmp/d12-step-efficacy-custody'), { recursive: true }) || path.join(ROOT, '.tmp/d12-step-efficacy-custody'), 'test-frozen-'));
  const before = Object.fromEntries(Object.keys({ ...C.FROZEN_PINS, ...C.DRIVER_PINS }).map(f => [f, sha(fs.readFileSync(path.join(ROOT, f)))]));
  try {
    const frozen = C.buildReferenceBundle({ root: ROOT, baseline: ROOT, dir: scratch, projected: false });
    assert.equal(frozen.occurrences, 0); assert.equal(frozen.appSha256, C.FROZEN_PINS['src/app.jsx']);
    const r = C.runSecondGate({ root: ROOT, baseline: ROOT, bundles: { main: frozen.file }, mode: 'frozen', prototypeCandidateAdapter: true });
    assert.equal(r.id, 'second-gate'); assert.equal(r.status, 'PROTOTYPE'); assert.match(r.tail, /SOURCE-ONLY PROTOTYPE, NOT THE PRODUCT/);
    assert.equal(r.projection.preimageOccurrences, 1); assert.equal(r.projection.bytesDelta, -9);
    assert.deepEqual(r.expected106, { derivedFrom: 'frozen fe516c1 src/app.jsx + one-expression projection, harness clock', frozenSatisfiesOriginalPredicate: true, projectedSatisfiesOriginalPredicate: false, statusUnchanged: true, nNeedExcludedBoundUnchanged: true, signPreserved: true, resolvedFlips: true });
    assert.deepEqual(r.surface.pointerPathsChangedByProjection, C.SURFACE_PATHS.map(p => p.join('/')).sort()); assert.equal(r.surface.exactDelta, 'PASS');
    assert.deepEqual(r.negativeControl.failSites, ['tools/engine-test.jsx:106:5']); assert.equal(r.negativeControl.expect106Calls, 1); assert.ok(r.negativeControl.observedBeforeHarnessExit < 3072);
    assert.equal(r.custody.substitutions, 1); assert.equal(r.custody.expect106Calls, 1); assert.deepEqual(r.custody.surfaceCalls, { reference: 1, candidate: 1 }); assert.equal(r.custody.carriedSiteOccurrences, 1);
    assert.equal(r.gate.catalogTotal, 3072); assert.equal(r.gate.referenceObserved, 3072); assert.equal(r.gate.candidateObserved, 3072); assert.deepEqual(r.gate.failSites, []);
    assert.deepEqual(r.gate.legacyMkPushable, ['4818:PASS', '4820:PASS', '4821:PASS', '4822:PASS', '4825:PASS', '4826:PASS']);
    assert.equal(r.gate.randomCallsEqual, true); assert.deepEqual(r.gate.networkCalls, [6, 6]); assert.deepEqual(r.gate.violations, [[], []]);
    assert.ok(r.gate.lines.some(l => /^SECOND GATE candidate: PASS;/.test(l))); assert.ok(r.gate.lines.some(l => /^SECOND GATE reference surface: byte-identical to committed baseline/.test(l)));
    assert.ok(r.gate.lines.some(l => /^SECOND GATE candidate surface: byte-identical to the frozen one-expression projection/.test(l)));
    assert.equal(r.driver.diskUntouched, true); assert.equal(r.driver.edits.length, 7);
    // verdict-only boundary: no protected cell value, prose or snapshot date-row leaves the helper
    const text = JSON.stringify(r);
    assert.ok(!/"slopePer1k":/.test(text)); assert.ok(!/"boundPer1k"/.test(text)); assert.ok(!/lb\/wk/.test(text)); assert.ok(!/"resolved":/.test(text)); assert.ok(!/__NEG_ZERO__/.test(text));
  } finally { fs.rmSync(scratch, { recursive: true, force: true }); }
  for (const [f, h] of Object.entries(before)) assert.equal(sha(fs.readFileSync(path.join(ROOT, f))), h, 'unchanged after run: ' + f);
  assert.deepEqual(fs.readdirSync(path.join(ROOT, '.tmp/d12-step-efficacy-custody')).filter(n => n.startsWith('run-')), [], 'run scratch removed');
});
