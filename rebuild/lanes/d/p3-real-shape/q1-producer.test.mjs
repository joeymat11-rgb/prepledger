/* P3-REAL-SHAPE - PM QUESTION 1, THE MEASUREMENT THAT DECIDES IT.

   DECISIONS:521 ruled Q1 YES - the page's capture producer moves to
   CONFIGURATION_PROFILE so a `BW` or `hold` lift prescribes - PROVIDED the
   build FIRST measures a pre-existing v1 capture and keeps v1 captures readable
   beside v2, with a cell proving BOTH DIRECTIONS. If v1 and v2 cannot coexist
   on the read path the build STOPS on this item, records exactly what refused,
   and reports.

   P3-LAYOUT-V2 (DECISIONS:522) FLIPPED THESE THREE CELLS. P3-REAL-SHAPE
   measured both directions REFUSING and stopped on the item, which is what
   :522 ruled on: the projector's layout law now admits the v2 layout beside
   v1 (engine-history.cjs) and the host dispatches each stored capture to its
   own reading adapter (workout-host.mjs), so the page moved to the v2 producer
   (today-bindings.mjs). The claims below are the SAME measurements, restated to
   what they now measure; the file's structure, its walk and its fixture are
   untouched. The proviso's own cell - a v1 capture and a v2 capture coexisting
   on the read path - is D-L2-a and D-L2-b in lanes/d/p3-layout-v2.

   The owner's own logged sessions were written under v1, so this is not a
   hypothetical: his phone holds v1 captures today.

   Nothing is stubbed. The producer is the era's own option
   (today-bindings.mjs openTodayOverLocalEra `producerIdentity`), the card is the
   page's card, and the workout is driven through the real gym model.

   Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { phone, reopen, phoneState, recordAWorkout } from './real-shape-support.mjs';
import { PRODUCER } from '../../../m3/w6/local/today-bindings.mjs';

const require = createRequire(import.meta.url);
const Adapter = require('../../../m4/workout/engine-capture.cjs');
const V2 = Object.freeze({ ...PRODUCER, rule_profile: Adapter.CONFIGURATION_PROFILE });
/* NAMED, not defaulted. Before P3-LAYOUT-V2 the page's own PRODUCER was the v1
   one and these cells could take the default; now it is the v2 one, so the v1
   side of every direction has to be asked for by name to keep measuring the
   same thing. Only `rule_profile` differs from the page's own identity. */
const V1 = Object.freeze({ ...PRODUCER, rule_profile: Adapter.PROFILE });

const WORKOUT_DAY = '2026-09-18';   // the Friday the phone's own week calls L
const NEXT_U = '2026-09-20';        // the Sunday it calls U

async function cardOn(kit, day, options) {
  const next = await reopen(kit.indexedDB, kit.scope, day, options);
  const card = await next.booted.workout.gym.read();
  next.close();
  return { phase: card.phase, code: card.code || null, total: card.total ?? null };
}

/* THE CONTROL. One Earned workout written under the page's OWN producer (v1),
   read back the next prescribing morning under the same producer. */
test('D-RS-q1a (control) - a workout recorded under the v1 producer is read '
  + 'back under the v1 producer and the next card prepares', async () => {
  const kit = await phone('q1a', { at: WORKOUT_DAY, producerIdentity: V1 });
  await recordAWorkout(kit.era, WORKOUT_DAY, phoneState());
  kit.close();
  const card = await cardOn(kit, NEXT_U, { producerIdentity: V1 });
  assert.equal(card.phase, 'ready', card.code || card.phase);
});

/* DIRECTION ONE: a PRE-EXISTING v1 capture, read after the producer moves.
   MEASURED BY P3-REAL-SHAPE: NOT readable. The page's history projector
   resolved every stored Start's layout through ONE adapter built from the
   page's own producer identity (m3/w6/host/workout-host.mjs), and
   engine-capture.cjs readLayout refuses any capture whose producer is not that
   adapter's (:118-119, `!same(capture.producer,producer)` ->
   ENGINE_CAPTURE_PROFILE_INVALID); the durable client contained the throw and
   the card blocked by its own generic WORKOUT_PREPARATION_INVALID.
   MEASURED NOW, after P3-LAYOUT-V2: readable. The host mints a SIBLING reading
   adapter for the stored capture's own profile - this installation's identity
   with only `rule_profile` taken from the capture - so the same morning
   prepares under either producer, with the same card and the same total.
   THE OWNER'S PHONE HOLDS v1 CAPTURES TODAY, so this is his case. */
test('D-RS-q1b (PM QUESTION 1, direction one) - a v1 capture already on the '
  + 'device is STILL readable once the page produces CONFIGURATION_PROFILE: '
  + 'the morning that prepared under v1 prepares identically under v2', async () => {
  const kit = await phone('q1b', { at: WORKOUT_DAY, producerIdentity: V1 });
  await recordAWorkout(kit.era, WORKOUT_DAY, phoneState());
  kit.close();
  const under1 = await cardOn(kit, NEXT_U, { producerIdentity: V1 });
  const under2 = await cardOn(kit, NEXT_U, { producerIdentity: V2 });
  assert.deepEqual(under1, { phase: 'ready', code: null, total: under1.total },
    'the control must prepare, or this cell proves nothing');
  assert.equal(under1.total, 27);
  assert.deepEqual(under2, under1, 'the v1 capture is not read the same way under v2');
});

/* DIRECTION TWO: the producer is v2 from the first boot. MEASURED BY
   P3-REAL-SHAPE: the v2 producer could not complete a workout on the shipped
   page at all. The layout it writes is `earned/captured-lift-layout/v2`
   (engine-capture.cjs:18) and the ACCEPTED history projector admitted
   `earned/captured-lift-layout/v1` and nothing else (engine-history.cjs:63 ->
   WORKOUT_CAPTURE_LAYOUT_UNPROVEN), so the card blocked part-way through the
   session and the next read asked for a reconciliation.
   MEASURED NOW, after P3-LAYOUT-V2: the law admits both profiles, so the whole
   session records, projects and closes, and the next prescribing morning is
   ready. What is NOT decided here is carrying a typed load onto the PERFORMED
   side: that is still the candidate's question
   (m4/spec/configured-history-candidate/) and no byte of it moved. */
test('D-RS-q1c (PM QUESTION 1, direction two) - a device whose page produces '
  + 'CONFIGURATION_PROFILE records a WHOLE workout: the session closes and the '
  + 'next prescribing morning is ready', async () => {
  const kit = await phone('q1c', { at: WORKOUT_DAY, producerIdentity: V2 });
  let recorded = null, refusal = null;
  try { recorded = await recordAWorkout(kit.era, WORKOUT_DAY, phoneState()); }
  catch (error) { refusal = String(error && error.message); }
  kit.close();
  assert.equal(refusal, null);
  assert.equal(recorded, 21, 'the phone document\'s own L day is 21 slots');
  const card = await cardOn(kit, NEXT_U, { producerIdentity: V2 });
  assert.deepEqual(card, { phase: 'ready', code: null, total: 27 });
});

/* THE VERDICT, AS IT NOW STANDS. P3-REAL-SHAPE measured both directions
   refusing, did NOT move `today-bindings.mjs`, and handed gap 5 back to the PM
   with its two refusals named. The PM ruled at DECISIONS:522 and P3-LAYOUT-V2
   built it: the projector admits both layout profiles, the host reads each
   capture with its own adapter, and the page therefore produces v2. GAP 5 IS
   CLOSED and its record is D-RS-h, flipped in the same round: the morning
   after an adopted import the owner's LOWER day has a card and his `BW` raise
   prescribes. */
test('D-RS-q1d (the verdict) - the page\'s producer is now '
  + 'Adapter.CONFIGURATION_PROFILE, and the two profiles are still two',
  async () => {
  assert.equal(PRODUCER.rule_profile, Adapter.CONFIGURATION_PROFILE);
  assert.notEqual(Adapter.PROFILE, Adapter.CONFIGURATION_PROFILE);
});
