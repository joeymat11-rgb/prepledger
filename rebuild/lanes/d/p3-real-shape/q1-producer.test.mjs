/* P3-REAL-SHAPE - PM QUESTION 1, THE MEASUREMENT THAT DECIDES IT.

   DECISIONS:521 ruled Q1 YES - the page's capture producer moves to
   CONFIGURATION_PROFILE so a `BW` or `hold` lift prescribes - PROVIDED the
   build FIRST measures a pre-existing v1 capture and keeps v1 captures readable
   beside v2, with a cell proving BOTH DIRECTIONS. If v1 and v2 cannot coexist
   on the read path the build STOPS on this item, records exactly what refused,
   and reports.

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
  const kit = await phone('q1a', { at: WORKOUT_DAY });
  await recordAWorkout(kit.era, WORKOUT_DAY, phoneState());
  kit.close();
  const card = await cardOn(kit, NEXT_U);
  assert.equal(card.phase, 'ready', card.code || card.phase);
});

/* DIRECTION ONE: a PRE-EXISTING v1 capture, read after the producer moves.
   MEASURED: it is NOT readable. The page's history projector resolves every
   stored Start's layout through ONE adapter built from the page's own producer
   identity (m3/w6/host/workout-host.mjs:169-173), and engine-capture.cjs
   readLayout refuses any capture whose producer is not that adapter's
   (:118-119, `!same(capture.producer,producer)` -> ENGINE_CAPTURE_PROFILE_INVALID).
   The durable client contains the throw and the card blocks by its own generic
   code. THE OWNER'S PHONE HOLDS v1 CAPTURES TODAY, so this is his case. */
test('D-RS-q1b (PM QUESTION 1, direction one) - a v1 capture already on the '
  + 'device is NOT readable once the page produces CONFIGURATION_PROFILE: the '
  + 'same morning that prepared under v1 blocks under v2', async () => {
  const kit = await phone('q1b', { at: WORKOUT_DAY });
  await recordAWorkout(kit.era, WORKOUT_DAY, phoneState());
  kit.close();
  const under1 = await cardOn(kit, NEXT_U);
  const under2 = await cardOn(kit, NEXT_U, { producerIdentity: V2 });
  assert.deepEqual(under1, { phase: 'ready', code: null, total: under1.total },
    'the control must prepare, or this cell proves nothing');
  assert.equal(under1.total, 27);
  assert.deepEqual(under2, { phase: 'blocked', code: 'WORKOUT_PREPARATION_INVALID', total: null });
});

/* DIRECTION TWO: the producer is v2 from the first boot. MEASURED: the v2
   producer cannot complete a workout on the SHIPPED page at all. The layout it
   writes is `earned/captured-lift-layout/v2` (engine-capture.cjs:18) and the
   ACCEPTED history projector admits `earned/captured-lift-layout/v1` and
   nothing else (engine-history.cjs:62-63 -> WORKOUT_CAPTURE_LAYOUT_UNPROVEN),
   so the card blocks part-way through the session and the next read asks for a
   reconciliation. The v2 history path is a CANDIDATE
   (m4/spec/configured-history-candidate/), not an accepted one. */
test('D-RS-q1c (PM QUESTION 1, direction two) - a device whose page produces '
  + 'CONFIGURATION_PROFILE cannot record a whole workout: the card blocks '
  + 'mid-session and the next morning asks for a history reconciliation', async () => {
  const kit = await phone('q1c', { at: WORKOUT_DAY, producerIdentity: V2 });
  let recorded = null, refusal = null;
  try { recorded = await recordAWorkout(kit.era, WORKOUT_DAY, phoneState()); }
  catch (error) { refusal = String(error && error.message); }
  kit.close();
  assert.equal(recorded, null);
  assert.equal(refusal, 'the session never completed: blocked');
  const card = await cardOn(kit, NEXT_U, { producerIdentity: V2 });
  assert.deepEqual(card,
    { phase: 'unfinished', code: 'WORKOUT_HISTORY_RECONCILIATION_REQUIRED', total: null });
});

/* THE VERDICT THIS LANE RECORDS. Both directions refuse, so the proviso
   DECISIONS:521 attached to Q1 is NOT met and this build does NOT move
   `today-bindings.mjs`. GAP 5 therefore stands, named, and D-RS-h stays green
   as the record of it: on the morning after an adopted import the owner's LOWER
   day - which is where his `BW` raise and his `hold` hack live - still has no
   card. The fallback the spec named (leave the page on v1 and refuse the import
   by name on a configuration load) is NOT taken either: it would refuse an
   import that otherwise succeeds, which is worse for the owner than a blocked
   card he can see. Back to the PM (spec 6.2 (1) says so in those words). */
test('D-RS-q1d (the verdict) - the page\'s producer is still Adapter.PROFILE, '
  + 'and this ticket did not move it', async () => {
  assert.equal(PRODUCER.rule_profile, Adapter.PROFILE);
  assert.notEqual(Adapter.PROFILE, Adapter.CONFIGURATION_PROFILE);
});
