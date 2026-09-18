/* P3-LAYOUT-V2 - THE PAGE CELLS. DECISIONS:522.

   The ruling: the projector's layout law admits the CONFIGURATION_PROFILE
   producer's layout BESIDE v1, each read by its own adapter with byte-for-byte
   the same checks; the page registers the v2 producer for NEW captures and
   keeps reading every capture it already recorded; a BW or hold lift
   prescribes and its card opens.

   These four cells are the page half of that: (a) and (b) are PM QUESTION 1's
   two directions, (c) is the deciding cell's L day, (f) is the import
   admission path reading a v2 capture on a pre-import session. The projector
   half - the same refusals under both profiles - is projector-parity.test.mjs.

   Nothing is stubbed. The producer is the era's own option
   (today-bindings.mjs openTodayOverLocalEra `producerIdentity`), the card is
   the page's card, the import is the shipped Import route, and the workout is
   driven through the real gym model.

   SYNTHETIC ONLY. Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { PHONE, variant, sealed, walk, reopen, phone, phoneState, recordAWorkout,
  admitThrough } from '../p3-real-shape/real-shape-support.mjs';
import { PRODUCER } from '../../../m3/w6/local/today-bindings.mjs';

const require = createRequire(import.meta.url);
const Adapter = require('../../../m4/workout/engine-capture.cjs');

/* THE TWO PRODUCER IDENTITIES, both of them THIS installation's own with only
   `rule_profile` moved. Named explicitly rather than taken from the default so
   these cells measure the same thing before and after the page moves. */
const V1 = Object.freeze({ ...PRODUCER, rule_profile: Adapter.PROFILE });
const V2 = Object.freeze({ ...PRODUCER, rule_profile: Adapter.CONFIGURATION_PROFILE });

const WORKOUT_DAY = '2026-09-18';   // the Friday the phone's own week calls L
const NEXT_U = '2026-09-20';        // the Sunday it calls U
const L_DAY = '2026-09-18';         // the Friday the FILE's week calls L
const AFTER = '2026-09-19';         // the import day for the controller cells
const totalOn = (lifts, day) => lifts.filter(e => e.day === day).reduce((n, e) => n + e.sets, 0);

async function cardOn(kit, day, producerIdentity) {
  const next = await reopen(kit.indexedDB, kit.scope, day, { producerIdentity });
  const card = await next.booted.workout.gym.read();
  next.close();
  return { phase: card.phase, code: card.code || null,
    total: card.total ?? null, sets: card.sets ?? null };
}

/* (a) DIRECTION ONE, INVERTED. D-RS-q1b measured this and it BLOCKED:
   the page resolved every stored Start's layout through ONE adapter built from
   the page's own producer identity (workout-host.mjs:169-173), so a capture
   written under v1 was refused the moment the page produced v2
   (engine-capture.cjs:118-119 -> ENGINE_CAPTURE_PROFILE_INVALID, contained by
   the durable client as WORKOUT_PREPARATION_INVALID).
   THE OWNER'S PHONE HOLDS v1 CAPTURES TODAY, so this is his case. */
test('D-L2-a (direction one) - a workout recorded under the v1 producer still '
  + 'PROJECTS once the page produces CONFIGURATION_PROFILE, and the next '
  + 'prescribing morning opens its card', async () => {
  const kit = await phone('l2a', { at: WORKOUT_DAY, producerIdentity: V1 });
  const total = await recordAWorkout(kit.era, WORKOUT_DAY, phoneState());
  kit.close();
  /* The SAME IndexedDB, reopened with the v2 producer registered. */
  const same = await cardOn(kit, WORKOUT_DAY, V2);
  assert.equal(same.phase, 'finished', same.code || same.phase);
  assert.equal(same.sets, total, 'the v1 session did not project under v2');
  const next = await cardOn(kit, NEXT_U, V2);
  assert.deepEqual(next, { phase: 'ready', code: null, total: 27, sets: null });
});

/* (b) DIRECTION TWO, INVERTED. D-RS-q1c measured this and the card BLOCKED
   PART-WAY THROUGH THE SESSION: the layout the v2 adapter writes is
   `earned/captured-lift-layout/v2` (engine-capture.cjs:18) and the accepted
   projector admitted `earned/captured-lift-layout/v1` and nothing else
   (engine-history.cjs:63 -> WORKOUT_CAPTURE_LAYOUT_UNPROVEN), so the next read
   asked for a reconciliation it could never get. */
test('D-L2-b (direction two) - a device whose page produces '
  + 'CONFIGURATION_PROFILE from the first boot records a WHOLE workout, '
  + 'projects it, reconciles, and the next prescribing morning is ready',
  async () => {
  const kit = await phone('l2b', { at: WORKOUT_DAY, producerIdentity: V2 });
  const total = await recordAWorkout(kit.era, WORKOUT_DAY, phoneState());
  kit.close();
  const same = await cardOn(kit, WORKOUT_DAY, V2);
  assert.equal(same.phase, 'finished', same.code || same.phase);
  assert.equal(same.sets, total);
  const next = await cardOn(kit, NEXT_U, V2);
  assert.deepEqual(next, { phase: 'ready', code: null, total: 27, sets: null });
});

/* (c) THE DECIDING CELL'S L DAY. GAP 5 CLOSED, on the SHIPPED page with its
   own default producer - nothing is named here, the page is taken as it is.
   D-RS-h recorded the gap: after the real-shape file is adopted, the Friday
   the file's own week calls L carries the `BW` raise and the `hold` hack, and
   the card was BLOCKED on ENGINE_CAPTURE_LOAD_UNPROVEN. */
test('D-L2-c (the deciding cell, L day) - after the real-shape file is adopted '
  + 'the L day\'s card is READY with the FILE\'s set count, and the bodyweight '
  + 'raise and the held hack both PRESCRIBE their own configuration',
  async () => {
  const out = await walk('l2c', sealed(5));
  assert.equal(out.refusal, null, JSON.stringify(out.refusal));
  out.kit.close();
  const next = await reopen(out.kit.indexedDB, out.kit.scope, L_DAY);
  const card = await next.booted.workout.gym.read();
  assert.equal(card.phase, 'ready', card.code || card.phase);
  const file = variant(5);
  const fileL = totalOn(file.exercises, 'L'), phoneL = totalOn(PHONE.setup.exercises, 'L');
  assert.notEqual(fileL, phoneL, 'the two documents must disagree, or this proves nothing');
  assert.equal(card.total, fileL);
  /* THE PAGE'S OWN HOST, probed without storing anything, so every slot of the
     day is read and not only the active one. */
  const prepared = await next.booted.workout.gymHost.host.client
    .prepareWorkout({ planned_split_slot_id: 'earned-today-preview/' + L_DAY });
  assert.equal(prepared.prepared, true, prepared.code);
  for (const [id, key] of [['hanging', 'BW'], ['hack', 'hold']]) {
    const lift = file.exercises.find(e => e.id === id);
    assert.equal(lift.w, key, 'the fixture must still carry this configuration load');
    const slots = prepared.view.slots.filter(s => s.lift_lineage_id === id);
    assert.equal(slots.length, lift.sets, id + ' has no slots on the card');
    for (const slot of slots) {
      assert.equal(slot.load.state, 'specified', id);
      assert.equal(slot.load.display, key, id);
      assert.deepEqual(JSON.parse(slot.load.source_json),
        { kind: 'configuration', configuration_key: key }, id);
    }
  }
  next.close();
});

/* (f) THE IMPORT ADMISSION PATH, on a phone whose pre-import Earned session was
   captured under v2. source-admission.mjs's capture provenance block already
   accepts BOTH producer profiles (`capture_producer`, :598) and builds its
   adapter from the capture's OWN producer, so nothing there needed to move;
   what it could not do was PROJECT, because the projector it composes carried
   the same v1-only layout law. capture_sets, capture_membership and
   capture_lift all still hold, and this cell drives all three. */
test('D-L2-f (admission) - a pre-import Earned session captured under '
  + 'CONFIGURATION_PROFILE is read by the capture provenance block, the file '
  + 'ADMITS, and the session rides in as recorded', async () => {
  const result = await admitThrough('l2f', sealed(0),
    { workout: L_DAY, at: AFTER, producerIdentity: V2 });
  assert.equal(result.admitted, true, JSON.stringify(result.issues));
  const sessions = [...(result.view.workout_facts?.sessions || []),
    ...(result.view.workout_facts?.incomplete_sessions || [])];
  assert.equal(sessions.length, 1, 'the pre-import session is not in the record');
  assert.equal(sessions[0].capture.producer.rule_profile, Adapter.CONFIGURATION_PROFILE,
    'the capture was not written under v2, so this cell proves nothing');
  /* AS RECORDED, never rebased: the slot count is the DOCUMENT's. */
  const slots = sessions[0].record.entries.reduce((n, e) => n + e.slots.length, 0);
  const phoneL = totalOn(PHONE.setup.exercises, 'L');
  assert.notEqual(phoneL, totalOn(variant(0).exercises, 'L'), 'the documents must disagree');
  assert.equal(slots, phoneL);
  assert.equal(result.recordedSlots, phoneL);
  /* AND IT IS IN HIS HISTORY, under a lift the admitted state carries. */
  for (const entry of sessions[0].record.entries)
    assert.equal(result.view.state.exercises.some(e => e.id === entry.lift_lineage_id), true,
      'the admitted state does not carry the lift his own session names');
  result.era.close();
});
