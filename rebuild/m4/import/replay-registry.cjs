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
      + 'the order map fixes; a session recorded BEFORE the import is projected after the '
      + 'imported prefix only on the athlete\'s own Yes to the identity question, which is '
      + 'the start interpretation engine-order.cjs requires (local-capture-start-resume); '
      + 'a No, an unanswered question, a start the file does not precede, or a malformed '
      + 'record refuses LOCAL_SOURCE_WORKOUT_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m4/workout/commands.cjs', class: 'session',
    kinds: Object.freeze(['session-start', 'session-set', 'session-skip', 'session-close']),
    profiles: Object.freeze(['earned/workout-prescription/v2']),
    disposition: 'family', family: 'F3',
    rule: 'programme evidence: the same family, over the operations the gym card writes '
      + 'through the accepted W6 host, whose captures carry this profile and are read '
      + 'with it (local-capture-start-resume); malformed refuses '
      + 'LOCAL_SOURCE_WORKOUT_UNRESOLVED'}),
  Object.freeze({module: 'rebuild/m3/w7-preview/today/setup-commands.mjs', class: 'event',
    kinds: Object.freeze(['fact']), profiles: Object.freeze(['earned/first-run-setup/v1']),
    disposition: 'family', family: 'F4',
    rule: 'programme evidence: the first-run document is the programme admission '
      + 'proves the imported file against, and is RETAINED once that proof stands. '
      + 'The proof is the SHAPE of the programme and nothing else: every split '
      + 'period map, the lift ids, and each lift day and mg, with every split '
      + 'from bounded not after today. Set counts, rep targets, increments, '
      + 'ladders, volume tags and priority muscles are RETAINED from the file, '
      + 'never proved, because the first-run flow cannot state them per lift. '
      + 'Exactly one document may exist, and anything else refuses '
      + 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED'}),
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
  /* THE PLAN WRITER THE PAGE REACHES: THE NATIVE-LOAD YES (S11 FC09, PM ruling
     DECISIONS:878). rebuild/client is the page's durable client and its API
     carries the plan writers - planEdit, respond, decision, undoRequest,
     acceptInitialPlan. Until NATIVE-LOAD no module of the A1 inventory called
     any of them and this entry was 'not-in-generation'. The native-load Yes on
     Today now calls respond, through the guarded native path only
     (today-entry.mjs -> createNativeLoadHost().respond -> local-client
     respondNativeLoad -> t2-stage.cjs nativeRespond), and writes ONE
     proposal-response whose payload is exactly {proposal_id, answer:'accept',
     issuance} (NATIVE-LOAD-SPEC R9.13 :101); it writes no plan,
     planTransactions, planTxns, planHistory, suspensions or issuances record.
     Cell P3-EN3 found it, and F9 (rebuild/m4/import/native-load-replay.cjs)
     answers for it. The enumeration cell still PROVES that respond is the only
     plan writer the page reaches, and only at those guarded sites, so the other
     kinds stay out of the generation: every other plan operation, and a
     non-empty plan collection, still refuses LOCAL_SOURCE_EFFECT_UNMAPPED by
     name at admission. */
  Object.freeze({module: 'rebuild/client/index.cjs', class: 'plan',
    kinds: Object.freeze(['proposal-response']),
    profiles: Object.freeze(['earned/native-load/v1', 'earned/native-load-decision/v1']),
    disposition: 'family', family: 'F9',
    rule: 'programme evidence: a native-load Yes (the native-load producer\'s accept, owned by '
      + 'its producer, its decision profile or a matching native proposal ID) is FOLDED, not '
      + 'retained: FC03 runs once at the source cut over the admitted state as its immutable '
      + 'base, and the fold - applied, held with its Undo, retired, or refused by FC03 by '
      + 'name - is bound into the interpretation digest, never written back into the base; a '
      + 'malformed native accept, a missing issuance or a decline refuses '
      + 'LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID (detail NATIVE_LOAD_RECORD_INVALID), and any '
      + 'other plan operation keeps LOCAL_SOURCE_EFFECT_UNMAPPED'}),
]);

/* The register, and the two ways the cells read it. */
const keyOf = entry => entry.module + '#' + entry.class;
const REGISTERED = Object.freeze(ENTRIES.map(keyOf));
const FAMILIES = Object.freeze([...new Set(ENTRIES.filter(e => e.family).map(e => e.family))].sort());

module.exports = {ENTRIES, REGISTERED, FAMILIES, keyOf};
