/* P3-REAL-SHAPE - THE FIX ROUND AFTER INDEPENDENT REVIEW R1.

   Two defects the reviewer MEASURED rather than argued, each pinned here in
   both directions, and each RED against the tree at 4f98e55.

   BLOCKING 1. A machine-settings note the owner saved on this phone BEFORE the
   import names a DOCUMENT lift by its slug. After option A a CORRESPONDED
   document lift is not in the admitted state under its own id at all - it was
   never appended, because the file already carries it under the file's own
   handle - so the F4 guard failed and the WHOLE import refused
   LOCAL_SOURCE_CONTEXT_UNRESOLVED, with no field on the screen.

   BLOCKING 2. Admission stopped proving `day` and `mg` per lift (spec 2.3);
   the Edit My Week companion went on comparing them. A file that puts a
   corresponded lift on the other day was ADMITTED, ADOPTED and painted, and
   then Edit My Week refused PLAN_EDIT_ORIGIN_UNPROVEN for good: the failure
   MOVED rather than removed, which is the one property the build claimed.

   SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { Fixture, PHONE, PHONE_ID, variant, sealed, sealNamed, walk, clone, durable,
  admitThrough, phoneNaming, withoutLift, tagProjector, companionFor, IMPORT_DAY }
  from './real-shape-support.mjs';
import * as Screen from '../../../m3/w7-preview/import/import-screen.mjs';
import { createMachineSettingsHost } from '../../../m3/w7-preview/today/machine-settings-host.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Corr = require('../../../m4/workout/lift-correspondence.cjs');

let TAGS = null;
test.before(async () => { TAGS = await tagProjector(); });

/* THE NOTE, WRITTEN THROUGH THE SHIPPED LANE. machine-settings-host.mjs is the
   page module gym-app.mjs:165 loads; nothing here is hand-built. */
function noteOn(exercise_id) {
  const box = { op_id: null };
  box.hook = async era => {
    const host = await createMachineSettingsHost({ day: IMPORT_DAY, era });
    const saved = await host.save({ exercise_id,
      settings: [{ name: 'Seat', value: 'four' }], cues: 'Synthetic machine note' });
    host.close();
    if (!saved.ok) throw new Error('the note would not save: ' + saved.code);
    box.op_id = saved.op_id;
  };
  return box;
}
const f4Of = view => (view.families || []).filter(f => f.family === 'F4');

/* ===== BLOCKING 1 ===== */

test('(r1) D-RS-R1-b1a - a machine-settings note saved on a CORRESPONDED '
  + 'document lift before the import is RETAINED, and the import ADMITS', async () => {
  /* The document's slug for the file's `lateral`, which the file does NOT
     carry under that id: exactly the shape that refused. */
  assert.equal(PHONE_ID.lateral, 'lateral-machine');
  assert.equal(Corr.correspondence(variant(0).exercises, PHONE.setup.exercises)['lateral-machine'],
    'lateral');
  assert.equal(variant(0).exercises.some(e => e.id === 'lateral-machine'), false);

  const note = noteOn('lateral-machine');
  const result = await admitThrough('r1-b1a', sealed(0), { before: note.hook });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  assert.deepEqual(f4Of(result.view).filter(f => f.op_id === note.op_id),
    [{ family: 'F4', state: 'retained', op_id: note.op_id }],
    'the owner\'s own machine note was not accounted for');
  result.era.close();
});

/* THE CONTROL, which was already green: a note on a document lift the file does
   NOT hold. That lift IS appended to the admitted state under its own id (spec
   2.5 case 2), so the guard found it then and must go on finding it now. */
const noLateral = () => sealNamed('r1-no-lateral', () => withoutLift(variant(0), 'lateral'));

test('(r1) D-RS-R1-b1b (the control) - a note on a document lift the file does '
  + 'NOT hold is retained through the APPENDED lift', async () => {
  const file = withoutLift(variant(0), 'lateral');
  assert.equal(Corr.correspondence(file.exercises, PHONE.setup.exercises)['lateral-machine'],
    undefined, 'this control is only a control while the lift corresponds to nothing');
  const note = noteOn('lateral-machine');
  const result = await admitThrough('r1-b1b', noLateral(), { before: note.hook });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  assert.equal(result.view.state.exercises.some(e => e.id === 'lateral-machine'), true);
  assert.deepEqual(f4Of(result.view).filter(f => f.op_id === note.op_id),
    [{ family: 'F4', state: 'retained', op_id: note.op_id }]);
  result.era.close();
});

/* AND THE GUARD IS NOT WEAKENED. A note naming a lift NEITHER side carries is
   still an operation this replay cannot place, and it still refuses. */
test('(r1) D-RS-R1-b1c (the guard) - a note naming a lift neither the file nor '
  + 'the document carries still refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED', async () => {
  const note = noteOn('no-such-lift-at-all');
  const result = await admitThrough('r1-b1c', sealed(0), { before: note.hook });
  assert.equal(result.admitted, false, 'an unplaceable note was admitted');
  assert.deepEqual(result.issues,
    [{ code: 'LOCAL_SOURCE_CONTEXT_UNRESOLVED', op_id: note.op_id }]);
  result.era.close();
});

/* ===== BLOCKING 2 =====
   The document is the owner's, typed at first run; the file is the old app's.
   `Calves` is one of the four lifts whose slug and whose file handle are the
   same word, so the companion binds this row BY ID and the binding is not in
   question - only what is COMPARED across it is. */
const movedDay = () => phoneNaming(Fixture.TYPED_LIFTS
  .map(l => (l.n === 'Calves' ? { ...l, day: 'U' } : l)));
const movedMg = () => phoneNaming(Fixture.TYPED_LIFTS
  .map(l => (l.n === 'Calves' ? { ...l, mg: 'hams' } : l)));

async function editableAfter(tag, setup, check) {
  const out = await walk(tag, sealed(0), { setup });
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const adopted = admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: setup.setup.athlete_label, namespace: out.kit.scope.namespace });
  assert.notEqual(adopted, null, 'admitted but not adopted');
  check(adopted);
  /* THE WHOLE CLAIM: what admission admitted, the editor can edit. */
  assert.doesNotThrow(() => companionFor(loaded.generation, out.kit.scope, clone(adopted),
    TAGS, setup), 'Edit My Week refuses a basis the page already adopted');
  out.kit.close();
}

test('(r1) D-RS-R1-b2a - a corresponded lift the FILE puts on the other day is '
  + 'admitted, adopted on the FILE\'s day, and Edit My Week OPENS', async () => {
  const setup = movedDay();
  assert.equal(setup.setup.exercises.find(e => e.id === 'calves').day, 'U');
  assert.equal(variant(0).exercises.find(e => e.id === 'calves').day, 'L');
  await editableAfter('r1-b2a', setup, adopted =>
    assert.equal(adopted.exercises.find(e => e.id === 'calves').day, 'L',
      'the athlete trains the FILE\'s week'));
});

test('(r1) D-RS-R1-b2b - a corresponded lift the FILE files under another muscle '
  + 'group is admitted, adopted on the FILE\'s group, and Edit My Week OPENS', async () => {
  const setup = movedMg();
  assert.equal(setup.setup.exercises.find(e => e.id === 'calves').mg, 'hams');
  assert.equal(variant(0).exercises.find(e => e.id === 'calves').mg, 'calves');
  await editableAfter('r1-b2b', setup, adopted =>
    assert.equal(adopted.exercises.find(e => e.id === 'calves').mg, 'calves'));
});

/* AND THE OTHER DIRECTION: the narrowing is the BINDING's, not the guard's. A
   document row that reaches NO basis lift - neither by its own id nor by its
   normalised name - is still a document this companion cannot edit safely, and
   it still refuses. The row here is the appended tombstoned lift, renamed on
   the basis so that neither address finds it; nothing else is touched. */
test('(r1) D-RS-R1-b2c (the guard) - a document row that reaches no basis lift '
  + 'at all still refuses PLAN_EDIT_ORIGIN_UNPROVEN', async () => {
  const out = await walk('r1-b2c', sealed(0));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const adopted = clone(admittedLocalSourceBasis(loaded.generation,
    { athleteLabel: PHONE.setup.athlete_label, namespace: out.kit.scope.namespace }));
  assert.doesNotThrow(() => companionFor(loaded.generation, out.kit.scope, clone(adopted), TAGS));
  const row = PHONE.setup.exercises.find(e => e.id === 'lateral-machine');
  assert.notEqual(row, undefined);
  const lift = adopted.exercises.find(e => e.id === 'lateral');
  lift.id = 'lateral-elsewhere'; lift.n = 'A lift by no name of his';
  assert.throws(() => companionFor(loaded.generation, out.kit.scope, adopted, TAGS),
    { code: 'PLAN_EDIT_ORIGIN_UNPROVEN' });
  out.kit.close();
});

/* ===== THE NOTES, ANSWERED ===== */

const mapFor = tag => (tag === 'null' ? null
  : tag === 'week' ? { ...Fixture.SPLIT_MAP }
  : { ...Fixture.SPLIT_MAP, 1: Fixture.SPLIT_MAP[1] === 'REST' ? 'U' : 'REST' });
const periods = list => sealNamed('r1-split-' + list.map(p => p.from + '/' + p.tag).join('|'),
  () => { const state = variant(0);
    state.split = list.map(p => ({ from: p.from, map: mapFor(p.tag) }));
    return state; });

/* NOTE 3. An earlier period's `map` is SHAPE-checked now, so a `null` one
   cannot land in his state unread. RED before the period loop's new line. */
test('(r1) D-RS-R1-n3 - an EARLIER period whose map is null refuses split.map '
  + 'by name instead of being stored unvalidated', async () => {
  const out = await walk('r1-n3', periods([{ from: '2026-06-01', tag: 'null' },
    { from: Fixture.SPLIT_FROM, tag: 'week' }]));
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'split.map', field: 'split.map' });
  out.kit.close();
});

test('(r1) D-RS-R1-n3c (the control) - an EARLIER period carrying a genuinely '
  + 'different week is retained unexamined and the file ADMITS', async () => {
  const out = await walk('r1-n3c', periods([{ from: '2026-06-01', tag: 'other' },
    { from: Fixture.SPLIT_FROM, tag: 'week' }]));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  const loaded = await out.kit.era.generation();
  const state = loaded.generation.collections.derived.localSource.view.state;
  assert.equal(state.split.length, 2, 'the athlete\'s own history of his week was dropped');
  assert.equal(state.split[0].map[1], 'REST', 'the earlier week was not retained as it stood');
  out.kit.close();
});

/* NOTE 4. THE TIE ON `from` IS A RULE: the LAST period the file lists wins.
   Both orders are driven, so the cell states the rule rather than recording
   whichever way the sort happened to fall. */
test('(r1) D-RS-R1-n4 - two periods sharing one `from`: the LAST one the file '
  + 'lists is the period in force, in either order', async () => {
  const matchingLast = await walk('r1-n4a', periods([{ from: Fixture.SPLIT_FROM, tag: 'other' },
    { from: Fixture.SPLIT_FROM, tag: 'week' }]));
  assert.equal(matchingLast.refusal, null, JSON.stringify(matchingLast.refusal));
  matchingLast.kit.close();

  const matchingFirst = await walk('r1-n4b', periods([{ from: Fixture.SPLIT_FROM, tag: 'week' },
    { from: Fixture.SPLIT_FROM, tag: 'other' }]));
  assert.deepEqual(matchingFirst.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'split.map', field: 'split.map' },
    'the period in force must be the LAST one listed, not the matching one');
  matchingFirst.kit.close();
});

/* NOTE 6. `split.map` LEADING A REFUSAL, ON THE PAGE. The controller-level
   cover exists; this is the sentence the owner would actually read, and it
   replaces the page cover the P3-X11 re-point moved to `athlete_label`. */
test('(r1) D-RS-R1-n6 - a file whose period IN FORCE is not the phone\'s week '
  + 'refuses on the page, leading with split.map and writing nothing', async () => {
  const out = await walk('r1-n6', periods([{ from: Fixture.SPLIT_FROM, tag: 'other' }]));
  assert.deepEqual(out.refusal, { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    detail: 'split.map', field: 'split.map' });
  /* THE SENTENCE ON THE SCREEN IS THE FIELD'S OWN, not the generic one: the
     leading field is what the page reads out, which is the whole point of the
     cover P3-X11 moved off `split.map`. */
  assert.equal(typeof out.line, 'string');
  assert.equal(out.line, Screen.refusalLines('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
    'split.map', 'split.map').join(' '));
  assert.notEqual(out.line,
    Screen.refusalLines('LOCAL_SOURCE_PROGRAMME_UNRESOLVED', null, null).join(' '));
  const after = await durable(out.kit.era);
  assert.equal(after.applied, false);
  assert.equal(after.basis, false);
  out.kit.close();
});

/* NOTE 5. THE TWO ID SPACES INSIDE ONE PROJECTED RECORD, PINNED. The entry
   moves to the FILE's lift; the slot key stays under the id the capture was
   WRITTEN with, deliberately (source-admission.mjs, the re-key paragraph). The
   next reader of a projected entry would reasonably assume the two agree, so
   the cell says out loud that they do not. */
test('(r1) D-RS-R1-n5 - after the re-key a projected entry names the FILE\'s '
  + 'lift while its slot key still encodes the DOCUMENT\'s slug', async () => {
  const result = await admitThrough('r1-n5', sealed(0), { workout: '2026-09-18', at: '2026-09-19' });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  const sessions = [...(result.view.workout_facts?.sessions || []),
    ...(result.view.workout_facts?.incomplete_sessions || [])];
  assert.equal(sessions.length, 1);
  const entries = sessions[0].record.entries;
  assert.equal(entries.length > 0, true);
  const moved = entries.find(e => e.lift_lineage_id === 'calves');
  assert.notEqual(moved, undefined, 'the entry was not re-keyed to the file lift');
  assert.equal(PHONE_ID.calves, 'calves', 'this lift must be one whose slug and handle differ');
  const other = entries.find(e => e.lift_lineage_id === 'hack');
  assert.notEqual(other, undefined);
  assert.equal(PHONE_ID.hack, 'hack-squat');
  /* THE SLOT KEY, UNMOVED, on the very entry whose address moved. */
  const slots = other.slots.map(s => s.logical_set_slot).filter(s => typeof s === 'string');
  assert.equal(slots.length > 0, true, 'no slot carried a logical_set_slot to pin');
  for (const key of slots)
    assert.equal(key.includes(PHONE_ID.hack), true,
      'the slot key moved: it no longer encodes the id the capture was written with (' + key + ')');
  result.era.close();
});
