'use strict';
/* replay-registry.cjs - THE DECLARED REGISTER OF THE SHIPPED PAGE'S WRITERS.
   Lane D, ticket P3-REPLAY-ALL-FAMILIES.

   WHY THIS FILE EXISTS. Two tickets in a row found the same defect the same
   way: a screen wrote an operation of a class admission's replay had no family
   for, and an athlete who had used that screen could not import his own
   history (P3-X9 for Measure, RV-S1 for Sleep). Both were found by hand, after
   the fact, on a real device. A hand list would have missed both, because the
   list and the page drift apart the moment a new screen lands.

   So this is a REGISTER, not a list: one entry per (module, class) the SHIPPED
   page can write, and rebuild/lanes/d/p3-replay-all/writer-enumeration.test.mjs
   derives the same pairs from the A1 pinned input inventory by reading the
   writers themselves. An entry with no writer, or a writer with no entry, fails
   that cell. A new screen therefore cannot ship without either a family or a
   declared reason it is not in the generation.

   `family` is the replay family that answers for the class, and `rule` is what
   that family states about these records - EVIDENCE ROLE first, because that is
   the question a family exists to answer. `disposition` is 'family' or
   'not-in-generation', and 'not-in-generation' entries carry `refusal`: the
   named code admission raises if such an operation ever does reach it. */

const ENTRIES = Object.freeze([
  Object.freeze({module: 'rebuild/client/index.cjs', class: 'reading',
    kinds: Object.freeze(['fact', 'correction', 'tombstone']), profiles: Object.freeze([]),
    disposition: 'family', family: 'F1',
    rule: 'session evidence: the morning weigh-in is PROJECTED onto the replayed state '
      + 'through the accepted reading projector, in date order, one reading per day and '
      + 'never before the imported history\'s last read; malformed refuses '
      + 'LOCAL_SOURCE_READING_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m3/w7-preview/today/food-commands.cjs', class: 'food-day',
    kinds: Object.freeze(['fact']), profiles: Object.freeze(['earned/food-day/v1']),
    disposition: 'family', family: 'F2',
    rule: 'session evidence for the day it names: the winning row per date is PROJECTED '
      + 'onto the replayed state, and a date the imported history already holds is not '
      + 'overwritten; malformed refuses LOCAL_SOURCE_DAILY_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/client/index.cjs', class: 'session',
    kinds: Object.freeze(['session-start', 'session-set', 'session-close',
      'session-relationship-resolution']), profiles: Object.freeze([]),
    disposition: 'family', family: 'F3',
    rule: 'programme evidence: native sessions are PROJECTED through the accepted workout '
      + 'projector and prove the imported programme at their own start day, in the order '
      + 'the order map fixes; malformed refuses LOCAL_SOURCE_WORKOUT_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m4/workout/commands.cjs', class: 'session',
    kinds: Object.freeze(['session-start', 'session-set', 'session-skip', 'session-close']),
    profiles: Object.freeze(['earned/workout-prescription/v2']),
    disposition: 'family', family: 'F3',
    rule: 'programme evidence: the same family, over the operations the gym card writes '
      + 'through the accepted W6 host; malformed refuses LOCAL_SOURCE_WORKOUT_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m3/w7-preview/today/setup-commands.mjs', class: 'event',
    kinds: Object.freeze(['fact']), profiles: Object.freeze(['earned/first-run-setup/v1']),
    disposition: 'family', family: 'F4',
    rule: 'programme evidence: the first-run document is the programme admission proves the '
      + 'imported file against, and is RETAINED once that proof stands; exactly one may '
      + 'exist, and anything else refuses LOCAL_SOURCE_PROGRAMME_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/coach/machine-settings-commands.cjs', class: 'event',
    kinds: Object.freeze(['fact']), profiles: Object.freeze(['earned/machine-settings/v1']),
    disposition: 'family', family: 'F4',
    rule: 'no evidence role: a machine note is RETAINED against a lift the replayed state '
      + 'really holds, never projected and never part of the programme proof; a note for a '
      + 'lift the state does not hold refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m3/w7-preview/today/checkin-commands.cjs', class: 'event',
    kinds: Object.freeze(['fact']), profiles: Object.freeze(['earned/recovery-checkin/v1']),
    disposition: 'family', family: 'F5',
    rule: 'no evidence role: one check-in per day is RETAINED, never projected, so no answer '
      + 'of his moves a figure the imported history states; a second for the same day, or '
      + 'one the producer refuses, refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m3/w7-preview/measure/measure-commands.cjs',
    class: 'body-composition-source', kinds: Object.freeze(['fact']),
    profiles: Object.freeze(['earned/waist/v1', 'earned/measure-markers/v1',
      'earned/measure-trial-start/v1']),
    disposition: 'family', family: 'F7',
    rule: 'no evidence role: the trial start, the waist readings and the markers pick are '
      + 'RETAINED in their own dated order and never projected, and the baseline window '
      + 'stays the one derived from the import; malformed refuses '
      + 'LOCAL_SOURCE_MEASURE_UNRESOLVED, and a member of the shared class under a profile '
      + 'no family claims refuses LOCAL_SOURCE_BODY_COMPOSITION_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m3/w7-preview/today/sleep-commands.cjs', class: 'sleep',
    kinds: Object.freeze(['fact']), profiles: Object.freeze(['earned/sleep-night/v1']),
    disposition: 'family', family: 'F8',
    rule: 'no evidence role: nights are athlete records, not session or programme evidence; '
      + 'RETAINED in their own date then device_seq order, never projected, so a night '
      + 'before the import\'s last day is neither contradicted nor absorbed; malformed '
      + 'refuses LOCAL_SOURCE_SLEEP_UNRESOLVED'}),
  /* THE ONE WRITER IN THE PAGE THAT NO SHIPPED SCREEN REACHES. rebuild/client
     is the page's durable client and its API carries the plan writers -
     planEdit, respond, decision, undoRequest, acceptInitialPlan - but NO module
     of the A1 inventory calls any of them, and the enumeration cell proves that
     by reading the page's own modules rather than by saying so. The local era
     is single-device and carries no authority plan lane at all: admission
     refuses a plan operation, and a non-empty plan collection, by name. If a
     screen ever does reach one, this entry is what has to change, and the cell
     that reads it is what will say so. */
  Object.freeze({module: 'rebuild/client/index.cjs', class: 'plan',
    kinds: Object.freeze(['plan-mutation', 'proposal-response', 'undo-request']),
    profiles: Object.freeze(['earned/coach/proposal/v1']),
    disposition: 'not-in-generation', family: null,
    refusal: 'LOCAL_SOURCE_EFFECT_UNMAPPED',
    rule: 'no shipped screen route reaches a plan writer, and the local era has no plan, '
      + 'planTransactions, suspensions or issuances lane; admission refuses both a plan '
      + 'operation and a non-empty plan collection by name'}),
]);

/* The register, and the two ways the cells read it. */
const keyOf = entry => entry.module + '#' + entry.class;
const REGISTERED = Object.freeze(ENTRIES.map(keyOf));
const FAMILIES = Object.freeze([...new Set(ENTRIES.filter(e => e.family).map(e => e.family))].sort());

module.exports = {ENTRIES, REGISTERED, FAMILIES, keyOf};
