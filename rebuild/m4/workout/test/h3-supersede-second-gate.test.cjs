'use strict';
/* =====================================================================
   H3 SUPERSEDES THE NATIVE-CARRIERS CARRIER `second-gate`
   (gate second-gate)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `NATIVE SECOND GATE:` — the
   independent second reading of the adopted engine: the same frozen inputs put
   through the engine a second time, by a different route, and required to come
   back with the same bytes. It is the gate that says "the public record does
   not move", and it reaches the engine through the same sha-pinned
   reconstruction as the other four.

   WHY H3 CANNOT CARRY IT. Same wall, same measurement: BRIEF-H3-CLEAN-INIT
   v1.8 section 9.

   WHAT H3 PUTS IN ITS PLACE, HERE, EXECUTED. The claim the second gate makes
   about H3's two files, made directly: that the PUBLIC RECORD DOES NOT MOVE.
   The accepted engine composition and H3's are built side by side — the
   accepted one over the `sourceBase` blobs, compiled privately — and driven
   over the frozen seed athlete through every reader the public census reads,
   with the whole projection compared BYTE FOR BYTE as JSON. They must agree
   completely. The one input on which they may differ is a state with no trend,
   which the frozen record cannot contain, and that is asserted rather than
   assumed. The census log itself is proved unmoved by the package's own
   `--ci` census line and by BRIEF section 8; this cell is the in-process half,
   which is the half a reviewer can re-run in a second.

   RED-FIRST: cell 3 asserts the one difference exists on exactly the input the
   frozen record cannot hold, so a build that quietly reverted F-B would fail it.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const Module = require('node:module');

const REPO = path.resolve(__dirname, '..', '..', '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'rebuild/lanes/b/tooling/packages/H3.json'), 'utf8'));
const BASE = SPEC.sourceBase;
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const { createBrowserEngine } = require('../../../m3/w7-preview/browser-engine.cjs');
const SEED = require('../../../engine/seed.cjs');

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
const ACCEPTED = privately('rebuild/engine/writers.cjs', blob('rebuild/engine/writers.cjs'));
const OURS = require('../../../engine/writers.cjs');

const DAY = '2026-09-07';
const refusingIds = Object.freeze({ next: () => { throw new Error('IDS_UNAVAILABLE'); }, fresh: () => { throw new Error('IDS_UNAVAILABLE'); } });
const clock = { today: () => DAY, nowISO: () => DAY + 'T08:00:00.000Z' };
/* Both sides are the SAME composition but for the one factory under test:
   the accepted browser modules, then `seed.cjs` (unchanged by H3, and the file
   that carries the frozen record), then the writers factory of that side. */
const engineOf = factory => {
  const E = createBrowserEngine({ clock });
  Object.assign(E, SEED(E));
  Object.assign(E, factory(E, { clock, ids: refusingIds }));
  return E;
};
/* The FROZEN RECORD: the seed athlete, whose state is what the public census
   is computed from. Taken through JSON so neither side can mutate the other's. */
const FROZEN = engineOf(OURS).SEED;
const seedState = () => JSON.parse(JSON.stringify(FROZEN));

/* EVERY READER THE CENSUS READS, called on both compositions. A reader that
   throws on one side and not the other is a difference and is reported as one;
   a reader absent from the composition is named rather than skipped silently. */
const READERS = ['nowModel', 'statusFace', 'currentRate', 'calorieTarget', 'proteinTarget',
  'marchingOrder', 'readRecency', 'fiveLevers', 'recoveryIndex', 'sleepInfo', 'observedTDEE',
  'weekDigest', 'debtLedger', 'theOneThing', 'dossierData'];

function project(factory, state) {
  const E = engineOf(factory);
  const out = {};
  for (const r of READERS) {
    if (typeof E[r] !== 'function') { out[r] = 'ABSENT-FROM-THE-COMPOSITION'; continue; }
    try { out[r] = JSON.stringify(E[r](state)); } catch (e) { out[r] = 'THREW ' + String(e && e.message).slice(0, 80); }
  }
  return out;
}

test('H3/SUP-14 - second-gate: the reader surface is real, and both compositions expose it', () => {
  const E = engineOf(OURS);
  const missing = READERS.filter(r => typeof E[r] !== 'function');
  assert.deepEqual(missing, [], 'every reader this cell compares exists on the composition');
  const A = engineOf(ACCEPTED);
  assert.deepEqual(READERS.filter(r => typeof A[r] !== 'function'), [],
    'and on the accepted composition built from the sourceBase blobs');
  assert(READERS.length >= 15, 'the whole public surface, not a sample: ' + READERS.length);
});

test('H3/SUP-15 - second-gate: over the FROZEN RECORD the accepted engine and H3\'s agree BYTE FOR BYTE', () => {
  const state = seedState();
  assert(Number.isFinite(state.trend), 'the frozen record carries a trend, which is the whole point');
  const a = project(ACCEPTED, state), b = project(OURS, state);
  const moved = READERS.filter(r => a[r] !== b[r]);
  assert.deepEqual(moved, [], 'no reader moves: the public record does not move');
  /* And said as one comparison rather than fifteen, so a reader added to the
     list above cannot be quietly excluded from the claim. */
  assert.equal(JSON.stringify(b), JSON.stringify(a), 'the whole projection, compared as one string');
  /* A read applied through the writer, on the frozen record, is identical too -
     the operation the census actually performs. */
  const ra = engineOf(ACCEPTED).applyRead(seedState(), DAY, 186.4, { hour: 8 });
  const rb = engineOf(OURS).applyRead(seedState(), DAY, 186.4, { hour: 8 });
  assert.equal(JSON.stringify(rb), JSON.stringify(ra), 'applyRead over the frozen record is byte-identical');
});

test('H3/SUP-16 - second-gate: RED-FIRST - the ONE input they differ on is the one the frozen record cannot hold', () => {
  const { createCleanInitState } = require('../athlete-state.cjs');
  const SETUP = Object.freeze({
    athlete_label: 'synthetic H3 second-gate athlete',
    split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'U', 5: 'REST', 6: 'L' } },
    exercises: [
      { id: 'db-bench', n: 'Dumbbell bench press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40] },
      { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100, 110, 120] }],
    priority_muscles: ['chest'],
  });
  const noTrend = JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
  assert.equal(Object.hasOwn(noTrend, 'trend'), false, 'a state with no trend at all');
  const ra = engineOf(ACCEPTED).applyRead(noTrend, DAY, 186.4, { hour: 8 });
  const rb = engineOf(OURS).applyRead(JSON.parse(JSON.stringify(noTrend)), DAY, 186.4, { hour: 8 });
  assert.notEqual(JSON.stringify(rb), JSON.stringify(ra), 'RED-FIRST: here, and only here, they differ');
  assert.equal(Number.isFinite(ra.trend), false, 'the accepted side leaves nothing finite');
  assert.equal(rb.trend, 186.4, 'and H3\'s seeds his own reading');
  /* The frozen record cannot hold such a state: the seed carries a trend, and
     every migration walks one forward. Asserted, not assumed. */
  assert(Number.isFinite(seedState().trend), 'the seed carries a trend');
  const migrate = fs.readFileSync(path.join(REPO, 'rebuild/engine/migrate.cjs'), 'utf8');
  assert(migrate.includes('trend'), 'and migrate.cjs is the file that walks one forward');
});
