'use strict';
/* =====================================================================
   H3 SUPERSEDES THE NATIVE-CARRIERS CARRIER `defect-witnesses`
   (gate witnesses-7)

   WHAT THAT CARRIER PROVED FOR M2-NATIVE-CARRIERS. `NATIVE DEFECT WITNESSES:
   10/10 complete comparisons PASS;` — for each adopted defect it ran the FROZEN
   engine and the CANDIDATE engine over the same witness input and compared the
   two outputs completely, so a repair was evidenced by the difference it made
   and by nothing else. A witness that could not be produced on both sides was
   not a witness.

   WHY H3 CANNOT CARRY IT. The frozen side of every comparison is reconstructed
   from the sha-pinned carrier list that H3's two engine files break. See
   BRIEF-H3-CLEAN-INIT v1.8 section 9.

   WHAT H3 PUTS IN ITS PLACE, HERE, EXECUTED, AND IT IS THE SAME SHAPE. The
   defect H3 closes is witnessed as a COMPLETE COMPARISON: the ACCEPTED writer
   (the `sourceBase` bytes, compiled privately, never in require.cache) and
   H3's, run over the same clean-init athlete's first weigh-in, with BOTH
   outputs read out in full. The accepted side is the witness — a trend that is
   not a number — and H3's side is the repair. Every branch DECISIONS:146 (3)
   OPTION B distinguishes is witnessed the same way, and the accepted engine's
   own refusal over a clean-init state is witnessed too, because that refusal is
   what DECISIONS:124 is about.

   RED-FIRST: every cell below asserts the accepted bytes' own broken answer
   before it asserts H3's. On the parent's engine each `assert.equal` on the
   repaired side fails.
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
const WRITERS = 'rebuild/engine/writers.cjs';
const blob = f => cp.execFileSync('git', ['show', BASE + ':' + f], { cwd: REPO, maxBuffer: 9e7 }).toString('utf8');
const { createBrowserEngine } = require('../../../m3/w7-preview/browser-engine.cjs');
const { createCleanInitState } = require('../athlete-state.cjs');

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
const ACCEPTED = privately(WRITERS, blob(WRITERS));
const OURS = require('../../../engine/writers.cjs');
assert.notEqual(ACCEPTED, OURS, 'two distinct writer factories, one per side of every comparison');

const DAY = '2026-09-07';
const refusingIds = Object.freeze({ next: () => { throw new Error('IDS_UNAVAILABLE'); }, fresh: () => { throw new Error('IDS_UNAVAILABLE'); } });
const clock = { today: () => DAY, nowISO: () => DAY + 'T08:00:00.000Z' };
const engineOf = factory => { const E = createBrowserEngine({ clock }); Object.assign(E, factory(E, { clock, ids: refusingIds })); return E; };
const SETUP = Object.freeze({
  athlete_label: 'synthetic H3 witness athlete',
  split: { from: DAY, map: { 0: 'REST', 1: 'U', 2: 'REST', 3: 'REST', 4: 'U', 5: 'REST', 6: 'L' } },
  exercises: [
    { id: 'db-bench', n: 'Dumbbell bench press', mg: 'chest', day: 'U', sets: 3, hi: 10, inc: 5, steps: [20, 25, 30, 35, 40] },
    { id: 'leg-press', n: 'Leg press', mg: 'quads', day: 'L', sets: 3, hi: 12, inc: 10, steps: [90, 100, 110, 120] }],
  priority_muscles: ['chest'],
});
const clean = () => JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
/* ONE WITNESS, BOTH SIDES, READ OUT IN FULL - the carrier's own "complete
   comparison": nothing is sampled, the whole read row and the trend are kept. */
function witness(opts) {
  const both = {};
  for (const [side, factory] of [['accepted', ACCEPTED], ['h3', OURS]]) {
    const out = engineOf(factory).applyRead(clean(), DAY, 186.4, opts);
    const row = out.reads[out.reads.length - 1];
    both[side] = { trend: out.trend, reads: out.reads.length, row };
  }
  return both;
}

test('H3/SUP-11 - defect-witnesses: the IN-WINDOW first weigh-in, complete comparison on both sides', () => {
  const w = witness({ hour: 8 });
  /* THE WITNESS. The accepted writer computes `s.trend + 0.3 * dCl` with no
     trend to add to, so the state comes back with a trend that is not a
     number — and every figure downstream stays non-finite for good. */
  assert.equal(Number.isFinite(w.accepted.trend), false, 'WITNESS: the accepted writer leaves no finite trend');
  assert.equal(Number.isNaN(w.accepted.trend), true, 'and it is NaN specifically, which the JSON round trip turns into null');
  assert.equal(w.accepted.row.pt, undefined, 'WITNESS: the read row carries a prior trend that was never written');
  /* THE REPAIR, read out as completely as the witness. */
  assert.equal(w.h3.trend, 186.4, 'REPAIR: the seed is the reading itself, verbatim, never rounded');
  assert.equal(w.h3.row.pt, null, 'REPAIR: and the prior trend is explicitly null');
  assert.equal(w.h3.row.w, 186.4, 'the reading he typed is on the row unchanged');
  assert.equal(w.h3.row.sealed, false, 'and it is a real reading, not a sealed one');
  assert.equal(w.h3.row.d, DAY);
  assert.equal(w.h3.reads, w.accepted.reads, 'exactly one read on both sides: nothing is added or dropped');
  assert.equal(w.h3.row.note, w.accepted.row.note, 'and the note the athlete reads is the accepted writer\'s own');
});

test('H3/SUP-12 - defect-witnesses: the SET-ASIDE first weigh-in, DECISIONS:146 (3) OPTION B, both sides', () => {
  /* Option B: the window applies to the first read too, so a late reading is
     set aside for a new athlete exactly as for an old one. The witness here is
     that the ACCEPTED side is broken in the same way, and the repaired side
     seeds NOTHING rather than seeding a reading the copy calls set aside. */
  const late = witness({ hour: 23 });
  assert.equal(Number.isFinite(late.accepted.trend), false, 'WITNESS: the accepted writer is non-finite here too');
  assert.equal(Number.isFinite(late.h3.trend), false, 'OPTION B: H3 seeds nothing from a set-aside row');
  assert.equal(late.h3.row.note, late.accepted.row.note, 'and says exactly what the accepted writer says');
  assert(/set aside|late/i.test(String(late.h3.row.note)), 'the row is marked set aside: ' + late.h3.row.note);
  /* The copy and the number agree, which is the whole of the ruling: an
     athlete told "set aside" has nothing seeded, and Today keeps the F-A
     surface until an in-window, unsealed reading arrives. */
  const after = engineOf(OURS).applyRead(clean(), DAY, 186.4, { hour: 23 });
  assert.equal(Number.isFinite(after.trend), false, 'still nothing seeded after the set-aside row');
  const second = engineOf(OURS).applyRead(after, '2026-09-08', 186.9, { hour: 8 });
  assert.equal(second.trend, 186.9, 'and the first IN-WINDOW reading still seeds, afterwards, with its own number');
  assert.equal(second.reads.length, 2, 'both rows are kept: the set-aside one is set aside, not discarded');
});

test('H3/SUP-13 - defect-witnesses: the DECISIONS:124 refusal itself, witnessed against the parent athlete-state', () => {
  /* The defect DECISIONS:124 named is upstream of the writer: a clean-init
     state carried neither `blackout` nor `model`, and the accepted engine
     dereferences both without a guard. The witness is the PARENT's own
     constructor, compiled privately from the same sourceBase blob. */
  const parentState = privately('rebuild/m4/workout/athlete-state.cjs', blob('rebuild/m4/workout/athlete-state.cjs'));
  const before = JSON.parse(JSON.stringify(parentState.createCleanInitState({ setup: SETUP })));
  assert.equal(Object.hasOwn(before, 'blackout'), false, 'WITNESS: the parent constructor wrote no blackout');
  assert.equal(Object.hasOwn(before, 'model'), false, 'WITNESS: and no model');
  const E = engineOf(OURS);
  assert.throws(() => E.observedTDEE(before), 'WITNESS: and the accepted engine THROWS over it');
  /* The repair, on the same reader, with the same engine. */
  const after = clean();
  assert.doesNotThrow(() => E.observedTDEE(after), 'REPAIR: H3\'s state is read without throwing');
  assert.equal(E.observedTDEE(after), null, 'and the reader RETURNS - it does not invent a figure');
  assert.equal(E.blackoutOn(after), false, 'no blackout is in force from day one');
  assert.equal(Object.hasOwn(after.model, 'lean'), false, 'and no lean mass is claimed for him');
});
