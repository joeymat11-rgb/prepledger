/* P3-REAL-SHAPE - THE BAR, part 2: AND NOTHING OF HIS IS LOST (spec section 4
   (c), (d), (d2), (d3), (d4), (d5), (n5), (n6), (n7)), plus the id-collision
   cell spec review R2 asked for, here (d6).

   These are the cells where the phone's own history meets the file's, which is
   the one place option A cannot be "the file wins" and has to be "and nothing
   of his is lost".

   The admission path here is the CONTROLLER path the D-RS-g measurement used -
   the real controller, the real producer registry, the real custody handle and
   the real commit capability - because a phone that already holds one Earned
   workout is what these cells are about. The cells that make a claim about a
   SCREEN use the shipped page.

   SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Fixture, PHONE, PHONE_ID, variant, sealed, sealNamed, walk, durable, reopen,
  admitThrough, phoneNaming, phoneState, withoutLift, clone, IMPORT_DAY,
  tagProjector, companionFor } from './real-shape-support.mjs';
import { textOf } from '../../../m3/w7-preview/import/test/support.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Corr = require('../../../m4/workout/lift-correspondence.cjs');

const U_DAY = '2026-09-17';     // Thursday: U on the phone's week and on the file's
const L_DAY = '2026-09-18';     // Friday: L on both
const AFTER = '2026-09-19';     // Saturday: the import day for these cells
const NEXT_U = '2026-09-20';
const totalOn = (lifts, day) => lifts.filter(e => e.day === day).reduce((n, e) => n + e.sets, 0);
const fileIds = () => new Set(variant(0).exercises.map(e => e.id));
const sessionsOf = view => [...(view.workout_facts?.sessions || []),
  ...(view.workout_facts?.incomplete_sessions || [])];

let TAGS = null;
test.before(async () => { TAGS = await tagProjector(); });

/* (c) ONE PRE-IMPORT SESSION UNDER A SLUG ID, RE-ATTACHED. D-RS-g1 INVERTED.
   The slot count stays the DOCUMENT's - as recorded, never rebased - and the
   ADDRESS moves to the file's lift. */
test('(c) D-RS-BAR-c - a phone that recorded one Earned workout before '
  + 'importing ADMITS the real-shape file, and the projected session is keyed '
  + 'to the FILE\'s lift ids with the DOCUMENT\'s slot count', async () => {
  const result = await admitThrough('bar-c', sealed(0), { workout: L_DAY, at: AFTER });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  const sessions = sessionsOf(result.view);
  assert.equal(sessions.length, 1, 'the pre-import session is not in the record');
  const entries = sessions[0].record.entries;
  const ids = fileIds();
  /* THE FOUR IDS THE FILE AND THE PHONE GENUINELY SHARE (press, pulldown,
     tricep, calves) are shared BY THE SAME NAME, so for those the re-key is the
     identity and the id is both a handle and a slug. The claim is therefore
     that every entry names a FILE lift, and that at least one of them moved. */
  const onlyHandle = id => ids.has(id) && !Object.values(PHONE_ID).includes(id);
  for (const entry of entries)
    assert.equal(ids.has(entry.lift_lineage_id), true,
      'a slot is still keyed to the phone\'s own slug: ' + entry.lift_lineage_id);
  assert.equal(entries.some(e => onlyHandle(e.lift_lineage_id)), true,
    'no slot was re-keyed at all');
  /* AS RECORDED. The count is the DOCUMENT's, not the file's. */
  const slots = entries.reduce((n, e) => n + e.slots.length, 0);
  const phoneL = totalOn(PHONE.setup.exercises, 'L'), fileL = totalOn(variant(0).exercises, 'L');
  assert.notEqual(phoneL, fileL, 'the two documents must disagree');
  assert.equal(slots, phoneL, 'the recorded session was rebased');
  assert.equal(result.recordedSlots, phoneL);
  /* AND IT IS IN HIS HISTORY, under the file's lift. */
  const state = result.view.state;
  for (const entry of entries)
    assert.equal(state.exercises.some(e => e.id === entry.lift_lineage_id), true,
      'the admitted state does not carry the lift his own session names');
  result.era.close();
});

/* (d) AN AMBIGUOUS NAME, KEPT AS ITS OWN ENTRY. The file names TWO lifts
   'Machine fly', so the phone's one row corresponds to neither: it is kept as
   its own inactive lift, tombstoned on the import day, and his recorded session
   stays under it. Nothing is silently merged into a lift he did not train. */
test('(d) D-RS-BAR-d - a document row the file names twice corresponds to '
  + 'neither, is kept as its own retired lift, and the recorded session stays '
  + 'under it', async () => {
  const bundle = sealNamed('two-flies', () => {
    const state = variant(0);
    state.exercises.find(e => e.id === 'hipthrust').n = 'Machine fly';
    return state;
  });
  const result = await admitThrough('bar-d', bundle, { workout: U_DAY, at: AFTER });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  const state = result.view.state;
  const kept = PHONE_ID.fly;
  assert.equal(kept, 'machine-fly');
  const row = state.exercises.find(e => e.id === kept);
  assert.notEqual(row, undefined, 'the document row was dropped');
  assert.equal((state.retirements || {})[kept], AFTER, 'the kept lift was not tombstoned');
  /* The file's own two 'Machine fly' lifts are both there, both active. */
  for (const id of ['fly', 'hipthrust']) {
    assert.equal(state.exercises.some(e => e.id === id), true, id);
    assert.equal(Object.hasOwn(state.retirements || {}, id), false, id);
  }
  /* His session still names the kept lift, not one of the file's two. */
  const entries = sessionsOf(result.view)[0].record.entries;
  assert.equal(entries.some(e => e.lift_lineage_id === kept), true,
    'his recorded set was re-keyed onto a lift he did not train');
  result.era.close();
});

/* (d2) AN UNMATCHED LIFT WITH NO RECORDED SESSION AT ALL. The ordinary case,
   and the cell review R1 (B5) found missing: the phone's setup names sixteen
   lifts, the file holds fifteen, and the sixteenth was never trained here.
   Without the UNCONDITIONAL append this is a permanent PLAN_EDIT_ORIGIN_UNPROVEN. */
const fifteen = () => sealNamed('fifteen', () => withoutLift(variant(0), 'sulek'));
const MISSING = 'sulek-wrist-curl-high-cable';

test('(d2) D-RS-BAR-d2 - a setup lift the file does not hold, with no recorded '
  + 'session at all, is kept as an inactive tombstoned lift, changes no card '
  + 'total, and Edit My Week OPENS', async () => {
  assert.equal(PHONE_ID.sulek, MISSING);
  const out = await walk('bar-d2', fifteen());
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(state.exercises.some(e => e.id === MISSING), true, 'the lift was dropped');
  assert.equal((state.retirements || {})[MISSING], IMPORT_DAY, 'it was not tombstoned');
  assert.equal(state.exercises.length, 16, 'fifteen file lifts plus the one kept');

  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace });
  assert.notEqual(adopted, null);
  assert.doesNotThrow(() => companionFor(loaded.generation, out.kit.scope, clone(adopted), TAGS),
    'Edit My Week refuses the ordinary case');
  out.kit.close();

  /* THE CARD IS UNCHANGED BY IT on the U day it would have sat on. */
  const file = withoutLift(variant(0), 'sulek');
  const morning = await reopen(out.kit.indexedDB, out.kit.scope, NEXT_U);
  const card = await morning.booted.workout.gym.read();
  assert.equal(card.phase, 'ready', card.code || card.phase);
  assert.equal(card.total, totalOn(file.exercises, 'U'));
  morning.close();
});

/* (n6) THE APPENDED LIFT STAYS OUT OF THE POOL, AND STAYS OUT (review R1 N6).
   `exActive` (engine/plan.cjs:87-95) honours `retirements` with NO date
   comparison at all, which is what makes this true and is also why 2.5's
   document-side membership rule is the right one. */
test('(n6) D-RS-BAR-n6 - after a later boot on a new day the kept lift is '
  + 'still off the card on both day kinds and still out of exOrder', async () => {
  const out = await walk('bar-n6', fifteen());
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  out.kit.close();
  const file = withoutLift(variant(0), 'sulek');
  const later = await reopen(out.kit.indexedDB, out.kit.scope, '2026-09-27');
  const loaded = await later.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(state.exOrder.U.includes(MISSING), false, 'the kept lift is in the U order');
  assert.equal(state.exOrder.L.includes(MISSING), false, 'the kept lift is in the L order');
  const card = await later.booted.workout.gym.read();
  assert.equal(card.phase, 'ready', card.code || card.phase);
  assert.equal(card.total, totalOn(file.exercises, 'U'), 'the kept lift reached the card');
  later.close();
  /* The L day is blocked by GAP 5 and not by this lift; D-RS-h holds that. */
});

/* (d3) TWO DOCUMENT ROWS, ONE FILE LIFT (review R1 B3). 'Machine fly' and
   'Machine fly.' normalise alike, so NEITHER corresponds, both are kept as
   their own retired lifts, the file's 'Machine fly' is bound by no row, and the
   companion opens with every row bound to a DIFFERENT basis lift. A build that
   makes `correspondence` injective on only one side fails this cell. */
const twoRows = () => {
  const lifts = [];
  for (const lift of Fixture.TYPED_LIFTS) {
    lifts.push(lift);
    if (lift.n === 'Machine fly') lifts.push({ ...lift, n: 'Machine fly.' });
  }
  return phoneNaming(lifts);
};

test('(d3) D-RS-BAR-d3 - two document rows whose names normalise alike bind '
  + 'NOTHING: both are kept as their own retired lifts, the file\'s lift is '
  + 'bound by no row, and Edit My Week opens', async () => {
  const setup = twoRows();
  assert.equal(setup.setup.exercises.length, 17);
  const rows = setup.setup.exercises.filter(e => Corr.normaliseName(e.n) === 'machine fly');
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map(e => e.id), ['machine-fly', 'machine-fly-2']);
  /* THE RULE ITSELF, before the walk: neither row corresponds. */
  const map = Corr.correspondence(variant(0).exercises, setup.setup.exercises);
  assert.equal(Object.hasOwn(map, 'machine-fly'), false);
  assert.equal(Object.hasOwn(map, 'machine-fly-2'), false);
  assert.equal(Object.values(map).includes('fly'), false, 'the file\'s lift was bound anyway');

  const out = await walk('bar-d3', sealed(0), { setup });
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  for (const id of ['machine-fly', 'machine-fly-2']) {
    assert.equal(state.exercises.some(e => e.id === id), true, 'dropped ' + id);
    assert.equal((state.retirements || {})[id], IMPORT_DAY, 'not tombstoned ' + id);
  }
  assert.equal(state.exercises.some(e => e.id === 'fly'), true);
  assert.equal(Object.hasOwn(state.retirements || {}, 'fly'), false);
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: setup.setup.athlete_label, namespace: out.kit.scope.namespace });
  assert.notEqual(adopted, null);
  assert.doesNotThrow(() => companionFor(loaded.generation, out.kit.scope, clone(adopted),
    TAGS, setup));
  out.kit.close();
});

/* (d6) THE ID COLLISION, REFUSED BY NAME (spec review R2, small thing 2). The
   phone's 'Hack' slugs to `hack`, which is the FILE's handle for 'Hack squat'.
   The two are not the same lift by name, so neither the correspondence nor the
   `held` skip can answer for them, and both the capture block and the
   companion's id branch would bind that row to a DIFFERENT lift, silently.
   It is refused instead, by the field the closed vocabulary already has. */
test('(d6) D-RS-BAR-d6 - a document row whose slug equals a file handle under a '
  + 'DIFFERENT name refuses exercise_id and names the colliding id', async () => {
  const lifts = Fixture.TYPED_LIFTS.map(l => (l.n === 'Hack squat' ? { ...l, n: 'Hack' } : l));
  const setup = phoneNaming(lifts);
  assert.equal(setup.setup.exercises.find(e => e.n === 'Hack').id, 'hack');
  assert.equal(variant(0).exercises.find(e => e.id === 'hack').n, 'Hack squat');
  assert.deepEqual(Corr.idCollisions(variant(0).exercises, setup.setup.exercises), ['hack']);
  const out = await walk('bar-d6', sealed(0), { setup });
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'exercise_id hack', field: 'exercise_id' });
  const after = await durable(out.kit.era);
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  out.kit.close();
});

/* AND THE CONTROL: on the real-shape fixture against the phone the owner
   actually types, no collision arises at all - the four shared ids
   (press, pulldown, tricep, calves) are shared BY THE SAME NAME. */
test('(d6) D-RS-BAR-d6c (the control) - the real-shape fixture and the owner\'s '
  + 'own setup share four ids, and every one of them is the same lift by name', () => {
  assert.deepEqual(Corr.idCollisions(variant(0).exercises, PHONE.setup.exercises), []);
  const shared = variant(0).exercises.map(e => e.id)
    .filter(id => PHONE.setup.exercises.some(e => e.id === id)).sort();
  assert.deepEqual(shared, ['calves', 'press', 'pulldown', 'tricep']);
});

/* (d4) THE CAPTURE'S ORDER IS STILL PROVED (review R1 B2). The order comparison
   is against the DOCUMENT's own pool order for that day - the programme that
   WROTE the capture - so a capture whose slot order disagrees with it refuses
   by name, on a file whose lifts all correspond. */
test('(d4) D-RS-BAR-d4 - a pre-import capture whose slot order is not the '
  + 'DOCUMENT\'s own pool order for that day refuses capture_membership', async () => {
  const permuted = phoneState();
  permuted.exOrder = { U: permuted.exOrder.U.slice(), L: permuted.exOrder.L.slice().reverse() };
  const result = await admitThrough('bar-d4', sealed(0),
    { workout: L_DAY, at: AFTER, recordState: permuted, keepOpen: false });
  assert.equal(result.admitted, false, 'the order comparison is not live');
  assert.equal(result.issues.some(i => i.field === 'capture_membership'), true,
    JSON.stringify(result.issues));
});

/* ITS CONTROL: the same capture, with the FILE's own exOrder shuffled so the
   FILE's pool order differs from the document's, still ADMITS - because the
   file's order is NOT what a capture written before the import is asked to
   match. This is what proves the right-hand side moved. */
test('(d4) D-RS-BAR-d4c (the control) - the FILE\'s own order shuffled still '
  + 'ADMITS, because the file\'s order is not what the capture was written '
  + 'against', async () => {
  const bundle = sealNamed('file-order-shuffled', () => {
    const state = variant(0);
    state.exOrder = { U: state.exOrder.U.slice().reverse(), L: state.exOrder.L.slice().reverse() };
    return state;
  });
  const result = await admitThrough('bar-d4c', bundle,
    { workout: L_DAY, at: AFTER, keepOpen: false });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
});

/* (d5) A START ON A DAY THE WEEK CALLS REST (review R1 B1). `sessionMembership`
   returns NULL for any day that is not U or L (engine/today.cjs:83-85), so a
   diff that reads `expected.exercise_ids` before testing `!expected` CRASHES
   here instead of refusing, and OPT-3's diagnosis-by-field-name fails exactly
   when it is needed. The phone's stored SETUP calls the Friday REST; the card
   that wrote the capture was prescribed from a state that calls it L. */
test('(d5) D-RS-BAR-d5 - a pre-import Start on a day the DOCUMENT\'s week calls '
  + 'REST refuses capture_membership BY NAME, with no TypeError on the path',
async () => {
  const restDays = { 0: 'U', 1: 'L', 4: 'U' };
  const setup = phoneNaming(Fixture.TYPED_LIFTS, { days: restDays });
  const bundle = sealNamed('rest-friday', () => {
    const state = variant(0);
    state.split[0].map = { ...state.split[0].map, 5: 'REST' };
    return state;
  });
  /* The card prescribed from a week that DOES call the Friday L. */
  const prescribing = clone(createCleanInitState({ setup: PHONE.setup }));
  for (const ex of prescribing.exercises) ex.w = ex.steps[0];
  const result = await admitThrough('bar-d5', bundle,
    { setup, workout: L_DAY, at: AFTER, recordState: prescribing, keepOpen: false });
  assert.equal(result.admitted, false);
  assert.deepEqual(result.issues.map(i => i.field).sort(), ['capture_membership']);
  assert.equal(result.issues[0].code, 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
});

/* (n5) THE WRITE ITSELF, NOT JUST ITS CONSEQUENCE (review R1 N5). The label
   write and the retired-lift append of spec 2.4 are asserted DIRECTLY on
   `view.state`, which is the state AFTER the applyRead and food-projection
   reassignments that follow them in replay().
   THE FROZEN QUESTION IS MEASURED, NOT ASSUMED: `prep.candidateState()` is
   `() => copy(candidate)` (m4/import/replay-core.cjs:87), a fresh
   structuredClone per call, so the candidate state is NOT frozen and a
   strict-mode assignment on it cannot throw. */
test('(n5) D-RS-BAR-n5 - the label and the appended lifts are on view.state '
  + 'itself, and they survive every later reassignment in replay()', async () => {
  const result = await admitThrough('bar-n5', fifteen(), { at: IMPORT_DAY, keepOpen: false });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  const state = result.view.state;
  assert.equal(state.athlete_label, PHONE.setup.athlete_label);
  assert.equal(state.exercises.some(e => e.id === MISSING), true);
  assert.equal((state.retirements || {})[MISSING], IMPORT_DAY);
  /* The old app's own tombstone from the file is still there beside the new
     one: the append MERGES into `retirements`, it does not replace it. */
  assert.equal((state.retirements || {}).pronated, '2026-08-12');
  /* And the state really did go through the rest of replay(): the file's own
     reads and its recorded history are on it. */
  assert.equal(Array.isArray(state.reads) && state.reads.length > 0, true);
  assert.equal(Object.keys(state.sessionLog || {}).length > 0, true);
});

/* (n7) THE SAMPLE-NUMBERS SENTENCE CLEARS (review R1 N7). After the spec 2.4
   label write the adopted state always carries the phone's label, so
   `setupNoteNeeded` is false and today-app.cjs:2156 stops putting the sentence
   on Today. It is one of the most visible consequences of this ticket. */
const TodayApp = require('../../../m3/w7-preview/today/today-app.cjs');
const SAMPLE_NOTE = TodayApp.SAMPLE_DATA_NOTE;

test('(n7) D-RS-BAR-n7 - the morning after an ADOPTED import the sample-numbers '
  + 'sentence is not on Today, and the predicate that puts it there still '
  + 'answers true for a state that carries no label', async () => {
  assert.equal(SAMPLE_NOTE, 'Sample data. Set up your week to start your own.');
  const good = await walk('bar-n7a', sealed(0));
  assert.equal(good.refusal, null, JSON.stringify(good.refusal));
  good.kit.close();
  const morning = await reopen(good.kit.indexedDB, good.kit.scope, NEXT_U);
  await morning.booted.api.render('today', true);
  assert.equal(textOf(morning.doc).includes(SAMPLE_NOTE), false,
    'Today still calls his own imported numbers a sample');
  const loaded = await morning.era.generation();
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: good.kit.scope.namespace });
  morning.close();

  /* BOTH DIRECTIONS on the predicate itself, which today-app.cjs exports for
     exactly this ("Exported so the suite can assert both directions", :315).
     The label write of spec 2.4 is the ONLY thing standing between the adopted
     state and the sentence: take the label off and the sentence is owed again. */
  assert.equal(TodayApp.setupNoteNeeded(true, PHONE.setup.athlete_label, adopted), false);
  const unlabelled = clone(adopted);
  delete unlabelled.athlete_label;
  assert.equal(TodayApp.setupNoteNeeded(true, PHONE.setup.athlete_label, unlabelled), true);
});
