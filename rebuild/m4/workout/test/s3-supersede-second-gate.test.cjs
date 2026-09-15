'use strict';
/* =====================================================================
   M2-S3-COMPANION SUPERSEDES THE NATIVE-CARRIERS CARRIER `second-gate`
   (gate second-gate)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `NATIVE SECOND GATE:` -
   the independent second reading of the adopted engine: the same frozen
   inputs put through the engine a second time, by a different route, and
   required to come back with the same bytes. It is the gate that says "the
   public record does not move", and it reaches the engine through the same
   sha-pinned reconstruction as the other four.

   WHY S3 CANNOT CARRY IT. Same wall, same measurement (see
   s3-supersede-source-carriers.test.cjs).

   WHAT S3 PUTS IN ITS PLACE, HERE, EXECUTED. The claim the second gate makes
   about S3's two files, made directly: that the PUBLIC RECORD DOES NOT MOVE.
   The accepted engine composition and S3's are built side by side - the
   accepted one over the `sourceBase` blobs of today.cjs and merge.cjs,
   compiled privately, every other module the real one - and driven over the
   frozen seed athlete through every reader the public census reads, through
   genSession on its training days and through mergeState of the record with
   a diverged copy of itself, with the whole projection compared BYTE FOR
   BYTE as JSON. They must agree completely. The one thing that differs is a
   member the accepted engine does not have, asserted rather than assumed.
   The census log itself is proved unmoved by the package's own `--ci` census
   line; this cell is the in-process half a reviewer can re-run in a second.

   RED-FIRST: cell 3 asserts the one difference exists, so a build that
   quietly reverted the reader would fail it.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/S3.json'), 'utf8'));
const BASE = SPEC.sourceBase;
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');

function privately(file, source) {
  const abs = path.join(REPO, file);
  const m = new Module(abs, module);
  m.filename = abs;
  m.paths = Module._nodeModulePaths(path.dirname(abs));
  const normal = m.require.bind(m);
  m.require = name => (name.startsWith('.') ? require(path.resolve(path.dirname(abs), name)) : normal(name));
  m._compile(source, abs);
  return m.exports;
}
const ACCEPTED = { today: privately('rebuild/engine/today.cjs', blob('rebuild/engine/today.cjs')), merge: privately('rebuild/engine/merge.cjs', blob('rebuild/engine/merge.cjs')) };
const OURS = { today: require('../../../engine/today.cjs'), merge: require('../../../engine/merge.cjs') };

const DAY = '2026-09-07';
const clock = { today: () => DAY, hour: () => 8, now: () => new Date(DAY + 'T13:00:00.000Z'), stamp: () => DAY + 'T13:00:00.000Z', nowISO: () => DAY + 'T13:00:00.000Z' };
/* index.cjs's own composition, in its own order, with the two substitutions. */
const ORDER = [...fs.readFileSync(path.join(REPO, 'rebuild/engine/index.cjs'), 'utf8').matchAll(/require\("\.\/([a-z-]+)\.cjs"\)/g)].map(m => m[1]);
assert.equal(ORDER.length, 16);
function engineOf(side) {
  const E = {};
  const deps = { clock, ids: undefined, drafts: Object.freeze({ length: 0, key: () => null }) };
  for (const name of ORDER) Object.assign(E, (side[name] || require('../../../engine/' + name + '.cjs'))(E, deps));
  return E;
}
/* The FROZEN RECORD: the seed athlete, whose state is what the public census
   is computed from. Taken through JSON so neither side can mutate the other's. */
const FROZEN = engineOf(OURS).SEED;
const seedState = () => JSON.parse(JSON.stringify(FROZEN));

/* EVERY READER THE CENSUS READS, called on both compositions, plus the two
   readers this package touches by module. */
const READERS = ['nowModel', 'statusFace', 'currentRate', 'calorieTarget', 'proteinTarget',
  'marchingOrder', 'readRecency', 'fiveLevers', 'recoveryIndex', 'sleepInfo', 'observedTDEE',
  'weekDigest', 'debtLedger', 'theOneThing', 'dossierData', 'nowFocus', 'theOneFix'];
function project(side, state) {
  const E = engineOf(side);
  const out = {};
  for (const r of READERS) {
    if (typeof E[r] !== 'function') { out[r] = 'ABSENT-FROM-THE-COMPOSITION'; continue; }
    try { out[r] = JSON.stringify(E[r](state)); } catch (e) { out[r] = 'THREW ' + String(e && e.message).slice(0, 80); }
  }
  // The two readers the changed modules own, over the frozen record's own week.
  for (let i = 0; i < 7; i++) {
    const day = new Date(Date.UTC(2026, 8, 7 + i)).toISOString().slice(0, 10);
    try { out['genSession:' + day] = JSON.stringify(E.genSession(JSON.parse(JSON.stringify(state)), day, E.sleepInfo(state))); }
    catch (e) { out['genSession:' + day] = 'THREW ' + String(e && e.message).slice(0, 80); }
  }
  const diverged = JSON.parse(JSON.stringify(state));
  diverged.reads.push({ d: DAY, w: 186.4, sealed: false, note: 'SYNTHETIC second-gate divergence' });
  out.mergeState = JSON.stringify(E.mergeState(JSON.parse(JSON.stringify(state)), diverged));
  return out;
}

test('S3/SUP-14 - second-gate: the reader surface is real, and both compositions expose it', () => {
  const E = engineOf(OURS);
  assert.deepEqual(READERS.filter(r => typeof E[r] !== 'function'), [], 'every reader this cell compares exists on the composition');
  const A = engineOf(ACCEPTED);
  assert.deepEqual(READERS.filter(r => typeof A[r] !== 'function'), [], 'and on the accepted composition built from the sourceBase blobs');
  assert(READERS.length >= 15, 'the whole public surface, not a sample: ' + READERS.length);
});

test('S3/SUP-15 - second-gate: over the FROZEN RECORD the accepted engine and S3\'s agree BYTE FOR BYTE', () => {
  const state = seedState();
  assert(Number.isFinite(state.trend), 'the frozen record carries a trend');
  const a = project(ACCEPTED, state), b = project(OURS, state);
  const keys = Object.keys(a);
  assert.deepEqual(Object.keys(b), keys, 'the same projection keys');
  const moved = keys.filter(k => a[k] !== b[k]);
  assert.deepEqual(moved, [], 'no reader moves: the public record does not move');
  assert.equal(JSON.stringify(b), JSON.stringify(a), 'the whole projection, compared as one string');
  assert(keys.some(k => k.startsWith('genSession:') && b[k] !== 'null' && !b[k].startsWith('THREW')), 'the frozen week really produced a session');
});

test('S3/SUP-16 - second-gate: RED-FIRST - the ONE difference is a member the accepted engine does not have', () => {
  const A = engineOf(ACCEPTED), B = engineOf(OURS);
  const added = Object.keys(B).filter(k => !(k in A)).sort();
  const removed = Object.keys(A).filter(k => !(k in B)).sort();
  assert.deepEqual(added, ['sessionMembership'], 'RED-FIRST: exactly the reader');
  assert.deepEqual(removed, []);
  const state = seedState();
  const m = B.sessionMembership(state, '2026-09-07');
  const g = B.genSession(JSON.parse(JSON.stringify(state)), '2026-09-07', B.sleepInfo(state));
  if (m === null) assert.equal(g, null, 'a rest day on both'); else assert.deepEqual(m.exercise_ids.slice(), g.ex.map(c => c.id), 'and it names the seed\'s own pool');
  /* The seam is the other half, and on the frozen record it is invisible: the
     accepted merge and S3's have the same member set (SUP-6), and mergeState
     above compared byte for byte. */
  assert.deepEqual(Object.keys(OURS.merge(B, { clock })).sort(), Object.keys(ACCEPTED.merge(A, { clock })).sort());
});
